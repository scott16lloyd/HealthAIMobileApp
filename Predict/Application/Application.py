import os
import pandas as pd
import numpy as np
import firebase_admin
from firebase_admin import credentials, db
import random
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import your prediction modules
import Colon
import Heart
import Lung


# Random seed for reproducibility
random_seed = 42  
random.seed(random_seed)
np.random.seed(random_seed)

GENDER_MAPPING = {"M": 0, "F": 1}

# Initialize Firebase
script_dir = os.path.dirname(os.path.abspath(__file__))
firebase_cred_path = os.path.join(script_dir, "healthai-40b47-firebase-adminsdk-6kz46-81ac2aa293.json")
cred = credentials.Certificate(firebase_cred_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://healthai-40b47-default-rtdb.europe-west1.firebasedatabase.app"
})

# Flask app initialization
app = Flask(__name__)
CORS(app)

# Train models and get resources
colon_model, colon_imputer, colon_train_columns = Colon.train_colon_cancer_model()
heart_model, heart_imputer, heart_train_columns = Heart.train_heart_disease_model()
lung_model, lung_imputer, lung_train_columns = Lung.train_lung_cancer_model()


def fetch_latest_patient_data(patient_id):
    try:
        ref = db.reference(f'patients/{patient_id}/medicalRecords')
        medical_records = ref.get()


        if medical_records:
            # Convert dates to datetime objects for sorting in dd-mm-yyyy format
            sorted_dates = sorted(
                [datetime.datetime.strptime(k, '%d-%m-%Y') for k in medical_records.keys()],
                reverse=True
            )
            if not sorted_dates:
                print(f"No medical records found for patient ID {patient_id}")
                return None

            # Get the latest date's record in dd-mm-yyyy format
            latest_date = sorted_dates[0].strftime('%d-%m-%Y')
            latest_record = medical_records.get(latest_date)
            if latest_record:
                return latest_record
            else:
                print(f"No record found for the latest date: {latest_date}")
                return None
        else:
            print(f"No medical records found for patient ID {patient_id}")
            return None
    except Exception as e:
        print(f"Error fetching patient data: {e}")
        return None


def generate_single_patient_data(model_type, patient_data, age, sex):

   
    # Extract patient attributes
    age = patient_data.get("Age", 21)
    sex = patient_data.get("gender")
    gender_numeric = GENDER_MAPPING.get(sex)


    # Extract values from the patient data
    alcohol = patient_data.get("Q2", 0)
    bowel_problems = patient_data.get("Q16", 0)
    diabetic = patient_data.get("Q4", 0)
    rectal_bleeding = patient_data.get("Q17", 0)
    smoking = patient_data.get("Q1", 0)
    stomach_cramps = patient_data.get("Q8", 0)
    tiredness = patient_data.get("Q5", 0)
    weight_loss = patient_data.get("Q6", 0)

    bp = patient_data.get("Q9", 0)
    chest_pain = patient_data.get("Q7", 0)
    cholesterol = patient_data.get("Q11", 0)
    max_hr = patient_data.get("Q10", 0)

    chronic_disease = patient_data.get("Q3", 0)
    coughing = patient_data.get("Q14", 0)
    fatigue_lung = patient_data.get("Q5", 0)
    shortness_of_breath = patient_data.get("Q15", 0)
    swallowing_difficulty = patient_data.get("Q12", 0)
    wheezing = patient_data.get("Q13", 0)
    yellow_fingers = patient_data.get("Q12", 0)

    # Create patient data based on model type
    if model_type == 'colon':
        return {
            'Age': age,
            'Sex': gender_numeric,
            'Alcohol': alcohol,
            'Bowel Problems': bowel_problems,
            'Diabetic': diabetic,
            'Rectal Bleeding': rectal_bleeding,
            'Smoking': smoking,
            'Stomach Cramps': stomach_cramps,
            'Tiredness': tiredness,
            'Weight Loss': weight_loss,
        }
    elif model_type == 'heart':
        return {
            'Age': age,
            'Sex': gender_numeric,
            'BP': bp,
            'Chest pain type': chest_pain,
            'Cholesterol': cholesterol,
            'Max HR': max_hr,
        }
    elif model_type == 'lung':
        return {
            'AGE': age,
            'GENDER': gender_numeric,
            'ALCOHOL CONSUMING': alcohol,
            'CHEST PAIN': chest_pain,
            'CHRONIC DISEASE': chronic_disease,
            'COUGHING': coughing,
            'FATIGUE': fatigue_lung,
            'SHORTNESS OF BREATH': shortness_of_breath,
            'SWALLOWING DIFFICULTY': swallowing_difficulty,
            'SMOKING': smoking,
            'WHEEZING': wheezing,
            'YELLOW_FINGERS': yellow_fingers,
        }
    else:
        raise ValueError(f"Invalid model_type: {model_type}")
    

    

def add_predict_info_to_firebase(predict_info, uid):
    current_date = datetime.datetime.now().strftime("%d-%m-%Y")
    patients_ref = db.reference(f'patients/{uid}/testResults/{current_date}')
    patients_ref.update(predict_info)


# Flask route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_uuid = data.get('user_uuid')

    if not user_uuid:
        return jsonify({'error': 'User UUID is required'}), 400

    # Fetch patient's age and gender
    patient_ref = db.reference(f'patients/{user_uuid}')
    patient_info = patient_ref.get()
    if patient_info:
        patient_age = patient_info.get("Age")
        patient_gender = patient_info.get("gender")
    else:
        return jsonify({'error': 'Patient info not found'}), 404

    latest_patient_data = fetch_latest_patient_data(user_uuid)

    if not latest_patient_data:
        return jsonify({'error': 'No patient data found'}), 404

    # Prediction logic for each model
    patient_data_colon = generate_single_patient_data('colon', latest_patient_data, patient_age, patient_gender)
    colon_result, colon_probability = Colon.predict_colon_cancer(
        pd.DataFrame([patient_data_colon]),
        colon_model,
        colon_imputer,
        GENDER_MAPPING,
        colon_train_columns
    )

    patient_data_heart = generate_single_patient_data('heart', latest_patient_data, patient_age, patient_gender)
    heart_result, heart_probability = Heart.predict_heart_disease(
        pd.DataFrame([patient_data_heart]),
        heart_model,
        heart_imputer,
        GENDER_MAPPING,
        heart_train_columns
    )

    patient_data_lung = generate_single_patient_data('lung', latest_patient_data, patient_age, patient_gender)
    lung_result, lung_probability = Lung.predict_lung_cancer(
        pd.DataFrame([patient_data_lung]),
        lung_model,
        lung_imputer,
        GENDER_MAPPING
    )

    # Compile the prediction results
    predict_info = {
        'colonResult': int(colon_probability[0] * 100),
        'heartResult': int(heart_probability[0] * 100),
        'lungResult': int(lung_probability[0] * 100)
    }

    # Update Firebase with the prediction results
    add_predict_info_to_firebase(predict_info, user_uuid)

    return jsonify(predict_info)

if __name__ == '__main__':
    app.run(debug=True)

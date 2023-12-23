import os
import pandas as pd
import numpy as np
import firebase_admin
from firebase_admin import credentials, db
import random

random_seed = 42  
random.seed(random_seed)
np.random.seed(random_seed)

import Colon
import Heart
import Lung

GENDER_MAPPING = {"M": 0, "F": 1}

#Get the current directory of the script
script_dir = os.path.dirname(os.path.abspath(__file__))

#Construct the path to the service account key file
path = os.path.join(script_dir, "healthai-40b47-firebase-adminsdk-6kz46-81ac2aa293.json")

#Use the constructed path for Firebase initialization
cred = credentials.Certificate(path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://healthai-40b47-default-rtdb.europe-west1.firebasedatabase.app"}
    )

def fetch_patient_data(patient_id):
    try:
        #Get the patient entity
        ref = db.reference(f'patients/{patient_id}')
        patient_data = ref.get()

        if patient_data:
            print("Patient Data Fetched:")
            print(patient_data)
            medical_records = patient_data.get("medicalRecords", [])
            if medical_records:
                latest_submission = max(medical_records, key=lambda x: x.get("timestamp", 0))
                return latest_submission
            else:
                print(f"Debug: No medical records found for patient ID {patient_id}")
                return None
        else:
            print(f"Debug: Patient Entity does not exist for ID {patient_id}")
            return None
    except Exception as e:
        print(f"Error fetching patient data: {e}")
        return None

def generate_single_patient_data(model_type, user_uuid):
    #Fetch user data from patients table using UUID
    user_ref = db.reference(f'patients/{user_uuid}')
    user_data = user_ref.get()

    if not user_data:
        raise ValueError(f"Patient not found for UUID: {user_uuid}")

    #Extract patient attributes
    age = user_data.get("Age")
    sex = user_data.get("gender")
    
    #Extract medical records from the list
    medical_records = user_data.get("medicalRecords", [])

    if not medical_records:
        raise ValueError(f"No medical records found for UUID: {user_uuid}")

    #Get the medical record with the highest index ID
    latest_record = max(medical_records, key=lambda x: x.get("id", 0))

    #Extract values from the latest medical record
    alcohol = latest_record.get("Q2", 0)
    bowel_problems = latest_record.get("Q16", 0)
    diabetic = latest_record.get("Q4", 0)
    rectal_bleeding = latest_record.get("Q17", 0)
    smoking = latest_record.get("Q1", 0)
    stomach_cramps = latest_record.get("Q11", 0)
    tiredness = latest_record.get("Q5", 0)
    weight_loss = latest_record.get("Q6", 0)

    bp = latest_record.get("Q7", 0)
    chest_pain = latest_record.get("Q10", 0)
    cholesterol = latest_record.get("Q9", 0)
    max_hr = latest_record.get("Q8", 0)

    chronic_disease = latest_record.get("Q3", 0)
    coughing = latest_record.get("Q14", 0)
    fatigue_lung = latest_record.get("Q5", 0)
    shortness_of_breath = latest_record.get("Q15", 0)
    swallowing_difficulty = latest_record.get("Q12", 0)
    wheezing = latest_record.get("Q13", 0)
    yellow_fingers = latest_record.get("Q12", 0)

    #Create patient data based on model type
    if model_type == 'colon':
        return {
            'Age': age,
            'Sex': GENDER_MAPPING.get(sex, 0),
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
            'Sex': GENDER_MAPPING.get(sex, 0),
            'BP': bp,
            'Chest pain type': chest_pain,
            'Cholesterol': cholesterol,
            'Max HR': max_hr,
        }
    
    elif model_type == 'lung':
        return {
            'AGE': age,
            'GENDER': GENDER_MAPPING.get(sex, 0),
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

    
    
if __name__ == "__main__":
    user_uuid = "al5gO6mkgdZWlR9XqtdMInLHwvl2"

    #Generate patient data for colon model
    single_patient_data_colon = generate_single_patient_data('colon', user_uuid)

    #Train the colon cancer model
    colon_model, colon_imputer, train_columns_colon = Colon.train_colon_cancer_model()

    print("Input Data for Colon Prediction:")
    print(pd.DataFrame([single_patient_data_colon]))

    #Predict colon cancer
    colon_result, colon_probability = Colon.predict_colon_cancer(
        pd.DataFrame([single_patient_data_colon]), colon_model, colon_imputer, GENDER_MAPPING, train_columns_colon
    )

    #Print results with risk percentage
    print("\nColon Cancer Data:")
    #print("Colon Result (Probability of Positive Class):", colon_result[0])
    print("Colon Risk Percentage:", int(colon_probability[0] * 100))

    #Generate patient data for heart model
    single_patient_data_heart = generate_single_patient_data('heart', user_uuid)

    #Train the heart disease model
    heart_model, heart_imputer, train_columns_heart = Heart.train_heart_disease_model()

    print("\nInput Data for Heart Disease Prediction:")
    print(pd.DataFrame([single_patient_data_heart]))

    #Predict heart disease
    heart_result, heart_probability = Heart.predict_heart_disease(
        pd.DataFrame([single_patient_data_heart]), heart_model, heart_imputer, GENDER_MAPPING, train_columns_heart
    )

    #Print results with risk percentage
    print("\nHeart Disease Data:")
    print("Heart Risk Percentage:", int(heart_probability[0] * 100))

    #Generate patient data for lung model
    single_patient_data_lung = generate_single_patient_data('lung', user_uuid)

    #Train the lung cancer model
    lung_model, lung_imputer, train_columns_lung = Lung.train_lung_cancer_model()

    print("\nInput Data for Lung Prediction:")
    print(pd.DataFrame([single_patient_data_lung]))

    #Predict lung cancer
    lung_result, lung_probability = Lung.predict_lung_cancer(
        pd.DataFrame([single_patient_data_lung]), lung_model, lung_imputer, GENDER_MAPPING
    )

    #Print results with risk percentage
    print("\nLung Cancer Data:")
    #print("Lung Result (Probability of Positive Class):", lung_result[0])
    print("Lung Risk Percentage:", int(lung_probability[0] * 100))

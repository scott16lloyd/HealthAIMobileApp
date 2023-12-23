import pyrebase
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer

config = {
  "apiKey": "AIzaSyAHFVjJjJeM_Soz2lsJOEIwSBiLWOS_RY0",
  "authDomain": "healthai-40b47.firebaseapp.com",
  "databaseURL": "https://healthai-40b47-default-rtdb.europe-west1.firebasedatabase.app",
  "projectId": "healthai-40b47",
  "storageBucket": "healthai-40b47.appspot.com",
  "messagingSenderId": "493505764604",
  "appId": "1:493505764604:web:2decb83a82f453f0398b79",
  "measurementId": "G-YDS75RSZME"
}

firebase = pyrebase.initialize_app(config)
database = firebase.database()


lung_cancer_data = database.child("LungCancer").get().val()


#Making a pandas Dataframe from database
lung_cancer_df = pd.DataFrame.from_dict(lung_cancer_data)

#Changing character answers to int answers
lung_cancer_df['GENDER'] = lung_cancer_df['GENDER'].map({'M': 0, 'F': 1})
lung_cancer_df['LUNG_CANCER'] = lung_cancer_df['LUNG_CANCER'].map({'NO': 0, 'YES': 1})


X = lung_cancer_df.drop('LUNG_CANCER', axis=1)
y = lung_cancer_df['LUNG_CANCER']  

#Handle missing values - by adding values based on the mean
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)



#Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.3, random_state=42)




#Create and training the model
model = RandomForestClassifier()
model.fit(X_train, y_train)


y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("Model training successful")


#Making a test patient with random data
age = np.random.randint(30, 80)
gender = np.random.choice(['M', 'F'])
alcohol_consuming = np.random.randint(0, 2)
chest_pain = np.random.randint(0, 2)
chronic_disease = np.random.randint(0, 2)
coughing = np.random.randint(0, 2)
fatigue = np.random.randint(0, 2)
smoking = np.random.randint(0, 2)
swallowing_difficulty = np.random.randint(0, 2)
wheezing = np.random.randint(0, 2)
yellow_fingers = np.random.randint(0, 2)

#Creating a patient
patient_data = {
    'AGE': age,
    'GENDER': gender,
    'ALCOHOL_CONSUMING': alcohol_consuming,
    'CHEST_PAIN': chest_pain,
    'CHRONIC_DISEASE': chronic_disease,
    'COUGHING': coughing,
    'FATIGUE': fatigue,
    'SMOKING': smoking,
    'SWALLOWING_DIFFICULTY': swallowing_difficulty,
    'WHEEZING': wheezing,
    'YELLOW_FINGERS': yellow_fingers,
    'LUNG_CANCER': -1  #Placeholder value for undiagnosed patients
}

#Making dataframe for Patient
patient_df = pd.DataFrame([patient_data])

#Converting data
patient_df['GENDER'] = patient_df['GENDER'].map({'M': 0, 'F': 1})

#Predictions
patient_prediction = model.predict(patient_df)
patient_probability = model.predict_proba(patient_df)

if patient_prediction[0] == 1:
    result = "High risk - Risk of Lung Cancer: {:.2f}%.".format(patient_probability[0][1] * 100)
else:
    result = "Low risk - Risk of Lung Cancer: {:.2f}%.".format(patient_probability[0][1] * 100)


print("\nPatient Data:")
print(patient_df)
print("\nPrediction:", result)



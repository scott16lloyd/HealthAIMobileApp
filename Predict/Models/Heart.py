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


heart_disease_data = database.child("HeartDisease").get().val()
#Create a DataFrame
heart_disease_df = pd.DataFrame.from_dict(heart_disease_data)

#Map character values to integers
heart_disease_df['Sex'] = heart_disease_df['Sex'].map({'M': 0, 'F': 1})

#Defining features and targets
X = heart_disease_df[['Age', 'BP', 'Chest pain type', 'Cholesterol', 'Max HR', 'Sex']]
y = heart_disease_df['Heart Disease']

#Handle missing values by imputing them with the mean
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)

#Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.3, random_state=42)

#Create and train the RandomForestClassifier model
model = RandomForestClassifier()
model.fit(X_train, y_train)

#Make predictions on the test data
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("Model training successful")

# Generate random data for a test patient
age = np.random.randint(30, 80)
sex = np.random.choice(['M', 'F'])
bp = np.random.randint(80, 200)
chest_pain_type = np.random.choice([0, 1])
cholesterol = np.random.randint(100, 300)
max_hr = np.random.randint(60, 220)

# Create patient data
patient_data = {
    'Age': age,
    'BP': bp,
    'Chest Pain Type': chest_pain_type,
    'Cholesterol': cholesterol,
    'Max HR': max_hr,
    'Sex': sex,
}

patient_df = pd.DataFrame([patient_data])

# Map character values to integers in the patient DataFrame
patient_df['Sex'] = patient_df['Sex'].map({'M': 0, 'F': 1})

# Make predictions for the test patient
patient_prediction = model.predict(patient_df)
patient_probability = model.predict_proba(patient_df)

if patient_prediction[0] == 1:
    result = "High risk - Risk of Heart Disease: {:.2f}%.".format(patient_probability[0][1] * 100)
else:
    result = "Low risk - Risk of Heart Disease: {:.2f}%.".format(patient_probability[0][0] * 100)

print("\nPatient Data:")
print(patient_df)
print("\nPrediction:", result)
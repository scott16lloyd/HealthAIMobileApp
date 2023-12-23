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

colon_cancer_data = database.child("ColonCancer").get().val()

colon_cancer_df = pd.DataFrame.from_dict(colon_cancer_data)


colon_cancer_df['Sex'] = colon_cancer_df['Sex'].map({'M': 0, 'F': 1})
colon_cancer_df['Colon Cancer'] = colon_cancer_df['Colon Cancer'].map({'NO': 0, 'YES': 1})

X = colon_cancer_df.drop('Colon Cancer', axis=1)
y = colon_cancer_df['Colon Cancer']



imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)



X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.3, random_state=42)



model = RandomForestClassifier()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("Model training successful")

# Making a test patient with random data
age = np.random.randint(30, 80)
sex = np.random.choice(['M', 'F'])
alcohol = np.random.randint(0, 2)
bowel_problems = np.random.randint(0, 2)
diabetic = np.random.randint(0, 2)
rectal_bleeding = np.random.randint(0, 2)
smoking = np.random.randint(0, 2)
stomach_cramps = np.random.randint(0, 2)
tiredness = np.random.randint(0, 2)
weight_loss = np.random.randint(0, 2)

# Creating a patient without the "Colon Cancer" feature
patient_data = {
    'Age': age,
    'Sex': sex,
    'Alcohol': alcohol,
    'Bowel Problems': bowel_problems,
    'Diabetic': diabetic,
    'Rectal Bleeding': rectal_bleeding,
    'Smoking': smoking,
    'Stomach Cramps': stomach_cramps,
    'Tiredness': tiredness,
    'Weight Loss': weight_loss
}

# Making a DataFrame for the patient
patient_df = pd.DataFrame([patient_data])

patient_df['Sex'] = patient_df['Sex'].map({'M': 0, 'F': 1})


patient_prediction = model.predict(patient_df)
patient_probability = model.predict_proba(patient_df)

if patient_prediction[0] == 1:
    result = "High risk - Risk of Colon Cancer: {:.2f}%.".format(patient_probability[0][1] * 100)
else:
    result = "Low risk - Risk of Colon Cancer: {:.2f}%.".format(patient_probability[0][1] * 100)

print("\nPatient Data:")
print(patient_df)
print("\nPrediction:", result)
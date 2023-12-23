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


def train_colon_cancer_model():
    firebase = pyrebase.initialize_app(config)
    database = firebase.database()

    colon_cancer_data = database.child("ColonCancer").get().val()
    colon_cancer_df = pd.DataFrame.from_dict(colon_cancer_data)

    # Map categorical values to numeric
    colon_cancer_df['Sex'] = colon_cancer_df['Sex'].map({'M': 0, 'F': 1})
    colon_cancer_df['Colon Cancer'] = colon_cancer_df['Colon Cancer'].map({'NO': 0, 'YES': 1})

    X = colon_cancer_df.drop('Colon Cancer', axis=1)
    y = colon_cancer_df['Colon Cancer']

    # Impute missing values with the mean
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)

    # Train the model
    model = RandomForestClassifier()
    model.fit(X_imputed, y)

    #print("Colon Accuracy:", model.score(X_imputed, y))
    #print("Colon Model training successful")

    return model, imputer, list(X.columns)

def predict_colon_cancer(data, model, imputer, gender_mapping, train_columns):
    # Map categorical values to numeric
    data['Sex'] = data['Sex'].map(gender_mapping)

    # Reorder columns to match the order during training
    data = data[train_columns]

    # Impute missing values using the imputer for numeric values
    X_imputed = imputer.transform(data)

    # Predict and get probabilities
    prediction = model.predict(X_imputed)
    probability = model.predict_proba(X_imputed)[:, 1]  # Take the probability of the positive class (1)

    return prediction, probability
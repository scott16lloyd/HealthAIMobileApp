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

# Define train_columns at the module level
train_columns = []

def train_lung_cancer_model():
    global train_columns  # Use the global train_columns variable

    firebase = pyrebase.initialize_app(config)
    database = firebase.database()

    lung_cancer_data = database.child("LungCancer").get().val()
    lung_cancer_df = pd.DataFrame.from_dict(lung_cancer_data)

    lung_cancer_df['GENDER'] = lung_cancer_df['GENDER'].map({'M': 0, 'F': 1})
    lung_cancer_df['LUNG_CANCER'] = lung_cancer_df['LUNG_CANCER'].map({'NO': 0, 'YES': 1})

    X = lung_cancer_df.drop('LUNG_CANCER', axis=1)
    y = lung_cancer_df['LUNG_CANCER']

    # Impute missing values with the mean
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)

    # Store the order of columns used during training
    train_columns = list(X.columns)

    X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.3, random_state=42)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    #print("Lung Accuracy:", accuracy)
    #print("Lung Model training successful")

    return model, imputer, train_columns

def predict_lung_cancer(data, model, imputer, gender_mapping):
    global train_columns  # Use the global train_columns variable

    # Convert column names to uppercase
    data.columns = data.columns.str.upper()

    # Exclude LUNG_CANCER from features
    X = data.drop('LUNG_CANCER', axis=1, errors='ignore')  # Use errors='ignore' to handle the case where 'LUNG_CANCER' is not present

    # Map categorical values to numeric
    X['GENDER'] = X['GENDER'].map(gender_mapping)

    # Ensure columns are in the same order as during training
    X = X[train_columns]

    # Impute missing values using the imputer for numeric values
    X_imputed = imputer.transform(X)

    # Predict and get probabilities
    prediction = model.predict(X_imputed)
    probability = model.predict_proba(X_imputed)[:, 1]  # Take the probability of the positive class (1)

    return prediction, probability

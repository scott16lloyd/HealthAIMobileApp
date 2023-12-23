import pyrebase
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
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

def train_heart_disease_model():
    firebase = pyrebase.initialize_app(config)
    database = firebase.database()

    heart_disease_data = database.child("HeartDisease").get().val()
    heart_disease_df = pd.DataFrame.from_dict(heart_disease_data)

    # Map categorical values to numeric
    heart_disease_df['Sex'] = heart_disease_df['Sex'].map({'M': 0, 'F': 1})
    heart_disease_df['Heart Disease'] = heart_disease_df['Heart Disease'].map({'NO': 0, 'YES': 1})

    X = heart_disease_df.drop('Heart Disease', axis=1)
    y = heart_disease_df['Heart Disease']

    # Exclude non-numeric columns from imputation
    numeric_columns = X.select_dtypes(include=['number'])
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(numeric_columns)

    model = RandomForestClassifier()
    model.fit(X_imputed, y)

    #print("Heart Accuracy:", model.score(X_imputed, y))
    #print("Heart Model training successful")

    return model, imputer, list(X.columns)

def predict_heart_disease(data, model, imputer, gender_mapping, train_columns):
    # Map categorical values to numeric
    data['Sex'] = data['Sex'].map(gender_mapping)

    # Reorder columns to match the order during training
    data = data[train_columns]

    # Exclude non-numeric columns from imputation
    numeric_columns = data.select_dtypes(include=['number'])

    # Impute missing values using the imputer for numeric values
    numeric_columns_imputed = imputer.transform(numeric_columns)

    # Predict and get probabilities
    prediction = model.predict(numeric_columns_imputed)
    probability = model.predict_proba(numeric_columns_imputed)[:, 1]  # Take the probability of the positive class (1)

    return prediction, probability

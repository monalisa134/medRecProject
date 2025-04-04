from flask import Flask, request, jsonify
import joblib
import openai
import pandas as pd

app = Flask(__name__)

# Load the trained model and dataset
disease_model = joblib.load("final_model.pkl")  # Ensure model.pkl exists
symptom_data = pd.read_csv("symtoms_df.csv")  # Load symptom mapping data

# OpenAI API Key (Ensure to set this securely in production)
openai.api_key = "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"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    symptoms = data.get("symptoms", [])
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400
    
    # Convert symptoms to model input format
    input_data = [1 if symptom in symptoms else 0 for symptom in symptom_data.columns]
    disease = disease_model.predict([input_data])[0]
    
    return jsonify({"disease": disease})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Ensure correct model version
        messages=[{"role": "user", "content": user_message}]
    )
    
    return jsonify({"response": response["choices"][0]["message"]["content"]})

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify
import joblib
import pandas as pd
import warnings

warnings.filterwarnings('ignore', category=UserWarning)


app = Flask(__name__)

# 1. load the model
artifacts = joblib.load("models/craigslist_engine.joblib")

web_kmeans = artifacts['kmeans']
web_encoder = artifacts['encoder']
web_models = artifacts['neighborhood_models']
web_routing_features = artifacts['routing_features']
web_categorical_features = artifacts['categorical_features']
web_all_features = artifacts['all_features']

@app.route('/api/predict_price', methods=['POST'])
def predict_price():
    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({'error': 'No input data provided.'}), 400

    try:
        raw_input = pd.DataFrame([data], columns=web_all_features)

        for col in web_categorical_features:
            if col in raw_input.columns:
                raw_input[col] = raw_input[col].fillna('unknown').astype(str).str.lower()

        for col in web_routing_features:
            if col in raw_input.columns:
                raw_input[col] = pd.to_numeric(raw_input[col], errors='coerce').fillna(0)

        raw_input[web_categorical_features] = web_encoder.transform(raw_input[web_categorical_features])
        raw_input = raw_input[web_all_features]

        assigned_clusters = web_kmeans.predict(raw_input[web_routing_features])[0]
        selected_expert_model = web_models[assigned_clusters]
        predicted_price = selected_expert_model.predict(raw_input)[0]

        return jsonify({'estimated_price': float(predicted_price)})
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


if __name__ == '__main__':
    print("Starting the server...")
    app.run(debug=True)
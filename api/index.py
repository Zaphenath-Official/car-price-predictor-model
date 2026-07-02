from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import warnings
import os


warnings.filterwarnings('ignore', category=UserWarning)


app = Flask(__name__)
CORS(app)

VALID_VEHICLE_COMBINATIONS = {
    'gmc': ['sierra 1500', 'terrain', 'yukon', 'acadia', 'canyon'],
    'chevrolet': ['silverado 1500', 'camaro', 'malibu', 'equinox', 'impala', 'corvette', 'traverse', 'cruze'],
    'toyota': ['camry', 'corolla', 'rav4', 'highlander', 'prius', 'tacoma', '4runner', 'sienna', 'avalon'],
    'ford': ['f-150', 'mustang', 'escape', 'focus', 'explorer', 'bronco', 'fusion', 'edge', 'expedition'],
    'jeep': ['wrangler', 'grand cherokee', 'cherokee', 'compass', 'renegade', 'gladiator'],
    'nissan': ['altima', 'sentra', 'rogue', 'pathfinder', 'maxima', 'frontier', 'murano', 'versa'],
    'ram': ['1500', '2500', '3500', 'promaster'],
    'mazda': ['mazda3', 'mazda6', 'cx-5', 'cx-9', 'miata'],
    'cadillac': ['cts', 'escalade', 'xt5', 'xt4', 'ct5'],
    'honda': ['civic', 'accord', 'cr-v', 'pilot', 'odyssey', 'fit', 'hr-v'],
    'dodge': ['charger', 'challenger', 'durango', 'journey', 'grand caravan'],
    'lexus': ['es', 'is', 'rx', 'gx', 'nx', 'ls'],
    'jaguar': ['xe', 'xf', 'f-pace', 'e-pace', 'f-type'],
    'buick': ['encore', 'enclave', 'regal', 'cascade', 'verano'],
    'chrysler': ['300', 'pacifica', 'voyager', 'pt cruiser'],
    'volvo': ['s60', 'v60', 'xc40', 'xc60', 'xc90'],
    'audi': ['a3', 'a4', 'a6', 'q3', 'q5', 'q7'],
    'infiniti': ['q50', 'q60', 'qx50', 'qx60', 'qx80'],
    'lincoln': ['mkz', 'corsair', 'navigator', 'nautilus', 'mkc'],
    'alfa-romeo': ['giulia', 'stelvio', '4c'],
    'subaru': ['impreza', 'outback', 'forester', 'legacy', 'crosstrek'],
    'acura': ['integra', 'tlx', 'mdx', 'rdx', 'ilx'],
    'hyundai': ['elantra', 'sonata', 'tucson', 'santa fe', 'kona'],
    'mercedes-benz': ['c-class', 'e-class', 's-class', 'gle', 'glc', 'cla'],
    'bmw': ['3 series', '5 series', 'x3', 'x5', 'm4'],
    'mitsubishi': ['lancer', 'outlander', 'mirage', 'eclipse cross'],
    'volkswagen': ['golf', 'jetta', 'tiguan', 'atlas', 'passat'],
    'porsche': ['911', 'cayenne', 'panthera', 'boxster', 'macan'],
    'kia': ['soul', 'sportage', 'sorento', 'forte', 'telluride'],
    'rover': ['75', '200', '400'],
    'ferrari': ['488', 'f8', 'roma', 'sf90'],
    'mini': ['cooper', 'countryman', 'clubman'],
    'pontiac': ['gto', 'grand prix', 'bonneville'],
    'fiat': ['500', '500x', 'panda'],
    'tesla': ['model 3', 'model s', 'model x', 'model y'],
    'saturn': ['ion', 'vue', 'astra'],
    'mercury': ['grand marquis', 'mountaineer', 'milan'],
    'harley-davidson': ['sportster', 'street glide', 'road king'],
    'datsun': ['240z', '280z', 'sentra'],
    'aston-martin': ['db11', 'vantage', 'dbx'],
    'land rover': ['range rover', 'discovery', 'defender', 'evoque'],
    'morgan': ['4/4', 'plus 4', 'plus 8'],
}

VALID_TYPE_SIZE_COMBINATIONS = {
    'sedan': ['compact', 'mid-size', 'full-size'],
    'suv': ['compact', 'mid-size', 'full-size'],
    'truck': ['mid-size', 'full-size'],
    'coupe': ['compact', 'mid-size'],
    'hatchback': ['compact', 'mid-size'],
    'wagon': ['mid-size', 'full-size'],
    'van': ['full-size'],
}


def validate_vehicle_combination(payload):
    manufacturer = str(payload.get('manufacturer', '') or '').strip().lower()
    model = str(payload.get('model', '') or '').strip().lower()
    size = str(payload.get('size', '') or '').strip().lower()
    vehicle_type = str(payload.get('type', '') or '').strip().lower()

    if not manufacturer:
        return 'Manufacturer is required.'

    if not model:
        return 'Model is required.'

    supported_models = VALID_VEHICLE_COMBINATIONS.get(manufacturer, [])
    if not supported_models:
        return f"There is no such car combination for manufacturer '{manufacturer}'."

    if model not in [item.lower() for item in supported_models]:
        return f"There is no such car combination for {manufacturer} {model}."

    if vehicle_type not in VALID_TYPE_SIZE_COMBINATIONS:
        return f"There is no such car combination for {vehicle_type} in {size} size."

    if size not in VALID_TYPE_SIZE_COMBINATIONS[vehicle_type]:
        return f"There is no such car combination for {vehicle_type} in {size} size."

    return None


# 1. load the model
model_url = "https://docs.google.com/uc?export=download&id=1jv5knJ6zorjedIgXBL-z1zB7ZLXaYa-U"


@app.route('/api/predict_price', methods=['POST'])
def predict_price():
    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({'error': 'No input data provided.'}), 400

    validation_error = validate_vehicle_combination(data)
    if validation_error:
        return jsonify({'error': validation_error}), 400

    try:
        current_dir = os.path.dirname(__file__)
        model_path = os.path.join(current_dir, 'models', 'craigslist_engine.joblib')
        artifacts = joblib.load(model_path)

    except Exception as exc:
        return jsonify({'error': str(f"Failed to load model: {exc}")}), 500
    
    try:
        web_kmeans = artifacts['kmeans']
        web_encoder = artifacts['encoder']
        web_models = artifacts['neighborhood_models']
        web_routing_features = artifacts['routing_features']
        web_categorical_features = artifacts['categorical_features']
        web_all_features = artifacts['all_features']
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
        return jsonify({'error': str("Failed to make prediction.")}), 500


if __name__ == '__main__':
    print("Starting the server...")
    app.run(debug=True)
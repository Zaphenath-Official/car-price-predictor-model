# Car Price Predictor — Forecast used car prices with AI

![Hero image](app/public/hero.png)

A sleek, easy-to-use web app that forecasts used car prices using historical market data and predictive modeling. Built for buyers, sellers, and analysts who want fast, explainable price estimates and actionable insights in one place.

Try the live app: https://car-price-predictor-model.vercel.app

## Live demo / 1‑minute walkthrough

<!-- Demo video placeholder: replace /app/public/demo.mp4 with your 1-minute video -->

<video controls width="720">
  <source src="app/public/demo.mp4" type="video/mp4">
  Your browser does not support the video tag. Add a file at `app/public/demo.mp4` (1 minute) to enable this demo here.
</video>

> Tip: For Vercel deployments, upload the video to `app/public/demo.mp4` before deploying so the embedded player loads the file from the same origin. You can also link directly to the live app above.

## Why this matters

Used car markets move fast — small shifts in demand, mileage trends, or model-year popularity change prices significantly. This app combines curated historical datasets, feature engineering, and a compact prediction API so you can get reliable price estimates in seconds.

## Highlights

- Fast, interactive React + Vite frontend with a clean UI for entering vehicle details
- Python prediction API (Flask) that serves the trained model
- End-to-end notebook for data cleaning, feature engineering, and model training (Jupyter)
- Lightweight model files stored in api/models for quick inference
- Easy to deploy on Vercel + serverless functions or any Python host

## Quick architecture

- app/ — React frontend (Vite)
  - src/ — UI components and app entry (App.jsx, main.jsx)
  - public/ — static assets; drop demo.mp4 here to enable the 1-minute walkthrough
- api/ — Python API and model training
  - index.py — prediction API server
  - model_training.ipynb — notebook with data preparation and model training steps
  - models/ — trained model artifacts
  - requirements.txt — Python dependencies

## Run locally (fastest path)

1. Frontend

```bash
cd app
npm ci
npm run dev
```

2. API (example using a virtualenv)

```bash
cd api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Run the prediction API (if index.py uses Flask/FastAPI)
python index.py
```

Open the frontend at http://localhost:5173 and point it to the API URL in the UI settings (if required).

## Model training

The training notebook api/model_training.ipynb documents the dataset, preprocessing steps, feature importance, cross-validation results, and how to export the final model into api/models. Inspect it to reproduce or update the model.

## Embedding a 1-minute walkthrough

To show a short demo directly in the README or on the deployed site:

- Add your 1-minute MP4 as `app/public/demo.mp4`.
- The HTML video tag above will automatically show a playback widget on GitHub Pages and most static hosts.
- If you prefer an animated GIF or thumbnail, add `app/public/demo-thumb.gif` and update the README to show it with a link to the full video.

## Tech stack

- Languages: JavaScript (React) frontend, Python backend, Jupyter notebooks for training
- Frontend: React + Vite
- Backend: Lightweight Python web server (api/index.py)

## Files of interest

- app/src/App.jsx — main UI and form for entering vehicle data
- api/index.py — server endpoints for price prediction
- api/model_training.ipynb — end-to-end training & export
- app/public/demo.mp4 — demo placeholder (add your 1-min video here)

## Contributing

Contributions, bug reports, and improvements are welcome. Please open issues or PRs with clear descriptions and, where applicable, reproducible steps and sample data.

## License

Add your project license here.

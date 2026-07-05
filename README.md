# 🚗 High-Dimensional Craigslist Vehicle Valuation Engine

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)](https://www.python.org)
[![Framework](https://img.shields.io/badge/Backend-Flask%20%2F%20FastAPI-orange?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)

An autonomous, distributed machine learning microservice that accurately estimates the fair market price of used vehicles. By leveraging a custom **Mixture-of-Experts (MoE)** routing topology, this platform achieves an internal accuracy threshold of **~89%** over high-cardinality, chaotic automotive marketplace datasets.

---

## 📺 Application Demonstration

[https://github.com/user-attachments/assets/ebc03f12-5226-42f5-a043-ba7509d15632](https://github.com/user-attachments/assets/ebc03f12-5226-42f5-a043-ba7509d15632)

---

## 🚀 Live Interactive Link

Want to test the pipeline live with custom metrics? Click the launch button below to submit a live payload vector directly through the production gateway deployed on Vercel:

[![Launch Web Application](https://img.shields.io/badge/%F0%9F%9A%80_Launch_App_On_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://car-price-predictor-model.vercel.app/)

---

## 🛠️ System Architecture Under the Hood

The engine transitions away from standard single-model heuristics by breaking the calculation pipeline into an interconnected, serialized state matrix.

```text
       [ Raw User Input Vector ]
                   │
                   ▼
       ┌───────────────────────┐
       │ Categorical Encoder   │ ──► Drops string cardinality
       └───────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │   3D Spatial Router   │ ──► Age, Mileage, Latitude
       │      (K-Means)        │
       └───────────────────────┘
         /    │    │    │    \
        ▼     ▼    ▼    ▼     ▼
      [E-0] [E-1] [E-2] [E-3] [E-4] ... [10 Specialized Experts]
```
### 1. Low-Memory Streaming Pipe
Traditional parsing fails on multi-gigabyte files due to RAM allocation caps. This pipeline implements string-indexed segment streams using structured `usecols` filters, dropping the data loading memory overhead footprint by over 90% during training.

### 2. High-Cardinality String Mapping
Categorical matrices are handled via dynamic integer ordinal scaling. Built-in out-of-bounds safety parameters (`handle_unknown='use_encoded_value'`) safeguard the application context against un-indexed text inputs coming from public frontend form components.

### 3. Spatial Routing & Specialized Estimators
* **The Traffic Router:** A geometric `KMeans` engine slices the continuous physical dimensions (location coordinates, lifespan metrics, wear intervals) into 10 distinct thematic sub-markets.
* **The Expert Clusters:** Instead of relying on a singular estimator, the request is delegated to one of 10 isolated, highly-tuned `RandomForestRegressor` models matching that specific localized cluster profile. 

---

## 📦 API Payload Reference

To run a diagnostic hit through external testing platforms like Postman or Curl, issue a **POST** request to `/predict` using this JSON configuration structure:

```json
{
  "year": 2017,
  "odometer": 60000,
  "lat": 34.0522,
  "manufacturer": "ford",
  "model": "f-150",
  "condition": "good",
  "cylinders": "6 cylinders",
  "size": "full-size",
  "type": "truck",
  "state": "ca"
}
```
### Response Profile Matrix
```json
{
  "status": "success",
  "assigned_cluster": 3,
  "predicted_valuation": 24850.00
}
```
### 🗂️ Project Directory Topology
```text
── api/
│   ├── index.py                      # Main Vercel serverless application logic
│   └── models/
│       └── craigslist_engine.joblib # Serialized pipeline state dictionary 
├── requirements.txt                # Static production version locks
└── README.md                       # Platform documentation
```

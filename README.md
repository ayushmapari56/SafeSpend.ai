# SafeSpend.ai — Backend Production Engine

Autonomous Proactive Liquidity & Safe-to-Spend Protection API powered by **FastAPI**, **LangGraph**, and **Deterministic Mathematical Projection Formula Engine**.

---

## 🚀 Features

- **Mathematical Formula Core (`formula_engine.py`)**: Computes dynamic Safe-to-Spend ($S_{\text{safe}}(t)$), 14-day daily balance trajectories, and automatic buffer breach alerts.
- **LangGraph Agent Pipeline (`agent_workflow.py`)**: Orchestrates Observer $\rightarrow$ Predictor $\rightarrow$ Explainer $\rightarrow$ Intervener workflow with continuous feedback learning loops.
- **Dynamic Live Judge Sandbox (`/api/custom-event`)**: Real-time generic transaction feeder for live judge stress testing.
- **Telegram Sentinel Alerts (`telegram_service.py`)**: Instant automated push notifications when liquidity shortfalls are projected.

---

## 🛠️ Local Setup & Running

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- **API Documentation (Swagger UI)**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/health`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service status |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/state` | Query current baseline session state & projections |
| `POST` | `/api/inject-delay` | Inject 5-day stipend arrival delay ($P(\text{recv}) \rightarrow 0.2$) |
| `POST` | `/api/add-expense` | Inject ₹3,500 emergency shock debit |
| `POST` | `/api/custom-event` | Feed dynamic custom transaction (name, amount, type, day, probability) |
| `POST` | `/api/user-feedback` | Process feedback loop (`APPROVE` or `REJECT`) |
| `POST` | `/api/reset-demo` | Reset state to clean pristine baseline |

---

## 🌐 Deployment (Render / Railway / Fly.io / AWS)

- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Python Version**: `3.10+`
- **Build Command**: `pip install -r requirements.txt`

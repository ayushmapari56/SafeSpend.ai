# main.py
import copy
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from agent_workflow import agent_engine
from telegram_service import send_telegram_shortfall_alert, start_telegram_listener

app = FastAPI(title="Safespend.ai Production Engine")

# Enable CORS for React/Streamlit/Android clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initial Baseline Session State
INITIAL_SESSION = {
    "current_balance": 14250.0,
    "income_events": [
        {"name": "College Stipend", "amount": 10000.0, "probability": 1.0, "day": 5}
    ],
    "expense_events": [
        {"name": "Rent", "amount": 8000.0, "day": 7},
        {"name": "Wi-Fi & Mess", "amount": 2500.0, "day": 10}
    ],
    "safety_buffer": 2000.0,
    "user_preferences": {"rejected_cancellation": False, "is_ott_paused": False},
    "math_result": {},
    "explanation": "",
    "recommended_action": {},
    "is_ott_paused": False,
    "split_payment_active": False,
    "action_rejected": False,
    "last_action": None,
    "last_action_timestamp": 0,
    "version": 1
}

demo_session = copy.deepcopy(INITIAL_SESSION)


def process_telegram_feedback(action: str):
    """Callback triggered whenever user clicks APPROVE or REJECT in Telegram."""
    global demo_session
    print(f"⚡ [Main Engine] Handling Telegram Feedback Signal: {action}")
    
    if action == "REJECT":
        demo_session["user_preferences"]["rejected_cancellation"] = True
        demo_session["action_rejected"] = True
        demo_session["is_ott_paused"] = False
        demo_session["last_action"] = "REJECT"
        demo_session["last_action_timestamp"] = time.time()
    elif action == "APPROVE":
        # Resolve shock event upon approval & execute subscription pause safeguard
        demo_session["expense_events"] = [
            e for e in demo_session["expense_events"] if e["name"] != "Emergency Medical Shock"
        ]
        demo_session["is_ott_paused"] = True
        demo_session["action_rejected"] = False
        demo_session["user_preferences"]["is_ott_paused"] = True
        demo_session["last_action"] = "APPROVE"
        demo_session["last_action_timestamp"] = time.time()
        
    demo_session["version"] = demo_session.get("version", 0) + 1
    output = agent_engine.invoke(demo_session)
    demo_session.update(output)
    return get_current_state()


@app.on_event("startup")
def on_startup():
    """Start background Telegram event loop on server start."""
    start_telegram_listener(process_telegram_feedback)
    print("🚀 [SafeSpend.ai] FastAPI Engine & Telegram Interactive Listener active!")


class FeedbackModel(BaseModel):
    action: str  # "APPROVE" or "REJECT"


class CustomEventModel(BaseModel):
    name: str
    amount: float
    type: str  # "INCOME" or "EXPENSE"
    probability: float = 1.0
    day: int = 3


@app.get("/")
def root():
    return {
        "service": "Safespend.ai Production Engine",
        "status": "online",
        "docs_url": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/state")
def get_current_state():
    """Step 1: Baseline State Query."""
    output = agent_engine.invoke(demo_session)
    
    stipend_prob = demo_session.get("income_events", [{}])[0].get("probability", 1.0)
    income_delay_days = 5 if stipend_prob < 1.0 else 0
    expense_shock_amount = sum(
        e.get("amount", 0) for e in demo_session.get("expense_events", [])
        if e.get("name") == "Emergency Medical Shock"
    )

    return {
        **output,
        "is_ott_paused": demo_session.get("is_ott_paused", False),
        "split_payment_active": demo_session.get("split_payment_active", False),
        "action_rejected": demo_session.get("action_rejected", False),
        "income_delay_days": income_delay_days,
        "expense_shock_amount": expense_shock_amount,
        "user_preferences": demo_session.get("user_preferences", {}),
        "income_events": demo_session.get("income_events", []),
        "expense_events": demo_session.get("expense_events", []),
        "last_action": demo_session.get("last_action", None),
        "last_action_timestamp": demo_session.get("last_action_timestamp", 0),
        "version": demo_session.get("version", 0),
    }


@app.post("/api/inject-delay")
def inject_income_delay():
    """Step 2: Income Delay Injection (Degrades arrival confidence P(recv) to 0.2)."""
    demo_session["income_events"][0]["probability"] = 0.2
    demo_session["is_ott_paused"] = False
    demo_session["action_rejected"] = False
    demo_session["version"] = demo_session.get("version", 0) + 1
    
    output = agent_engine.invoke(demo_session)
    demo_session.update(output)
    
    if output.get("math_result", {}).get("shortfall_risk", False):
        send_telegram_shortfall_alert(
            output.get("explanation", "Shortfall detected"),
            output.get("recommended_action", {}).get("title", "Action Required")
        )
    return get_current_state()


@app.post("/api/add-expense")
def add_expense_shock():
    """Step 3: Unplanned Expense Shock Injection (Adds ₹3,500 debit)."""
    if not any(e["name"] == "Emergency Medical Shock" for e in demo_session["expense_events"]):
        demo_session["expense_events"].append({"name": "Emergency Medical Shock", "amount": 3500.0, "day": 3})
    
    demo_session["is_ott_paused"] = False
    demo_session["action_rejected"] = False
    demo_session["version"] = demo_session.get("version", 0) + 1
    
    output = agent_engine.invoke(demo_session)
    demo_session.update(output)
    
    if output.get("math_result", {}).get("shortfall_risk", False):
        send_telegram_shortfall_alert(
            output.get("explanation", "Shortfall detected"),
            output.get("recommended_action", {}).get("title", "Action Required")
        )
    return get_current_state()


@app.post("/api/custom-event")
def inject_custom_event(event: CustomEventModel):
    """Step Dynamic: Generic Custom Event Injection for Live Judge & Stress Testing."""
    is_income = event.type.strip().upper().startswith("INC")
    if is_income:
        demo_session["income_events"].append({
            "name": event.name,
            "amount": float(event.amount),
            "probability": max(0.0, min(1.0, float(event.probability))),
            "day": int(event.day)
        })
    else:
        demo_session["expense_events"].append({
            "name": event.name,
            "amount": float(event.amount),
            "day": int(event.day)
        })
    
    demo_session["version"] = demo_session.get("version", 0) + 1
    output = agent_engine.invoke(demo_session)
    demo_session.update(output)
    
    if output.get("math_result", {}).get("shortfall_risk", False):
        send_telegram_shortfall_alert(
            output.get("explanation", "Shortfall detected"),
            output.get("recommended_action", {}).get("title", "Action Required")
        )
    return get_current_state()


@app.post("/api/user-feedback")
def process_user_feedback(feedback: FeedbackModel):
    """Step 8: Continuous Learning Cycle Handler."""
    return process_telegram_feedback(feedback.action)


@app.post("/api/reset-demo")
def reset_demo():
    """Reset system to baseline state."""
    global demo_session
    demo_session = copy.deepcopy(INITIAL_SESSION)
    demo_session["version"] = demo_session.get("version", 0) + 1
    output = agent_engine.invoke(demo_session)
    demo_session.update(output)
    return get_current_state()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
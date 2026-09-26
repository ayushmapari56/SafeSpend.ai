# agent_workflow.py
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from formula_engine import calculate_safespend_14days

class AgentState(TypedDict, total=False):
    current_balance: float
    income_events: List[Dict[str, Any]]
    expense_events: List[Dict[str, Any]]
    safety_buffer: float
    user_preferences: Dict[str, Any]
    math_result: Dict[str, Any]
    explanation: str
    recommended_action: Dict[str, Any]

def observer_predictor_node(state: AgentState) -> Dict[str, Any]:
    """Executes the math engine and computes short-horizon liquidity."""
    current_balance = float(state.get("current_balance", 14250.0))
    income_events = list(state.get("income_events", []))
    expense_events = list(state.get("expense_events", []))
    safety_buffer = float(state.get("safety_buffer", 2000.0))

    res = calculate_safespend_14days(
        current_balance=current_balance,
        income_events=income_events,
        expense_events=expense_events,
        safety_buffer=safety_buffer
    )
    return {"math_result": res}

def explainer_intervener_node(state: AgentState) -> Dict[str, Any]:
    """Generates plain-language explainability and adapts actions based on feedback memory."""
    res = state.get("math_result", {})
    prefs = state.get("user_preferences", {})
    
    if res.get("shortfall_risk", False):
        explanation = (
            f"Cash shortfall warning! Your 14-day liquidity pool is projected at "
            f"₹{res.get('usable_liquidity_pool', 0):,.2f} (breaching your ₹{res.get('safety_buffer', 2000):,.0f} safety buffer). "
            f"Primary cause: payment delays or unbudgeted expense shocks."
        )
        
        # CONTINUOUS LEARNING LOOP (Cycle 1 vs Cycle 2)
        # If user previously rejected canceling subscriptions, adapt and offer payment splitting!
        if prefs.get("rejected_cancellation", False):
            recommended_action = {
                "action_id": "ACT_SPLIT_RENT",
                "title": "Adapted Strategy: Split Upcoming Rent into 2 Installments",
                "impact": "Frees ₹4,000 liquidity immediately without canceling subscriptions.",
                "type": "PAYMENT_SPLIT"
            }
        else:
            recommended_action = {
                "action_id": "ACT_PAUSE_SUBS",
                "title": "Pause OTT & Shopping Auto-Debits",
                "impact": "Saves ₹1,499 auto-debit on Day 5.",
                "type": "SUBSCRIPTION_PAUSE"
            }
    else:
        explanation = "Your liquidity is stable. Safe-to-Spend limit is active."
        recommended_action = {
            "action_id": "ACT_NONE",
            "title": "No Action Needed",
            "impact": "All commitments covered safely.",
            "type": "NONE"
        }
        
    return {
        "explanation": explanation,
        "recommended_action": recommended_action
    }

# Construct LangGraph Workflow
workflow = StateGraph(AgentState)
workflow.add_node("observer", observer_predictor_node)
workflow.add_node("explainer", explainer_intervener_node)

workflow.set_entry_point("observer")
workflow.add_edge("observer", "explainer")
workflow.add_edge("explainer", END)

agent_engine = workflow.compile()

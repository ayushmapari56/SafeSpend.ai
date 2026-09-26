# formula_engine.py
"""
SafeSpend.ai Mathematical Core Engine
=====================================
Implements the core Safe-to-Spend formula for dynamic short-horizon liquidity:

    S_safe(t) = B_current + Σ_{τ=t}^{t+14} [ I_hat(τ) * P(recv) ] - Σ_{τ=t}^{t+14} E_committed(τ) - M_buffer

Where:
    - S_safe(t): Dynamic Safe-to-Spend Liquidity Pool across the 14-day horizon.
    - B_current: Current available liquid bank balance at time t.
    - Σ I_hat(τ) * P(recv): Expected probabilistically weighted inflows (e.g., stipend, freelance payouts).
    - Σ E_committed(τ): Mandatory fixed liabilities (rent, bills, subscriptions) + baseline essential burn.
    - M_buffer: Configured minimum safety buffer threshold (e.g., emergency reserve).
"""

from typing import List, Dict, Any, Optional

LATEX_FORMULA = r"S_{\text{safe}}(t) = B_{\text{current}} + \sum_{\tau=t}^{t+14} \hat{I}(\tau) \cdot P(\text{recv}) - \sum_{\tau=t}^{t+14} E_{\text{committed}}(\tau) - M_{\text{buffer}}"


def calculate_safespend_14days(
    current_balance: float,
    income_events: List[Dict[str, Any]],
    expense_events: List[Dict[str, Any]],
    safety_buffer: float = 2000.0,
    daily_essential_burn: float = 350.0
) -> Dict[str, Any]:
    """
    Computes S_safe(t), daily Safe-to-Spend limits, and 14-day trajectory projections.
    
    Formula:
        S_safe(t) = B_current + sum(I_hat * P(recv)) - sum(E_committed) - M_buffer
    """
    # 1. B_current: Current Available Balance
    b_current = float(current_balance)

    # 2. Σ [ I_hat(τ) * P(recv) ]: Weighted Inflows with Arrival Probability
    sum_expected_income = sum([
        float(item.get("amount", 0.0)) * float(item.get("probability", 1.0))
        for item in income_events
    ])

    # 3. Σ E_committed(τ): Scheduled Fixed Liabilities + Baseline Essential Living Burn
    sum_scheduled_expenses = sum([
        float(item.get("amount", 0.0))
        for item in expense_events
    ])
    total_essential_burn = daily_essential_burn * 14.0
    sum_committed_expenses = sum_scheduled_expenses + total_essential_burn

    # 4. M_buffer: Minimum Safety Buffer Reserve
    m_buffer = float(safety_buffer)

    # 5. Compute S_safe(t)
    s_safe_t = b_current + sum_expected_income - sum_committed_expenses - m_buffer

    # 6. Daily Safe-to-Spend Cap: max(0, S_safe(t) / 14)
    daily_safe_to_spend = max(0.0, round(s_safe_t / 14.0, 2))

    # 7. Generate 14-Day Day-by-Day Trajectory Points
    daily_trajectory = []
    running_balance = b_current

    for day in range(1, 15):
        # Income arriving on day τ
        day_income = sum([
            float(i.get("amount", 0.0)) * float(i.get("probability", 1.0))
            for i in income_events if i.get("day", 5) == day
        ])

        # Outflows on day τ (scheduled commitments + daily living burn)
        day_expenses = sum([
            float(e.get("amount", 0.0))
            for e in expense_events if e.get("day") == day
        ]) + daily_essential_burn

        running_balance = running_balance + day_income - day_expenses
        daily_trajectory.append({
            "day": f"Day {day}",
            "projected_balance": round(running_balance, 2),
            "safety_buffer": round(m_buffer, 2)
        })

    # Shortfall detection condition
    shortfall_risk = s_safe_t < 0 or any(pt["projected_balance"] < m_buffer for pt in daily_trajectory)

    return {
        # Core Formula Components
        "formula": LATEX_FORMULA,
        "s_safe_t": round(s_safe_t, 2),
        "b_current": round(b_current, 2),
        "sum_expected_income": round(sum_expected_income, 2),
        "sum_committed_expenses": round(sum_committed_expenses, 2),
        "m_buffer": round(m_buffer, 2),
        
        # Legacy/Frontend Compatibility Aliases
        "current_balance": round(b_current, 2),
        "total_weighted_income": round(sum_expected_income, 2),
        "total_committed_expenses": round(sum_committed_expenses, 2),
        "safety_buffer": round(m_buffer, 2),
        "usable_liquidity_pool": round(s_safe_t, 2),
        "daily_safe_to_spend": daily_safe_to_spend,
        "shortfall_risk": shortfall_risk,
        "daily_trajectory": daily_trajectory
    }

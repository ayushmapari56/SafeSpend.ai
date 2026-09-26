# telegram_service.py
import os
import requests
import time
import threading
from typing import Callable, Optional

# Active Bot Token and Chat ID (reads from ENV or default fallback)
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8685599406:AAEelS0iT9wMdY65WTJayOExW33ehhIvNwk")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "6599030186")

last_update_id = 0
_listener_started = False


def send_telegram_shortfall_alert(explanation_text: str, recommended_action: str) -> bool:
    """Dispatches a 1-click interactive action card to Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram Service] Token/ChatID missing. Skipping.")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

    message_text = (
        "🚨 *Safespend.ai Liquidity Alert*\n\n"
        f"⚠️ *Shortfall Warning:* {explanation_text}\n\n"
        f"💡 *Recommended Action:* {recommended_action}\n\n"
        "Click below to authorize remediation directly from Telegram:"
    )

    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message_text,
        "parse_mode": "Markdown",
        "reply_markup": {
            "inline_keyboard": [
                [
                    {"text": "✅ Approve Action", "callback_data": "APPROVE"},
                    {"text": "🔀 Reject (Trigger Learning)", "callback_data": "REJECT"}
                ]
            ]
        }
    }

    try:
        res = requests.post(url, json=payload, timeout=8)
        if res.status_code == 200:
            print("[Telegram Service] Alert dispatched successfully to Telegram.")
            return True
        else:
            print(f"[Telegram Service] Failed to send alert, status: {res.status_code}, resp: {res.text}")
            return False
    except Exception as e:
        print(f"[Telegram Service] Failed to send alert: {e}")
        return False


def start_telegram_listener(feedback_callback_func: Callable[[str], None]):
    """
    Background Daemon Thread: Periodically polls Telegram for button clicks (APPROVE / REJECT)
    and forwards the signal to the backend agent state.
    """
    global _listener_started, last_update_id
    if _listener_started:
        return
    if not TELEGRAM_BOT_TOKEN:
        return

    _listener_started = True

    def poll_updates():
        global last_update_id
        print("🤖 [Telegram Listener] Background Telegram Polling Loop Started!")
        while True:
            try:
                url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
                params = {"offset": last_update_id + 1, "timeout": 3}
                response = requests.get(url, params=params, timeout=8)
                if response.status_code == 200:
                    data = response.json()
                    for update in data.get("result", []):
                        last_update_id = update["update_id"]

                        # Handle Inline Keyboard Button Clicks
                        if "callback_query" in update:
                            cb = update["callback_query"]
                            action_data = cb.get("data")  # "APPROVE" or "REJECT"
                            cb_id = cb.get("id")
                            chat_id = cb.get("message", {}).get("chat", {}).get("id", TELEGRAM_CHAT_ID)

                            print(f"⚡ [Telegram Listener] Button Click Received: {action_data}")

                            # 1. Trigger Backend Agent State Update & Learning
                            try:
                                feedback_callback_func(action_data)
                            except Exception as err:
                                print(f"[Telegram Listener] Error in agent callback: {err}")

                            # 2. Acknowledge Telegram Button Popup Alert
                            try:
                                ack_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/answerCallbackQuery"
                                ack_text = "✅ Action Approved & Applied!" if action_data == "APPROVE" else "🔀 Strategy Rejected! Model Retraining."
                                requests.post(ack_url, json={
                                    "callback_query_id": cb_id,
                                    "text": ack_text,
                                    "show_alert": True
                                }, timeout=5)
                            except Exception as e:
                                print(f"[Telegram Listener] Failed to answerCallbackQuery: {e}")

                            # 3. Send Telegram Confirmation Message in Chat
                            try:
                                confirm_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
                                confirm_text = (
                                    "✅ *Action Executed Successfully!*\n"
                                    "SafeSpend engine has resolved the emergency shock and restored cashflow liquidity."
                                    if action_data == "APPROVE" else
                                    "🔀 *User Preference Recorded!*\n"
                                    "LangGraph feedback cycle updated: Cancellation strategy rejected for future recommendations."
                                )
                                requests.post(confirm_url, json={
                                    "chat_id": chat_id,
                                    "text": confirm_text,
                                    "parse_mode": "Markdown"
                                }, timeout=5)
                            except Exception as e:
                                print(f"[Telegram Listener] Failed to send confirmation message: {e}")

            except Exception as e:
                # Network glitch or timeout — wait and retry
                time.sleep(1)
            time.sleep(0.5)

    thread = threading.Thread(target=poll_updates, daemon=True)
    thread.start()
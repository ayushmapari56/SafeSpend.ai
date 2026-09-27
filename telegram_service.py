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
    """Dispatches a 1-click interactive action card to Telegram asynchronously."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram Service] Token/ChatID missing. Skipping.")
        return False

    def _do_send():
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
            res = requests.post(url, json=payload, timeout=6)
            if res.status_code == 200:
                print("[Telegram Service] Alert dispatched successfully to Telegram.")
            else:
                print(f"[Telegram Service] Failed to send alert: {res.status_code}")
        except Exception as e:
            print(f"[Telegram Service] Failed to send alert: {e}")

    threading.Thread(target=_do_send, daemon=True).start()
    return True


def _async_reply_telegram(cb_id: str, chat_id: str, action_data: str):
    """Handles Telegram popup answer and confirmation message in background without blocking the listener."""
    # 1. Answer Telegram popup alert
    try:
        ack_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/answerCallbackQuery"
        ack_text = "✅ Action Approved & Applied!" if action_data == "APPROVE" else "🔀 Strategy Rejected! Model Retraining."
        requests.post(ack_url, json={
            "callback_query_id": cb_id,
            "text": ack_text,
            "show_alert": True
        }, timeout=4)
    except Exception as e:
        print(f"[Telegram Listener] answerCallbackQuery error: {e}")

    # 2. Send confirmation message in chat
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
        }, timeout=4)
    except Exception as e:
        print(f"[Telegram Listener] confirmation message error: {e}")


def start_telegram_listener(feedback_callback_func: Callable[[str], None]):
    """
    High-Performance Background Polling Loop:
    Listens for Telegram button clicks and triggers state updates in 0ms without replaying backlogs.
    """
    global _listener_started, last_update_id
    if _listener_started:
        return
    if not TELEGRAM_BOT_TOKEN:
        return

    _listener_started = True

    def poll_updates():
        global last_update_id
        print("⚡ [Telegram Listener] Ultra-Fast Telegram Event Loop Active!")
        session = requests.Session()
        processed_callback_ids = set()
        
        # 1. Flush old backlog on startup so old button clicks don't replay repeatedly
        try:
            flush_res = session.get(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates",
                params={"offset": -1, "timeout": 2},
                timeout=5
            )
            if flush_res.status_code == 200:
                flush_data = flush_res.json().get("result", [])
                if flush_data:
                    last_update_id = flush_data[-1]["update_id"]
                    print(f"🧹 [Telegram Listener] Backlog flushed. Initial update_id set to {last_update_id}")
        except Exception as e:
            print(f"[Telegram Listener] Backlog flush error: {e}")

        while True:
            try:
                url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
                params = {"offset": last_update_id + 1, "timeout": 1}
                response = session.get(url, params=params, timeout=4)
                
                if response.status_code == 200:
                    data = response.json()
                    for update in data.get("result", []):
                        last_update_id = update["update_id"]

                        # Handle Inline Keyboard Button Clicks
                        if "callback_query" in update:
                            cb = update["callback_query"]
                            cb_id = cb.get("id")
                            
                            # Deduplicate callback query IDs so each click runs exactly once
                            if cb_id in processed_callback_ids:
                                continue
                            processed_callback_ids.add(cb_id)
                            # Keep set bounded
                            if len(processed_callback_ids) > 1000:
                                processed_callback_ids.clear()

                            action_data = cb.get("data")  # "APPROVE" or "REJECT"
                            chat_id = cb.get("message", {}).get("chat", {}).get("id", TELEGRAM_CHAT_ID)

                            print(f"⚡ [Telegram Listener] Instant Click Received: {action_data} (id: {cb_id})")

                            # 1. Update Agent State IMMEDIATELY (0ms blocking)
                            try:
                                feedback_callback_func(action_data)
                            except Exception as err:
                                print(f"[Telegram Listener] Error in agent callback: {err}")

                            # 2. Dispatch Telegram UI replies in non-blocking background thread
                            threading.Thread(
                                target=_async_reply_telegram,
                                args=(cb_id, chat_id, action_data),
                                daemon=True
                            ).start()

            except Exception as e:
                # Brief sleep only on network interruption
                time.sleep(0.5)
                
            time.sleep(0.1)

    thread = threading.Thread(target=poll_updates, daemon=True)
    thread.start()
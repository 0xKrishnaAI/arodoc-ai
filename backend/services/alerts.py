import logging
from ..config import settings

logger = logging.getLogger(__name__)

async def trigger_emergency_alert(user_id: str, message: str, location: dict = None):
    """
    Triggers an emergency alert.
    In production, this would send SMS (Twilio), Email, or Push Notification to guardians.
    """
    logger.critical(f"EMERGENCY ALERT for User {user_id}: {message} | Location: {location}")
    # In a real app, logic to find guardians and send messages goes here.
    return {"status": "success", "message": "Alert sent to guardians"}

async def escalate_missed_medicine(user_id: str, medicine_name: str):
    """
    Escalates a missed medicine dose.
    """
    message = f"Missed Dose Escalation: User {user_id} missed scheduled dose of {medicine_name}. rigorous follow-up required."
    logger.warning(message)
    # Trigger alert
    await trigger_emergency_alert(user_id, message)

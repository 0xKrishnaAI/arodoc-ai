"""
Notification Service for Arodoc AI
Handles sending emergency notifications via SMS (Twilio) - OPTIONAL.
Users who have a Twilio account can configure SMS; otherwise, SOS is logged only.
"""

import logging
from typing import List, Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Optional SMS notification service for SOS alerts.
    SMS requires user to have their own Twilio account credentials.
    """
    
    def __init__(self, twilio_sid: str = None, twilio_token: str = None, 
                 twilio_phone: str = None):
        # Twilio SMS configuration (optional)
        self.twilio_sid = twilio_sid
        self.twilio_token = twilio_token
        self.twilio_phone = twilio_phone
        self.twilio_client = None
        
        # Initialize Twilio client if configured
        if twilio_sid and twilio_token:
            try:
                from twilio.rest import Client
                self.twilio_client = Client(twilio_sid, twilio_token)
                logger.info("Twilio SMS service initialized successfully")
            except ImportError:
                logger.warning("Twilio not installed. Run: pip install twilio")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio: {e}")
    
    def is_sms_configured(self) -> bool:
        """Check if SMS (Twilio) is properly configured."""
        return self.twilio_client is not None and self.twilio_phone is not None
    
    def send_sms(self, to_phone: str, message: str) -> Dict:
        """
        Send an SMS notification via Twilio.
        Returns: {"success": bool, "error": str or None}
        """
        if not self.is_sms_configured():
            return {"success": False, "error": "SMS not configured - Twilio credentials not provided"}
        
        try:
            sms = self.twilio_client.messages.create(
                body=message,
                from_=self.twilio_phone,
                to=to_phone
            )
            logger.info(f"SMS sent successfully to {to_phone}, SID: {sms.sid}")
            return {"success": True, "error": None, "sid": sms.sid}
            
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_phone}: {e}")
            return {"success": False, "error": str(e)}
    
    def format_location_link(self, location: Dict) -> str:
        """Generate a Google Maps link from location data."""
        if location and location.get("lat") and location.get("lng"):
            lat, lng = location["lat"], location["lng"]
            return f"https://www.google.com/maps?q={lat},{lng}"
        return "Location unavailable"
    
    def create_sos_sms_body(self, user_name: str, location: Dict) -> str:
        """Create an SMS message for SOS alerts."""
        location_link = self.format_location_link(location)
        return f"🚨 EMERGENCY: {user_name} triggered SOS! Location: {location_link} - Please contact them immediately!"
    
    def notify_emergency_contacts(self, user, location: Dict, 
                                   contacts: List) -> Dict:
        """
        Notify all emergency contacts about an SOS event via SMS.
        
        Args:
            user: The user who triggered SOS
            location: Dict with lat, lng coordinates
            contacts: List of EmergencyContact objects
            
        Returns:
            Dict with success/failure counts and details
        """
        results = {
            "success_count": 0,
            "failure_count": 0,
            "sms_results": [],
            "sms_configured": self.is_sms_configured()
        }
        
        # If SMS is not configured, just return with warning
        if not self.is_sms_configured():
            logger.info("SMS not configured - SOS logged but no SMS notifications sent")
            results["warning"] = "SMS not configured. Add Twilio credentials to enable SMS alerts."
            return results
        
        user_name = user.full_name or user.email
        sms_body = self.create_sos_sms_body(user_name, location)
        
        for contact in contacts:
            if contact.phone_number:
                result = self.send_sms(contact.phone_number, sms_body)
                results["sms_results"].append({
                    "contact": contact.name,
                    "phone": contact.phone_number,
                    **result
                })
                if result["success"]:
                    results["success_count"] += 1
                else:
                    results["failure_count"] += 1
        
        return results


# Singleton instance - will be initialized with settings
_notification_service: Optional[NotificationService] = None


def get_notification_service() -> NotificationService:
    """Get or create the notification service singleton."""
    global _notification_service
    
    if _notification_service is None:
        # Handle both package import and direct import
        try:
            from .config import settings
        except ImportError:
            from config import settings
        
        _notification_service = NotificationService(
            twilio_sid=settings.TWILIO_ACCOUNT_SID,
            twilio_token=settings.TWILIO_AUTH_TOKEN,
            twilio_phone=settings.TWILIO_PHONE_NUMBER
        )
    
    return _notification_service


def notify_emergency_contacts(user, location: Dict, contacts: List) -> Dict:
    """Convenience function to notify emergency contacts."""
    service = get_notification_service()
    return service.notify_emergency_contacts(user, location, contacts)

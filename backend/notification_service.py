"""
Notification Service for Arodoc AI
Handles sending emergency notifications via Email (primary) and SMS (optional).
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Unified notification service for SOS alerts.
    Supports: Email (SMTP) - Primary
              SMS (Twilio) - Optional, for future use
    """
    
    def __init__(self, smtp_host: str = None, smtp_port: int = 587,
                 smtp_user: str = None, smtp_password: str = None,
                 twilio_sid: str = None, twilio_token: str = None, 
                 twilio_phone: str = None):
        # Email configuration
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
        
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
            except ImportError:
                logger.warning("Twilio not installed. SMS will be unavailable.")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio: {e}")
    
    def is_email_configured(self) -> bool:
        """Check if email is properly configured."""
        return all([self.smtp_host, self.smtp_user, self.smtp_password])
    
    def is_sms_configured(self) -> bool:
        """Check if SMS (Twilio) is properly configured."""
        return self.twilio_client is not None and self.twilio_phone is not None
    
    def send_email(self, to_email: str, subject: str, body_html: str) -> Dict:
        """
        Send an email notification.
        Returns: {"success": bool, "error": str or None}
        """
        if not self.is_email_configured():
            return {"success": False, "error": "Email not configured"}
        
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.smtp_user
            msg["To"] = to_email
            
            # Add HTML body
            msg.attach(MIMEText(body_html, "html"))
            
            # Send via SMTP
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.smtp_user, to_email, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return {"success": True, "error": None}
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return {"success": False, "error": str(e)}
    
    def send_sms(self, to_phone: str, message: str) -> Dict:
        """
        Send an SMS notification via Twilio (optional).
        Returns: {"success": bool, "error": str or None}
        """
        if not self.is_sms_configured():
            return {"success": False, "error": "SMS not configured"}
        
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
    
    def create_sos_email_body(self, user_name: str, user_email: str, 
                               location: Dict, timestamp: datetime) -> str:
        """Create an HTML email body for SOS alerts."""
        location_link = self.format_location_link(location)
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }}
                .container {{ max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 28px; }}
                .alert-icon {{ font-size: 48px; margin-bottom: 10px; }}
                .content {{ padding: 30px; }}
                .info-box {{ background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }}
                .info-row {{ display: flex; margin: 10px 0; }}
                .info-label {{ font-weight: bold; color: #666; width: 100px; }}
                .info-value {{ color: #333; }}
                .map-btn {{ display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }}
                .footer {{ background: #f9fafb; padding: 20px; text-align: center; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="alert-icon">🚨</div>
                    <h1>EMERGENCY SOS ALERT</h1>
                </div>
                <div class="content">
                    <p style="font-size: 18px; color: #333;">
                        <strong>{user_name}</strong> has triggered an emergency SOS alert and may need immediate assistance.
                    </p>
                    
                    <div class="info-box">
                        <div class="info-row">
                            <span class="info-label">Name:</span>
                            <span class="info-value">{user_name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span class="info-value">{user_email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Time:</span>
                            <span class="info-value">{timestamp.strftime('%B %d, %Y at %I:%M %p')}</span>
                        </div>
                    </div>
                    
                    <p><strong>📍 Location:</strong></p>
                    <a href="{location_link}" class="map-btn">View Location on Google Maps</a>
                    
                    <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px; color: #92400e;">
                        ⚠️ <strong>Please try to contact them immediately</strong> or call emergency services if you believe they are in danger.
                    </p>
                </div>
                <div class="footer">
                    This alert was sent by Arodoc AI Emergency System<br>
                    If you received this in error, please disregard.
                </div>
            </div>
        </body>
        </html>
        """
    
    def create_sos_sms_body(self, user_name: str, location: Dict) -> str:
        """Create an SMS message for SOS alerts."""
        location_link = self.format_location_link(location)
        return f"🚨 EMERGENCY: {user_name} triggered SOS! Location: {location_link} - Please contact them immediately!"
    
    def notify_emergency_contacts(self, user, location: Dict, 
                                   contacts: List) -> Dict:
        """
        Notify all emergency contacts about an SOS event.
        
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
            "email_results": [],
            "sms_results": []
        }
        
        user_name = user.full_name or user.email
        timestamp = datetime.now()
        
        # Create message content
        email_body = self.create_sos_email_body(user_name, user.email, location, timestamp)
        sms_body = self.create_sos_sms_body(user_name, location)
        email_subject = f"🚨 EMERGENCY SOS ALERT from {user_name}"
        
        for contact in contacts:
            # Try email first (primary)
            if contact.email and self.is_email_configured():
                result = self.send_email(contact.email, email_subject, email_body)
                results["email_results"].append({
                    "contact": contact.name,
                    "email": contact.email,
                    **result
                })
                if result["success"]:
                    results["success_count"] += 1
                else:
                    results["failure_count"] += 1
            
            # Try SMS if configured (optional)
            if contact.phone_number and self.is_sms_configured():
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
        
        # Log if no notifications were configured
        if not self.is_email_configured() and not self.is_sms_configured():
            logger.warning("No notification channels configured! SOS logged but contacts not notified.")
            results["warning"] = "No notification channels configured"
        
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
            smtp_host=settings.SMTP_HOST,
            smtp_port=settings.SMTP_PORT,
            smtp_user=settings.SMTP_USER,
            smtp_password=settings.SMTP_PASSWORD,
            twilio_sid=getattr(settings, 'TWILIO_ACCOUNT_SID', None),
            twilio_token=getattr(settings, 'TWILIO_AUTH_TOKEN', None),
            twilio_phone=getattr(settings, 'TWILIO_PHONE_NUMBER', None)
        )
    
    return _notification_service


def notify_emergency_contacts(user, location: Dict, contacts: List) -> Dict:
    """Convenience function to notify emergency contacts."""
    service = get_notification_service()
    return service.notify_emergency_contacts(user, location, contacts)

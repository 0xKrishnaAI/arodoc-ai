from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from .. import models, database, config
from ..auth import get_current_user

router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    is_emergency: bool = False

# Emergency keywords that should trigger SOS suggestion
EMERGENCY_KEYWORDS = [
    "chest pain", "heart attack", "can't breathe", "stroke", "unconscious",
    "severe bleeding", "suicide", "overdose", "poisoning", "choking",
    "seizure", "severe pain", "emergency", "dying", "help me"
]

def check_emergency(message: str) -> bool:
    """Check if message contains emergency keywords"""
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in EMERGENCY_KEYWORDS)

def get_user_health_context(db: Session, user_id: str) -> str:
    """Build health context string from user's data"""
    context_parts = []
    
    # Get user profile
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if profile:
        if profile.dob:
            today = date.today()
            dob = profile.dob if isinstance(profile.dob, date) else profile.dob.date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            context_parts.append(f"Age: {age} years")
        if profile.gender:
            context_parts.append(f"Gender: {profile.gender}")
        if profile.blood_type:
            context_parts.append(f"Blood Type: {profile.blood_type}")
    
    # Get latest vitals
    def get_vital(category):
        return db.query(models.Vital).filter(
            models.Vital.user_id == user_id,
            models.Vital.category == category
        ).order_by(models.Vital.recorded_at.desc()).first()
    
    hr = get_vital("HR")
    bp = get_vital("BP")
    glucose = get_vital("Glucose")
    temp = get_vital("Temp")
    weight = get_vital("Weight")
    
    vitals = []
    if hr:
        vitals.append(f"Heart Rate: {int(hr.value_primary)} bpm")
    if bp:
        bp_str = f"{int(bp.value_primary)}/{int(bp.value_secondary)}" if bp.value_secondary else str(int(bp.value_primary))
        vitals.append(f"Blood Pressure: {bp_str} mmHg")
    if glucose:
        vitals.append(f"Blood Sugar: {int(glucose.value_primary)} mg/dL")
    if temp:
        vitals.append(f"Temperature: {temp.value_primary}°F")
    if weight:
        vitals.append(f"Weight: {weight.value_primary} kg")
    
    if vitals:
        context_parts.append("Recent Vitals: " + ", ".join(vitals))
    
    # Get latest report summary
    latest_report = db.query(models.Report).filter(
        models.Report.user_id == user_id
    ).order_by(models.Report.created_at.desc()).first()
    
    if latest_report and latest_report.summary:
        context_parts.append(f"Latest Report ({latest_report.risk_level}): {latest_report.summary[:300]}")
    
    return "\n".join(context_parts) if context_parts else "No health data available yet."

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(
    chat: ChatMessage,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    AI-powered health assistant chat endpoint.
    Provides personalized health advice based on user's health data.
    """
    # Check for emergency
    is_emergency = check_emergency(chat.message)
    
    if is_emergency:
        return ChatResponse(
            response="🚨 **This sounds like a medical emergency!**\n\nPlease use the **Emergency SOS** button immediately or call emergency services (108/112).\n\nIf you're experiencing chest pain, difficulty breathing, or severe symptoms, please seek immediate medical attention.\n\n*I'm an AI assistant and cannot provide emergency medical care.*",
            is_emergency=True
        )
    
    # Check if API key is available
    if not config.settings.GEMINI_API_KEY:
        return ChatResponse(
            response="I'm currently in limited mode. Please try again later or consult a healthcare professional for medical advice.\n\n*Tip: Record your vitals and upload reports to get personalized insights!*",
            is_emergency=False
        )
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=config.settings.GEMINI_API_KEY)
        
        # Get user's health context
        health_context = get_user_health_context(db, current_user.id)
        
        # Build conversation history for context
        history_text = ""
        if chat.conversation_history:
            for msg in chat.conversation_history[-6:]:  # Last 6 messages for context
                role = "User" if msg.get("role") == "user" else "Assistant"
                history_text += f"{role}: {msg.get('content', '')}\n"
        
        system_prompt = f"""You are Arodoc AI, a friendly and professional health assistant. You help users understand their health data, answer health-related questions, and provide general wellness advice.

PATIENT HEALTH CONTEXT:
{health_context}

IMPORTANT GUIDELINES:
1. Be empathetic, supportive, and professional
2. Provide helpful health information based on the user's context
3. Always recommend consulting a healthcare professional for diagnosis or treatment
4. If asked about medications, mention possible interactions but advise consulting a pharmacist/doctor
5. Keep responses concise but informative (under 300 words)
6. Use simple language, avoid excessive medical jargon
7. If the user's vitals show concerning values, gently note this
8. Never diagnose conditions - only provide general information
9. For serious symptoms, always recommend seeking medical attention

CONVERSATION HISTORY:
{history_text}

Respond naturally to the user's message. Be helpful and caring."""

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content([
            system_prompt,
            f"User: {chat.message}"
        ])
        
        ai_response = response.text.strip()
        
        # Add disclaimer if not present
        if "consult" not in ai_response.lower() and "doctor" not in ai_response.lower():
            ai_response += "\n\n*Remember: Always consult a healthcare professional for personalized medical advice.*"
        
        return ChatResponse(response=ai_response, is_emergency=False)
        
    except Exception as e:
        print(f"AI Assistant error: {e}")
        return ChatResponse(
            response="I'm having trouble processing your request right now. Please try again in a moment.\n\nIn the meantime, you can:\n- Check your Dashboard for health insights\n- View your Recommendations for personalized tips\n- Use the Hospital Locator to find nearby care",
            is_emergency=False
        )

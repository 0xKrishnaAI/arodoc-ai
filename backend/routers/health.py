from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..auth import get_current_user

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get("")
def health_check():
    """Simple health check endpoint for frontend status monitoring"""
    return {"status": "Active"}

@router.post("/vitals")
def add_vital(vitals_data: dict, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Handles vitals submission. 
    Frontend sends keys: heart_rate, blood_pressure, blood_sugar, weight, temperature
    """
    for key, value in vitals_data.items():
        if not value: continue
        
        category = ""
        val_p = 0.0
        val_s = None
        unit = ""
        
        if key == "heart_rate":
            category = "HR"
            val_p = float(value)
            unit = "bpm"
        elif key == "blood_pressure":
            category = "BP"
            try:
                s, d = map(float, value.split('/'))
                val_p = s
                val_s = d
                unit = "mmHg"
            except: continue
        elif key == "blood_sugar":
            category = "Glucose"
            val_p = float(value)
            unit = "mg/dL"
        elif key == "weight":
            category = "Weight"
            val_p = float(value)
            unit = "kg"
        elif key == "temperature":
            category = "Temp"
            val_p = float(value)
            unit = "°F"
            
        if category:
            new_vital = models.Vital(
                user_id=current_user.id,
                category=category,
                value_primary=val_p,
                value_secondary=val_s,
                unit=unit
            )
            db.add(new_vital)
            
    db.commit()
    return {"message": "Vitals recorded successfully"}

@router.get("/vitals", response_model=List[schemas.VitalResponse])
def get_vitals(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Vital).filter(models.Vital.user_id == current_user.id).order_by(models.Vital.recorded_at.desc()).all()

@router.put("/profile", response_model=schemas.ProfileResponse)
def update_profile(profile_update: schemas.ProfileUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
    
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # Get latest of each vital category
    def get_latest(cat):
        return db.query(models.Vital).filter(
            models.Vital.user_id == current_user.id,
            models.Vital.category == cat
        ).order_by(models.Vital.recorded_at.desc()).first()

    latest_hr = get_latest("HR")
    latest_bp = get_latest("BP")
    latest_glucose = get_latest("Glucose")
    latest_temp = get_latest("Temp")
    latest_weight = get_latest("Weight")
    
    # Get recent reports
    recent_reports = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(models.Report.created_at.desc()).limit(3).all()
    
    health_status = "GREEN"
    concerns = []
    
    # Blood Pressure Check
    if latest_bp:
        systolic = latest_bp.value_primary
        diastolic = latest_bp.value_secondary
        if systolic >= 140 or (diastolic and diastolic >= 90):
            health_status = "RED"
            concerns.append("High blood pressure detected")
        elif systolic >= 130 or (diastolic and diastolic >= 85):
            health_status = max(health_status, "YELLOW", key=lambda x: ["GREEN", "YELLOW", "RED"].index(x))
            concerns.append("Elevated blood pressure")
    
    # Blood Sugar Check
    if latest_glucose:
        val = latest_glucose.value_primary
        if val > 180:
            health_status = "RED"
            concerns.append("High blood sugar")
        elif val > 140:
            health_status = max(health_status, "YELLOW", key=lambda x: ["GREEN", "YELLOW", "RED"].index(x))
            concerns.append("Elevated blood sugar")
    
    # Heart Rate Check
    if latest_hr:
        hr = latest_hr.value_primary
        if hr > 100 or hr < 60:
            health_status = max(health_status, "YELLOW", key=lambda x: ["GREEN", "YELLOW", "RED"].index(x))
            concerns.append("Irregular heart rate")
    
    # Temperature Check
    if latest_temp:
        temp = latest_temp.value_primary
        if temp > 100.4 or temp < 95:
            health_status = max(health_status, "YELLOW", key=lambda x: ["GREEN", "YELLOW", "RED"].index(x))
            concerns.append("Abnormal body temperature")
    
    # Check recent reports
    for report in recent_reports:
        if report.risk_level == "RED":
            health_status = "RED"
            concerns.append("Critical findings in recent medical report")
            break
        elif report.risk_level == "YELLOW":
            health_status = max(health_status, "YELLOW", key=lambda x: ["GREEN", "YELLOW", "RED"].index(x))
    
    return {
        "health_status": health_status,
        "status_message": "All vitals normal" if health_status == "GREEN" else 
                         "Some concerns detected" if health_status == "YELLOW" else 
                         "Immediate attention recommended",
        "concerns": concerns,
        "latest_vitals": {
            "heart_rate": {
                "value": int(latest_hr.value_primary) if latest_hr else None,
                "id": latest_hr.id if latest_hr else None
            },
            "blood_pressure": {
                "value": f"{int(latest_bp.value_primary)}/{int(latest_bp.value_secondary)}" if latest_bp and latest_bp.value_secondary else str(int(latest_bp.value_primary)) if latest_bp else None,
                "id": latest_bp.id if latest_bp else None
            },
            "blood_sugar": {
                "value": int(latest_glucose.value_primary) if latest_glucose else None,
                "id": latest_glucose.id if latest_glucose else None
            },
            "temperature": {
                "value": round(latest_temp.value_primary, 1) if latest_temp else None,
                "id": latest_temp.id if latest_temp else None
            },
            "weight": {
                "value": round(latest_weight.value_primary, 1) if latest_weight else None,
                "id": latest_weight.id if latest_weight else None
            }
        },
        "recent_reports_count": db.query(models.Report).filter(models.Report.user_id == current_user.id).count(),
        "has_critical_reports": any(r.risk_level == "RED" for r in recent_reports)
    }

@router.patch("/vitals/{vital_id}", response_model=schemas.VitalResponse)
def update_vital(vital_id: str, vital_update: schemas.VitalUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    vital = db.query(models.Vital).filter(models.Vital.id == vital_id, models.Vital.user_id == current_user.id).first()
    if not vital:
        raise HTTPException(status_code=404, detail="Vital record not found")
    
    for key, value in vital_update.dict(exclude_unset=True).items():
        setattr(vital, key, value)
    
    db.commit()
    db.refresh(vital)
    return vital

@router.delete("/vitals/{vital_id}")
def delete_vital(vital_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    vital = db.query(models.Vital).filter(models.Vital.id == vital_id, models.Vital.user_id == current_user.id).first()
    if not vital:
        raise HTTPException(status_code=404, detail="Vital record not found")
    
    db.delete(vital)
    db.commit()
    return {"message": "Vital deleted successfully"}

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Generate personalized health recommendations based on user's age, vitals and reports.
    Uses Gemini AI when API key is available, otherwise falls back to rule-based recommendations.
    """
    from ..config import settings
    from datetime import datetime, date
    
    # Get user profile for age calculation
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    # Calculate age
    user_age = None
    if profile and profile.dob:
        today = date.today()
        dob = profile.dob if isinstance(profile.dob, date) else profile.dob.date()
        user_age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    
    # Get latest vitals by category
    def get_latest_vital(cat):
        return db.query(models.Vital).filter(
            models.Vital.user_id == current_user.id,
            models.Vital.category == cat
        ).order_by(models.Vital.recorded_at.desc()).first()

    latest_hr = get_latest_vital("HR")
    latest_bp = get_latest_vital("BP")
    latest_glucose = get_latest_vital("Glucose")
    latest_temp = get_latest_vital("Temp")
    latest_weight = get_latest_vital("Weight")
    
    # Get the most recent (newest) report only
    latest_report = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(models.Report.created_at.desc()).first()
    
    # Build vitals summary for AI
    vitals_summary = []
    if latest_hr:
        vitals_summary.append(f"Heart Rate: {int(latest_hr.value_primary)} bpm")
    if latest_bp:
        bp_str = f"{int(latest_bp.value_primary)}/{int(latest_bp.value_secondary)}" if latest_bp.value_secondary else str(int(latest_bp.value_primary))
        vitals_summary.append(f"Blood Pressure: {bp_str} mmHg")
    if latest_glucose:
        vitals_summary.append(f"Blood Sugar: {int(latest_glucose.value_primary)} mg/dL")
    if latest_temp:
        vitals_summary.append(f"Temperature: {latest_temp.value_primary}°F")
    if latest_weight:
        vitals_summary.append(f"Weight: {latest_weight.value_primary} kg")
    
    # Build report summary for AI (only the newest report)
    report_summary = ""
    if latest_report and latest_report.summary:
        report_summary = f"Latest Report ({latest_report.risk_level}): {latest_report.summary}"
    
    # Try AI-powered recommendations
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            
            age_str = f"{user_age} years old" if user_age else "Unknown age"
            gender_str = profile.gender if profile and profile.gender else "Unknown gender"
            vitals_str = ", ".join(vitals_summary) if vitals_summary else "No vitals recorded"
            
            prompt = f"""You are a health advisor AI. Based on the following patient information, provide personalized health recommendations.

Patient Profile:
- Age: {age_str}
- Gender: {gender_str}

Current Vitals:
{vitals_str}

Latest Medical Report:
{report_summary if report_summary else "No recent reports"}

Provide recommendations in the following JSON format ONLY (no other text):
{{
    "diet": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
    "activity": ["exercise 1", "exercise 2", "exercise 3", "exercise 4"],
    "specialists": ["specialist 1", "specialist 2"]
}}

Guidelines:
- Tailor diet recommendations to the patient's age and health conditions
- Suggest age-appropriate exercises (gentle for elderly, more active for younger)
- Recommend specialists based on any concerning vitals or report findings
- Keep each recommendation concise (under 100 characters)
- If no concerns, suggest General Physician for annual check-up
- Always include a hydration recommendation in diet
"""
            
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            
            # Parse AI response
            import json
            import re
            
            response_text = response.text.strip()
            # Extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                ai_recommendations = json.loads(json_match.group())
                
                return {
                    "diet": ai_recommendations.get("diet", []),
                    "activity": ai_recommendations.get("activity", []),
                    "specialists": ai_recommendations.get("specialists", ["General Physician (Annual check-up)"]),
                    "disclaimer": "These AI-generated suggestions are personalized based on your recorded data and are for informational purposes only. Always consult a doctor for clinical diagnosis.",
                    "ai_powered": True
                }
        except Exception as e:
            print(f"AI recommendations failed: {e}")
            # Fall through to rule-based recommendations
    
    # Fallback: Rule-based recommendations (existing logic)
    diet = ["Ensure adequate hydration (8+ glasses of water).", "Include more fiber-rich vegetables in your meals."]
    activity = [
        "Aim for at least 30 minutes of light walking today.",
        "Warm-up: Start with light walking to warm your muscles.",
        "Stretches for 5-10 minutes daily to maintain youthful movement and good posture.",
        "Gentle stretching for 10-30 seconds per stretch (for elders)."
    ]
    specialists = []
    
    # Age-based activity adjustments
    if user_age:
        if user_age >= 60:
            activity = [
                "Light walking for 15-20 minutes twice a day.",
                "Chair exercises to maintain mobility.",
                "Gentle stretching for joints and flexibility.",
                "Deep breathing exercises for relaxation."
            ]
        elif user_age >= 40:
            activity = [
                "Brisk walking for 30 minutes daily.",
                "Low-impact exercises like swimming or cycling.",
                "Strength training 2-3 times per week.",
                "Yoga or stretching for flexibility."
            ]
    
    if latest_bp:
        systolic = latest_bp.value_primary
        diastolic = latest_bp.value_secondary
        if systolic >= 130 or (diastolic and diastolic >= 85):
            diet.append("Reduce daily sodium/salt intake.")
            specialists.append("Cardiologist")
            
    if latest_glucose:
        val = latest_glucose.value_primary
        if val > 140:
            diet.append("Limit sugar and refined carbohydrates.")
            diet.append("Prefer whole grains over white rice/bread.")
            specialists.append("Endocrinologist")

    # Check the latest (newest) report only
    if latest_report and latest_report.risk_level in ["YELLOW", "RED"]:
        activity.insert(0, "Consult your doctor before starting any intense exercise.")
        
        if latest_report.summary:
            if "heart" in latest_report.summary.lower() or "cardiac" in latest_report.summary.lower():
                specialists.append("Cardiologist")
            if "sugar" in latest_report.summary.lower() or "glucose" in latest_report.summary.lower():
                specialists.append("Diabetologist")
        
    # Remove duplicates from specialists
    specialists = list(set(specialists))
    if not specialists:
        specialists = ["General Physician (Annual check-up)"]

    return {
        "diet": diet,
        "activity": activity,
        "specialists": specialists,
        "disclaimer": "These suggestions are generated based on your recorded data and are for informational purposes only. Consult a doctor for clinical diagnosis.",
        "ai_powered": False
    }

@router.get("/hospitals")
def search_hospitals(city: str = "Local", query: str = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Search for hospitals or doctors. 
    In a real app, this would use Google Places API or a medical directory.
    Returning mock data for demonstration.
    """
    all_facilities = [
        {"id": "1", "name": "City General Hospital", "type": "Hospital", "specialty": "General", "rating": 4.5, "address": "123 Healthcare Ave", "city": "New York"},
        {"id": "2", "name": "Heart Care Institute", "type": "Specialty Center", "specialty": "Cardiology", "rating": 4.8, "address": "45 Cardia Lane", "city": "Los Angeles"},
        {"id": "3", "name": "Diabetes & Metabolism Clinic", "type": "Clinic", "specialty": "Endocrinology", "rating": 4.6, "address": "78 Sugar St", "city": "Chicago"},
        {"id": "4", "name": "Dr. Smith's Family Practice", "type": "Private Clinic", "specialty": "General Physician", "rating": 4.9, "address": "90 Wellness Blvd", "city": "New York"},
        {"id": "5", "name": "Central Diagnostic Lab", "type": "Diagnostic", "specialty": "Pathology", "rating": 4.2, "address": "12 Test Rd", "city": "Houston"},
        {"id": "6", "name": "Mumbai City Hospital", "type": "Hospital", "specialty": "General", "rating": 4.7, "address": "Marine Drive", "city": "Mumbai"},
        {"id": "7", "name": "Delhi Heart Center", "type": "Specialty Center", "specialty": "Cardiology", "rating": 4.5, "address": "Connaught Place", "city": "Delhi"},
        {"id": "8", "name": "Bangalore Wellness Clinic", "type": "Clinic", "specialty": "General", "rating": 4.6, "address": "Indiranagar", "city": "Bangalore"}
    ]
    
    if query:
        query = query.lower()
        results = [
            f for f in all_facilities 
            if query in f['name'].lower() 
            or query in f['specialty'].lower() 
            or query in f['address'].lower()
            or query in f['city'].lower()
        ]
    else:
        results = all_facilities
        
    return {"results": results, "city": city}



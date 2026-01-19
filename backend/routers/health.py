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

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Generate personalized health recommendations based on vitals and reports.
    """
    # Get latest vitals
    latest_vitals = db.query(models.Vital).filter(
        models.Vital.user_id == current_user.id
    ).order_by(models.Vital.recorded_at.desc()).first()
    
    # Get latest report
    latest_report = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(models.Report.created_at.desc()).first()
    
    diet = ["Ensure adequate hydration (8+ glasses of water).", "Include more fiber-rich vegetables in your meals."]
    activity = [
        "Aim for at least 30 minutes of light walking today.",
        "Warm-up: Start with light walking to warm your muscles.",
        "Stretches for 5-10 minutes daily to maintain youthful movement and good posture.",
        "Gentle stretching for 10-30 seconds per stretch (for elders)."
    ]
    specialists = []
    
    # Get latest vitals by category
    def get_latest_vital(cat):
        return db.query(models.Vital).filter(
            models.Vital.user_id == current_user.id,
            models.Vital.category == cat
        ).order_by(models.Vital.recorded_at.desc()).first()

    latest_bp = get_latest_vital("BP")
    latest_glucose = get_latest_vital("Glucose")
    
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

    if latest_report:
        if latest_report.risk_level in ["YELLOW", "RED"]:
            # Prepend the medical warning instead of overwriting the list
            activity.insert(0, "Consult your doctor before starting any intense exercise.")
            
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
        "disclaimer": "These suggestions are generated based on your recorded data and are for informational purposes only. Consult a doctor for clinical diagnosis."
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



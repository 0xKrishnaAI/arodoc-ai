from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from ..database import get_db
from ..models import User, Medicine, Alert
from ..schemas import MedicineCreate, MedicineResponse, MedicineUpdateStatus
from ..auth import get_current_user
from ..services.gemini_vision import parse_prescription
from ..services.price_services import search_medicine_prices
from ..services.alerts import escalate_missed_medicine, trigger_emergency_alert

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])

@router.post("/scan", response_model=List[MedicineCreate])
async def scan_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Uploads a prescription image and returns extracted medicines.
    Does NOT save to DB automatically; frontend should confirm first.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    content = await file.read()
    try:
        medicines_data = await parse_prescription(content, file.content_type)
        
        # Convert JSON dicts to schemas to validate, optimizing schedule_time
        results = []
        today = datetime.now().date()
        for m in medicines_data:
             # Basic handling of time hint to create a datetime object for 'today'
            schedule_dt = None
            if "schedule_time_hint" in m and m["schedule_time_hint"]:
                try:
                    h, min = map(int, m["schedule_time_hint"].split(":"))
                    schedule_dt = datetime.combine(today, datetime.min.time().replace(hour=h, minute=min))
                    # If time passed, Schedule for tomorrow? Or keep today for history? 
                    # Let's keep today for now or if passed, maybe tomorrow.
                    # Simple logic: if passed > 4 hours, schedule tomorrow.
                    if schedule_dt < datetime.now() - timedelta(hours=4):
                         schedule_dt += timedelta(days=1)
                except:
                    pass
            
            results.append(MedicineCreate(
                name=m["name"],
                dosage=m.get("dosage"),
                timing=m.get("timing"),
                schedule_time=schedule_dt
            ))
        return results

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/", response_model=MedicineResponse)
def add_medicine(
    medicine: MedicineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_medicine = Medicine(
        **medicine.dict(),
        user_id=current_user.id
    )
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.get("/", response_model=List[MedicineResponse])
def get_medicines(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Medicine).filter(Medicine.user_id == current_user.id).order_by(Medicine.schedule_time).all()

@router.patch("/{medicine_id}/status", response_model=MedicineResponse)
def update_medicine_status(
    medicine_id: str,
    update: MedicineUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id, Medicine.user_id == current_user.id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    medicine.status = update.status
    if update.taken_at:
        medicine.taken_at = update.taken_at
    elif update.status == "Taken":
        medicine.taken_at = datetime.now()
        
    db.commit()
    db.refresh(medicine)
    return medicine

@router.post("/simulate-missed")
async def simulate_missed_dose(
    medicine_id: str = None, # Optional, if None pick first scheduled
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simulates a missed dose event -> Changes status to Escalated -> Triggers Alert
    """
    if medicine_id:
        medicine = db.query(Medicine).filter(Medicine.id == medicine_id, Medicine.user_id == current_user.id).first()
    else:
        medicine = db.query(Medicine).filter(Medicine.user_id == current_user.id, Medicine.status == "Scheduled").first()
    
    if not medicine:
        return {"message": "No scheduled medicine found to simulate."}
    
    medicine.status = "Escalated"
    db.commit()
    
    # Trigger Alert
    await escalate_missed_medicine(current_user.id, medicine.name)
    
    return {"message": f"Simulated missed dose for {medicine.name}. Status escalated and Admin alerted."}

@router.get("/compare-prices")
async def compare_medicines(
    name: str,
    current_user: User = Depends(get_current_user)
):
    return await search_medicine_prices(name)
    
@router.post("/sos")
async def trigger_sos(
    location: dict = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Triggers SOS Alert
    """
    msg = f"SOS Triggered by {current_user.full_name} ({current_user.email})!"
    await trigger_emergency_alert(current_user.id, msg, location)
    
    # Save to DB
    alert = Alert(
        user_id=current_user.id,
        type="SOS",
        message=msg,
        location=location
    )
    db.add(alert)
    db.commit()
    
    return {"status": "SOS Alert Sent", "message": msg}

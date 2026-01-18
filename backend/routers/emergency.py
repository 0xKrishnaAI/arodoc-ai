from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import database
from auth import get_current_user

router = APIRouter(
    prefix="/emergency",
    tags=["Emergency"]
)

@router.post("/trigger")
def trigger_sos(location: dict, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # 1. Log the event
    new_alert = models.Alert(
        user_id=current_user.id,
        type="SOS",
        message=f"SOS Triggered by {current_user.full_name or current_user.email}",
        location=location
    )
    db.add(new_alert)
    db.commit()

    # 2. Notify Contacts (Mock print)
    contacts = db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == current_user.id).all()
    print(f"SOS TRIGGERED FOR USER {current_user.email} AT {location}")
    for contact in contacts:
        print(f"NOTIFYING: {contact.name} at {contact.phone_number}")
        
    return {"status": "SOS ACTIVATED", "message": "Emergency contacts notified and alert logged."}

@router.post("/contacts", response_model=schemas.EmergencyContactResponse)
def add_contact(contact: schemas.EmergencyContactCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    new_contact = models.EmergencyContact(**contact.dict(), user_id=current_user.id)
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.get("/contacts", response_model=List[schemas.EmergencyContactResponse])
def get_contacts(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == current_user.id).all()

@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    contact = db.query(models.EmergencyContact).filter(
        models.EmergencyContact.id == contact_id,
        models.EmergencyContact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully"}

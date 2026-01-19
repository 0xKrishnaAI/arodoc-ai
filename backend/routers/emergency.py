from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..auth import get_current_user
from ..notification_service import notify_emergency_contacts
import logging

logger = logging.getLogger(__name__)

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

    # 2. Get emergency contacts
    contacts = db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == current_user.id).all()
    
    # 3. Send real notifications (email + optional SMS)
    logger.info(f"SOS TRIGGERED FOR USER {current_user.email} AT {location}")
    notification_results = notify_emergency_contacts(
        user=current_user,
        location=location,
        contacts=contacts
    )
    
    # Log notification results
    logger.info(f"Notification results: {notification_results['success_count']} sent, {notification_results['failure_count']} failed")
    
    return {
        "status": "SOS ACTIVATED",
        "message": "Emergency contacts notified and alert logged.",
        "notifications_sent": notification_results["success_count"],
        "notifications_failed": notification_results["failure_count"],
        "contacts_notified": len(contacts)
    }

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

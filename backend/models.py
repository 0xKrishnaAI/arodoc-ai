from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship as orm_relationship
from sqlalchemy.sql import func
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="user") # user, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = orm_relationship("Profile", back_populates="user", uselist=False)
    vitals = orm_relationship("Vital", back_populates="user")
    reports = orm_relationship("Report", back_populates="user")
    emergency_contacts = orm_relationship("EmergencyContact", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    dob = Column(DateTime)
    gender = Column(String)
    height = Column(Float) # cm
    weight = Column(Float) # kg
    blood_type = Column(String)
    
    user = orm_relationship("User", back_populates="profile")

class Vital(Base):
    __tablename__ = "vitals"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    category = Column(String, nullable=False) # 'BP', 'HR', 'SpO2', 'Glucose', 'Temp', 'Weight'
    value_primary = Column(Float, nullable=False) # e.g., Systolic, or just the value
    value_secondary = Column(Float, nullable=True) # e.g., Diastolic
    unit = Column(String)
    notes = Column(String)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = orm_relationship("User", back_populates="vitals")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    file_url = Column(String, nullable=False)
    file_type = Column(String) # pdf, image
    analysis_result = Column(JSON) # Extracted data and AI analysis
    summary = Column(Text)
    risk_level = Column(String) # GREEN, YELLOW, RED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = orm_relationship("User", back_populates="reports")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    relationship = Column(String)
    phone_number = Column(String, nullable=False)
    email = Column(String)
    
    user = orm_relationship("User", back_populates="emergency_contacts")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # SOS, Abnormal Vitals
    message = Column(Text)
    location = Column(JSON) # {lat: ..., lng: ...}
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = orm_relationship("User")

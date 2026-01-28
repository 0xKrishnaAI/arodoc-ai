from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Profile
class ProfileUpdate(BaseModel):
    dob: Optional[datetime] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    blood_type: Optional[str] = None

class ProfileResponse(ProfileUpdate):
    user_id: str
    id: str

    class Config:
        from_attributes = True

# User
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    dob: Optional[datetime] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    created_at: datetime
    profile: Optional[ProfileResponse] = None
    
    class Config:
        from_attributes = True

# Vitals
class VitalCreate(BaseModel):
    category: str
    value_primary: float
    value_secondary: Optional[float] = None
    unit: Optional[str] = None
    notes: Optional[str] = None

class VitalUpdate(BaseModel):
    value_primary: Optional[float] = None
    value_secondary: Optional[float] = None
    unit: Optional[str] = None
    notes: Optional[str] = None

class VitalResponse(VitalCreate):
    id: str
    user_id: str
    recorded_at: datetime

    class Config:
        from_attributes = True

# Reports
class ReportResponse(BaseModel):
    id: str
    user_id: str
    file_url: str
    file_type: Optional[str] = None
    analysis_result: Optional[Any] = None
    summary: Optional[str] = None
    risk_level: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Emergency Contact
class EmergencyContactCreate(BaseModel):
    name: str
    relationship: Optional[str] = None
    phone_number: str
    email: Optional[str] = None

class EmergencyContactResponse(EmergencyContactCreate):
    id: str
    user_id: str

    class Config:
        from_attributes = True

# Medicines
class MedicineCreate(BaseModel):
    name: str
    dosage: Optional[str] = None
    timing: Optional[str] = None
    schedule_time: Optional[datetime] = None

class MedicineUpdateStatus(BaseModel):
    status: str # Taken, Escalated, Missed
    taken_at: Optional[datetime] = None

class MedicineResponse(MedicineCreate):
    id: str
    user_id: str
    status: str
    taken_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


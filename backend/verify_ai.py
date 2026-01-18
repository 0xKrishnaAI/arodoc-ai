import requests
import json
from PIL import Image, ImageDraw, ImageFont
import io
import os

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
EMAIL = "test_ai_user@example.com"
PASSWORD = "password123"

def create_test_image():
    """Generates a dummy medical report image."""
    img = Image.new('RGB', (800, 600), color='white')
    d = ImageDraw.Draw(img)
    # Basic text (Pillow default font)
    d.text((50, 50), "MEDICAL LAB REPORT", fill='black')
    d.text((50, 100), "Patient: John Doe", fill='black')
    d.text((50, 150), "Test: Complete Blood Count", fill='black')
    d.text((50, 200), "Hemoglobin: 14.5 g/dL (Ref: 13.5-17.5) - NORMAL", fill='black')
    d.text((50, 250), "WBC: 6.0 x10^3/uL (Ref: 4.5-11.0) - NORMAL", fill='black')
    d.text((50, 300), "Platelets: 250 x10^3/uL (Ref: 150-450) - NORMAL", fill='black')
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

def run_test():
    print("--- Starting AI Verification ---")
    
    # 1. Signup/Login to get Token
    print("[1] Authenticating...")
    session = requests.Session()
    
    # Try login first (user might exist)
    login_data = {"username": EMAIL, "password": PASSWORD}
    response = session.post(f"{BASE_URL}/auth/token", data=login_data)
    
    if response.status_code != 200:
        # Try signup
        print("    User not found, registering...")
        signup_data = {"email": EMAIL, "password": PASSWORD, "full_name": "AI Tester"}
        reg_res = session.post(f"{BASE_URL}/auth/signup", json=signup_data)
        if reg_res.status_code != 200:
            print(f"FAILED: Signup error: {reg_res.text}")
            return
        # Login again
        response = session.post(f"{BASE_URL}/auth/token", data=login_data)
        
    if response.status_code != 200:
        print(f"FAILED: Login error: {response.text}")
        return

    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("    SUCCESS: Authenticated.")

    # 2. Upload Image for Analysis
    print("[2] Generating and Uploading Test Report...")
    img_data = create_test_image()
    files = {'file': ('test_report.jpg', img_data, 'image/jpeg')}
    
    upload_res = session.post(f"{BASE_URL}/analysis/upload", headers=headers, files=files)
    
    if upload_res.status_code != 200:
        print(f"FAILED: Upload error: {upload_res.text}")
        return

    data = upload_res.json()
    print("    SUCCESS: Report Uploaded and Analyzed.")
    
    # 3. Validate AI Response
    print("[3] Validating AI Response...")
    print(f"    Summary: {data.get('summary')}")
    print(f"    Risk Level: {data.get('risk_level')}")
    print(f"    Findings: {len(data.get('analysis_result', []))} items found")
    
    # Check if we got the "Mock" warning or real data
    summary = data.get('summary', '')
    if "Mock" in summary:
        print("WARN: System returned MOCK data. Check Gemini API functionality.")
    else:
        print("PASS: System returned REAL AI analysis.")

if __name__ == "__main__":
    run_test()

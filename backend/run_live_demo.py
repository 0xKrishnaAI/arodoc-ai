import requests
import json
import os

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
EMAIL = "demo_user@example.com"
PASSWORD = "demo_password"
IMAGE_PATH = r"C:/Users/Krishna/.gemini/antigravity/brain/395258b3-c06e-4de4-bed3-949d06539bbe/uploaded_image_1768655852287.png"

def run_demo():
    print(f"--- Running Live Demo with User Report ---")
    print(f"Target Image: {IMAGE_PATH}")
    
    # 1. Signup/Login
    print("[1] Authenticating...")
    session = requests.Session()
    
    # Try login/signup to ensure user exists
    try:
        signup_data = {"email": EMAIL, "password": PASSWORD, "full_name": "Demo User"}
        session.post(f"{BASE_URL}/auth/signup", json=signup_data) # Ignore error if exists
    except:
        pass

    login_data = {"username": EMAIL, "password": PASSWORD}
    response = session.post(f"{BASE_URL}/auth/token", data=login_data)
    
    if response.status_code != 200:
        print(f"FAILED: Login error: {response.text}")
        return

    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("    SUCCESS: Authenticated.")

    # 2. Upload The Specific Image
    print("[2] Uploading Demo Report to AI...")
    if not os.path.exists(IMAGE_PATH):
        print(f"ERROR: Image file not found at {IMAGE_PATH}")
        return

    with open(IMAGE_PATH, 'rb') as img_file:
        files = {'file': ('demo_report.png', img_file, 'image/png')}
        upload_res = session.post(f"{BASE_URL}/analysis/upload", headers=headers, files=files)
    
    if upload_res.status_code != 200:
        print(f"FAILED: Analysis error: {upload_res.text}")
        return

    data = upload_res.json()
    print("\n--- AI ANALYSIS RESULTS ---")
    print(f"FILE: {data.get('file_url')}")
    print(f"RISK LEVEL: {data.get('risk_level')}")
    print(f"SUMMARY: {data.get('summary')}")
    print("\n[FINDINGS]")
    for item in data.get('analysis_result', []):
        print(f" - {item.get('marker')}: {item.get('value')} [{item.get('status')}]")
    
    print("\n---------------------------")

if __name__ == "__main__":
    run_demo()

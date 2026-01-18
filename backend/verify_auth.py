import requests
import sys
import uuid

BASE_URL = "http://localhost:8000/api/v1"

def verify_auth():
    print(f"Testing Auth against {BASE_URL}...")
    
    # Generate random user
    random_id = str(uuid.uuid4())[:8]
    email = f"test_{random_id}@example.com"
    password = "secretpassword123"
    full_name = f"Test User {random_id}"
    
    # 1. Signup
    print(f"\n[1] Registering user: {email}")
    signup_data = {
        "email": email,
        "password": password,
        "full_name": full_name
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        if resp.status_code != 200:
            print(f"FAILED: Signup returned {resp.status_code}")
            print(resp.text)
            sys.exit(1)
        print("SUCCESS: User created.")
            
        # 2. Login
        print(f"\n[2] Logging in...")
        login_data = {
            "username": email,
            "password": password
        }
        
        # OAuth2 form request usually sends data as form-data, not json
        resp = requests.post(f"{BASE_URL}/auth/token", data=login_data)
        if resp.status_code != 200:
            print(f"FAILED: Login returned {resp.status_code}")
            print(resp.text)
            sys.exit(1)
            
        data = resp.json()
        token = data.get("access_token")
        if not token:
            print("FAILED: No access token in response")
            sys.exit(1)
            
        print(f"SUCCESS: Received token: {token[:10]}...")
        
        # 3. Verify Token works (Optional - e.g. /users/me)
        # Assuming there is a /users/me or similar protected endpoint.
        # Based on file scan, there is @router.get("/me") in auth.py which is /auth/me -> /api/v1/auth/me
        
        print(f"\n[3] Verifying protected route /auth/me ...")
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if resp.status_code != 200:
            print(f"FAILED: /auth/me returned {resp.status_code}")
            print(resp.text)
            sys.exit(1)
            
        user_data = resp.json()
        if user_data.get("email") != email:
             print(f"FAILED: Returned email {user_data.get('email')} does not match {email}")
             sys.exit(1)
             
        print("SUCCESS: Protected route verified.")
        print("\nALL TESTS PASSED.")
        
    except requests.exceptions.ConnectionError:
        print("FAILED: Could not connect to backend. Is it running?")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED: Exception occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_auth()

import google.generativeai as genai
import os

# Use the key from the environment (or hardcoded for the test if env is tricky)
API_KEY = os.getenv("GEMINI_API_KEY")  # Load from environment variable only
genai.configure(api_key=API_KEY)

def list_models():
    print("--- Checking Available Gemini Models ---")
    try:
        models = list(genai.list_models())
        found_any = False
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(f"AVAILABLE MODEL: {m.name}")
                found_any = True
        
        if not found_any:
            print("NO MODELS FOUND that support generateContent. Check API Key permissions.")
    except Exception as e:
        print(f"ERROR LISTING MODELS: {e}")

if __name__ == "__main__":
    list_models()

import google.generativeai as genai
from ..config import settings
import json
import logging
import re
from PIL import Image
import io

# Initialize Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

logger = logging.getLogger(__name__)

async def parse_prescription(file_content: bytes, mime_type: str):
    """
    Parses a prescription image using Gemini Vision to extract medicine details.
    """
    if not settings.GEMINI_API_KEY:
        raise Exception("Gemini API Key not configured")

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Prepare the image part
        image_part = {
            "mime_type": mime_type,
            "data": file_content
        }

        prompt = """
        Analyze this prescription image and return a JSON array of medicines.
        For each medicine, extract:
        - name: Name of the medicine
        - dosage: Dosage information (e.g., 500mg)
        - timing: When to take it (e.g., Morning, Night, After food)
        - schedule_time_hint: A suggested 24h format time string (e.g., "08:00", "20:00") based on the timing. Defaults: Morning=08:00, Afternoon=14:00, Night=20:00.

        Output strictly VALID JSON in this format:
        [
            {
                "name": "Medicine Name",
                "dosage": "500mg",
                "timing": "Morning",
                "schedule_time_hint": "08:00"
            }
        ]
        """

        response = model.generate_content([prompt, image_part])
        response_text = response.text
        
        # Robust JSON extraction using Regex to find the first [ and last ]
        match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if match:
            json_str = match.group(0)
            medicines = json.loads(json_str)
            return medicines
        else:
             # Fallback if no list found (maybe it returned a single object or just text)
            raise ValueError("No JSON list found in Gemini response")

    except json.JSONDecodeError as e:
        logger.error(f"JSON Parse Error: {e} | Response: {response_text}")
        raise ValueError("Failed to parse AI response")
    except Exception as e:
        logger.error(f"Error parsing prescription: {e}")
        raise e

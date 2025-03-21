import base64
import requests
import io
from PIL import Image
from dotenv import load_dotenv
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ API KEY is not set in the .env file")

def classify_dog_condition(image_path, additional_info=""):
    """                                 
    Analyzes the uploaded dog image and returns a condition classification:
    - 🟢 Healthy
    - 🟡 Mildly Injured/Sick
    - 🟠 Moderately Injured/Sick
    - 🔴 Critical Condition
    - ⚠️ Aggressive Behavior
    """
    try:
        # Read and encode the image
        with open(image_path, "rb") as image_file:
            image_content = image_file.read()
            encoded_image = base64.b64encode(image_content).decode("utf-8")

        # Validate the image format
        try:
            img = Image.open(io.BytesIO(image_content))
            img.verify()
        except Exception as e:
            logger.error(f"Invalid image format: {str(e)}")
            return {"error": f"Invalid image format: {str(e)}"}

        # Construct the prompt
        query = (
            "Determine if the uploaded image contains a dog. Please be very specific just say 'yes its a dog' or 'no its not a dog' for this particular request "
            "Give a structured answer for the following for easier understanding with bold statements "
            "Analyze the dog's condition in the given image and classify it into one of the following categories: 🟢 Healthy, 🟡 Mildly Injured/Sick, 🟠 Moderately Injured/Sick, 🔴 Critical Condition. "
            "Provide a detailed explanation justifying your classification based on visible signs such as posture, wounds, fur condition, facial expression, or any other indicators of health or distress."
            "Suggest immediate actions the person can take to help the dog before seeking professional veterinary assistance. These recommendations should be practical and based on the severity of the condition."
        )
        if additional_info:
            query += f" Additional user notes: {additional_info}"

        # Create message payload
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": query},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
                ]
            }
        ]

        # API Request
        response = requests.post(
            GROQ_API_URL,
            json={"model": "llama-3.2-90b-vision-preview", "messages": messages, "max_tokens": 4000},
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            timeout=30
        )

        # Process response

        if response.status_code == 200:
            result = response.json()
            return result

        else:
            logger.error(f"API Error: {response.status_code} - {response.text}")
            return {"error": f"API Error: {response.status_code}"}
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}

if __name__ == "__main__":
    from fastapi.responses import HTMLResponse, JSONResponse 
    image_path = "C:/Users/LAKSHYA PALIWAL/Projects/Medic Vision Buddy/image1.jpg"  # Replace with actual uploaded image path
    additional_info = "The dog seems to be limping and has a small wound on its leg."
    result = classify_dog_condition(image_path, additional_info)
    # result = response.json()
    print(result["choices"][0]["message"]["content"])
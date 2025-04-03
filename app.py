from fastapi import FastAPI, File, UploadFile, Form, Request, HTTPException 
from fastapi.templating import Jinja2Templates 
from fastapi.responses import HTMLResponse, JSONResponse 
import base64
import requests
import io
from PIL import Image
from dotenv import load_dotenv
import os
import logging
from main import classify_dog_condition
from fastapi.staticfiles import StaticFiles
from hotspot import create_hotspot_map, data
import pandas as pd
# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")   

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ API KEY is not set in the .env file")

@app.get("/", response_class = HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html",{"request":request})

@app.post("/upload_and_query")
async def upload_and_query(file: UploadFile = File(...), additional_info: str = Form("")):
    try:
        # Read the uploaded image file
        contents = await file.read()
        
        # Validate the image format
        try:
            img = Image.open(io.BytesIO(contents))
            img.verify()
        except Exception as e:
            logger.error(f"Invalid image format: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

        # Save the image temporarily
        temp_image_path = f"temp_{file.filename}"
        with open(temp_image_path, "wb") as temp_file:
            temp_file.write(contents)

        # Call the classification function
        result = classify_dog_condition(temp_image_path, additional_info)
        
        # Remove the temporary image file after processing
        os.remove(temp_image_path)
        
        return JSONResponse(status_code=200, content=result)
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# @app.post("/create_hotspot")
# async def create_hotspot(file: UploadFile = File(...), latitude: int = Form(...), longitude: int = Form(...), time: str = Form(...),response: str = Form(...)):
#     try:
#         # Read the uploaded image file
#         contents = await file.read()
        
#         # Validate the image format
#         try:
#             img = Image.open(io.BytesIO(contents))
#             img.verify()
#         except Exception as e:
#             logger.error(f"Invalid image format: {str(e)}")
#             raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

#         # Save the image temporarily
#         temp_image_path = f"temp_{file.filename}"
#         with open(temp_image_path, "wb") as temp_file:
#             temp_file.write(contents)

#         if response.find("Healthy"):
#             severity = 1.0
#         elif response.find("Critical"):
#             severity = 5.0
#         else:
#             severity = 2.5
#         data.append([latitude, longitude, severity, time])

#         # Create DataFrame from updated data
#         df = pd.DataFrame(data, columns=["Latitude", "Longitude", "Severity", "ReportTime"])

#         # Call the function to create the hotspot map
#         create_hotspot_map(df)
        
#         # Remove the temporary image file after processing
#         os.remove(temp_image_path)

#         return JSONResponse(status_code=200, content={"message": "Hotspot map created successfully."})

#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

import uvicorn
uvicorn.run(app, port=8000)     
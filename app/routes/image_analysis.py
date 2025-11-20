# app/routes/image_analysis.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os

from mia_predictor.prediccion import predict 

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/image-analysis")
async def image_analysis(file: UploadFile = File(...)):
    if file.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Formato de imagen no soportado")

    temp_path = f"/tmp/{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = predict(temp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el modelo: {e}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return {
        "status": "success",
        "prediction": result["predicted_class"],
        "probabilities": result["probabilities"]
    }

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, database
import requests

router = APIRouter(prefix="/analysis", tags=["analysis"])

# Dependencia de sesión DB
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def analyze_blood(data: dict, db: Session = Depends(get_db)):
    """
    Recibe datos de análisis de sangre,
    llama al modelo IA y guarda el resultado en la DB.
    """

    # Llamada al modelo IA (suponiendo que corre en http://localhost:8001/predict)
    response = requests.post("http://localhost:8001/predict", json=data)
    prediction = response.json().get("prediction")

    # Guardar en la DB
    saved = crud.create_analysis(db, data, prediction)

    return {"id": saved.id, "prediction": prediction}

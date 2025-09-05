from sqlalchemy.orm import Session
from . import models

def create_analysis(db: Session, analysis_data: dict, prediction: int):
    """Inserta un análisis nuevo en la DB"""
    db_analysis = models.BloodAnalysis(**analysis_data, prediction=prediction)
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def get_analyses(db: Session, skip: int = 0, limit: int = 10):
    """Devuelve los análisis guardados"""
    return db.query(models.BloodAnalysis).offset(skip).limit(limit).all()

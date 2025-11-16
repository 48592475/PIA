from fastapi import FastAPI
from . import models, database
from .routes import analysis
from app.routes import image_analysis


# Crear tablas si no existen
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PIA Backend")


# Incluir los routers
app.include_router(analysis.router)
app.include_router(image_analysis.router)

@app.get("/")
def root():
    return {"message": "PIA Backend corriendo 🚀"}

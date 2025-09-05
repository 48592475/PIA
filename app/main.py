from fastapi import FastAPI
from . import models, database
from .routers import analysis

# Crear tablas si no existen
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PIA Backend")

# Incluir los routers
app.include_router(analysis.router)

@app.get("/")
def root():
    return {"message": "PIA Backend corriendo 🚀"}

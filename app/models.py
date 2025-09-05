from sqlalchemy import Column, Integer, Float, Boolean
from .database import Base

class BloodAnalysis(Base):
    __tablename__ = "blood_analysis"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Float)
    plasma_CA19_9 = Column(Float)
    creatinine = Column(Float)
    LYVE1 = Column(Float)
    REG1B = Column(Float)
    TFF1 = Column(Float)
    REG1A = Column(Float)
    sex_F = Column(Boolean)
    sex_M = Column(Boolean)
    CEA = Column(Float)
    THBS = Column(Float)
    prediction = Column(Integer)  # 0 = sano, 1 = riesgo

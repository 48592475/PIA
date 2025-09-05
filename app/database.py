from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Conexión a NeonDB (PostgreSQL hosteado)
SQLALCHEMY_DATABASE_URL = (
    "postgresql+psycopg2://neondb_owner:npg_m8jc4BMlwdby"
    "@ep-weathered-bird-acuuykrn-pooler.sa-east-1.aws.neon.tech:5432/neondb"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

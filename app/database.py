from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# 🔐 Change YOUR_PASSWORD to your actual Postgres password
DATABASE_URL = "postgresql+psycopg2://postgres:Vashique7%21@localhost:5432/postgres"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

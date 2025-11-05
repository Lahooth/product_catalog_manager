from sqlalchemy import Column, Integer, String, Numeric, Boolean
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    price = Column(Numeric(10, 2), nullable=False, default=0)
    active = Column(Boolean, default=True)

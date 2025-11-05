from pydantic import BaseModel, Field
from typing import Optional

class ProductBase(BaseModel):
    sku: str = Field(..., max_length=64)
    name: str = Field(..., max_length=255)
    price: float = 0
    active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    active: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    class Config:
        from_attributes = True

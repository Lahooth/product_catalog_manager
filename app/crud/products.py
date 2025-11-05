from sqlalchemy.orm import Session
from sqlalchemy import select
from .. import models, schemas

def list_products(db: Session, skip: int = 0, limit: int = 50):
    return db.execute(select(models.Product).offset(skip).limit(limit)).scalars().all()

def get_product(db: Session, product_id: int):
    return db.get(models.Product, product_id)

def get_by_sku(db: Session, sku: str):
    stmt = select(models.Product).where(models.Product.sku == sku)
    return db.execute(stmt).scalars().first()

def create_product(db: Session, payload: schemas.ProductCreate):
    if get_by_sku(db, payload.sku):
        raise ValueError("SKU already exists")
    obj = models.Product(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_product(db: Session, product_id: int, payload: schemas.ProductUpdate):
    obj = get_product(db, product_id)
    if not obj:
        return None
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_product(db: Session, product_id: int) -> bool:
    obj = get_product(db, product_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

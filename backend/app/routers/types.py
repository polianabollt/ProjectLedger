from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.LessonType)
def create_type(type_in: schemas.LessonTypeCreate, db: Session = Depends(get_db)):
    db_type = models.LessonType(**type_in.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

@router.get("/", response_model=list[schemas.LessonType])
def list_types(db: Session = Depends(get_db)):
    return db.query(models.LessonType).all()

# Atualizar (PUT)
@router.put("/{type_id}", response_model=schemas.LessonType)
def update_type(type_id: int, type_in: schemas.LessonTypeCreate, db: Session = Depends(get_db)):
    db_type = db.query(models.LessonType).filter(models.LessonType.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Type not found")

    for key, value in type_in.dict().items():
        setattr(db_type, key, value)

    db.commit()
    db.refresh(db_type)
    return db_type

# Excluir (DELETE)
@router.delete("/{type_id}", response_model=dict)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.LessonType).filter(models.LessonType.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Type not found")

    db.delete(db_type)
    db.commit()
    return {"detail": "Type deleted successfully"}

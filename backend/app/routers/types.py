from fastapi import APIRouter, Depends
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

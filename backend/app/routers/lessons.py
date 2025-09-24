from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Lesson)
def create_lesson(lesson_in: schemas.LessonCreate, db: Session = Depends(get_db)):
    db_lesson = models.Lesson(**lesson_in.dict())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.get("/", response_model=list[schemas.Lesson])
def list_lessons(db: Session = Depends(get_db)):
    return db.query(models.Lesson).all()


 

# Edit lesson
@router.put("/{lesson_id}", response_model=schemas.Lesson)
def update_lesson(lesson_id: int, lesson_data: schemas.LessonCreate, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson.name = lesson_data.name
    lesson.status = lesson_data.status
    lesson.type_id = lesson_data.type_id
    lesson.quantity = lesson_data.quantity
    db.commit()
    db.refresh(lesson)
    return lesson

# Delete lesson
@router.delete("/{lesson_id}")
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted successfully"}

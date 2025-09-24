 
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

@router.post("/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    # valida client
    cli = db.query(models.Client).filter(models.Client.id == course.client_id).first()
    if not cli:
        raise HTTPException(status_code=400, detail="Client not found")
    db_course = models.Course(name=course.name, client_id=course.client_id)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/", response_model=list[schemas.Course])
def list_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@router.get("/{course_id}/lessons", response_model=list[schemas.Lesson])
def get_course_lessons(course_id: int, db: Session = Depends(get_db)):
    return db.query(models.Lesson).filter(models.Lesson.course_id == course_id).all()

from fastapi import HTTPException

@router.get("/{course_id}/report")
def course_report(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    total = sum(lesson.total_value for lesson in course.lessons)
    return {
        "course_id": course.id,
        "course_name": course.name,
        "total_value": total,
        "lessons_count": len(course.lessons),
    }

@router.get("/report/all")
def all_courses_report(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    report = []
    for course in courses:
        total = sum(lesson.total_value for lesson in course.lessons)
        report.append({
            "course_id": course.id,
            "course_name": course.name,
            "total_value": total,
            "lessons_count": len(course.lessons),
        })
    return report

 

# Delete course
@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}

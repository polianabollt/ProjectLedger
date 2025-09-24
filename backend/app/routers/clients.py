# backend/app/routers/clients.py
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

@router.post("/", response_model=schemas.Client)
def create_client(client_in: schemas.ClientCreate, db: Session = Depends(get_db)):
    cli = models.Client(name=client_in.name)
    db.add(cli)
    db.commit()
    db.refresh(cli)
    return cli

@router.get("/", response_model=list[schemas.Client])
def list_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    cli = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not cli:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(cli)
    db.commit()
    return {"message": "Client deleted"}

# Tipos com preço por cliente (merge base + override)
@router.get("/{client_id}/types", response_model=list[schemas.ClientLessonTypeOut])
def client_types(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    types = db.query(models.LessonType).all()
    overrides = { (p.lesson_type_id): p.value for p in client.type_prices }
    out = []
    for t in types:
        cv = overrides.get(t.id)
        out.append(schemas.ClientLessonTypeOut(
            lesson_type_id=t.id,
            name=t.name,
            unit_type=t.unit_type,
            base_value=t.value,
            client_value=cv,
            effective_value=cv if cv is not None else t.value
        ))
    return out

# Upsert de preço por cliente para um tipo
@router.put("/{client_id}/types/{type_id}")
def upsert_client_type_price(client_id: int, type_id: int, payload: dict, db: Session = Depends(get_db)):
    value = float(payload.get("value"))
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    ltype = db.query(models.LessonType).filter(models.LessonType.id == type_id).first()
    if not client or not ltype:
        raise HTTPException(status_code=404, detail="Client or LessonType not found")

    rec = db.query(models.ClientLessonType).filter(
        models.ClientLessonType.client_id == client_id,
        models.ClientLessonType.lesson_type_id == type_id
    ).first()
    if rec:
        rec.value = value
    else:
        rec = models.ClientLessonType(client_id=client_id, lesson_type_id=type_id, value=value)
        db.add(rec)
    db.commit()
    return {"message": "Client type price saved", "value": value}

# Report por cliente
@router.get("/{client_id}/report", response_model=schemas.ClientReport)
def client_report(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    courses = client.courses
    lessons_count = sum(len(c.lessons) for c in courses)
    total = 0.0
    for c in courses:
        for l in c.lessons:
            total += l.total_value

    return schemas.ClientReport(
        client_id=client.id,
        client_name=client.name,
        total_value=total,
        courses_count=len(courses),
        lessons_count=lessons_count
    )

@router.get("/report/all", response_model=list[schemas.ClientReport])
def all_clients_report(db: Session = Depends(get_db)):
    clients = db.query(models.Client).all()
    out = []
    for client in clients:
        courses = client.courses
        lessons_count = sum(len(c.lessons) for c in courses)
        total = sum(l.total_value for c in courses for l in c.lessons)

        out.append(schemas.ClientReport(
            client_id=client.id,
            client_name=client.name,
            total_value=total,
            courses_count=len(courses),
            lessons_count=lessons_count
        ))
    return out

@router.get("/{client_id}/courses")
def client_courses(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    courses = []
    for c in client.courses:
        lessons_count = len(c.lessons)
        total_value = sum(l.total_value for l in c.lessons)
        courses.append({
            "id": c.id,
            "name": c.name,
            "lessons_count": lessons_count,
            "total_value": total_value,
        })

    return courses

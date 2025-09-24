# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional, List

# ---------- Clients ----------
class ClientBase(BaseModel):
    name: str

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    class Config:
        from_attributes = True

# ---------- Lesson Types ----------
class LessonTypeBase(BaseModel):
    name: str
    unit_type: str
    value: float   # base

class LessonTypeCreate(LessonTypeBase):
    pass

class LessonType(LessonTypeBase):
    id: int
    class Config:
        from_attributes = True

# para exibir preço efetivo por cliente (merge)
class ClientLessonTypeOut(BaseModel):
    lesson_type_id: int
    name: str
    unit_type: str
    base_value: float
    client_value: Optional[float] = None
    effective_value: float

# ---------- Lessons ----------
class LessonBase(BaseModel):
    name: str
    quantity: float
    status: Optional[str] = "Not started"
    course_id: int
    type_id: int

class LessonCreate(LessonBase):
    pass

class Lesson(LessonBase):
    id: int
    total_value: float
    class Config:
        from_attributes = True

# ---------- Courses ----------
class CourseBase(BaseModel):
    name: str
    client_id: int

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    lessons: List[Lesson] = []
    class Config:
        from_attributes = True

# ---------- Reports ----------
class CourseReport(BaseModel):
    course_id: int
    course_name: str
    total_value: float
    lessons_count: int

class ClientReport(BaseModel):
    client_id: int
    client_name: str
    total_value: float
    courses_count: int
    lessons_count: int

# ---------- Client Courses ----------
class ClientCourseOut(BaseModel):
    id: int
    name: str
    lessons_count: int
    total_value: float

    class Config:
        from_attributes = True

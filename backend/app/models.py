# backend/app/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    courses = relationship("Course", back_populates="client", cascade="all, delete-orphan")
    type_prices = relationship("ClientLessonType", back_populates="client", cascade="all, delete-orphan")

class LessonType(Base):
    __tablename__ = "lesson_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    unit_type = Column(String, default="hour")   # "hour" | "unit"
    value = Column(Float)                         # valor base (fallback)

    lessons = relationship("Lesson", back_populates="type")
    client_prices = relationship("ClientLessonType", back_populates="lesson_type")

class ClientLessonType(Base):
    __tablename__ = "client_lesson_types"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), index=True, nullable=False)
    lesson_type_id = Column(Integer, ForeignKey("lesson_types.id"), index=True, nullable=False)
    value = Column(Float, nullable=False)  # preço do tipo para ESTE cliente

    client = relationship("Client", back_populates="type_prices")
    lesson_type = relationship("LessonType", back_populates="client_prices")

    __table_args__ = (UniqueConstraint("client_id", "lesson_type_id", name="uq_client_type"),)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), index=True, nullable=False)

    client = relationship("Client", back_populates="courses")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    quantity = Column(Float, default=1)  # horas ou unidades
    status = Column(String, default="Not started")

    course_id = Column(Integer, ForeignKey("courses.id"))
    type_id = Column(Integer, ForeignKey("lesson_types.id"))

    course = relationship("Course", back_populates="lessons")
    type = relationship("LessonType", back_populates="lessons")

    @property
    def unit_value(self) -> float:
        """
        Preço efetivo:
        - se existir preço para o cliente (client_lesson_types), usa ele
        - senão, cai no valor base do LessonType
        """
        try:
            client = self.course.client if self.course else None
            if client and client.type_prices:
                for p in client.type_prices:
                    if p.lesson_type_id == self.type_id:
                        return p.value
        except Exception:
            pass
        return self.type.value if self.type else 0.0

    @property
    def total_value(self) -> float:
        return (self.quantity or 0.0) * (self.unit_value or 0.0)

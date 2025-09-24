from fastapi import FastAPI
from .routers import courses, lessons, types, clients
from .database import engine, Base

# Criar tabelas no banco (SQLite por enquanto)
Base.metadata.create_all(bind=engine)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ProjectLedger API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

# Rotas
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
app.include_router(types.router, prefix="/types", tags=["lesson types"])
app.include_router(clients.router, prefix="/clients", tags=["clients"])


@app.get("/")
def root():
    return {"message": "Welcome to ProjectLedger API"}



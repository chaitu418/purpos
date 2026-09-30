from datetime import datetime
from uuid import uuid4

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Purpose


app = FastAPI(
    title="Purpos API",
    description="Backend API for the Purpos Bengaluru MVP",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PurposeCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    area: str = Field(min_length=2, max_length=80)
    purpose: str = Field(min_length=10, max_length=1000)
    timeframe: str
    budget: str


class PurposeResponse(PurposeCreate):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "purpos-api", "database": "postgresql"}


@app.get("/api/purposes", response_model=list[PurposeResponse])
def list_purposes(db: Session = Depends(get_db)):
    statement = select(Purpose).order_by(Purpose.created_at.desc())
    return db.scalars(statement).all()


@app.post("/api/purposes", response_model=PurposeResponse, status_code=201)
def create_purpose(
    payload: PurposeCreate,
    db: Session = Depends(get_db),
):
    new_purpose = Purpose(
        id=str(uuid4()),
        **payload.model_dump(),
    )

    db.add(new_purpose)
    db.commit()
    db.refresh(new_purpose)

    return new_purpose
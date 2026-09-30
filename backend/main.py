from datetime import datetime
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import ConnectionRequest, Purpose


app = FastAPI(
    title="Purpos API",
    description="Backend API for the Purpos Bengaluru MVP",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8081"],
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


class ConnectionRequestCreate(BaseModel):
    requester_name: str = Field(min_length=2, max_length=80)
    target_purpose_id: str


class ConnectionRequestResponse(ConnectionRequestCreate):
    id: str
    status: str
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


@app.post(
    "/api/connection-requests",
    response_model=ConnectionRequestResponse,
    status_code=201,
)
def create_connection_request(
    payload: ConnectionRequestCreate,
    db: Session = Depends(get_db),
):
    target_purpose = db.get(Purpose, payload.target_purpose_id)

    if target_purpose is None:
        raise HTTPException(status_code=404, detail="Purpose not found")

    connection_request = ConnectionRequest(
        id=str(uuid4()),
        **payload.model_dump(),
    )

    db.add(connection_request)
    db.commit()
    db.refresh(connection_request)

    return connection_request

@app.get(
    "/api/connection-requests",
    response_model=list[ConnectionRequestResponse],
)
def list_connection_requests(db: Session = Depends(get_db)):
    statement = select(ConnectionRequest).order_by(
        ConnectionRequest.created_at.desc()
    )
    return db.scalars(statement).all()
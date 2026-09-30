from fastapi.testclient import TestClient

from backend.main import app


def test_health_check_returns_postgresql_status():
    with TestClient(app) as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "purpos-api",
        "database": "postgresql",
    }
from uuid import uuid4

from fastapi.testclient import TestClient

from backend.main import app


def test_health_check_returns_postgresql_status():
    with TestClient(app) as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "purpos-api",
        "database": "postgresql",
    }


def test_create_and_list_purpose():
    unique_name = f"Test builder {uuid4().hex[:8]}"

    payload = {
        "name": unique_name,
        "area": "Koramangala",
        "purpose": "Testing the Purpos PostgreSQL purpose API.",
        "timeframe": "This week",
        "budget": "Not decided",
    }

    with TestClient(app) as client:
        create_response = client.post("/api/purposes", json=payload)
        list_response = client.get("/api/purposes")

    assert create_response.status_code == 201

    created_purpose = create_response.json()
    assert created_purpose["name"] == unique_name
    assert created_purpose["area"] == "Koramangala"

    assert list_response.status_code == 200
    assert any(
        purpose["id"] == created_purpose["id"]
        for purpose in list_response.json()
    )
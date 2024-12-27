import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_evaluation():
    response = client.get("/evaluation")
    assert response.status_code == 200
    assert response.json() == {"message": "Evaluation retrieved successfully"}

def test_create_evaluation():
    response = client.post("/evaluation", json={"data": "test data"})
    assert response.status_code == 201
    assert response.json() == {"message": "Evaluation created successfully"}

def test_update_evaluation():
    response = client.put("/evaluation/1", json={"data": "updated data"})
    assert response.status_code == 200
    assert response.json() == {"message": "Evaluation updated successfully"}

def test_delete_evaluation():
    response = client.delete("/evaluation/1")
    assert response.status_code == 204
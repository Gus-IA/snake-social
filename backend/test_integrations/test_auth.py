import pytest

def test_register_user(client):
    response = client.post(
        "/api/auth/signup",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login_user(client):
    # First register
    client.post(
        "/api/auth/signup",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "securepassword123"
        }
    )
    
    # Then login
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    # verify we get user object back
    assert data["username"] == "loginuser"
    assert data["email"] == "login@example.com"
    assert "id" in data

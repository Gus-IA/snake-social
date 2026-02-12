from fastapi.testclient import TestClient

def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Snake Social API"}

def test_auth_workflow(client: TestClient):
    # Signup
    signup_payload = {
        "email": "test@example.com",
        "password": "password123",
        "username": "TestUser"
    }
    response = client.post("/api/auth/signup", json=signup_payload)
    assert response.status_code == 201
    user_data = response.json()
    assert user_data["email"] == signup_payload["email"]
    assert user_data["username"] == signup_payload["username"]
    assert "id" in user_data

    # Login
    login_payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    login_data = response.json()
    assert login_data["email"] == login_payload["email"]
    
    # Login Fail
    fail_payload = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=fail_payload)
    assert response.status_code == 401

def test_leaderboard_workflow(client: TestClient):
    # Submit Score
    score_payload = {
        "score": 1000,
        "mode": "walls",
        "username": "TestUser"
    }
    response = client.post("/api/leaderboard", json=score_payload)
    assert response.status_code == 201
    entry = response.json()
    assert entry["score"] == 1000
    assert entry["mode"] == "walls"

    # Get Leaderboard
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    entries = response.json()
    assert len(entries) > 0
    
    # Filter Leaderboard
    response = client.get("/api/leaderboard?mode=walls")
    assert response.status_code == 200
    filtered_entries = response.json()
    assert all(e["mode"] == "walls" for e in filtered_entries)

def test_game_routes(client: TestClient):
    # Get Active Players
    response = client.get("/api/games/active")
    assert response.status_code == 200
    players = response.json()
    assert isinstance(players, list)
    
    if len(players) > 0:
        player_id = players[0]["id"]
        # Get Game State
        response = client.get(f"/api/games/{player_id}")
        assert response.status_code == 200
        state = response.json()
        assert "snake" in state
        assert "food" in state
        assert "direction" in state

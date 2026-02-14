def test_submit_score(client):
    response = client.post(
        "/api/leaderboard",
        json={
            "username": "scorer",
            "score": 100,
            "mode": "walls"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "scorer"
    assert data["score"] == 100
    assert data["mode"] == "walls"
    assert "id" in data
    assert "date" in data

def test_get_leaderboard(client):
    # Submit some scores
    client.post(
        "/api/leaderboard",
        json={"username": "p1", "score": 50, "mode": "walls"}
    )
    client.post(
        "/api/leaderboard",
        json={"username": "p2", "score": 80, "mode": "walls"}
    )
    client.post(
        "/api/leaderboard",
        json={"username": "p3", "score": 60, "mode": "pass-through"}
    )
    
    # Get leaderboard for walls
    response = client.get("/api/leaderboard?mode=walls")
    assert response.status_code == 200
    data = response.json()
    # Should contain p1 and p2, but not p3
    usernames = [entry["username"] for entry in data]
    assert "p1" in usernames
    assert "p2" in usernames
    assert "p3" not in usernames
    
    # Check ordering if implemented (usually high score first)
    # The current implementation in routes/leaderboard.py just calls crud.get_leaderboard
    # We'd expect crud to order them, but let's just check existence for now.

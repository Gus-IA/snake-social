import pytest
from datetime import datetime, UTC
from src.database import ActivePlayerDB

def test_get_active_players_empty(client):
    response = client.get("/api/games/active")
    assert response.status_code == 200
    assert response.json() == []

def test_get_active_players_with_data(client, session):
    # Manually add an active player to the test session
    player = ActivePlayerDB(
        id="test-player-id",
        username="player1",
        score=10,
        mode="walls",
        startedAt=datetime.now(UTC)
    )
    session.add(player)
    session.commit()
    
    response = client.get("/api/games/active")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["username"] == "player1"
    # Route adds a random offset to score
    assert data[0]["score"] >= 10

def test_get_player_game_state(client, session):
    player = ActivePlayerDB(
        id="state-player-id",
        username="player2",
        score=25,
        mode="pass-through",
        startedAt=datetime.now(UTC)
    )
    session.add(player)
    session.commit()
    
    response = client.get("/api/games/state-player-id")
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 25
    assert data["gameOver"] is False
    assert "snake" in data

def test_get_player_game_state_not_found(client):
    response = client.get("/api/games/non-existent")
    assert response.status_code == 404

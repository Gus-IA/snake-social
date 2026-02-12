from fastapi import APIRouter, HTTPException
from typing import List
from ..models import ActivePlayer, GameState, Position, Direction
from ..database import get_active_players, get_active_player, ActivePlayer
import random

router = APIRouter()

@router.get("/active", response_model=List[ActivePlayer])
async def get_active_players_route():
    # Simulate dynamic scores
    players = get_active_players()
    return [
        ActivePlayer(
            **{**p.model_dump(), "score": p.score + random.randint(0, 50)}
        ) for p in players
    ]

@router.get("/{player_id}", response_model=GameState)
async def get_player_game_state(player_id: str):
    player = get_active_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player or game not found")
    
    # Return dummy state for watch mode
    return GameState(
        snake=[Position(x=10, y=10)],
        food=Position(x=5, y=5),
        direction=Direction.RIGHT,
        score=player.score, # Use the player's base score
        gameOver=False
    )

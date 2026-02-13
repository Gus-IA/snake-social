from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from ..models import ActivePlayer, GameState, Position, Direction, GameMode
from ..database import get_db
from .. import crud
import random

router = APIRouter()

@router.get("/active", response_model=List[ActivePlayer])
async def get_active_players_route(db: Session = Depends(get_db)):
    # Simulate dynamic scores
    db_players = crud.get_active_players(db)
    return [
        ActivePlayer(
            id=p.id,
            username=p.username,
            score=p.score + random.randint(0, 50),
            mode=GameMode(p.mode.value),
            startedAt=p.startedAt
        )
        for p in db_players
    ]

@router.get("/{player_id}", response_model=GameState)
async def get_player_game_state(player_id: str, db: Session = Depends(get_db)):
    player = crud.get_active_player(db, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player or game not found")
    
    # Return dummy state for watch mode
    return GameState(
        snake=[Position(x=10, y=10)],
        food=Position(x=5, y=5),
        direction=Direction.RIGHT,
        score=player.score,  # Use the player's base score
        gameOver=False
    )

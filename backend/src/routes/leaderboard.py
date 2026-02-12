from fastapi import APIRouter, Query
from typing import List, Optional
from datetime import date
from ..models import LeaderboardEntry, ScoreSubmit, GameMode
from ..database import get_leaderboard, add_score
import time

router = APIRouter()

@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard_entries(mode: Optional[GameMode] = None):
    return get_leaderboard(mode)

@router.post("", response_model=LeaderboardEntry, status_code=201)
async def submit_score(score_in: ScoreSubmit):
    new_entry = LeaderboardEntry(
        id=str(int(time.time())),
        username=score_in.username,
        score=score_in.score,
        mode=score_in.mode,
        date=date.today()
    )
    add_score(new_entry)
    return new_entry

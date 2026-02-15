from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..models import LeaderboardEntry, ScoreSubmit, GameMode
from ..database import get_db
from .. import crud
import uuid

router = APIRouter()

@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard_entries(
    mode: Optional[GameMode] = None,
    db: Session = Depends(get_db)
):
    db_entries = crud.get_leaderboard(db, mode)
    return [
        LeaderboardEntry(
            id=entry.id,
            username=entry.username,
            score=entry.score,
            mode=GameMode(entry.mode.value),
            date=entry.date
        )
        for entry in db_entries
    ]

@router.post("", response_model=LeaderboardEntry, status_code=201)
async def submit_score(score_in: ScoreSubmit, db: Session = Depends(get_db)):
    print(f"📥 Received score submission: {score_in.model_dump()}")
    entry_id = str(uuid.uuid4())
    try:
        db_entry = crud.add_score(
            db=db,
            entry_id=entry_id,
            username=score_in.username,
            score=score_in.score,
            mode=score_in.mode,
            entry_date=date.today()
        )
        print(f"✅ Score saved successfully: {db_entry.id}")
        return LeaderboardEntry(
            id=db_entry.id,
            username=db_entry.username,
            score=db_entry.score,
            mode=GameMode(db_entry.mode.value),
            date=db_entry.date
        )
    except Exception as e:
        print(f"❌ Failed to save score: {e}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))

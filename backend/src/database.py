from typing import List, Optional, Dict
from datetime import date, datetime
from .models import User, LeaderboardEntry, ActivePlayer, GameMode, Position

# Mock Data Storage
users_db: Dict[str, Dict] = {
    "demo@snake.io": {
        "user": User(id="1", username="SnakeMaster", email="demo@snake.io"),
        "password": "demo123" # In a real app, this would be hashed
    }
}

leaderboard_db: List[LeaderboardEntry] = [
    LeaderboardEntry(id="1", username="PixelViper", score=2450, mode=GameMode.WALLS, date=date(2026, 2, 9)),
    LeaderboardEntry(id="2", username="NeonByte", score=1980, mode=GameMode.PASS_THROUGH, date=date(2026, 2, 8)),
    LeaderboardEntry(id="3", username="GridRunner", score=1750, mode=GameMode.WALLS, date=date(2026, 2, 8)),
    LeaderboardEntry(id="4", username="ByteSnake", score=1620, mode=GameMode.PASS_THROUGH, date=date(2026, 2, 7)),
    LeaderboardEntry(id="5", username="CyberCoil", score=1400, mode=GameMode.WALLS, date=date(2026, 2, 7)),
]

active_players_db: List[ActivePlayer] = [
    ActivePlayer(id="p1", username="PixelViper", score=340, mode=GameMode.WALLS, startedAt=datetime.now()),
    ActivePlayer(id="p2", username="NeonByte", score=180, mode=GameMode.PASS_THROUGH, startedAt=datetime.now()),
]

next_user_id = 100

def get_user_by_email(email: str) -> Optional[Dict]:
    return users_db.get(email)

def create_user(user: User, password: str):
    users_db[user.email] = {"user": user, "password": password}

def get_leaderboard(mode: Optional[GameMode] = None) -> List[LeaderboardEntry]:
    if mode:
        return [entry for entry in leaderboard_db if entry.mode == mode]
    return leaderboard_db

def add_score(entry: LeaderboardEntry):
    leaderboard_db.append(entry)
    leaderboard_db.sort(key=lambda x: x.score, reverse=True)

def get_active_players() -> List[ActivePlayer]:
    return active_players_db

def get_active_player(player_id: str) -> Optional[ActivePlayer]:
    for player in active_players_db:
        if player.id == player_id:
            return player
    return None

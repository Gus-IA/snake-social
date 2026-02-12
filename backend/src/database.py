from typing import List, Optional, Dict
from datetime import date, datetime
from .models import User, LeaderboardEntry, ActivePlayer, GameMode, Position

# Mock Data Storage
users_db: Dict[str, Dict] = {
    "demo@snake.io": {
        "user": User(id="1", username="SnakeMaster", email="demo@snake.io"),
        "password": "demo123"
    },
    "viper@snake.io": {
        "user": User(id="2", username="ViperKing", email="viper@snake.io"),
        "password": "viper123"
    },
    "test@snake.io": {
        "user": User(id="3", username="TestUser", email="test@snake.io"),
        "password": "password"
    }
}

leaderboard_db: List[LeaderboardEntry] = [
    LeaderboardEntry(id="1", username="PixelViper", score=2450, mode=GameMode.WALLS, date=date(2026, 2, 9)),
    LeaderboardEntry(id="2", username="NeonByte", score=1980, mode=GameMode.PASS_THROUGH, date=date(2026, 2, 8)),
    LeaderboardEntry(id="3", username="GridRunner", score=1750, mode=GameMode.WALLS, date=date(2026, 2, 8)),
    LeaderboardEntry(id="4", username="ByteSnake", score=1620, mode=GameMode.PASS_THROUGH, date=date(2026, 2, 7)),
    LeaderboardEntry(id="5", username="CyberCoil", score=1400, mode=GameMode.WALLS, date=date(2026, 2, 7)),
    LeaderboardEntry(id="6", username="RetroFang", score=1350, mode=GameMode.WALLS, date=date(2026, 2, 6)),
    LeaderboardEntry(id="7", username="GlitchWorm", score=1200, mode=GameMode.PASS_THROUGH, date=date(2026, 2, 6)),
    LeaderboardEntry(id="8", username="VectorSlide", score=1100, mode=GameMode.WALLS, date=date(2026, 2, 5)),
    LeaderboardEntry(id="9", username="SolidSnake", score=900, mode=GameMode.PASS_THROUGH, date=date(2026, 2, 4)),
    LeaderboardEntry(id="10", username="LiquidOcelot", score=850, mode=GameMode.WALLS, date=date(2026, 2, 4)),
]

active_players_db: List[ActivePlayer] = [
    ActivePlayer(id="p1", username="PixelViper", score=340, mode=GameMode.WALLS, startedAt=datetime.now()),
    ActivePlayer(id="p2", username="NeonByte", score=180, mode=GameMode.PASS_THROUGH, startedAt=datetime.now()),
    ActivePlayer(id="p3", username="GridRunner", score=50, mode=GameMode.WALLS, startedAt=datetime.now()),
    ActivePlayer(id="p4", username="NewbieSnake", score=10, mode=GameMode.PASS_THROUGH, startedAt=datetime.now()),
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

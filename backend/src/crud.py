from sqlalchemy.orm import Session
from typing import Optional, List
import bcrypt
from .database import UserDB, LeaderboardEntryDB, ActivePlayerDB, GameModeEnum
from .models import User, LeaderboardEntry, ActivePlayer, GameMode

# Password hashing
def hash_password(password: str) -> str:
    """Hash a password for storing"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# User CRUD operations
def get_user_by_email(db: Session, email: str) -> Optional[UserDB]:
    """Get user by email address"""
    return db.query(UserDB).filter(UserDB.email == email).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[UserDB]:
    """Get user by ID"""
    return db.query(UserDB).filter(UserDB.id == user_id).first()

def create_user(db: Session, user_id: str, email: str, username: str, password: str) -> UserDB:
    """Create a new user with hashed password"""
    hashed_password = hash_password(password)
    db_user = UserDB(
        id=user_id,
        email=email,
        username=username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Leaderboard CRUD operations
def get_leaderboard(db: Session, mode: Optional[GameMode] = None) -> List[LeaderboardEntryDB]:
    """Get leaderboard entries, optionally filtered by game mode"""
    query = db.query(LeaderboardEntryDB)
    if mode:
        # Convert Pydantic GameMode to SQLAlchemy GameModeEnum
        mode_enum = GameModeEnum(mode.value)
        query = query.filter(LeaderboardEntryDB.mode == mode_enum)
    return query.order_by(LeaderboardEntryDB.score.desc()).all()

def add_score(db: Session, entry_id: str, username: str, score: int, mode: GameMode, entry_date) -> LeaderboardEntryDB:
    """Add a new score to the leaderboard"""
    mode_enum = GameModeEnum(mode.value)
    db_entry = LeaderboardEntryDB(
        id=entry_id,
        username=username,
        score=score,
        mode=mode_enum,
        date=entry_date
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# Active Players CRUD operations
def get_active_players(db: Session) -> List[ActivePlayerDB]:
    """Get all active players"""
    return db.query(ActivePlayerDB).order_by(ActivePlayerDB.score.desc()).all()

def get_active_player(db: Session, player_id: str) -> Optional[ActivePlayerDB]:
    """Get active player by ID"""
    return db.query(ActivePlayerDB).filter(ActivePlayerDB.id == player_id).first()

def create_active_player(db: Session, player_id: str, username: str, score: int, mode: GameMode, started_at) -> ActivePlayerDB:
    """Create a new active player"""
    mode_enum = GameModeEnum(mode.value)
    db_player = ActivePlayerDB(
        id=player_id,
        username=username,
        score=score,
        mode=mode_enum,
        startedAt=started_at
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def delete_active_player(db: Session, player_id: str) -> bool:
    """Delete an active player by ID"""
    player = get_active_player(db, player_id)
    if player:
        db.delete(player)
        db.commit()
        return True
    return False

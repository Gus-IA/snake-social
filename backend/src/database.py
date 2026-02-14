from sqlalchemy import create_engine, Column, String, Integer, Date, DateTime, Enum as SQLEnum
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from datetime import date, datetime
from .config import settings
import enum

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=settings.connect_args,
    echo=False  # Set to True for SQL logging during development
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()

# Enums
class GameModeEnum(str, enum.Enum):
    PASS_THROUGH = "pass-through"
    WALLS = "walls"

# SQLAlchemy Models
class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class LeaderboardEntryDB(Base):
    __tablename__ = "leaderboard"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, nullable=False, index=True)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameModeEnum), nullable=False)
    date = Column(Date, nullable=False)

class ActivePlayerDB(Base):
    __tablename__ = "active_players"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameModeEnum), nullable=False)
    startedAt = Column(DateTime, nullable=False)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database (create tables)
def init_db():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)

# Drop all tables (useful for testing)
def drop_db():
    """Drop all tables in the database"""
    Base.metadata.drop_all(bind=engine)

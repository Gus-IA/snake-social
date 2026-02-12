from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime
from enum import Enum

class GameMode(str, Enum):
    PASS_THROUGH = "pass-through"
    WALLS = "walls"

class Direction(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    LEFT = "LEFT"
    RIGHT = "RIGHT"

class Position(BaseModel):
    x: int
    y: int

class User(BaseModel):
    id: str
    username: str
    email: EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LeaderboardEntry(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    date: date

class App(BaseModel):
    pass

class ScoreSubmit(BaseModel):
    score: int
    mode: GameMode
    username: str

class ActivePlayer(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    startedAt: datetime

class GameState(BaseModel):
    snake: List[Position]
    food: Position
    direction: Direction
    score: int
    gameOver: bool

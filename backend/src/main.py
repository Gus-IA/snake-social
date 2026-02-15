from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, leaderboard, game
from .database import init_db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    init_db()
    yield

app = FastAPI(
    title="Snake Social API",
    description="Backend API for the Snake Social application",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["Leaderboard"])
app.include_router(game.router, prefix="/api/games", tags=["Game"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Snake Social API"}

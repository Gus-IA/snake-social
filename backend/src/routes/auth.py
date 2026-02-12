from fastapi import APIRouter, HTTPException, status
from ..models import User, UserLogin, UserCreate
from ..database import get_user_by_email, create_user, next_user_id

router = APIRouter()

@router.post("/login", response_model=User)
async def login(credentials: UserLogin):
    entry = get_user_by_email(credentials.email)
    if not entry or entry["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    return entry["user"]

@router.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    if get_user_by_email(user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Simple ID generation for mock
    new_id = str(len(get_user_by_email("demo@snake.io") or []) + 100 + 1) # This is a bit hacky, let's fix
    # Actually database.py has next_user_id but it is not exported well for modification
    # Let's just use UUID or random for now, or timestamp
    import time
    new_id = str(int(time.time()))

    new_user = User(
        id=new_id,
        username=user_in.username,
        email=user_in.email
    )
    create_user(new_user, user_in.password)
    return new_user

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from ..models import User, UserLogin, UserCreate
from ..database import get_db
from .. import crud
import uuid

router = APIRouter()

@router.post("/login", response_model=User)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, credentials.email)
    if not db_user or not crud.verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    return User(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email
    )

@router.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Generate UUID for new user
    new_id = str(uuid.uuid4())
    
    db_user = crud.create_user(
        db=db,
        user_id=new_id,
        email=user_in.email,
        username=user_in.username,
        password=user_in.password
    )
    
    return User(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email
    )

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}

#!/usr/bin/env python3
"""
Seed the database with demo data
"""

import sys
import os
from datetime import date, datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.database import SessionLocal, UserDB, LeaderboardEntryDB, ActivePlayerDB, GameModeEnum
from src.crud import hash_password


def seed_database():
    """Populate the database with demo data"""
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database...")
        
        # Create demo users
        users_data = [
            ("1", "SnakeMaster", "demo@snake.io", "demo123"),
            ("2", "ViperKing", "viper@snake.io", "viper123"),
            ("3", "TestUser", "test@snake.io", "password"),
        ]
        
        print("\n👤 Creating users...")
        for user_id, username, email, password in users_data:
            # Check if user already exists
            existing = db.query(UserDB).filter(UserDB.email == email).first()
            if existing:
                print(f"  ⚠️  User {email} already exists, skipping")
                continue
                
            user = UserDB(
                id=user_id,
                username=username,
                email=email,
                hashed_password=hash_password(password)
            )
            db.add(user)
            print(f"  ✅ Created user: {username} ({email})")
        
        db.commit()
        
        # Create leaderboard entries
        leaderboard_data = [
            ("1", "PixelViper", 2450, GameModeEnum.WALLS, date(2026, 2, 9)),
            ("2", "NeonByte", 1980, GameModeEnum.PASS_THROUGH, date(2026, 2, 8)),
            ("3", "GridRunner", 1750, GameModeEnum.WALLS, date(2026, 2, 8)),
            ("4", "ByteSnake", 1620, GameModeEnum.PASS_THROUGH, date(2026, 2, 7)),
            ("5", "CyberCoil", 1400, GameModeEnum.WALLS, date(2026, 2, 7)),
            ("6", "RetroFang", 1350, GameModeEnum.WALLS, date(2026, 2, 6)),
            ("7", "GlitchWorm", 1200, GameModeEnum.PASS_THROUGH, date(2026, 2, 6)),
            ("8", "VectorSlide", 1100, GameModeEnum.WALLS, date(2026, 2, 5)),
            ("9", "SolidSnake", 900, GameModeEnum.PASS_THROUGH, date(2026, 2, 4)),
            ("10", "LiquidOcelot", 850, GameModeEnum.WALLS, date(2026, 2, 4)),
        ]
        
        print("\n🏆 Creating leaderboard entries...")
        for entry_id, username, score, mode, entry_date in leaderboard_data:
            # Check if entry already exists
            existing = db.query(LeaderboardEntryDB).filter(LeaderboardEntryDB.id == entry_id).first()
            if existing:
                print(f"  ⚠️  Leaderboard entry {entry_id} already exists, skipping")
                continue
                
            entry = LeaderboardEntryDB(
                id=entry_id,
                username=username,
                score=score,
                mode=mode,
                date=entry_date
            )
            db.add(entry)
            print(f"  ✅ Created entry: {username} - {score} points ({mode.value})")
        
        db.commit()
        
        # Create active players
        active_players_data = [
            ("p1", "PixelViper", 340, GameModeEnum.WALLS),
            ("p2", "NeonByte", 180, GameModeEnum.PASS_THROUGH),
            ("p3", "GridRunner", 50, GameModeEnum.WALLS),
            ("p4", "NewbieSnake", 10, GameModeEnum.PASS_THROUGH),
        ]
        
        print("\n🎮 Creating active players...")
        for player_id, username, score, mode in active_players_data:
            # Check if player already exists
            existing = db.query(ActivePlayerDB).filter(ActivePlayerDB.id == player_id).first()
            if existing:
                print(f"  ⚠️  Active player {player_id} already exists, skipping")
                continue
                
            player = ActivePlayerDB(
                id=player_id,
                username=username,
                score=score,
                mode=mode,
                startedAt=datetime.now()
            )
            db.add(player)
            print(f"  ✅ Created player: {username} - {score} points ({mode.value})")
        
        db.commit()
        
        print("\n✨ Database seeded successfully!")
        print("\n📋 Demo credentials:")
        print("  Email: demo@snake.io")
        print("  Password: demo123")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

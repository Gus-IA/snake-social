"""Initial database schema

Revision ID: 001
Revises: 
Create Date: 2026-02-13 15:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create leaderboard table
    op.create_table(
        'leaderboard',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('mode', sa.Enum('pass-through', 'walls', name='gammodeenum'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_leaderboard_id'), 'leaderboard', ['id'], unique=False)
    op.create_index(op.f('ix_leaderboard_username'), 'leaderboard', ['username'], unique=False)

    # Create active_players table
    op.create_table(
        'active_players',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('mode', sa.Enum('pass-through', 'walls', name='gammodeenum'), nullable=False),
        sa.Column('startedAt', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_active_players_id'), 'active_players', ['id'], unique=False)


def downgrade() -> None:
    # Drop tables
    op.drop_index(op.f('ix_active_players_id'), table_name='active_players')
    op.drop_table('active_players')
    
    op.drop_index(op.f('ix_leaderboard_username'), table_name='leaderboard')
    op.drop_index(op.f('ix_leaderboard_id'), table_name='leaderboard')
    op.drop_table('leaderboard')
    
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')

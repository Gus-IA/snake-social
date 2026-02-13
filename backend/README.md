# Snake Social Backend

FastAPI backend for the Snake Social application with PostgreSQL/SQLite database support via SQLAlchemy.

## Features

- RESTful API with FastAPI
- SQLAlchemy ORM with PostgreSQL and SQLite support
- Database migrations with Alembic
- Password hashing with bcrypt
- CORS enabled for frontend integration
- Comprehensive test suite

## Prerequisites

- Python 3.13+
- [uv](https://github.com/astral-sh/uv) package manager
- PostgreSQL (optional, for production)

## Quick Start

### 1. Install Dependencies

```bash
make install
```

### 2. Configure Database

The application uses SQLite by default for development. To use PostgreSQL, create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your database URL:

```bash
# For SQLite (default)
DATABASE_URL=sqlite:///./snake_social.db

# For PostgreSQL
DATABASE_URL=postgresql://username:password@localhost/snake_social
```

### 3. Run Database Migrations

```bash
make migrate
```

This creates all the necessary database tables.

### 4. Seed Demo Data (Optional)

```bash
make seed
```

This populates the database with demo users and leaderboard entries.

**Demo credentials:**
- Email: `demo@snake.io`
- Password: `demo123`

### 5. Start Development Server

```bash
make dev
```

The API will be available at `http://localhost:3000`

## Database Management

### Available Commands

- `make migrate` - Run database migrations
- `make seed` - Populate database with demo data
- `make db-reset` - Reset SQLite database (deletes and recreates)

### Using PostgreSQL

1. Create a PostgreSQL database:
   ```bash
   createdb snake_social
   ```

2. Set the DATABASE_URL in `.env`:
   ```bash
   DATABASE_URL=postgresql://localhost/snake_social
   ```

3. Run migrations:
   ```bash
   make migrate
   make seed
   ```

## Development

### Running Tests

```bash
make test
```

Tests use an in-memory SQLite database and are isolated from your development database.

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/docs`
- ReDoc: `http://localhost:3000/redoc`
velopment

Run the development server:

```bash
uv run uvicorn src.main:app --reload
The API will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

## Testing

Run tests:

```bash
uv run pytest
```

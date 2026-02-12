# Snake Social Backend

FastAPI backend for Snake Social.

## Setup

1. Install `uv`:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
2. Install dependencies:
   ```bash
   uv sync
   ```

## Development

Run the development server:

```bash
uv run uvicorn src.main:app --reload
```

The API will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

## Testing

Run tests:

```bash
uv run pytest
```

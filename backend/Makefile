.PHONY: help install dev test clean lint format

help:
	@echo "Snake Social Backend - Available commands:"
	@echo "  make install    - Install dependencies using uv"
	@echo "  make dev        - Run development server with hot reload"
	@echo "  make test       - Run tests with pytest"
	@echo "  make lint       - Run linting (if configured)"
	@echo "  make format     - Format code (if configured)"
	@echo "  make clean      - Clean cache and temporary files"

install:
	uv sync

dev:
	uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 3000

test:
	uv run pytest

lint:
	@echo "Linting not configured yet. Add ruff or pylint to dev dependencies."

format:
	@echo "Formatting not configured yet. Add ruff or black to dev dependencies."

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .pytest_cache -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

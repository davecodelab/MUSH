#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# If running from repo root, navigate into backend
if [ -d "backend" ]; then
  cd backend
fi

echo "==> Installing uv..."
pip install uv

echo "==> Installing dependencies with uv..."
uv sync --active

echo "==> Applying database migrations..."
uv run python manage.py migrate

echo "==> Seeding rooms from MUSHIA.xlsx..."
uv run python manage.py import_rooms MUSHIA.xlsx

echo "==> Collecting static assets..."
uv run python manage.py collectstatic --noinput

echo "==> Build finished successfully!"

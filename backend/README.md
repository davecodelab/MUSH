# Mushia Hostel Reservation System - Backend API

Production-ready Django REST Framework backend for Mushia Hostel (KNUST, Kumasi). Powers live room inventory, 15-minute space holds, first-come-first-served gender policy, Paystack payment processing, and privacy-protected roommate directories.

---

## 🛠️ Tech Stack
- **Framework**: Django 6.1 + Django REST Framework (DRF)
- **Auth**: SimpleJWT with HttpOnly Cookies (`access_token`, `refresh_token`)
- **Package Manager**: [`uv`](https://github.com/astral-sh/uv) (fast Python package manager)
- **Payments**: Paystack API with HMAC-SHA512 Webhooks
- **Database**: SQLite (Dev) / PostgreSQL (Production)
- **Web Server / Reverse Proxy**: Nginx + Gunicorn

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.12+
- `uv` package manager (install via `pip install uv` or `curl -LsSf https://astral.sh/uv/install.sh`)

### 2. Environment Setup
Clone the repository and copy the example environment file:
```bash
cp .env.example .env
```
Update `.env` with your Paystack API keys and secret keys.

### 3. Install Dependencies
```bash
uv sync
```

### 4. Run Migrations & Load Room Data
```bash
uv run python manage.py migrate
uv run python manage.py loaddata initial_rooms
```
*Note: `initial_rooms.json` seeds all 102 rooms and 193 bed spaces.*

### 5. Create Admin Superuser
```bash
uv run python manage.py createsuperuser
```

### 6. Start Development Server
```bash
uv run python manage.py runserver
```
Server runs at `http://localhost:8000`. Django Admin available at `http://localhost:8000/admin/`.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new student account (sets JWT HttpOnly cookies)
- `POST /api/auth/login/` - Student login
- `POST /api/auth/logout/` - Clears JWT cookies
- `GET /api/auth/me/` - Current authenticated student profile

### Rooms & Inventory
- `GET /api/rooms/` - List all rooms with live bed space availability (supports `?floor=`, `?capacity=`, `?gender=`)
- `GET /api/rooms/<id>/` - Single room details

### Bookings & Payments
- `POST /api/bookings/hold/` - Concurrency-safe 15-minute space lock (`409 Conflict` if taken)
- `POST /api/bookings/release-hold/` - Explicitly release active hold
- `POST /api/bookings/initialize-payment/` - Initialize Paystack checkout
- `POST /api/bookings/verify-payment/` - Verify Paystack transaction & confirm booking
- `GET /api/bookings/roommates/<room_id>/` - Privacy-protected roommate contacts (403 for non-occupants)
- `POST /api/bookings/webhook/` - Paystack asynchronous IPN listener (HMAC verified)

---

## 🛡️ Business Rules
1. **Gender Policy**: Rooms start `UNASSIGNED`. The first confirmed hold/booking locks the room to `MALE` or `FEMALE`. Opposite-gender requests are rejected with `400 Bad Request`.
2. **15-Minute Space Hold**: Bed spaces are locked for 15 minutes during checkout to prevent double-booking. Expired holds automatically release.
3. **Roommate Privacy**: Roommate names and phone numbers are inaccessible until payment is completed and verified.

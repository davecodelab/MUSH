# Mushia Hostel Reservation Platform (KNUST, Kumasi)

Full-stack hostel management and bed-space reservation platform for **Mushia Hostel** (KNUST, Ayeduase Newsite, Kumasi).

Built with a clean monorepo architecture:
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Motion
- **Backend**: Django REST Framework + SimpleJWT (HttpOnly cookies) + Paystack Payments + uv
- **Reverse Proxy**: Nginx (single-domain proxying for zero-CORS production)

---

## 📁 Monorepo Structure

```
MUSH/
├── frontend/                                # Next.js 15 (App Router) Frontend
│   ├── src/
│   │   ├── app/                             # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   │   ├── components/                      # UI components (catalog, modals, dashboard, auth)
│   │   ├── context/                         # HostelContext (global state, holds, checkout)
│   │   ├── services/                        # Axios API client (SSR-safe, proxied)
│   │   ├── data/                            # Offline seed inventory and images
│   │   └── types/                           # TypeScript interfaces
│   ├── public/                              # Images and static assets
│   ├── next.config.ts                       # Next.js rewrites to Django backend
│   └── package.json
│
├── backend/                                 # Django REST Framework Backend
│   ├── core/                                # Settings, WSGI, ASGI, cookie authentication
│   ├── users/                               # Student custom user model & JWT cookies
│   ├── rooms/                               # 102 rooms, 193 bed spaces & fixtures
│   │   └── fixtures/initial_rooms.json      # Complete room inventory seed
│   ├── bookings/                            # 15-min space holds, Paystack payment & webhooks
│   ├── manage.py
│   ├── pyproject.toml & uv.lock             # Python dependencies (uv)
│   ├── .env.example
│   ├── nginx.conf                           # Production reverse proxy
│   └── README.md
│
├── docs/                                    # Documentation directory
│   └── Mushia_Hostel_Frontend_Integration_Guide.docx
│
├── pnpm-workspace.yaml
├── package.json                             # Monorepo scripts
└── .gitignore
```

---

## ⚡ Quick Start

### 1. Start the Backend (Django)
```bash
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py loaddata initial_rooms
uv run python manage.py runserver
```
*Backend runs at `http://localhost:8000`. Django Admin available at `http://localhost:8000/admin/`.*

### 2. Start the Frontend (Next.js)
From the repository root:
```bash
pnpm install
pnpm dev
```
*Frontend runs at `http://localhost:3000`.*

Next.js automatically proxies all `/api/*` and `/admin/*` requests to the Django backend (`:8000`), ensuring native cookie handling with **zero CORS issues**.

---

## 🔑 Key Features
1. **Live Room Inventory**: 102 physical rooms and 193 bed spaces loaded from Excel records across 4 floors.
2. **First-Come, First-Served Gender Policy**: Rooms start `UNASSIGNED` and atomically lock to `MALE` or `FEMALE` on first booking.
3. **15-Minute Space Holds**: Concurrency-safe lock prevents double-booking while student completes Paystack checkout.
4. **Paystack Integration**: Automatic verification and HMAC-SHA512 webhook handler.
5. **Post-Payment Roommate Privacy**: Roommate contact numbers and names are protected and revealed only to paid residents.

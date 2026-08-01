# Car Castle Goa — PRD

## Original problem statement (summary)
"Car Castle Goa" — a self-drive car rental brokerage management platform. The client sources
cars from independent car owners at a wholesale rate and rents them to end customers at a
marked-up rate. The client also handles airport pickup/drop transfers, sometimes outsourced
to third-party drivers/agents. The platform must track every rupee: what's owed to owners,
what's owed to agents, what margin is earned, and how much is saved.

## User choices (locked)
- **Stack**: FastAPI + MongoDB + React (Tailwind + shadcn/ui)
- **Reminders**: MOCKED (log-only, ready to swap to Twilio/WhatsApp later)
- **Currency**: INR (₹)
- **Auth**: JWT-based custom auth with 3 pre-seeded admin accounts
- **Scope**: Full end-to-end for iteration 1

## User personas
1. **Super Admin** (1 account) — Owner-operator. Full CRUD everywhere. Sees cost rates,
   margins, net profit, savings, and all ledgers.
2. **Operator** (2 accounts) — Front-desk staff. Sees bookings and transfers only. Can
   create bookings, update status/transfer status. Cannot see cost/margin/net profit.

## Architecture (implemented)
- FastAPI backend at `/api/*` with role-gated dependency injection.
- MongoDB collections: `users`, `car_owners`, `agents`, `cars`, `bookings`, `ledger`,
  `rate_history`, `activity_logs`, `reminders`, `settings`.
- JWT (12h access + 7d refresh) as httpOnly cookies + Bearer body fallback.
- Idempotent admin + settings seeding on startup.
- React (CRA/craco) SPA with react-router, sonner toasts, recharts, shadcn/ui,
  Manrope + IBM Plex Sans typography, orange/slate palette per design brief.

## Implemented features (iteration 1 — 2026-02-22)
- **Auth & RBAC**: JWT login/logout/me, activity-logged actions, 3 pre-seeded admins.
- **Bookings**: full CRUD, auto margin (customer_rate − cost_rate), auto net_profit
  (margin − agent_fee), status pipeline. Operator sanitization on read + create.
- **Car Owners & Agents**: CRUD + individual ledger pages with running balance,
  payment recording, and mock reminders.
- **Cars**: CRUD; rate changes automatically logged to rate history.
- **Airport Transfers**: Kanban view (scheduled → en route → completed) with one-click
  status advance and agent assignment.
- **Ledger (global)**: filterable by owner/agent + status, running totals, pay + remind actions.
- **Finance & Savings**: monthly P&L, savings accrual, income vs payouts composed chart.
- **Reports**: branded PDF (reportlab) + Excel (openpyxl) monthly reports.
- **Activity Log**: every action recorded with before/after diff.
- **Rate History**: automatic snapshots on car rate changes.
- **Settings**: savings percentage + reminder templates + interval.
- **Reminder Engine**: single unified service (MOCKED), reused for owner/agent/transfer.
- **Seed script**: `python seed_demo.py` populates 3 owners, 2 agents, 5 cars, 18 bookings.

## Testing
- Backend: 40/40 pytest cases passed (auth, RBAC, CRUD, margin engine, ledger side-effects,
  transfers, reports, settings, activity log).
- Frontend: verified via Playwright screenshots — login, dashboard, bookings (18 rows),
  transfers (6 kanban cards), owners grid, owner detail ledger, ledger, finance, reports.

## Backlog (P1 — next iteration)
- Wire the mock reminder engine to Twilio WhatsApp Business API (playbook ready).
- Auto-schedule reminders on the configured interval (background job).
- Push notifications on transfer status changes (operator + super admin).
- Multi-currency / receipt attachments for ledger payments.
- Customer-facing quote / self-checkin page.
- Advanced filters + saved views on bookings/ledger.

## Deployment notes
- Backend expects env vars: `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `SUPER_ADMIN_EMAIL`,
  `SUPER_ADMIN_PASSWORD`, `OP1_*`, `OP2_*`, `SAVINGS_PERCENT`.
- Frontend expects `REACT_APP_BACKEND_URL`.

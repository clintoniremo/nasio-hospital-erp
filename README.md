# Hospital ERP with Advanced Payment System

A full-stack Hospital ERP system built with React, Node.js, and PostgreSQL.

## Modules and Patient Flow

- Gate (Reception)
- Triage
- SHA Office
- Consultation Room (Initial)
- Lab
- Consultation Review
- Finance
- Pharmacy

## Features

- Role-based access control
- Real-time patient tracking across stages
- Consultation time tracking
- SHA/insurance payment integration
- Reports & analytics
- Audit trail for all transaction events

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Create `server/.env` from `server/.env.example`
   - Set `DATABASE_URL`, `JWT_SECRET`, and server port.

3. Set up the PostgreSQL database using `db/schema.sql`.

4. Start development:
   ```bash
   npm run dev
   ```

## Demo Credentials

- Super Admin: `superadmin@hospital.local` / `superadmin123`
- Reception Admin: `reception@hospital.local` / `reception123`
- Triage Nurse: `nurse@hospital.local` / `nurse123`
- SHA Coordinator: `sha@hospital.local` / `sha123`
- Consulting Doctor: `doctor@hospital.local` / `doctor123`
- Lab Technician: `lab@hospital.local` / `lab123`
- Finance Officer: `finance@hospital.local` / `finance123`
- Pharmacy Agent: `pharmacy@hospital.local` / `pharmacy123`

## Running without Postgres (demo mode)

- If `DATABASE_URL` is not set in `server/.env`, the server uses an in-memory fallback store so basic auth and core endpoints work for demos and deployment on Vercel.

For full functionality (reports, persistence), follow the PostgreSQL instructions above and run `node server/scripts/initDb.js` after creating the database.

## Development

- Server: `server/src`
- Client: `client/src`
- Database schema: `db/schema.sql`

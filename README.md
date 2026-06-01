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

- Reception: `reception@hospital.local` / `reception123`
- Nurse: `nurse@hospital.local` / `nurse123`
- SHA: `sha@hospital.local` / `sha123`
- Doctor: `doctor@hospital.local` / `doctor123`
- Lab: `lab@hospital.local` / `lab123`
- Finance: `finance@hospital.local` / `finance123`
- Pharmacy: `pharmacy@hospital.local` / `pharmacist123`

## Development

- Server: `server/src`
- Client: `client/src`
- Database schema: `db/schema.sql`

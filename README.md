# SK Crown Invoice & Quotation System

Lightweight web app for quotations/invoices with automatic temporary-data cleanup and Oracle-backed dashboard analytics.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS
- Backend: Node.js + Express
- Database: Oracle (`node-oracledb`)
- PDF generation: `pdf-lib`
- Charts: Chart.js

## Folder Structure

```
skcrown_invoice/
├─ public/
│  ├─ css/styles.css
│  ├─ js/dashboard.js
│  ├─ js/quotation.js
│  ├─ js/preview.js
│  ├─ index.html
│  ├─ dashboard.html
│  ├─ quotation.html
│  ├─ preview.html
│  └─ downloads/
├─ api/
│  └─ index.js
├─ src/
│  ├─ app.js
│  ├─ config.js
│  ├─ server.js
│  ├─ db.js
│  ├─ documentService.js
│  ├─ pdfService.js
│  └─ validators.js
├─ sql/
│  └─ schema.sql
├─ .env.example
├─ vercel.json
└─ package.json
```

## Core Features

1. **Quotation Generator**
   - Enter client name and multiple items.
   - Live total calculation.
   - Save to `TEMP_DOCUMENTS`.

2. **Invoice Generator**
   - Create invoice directly (`/api/create-invoice`) or convert saved quotation (`/api/convert-to-invoice/:id`).
   - Generate PDF via `/api/generate-pdf`.

3. **Auto-Delete Logic**
   - On PDF generation: document summary moves to `CLIENT_HISTORY`; full temp data is deleted.
   - Hourly cleanup job archives and deletes any temp records older than retention window (default 24h).

4. **Dashboard**
   - Total revenue
   - Client count
   - Last 7 days activity (with zero-filled missing days)
   - Recent clients

## Security & Reliability Improvements
- Environment variable validation at startup.
- Basic security headers via Helmet.
- Server-side input validation limits for lengths/counts/ranges.
- Oracle CLOBs fetched as strings to safely parse JSON items.
- Safer frontend DOM rendering (no user-controlled `innerHTML`).
- PDF file cleanup retention support.

## API Endpoints

- `POST /api/create-quotation`
  - Body: `{ clientName, items: [{name, qty, price}], type? }`
- `POST /api/create-invoice`
  - Body: `{ clientName, items: [{name, qty, price}] }`
- `POST /api/convert-to-invoice/:id`
- `POST /api/generate-pdf`
  - Body: `{ documentId }`
- `GET /api/dashboard`
- `POST /api/run-cleanup` (optional manual/scheduled cleanup trigger; secure with `CLEANUP_TOKEN`)

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Fill `.env` with Oracle credentials.
4. Run schema SQL:
   ```sql
   @sql/schema.sql
   ```
5. Start server:
   ```bash
   npm start
   ```
6. Open browser:
   - `http://localhost:3000/dashboard.html`
   - `http://localhost:3000/quotation.html`
   - `http://localhost:3000/preview.html`


## Deploy (Vercel)

This repo now includes `vercel.json` and `api/index.js` to avoid the **404 NOT_FOUND** issue on Vercel.

1. In Vercel Project Settings, set environment variables:
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_CONNECT_STRING`
   - optional: `DB_POOL_MIN`, `DB_POOL_MAX`, `DOCUMENT_RETENTION_HOURS`, `PDF_RETENTION_HOURS`
2. Deploy the repository.
3. Open `/dashboard.html` or `/` (redirects to dashboard).

> Note: In serverless mode, background cleanup intervals are not guaranteed to run continuously. Use Vercel Cron (or external scheduler) to call `POST /api/run-cleanup` with `x-cleanup-token` header when `CLEANUP_TOKEN` is configured.

## Oracle Notes
- `node-oracledb` needs Oracle Instant Client libraries on your system.
- Queries intentionally avoid joins for performance and simplicity.

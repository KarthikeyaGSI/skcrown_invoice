# SK Crown Invoice & Quotation System

Lightweight web app for creating quotations/invoices, generating PDFs, and auto-archiving summary records.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS
- Backend: Node.js + Express
- Database: Oracle Database with `node-oracledb`
- PDF: `pdf-lib`
- Charts: Chart.js

## Folder Structure

```
skcrown_invoice/
├─ public/
│  ├─ css/styles.css
│  ├─ js/dashboard.js
│  ├─ js/quotation.js
│  ├─ js/preview.js
│  ├─ dashboard.html
│  ├─ quotation.html
│  ├─ preview.html
│  └─ downloads/
├─ src/
│  ├─ server.js
│  ├─ db.js
│  ├─ documentService.js
│  ├─ pdfService.js
│  └─ validators.js
├─ sql/
│  └─ schema.sql
├─ .env.example
└─ package.json
```

## Core Features Implemented

1. **Quotation Generator**
   - Enter client name + item rows (name, qty, price)
   - Live total calculation
   - Save quotation into `TEMP_DOCUMENTS`
2. **Invoice Generator**
   - Save directly as invoice or convert quotation to invoice (`/api/convert-to-invoice/:id`)
   - Generate invoice PDF
3. **Auto Delete Logic**
   - On `/api/generate-pdf`, summary is inserted into `CLIENT_HISTORY` and full record is removed from `TEMP_DOCUMENTS`
   - Hourly cron cleanup archives + removes temp documents older than 24 hours
4. **Dashboard**
   - Total revenue
   - Client count
   - Last 7 days activity chart
   - Recent clients list

## API Endpoints

- `POST /api/create-quotation`
  - Body: `{ clientName, items: [{name, qty, price}], type }`
  - Saves in `TEMP_DOCUMENTS`
- `POST /api/generate-pdf`
  - Body: `{ documentId }`
  - Generates PDF + returns download path
  - Moves summary to history + deletes temp full data
- `GET /api/dashboard`
  - Returns total revenue, client count, last 7 days activity, recent clients
- `POST /api/convert-to-invoice/:id`
  - Converts temp quotation type to invoice

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Update DB credentials in `.env`.
4. Create schema in Oracle:
   ```sql
   @sql/schema.sql
   ```
5. Start app:
   ```bash
   npm start
   ```
6. Open:
   - `http://localhost:3000/dashboard.html`
   - `http://localhost:3000/quotation.html`
   - `http://localhost:3000/preview.html`

## Notes
- `node-oracledb` requires Oracle Client libraries. Follow official docs for your OS.
- Validation/sanitization included for basic safety (empty fields and malformed item values).
- Query design avoids joins and keeps reads simple for fast performance.

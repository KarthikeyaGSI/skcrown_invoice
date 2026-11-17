# SK Crown Invoice & ERP Portal

**Production venue booking, client quotation, digital signature capture, and financial billing platform.**

[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-MongoDB-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## Overview

### The Problem It Solves
Convention centers, luxury banquet halls, and hospitality venues frequently lose revenue and operational visibility due to manual paper agreements, fragmented WhatsApp quotes, missing digital audit trails, and disconnected billing spreadsheets. Tracking event dates, multi-tier amenities, dynamic tax calculations, and real-time Profit & Loss (P&L) margins across bookings becomes error-prone.

### Why It Was Built
Developed for **SK Crown Convention**, this bespoke platform unifies venue bookings, quotation generation, in-person/remote client signature capture, automated PDF invoice rendering, and executive financial telemetry into a single, cohesive Next.js 15 application.

---

## Key Features

- **Dynamic Invoice & Quotation Engine:** Rapid calculation of hall rental fees, custom catering packages, stage setups, audiovisual rentals, GST, and custom line items.
- **Client Digital Signature Capture:** Integrated HTML5 signature pad (`react-signature-canvas`) enabling clients to execute binding agreements directly on touchscreens or desktop.
- **Automated Client-Ready PDF Export:** High-fidelity, print-ready PDF invoice generation (`html2pdf.js`) with embedded company branding, payment terms, and signed authorization.
- **Lead & Event CRM:** Real-time event booking pipeline with status tracking (`INQUIRY`, `PROVISIONAL`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
- **Profit & Loss (P&L) Dashboard:** Granular financial telemetry tracking incoming event cash flow against direct vendor costs, operational overhead, and net venue profit margins.
- **Role-Based Access Control (RBAC):** Tiered security permissions isolating `ADMIN` financial capabilities from `STAFF` booking workflows.
- **Email & Notification Logging:** Centralized dispatch tracking (`email-logger.ts`) ensuring verifiable delivery of booking receipts and contracts.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 15 App Router Frontend              │
│   Dashboard · CRM Pipeline · New Invoice · Signature Modal  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                        Server Actions
               (auth-actions.ts · financial-actions.ts)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Prisma ORM Layer                         │
│  User · Account · Session · Booking · Invoice · Transaction │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     MongoDB Database                        │
│             Document Collections & P&L Records              │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

- **Framework:** Next.js 15 (React 19, Server Actions, App Router)
- **Language:** TypeScript
- **Database & ORM:** MongoDB via Prisma Client
- **UI & Styling:** Tailwind CSS, Radix UI Primitives, Lucide React, Framer Motion
- **Signature & Document Tools:** `react-signature-canvas`, `html2pdf.js`
- **Security & Tokens:** `jose`, `bcryptjs`
- **Utilities:** `date-fns`, `clsx`, `tailwind-merge`

---

## Repository Structure

```
├── prisma/
│   ├── schema.prisma             # Data schema (User, Account, Booking, Invoice models)
│   └── seed.ts                   # Initial database seeding script
├── src/
│   ├── app/                      # App router endpoints
│   │   ├── crm/                  # Lead management and booking pipeline
│   │   ├── dashboard/            # High-level operational overview & KPI stat cards
│   │   ├── invoices/new/         # Interactive invoice creator with live calculations
│   │   ├── pnl/                  # Profit & Loss analytics and revenue charts
│   │   └── login/                # Authentication page
│   ├── components/
│   │   ├── crm/                  # CreateLeadModal, SignatureModal
│   │   ├── dashboard/            # ActivityTable, StatCard components
│   │   ├── invoices/             # InvoiceForm, InvoicePreview, SignatureCapture
│   │   └── layout/               # Sidebar, Topbar, ThemeToggle
│   └── lib/
│       ├── actions/              # Financial server actions (P&L calculations)
│       ├── auth-server.ts        # Session & token verification helpers
│       ├── email-logger.ts       # Transmission audit logging
│       └── prisma.ts             # Global PrismaClient singleton
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- MongoDB connection string (MongoDB Atlas or local)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KarthikeyaGSI/skcrown_invoice.git
cd skcrown_invoice
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

### Environment Variables

Configure `.env`:
```env
# MongoDB Connection
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/skcrown_db?retryWrites=true&w=majority"

# Authentication Secrets
AUTH_SECRET="your_strong_random_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Optional Email / Notification Service
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT=587
SMTP_USER="postmaster@your-domain.com"
SMTP_PASS="your_smtp_password"
```

4. Push Prisma schema to MongoDB:
```bash
npx prisma db push
```

5. Run database seed (optional):
```bash
npx prisma db seed
```

6. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to access the portal.

---

## Author & Maintainer

**Karthikeya Thallapally**  
Founder, [MarketingKo](https://marketingko.in/)  
Twitter / X: [@thekarthgsi](https://twitter.com/thekarthgsi) · GitHub: [@KarthikeyaGSI](https://github.com/KarthikeyaGSI)

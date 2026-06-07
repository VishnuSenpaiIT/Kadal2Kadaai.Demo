# Kadal2Kadaai 🐟

> A production-grade multi-vendor fish marketplace platform connecting Consumers, Fishermen, Fish Vendors, Delivery Partners, and Administrators.

---

## Architecture Overview

```
Kadal2Kadaai/
├── frontend/          # Next.js 15 + TypeScript + Tailwind + ShadCN
├── backend/           # Laravel 12 + PHP 8.3 + REST API
├── docs/              # Architecture, API, DB, Deployment docs
└── docker-compose.dev.yml  # Local dev infrastructure
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, TanStack Query |
| Backend | Laravel 12, PHP 8.3, REST API |
| Database | PostgreSQL 16 |
| Cache & Queue | Redis 7 |
| Storage | Cloudflare R2 |
| Payments | Razorpay |
| Authentication | Laravel Sanctum, OTP, Google OAuth |
| Frontend Host | Vercel |
| Backend Host | Hetzner VPS |
| CDN / Proxy | Cloudflare |

## Quick Start

### Prerequisites
- Node.js 20+
- PHP 8.3+
- Composer 2+
- PostgreSQL 16
- Redis 7

### Local Development

```bash
# Start infrastructure
docker-compose -f docker-compose.dev.yml up -d

# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Documentation

- [Architecture](./docs/architecture.md)
- [Database Schema](./docs/database-schema.md)
- [API Standards](./docs/api-standards.md)
- [Coding Standards](./docs/coding-standards.md)
- [Deployment Guide](./docs/deployment.md)
- [Environment Variables](./docs/environment.md)
- [Security Checklist](./docs/security.md)

## Applications & Portals

- **Consumer Marketplace** — Browse, order, track (Public Interface)
- **KadalOperations Portal** — Unified enterprise portal replacing individual admin and seller dashboards. Manages platform, inventory, orders, earnings, and analytics via Role-Based Access Control (RBAC).
- **Delivery Portal** (Planned) — Assignments, routing, proof
- **B2B Marketplace** (Future) — Wholesale and bulk transactions

## Development Status

This repository has completed its **Foundation & Preparation Phase** and the **Authentication & Consumer Management Phase**.
Currently in the **Operations Portal Consolidation & Marketplace Completion Phase**.
Core architecture, unified auth, and RBAC are established.

---

*Built with ❤️ for the fishing community*

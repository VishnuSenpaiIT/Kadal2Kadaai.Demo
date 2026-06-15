<div align="center">

# 🌊 Kadal2Kadaai 🐟

**A production-grade multi-vendor fish marketplace platform connecting Consumers, Fishermen, Fish Vendors, Delivery Partners, and Administrators.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

</div>

## 🏗 Architecture Overview

The system is decoupled into an API backend and a frontend application, built to scale across web and mobile.

```mermaid
graph TD
    subgraph Frontend
        C[Consumer App \n Next.js]
        O[Operations Portal \n Next.js]
        B[B2B Wholesale \n Next.js]
    end

    subgraph API Layer
        API[Laravel 12 API]
    end

    subgraph Infrastructure
        DB[(PostgreSQL 16)]
        Cache[(Redis 7)]
        Storage[Cloudflare R2]
    end

    C <-->|REST / Echo| API
    O <-->|REST / Echo| API
    B <-->|REST / Echo| API

    API <--> DB
    API <--> Cache
    API <--> Storage
```

## 🚀 Technology Stack

| Layer | Technology |
|---|---|
| 🎨 **Frontend** | Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, TanStack Query |
| ⚙️ **Backend** | Laravel 12, PHP 8.3, REST API |
| 🗄️ **Database** | PostgreSQL 16 |
| ⚡ **Cache & Queue** | Redis 7 |
| ☁️ **Storage** | Cloudflare R2 |
| 💳 **Payments** | Razorpay |
| 🔐 **Authentication**| Laravel Sanctum, OTP, Google OAuth |

## 🛠 Quick Start

> [!TIP]
> Make sure you have the following installed: **Node.js 20+**, **PHP 8.3+**, **Composer 2+**, **PostgreSQL 16**, **Redis 7**.

### Local Development

1️⃣ **Start Infrastructure**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2️⃣ **Backend Setup**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

3️⃣ **Frontend Setup**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## 📚 Documentation

Navigate to the `docs` directory for detailed architecture, schema, and API guides:

- 📐 [Architecture](./docs/architecture.md)
- 🗂️ [Database Schema](./docs/database-schema.md)
- 🔌 [API Standards](./docs/api-standards.md)
- 💻 [Coding Standards](./docs/coding-standards.md)
- 🚀 [Deployment Guide](./docs/deployment.md)
- 🔒 [Security Checklist](./docs/security.md)

## 🌐 Applications & Portals

* 🛍️ **Consumer Marketplace** — Browse, order, and track fresh catches.
* 🛡️ **KadalOperations Portal** — Unified enterprise portal managing the platform, inventory, and analytics via RBAC.
* 🚚 **Delivery Portal** _(Planned)_ — Assignments, routing, and proof of delivery.
* 🏢 **B2B Marketplace** _(Future)_ — Wholesale and bulk transactions.

## 📊 Development Status

> [!IMPORTANT]
> All codebase changes are actively synced with the official GitHub repository, maintaining the latest local state on the `main` branch. A comprehensive [HOWTORUN.md](./HOWTORUN.md) guide has been provided for streamlined local deployments.

**Phase Progress**
- ✅ Foundation Phase
- ✅ Authentication Phase
- ✅ Localhost Boot Phase
- ✅ UI Phases 1-6
- ✅ Phase 8 Certification
- ✅ Phase 9 Architecture
- 🟢 **Phase 10: Live Consumer Marketplace UI** (Active)

Currently, the **Operations Portal (Admin and Seller)** is fully built, utilizing real-time API hooks and connected directly to the Laravel backend. The application is configured for cloud deployment (Vercel + Docker on Render).

---
<div align="center">
<i>Built with ❤️ for the fishing community.</i>
</div>

# ApniSec - SDE Intern Assignment Documentation

## Overview
This is a full-stack Next.js 15+ application built for the ApniSec SDE Intern assignment. It demonstrates production-ready code with strict OOP architecture, custom authentication, rate limiting, email integration, issue management, and a modern cybersecurity-themed UI.

**Live URL**: [https://apnisec-4a52.vercel.app/](https://apnisec-4a52.vercel.app/)  
**GitHub Repository**: [https://github.com/Declan1704/Apnisec.git](https://github.com/Declan1704/Apnisec.git)

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (Route Handlers), TypeScript
- **Database**: PostgreSQL via Supabase (free tier)
- **ORM**: Prisma
- **Authentication**: Custom JWT (no third-party services)
- **Email**: Resend (welcome + issue creation notifications)
- **Deployment**: Vercel

## Key Features Implemented

### Authentication (Custom JWT)
- Register `/api/auth/register`
- Login `/api/auth/login`
- Get current user `/api/auth/me` (protected)
- Client-side auth context with redirect protection
- Pages: `/login`, `/register`

### Issue Management (Full CRUD)
- Create, list, view, update status, delete issues
- Filter by type (Cloud Security, Red Team Assessment, VAPT)
- Protected routes (ownership enforced)
- APIs:
  - `POST /api/issues`
  - `GET /api/issues` (with `?type=` filter)
  - `GET /api/issues/[id]`
  - `PUT /api/issues/[id]`
  - `DELETE /api/issues/[id]`

### User Profile Management
- `GET /api/users/profile`
- `PUT /api/users/profile` (update name)

### Rate Limiting
- Custom OOP `RateLimiter` class
- 100 requests per 15 minutes per IP
- Proper headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Returns 429 on exceed

### Email Integration (Resend)
- Welcome email on successful registration
- Notification email when a new issue is created (includes type, title, description)

### Frontend
- **Landing Page** (`/`): Modern, responsive, cybersecurity-themed with hero, services section, CTA
- **Login/Register Pages**: Clean forms with validation and error handling
- **Dashboard** (`/dashboard`): Protected route showing:
  - User welcome
  - Create issue form (dropdowns, optional fields)
  - Issue list with filter by type
  - Inline status update
  - Delete with confirmation
  - Loading and empty states

### SEO & Performance
- Lighthouse scores: **SEO 100%**, **Performance 95%+**
- Server-side rendering
- Optimized gradients, minimal client JS
- Semantic HTML, metadata, OpenGraph tags

## Backend Architecture (Strict OOP)
All backend logic follows class-based OOP with proper separation of concerns:

# Design System Constitution

This document defines the strict, non-negotiable UI/UX standards for Kadal2Kadaai. The Admin, Seller, B2B, and B2C apps **must** all inherit from this system. Custom styles outside approved tokens are forbidden.

## 1. Official Design Tokens
- **Colors**: 
  - `primary`: `#0f172a`
  - `secondary`: `#334155`
  - `accent`: `#3b82f6`
  - `destructive`: `#ef4444`
  - `background`: `#ffffff` (Dark mode: `#09090b`)
- **Typography**: 
  - Font Family: `Inter`, sans-serif.
  - Sizes: `xs` (12px), `sm` (14px), `base` (16px), `lg` (18px), `xl` (20px), `2xl` (24px).
- **Spacing**: Multiples of 4px (`1` = 4px, `2` = 8px, `4` = 16px, `8` = 32px).
- **Shadows**: `sm`, `md`, `lg`, `xl` mapped exactly to Tailwind default shadows.
- **Radius**: `sm` (4px), `md` (6px), `lg` (8px), `full` (9999px).
- **Animations**: `transition-all duration-200 ease-in-out`.

## 2. Component Standards
- **Table Standards**: Must use the central `DataTable` component. Must include pagination and skeleton loaders.
- **Form Standards**: Must use `react-hook-form` + `zod` validation. Standardized `FormField` component for labels, inputs, and error messages.
- **Button Standards**: Must use the global `Button` component with predefined variants (`default`, `outline`, `ghost`, `destructive`).
- **Card Standards**: Standard padding (`p-6`), border (`border-border`), and rounded corners (`rounded-lg`).
- **Modal Standards**: Must use `Dialog` component. Must have an explicit close button and support escape-key closing.
- **Navigation Standards**: Sidebar for Admin/Seller dashboards. Top Navbar for B2C marketplace.

## 3. Platform Specifics
- **Dashboard Standards**: Metrics cards at the top, charts in the middle, recent activity tables at the bottom.
- **Mobile Standards**: Touch targets must be at least `44x44px`. Hide sidebars behind a hamburger menu.
- **Dark Theme Rules**: Must support dark mode flawlessly by relying on CSS variables mapping (`bg-background`, `text-foreground`).
- **Branding Rules**: The KadalOperations logo must always maintain safe padding. Primary brand color cannot be overridden.

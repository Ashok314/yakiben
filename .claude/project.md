# Yakiben Project Documentation

## Project Overview
Japanese lunch box pre-order system with customer and admin interfaces.

## Architecture

### Monorepo Structure
- Root: Yarn workspaces with shared configurations
- `apps/customer`: Customer-facing PWA
- `apps/admin`: Admin panel PWA

### Tech Stack
- Frontend Framework: Vue 3
- Build Tool: Vite 7
- TypeScript: v5.8
- CSS Framework: Tailwind CSS 3
- PWA Support: vite-plugin-pwa
- Router: Vue Router 4
- Database: Supabase (planned)
- Package Manager: Yarn 4.9.1

### Key Features
1. Customer App:
   - Mobile-first menu browsing with category navigation
   - Order tracking with user-friendly IDs
   - Comprehensive cart with item customizations
   - Customer info persistence and reordering
   - Advanced printing support for orders and receipts
   - Internationalization-ready UI text system
   - Business hours and pickup time validation
   - LINE Mini App integration (planned)

2. Admin App:
   - Order management
   - Menu management
   - Role-based access
   - Driver and manager interfaces

### Development Guidelines

#### State Management
- Local component state with `ref` and `computed`
- Future: Supabase for backend persistence

#### Component Structure
- Composition API with `<script setup>`
- TypeScript for type safety
- Tailwind for responsive styling
- Centralized UI text constants for i18n
- Print-optimized layouts
- Mock API layer for future backend integration
- Restaurant configuration system

#### Routing
- Hash mode for static hosting
- Separate routes for customer and admin apps

#### PWA Configuration
- Service worker for offline support
- Installable on mobile devices
- Asset caching strategy

### Configuration and Constants

#### Restaurant Info
```typescript
export const RESTAURANT_INFO = {
  name: string;
  address: {
    postal: string;
    prefecture: string;
    city: string;
    line1: string;
  };
  phone: string;
  hours: {
    open: number;          // 24-hour format
    close: number;         // 24-hour format
    orderDeadline: number; // Last order time
    minAdvanceTime: number;// minutes
    maxAdvanceDays: number;
    businessDays: number[];// Monday-Friday (0 = Sunday)
  };
  support: {
    phone: string;
    hours: string;
    email: string;
  };
}
```

#### UI Text System
Hierarchical text constant system supporting:
- Common text (loading, errors, actions)
- Menu-related text (categories, items, customizations)
- Cart and order flow text
- Print layout text
- Future i18n integration

### Data Models

#### MenuItem
```typescript
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  customizations?: string[];
  available: boolean;
}
```
```typescript
interface Customization {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
}
```

#### Order
```typescript
interface Order {
  id: string;
  trackingId: string;
  items: OrderItem[];
  customerName: string;
  company: string;
  customerContact: string;
  pickupTime: Date;
  notes?: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Environment Setup
1. Root level:
   ```bash
   yarn install
   ```

2. Running apps:
   ```bash
   # Customer app
   yarn workspace customer dev
   
   # Admin app
   yarn workspace admin dev
   ```

### Deployment
- GitHub Pages via GitHub Actions
- Static hosting with hash-based routing
- PWA assets properly cached

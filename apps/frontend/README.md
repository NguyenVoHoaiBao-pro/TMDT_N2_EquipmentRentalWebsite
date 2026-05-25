# ⚛️ Equipment Rental Frontend - React + TypeScript + Vite

A modern, responsive e-commerce frontend application built with React 19, TypeScript, and Vite for fast development and production builds. Features include equipment catalog, shopping cart, user authentication, and admin dashboard.

**Version:** 1.0.0 | **Node:** 20+ | **React:** 19 | **Vite:** 8+ | **TypeScript:** 6.0+

## 🚀 Key Features

### Frontend Framework & Tooling
- ✅ **React 19** - Latest React version with latest hooks & features
- ✅ **TypeScript 6.0+** - Static type checking for robust code
- ✅ **Vite 8+** - Ultra-fast build tool with HMR (Hot Module Replacement)
- ✅ **React Router v7** - Modern client-side routing
- ✅ **ESLint & Prettier** - Code quality & formatting

### State Management & Data Fetching
- ✅ **Zustand** - Lightweight state management (auth, UI state)
- ✅ **TanStack Query (React Query)** - Server state management & caching
- ✅ **Axios** - Modern HTTP client with interceptors
- ✅ **Automatic Request/Response Interceptors** - JWT token injection
- ✅ **API Proxy** - Vite proxy redirects `/api` to backend

### UI & Styling
- ✅ **Tailwind CSS 3** - Utility-first CSS framework
- ✅ **shadcn/ui** - High-quality React components
- ✅ **Lucide React** - Beautiful SVG icons (250+ icons)
- ✅ **Sonner** - Beautiful toast notifications
- ✅ **Responsive Design** - Mobile-first, works on all devices

### Forms & Validation
- ✅ **React Hook Form** - Performant, flexible form handling
- ✅ **Zod** - TypeScript-first schema validation
- ✅ **Input Validation** - Real-time field validation
- ✅ **Error Messages** - User-friendly error feedback

### User Experience
- ✅ **Dark/Light Mode** - Theme switcher (optional)
- ✅ **Skeleton Loaders** - Loading states for better UX
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Lazy Loading** - Code splitting for faster initial load

### Development Experience
- ✅ **Hot Module Replacement (HMR)** - Instant updates without page reload
- ✅ **TypeScript Strict Mode** - Catch errors at compile time
- ✅ **Path Aliases** - Clean import paths (`@/components`, `@/hooks`)
- ✅ **Dev Server** - Built-in dev server with auto-reload

## 🛠️ Quick Setup

### Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (require 20+)
node --version

# Check npm version (comes with Node.js)
npm --version
```

### Step 1: Install Dependencies

```bash
# Navigate to frontend directory
cd apps/frontend

# Install all dependencies
npm install

# Or using yarn/pnpm
yarn install
# pnpm install
```

### Step 2: Configure Environment Variables

Create `.env.local` file in `apps/frontend/`:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Equipment Rental
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Step 3: Start Development Server

```bash
# Start Vite dev server with HMR
npm run dev

# Or for custom port
npm run dev -- --port 3000
```

**Dev server will start at:** `http://localhost:5173`

- Auto-reload on file changes
- TypeScript checking enabled
- Fast refresh (HMR)
- Access backend via `/api` proxy

### Step 4: Build for Production

```bash
# TypeScript check + Vite build
npm run build

# Preview production build locally
npm run preview
```

**Production build output:** `dist/` folder

## 📁 Project Structure

### Directory Layout

```bash
apps/frontend/
├── src/
│   ├── App.tsx                         # Root React component
│   ├── main.tsx                        # Application entry point
│   ├── index.css                       # Global styles + Tailwind CSS imports
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AuthLayout.tsx          # Layout for auth pages
│   │   │   ├── MainLayout.tsx          # Main layout with navbar & sidebar
│   │   │   └── AdminLayout.tsx         # Admin dashboard layout
│   │   ├── common/
│   │   │   ├── Navbar.tsx              # Top navigation bar
│   │   │   ├── Sidebar.tsx             # Side navigation menu
│   │   │   ├── Footer.tsx              # Footer component
│   │   │   └── LoadingSpinner.tsx      # Loading indicator
│   │   └── ui/ (shadcn/ui components)
│   │       ├── Button.tsx              # Reusable button
│   │       ├── Input.tsx               # Text input field
│   │       ├── Card.tsx                # Card container
│   │       ├── Dialog.tsx              # Modal dialog
│   │       └── ...more UI components
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx           # User login page
│   │   │   ├── RegisterPage.tsx        # User registration page
│   │   │   ├── ForgotPassword.tsx      # Password reset request
│   │   │   └── ResetPassword.tsx       # Password reset form
│   │   ├── home/
│   │   │   ├── HomePage.tsx            # Home/landing page
│   │   │   ├── EquipmentListing.tsx    # Equipment catalog
│   │   │   └── EquipmentDetail.tsx     # Single equipment detail
│   │   ├── cart/
│   │   │   ├── CartPage.tsx            # Shopping cart view
│   │   │   └── CheckoutPage.tsx        # Checkout process
│   │   ├── user/
│   │   │   ├── ProfilePage.tsx         # User profile
│   │   │   ├── OrderHistory.tsx        # User's rental orders
│   │   │   └── Settings.tsx            # User settings
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx           # Admin dashboard
│   │   │   ├── EquipmentManagement.tsx # Manage equipment
│   │   │   └── OrderManagement.tsx     # Manage all orders
│   │   └── NotFound.tsx                # 404 page
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx       # Login form component
│   │   │   │   └── RegisterForm.tsx    # Register form component
│   │   │   ├── services/
│   │   │   │   └── authService.ts      # Auth API calls
│   │   │   ├── types/
│   │   │   │   └── auth.ts             # Auth-related types
│   │   │   └── utils/
│   │   │       └── tokenUtils.ts       # Token handling utilities
│   │   ├── equipment/
│   │   │   ├── components/
│   │   │   │   ├── EquipmentCard.tsx   # Equipment card component
│   │   │   │   ├── EquipmentFilter.tsx # Filter/search component
│   │   │   │   └── EquipmentGrid.tsx   # Grid layout for equipment
│   │   │   ├── services/
│   │   │   │   └── equipmentService.ts # Equipment API calls
│   │   │   └── types/
│   │   │       └── equipment.ts        # Equipment types/interfaces
│   │   └── cart/
│   │       ├── components/
│   │       │   └── CartItemList.tsx    # Cart items display
│   │       ├── services/
│   │       │   └── cartService.ts      # Cart API calls
│   │       └── types/
│   │           └── cart.ts             # Cart types
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                  # Authentication hook
│   │   ├── useEquipment.ts             # Equipment data hook
│   │   ├── useCart.ts                  # Shopping cart hook
│   │   ├── useFetch.ts                 # Generic data fetching hook
│   │   └── useLocalStorage.ts          # Local storage hook
│   │
│   ├── services/
│   │   ├── api.ts                      # Axios instance with interceptors
│   │   ├── authService.ts              # Auth API endpoints
│   │   ├── equipmentService.ts         # Equipment API endpoints
│   │   ├── orderService.ts             # Order API endpoints
│   │   └── uploadService.ts            # File upload service
│   │
│   ├── store/
│   │   ├── useAuthStore.ts             # Zustand auth store
│   │   ├── useCartStore.ts             # Zustand cart store
│   │   ├── useUIStore.ts               # Zustand UI state store
│   │   └── useUserStore.ts             # Zustand user data store
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx           # TanStack Query provider
│   │   ├── queryClientConfig.ts        # Query client configuration
│   │   ├── AuthProvider.tsx            # Auth context provider
│   │   └── ThemeProvider.tsx           # Dark/Light theme provider
│   │
│   ├── lib/
│   │   ├── utils.ts                    # Utility functions (cn for Tailwind)
│   │   ├── axios.ts                    # Axios configuration
│   │   ├── validation.ts               # Validation schemas (Zod)
│   │   └── constants.ts                # App constants
│   │
│   ├── types/
│   │   ├── index.ts                    # Global types
│   │   ├── api.ts                      # API response types
│   │   └── entities.ts                 # Entity types (User, Equipment, etc.)
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hero.png                # Hero image
│   │   │   ├── equipment-*.png         # Equipment placeholder images
│   │   │   └── ...other images
│   │   ├── icons/
│   │   │   └── ...custom SVG icons
│   │   └── fonts/
│   │       └── ...custom fonts
│   │
│   └── ui-primitives/
│       └── ui/
│           ├── button.tsx              # shadcn Button
│           ├── input.tsx               # shadcn Input
│           ├── card.tsx                # shadcn Card
│           ├── dialog.tsx              # shadcn Dialog
│           └── ...more shadcn components
│
├── public/
│   ├── favicon.svg                     # Browser favicon
│   └── ...static files
│
├── .env.local                          # Environment variables (local development)
├── .env.example                        # Environment template
├── .eslintrc.js                        # ESLint configuration
├── .gitignore                          # Git ignore rules
├── eslint.config.js                    # Detailed ESLint rules
├── index.html                          # HTML entry point
├── package.json                        # npm dependencies & scripts
├── postcss.config.js                   # PostCSS configuration (Tailwind)
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript base config
├── tsconfig.app.json                   # TypeScript app config
├── tsconfig.node.json                  # TypeScript build tool config
├── vite.config.ts                      # Vite bundler configuration
├── components.json                     # shadcn/ui configuration
├── Dockerfile                          # Docker image definition
└── README.md                           # This file
```

### Key Directories Explained

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `components/` | Reusable React components | Buttons, cards, modals, etc. |
| `pages/` | Page-level components | Routes and full pages |
| `features/` | Feature modules (auth, cart) | Feature-specific logic |
| `hooks/` | Custom React hooks | Data fetching, state management |
| `services/` | API communication | HTTP calls to backend |
| `store/` | Global state (Zustand) | Auth, cart, UI state |
| `providers/` | Context & providers | Theme, query, auth providers |
| `lib/` | Utilities & helpers | Validation, constants, helpers |
| `types/` | TypeScript types | Global type definitions |
| `assets/` | Static files | Images, icons, fonts |

## 📦 Dependencies

### React & Core

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.4+ | UI framework |
| **React DOM** | 19.2.4+ | React rendering |
| **React Router** | 7.15.1+ | Client-side routing |

### State Management & Data Fetching

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **Zustand** | 4.4.7+ | Lightweight state management |
| **TanStack Query** | 5.28.0+ | Server state & caching |
| **Axios** | 1.16.1+ | HTTP client |

### UI & Styling

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 3.4.1+ | Utility CSS framework |
| **shadcn/ui** | 4.2.0+ | Component library |
| **Lucide React** | 1.8.0+ | Icon library |
| **Sonner** | 2.0.7+ | Toast notifications |
| **clsx** | 2.1.1+ | Conditional className building |
| **Tailwind Merge** | 2.6.1+ | Merge Tailwind classes |

### Forms & Validation

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **React Hook Form** | 7.76.1+ | Performant form handling |
| **@hookform/resolvers** | 5.4.0+ | Form validation adapters |
| **Zod** | 3.24.1+ | TypeScript schema validation |

### Build & Development Tools

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **Vite** | 8.0.4+ | Fast build tool |
| **TypeScript** | 6.0.2+ | Static type checking |
| **ESLint** | 9.39.4+ | Code linting |
| **Prettier** | 3.2.5+ | Code formatting |

### Additional UI Libraries

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **@base-ui/react** | 1.4.0+ | Headless UI components |
| **embla-carousel-react** | 8.6.0+ | Carousel/slider component |
| **cmdk** | 1.1.1+ | Command menu/search |

## 🔌 API Integration

### Axios Configuration

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.VITE_API_BASE_URL}/api`,
  timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000'),
});

// Request interceptor - Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Example

```typescript
// services/equipmentService.ts
import api from './api';

export const equipmentService = {
  // Get all equipment with pagination
  getAll: (page = 0, size = 10) =>
    api.get('/equipment', { params: { page, size } }),

  // Get single equipment by ID
  getById: (id: number) =>
    api.get(`/equipment/${id}`),

  // Search equipment
  search: (query: string) =>
    api.get('/equipment/search', { params: { q: query } }),

  // Create new equipment (admin only)
  create: (data: CreateEquipmentDTO) =>
    api.post('/equipment', data),

  // Update equipment (admin only)
  update: (id: number, data: UpdateEquipmentDTO) =>
    api.put(`/equipment/${id}`, data),

  // Delete equipment (admin only)
  delete: (id: number) =>
    api.delete(`/equipment/${id}`),
};
```

### Using with React Query

```typescript
// hooks/useEquipment.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';

export function useEquipmentList(page = 0) {
  return useQuery({
    queryKey: ['equipment', page],
    queryFn: () => equipmentService.getAll(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useEquipmentById(id: number) {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  return useMutation({
    mutationFn: (data) => equipmentService.create(data),
    onSuccess: (data) => {
      // Invalidate cache to refresh list
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}
```

## 🎨 Styling with Tailwind CSS

### Global Styles

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component classes */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }
}
```

### Using Tailwind in Components

```tsx
// components/EquipmentCard.tsx
export function EquipmentCard({ equipment }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow">
      <img
        src={equipment.imageUrl}
        alt={equipment.name}
        className="h-48 w-full object-cover rounded-md"
      />
      <h3 className="mt-2 text-lg font-semibold text-gray-900">
        {equipment.name}
      </h3>
      <p className="mt-1 text-sm text-gray-600">{equipment.description}</p>
      <p className="mt-2 text-2xl font-bold text-green-600">
        ${equipment.rentalPricePerDay}/day
      </p>
      <button className="btn-primary mt-4 w-full">Rent Now</button>
    </div>
  );
}
```

## 📖 Available Scripts

```bash
# Development
npm run dev                 # Start dev server (port 5173)
npm run dev -- --port 3000 # Custom port

# Production Build
npm run build               # TypeScript check + Vite build
npm run preview             # Preview production build

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix ESLint issues
npm run format              # Format with Prettier

# Cleanup
npm run clean               # Remove dist & node_modules (Windows)
```

## 🌐 Environment Variables

Create `.env.local` with these variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=30000

# App Config
VITE_APP_NAME=Equipment Rental
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Optional: Third-party services
# VITE_GOOGLE_ANALYTICS_ID=
# VITE_SENTRY_DSN=
```

## 🐛 Common Issues & Solutions

### "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Rebuild TypeScript
npm run build
```

### Vite PORT is already in use

```bash
# Use different port
npm run dev -- --port 3000

# Or kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Tailwind CSS not working

```bash
# Rebuild Tailwind
npm run build

# Check tailwind.config.js paths configuration
cat tailwind.config.js
```

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Output is in dist/ folder
```

### Docker Deployment

```bash
# Build Docker image
docker build -t equipment-rental-frontend:latest .

# Run container
docker run -p 3000:3000 equipment-rental-frontend:latest
```

### Environment Variables for Production

Set these in production environment:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Equipment Rental
VITE_ENABLE_DEBUG=false
```

## 📝 Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use composition over inheritance
   - Extract logic to custom hooks

2. **State Management**
   - Use Zustand for global state
   - Use React Query for server state
   - Use useState for local component state

3. **TypeScript**
   - Use strict mode
   - Define interfaces for all data
   - Avoid `any` type

4. **Performance**
   - Use React.memo for expensive components
   - Implement code splitting with React.lazy
   - Optimize images with proper formats
   - Use proper cache strategies with React Query

5. **Testing** (when applicable)
   - Write unit tests for utilities
   - Write integration tests for hooks
   - Write E2E tests for critical flows

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [shadcn/ui](https://shadcn-ui.com)
- [Zustand](https://github.com/pmndrs/zustand)

## 📞 Support

For issues:
1. Check existing documentation
2. Review component code for examples
3. Check browser developer tools console
4. Create an issue with detailed steps to reproduce


// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/features/home/pages/HomePage.tsx';
import { LoginPage } from '@/features/auth/pages/LoginPage.tsx';
import { RegisterPage } from '@/features/auth/pages/RegisterPage.tsx';
import { ForgotPassword } from '@/features/auth/pages/ForgotPassword.tsx';
import { ResetPassword } from '@/features/auth/pages/ResetPassword.tsx';
import ProductCatalogPage from '@/features/product/pages/ProductCatalogPage.tsx';
import RegisterDevicePage from '@/features/device-registration/pages/RegisterDevicePage.tsx';
import { OAuth2RedirectHandler } from '@/features/auth/components/OAuth2RedirectHandler.tsx';
import { MainLayout } from '@/components/layout/MainLayout';
import { SimpleLayout } from '@/components/layout/SimpleLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoutes';
import { ProfilePage } from '@/features/profile/pages/ProfilePage.tsx';
import { ProductDetailPage } from '@/features/product/pages/ProductDetailPage.tsx';
import { CartPage } from '@/features/cart/pages/CartPage.tsx';

function App() {
  return (
    <Routes>
      {/* 1. Standard Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        {/* Separate the routes so they render independently */}
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

      </Route>

      {/* 2. Protected Routes using Simple Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SimpleLayout />}>
          <Route path="/register-device" element={<RegisterDevicePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Route>

      {/* 3. Auth Routes (No layout wrappers) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  );
}

export default App;

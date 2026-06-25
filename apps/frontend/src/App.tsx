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

function App() {
  return (
    <Routes>
      {/* 1. Public Routes: no need to be logged in */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
      </Route>

      {/* 2. Protected Routes: need user logged in */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SimpleLayout />}>

          <Route path="/register-device" element={<RegisterDevicePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Other protected routes */}
        </Route>
      </Route>

      {/* If we have admin routes, add it here */}
      {/* <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route> */}

      {/* 3. Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  );
}

export default App;

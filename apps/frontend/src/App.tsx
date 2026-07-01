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
import { BankTransferPage } from '@/features/checkout/pages/BankTransferPage.tsx';
import { CheckoutSuccessPage } from '@/features/checkout/pages/Checkout SuccessPage.tsx';
import { CheckoutPage } from '@/features/checkout/pages/CheckoutPage.tsx';


function App() {
  return (
    <Routes>
      {/* 1. Standard Public Routes (Dưới MainLayout có Navbar/Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Route>

      {/* 2. Protected Routes (Bắt buộc phải ĐĂNG NHẬP mới truy cập được) */}
      <Route element={<ProtectedRoute />}>
        {/* Nhóm A: Dùng MainLayout (Vẫn có Navbar để kiểm tra Badge số lượng món) */}
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/bank-transfer" element={<BankTransferPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        </Route>

        {/* Nhóm B: Dùng SimpleLayout (Ẩn bớt thanh cuộn rườm rà cho trang cá nhân) */}
        <Route element={<SimpleLayout />}>
          <Route path="/register-device" element={<RegisterDevicePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 3. Auth Routes (Giữ nguyên) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  );
}

export default App;

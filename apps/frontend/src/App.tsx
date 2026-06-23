import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPassword } from '@/pages/auth/ForgotPassword.tsx';
import { ResetPassword } from '@/pages/auth/ResetPassword.tsx';
import ProductCatalogPage from '@/pages/products/ProductCatalogPage.tsx';
import RegisterDevicePage from '@/pages/device-registration/RegisterDevicePage.tsx';
import { OAuth2RedirectHandler } from '@/features/auth/components/OAuth2RedirectHandler.tsx';

function App() {
  return (
    <Routes>
      {/* Main Home Page */}
      <Route path="/home" element={<HomePage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      {/* Product Pages */}
      <Route path="/products" element={<ProductCatalogPage />} />

      {/* Device Registration Pages */}
      <Route path="/register-device" element={<RegisterDevicePage />} />
    </Routes>
  );
}

export default App;

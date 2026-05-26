import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPassword } from '@/pages/auth/ForgotPassword.tsx';
import { ResetPassword } from '@/pages/auth/ResetPassword.tsx';

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
    </Routes>
  );
}

export default App;

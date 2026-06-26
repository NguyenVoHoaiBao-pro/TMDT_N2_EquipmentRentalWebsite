import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const rolesString = searchParams.get('roles');

    if (token && username && rolesString) {
      const roles = rolesString.split(',');

      loginSuccess({ username, roles }, token);

      const savedRedirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/home';
      sessionStorage.removeItem('redirectAfterLogin');

      // Navegate to the saved redirect URL or default to home
      navigate(savedRedirectUrl, { replace: true });
    } else {
      toast.error('Đăng nhập mạng xã hội thất bại. Vui lòng thử lại!');
      navigate('/login?error=oauth2_failed');
    }
  }, [searchParams, loginSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Đang xác thực tài khoản của bạn, vui lòng đợi...</p>
      </div>
    </div>
  );
}

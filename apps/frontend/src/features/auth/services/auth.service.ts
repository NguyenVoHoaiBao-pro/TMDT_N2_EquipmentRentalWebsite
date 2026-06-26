// auth.service.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/features/auth/types/auth.types.ts';

import { useQuery } from '@tanstack/react-query';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the user location for redirection
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  // If yes, redirect to the previous page or else redirect to the home page
  const from = (location.state as { from?: { pathname: string; search: string } })?.from;
  const redirectUrl = from ? `${from.pathname}${from.search}` : '/home';


  return useMutation({
    mutationFn: (loginData: LoginRequest) => {
      return api.auth.login(loginData);
    },

    onSuccess: (user) => {
      loginSuccess({ username: user.username, roles: user.roles }, user.token);

      toast.success(`Welcome, ${user.username}!`);
      navigate(redirectUrl, { replace: true }); // Replace the current history entry
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMsg);
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (registerData: RegisterRequest) => {
      return api.auth.register(registerData);
    },

    onSuccess: (user) => {
      toast.success(`Registration successful! Welcome, ${user.username}!`);
      navigate('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    },
  });
};

export const useForgotPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (email: ForgotPasswordRequest) => {
      return api.auth.forgotPassword(email);
    },

    onSuccess: () => {
      toast.success('Password reset email sent. Please check your inbox.');
      navigate('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to send password reset email.';
      toast.error(errorMsg);
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, newPassword }: ResetPasswordRequest) => {
      return api.auth.resetPassword({ token, newPassword });
    },

    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.');
      navigate('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to reset password.';
      toast.error(errorMsg);
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const logoutSuccess = useAuthStore((state) => state.logoutSuccess);

  return useMutation({
    mutationFn: async () => {
      return await api.auth.logout();
    },
    onSettled: () => {
      logoutSuccess();
      toast.success('Logout successful.');
      navigate('/login');
    },
  });
};

export const useCheckDuplicateEmail = (email: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['checkEmail', email],
    queryFn: () => api.auth.checkDuplicateEmail(email),
    enabled: !!email && options?.enabled !== false,
  });
};

export const useCheckDuplicateUsername = (username: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['checkUsername', username],
    queryFn: () => api.auth.checkDuplicateUsername(username),
    enabled: !!username && options?.enabled !== false,
  });
};

export const useSocialLogin = () => {
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string; search: string } })?.from;
  const redirectUrl = from ? `${from.pathname}${from.search}` : '/home';

  const loginWithGoogle = () => {
    sessionStorage.setItem('redirectAfterLogin', redirectUrl);
    window.location.href = api.auth.googleLoginUrl;
  };

  const loginWithFacebook = () => {
    sessionStorage.setItem('redirectAfterLogin', redirectUrl);
    window.location.href = api.auth.facebookLoginUrl;
  };

  return { loginWithGoogle, loginWithFacebook };
};

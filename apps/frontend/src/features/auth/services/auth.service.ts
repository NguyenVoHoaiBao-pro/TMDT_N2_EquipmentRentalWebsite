import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  return useMutation({
    mutationFn: (loginData: LoginRequest) => {
      return api.auth.login(loginData);
    },

    onSuccess: (user) => {
      loginSuccess({ username: user.username, role: user.role }, user.token, user.refreshToken);

      toast.success(`Welcome, ${user.username}!`);
      navigate('/');
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
      const refreshToken = localStorage.getItem('refreshToken');
      return await api.auth.logout({ refreshToken });
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

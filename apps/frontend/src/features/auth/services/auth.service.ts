// src/features/auth/services/auth.service.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  return useMutation({
    mutationFn: async (loginData: Record<string, string>) => {
      const response = await api.auth.login(loginData);
      return response.data;
    },

    onSuccess: (data) => {
      loginSuccess({ username: data.username, role: data.role }, data.token, data.refreshToken);

      toast.success(`Welcome, ${data.username}!`);
      navigate('/');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMsg);
    },
  });
};

import { useMutation } from '@tanstack/react-query';
import type { ProfileUpdateRequest } from '@/features/profile/types/profile.type.ts';
import { api } from '@/services/api.ts';
import { toast } from 'sonner';

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (profileData: ProfileUpdateRequest) => {
      // Convert JavaScript to form data before sending
      const formData = new FormData();
      if (profileData.phoneNumber) formData.append('phoneNumber', profileData.phoneNumber);
      if (profileData.idCardNumber) formData.append('idCardNumber', profileData.idCardNumber);
      if (profileData.password) formData.append('password', profileData.password);
      if (profileData.avatarFile) formData.append('avatarFile', profileData.avatarFile);

      return api.user.updateProfile(formData);
    },

    onSuccess: (message) => {
      toast.success(message || 'Cập nhật hồ sơ thành công!');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Cập nhật hồ sơ thất bại.';
      toast.error(errorMsg);
    },
  });
};

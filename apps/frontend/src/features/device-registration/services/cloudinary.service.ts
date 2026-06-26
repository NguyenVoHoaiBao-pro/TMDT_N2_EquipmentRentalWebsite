// @/features/device-registration/services/cloudinary.service.ts
import apiClient from '@/services/api.ts';

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Change from JSON to multipart/form-data for upload file binary
      },
    });
  },
};

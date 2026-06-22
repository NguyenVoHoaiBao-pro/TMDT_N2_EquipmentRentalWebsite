import apiClient from '@/services/api.ts';
import type { DeviceRegistrationRequest } from '../types/registration.types';

export const registrationService = {
  registerDevice: async (data: DeviceRegistrationRequest): Promise<void> => {
    return apiClient.post('/devices', data);
  },
};

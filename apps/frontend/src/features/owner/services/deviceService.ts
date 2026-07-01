import apiClient from '@/services/api.ts';
import type { DeviceForEdit, DeviceManage, DeviceUpdatePayload } from '../types/device.types.ts';

export const deviceService = {
  // Get owner's device inventory
  getMyInventory: (): Promise<DeviceManage[]> =>
    apiClient.get('/devices/my-inventory'),

  // Get device detail for edit (owner only)
  getDeviceForEdit: (deviceId: number): Promise<DeviceForEdit> =>
    apiClient.get(`/devices/${deviceId}/edit`),

  // Update device (owner only)
  updateDevice: (deviceId: number, data: DeviceUpdatePayload): Promise<void> =>
    apiClient.put(`/devices/${deviceId}`, data),

  // Set device image as primary (owner only)
  setImageAsPrimary: (deviceId: number, imageId: number): Promise<void> =>
    apiClient.put(`/devices/${deviceId}/images/${imageId}/primary`),

  // Delete device image (owner only)
  deleteDeviceImage: (deviceId: number, imageId: number): Promise<void> =>
    apiClient.delete(`/devices/${deviceId}/images/${imageId}`),
};


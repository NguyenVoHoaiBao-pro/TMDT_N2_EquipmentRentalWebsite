// Device related types
export interface DeviceImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface DeviceForEdit {
  id: number;
  productId: number;
  productName: string;
  serialNumber: string;
  conditionPercent: number;
  pricePerDay: number;
  depositValue: number;
  status: string;
  images: DeviceImage[];
}

export interface DeviceUpdatePayload {
  pricePerDay: number;
  depositValue: number;
}

export interface DeviceManage {
  id: number;
  productId: number;
  productName: string;
  serialNumber: string;
  conditionPercent: number;
  pricePerDay: number;
  depositValue: number;
  status: string;
  images: Array<{ imageUrl: string; imageType: string }>;
}


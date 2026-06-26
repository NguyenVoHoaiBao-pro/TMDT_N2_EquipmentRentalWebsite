export interface SubImageDto {
  imageUrl: string;
  imageType: 'REAL_SHOT' | 'SERIAL_PROOF';
}

export interface DeviceRegistrationRequest {
  productId: number;
  serialNumber: string;
  conditionPercent: number;
  pricePerDay: number;
  depositValue: number;
  primaryImageUrl: string;
  subImages: SubImageDto[];
}

// profile.type.ts
export interface UserProfileResponse {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  roles: string[];
  trustScore: number;
  kycCardNumber: string | null;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_STARTED';
  kycVerifiedAt: string | null;
}

export interface BasicProfileRequest {
  phoneNumber: string;
  avatarFile: File | null;
}

export interface ChangePasswordRequest {
  oldPassword?: string; // null for social login
  newPassword: string;
}

export interface KycVerificationRequest {
  kycCardNumber: string;
  kycCardFrontFile: File | null;
  kycCardBackFile: File | null;
}

export interface RevealKycRequest {
  password: string;
}

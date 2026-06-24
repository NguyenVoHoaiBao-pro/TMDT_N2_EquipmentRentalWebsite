// profile.type.ts
export interface ProfileUpdateRequest {
  phoneNumber?: string;
  idCardNumber?: string;
  password?: string;
  avatarFile?: File | null;
}

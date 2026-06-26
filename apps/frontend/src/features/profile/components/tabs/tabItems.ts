import {
  LucideUser,
  LucideLock,
  LucideFileCheck,
  LucideHistory,
  LucideWallet,
  LucideBell,
  LucideShield,
} from 'lucide-react';

import type { ProfileTab } from './types';
import React from 'react';

export const tabItems: {
  value: ProfileTab;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { value: 'info', label: 'Thông tin', desc: 'Ảnh đại diện, SĐT', icon: LucideUser },
  { value: 'security', label: 'Bảo mật', desc: 'Mật khẩu đăng nhập', icon: LucideLock },
  { value: 'verification', label: 'Xác minh', desc: 'CCCD / KYC', icon: LucideFileCheck },
  { value: 'history', label: 'Lịch sử', desc: 'Hoạt động tài khoản', icon: LucideHistory },
  { value: 'payment', label: 'Thanh toán', desc: 'Ngân hàng', icon: LucideWallet },
  { value: 'notification', label: 'Thông báo', desc: 'Email & SMS', icon: LucideBell },
  { value: 'privacy', label: 'Riêng tư', desc: 'Hiển thị hồ sơ', icon: LucideShield },
];

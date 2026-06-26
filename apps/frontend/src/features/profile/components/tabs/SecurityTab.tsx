import { LucideShieldCheck } from 'lucide-react';

import { ChangePasswordForm } from '@/features/profile/components/security/ChangePasswordForm';
import { ConnectedAccounts } from '@/features/profile/components/security/ConnectedAccounts';
import { SessionList } from '@/features/profile/components/security/SessionList';


export function SecurityTab() {

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <LucideShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Mật khẩu & bảo mật
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý mật khẩu, tài khoản liên kết và
            thiết bị đăng nhập.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ChangePasswordForm />

        <ConnectedAccounts />

        <SessionList />
      </div>
    </div>
  );
}

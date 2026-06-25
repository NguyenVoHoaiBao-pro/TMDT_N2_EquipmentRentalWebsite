import { LucideShield } from 'lucide-react';

import { PrivacySettings } from '@/features/profile/components/privacy/PrivacySettings';

export function PrivacyTab() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <LucideShield className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Quyền riêng tư
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kiểm soát thông tin hiển thị trên hồ sơ.
          </p>
        </div>
      </div>

      <PrivacySettings />
    </div>
  );
}

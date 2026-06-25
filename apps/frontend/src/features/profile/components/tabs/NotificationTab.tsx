import { LucideBell } from 'lucide-react';

import { NotificationSettings } from '@/features/profile/components/notification/NotificationSettings';

export function NotificationTab() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
          <LucideBell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Thông báo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý email, SMS và push notification.
          </p>
        </div>
      </div>

      <NotificationSettings />
    </div>
  );
}

import { LucideHistory } from 'lucide-react';

import { ActivityTimeline } from '@/features/profile/components/history/HistoryTimeline';
import { LoginHistory } from '../history/LoginHistory';

export function HistoryTab() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <LucideHistory className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Lịch sử hoạt động
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi các hoạt động và phiên đăng nhập gần đây.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ActivityTimeline />

        <LoginHistory />
      </div>
    </div>
  );
}

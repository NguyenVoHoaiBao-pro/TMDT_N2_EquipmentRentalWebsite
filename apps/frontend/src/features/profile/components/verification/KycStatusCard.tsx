import {
  LucideBadgeCheck,
  LucideClock3,
  LucideXCircle,
} from 'lucide-react';

type KycStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'NOT_STARTED';

interface KycStatusProps {
  status?: KycStatus;
}

export function KycStatusCard({
                                status,
                              }: KycStatusProps) {
  const config = {
    NOT_STARTED: {
      icon: LucideClock3,
      title: 'Chưa xác minh',
      description:
        'Bạn chưa gửi yêu cầu xác minh danh tính.',
      color:
        'bg-slate-100 text-slate-700',
    },

    PENDING: {
      icon: LucideClock3,
      title: 'Đang xét duyệt',
      description:
        'Yêu cầu KYC đang được xử lý.',
      color:
        'bg-amber-100 text-amber-700',
    },

    VERIFIED: {
      icon: LucideBadgeCheck,
      title: 'Đã xác minh',
      description:
        'Tài khoản đã được xác minh danh tính.',
      color:
        'bg-emerald-100 text-emerald-700',
    },

    REJECTED: {
      icon: LucideXCircle,
      title: 'Từ chối',
      description:
        'Yêu cầu xác minh bị từ chối.',
      color:
        'bg-red-100 text-red-700',
    },
  };

  const current = config[status || 'NOT_STARTED'];
  const Icon = current.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${current.color}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold">
            {current.title}
          </h3>

          <p className="text-sm text-slate-500">
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
}

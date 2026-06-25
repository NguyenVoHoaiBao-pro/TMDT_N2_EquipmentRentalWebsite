const activities = [
  {
    id: 1,
    action: 'Cập nhật thông tin cá nhân',
    time: '2 giờ trước',
  },
  {
    id: 2,
    action: 'Đổi mật khẩu',
    time: '1 ngày trước',
  },
  {
    id: 3,
    action: 'Liên kết tài khoản Google',
    time: '3 ngày trước',
  },
  {
    id: 4,
    action: 'Gửi yêu cầu xác minh KYC',
    time: '5 ngày trước',
  },
];

export function ActivityTimeline() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Hoạt động tài khoản
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0"
          >
            <div className="font-medium">
              {activity.action}
            </div>

            <div className="text-sm text-slate-500">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

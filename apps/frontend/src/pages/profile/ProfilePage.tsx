import {
  LucideUser,
  LucideLock,
  LucideFileCheck,
  LucideHistory,
  LucideShieldCheck,
  LucideCamera,
} from 'lucide-react';
import { ProfileInfoForm } from '@/features/profile/components/ProfileInfoForm.tsx';
import { useState } from 'react';
import { VerifyIdentification } from '@/features/profile/components/VerifyIdentification.tsx';

const tabItems = [
  {
    value: 'info',
    label: 'Thông tin',
    desc: 'Ảnh đại diện, SĐT',
    icon: LucideUser,
  },
  {
    value: 'security',
    label: 'Bảo mật',
    desc: 'Mật khẩu đăng nhập',
    icon: LucideLock,
  },
  {
    value: 'verification',
    label: 'Xác minh',
    desc: 'CCCD / KYC',
    icon: LucideFileCheck,
  },
  {
    value: 'history',
    label: 'Lịch sử',
    desc: 'Hoạt động tài khoản',
    icon: LucideHistory,
  },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cài đặt tài khoản
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quản lý thông tin cá nhân, bảo mật và xác minh danh tính P2P của bạn.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <div
            className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:w-72 lg:flex-col lg:overflow-visible
            "
          >
            {tabItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveTab(item.value)}
                  className={`shrink-0 rounded-xl px-4 py-3 text-left transition-all lg:w-full

                    ${
                    active
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl

                        ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-slate-600'
                      }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {item.label}
                      </div>

                      <div
                        className={`mt-1 text-xs ${
                          active
                            ? 'text-slate-200'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {activeTab === 'info' && (
              <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <LucideCamera className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Thông tin cá nhân
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Cập nhật ảnh đại diện và số liên hệ để hoàn thiện hồ sơ.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                  <ProfileInfoForm />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
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
                      Đổi mật khẩu định kỳ hoặc tạo mật khẩu mới nếu bạn đăng nhập bằng Google.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                  [Component Form đổi mật khẩu sẽ đặt ở đây]
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <LucideFileCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Xác minh danh tính
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Xác minh CCCD để tăng độ tin cậy và mở khóa tính năng giá trị cao.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                  <VerifyIdentification />
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <LucideHistory className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Lịch sử
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Theo dõi thay đổi hồ sơ, bảo mật và các hoạt động tài khoản.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                  [Component lịch sử hoạt động sẽ đặt ở đây]
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

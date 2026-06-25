import { useState } from 'react';

import {
  useChangePasswordMutation,
  useGetProfileQuery,
  // useVerifyKycMutation,
} from '@/features/profile/services/profile.service.ts';
import { PaymentTab } from '@/features/profile/components/tabs/PaymentTab.tsx';
import { NotificationTab } from '@/features/profile/components/tabs/NotificationTab.tsx';
import { PrivacyTab } from '@/features/profile/components/tabs/PrivacyTab.tsx';
import { SecurityTab } from '@/features/profile/components/tabs/SecurityTab.tsx';
import { VerificationTab } from '@/features/profile/components/tabs/VerificationTab.tsx';
import { HistoryTab } from '@/features/profile/components/tabs/HistoryTab.tsx';
import { InfoTab } from '@/features/profile/components/tabs/InfoTab.tsx';
import { tabItems } from '@/features/profile/components/tabs/tabItems.ts';
import type { ProfileTab } from '@/features/profile/components/tabs/types.ts';


export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  const { data: profileData, isLoading } = useGetProfileQuery();

  const changePasswordMutation = useChangePasswordMutation();


  if (isLoading) {
    return <div>
      Đang tải dữ liệu hồ sơ cá nhân của bạn...
      Vui lòng chờ trong giây lát
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cài đặt tài khoản
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quản lý thông tin cá nhân, bảo mật và xác minh danh tính của bạn.
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
            {activeTab === 'info' && profileData && (
              <InfoTab profile={profileData}
              />
            )}

            {activeTab === 'security' && (
              <SecurityTab onChangePassword={changePasswordMutation} />
            )}

            {activeTab === 'verification' && profileData && (
              <VerificationTab profile={profileData} />
            )}

            {activeTab === 'history' && (
              <HistoryTab />
            )}

            {activeTab === 'payment' && (
              <PaymentTab />
            )}

            {activeTab === 'notification' && (
              <NotificationTab />
            )}

            {activeTab === 'privacy' && (
              <PrivacyTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

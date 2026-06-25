import { ProfileInfoForm } from '@/features/profile/components/ProfileInfoForm.tsx';
import { LucideCamera } from 'lucide-react';
import type { UserProfileResponse } from '@/features/profile/types/profile.type.ts';

interface InfoTabProps {
  profile: UserProfileResponse;
}

export function InfoTab({ profile }: InfoTabProps) {

  return (
    <>
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
          <ProfileInfoForm initialProfile={profile} />
        </div>
      </div>
    </>
  );
}

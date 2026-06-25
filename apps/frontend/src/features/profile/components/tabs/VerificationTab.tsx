import { LucideFileCheck } from 'lucide-react';

import { KycStatusCard } from '@/features/profile/components/verification/KycStatusCard';
import { VerifyIdentification } from '@/features/profile/components/verification/VerifyIdentification';
import { VerificationHistory } from '@/features/profile/components/verification/VerificationHistory';
import type { UserProfileResponse } from '@/features/profile/types/profile.type.ts';

interface VerificationTabProps {
  profile: UserProfileResponse;
}

export function VerificationTab({ profile }: VerificationTabProps) {

  return (
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
            Xác minh CCCD để tăng độ tin cậy.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <KycStatusCard status={profile?.kycStatus}
                       maskedCardNumber={profile?.kycCardNumber ?? ''}
        />

        {/* Only show VerifyIdentification if not started or rejected */}
        {profile?.kycStatus === 'NOT_STARTED' || profile?.kycStatus === 'REJECTED' && (
          <VerifyIdentification />
        )}

        <VerificationHistory />
      </div>
    </div>
  );
}

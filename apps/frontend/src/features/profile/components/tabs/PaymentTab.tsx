import { LucideWallet } from 'lucide-react';

import { BankAccountForm } from '@/features/profile/components/payment/BankAccountForm';
import { BankAccountList } from '@/features/profile/components/payment/BackAccountList';

export function PaymentTab() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <LucideWallet className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Thanh toán
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý tài khoản ngân hàng nhận tiền.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <BankAccountForm />

        <BankAccountList />
      </div>
    </div>
  );
}

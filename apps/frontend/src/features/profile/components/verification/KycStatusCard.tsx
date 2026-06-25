// @/features/profile/components/verification/KycStatusCard.tsx
import React, { useState } from 'react';
import { LucideEye, LucideEyeOff, LucideLock, LucideCheckCircle } from 'lucide-react';
import { useRevealKycMutation } from '@/features/profile/services/profile.service.ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared_components/ui/dialog';
import { Input } from '@/shared_components/ui/input';
import { Button } from '@/shared_components/ui/button';

interface KycStatusCardProps {
  status: string;
  maskedCardNumber: string | null;
}

export function KycStatusCard({ status, maskedCardNumber }: KycStatusCardProps) {
  const { mutateAsync: revealKyc, isPending } = useRevealKycMutation();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [displayCardNumber, setDisplayCardNumber] = useState(maskedCardNumber || '');
  const [isRevealed, setIsRevealed] = useState(false);

  // Handle show / hide card number
  const handleEyeClick = () => {
    if (isRevealed) {
      setDisplayCardNumber(maskedCardNumber || '');
      setIsRevealed(false);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleVerifyPasswordSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    try {
      const plainIdCardNumber = await revealKyc({ password });

      // Update the original id number (plain text):
      setDisplayCardNumber(plainIdCardNumber);
      setIsRevealed(true);

      // Clear the password input field after a successful submission
      setPassword('');
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'NOT_STARTED') return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tình trạng định danh
          </span>
          <div className="flex items-center gap-2">
            <LucideCheckCircle className={`h-5 w-5 ${status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}`} />
            <h4 className="font-bold text-slate-800">
              {status === 'VERIFIED' ? 'Đã xác minh tài khoản' : 'Đang chờ phê duyệt'}
            </h4>
          </div>
        </div>

        {/* Area for card number */}
        {maskedCardNumber && (
          <div
            className="bg-slate-50 border rounded-xl px-4 py-2.5 flex items-center justify-between gap-6 w-full sm:w-auto">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Số thẻ CCCD</p>
              <p className="text-sm font-mono font-bold text-slate-700 tracking-wider">
                {displayCardNumber}
              </p>
            </div>

            {/* Show/hide button */}
            <button
              type="button"
              onClick={handleEyeClick}
              className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors cursor-pointer"
              title={isRevealed ? 'Ẩn số CCCD' : 'Xem số CCCD đầy đủ'}
            >
              {isRevealed ? <LucideEyeOff className="h-4 w-4" /> : <LucideEye className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      {/* POPUP: Password modal*/}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleVerifyPasswordSubmit}>
            <DialogHeader>
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-900 mb-2">
                <LucideLock className="h-5 w-5" />
              </div>
              <DialogTitle className="text-center text-xl font-bold">Xác nhận mật khẩu</DialogTitle>
              <DialogDescription className="text-center">
                Để hiển thị thông tin định danh cá nhân nhạy cảm (PII), vui lòng nhập mật khẩu tài khoản của bạn để xác
                minh.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2 text-left">
              <label htmlFor="confirm-pass" className="text-sm font-semibold text-slate-700">
                Mật khẩu của bạn
              </label>
              <Input
                id="confirm-pass"
                type="password"
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu để mở khóa thông tin"
                className="h-11 bg-white focus-visible:ring-slate-900"
                autoFocus
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setIsPasswordModalOpen(false)}
                className="h-11 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isPending || !password.trim()}
                className="h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                {isPending ? 'Đang xác thực...' : 'Xác nhận xem'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// @/features/profile/components/security/ChangePasswordForm.tsx
import { useState } from 'react';
import { useChangePasswordMutation } from '@/features/profile/services/profile.service.ts';

export function ChangePasswordForm() {
  const { mutateAsync: changePassword, isPending, isSuccess, isError, error } =
    useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Validate form --- //
  const isPasswordsMatch = confirmPassword === newPassword;
  const isFormValid = newPassword.trim() !== '' && isPasswordsMatch;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      await changePassword({
        oldPassword: oldPassword || undefined,
        newPassword,
      });

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <p className="text-sm text-slate-500 mb-4">
        Vui lòng cập nhật hay thêm mật khẩu mới (đối với người dùng đăng nhập qua mạng xã hội)
        để bảo mật tài khoản của bạn.
      </p>

      <h3 className="mb-4 text-lg font-semibold">Đổi mật khẩu</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Mật khẩu hiện tại</label>
          <input
            type="password"
            disabled={isPending}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Để trống nếu đăng nhập bằng Google/Facebook"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Mật khẩu mới</label>
          <input
            type="password"
            disabled={isPending}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            disabled={isPending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          />
        </div>

        {confirmPassword !== '' && !isPasswordsMatch && (
          <p className="text-sm text-red-500 font-medium">Mật khẩu xác nhận không khớp</p>
        )}

        <button
          onClick={handleSubmit}
          type="button"
          disabled={isPending || !isFormValid}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
        </button>

        {isSuccess && <p className="text-sm text-green-600 font-medium mt-2">Đổi mật khẩu thành công!</p>}
        {isError && <p
          className="text-sm text-red-500 font-medium mt-2">{error.response?.data?.message || 'Có lỗi xảy ra'}</p>}
      </div>
    </div>
  );
}

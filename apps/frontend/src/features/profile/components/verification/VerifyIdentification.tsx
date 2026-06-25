// @/features/profile/components/verification/VerifyIdentification.tsx
import { useState, useRef } from 'react';
import { CreditCard, UploadCloud } from 'lucide-react';
import { useVerifyKycMutation } from '@/features/profile/services/profile.service.ts';

export function VerifyIdentification() {
  const { mutateAsync: verifyKyc, isPending, isSuccess, isError, error } =
    useVerifyKycMutation();

  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  // States manages preview image and file input
  const [idCardNumber, setIdCardNumber] = useState('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');

  // Handle file input changes temporarily
  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontFile(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackFile(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  // --- Check form validity ---
  const isFormValid = idCardNumber.length === 12 && frontFile !== null && backFile !== null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await verifyKyc({
        idCardNumber,
        idCardFrontFile: frontFile,
        idCardBackFile: backFile,
      });

      // Reset form sau khi gửi thành công
      setIdCardNumber('');
      setFrontFile(null);
      setBackFile(null);
      setFrontPreview('');
      setBackPreview('');
    } catch (err) {
      console.error('KYC submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Số Căn cước công dân (12 số)
          </label>
          <div className="relative">
            <CreditCard
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              maxLength={12}
              disabled={isPending}
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value.replace(/\D/g, ''))} // Chỉ cho phép gõ số
              placeholder="Nhập chính xác 12 số trên thẻ CCCD của bạn"
              className="w-full h-11 pl-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ảnh mặt trước CCCD</label>
            <div
              onClick={() => !isPending && fileInputFrontRef.current?.click()}
              className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl h-44 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-all overflow-hidden"
            >
              {frontPreview ? (
                <img src={frontPreview} alt="Mặt trước" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-xs font-medium text-slate-600">Bấm để tải ảnh mặt trước</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputFrontRef} onChange={handleFrontFileChange} accept="image/*"
                   className="hidden" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ảnh mặt sau CCCD</label>
            <div
              onClick={() => !isPending && fileInputBackRef.current?.click()}
              className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl h-44 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-all overflow-hidden"
            >
              {backPreview ? (
                <img src={backPreview} alt="Mặt sau" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-xs font-medium text-slate-600">Bấm để tải ảnh mặt sau</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputBackRef} onChange={handleBackFileChange} accept="image/*"
                   className="hidden" />
          </div>

        </div>
      </div>

      {/* Submit button */}/
      <div className="space-y-3">
        <button
          type="submit"
          disabled={isPending || !isFormValid}
          className="w-full md:w-auto rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? 'Đang gửi hồ sơ lên hệ thống...' : 'Gửi yêu cầu xác minh'}
        </button>

        {isSuccess && (
          <p className="text-sm text-green-600 font-medium">
            Gửi yêu cầu KYC thành công! Hồ sơ của bạn đang chờ hệ thống kiểm duyệt.
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-500 font-medium">
            {error.response?.data?.message || 'Có lỗi xảy ra trong quá trình gửi hồ sơ.'}
          </p>
        )}
      </div>
    </form>
  );
}

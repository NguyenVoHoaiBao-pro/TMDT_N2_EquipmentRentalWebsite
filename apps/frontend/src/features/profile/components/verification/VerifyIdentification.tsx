import { IdCard } from 'lucide-react';

export function VerifyIdentification() {
  return (
    <>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
            <IdCard className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">CCCD / KYC</p>
            <p className="mt-1 text-sm text-slate-500">
              Vui lòng upload CCCD để được tiến hành xác minh
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">
            Ảnh mặt trước
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">
            Ảnh mặt sau
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </>
  );
}

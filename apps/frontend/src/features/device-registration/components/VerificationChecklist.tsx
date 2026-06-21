import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';

export function VerificationChecklist() {
  // Mock trạng thái hoàn thành của từng bước để lên UI (sau này sẽ kết nối với thực tế dữ liệu form)
  const steps = [
    { id: 1, text: 'Device Identity', description: 'Model name & valid Serial Number', isCompleted: true },
    { id: 2, text: 'Pricing & Terms', description: 'Minimum basic rental fee structure', isCompleted: true },
    { id: 3, text: 'Primary Photo', description: 'High-resolution clear shot of front view', isCompleted: false },
    { id: 4, text: 'Serial Proof', description: 'Close-up photo showing physical engraved S/N', isCompleted: false },
  ];

  return (
    <div className="bg-white p-5 border rounded-xl shadow-sm text-left space-y-4">
      {/* Header Hộp Checklist */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <ShieldCheck className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-sm text-slate-800">Verification Checklist</h3>
      </div>

      {/* Danh sách các bước */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3 group">
            {/* Biểu tượng Check hoặc Vòng tròn trống tùy theo trạng thái hoàn thành */}
            <div className="mt-0.5 shrink-0">
              {step.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
              )}
            </div>

            {/* Chữ hiển thị */}
            <div className="space-y-0.5">
              <p
                className={`text-xs font-medium leading-none ${step.isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                {step.text}
              </p>
              <p className="text-[11px] text-gray-400 leading-normal">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Thanh Progress Bar nhỏ ở dưới bám sát tiến độ */}
      <div className="pt-2">
        <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-1">
          <span>Registration Progress</span>
          <span>50%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-teal-600 h-full w-1/2 rounded-full transition-all duration-300" />
        </div>
      </div>
    </div>
  );
}

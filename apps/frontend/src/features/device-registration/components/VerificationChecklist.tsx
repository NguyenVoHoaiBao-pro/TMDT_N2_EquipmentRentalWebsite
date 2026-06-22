// @/features/device-registration/components/VerificationChecklist.tsx
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';

interface VerificationChecklistProps {
  productId: number | null;
  serialNumber: string;
  price: string;
  deposit: string;
}

export function VerificationChecklist({
                                        productId,
                                        serialNumber,
                                        price,
                                        deposit,
                                      }: VerificationChecklistProps) {

  // Calculate progress based on completed steps
  const isIdentityDone = productId !== null && serialNumber.trim().length > 0;
  const isPricingDone = price.trim().length > 0 && deposit.trim().length > 0;
  const isPhotoDone = true;

  const steps = [
    { id: 1, text: 'Device Identity', description: 'Model name & valid Serial Number', isCompleted: isIdentityDone },
    { id: 2, text: 'Pricing & Terms', description: 'Minimum basic rental fee structure', isCompleted: isPricingDone },
    { id: 3, text: 'Primary Photo', description: 'High-resolution clear shot of front view', isCompleted: isPhotoDone },
  ];

  // Dynamic Progress Bar
  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white p-5 border rounded-xl shadow-sm text-left space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <ShieldCheck className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-sm text-slate-800">Verification Checklist</h3>
      </div>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3 group">
            <div className="mt-0.5 shrink-0">
              {step.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
              )}
            </div>
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
      {/* Dynamic Progress Bar with Progress % */}
      <div className="pt-2">
        <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-1">
          <span>Registration Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

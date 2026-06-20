import { Search, Info } from 'lucide-react';
import { useState } from 'react';

interface DeviceIdentificationProps {
  condition: number;
  onConditionChange: (value: number) => void;
}

// Mock data danh sách model có sẵn trong hệ thống để test Autocomplete
const MOCK_MODELS = [
  'Sony Alpha a7 IV Mirrorless Camera',
  'Sony FE 24-70mm f/2.8 GM II Lens',
  'Canon EOS R5 Mirrorless Camera',
  'Canon RF 50mm f/1.2L USM Lens',
  'Apple MacBook Pro 16" M3 Max',
  'DJI Mavic 3 Pro Drone',
];

export function DeviceIdentification({ condition, onConditionChange }: DeviceIdentificationProps) {
  const [modelSearch, setModelSearch] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lọc danh sách model theo chữ người dùng gõ
  const filteredModels = MOCK_MODELS.filter((model) =>
    model.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  // Hàm trả về text đánh giá dựa trên số % độ mới (Condition Slider)
  const getConditionLabel = (val: number) => {
    if (val >= 95) return 'Excellent';
    if (val >= 80) return 'Very Good';
    if (val >= 65) return 'Good';
    return 'Fair';
  };

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-5 text-left">
      {/* Header Card */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Device Identification</h2>
        <p className="text-xs text-gray-500 mt-0.5">Identify the exact hardware model and its physical status.</p>
      </div>

      {/* Row 1: Product Model (Autocomplete Dropdown) & Serial Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Field: Product Model */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Product Model <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => {
                setModelSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search or select device model..."
              className="w-full border rounded-lg p-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          {/* Sổ danh sách gợi ý khi gõ hoặc focus */}
          {isDropdownOpen && modelSearch && (
            <div
              className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
              {filteredModels.length > 0 ? (
                filteredModels.map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => {
                      setModelSearch(model);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg"
                  >
                    {model}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400 italic">No models found</div>
              )}
            </div>
          )}
          {/* Layer ẩn dropdown khi click ra ngoài */}
          {isDropdownOpen && (
            <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />
          )}
        </div>

        {/* Field: Serial Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Serial Number (S/N) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="e.g. SN1234567890"
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50 uppercase"
          />
        </div>

      </div>

      {/* Row 2: Condition Slider (Thanh trượt độ mới) */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-slate-700">Device Condition</label>
            <div className="group relative cursor-pointer">
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] rounded px-2 py-1 w-48 text-center shadow-md">
                Rate your device physical status honestly to avoid rental disputes.
              </span>
            </div>
          </div>

          {/* Badge nhảy chữ động theo % */}
          <span
            className="text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md border border-teal-100">
            {getConditionLabel(condition)} ({condition}%)
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="100"
          value={condition}
          onChange={(e) => onConditionChange(Number(e.target.value))}
          className="w-full accent-teal-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        {/* Các mốc gợi ý dưới thanh trượt */}
        <div className="flex justify-between text-[10px] text-gray-400 px-1 mt-1 font-medium">
          <span>Fair (50%)</span>
          <span>Good (70%)</span>
          <span>Very Good (85%)</span>
          <span>Brand New (100%)</span>
        </div>
      </div>
    </div>
  );
}

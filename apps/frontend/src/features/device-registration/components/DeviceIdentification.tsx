// @/features/device-registration/components/DeviceIdentification.tsx
import { Search, Info } from 'lucide-react';
import { useState } from 'react';

// Chuyển đổi dữ liệu mẫu sang dạng đối tượng thực tế chứa ID
const MOCK_DB_MODELS = [
  { productId: 101, name: 'Sony Alpha a7 IV Mirrorless Camera' },
  { productId: 102, name: 'Sony FE 24-70mm f/2.8 GM II Lens' },
  { productId: 103, name: 'Canon EOS R5 Mirrorless Camera' },
  { productId: 104, name: 'Canon RF 50mm f/1.2L USM Lens' },
];

interface DeviceIdentificationProps {
  condition: number;
  onConditionChange: (value: number) => void;
  // Bổ sung các hàm callback để báo ngược giá trị định danh về Form cha tập trung
  onModelSelect: (productId: number | null) => void;
  onSerialChange: (serialNumber: string) => void;
}

export function DeviceIdentification({
                                       condition,
                                       onConditionChange,
                                       onModelSelect,
                                       onSerialChange,
                                     }: DeviceIdentificationProps) {
  const [modelSearch, setModelSearch] = useState('');
  const [serial, setSerial] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredModels = MOCK_DB_MODELS.filter((m) =>
    m.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  const getConditionLabel = (val: number) => {
    if (val >= 95) return 'Excellent';
    if (val >= 80) return 'Very Good';
    if (val >= 65) return 'Good';
    return 'Fair';
  };

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-5 text-left">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Device Identification</h2>
        <p className="text-xs text-gray-500 mt-0.5">Identify the exact hardware model and its physical status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Field: Product Model Autocomplete */}
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
                onModelSelect(null); // Reset ID nếu người dùng tự gõ chỉnh sửa lại chữ
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search or select device model..."
              className="w-full border rounded-lg p-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          {isDropdownOpen && modelSearch && (
            <div
              className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
              {filteredModels.length > 0 ? (
                filteredModels.map((item) => (
                  <button
                    key={item.productId}
                    type="button"
                    onClick={() => {
                      setModelSearch(item.name);
                      onModelSelect(item.productId); // Lưu mã ID sản phẩm thực tế
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition font-medium"
                  >
                    {item.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400 italic">No models found</div>
              )}
            </div>
          )}
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
            value={serial}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setSerial(val);
              onSerialChange(val); // Đẩy giá trị Serial về trang quản lý tập trung
            }}
            placeholder="e.g. SN1234567890"
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Slider giữ nguyên */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-slate-700">Device Condition</label>
            <div className="group relative cursor-pointer">
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
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
      </div>
    </div>
  );
}

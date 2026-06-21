import { UploadCloud, Plus, Image as ImageIcon, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export function ImageUploads() {
  // Mock mảng chứa danh sách preview ảnh phụ đã chọn để làm mịn UI
  const [subImages, setSubImages] = useState<string[]>([]);

  // Hàm giả lập thêm một ảnh mock khi nhấn "Add Proof"
  const handleAddMockImage = () => {
    if (subImages.length >= 4) return; // Giới hạn tối đa 4 ảnh phụ giống mockup
    setSubImages([...subImages, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=60']);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSubImages(subImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6 text-left">
      {/* Header Card */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Device Images & Proofs</h2>
        <p className="text-xs text-gray-500 mt-0.5">Upload high-quality images of your device for physical
          verification.</p>
      </div>

      {/* Main Grid: Chia thành ô Ảnh chính (Trái) và bộ Ảnh phụ (Phải) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Cột 1 & 2: Vùng Ảnh chính (Primary Image) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Primary Device Image <span className="text-red-500">*</span>
          </label>

          <div
            className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer transition h-52 group">
            <div className="p-3 bg-white rounded-full shadow-sm border group-hover:scale-105 transition duration-200">
              <UploadCloud className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-700 mt-3">
              Drag and drop your main photo here, or <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports JPEG, PNG up to 10MB</p>
          </div>
        </div>

        {/* Cột 3: Vùng Ảnh phụ / Bằng chứng (Sub-images Gallery) */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Verification Proofs <span className="text-xs text-gray-400">(Max 4)</span>
          </label>

          {/* Lưới các ô chứa ảnh phụ */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[13rem]">
            {/* Render các ảnh đã thêm */}
            {subImages.map((imgUrl, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden bg-gray-50 group aspect-square">
                <img src={imgUrl} alt="proof-preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Ô Button "Add Proof" nếu chưa đủ số lượng */}
            {subImages.length < 4 && (
              <button
                type="button"
                onClick={handleAddMockImage}
                className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-lg flex flex-col items-center justify-center p-3 text-gray-400 hover:text-gray-600 bg-gray-50/30 transition aspect-square"
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Add Proof</span>
              </button>
            )}

            {/* Các ô trống hiển thị placeholder để giữ khung giống thiết kế nếu chưa có ảnh */}
            {Array.from({ length: Math.max(0, 3 - subImages.length) }).map((_, idx) => (
              <div key={`placeholder-${idx}`}
                   className="border rounded-lg flex items-center justify-center bg-gray-50/50 border-gray-100 aspect-square">
                <ImageIcon className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Blue Alert Note ở dưới cùng */}
      <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-blue-900 text-sm">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Important note on SERIAL_PROOF:</span>
          <p className="text-blue-800/90 text-xs mt-0.5 leading-relaxed">
            Please provide at least one clear real-life image showing the physical engraved Serial Number on the device
            body. This dramatically decreases approval wait times.
          </p>
        </div>
      </div>
    </div>
  );
}

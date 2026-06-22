// @/features/device-registration/components/ImageUploads.tsx
import { Plus, Image as ImageIcon, AlertCircle, X } from 'lucide-react';
import type { SubImageDto } from '../types/registration.types';

interface ImageUploadProps {
  subImages: SubImageDto[];
  onSubImagesChange: (files: SubImageDto[]) => void;
}

export function ImageUploads({ subImages, onSubImagesChange }: ImageUploadProps) {

  const handleAddMockImage = () => {
    if (subImages.length >= 4) return;

    // Gán luân phiên ảnh thật REAL_SHOT và ảnh bằng chứng số Seri SERIAL_PROOF cho phong phú dữ liệu
    const mockType = subImages.length % 2 === 0 ? 'REAL_SHOT' : 'SERIAL_PROOF';

    const newImage: SubImageDto = {
      imageUrl: 'https://unsplash.com',
      imageType: mockType,
    };

    onSubImagesChange([...subImages, newImage]); // Push data to the UI page
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onSubImagesChange(subImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6 text-left">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Device Images & Proofs</h2>
        <p className="text-xs text-gray-500 mt-0.5">Upload high-quality images of your device for physical
          verification.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* (Sub-images Gallery) */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Verification Proofs <span className="text-xs text-gray-400">(Max 4)</span>
          </label>
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[13rem]">
            {subImages.map((img, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden bg-gray-50 group aspect-square">
                <img src={img.imageUrl} alt="proof-preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1 rounded">
                  {img.imageType}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
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
            {Array.from({ length: Math.max(0, 3 - subImages.length) }).map((_, idx) => (
              <div key={`placeholder-${idx}`}
                   className="border rounded-lg flex items-center justify-center bg-gray-50/50 border-gray-100 aspect-square">
                <ImageIcon className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-blue-900 text-sm">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Important note on SERIAL_PROOF:</span>
          <p className="text-blue-800/90 text-xs mt-0.5 leading-relaxed">
            Please provide at least one clear real-life image showing the physical engraved Serial Number on the device
            body.
          </p>
        </div>
      </div>
    </div>
  );
}

// @/features/device-registration/pages/RegisterDevicePage.tsx
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UploadCloud } from 'lucide-react';
import Header from '@/components/layout/Header.tsx';
import Footer from '@/components/layout/Footer.tsx';
import BackToTop from '@/components/layout/BackToTop.tsx';
import { Button } from '@/shared_components/ui/button.tsx';
import { DeviceIdentification } from '@/features/device-registration/components/DeviceIdentification.tsx';
import { RentalTerms } from '@/features/device-registration/components/RentalTerms.tsx';
import { ImageUploads } from '@/features/device-registration/components/ImageUploads.tsx';
import { VerificationChecklist } from '@/features/device-registration/components/VerificationChecklist.tsx';
import { registrationService } from '@/features/device-registration/services/registration.service.ts';
import { cloudinaryService } from '@/features/device-registration/services/cloudinary.service.ts';
import type { SubImageDto } from '@/features/device-registration/types/registration.types.ts';

export default function RegisterDevicePage() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState<number | null>(null);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [condition, setCondition] = useState<number>(95);
  const [price, setPrice] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');

  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('');
  const [subImages, setSubImages] = useState<SubImageDto[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handling when the user uploads a new image
  const handlePrimaryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedUrl = await cloudinaryService.uploadImage(file);
      setPrimaryImageUrl(uploadedUrl);

    } catch {
      alert('Tải ảnh lên Cloudinary thất bại!');
    } finally {
      setIsUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: registrationService.registerDevice,
    onSuccess: () => {
      alert('Đăng ký thiết bị thành công! Vui lòng chờ Admin phê duyệt.');
      navigate('/dashboard');
    },
    onError: (error) => {
      alert('Đăng ký thất bại, vui lòng kiểm tra lại thông tin.');
      console.error(error);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId || !serialNumber || !price || !deposit || !primaryImageUrl) {
      alert('Vui lòng điền đầy đủ các trường và tải lên ảnh chính (*)');
      return;
    }

    mutation.mutate({
      productId,
      serialNumber,
      conditionPercent: condition,
      pricePerDay: Number(price),
      depositValue: Number(deposit),
      primaryImageUrl,
      subImages,
    });
  };

  return (
    <Fragment>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Register New Device</h1>
          <p className="text-sm text-gray-500 mt-1">Provide the essential details to list your hardware.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 lg:sticky lg:top-20 order-2 lg:order-1">
            <VerificationChecklist
              productId={productId}
              serialNumber={serialNumber}
              price={price}
              deposit={deposit}
            />
          </aside>

          <div className="lg:col-span-9 space-y-6 order-1 lg:order-2">
            <DeviceIdentification
              condition={condition}
              onConditionChange={setCondition}
              onModelSelect={setProductId}
              onSerialChange={setSerialNumber}
            />

            <RentalTerms
              price={price}
              onPriceChange={setPrice}
              deposit={deposit}
              onDepositChange={setDeposit}
            />

            {/* Upload Main Image Section */}
            <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6 text-left">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Device Images & Proofs</h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload high-quality images of your device for physical
                  verification.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primary Device Image <span className="text-red-500">*</span>
                  </label>

                  {/* Place holder for the primary image upload */}
                  <label
                    className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer transition h-52 group relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePrimaryImageChange}
                      className="hidden"
                    />

                    {primaryImageUrl ? (
                      <img src={primaryImageUrl} alt="Primary Preview"
                           className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <Fragment>
                        <div
                          className="p-3 bg-white rounded-full shadow-sm border group-hover:scale-105 transition duration-200">
                          <UploadCloud className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 mt-3">
                          {isUploading ? 'Uploading to Cloudinary...' : 'Click to browse your main photo'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Supports JPEG, PNG up to 10MB</p>
                      </Fragment>
                    )}
                  </label>
                </div>

                <ImageUploads subImages={subImages} onSubImagesChange={setSubImages} />
              </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={mutation.isPending || isUploading}
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium px-5 transition duration-200"
              >
                {mutation.isPending ? 'Processing...' : 'List Device for Approval ➔'}
              </Button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
      <BackToTop />
    </Fragment>
  );
}

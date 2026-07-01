import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared_components/ui/avatar';
import { Button } from '@/shared_components/ui/button';
import { Input } from '@/shared_components/ui/input';
import { Label } from '@/shared_components/ui/label';
import { Card } from '@/shared_components/ui/card';
import { Camera, Phone } from 'lucide-react';
import type { UserProfileResponse } from '@/features/profile/types/profile.type.ts';
import { useUpdateBasicProfileMutation } from '@/features/profile/services/profile.service.ts';

interface ProfileInfoFormProps {
  initialProfile: UserProfileResponse | null;
}

export function ProfileInfoForm({ initialProfile }: ProfileInfoFormProps) {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdateBasicProfileMutation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fallbackLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    if (initialProfile) {
      setPhoneNumber(initialProfile.phoneNumber || '');
      if (initialProfile.avatarUrl) {
        setImagePreview(initialProfile.avatarUrl);
      }
    }
  }, [initialProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    mutate({
      phoneNumber,
      avatarFile: selectedFile,
    });
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="relative mx-auto sm:mx-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative block"
            >
              <Avatar className="h-24 w-24 border-2 border-slate-200 ring-4 ring-white shadow-sm">
                <AvatarImage src={imagePreview || ''} alt={user?.username} />
                <AvatarFallback className="bg-slate-900 text-white text-2xl font-semibold">
                  {fallbackLetter}
                </AvatarFallback>
              </Avatar>

              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-5 w-5" />
              </div>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-semibold text-slate-900">Ảnh đại diện</h3>
            <p className="mt-1 text-sm text-slate-500">
              JPG, PNG. Dung lượng tối đa 5MB. Bấm vào avatar để thay ảnh mới.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
              Số điện thoại liên hệ
            </Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="phoneNumber"
                type="text"
                disabled={isPending}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                className="h-11 pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="h-11 rounded-xl px-5">
            {isPending ? 'Đang lưu thay đổi' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

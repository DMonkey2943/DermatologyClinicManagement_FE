'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon, ImagePlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { SkinImageDataType } from '@/schemaValidations/medicalRecord.schema';

interface PendingImage {
  file: File;
  image_type: 'LEFT' | 'RIGHT' | 'FRONT';
  preview: string;
  uploading?: boolean;
}

interface SkinImagesTabProps {
  medicalRecordId: string;
  images: SkinImageDataType[];
  onImagesChange: (images: SkinImageDataType[]) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export default function SkinImagesTab({ medicalRecordId, images, onImagesChange }: SkinImagesTabProps) {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length + pendingImages.length > 3) {
      toast.error('Chỉ được upload tối đa 3 ảnh');
      return;
    }
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        image_type: 'FRONT' as 'LEFT' | 'RIGHT' | 'FRONT',
        preview: URL.createObjectURL(file),
      }));
      setPendingImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleTypeChange = (index: number, value: 'LEFT' | 'RIGHT' | 'FRONT') => {
    setPendingImages(prev => prev.map((img, i) => (i === index ? { ...img, image_type: value } : img)));
  };

  const handleRemovePending = (index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = useCallback(async () => {
    for (const img of pendingImages) {
      const formData = new FormData();
      formData.append('file', img.file);
      formData.append('image_type', img.image_type);

      setPendingImages(prev => prev.map(p => (p.preview === img.preview ? { ...p, uploading: true } : p)));

      try {
        const res = await medicalRecordApiRequest.uploadSkinImage(medicalRecordId, formData);
        onImagesChange([...images.filter(i => i.image_type !== img.image_type), res.payload.data]);
        setPendingImages(prev => prev.filter(p => p.preview !== img.preview));
        toast.success(`Đã upload ảnh ${img.image_type}`);
      } catch {
        toast.error(`Lỗi khi upload ảnh ${img.file.name}`);
      }
    }
  }, [pendingImages, medicalRecordId, images, onImagesChange]);

  const handleDelete = async (imageId: string) => {
    try {
      await medicalRecordApiRequest.deleteSkinImage(imageId);
      onImagesChange(images.filter(img => img.id !== imageId));
      toast.success('Xóa ảnh thành công');
    } catch {
      toast.error('Lỗi khi xóa ảnh');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Quản lý ảnh da bệnh nhân</h3>
        <p className="text-sm text-gray-500">Tải lên và quản lý ảnh da (LEFT, RIGHT, FRONT). Tối đa 5MB mỗi ảnh.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="flex items-center gap-4">
          <Button
            variant={'outline'}
            onClick={triggerFileInput}
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-5 w-5" />
            Chọn ảnh
          </Button>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Pending Images Section */}
        {pendingImages.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ảnh đang chờ upload</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg border border-gray-200 p-2 hover:shadow-md transition-shadow"
                >
                  <Image
                    src={img.preview}
                    alt="preview"
                    width={160}
                    height={160} // Cung cấp height tạm thời, sẽ bị ghi đè bởi CSS
                    className="w-full object-cover rounded-md"
                    style={{ height: 'auto' }} // Đảm bảo height tự động
                  />
                  <Select
                    onValueChange={(value) => handleTypeChange(index, value as 'LEFT' | 'RIGHT' | 'FRONT')}
                    defaultValue={img.image_type}
                  >
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Chọn loại ảnh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEFT">Bên trái</SelectItem>
                      <SelectItem value="RIGHT">Bên phải</SelectItem>
                      <SelectItem value="FRONT">Phía trước</SelectItem>
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePending(index)}
                          disabled={img.uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xóa ảnh</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {img.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                      <svg
                        className="animate-spin h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant={'primary'}
              onClick={handleUpload}
              disabled={pendingImages.length === 0 || pendingImages.some(img => img.uploading)}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto mt-2"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload tất cả
            </Button>
          </div>
        )}

        {/* Uploaded Images Section */}
        <div className="space-y-2 pt-4 border-t border-gray-400">
          <Label className="text-sm font-medium">Ảnh đã upload</Label>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p>Chưa có ảnh nào được upload</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map(img => (
                <div
                  key={img.id}
                  className="relative group rounded-lg border border-gray-200 p-2 hover:shadow-md transition-shadow"
                >
                  <Image
                    src={`${API_BASE_URL}${img.image_path}`}
                    alt={img.image_type}
                    width={160}
                    height={160} // Cung cấp height tạm thời, sẽ bị ghi đè bởi CSS
                    className="w-full object-cover rounded-md"
                    style={{ height: 'auto' }} // Đảm bảo height tự động
                  />
                  <Label className="mt-2 text-sm font-medium">
                    {img.image_type === 'LEFT' ? 'Bên trái' : img.image_type === 'RIGHT' ? 'Bên phải' : 'Phía trước'}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(img.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xóa ảnh</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
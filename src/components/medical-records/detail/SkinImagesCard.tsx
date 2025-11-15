import React, { useState, useEffect } from 'react';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { SkinImageDataType } from '@/schemaValidations/medicalRecord.schema';

interface SkinImagesCardProps {
  medicalRecordId: string;
}

export default function SkinImagesCard({
  medicalRecordId
}: SkinImagesCardProps) {    
    const [skinImages, setSkinImages] = useState<SkinImageDataType[]>([]); // Thêm state cho ảnh

    useEffect(() => {
        fetchSkinImages(medicalRecordId);
    }, [medicalRecordId]);

    const fetchSkinImages = async (medical_record_id: string) => {
        try {
            const {payload} = await medicalRecordApiRequest.getSkinImageListByMRId(medical_record_id);
            const data = payload.data;
            console.log(data);
            setSkinImages(data);
        } catch (error) {
            console.error('Chưa có ảnh hoặc lỗi tải ảnh da mặt bệnh nhân:', error);
        }
    };

  return (
    skinImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
        <ImageIcon className="h-10 w-10 mb-2" />
        <p>Chưa có ảnh nào được upload</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skinImages.map(img => (
            <div
            key={img.id}
            className="relative group rounded-lg border border-gray-200 p-2 hover:shadow-md transition-shadow"
            >
            <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}${img.image_path}`}
                alt={img.image_type}
                width={160}
                height={160}
                className="w-full object-cover rounded-md"
                style={{ height: 'auto' }}
            />
            <p className="mt-2 text-sm font-medium text-gray-800">
                {img.image_type === 'LEFT' ? 'Bên trái' : img.image_type === 'RIGHT' ? 'Bên phải' : 'Phía trước'}
            </p>
            </div>
        ))}
        </div>
    )
  )
}
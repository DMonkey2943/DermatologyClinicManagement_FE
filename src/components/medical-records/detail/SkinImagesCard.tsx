// components/skin-images/SkinImagesCard.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Maximize2, X } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import medicalRecordApiRequest from "@/apiRequests/medicalRecord";
import { SkinImageDataType } from "@/schemaValidations/medicalRecord.schema";

interface SkinImagesCardProps {
  medicalRecordId: string;
}

const imageTypeConfig: Record<
  NonNullable<SkinImageDataType["image_type"]>,
  { label: string; icon: React.ReactNode; color: string }
> = {
  FRONT: { label: "Phía trước", icon: <Camera className="w-4 h-4" />, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  LEFT: { label: "Bên trái", icon: <Camera className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  RIGHT: { label: "Bên phải", icon: <Camera className="w-4 h-4" />, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
};

export default function SkinImagesCard({ medicalRecordId }: SkinImagesCardProps) {
  const [images, setImages] = useState<SkinImageDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SkinImageDataType | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchImages = async () => {
      if (!medicalRecordId) return;
      setLoading(true);
      try {
        const { payload } = await medicalRecordApiRequest.getSkinImageListByMRId(medicalRecordId);
        setImages(payload.data || []);
      } catch (error) {
        console.error("Lỗi tải ảnh da:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [medicalRecordId]);

  if (loading) {
    return <SkinImagesSkeleton />;
  }

  if (images.length === 0) {
    return (
        <div className="text-center py-2 text-muted-foreground">
            Không có ảnh nào được ghi nhận
        </div>
    );
  }

  return (
    <>
      {/* <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Camera className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Ảnh da bệnh nhân
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => {
              const config = imageTypeConfig[img.image_type] || imageTypeConfig.FRONT;
              const imageUrl = `${baseUrl}${img.image_path}`;

              return (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-xl border bg-card shadow-md hover:shadow-2xl transition-all duration-300 cursor-zoom-in"
                  onClick={() => setSelectedImage(img)}
                >
                  {/* Ảnh */}
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={config.label}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized // Nếu ảnh từ backend không hỗ trợ optimization
                    />
                    {/* Overlay khi hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <Maximize2 className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className="p-4 space-y-3">
                    <Badge className={`${config.color} font-medium`}>
                      {config.icon}
                      <span className="ml-1.5">{config.label}</span>
                    </Badge>
                    {/* {img.created_at && (
                      <p className="text-xs text-muted-foreground">
                        Chụp: {new Date(img.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    )} */}
                  </div>
                </div>
              );
            })}
          </div>
        {/* </CardContent>
      </Card> */}

      {/* Modal xem ảnh lớn */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/90 border-none">
          {selectedImage && (
            <div className="relative w-full h-screen flex items-center justify-center">
              {/* Nút đóng */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Ảnh fullscreen */}
              <Image
                src={`${baseUrl}${selectedImage.image_path}`}
                alt={imageTypeConfig[selectedImage.image_type]?.label || "Ảnh da"}
                fill
                className="object-contain"
                unoptimized
              />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <p className="text-2xl font-semibold">
                  {imageTypeConfig[selectedImage.image_type]?.label || "Ảnh da bệnh nhân"}
                </p>
                {/* {selectedImage.created_at && (
                  <p className="text-sm opacity-90 mt-1">
                    Chụp ngày {new Date(selectedImage.created_at).toLocaleString("vi-VN")}
                  </p>
                )} */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Skeleton khi đang tải
function SkinImagesSkeleton() {
  return (
    // <Card>
    //   <CardHeader>
    //     <Skeleton className="h-8 w-48" />
    //   </CardHeader>
    //   <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
    //   </CardContent>
    // </Card>
  );
}
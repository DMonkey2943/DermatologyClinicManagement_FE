"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { X, Upload, ImageIcon, Plus, Loader2 } from "lucide-react"
import medicalRecordApiRequest from "@/apiRequests/medicalRecord"
import type { SkinImageDataType } from "@/schemaValidations/medicalRecord.schema"
import predictAcneSeverityApiRequest from "@/apiRequests/predictAcneSeverity"

type ImagePosition = "LEFT" | "RIGHT" | "FRONT"

interface PendingImage {
  file: File
  position: ImagePosition
  preview: string
  uploading?: boolean
}

interface SkinImagesTabProps {
  medicalRecordId: string
  images: SkinImageDataType[]
  onImagesChange: (images: SkinImageDataType[]) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

const positionLabels: Record<ImagePosition, string> = {
  LEFT: "Mặt trái",
  RIGHT: "Mặt phải",
  FRONT: "Mặt trước",
}

const positionOrder: ImagePosition[] = ["LEFT", "RIGHT", "FRONT"]

export default function SkinImagesTab({ medicalRecordId, images, onImagesChange }: SkinImagesTabProps) {
  const [pendingImages, setPendingImages] = useState<Record<ImagePosition, PendingImage | null>>({
    LEFT: null,
    RIGHT: null,
    FRONT: null,
  })
  const [aiResults, setAiResults] = useState<Record<ImagePosition, string>>({
    LEFT: "",
    RIGHT: "",
    FRONT: "",
  }); // theo position

  const [aiLoading, setAiLoading] = useState<Set<ImagePosition>>(new Set());

  const [isUploading, setIsUploading] = useState(false)

  const fileInputRefs = useRef<Record<ImagePosition, HTMLInputElement | null>>({
    LEFT: null,
    RIGHT: null,
    FRONT: null,
  })

  const handleFileChange = (position: ImagePosition, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Kiểm tra kích thước file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB")
        return
      }

      // Tạo preview URL và lưu vào state
      const preview = URL.createObjectURL(file)
      setPendingImages((prev) => ({
        ...prev,
        [position]: {
          file,
          position,
          preview,
          uploading: false,
        },
      }))

      toast.success(`Đã chọn ảnh ${positionLabels[position]}`)
    }
  }

  const handleRemovePending = (position: ImagePosition) => {
    const current = pendingImages[position]
    if (current?.preview) {
      URL.revokeObjectURL(current.preview)
    }
    setPendingImages((prev) => ({
      ...prev,
      [position]: null,
    }))
  }

  const handleUploadAll = useCallback(async () => {
  const imagesToUpload = positionOrder.filter((pos) => pendingImages[pos] !== null)

  if (imagesToUpload.length === 0) {
    toast.error("Vui lòng chọn ít nhất 1 ảnh")
    return
  }

  setIsUploading(true)
  let successCount = 0
  let updatedImages = [...images]

  // Tạo danh sách cần xóa preview sau khi upload xong (để tránh stale closure)
  const positionsToClear: ImagePosition[] = []

  for (const position of imagesToUpload) {
    const pendingImage = pendingImages[position]
    if (!pendingImage) continue

    try {
      // Bật loading cho ảnh đang upload
      setPendingImages((prev) => ({
        ...prev,
        [position]: { ...prev[position]!, uploading: true },
      }))

      const formData = new FormData()
      formData.append("file", pendingImage.file)
      formData.append("image_type", position)

      const res = await medicalRecordApiRequest.uploadSkinImage(medicalRecordId, formData)

      // Cập nhật danh sách ảnh đã upload
      updatedImages = updatedImages
        .filter((i) => i.image_type !== position)
        .concat(res.payload.data)
      
      // XÓA KẾT QUẢ AI CŨ CỦA VỊ TRÍ NÀY
      setAiResults(prev => ({
        ...prev,
        [position]: ""  // hoặc delete prev[position] nếu muốn
      }));

      // Đánh dấu để xóa preview sau
      positionsToClear.push(position)

      toast.success(`Đã upload ảnh ${positionLabels[position]}`)
      successCount++
    } catch (error) {
      console.error(`Lỗi upload ảnh ${positionLabels[position]}:`, error)
      toast.error(`Lỗi khi upload ảnh ${positionLabels[position]}`)
    } finally {
      // Luôn tắt loading
      setPendingImages((prev) => ({
        ...prev,
        [position]: prev[position] ? { ...prev[position]!, uploading: false } : null,
      }))
    }
  }

  // SAU KHI LOOP HOÀN TẤT: XÓA TẤT CẢ PREVIEW MỘT LẦN DUY NHẤT → ĐẢM BẢO KHÔNG BỊ STALE
  if (positionsToClear.length > 0) {
    setPendingImages((prev) => {
      const newState = { ...prev }
      positionsToClear.forEach((pos) => {
        newState[pos] = null
      })
      return newState
    })
  }

  // Cập nhật ảnh đã upload cho parent
  if (successCount > 0) {
    onImagesChange(updatedImages)
  }

  setIsUploading(false)

  if (successCount === imagesToUpload.length) {
    toast.success("Upload tất cả ảnh thành công!")
  }
}, [pendingImages, medicalRecordId, images, onImagesChange])

  const handleDelete = async (imageId: string) => {
    try {
      await medicalRecordApiRequest.deleteSkinImage(imageId)
      onImagesChange(images.filter((img) => img.id !== imageId))
      toast.success("Xóa ảnh thành công")
    } catch (error) {
      console.error("Lỗi khi xóa ảnh:", error)
      toast.error("Lỗi khi xóa ảnh")
    }
  }

  const triggerFileInput = (position: ImagePosition) => {
    fileInputRefs.current[position]?.click()
  }

  const analyzeWithAI = async (image: SkinImageDataType) => {
    const position = image.image_type as ImagePosition;
    setAiLoading(prev => new Set(prev).add(position));

    try {
      const res = await predictAcneSeverityApiRequest.fromImagePath({
        image_path: image.image_path
      });

      const data = res.payload.data;

      if (res.status === 200) {
        setAiResults(prev => ({
          ...prev,
          [position]: data.severity_display
        }));
        toast.success(`AI đã đánh giá mức độ nghiêm trọng của mụn trứng cá thành công`);
      } else {
        setAiResults(prev => ({ ...prev, [position]: "Lỗi đánh giá" }));
        toast.error("AI không thể đánh giá ảnh này");
      }
    } catch (err) {
      setAiResults(prev => ({ ...prev, [position]: "Không xác định" }));
    } finally {
      setAiLoading(prev => {
        const next = new Set(prev);
        next.delete(position);
        return next;
      });
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Quản lý ảnh da bệnh nhân</h3>
        <p className="text-sm text-gray-500">
          Tải lên ảnh da theo 3 vị trí (mặt trái, mặt phải, mặt trước). Tối đa 5MB mỗi ảnh.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-4 block">Chọn ảnh</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {positionOrder.map((position) => {
              const pending = pendingImages[position]
              const hasImage = pending !== null

              return (
                <div
                  key={position}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(position, e)}
                    ref={(el) => {
                      if (el) fileInputRefs.current[position] = el
                    }}
                    className="hidden"
                  />

                  {hasImage && pending ? (
                    <div className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                        <Image
                          src={pending.preview || "/placeholder.svg"}
                          alt={`preview-${position}`}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                        {pending.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{positionLabels[position]}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => triggerFileInput(position)}
                        disabled={pending.uploading || isUploading}
                        className="w-full"
                      >
                        Thay ảnh
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePending(position)}
                        disabled={pending.uploading || isUploading}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerFileInput(position)}
                      disabled={isUploading}
                      className="w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">{positionLabels[position]}</p>
                      <p className="text-xs text-gray-500">Nhấn để chọn ảnh</p>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleUploadAll}
            disabled={!positionOrder.some((pos) => pendingImages[pos] !== null) || isUploading}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Lưu ảnh
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200">
          <Label className="text-sm font-medium">Ảnh đã ghi nhận</Label>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p>Chưa có ảnh nào được ghi nhận</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {positionOrder.map((position) => {
                const image = images.find((img) => img.image_type === position)

                return image ? (
                  <div
                    key={image.id}
                    className="rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 h-40 mb-3 group">
                      <Image
                        src={`${API_BASE_URL}${image.image_path}`}
                        alt={positionLabels[position]}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={() => handleDelete(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-medium text-gray-700">
                        {positionLabels[position]}
                      </p>

                      {/* Hiển thị kết quả AI theo position */}
                      {aiLoading.has(position) ? (
                        <span className="text-xs text-blue-600 animate-pulse">Đang đánh giá...</span>
                      ) : aiResults[position] ? (
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          aiResults[position].toLowerCase().includes('nặng') ? 'bg-red-100 text-red-800' :
                          aiResults[position].toLowerCase().includes('trung bình') ? 'bg-orange-100 text-orange-800' :
                          aiResults[position].toLowerCase().includes('nhẹ') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {aiResults[position]}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => image && analyzeWithAI(image)}
                          className="text-xs h-7"
                        >
                          AI đánh giá
                        </Button>
                      )}
                    </div>
                    {/* <p className="text-sm font-medium text-gray-700">{positionLabels[position]}</p> */}
                  </div>
                ) : (
                  <div
                    key={position}
                    className="rounded-lg border border-gray-200 p-3 bg-gray-50 flex items-center justify-center h-48"
                  >
                    <p className="text-sm text-gray-500">Chưa có ảnh {positionLabels[position].toLowerCase()}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
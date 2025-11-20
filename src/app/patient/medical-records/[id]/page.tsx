'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton' // Thêm Skeleton để loading đẹp hơn
import { ArrowLeft, FileText, Pill, Zap, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, use, useEffect } from 'react'
import { MedicalRecordFullDataType } from '@/schemaValidations/medicalRecord.schema'
import patientMedicalRecordApiRequest from '@/apiRequests/patient/medicalRecord'

function MedicalRecordDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-48" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-48" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MedicalRecordDetailPage({ params }: {
  params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const [medicalRecord, setMedicalRecord] = useState<MedicalRecordFullDataType>();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    
    useEffect(() => {
        fetchMedicalRecordDetail();
    }, [id]);
    
    const fetchMedicalRecordDetail = async () => {
        try {
            setLoading(true)
            setError(false)
            const {payload} = await patientMedicalRecordApiRequest.getDetail(id);
            const data = payload.data;
            console.log(data);
            if (data) {
                setMedicalRecord(data)
            } else {
                setError(true)
            }
        } catch(error) {
            console.error('Lỗi lấy chi tiết thông tin phiên khám:', error);
            setError(true)
        } finally {
            setLoading(false)
        }
    }
  
  //   Trường hợp đang loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 md:py-10">
          <Link href="/patient/medical-records">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft size={18} />
              Quay lại
            </Button>
          </Link>
          <MedicalRecordDetailSkeleton />
        </main>
      </div>
    )
  }
  
  // Trường hợp lỗi hoặc không có dữ liệu
  if (error || !medicalRecord) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 md:py-10">
          <Link href="/patient/medical-records">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft size={18} />
              Quay lại
            </Button>
          </Link>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Không có thông tin chi tiết phiên khám
            </h2>
            <p className="text-muted-foreground max-w-md">
              Có thể phiên khám này chưa được cập nhật hoặc đã bị xóa. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </p>
          </div>
        </main>
      </div>
    )
  }
  
  // Dữ liệu đã có → render bình thường
  const invoice = medicalRecord.invoices[0]

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Back Button */}
        <Link href="/patient/medical-records">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft size={18} />
            Quay lại
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Chi tiết phiên khám</h1>
              <p className="text-muted-foreground">
                {new Date(medicalRecord.created_at).toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 w-fit">
              Đã thanh toán
            </Badge>
          </div>
        </div>

        {/* Doctor & Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Bác sĩ khám</p>
              <p className="text-lg font-semibold text-foreground">{medicalRecord.doctor.full_name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Bệnh nhân</p>
              <p className="text-lg font-semibold text-foreground">{medicalRecord.patient.full_name}</p>
            </CardContent>
          </Card>
        </div>

        {/* Medical Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Phiếu khám bệnh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Symptoms */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Triệu chứng</h3>
              <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-lg">
                {medicalRecord.symptoms}
              </p>
            </div>

            {/* Diagnosis */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Chẩn đoán</h3>
              <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-lg">
                {medicalRecord.diagnosis}
              </p>
            </div>

            {/* Doctor's Notes */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Lời dặn bác sĩ</h3>
              <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-lg">
                {medicalRecord.notes || 'Không có ghi chú'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        {medicalRecord.prescriptions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill size={20} className="text-primary" />
                Đơn thuốc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold text-foreground">STT</th>
                      <th className="text-left py-3 px-2 font-semibold text-foreground">Tên thuốc</th>
                      <th className="text-left py-3 px-2 font-semibold text-foreground">Dạng</th>
                      <th className="text-right py-3 px-2 font-semibold text-foreground">Số lượng</th>
                      <th className="text-left py-3 px-2 font-semibold text-foreground">Cách dùng</th>
                      {/* <th className="text-right py-3 px-2 font-semibold text-foreground">Giá</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecord.prescriptions[0].prescription_details!.map((med, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-2 text-foreground">{idx + 1}</td>
                        <td className="py-3 px-2 text-foreground">{med.name}</td>
                        <td className="py-3 px-2 text-muted-foreground">{med.dosage_form}</td>
                        <td className="py-3 px-2 text-right text-foreground">{med.quantity}</td>
                        <td className="py-3 px-2 text-muted-foreground">{med.dosage}</td>
                        {/* <td className="py-3 px-2 text-right text-foreground font-medium">
                          {med.totalPrice.toLocaleString('vi-VN')}đ
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Indications */}
        {medicalRecord.service_indications.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                Phiếu chỉ định dịch vụ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold text-foreground">STT</th>
                      <th className="text-left py-3 px-2 font-semibold text-foreground">Tên dịch vụ</th>
                      <th className="text-right py-3 px-2 font-semibold text-foreground">Số lượng</th>
                      {/* <th className="text-right py-3 px-2 font-semibold text-foreground">Giá</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecord.service_indications[0].service_indication_details!.map((service, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-2 text-foreground">{idx + 1}</td>
                        <td className="py-3 px-2 text-foreground">{service.name}</td>
                        <td className="py-3 px-2 text-right text-foreground">{service.quantity}</td>
                        {/* <td className="py-3 px-2 text-right text-foreground font-medium">
                          {service.totalPrice.toLocaleString('vi-VN')}đ
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skin Images */}
        {medicalRecord.skin_images.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" />
                Hình ảnh da mặt được ghi nhận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {medicalRecord.skin_images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.image_path)}
                    className="relative overflow-hidden rounded-lg border border-border hover:border-primary transition-colors group"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}${image.image_path}`}
                      alt={image.image_type}
                      className="w-full h-40 object-cover group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <p className="text-white text-xs font-medium">
                        {image.image_type === 'FRONT' ? 'Phía trước' : image.image_type === 'LEFT' ? 'Bên trái' : 'Bên phải'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice Summary */}
        {invoice && (
          <Card>
            <CardHeader>
              <CardTitle>Hóa đơn khám chữa bệnh</CardTitle>
            </CardHeader>
            {invoice && (
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng dịch vụ:</span>
                    <span className="font-medium text-foreground">
                        {invoice.service_subtotal!.toLocaleString('vi-VN')}đ
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng thuốc:</span>
                    <span className="font-medium text-foreground">
                        {invoice.medication_subtotal!.toLocaleString('vi-VN')}đ
                    </span>
                    </div>
                    {/* {invoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                        <span>Giảm giá:</span>
                        <span>-{invoice.discountAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                    )} */}
                </div>
                <div className="border-t border-border pt-4 flex justify-between bg-secondary p-4 rounded-lg">
                    <span className="font-semibold text-foreground">Tổng cộng:</span>
                    <span className="text-lg font-bold text-primary">
                    {invoice.final_amount!.toLocaleString('vi-VN')}đ
                    </span>
                </div>
                </CardContent>                
            )}
          </Card>
        )}

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-2xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-white text-black rounded-full p-2 hover:bg-gray-200"
              >
                ✕
              </button>
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}${selectedImage}`}
                alt="Enlarged skin image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

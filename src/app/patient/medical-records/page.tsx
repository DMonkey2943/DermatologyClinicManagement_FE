'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema'
import patientMedicalRecordApiRequest from '@/apiRequests/patient/medicalRecord'
import { formatDateTime } from '@/lib/utils'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'IN_PROGRESS':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PAID: 'Đã thanh toán',
    IN_PROGRESS: 'Đang khám',
    COMPLETED: 'Đã hoàn thành',
  }
  return labels[status] || status
}

export default function MedicalHistoryPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>([]);
  
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      const { payload } = await patientMedicalRecordApiRequest.getList();
      const data = payload.data;
      // console.log(data);
      setMedicalRecords(data);
    };
    
    fetchMedicalRecords();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lịch sử khám chữa bệnh</h1>
          <p className="text-muted-foreground">Danh sách tất cả các phiên khám chữa bệnh của bạn</p>
        </div>

        {/* Medical Records List */}
        <div className="space-y-4">
          {medicalRecords.length > 0 ? (
            medicalRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <FileText size={20} className="text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 text-balance">
                            {record.diagnosis}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {record.symptoms}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>📅 {formatDateTime(record.created_at)}</span>
                            <span>•</span>
                            <span>👨‍⚕️ {record.doctor.full_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch md:items-center gap-2 md:gap-3">
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                      <Link href={`/patient/medical-records/${record.id}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full gap-2">
                          Xem chi tiết
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Không có lịch sử khám chữa bệnh</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

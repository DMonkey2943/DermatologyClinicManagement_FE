'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { AppointmentDataType } from '@/schemaValidations/appointment.schema'
import { useEffect, useState } from 'react'
import patientAppointmentApiRequest from '@/apiRequests/patient/appointment'
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema'
import patientMedicalRecordApiRequest from '@/apiRequests/patient/medicalRecord'
import { formatDateTime } from '@/lib/utils'


const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'WAITING':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'IN_PROGRESS':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    SCHEDULED: 'Đã đặt lịch',
    WAITING: 'Đang chờ',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Đã hoàn thành',
    IN_PROGRESS: 'Đang khám',
    PAID: 'Đã thanh toán',
  }
  return labels[status] || status
}

export default function HomePage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentDataType[]>([]);
  const [recentMedicalRecords, setRecentMedicalRecords] = useState<MedicalRecordDataType[]>([]);

  useEffect(() => {    
      fetchUpcomingAppointments();
      fetchRecentMedicalRecords();
    }, []);

  const fetchUpcomingAppointments = async () => {
    const { payload } = await patientAppointmentApiRequest.getList({upcoming: true});
    const appointmentList = payload.data;
    //console.log(appointmentList);
    setUpcomingAppointments(appointmentList);
  };

  const fetchRecentMedicalRecords = async () => {
      const { payload } = await patientMedicalRecordApiRequest.getList({limit: 1});
      const data = payload.data;
      // console.log(data);
      setRecentMedicalRecords(data);
    };
  

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trang chủ</h1>
          {/* <p className="text-muted-foreground">Xin chào {mockPatient.name}, đây là tổng quan về khám chữa bệnh của bạn</p> */}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <CardTitle className="text-lg">Lịch hẹn sắp tới</CardTitle>
                    <CardDescription>Các cuộc hẹn trong tương lai</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.length > 0 ? (
                <>
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(appointment.appointment_date).toLocaleDateString('vi-VN', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                  ))}
                  <Link href="/patient/appointments" className="block pt-2">
                    <Button variant="outline" className="w-full gap-2">
                      Xem tất cả lịch hẹn
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">Không có lịch hẹn sắp tới</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Medical History */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary" size={20} />
                  <div>
                    <CardTitle className="text-lg">Lịch sử khám gần nhất</CardTitle>
                    <CardDescription>Thông tin khám chữa bệnh gần đây</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMedicalRecords.length > 0 ? (
                <>
                  {recentMedicalRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="p-3 bg-secondary rounded-lg">
                      <p className="font-medium text-foreground mb-1">{record.diagnosis}</p>
                      <p className="text-sm text-muted-foreground mb-2">{record.symptoms}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusLabel(record.status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDateTime(record.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  <Link href="/patient/medical-records" className="block pt-2">
                    <Button variant="outline" className="w-full gap-2">
                      Xem tất cả lịch sử
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">Không có lịch sử khám</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

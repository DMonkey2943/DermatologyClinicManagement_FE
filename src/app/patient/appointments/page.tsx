'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppointmentDataType } from '@/schemaValidations/appointment.schema'
import patientAppointmentApiRequest from '@/apiRequests/patient/appointment'
import AppointmentFormModal from '@/components/appointments/patient/AppointmentFormModal'
// import Link from 'next/link'


const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'WAITING':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    // CONFIRMED: 'Đã xác nhận',
    // PENDING: 'Chờ xác nhận',
    SCHEDULED: 'Đã đặt lịch',
    WAITING: 'Đang chờ',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Đã hoàn thành',
  }
  return labels[status] || status
}

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [appointments, setAppointments] = useState<AppointmentDataType[]>([]);
  const [modalType, setModalType] = useState<'add' | null>(null);
  
  useEffect(() => {    
    fetchAppointments();
  }, []);

  
  const fetchAppointments = async () => {
    const { payload } = await patientAppointmentApiRequest.getList();
    const appointmentList = payload.data;
  //   console.log(appointmentList);
    setAppointments(appointmentList);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.appointment_date.includes(searchTerm) || apt.doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || apt.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openAddModal = () => {
    // setEditingAppointment(null);
    setModalType('add');
    // setPage(0);
  };
  const closeModal = () => {
    // setEditingAppointment(null);
    setModalType(null);
  };

  const handleFormSubmit = async () => {
    closeModal();
    
    console.log("handleFormSubmit - setAppointments");
    await fetchAppointments(); // Sử dụng currentTab để fetch đúng tab
  };

  return (
    <div className="min-h-screen bg-background">
      <AppointmentFormModal
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={handleFormSubmit}
        editingAppointment={null}
        modalType={modalType}
      />

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lịch hẹn</h1>
            <p className="text-muted-foreground">Quản lý tất cả cuộc hẹn khám chữa bệnh của bạn</p>
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full md:w-auto">
            <Plus size={18} />
            Đặt lịch hẹn mới
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Tìm kiếm theo ngày hoặc bác sĩ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="SCHEDULED">Đã đặt lịch</option>
                <option value="WAITING">Đang chờ</option>
                <option value="COMPLETED">Đã hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar size={18} className="text-primary" />
                        <span className="text-lg font-semibold text-foreground">
                          {new Date(appointment.appointment_date).toLocaleDateString('vi-VN', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="ml-10 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Giờ hẹn:</span> {appointment.appointment_time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Bác sĩ:</span> {appointment.doctor.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                      {appointment.status === 'SCHEDULED' && (
                        <Button variant="outline" size="sm">Hủy lịch</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">Không tìm thấy lịch hẹn phù hợp</p>
                <Button className="gap-2">
                  <Plus size={18} />
                  Đặt lịch hẹn mới
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Button from '@/components/ui/button/Button';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentFormModal from '@/components/appointments/AppointmentFormModal';
import appointmentApiRequest from '@/apiRequests/appointment';
import { AppointmentDataType } from '@/schemaValidations/appointment.schema';
import DatePicker from '@/components/form/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { FunnelX } from 'lucide-react';
// import userApiRequest from '@/apiRequests/user';
// import { UserDataType } from '@/schemaValidations/user.schema';
import { PatientDataType } from '@/schemaValidations/patient.schema';
import patientApiRequest from '@/apiRequests/patient';
import Combobox from '@/components/form/Combobox';
import { useAuth } from "@/context/AuthContext";

export default function ClientAppointmentListPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDataType[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentDataType | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<string>('all'); // Thêm state để theo dõi tab hiện tại

  // State cho bộ lọc
  // const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(undefined);

  // Danh sách trạng thái
  const statusOptions = [
    { value: 'SCHEDULED', label: 'Đã đặt' },
    { value: 'WAITING', label: 'Đang chờ' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  // const [doctors, setDoctors] = useState<DoctorDataType[]>([]);
  // const [doctors, setDoctors] = useState<UserDataType[]>([]);
  const [patients, setPatients] = useState<PatientDataType[]>([]);

  useEffect(() => {
    // const fetchDoctors = async () => {
    //   const { payload } = await userApiRequest.getDoctorList();
    //   const doctorList = payload.data;
    //   setDoctors(doctorList);
    // };
    const fetchPatients = async () => {
      const { payload } = await patientApiRequest.getList({limit:100});
      const patientList = payload.data;
      setPatients(patientList);
    };
    // fetchDoctors();
    fetchPatients();
  }, []);

  // Chỉ fetch khi ở tab "Tất cả" và các bộ lọc thay đổi
  useEffect(() => {
    if (currentTab === 'all') {
      fetchAppointments('all');
      console.log("useEffect - setAppointments");
    }
  }, [page, pageSize, patientId, selectedStatuses, appointmentDate]);

  const fetchAppointments = async (tab: string = 'all') => {
    setIsLoading(true);
    try {
      const params: any = { skip: page * pageSize, limit: pageSize };

      // Xử lý theo từng tab
      if (tab === 'upcoming') {
        params.upcoming = true;
      } else if (tab === 'today') {
        params.appointment_date = format(new Date(), 'yyyy-MM-dd');
      } else if (tab === 'waiting') {
        params.status = ['WAITING'];
      } else {
        // Tab "Tất cả" sử dụng bộ lọc
        params.doctor_id = user?.id;
        if (patientId) params.patient_id = patientId;
        if (selectedStatuses.length > 0) params.status = selectedStatuses;
        if (appointmentDate) params.appointment_date = format(appointmentDate, 'yyyy-MM-dd');
      }

      const { payload } = await appointmentApiRequest.getList(params);
      const appointmentList = payload.data;
      setAppointments(appointmentList);
      // console.log("fetchAppointments - setAppointments");
      const totalFromPayload = payload.meta?.total;
      setTotal(Number(totalFromPayload) || appointmentList.length);

      const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || appointmentList.length) / pageSize));
      if (page > totalPages - 1) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách Appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (appointment: AppointmentDataType) => {
    setEditingAppointment(appointment);
    setModalType('edit');
  };

  const handleStatusChange = (id: string, newStatus: AppointmentDataType['status']) => {
    console.log("handleStatusChange - setAppointments");
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleFormSubmit = async () => {
    closeModal();
    
    console.log("handleFormSubmit - setAppointments");
    await fetchAppointments(currentTab); // Sử dụng currentTab để fetch đúng tab
  };

  const openAddModal = () => {
    setEditingAppointment(null);
    setModalType('add');
    setPage(0);
  };

  const closeModal = () => {
    setEditingAppointment(null);
    setModalType(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  // Xử lý thay đổi tab
  const handleTabChange = (value: string) => {
    setCurrentTab(value); // Cập nhật tab hiện tại
    setPage(0); // Reset về trang đầu khi đổi tab
    // setDoctorId(undefined); // Reset bộ lọc khi đổi tab
    setPatientId(undefined);
    setSelectedStatuses([]);
    setAppointmentDate(undefined);
    
    console.log("handleTabChange - setAppointments");
    fetchAppointments(value);
  };

  return (
    <>
      <AppointmentFormModal
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={handleFormSubmit}
        editingAppointment={editingAppointment}
        modalType={modalType}
      />
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
          <TabsTrigger value="today">Hôm nay</TabsTrigger>
          <TabsTrigger value="waiting">Đang chờ</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Lọc theo bác sĩ */}
              {/* <div className="w-48">                  
                <Combobox
                  options={doctors.map(doctor => ({
                    value: doctor.id,
                    label: doctor.full_name,
                  }))}
                  placeholder="Chọn bác sĩ..."
                  onChange={setDoctorId}
                  defaultValue={doctorId}
                />
              </div> */}

              {/* Lọc theo bệnh nhân */}
              <div className="w-60">
                <Combobox
                  options={patients.map(patient => ({
                    value: patient.id,
                    label: patient.full_name,
                  }))}
                  placeholder="Chọn bệnh nhân..."
                  onChange={setPatientId}
                  defaultValue={patientId}
                />
              </div>

              {/* Lọc theo trạng thái */}
              <div className="w-60">
                <MultiSelect
                  options={statusOptions}
                  selected={selectedStatuses}
                  onChange={setSelectedStatuses}
                  placeholder="Chọn trạng thái"
                />
              </div>

              {/* Lọc theo ngày hẹn*/}
              <div className="w-60">
                <DatePicker
                  id="dob"
                  defaultDate={appointmentDate}
                  onChange={(dates, currentDateString) => setAppointmentDate(currentDateString ? new Date(currentDateString) : undefined)}
                  placeholder="Chọn ngày hẹn"
                />
                
              </div>

              {/* Nút reset bộ lọc */}
              <Button
                variant='destructiveOutline'
                onClick={() => {
                  // setDoctorId(undefined);
                  setPatientId(undefined);
                  setSelectedStatuses([]);
                  setAppointmentDate(undefined);
                }}
              >
                <FunnelX className="w-4 h-4"/>
              </Button>
            </div>
            {["ADMIN", "STAFF"].includes(user?.role ?? "") && (
              <Button onClick={openAddModal}>+ Thêm lịch hẹn</Button>
            )}
          </div>
        </TabsContent>
        <TabsContent value="upcoming" />
        <TabsContent value="today" />
        <TabsContent value="waiting" />
      </Tabs>

      <AppointmentTable
        appointments={appointments}
        onEdit={handleEdit}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
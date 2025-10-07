'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentFormModal from '@/components/appointments/AppointmentFormModal';
// import { getAppointments, createAppointment, updateAppointment } from '@/services/appointments';
// import { Appointment, AppointmentResponse } from '@/types/appointment';
import appointmentApiRequest from '@/apiRequests/appointment';
import { AppointmentDataType } from '@/schemaValidations/appointment.schema';
import { useAuth } from "@/context/AuthContext";

export default function AppointmentListPage() {
    const { user } = useAuth();
    
  const [appointments, setAppointments] = useState<AppointmentDataType[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentDataType | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { payload } = await appointmentApiRequest.getList();
      const appointmentList = payload.data
      console.log(appointmentList);
      setAppointments(appointmentList);
    } catch (error) {
      console.error('Lỗi lấy danh sách Appointments:', error);
    }
  };

  const handleEdit = (appointment: AppointmentDataType) => {
    setEditingAppointment(appointment);
    setModalType('edit');
  };

//   const handleDelete = async (id: string) => {
//     if (confirm('Bạn có chắc chắn xoá Appointment này?')) {
//       try {
//         await deleteAppointment(id);
//         fetchAppointments();
//       } catch (error) {
//         console.error('Lỗi xóa Appointment: ', error);
//       }
//     }
//   };

  // const handleModalSubmit = async (formData: AppointmentFormData) => {
  //   try {
  //     if (modalType === 'add') {
  //       const newAppointment = await createAppointment({
  //         patient_id: formData.patient_id,
  //         doctor_id: formData.doctor_id,
  //         created_by: user!.id,
  //         appointment_date: formData.appointment_date!,
  //         time_slot: formData.time_slot,
  //         status: formData.status || 'SCHEDULED',
  //       });
  //       console.log("Created new appointment: ", newAppointment);
  //       setAppointments([...appointments, newAppointment]);
  //     } else if (modalType === 'edit' && editingAppointment) {
  //       const updatedAppointment = await updateAppointment(editingAppointment.id, {
  //       //   patient_id: formData.patient_id,
  //         doctor_id: formData.doctor_id,
  //         appointment_date: formData.appointment_date!,
  //         time_slot: formData.time_slot,
  //         status: formData.status,
  //       });
  //       console.log("Updated appointment: ", updatedAppointment);
  //       fetchAppointments(); // Refresh the list
  //     }
  //     closeModal();
  //   } catch (error) {
  //     console.error('Error submitting appointment:', error);
  //     throw error; // Re-throw to let modal handle the error state
  //   }
  // };

  const handleFormSubmit = async () => {
    // Form đã submit thành công
    // toast.success(editingUser ? 'Cập nhật user thành công' : 'Thêm user thành công');
    
    // Đóng modal và refresh
    closeModal();
    await fetchAppointments(); // Refresh the list
  };

  const openAddModal = () => {
    setEditingAppointment(null);
    setModalType('add');
  };

  const closeModal = () => {
    setEditingAppointment(null);
    setModalType(null);
  };

  return (
    <div>
      <AppointmentFormModal
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={handleFormSubmit}
        editingAppointment={editingAppointment}
        modalType={modalType}
      />
      
      <PageBreadcrumb pageTitle="Danh sách Lịch hẹn" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Lịch hẹn">
          <Button onClick={openAddModal}>+ Thêm lịch hẹn</Button>
          <AppointmentTable 
            appointments={appointments} 
            onEdit={handleEdit} 
            // onDelete={handleDelete} 
          />
        </ComponentCard>
      </div>
    </div>
  );
}
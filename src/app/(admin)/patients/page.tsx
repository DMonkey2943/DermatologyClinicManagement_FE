'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import PatientTable from '@/components/patients/PatientTable';
import PatientFormModal from '@/components/patients/PatientFormModal';
import patientApiRequest from '@/apiRequests/patient';
import { PatientDataType } from '@/schemaValidations/patient.schema';
import { toast } from "sonner";

export default function PatientListPage() {
  const [patients, setPatients] = useState<PatientDataType[]>([]);
  const [editingPatient, setEditingPatient] = useState<PatientDataType | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const {payload} = await patientApiRequest.getList();
      const patientList = payload.data;
      console.log(patientList);
      setPatients(patientList);
    } catch (error) {
      console.error('Lỗi lấy danh sách Patients:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (patient_id: string) => {
    const { payload } = await patientApiRequest.getDetail(patient_id);
    const patient = payload.data;
    setEditingPatient(patient);
    setModalType('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn xoá bệnh nhân này?')) {
      try {
        await patientApiRequest.delete(id);        
        toast.success("Xóa bệnh nhân thành công");
        fetchPatients();
      } catch (error) {
        console.error('Lỗi xóa Patient: ', error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  const handleFormSubmit = async () => {
    // Form đã submit thành công
    // toast.success(editingUser ? 'Cập nhật user thành công' : 'Thêm user thành công');
    
    // Đóng modal và refresh
    closeModal();
    await fetchPatients(); // Refresh the list
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setModalType('add');
  };

  const closeModal = () => {
    setEditingPatient(null);
    setModalType(null);
  };

  return (
    <div>
      <PatientFormModal
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={handleFormSubmit}
        editingPatient={editingPatient}
        modalType={modalType}
      />
      
      <PageBreadcrumb pageTitle="Danh sách Bệnh nhân" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Bệnh nhân">
          <Button onClick={openAddModal}>+ Thêm bệnh nhân</Button>
          <PatientTable 
            patients={patients} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            isLoading={isLoading}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
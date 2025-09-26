'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import PatientTable from '@/components/patients/PatientTable';
import PatientFormModal, { PatientFormData } from '@/components/patients/PatientFormModal';
import { getPatients, createPatient, updatePatient, deletePatient } from '@/services/patients';
import { Patient, PatientResponse } from '@/types/patient';

export default function PatientListPage() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      console.log(res);
      setPatients(res);
    } catch (error) {
      console.error('Lỗi lấy danh sách Patients:', error);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setModalType('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn xoá Patient này?')) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error('Lỗi xóa Patient: ', error);
      }
    }
  };

  const handleModalSubmit = async (formData: PatientFormData) => {
    try {
      if (modalType === 'add') {
        const newPatient = await createPatient({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          dob: formData.dob,
          gender: formData.gender,
          email: formData.email,
          address: formData.address,
        });
        console.log("Created new patient: ", newPatient);
        setPatients([...patients, newPatient]);
      } else if (modalType === 'edit' && editingPatient) {
        const updatedPatient = await updatePatient(editingPatient.id, {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          dob: formData.dob,
          gender: formData.gender,
          email: formData.email,
          address: formData.address,
        });
        console.log("Updated patient: ", updatedPatient);
        fetchPatients(); // Refresh the list
      }
      closeModal();
    } catch (error) {
      console.error('Error submitting patient:', error);
      throw error; // Re-throw to let modal handle the error state
    }
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
        onSubmit={handleModalSubmit}
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
          />
        </ComponentCard>
      </div>
    </div>
  );
}
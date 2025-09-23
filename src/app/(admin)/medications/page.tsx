'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
// import UserTable from '@/components/users/UserTable';
import MedicationTable from '@/components/medications/MedicationTable';
// import UserFormModal, { UserFormData } from '@/components/users/UserFormModal';
import MedicationFormModal, { MedicationFormData } from '@/components/medications/MedicationFormModal';
// import { getUsers, createUser, updateUser, deleteUser } from '@/services/users';
import { getMedications, createMedication, updateMedication, deleteMedication } from '@/services/medications';
// import { User, UserResponse } from '@/types/user';
import { Medication, MedicationResponse } from '@/types/medication';

export default function MedicationListPage() {
  const [medications, setMedications] = useState<MedicationResponse[]>([]);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const res = await getMedications();
      console.log(res);
      setMedications(res);
    } catch (error) {
      console.error('Lỗi lấy danh sách Medications:', error);
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setModalType('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn xoá Medication này?')) {
      try {
        await deleteMedication(id);
        fetchMedications();
      } catch (error) {
        console.error('Lỗi xóa Medication: ', error);
      }
    }
  };

  const handleModalSubmit = async (formData: MedicationFormData) => {
    try {
      if (modalType === 'add') {
        const newMedication = await createMedication({
          name: formData.name,
          dosage_form: formData.dosage_form,
          price: formData.price,
          stock_quantity: formData.stock_quantity,
          description: formData.description
        });
        console.log("Created new medication: ", newMedication);
        setMedications([...medications, newMedication]);
      } else if (modalType === 'edit' && editingMedication) {
        const updatedMedication = await updateMedication(editingMedication.id, {
          name: formData.name,
          dosage_form: formData.dosage_form,
          price: formData.price,
          description: formData.description
        });
        console.log("Updated medication: ", updatedMedication);
        fetchMedications(); // Refresh the list
      }
      closeModal();
    } catch (error) {
      console.error('Error submitting medication:', error);
      throw error; // Re-throw to let modal handle the error state
    }
  };

  const openAddModal = () => {
    setEditingMedication(null);
    setModalType('add');
  };

  const closeModal = () => {
    setEditingMedication(null);
    setModalType(null);
  };

  return (
    <div>
      <MedicationFormModal
        isOpen={!!modalType}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        editingMedication={editingMedication}
        modalType={modalType}
      />
      
      <PageBreadcrumb pageTitle="Danh sách Thuốc" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Thuốc">
          <Button onClick={openAddModal}>+ Thêm thuốc</Button>
          <MedicationTable 
            medications={medications} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </ComponentCard>
      </div>
    </div>
  );
}
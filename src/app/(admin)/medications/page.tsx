'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import MedicationTable from '@/components/medications/MedicationTable';
import MedicationFormModal from '@/components/medications/MedicationFormModal';
import medicationApiRequest from '@/apiRequests/medication';
import { MedicationDataType } from '@/schemaValidations/medication.schema';

export default function MedicationListPage() {
  const [medications, setMedications] = useState<MedicationDataType[]>([]);
  const [editingMedication, setEditingMedication] = useState<MedicationDataType | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const { payload } = await medicationApiRequest.getList();
      const medicationList = payload.data
      console.log(medicationList);
      setMedications(medicationList);
    } catch (error) {
      console.error('Lỗi lấy danh sách Medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (medication: MedicationDataType) => {
    setEditingMedication(medication);
    setModalType('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn xoá Medication này?')) {
      setIsLoading(true);
      try {
        await medicationApiRequest.delete(id);
        fetchMedications();
      } catch (error) {
        console.error('Lỗi xóa Medication: ', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const handleModalSubmit = async (formData: MedicationFormData) => {
  //   try {
  //     if (modalType === 'add') {
  //       const newMedication = await createMedication({
  //         name: formData.name,
  //         dosage_form: formData.dosage_form,
  //         price: formData.price,
  //         stock_quantity: formData.stock_quantity,
  //         description: formData.description
  //       });
  //       console.log("Created new medication: ", newMedication);
  //       setMedications([...medications, newMedication]);
  //     } else if (modalType === 'edit' && editingMedication) {
  //       const updatedMedication = await updateMedication(editingMedication.id, {
  //         name: formData.name,
  //         dosage_form: formData.dosage_form,
  //         price: formData.price,
  //         stock_quantity: formData.stock_quantity,
  //         description: formData.description
  //       });
  //       console.log("Updated medication: ", updatedMedication);
  //       fetchMedications(); // Refresh the list
  //     }
  //     closeModal();
  //   } catch (error) {
  //     console.error('Error submitting medication:', error);
  //     throw error; // Re-throw to let modal handle the error state
  //   }
  // };

  const handleFormSubmit = async () => {
    // Form đã submit thành công
    // toast.success(editingUser ? 'Cập nhật user thành công' : 'Thêm user thành công');
    
    // Đóng modal và refresh
    closeModal();
    await fetchMedications(); // Refresh the list
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
        onSuccess={handleFormSubmit}
        // onSubmit={handleModalSubmit}
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
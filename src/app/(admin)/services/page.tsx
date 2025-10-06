'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import ServiceTable from '@/components/services/ServiceTable';
import ServiceFormModal from '@/components/services/ServiceFormModal';
import { ServiceDataType } from '@/schemaValidations/service.schema';
import serviceApiRequest from '@/apiRequests/service';

export default function ServiceListPage() {
    const [services, setServices] = useState<ServiceDataType[]>([]);
    const [editingService, setEditingService] = useState<ServiceDataType | null>(null);
    const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const {payload} = await serviceApiRequest.getList();
          const serviceList = payload.data;
            console.log("Fetch services: ", serviceList);
            setServices(serviceList);
        } catch (error) {
            console.error('Lỗi lấy danh sách Services:', error);
        }
    }

    const handleEdit = (service: ServiceDataType) => {
        setEditingService(service);
        setModalType('edit');
    }

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn xoá dịch vụ này?')) {
          try {
            await serviceApiRequest.delete(id);
            fetchServices();
          } catch (error) {
            console.error('Lỗi xóa Service: ', error);
          }
        }
    };

    // const handleModalSubmit = async (formData: ServiceFormData) => {
    //     try {
    //       if (modalType === 'add') {
    //         const newService = await createService({
    //           name: formData.name,
    //           price: formData.price,
    //           description: formData.description
    //         });
    //         console.log("Created new service: ", newService);
    //         setServices([...services, newService]);
    //       } else if (modalType === 'edit' && editingService) {
    //         const updatedService = await updateService(editingService.id, {
    //           name: formData.name,
    //           price: formData.price,
    //           description: formData.description
    //         });
    //         console.log("Updated service: ", updatedService);
    //         fetchServices(); // Refresh the list
    //       }
    //       closeModal();
    //     } catch (error) {
    //       console.error('Error submitting service:', error);
    //       throw error; // Re-throw to let modal handle the error state
    //     }
  // };
  
    const handleFormSubmit = async () => {
      // Form đã submit thành công
      // toast.success(editingUser ? 'Cập nhật user thành công' : 'Thêm user thành công');
      
      // Đóng modal và refresh
      closeModal();
      await fetchServices(); // Refresh the list
    };

    const openAddModal = () => {
        setEditingService(null);
        setModalType('add');
    };

    const closeModal = () => {
        setEditingService(null);
        setModalType(null);
    };
    
    return (
        <div>
            <ServiceFormModal
                isOpen={!!modalType}
                onClose={closeModal}
                onSuccess={handleFormSubmit}
                editingService={editingService}
                modalType={modalType}
            />

            <PageBreadcrumb pageTitle="Danh sách Dịch vụ y tế" />

            <div className='space-y-6'>
                <ComponentCard title='Danh sách Dịch vụ y tế'>
                    <Button onClick={openAddModal}>+ Thêm dịch vụ</Button>
                    <ServiceTable
                        services={services}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </ComponentCard>
            </div>
        </div>
    )
}
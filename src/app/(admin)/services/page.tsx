'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import ServiceTable from '@/components/services/ServiceTable';
import ServiceFormModal from '@/components/services/ServiceFormModal';
import { ServiceDataType } from '@/schemaValidations/service.schema';
import serviceApiRequest from '@/apiRequests/service';
import { toast } from "sonner";

export default function ServiceListPage() {
    const [services, setServices] = useState<ServiceDataType[]>([]);
    const [editingService, setEditingService] = useState<ServiceDataType | null>(null);
    const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const {payload} = await serviceApiRequest.getList();
          const serviceList = payload.data;
            console.log("Fetch services: ", serviceList);
            setServices(serviceList);
        } catch (error) {
            console.error('Lỗi lấy danh sách Services:', error);
        }
        finally {
            setIsLoading(false);
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
            toast.success("Xóa dịch vụ thành công");
            fetchServices();
          } catch (error) {
            console.error('Lỗi xóa Service: ', error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
          }
        }
    };
  
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
                        isLoading={isLoading}
                    />
                </ComponentCard>
            </div>
        </div>
    )
}
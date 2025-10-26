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
    
    // Thêm state phân trang
    const [page, setPage] = useState<number>(0); // zero-based
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        fetchServices();
    }, [page, pageSize]);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const {payload} = await serviceApiRequest.getList({ skip: page * pageSize, limit: pageSize });
            const serviceList = payload.data;
            console.log("Fetch services: ", serviceList);
            setServices(serviceList);

            const totalFromPayload = payload.meta?.total;
            setTotal(Number(totalFromPayload) || serviceList.length);

            // Nếu trang hiện tại vượt quá tổng trang sau khi cập nhật total => đưa về trang cuối cùng hợp lệ
            const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || serviceList.length) / pageSize));
            if (page > totalPages - 1) {
                setPage(totalPages - 1);
            }
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
        // Khi tạo mới, thường muốn về trang đầu để thấy item mới (tuỳ yêu cầu)
        setPage(0);
    };

    const closeModal = () => {
        setEditingService(null);
        setModalType(null);
    };

    // Handlers phân trang được truyền xuống UserTable
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(0); // quay về trang đầu khi thay đổi pageSize
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
                        // Truyền props phân trang vào UserTable
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </ComponentCard>
            </div>
        </div>
    )
}
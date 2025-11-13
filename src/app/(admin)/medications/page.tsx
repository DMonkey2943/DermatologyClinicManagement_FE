'use client';

import React, { useEffect, useState, useRef } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import MedicationTable from '@/components/medications/MedicationTable';
import MedicationFormModal from '@/components/medications/MedicationFormModal';
import medicationApiRequest from '@/apiRequests/medication';
import { MedicationDataType } from '@/schemaValidations/medication.schema';
import { toast } from "sonner";
import SearchInput from '@/components/ui/searchInput/SearchInput';

export default function MedicationListPage() {
  const [medications, setMedications] = useState<MedicationDataType[]>([]);
  const [editingMedication, setEditingMedication] = useState<MedicationDataType | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Thêm state phân trang
  const [page, setPage] = useState<number>(0); // zero-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  
  // NEW: search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchMedications();
  }, [page, pageSize, debouncedQuery]);
  
  // Debounce searchQuery -> debouncedQuery
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const { payload } = await medicationApiRequest.getList({ skip: page * pageSize, limit: pageSize, q: debouncedQuery });
      const medicationList = payload.data ?? [];
      console.log(medicationList);
      setMedications(medicationList);

      // Cố gắng lấy tổng số bản ghi từ response (hỗ trợ các key phổ biến)
      const totalFromPayload = payload.meta?.total;
      setTotal(Number(totalFromPayload) || medicationList.length);

      // Nếu trang hiện tại vượt quá tổng trang sau khi cập nhật total => đưa về trang cuối cùng hợp lệ
      const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || medicationList.length) / pageSize));
      if (page > totalPages - 1) {
        setPage(totalPages - 1);
      }
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
    // if (confirm('Bạn có chắc chắn xoá Medication này?')) {
      setIsLoading(true);
      try {
        await medicationApiRequest.delete(id);
        toast.success("Xóa thuốc thành công");
        fetchMedications();
      } catch (error) {
        console.error('Lỗi xóa Medication: ', error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    // }
  };

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
    // Khi tạo mới, thường muốn về trang đầu để thấy item mới (tuỳ yêu cầu)
    setPage(0);
  };

  const closeModal = () => {
    setEditingMedication(null);
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

  // Clear search handler used by the inline "X" button
  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(0);
    if (searchRef.current) searchRef.current.focus();
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button onClick={openAddModal}>+ Thêm thuốc</Button>
            </div>

            {/* Search placed to the right */}
            <div className="flex items-center justify-end w-full md:w-auto">
              <SearchInput
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                onClear={clearSearch}
                placeholder="Tìm kiếm thuốc..."
                className="pl-9 pr-8"
                ariaLabel="Search medications"
              />
            </div>
          </div>
          <MedicationTable 
            medications={medications} 
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
  );
}
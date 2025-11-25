'use client';

import React, { useEffect, useState, useRef } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import PatientTable from '@/components/patients/PatientTable';
import PatientFormModal from '@/components/patients/PatientFormModal';
import patientApiRequest from '@/apiRequests/patient';
import { PatientDataType } from '@/schemaValidations/patient.schema';
import { toast } from "sonner";
import SearchInput from '@/components/ui/searchInput/SearchInput';

export default function PatientListPage() {
  const [patients, setPatients] = useState<PatientDataType[]>([]);
  const [editingPatient, setEditingPatient] = useState<PatientDataType | null>(null);
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
    fetchPatients();
  }, [page, pageSize, debouncedQuery]);
  
  // Debounce searchQuery -> debouncedQuery
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const {payload} = await patientApiRequest.getList({ skip: page * pageSize, limit: pageSize, q: debouncedQuery });
      const patientList = payload.data ?? [];
      console.log(patientList);
      setPatients(patientList);

      const totalFromPayload = payload.meta?.total
      setTotal(Number(totalFromPayload) || patientList.length);
      
      // Nếu trang hiện tại vượt quá tổng trang sau khi cập nhật total => đưa về trang cuối cùng hợp lệ
      const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || patientList.length) / pageSize));
      if (page > totalPages - 1) {
        setPage(totalPages - 1);
      }

    } catch (error) {
      console.error('Lỗi lấy danh sách Patients:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  // const handleEdit = async (patient_id: string) => {
  //   const { payload } = await patientApiRequest.getDetail(patient_id);
  //   const patient = payload.data;
  //   setEditingPatient(patient);
  //   setModalType('edit');
  // };

  const handleDelete = async (id: string) => {
    // if (confirm('Bạn có chắc chắn xoá bệnh nhân này?')) {
      try {
        await patientApiRequest.delete(id);        
        toast.success("Xóa bệnh nhân thành công");
        fetchPatients();
      } catch (error) {
        console.error('Lỗi xóa Patient: ', error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    // }
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
    // Khi tạo mới, thường muốn về trang đầu để thấy item mới (tuỳ yêu cầu)
    setPage(0);
  };

  const closeModal = () => {
    setEditingPatient(null);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button onClick={openAddModal}>+ Thêm bệnh nhân</Button>
            </div>
            <div className="flex items-center justify-end w-full md:w-auto">
              <SearchInput
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                onClear={clearSearch}
                placeholder="Tìm kiếm tên, SĐT..."
                className="pl-9 pr-8"
                ariaLabel="Search patients"
              />
            </div>
          </div>
          <PatientTable 
            patients={patients} 
            // onEdit={handleEdit} 
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
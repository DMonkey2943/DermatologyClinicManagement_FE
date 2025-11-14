'use client';

import React, { useEffect, useState } from 'react';
// import Button from '@/components/ui/button/Button';
import MedicalRecordTable from '@/components/medical-records/MedicalRecordTable';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';

export default function ClientMedicalRecordListPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
    
  // Thêm state phân trang
  const [page, setPage] = useState<number>(0); // zero-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchMedicalRecords();
  }, [page, pageSize]);

  const fetchMedicalRecords = async () => {
    setIsLoading(true);
    try {
      const {payload} = await medicalRecordApiRequest.getList({ skip: page * pageSize, limit: pageSize });
      const medicalRecordList = payload.data;
      console.log(medicalRecordList);
      setMedicalRecords(medicalRecordList);
      const totalFromPayload =  payload.meta?.total;
      setTotal(Number(totalFromPayload) || medicalRecordList.length);

      // Nếu trang hiện tại vượt quá tổng trang sau khi cập nhật total => đưa về trang cuối cùng hợp lệ
      const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || medicalRecordList.length) / pageSize));
      if (page > totalPages - 1) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách phiên khám:', error);
    }
    finally {
      setIsLoading(false);
    }
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
    <>
      <MedicalRecordTable 
        medical_records={medicalRecords} 
        isLoading={isLoading}
        // Truyền props phân trang vào UserTable
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
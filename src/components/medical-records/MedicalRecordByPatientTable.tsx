'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { formatDateTime } from '@/lib/utils';
import PaginationControls from '../ui/pagination/PaginationControls';

interface MedicalRecordByPatientProps {
  patient_id_props: string;
}

export default function MedicalRecordByPatientTable({ patient_id_props }: MedicalRecordByPatientProps) {
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>();
    
    // Thêm state phân trang
    const [page, setPage] = useState<number>(0); // zero-based
    const [pageSize, ] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        fetchMedicalRecordsByPatient();
    }, [page, pageSize]);
    
    const fetchMedicalRecordsByPatient = async () => {
        try {
            const {payload} = await medicalRecordApiRequest.getListByPatient(patient_id_props, {skip: page * pageSize, limit: pageSize});
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
            console.error('Lỗi lấy thông tin medicalRecords:', error);
        }
    };

    // Handlers phân trang được truyền xuống UserTable
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // const handlePageSizeChange = (newSize: number) => {
    //     setPageSize(newSize);
    //     setPage(0); // quay về trang đầu khi thay đổi pageSize
    // };


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                //   isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lịch sử khám bệnh
                </TableCell>
                <TableCell
                //   isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tùy chọn
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {medicalRecords?.map((medical_record) => (
                <TableRow key={medical_record.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {formatDateTime(medical_record.created_at)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link href={`/medical-records/${medical_record.id}`}>
                        <Button size="sm">Xem</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        //   onPageSizeChange={handlePageSizeChange}
        />
    </div>
  );
}

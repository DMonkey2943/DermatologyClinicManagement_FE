'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Link from 'next/link'
import { PatientDataType } from '@/schemaValidations/patient.schema';
import CenteredSpinner from '../ui/spinner/CenteredSpinner';
import PaginationControls from '../ui/pagination/PaginationControls';

interface PatientTableProps {
  patients: PatientDataType[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;

  // Props phân trang mới
  page?: number; // zero-based
  pageSize?: number;
  total?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export default function PatientTable({
  patients,
  onEdit,
  onDelete,
  isLoading,
  page = 0,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
}: PatientTableProps) {
  return (
    isLoading
    ?
      <CenteredSpinner/>
    :
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tên
                </TableCell>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  SĐT
                </TableCell>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tùy chọn
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {patient.full_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {patient.phone_number}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      {/* <Button size="sm" onClick={() =>alert('Chuyển trang chi tiết thông tin bệnh nhân')}>Xem</Button> */}
                      <Link href={`/patients/${patient.id}`}>
                        <Button size="sm">Xem</Button>
                      </Link>
                      <Button size="sm" onClick={() => onEdit(patient.id)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(patient.id)}>Xóa</Button>
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
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
    </div>
  );
}

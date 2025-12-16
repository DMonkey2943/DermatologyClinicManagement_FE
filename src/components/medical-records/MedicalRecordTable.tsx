'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import { formatDateTime, getPrefixedPath, MR_STATUS_LABEL_MAP } from '@/lib/utils';
import CenteredSpinner from '../ui/spinner/CenteredSpinner';
import PaginationControls from '../ui/pagination/PaginationControls';
import { MoreHorizontal, Eye } from "lucide-react";
import { Button as ButtonUI } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface MedicalRecordTableProps {
  medical_records: MedicalRecordDataType[];
  isLoading: boolean;

  // Props phân trang mới
  page?: number; // zero-based
  pageSize?: number;
  total?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export default function MedicalRecordTable({ medical_records, isLoading, page=0, pageSize=10, total=0, onPageChange, onPageSizeChange }: MedicalRecordTableProps) {
  const { user } = useAuth();
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'PAID':
        return 'primary';
    }
  };  
  
  const getStatusLabel = (status: MedicalRecordDataType['status'] | null | undefined): string => {
    if (!status) return 'Không xác định';
    return MR_STATUS_LABEL_MAP[status] || status;
  };

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
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày giờ khám
                </TableCell>
                <TableCell
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bệnh nhân
                </TableCell>
                {/* <TableCell
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bác sĩ
                </TableCell> */}
                <TableCell
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Chẩn đoán
                </TableCell>
                <TableCell
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {/* Tùy chọn */}
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {medical_records.map((medical_record) => (
                <TableRow key={medical_record.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {formatDateTime(medical_record.created_at)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {medical_record.patient.full_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {medical_record.patient.phone_number}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {medical_record.doctor.full_name}
                  </TableCell> */}
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {medical_record.diagnosis || 'Chưa có chẩn đoán'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    <Badge size="sm" color={getStatusColor(medical_record.status)}>{getStatusLabel(medical_record.status)}</Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <ButtonUI variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </ButtonUI>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={getPrefixedPath(`/medical-records/${medical_record.id}`, user?.role)}>
                                <Eye className="h-4 w-4" />
                                <span>Xem chi tiết</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {["ADMIN", "STAFF"].includes(user?.role ?? "") && medical_record.status === 'COMPLETED' && 
                        <Link href={getPrefixedPath(`/invoices/preview/${medical_record.id}`, user?.role)}>
                          <Button size="sm">Tạo hóa đơn</Button>
                        </Link>
                      }
                      
                      {/* 
                      <Button size="sm" onClick={() => onEdit(medical_record.id)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(medical_record.id)}>Xóa</Button> */}
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

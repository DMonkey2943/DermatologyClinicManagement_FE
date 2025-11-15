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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button as ButtonUI } from "@/components/ui/button";
// import Button from '@/components/ui/button/Button';
import Link from 'next/link'
import { PatientDataType } from '@/schemaValidations/patient.schema';
import CenteredSpinner from '../ui/spinner/CenteredSpinner';
import PaginationControls from '../ui/pagination/PaginationControls';
import { formatDate, getPrefixedPath } from '@/lib/utils';
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
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
                  Tên, Email
                </TableCell>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày sinh
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
                  Địa chỉ
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
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {patient.full_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {patient.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {patient.dob && formatDate(patient.dob)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {patient.phone_number}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {patient.address}
                  </TableCell>
                  {/* <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link href={`/patients/${patient.id}`}>
                        <Button size="sm">Xem</Button>
                      </Link>
                      <Button size="sm" onClick={() => onEdit(patient.id)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(patient.id)}>Xóa</Button>
                    </div>
                  </TableCell> */}
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ButtonUI variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </ButtonUI>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        {/* <DropdownMenuLabel>Hành động</DropdownMenuLabel> */}

                        <DropdownMenuItem asChild>
                          <Link
                            href={getPrefixedPath(`/patients/${patient.id}`, user?.role)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Xem chi tiết</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onEdit(patient.id)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Sửa</span>
                        </DropdownMenuItem>

                        {/* Chỉ hiển thị mục Xóa nếu là ADMIN */}
                        {user?.role === "ADMIN" && (
                          <DropdownMenuItem asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="flex items-center gap-2 text-red-600 focus:text-red-700 w-full">
                                  <Trash2 className="h-4 w-4" />
                                  <span>Xóa</span>
                                </button>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận xoá tài khoản
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xoá tài khoản{" "}
                                    <strong>{patient.full_name}</strong>?  
                                    Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => onDelete(patient.id)}
                                  >
                                    Xoá
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

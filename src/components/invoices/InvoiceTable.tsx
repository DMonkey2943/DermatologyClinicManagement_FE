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
// import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import { formatCurrency, formatDateTime, getPrefixedPath } from '@/lib/utils';
import { InvoiceDataType } from '@/schemaValidations/invoice.schema';
import CenteredSpinner from '../ui/spinner/CenteredSpinner';
import PaginationControls from '../ui/pagination/PaginationControls';
import { useAuth } from "@/context/AuthContext";
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

interface InvoiceTableProps {
  invoices: InvoiceDataType[];
  isLoading: boolean;

  // Props phân trang mới
  page?: number; // zero-based
  pageSize?: number;
  total?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export default function InvoiceTable({ invoices, isLoading, page=0, pageSize=10, total=0, onPageChange, onPageSizeChange }: InvoiceTableProps) {
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
                  //isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Thời gian tạo
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
                  Thành tiền
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {formatDateTime(invoice.created_at)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {invoice.patient.full_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {invoice.patient.phone_number}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {invoice.doctor.full_name}
                  </TableCell> */}
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {formatCurrency(invoice.final_amount!)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    {/* <div className="flex gap-2"> */}
                      {/* <Link href={`/invoices/${invoice.id}`}>
                        <Button size="sm">Xem</Button>
                    </Link> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ButtonUI variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </ButtonUI>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={getPrefixedPath(`/invoices/${invoice.id}`, user?.role)}>
                              <Eye className="h-4 w-4" />
                              <span>Xem chi tiết</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* </div> */}
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

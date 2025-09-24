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
import { Service, ServiceResponse } from '@/types/service';

interface ServiceTableProps {
  services: ServiceResponse[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export default function ServiceTable({ services, onEdit, onDelete }: ServiceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Giá
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tùy chọn
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {service.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {service.price}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => onEdit(service)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(service.id)}>Xóa</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

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
import { AppointmentDataType } from '@/schemaValidations/appointment.schema';
import CenteredSpinner from '../ui/spinner/CenteredSpinner';
import PaginationControls from '../ui/pagination/PaginationControls';
import appointmentApiRequest from '@/apiRequests/appointment';
import { toast } from 'sonner';
// NEW: import Select primitives
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

interface AppointmentTableProps {
  appointments: AppointmentDataType[];
  onEdit: (appointment: AppointmentDataType) => void;
  // onDelete: (id: string) => void;
  isLoading: boolean;

  // Props phân trang mới
  page?: number; // zero-based
  pageSize?: number;
  total?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;

  // NEW: notify parent when status updated successfully
  onStatusChange?: (id: string, newStatus: string) => void;
}

export default function AppointmentTable({ appointments, onEdit, isLoading, page=0, pageSize=10, total=0, onPageChange, onPageSizeChange, onStatusChange }: AppointmentTableProps) {
  // Define badge color mapping based on status
  const getStatusColor = (status: string|null) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'WAITING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'info';
    }
  };

  // NEW: map status -> tailwind text color classes for inline text
  const getStatusTextClass = (status: string|null) => {
    switch (status) {
      case 'SCHEDULED':
        return 'text-blue-600';
      case 'WAITING':
        return 'text-yellow-600';
      case 'COMPLETED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      const { payload } = await appointmentApiRequest.update(id, { status: newStatus });
      toast.success('Cập nhật trạng thái lịch hẹn thành công');

      // NEW: inform parent so it can update local state / re-render
      if (onStatusChange) {
        onStatusChange(id, newStatus);
      }

      return true;
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái Appointment:', error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      return false;
    }

  }

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
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bệnh nhân
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bác sĩ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày hẹn
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Giờ hẹn
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
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
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {appointment.patient.full_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {appointment.doctor.full_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {formatDate(appointment.appointment_date)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {appointment.appointment_time}
                  </TableCell>

                  {/* UPDATED: Status column -> show Badge when COMPLETED; otherwise a Select without COMPLETED option */}
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {appointment.status === 'COMPLETED' ? (
                      <Badge size="sm" color={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    ) : (
                      <div className="max-w-xs">
                        <Select
                          value={appointment.status ?? ''}
                          onValueChange={(val) => {
                            // guard redundant but keep: appointment with COMPLETED will not reach here
                            if (appointment.status === 'COMPLETED') return;
                            void changeStatus(appointment.id, val);
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue>
                              <span className={getStatusTextClass(appointment.status)}>
                                {appointment.status ?? 'UNKNOWN'}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                            <SelectItem value="WAITING">WAITING</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      {appointment.status === 'WAITING' && 
                        <Link href={`/medical-records/add/${appointment.id}`}>
                          <Button size="sm">Tạo phiên khám</Button>
                        </Link>
                      }                      
                      <Button size="sm" onClick={() => onEdit(appointment)}>Sửa</Button>
                      {/* <Button size="sm" variant="destructive" onClick={() => onDelete(appointment.id)}>Xóa</Button> */}
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

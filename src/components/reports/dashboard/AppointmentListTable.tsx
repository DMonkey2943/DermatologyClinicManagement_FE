'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Appointment {
  id: string | number
  patient: {
    full_name: string
  }
  appointment_time: string
  status: string
}

interface AppointmentListTableProps {
  appointments: Appointment[]
  isLoading?: boolean
}

export function AppointmentListTable({ appointments, isLoading }: AppointmentListTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
      case 'WAITING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  const today = () => {
    const today = new Date();
    return `${today.toLocaleDateString('vi-VN')}`;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Danh sách lịch hẹn hôm nay ({today()})</CardTitle>
          <CardDescription>Hiển thị tối đa 5 lịch hẹn gần nhất</CardDescription>
        </div>
        <Link href="/appointments">
          <Button variant="outline" size="sm" className="text-sm">
            Xem tất cả
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px]">Bệnh nhân</TableHead>
              <TableHead className="min-w-[100px]">Giờ hẹn</TableHead>
              <TableHead className="min-w-[100px] text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-4">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-4">
                  Không có lịch hẹn nào hôm nay
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.patient.full_name}</TableCell>
                  <TableCell>
                    {item.appointment_time}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(getStatusColor(item.status))}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

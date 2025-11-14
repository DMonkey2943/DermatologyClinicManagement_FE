import React, { useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  PrescriptionFullDataType } from '@/schemaValidations/prescription.schema';
import { ServiceIndicationFullDataType } from '@/schemaValidations/serviceIndication.schema';

interface InvoiceDetailTableProps {
    serviceIndication: ServiceIndicationFullDataType | null | undefined;
    prescription: PrescriptionFullDataType | null | undefined;
    onSendData: (data: {
      serviceSubtotal: number;
      medicationSubtotal: number;
      grandTotal: number;
    }) => void;
}

export default function InvoiceDetailTable({ serviceIndication, prescription, onSendData }: InvoiceDetailTableProps) {
  const calculateTotal = (items: any) => {
    return items.reduce((sum: number, item: any) => sum + (item.total_price), 0);
  };

  // Tính tổng và memoize
  const { serviceSubtotal, medicationSubtotal, grandTotal } = useMemo(() => {
    const serviceSubtotal = serviceIndication?.services ? calculateTotal(serviceIndication.services) : 0;
    const medicationSubtotal = prescription?.medications ? calculateTotal(prescription.medications) : 0;
    const grandTotal = serviceSubtotal + medicationSubtotal;
    return { serviceSubtotal, medicationSubtotal, grandTotal };
  }, [serviceIndication?.services, prescription?.medications]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  useEffect(() => {
    onSendData({ serviceSubtotal, medicationSubtotal, grandTotal });
  }, [serviceIndication, prescription, onSendData]);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">Chi Tiết Hóa Đơn</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 md:w-16">STT</TableHead>
              <TableHead className="min-w-[150px]">Tên hàng</TableHead>
              <TableHead className="w-16 md:w-24 text-center">SL</TableHead>
              <TableHead className="w-16 md:w-20">ĐVT</TableHead>
              <TableHead className="w-24 md:w-32 text-right">Đơn giá</TableHead>
              <TableHead className="w-28 md:w-36 text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Dịch vụ */}
            <TableRow className="bg-blue-50">
              <TableCell colSpan={6} className="font-semibold text-blue-900">
                Dịch vụ chẩn đoán - điều trị
              </TableCell>
            </TableRow>
            {!serviceIndication || !serviceIndication.services || serviceIndication.services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Không có chỉ định dịch vụ
                </TableCell>
              </TableRow>
            ) : (
              serviceIndication.services.map((item, index) => (
                <TableRow key={`service-${item.id}`}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell>{"Gói"}</TableCell>
                  <TableCell className="text-right text-xs md:text-sm">
                    {formatCurrency(item.unit_price)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-xs md:text-sm">
                    {formatCurrency(item.total_price)}
                  </TableCell>
                </TableRow>
              ))
            )}
            
            {/* Thuốc */}
            <TableRow className="bg-green-50">
              <TableCell colSpan={6} className="font-semibold text-green-900">
                Thuốc
              </TableCell>
            </TableRow>
            {!prescription || !prescription.medications || prescription.medications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Không có kê thuốc
                </TableCell>
              </TableRow>
            ) : (
            prescription.medications.map((item, index) => (
              <TableRow key={`medicine-${item.id}`}>
                <TableCell className="text-center">{serviceIndication?.services?.length ? serviceIndication.services.length : 0 + index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell>{item.dosage_form}</TableCell>
                <TableCell className="text-right text-xs md:text-sm">
                  {formatCurrency(item.unit_price)}
                </TableCell>
                <TableCell className="text-right font-medium text-xs md:text-sm">
                  {formatCurrency(item.total_price)}
                </TableCell>
              </TableRow>
            )))}
            
            {/* Tổng cộng */}
            <TableRow className="bg-gray-100 font-bold">
              <TableCell colSpan={5} className="text-right text-base md:text-lg">
                TỔNG CỘNG:
              </TableCell>
              <TableCell className="text-right text-base md:text-lg text-red-600">
                {formatCurrency(grandTotal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
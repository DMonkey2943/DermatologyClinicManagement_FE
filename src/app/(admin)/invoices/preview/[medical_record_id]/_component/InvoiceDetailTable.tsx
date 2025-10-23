import React from 'react';
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
    serviceIndication: ServiceIndicationFullDataType;
    prescription: PrescriptionFullDataType;
}

export default function InvoiceDetailTable({ serviceIndication, prescription }: InvoiceDetailTableProps) {
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.total_price), 0);
  };

  const servicesTotal = calculateTotal(serviceIndication.services);
  const medicationsTotal = calculateTotal(prescription.medications);
  const grandTotal = servicesTotal + medicationsTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

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
            {serviceIndication.services.map((item, index) => (
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
            ))}
            
            {/* Thuốc */}
            <TableRow className="bg-green-50">
              <TableCell colSpan={6} className="font-semibold text-green-900">
                Thuốc
              </TableCell>
            </TableRow>
            {prescription.medications.map((item, index) => (
              <TableRow key={`medicine-${item.id}`}>
                <TableCell className="text-center">{serviceIndication.services.length + index + 1}</TableCell>
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
            ))}
            
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
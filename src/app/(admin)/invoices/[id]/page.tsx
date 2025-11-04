'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import { Card } from '@/components/ui/card';
import invoiceApiRequest from '@/apiRequests/invoice';
import { InvoiceFullDataType } from '@/schemaValidations/invoice.schema';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useReactToPrint } from 'react-to-print';

export default function InvoiceDetailPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<InvoiceFullDataType>();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const { payload } = await invoiceApiRequest.getDetail(id);
      setInvoice(payload.data);
    } catch (error) {
      console.error('Lỗi lấy thông tin Invoice:', error);
    }
  };

  // ✅ Tạo hàm in bằng react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `HoaDon_${invoice?.id}`,
    onAfterPrint: () => console.log('In hóa đơn thành công!'),
  });

  if (!invoice) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Hóa đơn" />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Nội dung hóa đơn cần in */}
          <div ref={printRef} className="print-area">
            {/* <Card className="bg-white shadow-lg"> */}
            <div className="bg-white">
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-800">
                  <div className="text-sm">
                    <p className="font-bold text-base mb-1">PHÒNG KHÁM CHUYÊN KHOA DA LIỄU FORSKIN</p>
                    <p>170 Lê Hồng Nhi, Cái Răng, Cần Thơ</p>
                    <p>1900 2943 - 0856 068 959</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Mã BN: {invoice.patient.id}</p>
                    <p>Mã HĐ: {invoice.id}</p>
                  </div>
                </div>

                {/* Tiêu đề */}
                <h1 className="text-2xl font-bold text-center mb-6">PHIẾU THANH TOÁN</h1>

                {/* Thông tin bệnh nhân */}
                <div className="mb-4 md:mb-6 text-xs md:text-sm">
                  <div className="flex flex-wrap gap-x-20 gap-y-2">
                    <div className="flex gap-2">
                      <span className="font-medium">Họ tên:</span>
                      <span>{invoice.patient.full_name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">Ngày sinh:</span>
                      <span>{invoice.patient.dob && formatDate(invoice.patient.dob)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">Giới tính:</span>
                      <span>{invoice.patient.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">Địa chỉ:</span>
                      <span>{invoice.patient.address || 'Cần Thơ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">SĐT:</span>
                      <span>{invoice.patient.phone_number}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">Email:</span>
                      <span>{invoice.patient.email}</span>
                    </div>
                    <div className="flex gap-2 w-full">
                      <span className="font-medium">Chẩn đoán:</span>
                      <span>{invoice.diagnosis}</span>
                    </div>
                  </div>
                </div>

                {/* Bảng chi tiết */}
                <div className="mb-6">
                  <table className="w-full border-collapse border border-gray-800 text-sm">
                    <thead>
                      <tr className="bg-white">
                        <th className="border border-gray-800 px-2 py-2 font-bold text-center w-12">STT</th>
                        <th className="border border-gray-800 px-2 py-2 font-bold text-center">Tên hàng</th>
                        <th className="border border-gray-800 px-2 py-2 font-bold text-center w-16">SL</th>
                        <th className="border border-gray-800 px-2 py-2 font-bold text-center w-24">Đơn giá</th>
                        <th className="border border-gray-800 px-2 py-2 font-bold text-center w-28">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-100">
                        <td colSpan={5} className="border border-gray-800 px-2 py-1 font-semibold">
                          Dịch vụ chẩn đoán - điều trị
                        </td>
                      </tr>
                      {invoice.services.map((service, index) => (
                        <tr key={`service-${service.id}`}>
                          <td className="border border-gray-800 px-2 py-1 text-center">{index + 1}</td>
                          <td className="border border-gray-800 px-2 py-1">{service.name}</td>
                          <td className="border border-gray-800 px-2 py-1 text-center">{service.quantity}</td>
                          <td className="border border-gray-800 px-2 py-1 text-right">{formatCurrency(service.unit_price)}</td>
                          <td className="border border-gray-800 px-2 py-1 text-right">{formatCurrency(service.total_price)}</td>
                        </tr>
                      ))}

                      <tr className="bg-gray-100">
                        <td colSpan={5} className="border border-gray-800 px-2 py-1 font-semibold">Thuốc</td>
                      </tr>
                      {invoice.medications.map((medication, index) => (
                        <tr key={`medication-${medication.id}`}>
                          <td className="border border-gray-800 px-2 py-1 text-center">
                            {invoice.services.length + index + 1}
                          </td>
                          <td className="border border-gray-800 px-2 py-1">{medication.name}</td>
                          <td className="border border-gray-800 px-2 py-1 text-center">{medication.quantity}</td>
                          <td className="border border-gray-800 px-2 py-1 text-right">{formatCurrency(medication.unit_price)}</td>
                          <td className="border border-gray-800 px-2 py-1 text-right">{formatCurrency(medication.total_price)}</td>
                        </tr>
                      ))}

                      <tr className="font-bold">
                        <td colSpan={4} className="border border-gray-800 px-2 py-2 text-right">Tổng cộng</td>
                        <td className="border border-gray-800 px-2 py-2 text-right">
                          {formatCurrency(invoice.final_amount!)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <p>Bác sĩ điều trị: <span className="font-medium">{invoice.doctor.full_name}</span></p>
                  </div>
                  <div className="text-center">
                    <p className="mb-1">Ngày {formatDate(invoice.created_at)}</p>
                    <p className="mb-20">Người lập</p>
                    <p className="font-medium">{invoice.created_by_user.full_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nút in - ẩn khi in */}
          <div className="mt-4 text-right print:hidden">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              In hóa đơn
            </button>
          </div>
        </div>
          </div>
          
      {/* CSS cho in ấn */}
        <style jsx global>{`
            @media print {
                body {
                    background: white;
                }
                @page {
                    size: A4 portrait; /* Khổ A4, hướng dọc */
                    margin: 20mm;
                }
                .print\\:hidden {
                    display: none !important;
                }
                .print\\:shadow-none {
                    box-shadow: none !important;
                }
                .print\\:p-6 {
                    padding: 1.5rem !important;
                }
            }
        `}</style>
    </div>
  );
}

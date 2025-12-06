'use client'

import React, { useState, useEffect, useRef } from 'react';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { PrescriptionFullDataType } from '@/schemaValidations/prescription.schema';
import { useReactToPrint } from 'react-to-print';
import { formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import { useAuth } from '@/context/AuthContext';
import { Printer } from 'lucide-react';

interface PrescriptionCardProps {
  medicalRecordId: string;
  medicalRecordData?: MedicalRecordDataType;
  patientData?: PatientFullDataType;
}

export default function PrescriptionCard({
  medicalRecordId,
  medicalRecordData,
  patientData
}: PrescriptionCardProps) {
  const { user } = useAuth();
  const [prescription, setPrescription] = useState<PrescriptionFullDataType | null>();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      fetchPrescription(medicalRecordId);
  }, [medicalRecordId]);

  const fetchPrescription = async (medical_record_id: string) => {
    try {
      const {payload} = await medicalRecordApiRequest.getPrescriptionByMRId(medical_record_id);
      const data = payload.data;
      console.log(data);
      setPrescription(data);
    } catch (error) {
      console.error('Lỗi lấy thông tin đơn thuốc:', error);
    }
  };

  // ✅ Tạo hàm in bằng react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `DonThuoc_${prescription?.id}`,
    onAfterPrint: () => console.log('In đơn thuốc thành công!'),
  });



  return (
    <div className="max-w-6xl mx-auto rounded-lg">
      {/* Hiển thị trên web - chỉ có bảng */}
      {(!prescription || !prescription.medications?.length) ? (
        <div className="text-center py-2 text-muted-foreground">
          Không có đơn thuốc
        </div>
      ) : (
        <>
          {/* Phần hiển thị trên web */}
          <div className="print:hidden">
              <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="w-12">STT</TableHead>
                    <TableHead>Tên thuốc</TableHead>
                    <TableHead className="w-24 text-center">Số lượng</TableHead>
                    <TableHead className="w-24 text-center">Đơn vị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescription.medications.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.dosage}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-center">{item.dosage_form}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Nút in - chỉ hiển thị trên web */}
            {["ADMIN", "DOCTOR"].includes(user?.role ?? "") && medicalRecordData?.status === 'COMPLETED' &&
              <div className="mt-4 text-right">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  In đơn thuốc
                </button>
              </div>
            }
          </div>

          {/* Phần dành cho in - ẩn trên web, hiển thị khi in */}
          <div ref={printRef} className="hidden print:block">
            <div className="bg-white p-8">
              {/* Header - Thông tin phòng khám */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-800">
                <div className="text-sm">
                  <p className="font-bold text-base mb-1">PHÒNG KHÁM CHUYÊN KHOA DA LIỄU FORSKIN</p>
                  <p>170 Lê Hồng Nhi, Cái Răng, Cần Thơ</p>
                  <p>1900 2943 - 0856 068 959</p>
                </div>
                <div className="text-right text-sm">
                  <p>Mã BN: {medicalRecordData?.patient?.id || 'N/A'}</p>
                  <p>Mã đơn thuốc: {prescription.id}</p>
                </div>
              </div>

              {/* Tiêu đề */}
              <h1 className="text-2xl font-bold text-center mb-6">ĐƠN THUỐC</h1>

              {/* Thông tin bệnh nhân */}
              <div className="mb-6 text-sm">
                <div className="flex flex-wrap gap-x-20 gap-y-2">
                  <div className="flex gap-2">
                    <span className="font-medium">Họ tên:</span>
                    <span>{patientData?.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">Ngày sinh:</span>
                    <span>
                      {patientData?.dob 
                        ? formatDate(patientData.dob) 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">Giới tính:</span>
                    <span>
                      {patientData?.gender === 'MALE' ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">Địa chỉ:</span>
                    <span>{patientData?.address || '---'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">SĐT:</span>
                    <span>{patientData?.phone_number || 'N/A'}</span>
                  </div>
                  <div className="flex gap-2 w-full">
                    <span className="font-medium">Chẩn đoán:</span>
                    <span>{medicalRecordData?.diagnosis || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Bảng đơn thuốc */}
              <div className="mb-6">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-white">
                      <th className="border border-gray-800 px-2 py-2 font-bold text-center w-12">STT</th>
                      <th className="border border-gray-800 px-2 py-2 font-bold text-left">Tên thuốc</th>
                      <th className="border border-gray-800 px-2 py-2 font-bold text-center w-24">Số lượng</th>
                      <th className="border border-gray-800 px-2 py-2 font-bold text-center w-24">Đơn vị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.medications.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-800 px-2 py-2 text-center">{index + 1}</td>
                        <td className="border border-gray-800 px-2 py-2">
                          <div>{item.name}</div>
                          <div className="italic opacity-80 text-xs">{item.dosage}</div>
                        </td>
                        <td className="border border-gray-800 px-2 py-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-800 px-2 py-2 text-center">{item.dosage_form}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Lời dặn */}
              {prescription.notes && (
                <div className="mb-6 text-sm">
                  <p className="font-medium mb-2">Lời dặn:</p>
                  <p className="italic">{prescription.notes}</p>
                </div>
              )}

              {/* Footer - Chữ ký */}
              <div className="flex justify-end items-start text-sm mt-8">
                {/* <div>
                  <p className="mb-1">Ngày {formatDate(prescription.created_at)}</p>
                  <p className="mb-20">Người lập</p>
                  <p className="font-medium">{prescription.created_by_user?.full_name || 'N/A'}</p>
                </div> */}
                <div className="text-center">
                  <p className="mb-1">Ngày {formatDate(prescription.created_at)}</p>
                  <p className="mb-1">Bác sĩ kê đơn</p>
                  <p className="mb-20"></p>
                  <p className="font-medium">{medicalRecordData?.doctor?.full_name || 'N/A'}</p>
                </div>
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
                size: A4 portrait;
                margin: 10mm;
              }
              .print\\:hidden {
                display: none !important;
              }
              .print\\:block {
                display: block !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
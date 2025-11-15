'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import Badge from '@/components/ui/badge/Badge';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { formatDateTime } from '@/lib/utils';

interface MedicalRecordByPatientProps {
  patient_id_props: string;
}

export default function MedicalRecordByPatientTable({ patient_id_props }: MedicalRecordByPatientProps) {
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>();

    useEffect(() => {
        fetchMedicalRecordsByPatient();
    }, []);
    
    const fetchMedicalRecordsByPatient = async () => {
        try {
            const {payload} = await medicalRecordApiRequest.getList({patient_id: patient_id_props});
            const medicalRecordsData = payload.data;
            console.log(medicalRecordsData);
            setMedicalRecords(medicalRecordsData);
        } catch (error) {
            console.error('Lỗi lấy thông tin medicalRecords:', error);
        }
    };

  return (
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
                  Ngày giờ khám
                </TableCell>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bác sĩ
                </TableCell>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Triệu chứng
                </TableCell>
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Chẩn đoán
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
              {medicalRecords?.map((medicalRecord) => (
                <TableRow key={medicalRecord.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {formatDateTime(medicalRecord.created_at)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {medicalRecord.doctor.full_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {medicalRecord.symptoms}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {medicalRecord.diagnosis}
                  </TableCell>                  
                  <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      {/* <Button size="sm" onClick={() =>alert('Chuyển trang chi tiết thông tin bệnh nhân')}>Xem</Button> */}
                      {/* <Link href={`/patients/${patient.id}`}>
                        <Button size="sm">Xem</Button>
                      </Link>
                      <Button size="sm" onClick={() => onEdit(patient)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(patient.id)}>Xóa</Button> */}
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

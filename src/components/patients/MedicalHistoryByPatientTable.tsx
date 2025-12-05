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
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { formatDateTime, getPrefixedPath } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface MedicalHistoryByPatientProps {
  patient_id_props: string;
}

export default function MedicalHistoryByPatientTable({ patient_id_props }: MedicalHistoryByPatientProps) {
  const { user } = useAuth();
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>([]);

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
        <div className="min-w-[500px]">
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
                {/* <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bác sĩ
                </TableCell> */}
                {/* <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Triệu chứng
                </TableCell> */}
                <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Chẩn đoán & Triệu chứng
                </TableCell>
                {/* <TableCell
                  // isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Chẩn đoán, triệu chứng
                </TableCell> */}
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
              {medicalRecords.length > 0 ? (
                medicalRecords?.map((medicalRecord) => (
                  <TableRow key={medicalRecord.id}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[120px]">
                      {formatDateTime(medicalRecord.created_at)}
                    </TableCell>
                    {/* <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                      {medicalRecord.doctor.full_name}
                    </TableCell> */}
                    {/* <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                      {medicalRecord.symptoms}
                    </TableCell>*/}
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90  max-w-[300px]">
                      {/* <div className="flex items-center gap-3"> */}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 dark:text-white/90 truncate block max-w-full">
                            {medicalRecord.diagnosis || '—'}
                          </span>
                          {medicalRecord.symptoms && (
                            <span className="text-gray-500 text-theme-xs dark:text-gray-400 truncate block max-w-full mt-1">
                              {medicalRecord.symptoms}
                            </span>
                          )}
                        </div>
                      {/* </div>  */}
                    </TableCell> 
                    {/* <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {medicalRecord.diagnosis}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {medicalRecord.symptoms}
                          </span>
                        </div>
                      </div>
                    </TableCell> */}
                    <TableCell className="px-5 py-4 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                      <div className="flex gap-2">
                        <Link href={getPrefixedPath(`/medical-records/${medicalRecord.id}`, user?.role)} >
                          <Button size="sm">Xem</Button>
                        </Link>
                        {/* <Button size="sm" onClick={() =>alert('Chuyển trang chi tiết thông tin bệnh nhân')}>Xem</Button> */}
                        {/* <Link href={`/patients/${patient.id}`}>
                          <Button size="sm">Xem</Button>
                        </Link>
                        <Button size="sm" onClick={() => onEdit(patient)}>Sửa</Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(patient.id)}>Xóa</Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg className="mb-3 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-base font-medium">Chưa có lịch sử khám bệnh</p>
                      <p className="mt-1 text-sm text-gray-400">Bệnh nhân hiện chưa có hồ sơ khám nào.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

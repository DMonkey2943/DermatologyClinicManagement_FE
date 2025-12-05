'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { formatDateTime, getPrefixedPath } from '@/lib/utils';
import PaginationControls from '../ui/pagination/PaginationControls';
import { useAuth } from '@/context/AuthContext';

interface Props {
  patient_id_props: string;
}

export default function MedicalRecordByPatientTable({ patient_id_props }: Props) {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>([]);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMedicalRecordsByPatient();
  }, [page, pageSize]);

  const fetchMedicalRecordsByPatient = async () => {
    try {
      const { payload } = await medicalRecordApiRequest.getListByPatient(
        patient_id_props,
        { skip: page * pageSize, limit: pageSize }
      );

      const data = payload.data;
      setMedicalRecords(data);

      const totalFromPayload = payload.meta?.total ?? data.length;
      setTotal(totalFromPayload);

      const totalPages = Math.ceil(totalFromPayload / pageSize);
      if (page >= totalPages) setPage(totalPages - 1);
    } catch (error) {
      console.error('Lỗi lấy thông tin medicalRecords:', error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="p-4 font-semibold text-lg">Lịch sử khám bệnh</div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5 py-3 text-center w-20">Xem</TableHead>
              <TableHead className="px-5 py-3 w-40">Ngày khám</TableHead>
              <TableHead className="px-5 py-3">Chẩn đoán & Triệu chứng</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {medicalRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                  Chưa có lịch sử khám bệnh
                </TableCell>
              </TableRow>
            ) : (
              medicalRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/40 transition">
                  {/* Nút icon xem */}
                  <TableCell className="px-5 py-4 text-center">
                    <Link href={getPrefixedPath(`/medical-records/${record.id}`, user?.role)}>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                  
                  {/* Ngày khám */}
                  <TableCell className="px-5 py-4 text-sm font-medium">
                    {formatDateTime(record.created_at)}
                  </TableCell>

                  {/* Cột chẩn đoán + triệu chứng */}
                  <TableCell className="px-5 py-4">
                    <div className="flex flex-col space-y-1 
                                    max-w-48 sm:max-w-64 lg:max-w-80 
                                    overflow-hidden">

                      {/* Diagnosis: full text, wrap */}
                      <div className="text-sm font-medium break-words">
                        {record.diagnosis ?? '---'}
                      </div>

                      {/* Symptoms: smaller + truncated */}
                      <div
                        className="text-xs opacity-70 truncate"
                        title={record.symptoms ?? ''}
                      >
                        {record.symptoms ?? '---'}
                      </div>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

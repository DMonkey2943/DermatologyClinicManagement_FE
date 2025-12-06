// import React, { useState, useEffect } from 'react';
import Label from '@/components/form/Label';
import Badge from '@/components/ui/badge/Badge';
// import Input from '@/components/form/input/InputField';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import { formatDateTime, MR_STATUS_LABEL_MAP } from '@/lib/utils';

interface MedicalRecordCardProps {
  medicalRecordData?: MedicalRecordDataType;
}

export default function MedicalRecordCard({
  medicalRecordData
}: MedicalRecordCardProps) {
  const getStatusColor = (status: MedicalRecordDataType['status'] | undefined) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'PAID':
        return 'primary';
    }
  };

  const getStatusLabel = (status: MedicalRecordDataType['status'] | null | undefined): string => {
      if (!status) return 'Không xác định';
      return MR_STATUS_LABEL_MAP[status] || status;
  };
  
  const renderEmpty = (text: string) => (
    <p className="italic text-muted-foreground text-sm">{text}</p>
  );

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="col-span-1 sm:col-span-2">
        <Label>Ngày khám</Label>
        <p>{ medicalRecordData?.created_at && formatDateTime(medicalRecordData.created_at) }</p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Triệu chứng</Label>
        <p>
          {medicalRecordData?.symptoms?.trim()
            ? medicalRecordData.symptoms
            : renderEmpty('Không có triệu chứng')}
        </p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Chẩn đoán</Label>
        <p>
          {medicalRecordData?.diagnosis?.trim()
            ? medicalRecordData.diagnosis
            : renderEmpty('Không có chẩn đoán')}
        </p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Ghi chú</Label>
        <p>
          {medicalRecordData?.notes?.trim()
            ? medicalRecordData.notes
            : renderEmpty('Không có lời dặn bác sĩ')}
        </p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        {/* <Label>Trạng thái</Label> */}
        <Badge size="md" color={getStatusColor(medicalRecordData?.status)}>{getStatusLabel(medicalRecordData?.status)}</Badge>
      </div>
    </div>
  )
}
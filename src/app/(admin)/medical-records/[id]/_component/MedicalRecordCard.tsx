// import React, { useState, useEffect } from 'react';
import Label from '@/components/form/Label';
import Badge from '@/components/ui/badge/Badge';
// import Input from '@/components/form/input/InputField';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import { formatDateTime } from '@/lib/utils';

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
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="col-span-1 sm:col-span-2">
        <Label>Ngày khám</Label>
        <p>{ medicalRecordData?.created_at && formatDateTime(medicalRecordData.created_at) }</p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Triệu chứng</Label>
        <p>{ medicalRecordData?.symptoms }</p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Chẩn đoán</Label>
        <p>{ medicalRecordData?.diagnosis }</p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Ghi chú</Label>
        <p>{ medicalRecordData?.notes }</p>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Trạng thái</Label>
        {/* <p>{medicalRecordData?.status}</p> */}
        <Badge size="sm" color={getStatusColor(medicalRecordData?.status)}>{medicalRecordData?.status}</Badge>
      </div>
    </div>
  )
}
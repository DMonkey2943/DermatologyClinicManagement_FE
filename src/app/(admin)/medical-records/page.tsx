'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
// import Button from '@/components/ui/button/Button';
import MedicalRecordTable from '@/components/medical-records/MedicalRecordTable';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';

export default function PatientListPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDataType[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const {payload} = await medicalRecordApiRequest.getList();
      const medicalRecordList = payload.data;
      console.log(medicalRecordList);
      setMedicalRecords(medicalRecordList);
    } catch (error) {
      console.error('Lỗi lấy danh sách phiên khám:', error);
    }
  };

  return (
    <div>
      
      <PageBreadcrumb pageTitle="Danh sách phiên khám" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách phiên khám">
          <MedicalRecordTable 
            medical_records={medicalRecords} 
          />
        </ComponentCard>
      </div>
    </div>
  );
}
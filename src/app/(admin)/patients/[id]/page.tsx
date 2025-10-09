'use client';

import React, { useEffect, useState, use } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import MedicalRecordByPatientTable from './_component/MedicalRecordByPatientTable';

export default function PatientDetai({ params }: {
  params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const [patient, setPatient] = useState<PatientFullDataType>();

    useEffect(() => {
        fetchPatient();
    }, []);
    
    const fetchPatient = async () => {
        try {
            const {payload} = await patientApiRequest.getDetail(id);
            const patientData = payload.data;
            console.log(patientData);
            setPatient(patientData);
        } catch (error) {
            console.error('Lỗi lấy thông tin Patients:', error);
        }
    };
    

    return (    
        <div>
            <PageBreadcrumb pageTitle="Hồ sơ bệnh nhân" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 xl:col-span-5">
                    <ComponentCard title="Thông tin bệnh nhân">
                        <div className="space-y-6">
                            <p className='text-xs font-light text-gray-500 text-theme-sm dark:text-gray-400'>ID bệnh nhân: {patient?.id}</p>
                            <p className='text-center text-lg font-semibold text-gray-800 dark:text-white/90'>{patient?.full_name}</p>
                        </div>
                        <div>
                            <h6 className='font-medium'>Thông tin cá nhân</h6>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>{ patient?.gender == 'FEMALE' ? 'Nữ' : 'Nam'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Ngày sinh: {patient?.dob ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>SĐT: {patient?.phone_number ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Email: {patient?.email ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Địa chỉ: {patient?.address ?? '---'}</p>
                        </div>
                        <div>
                            <h6 className='font-medium'>Thông tin y tế</h6>                            
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Tiền sử bệnh lý: {patient?.medical_history ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Dị ứng: {patient?.allergies ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Thuốc đang dùng: {patient?.current_medications ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Tình trạng ban đầu: {patient?.current_condition ?? '---'}</p>
                        </div>
                    </ComponentCard>
                </div>
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <ComponentCard title="Lịch sử khám bệnh">
                        <MedicalRecordByPatientTable
                            patient_id_props={id}
                        />                    
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}


'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';

import MedicalRecordCard from '@/components/medical-records/detail/MedicalRecordCard';
import PrescriptionCard from '@/components/medical-records/detail/PrescriptionCard';
import ServiceIndicationCard from '@/components/medical-records/detail/ServiceIndicationCard';
import SkinImagesCard from '@/components/medical-records/detail/SkinImagesCard';

import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';

export default function ClientMedicalRecordDetail({ params }: { params: { id: string } }) {
    const { id } = params;
    const [patientId, setPatientId] = useState<string | null>(null);
    // const [doctorId, setDoctorId] = useState<string | null>(null);
    const [patient, setPatient] = useState<PatientFullDataType>();
    const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDataType>();

    useEffect(() => {
        fetchMedicalRecordInfo();
    }, []);

    useEffect(() => {
        if (patientId) {
            fetchPatient(patientId);
        }
    }, [patientId]);

    const fetchMedicalRecordInfo = async () => {
        try {
            const {payload} = await medicalRecordApiRequest.getDetail(id);
            const mrData = payload.data;
            console.log(mrData);
            setMedicalRecord(mrData);
            setPatientId(mrData.patient_id);
            // setDoctorId(mrData.doctor_id);
        } catch(error) {
            console.error('Lỗi lấy thông tin Appointment:', error);
        }
    }
    
    const fetchPatient = async (patient_id: string) => {
        try {
            const {payload} = await patientApiRequest.getDetail(patient_id);
            const patientData = payload.data;
            console.log(patientData);
            setPatient(patientData);
        } catch (error) {
            console.error('Lỗi lấy thông tin Patients:', error);
        }
    };
    

    return (    
        <div>
            <PageBreadcrumb pageTitle="Phiên khám" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 xl:col-span-3">
                    <ComponentCard title="Thông tin bệnh nhân">
                        <div className="space-y-6">
                            {/* <p className='text-xs font-light text-gray-500 text-theme-sm dark:text-gray-400'>ID bệnh nhân: {patient?.id}</p> */}
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
                            {/* <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Thuốc đang dùng: {patient?.current_medications ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Tình trạng ban đầu: {patient?.current_condition ?? '---'}</p> */}
                        </div>
                    </ComponentCard>
                </div>
                <div className="col-span-12 space-y-6 xl:col-span-9">
                    <ComponentCard title={"Phiếu khám bệnh"}>                        
                        <MedicalRecordCard
                            medicalRecordData={medicalRecord}
                        />
                    </ComponentCard>
                    <ComponentCard title="Đơn thuốc">           
                        <PrescriptionCard
                            medicalRecordId={id}
                            medicalRecordData={medicalRecord}
                            patientData={patient}
                        />
                    </ComponentCard>
                    <ComponentCard title="Phiếu chỉ định dịch vụ">           
                        <ServiceIndicationCard
                            medicalRecordId={id}
                        />
                    </ComponentCard>
                    <ComponentCard title="Ảnh da bệnh nhân">           
                        <SkinImagesCard
                            medicalRecordId={id}
                        />
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}


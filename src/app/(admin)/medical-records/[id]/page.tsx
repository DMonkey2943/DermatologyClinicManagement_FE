'use client';

import React, { useEffect, useState, use } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import MedicalRecordCard from './_component/MedicalRecordCard';
import PrescriptionCard from './_component/PrescriptionCard';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import ServiceIndicationCard from './_component/ServiceIndicationCard';

export default function PatientDetai({ params }: {
  params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    // const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null);
    const [patient, setPatient] = useState<PatientFullDataType>();
    const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDataType>();
    // const [prescription, setPrescription] = useState<PrescriptionFullDataType | null>();
    // const [serviceIndication, setServiceIndication] = useState<ServiceIndicationFullDataType | null>();
    // const patient_id = '793029ae-44d2-49b4-9fee-e8c077e59899';

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
            setDoctorId(mrData.doctor_id);
            // await fetchPrescription(id);
            // await fetchServiceIndication(id);
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

    // const fetchPrescription = async (medical_record_id: string) => {
    //     try {
    //         const {payload} = await medicalRecordApiRequest.getPrescriptionByMRId(medical_record_id);
    //         const data = payload.data;
    //         console.log(data);
    //         setPrescription(data);
    //     } catch (error) {
    //         console.error('Lỗi lấy thông tin đơn thuốc:', error);
    //     }
    // };

    // const fetchServiceIndication = async (medical_record_id: string) => {
    //     try {
    //         const {payload} = await medicalRecordApiRequest.getServiceIndicationByMRId(medical_record_id);
    //         const data = payload.data;
    //         console.log(data);
    //         setServiceIndication(data);
    //     } catch (error) {
    //         console.error('Lỗi lấy thông tin phiếu chỉ định dịch vụ:', error);
    //     }
    // };

    // const getMedicalRecordId = (mr_id: string) => {
    //     console.log("medical_record_id: ", mr_id);
    //     setMedicalRecordId(mr_id);
    // }

    // const handleCompleteMR = async () => {
    //     try {
    //         if (medicalRecordId) {
    //             const {payload} = await medicalRecordApiRequest.update(medicalRecordId, {status: "COMPLETED"});
    //             console.log(payload.data);
    //             //Chuyển qua trang thông tin chi tiết phiên khám
    //         } else {
    //             alert("Bạn chưa lưu phiên khám!!")
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }
    

    return (    
        <div>
            <PageBreadcrumb pageTitle="Phiếu khám bệnh" />
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
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Thuốc đang dùng: {patient?.current_medications ?? '---'}</p>
                            <p className='py-1 text-theme-sm text-gray-800 dark:text-white/90'>Tình trạng ban đầu: {patient?.current_condition ?? '---'}</p>
                        </div>
                    </ComponentCard>
                </div>
                <div className="col-span-12 space-y-6 xl:col-span-9">
                    <ComponentCard title="Phiếu khám bệnh">                        
                        <MedicalRecordCard
                            medicalRecordData={medicalRecord}
                        />
                    </ComponentCard>
                    <ComponentCard title="Đơn thuốc">           
                        <PrescriptionCard
                            medicalRecordId={id}
                        />
                    </ComponentCard>
                    <ComponentCard title="Phiếu chỉ định dịch vụ">           
                        <ServiceIndicationCard
                            medicalRecordId={id}
                        />
                    </ComponentCard>
                    {/* {medicalRecordId &&
                        <> 
                            <ComponentCard title="Kê đơn thuốc">           
                                <PrescriptionForm
                                medicalRecordId={medicalRecordId}
                                />
                            </ComponentCard>
                            <ComponentCard title="Chỉ định dịch vụ">           
                                <ServiceIndicationForm
                                    medicalRecordId={medicalRecordId}
                                />
                            </ComponentCard>                            
                        </>
                    }                     */}
                </div>
            </div>
        </div>
    );
}


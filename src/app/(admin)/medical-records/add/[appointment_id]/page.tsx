'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import MedicalRecordForm from './_component/MedicalRecordForm';
import PrescriptionForm from './_component/PrescriptionForm';
import appointmentApiRequest from '@/apiRequests/appointment';
import ServiceIndicationForm from './_component/ServiceIndicationForm';
import Button from '@/components/ui/button/Button';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { toast } from 'sonner';

export default function MedicalRecordCreate({ params }: {
  params: Promise<{ appointment_id: string }>
}) {
    const { appointment_id } = use(params);
    const router = useRouter();

    const [patientId, setPatientId] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null);
    const [patient, setPatient] = useState<PatientFullDataType>();
    // const patient_id = '793029ae-44d2-49b4-9fee-e8c077e59899';

    useEffect(() => {
        fetchAppointmentInfo();
    }, []);

    useEffect(() => {
        if (patientId) {
            fetchPatient(patientId);
        }
    }, [patientId]);

    const fetchAppointmentInfo = async () => {
        try {
            const {payload} = await appointmentApiRequest.getDetail(appointment_id);
            const appointmentData = payload.data;
            console.log(appointmentData);
            setPatientId(appointmentData.patient_id);
            setDoctorId(appointmentData.doctor_id);
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

    const getMedicalRecordId = (mr_id: string) => {
        console.log("medical_record_id: ", mr_id);
        setMedicalRecordId(mr_id);
    }

    const handleCompleteMR = async () => {
        try {
            if (medicalRecordId) {
                const {payload} = await medicalRecordApiRequest.update(medicalRecordId, {status: "COMPLETED"});
                console.log(payload.data);
                toast.success("Hoàn thành phiên khám");
                //Chuyển sang trang chi tiết phiên khám
                router.push(`/medical-records/${medicalRecordId}`);
                router.refresh();
            } else {
                // alert("Bạn chưa lưu phiên khám!!");
                toast.warning("Hãy lưu phiên khám!");
            }
        } catch (e) {
            console.error(e);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }
    

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
                    <ComponentCard title="Khám bệnh">           
                        <MedicalRecordForm
                            appointmentId={appointment_id!}
                            patientId={patientId!}
                            doctorId={doctorId!}
                            onSuccess={getMedicalRecordId}
                        />
                    </ComponentCard>
                    {medicalRecordId &&
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
                            <Button size="md" onClick={handleCompleteMR}>Hoàn thành phiên khám</Button>
                        </>
                    }                    
                </div>
            </div>
        </div>
    );
}


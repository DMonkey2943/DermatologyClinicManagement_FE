'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import Button from '@/components/ui/button/Button';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { UserFKDataType } from '@/schemaValidations/user.schema';
import { PrescriptionFullDataType } from '@/schemaValidations/prescription.schema';
import { ServiceIndicationFullDataType } from '@/schemaValidations/serviceIndication.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvoiceDetailTable from './_component/InvoiceDetailTable';

export default function InvoiceDetailPreview({ params }: {
  params: Promise<{ medical_record_id: string }>
}) {
    const { medical_record_id } = use(params);
    const router = useRouter();

    const [patientId, setPatientId] = useState<string | null>(null);
    const [doctor, setDoctor] = useState< UserFKDataType | null>(null);
    const [patient, setPatient] = useState<PatientFullDataType>();  
    const [prescription, setPrescription] = useState<PrescriptionFullDataType | null>();
    const [serviceIndication, setServiceIndication] = useState<ServiceIndicationFullDataType | null>();

    // const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null);
    // const patient_id = '793029ae-44d2-49b4-9fee-e8c077e59899';

    useEffect(() => {
        fetchMedicalRecordInfo();
    }, []);

    useEffect(() => {
        if (patientId) {
            // console.log("patient id from medical record: ", patientId);
            fetchPatient(patientId);
        }
    }, [patientId]);
    
    useEffect(() => {
        fetchPrescription(medical_record_id);
        fetchServiceIndication(medical_record_id);
    }, [medical_record_id]);

    const fetchMedicalRecordInfo = async () => {
        try {
            const {payload} = await medicalRecordApiRequest.getDetail(medical_record_id);
            const data = payload.data;
            // console.log(data);
            setPatientId(data.patient_id);
            setDoctor(data.doctor);
        } catch(error) {
            console.error('Lỗi lấy thông tin MedicalRecord:', error);
        }
    }
    
    const fetchPatient = async (patient_id: string) => {
        try {
            const {payload} = await patientApiRequest.getDetail(patient_id);
            const patientData = payload.data;
            // console.log(patientData);
            setPatient(patientData);
        } catch (error) {
            console.error('Lỗi lấy thông tin Patients:', error);
        }
    };

    const fetchPrescription = async (medical_record_id: string) => {
        try {
            const {payload} = await medicalRecordApiRequest.getPrescriptionByMRId(medical_record_id);
            const data = payload.data;
            console.log("Prescription: ", data);
            setPrescription(data);
        } catch (error) {
            console.error('Lỗi lấy thông tin đơn thuốc:', error);
        }
    };

    const fetchServiceIndication = async (medical_record_id: string) => {
        try {
            const {payload} = await medicalRecordApiRequest.getServiceIndicationByMRId(medical_record_id);
            const data = payload.data;
            console.log("Service Indication: ", data);
            setServiceIndication(data);
        } catch (error) {
            console.error('Lỗi lấy thông tin phiếu chỉ định dịch vụ:', error);
        }
    };

    // const getMedicalRecordId = (mr_id: string) => {
    //     console.log("medical_record_id: ", mr_id);
    //     setMedicalRecordId(mr_id);
    // }

    // const handleCompleteMR = async () => {
    //     try {
    //         if (medicalRecordId) {
    //             const {payload} = await medicalRecordApiRequest.update(medicalRecordId, {status: "COMPLETED"});
    //             console.log(payload.data);
    //             //Chuyển sang trang chi tiết phiên khám
    //             router.push(`/medical-records/${medicalRecordId}`);
    //             router.refresh();
    //         } else {
    //             alert("Bạn chưa lưu phiên khám!!")
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }
    

    return (    
        <div>
            <PageBreadcrumb pageTitle="Hóa đơn" />
            <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                        HÓA ĐƠN THANH TOÁN
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">Phòng Khám Đa Khoa ABC</p>
                    {/* <Separator className="mt-4" /> */}
                    </div>

                    {/* Content */}
                    {/* { patient && <PatientInfoCard patient={patient} />} */}
                    {patient && 
                    <>
                        <Card className="mb-6">
                            <CardHeader className="pb-3">
                            <CardTitle className="text-lg md:text-xl">Thông Tin Bệnh Nhân</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base">
                                <div>
                                <span className="font-semibold">Họ tên:</span> {patient.full_name}
                                </div>
                                <div>
                                <span className="font-semibold">Ngày sinh:</span> {patient.dob}
                                </div>
                                <div>
                                <span className="font-semibold">SĐT:</span> {patient.phone_number}
                                </div>
                            </div>
                            </CardContent>
                        </Card>    
                    </>
                    }

                    {
                        (serviceIndication && prescription) && <InvoiceDetailTable serviceIndication={serviceIndication} prescription={prescription} />
                    }
                    

                    {doctor && 
                    <>
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                                <div>
                                    <span className="font-semibold">Bác sĩ điều trị:</span> {doctor.full_name}
                                </div>
                                {/* <div>
                                    <span className="font-semibold">Ngày tái khám:</span> {doctorInfo.nextAppointment}
                                </div> */}
                            </div>
                            </CardContent>
                        </Card>    
                    </>
                    }
                </div>
            </div>           
        </div>
    );
}


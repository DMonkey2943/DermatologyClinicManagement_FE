'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
// import Button from '@/components/ui/button/Button';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { UserFKDataType } from '@/schemaValidations/user.schema';
import { PrescriptionFullDataType } from '@/schemaValidations/prescription.schema';
import { ServiceIndicationFullDataType } from '@/schemaValidations/serviceIndication.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvoiceDetailTable from './_component/InvoiceDetailTable';
import invoiceApiRequest from '@/apiRequests/invoice';
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';

interface InvoiceDetailDataType {
    serviceSubtotal: number;
    medicationSubtotal: number;
    grandTotal: number;
}

export default function InvoiceDetailPreview({ params }: {
  params: Promise<{ medical_record_id: string }>
}) {
    const { medical_record_id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [patientId, setPatientId] = useState<string | null>(null);
    const [doctor, setDoctor] = useState< UserFKDataType | null>(null);
    const [patient, setPatient] = useState<PatientFullDataType>();  
    const [prescription, setPrescription] = useState<PrescriptionFullDataType | null>();
    const [serviceIndication, setServiceIndication] = useState<ServiceIndicationFullDataType | null>();
    const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetailDataType>()

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

            if(data.status === 'IN_PROGRESS') {
                toast.error("Chỉ có thể tạo hóa đơn khi phiên khám đã hoàn thành!");
                router.push('/medical-records');
                return;
            } else if(data.status === 'PAID') {
                toast.error("Đã tồn tại hóa đơn cho phiên khám này!");
                router.push('/invoices');
                return;
            }
            
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

    const handleInvoiceDetailData = (data: InvoiceDetailDataType) => {
        setInvoiceDetail((prev) => {
            // So sánh giá trị cũ và mới
            if (
                prev?.serviceSubtotal === data.serviceSubtotal &&
                prev?.medicationSubtotal === data.medicationSubtotal &&
                prev?.grandTotal === data.grandTotal
            ) {
                return prev; // Không thay đổi → không re-render
            }
            console.log('Dữ liệu hóa đơn:', data);
            return data;
        });
    }

    const handleSubmitInvoice = async () => {
        try {
            const newInvoice = {
                medical_record_id: medical_record_id,
                patient_id: patientId!,
                doctor_id: doctor!.id,
                created_by: user!.id,
                service_subtotal: invoiceDetail?.serviceSubtotal,
                medication_subtotal: invoiceDetail?.medicationSubtotal,
                total_amount: invoiceDetail?.grandTotal,
                discount_amount: 0,
                final_amount: invoiceDetail?.grandTotal,
            }

            console.log(newInvoice);
            await invoiceApiRequest.create(newInvoice);
            toast.success("Tạo hóa đơn thanh toán thành công");
            router.push(`/invoices`);
            router.refresh();
        } catch (err) {
            console.log("Error submitting invoice: ", err);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

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
                        (serviceIndication && prescription) &&
                        <InvoiceDetailTable
                            serviceIndication={serviceIndication}
                            prescription={prescription}
                            onSendData={handleInvoiceDetailData}
                        />
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

                    <div className="mt-6 text-center print:hidden">
                        <button
                            onClick={handleSubmitInvoice}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Lưu hóa đơn
                        </button>
                    </div>
                </div>
            </div>           
        </div>
    );
}


'use client';

import React, { useEffect, useState, use } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import ComponentCard from '@/components/common/ComponentCard';
// import Button from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvoiceDetailTable from './_component/InvoiceDetailTable';
import invoiceApiRequest from '@/apiRequests/invoice';
import { InvoiceFullDataType } from '@/schemaValidations/invoice.schema';
// import { useAuth } from "@/context/AuthContext";

// interface InvoiceDetailDataType {
//     serviceSubtotal: number;
//     medicationSubtotal: number;
//     grandTotal: number;
// }

export default function InvoiceDetailPreview({ params }: {
  params: Promise<{ id: string }>
}) {
    const { id } = use(params);

    const [invoice, setInvoice] = useState<InvoiceFullDataType>();

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = async () => {
        try {
            const {payload} = await invoiceApiRequest.getDetail(id);
            const data = payload.data;
            // console.log(data);
            setInvoice(data);
        } catch(error) {
            console.error('Lỗi lấy thông tin Invoice:', error);
        }
    }
    

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
                    {/* {patient && 
                    <> */}
                        <Card className="mb-6">
                            <CardHeader className="pb-3">
                            <CardTitle className="text-lg md:text-xl">Thông Tin Bệnh Nhân</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base">
                                <div>
                                <span className="font-semibold">Họ tên:</span> {invoice?.patient.full_name}
                                </div>
                                <div>
                                <span className="font-semibold">Ngày sinh:</span> {invoice?.patient.dob}
                                </div>
                                <div>
                                <span className="font-semibold">SĐT:</span> {invoice?.patient.phone_number}
                                </div>
                            </div>
                            </CardContent>
                        </Card>    
                    {/* </>
                    } */}

                    {
                        (invoice ) &&
                        <InvoiceDetailTable
                            services={invoice.services}
                            medications={invoice.medications}
                            finalAmounts={invoice.final_amount!}
                        />
                    } 
                    

                    {/* {doctor && 
                    <> */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                                <div>
                                    <span className="font-semibold">Bác sĩ điều trị:</span> {invoice?.doctor.full_name}
                                </div>
                                {/* <div>
                                    <span className="font-semibold">Ngày tái khám:</span> {doctorInfo.nextAppointment}
                                </div> */}
                            </div>
                            </CardContent>
                        </Card>    
                    {/* </>
                    } */}

                    {/* <div className="mt-6 text-center print:hidden">
                        <button
                            // onClick={handleSubmitInvoice}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            In hóa đơn
                        </button>
                    </div> */}
                </div>
            </div>           
        </div>
    );
}


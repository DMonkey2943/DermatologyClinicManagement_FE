'use client';

import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import patientApiRequest from '@/apiRequests/patient';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import MedicalHistoryByPatientTable from '@/components/patients/MedicalHistoryByPatientTable';
import { Calendar, Mail, MapPin, Phone, VenusAndMars, Heart, AlertTriangle, IdCard } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ClientPatientDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [patient, setPatient] = useState<PatientFullDataType>();
  const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPatient();
    }, []);
    
    const fetchPatient = async () => {
        setIsLoading(true);
        try {
            const {payload} = await patientApiRequest.getDetail(id);
            const patientData = payload.data;
            console.log(patientData);
            setPatient(patientData);
        } catch (error) {
            console.error('Lỗi lấy thông tin Patients:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) {
        return "Đang tải..."
    } else {
        return (    
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 xl:col-span-5">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900/70">
                    {/* Header - Tên + ID */}
                    <div className="mb-6 text-center">
                        {/* <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-lg">
                        {patient?.full_name
                            .split(' ')
                            .slice(-1)[0]
                            .charAt(0)
                            .toUpperCase()}
                        </div> */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {patient?.full_name || 'Chưa có tên'}
                        </h3>
                        <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <IdCard className="h-4 w-4" />
                        ID: <span className="font-mono font-medium">{patient?.id || '---'}</span>
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Thông tin cá nhân */}
                        <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                            Thông tin cá nhân
                        </h4>
                        <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                            <VenusAndMars className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Giới tính</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                {patient?.gender === 'FEMALE' ? 'Nữ' : patient?.gender === 'MALE' ? 'Nam' : '---'}
                                </p>
                            </div>
                            </div>

                            <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Ngày sinh</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                {patient?.dob ? formatDate(patient.dob) : '---'}
                                </p>
                            </div>
                            </div>

                            <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Số điện thoại</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                {patient?.phone_number || '---'}
                                </p>
                            </div>
                            </div>

                            <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                {patient?.email || '---'}
                                </p>
                            </div>
                            </div>

                            <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                {patient?.address || '---'}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>

                        {/* Thông tin y tế */}
                        <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                            Thông tin y tế
                        </h4>
                        <div className="space-y-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                            <div className="flex gap-3">
                            <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-red-700 dark:text-red-300">Tiền sử bệnh lý</p>
                                <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                {patient?.medical_history || (
                                    <span className="italic text-gray-500">Không có tiền sử bệnh lý</span>
                                )}
                                </p>
                            </div>
                            </div>

                            <div className="flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Dị ứng</p>
                                <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                {patient?.allergies || (
                                    <span className="italic text-gray-500">Không dị ứng</span>
                                )}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <ComponentCard title="Lịch sử khám bệnh">
                        <MedicalHistoryByPatientTable
                            patient_id_props={id}
                        />                    
                    </ComponentCard>
                </div>
            </div>
        );
    }
}
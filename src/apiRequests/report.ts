// src/apiRequests/report.ts

import http from "@/lib/axios"
import { AppointmentStatsReportRes, DoctorStatsReportRes, MedicalRecordStatsReportRes, MedicationStatsReportRes, PatientStatsReportRes, ReportPeriodRequest, RevenueComparisonRequest, RevenueComparisonRes, RevenueReportRes, ServiceStatsReportRes } from "@/schemaValidations/report.schema";

const prefix = 'reports';

const reportApiRequest = {
    getRevenueComparison: (
        body: RevenueComparisonRequest
    ) => http.post<RevenueComparisonRes>(`/${prefix}/revenue/comparison`, body),

    getRevenueTotal: (
        body: ReportPeriodRequest
    ) => http.post<RevenueReportRes>(`/${prefix}/revenue/total`, body),

    getRevenueMedications: (
        body: ReportPeriodRequest
    ) => http.post<RevenueReportRes>(`/${prefix}/revenue/medications`, body),

    getRevenueServices: (
        body: ReportPeriodRequest
    ) => http.post<RevenueReportRes>(`/${prefix}/revenue/services`, body),

    getPatientStats: (
        body: ReportPeriodRequest
    ) => http.post<PatientStatsReportRes>(`/${prefix}/patients`, body),

    getAppointmentStats: (
        body: ReportPeriodRequest
    ) => http.post<AppointmentStatsReportRes>(`/${prefix}/appointments`, body),

    getDoctorStats: (
        body: ReportPeriodRequest
    ) => http.post<DoctorStatsReportRes>(`/${prefix}/doctors`, body),

    getMedicationStats: (
        body: ReportPeriodRequest
    ) => http.post<MedicationStatsReportRes>(`/${prefix}/medications`, body),

    getServiceStats: (
        body: ReportPeriodRequest
    ) => http.post<ServiceStatsReportRes>(`/${prefix}/services`, body),

    getMedicalRecordStats: (
        body: ReportPeriodRequest
    ) => http.post<MedicalRecordStatsReportRes>(`/${prefix}/medical-records`, body),
};

export default reportApiRequest;
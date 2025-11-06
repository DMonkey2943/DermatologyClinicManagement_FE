// src/schemaValidations/report.schema.ts

export interface ReportPeriodRequest {
    // period_type?: "day" | "week" | "month" | "year" | null
    period_type?: string | null; // day, week, month, year
    selected_date?: string | null
    start_date?: string | null
    end_date?: string | null
}

export interface RevenueReport {
    total: number;
    start_date?: string;
    end_date?: string;
}
export interface RevenueReportRes {    
    data: RevenueReport,
    message: string,
    success: boolean
}

export interface BreakdownItem {
    key: string | number;
    value: number;
}

// export interface RevenueBreakdownReport {
//     total: number;
//     breakdown: BreakdownItem[];
//     start_date?: string;
//     end_date?: string;
// }

export interface PatientStatsReport {
    total_patients: number;
    new_patients: number;
    revisits: number;
    age_distribution: Record<string, number>;
    gender_distribution: Record<string, number>;
}
export interface PatientStatsReportRes {
    data: PatientStatsReport,
    message: string,
    success: boolean
}

export interface AppointmentStatsReport {
    counts_by_status: Record<string, number>;
    attendance_rate?: number;
    cancel_rate?: number;
    avg_advance_days?: number;
    popular_time_slot?: string;
}
export interface AppointmentStatsReportRes {
    data: AppointmentStatsReport,
    message: string,
    success: boolean
}

export interface DoctorStatsItem {
    doctor_id: string;
    doctor_name?: string;
    patients_seen: number;
    revenue: number;
    revisit_rate?: number;
}

export interface DoctorStatsReport {
    items: DoctorStatsItem[];
}
export interface DoctorStatsReportRes {
    data: DoctorStatsReport,
    message: string,
    success: boolean
}

export interface LowStockItem {
    medication_id: string;
    name: string;
    stock_quantity: number;
    threshold: number
}
export interface MedicationStatsReport {
    top_prescribed: BreakdownItem[];
    inventory_value: number;
    low_stock: Array<LowStockItem>;
}
export interface MedicationStatsReportRes {
    data: MedicationStatsReport,
    message: string,
    success: boolean
}

export interface ServiceStatsReport {
    top_services: BreakdownItem[];
}
export interface ServiceStatsReportRes {
    data: ServiceStatsReport,
    message: string,
    success: boolean
}
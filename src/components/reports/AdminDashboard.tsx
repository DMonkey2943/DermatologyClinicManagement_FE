"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { DateFilter } from "@/components/reports/dashboard/date-filter"
import { ChartCard } from "@/components/reports/dashboard/chart-card"
import { PatientAgeChart } from "@/components/reports/dashboard/patient-age-chart"
import { AppointmentStatusChart } from "@/components/reports/dashboard/appointment-status-chart"
import { MedicationChart } from "@/components/reports/dashboard/medication-chart"
import { LowStockTable } from "@/components/reports/dashboard/low-stock-table"
import { DollarSign, Users, Activity, Package, Stethoscope } from "lucide-react"
import { format } from "date-fns"
// import type { FilterParams } from "@/types/report"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import reportApiRequest from "@/apiRequests/report";
import { StatCard } from "./dashboard/stat-card";
import { formatCurrency } from "@/lib/utils";
import { ServiceChart } from "./dashboard/service-chart";
import { PatientGenderChart } from "./dashboard/patient-gender-chart";
import appointmentApiRequest from "@/apiRequests/appointment";
import { AppointmentDataType } from "@/schemaValidations/appointment.schema";
import { AppointmentListTable } from "./dashboard/AppointmentListTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const AdminDashboard: React.FC = () => {
  const [filter, setFilter] = useState<ReportPeriodRequest>({
    period_type: "month",
    selected_date: format(new Date(), "yyyy-MM-dd"),
  })
    
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalMR, setTotalMR] = useState(0)
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentDataType[]>([]);
  const [patientAgeDistribution, setPatientAgeDistribution] = useState({})
  const [patientGenderDistribution, setPatientGenderDistribution] = useState({})

  useEffect(() => {
    fetchAppointments();
  }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                fetchRevenueTotal();
                fetchPatientStats();
                fetchMRStats();
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [filter]);
    
    const fetchRevenueTotal = async () => {
        // Fetch revenue
        const {payload} = await reportApiRequest.getRevenueTotal(filter)
        setTotalRevenue(payload.data.total)
    }
    const fetchPatientStats = async () => {
        // Fetch patient stats
        const {payload} = await reportApiRequest.getPatientStats(filter)
        setTotalPatients(payload.data.total_patients)
        setPatientAgeDistribution(payload.data.age_distribution)
        setPatientGenderDistribution(payload.data.gender_distribution)
    }
    const fetchMRStats = async () => {
        // Fetch medical record stats
        const {payload} = await reportApiRequest.getMedicalRecordStats(filter)
        setTotalMR(payload.data.total_medical_records)
    }
    const fetchAppointments = async () => {
        const { payload } = await appointmentApiRequest.getList({ skip: 0, limit: 5, appointment_date: format(new Date(), 'yyyy-MM-dd') })
        const appointmentList = payload.data;
        setAppointments(appointmentList); 
    }
    
  

  return (
    <>
      {/* Date Filter */}
      <DateFilter onFilterChange={setFilter} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            isLoading={loading}
        />
        <StatCard
            title="Bệnh nhân"
            value={totalPatients}
            icon={<Users className="h-6 w-6 text-primary" />}
            isLoading={loading}
        />
        <StatCard
            title="Lượt khám"
            value={totalMR}
            icon={<Stethoscope className="h-6 w-6 text-primary" />}
            isLoading={loading}
        />
      </div>
      
      {/* Appointment Status and Appointment List Table */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        <div className="md:col-span-4">
            <ChartCard
            title="Trạng thái lịch hẹn"
            description="Thống kê theo trạng thái"
            icon={<Activity className="h-5 w-5" />}
            >
            <AppointmentStatusChart filter={filter} />
            </ChartCard>
        </div>

        <div className="md:col-span-6">
            <AppointmentListTable appointments={appointments} isLoading={loading} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medication Chart */}
        <ChartCard
            title="Top 5 thuốc được kê đơn nhiều nhất"
            description="Thống kê trong kỳ"
            icon={<Package className="h-5 w-5" />}
        >
            <MedicationChart filter={filter} />
        </ChartCard>
        {/* Service Chart */}
        <ChartCard
            title="Top 5 dịch vụ được chỉ định nhiều nhất"
            description="Thống kê trong kỳ"
            icon={<Package className="h-5 w-5" />}
        >
            <ServiceChart filter={filter} />
        </ChartCard>        
      </div>

      {/*Patient Gender and Age Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        
        <ChartCard
          title="Phân bố giới tính bệnh nhân"
          description="Thống kê theo giới tính"
          icon={<Users className="h-5 w-5" />}
        >
          <PatientGenderChart filter={filter} genderDistribution={patientGenderDistribution} />
        </ChartCard>

        <ChartCard
          title="Phân bố độ tuổi bệnh nhân"
          description="Thống kê theo nhóm tuổi"
          icon={<Users className="h-5 w-5" />}
        >
          <PatientAgeChart filter={filter} ageDistribution={patientAgeDistribution} />
        </ChartCard>
      </div>


      {/* Low Stock Table */}
      <LowStockTable filter={filter} />
      </>
  )
}

export default AdminDashboard

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import reportApiRequest from "@/apiRequests/report"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"
// import type { FilterParams } from "@/types/report"

interface AppointmentStatusChartProps {
  filter: ReportPeriodRequest
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

const statusColors: Record<string, string> = {
  "COMPLETED": "rgba(34, 197, 94, 0.8)",
  "CANCELLED": "rgba(250, 73, 73, 0.8)",
  "SCHEDULED": "rgba(59, 130, 246, 0.8)",
  "WAITING": "rgba(251, 146, 60, 0.8)",
}

const statusLabels: Record<string, string> = {
  "COMPLETED": "Đã hoàn thành",
  "CANCELLED": "Đã hủy",
  "SCHEDULED": "Đã đặt lịch",
  "WAITING": "Đang chờ",
}

export const AppointmentStatusChart: React.FC<AppointmentStatusChartProps> = ({ filter }) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await reportApiRequest.getAppointmentStats(filter)

        if (response.payload?.data?.counts_by_status) {
          const statusData = response.payload.data.counts_by_status
          const labels = Object.entries(statusData).map(([key]) => statusLabels[key] || key)
          const values = Object.values(statusData) as number[]
          const colors = Object.keys(statusData).map((key) => statusColors[key] || "rgba(100, 100, 100, 0.8)")

          setData({
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: colors,
              },
            ],
          })
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filter])

  if (loading) return <div className="h-[300px] flex items-center justify-center">Đang tải...</div>
  if (!data) return <div className="h-[300px]">Không có dữ liệu</div>

  return (
    <div className="h-[300px]">
      <Doughnut data={data} options={chartOptions} />
    </div>
  )
}

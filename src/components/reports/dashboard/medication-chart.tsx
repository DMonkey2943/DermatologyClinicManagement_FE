"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import reportApiRequest from "@/apiRequests/report"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"
// import type { FilterParams } from "@/types/report"

interface MedicationChartProps {
  filter: ReportPeriodRequest
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

export const MedicationChart: React.FC<MedicationChartProps> = ({ filter }) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await reportApiRequest.getMedicationStats(filter)

        if (response.payload?.data?.top_prescribed) {
          const medications = response.payload.data.top_prescribed
          const labels = medications.map((item: any) => item.name)
          const values = medications.map((item: any) => item.value)

          setData({
            labels,
            datasets: [
              {
                label: "Số lần kê đơn",
                data: values,
                backgroundColor: "#00A63E",
              },
            ],
          })
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thuốc:", error)
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
      <Bar data={data} options={chartOptions} />
    </div>
  )
}

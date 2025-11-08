"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import reportApiRequest from "@/apiRequests/report"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"
// import type { FilterParams } from "@/types/report"

interface ServiceChartProps {
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

export const ServiceChart: React.FC<ServiceChartProps> = ({ filter }) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await reportApiRequest.getServiceStats(filter)

        if (response.payload?.data?.top_services) {
          const services = response.payload.data.top_services
          const labels = services.map((item: any) => item.key)
          const values = services.map((item: any) => item.value)

          setData({
            labels,
            datasets: [
              {
                label: "Số lần chỉ định",
                data: values,
                backgroundColor: "#9810FA",
              },
            ],
          })
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dịch vụ:", error)
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

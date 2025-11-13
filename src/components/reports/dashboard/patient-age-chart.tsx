"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Pie } from "react-chartjs-2"
import reportApiRequest from "@/apiRequests/report"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"
// import type { FilterParams } from "@/types/report"

interface PatientAgeChartProps {
  filter: ReportPeriodRequest
  ageDistribution: Record<string, number>
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

export const PatientAgeChart: React.FC<PatientAgeChartProps> = ({ filter, ageDistribution }) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await reportApiRequest.getPatientStats(filter)
        console.log(ageDistribution);

        if (response.payload.data.age_distribution) {
          const ageData = response.payload.data.age_distribution
          const labels = Object.keys(ageData)
          const values = Object.values(ageData)
          const colors = [
            "rgba(59, 130, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(251, 146, 60, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ]

          setData({
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: colors.slice(0, labels.length),
              },
            ],
          })
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phân bố tuổi:", error)
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
      <Pie data={data} options={chartOptions} />
    </div>
  )
}

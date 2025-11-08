"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Pie } from "react-chartjs-2"
import reportApiRequest from "@/apiRequests/report"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"
// import type { FilterParams } from "@/types/report"

interface PatientGenderChartProps {
  filter: ReportPeriodRequest
  genderDistribution: Record<string, number>
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

export const PatientGenderChart: React.FC<PatientGenderChartProps> = ({ filter, genderDistribution }) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await reportApiRequest.getPatientStats(filter)
        
        if (response.payload.data.gender_distribution) {
          const genderData = response.payload.data.gender_distribution
          // Lấy labels gốc
          const rawLabels = Object.keys(genderData)

          // Map sang tiếng Việt
          const labels = rawLabels.map((label) =>
            label === "MALE" ? "Nam" : label === "FEMALE" ? "Nữ" : label
          )
          const values = Object.values(genderData)
          const colors = [
            "rgba(59, 130, 246, 0.8)",
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
        console.error("Lỗi khi lấy dữ liệu phân bố giới tính:", error)
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

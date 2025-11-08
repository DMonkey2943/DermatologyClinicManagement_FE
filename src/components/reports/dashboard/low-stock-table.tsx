"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import reportApiRequest from "@/apiRequests/report"
// import type { FilterParams } from "@/types/report"
import type { LowStockItem, ReportPeriodRequest } from "@/schemaValidations/report.schema"

interface LowStockTableProps {
  filter: ReportPeriodRequest
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ filter }) => {
  const [items, setItems] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await reportApiRequest.getMedicationStats(filter)

        if (response.payload?.data?.low_stock) {
          setItems(response.payload.data.low_stock)
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thuốc sắp hết:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filter])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Thuốc sắp hết hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Tên thuốc</th>
                <th className="text-left py-3 px-4">Tồn kho</th>
                <th className="text-left py-3 px-4">Ngưỡng</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted-foreground">
                    Đang tải...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted-foreground">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.medication_id} className="border-b">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.stock_quantity}</td>
                    <td className="py-3 px-4">{item.threshold}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Cần nhập
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

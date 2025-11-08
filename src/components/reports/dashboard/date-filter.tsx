"use client"

import type React from "react"
import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ReportPeriodRequest } from "@/schemaValidations/report.schema"
// import type { FilterParams } from "@/types/report"

interface DateFilterProps {
  onFilterChange: (filter: ReportPeriodRequest) => void
}

export const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [periodType, setPeriodType] = useState<string>("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    handleApplyFilter()
  }, [periodType, selectedDate, startDate, endDate])

  const handleApplyFilter = () => {
    const filter: ReportPeriodRequest = {
      period_type: periodType === "custom" ? null : periodType,
    }

    if (periodType === "custom") {
      if (startDate) filter.start_date = format(startDate, "yyyy-MM-dd")
      if (endDate) filter.end_date = format(endDate, "yyyy-MM-dd")
    } else {
      filter.selected_date = format(selectedDate, "yyyy-MM-dd")
    }

    onFilterChange(filter)
  }

  return (
    <div className="mb-6 ">
      {/* <CardHeader>
        <CardTitle className="text-lg">Bộ lọc thời gian</CardTitle>
      </CardHeader> */}
      {/* <CardContent> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Loại thời gian</label>
            <Select value={periodType} onValueChange={setPeriodType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Ngày</SelectItem>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {periodType !== "custom" && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {periodType === "day"
                  ? "Chọn ngày"
                  : periodType === "week"
                    ? "Chọn tuần"
                    : periodType === "month"
                      ? "Chọn tháng"
                      : "Chọn năm"}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    locale={vi}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {periodType === "custom" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Từ ngày</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      locale={vi}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Đến ngày</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      locale={vi}
                      disabled={(date) => (startDate ? date < startDate : false)}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>
      {/* </CardContent> */}
    </div>
  )
}

"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, TrendingUp, Users, Activity, DollarSign, Package, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
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
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

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
  Filler
);

// ====================
// TYPES
// ====================
interface DateFilterProps {
  onFilterChange: (filter: FilterParams) => void;
}

interface FilterParams {
  period_type: string | null;
  selected_date?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

// ====================
// DATE FILTER COMPONENT (Dùng chung)
// ====================
const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [periodType, setPeriodType] = useState<string>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    handleApplyFilter();
  }, [periodType, selectedDate, startDate, endDate]);

  const handleApplyFilter = () => {
    const filter: FilterParams = {
      period_type: periodType === 'custom' ? null : periodType,
    };

    if (periodType === 'custom') {
      if (startDate) filter.start_date = format(startDate, 'yyyy-MM-dd');
      if (endDate) filter.end_date = format(endDate, 'yyyy-MM-dd');
    } else {
      filter.selected_date = format(selectedDate, 'yyyy-MM-dd');
    }

    onFilterChange(filter);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Bộ lọc thời gian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Loại khoảng thời gian */}
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

          {/* Chọn ngày cụ thể (không phải custom) */}
          {periodType !== 'custom' && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {periodType === 'day' ? 'Chọn ngày' : 
                 periodType === 'week' ? 'Chọn tuần' :
                 periodType === 'month' ? 'Chọn tháng' : 'Chọn năm'}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
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

          {/* Khoảng thời gian tùy chỉnh */}
          {periodType === 'custom' && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Từ ngày</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
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
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      locale={vi}
                      disabled={(date) => startDate ? date < startDate : false}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ====================
// CHART CARD WRAPPER
// ====================
const ChartCard: React.FC<ChartCardProps> = ({ title, description, children, icon }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

// ====================
// STAT CARD
// ====================
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-3 w-3 ${!trendUp && 'rotate-180'}`} />
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ====================
// DEMO DASHBOARD
// ====================
const ReportDashboard: React.FC = () => {
  const [filter, setFilter] = useState<FilterParams>({
    period_type: 'month',
    selected_date: format(new Date(), 'yyyy-MM-dd'),
  });

  // Mock data - thay bằng API call thực tế
  const revenueData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: [65000000, 59000000, 80000000, 81000000, 56000000, 75000000, 90000000, 85000000, 70000000, 95000000, 88000000, 100000000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const patientAgeData = {
    labels: ['0-18', '19-30', '31-45', '46-60', '60+'],
    datasets: [
      {
        data: [15, 30, 35, 25, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
      },
    ],
  };

  const appointmentStatusData = {
    labels: ['Đã hoàn thành', 'Đã hủy', 'Chưa đến', 'Đang chờ'],
    datasets: [
      {
        data: [120, 15, 30, 25],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  };

  const doctorStatsData = {
    labels: ['BS. Nguyễn Văn A', 'BS. Trần Thị B', 'BS. Lê Văn C', 'BS. Phạm Thị D'],
    datasets: [
      {
        label: 'Số bệnh nhân',
        data: [45, 38, 52, 41],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const medicationData = {
    labels: ['Paracetamol', 'Amoxicillin', 'Vitamin C', 'Aspirin', 'Ibuprofen'],
    datasets: [
      {
        label: 'Số lần kê đơn',
        data: [150, 120, 100, 85, 75],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo thống kê</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan hoạt động phòng khám
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <DateFilter onFilterChange={setFilter} />

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(950000000)}
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Bệnh nhân"
          value="1,234"
          icon={<Users className="h-6 w-6 text-primary" />}
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="Lượt khám"
          value="856"
          icon={<Activity className="h-6 w-6 text-primary" />}
          trend="-2.4%"
          trendUp={false}
        />
        <StatCard
          title="Tồn kho thuốc"
          value={formatCurrency(145000000)}
          icon={<Package className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Doanh thu theo tháng"
          description="Thống kê doanh thu trong năm"
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="h-[300px]">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard
          title="Phân bố độ tuổi bệnh nhân"
          description="Thống kê theo nhóm tuổi"
          icon={<Users className="h-5 w-5" />}
        >
          <div className="h-[300px]">
            <Pie data={patientAgeData} options={chartOptions} />
          </div>
        </ChartCard>
      </div>

      {/* Thống kê lịch hẹn và bác sĩ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Trạng thái lịch hẹn"
          description="Thống kê theo trạng thái"
          icon={<Activity className="h-5 w-5" />}
        >
          <div className="h-[300px]">
            <Doughnut data={appointmentStatusData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard
          title="Hiệu suất bác sĩ"
          description="Số bệnh nhân theo bác sĩ"
          icon={<Stethoscope className="h-5 w-5" />}
        >
          <div className="h-[300px]">
            <Bar data={doctorStatsData} options={chartOptions} />
          </div>
        </ChartCard>
      </div>

      {/* Thống kê thuốc */}
      <ChartCard
        title="Top 5 thuốc được kê đơn nhiều nhất"
        description="Thống kê trong kỳ"
        icon={<Package className="h-5 w-5" />}
      >
        <div className="h-[300px]">
          <Bar
            data={medicationData}
            options={{
              ...chartOptions,
              indexAxis: 'y' as const,
            }}
          />
        </div>
      </ChartCard>

      {/* Bảng thuốc sắp hết */}
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
                {[
                  { name: 'Amoxicillin 500mg', stock: 50, threshold: 100 },
                  { name: 'Paracetamol 500mg', stock: 80, threshold: 150 },
                  { name: 'Vitamin B Complex', stock: 30, threshold: 100 },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.stock}</td>
                    <td className="py-3 px-4">{item.threshold}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Cần nhập
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDashboard;
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import reportApiRequest from '@/apiRequests/report';
import { RevenueComparisonReportData } from '@/schemaValidations/report.schema';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ClientRevenueStatisticsPage = () => {
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'quarter' | 'year'>('week');
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [data, setData] = useState<RevenueComparisonReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMedications, setShowMedications] = useState(true);
  const [showServices, setShowServices] = useState(true);

  // Fetch data từ API
  const fetchData = async (date: Date, period: string) => {
    setLoading(true);
    try {
      const response = await reportApiRequest.getRevenueComparison({
          period_type: period,
          reference_date: date.toISOString().split('T')[0]
        });
      
      const result = await response.payload;
      if (result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(referenceDate, periodType);
  }, [referenceDate, periodType]);

  // Navigation functions
  const handlePrevious = () => {
    const newDate = new Date(referenceDate);
    switch (periodType) {
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'quarter':
        newDate.setMonth(newDate.getMonth() - 3);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setReferenceDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(referenceDate);
    switch (periodType) {
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'quarter':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setReferenceDate(newDate);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  // Format date range display
  const getDateRangeDisplay = () => {
    if (!data) return '';
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
  };
  
  // Calculate quarter from referenceDate
  const getQuarter = () => {
    const month = referenceDate.getMonth(); // 0-based (0 = January, 11 = December)
    return Math.floor(month / 3) + 1; // Quarter 1, 2, 3, or 4
  };
  
  const getMonth = () => {
    const month = referenceDate.getMonth();
    return month+1;
  }
  
  const getYear = () => {
    const year = referenceDate.getFullYear();
    return year;
  }
  
  // Get title based on periodType
  const getChartTitle = () => {
    switch (periodType) {
      case 'quarter':
        return `Biểu đồ doanh thu trong Quý ${getQuarter()} năm ${getYear()}`;
      case 'week':
        return `Biểu đồ doanh thu trong Tuần (${getDateRangeDisplay()})`;
      case 'month':
        return `Biểu đồ doanh thu trong Tháng ${getMonth()}/${getYear()}`;
      case 'year':
        return `Biểu đồ doanh thu trong Năm ${getYear()}`;
      default:
        return `Biểu đồ doanh thu`;
    }
  };

  const getTableTitle = () => {
    switch (periodType) {
      case 'quarter':
        return `Chi tiết doanh thu trong Quý ${getQuarter()}`;
      case 'week':
        return `Chi tiết doanh thu trong Tuần (${getDateRangeDisplay()})`;
      case 'month':
        return `Chi tiết doanh thu trong Tháng ${getMonth()}/${getYear()}`;
      case 'year':
        return `Chi tiết doanh thu trong Năm ${getYear()}`;
      default:
        return `Chi tiết doanh thu`;
    }
  };

  // Prepare chart data
  const chartData = {
    labels: data?.data_points.map(dp => dp.label) || [],
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: data?.data_points.map(dp => dp.total) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      ...(showMedications ? [{
        label: 'Doanh thu thuốc',
        data: data?.data_points.map(dp => dp.medications) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      }] : []),
      ...(showServices ? [{
        label: 'Doanh thu dịch vụ',
        data: data?.data_points.map(dp => dp.services) || [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      }] : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatCurrency(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value);
          }
        }
      }
    }
  };

  // Calculate growth percentage
//   const calculateGrowth = (current: number, previous: number) => {
//     if (previous === 0) return null;
//     return ((current - previous) / previous) * 100;
//   };

  const currentPeriodRevenue = data?.total_revenue || 0;
  const avgDailyRevenue = data ? currentPeriodRevenue / data.data_points.length : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thống kê Doanh thu</h1>
          <p className="text-gray-500 mt-1">{getDateRangeDisplay()}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={periodType} onValueChange={(value: any) => setPeriodType(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Trong tuần</SelectItem>
              <SelectItem value="month">Trong tháng</SelectItem>
              <SelectItem value="quarter">Trong quý</SelectItem>
              <SelectItem value="year">Trong năm</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button onClick={handlePrevious} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={handleNext} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(currentPeriodRevenue)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Trung bình: {formatCurrency(avgDailyRevenue)}/ngày
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Doanh thu thuốc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data?.total_medications || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {data && ((data.total_medications / currentPeriodRevenue) * 100).toFixed(1)}% tổng doanh thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Doanh thu dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(data?.total_services || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {data && ((data.total_services / currentPeriodRevenue) * 100).toFixed(1)}% tổng doanh thu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{getChartTitle()}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={showMedications ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMedications(!showMedications)}
              >
                Thuốc
              </Button>
              <Button
                variant={showServices ? "default" : "outline"}
                size="sm"
                onClick={() => setShowServices(!showServices)}
              >
                Dịch vụ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>{getTableTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Khoảng thời gian</th>
                  <th className="text-right p-3 font-semibold">Tổng</th>
                  <th className="text-right p-3 font-semibold">Thuốc</th>
                  <th className="text-right p-3 font-semibold">Dịch vụ</th>
                </tr>
              </thead>
              <tbody>
                {data?.data_points.map((dp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3">{dp.label}</td>
                    <td className="text-right p-3 font-medium">{formatCurrency(dp.total)}</td>
                    <td className="text-right p-3 text-green-600">{formatCurrency(dp.medications)}</td>
                    <td className="text-right p-3 text-purple-600">{formatCurrency(dp.services)}</td>
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

export default ClientRevenueStatisticsPage;
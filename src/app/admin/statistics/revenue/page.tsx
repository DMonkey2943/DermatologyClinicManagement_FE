import ClientRevenueStatisticsPage from "./ClientRevenueStatisticsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thống kê doanh thu | ForSkin - Phòng khám da liễu",
  description: "Trang Thống kê doanh thu",
};

export default function RevenueStatistics() {
  return <ClientRevenueStatisticsPage />;
}
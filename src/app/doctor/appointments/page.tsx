import ClientAppointmentListPage from "./ClientAppointmentListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Quản lý lịch hẹn | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý lịch hẹn",
};

export default function AppointmentListPage() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <PageBreadcrumb pageTitle="Quản lý Lịch hẹn" />      
        <div className="space-y-6">
          <ComponentCard title="Danh sách Lịch hẹn khám">
            <ClientAppointmentListPage />
          </ComponentCard>
        </div>
      </div>
    </Suspense>
  );
}
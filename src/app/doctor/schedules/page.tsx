import ClientAppointmentListPage from "./ClientAppointmentListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách lịch khám | ForSkin - Phòng khám da liễu",
  description: "Trang Danh sách lịch khám",
};

export default function AppointmentListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Danh sách Lịch khám" />      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Lịch khám">
          <ClientAppointmentListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
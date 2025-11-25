import ClientDoctorCalendarPage from "./ClientDoctorCalendarPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theo dõi lịch khám | ForSkin - Phòng khám da liễu",
  description: "Trang Theo dõi lịch khám",
};

export default function AppointmentListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Theo dõi Lịch khám" />      
      <div className="space-y-6">
        {/* <ComponentCard title="Danh sách Lịch hẹn khám"> */}
          <ClientDoctorCalendarPage />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}
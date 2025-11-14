import ClientMedicalRecordListPage from "./ClientMedicalRecordListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý phiên khám | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý phiên khám",
};

export default function UserListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Quản lý Phiên khám" />      
      <div className="space-y-6">
        <ComponentCard title="Danh sách phiên khám">
          <ClientMedicalRecordListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
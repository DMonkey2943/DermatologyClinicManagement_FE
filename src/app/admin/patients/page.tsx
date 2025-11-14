import ClientPatientListPage from './ClientPatientListPage';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý bệnh nhân | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý bệnh nhân",
};

export default function UserListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Quản lý Bệnh nhân" />      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Bệnh nhân">
          <ClientPatientListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
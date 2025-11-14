import ClientServiceListPage from "./ClientServiceListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý dịch vụ | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý dịch vụ",
};

export default function ServiceListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Quản lý Dịch vụ" />      
      <div className="space-y-6">
        <ComponentCard title="Danh sách dịch vụ">
          <ClientServiceListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
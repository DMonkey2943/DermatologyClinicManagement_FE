import ClientUserListPage from "./ClientUserListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý tài khoản | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý tài khoản",
};

export default function UserListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Quản lý Tài khoản" />      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Tài khoản">
          <ClientUserListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
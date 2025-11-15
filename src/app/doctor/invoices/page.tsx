import ClientInvoiceListPage from "./ClientInvoiceListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý hóa đơn | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý hóa đơn",
};

export default function InvoiceListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Quản lý Hóa đơn" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách hóa đơn">
          <ClientInvoiceListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
import ClientMedicationListPage from "./ClientMedicationListPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý thuốc | ForSkin - Phòng khám da liễu",
  description: "Trang Quản lý thuốc",
};

export default function MedicationListPage() {
  return(
    <div>
      <PageBreadcrumb pageTitle="Quản lý Thuốc" />      
      <div className="space-y-6">
        <ComponentCard title="Danh sách thuốc">
          <ClientMedicationListPage />
        </ComponentCard>
      </div>
    </div>
  );
}
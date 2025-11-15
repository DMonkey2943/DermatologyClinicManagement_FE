import ClientPatientDetailPage from "./ClientPatientDetailPage";
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hồ sơ bệnh nhân | ForSkin - Phòng khám da liễu",
  description: "Trang Hồ sơ bệnh nhân",
};

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
    return (
        <div>
            <PageBreadcrumb pageTitle="Hồ sơ bệnh nhân" />
            <ClientPatientDetailPage params={resolvedParams}/>
        </div>
    );
}
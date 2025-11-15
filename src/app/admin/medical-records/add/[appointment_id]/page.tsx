import ClientAddMedicalRecordPage from "./ClientAddMedicalRecordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo phiên khám | ForSkin - Phòng khám da liễu",
  description: "Trang Tạo phiên khám",
};

export default async function AddMedicalRecordPage({ params }: { params: Promise<{ appointment_id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientAddMedicalRecordPage params={resolvedParams}/>;
}
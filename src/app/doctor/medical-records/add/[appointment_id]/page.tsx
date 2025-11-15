import ClientAddMedicalRecordPage from "./ClientAddMedicalRecordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa tài khoản | ForSkin - Phòng khám da liễu",
  description: "Trang Chỉnh sửa tài khoản",
};

export default async function AddMedicalRecordPage({ params }: { params: Promise<{ appointment_id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientAddMedicalRecordPage params={resolvedParams}/>;
}
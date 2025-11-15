import ClientMedicalRecordDetail from "./ClientMedicalRecordDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết phiên khám | ForSkin - Phòng khám da liễu",
  description: "Trang Chi tiết phiên khám",
};

export default async function MedicalRecordDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientMedicalRecordDetail params={resolvedParams}/>;
}
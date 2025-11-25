import ClientEditPatientPage from "./ClientEditPatientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cập nhật thông tin bệnh nhân | ForSkin - Phòng khám da liễu",
  description: "Trang Cập nhật thông tin bệnh nhân",
};

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientEditPatientPage params={resolvedParams}/>;
}
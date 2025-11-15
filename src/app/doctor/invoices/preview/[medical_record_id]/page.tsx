import ClientInvoicePreviewPage from "./ClientInvoicePreviewPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lập hóa đơn | ForSkin - Phòng khám da liễu",
  description: "Trang Lập hóa đơn",
};

export default async function EditUserPage({ params }: { params: Promise<{ medical_record_id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientInvoicePreviewPage params={resolvedParams}/>;
}
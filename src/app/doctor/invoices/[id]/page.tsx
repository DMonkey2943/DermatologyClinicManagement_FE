import ClientInvoiceDetailPage from "./ClientInvoiceDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết hóa đơn | ForSkin - Phòng khám da liễu",
  description: "Trang Chi tiết hóa đơn",
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientInvoiceDetailPage params={resolvedParams}/>;
}
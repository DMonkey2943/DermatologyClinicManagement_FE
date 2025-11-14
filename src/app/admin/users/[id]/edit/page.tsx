import ClientEditUserPage from "./ClientEditUserPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa tài khoản | ForSkin - Phòng khám da liễu",
  description: "Trang Chỉnh sửa tài khoản",
};

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Unwrap Promise
  // console.log('Params in Server Component:', resolvedParams); // Kiểm tra params
  return <ClientEditUserPage params={resolvedParams}/>;
}
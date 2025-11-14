import ClientCreateUserPage from "./ClientCreateUserPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thêm tài khoản | ForSkin - Phòng khám da liễu",
  description: "Trang Thêm tài khoản",
};

export default function CreateUserPage() {
  return <ClientCreateUserPage />;
}
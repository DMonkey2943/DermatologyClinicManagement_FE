import SignInForm from "@/components/auth/patient/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bệnh nhân đăng nhập | ForSkin - Phòng khám da liễu",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}

"use client";
// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { EntityError, UnauthorizedError } from '@/lib/axios';
import authApiRequest from "@/apiRequests/auth";
import { toast } from "sonner";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({}); // State để lưu lỗi 422
  const [unauthorizedErrors, setUnauthorizedErrors] = useState(""); // State để lưu lỗi 422
  const router = useRouter();
  const { setUser } = useAuth(); // Lấy setUser từ useAuth

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading)
      return;
    setIsLoading(true);

     // Reset lỗi trước khi gọi API
    setErrors({});
    setUnauthorizedErrors("");

    try {
      const res = await authApiRequest.login({username, password})
      
      const currentUser = res.payload.data.user;
      // console.log('Logged in user:', currentUser);
      setUser(currentUser); // Cập nhật user trong AuthContext
      // Nếu login thành công
      if (currentUser.role == 'ADMIN') {
        router.push("admin/"); // Redirect về trang home
      } else if (currentUser.role == 'DOCTOR') {
        router.push("doctor/"); // Redirect về trang home
      } else if (currentUser.role == 'STAFF') {
        router.push("staff/"); // Redirect về trang home
      }
      toast.success("Đăng nhập thành công");
    } catch (err) {
      if (err instanceof EntityError) {
        // Xử lý lỗi 422
        const errorPayload = err.payload.details;
        const newErrors: { username?: string; password?: string } = {};
        errorPayload.forEach(({ field, msg }) => {
          if (field === 'username' || field === 'password') {
            newErrors[field] = msg; // Lưu lỗi theo field
          }
        });
        setErrors(newErrors); // Cập nhật state errors
      }else if (err instanceof UnauthorizedError) {
        // Xử lý lỗi 401
        setUnauthorizedErrors(err.payload.message)
      } else {
        console.error("Login failed", err);
        alert("Sai tài khoản hoặc mật khẩu!");
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập username và mật khẩu để đăng nhập vào hệ thống!
            </p>
            {unauthorizedErrors && (
              <p
                className="mt-1.5 text-sm text-error-500"
              >
                {unauthorizedErrors}
              </p>
            )}
          </div>
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Nhập username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username} // Hiển thị trạng thái lỗi
                  hint={errors.username} // Hiển thị message lỗi
                />
              </div>
              <div>
                <Label>
                  Mật khẩu <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}error={!!errors.password} // Hiển thị trạng thái lỗi
                    hint={errors.password} // Hiển thị message lỗi
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div> */}
              <Button className="w-full" size="sm" disabled={isLoading}>
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

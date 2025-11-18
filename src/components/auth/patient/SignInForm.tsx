"use client";
// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import { useAuth } from '@/context/AuthContext';
import { EntityError, UnauthorizedError } from '@/lib/axios';
// import authApiRequest from "@/apiRequests/auth";
import patientAuthApiRequest from '@/apiRequests/patientAuth';
import { toast } from "sonner";
import Cookies from 'js-cookie';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  // const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ phone_number?: string; password?: string }>({}); // State để lưu lỗi 422
  const [unauthorizedErrors, setUnauthorizedErrors] = useState(""); // State để lưu lỗi 422
  const router = useRouter();
  // const { setUser } = useAuth(); // Lấy setUser từ useAuth
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading)
      return;
    setIsLoading(true);

     // Reset lỗi trước khi gọi API
    setErrors({});
    setUnauthorizedErrors("");

    try {
      const {payload} = await patientAuthApiRequest.login({phone_number: phoneNumber, password})
      
      const { access_token, refresh_token } = payload.data;
      Cookies.set('patient_access_token', access_token);
      Cookies.set('patient_refresh_token', refresh_token);
      Cookies.set('role', "PATIENT");
      router.push('/patient/');
      toast.success("Đăng nhập thành công");
    } catch (err) {
      if (err instanceof EntityError) {
        // Xử lý lỗi 422
        const errorPayload = err.payload.details;
        const newErrors: { phone_number?: string; password?: string } = {};
        errorPayload.forEach(({ field, msg }) => {
          if (field === 'phone_number' || field === 'password') {
            newErrors[field] = msg; // Lưu lỗi theo field
          }
        });
        setErrors(newErrors); // Cập nhật state errors
      }else if (err instanceof UnauthorizedError) {
        // Xử lý lỗi 401
        setUnauthorizedErrors(err.payload.message)
      } else {
        console.error("Login failed", err);
        // alert("Sai SĐT hoặc mật khẩu!");
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
              Đăng nhập tài khoản bệnh nhân
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập SĐT và mật khẩu để đăng nhập vào hệ thống!
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
                  Số điện thoại <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Nhập Số điện thoại"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error={!!errors.phone_number} // Hiển thị trạng thái lỗi
                  hint={errors.phone_number} // Hiển thị message lỗi
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

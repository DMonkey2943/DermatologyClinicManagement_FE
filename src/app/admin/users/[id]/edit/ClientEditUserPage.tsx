"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/schemaValidations/user.schema";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload, X } from "lucide-react";
import userApiRequest from "@/apiRequests/user";
import { toast } from "sonner";
import { EntityError, HttpError } from "@/lib/axios";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";

// Environment variable for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// Extend schema to make password optional for edit
const editUserSchema = createUserSchema.omit({ password: true });

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function ClientEditUserPage({ params }: { params: { id: string } }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      username: "",
      gender: "MALE",
      role: "STAFF",
      dob: "",
    },
  });

  // Fetch user details
  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      console.log("user id from param: ", id);
      try {
        const response = await userApiRequest.getDetail(id);
        const user = response.payload.data;
        console.log(user);
        // Populate form with user data
        form.reset({
          full_name: user.full_name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          username: user.username || "",
          gender: user.gender || "MALE",
          role: user.role || "STAFF",
          dob: user.dob || "",
        });
        // Set existing avatar if available
        if (user.avatar) {
          setPreviewUrl(`${API_BASE_URL}${user.avatar}`);
        } else {
          setPreviewUrl(null);
        }   
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Không thể tải thông tin người dùng");
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, router, form]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh đại diện không được vượt quá 5MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove avatar
  const removeAvatar = () => {
    setAvatarFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: EditUserFormData) => {
    const formData = new FormData();
    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    // Append file if available
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await userApiRequest.updateWithAvatar(id, formData);
      toast.success("Cập nhật tài khoản thành công");
      router.push(`/admin/users`);
      router.refresh();
    } catch (err: any) {
      console.error("Submit error:", err);
      // Handle validation error (422)
      if (err instanceof EntityError) {
        const errorPayload = err.payload.details;
        errorPayload.forEach((item) => {
          form.setError(item.field as keyof EditUserFormData, {
            type: "manual",
            message: item.msg,
          });
        });
        toast.error("Vui lòng kiểm tra lại thông tin!");
      } else if (err instanceof HttpError) {
        if (err.status === 400) {
          toast.error(err.payload.message);
        } else if (err.status === 500) {
          toast.error("Có lỗi xảy ra, hãy thử lại sau!");
        }
      } else {
        toast.error("Đã có lỗi xảy ra");
      }
    }
  };
  
  return (
    <div>
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Chỉnh sửa tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? 'Đang tải...' : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* === Group 1: Personal Information === */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="0901234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày sinh</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "dd/MM/yyyy")
                                  ) : (
                                    <span>Chọn ngày sinh</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date.toISOString().split("T")[0]);
                                  }
                                }}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* === Group 2: Gender & Role === */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới tính</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="MALE" id="male" />
                                <label htmlFor="male" className="cursor-pointer font-normal">
                                  Nam
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FEMALE" id="female" />
                                <label htmlFor="female" className="cursor-pointer font-normal">
                                  Nữ
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vai trò</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                              <SelectItem value="STAFF">Nhân viên</SelectItem>
                              <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* === Group 3: Username === */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đăng nhập</FormLabel>
                          <FormControl>
                            <Input placeholder="username123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* === Avatar Upload === */}
                  <div className="space-y-2">
                    <FormLabel>Ảnh đại diện (tùy chọn)</FormLabel>
                    <div className="flex items-center gap-4">
                      {/* Preview */}
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border"
                          />
                          <button
                            type="button"
                            onClick={removeAvatar}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="avatar-upload"
                      />

                      {/* File select button */}
                      <div>
                        <label htmlFor="avatar-upload">
                          <Button type="button" variant="outline" asChild>
                            <span className="cursor-pointer">Chọn ảnh</span>
                          </Button>
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tối đa 5MB, định dạng ảnh
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full md:w-auto md:min-w-48"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    variant="primary"
                  >
                    {form.formState.isSubmitting ? "Đang cập nhật..." : "Cập nhật người dùng"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
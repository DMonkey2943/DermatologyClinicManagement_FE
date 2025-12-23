"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, generateSecurePassword } from "@/lib/utils";
import { CalendarIcon, RefreshCw } from "lucide-react";
import patientApiRequest from "@/apiRequests/patient";
import { toast } from "sonner";
import { EntityError, HttpError } from "@/lib/axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { EditPatientFormData, editPatientSchema, PatientFullDataType } from "@/schemaValidations/patient.schema";
import { Modal } from "@/components/ui/modal";
import { useForm as useModalForm } from "react-hook-form";

export default function ClientEditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [patientDetail, setPatientDetail] = useState<PatientFullDataType | null>(null);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

  const form = useForm<EditPatientFormData>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      full_name: "",
      dob: "",
      gender: "MALE",
      phone_number: "",
      // email: "",
      address: "",
      medical_history: "",
      allergies: "",
    },
  });

  // Modal form for creating account
  const modalForm = useModalForm<{ email: string; password: string }>({
    defaultValues: { email: "", password: "" },
  });

  
    const fetchPatient = async () => {
      try {
        const response = await patientApiRequest.getDetail(id);
        const patient = response.payload.data;
        setPatientDetail(patient);
        // console.log("Fetched patient:", patientDetail);
        form.reset({
          full_name: patient.full_name || "",
          dob: patient.dob || "",
          gender: patient.gender || "MALE",
          phone_number: patient.phone_number || "",
          // email: patient.email || "",
          address: patient.address || "",
          medical_history: patient.medical_history || "",
          allergies: patient.allergies || "",
        });
        // Fill modal email if available
        // modalForm.setValue("email", patient.email || "");
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Không thể tải thông tin bệnh nhân");
        router.push("/admin/patients");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    setIsLoading(true);
    fetchPatient();
    // eslint-disable-next-line
  }, [id, router, form]);

  const onSubmit = async (data: EditPatientFormData) => {
    try {
      await patientApiRequest.update(id, data);
      toast.success("Cập nhật bệnh nhân thành công");
      router.push("/admin/patients");
      router.refresh();
    } catch (err: any) {
      console.error("Submit error:", err);
      if (err instanceof EntityError) {
        const errorPayload = err.payload.details;
        errorPayload.forEach((item) => {
          form.setError(item.field as keyof EditPatientFormData, {
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

  const handleOpenModal = () => {
    setShowCreateAccountModal(true);
    modalForm.setValue("email", patientDetail?.email || "");
  }

  const handleCloseModal = () => {
    if (!modalForm.formState.isSubmitting) {
      setShowCreateAccountModal(false);      
    }
  };

  // Modal submit handler
  const handleCreateAccount = async (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      if (!data.email) modalForm.setError("email", { type: "manual", message: "Email không được để trống" });
      if (!data.password) modalForm.setError("password", { type: "manual", message: "Mật khẩu không được để trống" });
      return;
    }
    try {
      await patientApiRequest.update(id, { email: data.email, password: data.password });
      toast.success("Tạo tài khoản bệnh nhân thành công");      
      fetchPatient();
      setShowCreateAccountModal(false);
    } catch (err: any) {
      toast.error("Có lỗi xảy ra, hãy thử lại!");
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cập nhật thông tin bệnh nhân</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? 'Đang tải...' : (
              <>
                {/* Nút tạo tài khoản bệnh nhân */}
                <div className="mb-4">
                  <Button
                    type="button"
                    variant="success"
                    onClick={handleOpenModal}
                  >
                    {patientDetail?.password ? (
                      "+ Tạo lại tài khoản bệnh nhân"
                    ) : (
                      "+ Tạo tài khoản bệnh nhân"
                    )}
                  </Button>
                </div>
                

                {/* Modal tạo tài khoản */}
                <Modal
                  isOpen={showCreateAccountModal}
                  onClose={handleCloseModal}                  
                  className="max-w-[584px] p-5 lg:p-10"
                >
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">
                      {patientDetail?.password ? (
                        "Tạo lại tài khoản bệnh nhân"
                      ) : (
                        "Tạo tài khoản bệnh nhân"
                      )}
                    </h2>
                      <form
                        onSubmit={modalForm.handleSubmit(handleCreateAccount)}
                        className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
                      >
                        <div className="col-span-1 sm:col-span-2">
                          <label className="block mb-1 font-medium">Email<span className="text-error-500">*</span></label>
                          <Input
                            type="email"
                            placeholder="Email"
                            {...modalForm.register("email", { required: "Email không được để trống" })}
                          />
                          {modalForm.formState.errors.email && (
                            <span className="text-sm text-red-500">{modalForm.formState.errors.email.message}</span>
                          )}
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <label className="block mb-1 font-medium">Mật khẩu<span className="text-error-500">*</span></label>
                          {/* <Input
                            type="password"
                            placeholder="Mật khẩu"
                            {...modalForm.register("password", { required: "Mật khẩu không được để trống" })}
                          /> */}
                          <div className="relative">
                            <Input
                              type="password"
                              placeholder="Mật khẩu"
                              {...modalForm.register("password", { required: "Mật khẩu không được để trống" })}
                              className="pr-12" // Để chừa chỗ cho icon
                            />
                            {/* Nút tạo mật khẩu ngẫu nhiên */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
                              onClick={() => {
                                const newPassword = generateSecurePassword(8);
                                modalForm.setValue("password", newPassword, { shouldValidate: true });
                                // Optional: hiện toast thông báo đã tạo
                                toast.success("Đã tạo mật khẩu ngẫu nhiên!");
                              }}
                              title="Tạo mật khẩu ngẫu nhiên"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          {modalForm.formState.errors.password && (
                            <span className="text-sm text-red-500">{modalForm.formState.errors.password.message}</span>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={modalForm.formState.isSubmitting}
                          variant="primary"
                        >
                          {modalForm.formState.isSubmitting ? "Đang tạo..." : "Tạo"}
                        </Button>
                      </form>
                  </div>
                </Modal>

                {/* ...existing form... */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên<span className="text-error-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại<span className="text-error-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="0901234567" {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="patient@example.com" {...field}  value={field.value as string}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới tính<span className="text-error-500">*</span></FormLabel>
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
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Ngày sinh<span className="text-error-500">*</span></FormLabel>
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
                                      const yyyy = date.getFullYear();
                                      const mm = String(date.getMonth() + 1).padStart(2, '0');
                                      const dd = String(date.getDate()).padStart(2, '0');
                                      field.onChange(`${yyyy}-${mm}-${dd}`);
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

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                              <Input placeholder="Địa chỉ" {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="medical_history"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiền sử bệnh</FormLabel>
                            <FormControl>
                              {/* changed: use Textarea instead of Input */}
                              <Textarea {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dị ứng</FormLabel>
                            <FormControl>
                              {/* changed: use Textarea instead of Input */}
                              <Textarea {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="w-full md:w-auto md:min-w-48"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                          variant="primary"
                        >
                          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </div>                    
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

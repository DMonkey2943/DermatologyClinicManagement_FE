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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import patientApiRequest from "@/apiRequests/patient";
import { toast } from "sonner";
import { EntityError, HttpError } from "@/lib/axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { EditPatientFormData, editPatientSchema } from "@/schemaValidations/patient.schema";

// const editPatientSchema = z.object({
//   full_name: z.string().min(1, "Họ tên là bắt buộc"),
//   dob: z.string().nullable().optional(),
//   gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
//   phone_number: z.string().min(1, "Số điện thoại là bắt buộc"),
//   email: z.string().email().nullable().optional(),
//   address: z.string().nullable().optional(),
//   medical_history: z.string().nullable().optional(),
//   allergies: z.string().nullable().optional(),
// });
// type EditPatientFormData = z.infer<typeof editPatientSchema>;

export default function ClientEditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditPatientFormData>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      full_name: "",
      dob: "",
      gender: "MALE",
      phone_number: "",
      email: "",
      address: "",
      medical_history: "",
      allergies: "",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchPatient = async () => {
      try {
        const response = await patientApiRequest.getDetail(id);
        const patient = response.payload.data;
        form.reset({
          full_name: patient.full_name || "",
          dob: patient.dob || "",
          gender: patient.gender || "MALE",
          phone_number: patient.phone_number || "",
          email: patient.email || "",
          address: patient.address || "",
          medical_history: patient.medical_history || "",
          allergies: patient.allergies || "",
        });
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Không thể tải thông tin bệnh nhân");
        router.push("/admin/patients");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
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

  return (
    <div>
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Chỉnh sửa bệnh nhân</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? 'Đang tải...' : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="patient@example.com" {...field} />
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input placeholder="Địa chỉ" {...field} />
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
                            <Textarea {...field} />
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
                          <FormLabel>Di ứng</FormLabel>
                          <FormControl>
                            {/* changed: use Textarea instead of Input */}
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto md:min-w-48"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    variant="primary"
                  >
                    {form.formState.isSubmitting ? "Đang cập nhật..." : "Cập nhật bệnh nhân"}
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

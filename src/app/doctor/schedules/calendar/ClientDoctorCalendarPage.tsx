"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { Calendar, Clock, User, History, Stethoscope, FileText, ExternalLink } from "lucide-react";
import { vi } from "date-fns/locale/vi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { AppointmentDataType } from "@/schemaValidations/appointment.schema";
import appointmentApiRequest from "@/apiRequests/appointment";
import medicalRecordApiRequest from "@/apiRequests/medicalRecord";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MedicalRecordDataType } from "@/schemaValidations/medicalRecord.schema";
import { formatDateTime } from "@/lib/utils";

export default function DoctorCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataType | null>(null);
  const [recentRecord, setRecentRecord] = useState<MedicalRecordDataType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);

  const today = startOfDay(new Date()); // Ngày hôm nay (00:00:00)

  const fetchAppointments = async () => {
    try {
      const { payload } = await appointmentApiRequest.getList({
        doctor_id: "9ab38764-c359-436e-9d00-5bb0c1a4b8b3",
      });
      const data = payload.data;

      if (payload.success) {
        const formattedEvents = data.map((apt: AppointmentDataType) => {
          const [hours, minutes] = apt.appointment_time.split(":");
          const startDate = new Date(apt.appointment_date);
          startDate.setHours(parseInt(hours), parseInt(minutes), 0);

          const duration = apt.time_slot === "30 phút" ? 30 : 60;
          const endDate = new Date(startDate.getTime() + duration * 60000);

          const colorMap: Record<string, string> = {
            WAITING: "#f59e0b",
            SCHEDULED: "#3b82f6",
            COMPLETED: "#10b981",
            CANCELLED: "#ef4444",
          };

          const patientName = apt.patient.full_name;

          // Kiểm tra xem lịch hẹn có trước ngày hôm nay không
          const isPast = isBefore(startDate, today);

          return {
            id: apt.id,
            title: patientName,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            backgroundColor: colorMap[apt.status] || "#6b7280",
            borderColor: colorMap[apt.status] || "#6b7280",
            textColor: "white",
            extendedProps: {
              ...apt,
              patientName,
              isPast, // thêm để dùng nếu cần
            },
            // Thêm class để style riêng cho lịch cũ
            classNames: isPast ? ["past-event"] : [],
          };
        });
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMedicalRecord = async (patient_id: string) => {
    setRecordLoading(true);
    try {
      const { payload } = await medicalRecordApiRequest.getList({
        limit: 1,
        patient_id,
      });
      if (payload.success && payload.data.length > 0) {
        setRecentRecord(payload.data[0]);
      } else {
        setRecentRecord(null);
      }
    } catch (error) {
      console.error("Lỗi lấy lịch sử khám:", error);
      setRecentRecord(null);
    } finally {
      setRecordLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEventClick = (clickInfo: any) => {
    const apt = clickInfo.event.extendedProps as AppointmentDataType;
    const startDate = clickInfo.event.start;

    // Ngăn mở Sheet nếu là lịch cũ
    if (isBefore(startDate, today)) {
      return; // Không làm gì cả
    }

    setSelectedAppointment(apt);
    setRecentRecord(null);
    fetchRecentMedicalRecord(apt.patient_id);
    setSheetOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const map = {
      WAITING: { label: "Chờ khám", color: "bg-yellow-500" },
      SCHEDULED: { label: "Đã đặt lịch", color: "bg-blue-500" },
      COMPLETED: { label: "Đã hoàn thành", color: "bg-green-500" },
      CANCELLED: { label: "Đã hủy", color: "bg-red-500" },
    };
    const item = map[status as keyof typeof map] || { label: status, color: "bg-gray-500" };
    return <Badge className={`${item.color} text-white`}>{item.label}</Badge>;
  };

  // Custom render event với strikethrough cho lịch cũ
  const eventContent = (eventInfo: any) => {
    const isPast = eventInfo.event.classNames.includes("past-event");

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`px-1.5 py-0.5 text-xs font-medium truncate cursor-pointer ${
                isPast
                  ? "line-through opacity-60 pointer-events-none"
                  : ""
              }`}
            >
              {eventInfo.timeText && (
                <span className="font-bold">{eventInfo.timeText} </span>
              )}
              <span className={isPast ? "select-none" : ""}>
                {eventInfo.event.title}
              </span>
            </div>
          </TooltipTrigger>
          {!isPast && (
            <TooltipContent>
              <p className="font-medium">{eventInfo.event.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(eventInfo.event.start!, "HH:mm")} - {eventInfo.event.extendedProps.time_slot || "30 phút"}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {/* Thêm style toàn cục cho past-event (tùy chọn, hoặc dùng inline như trên) */}
      <style jsx global>{`
        .past-event {
          opacity: 0.7 !important;
        }
        .past-event .fc-event-title {
          text-decoration: line-through;
        }
      `}</style>

      <div className="container mx-auto p-4 lg:p-8">
        <Card className="overflow-hidden border shadow-xl">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Đang tải lịch khám...</p>
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventClick={handleEventClick}
              eventContent={eventContent}
              eventDisplay="block"
              slotMinTime="11:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="00:30"
              height="auto"
              dayMaxEvents={false}
              dayMaxEventRows={false}
              moreLinkClick="popover"
              nowIndicator={true}
              editable={false}
              selectable={false}
              locale="vi"
              buttonText={{
                today: "Hôm nay",
                month: "Tháng",
                week: "Tuần",
                day: "Ngày",
              }}
              dayHeaderFormat={{ weekday: "long" }}
              eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
              slotLabelFormat={{ hour: "2-digit", minute: "2-digit" }}
              themeSystem="standard"
              contentHeight="auto"
              handleWindowResize={true}
              views={{
                dayGridMonth: {
                  titleFormat: { month: "2-digit", year: "numeric" },
                },
                timeGridWeek: {
                  titleFormat: { day: "2-digit", month: "2-digit", year: "numeric" },
                },
                timeGridDay: {
                  titleFormat: { day: "2-digit", month: "2-digit", year: "numeric" },
                },
              }}
              // Tắt interaction cho các event có class past-event
              eventClassNames={(arg) => {
                const isPast = arg.event.classNames.includes("past-event");
                return isPast ? "cursor-not-allowed" : "cursor-pointer";
              }}
            />
          )}
        </Card>

        {/* Sheet chi tiết - giữ nguyên */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selectedAppointment && (
              <>
                <SheetHeader className="mt-2 pb-4 border-b">
                  <SheetTitle className="text-2xl flex items-center gap-3">
                    <User className="w-8 h-8 text-primary" />
                    {selectedAppointment.patient.full_name}
                  </SheetTitle>
                  <SheetDescription className="mt-2">
                    {getStatusBadge(selectedAppointment.status)}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 px-2 sm:px-4">
                  {/* Phần thông tin cơ bản */}
                  <div className="space-y-2 bg-muted/30 p-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-base">
                        {format(parseISO(selectedAppointment.appointment_date), "EEEE, dd/MM/yyyy", { locale: vi })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-base">
                        {selectedAppointment.appointment_time.slice(0, 5)} • {selectedAppointment.time_slot}
                      </span>
                    </div>
                  </div>

                  {/* Phần lịch sử khám gần nhất */}
                  <div className="space-y-2 border-t pt-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" />
                      Lịch sử khám gần nhất
                    </h4>

                    {recordLoading ? (
                      <p className="text-sm text-muted-foreground">Đang tải...</p>
                    ) : recentRecord ? (
                      <Card className="p-5 bg-background border border-border shadow-sm rounded-lg">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            {/* <span className="font-medium">Ngày khám:</span> */}
                            <span className="text-muted-foreground">
                              {formatDateTime(recentRecord.created_at)}
                            </span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="font-medium">Triệu chứng:</span>
                            <span className="text-muted-foreground text-right">
                              {recentRecord.symptoms || "Không ghi nhận"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Chẩn đoán:</span>
                            <span className="text-muted-foreground text-right">
                              {recentRecord.diagnosis || "Chưa có"}
                            </span>
                          </div>
                          {recentRecord.notes && (
                            <div className="flex justify-between">
                              <span className="font-medium">Ghi chú:</span>
                              <span className="text-muted-foreground italic text-right">
                                {recentRecord.notes}
                              </span>
                            </div>
                          )} */}
                          <div>
                            <span className="font-medium">Triệu chứng:</span>{" "}
                            <span className="text-muted-foreground">
                              {recentRecord.symptoms || "Không ghi nhận"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Chẩn đoán:</span>{" "}
                            <span className="font-medium text-muted-foreground">
                              {recentRecord.diagnosis || "Chưa có"}
                            </span>
                          </div>
                          {recentRecord.notes && (
                            <div>
                              <span className="font-medium">Ghi chú:</span>{" "}
                              <span className="text-muted-foreground italic">
                                {recentRecord.notes}
                              </span>
                            </div>
                          )}
                          <div className="pt-1 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-accent hover:text-accent-foreground"
                              asChild
                            >
                              <Link href={`/doctor/medical-records/${recentRecord.id}`}>
                                Xem chi tiết <ExternalLink className="ml-1 w-3 h-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Chưa có phiên khám nào trước đây
                      </p>
                    )}
                  </div>

                  {/* Phần nút hành động */}
                  <div className="flex flex-col gap-4 pt-4 border-t">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                    >
                      <Link href={`/doctor/patients/${selectedAppointment.patient_id}`}>
                        <User className="mr-2 h-5 w-5" />
                        Xem hồ sơ bệnh nhân
                      </Link>
                    </Button>

                    {selectedAppointment.status === "WAITING" && (
                      <Button
                        size="lg"
                        className="w-full bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                        asChild
                      >
                        <Link href={`/doctor/medical-records/add/${selectedAppointment.id}`}>
                          <Stethoscope className="mr-2 h-5 w-5" />
                          Tạo phiên khám
                        </Link>
                      </Button>
                    )}

                    {selectedAppointment.status === "COMPLETED" && (
                      <Button
                        size="lg"
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                        asChild
                      >
                        <Link href={`/doctor/medical-records/${selectedAppointment.id}`}>
                          <FileText className="mr-2 h-5 w-5" />
                          Xem phiên khám
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, History, Stethoscope, FileText, ExternalLink } from "lucide-react";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MedicalRecordDataType } from "@/schemaValidations/medicalRecord.schema";
import { formatDateTime } from "@/lib/utils";

export default function DoctorCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDataType | null>(null);
  const [recentRecord, setRecentRecord] = useState<MedicalRecordDataType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);

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
            // IN_PROGRESS: "#3b82f6",
            COMPLETED: "#10b981",
            CANCELLED: "#ef4444",
          };

          const patientName = apt.patient.full_name;

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
            },
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
    setSelectedAppointment(apt);
    setRecentRecord(null);
    fetchRecentMedicalRecord(apt.patient_id);
    setSheetOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const map = {
      WAITING: { label: "Chờ khám", color: "bg-yellow-500" },
      SCHEDULED: { label: "Đã đặt lịch", color: "bg-blue-500" },
    //   IN_PROGRESS: { label: "Đang khám", color: "bg-indigo-500" },
      COMPLETED: { label: "Đã hoàn thành", color: "bg-green-500" },
      CANCELLED: { label: "Đã hủy", color: "bg-red-500" },
    };
    const item = map[status as keyof typeof map] || { label: status, color: "bg-gray-500" };
    return <Badge className={`${item.color} text-white`}>{item.label}</Badge>;
  };

  // Custom render event để truncate tên dài + tooltip
  const eventContent = (eventInfo: any) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-1.5 py-0.5 text-xs font-medium truncate cursor-pointer">
              {eventInfo.timeText && (
                <span className="font-bold">{eventInfo.timeText} </span>
              )}
              {eventInfo.event.title}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{eventInfo.event.title}</p>
            <p className="text-xs text-muted-foreground">
              {format(eventInfo.event.start!, "HH:mm")} - {eventInfo.event.extendedProps.time_slot || "30 phút"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <div className="container mx-auto p-4 lg:p-8">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-9 h-9" />
            Lịch khám của tôi
          </h1>
          <p className="text-muted-foreground mt-2">Xem và quản lý lịch hẹn với bệnh nhân</p>
        </div> */}

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
              eventContent={eventContent} // Quan trọng: truncate + tooltip
              slotMinTime="11:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="00:30"
              height="auto"
              dayMaxEvents={false} // Không giới hạn số event → cho phép scroll
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
              titleFormat={{ year: "numeric", month: "long" }}
              dayHeaderFormat={{ weekday: "long" }}
              eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
              slotLabelFormat={{ hour: "2-digit", minute: "2-digit" }}
              // Responsive & Dark mode
              themeSystem="standard"
              contentHeight="auto"
              handleWindowResize={true}
            />
          )}
        </Card>

        {/* Sheet chi tiết */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selectedAppointment && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-2xl flex items-center gap-3">
                    <User className="w-8 h-8" />
                    {selectedAppointment.patient.full_name}
                  </SheetTitle>
                  <SheetDescription>
                    {getStatusBadge(selectedAppointment.status)}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-6 px-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">
                        {format(parseISO(selectedAppointment.appointment_date), "EEEE, dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedAppointment.appointment_time.slice(0, 5)} • {selectedAppointment.time_slot}
                      </span>
                    </div>
                  </div>

                  {/* Lịch sử khám gần nhất */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Lịch sử khám gần nhất
                    </h4>

                    {recordLoading ? (
                      <p className="text-sm text-muted-foreground">Đang tải...</p>
                    ) : recentRecord ? (
                      <Card className="p-4 bg-muted/50">
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">{formatDateTime(recentRecord.created_at)}</span>    
                          </div>
                          <div>
                            <span className="font-medium">Triệu chứng:</span>{" "}
                            <span className="text-muted-foreground">
                              {recentRecord.symptoms || "Không ghi nhận"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Chẩn đoán:</span>{" "}
                            <span className="text-muted-foreground">
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
                          <div className="pt-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/doctor/medical-records/${recentRecord.id}`}>
                                Xem chi tiết phiên khám <ExternalLink className="ml-1 w-3 h-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa có phiên khám nào trước đây
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button asChild size="lg" className="w-full">
                      <Link href={`/doctor/patients/${selectedAppointment.patient_id}`}>
                        <User className="mr-2 h-5 w-5" />
                        Xem hồ sơ bệnh nhân
                      </Link>
                    </Button>

                    {selectedAppointment.status === "WAITING" && (
                      <Button size="lg" className="w-full" asChild>
                        <Link href={`/doctor/medical-records/add/${selectedAppointment.id}`}>
                          <Stethoscope className="mr-2 h-5 w-5" />
                          Tạo phiên khám
                        </Link>
                      </Button>
                    )}

                    {selectedAppointment.status === "COMPLETED" && (
                      <Button size="lg" variant="outline" className="w-full" asChild>
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
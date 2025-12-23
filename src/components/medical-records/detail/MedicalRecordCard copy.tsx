// components/medical-record/MedicalRecordCard.tsx
import { format } from "date-fns";
import { Calendar, Stethoscope, FileText, ClipboardList, AlertCircle, CheckCircle2, Clock, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MedicalRecordDataType } from "@/schemaValidations/medicalRecord.schema";
// import { MR_STATUS_LABEL_MAP } from "@/lib/utils";
import { useEffect } from "react";

interface MedicalRecordCardProps {
  medicalRecordData?: MedicalRecordDataType;
}

const statusConfig: Record<
  NonNullable<MedicalRecordDataType["status"]>,
  { label: string; icon: React.ReactNode; color: "default" | "secondary" | "destructive" | "success" | "warning" }
> = {
  IN_PROGRESS: {
    label: "Đang khám",
    icon: <Clock className="w-3.5 h-3.5" />,
    color: "warning",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "success",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: <CircleDollarSign className="w-3.5 h-3.5" />,
    color: "success",
  },
};

export default function MedicalRecordCard({ medicalRecordData }: MedicalRecordCardProps) {
  useEffect(() => {
    console.log(medicalRecordData);
  }, [medicalRecordData]);
  if (!medicalRecordData) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mb-3 opacity-50" />
          <p>Chưa có dữ liệu phiếu khám</p>
        </CardContent>
      </Card>
    );
  }

  const status = medicalRecordData.status;
  const statusInfo = status ? statusConfig[status] || { label: status, icon: null, color: "secondary" as const } : null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'tháng' MM, yyyy 'lúc' HH:mm");
    } catch {
      return "Không xác định";
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header với màu nền nhẹ theo trạng thái */}
      <CardHeader
        className={`pb-4 ${
          status === "COMPLETED"
            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
            : status === "IN_PROGRESS"
            ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
            : "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Phiếu khám bệnh</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4" />
                {formatDate(medicalRecordData.created_at)}
              </p>
            </div>
          </div>

          {statusInfo && (
            <Badge
              variant={statusInfo.color === "warning" ? "default" : statusInfo.color === "success" ? "default" : "secondary"}
              className={`w-fit font-medium ${
                statusInfo.color === "success"
                  ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300"
                  : statusInfo.color === "warning"
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
                  : ""
              }`}
            >
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Triệu chứng */}
        {medicalRecordData.symptoms && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <AlertCircle className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" />
              <span>Triệu chứng</span>
            </div>
            <div className="pl-7 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {medicalRecordData.symptoms || "Không ghi nhận"}
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Chẩn đoán */}
        {medicalRecordData.diagnosis && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <ClipboardList className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              <span>Chẩn đoán</span>
            </div>
            <div className="pl-7 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
              <p className="text-foreground font-medium leading-relaxed">
                {medicalRecordData.diagnosis || "Chưa có chẩn đoán"}
              </p>
            </div>
          </div>
        )}

        {/* Ghi chú (nếu có) */}
        {medicalRecordData.notes && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                <FileText className="w-4.5 h-4.5 text-muted-foreground" />
                <span>Ghi chú bác sĩ</span>
              </div>
              <div className="pl-7 bg-muted/50 border rounded-lg p-4">
                <p className="text-foreground/90 italic leading-relaxed">
                  {medicalRecordData.notes}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer thông tin bổ sung (tùy chọn mở rộng sau) */}
        <div className="pt-4 border-t border-dashed text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-2">
          <span>Mã phiếu: {medicalRecordData.id || "N/A"}</span>
          {medicalRecordData.doctor.full_name && <span>Bác sĩ: {medicalRecordData.doctor.full_name}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { PatientFullDataType } from "@/schemaValidations/patient.schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calendar, Heart, AlertTriangle, VenusAndMars } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  patient?: PatientFullDataType;
}

export default function PatientInfoCard({ patient }: Props) {
  if (!patient) return null;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="text-center space-y-1">
        {/* Name */}
        <p className="text-xl font-bold">{patient.full_name}</p>

        {/* Gender + DOB */}
        <div className="flex items-center justify-center gap-4 text-sm opacity-80">
          <span className="flex items-center gap-1">
            <VenusAndMars className="w-4 h-4" />
            {patient.gender === "FEMALE" ? "Nữ" : "Nam"}
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {patient.dob ? formatDate(patient.dob) : "---"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Medical Info */}
        <section>
          <h3 className="font-medium text-base mb-2">Thông tin y tế</h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Heart className="w-4 h-4 opacity-70" />
              <span>
                <span className="text-foreground font-medium">Tiền sử:</span>{" "}
                {patient.medical_history ?? "---"}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 opacity-70" />
              <span>
                <span className="text-foreground font-medium">Dị ứng:</span>{" "}
                {patient.allergies ?? "---"}
              </span>
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

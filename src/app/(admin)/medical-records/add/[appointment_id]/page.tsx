// app/medical-records/add/[appointment_id]/page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { Badge } from "@/components/ui/badge";

import PageHeader from './_component/PageHeader';
import PatientInfoCard from './_component/PatientInfoCard';
import ExaminationTab from './_component/ExaminationTab';
import PrescriptionTab from './_component/PrescriptionTab';
import ServiceTab from './_component/ServiceTab';

import appointmentApiRequest from '@/apiRequests/appointment';
import patientApiRequest from '@/apiRequests/patient';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';

import { PatientFullDataType } from '@/schemaValidations/patient.schema';
// import { PrescriptionItem, ServiceItem } from '@/types/medical-record';
import { MedicalRecordDataType } from '@/schemaValidations/medicalRecord.schema';
import { ServiceIndicationDetailDataType, ServiceItemType } from '@/schemaValidations/serviceIndication.schema';
import { PrescriptionDetailDataType, PrescriptionItemType } from '@/schemaValidations/prescription.schema';

export default function AddMedicalRecordPage() {
  const { appointment_id } = useParams();
  const router = useRouter();
  const initialized = useRef(false); // Thêm ref

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientFullDataType | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDataType | null>(null);

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  const [serviceIndicationId, setServiceIndicationId] = useState<string | null>(null);

  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItemType[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItemType[]>([]);

  const [lastSaved, setLastSaved] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  // Autosave debounce
  const debouncedSave = useCallback(
    debounce(async () => {
      if (!medicalRecord) return;
      setIsSaving(true);
      try {
        await medicalRecordApiRequest.update(medicalRecord.id, { symptoms, diagnosis, notes });
        setLastSaved(new Date().toISOString());
      } catch {
        toast.error("Lưu tạm thất bại");
      } finally {
        setIsSaving(false);
      }
    }, 10000),
    [medicalRecord, symptoms, diagnosis, notes]
  );

  useEffect(() => {
    if (medicalRecord) debouncedSave();
    return () => debouncedSave.cancel();
  }, [symptoms, diagnosis, notes, debouncedSave, medicalRecord]);

  // INIT: Load MR + đơn thuốc + chỉ định
  useEffect(() => {
    if (initialized.current) return; // Nếu đã chạy → bỏ qua
    initialized.current = true;       // Đánh dấu đã chạy

    const init = async () => {
      try {
        const { payload: apt } = await appointmentApiRequest.getDetail(appointment_id as string);
        // console.log(apt.message);
        if (apt.data.status !== 'WAITING') {
          toast.error("Lịch hẹn không hợp lệ");
          router.push('/appointments');
          return;
        }

        const { payload: pt } = await patientApiRequest.getDetail(apt.data.patient_id);
        // console.log(pt.message);
        setPatient(pt.data);

        let mr: MedicalRecordDataType;
        let prescriptionId: string | null = null;
        let serviceIndicationId: string | null = null;
        // Load medical record theo appointment_id
        try {
          const { payload: existingMR } = await medicalRecordApiRequest.getByAppointment(appointment_id as string);
          mr = existingMR.data;
          // console.log("existingMR: ", mr);
          if (mr) {
            setMedicalRecord(mr); 
            setSymptoms(mr.symptoms ?? "");
            setDiagnosis(mr.diagnosis ?? "");
            setNotes(mr.notes ?? "");  
            toast.success("Tiếp tục phiên khám chưa hoàn thành");
            // Load symptoms, diagnosis, notes từ DB
          } else {           
            // console.log("ĐÃ TẠO PHIÊN KHÁM MỚI")
            const { payload: newMr } = await medicalRecordApiRequest.create({
              appointment_id: appointment_id as string,
              patient_id: apt.data.patient_id,
              doctor_id: apt.data.doctor_id,
              symptoms: "",
              diagnosis: "",
              notes: "",
              status: "IN_PROGRESS"
            });
            // console.log(newMr.message);
            mr = newMr.data;
            setMedicalRecord(mr);
            toast.success("Tạo phiên khám mới thành công")
          }
        } catch (err) {
          console.error(err);
          toast.error("Lỗi tải phiên khám");
          throw err;
        }

        //Load đơn thuốc
        try {
          const presRes = await medicalRecordApiRequest.getPrescriptionByMRId(mr.id);
          if (presRes.payload.data !== null) {
            const presId = presRes.payload.data.id;
            prescriptionId = presId;
            const presDetails = presRes.payload.data.medications || [];
            setPrescriptionItems(presDetails.map((d: PrescriptionDetailDataType) => ({
              medication_id: d.medication_id,
              name: d.name || "Không rõ",
              dosage_form: d.dosage_form || "",
              quantity: d.quantity,
              dosage: d.dosage,
            })));            
          }
        } catch {
          console.log("Chưa có đơn thuốc");
        }

        //  Load chỉ định dịch vụ
        try {
          const servRes = await medicalRecordApiRequest.getServiceIndicationByMRId(mr.id);
          if (servRes.payload.data !== null) { 
            const servId = servRes.payload.data.id;
            serviceIndicationId = servId;
            const servDetails = servRes.payload.data.services || [];
            setServiceItems(servDetails.map((d: ServiceIndicationDetailDataType) => ({
              service_id: d.service_id,
              name: d.name || "Không rõ",
              quantity: d.quantity,
            })));
          }
        } catch {
          console.log("Chưa có chỉ định");
        }

        setPrescriptionId(prescriptionId);
        setServiceIndicationId(serviceIndicationId);

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tạo phiên khám");
        router.push('/appointments');
      }
    };
    init();
  }, [appointment_id,router]);

  const handleComplete = async () => {
    if (!medicalRecord) return;
    try {
      await medicalRecordApiRequest.update(medicalRecord.id, { status: "COMPLETED" });
      await appointmentApiRequest.update(appointment_id as string, { status: "COMPLETED" });
      toast.success("Hoàn thành phiên khám!");
      router.push(`/medical-records/${medicalRecord.id}`);
    } catch {
      toast.error("Lỗi hoàn thành");
    }
  };

  const canComplete = diagnosis.trim() !== "" && (prescriptionItems.length > 0 || serviceItems.length > 0);

  if (loading || !medicalRecord || !patient) return <div>Đang tải...</div>;

  return (
    <div className="container max-w-7xl py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <PatientInfoCard patient={patient} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <PageHeader
          patientName={patient.full_name}
          lastSaved={lastSaved}
          isSaving={isSaving}
          onComplete={handleComplete}
          canComplete={canComplete}
        />

        <Tabs defaultValue="examination">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="examination">Phiếu khám</TabsTrigger>
            <TabsTrigger value="prescription">
              Kê đơn {prescriptionItems.length > 0 && <Badge className="ml-2">{prescriptionItems.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="services">
              Dịch vụ {serviceItems.length > 0 && <Badge className="ml-2">{serviceItems.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="examination">
            <ExaminationTab
              symptoms={symptoms}
              diagnosis={diagnosis}
              notes={notes}
              onChange={(field, value) => {
                if (field === 'symptoms') setSymptoms(value);
                if (field === 'diagnosis') setDiagnosis(value);
                if (field === 'notes') setNotes(value);
              }}
            />
          </TabsContent>

          <TabsContent value="prescription">
            <PrescriptionTab
              medicalRecordId={medicalRecord.id}
              prescriptionId={prescriptionId}
              items={prescriptionItems}
              onItemsChange={setPrescriptionItems}
              onPrescriptionIdChange={setPrescriptionId}
            />
          </TabsContent>

          <TabsContent value="services">
            <ServiceTab
              medicalRecordId={medicalRecord.id}
              serviceIndicationId={serviceIndicationId}
              items={serviceItems}
              onItemsChange={setServiceItems}
              onServiceIndicationIdChange={setServiceIndicationId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
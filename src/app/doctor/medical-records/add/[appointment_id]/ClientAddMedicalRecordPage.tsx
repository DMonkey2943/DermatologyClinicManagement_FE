// app/medical-records/add/[appointment_id]/page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import PageHeader from './_component/PageHeader';
import PatientInfoCard from './_component/PatientInfoCard';
import ExaminationTab from './_component/ExaminationTab';
import PrescriptionTab from './_component/PrescriptionTab';
import ServiceTab from './_component/ServiceTab';
import SkinImagesTab from './_component/SkinImagesTab';

import appointmentApiRequest from '@/apiRequests/appointment';
import patientApiRequest from '@/apiRequests/patient';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';

import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import MedicalRecordByPatientTable from '@/components/medical-records/MedicalRecordByPatientTable';
// import { PrescriptionItem, ServiceItem } from '@/types/medical-record';
import { MedicalRecordDataType, SkinImageDataType } from '@/schemaValidations/medicalRecord.schema';
import { ServiceIndicationDetailDataType, ServiceItemType } from '@/schemaValidations/serviceIndication.schema';
import { PrescriptionDetailDataType, PrescriptionItemType } from '@/schemaValidations/prescription.schema';
import serviceIndicationApiRequest from '@/apiRequests/serviceIndication';
import prescriptionApiRequest from '@/apiRequests/prescription';

export default function ClientAddMedicalRecordPage({ params }: { params: { appointment_id: string } }) {
  const { appointment_id } = params;
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
  const [skinImages, setSkinImages] = useState<SkinImageDataType[]>([]);

  const [lastSaved, setLastSaved] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const [prescriptionDirty, setPrescriptionDirty] = useState(false);
  const [serviceDirty, setServiceDirty] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const hasUnsavedChanges = prescriptionDirty || serviceDirty;

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

        // Load skin images
        try {
          const { payload } = await medicalRecordApiRequest.getSkinImageListByMRId(mr.id);
          console.log("SKIN IMAGE: ", payload);
          setSkinImages(payload.data);
        } catch {
          console.log("Chưa có ảnh");
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

  // const handleComplete = async () => {
  //   if (!medicalRecord) return;
  //   try {
  //     await medicalRecordApiRequest.update(medicalRecord.id, { status: "COMPLETED" });
  //     await appointmentApiRequest.update(appointment_id as string, { status: "COMPLETED" });
  //     toast.success("Hoàn thành phiên khám!");
  //     router.push(`/medical-records/${medicalRecord.id}`);
  //   } catch {
  //     toast.error("Lỗi hoàn thành");
  //   }
  // };
  const finalizeExamination = async () => {
    if (!medicalRecord) return;

    try {
      // 1. Đồng bộ MR (đảm bảo autosave không bị delay)
      await medicalRecordApiRequest.update(medicalRecord.id, {
        symptoms,
        diagnosis,
        notes,
        status: "COMPLETED"
      });

      toast.success("Hoàn thành phiên khám!");
      router.push(`/medical-records/${medicalRecord.id}`);
    } catch {
      toast.error("Lỗi hoàn thành");
    }
  };
  const handleComplete = async () => {
    if (hasUnsavedChanges) {
      setShowAlert(true);
      return;
    }

    await finalizeExamination();

    await appointmentApiRequest.update(appointment_id as string, { status: "COMPLETED" });
  };

  const handleTabChange = async (newTab: string) => {
    console.log(newTab);
    // Nếu chuyển từ tab prescription và có thay đổi chưa lưu
    if (prescriptionDirty) {
      try {
        if (!prescriptionId) {
          // Tạo mới đơn thuốc
          const {payload} = await prescriptionApiRequest.create({
            medical_record_id: medicalRecord!.id,
            notes: "",
            prescription_details: prescriptionItems.map(i => ({
              medication_id: i.medication_id,
              quantity: i.quantity,
              dosage: i.dosage,
            })),
          });
          setPrescriptionId(payload.data.id);
        } else {
          // Cập nhật đơn thuốc
          await prescriptionApiRequest.update(prescriptionId, {
            notes: "",
            prescription_details: prescriptionItems.map(i => ({
              medication_id: i.medication_id,
              quantity: i.quantity, 
              dosage: i.dosage,
            })),
          });
        }
        setPrescriptionDirty(false);
        toast.success("Đã tự động lưu đơn thuốc");
      } catch {
        toast.error("Lỗi khi tự động lưu đơn thuốc");
        return; // Không cho phép chuyển tab nếu lỗi
      }
    }

    // Nếu chuyển từ tab services và có thay đổi chưa lưu
    if (serviceDirty) {
      try {
        if (!serviceIndicationId) {
          // Tạo mới phiếu chỉ định
          const {payload} = await serviceIndicationApiRequest.create({
            medical_record_id: medicalRecord!.id,
            notes: "",
            service_indication_details: serviceItems.map(i => ({
              service_id: i.service_id,
              quantity: i.quantity,
            })),
          });
          setServiceIndicationId(payload.data.id);
        } else {
          // Cập nhật phiếu chỉ định
          await serviceIndicationApiRequest.update(serviceIndicationId, {
            notes: "",
            service_indication_details: serviceItems.map(i => ({
              service_id: i.service_id,
              quantity: i.quantity,
            })),
          });
        }
        setServiceDirty(false);
        toast.success("Đã tự động lưu phiếu chỉ định");
      } catch {
        toast.error("Lỗi khi tự động lưu phiếu chỉ định");
        return; // Không cho phép chuyển tab nếu lỗi
      }
    }
  };

  const canComplete = diagnosis.trim() !== "" && (prescriptionItems.length > 0 || serviceItems.length > 0);

  if (loading || !medicalRecord || !patient) return <div>Đang tải...</div>;

  return (
    <>
      <div className="container max-w-7xl py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PatientInfoCard patient={patient} />
          <span className='p-2'>
            <MedicalRecordByPatientTable
              patient_id_props={patient.id}
            />
          </span>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PageHeader
            patientName={patient.full_name}
            lastSaved={lastSaved}
            isSaving={isSaving}
            onComplete={handleComplete}
            canComplete={canComplete}
          />

          <Tabs defaultValue="examination" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="examination">Phiếu khám</TabsTrigger>
              <TabsTrigger value="prescription">
                Kê đơn {prescriptionItems.length > 0 && <Badge className="ml-2">{prescriptionItems.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="services">
                Dịch vụ {serviceItems.length > 0 && <Badge className="ml-2">{serviceItems.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="images">
                Hình ảnh {skinImages.length > 0 && <Badge className="ml-2">{skinImages.length}</Badge>}
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
                onDirtyChange={setPrescriptionDirty}
              />
            </TabsContent>

            <TabsContent value="services">
              <ServiceTab
                medicalRecordId={medicalRecord.id}
                serviceIndicationId={serviceIndicationId}
                items={serviceItems}
                onItemsChange={setServiceItems}
                onServiceIndicationIdChange={setServiceIndicationId}
                onDirtyChange={setServiceDirty}
              />
            </TabsContent>

            <TabsContent value="images">
              <SkinImagesTab
                medicalRecordId={medicalRecord.id}
                images={skinImages}
                onImagesChange={setSkinImages}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có thay đổi chưa lưu</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn thuốc hoặc Phiếu chỉ định dịch vụ chưa được lưu. Bạn có muốn hoàn thành phiên khám?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeExamination}>
              Hoàn thành (không lưu đơn thuốc/phiếu chỉ định dịch vụ)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
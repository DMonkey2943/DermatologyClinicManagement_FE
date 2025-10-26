import React, { useState, useEffect } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Button } from '@/components/ui/button';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { toast } from "sonner";

interface MedicalRecordFormProps {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  onSuccess: (medical_record_id: string) => void;
}

export interface MedicalRecordFormData {
  symptoms: string;
  diagnosis: string;
  notes?: string;
}

export default function MedicalRecordForm({
  appointmentId,
  patientId,
  doctorId,
  onSuccess
}: MedicalRecordFormProps) {
    
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    symptoms: '',
    diagnosis: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof MedicalRecordFormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newData = {
        appointment_id: appointmentId,
        patient_id: patientId,
        doctor_id: doctorId,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        status: "IN_PROGRESS"
      };
      const { payload } = await medicalRecordApiRequest.create(newData);
      toast.success("Tạo phiên khám mới thành công");
      const mr_id = payload.data.id;
      onSuccess(mr_id); // Truyền medical_record_id lên parent
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="col-span-1 sm:col-span-2">
        <Label>Triệu chứng</Label>
        <Input
          type="text"
          value={formData.symptoms}
          onChange={(e) => handleInputChange('symptoms', e.target.value)}
          disabled={isSubmitting}
        //   error={!!errors.full_name}
        //   hint={errors.full_name}
        />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Chẩn đoán</Label>
        <Input
          type="text"
          value={formData.diagnosis}
          onChange={(e) => handleInputChange('diagnosis', e.target.value)}
          disabled={isSubmitting}
        //   error={!!errors.phone_number}
        //   hint={errors.phone_number}
        />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Label>Lời dặn của BS</Label>
        <Input
          type="text"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          disabled={isSubmitting}
        //   error={!!errors.phone_number}
        //   hint={errors.phone_number}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
          Lưu phiên khám
        </Button>
      </div>
    </div>
  )
}
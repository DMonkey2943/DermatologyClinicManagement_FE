import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import Radio from '../form/input/Radio';
import Combobox from '../form/Combobox';
import { Modal } from '@/components/ui/modal/index';
import { Appointment } from '@/types/appointment';
import { getPatients } from '@/services/patients';
import { PatientResponse } from '@/types/patient';
import { getDoctors } from '@/services/users';
import { DoctorResponse } from '@/types/user';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: AppointmentFormData) => Promise<void>;
  editingAppointment: Appointment | null;
  modalType: 'add' | 'edit' | null;
}

export interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  // created_by?: string;
  appointment_date: string | null;
  time_slot: string;
  status: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED' | null;
}

export default function AppointmentFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingAppointment, 
  modalType 
}: AppointmentFormModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: '',
    doctor_id: '',
    appointment_date: null,
    time_slot: '',
    status: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          getPatients(),
          getDoctors(),
        ]);
        // console.log('Patients:', patientsData);
        // console.log('Doctors:', doctorsData);
        setPatients(patientsData);
        setDoctors(doctorsData);

        // Cập nhật formData sau khi dữ liệu đã tải
        if (modalType === 'edit' && editingAppointment) {
          // console.log("Editing appointment", editingAppointment);
          setFormData({
            patient_id: editingAppointment.patient_id || '',
            doctor_id: editingAppointment.doctor_id || '',
            // created_by: editingAppointment.created_by || '',
            appointment_date: editingAppointment.appointment_date || null,
            time_slot: editingAppointment.time_slot || '',
            status: editingAppointment.status || null,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [modalType, editingAppointment]);

  // useEffect(() => {
  //   console.log("formData appointment", formData);
  // }, [formData]);

  const handleInputChange = (field: keyof AppointmentFormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const { patient_id, doctor_id, appointment_date, time_slot, status } = formData;
    return !!(patient_id && doctor_id && appointment_date && time_slot && status);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
    setFormData({
      patient_id: '',
      doctor_id: '',
      // created_by: '',
      appointment_date: null,
      time_slot: '',
      status: null,
    });
  };

  // Convert fetched data to Combobox options
  const patientOptions = patients.map(patient => ({
    value: patient.id,
    label: patient.full_name,
  }));

  const doctorOptions = doctors.map(doctor => ({
    value: doctor.user.id,
    label: doctor.user.full_name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {modalType === 'add' ? 'Thêm lịch hẹn mới' : 'Chỉnh sửa lịch hẹn'}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Bệnh nhân</Label>
            <Combobox
              options={patientOptions}
              placeholder="Chọn bệnh nhân..."
              onChange={(value) => handleInputChange('patient_id', value)}
              defaultValue={formData.patient_id}
            />
          </div>

          <div className="col-span-1">
            <Label>Bác sĩ</Label>
            <Combobox
              options={doctorOptions}
              placeholder="Chọn bác sĩ..."
              onChange={(value) => handleInputChange('doctor_id', value)}
              defaultValue={formData.doctor_id}
            />
          </div>
          <div className="col-span-1">
            <DatePicker
              id="dob"
              label="Ngày hẹn khám"
              defaultDate={formData.appointment_date}
              onChange={(dates, currentDateString) => handleInputChange('appointment_date', currentDateString)}
              placeholder="Chọn ngày hẹn"
            />
          </div>
          <div className="col-span-1">
            <Label>Thời gian khám</Label>
            <Input
              type="text"
              value={formData.time_slot}
              onChange={(e) => handleInputChange('time_slot', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Trạng thái</Label>
            <div className="flex gap-4">
              <Radio
                id="status-scheduled"
                name="status"
                value="SCHEDULED"
                checked={formData.status === 'SCHEDULED'}
                label="Đã lên lịch"
                onChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              />
              <Radio
                id="status-waiting"
                name="status"
                value="WAITING"
                checked={formData.status === 'WAITING'}
                label="Đang chờ"
                onChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              />
              <Radio
                id="status-completed"
                name="status"
                value="COMPLETED"
                checked={formData.status === 'COMPLETED'}
                label="Hoàn thành"
                onChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              />
              <Radio
                id="status-cancelled"
                name="status"
                value="CANCELLED"
                checked={formData.status === 'CANCELLED'}
                label="Hủy bỏ"
                onChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Huỷ
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
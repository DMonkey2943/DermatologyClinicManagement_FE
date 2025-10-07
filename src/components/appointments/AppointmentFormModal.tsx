import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import Radio from '../form/input/Radio';
import Combobox from '../form/Combobox';
import { Modal } from '@/components/ui/modal/index';
import { AppointmentDataType } from '@/schemaValidations/appointment.schema';
import appointmentApiRequest from '@/apiRequests/appointment';
import userApiRequest from '@/apiRequests/user';
import patientApiRequest from '@/apiRequests/patient';
import { EntityError } from '@/lib/axios';
import { DoctorDataType } from '@/schemaValidations/user.schema';
import { PatientDataType } from '@/schemaValidations/patient.schema';
import { useAuth } from '@/context/AuthContext';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAppointment: AppointmentDataType | null;
  modalType: 'add' | 'edit' | null;
}

export interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  // created_by?: string;
  appointment_date: string | null;
  appointment_time: string | null;
  // time_slot: string;
  status: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED' | null;
}

export interface ValidationErrors {
  patient_id?: string;
  doctor_id?: string;
  appointment_date?: string;
  appointment_time?: string;
  time_slot?: string;
  status?: string;
  _form?: string;
}

export default function AppointmentFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingAppointment, 
  modalType 
}: AppointmentFormModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: '',
    doctor_id: '',
    appointment_date: null,
    appointment_time: null,
    // time_slot: '',
    status: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<PatientDataType[]>([]);
  const [doctors, setDoctors] = useState<DoctorDataType[]>([]);
  const { user } = useAuth();
  const [errors, setErrors] = useState<ValidationErrors>({}); // State để lưu lỗi 422

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          patientApiRequest.getList(),
          userApiRequest.getDoctorList(),
        ]);

        const patientList = patientsRes.payload.data;
        const doctorList = doctorsRes.payload.data;
        // console.log('Patients:', patientList);
        // console.log('Doctors:', doctorList);
        setPatients(patientList);
        setDoctors(doctorList);

        // Cập nhật formData sau khi dữ liệu đã tải
        if (modalType === 'edit' && editingAppointment) {
          // console.log("Editing appointment", editingAppointment);
          setFormData({
            patient_id: editingAppointment.patient_id || '',
            doctor_id: editingAppointment.doctor_id || '',
            // created_by: editingAppointment.created_by || '',
            appointment_date: editingAppointment.appointment_date || null,
            appointment_time: editingAppointment.appointment_time || null,
            // time_slot: editingAppointment.time_slot || '',
            status: editingAppointment.status || 'SCHEDULED',
          });
        } else if (modalType === 'add') {
          setFormData({
            patient_id:'',
            doctor_id: '',
            // created_by: editingAppointment.created_by || '',
            appointment_date: null,
            appointment_time: '11:00',
            // time_slot: '',
            status: 'SCHEDULED',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    setErrors({});
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

  const handleSubmit = async () => {
    setErrors({});

    const validationErrors: ValidationErrors = {};

    // Validate formData
    (Object.keys(formData) as (keyof AppointmentFormData)[]).forEach((field) => {
      const value = formData[field];
      if (value === null || value === '') {
        validationErrors[field] = 'Không được để trống';
      }
    });

    // Nếu có lỗi validate, setErrors và dừng submit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);    

    try {
      if (modalType === 'edit' && editingAppointment) {
        const updateData = {
          doctor_id: formData.doctor_id,
          appointment_date: formData.appointment_date!,
          appointment_time: formData.appointment_time!,
          time_slot: "30 phút",
          status: formData.status!,
        }
        await appointmentApiRequest.update(editingAppointment.id, updateData);
      } else if (modalType === 'add') {
        const newData = {
          patient_id: formData.patient_id,
          doctor_id: formData.doctor_id,
          created_by: user!.id,
          appointment_date: formData.appointment_date!,
          appointment_time: formData.appointment_time!,
          time_slot: "30 phút",
          status: formData.status || 'SCHEDULED',
        }
        await appointmentApiRequest.create(newData);
      }

      // Thành công
      onSuccess();
    } catch (err: any) {
      console.error('Error submitting form:', err);

      if (err instanceof EntityError) {
        const errorPayload = err.payload.details;
        const validationErrors: ValidationErrors = {};
        errorPayload.forEach(({ field, msg }) => {
          validationErrors[field] = msg;
        });
        setErrors(validationErrors);
      } else {
        // Lỗi khác
        setErrors({ 
          _form: err.payload?.message || 'Có lỗi xảy ra, vui lòng thử lại' 
        });
      }
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
      appointment_time: null,
      // time_slot: '',
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
              error={!!errors.patient_id}
              hint={errors.patient_id}
            />
          </div>

          <div className="col-span-1">
            <Label>Bác sĩ</Label>
            <Combobox
              options={doctorOptions}
              placeholder="Chọn bác sĩ..."
              onChange={(value) => handleInputChange('doctor_id', value)}
              defaultValue={formData.doctor_id}
              error={!!errors.doctor_id}
              hint={errors.doctor_id}
            />
          </div>
          <div className="col-span-1">
            <DatePicker
              id="dob"
              label="Ngày hẹn khám"
              defaultDate={formData.appointment_date}
              onChange={(dates, currentDateString) => handleInputChange('appointment_date', currentDateString)}
              placeholder="Chọn ngày hẹn"
              error={!!errors.appointment_date}
              hint={errors.appointment_date}
            />
          </div>
          <div className="col-span-1">
            <Label>Thời gian khám</Label>
            <Input
              type="time"
              value={formData.appointment_time}
              onChange={(e) => handleInputChange('appointment_time', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.appointment_time}
              hint={errors.appointment_time}
            />
          </div>
          {/* <div className="col-span-1">
            <Label>Thời gian khám</Label>
            <Input
              type="text"
              value={formData.time_slot}
              onChange={(e) => handleInputChange('time_slot', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.time_slot}
              hint={errors.time_slot}
            />
          </div> */}
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
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import Radio from '../form/input/Radio';
import { Modal } from '@/components/ui/modal/index';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';
import patientApiRequest from '@/apiRequests/patient';
import { EntityError } from '@/lib/axios';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPatient: PatientFullDataType | null;
  modalType: 'add' | 'edit' | null;
}

export interface PatientFormData {
  full_name: string;
  phone_number: string;
  dob?: string | null; // Changed to string | null for YYYY-MM-DD format
  gender?: 'MALE' | 'FEMALE' | null;
  email?: string;
  address?: string;
  medical_history?: string;
  allergies?: string;
}

export interface ValidationErrors {
  full_name?: string;
  phone_number?: string;
  email?: string;
  dob?: string;
  gender?: string;
  address?: string;
  medical_history?: string;
  allergies?: string;
  _form?: string;
}

export default function PatientFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingPatient, 
  modalType 
}: PatientFormModalProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    full_name: '',
    phone_number: '',
    dob: null,
    gender: null,
    email: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({}); // State để lưu lỗi 422

  useEffect(() => {
    if (modalType === 'edit' && editingPatient) {
      console.log("Editing patient", editingPatient);
      setFormData({
        full_name: editingPatient.full_name || '',
        phone_number: editingPatient.phone_number || '',
        gender: editingPatient.gender || null,
        dob: editingPatient.dob || null,
        email: editingPatient.email || '',
        address: editingPatient.address || '',
        medical_history: editingPatient.medical_history || '',
        allergies: editingPatient.allergies || '',
      });
    } else if (modalType === 'add') {
      setFormData({
        full_name: '',
        phone_number: '',
        dob: null,
        gender: 'MALE',
        email: '',
        address: '',
        medical_history: '',
        allergies: '',
      });
    }
    setErrors({});
  }, [modalType, editingPatient]);

  const handleInputChange = (field: keyof PatientFormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

   const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      if (modalType === 'edit' && editingPatient) {
        const updateData = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
          ...(formData.email && { email: formData.email }),
          medical_history: formData.medical_history,
          allergies: formData.allergies,
        };
        await patientApiRequest.update(editingPatient.id, updateData);
      } else if(modalType === 'add') {
        const newData = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
          ...(formData.email && { email: formData.email }),
          medical_history: formData.medical_history,
          allergies: formData.allergies,
        };
        await patientApiRequest.create(newData);
      }

      // Thành công
      onSuccess();
    } catch (err: any) {
      console.error('Submit error:', err);
      
      // Xử lý lỗi 422 (validation error)
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
      full_name: '',
      phone_number: '',
      dob: null,
      gender: null,
      email: '',
      address: '',
      allergies: '',
      medical_history: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {modalType === 'add' ? 'Thêm bệnh nhân mới' : 'Chỉnh sửa bệnh nhân'}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Tên</Label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.full_name}
              hint={errors.full_name}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>SĐT</Label>
            <Input
              type="text"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.phone_number}
              hint={errors.phone_number}
            />
          </div>
          <div className="col-span-1">
            <Label>Giới tính</Label>
            <div className="flex gap-4 pt-3">
              <Radio
                id="gender-male"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                label="Nam"
                onChange={(value) => handleInputChange('gender', value)}
                disabled={isSubmitting}
              />
              <Radio
                id="gender-female"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                label="Nữ"
                onChange={(value) => handleInputChange('gender', value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="col-span-1">
            <DatePicker
              id="dob"
              label="Ngày sinh"
              defaultDate={formData.dob}
              maxDate={new Date()} // Ngày hiện tại
              onChange={(dates, currentDateString) => handleInputChange('dob', currentDateString)}
              placeholder="Chọn ngày sinh"
              error={!!errors.dob}
              hint={errors.dob}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.email}
              hint={errors.email}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Địa chỉ</Label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.address}
              hint={errors.address}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Tiền sử bệnh lý</Label>
            <Input
              type="text"
              value={formData.medical_history}
              onChange={(e) => handleInputChange('medical_history', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.medical_history}
              hint={errors.medical_history}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Dị ứng</Label>
            <Input
              type="text"
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.allergies}
              hint={errors.allergies}
            />
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
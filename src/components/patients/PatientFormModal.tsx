import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import Radio from '../form/input/Radio';
import { Modal } from '@/components/ui/modal/index';
import { Patient } from '@/types/patient';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: PatientFormData) => Promise<void>;
  editingPatient: Patient | null;
  modalType: 'add' | 'edit' | null;
}

export interface PatientFormData {
  full_name: string;
  phone_number: string;
  dob?: string | null; // Changed to string | null for YYYY-MM-DD format
  gender?: 'MALE' | 'FEMALE' | null;
  email?: string;
  address?: string;
}

export default function PatientFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
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
      });
    } else if (modalType === 'add') {
      setFormData({
        full_name: '',
        phone_number: '',
        dob: null,
        gender: null,
        email: '',
        address: '',
      });
    }
  }, [modalType, editingPatient]);

  const handleInputChange = (field: keyof PatientFormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const { full_name, phone_number } = formData;
    
    if (modalType === 'add') {
      return !!(full_name && phone_number);
    } else {
      return !!(full_name && phone_number);
    }
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
      full_name: '',
      phone_number: '',
      dob: null,
      gender: null,
      email: '',
      address: '',
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
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>SĐT</Label>
            <Input
              type="text"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1">
            <DatePicker
              id="dob"
              label="Ngày sinh"
              defaultDate={formData.dob}
              onChange={(dates, currentDateString) => handleInputChange('dob', currentDateString)}
              placeholder="Chọn ngày sinh"
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
          <div className="col-span-1 sm:col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Địa chỉ</Label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={isSubmitting}
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
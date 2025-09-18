import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal/index';
import { User } from '@/types/user';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => Promise<void>;
  editingUser: User | null;
  modalType: 'add' | 'edit' | null;
}

export interface UserFormData {
  username: string;
  password?: string;
  full_name: string;
  email: string;
  phone_number: string;
}

export default function UserFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingUser, 
  modalType 
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    full_name: '',
    email: '',
    phone_number: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalType === 'edit' && editingUser) {
      setFormData({
        username: editingUser.username || '',
        full_name: editingUser.full_name || '',
        email: editingUser.email || '',
        phone_number: editingUser.phone_number || '',
      });
    } else if (modalType === 'add') {
      setFormData({
        username: '',
        password: '',
        full_name: '',
        email: '',
        phone_number: '',
      });
    }
  }, [modalType, editingUser]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const { username, full_name, email, phone_number, password } = formData;
    
    if (modalType === 'add') {
      return !!(username && password && full_name && email && phone_number);
    } else {
      return !!(username && full_name && email && phone_number);
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
      username: '',
      password: '',
      full_name: '',
      email: '',
      phone_number: '',
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
          {modalType === 'add' ? 'Thêm User mới' : 'Chỉnh sửa User'}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Họ tên</Label>
            <Input
              type="text"
              defaultValue={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              defaultValue={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>SĐT</Label>
            <Input
              type="text"
              defaultValue={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1">
            <Label>Username</Label>
            <Input
              type="text"
              defaultValue={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {modalType === 'add' && (
            <div className="col-span-1">
              <Label>Mật khẩu</Label>
              <Input
                type="password"
                defaultValue={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
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
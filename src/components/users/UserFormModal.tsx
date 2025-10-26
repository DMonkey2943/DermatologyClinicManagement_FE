import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal/index';
import { UserDataType } from '@/schemaValidations/user.schema';
import userApiRequest from '@/apiRequests/user';
import { EntityError } from '@/lib/axios';
import { toast } from "sonner";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser: UserDataType | null;
  modalType: 'add' | 'edit' | null;
}

export interface UserFormData {
  username: string;
  password?: string;
  full_name: string;
  email: string;
  phone_number: string;
}

export interface ValidationErrors {
  username?: string;
  password?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  _form?: string;
}

export default function UserFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
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
  const [errors, setErrors] = useState<ValidationErrors>({}); // State để lưu lỗi 422

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
    setErrors({});
  }, [modalType, editingUser]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

   const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      if (modalType === 'edit' && editingUser) {
        // Sửa user - không gửi password nếu rỗng
        const updateData = {
          email: formData.email,
          username: formData.username,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        };
        await userApiRequest.update(editingUser.id, updateData);
        toast.success("Cập nhật tài khoản thành công");
      } else if(modalType === 'add') {
        // Thêm mới user - bắt buộc phải có password
        await userApiRequest.create({
          email: formData.email,
          username: formData.username,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          password: formData.password,
          role: "STAFF",
        });        
        toast.success("Thêm tài khoản mới thành công");
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
        toast.error("Hãy kiểm tra lại dữ liệu trước khi Lưu!");
      } else {
        // Lỗi khác
        setErrors({ 
          _form: err.payload?.message || 'Có lỗi xảy ra, vui lòng thử lại' 
        });
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
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

        {/* Form-level error */}
        {errors._form && (
          <div>
            <p className="mt-1 text-md text-error-500">{errors._form}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Họ tên</Label>
            <Input
              type="text"
              defaultValue={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.full_name}
              hint={errors.full_name}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              defaultValue={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.email}
              hint={errors.email}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>SĐT</Label>
            <Input
              type="text"
              defaultValue={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.phone_number}
              hint={errors.phone_number}
            />
          </div>
          <div className="col-span-1">
            <Label>Username</Label>
            <Input
              type="text"
              defaultValue={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.username}
              hint={errors.username}
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
                error={!!errors.password}
                hint={errors.password}
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
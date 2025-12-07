import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal/index';
// import { Service } from '@/types/service';
import { ServiceDataType } from '@/schemaValidations/service.schema';
import serviceApiRequest from '@/apiRequests/service';
import { EntityError } from '@/lib/axios';
import { toast } from "sonner";
import TextArea from '@/components/form/input/TextArea';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingService: ServiceDataType | null;
  modalType: 'add' | 'edit' | null;
}

export interface ServiceFormData {
  name: string;
  price: number;
  description?: string;
}

export interface ValidationErrors {
  name?: string;
  price?: string;
  description?: string;
  _form?: string;
}

export default function ServiceFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingService, 
  modalType 
}: ServiceFormModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    price: 0,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({}); // State để lưu lỗi 422

  useEffect(() => {
    if (modalType === 'edit' && editingService) {
      // console.log(editingService);
      setFormData({
        name: editingService.name || '',
        price: editingService.price || 0,
        description: editingService.description || '',
      });
    } else if (modalType === 'add') {
      setFormData({
        name: '',
        price: 0,
        description: '',
      });
    }
    setErrors({});
  }, [modalType, editingService]);

  const handleInputChange = (field: keyof ServiceFormData, value: string|number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
    });
  }

  const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      if (modalType === 'edit' && editingService) {
        const updateData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
        }
        await serviceApiRequest.update(editingService.id, updateData);
        toast.success("Cập nhật dịch vụ thành công");
      } else if (modalType === 'add') {
        const newData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
        }
        await serviceApiRequest.create(newData);
        toast.success("Thêm dịch vụ mới thành công");
      }

      // Thành công
      resetFormData();
      onSuccess();
    } catch (err: any) {
      console.error('Error submitting form:', err);

      if (err instanceof EntityError) {
        const errorPayload = err.payload.details;
        const validationErrors: ValidationErrors = {};
        errorPayload.forEach(({ field, msg }) => {
          validationErrors[field as keyof ValidationErrors] = msg;
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
    resetFormData();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {modalType === 'add' ? 'Thêm dịch vụ mới' : 'Chỉnh sửa dịch vụ'}
        </h2>

        {/* Form-level error */}
        {errors._form && (
          <div>
            <p className="mt-1 text-md text-error-500">{errors._form}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Tên dịch vụ</Label>
            <Input
              type="text"
              defaultValue={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.name}
              hint={errors.name}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Giá</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.price}
              hint={errors.price}
              step={10000}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Mô tả</Label>
            <TextArea
              placeholder="Nhập mô tả về dịch vụ..."
              rows={2}
              value={formData.description || ''}
              onChange={(value) => handleInputChange('description', value)}
              disabled={isSubmitting}
              error={!!errors.description}
              hint={errors.description}
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
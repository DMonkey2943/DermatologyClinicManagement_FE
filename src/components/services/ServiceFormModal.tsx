import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal/index';
import { Service } from '@/types/service';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: ServiceFormData) => Promise<void>;
  editingService: Service | null;
  modalType: 'add' | 'edit' | null;
}

export interface ServiceFormData {
  name: string;
  price: number;
  description?: string;
}

export default function ServiceFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingService, 
  modalType 
}: ServiceFormModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    price: 0,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [modalType, editingService]);

  const handleInputChange = (field: keyof ServiceFormData, value: string|number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const { name, price } = formData;
    
    if (modalType === 'add') {
      return !!(name && price);
    } else {
      return !!(name && price);
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
      name: '',
      price: 0,
      description: '',
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
          {modalType === 'add' ? 'Thêm dịch vụ mới' : 'Chỉnh sửa dịch vụ'}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Tên dịch vụ</Label>
            <Input
              type="text"
              defaultValue={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Giá</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Mô tả</Label>
            <Input
              type="text"
              defaultValue={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
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
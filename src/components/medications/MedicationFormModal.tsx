import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal/index';
// import { User } from '@/types/user';
import { Medication } from '@/types/medication';

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: MedicationFormData) => Promise<void>;
  editingMedication: Medication | null;
  modalType: 'add' | 'edit' | null;
}

export interface MedicationFormData {
  name: string;
  dosage_form: string;
  price: number;
  stock_quantity: number;
  description?: string;
}

export default function MedicationFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingMedication, 
  modalType 
}: MedicationFormModalProps) {
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    dosage_form: '',
    price: 0,
    stock_quantity: 0,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalType === 'edit' && editingMedication) {
      // console.log(editingMedication);
      setFormData({
        name: editingMedication.name || '',
        dosage_form: editingMedication.dosage_form || '',
        price: editingMedication.price || 0,
        stock_quantity: editingMedication.stock_quantity || 0,
        description: editingMedication.description || '',
      });
    } else if (modalType === 'add') {
      setFormData({
        name: '',
        dosage_form: '',
        price: 0,
        stock_quantity: 0,
        description: '',
      });
    }
  }, [modalType, editingMedication]);

  const handleInputChange = (field: keyof MedicationFormData, value: string|number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const { name, dosage_form, price, stock_quantity } = formData;
    
    if (modalType === 'add') {
      return !!(name && dosage_form && price && stock_quantity);
    } else {
      return !!(name && dosage_form && price && stock_quantity);
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
      dosage_form: '',
      price: 0,
      stock_quantity: 0,
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
          {modalType === 'add' ? 'Thêm thuốc mới' : 'Chỉnh sửa thuốc'}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Tên thuốc</Label>
            <Input
              type="text"
              defaultValue={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Dạng thuốc</Label>
            <Input
              type="text"
              defaultValue={formData.dosage_form}
              onChange={(e) => handleInputChange('dosage_form', e.target.value)}
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
          <div className="col-span-1">
            <Label>Giá bán</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1">
            <Label>Số lượng tồn kho</Label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
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
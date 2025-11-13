import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal/index';
import { MedicationDataType } from '@/schemaValidations/medication.schema';
import medicationApiRequest from '@/apiRequests/medication';
import { EntityError } from '@/lib/axios';
import { toast } from "sonner";

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingMedication: MedicationDataType | null;
  modalType: 'add' | 'edit' | null;
}

export interface MedicationFormData {
  name: string;
  dosage_form: string;
  price: number;
  stock_quantity: number;
  description?: string;
}

export interface ValidationErrors {
  name?: string;
  dosage_form?: string;
  price?: string;
  stock_quantity?: string;
  description?: string;
  _form?: string;
}

export default function MedicationFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
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
  const [errors, setErrors] = useState<ValidationErrors>({}); // State để lưu lỗi 422

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
    setErrors({});
  }, [modalType, editingMedication]);

  const handleInputChange = (field: keyof MedicationFormData, value: string|number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };  

  const resetFormData = () => {
    setFormData({
      name: '',
      dosage_form: '',
      price: 0,
      stock_quantity: 0,
      description: '',
    });
  }

  const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      if (modalType === 'edit' && editingMedication) {
        const updateData = {
          name: formData.name,
          dosage_form: formData.dosage_form,
          price: formData.price,
          stock_quantity: formData.stock_quantity,
          description: formData.description,
        }
        await medicationApiRequest.update(editingMedication.id, updateData);
        toast.success("Cập nhật thuốc thành công");
      } else if (modalType === 'add') {
        const newData = {
          name: formData.name,
          dosage_form: formData.dosage_form,
          price: formData.price,
          stock_quantity: formData.stock_quantity,
          description: formData.description,
        }
        await medicationApiRequest.create(newData);
        toast.success("Thêm thuốc mới thành công");
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
          {modalType === 'add' ? 'Thêm thuốc mới' : 'Chỉnh sửa thuốc'}
        </h2>

        {/* Form-level error */}
        {errors._form && (
          <div>
            <p className="mt-1 text-md text-error-500">{errors._form}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Tên thuốc</Label>
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
            <Label>Dạng thuốc</Label>
            <Input
              type="text"
              defaultValue={formData.dosage_form}
              onChange={(e) => handleInputChange('dosage_form', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.dosage_form}
              hint={errors.dosage_form}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Mô tả</Label>
            <Input
              type="text"
              defaultValue={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.description}
              hint={errors.description}
            />
          </div>
          <div className="col-span-1">
            <Label>Giá bán</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.price}
              hint={errors.price}
            />
          </div>
          <div className="col-span-1">
            <Label>Số lượng tồn kho</Label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.stock_quantity}
              hint={errors.stock_quantity}
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
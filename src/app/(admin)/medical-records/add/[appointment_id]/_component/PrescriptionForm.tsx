import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MedicationDataType } from '@/schemaValidations/medication.schema';
import medicationApiRequest from '@/apiRequests/medication';
import prescriptionApiRequest from '@/apiRequests/prescription';
import { toast } from 'sonner';

// Dữ liệu mẫu danh sách thuốc
// const medicineList = [
//   { id: 1, name: 'Paracetamol 500mg', dosage_form: 'Viên', category: 'Giảm đau, hạ sốt' },
//   { id: 2, name: 'Amoxicillin 500mg', dosage_form: 'Viên', category: 'Kháng sinh' },
//   { id: 3, name: 'Cetirizine 10mg', dosage_form: 'Viên', category: 'Kháng histamin' },
//   { id: 4, name: 'Betamethasone cream 0.1%', dosage_form: 'Tuýp', category: 'Corticosteroid bôi' },
//   { id: 5, name: 'Clindamycin gel 1%', dosage_form: 'Tuýp', category: 'Kháng sinh bôi' },
//   { id: 6, name: 'Vitamin E 400IU', dosage_form: 'Viên', category: 'Vitamin' },
//   { id: 7, name: 'Hydrocortisone cream 1%', dosage_form: 'Tuýp', category: 'Corticosteroid bôi' },
//   { id: 8, name: 'Doxycycline 100mg', dosage_form: 'Viên', category: 'Kháng sinh' },
//   { id: 9, name: 'Adapalene gel 0.1%', dosage_form: 'Tuýp', category: 'Điều trị mụn' },
//   { id: 10, name: 'Tretinoin cream 0.025%', dosage_form: 'Tuýp', category: 'Điều trị mụn' },
// ];

interface PrescriptionFormProps {
  medicalRecordId: string;
}

export interface PerscriptionItem {
  id?: string;
  medication_id: string;
  name: string;
  dosage_form: string;
  quantity: number;
  dosage: string
}

export default function PrescriptionForm({medicalRecordId}: PrescriptionFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicationDataType | null>(null);
  const [quantity, setQuantity] = useState('');
  const [dosage, setDosage] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<PerscriptionItem[]>([]);
  const [error, setError] = useState('');
  const [medications, setMedications] = useState<MedicationDataType[]>([]);  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
      fetchMedications();
  }, []);
  
  const fetchMedications = async () => {
    try {
      const {payload} = await medicationApiRequest.getList();
      const medicationList = payload.data
      console.log(medicationList);
      setMedications(medicationList);
    } catch (error) {
      console.error('Lỗi lấy danh sách Medications:', error);
    }
  };
    
  const handleSelectMedicine = (medicine: MedicationDataType) => {
    setSelectedMedicine(medicine);
    setOpen(false);
    setError('');
  };

  const handleAddMedicine = () => {
    // Validate
    if (!selectedMedicine) {
      setError('Vui lòng chọn thuốc');
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Vui lòng nhập số lượng hợp lệ');
      return;
    }
    if (!dosage.trim()) {
      setError('Vui lòng nhập cách dùng');
      return;
    }

    // Check if medicine already exists
    const exists = prescriptionItems.find(item => item.medication_id === selectedMedicine.id);
    if (exists) {
      setError('Thuốc này đã được thêm vào đơn');
      return;
    }

    // Add to prescription
    const newItem = {
      id: Date.now(), // Temporary ID
      medication_id: selectedMedicine.id,
      name: selectedMedicine.name,
      quantity: parseFloat(quantity),
      dosage_form: selectedMedicine.dosage_form,
      dosage: dosage.trim(),
    };

    setPrescriptionItems([...prescriptionItems, newItem]);

    // Reset form
    setSelectedMedicine(null);
    setQuantity('');
    setDosage('');
    setError('');
  };

  const handleRemoveMedicine = (id: string) => {
    setPrescriptionItems(prescriptionItems.filter(item => item.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddMedicine();
    }
  };

  const submitPrescription = async () => {    
    setIsSubmitting(true);
    const prescription_details = prescriptionItems.map((item) => {
      return {
        medication_id: item.medication_id,
        quantity: item.quantity,
        dosage: item.dosage
      }
    })
    console.log(prescription_details);

    try {
      const { payload } = await prescriptionApiRequest.create({
        medical_record_id: medicalRecordId,
        notes: '',
        prescription_details: prescription_details
      });  
      console.log(payload.data);
      toast.success("Kê đơn thuốc thành công");
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {      
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kê Đơn Thuốc</h2>

      {/* Form thêm thuốc */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Combobox chọn thuốc */}
          <div className="md:col-span-4">
            <Label htmlFor="medicine" className="mb-2 block">
              Tên thuốc <span className="text-red-500">*</span>
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {selectedMedicine
                      ? selectedMedicine.name
                      : "Tìm kiếm thuốc..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm kiếm thuốc..." />
                  <CommandEmpty>Không tìm thấy thuốc.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {medications.map((medicine) => (
                      <CommandItem
                        key={medicine.id}
                        value={medicine.name}
                        onSelect={() => handleSelectMedicine(medicine)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedMedicine?.id === medicine.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{medicine.name}</span>
                          {/* <span className="text-xs text-gray-500">{medicine.category}</span> */}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Số lượng */}
          <div className="md:col-span-2">
            <Label htmlFor="quantity" className="mb-2 block">
              Số lượng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="0"
            />
          </div>

          {/* Đơn vị tính */}
          <div className="md:col-span-2">
            <Label htmlFor="dosage_form" className="mb-2 block">
              Đơn vị
            </Label>
            <Input
              id="dosage_form"
              value={selectedMedicine?.dosage_form || ''}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Cách dùng */}
          <div className="md:col-span-3">
            <Label htmlFor="dosage" className="mb-2 block">
              Cách dùng <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="VD: Uống 2 lần/ngày, sáng chiều sau ăn"
              className="resize-none h-10"
              rows={1}
            />
          </div>

          {/* Nút Add */}
          <div className="md:col-span-1 flex items-end">
            <Button
              onClick={handleAddMedicine}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Danh sách thuốc đã kê */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Danh sách thuốc đã kê ({prescriptionItems.length})
        </h3>
        
        {prescriptionItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Chưa có thuốc nào được thêm vào đơn
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead className="w-24 text-center">Số lượng</TableHead>
                  <TableHead className="w-24 text-center">Đơn vị</TableHead>
                  <TableHead className="w-80">Cách dùng</TableHead>
                  <TableHead className="w-20 text-center">Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptionItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.dosage_form}</TableCell>
                    <TableCell className="text-sm">{item.dosage}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMedicine(item.id!)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {prescriptionItems.length > 0 && (
        <div className="mt-6 flex justify-end gap-3">
          {/* <Button variant="outline" onClick={() => setPrescriptionItems([])}>
            Xóa tất cả
          </Button> */}
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting} onClick={submitPrescription}>
            Lưu đơn thuốc
          </Button>
        </div>
      )}
    </div>
  );
}
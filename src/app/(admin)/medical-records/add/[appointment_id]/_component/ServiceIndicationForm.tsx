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
import { ServiceIndicationData } from '@/schemaValidations/serviceIndication.schema';
import { ServiceDataType } from '@/schemaValidations/service.schema';
import serviceApiRequest from '@/apiRequests/service';
import serviceIndicationApiRequest from '@/apiRequests/serviceIndication';

interface ServiceIndicationFormProps {
  medicalRecordId: string;
}

export interface ServiceIndicationItem {
  id?: string;
  service_id: string;
  name: string;
  quantity: number;
}

export default function ServiceIndicationForm({medicalRecordId}: ServiceIndicationFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDataType | null>(null);
  const [quantity, setQuantity] = useState('1');
  // const [dosage, setDosage] = useState('');
  const [serviceIndicationItems, setServiceIndicationItems] = useState<ServiceIndicationItem[]>([]);
  const [error, setError] = useState('');
  const [services, setServices] = useState<ServiceDataType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
      fetchServices();
  }, []);
  
  const fetchServices = async () => {
    try {
      const {payload} = await serviceApiRequest.getList();
      const serviceList = payload.data
      console.log(serviceList);
      setServices(serviceList);
    } catch (error) {
      console.error('Lỗi lấy danh sách Services:', error);
    }
  };
    
  const handleSelectService = (service: ServiceDataType) => {
    setSelectedService(service);
    setOpen(false);
    setError('');
  };

  const handleAddService = () => {
    // Validate
    if (!selectedService) {
      setError('Vui lòng chọn dịch vụ');
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Vui lòng nhập số lượng hợp lệ');
      return;
    }

    // Check if service already exists
    const exists = serviceIndicationItems.find(item => item.service_id === selectedService.id);
    if (exists) {
      setError('Dịch vụ này đã được chỉ định');
      return;
    }

    // Add to prescription
    const newItem = {
      id: Date.now(), // Temporary ID
      service_id: selectedService.id,
      name: selectedService.name,
      quantity: parseFloat(quantity),
    };

    setServiceIndicationItems([...serviceIndicationItems, newItem]);

    // Reset form
    setSelectedService(null);
    setQuantity('');
    // setDosage('');
    setError('');
  };

  const handleRemoveService = (id: string) => {
    setServiceIndicationItems(serviceIndicationItems.filter(item => item.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddService();
    }
  };

  const submitServiceIndication = async () => {
    setIsSubmitting(true);
    const service_indication_details = serviceIndicationItems.map((item) => {
      return {
        service_id: item.service_id,
        quantity: item.quantity
      }
    })
    console.log(service_indication_details);

    try {
      const { payload } = await serviceIndicationApiRequest.create({
        medical_record_id: medicalRecordId,
        notes: '',
        service_indication_details: service_indication_details
      });
  
      console.log(payload.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉ định dịch vụ</h2>

      {/* Form thêm dịch vụ */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Combobox chọn dịch vụ */}
          <div className="md:col-span-4">
            <Label htmlFor="service" className="mb-2 block">
              Tên dịch vụ <span className="text-red-500">*</span>
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
                    {selectedService
                      ? selectedService.name
                      : "Tìm kiếm dịch vụ..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm kiếm dịch vụ..." />
                  <CommandEmpty>Không tìm thấy dịch vụ.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {services.map((service) => (
                      <CommandItem
                        key={service.id}
                        value={service.name}
                        onSelect={() => handleSelectService(service)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedService?.id === service.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          {/* <span className="text-xs text-gray-500">{service.category}</span> */}
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
              value={'Gói'}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Cách dùng */}
          {/* <div className="md:col-span-3">
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
          </div> */}

          {/* Nút Add */}
          <div className="md:col-span-1 flex items-end">
            <Button
              onClick={handleAddService}
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

      {/* Danh sách dịch vụ đã kê */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Danh sách dịch vụ đã chỉ định ({serviceIndicationItems.length})
        </h3>
        
        {serviceIndicationItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Chưa có dịch vụ nào được chỉ định
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Tên dịch vụ</TableHead>
                  <TableHead className="w-24 text-center">Số lượng</TableHead>
                  <TableHead className="w-24 text-center">Đơn vị</TableHead>
                  {/* <TableHead className="w-80">Cách dùng</TableHead> */}
                  <TableHead className="w-20 text-center">Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceIndicationItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{'Gói'}</TableCell>
                    {/* <TableCell className="text-sm">{item.dosage}</TableCell> */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveService(item.id!)}
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
      {serviceIndicationItems.length > 0 && (
        <div className="mt-6 flex justify-end gap-3">
          {/* <Button variant="outline" onClick={() => setServiceIndicationItems([])}>
            Xóa tất cả
          </Button> */}
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting} onClick={submitServiceIndication}>
            Lưu phiếu
          </Button>
        </div>
      )}
    </div>
  );
}
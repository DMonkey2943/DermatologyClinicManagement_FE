// components/PrescriptionTab.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MedicationDataType } from "@/schemaValidations/medication.schema";
import medicationApiRequest from "@/apiRequests/medication";
import prescriptionApiRequest from "@/apiRequests/prescription";
import { toast } from "sonner";
import { PrescriptionItemType } from "@/schemaValidations/prescription.schema";

interface Props {
  medicalRecordId: string;
  prescriptionId: string | null;
  items: PrescriptionItemType[];
  onItemsChange: (items: PrescriptionItemType[]) => void;
  onPrescriptionIdChange: (id: string | null) => void;
  onDirtyChange: (dirty: boolean) => void; // Mới
}

export default function PrescriptionTab({ medicalRecordId, prescriptionId, items, onItemsChange, onPrescriptionIdChange, onDirtyChange }: Props) {
  const [medications, setMedications] = useState<MedicationDataType[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MedicationDataType | null>(null);
  const [quantity, setQuantity] = useState("");
  const [dosage, setDosage] = useState("");
  const [error, setError] = useState("");
  const [initialItems, setInitialItems] = useState<PrescriptionItemType[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    medicationApiRequest.getList().then(res => setMedications(res.payload.data));
  }, []);
  
  // Lưu initialItems khi load lần đầu
  useEffect(() => {
    if (items.length > 0 && initialItems.length === 0) {
      setInitialItems([...items]);
    }
  }, [prescriptionId, items, initialItems]);
  
  // Kiểm tra thay đổi
  const hasChanges = useMemo(() => {
    if (!prescriptionId) return items.length > 0;
    if (items.length !== initialItems.length) return true;
    return !items.every((item, i) =>
      item.medication_id === initialItems[i].medication_id &&
      item.quantity === initialItems[i].quantity &&
      item.dosage === initialItems[i].dosage
    );
  }, [items, initialItems, prescriptionId]);
    
  useEffect(() => {
    setIsDirty(hasChanges);
  }, [hasChanges]);

    useEffect(() => {
        onDirtyChange(hasChanges);
    }, [hasChanges, onDirtyChange]);

  const handleAdd = () => {
    if (!selected || !quantity || !dosage) {
      setError("Vui lòng nhập đầy đủ");
      return;
    }

    if (Number(quantity) <= 0) {
      setError(`Số lượng không hợp lệ`);
      return;
    }

    if (Number(quantity) > selected.stock_quantity) {
      setError(`Số lượng vượt quá tồn kho (${selected.stock_quantity})`);
      return;
    }

    if (items.find(i => i.medication_id === selected.id)) {
      setError("Thuốc đã được thêm");
      return;
    }

    const newItem: PrescriptionItemType = {
      medication_id: selected.id,
      name: selected.name,
      dosage_form: selected.dosage_form,
      quantity: Number(quantity),
      dosage,
    };
    onItemsChange([...items, newItem]);
    setSelected(null); setQuantity(""); setDosage(""); setError("");
  };

  const handleSave = async () => {
    try {
        if (!prescriptionId) {
            // Chưa có → tạo mới
            const {payload} = await prescriptionApiRequest.create({
            medical_record_id: medicalRecordId,
            notes: "",
            prescription_details: items.map(i => ({
                medication_id: i.medication_id,
                quantity: i.quantity,
                dosage: i.dosage,
            })),
            });
            onPrescriptionIdChange(payload.data.id);
            toast.success("Lưu đơn thuốc thành công");        
        } else {
            // Đã có → cập nhật (backend xóa + tạo lại)
            await prescriptionApiRequest.update(prescriptionId!, {
            notes: "",
            prescription_details: items.map(i => ({
                medication_id: i.medication_id,
                quantity: i.quantity,
                dosage: i.dosage,
            })),
            });
            toast.success("Cập nhật đơn thuốc thành công");
        }
      
      setInitialItems([...items]); // Cập nhật initial
      setIsDirty(false);
      onDirtyChange(false); // Đánh dấu sạch
    } catch {
      toast.error("Lỗi lưu đơn thuốc");
    //   console.error(err);
    }
  };

  const getButtonText = () => {
    if (!prescriptionId) return "Tạo mới";
    if (isDirty) return "Cập nhật";
    return "Đã lưu";
  };
  
  const isButtonDisabled = !prescriptionId && items.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              <span
                className="max-w-[250px] truncate" // Giới hạn chiều rộng và cắt ngắn
                title={selected?.name || "Chọn thuốc..."} // Hiển thị toàn bộ tên khi hover
              >
                {selected?.name || "Chọn thuốc..."}
              </span>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Tìm thuốc..." />
              <CommandEmpty>Không tìm thấy</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {medications.map(m => (
                  <CommandItem
                    key={m.id}
                    onSelect={() => {
                      setSelected(m);
                      setOpen(false);
                      setError(""); // reset lỗi khi chọn thuốc khác
                    }}
                    className="flex flex-col items-start py-2"
                  >
                    <div className="flex items-center">
                      <Check
                        className={`mr-2 h-4 w-4 ${selected?.id === m.id ? "opacity-100" : "opacity-0"}`}
                      />
                      <span>{m.name}</span>
                    </div>

                    {/* Tồn kho */}
                    <span className="text-xs opacity-70 ml-6">
                      Tồn kho: {m.stock_quantity}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          placeholder="SL"
          type="number"
          value={quantity}
          onChange={e => {
            setQuantity(e.target.value);
            if (selected && Number(e.target.value) <= selected.stock_quantity) {
              setError("");
            }
          }}
          className="w-20"
        />
        <Textarea placeholder="Cách dùng" value={dosage} onChange={e => setDosage(e.target.value)} className="flex-1" rows={1} />
        <Button onClick={handleAdd} size="icon" variant="primary"><Plus /></Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thuốc</TableHead>
            <TableHead className="w-24">SL</TableHead>
            {/* <TableHead>Cách dùng</TableHead> */}
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs opacity-80 mt-1">{item.dosage}</span>
                </div>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              {/* <TableCell>{item.dosage}</TableCell> */}
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => onItemsChange(items.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {items.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isButtonDisabled || !isDirty}
            variant={isDirty ? "default" : "secondary"}
            className={isDirty ? "animate-pulse" : ""}
          >
            {getButtonText()} <Badge className="ml-2">{items.length}</Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
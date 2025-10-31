// components/ServiceTab.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ServiceDataType } from "@/schemaValidations/service.schema";
import serviceApiRequest from "@/apiRequests/service";
import serviceIndicationApiRequest from "@/apiRequests/serviceIndication";
import { toast } from "sonner";
// import { ServiceItem } from "@/types/medical-record";
import { ServiceItemType } from "@/schemaValidations/serviceIndication.schema";

interface Props {
  medicalRecordId: string;
  serviceIndicationId: string | null;
  items: ServiceItemType[];
  onItemsChange: (items: ServiceItemType[]) => void;
  onServiceIndicationIdChange: (id: string | null) => void;
  onDirtyChange: (dirty: boolean) => void; // Mới
}

export default function ServiceTab({ medicalRecordId, serviceIndicationId, items, onItemsChange, onServiceIndicationIdChange, onDirtyChange }: Props) {
  const [services, setServices] = useState<ServiceDataType[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ServiceDataType | null>(null);
  const [quantity, setQuantity] = useState("1");
//   const [isSaved, setIsSaved] = useState(items.length > 0);
  const [initialItems, setInitialItems] = useState<ServiceItemType[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    serviceApiRequest.getList().then(res => setServices(res.payload.data));
  }, []);
  
  // Lưu initialItems khi load lần đầu
  useEffect(() => {
    if (items.length > 0 && initialItems.length === 0) {
      setInitialItems([...items]);
    }
  }, [serviceIndicationId, items, initialItems]);
    
  const hasChanges = useMemo(() => {
    if (!serviceIndicationId) return items.length > 0;
    if (items.length !== initialItems.length) return true;
    return !items.every((item, i) =>
      item.service_id === initialItems[i].service_id &&
      item.quantity === initialItems[i].quantity
    );
  }, [items, initialItems, serviceIndicationId]);

  useEffect(() => setIsDirty(hasChanges), [hasChanges]);

    useEffect(() => {
        onDirtyChange(hasChanges);
    }, [hasChanges, onDirtyChange]);

  const handleAdd = () => {
    if (!selected || !quantity) return;
    if (items.find(i => i.service_id === selected.id)) return;

    onItemsChange([...items, { service_id: selected.id, name: selected.name, quantity: Number(quantity) }]);
    setSelected(null); setQuantity("1");    
    // setIsSaved(false);
  };

  const handleSave = async () => {
    try {
        // if (isSaved) {
        if (!serviceIndicationId) {
            // Chưa có → tạo mới
            const {payload} = await serviceIndicationApiRequest.create({
                medical_record_id: medicalRecordId,
                notes: "",
                service_indication_details: items.map(i => ({
                    service_id: i.service_id,
                    quantity: i.quantity,
                })),
            });
            onServiceIndicationIdChange(payload.data.id);
            toast.success("Lưu phiếu chỉ định thành công");
        } else {
            // Đã có → cập nhật (backend xóa + tạo lại)            
            await serviceIndicationApiRequest.update(serviceIndicationId!, {
            notes: "",
            service_indication_details: items.map(i => ({
                service_id: i.service_id,
                quantity: i.quantity,
            })),
            });
            toast.success("Cập nhật phiếu chỉ định thành công");
        }
        // setIsSaved(true);
        setInitialItems([...items]);  // Cập nhật initial
        setIsDirty(false);
        onDirtyChange(false); // Đánh dấu sạch
    } catch {
      toast.error("Lỗi lưu chỉ định");      
    //   console.error(err);
    }
  };
  
  const getButtonText = () => {
    if (!serviceIndicationId) return "Tạo mới";
    if (isDirty) return "Cập nhật";
    return "Đã lưu";
  };
  
  const isButtonDisabled = !serviceIndicationId && items.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              {selected?.name || "Chọn dịch vụ..."} <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Tìm dịch vụ..." />
              <CommandEmpty>Không tìm thấy</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {services.map(s => (
                  <CommandItem key={s.id} onSelect={() => { setSelected(s); setOpen(false); }}>
                    <Check className={`mr-2 h-4 w-4 ${selected?.id === s.id ? "opacity-100" : "opacity-0"}`} />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input placeholder="SL" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-20" />
        <Button onClick={handleAdd} size="icon"><Plus /></Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dịch vụ</TableHead>
            <TableHead className="w-24">SL</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
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
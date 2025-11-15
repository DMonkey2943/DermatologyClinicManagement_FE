// components/ExaminationTab.tsx
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  symptoms: string;
  diagnosis: string;
  notes: string;
  onChange: (field: 'symptoms' | 'diagnosis' | 'notes', value: string) => void;
}

export default function ExaminationTab({ symptoms, diagnosis, notes, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Triệu chứng</Label>
        <Textarea
          placeholder="Mô tả triệu chứng..."
          value={symptoms}
          onChange={(e) => onChange('symptoms', e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <Label>Chẩn đoán</Label>
        <Textarea
          placeholder="Chẩn đoán bệnh..."
          value={diagnosis}
          onChange={(e) => onChange('diagnosis', e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label>Lời dặn bác sĩ</Label>
        <Textarea
          placeholder="Hướng dẫn dùng thuốc, tái khám..."
          value={notes}
          onChange={(e) => onChange('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
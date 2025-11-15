// components/PageHeader.tsx
import { Button } from "@/components/ui/button";
import DraftStatus from "./DraftStatus";

interface Props {
  patientName: string;
  lastSaved?: string;
  isSaving?: boolean;
  onComplete: () => void;
  canComplete: boolean;
}

export default function PageHeader({ patientName, lastSaved, isSaving, onComplete, canComplete }: Props) {
  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Phiếu khám - {patientName}</h1>
          <p className="text-sm text-muted-foreground">Tạo phiên khám bệnh</p>
        </div>
        <div className="flex items-center gap-3">
          <DraftStatus lastSaved={lastSaved} isSaving={isSaving} />
          <Button onClick={onComplete} disabled={!canComplete || isSaving}>
            Hoàn thành phiên khám
          </Button>
        </div>
      </div>
    </div>
  );
}
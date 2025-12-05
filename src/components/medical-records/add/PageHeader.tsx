// components/PageHeader.tsx
import { Button } from "@/components/ui/button";
import DraftStatus from "./DraftStatus";
import { ClipboardCheck } from "lucide-react";

interface Props {
  // patientName: string;
  lastSaved?: string;
  isSaving?: boolean;
  onComplete: () => void;
  canComplete: boolean;
}

export default function PageHeader({ lastSaved, isSaving, onComplete, canComplete }: Props) {
  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tạo phiên khám bệnh mới</h1>
          {/* <p className="text-sm text-muted-foreground">Tạo phiên khám bệnh</p> */}
        </div>
        <div className="flex items-center gap-3">
          <DraftStatus lastSaved={lastSaved} isSaving={isSaving} />
          <Button onClick={onComplete} disabled={!canComplete || isSaving} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600">
            <ClipboardCheck className="w-4 h-4" />
            <span>Hoàn thành phiên khám</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
// components/DraftStatus.tsx
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Props {
  lastSaved?: string;
  isSaving?: boolean;
}

export default function DraftStatus({ lastSaved, isSaving }: Props) {
  if (!lastSaved) return null;

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {isSaving ? "Đang lưu..." : `Lưu tạm ${formatDistanceToNow(new Date(lastSaved), { addSuffix: true, locale: vi })}`}
    </Badge>
  );
}
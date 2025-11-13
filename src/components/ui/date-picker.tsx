"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {Label} from "@/components/ui/label"; // Giả sử bạn có component Label từ ShadcnUI hoặc tương tự

type DateOption = string | Date;

interface DatePickerProps {
  id?: string;
  value?: Date;
  onSelect?: (date?: Date) => void;
  defaultDate?: DateOption | null;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: boolean;
  disabled?: boolean;
  maxDate?: DateOption | null;
  minDate?: DateOption | null;
  className?: string;
}

export function DatePicker({
  id,
  value,
  onSelect,
  defaultDate,
  label,
  placeholder = "Chọn ngày",
  hint,
  error = false,
  disabled = false,
  maxDate = null,
  minDate = null,
  className,
}: DatePickerProps) {
  // Xử lý giá trị ban đầu từ defaultDate
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ?? (defaultDate ? new Date(defaultDate) : undefined)
  );

  // Đồng bộ value từ prop với state nội bộ
  React.useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  // Xây dựng chuỗi lớp CSS cho button
  const buttonClasses = cn(
    "w-full justify-start text-left font-normal h-11 rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs",
    !selectedDate && "text-muted-foreground",
    disabled
      ? "text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      : error
      ? "text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500"
      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800",
    className
  );

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={buttonClasses}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd/MM/yyyy") // Định dạng hiển thị giống altFormat cũ
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              onSelect?.(date);
            }}
            disabled={disabled}
            fromDate={minDate ? new Date(minDate) : undefined}
            toDate={maxDate ? new Date(maxDate) : undefined}
          />
        </PopoverContent>
      </Popover>

      {hint && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            error
              ? "text-error-500"
              : "text-gray-500" // Không cần success vì prop cũ không dùng
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
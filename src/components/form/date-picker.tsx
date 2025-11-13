"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import type { Hook, DateOption } from "flatpickr/dist/types/options";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption | null | string;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  maxDate?: string | Date | null;
  minDate?: string | Date | null;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  hint,
  error = false,
  success = false,
  disabled = false,
  maxDate = null,
  minDate = null,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const instance = (flatpickr as any)(inputRef.current, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d", // định dạng lưu (gửi API)
      altInput: true, // hiển thị dạng khác trên UI
      altFormat: "d/m/Y", // định dạng hiển thị (VD: 07/10/2025)
      defaultDate,
      maxDate,
      minDate,
      onChange: (selectedDates: any, dateStr: string, fpInstance: any) => {
        if (onChange) {
          if (Array.isArray(onChange)) {
            onChange.forEach((hook) => hook(selectedDates, dateStr, fpInstance));
          } else {
            onChange(selectedDates, dateStr, fpInstance);
          }
        }
      },
    });

    return () => {
      instance.destroy();
    };
  }, [mode, onChange, defaultDate, maxDate, minDate]);

  // CSS lớp cho input
  let inputClasses =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

  if (disabled) {
    inputClasses +=
      " text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  } else if (error) {
    inputClasses +=
      " text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500";
  } else if (success) {
    inputClasses +=
      " text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500";
  } else {
    inputClasses +=
      " bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";
  }

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

'use client';

import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm...",
  className = "",
  ariaLabel = "search",
}, ref) => {
  return (
    <div className="relative w-full max-w-xs">
      {/* Magnifying glass on left */}
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={["pl-9 pr-8", className].filter(Boolean).join(" ")}
        aria-label={ariaLabel}
      />

      {/* Inline clear "X" */}
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-2 flex items-center"
        >
          <svg className="h-4 w-4 text-gray-500 hover:text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M10 8.586L15.657 2.93a1 1 0 111.414 1.414L11.414 10l5.657 5.657a1 1 0 01-1.414 1.414L10 11.414l-5.657 5.657a1 1 0 01-1.414-1.414L8.586 10 2.93 4.343A1 1 0 014.343 2.93L10 8.586z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;

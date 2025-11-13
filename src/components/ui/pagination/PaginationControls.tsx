'use client';

import React from 'react';
import Button from '@/components/ui/button/Button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number; // Trang hiện tại (zero-based)
  pageSize: number; // Số lượng mục trên mỗi trang
  total: number; // Tổng số bản ghi
  onPageChange: (newPage: number) => void; // Callback khi thay đổi trang
  onPageSizeChange?: (newSize: number) => void; // Callback khi thay đổi pageSize (tùy chọn)
  pageSizeOptions?: number[]; // Danh sách tùy chọn pageSize
}

export default function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100], // Giá trị mặc định
}: PaginationControlsProps) {
  // Tính tổng số trang
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-gray-100 dark:border-white/[0.03]">
      {/* Thông tin hiển thị */}
      <div className="text-theme-sm text-gray-600 dark:text-gray-400">
        {total === 0 ? (
          <>Không có bản ghi</>
        ) : (
          <>Hiển thị {startItem}-{endItem} / {total}</>
        )}
      </div>

      {/* Controls: previous / next và pageSize select */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page <= 0}
          >
            {/* Prev */}
            <ChevronsLeft/>
          </Button>
          <div className="flex items-center px-2">
            <span className="text-theme-sm text-gray-600 dark:text-gray-400">
              Trang {Math.min(page + 1, totalPages)} / {totalPages}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            {/* Next */}
            <ChevronsRight/>
          </Button>
        </div>

        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border px-2 py-1 text-theme-sm bg-white dark:bg-black/20"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
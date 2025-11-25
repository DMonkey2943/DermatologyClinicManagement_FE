import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}


// Helper function to format date
export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  // const hours = String(date.getHours()).padStart(2, '0');
  // const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Tạo đường dẫn với tiền tố dựa trên role của người dùng
 * @param basePath Đường dẫn cơ bản (ví dụ: "/patients/123")
 * @param role Role của người dùng (ví dụ: "ADMIN", "DOCTOR", "STAFF")
 * @returns Đường dẫn đầy đủ với tiền tố (ví dụ: "/admin/patients/123")
 */
export const getPrefixedPath = (basePath: string, role: string | undefined): string => {
  if (!role) return basePath; // Không thêm tiền tố cho Dashboard hoặc nếu không có role
  const prefix = role.toLowerCase(); // Chuyển role thành chữ thường: admin, doctor, staff
  return `/${prefix}${basePath}`;
};
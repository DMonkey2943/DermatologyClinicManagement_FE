import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UseFormSetError } from 'react-hook-form'
import { EntityError } from '@/lib/http'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
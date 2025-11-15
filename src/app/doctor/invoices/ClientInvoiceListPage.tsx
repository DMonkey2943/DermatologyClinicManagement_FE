'use client';

import React, { useEffect, useState } from 'react';
// import Button from '@/components/ui/button/Button';
import { InvoiceDataType } from '@/schemaValidations/invoice.schema';
import invoiceApiRequest from '@/apiRequests/invoice';
import InvoiceTable from '@/components/invoices/InvoiceTable';

export default function ClientInvoiceListPage() {
  const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
    
  // Thêm state phân trang
  const [page, setPage] = useState<number>(0); // zero-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const {payload} = await invoiceApiRequest.getList();
      const data = payload.data;
      console.log(data);
      setInvoices(data);

      const totalFromPayload =  payload.meta?.total;
      setTotal(Number(totalFromPayload) || data.length);

      // Nếu trang hiện tại vượt quá tổng trang sau khi cập nhật total => đưa về trang cuối cùng hợp lệ
      const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || data.length) / pageSize));
      if (page > totalPages - 1) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách hóa đơn:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  // Handlers phân trang được truyền xuống UserTable
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0); // quay về trang đầu khi thay đổi pageSize
  };

  return (
    <>
      <InvoiceTable 
        invoices={invoices} 
        isLoading={isLoading}
        // Truyền props phân trang vào UserTable
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
// import Button from '@/components/ui/button/Button';
import { InvoiceDataType } from '@/schemaValidations/invoice.schema';
import invoiceApiRequest from '@/apiRequests/invoice';
import InvoiceTable from '@/components/invoices/InvoiceTable';

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<InvoiceDataType[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const {payload} = await invoiceApiRequest.getList();
      const data = payload.data;
      console.log(data);
      setInvoices(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách hóa đơn:', error);
    }
  };

  return (
    <div>
      
      <PageBreadcrumb pageTitle="Danh sách hóa đơn" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách hóa đơn">
          <InvoiceTable 
            invoices={invoices} 
          />
        </ComponentCard>
      </div>
    </div>
  );
}
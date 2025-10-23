import http from "@/lib/axios"
import { CreateInvoiceBodyType, InvoiceFullResType, InvoiceListResType, InvoiceResType } from "@/schemaValidations/invoice.schema";


const prefix = 'invoices';

const invoiceApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<InvoiceListResType>(`/${prefix}/`, { params }),

    getDetail: (id: string) => http.get<InvoiceFullResType>(`/${prefix}/${id}`),

    create: (body: CreateInvoiceBodyType) => http.post<InvoiceResType>(`/${prefix}/`, body),
};

export default invoiceApiRequest;
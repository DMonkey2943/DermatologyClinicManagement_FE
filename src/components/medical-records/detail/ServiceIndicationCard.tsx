import React, { useState, useEffect } from 'react';
// import Label from '@/components/form/Label';
// import Input from '@/components/form/input/InputField';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ServiceIndicationFullDataType } from '@/schemaValidations/serviceIndication.schema';

interface ServiceIndicationCardProps {
  medicalRecordId: string;
}

export default function ServiceIndicationCard({
  medicalRecordId
}: ServiceIndicationCardProps) {    
    const [serviceIndication, setServiceIndication] = useState<ServiceIndicationFullDataType | null>();

    useEffect(() => {
        fetchServiceIndication(medicalRecordId);
    }, [medicalRecordId]);

    const fetchServiceIndication = async (medical_record_id: string) => {
        try {
            const {payload} = await medicalRecordApiRequest.getServiceIndicationByMRId(medical_record_id);
            const data = payload.data;
            console.log(data);
            setServiceIndication(data);
        } catch (error) {
            console.error('Lỗi lấy thông tin phiếu chỉ định dịch vụ:', error);
        }
    };

  return (
    <div className="max-w-6xl mx-auto rounded-lg">
      {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Đơn thuốc ({prescription?.medications.length})
        </h3> */}
        
        {(!serviceIndication || !serviceIndication.services) ? (
          <div className="text-center py-2 text-muted-foreground">
            Không có phiếu chỉ định dịch vụ
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Tên dịch vụ</TableHead>
                  <TableHead className="w-24 text-center">Số lượng</TableHead>
                  <TableHead className="w-24 text-center">Đơn vị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceIndication.services.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          {/* <span className="text-xs text-gray-500">{item.dosage}</span> */}
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">Gói</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
    </div>
  )
}
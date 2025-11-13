import React, { useState, useEffect } from 'react';
// import Label from '@/components/form/Label';
// import Input from '@/components/form/input/InputField';
import medicalRecordApiRequest from '@/apiRequests/medicalRecord';
import { PrescriptionFullDataType } from '@/schemaValidations/prescription.schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PrescriptionCardProps {
  medicalRecordId: string;
}

export default function PrescriptionCard({
  medicalRecordId
}: PrescriptionCardProps) {    
    const [prescription, setPrescription] = useState<PrescriptionFullDataType | null>();

    useEffect(() => {
        fetchPrescription(medicalRecordId);
    }, [medicalRecordId]);

    const fetchPrescription = async (medical_record_id: string) => {
        try {
            const {payload} = await medicalRecordApiRequest.getPrescriptionByMRId(medical_record_id);
            const data = payload.data;
            console.log(data);
            setPrescription(data);
        } catch (error) {
            console.error('Lỗi lấy thông tin đơn thuốc:', error);
        }
    };

  return (
    <div className="max-w-6xl mx-auto rounded-lg">
      {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Đơn thuốc ({prescription?.medications.length})
        </h3> */}
        
        {(!prescription || !prescription.medications) ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Không có đơn thuốc
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead className="w-24 text-center">Số lượng</TableHead>
                  <TableHead className="w-24 text-center">Đơn vị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.dosage}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.dosage_form}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
    </div>
  )
}
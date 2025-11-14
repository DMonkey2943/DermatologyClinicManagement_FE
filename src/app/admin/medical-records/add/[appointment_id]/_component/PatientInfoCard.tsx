// components/PatientInfoCard.tsx
import { PatientFullDataType } from "@/schemaValidations/patient.schema";

interface Props {
  patient?: PatientFullDataType;
}

export default function PatientInfoCard({ patient }: Props) {
  if (!patient) return null;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="text-center">
        <p className="text-lg font-semibold">{patient.full_name}</p>
      </div>
      <div>
        <h6 className="font-medium">Thông tin cá nhân</h6>
        <p className="text-sm">Giới tính: {patient.gender === 'FEMALE' ? 'Nữ' : 'Nam'}</p>
        <p className="text-sm">Ngày sinh: {patient.dob ?? '---'}</p>
        <p className="text-sm">SĐT: {patient.phone_number ?? '---'}</p>
        <p className="text-sm">Email: {patient.email ?? '---'}</p>
        <p className="text-sm">Địa chỉ: {patient.address ?? '---'}</p>
      </div>
      <div>
        <h6 className="font-medium">Thông tin y tế</h6>
        <p className="text-sm">Tiền sử: {patient.medical_history ?? '---'}</p>
        <p className="text-sm">Dị ứng: {patient.allergies ?? '---'}</p>
        <p className="text-sm">Thuốc đang dùng: {patient.current_medications ?? '---'}</p>
      </div>
    </div>
  );
}
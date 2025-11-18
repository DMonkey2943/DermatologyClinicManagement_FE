// src/app/(patients)/patient/layout.tsx
import { PatientAuthProvider } from '@/context/PatientAuthContext';
// import PatientSidebar from '@/components/patient/PatientSidebar';

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PatientAuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar cho bệnh nhân */}
        {/* <PatientSidebar /> */}

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* <PatientHeader /> */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </PatientAuthProvider>
  );
}
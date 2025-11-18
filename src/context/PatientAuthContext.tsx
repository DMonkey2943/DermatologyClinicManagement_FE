// src/context/PatientAuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import patientAuthApiRequest from '@/apiRequests/patientAuth';
import { PatientFullDataType } from '@/schemaValidations/patient.schema';

// interface PatientDataType {
//   id: number;
//   full_name: string;
//   phone_number: string;
//   created_at: string;
// }

interface PatientAuthContextType {
  patient: PatientFullDataType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setPatient: (patient: PatientFullDataType | null) => void;
  signout: () => void;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<PatientFullDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('patient_access_token');
      const refreshToken = Cookies.get('patient_refresh_token');
      if (token && refreshToken) {
        try {
          const { payload } = await patientAuthApiRequest.getCurrentPatient();
          console.log('Fetched current patient:', payload.data);
          setPatient(payload.data);
        } catch (error) {
          console.error('Failed to fetch current patient:', error);
          // Cookies.remove('patient_access_token');
          // Cookies.remove('patient_refresh_token');
          setPatient(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signout = () => {
    Cookies.remove('patient_access_token');
    Cookies.remove('patient_refresh_token');
    Cookies.remove('role');
    setPatient(null);
    window.location.href = '/patient/signin';
  };

  return (
    <PatientAuthContext.Provider
      value={{
        patient,
        isLoading,
        isAuthenticated: !!patient,
        setPatient,
        signout,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error('usePatientAuth must be used within PatientAuthProvider');
  }
  return context;
}
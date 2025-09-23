export interface Medication {
    id: string;
    name: string;
    dosage_form: string;
    price: number;
    stock_quantity: number;
    description?: string;
}

export interface MedicationResponse {
    id: string;
    name: string;
    dosage_form: string;
    price: number;
    stock_quantity: number;
    description?: string;
}

export interface MedicationCreate {
    name: string;
    dosage_form: string;
    price: number;
    stock_quantity: number;
    description?: string;
}

export interface MedicationUpdate {
    name?: string;
    dosage_form?: string;
    price?: number;
    stock_quantity?: number;
    description?: string;
}
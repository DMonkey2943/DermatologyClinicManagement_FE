export interface Service {
    id: string;
    name: string;
    price: number;
    description?: string;
}

export interface ServiceResponse {
    id: string;
    name: string;
    price: number;
    description?: string;
}

export interface ServiceCreate {
    name: string;
    price: number;
    description?: string;
}

export interface ServiceUpdate {
    name?: string;
    price?: number;
    description?: string;
}
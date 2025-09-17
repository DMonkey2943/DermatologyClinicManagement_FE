export interface UserLogin {
    username: string;  // Hoặc email, tùy backend
    password: string;
}

export interface User {
    id: string;
    username: string;
    full_name: string;
    email: string;
    role: string;
}
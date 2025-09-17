'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout } from '@/services/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void; // Thêm setUser
  signout: () => void;  // Thêm signout vào context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Kiểm tra trạng thái đăng nhập khi tải trang
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const currentUser = await getCurrentUser();
        console.log('Fetched current user:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch current user', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrentUser();
  }, []);
    
  const signout = () => {
    logout();  // Gọi hàm xóa cookie và redirect từ auth.ts
    setUser(null);    // Cập nhật context ngay lập tức
  };
    
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
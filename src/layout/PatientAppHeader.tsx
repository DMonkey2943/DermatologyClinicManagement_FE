'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePatientAuth } from '@/context/PatientAuthContext';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const { patient, signout } = usePatientAuth();
  const router = useRouter();
  
    const handleLogout = async () => {
        // console.log('Logging out user');
        router.push("/signin-patient");
        await signout();  // Gọi logout từ context: xóa cookie, setUser(null), và redirect
        toast.success("Đăng xuất thành công")
        router.refresh();
    };
    

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <nav className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/patient" className="flex items-center gap-2 font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg">⚕️</span>
          </div>
          <span className="hidden sm:inline text-lg">ForSkin</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/patient/appointments" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Lịch hẹn
          </Link>
          <Link 
            href="/patient/medical-records" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Lịch sử khám
          </Link>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-muted-foreground">
            Xin chào, <span className="font-semibold text-foreground">{patient?.full_name}</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="hidden sm:flex gap-2"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </Button>
          <button 
            onClick={handleLogout}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3">
          <div className="flex flex-col gap-3">
            <Link 
              href="/appointments" 
              className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Lịch hẹn
            </Link>
            <Link 
              href="/medical-history" 
              className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Lịch sử khám
            </Link>
            <div className="border-t border-border pt-3 mt-2">
              <div className="text-sm text-muted-foreground mb-2">
                Xin chào, <span className="font-semibold text-foreground">{patient?.full_name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsOpen(false)
                  handleLogout()
                }}
                className="w-full justify-center gap-2"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

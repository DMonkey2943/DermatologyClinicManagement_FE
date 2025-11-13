"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function NavigationLoading() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Khi pathname thay đổi => kết thúc loading
    NProgress.done(); // kết thúc progress khi route load xong
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    // Khi bắt đầu chuyển route => bật loading
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) {
        NProgress.start();
        setIsLoading(true);
      }
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999999]">
      <div className="h-10 w-10 border-4 border-t-transparent border-white rounded-full animate-spin" />
    </div>
  );
    // return null;
}

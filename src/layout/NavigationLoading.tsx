"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Khi route thay đổi → tắt loading
  useEffect(() => {
    NProgress.done();
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
      setIsLoading(true);
    };

    // const handleStop = () => {
    //   NProgress.done();
    //   setIsLoading(false);
    // };

    // Cách chuẩn nhất: dùng router events của Next.js (nếu dùng app router thì phải tự bắt)
    // Thay vào đó, ta chỉ bắt những link có href dẫn đến trang khác

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Bỏ qua các link không điều hướng (#, javascript:, hoặc cùng trang + fragment)
      if (
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.getAttribute("download") != null
      ) {
        return;
      }

      // Kiểm tra xem có phải là client-side navigation không
      const currentUrl = window.location.pathname + window.location.search;
      const targetUrl = new URL(href, window.location.href).pathname + new URL(href, window.location.href).search;

      if (currentUrl !== targetUrl) {
        handleStart();
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999999] pointer-events-none">
      <div className="h-10 w-10 border-4 border-t-transparent border-white rounded-full animate-spin" />
    </div>
  );
}
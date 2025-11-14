import type { Metadata } from "next";
import React from "react";
import AdminDashboard from "@/components/reports/AdminDashboard";

export const metadata: Metadata = {
  title:
    "Dashboard | ForSkin - Phòng khám da liễu",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tổng quan</h1>
          {/* <p className="text-muted-foreground mt-1">Tổng quan hoạt động phòng khám</p> */}
        </div>
      </div>
      <AdminDashboard/>
    </div>    
  );
}

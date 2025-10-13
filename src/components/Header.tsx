"use client";
import Image from "next/image";
import React from "react";
import { BriefcaseBusiness, ChevronsUpDown, Plus, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-full px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-purple-600 font-semibold">$</span>
            <span className="hover:text-gray-700">Expenses</span>
            <span className="text-gray-300">›</span>
            <span className="text-gray-800 font-medium">Submit Expense</span>
          </nav>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-[8px] border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
              <BriefcaseBusiness className="size-4 text-purple-600" />
              <span className="text-gray-700 font-bold">Ash Corp</span>
              <ChevronsUpDown className="size-4 text-gray-500" />
            </button>
            <button className="flex items-center gap-2 rounded-[8px] bg-purple-600 text-white px-4 py-2 text-xs font-medium hover:bg-purple-700 shadow-sm">
              <Plus className="size-4" />
              <span className="font-bold">Start workflow</span>
            </button>
            {/* Notification bell */}
            <button aria-label="Notifications" className="ml-1 flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
              <Bell className="size-4" />
            </button>
            <div className="ml-1 h-7 w-7 rounded-full overflow-hidden border border-gray-200">
              <Image src="/next.svg" alt="avatar" width={28} height={28} className="object-cover dark:invert" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
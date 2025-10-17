"use client";
import Image from "next/image";
import React from "react";
import { BriefcaseBusiness, ChevronsUpDown, Plus, Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-full px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 flex items-center gap-1 min-w-0 flex-1 sm:flex-none">
            <span className="text-purple-600 font-semibold">$</span>
            <span className="hover:text-gray-700 hidden xs:inline">Expenses</span>
            <span className="text-gray-300 hidden xs:inline">›</span>
            <span className="text-gray-800 font-medium truncate">
              <span className="hidden xs:inline">Submit </span>Expense
            </span>
          </nav>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Company selector - hidden on mobile, simplified on tablet */}
            <button className="hidden md:flex items-center gap-2 rounded-[8px] border border-gray-200 bg-white px-3 lg:px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
              <BriefcaseBusiness className="size-4 text-purple-600" />
              <span className="text-gray-700 font-bold hidden lg:inline">Ash Corp</span>
              <span className="text-gray-700 font-bold lg:hidden">Ash</span>
              <ChevronsUpDown className="size-4 text-gray-500" />
            </button>
            
            {/* Start workflow button - responsive text */}
            <button className="flex items-center gap-1 sm:gap-2 rounded-[8px] bg-purple-600 text-white px-2 sm:px-3 lg:px-4 py-2 text-xs font-medium hover:bg-purple-700 shadow-sm">
              <Plus className="size-4" />
              <span className="font-bold hidden sm:inline">Start workflow</span>
              <span className="font-bold sm:hidden">Start</span>
            </button>
            
            {/* Notification bell */}
            <button 
              aria-label="Notifications" 
              className="flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
            >
              <Bell className="size-4" />
            </button>
            
            {/* Avatar */}
            <div className="h-7 w-7 rounded-full overflow-hidden border border-gray-200">
              <Image 
                src="/next.svg" 
                alt="avatar" 
                width={28} 
                height={28} 
                className="object-cover dark:invert" 
              />
            </div>
            
            {/* Mobile menu button - only visible on small screens */}
            <button 
              aria-label="Menu" 
              className="md:hidden flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 ml-1"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
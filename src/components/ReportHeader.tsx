"use client";
import React from "react";
import { Folder, CalendarDays, Building2, User, Check, ChevronDown } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function Input({ placeholder, disabled = false, type = "text" }: { placeholder: string; disabled?: boolean; type?: string }) {
  return (
    <input
      className={`mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}`}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
    />
  );
}

// Date input that opens picker when the field (container) is clicked
function DateInput({ placeholder }: { placeholder: string }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const openPicker = () => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    try {
      // showPicker is supported on Chromium-based browsers
      (el as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      // silently ignore when not supported
    }
  };

  return (
    <div className="relative" onClick={openPicker}>
      <input
        ref={ref}
        type="date"
        className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white"
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <CalendarDays className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}

// Dropdown input: opens a menu when clicked
function DropdownInput({ placeholder, options }: { placeholder: string; options: string[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const selectOption = (opt: string) => {
    setValue(opt);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative" onClick={toggleOpen}>
      <input
        ref={inputRef}
        readOnly
        value={value}
        className="mt-1 w-full h-10 rounded-lg border border-gray-200 pl-10 pr-8 text-sm bg-white cursor-pointer"
        placeholder={placeholder}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300">
          <User className="w-4 h-4" />
        </span>
      </div>
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${open ? "rotate-180" : "rotate-0"}`}>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-md border border-gray-200 bg-white shadow z-10 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                selectOption(opt);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Removed old inline SVG icon components; using lucide-react icons instead.

export default function ReportHeader() {
  const [statusChecked, setStatusChecked] = React.useState(false);
  return (
    <section className="bg-white border rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-purple-600" />
        {/* Ubah menjadi ukuran heading */}
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">Report Header</h2>
      </div>
      <p className="text-xs text-gray-500 mt-1 mb-4">Complete the form below to submit your expense report for approval.</p>

      {/* Tata letak baru sesuai instruksi */}
      <div className="space-y-4 text-sm">
        {/* Baris 1: Expense Report Name & Expense Report Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Expense Report Name">
            <Input placeholder="Enter report name" />
          </Field>
          <Field label="Expense Report Number">
            <Input placeholder="Auto-generated" disabled />
          </Field>
        </div>

        {/* Baris 2: Tags & Folder (dalam kolom kiri, lebar tidak melebihi Name) dan Report Date di kanan (di bawah Number) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kiri: Tags & Folder berada dalam satu kolom (dua field berdampingan) */}
          <div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <Field label="Tags">
                <Input placeholder="Enter tags (comma-separated)" />
              </Field>
              <Field label="Folder">
                <div className="relative">
                  <Input placeholder="Enter folder name" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Folder className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Field>
            </div>
          </div>
          {/* Kanan: Report Date berada tepat di bawah Expense Report Number */}
          <Field label="Report Date">
            <DateInput placeholder="Enter report date" />
          </Field>
        </div>

        {/* Baris 3: kiri Approval Flow + Custom Workflow, kanan Total Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Field label="Approval Flow">
              <DropdownInput placeholder="Add message" options={["Manager Approval", "Finance Review", "CEO Sign-off"]} />
            </Field>
            <Field label="Custom Workflow">
              <DropdownInput placeholder="Add message" options={["Custom A", "Custom B", "Custom C"]} />
            </Field>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Total Expenses</label>
            <div className="mt-1 rounded-xl border-2 border-purple-600 px-4 py-4 min-h-[64px] flex items-center justify-between text-sm bg-violet-50">
              <span className="text-black">Total Expenses</span>
              <span className="text-black font-bold text-lg">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <div className="flex flex-col xs:flex-row gap-2 flex-1">
          <button className="px-3 py-1.5 h-9 text-xs rounded-md bg-purple-600 text-white flex items-center justify-center gap-2 hover:bg-purple-700">
            <User className="w-4 h-4" />
            <span className="hidden xs:inline">Submit on Behalf Of</span>
            <span className="xs:hidden">Submit</span>
          </button>
          <button className="px-3 py-1.5 h-9 text-xs rounded-md border border-gray-200 bg-white">
            <span className="hidden xs:inline">Policy Documents</span>
            <span className="xs:hidden">Policy</span>
          </button>
          <button className="px-3 py-1.5 h-9 text-xs rounded-md border border-gray-200 bg-white">
            <span className="hidden xs:inline">Audit Trail</span>
            <span className="xs:hidden">Audit</span>
          </button>
        </div>
        <div className="sm:ml-auto">
          <button
            className="w-full sm:w-auto px-3 py-1.5 h-9 text-xs rounded-md border border-gray-200 bg-white flex items-center justify-center gap-2"
            onClick={() => setStatusChecked((v) => !v)}
            aria-pressed={statusChecked}
          >
            <span
              className={`inline-flex items-center justify-center w-4 h-4 rounded border ${
                statusChecked ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300 text-gray-400"
              }`}
            >
              {statusChecked ? <Check className="w-4 h-4" /> : null}
            </span>
            <span className="hidden xs:inline">Show Status Overview</span>
            <span className="xs:hidden">Status</span>
          </button>
        </div>
      </div>
      {/* Expense Item dipindahkan ke card terpisah di page.tsx */}
    </section>
  );
}
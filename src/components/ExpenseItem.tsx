"use client";
import React from "react";
import PdfViewer from "@/components/PdfViewer";
import ReceiptGrid from "@/components/ReceiptGrid";
import { ChevronDown, Package, CreditCard, Calculator, StickyNote, Upload, Receipt, FileText } from "lucide-react";

function ExpandableSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-purple-100 text-purple-600 border border-purple-200">
              {icon}
            </span>
          ) : null}
          <span className="text-sm font-medium text-gray-800">{title}</span>
        </div>
        <span className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </span>
      </button>
      {open && children ? <div className="px-4 pb-4 pt-0">{children}</div> : null}
    </div>
  );
}

export default function ExpenseItem() {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const revokeCurrentUrl = React.useCallback(() => {
    if (pdfUrl) {
      try {
        URL.revokeObjectURL(pdfUrl);
      } catch (_) {
        // ignore
      }
    }
  }, [pdfUrl]);

  const handleFiles = React.useCallback((files: FileList | File[] | null) => {
    if (!files || ("length" in files && files.length === 0)) return;
    const file = files[0];
    if (file && file.type === "application/pdf") {
      revokeCurrentUrl();
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else {
      // eslint-disable-next-line no-alert
      alert("Please upload a PDF file.");
    }
  }, [revokeCurrentUrl]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input so selecting the same file again still triggers change
    e.target.value = "";
  };
  const openFilePicker = () => fileInputRef.current?.click();
  const clearViewer = () => {
    revokeCurrentUrl();
    setPdfUrl(null);
  };
  // Toggle render mode: standalone (client) vs server-backed
  const [standalone, setStandalone] = React.useState(true);
  return (
    <>
    <section className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-purple-100 text-purple-600 border border-purple-200">
            <Receipt className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-800">Expense Item</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs rounded-md border border-purple-200 bg-purple-50 text-purple-700">1. [New Expense]</span>
          <button className="px-3 py-1.5 h-9 text-xs rounded-md border border-gray-200 bg-white flex items-center gap-1">
            Add
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 grid grid-cols-12 gap-6">
        {/* Left: Accordion sections */}
        <div className="col-span-12 lg:col-span-7 space-y-3">
          <ExpandableSection title="Basic Information" defaultOpen icon={<FileText className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs text-gray-500">Description</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., Office supplies, Client dinner, Travel expenses" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Expense Category</label>
                <div className="relative">
                  <input readOnly className="mt-1 w-full h-10 rounded-lg border border-gray-200 pl-3 pr-10 text-sm bg-white cursor-pointer" placeholder="Select expense category" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Merchant</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="Enter Merchant" />
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection title="Vendor Information" icon={<Package className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Vendor Name</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., Acme Supplies" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Contact Name</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., John Doe" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input type="email" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="name@vendor.com" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <input type="tel" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., +62 812-3456-7890" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Address</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="Street, City, Province, Postal Code" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Tax ID / NPWP</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., 12.345.678.9-012.345" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Website</label>
                <input type="url" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="https://vendor.com" />
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection title="Financial Details" icon={<CreditCard className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Amount</label>
                <input type="number" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., 150.00" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Currency</label>
                <select className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white">
                  <option>IDR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>JPY</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Tax / VAT (%)</label>
                <input type="number" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., 11" />
              </div>
              <div>
                <label className="text-xs text-gray-500">FX Rate</label>
                <input type="number" step="0.0001" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., 15500.0000" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Payment Method</label>
                <select className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white">
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>E-Wallet</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Transaction Date</label>
                <input type="date" className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" />
              </div>
              <div className="md:col-span-2 flex items-center gap-2 mt-1">
                <input id="reimbursable" type="checkbox" className="rounded border-gray-300" />
                <label htmlFor="reimbursable" className="text-xs text-gray-700">Mark as Reimbursable</label>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Receipt Number (optional)</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., INV-2024-001" />
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection title="Accounting" icon={<Calculator className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">GL Account</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., 6100 - Office Supplies" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Cost Center</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., CC-001 Marketing" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Project / Job Code</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., PROJ-ACME-2025" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Department</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., Finance" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Tax Code</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., VAT11" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input id="billable" type="checkbox" className="rounded border-gray-300" />
                <label htmlFor="billable" className="text-xs text-gray-700">Billable to Client</label>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection title="Notes" icon={<StickyNote className="w-3.5 h-3.5" />}>
            <div>
              <label className="text-xs text-gray-500">Notes</label>
              <textarea className="mt-1 w-full min-h-[96px] rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white" placeholder="Add any additional context, justification, or instructions"></textarea>
              <div className="mt-3">
                <label className="text-xs text-gray-500">Tags (comma separated)</label>
                <input className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm bg-white" placeholder="e.g., office, urgent, q1" />
              </div>
            </div>
          </ExpandableSection>
        </div>

          {/* Right: Receipt Upload / PDF Viewer */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700">Page 1 of 1</span>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 bg-white text-gray-600">‹</button>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 bg-white text-gray-600">›</button>
              </div>
              <div className="flex items-center gap-3">
                {/* Mode toggle */}
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={standalone}
                    onChange={(e) => setStandalone(e.target.checked)}
                  />
                  Standalone Viewer
                </label>
                {pdfUrl ? (
                  <button className="inline-flex items-center gap-1 px-2 h-8 rounded-md border border-gray-200 bg-white text-xs" onClick={clearViewer}>
                    Back to Upload
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center gap-1 px-2 h-8 rounded-md border border-gray-200 bg-white text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFilePicker();
                    }}
                  >
                    Add Receipt
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Conditional content */}
            {pdfUrl ? (
              <div className="mt-4">
                <PdfViewer
                  documentPath={pdfUrl}
                  height={520}
                  standalone={standalone}
                  resourceUrl="https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib"
                  serviceUrl="https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/"
                />
              </div>
            ) : (
              <div
                className="mt-4 rounded-xl border-2 border-dashed border-purple-300 bg-white p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={openFilePicker}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-700">Click to upload or drag and drop files to upload a new receipt.</p>
                <p className="mt-1 text-xs text-gray-500">Valid formats: .pdf · 5MB limit per file</p>
                <button
                  className="mt-4 inline-flex items-center gap-2 px-3 h-9 rounded-md border border-purple-600 text-purple-700 bg-purple-50 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFilePicker();
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Add Receipt
                </button>
                <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={onFileChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    {/* Receipt Details Section */}
    <section className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Receipt Details</h2>
        </div>
      </div>
      <div className="mt-4">
        <ReceiptGrid />
      </div>
    </section>
    {/* Action Buttons - Bottom Right */}
    <div className=" flex items-center justify-end gap-3 px-4 py-12">
      <button
        type="button"
        className="px-4 py-2 text-sm rounded-[10px] border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="button"
        className="px-4 py-2 text-sm rounded-[10px] border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50"
      >
        Save Draft
      </button>
      <button
        type="button"
        className="px-4 py-2 text-sm rounded-[10px] bg-purple-600 text-white rounded-[10px] shadow-sm hover:bg-purple-700"
      >
        Submit
      </button>
    </div>
    </>
  );
}
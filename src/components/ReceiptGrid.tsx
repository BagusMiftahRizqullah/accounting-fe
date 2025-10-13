"use client";
import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { CellComponent } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { Search, Filter as FilterIcon, Settings, Download, Plus } from "lucide-react";

type ReceiptRow = {
  id: number;
  description: string;
  receiptNumber?: string;
  date?: string;
  amount?: number;
  totalLocal?: number;
  currency?: string;
  fxRate?: number;
  account?: string;
  qty?: number;
  vat?: string;
  note?: string;
};

type SimpleFilter = { field: keyof ReceiptRow | string; type: "=" | ">="; value: string | number };

// Minimal interface to interact with the Tabulator instance without relying on full library typings
interface TabulatorInstance {
  getData(): ReceiptRow[];
  addRow(row: Partial<ReceiptRow>, top?: boolean): void;
  download(format: string, filename: string): void;
  showColumn(field: string): void;
  hideColumn(field: string): void;
  setFilter(filter: ((data: ReceiptRow) => boolean) | SimpleFilter[] | []): void;
  clearFilter(clearHeader?: boolean): void;
  destroy(): void;
}

const initialData: ReceiptRow[] = [
  { id: 1, description: "New Expense", amount: 0, totalLocal: 0, currency: "USD" },
  { id: 2, description: "New Expense", amount: 0, totalLocal: 0, currency: "USD" },
  { id: 3, description: "New Expense", amount: 0, totalLocal: 0, currency: "USD" },
  { id: 4, description: "New Expense", amount: 0, totalLocal: 0, currency: "USD" },
];

export default function ReceiptGrid() {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorInstance = useRef<TabulatorInstance | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [showColumnPicker, setShowColumnPicker] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [currencyFilter, setCurrencyFilter] = React.useState<string>("");
  const [amountMin, setAmountMin] = React.useState<string>("");

  useEffect(() => {
    if (!tableRef.current) return;

    const dash = (cell: CellComponent) => {
      const v = cell.getValue();
      return v === undefined || v === null || String(v) === "" ? "—" : v;
    };

    const table = (new Tabulator(tableRef.current, {
      data: initialData,
      layout: "fitDataStretch",
      reactiveData: true,
      height: 360,
      movableColumns: true,
      movableRows: true,
      addRowPos: "top",
      responsiveLayout: "collapse",
      pagination: "local",
      paginationSize: 10,
      paginationSizeSelector: [10, 25, 50, 100],
      columnDefaults: {
        resizable: true,
        headerHozAlign: "center",
        hozAlign: "left",
        vertAlign: "middle",
      },
      columns: [
        { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, width: 44 },
        { formatter: "handle", headerSort: false, width: 44 },
        { formatter: "responsiveCollapse", headerSort: false, width: 44 },
        { title: "No.", field: "id", width: 60, hozAlign: "center" },
        { title: "Description", field: "description", editor: "input", width: 220, formatter: dash },
        { title: "Receipt Number", field: "receiptNumber", editor: "input", width: 150, formatter: dash },
        { title: "Date", field: "date", sorter: "date", editor: "input", width: 130, formatter: dash },
        {
          title: "Amount",
          field: "amount",
          hozAlign: "right",
          editor: "number",
          width: 120,
          formatter: (cell: CellComponent) => `$${Number(cell.getValue() || 0).toFixed(2)}`,
        },
        {
          title: "Total (Local)",
          field: "totalLocal",
          hozAlign: "right",
          editor: "number",
          width: 140,
          formatter: (cell: CellComponent) => `$${Number(cell.getValue() || 0).toFixed(2)}`,
        },
        {
          title: "Currency",
          field: "currency",
          width: 110,
          editor: "list",
          editorParams: { values: ["USD", "EUR", "IDR"] },
          formatter: dash,
        },
        { title: "FX Rate", field: "fxRate", width: 100, hozAlign: "right", editor: "number", formatter: dash },
        { title: "Account", field: "account", editor: "input", width: 140, formatter: dash },
        { title: "Qty", field: "qty", width: 80, hozAlign: "right", editor: "number", formatter: dash },
        { title: "VAT", field: "vat", width: 90, hozAlign: "center", editor: "input", formatter: dash },
        { title: "Note", field: "note", editor: "input", width: 160, formatter: dash },
      ],
    }) as unknown) as TabulatorInstance;

    tabulatorInstance.current = table;

    return () => {
      table.destroy();
      tabulatorInstance.current = null;
    };
  }, []);

  // Apply search across all fields
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      table.clearFilter(true);
      return;
    }
    table.setFilter((data: ReceiptRow) => {
      return Object.values(data || {}).some((v) => String(v ?? "").toLowerCase().includes(q));
    });
  }, [searchQuery]);

  // Apply structured filters (currency, amount minimum)
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;
    const filters: SimpleFilter[] = [];
    if (currencyFilter) filters.push({ field: "currency", type: "=", value: currencyFilter });
    if (amountMin) filters.push({ field: "amount", type: ">=", value: Number(amountMin) || 0 });
    table.setFilter(filters.length ? filters : []);
  }, [currencyFilter, amountMin]);

  const addRow = () => {
    const nextId = (tabulatorInstance.current?.getData().length || 0) + 1;
    tabulatorInstance.current?.addRow({ id: nextId, description: "New Expense", amount: 0, totalLocal: 0, currency: "USD" }, true);
  };

  const downloadCsv = () => {
    tabulatorInstance.current?.download("csv", "receipts.csv");
  };

  const toggleColumn = (field: string, show: boolean) => {
    const table = tabulatorInstance.current;
    if (!table) return;
    if (show) table.showColumn(field);
    else table.hideColumn(field);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 pb-3 grid-toolbar">
        {/* Search */}
        <div className="w-full max-w-xs">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipts..."
              className="mt-0 w-full h-10 rounded-[10px] border border-gray-200 pl-9 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <FilterIcon className="w-4 h-4 text-gray-600" />
            Filter
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50"
            onClick={() => setShowColumnPicker((v) => !v)}
          >
            <Settings className="w-4 h-4 text-gray-600" />
            Columns
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50"
            onClick={downloadCsv}
          >
            <Download className="w-4 h-4 text-gray-600" />
            Export
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50"
            onClick={addRow}
          >
            <Plus className="w-4 h-4 text-gray-600" />
            Add Receipt
          </button>
        </div>
      </div>
      {filtersOpen && (
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500">Currency</label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="mt-1 w-full h-9 rounded-md border border-gray-200 px-2 text-sm bg-white"
            >
              <option value="">All</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="IDR">IDR</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Amount ≥</label>
            <input
              type="number"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              placeholder="0"
              className="mt-1 w-full h-9 rounded-md border border-gray-200 px-2 text-sm bg-white"
            />
          </div>
        </div>
      )}
      {showColumnPicker && (
        <div className="mb-3 rounded-lg border border-gray-200 p-3 bg-white">
          <p className="text-xs text-gray-500 mb-2">Toggle columns</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {[
              { label: "Receipt Number", field: "receiptNumber" },
              { label: "Date", field: "date" },
              { label: "Amount", field: "amount" },
              { label: "Total (Local)", field: "totalLocal" },
              { label: "Currency", field: "currency" },
              { label: "FX Rate", field: "fxRate" },
              { label: "Account", field: "account" },
              { label: "Qty", field: "qty" },
              { label: "VAT", field: "vat" },
              { label: "Note", field: "note" },
            ].map((c) => (
              <label key={c.field} className="inline-flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => toggleColumn(c.field, e.target.checked)}
                  className="rounded border-gray-300"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      )}
      <div ref={tableRef} className="rounded-lg overflow-hidden border border-gray-200 bg-white" />
    </div>
  );
}
import { useState, useEffect } from 'react';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineCalendarDays,
  HiOutlineFunnel,
} from 'react-icons/hi2';
import { cn } from '@/utils/cn';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'All Payment Methods' },
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'upi', label: 'UPI' },
];

export default function OrderFilter({
  search = '',
  onSearchChange,
  status = 'all',
  onStatusChange,
  paymentMethod = 'all',
  onPaymentMethodChange,
  dateLabel = 'Select Date',
  onDateClick,
  onFiltersClick,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync prop changes (e.g. clear filters)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange?.(localSearch);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, search, onSearchChange]);

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={localSearch}
          onChange={handleSearch}
          placeholder="Search by order ID, customer, product..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Status */}
      <SelectField
        value={status}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
        className="sm:w-44"
      />

      {/* Payment Method */}
      <SelectField
        value={paymentMethod}
        onChange={onPaymentMethodChange}
        options={PAYMENT_METHOD_OPTIONS}
        className="sm:w-52"
      />

      {/* Date */}
      <input type="date" onClick={onDateClick}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:w-44" onChange={(e) => onChange?.(e.target.value)} />

      {/* Filters */}
      <button
        type="button"
        onClick={onFiltersClick}
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        <HiOutlineFunnel className="h-4 w-4" />
        Filters
      </button>
    </div>
  );
}

function SelectField({ value, onChange, options, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
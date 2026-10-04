import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import type { Invoice } from '../data/hospitalData';

interface PrintBillModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const PrintBillModal: React.FC<PrintBillModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Controls */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Official Tax Invoice Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Header */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-rose-900 tracking-tight">SHISHUTAA</span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                Super Specialty Hospital
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              ROC Kanpur (Uttar Pradesh) • CIN: U86909UP2026PTC248224
              <br />Plot 14, Civil Lines, Kanpur, UP - 208001 | Phone: +91 512 2901100
              <br />Website: www.shishutaa.com | GSTIN: 09AAAAA0000A1Z5
            </p>
          </div>

          <div className="text-right">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">PATIENT BILL</h3>
            <p className="text-sm font-mono font-bold text-rose-800 mt-1">{invoice.invoiceNo}</p>
            <p className="text-xs text-slate-500">Date: {invoice.date}</p>
            <p className="text-xs text-slate-500">Due Date: {invoice.dueDate}</p>
          </div>
        </div>

        {/* Patient Details Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Patient Name & Details</span>
            <span className="text-sm font-bold text-slate-900">{invoice.patientName}</span>
            <span className="block text-slate-600 font-mono mt-0.5">UHID: {invoice.uhid}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Payment & Status</span>
            <span className="font-bold text-slate-900">{invoice.paymentMethod}</span>
            <span className="block text-xs font-bold text-rose-700 mt-0.5">Status: {invoice.status}</span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-600">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{item.description}</td>
                  <td className="py-2.5 px-3 text-slate-600">{item.category}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{item.qty}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Signature */}
        <div className="flex justify-between items-end pt-4 border-t border-slate-300 text-xs">
          <div className="space-y-1">
            <p className="text-slate-500 text-[11px] italic">Thank you for choosing Shishutaa Super Specialty Hospital.</p>
            <p className="text-slate-500 text-[11px]">Computer generated invoice. No physical signature required.</p>
          </div>

          <div className="w-64 space-y-1 text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST / Taxes:</span>
              <span className="font-mono font-semibold">₹0.00 (Exempt)</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
              <span>Total Amount:</span>
              <span className="font-mono text-rose-900">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-700 font-bold">
              <span>Amount Paid:</span>
              <span className="font-mono">₹{invoice.paidAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

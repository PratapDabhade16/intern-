import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  X 
} from 'lucide-react';
import type { Invoice, Patient } from '../data/hospitalData';

interface BillingViewProps {
  invoices: Invoice[];
  patients: Patient[];
  onAddInvoice: (inv: Invoice) => void;
  onPrintInvoice: (inv: Invoice) => void;
  preSelectedPatientForBill?: Patient | null;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  patients,
  onAddInvoice,
  onPrintInvoice,
  preSelectedPatientForBill
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(!!preSelectedPatientForBill);

  const [selectedPatientId, setSelectedPatientId] = useState(preSelectedPatientForBill?.id || patients[0]?.id || '');
  const [lineItems, setLineItems] = useState<Invoice['items']>([
    { description: 'Specialist Consultation Fee', category: 'Consultation', qty: 1, unitPrice: 2000, amount: 2000 },
    { description: 'Comprehensive Blood Panel Diagnostics', category: 'Diagnostics', qty: 1, unitPrice: 3500, amount: 3500 },
    { description: 'ICU / Ward Nursing Charges', category: 'Nursing', qty: 2, unitPrice: 4000, amount: 8000 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Cash' | 'Insurance TPA'>('UPI');

  const filteredInvoices = invoices.filter(inv =>
    inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.uhid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateSubtotal = () => lineItems.reduce((acc, item) => acc + item.amount, 0);

  const handleAddItem = () => {
    setLineItems([...lineItems, { description: 'Medication / Supply Item', category: 'Pharmacy', qty: 1, unitPrice: 1000, amount: 1000 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const copy = [...lineItems];
    (copy[index] as any)[field] = value;
    if (field === 'qty' || field === 'unitPrice') {
      copy[index].amount = copy[index].qty * copy[index].unitPrice;
    }
    setLineItems(copy);
  };

  const handleRemoveItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    const subtotal = calculateSubtotal();

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-SH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: patient.name,
      uhid: patient.uhid,
      date: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
      items: lineItems,
      subtotal,
      tax: 0,
      discount: 0,
      totalAmount: subtotal,
      paidAmount: paymentMethod === 'Insurance TPA' ? 0 : subtotal,
      status: paymentMethod === 'Insurance TPA' ? 'Claim Processing' : 'Paid',
      paymentMethod
    };

    onAddInvoice(newInvoice);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#8C2237]" /> Billing, Insurance Claims & Finance
          </h2>
          <p className="text-xs text-slate-500">Generate itemized hospital bills, process TPA pre-authorization & print PDF invoices</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="shishutaa-btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Create Itemized Invoice
        </button>
      </div>

      {/* Search */}
      <div className="shishutaa-card p-4 rounded-3xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, patient name or UHID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8C2237]"
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="shishutaa-card rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/70 border-b border-rose-100 text-[11px] font-extrabold uppercase tracking-wider text-[#8C2237]">
                <th className="py-4 px-5">Invoice No</th>
                <th className="py-4 px-5">Patient UHID</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Payment Method</th>
                <th className="py-4 px-5">Total Amount</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Print PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-rose-50/40 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-[#8C2237]">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 block">{inv.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{inv.uhid}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 font-medium">
                    {inv.date}
                  </td>
                  <td className="py-3.5 px-5 text-slate-800 font-bold">
                    {inv.paymentMethod}
                  </td>
                  <td className="py-3.5 px-5 font-black text-slate-900 text-sm">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border ${
                      inv.status === 'Paid'
                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                        : inv.status === 'Claim Processing'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onPrintInvoice(inv)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8C2237] border border-slate-200 font-bold text-xs flex items-center gap-1.5 ml-auto"
                    >
                      <Printer className="w-3.5 h-3.5 text-rose-600" /> Print Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-4 text-slate-800">
            
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900">Generate Patient Invoice</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Patient *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.uhid}) - {p.department}</option>
                  ))}
                </select>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-bold">Bill Itemization</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[#8C2237] hover:underline text-[11px] font-bold"
                  >
                    + Add Item Line
                  </button>
                </div>

                {lineItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Item description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
                      className="w-16 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center"
                    />
                    <input
                      type="number"
                      placeholder="Rate ₹"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                      className="w-24 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-right"
                    />
                    <span className="w-24 text-right font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</span>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold"
                  >
                    <option value="UPI">UPI Digital Payment</option>
                    <option value="Credit Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Insurance TPA">Insurance TPA Cashless Claim</option>
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Total Subtotal</span>
                  <span className="text-2xl font-black text-[#8C2237]">₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shishutaa-btn-primary px-6 py-2 font-bold"
                >
                  Save & Issue Bill
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

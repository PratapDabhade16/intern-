import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  X, 
  ShoppingBag
} from 'lucide-react';
import type { InventoryItem } from '../data/hospitalData';

interface PharmacyViewProps {
  inventory: InventoryItem[];
  onAddInventory: (item: InventoryItem) => void;
  onDispenseItem: (id: string, qty: number) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({ inventory, onAddInventory, onDispenseItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispenseItem, setDispenseItem] = useState<InventoryItem | null>(null);
  const [dispenseQty, setDispenseQty] = useState(10);

  // New Item State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Antibiotic' as InventoryItem['category'],
    batchNo: 'B26-100',
    stockQty: 500,
    unit: 'Tablets',
    expiryDate: '2028-06-30',
    unitPrice: 20,
    supplier: 'Cipla Healthcare',
    reorderLevel: 100
  });

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const filteredInventory = inventory.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const created: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      batchNo: newItem.batchNo,
      stockQty: Number(newItem.stockQty),
      unit: newItem.unit,
      expiryDate: newItem.expiryDate,
      unitPrice: Number(newItem.unitPrice),
      supplier: newItem.supplier,
      reorderLevel: Number(newItem.reorderLevel),
      status: Number(newItem.stockQty) <= Number(newItem.reorderLevel) ? 'Low Stock' : 'In Stock'
    };

    onAddInventory(created);
    setShowAddModal(false);
  };

  const handleDispenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dispenseItem) {
      onDispenseItem(dispenseItem.id, Number(dispenseQty));
      setDispenseItem(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <Pill className="w-6 h-6 text-[#8C2237]" /> Central Pharmacy & Drug Inventory
          </h2>
          <p className="text-xs text-slate-500">Medicine stock levels, expiry tracking, batch numbers & prescription fulfillment</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="shishutaa-btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Stock New Drug / Supply
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="shishutaa-card p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine name, batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8C2237]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              categoryFilter === 'All' ? 'bg-[#8C2237] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                categoryFilter === cat ? 'bg-[#8C2237] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="shishutaa-card rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/70 border-b border-rose-100 text-[11px] font-extrabold uppercase tracking-wider text-[#8C2237]">
                <th className="py-4 px-5">Medicine Name & Batch</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Available Stock</th>
                <th className="py-4 px-5">Expiry Date</th>
                <th className="py-4 px-5">Unit Rate</th>
                <th className="py-4 px-5">Stock Status</th>
                <th className="py-4 px-5 text-right">Fulfill / Dispense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-rose-50/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Batch: {item.batchNo} • {item.supplier}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-700 font-semibold">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-5 font-black text-slate-900">
                    {item.stockQty} <span className="text-slate-400 text-[10px] font-normal">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 font-mono font-medium">
                    {item.expiryDate}
                  </td>
                  <td className="py-3.5 px-5 text-[#8C2237] font-bold">
                    ₹{item.unitPrice}/{item.unit}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'In Stock'
                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setDispenseItem(item)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8C2237] border border-slate-200 font-bold text-xs inline-flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-rose-600" /> Dispense
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispense Modal */}
      {dispenseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 relative space-y-4 text-slate-800">
            <button
              onClick={() => setDispenseItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Dispense Medicine</h3>
            <p className="text-xs text-slate-500">{dispenseItem.name} (Batch: {dispenseItem.batchNo})</p>

            <form onSubmit={handleDispenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Dispense Quantity ({dispenseItem.unit})</label>
                <input
                  type="number"
                  min={1}
                  max={dispenseItem.stockQty}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Total Billed Price</span>
                <span className="font-black text-[#8C2237]">₹{(dispenseQty * dispenseItem.unitPrice).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispenseItem(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shishutaa-btn-primary px-5 py-2 font-bold"
                >
                  Confirm & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 relative space-y-4 text-slate-800">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Add New Drug to Stock</h3>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Drug / Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Azithromycin 500mg"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Consumable">Consumable</option>
                    <option value="Surgical">Surgical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newItem.batchNo}
                    onChange={(e) => setNewItem({ ...newItem, batchNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={newItem.stockQty}
                    onChange={(e) => setNewItem({ ...newItem, stockQty: Number(e.target.value) })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Price ₹</label>
                  <input
                    type="number"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shishutaa-btn-primary px-5 py-2 font-bold"
                >
                  Save Stock Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

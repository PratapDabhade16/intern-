import React, { useState, useEffect } from 'react';
import { Search, X, Users, BedDouble, Pill, ArrowRight } from 'lucide-react';
import type { Patient, Bed, InventoryItem } from '../data/hospitalData';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  beds: Bed[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  beds,
  inventory,
  setActiveTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedPatients = patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.uhid.toLowerCase().includes(query.toLowerCase()));
  const matchedBeds = beds.filter(b => b.bedNumber.toLowerCase().includes(query.toLowerCase()) || b.wardName.toLowerCase().includes(query.toLowerCase()));
  const matchedInventory = inventory.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.batchNo.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden relative space-y-3 text-slate-800">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C2237]" />
          <input
            type="text"
            autoFocus
            placeholder="Search patients, UHID, beds, medicines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          
          {/* Patients */}
          {matchedPatients.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold text-[#8C2237] uppercase tracking-wider block mb-2">Patients ({matchedPatients.length})</span>
              <div className="space-y-1">
                {matchedPatients.slice(0, 3).map(p => (
                  <div 
                    key={p.id}
                    onClick={() => { setActiveTab('patients'); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#8C2237]" />
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">({p.uhid})</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Beds */}
          {matchedBeds.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider block mb-2">Beds ({matchedBeds.length})</span>
              <div className="space-y-1">
                {matchedBeds.slice(0, 3).map(b => (
                  <div 
                    key={b.id}
                    onClick={() => { setActiveTab('beds'); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <BedDouble className="w-4 h-4 text-teal-600" />
                      <span className="font-bold text-slate-900">{b.bedNumber} - {b.wardName}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pharmacy */}
          {matchedInventory.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block mb-2">Pharmacy Medicines ({matchedInventory.length})</span>
              <div className="space-y-1">
                {matchedInventory.slice(0, 3).map(i => (
                  <div 
                    key={i.id}
                    onClick={() => { setActiveTab('pharmacy'); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Pill className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-900">{i.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">Stock: {i.stockQty}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

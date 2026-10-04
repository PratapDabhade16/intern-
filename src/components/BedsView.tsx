import React, { useState } from 'react';
import { 
  BedDouble, 
  CheckCircle2, 
  Wrench, 
  Users, 
  Filter, 
  X
} from 'lucide-react';
import type { Bed, Patient } from '../data/hospitalData';

interface BedsViewProps {
  beds: Bed[];
  patients: Patient[];
  onUpdateBed: (bed: Bed) => void;
}

export const BedsView: React.FC<BedsViewProps> = ({ beds, patients, onUpdateBed }) => {
  const [filterWard, setFilterWard] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const wards = Array.from(new Set(beds.map(b => b.wardName)));

  const filteredBeds = beds.filter(b => {
    const matchesWard = filterWard === 'All' || b.wardName === filterWard;
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesWard && matchesStatus;
  });

  const occupiedCount = beds.filter(b => b.status === 'Occupied').length;
  const availableCount = beds.filter(b => b.status === 'Available').length;
  const maintenanceCount = beds.filter(b => b.status === 'Maintenance').length;

  const handleAssignPatient = (patientId: string) => {
    if (!selectedBed) return;
    const patient = patients.find(p => p.id === patientId);
    
    const updated: Bed = {
      ...selectedBed,
      status: 'Occupied',
      patientId: patient?.id,
      patientName: patient?.name
    };

    onUpdateBed(updated);
    setSelectedBed(null);
  };

  const handleSetAvailable = () => {
    if (!selectedBed) return;
    const updated: Bed = {
      ...selectedBed,
      status: 'Available',
      patientId: undefined,
      patientName: undefined
    };
    onUpdateBed(updated);
    setSelectedBed(null);
  };

  const handleSetMaintenance = () => {
    if (!selectedBed) return;
    const updated: Bed = {
      ...selectedBed,
      status: 'Maintenance',
      patientId: undefined,
      patientName: undefined
    };
    onUpdateBed(updated);
    setSelectedBed(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-[#8C2237]" /> Bed & ICU Ward Occupancy Grid
          </h2>
          <p className="text-xs text-slate-500">Real-time bed tracking across ICU, Ventilator, Emergency & Wards</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" /> {availableCount} Available
          </span>
          <span className="px-3 py-1.5 rounded-full bg-rose-50 text-[#8C2237] border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Users className="w-4 h-4" /> {occupiedCount} Occupied
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Wrench className="w-4 h-4" /> {maintenanceCount} Maintenance
          </span>
        </div>
      </div>

      {/* Filter controls */}
      <div className="shishutaa-card p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#8C2237]" /> Ward:
          </span>
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none"
          >
            <option value="All">All Wards ({wards.length})</option>
            {wards.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          {['All', 'Occupied', 'Available', 'Maintenance', 'Reserved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#8C2237] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-rose-50 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Visual Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';

          return (
            <div
              key={bed.id}
              onClick={() => setSelectedBed(bed)}
              className={`p-5 rounded-3xl cursor-pointer transition-all duration-200 border shishutaa-card ${
                isOccupied
                  ? 'border-rose-200 bg-gradient-to-br from-white via-rose-50/40 to-pink-50/30 hover:border-rose-400'
                  : isAvailable
                  ? 'border-teal-200 bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/20 hover:border-teal-400'
                  : 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-extrabold text-[#8C2237] px-3 py-0.5 rounded-full bg-rose-50 border border-rose-100">
                  {bed.bedNumber}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isOccupied
                    ? 'bg-rose-100 text-[#8C2237] border border-rose-200'
                    : isAvailable
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {bed.status}
                </span>
              </div>

              <p className="text-xs font-bold text-[#2D1B22]">{bed.wardName}</p>
              <p className="text-[11px] text-slate-500 font-medium">{bed.type} • ₹{bed.dailyRate.toLocaleString('en-IN')}/day</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {isOccupied ? (
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-full bg-[#8C2237] text-white flex items-center justify-center font-bold text-[10px]">
                      {bed.patientName?.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800 truncate">{bed.patientName}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Admission
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Assignment / Status Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 relative space-y-4 text-slate-800">
            
            <button
              onClick={() => setSelectedBed(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-[#8C2237] border border-rose-200">
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bed #{selectedBed.bedNumber}</h3>
                <p className="text-xs text-slate-500">{selectedBed.wardName} ({selectedBed.type})</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <p className="text-slate-600">Current Status: <strong className="text-slate-900">{selectedBed.status}</strong></p>
              {selectedBed.patientName && (
                <p className="text-slate-600 mt-1">Occupying Patient: <strong className="text-[#8C2237]">{selectedBed.patientName}</strong></p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              {selectedBed.status === 'Available' ? (
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1.5">Assign Admitted Patient:</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {patients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleAssignPatient(p.id)}
                        className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-left text-xs font-semibold text-slate-800 flex items-center justify-between"
                      >
                        <span>{p.name} ({p.uhid})</span>
                        <span className="text-[10px] text-teal-700 font-bold">Assign Bed</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSetAvailable}
                    className="flex-1 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                  >
                    Mark as Available / Discharged
                  </button>
                  <button
                    onClick={handleSetMaintenance}
                    className="py-2.5 px-4 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs"
                  >
                    Maintenance
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

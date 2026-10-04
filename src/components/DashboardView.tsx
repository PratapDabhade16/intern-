import React from 'react';
import { 
  Users, 
  BedDouble, 
  Receipt, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Stethoscope,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import type { Patient, Bed, Invoice, Appointment } from '../data/hospitalData';

interface DashboardViewProps {
  patients: Patient[];
  beds: Bed[];
  invoices: Invoice[];
  appointments: Appointment[];
  setActiveTab: (tab: string) => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  beds,
  invoices,
  appointments,
  setActiveTab,
  onOpenNewPatient,
  onOpenNewAppointment
}) => {
  
  // Calculate analytics
  const admittedCount = patients.filter(p => p.admissionStatus === 'Admitted').length;
  const emergencyCount = patients.filter(p => p.admissionStatus === 'Emergency').length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const totalBeds = beds.length;
  const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const collectedRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  // Chart Mock Data
  const occupancyTrend = [
    { time: '06:00 AM', icu: 3, general: 12, pediatric: 2 },
    { time: '09:00 AM', icu: 4, general: 15, pediatric: 3 },
    { time: '12:00 PM', icu: 5, general: 18, pediatric: 4 },
    { time: '03:00 PM', icu: 4, general: 17, pediatric: 3 },
    { time: '06:00 PM', icu: 4, general: 19, pediatric: 4 },
    { time: '09:00 PM', icu: 3, general: 18, pediatric: 4 },
    { time: '11:00 PM', icu: 4, general: 17, pediatric: 3 },
  ];

  const revenueBreakdown = [
    { category: 'Procedures', amount: 110000 },
    { category: 'Room Rent', amount: 49000 },
    { category: 'Pharmacy', amount: 26500 },
    { category: 'Diagnostics', amount: 16500 },
    { category: 'Consultation', amount: 14500 },
    { category: 'Nursing Care', amount: 15000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Hero Banner with Shishutaa Light Theme Styling */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-white via-rose-50/70 to-pink-50/50 border border-rose-100 shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-rose-100 text-[#8C2237] text-xs font-bold border border-rose-200 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Shishutaa AI Enterprise Board
              </span>
              <span className="text-slate-400 text-xs font-mono">• Live Telemetry</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B22] tracking-tight">
              Hospital Operations Overview
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Nurturing quality healthcare at every branch. Occupancy rate is optimal at <strong className="text-[#8C2237] font-bold">{bedOccupancyRate}%</strong> with {emergencyCount} critical emergency cases under active observation in Trauma Bay.
            </p>
          </div>

          {/* Shishutaa Pill Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewPatient}
              className="shishutaa-btn-primary px-5 py-3 font-bold text-xs flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> + New Patient Admission
            </button>
            <button
              onClick={onOpenNewAppointment}
              className="px-5 py-3 rounded-full bg-white hover:bg-rose-50 text-[#8C2237] border border-rose-200 font-bold text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-rose-600" /> + Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Patients */}
        <div className="shishutaa-card shishutaa-card-hover p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Active Patients</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-[#8C2237] border border-rose-100">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#2D1B22]">{patients.length}</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" /> {admittedCount} Inpatients
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> {patients.filter(p => p.admissionStatus === 'Outpatient').length} OPD & {emergencyCount} ER
          </p>
        </div>

        {/* KPI 2: Bed Occupancy */}
        <div className="shishutaa-card shishutaa-card-hover p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ICU & Ward Occupancy</span>
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
              <BedDouble className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#2D1B22]">{bedOccupancyRate}%</span>
            <span className="text-xs text-[#8C2237] font-bold">
              {occupiedBeds}/{totalBeds} Beds Occupied
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-[#8C2237] rounded-full"
              style={{ width: `${bedOccupancyRate}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Today's Appointments */}
        <div className="shishutaa-card shishutaa-card-hover p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Appointments</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#2D1B22]">{appointments.length}</span>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {appointments.filter(a => a.status === 'In-Progress').length} Consultation
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Next slot at 09:30 AM
          </p>
        </div>

        {/* KPI 4: Financial Billing */}
        <div className="shishutaa-card shishutaa-card-hover p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Billed Today</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
              <Receipt className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#2D1B22]">₹{(totalRevenue / 1000).toFixed(1)}k</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Collected: <span className="text-[#8C2237] font-bold">₹{(collectedRevenue / 1000).toFixed(1)}k</span>
          </p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Occupancy Area Chart */}
        <div className="lg:col-span-2 shishutaa-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2D1B22] flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-[#8C2237]" /> Departmental Occupancy Telemetry
              </h3>
              <p className="text-xs text-slate-500">24-Hour Patient Volume across ICU, General & Pediatric wards</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[#8C2237] font-bold">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="icuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C2237" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#8C2237" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F4D1D9', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="icu" name="ICU Cases" stroke="#8C2237" strokeWidth={2} fillOpacity={1} fill="url(#icuGrad)" />
                <Area type="monotone" dataKey="general" name="General Ward" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#genGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown Bar Chart */}
        <div className="shishutaa-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2D1B22] flex items-center gap-2">
                <Receipt className="w-4.5 h-4.5 text-amber-600" /> Revenue Stream
              </h3>
              <p className="text-xs text-slate-500">Departmental billing breakdown</p>
            </div>
            <button 
              onClick={() => setActiveTab('billing')}
              className="text-xs text-[#8C2237] hover:underline font-bold"
            >
              Invoices →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBreakdown} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(val) => `₹${val / 1000}k`} />
                <YAxis type="category" dataKey="category" stroke="#64748B" fontSize={10} width={75} />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Billed']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F4D1D9', borderRadius: '16px' }}
                />
                <Bar dataKey="amount" fill="#8C2237" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Critical ICU Patient Vitals Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="shishutaa-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D1B22] flex items-center gap-2">
              <Stethoscope className="w-4.5 h-4.5 text-[#8C2237] animate-pulse" /> Critical Patient Vitals Watchlist
            </h3>
            <span className="text-xs text-slate-500 font-semibold">2 Inpatients Flagged</span>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 2).map((patient) => (
              <div key={patient.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-rose-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#8C2237] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#2D1B22]">{patient.name}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-100 text-[#8C2237] font-mono font-bold">
                        {patient.bedNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{patient.diagnosis}</p>
                  </div>
                </div>

                {/* Vitals Pills */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">BP</span>
                    <span className="font-bold text-rose-700">{patient.vitals.bp}</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">SpO2</span>
                    <span className="font-bold text-teal-700">{patient.vitals.spO2}%</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">Pulse</span>
                    <span className="font-bold text-amber-700">{patient.vitals.pulse} bpm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shishutaa AI Copilot Live Insights Widget */}
        <div className="shishutaa-card p-6 rounded-3xl space-y-4 bg-gradient-to-br from-white via-rose-50/40 to-pink-50/30">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D1B22] flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#8C2237]" /> Shishutaa AI Recommendations
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-[#8C2237] text-white shadow-xs">
              RAG Engine
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">ICU Bed Re-allocation Recommended</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  General Ward bed #GEN-02 is ready for step-down transfer of Patient Aarav Sharma. Frees up 1 ICU Ventilator bed.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">TPA Insurance Pre-Authorization Warning</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Star Health claim #SH-992381-A requires physician signature update before 04:00 PM.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai-hub')}
            className="w-full py-3 rounded-full bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-[#8C2237] font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-rose-600" /> Launch AI Copilot & Voice Receptionist
          </button>
        </div>

      </div>

    </div>
  );
};

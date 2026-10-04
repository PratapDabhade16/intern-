import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Bell, 
  Search, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { ShishutaaLogo } from './ShishutaaLogo';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onOpenSearch: () => void;
  emergencyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRole, 
  onRoleChange, 
  onOpenSearch,
  emergencyCount 
}) => {
  const [time, setTime] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    { id: 'Super Admin / Director', label: '👑 Super Admin / Director' },
    { id: 'Senior Doctor', label: '👨‍⚕️ Senior Doctor / Consultant' },
    { id: 'Ward Nurse Manager', label: '👩‍⚕️ Ward Nurse Manager' },
    { id: 'Billing & Finance Officer', label: '💳 Billing & Finance Officer' },
    { id: 'Lead Pharmacist', label: '💊 Lead Pharmacist' },
    { id: 'AI Systems Auditor', label: '🤖 AI Systems Auditor' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shishutaa-header-glass px-4 lg:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Branding with Exact Shishutaa Tree Logo */}
        <div className="flex items-center gap-3">
          <ShishutaaLogo className="w-10 h-10" showTagline={true} />
        </div>

        {/* Quick Global Search Trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#8C2237] transition-colors" />
              <span>Search patients, doctors, beds, prescriptions...</span>
            </div>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-300 rounded-full shadow-xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Status Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Live Clock & Emergency Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-xs font-mono text-[#8C2237] font-semibold">
            <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>{time || '10:00:00 AM'}</span>
          </div>

          {emergencyCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{emergencyCount} ER Alerts</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-700 hover:text-[#8C2237] transition-colors shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-rose-100 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <h4 className="text-xs font-bold text-[#8C2237] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-500" /> Real-time System Alerts
                  </h4>
                  <span className="text-[10px] text-slate-400">Just Now</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-800 flex gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Emergency Trauma Admission</p>
                      <p className="text-[11px] text-red-600">Patient Rajesh Patel admitted to ER Bed-01 with Femur Fracture.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 flex gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-teal-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">AI Voice Receptionist Log</p>
                      <p className="text-[11px] text-teal-600">Handled 3 automated appointment bookings in the last 15 mins.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Button (Shishutaa Pill Button Style) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-[#8C2237] transition-all shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline-block max-w-[130px] truncate">{currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-rose-100 shadow-xl p-2 z-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                  Switch Active RBAC View
                </p>
                <div className="space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        currentRole === r.id 
                          ? 'bg-[#8C2237] text-white font-bold shadow-sm' 
                          : 'text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <span>{r.label}</span>
                      {currentRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

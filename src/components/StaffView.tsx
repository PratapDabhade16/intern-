import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Clock, 
  Star, 
  CheckCircle2, 
  Phone, 
  Mail
} from 'lucide-react';
import type { StaffMember } from '../data/hospitalData';

interface StaffViewProps {
  staff: StaffMember[];
}

export const StaffView: React.FC<StaffViewProps> = ({ staff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const roles = Array.from(new Set(staff.map(s => s.role)));

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.empId.toLowerCase().includes(searchTerm.toLowerCase()) || s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-rose-500" /> Staff Directory & Duty Shift Roster
          </h2>
          <p className="text-xs text-slate-400">Doctor duty shifts, nursing schedules, ratings & Role-Based Access Control (RBAC)</p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4" /> {staff.filter(s => s.status === 'On Duty').length} Staff Currently On Duty
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff name, EMP ID or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setRoleFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              roleFilter === 'All' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            All Roles
          </button>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                roleFilter === r ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {r}s
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div key={member.id} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-800 to-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{member.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{member.empId} • {member.role}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {member.status}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-300 font-semibold">{member.department}</p>
              {member.specialization && (
                <p className="text-slate-400 text-[11px]">{member.specialization}</p>
              )}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-rose-400" /> {member.shift}</span>
                <span className="flex items-center gap-1 font-bold text-amber-400"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {member.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {member.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {member.email.split('@')[0]}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

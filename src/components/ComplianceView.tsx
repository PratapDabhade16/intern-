import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck 
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const auditLogs = [
    { time: '2026-10-03 22:45:12', user: 'Dr. Vikram Malhotra', action: 'Accessed Patient EHR Record #SH-2026-8801', category: 'EHR Access', status: 'Approved' },
    { time: '2026-10-03 21:10:00', user: 'Billing Admin (Kavya P)', action: 'Issued Invoice #INV-SH-2026-0091 for ₹1,85,000', category: 'Billing', status: 'Approved' },
    { time: '2026-10-03 19:30:44', user: 'Shishutaa AI Voice Bot', action: 'Auto-assigned Bed #PED-01 for Emergency admission', category: 'Bed Allocation', status: 'System Event' },
    { time: '2026-10-03 18:00:00', user: 'Pharmacist (Rahul S)', action: 'Dispensed 10x Augmentin 625mg for Patient Priya Deshmukh', category: 'Pharmacy', status: 'Approved' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#8C2237]" /> NABH Accreditation & HIPAA Audit Compliance
          </h2>
          <p className="text-xs text-slate-500">Security standards compliance, role-based access logs & encrypted database backups</p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-teal-600" /> 100% Compliant with NABH Standards
        </span>
      </div>

      {/* Compliance Standard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="shishutaa-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#2D1B22] text-sm">NABH Standards Score</h4>
            <span className="text-teal-700 font-extrabold text-sm">99.2%</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Clinical governance, medication safety, patient rights & fire safety audits verified.</p>
        </div>

        <div className="shishutaa-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#2D1B22] text-sm">HIPAA Data Security</h4>
            <span className="text-teal-700 font-extrabold text-sm">256-Bit AES</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">End-to-end encrypted EHR data storage & secure TLS 1.3 telemetry transmission.</p>
        </div>

        <div className="shishutaa-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#2D1B22] text-sm">Database Replication</h4>
            <span className="text-teal-700 font-extrabold text-sm">AWS S3 Sync</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Automated hourly snapshot backup with failover redundant cluster in Mumbai AWS.</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="shishutaa-card rounded-3xl overflow-hidden shadow-xs space-y-3 p-6">
        <h3 className="text-base font-bold text-[#2D1B22] flex items-center gap-2">
          <FileCheck className="w-4.5 h-4.5 text-[#8C2237]" /> System Immutable Audit Trail
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/70 border-b border-rose-100 text-[11px] font-extrabold uppercase tracking-wider text-[#8C2237]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User / Agent</th>
                <th className="py-3.5 px-4">Action Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-rose-50/40">
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">{log.user}</td>
                  <td className="py-3 px-4 text-slate-700 font-sans">{log.action}</td>
                  <td className="py-3 px-4 text-teal-700 font-bold">{log.category}</td>
                  <td className="py-3 px-4 text-right font-bold text-teal-700">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

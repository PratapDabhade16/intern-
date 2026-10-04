import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BedDouble, 
  Receipt, 
  Pill, 
  UserCheck, 
  Bot, 
  Globe, 
  Shield, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: {
    patients: number;
    appointments: number;
    beds: number;
    invoices: number;
    inventory: number;
    staff: number;
    aiCalls: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, counts }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard, category: 'Core' },
    { id: 'patients', label: 'Patient Management', icon: Users, count: counts.patients, category: 'Clinical' },
    { id: 'appointments', label: 'Doctor Schedule & Queue', icon: Calendar, count: counts.appointments, category: 'Clinical' },
    { id: 'beds', label: 'Bed & ICU Occupancy', icon: BedDouble, count: counts.beds, category: 'Clinical' },
    { id: 'billing', label: 'Billing & TPA Claims', icon: Receipt, count: counts.invoices, category: 'Operations' },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill, count: counts.inventory, category: 'Operations' },
    { id: 'staff', label: 'Staff & Duty Roster', icon: UserCheck, count: counts.staff, category: 'Operations' },
    { id: 'ai-hub', label: 'Shishutaa AI Core Hub', icon: Bot, isAi: true, count: counts.aiCalls, category: 'AI & Automation' },
    { id: 'scraping', label: 'Scraping & Automation', icon: Globe, category: 'AI & Automation' },
    { id: 'compliance', label: 'NABH & Audit Logs', icon: Shield, category: 'Compliance' },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block shishutaa-sidebar-glass min-h-[calc(100vh-65px)] p-3">
      
      {/* Hospital Branch Selector & Status */}
      <div className="p-3 mb-3 rounded-2xl bg-gradient-to-br from-rose-50/80 to-pink-50/50 border border-rose-100 text-xs shadow-xs">
        <div className="flex items-center justify-between text-slate-500 font-semibold mb-1">
          <span>Active Branch</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <p className="font-bold text-[#8C2237]">Shishutaa Campus #1</p>
        <p className="text-[11px] text-slate-500">Super Specialty Wing, Kanpur</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          const showHeader = idx === 0 || menuItems[idx - 1].category !== item.category;

          return (
            <React.Fragment key={item.id}>
              {showHeader && (
                <div className="pt-3 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {item.category}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#8C2237] text-white shadow-md shadow-rose-900/20 font-bold scale-[1.01]'
                    : item.isAi
                    ? 'bg-rose-50 text-[#8C2237] hover:bg-rose-100/80 border border-rose-200'
                    : 'text-slate-600 hover:text-[#8C2237] hover:bg-rose-50/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : item.isAi ? 'text-rose-600' : 'text-slate-400 group-hover:text-[#8C2237]'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.isAi
                        ? 'bg-rose-200 text-[#8C2237]'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-rose-100 group-hover:text-[#8C2237]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {item.isAi && !isActive && (
                    <Sparkles className="w-3 h-3 text-rose-600 animate-pulse" />
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-white/90" />
                  )}
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* AI Automation Teaser Widget in Sidebar */}
      <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/60 border border-rose-200/80 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-[#8C2237] font-bold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>AI Revenue Optimization</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Shishutaa AI detected 0 billing leakages & automated 88% patient inquiries today.
        </p>
        <button 
          onClick={() => setActiveTab('ai-hub')}
          className="mt-2.5 w-full py-1.5 px-3 rounded-full bg-[#8C2237] hover:bg-[#74192B] text-white font-bold text-[11px] transition-all shadow-xs flex items-center justify-center gap-1"
        >
          Open AI Hub <ChevronRight className="w-3 h-3" />
        </button>
      </div>

    </aside>
  );
};

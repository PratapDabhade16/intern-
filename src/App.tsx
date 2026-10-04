import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { AppointmentsView } from './components/AppointmentsView';
import { BedsView } from './components/BedsView';
import { BillingView } from './components/BillingView';
import { PharmacyView } from './components/PharmacyView';
import { StaffView } from './components/StaffView';
import { AiHubView } from './components/AiHubView';
import { ScrapingView } from './components/ScrapingView';
import { ComplianceView } from './components/ComplianceView';
import { QuickSearchModal } from './components/QuickSearchModal';
import { PrintBillModal } from './components/PrintBillModal';

import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_BEDS, 
  INITIAL_INVOICES, 
  INITIAL_INVENTORY, 
  INITIAL_STAFF, 
  INITIAL_AI_CALL_LOGS, 
  INITIAL_SCRAPING_JOBS
} from './data/hospitalData';

import type {
  Patient,
  Appointment,
  Bed,
  Invoice,
  InventoryItem,
  StaffMember,
  VoiceCallLog,
  ScrapingJob
} from './data/hospitalData';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<string>('Super Admin / Director');

  // Application Master Data States
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [aiCallLogs, setAiCallLogs] = useState<VoiceCallLog[]>(INITIAL_AI_CALL_LOGS);
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingJob[]>(INITIAL_SCRAPING_JOBS);

  // Modal Control States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddAptModal, setShowAddAptModal] = useState(false);
  const [preSelectedPatientForBill, setPreSelectedPatientForBill] = useState<Patient | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  // Data Handlers
  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleUpdatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleUpdateBed = (updatedBed: Bed) => {
    setBeds(prev => prev.map(b => b.id === updatedBed.id ? updatedBed : b));
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices(prev => [newInv, ...prev]);
  };

  const handleAddInventory = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
  };

  const handleDispenseInventory = (id: string, qty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.stockQty - qty);
        return {
          ...item,
          stockQty: newQty,
          status: newQty <= item.reorderLevel ? (newQty === 0 ? 'Critical' : 'Low Stock') : 'In Stock'
        };
      }
      return item;
    }));
  };

  const handleAddCallLog = (newLog: VoiceCallLog) => {
    setAiCallLogs(prev => [newLog, ...prev]);
  };

  const handleTriggerScrapingJob = (id: string) => {
    setScrapingJobs(prev => prev.map(job => {
      if (job.id === id) {
        return {
          ...job,
          recordsExtracted: job.recordsExtracted + 42,
          lastRun: 'Just now',
          status: 'Active'
        };
      }
      return job;
    }));
  };

  const handleSelectPatientForBill = (patient: Patient) => {
    setPreSelectedPatientForBill(patient);
    setActiveTab('billing');
  };

  const emergencyPatientsCount = patients.filter(p => p.admissionStatus === 'Emergency').length;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-rose-700 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenSearch={() => setIsSearchOpen(true)}
        emergencyCount={emergencyPatientsCount}
      />

      {/* Main App Layout */}
      <div className="flex flex-1">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{
            patients: patients.length,
            appointments: appointments.length,
            beds: beds.length,
            invoices: invoices.length,
            inventory: inventory.length,
            staff: staff.length,
            aiCalls: aiCallLogs.length
          }}
        />

        {/* Content Body Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              beds={beds}
              invoices={invoices}
              appointments={appointments}
              setActiveTab={setActiveTab}
              onOpenNewPatient={() => {
                setActiveTab('patients');
                setShowAddPatientModal(true);
              }}
              onOpenNewAppointment={() => {
                setActiveTab('appointments');
                setShowAddAptModal(true);
              }}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onAddPatient={handleAddPatient}
              onUpdatePatient={handleUpdatePatient}
              onSelectPatientForBill={handleSelectPatientForBill}
              showAddModal={showAddPatientModal}
              setShowAddModal={setShowAddPatientModal}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              showAddModal={showAddAptModal}
              setShowAddModal={setShowAddAptModal}
            />
          )}

          {activeTab === 'beds' && (
            <BedsView
              beds={beds}
              patients={patients}
              onUpdateBed={handleUpdateBed}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              invoices={invoices}
              patients={patients}
              onAddInvoice={handleAddInvoice}
              onPrintInvoice={(inv) => setPrintInvoice(inv)}
              preSelectedPatientForBill={preSelectedPatientForBill}
            />
          )}

          {activeTab === 'pharmacy' && (
            <PharmacyView
              inventory={inventory}
              onAddInventory={handleAddInventory}
              onDispenseItem={handleDispenseInventory}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView
              staff={staff}
            />
          )}

          {activeTab === 'ai-hub' && (
            <AiHubView
              callLogs={aiCallLogs}
              onAddCallLog={handleAddCallLog}
            />
          )}

          {activeTab === 'scraping' && (
            <ScrapingView
              scrapingJobs={scrapingJobs}
              onTriggerJob={handleTriggerScrapingJob}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceView />
          )}
        </main>

      </div>

      {/* Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        patients={patients}
        beds={beds}
        inventory={inventory}
        setActiveTab={setActiveTab}
      />

      {/* Printable PDF Bill Modal */}
      <PrintBillModal
        invoice={printInvoice}
        onClose={() => setPrintInvoice(null)}
      />

    </div>
  );
}

export default App;

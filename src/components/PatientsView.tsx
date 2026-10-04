import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Activity, 
  Receipt, 
  X, 
  CheckCircle2, 
  Stethoscope,
  Heart,
  Thermometer,
  ShieldAlert,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Patient } from '../data/hospitalData';

interface PatientsViewProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onSelectPatientForBill: (patient: Patient) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onSelectPatientForBill,
  showAddModal,
  setShowAddModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    admissionStatus: 'Admitted' as 'Admitted' | 'Outpatient' | 'Emergency',
    department: 'Cardiology',
    attendingDoctor: 'Dr. Vikram Malhotra (MD, Cardiology)',
    ward: 'General Ward',
    bedNumber: 'GEN-05',
    diagnosis: '',
    allergies: '',
    insuranceProvider: '',
    insurancePolicyNo: '',
    totalBill: 15000,
    paidAmount: 5000
  });

  // Filter Patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || p.admissionStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newUhid = `SH-2026-${Math.floor(8000 + Math.random() * 1000)}`;
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      uhid: newUhid,
      name: formData.name,
      age: Number(formData.age) || 30,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: formData.address || 'Kanpur, UP',
      admissionStatus: formData.admissionStatus,
      department: formData.department,
      attendingDoctor: formData.attendingDoctor,
      ward: formData.ward,
      bedNumber: formData.bedNumber,
      admissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      vitals: { bp: '120/80', pulse: 75, spO2: 98, temp: 98.6, respRate: 18 },
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
      diagnosis: formData.diagnosis || 'Routine Evaluation & Observation',
      totalBill: Number(formData.totalBill) || 10000,
      paidAmount: Number(formData.paidAmount) || 5000,
      insuranceProvider: formData.insuranceProvider || undefined,
      insurancePolicyNo: formData.insurancePolicyNo || undefined
    };

    onAddPatient(newPatient);
    setShowAddModal(false);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDischarge = (patient: Patient) => {
    const updated: Patient = {
      ...patient,
      admissionStatus: 'Discharged'
    };
    onUpdatePatient(updated);
    setSelectedPatient(updated);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#8C2237]" /> Patient Management & EHR Registry
          </h2>
          <p className="text-xs text-slate-500">Electronic Health Records, Medical History, Vitals & Admissions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="shishutaa-btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register New Patient
        </button>
      </div>

      {/* Search Bar & Filters */}
      <div className="shishutaa-card p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, UHID, Phone or Diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8C2237] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Admitted', 'Emergency', 'Outpatient', 'Discharged'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-[#8C2237] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-[#8C2237] border border-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <div className="shishutaa-card rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/70 border-b border-rose-100 text-[11px] font-extrabold uppercase tracking-wider text-[#8C2237]">
                <th className="py-4 px-5">Patient UHID & Name</th>
                <th className="py-4 px-5">Age / Gender</th>
                <th className="py-4 px-5">Status & Ward</th>
                <th className="py-4 px-5">Attending Specialist</th>
                <th className="py-4 px-5">Diagnosis</th>
                <th className="py-4 px-5">Vitals Check</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No patient records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const statusColors: Record<string, string> = {
                    Admitted: 'bg-teal-50 text-teal-700 border-teal-200',
                    Emergency: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
                    Outpatient: 'bg-blue-50 text-blue-700 border-blue-200',
                    Discharged: 'bg-slate-100 text-slate-600 border-slate-200'
                  };

                  return (
                    <tr key={patient.id} className="hover:bg-rose-50/40 transition-colors">
                      
                      {/* UHID & Name */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#8C2237] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block hover:text-[#8C2237] cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                              {patient.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{patient.uhid}</span>
                          </div>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3.5 px-5 text-slate-700">
                        {patient.age} yrs • {patient.gender}
                        <span className="block text-[10px] text-rose-700 font-bold">{patient.bloodGroup}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full border ${statusColors[patient.admissionStatus] || ''}`}>
                          {patient.admissionStatus}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">{patient.bedNumber}</span>
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-5 text-slate-800 font-semibold">
                        {patient.attendingDoctor.split(' (')[0]}
                        <span className="block text-[10px] text-slate-400 font-normal">{patient.department}</span>
                      </td>

                      {/* Diagnosis */}
                      <td className="py-3.5 px-5 text-slate-600 max-w-xs truncate">
                        {patient.diagnosis}
                      </td>

                      {/* Vitals */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-mono font-bold text-teal-700">
                            BP {patient.vitals.bp}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-mono font-bold text-rose-700">
                            {patient.vitals.spO2}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="p-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8C2237] border border-slate-200 transition-colors"
                            title="View EHR Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectPatientForBill(patient)}
                            className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-[#8C2237] border border-rose-200 transition-colors"
                            title="Generate Bill"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detailed EHR Drawer/Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 relative text-slate-800">
            
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* EHR Header */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-[#8C2237] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h3>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {selectedPatient.admissionStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  UHID: {selectedPatient.uhid} • Age: {selectedPatient.age} ({selectedPatient.gender}) • Blood Group: <strong className="text-rose-700">{selectedPatient.bloodGroup}</strong>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  📞 {selectedPatient.phone} | ✉️ {selectedPatient.email}
                </p>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <Heart className="w-4 h-4 text-rose-600 mx-auto mb-1 animate-pulse" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Blood Pressure</span>
                <span className="text-sm font-bold text-slate-900">{selectedPatient.vitals.bp} mmHg</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <Activity className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Oxygen SpO2</span>
                <span className="text-sm font-bold text-slate-900">{selectedPatient.vitals.spO2}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <Thermometer className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Body Temp</span>
                <span className="text-sm font-bold text-slate-900">{selectedPatient.vitals.temp} °F</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <Stethoscope className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Pulse Rate</span>
                <span className="text-sm font-bold text-slate-900">{selectedPatient.vitals.pulse} bpm</span>
              </div>
            </div>

            {/* Medical Diagnosis & Doctor Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                <h4 className="font-bold text-[#8C2237] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Primary Clinical Diagnosis
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedPatient.diagnosis}
                </p>
                <p className="text-slate-500 pt-2 border-t border-rose-100">
                  Attending Physician: <strong className="text-slate-900">{selectedPatient.attendingDoctor}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                <h4 className="font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Allergies & Precautions
                </h4>
                {selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.allergies.map((alg, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold">
                        ⚠️ {alg}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No known drug allergies reported.</p>
                )}
                {selectedPatient.insuranceProvider && (
                  <p className="text-slate-500 pt-2 border-t border-amber-100">
                    Insurance Provider: <strong className="text-slate-900">{selectedPatient.insuranceProvider}</strong> ({selectedPatient.insurancePolicyNo})
                  </p>
                )}
              </div>
            </div>

            {/* Bottom EHR Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Total Ledger Amount</span>
                <span className="text-lg font-black text-[#8C2237]">₹{selectedPatient.totalBill.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedPatient.admissionStatus !== 'Discharged' && (
                  <button
                    onClick={() => handleDischarge(selectedPatient)}
                    className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Process Discharge
                  </button>
                )}
                <button
                  onClick={() => {
                    const p = selectedPatient;
                    setSelectedPatient(null);
                    onSelectPatientForBill(p);
                  }}
                  className="shishutaa-btn-primary px-5 py-2 font-bold text-xs flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" /> Issue Billing Invoice
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add New Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 relative text-slate-800">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-[#8C2237] border border-rose-200">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Register New Patient</h3>
                <p className="text-xs text-slate-500">Generate UHID and assign ward & attending specialist</p>
              </div>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#8C2237]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#8C2237]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Admission Status</label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="Admitted">Inpatient (Admitted)</option>
                    <option value="Emergency">Emergency Trauma</option>
                    <option value="Outpatient">Outpatient Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Attending Specialist</label>
                  <select
                    value={formData.attendingDoctor}
                    onChange={(e) => setFormData({ ...formData, attendingDoctor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="Dr. Vikram Malhotra (MD, Cardiology)">Dr. Vikram Malhotra (Cardiology)</option>
                    <option value="Dr. Ananya Roy (DCH, Pediatrics)">Dr. Ananya Roy (Pediatrics)</option>
                    <option value="Dr. Rajesh Kulkarni (DM Neuro)">Dr. Rajesh Kulkarni (Neurology)</option>
                    <option value="Dr. Suresh Varma (MS Ortho)">Dr. Suresh Varma (Orthopedics)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Diagnosis / Complaints</label>
                <textarea
                  rows={2}
                  placeholder="Describe patient symptoms or preliminary clinical observations..."
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#8C2237]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shishutaa-btn-primary px-6 py-2.5 font-bold"
                >
                  Confirm Registration
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

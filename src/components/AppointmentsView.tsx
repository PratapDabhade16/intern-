import React, { useState } from 'react';
import { 
  Calendar, 
  UserCheck, 
  Video, 
  Plus, 
  Search, 
  CheckCircle2, 
  X, 
  PhoneCall, 
  Send,
  MessageSquare
} from 'lucide-react';
import type { Appointment } from '../data/hospitalData';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onAddAppointment,
  onUpdateStatus,
  showAddModal,
  setShowAddModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTeleConsult, setActiveTeleConsult] = useState<Appointment | null>(null);
  const [teleChatMessages, setTeleChatMessages] = useState<string[]>([
    'Dr. Kulkarni joined the secure video consultation channel.',
    'Patient submitted latest BP log: 124/80 mmHg.'
  ]);
  const [chatInput, setChatInput] = useState('');

  // New Appointment Form
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorName: 'Dr. Vikram Malhotra (MD, Cardiology)',
    department: 'Cardiology',
    date: '2026-10-04',
    timeSlot: '11:30 AM',
    type: 'In-Person' as 'In-Person' | 'Tele-Consultation' | 'Follow-up',
    symptoms: ''
  });

  const filteredAppointments = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientPhone) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      doctorName: formData.doctorName,
      department: formData.department,
      date: formData.date,
      timeSlot: formData.timeSlot,
      type: formData.type,
      status: 'Scheduled',
      symptoms: formData.symptoms || 'Routine Specialist Consultation',
      tokenNo: 100 + appointments.length + 1
    };

    onAddAppointment(newApt);
    setShowAddModal(false);
  };

  const handleSendTeleMsg = () => {
    if (!chatInput.trim()) return;
    setTeleChatMessages(prev => [...prev, `Doctor: ${chatInput}`]);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#8C2237]" /> Doctor Schedules & Token Queue
          </h2>
          <p className="text-xs text-slate-500">Manage OPD booking, token numbers, and live Tele-Consultations</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="shishutaa-btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Book OPD Appointment
        </button>
      </div>

      {/* Token & Doctor Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl shishutaa-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
            101
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Active Token</span>
            <span className="text-sm font-bold text-[#2D1B22]">Dr. Vikram Malhotra (Cardiology)</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl shishutaa-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#8C2237] border border-rose-200 flex items-center justify-center font-bold text-sm">
            {appointments.filter(a => a.status === 'Scheduled').length}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Waiting in OPD Lobby</span>
            <span className="text-sm font-bold text-[#2D1B22]">Estimated wait: ~12 mins</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl shishutaa-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tele-Consult Room</span>
            <span className="text-sm font-bold text-[#2D1B22]">1 Session Ready</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="shishutaa-card p-4 rounded-3xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, Doctor or Specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8C2237]"
          />
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.map((apt) => (
          <div 
            key={apt.id}
            className="shishutaa-card shishutaa-card-hover p-5 rounded-3xl flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[#8C2237] font-mono font-bold text-xs">
                  Token #{apt.tokenNo}
                </span>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'In-Progress'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    : apt.status === 'Completed'
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {apt.status}
                </span>
              </div>

              <h4 className="font-bold text-base text-[#2D1B22]">{apt.patientName}</h4>
              <p className="text-xs text-slate-500">📞 {apt.patientPhone}</p>

              <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span>{apt.doctorName}</span>
                  <span className="text-[10px] text-teal-700 font-mono font-bold">{apt.timeSlot}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic">"{apt.symptoms}"</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
                {apt.type === 'Tele-Consultation' ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <UserCheck className="w-3.5 h-3.5 text-rose-600" />}
                {apt.type}
              </span>

              <div className="flex items-center gap-2">
                {apt.type === 'Tele-Consultation' && (
                  <button
                    onClick={() => setActiveTeleConsult(apt)}
                    className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" /> Launch Call
                  </button>
                )}

                {apt.status !== 'Completed' && (
                  <button
                    onClick={() => onUpdateStatus(apt.id, 'Completed')}
                    className="px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Tele-Consultation Studio Modal */}
      {activeTeleConsult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-4xl bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-4 text-slate-800">
            
            <button
              onClick={() => setActiveTeleConsult(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
                <Video className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Encrypted Tele-Consultation Studio</h3>
                <p className="text-xs text-slate-500">Patient: {activeTeleConsult.patientName} • Specialist: {activeTeleConsult.doctorName}</p>
              </div>
            </div>

            {/* Video Feeds & Chat Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              <div className="lg:col-span-2 space-y-3">
                <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 rounded-full bg-[#8C2237] mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                      DK
                    </div>
                    <p className="font-bold text-white text-sm">Dr. Rajesh Kulkarni (DM Neuro)</p>
                    <p className="text-xs text-teal-400 font-mono flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> 1080p HD Live Stream
                    </p>
                  </div>

                  <div className="absolute bottom-3 right-3 w-32 aspect-video rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                    <span className="text-[10px] text-slate-200 font-semibold">{activeTeleConsult.patientName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 py-2">
                  <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">
                    <PhoneCall className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveTeleConsult(null)}
                    className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                  >
                    End Session
                  </button>
                </div>
              </div>

              {/* Chat & Rx */}
              <div className="shishutaa-card p-4 rounded-2xl flex flex-col justify-between h-[360px]">
                <div>
                  <h4 className="text-xs font-bold text-[#8C2237] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-rose-600" /> Session Notes & Chat
                  </h4>
                  <div className="space-y-2 h-56 overflow-y-auto text-xs pr-1">
                    {teleChatMessages.map((msg, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Type doctor response or Rx..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTeleMsg()}
                    className="w-full px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  />
                  <button
                    onClick={handleSendTeleMsg}
                    className="p-2 rounded-full bg-[#8C2237] hover:bg-[#74192B] text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-slate-800">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">Book OPD Consultation</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kavita Sharma"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98000 00000"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specialist Doctor</label>
                  <select
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="Dr. Vikram Malhotra (MD, Cardiology)">Dr. Vikram Malhotra (Cardiology)</option>
                    <option value="Dr. Ananya Roy (DCH, Pediatrics)">Dr. Ananya Roy (Pediatrics)</option>
                    <option value="Dr. Rajesh Kulkarni (DM Neuro)">Dr. Rajesh Kulkarni (Neurology)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Consultation Mode</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="In-Person">In-Person OPD</option>
                    <option value="Tele-Consultation">Tele-Consultation</option>
                    <option value="Follow-up">Follow-up Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Chief Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="Describe patient complaints..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
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
                  className="shishutaa-btn-primary px-6 py-2 font-bold"
                >
                  Generate Token & Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Bot, 
  Mic, 
  Volume2, 
  Sparkles, 
  Activity, 
  Play, 
  Square, 
  Cpu, 
  RefreshCw 
} from 'lucide-react';
import type { VoiceCallLog } from '../data/hospitalData';

interface AiHubViewProps {
  callLogs: VoiceCallLog[];
  onAddCallLog: (log: VoiceCallLog) => void;
}

export const AiHubView: React.FC<AiHubViewProps> = ({ callLogs, onAddCallLog }) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'appointment' | 'bed' | 'lab'>('appointment');
  
  // Clinical RAG Assistant State
  const [clinicalPrompt, setClinicalPrompt] = useState('Patient 34yo male presenting with sudden acute retrosternal chest pain radiating to left arm, diaphoresis, BP 142/90 mmHg, Pulse 92 bpm.');
  const [isRagAnalyzing, setIsRagAnalyzing] = useState(false);
  const [ragResult, setRagResult] = useState<any>({
    primaryDiagnosis: 'Acute Coronary Syndrome (ST-Elevation Myocardial Infarction rule-out)',
    icd10Code: 'ICD-10 I21.9',
    recommendedTests: ['STAT 12-Lead ECG within 10 mins', 'Troponin-I High Sensitivity', 'CK-MB & Lipid Profile'],
    drugContraindications: ['Avoid NSAIDs/Ibuprofen', 'Administer Aspirin 325mg chewable + Clopidogrel 300mg stat'],
    confidenceScore: '96.4%'
  });

  // Voice Call Simulator logic with browser Speech Synthesis
  const handleSimulateVoiceCall = () => {
    setIsPlayingVoice(true);

    let textToSpeak = '';
    let logSummary = '';
    let actionTaken = '';

    if (activeScenario === 'appointment') {
      textToSpeak = "Namaste! Welcome to Shishutaa Super Specialty Hospital AI Receptionist. I have confirmed your appointment with Dr. Vikram Malhotra for tomorrow at 9:30 AM. Token number 101 has been sent to your WhatsApp.";
      logSummary = "AI Receptionist authenticated patient voice, verified doctor schedule availability, and booked OPD Token #101.";
      actionTaken = "Booked Appointment & Dispatched SMS Confirmation via Twilio API";
    } else if (activeScenario === 'bed') {
      textToSpeak = "Shishutaa Hospital AI Desk. We currently have 1 Pediatric ICU bed and 2 General Ward beds available. Reserving Pediatric Bed Number PED-01 for your incoming transfer.";
      logSummary = "Inquired about Emergency Pediatric ICU Bed. AI reserved Bed #PED-01 and notified ER Charge Nurse.";
      actionTaken = "Reserved Bed #PED-01 & Sent Alert to Trauma Ward";
    } else {
      textToSpeak = "Hello! Your Complete Blood Count and Thyroid profile results for UHID SH-2026-8802 are ready and normal. The encrypted PDF link has been texted to your registered mobile.";
      logSummary = "Requested Lab Report status. AI verified OTP and sent encrypted PDF report via WhatsApp API.";
      actionTaken = "Dispatched PDF Link via WhatsApp Business API";
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      
      utterance.onend = () => {
        setIsPlayingVoice(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingVoice(false), 4000);
    }

    const newLog: VoiceCallLog = {
      id: `call-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      callerPhone: '+91 98201 ' + Math.floor(10005 + Math.random() * 89999),
      callerName: activeScenario === 'appointment' ? 'Sunil Sharma' : activeScenario === 'bed' ? 'Sunita Roy' : 'Vikram Mehta',
      intent: activeScenario === 'appointment' ? 'Appointment Booking' : activeScenario === 'bed' ? 'Bed Availability Inquiry' : 'Lab Report Status',
      transcriptSummary: logSummary,
      aiActionTaken: actionTaken,
      status: 'Handled by AI',
      sentiment: 'Satisfied',
      durationSeconds: 42
    };

    onAddCallLog(newLog);
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
  };

  const handleRunRagAnalysis = () => {
    setIsRagAnalyzing(true);
    setTimeout(() => {
      setIsRagAnalyzing(false);
      setRagResult({
        primaryDiagnosis: 'Acute Coronary Syndrome / Myocardial Infarction Triage',
        icd10Code: 'ICD-10 I21.3',
        recommendedTests: ['12-Lead ECG', 'High-Sensitivity Troponin I', 'Echocardiogram', 'Serum Electrolytes'],
        drugContraindications: ['Nitroglycerin contraindicated if SBP < 90 mmHg', 'Administer Aspirin 325mg STAT'],
        confidenceScore: '97.8%'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-white via-rose-50/80 to-pink-50/50 border border-rose-100 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-[#8C2237] text-xs font-bold border border-rose-200 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Shishutaa Neural Core & LLM Pipeline
              </span>
              <span className="text-teal-700 text-xs font-mono">• Voice STT/TTS & Medical RAG Active</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#2D1B22] tracking-tight">
              AI Voice Receptionist & Medical Copilot Engine
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              End-to-end hospital automation: Multilingual Voice AI triaging, automated appointment booking via Twilio, and clinical RAG decision support.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white border border-rose-200 text-xs font-mono text-[#8C2237] font-bold flex items-center gap-2 shadow-xs">
              <Cpu className="w-4 h-4 text-rose-600" /> Latency: 320ms
            </span>
          </div>
        </div>
      </div>

      {/* Grid: AI Voice Receptionist + Medical RAG Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: AI Voice Receptionist Simulator */}
        <div className="shishutaa-card p-6 rounded-3xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2D1B22] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#8C2237]" /> Interactive AI Voice Receptionist Simulator
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-rose-100 text-[#8C2237] border border-rose-200">
                Speech-to-Text & TTS
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Test how Shishutaa AI answers patient calls, verifies doctor slots, checks ICU beds, and dispatches Twilio SMS confirmations.
            </p>

            {/* Scenario Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <button
                onClick={() => setActiveScenario('appointment')}
                className={`p-2.5 rounded-2xl font-bold transition-all border ${
                  activeScenario === 'appointment'
                    ? 'bg-[#8C2237] text-white border-[#8C2237] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#8C2237]'
                }`}
              >
                📅 OPD Booking Call
              </button>
              <button
                onClick={() => setActiveScenario('bed')}
                className={`p-2.5 rounded-2xl font-bold transition-all border ${
                  activeScenario === 'bed'
                    ? 'bg-[#8C2237] text-white border-[#8C2237] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#8C2237]'
                }`}
              >
                🏥 Bed Inquiry Call
              </button>
              <button
                onClick={() => setActiveScenario('lab')}
                className={`p-2.5 rounded-2xl font-bold transition-all border ${
                  activeScenario === 'lab'
                    ? 'bg-[#8C2237] text-white border-[#8C2237] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#8C2237]'
                }`}
              >
                🧪 Lab Result Call
              </button>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isPlayingVoice ? 'bg-[#8C2237] text-white shadow-md scale-105' : 'bg-white text-[#8C2237] border border-rose-200'
                }`}>
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#2D1B22]">
                    {isPlayingVoice ? 'Shishutaa AI Speaking Out Loud...' : 'Ready to Simulate Voice Call'}
                  </p>
                  <p className="text-[11px] text-slate-500">Language: English / Hindi Auto-Detect</p>
                </div>
              </div>

              {/* Animated Wave Bars */}
              <div className="flex items-center gap-1">
                <div className={`w-1.5 rounded-full bg-[#8C2237] ${isPlayingVoice ? 'voice-bar-1' : 'h-2'}`} />
                <div className={`w-1.5 rounded-full bg-rose-500 ${isPlayingVoice ? 'voice-bar-2' : 'h-3'}`} />
                <div className={`w-1.5 rounded-full bg-teal-500 ${isPlayingVoice ? 'voice-bar-3' : 'h-2'}`} />
                <div className={`w-1.5 rounded-full bg-amber-500 ${isPlayingVoice ? 'voice-bar-4' : 'h-4'}`} />
              </div>
            </div>
          </div>

          {/* Voice Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isPlayingVoice ? (
              <button
                onClick={handleSimulateVoiceCall}
                className="shishutaa-btn-primary flex-1 py-3 px-4 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Trigger AI Voice Call (Hear AI Voice)
              </button>
            ) : (
              <button
                onClick={handleStopVoice}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Audio Speech
              </button>
            )}
          </div>
        </div>

        {/* Module 2: Medical AI Copilot & RAG Clinical Analyzer */}
        <div className="shishutaa-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#2D1B22] flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600" /> Shishutaa Medical RAG Clinical Copilot
            </h3>
            <span className="text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              ICD-10 VECTOR DB
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Enter patient symptoms to query the Shishutaa Vector DB for clinical guidelines, diagnostic probabilities, and contraindication alerts.
          </p>

          <div className="space-y-2">
            <label className="text-slate-700 text-xs font-bold block">Clinical Symptoms & Vitals Input:</label>
            <textarea
              rows={3}
              value={clinicalPrompt}
              onChange={(e) => setClinicalPrompt(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8C2237] font-mono"
            />
          </div>

          <button
            onClick={handleRunRagAnalysis}
            disabled={isRagAnalyzing}
            className="w-full py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
          >
            {isRagAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Querying Embeddings & ICD-10 Vectors...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-100" /> Run Clinical AI RAG Diagnostics
              </>
            )}
          </button>

          {/* RAG Diagnostic Result Card */}
          {ragResult && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-[#8C2237]">{ragResult.primaryDiagnosis}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-teal-700 font-mono text-[10px] font-bold border border-slate-200">
                  {ragResult.icd10Code} • Conf: {ragResult.confidenceScore}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Recommended Diagnostic Panel:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ragResult.recommendedTests.map((t: string, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-medium">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Contraindication & Safety Alerts:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ragResult.drugContraindications.map((c: string, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                      ⚠️ {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Voice Call Telemetry Logs */}
      <div className="shishutaa-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2D1B22] flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-[#8C2237]" /> Real-time Voice AI & Twilio Call Audit Trail
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">{callLogs.length} Sessions Logged</span>
        </div>

        <div className="space-y-3">
          {callLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-rose-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2D1B22] text-xs">{log.callerName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({log.callerPhone})</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {log.intent}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"{log.transcriptSummary}"</p>
                <p className="text-[10px] text-[#8C2237] font-mono font-bold">⚡ Action: {log.aiActionTaken}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 font-mono block">{log.timestamp}</span>
                <span className="text-xs text-teal-700 font-bold">{log.durationSeconds}s call duration</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

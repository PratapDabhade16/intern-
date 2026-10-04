export interface Patient {
  id: string;
  uhid: string; // Unique Health ID e.g. SH-2026-9041
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  admissionStatus: 'Admitted' | 'Outpatient' | 'Discharged' | 'Emergency';
  department: string;
  attendingDoctor: string;
  ward: string;
  bedNumber: string;
  admissionDate: string;
  vitals: {
    bp: string; // e.g. 120/80
    pulse: number; // bpm
    spO2: number; // %
    temp: number; // °F
    respRate: number;
  };
  allergies: string[];
  diagnosis: string;
  totalBill: number;
  paidAmount: number;
  insuranceProvider?: string;
  insurancePolicyNo?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: 'In-Person' | 'Tele-Consultation' | 'Follow-up';
  status: 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled';
  symptoms: string;
  tokenNo: number;
}

export interface Bed {
  id: string;
  wardName: string; // e.g. ICU-A, Male General Ward, Pediatric Wing
  bedNumber: string;
  type: 'ICU' | 'Ventilator' | 'General' | 'Private Suite' | 'Semi-Private';
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  dailyRate: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientId: string;
  patientName: string;
  uhid: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    category: 'Consultation' | 'Diagnostics' | 'Pharmacy' | 'Room Charge' | 'Procedure' | 'Nursing';
    qty: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Pending' | 'Claim Processing';
  paymentMethod: 'UPI' | 'Credit Card' | 'Cash' | 'Insurance TPA';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Equipment' | 'Consumable' | 'Surgical';
  batchNo: string;
  stockQty: number;
  unit: string;
  expiryDate: string;
  unitPrice: number;
  supplier: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Expired' | 'Critical';
}

export interface StaffMember {
  id: string;
  empId: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Receptionist' | 'Accountant' | 'Pharmacist' | 'Admin';
  department: string;
  specialization?: string;
  email: string;
  phone: string;
  shift: 'Morning (08:00 - 16:00)' | 'Evening (16:00 - 00:00)' | 'Night (00:00 - 08:00)';
  status: 'On Duty' | 'Off Duty' | 'On Leave' | 'Emergency Callout';
  rating: number;
}

export interface VoiceCallLog {
  id: string;
  timestamp: string;
  callerPhone: string;
  callerName: string;
  intent: 'Appointment Booking' | 'Bed Availability Inquiry' | 'Lab Report Status' | 'Emergency Triage';
  transcriptSummary: string;
  aiActionTaken: string;
  status: 'Handled by AI' | 'Escalated to Human' | 'Follow-up Required';
  sentiment: 'Neutral' | 'Urgent' | 'Satisfied' | 'Anxious';
  durationSeconds: number;
}

export interface ScrapingJob {
  id: string;
  targetName: string;
  crawlerEngine: 'Playwright (Chromium)' | 'Scrapy Bot' | 'Selenium Grid' | 'Twilio Webhook';
  lastRun: string;
  recordsExtracted: number;
  status: 'Active' | 'Idle' | 'Syncing' | 'Failed';
  healthScore: number;
}

// MOCK INITIAL DATA
export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    uhid: 'SH-2026-8801',
    name: 'Aarav Sharma',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98230 11234',
    email: 'aarav.sharma@example.com',
    address: 'Flat 402, Green Valley Apartments, Mumbai',
    admissionStatus: 'Admitted',
    department: 'Cardiology',
    attendingDoctor: 'Dr. Vikram Malhotra (MD, Cardiology)',
    ward: 'ICU Wing A',
    bedNumber: 'ICU-04',
    admissionDate: '2026-10-01 14:30',
    vitals: { bp: '138/88', pulse: 82, spO2: 97, temp: 98.6, respRate: 18 },
    allergies: ['Penicillin', 'Sulfa drugs'],
    diagnosis: 'Acute Coronary Syndrome - Post Angioplasty observation',
    totalBill: 185000,
    paidAmount: 120000,
    insuranceProvider: 'Star Health Insurance',
    insurancePolicyNo: 'SH-992381-A'
  },
  {
    id: 'p2',
    uhid: 'SH-2026-8802',
    name: 'Priya Deshmukh',
    age: 28,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 97112 44556',
    email: 'priya.d@example.com',
    address: 'Plot 12, Sunrise Enclave, Pune',
    admissionStatus: 'Admitted',
    department: 'Pediatrics & Neonatal',
    attendingDoctor: 'Dr. Ananya Roy (DCH, Pediatrics)',
    ward: 'Pediatric Deluxe Ward',
    bedNumber: 'PED-02',
    admissionDate: '2026-10-02 09:15',
    vitals: { bp: '110/72', pulse: 76, spO2: 99, temp: 100.4, respRate: 20 },
    allergies: ['Dust', 'Pollen'],
    diagnosis: 'Viral Pneumonitis & High Fever',
    totalBill: 45000,
    paidAmount: 45000,
    insuranceProvider: 'HDFC ERGO Health',
    insurancePolicyNo: 'HE-441209'
  },
  {
    id: 'p3',
    uhid: 'SH-2026-8803',
    name: 'Rajesh Kumar Patel',
    age: 56,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 94220 99881',
    email: 'rk.patel@example.com',
    address: 'B-14, Civil Lines, Kanpur',
    admissionStatus: 'Emergency',
    department: 'Orthopedics',
    attendingDoctor: 'Dr. Suresh Varma (MS Ortho)',
    ward: 'Emergency Trauma Care',
    bedNumber: 'ER-01',
    admissionDate: '2026-10-03 21:00',
    vitals: { bp: '145/92', pulse: 94, spO2: 95, temp: 98.4, respRate: 22 },
    allergies: [],
    diagnosis: 'Right Femur Fracture & Soft Tissue Contusion',
    totalBill: 92000,
    paidAmount: 25000,
    insuranceProvider: 'ICICI Lombard',
    insurancePolicyNo: 'IL-887123'
  },
  {
    id: 'p4',
    uhid: 'SH-2026-8804',
    name: 'Meera Iyer',
    age: 42,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+91 98901 22334',
    email: 'meera.iyer@example.com',
    address: '102 Orchid Heights, Bengaluru',
    admissionStatus: 'Outpatient',
    department: 'Neurology',
    attendingDoctor: 'Dr. Rajesh Kulkarni (DM Neuro)',
    ward: 'OPD Clinic 3',
    bedNumber: 'N/A',
    admissionDate: '2026-10-03 10:00',
    vitals: { bp: '122/78', pulse: 70, spO2: 98, temp: 98.2, respRate: 16 },
    allergies: ['NSAIDs'],
    diagnosis: 'Chronic Migraine with Aura & Cervical Spondylosis',
    totalBill: 3500,
    paidAmount: 3500
  },
  {
    id: 'p5',
    uhid: 'SH-2026-8805',
    name: 'Sunil Verma',
    age: 61,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+91 93210 55443',
    email: 'sunil.v@example.com',
    address: '77 Residency Road, Delhi',
    admissionStatus: 'Discharged',
    department: 'Gastroenterology',
    attendingDoctor: 'Dr. Meenakshi Sundaram (DM Gastro)',
    ward: 'General Male Ward',
    bedNumber: 'GEN-11',
    admissionDate: '2026-09-28 11:00',
    vitals: { bp: '118/76', pulse: 72, spO2: 98, temp: 98.6, respRate: 17 },
    allergies: [],
    diagnosis: 'Acute Gastritis & Dehydration (Resolved)',
    totalBill: 32000,
    paidAmount: 32000
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientName: 'Sunita Menon',
    patientPhone: '+91 98450 11990',
    doctorName: 'Dr. Vikram Malhotra (MD, Cardiology)',
    department: 'Cardiology',
    date: '2026-10-04',
    timeSlot: '09:30 AM',
    type: 'In-Person',
    status: 'Scheduled',
    symptoms: 'Chest discomfort on exertion, breathlessness',
    tokenNo: 101
  },
  {
    id: 'apt-2',
    patientName: 'Rohan Gupta',
    patientPhone: '+91 99887 66554',
    doctorName: 'Dr. Ananya Roy (DCH, Pediatrics)',
    department: 'Pediatrics & Neonatal',
    date: '2026-10-04',
    timeSlot: '10:15 AM',
    type: 'In-Person',
    status: 'Scheduled',
    symptoms: 'High fever for 3 days, loss of appetite in 4yo child',
    tokenNo: 102
  },
  {
    id: 'apt-3',
    patientName: 'Kavita Joshi',
    patientPhone: '+91 97665 44332',
    doctorName: 'Dr. Rajesh Kulkarni (DM Neuro)',
    department: 'Neurology',
    date: '2026-10-04',
    timeSlot: '11:00 AM',
    type: 'Tele-Consultation',
    status: 'In-Progress',
    symptoms: 'Frequent headaches and dizziness',
    tokenNo: 103
  },
  {
    id: 'apt-4',
    patientName: 'David D\'Souza',
    patientPhone: '+91 91234 56789',
    doctorName: 'Dr. Suresh Varma (MS Ortho)',
    department: 'Orthopedics',
    date: '2026-10-04',
    timeSlot: '02:00 PM',
    type: 'Follow-up',
    status: 'Scheduled',
    symptoms: 'Post-knee replacement evaluation',
    tokenNo: 104
  }
];

export const INITIAL_BEDS: Bed[] = [
  { id: 'b1', wardName: 'ICU Wing A', bedNumber: 'ICU-01', type: 'Ventilator', status: 'Occupied', patientId: 'p-889', patientName: 'Sanjay Dutt', dailyRate: 15000 },
  { id: 'b2', wardName: 'ICU Wing A', bedNumber: 'ICU-02', type: 'ICU', status: 'Available', dailyRate: 12000 },
  { id: 'b3', wardName: 'ICU Wing A', bedNumber: 'ICU-03', type: 'Ventilator', status: 'Maintenance', dailyRate: 15000 },
  { id: 'b4', wardName: 'ICU Wing A', bedNumber: 'ICU-04', type: 'ICU', status: 'Occupied', patientId: 'p1', patientName: 'Aarav Sharma', dailyRate: 12000 },
  { id: 'b5', wardName: 'Pediatric Wing', bedNumber: 'PED-01', type: 'Private Suite', status: 'Available', dailyRate: 6500 },
  { id: 'b6', wardName: 'Pediatric Wing', bedNumber: 'PED-02', type: 'Private Suite', status: 'Occupied', patientId: 'p2', patientName: 'Priya Deshmukh', dailyRate: 6500 },
  { id: 'b7', wardName: 'General Male Ward', bedNumber: 'GEN-01', type: 'General', status: 'Occupied', patientId: 'p-991', patientName: 'Vinod Nair', dailyRate: 2500 },
  { id: 'b8', wardName: 'General Male Ward', bedNumber: 'GEN-02', type: 'General', status: 'Available', dailyRate: 2500 },
  { id: 'b9', wardName: 'General Male Ward', bedNumber: 'GEN-03', type: 'General', status: 'Reserved', dailyRate: 2500 },
  { id: 'b10', wardName: 'Emergency Trauma', bedNumber: 'ER-01', type: 'ICU', status: 'Occupied', patientId: 'p3', patientName: 'Rajesh Kumar Patel', dailyRate: 8000 },
  { id: 'b11', wardName: 'Emergency Trauma', bedNumber: 'ER-02', type: 'ICU', status: 'Available', dailyRate: 8000 },
  { id: 'b12', wardName: 'VVIP Executive Ward', bedNumber: 'STE-101', type: 'Private Suite', status: 'Available', dailyRate: 22000 }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNo: 'INV-SH-2026-0091',
    patientId: 'p1',
    patientName: 'Aarav Sharma',
    uhid: 'SH-2026-8801',
    date: '2026-10-03',
    dueDate: '2026-10-10',
    items: [
      { description: 'ICU Bed Charges (3 days @ ₹12,000/day)', category: 'Room Charge', qty: 3, unitPrice: 12000, amount: 36000 },
      { description: 'Coronary Angioplasty Procedure & Stent Kit', category: 'Procedure', qty: 1, unitPrice: 110000, amount: 110000 },
      { description: 'Cardiology Specialist Consultation & Rounding', category: 'Consultation', qty: 3, unitPrice: 3000, amount: 9000 },
      { description: 'High-Risk Cardiac Medication & IV Fluids', category: 'Pharmacy', qty: 1, unitPrice: 18000, amount: 18000 },
      { description: '24-hr ECG, Echo & Cardiac Marker Panel', category: 'Diagnostics', qty: 1, unitPrice: 12000, amount: 12000 }
    ],
    subtotal: 185000,
    tax: 0,
    discount: 0,
    totalAmount: 185000,
    paidAmount: 120000,
    status: 'Claim Processing',
    paymentMethod: 'Insurance TPA'
  },
  {
    id: 'inv-1002',
    invoiceNo: 'INV-SH-2026-0092',
    patientId: 'p2',
    patientName: 'Priya Deshmukh',
    uhid: 'SH-2026-8802',
    date: '2026-10-02',
    dueDate: '2026-10-05',
    items: [
      { description: 'Pediatric Deluxe Ward Rent (2 Days)', category: 'Room Charge', qty: 2, unitPrice: 6500, amount: 13000 },
      { description: 'Pediatrician Daily Consultations', category: 'Consultation', qty: 2, unitPrice: 2000, amount: 4000 },
      { description: 'Antibiotics & Nebulization Kit', category: 'Pharmacy', qty: 1, unitPrice: 8500, amount: 8500 },
      { description: 'Full Blood Count & Chest X-Ray', category: 'Diagnostics', qty: 1, unitPrice: 4500, amount: 4500 },
      { description: '24/7 Neonatal & Pediatric Nursing Care', category: 'Nursing', qty: 2, unitPrice: 7500, amount: 15000 }
    ],
    subtotal: 45000,
    tax: 0,
    discount: 0,
    totalAmount: 45000,
    paidAmount: 45000,
    status: 'Paid',
    paymentMethod: 'UPI'
  },
  {
    id: 'inv-1003',
    invoiceNo: 'INV-SH-2026-0093',
    patientId: 'p4',
    patientName: 'Meera Iyer',
    uhid: 'SH-2026-8804',
    date: '2026-10-03',
    dueDate: '2026-10-03',
    items: [
      { description: 'Neurology OPD Senior Consultant Fee', category: 'Consultation', qty: 1, unitPrice: 1500, amount: 1500 },
      { description: 'Brain MRI Scan & Cervical Spine X-Ray', category: 'Diagnostics', qty: 1, unitPrice: 2000, amount: 2000 }
    ],
    subtotal: 3500,
    tax: 0,
    discount: 0,
    totalAmount: 3500,
    paidAmount: 3500,
    status: 'Paid',
    paymentMethod: 'Credit Card'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Augmentin 625mg (Amoxicillin + Clavulanate)', category: 'Antibiotic', batchNo: 'B26-0098', stockQty: 450, unit: 'Tablets', expiryDate: '2027-08-15', unitPrice: 22, supplier: 'Cipla Healthcare', reorderLevel: 100, status: 'In Stock' },
  { id: 'inv-2', name: 'Paracetamol 500mg IV Infusion (100ml)', category: 'Analgesic', batchNo: 'PCM-8812', stockQty: 24, unit: 'Bottles', expiryDate: '2026-11-30', unitPrice: 65, supplier: 'Sun Pharma', reorderLevel: 50, status: 'Low Stock' },
  { id: 'inv-3', name: 'Atorvastatin 20mg', category: 'Cardiovascular', batchNo: 'ATV-3310', stockQty: 890, unit: 'Tablets', expiryDate: '2028-02-10', unitPrice: 14, supplier: 'Dr. Reddy Labs', reorderLevel: 150, status: 'In Stock' },
  { id: 'inv-4', name: 'Sterile Surgical Gloves 7.5 (Powder Free)', category: 'Consumable', batchNo: 'GLV-1102', stockQty: 1200, unit: 'Pairs', expiryDate: '2029-01-01', unitPrice: 35, supplier: 'Kanam Latex', reorderLevel: 300, status: 'In Stock' },
  { id: 'inv-5', name: 'Enoxaparin Sodium 40mg Injection', category: 'Cardiovascular', batchNo: 'ENX-0044', stockQty: 8, unit: 'Vials', expiryDate: '2026-10-15', unitPrice: 540, supplier: 'Sanofi India', reorderLevel: 20, status: 'Critical' },
  { id: 'inv-6', name: 'Disposable N95 Respirator Masks', category: 'Consumable', batchNo: 'MSK-9901', stockQty: 310, unit: 'Pieces', expiryDate: '2028-05-12', unitPrice: 40, supplier: '3M Medical', reorderLevel: 100, status: 'In Stock' }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'stf-1', empId: 'EMP-101', name: 'Dr. Vikram Malhotra', role: 'Doctor', department: 'Cardiology', specialization: 'Interventional Cardiology', email: 'v.malhotra@shishutaa.com', phone: '+91 98201 00111', shift: 'Morning (08:00 - 16:00)', status: 'On Duty', rating: 4.9 },
  { id: 'stf-2', empId: 'EMP-102', name: 'Dr. Ananya Roy', role: 'Doctor', department: 'Pediatrics & Neonatal', specialization: 'Pediatric Intensive Care', email: 'a.roy@shishutaa.com', phone: '+91 98201 00222', shift: 'Morning (08:00 - 16:00)', status: 'On Duty', rating: 4.8 },
  { id: 'stf-3', empId: 'EMP-103', name: 'Dr. Rajesh Kulkarni', role: 'Doctor', department: 'Neurology', specialization: 'Stroke & Epilepsy Specialist', email: 'r.kulkarni@shishutaa.com', phone: '+91 98201 00333', shift: 'Evening (16:00 - 00:00)', status: 'On Duty', rating: 4.9 },
  { id: 'stf-4', empId: 'EMP-104', name: 'Sister Mary Joseph', role: 'Nurse', department: 'ICU Wing A', specialization: 'Critical Care Nursing', email: 'm.joseph@shishutaa.com', phone: '+91 98201 00444', shift: 'Morning (08:00 - 16:00)', status: 'On Duty', rating: 5.0 },
  { id: 'stf-5', empId: 'EMP-105', name: 'Rahul Shinde', role: 'Pharmacist', department: 'Central Pharmacy', specialization: 'Clinical Pharmacy', email: 'r.shinde@shishutaa.com', phone: '+91 98201 00555', shift: 'Morning (08:00 - 16:00)', status: 'On Duty', rating: 4.7 },
  { id: 'stf-6', empId: 'EMP-106', name: 'Kavya Pillai', role: 'Receptionist', department: 'Front Desk & Triage', specialization: 'Patient Relations', email: 'k.pillai@shishutaa.com', phone: '+91 98201 00666', shift: 'Evening (16:00 - 00:00)', status: 'On Duty', rating: 4.8 }
];

export const INITIAL_AI_CALL_LOGS: VoiceCallLog[] = [
  {
    id: 'call-101',
    timestamp: '2026-10-03 22:40:12',
    callerPhone: '+91 98920 44331',
    callerName: 'Sunil Sharma',
    intent: 'Appointment Booking',
    transcriptSummary: 'Patient requested cardiology OPD appointment for tomorrow morning. Shishutaa AI Voice Assistant verified slot availability with Dr. Vikram Malhotra at 09:30 AM and booked Token #101.',
    aiActionTaken: 'Created Appointment #apt-1 & Sent SMS confirmation via Twilio API',
    status: 'Handled by AI',
    sentiment: 'Satisfied',
    durationSeconds: 48
  },
  {
    id: 'call-102',
    timestamp: '2026-10-03 21:15:04',
    callerPhone: '+91 98112 88990',
    callerName: 'Sunita Roy',
    intent: 'Bed Availability Inquiry',
    transcriptSummary: 'Caller inquired about Pediatric ICU bed availability for emergency transfer. AI AI agent flagged 1 available bed in Pediatric Wing and automatically alerted ER Charge Nurse.',
    aiActionTaken: 'Reserved Bed #PED-01 & Notified ER duty doctor',
    status: 'Escalated to Human',
    sentiment: 'Urgent',
    durationSeconds: 72
  },
  {
    id: 'call-103',
    timestamp: '2026-10-03 19:05:44',
    callerPhone: '+91 94001 22119',
    callerName: 'Vikram Mehta',
    intent: 'Lab Report Status',
    transcriptSummary: 'Queried blood test results for UHID SH-2026-8802. AI authenticated caller OTP and read out CBC parameter values.',
    aiActionTaken: 'Dispatched PDF Report link via WhatsApp Business API',
    status: 'Handled by AI',
    sentiment: 'Neutral',
    durationSeconds: 35
  }
];

export const INITIAL_SCRAPING_JOBS: ScrapingJob[] = [
  { id: 'job-1', targetName: 'Star Health Insurance TPA Approval Portal', crawlerEngine: 'Playwright (Chromium)', lastRun: '5 mins ago', recordsExtracted: 142, status: 'Active', healthScore: 99 },
  { id: 'job-2', targetName: 'ICD-10 Clinical Coding Sync & WHO Updates', crawlerEngine: 'Scrapy Bot', lastRun: '1 hour ago', recordsExtracted: 4500, status: 'Idle', healthScore: 100 },
  { id: 'job-3', targetName: 'Government Ayushman Bharat Benchmark Tariffs', crawlerEngine: 'Selenium Grid', lastRun: '12 mins ago', recordsExtracted: 890, status: 'Active', healthScore: 96 },
  { id: 'job-4', targetName: 'Twilio Voice AI Webhook Listener & Call Sync', crawlerEngine: 'Twilio Webhook', lastRun: 'Real-time (Active)', recordsExtracted: 312, status: 'Active', healthScore: 100 }
];

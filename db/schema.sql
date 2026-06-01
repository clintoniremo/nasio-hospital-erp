-- Hospital ERP database schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  contact TEXT,
  vehicle_plate TEXT,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  current_stage TEXT NOT NULL DEFAULT 'Gate',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS triage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  temperature NUMERIC,
  height NUMERIC,
  weight NUMERIC,
  age INT,
  assessment TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sha_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending',
  details TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id),
  stage TEXT NOT NULL,
  diagnosis TEXT,
  prescription TEXT,
  referred_lab TEXT,
  review_notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS lab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES users(id),
  test_name TEXT NOT NULL,
  request_notes TEXT,
  status TEXT NOT NULL DEFAULT 'Requested',
  results TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  service_total NUMERIC NOT NULL,
  sha_deduction NUMERIC NOT NULL DEFAULT 0,
  patient_payment NUMERIC NOT NULL DEFAULT 0,
  balance NUMERIC NOT NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pharmacy_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  medication TEXT NOT NULL,
  quantity INT NOT NULL,
  dispensed_by UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'Pending',
  dispensed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 0,
  unit_price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES users(id),
  change INT NOT NULL,
  reason TEXT,
  related_patient UUID REFERENCES patients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed users for each role
INSERT INTO users (full_name, email, password_hash, role)
VALUES
('Reception Admin', 'reception@hospital.local', 'PLAINTEXT:reception123', 'receptionist'),
('Triage Nurse', 'nurse@hospital.local', 'PLAINTEXT:nurse123', 'nurse'),
('SHA Coordinator', 'sha@hospital.local', 'PLAINTEXT:sha123', 'sha_officer'),
('Consulting Doctor', 'doctor@hospital.local', 'PLAINTEXT:doctor123', 'doctor'),
('Lab Technician', 'lab@hospital.local', 'PLAINTEXT:lab123', 'lab_tech'),
('Finance Officer', 'finance@hospital.local', 'PLAINTEXT:finance123', 'finance'),
('Pharmacy Agent', 'pharmacy@hospital.local', 'PLAINTEXT:pharmacy123', 'pharmacist');

export type Role =
  | 'receptionist'
  | 'nurse'
  | 'sha_officer'
  | 'doctor'
  | 'lab_tech'
  | 'finance'
  | 'pharmacist';

export interface JwtPayload {
  userId: string;
  role: Role;
  email: string;
}

export interface PatientRecord {
  id: string;
  patient_code: string;
  full_name: string;
  contact: string;
  vehicle_plate: string;
  arrival_time: string;
  current_stage: string;
  last_updated: string;
}

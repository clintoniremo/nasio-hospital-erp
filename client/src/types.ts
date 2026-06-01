export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface PatientIntake {
  patient_code: string;
  full_name: string;
  contact: string;
  vehicle_plate: string;
  arrival_time: string;
}

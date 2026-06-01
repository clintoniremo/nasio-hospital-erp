import { UserProfile } from '../types';

export function getAuthUser(): UserProfile | null {
  const raw = localStorage.getItem('erp_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

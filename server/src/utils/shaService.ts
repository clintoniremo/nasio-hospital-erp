import dotenv from 'dotenv';

dotenv.config();

const SHA_API_URL = process.env.SHA_API_URL;
const SHA_API_KEY = process.env.SHA_API_KEY;

export async function notifySHAApproval(patientId: string, details: string) {
  if (!SHA_API_URL) return { success: false, reason: 'No SHA_API_URL configured' };

  try {
    const res = await fetch(`${SHA_API_URL}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SHA_API_KEY ? { 'x-api-key': SHA_API_KEY } : {})
      },
      body: JSON.stringify({ patientId, details })
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, reason: `SHA API responded ${res.status}: ${text}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, reason: err.message || String(err) };
  }
}

export default { notifySHAApproval };

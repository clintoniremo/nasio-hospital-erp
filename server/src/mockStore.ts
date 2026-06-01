type Row = { [k: string]: any };

const now = () => new Date().toISOString();

const patients: Row[] = [];
const inventory_items: Row[] = [];
const finances: Row[] = [];
const consultations: Row[] = [];
const labs: Row[] = [];
const audit_logs: Row[] = [];

let _idCounter = 1;
const genId = () => `m-${Date.now().toString(36)}-${_idCounter++}`;

export async function query(sql: string, params?: any[]) {
  const s = sql.trim().toLowerCase();

  // Simple inserts
  if (s.startsWith('insert into patients')) {
    const id = genId();
    const patient = { id, patient_code: `P-${id.slice(-8)}`, full_name: params?.[0] || 'Unknown', contact: params?.[1] || '', vehicle_plate: params?.[2] || '', arrival_time: now(), current_stage: 'Gate', last_updated: now() };
    patients.push(patient);
    return { rows: [patient] };
  }

  if (s.startsWith('select') && s.includes('from patients')) {
    return { rows: patients };
  }

  if (s.startsWith('insert into inventory_items')) {
    const id = genId();
    const item = { id, name: params?.[0] || 'Item', sku: params?.[1] || '', quantity: params?.[2] || 0, created_at: now() };
    inventory_items.push(item);
    return { rows: [item] };
  }

  if (s.startsWith('select') && s.includes('from inventory_items')) {
    return { rows: inventory_items };
  }

  if (s.startsWith('insert into finances')) {
    const id = genId();
    const row = { id, patient_id: params?.[0], service_total: params?.[1], sha_deduction: params?.[2], patient_payment: params?.[3], balance: params?.[4], receipt_number: params?.[5], created_at: now() };
    finances.push(row);
    audit_logs.push({ id: genId(), user_id: null, action: 'Generate bill', module: 'Finance', details: `Finance completed for patient ${row.patient_id}`, created_at: now() });
    return { rows: [row] };
  }

  if (s.startsWith('select') && s.includes('from finances')) {
    return { rows: finances.sort((a,b)=> (b.created_at> a.created_at ? 1:-1)) };
  }

  // consultations
  if (s.startsWith('insert into consultations')) {
    const id = genId();
    const row = { id, patient_id: params?.[0], doctor_id: params?.[1], stage: params?.[2] || 'Initial', diagnosis: params?.[3] || null, prescription: params?.[4] || null, referred_lab: params?.[5] || false, review_notes: params?.[6] || null, created_at: now() };
    consultations.push(row);
    return { rows: [row] };
  }

  if (s.startsWith('select') && s.includes('from consultations')) {
    return { rows: consultations };
  }

  // labs
  if (s.startsWith('insert into labs')) {
    const id = genId();
    const row = { id, patient_id: params?.[0], test: params?.[1], result: params?.[2] || null, created_at: now() };
    labs.push(row);
    return { rows: [row] };
  }

  if (s.startsWith('select') && s.includes('from labs')) {
    return { rows: labs };
  }

  // audit logs select
  if (s.startsWith('select') && s.includes('from audit_logs')) {
    return { rows: audit_logs };
  }

  // default: return empty
  return { rows: [] };
}

export default { query };

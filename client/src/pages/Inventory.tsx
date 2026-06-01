import { useEffect, useState, type FormEvent } from 'react';
import api from '../api/client';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ sku: '', name: '', description: '', quantity: '', unit_price: '' });
  const [adjust, setAdjust] = useState({ id: '', change: '', reason: '' });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    const res = await api.get('/inventory');
    setItems(res.data);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    await api.post('/inventory', {
      sku: form.sku,
      name: form.name,
      description: form.description,
      quantity: Number(form.quantity || 0),
      unit_price: Number(form.unit_price || 0)
    });
    setMessage('Item created');
    setForm({ sku: '', name: '', description: '', quantity: '', unit_price: '' });
    loadItems();
  }

  async function handleAdjust(e: FormEvent) {
    e.preventDefault();
    await api.patch(`/inventory/${adjust.id}/adjust`, { change: Number(adjust.change), reason: adjust.reason });
    setMessage('Inventory adjusted');
    setAdjust({ id: '', change: '', reason: '' });
    loadItems();
  }

  return (
    <div>
      <div className="card">
        <h2>Inventory</h2>
        <p>Manage stock items and adjustments.</p>
        <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
          <label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></label>
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Quantity<input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
          <label>Unit Price<input type="number" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} /></label>
          <button className="primary" type="submit">Create Item</button>
        </form>
        <form onSubmit={handleAdjust}>
          <label>Item ID<select value={adjust.id} onChange={(e) => setAdjust({ ...adjust, id: e.target.value })}>
            <option value="">Select</option>
            {items.map(it => <option key={it.id} value={it.id}>{it.sku} — {it.name} ({it.quantity})</option>)}
          </select></label>
          <label>Change (±)<input type="number" value={adjust.change} onChange={(e) => setAdjust({ ...adjust, change: e.target.value })} required /></label>
          <label>Reason<textarea value={adjust.reason} onChange={(e) => setAdjust({ ...adjust, reason: e.target.value })} /></label>
          <button className="primary" type="submit">Apply Adjustment</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div className="card">
        <h3>Stock Items</h3>
        <table>
          <thead>
            <tr><th>SKU</th><th>Name</th><th>Qty</th><th>Unit Price</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}><td>{it.sku}</td><td>{it.name}</td><td>{it.quantity}</td><td>{it.unit_price}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

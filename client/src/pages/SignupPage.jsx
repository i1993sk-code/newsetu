import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', businessName: '', phone: '', category: '', city: '', services: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(api.signup, {
        ...form, services: form.services.split(',').map(s => s.trim()).filter(Boolean)
      });
      setResult(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1a1a2e', fontSize: 28, margin: 0 }}>NewSetu</h1>
        <p style={{ color: '#666', marginTop: 4, fontSize: 14 }}>Apni free website banayein</p>
      </div>

      {result?.success ? (
        <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <h2 style={{ color: '#2e7d32', fontSize: 18, margin: 0 }}>Website ready!</h2>
          <p style={{ fontSize: 14, color: '#555', marginTop: 8 }}>Aapki website:</p>
          <a href={result.data.website} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', display: 'block', margin: '8px 0' }}>
            {result.data.website}
          </a>
          <p style={{ fontSize: 12, color: '#999' }}>Is link ko copy karein aur share karein!</p>
          <Link to="/" style={{ display: 'inline-block', marginTop: 12, color: '#1a1a2e', fontWeight: 600, fontSize: 13 }}>← Back to home</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginTop: 4, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Business Name</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginTop: 4, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Phone *</label>
            <input name="phone" required value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginTop: 4, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Category * (e.g. Plumber, Electrician)</label>
            <input name="category" required value={form.category} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginTop: 4, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>City *</label>
            <input name="city" required value={form.city} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginTop: 4, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Services (comma separated)</label>
            <textarea name="services" value={form.services} onChange={handleChange} rows={2} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginTop: 4, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: '#1a1a2e', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'Creating...' : 'Free Website Banayein 🚀'}
          </button>
        </form>
      )}
    </div>
  );
}

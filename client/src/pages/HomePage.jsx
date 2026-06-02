import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const res = await axios.get(api.search, { params: { category: search, city } });
      setResults(res.data);
    } catch { setResults({ data: [] }); }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ color: '#1a1a2e', fontSize: 32, margin: 0 }}>NewSetu</h1>
        <p style={{ color: '#666', marginTop: 4 }}>Apne aas-paas ke service providers dhundhein</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Kya chahiye? (plumber, electrician...)" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }} />
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)}
          style={{ width: 120, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }} />
        <button onClick={handleSearch} disabled={loading}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1a1a2e', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? '...' : 'Search'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Link to="/signup" style={{ color: '#1a1a2e', fontWeight: 600, fontSize: 13 }}>
          Service provider hain? Apni free website banayein →
        </Link>
      </div>

      {results && results.data?.length > 0 && (
        <div>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{results.count} providers found</p>
          {results.data.map(p => (
            <a href={`/provider/${p.slug}`} key={p._id}
              style={{ display: 'block', textDecoration: 'none', padding: 14, marginBottom: 8, background: '#f8f9fa', borderRadius: 10, border: '1px solid #eee', color: '#333' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{p.businessName || p.name}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{p.category} — {p.city} {p.pincode ? `(${p.pincode})` : ''}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{p.services?.join(', ') || ''}</div>
            </a>
          ))}
        </div>
      )}

      {results && results.data?.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#999', fontSize: 14 }}>Koi provider nahi mila</div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export default function ProviderPage() {
  const { slug } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(api.getProvider(slug))
      .then(res => { if (res.data.success) setProvider(res.data.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Loading...</div>;
  if (!provider) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <h2>Provider not found</h2>
      <Link to="/" style={{ color: '#1a1a2e' }}>← Go back</Link>
    </div>
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', padding: 30, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e94560', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff', fontWeight: 700 }}>
            {(provider.businessName || provider.name)[0]}
          </div>
          <h1 style={{ color: '#fff', fontSize: 22, margin: 0 }}>{provider.businessName || provider.name}</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, marginTop: 4 }}>{provider.category}</p>
        </div>

        <div style={{ padding: 20 }}>
          {provider.services?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>Services</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {provider.services.map((s, i) => (
                  <span key={i} style={{ background: '#f0f0f5', padding: '4px 10px', borderRadius: 6, fontSize: 12, color: '#555' }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#666' }}>📍 {provider.city}{provider.pincode ? ` — ${provider.pincode}` : ''}</p>
            {provider.experience && <p style={{ fontSize: 13, color: '#666' }}>⏱ {provider.experience} experience</p>}
            {provider.priceRange && <p style={{ fontSize: 13, color: '#666' }}>💰 {provider.priceRange}</p>}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <a href={`tel:${provider.phone}`} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 8, border: 'none', background: '#1a1a2e', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', cursor: 'pointer' }}>
              📞 Call Now
            </a>
            <a href={`https://wa.me/91${provider.phone}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', cursor: 'pointer' }}>
              💬 WhatsApp
            </a>
          </div>

          {provider.description && (
            <p style={{ fontSize: 13, color: '#555', marginTop: 16, borderTop: '1px solid #eee', paddingTop: 12 }}>{provider.description}</p>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <Link to="/" style={{ fontSize: 12, color: '#999', textDecoration: 'none' }}>NewSetu — Apni website banayein</Link>
      </div>
    </div>
  );
}

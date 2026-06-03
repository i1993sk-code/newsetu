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
      .then(res => {
        if (res.data.success) {
          setProvider(res.data.data);
          const p = res.data.data;
          const name = p.businessName || p.name;
          const loc = p.district || p.city || 'Jharkhand';
          document.title = name + ' - ' + p.category + ' in ' + loc + ' | NewSetu';
          document.querySelector('meta[name="description"]')?.setAttribute('content', name + ' - ' + p.category + ' in ' + loc + '. Call ' + p.phone + ' for ' + (p.services?.join(', ') || p.category) + '.');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-8 h-8 text-orange-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );

  if (!provider) return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Provider not found</h2>
        <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium text-sm">← Back to home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-6 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 pt-10 pb-16 text-center relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 mx-auto mb-4 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {(provider.businessName || provider.name)[0]}
            </div>
            <h1 className="text-2xl font-bold text-white">{provider.businessName || provider.name}</h1>
            <p className="text-orange-300 text-sm font-medium mt-1">{provider.category}</p>
            {provider.plan === 'premium' && (
              <span className="inline-block mt-2 px-3 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">⭐ Premium</span>
            )}
          </div>

          <div className="px-6 -mt-8 relative z-10">
            {provider.services?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg border border-orange-100">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-medium text-gray-700">{provider.address ? `${provider.address}, ` : ''}{provider.district || provider.city}{provider.state ? `, ${provider.state}` : ''}{provider.pincode ? ` — ${provider.pincode}` : ''}</p>
                  </div>
                </div>
                {provider.experience && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⏱</span>
                    <div>
                      <p className="text-xs text-gray-400">Experience</p>
                      <p className="text-sm font-medium text-gray-700">{provider.experience}</p>
                    </div>
                  </div>
                )}
                {provider.priceRange && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💰</span>
                    <div>
                      <p className="text-xs text-gray-400">Price Range</p>
                      <p className="text-sm font-medium text-gray-700">{provider.priceRange}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {provider.description && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{provider.description}</p>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 space-y-3">
            <a href={`tel:${provider.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition text-sm shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Call Now
            </a>
            <a href={`https://wa.me/91${provider.phone}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition text-sm shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link to={`/edit/${slug}`} className="block text-xs text-gray-400 hover:text-orange-500 transition">
            ✏️ Edit your profile
          </Link>
          <Link to="/signup" className="block text-xs text-gray-400 hover:text-orange-500 transition">
            NewSetu — Free me apna profile banayein →
          </Link>
        </div>
      </div>
    </div>
  );
}

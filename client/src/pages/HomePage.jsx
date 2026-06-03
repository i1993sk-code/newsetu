import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

const categories = ['Plumber', 'Electrician', 'Beautician', 'Tutor', 'CA', 'Lawyer', 'Mechanic', 'Painter', 'Carpenter', 'AC Repair'];

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

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-orange-500">New</span>Setu
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Apne aas-paas ke service providers dhundhein</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input placeholder="Kya chahiye? (Plumber, Electrician...)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} onKeyDown={handleKeyDown}
              className="w-full sm:w-40 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            <button onClick={handleSearch} disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition text-sm whitespace-nowrap">
              {loading ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Searching...</span> : 'Search'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setSearch(cat); setTimeout(handleSearch, 0); }}
                className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-gray-500 text-xs font-medium rounded-lg border border-gray-200 transition">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition text-sm shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Service provider hain? Apni free website banayein
          </Link>
        </div>

        {results && results.data?.length > 0 && (
          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-4">{results.count} provider{results.count > 1 ? 's' : ''} found</p>
            <div className="space-y-3">
              {results.data.map(p => (
                <Link to={`/provider/${p.slug}`} key={p._id}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-orange-200 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {(p.businessName || p.name)[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition">{p.businessName || p.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{p.category} <span className="mx-1.5">•</span> 📍 {p.city}</p>
                      {p.services?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{p.services.join(', ')}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results && results.data?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">Koi provider nahi mila</p>
            <p className="text-gray-300 text-sm mt-2">Kisi aur category ya city se try karein</p>
          </div>
        )}
      </div>
    </div>
  );
}

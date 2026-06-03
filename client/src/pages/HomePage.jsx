import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

const CAT_API = api.signup.replace('/signup', '/categories');

const icons = {
  Plumber: '🔧', Electrician: '⚡', Beautician: '💅', Tutor: '📚', CA: '💰',
  Lawyer: '⚖️', Mechanic: '🔩', Painter: '🎨', Carpenter: '🪚', 'AC Repair': '❄️',
  Cook: '🍳', Driver: '🚗', Maid: '🧹', 'Security Guard': '🛡️', Photographer: '📸',
  'Event Planner': '🎉', 'Fitness Trainer': '💪', 'Web Developer': '💻', Designer: '🎯',
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSugs, setShowSugs] = useState(false);
  const ref = useRef();

  useEffect(() => {
    axios.get(CAT_API, { timeout: 5000 }).then(r => { if (r.data.success) setCategories(r.data.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setSuggestions(categories.filter(c => c.name.toLowerCase().includes(q)).slice(0, 6));
      setShowSugs(true);
    } else {
      setSuggestions([]);
      setShowSugs(false);
    }
  }, [search, categories]);

  useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowSugs(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const doSearch = async (cat) => {
    const q = cat || search;
    if (!q) return;
    setLoading(true);
    setShowSugs(false);
    try {
      const res = await axios.get(api.search, { params: { category: q, city } });
      setResults(res.data);
    } catch { setResults({ data: [] }); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-orange-500">New</span>Setu
          </h1>
          <p className="text-gray-500 mt-2">Apne aas-paas ke service providers dhundhein</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3" ref={ref}>
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input placeholder="Kya chahiye? Plumber, Electrician..." value={search} onChange={e => { setSearch(e.target.value); setResults(null); }} onKeyDown={e => e.key === 'Enter' && doSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
              {showSugs && suggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                  {suggestions.map(c => (
                    <button key={c._id} onClick={() => { setSearch(c.name); doSearch(c.name); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center gap-3">
                      <span>{icons[c.name] || '🔹'}</span>
                      <span className="font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input placeholder="City (optional)" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()}
              className="w-full sm:w-36 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            <button onClick={() => doSearch()} disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition text-sm whitespace-nowrap">
              {loading ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>...</span> : 'Search'}
            </button>
          </div>
        </div>

        {!results && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center sm:text-left">Categories — choose karein</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map(c => (
                <button key={c._id} onClick={() => { setSearch(c.name); doSearch(c.name); }}
                  className="flex items-center gap-2.5 px-3 py-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm transition-all text-left">
                  <span className="text-lg">{icons[c.name] || '🔹'}</span>
                  <span className="text-sm font-medium text-gray-700">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition text-sm shadow-sm w-full sm:w-auto justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Free website banayein
          </Link>
          <Link to="/find" className="text-xs text-gray-400 hover:text-orange-500 transition text-center">
            🔍 Profile bhool gaye? Yahan dhoondein
          </Link>
        </div>

        {results && results.data?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-4">{results.count} provider{results.count > 1 ? 's' : ''} found</p>
            <div className="space-y-3">
              {results.data.map(p => (
                <Link to={`/provider/${p.slug}`} key={p._id}
                  className="block bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md hover:border-orange-200 transition-all group">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
                      {(p.businessName || p.name)[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition text-sm sm:text-base">{p.businessName || p.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{p.category} <span className="mx-1.5">•</span> 📍 {p.district || p.city}{p.priceRange ? <span className="mx-1.5">•</span> : ''}{p.priceRange}</p>
                      {p.services?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{p.services.join(', ')}</p>
                      )}
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-orange-400 transition shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results && results.data?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400">Koi provider nahi mila</p>
            <p className="text-gray-300 text-sm mt-1">Upar categories me se koi choose karein</p>
          </div>
        )}
      </div>
    </div>
  );
}

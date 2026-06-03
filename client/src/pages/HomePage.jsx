import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

const CAT_API = api.signup.replace('provider/signup', 'categories');

const DEFAULT_CATS = ['Plumber','Electrician','Beautician','Tutor','CA','Lawyer','Mechanic','Painter','Carpenter','AC Repair','Cook','Driver','Maid','Security Guard','Photographer','Event Planner','Fitness Trainer','Web Developer','Designer'];

const icons = {
  Plumber: '🔧', Electrician: '⚡', Beautician: '💅', Tutor: '📚', CA: '💰',
  Lawyer: '⚖️', Mechanic: '🔩', Painter: '🎨', Carpenter: '🪚', 'AC Repair': '❄️',
  Cook: '🍳', Driver: '🚗', Maid: '🧹', 'Security Guard': '🛡️', Photographer: '📸',
  'Event Planner': '🎉', 'Fitness Trainer': '💪', 'Web Developer': '💻', Designer: '🎯',
};

const fallbackCats = DEFAULT_CATS.map((name, i) => ({ _id: i, name }));

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(fallbackCats);
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef();

  useEffect(() => {
    axios.get(CAT_API, { timeout: 5000 }).then(r => { if (r.data.success && r.data.data.length > 0) setCategories(r.data.data); }).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'NewSetu - Jharkhand me service providers dhundhein'; }, []);

  const filtered = categories.filter(c => {
    if (!search.trim()) return true;
    return c.name.toLowerCase().includes(search.toLowerCase());
  }).slice(0, 8);

  const showDropdown = focused && categories.length > 0;

  const doSearch = async (cat) => {
    const q = cat || search;
    if (!q) return;
    setLoading(true);
    setFocused(false);
    try {
      const res = await axios.get(api.search, { params: { category: q, city } });
      setResults(res.data);
    } catch { setResults({ data: [] }); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-24">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Jharkhand ka local service platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            <span className="text-orange-500">Koi</span> bhi kaam ho,{' '}
            <span className="text-gray-900">apne</span>{' '}
            <span className="text-orange-500">shehar</span> ka
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mt-3 max-w-lg mx-auto">
            Plumber, Electrician, Tutor, Mechanic — Jharkhand me aapke aas-paas ke sabhi service providers ek jagah
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input placeholder="Kaunsa kaam chahiye? Plumber, Electrician..." value={search}
                onFocus={() => { clearTimeout(blurTimer.current); setFocused(true); }}
                onBlur={() => { blurTimer.current = setTimeout(() => setFocused(false), 200); }}
                onChange={e => { setSearch(e.target.value); setResults(null); }}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
              {showDropdown && (
                <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                  {filtered.length > 0 ? filtered.map(c => (
                    <button key={c._id} onClick={() => { setSearch(c.name); doSearch(c.name); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center gap-3 border-b border-gray-50 last:border-0">
                      <span className="text-lg">{icons[c.name] || '🔹'}</span>
                      <span className="font-medium">{c.name}</span>
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-gray-400">No matching category</div>
                  )}
                </div>
              )}
            </div>
            <input placeholder="Shehar (optional)" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()}
              className="w-full sm:w-36 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-400 outline-none text-sm transition" />
            <button onClick={() => doSearch()} disabled={loading}
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl transition text-sm shadow-sm whitespace-nowrap">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {!results && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Categories</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {categories.map(c => (
                <button key={c._id} onClick={() => { setSearch(c.name); doSearch(c.name); }}
                  className="group relative flex flex-col items-center gap-2 px-3 py-5 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{icons[c.name] || '🔹'}</span>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-600">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-orange-500">19+</p>
            <p className="text-xs text-gray-400 mt-0.5">Categories</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-orange-500">24</p>
            <p className="text-xs text-gray-400 mt-0.5">Jharkhand Districts</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-orange-500">Free</p>
            <p className="text-xs text-gray-400 mt-0.5">Profile banayein</p>
          </div>
        </div>

        {!results && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-center mb-6 shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">💼 Kya aap service provider hain?</h2>
            <p className="text-orange-100 text-sm mb-5">Apni free online profile banayein aur naye customer paayein</p>
            <Link to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition text-sm shadow-sm">
              🚀 Free profile banayein
            </Link>
          </div>
        )}

        <div className="text-center mb-6">
          <Link to="/find" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition">
            🔍 Apna profile bhool gaye? Yahan dhoondein
          </Link>
        </div>

        {results && results.data?.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">{results.count} provider{results.count > 1 ? 's' : ''} found</p>
              <button onClick={() => { setResults(null); setSearch(''); }}
                className="text-xs text-gray-400 hover:text-orange-500 transition">✕ Clear</button>
            </div>
            <div className="space-y-3">
              {results.data.map(p => (
                <Link to={`/provider/${p.slug}`} key={p._id}
                  className="block bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {(p.businessName || p.name)[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition">{p.businessName || p.name}</h3>
                        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{p.category}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">📍 {p.district || p.city}{p.state ? `, ${p.state}` : ''}</p>
                      {p.services?.length > 0 && (
                        <p className="text-xs text-gray-300 mt-1 truncate">{p.services.join(' · ')}</p>
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
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-semibold">Koi provider nahi mila</p>
            <p className="text-gray-300 text-sm mt-1">Upar categories me se koi choose karein</p>
          </div>
        )}

        <div className="text-center pt-8 pb-4 border-t border-gray-100 mt-8">
          <p className="text-xs text-gray-300">
            Built by <a href="mailto:i1993sk@gmail.com" className="text-gray-400 hover:text-orange-500 transition">Santosh Kumar</a>
            {' '}— <a href="tel:+919608354372" className="text-gray-400 hover:text-orange-500 transition">+91 9608354372</a>
          </p>
        </div>
      </div>
    </div>
  );
}

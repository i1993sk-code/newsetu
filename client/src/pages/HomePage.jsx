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

const catBg = {
  Plumber: 'from-cyan-500 to-blue-600',
  Electrician: 'from-yellow-500 to-orange-600',
  Beautician: 'from-pink-500 to-rose-600',
  Tutor: 'from-violet-500 to-purple-600',
  CA: 'from-emerald-500 to-teal-600',
  Lawyer: 'from-indigo-500 to-blue-600',
  Mechanic: 'from-slate-600 to-gray-700',
  Painter: 'from-purple-500 to-pink-600',
  Carpenter: 'from-amber-600 to-orange-700',
  'AC Repair': 'from-sky-500 to-cyan-600',
  Cook: 'from-red-500 to-orange-500',
  Driver: 'from-blue-500 to-indigo-600',
  Maid: 'from-teal-500 to-emerald-600',
  'Security Guard': 'from-gray-700 to-slate-800',
  Photographer: 'from-fuchsia-500 to-violet-600',
  'Event Planner': 'from-rose-500 to-pink-600',
  'Fitness Trainer': 'from-lime-500 to-green-600',
  'Web Developer': 'from-cyan-600 to-blue-700',
  Designer: 'from-orange-500 to-red-500',
};

const fallbackCats = DEFAULT_CATS.map((name, i) => ({ _id: i, name }));

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(fallbackCats);
  const [focused, setFocused] = useState(false);
  const [featured, setFeatured] = useState([]);
  const blurTimer = useRef();

  useEffect(() => {
    axios.get(CAT_API, { timeout: 5000 }).then(r => { if (r.data.success && r.data.data.length > 0) setCategories(r.data.data); }).catch(() => {});
    axios.get(api.search, { params: {}, timeout: 5000 }).then(r => {
      if (r.data.data) setFeatured(r.data.data.sort(() => Math.random() - 0.5).slice(0, 6));
    }).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'NewSetu - Jharkhand me Plumber, Electrician, Tutor aur service providers dhundhein'; }, []);

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
    setResults(null);
    try {
      const res = await axios.get(api.search, { params: { category: q, city } });
      setResults(res.data);
    } catch { setResults({ data: [], count: 0 }); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
            Jharkhand ka pehla local service platform
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">Ghar baithe</span>{' '}
            dhundein apne shehar ka{' '}
            <span className="text-white">best service provider</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto mb-8">
            Plumber, Electrician, Tutor, Mechanic — Jharkhand ke har district me. Free profile, direct contact.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-white/10 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input placeholder="Kaunsa kaam chahiye? Plumber, Electrician..."
                    value={search}
                    onFocus={() => { clearTimeout(blurTimer.current); setFocused(true); }}
                    onBlur={() => { blurTimer.current = setTimeout(() => setFocused(false), 200); }}
                    onChange={e => { setSearch(e.target.value); setResults(null); }}
                    onKeyDown={e => { if (e.key === 'Enter') doSearch(); if (e.key === 'Escape') setFocused(false); }}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm transition" />
                  {showDropdown && (
                    <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-72 overflow-y-auto">
                      {filtered.length > 0 ? filtered.map(c => (
                        <button key={c._id} onClick={() => { setSearch(c.name); doSearch(c.name); }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center gap-3 border-b border-gray-50 last:border-0 text-gray-700">
                          <span className="text-lg">{icons[c.name] || '🔹'}</span>
                          <span className="font-medium">{c.name}</span>
                        </button>
                      )) : (
                        <div className="px-4 py-3 text-sm text-gray-400">No matching category</div>
                      )}
                    </div>
                  )}
                </div>
                <input placeholder="Shehar (optional)" value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  className="w-full sm:w-36 px-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm transition" />
                <button onClick={() => doSearch()} disabled={loading}
                  className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold rounded-xl transition text-sm shadow-lg whitespace-nowrap">
                  {loading ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Searching...</span> : '🔍 Search'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8 text-xs sm:text-sm text-gray-400">
            <span>🔧 19+ Categories</span>
            <span className="hidden sm:inline">•</span>
            <span>📍 24 Districts</span>
            <span className="hidden sm:inline">•</span>
            <span>✅ Free Registration</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[{ num: '19+', label: 'Service Categories', sub: 'Plumber se Designer tak', icon: '🔧' },
            { num: '24', label: 'Jharkhand Districts', sub: 'Pura Jharkhand covered', icon: '📍' },
            { num: 'Free', label: 'Profile Registration', sub: 'Zero cost, lifetime free', icon: '✅' }
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <span className="text-3xl mb-2 block">{s.icon}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-500">{s.num}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Kaise kaam karta hai?</h2>
          <p className="text-gray-400 text-sm mt-1">Sirf 3 simple steps me apne provider ko dhundein</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Search', desc: 'Apne kaam ke hisaab se category choose karein', icon: '🔍' },
            { step: '2', title: 'Compare', desc: 'Apne shehar ke providers ko dekhein aur compare karein', icon: '👥' },
            { step: '3', title: 'Contact', desc: 'Direct call ya WhatsApp karein — no middleman', icon: '📞' },
          ].map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl shadow-md group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">{s.step}</div>
              <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {!results && (
        <div className="bg-gray-50 py-14">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Browse Categories</h2>
                <p className="text-gray-400 text-sm mt-0.5">Apni zaroorat ke hisaab se category choose karein</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.map(c => (
                <button key={c._id} onClick={() => { setSearch(c.name); doSearch(c.name); }}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catBg[c.name] || 'from-orange-400 to-pink-500'} text-white flex items-center justify-center text-xl mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                    {icons[c.name] || '🔹'}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {results && results.data?.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Search Results</h2>
              <p className="text-sm text-gray-400 mt-0.5">{results.count} provider{results.count > 1 ? 's' : ''} found</p>
            </div>
            <button onClick={() => { setResults(null); setSearch(''); setCity(''); }}
              className="text-sm text-gray-400 hover:text-orange-500 transition px-4 py-2 rounded-xl hover:bg-orange-50 border border-gray-100">✕ Clear search</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.data.map(p => (
              <Link to={`/provider/${p.slug}`} key={p._id}
                className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
                  {(p.businessName || p.name)[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition">{p.businessName || p.name}</h3>
                      <span className="inline-block text-xs bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-full font-medium mt-1">{p.category}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">📍 {p.district || p.city}{p.state ? `, ${p.state}` : ''}</p>
                  {p.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.services.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-50">{s}</span>
                      ))}
                      {p.services.length > 3 && <span className="text-xs text-gray-300">+{p.services.length - 3}</span>}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {results && results.data?.length === 0 && (
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Koi provider nahi mila</h3>
          <p className="text-gray-400 text-sm mb-4">Is category ya shehar me abhi koi provider registered nahi hai</p>
          <button onClick={() => setResults(null)}
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold px-6 py-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 transition">← Wapas categories me jayein</button>
        </div>
      )}

      {featured.length > 0 && !results && (
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Featured Providers</h2>
              <p className="text-gray-400 text-sm mt-0.5">Aapke shehar ke top service providers</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map(p => (
              <Link to={`/provider/${p.slug}`} key={p._id}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                  {(p.businessName || p.name)[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition truncate">{p.businessName || p.name}</p>
                  <p className="text-xs text-gray-400">{p.category} · 📍 {p.district || p.city}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!results && (
        <div className="bg-white py-14 border-t border-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Kyun NewSetu choose karein?</h2>
              <p className="text-gray-400 text-sm mt-1">Jharkhand ka apna local service platform</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '🆓', title: 'Bilkul Free', desc: 'Profile banwana aur search karna dono free' },
                { icon: '📞', title: 'Direct Contact', desc: 'No middleman, directly provider se baat karein' },
                { icon: '📍', title: 'Local Providers', desc: 'Sirf aapke Jharkhand ke providers' },
                { icon: '🛡️', title: 'Safe & Private', desc: 'Phone number privacy controls ke saath' },
              ].map((t, i) => (
                <div key={i} className="text-center bg-gray-50 rounded-2xl p-6 hover:bg-orange-50 transition-all border border-gray-50 hover:border-orange-100">
                  <span className="text-3xl mb-3 block">{t.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{t.title}</h3>
                  <p className="text-xs text-gray-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!results && (
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">💼 Kya aap service provider hain?</h2>
            <p className="text-orange-100 text-sm sm:text-base mb-6 max-w-lg mx-auto">Apna free online profile banayein aur apne shehar me naye customers paayein. Koi fee nahi, koi commission nahi.</p>
            <Link to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition text-sm shadow-lg hover:shadow-xl">
              🚀 Free profile banayein — aaj hi shuru karein
            </Link>
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">NewSetu</h4>
              <p className="text-xs leading-relaxed">Jharkhand ka local service provider platform. Ghar baithe dhundein apne shehar ke best service providers.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/" className="hover:text-orange-400 transition">Home</Link></li>
                <li><Link to="/signup" className="hover:text-orange-400 transition">Free Profile</Link></li>
                <li><Link to="/find" className="hover:text-orange-400 transition">Find Profile</Link></li>
                <li><Link to="/admin" className="hover:text-orange-400 transition">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Categories</h4>
              <ul className="space-y-2 text-xs">
                {categories.slice(0, 5).map(c => (
                  <li key={c._id}><button onClick={() => { setSearch(c.name); doSearch(c.name); window.scrollTo(0, 0); }} className="hover:text-orange-400 transition">{c.name}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Contact</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="mailto:i1993sk@gmail.com" className="hover:text-orange-400 transition">Email</a></li>
                <li><a href="tel:+919608354372" className="hover:text-orange-400 transition">+91 9608354372</a></li>
                <li className="text-gray-500">Built by Santosh Kumar</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            © 2026 NewSetu. All rights reserved. | Made with ❤️ in Jharkhand
          </div>
        </div>
      </div>
    </div>
  );
}

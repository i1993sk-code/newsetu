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
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-md mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-orange-500">New</span>Setu
          </h1>
          <p className="text-gray-500 mt-2">Apni free website banayein</p>
        </div>

        {result?.success ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Website ready! 🎉</h2>
            <p className="text-sm text-gray-500 mb-4">Aapki website:</p>
            <a href={result.data.website} target="_blank" rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-orange-50 text-orange-600 font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition mb-4 text-sm">
              {result.data.website}
            </a>
            <p className="text-xs text-gray-400">Is link ko copy karein aur share karein!</p>
            <Link to="/" className="inline-block mt-6 text-sm text-gray-500 hover:text-orange-500 transition">
              ← Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Apna naam"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
              <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Aapke business ka naam"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone *</label>
              <input name="phone" required value={form.phone} onChange={handleChange} placeholder="Mobile number" type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
              <input name="category" required value={form.category} onChange={handleChange} placeholder="Plumber, Electrician, Tutor..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City *</label>
              <input name="city" required value={form.city} onChange={handleChange} placeholder="Aapka city"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Services (comma separated)</label>
              <textarea name="services" value={form.services} onChange={handleChange} placeholder="Pipe fitting, Water tank repair, etc." rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-xl transition text-sm shadow-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating...
                </span>
              ) : 'Free Website Banayein 🚀'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

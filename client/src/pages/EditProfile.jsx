import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export default function EditProfile() {
  const { slug } = useParams();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(api.login, { phone, slug });
      if (res.data.success) {
        setProfile(res.data.data);
        setForm({
          name: res.data.data.name || '',
          businessName: res.data.data.businessName || '',
          category: res.data.data.category || '',
          city: res.data.data.city || '',
          address: res.data.data.address || '',
          pincode: res.data.data.pincode || '',
          experience: res.data.data.experience || '',
          priceRange: res.data.data.priceRange || '',
          description: res.data.data.description || '',
          services: (res.data.data.services || []).join(', '),
        });
      } else {
        setError('Provider not found. Check your slug and phone.');
      }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await axios.put(api.updateProvider(slug), {
        phone, ...form,
        services: form.services.split(',').map(s => s.trim()).filter(Boolean),
      });
      if (res.data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.data.message);
      }
    } catch { setError('Update failed'); }
    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Edit Profile</h2>
          <p className="text-sm text-gray-500 mb-4">Apne profile ko edit karne ke liye phone number daalein</p>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm mb-3" />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition">
            {loading ? 'Checking...' : 'Continue'}
          </button>
          <Link to="/" className="block mt-4 text-xs text-gray-400 hover:text-orange-500 transition">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <Link to={`/provider/${slug}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-6 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          View Profile
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h2>

          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-4 text-sm text-green-700 font-medium">✅ Changes saved!</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mb-4 text-sm text-red-600">{error}</div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Business Name</label>
              <input name="businessName" value={form.businessName} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Category *</label>
              <input name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">City *</label>
              <input name="city" value={form.city} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm resize-none" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Price Range</label>
              <input name="priceRange" value={form.priceRange} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Services (comma)</label>
              <input name="services" value={form.services} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <button onClick={handleSave} disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

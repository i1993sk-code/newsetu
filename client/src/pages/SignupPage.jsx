import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

const DEFAULT_CATS = ['Plumber','Electrician','Beautician','Tutor','CA','Lawyer','Mechanic','Painter','Carpenter','AC Repair','Cook','Driver','Maid','Security Guard','Photographer','Event Planner','Fitness Trainer','Web Developer','Designer'];
const CAT_API = api.signup.replace('provider/signup', 'categories');

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', businessName: '', phone: '', category: '', district: '', state: 'Jharkhand', address: '', pincode: '', experience: '', description: '', services: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATS.map((n, i) => ({ _id: i, name: n })));

  useEffect(() => {
    axios.get(CAT_API, { timeout: 5000 }).then(r => { if (r.data.success && r.data.data.length > 0) setCategories(r.data.data); }).catch(() => {});
    document.title = 'Free Profile Banayein - NewSetu';
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(result.data.website);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = ['phone', 'pincode', 'experience'];
    setForm({ ...form, [name]: digitsOnly.includes(name) ? value.replace(/\D/g, '') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(api.signup, {
        ...form, services: form.services.split(',').map(s => s.trim()).filter(Boolean)
      });
      setForm({ name: '', businessName: '', phone: '', category: '', district: '', state: 'Jharkhand', address: '', pincode: '', experience: '', description: '', services: '' });
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-orange-500">New</span>Setu
          </h1>
          <p className="text-gray-500 mt-2">Free me apna profile banayein</p>
        </div>

        {result?.success ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
             <h2 className="text-xl font-bold text-gray-900 mb-2">Profile ready! 🎉</h2>
             <p className="text-sm text-gray-500 mb-4">Aapki profile ready hai:</p>
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl border border-orange-200 px-4 py-3 mb-4">
              <span className="flex-1 text-orange-600 font-bold text-sm truncate">{result.data.website}</span>
              <button onClick={copyLink}
                className="shrink-0 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition">
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400">Is link ko copy karein aur share karein!</p>
            <Link to="/" className="inline-block mt-6 text-sm text-gray-500 hover:text-orange-500 transition">
              ← Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Apna naam" maxLength={50}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
              <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Aapke business ka naam" maxLength={50}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone *</label>
              <input name="phone" required value={form.phone} onChange={handleChange} placeholder="Mobile number" type="tel" maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
               <select name="category" required value={form.category} onChange={handleChange}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition bg-white">
                 <option value="">Select category</option>
                 {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">District *</label>
                <select name="district" required value={form.district} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition bg-white">
                  <option value="">Select district</option>
                  {['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Saraikela Kharsawan','Simdega','Singhbhum (East)','Singhbhum (West)'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
                <select name="state" value={form.state} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition bg-white">
                  {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Mohalla, gali number, landmark..." rows={2} maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition resize-none" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="825301" maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange} placeholder="5" maxLength={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">About You / Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Aapke baare mein thoda batao..." rows={2} maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Services (comma separated)</label>
              <textarea name="services" value={form.services} onChange={handleChange} placeholder="Pipe fitting, Water tank repair, etc." rows={2} maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-xl transition text-sm shadow-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating...
                </span>
              ) : 'Free Profile Banayein 🚀'}
            </button>
            <Link to="/" className="block text-center text-xs text-gray-400 hover:text-orange-500 transition">← Back to home</Link>
          </form>
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

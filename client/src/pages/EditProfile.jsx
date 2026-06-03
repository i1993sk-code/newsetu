import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

const DEFAULT_CATS = ['Plumber','Electrician','Beautician','Tutor','CA','Lawyer','Mechanic','Painter','Carpenter','AC Repair','Cook','Driver','Maid','Security Guard','Photographer','Event Planner','Fitness Trainer','Web Developer','Designer'];
const CAT_API = api.signup.replace('provider/signup', 'categories');

const DISTRICTS = ['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Saraikela Kharsawan','Simdega','Singhbhum (East)','Singhbhum (West)'];
const STATES = ['Jharkhand','Bihar','West Bengal','Odisha','Uttar Pradesh','Madhya Pradesh','Chhattisgarh','Assam','Andhra Pradesh','Arunachal Pradesh','Goa','Gujarat','Haryana','Himachal Pradesh','Karnataka','Kerala','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttarakhand','Delhi','Chandigarh'];

export default function EditProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATS.map((n, i) => ({ _id: i, name: n })));
  const [delConfirm, setDelConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axios.get(CAT_API, { timeout: 5000 }).then(r => { if (r.data.success && r.data.data.length > 0) setCategories(r.data.data); }).catch(() => {});
  }, []);

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
          district: res.data.data.district || '',
          state: res.data.data.state || 'Jharkhand',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = ['phone', 'pincode', 'experience'];
    setForm({ ...form, [name]: digitsOnly.includes(name) ? value.replace(/\D/g, '') : value });
  };

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

  const handleDelete = async () => {
    if (delConfirm !== phone) return alert('Phone number match nahi karta');
    if (!confirm('Kya aap sure hain? Profile delete ho jayega permanently.')) return;
    setDeleting(true);
    try {
      const res = await axios.post(api.deleteProfile, { phone, slug });
      if (res.data.success) {
        alert('Profile deleted ✅');
        navigate('/');
      } else {
        alert(res.data.message);
      }
    } catch { alert('Delete failed'); }
    setDeleting(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Edit Profile</h2>
          <p className="text-sm text-gray-500 mb-4">Apne profile ko edit karne ke liye phone number daalein</p>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel" maxLength={10}
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

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4">
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
              <input name="name" value={form.name} onChange={handleChange} maxLength={50}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Business Name</label>
              <input name="businessName" value={form.businessName} onChange={handleChange} maxLength={50}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-white">
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">District</label>
                <select name="district" value={form.district} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-white">
                  <option value="">Select district</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">State</label>
                <select name="state" value={form.state} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm bg-white">
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm resize-none" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Experience</label>
                <input name="experience" value={form.experience} onChange={handleChange} maxLength={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Price Range</label>
              <input name="priceRange" value={form.priceRange} onChange={handleChange} maxLength={30}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Services (comma separated)</label>
              <input name="services" value={form.services} onChange={handleChange} maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            </div>
            <button onClick={handleSave} disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
          <h3 className="text-base font-bold text-red-600 mb-2">🚨 Delete Profile</h3>
          <p className="text-xs text-gray-500 mb-3">Profile delete karne ke liye apna phone number neeche daalein aur confirm karein.</p>
          <input value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder="Phone number type karein" type="tel" maxLength={10}
            className="w-full px-4 py-3 rounded-xl border border-red-200 focus:border-red-400 outline-none text-sm mb-3" />
          <button onClick={handleDelete} disabled={deleting || delConfirm !== phone}
            className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold rounded-xl text-sm transition">
            {deleting ? 'Deleting...' : 'Delete My Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

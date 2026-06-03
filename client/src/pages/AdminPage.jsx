import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export default function AdminPage() {
  const [pwd, setPwd] = useState('');
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('adminPwd'));
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', businessName: '', phone: '', category: '', district: '', state: 'Jharkhand', address: '', pincode: '', experience: '', priceRange: '', description: '', services: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { if (authed) loadProviders(); }, [authed]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const pw = sessionStorage.getItem('adminPwd');
      const res = await axios.get(api.adminAll(pw));
      if (res.data.success) setProviders(res.data.data);
    } catch {}
    setLoading(false);
  };

  const handleLogin = async () => {
    const res = await axios.post(api.adminLogin, { adminPwd: pwd });
    if (res.data.success) {
      sessionStorage.setItem('adminPwd', pwd);
      setAuthed(true);
    } else {
      alert('Wrong password');
    }
  };

  const handleLogout = () => { sessionStorage.removeItem('adminPwd'); setAuthed(false); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = ['phone', 'pincode', 'experience'];
    setForm({ ...form, [name]: digitsOnly.includes(name) ? value.replace(/\D/g, '') : value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    const pw = sessionStorage.getItem('adminPwd');
    try {
      const res = await axios.post(api.signup, {
        ...form, services: form.services.split(',').map(s => s.trim()).filter(Boolean), adminPwd: pw
      });
      if (res.data.success) {
        setMsg('✅ Provider added! Website: ' + res.data.data.website);
        setForm({ name: '', businessName: '', phone: '', category: '', district: '', state: 'Jharkhand', address: '', pincode: '', experience: '', priceRange: '', description: '', services: '' });
        loadProviders();
      } else {
        setMsg('❌ ' + res.data.message);
      }
    } catch (err) { setMsg('❌ Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this provider?')) return;
    const pw = sessionStorage.getItem('adminPwd');
    await axios.delete(api.adminDelete(id, pw));
    loadProviders();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin</h1>
          <p className="text-sm text-gray-500 mb-4">Password daalein</p>
          <input value={pwd} onChange={e => setPwd(e.target.value)} type="password" placeholder="Password" onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 text-sm outline-none" />
          <button onClick={handleLogin} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl text-sm">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">⚙️ Admin Panel</h1>
          <div className="flex gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-orange-500 transition">← Site</Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">➕ Add Provider</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-3">
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Name *" maxLength={50}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
              <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name" maxLength={50}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
            </div>
            <div className="flex gap-3">
              <input name="phone" required value={form.phone} onChange={handleChange} placeholder="Phone *" type="tel" maxLength={10}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
              <select name="category" required value={form.category} onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                <option value="">Category *</option>
                {['Plumber','Electrician','Beautician','Tutor','CA','Lawyer','Mechanic','Painter','Carpenter','AC Repair','Cook','Driver','Maid','Security Guard','Photographer','Event Planner','Fitness Trainer','Web Developer','Designer'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <select name="district" required value={form.district} onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                <option value="">District *</option>
                {['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Saraikela Kharsawan','Simdega','Singhbhum (East)','Singhbhum (West)'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select name="state" value={form.state} onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                {['Jharkhand','Bihar','West Bengal','Odisha','Uttar Pradesh','Madhya Pradesh','Chhattisgarh','Assam','Andhra Pradesh','Arunachal Pradesh','Goa','Gujarat','Haryana','Himachal Pradesh','Karnataka','Kerala','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttarakhand','Delhi','Chandigarh'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" maxLength={6}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
              <select name="experience" value={form.experience} onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                <option value="">Experience</option>
                {['1','2','3','4','5','6','7','8','9','10','10+'].map(e => (
                  <option key={e} value={e}>{e} {e === '10+' ? '' : 'yr'}</option>
                ))}
              </select>
              <input name="priceRange" value={form.priceRange} onChange={handleChange} placeholder="Price (₹200-500)" maxLength={30}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={2} maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none" />
            <textarea name="services" value={form.services} onChange={handleChange} placeholder="Services (comma: Pipe fitting, Repair)" rows={1} maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none" />
            <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm">Add Provider</button>
            {msg && <p className="text-sm text-center">{msg}</p>}
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 All Providers ({providers.length})</h2>
          {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-gray-400 text-xs uppercase">
                  <th className="pb-2 pr-3">Name</th><th className="pb-2 pr-3">Phone</th><th className="pb-2 pr-3">Category</th><th className="pb-2 pr-3">District</th><th className="pb-2 pr-3">Date</th><th className="pb-2"></th>
                </tr></thead>
                <tbody>
                  {providers.map(p => (
                    <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 pr-3 font-medium">{p.businessName || p.name}</td>
                      <td className="py-3 pr-3 text-gray-500">{p.phone}</td>
                      <td className="py-3 pr-3 text-gray-500">{p.category}</td>
                      <td className="py-3 pr-3 text-gray-500">{p.district || p.city}</td>
                      <td className="py-3 pr-3 text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <a href={`/provider/${p.slug}`} target="_blank" rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">View</a>
                          <a href={`/edit/${p.slug}`} target="_blank" rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100">Edit</a>
                          <button onClick={() => handleDelete(p._id)}
                            className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

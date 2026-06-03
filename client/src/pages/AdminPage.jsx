import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

const DEFAULT_CATS = ['Plumber','Electrician','Beautician','Tutor','CA','Lawyer','Mechanic','Painter','Carpenter','AC Repair','Cook','Driver','Maid','Security Guard','Photographer','Event Planner','Fitness Trainer','Web Developer','Designer'];
const CAT_API = api.signup.replace('provider/signup', 'categories');

export default function AdminPage() {
  const [pwd, setPwd] = useState('');
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('adminPwd'));
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState(DEFAULT_CATS.map((n, i) => ({ _id: i, name: n })));
  const [newCat, setNewCat] = useState('');
  const [form, setForm] = useState({ name: '', businessName: '', phone: '', category: '', district: '', state: 'Jharkhand', address: '', pincode: '', experience: '', description: '', services: '' });
  const [msg, setMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { if (authed) { loadCategories(); } }, [authed]);
  useEffect(() => { if (authed) loadProviders(); }, [authed, page, search]);

  const loadCategories = async () => {
    try {
      const res = await axios.get(CAT_API, { timeout: 5000 });
      if (res.data.success && res.data.data.length > 0) setCategories(res.data.data);
    } catch {}
  };

  const loadProviders = async () => {
    setLoading(true);
    try {
      const pw = sessionStorage.getItem('adminPwd');
      const res = await axios.get(api.adminAll(pw, page, 20, search), { timeout: 10000 });
      if (res.data.success) {
        setProviders(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {}
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!pwd.trim()) return alert('Password daalein');
    setLoginLoading(true);
    try {
      const res = await axios.post(api.adminLogin, { adminPwd: pwd }, { timeout: 15000 });
      if (res.data.success) {
        sessionStorage.setItem('adminPwd', pwd);
        setAuthed(true);
      } else {
        alert('Wrong password');
      }
    } catch (err) {
      alert('Backend se connect nahi ho pa raha. Render pe redeploy ho raha hoga, 1 min me try karein.\nError: ' + (err.message || 'Unknown'));
    }
    setLoginLoading(false);
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
      }, { timeout: 10000 });
      if (res.data.success) {
        setMsg('✅ Added! ' + res.data.data.website);
        setForm({ name: '', businessName: '', phone: '', category: '', district: '', state: 'Jharkhand', address: '', pincode: '', experience: '', description: '', services: '' });
        setPage(1); loadProviders();
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

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    const pw = sessionStorage.getItem('adminPwd');
    try {
      const res = await axios.post(CAT_API, { name: newCat.trim(), adminPwd: pw }, { timeout: 5000 });
      if (res.data.success) { setNewCat(''); loadCategories(); }
      else { alert(res.data.message); }
    } catch { alert('Error adding category'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    const pw = sessionStorage.getItem('adminPwd');
    try {
      await axios.delete(CAT_API + '/' + id + '?adminPwd=' + pw);
      loadCategories();
    } catch {}
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin</h1>
          <p className="text-sm text-gray-500 mb-4">Password daalein</p>
          <input value={pwd} onChange={e => setPwd(e.target.value)} type="password" placeholder="Password" onKeyDown={e => e.key === 'Enter' && !loginLoading && handleLogin()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 text-sm outline-none" />
          <button onClick={handleLogin} disabled={loginLoading} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl text-sm disabled:opacity-50">{loginLoading ? 'Please wait...' : 'Login'}</button>
          <Link to="/" className="block mt-4 text-xs text-gray-400 hover:text-orange-500 transition">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">⚙️ Admin</h1>
          <div className="flex gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-orange-500 transition">← Site</Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">➕ Add Provider</h2>
            <form onSubmit={handleAdd} className="space-y-2.5">
              <div className="flex gap-2">
                <input name="name" required value={form.name} onChange={handleChange} placeholder="Name *" maxLength={50}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
                <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name" maxLength={50}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
              </div>
              <div className="flex gap-2">
                <input name="phone" required value={form.phone} onChange={handleChange} placeholder="Phone *" type="tel" maxLength={10}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
                <select name="category" required value={form.category} onChange={handleChange}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                  <option value="">Category *</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <select name="district" required value={form.district} onChange={handleChange}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                  <option value="">District *</option>
                  {['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Saraikela Kharsawan','Simdega','Singhbhum (East)','Singhbhum (West)'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select name="state" value={form.state} onChange={handleChange}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                  <option value="">State</option>
                  {['Jharkhand','Bihar','West Bengal','Odisha','Uttar Pradesh','Madhya Pradesh','Chhattisgarh','Assam','Andhra Pradesh','Arunachal Pradesh','Goa','Gujarat','Haryana','Himachal Pradesh','Karnataka','Kerala','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttarakhand','Delhi','Chandigarh'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" maxLength={6}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
                <select name="experience" value={form.experience} onChange={handleChange}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                  <option value="">Experience</option>
                  {['1','2','3','4','5','6','7','8','9','10','10+'].map(e => (
                    <option key={e} value={e}>{e} {e === '10+' ? '' : 'yr'}</option>
                  ))}
                </select>
              </div>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={2} maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none" />
              <textarea name="services" value={form.services} onChange={handleChange} placeholder="Services (comma: Pipe fitting, Repair)" rows={1} maxLength={100}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none" />
              <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm">Add Provider</button>
              {msg && <p className="text-sm text-center">{msg}</p>}
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">📂 Categories</h2>
            <div className="flex gap-2 mb-3">
              <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" maxLength={50}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
              <button onClick={handleAddCategory} className="px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl text-sm whitespace-nowrap">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <span key={c._id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                  {c.name}
                  <button onClick={() => handleDeleteCategory(c._id)} className="text-red-400 hover:text-red-600 font-bold leading-none">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-gray-900">📋 Providers</h2>
            <div className="flex items-center gap-2">
              <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search name/phone/category..."
                className="flex-1 sm:w-48 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none" />
              {search && <button onClick={() => handleSearch('')} className="text-xs text-gray-400 hover:text-gray-600">✕</button>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs disabled:opacity-30 hover:bg-gray-200">&larr; Prev</button>
              <span className="text-xs text-gray-500">Page {page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs disabled:opacity-30 hover:bg-gray-200">Next &rarr;</button>
            </div>
          </div>
          {loading ? <p className="text-gray-400 text-sm text-center py-8">Loading...</p> : (
            <>
              <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
                <table className="w-full text-sm min-w-[500px]">
                  <thead><tr className="border-b text-left text-gray-400 text-xs uppercase">
                    <th className="pb-2 pr-2 whitespace-nowrap">Name</th>
                    <th className="pb-2 pr-2 whitespace-nowrap">Phone</th>
                    <th className="pb-2 pr-2 whitespace-nowrap">Category</th>
                    <th className="pb-2 pr-2 whitespace-nowrap hidden sm:table-cell">District</th>
                    <th className="pb-2 pr-2 whitespace-nowrap hidden sm:table-cell">Date</th>
                    <th className="pb-2"></th>
                  </tr></thead>
                  <tbody>
                    {providers.map(p => (
                      <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2.5 pr-2 font-medium whitespace-nowrap">{p.businessName || p.name}</td>
                        <td className="py-2.5 pr-2 text-gray-500 whitespace-nowrap">{p.phone}</td>
                        <td className="py-2.5 pr-2 text-gray-500 whitespace-nowrap">{p.category}</td>
                        <td className="py-2.5 pr-2 text-gray-500 whitespace-nowrap hidden sm:table-cell">{p.district || p.city}</td>
                        <td className="py-2.5 pr-2 text-gray-400 text-xs whitespace-nowrap hidden sm:table-cell">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-2.5">
                          <div className="flex gap-1.5">
                            <a href={`/provider/${p.slug}`} target="_blank" rel="noopener noreferrer"
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">View</a>
                            <a href={`/edit/${p.slug}`} target="_blank" rel="noopener noreferrer"
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100">Edit</a>
                            <button onClick={() => handleDelete(p._id)}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100">Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {providers.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No providers yet</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

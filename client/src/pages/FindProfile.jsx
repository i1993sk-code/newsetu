import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';

export default function FindProfile() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post(api.login, { phone });
      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setError('Is phone number se koi provider nahi mila');
      }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-md mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-orange-500">New</span>Setu
          </h1>
          <p className="text-gray-500 mt-2">Apna profile dhoondein</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex gap-2">
            <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Apna phone number daalein" type="tel" maxLength={10}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 outline-none text-sm" />
            <button onClick={handleSearch} disabled={loading}
              className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition">
              {loading ? '...' : 'Search'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

          {result && (
            <div className="mt-6 bg-orange-50 rounded-xl border border-orange-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                  {(result.businessName || result.name)[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{result.businessName || result.name}</p>
                  <p className="text-xs text-gray-500">{result.category} — {result.city}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link to={`/provider/${result.slug}`}
                  className="flex-1 text-center px-4 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition">
                  View Profile
                </Link>
                <Link to={`/edit/${result.slug}`}
                  className="flex-1 text-center px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl text-sm hover:bg-gray-800 transition">
                  ✏️ Edit
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-orange-500 transition">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}

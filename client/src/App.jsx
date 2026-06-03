import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProviderPage from './pages/ProviderPage';
import SignupPage from './pages/SignupPage';
import EditProfile from './pages/EditProfile';
import FindProfile from './pages/FindProfile';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/provider/:slug" element={<ProviderPage />} />
        <Route path="/edit/:slug" element={<EditProfile />} />
        <Route path="/find" element={<FindProfile />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

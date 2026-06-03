import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProviderPage from './pages/ProviderPage';
import SignupPage from './pages/SignupPage';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/provider/:slug" element={<ProviderPage />} />
        <Route path="/edit/:slug" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

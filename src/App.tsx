import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Storefront } from './pages/Storefront';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop" element={<Storefront />} />
      </Routes>
    </BrowserRouter>
  );
}

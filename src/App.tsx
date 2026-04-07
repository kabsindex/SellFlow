import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { BillingReturn } from './pages/BillingReturn';
import { Login } from './pages/Login';
import { Storefront } from './pages/Storefront';
import { AuthProvider, useAuth } from './auth/AuthContext';

function ProtectedDashboard() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Chargement de ton espace vendeur...
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  return <Dashboard />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/billing/return" element={<BillingReturn />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/shop" element={<Storefront />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

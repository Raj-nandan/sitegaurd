import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientProvider } from './context/ClientContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthLayout from './components/auth/AuthLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';
import DashboardLayout from './pages/dashboard/index';
import Overview from './pages/dashboard/Overview';
import Clients from './pages/dashboard/Clients';
import Alerts from './pages/dashboard/Alerts';
import StatusPage from './pages/dashboard/StatusPage';
import Settings from './pages/dashboard/Settings';
import PublicStatus from './pages/public/PublicStatus';

// Lazy-loaded heavy pages
const ClientDetail = lazy(() => import('./pages/dashboard/ClientDetail'));
const Reports = lazy(() => import('./pages/dashboard/Reports'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg)', color: 'var(--text3)',
    fontFamily: 'DM Mono, monospace', fontSize: 14
  }}>
    Loading…
  </div>
);

function App() {
  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('sg-theme') || 'light';
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  return (
    <AuthProvider>
      <ClientProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
            <Route path="/status/:userId" element={<PublicStatus />} />

            {/* Protected */}
            <Route path="/onboarding" element={
              <PrivateRoute><Onboarding /></PrivateRoute>
            } />

            {/* Dashboard */}
            <Route path="/dashboard" element={
              <PrivateRoute><DashboardLayout /></PrivateRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:clientId" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ClientDetail />
                </Suspense>
              } />
              <Route path="alerts" element={<Alerts />} />
              <Route path="status" element={<StatusPage />} />
              <Route path="reports" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Reports />
                </Suspense>
              } />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ClientProvider>
    </AuthProvider>
  );
}

export default App;

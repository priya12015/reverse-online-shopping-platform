import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import LandingPage       from './pages/LandingPage';
import AuthPage          from './pages/AuthPage';
import BuyerDashboard    from './pages/BuyerDashboard';
import SellerDashboard   from './pages/SellerDashboard';
import PostRequirement   from './pages/PostRequirement';
import RequirementDetail from './pages/RequirementDetail';

function Guard({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<LandingPage />} />
        <Route path="/auth"              element={<AuthPage />} />
        <Route path="/buyer/dashboard"   element={<Guard><BuyerDashboard /></Guard>} />
        <Route path="/buyer/post"        element={<Guard><PostRequirement /></Guard>} />
        <Route path="/requirement/:id"   element={<Guard><RequirementDetail /></Guard>} />
        <Route path="/seller/dashboard"  element={<Guard><SellerDashboard /></Guard>} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

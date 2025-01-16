import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './hooks/auth/useAuthContext';
import { useAuthInit } from './hooks/auth/useAuthInit';
import { HomePage } from './pages/HomePage';
import { NavBar } from './components/navbar/NavBar';

function AppContent() {
  useAuthInit();
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <NavBar user={user} />}
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './hooks/auth/useAuthContext';
import { useAuthInit } from './hooks/auth/useAuthInit';
import { HomePage } from './pages/HomePage';
import { NavBar } from './components/navbar/NavBar';
import { UserPage } from './pages/UserPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolderPage } from './pages/FolderPage';
import { NotePage } from './pages/NotePage';

function AppContent() {
  const loading = useAuthInit();
  const { user } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

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
            element={<HomePage />}
          />
          <Route
            path="/user/:username" element={user ? <UserPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/folder/:id" element={user ? <FolderPage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/note/:id" element={user ? <NotePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/*"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;

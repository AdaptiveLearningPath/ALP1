import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import ChildDashboard from './pages/dashboard/ChildDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import GamePage from './pages/games/GamePage';
import NotFound from './pages/NotFound';

// Layout
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[]; 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      {/* Teacher routes */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout role="teacher" />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
      </Route>
      
      {/* Child routes */}
      <Route
        path="/child/*"
        element={
          <ProtectedRoute allowedRoles={['child']}>
            <DashboardLayout role="child" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ChildDashboard />} />
        <Route path="games/:gameId" element={<GamePage />} />
      </Route>
      
      {/* Parent routes */}
      <Route
        path="/parent/*"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <DashboardLayout role="parent" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentDashboard />} />
      </Route>
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  User, 
  Book, 
  BarChart,
  BookOpen,
  Users, 
  UserCircle, 
  Gamepad2,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

interface DashboardLayoutProps {
  role: 'teacher' | 'child' | 'parent';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  
  const getNavItems = () => {
    switch (role) {
      case 'teacher':
        return [
          { name: 'Dashboard', icon: <Home size={20} />, path: '/teacher' },
          { name: 'Students', icon: <Users size={20} />, path: '/teacher/students' },
          { name: 'Classes', icon: <BookOpen size={20} />, path: '/teacher/classes' },
          { name: 'Analytics', icon: <BarChart size={20} />, path: '/teacher/analytics' },
          { name: 'Resources', icon: <Book size={20} />, path: '/teacher/resources' },
        ];
      case 'child':
        return [
          { name: 'Dashboard', icon: <Home size={20} />, path: '/child' },
          { name: 'Games', icon: <Gamepad2 size={20} />, path: '/child/games' },
          { name: 'Achievements', icon: <BarChart size={20} />, path: '/child/achievements' },
          { name: 'Rewards', icon: <Book size={20} />, path: '/child/rewards' },
        ];
      case 'parent':
        return [
          { name: 'Dashboard', icon: <Home size={20} />, path: '/parent' },
          { name: 'Children', icon: <Users size={20} />, path: '/parent/children' },
          { name: 'Progress', icon: <BarChart size={20} />, path: '/parent/progress' },
          { name: 'Settings', icon: <Settings size={20} />, path: '/parent/settings' },
        ];
      default:
        return [];
    }
  };
  
  const navItems = getNavItems();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Different styling based on user role
  const getHeaderColorClass = () => {
    switch (role) {
      case 'teacher': return 'bg-primary-600';
      case 'child': return 'bg-secondary-500';
      case 'parent': return 'bg-accent-500';
      default: return 'bg-primary-600';
    }
  };

  // Simplified UI for children
  const isChildFriendly = role === 'child';
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className={`${getHeaderColorClass()} shadow-md z-10`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">LearnSphere</span>
              </div>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center">
              {/* Notification bell */}
              <div className="relative mr-4">
                <Bell className="h-6 w-6 text-white cursor-pointer hover:text-gray-200" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
              
              {/* User menu */}
              <div className="ml-3 relative hidden md:block">
                <div className="flex items-center">
                  {user?.avatar ? (
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src={user.avatar} 
                      alt={user.name}
                    />
                  ) : (
                    <UserCircle className="h-8 w-8 text-white" />
                  )}
                  <span className="ml-2 text-sm font-medium text-white">{user?.name}</span>
                </div>
              </div>
              
              {/* Logout button (desktop) */}
              <div className="hidden md:ml-4 md:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  Logout
                </Button>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 focus:outline-none"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-20"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        <div className={`py-6 ${isChildFriendly ? 'px-2 sm:px-4' : 'px-4 sm:px-6 lg:px-8'}`}>
          <Outlet />
        </div>
      </main>
      
      {/* Footer - simplified for children */}
      <footer className={`py-4 ${getHeaderColorClass()} text-white text-center ${isChildFriendly ? 'text-lg' : 'text-sm'}`}>
        <p>&copy; {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
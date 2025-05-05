import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="flex justify-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <Brain className="h-12 w-12 text-primary-600" />
            <span className="ml-2 text-3xl font-bold text-gray-900">LearnSphere</span>
          </div>
        </motion.div>
        <motion.h2 
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </motion.h2>
        <motion.p 
          className="mt-2 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isLogin ? 
            'Enter your credentials to access your dashboard' : 
            'Join our adaptive learning platform'
          }
        </motion.p>
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
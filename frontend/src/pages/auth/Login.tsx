import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState<'teacher' | 'child' | 'parent'>('teacher');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const user = await login(email, password);
      
      // Navigate based on user role
      switch (user.role) {
        case 'teacher':
          navigate('/teacher');
          break;
        case 'child':
          navigate('/child');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          navigate('/login');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quick login helper for demo purposes
  const handleQuickLogin = (userType: 'teacher' | 'child' | 'parent') => {
    setRole(userType);
    
    switch (userType) {
      case 'teacher':
        setEmail('teacher@example.com');
        break;
      case 'child':
        setEmail('child@example.com');
        break;
      case 'parent':
        setEmail('parent@example.com');
        break;
    }
    
    setPassword('password123');
  };

  const wrapperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <motion.div
      variants={wrapperVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div variants={itemVariants}>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => handleQuickLogin('teacher')}
              className={`p-3 rounded-full ${role === 'teacher' ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500' : 'bg-gray-100 text-gray-600 hover:bg-primary-50'}`}
            >
              <User size={24} />
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('child')}
              className={`p-3 rounded-full ${role === 'child' ? 'bg-secondary-100 text-secondary-600 ring-2 ring-secondary-500' : 'bg-gray-100 text-gray-600 hover:bg-secondary-50'}`}
            >
              <User size={24} />
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('parent')}
              className={`p-3 rounded-full ${role === 'parent' ? 'bg-accent-100 text-accent-600 ring-2 ring-accent-500' : 'bg-gray-100 text-gray-600 hover:bg-accent-50'}`}
            >
              <User size={24} />
            </button>
          </div>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Quick select: {role === 'teacher' ? 'Teacher' : role === 'child' ? 'Child' : 'Parent'}
            </p>
          </div>
        </motion.div>
        
        {error && (
          <motion.div
            variants={itemVariants}
            className="p-3 bg-error-50 text-error-800 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            leftIcon={<Mail size={18} />}
            fullWidth
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<Lock size={18} />}
            fullWidth
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          >
            Sign in
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register here
            </Link>
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            Demo credentials: Use any email with password "password123"
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Login;
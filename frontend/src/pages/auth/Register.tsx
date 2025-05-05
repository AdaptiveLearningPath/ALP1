import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('child');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const user = await register({ name, email, role }, password);
      
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
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-primary-100 text-primary-600">
              <UserCircle size={32} />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Create your account</h3>
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
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            leftIcon={<User size={18} />}
            fullWidth
            required
          />
        </motion.div>
        
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            I am a
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className={`py-2 px-4 border rounded-md focus:outline-none transition-colors ${
                role === 'teacher'
                  ? 'bg-primary-100 border-primary-600 text-primary-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setRole('teacher')}
            >
              Teacher
            </button>
            <button
              type="button"
              className={`py-2 px-4 border rounded-md focus:outline-none transition-colors ${
                role === 'child'
                  ? 'bg-primary-100 border-primary-600 text-primary-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setRole('child')}
            >
              Child
            </button>
            <button
              type="button"
              className={`py-2 px-4 border rounded-md focus:outline-none transition-colors ${
                role === 'parent'
                  ? 'bg-primary-100 border-primary-600 text-primary-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setRole('parent')}
            >
              Parent
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            leftIcon={<Lock size={18} />}
            fullWidth
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            leftIcon={<Lock size={18} />}
            fullWidth
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          >
            Create Account
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Register;
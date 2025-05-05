import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-9xl font-bold text-primary-500">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-8">
            <Link to="/">
              <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
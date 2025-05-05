import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart, 
  Calendar, 
  Award, 
  Clock, 
  BookOpen,
  ArrowUpRight,
  ArrowDown,
  TrendingUp
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import { Teacher } from '../../types';
import { mockUsers } from '../../data/mockUsers';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const teacherUser = user as Teacher;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Get students data
  const students = mockUsers.filter(u => u.role === 'child');
  
  // Stats cards data
  const statsCards = [
    { icon: <Users className="h-8 w-8 text-primary-500" />, title: 'Total Students', value: teacherUser?.students?.length || 0, change: '+2', isPositive: true },
    { icon: <Award className="h-8 w-8 text-success-500" />, title: 'Achievements', value: 48, change: '+12', isPositive: true },
    { icon: <Clock className="h-8 w-8 text-warning-500" />, title: 'Avg. Time', value: '28 min', change: '-5%', isPositive: true },
    { icon: <BookOpen className="h-8 w-8 text-secondary-500" />, title: 'Completion Rate', value: '76%', change: '-2%', isPositive: false },
  ];
  
  // Top performing students
  const topStudents = students
    .slice(0, 5)
    .map(student => {
      // Get a random progress value for demo purposes
      const progressValue = Math.floor(Math.random() * 100);
      return {
        ...student,
        progressValue
      };
    })
    .sort((a, b) => b.progressValue - a.progressValue);
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {teacherUser?.name}!</h1>
            <p className="text-white text-opacity-90 mt-1">Here's what's happening with your students today.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10">
              View Class Schedule
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Stats cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} elevated className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
              
              <div className={`flex items-center mt-4 text-sm ${
                stat.isPositive ? 'text-success-600' : 'text-error-600'
              }`}>
                {stat.isPositive ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDown size={16} className="mr-1" />
                )}
                <span>{stat.change} from last month</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
      
      {/* Charts and reports */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Progress */}
        <Card elevated className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-bold">Student Progress</h2>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={16} />}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {topStudents.map((student) => (
              <div key={student.id} className="flex items-center">
                {student.avatar ? (
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="h-10 w-10 rounded-full mr-3" 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users size={16} className="text-gray-500" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-gray-500 text-sm">{student.progressValue}%</span>
                  </div>
                  <ProgressBar 
                    value={student.progressValue} 
                    max={100} 
                    colorScheme={student.progressValue > 80 ? 'success' : student.progressValue > 50 ? 'primary' : 'warning'} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Activity */}
        <Card elevated className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-bold">Recent Activity</h2>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={16} />}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Alex Williams', action: 'completed Math Adventure - Level 3', time: '35 min ago', icon: '🎮' },
              { name: 'Sarah Johnson', action: 'earned the "Word Master" badge', time: '2 hours ago', icon: '🏆' },
              { name: 'Michael Thomas', action: 'started Science Explorer game', time: '3 hours ago', icon: '🚀' },
              { name: 'Emily Clark', action: 'completed daily assessment', time: '5 hours ago', icon: '📝' },
              { name: 'David Rodriguez', action: 'reached 7-day streak', time: 'Yesterday', icon: '🔥' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center text-lg mr-3 mt-1">
                  {activity.icon}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{activity.name} <span className="font-normal text-gray-600">{activity.action}</span></p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
      
      {/* Upcoming Classes */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold">Upcoming Classes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gray-50 text-gray-700 uppercase text-sm">
                <th className="py-3 px-4 text-left font-medium">Class</th>
                <th className="py-3 px-4 text-left font-medium">Time</th>
                <th className="py-3 px-4 text-left font-medium">Students</th>
                <th className="py-3 px-4 text-left font-medium">Topic</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { class: 'Class A', time: 'Today, 10:00 AM', students: 12, topic: 'Introduction to Fractions', status: 'Upcoming' },
                { class: 'Class B', time: 'Today, 1:30 PM', students: 15, topic: 'Vocabulary Development', status: 'Upcoming' },
                { class: 'Class A', time: 'Tomorrow, 10:00 AM', students: 12, topic: 'Addition and Subtraction', status: 'Scheduled' },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.class}</td>
                  <td className="py-3 px-4 text-gray-700">{item.time}</td>
                  <td className="py-3 px-4">{item.students} students</td>
                  <td className="py-3 px-4">{item.topic}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Upcoming' 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="primary" size="sm">
                      Start Class
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard;
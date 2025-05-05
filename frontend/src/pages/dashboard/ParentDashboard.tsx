import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart, 
  Clock, 
  Award, 
  Calendar, 
  BookOpen,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { Parent } from '../../types';
import { mockUsers } from '../../data/mockUsers';
import { mockGames } from '../../data/mockGames';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const parentUser = user as Parent;
  
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
  
  // Get children data
  const children = mockUsers.filter(u => 
    u.role === 'child' && parentUser?.children?.includes(u.id)
  ) as any[];
  
  // Get current date
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
  // Calculate average stats across children
  const calculateAverageStats = () => {
    if (children.length === 0) return { avgProgress: 0, avgTimeSpent: 0, totalAchievements: 0 };
    
    let totalProgress = 0;
    let totalTimeSpent = 0;
    let totalAchievements = 0;
    
    children.forEach(child => {
      // Calculate progress
      let completedLevels = 0;
      let totalLevels = 0;
      
      Object.values(child.progress || {}).forEach((gameProgress: any) => {
        completedLevels += gameProgress.completedLevels?.length || 0;
        
        // Find the game to get total levels
        const game = mockGames.find(g => g.id === gameProgress.gameId);
        totalLevels += game?.levels.length || 5; // Default to 5 if game not found
      });
      
      totalProgress += (completedLevels / (totalLevels || 1)) * 100;
      
      // Mock time spent (minutes) and achievements
      totalTimeSpent += Math.floor(Math.random() * 60) + 30; // 30-90 minutes
      totalAchievements += Math.floor(Math.random() * 5) + 1; // 1-5 achievements
    });
    
    return {
      avgProgress: Math.round(totalProgress / children.length),
      avgTimeSpent: Math.round(totalTimeSpent / children.length),
      totalAchievements
    };
  };
  
  const avgStats = calculateAverageStats();
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-accent-500 to-accent-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {parentUser?.name}!</h1>
            <p className="text-white text-opacity-90 mt-1">
              Today is {formattedDate}. Here's how your children are progressing:
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10">
              Weekly Report
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Stats cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card elevated className="p-4">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Average Progress</p>
                <p className="text-2xl font-bold">{avgStats.avgProgress}%</p>
              </div>
            </div>
          </Card>
          
          <Card elevated className="p-4">
            <div className="flex items-center">
              <div className="bg-secondary-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Time Spent</p>
                <p className="text-2xl font-bold">{avgStats.avgTimeSpent} min</p>
              </div>
            </div>
          </Card>
          
          <Card elevated className="p-4">
            <div className="flex items-center">
              <div className="bg-success-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Achievements</p>
                <p className="text-2xl font-bold">{avgStats.totalAchievements}</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
      
      {/* Children Progress */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-bold">Your Children</h2>
        </div>
        
        <div className="space-y-4">
          {children.length > 0 ? (
            children.map((child) => {
              // Calculate child's overall progress
              let completedLevels = 0;
              let totalLevels = 0;
              
              Object.values(child.progress || {}).forEach((gameProgress: any) => {
                completedLevels += gameProgress.completedLevels?.length || 0;
                
                // Find the game to get total levels
                const game = mockGames.find(g => g.id === gameProgress.gameId);
                totalLevels += game?.levels.length || 5;
              });
              
              const progressPercentage = totalLevels > 0 
                ? Math.round((completedLevels / totalLevels) * 100) 
                : 0;
              
              return (
                <Card key={child.id} elevated className="overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                        {child.avatar ? (
                          <img 
                            src={child.avatar} 
                            alt={child.name} 
                            className="h-16 w-16 rounded-full border-4 border-white shadow-md" 
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-accent-100 flex items-center justify-center">
                            <Users size={24} className="text-accent-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{child.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="secondary">{child.grade}</Badge>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-gray-600">Age: {child.age}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:mt-0">
                            <Button 
                              variant="primary" 
                              size="sm" 
                              rightIcon={<ArrowUpRight size={16} />}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="col-span-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Overall Progress</span>
                              <span className="text-sm text-gray-600">{progressPercentage}%</span>
                            </div>
                            <ProgressBar 
                              value={progressPercentage} 
                              max={100} 
                              colorScheme={
                                progressPercentage >= 70 ? 'success' : 
                                progressPercentage >= 40 ? 'primary' : 
                                'warning'
                              } 
                            />
                          </div>
                          
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm">Time Spent</div>
                            <div className="font-bold flex items-center mt-1">
                              <Clock size={16} className="mr-1 text-gray-500" />
                              {Math.floor(Math.random() * 60) + 30} min
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm">Last Activity</div>
                            <div className="font-bold mt-1">Today</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No children have been added to your account yet.</p>
              <Button variant="primary" className="mt-4">
                Add Child
              </Button>
            </Card>
          )}
        </div>
      </motion.div>
      
      {/* Recent Activity and Calendar */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card elevated className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-accent-600 mr-2" />
              <h2 className="text-lg font-bold">Recent Activity</h2>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={16} />}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { childName: 'Alex Williams', action: 'completed Math Adventure - Level 3', time: '35 min ago', icon: '🎮' },
              { childName: 'Alex Williams', action: 'earned the "Word Master" badge', time: '2 hours ago', icon: '🏆' },
              { childName: 'Alex Williams', action: 'started Science Explorer game', time: '3 hours ago', icon: '🚀' },
              { childName: 'Alex Williams', action: 'completed daily assessment', time: '5 hours ago', icon: '📝' },
              { childName: 'Alex Williams', action: 'reached 7-day streak', time: 'Yesterday', icon: '🔥' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-accent-100 rounded-full h-8 w-8 flex items-center justify-center text-lg mr-3 mt-1">
                  {activity.icon}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{activity.childName} <span className="font-normal text-gray-600">{activity.action}</span></p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Learning Insights */}
        <Card elevated className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-accent-600 mr-2" />
              <h2 className="text-lg font-bold">Learning Insights</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Strengths', description: 'Alex shows strong skills in mathematical reasoning and problem-solving.', icon: '💪' },
              { title: 'Areas for Growth', description: 'Consider more practice with spelling and vocabulary building.', icon: '🌱' },
              { title: 'Learning Style', description: 'Visual and interactive learning seems most effective.', icon: '🧠' },
              { title: 'Recommendation', description: 'Try the "Word Wizard" game to improve language skills.', icon: '💡' },
            ].map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-accent-100 rounded-full h-8 w-8 flex items-center justify-center text-lg mr-3 mt-1">
                  {insight.icon}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-6">
              <Button variant="primary" fullWidth>
                View Full Report
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Recommended Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-bold">Recommended Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Review Progress Report', description: 'Check detailed insights into your child\'s learning journey', icon: '📊', buttonText: 'View Report' },
            { title: 'Schedule Parent-Teacher Meeting', description: 'Discuss your child\'s progress with their teacher', icon: '👨‍🏫', buttonText: 'Schedule' },
            { title: 'Set Learning Goals', description: 'Create personalized learning objectives for your child', icon: '🎯', buttonText: 'Set Goals' },
          ].map((action, index) => (
            <Card key={index} elevated className="p-5">
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="text-lg font-bold mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <Button variant="outline" fullWidth>
                {action.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParentDashboard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Star, Clock, Calendar, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { mockGames } from '../../data/mockGames';
import { Child } from '../../types';

const ChildDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const childUser = user as Child;
  
  // Get games with progress
  const gamesWithProgress = mockGames.map(game => {
    const progress = childUser?.progress?.[game.id] || {
      completedLevels: [],
      currentLevel: 1,
      highestScore: 0
    };
    
    return {
      ...game,
      progress
    };
  });
  
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
  
  // Get current date for welcome message
  const currentHour = new Date().getHours();
  let greeting;
  
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  
  // Get day streak (mock data)
  const [dayStreak] = useState(5);
  
  // Handle game selection
  const handlePlayGame = (gameId: string) => {
    navigate(`/child/games/${gameId}`);
  };
  
  // Calculate total progress across all games
  const calculateOverallProgress = () => {
    let totalCompletedLevels = 0;
    let totalLevels = 0;
    
    gamesWithProgress.forEach(game => {
      totalCompletedLevels += game.progress.completedLevels.length;
      totalLevels += game.levels.length;
    });
    
    return {
      completed: totalCompletedLevels,
      total: totalLevels,
      percentage: Math.round((totalCompletedLevels / totalLevels) * 100)
    };
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Get recommended games (games with current progress)
  const recommendedGames = gamesWithProgress
    .filter(game => game.progress.completedLevels.length > 0 && 
                   game.progress.completedLevels.length < game.levels.length)
    .sort((a, b) => b.progress.highestScore - a.progress.highestScore)
    .slice(0, 2);
  
  // Get new games (games with no progress)
  const newGames = gamesWithProgress
    .filter(game => !game.progress.completedLevels.length)
    .slice(0, 3);
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">{greeting}, {childUser?.name}!</h1>
            <p className="text-white text-opacity-90 mt-1">Ready to continue your learning adventure?</p>
            
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{dayStreak} Day Streak</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">250 Stars</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">8 Badges</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{overallProgress.percentage}%</div>
              <div className="text-sm text-white text-opacity-80">Total Progress</div>
            </div>
            <div className="w-40 mt-2">
              <ProgressBar 
                value={overallProgress.completed} 
                max={overallProgress.total} 
                colorScheme="success" 
                size="lg" 
                childMode 
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Continue Learning Section */}
      {recommendedGames.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-bold">Continue Learning</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedGames.map(game => {
              const currentLevel = game.levels.find(l => l.id === game.progress.currentLevel);
              const progressPercentage = (game.progress.completedLevels.length / game.levels.length) * 100;
              
              return (
                <Card key={game.id} childMode elevated interactive className="overflow-hidden">
                  <div className="relative h-36">
                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="success" size="lg" childMode>{game.progress.completedLevels.length} of {game.levels.length} completed</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{game.title}</h3>
                      <Badge variant="primary" childMode>{currentLevel?.difficulty}</Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <ProgressBar 
                        value={game.progress.completedLevels.length} 
                        max={game.levels.length} 
                        childMode 
                      />
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Next Level:</span> {currentLevel?.title}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">15 mins</span>
                      </div>
                      <Button 
                        variant="primary" 
                        childMode
                        onClick={() => handlePlayGame(game.id)}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* New Games Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center mb-4">
          <Star className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold">New Adventures</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesWithProgress.map(game => (
            <Card key={game.id} childMode elevated interactive onClick={() => handlePlayGame(game.id)} className="overflow-hidden">
              <div className="relative h-36">
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {game.skills.slice(0, 2).map(skill => (
                    <Badge key={skill} variant="secondary" childMode>{skill}</Badge>
                  ))}
                </div>
                
                <Button 
                  variant="primary" 
                  childMode 
                  fullWidth
                >
                  Play Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
      
      {/* Achievements Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center mb-4">
          <Award className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold">Your Achievements</h2>
        </div>
        
        <Card childMode className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { name: 'Early Learner', icon: '🏆', unlocked: true },
              { name: 'Math Whiz', icon: '🧮', unlocked: true },
              { name: 'Word Master', icon: '📚', unlocked: true },
              { name: 'Science Explorer', icon: '🔬', unlocked: false },
              { name: 'Coding Cadet', icon: '💻', unlocked: false },
              { name: 'Perfect Score', icon: '🌟', unlocked: false },
              { name: '7-Day Streak', icon: '🔥', unlocked: false },
              { name: 'Quick Thinker', icon: '⚡', unlocked: false },
            ].map((badge, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center p-3 rounded-lg ${
                  badge.unlocked 
                    ? 'bg-primary-100' 
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className={`text-sm font-medium text-center ${
                  badge.unlocked ? 'text-primary-700' : 'text-gray-500'
                }`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ChildDashboard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Award, 
  Star, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import { mockGames } from '../../data/mockGames';
import { useAuth } from '../../hooks/useAuth';
import { Game, Level, Challenge, Child } from '../../types';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const childUser = user as Child;
  
  // Find the selected game
  const game = mockGames.find(g => g.id === gameId);
  
  // Get child's progress for this game
  const gameProgress = childUser?.progress?.[gameId || ''] || {
    completedLevels: [],
    currentLevel: 1,
    highestScore: 0
  };
  
  // States for game play
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<'selection' | 'instructions' | 'playing' | 'completed'>('selection');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  // Set initial level based on child's progress
  useEffect(() => {
    if (game && gameProgress) {
      const currentLevelId = gameProgress.currentLevel;
      const level = game.levels.find(l => l.id === currentLevelId);
      setSelectedLevel(level || null);
    }
  }, [game, gameProgress]);
  
  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertCircle className="h-16 w-16 text-error-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the game you're looking for.</p>
        <Button 
          variant="primary" 
          childMode 
          leftIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/child')}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  // Get current challenge
  const currentChallenge = selectedLevel?.challenges[currentChallengeIndex];
  
  // Select a level to play
  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setGameState('instructions');
    setCurrentChallengeIndex(0);
    setScore(0);
  };
  
  // Start playing the selected level
  const handleStartLevel = () => {
    setGameState('playing');
  };
  
  // Return to level selection
  const handleBackToLevels = () => {
    setGameState('selection');
    setSelectedLevel(null);
  };
  
  // Submit an answer
  const handleSubmitAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentChallenge?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      // Add points to score
      setScore(prev => prev + (currentChallenge?.points || 0));
    }
    
    // After 1.5 seconds, move to next question or complete
    setTimeout(() => {
      if (currentChallengeIndex < (selectedLevel?.challenges.length || 0) - 1) {
        setCurrentChallengeIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        // Level completed
        setGameState('completed');
      }
    }, 1500);
  };
  
  // Show level selection screen
  const renderLevelSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          childMode 
          leftIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/child')}
          className="mr-2"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">{game.title}</h1>
      </div>
      
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="h-48 bg-gradient-to-r from-primary-600 to-secondary-500 relative">
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{game.title}</h2>
            <p className="text-white text-opacity-90">{game.description}</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {game.skills.map(skill => (
              <Badge key={skill} variant="primary" childMode>{skill}</Badge>
            ))}
            <Badge variant="secondary" childMode>Ages {game.ageRange[0]}-{game.ageRange[1]}</Badge>
          </div>
          
          <h3 className="text-xl font-bold mb-4">Select a Level</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {game.levels.map((level) => {
              const isCompleted = gameProgress.completedLevels.includes(level.id);
              const isUnlocked = level.id <= gameProgress.currentLevel;
              
              return (
                <Card 
                  key={level.id} 
                  elevated 
                  childMode 
                  interactive={isUnlocked}
                  className={`p-5 ${!isUnlocked ? 'opacity-60' : ''}`}
                  onClick={() => isUnlocked && handleSelectLevel(level)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold">Level {level.id}</h4>
                    {isCompleted ? (
                      <div className="bg-success-100 rounded-full p-1 text-success-600">
                        <CheckCircle size={20} />
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-gray-100 rounded-full p-1 text-gray-500">
                        <XCircle size={20} />
                      </div>
                    ) : null}
                  </div>
                  
                  <h5 className="font-medium mb-1">{level.title}</h5>
                  <Badge 
                    variant={
                      level.difficulty === 'easy' ? 'success' :
                      level.difficulty === 'medium' ? 'primary' :
                      level.difficulty === 'hard' ? 'warning' :
                      'error'
                    } 
                    childMode
                    className="mb-3"
                  >
                    {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                  </Badge>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-warning-500 mr-1" />
                      <span className="text-sm font-medium">{level.pointsToPass} points to pass</span>
                    </div>
                    
                    {isUnlocked && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        childMode
                        rightIcon={<ChevronRight size={16} />}
                      >
                        Play
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  // Show level instructions before starting
  const renderLevelInstructions = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          childMode 
          leftIcon={<ArrowLeft size={20} />}
          onClick={handleBackToLevels}
          className="mr-2"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">{game.title}</h1>
      </div>
      
      <Card childMode elevated className="p-6 text-center">
        <div className="text-5xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold mb-2">Level {selectedLevel?.id}: {selectedLevel?.title}</h2>
        <Badge 
          variant={
            selectedLevel?.difficulty === 'easy' ? 'success' :
            selectedLevel?.difficulty === 'medium' ? 'primary' :
            selectedLevel?.difficulty === 'hard' ? 'warning' :
            'error'
          } 
          size="lg"
          childMode
          className="mb-6"
        >
          {selectedLevel?.difficulty.charAt(0).toUpperCase() + selectedLevel?.difficulty.slice(1)} Difficulty
        </Badge>
        
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-2">Instructions:</h3>
          <p className="text-gray-700">{selectedLevel?.instructions}</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Award className="h-5 w-5 text-warning-500" />
          <span className="font-medium">You need {selectedLevel?.pointsToPass} points to pass this level</span>
        </div>
        
        <Button 
          variant="primary" 
          size="lg" 
          childMode
          onClick={handleStartLevel}
          className="px-12"
        >
          Start Level
        </Button>
      </Card>
    </motion.div>
  );
  
  // Show gameplay screen
  const renderGameplay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            childMode 
            leftIcon={<ArrowLeft size={20} />}
            onClick={handleBackToLevels}
            className="mr-2"
          >
            Exit
          </Button>
          <h1 className="text-xl font-bold">{game.title}: Level {selectedLevel?.id}</h1>
        </div>
        
        <div className="flex items-center">
          <Star className="h-5 w-5 text-warning-500 mr-1" />
          <span className="font-bold">{score} points</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar 
          value={currentChallengeIndex + 1} 
          max={selectedLevel?.challenges.length || 1} 
          label={`Question ${currentChallengeIndex + 1} of ${selectedLevel?.challenges.length}`}
          showValue 
          size="lg" 
          childMode 
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChallengeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card childMode elevated className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{currentChallenge?.question}</h2>
              
              {currentChallenge?.options && (
                <div className="grid grid-cols-1 gap-3">
                  {currentChallenge.options.map((option) => (
                    <Button 
                      key={option} 
                      variant={
                        selectedAnswer === option 
                          ? isCorrect 
                            ? 'success' 
                            : 'error' 
                          : 'outline'
                      } 
                      childMode
                      onClick={() => !selectedAnswer && handleSubmitAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className="py-4 text-left justify-start"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Feedback on answer */}
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                  }`}
                >
                  <div className="flex items-center">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Correct! +{currentChallenge?.points} points</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">
                          Incorrect. The correct answer is: {currentChallenge?.correctAnswer}
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Hint button */}
              {currentChallenge?.hint && !selectedAnswer && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    childMode
                    leftIcon={<HelpCircle size={20} />}
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </Button>
                  
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 bg-primary-50 rounded-lg text-primary-800"
                    >
                      {currentChallenge.hint}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
  
  // Show level completion screen
  const renderLevelCompleted = () => {
    const isPassed = score >= (selectedLevel?.pointsToPass || 0);
    const maxScore = selectedLevel?.challenges.reduce((sum, challenge) => sum + challenge.points, 0) || 0;
    const scorePercentage = Math.round((score / maxScore) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card childMode elevated className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {isPassed ? '🎉' : '😢'}
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold mb-2"
          >
            {isPassed ? 'Level Completed!' : 'Try Again!'}
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                {isPassed 
                  ? 'Great job! You\'ve passed this level.' 
                  : `You need ${selectedLevel?.pointsToPass} points to pass. Try again!`}
              </p>
              <div className="text-3xl font-bold mb-2">{score} / {maxScore}</div>
              <div className="w-full max-w-xs mx-auto mb-2">
                <ProgressBar 
                  value={score} 
                  max={maxScore} 
                  showValue 
                  size="lg" 
                  colorScheme={isPassed ? 'success' : 'warning'}
                  childMode 
                />
              </div>
              <p className="text-sm text-gray-500">Score: {scorePercentage}%</p>
            </div>
            
            {isPassed && (
              <div className="bg-success-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-success-800 mb-2">Achievements</h3>
                <div className="flex justify-center space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">⭐</div>
                    <p className="text-sm font-medium">Level {selectedLevel?.id} Completed</p>
                  </div>
                  {scorePercentage >= 90 && (
                    <div className="flex flex-col items-center">
                      <div className="text-2xl mb-1">🏆</div>
                      <p className="text-sm font-medium">Excellence Award</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                variant="outline" 
                childMode 
                onClick={handleBackToLevels}
              >
                Level Selection
              </Button>
              
              {isPassed ? (
                <Button 
                  variant="primary" 
                  childMode 
                  onClick={() => {
                    // If there's a next level available, open it
                    if (game.levels.length > (selectedLevel?.id || 0)) {
                      const nextLevel = game.levels.find(l => l.id === (selectedLevel?.id || 0) + 1);
                      if (nextLevel) {
                        handleSelectLevel(nextLevel);
                      } else {
                        handleBackToLevels();
                      }
                    } else {
                      handleBackToLevels();
                    }
                  }}
                >
                  {game.levels.length > (selectedLevel?.id || 0) ? 'Next Level' : 'Finish Game'}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  childMode 
                  onClick={() => {
                    setGameState('instructions');
                    setCurrentChallengeIndex(0);
                    setScore(0);
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                  }}
                >
                  Try Again
                </Button>
              )}
            </div>
          </motion.div>
        </Card>
      </motion.div>
    );
  };
  
  // Render the appropriate screen based on game state
  return (
    <div className="pb-10">
      <AnimatePresence mode="wait">
        {gameState === 'selection' && renderLevelSelection()}
        {gameState === 'instructions' && renderLevelInstructions()}
        {gameState === 'playing' && renderGameplay()}
        {gameState === 'completed' && renderLevelCompleted()}
      </AnimatePresence>
    </div>
  );
};

export default GamePage;
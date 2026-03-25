import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 120);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-[400px] h-20 flex items-center justify-center pixel-border bg-black">
        <div className="text-3xl font-pixel text-[#00ffff] glitch-text" data-text={`SCORE:${score}`}>
          SCORE:{score}
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="absolute right-4 pixel-button"
        >
          {isPaused ? 'INIT' : 'HALT'}
        </button>
      </div>

      <div 
        className="relative bg-black border-4 border-[#ff00ff] overflow-hidden"
        style={{ 
          width: '400px', 
          height: '400px',
          boxShadow: '8px 8px 0 #00ffff'
        }}
      >
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className="absolute"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x * 100) / GRID_SIZE}%`,
              top: `${(segment.y * 100) / GRID_SIZE}%`,
              backgroundColor: i === 0 ? '#00ffff' : '#ff00ff',
              border: '1px solid black',
              zIndex: 10
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
            backgroundColor: '#ffff00',
            boxShadow: '0 0 10px #ffff00',
            zIndex: 5
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-pixel text-[#ff00ff] mb-4 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                  <p className="font-mono text-[#00ffff] mb-8 tracking-widest uppercase">Memory Corrupted: {score}</p>
                  <button onClick={resetGame} className="pixel-button scale-150">REBOOT</button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-pixel text-[#00ffff] mb-8 glitch-text" data-text="SYSTEM_IDLE">SYSTEM_IDLE</h2>
                  <button onClick={() => setIsPaused(false)} className="pixel-button scale-150">EXECUTE</button>
                  <p className="mt-8 font-mono text-[#ff00ff] text-xs animate-pulse">WAITING FOR INPUT...</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="font-mono text-[#00ffff]/60 text-xs tracking-widest text-center max-w-[300px] uppercase">
        Input: [Arrows] to steer // [Space] to toggle state
      </div>
    </div>
  );
}

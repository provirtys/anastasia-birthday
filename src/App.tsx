import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Calculator, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleOpen = () => {
    setIsOpen(true);
    
    // Initial big explosion
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Touch/pointer interaction for background sparkles
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (Math.random() > 0.8) {
      const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY };
      setParticles(prev => [...prev, newParticle].slice(-20)); // Keep max 20 particles
    }
  }, []);

  return (
    <div 
      className="relative min-h-screen bg-[#f0f4f8] text-slate-800 font-sans flex flex-col items-center justify-center overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
    >
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-1/4 right-1/4 w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {i % 2 === 0 ? <Heart color="#fbcfe8" size={32} /> : <Calculator color="#c4b5fd" size={32} />}
          </motion.div>
        ))}
      </div>

      {/* Interactive Pointer Sparkles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, x: p.x - 12, y: p.y - 12 }}
            animate={{ opacity: 0, scale: 2, y: p.y - 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute pointer-events-none text-amber-400 drop-shadow-md z-50"
          >
            <Sparkles size={24} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="z-10 text-center px-4 max-w-lg w-full">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="gift"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, rotate: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={handleOpen}
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, -5, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-xl border border-white/50 hover:bg-white/80 transition-colors relative z-10"
              >
                <Gift className="w-32 h-32 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]" />
              </motion.div>
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 text-slate-600 font-bold tracking-widest uppercase text-sm relative z-10"
              >
                Нажми, чтобы открыть
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
              className="bg-white/40 backdrop-blur-xl p-8 sm:p-12 rounded-[40px] shadow-2xl border border-white/40 relative overflow-hidden"
            >
              {/* Card decorative elements */}
              <div className="absolute -inset-24 bg-pink-200/40 blur-3xl rounded-full z-0 opacity-50" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-block px-4 py-1 bg-white/60 rounded-full text-sm font-semibold tracking-widest uppercase text-amber-700 mb-6 border border-amber-200/50">
                  Специальная доставка
                </div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent mb-4 text-center leading-tight tracking-tight"
                >
                  С Днём Рождения,<br/>Анастасия!
                </motion.h1>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-6"
                />

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="text-lg sm:text-2xl font-light italic leading-relaxed text-slate-600 text-center mb-8"
                >
                  Пусть дебет всегда сходится с кредитом, а в жизни царит идеальный баланс счастья, здоровья и любви! 
                  <br/><br/>
                  <span className="font-medium text-slate-800 block mt-2 text-xl not-italic">
                    Живи ярко, считай легко,<br/> люби много! ✨
                  </span>
                </motion.p>
                
                <div className="flex items-center justify-center w-full mt-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    onClick={() => confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#fcd34d']
                    })}
                    className="w-full max-w-[280px] h-20 sm:h-24 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-3xl border border-amber-200/50 flex flex-col items-center justify-center relative overflow-hidden transition-all transform hover:scale-105 active:scale-95 shadow-lg group"
                  >
                    <div className="text-center z-10">
                      <p className="text-sm font-bold text-amber-800">ЕЩЁ САЛЮТ</p>
                      <p className="text-xs text-amber-700/70 mt-1">Серпантин и радость</p>
                    </div>
                    <div className="absolute inset-0 flex justify-around items-start pt-2 opacity-30 group-hover:opacity-50 transition-opacity">
                      <span className="text-xl">🎉</span><span className="text-lg">✨</span><span className="text-2xl">🎉</span><span className="text-xl">✨</span><span className="text-lg">🎉</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../utils';
import { Rocket, Sparkles, TrendingUp, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CasinoCrashProps {
  balance: number;
  updateBalance: (amount: number) => void;
  triggerQuest: (questId: string, value: number) => void;
  logBet: (description: string, amount: number, payout: number, status: 'won' | 'lost', multiplier: number) => void;
}

export default function CasinoCrash({ balance, updateBalance, triggerQuest, logBet }: CasinoCrashProps) {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [gameState, setGameState] = useState<'idle' | 'betting' | 'flying' | 'crashed' | 'cashed_out'>('idle');
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [countdown, setCountdown] = useState<number>(5); // pre-game countdown
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [historicCrashes, setHistoricCrashes] = useState<number[]>([1.45, 2.10, 1.05, 12.44, 1.88, 5.40, 1.25, 3.84]);

  const animationRef = useRef<number | null>(null);
  const multiplierRef = useRef<number>(1.00);
  const startTimeRef = useRef<number>(0);

  // Generates a realistic Crash crash point
  // House edge is embedded: 10% instant crash at 1.00x, otherwise distribution favoring lower multipliers.
  const generateCrashPoint = (): number => {
    const isInstantCrash = Math.random() < 0.08; // 8% chance of immediate crash
    if (isInstantCrash) return 1.00;

    const rand = Math.random();
    // High numbers are possible but rare (exponential distribution)
    // Formula guarantees a nice smooth curve
    return Math.round((1.01 + Math.pow(rand, -1.1) * 0.06) * 100) / 100;
  };

  // Launch countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'betting') {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            launchRocket();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const placeBetAndQueue = () => {
    if (betAmount <= 0) return;
    if (betAmount > balance) {
      alert("Saldo insuficiente para esta aposta!");
      return;
    }

    updateBalance(-betAmount);
    setGameState('betting');
    setMultiplier(1.00);
    multiplierRef.current = 1.00;
  };

  const launchRocket = () => {
    const calculatedCrash = generateCrashPoint();
    setCrashPoint(calculatedCrash);
    setGameState('flying');
    startTimeRef.current = performance.now();
    
    // Start animation tick
    runAnimationTick(calculatedCrash);
  };

  const runAnimationTick = (crashVal: number) => {
    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // seconds
      
      // Multiplier increases quadratically/exponentially over time to simulate excitement
      // e.g. at 5s multiplier is ~2.0x, at 10s is ~5x, at 15s is ~15x
      const speed = 0.06;
      const currentMult = Math.pow(1 + elapsed, 1.6) * speed + 1.00;
      const roundedMult = Math.round(currentMult * 100) / 100;
      
      if (roundedMult >= crashVal) {
        // Crashed!
        setMultiplier(crashVal);
        setGameState('crashed');
        setHistoricCrashes(prev => [crashVal, ...prev.slice(0, 11)]);
        
        logBet(
          `Crash / Foguetinho - Crashed ${crashVal.toFixed(2)}x`,
          betAmount,
          0,
          'lost',
          0
        );
        triggerQuest('q4', betAmount); // progress volume
        animationRef.current = null;
      } else {
        setMultiplier(roundedMult);
        multiplierRef.current = roundedMult;
        animationRef.current = requestAnimationFrame(tick);
      }
    };
    
    animationRef.current = requestAnimationFrame(tick);
  };

  const cashOut = () => {
    if (gameState !== 'flying' || animationRef.current === null) return;
    
    // Stop rocket
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const claimMultiplier = multiplierRef.current;
    const finalPayout = Math.floor(betAmount * claimMultiplier);
    
    setWinAmount(finalPayout);
    updateBalance(finalPayout);
    setGameState('cashed_out');

    logBet(
      `Crash / Foguetinho - Cash Out ${claimMultiplier.toFixed(2)}x`,
      betAmount,
      finalPayout,
      'won',
      claimMultiplier
    );

    // Trigger quest progress
    if (claimMultiplier >= 2.50) {
      triggerQuest('q3', 1);
    }
    triggerQuest('q4', betAmount);
  };

  const resetGame = () => {
    setGameState('idle');
    setMultiplier(1.00);
    multiplierRef.current = 1.00;
  };

  // Safe cancel if unmounted
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Compute coordinate for drawing rocket canvas/SVG
  // multiplier dictates standard height / width trajectory
  const percentageFloat = Math.min((multiplier - 1) / 4, 1); // Clamp at 5x for standard visual
  const rocketX = 10 + percentageFloat * 80; // width from 10% to 90%
  const rocketY = 90 - percentageFloat * 75; // height from 90% (bottom) to 15% (top)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6" id="crash-game-container">
      
      {/* Historic Multipliers list */}
      <div className="col-span-12 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 uppercase select-none mr-2">
          <TrendingUp className="w-3 h-3" /> LISTA RECENTE:
        </span>
        {historicCrashes.map((crash, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
              crash < 1.50
                ? 'bg-slate-950 text-slate-400'
                : crash < 3.00
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
            }`}
          >
            {crash.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Control Panel */}
      <div className="md:col-span-4 flex flex-col justify-between bg-slate-950 p-4 border border-slate-800/60 rounded-xl" id="crash-controls">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4 font-sans">
            <Rocket className="w-5 h-5 text-amber-400 animate-bounce" />
            Crash (Foguetinho)
          </h2>

          {/* Bet inputs */}
          <div className="space-y-2 mb-6">
            <label className="text-xs text-slate-400 font-mono flex justify-between">
              <span>VALOR DA APOSTA</span>
              <span className="text-slate-500">Min 10 FBF</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">$</span>
              <input
                type="number"
                disabled={gameState === 'betting' || gameState === 'flying'}
                value={betAmount === 0 ? '' : betAmount}
                onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-7 pr-16 text-white font-mono focus:outline-none focus:border-amber-400 transition"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  disabled={gameState === 'betting' || gameState === 'flying'}
                  onClick={() => setBetAmount(prev => Math.floor(prev / 2))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  ½
                </button>
                <button
                  disabled={gameState === 'betting' || gameState === 'flying'}
                  onClick={() => setBetAmount(prev => prev * 2)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  2X
                </button>
                <button
                  disabled={gameState === 'betting' || gameState === 'flying'}
                  onClick={() => setBetAmount(balance)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons logic */}
        <div className="space-y-3">
          {gameState === 'idle' && (
            <button
              onClick={placeBetAndQueue}
              disabled={betAmount <= 0 || betAmount > balance}
              className="w-full py-4 text-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/10 cursor-pointer transition flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Entrar Na Próxima Partida
            </button>
          )}

          {gameState === 'betting' && (
            <div className="bg-slate-900 border border-amber-400/20 rounded-xl p-4 text-center">
              <span className="text-sm font-mono text-slate-400 block mb-1">AGUARDANDO LANÇAMENTO</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono animate-ping">
                {countdown}s
              </span>
            </div>
          )}

          {gameState === 'flying' && (
            <button
              onClick={cashOut}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition flex flex-col items-center justify-center"
            >
              <span className="text-base font-sans flex items-center gap-1.5">
                CASH OUT (SAIR)
              </span>
              <span className="text-sm font-mono opacity-90 mt-0.5">
                Pegar {formatCurrency(Math.floor(betAmount * multiplier))} ({multiplier.toFixed(2)}x)
              </span>
            </button>
          )}

          {(gameState === 'crashed' || gameState === 'cashed_out') && (
            <button
              onClick={resetGame}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition cursor-pointer"
            >
              Jogar Novamente
            </button>
          )}

          {/* Rules info */}
          <div className="bg-slate-900 border border-slate-850 rounded-lg p-3 text-xs text-slate-500 space-y-1 font-mono">
            <span>Regras Rápidas:</span>
            <p>1. Ajuste sua aposta e entre na partida.</p>
            <p>2. O multiplicador sobe progressivamente.</p>
            <p>3. Clique em Cash Out a qualquer hora.</p>
            <p>4. Se o foguete explodir antes, você perde!</p>
          </div>
        </div>
      </div>

      {/* Trajectory Canvas Screen */}
      <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between p-4 relative h-[320px] md:h-[400px] overflow-hidden" id="crash-visualizer">
        
        {/* Dynamic Display Multiplier */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-10">
          <AnimatePresence mode="wait">
            {gameState === 'flying' && (
              <motion.div
                key="flying-mult"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-7xl font-mono font-extrabold text-white tracking-tighter drop-shadow-md">
                  {multiplier.toFixed(2)}x
                </div>
                <div className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1 mt-1 font-bold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> Foguete subindo...
                </div>
              </motion.div>
            )}

            {gameState === 'crashed' && (
              <motion.div
                key="crash-mult"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1.2, 1], opacity: 1 }}
                className="text-center bg-red-950/40 border border-red-500/20 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-xl"
              >
                <span className="text-xs font-mono font-bold text-red-400 tracking-wider block uppercase mb-1">EXPLODIU EM</span>
                <span className="text-4xl md:text-5xl font-mono font-black text-red-500 tracking-tight">
                  {multiplier.toFixed(2)}x
                </span>
                <span className="text-xs font-sans text-red-300 block mt-1.5 font-semibold">Tente de novo com maior cautela!</span>
              </motion.div>
            )}

            {gameState === 'cashed_out' && (
              <motion.div
                key="cashed-mult"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center bg-emerald-950/40 border border-emerald-500/20 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-xl"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider block uppercase">SAIU DE FININHO</span>
                <span className="text-3xl md:text-4xl font-mono font-black text-emerald-300 tracking-tight">
                  +{formatCurrency(winAmount)}
                </span>
                <span className="text-[11px] font-sans text-emerald-400 block mt-1">Ganhos calculados a {multiplier.toFixed(2)}x</span>
              </motion.div>
            )}

            {gameState === 'idle' && (
              <div className="text-center space-y-1 text-slate-500">
                <Rocket className="w-12 h-12 text-slate-800 mx-auto animate-pulse" />
                <p className="text-sm font-sans tracking-wide">Pronto para a decolagem virtual?</p>
                <p className="text-[10px] font-mono text-slate-600">Ajuste os valores ao lado para lançar</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Flight Trajectory Drawing */}
        {gameState === 'flying' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" id="flight-svg">
            {/* Draw curve path */}
            <path
              d={`M 0,${350} Q ${30 + percentageFloat * 30},${350 - percentageFloat * 100} ${rocketX / 100 * 400},${rocketY / 100 * 350}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeDasharray="6,4"
              className="opacity-60"
            />
            {/* Glowing gradient line */}
            <path
              d={`M 0,${350} Q ${30 + percentageFloat * 30},${350 - percentageFloat * 100} ${rocketX / 100 * 400},${rocketY / 100 * 350}`}
              fill="none"
              stroke="url(#rocketGlow)"
              strokeWidth="8"
              className="opacity-30"
            />
            <defs>
              <linearGradient id="rocketGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* The Rocket Icon flying along coords */}
        {gameState === 'flying' && (
          <motion.div
            style={{
              position: 'absolute',
              left: `${rocketX}%`,
              top: `${rocketY}%`,
              transform: 'translate(-50%, -50%) rotate(45deg)',
            }}
            className="text-amber-400 z-10"
          >
            <div className="relative">
              <Rocket className="w-8 h-8 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              {/* Thrust sparks */}
              <span className="absolute -bottom-3.5 -left-3.5 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-75" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            </div>
          </motion.div>
        )}

        {/* Background Grid Lines to make it feel super technical */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
          {Array(36).fill(0).map((_, idx) => (
            <div key={idx} className="border-t border-l border-white h-full w-full" />
          ))}
        </div>

        {/* Informative Grid Scales */}
        <div className="flex justify-between items-end text-[9px] font-mono text-slate-600 mt-auto select-none pt-2 border-t border-slate-900/60 z-10">
          <span>0s</span>
          <span>5s (2.0x)</span>
          <span>10s (5.0x)</span>
          <span>15s (15.0x)</span>
          <span>20s+ (Foguete Infinito)</span>
        </div>
      </div>

    </div>
  );
}

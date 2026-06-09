import React, { useState } from 'react';
import { formatCurrency } from '../utils';
import { Bomb, Gem, Coins, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CasinoMinesProps {
  balance: number;
  updateBalance: (amount: number) => void;
  triggerQuest: (questId: string, value: number) => void;
  logBet: (description: string, amount: number, payout: number, status: 'won' | 'lost', multiplier: number) => void;
}

export default function CasinoMines({ balance, updateBalance, triggerQuest, logBet }: CasinoMinesProps) {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [grid, setGrid] = useState<('hidden' | 'gem' | 'mine')[]>(Array(25).fill('hidden'));
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [mineLocations, setMineLocations] = useState<number[]>([]);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');

  // Multiplier formula
  const getMultiplier = (mines: number, gemsRevealed: number): number => {
    if (gemsRevealed === 0) return 1;
    const totalSlots = 25;
    const safeSlots = totalSlots - mines;
    let prob = 1;
    for (let i = 0; i < gemsRevealed; i++) {
      prob *= (safeSlots - i) / (totalSlots - i);
    }
    const rawMultiplier = 1 / prob;
    const withHouseEdge = rawMultiplier * 0.98; // 2% House edge
    return Math.round(withHouseEdge * 100) / 100;
  };

  const currentMultiplier = getMultiplier(minesCount, revealedCount);
  const nextMultiplier = getMultiplier(minesCount, revealedCount + 1);
  const potentialPayout = Math.floor(betAmount * currentMultiplier);

  const startGame = () => {
    if (betAmount <= 0) return;
    if (betAmount > balance) {
      alert("Saldo insuficiente para esta aposta!");
      return;
    }

    updateBalance(-betAmount);
    
    // Plant mines randomly
    const mines: number[] = [];
    while (mines.length < minesCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!mines.includes(pos)) {
        mines.push(pos);
      }
    }

    const initialGrid = Array(25).fill('hidden');
    mines.forEach(pos => {
      initialGrid[pos] = 'mine';
    });
    // Set gems everywhere else (though we only reveal on click)
    for (let i = 0; i < 25; i++) {
      if (initialGrid[i] !== 'mine') {
        initialGrid[i] = 'gem';
      }
    }

    setMineLocations(mines);
    setGrid(initialGrid);
    setRevealed(Array(25).fill(false));
    setRevealedCount(0);
    setIsPlaying(true);
    setGameState('playing');
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'playing' || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (grid[index] === 'mine') {
      // Boom!
      setGameState('lost');
      setIsPlaying(false);
      logBet(
        `Mines (${minesCount} minas) - Explosão`,
        betAmount,
        0,
        'lost',
        0
      );
      triggerQuest('q4', betAmount); // progress volume
    } else {
      // Safe! Gem!
      const newCount = revealedCount + 1;
      setRevealedCount(newCount);
      
      const newMult = getMultiplier(minesCount, newCount);
      
      // Auto-win if they reveal all safe spots
      if (newCount === 25 - minesCount) {
        handleCashOut(newCount);
      }
    }
  };

  const handleCashOut = (overrideCount?: number) => {
    const finalCount = overrideCount ?? revealedCount;
    if (finalCount === 0 || gameState !== 'playing') return;

    const finalMultiplier = getMultiplier(minesCount, finalCount);
    const finalPayout = Math.floor(betAmount * finalMultiplier);

    updateBalance(finalPayout);
    setGameState('won');
    setIsPlaying(false);

    logBet(
      `Mines (${minesCount} minas) - Cash Out ${finalMultiplier}x`,
      betAmount,
      finalPayout,
      'won',
      finalMultiplier
    );

    // Quests
    if (finalMultiplier >= 2.0) {
      triggerQuest('q2', 1);
    }
    triggerQuest('q4', betAmount);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6" id="mines-game-container">
      
      {/* Settings Panel */}
      <div className="md:col-span-4 flex flex-col justify-between bg-slate-950 p-4 border border-slate-800/60 rounded-xl" id="mines-settings-panel">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4 font-sans">
            <Bomb className="w-5 h-5 text-emerald-400 animate-pulse" />
            Mines (Campo Minado)
          </h2>

          {/* Bet input */}
          <div className="space-y-2 mb-4">
            <label className="text-xs text-slate-400 font-mono flex justify-between">
              <span>VALOR DA APOSTA</span>
              <span className="text-slate-500">Min 10 FBF</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">$</span>
              <input
                type="number"
                disabled={isPlaying}
                value={betAmount === 0 ? '' : betAmount}
                onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-7 pr-16 text-white font-mono focus:outline-none focus:border-emerald-500 transition"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  disabled={isPlaying}
                  onClick={() => setBetAmount(prev => Math.floor(prev / 2))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  ½
                </button>
                <button
                  disabled={isPlaying}
                  onClick={() => setBetAmount(prev => prev * 2)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  2X
                </button>
                <button
                  disabled={isPlaying}
                  onClick={() => setBetAmount(balance)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Mines Counter */}
          <div className="space-y-2 mb-6">
            <label className="text-xs text-slate-400 font-mono flex justify-between">
              <span>NÚMERO DE MINAS</span>
              <span className="text-emerald-400 font-bold">{minesCount}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[3, 5, 10, 24].map((num) => (
                <button
                  key={num}
                  disabled={isPlaying}
                  onClick={() => setMinesCount(num)}
                  className={`py-1.5 font-mono text-sm rounded transition ${
                    minesCount === num
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            
            {/* Range input for customization */}
            <input
              type="range"
              min="1"
              max="24"
              disabled={isPlaying}
              value={minesCount}
              onChange={(e) => setMinesCount(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-1.5 mt-2"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="space-y-3 mt-4">
          {gameState === 'playing' ? (
            <button
              onClick={() => handleCashOut()}
              disabled={revealedCount === 0}
              className={`w-full py-3 px-4 rounded-xl font-bold font-sans flex items-center justify-center gap-2 transition cursor-pointer ${
                revealedCount > 0
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Coins className="w-5 h-5" />
              Retirar {formatCurrency(potentialPayout)}
            </button>
          ) : (
            <button
              onClick={startGame}
              disabled={betAmount <= 0 || betAmount > balance}
              className="w-full py-3 px-4 bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold font-sans flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Bomb className="w-5 h-5" />
              Começar Jogo
            </button>
          )}

          {/* Current Bet Info */}
          {gameState !== 'idle' && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Multiplicador Atual:</span>
                <span className="text-emerald-400 font-bold">{currentMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span>Próximo Multiplicador:</span>
                <span className="text-slate-300">{nextMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span>Gemas Encontradas:</span>
                <span className="text-amber-400 font-bold">{revealedCount} / {25 - minesCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="md:col-span-8 flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-xl p-4 md:p-6" id="mines-grid-canvas">
        {/* Game State Overlay Banner */}
        <AnimatePresence mode="wait">
          {gameState === 'won' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mb-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-center text-sm font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Vitória! Ganhou {formatCurrency(potentialPayout)} ({currentMultiplier}x)
            </motion.div>
          )}
          {gameState === 'lost' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mb-4 bg-red-950/80 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl text-center text-sm font-semibold flex items-center gap-2"
            >
              <ShieldAlert className="w-5 h-5 text-red-400" />
              BUM! Você clicou em uma mina e perdeu {formatCurrency(betAmount)}.
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5x5 Mines Grid */}
        <div className="grid grid-cols-5 gap-2 w-full max-w-[320px] md:max-w-[380px] aspect-square">
          {Array(25).fill(0).map((_, idx) => {
            const isRevealed = revealed[idx] || eventIsOver();
            const contents = grid[idx];
            const isMine = contents === 'mine';

            function eventIsOver() {
              return gameState === 'won' || gameState === 'lost';
            }

            return (
              <button
                key={idx}
                id={`mines-cell-${idx}`}
                disabled={gameState !== 'playing' || revealed[idx]}
                onClick={() => handleCellClick(idx)}
                className={`w-full h-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none border select-none cursor-pointer ${
                  isRevealed
                    ? isMine
                      ? 'bg-red-500 border-red-400 text-stone-900 shadow-md shadow-red-500/40 transform scale-95'
                      : 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 transform scale-95'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-500 hover:bg-slate-750 active:bg-slate-900'
                }`}
              >
                {isRevealed ? (
                  isMine ? (
                    <Bomb className="w-6 h-6 animate-bounce" />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Gem className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                  )
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600/60 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Play guide */}
        <p className="mt-4 text-[11px] text-slate-500 font-mono text-center">
          Cada gema revelada aumenta o multiplicador. Saia antes de explodir para pegar o dinheiro virtual!
        </p>
      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../utils';
import { Sparkles, History, RotateCw, Target, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CasinoDoubleProps {
  balance: number;
  updateBalance: (amount: number) => void;
  triggerQuest: (questId: string, value: number) => void;
  logBet: (description: string, amount: number, payout: number, status: 'won' | 'lost', multiplier: number) => void;
}

type SelectedColor = 'red' | 'black' | 'white';

interface HistoryResult {
  number: number;
  color: SelectedColor;
}

export default function CasinoDouble({ balance, updateBalance, triggerQuest, logBet }: CasinoDoubleProps) {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>('red');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rollPosition, setRollPosition] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(10);
  const [lobbyState, setLobbyState] = useState<'betting' | 'spinning' | 'show_result'>('betting');
  const [spinHistory, setSpinHistory] = useState<HistoryResult[]>([
    { number: 4, color: 'black' },
    { number: 7, color: 'red' },
    { number: 0, color: 'white' },
    { number: 11, color: 'black' },
    { number: 3, color: 'red' },
    { number: 14, color: 'black' },
    { number: 1, color: 'red' },
  ]);
  const [latestResult, setLatestResult] = useState<HistoryResult | null>(null);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  // Full double color strip (15 slots)
  // 0: White (Green), 1-7: Red, 8-14: Black
  const COLOR_STRIP: HistoryResult[] = [
    { number: 0, color: 'white' },
    { number: 11, color: 'black' },
    { number: 5, color: 'red' },
    { number: 10, color: 'black' },
    { number: 6, color: 'red' },
    { number: 9, color: 'black' },
    { number: 7, color: 'red' },
    { number: 8, color: 'black' },
    { number: 1, color: 'red' },
    { number: 14, color: 'black' },
    { number: 2, color: 'red' },
    { number: 13, color: 'black' },
    { number: 3, color: 'red' },
    { number: 12, color: 'black' },
    { number: 4, color: 'red' },
  ];

  // Lobby Timer (Automatically spins every 12 seconds to feel like a real real-time betting platform)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lobbyState === 'betting') {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            triggerSpin();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lobbyState]);

  const triggerSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setLobbyState('spinning');
    setLocalFeedback(null);

    // Pick winning index random
    const winningIndex = Math.floor(Math.random() * COLOR_STRIP.length);
    const winningResult = COLOR_STRIP[winningIndex];

    // Simulate animated scrolling roll offset:
    // We scroll e.g. 3 full rotations + offset
    const slotWidth = 80; // pixels
    const totalSlots = COLOR_STRIP.length;
    const offset = winningIndex * slotWidth;
    const fullRotations = totalSlots * slotWidth * 4; // 4 rotations
    const targetScroll = fullRotations + offset;

    setRollPosition(targetScroll);

    // After animation complete (~4 seconds)
    setTimeout(() => {
      resolveSpinResult(winningResult);
    }, 4000);
  };

  const resolveSpinResult = (res: HistoryResult) => {
    setIsSpinning(false);
    setLatestResult(res);
    setSpinHistory(prev => [res, ...prev.slice(0, 11)]);
    setLobbyState('show_result');

    // Did user place a bet in this round?
    // In our simplified lobby, the user places their bet on selectedColor immediately.
    // If they have placed a bet, we resolve it.
    const hasWon = selectedColor === res.color;
    let multiplier = 2;
    if (res.color === 'white') multiplier = 14;

    const payout = hasWon ? Math.floor(betAmount * multiplier) : 0;
    
    if (hasWon) {
      updateBalance(payout);
      setLocalFeedback(`GANHOU! A cor caiu em ${res.color === 'red' ? 'Vermelho' : res.color === 'black' ? 'Preto' : 'Branco'}. Ganhou ${formatCurrency(payout)}!`);
      logBet(
        `Double - Aposta no ${selectedColor === 'red' ? 'Vermelho' : selectedColor === 'black' ? 'Preto' : 'Branco'} (${multiplier}x)`,
        betAmount,
        payout,
        'won',
        multiplier
      );
    } else {
      setLocalFeedback(`Perdeu! Caiu em ${res.color === 'red' ? 'Vermelho' : res.color === 'black' ? 'Preto' : 'Branco'}.`);
      logBet(
        `Double - Aposta no ${selectedColor === 'red' ? 'Vermelho' : selectedColor === 'black' ? 'Preto' : 'Branco'} (${multiplier}x)`,
        betAmount,
        0,
        'lost',
        0
      );
    }

    triggerQuest('q4', betAmount);

    // Reset lobby back to betting after 4 seconds of showing result
    setTimeout(() => {
      setLobbyState('betting');
      setLatestResult(null);
      setLocalFeedback(null);
      setRollPosition(0);
    }, 4000);
  };

  const manualConfirmBet = () => {
    if (isSpinning || lobbyState !== 'betting') return;
    if (betAmount <= 0) {
      alert("Aposta inválida!");
      return;
    }
    if (betAmount > balance) {
      alert("Saldo insuficiente!");
      return;
    }

    updateBalance(-betAmount);
    setLobbyState('betting'); // Confirms bet
    triggerSpin(); // Speed it up instantly on clicking place bet to improve engagement!
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6" id="double-game-container">
      
      {/* Horizontal Strip Spinner */}
      <div className="col-span-12 flex flex-col items-center bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden" id="double-strip-spinner">
        
        {/* Needle Line Center Pointer */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-amber-400 z-20 shadow-md shadow-amber-400/50" />

        {/* Roller visual container */}
        <div className="w-[320px] md:w-[600px] h-20 overflow-hidden relative border border-slate-800 bg-slate-900/60 rounded-xl flex items-center">
          <motion.div
            animate={{ x: -rollPosition }}
            transition={isSpinning ? { duration: 4, ease: [0.1, 0.8, 0.25, 1] } : { duration: 0 }}
            className="flex gap-1 pl-[120px] md:pl-[260px]"
            style={{ width: 'max-content' }}
          >
            {/* Multiply strip to simulate infinite scrolling */}
            {[0, 1, 2, 3, 4, 5].map((cycleIdx) => (
              <React.Fragment key={cycleIdx}>
                {COLOR_STRIP.map((slot, idx) => (
                  <div
                    key={`${cycleIdx}-${idx}`}
                    className={`w-16 h-14 rounded-lg flex flex-col items-center justify-center font-mono font-extrabold select-none ${
                      slot.color === 'red'
                        ? 'bg-rose-600 border border-rose-500 text-white'
                        : slot.color === 'black'
                        ? 'bg-slate-950 border border-slate-800 text-white'
                        : 'bg-emerald-500 border border-emerald-400 text-slate-950'
                    }`}
                  >
                    <span className="text-sm">{slot.number}</span>
                    <span className="text-[8px] tracking-widest opacity-80 uppercase font-sans">
                      {slot.color === 'white' ? 'Green' : slot.color === 'red' ? 'Red' : 'Black'}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Central target selector description */}
        <div className="mt-4 flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <Target className="w-3.5 h-3.5 text-amber-500" /> A roleta girará e o quadrado que parar na linha central será o vencedor.
        </div>
      </div>

      {/* Bets Selection and amount */}
      <div className="md:col-span-5 bg-slate-950 p-4 border border-slate-800/60 rounded-xl flex flex-col justify-between" id="double-betting-controls">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <RotateCw className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            Double Virtuais
          </h2>

          {/* Bet inputs */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-mono flex justify-between">
              <span>VALOR DO GIRO</span>
              <span className="text-slate-500">Min 10 FBF</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">$</span>
              <input
                type="number"
                disabled={isSpinning || lobbyState !== 'betting'}
                value={betAmount === 0 ? '' : betAmount}
                onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-7 pr-16 text-white font-mono focus:outline-none focus:border-rose-500 transition"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  disabled={isSpinning || lobbyState !== 'betting'}
                  onClick={() => setBetAmount(prev => Math.floor(prev / 2))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  ½
                </button>
                <button
                  disabled={isSpinning || lobbyState !== 'betting'}
                  onClick={() => setBetAmount(prev => prev * 2)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  2X
                </button>
              </div>
            </div>
          </div>

          {/* Color buttons selects */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-mono block">ESCOLHA UMA COR (PREVISÃO)</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={isSpinning || lobbyState !== 'betting'}
                onClick={() => setSelectedColor('red')}
                className={`py-2 rounded-lg font-sans font-bold text-xs flex flex-col items-center justify-center gap-1 transition ${
                  selectedColor === 'red'
                    ? 'ring-2 ring-rose-500 bg-rose-700 text-white'
                    : 'bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 border border-rose-900/60'
                }`}
              >
                <span>VERMELHO</span>
                <span className="font-mono text-[9px] py-0.5 px-1 bg-black/30 rounded font-normal text-rose-300">2x Retorno</span>
              </button>

              <button
                disabled={isSpinning || lobbyState !== 'betting'}
                onClick={() => setSelectedColor('black')}
                className={`py-2 rounded-lg font-sans font-bold text-xs flex flex-col items-center justify-center gap-1 transition ${
                  selectedColor === 'black'
                    ? 'ring-2 ring-slate-400 bg-slate-800 text-white'
                    : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                <span>PRETO</span>
                <span className="font-mono text-[9px] py-0.5 px-1 bg-black/30 rounded font-normal text-slate-400">2x Retorno</span>
              </button>

              <button
                disabled={isSpinning || lobbyState !== 'betting'}
                onClick={() => setSelectedColor('white')}
                className={`py-2 rounded-lg font-sans font-bold text-xs flex flex-col items-center justify-center gap-1 transition ${
                  selectedColor === 'white'
                    ? 'ring-2 ring-emerald-400 bg-emerald-800 text-slate-950'
                    : 'bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-300 border border-emerald-900/40'
                }`}
              >
                <span>BRANCO</span>
                <span className="font-mono text-[9px] py-0.5 px-1 bg-black/30 rounded font-normal text-emerald-400">14x Retorno</span>
              </button>
            </div>
          </div>
        </div>

        {/* Start trigger */}
        <div className="mt-6 space-y-2">
          {lobbyState === 'betting' ? (
            <button
              onClick={manualConfirmBet}
              disabled={betAmount <= 0 || betAmount > balance}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Confirmar e Girar agora!
            </button>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-3.5 px-4 text-center">
              <span className="text-xs font-mono text-slate-400 block tracking-tight">ROLETA EM MOVIMENTO</span>
              <span className="text-sm font-semibold text-amber-400 animate-pulse font-mono block mt-0.5">Sorteando cor ganhadora...</span>
            </div>
          )}

          {/* Real-time interactive ticker indicators */}
          {lobbyState === 'betting' && (
            <div className="text-center text-[10px] font-mono text-slate-500">
              Próximo giro automático em <span className="text-emerald-400 font-bold">{countdown} segundos</span>
            </div>
          )}
        </div>
      </div>

      {/* Results and History feeds */}
      <div className="md:col-span-7 bg-slate-950 p-4 border border-slate-800/60 rounded-xl flex flex-col justify-between" id="double-results-feeds">
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
            <History className="w-3.5 h-3.5 text-slate-500" /> HISTÓRICO DE PEDRAS (ÚLTIMOS 12 GIROS)
          </span>

          {/* Simple historical grid results */}
          <div className="grid grid-cols-6 gap-2">
            {spinHistory.map((hist, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg flex flex-col items-center justify-center border font-mono font-extrabold text-sm ${
                  hist.color === 'red'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : hist.color === 'black'
                    ? 'bg-slate-900 border-slate-800 text-slate-300'
                    : 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                }`}
              >
                <span>{hist.number}</span>
                <span className="text-[7px] text-slate-500 font-sans tracking-tight block uppercase">
                  {hist.color === 'white' ? 'BR' : hist.color === 'red' ? 'VM' : 'PR'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback display */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {localFeedback ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  localFeedback.includes('GANHOU')
                    ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/80 border-red-500/30 text-red-300'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span>{localFeedback}</span>
              </motion.div>
            ) : (
              <div className="p-3.5 rounded-xl border border-dashed border-slate-800 text-center text-xs font-mono text-slate-600">
                Sem jogadas confirmadas no momento. Escolha uma cor e clique em Confirmar!
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

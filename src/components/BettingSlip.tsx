import React, { useState } from 'react';
import { SportBetSelection } from '../types';
import { formatCurrency } from '../utils';
import { Ticket, X, Play, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BettingSlipProps {
  selections: SportBetSelection[];
  balance: number;
  onRemoveSelection: (matchId: string) => void;
  onClearAll: () => void;
  onPlaceBet: (stake: number, totalOdd: number) => void;
}

export default function BettingSlip({ selections, balance, onRemoveSelection, onClearAll, onPlaceBet }: BettingSlipProps) {
  const [stake, setStake] = useState<number>(100);

  // Combine odds if multiple bets are selected (Múltipla / Parley)
  const totalOdd = selections.reduce((acc, curr) => acc * curr.odd, 1);
  const potentialPayout = Math.floor(stake * totalOdd);

  const handleSubmit = () => {
    if (selections.length === 0) return;
    if (stake <= 0) {
      alert("Defina um valor de aposta válido!");
      return;
    }
    if (stake > balance) {
      alert("Saldo de fichas insuficiente!");
      return;
    }

    onPlaceBet(stake, totalOdd);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col justify-between" id="betting-slip-container">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 select-none">
          <span className="font-sans font-bold text-base text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-400 rotate-12" />
            Meus bilhetes
            {selections.length > 0 && (
              <span className="h-5 px-1.5 bg-emerald-500 rounded-full font-mono text-[10px] font-extrabold text-slate-950 flex items-center justify-center animate-pulse">
                {selections.length}
              </span>
            )}
          </span>
          {selections.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[10px] uppercase font-mono text-slate-500 hover:text-rose-400 transition"
            >
              Limpar Tudo
            </button>
          )}
        </div>

        {/* Selected listings */}
        <AnimatePresence mode="popLayout">
          {selections.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 px-4 text-center space-y-2 border border-dashed border-slate-850 rounded-xl"
            >
              <Ticket className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs font-mono text-slate-500">Selecione cotações nas partidas disponíveis para apostar.</p>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1" id="coupon-selected-items">
              {selections.map((item) => (
                <motion.div
                  key={item.matchId}
                  layout
                  initial={{ transform: 'scale(0.95)', opacity: 0 }}
                  animate={{ transform: 'scale(1)', opacity: 1 }}
                  exit={{ transform: 'scale(0.95)', opacity: 0 }}
                  className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl relative hover:border-slate-750 transition"
                >
                  <button
                    onClick={() => onRemoveSelection(item.matchId)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] font-mono text-slate-500 truncate mr-5">
                    {item.matchTitle}
                  </p>
                  <div className="flex justify-between items-baseline mt-1 pr-4">
                    <span className="text-xs font-semibold text-slate-200">
                      Vencedor: <span className="text-emerald-400">{item.teamName}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {item.odd.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Inputs controls */}
      {selections.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-850 space-y-4">
          
          {/* Parley Multiplier notification indicator */}
          {selections.length > 1 && (
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Múltiplas combinadas! Odds multiplicadas de forma incrível.</span>
            </div>
          )}

          {/* Stake Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-mono flex justify-between">
              <span>VALOR DO PALPITE</span>
              <span>Livre de Perdas Reais</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">$</span>
              <input
                type="number"
                value={stake === 0 ? '' : stake}
                onChange={(e) => setStake(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-7 pr-16 text-white font-mono focus:outline-none focus:border-emerald-500 transition"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={() => setStake(prev => Math.floor(prev / 2))}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  ½
                </button>
                <button
                  onClick={() => setStake(prev => prev * 2)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 rounded transition"
                >
                  2X
                </button>
              </div>
            </div>
          </div>

          {/* Calculations board */}
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Cotação Combinada:</span>
              <span className="text-amber-400 font-bold">{totalOdd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Custos do Cupom:</span>
              <span className="text-slate-300">{formatCurrency(stake)}</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-slate-900 pt-1.5 mt-1.5">
              <span>Retorno Máximo Esperado:</span>
              <span className="text-emerald-400 text-sm font-black">{formatCurrency(potentialPayout)}</span>
            </div>
          </div>

          {/* Submit btn */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer transition flex items-center justify-center gap-1.5 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Efetuar Aposta Esportiva
          </button>

          {/* Security alert */}
          <p className="text-[9px] text-slate-500 font-mono text-center flex items-center justify-center gap-1 select-none">
            <AlertCircle className="w-3 h-3 text-slate-600 shrink-0" /> Sem Riscos: Apenas diversão e apostas fictícias.
          </p>
        </div>
      )}

    </div>
  );
}

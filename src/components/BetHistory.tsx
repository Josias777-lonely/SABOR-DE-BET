import React, { useState } from 'react';
import { PlacedBet } from '../types';
import { formatCurrency } from '../utils';
import { History, Calendar, CheckCircle2, ShieldAlert, Clock, RefreshCcw } from 'lucide-react';

interface BetHistoryProps {
  history: PlacedBet[];
}

type BetFilter = 'todos' | 'sports' | 'mines' | 'crash' | 'double';

export default function BetHistory({ history }: BetHistoryProps) {
  const [filter, setFilter] = useState<BetFilter>('todos');

  const filteredHistory = history.filter(bet => {
    if (filter === 'todos') return true;
    return bet.type === filter;
  });

  const getGameBadgeColor = (type: string) => {
    switch (type) {
      case 'sports': return 'bg-indigo-950/60 text-indigo-400 border-indigo-900';
      case 'mines': return 'bg-emerald-950/60 text-emerald-400 border-emerald-900';
      case 'crash': return 'bg-amber-950/60 text-amber-400 border-amber-900';
      case 'double': return 'bg-rose-950/60 text-rose-400 border-rose-900';
      default: return 'bg-slate-900 text-slate-400';
    }
  };

  const getGameLabel = (type: string) => {
    switch (type) {
      case 'sports': return 'Esportes';
      case 'mines': return 'Mines';
      case 'crash': return 'Crash';
      case 'double': return 'Double';
      default: return type;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl mx-auto w-full space-y-4 font-sans" id="history-panel-container">
      
      {/* Header and Filter triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <History className="w-5.5 h-5.5 text-emerald-400" />
            Histórico de Apostas Virtuais
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Acompanhe todas as suas jogadas e o retorno das suas simulações.</p>
        </div>

        {/* Filter Slider Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
          {(['todos', 'sports', 'mines', 'crash', 'double'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg border transition cursor-pointer shrink-0 ${
                filter === f
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'todos' ? 'Todos' : getGameLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* History table list */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1" id="history-record-scroller">
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 font-mono text-sm">
            Nenhuma aposta cadastrada com estes filtros no momento.
          </div>
        ) : (
          filteredHistory.map((bet) => (
            <div
              key={bet.id}
              className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-slate-800 transition"
            >
              
              {/* Game, type & timestamps */}
              <div className="space-y-1.5 flex-1 min-w-[180px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase shrink-0 ${getGameBadgeColor(bet.type)}`}>
                    {getGameLabel(bet.type)}
                  </span>
                  
                  {/* Status pills logic */}
                  {bet.status === 'won' && (
                    <span className="bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GANHA
                    </span>
                  )}
                  {bet.status === 'lost' && (
                    <span className="bg-red-950/80 border border-red-500/20 text-red-500 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                      <ShieldAlert className="w-3 h-3 text-red-500" /> PERDIDA
                    </span>
                  )}
                  {bet.status === 'pending' && (
                    <span className="bg-amber-950/80 border border-amber-500/20 text-amber-400 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-amber-400 animate-pulse" /> AGUARDANDO FIM DO JOGO
                    </span>
                  )}
                </div>

                <div className="text-xs font-medium text-slate-200">
                  {bet.description}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Calendar className="w-3 h-3 text-slate-600" /> {new Date(bet.timestamp).toLocaleTimeString('pt-BR')} do dia {new Date(bet.timestamp).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Financial calculations */}
              <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t border-slate-900 sm:border-0">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block sm:text-right uppercase select-none">VALOR INVESTIDO</span>
                  <span className="text-xs font-mono font-bold text-slate-300 block sm:text-right">
                    {formatCurrency(bet.amount)}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block sm:text-right uppercase select-none">RETORNO OBTIDO</span>
                  <span className={`text-sm font-mono font-black block sm:text-right ${
                    bet.status === 'won'
                      ? 'text-emerald-400'
                      : bet.status === 'lost'
                      ? 'text-red-500'
                      : 'text-amber-400'
                  }`}>
                    {bet.status === 'won' ? `+${formatCurrency(bet.potentialPayout)}` : bet.status === 'lost' ? `-${formatCurrency(bet.amount)}` : 'Aguardando...'}
                  </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

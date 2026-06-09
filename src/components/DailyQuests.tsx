import React from 'react';
import { DailyQuest } from '../types';
import { formatCurrency } from '../utils';
import { Award, CheckCircle, Sparkles, Gift } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyQuestsProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string, reward: number) => void;
}

export default function DailyQuests({ quests, onClaimQuest }: DailyQuestsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl mx-auto w-full space-y-4" id="daily-quests-container">
      
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-slate-850 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-amber-400" />
            Desafios Diários (Missões)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Cumpra os objetivos de diversão nas apostas para obter mais fichas gratuitas.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Bônus Diário
        </div>
      </div>

      {/* Quests Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="quests-layout-grid">
        {quests.map((quest) => {
          const isDone = quest.progress >= quest.target;
          const percentage = Math.min(100, Math.floor((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 relative overflow-hidden transition ${
                quest.claimed
                  ? 'bg-slate-950/25 border-slate-900 opacity-60'
                  : isDone
                  ? 'bg-slate-950 border-amber-500/30'
                  : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
              }`}
            >
              
              {/* Upper section summary */}
              <div>
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h3 className="text-sm font-sans font-bold text-slate-200">
                    {quest.title}
                  </h3>
                  
                  {/* Reward indicator badge */}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-400 text-slate-950 flex items-center gap-0.5">
                    +{quest.reward} FBF
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {quest.description}
                </p>
              </div>

              {/* Lower section progress metrics + claims */}
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center text-[10px] font-mono select-none">
                  <span className="text-slate-500">PROGRESSO</span>
                  <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {quest.progress} / {quest.target} ({percentage}%)
                  </span>
                </div>

                {/* Progress bar fill graph */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full transition-all duration-300 ${
                      isDone ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                  />
                </div>

                {/* Actions button */}
                <div className="pt-2">
                  {quest.claimed ? (
                    <button
                      disabled
                      className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-600 font-mono text-[11px] uppercase flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Recompensa Resgatada
                    </button>
                  ) : isDone ? (
                    <button
                      onClick={() => onClaimQuest(quest.id, quest.reward)}
                      className="w-full py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] uppercase flex items-center justify-center gap-1 shadow-lg shadow-amber-400/10 cursor-pointer animate-pulse"
                    >
                      <Gift className="w-3.5 h-3.5 fill-current" /> Resgatar Recompensa
                    </button>
                  ) : (
                    <div className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-500 font-mono text-[11px] uppercase text-center">
                      Em Execução...
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

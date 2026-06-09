import React from 'react';
import { LeaderboardUser } from '../types';
import { formatCurrency } from '../utils';
import { TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  currentUsername: string;
  userBalance: number;
  registeredUsers: { username: string; phone: string; email: string; password: string; balance?: number }[];
}

export default function Leaderboard({ currentUsername, userBalance, registeredUsers }: LeaderboardProps) {
  
  // Mix in the registered users dynamically and sort to assign ranks based on their real coins balance!
  const combinedList: LeaderboardUser[] = registeredUsers.map(usr => {
    const isMe = usr.username.toLowerCase() === currentUsername.toLowerCase();
    const balanceValue = isMe ? userBalance : (usr.balance ?? 200);
    
    // Custom logic to assign elegant badges based on their balance size
    let badge = "⭐ Novato";
    if (balanceValue >= 10000) {
      badge = "👑 Lenda";
    } else if (balanceValue >= 5000) {
      badge = "🔥 Mito";
    } else if (balanceValue >= 2000) {
      badge = "⚡ Pro";
    } else if (balanceValue >= 500) {
      badge = "🚀 High-Roller";
    } else if (balanceValue >= 250) {
      badge = "⚔️ Veterano";
    }

    return {
      rank: 0, // Assigned after sorting below
      username: isMe ? `${usr.username} (Você)` : usr.username,
      balance: balanceValue,
      winRate: isMe ? 58 : Math.floor(45 + (usr.username.charCodeAt(0) % 21)), // deterministic realistic winrate
      badge,
      isCurrentUser: isMe
    };
  });

  // Sort descending by balance
  const sortedList = combinedList
    .sort((a, b) => b.balance - a.balance)
    .map((usr, index) => ({
      ...usr,
      rank: index + 1
    }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl w-full space-y-4 animate-fade-in" id="leaderboard-ranking-panel">
      
      {/* Header title */}
      <div className="flex justify-between items-center border-b border-slate-850 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">
            Ranking
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Dispute com apostadores virtuais o topo do império livre de perdas.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
          Atualizado em Tempo Real
        </div>
      </div>

      {/* Leaderboard rows with medal indicators */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1" id="leaderboard-scrollable-content">
        {sortedList.map((user) => {
          const isMe = user.isCurrentUser;
          const isTop3 = user.rank <= 3;
          
          return (
            <div
              key={user.username}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                isMe
                  ? 'bg-slate-950 border-emerald-500/35 ring-1 ring-emerald-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/60'
              }`}
            >
              
              {/* Rank and User Name columns */}
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                  user.rank === 1
                    ? 'bg-amber-400 text-slate-950 text-sm'
                    : user.rank === 2
                    ? 'bg-slate-300 text-slate-950'
                    : user.rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-900 border border-slate-850 text-slate-400'
                }`}>
                  {user.rank}
                </span>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-sans font-semibold tracking-wide ${isMe ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                      {user.username}
                    </span>
                    {user.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-medium font-mono text-slate-400 border border-slate-800 shrink-0">
                        {user.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> Win Rate: {user.winRate}% e crescendo
                  </div>
                </div>
              </div>

              {/* Fictitious balance value right column */}
              <div className="text-right">
                <span className={`text-sm font-mono font-extrabold ${isMe ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {formatCurrency(user.balance)}
                </span>
                <span className="text-[9px] text-slate-500 font-mono block">Chips Fictícias</span>
              </div>

            </div>
          );
        })}
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-center text-[10px] font-mono text-slate-500">
        📌 Dica: Consiga altos multiplicadores no Crash, Mines ou faça palpites esportivos múltiplos para subir de posição!
      </div>

    </div>
  );
}

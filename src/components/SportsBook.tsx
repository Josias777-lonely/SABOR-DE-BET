import React, { useState, useEffect } from 'react';
import { SportsMatch, SportBetSelection } from '../types';
import { formatCurrency } from '../utils';
import { Tv, Trophy, Calendar, Sparkles, Goal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SportsBookProps {
  matches: SportsMatch[];
  setMatches: React.Dispatch<React.SetStateAction<SportsMatch[]>>;
  activeSelections: SportBetSelection[];
  onToggleSelection: (selection: SportBetSelection) => void;
}

export default function SportsBook({ matches, setMatches, activeSelections, onToggleSelection }: SportsBookProps) {
  const [activeTab, setActiveTab] = useState<'todos' | 'futebol' | 'basquete' | 'esports'>('todos');
  const [tickerAnnouncements, setTickerAnnouncements] = useState<{ id: string; text: string }[]>([]);
  const prevMatchesRef = React.useRef<SportsMatch[]>(matches);

  // Monitor score updates to trigger goal tickers safely
  useEffect(() => {
    matches.forEach(match => {
      const prevMatch = prevMatchesRef.current.find(m => m.id === match.id);
      if (prevMatch) {
        let msg = '';
        if (match.homeScore > prevMatch.homeScore) {
          msg = `⚽ GOL do ${match.homeTeam}! (${match.homeScore} - ${match.awayScore})`;
        } else if (match.awayScore > prevMatch.awayScore) {
          msg = `⚽ GOL do ${match.awayTeam}! (${match.homeScore} - ${match.awayScore})`;
        }

        if (msg) {
          const announceId = Math.random().toString();
          setTickerAnnouncements(prev => [...prev, { id: announceId, text: msg }]);
          setTimeout(() => {
            setTickerAnnouncements(prev => prev.filter(p => p.id !== announceId));
          }, 3500);
        }
      }
    });
    prevMatchesRef.current = matches;
  }, [matches]);

  // Simulation loop: Every 4 seconds, ticking live matches
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches => {
        return prevMatches.map(match => {
          if (match.status !== 'live') {
            // Randomly start some upcoming matches with the timer tick
            if (match.status === 'upcoming' && Math.random() < 0.15) {
              return {
                ...match,
                status: 'live',
                timeRemaining: match.sport === 'futebol' ? 45 : match.sport === 'basquete' ? 180 : 120
              };
            }
            return match;
          }

          // It's live! Tick down time
          const nextTime = Math.max(0, match.timeRemaining - 1);
          let nextScoreHome = match.homeScore;
          let nextScoreAway = match.awayScore;

          // Random goals/scores distribution
          if (nextTime > 0 && Math.random() < 0.08) {
            const isHomeGoal = Math.random() < 0.55;
            if (isHomeGoal) {
              nextScoreHome += match.sport === 'basquete' ? Math.floor(Math.random() * 3) + 2 : 1;
            } else {
              nextScoreAway += match.sport === 'basquete' ? Math.floor(Math.random() * 3) + 2 : 1;
            }
          }

          return {
            ...match,
            timeRemaining: nextTime,
            homeScore: nextScoreHome,
            awayScore: nextScoreAway,
            status: nextTime === 0 ? 'finished' : 'live'
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [setMatches]);

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'todos') return true;
    return match.sport === activeTab;
  });

  const getSportLabel = (sport: string) => {
    switch (sport) {
      case 'futebol': return 'Fut';
      case 'basquete': return 'Basq';
      case 'esports': return 'eSport';
      default: return sport;
    }
  };

  const isSelected = (matchId: string, type: 'home' | 'draw' | 'away'): boolean => {
    return activeSelections.some(sel => sel.matchId === matchId && sel.type === type);
  };

  const handleOddClick = (match: SportsMatch, type: 'home' | 'draw' | 'away') => {
    if (match.status === 'finished') return;

    let odd = match.odds.home;
    let teamName = match.homeTeam;
    
    if (type === 'draw') {
      odd = match.odds.draw;
      teamName = 'Empate';
    } else if (type === 'away') {
      odd = match.odds.away;
      teamName = match.awayTeam;
    }

    const selection: SportBetSelection = {
      matchId: match.id,
      matchTitle: `${match.homeTeam} x ${match.awayTeam}`,
      type,
      teamName,
      odd
    };

    onToggleSelection(selection);
  };

  return (
    <div className="space-y-6" id="sportsbook-container">
      
      {/* Category selector slider tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 h-12 overflow-x-auto scrollbar-none" id="sportsbook-tabs">
        {(['todos', 'futebol', 'basquete', 'esports'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'todos' && <Trophy className="w-3.5 h-3.5" />}
            {tab === 'futebol' && <Goal className="w-3.5 h-3.5" />}
            {tab === 'basquete' && <Activity className="w-3.5 h-3.5" />}
            {tab === 'esports' && <Tv className="w-3.5 h-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* HORIZONTAL AD AREA FOR ADSENSE (Pushes down this section of the content feed) */}
      <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 relative overflow-hidden group select-none shadow-xl" id="adsense-horizontal-sports-top">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent pointer-events-none group-hover:from-yellow-500/8 transition duration-500" />
        
        <div className="flex flex-col md:flex-row items-center gap-3.5 relative z-10 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0 shadow-lg shadow-yellow-500/10 animate-pulse">
            <span className="text-[11px] uppercase font-mono font-black tracking-wider">Ad</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Topo do Feed</span>
            <p className="text-xs font-sans text-slate-305 font-bold leading-tight">Super Banner Leaderboard Horizontal</p>
            <p className="text-[10px] font-sans text-slate-500 leading-normal">Espaço publicitário de alto impacto integrado acima deste painel de palpites ativos.</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0 relative z-10 select-all">
          <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-950/80 px-2 py-0.5 border border-slate-850 rounded uppercase">728x90 px ou Responsivo</span>
          <div className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-850">
            <code className="text-[8px] font-mono text-slate-600">{"<!-- Code Mid-Top-Feed-Horizontal -->"}</code>
          </div>
        </div>
      </div>

      {/* Goal ticker/alert announcers container */}
      <div className="relative min-h-[40px] empty:hidden" id="goal-highlights-scroller">
        <AnimatePresence>
          {tickerAnnouncements.map((announce) => (
            <motion.div
              key={announce.id}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 5, opacity: 0 }}
              className="bg-emerald-500 text-slate-950 font-sans font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 absolute left-0 right-0 z-20"
            >
              <Sparkles className="w-4 h-4 animate-bounce shrink-0" />
              <span>{announce.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Matches Grid list */}
      <div className="grid grid-cols-1 gap-4" id="matches-list-grid">
        {filteredMatches.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm font-mono">
            Nenhuma partida disponível nesta categoria para simulação.
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              id={`sportsbook-match-${match.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700/80 transition shadow-md"
            >
              
              {/* Left Column: Match Details and status */}
              <div className="space-y-2 flex-1 md:max-w-md">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-slate-950 border border-slate-800 text-slate-400">
                    {getSportLabel(match.sport)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {match.league}
                  </span>
                  
                  {/* Status pills logic */}
                  {match.status === 'live' && (
                    <span className="flex items-center gap-1 bg-red-950 border border-red-500/30 text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 block shrink-0" />
                      LIVE
                    </span>
                  )}
                  {match.status === 'upcoming' && (
                    <span className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded-full">
                      <Calendar className="w-3 h-3 shrink-0" /> EM BREVE
                    </span>
                  )}
                  {match.status === 'finished' && (
                    <span className="bg-slate-850 border border-slate-800 text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded-full select-none">
                      CONCLUÍDO
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 flex-1 font-sans font-medium text-white text-sm md:text-base">
                    <span className="flex items-center justify-between">
                      <span>{match.homeTeam}</span>
                      {match.status === 'live' && (
                        <span className="text-emerald-400 font-bold font-mono text-sm bg-slate-950/60 px-1 py-0.5 rounded mb-0.5">
                          {match.homeScore}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center justify-between">
                      <span>{match.awayTeam}</span>
                      {match.status === 'live' && (
                        <span className="text-emerald-400 font-bold font-mono text-sm bg-slate-950/60 px-1 py-0.5 rounded mb-0.5">
                          {match.awayScore}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Right score/finish display */}
                  {match.status === 'finished' && (
                    <div className="flex items-center gap-1 text-xs font-mono font-extrabold text-slate-500 bg-slate-950/40 border border-slate-800 px-2 py-1 rounded">
                      <span>{match.homeScore}</span>
                      <span>-</span>
                      <span>{match.awayScore}</span>
                    </div>
                  )}
                </div>
                
                {/* Simulated remaining minutes/periods tracker */}
                {match.status === 'live' && (
                  <p className="text-[10px] font-mono text-slate-500">
                    Tempo simulado restante: <span className="text-amber-400 font-bold">{match.timeRemaining}s</span> de partida
                  </p>
                )}
              </div>

              {/* Right Column: Betting Odds Selector */}
              <div className="flex items-center gap-2 shrink-0 justify-end md:justify-start">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] md:max-w-none md:w-auto">
                  {/* Home Win Button */}
                  <button
                    disabled={match.status === 'finished'}
                    onClick={() => handleOddClick(match, 'home')}
                    className={`py-2 px-3 rounded-lg border flex flex-col items-center justify-center font-mono gap-0.5 min-w-[72px] cursor-pointer transition-all ${
                      isSelected(match.id, 'home')
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : match.status === 'finished'
                        ? 'bg-slate-950/50 border-slate-900/40 text-slate-700 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800/80 text-white hover:bg-slate-850 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[9px] text-slate-500 font-sans tracking-wide">CASA (1)</span>
                    <span className="text-xs font-bold">{match.odds.home.toFixed(2)}</span>
                  </button>

                  {/* Draw Button */}
                  <button
                    disabled={match.status === 'finished'}
                    onClick={() => handleOddClick(match, 'draw')}
                    className={`py-2 px-3 rounded-lg border flex flex-col items-center justify-center font-mono gap-0.5 min-w-[72px] cursor-pointer transition-all ${
                      isSelected(match.id, 'draw')
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : match.status === 'finished'
                        ? 'bg-slate-950/50 border-slate-900/40 text-slate-700 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800/80 text-white hover:bg-slate-850 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[9px] text-slate-500 font-sans tracking-wide">EMPATE (X)</span>
                    <span className="text-xs font-bold">{match.odds.draw.toFixed(2)}</span>
                  </button>

                  {/* Away Win Button */}
                  <button
                    disabled={match.status === 'finished'}
                    onClick={() => handleOddClick(match, 'away')}
                    className={`py-2 px-3 rounded-lg border flex flex-col items-center justify-center font-mono gap-0.5 min-w-[72px] cursor-pointer transition-all ${
                      isSelected(match.id, 'away')
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : match.status === 'finished'
                        ? 'bg-slate-950/50 border-slate-900/40 text-slate-700 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800/80 text-white hover:bg-slate-850 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[9px] text-slate-500 font-sans tracking-wide">FORA (2)</span>
                    <span className="text-xs font-bold">{match.odds.away.toFixed(2)}</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

import { SportsMatch, LeaderboardUser, DailyQuest } from './types';

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' Coins';
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, username: "ThiagoSilva88", balance: 145200, winRate: 68, badge: "👑 Lenda" },
  { rank: 2, username: "Neymar_Genérico", balance: 98400, winRate: 61, badge: "🔥 Mito" },
  { rank: 3, username: "DeusesDasApostas", balance: 75000, winRate: 58, badge: "⚡ Pro" },
  { rank: 4, username: "MinesMaster99", balance: 52100, winRate: 64, badge: "💣 Cavador" },
  { rank: 5, username: "CrashKing", balance: 41200, winRate: 52, badge: "🚀 Fogueteiro" },
  { rank: 6, username: "ApostadorPadrão", balance: 25000, winRate: 48 },
  { rank: 7, username: "ViraLataCaramelo", balance: 18400, winRate: 50 },
  { rank: 8, username: "GutoDoDouble", balance: 11000, winRate: 45 },
];

export const INITIAL_SPORT_MATCHES: SportsMatch[] = [
  {
    id: "m1",
    sport: "futebol",
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    homeScore: 0,
    awayScore: 0,
    timeRemaining: 90,
    status: "upcoming",
    odds: { home: 2.10, draw: 3.40, away: 3.10 },
    league: "Brasileirão Série A"
  },
  {
    id: "m2",
    sport: "futebol",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 1,
    awayScore: 1,
    timeRemaining: 42, // Live!
    status: "live",
    odds: { home: 1.85, draw: 2.90, away: 3.60 },
    league: "La Liga"
  },
  {
    id: "m3",
    sport: "basquete",
    homeTeam: "Los Angeles Lakers",
    awayTeam: "Boston Celtics",
    homeScore: 84,
    awayScore: 82,
    timeRemaining: 180, // Live in basketball terms
    status: "live",
    odds: { home: 1.70, draw: 12.0, away: 2.15 },
    league: "NBA Playoffs"
  },
  {
    id: "m4",
    sport: "esports",
    homeTeam: "FURIA esports",
    awayTeam: "Natus Vincere",
    homeScore: 14,
    awayScore: 12,
    timeRemaining: 120, // Live CS2 match
    status: "live",
    odds: { home: 2.40, draw: 9.50, away: 1.55 },
    league: "PGL Major Copenhagen"
  },
  {
    id: "m5",
    sport: "futebol",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    homeScore: 0,
    awayScore: 0,
    timeRemaining: 90,
    status: "upcoming",
    odds: { home: 1.95, draw: 3.60, away: 3.40 },
    league: "Premier League"
  },
  {
    id: "m6",
    sport: "esports",
    homeTeam: "T1",
    awayTeam: "Gen.G",
    homeScore: 0,
    awayScore: 0,
    timeRemaining: 120,
    status: "upcoming",
    odds: { home: 1.65, draw: 8.0, away: 2.22 },
    league: "LCK Finals"
  }
];

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: "q1",
    title: "Primeira de Muitas",
    description: "Faça qualquer aposta esportiva (mínimo de 50 Coins)",
    reward: 150,
    target: 1,
    progress: 0,
    completed: false,
    claimed: false
  },
  {
    id: "q2",
    title: "Mestre das Minas",
    description: "Consiga um multiplicador de pelo menos 2.0x no jogo Mines",
    reward: 250,
    target: 1,
    progress: 0,
    completed: false,
    claimed: false
  },
  {
    id: "q3",
    title: "Foguetinho Alto",
    description: "Consiga um Cash Out maior que 2.5x no Crash",
    reward: 350,
    target: 1,
    progress: 0,
    completed: false,
    claimed: false
  },
  {
    id: "q4",
    title: "Volume de Jogo",
    description: "Acumule um total de 1.000 Coins em apostas gerais",
    reward: 200,
    target: 1000,
    progress: 0,
    completed: false,
    claimed: false
  }
];

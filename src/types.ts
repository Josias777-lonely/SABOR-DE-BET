export interface SportsMatch {
  id: string;
  sport: 'futebol' | 'basquete' | 'esports';
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  timeRemaining: number; // in seconds, e.g., 90
  status: 'live' | 'upcoming' | 'finished';
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  league: string;
}

export type BetType = 'home' | 'draw' | 'away';

export interface SportBetSelection {
  matchId: string;
  matchTitle: string;
  type: BetType;
  teamName: string;
  odd: number;
}

export interface PlacedBet {
  id: string;
  type: 'sports' | 'mines' | 'crash' | 'double';
  description: string;
  amount: number;
  potentialPayout: number;
  multiplier: number;
  status: 'pending' | 'won' | 'lost';
  timestamp: Date;
  sportsDetails?: {
    matchId: string;
    selection: BetType;
    matchTitle: string;
    odd: number;
    resolvedScore?: string;
  };
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  balance: number;
  winRate: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  reward: number;
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

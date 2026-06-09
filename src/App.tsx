import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SportsBook from './components/SportsBook';
import BettingSlip from './components/BettingSlip';
import CasinoMines from './components/CasinoMines';
import CasinoCrash from './components/CasinoCrash';
import CasinoDouble from './components/CasinoDouble';
import Leaderboard from './components/Leaderboard';
import BetHistory from './components/BetHistory';
import DailyQuests from './components/DailyQuests';
import { SportsMatch, SportBetSelection, PlacedBet, DailyQuest } from './types';
import { INITIAL_SPORT_MATCHES, INITIAL_QUESTS, formatCurrency } from './utils';
import { motion, AnimatePresence } from 'motion/react';

// Real-time server-side database integration (Supabase)
import { supabase } from './supabase';

// Lucide-React icon imports
import { 
  Trophy, Bomb, Rocket, RotateCw, Menu, Award, History, 
  Info, Sparkles, Goal, ArrowRight, User, HelpCircle, Settings, 
  X, Send, CheckCircle2, AlertCircle, RefreshCw, Key, Search,
  TrendingUp, Users, Phone, Mail, Lock, Eye, EyeOff, Coins
} from 'lucide-react';

const GIFT_CARDS_DATA = [
  {
    id: 'ifood-50',
    service: 'iFood',
    title: 'Ifood',
    subtitle: 'Cupom de R$ 50',
    cost: 15000,
    badgeText: 'IFOOD',
    logoUrl: '/src/assets/images/ifood.png',
    badgeColor: 'text-[#ea1d2c] border-[#ea1d2c]/20 bg-[#ea1d2c]/5',
    gradFromTo: 'from-slate-900 to-red-950/20',
    borderHover: 'hover:border-[#ea1d2c]/40',
    btnBg: 'bg-[#ea1d2c] hover:bg-[#ff2d3d] text-white',
  },
  {
    id: '99-30',
    service: '99',
    title: '99',
    subtitle: 'Crédito R$ 35',
    cost: 10000,
    badgeText: '99 APP',
    logoUrl: '/src/assets/images/99.png',
    badgeColor: 'text-[#ffdd00] border-[#ffdd00]/20 bg-[#ffdd00]/5',
    gradFromTo: 'from-slate-900 to-yellow-950/20',
    borderHover: 'hover:border-[#ffdd00]/40',
    btnBg: 'bg-[#ffdd00] hover:bg-[#ffe533] text-slate-950',
  },
  {
    id: 'uber-50',
    service: 'Uber',
    title: 'Uber',
    subtitle: 'Crédito R$ 50',
    cost: 15000,
    badgeText: 'UBER',
    logoUrl: '/src/assets/images/uber.png',
    badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    gradFromTo: 'from-slate-900 to-emerald-950/20',
    borderHover: 'hover:border-emerald-500/40',
    btnBg: 'bg-[#06c167] hover:bg-[#07d271] text-white',
  },
  {
    id: 'xbox-ultimate',
    service: 'Xbox',
    title: 'Xbox',
    subtitle: '3 Meses Ultimate',
    cost: 30000,
    badgeText: 'XBOX',
    logoUrl: '/src/assets/images/xbox.png',
    badgeColor: 'text-green-400 border-green-500/20 bg-green-500/5',
    gradFromTo: 'from-slate-900 to-green-950/20',
    borderHover: 'hover:border-green-500/40',
    btnBg: 'bg-[#107c10] hover:bg-[#159e15] text-white',
  },
  {
    id: 'airbnb-150',
    service: 'Airbnb',
    title: 'Airbnb',
    subtitle: 'Crédito R$ 150',
    cost: 45000,
    badgeText: 'AIRBNB',
    logoUrl: '/src/assets/images/airbnb.png',
    badgeColor: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    gradFromTo: 'from-slate-900 to-rose-950/20',
    borderHover: 'hover:border-rose-500/40',
    btnBg: 'bg-[#ff5a5f] hover:bg-[#ff7377] text-white',
  },
  {
    id: 'apple-50',
    service: 'Apple',
    title: 'Apple',
    subtitle: 'Crédito R$ 50',
    cost: 18000,
    badgeText: 'APPLE',
    logoUrl: '/src/assets/images/apple.png',
    badgeColor: 'text-slate-350 border-slate-500/20 bg-slate-500/5',
    gradFromTo: 'from-slate-900 to-slate-800/10',
    borderHover: 'hover:border-slate-400/40',
    btnBg: 'bg-slate-700 hover:bg-slate-600 text-white',
  },
  {
    id: 'amazon-100',
    service: 'Amazon',
    title: 'Amazon',
    subtitle: 'Vale-Presente R$ 100',
    cost: 30000,
    badgeText: 'AMAZON',
    logoUrl: '/src/assets/images/amazon.png',
    badgeColor: 'text-[#ff9900] border-[#ff9900]/20 bg-[#ff9900]/5',
    gradFromTo: 'from-slate-900 to-amber-950/10',
    borderHover: 'hover:border-[#ff9900]/40',
    btnBg: 'bg-[#ff9900] hover:bg-[#ffa61a] text-slate-950',
  },
  {
    id: '99food-50',
    service: '99Food',
    title: '99 Food',
    subtitle: 'Cupom de R$ 50',
    cost: 15000,
    badgeText: '99FOOD',
    logoUrl: '/src/assets/images/99food.png',
    badgeColor: 'text-[#ff7a00] border-[#ff7a00]/20 bg-[#ff7a00]/5',
    gradFromTo: 'from-slate-900 to-amber-950/20',
    borderHover: 'hover:border-[#ff7a00]/40',
    btnBg: 'bg-[#ff7a00] hover:bg-[#ff8f23] text-white',
  },
  {
    id: 'netflix-50',
    service: 'Netflix',
    title: 'Netflix',
    subtitle: 'Crédito R$ 50',
    cost: 15000,
    badgeText: 'NETFLIX',
    logoUrl: '/src/assets/images/netflix.png',
    badgeColor: 'text-[#e50914] border-[#e50914]/20 bg-[#e50914]/5',
    gradFromTo: 'from-slate-900 to-red-950/20',
    borderHover: 'hover:border-[#e50914]/40',
    btnBg: 'bg-[#e50914] hover:bg-[#f40b17] text-white',
  },
  {
    id: 'spotify-premium',
    service: 'Spotify',
    title: 'Spotify',
    subtitle: '1 Mês Grátis',
    cost: 10000,
    badgeText: 'SPOTIFY',
    logoUrl: '/src/assets/images/spotify.png',
    badgeColor: 'text-[#1db954] border-[#1db954]/20 bg-[#1db954]/5',
    gradFromTo: 'from-slate-900 to-emerald-950/20',
    borderHover: 'hover:border-[#1db954]/40',
    btnBg: 'bg-[#1db954] hover:bg-[#1ed760] text-slate-950',
  },
  {
    id: 'google-play-30',
    service: 'Google-Play',
    title: 'Google Play',
    subtitle: 'Vale R$ 30',
    cost: 12000,
    badgeText: 'GP-PLAY',
    logoUrl: '/src/assets/images/google-play.png',
    badgeColor: 'text-[#4285f4] border-[#4285f4]/20 bg-[#4285f4]/5',
    gradFromTo: 'from-slate-900 to-blue-950/20',
    borderHover: 'hover:border-[#4285f4]/40',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
  {
    id: 'steam-50',
    service: 'Steam',
    title: 'Steam',
    subtitle: 'Crédito R$ 50',
    cost: 20000,
    badgeText: 'STEAM',
    logoUrl: '/src/assets/images/steam.png',
    badgeColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
    gradFromTo: 'from-slate-900 to-indigo-950/20',
    borderHover: 'hover:border-indigo-400/40',
    btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  }
];

function GiftCardLogo({ logoUrl, badgeText }: { logoUrl?: string; badgeText: string }) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <img 
        src={logoUrl} 
        alt={badgeText} 
        onError={() => setImgError(true)} 
        className="max-h-8 max-w-[85%] object-contain filter group-hover:scale-[1.05] transition duration-300"
        referrerPolicy="no-referrer"
      />
    );
  }

  return <span>{badgeText}</span>;
}

function BrandLogoCard({ name, logoUrl, fallback, onClick }: { name: string; logoUrl: string; fallback: React.ReactNode; onClick?: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900/40 border border-slate-850 hover:border-[#feb916]/40 hover:bg-slate-900/70 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[90px] sm:min-h-[110px] transition-all duration-300 group shadow-lg hover:shadow-amber-500/5 relative overflow-hidden select-none ${onClick ? 'cursor-pointer active:scale-95' : ''}`} 
      id={`brand-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/[0.01] pointer-events-none" />
      {!imgError ? (
        <img 
          src={logoUrl} 
          alt={name} 
          onError={() => setImgError(true)} 
          className="max-h-9 sm:max-h-12 max-w-[85%] object-contain filter brightness-95 group-hover:brightness-110 group-hover:scale-[1.03] transition duration-300"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 w-full text-center">
          {fallback}
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider font-sans group-hover:text-[#feb916] transition duration-300 uppercase">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}

function generateMoreUsers(existingUsers: any[], count: number = 250): any[] {
  const prefixes = [
    'Vitinho', 'Pedro', 'Gabi', 'Lucas', 'Ana', 'Julia', 'Carlos', 'Rei', 'Rainha', 'Coronel',
    'Carioca', 'Paulista', 'Mineiro', 'Baiano', 'Gaucho', 'Ronaldo', 'Messi', 'Ney', 'CR7',
    'Meteoro', 'Foguete', 'Mago', 'Profeta', 'Tigrinho', 'Leao', 'Lobo', 'Panda', 'Gato',
    'Cachorro', 'Ninja', 'Pirata', 'Guerreiro', 'Arqueiro', 'Mestre', 'Doutor', 'Professor',
    'Ze', 'Chico', 'Luiz', 'Bet', 'Aposta', 'Ganho', 'Moeda', 'Ouro', 'Prata', 'Bronze',
    'Vencedor', 'Campeao', 'Sorte', 'Fortuna', 'Mano', 'Guria', 'Pinguim', 'Aguia', 'Falcao',
    'Tubarao', 'Touro', 'Urso', 'Fenix', 'Dragao', 'Beto', 'Rafa', 'Lari', 'Bia', 'Gui'
  ];

  const suffixes = [
    'DoMines', 'DoCrash', 'DoDouble', 'DaSorte', 'DoBet', 'Milionario', 'Pro', 'Vip', 'OFC',
    'Br', '10', '7', '9', 'Real', 'Blaze', 'Sabor', 'Gamer', 'Play', 'Apostador', 'Trader',
    'Genio', 'X', 'Max', 'Gold', 'Silver', 'Turbo', 'Rapido', 'Ninja', 'Luck', 'Fut',
    'Goal', 'Ball', 'Kick', 'Win', 'Winner', 'Top', 'Clube', 'Spins', 'Carioca', 'Serrano',
    'DoGreen', 'Green', 'Forra', 'Alavancado', 'Alquimista', 'Estrategista', 'Monstro',
    'Mito', 'Lenda', 'Fenomenon', 'Boss', 'Rei'
  ];

  const existingSet = new Set(existingUsers.map(u => u.username.toLowerCase()));
  const newUsers: any[] = [];

  for (let i = 0; i < count; i++) {
    let username = '';
    let attempts = 0;
    while (true) {
      const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const rVal = Math.random();
      if (rVal < 0.25) {
        username = `${pref}_${suff}`;
      } else if (rVal < 0.5) {
        username = `${pref}${suff}${Math.floor(Math.random() * 90 + 10)}`;
      } else if (rVal < 0.75) {
        username = `${pref}${suff}`;
      } else {
        username = `${pref}_${suff}_${Math.floor(Math.random() * 9 + 1)}`;
      }

      const lower = username.toLowerCase();
      if (!existingSet.has(lower) && username.length >= 3 && username.length <= 20) {
        existingSet.add(lower);
        break;
      }
      attempts++;
      if (attempts > 50) {
        username = `${pref}${suff}${Math.floor(Math.random() * 9000 + 1000)}`;
        existingSet.add(username.toLowerCase());
        break;
      }
    }

    const ddds = ['11', '12', '13', '19', '21', '22', '31', '32', '41', '51', '61', '71', '81', '83', '84', '85', '86', '91', '98'];
    const ddd = ddds[Math.floor(Math.random() * ddds.length)];
    const p1 = Math.floor(Math.random() * 9000 + 1000);
    const p2 = Math.floor(Math.random() * 9000 + 1000);
    const phone = `(${ddd}) 9 ${p1}-${p2}`;

    const domains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'uol.com.br', 'bol.com.br'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${username.toLowerCase().replace(/[^a-z0-9_]/g, '')}@${domain}`;

    // Random realistic balance for rankings
    const balance = Math.floor(Math.random() * 19500) + 50;

    newUsers.push({
      username,
      phone,
      email,
      password: '123',
      balance,
      updated_at: new Date().toISOString()
    });
  }

  return newUsers;
}

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('betfree_balance');
    const isLoggedInInitially = localStorage.getItem('betfree_is_logged_in') === 'true';
    if (!isLoggedInInitially) return 0;
    return saved ? parseInt(saved, 10) : 100;
  });

  // Gift Card redemption simulation states
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [redeemedService, setRedeemedService] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [placedBets, setPlacedBets] = useState<PlacedBet[]>(() => {
    const saved = localStorage.getItem('betfree_bets_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('betfree_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  // --- Reactive UI States ---
  const [activeTab, setActiveTab] = useState<'home' | 'sports' | 'mines' | 'crash' | 'double' | 'leaderboard' | 'history' | 'quests' | 'rewards'>('home');
  const [showLiveOnly, setShowLiveOnly] = useState<boolean>(false);

  // --- Daily Rewards & Ads gamification state ---
  const [lastDailyClaim, setLastDailyClaim] = useState<string>(() => {
    return localStorage.getItem('sabor_last_daily_claim') || '';
  });
  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('sabor_daily_streak') || '1', 10);
  });
  const [adsWatched, setAdsWatched] = useState<number>(() => {
    return parseInt(localStorage.getItem('sabor_ads_watched') || '0', 10);
  });
  const [claimedAdRewards, setClaimedAdRewards] = useState<number[]>(() => {
    const saved = localStorage.getItem('sabor_claimed_ad_rewards');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(0);

  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month - 1, day);
  };
  const [activeSelections, setActiveSelections] = useState<SportBetSelection[]>([]);
  const [matches, setMatches] = useState<SportsMatch[]>(INITIAL_SPORT_MATCHES);

  // --- Auth, Search, Hamburger state variables ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [popularSearches, setPopularSearches] = useState<string[]>([
    'Futebol', 'Flamengo', 'Real Madrid', 'Lakers', 'FURIA', 'NBA', 'Celtics', 'Gen.G', 'Palmeiras', 'Vasco', 'Corinthians', 'Champions', 'Barcelona', 'NFL', 'CS2', 'Valorant', 'CBLOL', 'MIBR'
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('betfree_is_logged_in') === 'true';
  });
  const [loggedInUser, setLoggedInUser] = useState<string>(() => {
    return localStorage.getItem('betfree_logged_in_user') || 'Apostador_Livre';
  });

  // Modal Overlays
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loginEmailError, setLoginEmailError] = useState<string>('');
  const [loginPasswordError, setLoginPasswordError] = useState<string>('');

  const [registeredUsers, setRegisteredUsers] = useState<{username: string; phone: string; email: string; password: string; balance?: number}[]>([]);

  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isMyAccountModalOpen, setIsMyAccountModalOpen] = useState<boolean>(false);

  // Chat message logs
  const [supportMessages, setSupportMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: 'Olá! Como posso te ajudar na sua simulação hoje? 😊', time: '12:00' }
  ]);
  const [supportInput, setSupportInput] = useState<string>('');

  const [pendingScrollCardId, setPendingScrollCardId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'rewards' && pendingScrollCardId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`reward-card-${pendingScrollCardId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-[#feb916]', 'scale-[1.03]');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-[#feb916]', 'scale-[1.03]');
          }, 2500);
        }
        setPendingScrollCardId(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab, pendingScrollCardId]);

  const handleBrandCardClick = (cardId: string) => {
    setActiveTab('rewards');
    setPendingScrollCardId(cardId);
  };

  // --- Real-time Real Database Supabase synchronization ---
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error("Error fetching users from Supabase:", error);
        return;
      }

      if (!data || data.length < 250) {
        // Seed database if empty or missing profiles to reach total realistic pool of 250+ users
        const initialSeed = [
          { username: 'sabor_de_bet', phone: '(86) 9 8888 9082', email: 'siasjo20@gmail.com', password: '123', balance: 15300 },
          { username: 'ThiagoSilva88', phone: '(11) 9 3214 5511', email: 'thiago@example.com', password: '123', balance: 34500 },
          { username: 'Neymar_Generico', phone: '(13) 9 9887 6652', email: 'ney@example.com', password: '123', balance: 22000 },
          { username: 'DeusesDasApostas', phone: '(19) 9 8221 3411', email: 'deuses@example.com', password: '123', balance: 14500 },
          { username: 'MinesMaster99', phone: '(21) 9 7755 4312', email: 'mines@example.com', password: '123', balance: 8100 },
          { username: 'CrashKing', phone: '(31) 9 8651 2981', email: 'crash@example.com', password: '123', balance: 3200 },
          { username: 'ViraLataCaramelo', phone: '(81) 9 9231 1102', email: 'caramelo@example.com', password: '123', balance: 1800 },
          { username: 'GutoDoDouble', phone: '(85) 9 8821 9083', email: 'guto@example.com', password: '123', balance: 450 }
        ];

        const existingData = data || [];
        const currentCount = existingData.length;
        const neededCount = 250 - currentCount;

        let seedToInsert: any[] = [];
        if (currentCount === 0) {
          // Empty DB: insert initial seed + 250 generated users
          const extraUsers = generateMoreUsers(initialSeed, 250);
          seedToInsert = [...initialSeed, ...extraUsers];
        } else if (neededCount > 0) {
          // Non-empty DB but fewer than 250: insert only needed extra generated users to reach at least 250 new people
          seedToInsert = generateMoreUsers(existingData, neededCount + 10);
        }

        if (seedToInsert.length > 0) {
          const { error: seedError } = await supabase
            .from('users')
            .insert(seedToInsert);
          
          if (seedError) {
            console.error("Error seeding users to Supabase:", seedError);
            setRegisteredUsers(existingData);
          } else {
            // Re-fetch users after successful seed
            const { data: seededData } = await supabase.from('users').select('*');
            if (seededData) {
              setRegisteredUsers(seededData);
            } else {
              setRegisteredUsers(existingData);
            }
          }
        } else {
          setRegisteredUsers(existingData);
        }
      } else {
        setRegisteredUsers(data);
      }
    };

    fetchUsers();

    // Subscribe to changes in public.users table for dynamic auto-updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('betfree_is_logged_in', isLoggedIn.toString());
    localStorage.setItem('betfree_logged_in_user', loggedInUser);
    if (!isLoggedIn) {
      setBalance(0);
    }
  }, [isLoggedIn, loggedInUser]);

  // Keep balance state and Supabase in perfect alignment
  useEffect(() => {
    localStorage.setItem('betfree_balance', balance.toString());
    if (isLoggedIn && loggedInUser) {
      supabase
        .from('users')
        .update({
          balance: balance,
          updated_at: new Date().toISOString()
        })
        .ilike('username', loggedInUser)
        .then(({ error }) => {
          if (error) {
            console.warn("Supabase balance update ignored during transient states", error);
          }
        });
    }
  }, [balance, isLoggedIn, loggedInUser]);

  // Ensure balance updates locally if synchronized in real-time from database changes
  useEffect(() => {
    if (isLoggedIn && loggedInUser && registeredUsers.length > 0) {
      const me = registeredUsers.find(u => u.username.toLowerCase() === loggedInUser.toLowerCase());
      if (me && me.balance !== undefined && me.balance !== balance) {
        setBalance(me.balance);
      }
    }
  }, [registeredUsers, isLoggedIn, loggedInUser]);

  useEffect(() => {
    localStorage.setItem('betfree_bets_history', JSON.stringify(placedBets));
  }, [placedBets]);

  useEffect(() => {
    localStorage.setItem('betfree_quests', JSON.stringify(quests));
  }, [quests]);

  // Daily Rewards & Ads persistence hooks
  useEffect(() => {
    localStorage.setItem('sabor_last_daily_claim', lastDailyClaim);
  }, [lastDailyClaim]);

  useEffect(() => {
    localStorage.setItem('sabor_daily_streak', dailyStreak.toString());
  }, [dailyStreak]);

  useEffect(() => {
    localStorage.setItem('sabor_ads_watched', adsWatched.toString());
  }, [adsWatched]);

  useEffect(() => {
    localStorage.setItem('sabor_claimed_ad_rewards', JSON.stringify(claimedAdRewards));
  }, [claimedAdRewards]);

  // Auto Reset ad rewards count when day changes
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('pt-BR');
    const savedDate = localStorage.getItem('sabor_last_ad_claim_day') || '';
    if (savedDate !== todayStr) {
      localStorage.setItem('sabor_last_ad_claim_day', todayStr);
      setAdsWatched(0);
      setClaimedAdRewards([]);
    }
  }, []);

  // Ad watcher countdown simulated timer
  useEffect(() => {
    let timer: any;
    if (isWatchingAd && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown(prev => prev - 1);
      }, 1000);
    } else if (isWatchingAd && adCountdown === 0) {
      setIsWatchingAd(false);
      setAdsWatched(prev => Math.min(3, prev + 1));
      alert("🎬 Anúncio finalizado com sucesso! Seu contador de anúncios assistidos aumentou.");
    }
    return () => clearTimeout(timer);
  }, [isWatchingAd, adCountdown]);

  // Claim actions handlers
  const getDailyReward = (day: number): number => {
    if (day < 1 || day > 30) return 0;
    if (day <= 28) {
      const week = Math.floor((day - 1) / 7);
      const baseDay = ((day - 1) % 7) + 1;
      let baseVal = 10;
      if (baseDay === 1) baseVal = 10;
      else if (baseDay >= 2 && baseDay <= 5) baseVal = 20;
      else if (baseDay === 6) baseVal = 30;
      else if (baseDay === 7) baseVal = 70;
      return baseVal * Math.pow(2, week);
    }
    if (day === 29) {
      return Math.floor(getDailyReward(28) * 1.5);
    }
    if (day === 30) {
      return Math.floor(getDailyReward(29) * 1.5);
    }
    return 0;
  };

  const handleClaimDailyReward = () => {
    if (!isLoggedIn) {
      alert("⚠️ Você precisa de uma conta ativa para resgatar coins! Faça login para ganhar +50 Coins.");
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR');
    if (lastDailyClaim === todayStr) {
      alert("📅 Você já resgatou sua recompensa de hoje! Volte amanhã.");
      return;
    }

    let newStreak = 1;
    if (lastDailyClaim) {
      const lastClaimedDate = parseLocalDate(lastDailyClaim);
      if (lastClaimedDate) {
        const lastDateOnly = new Date(lastClaimedDate.getFullYear(), lastClaimedDate.getMonth(), lastClaimedDate.getDate());
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const diffTime = todayDateOnly.getTime() - lastDateOnly.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak = dailyStreak === 30 ? 1 : dailyStreak + 1;
        } else {
          newStreak = 1;
        }
      }
    } else {
      newStreak = 1;
    }

    const rewardValue = getDailyReward(newStreak);

    setDailyStreak(newStreak);
    setLastDailyClaim(todayStr);
    setBalance(prev => prev + rewardValue);
    alert(`🎉 Recompensa Diária do Dia ${newStreak} Coletada! Sabor de Bet creditou +${rewardValue} Coins virtuais na sua carteira.`);
  };

  const handleWatchAd = () => {
    if (!isLoggedIn) {
      alert("⚠️ Você precisa de uma conta ativa para assistir anúncios! Faça login para ganhar +50 Coins.");
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (adsWatched >= 3) {
      alert("📺 Você já assistiu a todos os anúncios de hoje! Volte amanhã para assistir mais.");
      return;
    }
    setIsWatchingAd(true);
    setAdCountdown(4); // 4 seconds simulated ad run length
  };

  const handleClaimAdReward = (milestone: number, rewardCoins: number) => {
    if (!isLoggedIn) {
      alert("⚠️ Você precisa de uma conta ativa para resgatar coins! Faça login para ganhar +50 Coins.");
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (adsWatched < milestone) {
      alert(`🔒 Você precisa assistir pelo menos ${milestone} ${milestone === 1 ? 'anúncio' : 'anúncios'} para liberar esta recompensa.`);
      return;
    }
    if (claimedAdRewards.includes(milestone)) {
      alert("Você já resgatou esta recompensa!");
      return;
    }
    setClaimedAdRewards(prev => [...prev, milestone]);
    setBalance(prev => prev + rewardCoins);
    alert(`🎉 Excelente! Você assistiu ${milestone} ${milestone === 1 ? 'anúncio' : 'anúncios'} e resgatou +${rewardCoins} Coins virtuais.`);
  };

  // --- Sports Bet automatic resolver loop ---
  // Periodically looks for completed matches and updates pending sports bets.
  useEffect(() => {
    const pendingSportsBets = placedBets.filter(b => b.type === 'sports' && b.status === 'pending');
    if (pendingSportsBets.length === 0) return;

    let historyUpdated = false;
    let earnedPila = 0;

    const updatedHistory = placedBets.map(bet => {
      if (bet.type !== 'sports' || bet.status !== 'pending' || !bet.sportsDetails) {
        return bet;
      }

      const matchId = bet.sportsDetails.matchId;
      const targetMatch = matches.find(m => m.id === matchId);

      if (!targetMatch || targetMatch.status !== 'finished') {
        return bet;
      }

      // Match is finished! Resolve results
      historyUpdated = true;
      let winningSelection: 'home' | 'draw' | 'away' = 'draw';
      if (targetMatch.homeScore > targetMatch.awayScore) {
        winningSelection = 'home';
      } else if (targetMatch.homeScore < targetMatch.awayScore) {
        winningSelection = 'away';
      }

      const userWon = bet.sportsDetails.selection === winningSelection;
      const finalStatus = userWon ? 'won' : 'lost';
      const payout = userWon ? bet.potentialPayout : 0;

      if (userWon) {
        earnedPila += payout;
      }

      return {
        ...bet,
        status: finalStatus as 'won' | 'lost',
        sportsDetails: {
          ...bet.sportsDetails,
          resolvedScore: `${targetMatch.homeScore} - ${targetMatch.awayScore}`
        }
      };
    });

    if (historyUpdated) {
      setPlacedBets(updatedHistory);
      if (earnedPila > 0) {
        setBalance(prev => prev + earnedPila);
      }
    }
  }, [matches, placedBets]);

  // --- Global State helper function updates ---
  const updateBalanceHandler = (amount: number) => {
    if (!isLoggedIn && amount !== 0) {
      alert("⚠️ Faça login para receber +50 Coins grátis e começar a simular seus palpites esportivos!");
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setBalance(prev => Math.max(0, prev + amount));
  };

  const handleQuestCompletionProgress = (questId: string, value: number) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.id !== questId || q.completed) return q;
        const newProgress = Math.min(q.target, q.progress + value);
        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.target
        };
      })
    );
  };

  const logBetResult = (
    description: string,
    amount: number,
    payout: number,
    status: 'won' | 'lost',
    multiplier: number
  ) => {
    const newBet: PlacedBet = {
      id: Math.random().toString(),
      type: description.toLowerCase().includes('mines')
        ? 'mines'
        : description.toLowerCase().includes('crash')
        ? 'crash'
        : description.toLowerCase().includes('double')
        ? 'double'
        : 'sports',
      description,
      amount,
      potentialPayout: payout,
      multiplier,
      status,
      timestamp: new Date()
    };

    setPlacedBets(prev => [newBet, ...prev]);
  };

  // --- Betting Slip orchestration handlers ---
  const handleToggleSelection = (sel: SportBetSelection) => {
    if (!isLoggedIn) {
      alert("⚠️ Crie uma conta grátis para começar a selecionar Odds e ganhar prêmios!");
      setAuthMode('register');
      setIsAuthModalOpen(true);
      return;
    }
    setActiveSelections(prev => {
      const exists = prev.some(item => item.matchId === sel.matchId);
      if (exists) {
        // Remove if they click the same match to replace it
        return prev.filter(item => item.matchId !== sel.matchId);
      }
      return [...prev, sel];
    });
  };

  const handleRemoveSelection = (matchId: string) => {
    setActiveSelections(prev => prev.filter(item => item.matchId !== matchId));
  };

  const handleClearAllSelections = () => {
    setActiveSelections([]);
  };

  const handlePlaceSportsBetCoupon = (stake: number, totalOdd: number) => {
    if (!isLoggedIn) {
      alert("⚠️ Você precisa de uma conta ativa para apostar! Faça login para receber +50 Coins grátis!");
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (activeSelections.length === 0) return;

    // Place bet logic
    const desc = activeSelections.map(s => `${s.matchTitle} (${s.teamName})`).join(' + ');
    const payout = Math.floor(stake * totalOdd);

    updateBalanceHandler(-stake);

    // Create unique entries in history representing their sports sheet
    const selectionsCopy = [...activeSelections];

    selectionsCopy.forEach(sel => {
      const individualPotentialPayout = Math.floor(stake * sel.odd);
      const newSportsBet: PlacedBet = {
        id: Math.random().toString(),
        type: 'sports',
        description: `Palpite na partida: ${sel.matchTitle} - Ganha para ${sel.teamName} (${sel.odd.toFixed(2)}x)`,
        amount: stake,
        potentialPayout: individualPotentialPayout,
        multiplier: sel.odd,
        status: 'pending',
        timestamp: new Date(),
        sportsDetails: {
          matchId: sel.matchId,
          selection: sel.type,
          matchTitle: sel.matchTitle,
          odd: sel.odd
        }
      };

      setPlacedBets(prev => [newSportsBet, ...prev]);
    });

    handleClearAllSelections();

    // Trigger sports wagers daily quest
    handleQuestCompletionProgress('q1', 1);
    handleQuestCompletionProgress('q4', stake);
  };

  // --- Claim daily quests reward ---
  const handleClaimQuestReward = (questId: string, reward: number) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.id === questId) {
          return { ...q, claimed: true };
        }
        return q;
      })
    );
    updateBalanceHandler(reward);
  };

  // --- Dynamic Search Engine Handlers ---
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val.trim().length > 2) {
      const termClean = val.trim();
      setPopularSearches(prev => {
        const filtered = prev.filter(p => p.toLowerCase() !== termClean.toLowerCase());
        return [termClean, ...filtered].slice(0, 10);
      });
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
  };

  // --- Sidebar Hamburger Actions ---
  const handleMenuAction = (action: 'support' | 'faq' | 'settings' | 'logout') => {
    setIsMenuOpen(false); // Close dropdown
    
    if (action === 'support') {
      setIsSupportModalOpen(true);
    } else if (action === 'faq') {
      setIsFaqModalOpen(true);
    } else if (action === 'settings') {
      setIsSettingsModalOpen(true);
    } else if (action === 'logout') {
      setIsLoggedIn(false);
      setLoggedInUser('Apostador_Livre');
      localStorage.removeItem('betfree_logged_in_user');
      alert('Sessão encerrada com sucesso!');
    }
  };

  // --- Helpers for Auth Validation ---
  const getInvalidCharactersInUsername = (uname: string): string[] => {
    const forbidden = [' ', '/', '|', '*', '(', ')', "'", '"', '<', '>'];
    const found: string[] = [];
    for (let char of uname) {
      if (forbidden.includes(char)) {
        const displayChar = char === ' ' ? 'Espaço' : char;
        if (!found.includes(displayChar)) {
          found.push(displayChar);
        }
      }
    }
    return found;
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const truncated = digits.slice(0, 11);
    if (truncated.length === 0) return '';
    if (truncated.length <= 2) {
      return `(${truncated}`;
    }
    if (truncated.length <= 3) {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    }
    if (truncated.length <= 7) {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3)}`;
    }
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3, 7)} ${truncated.slice(7, 11)}`;
  };

  // --- Simulated Registration and Sign In ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'login') {
      const emailTyped = authEmail.trim().toLowerCase();
      if (!emailTyped || !authPassword) {
        alert('Por favor, preencha todos os campos!');
        return;
      }

      // 1. Look up user by email in our real-time synchronized users list from Firestore
      const matchedUser = registeredUsers.find(u => u.email.toLowerCase() === emailTyped);
      if (!matchedUser) {
        setLoginEmailError('E-mail ainda não registrado.');
        return;
      }

      // 2. Validate password
      if (matchedUser.password !== authPassword) {
        setAuthPassword(''); // Clear the password so it vanishes
        setLoginPasswordError('Senha incorreta.');
        return;
      }

      // Login success
      setIsLoggedIn(true);
      setLoggedInUser(matchedUser.username);
      localStorage.setItem('betfree_is_logged_in', 'true');
      localStorage.setItem('betfree_logged_in_user', matchedUser.username);

      // Restore their real-time DB balance and give them +50 login award
      const userCoins = matchedUser.balance !== undefined ? matchedUser.balance : 100;
      const finalBalance = userCoins + 50;
      setBalance(finalBalance);

      // Save new balance to Supabase immediately
      supabase
        .from('users')
        .update({
          balance: finalBalance,
          updated_at: new Date().toISOString()
        })
        .ilike('username', matchedUser.username)
        .then(({ error }) => {
          if (error) {
            console.error("Erro ao sincronizar moedas após login: ", error);
          }
        });

      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setLoginEmailError('');
      setLoginPasswordError('');

      alert(`Boas-vindas de volta, ${matchedUser.username}! 🎉 Seus coins foram sincronizados em tempo real com o banco de dados e você ganhou +50 Coins de bônus!`);
    } else {
      // REGISTER MODE
      // 1. Validate Username
      const usernameErrors = getInvalidCharactersInUsername(authUsername);
      if (!authUsername.trim()) {
        alert('Por favor, preencha o campo de Username!');
        return;
      }
      if (usernameErrors.length > 0) {
        alert('Por favor, corrija o Username antes de prosseguir! Não são permitidos espaços ou símbolos especiais.');
        return;
      }

      const lowercasedUsername = authUsername.trim().toLowerCase();
      const usernameTaken = registeredUsers.some(u => u.username.toLowerCase() === lowercasedUsername);
      if (usernameTaken) {
        alert('Este Username já está em uso! Escolha outro nome.');
        return;
      }

      // 2. Validate Phone
      const phoneDigits = authPhone.replace(/\D/g, '');
      if (phoneDigits.length !== 11) {
        alert('Por favor, digite um número de telefone válido (celular com DDD de 11 dígitos)!');
        return;
      }

      // 3. Validate Email
      if (!authEmail.trim() || !authEmail.includes('@')) {
        alert('Por favor, digite um endereço de e-mail válido!');
        return;
      }

      // Check if email already registered
      const emailTaken = registeredUsers.some(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
      if (emailTaken) {
        alert('Este endereço de e-mail já está cadastrado em nossa base!');
        return;
      }

      // 4. Validate Passwords
      if (!authPassword) {
        alert('Por favor, preencha os campos de senha!');
        return;
      }
      if (authPassword !== authConfirmPassword) {
        alert('As senhas digitadas não correspondem!');
        return;
      }

      // All good! Register the user starting with 200 Coins (100 registration base + 100 gift bonus)
      const newUser = {
        username: authUsername.trim(),
        phone: authPhone,
        email: authEmail.trim().toLowerCase(),
        password: authPassword,
        balance: 200
      };

      // Create document in real Supabase database!
      supabase
        .from('users')
        .insert([{
          username: newUser.username,
          phone: newUser.phone,
          email: newUser.email,
          password: newUser.password,
          balance: 200,
          updated_at: new Date().toISOString()
        }])
        .then(({ error }) => {
          if (error) {
            console.error("Cadastro falhou no Supabase: ", error);
            alert("Ops! Ocorreu um erro ao salvar o seu cadastro em tempo real no banco de dados. Tente novamente.");
            return;
          }

          setIsLoggedIn(true);
          setLoggedInUser(newUser.username);
          localStorage.setItem('betfree_is_logged_in', 'true');
          localStorage.setItem('betfree_logged_in_user', newUser.username);
          setBalance(200);

          setIsAuthModalOpen(false);
          setAuthUsername('');
          setAuthPhone('');
          setAuthEmail('');
          setAuthPassword('');
          setAuthConfirmPassword('');
          setLoginEmailError('');
          setLoginPasswordError('');

          alert(`Parabéns! Sua conta real no banco de dados Sabor de Bet foi criada como: ${newUser.username}! 🎉 Você ganhou +200 Coins de presente de boas-vindas!`);
        });
    }
  };

  // --- Interactive Live Helpbot Chat mockup ---
  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInput.trim()) return;

    const userMsg = supportInput.trim();
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setSupportMessages(prev => [...prev, { sender: 'user', text: userMsg, time: timeNow }]);
    setSupportInput('');

    // Clever auto replies simulating premium live coverage
    setTimeout(() => {
      let reply = 'Recebemos sua mensagem! Nossa equipe de simulação responderá em breve. Sabor de Bet agradece! 🌶️';
      const cleanLower = userMsg.toLowerCase();
      
      if (cleanLower.includes('saldo') || cleanLower.includes('dinheiro') || cleanLower.includes('sacar') || cleanLower.includes('trocar')) {
        reply = '🚨 O Sabor de Bet é 100% gratuito e SEM dinheiro real. O saldo de "Coins" serve para simular palpites esportivos e de slots, e pode ser trocado de forma divertida por Vales de Presente na nossa vitrine ao final da página!';
      } else if (cleanLower.includes('bônus') || cleanLower.includes('bonus') || cleanLower.includes('coins')) {
        reply = '🎁 Dica: Você ganha +50 Coins adicionais ao fazer login!';
      } else if (cleanLower.includes('ajuda') || cleanLower.includes('mines') || cleanLower.includes('perdi')) {
        reply = '🍀 Não desanime! Se suas fichas ficarem zeradas, faça login novamente para ativar os bônus de login para recuperar seu saldo de Coins!';
      } else if (cleanLower.includes('faq')) {
        reply = '💡 Você pode visualizar todas as perguntas frequentes na nossa Central de FAQ acessível no menu principal!';
      }

      setSupportMessages(prev => [...prev, { sender: 'agent', text: reply, time: timeNow }]);
    }, 1000);
  };

  // --- Reset Simulator Configurations ---
  const handleSettingsReset = () => {
    if (confirm('Tem certeza de que deseja apagar o histórico de simulação e redefinir seu saldo de Coins?')) {
      setBalance(100);
      setPlacedBets([]);
      setQuests(INITIAL_QUESTS);
      localStorage.clear();
      setIsSettingsModalOpen(false);
      alert('Todas as configurações de simulação foram redefinidas ao padrão com sucesso!');
    }
  };

  // --- Permanent Account Deletion ---
  const handleDeleteAccount = async () => {
    if (!isLoggedIn || loggedInUser === 'Apostador_Livre') return;
    
    const confirmDelete = confirm('⚠️ ATENÇÃO: Tem certeza absoluta de que deseja APAGAR permanentemente a sua conta e todos os seus dados? Esta operação é irreversível!');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('username', loggedInUser);
      
      if (error) {
        throw error;
      }

      setIsLoggedIn(false);
      setLoggedInUser('Apostador_Livre');
      localStorage.removeItem('betfree_logged_in_user');
      setBalance(100);
      alert('Sua conta foi permanentemente apagada com sucesso do banco de dados! Um saldo de simulação de 100 Coins foi restabelecido.');
    } catch (err: any) {
      console.error("Erro ao deletar conta no Supabase:", err);
      setIsLoggedIn(false);
      setLoggedInUser('Apostador_Livre');
      localStorage.removeItem('betfree_logged_in_user');
      setBalance(100);
      alert('Sua sessão foi encerrada e limpa localmente.');
    }
  };

  const handleRedeemGiftCard = (service: string, cost: number) => {
    if (!isLoggedIn) {
      alert("⚠️ Você precisa de uma conta ativa para resgatar Gift Cards! Crie sua conta para ganhar +50 Coins.");
      setAuthMode('register');
      setIsAuthModalOpen(true);
      return;
    }
    if (balance < cost) {
      alert(`❌ Saldo insuficiente! Você possui ${formatCurrency(balance)}, mas o Gift Card de ${service} custa ${formatCurrency(cost)}.\n\nContinue acertando suas previsões e jogando os slots de double, crash ou mines para acumular mais Coins!`);
      return;
    }

    // Subtract Coins
    updateBalanceHandler(-cost);

    // Generate random code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codePart1 = '';
    let codePart2 = '';
    for (let i = 0; i < 4; i++) {
      codePart1 += chars[Math.floor(Math.random() * chars.length)];
      codePart2 += chars[Math.floor(Math.random() * chars.length)];
    }
    const finalCode = `SDB-${service.toUpperCase()}-${codePart1}-${codePart2}`;
    
    setRedeemedService(service);
    setRedeemedCode(finalCode);
  };

  const showLeftAds = activeTab === 'rewards' || activeTab === 'sports' || activeTab === 'leaderboard';

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between" id="applet-main-canvas">
      
      {/* Top sticky navbar branding with simulated auth controls */}
      <Header 
        balance={balance} 
        updateBalance={updateBalanceHandler} 
        username={loggedInUser} 
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setIsAuthModalOpen(true);
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setLoggedInUser('Apostador_Livre');
          localStorage.removeItem('betfree_logged_in_user');
          alert('Sessão encerrada!');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showLiveOnly={showLiveOnly}
        setShowLiveOnly={setShowLiveOnly}
        onOpenFAQ={() => setIsFaqModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenMyAccount={() => setIsMyAccountModalOpen(true)}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Main Container */}
      <main className="w-full px-4 md:px-8 pt-2 md:pt-3 pb-2 flex-1">

        {/* ------------------- WHY CHOOSE SABOR DE BET SECTION ------------------- */}
        {activeTab === 'home' && (
          <div className="select-none">
            <section className="w-full mt-2 mb-8 pb-8 border-b border-slate-900/60" id="por-que-escolher-sabor-de-bet">
            <h2 className="text-xl md:text-3xl font-black font-sans text-center text-slate-100 tracking-tight mb-8">
              Por que escolher <span className="text-[#feb916] bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Sabor de bet</span>?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Sem Risco Financeiro */}
              <div className="bg-slate-900/40 border-2 border-slate-800/50 rounded-2xl p-6 text-center flex flex-col items-center justify-between group hover:border-emerald-500/20 hover:bg-slate-900/60 transition-all duration-300 shadow-xl" id="feature-risk-free">
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition duration-300">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-sans font-extrabold text-slate-100 uppercase tracking-wider">Sem Risco Financeiro</h3>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed max-w-[210px] mx-auto">
                    Aposte com coins, sem nenhum risco de perda financeira real.
                  </p>
                </div>
              </div>

              {/* Card 2: Acumule Coins */}
              <div className="bg-slate-900/40 border-2 border-slate-800/50 rounded-2xl p-6 text-center flex flex-col items-center justify-between group hover:border-indigo-500/20 hover:bg-slate-900/60 transition-all duration-300 shadow-xl" id="feature-accumulate-coins">
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition duration-300">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-sans font-extrabold text-slate-100 uppercase tracking-wider">Acumule Coins</h3>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed max-w-[210px] mx-auto">
                    Faça login diariamente, assista anúncios e aposte para aumentar seus coins. Quanto mais acumular, melhores gift cards você poderá resgatar.
                  </p>
                </div>
              </div>

              {/* Card 3: Comunidade Ativa */}
              <div className="bg-slate-900/40 border-2 border-slate-800/50 rounded-2xl p-6 text-center flex flex-col items-center justify-between group hover:border-yellow-500/20 hover:bg-slate-900/60 transition-all duration-300 shadow-xl" id="feature-active-community">
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 rounded-xl bg-[#feb916]/10 border-2 border-[#feb916]/20 flex items-center justify-center text-[#feb916] mx-auto shadow-lg shadow-[#feb916]/10 group-hover:scale-110 transition duration-300">
                    <Users className="w-5 h-5 text-[#feb916]" />
                  </div>
                  <h3 className="text-sm font-sans font-extrabold text-slate-100 uppercase tracking-wider">Comunidade Ativa</h3>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed max-w-[210px] mx-auto">
                    Os 10 primeiros do ranking no último dia do mês ganham gift cards gratuitos, sem perder seus coins. Vai ficar de fora?
                  </p>
                </div>
              </div>

              {/* Card 4: Prêmios Reais */}
              <div className="bg-slate-900/40 border-2 border-slate-800/50 rounded-2xl p-6 text-center flex flex-col items-center justify-between group hover:border-[#feb916]/20 hover:bg-slate-900/60 transition-all duration-300 shadow-xl" id="feature-real-rewards">
                <div className="space-y-4 w-full">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center text-amber-550 mx-auto shadow-lg shadow-amber-500/10 group-hover:scale-110 transition duration-300">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-sans font-extrabold text-slate-100 uppercase tracking-wider">Prêmios Reais</h3>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed max-w-[210px] mx-auto">
                    Resgate gift cards de suas platforms favoritas.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Section: Resgate Gift Cards */}
          <div className="mt-4 mb-8 space-y-6" id="resgate-giftcards-section">
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight">
                Resgate Gift Cards
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed max-w-lg mx-auto">
                Escolha entre as plataformas mais populares e resgate seus coins por créditos reais
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 max-w-6xl mx-auto w-full">
              <BrandLogoCard
                name="Google Play"
                logoUrl="/src/assets/images/google-play.png"
                onClick={() => handleBrandCardClick('google-play-30')}
                fallback={
                  <svg viewBox="0 0 24 24" className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.25 1.75V22.25L14.75 12L3.25 1.75Z" fill="#00E676" />
                    <path d="M3.25 1.75L14.75 12L18.25 10L4.25 1.25C3.75 0.95 3.25 1.25 3.25 1.75Z" fill="#00F0FF" />
                    <path d="M3.25 22.25L14.75 12L18.25 14L4.25 22.75C3.75 23.05 3.25 22.75 3.25 22.25Z" fill="#FF3A44" />
                    <path d="M14.75 12L18.25 10L20.75 11.5C21.25 11.8 21.25 12.2 20.75 12.5L18.25 14L14.75 12Z" fill="#FFEB3B" />
                  </svg>
                }
              />
              <BrandLogoCard
                name="iFood"
                logoUrl="/src/assets/images/ifood.png"
                onClick={() => handleBrandCardClick('ifood-50')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-16 h-6" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100" height="35" rx="8" fill="#ea1d2c" />
                    <text x="50" y="24" fill="white" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5" textAnchor="middle">iFood</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Uber"
                logoUrl="/src/assets/images/uber.png"
                onClick={() => handleBrandCardClick('uber-50')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-16 h-6" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100" height="35" rx="8" fill="black" stroke="#222" strokeWidth="1" />
                    <text x="50" y="23" fill="white" fontSize="14" fontWeight="900" letterSpacing="0.8" textAnchor="middle" fontFamily="sans-serif">UBER</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="99"
                logoUrl="/src/assets/images/99.png"
                onClick={() => handleBrandCardClick('99-30')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-14 h-6" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100" height="35" rx="10" fill="#ffdd00" />
                    <text x="50" y="25" fill="black" fontSize="18" fontWeight="950" letterSpacing="-0.5" textAnchor="middle" fontFamily="sans-serif">99</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Netflix"
                logoUrl="/src/assets/images/netflix.png"
                onClick={() => handleBrandCardClick('netflix-50')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <text x="50" y="24" fill="#E50914" fontSize="14" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.5" textAnchor="middle">NETFLIX</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Steam"
                logoUrl="/src/assets/images/steam.png"
                onClick={() => handleBrandCardClick('steam-50')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100" height="35" rx="8" fill="#171a21" />
                    <text x="50" y="23" fill="#66c0f4" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5" textAnchor="middle">STEAM</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="99Food"
                logoUrl="/src/assets/images/99food.png"
                onClick={() => handleBrandCardClick('99food-50')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100" height="35" rx="8" fill="#ff7a00" />
                    <text x="50" y="23" fill="white" fontSize="12" fontWeight="950" fontFamily="sans-serif" letterSpacing="-0.3" textAnchor="middle">99 Food</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Xbox"
                logoUrl="/src/assets/images/xbox.png"
                onClick={() => handleBrandCardClick('xbox-ultimate')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <text x="50" y="23" fill="#107c10" fontSize="13" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.5" textAnchor="middle">XBOX</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Spotify"
                logoUrl="/src/assets/images/spotify.png"
                onClick={() => handleBrandCardClick('spotify-premium')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-20 h-7" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="17" r="11" fill="#1ED760" />
                    <path d="M20.5 14.2c-1.3-.8-3.4-1.1-4.9-.6-.2.05-.35.25-.3.45s.25.35.45.3c1.3-.4 3.2-.2 4.3.5.15.1.35 0 .4-.15.05-.15 0-.35-.15-.45zm.8 1.5c-.15.25-.45.3-.7.15-1.5-1-3.8-1.2-5.5-.6-.25.1-.5 0-.6-.25s0-.5.25-.6c2-1 4.6-.7 6.3.5.25.1.3.45.15.7zm-1.3 1.6c-.1.15-.3.2-.45.1-1.3-.8-2.9-1-4.9-.5-.15.05-.3-.05-.35-.2s.05-.3.2-.35c2.1-.5 3.9-.3 5.3.6.15.1.2.3.1.45z" fill="black" />
                    <text x="60" y="23" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Spotify</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Airbnb"
                logoUrl="/src/assets/images/airbnb.png"
                onClick={() => handleBrandCardClick('airbnb-150')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <text x="50" y="24" fill="#FF5A5F" fontSize="14" fontWeight="950" fontFamily="sans-serif" letterSpacing="-0.3" textAnchor="middle">Airbnb</text>
                  </svg>
                }
              />
              <BrandLogoCard
                name="Amazon"
                logoUrl="/src/assets/images/amazon.png"
                onClick={() => handleBrandCardClick('amazon-100')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <text x="50" y="20" fill="white" fontSize="14" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">amazon</text>
                    <path d="M35 24 Q50 28 65 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
              />
              <BrandLogoCard
                name="Apple"
                logoUrl="/src/assets/images/apple.png"
                onClick={() => handleBrandCardClick('apple-50')}
                fallback={
                  <svg viewBox="0 0 100 35" className="w-18 h-6" xmlns="http://www.w3.org/2000/svg">
                    <text x="50" y="23" fill="#ffffff" fontSize="13" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.8" textAnchor="middle">APPLE</text>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Banner: Pronto para começar? */}
          <div className="mt-8 mb-12 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-850 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl" id="start-banner-container">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#feb916]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight">
                Pronto para começar?
              </h2>
              <p className="text-xs md:text-sm text-slate-350 font-sans leading-relaxed max-w-lg mx-auto">
                Junte-se a milhares de jogadores que já estão aproveitando a experiência de apostas sem risco.
              </p>
              <div className="pt-3">
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-8 py-3 bg-[#d99708] hover:bg-[#feb916] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20"
                  >
                    Criar Conta Agora
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs font-mono text-emerald-400">
                    <span>✨ Você já está conectado como <strong className="text-white font-bold">{loggedInUser}</strong>!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Workspace Display Grid */}
        {activeTab !== 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="dashboard-layout-slots">
          
          {/* LEFT & CENTER AREAS WRAPPED TOGETHER to allow the right side bar to stretch up alongside them */}
          <div className={`${['sports', 'leaderboard', 'rewards'].includes(activeTab) ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-4`} id="left-main-area">
            
            {/* ----------------- SEARCH BAR & HAMBURGER SYSTEM ----------------- */}
            {/* Placed here just below the header as requested */}
            {activeTab !== 'rewards' && activeTab !== 'leaderboard' && (
              <div className="bg-transparent border-none p-0 space-y-2 relative" id="search-nav-container">
                <div className="flex items-center gap-3">
                  
                  {/* Real-time search inputs */}
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Search className="w-4 h-4 text-emerald-400" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Pesquise por times, esportes ou competições (ex: Flamengo, Real Madrid, Lakers, FURIA)..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-16 text-xs font-sans text-white placeholder-slate-500 outline-none transition"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white text-xs font-mono font-bold"
                      >
                        Limpar
                      </button>
                    )}
                  </div>

                  {/* As requested: "no lado direito coloca um botão buscar" */}
                  <button
                    onClick={() => {
                      handleSearchChange(searchTerm);
                    }}
                    className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:text-slate-900 font-sans font-bold text-xs rounded-xl transition cursor-pointer shrink-0 flex items-center select-none"
                  >
                    <span>Buscar</span>
                  </button>

                </div>


              </div>
            )}

            {/* Content sub-grid (AdSense + activeTab main column) */}
            <div className={`grid grid-cols-1 ${showLeftAds ? 'lg:grid-cols-9' : 'lg:grid-cols-12'} gap-6`} id="inner-content-slots">
              
              {/* LEFT SIDE: GOOGLE ADSENSE GIANT INTEGRATED SKYSCRAPER ("ocupa isso todo com um anúncio dos dois lados") */}
              {showLeftAds && (
                <div className="hidden lg:flex lg:col-span-2 flex-col gap-4 select-none" id="left-adsense-column-giant">
                  
                  {/* Banner 1: Superior */}
                  <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center min-h-[500px] relative overflow-hidden group shadow-2xl" id="adsense-card-placeholder-left-giant">
                    {/* Subtle decorative grid/lights representing a giant premium banner spot */}
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-yellow-500/2 pointer-events-none group-hover:from-yellow-500/8 transition duration-500" />
                    
                    {/* Top identifier */}
                    <div className="w-full space-y-3 pt-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto animate-pulse shadow-lg shadow-yellow-500/10">
                        <span className="text-[11px] uppercase font-mono font-black tracking-wider">Ad</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Lateral Alta</span>
                        <div className="text-[9px] font-mono text-slate-550 border border-slate-800 rounded-md px-1 py-0.5 inline-block bg-slate-950/80">
                          LATERAL ESQUERDA SUPERIOR
                        </div>
                      </div>
                    </div>

                    {/* Mid illustrative placeholder graphics representing a giant layout */}
                    <div className="w-full py-6 relative z-10 space-y-4">
                      <div className="w-3/4 h-[1px] bg-slate-800 mx-auto" />
                      <div className="text-slate-400 font-sans text-xs font-semibold leading-relaxed px-1">
                        Esta área lateral contém o banner superior de publicidade vertical.
                      </div>
                      <div className="w-10 h-10 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center mx-auto text-slate-600 font-mono text-xs font-bold leading-none">
                        H1
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Formato recomendado:<br />
                        <strong className="text-slate-400 block font-bold mt-0.5">160x600 px / Skyscraper</strong>
                      </p>
                      <div className="w-3/4 h-[1px] bg-slate-800 mx-auto" />
                    </div>

                    {/* Bottom indicator */}
                    <div className="w-full pb-4 relative z-10 space-y-2">
                      <div className="bg-slate-950/90 py-2.5 px-3 rounded-xl border border-slate-850 shadow-inner">
                        <code className="text-[9px] font-mono text-slate-550 block truncate">{"<!-- Code Left-Giant-Top -->"}</code>
                      </div>
                      <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest">Sabor de Bet Ads</span>
                    </div>
                  </div>

                  {/* Banner 2: Inferior */}
                  <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center min-h-[500px] relative overflow-hidden group shadow-2xl" id="adsense-card-placeholder-left-giant-2">
                    {/* Subtle decorative grid/lights representing a giant premium banner spot */}
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-emerald-500/2 pointer-events-none group-hover:from-emerald-500/8 transition duration-500" />
                    
                    {/* Top identifier */}
                    <div className="w-full space-y-3 pt-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-pulse shadow-lg shadow-emerald-500/10">
                        <span className="text-[11px] uppercase font-mono font-black tracking-wider">Ad</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Lateral Baixa</span>
                        <div className="text-[9px] font-mono text-slate-550 border border-slate-800 rounded-md px-1 py-0.5 inline-block bg-slate-950/80">
                          LATERAL ESQUERDA INFERIOR
                        </div>
                      </div>
                    </div>

                    {/* Mid illustrative placeholder graphics representing a giant layout */}
                    <div className="w-full py-6 relative z-10 space-y-4">
                      <div className="w-3/4 h-[1px] bg-slate-800 mx-auto" />
                      <div className="text-slate-400 font-sans text-xs font-semibold leading-relaxed px-1">
                        Esta área lateral contém o segundo banner de publicidade vertical.
                      </div>
                      <div className="w-10 h-10 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center mx-auto text-slate-600 font-mono text-xs font-bold leading-none">
                        H2
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Formato recomendado:<br />
                        <strong className="text-slate-400 block font-bold mt-0.5">160x600 px / Skyscraper</strong>
                      </p>
                      <div className="w-3/4 h-[1px] bg-slate-800 mx-auto" />
                    </div>

                    {/* Bottom indicator */}
                    <div className="w-full pb-4 relative z-10 space-y-2">
                      <div className="bg-slate-950/90 py-2.5 px-3 rounded-xl border border-slate-850 shadow-inner">
                        <code className="text-[9px] font-mono text-slate-550 block truncate">{"<!-- Code Left-Giant-Bottom -->"}</code>
                      </div>
                      <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest">Sabor de Bet Ads</span>
                    </div>
                  </div>

                  {/* Banner 3: Extra Inferior (Only shown on Rewards page) */}
                  {activeTab === 'rewards' && (
                    <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center min-h-[500px] relative overflow-hidden group shadow-2xl" id="adsense-card-placeholder-left-giant-3">
                      {/* Subtle decorative grid/lights representing a giant premium banner spot */}
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-indigo-500/2 pointer-events-none group-hover:from-indigo-500/8 transition duration-500" />
                      
                      {/* Top identifier */}
                      <div className="w-full space-y-3 pt-4 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto animate-pulse shadow-lg shadow-indigo-500/10">
                          <span className="text-[11px] uppercase font-mono font-black tracking-wider">Ad</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Lateral Extra</span>
                          <div className="text-[9px] font-mono text-slate-550 border border-slate-800 rounded-md px-1 py-0.5 inline-block bg-slate-950/80">
                            LATERAL ESQUERDA EXTRA
                          </div>
                        </div>
                      </div>

                      {/* Mid illustrative placeholder graphics representing a giant layout */}
                      <div className="w-full py-6 relative z-10 space-y-4">
                        <div className="w-3/4 h-[1px] bg-slate-800 mx-auto" />
                        <div className="text-slate-400 font-sans text-xs font-semibold leading-relaxed px-1">
                          Esta área lateral contém o terceiro banner de publicidade vertical.
                        </div>
                        <div className="w-10 h-10 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center mx-auto text-slate-600 font-mono text-xs font-bold leading-none">
                          H3
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Formato recomendado:<br />
                          <strong className="text-slate-400 block font-bold mt-0.5">160x600 px / Skyscraper</strong>
                        </p>
                        <div className="w-3/4 h-[1px] bg-slate-800 mx-auto" />
                      </div>

                      {/* Bottom indicator */}
                      <div className="w-full pb-4 relative z-10 space-y-2">
                        <div className="bg-slate-950/90 py-2.5 px-3 rounded-xl border border-slate-850 shadow-inner">
                          <code className="text-[9px] font-mono text-slate-550 block truncate">{"<!-- Code Left-Giant-Extra -->"}</code>
                        </div>
                        <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest">Sabor de Bet Ads</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Main workspace section columns */}
              <div className={`${
                ['sports', 'leaderboard', 'rewards'].includes(activeTab)
                  ? showLeftAds
                    ? 'lg:col-span-7'
                    : 'lg:col-span-9'
                  : 'lg:col-span-12'
              } space-y-6`}>
            
            {activeTab === 'sports' && (
              <div className="space-y-4">
                {searchTerm && (
                  <div className="px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded-xl flex items-center justify-between">
                    <span>Resultados filtrados para: <strong className="text-white">"{searchTerm}"</strong></span>
                    <button onClick={() => setSearchTerm('')} className="text-[10px] text-emerald-400 hover:underline">Limpar Filtro</button>
                  </div>
                )}
                
                <SportsBook
                  matches={matches.filter(match => {
                    if (showLiveOnly && match.status !== 'live') return false;
                    if (!searchTerm) return true;
                    const cleanTerm = searchTerm.toLowerCase();
                    return (
                      match.homeTeam.toLowerCase().includes(cleanTerm) ||
                      match.awayTeam.toLowerCase().includes(cleanTerm) ||
                      match.sport.toLowerCase().includes(cleanTerm) ||
                      match.league.toLowerCase().includes(cleanTerm)
                    );
                  })}
                  setMatches={setMatches}
                  activeSelections={activeSelections}
                  onToggleSelection={handleToggleSelection}
                />
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-8 animate-fade-in" id="rewards-unified-view">
                {/* Section 1: Interactive Claim Coins */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white font-sans tracking-tight">
                      Resgate Coins
                    </h2>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Fidelidade diária de login e tarefas de engajamento para acumular moedas virtuais.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     {/* Recompensa de Login Diário */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-extrabold">📅 Recompensa de Login Diário (Até 30 Dias)</h4>
                          {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8.5px] font-mono text-emerald-400">Streak: Dia {dailyStreak}/30</span>
                              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8.5px] font-mono text-emerald-400">Ativo</span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700/60 rounded-full text-[8.5px] font-mono text-slate-400">Desativado</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Resgate moedas uma vez por dia apenas por acessar o Simulador Sabor de Bet. Complete a trilha de 30 dias para acumulados exponenciais!
                        </p>
                      </div>

                      {/* Days progress row */}
                      <div className="grid grid-cols-5 gap-1.5 bg-slate-950/80 p-2 rounded-xl border border-slate-900 max-h-[300px] overflow-y-auto">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                          const todayStr = new Date().toLocaleDateString('pt-BR');
                          const isClaimedToday = lastDailyClaim === todayStr;
                          const isCompleted = isLoggedIn && (isClaimedToday ? day <= dailyStreak : day < dailyStreak);
                          const isCurrentActive = isLoggedIn && (isClaimedToday ? false : day === dailyStreak);
                          const rewardVal = getDailyReward(day);
                          return (
                            <div 
                              key={day} 
                              className={`flex flex-col items-center justify-center py-1 rounded-lg border text-center transition ${
                                !isLoggedIn
                                  ? 'bg-slate-900/40 border-slate-900/50 text-slate-600 opacity-40'
                                  : isCurrentActive 
                                    ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.03]' 
                                    : isCompleted
                                      ? 'bg-emerald-950/10 border-emerald-950/30 text-emerald-600/80 line-through'
                                      : 'bg-slate-900/60 border-slate-850/60 text-slate-500'
                              }`}
                            >
                              <span className="text-[7px] font-mono uppercase tracking-tight opacity-75">Dia {day}</span>
                              <span className={`text-[9px] font-extrabold leading-none ${isCurrentActive ? 'text-[#feb916]' : ''}`}>+{rewardVal}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        {!isLoggedIn ? (
                          <button 
                            onClick={() => {
                              setAuthMode('register');
                              setIsAuthModalOpen(true);
                            }}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            🔑 Criar conta para começar
                          </button>
                        ) : lastDailyClaim === new Date().toLocaleDateString('pt-BR') ? (
                          <button 
                            disabled
                            className="w-full py-2.5 bg-slate-950 border border-slate-850 text-slate-500 text-xs font-black rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            ✓ Já resgatado hoje
                          </button>
                        ) : (
                          <button 
                            onClick={handleClaimDailyReward}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                          >
                            Coletar Recompensa Diária
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ganhar com Anúncios */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-extrabold">📺 Assista Anúncios</h4>
                          {isLoggedIn ? (
                            <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[8.5px] font-mono text-indigo-400">
                              Fase: {adsWatched}/3 hoje
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700/60 rounded-full text-[8.5px] font-mono text-slate-400">Desativado</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Assista anúncios demonstrativos rápidos para acumular moedas adicionas de imediato!
                        </p>
                      </div>

                      {/* Display Ad reward tiers */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* 1 Ad card */}
                        <div className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1.5 transition ${
                          !isLoggedIn
                            ? 'bg-slate-900/40 border-slate-900/50 text-slate-600 opacity-40'
                            : claimedAdRewards.includes(1) 
                              ? 'bg-slate-950/60 border-slate-900 opacity-60' 
                              : adsWatched >= 1 
                                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 animate-pulse' 
                                : 'bg-slate-950 border-slate-850'
                        }`}>
                          <div className="text-center leading-tight">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">1 Anúncio</span>
                            <span className="text-[11px] font-bold text-amber-400">+10 Coins</span>
                          </div>
                          
                          {!isLoggedIn ? (
                            <span className="text-[8.5px] font-medium text-slate-600 block text-center bg-slate-900/20 py-1 rounded">Bloqueado 🔒</span>
                          ) : claimedAdRewards.includes(1) ? (
                            <span className="text-[8.5px] font-bold text-slate-500 block text-center bg-slate-900 py-1 rounded">Coletado</span>
                          ) : adsWatched >= 1 ? (
                            <button 
                              onClick={() => handleClaimAdReward(1, 10)}
                              className="text-[8.5px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 py-1 rounded tracking-tight text-center cursor-pointer block"
                            >
                              Resgatar
                            </button>
                          ) : (
                            <span className="text-[8.5px] font-medium text-slate-500 block text-center bg-slate-900 py-1 rounded">Bloqueado 🔒</span>
                          )}
                        </div>

                        {/* 2 Ads card */}
                        <div className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1.5 transition ${
                          !isLoggedIn
                            ? 'bg-slate-900/40 border-slate-900/50 text-slate-600 opacity-40'
                            : claimedAdRewards.includes(2) 
                              ? 'bg-slate-950/60 border-slate-900 opacity-60' 
                              : adsWatched >= 2 
                                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 animate-pulse' 
                                : 'bg-slate-950 border-slate-850'
                        }`}>
                          <div className="text-center leading-tight">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">2 Anúncios</span>
                            <span className="text-[11px] font-bold text-amber-400">+30 Coins</span>
                          </div>
                          
                          {!isLoggedIn ? (
                            <span className="text-[8.5px] font-medium text-slate-600 block text-center bg-slate-900/20 py-1 rounded">Bloqueado 🔒</span>
                          ) : claimedAdRewards.includes(2) ? (
                            <span className="text-[8.5px] font-bold text-slate-500 block text-center bg-slate-900 py-1 rounded">Coletado</span>
                          ) : adsWatched >= 2 ? (
                            <button 
                              onClick={() => handleClaimAdReward(2, 30)}
                              className="text-[8.5px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 py-1 rounded tracking-tight text-center cursor-pointer block"
                            >
                              Resgatar
                            </button>
                          ) : (
                            <span className="text-[8.5px] font-medium text-slate-500 block text-center bg-slate-900 py-1 rounded">Bloqueado 🔒</span>
                          )}
                        </div>

                        {/* 3 Ads card */}
                        <div className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1.5 transition ${
                          !isLoggedIn
                            ? 'bg-slate-900/40 border-slate-900/50 text-slate-600 opacity-40'
                            : claimedAdRewards.includes(3) 
                              ? 'bg-slate-950/60 border-slate-900 opacity-60' 
                              : adsWatched >= 3 
                                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 animate-pulse' 
                                : 'bg-slate-950 border-slate-850'
                        }`}>
                          <div className="text-center leading-tight">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">3 Anúncios</span>
                            <span className="text-[11px] font-bold text-amber-400">+50 Coins</span>
                          </div>
                          
                          {!isLoggedIn ? (
                            <span className="text-[8.5px] font-medium text-slate-600 block text-center bg-slate-900/20 py-1 rounded">Bloqueado 🔒</span>
                          ) : claimedAdRewards.includes(3) ? (
                            <span className="text-[8.5px] font-bold text-slate-500 block text-center bg-slate-900 py-1 rounded">Coletado</span>
                          ) : adsWatched >= 3 ? (
                            <button 
                              onClick={() => handleClaimAdReward(3, 50)}
                              className="text-[8.5px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 py-1 rounded tracking-tight text-center cursor-pointer block"
                            >
                              Resgatar
                            </button>
                          ) : (
                            <span className="text-[8.5px] font-medium text-slate-500 block text-center bg-slate-900 py-1 rounded">Bloqueado 🔒</span>
                          )}
                        </div>
                      </div>

                      <div>
                        {!isLoggedIn ? (
                          <button 
                            onClick={() => {
                              setAuthMode('register');
                              setIsAuthModalOpen(true);
                            }}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            🔑 Criar conta para começar
                          </button>
                        ) : isWatchingAd ? (
                          <div className="w-full py-2 bg-indigo-950/80 border border-indigo-900/50 text-indigo-400 text-xs font-mono font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping inline-block" />
                            Assistindo anúncio... ({adCountdown}s)
                          </div>
                        ) : adsWatched >= 3 ? (
                          <button 
                            disabled
                            className="w-full py-2.5 bg-slate-950 border border-slate-850 text-slate-500 text-xs font-mono rounded-xl cursor-not-allowed flex items-center justify-center"
                          >
                            ✓ Limite de anúncios atingido
                          </button>
                        ) : (
                          <button 
                            onClick={handleWatchAd}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
                          >
                            Assistir Anúncio (+1 Contagem)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-slate-900" />

                {/* Section 2: Store / Redeem Gift Cards */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-white font-sans tracking-tight">
                      Troque Coins por Gift Cards
                    </h2>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Opções para resgatar marcas nacionais de forma 100% simulada no painel! Clique para resgatar se tiver saldo.
                    </p>
                  </div>
                </div>

                {/* Gift Card Display Grid with dynamic centering support */}
                <div className="flex flex-wrap justify-center gap-4">
                  {GIFT_CARDS_DATA.map((card) => (
                    <div 
                      key={card.id} 
                      id={`reward-card-${card.id}`}
                      className={`bg-gradient-to-b ${card.gradFromTo} border border-slate-850/60 rounded-2xl p-4 flex flex-col justify-between ${card.borderHover} transition-all duration-500 transform group relative overflow-hidden text-center w-full sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)] shrink-0`}
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-white/10 transition" />
                      <div className="space-y-3">
                        <div className={`mx-auto w-14 h-14 rounded-xl bg-slate-950 flex items-center justify-center font-black text-[10px] border border-slate-800 tracking-wider select-none ${card.badgeColor}`}>
                          <GiftCardLogo logoUrl={card.logoUrl} badgeText={card.badgeText} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-white uppercase tracking-tight">{card.title}</h5>
                          <span className="text-[10px] text-slate-500">{card.subtitle}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-850/60 space-y-2">
                        <span className="text-xs font-mono font-bold text-amber-400 block">{formatCurrency(card.cost)} Coins</span>
                        <button 
                          onClick={() => handleRedeemGiftCard(card.service, card.cost)}
                          className={`w-full py-1.5 ${card.btnBg} font-sans font-bold text-[10px] rounded-lg transition overflow-hidden cursor-pointer shadow-lg`}
                        >
                          Resgatar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mines' && (
              <CasinoMines
                balance={balance}
                updateBalance={updateBalanceHandler}
                triggerQuest={handleQuestCompletionProgress}
                logBet={logBetResult}
              />
            )}

            {activeTab === 'crash' && (
              <CasinoCrash
                balance={balance}
                updateBalance={updateBalanceHandler}
                triggerQuest={handleQuestCompletionProgress}
                logBet={logBetResult}
              />
            )}

            {activeTab === 'double' && (
              <CasinoDouble
                balance={balance}
                updateBalance={updateBalanceHandler}
                triggerQuest={handleQuestCompletionProgress}
                logBet={logBetResult}
              />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard currentUsername={loggedInUser} userBalance={balance} registeredUsers={registeredUsers} />
            )}

            {activeTab === 'quests' && (
              <DailyQuests quests={quests} onClaimQuest={handleClaimQuestReward} />
            )}

            {activeTab === 'history' && (
              <BetHistory history={placedBets} />
            )}

          </div>

            </div> {/* Close #inner-content-slots */}
          </div> {/* Close #left-main-area */}

          {/* -------------------- RIGHT SIDE DIALOG COLUMN: BETTING SLIP & BET HISTORY -------------------- */}
          {/* As requested: "no lado direito o histórico de aposta." */}
          {['sports', 'leaderboard', 'rewards'].includes(activeTab) && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Betting Column container */}
              <div className="h-fit space-y-6 lg:sticky lg:top-24">
                
                {/* RIGHT SIDE: GOOGLE ADSENSE COMPACT TOP AD SPOT ("outro menor naquela parte de cima da direita") */}
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xl min-h-[90px] relative overflow-hidden group select-none" id="right-adsense-card-placeholder-top-compact">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-2.5 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0 text-[10px] uppercase font-mono font-black animate-pulse">
                      Ad
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-black tracking-wider text-[#feb916] uppercase block">AdSense Lateral Mini</span>
                      <p className="text-[10px] font-sans text-slate-400 leading-tight">Banner Compacto Superior</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pr-1 relative z-10 space-y-1">
                    <span className="text-[8px] font-mono font-black text-slate-500 block">300x100 px</span>
                    <span className="text-[7px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-1 py-0.5 rounded uppercase font-bold">Ativo</span>
                  </div>
                </div>

                <BettingSlip
                  selections={activeSelections}
                  balance={balance}
                  onRemoveSelection={handleRemoveSelection}
                  onClearAll={handleClearAllSelections}
                  onPlaceBet={handlePlaceSportsBetCoupon}
                />

                {/* Simulated Right-Side Bet History Widget */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3.5" id="right-side-history-card">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                      <History className="text-emerald-400 w-4 h-4 animate-bounce" /> Histórico de Apostas
                    </h3>
                    <span className="text-[10px] bg-slate-950 font-mono px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                      {placedBets.length} registradas
                    </span>
                  </div>

                  {/* Scrollable list content */}
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {placedBets.length === 0 ? (
                      <div className="py-12 px-4 text-center font-mono text-[11px] text-slate-500 border border-dashed border-slate-850 rounded-xl">
                        Nenhum bilhete registrado ainda. Toque em qualquer cotação de futebol ou basquete para começar!
                      </div>
                    ) : (
                      placedBets.map((bet) => {
                        const isWin = bet.status === 'won';
                        const isLost = bet.status === 'lost';
                        return (
                          <div 
                            key={bet.id} 
                            className="bg-slate-950 border border-slate-850/60 p-3 rounded-xl hover:border-slate-800 transition space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono font-bold tracking-tight bg-slate-900 border border-slate-800 text-slate-400 uppercase px-1.5 py-0.5 rounded">
                                {bet.type === 'sports' ? 'ESPORTES' : bet.type}
                              </span>
                              
                              {/* Status indicators */}
                              {bet.status === 'won' && (
                                <span className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono px-1.5 rounded-full font-bold">
                                  ✔ GANHA
                                </span>
                              )}
                              {bet.status === 'lost' && (
                                <span className="bg-red-950/40 border border-red-500/20 text-red-500 text-[9px] font-mono px-1.5 rounded-full font-bold">
                                  ✖ COBRADA
                                </span>
                              )}
                              {bet.status === 'pending' && (
                                <span className="bg-amber-950/40 border border-amber-500/20 text-amber-500 text-[9px] font-mono px-1.5 rounded-full font-bold animate-pulse">
                                  ⏱ AO VIVO
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] font-sans text-slate-300 leading-tight">
                              {bet.description}
                            </p>

                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-1.5">
                              <div>
                                <span className="text-[8px] text-slate-600 block">APOSTADO:</span>
                                <span>{formatCurrency(bet.amount)}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-slate-600 block">RETORNO:</span>
                                <span className={isWin ? 'text-emerald-400 font-extrabold' : isLost ? 'text-slate-600 line-through' : 'text-amber-400'}>
                                  {isWin ? `+${formatCurrency(bet.potentialPayout)}` : isLost ? '0' : 'Aguardando'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: GIANT GOOGLE ADSENSE INTEGRATED SKYSCRAPER ("ocupa isso todo com um anúncio dos dois lados") */}
                <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-xl min-h-[420px] relative overflow-hidden group select-none" id="right-adsense-card-placeholder-bottom-giant">
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none group-hover:from-yellow-500/8 transition duration-500" />
                  
                  {/* Top stamp */}
                  <div className="w-full space-y-2.5 pt-2 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto animate-pulse">
                      <span className="text-[10px] uppercase font-mono font-bold">Ad</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Lateral Alta</span>
                      <span className="text-[8px] font-mono text-slate-500 border border-slate-850 px-1.5 py-0.5 rounded bg-slate-950/80 inline-block uppercase font-bold mt-1">LATERAL DIREITA INTEGRAL</span>
                    </div>
                  </div>

                  {/* Mid illustration */}
                  <div className="w-full py-6 relative z-10 space-y-3">
                    <div className="w-2/3 h-[1px] bg-slate-800 mx-auto" />
                    <p className="text-[11px] font-sans text-slate-400 leading-relaxed px-2 font-medium">
                      Esta secção inferior direita está totalmente preenchida com esta publicidade estrutural completa.
                    </p>
                    <div className="text-[9px] font-mono text-slate-500">
                      Formato recomendado:<br />
                      <strong className="text-slate-400 block font-bold mt-0.5">300x600 px (Half-Page) ou responsivo</strong>
                    </div>
                    <div className="w-2/3 h-[1px] bg-slate-800 mx-auto" />
                  </div>

                  {/* Bottom tracking */}
                  <div className="w-full pb-2 relative z-10 space-y-2">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                      <code className="text-[8px] font-mono text-slate-600 block line-clamp-1">{"<!-- Code Right-Giant-Bottom -->"}</code>
                    </div>
                    <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest">Sabor de Bet Ads Engine</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          </div>
        )}





      </main>

      {/* GIFT CARD REDEEM SUCCESS POPUP WINDOW */}
      {redeemedCode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="giftcard-redeemed-modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border-2 border-emerald-500 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl relative overflow-hidden"
          >
            {/* Sparkles lights */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/35 flex items-center justify-center mx-auto text-3xl animate-bounce">
                🎉
              </div>
              <h3 className="text-xl font-sans font-black text-white tracking-tight">
                Gift Card Resgatado!
              </h3>
              <p className="text-xs text-slate-400">
                Parabéns pelas suas conquistas simulando apostas no <strong className="text-white">Sabor de Bet</strong>!
              </p>
            </div>

            {/* Fictional gift voucher */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative z-10 shadow-inner">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Vale Presente {redeemedService?.toUpperCase()}
              </span>
              <div className="py-2.5 px-4 bg-slate-900 border border-dashed border-slate-705 rounded-xl bg-slate-900">
                <span className="font-mono text-base font-black text-emerald-450 select-all tracking-wider text-emerald-400">
                  {redeemedCode}
                </span>
              </div>
              <span className="text-[9px] text-slate-650 block leading-tight font-mono text-slate-500">
                Copie o código simulado acima. Este voucher é educativo e fictício, gerado com êxito pelo sistema do Sabor de Bet.
              </span>
            </div>

            <div className="pt-2 relative z-10">
              <button 
                onClick={() => {
                  setRedeemedCode(null);
                  setRedeemedService(null);
                }}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black font-sans rounded-xl tracking-wide uppercase cursor-pointer transition shadow-md shadow-emerald-500/20"
              >
                Voltar à Diversão!
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------- INTERACTIVE SYSTEM DIALOGS & OVERLAYS ------------------- */}

      {/* 1. LOGIN / SIGN UP MODAL */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 bg-black/35 flex items-center justify-center p-4 z-50 animate-fade-in" 
          id="auth-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs cursor-pointer animate-fade-in"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title and subtitle are intentionally removed from BOTH modes as requested */}

            <form onSubmit={handleAuthSubmit} className="space-y-3 pt-4">
              {authMode === 'register' ? (
                <>
                  {/* Username (Register Mode only) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">Username</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: sabor_de_bet"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                    {/* Invalid Characters Warning list */}
                    {getInvalidCharactersInUsername(authUsername).length > 0 && (
                      <p className="text-red-500 text-[10px] text-left mt-1 font-semibold">
                        Nome de usuário inválido. Caracteres não permitidos encontrados: {getInvalidCharactersInUsername(authUsername).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Número de Telefone (Register Mode only, below Username) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">Número de Telefone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type="tel" 
                        placeholder="Ex: (86) 9 8888 9082"
                        value={authPhone}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setAuthPhone(formatted);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                    {/* Invalid pattern error */}
                    {authPhone.replace(/\D/g, '').length > 0 && authPhone.replace(/\D/g, '').length < 11 && (
                      <p className="text-red-500 text-[10px] text-left mt-1 font-semibold">
                        Número inválido.
                      </p>
                    )}
                  </div>

                  {/* E-mail (Register Mode) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">E-mail</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type="email" 
                        placeholder="Ex: seuemail@provedor.com"
                        value={authEmail}
                        onChange={(e) => {
                          setAuthEmail(e.target.value);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  {/* Criar Senha (Register Mode) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">Criar Senha</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type={showPassword ? "text" : "password"} 
                        placeholder="Digite sua senha"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Senha (Register Mode) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">Confirmar Senha</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Digite sua senha"
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Non-matching warning under confirm field */}
                    {authPassword !== authConfirmPassword && authConfirmPassword.length > 0 && (
                      <p className="text-red-500 text-[10px] text-left mt-1 font-semibold">
                        As senhas não correspondem
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* E-mail (Login Mode) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">Digite seu email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type="email" 
                        placeholder="Ex: seuemail@provedor.com"
                        value={authEmail}
                        onChange={(e) => {
                          setAuthEmail(e.target.value);
                          if (loginEmailError) setLoginEmailError('');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                    {loginEmailError && (
                      <p className="text-red-500 text-[10px] text-left mt-1 font-semibold">
                        O email ainda não está registrado.
                      </p>
                    )}
                  </div>

                  {/* Senha (Login Mode) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold text-left">Senha</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        required
                        type={showPassword ? "text" : "password"} 
                        placeholder="Digite sua senha"
                        value={authPassword}
                        onChange={(e) => {
                          setAuthPassword(e.target.value);
                          if (loginPasswordError) setLoginPasswordError('');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-xs text-white placeholder-slate-650 outline-none focus:border-emerald-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginPasswordError && authPassword.length > 0 && (
                      <p className="text-red-500 text-[10px] text-left mt-1 font-semibold">
                        Senha incorreta.
                      </p>
                    )}
                  </div>
                </>
              )}

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 mt-4"
              >
                {authMode === 'login' ? 'Preencher e Conectar' : 'Registrar-se e Entrar'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-850">
              {authMode === 'login' ? (
                <p className="text-[11px] text-slate-400">
                  Não possui cadastro?{' '}
                  <button 
                    onClick={() => { 
                      setAuthMode('register'); 
                      setAuthUsername('');
                      setAuthEmail('');
                      setAuthPhone('');
                      setAuthPassword('');
                      setAuthConfirmPassword('');
                      setLoginEmailError('');
                      setLoginPasswordError('');
                    }} 
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Registrar Conta Grátis
                  </button>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Já possui conta?{' '}
                  <button 
                    onClick={() => { 
                      setAuthMode('login'); 
                      setAuthUsername('');
                      setAuthEmail('');
                      setAuthPhone('');
                      setAuthPassword('');
                      setAuthConfirmPassword('');
                      setLoginEmailError('');
                      setLoginPasswordError('');
                    }} 
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Fazer Login
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. DISPATCHER: TECHNICAL SUPPORT MODAL */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="support-modal-overlay">
          <motion.div 
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-450 hover:text-white p-1 text-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <span className="text-indigo-400 font-sans text-lg">🎧</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Suporte Técnico Virtual</h3>
                <p className="text-[10px] text-indigo-400 font-mono">Simulador de Atendimento - Online 24/7</p>
              </div>
            </div>

            {/* Simulated Live scrollable messages ledger */}
            <div className="space-y-3 h-[240px] overflow-y-auto bg-slate-950 p-4 border border-slate-850 rounded-xl scrollbar-thin">
              {supportMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs font-sans mt-0.5 ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-mono text-slate-650 px-1 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendSupportMessage} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Qual sua dúvida sobre apostas fictícias hoje?"
                value={supportInput}
                onChange={(e) => setSupportInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
              />
              <button 
                type="submit"
                className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center cursor-pointer transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. CENTRAL FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="faq-modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsFaqModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
              <HelpCircle className="text-emerald-400 w-5 h-5" />
              <h3 className="text-base font-extrabold text-white">Central de Dúvidas / FAQ</h3>
            </div>

            {/* Rich faq accordion list */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl space-y-1">
                <h4 className="text-xs font-extrabold text-white font-sans">1. Este site realiza apostas reais?</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Não! O BetFree é em caráter puramente educativo e lúdico. Você joga fazendo palpites esportivos sem qualquer risco, utilizando a nossa moeda fictícia **FBF**.
                </p>
              </div>

              <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl space-y-1">
                <h4 className="text-xs font-extrabold text-white font-sans">2. Como funciona o Resgate de Falência?</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Ficou sem saldo por arriscar palpites com altas cotas? Se seu saldo cair abaixo de 10 FBF, um botão vermelho "Resgatar" aparecerá no cabeçalho liberando +200 FBF gratuitos.
                </p>
              </div>

              <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl space-y-1">
                <h4 className="text-xs font-extrabold text-white font-sans">3. As partidas ao vivo são atualizadas sozinhas?</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Sim! Nossos servidores fictícios rodam atualizações e gols a cada poucos segundos. Se seu bilhete bater o palpite, seus pontos são creditados automaticamente.
                </p>
              </div>

              <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl space-y-1">
                <h4 className="text-xs font-extrabold text-white font-sans">4. Posso resgatar bônus adicionais?</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Com certeza! Ao fazer login na plataforma diariamente ou de volta à conta, você ganha +50 Coins de bônus creditados diretamente no seu saldo em tempo real.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 4. CONFIGURAÇÕES MODAL */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="settings-modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="text-purple-400 w-5 h-5" />
              <h3 className="text-base font-extrabold text-white">Configurações do Simulador</h3>
            </div>

            <div className="space-y-4 py-1">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 font-sans block">Opções de Interface</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  O BetFree roda puramente no seu navegador usando LocalStorage estruturado.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Sons de Alertas</span>
                  <p className="text-[9px] text-slate-500">Alertar gols e vitórias de apostas</p>
                </div>
                <div className="w-8 h-4.5 bg-emerald-500 rounded-full cursor-pointer p-0.5 flex items-center justify-end">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-950" />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/80 space-y-2">
                <span className="text-xs font-bold text-rose-400 block pb-1 border-b border-slate-900">Área Perigosa</span>
                <p className="text-[10px] text-slate-550 leading-relaxed">
                  Deseja apagar todos os registros, históricos de double/crash e relatar saldo padrão?
                </p>
                <button 
                  onClick={handleSettingsReset}
                  className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold rounded-lg transition cursor-pointer"
                >
                  Limpar Dados do Painel
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-850">
              <button 
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Salvar e Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 5. MINHA CONTA MODAL */}
      {isMyAccountModalOpen && isLoggedIn && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="my-account-modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsMyAccountModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="text-emerald-400 w-5 h-5" />
              <h3 className="text-base font-extrabold text-white">Minha Conta</h3>
            </div>

            <div className="space-y-3.5 py-1 text-xs font-sans">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-450">Usuário</span>
                  <span className="font-extrabold text-white text-right">{loggedInUser}</span>
                </div>
                {(() => {
                  const me = registeredUsers.find(u => u.username.toLowerCase() === loggedInUser.toLowerCase());
                  return (
                    <>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-450">E-mail</span>
                        <span className="font-bold text-slate-200 text-right truncate max-w-[170px]">
                          {me ? me.email : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-450">Telefone</span>
                        <span className="font-semibold text-slate-200 text-right">{me ? me.phone : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450">Nível</span>
                        <span className="font-bold px-1.5 py-0.5 rounded text-[10px] uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {balance >= 20000 ? '🏅 Diamante VIP' : balance >= 5000 ? '🥈 Ouro Pro' : '🥉 Bronze'}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-3.5 border border-slate-850 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] font-black uppercase">Saldo Coins</span>
                  <span className="block text-lg font-black text-emerald-400 tracking-tight">
                    {formatCurrency(balance)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-850">
              <button 
                onClick={() => setIsMyAccountModalOpen(false)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 6. SOBRE NÓS MODAL */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="about-us-modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
              <Info className="text-amber-400 w-5 h-5" />
              <h3 className="text-base font-extrabold text-white">Sobre Nós</h3>
            </div>

            <div className="space-y-3 py-1 text-xs font-sans leading-relaxed text-slate-350">
              <p>
                O <span className="font-extrabold text-[#feb916]">Sabor de Bet</span> é um simulador de palpites esportivos e jogos de cassino lúdicos criado exclusivamente para entretenimento saudável.
              </p>
              <p>
                Utilizamos saldo interno fictício (<span className="text-emerald-400 font-bold">Coins</span>), permitindo que você aprenda, teste estratégias e dispute o topo do ranking de pontuações de forma 100% gratuita.
              </p>
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <span className="text-[#feb916]">🛡️</span>
                  <span>Risco Financeiro Zero</span>
                </div>
                <p className="text-[10px] text-slate-500 pl-4">
                  Não aceitamos depósitos e não realizamos pagamentos em dinheiro. Toda a nossa infraestrutura é baseada em diversão fictícia.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 text-center">
                <span>Dúvidas ou Feedback? ✉️ <strong>suporte@sabordebet.com</strong></span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-850">
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------- AUTHENTIC REGULATORY FOOTER (SABOR DE BET) ------------------- */}
      <footer className="w-full bg-slate-950/60 border-t border-slate-900 py-12 px-4 md:px-6 lg:px-8 mt-2 mb-6" id="sabor-de-bet-regulatory-footer">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE ADSENSE SPOT inside footer */}
          <div className="lg:col-span-3 flex flex-col gap-3" id="footer-left-adsense">
            <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center h-full min-h-[380px] relative overflow-hidden group shadow-2xl select-none" id="adsense-footer-left">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-yellow-500/2 pointer-events-none group-hover:from-yellow-500/8 transition duration-500" />
              
              <div className="w-full space-y-3 pt-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto animate-pulse shadow-lg shadow-yellow-500/10">
                  <span className="text-[10px] uppercase font-mono font-black tracking-wider">Ad</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Rodapé Esquerda</span>
                  <div className="text-[8px] font-mono text-slate-500 border border-slate-850 px-1.5 py-0.5 rounded bg-slate-950/80 inline-block uppercase font-bold">BANNER GIANT PREMIUM</div>
                </div>
              </div>

              <div className="w-full py-6 relative z-10 space-y-3">
                <div className="w-2/3 h-[1px] bg-slate-800 mx-auto" />
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed font-medium">
                  Espaço publicitário gigante integrado nas margens do rodapé regulamentar.
                </p>
                <p className="text-[9px] font-mono text-slate-500">
                  Formato recomendado:<br />
                  <strong className="text-slate-400 block font-bold mt-0.5">300x600 px (Half-Page)</strong>
                </p>
                <div className="w-2/3 h-[1px] bg-slate-800 mx-auto" />
              </div>

              <div className="w-full pb-3 relative z-10 space-y-2">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <code className="text-[8px] font-mono text-slate-600 block line-clamp-1">{"<!-- Code Footer-Left-Giant -->"}</code>
                </div>
                <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest">Sabor de Bet Ads</span>
              </div>
            </div>
          </div>

          {/* CENTRAL REGULATORY TEXT (STYLIZED LIKE PRO GAMBLING FOOTER) */}
          <div className="lg:col-span-6 space-y-5 text-left text-slate-500 text-[11px] font-sans" id="footer-center-content">
            
            {/* Logo and Brand slogan block */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tighter text-white font-sans uppercase">
                  Sabor <span className="text-emerald-400">de</span> Bet
                </span>
              </div>
              <p className="text-slate-400 font-bold text-[11px]">
                Apenas para fins de entretenimento, engajamento e recompensas reais.
              </p>
            </div>

            {/* Regulatory and legal statements */}
            <div className="space-y-3 leading-relaxed border-t border-slate-900 pt-3">
              <p className="text-slate-400 font-medium">
                <strong className="text-slate-200 block mb-1">Aviso importante</strong>
                No Sabor de Bet você aposta apenas com coins virtuais, sem qualquer envolvimento de dinheiro real. Isso significa que não há risco financeiro: toda a experiência é voltada para diversão, engajamento e recompensas. Seus coins acumulados podem ser trocados por benefícios reais, como gift cards e serviços do dia a dia, garantindo entretenimento seguro e útil.
              </p>

              <p className="text-slate-400 font-medium">
                <strong className="text-slate-200 block mb-1">Finalidade de uso</strong>
                A plataforma Sabor de Bet foi criada para oferecer uma experiência de gamificação em recompensas, onde diversão e utilidade se encontram. O objetivo é estimular o engajamento por meio de coins virtuais, que podem ser acumulados e trocados por benefícios reais, com uma dinâmica voltada para entretenimento seguro, sem risco financeiro, e destinada a maiores de 18 anos que desejam transformar seu tempo de interação em conquistas práticas.
              </p>

              <div className="py-2 px-3 bg-slate-950/60 border border-slate-900 rounded-xl flex items-center justify-between font-mono text-[10px] tracking-wide text-slate-500 select-none">
                <span>© 2026 Sabor de Bet. Todos os direitos reservados.</span>
              </div>
            </div>

            {/* Cookies disclaimer policy warning block */}
            <div className="text-[10.5px] leading-relaxed text-slate-500 space-y-1 bg-slate-900/10 p-4 rounded-xl border border-slate-900">
              <p>
                Ao acessar, continuar a utilizar ou navegar no Sabor de Bet, você aceita o uso de cookies de navegação para melhorar sua experiência. Utilizamos apenas cookies que garantem que seus coins virtuais, progresso e recompensas sejam preservados entre sessões, sem comprometer sua privacidade. Por favor, consulte nossa Política de Cookies para entender como utilizamos essas informações e como desativá-las ou gerenciá-las, caso prefira.
              </p>
            </div>

            <div className="text-[9.5px] text-slate-600">
              Este site está protegido por sistemas de segurança e pelo reCAPTCHA. A Política de Privacidade e os Termos de Serviço do Google se aplicam a todo o tráfego da página.
            </div>

          </div>

          {/* RIGHT SIDE ADSENSE SPOT inside footer */}
          <div className="lg:col-span-3 flex flex-col gap-3" id="footer-right-adsense">
            <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center h-full min-h-[380px] relative overflow-hidden group shadow-2xl select-none" id="adsense-footer-right">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-yellow-500/2 pointer-events-none group-hover:from-yellow-500/8 transition duration-500" />
              
              <div className="w-full space-y-3 pt-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto animate-pulse shadow-lg shadow-yellow-500/10">
                  <span className="text-[10px] uppercase font-mono font-black tracking-wider">Ad</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#feb916] uppercase block">AdSense Rodapé Direita</span>
                  <div className="text-[8px] font-mono text-slate-500 border border-slate-850 px-1.5 py-0.5 rounded bg-slate-950/80 inline-block uppercase font-bold">BANNER GIANT PREMIUM</div>
                </div>
              </div>

              <div className="w-full py-6 relative z-10 space-y-3">
                <div className="w-2/3 h-[1px] bg-slate-800 mx-auto" />
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed font-medium">
                  Espaço publicitário gigante integrado nas margens do rodapé regulamentar.
                </p>
                <p className="text-[9px] font-mono text-slate-500">
                  Formato recomendado:<br />
                  <strong className="text-slate-400 block font-bold mt-0.5">300x600 px (Half-Page)</strong>
                </p>
                <div className="w-2/3 h-[1px] bg-slate-800 mx-auto" />
              </div>

              <div className="w-full pb-3 relative z-10 space-y-2">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <code className="text-[8px] font-mono text-slate-600 block line-clamp-1">{"<!-- Code Footer-Right-Giant -->"}</code>
                </div>
                <span className="text-[8px] font-mono text-slate-600 block uppercase tracking-widest">Sabor de Bet Ads</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';
import { Coins, Sparkles, Zap, ShieldAlert, Heart, LogIn, UserPlus, LogOut, User, Menu, Settings, HelpCircle, MessageSquare, Info, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import logoUrl from '../assets/images/logo.png';

interface HeaderProps {
  balance: number;
  updateBalance: (amount: number) => void;
  username: string;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  showLiveOnly?: boolean;
  setShowLiveOnly?: (show: boolean) => void;
  onOpenFAQ?: () => void;
  onOpenSettings?: () => void;
  onOpenSupport?: () => void;
  onOpenAbout?: () => void;
  onOpenMyAccount?: () => void;
  onDeleteAccount?: () => void;
}

export default function Header({ 
  balance, 
  updateBalance, 
  username,
  isLoggedIn,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  activeTab = 'home',
  setActiveTab,
  showLiveOnly = false,
  setShowLiveOnly,
  onOpenFAQ,
  onOpenSettings,
  onOpenSupport,
  onOpenAbout,
  onOpenMyAccount,
  onDeleteAccount
}: HeaderProps) {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const emergencyFaucet = () => {
    if (balance > 10) {
      alert("A caneca de resição só pode ser ativada caso seu saldo esteja quase zerado (< 10 Coins). Divirta-se!");
      return;
    }
    updateBalance(200);
    triggerFeedback("💚 Resgate de Falência ativado! Recebeu +200 Coins para continuar jogando.");
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-50 px-4 md:px-8 py-4" id="global-header">
      <div className="w-full flex items-center justify-between gap-4 relative">
        
        {/* Left Side: Hamburger Menu & Brand Logo - Increased size */}
        <div className="flex items-center gap-3 select-none" id="brand-logo-container">
          {isLoggedIn && (
            <div className="relative" id="hamburger-menu-wrapper">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -ml-2 bg-slate-850 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/30 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center"
                id="hamburger-menu-btn"
                title="Menu de Opções"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                    
                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-3 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 divide-y divide-slate-900"
                      id="hamburger-dropdown-menu"
                    >
                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onOpenMyAccount) onOpenMyAccount();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-emerald-400 rounded-lg flex items-center gap-2 transition cursor-pointer"
                        >
                          <User className="w-4 h-4 text-emerald-400" />
                          <span>Minha Conta</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onOpenSettings) onOpenSettings();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-purple-400 rounded-lg flex items-center gap-2 transition cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-purple-400" />
                          <span>Configurações</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onOpenFAQ) onOpenFAQ();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-blue-400 rounded-lg flex items-center gap-2 transition cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-blue-400" />
                          <span>FAQ / Dúvidas</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onOpenSupport) onOpenSupport();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-indigo-400 rounded-lg flex items-center gap-2 transition cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-indigo-400" />
                          <span>Suporte Técnico</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onOpenAbout) onOpenAbout();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-amber-400 rounded-lg flex items-center gap-2 transition cursor-pointer"
                        >
                          <Info className="w-4 h-4 text-amber-400" />
                          <span>Sobre Nós</span>
                        </button>
                      </div>

                      <div className="py-1 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onDeleteAccount) onDeleteAccount();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-450 hover:bg-rose-950/40 hover:text-rose-400 rounded-lg flex items-center gap-2 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          <span>Apagar Conta</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <img 
            src={logoUrl} 
            alt="Sabor de Bet" 
            className="h-12 md:h-16 w-auto object-contain transition-all duration-300 hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Center Navigation Menu */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 lg:gap-10 mx-auto select-none grow border-t border-slate-850 md:border-t-0 pt-2.5 md:pt-0 w-full md:w-auto" id="header-center-navigation">
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('home');
              if (setShowLiveOnly) setShowLiveOnly(false);
            }}
            className={`font-semibold text-xs sm:text-sm tracking-tight relative py-1 md:py-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'home'
                ? 'text-[#feb916]'
                : 'text-slate-300 hover:text-[#feb916]'
            }`}
          >
            Início
            {activeTab === 'home' && (
              <span className="absolute bottom-[-5px] md:bottom-[-17px] left-0 right-0 h-[3px] bg-[#feb916] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('sports');
              if (setShowLiveOnly) setShowLiveOnly(false);
            }}
            className={`font-bold text-xs sm:text-sm tracking-tight relative py-1 md:py-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'sports' && !showLiveOnly
                ? 'text-[#feb916]'
                : 'text-slate-300 hover:text-[#feb916]'
            }`}
          >
            Todos os Esportes
            {activeTab === 'sports' && !showLiveOnly && (
              <span className="absolute bottom-[-5px] md:bottom-[-17px] left-0 right-0 h-[3px] bg-[#feb916] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('sports');
              if (setShowLiveOnly) setShowLiveOnly(true);
            }}
            className={`font-semibold text-xs sm:text-sm tracking-tight relative py-1 md:py-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'sports' && showLiveOnly
                ? 'text-[#feb916]'
                : 'text-slate-300 hover:text-[#feb916]'
            }`}
          >
            Ao-Vivo
            {activeTab === 'sports' && showLiveOnly && (
              <span className="absolute bottom-[-5px] md:bottom-[-17px] left-0 right-0 h-[3px] bg-[#feb916] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('rewards');
            }}
            className={`font-semibold text-xs sm:text-sm tracking-tight relative py-1 md:py-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'rewards'
                ? 'text-[#feb916]'
                : 'text-slate-300 hover:text-[#feb916]'
            }`}
          >
            Recompensas
            {activeTab === 'rewards' && (
              <span className="absolute bottom-[-5px] md:bottom-[-17px] left-0 right-0 h-[3px] bg-[#feb916] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('leaderboard');
            }}
            className={`font-semibold text-xs sm:text-sm tracking-tight relative py-1 md:py-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'text-[#feb916]'
                : 'text-slate-300 hover:text-[#feb916]'
            }`}
          >
            Ranking
            {activeTab === 'leaderboard' && (
              <span className="absolute bottom-[-5px] md:bottom-[-17px] left-0 right-0 h-[3px] bg-[#feb916] rounded-full" />
            )}
          </button>
        </div>

        {/* Floating/Absolute Overlay Action Alerts feed */}
        <div className="absolute top-[85px] left-1/2 -translate-x-1/2 z-50 overflow-visible pointer-events-none">
          <AnimatePresence>
            {feedbackMsg && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: -10 }}
                className="bg-emerald-500 text-slate-950 text-xs font-bold font-sans py-2 px-4 rounded-full flex items-center gap-1.5 shadow-xl shadow-[#feb916]/10 pointer-events-auto border border-emerald-400"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0 animate-ping" />
                <span>{feedbackMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Info: balance, clocks & faucets or login triggers */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 px-2 sm:px-0 w-full sm:w-auto">

          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRegister}
                className="px-3.5 py-1.5 border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                id="header-register-btn"
              >
                <UserPlus className="w-3.5 h-3.5" /> Registrar-se
              </button>
              <button
                onClick={onOpenLogin}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition shadow-md shadow-emerald-500/10 cursor-pointer"
                id="header-login-btn"
              >
                <LogIn className="w-3.5 h-3.5" /> Entrar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
              {/* Profile badge */}
              <div className="px-2.5 py-1.5 bg-slate-850 border border-slate-800 text-slate-300 text-[11px] font-medium rounded-lg flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-200 max-w-[80px] truncate">{username}</span>
              </div>

              {/* Bankruptcy faucet trigger */}
              {balance <= 10 && (
                <button
                  onClick={emergencyFaucet}
                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 border border-rose-500/30 text-white font-mono text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-lg shadow-rose-600/20"
                >
                  <Heart className="w-3.5 h-3.5 text-white animate-bounce" /> Falência? Pedir Resgate
                </button>
              )}


              {/* Balance indicators */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 pl-3 pr-2 rounded-xl text-sm font-mono tracking-tight cursor-default select-none shrink-0">
                <span className="text-slate-500 text-[10px] uppercase font-bold">SALDO</span>
                <span className="text-emerald-400 font-extrabold text-base tracking-tighter">
                  {formatCurrency(balance)}
                </span>
                <div className="w-6.5 h-6.5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Compact quick logout */}
              <button
                onClick={onLogout}
                title="Sair da Conta"
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg transition shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}

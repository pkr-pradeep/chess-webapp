import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Gamepad2, 
  Search, 
  Puzzle, 
  Target, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Wifi, 
  WifiOff,
  Smartphone
} from 'lucide-react';
import { chessAudio } from '../utils/chessAudio';

interface HeaderProps {
  activeTab: 'play' | 'review' | 'puzzles' | 'plan' | 'dashboard';
  onSelectTab: (tab: 'play' | 'review' | 'puzzles' | 'plan' | 'dashboard') => void;
  onOpenPrivacy: () => void;
  onOpenInstallApk?: () => void;
  rating: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenPrivacy,
  onOpenInstallApk,
  rating,
}) => {
  const [isMuted, setIsMuted] = useState(!chessAudio.isSoundEnabled());
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    chessAudio.setSoundEnabled(!next);
  };

  const navItems: { id: 'play' | 'review' | 'puzzles' | 'plan' | 'dashboard'; label: string; icon: any }[] = [
    { id: 'play', label: 'Play & Coach', icon: Gamepad2 },
    { id: 'review', label: 'Game Review', icon: Search },
    { id: 'puzzles', label: 'Custom Puzzles', icon: Puzzle },
    { id: 'plan', label: 'Improvement Plan', icon: Target },
    { id: 'dashboard', label: 'Progress Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2">
                Chess Bot & Analyzer
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  GM Bot
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Real-time Blunder Detection • Rating: <strong className="text-amber-400 font-mono">{rating}</strong>
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenInstallApk}
              className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400"
              title="Get Android App / APK"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenPrivacy}
              className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
              title="Privacy settings"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Utility Controls */}
        <div className="hidden md:flex items-center gap-2.5 text-xs">
          {/* Install / APK Button */}
          <button
            id="btn-header-install-apk"
            onClick={onOpenInstallApk}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download APK or Install on Android"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Get APK</span>
          </button>

          {/* Online/Offline Badge */}
          <div 
            className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[11px] font-medium ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
            }`}
            title={isOnline ? 'Online: Hybrid AI + Local Engine active' : 'Offline: 100% Local Engine active'}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Hybrid AI' : 'Offline Mode'}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute chess sounds' : 'Mute chess sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Privacy Button */}
          <button
            onClick={onOpenPrivacy}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
            title="View Data Privacy Guarantee"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Private Storage</span>
          </button>
        </div>
      </div>
    </header>
  );
};

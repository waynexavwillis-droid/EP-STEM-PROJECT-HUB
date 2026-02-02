
import React from 'react';
import { Plus, MessageSquare, Home, LogOut, ShieldCheck, ClipboardList, Search } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (val: string) => void;
  onHome: () => void;
  onCreate: () => void;
  onCommunity: () => void;
  onSubmissions: () => void;
  onLogout: () => void;
  activeView: string;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, onHome, onCreate, onCommunity, onSubmissions, onLogout, activeView, user }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-slate-950 text-white sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center cursor-pointer" onClick={onHome}>
                <div className="flex items-baseline space-x-0.5">
                   <span className="text-[#f43f5e] font-black text-xl italic">S</span>
                   <span className="text-[#fbbf24] font-black text-xl italic">T</span>
                   <span className="text-[#10b981] font-black text-xl italic">E</span>
                   <span className="text-[#0ea5e9] font-black text-xl italic">M</span>
                </div>
                <span className="ml-2 text-[10px] font-black tracking-widest uppercase text-white/40 hidden sm:block">Academy</span>
              </div>

              <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest">
                <button onClick={onHome} className={`hover:text-yellow-400 transition-colors ${activeView === 'grid' ? 'text-yellow-400' : 'text-white/60'}`}>Discover</button>
                <button onClick={onCommunity} className={`hover:text-yellow-400 transition-colors ${activeView === 'community' ? 'text-yellow-400' : 'text-white/60'}`}>Community</button>
                <button onClick={onSubmissions} className={`hover:text-yellow-400 transition-colors ${activeView === 'submissions' ? 'text-yellow-400' : 'text-white/60'}`}>Queue</button>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              <button 
                onClick={onCreate} 
                className="bg-white text-slate-950 px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center hover:bg-yellow-400 transition-all"
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Publish Project
              </button>
              
              <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
                <img src={user.avatarSeed} alt={user.username} className="w-8 h-8 rounded-lg bg-white/10 p-1" />
                <button onClick={onLogout} className="text-white/40 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-slate-950 text-slate-500 py-16 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">Singapore's Premier STEM Learning Platform</p>
          <p className="text-[9px] opacity-20 uppercase tracking-widest">© 2025 STEM Academy Global</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

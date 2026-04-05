import React, { useState, useRef, useEffect } from 'react';
import { 
  PremiumCalendar, 
  PremiumSun, 
  PremiumMoon, 
  PremiumPlus 
} from '../ui/PremiumIcons';
import { 
  Menu
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export function Topbar() {
  const { 
    theme, 
    setTheme, 
    setModalType, 
    isAdmin, 
    setSidebarOpen,
    sidebarOpen,
    handleExport
  } = useAppContext();
  
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const today = new Date();

  return (
    <header className="sticky top-0 z-30 bg-dashboard-bg/80 backdrop-blur-md px-4 lg:px-8 py-4 mb-2 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg text-dashboard-text-muted hover:text-dashboard-text transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-5 sm:gap-6">
        <div className="hidden md:flex items-center gap-3 bg-dashboard-bg-tertiary rounded-full p-1.5 pr-5">
          <div className="w-9 h-9 rounded-full bg-dashboard-bg flex items-center justify-center font-bold text-[17px] text-dashboard-text shadow-sm border border-dashboard-border">
            {today.getDate()}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[12px] font-bold text-dashboard-text leading-none mb-0.5">{today.toLocaleString('default', { weekday: 'short' })},</span>
            <span className="text-[12px] font-medium text-dashboard-text leading-none">{today.toLocaleString('default', { month: 'long' })}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pr-5 border-r border-[#e4e4e7]">
           <button className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full border border-[#e4e4e7] text-dashboard-text hover:bg-dashboard-bg-tertiary transition-colors shadow-sm">
             <PremiumCalendar className="w-[18px] h-[18px]" />
             <span className="absolute top-[8px] right-[10px] w-1.5 h-1.5 bg-[#ff6b6b] rounded-full border-[1.5px] border-white"></span>
           </button>
           <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className="w-[38px] h-[38px] hidden sm:flex items-center justify-center rounded-full border border-[#e4e4e7] text-dashboard-text hover:bg-dashboard-bg-tertiary transition-colors shadow-sm"
           >
             {theme === 'dark' ? <PremiumSun className="w-[18px] h-[18px]" /> : <PremiumMoon className="w-[18px] h-[18px]" />}
           </button>
           {isAdmin && (
             <button 
               onClick={() => setModalType('add')}
               className="w-[38px] h-[38px] hidden sm:flex items-center justify-center rounded-full border border-[#e4e4e7] text-dashboard-text hover:bg-dashboard-bg-tertiary transition-colors shadow-sm"
               title="Add Transaction"
             >
               <PremiumPlus className="w-[18px] h-[18px] text-dashboard-accent" />
             </button>
           )}
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#d0f3df] p-0.5 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Shohanur Rohaman Sohan" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[13.5px] font-bold text-dashboard-text tracking-tight leading-tight">Aniket kamble</span>
            <span className="text-[11.5px] font-medium text-dashboard-text-muted mt-0.5">Frontend Developer</span>
          </div>
        </div>
      </div>
    </header>
  );
}

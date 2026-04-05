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
      {/* Left: Hamburger menu (mobile) */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg text-dashboard-text-muted hover:text-dashboard-text transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Compact date badge — mobile only */}
        <div className="flex md:hidden items-center gap-2 bg-dashboard-bg-tertiary border border-dashboard-border rounded-full px-3 py-1.5">
          <span className="text-[13px] font-bold text-dashboard-text">{today.getDate()}</span>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold text-dashboard-text">{today.toLocaleString('default', { weekday: 'short' })},</span>
            <span className="text-[10px] font-medium text-dashboard-text-muted">{today.toLocaleString('default', { month: 'short' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Full date widget — md+ screens */}
        <div className="hidden md:flex items-center gap-3 bg-dashboard-bg-tertiary rounded-full p-1.5 pr-5">
          <div className="w-9 h-9 rounded-full bg-dashboard-bg flex items-center justify-center font-bold text-[17px] text-dashboard-text shadow-sm border border-dashboard-border">
            {today.getDate()}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[12px] font-bold text-dashboard-text leading-none mb-0.5">{today.toLocaleString('default', { weekday: 'short' })},</span>
            <span className="text-[12px] font-medium text-dashboard-text leading-none">{today.toLocaleString('default', { month: 'long' })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pr-3 sm:pr-5 border-r border-dashboard-border">
           <button className="relative w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] flex items-center justify-center rounded-full border border-dashboard-border text-dashboard-text hover:bg-dashboard-bg-tertiary transition-colors shadow-sm">
             <PremiumCalendar className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
             <span className="absolute top-[7px] right-[9px] w-1.5 h-1.5 bg-[#ff6b6b] rounded-full border-[1.5px] border-white"></span>
           </button>

           {/* Theme toggle — visible on ALL screen sizes */}
           <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] flex items-center justify-center rounded-full border border-dashboard-border text-dashboard-text hover:bg-dashboard-bg-tertiary transition-colors shadow-sm"
             title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
           >
             {theme === 'dark' ? <PremiumSun className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" /> : <PremiumMoon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />}
           </button>

           {isAdmin && (
             <button 
               onClick={() => setModalType('add')}
               className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] hidden sm:flex items-center justify-center rounded-full border border-dashboard-border text-dashboard-text hover:bg-dashboard-bg-tertiary transition-colors shadow-sm"
               title="Add Transaction"
             >
               <PremiumPlus className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-dashboard-accent" />
             </button>
           )}
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#d0f3df] p-0.5 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Aniket Kamble" 
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

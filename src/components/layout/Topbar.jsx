import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  Plus, 
  Download,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Topbar({ view, theme, setTheme, onAdd, onExport, isAdmin, toggleSidebar }) {
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

  return (
    <header className="sticky top-0 z-30 bg-dashboard-bg/80 backdrop-blur-md border-b border-dashboard-border px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 bg-dashboard-bg-tertiary border border-dashboard-border rounded-lg text-dashboard-text-muted hover:text-dashboard-text transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-dashboard-text flex items-center gap-2 capitalize">
            {view}
            <span className="text-xs font-normal text-dashboard-text-muted ml-1">June 2024</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-dashboard-bg-tertiary border border-dashboard-border text-dashboard-text-muted hover:text-dashboard-accent hover:border-dashboard-accent/30 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {isAdmin && view === 'transactions' && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-dashboard-accent text-black text-sm font-semibold rounded-lg hover:bg-dashboard-accent-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        )}

        {view === 'transactions' && (
          <div className="relative" ref={exportRef}>
            <button 
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-dashboard-bg-tertiary border border-dashboard-border-strong text-dashboard-text-muted text-sm font-medium rounded-lg hover:bg-dashboard-bg-tertiary hover:text-dashboard-text transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {exportOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] min-w-[160px] bg-dashboard-bg-secondary border border-dashboard-border-strong rounded-lg overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-1 duration-200">
                <button 
                  onClick={() => {
                    onExport('csv');
                    setExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dashboard-text-muted hover:bg-dashboard-bg-tertiary hover:text-dashboard-text transition-colors border-b border-dashboard-border"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV Export
                </button>
                <button 
                  onClick={() => {
                    onExport('json');
                    setExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dashboard-text-muted hover:bg-dashboard-bg-tertiary hover:text-dashboard-text transition-colors"
                >
                  <FileJson className="w-4 h-4" />
                  JSON Export
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

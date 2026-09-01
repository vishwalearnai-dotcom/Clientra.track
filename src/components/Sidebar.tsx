import React from 'react';
import { ActiveTab } from '../types';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  CheckSquare,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Crown
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { currentRole, currentUser } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'DASHBOARD',
      label: 'Executive Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'STORYBOARD',
      label: 'Task Storyboard',
      icon: <Kanban className="w-4 h-4" />
    },
    {
      id: 'EMPLOYEE_MANAGEMENT',
      label: 'Team Management',
      icon: <Users className="w-4 h-4" />
    }
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-xs ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-950 text-base tracking-tight">TaskTrack</span>
              <p className="text-[11px] text-slate-500 font-medium">Domain Operations Tracker</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Navigation
            </div>

            {navItems.map(item => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-300"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                {currentUser.role === 'ADMIN' && <Crown className="w-3 h-3 text-amber-500" />}
                {currentUser.role === 'LEAD' && <ShieldCheck className="w-3 h-3 text-slate-700" />}
                {currentUser.role === 'MEMBER' && <UserIcon className="w-3 h-3 text-slate-500" />}
                <p className="text-xs font-bold text-slate-950 truncate">{currentUser.name}</p>
              </div>
              <span className="text-[11px] text-slate-500 font-medium truncate block">{currentUser.title}</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

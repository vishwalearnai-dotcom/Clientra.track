import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown,
  Menu,
  RotateCcw,
  Calendar,
  Crown,
  User as UserIcon
} from 'lucide-react';

interface NavbarProps {
  onOpenNewTaskModal: () => void;
  onOpenNotificationCenter: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTaskModal,
  onOpenNotificationCenter,
  onToggleSidebar
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    currentRole, 
    setCurrentRole,
    selectedMonth,
    setSelectedMonth,
    users, 
    notifications,
    resetDataToDefault
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Mobile Sidebar Toggle & Month Picker */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Monthly Basis Selector */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
            <Calendar className="w-4 h-4 text-slate-600" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-900"
            >
              <option value="2026-09">September 2026 (Current)</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-10">October 2026</option>
            </select>
          </div>
        </div>

        {/* Right Actions: 3-Role Switcher, User Selector, Notifications, + Task */}
        <div className="flex items-center gap-3">
          
          {/* 3-Role Toggle Switcher (Admin | Lead | Member) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium">
            
            {/* Admin Toggle */}
            <button
              onClick={() => {
                setCurrentRole('ADMIN');
                const adminUser = users.find(u => u.role === 'ADMIN');
                if (adminUser) setCurrentUser(adminUser);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                currentRole === 'ADMIN'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Lead Toggle */}
            <button
              onClick={() => {
                setCurrentRole('LEAD');
                if (currentUser.role !== 'LEAD') {
                  const leadUser = users.find(u => u.role === 'LEAD');
                  if (leadUser) setCurrentUser(leadUser);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                currentRole === 'LEAD'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lead View</span>
            </button>

            {/* Member Toggle */}
            <button
              onClick={() => {
                setCurrentRole('MEMBER');
                if (currentUser.role !== 'MEMBER') {
                  const memberUser = users.find(u => u.role === 'MEMBER');
                  if (memberUser) setCurrentUser(memberUser);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                currentRole === 'MEMBER'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Member View</span>
            </button>

          </div>

          {/* User Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover ring-2 ring-slate-300"
              />
              <span className="max-w-[130px] truncate">{currentUser.name}</span>
              <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Switch Active User
                </div>

                {/* Admin */}
                <p className="px-3 py-1 text-[11px] font-bold text-slate-900 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span>Founder / Admin</span>
                </p>
                {users.filter(u => u.role === 'ADMIN').map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.id === user.id ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{user.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{user.title}</span>
                  </button>
                ))}

                {/* Domain Heads (Leads) */}
                <p className="px-3 py-1 text-[11px] font-bold text-slate-900 mt-2 border-t border-slate-100 pt-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-700" />
                  <span>Domain Heads (Leads)</span>
                </p>
                {users.filter(u => u.role === 'LEAD').map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.id === user.id ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{user.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{user.domain}</span>
                  </button>
                ))}

                {/* Members */}
                <p className="px-3 py-1 text-[11px] font-bold text-slate-900 mt-2 border-t border-slate-100 pt-2 flex items-center gap-1">
                  <UserIcon className="w-3 h-3 text-slate-500" />
                  <span>Members</span>
                </p>
                {users.filter(u => u.role === 'MEMBER').map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.id === user.id ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{user.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{user.domain} (Head: {user.headName})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotificationCenter}
            className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* + New Task Button (Admin or Lead) */}
          {currentRole !== 'MEMBER' && (
            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={resetDataToDefault}
            title="Reset to default state"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};

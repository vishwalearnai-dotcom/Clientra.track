import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Task } from '../types';
import { 
  Users, 
  Search, 
  Send, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  X,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Crown
} from 'lucide-react';

export const EmployeeManagementView: React.FC = () => {
  const { 
    users, 
    tasks, 
    domains, 
    currentUser, 
    currentRole, 
    selectedMonth, 
    setSelectedMonth, 
    nudgeTask, 
    selectedUserForDetail, 
    setSelectedUserForDetail 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'LEADS' | 'MEMBERS'>('ALL');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');

  const visibleUsers = users.filter(u => {
    if (u.id === currentUser.id) return false;

    if (currentRole === 'ADMIN') {
      return true;
    }

    if (currentRole === 'LEAD') {
      return u.role === 'MEMBER' && (u.headName === currentUser.headName || u.domain === currentUser.domain);
    }

    return false;
  });

  const filteredUsers = visibleUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomainFilter === 'ALL' || u.domain === selectedDomainFilter;
    const matchesRole = 
      selectedRoleFilter === 'ALL' ||
      (selectedRoleFilter === 'LEADS' && u.role === 'LEAD') ||
      (selectedRoleFilter === 'MEMBERS' && u.role === 'MEMBER');

    return matchesSearch && matchesDomain && matchesRole;
  });

  const monthLabel = selectedMonth === '2026-09' ? 'September 2026' : selectedMonth === '2026-08' ? 'August 2026' : 'October 2026';

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#d1001f', color: '#ffffff' };
      case 'Medium':
        return { backgroundColor: '#e6cc00', color: '#0f172a' };
      case 'Low':
        return { backgroundColor: '#0B6623', color: '#ffffff' };
      default:
        return { backgroundColor: '#E8E9EB', color: '#0f172a' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight">
              {currentRole === 'ADMIN' ? 'Team Management (All Leads & Members)' : `${currentUser.domain} Team Members`}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentRole === 'ADMIN' 
                ? 'All company employees listed (Leads & Members). Click any employee to view current month tasks.' 
                : `Members reporting to Head ${currentUser.headName}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>{monthLabel}</span>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white">
              {visibleUsers.length} Employees Listed
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search employee name or title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {currentRole === 'ADMIN' && (
              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setSelectedRoleFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedRoleFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  All ({visibleUsers.length})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('LEADS')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedRoleFilter === 'LEADS' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  Leads ({visibleUsers.filter(u => u.role === 'LEAD').length})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('MEMBERS')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedRoleFilter === 'MEMBERS' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  Members ({visibleUsers.filter(u => u.role === 'MEMBER').length})
                </button>
              </div>
            )}

            {currentRole === 'ADMIN' && (
              <select
                value={selectedDomainFilter}
                onChange={e => setSelectedDomainFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Domains</option>
                {domains.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.headName})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Employees Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(emp => {
          const empTasks = tasks.filter(t => (t.assigneeId === emp.id || t.delegatedByHeadName === emp.name) && t.month === selectedMonth);
          const doneTasks = empTasks.filter(t => t.status === 'DONE');
          const pendingTasks = empTasks.filter(t => t.status !== 'DONE');
          const percent = empTasks.length > 0 ? Math.round((doneTasks.length / empTasks.length) * 100) : 100;

          return (
            <div 
              key={emp.id} 
              onClick={() => setSelectedUserForDetail(emp)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-950 group-hover:text-slate-700 transition-colors flex items-center gap-1">
                          <span>{emp.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                        </h3>
                        
                        {/* Domain Head Role Badge: #E8E9EB (Remind button bg color) */}
                        <span 
                          style={emp.role === 'LEAD' ? { backgroundColor: '#E8E9EB', color: '#0f172a' } : { backgroundColor: '#f1f5f9', color: '#334155' }}
                          className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-slate-200"
                        >
                          {emp.role === 'LEAD' ? 'Domain Head' : 'Member'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">{emp.title}</p>
                      <span className="inline-block text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-1">
                        Domain: {emp.domain}
                      </span>
                    </div>
                  </div>

                  {/* Percentage Badge: #E8E9EB (Remind button bg color) */}
                  <span 
                    style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 border border-slate-300"
                  >
                    {percent}%
                  </span>
                </div>

                {/* Progress Bar Meter: Pure Black #000000 */}
                <div className="my-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{monthLabel} Progress</span>
                    <span className="text-slate-950 font-bold">{doneTasks.length} / {empTasks.length} Done</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      style={{ backgroundColor: '#000000', width: `${percent}%` }}
                      className="h-full transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200">
                  {empTasks.length > 0 ? (
                    empTasks.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center justify-between text-slate-800 font-medium">
                        <span className="truncate max-w-[180px]">{t.title}</span>
                        <span 
                          style={t.status === 'DONE' ? { backgroundColor: '#0B6623', color: '#ffffff' } : { backgroundColor: '#cbd5e1', color: '#0f172a' }}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs"
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">No tasks listed for {monthLabel}</span>
                  )}
                  {empTasks.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-medium block pt-1 text-right">+{empTasks.length - 3} more tasks</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-bold group-hover:text-slate-950">
                  View Current Month Tasks &rarr;
                </span>

                {pendingTasks.length > 0 && currentRole === 'ADMIN' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nudgeTask(pendingTasks[0].id);
                    }}
                    style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold hover:bg-slate-300 transition-colors border border-slate-300"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-700" />
                    <span>Remind</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DEDICATED USER SCREEN / MODAL */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedUserForDetail.avatar} 
                  alt={selectedUserForDetail.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-950">{selectedUserForDetail.name}</h2>
                    <span 
                      style={selectedUserForDetail.role === 'LEAD' ? { backgroundColor: '#E8E9EB', color: '#0f172a' } : { backgroundColor: '#f1f5f9', color: '#334155' }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-slate-200"
                    >
                      {selectedUserForDetail.role === 'LEAD' ? 'Domain Head' : 'Member'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedUserForDetail.title} • Domain: {selectedUserForDetail.domain}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="bg-transparent font-bold focus:outline-none"
                  >
                    <option value="2026-09">September 2026</option>
                    <option value="2026-08">August 2026</option>
                    <option value="2026-10">October 2026</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedUserForDetail(null)}
                  className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-950">
                  Current Month Tasks ({tasks.filter(t => (t.assigneeId === selectedUserForDetail.id || t.delegatedByHeadName === selectedUserForDetail.name) && t.month === selectedMonth).length})
                </h3>
              </div>

              <div className="space-y-3">
                {tasks.filter(t => (t.assigneeId === selectedUserForDetail.id || t.delegatedByHeadName === selectedUserForDetail.name) && t.month === selectedMonth).length > 0 ? (
                  tasks.filter(t => (t.assigneeId === selectedUserForDetail.id || t.delegatedByHeadName === selectedUserForDetail.name) && t.month === selectedMonth).map(task => (
                    <div 
                      key={task.id} 
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-950">{task.title}</h4>
                          <span 
                            style={getPriorityStyle(task.priority)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs"
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Domain: {task.domain} • Head: {task.delegatedByHeadName} • Due: {task.dueDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span 
                          style={task.status === 'DONE' ? { backgroundColor: '#0B6623', color: '#ffffff' } : { backgroundColor: '#d3d3d3', color: '#0f172a' }}
                          className="px-3 py-1 rounded-lg text-xs font-bold shadow-2xs"
                        >
                          {task.status.replace('_', ' ')}
                        </span>

                        {task.status !== 'DONE' && currentRole === 'ADMIN' && (
                          <button
                            onClick={() => nudgeTask(task.id)}
                            style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors border border-slate-300"
                          >
                            <Send className="w-3 h-3 text-slate-700" />
                            <span>Remind</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No tasks listed for {selectedUserForDetail.name} in {monthLabel}.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

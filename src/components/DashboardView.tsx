import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab, DomainName } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  ArrowRight,
  Building2,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    tasks, 
    domains, 
    currentUser, 
    currentRole, 
    selectedMonth, 
    nudgeTask, 
    nudgeAllDomainPendingTasks 
  } = useApp();

  const monthTasks = tasks.filter(t => t.month === selectedMonth);

  let viewTasks = monthTasks;
  if (currentRole === 'MEMBER') {
    viewTasks = monthTasks.filter(t => t.assigneeId === currentUser.id);
  } else if (currentRole === 'LEAD') {
    viewTasks = monthTasks.filter(t => t.delegatedByHeadName === currentUser.headName || t.domain === currentUser.domain);
  }

  const totalTasks = viewTasks.length;
  const completedTasks = viewTasks.filter(t => t.status === 'DONE').length;
  const inProgressTasks = viewTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = viewTasks.filter(t => t.status === 'TODO').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const needsReminderTasks = viewTasks.filter(t => t.status !== 'DONE');

  const monthLabel = selectedMonth === '2026-09' ? 'September 2026' : selectedMonth === '2026-08' ? 'August 2026' : 'October 2026';

  // High: #e06666, Medium: #ffd966, Low: #93c47d
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#e06666', color: '#ffffff' };
      case 'Medium':
        return { backgroundColor: '#ffd966', color: '#0f172a' };
      case 'Low':
        return { backgroundColor: '#93c47d', color: '#0f172a' };
      default:
        return { backgroundColor: '#E8E9EB', color: '#0f172a' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-950 tracking-tight">
                {currentRole === 'ADMIN' ? 'Executive Operations Dashboard' : currentRole === 'LEAD' ? `${currentUser.domain} Lead Dashboard` : 'My Daily Task Dashboard'}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-white">
                {monthLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentRole === 'ADMIN' 
                ? 'Company-wide task tracking across all 7 domains' 
                : currentRole === 'LEAD'
                  ? `Task delegation & performance overview for Head ${currentUser.name}`
                  : `Personal task allocation view for ${currentUser.name}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('STORYBOARD')}
              style={{ backgroundColor: '#d3d3d3', color: '#0f172a' }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity"
            >
              <span>View Storyboard</span>
              <ArrowRight className="w-4 h-4 text-slate-800" />
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-500 text-xs font-medium">Total Monthly Tasks</span>
            <p className="text-2xl font-bold text-slate-950 mt-0.5">{totalTasks}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-700 text-xs font-medium">In Progress</span>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{inProgressTasks}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-700 text-xs font-medium">Completed</span>
            <p className="text-2xl font-bold mt-0.5" style={{ color: '#0B6623' }}>
              {completedTasks} <span className="text-xs font-normal text-slate-500">({completionPercentage}%)</span>
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-700 text-xs font-medium">Pending Reminders</span>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{needsReminderTasks.length}</p>
          </div>
        </div>
      </div>

      {/* 7 Domains Overview Table */}
      {currentRole !== 'MEMBER' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-950">
                {currentRole === 'ADMIN' ? 'All 7 Company Domains' : `${currentUser.domain} Domain Breakdown`} ({monthLabel})
              </h2>
            </div>

            {currentRole === 'ADMIN' && (
              <button
                onClick={() => nudgeAllDomainPendingTasks()}
                style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors border border-slate-300"
              >
                <Send className="w-3.5 h-3.5 text-slate-700" />
                <span>Send Reminders to All Pending ({needsReminderTasks.length})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains
              .filter(d => currentRole === 'ADMIN' || d.headName === currentUser.headName || d.name === currentUser.domain)
              .map(dom => {
                const domTasks = monthTasks.filter(t => t.domain === dom.name);
                const domDone = domTasks.filter(t => t.status === 'DONE').length;
                const domPending = domTasks.filter(t => t.status !== 'DONE').length;
                const percent = domTasks.length > 0 ? Math.round((domDone / domTasks.length) * 100) : 0;

                return (
                  <div 
                    key={dom.name}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">{dom.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">Head: <strong className="text-slate-900">{dom.headName}</strong></p>
                      </div>
                      
                      <span 
                        style={percent === 100 ? { backgroundColor: '#0B6623', color: '#ffffff' } : { backgroundColor: '#E8E9EB', color: '#0f172a' }}
                        className="text-xs px-2.5 py-0.5 rounded-full font-bold border border-slate-300"
                      >
                        {percent}% Done
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
                        <span>{domDone} of {domTasks.length} tasks completed</span>
                        <span>{domPending} pending</span>
                      </div>
                      {/* Progress bar pure black #000000 */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          style={{ backgroundColor: percent === 100 ? '#0B6623' : '#000000', width: `${percent}%` }}
                          className="h-full transition-all duration-300"
                        />
                      </div>
                    </div>

                    {domPending > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => nudgeAllDomainPendingTasks(dom.name)}
                          style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
                          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-semibold hover:bg-slate-300 transition-colors border border-slate-300"
                        >
                          <Send className="w-3 h-3 text-slate-700" />
                          <span>Remind {dom.name} ({domPending})</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Pending Tasks List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-950 mb-3">
          {currentRole === 'MEMBER' ? 'My Active Tasks' : 'Pending Monthly Tasks Needing Attention'} ({monthLabel})
        </h2>
        
        <div className="divide-y divide-slate-100">
          {needsReminderTasks.length > 0 ? (
            needsReminderTasks.map(task => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-950 truncate">{task.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {task.domain}
                    </span>
                    <span 
                      style={getPriorityStyle(task.priority)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs"
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600">
                      Head: {task.delegatedByHeadName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Due {task.dueDate}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {task.nudgedCount > 0 && (
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      Reminded {task.nudgedCount}x
                    </span>
                  )}
                  {currentRole !== 'MEMBER' && (
                    <button
                      onClick={() => nudgeTask(task.id)}
                      style={{ backgroundColor: '#E8E9EB', color: '#0f172a' }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors border border-slate-300"
                    >
                      <Send className="w-3 h-3 text-slate-700" />
                      <span>Send Reminder</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 font-medium">
              🎉 All monthly tasks for {monthLabel} are completed and up-to-date!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DailyDigestBanner } from './components/DailyDigestBanner';
import { DashboardView } from './components/DashboardView';
import { KanbanBoard } from './components/KanbanBoard';
import { EmployeeManagementView } from './components/EmployeeManagementView';
import { TaskModal } from './components/TaskModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Toast } from './components/Toast';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Task, ActiveTab } from './types';

const MainContent: React.FC = () => {
  const { currentRole, isOnboarded, completeOnboarding } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // If no company has been onboarded yet, show fresh Multi-Tenant Onboarding Wizard
  if (!isOnboarded) {
    return <OnboardingWizard onComplete={completeOnboarding} />;
  }

  const handleOpenNewTaskModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Top Navbar */}
        <Navbar 
          onOpenNewTaskModal={handleOpenNewTaskModal}
          onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
          
          {/* Daily Task Allocation Digest Banner */}
          <DailyDigestBanner />

          {/* Render Active View Tab */}
          {activeTab === 'DASHBOARD' && (
            <DashboardView onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'STORYBOARD' && (
            <KanbanBoard onEditTask={handleEditTask} />
          )}

          {activeTab === 'EMPLOYEE_MANAGEMENT' && currentRole !== 'MEMBER' && (
            <EmployeeManagementView />
          )}

          {activeTab === 'EMPLOYEE_MANAGEMENT' && currentRole === 'MEMBER' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-600 shadow-sm">
              <p className="text-sm font-semibold">Team Management is restricted to Admin & Lead roles.</p>
              <p className="text-xs mt-1 text-slate-500">Please switch to "Admin" or "Lead View" in the top bar to view employee details.</p>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>Clientra Track &copy; 2026 — Dynamic Multi-Tenant Task Delegation & Management Platform</p>
        </footer>

      </div>

      {/* Modals & Slide-overs */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />

      <Toast />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

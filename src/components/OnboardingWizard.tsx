import React, { useState } from 'react';
import { Building2, Plus, Users, Check, ArrowRight } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (orgData: {
    orgName: string;
    orgSlug: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    departments: string[];
  }) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Company Info
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');

  // Step 2: Founder / Admin Info
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Step 3: Dynamic Departments
  const [departmentInput, setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState<string[]>([
    'Operations',
    'Sales',
    'Product'
  ]);

  const handleOrgNameChange = (val: string) => {
    setOrgName(val);
    setOrgSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleAddDepartment = () => {
    const trimmed = departmentInput.trim();
    if (trimmed && !departments.includes(trimmed)) {
      setDepartments([...departments, trimmed]);
      setDepartmentInput('');
    }
  };

  const handleRemoveDepartment = (name: string) => {
    setDepartments(departments.filter(d => d !== name));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !adminName || !adminEmail || departments.length === 0) return;
    onComplete({
      orgName,
      orgSlug: orgSlug || 'my-company',
      adminName,
      adminEmail,
      adminPhone,
      departments
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-xl overflow-hidden animate-fade-in">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Setup Your Organization</h1>
              <p className="text-xs text-slate-300 mt-0.5">Welcome to Clientra Track SaaS Platform</p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-6">
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-white' : 'bg-white/20'}`} />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-300 mt-2">
            <span>1. Organization</span>
            <span>2. Founder / Admin</span>
            <span>3. Custom Departments</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-950">Company Information</h2>
              <p className="text-xs text-slate-500">Enter your company details to initialize your tenant workspace.</p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Acme Health Innovations"
                  value={orgName}
                  onChange={e => handleOrgNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Workspace Slug (URL Identifier)</label>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono">
                  <span>app.clientra.com/</span>
                  <input 
                    type="text"
                    required
                    value={orgSlug}
                    onChange={e => setOrgSlug(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-slate-900 font-bold ml-1 w-full"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!orgName.trim()}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-950">Founder & CEO Profile</h2>
              <p className="text-xs text-slate-500">You will have master admin permissions across all departments and members.</p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Sarah Jenkins"
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Work Email *</label>
                <input 
                  type="email"
                  required
                  placeholder="sarah@acmehealth.com"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number (with country code)</label>
                <input 
                  type="tel"
                  placeholder="+919876543210 or +14155552671"
                  value={adminPhone}
                  onChange={e => setAdminPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Used for Twilio WhatsApp daily task reminders and team alert broadcasts.</p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!adminName.trim() || !adminEmail.trim()}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Continue to Departments</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-950">Custom Company Departments</h2>
              <p className="text-xs text-slate-500">Every company operates differently. Define the departments your organization needs.</p>

              {/* Department Input */}
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. ICU, Clinical Research, Engineering..."
                  value={departmentInput}
                  onChange={e => setDepartmentInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDepartment();
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddDepartment}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Department Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {departments.map(dept => (
                  <span 
                    key={dept} 
                    className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    <span>{dept}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDepartment(dept)}
                      className="text-slate-400 hover:text-red-600 font-bold ml-1 text-sm"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="pt-6 flex justify-between items-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={departments.length === 0}
                  onClick={handleFinalSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Launch Organization</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HardHat, 
  X, 
  ArrowRight, 
  Lock, 
  User, 
  CheckCircle2, 
  Database,
  Radio
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types/safety';
import { DEMO_USERS, apiService } from '../../services/apiService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  isBackendOnline: boolean | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  isBackendOnline
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [customName, setCustomName] = useState('');
  const [customBadge, setCustomBadge] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectRole = async (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      const user = await apiService.login(role);
      onLoginSuccess(user);
      onClose();
    } catch (e) {
      console.error('Login error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await apiService.login(
        selectedRole,
        customBadge || undefined,
        customName || undefined
      );
      onLoginSuccess(user);
      onClose();
    } catch (e) {
      console.error('Custom login error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-industrial-900 border border-industrial-700 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-industrial-950 border-b border-industrial-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-hazard-cyan/20 border border-hazard-cyan/40 flex items-center justify-center text-hazard-cyan">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                NAV-DRISHTI ACCESS &amp; ROLE CONTROL
              </h2>
              <p className="text-[10px] text-industrial-400 font-sans">
                Select your operational role or sign in with refinery credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-industrial-800 text-industrial-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Database Status Indicator Bar */}
        <div className="px-5 py-2 bg-industrial-950/80 border-b border-industrial-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-hazard-cyan" />
            <span className="text-industrial-300">ACTIVE STORAGE:</span>
            {isBackendOnline ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SQLITE SERVER (PORT 5001)
              </span>
            ) : (
              <span className="text-hazard-amber font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-hazard-amber" />
                BROWSER DATABASE (GITHUB PAGES MODE)
              </span>
            )}
          </div>
          <span className="text-[10px] text-industrial-500">
            CURRENT: <b className="text-white uppercase">{currentUser.role.replace('_', ' ')}</b>
          </span>
        </div>

        {/* Role Selection Cards */}
        <div className="p-5 space-y-4">
          <div className="text-[11px] text-industrial-300 uppercase tracking-wider font-bold">
            QUICK ROLE SELECTION:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Field Worker Card */}
            <div
              onClick={() => handleSelectRole('field_worker')}
              className={`p-4 border cursor-pointer transition-all relative group ${
                selectedRole === 'field_worker'
                  ? 'bg-industrial-850 border-hazard-cyan shadow-hazard-cyan/15'
                  : 'bg-industrial-950/80 hover:bg-industrial-850 border-industrial-800 hover:border-industrial-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 bg-hazard-cyan/10 border border-hazard-cyan/30 flex items-center justify-center text-hazard-cyan">
                  <HardHat className="w-5 h-5" />
                </div>
                {currentUser.role === 'field_worker' && (
                  <span className="px-2 py-0.5 bg-hazard-cyan/20 border border-hazard-cyan/40 text-hazard-cyan text-[9px] font-bold uppercase">
                    ACTIVE NOW
                  </span>
                )}
              </div>

              <h3 className="font-black text-white text-sm uppercase tracking-wide">
                FIELD WORKER
              </h3>
              <p className="text-[11px] text-industrial-300 font-sans mt-1">
                Rajesh Kumar (Senior Mechanical Tech)
              </p>

              <div className="mt-3 pt-2.5 border-t border-industrial-800 text-[10px] text-industrial-400 space-y-1">
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-cyan">✓</span> Report observations (10 parameters)
                </div>
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-cyan">✓</span> See report progress &amp; lifecycle
                </div>
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-cyan">✓</span> Direct messaging with Safety Officer
                </div>
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-cyan">✓</span> AI auto-clarification assistance
                </div>
              </div>
            </div>

            {/* Safety Inspector Card */}
            <div
              onClick={() => handleSelectRole('safety_inspector')}
              className={`p-4 border cursor-pointer transition-all relative group ${
                selectedRole === 'safety_inspector'
                  ? 'bg-industrial-850 border-hazard-amber shadow-hazard-amber/15'
                  : 'bg-industrial-950/80 hover:bg-industrial-850 border-industrial-800 hover:border-industrial-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 bg-hazard-amber/10 border border-hazard-amber/30 flex items-center justify-center text-hazard-amber">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {currentUser.role === 'safety_inspector' && (
                  <span className="px-2 py-0.5 bg-hazard-amber/20 border border-hazard-amber/40 text-hazard-amber text-[9px] font-bold uppercase">
                    ACTIVE NOW
                  </span>
                )}
              </div>

              <h3 className="font-black text-white text-sm uppercase tracking-wide">
                SAFETY INSPECTOR
              </h3>
              <p className="text-[11px] text-industrial-300 font-sans mt-1">
                Vikram Singh (Senior HSSE Inspector)
              </p>

              <div className="mt-3 pt-2.5 border-t border-industrial-800 text-[10px] text-industrial-400 space-y-1">
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-amber">✓</span> Overview, Site Risk &amp; Live Feed
                </div>
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-amber">✓</span> Full report triage across all units
                </div>
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-amber">✓</span> Assign corrective actions &amp; close
                </div>
                <div className="flex items-center gap-1.5 text-industrial-300">
                  <span className="text-hazard-amber">✓</span> Enterprise SIF analytics &amp; audit
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Custom Login */}
          <div className="pt-2">
            <button
              onClick={() => setIsCustom(!isCustom)}
              className="text-hazard-cyan hover:underline text-[11px] flex items-center gap-1"
            >
              <span>{isCustom ? '− Hide Custom Credential Login' : '+ Sign in with Custom Name / Badge ID'}</span>
            </button>

            {isCustom && (
              <form onSubmit={handleCustomSubmit} className="mt-3 p-3 bg-industrial-950 border border-industrial-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-industrial-400 mb-1 uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Amit Verma"
                      className="w-full px-2.5 py-1.5 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-industrial-400 mb-1 uppercase">
                      Badge ID
                    </label>
                    <input
                      type="text"
                      value={customBadge}
                      onChange={(e) => setCustomBadge(e.target.value)}
                      placeholder="e.g. OP-9021"
                      className="w-full px-2.5 py-1.5 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="customRole"
                        checked={selectedRole === 'field_worker'}
                        onChange={() => setSelectedRole('field_worker')}
                        className="accent-hazard-cyan"
                      />
                      <span className="text-industrial-300 text-[11px]">Field Worker</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="customRole"
                        checked={selectedRole === 'safety_inspector'}
                        onChange={() => setSelectedRole('safety_inspector')}
                        className="accent-hazard-amber"
                      />
                      <span className="text-industrial-300 text-[11px]">Safety Inspector</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1 bg-hazard-cyan hover:bg-cyan-400 text-black font-bold text-xs uppercase"
                  >
                    CONTINUE
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-industrial-950 border-t border-industrial-800 flex items-center justify-between text-[11px] text-industrial-400">
          <span>Protected under Refinery HSSE Protocol</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 font-bold"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

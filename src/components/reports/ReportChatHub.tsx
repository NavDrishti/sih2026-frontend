import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { SafetyReport, ReportChatMessage, UserProfile } from '../../types/safety';
import { apiService } from '../../services/apiService';

interface ReportChatHubProps {
  report: SafetyReport;
  currentUser: UserProfile;
  onParametersUpdated?: (updatedReport: SafetyReport) => void;
}

export const ReportChatHub: React.FC<ReportChatHubProps> = ({
  report,
  currentUser,
  onParametersUpdated
}) => {
  const [messages, setMessages] = useState<ReportChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const msgs = await apiService.getMessages(report.report_id);
      setMessages(msgs);
    } catch (e) {
      console.error('Failed to load report messages', e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [report.report_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    setInputText('');
    setLoading(true);

    try {
      const updatedMsgs = await apiService.sendMessage(report.report_id, textToSend, currentUser);
      setMessages(updatedMsgs);

      // Check if report parameters updated
      const freshReports = await apiService.getReports(currentUser);
      const fresh = freshReports.find(r => r.report_id === report.report_id);
      if (fresh && onParametersUpdated) {
        onParametersUpdated(fresh);
      }
    } catch (e) {
      console.error('Error sending message', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAiClarify = async () => {
    setIsAiThinking(true);
    try {
      const updated = await apiService.triggerAiClarify(report.report_id);
      setMessages(updated);
    } catch (e) {
      console.error('AI Clarify error', e);
    } finally {
      setIsAiThinking(false);
    }
  };

  const quickReplies = [
    'No injury occurred, workers were clear of direct blast',
    'Line held 24 bar residual high pressure',
    'Double block & bleed was not verified before unbolting',
    'Process fluid was hot diesel fuel',
    'Area has been barricaded with red danger tape'
  ];

  return (
    <div className="flex flex-col h-[560px] bg-industrial-950 border border-industrial-800 rounded-sm overflow-hidden font-mono text-xs">
      {/* Chat Header */}
      <div className="px-4 py-2.5 bg-industrial-900 border-b border-industrial-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-xs bg-hazard-cyan/20 border border-hazard-cyan/40 flex items-center justify-center text-hazard-cyan">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                COMMUNICATION CONSOLE
              </span>
              <span className="px-1.5 py-0.2 bg-industrial-800 text-[10px] text-industrial-300 border border-industrial-700">
                {report.report_id}
              </span>
            </div>
            <p className="text-[10px] text-industrial-400 font-sans">
              Two-way dialogue between Field Worker, Safety Inspector, and AI Co-Pilot
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerAiClarify}
          disabled={isAiThinking}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-hazard-cyan/10 hover:bg-hazard-cyan/20 border border-hazard-cyan/40 text-hazard-cyan text-[11px] font-bold transition disabled:opacity-50"
          title="Ask AI to evaluate parameter completeness"
        >
          <Sparkles className={`w-3 h-3 ${isAiThinking ? 'animate-spin' : ''}`} />
          <span>{isAiThinking ? 'AI ANALYZING...' : 'AI PARAMETER SCAN'}</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 industrial-scroll">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-industrial-500">
            <Bot className="w-8 h-8 text-hazard-cyan mb-2 opacity-50" />
            <p className="text-xs text-industrial-300 font-bold">No messages in thread yet</p>
            <p className="text-[11px] text-industrial-400 font-sans mt-1">
              Field workers and safety officers can exchange critical observations, photo attachments, and isolation verifications here.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isUserSender = m.sender_id === currentUser.id;
            const isAi = m.is_ai || m.sender_role === 'ai_copilot';
            const isInspector = m.sender_role === 'safety_inspector';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${
                  isAi
                    ? 'items-stretch'
                    : isUserSender
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                {/* Message Bubble Container */}
                <div
                  className={`max-w-[88%] p-3 border rounded-xs transition-all ${
                    isAi
                      ? 'bg-industrial-900/90 border-hazard-cyan/40 shadow-hazard-cyan/10 text-cyan-50'
                      : isInspector
                      ? 'bg-hazard-amber-dark/30 border-hazard-amber-border text-amber-50'
                      : isUserSender
                      ? 'bg-industrial-800 border-industrial-600 text-white'
                      : 'bg-industrial-900 border-industrial-700 text-industrial-200'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-3 pb-1.5 mb-1.5 border-b border-white/10 text-[10px]">
                    <div className="flex items-center gap-1.5 font-bold tracking-wider">
                      {isAi ? (
                        <>
                          <Bot className="w-3.5 h-3.5 text-hazard-cyan animate-pulse" />
                          <span className="text-hazard-cyan font-mono uppercase">AI SAFETY CO-PILOT</span>
                        </>
                      ) : isInspector ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-hazard-amber" />
                          <span className="text-hazard-amber uppercase">{m.sender_name}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-industrial-300" />
                          <span className="text-industrial-300 uppercase">{m.sender_name}</span>
                        </>
                      )}
                    </div>
                    <span className="text-industrial-400 font-sans text-[10px]">
                      {m.timestamp}
                    </span>
                  </div>

                  {/* Message Body */}
                  <p className="font-sans text-xs whitespace-pre-wrap leading-relaxed">
                    {m.message}
                  </p>

                  {/* Auto-Updated Parameters Pill */}
                  {m.auto_updated_fields && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-500/30 flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>REFINERY DATASET UPDATED:</span>
                      </div>
                      {Object.entries(m.auto_updated_fields).map(([k, v]) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px]"
                        >
                          {k}: <b>{String(v)}</b>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Clarification Chips */}
      <div className="px-3 py-2 bg-industrial-900/60 border-t border-industrial-800/80 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-industrial-400 font-bold uppercase shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-hazard-cyan" /> QUICK CLARIFY:
          </span>
          {quickReplies.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2 py-0.5 bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 hover:border-hazard-cyan/50 text-[10px] text-industrial-300 hover:text-white transition shrink-0 rounded-xs"
            >
              + {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-2.5 bg-industrial-900 border-t border-industrial-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentUser.role === 'field_worker'
                ? "Reply to Inspector/AI (e.g. 'No injury, gauge read 24 bar, isolation tag was missing')..."
                : "Send instructions or request more details from field worker..."
            }
            className="flex-1 px-3 py-2 bg-industrial-950 border border-industrial-700 focus:border-hazard-cyan text-white text-xs outline-none placeholder:text-industrial-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-hazard-cyan hover:bg-cyan-400 text-black font-bold text-xs transition uppercase disabled:opacity-40 shrink-0"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  User,
  CheckCircle2
} from 'lucide-react';
import { SentinelObservation } from '../../data/sentinelData';

interface AiAssistantPageViewProps {
  observations: SentinelObservation[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
}

export const AiAssistantPageView: React.FC<AiAssistantPageViewProps> = ({
  observations
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "I'm Sentinel, your AI safety intelligence assistant. I can analyze safety observations, detect SIF-potential incidents, map reports to IOGP Life-Saving Rules, and identify recurring precursor patterns. Try asking me about high-risk sites, SIF trends, or specific observations.",
      timestamp: '09:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    { text: 'What is the current SIF situation?', icon: ShieldAlert },
    { text: 'What precursor patterns are emerging?', icon: AlertTriangle },
    { text: 'Which site has the highest risk?', icon: MapPin },
    { text: 'Which Life-Saving Rule is most exposed?', icon: ShieldCheck },
    { text: 'What are the recent trends?', icon: TrendingUp },
    { text: 'What safety actions should I prioritize?', icon: HelpCircle }
  ];

  const handleSendMessage = (question?: string) => {
    const query = question || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!question) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiAnswer(query, observations);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 700);
  };

  const generateAiAnswer = (q: string, obs: SentinelObservation[]): ChatMessage => {
    const lower = q.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (lower.includes('sif situation') || lower.includes('current sif')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Currently, **16 out of 20 reports (80%)** possess serious SIF potential across the 8-week monitoring window. The average SIF score is **83/100**, with **7 critical cases**. The highest scoring case is **OBS-2026-0140 (Score 95)** at North Gas Plant involving an expired hot work permit adjacent to an unpurged hydrocarbon header.`,
        timestamp: time,
        citations: ['OBS-2026-0140', 'OBS-2026-0132', 'OBS-2026-0141']
      };
    }

    if (lower.includes('precursor') || lower.includes('pattern')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `The AI engine has isolated **6 recurring precursor patterns**. The most critical rising pattern is **"Workers entering lifting exclusion zones"** (6 events across 2 sites), followed by **"Permit-to-work gaps"** (11 events across 4 sites). Furthermore, contractors Saipem and L&T account for 60% of recurring SIF-potential events.`,
        timestamp: time,
        citations: ['Safe Mechanical Lifting', 'Work Authorisation']
      };
    }

    if (lower.includes('site') || lower.includes('highest risk')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `**Refinery Unit 3** represents the highest incident volume with **6 observations**, 5 of which carry SIF potential. However, **North Gas Plant** exhibits the highest severity density with 2 critical events, including hot work near live lines. Immediate field supervision audits are recommended for Unit 3 and North Gas Plant.`,
        timestamp: time,
        citations: ['Refinery Unit 3', 'North Gas Plant']
      };
    }

    if (lower.includes('rule') || lower.includes('life-saving')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `The most exposed IOGP rule is **Energy Isolation** (4 exposures, 4 SIF potential), followed jointly by **Safe Mechanical Lifting**, **Hot Work**, **Working at Height**, and **Bypassing Safety Controls** (3 exposures each). In 100% of Energy Isolation cases, zero-energy physical verification was omitted prior to breaking integrity.`,
        timestamp: time,
        citations: ['Energy Isolation', 'Safe Mechanical Lifting']
      };
    }

    if (lower.includes('trend')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Over the past 8 weeks, total observation volume dropped **-29%**, but the SIF-potential ratio experienced a sharp **160% increase** from Week 1 (5 SIF cases) to Week 8 (13 SIF cases). The action closure velocity stands at **68%**, leaving 13 open investigations that require leadership sign-off.`,
        timestamp: time,
        citations: ['8-Week Telemetry']
      };
    }

    if (lower.includes('action') || lower.includes('prioritize')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `**Top 3 Recommended Actions for HSE Leadership:**\n\n1. **Enforce Mandatory Two-Person LOTO Verification** on all pump and flange breaks (Addresses OBS-2026-0142).\n2. **Deploy Rigid Physical Barriers** for 1T+ mobile crane lifts along flare transit corridors (Addresses OBS-2026-0141).\n3. **Stand-down Contractor Hot Work** at North Gas Plant until continuous gas detector recalibration and permits are re-verified (Addresses OBS-2026-0140).`,
        timestamp: time,
        citations: ['ACT-0142-1', 'ACT-0141-1', 'ACT-0140-1']
      };
    }

    // Generic answer
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: `Based on current field telemetry of **20 observations**, the primary risk driver remains barrier degradation during maintenance and lifting tasks. **80% of reported events** carry fatal injury potential if secondary safeguards fail. Let me know if you would like me to drill into a specific site, IOGP Life-Saving Rule, or contractor profile.`,
      timestamp: time,
      citations: ['Sentinel Knowledge Base']
    };
  };

  return (
    <div className="space-y-6">
      {/* Main Assistant Chat Container matching Screenshot 282 */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[620px]">
        {/* Assistant Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sentinel AI Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask about SIF, precursors, sites, rules, trends, and actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1 max-h-[360px]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 dark:bg-slate-800 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.citations && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Citations:
                      </span>
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className={`text-[10px] block mt-1.5 ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions Grid matching Screenshot 282 */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>SUGGESTED QUESTIONS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {suggestedQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131f37] hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all text-left flex items-center gap-2.5 group"
                >
                  <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {q.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Textbar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
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
              placeholder="Ask Sentinel about your safety data..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                inputText.trim()
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  Plus, 
  Copy, 
  Check, 
  RotateCcw, 
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { aiService, AIChatMessage } from '../../services/aiService';
import { CalendarEvent } from '../../types';

interface AIAssistantViewProps {
  onAddEventDirect: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onNavigateToExplorer: (date: Date) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onAddEventDirect,
  onNavigateToExplorer
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `👋 Hello! I am your **Ali Calendar AI Assistant**.\n\nYou can ask me anything about:\n- 🗓️ **Scheduling**: *"Schedule meeting with team tomorrow at 3 PM"*\n- 🇮🇳 **Holidays & Festivals**: *"When is Diwali or Eid in 2026?"*\n- 🌙 **Sacred Ephemeris**: *"What is today's Islamic Hijri date and Panchang Tithi?"*\n- ⏳ **Chronology**: *"How many days until Indian Independence Day?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedEvents, setAddedEvents] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(text.trim());
      const assistantMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedEvent: response.parsedEvent || undefined
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: AIChatMessage = {
        id: `msg-ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'I could not connect to the remote AI engine, but I am ready to process your calendar requests locally.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = (msgId: string, eventData: Partial<CalendarEvent>) => {
    const defaultEvt: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      title: eventData.title || 'AI Scheduled Event',
      description: eventData.description || 'Created via Ali Calendar AI Assistant',
      date: eventData.date || new Date().toISOString().split('T')[0],
      startTime: eventData.startTime || '10:00',
      endTime: eventData.endTime || '11:00',
      allDay: eventData.allDay || false,
      category: eventData.category || 'personal',
      color: eventData.color || '#6366f1',
      priority: eventData.priority || 'medium',
      reminderMinutes: eventData.reminderMinutes || 15,
      repeat: eventData.repeat || 'none',
      isCompleted: false
    };

    onAddEventDirect(defaultEvt);
    setAddedEvents(prev => ({ ...prev, [msgId]: true }));
  };

  const QUICK_PROMPTS = [
    "What's special today?",
    "Schedule study session tomorrow at 4 PM",
    "Tell me about Indian Independence Day 2026",
    "What are the Panchang Tithi and Islamic Hijri today?"
  ];

  return (
    <div id="ai-assistant-view" className="space-y-4 animate-fade-in max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-indigo-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Ali Calendar AI Assistant</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini Powered
              </span>
            </h1>
            <p className="text-xs text-indigo-200">
              Natural language date planner, astronomical query engine & festival expert.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
          title="Clear Conversation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
            }`}>
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Event parsed action card */}
              {msg.suggestedEvent && (
                <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                      Parsed Calendar Task
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {msg.suggestedEvent.date}
                    </span>
                  </div>
                  <p className="font-bold text-xs">{msg.suggestedEvent.title}</p>
                  <p className="text-[11px] text-slate-500">
                    Time: {msg.suggestedEvent.startTime || 'All Day'} • Category: {msg.suggestedEvent.category}
                  </p>

                  <button
                    onClick={() => handleAddEvent(msg.id, msg.suggestedEvent!)}
                    disabled={addedEvents[msg.id]}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      addedEvents[msg.id]
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {addedEvents[msg.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Calendar!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Directly to Calendar</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className={`text-[9px] pt-1 ${msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium text-slate-400 ml-1">Analyzing calendar ephemeris...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap text-xs font-medium transition-colors border border-slate-200/60 dark:border-slate-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI anything about dates or schedule a task..."
          className="flex-1 px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/30"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

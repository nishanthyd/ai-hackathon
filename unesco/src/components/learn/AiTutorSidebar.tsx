import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, Layers, Lightbulb } from 'lucide-react';
import { sendTutorMessage } from '../../utils/videoSearchApi';

interface Message {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
}

interface AiTutorSidebarProps {
  topic: string;
  currentMode: string;
  difficulty?: string;
}

export default function AiTutorSidebar({ topic, currentMode, difficulty = 'Intermediate' }: AiTutorSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: `Hello! I'm your Same-Screen AI Tutor (Groq AI). I'm following along with your lesson on **${topic}** (${difficulty} level). Ask me anything or tap one of the chips below!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleActionChip = async (action: 'simplify' | 'example' | 'visual' | 'quiz', label: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: label };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const replyText = await sendTutorMessage(topic, label, action, difficulty);
    setIsTyping(false);
    setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'tutor', text: replyText }]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;
    const text = inputText.trim();
    setInputText('');

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const replyText = await sendTutorMessage(topic, text, 'chat', difficulty);
    setIsTyping(false);
    setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'tutor', text: replyText }]);
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#0C1528]/95 p-6 shadow-soft backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent2/10 text-accent2 border border-accent2/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-textHigh">Same-Screen AI Tutor</h3>
            <p className="text-xs text-accent2 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Context: {topic}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-1 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-accent2 text-black font-medium rounded-tr-none'
                  : 'bg-white/5 text-textHigh border border-white/10 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-xs text-textMid border border-white/10">
              <Sparkles className="h-4 w-4 animate-spin text-accent2" />
              <span>AI Tutor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Chips */}
      <div className="border-t border-white/10 pt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-textMid">Instant Tutor Actions:</p>
        <div className="flex flex-wrap gap-2 pb-3">
          <button
            onClick={() => handleActionChip('simplify', '[Simplify]')}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simplify</span>
          </button>

          <button
            onClick={() => handleActionChip('example', '[Give Example]')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Give Example</span>
          </button>

          <button
            onClick={() => handleActionChip('visual', '[Explain Visually]')}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Explain Visually</span>
          </button>

          <button
            onClick={() => handleActionChip('quiz', '[Quiz Me]')}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Quiz Me</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about what you're learning..."
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-textHigh placeholder-textMid focus:border-accent2 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent2 text-black hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

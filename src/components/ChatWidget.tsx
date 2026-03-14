"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Minimize2, User, GraduationCap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UserData {
  name: string;
  phone: string;
  userType: 'student' | 'parent' | 'public' | '';
  course: string;
}

export default function KGIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', phone: '', userType: '', course: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = "Namaste! I'm KAIA - Koshys AI Assistant! 🎓\n\nI'm here to help you with:\n• Admissions & Enquiries\n• Course Details\n• Campus Information\n• Fee Details\n\nHow can I assist you today?";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: '1', role: 'assistant', content: welcomeMessage }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      const data = await res.json();
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.reply 
      };
      setMessages(prev => [...prev, botMsg]);

      if (text.toLowerCase().includes('admission') || text.toLowerCase().includes('apply')) {
        setTimeout(() => setShowForm(true), 1000);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please call 808 866 0000 for assistance.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const submitUserData = async () => {
    if (!userData.name || !userData.phone || !userData.userType) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Thank you! Our admission team will contact you shortly at ' + userData.phone + '. You can also call 808 866 0000 for immediate assistance.' 
      }]);
      setShowForm(false);
      setUserData({ name: '', phone: '', userType: '', course: '' });
    } catch (error) {
      alert('Failed to submit. Please call 808 866 0000 directly.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#a91f23] text-white p-4 rounded-full shadow-lg hover:bg-[#ffa84a] transition-all z-50 flex items-center gap-2"
      >
        <MessageCircle size={24} />
        <span className="font-medium">Chat with AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="bg-[#a91f23] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">KAIA</h3>
                  <p className="text-xs text-white/70">Online | Powered by AI</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <Minimize2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#a91f23] text-white rounded-br-md' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}>
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {showForm ? (
              <div className="p-4 bg-white border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">📝 Please share your details for follow-up</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Your Name *"
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#a91f23] outline-none"
                    value={userData.name}
                    onChange={e => setUserData({...userData, name: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Mobile Number *"
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#a91f23] outline-none"
                    value={userData.phone}
                    onChange={e => setUserData({...userData, phone: e.target.value})}
                  />
                  <select 
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#a91f23] outline-none"
                    value={userData.userType}
                    onChange={e => setUserData({...userData, userType: e.target.value as any})}
                  >
                    <option value="">I am a *</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="public">General Public</option>
                  </select>
                  <select 
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#a91f23] outline-none"
                    value={userData.course}
                    onChange={e => setUserData({...userData, course: e.target.value})}
                  >
                    <option value="">Interested Course</option>
                    <option value="BBA">BBA</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Sc Nursing">B.Sc Nursing</option>
                    <option value="GNM">GNM Nursing</option>
                    <option value="M.Sc Nursing">M.Sc Nursing</option>
                    <option value="Hotel Management">Hotel Management</option>
                    <option value="Other">Other</option>
                  </select>
                  <button 
                    onClick={submitUserData}
                    className="w-full bg-[#a91f23] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#ffa84a]"
                  >
                    Submit Details
                  </button>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="w-full text-gray-500 text-xs py-1"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#a91f23] outline-none"
                  />
                  <button 
                    onClick={() => sendMessage(input)}
                    disabled={loading}
                    className="bg-[#a91f23] text-white p-2 rounded-lg hover:bg-[#ffa84a] disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex justify-center gap-4 mt-3">
                  <a href="tel:8088660000" className="flex items-center gap-1 text-xs text-[#a91f23]">
                    <Phone size={14} /> Call Now
                  </a>
                  <a href="https://apply.kgi.edu.in" target="_blank" className="text-xs text-[#a91f23] font-medium">
                    Apply Now →
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
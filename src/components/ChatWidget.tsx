"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Minimize2, GraduationCap, CheckCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type CollectionStep = 'name' | 'phone' | 'course' | 'done';

const courses = [
  "BBA", "BCA", "B.Com", "MBA", "MCA", 
  "B.Sc Nursing", "GNM Nursing", "M.Sc Nursing", 
  "Hotel Management", "B.Sc Radiology", "Other"
];

export default function KGIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectionStep, setCollectionStep] = useState<CollectionStep>('name');
  const [userData, setUserData] = useState({ name: '', phone: '', course: '' });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-IN');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const welcomeMessage = "Namaste! 🙏 I'm Kaia - your admission assistant at Koshys Group of Institutions.\n\nTo give you the best guidance, may I know your name?";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: '1', role: 'assistant', content: welcomeMessage }]);
      setTimeout(() => speak(welcomeMessage), 500);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = speechLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const saveToSheets = async (data: any) => {
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userType: 'student' })
      });
    } catch (e) {
      console.error('Failed to save to sheets:', e);
    }
  };

  const handleNameSubmit = async (name: string) => {
    const updatedData = { ...userData, name };
    setUserData(updatedData);
    setCollectionStep('phone');
    
    const response = `Nice to meet you, ${name}! 📱\n\nCould you share your mobile number?`;
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: name },
      { id: (Date.now()+1).toString(), role: 'assistant', content: response }
    ]);
    speak(response);
  };

  const handlePhoneSubmit = async (phone: string) => {
    const updatedData = { ...userData, phone };
    setUserData(updatedData);
    await saveToSheets(updatedData);
    setCollectionStep('course');
    
    const response = `Got it! 📚\n\nWhich course are you interested in?`;
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: phone },
      { id: (Date.now()+1).toString(), role: 'assistant', content: response }
    ]);
    speak(response);
  };

  const handleCourseSubmit = async (course: string) => {
    const updatedData = { ...userData, course };
    setUserData(updatedData);
    await saveToSheets(updatedData);
    setCollectionStep('done');
    
    const response = `Perfect! ${course} is a great choice! 🎓\n\nOur admission team will call you at ${userData.phone} shortly.\n\nIs there anything else you'd like to know about KGI?`;
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: course },
      { id: (Date.now()+1).toString(), role: 'assistant', content: response }
    ]);
    speak(response);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    if (collectionStep === 'name') {
      handleNameSubmit(text);
      setInput('');
      return;
    }
    if (collectionStep === 'phone') {
      handlePhoneSubmit(text);
      setInput('');
      return;
    }
    if (collectionStep === 'course') {
      handleCourseSubmit(text);
      setInput('');
      return;
    }
    
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
      speak(data.reply);
    } catch (error) {
      const errorMsg = 'Sorry, I encountered an error. Please call 808 866 0000 for assistance.';
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: errorMsg 
      }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (collectionStep === 'name') return 'Your name please...';
    if (collectionStep === 'phone') return 'Your mobile number...';
    if (collectionStep === 'course') return 'Type course name...';
    return 'Ask me anything...';
  };

  const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ' },
    { code: 'ta-IN', name: 'தமிழ்' },
    { code: 'te-IN', name: 'తెలుగు' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#a91f23] text-white p-4 rounded-full shadow-lg hover:bg-[#ffa84a] transition-all z-50 flex items-center gap-2"
      >
        <MessageCircle size={24} />
        <span className="font-medium">Chat with Kaia</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="bg-[#a91f23] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Kaia</h3>
                  <p className="text-xs text-white/70">
                    {collectionStep === 'done' ? 'Ready to help!' : 'Gathering details...'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={speechLang} 
                  onChange={(e) => setSpeechLang(e.target.value)}
                  className="text-xs bg-white/20 text-white rounded px-1 py-0.5 outline-none cursor-pointer"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-black">{lang.name}</option>
                  ))}
                </select>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <Minimize2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X size={18} />
                </button>
              </div>
            </div>

            {collectionStep !== 'done' && (
              <div className="bg-[#ffe9c6] px-4 py-2 flex items-center gap-2 text-xs text-[#a91f23]">
                <CheckCircle size={14} />
                <span>{collectionStep === 'name' ? 'Step 1 of 3' : collectionStep === 'phone' ? 'Step 2 of 3' : 'Step 3 of 3'}</span>
                {userData.name && <span>• {userData.name}</span>}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm cursor-pointer ${
                      msg.role === 'user' 
                        ? 'bg-[#a91f23] text-white rounded-br-md' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                    }`}
                    onClick={() => msg.role === 'assistant' && speak(msg.content)}
                  >
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

            {collectionStep !== 'done' && collectionStep === 'course' && (
              <div className="p-2 bg-white border-t flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {courses.map(course => (
                  <button
                    key={course}
                    onClick={() => handleCourseSubmit(course)}
                    className="px-3 py-1 text-xs bg-[#ffe9c6] text-[#a91f23] rounded-full hover:bg-[#ffa84a] hover:text-white transition-colors"
                  >
                    {course}
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2 items-center">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Speak"
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <input
                  type={collectionStep === 'phone' ? 'tel' : 'text'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder={getPlaceholder()}
                  className="flex-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#a91f23] outline-none"
                />

                <button 
                  onClick={() => sendMessage(input)}
                  disabled={loading || (collectionStep !== 'done' && !input.trim())}
                  className="bg-[#a91f23] text-white p-2 rounded-lg hover:bg-[#ffa84a] disabled:opacity-50"
                >
                  <Send size={20} />
                </button>

                <button
                  onClick={() => { const lastMsg = messages.filter(m => m.role === 'assistant').pop(); if (lastMsg) speak(lastMsg.content); }}
                  className={`p-2 rounded-lg transition-colors ${isSpeaking ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Listen"
                  disabled={messages.length === 0}
                >
                  {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              {collectionStep === 'done' && (
                <div className="flex justify-center gap-4 mt-3">
                  <a href="tel:8088660000" className="flex items-center gap-1 text-xs text-[#a91f23]">
                    <Phone size={14} /> Call
                  </a>
                  <a href="https://apply.kgi.edu.in" target="_blank" className="text-xs text-[#a91f23] font-medium">
                    Apply Now →
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
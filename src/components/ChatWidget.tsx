"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type CollectionStep = 'name' | 'phone' | 'course' | 'done';

const courses = [
  "BBA", "BCA", "B.Com", "MBA", "MCA", 
  "B.Sc Nursing", "GNM Nursing", "Hotel Management"
];

export default function KGIChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectionStep, setCollectionStep] = useState<CollectionStep>('name');
  const [userData, setUserData] = useState({ name: '', phone: '', course: '' });
  const [speechLang, setSpeechLang] = useState('en-IN');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = "Namaste! 🙏 I'm Kaia - your admission assistant at Koshys Group of Institutions.\n\nMay I know your name?";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: '1', role: 'assistant', content: welcomeMessage }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveToSheets = async (data: any) => {
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userType: 'student' })
      });
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  const handleNameSubmit = async (name: string) => {
    const updatedData = { ...userData, name };
    setUserData(updatedData);
    setCollectionStep('phone');
    
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: name },
      { id: (Date.now()+1).toString(), role: 'assistant', content: `Nice to meet you, ${name}! 📱\n\nCould you share your mobile number?` }
    ]);
  };

  const handlePhoneSubmit = async (phone: string) => {
    const updatedData = { ...userData, phone };
    setUserData(updatedData);
    await saveToSheets(updatedData);
    setCollectionStep('course');
    
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: phone },
      { id: (Date.now()+1).toString(), role: 'assistant', content: `Got it! 📚\n\nWhich course are you interested in?` }
    ]);
  };

  const handleCourseSubmit = async (course: string) => {
    const updatedData = { ...userData, course };
    setUserData(updatedData);
    await saveToSheets(updatedData);
    setCollectionStep('done');
    
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: course },
      { id: (Date.now()+1).toString(), role: 'assistant', content: `Perfect! ${course} is a great choice! 🎓\n\nOur admission team will call you at ${userData.phone} shortly.\n\nIs there anything else you'd like to know about KGI?` }
    ]);
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
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Sorry, please call 808 866 0000 for assistance.' 
      }]);
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

  const getProgressText = () => {
    if (collectionStep === 'name') return 'Step 1 of 3';
    if (collectionStep === 'phone') return 'Step 2 of 3';
    if (collectionStep === 'course') return 'Step 3 of 3';
    return '';
  };

  const handleClose = () => {
    if (embedded) {
      window.parent.postMessage({ type: 'CLOSE_KAIA' }, '*');
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Chat Window */}
      <div style={{
          position: 'fixed',
          bottom: embedded ? '0' : '90px',
          right: embedded ? '0' : '20px',
          width: embedded ? '100%' : '350px',
          height: embedded ? '100%' : '480px',
          maxWidth: '100vw',
          maxHeight: '100vh',
          background: 'white',
          borderRadius: embedded ? '0' : '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 99999,
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #a91f23 0%, #7d1418 100%)',
            padding: '12px 15px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Kaia</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Koshys Group of Institutions</div>
            </div>
            
            {/* Language Selector */}
            <select
              value={speechLang}
              onChange={(e) => setSpeechLang(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="en" style={{ color: 'black' }}>English</option>
              <option value="hi" style={{ color: 'black' }}>हिंदी</option>
              <option value="kn" style={{ color: 'black' }}>ಕನ್ನಡ</option>
              <option value="ta" style={{ color: 'black' }}>தமிழ்</option>
              <option value="te" style={{ color: 'black' }}>తెలుగు</option>
            </select>
            
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px',
                fontSize: '16px',
                opacity: 0.8,
              }}
            >
              ✕
            </button>
          </div>

          {/* Progress */}
          {collectionStep !== 'done' && (
            <div style={{
              background: '#fff8e6',
              padding: '8px 15px',
              fontSize: '11px',
              color: '#a91f23',
              fontWeight: 500,
            }}>
              {getProgressText()}
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  background: msg.role === 'user' ? '#a91f23' : 'white',
                  color: msg.role === 'user' ? 'white' : '#212529',
                  border: msg.role === 'assistant' ? '1px solid #e9ecef' : 'none',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '3px' : '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '3px' : '12px',
                }}
              >
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: i > 0 ? '4px 0 0' : 0 }}>{line}</p>
                ))}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'white',
                border: '1px solid #e9ecef',
              }}>
                <span style={{ animation: 'bounce 1s infinite', margin: '0 2px' }}>•</span>
                <span style={{ animation: 'bounce 1s infinite 0.2s', margin: '0 2px' }}>•</span>
                <span style={{ animation: 'bounce 1s infinite 0.4s', margin: '0 2px' }}>•</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Course Buttons */}
          {collectionStep === 'course' && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '10px',
              background: 'white',
              borderTop: '1px solid #e9ecef',
            }}>
              {courses.map(course => (
                <button
                  key={course}
                  onClick={() => handleCourseSubmit(course)}
                  style={{
                    padding: '6px 12px',
                    background: '#fff8e6',
                    color: '#a91f23',
                    border: '1px solid #a91f23',
                    borderRadius: '15px',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {course}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px',
            background: 'white',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            {/* Mic Button */}
            <button
              onClick={() => {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                  alert('Voice input not supported. Use Chrome.');
                  return;
                }
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = speechLang;
                recognition.onresult = (event: any) => {
                  setInput(event.results[0][0].transcript);
                };
                recognition.start();
              }}
              style={{
                width: '36px',
                height: '36px',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Voice input"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
            
            <input
              type={collectionStep === 'phone' ? 'tel' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder={getPlaceholder()}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #dee2e6',
                borderRadius: '20px',
                outline: 'none',
                fontSize: '13px',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                width: '38px',
                height: '38px',
                background: '#a91f23',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" x2="11" y1="2" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
            
            {/* Speaker Button */}
            <button
              onClick={() => {
                const lastBotMsg = messages.filter(m => m.role === 'assistant').pop();
                if (lastBotMsg) {
                  const utterance = new SpeechSynthesisUtterance(lastBotMsg.content);
                  utterance.lang = speechLang;
                  window.speechSynthesis.speak(utterance);
                }
              }}
              style={{
                width: '36px',
                height: '36px',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Listen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          {collectionStep === 'done' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              padding: '10px',
              background: 'white',
              borderTop: '1px solid #e9ecef',
            }}>
              <a href="tel:8088660000" style={{ fontSize: '12px', color: '#a91f23', textDecoration: 'none', fontWeight: 500 }}>
                📞 Call Now
              </a>
              <a href="https://apply.kgi.edu.in" target="_blank" style={{ fontSize: '12px', color: '#a91f23', textDecoration: 'none', fontWeight: 500 }}>
                📝 Apply Now
              </a>
            </div>
          )}
        </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
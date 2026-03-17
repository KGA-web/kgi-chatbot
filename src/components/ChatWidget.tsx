"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type CollectionStep = 'name' | 'phone' | 'course' | 'done';

const countryCodes = [
  { code: '+93', country: 'Afghanistan' },
  { code: '+355', country: 'Albania' },
  { code: '+213', country: 'Algeria' },
  { code: '+1-268', country: 'Antigua & Barbuda' },
  { code: '+54', country: 'Argentina' },
  { code: '+374', country: 'Armenia' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+1-242', country: 'Bahamas' },
  { code: '+973', country: 'Bahrain' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+1-246', country: 'Barbados' },
  { code: '+375', country: 'Belarus' },
  { code: '+32', country: 'Belgium' },
  { code: '+501', country: 'Belize' },
  { code: '+229', country: 'Benin' },
  { code: '+975', country: 'Bhutan' },
  { code: '+591', country: 'Bolivia' },
  { code: '+387', country: 'Bosnia & Herzegovina' },
  { code: '+267', country: 'Botswana' },
  { code: '+55', country: 'Brazil' },
  { code: '+673', country: 'Brunei' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+257', country: 'Burundi' },
  { code: '+855', country: 'Cambodia' },
  { code: '+237', country: 'Cameroon' },
  { code: '+1', country: 'Canada' },
  { code: '+238', country: 'Cape Verde' },
  { code: '+1-345', country: 'Cayman Islands' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+235', country: 'Chad' },
  { code: '+56', country: 'Chile' },
  { code: '+86', country: 'China' },
  { code: '+57', country: 'Colombia' },
  { code: '+269', country: 'Comoros' },
  { code: '+243', country: 'Congo' },
  { code: '+682', country: 'Cook Islands' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+385', country: 'Croatia' },
  { code: '+53', country: 'Cuba' },
  { code: '+357', country: 'Cyprus' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45', country: 'Denmark' },
  { code: '+253', country: 'Djibouti' },
  { code: '+1-767', country: 'Dominica' },
  { code: '+1-809', country: 'Dominican Republic' },
  { code: '+670', country: 'East Timor' },
  { code: '+593', country: 'Ecuador' },
  { code: '+20', country: 'Egypt' },
  { code: '+503', country: 'El Salvador' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+291', country: 'Eritrea' },
  { code: '+372', country: 'Estonia' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+500', country: 'Falkland Islands' },
  { code: '+298', country: 'Faroe Islands' },
  { code: '+679', country: 'Fiji' },
  { code: '+358', country: 'Finland' },
  { code: '+33', country: 'France' },
  { code: '+241', country: 'Gabon' },
  { code: '+220', country: 'Gambia' },
  { code: '+995', country: 'Georgia' },
  { code: '+49', country: 'Germany' },
  { code: '+233', country: 'Ghana' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+30', country: 'Greece' },
  { code: '+299', country: 'Greenland' },
  { code: '+1-473', country: 'Grenada' },
  { code: '+502', country: 'Guatemala' },
  { code: '+224', country: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+592', country: 'Guyana' },
  { code: '+509', country: 'Haiti' },
  { code: '+504', country: 'Honduras' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36', country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+91', country: 'India' },
  { code: '+62', country: 'Indonesia' },
  { code: '+98', country: 'Iran' },
  { code: '+964', country: 'Iraq' },
  { code: '+353', country: 'Ireland' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italy' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+1-876', country: 'Jamaica' },
  { code: '+81', country: 'Japan' },
  { code: '+962', country: 'Jordan' },
  { code: '+7', country: 'Kazakhstan' },
  { code: '+254', country: 'Kenya' },
  { code: '+686', country: 'Kiribati' },
  { code: '+965', country: 'Kuwait' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+856', country: 'Laos' },
  { code: '+371', country: 'Latvia' },
  { code: '+961', country: 'Lebanon' },
  { code: '+266', country: 'Lesotho' },
  { code: '+231', country: 'Liberia' },
  { code: '+218', country: 'Libya' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+370', country: 'Lithuania' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+853', country: 'Macau' },
  { code: '+389', country: 'Macedonia' },
  { code: '+261', country: 'Madagascar' },
  { code: '+265', country: 'Malawi' },
  { code: '+60', country: 'Malaysia' },
  { code: '+960', country: 'Maldives' },
  { code: '+223', country: 'Mali' },
  { code: '+356', country: 'Malta' },
  { code: '+692', country: 'Marshall Islands' },
  { code: '+222', country: 'Mauritania' },
  { code: '+230', country: 'Mauritius' },
  { code: '+52', country: 'Mexico' },
  { code: '+691', country: 'Micronesia' },
  { code: '+373', country: 'Moldova' },
  { code: '+377', country: 'Monaco' },
  { code: '+976', country: 'Mongolia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+1-664', country: 'Montserrat' },
  { code: '+212', country: 'Morocco' },
  { code: '+258', country: 'Mozambique' },
  { code: '+95', country: 'Myanmar' },
  { code: '+264', country: 'Namibia' },
  { code: '+674', country: 'Nauru' },
  { code: '+977', country: 'Nepal' },
  { code: '+31', country: 'Netherlands' },
  { code: '+599', country: 'Netherlands Antilles' },
  { code: '+64', country: 'New Zealand' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+227', country: 'Niger' },
  { code: '+234', country: 'Nigeria' },
  { code: '+683', country: 'Niue' },
  { code: '+850', country: 'North Korea' },
  { code: '+47', country: 'Norway' },
  { code: '+968', country: 'Oman' },
  { code: '+92', country: 'Pakistan' },
  { code: '+680', country: 'Palau' },
  { code: '+970', country: 'Palestine' },
  { code: '+507', country: 'Panama' },
  { code: '+675', country: 'Papua New Guinea' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Peru' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+1-787', country: 'Puerto Rico' },
  { code: '+974', country: 'Qatar' },
  { code: '+242', country: 'Republic of the Congo' },
  { code: '+40', country: 'Romania' },
  { code: '+7', country: 'Russia' },
  { code: '+250', country: 'Rwanda' },
  { code: '+1-869', country: 'Saint Kitts & Nevis' },
  { code: '+1-758', country: 'Saint Lucia' },
  { code: '+1-784', country: 'Saint Vincent & Grenadines' },
  { code: '+685', country: 'Samoa' },
  { code: '+378', country: 'San Marino' },
  { code: '+239', country: 'Sao Tome & Principe' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+221', country: 'Senegal' },
  { code: '+381', country: 'Serbia' },
  { code: '+248', country: 'Seychelles' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+65', country: 'Singapore' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+677', country: 'Solomon Islands' },
  { code: '+252', country: 'Somalia' },
  { code: '+27', country: 'South Africa' },
  { code: '+82', country: 'South Korea' },
  { code: '+211', country: 'South Sudan' },
  { code: '+34', country: 'Spain' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+1-249', country: 'Sudan' },
  { code: '+597', country: 'Suriname' },
  { code: '+268', country: 'Swaziland' },
  { code: '+46', country: 'Sweden' },
  { code: '+41', country: 'Switzerland' },
  { code: '+963', country: 'Syria' },
  { code: '+886', country: 'Taiwan' },
  { code: '+992', country: 'Tajikistan' },
  { code: '+255', country: 'Tanzania' },
  { code: '+66', country: 'Thailand' },
  { code: '+228', country: 'Togo' },
  { code: '+690', country: 'Tokelau' },
  { code: '+676', country: 'Tonga' },
  { code: '+1-868', country: 'Trinidad & Tobago' },
  { code: '+216', country: 'Tunisia' },
  { code: '+90', country: 'Turkey' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+1-649', country: 'Turks & Caicos Islands' },
  { code: '+688', country: 'Tuvalu' },
  { code: '+1-340', country: 'U.S. Virgin Islands' },
  { code: '+1', country: 'USA' },
  { code: '+971', country: 'UAE' },
  { code: '+44', country: 'UK' },
  { code: '+380', country: 'Ukraine' },
  { code: '+256', country: 'Uganda' },
  { code: '+598', country: 'Uruguay' },
  { code: '+998', country: 'Uzbekistan' },
  { code: '+678', country: 'Vanuatu' },
  { code: '+379', country: 'Vatican City' },
  { code: '+58', country: 'Venezuela' },
  { code: '+84', country: 'Vietnam' },
  { code: '+1-284', country: 'British Virgin Islands' },
  { code: '+967', country: 'Yemen' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
];

const courses = [
  "BBA", "BCA", "B.Com", "MBA", "MCA", 
  "B.Sc Nursing", "GNM Nursing", "Hotel Management"
];

const STORAGE_KEY = 'kgi_user_data';

function validateIndianPhone(phone: string): { valid: boolean; error: string } {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length !== 10) {
    return { valid: false, error: 'Phone number must be exactly 10 digits' };
  }
  
  if (!/^[6-9]/.test(digits)) {
    return { valid: false, error: 'Phone number must start with 6, 7, 8, or 9' };
  }
  
  const invalidNumbers = [
    '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
    '5555555555', '6666666666', '7777777777', '8888888888', '9999999999',
    '1234567890', '9876543210', '0123456789', '0987654321'
  ];
  
  if (invalidNumbers.includes(digits)) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }
  
  const repeatedPairs = /(.).*\1.*\1/;
  if (repeatedPairs.test(digits)) {
    return { valid: false, error: 'Phone number cannot have too many repeated digits' };
  }
  
  return { valid: true, error: '' };
}

export default function KGIChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectionStep, setCollectionStep] = useState<CollectionStep>('name');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneError, setPhoneError] = useState('');
  const [userData, setUserData] = useState({ name: '', phone: '', course: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = "Namaste! 🙏 I'm Kaia - your admission assistant at Koshys Group of Institutions.\n\nMay I know your name?";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.name && parsed.phone && parsed.course) {
            setUserData(parsed);
            setCollectionStep('done');
            setMessages([{ 
              id: '1', 
              role: 'assistant', 
              content: `Welcome back, ${parsed.name}! 👋\n\nYou previously registered for ${parsed.course}.\n\nIs there anything else you'd like to know about KGI?` 
            }]);
            return;
          }
        } catch (e) {
          console.error('Failed to parse saved data', e);
        }
      }
      setMessages([{ id: '1', role: 'assistant', content: welcomeMessage }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (collectionStep === 'done' && userData.name && userData.phone && userData.course) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [collectionStep, userData]);

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
    const digits = phone.replace(/\D/g, '');
    const validation = validateIndianPhone(digits);
    
    if (!validation.valid) {
      setPhoneError(validation.error);
      return;
    }
    
    const fullPhone = countryCode + digits;
    setPhoneError('');
    setUserData({ ...userData, phone: fullPhone });
    
    try {
      const res = await fetch(`/api/sheets?phone=${encodeURIComponent(fullPhone)}`);
      const data = await res.json();
      
      if (data.found) {
        setCollectionStep('course');
        setMessages(prev => [...prev, 
          { id: Date.now().toString(), role: 'user', content: fullPhone },
          { id: (Date.now()+1).toString(), role: 'assistant', content: `Welcome back, ${data.name}! 👋\n\nYou previously inquired about ${data.course || 'our courses'}.\n\nAre you still interested? Or would you like to know about other courses?` }
        ]);
      } else {
        setCollectionStep('course');
        setMessages(prev => [...prev, 
          { id: Date.now().toString(), role: 'user', content: fullPhone },
          { id: (Date.now()+1).toString(), role: 'assistant', content: `Got it! 📚\n\nWhich course are you interested in?` }
        ]);
      }
    } catch (e) {
      setCollectionStep('course');
      setMessages(prev => [...prev, 
        { id: Date.now().toString(), role: 'user', content: fullPhone },
        { id: (Date.now()+1).toString(), role: 'assistant', content: `Got it! 📚\n\nWhich course are you interested in?` }
      ]);
    }
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
    if (collectionStep === 'phone') return 'Mobile number (without 0)';
    if (collectionStep === 'course') return 'Type course name...';
    return 'Ask me anything...';
  };

  const getProgressText = () => {
    if (collectionStep === 'name') return 'Step 1 of 3';
    if (collectionStep === 'phone') return 'Step 2 of 3';
    if (collectionStep === 'course') return 'Step 3 of 3';
    return '';
  };

  const handleMinimize = () => {
    if (embedded) {
      window.parent.postMessage({ type: 'MINIMIZE_KAIA' }, '*');
    } else {
      setIsOpen(false);
    }
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
              overflow: 'hidden',
            }}>
              <img src="/ai.png" alt="Kaia" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Kaia</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Koshys Group of Institutions</div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleMinimize}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px',
                  fontSize: '14px',
                  opacity: 0.8,
                }}
                title="Minimize"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="4 14 10 14 10 20"/>
                  <polyline points="20 10 14 10 14 4"/>
                  <line x1="14" y1="10" x2="21" y2="3"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
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
                title="Close"
              >
                ✕
              </button>
            </div>
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
            flexDirection: 'column',
            gap: '8px',
          }}>
            {phoneError && (
              <div style={{ color: '#dc3545', fontSize: '11px', padding: '4px 8px', background: '#fff5f5', borderRadius: '4px' }}>
                {phoneError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {collectionStep === 'phone' && (
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    padding: '10px 8px',
                    border: '1px solid #dee2e6',
                    borderRadius: '20px',
                    outline: 'none',
                    fontSize: '13px',
                    background: '#f8f9fa',
                  }}
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>{cc.code}</option>
                  ))}
                </select>
              )}
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
            </div>
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
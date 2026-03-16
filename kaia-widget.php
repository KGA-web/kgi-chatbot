<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kaia - KGI Assistant</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; }
    
    .kaia-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
    }
    
    .kaia-toggle {
      width: 60px;
      height: 60px;
      background: linear-gradient(249deg, #a91f23 0%, #7d1418 100%);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: transform 0.3s;
    }
    
    .kaia-toggle:hover {
      transform: scale(1.1);
    }
    
    .kaia-toggle img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    
    .kaia-chat {
      display: none;
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 360px;
      height: 520px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.3);
      overflow: hidden;
      flex-direction: column;
    }
    
    .kaia-chat.open {
      display: flex;
    }
    
    .kaia-header {
      background: linear-gradient(249deg, #a91f23 0%, #7d1418 100%);
      color: white;
      padding: 12px 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .kaia-header img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
    }
    
    .kaia-header-info h3 {
      font-size: 15px;
      font-weight: 600;
    }
    
    .kaia-header-info p {
      font-size: 10px;
      opacity: 0.8;
    }
    
    .kaia-header-close {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
    }
    
    .kaia-progress {
      background: #ffe9c6;
      padding: 8px 15px;
      font-size: 11px;
      color: #a91f23;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .kaia-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: #f9f9f9;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .kaia-msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 15px;
      font-size: 13px;
      line-height: 1.4;
    }
    
    .kaia-msg.bot {
      background: white;
      border: 1px solid #eee;
      align-self: flex-start;
      border-bottom-left-radius: 3px;
    }
    
    .kaia-msg.user {
      background: #a91f23;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }
    
    .kaia-courses {
      display: none;
      padding: 10px;
      background: white;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .kaia-courses.show {
      display: flex;
    }
    
    .kaia-course-btn {
      padding: 6px 12px;
      background: #ffe9c6;
      color: #a91f23;
      border: none;
      border-radius: 15px;
      font-size: 11px;
      cursor: pointer;
    }
    
    .kaia-course-btn:hover {
      background: #ffa84a;
      color: white;
    }
    
    .kaia-input-area {
      padding: 12px;
      background: white;
      border-top: 1px solid #eee;
      display: flex;
      gap: 8px;
    }
    
    .kaia-input-area input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
      font-size: 13px;
    }
    
    .kaia-input-area input:focus {
      border-color: #a91f23;
    }
    
    .kaia-send-btn {
      width: 40px;
      height: 40px;
      background: #a91f23;
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .kaia-send-btn:hover {
      background: #ffa84a;
    }
    
    .kaia-actions {
      display: none;
      justify-content: center;
      gap: 15px;
      padding: 10px;
      background: white;
      border-top: 1px solid #eee;
    }
    
    .kaia-actions.show {
      display: flex;
    }
    
    .kaia-actions a {
      font-size: 12px;
      color: #a91f23;
      text-decoration: none;
    }
    
    @media (max-width: 480px) {
      .kaia-chat {
        width: calc(100vw - 20px);
        right: 10px;
        bottom: 80px;
        height: calc(100vh - 120px);
      }
      .kaia-toggle {
        width: 55px;
        height: 55px;
      }
    }
  </style>
</head>
<body>
  <div class="kaia-widget">
    <div class="kaia-toggle" onclick="toggleKaia()">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'/%3E%3C/svg%3E" alt="Chat">
    </div>
    
    <div class="kaia-chat" id="kaiaChat">
      <div class="kaia-header">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z'/%3E%3Cpath d='M22 10v6'/%3E%3Cpath d='M6 12.5V16a6 3 0 0 0 12 0v-3.5'/%3E%3C/svg%3E" alt="Kaia">
        <div class="kaia-header-info">
          <h3>Kaia</h3>
          <p id="kaiaStatus">Gathering details...</p>
        </div>
        <button class="kaia-header-close" onclick="toggleKaia()">✕</button>
      </div>
      
      <div class="kaia-progress" id="kaiaProgress">
        <span>✓</span>
        <span id="kaiaProgressText">Step 1 of 3</span>
      </div>
      
      <div class="kaia-messages" id="kaiaMessages"></div>
      
      <div class="kaia-courses" id="kaiaCourses"></div>
      
      <div class="kaia-input-area">
        <input type="text" id="kaiaInput" placeholder="Your name please..." onkeypress="if(event.key==='Enter')sendKaia()">
        <button class="kaia-send-btn" onclick="sendKaia()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      
      <div class="kaia-actions" id="kaiaActions">
        <a href="tel:8088660000">📞 Call</a>
        <a href="https://apply.kgi.edu.in" target="_blank">📝 Apply Now</a>
      </div>
    </div>
  </div>

  <script>
    // ===================== CONFIG =====================
    const GROQ_API_KEY = 'YOUR_GROQ_API_KEY';
    const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
    // ================================================
    
    let kaiaStep = 'name', kaiaUser = {name:'',phone:'',course:''}, kaiaMsgs = [], kaiaLang = 'en-IN';
    const kaiaCourses = ['BBA','BCA','B.Com','MBA','MCA','B.Sc Nursing','GNM Nursing','Hotel Management'];
    
    const kaiaTxt = {
      'en-IN': {name:"Your name please...",phone:"Your mobile number...",course:"Which course?",welcome:"Namaste! 🙏 I'm Kaia - your admission assistant.\n\nMay I know your name?",nice:"Nice to meet you",gotIt:"Got it!",perfect:"Perfect! Our team will call you shortly.\n\nAnything else?",ready:"Ready to help!"},
      'hi-IN': {name:"आपका नाम?",phone:"मोबाइल नंबर?",course:"कौन सा कोर्स?",welcome:"नमस्ते! 🙏 मैं Kaia हूं।\n\nआपका नाम बताइए?",nice:"मिलकर अच्छा लगा",gotIt:"ठीक है!",perfect:"बढ़िया! हमारी टीम जल्दी कॉल करेगी।",ready:"मदद के लिए तैयार!"},
      'kn-IN': {name:"ಹೆಸರು?",phone:"ಮೊಬೈಲ್?",course:"ಯಾವ ಕೋರ್ಸ್?",welcome:"ನಮಸ್ತೆ! 🙏 ನಾನು Kaia.\n\nಹೆಸರು ತಿಳಿಸಿ?",nice:"ಭೇಟಿ ಮಾಡಿ ಸಂತೋಷ",gotIt:"ಅರ್ಥ",perfect:"ಪರಿಪೂರ್ಣ! ತಂಡ ಕರೆ ಮಾಡುತ್ತದೆ.",ready:"ಸಹಾಯಕ್ಕೆ ಸಿದ್ಧ!"},
    };
    
    function kaiaT(k){ return kaiaTxt[kaiaLang]?.[k] || kaiaTxt['en-IN'][k]; }
    
    function toggleKaia(){
      document.getElementById('kaiaChat').classList.toggle('open');
    }
    
    function kaiaAddMsg(text, sender){
      const div = document.createElement('div');
      div.className = 'kaia-msg '+sender;
      div.textContent = text;
      document.getElementById('kaiaMessages').appendChild(div);
      document.getElementById('kaiaMessages').scrollTop = document.getElementById('kaiaMessages').scrollHeight;
      kaiaMsgs.push({role:sender, content:text});
    }
    
    function kaiaUpdateProgress(){
      const bar = document.getElementById('kaiaProgress'), txt = document.getElementById('kaiaProgressText'), sta = document.getElementById('kaiaStatus');
      if(kaiaStep==='done'){ bar.style.display='none'; sta.textContent=kaiaT('ready'); document.getElementById('kaiaActions').classList.add('show'); return; }
      bar.style.display='flex';
      if(kaiaStep==='name'){ txt.textContent='Step 1 of 3'; }
      else if(kaiaStep==='phone'){ txt.textContent='Step 2 of 3'; }
      else if(kaiaStep==='course'){ txt.textContent='Step 3 of 3'; }
    }
    
    function kaiaShowCourses(){
      const c = document.getElementById('kaiaCourses');
      c.innerHTML = '';
      kaiaCourses.forEach(x=>{
        const b = document.createElement('button');
        b.className = 'kaia-course-btn';
        b.textContent = x;
        b.onclick = () => { document.getElementById('kaiaInput').value = x; sendKaia(); };
        c.appendChild(b);
      });
      c.classList.add('show');
    }
    
    function kaiaSave(){
      if(SHEET_URL && SHEET_URL!=='YOUR_GOOGLE_APPS_SCRIPT_URL'){
        fetch(SHEET_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(kaiaUser)}).catch(()=>{});
      }
    }
    
    function kaiaGetAI(q){
      const lowerQ = q.toLowerCase();
      let response = '';
      
      if(lowerQ.includes('fee') || lowerQ.includes('cost')){
        response = 'For fee details, call 808 866 0000 or visit https://apply.kgi.edu.in';
      }else if(lowerQ.includes('course')){
        response = 'We offer: BBA, BCA, B.Com, MBA, MCA, B.Sc Nursing, GNM, Hotel Management. Which interests you?';
      }else if(lowerQ.includes('location') || lowerQ.includes('address')){
        response = 'KGI: #31/1, Hennur-Bagalur Road, Kannur P.O., Bengaluru, Karnataka 562149';
      }else if(lowerQ.includes('contact') || lowerQ.includes('phone')){
        response = 'Call 808 866 0000 or email info@kgi.edu.in';
      }else if(lowerQ.includes('admission') || lowerQ.includes('apply')){
        response = 'Admissions open! Apply at https://apply.kgi.edu.in or call 808 866 0000';
      }else if(lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('namaste')){
        response = 'Namaste! How can I help you today?';
      }else{
        response = 'Thank you! For more details, call 808 866 0000 or visit https://apply.kgi.edu.in';
      }
      
      kaiaAddMsg(response, 'bot');
    }
    
    function sendKaia(){
      const input = document.getElementById('kaiaInput');
      const text = input.value.trim();
      if(!text) return;
      kaiaAddMsg(text, 'user');
      input.value = '';
      
      if(kaiaStep==='name'){
        kaiaUser.name = text;
        kaiaAddMsg(`${kaiaT('nice')}, ${text}! 📱\n\n${kaiaT('phone')}`, 'bot');
        kaiaStep = 'phone';
      }else if(kaiaStep==='phone'){
        kaiaUser.phone = text;
        kaiaSave();
        kaiaAddMsg(`${kaiaT('gotIt')} 📚\n\n${kaiaT('course')}`, 'bot');
        kaiaStep = 'course';
        kaiaShowCourses();
      }else if(kaiaStep==='course'){
        kaiaUser.course = text;
        kaiaSave();
        kaiaAddMsg(kaiaT('perfect'), 'bot');
        kaiaStep = 'done';
      }else{
        kaiaGetAI(text);
      }
      kaiaUpdateProgress();
      document.getElementById('kaiaInput').placeholder = kaiaT(kaiaStep);
    }
    
    // Initialize
    document.getElementById('kaiaChat').classList.add('open');
    kaiaAddMsg(kaiaT('welcome'), 'bot');
    kaiaUpdateProgress();
  </script>
</body>
</html>
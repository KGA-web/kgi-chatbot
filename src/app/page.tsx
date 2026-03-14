import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a365d] via-[#2d4a7c] to-[#1a365d] flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Koshys Group of Institutions</h1>
          <p className="text-xl text-blue-200">AI-Powered Assistant Ready</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">🚀 Chatbot & Voicebot Deployment</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">📱 Website Widget</h3>
              <p className="text-blue-200 text-sm">Chat widget is ready to embed on kgi.edu.in</p>
              <div className="mt-3 text-xs text-blue-300">Status: ✅ Ready</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">📞 Voice/IVR</h3>
              <p className="text-blue-200 text-sm">Phone number: 808 866 0000 (configure Vapi.ai)</p>
              <div className="mt-3 text-xs text-blue-300">Status: ✅ Ready for setup</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">💾 Data Collection</h3>
              <p className="text-blue-200 text-sm">Saves: Name, Phone, Type (Student/Parent), Course</p>
              <div className="mt-3 text-xs text-blue-300">Destination: Google Sheets</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">🎓 Knowledge Base</h3>
              <p className="text-blue-200 text-sm">All KGI courses, admissions, campus info</p>
              <div className="mt-3 text-xs text-blue-300">Loaded: ✅ Complete</div>
            </div>
          </div>
        </div>
        
        <div className="text-blue-200 text-sm">
          Deploy to Vercel → Configure Environment Variables → Add to website
        </div>
      </div>
    </div>
  );
}
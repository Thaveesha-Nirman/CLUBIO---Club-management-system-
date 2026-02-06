import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Zap, Shield, Globe, MessageSquare, 
  Calendar, Users, ChevronDown, ChevronUp, Sparkles, AlertCircle, X 
} from 'lucide-react';

import pattern from '../assets/pattern.png';
import logoNsbm from '../assets/logo_nsbm.png';

const Features = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [notification, setNotification] = useState(null);
  const footerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => { setIsAtBottom(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => { if (footerRef.current) observer.unobserve(footerRef.current); };
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleScroll = () => {
    if (isAtBottom) window.scrollTo({ top: 0, behavior: 'smooth' });
    else footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuresList = [
    { icon: Zap, title: "Real-time Feed", desc: "Stay updated with the latest club posts and campus announcements instantly." },
    { icon: Calendar, title: "Event Management", desc: "Discover upcoming events, view full details, and register with a single click." },
    { icon: Shield, title: "Secure Roles", desc: "Dedicated controls for Super Admins, Club Managers, and Students." },
    { icon: Users, title: "Member Discovery", desc: "Find and connect with fellow students across different faculties and batches." },
    { icon: Globe, title: "Centralized Hub", desc: "One global platform for all NSBM Green University clubs and societies." },
    { icon: MessageSquare, title: "Active Community", desc: "Engage with content through likes, comments, and direct club communication." }
  ];

  return (
    <div className="relative font-sans text-white selection:bg-emerald-500 selection:text-white">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        .font-montserrat { font-family: "Montserrat", sans-serif; font-weight: 700; }
        
        @keyframes slideIn { from { transform: translateY(-20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes pan-pattern { 0% { background-position: 0px 0px; } 100% { background-position: 1000px 1000px; } }
        .animate-pan-pattern { animation: pan-pattern 120s linear infinite; will-change: background-position; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 20s infinite; will-change: transform; }
        
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }

        html { scroll-behavior: smooth; }
      `}</style>

      {notification && (
        <div className="fixed top-24 right-6 z-[100] animate-slide-in">
          <div className={`relative overflow-hidden backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-5 flex items-center gap-4 min-w-[340px] ${notification.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${notification.type === 'success' ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>
              {notification.type === 'success' ? <Sparkles className="w-5 h-5 text-emerald-200" /> : <AlertCircle className="w-5 h-5 text-red-200" />}
            </div>
            <div className="flex-1"><h3 className="font-bold text-sm text-white">Feature Info</h3><p className="text-xs text-white/70 mt-0.5">{notification.message}</p></div>
            <button onClick={() => setNotification(null)}><X className="w-5 h-5 text-white/40 hover:text-white" /></button>
          </div>
        </div>
      )}
      
      <div className="fixed inset-0 z-[-50]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-teal-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="absolute inset-0 opacity-15 animate-pan-pattern" style={{ backgroundImage: `url(${pattern})`, backgroundSize: '800px', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="min-h-screen flex flex-col relative">
        <nav className={`relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="text-xl md:text-2xl font-bold tracking-wide flex items-center gap-4">
            <div className="p-2 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
               <img src={logoNsbm} alt="NSBM Logo" className="w-16 h-auto object-contain" />
            </div>
            <span className="hidden sm:inline tracking-widest text-lg border-l border-white/30 pl-4 font-montserrat uppercase">CLUBIO</span>
          </div>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-white font-bold hover:text-emerald-200 transition-all text-xs uppercase tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </button>
        </nav>

        <main className={`relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              Explore Our <br/> <span className="text-white drop-shadow-2xl">Features.</span>
            </h1>
            <p className="text-lg lg:text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed font-light">
              We provide a creative environment for students to manage their club activities, join events, and connect with peers through our secure portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {featuresList.map((f, i) => (
              <div 
                key={i} 
                onClick={() => showToast(`${f.title} is fully integrated.`, 'success')}
                className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5 p-8 hover:bg-white/10 transition-all duration-500 group cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-700 transition-all duration-500 shadow-xl">
                  <f.icon size={28} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 tracking-tight drop-shadow-md">{f.title}</h3>
                <p className="text-emerald-50/70 text-sm leading-relaxed font-light group-hover:text-white transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button onClick={toggleScroll} className="animate-bounce-slow opacity-70 hover:opacity-100 transition-all p-2">
          {isAtBottom ? <ChevronUp className="w-10 h-10 text-white drop-shadow-md" /> : <ChevronDown className="w-10 h-10 text-white drop-shadow-md" />}
        </button>
      </div>

      <footer ref={footerRef} className="relative z-10 w-full py-12 px-6 border-t border-white/10 backdrop-blur-md bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-emerald-100/70 tracking-wide">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
              <p className="font-bold text-white mb-1">© 2026 NSBM Green University</p>
              <p className="text-xs">Excellence in Education</p>
          </div>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Help & Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
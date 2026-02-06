import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, HelpCircle, ChevronDown, ChevronUp, 
  Calendar, Users, Edit3, Plus, Trash2, ShieldCheck,
  ChevronRight, Sparkles, AlertCircle, X
} from 'lucide-react';

import pattern from '../assets/pattern.png';
import logoNsbm from '../assets/logo_nsbm.png';

const Support = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [openFaq, setOpenFaq] = useState(null); 
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

  const toggleScroll = () => {
    if (isAtBottom) window.scrollTo({ top: 0, behavior: 'smooth' });
    else footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      icon: Plus,
      q: "How do I create a new club event?",
      a: "If you are a Club Manager, go to your Club Profile and click the '+ Event' button. Fill in the title, date, venue, and ticket price to publish it to the campus calendar."
    },
    {
      icon: Edit3,
      q: "Can I edit an event after posting?",
      a: "Yes. Navigate to the event in your club profile. Club admins have access to an 'Edit' option to update the description, time, or location details."
    },
    {
      icon: Trash2,
      q: "How do I cancel or delete an event?",
      a: "Club managers can delete events directly from the event card in the club profile. Note that deleting an event is permanent and will remove it from all student feeds."
    },
    {
      icon: Users,
      q: "How do I approve new club members?",
      a: "Go to your Club Profile and click 'Members'. Under the 'Requests' tab, you can view pending applications and approve or reject students who want to join."
    },
    {
      icon: ShieldCheck,
      q: "How do I register a brand new club?",
      a: "Go to the 'Explore' section and click 'Start a New Club'. Fill out the official application form. Once submitted, the Super Admin will review and approve your request."
    },
    {
        icon: Edit3,
        q: "How do I update my profile details?",
        a: "Navigate to 'Profile Settings' from the sidebar. You can update your bio, faculty, and department there. Don't forget to click 'Save Changes'!"
    }
  ];

  return (
    <div className="relative font-sans text-white selection:bg-emerald-500 selection:text-white">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        .font-montserrat { font-family: "Montserrat", sans-serif; font-weight: 700; }
        
        @keyframes slideIn { from { transform: translateY(-10px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes pan-pattern { 0% { background-position: 0px 0px; } 100% { background-position: 1000px 1000px; } }
        .animate-pan-pattern { animation: pan-pattern 120s linear infinite; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 20s infinite; }
        
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }

        html { scroll-behavior: smooth; }
      `}</style>
      
      <div className="fixed inset-0 z-[-50]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-5%] left-[-5%] w-[35rem] h-[35rem] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-40 animate-blob"></div>
          <div className="absolute bottom-[-5%] right-[-5%] w-[35rem] h-[35rem] bg-teal-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-40 animate-blob" style={{ animationDelay: '3s' }}></div>
        </div>
        <div className="absolute inset-0 opacity-15 animate-pan-pattern" style={{ backgroundImage: `url(${pattern})`, backgroundSize: '600px' }}></div>
      </div>

      <div className="min-h-screen flex flex-col relative">
        <nav className={`relative z-10 flex justify-between items-center p-6 max-w-6xl mx-auto w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="p-1.5 bg-white/90 rounded-lg shadow-lg backdrop-blur-sm">
               <img src={logoNsbm} alt="NSBM Logo" className="w-12 h-auto object-contain" />
            </div>
            <span className="hidden sm:inline tracking-widest text-base border-l border-white/30 pl-4 font-montserrat uppercase font-black">CLUBIO</span>
          </div>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-white font-bold hover:text-emerald-200 transition-all text-[10px] uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </button>
        </nav>

        <main className={`relative z-10 max-w-3xl mx-auto px-6 py-4 flex-grow w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5 p-8 md:p-12">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase mb-3">
                Help <span className="text-white drop-shadow-2xl">Center.</span>
              </h1>
              <p className="text-emerald-100/60 font-light tracking-[0.2em] uppercase text-[10px]">Campus Community Support</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black mb-4 flex items-center gap-2 px-2 uppercase tracking-[0.3em] text-white/40">
                <HelpCircle size={12} /> Frequently Asked Questions
              </h3>
              
              {faqs.map((faq, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 transition-all group">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/10 rounded-xl text-emerald-300 group-hover:bg-emerald-400 group-hover:text-emerald-950 transition-all duration-300">
                        <faq.icon size={16} />
                      </div>
                      <span className="font-bold text-sm tracking-tight text-white/90">{faq.q}</span>
                    </div>
                    {openFaq === i ? <ChevronUp size={16} className="text-emerald-400" /> : <ChevronDown size={16} className="text-white/20" />}
                  </button>
                  
                  {openFaq === i && (
                    <div className="px-6 pb-6 pt-0 animate-slide-in">
                      <div className="h-[1px] bg-white/10 w-full mb-4"></div>
                      <p className="text-emerald-50/70 text-xs leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-center">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Still need help?</p>
                <p className="text-xs text-white/50">Contact your Faculty Representative or visit the IT Student Center.</p>
            </div>

          </div>
        </main>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button onClick={toggleScroll} className="animate-bounce-slow opacity-70 hover:opacity-100 transition-all p-2">
          {isAtBottom ? <ChevronUp className="w-8 h-8 text-white drop-shadow-md" /> : <ChevronDown className="w-8 h-8 text-white drop-shadow-md" />}
        </button>
      </div>

      <footer ref={footerRef} className="relative z-10 w-full py-10 px-6 border-t border-white/10 backdrop-blur-md bg-black/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-emerald-100/50 tracking-wide text-center md:text-left">
          <div className="mb-4 md:mb-0">
              <p className="font-bold text-white mb-1">© 2026 NSBM Green University</p>
              <p className="opacity-50">Innovation Hub Support</p>
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white font-bold text-emerald-400 underline underline-offset-4 decoration-emerald-500/20">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
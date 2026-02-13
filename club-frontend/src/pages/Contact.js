import React, { useState, useEffect, useRef } from 'react';

/**
 * * Member 10 : Brand & Support
 * * Contact page with support channels and social links.
 */
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Clock,
  MessageCircle, ChevronDown, ChevronUp, Globe,
  Instagram, Linkedin, Twitter, ExternalLink, Send
} from 'lucide-react';

import pattern from '../assets/pattern.png';
import logoNsbm from '../assets/logo_nsbm.png';

const Contact = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
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

      <div className="fixed inset-0 z-[-50]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[90px] opacity-40 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-teal-400 rounded-full mix-blend-multiply filter blur-[90px] opacity-40 animate-blob" style={{ animationDelay: '2.5s' }}></div>
        </div>
        <div className="absolute inset-0 opacity-15 animate-pan-pattern" style={{ backgroundImage: `url(${pattern})`, backgroundSize: '800px', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="min-h-screen flex flex-col relative">
        <nav className={`relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="text-xl md:text-2xl font-bold tracking-wide flex items-center gap-4">
            <div className="p-2 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
              <img src={logoNsbm} alt="NSBM Logo" className="w-16 h-auto object-contain" />
            </div>
            <span className="hidden sm:inline tracking-widest text-lg border-l border-white/30 pl-4 font-montserrat uppercase font-black">CLUBIO</span>
          </div>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-white font-bold hover:text-emerald-200 transition-all text-xs uppercase tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </button>
        </nav>

        <main className={`relative z-10 max-w-7xl mx-auto px-6 py-8 flex-grow w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

          <div className="relative overflow-hidden rounded-[3rem] border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

            <div className="p-8 md:p-14 flex flex-col lg:flex-row gap-12 items-center">

              <div className="lg:w-1/2 space-y-10">
                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase leading-none mb-6">
                    Connect <br /> <span className="text-white drop-shadow-2xl">Officially.</span>
                  </h1>
                  <p className="text-emerald-100/70 font-light text-lg">
                    Have a technical issue or need official assistance? Use our primary contact channels to reach the team.
                  </p>
                </div>

                <div className="space-y-6">
                  <ContactInfo icon={Mail} label="Email Support" value="support@clubio.nsbm.lk" />
                  <ContactInfo icon={Phone} label="Hotline" value="+94 11 234 5678" />
                  <ContactInfo icon={MapPin} label="Location" value="Student Center, NSBM University" />
                  <ContactInfo icon={Clock} label="Response Time" value="Within 24 Hours" />
                </div>
              </div>

              <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SocialButton
                  icon={Instagram}
                  label="Instagram"
                  username="@nsbmclubio"
                  link="https://instagram.com"
                  color="bg-pink-600/20 text-pink-300"
                />
                <SocialButton
                  icon={Linkedin}
                  label="LinkedIn"
                  username="Clubio NSBM"
                  link="https://linkedin.com"
                  color="bg-blue-600/20 text-blue-300"
                />
                <SocialButton
                  icon={MessageCircle}
                  label="WhatsApp"
                  username="Official Group"
                  link="https://whatsapp.com"
                  color="bg-emerald-600/20 text-emerald-300"
                />
                <SocialButton
                  icon={Twitter}
                  label="X / Twitter"
                  username="@ClubioNSBM"
                  link="https://twitter.com"
                  color="bg-white/10 text-white"
                />
                <div className="sm:col-span-2">
                  <a
                    href="https://nsbm.ac.lk"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-6 flex items-center justify-between glass-panel rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Globe className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                      <div className="text-left">
                        <p className="text-xs font-black uppercase text-white/30 tracking-widest">Main Website</p>
                        <p className="font-bold">nsbm.ac.lk</p>
                      </div>
                    </div>
                    <ExternalLink size={20} className="text-white/20 group-hover:text-white" />
                  </a>
                </div>
              </div>

            </div>
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

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-6 group">
    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 group-hover:bg-white group-hover:text-emerald-700 transition-all shadow-lg">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const SocialButton = ({ icon: Icon, label, username, link, color }) => (
  <a
    href={link}
    target="_blank"
    rel="noreferrer"
    className="glass-panel p-6 rounded-[2rem] flex flex-col items-start gap-4 hover:bg-white/10 transition-all group relative overflow-hidden"
  >
    <div className={`p-3 rounded-xl ${color} shadow-inner`}>
      <Icon size={24} className="group-hover:scale-110 transition-transform" />
    </div>
    <div className="text-left">
      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">{label}</p>
      <p className="text-sm font-bold truncate w-full">{username}</p>
    </div>
    <div className="absolute top-4 right-4 text-white/10 group-hover:text-emerald-400 transition-colors">
      <Send size={14} />
    </div>
  </a>
);

export default Contact;
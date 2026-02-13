import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import {
  Mail, Lock, Loader2, Menu, User, ArrowRight, ChevronDown, ChevronUp,
  Eye, EyeOff, AlertCircle, X, Sparkles
} from 'lucide-react';

import pattern from '../assets/pattern.png';
import logoNsbm from '../assets/logo_nsbm.png';
import googleImg from '../assets/google.png';
import facebookImg from '../assets/facebook.png';
import githubImg from '../assets/github.png';

/**
 * * Member 01 : feature and auth-fullstack-36682
 * * Login page UI handling user credentials and redirection upon success.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useUI();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const footerRef = useRef(null);

  const slides = [
    {
      title: "Creative.\nCampus Solutions.",
      desc: "Manage your club activities, join events, and connect with peers through our secure university portal."
    },
    {
      title: "Connect.\nCollaborate.",
      desc: "Find your community. From Tech Societies to Sports Clubs, discover where you belong."
    },
    {
      title: "Lead.\nThe Future.",
      desc: "Organize events, manage memberships, and grow your leadership skills with our admin tools."
    }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const observer = new IntersectionObserver(
      ([entry]) => { setIsAtBottom(entry.isIntersecting); },
      { threshold: 0.1 }
    );

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      clearInterval(interval);
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  /**
   * * Member 01 : Submits login credentials to the backend and handles response.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      login(response.data);

      showToast("Login Successful! Redirecting...", "success");

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      showToast("Invalid email or password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleScroll = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      footerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    
    <div className="relative font-sans text-white selection:bg-emerald-500 selection:text-white">

      {/* 
  Custom styles for Login Page UI:
  - Imports Montserrat font from Google Fonts
  - Defines reusable font utility class
  - Adds keyframe animations (slide-in, background pan, blob motion, slow bounce)
  - Enables smooth scrolling behavior
  These styles enhance visual effects and user experience on the login screen.
*/}

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
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-teal-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="absolute inset-0 opacity-15 animate-pan-pattern" style={{ backgroundImage: `url(${pattern})`, backgroundSize: '800px', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="h-screen flex flex-col relative">

        <nav className={`relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="text-xl md:text-2xl font-bold tracking-wide flex items-center gap-4">
            <div className="p-2 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
              <img src={logoNsbm} alt="NSBM Logo" className="w-16 h-auto object-contain" />
            </div>
            <span className="hidden sm:inline tracking-widest text-lg border-l border-white/30 pl-4 font-montserrat">
              CLU<b>B</b>IO
            </span>
          </div>
          <nav className="hidden md:flex gap-8 font-medium text-sm tracking-wide">
            <button onClick={() => navigate('/features')} className="hover:text-emerald-400 transition">FEATURES</button>
            <button onClick={() => navigate('/about')} className="hover:text-emerald-400 transition">ABOUT</button>
            <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition">CONTACT</button>
          </nav>
          <Menu className="md:hidden w-6 h-6 cursor-pointer" />
        </nav>

        <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 flex-grow w-full gap-12 lg:gap-24">

          <div className={`w-full lg:flex-1 flex flex-col justify-center items-center lg:items-start transition-all duration-1000 transform ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="relative w-full h-[180px] sm:h-[200px] lg:h-[240px] mb-6 text-center lg:text-left">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight whitespace-pre-line mb-4 lg:mb-6 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-emerald-50 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                    {slide.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6 w-full">
              <button
                onClick={() => navigate('/register')}
                className="group px-8 py-4 bg-white text-emerald-900 font-bold rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                REGISTER NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${currentSlide === index ? 'w-8 lg:w-10 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`w-full max-w-md lg:max-w-[450px] transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

              <div className="p-6 sm:p-10 relative z-20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-wider drop-shadow-md">WELCOME TO CLUBIO</h2>
                  <p className="text-emerald-100 text-sm mt-2 font-light">Login to access your dashboard</p>
                </div>

                <div className="flex justify-center gap-6 mb-6">
                  <button className="w-12 h-12 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 rounded-full">
                    <img src={googleImg} alt="Google" className="w-8 h-8 object-contain" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 rounded-full">
                    <img src={facebookImg} alt="Facebook" className="w-8 h-8 object-contain" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10 rounded-full">
                    <img src={githubImg} alt="GitHub" className="w-8 h-8 object-contain" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] bg-white/20 flex-1"></div>
                  <span className="text-emerald-100/60 text-xs uppercase tracking-widest">or email</span>
                  <div className="h-[1px] bg-white/20 flex-1"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="group relative">
                    <User className="absolute left-0 top-1/2 transform -translate-y-1/2 text-emerald-200 pl-4 w-9 h-9 p-2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 transition-all"
                      placeholder="Enter Email"
                    />
                  </div>

                  <div className="group relative">
                    <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 text-emerald-200 pl-4 w-9 h-9 p-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 transition-all"
                      placeholder="Enter Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-200 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 mt-6 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'LOGIN'}
                  </button>
                </form>

                <div className="mt-8 text-center text-sm">
                  <p className="text-emerald-100/80">Don't have an account?</p>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-white font-bold hover:text-emerald-300 underline decoration-emerald-400/50 underline-offset-4 mt-2 transition-colors"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={toggleScroll}
          className="animate-bounce-slow opacity-70 hover:opacity-100 transition-all p-2"
        >
          {isAtBottom ? (
            <ChevronUp className="w-10 h-10 text-white drop-shadow-md" />
          ) : (
            <ChevronDown className="w-10 h-10 text-white drop-shadow-md" />
          )}
        </button>
      </div>

      <footer ref={footerRef} id="footer-section" className="relative z-10 w-full py-12 px-6 border-t border-white/10 backdrop-blur-md bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-emerald-100/70 tracking-wide">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <p className="font-bold text-white mb-1">© 2026 NSBM Green University</p>
            <p className="text-xs">Excellence in Education</p>
          </div>

          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-white transition-colors relative group">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="hover:text-white transition-colors relative group">
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="hover:text-white transition-colors relative group">
              Help & Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Login;
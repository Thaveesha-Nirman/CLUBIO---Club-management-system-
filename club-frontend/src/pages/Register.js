import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext'; 
import {
  Mail, Lock, Loader2, Menu, ChevronDown, ChevronUp,
  GraduationCap, Building, BookOpen, Calendar, CheckCircle,
  AlertCircle, X, Sparkles
} from 'lucide-react';

import pattern from '../assets/pattern.png';
import logoNsbm from '../assets/logo_nsbm.png';

const Register = () => { 

  const navigate = useNavigate(); 
  const { showToast } = useUI(); 

  const [memberCount, setMemberCount] = useState(2000);
  const [userStatus, setUserStatus] = useState('Student');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    studentId: '', degreeProgram: '', batch: '', department: ''
  });

  const [passStrength, setPassStrength] = useState(0);
  const [passFeedback, setPassFeedback] = useState({
    length: false, upper: false, number: false, symbol: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const fetchCount = async () => {
      try {
        const response = await api.get('/auth/count');
        setMemberCount(response.data);
      } catch (error) {
        console.log("Could not fetch count, using default");
      }
    };
    fetchCount();

    const observer = new IntersectionObserver(
      ([entry]) => { setIsAtBottom(entry.isIntersecting); },
      { threshold: 0.1 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => { if (footerRef.current) observer.unobserve(footerRef.current); };
  }, []);

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });

    const hasLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    setPassFeedback({ length: hasLength, upper: hasUpper, number: hasNumber, symbol: hasSymbol });

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    setPassStrength(score);
  };

  const getStrengthColor = () => {
    if (passStrength <= 1) return 'bg-red-500';
    if (passStrength === 2) return 'bg-orange-500';
    if (passStrength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const facultyData = {
    "Faculty of Business": ["Department of Management", "Department of Accounting and Finance", "Department of Marketing and Tourism", "Department of Operations and Logistics", "Department of Legal Studies"],
    "Faculty of Computing": ["Department of Software Engineering & Computer Security", "Department of Computer and Data Science"],
    "Faculty of Engineering": ["Department of Electrical, Electronic & Systems Engineering", "Department of Design Studies", "Department of Mechatronic and Industrial Engineering"],
    "Faculty of Science": ["Department of Life Sciences", "Department of Health Sciences"],
    "Faculty of Postgraduate & Professional Advancement": ["General Studies"]
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match!", "error");
    }

    if (passStrength < 4) {
      return showToast("Password is too weak! Check requirements.", "error");
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        userStatus,
        faculty: userStatus === 'Student' ? selectedFaculty : '',
        role: `ROLE_${userStatus.toUpperCase()}`
      };

      await api.post('/auth/register', payload);

      showToast("Welcome to the Community!", "success");

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Server connection failed";
      showToast(typeof errorMessage === 'object' ? "Check your details." : errorMessage, "error");
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

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

        html { scroll-behavior: smooth; }
      `}</style>


      <div className="fixed inset-0 z-[-50]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-teal-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="absolute inset-0 opacity-15 animate-pan-pattern" style={{ backgroundImage: `url(${pattern})`, backgroundSize: '1000px', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="h-screen flex flex-col relative">

        <nav className={`relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto w-full transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="text-xl md:text-2xl font-bold tracking-wide flex items-center gap-4">
            <div className="p-2 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
              <img src={logoNsbm} alt="NSBM Logo" className="w-16 h-auto object-contain" />
            </div>
            <span className="hidden sm:inline tracking-widest text-lg border-l border-white/30 pl-4 font-montserrat">CLUBIO</span>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-sm tracking-wide items-center">
            <a href="#" onClick={() => navigate('/login')} className="hover:text-emerald-200 transition cursor-pointer">LOGIN</a>
            <a onClick={() => navigate('/support')} className="hover:text-emerald-200 transition cursor-pointer">SUPPORT</a>          </div>
          <Menu className="md:hidden w-6 h-6 cursor-pointer" />
        </nav>

        <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-4 flex-grow w-full gap-12 lg:gap-24">

          <div className={`w-full lg:flex-1 flex flex-col justify-center items-center lg:items-start transition-all duration-1000 transform ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                Join the<br />Community.
              </h1>
              <p className="text-lg lg:text-xl text-emerald-50 max-w-lg leading-relaxed font-light">
                Create your account today to access exclusive club events, manage memberships, and connect with the university network.
              </p>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 animate-fade-in-up">
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-800/50 overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 15}`}
                        alt="Member"
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-900/90 flex items-center justify-center text-[10px] font-bold text-white relative z-10">
                    {memberCount > 999 ? (memberCount / 1000).toFixed(1) + 'k' : '+' + memberCount}
                  </div>
                </div>
                <div className="text-sm text-emerald-100/80 text-left">
                  <span className="block text-white font-bold text-base">{memberCount.toLocaleString()}+ Students</span>
                  Joined this semester
                </div>
              </div>

            </div>
          </div>

          <div className={`w-full max-w-lg transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5 flex flex-col max-h-[750px]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

              <div className="p-8 pb-4 relative z-20 text-center shrink-0">
                <h2 className="text-2xl font-bold text-white tracking-wider drop-shadow-md">CREATE ACCOUNT</h2>
                <p className="text-emerald-100 text-xs mt-2 font-light">Enter your details to register</p>
              </div>

              <div className="px-8 pb-8 overflow-y-auto custom-scrollbar relative z-20">
                <form onSubmit={handleRegister} className="space-y-4">

                  <div className="bg-black/20 p-1 rounded-full relative flex mb-6 h-12 items-center">
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-500 rounded-full shadow-md transition-all duration-300 ease-in-out`}
                      style={{ left: userStatus === 'Student' ? '4px' : 'calc(50%)' }}
                    ></div>
                    <button type="button" onClick={() => setUserStatus('Student')} className="flex-1 relative z-10 text-sm font-bold text-white text-center">Student</button>
                    <button type="button" onClick={() => setUserStatus('Lecturer')} className="flex-1 relative z-10 text-sm font-bold text-white text-center">Lecturer</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" required className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    <input type="text" placeholder="Last Name" required className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>

                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                    <input type="email" placeholder="University Email" required className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>

                  <div className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                        <input type="password" placeholder="Password" required className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={handlePasswordChange} />
                      </div>
                      <div className="group relative">
                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                        <input type="password" placeholder="Confirm" required className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                      </div>
                    </div>

                    {formData.password && (
                      <div className="space-y-2">
                        <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${getStrengthColor()}`} style={{ width: `${(passStrength / 4) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-emerald-100/70 px-1">
                          <span className={passFeedback.length ? 'text-green-400 font-bold' : ''}>8+ Chars</span>
                          <span className={passFeedback.upper ? 'text-green-400 font-bold' : ''}>Uppercase</span>
                          <span className={passFeedback.number ? 'text-green-400 font-bold' : ''}>Number</span>
                          <span className={passFeedback.symbol ? 'text-green-400 font-bold' : ''}>Symbol (#@!)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${userStatus === 'Student' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-2">
                      <div className="h-[1px] bg-white/10 w-full my-2"></div>

                      <div className="group relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                        <input type="text" placeholder="Student ID (e.g. 36682)" className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
                      </div>

                      <div className="group relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200 pointer-events-none" />
                        <select className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white outline-none focus:bg-black/40 focus:border-white/30 text-sm appearance-none cursor-pointer" value={selectedFaculty} onChange={(e) => { setSelectedFaculty(e.target.value); setFormData({ ...formData, department: '' }); }}>
                          <option value="" className="bg-gray-800">Select Faculty</option>
                          {Object.keys(facultyData).map(f => <option key={f} value={f} className="bg-gray-800">{f}</option>)}
                        </select>
                      </div>

                      <div className="group relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200 pointer-events-none" />
                        <select disabled={!selectedFaculty} className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white outline-none focus:bg-black/40 focus:border-white/30 text-sm appearance-none cursor-pointer disabled:opacity-50" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                          <option value="" className="bg-gray-800">Select Department</option>
                          {selectedFaculty && facultyData[selectedFaculty].map(d => <option key={d} value={d} className="bg-gray-800">{d}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Degree (e.g. SE)" className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, degreeProgram: e.target.value })} />
                        <div className="group relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                          <input type="text" placeholder="Batch (2022)" className="w-full pl-10 pr-3 py-3 bg-black/25 border border-white/10 rounded-xl text-white placeholder-emerald-200/50 outline-none focus:bg-black/40 focus:border-white/30 text-sm" onChange={(e) => setFormData({ ...formData, batch: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'CREATE ACCOUNT'}
                  </button>

                </form>

                <div className="mt-6 text-center text-sm">
                  <p className="text-emerald-100/80">Already have an account?</p>
                  <button onClick={() => navigate('/login')} className="text-white font-bold hover:text-emerald-300 underline decoration-emerald-400/50 underline-offset-4 mt-2 transition-colors">Login Here</button>
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

export default Register;
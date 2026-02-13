import React, { useState, useEffect } from 'react';

/**
 * * Member 06 : Mainly UI/UX
 * * Main dashboard container coordinating all sub-pages and sidebar.
 */
import Profile from './Profile';
import FriendRequests from './FriendRequests';
import FriendsList from './FriendsList';
import PostCard from '../components/PostCard';
import ProfileSettings from './ProfileSettings';
import ClubProfile from './ClubProfile';
import ClubManager from './ClubManager';
import MyClubs from './MyClubs';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Sidebar from './Sidebar';
import ClubSettings from './ClubSettings';
import CreatePost from './CreatePost';
import CreateEvent from './CreateEvent';
import AllClubs from './AllClubs';
import ClubRequests from './ClubRequests';
import ExploreClubs from './ExploreClubs';
import AllMembers from './AllMembers';
import EventDetails from './EventDetails';
import ff from '../components/ff.png';

import {
  Search, Bell, Heart, MessageCircle, MoreHorizontal,
  MapPin, Clock, Check, X, ArrowLeft, FileText, User, Phone, GraduationCap,
  Users, Tag, ArrowRight, ImageIcon, ChevronLeft, ChevronRight, Maximize2, ExternalLink, UserPlus, UserCheck
} from 'lucide-react';

import pattern from '../assets/pattern.png';
const API_BASE = 'http://localhost:8080';
const DEFAULT_CLUB_LOGO = "https://cdn-icons-png.flaticon.com/512/4264/4264818.png";
const DEFAULT_AVATAR = "data:image/png;base64,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";

const CLUB_CATEGORIES = [
  "Sports Clubs", "Activity Based Clubs", "Religious Clubs",
  "International Clubs", "Academic Clubs", "Career Guidance Unit", "NCARE"
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { showAlert, showConfirm } = useAlert();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const GLASS_OPACITY = 0.01;
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const [studentPageIndex, setStudentPageIndex] = useState(0);
  const STUDENTS_PER_PAGE = 5;
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [clubSearchResults, setClubSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  const [recommendedClubs, setRecommendedClubs] = useState([]);
  const [recPageIndex, setRecPageIndex] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const [clubForm, setClubForm] = useState({
    name: '',
    category: 'Sports Clubs',
    description: '',
    contactNumber: '',
    logoUrl: '',
    googleFormLink: '',
    whatsappGroupLink: ''
  });
  const [isSubmittingClub, setIsSubmittingClub] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) setActiveTab(tab);
      else setActiveTab('feed');
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab');
    if (currentTab !== activeTab) {
      const newUrl = `${window.location.pathname}?tab=${activeTab}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, [activeTab]);

  useEffect(() => {
    if (suggestedUsers.length <= STUDENTS_PER_PAGE) return;
    const interval = setInterval(() => {
      setStudentPageIndex(prev => {
        const maxPage = Math.ceil(suggestedUsers.length / STUDENTS_PER_PAGE) - 1;
        return prev === maxPage ? 0 : prev + 1;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [studentPageIndex, suggestedUsers.length]);

  const currentSuggested = suggestedUsers.slice(
    studentPageIndex * STUDENTS_PER_PAGE,
    (studentPageIndex + 1) * STUDENTS_PER_PAGE
  );


  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const storedData = localStorage.getItem('clubUser');
        const token = storedData ? JSON.parse(storedData)?.token : null;
        const headers = { "Authorization": `Bearer ${token}` };

        const res = await fetch(`${API_BASE}/api/friends/suggestions`, { headers });
        if (res.ok) {
          setSuggestedUsers(await res.json());
        }
      } catch (e) {
        console.error("Suggestions error", e);
      }
    };
    if (activeTab === 'feed') fetchSuggestions();
  }, [user, activeTab]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const storedData = localStorage.getItem('clubUser');
        const token = storedData ? JSON.parse(storedData)?.token : null;
        const headers = { "Authorization": `Bearer ${token}` };

        const [postsRes, eventsRes] = await Promise.all([
          fetch("http://localhost:8080/api/posts", { headers }),
          fetch("http://localhost:8080/api/events", { headers })
        ]);

        if (postsRes.ok) setPosts(await postsRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());

      } catch (err) {
        console.error("Error loading feed:", err);
      }
    };
    fetchFeed();
  }, []);
  useEffect(() => {
    /**
     * * Member 08 : origin/feature/search-filter-specialist-fullstack-36712
     * * Global search implementation fetching users and clubs.
     */
    const performGlobalSearch = async () => {
      if (searchTerm.length < 2) {
        setUserSearchResults([]);
        setClubSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
        const headers = { "Authorization": `Bearer ${token}` };

        const [uRes, cRes] = await Promise.all([
          fetch(`http://localhost:8080/api/users/search?name=${searchTerm}`, { headers }),
          fetch(`http://localhost:8080/api/clubs/search?name=${searchTerm}`, { headers })
        ]);

        if (uRes.ok) setUserSearchResults(await uRes.json());
        if (cRes.ok) setClubSearchResults(await cRes.json());

      } catch (err) {
        console.error("Global search failed:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performGlobalSearch, 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const storedData = localStorage.getItem('clubUser');
        const token = storedData ? JSON.parse(storedData)?.token : null;
        const headers = { "Authorization": `Bearer ${token}` };

        const allClubsRes = await fetch("http://localhost:8080/api/clubs", { headers });
        const myMembershipsRes = await fetch("http://localhost:8080/api/clubs/my-memberships", { headers });
        const myManagedRes = await fetch("http://localhost:8080/api/clubs/my-managed", { headers });

        if (allClubsRes.ok && myMembershipsRes.ok && myManagedRes.ok) {
          const allClubs = await allClubsRes.json();
          const memberships = await myMembershipsRes.json();
          const managed = await myManagedRes.json();

          const excludedIds = new Set();
          memberships.forEach(m => excludedIds.add(m.club.id));
          managed.forEach(c => excludedIds.add(c.id));

          const suggestions = allClubs.filter(c =>
            c.status === 'ACTIVE' && !excludedIds.has(c.id)
          );

          setRecommendedClubs(suggestions);
        }
      } catch (e) {
        console.error("Recs error", e);
      }
    };
    fetchRecommendations();
  }, [user]);

  useEffect(() => {
    if (recommendedClubs.length <= ITEMS_PER_PAGE) return;

    const interval = setInterval(() => {
      setRecPageIndex(prev => {
        const maxPage = Math.ceil(recommendedClubs.length / ITEMS_PER_PAGE) - 1;
        return prev === maxPage ? 0 : prev + 1;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [recPageIndex, recommendedClubs.length]);

  const nextRecPage = () => {
    const maxPage = Math.ceil(recommendedClubs.length / ITEMS_PER_PAGE) - 1;
    setRecPageIndex(prev => prev === maxPage ? 0 : prev + 1);
  };

  const prevRecPage = () => {
    const maxPage = Math.ceil(recommendedClubs.length / ITEMS_PER_PAGE) - 1;
    setRecPageIndex(prev => prev === 0 ? maxPage : prev - 1);
  };

  const currentRecs = recommendedClubs.slice(
    recPageIndex * ITEMS_PER_PAGE,
    (recPageIndex + 1) * ITEMS_PER_PAGE
  );

  const getFilteredPosts = () => {
    if (!searchTerm) return posts;
    const lower = searchTerm.toLowerCase();
    return posts.filter(p =>
      p.content?.toLowerCase().includes(lower) ||
      p.club?.name?.toLowerCase().includes(lower)
    );
  };

  const getFilteredEvents = () => {
    if (!searchTerm) return events;
    const lower = searchTerm.toLowerCase();
    return events.filter(e =>
      e.title?.toLowerCase().includes(lower) ||
      e.location?.toLowerCase().includes(lower) ||
      e.club?.name?.toLowerCase().includes(lower)
    );
  };

  useEffect(() => {
    if (activeTab === 'approvals') {
      const fetchPending = async () => {
        try {
          const storedData = localStorage.getItem('clubUser');
          const token = storedData ? JSON.parse(storedData)?.token : null;
          const res = await fetch("http://localhost:8080/api/clubs/pending", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) setPendingClubs(await res.json());
        } catch (error) { console.error(error); }
      };
      fetchPending();
    }
  }, [activeTab]);

  const handleUserClick = (targetUser) => {
    if (!targetUser) return;
    setSelectedUserId(targetUser.id);
    setActiveTab('view_profile');
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingClub(true);
    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const res = await fetch("http://localhost:8080/api/clubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(clubForm)
      });

      if (!res.ok) throw new Error(await res.text());

      showAlert("Application Submitted Successfully!", "success");
      setClubForm({ name: '', category: 'Sports Clubs', description: '', contactNumber: '', logoUrl: '' });
      setActiveTab('feed');
    } catch (error) {
      showAlert("Error: " + error.message, "error");
    } finally {
      setIsSubmittingClub(false);
    }
  };

  const handleApprove = async (clubId) => {
    try {
      const storedData = localStorage.getItem('clubUser');
      const token = storedData ? JSON.parse(storedData)?.token : null;
      const res = await fetch(`http://localhost:8080/api/clubs/${clubId}/approve`, {
        method: "PUT", headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed");
      showAlert("Club Approved!", "success");
      setPendingClubs(pendingClubs.filter(c => c.id !== clubId));
    } catch (error) { showAlert("Error: " + error.message, "error"); }
  };

  const handleReject = async (clubId) => {
    const confirmed = await showConfirm("Reject this request?", { isDanger: true, confirmText: "Reject", cancelText: "Cancel" });
    if (!confirmed) return;
    try {
      const storedData = localStorage.getItem('clubUser');
      const token = storedData ? JSON.parse(storedData)?.token : null;
      const res = await fetch(`http://localhost:8080/api/clubs/${clubId}/reject`, {
        method: "DELETE", headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed");
      showAlert("Request rejected.", "success");
      setPendingClubs(pendingClubs.filter(c => c.id !== clubId));
    } catch (error) { showAlert("Error: " + error.message, "error"); }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'feed': return 'Club Feed';
      case 'friends_list': return 'My Friends';
      case 'events': return 'Upcoming Events';
      case 'create_club': return 'Start a New Club';
      case 'approvals': return 'Pending Approvals';
      case 'my_profile': return 'My Profile';
      case 'friend_requests': return 'Friend Requests';
      case 'settings': return 'Edit Profile';
      case 'manage_club': return 'Club Management';
      case 'my_clubs': return 'My Memberships';
      case 'requests': return 'Membership Requests';
      case 'view_club': return selectedClub ? selectedClub.name : 'Club Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-white selection:bg-emerald-500 selection:text-white overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        .font-montserrat { font-family: "Montserrat", sans-serif; }
        .font-inter { font-family: "Inter", sans-serif; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pan-pattern { animation: pan-pattern 120s linear infinite; will-change: background-position; }
        @keyframes pan-pattern { 0% { background-position: 0px 0px; } 100% { background-position: 1000px 1000px; } }
        .glass-panel { background: rgba(255, 255, 255, ${GLASS_OPACITY}); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="fixed inset-0 z-[-50]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-black"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-teal-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="absolute inset-0 opacity-10 animate-pan-pattern" style={{ backgroundImage: `url(${pattern})`, backgroundSize: '1000px', backgroundRepeat: 'repeat' }}></div>
      </div>

      <div className="flex h-screen">
        <Sidebar
          user={user} logout={logout} activeTab={activeTab} setActiveTab={setActiveTab}
          mounted={mounted} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className={`flex-1 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${mounted ? 'opacity-100' : 'opacity-0'} ${isSidebarOpen ? 'lg:ml-72 ml-0' : 'ml-0'}`}>

          <div className="px-4 lg:px-8 pt-8 pb-4 shrink-0 z-40">
            <header className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className={`hidden lg:block transition-all duration-500 ${!isSidebarOpen ? 'w-12' : 'w-0'}`}></div>
                <div className="pl-12 lg:pl-0">
                  <h2 className="text-2xl lg:text-3xl font-montserrat font-bold text-white drop-shadow-md">{getPageTitle()}</h2>
                  <p className="text-emerald-200/80 text-xs lg:text-sm mt-1">Welcome back, {user?.firstName || 'Student'}!</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => setActiveTab('my_profile')}
                  className={`hidden lg:flex items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden whitespace-nowrap cursor-pointer ${!isSidebarOpen ? 'max-w-[200px] opacity-100 translate-x-0 mr-6' : 'max-w-0 opacity-0 translate-x-12'}`}
                >
                  <div className="text-right">
                    <h4 className="text-sm font-bold text-white">{user?.username || 'User'}</h4>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wider">{user?.role?.replace('ROLE_', '') || 'Student'}</p>
                  </div>
                  <img src={user?.profileImage || DEFAULT_AVATAR} alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-500/50 shadow-lg shrink-0 object-cover" />
                  <div className="h-8 w-[1px] bg-white/10 ml-2"></div>
                </div>



                <div className="relative group shrink-0 hidden sm:block">
                  {/* Member 08 : Search Input UI */}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-emerald-400 transition-colors z-10" size={18} />
                  <input
                    type="text"
                    placeholder="Search people or clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 glass-panel rounded-full text-white placeholder-white/30 focus:bg-white/10 focus:border-emerald-500/50 outline-none w-48 lg:w-80 transition-all"
                  />

                  {searchTerm.length >= 2 && (
                    <div className="absolute top-full mt-3 w-80 right-0 glass-panel rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden z-[100] animate-fade-in bg-[#0a0a0a]/95 backdrop-blur-xl">

                      <div className="p-3 border-b border-white/5 bg-emerald-500/5 flex justify-between items-center">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Students</p>
                        {isSearching && <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>}
                      </div>

                      <div className="max-h-48 overflow-y-auto no-scrollbar">
                        {userSearchResults.length > 0 ? userSearchResults.map(u => {
                          console.log("User Image Path:", u.profileImage);

                          const userImageUrl = u.profileImage
                            ? (u.profileImage.startsWith('http') ? u.profileImage : `${API_BASE}${u.profileImage.startsWith('/') ? '' : '/'}${u.profileImage}`)
                            : DEFAULT_AVATAR;

                          return (
                            <div
                              key={u.id}
                              onClick={() => { handleUserClick(u); setSearchTerm(""); }}
                              className="p-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 group/user text-left"
                            >
                              <img
                                src={userImageUrl}
                                className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover/user:border-emerald-500/50 transition-all"
                                alt=""
                                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                              />
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{u.firstName} {u.lastName}</p>
                                <p className="text-[9px] text-white/40 uppercase tracking-wider">{u.faculty || "NSBM Student"}</p>
                              </div>
                            </div>
                          );
                        }) : !isSearching && <p className="p-4 text-[10px] text-white/20 italic text-center">No students found</p>}
                      </div>

                      <div className="p-3 border-y border-white/5 bg-blue-500/5">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Clubs & Societies</p>
                      </div>

                      <div className="max-h-48 overflow-y-auto no-scrollbar">
                        {clubSearchResults.length > 0 ? clubSearchResults.map(c => {
                          const clubLogoUrl = c.logoUrl
                            ? (c.logoUrl.startsWith('http') ? c.logoUrl : `${API_BASE}${c.logoUrl.startsWith('/') ? '' : '/'}${c.logoUrl}`)
                            : DEFAULT_CLUB_LOGO;

                          return (
                            <div
                              key={c.id}
                              onClick={() => { setSelectedClub(c); setActiveTab('view_club'); setSearchTerm(""); }}
                              className="p-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 group/club text-left"
                            >
                              <img
                                src={clubLogoUrl}
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover/club:border-blue-500/50 transition-all"
                                alt=""
                                onError={(e) => { e.target.src = DEFAULT_CLUB_LOGO; }}
                              />
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{c.name}</p>
                                <p className="text-[9px] text-white/40 uppercase tracking-wider">{c.category}</p>
                              </div>
                            </div>
                          );
                        }) : !isSearching && <p className="p-4 text-[10px] text-white/20 italic text-center">No clubs found</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {['feed', 'events'].includes(activeTab) && (
              <div className="flex gap-6 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
                <TabButton label="Latest Posts" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
                <TabButton label="Event Calendar" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 no-scrollbar mask-top">
            <div className="pt-4">

              {activeTab === 'feed' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {getFilteredPosts().length === 0 ? (
                      <div className="glass-panel p-8 rounded-3xl text-center text-white/50">
                        {searchTerm ? "No matching posts." : "No posts available yet."}
                      </div>
                    ) : (
                      getFilteredPosts().map((post) => (
                        <PostCard
                          key={post.id} post={post} user={user}
                          onImageClick={(url) => setPreviewImage(url)}
                          onClubClick={(club) => { setSelectedClub(club); setActiveTab('view_club'); }}
                          onUserClick={handleUserClick}
                        />
                      ))
                    )}
                  </div>

                  <div className="space-y-6 hidden lg:block">

                    <div className="glass-panel p-6 rounded-3xl border border-white/10 min-h-[380px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          Recommended Clubs
                        </h3>
                      </div>

                      <div className="flex-1 relative overflow-hidden">
                        <div key={`clubs-page-${recPageIndex}`} className="space-y-3 animate-fade-in">
                          {recommendedClubs.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
                              <p className="text-sm italic">No new clubs available.</p>
                            </div>
                          ) : (
                            recommendedClubs.slice(recPageIndex * ITEMS_PER_PAGE, (recPageIndex + 1) * ITEMS_PER_PAGE).map((club) => (
                              <div key={club.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3 overflow-hidden" onClick={() => { setSelectedClub(club); setActiveTab('view_club'); }}>
                                  <div className="w-10 h-10 rounded-full bg-white/5 p-0.5 border border-white/10 shrink-0">
                                    <img src={club.logoUrl ? `${API_BASE}${club.logoUrl}` : DEFAULT_CLUB_LOGO} alt="" className="w-full h-full rounded-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-semibold text-sm text-white truncate w-32 group-hover:text-emerald-400 transition-colors">{club.name}</h4>
                                    <p className="text-[10px] text-white/40 truncate uppercase tracking-wider">{club.category}</p>
                                  </div>
                                </div>
                                <button onClick={() => { setSelectedClub(club); setActiveTab('view_club'); }} className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300">
                                  Visit
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {recommendedClubs.length > ITEMS_PER_PAGE && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <button onClick={() => setRecPageIndex(prev => prev === 0 ? Math.ceil(recommendedClubs.length / ITEMS_PER_PAGE) - 1 : prev - 1)} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition active:scale-90"><ChevronLeft size={18} /></button>
                          <div className="flex gap-1.5">
                            {Array.from({ length: Math.ceil(recommendedClubs.length / ITEMS_PER_PAGE) }).map((_, i) => (
                              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === recPageIndex ? 'w-6 bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'w-1 bg-white/20'}`}></div>
                            ))}
                          </div>
                          <button onClick={() => setRecPageIndex(prev => (prev + 1) % Math.ceil(recommendedClubs.length / ITEMS_PER_PAGE))} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition active:scale-90"><ChevronRight size={18} /></button>
                        </div>
                      )}
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/10 min-h-[380px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          Find Students
                        </h3>
                      </div>

                      <div className="flex-1 relative overflow-hidden">
                        <div key={`students-page-${studentPageIndex}`} className="space-y-3 animate-fade-in">
                          {suggestedUsers.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
                              <p className="text-sm italic">Looking for new connections...</p>
                            </div>
                          ) : (
                            suggestedUsers.slice(studentPageIndex * STUDENTS_PER_PAGE, (studentPageIndex + 1) * STUDENTS_PER_PAGE).map((sUser) => {
                              const userImageUrl = sUser.profileImage
                                ? (sUser.profileImage.startsWith('http') ? sUser.profileImage : `${API_BASE}${sUser.profileImage.startsWith('/') ? '' : '/'}${sUser.profileImage}`)
                                : DEFAULT_AVATAR;
                              return (
                                <div key={sUser.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all border border-transparent hover:border-white/5">
                                  <div className="flex items-center gap-3 overflow-hidden" onClick={() => handleUserClick(sUser)}>
                                    <div className="w-10 h-10 rounded-full bg-white/5 p-0.5 border border-white/10 shrink-0">
                                      <img src={userImageUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-semibold text-sm text-white truncate w-32 group-hover:text-emerald-400 transition-colors">{sUser.firstName}</h4>
                                      <p className="text-[10px] text-white/40 truncate uppercase tracking-wider">{sUser.department || "NSBM Student"}</p>
                                    </div>
                                  </div>
                                  <button onClick={() => handleUserClick(sUser)} className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300">
                                    <UserPlus size={16} />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {suggestedUsers.length > STUDENTS_PER_PAGE && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <button onClick={() => setStudentPageIndex(prev => prev === 0 ? Math.ceil(suggestedUsers.length / STUDENTS_PER_PAGE) - 1 : prev - 1)} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition active:scale-90">
                            <ChevronLeft size={18} />
                          </button>
                          <div className="flex gap-1.5">
                            {Array.from({ length: Math.ceil(suggestedUsers.length / STUDENTS_PER_PAGE) }).map((_, i) => (
                              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === studentPageIndex ? 'w-6 bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'w-1 bg-white/20'}`}></div>
                            ))}
                          </div>
                          <button onClick={() => setStudentPageIndex(prev => (prev + 1) % Math.ceil(suggestedUsers.length / STUDENTS_PER_PAGE))} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition active:scale-90">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'explore' && (
                <ExploreClubs
                  onViewClub={(club) => {
                    setSelectedClub(club);
                    setActiveTab('view_club');
                  }}
                />
              )}

              {activeTab === 'view_profile' && (
                <Profile
                  currentUser={user}
                  profileId={selectedUserId}
                  onEditClick={() => setActiveTab('settings')}
                  onViewClub={(club) => { setSelectedClub(club); setActiveTab('view_club'); }}
                  onUserClick={handleUserClick}
                />
              )}

              {activeTab === 'create_club' && (
                <div className="max-w-2xl mx-auto animate-fade-in pb-12">
                  <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Club Application</h2>
                        <p className="text-sm text-white/50">New Club Registration Form</p>
                      </div>
                    </div>

                    <form onSubmit={handleClubSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Club Name</label>
                        <input
                          type="text"
                          placeholder="e.g. University Robotics Society"
                          required
                          value={clubForm.name}
                          onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                          className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-white/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Category</label>
                        <div className="relative">
                          <select
                            value={clubForm.category}
                            onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}
                            className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                            {CLUB_CATEGORIES.map(cat => <option key={cat} className="bg-[#1e1e1e] text-white">{cat}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                            <MoreHorizontal size={16} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Mission & Purpose</label>
                        <textarea
                          placeholder="What is the main goal of this club?"
                          rows="4"
                          required
                          value={clubForm.description}
                          onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                          className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder-white/20"
                        ></textarea>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium text-emerald-400">Admin WhatsApp Number</label>
                        <input
                          type="tel"
                          placeholder="077 123 4567"
                          required
                          value={clubForm.contactNumber}
                          onChange={(e) => {
                            if (/^[0-9+\s]*$/.test(e.target.value)) {
                              setClubForm({ ...clubForm, contactNumber: e.target.value });
                            }
                          }}
                          className="w-full p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
                        />
                        <p className="text-xs text-white/40">Please use a working telephone number. This number will be used for contact purposes.</p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingClub}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmittingClub ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'explore_clubs' && (
                <ExploreClubs onViewClub={(club) => { setSelectedClub(club); setActiveTab('view_club'); }} />
              )}


              {activeTab === 'approvals' && (
                <div className="space-y-6 animate-fade-in">
                  {pendingClubs.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-3xl"><p className="text-white/50 text-lg">All caught up! No pending requests.</p></div>
                  ) : (
                    pendingClubs.map(club => (
                      <div key={club.id} className="glass-panel rounded-3xl overflow-hidden border border-white/10">

                        <div className="bg-white/5 p-6 border-b border-white/10 flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded uppercase tracking-wider">{club.category}</span>
                            <h3 className="text-2xl font-bold text-white mt-2">{club.name}</h3>
                          </div>
                          <span className="text-xs font-bold bg-yellow-500/20 text-yellow-300 px-3 py-1.5 rounded-full border border-yellow-500/30">NEEDS APPROVAL</span>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                          <div className="lg:col-span-2 space-y-4">
                            <div>
                              <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Purpose & Mission</h4>
                              <p className="text-white/80 leading-relaxed bg-black/20 p-4 rounded-xl text-sm">{club.description}</p>
                            </div>
                            <div className="flex gap-4">
                              <div className="bg-black/20 p-3 rounded-xl flex-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase">WhatsApp Contact</label>
                                <p className="text-emerald-400 font-mono font-bold">{club.contactNumber || "N/A"}</p>
                              </div>
                              <div className="bg-black/20 p-3 rounded-xl flex-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase">Submitted Date</label>
                                <p className="text-white font-mono font-bold">{new Date(club.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><User size={16} /> Applicant Details</h4>

                            <div className="flex items-center gap-3 mb-6">
                              <img src={club.admin?.profileImage || DEFAULT_AVATAR} className="w-12 h-12 rounded-full border border-white/20" />
                              <div>
                                <p className="font-bold text-white">{club.admin?.firstName} {club.admin?.lastName}</p>
                                <p className="text-xs text-white/50">{club.admin?.email}</p>
                              </div>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/40">Student ID</span>
                                <span className="text-white font-mono">{club.admin?.studentId || "N/A"}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/40">Faculty</span>
                                <span className="text-white">{club.admin?.faculty || "N/A"}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/40">Department</span>
                                <span className="text-white">{club.admin?.department || "N/A"}</span>
                              </div>
                              <div className="flex justify-between pb-2">
                                <span className="text-white/40">Batch</span>
                                <span className="text-white">{club.admin?.batch || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-black/20 border-t border-white/5 flex gap-3">
                          <button
                            onClick={() => handleApprove(club.id)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={16} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(club.id)}
                            className="flex-1 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'my_profile' && (
                <Profile
                  user={user}
                  onEditClick={() => setActiveTab('settings')}
                  onUserClick={handleUserClick}
                  onViewClub={(club) => { setSelectedClub(club); setActiveTab('view_club'); }}
                />
              )}

              {activeTab === 'all_members' && user?.role === 'ROLE_SUPERADMIN' && (
                <AllMembers
                  onSelectUser={(m) => {

                    setSelectedUserId(m.id);
                    setActiveTab('view_profile');
                  }}
                />
              )}
              {activeTab === 'settings' && <ProfileSettings user={user} />}

              {activeTab === 'view_event' && selectedEvent && (
                <EventDetails
                  event={selectedEvent}
                  onBack={() => setActiveTab('events')}
                  onImageClick={(url) => setPreviewImage(url)}
                />
              )}

              {activeTab === 'manage_club' && <ClubManager />}
              {activeTab === 'friends_list' && (
                <FriendsList onUserClick={handleUserClick} />
              )}

              {activeTab === 'my_clubs' && (
                <MyClubs
                  user={user}
                  onViewClub={(club) => { setSelectedClub(club); setActiveTab('view_club'); }}
                />
              )}

              {activeTab === 'all_clubs' && (
                <AllClubs onViewClub={(club) => { setSelectedClub(club); setActiveTab('view_club'); }} />
              )}

              {activeTab === 'requests' && <ClubRequests />}
              {activeTab === 'friend_requests' && (
                <FriendRequests onUserClick={handleUserClick} />
              )}

              {activeTab === 'view_club' && selectedClub && (
                <ClubProfile
                  club={selectedClub}
                  user={user}
                  onBack={() => setActiveTab('feed')}
                  onEditClick={() => setActiveTab('club_settings')}
                  onCreatePostClick={() => setActiveTab('create_post')}
                  onPublishEventClick={() => setActiveTab('create_event')}
                  onUserClick={handleUserClick}
                  onViewEvent={(evt) => {
                    setSelectedEvent(evt);
                    setActiveTab('view_event');
                  }}
                />
              )}

              {activeTab === 'club_settings' && selectedClub && (
                <ClubSettings
                  club={selectedClub}
                  onBack={() => setActiveTab('view_club')}
                  onUpdateClub={(updatedData) => { setSelectedClub({ ...selectedClub, ...updatedData }); }}
                />
              )}

              {activeTab === 'create_post' && selectedClub && (
                <CreatePost
                  club={selectedClub} user={user} onBack={() => setActiveTab('view_club')}
                  onPostCreated={(newPost) => { console.log("New Post:", newPost); }}
                />
              )}

              {activeTab === 'create_event' && selectedClub && (
                <CreateEvent
                  club={selectedClub} onBack={() => setActiveTab('view_club')}
                  onEventCreated={(newEvent) => { console.log("New Event:", newEvent); }}
                />
              )}

              {activeTab === 'events' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {getFilteredEvents().length === 0 ? (
                    <div className="glass-panel p-8 rounded-3xl text-center text-white/50 col-span-full">
                      {searchTerm ? `No events found matching "${searchTerm}"` : "No upcoming events."}
                    </div>
                  ) : (
                    getFilteredEvents().map((evt, idx) => (
                      <div key={evt.id} className="glass-panel rounded-3xl overflow-hidden hover:bg-white/5 transition-all duration-500 group animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="h-48 relative overflow-hidden bg-black/50">
                          {evt.imageUrl ? (
                            <img src={`http://localhost:8080${evt.imageUrl}`} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                          ) : (<div className="w-full h-full flex items-center justify-center bg-emerald-500/10"><ImageIcon size={40} className="text-emerald-500/20" /></div>)}
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg">{evt.date ? new Date(evt.date).toLocaleDateString() : 'TBD'}</div>
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 rounded-md">{evt.club?.name || "Official Event"}</span>
                          <h3 className="font-bold text-lg text-white mt-3 mb-1 line-clamp-1">{evt.title}</h3>
                          <div className="space-y-2 mt-4 text-sm text-white/60">
                            <div className="flex items-center gap-2"><Clock size={14} className="text-emerald-400" /> {evt.time || "Time not set"}</div>
                            <div className="flex items-center gap-2"><MapPin size={14} className="text-emerald-400" /> {evt.location || "Venue TBD"}</div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedEvent(evt);
                              setActiveTab('view_event');
                            }}
                            className="w-full mt-6 py-2.5 rounded-xl border border-white/20 font-semibold text-sm text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all shadow-lg"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
          <img src={previewImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain animate-fade-in" alt="Full size preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

const TabButton = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`pb-3 text-sm font-bold transition-all relative ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>
    {label}
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></span>}
  </button>
);

export default Dashboard;
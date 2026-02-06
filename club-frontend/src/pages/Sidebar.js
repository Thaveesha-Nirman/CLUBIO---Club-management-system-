import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, LogOut, 
  ShieldCheck, PlusCircle, MoreVertical, Compass, Globe, 
  UserCheck, UserPlus
} from 'lucide-react';
import logo from '../components/logo.png';
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const Sidebar = ({ user, logout, activeTab, setActiveTab, isOpen, toggleSidebar, mounted }) => {
  
  const navItems = [
    { id: 'feed', label: 'Feed', icon: LayoutDashboard },
    { id: 'my_clubs', label: 'My Clubs', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'explore', label: 'Explore Clubs', icon: Compass },
    { id: 'create_club', label: 'Start a Club', icon: PlusCircle },
    { id: 'friend_requests', label: 'Friend Requests', icon: UserPlus },
    { id: 'friends_list', label: 'Friends', icon: Users },
  ];

  const activeIndex = navItems.findIndex(item => item.id === activeTab);
  
  let sliderTopPosition = 0;
  let isSliderVisible = false;

  if (activeIndex >= 0) {
    sliderTopPosition = activeIndex * 52;
    isSliderVisible = true;
  } else if (activeTab === 'requests') {
    sliderTopPosition = (navItems.length * 52) + 56.5; 
    
    isSliderVisible = true;
  } else if (activeTab === 'all_clubs') {
    sliderTopPosition = (navItems.length * 52) + 207;
    isSliderVisible = true;
  } 
  else if (activeTab === 'all_members') {
    sliderTopPosition = (navItems.length * 52) + 162;
    isSliderVisible = true;
  }
  
  else if (activeTab === 'approvals') {
    sliderTopPosition = (navItems.length * 52) + 250;
    isSliderVisible = true;
  }

  return (
    <>
      <style>{`
        .sidebar-glass {
          background: rgba(0, 10, 5, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 10px 0 40px rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 10px; }
      `}</style>

      <div 
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      <button 
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 lg:top-6 lg:left-6 z-[60] p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group
          ${isOpen 
            ? 'bg-transparent text-emerald-100/50 border-transparent hover:text-white hover:bg-emerald-900/40' 
            : 'bg-emerald-900/80 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-500/50'
          }
          ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        `}
      >
        <MoreVertical 
          size={24} 
          className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`} 
        />
      </button>

      <aside 
        className={`fixed top-0 left-0 h-full w-72 sidebar-glass flex flex-col z-50 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        
        <div className="p-8 pb-6 pl-20 flex items-center border-b border-white/5 h-[88px]">
           <h1 className={`text-xl font-montserrat font-extrabold text-white tracking-wide flex items-center gap-2 drop-shadow-md transition-all duration-700 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
<div className="flex items-center gap-3">
    <img 
        src={logo} 
        alt="Clubio Logo" 
        className="w-7 h-7 object-contain" 
    />
    <span className="font-montserrat font-black tracking-widest text-lg text-white">
        CLUBIO
    </span>
</div>           </h1>
        </div>

        {/* User Profile */}
        <div 
          onClick={() => setActiveTab('my_profile')} 
          className={`mx-6 mt-6 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-white/10 transition-all duration-500 cursor-pointer group ${mounted ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'}`}
        >
          <img 
            src={user?.profileImage || DEFAULT_AVATAR} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50 shadow-lg group-hover:scale-105 transition-transform" 
          />
           <div className="overflow-hidden">
            <h3 className="font-bold text-white text-sm truncate">{user?.username || 'User'}</h3>
            <p className="text-[10px] text-emerald-400 font-medium truncate uppercase tracking-wider">{user?.role?.replace('ROLE_', '') || 'Student'}</p>
          </div>
        </div>

        <nav className={`flex-1 px-4 mt-8 overflow-y-auto custom-scrollbar transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4'}`}>
          
          <div className="relative">
            <p className="px-4 text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-3">Navigation</p>
            <div className="relative flex flex-col gap-2">
              <div 
                className={`absolute left-0 w-full h-[44px] bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 rounded-xl shadow-lg shadow-emerald-900/20 backdrop-blur-sm transition-all duration-300 ease-out pointer-events-none border border-emerald-400/20
                  ${isSliderVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{ transform: `translateY(${sliderTopPosition}px)` }} 
              />
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) toggleSidebar(); 
                    }}
                    className={`relative w-full flex items-center gap-3 px-4 h-[44px] rounded-xl transition-all duration-300 font-medium text-sm z-10
                      ${isActive ? 'text-white' : 'text-emerald-100/70 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'drop-shadow-md' : ''} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPERADMIN') && (
            <div className="mt-6 pt-2 border-t border-white/5 relative">
              <p className="px-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 mt-2">Management</p>
              
              <button 
                onClick={() => {
                  setActiveTab('requests');
                  if (window.innerWidth < 1024) toggleSidebar(); 
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm h-[44px] z-10
                    ${activeTab === 'requests' ? 'text-white' : 'text-emerald-300 hover:bg-emerald-500/10'}
                `}
              >
                <UserCheck size={20} /> Join Requests
              </button>
            </div>
          )}

          {user?.role === 'ROLE_SUPERADMIN' && (
            <div className="mt-6 pt-2 border-t border-white/5 relative">
              <p className="px-4 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 mt-2">Super Admin</p>
              
              <button 
      onClick={() => {
          setActiveTab('all_members');
          if (window.innerWidth < 1024) toggleSidebar(); 
      }}
      className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm h-[44px] z-10
          ${activeTab === 'all_members' ? 'text-white' : 'text-emerald-400/60 hover:bg-emerald-500/10'}
      `}
    >
      <Users size={20} /> All Members
    </button>
              <button 
                onClick={() => {
                    setActiveTab('all_clubs');
                    if (window.innerWidth < 1024) toggleSidebar(); 
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm h-[44px] z-10
                    ${activeTab === 'all_clubs' ? 'text-white' : 'text-blue-400 hover:bg-blue-500/10'}
                `}
              >
                <Globe size={20} /> All Registered Clubs
              </button>

              <button 
                onClick={() => {
                    setActiveTab('approvals');
                    if (window.innerWidth < 1024) toggleSidebar(); 
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm h-[44px] z-10
                    ${activeTab === 'approvals' ? 'text-white' : 'text-red-400 hover:bg-red-500/10'}
                `}
              >
                <ShieldCheck size={20} /> Pending Approvals
              </button>
            </div>
          )}

        </nav>

        <div className={`p-6 border-t border-white/5 transition-all duration-500 ${mounted ? 'opacity-100 delay-300' : 'opacity-0'}`}>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100/60 hover:bg-red-500/20 hover:text-red-200 transition-all font-medium text-sm group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
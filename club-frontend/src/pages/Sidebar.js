import React from 'react';

/**
 * * Member 06 : Mainly UI/UX
 * * Sidebar navigation component with glassmorphism styling and active state tracking.
 */
import {
  LayoutDashboard, Users, Calendar, LogOut,
  ShieldCheck, PlusCircle, MoreVertical, Compass, Globe,
  UserCheck, UserPlus
} from 'lucide-react';
import logo from '../components/logo.png';
const DEFAULT_AVATAR = "data:image/png;base64,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";

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
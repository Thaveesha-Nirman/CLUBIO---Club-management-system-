import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import { MessageCircle, UserMinus, Search, Users, MapPin, GraduationCap, Check } from 'lucide-react';

const API_BASE = 'http://localhost:8080';
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const FriendsList = ({ onUserClick }) => {
  const { showConfirm } = useAlert();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('clubUser');
      const token = stored ? JSON.parse(stored).token : null;
      const headers = { Authorization: `Bearer ${token}` };

      const res = await fetch(`${API_BASE}/api/friends/list`, { headers });
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (e) {
      console.error("Fetch friends error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleUnfriend = async (friendshipId) => {
    const confirmed = await showConfirm("Remove this friend?", { isDanger: true, confirmText: "Remove", cancelText: "Cancel" });
    if (!confirmed) return;
    try {
      const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
      const res = await fetch(`${API_BASE}/api/friends/remove/${friendshipId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchFriends();
    } catch (e) { console.error(e); }
  };

  const filteredFriends = friends.filter(f => {
    const friend = f.friend;
    const fullName = `${friend?.firstName} ${friend?.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) return (
    <div className="flex justify-center py-40">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12 font-inter text-white">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold font-montserrat tracking-tight text-emerald-400">My Friends</h2>
          <p className="text-white/50 text-sm italic">You have {friends.length} active connections.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 glass-panel rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-sm shadow-inner backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFriends.map(f => {
          const friend = f.friend;
          if (!friend) return null;

          const userImageUrl = friend.profileImage
            ? (friend.profileImage.startsWith('http') ? friend.profileImage : `${API_BASE}${friend.profileImage.startsWith('/') ? '' : '/'}${friend.profileImage}`)
            : DEFAULT_AVATAR;

          return (
            <div key={f.id} className="glass-panel rounded-[2rem] p-6 border border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col shadow-2xl animate-fade-in relative overflow-hidden">
              <div className="flex flex-col items-center text-center mb-6 relative z-10">
                <div className="relative mb-4 cursor-pointer" onClick={() => onUserClick(friend)}>
                  <img
                    src={userImageUrl}
                    className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/20 group-hover:scale-105 transition-transform duration-500 shadow-xl"
                    alt="Friend"
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center shadow-lg">
                    <Check size={12} className="text-black stroke-[4]" />
                  </div>
                </div>
                <h4 className="font-bold text-white truncate w-full text-lg mb-1">{friend.firstName} {friend.lastName}</h4>
                <p className="text-[10px] text-emerald-400/60 uppercase font-black tracking-widest">{friend.role?.replace('ROLE_', '') || 'STUDENT'}</p>
              </div>

              <div className="space-y-2 mb-8 flex-1 relative z-10">
                <div className="flex items-center gap-2 text-[11px] text-white/40">
                  <MapPin size={12} className="text-emerald-500/50" />
                  <span className="truncate">{friend.department || "NSBM University"}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-white/40">
                  <GraduationCap size={12} className="text-emerald-500/50" />
                  <span className="truncate">{friend.batch || "Green Student"}</span>
                </div>
              </div>

              <div className="flex gap-2 relative z-20">
                <a
                  href={`https://wa.me/${friend.mobileNumber?.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <button
                  onClick={() => handleUnfriend(f.id)}
                  className="p-3 bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-2xl transition-all border border-white/5 active:scale-95 shadow-lg"
                >
                  <UserMinus size={18} />
                </button>
              </div>

              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            </div>
          );
        })}
      </div>

      {filteredFriends.length === 0 && (
        <div className="col-span-full py-32 flex flex-col items-center text-center opacity-30 italic">
          <Users size={64} className="mb-4 text-emerald-500/50" />
          <p className="text-lg font-montserrat">{searchTerm ? "No friends match your search." : "Your friend list is empty, bro."}</p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, CheckCircle, XCircle, UserPlus, Send } from 'lucide-react';

const API_BASE = 'http://localhost:8080';
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const FriendRequests = ({ onUserClick }) => {
  const [activeSubTab, setActiveSubTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('clubUser');
      const token = stored ? JSON.parse(stored).token : null;
      const headers = { Authorization: `Bearer ${token}` };

      const [receivedRes, sentRes] = await Promise.all([
        fetch(`${API_BASE}/api/friends/requests/received`, { headers }),
        fetch(`${API_BASE}/api/friends/requests/sent`, { headers })
      ]);

      if (receivedRes.ok) setReceivedRequests(await receivedRes.json());
      if (sentRes.ok) setSentRequests(await sentRes.json());

    } catch (error) { 
        console.error("Fetch error:", error); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (requestId, action) => {
    try {
      const stored = localStorage.getItem('clubUser');
      const token = JSON.parse(stored).token;
      const res = await fetch(`${API_BASE}/api/friends/${action}/${requestId}`, {
        method: action === 'accept' ? 'PUT' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchRequests();
    } catch (error) { console.error(error); }
  };

  if (loading) return (
    <div className="flex justify-center py-40">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  const currentList = activeSubTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12 font-inter text-white">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-montserrat tracking-tight text-emerald-400">Friend Requests</h2>
          <p className="text-white/50 text-sm italic">Manage your campus connections:</p>
        </div>
        
        <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 w-fit shadow-2xl">
          <button 
            onClick={() => setActiveSubTab('received')} 
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeSubTab === 'received' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'}`}
          >
            Received ({receivedRequests.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('sent')} 
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeSubTab === 'sent' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'}`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentList.map(req => {
          const displayUser = activeSubTab === 'received' ? req?.requester : req?.addressee;
          
          if (!displayUser) return null;

          const userImageUrl = displayUser.profileImage 
            ? (displayUser.profileImage.startsWith('http') ? displayUser.profileImage : `${API_BASE}${displayUser.profileImage.startsWith('/') ? '' : '/'}${displayUser.profileImage}`)
            : DEFAULT_AVATAR;

          return (
            <div key={req.id} className="glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center text-center group transition-all duration-500 shadow-xl hover:border-emerald-500/30 animate-fade-in relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
              
              <div className="relative mb-6 cursor-pointer" onClick={() => onUserClick(displayUser)}>
                <div className="w-24 h-24 rounded-full p-1 border-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-500">
                  <img 
                    src={userImageUrl} 
                    className="w-full h-full rounded-full object-cover shadow-2xl" 
                    alt="Avatar"
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-black border border-white/10 p-1.5 rounded-full text-emerald-400 shadow-xl">
                  {activeSubTab === 'received' ? <UserCheck size={14} /> : <Send size={14} />}
                </div>
              </div>
              
              <h4 className="text-white font-bold font-montserrat text-lg truncate w-full mb-1">{displayUser.firstName} {displayUser.lastName}</h4>
              <p className="text-[10px] text-emerald-400/60 font-black uppercase tracking-[0.2em] mb-8">
                {displayUser.role?.replace('ROLE_', '') || 'STUDENT'}
              </p>
              
              <div className="w-full flex gap-3 relative z-10">
                {activeSubTab === 'received' ? (
                  <>
                    <button 
                      onClick={() => handleAction(req.id, 'accept')} 
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/40"
                    >
                        <CheckCircle size={14} /> Approve
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'remove')} 
                      className="px-5 py-3 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-2xl transition-all border border-white/5 active:scale-95"
                    >
                        <XCircle size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleAction(req.id, 'remove')} 
                    className="w-full py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Clock size={14} /> Cancel Request
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {currentList.length === 0 && (
        <div className="col-span-full py-32 flex flex-col items-center text-center opacity-30 italic">
          <UserPlus size={64} className="mb-4 text-emerald-500/50" />
          <p className="text-lg font-montserrat">No {activeSubTab} requests found.</p>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
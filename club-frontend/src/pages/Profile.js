import React, { useEffect, useState } from 'react';

/**
 * * Member 08 : Student Hub Lead
 * * A comprehensive profile page displaying user details, memberships, and social activity.
 */
import { useUI } from '../context/UIContext';
import {
  Settings, Phone, Link as LinkIcon,
  Share2, Users, Hash, UserPlus, Check, Clock, MessageCircle,
  Github, Linkedin, MapPin, GraduationCap, X, CheckCircle, XCircle
} from 'lucide-react';
import ff from '../components/ff.png';

import PostCard from '../components/PostCard';

const API_BASE = 'http://localhost:8080';

const Profile = ({ currentUser, user, profileId, onEditClick, onViewClub, onUserClick }) => {
  const { showToast, showConfirm } = useUI();
  const [targetUser, setTargetUser] = useState(null);
  const [userClubs, setUserClubs] = useState([]);
  const [managedClubs, setManagedClubs] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const [friendStatus, setFriendStatus] = useState(null);
  const [friendshipId, setFriendshipId] = useState(null);
  const [isIncomingRequest, setIsIncomingRequest] = useState(false);
  const [isProcessingFriend, setIsProcessingFriend] = useState(false);

  const activeUser = currentUser || user;
  const displayId = profileId || activeUser?.id || JSON.parse(localStorage.getItem('clubUser'))?.id;
  const isOwnProfile = (!profileId) || (String(displayId) === String(activeUser?.id));

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!displayId) return setLoading(false);
      try {
        let token = null;
        try {
          const stored = localStorage.getItem('clubUser');
          if (stored) token = JSON.parse(stored).token;
        } catch (e) { }

        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, memberRes, managedRes, postRes] = await Promise.all([
          fetch(`${API_BASE}/api/clubs/users/${displayId}/details`, { headers }),
          fetch(`${API_BASE}/api/clubs/users/${displayId}/memberships`, { headers }),
          fetch(`${API_BASE}/api/clubs/users/${displayId}/managed-clubs`, { headers }),
          fetch(`${API_BASE}/api/clubs/users/${displayId}/shared-posts`, { headers })
        ]);

        if (userRes.ok) setTargetUser(await userRes.json());
        if (memberRes.ok) {
          const m = await memberRes.json();
          setUserClubs(m.filter(x => x.status === 'APPROVED'));
        }
        if (managedRes.ok) setManagedClubs(await managedRes.json());
        if (postRes.ok) {
          const data = await postRes.json();
          const sortedData = data.sort((a, b) => b.id - a.id);
          setSharedPosts(sortedData);
        }

        if (!isOwnProfile) {
          const statusRes = await fetch(`${API_BASE}/api/friends/status/${displayId}`, { headers });
          if (statusRes.ok) {
            const relation = await statusRes.json();
            if (relation) {
              setFriendStatus(relation.status);
              setFriendshipId(relation.id);

              if (relation.status === 'PENDING' && String(relation.requester.id) === String(displayId)) {
                setIsIncomingRequest(true);
              } else {
                setIsIncomingRequest(false);
              }
            } else {
              setFriendStatus(null);
            }
          }
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [displayId, isOwnProfile]);

  const handleAddFriend = async () => {
    setIsProcessingFriend(true);
    try {
      const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
      const res = await fetch(`${API_BASE}/api/friends/send/${displayId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFriendStatus('PENDING');
        setFriendshipId(data.id);
        setIsIncomingRequest(false);
        showToast("Friend request sent", "success");
      }
    } catch (err) { console.error(err); showToast("Failed to send request", "error"); }
    finally { setIsProcessingFriend(false); }
  };

  const handleAcceptRequest = async () => {
    setIsProcessingFriend(true);
    try {
      const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
      const res = await fetch(`${API_BASE}/api/friends/accept/${friendshipId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setFriendStatus('ACCEPTED');
        setIsIncomingRequest(false);
        showToast("Friend request accepted", "success");
      }
    } catch (err) { console.error(err); showToast("Failed to accept request", "error"); }
    finally { setIsProcessingFriend(false); }
  };

  const handleCancelOrReject = async () => {
    const msg = isIncomingRequest ? "Ignore this friend request?" : "Cancel this friend request?";

    showConfirm(msg, async () => {
      setIsProcessingFriend(true);
      try {
        const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
        const res = await fetch(`${API_BASE}/api/friends/remove/${friendshipId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          setFriendStatus(null);
          setFriendshipId(null);
          setIsIncomingRequest(false);
          showToast(isIncomingRequest ? "Request ignored" : "Request canceled", "info");
        }
      } catch (err) { console.error(err); showToast("Action failed", "error"); }
      finally { setIsProcessingFriend(false); }
    });
  };

  const handleDeletePost = async (postId) => {
    showConfirm("Remove this post from your profile?", async () => {
      try {
        const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
        const res = await fetch(`${API_BASE}/api/clubs/posts/${postId}/share`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          setSharedPosts(sharedPosts.filter(p => p.id !== postId));
          showToast("Post removed", "success");
        }
      } catch (e) { console.error(e); showToast("Failed to delete post", "error"); }
    });
  };

  const getRoleBadge = (role) => {
    if (role === 'ROLE_SUPERADMIN') return 'SUPER ADMIN';
    if (role === 'ROLE_ADMIN') return 'ADMIN';
    return 'USER';
  };

  if (loading) return <div className="flex justify-center py-40"><div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div></div>;
  if (!targetUser) return <p className="text-center text-white/30 py-40">Profile not found</p>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12 font-inter">

      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
          <img src={previewImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full p-1 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <img src={getFullUrl(targetUser.profileImage) || "data:image/png;base64,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"} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="absolute bottom-1 right-1 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-black">
                {getRoleBadge(targetUser.role)}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{targetUser.firstName} {targetUser.lastName}</h1>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 px-4">{targetUser.faculty || "NSBM Green University"}</p>

            <div className="w-full space-y-3">
              {isOwnProfile ? (
                <button onClick={onEditClick} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all text-sm font-semibold flex items-center justify-center gap-2 group">
                  <Settings size={16} className="group-hover:rotate-90 transition-transform" /> Edit Profile
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {friendStatus === 'ACCEPTED' ? (
                    <div className="flex flex-col gap-2">
                      <div className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold flex items-center justify-center gap-2">
                        <Check size={16} /> Friends
                      </div>
                      {targetUser.whatsappLink && (
                        <a href={targetUser.whatsappLink} target="_blank" rel="noreferrer" className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg">
                          <MessageCircle size={16} /> Chat on WhatsApp
                        </a>
                      )}
                    </div>
                  ) : friendStatus === 'PENDING' ? (
                    isIncomingRequest ? (
                      <div className="flex flex-col gap-2">
                        <button onClick={handleAcceptRequest} disabled={isProcessingFriend} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                          <CheckCircle size={16} /> Accept Request
                        </button>
                        <button onClick={handleCancelOrReject} disabled={isProcessingFriend} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl text-sm font-semibold transition-all border border-white/5">
                          Ignore
                        </button>
                      </div>
                    ) : (
                      <button onClick={handleCancelOrReject} disabled={isProcessingFriend} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all text-sm font-semibold flex items-center justify-center gap-2 group active:scale-95">
                        <X size={16} className="text-white/70 group-hover:rotate-90 transition-transform" />
                        Cancel Request
                      </button>
                    )
                  ) : (
                    <button onClick={handleAddFriend} disabled={isProcessingFriend} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-900/20">
                      <UserPlus size={16} /> Add Friend
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><span className="w-1 h-4 bg-emerald-500 rounded-full"></span> Details</h3>
            <div className="space-y-4 text-sm text-emerald-100/70">
              <InfoRow icon={<Hash size={18} />} label="Student ID" value={targetUser.studentId} />
              <InfoRow icon={<Phone size={18} />} label="Mobile" value={isOwnProfile ? targetUser.mobileNumber : null} />
              <InfoRow icon={<MapPin size={18} />} label="Department" value={targetUser.department} />
              <InfoRow icon={<GraduationCap size={18} />} label="Batch" value={targetUser.batch} />
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
              {targetUser.linkedinUrl && <a href={targetUser.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-white/60 hover:text-emerald-400 transition"><Linkedin size={14} /> LinkedIn Profile</a>}
              {targetUser.githubUrl && <a href={targetUser.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-white/60 hover:text-emerald-400 transition"><Github size={14} /> GitHub Profile</a>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">About Me</h3>
            <p className="text-emerald-100/80 leading-relaxed font-light whitespace-pre-wrap">{targetUser.bio || "Hello! I haven't written a bio yet."}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users size={20} className="text-emerald-500" /> Joined Clubs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {managedClubs.map(c => (
                <ClubSimpleCard key={c.id} club={c} role="Admin" onClick={(cl) => cl.status !== 'PENDING' ? onViewClub(cl) : showToast("Club is waiting for approval", "info")} />
              ))}
              {userClubs.map(m => <ClubSimpleCard key={m.id} club={m.club} role="Member" onClick={onViewClub} />)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Share2 size={20} className="text-emerald-500" /> Recent Activity</h3>
            <div className="space-y-6">
              {sharedPosts.map((sharedItem) => (
                <PostCard
                  key={sharedItem.id}
                  post={sharedItem.post || sharedItem}
                  user={activeUser}
                  onDelete={isOwnProfile ? () => handleDeletePost(sharedItem.id) : null}
                  onImageClick={(url) => setPreviewImage(url)}
                  onClubClick={onViewClub}
                  onUserClick={onUserClick}
                  hideShare={isOwnProfile}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => value ? <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20"><span className="text-emerald-500">{icon}</span><div className="overflow-hidden"><p className="text-[10px] uppercase text-emerald-500/60 font-bold">{label}</p><p className="text-white truncate">{value}</p></div></div> : null;

const ClubSimpleCard = ({ club, role, onClick }) => (
  <div onClick={() => onClick?.(club)} className="glass-panel rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer border border-white/5 relative overflow-hidden shadow-lg">
    {club.status === 'PENDING' && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl-lg z-10 shadow-lg">PENDING</div>}
    <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
      <img src={club.logoUrl ? `${API_BASE}${club.logoUrl}` : 'https://via.placeholder.com/50'} alt={club.name} className={`w-full h-full object-cover ${club.status === 'PENDING' ? 'opacity-50 grayscale' : ''}`} />
    </div>
    <div className="overflow-hidden text-sm">
      <h4 className="font-bold text-white truncate">{club.name}</h4>
      <p className={`text-[10px] font-bold uppercase ${role === 'Admin' ? 'text-emerald-400' : 'text-white/50'}`}>{club.status === 'PENDING' ? 'WAITING' : role}</p>
    </div>
  </div>
);

export default Profile;
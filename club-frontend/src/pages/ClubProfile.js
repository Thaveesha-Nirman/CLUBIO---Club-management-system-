import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import {
    ArrowLeft, Settings, Calendar, Image as ImageIcon,
    MapPin, Users, Edit3, Plus, ExternalLink, CheckCircle, Clock, X,
    Trash2, Maximize2, MessageCircle, ArrowRight, UserCog
} from 'lucide-react';
import PostCard from '../components/PostCard';
import MemberManagement from './MemberManagement';
import CreatePost from './CreatePost';

const JoinModal = ({ isOpen, onClose, club, onConfirmJoin, isJoining }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm transition-all"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md p-8 rounded-[2rem] border border-white/20 bg-[#121212]/95 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-20"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mb-8 pt-2 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <Users size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                        Join <br />
                        <span className="text-emerald-400 drop-shadow-md">{club.name}</span>
                    </h3>
                </div>

                <div className="space-y-6 relative z-10">
                    <p className="text-white/80 text-sm text-center font-medium leading-relaxed">
                        To become a member, please complete the registration form below before sending your request.
                    </p>

                    {club.googleFormLink ? (
                        <a
                            href={club.googleFormLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-1 pl-4 pr-2 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-500/50 hover:bg-black/60 transition-all group/link cursor-pointer shadow-inner"
                        >
                            <div className="flex items-center gap-3">
                                <ExternalLink size={18} className="text-emerald-400" />
                                <div className="text-left py-3">
                                    <p className="text-white text-sm font-bold">Registration Form</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider font-bold">Google Forms</p>
                                </div>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover/link:text-white group-hover/link:bg-emerald-500 transition-all">
                                <ArrowRight size={16} />
                            </div>
                        </a>
                    ) : (
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/10 text-white/50 text-xs text-center italic">
                            No registration form required.
                        </div>
                    )}

                    <button
                        onClick={onConfirmJoin}
                        disabled={isJoining}
                        className="w-full py-3.5 rounded-xl border border-white/20 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                    >
                        {isJoining ? "Processing..." : <><Plus size={18} strokeWidth={2.5} /> Send Join Request</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ClubProfile = ({ club, user, onBack, onEditClick, onPublishEventClick, onUserClick, onViewEvent }) => {
    const { showAlert, showConfirm } = useAlert();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [events, setEvents] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    const [membershipStatus, setMembershipStatus] = useState(null);
    const [memberCount, setMemberCount] = useState(0);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const [isManagingMembers, setIsManagingMembers] = useState(false);
    const [isCreatingPost, setIsCreatingPost] = useState(false); 
    const [editingPost, setEditingPost] = useState(null);        

    const isAdmin = user?.email === club?.admin?.email;
    const isPendingClub = club.status === 'PENDING';

    useEffect(() => {
        const fetchMembershipAndCount = async () => {
            try {
                const storedData = localStorage.getItem('clubUser');
                const token = storedData ? JSON.parse(storedData)?.token : null;
                const headers = { "Authorization": `Bearer ${token}` };

                if (user && !isAdmin) {
                    const res = await fetch("http://localhost:8080/api/clubs/my-memberships", { headers });
                    if (res.ok) {
                        const myMemberships = await res.json();
                        const match = myMemberships.find(m => m.club.id === club.id);
                        if (match) setMembershipStatus(match.status);
                    }
                }

                const countRes = await fetch(`http://localhost:8080/api/clubs/${club.id}/members`, { headers });
                if (countRes.ok) {
                    const members = await countRes.json();
                    setMemberCount(members.length);
                }
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        if (club?.id) fetchMembershipAndCount();
    }, [club.id, user, isAdmin]);

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const storedData = localStorage.getItem('clubUser');
                const token = storedData ? JSON.parse(storedData)?.token : null;
                const headers = { "Authorization": `Bearer ${token}` };

                const postsRes = await fetch("http://localhost:8080/api/posts", { headers });
                const eventsRes = await fetch("http://localhost:8080/api/events", { headers });

                if (postsRes.ok && eventsRes.ok) {
                    const allPosts = await postsRes.json();
                    const allEvents = await eventsRes.json();
                    setPosts(allPosts.filter(p => p.club?.id === club.id));
                    setEvents(allEvents.filter(e => e.club?.id === club.id));
                }
            } catch (err) { console.error("Error:", err); }
        };
        if (club?.id) fetchClubData();
    }, [club.id]);

    const getImageUrl = (path) => {
        if (!path) return "https://cdn-icons-png.flaticon.com/512/4264/4264818.png";
        return path.startsWith('http') ? path : `http://localhost:8080${path}`;
    };

    const handleDeletePost = async (postId) => {
        if (!isAdmin) return;
        const confirmed = await showConfirm("Delete post?", { isDanger: true, confirmText: "Delete", cancelText: "Cancel" });
        if (!confirmed) return;
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;

            const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== postId));
                showAlert("Post deleted", "success");
            } else {
                const errorText = await res.text();
                showAlert("Failed to delete: " + errorText, "error");
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!isAdmin) return;
        const confirmed = await showConfirm("Cancel event?", { isDanger: true, confirmText: "Cancel Event", cancelText: "Keep Event" });
        if (!confirmed) return;
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;
            const res = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setEvents(events.filter(e => e.id !== eventId));
        } catch (e) { console.error(e); }
    };

    const handleJoinRequest = async () => {
        setIsJoining(true);
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;
            const res = await fetch(`http://localhost:8080/api/clubs/${club.id}/join`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                showAlert("Request sent! Approval pending.", "success");
                setMembershipStatus("PENDING");
                setShowJoinModal(false);
            }
        } catch (err) { showAlert("Network Error", "error"); } finally { setIsJoining(false); }
    };

    const handlePostSuccess = (newOrUpdatedPost) => {
        if (editingPost) {
            setPosts(posts.map(p => p.id === newOrUpdatedPost.id ? newOrUpdatedPost : p));
            setEditingPost(null);
        } else {
            setPosts([newOrUpdatedPost, ...posts]);
            setIsCreatingPost(false);
        }
    };


    if (isManagingMembers) {
        return (
            <MemberManagement
                club={club}
                onBack={() => setIsManagingMembers(false)}
                onUserClick={onUserClick}
            />
        );
    }

    if (isCreatingPost || editingPost) {
        return (
            <CreatePost
                club={club}
                user={user}
                postToEdit={editingPost} // Pass editing post if exists
                onBack={() => { setIsCreatingPost(false); setEditingPost(null); }}
                onPostCreated={handlePostSuccess}
            />
        );
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto pb-20">

            {isPendingClub && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-2xl mb-6 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                    <Clock size={24} className="animate-pulse" />
                    <div className="text-center">
                        <h3 className="font-bold text-lg">Waiting for Approval</h3>
                        <p className="text-sm opacity-80">This club is currently under review. Actions are disabled.</p>
                    </div>
                </div>
            )}

            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setPreviewImage(null)}>
                    <button className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
                    <img src={previewImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" alt="Preview" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            <div className="relative mb-8">
                <button onClick={onBack} className="absolute top-4 left-4 z-20 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition backdrop-blur-md">
                    <ArrowLeft size={20} />
                </button>

                <div className="h-64 md:h-80 w-full bg-[#1a1a1a] rounded-b-[2rem] relative overflow-hidden group">
                    <img src={getImageUrl(club.coverUrl)} className="w-full h-full object-cover" alt="Club Cover" onError={(e) => e.target.style.display = 'none'} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                    {isAdmin && (
                        <button onClick={onEditClick} className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-md hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon size={14} /> Edit Cover
                        </button>
                    )}
                </div>

                <div className="px-6 md:px-10 relative flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-12 pointer-events-none">
                    <div className="relative group pointer-events-auto">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-[#1a1a1a] border-[6px] border-[#0f172a] flex items-center justify-center overflow-hidden shadow-2xl">
                            <img src={getImageUrl(club.logoUrl)} className="w-full h-full object-cover" alt="Logo" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"} />
                        </div>
                        {isAdmin && (
                            <button onClick={onEditClick} className="absolute bottom-2 right-2 p-2 bg-emerald-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100 border-4 border-[#0f172a]">
                                <Edit3 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 w-full md:w-auto pb-2 pointer-events-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold text-white leading-tight">{club.name}</h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <p className="text-emerald-400 font-medium text-sm flex items-center gap-1.5">
                                        <Users size={14} /> {club.category}
                                    </p>
                                    <div className="h-1 w-1 rounded-full bg-white/20"></div>
                                    <p className="text-white font-bold text-sm">
                                        {memberCount} <span className="text-white/40 font-medium ml-0.5">Members</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-0 justify-start md:justify-end items-center">
                                {isAdmin ? (
                                    <>
                                        {/* 1. MEMBERS  */}
                                        <button
                                            onClick={() => setIsManagingMembers(true)}
                                            disabled={isPendingClub}
                                            className={`px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${isPendingClub ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <UserCog size={16} className="text-emerald-400" /> Members
                                        </button>

                                        {/* 2. Edit Club */}
                                        <button
                                            onClick={onEditClick}
                                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Settings size={16} /> Edit
                                        </button>

                                        {/* 3. Post */}
                                        <button
                                            onClick={() => setIsCreatingPost(true)}
                                            disabled={isPendingClub}
                                            className={`px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${isPendingClub ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Plus size={16} /> Post
                                        </button>

                                        {/* 4. Event */}
                                        <button
                                            onClick={onPublishEventClick}
                                            disabled={isPendingClub}
                                            className={`px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${isPendingClub ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Calendar size={16} /> Event
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                        {membershipStatus === 'APPROVED' && (
                                            <>
                                                <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] font-bold rounded-xl flex items-center gap-2">
                                                    <CheckCircle size={16} /> Member
                                                </div>
                                                {club.whatsappGroupLink && (
                                                    <a href={club.whatsappGroupLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[13px] font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all">
                                                        <MessageCircle size={16} /> WhatsApp
                                                    </a>
                                                )}
                                            </>
                                        )}
                                        {membershipStatus === 'PENDING' && (
                                            <div className="px-5 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[13px] font-bold rounded-xl flex items-center gap-2">
                                                <Clock size={16} /> Request Pending
                                            </div>
                                        )}
                                        {membershipStatus === null && (
                                            <button
                                                onClick={() => setShowJoinModal(true)}
                                                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 shadow-lg animate-pulse hover:animate-none"
                                            >
                                                <Plus size={16} /> Join Club
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0 pt-6">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">About</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">{club.description || "No description provided."}</p>
                        <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                            <Calendar size={12} /> Created on {new Date(club.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Admin</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-white/10 flex items-center justify-center text-emerald-400 font-bold overflow-hidden shrink-0">
                                {club.admin?.profileImage ? (
                                    <img
                                        src={getImageUrl(club.admin.profileImage)}
                                        className="w-full h-full object-cover"
                                        alt="Admin"
                                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"}
                                    />
                                ) : (
                                    club.admin?.firstName?.charAt(0) || "A"
                                )}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{club.admin?.firstName} {club.admin?.lastName}</p>
                                <p className="text-white/40 text-xs">Club President</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-6 border-b border-white/10 pb-1 mb-4">
                        <button onClick={() => setActiveTab('posts')} className={`pb-3 text-sm font-bold transition-all ${activeTab === 'posts' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-white/40 hover:text-white'}`}>Posts</button>
                        <button onClick={() => setActiveTab('events')} className={`pb-3 text-sm font-bold transition-all ${activeTab === 'events' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-white/40 hover:text-white'}`}>Events</button>
                    </div>

                    {activeTab === 'posts' && (
                        <div className="space-y-6 animate-fade-in">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        user={user}
                                        onDelete={isAdmin ? handleDeletePost : null}
                                        onEdit={isAdmin ? () => setEditingPost(post) : null}
                                        onImageClick={(url) => setPreviewImage(url)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 glass-panel rounded-3xl border border-white/10"><p className="text-white/30 text-sm">No posts yet.</p></div>
                            )}
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            {events.length > 0 ? events.map((evt) => (
                                <div key={evt.id} className="glass-panel p-0 rounded-[2rem] border border-white/5 overflow-hidden hover:bg-white/5 transition-all duration-500 group relative">
                                    {isAdmin && (
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt.id); }} className="absolute top-4 right-4 z-20 p-2 bg-black/40 text-white/50 hover:text-red-500 hover:bg-red-500/20 backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <div className="h-48 relative overflow-hidden bg-black/50 cursor-pointer" onClick={() => evt.imageUrl && setPreviewImage(`http://localhost:8080${evt.imageUrl}`)}>
                                        {evt.imageUrl ? (
                                            <img src={`http://localhost:8080${evt.imageUrl}`} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                        ) : <div className="w-full h-full flex items-center justify-center bg-emerald-500/10"><ImageIcon size={40} className="text-emerald-500/20" /></div>}
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg">{evt.date ? new Date(evt.date).toLocaleDateString() : 'TBD'}</div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{evt.title}</h3>
                                        <div className="space-y-2 mt-4 text-sm text-white/60">
                                            <div className="flex items-center gap-2"><Calendar size={14} className="text-emerald-400" /> {evt.time || "TBD"}</div>
                                            <div className="flex items-center gap-2"><MapPin size={14} className="text-emerald-400" /> {evt.location || "TBD"}</div>
                                        </div>
                                        <button
                                            onClick={() => onViewEvent(evt)} 
                                            className="w-full mt-6 py-2.5 rounded-xl border border-white/20 font-semibold text-sm text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all"
                                        >
                                            View Details
                                        </button>                          </div>
                                </div>
                            )) : <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 col-span-full"><p className="text-white/30 text-sm">No upcoming events.</p></div>}
                        </div>
                    )}
                </div>
            </div>

            <JoinModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                club={club}
                onConfirmJoin={handleJoinRequest}
                isJoining={isJoining}
            />
        </div>
    );

};

export default ClubProfile;
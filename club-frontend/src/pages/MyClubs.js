import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import {
    ArrowRight, ShieldCheck, Users, Clock, LayoutDashboard,
    ExternalLink, MessageCircle, Lock
} from 'lucide-react';

const MyClubs = ({ user, onViewClub }) => {
    const { showAlert } = useAlert();
    const [managedClubs, setManagedClubs] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = localStorage.getItem('clubUser');
                const token = JSON.parse(storedData)?.token;
                const headers = { "Authorization": `Bearer ${token}` };

                const managedRes = await fetch("http://localhost:8080/api/clubs/my-managed", { headers });
                const membershipRes = await fetch("http://localhost:8080/api/clubs/my-memberships", { headers });

                if (managedRes.ok) setManagedClubs(await managedRes.json());
                if (membershipRes.ok) {
                    const mData = await membershipRes.json();
                    setMemberships(mData.filter(m => m.club.admin?.email !== user?.email));
                }
            } catch (error) {
                console.error("Error fetching club data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.email]);

    const getImageUrl = (path) => {
        if (!path) return "https://cdn-icons-png.flaticon.com/512/4264/4264818.png";
        return path.startsWith('http') ? path : `http://localhost:8080${path}`;
    };

    if (loading) return <div className="text-white/60 text-sm animate-pulse text-center py-20">Loading memberships...</div>;

    return (
        <div className="animate-fade-in space-y-12 max-w-6xl mx-auto pb-20">

            {managedClubs.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <ShieldCheck className="text-emerald-400" size={20} />
                        <h2 className="text-lg font-bold text-white tracking-wide">Clubs You Manage</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {managedClubs.map(club => {
                            const isPending = club.status === 'PENDING';

                            return (
                                <div
                                    key={club.id}
                                    onClick={() => {
                                        if (isPending) {
                                            showAlert("This club is waiting for Super Admin approval.", "info");
                                            return;
                                        }
                                        onViewClub(club);
                                    }}
                                    className={`group relative glass-panel p-5 rounded-2xl transition-all duration-300 border flex flex-col h-full 
                            ${isPending
                                            ? 'border-dashed border-white/10 bg-white/[0.02] cursor-not-allowed'
                                            : 'border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-900/10 cursor-pointer'}
                        `}
                                >
                                    {isPending && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold tracking-wide">
                                            <Clock size={10} /> REVIEWING
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getImageUrl(club.logoUrl)}
                                                className={`w-12 h-12 rounded-xl bg-white/5 p-0.5 object-cover ${isPending ? 'opacity-60 grayscale' : ''}`}
                                                alt="Logo"
                                            />
                                            <div>
                                                <h3 className={`font-bold text-base leading-tight transition-colors ${isPending ? 'text-white/70' : 'text-white group-hover:text-emerald-400'}`}>
                                                    {club.name}
                                                </h3>
                                                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                                                    <ShieldCheck size={10} className={isPending ? "text-white/30" : "text-emerald-500"} />
                                                    ADMIN
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-6 flex-1">
                                        {club.description || "No description provided."}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        {isPending ? (
                                            <span className="text-xs text-white/30 font-medium flex items-center gap-2">
                                                <Lock size={12} /> Access Locked
                                            </span>
                                        ) : (
                                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                                                <LayoutDashboard size={14} /> Dashboard
                                            </span>
                                        )}

                                        {!isPending && (
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <Users className="text-white/60" size={20} />
                    <h2 className="text-lg font-bold text-white tracking-wide">Your Memberships</h2>
                </div>

                {memberships.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-white/40 text-sm">You haven't joined any other clubs yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {memberships.map(m => {
                            const isPending = m.status === 'PENDING';
                            const isApproved = m.status === 'APPROVED';

                            return (
                                <div
                                    key={m.id}
                                    onClick={() => { if (!isPending) onViewClub(m.club); }}
                                    className={`group relative glass-panel p-5 rounded-2xl transition-all duration-300 border flex flex-col h-full 
                                ${isPending
                                            ? 'border-dashed border-white/10 bg-white/[0.02]'
                                            : 'hover:bg-white/[0.03] hover:-translate-y-1 hover:border-emerald-500/30 cursor-pointer border-white/5'}
                            `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src={getImageUrl(m.club.logoUrl)} className={`w-10 h-10 rounded-full bg-white/10 p-0.5 object-cover ${isPending ? 'grayscale opacity-50' : ''}`} alt="Logo" />
                                            <div>
                                                <h3 className="font-bold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">{m.club.name}</h3>
                                                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{m.club.category}</p>
                                            </div>
                                        </div>
                                        {isPending ? (
                                            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-wider flex items-center gap-1"><Clock size={10} /> PENDING</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider flex items-center gap-1"><Users size={10} /> MEMBER</span>
                                        )}
                                    </div>

                                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">{m.club.description}</p>

                                    <div className="pt-4 border-t border-white/5 space-y-3">
                                        {isPending && m.club.googleFormLink && (
                                            <a
                                                href={m.club.googleFormLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-bold transition-all border border-yellow-500/10"
                                            >
                                                <ExternalLink size={14} /> Open Registration Form
                                            </a>
                                        )}

                                        {isApproved && m.club.whatsappGroupLink && (
                                            <a
                                                href={m.club.whatsappGroupLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition-all border border-[#25D366]/10"
                                            >
                                                <MessageCircle size={14} /> Join WhatsApp Group
                                            </a>
                                        )}

                                        <div className="flex items-center justify-between pointer-events-none">
                                            <span className="text-xs text-white/30 font-medium group-hover:text-white/60 transition-colors">
                                                {isPending ? 'Waiting for approval' : 'View Club Profile'}
                                            </span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPending ? 'bg-white/5 text-white/20' : 'bg-white/5 text-white/40 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                                                {isPending ? <Lock size={12} /> : <ArrowRight size={14} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default MyClubs;
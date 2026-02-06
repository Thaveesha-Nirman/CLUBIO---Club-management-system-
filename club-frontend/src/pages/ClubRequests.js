import React, { useState, useEffect } from 'react';
import { useUI } from '../context/UIContext';
import {
    Check, X, User, Calendar, Mail, Shield,
    AlertCircle, Clock, ChevronRight, Users, ArrowLeft,
    GraduationCap, Hash, Building2
} from 'lucide-react';

const API_BASE = "http://localhost:8080";

const ClubRequests = ({ onUserClick }) => {
    const { showToast, showConfirm } = useUI();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClubId, setSelectedClubId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = storedData ? JSON.parse(storedData)?.token : null;

            const res = await fetch(`${API_BASE}/api/clubs/requests`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setRequests(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clubsWithRequests = React.useMemo(() => {
        const groups = {};
        requests.forEach(req => {
            const clubId = req.club.id;
            if (!groups[clubId]) {
                groups[clubId] = {
                    id: clubId,
                    name: req.club.name,
                    category: req.club.category,
                    logoUrl: req.club.logoUrl,
                    count: 0
                };
            }
            groups[clubId].count++;
        });
        return Object.values(groups);
    }, [requests]);

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const handleApprove = async (id) => {
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;

            const res = await fetch(`${API_BASE}/api/clubs/requests/${id}/approve`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const newRequests = requests.filter(r => r.id !== id);
                setRequests(newRequests);
                const remainingInClub = newRequests.filter(r => r.club.id === selectedClubId).length;
                if (remainingInClub === 0) setSelectedClubId(null);
                showToast("Request Approved", "success");
            }
        } catch (err) {
            showToast("Failed to approve", "error");
        }
    };

    const handleReject = async (id) => {
        showConfirm("Reject this student?", async () => {
            try {
                const storedData = localStorage.getItem('clubUser');
                const token = JSON.parse(storedData)?.token;

                const res = await fetch(`${API_BASE}/api/clubs/requests/${id}/reject`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const newRequests = requests.filter(r => r.id !== id);
                    setRequests(newRequests);
                    const remainingInClub = newRequests.filter(r => r.club.id === selectedClubId).length;
                    if (remainingInClub === 0) setSelectedClubId(null);
                    showToast("Request Rejected", "info");
                }
            } catch (err) {
                showToast("Failed to reject", "error");
            }
        });
    };

    if (loading) return <div className="text-white/50 text-center py-20 animate-pulse">Loading requests...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
            {!selectedClubId ? (
                <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Membership Requests</h2>
                                <p className="text-emerald-400 text-sm font-medium">{requests.length} Total Pending Approvals</p>
                            </div>
                        </div>
                    </div>

                    {clubsWithRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-3xl border border-white/10 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                                <Shield size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                            <p className="text-white/40 text-sm">No pending membership requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clubsWithRequests.map(club => (
                                <div
                                    key={club.id}
                                    onClick={() => setSelectedClubId(club.id)}
                                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:bg-white/5 hover:border-emerald-500/50 cursor-pointer transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-black/30 border border-white/10 overflow-hidden">
                                            <img
                                                src={club.logoUrl ? getFullUrl(club.logoUrl) : "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"}
                                                className="w-full h-full object-cover"
                                                alt="Club Logo"
                                            />
                                        </div>
                                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
                                            {club.count} New
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{club.name}</h3>
                                    <p className="text-white/40 text-xs mb-4">{club.category}</p>
                                    <div className="flex items-center text-emerald-400 text-sm font-bold gap-2 group-hover:translate-x-2 transition-transform">
                                        View Requests <ChevronRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => setSelectedClubId(null)}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {clubsWithRequests.find(c => c.id === selectedClubId)?.name}
                            </h2>
                            <p className="text-white/50 text-sm">Reviewing applicant list</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {requests
                            .filter(req => req.club.id === selectedClubId)
                            .map((req) => (
                                <div key={req.id} className="glass-panel p-6 rounded-[2rem] border border-white/10 flex flex-col xl:flex-row items-center gap-8 hover:border-white/20 transition-all animate-fade-in overflow-hidden relative">

                                    {/* Student Info  */}
                                    <div className="flex flex-col md:flex-row items-center gap-6 flex-1 w-full">

                                        {/* Profile DP  */}
                                        <div
                                            className="w-24 h-24 rounded-full p-1 border-2 border-white/10 bg-black/20 shrink-0 overflow-hidden shadow-2xl cursor-pointer hover:border-emerald-500/50 hover:scale-105 transition-all"
                                            onClick={() => onUserClick && onUserClick(req.user)}
                                        >
                                            <img
                                                src={getFullUrl(req.user.profileImage) || "https://i.pravatar.cc/150?img=12"}
                                                className="w-full h-full rounded-full object-cover"
                                                alt="User Profile"
                                                onError={(e) => { e.target.src = "https://i.pravatar.cc/150?img=12" }}
                                            />
                                        </div>

                                        {/* User Detail */}
                                        <div className="flex-1 text-center md:text-left space-y-3">
                                            <div>
                                                {/* Student Name */}
                                                <h3
                                                    className="text-2xl font-bold text-white leading-tight cursor-pointer hover:text-emerald-400 transition-colors inline-block"
                                                    onClick={() => onUserClick && onUserClick(req.user)}
                                                >
                                                    {req.user.firstName} {req.user.lastName}
                                                </h3>
                                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Student Applicant</p>
                                            </div>

                                            {/* Details */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-2">
                                                <DetailItem icon={<Mail size={14} />} label="Email" value={req.user.email} />
                                                <DetailItem icon={<Hash size={14} />} label="Student ID" value={req.user.studentId} />
                                                <DetailItem icon={<Building2 size={14} />} label="Department" value={req.user.department} />
                                                <DetailItem icon={<GraduationCap size={14} />} label="Batch" value={req.user.batch} />
                                                <DetailItem icon={<Calendar size={14} />} label="Applied On" value={new Date(req.joinedAt).toLocaleDateString()} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-48 shrink-0">
                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Check size={18} strokeWidth={3} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <X size={18} strokeWidth={3} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2.5 text-white/50 overflow-hidden">
        <span className="text-emerald-500/70 shrink-0">{icon}</span>
        <div className="truncate text-left">
            <p className="text-[9px] uppercase tracking-tighter text-white/30 font-bold leading-none mb-0.5">{label}</p>
            <p className="text-[13px] text-white/80 font-medium truncate leading-tight">{value || 'N/A'}</p>
        </div>
    </div>
);

export default ClubRequests;
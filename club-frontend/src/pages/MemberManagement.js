import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import {
    Search, UserMinus, ArrowLeft, Mail,
    Contact, GraduationCap, Shield, User, Hash
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const MemberManagement = ({ club, onBack, onUserClick }) => {
    const { showAlert, showConfirm } = useAlert();
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;

            const res = await fetch(`${API_BASE}/api/clubs/${club.id}/members`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setMembers(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        const confirmed = await showConfirm("Remove this member from the club?", { isDanger: true, confirmText: "Remove", cancelText: "Cancel" });
        if (!confirmed) return;

        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;

            const res = await fetch(`${API_BASE}/api/clubs/${club.id}/members/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setMembers(members.filter(m => m.id !== userId));
                showAlert("Member removed.", "success");
            }
        } catch (err) {
            showAlert("Failed to remove member.", "error");
        }
    };

    const getProfileImage = (path) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `${API_BASE}${path}`;
    };

    const filteredMembers = members.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="text-white/50 text-center py-20 animate-pulse text-sm">Loading members...</div>;

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Manage Members</h2>
                        <p className="text-white/40 text-sm">{club.name} • {members.length} Members</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                        type="text"
                        placeholder="Search name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 outline-none focus:border-emerald-500/50 w-full md:w-80 transition-all"
                    />
                </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-emerald-400 text-xs uppercase font-bold">
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Student ID</th>
                                <th className="px-6 py-4">Academic Info</th>
                                <th className="px-6 py-4">Batch</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">

                                    {/* Member DP */}
                                    <td className="px-6 py-4">
                                        <div
                                            className="flex items-center gap-3 cursor-pointer group/profile"
                                            onClick={() => onUserClick && onUserClick(member)}
                                        >
                                            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black/20 flex items-center justify-center group-hover/profile:border-emerald-500/50 transition-colors">
                                                {member.profileImage ? (
                                                    <img
                                                        src={getProfileImage(member.profileImage)}
                                                        className="w-full h-full object-cover"
                                                        alt="DP"
                                                        onError={(e) => e.target.src = "https://i.pravatar.cc/150?img=0"}
                                                    />
                                                ) : (
                                                    <User size={18} className="text-white/20" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm group-hover/profile:text-emerald-400 transition-colors">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                <p className="text-white/40 text-[11px]">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Student ID */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white/70 text-xs font-mono">
                                            <Contact size={14} className="text-emerald-400/60" />
                                            {member.studentId || 'N/A'}
                                        </div>
                                    </td>

                                    {/* Academic Details */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-white/60 text-xs flex items-center gap-2">
                                                <GraduationCap size={14} className="text-blue-400/60" /> {member.faculty}
                                            </p>
                                            <p className="text-white/30 text-[10px] ml-5 uppercase">{member.department}</p>
                                        </div>
                                    </td>

                                    {/* Batch */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white/50 text-xs font-bold">
                                            <Hash size={12} className="text-white/20" />
                                            {member.batch || 'N/A'}
                                        </div>
                                    </td>

                                    {/* Remove Button */}
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
                                            className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            title="Remove member"
                                        >
                                            <UserMinus size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-20">
                        <Shield className="mx-auto text-white/10 mb-2" size={32} />
                        <p className="text-white/30 text-sm italic">No members found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberManagement;
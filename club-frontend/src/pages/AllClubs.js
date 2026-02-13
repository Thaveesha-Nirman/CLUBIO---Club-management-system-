import React, { useState, useEffect } from 'react';

/**
 * * Member 02 : origin/feature/club-join-request-36738
 * * UI component for displaying all registered clubs in a grid layout.
 */
import { useAlert } from '../context/AlertContext';
import { Trash2, Shield, Mail, Phone, User, Globe, Calendar, GraduationCap, Building2, AlertTriangle, X } from 'lucide-react';

const DEFAULT_CLUB_LOGO = "https://cdn-icons-png.flaticon.com/512/4264/4264818.png";
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const DeleteModal = ({ isOpen, onClose, onConfirm, clubName }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '30px',
                    width: '90%',
                    maxWidth: '400px',
                    boxShadow: '0 0 50px rgba(0,0,0,0.8)',
                    position: 'relative',
                    opacity: 1,
                    transform: 'none'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '15px', right: '15px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-2">
                        <AlertTriangle size={32} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Delete Club?</h3>
                        <p className="text-gray-300 text-sm">
                            Are you sure you want to delete <br />
                            <span className="text-white font-bold bg-white/10 px-2 py-1 rounded">{clubName || "this club"}</span>?
                        </p>
                        <p className="text-red-400 text-xs mt-2 font-bold uppercase">This cannot be undone.</p>
                    </div>

                    <div className="flex gap-3 w-full mt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shadow-lg"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AllClubs = ({ onViewClub }) => {
    const { showAlert } = useAlert();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clubToDelete, setClubToDelete] = useState(null);

    useEffect(() => {
        /**
         * * Member 02 : Fetches active clubs from the backend.
         */
        const fetchClubs = async () => {
            try {
                const storedData = localStorage.getItem('clubUser');
                const token = storedData ? JSON.parse(storedData)?.token : null;
                const res = await fetch("http://localhost:8080/api/clubs", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const allData = await res.json();

                    const activeOnly = allData.filter(c => c.status === 'ACTIVE');
                    setClubs(activeOnly);
                }
            } catch (err) {
                console.error("Failed to load clubs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    /**
     * * Member 02 : Opens the modal to confirm club deletion.
     */
    const openDeleteModal = (club) => {
        if (!club) return;
        setClubToDelete(club);
        setIsDeleteModalOpen(true);
    };

    /**
     * * Member 02 : Sends a delete request to the backend to remove a club.
     */
    const confirmDelete = async () => {
        if (!clubToDelete) return;
        try {
            const storedData = localStorage.getItem('clubUser');
            const token = JSON.parse(storedData)?.token;

            console.log("Attempting to delete club ID:", clubToDelete.id);

            const res = await fetch(`http://localhost:8080/api/clubs/${clubToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                setClubs(prevClubs => prevClubs.filter(c => c.id !== clubToDelete.id));
                setIsDeleteModalOpen(false);
                setClubToDelete(null);
                showAlert("Club successfully removed from database.", "success");
            } else {
                const errorText = await res.text();
                showAlert(`Delete failed: ${errorText}`, "error");
            }
        } catch (err) {
            console.error("Delete request error:", err);
            showAlert("Connection Error: Is the backend running?", "error");
        }
    };

    if (loading) return <div className="text-white/50 text-center py-20">Loading clubs database...</div>;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Registered Clubs</h2>
                        <p className="text-emerald-400 text-sm font-medium">{clubs.length} Active Clubs</p>
                    </div>
                </div>
            </div>

            {/* Clubs Grid */}
            <div className="space-y-4">
                {clubs.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-white/30 text-lg">No active clubs found.</p>
                    </div>
                ) : (
                    clubs.map(club => (
                        <div key={club.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col xl:flex-row gap-6">

                            {/* Club Info */}
                            <div className="flex items-start gap-5 flex-[1.5]">
                                <div className="w-20 h-20 rounded-2xl bg-black/20 border border-white/10 overflow-hidden flex-shrink-0 shadow-lg">
                                    <img
                                        src={club.logoUrl ? `http://localhost:8080${club.logoUrl}` : DEFAULT_CLUB_LOGO}
                                        className="w-full h-full object-cover"
                                        alt={club.name}
                                        onError={(e) => e.target.src = DEFAULT_CLUB_LOGO}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">{club.category}</span>
                                        <span className="text-[10px] font-bold text-white/30 flex items-center gap-1"><Calendar size={10} /> Founded {new Date(club.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight mb-2">{club.name}</h3>
                                    <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{club.description}</p>
                                </div>
                            </div>

                            {/* Admin Details */}
                            <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5 flex gap-4 min-w-[320px]">
                                <img src={club.admin?.profileImage || DEFAULT_AVATAR} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" alt="Admin" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-white">{club.admin?.firstName} {club.admin?.lastName}</p>
                                            <p className="text-[10px] text-blue-300 uppercase tracking-wider font-bold">{club.admin?.role === 'ROLE_LECTURER' ? 'Lecturer' : 'Student Admin'}</p>
                                        </div>
                                        <Shield size={16} className="text-white/20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-white/60">
                                        <div className="flex items-center gap-1.5"><Building2 size={10} className="text-emerald-400" /> {club.admin?.faculty || "N/A"}</div>
                                        <div className="flex items-center gap-1.5"><GraduationCap size={10} className="text-emerald-400" /> {club.admin?.batch || "N/A"}</div>
                                        <div className="flex items-center gap-1.5 col-span-2"><User size={10} className="text-emerald-400" /> ID: <span className="font-mono text-white/80">{club.admin?.studentId || "N/A"}</span></div>
                                        <div className="flex items-center gap-1.5 col-span-2"><Mail size={10} className="text-emerald-400" /> {club.admin?.email}</div>
                                        <div className="flex items-center gap-1.5 col-span-2"><Phone size={10} className="text-emerald-400" /> {club.contactNumber || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex xl:flex-col gap-3 justify-center border-t xl:border-t-0 xl:border-l border-white/10 pt-4 xl:pt-0 xl:pl-6">
                                <button onClick={() => onViewClub(club)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all w-full xl:w-32 flex items-center justify-center gap-2">View</button>
                                <button onClick={() => openDeleteModal(club)} className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-bold text-red-400 transition-all w-full xl:w-32 flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} clubName={clubToDelete?.name} />
        </div>
    );
};

export default AllClubs;
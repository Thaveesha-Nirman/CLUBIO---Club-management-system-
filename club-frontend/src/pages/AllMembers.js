import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import { Search, UserPlus, UserMinus, Trash2, Mail, Fingerprint, ShieldAlert } from 'lucide-react';

const API_BASE = 'http://localhost:8080';
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const AllMembers = ({ onSelectUser }) => {
  const { showAlert, showConfirm } = useAlert();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
      const res = await fetch(`${API_BASE}/api/users/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error("Fetch error:", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (userId, endpoint, method = "PUT", msg = "Action successful") => {
    const confirmed = await showConfirm("Confirm this administrative action?", { confirmText: "Confirm", cancelText: "Cancel" });
    if (!confirmed) return;
    try {
      const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
      const res = await fetch(`${API_BASE}/api/users/${userId}${endpoint}`, {
        method,
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showAlert(msg, "success");
        fetchUsers();
      }
    } catch (e) { console.error(e); }
  };

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getByRole = (roleKey) => filteredUsers.filter(u => u.role === roleKey);

  if (loading) return (
    <div className="flex justify-center py-40">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  const RoleGroup = ({ title, roleKey }) => {
    const members = getByRole(roleKey);
    if (members.length === 0 && !searchTerm) return null;

    return (
      <div className="mb-12 animate-fade-in">
        <div className="flex items-center gap-4 mb-6 px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{title}</h3>
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-[10px] font-bold text-emerald-500/40">{members.length} Total</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {members.map(u => (
            <div key={u.id} className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all duration-500">

              <div
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => onSelectUser && onSelectUser(u)}
              >
                <img
                  src={u.profileImage ? (u.profileImage.startsWith('http') ? u.profileImage : `${API_BASE}${u.profileImage}`) : DEFAULT_AVATAR}
                  className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-emerald-500/50 transition-all duration-500"
                  alt=""
                />
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{u.firstName} {u.lastName}</h4>
                  <div className="flex items-center gap-3 mt-1 opacity-40">
                    <span className="text-[10px] flex items-center gap-1 font-medium tracking-tight"><Mail size={10} /> {u.email}</span>
                    <span className="text-[10px] flex items-center gap-1 font-medium tracking-tight"><Fingerprint size={10} /> {u.studentId || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">

                {u.role === 'ROLE_SUPERADMIN' ? (
                  <button
                    onClick={() => handleAction(u.id, "/demote", "PUT", "Member demoted")}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500 hover:text-black text-emerald-400 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-white/10"
                  >
                    <UserMinus size={14} /> Demote to Student
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(u.id, "/role?role=ROLE_SUPERADMIN", "PUT", "Promoted to Super Admin")}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500 hover:text-black text-emerald-400 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-white/10"
                  >
                    <UserPlus size={14} /> Promote to Super Admin
                  </button>
                )}

                {u.role === 'ROLE_STUDENT' && (
                  <button
                    onClick={() => handleAction(u.id, "", "DELETE", "Account permanently removed")}
                    className="p-2.5 bg-white/5 text-red-400/50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-white/10"
                    title="Delete Account"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 font-inter">
      {/* HEADER */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
            System Management
          </h2>
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Global User Control</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-white/20 outline-none focus:border-emerald-500/20 transition-all text-xs w-72 backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
        <StatCard label="Total" value={users.length} />
        <StatCard label="Super Admins" value={getByRole('ROLE_SUPERADMIN').length} />
        <StatCard label="Admins" value={getByRole('ROLE_ADMIN').length} />
        <StatCard label="Lecturers" value={getByRole('ROLE_LECTURER').length} />
        <StatCard label="Students" value={getByRole('ROLE_STUDENT').length} />
      </div>

      <RoleGroup title="System Super Administrators" roleKey="ROLE_SUPERADMIN" />
      <RoleGroup title="Club Managers" roleKey="ROLE_ADMIN" />
      <RoleGroup title="University Lecturers" roleKey="ROLE_LECTURER" />
      <RoleGroup title="Registered Students" roleKey="ROLE_STUDENT" />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="glass-panel p-4 rounded-3xl border border-white/5 text-center flex flex-col justify-center shadow-xl">
    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">{label}</p>
    <p className="text-xl font-bold text-emerald-400 tracking-tighter">{value}</p>
  </div>
);

export default AllMembers;
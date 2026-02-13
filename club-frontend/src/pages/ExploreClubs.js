import React, { useState, useEffect } from 'react';

/**
 * * Member 02 : origin/feature/club-join-request-36738
 * * UI component for browsing and searching available clubs by category.
 */
import { Search, Users, ArrowRight, Tag, Building2, Grid3x3, Sparkles, Filter } from 'lucide-react';

const API_BASE = 'http://localhost:8080';
const DEFAULT_CLUB_LOGO = "https://cdn-icons-png.flaticon.com/512/4264/4264818.png";

const CLUB_CATEGORIES = [
  "Sports Clubs", "Activity Based Clubs", "Religious Clubs",
  "International Clubs", "Academic Clubs", "Career Guidance Unit", "NCARE"
];

const ExploreClubs = ({ onViewClub }) => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    /**
     * * Member 02 : Fetches the list of all clubs from the backend.
     */
    const fetchClubs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('clubUser'))?.token;
        const res = await fetch(`${API_BASE}/api/clubs`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setClubs(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchClubs();
  }, []);

  /**
   * * Member 02 : smooth scrolls to the selected category section.
   */
  const scrollToCategory = (category) => {
    setActiveCategory(category);
    const element = document.getElementById(`section-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeClubs = clubs.filter(c => c.status === 'ACTIVE');

  if (loading) return (
    <div className="flex justify-center py-40">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-6 animate-fade-in">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-entry {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .icon-hover-bounce:hover {
            animation: bounce-small 0.5s ease-in-out infinite;
        }
        @keyframes bounce-small {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
      `}</style>

      <div className="mb-14 pt-8 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner group transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/20">
                <Building2 className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" size={26} />
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-[0.2em]">Directory</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-gradient-x bg-[length:200%_auto]">Campus Life</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed font-light">
              Explore a curated collection of <span className="text-white font-semibold">{activeClubs.length} active communities</span>. Connect with leaders, join events, and find your passion.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="group p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300 min-w-[160px]">
              <div className="flex items-center gap-3 mb-2">
                <Users size={18} className="text-emerald-400 group-hover:rotate-12 transition-transform duration-500" />
                <span className="text-xs font-bold text-white/30 uppercase tracking-wider">Memberships</span>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums group-hover:text-emerald-300 transition-colors">{activeClubs.length}</p>
            </div>
            <div className="group p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:border-teal-500/20 transition-all duration-300 min-w-[160px]">
              <div className="flex items-center gap-3 mb-2">
                <Grid3x3 size={18} className="text-teal-400 group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-xs font-bold text-white/30 uppercase tracking-wider">Categories</span>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums group-hover:text-teal-300 transition-colors">{CLUB_CATEGORIES.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 relative max-w-2xl">
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full"></div>
          <div className="relative group max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center shadow-2xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10 ring-1 ring-white/5 focus-within:ring-emerald-500/50">
            <div className="pl-4 text-white/30 group-focus-within:text-emerald-400 transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search for clubs, sports, or societies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder-white/20 text-sm font-medium"
            />
            <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 active:scale-95">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 px-1">
          <Filter className="text-white/40" size={16} />
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Filter Directories</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mask-fade-right">
          {CLUB_CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={`group relative whitespace-nowrap px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all duration-300 backdrop-blur-sm ${activeCategory === cat
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white'
                }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {activeCategory === cat && <Sparkles size={12} className="animate-spin-slow" />}
                {cat}
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          ))}
        </div>
      </div>

      {CLUB_CATEGORIES.map((category, catIdx) => {
        const filtered = clubs.filter(c =>
          c.category === category &&
          c.status === 'ACTIVE' &&
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) return null;

        return (
          <div
            key={category}
            id={`section-${category}`}
            className="mb-20 scroll-mt-24"
          >
            <div className="flex items-center justify-between mb-8 group cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-500">
                  <Tag className="text-white/40 group-hover:text-emerald-400 transition-colors" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-300">{category}</h3>
                  <div className="h-0.5 w-0 group-hover:w-full bg-emerald-500/50 transition-all duration-500 ease-out"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-white/20 bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm">{filtered.length} entries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((club, idx) => (
                <div
                  key={club.id}
                  onClick={() => onViewClub(club)}
                  className="animate-card-entry group relative h-full bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.2)] hover:-translate-y-1"
                  style={{ animationDelay: `${(catIdx * 100) + (idx * 50)}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="p-6 flex flex-col items-start h-full relative z-10">
                    <div className="w-full flex justify-between items-start mb-6">
                      <div className="relative w-16 h-16 rounded-xl bg-white/10 p-1.5 border border-white/10 overflow-hidden group-hover:scale-105 transition-transform duration-500 ease-out shadow-lg">
                        <img
                          src={club.logoUrl ? `${API_BASE}${club.logoUrl}` : DEFAULT_CLUB_LOGO}
                          className="w-full h-full rounded-lg object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                          alt={club.name}
                          onError={(e) => e.target.src = DEFAULT_CLUB_LOGO}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-950/40 backdrop-blur-md border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <h4 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                        {club.name}
                      </h4>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                        {club.description || "Join this amazing student community to connect, grow, and experience campus life."}
                      </p>
                    </div>

                    <div className="w-full pt-4 mt-auto border-t border-white/10 flex items-center justify-between group-hover:border-emerald-500/20 transition-colors duration-500">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider group-hover:text-white/70 transition-colors">
                        Click to explore
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {searchTerm && activeClubs.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 backdrop-blur-md">
            <Search className="text-white/20" size={40} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No clubs found</h3>
          <p className="text-white/40 max-w-xs mx-auto mb-8">
            We couldn't find any clubs matching "{searchTerm}". Try checking for typos or browse the directories.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all backdrop-blur-sm"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreClubs;

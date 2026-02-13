import React from 'react';

/**
 * * Member 03 : origin/feature/event-coordinator-fullstack-36681
 * * UI component for displaying detailed information about a specific event.
 */
import {
  Calendar, Clock, MapPin, Target, Ticket,
  ArrowLeft, AlignLeft, Maximize2
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

/**
 * * Member 03 : Renders event details including image, description, and ticket info.
 */
const EventDetails = ({ event, onBack, onImageClick }) => {
  if (!event) return null;

  const fullImageUrl = event.imageUrl
    ? `${API_BASE}${event.imageUrl}`
    : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6 font-bold uppercase text-[10px] tracking-widest group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </button>

      <div
        onClick={() => {
          if (typeof onImageClick === 'function') {
            onImageClick(fullImageUrl);
          }
        }}
        className="group relative h-[300px] md:h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl mb-10 cursor-pointer"
      >
        <img
          src={fullImageUrl}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          alt={event.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 transform scale-90 group-hover:scale-100 transition-transform duration-500">
            <Maximize2 className="text-white" size={32} />
          </div>
        </div>

        <div className="absolute bottom-10 left-10 right-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg">
              {event.club?.name || "Official Event"}
            </span>
            <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              Click photo to expand
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">

        <div className="lg:col-span-2 space-y-6">

          {/* Description  */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
              <AlignLeft size={16} /> Event Description
            </h3>
            <p className="text-white/70 leading-relaxed font-inter text-base">
              {event.description || "Join us for this exciting university event. More details will be shared soon."}
            </p>
          </div>

          {/* Target Audience  */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
              <Target size={16} /> Target Audience
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-5 py-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-100 text-sm font-semibold">
                {event.targetAudience || "All Students"}
              </span>
            </div>
          </div>
        </div>

        {/*  :  INFO  */}
        <div className="space-y-4">
          <InfoItem
            icon={Calendar}
            label="Scheduled Date"
            value={new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          />
          <InfoItem
            icon={Clock}
            label="Start Time"
            value={event.time || "To be set"}
          />
          <InfoItem
            icon={MapPin}
            label="Venue Location"
            value={event.location || "Main Campus"}
          />

          {/* Ticket Price  */}
          <div className="glass-panel p-6 rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="text-emerald-400" size={18} />
              <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em]">Entry Ticket</p>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter">
              {event.price > 0 ? `LKR ${event.price.toLocaleString()}` : "FREE ENTRY"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="glass-panel p-5 rounded-[2rem] border border-white/5 flex items-center gap-5 hover:bg-white/5 transition-colors group">
    <div className="p-3.5 rounded-2xl bg-white/5 text-emerald-400 group-hover:scale-110 transition-transform">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default EventDetails;
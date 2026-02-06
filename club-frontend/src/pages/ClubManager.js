import React, { useState, useEffect } from 'react';
import { useUI } from '../context/UIContext';
import { PlusCircle, Calendar, MessageSquare, MapPin, Clock, AlertTriangle } from 'lucide-react';

const ClubManager = () => {
  const { showToast } = useUI();
  const [myClub, setMyClub] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Store specific error messages

  // Forms
  const [postContent, setPostContent] = useState('');
  const [eventForm, setEventForm] = useState({ title: '', location: '', date: '', time: '' });

  useEffect(() => {
    const fetchMyClub = async () => {
      try {
        const storedData = localStorage.getItem('clubUser');
        const token = JSON.parse(storedData)?.token;

        const res = await fetch("http://localhost:8080/api/clubs/my-club", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setMyClub(data);
        } else {
          const msg = await res.text();
          setError(msg);
        }
      } catch (err) {
        console.error("Error fetching club", err);
        setError("Network error. Is backend running?");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyClub();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem('clubUser');
    const token = JSON.parse(storedData)?.token;

    const res = await fetch("http://localhost:8080/api/clubs/my-club/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ content: postContent, likes: 0 })
    });

    if (res.ok) {
      showToast("Post Created!", "success");
      setPostContent('');
    } else {
      showToast("Failed to create post", "error");
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem('clubUser');
    const token = JSON.parse(storedData)?.token;

    const res = await fetch("http://localhost:8080/api/clubs/my-club/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(eventForm)
    });

    if (res.ok) {
      showToast("Event Created!", "success");
      setEventForm({ title: '', location: '', date: '', time: '' });
    } else {
      showToast("Failed to create event", "error");
    }
  };

  if (isLoading) return <div className="text-white p-8">Loading Club Data...</div>;

  if (error || !myClub) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 glass-panel rounded-3xl border border-red-500/30">
      <AlertTriangle size={48} className="text-red-400 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Club Not Found</h3>
      <p className="text-white/60 mb-6">{error || "You are an Admin, but no club is linked to your account."}</p>
      <p className="text-xs text-white/40 bg-black/20 p-2 rounded">
        Tip: Go to "Start a Club" and create one first!
      </p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      {/* HEADER */}
      <div className="glass-panel rounded-3xl p-8 mb-8 border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <img src={myClub.logoUrl || "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"} alt="Logo" className="w-32 h-32" />
        </div>
        <h1 className="text-3xl font-bold text-white">{myClub.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs bg-emerald-500 text-black px-2 py-1 rounded font-bold">ADMIN PANEL</span>
          <span className="text-xs border border-white/20 text-white/60 px-2 py-1 rounded uppercase">{myClub.category}</span>
        </div>
        <p className="text-emerald-100/60 mt-4 max-w-2xl">{myClub.description}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${activeTab === 'posts' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/50'}`}>
          <MessageSquare size={18} /> Create Post
        </button>
        <button onClick={() => setActiveTab('events')} className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${activeTab === 'events' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/50'}`}>
          <Calendar size={18} /> Create Event
        </button>
      </div>

      {activeTab === 'posts' && (
        <div className="glass-panel rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">New Announcement</h3>
          <form onSubmit={handlePostSubmit}>
            <textarea
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none mb-4 min-h-[150px]"
              rows="4"
              placeholder="What's happening in your club?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">Post Update</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="glass-panel rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">Schedule Event</h3>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <input type="text" placeholder="Event Title" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />

            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
              <input type="time" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-white/50" size={20} />
              <input type="text" placeholder="Location" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">Create Event</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClubManager;
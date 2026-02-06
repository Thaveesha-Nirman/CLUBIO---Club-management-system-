import React, { useState } from 'react';
import { useAlert } from '../context/AlertContext';
import { ArrowLeft, Image as ImageIcon, X, Calendar, MapPin, DollarSign, Clock, Users, Save } from 'lucide-react';

const CreateEvent = ({ club, onBack, onEventCreated }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    ticketPrice: '',
    targetAudience: 'All Students'
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("time", formData.time);
      data.append("location", formData.location);
      data.append("ticketPrice", formData.ticketPrice);
      data.append("targetAudience", formData.targetAudience);

      if (image) {
        data.append("file", image);
      }

      const res = await fetch(`http://localhost:8080/api/events/create/${club.id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
      });

      if (!res.ok) throw new Error("Failed to create event");

      const newEvent = await res.json();

      showAlert("Event Published Successfully!", "success");
      onEventCreated(newEvent);
      onBack(); 

    } catch (error) {
      showAlert("Error creating event: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">

      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="text-2xl font-bold text-white">Publish New Event</h2>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-3">
            <label className="text-xs font-bold text-white/60 uppercase ml-1">Event Banner / Flyer</label>

            {previewUrl ? (
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 group">
                <img src={previewUrl} alt="Banner" className="w-full h-full object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="h-40 w-full border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/5 transition">
                <ImageIcon size={32} className="text-white/30 mb-2" />
                <span className="text-sm font-bold text-emerald-400">Click to Upload Banner</span>
                <span className="text-xs text-white/30 mt-1">Recommended size: 1200x600</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Event Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Annual Tech Meetup 2026" className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Target Audience</label>
              <div className="relative">
                <select name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none appearance-none">
                  <option className="bg-gray-900">All Students</option>
                  <option className="bg-gray-900">Club Members Only</option>
                  <option className="bg-gray-900">Faculty & Staff</option>
                </select>
                <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Date</label>
              <div className="relative">
                <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full p-3 pl-10 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none calendar-picker" />
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Time</label>
              <div className="relative">
                <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full p-3 pl-10 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Venue / Location</label>
              <div className="relative">
                <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Main Auditorium" className="w-full p-3 pl-10 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Ticket Price (LKR)</label>
              <div className="relative">
                <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} placeholder="0 (Free)" className="w-full p-3 pl-10 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">
                  Rs
                </span>
              </div>
              <p className="text-[10px] text-white/30 ml-1">Leave empty or 0 if free.</p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase ml-1">Event Description</label>
              <textarea name="description" required rows="1" value={formData.description} onChange={handleChange} placeholder="Details about the agenda, speakers, etc." className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none resize-none min-h-[50px]"></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition disabled:opacity-50">
              {isSubmitting ? 'Publishing...' : <><Save size={18} /> Publish Event</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
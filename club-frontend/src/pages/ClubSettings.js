import React, { useState, useEffect } from 'react';

/**
 * * Member 09 : Settings & System
 * * Component for managing club settings and profile customization.
 */
import { useAlert } from '../context/AlertContext';
import { Save, X, Upload, Image as ImageIcon, Link as LinkIcon, MessageCircle, FileText } from 'lucide-react';

const ClubSettings = ({ club, onBack, onUpdateClub }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    contactNumber: '',
    whatsappGroupLink: '',
    googleFormLink: ''
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name || '',
        category: club.category || '',
        description: club.description || '',
        contactNumber: club.contactNumber || '',
        whatsappGroupLink: club.whatsappGroupLink || '', // <--- LOAD NEW DATA
        googleFormLink: club.googleFormLink || ''       // <--- LOAD NEW DATA
      });
      if (club.logoUrl) setLogoPreview(`http://localhost:8080${club.logoUrl}`);
      if (club.coverUrl) setCoverPreview(`http://localhost:8080${club.coverUrl}`);
    }
  }, [club]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("contactNumber", formData.contactNumber);
      data.append("whatsappGroupLink", formData.whatsappGroupLink);
      data.append("googleFormLink", formData.googleFormLink);

      if (logoFile) data.append("logo", logoFile);
      if (coverFile) data.append("cover", coverFile);

      const res = await fetch(`http://localhost:8080/api/clubs/${club.id}/update`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        const updatedClub = await res.json();
        showAlert("Club settings updated successfully!", "success");
        onUpdateClub(updatedClub);
        onBack();
      } else {
        const errorText = await res.text();
        showAlert("Failed to update: " + errorText, "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error saving settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="dashboard-glass p-8 rounded-3xl border border-white/10 shadow-2xl">

        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Club Settings</h2>
            <p className="text-white/50 text-sm mt-1">Manage your club profile and membership links</p>
          </div>
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} className="text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4">
              <label className="text-sm font-bold text-white/70 uppercase tracking-wider">Club Logo</label>
              <div className="relative group cursor-pointer w-32 h-32">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-white/20 bg-black/20 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                  {logoPreview ? (
                    <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <Upload className="text-white/30" />
                  )}
                </div>
                <input type="file" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-xs text-white font-bold">Change</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-4">
              <label className="text-sm font-bold text-white/70 uppercase tracking-wider">Cover Photo</label>
              <div className="relative group cursor-pointer h-32 w-full">
                <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-black/20 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                  {coverPreview ? (
                    <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                  ) : (
                    <div className="flex flex-col items-center text-white/30">
                      <ImageIcon size={24} />
                      <span className="text-xs mt-2">Upload Cover Image</span>
                    </div>
                  )}
                </div>
                <input type="file" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Club Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all placeholder-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-[#1e1e1e]">Sports Clubs</option>
                  <option className="bg-[#1e1e1e]">Activity Based Clubs</option>
                  <option className="bg-[#1e1e1e]">Religious Clubs</option>
                  <option className="bg-[#1e1e1e]">International Clubs</option>
                  <option className="bg-[#1e1e1e]">Academic Clubs</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all resize-none placeholder-white/20"
              />
            </div>
          </div>

          {/* MEMBERSHIP  */}
          <div className="border-t border-white/10 pt-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <LinkIcon size={18} className="text-blue-400" /> Membership & Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Form */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-300 flex items-center gap-2">
                  <FileText size={14} /> Google Form Link (For Registration)
                </label>
                <input
                  type="url"
                  placeholder="https://forms.google.com/..."
                  value={formData.googleFormLink}
                  onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
                  className="w-full p-3 rounded-xl bg-blue-500/5 border border-blue-500/30 text-white focus:border-blue-400 outline-none transition-all placeholder-white/20 text-sm font-mono"
                />
                <p className="text-[10px] text-white/40">Users must fill this form before requesting to join.</p>
              </div>

              {/* WhatsApp Group Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <MessageCircle size={14} /> WhatsApp Group Link
                </label>
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={formData.whatsappGroupLink}
                  onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
                  className="w-full p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/30 text-white focus:border-emerald-400 outline-none transition-all placeholder-white/20 text-sm font-mono"
                />
                <p className="text-[10px] text-white/40">Visible only to APPROVED members.</p>
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Contact Number</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all placeholder-white/20"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClubSettings;
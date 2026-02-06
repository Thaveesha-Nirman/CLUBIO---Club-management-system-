import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Camera, Save, User, Phone, Linkedin, Github, FileText, Mail, Hash } from 'lucide-react';

const ProfileSettings = ({ user }) => {
  const { updateUser } = useAuth();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    bio: '',
    linkedinUrl: '',
    githubUrl: '',
    whatsappLink: '',
    profileImage: "https://i.pravatar.cc/150?img=12"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobileNumber: user.mobileNumber || '',
        bio: user.bio || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
        whatsappLink: user.whatsappLink || '',
        profileImage: user.profileImage || "https://i.pravatar.cc/150?img=12"
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profileImage: previewUrl });
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobileNumber && formData.mobileNumber.length !== 10) {
      showAlert("Please enter a valid 10-digit mobile number.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = storedData ? JSON.parse(storedData)?.token : null;

      if (!token) throw new Error("Authentication failed");

      let finalImageUrl = formData.profileImage;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        const uploadRes = await fetch("http://localhost:8080/api/uploads/image", {
          method: "POST",
          body: uploadData,
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        finalImageUrl = await uploadRes.text();
      }

      const profileData = { ...formData, profileImage: finalImageUrl };

      const updateRes = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (!updateRes.ok) throw new Error("Profile update failed");
      if (updateUser) updateUser(profileData);

      showAlert("Profile Updated Successfully!", "success");

    } catch (error) {
      showAlert("Error: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white font-montserrat">Profile Settings</h2>
        <p className="text-emerald-100/60 text-sm font-inter">Update your personal information and public profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="glass-panel rounded-3xl p-8 flex flex-col items-center text-center h-fit border border-white/5">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 border-2 border-emerald-500/50 relative overflow-hidden bg-black/20">
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Camera className="text-white w-8 h-8" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="absolute bottom-0 right-2 bg-emerald-500 p-2 rounded-full border-4 border-black/50 shadow-lg">
              <Camera size={14} className="text-white" />
            </div>
          </div>

          <h3 className="mt-4 text-xl font-bold text-white font-montserrat">{formData.firstName} {formData.lastName}</h3>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1 font-montserrat">
            {user?.role?.replace('ROLE_', '') || 'User'}
          </p>

          <div className="mt-6 w-full space-y-3 font-inter text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-emerald-100/80">
              <Mail size={16} className="text-emerald-500" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-emerald-100/80">
              <Hash size={16} className="text-emerald-500" />
              <span className="truncate tracking-wider">ID: {user?.studentId || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Identity */}
            <div>
              <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2 font-montserrat">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} icon={User} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} icon={User} />
                <InputField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} icon={Phone} placeholder="0771234567" />
                <InputField label="WhatsApp Profile Link" name="whatsappLink" value={formData.whatsappLink} onChange={handleChange} icon={Phone} placeholder="https://wa.me/..." />
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2 mt-2 font-montserrat">About Me</h4>
              <div className="relative group">
                <FileText className="absolute top-4 left-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:bg-black/40 focus:border-emerald-500/50 outline-none transition-all resize-none text-sm font-inter"
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2 mt-2 font-montserrat">Social Links</h4>
              <div className="grid grid-cols-1 gap-4">
                <InputField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} icon={Linkedin} placeholder="https://linkedin.com/..." />
                <InputField label="GitHub URL" name="githubUrl" value={formData.githubUrl} onChange={handleChange} icon={Github} placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 font-montserrat"
              >
                {isLoading ? 'Saving...' : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, icon: Icon, type = "text", placeholder }) => (
  <div className="space-y-1.5 font-inter">
    <label className="text-xs font-medium text-emerald-100/60 ml-1">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={18} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:bg-black/40 focus:border-emerald-500/50 outline-none transition-all text-sm"
      />
    </div>
  </div>
);

export default ProfileSettings;
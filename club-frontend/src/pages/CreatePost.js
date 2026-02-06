import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import { ArrowLeft, Image as ImageIcon, X, Send, Loader, Plus, Save } from 'lucide-react';

const CreatePost = ({ club, user, onBack, onPostCreated, postToEdit }) => {
  const { showAlert } = useAlert();
  const [content, setContent] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);           
  const [newPreviews, setNewPreviews] = useState([]);     
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setContent(postToEdit.content || "");
      if (postToEdit.imageUrls) {
        setExistingImages(postToEdit.imageUrls.map(url =>
          url.startsWith('http') ? url : `http://localhost:8080${url}`
        ));
      }
    }
  }, [postToEdit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCount = existingImages.length + newFiles.length + files.length;

    if (totalCount > 5) {
      showAlert("Maximum 5 photos allowed per post.", "warning");
      return;
    }

    setNewFiles([...newFiles, ...files]);
    const blobs = files.map(file => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...blobs]);
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, i) => i !== indexToRemove));
  };

  const removeNewImage = (indexToRemove) => {
    setNewFiles(newFiles.filter((_, i) => i !== indexToRemove));
    setNewPreviews(newPreviews.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && existingImages.length === 0 && newFiles.length === 0) {
      showAlert("Post cannot be empty!", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const formData = new FormData();
      formData.append("content", content);

      newFiles.forEach((file) => formData.append("files", file));

      if (postToEdit) {
        existingImages.forEach(url => {
          const relativePath = url.replace("http://localhost:8080", "");
          formData.append("remainingImages", relativePath);
        });

        const res = await fetch(`http://localhost:8080/api/posts/${postToEdit.id}`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });

        if (!res.ok) throw new Error("Update failed");

        const updatedPost = await res.json();
        showAlert("Post Updated!", "success");
        if (onPostCreated) onPostCreated(updatedPost);
        onBack();
      }

      else {
        const res = await fetch(`http://localhost:8080/api/posts/create/${club.id}`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });

        if (!res.ok) throw new Error("Creation failed");

        const newPost = await res.json();
        showAlert("Post Published!", "success");
        if (onPostCreated) onPostCreated(newPost);
        onBack();
      }

    } catch (error) {
      console.error(error);
      showAlert("Error: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">

      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="text-xl font-bold text-white">
          {postToEdit ? "Edit Post" : "Create New Post"}
        </h2>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10">

        <div className="flex items-center gap-3 mb-6">
          <img src={club.logoUrl ? `http://localhost:8080${club.logoUrl}` : "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"} className="w-10 h-10 rounded-full bg-white/10 p-1 object-cover" alt="logo" />
          <div>
            <h4 className="font-bold text-white text-sm">Posting as {club.name}</h4>
            <p className="text-emerald-400 text-xs">
              {postToEdit ? "Editing Mode" : "Add some images"} • {existingImages.length + newFiles.length}/5
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <textarea
            placeholder={`What's on your mind?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-white text-lg placeholder-white/30 outline-none resize-none min-h-[150px]"
          ></textarea>

          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="grid grid-cols-2 gap-3 mt-4 mb-6 animate-fade-in">

              {existingImages.map((url, idx) => (
                <div key={`old-${idx}`} className="relative group aspect-video rounded-2xl overflow-hidden border border-emerald-500/30">
                  <img src={url} alt="Old Preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-white text-xs font-bold">Existing</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg z-10"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {newPreviews.map((url, idx) => (
                <div key={`new-${idx}`} className="relative group aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {(existingImages.length + newPreviews.length) < 5 && (
                <label className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all aspect-video">
                  <Plus className="text-white/20" size={24} />
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Add Photos</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">

            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition text-emerald-400 text-sm font-bold">
                <ImageIcon size={18} />
                {postToEdit ? "Add More Photos" : "Photos/Videos"}
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              {isSubmitting ? <Loader size={18} className="animate-spin" /> : (postToEdit ? <Save size={18} /> : <Send size={18} />)}
              {postToEdit ? "Save Changes" : "Post"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePost;
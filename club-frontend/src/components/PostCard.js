import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import {
  Heart, MessageCircle, MoreHorizontal, Send, Trash2, Edit2,
  ChevronLeft, ChevronRight, Maximize2, Check, X, Share2
} from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 52) return `${weeks}w ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

const formatFullDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
};

const ImageSlider = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images?.length]);

  if (!images || images.length === 0) return null;

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-80 bg-black/20 rounded-2xl overflow-hidden border border-white/5 mt-3 group">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((imgUrl, index) => (
          <div key={index} className="min-w-full h-full flex items-center justify-center relative bg-black/40 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl opacity-60 scale-150"
              style={{ backgroundImage: `url(http://localhost:8080${imgUrl})` }}
            ></div>
            <img
              src={`http://localhost:8080${imgUrl}`}
              className="relative w-full h-full object-contain cursor-pointer transition-transform hover:scale-[1.02] duration-500 z-10 drop-shadow-2xl"
              alt={`Slide ${index}`}
              onClick={() => onImageClick && onImageClick(`http://localhost:8080${imgUrl}`)}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md z-20"><ChevronLeft size={20} /></button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md z-20"><ChevronRight size={20} /></button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === currentIndex ? 'w-6 bg-[#00d26a]' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PostCard = ({ post, user, onDelete, onEdit, onImageClick, onClubClick, onUserClick }) => {
  const { showAlert, showConfirm } = useAlert();
  const [localPost, setLocalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [isHoveringDate, setIsHoveringDate] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [animateShare, setAnimateShare] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [activeCommentMenu, setActiveCommentMenu] = useState(null);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  useEffect(() => {
    const handleClickOutside = () => setActiveCommentMenu(null);
    if (activeCommentMenu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeCommentMenu]);

  const isLiked = localPost.likedByUsers?.some(liker =>
    liker === user?.username || liker === user?.email || liker === user?.id
  );

  const getProfileSrc = (userObj) => {
    if (!userObj) return null;
    const imgPath = userObj.profileImageUrl || userObj.profileImage || userObj.avatarUrl || userObj.imageUrl;
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    const cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    return `http://localhost:8080${cleanPath}`;
  };

  const handleLike = async () => {
    if (isLiking || !user) return;
    setIsLiking(true);
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    const myId = user.username || user.email || "me";
    const originalPost = { ...localPost };
    let updatedLikes = localPost.likedByUsers ? [...localPost.likedByUsers] : [];

    if (isLiked) {
      updatedLikes = updatedLikes.filter(id => id !== user.username && id !== user.email);
    } else {
      updatedLikes.push(myId);
    }

    setLocalPost({ ...localPost, likedByUsers: updatedLikes });

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const res = await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) setLocalPost(originalPost);
    } catch (err) {
      setLocalPost(originalPost);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing || !user) return;

    const confirmShare = await showConfirm("Share this post to your profile activity?", { confirmText: "Share", cancelText: "Cancel" });
    if (!confirmShare) return;

    setIsSharing(true);
    setAnimateShare(true);
    setTimeout(() => setAnimateShare(false), 600);

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const res = await fetch(`http://localhost:8080/api/clubs/posts/${post.id}/share`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        showAlert("Post shared to your profile successfully!", "success");
      } else {
        const errorMsg = await res.text();
        showAlert(errorMsg || "Failed to share post.", "error");
      }
    } catch (err) {
      showAlert("Network error. Please try again.", "error");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const res = await fetch(`http://localhost:8080/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: commentText })
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setLocalPost(updatedPost);
        setCommentText("");
      }
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = await showConfirm("Delete this comment?", { isDanger: true, confirmText: "Delete", cancelText: "Cancel" });
    if (!confirmed) return;

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const res = await fetch(`http://localhost:8080/api/posts/${post.id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const updatedComments = localPost.comments.filter(c => c.id !== commentId);
        setLocalPost({ ...localPost, comments: updatedComments });
      }
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const storedData = localStorage.getItem('clubUser');
      const token = JSON.parse(storedData)?.token;

      const res = await fetch(`http://localhost:8080/api/posts/${post.id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: editText })
      });

      if (res.ok) {
        const updatedComments = localPost.comments.map(c =>
          c.id === commentId ? { ...c, text: editText } : c
        );
        setLocalPost({ ...localPost, comments: updatedComments });
        setEditingCommentId(null);
      } else {
        showAlert("Failed to update comment", "error");
      }
    } catch (err) {
      console.error("Error updating comment", err);
    }
  };

  return (
    <div className="glass-panel backdrop-blur-md bg-white/5 rounded-[20px] border border-white/10 p-6 mb-6 shadow-xl transition-all hover:border-white/20">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div
          className="flex gap-3 cursor-pointer group/header"
          onClick={() => onClubClick && onClubClick(localPost.club)}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5">
            <img
              src={localPost.club?.logoUrl ? `http://localhost:8080${localPost.club.logoUrl}` : "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"}
              className="w-full h-full object-cover"
              alt="logo"
              onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/4264/4264818.png"}
            />
          </div>
          <div className="flex flex-col justify-center h-10">
            <h3 className="text-white font-bold text-sm tracking-wide leading-none mb-1">{localPost.club?.name || "Club Name"}</h3>

            <div
              className="h-5 relative overflow-hidden cursor-pointer w-32"
              onMouseEnter={() => setIsHoveringDate(true)}
              onMouseLeave={() => setIsHoveringDate(false)}
            >
              <span className={`absolute top-0 left-0 text-[10px] font-medium transition-all duration-300 ${isHoveringDate ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} text-emerald-400 flex items-center h-full`}>
                {formatTimeAgo(localPost.createdAt)}
              </span>
              <span className={`absolute top-0 left-0 text-[10px] font-medium text-white/50 transition-all duration-300 ${isHoveringDate ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} flex items-center h-full`}>
                {formatFullDate(localPost.createdAt)}
              </span>
            </div>

          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-white/30 hover:text-white transition rounded-full hover:bg-white/5"
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-40 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">

                {onEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(); }}
                    className="w-full text-left px-4 py-3 text-xs text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                  >
                    <Edit2 size={14} className="text-blue-400" /> Edit Post
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(post.id); }}
                    className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors border-t border-white/5"
                  >
                    <Trash2 size={14} /> Delete Post
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      <div className="mb-4">
        <p className="text-white/80 text-sm font-light leading-relaxed whitespace-pre-wrap">
          {localPost.content}
        </p>
      </div>

      {localPost.imageUrls && localPost.imageUrls.length > 0 && (
        <ImageSlider images={localPost.imageUrls} onImageClick={onImageClick} />
      )}

      <div className="mt-4 flex items-center gap-6 border-t border-white/5 pt-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 group transition-all active:scale-95"
        >
          <div className={`transition-transform duration-300 ${animateLike ? 'scale-[1.3]' : 'scale-100'}`}>
            <Heart
              size={20}
              className={`transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/40 group-hover:text-red-500'}`}
            />
          </div>
          <span className={`text-xs font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-white/40 group-hover:text-white'}`}>
            {localPost.likedByUsers?.length || 0} Likes
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 group transition-all text-white/40 hover:text-white"
        >
          <MessageCircle size={20} className="transition-colors group-hover:text-blue-400" />
          <span className="text-xs font-medium group-hover:text-white">
            {localPost.comments?.length || 0} Comments
          </span>
        </button>

        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 group transition-all active:scale-95 text-white/40 hover:text-emerald-400"
        >
          <div className={`transition-all duration-500 ${animateShare ? 'rotate-[360deg] scale-125 text-emerald-400' : 'rotate-0'}`}>
            <Share2 size={20} />
          </div>
          <span className="text-xs font-medium group-hover:text-white">
            {isSharing ? 'Sharing...' : 'Share'}
          </span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {localPost.comments?.length > 0 ? localPost.comments.map((comment, idx) => {
              const profileSrc = getProfileSrc(comment.user);
              const isMyComment = comment.user?.username === user?.username || comment.user?.email === user?.email;
              const isEditing = editingCommentId === comment.id;

              return (
                <div key={idx} className="flex gap-3 group/comment relative border-b border-white/5 pb-4 last:border-none">
                  <div
                    className="w-8 h-8 rounded-full bg-[#00d26a]/10 flex items-center justify-center text-[#00d26a] text-[10px] font-bold border border-white/5 flex-shrink-0 overflow-hidden mt-0.5 cursor-pointer"
                    onClick={() => onUserClick && onUserClick(comment.user)}
                  >
                    {profileSrc ? (
                      <img src={profileSrc} alt="user" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = comment.user?.firstName?.charAt(0); }} />
                    ) : (comment.user?.firstName?.charAt(0))}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className="text-white text-xs font-bold hover:text-emerald-400 cursor-pointer"
                        onClick={() => onUserClick && onUserClick(comment.user)}
                      >
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>

                      <div className="group/date relative cursor-help w-24 h-5 overflow-hidden">
                        <span className="absolute top-0 left-0 text-[10px] text-white/30 transition-all duration-300 group-hover/date:-translate-y-full group-hover/date:opacity-0 flex items-center h-full">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                        <span className="absolute top-0 left-0 text-[10px] text-emerald-400 transition-all duration-300 translate-y-full opacity-0 group-hover/date:translate-y-0 group-hover/date:opacity-100 flex items-center h-full">
                          {formatFullDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="mt-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-white/5 text-xs text-white p-2 rounded-lg outline-none border border-white/10 focus:border-emerald-500 mb-2"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateComment(comment.id)} className="text-[10px] bg-emerald-600 px-2 py-1 rounded text-white hover:bg-emerald-500 flex items-center gap-1"><Check size={10} /> Save</button>
                          <button onClick={cancelEditing} className="text-[10px] bg-white/10 px-2 py-1 rounded text-white hover:bg-white/20 flex items-center gap-1"><X size={10} /> Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-white/80 text-xs font-light leading-relaxed">{comment.text}</p>
                        {isMyComment && (
                          <div className="flex items-center gap-4 mt-2">
                            <button onClick={() => startEditing(comment)} className="text-[10px] text-white/40 hover:text-blue-400 transition-colors flex items-center gap-1 font-medium">
                              <Edit2 size={10} /> Edit
                            </button>
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-[10px] text-white/40 hover:text-red-400 transition-colors flex items-center gap-1 font-medium">
                              <Trash2 size={10} /> Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            }) : (
              <p className="text-white/30 text-xs text-center py-4 italic">No comments yet. Start the conversation!</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="relative mt-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-black/20 rounded-full py-2.5 pl-4 pr-10 text-xs text-white outline-none border border-white/10 focus:border-white/30 transition-all placeholder-white/20"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#00d26a] rounded-full text-white hover:bg-[#00b05b] transition shadow-lg">
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
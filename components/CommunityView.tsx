
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, X, MoreVertical, Sparkles, Heart, ChevronDown, 
  Rocket, ArrowBigUp, ArrowBigDown, Tag, Link2Icon, Image as ImageIcon,
  Edit, Trash2, Package, Info
} from 'lucide-react';
import { CommunityPost, User } from '../types';
import { AVATAR_BG, CATEGORIES } from '../constants';

interface CommunityViewProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'timestamp'> & { id?: string }) => void;
  onDeletePost: (postId: string) => void;
  onVote: (postId: string, direction: 1 | -1) => void;
  onBack: () => void;
  user: User;
}

type SortOption = 'best' | 'most' | 'least';

const CommunityView: React.FC<CommunityViewProps> = ({ posts, onAddPost, onDeletePost, onVote, onBack, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(posts);
  const [sortOption, setSortOption] = useState<SortOption>('best');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const sortRef = useRef<HTMLDivElement>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'IoT'
  });

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedPosts = useMemo(() => {
    const p = [...localPosts];
    if (sortOption === 'most') {
      return p.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortOption === 'least') {
      return p.sort((a, b) => (a.likes || 0) - (b.likes || 0));
    }
    return p;
  }, [localPosts, sortOption]);

  const handleVoteLocal = (postId: string, direction: 1 | -1) => {
    const currentVote = userVotes[postId] || 0;
    if (currentVote === direction) return;
    const firebaseDirection = currentVote === 0 ? direction : direction * 2;
    onVote(postId, firebaseDirection as 1 | -1);
    setUserVotes(prev => ({ ...prev, [postId]: direction }));
    setLocalPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + firebaseDirection } : p));
  };

  const handleEdit = (post: CommunityPost) => {
    setEditingPostId(post.id);
    setNewPost({
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl || '',
      category: post.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (postId: string) => {
    if (confirm("Delete this build? This action is permanent.")) {
      onDeletePost(postId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) return;
    
    onAddPost({
      ...newPost,
      id: editingPostId || undefined,
      author: user.username
    });
    
    setNewPost({ title: '', description: '', imageUrl: '', category: 'IoT' });
    setEditingPostId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen relative animate-in fade-in duration-700">
      <div className="bg-[#8d4b31] border-b border-black/10">
        <div className="container mx-auto px-6 pt-16 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
             <div className="max-w-3xl">
               <div className="inline-flex items-center space-x-3 mb-8 bg-black/20 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Showcase Your Creations</span>
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tighter uppercase italic leading-none">
                 COMMUNITY BOARD
               </h1>
               <p className="text-white text-xl font-black leading-relaxed italic max-w-2xl border-l-4 border-yellow-400 pl-6">
                 "Share your project breakthroughs with the academy."
               </p>
             </div>
             <div className="flex items-center space-x-6">
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[160px] shadow-2xl">
                   <p className="text-4xl font-black text-white">{localPosts.length}</p>
                   <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-2">Creations</p>
                </div>
                <div className="bg-yellow-400 p-8 rounded-[2.5rem] border-b-8 border-yellow-600 text-center min-w-[160px] shadow-2xl">
                   <p className="text-4xl font-black text-[#8d4b31]">{localPosts.reduce((acc, p) => acc + (p.likes || 0), 0)}</p>
                   <p className="text-[10px] font-black text-[#8d4b31]/70 uppercase tracking-widest mt-2">Likes</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="relative pb-48 min-h-[800px]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/brick-wall.png')`, backgroundColor: '#8d4b31' }}>
        <div className="container mx-auto px-6 py-20">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-12 space-y-12">
            {sortedPosts.map((post) => {
              const currentVote = userVotes[post.id] || 0;
              const avatarUrl = post.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author}&backgroundColor=${AVATAR_BG}`;
              const isOwner = post.author === user.username || user.role === 'admin';
              
              return (
                <div key={post.id} className="break-inside-avoid bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all hover:-translate-y-2 border-4 border-white group">
                  <div className="p-8 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <img src={avatarUrl} alt={post.author} className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 p-1" />
                      <div>
                        <h4 className="font-black text-black text-sm uppercase leading-none">{post.author}</h4>
                        <p className="text-[9px] text-slate-800 font-black uppercase mt-1 opacity-60">{post.timestamp}</p>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(post)} className="p-2 text-black hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-black hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex flex-col">
                    <h3 className="font-black text-black text-3xl mb-5 uppercase italic">{post.title}</h3>
                    {post.imageUrl && (
                      <div className="mb-8 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl"><img src={post.imageUrl} className="w-full h-auto object-cover" alt={post.title} /></div>
                    )}
                    <p className="text-black text-lg leading-relaxed font-black italic border-l-4 border-slate-200 pl-6">"{post.description}"</p>
                  </div>
                  <div className="mt-auto px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center space-x-1 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                        <button onClick={() => handleVoteLocal(post.id, 1)} className={`${currentVote === 1 ? 'text-[#ff4500]' : 'text-black'}`}><ArrowBigUp className="w-7 h-7" /></button>
                        <span className="text-sm font-black text-black min-w-[2rem] text-center">{post.likes}</span>
                        <button onClick={() => handleVoteLocal(post.id, -1)} className={`${currentVote === -1 ? 'text-[#7193ff]' : 'text-black'}`}><ArrowBigDown className="w-7 h-7" /></button>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="bg-white w-full max-w-2xl rounded-[5rem] overflow-hidden border-t-[20px] border-[#fbbf24] p-16">
            <h2 className="text-5xl font-black text-black uppercase mb-10 italic">{editingPostId ? 'EDIT' : 'UPLOAD'} BUILD</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
              <input type="text" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full text-3xl font-black text-black border-b-8 border-slate-100 outline-none pb-4" placeholder="Build Title" required />
              <textarea value={newPost.description} onChange={e => setNewPost({...newPost, description: e.target.value})} className="w-full text-black text-xl border-none outline-none min-h-[160px] bg-slate-50 p-8 rounded-[3rem] font-black" placeholder="Description" required />
              <input type="url" value={newPost.imageUrl} onChange={e => setNewPost({...newPost, imageUrl: e.target.value})} placeholder="Image URL" className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] px-8 py-5 text-xl font-bold text-black" />
              <button type="submit" className="w-full bg-yellow-400 text-black py-6 rounded-[2.5rem] font-black text-2xl uppercase shadow-2xl">SHARE BUILD</button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => { setEditingPostId(null); setNewPost({title: '', description: '', imageUrl: '', category: 'IoT'}); setIsModalOpen(true); }} className="fixed bottom-12 right-12 w-28 h-28 bg-[#fbbf24] text-black rounded-[3rem] flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-[10px] border-white z-50">
        <Plus className="w-14 h-14" />
      </button>
    </div>
  );
};

export default CommunityView;

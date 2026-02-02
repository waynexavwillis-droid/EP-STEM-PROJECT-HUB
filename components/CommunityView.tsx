
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, X, Sparkles, ChevronDown, 
  ArrowBigUp, ArrowBigDown, 
  Edit, Trash2, Search, AlertTriangle
} from 'lucide-react';
import { CommunityPost, User } from '../types';
import { AVATAR_BG } from '../constants';
import { checkContentModeration } from '../utils/moderation';

interface CommunityViewProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'timestamp'> & { id?: string }) => void;
  onDeletePost: (postId: string) => void;
  onVote: (postId: string, direction: 1 | -1) => void;
  onBack: () => void;
  user: User;
}

const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-4 px-6 py-3 border-2 border-white/10 rounded-xl bg-white/5 backdrop-blur-md text-[13px] font-black text-white hover:border-yellow-400 transition-all min-w-[180px] justify-between shadow-xl"
      >
        <span className="truncate uppercase">{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full min-w-[200px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[100] py-3 overflow-hidden">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all ${value === opt ? 'text-yellow-400' : 'text-white/60'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CommunityView: React.FC<CommunityViewProps> = ({ posts, onAddPost, onDeletePost, onVote, onBack, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(posts);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All projects');
  const [activeSort, setActiveSort] = useState('Best');
  
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
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

  const filteredAndSortedPosts = useMemo(() => {
    let p = [...localPosts].filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All projects' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (activeSort === 'Best') {
      p.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (activeSort === 'Newest') {
      p.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    return p;
  }, [localPosts, searchQuery, activeCategory, activeSort]);

  const handleVoteLocal = (postId: string, direction: 1 | -1) => {
    const currentVote = userVotes[postId] || 0;
    if (currentVote === direction) return;
    const firebaseDirection = currentVote === 0 ? direction : direction * 2;
    onVote(postId, firebaseDirection as 1 | -1);
    setUserVotes(prev => ({ ...prev, [postId]: direction }));
    setLocalPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + firebaseDirection } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) return;
    
    // Check moderation
    const isFlagged = checkContentModeration(newPost.title) || 
                      checkContentModeration(newPost.description) || 
                      checkContentModeration(newPost.imageUrl);

    onAddPost({ ...newPost, id: editingPostId || undefined, author: user.username, isFlagged });
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
          </div>
        </div>
      </div>

      <div className="relative pb-48 min-h-[800px]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/brick-wall.png')`, backgroundColor: '#8d4b31' }}>
        <div className="container mx-auto px-6 py-12">
          
          <div className="flex flex-col space-y-8 mb-20">
            <div className="relative max-w-2xl flex items-center bg-white rounded-full px-8 py-2 shadow-2xl border-4 border-[#6b3a26]">
               <Search className="text-slate-400 w-6 h-6 mr-4" />
               <input 
                type="text" 
                placeholder="Search community builds..." 
                className="w-full py-4 text-black text-2xl font-black outline-none bg-transparent" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
               />
               {searchQuery && <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400 hover:text-black"><X /></button>}
            </div>
            
            <div className="flex flex-wrap items-center gap-5 p-8 bg-black/30 backdrop-blur-3xl rounded-[3rem] border border-white/10">
              <FilterDropdown label="Sort" value={activeSort} options={['Best', 'Newest']} onChange={val => setActiveSort(val)} />
              <FilterDropdown label="Category" value={activeCategory} options={['All projects', 'IoT', 'Robotics', 'AI', 'Electronics', '3D Printing']} onChange={val => setActiveCategory(val)} />
            </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-12 space-y-12">
            {filteredAndSortedPosts.map((post) => {
              const currentVote = userVotes[post.id] || 0;
              const avatarUrl = post.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author}&backgroundColor=${AVATAR_BG}`;
              const isOwner = post.author === user.username || user.role === 'admin';
              const isPending = post.status === 'pending';
              
              return (
                <div key={post.id} className={`break-inside-avoid bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all hover:-translate-y-2 border-4 ${isPending ? 'border-yellow-400 border-dashed' : 'border-white'} group`}>
                  <div className="p-8 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <img src={avatarUrl} alt={post.author} className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 p-1" />
                      <div>
                        <h4 className="font-black text-black text-sm uppercase leading-none">{post.author}</h4>
                        <p className="text-[9px] text-slate-800 font-black uppercase mt-1 opacity-60">{post.timestamp} {isPending && '• PENDING'}</p>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingPostId(post.id); setNewPost({title: post.title, description: post.description, imageUrl: post.imageUrl || '', category: post.category}); setIsModalOpen(true); }} className="p-2 text-black hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => confirm("Delete this build?") && onDeletePost(post.id)} className="p-2 text-black hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex flex-col">
                    <div className="mb-4">
                      <span className="bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="font-black text-black text-3xl mb-5 uppercase italic leading-tight">{post.title}</h3>
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
          <div className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden border-t-[20px] border-yellow-400 p-16 shadow-3xl">
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase mb-10 italic tracking-tighter">
              {editingPostId ? 'Edit Build' : 'Upload Build'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Build Title</label>
                <input 
                  type="text" 
                  value={newPost.title} 
                  onChange={e => setNewPost({...newPost, title: e.target.value})} 
                  className="w-full text-2xl font-black text-black bg-slate-100 border-2 border-slate-200 rounded-2xl p-5 outline-none focus:border-black focus:bg-white transition-all placeholder:text-slate-400" 
                  placeholder="What did you build?" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Category</label>
                <select 
                  value={newPost.category} 
                  onChange={e => setNewPost({...newPost, category: e.target.value})} 
                  className="w-full bg-slate-100 p-5 rounded-2xl font-black uppercase text-sm border-2 border-slate-200 outline-none focus:border-black text-black"
                >
                  {['IoT', 'Robotics', 'AI', 'Electronics', '3D Printing'].map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Log / Description</label>
                <textarea 
                  value={newPost.description} 
                  onChange={e => setNewPost({...newPost, description: e.target.value})} 
                  className="w-full text-black text-lg border-2 border-slate-200 outline-none min-h-[140px] bg-slate-100 p-6 rounded-[2rem] font-black focus:border-black focus:bg-white transition-all placeholder:text-slate-400" 
                  placeholder="Detail your breakthrough..." 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Image URL (Optional)</label>
                <input 
                  type="url" 
                  value={newPost.imageUrl} 
                  onChange={e => setNewPost({...newPost, imageUrl: e.target.value})} 
                  placeholder="https://..." 
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-black focus:border-black transition-all" 
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="submit" className="flex-grow bg-black text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl hover:bg-yellow-400 hover:text-black transition-all">
                  SHARE BUILD
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-slate-100 text-black py-6 rounded-2xl font-black text-lg uppercase border-2 border-slate-200 hover:bg-white transition-all">
                  CANCEL
                </button>
              </div>
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

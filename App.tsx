
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import ProjectEditor from './components/ProjectEditor';
import CommunityView from './components/CommunityView';
import LiveSpaceBackground from './components/LiveSpaceBackground';
import { MOCK_PROJECTS, CATEGORIES, AVATAR_BG } from './constants';
import { AppState, Project, CommunityPost, User, InteractiveProject, Comment } from './types';
import { Sparkles, Search, ChevronDown, Trophy, Shield, Key, ArrowRight, User as UserIcon, X, Check, Cpu } from 'lucide-react';
import { db } from './services/firebase';
import { ref, onValue, set, push, update, remove } from "firebase/database";

const AVATAR_SEEDS = Array.from({ length: 24 }, (_, i) => `Robot-${i + 1}`);

const LoginForm: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=${AVATAR_BG}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const trimmedUser = username.trim();
      const finalAvatarUrl = getAvatarUrl(selectedAvatar);
      
      if (trimmedUser === 'EPSUPPORT1234' && password === 'EP1234@$#') {
        onLogin({ username: 'EPSUPPORT1234', role: 'admin', avatarSeed: finalAvatarUrl });
      } else if (password === 'EP1234@') {
        onLogin({ username: trimmedUser || 'Cadet', role: 'user', avatarSeed: finalAvatarUrl });
      } else {
        setError('Invalid Security Code. Contact Instructor.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-slate-950">
      <div className="absolute inset-0 z-0">
        <LiveSpaceBackground />
      </div>
      
      <div className="bg-white/10 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-baseline space-x-1">
               <span className="text-[#f43f5e] font-black text-5xl italic drop-shadow-lg">S</span>
               <span className="text-[#fbbf24] font-black text-5xl italic drop-shadow-lg">T</span>
               <span className="text-[#10b981] font-black text-5xl italic drop-shadow-lg">E</span>
               <span className="text-[#0ea5e9] font-black text-5xl italic drop-shadow-lg">M</span>
            </div>
            <div className="bg-[#0ea5e9] px-4 py-1.5 mt-2 rounded-lg">
               <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">MISSION CONTROL</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Enter the Hub</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <button type="button" onClick={() => setIsAvatarModalOpen(true)} className="relative group focus:outline-none">
              <div className="w-28 h-28 rounded-[2rem] bg-white/10 border-4 border-white/20 overflow-hidden transition-all group-hover:scale-110 shadow-2xl">
                <img src={getAvatarUrl(selectedAvatar)} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-blue-900 p-2 rounded-xl shadow-lg border-2 border-white"><Cpu className="w-5 h-5" /></div>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Call Sign</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-8 text-white text-xl font-bold focus:border-yellow-400 outline-none" placeholder="Username" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Security Key</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-8 text-white text-xl font-bold focus:border-yellow-400 outline-none" placeholder="••••••••" required />
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 font-black text-xs uppercase text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-slate-900 py-6 rounded-2xl font-black text-lg uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
            {loading ? <div className="w-6 h-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <>JOIN MISSION <ArrowRight className="w-6 h-6 ml-3" /></>}
          </button>
        </form>
      </div>

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
          <div className="bg-white/10 border border-white/20 w-full max-w-2xl rounded-[4rem] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-white uppercase italic">CHOOSE YOUR ROBOT</h3>
              <button onClick={() => setIsAvatarModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-red-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 max-h-[50vh] overflow-y-auto no-scrollbar">
              {AVATAR_SEEDS.map((seed) => (
                <button key={seed} onClick={() => { setSelectedAvatar(seed); setIsAvatarModalOpen(false); }} className={`rounded-2xl border-4 transition-all ${selectedAvatar === seed ? 'bg-yellow-400 border-white' : 'bg-white/5 border-transparent'}`}>
                  <img src={getAvatarUrl(seed)} className="w-full aspect-square" alt={seed} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<InteractiveProject[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [state, setState] = useState<AppState>({
    currentView: 'grid',
    selectedProjectId: null,
    searchQuery: '',
    activeCategory: 'All projects',
    activeDifficulty: 'All difficulties',
    activeSort: 'Trending',
    user: null,
  });

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
          comments: data[key].comments ? Object.values(data[key].comments) : [],
          hardware: data[key].hardware || [],
          steps: data[key].steps || [],
        }));
        setProjects(projectList);
      } else {
        setProjects(MOCK_PROJECTS);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const postsRef = ref(db, 'communityPosts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setCommunityPosts(postList);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => {
      const title = p.title || '';
      const description = p.description || '';
      const query = state.searchQuery || '';
      
      const matchesSearch = title.toLowerCase().includes(query.toLowerCase()) ||
                            description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = state.activeCategory === 'All projects' || p.category === state.activeCategory;
      const matchesDifficulty = state.activeDifficulty === 'All difficulties' || p.difficulty === state.activeDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (state.activeSort === 'Trending') result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (state.activeSort === 'Most Liked') result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    else if (state.activeSort === 'Newest') result = [...result].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return result;
  }, [state.searchQuery, state.activeCategory, state.activeDifficulty, state.activeSort, projects]);

  const handleProjectClick = (id: string) => {
    const currentProject = projects.find(p => p.id === id);
    if (currentProject) update(ref(db, `projects/${id}`), { views: (currentProject.views || 0) + 1 });
    setState(prev => ({ ...prev, currentView: 'detail', selectedProjectId: id }));
  };

  const handleToggleLike = (id: string) => {
    const currentProject = projects.find(p => p.id === id);
    if (currentProject) {
      const liked = currentProject.isLikedByUser || false;
      update(ref(db, `projects/${id}`), { likes: liked ? Math.max(0, (currentProject.likes || 0) - 1) : (currentProject.likes || 0) + 1 });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, isLikedByUser: !liked } : p));
    }
  };

  const handleDeleteProject = async (id: string) => {
    await remove(ref(db, `projects/${id}`));
    setState(prev => ({ ...prev, currentView: 'grid', selectedProjectId: null }));
  };

  const handleAddCommunityPost = async (post: any) => {
    if (post.id) {
      await update(ref(db, `communityPosts/${post.id}`), post);
    } else {
      const newRef = push(ref(db, 'communityPosts'));
      await set(newRef, { ...post, id: newRef.key, likes: 0, commentsCount: 0, timestamp: new Date().toLocaleDateString(), authorAvatar: user?.avatarSeed });
    }
  };

  const handleVotePost = async (id: string, dir: number) => {
    const post = communityPosts.find(p => p.id === id);
    if (post) await update(ref(db, `communityPosts/${id}`), { likes: (post.likes || 0) + dir });
  };

  if (!user) return <LoginForm onLogin={setUser} />;

  return (
    <Layout 
      onSearch={val => setState(prev => ({ ...prev, searchQuery: val }))}
      onHome={() => setState(prev => ({ ...prev, currentView: 'grid', selectedProjectId: null }))}
      onCreate={() => setState(prev => ({ ...prev, currentView: 'create' }))}
      onCommunity={() => setState(prev => ({ ...prev, currentView: 'community' }))}
      onChallenges={() => setState(prev => ({ ...prev, currentView: 'challenges' }))}
      onLogout={() => setUser(null)}
      activeView={state.currentView}
      user={user}
    >
      {state.currentView === 'grid' && (
        <div className="pb-40 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <section className="py-24 px-4 text-center">
            <h1 className="text-6xl md:text-9xl font-black mb-12 text-white uppercase tracking-tighter drop-shadow-2xl italic">EP STEM ACADEMY</h1>
            <div className="relative max-w-2xl mx-auto">
               <input type="text" placeholder="Search mission modules..." className="w-full bg-white rounded-full py-6 px-12 text-black text-2xl font-black outline-none shadow-2xl" onChange={e => setState(prev => ({ ...prev, searchQuery: e.target.value }))} />
            </div>
          </section>

          <div className="container mx-auto px-4 mt-10">
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] p-12 border border-white/10">
              <div className="flex flex-wrap items-center gap-5 mb-12">
                <FilterDropdown label="Trending" value={state.activeSort} options={['Trending', 'Newest', 'Most Liked']} onChange={val => setState(prev => ({ ...prev, activeSort: val }))} />
                <FilterDropdown label="Difficulty" value={state.activeDifficulty} options={['All difficulties', 'Beginner', 'Intermediate', 'Advanced']} onChange={val => setState(prev => ({ ...prev, activeDifficulty: val }))} />
                <FilterDropdown label="Category" value={state.activeCategory} options={['All projects', 'IoT', 'Robotics', 'AI', 'Electronics', '3D Printing']} onChange={val => setState(prev => ({ ...prev, activeCategory: val }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredProjects.map(p => <ProjectCard key={p.id} project={p} onClick={handleProjectClick} onToggleLike={handleToggleLike} />)}
              </div>
            </div>
          </div>
        </div>
      )}

      {state.currentView === 'community' && <CommunityView posts={communityPosts} onAddPost={handleAddCommunityPost} onDeletePost={id => remove(ref(db, `communityPosts/${id}`))} onVote={handleVotePost} onBack={() => setState(prev => ({ ...prev, currentView: 'grid' }))} user={user} />}

      {state.currentView === 'detail' && state.selectedProjectId && (
        <ProjectDetail project={projects.find(p => p.id === state.selectedProjectId)!} onBack={() => setState(prev => ({ ...prev, currentView: 'grid' }))} onToggleLike={() => handleToggleLike(state.selectedProjectId!)} onAddComment={(c) => push(ref(db, `projects/${state.selectedProjectId}/comments`), c)} user={user} onDelete={() => handleDeleteProject(state.selectedProjectId!)} />
      )}
      
      {state.currentView === 'create' && <ProjectEditor onSave={async (p) => { await set(ref(db, `projects/${p.id}`), p); setState(prev => ({ ...prev, currentView: 'grid' })); }} onCancel={() => setState(prev => ({ ...prev, currentView: 'grid' }))} />}
    </Layout>
  );
};

export default App;

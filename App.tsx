
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import ProjectEditor from './components/ProjectEditor';
import CommunityView from './components/CommunityView';
import SubmissionQueue from './components/SubmissionQueue';
import LiveSpaceBackground from './components/LiveSpaceBackground';
import { MOCK_PROJECTS, AVATAR_BG, THEMES } from './constants';
import { AppState, CommunityPost, User, InteractiveProject } from './types';
import { ArrowRight, X, Cpu, ChevronDown, Rocket, Sparkles, Sprout, HeartPulse, Search, Mail, ShieldAlert, Loader2 } from 'lucide-react';
import { db, auth, signInWithGoogle, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './services/firebase';
import { ref, onValue, set, push, update, remove } from "firebase/database";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Successful login will be detected by the onAuthStateChanged listener in the App component
    } catch (err: any) {
      console.error("Google login failed:", err);
      setError('Mission Link Failed: ' + (err.message || 'Check your connection.'));
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error("Email login failed:", err);
      setError('Invalid mission authorization codes.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-slate-950">
      <div className="absolute inset-0 z-0"><LiveSpaceBackground /></div>
      <div className="bg-white/10 backdrop-blur-3xl p-8 md:p-16 rounded-[4rem] border border-white/20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] w-full max-w-xl relative z-10 transition-all duration-500">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-baseline space-x-1">
               <span className="text-[#f43f5e] font-black text-5xl italic drop-shadow-lg">S</span>
               <span className="text-[#fbbf24] font-black text-5xl italic drop-shadow-lg">T</span>
               <span className="text-[#10b981] font-black text-5xl italic drop-shadow-lg">E</span>
               <span className="text-[#0ea5e9] font-black text-5xl italic drop-shadow-lg">M</span>
            </div>
            <div className="bg-[#0ea5e9] px-4 py-1.5 mt-2 rounded-lg"><span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">MISSION CONTROL</span></div>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Launch Sequence</h2>
        </div>

        <div className="space-y-6">
          {!showAdminLogin ? (
            <>
              <div className="text-center mb-6">
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-4">Academy Students & Guests</p>
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-xl uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-4 mb-4 border-b-8 border-slate-200 active:translate-y-1 active:border-b-0"
                >
                  {loading ? <Loader2 className="w-8 h-8 animate-spin text-slate-900" /> : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-8 h-8" alt="Google" />
                      <span>Log in with Gmail</span>
                    </>
                  )}
                </button>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-4 leading-relaxed">
                  Gmail login is required to access the Academy missions.
                </p>
              </div>

              <div className="flex items-center space-x-4 opacity-20 my-10">
                <div className="h-px flex-grow bg-white"></div>
                <span className="text-white font-black text-[10px] uppercase tracking-widest">OR</span>
                <div className="h-px flex-grow bg-white"></div>
              </div>

              <button 
                onClick={() => setShowAdminLogin(true)}
                className="w-full bg-white/5 border-2 border-white/10 text-white/40 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center space-x-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Login Path</span>
              </button>
            </>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-black uppercase italic tracking-widest">Admin Terminal</h3>
                <button onClick={() => setShowAdminLogin(false)} className="text-yellow-400 text-xs font-black uppercase hover:underline">Student Entry</button>
              </div>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white text-lg font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Admin Email" required />
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-8 text-white text-lg font-bold focus:border-yellow-400 outline-none transition-all" placeholder="Security Code" required />
                
                {error && <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 font-black text-[10px] uppercase text-center">{error}</div>}
                
                <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-slate-900 py-6 rounded-2xl font-black text-xl uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center border-b-8 border-yellow-600 active:translate-y-1 active:border-b-0">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-900" /> : <>AUTHORIZE MISSION <ArrowRight className="w-6 h-6 ml-3" /></>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [projects, setProjects] = useState<InteractiveProject[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [likedProjectIds, setLikedProjectIds] = useState<Set<string>>(new Set());
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
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email === 'Edusupport@ep-asia.com';
        setUser({
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Cadet',
          role: isAdmin ? 'admin' : 'user',
          avatarSeed: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}&backgroundColor=${AVATAR_BG}`
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

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
        setProjects(MOCK_PROJECTS.map(p => ({ ...p, status: 'approved' })) as InteractiveProject[]);
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

  const projectsWithLikes = useMemo(() => {
    return projects.map(p => ({
      ...p,
      isLikedByUser: likedProjectIds.has(p.id)
    }));
  }, [projects, likedProjectIds]);

  const approvedProjects = useMemo(() => projectsWithLikes.filter(p => p.status === 'approved'), [projectsWithLikes]);
  
  const pendingProjects = useMemo(() => {
    if (user?.role === 'admin') return projectsWithLikes.filter(p => p.status === 'pending');
    return projectsWithLikes.filter(p => p.status === 'pending' && p.author === user?.username);
  }, [projectsWithLikes, user]);

  const pendingPosts = useMemo(() => {
    if (user?.role === 'admin') return communityPosts.filter(p => p.status === 'pending');
    return communityPosts.filter(p => p.status === 'pending' && p.author === user?.username);
  }, [communityPosts, user]);

  const filteredProjects = useMemo(() => {
    let result = approvedProjects.filter(p => {
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
    else if (state.activeSort === 'Newest') result = [...result].sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());

    return result;
  }, [state.searchQuery, state.activeCategory, state.activeDifficulty, state.activeSort, approvedProjects]);

  const sections = useMemo(() => {
    const s = [];
    const sampleProjects = approvedProjects.filter(p => p.theme === 'Sample').slice(0, 4);
    if (sampleProjects.length > 0) {
      s.push({ title: "Sample", items: sampleProjects });
    }
    s.push({ title: "Most recently added", items: [...approvedProjects].sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4) });
    THEMES.filter(t => t !== 'Sample').forEach(themeName => {
      const themeProjects = approvedProjects.filter(p => p.theme === themeName).slice(0, 4);
      if (themeProjects.length > 0) {
        s.push({ title: themeName === 'General' ? "Academy Highlights" : themeName, items: themeProjects });
      }
    });
    return s;
  }, [approvedProjects]);

  const handleToggleLike = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const isLiked = likedProjectIds.has(projectId);
    const newLikes = isLiked ? Math.max(0, (project.likes || 0) - 1) : (project.likes || 0) + 1;
    await update(ref(db, `projects/${projectId}`), { likes: newLikes });
    setLikedProjectIds(prev => {
      const next = new Set(prev);
      if (isLiked) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const handleSaveProject = async (p: any) => {
    const isAdmin = user?.role === 'admin';
    const projectData = { 
      ...p, 
      author: user?.username, 
      status: isAdmin ? 'approved' : 'pending',
      theme: isAdmin ? 'Sample' : p.theme 
    };
    await set(ref(db, `projects/${p.id}`), projectData);
    setState(prev => ({ ...prev, currentView: isAdmin ? 'grid' : 'submissions' }));
  };

  // Only render the app once authentication state is determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs">Synchronizing with Academy Hub...</p>
      </div>
    );
  }

  // If no user is signed in, strictly show the login form
  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout 
      onSearch={val => setState(prev => ({ ...prev, searchQuery: val }))}
      onHome={() => setState(prev => ({ ...prev, currentView: 'grid', selectedProjectId: null }))}
      onCreate={() => setState(prev => ({ ...prev, currentView: 'create' }))}
      onCommunity={() => setState(prev => ({ ...prev, currentView: 'community' }))}
      onSubmissions={() => setState(prev => ({ ...prev, currentView: 'submissions' }))}
      onLogout={() => signOut(auth)}
      activeView={state.currentView}
      user={user}
    >
      {state.currentView === 'grid' && (
        <div className="pb-40 animate-in fade-in duration-700">
          <section className="py-24 px-4 text-center">
            <h1 className="text-6xl md:text-9xl font-black mb-12 text-white uppercase tracking-tighter italic drop-shadow-2xl">EP STEM ACADEMY</h1>
            <div className="relative max-w-2xl mx-auto flex items-center bg-white rounded-full px-8 py-2 shadow-2xl">
               <Search className="text-slate-400 w-6 h-6 mr-4" />
               <input type="text" placeholder="Search mission modules..." className="w-full py-4 text-black text-2xl font-black outline-none bg-transparent" value={state.searchQuery} onChange={e => setState(prev => ({ ...prev, searchQuery: e.target.value }))} />
               {state.searchQuery && <button onClick={() => setState(prev => ({ ...prev, searchQuery: '' }))} className="p-2 text-slate-400 hover:text-black"><X /></button>}
            </div>
          </section>

          <div className="container mx-auto px-6 space-y-20">
            {state.searchQuery ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProjects.map(p => (
                  <ProjectCard key={p.id} project={p} onClick={id => setState(prev => ({...prev, currentView: 'detail', selectedProjectId: id}))} onToggleLike={handleToggleLike} />
                ))}
                {filteredProjects.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-white/40 font-black uppercase tracking-widest">No matching missions found.</p>
                  </div>
                )}
              </div>
            ) : (
              sections.map((section, idx) => (
                section.items.length > 0 && (
                  <div key={idx} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h2 className="text-xl font-bold text-white tracking-tight uppercase italic tracking-widest">{section.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {section.items.map(p => (
                        <ProjectCard key={p.id} project={p} onClick={id => setState(prev => ({...prev, currentView: 'detail', selectedProjectId: id}))} onToggleLike={handleToggleLike} />
                      ))}
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      )}

      {state.currentView === 'submissions' && (
        <SubmissionQueue 
          pendingProjects={pendingProjects} 
          pendingPosts={pendingPosts} 
          onApproveProject={id => update(ref(db, `projects/${id}`), { status: 'approved' })} 
          onRejectProject={id => remove(ref(db, `projects/${id}`))}
          onApprovePost={id => update(ref(db, `communityPosts/${id}`), { status: 'approved' })} 
          onRejectPost={id => remove(ref(db, `communityPosts/${id}`))}
          user={user} 
        />
      )}

      {state.currentView === 'community' && <CommunityView posts={communityPosts.filter(p => p.status === 'approved' || (user && p.author === user.username))} onAddPost={async (post) => {
        const isStudent = user?.role === 'user';
        const newRef = post.id ? ref(db, `communityPosts/${post.id}`) : push(ref(db, 'communityPosts'));
        const postData = { ...post, id: post.id || newRef.key, status: isStudent ? 'pending' : 'approved', timestamp: new Date().toLocaleDateString(), author: user?.username, authorAvatar: user?.avatarSeed, likes: post.likes || 0, commentsCount: post.commentsCount || 0 };
        await update(newRef, postData);
      }} onDeletePost={id => remove(ref(db, `communityPosts/${id}`))} onVote={(id, dir) => update(ref(db, `communityPosts/${id}`), { likes: (communityPosts.find(p=>p.id===id)?.likes||0) + dir })} onBack={() => setState(prev => ({ ...prev, currentView: 'grid' }))} user={user} />}
      
      {state.currentView === 'create' && <ProjectEditor user={user} onSave={handleSaveProject} onCancel={() => setState(prev => ({ ...prev, currentView: 'grid' }))} />}
      
      {state.currentView === 'detail' && state.selectedProjectId && <ProjectDetail project={projectsWithLikes.find(p => p.id === state.selectedProjectId)!} onBack={() => setState(prev => ({ ...prev, currentView: 'grid' }))} onToggleLike={() => handleToggleLike(state.selectedProjectId!)} onAddComment={(c) => push(ref(db, `projects/${state.selectedProjectId}/comments`), c)} user={user} onDelete={() => remove(ref(db, `projects/${state.selectedProjectId}`))} onEdit={() => setState(prev => ({ ...prev, currentView: 'create' }))} />}
    </Layout>
  );
};

export default App;

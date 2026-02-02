
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
import { ArrowRight, X, Cpu, ChevronDown, Rocket, Sparkles, Sprout, HeartPulse, Search, Mail, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
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
    // Debug line for testing configuration issues
    console.log("PROJECT ID:", auth.app.options.projectId);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (err.code === 'auth/configuration-not-found') {
        setError('Google Sign-In is not enabled in your Firebase Project. Please enable it in the Firebase Console (Authentication > Sign-in method).');
      } else {
        setError(err.message || 'Mission connection failed.');
      }
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
      setError('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-slate-950">
      <div className="absolute inset-0 z-0"><LiveSpaceBackground /></div>
      <div className="bg-white/10 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-baseline space-x-1">
               <span className="text-[#f43f5e] font-black text-4xl italic">S</span>
               <span className="text-[#fbbf24] font-black text-4xl italic">T</span>
               <span className="text-[#10b981] font-black text-4xl italic">E</span>
               <span className="text-[#0ea5e9] font-black text-4xl italic">M</span>
            </div>
            <p className="text-white/40 text-[9px] font-black tracking-widest uppercase mt-2">Mission Academy Hub</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-start space-x-3 text-red-200 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!showAdminLogin ? (
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-sm uppercase shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                  <span>Log in with Google</span>
                </>
              )}
            </button>
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="w-full text-white/40 hover:text-white py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Admin Terminal Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-yellow-400" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Code" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-yellow-400" required />
            <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-slate-900 py-4 rounded-xl font-bold uppercase">Authorize</button>
            <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full text-white/40 py-2 text-[10px] font-bold">Back</button>
          </form>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [projects, setProjects] = useState<InteractiveProject[]>([]);
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

  const approvedProjects = useMemo(() => projects.filter(p => p.status === 'approved'), [projects]);
  
  const filteredProjects = useMemo(() => {
    let result = approvedProjects.filter(p => {
      const title = p.title || '';
      const description = p.description || '';
      const query = state.searchQuery || '';
      const matchesSearch = title.toLowerCase().includes(query.toLowerCase()) || 
                            description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = state.activeCategory === 'All projects' || p.category === state.activeCategory;
      return matchesSearch && matchesCategory;
    });
    return result;
  }, [state.searchQuery, state.activeCategory, approvedProjects]);

  const sections = useMemo(() => {
    const s = [];
    const recent = [...approvedProjects].sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);
    if (recent.length > 0) s.push({ title: "Featured Modules", items: recent });
    
    THEMES.forEach(theme => {
      const items = approvedProjects.filter(p => p.theme === theme).slice(0, 4);
      if (items.length > 0) s.push({ title: theme, items });
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
      isLiked ? next.delete(projectId) : next.add(projectId);
      return next;
    });
  };

  if (authLoading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Calibrating Hub...</p>
    </div>
  );

  if (!user) return <LoginForm />;

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
        <div className="bg-[#fcfcfc] min-h-screen pb-40 overflow-hidden relative">
          {/* Playful Background Elements mimicking Image 2 */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#e2e2ff] rounded-full blur-[80px] opacity-40 pointer-events-none" />
          <div className="absolute top-[40%] right-[-5%] w-96 h-96 bg-[#bae6fd] rounded-full blur-[100px] opacity-30 pointer-events-none" />
          <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-[#fecdd3] rounded-full blur-[90px] opacity-20 pointer-events-none" />

          {/* Hero Section: Light & Playful */}
          <div className="bg-white text-slate-900 py-24 px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-3 mb-6 bg-[#e2e2ff] text-blue-700 px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-widest shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Engineering</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 italic tracking-tighter uppercase leading-[0.9]">
                Discover <span className="text-blue-600">Projects</span>
              </h1>
              <p className="text-slate-500 mb-12 max-w-2xl mx-auto font-bold text-xl leading-snug">
                Explore 100+ hardware missions and playful ideas, <br className="hidden md:block"/> all in one place for young explorers.
              </p>
              
              <div className="max-w-2xl mx-auto relative">
                <div className="bg-white border-[4px] border-slate-900 rounded-[2.5rem] p-3 flex items-center shadow-[0_12px_0_rgba(0,0,0,1)] transition-transform hover:translate-y-1">
                  <Search className="ml-6 text-slate-400 w-6 h-6" />
                  <input 
                    type="text" 
                    value={state.searchQuery}
                    onChange={e => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search for... (e.g. Robot, IoT, Solar)" 
                    className="w-full bg-transparent py-4 px-6 text-xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                  />
                  <button className="bg-slate-900 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-sm mr-2 hover:bg-blue-600 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="container mx-auto px-6 py-12 space-y-32 relative z-10">
            {state.searchQuery ? (
               <div className="space-y-12">
                <div className="flex items-center space-x-4 border-b-4 border-slate-900 pb-6">
                  <h2 className="text-4xl font-black text-slate-900 italic uppercase">Search Results</h2>
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                  {filteredProjects.map((p, idx) => (
                    <ProjectCard 
                      key={p.id} 
                      project={p} 
                      index={idx}
                      onClick={id => setState(prev => ({...prev, currentView: 'detail', selectedProjectId: id}))} 
                      onToggleLike={handleToggleLike} 
                    />
                  ))}
                </div>
               </div>
            ) : (
              sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-4xl font-black text-slate-900 uppercase italic leading-none">{section.title}</h2>
                      <div className={`w-3 h-3 rounded-full ${sectionIdx % 2 === 0 ? 'bg-blue-600' : 'bg-rose-500'}`} />
                    </div>
                    <button className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 hover:text-blue-600 hover:border-blue-600 transition-all">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {section.items.map((p, idx) => (
                      <ProjectCard 
                        key={p.id} 
                        project={p} 
                        index={idx}
                        onClick={id => setState(prev => ({...prev, currentView: 'detail', selectedProjectId: id}))} 
                        onToggleLike={handleToggleLike} 
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {state.currentView === 'submissions' && (
        <SubmissionQueue 
          pendingProjects={projects.filter(p => p.status === 'pending')} 
          pendingPosts={[]} 
          onApproveProject={id => update(ref(db, `projects/${id}`), { status: 'approved' })} 
          onRejectProject={id => remove(ref(db, `projects/${id}`))}
          onApprovePost={() => {}} 
          onRejectPost={() => {}}
          user={user} 
        />
      )}

      {state.currentView === 'community' && <CommunityView posts={[]} onAddPost={() => {}} onDeletePost={() => {}} onVote={() => {}} onBack={() => setState(prev => ({ ...prev, currentView: 'grid' }))} user={user} />}
      
      {state.currentView === 'create' && <ProjectEditor user={user} onSave={async (p) => {
        await set(ref(db, `projects/${p.id}`), { ...p, author: user.username, status: user.role === 'admin' ? 'approved' : 'pending' });
        setState(prev => ({ ...prev, currentView: 'grid' }));
      }} onCancel={() => setState(prev => ({ ...prev, currentView: 'grid' }))} />}
      
      {state.currentView === 'detail' && state.selectedProjectId && (
        <ProjectDetail 
          project={projects.find(p => p.id === state.selectedProjectId)!} 
          onBack={() => setState(prev => ({ ...prev, currentView: 'grid' }))} 
          onToggleLike={() => handleToggleLike(state.selectedProjectId!)} 
          onAddComment={(c) => push(ref(db, `projects/${state.selectedProjectId}/comments`), c)} 
          user={user} 
          onDelete={() => remove(ref(db, `projects/${state.selectedProjectId}`))} 
          onEdit={() => setState(prev => ({ ...prev, currentView: 'create' }))} 
        />
      )}
    </Layout>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { Project, Comment, User, InteractiveProject } from '../types';
import { 
  ArrowLeft, Cpu, Code, BookOpen, MessageSquare, 
  ExternalLink, Heart, ThumbsUp, Eye, Sparkles, Zap, 
  ChevronRight, Play, Clock, X, Terminal, Bookmark, 
  Share2, Layout as LayoutIcon, Info, Trophy, Tag, Globe,
  Terminal as CodeIcon, Layers, Award, Edit, Trash2
} from 'lucide-react';
import { AVATAR_BG } from '../constants';

interface ProjectDetailProps {
  project: InteractiveProject;
  onBack: () => void;
  onToggleLike: () => void;
  onAddComment: (comment: Comment) => void;
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onToggleLike, onAddComment, user, onEdit, onDelete }) => {
  const [comments, setComments] = useState<Comment[]>(project.comments);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setComments(project.comments);
  }, [project.comments]);

  const handleLikeComment = (commentId: string) => {
    const newLiked = new Set(likedComments);
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        if (newLiked.has(commentId)) {
          newLiked.delete(commentId);
          return { ...c, likes: c.likes - 1 };
        } else {
          newLiked.add(commentId);
          return { ...c, likes: c.likes + 1 };
        }
      }
      return c;
    });
    setComments(updatedComments);
    setLikedComments(newLiked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: user.username,
      text: newComment,
      timestamp: 'Just now',
      avatarColor: 'bg-blue-900',
      likes: 0
    };
    onAddComment(comment);
    setNewComment('');
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'hardware', label: 'Hardware' },
    { 
      id: 'story', 
      label: 'Story',
      subItems: (project.steps || []).map(step => ({ 
        id: `step-${(step.title || 'step').replace(/\s+/g, '-').toLowerCase()}`, 
        label: step.title 
      }))
    },
    { id: 'schematics', label: 'Schematics' },
    { id: 'code', label: 'Code' },
    { id: 'credits', label: 'Credits' },
    { id: 'comments', label: `Comments (${comments.length})` },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      onDelete?.();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0118] text-white">
      {/* Top Breadcrumb/Meta Header */}
      <div className="border-b border-white/10 bg-[#0a0118]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between h-16">
          <button 
            onClick={onBack} 
            className="flex items-center text-white hover:text-yellow-400 transition-colors text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <div className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                <button 
                  onClick={onEdit}
                  className="flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit Project
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <button 
                  onClick={handleDelete}
                  className="flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </button>
              </div>
            )}
            <span className="hidden md:inline text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Project Documentation System</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 bg-white rounded-[4rem] text-black mt-12 shadow-2xl overflow-hidden relative border-t-8 border-yellow-400">
        <div className="grid grid-cols-12 gap-10 p-2 md:p-10">
          
          {/* LEFT COLUMN: Sticky Navigation & Interactions */}
          <aside className="col-span-12 lg:col-span-2 hidden lg:block">
            <div className="sticky top-24">
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className={`block w-full text-left px-4 py-3 text-[13px] font-black transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-600 text-blue-600 bg-blue-50' 
                          : 'border-transparent text-black opacity-40 hover:opacity-100 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </nav>

              {/* Interaction Block */}
              <div className="mt-12 flex space-x-2 px-2">
                <button 
                  onClick={onToggleLike}
                  className={`flex flex-1 items-center justify-center py-4 rounded-lg border-2 transition-all ${
                    project.isLikedByUser 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-600' 
                      : 'border-slate-100 text-black hover:border-black shadow-sm'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 mr-2 ${project.isLikedByUser ? 'fill-blue-600' : ''}`} />
                  <span className="text-xs font-black">{project.likes}</span>
                </button>
                <button className="flex-1 flex items-center justify-center py-4 rounded-lg border-2 border-slate-100 text-black hover:border-black transition-all shadow-sm">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Main Content Flow */}
          <main className="col-span-12 lg:col-span-7 space-y-16">
            <div id="overview" className="space-y-10 scroll-mt-40">
              <div className="flex items-center space-x-5">
                 <div className="w-14 h-14 rounded-2xl bg-[#6b1e8e] overflow-hidden border-2 border-slate-200 shadow-lg">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${project.author}&backgroundColor=${AVATAR_BG}`} 
                      alt={project.author} 
                      className="w-full h-full object-cover" 
                    />
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-black hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-tight">{project.author}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest opacity-60">Published {project.publishedAt} | MISSION BRIEFING</span>
                 </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-black leading-tight tracking-tight uppercase italic drop-shadow-sm">
                {project.title}
              </h1>

              <p className="text-2xl text-black leading-relaxed font-black italic border-l-[16px] border-yellow-400 pl-10 bg-slate-50 py-12 rounded-r-[3rem] shadow-inner">
                "{project.description}"
              </p>

              <div className="flex flex-wrap items-center gap-10 py-8 border-y-2 border-slate-100">
                 <div className="flex items-center space-x-3 text-[14px] font-black text-orange-600 uppercase tracking-[0.2em]">
                    <Zap className="w-6 h-6 fill-orange-600" />
                    <span>{project.difficulty}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-[14px] font-black text-black uppercase tracking-[0.2em]">
                    <Clock className="w-6 h-6" />
                    <span>{project.duration}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-[14px] font-black text-black uppercase tracking-[0.2em]">
                    <Eye className="w-6 h-6" />
                    <span>{project.views} Views</span>
                 </div>
              </div>

              <div className="rounded-[4rem] overflow-hidden border-[16px] border-white shadow-[0_60px_120px_rgba(0,0,0,0.15)] aspect-video bg-slate-100 relative group">
                 <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt={project.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            <section id="hardware" className="space-y-10 pt-20 border-t-2 border-slate-100 scroll-mt-40">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-black uppercase tracking-tight italic">Mission Arsenal</h2>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {(project.hardware || []).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] flex items-center border-2 border-slate-100 hover:border-black transition-all group shadow-sm">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex-shrink-0 mr-10 overflow-hidden p-4 shadow-inner border-2 border-slate-200">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-2xl font-black text-black group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</p>
                      <a href={item.link} target="_blank" className="text-[12px] font-black text-black uppercase tracking-widest mt-3 flex items-center hover:underline">
                        Hardware Specs <ExternalLink className="w-5 h-5 ml-2" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="story" className="space-y-16 pt-20 border-t-2 border-slate-100 scroll-mt-40">
              <h2 className="text-4xl font-black text-black uppercase tracking-tight italic">Protocol Details</h2>
              <div className="space-y-40">
                {(project.steps || []).map((step, idx) => (
                  <div key={idx} id={`step-${(step.title || 'step').replace(/\s+/g, '-').toLowerCase()}`} className="space-y-12 scroll-mt-40">
                    <div className="flex items-center space-x-10">
                       <div className="w-20 h-20 bg-black text-yellow-400 flex items-center justify-center rounded-[2rem] font-black text-4xl italic shadow-2xl rotate-[-4deg] flex-shrink-0">{idx + 1}</div>
                       <h3 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase italic">{step.title}</h3>
                    </div>
                    <p className="text-black text-2xl leading-relaxed font-black border-l-8 border-slate-200 pl-12 italic">
                      {step.content}
                    </p>
                    {step.media && step.media.length > 0 && (
                      <div className="rounded-[4rem] overflow-hidden border-[12px] border-slate-50 shadow-2xl bg-slate-100 group">
                         <img src={step.media[0].url} className="w-full h-auto group-hover:scale-105 transition-transform duration-[4000ms]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="code" className="space-y-10 pt-20 border-t-2 border-slate-100 scroll-mt-40">
               <h2 className="text-4xl font-black text-black uppercase tracking-tight italic">Source Code</h2>
               <div className="bg-black rounded-[4rem] p-20 space-y-10 text-center shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-yellow-400 to-pink-600" />
                 <div className="inline-flex p-8 bg-white/10 rounded-[2.5rem] mb-6 shadow-2xl border border-white/5">
                    <Code className="w-16 h-16 text-yellow-400" />
                 </div>
                 <div className="max-w-xl mx-auto space-y-8">
                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tight">Interactive MakeCode Module</h4>
                   <p className="text-white text-lg leading-relaxed font-bold italic opacity-70">
                     Deploy the logic directly to your microcontroller or simulate it in the browser.
                   </p>
                 </div>
                 {project.makecodeUrl && (
                   <div className="pt-10">
                      <a 
                        href={project.makecodeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-yellow-400 text-black px-20 py-7 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] transition-all shadow-2xl hover:bg-white hover:scale-105 active:scale-95 group"
                      >
                        <ExternalLink className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" /> 
                        Launch Mission Control
                      </a>
                   </div>
                 )}
               </div>
            </section>

            <section id="comments" className="space-y-16 pt-20 border-t-2 border-slate-100 scroll-mt-40 pb-64">
               <h2 className="text-4xl font-black text-black uppercase tracking-tight italic">Communications ({comments.length})</h2>
               <form onSubmit={handleAddComment} className="bg-slate-50 p-12 rounded-[3rem] border-4 border-slate-100 shadow-inner">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or share your build log..."
                    className="w-full bg-transparent border-none outline-none text-black placeholder:text-slate-400 min-h-[140px] resize-none text-2xl font-black italic"
                  />
                  <div className="flex justify-end mt-8">
                    <button className="bg-black text-white px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all shadow-2xl active:scale-95">Transmit Message</button>
                  </div>
               </form>
               <div className="space-y-20 mt-20">
                  {comments.map(c => (
                    <div key={c.id} className="flex space-x-10 group">
                       <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center font-black text-white border-2 border-slate-200 overflow-hidden shadow-md group-hover:rotate-6 transition-transform p-2">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${c.author}&backgroundColor=${AVATAR_BG}`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="flex-grow space-y-6">
                          <div className="flex items-center justify-between">
                             <span className="font-black text-black text-2xl uppercase tracking-tight italic">{c.author}</span>
                             <span className="text-[12px] text-slate-900 font-black uppercase tracking-widest opacity-60">{c.timestamp}</span>
                          </div>
                          <p className="text-black text-2xl leading-relaxed font-black italic">"{c.text}"</p>
                          <div className="flex items-center space-x-8 pt-4">
                            <button onClick={() => handleLikeComment(c.id)} className="flex items-center space-x-3 text-[12px] font-black uppercase text-black hover:text-pink-600 transition-colors">
                               <ThumbsUp className={`w-5 h-5 ${likedComments.has(c.id) ? 'fill-pink-600 text-pink-600' : ''}`} />
                               <span>{c.likes} Appreciation</span>
                            </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </main>

          <aside className="col-span-12 lg:col-span-3 space-y-16">
            <div className="space-y-10 bg-slate-50 p-12 rounded-[4rem] border-4 border-slate-100 shadow-sm">
              <h3 className="text-[14px] font-black text-black uppercase tracking-[0.3em] border-b-4 border-slate-200 pb-8">Mission Tags</h3>
              <div className="flex flex-wrap gap-4">
                {['robotics', 'iot', 'automation', 'esp32', 'coding', 'smart home'].map(tag => (
                  <span key={tag} className="px-6 py-3 bg-white text-black text-[12px] font-black rounded-2xl uppercase tracking-widest border-2 border-slate-200 shadow-sm hover:border-black transition-all cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black p-12 rounded-[4rem] shadow-3xl space-y-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-[2000ms]">
                  <Trophy size={200} className="text-white" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-4xl font-black uppercase italic leading-none text-yellow-400">Reward</h4>
                  <p className="text-[14px] font-black text-white leading-relaxed mt-10 uppercase tracking-widest opacity-60 italic">Complete this log to earn your hardware certification.</p>
                  <button className="w-full mt-14 bg-white text-black py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all hover:bg-yellow-400 shadow-2xl active:scale-95">Verify Mission</button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

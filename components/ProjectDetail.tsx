
import React, { useState, useEffect } from 'react';
import { Project, Comment, User, InteractiveProject } from '../types';
import { 
  ArrowLeft, Cpu, Code, BookOpen, MessageSquare, 
  ExternalLink, ThumbsUp, Eye, Zap, 
  Clock, Bookmark, Edit, Trash2, Play
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
    { id: 'story', label: 'Protocol' },
    { id: 'code', label: 'Code' },
    { id: 'comments', label: `Comments (${comments.length})` },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div className="min-h-screen bg-[#0a0118] text-white">
      <div className="border-b border-white/10 bg-[#0a0118]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between h-16">
          <button onClick={onBack} className="flex items-center text-white hover:text-yellow-400 transition-colors text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          {user.role === 'admin' && (
            <div className="flex items-center space-x-2">
              <button onClick={onEdit} className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30">Edit</button>
              <button onClick={() => confirm("Delete?") && onDelete?.()} className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase bg-red-600/20 text-red-400 border border-red-500/30">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 bg-white rounded-[4rem] text-black mt-12 shadow-2xl relative border-t-8 border-yellow-400 pb-40">
        <div className="grid grid-cols-12 gap-10 p-2 md:p-10">
          <aside className="col-span-12 lg:col-span-2 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => scrollTo(item.id)} className={`block w-full text-left px-4 py-3 text-[13px] font-black border-l-4 transition-all ${activeSection === item.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                    {item.label}
                  </button>
                ))}
              </nav>
              <button onClick={onToggleLike} className={`w-full py-4 rounded-xl border-2 flex items-center justify-center space-x-3 transition-all ${project.isLikedByUser ? 'bg-blue-600/10 border-blue-500 text-blue-600' : 'border-slate-100 text-black hover:border-black'}`}>
                <ThumbsUp size={20} className={project.isLikedByUser ? 'fill-blue-600' : ''} />
                <span className="font-black">{project.likes}</span>
              </button>
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-10 space-y-20">
            <div id="overview" className="space-y-10 scroll-mt-32">
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{project.title}</h1>
              <p className="text-2xl font-black italic border-l-[12px] border-yellow-400 pl-8 bg-slate-50 py-10 rounded-r-3xl">"{project.description}"</p>
              
              <div className="flex flex-wrap gap-10 py-6 border-y-2 border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-black uppercase text-orange-600 tracking-widest"><Zap size={18} /><span>{project.difficulty}</span></div>
                <div className="flex items-center space-x-2 text-xs font-black uppercase text-black tracking-widest"><Clock size={18} /><span>{project.duration}</span></div>
              </div>

              <div className="rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl bg-slate-100">
                <img src={project.thumbnail} className="w-full object-cover aspect-video" alt={project.title} />
              </div>
            </div>

            <section id="hardware" className="space-y-10 pt-10 scroll-mt-32">
              <h2 className="text-4xl font-black uppercase italic">Hardware Arsenal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(project.hardware || []).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 flex items-center space-x-8">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden p-3 shadow-inner"><img src={item.image} className="w-full h-full object-contain" /></div>
                    <div>
                       <p className="text-xl font-black uppercase tracking-tight">{item.name}</p>
                       {item.link && <a href={item.link} target="_blank" className="text-[10px] font-black uppercase text-blue-600 hover:underline">View Specs</a>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="story" className="space-y-20 pt-10 scroll-mt-32">
              <h2 className="text-4xl font-black uppercase italic">Protocol Instructions</h2>
              <div className="space-y-32">
                {(project.steps || []).map((step, idx) => (
                  <div key={idx} className="space-y-8 border-l-4 border-slate-100 pl-10 relative">
                    <div className="absolute -left-5 top-0 w-10 h-10 bg-black text-yellow-400 flex items-center justify-center rounded-xl font-black italic shadow-lg">{idx + 1}</div>
                    <h3 className="text-3xl font-black uppercase italic">{step.title}</h3>
                    <p className="text-xl font-bold leading-relaxed">{step.content}</p>
                    
                    {/* VIDEO EMBED RENDERER */}
                    {getYoutubeEmbedUrl(step.youtubeUrl) && (
                      <div className="rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-xl aspect-video mt-8">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={getYoutubeEmbedUrl(step.youtubeUrl)!} 
                          title={step.title} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="code" className="pt-10 scroll-mt-32">
               <div className="bg-black text-white p-12 md:p-20 rounded-[4rem] text-center shadow-3xl relative overflow-hidden">
                  <div className="relative z-10 space-y-8">
                    <Code size={64} className="mx-auto text-yellow-400" />
                    <h3 className="text-3xl font-black uppercase italic">Deployment Module</h3>
                    {project.makecodeUrl && (
                      <a href={project.makecodeUrl} target="_blank" className="inline-flex items-center px-12 py-5 bg-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">
                        Launch MakeCode Control <ExternalLink className="ml-3" size={20} />
                      </a>
                    )}
                  </div>
               </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

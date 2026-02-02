
import React, { useState } from 'react';
import { ShieldCheck, Check, X, ClipboardList, Layout as LayoutIcon, MessageSquare, AlertCircle } from 'lucide-react';
import { Project, CommunityPost, User as UserType } from '../types';

interface SubmissionQueueProps {
  pendingProjects: Project[];
  pendingPosts: CommunityPost[];
  onApproveProject: (id: string) => void;
  onRejectProject: (id: string) => void;
  onApprovePost: (id: string) => void;
  onRejectPost: (id: string) => void;
  user: UserType;
}

const SubmissionQueue: React.FC<SubmissionQueueProps> = ({ pendingProjects, pendingPosts, onApproveProject, onRejectProject, onApprovePost, onRejectPost, user }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'discussions'>('projects');
  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen pb-40 animate-in fade-in duration-700">
      <div className="bg-slate-900/60 backdrop-blur-3xl border-b border-white/10 pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-3 mb-6 bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full">
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-yellow-400" /> : <ClipboardList className="w-4 h-4 text-yellow-400" />}
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{isAdmin ? 'MODERATION CONTROL' : 'MY PENDING MISSIONS'}</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                {isAdmin ? 'MISSION QUEUE' : 'SUBMISSION STATUS'}
              </h1>
            </div>
            
            <div className="flex space-x-4 bg-black/40 p-2 rounded-2xl border border-white/10">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-white text-black shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                <LayoutIcon className="w-4 h-4" /> <span>Projects ({pendingProjects.length})</span>
              </button>
              <button 
                onClick={() => setActiveTab('discussions')}
                className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'discussions' ? 'bg-white text-black shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" /> <span>Discussions ({pendingPosts.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {activeTab === 'projects' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pendingProjects.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-white/5 border-4 border-dashed border-white/10 rounded-[4rem]">
                <p className="text-white/20 font-black text-3xl uppercase italic tracking-widest">No pending projects</p>
              </div>
            ) : (
              pendingProjects.map(p => (
                <div key={p.id} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col relative">
                  {/* FLAG ALERT */}
                  {p.isFlagged && isAdmin && (
                    <div className="absolute top-4 right-4 z-20 bg-red-600 text-white p-3 rounded-full shadow-xl animate-pulse flex items-center space-x-2 group">
                       <AlertCircle className="w-6 h-6" />
                       <span className="hidden group-hover:block text-[10px] font-black uppercase pr-2">Moderate Content!</span>
                    </div>
                  )}
                  <div className="relative h-56 bg-slate-100">
                    <img src={p.thumbnail} className="w-full h-full object-cover" alt={p.title} />
                  </div>
                  <div className="p-10 flex-grow">
                    <h3 className="text-2xl font-black text-black uppercase italic mb-4">{p.title}</h3>
                    <p className="text-slate-600 font-bold text-sm italic line-clamp-2">"{p.description}"</p>
                  </div>
                  {isAdmin && (
                    <div className="flex p-6 border-t border-slate-100 space-x-4">
                      <button onClick={() => onApproveProject(p.id)} className="flex-1 bg-green-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 flex items-center justify-center">
                        <Check className="w-4 h-4 mr-2" /> Authorize
                      </button>
                      <button onClick={() => onRejectProject(p.id)} className="flex-1 bg-red-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 flex items-center justify-center">
                        <X className="w-4 h-4 mr-2" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-10">
            {pendingPosts.length === 0 ? (
               <div className="py-40 text-center bg-white/5 border-4 border-dashed border-white/10 rounded-[4rem]">
                 <p className="text-white/20 font-black text-3xl uppercase italic tracking-widest">No pending discussions</p>
               </div>
            ) : (
              pendingPosts.map(post => (
                <div key={post.id} className="bg-white rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 shadow-2xl relative">
                  {/* FLAG ALERT */}
                  {post.isFlagged && isAdmin && (
                    <div className="absolute top-10 right-10 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3">
                       <AlertCircle className="w-6 h-6" />
                       <span className="text-[12px] font-black uppercase">Blocked Keywords Detected</span>
                    </div>
                  )}
                  <div className="w-full md:w-48 h-48 bg-slate-50 rounded-[2rem] flex-shrink-0 overflow-hidden border-2 border-slate-100">
                     {post.imageUrl ? (
                       <img src={post.imageUrl} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-200"><MessageSquare size={64} /></div>
                     )}
                  </div>
                  <div className="flex-grow">
                     <h3 className="text-3xl font-black text-black uppercase italic mb-4">{post.title}</h3>
                     <p className="text-slate-600 font-bold italic border-l-4 border-slate-200 pl-6 mb-8">"{post.description}"</p>
                     
                     {isAdmin && (
                       <div className="flex space-x-4">
                          <button onClick={() => onApprovePost(post.id)} className="bg-green-500 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center">
                             <Check className="w-4 h-4 mr-2" /> Approve
                          </button>
                          <button onClick={() => onRejectPost(post.id)} className="bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center">
                             <X className="w-4 h-4 mr-2" /> Reject
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionQueue;

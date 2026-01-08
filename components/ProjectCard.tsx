
import React from 'react';
import { InteractiveProject } from '../types';
import { Eye, Heart, Clock, MessageSquare } from 'lucide-react';
import { AVATAR_BG } from '../constants';

interface ProjectCardProps {
  project: InteractiveProject;
  onClick: (id: string) => void;
  onToggleLike: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onToggleLike }) => {
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-[#dcfce7] text-[#166534]';
      case 'Intermediate': return 'bg-[#dbeafe] text-[#1e40af]';
      case 'Advanced': return 'bg-[#f3e8ff] text-[#6b21a8]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(project.id);
  };

  return (
    <div 
      className="bg-white rounded-[2.5rem] shadow-2xl border-none overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all group cursor-pointer flex flex-col h-full transform hover:-translate-y-2 relative"
      onClick={() => onClick(project.id)}
    >
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getDifficultyStyles(project.difficulty)} shadow-sm`}>
            {project.difficulty}
          </span>
          <span className="bg-[#f8fafc] px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#334155] shadow-sm">
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="font-black text-black text-3xl mb-4 leading-none group-hover:text-[#6b1e8e] transition-colors uppercase tracking-tighter line-clamp-2">
          {project.title}
        </h3>
        <p className="text-black text-base mb-8 line-clamp-3 leading-relaxed font-black italic">
          "{project.description}"
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-auto">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#6b1e8e] flex-shrink-0 flex items-center justify-center text-white shadow-lg border-2 border-white overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${project.author}&backgroundColor=${AVATAR_BG}`} 
                alt={project.author} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col min-w-0">
               <p className="text-[9px] font-black text-black uppercase tracking-widest leading-none mb-1 opacity-70">Created By</p>
               <p className="text-[13px] font-black text-black uppercase tracking-tight truncate">
                 {project.author}
               </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-black flex-shrink-0">
            <div className="flex items-center space-x-1">
               <Eye className="w-4 h-4" /> 
               <span className="text-[11px] font-black">{project.views}</span>
            </div>
            <div className="flex items-center space-x-1">
               <MessageSquare className="w-4 h-4" /> 
               <span className="text-[11px] font-black">{project.comments.length}</span>
            </div>
            <button 
              onClick={handleLikeClick}
              className={`flex items-center space-x-1 transition-all hover:scale-110 active:scale-90 ${project.isLikedByUser ? 'text-pink-600' : 'hover:text-pink-500'}`}
            >
              <Heart className={`w-4 h-4 ${project.isLikedByUser ? 'fill-pink-600' : ''}`} /> 
              <span className="text-[11px] font-black">{project.likes}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-8 py-5 flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-black text-black border-t border-slate-200">
        <span className="flex items-center font-black">
           <Clock className="w-4 h-4 mr-2" /> {project.duration}
        </span>
        <div className="bg-white px-5 py-2 rounded-xl border-2 border-slate-200 shadow-sm text-[10px] font-black text-black uppercase tracking-widest">
           {project.hardware.length} Hardware
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

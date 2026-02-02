
import React from 'react';
import { InteractiveProject } from '../types';
import { Eye, Heart, Clock, MessageSquare, ThumbsUp, Bookmark } from 'lucide-react';
import { AVATAR_BG } from '../constants';

interface ProjectCardProps {
  project: InteractiveProject;
  onClick: (id: string) => void;
  onToggleLike: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onToggleLike }) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(project.id);
  };

  return (
    <div 
      className="bg-[#1a1f2e] rounded-xl shadow-2xl border border-white/5 overflow-hidden transition-all group cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
      onClick={() => onClick(project.id)}
    >
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
        />
        <div className="absolute top-4 left-4">
           <span className="bg-yellow-400 text-black px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-lg">
             {project.category}
           </span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-bold text-white text-xl mb-3 leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2">
          {project.title}
        </h3>
        
        <div className="flex items-center space-x-2 mb-6">
           <span className="text-[11px] font-medium text-slate-400 truncate">
             {project.author}
           </span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <div className="flex items-center space-x-4 text-slate-400">
            <button 
              onClick={handleLikeClick}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all ${project.isLikedByUser ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : ''}`}
            >
               <ThumbsUp className="w-4 h-4" /> 
               <span className="text-[11px] font-bold">{project.likes}</span>
            </button>
            <div className="flex items-center space-x-1.5">
               <Eye className="w-4 h-4" /> 
               <span className="text-[11px] font-bold">{project.views}</span>
            </div>
          </div>
          
          <button className="p-2 text-slate-400 hover:text-white transition-colors border border-white/10 rounded-lg">
             <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

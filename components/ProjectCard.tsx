
import React from 'react';
import { InteractiveProject } from '../types';
import { Eye, Clock, ThumbsUp, Bookmark } from 'lucide-react';

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
      className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full"
      onClick={() => onClick(project.id)}
    >
      <div className="relative h-52 overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-4 left-4">
           <span className="bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">
             {project.category}
           </span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {project.title}
        </h3>
        
        <p className="text-slate-500 text-xs font-medium mb-6">by <span className="text-slate-900 font-bold">{project.author}</span></p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center space-x-4 text-slate-400">
            <button 
              onClick={handleLikeClick}
              className={`flex items-center space-x-1.5 transition-colors ${project.isLikedByUser ? 'text-blue-600' : 'hover:text-slate-900'}`}
            >
               <ThumbsUp className={`w-4 h-4 ${project.isLikedByUser ? 'fill-current' : ''}`} /> 
               <span className="text-xs font-bold">{project.likes}</span>
            </button>
            <div className="flex items-center space-x-1.5">
               <Eye className="w-4 h-4" /> 
               <span className="text-xs font-bold">{project.views}</span>
            </div>
          </div>
          <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
             <Clock className="w-3 h-3 mr-1" />
             {project.duration}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

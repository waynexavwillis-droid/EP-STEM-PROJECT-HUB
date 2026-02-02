
import React from 'react';
import { InteractiveProject } from '../types';
import { Eye, Clock, ThumbsUp, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: InteractiveProject;
  index?: number;
  onClick: (id: string) => void;
  onToggleLike: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, onClick, onToggleLike }) => {
  // Playful colors from Image 2 aesthetic
  const pastelColors = [
    { bg: 'bg-[#e2e2ff]', text: 'text-blue-700', border: 'border-blue-100' },
    { bg: 'bg-[#bae6fd]', text: 'text-sky-700', border: 'border-sky-100' },
    { bg: 'bg-[#fecdd3]', text: 'text-rose-700', border: 'border-rose-100' },
    { bg: 'bg-[#bbf7d0]', text: 'text-emerald-700', border: 'border-emerald-100' }
  ];
  
  const colorSet = pastelColors[index % pastelColors.length];

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(project.id);
  };

  return (
    <div 
      className={`relative rounded-[3rem] p-6 transition-all duration-300 group cursor-pointer flex flex-col h-full ${colorSet.bg} ${colorSet.border} border-2 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}
      onClick={() => onClick(project.id)}
    >
      <div className="relative h-48 mb-6 overflow-hidden rounded-[2rem] bg-white border-4 border-white shadow-sm">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4">
           <button 
            onClick={handleLikeClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur shadow-md transition-all active:scale-90 ${project.isLikedByUser ? 'text-rose-500' : 'text-slate-400'}`}
           >
             <ThumbsUp className={`w-4 h-4 ${project.isLikedByUser ? 'fill-current' : ''}`} />
           </button>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col">
        <div className="flex items-center space-x-2 mb-3">
           <span className="bg-white/60 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600 border border-white">
             {project.category}
           </span>
        </div>
        
        <h3 className="font-black text-slate-900 text-2xl mb-4 leading-[1.1] uppercase italic tracking-tighter line-clamp-2">
          {project.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5">
           <div className="flex items-center space-x-3 text-slate-500 font-bold text-xs">
              <span className="flex items-center bg-white/40 px-3 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {project.duration}
              </span>
           </div>
           
           <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
           </div>
        </div>
      </div>
      
      {/* Playful Blob Graphic Overlay (Subtle) */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
    </div>
  );
};

export default ProjectCard;

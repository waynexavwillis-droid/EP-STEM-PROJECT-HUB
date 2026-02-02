
import React, { useState } from 'react';
import { Project, LessonStep, Hardware, User } from '../types';
import { 
  ArrowLeft, Plus, Trash2, CheckCircle2, Youtube, 
  Code, Info, AlertTriangle
} from 'lucide-react';
import { THEMES } from '../constants';
import { checkContentModeration } from '../utils/moderation';

interface ProjectEditorProps {
  onSave: (project: Project) => void;
  onCancel: () => void;
  initialProject?: Project;
  user?: User; // Pass user to control theme options
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ onSave, onCancel, initialProject, user }) => {
  const isAdmin = user?.role === 'admin';
  const [title, setTitle] = useState(initialProject?.title || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [thumbnail, setThumbnail] = useState(initialProject?.thumbnail || '');
  const [difficulty, setDifficulty] = useState<Project['difficulty']>(initialProject?.difficulty || 'Beginner');
  const [category, setCategory] = useState<Project['category']>(initialProject?.category || 'IoT');
  // If admin, default to Sample. If student, hide Sample.
  const [theme, setTheme] = useState<Project['theme']>(initialProject?.theme || (isAdmin ? 'Sample' : 'General'));
  const [duration, setDuration] = useState(initialProject?.duration || '1 Hour');
  const [mainMakecodeUrl, setMainMakecodeUrl] = useState(initialProject?.makecodeUrl || '');
  
  const [steps, setSteps] = useState<LessonStep[]>(initialProject?.steps || [
    { title: 'Project Overview', content: 'Describe what your project does here...', media: [] }
  ]);
  
  const [hardware, setHardware] = useState<Hardware[]>(initialProject?.hardware || [
    { name: 'Microcontroller', link: '', image: 'https://picsum.photos/id/1/100/100' }
  ]);

  const addStep = () => setSteps([...steps, { title: 'New Step', content: '', media: [] }]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, field: keyof LessonStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addHardware = () => setHardware([...hardware, { name: '', link: '', image: 'https://picsum.photos/id/1/100/100' }]);
  const removeHardware = (index: number) => setHardware(hardware.filter((_, i) => i !== index));
  const updateHardware = (index: number, field: keyof Hardware, value: any) => {
    const newHardware = [...hardware];
    newHardware[index] = { ...newHardware[index], [field]: value };
    setHardware(newHardware);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check moderation
    let isFlagged = checkContentModeration(title) || checkContentModeration(description);
    steps.forEach(s => {
      if (checkContentModeration(s.title) || checkContentModeration(s.content) || checkContentModeration(s.youtubeUrl || '')) {
        isFlagged = true;
      }
    });

    const newProject: Project = {
      id: initialProject?.id || Date.now().toString(),
      title: title || 'Untitled Project',
      description,
      author: initialProject?.author || user?.username || 'STEM Academy User',
      difficulty,
      category,
      // Admin projects are strictly Sample theme
      theme: isAdmin ? 'Sample' : theme,
      thumbnail,
      views: initialProject?.views || 0,
      likes: initialProject?.likes || 0,
      duration,
      hardware,
      software: [],
      steps,
      comments: initialProject?.comments || [],
      publishedAt: initialProject?.publishedAt || new Date().toISOString().split('T')[0],
      makecodeUrl: mainMakecodeUrl,
      status: initialProject?.status || (isAdmin ? 'approved' : 'pending'),
      isFlagged
    };
    onSave(newProject);
  };

  const inputClasses = "w-full bg-slate-100 border-2 border-slate-200 focus:border-black focus:bg-white rounded-2xl p-4 text-sm font-black text-black transition-all outline-none h-[58px] placeholder:text-slate-500";
  const labelClasses = "block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1";

  // Filter themes for non-admins
  const visibleThemes = THEMES.filter(t => isAdmin || t !== 'Sample');

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
      <div className="flex items-center justify-between mb-16 bg-white p-6 rounded-[2rem] border-4 border-black shadow-[0_20px_0_rgba(0,0,0,1)]">
        <button 
          onClick={onCancel} 
          className="flex items-center bg-black text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#6b1e8e] transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> BACK TO HUB
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-yellow-400 text-black px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" /> SUBMIT MISSION
        </button>
      </div>

      <div className="space-y-12">
        <section className="bg-white rounded-[3rem] p-10 md:p-14 border-4 border-slate-200 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 translate-x-16 -translate-y-16" />
           <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-10 border-b-4 border-slate-100 pb-6 flex items-center">
             <Info className="w-8 h-8 mr-4 text-blue-600" /> MISSION IDENTITY
           </h2>
           
           <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className={labelClasses}>Mission Name</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="ENTER MISSION NAME" 
                      className={`${inputClasses} !bg-white !border-slate-300 text-xl !h-[72px] uppercase italic`} 
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Cover Image URL</label>
                    <input type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className={inputClasses} placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Objective / Briefing</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Briefly explain the goal of this mission..." 
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-black focus:bg-white rounded-[2rem] p-8 text-lg font-bold text-black min-h-[195px] placeholder:text-slate-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className={labelClasses}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as any)} className={inputClasses}>
                    {['IoT', 'Robotics', 'AI', 'Electronics', '3D Printing'].map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className={inputClasses}>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Theme</label>
                  {isAdmin ? (
                    <div className={`${inputClasses} bg-slate-50 flex items-center text-slate-400 cursor-not-allowed`}>Sample Row (Auto-Assigned)</div>
                  ) : (
                    <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className={inputClasses}>
                      {visibleThemes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className={labelClasses}>Duration</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClasses} placeholder="e.g. 1.5 Hours" />
                </div>
              </div>
           </div>
        </section>

        {/* --- PROTOCOL DETAILS --- */}
        <section className="bg-white rounded-[3rem] p-10 md:p-14 border-4 border-slate-200 shadow-2xl">
           <div className="flex items-center justify-between mb-10 pb-6 border-b-4 border-slate-100">
              <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic">Protocol Details</h2>
              <button type="button" onClick={addStep} className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Add Step
              </button>
           </div>
           
           <div className="space-y-12">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 relative group hover:border-black transition-all">
                  <button type="button" onClick={() => removeStep(idx)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 className="w-6 h-6" />
                  </button>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-black text-yellow-400 flex items-center justify-center rounded-xl font-black text-xl italic">{idx + 1}</div>
                      <input 
                        type="text" 
                        value={step.title} 
                        onChange={(e) => updateStep(idx, 'title', e.target.value)} 
                        placeholder={`Phase ${idx + 1} Title`} 
                        className={`${inputClasses} bg-white border-slate-200 uppercase italic !h-[64px]`} 
                      />
                    </div>
                    <textarea 
                      value={step.content} 
                      onChange={(e) => updateStep(idx, 'content', e.target.value)} 
                      placeholder="Describe the instructions for this phase..." 
                      className="w-full bg-white border-2 border-slate-200 focus:border-black rounded-2xl p-6 text-sm font-bold text-black min-h-[140px]" 
                    />
                    
                    <div className="relative">
                      <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                      <input 
                        type="url" 
                        value={step.youtubeUrl || ''} 
                        onChange={(e) => updateStep(idx, 'youtubeUrl', e.target.value)} 
                        placeholder="YouTube Video URL (Optional)" 
                        className={`${inputClasses} pl-12 bg-white`} 
                      />
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* --- HARDWARE ARSENAL --- */}
        <section className="bg-white rounded-[3rem] p-10 md:p-14 border-4 border-slate-200 shadow-2xl">
           <div className="flex items-center justify-between mb-10 pb-6 border-b-4 border-slate-100">
              <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic">Mission Arsenal</h2>
              <button type="button" onClick={addHardware} className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Add Component
              </button>
           </div>
           
           <div className="space-y-4">
              {hardware.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => updateHardware(idx, 'name', e.target.value)} 
                    placeholder="Component Name" 
                    className="flex-grow bg-white border-2 border-slate-200 focus:border-black rounded-xl p-4 text-xs font-black uppercase text-black" 
                  />
                  <input 
                    type="url" 
                    value={item.link} 
                    onChange={(e) => updateHardware(idx, 'link', e.target.value)} 
                    placeholder="Doc Link" 
                    className="flex-grow bg-white border-2 border-slate-200 focus:border-black rounded-xl p-4 text-xs font-black text-black" 
                  />
                  <button type="button" onClick={() => removeHardware(idx)} className="p-3 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectEditor;

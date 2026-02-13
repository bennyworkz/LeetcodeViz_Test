import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers, Code2, Trophy, Star, Building2, LayoutGrid } from 'lucide-react';
import { modules } from '../problemRegistry';

// Added React.FC type to fix key prop validation error and explicitly handle component props
const ModuleCard: React.FC<{ module: any, featured?: boolean }> = ({ module, featured = false }) => (
    <div className={`bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col ${featured ? 'ring-2 ring-orange-500/20' : ''}`}>
        {/* Card Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
            <div className="flex gap-6">
                <div className={`${featured ? 'bg-orange-600 text-white' : 'bg-blue-50 text-blue-600'} w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm`}>
                    {featured ? <Building2 size={40} /> : <Layers size={40} />}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {featured && <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Company Specific</span>}
                        <h2 className="text-2xl font-black text-slate-900">{module.title}</h2>
                    </div>
                    <p className="text-slate-500 text-sm max-w-xl leading-relaxed">{module.description}</p>
                </div>
            </div>
            <div className={`${featured ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'} text-xs font-black px-4 py-2 rounded-full border whitespace-nowrap`}>
                {module.problems.length} Challenges
            </div>
        </div>

        {/* Problem List */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
            {module.problems.map((problem: any) => (
                <Link 
                    key={problem.id} 
                    to={`/problem/${problem.id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-50 px-3 -mx-3 rounded-xl transition-colors group border-b border-slate-50 last:border-0"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <span className={`
                            text-[8px] font-black w-14 py-1 rounded-full border text-center uppercase tracking-tighter
                            ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
                            ${problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                            ${problem.difficulty === 'Hard' ? 'bg-rose-50 text-rose-600 border-rose-200' : ''}
                        `}>
                            {problem.difficulty}
                        </span>
                        <span className="text-slate-700 font-bold group-hover:text-blue-600 transition-colors truncate text-sm">
                            <span className="text-slate-300 font-mono mr-1">{problem.number}.</span>
                            {problem.title}
                        </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </Link>
            ))}
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 mt-auto flex justify-center">
            <Link 
                to={`/problem/${module.problems[0]?.id}`}
                className={`px-10 py-3 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center gap-2 ${featured ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'}`}
            >
                Start Module <ChevronRight size={16} />
            </Link>
        </div>
    </div>
);

const Welcome = () => {
  const amazonModule = modules.find(m => m.id === 'amazon-favorites');
  const otherModules = modules.filter(m => m.id !== 'amazon-favorites');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
               <div className="bg-gradient-to-br from-slate-800 to-black p-2 rounded-lg shadow-sm">
                 <Code2 size={20} className="text-white" />
               </div>
               <span className="font-bold text-xl tracking-tight text-slate-800">LeetCode<span className="text-blue-600">Viz</span></span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest border-r pr-6 hidden sm:block">Interview Ready</span>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-14">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Master Technical Interviews</h1>
            <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
              Interactive, step-by-step visualizations for the world's most common coding challenges. Deep dive into logic, not just syntax.
            </p>
        </div>

        {/* Amazon Section - CAUTIOUS PREP */}
        {amazonModule && (
            <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <Building2 className="text-orange-600" size={24} />
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Targeting: <span className="text-orange-600">Amazon</span></h2>
                </div>
                <div className="grid grid-cols-1">
                    <ModuleCard module={amazonModule} featured />
                </div>
            </div>
        )}

        {/* LeetCode 75 Section */}
        <div>
            <div className="flex items-center gap-3 mb-6">
                <LayoutGrid className="text-blue-600" size={24} />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Collection: <span className="text-blue-600">Blind 75 / LC 75</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {otherModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
            ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
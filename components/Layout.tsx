
import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Menu, Github, Code2, Folder, ChevronLeft, ChevronDown, ChevronRight, Building2 } from 'lucide-react';
import { modules } from '../problemRegistry';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Track which modules are expanded
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'amazon-favorites': true,
    'blind-75-array': true
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-slate-900 text-slate-300 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800">
           <Link to="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors mb-4 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
           </Link>
           
           <div className="flex items-center gap-3 px-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Code2 size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">LeetCode Viz</h1>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Algorithm Studio</p>
            </div>
          </div>
        </div>

        {/* Scrollable Problem List */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
          {modules.map((module) => {
            const isExpanded = expandedModules[module.id];
            const isAmazon = module.id === 'amazon-favorites';

            return (
              <div key={module.id} className="mb-1">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors border-l-4 ${isExpanded ? (isAmazon ? 'border-orange-500 bg-slate-800/30' : 'border-blue-500 bg-slate-800/30') : 'border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    {isAmazon ? <Building2 size={14} className="text-orange-400" /> : <Folder size={14} className="text-blue-400" />}
                    <span className={`text-[11px] font-black uppercase tracking-wider ${isExpanded ? 'text-white' : 'text-slate-500'}`}>
                      {module.title}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                </button>

                {isExpanded && (
                  <nav className="space-y-0.5 px-3 py-2 animate-in slide-in-from-top-1 duration-200">
                    {module.subModules && module.subModules.length > 0 ? (
                      // Render sub-modules
                      module.subModules.map((subModule) => (
                        <div key={subModule.id} className="mb-4">
                          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                            {subModule.title}
                          </div>
                          {subModule.problems.map((problem) => (
                            <NavLink
                              key={problem.id}
                              to={`/problem/${problem.id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) => `
                                group flex items-center justify-between px-4 py-2 rounded-lg text-xs font-medium transition-all
                                ${isActive 
                                  ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 shadow-sm' 
                                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'}
                              `}
                            >
                              <span className="truncate mr-2">
                                <span className="opacity-30 mr-2 font-mono">{problem.number}.</span>
                                {problem.title}
                              </span>
                              <span className={`
                                text-[8px] px-1.5 py-0.5 rounded border font-black uppercase tracking-tighter
                                ${problem.difficulty === 'Easy' ? 'border-emerald-900 text-emerald-500 bg-emerald-900/10' : ''}
                                ${problem.difficulty === 'Medium' ? 'border-amber-900 text-amber-500 bg-amber-900/10' : ''}
                                ${problem.difficulty === 'Hard' ? 'border-rose-900 text-rose-500 bg-rose-900/10' : ''}
                              `}>
                                {problem.difficulty}
                              </span>
                            </NavLink>
                          ))}
                        </div>
                      ))
                    ) : (
                      // Render regular problems
                      module.problems.map((problem) => (
                        <NavLink
                          key={problem.id}
                          to={`/problem/${problem.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) => `
                            group flex items-center justify-between px-4 py-2 rounded-lg text-xs font-medium transition-all
                            ${isActive 
                              ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 shadow-sm' 
                              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'}
                          `}
                        >
                          <span className="truncate mr-2">
                            <span className="opacity-30 mr-2 font-mono">{problem.number}.</span>
                            {problem.title}
                          </span>
                          <span className={`
                            text-[8px] px-1.5 py-0.5 rounded border font-black uppercase tracking-tighter
                            ${problem.difficulty === 'Easy' ? 'border-emerald-900 text-emerald-500 bg-emerald-900/10' : ''}
                            ${problem.difficulty === 'Medium' ? 'border-amber-900 text-amber-500 bg-amber-900/10' : ''}
                            ${problem.difficulty === 'Hard' ? 'border-rose-900 text-rose-500 bg-rose-900/10' : ''}
                          `}>
                            {problem.difficulty}
                          </span>
                        </NavLink>
                      ))
                    )}
                  </nav>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 text-xs text-slate-400 hover:text-white transition-all hover:bg-slate-800"
          >
            <Github size={14} />
            <span className="font-bold">Project Repository</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-black text-slate-900 tracking-tight">LeetCode<span className="text-blue-600">Viz</span></span>
          <div className="w-10" />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

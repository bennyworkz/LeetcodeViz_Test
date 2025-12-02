import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Menu, Github, Code2, Folder, ChevronLeft } from 'lucide-react';
import { modules } from '../problemRegistry';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
           {/* Back to Home Link */}
           <Link to="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors mb-4 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Modules
           </Link>
           
           <div className="flex items-center gap-3 px-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Code2 size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">LeetCode Viz</h1>
              <p className="text-xs text-slate-500">Interactive Solutions</p>
            </div>
          </div>
        </div>

        {/* Scrollable Problem List */}
        <div className="flex-1 overflow-y-auto py-4">
          
          {modules.map((module) => (
            <div key={module.id} className="mb-6">
              <div className="px-6 mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                 <Folder size={12} /> {module.title}
              </div>
              <nav className="space-y-1 px-3">
                {module.problems.map((problem) => (
                  <NavLink
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-600/10 text-blue-400' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                    `}
                  >
                    <span className="truncate mr-2">
                      <span className="opacity-50 mr-2 font-mono">{problem.number}.</span>
                      {problem.title}
                    </span>
                    <span className={`
                      text-[10px] px-1.5 py-0.5 rounded border font-mono
                      ${problem.difficulty === 'Easy' ? 'border-green-900 text-green-600 bg-green-900/10' : ''}
                      ${problem.difficulty === 'Medium' ? 'border-amber-900 text-amber-600 bg-amber-900/10' : ''}
                      ${problem.difficulty === 'Hard' ? 'border-red-900 text-red-600 bg-red-900/10' : ''}
                    `}>
                      {problem.difficulty}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Github size={16} />
            <span>View on GitHub</span>
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
          <span className="font-bold text-slate-800">LeetCode Viz</span>
          <div className="w-10" /> {/* Spacer for centering */}
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
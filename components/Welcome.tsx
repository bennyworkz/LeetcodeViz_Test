import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers, Code2, Trophy, Star } from 'lucide-react';
import { modules } from '../problemRegistry';

const Welcome = () => {
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
            <div className="flex items-center">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to LeetCode Visualizer</h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Master algorithms with interactive, step-by-step visualizations. Choose a study plan below to get started.
            </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col">
               {/* Card Header */}
               <div className="p-6 pb-0 flex items-start justify-between">
                  <div className="flex gap-4">
                     <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                        <Layers className="text-blue-600" size={32} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{module.title}</h2>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{module.description}</p>
                     </div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 whitespace-nowrap">
                     {module.problems.length} Problems
                  </div>
               </div>

               {/* Progress / Stats Placeholder */}
               <div className="px-6 py-6">
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                     <span>Progress</span>
                     <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                     <div className="bg-blue-500 h-1.5 rounded-full w-0"></div> 
                  </div>
               </div>

               {/* Problem List */}
               <div className="border-t border-gray-100 flex-1">
                  {module.problems.map((problem) => (
                     <Link 
                       key={problem.id} 
                       to={`/problem/${problem.id}`}
                       className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group border-b border-gray-50 last:border-0"
                     >
                        <div className="flex items-center gap-4 min-w-0">
                           <span className={`
                              text-[10px] font-bold px-2.5 py-1 rounded-full border min-w-[60px] text-center uppercase tracking-wide
                              ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
                              ${problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                              ${problem.difficulty === 'Hard' ? 'bg-rose-50 text-rose-600 border-rose-200' : ''}
                           `}>
                              {problem.difficulty}
                           </span>
                           <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors truncate">
                              <span className="text-slate-400 font-mono mr-2 text-sm">{problem.number}.</span>
                              {problem.title}
                           </span>
                        </div>
                        <div className="pl-4">
                           <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                        </div>
                     </Link>
                  ))}
               </div>
               
               {/* Footer / Start Button */}
               <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                   <Link 
                     to={`/problem/${module.problems[0]?.id}`}
                     className="block w-full text-center bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-lg hover:bg-white hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                   >
                     Start Practicing
                   </Link>
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Welcome;
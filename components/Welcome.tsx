import React from 'react';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { modules } from '../problemRegistry';

const Welcome = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 inline-block">
        <BookOpen size={48} className="text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">
        Welcome to LeetCode Visualizer
      </h1>
      <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
        Select a problem from the sidebar to see an interactive, step-by-step visualization of the solution algorithm. 
        Designed to help you understand the logic behind the code.
      </p>

      <div className="w-full space-y-8">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden text-left">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Layers size={18} className="text-blue-500" />
                    {module.title}
                  </h2>
                  {module.description && <p className="text-xs text-slate-500 mt-1">{module.description}</p>}
                </div>
                <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded">
                  {module.problems.length} Problems
                </span>
             </div>
             
             <div className="divide-y divide-slate-100">
               {module.problems.map((p) => (
                  <Link 
                    key={p.id}
                    to={`/problem/${p.id}`}
                    className="block px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-400 text-sm bg-slate-100 px-2 py-0.5 rounded min-w-[3rem] text-center">
                        {p.number}
                      </span>
                      <div>
                        <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors block">
                          {p.title}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <span className={`
                            text-[10px] uppercase font-bold tracking-wider
                            ${p.difficulty === 'Easy' ? 'text-green-600' : ''}
                            ${p.difficulty === 'Medium' ? 'text-amber-600' : ''}
                            ${p.difficulty === 'Hard' ? 'text-red-600' : ''}
                          `}>
                            {p.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                  </Link>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
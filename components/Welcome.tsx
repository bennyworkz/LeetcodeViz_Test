import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { problems } from '../problemRegistry';

const Welcome = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 inline-block">
        <BookOpen size={48} className="text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">
        Welcome to LeetCode Visualizer
      </h1>
      <p className="text-lg text-slate-600 mb-8 leading-relaxed">
        Select a problem from the sidebar to see an interactive, step-by-step visualization of the solution algorithm. 
        Designed to help you understand the logic behind the code.
      </p>

      {problems.length > 0 && (
        <div className="w-full max-w-md bg-white rounded-xl shadow border border-slate-200 overflow-hidden text-left">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
            Available Problems
          </div>
          <div className="divide-y divide-slate-100">
            {problems.map((p) => (
               <Link 
                 key={p.id}
                 to={`/problem/${p.id}`}
                 className="block px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group"
               >
                 <div>
                   <span className="font-mono text-slate-400 text-sm mr-2">{p.number}</span>
                   <span className="font-medium text-slate-700 group-hover:text-blue-600">{p.title}</span>
                 </div>
                 <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500" />
               </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
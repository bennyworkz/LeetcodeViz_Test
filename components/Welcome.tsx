import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Eye, BookOpen, Zap, ArrowRight, GraduationCap } from 'lucide-react';
import { modules } from '../problemRegistry';

// Added React.FC type to fix key prop validation error and explicitly handle component props
const ModuleCard: React.FC<{ module: any, featured?: boolean }> = ({ module, featured = false }) => {
    // Collect all problems from module and sub-modules
    const allProblems = module.subModules && module.subModules.length > 0
        ? module.subModules.flatMap((subModule: any) => subModule.problems)
        : module.problems;
    
    const totalProblems = allProblems.length;
    const firstProblemId = allProblems[0]?.id;
    const topicCount = module.subModules?.length || 0;

    return (
        <Link 
            to={`/problem/${firstProblemId}`}
            className={`group relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                module.id === 'amazon-favorites'
                    ? 'border-orange-200 hover:border-orange-400 hover:shadow-[0_20px_60px_rgba(251,146,60,0.25)]'
                    : module.id === 'java-fundamentals'
                    ? 'border-red-200 hover:border-red-400 hover:shadow-[0_20px_60px_rgba(239,68,68,0.25)]'
                    : 'border-blue-200 hover:border-blue-400 hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)]'
            }`}
        >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                module.id === 'amazon-favorites'
                    ? 'bg-gradient-to-br from-orange-50/50 to-transparent'
                    : module.id === 'java-fundamentals'
                    ? 'bg-gradient-to-br from-red-50/50 to-transparent'
                    : 'bg-gradient-to-br from-blue-50/50 to-transparent'
            }`}></div>

            {/* Content */}
            <div className="relative">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    {module.id === 'amazon-favorites' ? (
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                            alt="Amazon" 
                            className="h-14 w-auto object-contain"
                        />
                    ) : module.id === 'java-fundamentals' ? (
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="text-white" size={32} />
                        </div>
                    ) : (
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" 
                            alt="LeetCode" 
                            className="h-14 w-auto object-contain"
                        />
                    )}
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black mb-3 text-center ${
                    module.id === 'amazon-favorites' ? 'text-orange-900' 
                    : module.id === 'java-fundamentals' ? 'text-red-900'
                    : 'text-blue-900'
                }`}>
                    {module.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm text-center mb-8 leading-relaxed min-h-[40px]">
                    {module.description}
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-12 mb-8">
                    <div className="text-center">
                        <div className={`text-4xl font-black mb-1 ${
                            module.id === 'amazon-favorites' ? 'text-orange-600'
                            : module.id === 'java-fundamentals' ? 'text-red-600'
                            : 'text-blue-600'
                        }`}>
                            {totalProblems}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {module.id === 'java-fundamentals' ? 'Lessons' : 'Problems'}
                        </div>
                    </div>
                    {topicCount > 0 && (
                        <div className="text-center">
                            <div className={`text-4xl font-black mb-1 ${
                                module.id === 'amazon-favorites' ? 'text-orange-600'
                                : module.id === 'java-fundamentals' ? 'text-red-600'
                                : 'text-blue-600'
                            }`}>
                                {topicCount}
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topics</div>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                    module.id === 'amazon-favorites'
                        ? 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200'
                        : module.id === 'java-fundamentals'
                        ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                }`}>
                    {module.id === 'java-fundamentals' ? 'Start Learning' : 'Start Practicing'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

const Welcome = () => {
  const amazonModule = modules.find(m => m.id === 'amazon-favorites');
  const javaModule = modules.find(m => m.id === 'java-fundamentals');
  const otherModules = modules.filter(m => m.id !== 'amazon-favorites' && m.id !== 'java-fundamentals');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar - matching sidebar theme */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
               <div className="bg-blue-600 p-2.5 rounded-lg shadow-md">
                 <Code2 size={20} className="text-white" />
               </div>
               <div>
                 <span className="font-bold text-lg tracking-tight text-white leading-tight">LeetCode<span className="text-slate-300">Viz</span></span>
                 <p className="text-[9px] uppercase font-black tracking-widest text-slate-500">Algorithm Studio</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest border-r border-slate-700 pr-6 hidden sm:block">Interview Ready</span>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
            {/* Decorative background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-orange-100/40 rounded-full blur-3xl -z-10"></div>
            
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-xl mb-8">
                <Zap size={14} className="text-yellow-400" />
                Algorithm Visualization Platform
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Master Technical<br/>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                    Interviews
                </span>
            </h1>
            
            <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-4 font-medium">
              Interactive, step-by-step visualizations for coding challenges
            </p>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Deep dive into logic, not just syntax
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center items-center gap-8 mt-12 flex-wrap">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg border border-slate-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="text-blue-600" size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-3xl font-black text-slate-900">72+</div>
                        <div className="text-sm text-slate-500 font-semibold">Problems</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg border border-slate-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Code2 className="text-purple-600" size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-3xl font-black text-slate-900">22+</div>
                        <div className="text-sm text-slate-500 font-semibold">Topics</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg border border-slate-200">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Eye className="text-orange-600" size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-3xl font-black text-slate-900">100%</div>
                        <div className="text-sm text-slate-500 font-semibold">Visual</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl group">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                        <Eye className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Visual Learning</h3>
                    <p className="text-slate-600 leading-relaxed">Watch algorithms come alive with step-by-step animations and detailed explanations</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-purple-300 transition-all hover:shadow-xl group">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
                        <BookOpen className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Curated Collections</h3>
                    <p className="text-slate-600 leading-relaxed">Organized by company and topic to match your specific interview preparation needs</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-orange-300 transition-all hover:shadow-xl group">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-200">
                        <Zap className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Interactive Practice</h3>
                    <p className="text-slate-600 leading-relaxed">Control the pace and explore different scenarios at your own speed</p>
                </div>
            </div>
        </div>

        {/* Module Cards Section */}
        <div className="mb-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Path</h2>
                <p className="text-slate-600 text-lg">Select a collection to start your learning journey</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {javaModule && <ModuleCard module={javaModule} />}
                {amazonModule && <ModuleCard module={amazonModule} />}
                {otherModules[0] && <ModuleCard module={otherModules[0]} />}
            </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 border-t border-slate-200 mt-20">
            <p className="text-slate-500">
                Built with <span className="text-red-500">❤️</span> for developers preparing for technical interviews
            </p>
        </div>
      </main>
    </div>
  );
};

export default Welcome;

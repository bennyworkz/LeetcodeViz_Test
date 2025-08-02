import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Sigma, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  FunctionSquare, DivideSquare, Scissors, Hexagon, CheckCircle2
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-rose-400 shadow-lg shadow-rose-900/20 scale-105' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} 
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden text-[10px]">{label.split(' ')[0]}</span>
  </button>
);

const SectionTitle = ({ icon, title, colorClass }) => (
  <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter mb-8 ${colorClass}`}>
    {icon} {title}
  </div>
);

const QuestionCard = ({ qNum, badge = "Practice", question, options = [], solution, ans = "" }) => {
  const [showSol, setShowSol] = useState(false);
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col h-full">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>{qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <div className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 overflow-x-auto">
        {question}
      </div>
      
      {options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
                showSol && ans && opt.startsWith(ans) 
                  ? 'bg-orange-50 border-orange-300 text-orange-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-orange-200' : 'bg-slate-100'
              }`}>
                {opt.charAt(0)}
              </span>
              {opt.slice(2)}
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <button 
          onClick={() => setShowSol(!showSol)} 
          className="flex items-center gap-2 text-sm font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest transition-colors outline-none"
        >
          {showSol ? (
            <><EyeOff size={16}/> Hide Solution</>
          ) : (
            <><Eye size={16}/> Show Solution</>
          )}
        </button>
        
        {showSol && (
          <div className="mt-5 bg-[#0f172a] text-white p-5 rounded-2xl text-sm leading-relaxed animate-in slide-in-from-top-2 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-orange-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
              <BookOpen size={14} /> Step-by-Step Notebook
            </div>
            
            <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
              {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                const trimmedLine = line.trim();
                
                // Add vertical spacing for empty lines to structure the paragraph
                if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                
                const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔');
                const isFinalLine = idx === solution.split('\n').length - 1;

                let lineClass = "text-slate-300";
                let prefix = null;

                // Indent and highlight equations
                if (isEquation) {
                   lineClass = "text-emerald-300 font-bold ml-4";
                   prefix = <span className="mr-3 text-emerald-500/70 select-none">↳</span>;
                } 
                // Highlight final conclusion line
                else if (isFinalLine && !trimmedLine.endsWith('?')) {
                   lineClass = "text-orange-300 font-bold bg-orange-500/10 px-3 py-1.5 rounded-lg inline-block w-max border border-orange-500/20";
                }

                return (
                  <div key={idx} className={`flex items-start ${lineClass}`}>
                    {prefix}
                    <span className="flex-1">{line}</span>
                  </div>
                );
              }) : solution}
            </div>
            
            {ans && (
              <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center gap-2">
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} /> Correct Option: {ans}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function SurdsAndIndicesNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#fffbf5] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-rose-500 to-orange-600">
              <Hexagon className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Surds & Indices
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-rose-800 bg-rose-100 border border-rose-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Core Concepts" />
            <TabButton active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} icon={<Layers size={16}/>} label="Master Rules" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Algebraic Formulas" />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={<Zap size={16}/>} label="Exam Patterns" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="Definitions & Types" colorClass="text-rose-600" />
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Indices Definition */}
              <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl relative overflow-hidden">
                <h3 className="font-black text-xl text-orange-800 mb-3">What are Indices?</h3>
                <p className="text-slate-700 text-sm mb-3">
                  Indices (plural for index) refers to the power to which a number is raised. The index of a number shows the number of times a figure is used in multiplication, or it shows that a figure is recurrently multiplied by itself.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-sm font-mono text-orange-900 border border-orange-100 flex items-center justify-center gap-4">
                  <span className="text-3xl font-black">a<sup>m</sup></span>
                  <div className="text-xs text-slate-500">
                    <strong>a</strong> = Base Number<br/>
                    <strong>m</strong> = Index / Power
                  </div>
                </div>
              </div>

              {/* Surds Definition */}
              <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl relative overflow-hidden">
                <h3 className="font-black text-xl text-rose-800 mb-3">What are Surds?</h3>
                <p className="text-slate-700 text-sm mb-3">
                  Irrational numbers which contain the radical sign (√) are called surds. They are numbers which can be expressed in the form √p, where p is a natural number but <strong>not a perfect square</strong>.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-sm font-mono text-rose-900 border border-rose-100 space-y-2">
                  <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500 shrink-0" size={16}/> <span><strong>√3</strong> cannot be simplified. It is a surd.</span></div>
                  <div className="flex items-center gap-2"><Scissors className="text-rose-500 shrink-0" size={16}/> <span><strong>√4</strong> simplifies to 2. It is NOT a surd.</span></div>
                </div>
              </div>

              {/* Types of Surds */}
              <div className="bg-slate-800 text-white border-2 border-slate-700 p-6 rounded-3xl relative overflow-hidden md:col-span-2">
                <h3 className="font-black text-xl text-amber-400 mb-6 uppercase tracking-widest text-sm">Classification of Surds</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                    <strong className="text-orange-300 block mb-1">1. Pure Surds</strong>
                    <p className="text-xs text-slate-300 mb-2">Surds which do not have rational factors other than 1.</p>
                    <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">Ex: √3, √7</span>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                    <strong className="text-orange-300 block mb-1">2. Mixed Surds</strong>
                    <p className="text-xs text-slate-300 mb-2">Surds which have a rational factor other than 1.</p>
                    <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">Ex: 2√3, 5√2</span>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                    <strong className="text-orange-300 block mb-1">3. Similar Surds</strong>
                    <p className="text-xs text-slate-300 mb-2">Surds where the irrational parts (radicands) are identical.</p>
                    <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">Ex: 5√2 & 7√2</span>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                    <strong className="text-orange-300 block mb-1">4. Unlike Surds</strong>
                    <p className="text-xs text-slate-300 mb-2">Surds where the irrational parts (radicands) are different.</p>
                    <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">Ex: √2 & 2√5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: MASTER RULES --- */}
        {activeTab === 'rules' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Layers size={28}/>} title="Laws of Surds & Indices" colorClass="text-orange-600" />

            <div className="grid lg:grid-cols-2 gap-8">
               
               {/* Indices Rules */}
               <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl shadow-sm">
                 <h4 className="font-black text-orange-800 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <Zap size={18}/> Rules of Indices
                 </h4>
                 <div className="space-y-4 font-mono text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                        <div className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-widest">Multiplication Rule</div>
                        <div className="text-lg">a<sup>m</sup> × a<sup>n</sup> = a<sup>(m+n)</sup></div>
                        <div className="text-xs text-slate-500 mt-1">Ex: 2<sup>3</sup> × 2<sup>4</sup> = 2<sup>7</sup> = 128</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                        <div className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-widest">Division Rule</div>
                        <div className="text-lg">a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>(m-n)</sup></div>
                        <div className="text-xs text-slate-500 mt-1">Ex: 9<sup>3</sup> ÷ 9<sup>2</sup> = 9<sup>1</sup> = 9</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                        <div className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-widest">Power of Power Rule</div>
                        <div className="text-lg">(a<sup>n</sup>)<sup>m</sup> = a<sup>nm</sup></div>
                        <div className="text-xs text-slate-500 mt-1">Ex: (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup> = 64</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                        <div className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-widest">Negative Index Rule</div>
                        <div className="text-lg">a<sup>-n</sup> = 1 / a<sup>n</sup></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                        <div className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-widest">Zero Index Rule</div>
                        <div className="text-lg">a<sup>0</sup> = 1</div>
                    </div>
                 </div>
               </div>

               {/* Surds Rules */}
               <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl shadow-sm">
                 <h4 className="font-black text-rose-800 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <DivideSquare size={18}/> Rules of Surds
                 </h4>
                 <div className="space-y-4 font-mono text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Multiplication Rule</div>
                        <div className="text-lg"><sup>n</sup>√a × <sup>n</sup>√b = <sup>n</sup>√(ab)</div>
                        <div className="text-xs text-slate-500 mt-1">Ex: √3 × √2 = √6</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Division Rule</div>
                        <div className="text-lg"><sup>n</sup>√a ÷ <sup>n</sup>√b = <sup>n</sup>√(a/b)</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Radical to Index Rule</div>
                        <div className="text-lg"><sup>n</sup>√a = a<sup>(1/n)</sup></div>
                        <div className="text-xs text-slate-500 mt-1">Ex: <sup>3</sup>√27 = 27<sup>(1/3)</sup> = 3</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Power of Surd Rule</div>
                        <div className="text-lg">(<sup>n</sup>√a)<sup>n</sup> = a</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Nested Surds Rule</div>
                        <div className="text-lg"><sup>m</sup>√(<sup>n</sup>√a) = <sup>mn</sup>√a</div>
                    </div>
                 </div>
               </div>

               {/* Essential Shortcut Principles */}
               <div className="bg-slate-800 text-white rounded-3xl p-8 shadow-xl md:col-span-2 relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 opacity-10"><BrainCircuit size={160}/></div>
                 <h4 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-6 flex items-center gap-2 relative z-10">
                    <Lightbulb size={18}/> Essential Shortcut Principles
                 </h4>
                 <div className="grid md:grid-cols-2 gap-6 relative z-10">
                    <div>
                        <strong className="text-orange-300 block mb-2">1. Rationalizing Denominators</strong>
                        <p className="text-sm text-slate-300">If surds are in the denominator, rationalize by multiplying numerator and denominator by the conjugate surd (e.g., multiply by a - √b if denominator is a + √b).</p>
                    </div>
                    <div>
                        <strong className="text-orange-300 block mb-2">2. Equating Bases (Crucial)</strong>
                        <p className="text-sm text-slate-300">If a<sup>x</sup> = a<sup>y</sup>, then x = y. Always try to reduce numbers to their prime bases to equate the indices.</p>
                    </div>
                    <div>
                        <strong className="text-orange-300 block mb-2">3. Equating Surds</strong>
                        <p className="text-sm text-slate-300">If m + √p = n + √q, then the rational parts must be equal (m = n) and irrational parts must be equal (p = q).</p>
                    </div>
                    <div>
                        <strong className="text-orange-300 block mb-2">4. Zero Equivalence</strong>
                        <p className="text-sm text-slate-300">If m + √p = 0, then m = 0 and p = 0.</p>
                    </div>
                 </div>
               </div>

               {/* Surds Rules */}
               <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl shadow-sm">
                 <h4 className="font-black text-rose-800 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <DivideSquare size={18}/> Rules of Surds
                 </h4>
                 <div className="space-y-4 font-mono text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Multiplication Rule</div>
                        <div className="text-lg"><sup>n</sup>&#8730;a &times; <sup>n</sup>&#8730;b = <sup>n</sup>&#8730;(ab)</div>
                        <div className="text-xs text-slate-500 mt-1">Ex: &#8730;3 &times; &#8730;2 = &#8730;6</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Division Rule</div>
                        <div className="text-lg"><sup>n</sup>&#8730;a &divide; <sup>n</sup>&#8730;b = <sup>n</sup>&#8730;(a/b)</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Radical to Index Rule</div>
                        <div className="text-lg"><sup>n</sup>&#8730;a = a<sup>(1/n)</sup></div>
                        <div className="text-xs text-slate-500 mt-1">Ex: <sup>3</sup>&#8730;27 = 27<sup>(1/3)</sup> = 3</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Power of Surd Rule</div>
                        <div className="text-lg">(<sup>n</sup>&#8730;a)<sup>n</sup> = a</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                        <div className="text-xs text-rose-500 font-bold mb-1 uppercase tracking-widest">Nested Surds Rule</div>
                        <div className="text-lg"><sup>m</sup>&#8730;(<sup>n</sup>&#8730;a) = <sup>mn</sup>&#8730;a</div>
                    </div>
                 </div>
               </div>

               {/* Essential Shortcut Principles */}
               <div className="bg-slate-800 text-white rounded-3xl p-8 shadow-xl md:col-span-2 relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 opacity-10"><BrainCircuit size={160}/></div>
                 <h4 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-6 flex items-center gap-2 relative z-10">
                    <Lightbulb size={18}/> Essential Shortcut Principles
                 </h4>
                 <div className="grid md:grid-cols-2 gap-6 relative z-10">
                    <div>
                        <strong className="text-orange-300 block mb-2">1. Rationalizing Denominators</strong>
                        <p className="text-sm text-slate-300">If surds are in the denominator, rationalize by multiplying numerator and denominator by the conjugate surd (e.g., multiply by a - &#8730;b if denominator is a + &#8730;b).</p>
                    </div>
                    <div>
                        <strong className="text-orange-300 block mb-2">2. Equating Bases (Crucial)</strong>
                        <p className="text-sm text-slate-300">If a<sup>x</sup> = a<sup>y</sup>, then x = y. Always try to reduce numbers to their prime bases to equate the indices.</p>
                    </div>
                    <div>
                        <strong className="text-orange-300 block mb-2">3. Equating Surds</strong>
                        <p className="text-sm text-slate-300">If m + &#8730;p = n + &#8730;q, then the rational parts must be equal (m = n) and irrational parts must be equal (p = q).</p>
                    </div>
                    <div>
                        <strong className="text-orange-300 block mb-2">4. Zero Equivalence</strong>
                        <p className="text-sm text-slate-300">If m + &#8730;p = 0, then m = 0 and p = 0.</p>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: ALGEBRAIC FORMULAS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Algebraic Formulas" colorClass="text-amber-500" />
            
            <div className="bg-amber-50 rounded-3xl p-8 border-2 border-amber-200 shadow-sm">
                <p className="text-slate-700 font-medium mb-6">These fundamental identities are frequently combined with Surds and Indices to create complex-looking simplification problems. Memorizing these is mandatory.</p>
                
                <ul className="grid md:grid-cols-2 gap-4 font-mono text-sm text-slate-800 font-bold">
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">1</span>
                        (a + b)(a - b) = <span className="text-orange-600 ml-2">a² - b²</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">2</span>
                        (a + b)² = <span className="text-orange-600 ml-2">a² + b² + 2ab</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">3</span>
                        (a - b)² = <span className="text-orange-600 ml-2">a² + b² - 2ab</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">4</span>
                        (a + b)³ = <span className="text-orange-600 ml-2">a³ + 3a²b + 3ab² + b³</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">5</span>
                        (a³ + b³) = <span className="text-orange-600 ml-2">(a + b)(a² - ab + b²)</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">6</span>
                        (a³ - b³) = <span className="text-orange-600 ml-2">(a - b)(a² + ab + b²)</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center md:col-span-2">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">7</span>
                        (a + b + c)² = <span className="text-orange-600 ml-2">a² + b² + c² + 2(ab + bc + ca)</span>
                    </li>
                    <li className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center md:col-span-2">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded mr-3 text-xs">8</span>
                        (a³ + b³ + c³ - 3abc) = <span className="text-orange-600 ml-2">(a + b + c)(a² + b² + c² - ab - bc - ac)</span>
                    </li>
                    <li className="bg-slate-800 text-white p-4 rounded-xl shadow-md border border-slate-700 flex items-center md:col-span-2">
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded mr-3 text-xs">Important Conditional</span>
                        When a + b + c = 0, then <span className="text-emerald-400 ml-2 text-lg">a³ + b³ + c³ = 3abc</span>
                    </li>
                </ul>
            </div>
          </div>
        )}

        {/* --- TAB 4: EXAM PATTERNS --- */}
        {activeTab === 'patterns' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="Common Exam Patterns" colorClass="text-rose-600" />
            
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-rose-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the Archtypes</h3>
                <p className="text-sm font-medium mt-1">
                  Surds and Indices questions almost always fall into one of these specific patterns. Learn to recognize them instantly.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Pattern 1: Identities Application */}
                <QuestionCard 
                    qNum="Pattern 1" badge="Algebraic Expansion"
                    question={<div>Find the value of <strong>(3x + 2y)²</strong></div>}
                    solution={`Let a = 3x and b = 2y.
Substitute into formula: (a + b)² = a² + 2ab + b²

(3x + 2y)² = (3x)² + 2(3x)(2y) + (2y)²
= 9x² + 12xy + 4y²`}
                />

                <QuestionCard 
                    qNum="Pattern 1B" badge="Cubic Expansion"
                    question={<div>Solve using identity: <strong>(2x + 3y)³</strong></div>}
                    solution={`Use formula: (a + b)³ = a³ + 3a²b + 3ab² + b³
Here, a = 2x, b = 3y.

(2x)³ + 3(2x)²(3y) + 3(2x)(3y)² + (3y)³
= 8x³ + 3(4x²)(3y) + 3(2x)(9y²) + 27y³
= 8x³ + 36x²y + 54xy² + 27y³`}
                />

                {/* Pattern 2: Surd Simplification */}
                <QuestionCard 
                    qNum="Pattern 2" badge="Surd Simplification"
                    question={<div>By how much does <strong>(√12 + √18)</strong> exceed <strong>(√3 + √2)</strong>?</div>}
                    solution={`Find the difference:
(√12 + √18) - (√3 + √2)

Simplify the mixed surds first:
√12 = √(4 × 3) = 2√3
√18 = √(9 × 2) = 3√2

Substitute back:
(2√3 + 3√2) - (√3 + √2)
= (2√3 - √3) + (3√2 - √2)
= √3 + 2√2`}
                />

                {/* Pattern 3: Fractional / Decimal Indices */}
                <QuestionCard 
                    qNum="Pattern 3" badge="Decimal Power"
                    question={<div>Find the value of: <strong>(256)<sup>0.16</sup> × (16)<sup>0.18</sup></strong></div>}
                    solution={`Convert bases to the same prime number (or a common base like 4).
256 = 4^4
16 = 4^2

Expression = (4^4)^0.16 * (4^2)^0.18
= 4^(4 * 0.16) * 4^(2 * 0.18)
= 4^0.64 * 4^0.36

Apply multiplication rule (a^m * a^n = a^(m+n)):
= 4^(0.64 + 0.36)
= 4^1
= 4`}
                />

                <QuestionCard 
                    qNum="Pattern 3B" badge="Negative Decimal Power"
                    question={<div>Evaluate: <strong>(0.04)<sup>-1.5</sup></strong></div>}
                    solution={`Expression = (0.04)^(-1.5)

Remove negative index by inverting:
= 1 / (0.04)^1.5

Convert decimal to fraction:
0.04 = 4/100 = 1/25
So, 1.5 = 3/2

= 1 / (1/25)^(3/2)
= 25^(3/2)
= (√25)^3
= 5^3
= 125`}
                />

                {/* Pattern 4: Finding X */}
                <QuestionCard 
                    qNum="Pattern 4" badge="Equating Bases"
                    question={<div>Find the value of x if: <strong>(p/q)<sup>x-1</sup> = (q/p)<sup>x-3</sup></strong></div>}
                    options={["A. 3", "B. 2", "C. 1", "D. -2"]}
                    ans="B"
                    solution={`To equate powers, bases must be identical.
Notice that (q/p) is the reciprocal of (p/q).
(q/p) = (p/q)^-1

So, (q/p)^(x-3) = [(p/q)^-1]^(x-3) = (p/q)^-(x-3) = (p/q)^(3-x)

Now substitute back:
(p/q)^(x-1) = (p/q)^(3-x)

Since bases are equal, equate indices:
x - 1 = 3 - x
2x = 4
x = 2`}
                />
            </div>
          </div>
        )}

        {/* --- TAB 5: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Practice Vault" 
              colorClass="text-orange-600" 
            />
            
            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 text-orange-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-orange-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">The Ultimate Drill</h3>
                <p className="text-sm font-medium mt-1">
                  16 Rapid-fire questions to lock in the rules of indices and surd operations. Let's go!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Simplification"
                    question={<div>Find the value of <strong>7<sup>-25</sup> - 7<sup>-26</sup></strong></div>}
                    options={["A. 6 × 7⁻²⁶", "B. 6 × 7⁻²⁵", "C. 7 × 7⁻²⁵", "D. 7 × 7⁻²⁶"]}
                    ans="A"
                    solution={`Factor out the smaller power, which is 7^(-26).
7^(-25) - 7^(-26) 
= 7^(-26) * [7^1 - 1]
= 7^(-26) * [7 - 1]
= 6 * 7^(-26)`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Simplification"
                    question={<div>Simplify <strong>(256)<sup>3/4</sup></strong></div>}
                    options={["A. 16", "B. 12", "C. 256", "D. 64"]}
                    ans="D"
                    solution={`Convert base to power of 4.
256 = 4^4
(256)^(3/4) = (4^4)^(3/4)
Powers multiply: 4 * (3/4) = 3
= 4^3
= 64`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Division Rule"
                    question={<div>Find the value of <strong>8<sup>112</sup> &divide; 8<sup>110</sup></strong></div>}
                    options={["A. 72", "B. 64", "C. 81", "D. 49"]}
                    ans="B"
                    solution={`Use rule: a^m / a^n = a^(m-n)
= 8^(112 - 110)
= 8^2
= 64`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Find X"
                    question={<div>If <strong>4<sup>x</sup> + 4<sup>x+1</sup> = 80</strong>, then the value of <strong>x<sup>x</sup></strong> is:</div>}
                    options={["A. 16", "B. 9", "C. 25", "D. 4"]}
                    ans="D"
                    solution={`Factor out 4^x:
4^x * (1 + 4^1) = 80
4^x * 5 = 80
4^x = 80 / 5
4^x = 16

Since 16 = 4^2, x = 2.
Now find x^x = 2^2 = 4.`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Find A"
                    question={<div>If <strong>2<sup>a</sup> = <sup>3</sup>&#8730;32</strong>, then a is equal to:</div>}
                    options={["A. 1/3", "B. 4", "C. 5/3", "D. 1/2"]}
                    ans="C"
                    solution={`Rewrite the RHS using fractional index:
32^(1/3)
Convert 32 to base 2: 32 = 2^5
= (2^5)^(1/3)
= 2^(5/3)

Equating bases:
2^a = 2^(5/3)
Therefore, a = 5/3`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Logic"
                    question={<div>If x and y are whole numbers such that <strong>x<sup>y</sup> = 169</strong>, find <strong>(x - 1)<sup>y+1</sup></strong></div>}
                    options={["A. 1331", "B. 2744", "C. 1728", "D. 729"]}
                    ans="C"
                    solution={`169 is a perfect square.
169 = 13^2.
So, x = 13 and y = 2.

Calculate:
(x - 1)^(y + 1)
= (13 - 1)^(2 + 1)
= (12)^3
= 1728`}
                />

                <QuestionCard 
                    qNum="Q7" badge="Negative Indices"
                    question={<div>Simplify: <strong>(3<sup>0</sup> + 3<sup>-1</sup>) / (3<sup>-1</sup> - 3<sup>0</sup>)</strong></div>}
                    options={["A. -2", "B. -1", "C. 1", "D. 2"]}
                    ans="A"
                    solution={`Recall that a^0 = 1, and a^-n = 1/a^n.
Numerator: 1 + 1/3 = 4/3
Denominator: 1/3 - 1 = -2/3

Expression: (4/3) / (-2/3)
= (4/3) * (-3/2)
= -4/2
= -2`}
                />

                <QuestionCard 
                    qNum="Q8" badge="Base Equating"
                    question={<div>If <strong>5<sup>a</sup> = 3125</strong>, then the value of <strong>5<sup>(a-3)</sup></strong> is:</div>}
                    options={["A. 25", "B. 125", "C. 625", "D. 1625"]}
                    ans="A"
                    solution={`5^a = 3125
5^a = 5^5  (Since 5*5*5*5*5 = 3125)
a = 5.

Now find 5^(a-3):
= 5^(5-3)
= 5^2
= 25`}
                />

                <QuestionCard 
                    qNum="Q9" badge="Division"
                    question={<div>Solve: <strong>(10)<sup>20</sup> / (10)<sup>10</sup></strong></div>}
                    solution={`Use division rule: a^m / a^n = a^(m-n)
= 10^(20 - 10)
= 10^10`}
                />

                <QuestionCard 
                    qNum="Q10" badge="Substitution"
                    question={<div>If a and b are two whole numbers, such that <strong>ab = 25</strong>, then what will be the value of <strong>(a-1)<sup>b+1</sup></strong>?</div>}
                    options={["A. 40", "B. 50", "C. 64", "D. 10"]}
                    ans="C"
                    solution={`If ab = 25 for whole numbers, the most logical assignment (not 1*25) for index evaluation in tests is a=5, b=2.
(Since standard format meant a^b = 25 based on typo in text, assuming a^b=25 -> 5^2=25)

Let a=5, b=2:
(5-1)^(2+1)
= 4^3
= 64`}
                />

                <QuestionCard 
                    qNum="Q11" badge="Fractional Index"
                    question={<div>Find the value of <strong>(625)<sup>3/4</sup></strong></div>}
                    options={["A. 500", "B. 125", "C. 225", "D. 550"]}
                    ans="B"
                    solution={`Convert 625 to a power of 5:
625 = 5^4

(5^4)^(3/4)
= 5^(4 * 3/4)
= 5^3
= 125`}
                />

                <QuestionCard 
                    qNum="Q12" badge="Surd Power"
                    question={<div>What will be the value of <strong>(√27)<sup>1/3</sup></strong>?</div>}
                    options={["A. 3", "B. √3", "C. 9", "D. 6"]}
                    ans="B"
                    solution={`Convert radical to index:
√27 = 27^(1/2)

Expression = (27^(1/2))^(1/3)
= 27^(1/6)

Convert 27 to base 3: 27 = 3^3
= (3^3)^(1/6)
= 3^(3/6) = 3^(1/2)
= √3`}
                />

                <QuestionCard 
                    qNum="Q13" badge="Product Law"
                    question={<div>Find the value of x: <strong>(150)<sup>6</sup> × (150)<sup>x</sup> = (150)<sup>10</sup></strong></div>}
                    options={["A. 16", "B. 8", "C. 4", "D. None"]}
                    ans="C"
                    solution={`Multiplication of same bases means adding indices:
150^(6 + x) = 150^10

Equate the indices:
6 + x = 10
x = 4`}
                />

                <QuestionCard 
                    qNum="Q14" badge="System Eq"
                    question={<div>Calculate 'x' when <strong>3<sup>(x-y)</sup> = 27</strong> and <strong>3<sup>(x+y)</sup> = 81</strong>.</div>}
                    options={["A. 3.5", "B. 3", "C. 5.5", "D. 6"]}
                    ans="A"
                    solution={`Eq 1: 3^(x-y) = 27 = 3^3 
=> x - y = 3

Eq 2: 3^(x+y) = 81 = 3^4
=> x + y = 4

Add equations:
(x - y) + (x + y) = 3 + 4
2x = 7
x = 3.5`}
                />

                <QuestionCard 
                    qNum="Q15" badge="Division Law"
                    question={<div>Solve <strong>100<sup>236</sup> / 100<sup>200</sup> = ?</strong></div>}
                    options={["A. 100⁴³⁶", "B. 100³⁶", "C. 100", "D. None"]}
                    ans="B"
                    solution={`Apply division rule (subtract indices):
100^(236 - 200)
= 100^36`}
                />

                <QuestionCard 
                    qNum="Q16" badge="Negative Index"
                    question={<div>What will be the value of <strong>5<sup>-14</sup> - 5<sup>-15</sup></strong>?</div>}
                    options={["A. 4 * 5¹⁵", "B. 4 * 5⁻¹⁵", "C. 4500", "D. None"]}
                    ans="B"
                    solution={`Factor out the smaller power, 5^(-15):
= 5^(-15) * [5^1 - 1]
= 5^(-15) * [5 - 1]
= 5^(-15) * 4
= 4 * 5^(-15)`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
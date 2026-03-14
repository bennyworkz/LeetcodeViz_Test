import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  FunctionSquare, ArrowLeftRight, CheckCircle2, 
  Sigma, IterationCcw, Focus
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-indigo-400 shadow-lg shadow-indigo-900/20 scale-105' 
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
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>{qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <div className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 overflow-x-auto whitespace-pre-wrap">
        {question}
      </div>
      
      {options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
                showSol && ans && opt.startsWith(ans) 
                  ? 'bg-violet-50 border-violet-300 text-violet-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-violet-200' : 'bg-slate-100'
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
          className="flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors outline-none"
        >
          {showSol ? (
            <><EyeOff size={16}/> Hide Solution</>
          ) : (
            <><Eye size={16}/> Show Solution</>
          )}
        </button>
        
        {showSol && (
          <div className="mt-5 bg-[#0f172a] text-white p-5 rounded-2xl text-sm leading-relaxed animate-in slide-in-from-top-2 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
              <BookOpen size={14} /> Step-by-Step Notebook
            </div>
            
            <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
              {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                const trimmedLine = line.trim();
                
                if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                
                const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔');
                const isFinalLine = idx === solution.split('\n').length - 1;

                let lineClass = "text-slate-300";
                let prefix = null;

                if (isEquation) {
                   lineClass = "text-violet-300 font-bold ml-4";
                   prefix = <span className="mr-3 text-violet-500/70 select-none">↳</span>;
                } else if (isFinalLine && !trimmedLine.endsWith('?')) {
                   lineClass = "text-indigo-300 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-lg inline-block w-max border border-indigo-500/20";
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
export default function InverseNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#eef2ff] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
              <ArrowLeftRight className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Inverse Functions
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-indigo-800 bg-indigo-100 border border-indigo-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Core Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Properties" />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={<Zap size={16}/>} label="Exam Patterns" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Custom Practice" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="Concepts & Definitions" colorClass="text-indigo-600" />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-3xl relative overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute right-0 top-0 opacity-5"><IterationCcw size={150}/></div>
                <h3 className="font-black text-xl text-indigo-800 mb-3 relative z-10">What is an Inverse Function?</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  An Inverse is a function that reverses another function. Addition is the opposite of subtraction; division is the opposite of multiplication, and so on.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-sm font-mono text-indigo-900 border border-indigo-100 relative z-10 mt-4 space-y-3">
                  <div>If the function is denoted by <strong className="text-violet-600">f(x)</strong>, then its inverse is denoted by <strong className="text-violet-600">f⁻¹(x)</strong>.</div>
                  <div className="border-t border-indigo-50 pt-2">
                    <strong>Composite Rule:</strong> Two functions f(x) and g(x) are inverses if:<br/>
                    (f ∘ g)(x) = x <span className="mx-2 text-slate-400">and</span> (g ∘ f)(x) = x
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 text-white border-2 border-slate-700 p-6 rounded-3xl relative overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute right-0 top-0 opacity-5"><Focus size={150}/></div>
                <h3 className="font-black text-xl text-violet-400 mb-4 relative z-10">The 1-to-1 Rule (Crucial)</h3>
                <p className="text-sm text-slate-300 relative z-10 mb-4">
                  For a function to have an inverse, the function has to be <strong>1 to 1</strong>. That means every output only has ONE input.
                </p>
                <div className="bg-black/40 p-4 rounded-xl border border-slate-600 font-mono text-sm relative z-10 text-emerald-300">
                  Mathematically: f(x₁) ≠ f(x₂) whenever x₁ ≠ x₂
                </div>
                <p className="text-xs text-slate-400 mt-4 relative z-10">
                  If f(x) = x², it does NOT have an inverse unless restricted (e.g., x ≥ 0) because f(2) = 4 and f(-2) = 4 (two inputs give the same output).
                </p>
              </div>
            </div>

            {/* Standard Inverse Pairings Table */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Layers size={20} className="text-indigo-500"/> Standard Inverse Pairings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-100 text-indigo-800">
                      <th className="p-4 rounded-tl-xl font-black">Function f(x)</th>
                      <th className="p-4 font-black">Inverse f⁻¹(x)</th>
                      <th className="p-4 rounded-tr-xl font-black">Condition / Note</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono bg-white">
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">+</td><td className="p-4 font-bold text-violet-600">-</td><td className="p-4 text-slate-500 text-xs">Basic arithmetic</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">*</td><td className="p-4 font-bold text-violet-600">/</td><td className="p-4 text-slate-500 text-xs">Don't divide by 0</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">1 / x</td><td className="p-4 font-bold text-violet-600">1 / y</td><td className="p-4 text-slate-500 text-xs">x and y ≠ 0</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">x²</td><td className="p-4 font-bold text-violet-600">√y</td><td className="p-4 text-slate-500 text-xs">x and y ≥ 0</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">xⁿ</td><td className="p-4 font-bold text-violet-600">y<sup>1/n</sup></td><td className="p-4 text-slate-500 text-xs">n ≠ 0</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">e<sup>x</sup></td><td className="p-4 font-bold text-violet-600">ln(y)</td><td className="p-4 text-slate-500 text-xs">y &gt; 0</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">a<sup>x</sup></td><td className="p-4 font-bold text-violet-600">log<sub>a</sub>(y)</td><td className="p-4 text-slate-500 text-xs">y &gt; 0 and a &gt; 0</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">sin x</td><td className="p-4 font-bold text-violet-600">sin⁻¹(y)</td><td className="p-4 text-slate-500 text-xs">-π/2 to +π/2</td></tr>
                    <tr className="border-b border-slate-100"><td className="p-4 font-bold">cos x</td><td className="p-4 font-bold text-violet-600">cos⁻¹(y)</td><td className="p-4 text-slate-500 text-xs">0 to π</td></tr>
                    <tr><td className="p-4 font-bold rounded-bl-xl">tan x</td><td className="p-4 font-bold text-violet-600">tan⁻¹(y)</td><td className="p-4 text-slate-500 text-xs rounded-br-xl">-π/2 to +π/2</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4 Steps Method */}
            <div className="bg-violet-50 border border-violet-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-black text-violet-800 text-lg uppercase tracking-widest border-b border-violet-200 pb-2 mb-6 flex items-center gap-2">
                    <FunctionSquare size={20} className="text-violet-500"/> 4 Steps to Find Rational Inverse
                </h3>
                <p className="text-sm text-slate-700 mb-4">A rational function is f(x) = P(x)/Q(x) where Q(x) ≠ 0. Use this universal method:</p>
                <div className="grid md:grid-cols-4 gap-4 font-mono text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-violet-100">
                        <span className="bg-violet-200 text-violet-800 px-2 py-0.5 rounded text-xs font-bold block w-max mb-2">Step 1</span>
                        Replace f(x) with <strong>y</strong>.
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-violet-100 scale-105 shadow-violet-200/50 z-10">
                        <span className="bg-indigo-500 text-white px-2 py-0.5 rounded text-xs font-bold block w-max mb-2">Step 2</span>
                        <strong>Interchange x and y.</strong> (The core logic of inverse)
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-violet-100">
                        <span className="bg-violet-200 text-violet-800 px-2 py-0.5 rounded text-xs font-bold block w-max mb-2">Step 3</span>
                        Solve for <strong>y</strong> in terms of x.
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-violet-100">
                        <span className="bg-violet-200 text-violet-800 px-2 py-0.5 rounded text-xs font-bold block w-max mb-2">Step 4</span>
                        Replace y with <strong>f⁻¹(x)</strong>.
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: PROPERTIES --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Properties & Formulas" colorClass="text-violet-600" />

            <div className="bg-violet-50 border border-violet-200 p-6 rounded-3xl shadow-sm mb-8">
                <h4 className="font-black text-violet-800 uppercase tracking-widest text-lg mb-6 text-center">Trigonometric Inverse Properties</h4>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-sm">
                    {/* Prop 1 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-100">
                        <div className="text-xs text-violet-500 font-bold mb-3 uppercase tracking-widest border-b pb-1">Property 1 (Reciprocals)</div>
                        <ul className="space-y-2">
                            <li>sin⁻¹(1/x) = csc⁻¹(x), <span className="text-[10px] text-slate-400">|x| ≥ 1</span></li>
                            <li>cos⁻¹(1/x) = sec⁻¹(x), <span className="text-[10px] text-slate-400">|x| ≥ 1</span></li>
                            <li>tan⁻¹(1/x) = cot⁻¹(x), <span className="text-[10px] text-slate-400">x &gt; 0</span></li>
                        </ul>
                    </div>

                    {/* Prop 2 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-100">
                        <div className="text-xs text-violet-500 font-bold mb-3 uppercase tracking-widest border-b pb-1">Property 2 (Negative Args 1)</div>
                        <ul className="space-y-2">
                            <li>sin⁻¹(-x) = -sin⁻¹(x), <span className="text-[10px] text-slate-400">x ∈ [-1,1]</span></li>
                            <li>tan⁻¹(-x) = -tan⁻¹(x), <span className="text-[10px] text-slate-400">x ∈ R</span></li>
                            <li>csc⁻¹(-x) = -csc⁻¹(x), <span className="text-[10px] text-slate-400">|x| ≥ 1</span></li>
                        </ul>
                    </div>

                    {/* Prop 3 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-100">
                        <div className="text-xs text-violet-500 font-bold mb-3 uppercase tracking-widest border-b pb-1">Property 3 (Negative Args 2)</div>
                        <ul className="space-y-2">
                            <li>cos⁻¹(-x) = π - cos⁻¹(x), <span className="text-[10px] text-slate-400">x ∈ [-1,1]</span></li>
                            <li>sec⁻¹(-x) = π - sec⁻¹(x), <span className="text-[10px] text-slate-400">|x| ≥ 1</span></li>
                            <li>cot⁻¹(-x) = π - cot⁻¹(x), <span className="text-[10px] text-slate-400">x ∈ R</span></li>
                        </ul>
                    </div>

                    {/* Prop 4 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-100">
                        <div className="text-xs text-violet-500 font-bold mb-3 uppercase tracking-widest border-b pb-1">Property 4 (Complementary)</div>
                        <ul className="space-y-2">
                            <li>sin⁻¹(x) + cos⁻¹(x) = π/2, <span className="text-[10px] text-slate-400">x ∈ [-1,1]</span></li>
                            <li>tan⁻¹(x) + cot⁻¹(x) = π/2, <span className="text-[10px] text-slate-400">x ∈ R</span></li>
                            <li>csc⁻¹(x) + sec⁻¹(x) = π/2, <span className="text-[10px] text-slate-400">|x| ≥ 1</span></li>
                        </ul>
                    </div>

                    {/* Prop 5 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-100 md:col-span-2 lg:col-span-2">
                        <div className="text-xs text-violet-500 font-bold mb-3 uppercase tracking-widest border-b pb-1">Property 5 (Addition/Subtraction)</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="block mb-1 text-slate-700">tan⁻¹(x) + tan⁻¹(y) =</span>
                                <span className="text-indigo-600 font-black text-lg">tan⁻¹( (x+y)/(1-xy) )</span>
                                <span className="block mt-1 text-[10px] text-slate-400">Condition: xy &lt; 1</span>
                            </div>
                            <div>
                                <span className="block mb-1 text-slate-700">tan⁻¹(x) - tan⁻¹(y) =</span>
                                <span className="text-indigo-600 font-black text-lg">tan⁻¹( (x-y)/(1+xy) )</span>
                                <span className="block mt-1 text-[10px] text-slate-400">Condition: xy &gt; -1</span>
                            </div>
                        </div>
                    </div>

                    {/* Prop 6 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-100 md:col-span-2 lg:col-span-3">
                        <div className="text-xs text-violet-500 font-bold mb-3 uppercase tracking-widest border-b pb-1">Property 6 (Double Angle Conversions)</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                2tan⁻¹(x) = <br/>
                                <span className="text-indigo-600 font-black">sin⁻¹( 2x / (1+x²) )</span>
                                <span className="block text-[10px] text-slate-400">|x| ≤ 1</span>
                            </div>
                            <div>
                                2tan⁻¹(x) = <br/>
                                <span className="text-indigo-600 font-black">cos⁻¹( (1-x²)/(1+x²) )</span>
                                <span className="block text-[10px] text-slate-400">x ≥ 0</span>
                            </div>
                            <div>
                                2tan⁻¹(x) = <br/>
                                <span className="text-indigo-600 font-black">tan⁻¹( 2x / (1-x²) )</span>
                                <span className="block text-[10px] text-slate-400">-1 &lt; x &lt; 1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: EXAM PATTERNS --- */}
        {activeTab === 'patterns' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="Common Exam Archetypes" colorClass="text-indigo-600" />
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 text-indigo-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-indigo-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the 4-Step Process</h3>
                <p className="text-sm font-medium mt-1">
                  Almost all algebraic inverse questions can be solved by swapping x and y, then solving for y. Here are the core patterns.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Linear */}
                <QuestionCard 
                    qNum="Pattern 1" badge="Linear Inverse"
                    question={`Find the inverse of f(x) = 3x - 2.`}
                    solution={`Step 1: Replace f(x) with y.
y = 3x - 2

Step 2: Swap x and y.
x = 3y - 2

Step 3: Solve for y.
x + 2 = 3y
(x + 2) / 3 = y

Step 4: Replace y with f⁻¹(x).
f⁻¹(x) = (x + 2) / 3`}
                />

                {/* Rational */}
                <QuestionCard 
                    qNum="Pattern 2" badge="Rational Inverse"
                    question={`Find the inverse of f(x) = (x + 4) / (3x - 5).`}
                    options={["A. (5x+4)/(3x-1)", "B. (5x+3)/(3x-1)", "C. (2x+3)/(5x-1)", "D. None"]}
                    ans="A"
                    solution={`Step 1 & 2: y = (x + 4)/(3x - 5) ➔ Swap: x = (y + 4)/(3y - 5)

Step 3: Solve for y.
Multiply both sides by (3y - 5):
x(3y - 5) = y + 4
3xy - 5x = y + 4

Group y terms on one side:
3xy - y = 5x + 4
Factor out y:
y(3x - 1) = 5x + 4

Divide by (3x - 1):
y = (5x + 4) / (3x - 1)

f⁻¹(x) = (5x + 4) / (3x - 1)`}
                />

                {/* Logarithmic */}
                <QuestionCard 
                    qNum="Pattern 3" badge="Logarithmic"
                    question={`Find the inverse of f(x) = log₅(2x - 1).`}
                    options={["A. (5^x + 1)/2", "B. (2^x + 1)/5", "C. 3/5(x+1)", "D. None"]}
                    ans="A"
                    solution={`Step 1: y = log₅(2x - 1)

Convert log equation to exponential statement:
5^y = 2x - 1

Step 2: Swap x and y.
5^x = 2y - 1

Step 3: Solve for y.
5^x + 1 = 2y
(5^x + 1) / 2 = y

f⁻¹(x) = (5^x + 1) / 2`}
                />

                {/* Evaluation/Composite */}
                <QuestionCard 
                    qNum="Pattern 4" badge="Composite Check"
                    question={`Given f(x) = 3x - 2 and its inverse is f⁻¹(x) = (x + 2) / 3. Evaluate f(f⁻¹(x)).`}
                    solution={`To evaluate f(f⁻¹(x)), substitute the entire inverse function into the original function f(x) where x is.

f( f⁻¹(x) ) = f( (x+2)/3 )
= 3 * [ (x+2)/3 ] - 2

The 3s cancel out:
= (x + 2) - 2
= x

This proves they are inverses, as f(f⁻¹(x)) must equal x.`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 4: MCQ VAULT --- */}
        {activeTab === 'mcq' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<BrainCircuit size={28}/>} 
              title="MCQ Solved Vault" 
              colorClass="text-violet-600" 
            />
            
            <div className="bg-violet-50 border border-violet-200 rounded-3xl p-6 text-violet-800 flex gap-4 items-center shadow-sm">
              <Target size={40} className="shrink-0 text-violet-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">10 Standard Prompt Questions</h3>
                <p className="text-sm font-medium mt-1">
                  Master domain evaluations, rational function inversions, and basic trig properties.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Domain Logic"
                    question={`Let f(x) = x³ + 2x + 1. Find the domain of the inverse function of f(x).`}
                    options={["A. (-∞, ∞)", "B. [-1, ∞)", "C. (-∞, -1] U [0, ∞)", "D. (-∞, -1) U [0, ∞)"]}
                    ans="A"
                    solution={`Finding the actual inverse of a cubic is complicated. 
However, notice that f(x) = x³ + 2x + 1 is a strictly increasing function (its derivative f'(x) = 3x² + 2 > 0 for all x).
The domain of f(x) is all real numbers (-∞, ∞).
Since it goes from -∞ to ∞, its range is also (-∞, ∞).

The domain of an inverse function f⁻¹(x) is exactly the RANGE of the original function f(x).
Therefore, domain of f⁻¹(x) = (-∞, ∞).`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Rational"
                    question={`Let f(x) = (2x - 1) / (3x + 4). Find inverse of f(x).`}
                    options={["A. (1+4x)/(2-3x)", "B. (2-3x)/(1+4x)", "C. (4x+1)/(3x-2)", "D. (3x+4)/(2x-1)"]}
                    ans="A"
                    solution={`y = (2x - 1) / (3x + 4)
Swap x and y:
x = (2y - 1) / (3y + 4)

Solve for y:
x(3y + 4) = 2y - 1
3xy + 4x = 2y - 1

Group y terms:
4x + 1 = 2y - 3xy
4x + 1 = y(2 - 3x)
y = (4x + 1) / (2 - 3x)

f⁻¹(x) = (4x + 1) / (2 - 3x)`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Linear"
                    question={`Let f(x) = 3x - 1. Find the inverse function of f(x).`}
                    options={["A. (x+1)/3", "B. (x-1)/3", "C. (x-1)*3", "D. (x+1)*3"]}
                    ans="A"
                    solution={`y = 3x - 1
Swap:
x = 3y - 1
Solve for y:
x + 1 = 3y
y = (x + 1) / 3

f⁻¹(x) = (x + 1) / 3`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Linear"
                    question={`Let f(x) = 3x + 2. Find inverse of this function.`}
                    options={["A. (x-2)/3", "B. (x+2)/3", "C. (x-3)/2", "D. (x+3)/2"]}
                    ans="A"
                    solution={`y = 3x + 2
Swap:
x = 3y + 2
Solve for y:
x - 2 = 3y
y = (x - 2) / 3

f⁻¹(x) = (x - 2) / 3`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Linear"
                    question={`Let f(x) = 2x - 5. Find f⁻¹(x).`}
                    options={["A. (x/2)-5", "B. (x+5)/2", "C. (x/2)-5", "D. (x-5)/2"]}
                    ans="B"
                    solution={`y = 2x - 5
Swap:
x = 2y - 5
Solve for y:
x + 5 = 2y
y = (x + 5) / 2

f⁻¹(x) = (x + 5) / 2`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Rational"
                    question={`Given f(x) = 3x / (4 - x). Find f⁻¹(x).`}
                    options={["A. 4x/(3+x)", "B. 4x/(x-3)", "C. 4x/(3-x)", "D. 4x/(3+x)"]}
                    ans="A"
                    solution={`y = 3x / (4 - x)
Swap:
x = 3y / (4 - y)

Solve for y:
x(4 - y) = 3y
4x - xy = 3y
4x = 3y + xy
4x = y(3 + x)
y = 4x / (3 + x)

f⁻¹(x) = 4x / (3 + x)`}
                />

                <QuestionCard 
                    qNum="Q7" badge="Rational"
                    question={`Given f(x) = 7x / (3 - x). Find f⁻¹(x).`}
                    options={["A. 3x/(7-x)", "B. 7x/(3+x)", "C. 3x/(7+x)", "D. None"]}
                    ans="C"
                    solution={`y = 7x / (3 - x)
Swap:
x = 7y / (3 - y)

Solve for y:
x(3 - y) = 7y
3x - xy = 7y
3x = 7y + xy
3x = y(7 + x)
y = 3x / (7 + x)

f⁻¹(x) = 3x / (7 + x)`}
                />

                <QuestionCard 
                    qNum="Q8" badge="Logarithmic"
                    question={`Find the inverse of f(x) = log₅(2x - 1)`}
                    options={["A. (5^x + 1)/2", "B. (2^x + 1)/5", "C. 3/5(x+1)", "D. None"]}
                    ans="A"
                    solution={`y = log₅(2x - 1)
Convert to exponential form:
5^y = 2x - 1

Swap x and y:
5^x = 2y - 1

Solve for y:
5^x + 1 = 2y
(5^x + 1) / 2 = y

f⁻¹(x) = (5^x + 1) / 2`}
                />

                <QuestionCard 
                    qNum="Q9" badge="Trigonometry"
                    question={`What is the inverse function of tan(x)?`}
                    options={["A. cos⁻¹(x)", "B. tan⁻¹(x)", "C. tan⁻¹(1/x)", "D. None"]}
                    ans="B"
                    solution={`By definition, the inverse function of y = tan(x) is x = tan(y), which implies y = tan⁻¹(x) or arctan(x).`}
                />

                <QuestionCard 
                    qNum="Q10" badge="Composite Trig"
                    question={`What is the value of sin(sin⁻¹(x)) where x belongs to [-1,1]?`}
                    options={["A. 1", "B. 0", "C. x", "D. None"]}
                    ans="C"
                    solution={`Property of inverse functions:
f( f⁻¹(x) ) = x

Since the domain of sin⁻¹(x) is restricted to [-1, 1], for any x in this interval, the composition sin(sin⁻¹(x)) directly evaluates to x.`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 5: CUSTOM PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Custom Practice Vault" 
              colorClass="text-indigo-600" 
            />
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 text-indigo-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-indigo-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">12 Deep-Dive Scenarios</h3>
                <p className="text-sm font-medium mt-1">
                  These custom-designed questions test everything from restricted quadratics to exponentials. Challenge yourself!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* 1. Linear with Negative Coeff */}
                <QuestionCard 
                    qNum="CP 1" badge="Linear"
                    question="Find the inverse of f(x) = 5 - 4x."
                    options={["A. (x-5)/4", "B. (5-x)/4", "C. (x+5)/4", "D. 5/(4x)"]}
                    ans="B"
                    solution={`y = 5 - 4x
Swap x and y:
x = 5 - 4y

Solve for y:
4y = 5 - x
y = (5 - x) / 4

f⁻¹(x) = (5 - x) / 4`}
                />

                {/* 2. Rational standard */}
                <QuestionCard 
                    qNum="CP 2" badge="Rational"
                    question="Find the inverse of f(x) = (2x + 3) / (x - 4)."
                    options={["A. (4x+3)/(x-2)", "B. (4x-3)/(x+2)", "C. (2x+4)/(x-3)", "D. (4x+3)/(x+2)"]}
                    ans="A"
                    solution={`y = (2x + 3) / (x - 4)
Swap:
x = (2y + 3) / (y - 4)

Solve:
x(y - 4) = 2y + 3
xy - 4x = 2y + 3
xy - 2y = 4x + 3
y(x - 2) = 4x + 3
y = (4x + 3) / (x - 2)`}
                />

                {/* 3. Quadratic Restricted */}
                <QuestionCard 
                    qNum="CP 3" badge="Quadratic"
                    question="Find the inverse of f(x) = x² - 4, restricted to x ≥ 0."
                    options={["A. √(x-4)", "B. √(x) + 4", "C. √(x+4)", "D. No inverse"]}
                    ans="C"
                    solution={`Because x ≥ 0, it passes the horizontal line test and has an inverse.
y = x² - 4
Swap:
x = y² - 4

Solve for y:
x + 4 = y²
y = ±√(x + 4)

Since original domain was x ≥ 0, the range of inverse must be ≥ 0. Take the positive root.
y = √(x + 4)`}
                />

                {/* 4. Radical */}
                <QuestionCard 
                    qNum="CP 4" badge="Radical"
                    question="Find the inverse of f(x) = √(3x - 2)."
                    options={["A. (x² - 2)/3", "B. (x² + 2)/3", "C. (x + 2)/3", "D. 3x² + 2"]}
                    ans="B"
                    solution={`y = √(3x - 2)
Swap:
x = √(3y - 2)

Solve for y:
Square both sides:
x² = 3y - 2
x² + 2 = 3y
y = (x² + 2) / 3

f⁻¹(x) = (x² + 2) / 3`}
                />

                {/* 5. Cubic */}
                <QuestionCard 
                    qNum="CP 5" badge="Cubic"
                    question="Find the inverse of f(x) = 2x³ + 1."
                    options={["A. ³√((x-1)/2)", "B. ³√(x-1)/2", "C. ³√(x/2) - 1", "D. (³√(x-1))/2"]}
                    ans="A"
                    solution={`y = 2x³ + 1
Swap:
x = 2y³ + 1

Solve for y:
x - 1 = 2y³
(x - 1)/2 = y³

Take cube root of both sides:
y = ³√( (x - 1)/2 )`}
                />

                {/* 6. Exponential Base e */}
                <QuestionCard 
                    qNum="CP 6" badge="Exponential"
                    question="Find the inverse of f(x) = e^(2x) - 3."
                    options={["A. ln(x+3)/2", "B. ln(x-3)/2", "C. 2*ln(x+3)", "D. ln(2x+3)"]}
                    ans="A"
                    solution={`y = e^(2x) - 3
Swap:
x = e^(2y) - 3

Solve for y:
x + 3 = e^(2y)
Take natural log (ln) of both sides:
ln(x + 3) = 2y
y = ln(x + 3) / 2

f⁻¹(x) = ln(x + 3) / 2`}
                />

                {/* 7. Logarithmic ln */}
                <QuestionCard 
                    qNum="CP 7" badge="Logarithmic"
                    question="Find the inverse of f(x) = ln(x - 4) + 2."
                    options={["A. e^(x+2) - 4", "B. e^(x-2) + 4", "C. e^(x) + 2", "D. e^(x-4) + 2"]}
                    ans="B"
                    solution={`y = ln(x - 4) + 2
Swap:
x = ln(y - 4) + 2

Solve for y:
x - 2 = ln(y - 4)
Convert to exponential form base e:
e^(x - 2) = y - 4
y = e^(x - 2) + 4

f⁻¹(x) = e^(x - 2) + 4`}
                />

                {/* 8. Rational Composite */}
                <QuestionCard 
                    qNum="CP 8" badge="Rational + Constant"
                    question="Find the inverse of f(x) = 2/(x+1) - 3."
                    options={["A. 2/(x+3) - 1", "B. 2/(x-3) + 1", "C. (2x+3)/(x-1)", "D. 1/(2x+3)"]}
                    ans="A"
                    solution={`y = 2/(x+1) - 3
Swap:
x = 2/(y+1) - 3

Solve for y:
x + 3 = 2 / (y + 1)
Multiply by (y + 1) and divide by (x + 3):
y + 1 = 2 / (x + 3)
y = 2/(x + 3) - 1

f⁻¹(x) = 2/(x + 3) - 1`}
                />

                {/* 9. Trig Identity */}
                <QuestionCard 
                    qNum="CP 9" badge="Trig Value"
                    question="Evaluate the expression: cos(cos⁻¹(0.5))."
                    options={["A. 0", "B. 1", "C. 0.5", "D. π/3"]}
                    ans="C"
                    solution={`By definition of inverse trigonometric functions, for x in the domain [-1, 1]:
f( f⁻¹(x) ) = x
cos( cos⁻¹(x) ) = x

Since 0.5 is within the domain [-1, 1], the functions simply cancel out.
Result = 0.5.`}
                />

                {/* 10. Fractional Linear */}
                <QuestionCard 
                    qNum="CP 10" badge="Fractional Linear"
                    question="Find the inverse of f(x) = (1/2)x + 3/4."
                    options={["A. 2x - 3/2", "B. 2x + 3/2", "C. (x/2) - 3/4", "D. 2x - 3"]}
                    ans="A"
                    solution={`y = x/2 + 3/4
Swap:
x = y/2 + 3/4

Solve for y:
x - 3/4 = y/2
Multiply entire equation by 2:
2(x - 3/4) = y
2x - 6/4 = y
2x - 3/2 = y

f⁻¹(x) = 2x - 3/2`}
                />

                {/* 11. Rational Numerator Only */}
                <QuestionCard 
                    qNum="CP 11" badge="Fraction"
                    question="Find the inverse of f(x) = (5x/2) + 1."
                    options={["A. 2(x-1)/5", "B. 2x/5 - 1", "C. (2x+1)/5", "D. 5(x-1)/2"]}
                    ans="A"
                    solution={`y = 5x/2 + 1
Swap:
x = 5y/2 + 1

Solve for y:
x - 1 = 5y/2
Multiply by 2/5:
2(x - 1) / 5 = y

f⁻¹(x) = 2(x - 1) / 5`}
                />

                {/* 12. Exponential Base 10 */}
                <QuestionCard 
                    qNum="CP 12" badge="Exp Base 10"
                    question="Find the inverse of f(x) = 10^(x+1)."
                    options={["A. log₁₀(x) + 1", "B. log₁₀(x) - 1", "C. ln(x) - 1", "D. 10^(x-1)"]}
                    ans="B"
                    solution={`y = 10^(x+1)
Swap:
x = 10^(y+1)

Solve for y:
Convert to logarithmic form base 10:
log₁₀(x) = y + 1
log₁₀(x) - 1 = y

f⁻¹(x) = log₁₀(x) - 1`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
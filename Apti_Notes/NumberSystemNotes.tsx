import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Hash, Sigma, Calculator, HelpCircle, 
  Lightbulb, Zap, SplitSquareHorizontal, CheckCircle2, Target, 
  Layers, ArrowRight, Eye, EyeOff, Plus, FunctionSquare
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-800 text-white shadow-lg scale-105' 
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

const QuestionCard = ({ qNum, badge = "Practice", question, options, solution, ans }) => {
  const [showSol, setShowSol] = useState(false);
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>Question {qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <p className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
        {question}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {options.map((opt, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
              showSol && opt.startsWith(ans) 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
              showSol && opt.startsWith(ans) ? 'bg-emerald-200' : 'bg-slate-100'
            }`}>
              {opt.charAt(0)}
            </span>
            {opt.slice(2)}
          </div>
        ))}
      </div>
      
      <div className="border-t border-slate-100 pt-4">
        <button 
          onClick={() => setShowSol(!showSol)} 
          className="flex items-center gap-2 text-sm font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest transition-colors"
        >
          {showSol ? (
            <>
              <EyeOff size={16}/> Hide Solution
            </>
          ) : (
            <>
              <Eye size={16}/> Show Solution
            </>
          )}
        </button>
        
        {showSol && (
          <div className="mt-4 bg-slate-800 text-white p-5 rounded-2xl text-sm leading-relaxed animate-in slide-in-from-top-2">
            <div className="text-rose-400 font-bold mb-2 uppercase tracking-widest text-xs">
              Step-by-Step Solution
            </div>
            <div className="font-mono whitespace-pre-wrap text-slate-300">
              {solution}
            </div>
            <div className="mt-3 inline-block bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg font-bold">
              Correct Option: {ans}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function NumberSystemNotes() {
  const [activeTab, setActiveTab] = useState('types');
  
  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Number System Notes
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-blue-700 bg-blue-50 border border-blue-100">
                  Complete Masterclass
                </span>
                <span>•</span>
                <span>Aptitude Foundation</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-none">
            <div className="flex w-full min-w-max gap-1">
            <TabButton 
              active={activeTab === 'types'} 
              onClick={() => setActiveTab('types')} 
              icon={<Layers size={16}/>} 
              label="Number Types" 
            />
            <TabButton 
              active={activeTab === 'formulas'} 
              onClick={() => setActiveTab('formulas')} 
              icon={<Sigma size={16}/>} 
              label="Formula Vault" 
            />
            <TabButton 
              active={activeTab === 'divisibility'} 
              onClick={() => setActiveTab('divisibility')} 
              icon={<SplitSquareHorizontal size={16}/>} 
              label="Divisibility Rules" 
            />
            <TabButton 
              active={activeTab === 'tricks'} 
              onClick={() => setActiveTab('tricks')} 
              icon={<Zap size={16}/>} 
              label="Speed Math Tricks" 
            />
            <TabButton 
              active={activeTab === 'practice'} 
              onClick={() => setActiveTab('practice')} 
              icon={<Target size={16}/>} 
              label="Solved Examples" 
            />
            </div>
          </div>
        </div>

        {/* --- TAB 1: NUMBER TYPES --- */}
        {activeTab === 'types' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <SectionTitle 
              icon={<Layers size={28}/>} 
              title="Classification of Numbers" 
              colorClass="text-blue-600" 
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Complex & Imaginary */}
              <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg lg:col-span-3 grid md:grid-cols-2 gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10">
                  <Hash size={150}/>
                </div>
                <div>
                  <h3 className="font-black text-xl text-blue-400 mb-2">Complex Numbers</h3>
                  <p className="text-slate-300 text-sm mb-3">
                    The ultimate superset of all numbers. Formatted as <span className="font-mono bg-white/10 px-1 rounded text-white">a + bi</span>, where 'a' and 'b' are real numbers and 'i' is the imaginary unit.
                  </p>
                </div>
                <div>
                  <h3 className="font-black text-xl text-purple-400 mb-2">Imaginary Numbers</h3>
                  <p className="text-slate-300 text-sm mb-3">
                    Numbers that do not exist on the number line. Example: square roots of negative numbers. Denoted by 'i' or 'j'.
                  </p>
                </div>
              </div>
              
              {/* Real, Rational, Irrational */}
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-3xl">
                <h3 className="font-black text-blue-800 text-lg mb-2">Real Numbers</h3>
                <p className="text-sm text-blue-900/70">
                  All numbers that can be perfectly represented on the number line.
                </p>
              </div>
              
              <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-3xl">
                <h3 className="font-black text-sky-800 text-lg mb-2">Rational Numbers</h3>
                <p className="text-sm text-sky-900/70 mb-3">
                  Numbers in the form of <span className="font-mono font-bold text-sky-700">p/q</span> where p, q are integers and q ≠ 0.
                </p>
                <div className="bg-white p-3 rounded-xl shadow-sm text-xs font-mono text-sky-800 space-y-1">
                  <div>• Terminating: 15/5 = 3, 1/2 = 0.5</div>
                  <div>• Non-Terminating: 19/6 = 3.166...</div>
                </div>
              </div>
              <div className="bg-cyan-50 border-2 border-cyan-200 p-6 rounded-3xl">
                <h3 className="font-black text-cyan-800 text-lg mb-2">Irrational Numbers</h3>
                <p className="text-sm text-cyan-900/70 mb-3">
                  Cannot be written as a simple fraction. They are non-terminating and non-periodic.
                </p>
                <div className="bg-white p-3 rounded-xl shadow-sm text-xs font-mono text-cyan-800">
                  Example: √2 = 1.414...
                </div>
              </div>
              
              {/* Integers, Whole, Natural */}
              <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-3xl">
                <h3 className="font-black text-emerald-800 text-lg mb-2">Integers (Z)</h3>
                <p className="text-sm text-emerald-900/70 mb-3">
                  All numbers without decimal places. Positives, negatives, and zero.
                </p>
                <div className="bg-white p-3 rounded-xl shadow-sm text-xs font-mono text-emerald-800 font-bold">
                  {`{... -2, -1, 0, 1, 2 ...}`}
                </div>
              </div>
              
              <div className="bg-teal-50 border-2 border-teal-200 p-6 rounded-3xl">
                <h3 className="font-black text-teal-800 text-lg mb-2">Whole Numbers (W)</h3>
                <p className="text-sm text-teal-900/70 mb-3">
                  All natural numbers plus zero. (Non-negative integers).
                </p>
                <div className="bg-white p-3 rounded-xl shadow-sm text-xs font-mono text-teal-800 font-bold">
                  {`{0, 1, 2, 3, 4 ...}`}
                </div>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 p-6 rounded-3xl">
                <h3 className="font-black text-green-800 text-lg mb-2">Natural Numbers (N)</h3>
                <p className="text-sm text-green-900/70 mb-3">
                  All positive counting numbers from 1 to infinity.
                </p>
                <div className="bg-white p-3 rounded-xl shadow-sm text-xs font-mono text-green-800 font-bold">
                  {`{1, 2, 3, 4, 5 ...}`}
                </div>
              </div>
            </div>
            
            {/* Properties Grid */}
            <h3 className="font-black text-lg text-slate-800 mt-10 mb-4 uppercase tracking-widest border-b pb-2">
              Number Properties
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-100 p-4 rounded-2xl text-center">
                <span className="block font-black text-slate-800 uppercase text-sm">Even</span>
                <span className="text-xs text-slate-500 font-mono mt-1 block">
                  Divisible by 2<br/>(2, 4, 6...)
                </span>
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl text-center">
                <span className="block font-black text-slate-800 uppercase text-sm">Odd</span>
                <span className="text-xs text-slate-500 font-mono mt-1 block">
                  Not div by 2<br/>(1, 3, 5...)
                </span>
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl text-center">
                <span className="block font-black text-slate-800 uppercase text-sm">Prime</span>
                <span className="text-xs text-slate-500 font-mono mt-1 block">
                  Exactly 2 factors<br/>(2, 3, 5, 7...)
                </span>
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl text-center">
                <span className="block font-black text-slate-800 uppercase text-sm">Composite</span>
                <span className="text-xs text-slate-500 font-mono mt-1 block">
                  More than 2 factors<br/>(4, 6, 8, 9...)
                </span>
              </div>
              <div className="bg-amber-100 p-4 rounded-2xl text-center border-2 border-amber-300">
                <span className="block font-black text-amber-800 uppercase text-sm">Co-Prime</span>
                <span className="text-xs text-amber-700 font-mono mt-1 block font-bold">
                  HCF = 1<br/>(e.g., 8 and 15)
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* --- TAB 2: FORMULA VAULT --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <SectionTitle 
              icon={<Sigma size={28}/>} 
              title="The Formula Vault" 
              colorClass="text-indigo-600" 
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Series Summation */}
              <div className="bg-indigo-50 rounded-3xl p-6 border-2 border-indigo-200">
                <h3 className="font-black text-indigo-800 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                  <Plus size={16}/> Number Series Summation
                </h3>
                <ul className="space-y-3 font-mono text-sm text-indigo-900 font-bold">
                  <li className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                    1 + 2 + 3 ... + n = <span className="text-indigo-600">n(n + 1) / 2</span>
                  </li>
                  <li className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                    1² + 2² + 3² ... + n² = <span className="text-indigo-600">n(n + 1)(2n + 1) / 6</span>
                  </li>
                  <li className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                    1³ + 2³ + 3³ ... + n³ = <span className="text-indigo-600">[ n(n + 1) / 2 ]²</span>
                  </li>
                  <li className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                    First 'n' ODD numbers = <span className="text-indigo-600">n²</span>
                  </li>
                  <li className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                    First 'n' EVEN numbers = <span className="text-indigo-600">n(n + 1)</span>
                  </li>
                </ul>
              </div>
              {/* Algebraic Expansions */}
              <div className="bg-fuchsia-50 rounded-3xl p-6 border-2 border-fuchsia-200">
                <h3 className="font-black text-fuchsia-800 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                  <FunctionSquare size={16}/> Algebraic Expansions
                </h3>
                <ul className="space-y-3 font-mono text-sm text-fuchsia-900 font-bold">
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a + b)² = <span className="text-fuchsia-600">a² + b² + 2ab</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a - b)² = <span className="text-fuchsia-600">a² + b² - 2ab</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a + b)(a - b) = <span className="text-fuchsia-600">a² - b²</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a + b + c)² = <span className="text-fuchsia-600">a² + b² + c² + 2(ab + bc + ca)</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a³ + b³) = <span className="text-fuchsia-600">(a + b)(a² - ab + b²)</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a³ - b³) = <span className="text-fuchsia-600">(a - b)(a² + ab + b²)</span>
                  </li>
                  <li className="bg-white p-3 rounded-xl shadow-sm border border-fuchsia-100">
                    (a³ + b³ + c³ - 3abc) = <span className="text-fuchsia-600">(a+b+c)(a²+b²+c²-ab-bc-ca)</span>
                  </li>
                  <li className="bg-slate-800 text-amber-300 p-3 rounded-xl shadow-sm">
                    If a+b+c = 0 ➔ a³ + b³ + c³ = 3abc
                  </li>
                </ul>
              </div>
              
              {/* Factorials & Roots */}
              <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 md:col-span-2 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-black text-emerald-800 uppercase tracking-widest text-sm mb-3">
                    Factorials (n!)
                  </h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 font-mono text-sm text-emerald-900 space-y-2">
                    <div><strong>n! = n × (n-1) × (n-2) ... × 1</strong></div>
                    <div><strong>n! = n × (n - 1)!</strong></div>
                    <div className="text-slate-500 pt-2 border-t border-emerald-50">
                      Ex: 7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5040
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-emerald-800 uppercase tracking-widest text-sm mb-3">
                    Nested Square Roots
                  </h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 font-mono text-sm text-emerald-900 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4">
                      <span className="text-lg">√(x√(x√(x...)))</span>
                      <span>=</span>
                      <span className="text-xl text-emerald-600">x<sup>(2<sup>n</sup> - 1) / 2<sup>n</sup></sup></span>
                    </div>
                    <div className="text-slate-500 mt-2 text-xs">
                      Where 'n' is the number of terms.
                    </div>
                    <div className="bg-emerald-50 p-2 mt-2 rounded border border-emerald-100 text-xs">
                      Ex: √(5√(5√(5√5))) ➔ n=4 ➔ 5<sup>(16-1)/16</sup> = 5<sup>15/16</sup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: DIVISIBILITY RULES --- */}
        {activeTab === 'divisibility' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <SectionTitle 
              icon={<SplitSquareHorizontal size={28}/>} 
              title="Divisibility Rules" 
              colorClass="text-emerald-600" 
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    2
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 2</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Last digit must be an even number (0, 2, 4, 6, 8).
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 124<span className="bg-emerald-100 px-1 rounded">6</span>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    3
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 3</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Sum of all digits must be divisible by 3.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 123 ➔ 1+2+3 = 6 (Div by 3)
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    4
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 4</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  The number formed by the LAST TWO digits is divisible by 4.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 15<span className="bg-emerald-100 px-1 rounded">24</span> ➔ 24 is div by 4
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    5
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 5</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Last digit must be exactly 0 or 5.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 34<span className="bg-emerald-100 px-1 rounded">5</span>, 10<span className="bg-emerald-100 px-1 rounded">0</span>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    6
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 6</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Number must be divisible by BOTH 2 and 3.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 36 (Even, and 3+6=9)
                </div>
              </div>
              
              <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xl">
                    7
                  </div>
                  <span className="font-black text-amber-900 uppercase">Rule of 7</span>
                </div>
                <p className="text-sm text-amber-900/80 mb-2">
                  Double the last digit, subtract it from the remaining number. Check if result is divisible by 7.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border border-amber-200 text-amber-700 font-bold">
                  Ex: 343 ➔ 34 - (3×2) = 28 (Div by 7)
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    8
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 8</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  The number formed by the LAST THREE digits is divisible by 8.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 5<span className="bg-emerald-100 px-1 rounded">120</span> ➔ 120 is div by 8
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow hover:border-emerald-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    9
                  </div>
                  <span className="font-black text-slate-700 uppercase">Rule of 9</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Sum of all digits must be divisible by 9.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border text-emerald-600 font-bold">
                  Ex: 729 ➔ 7+2+9 = 18 (Div by 9)
                </div>
              </div>
              
              <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xl">
                    11
                  </div>
                  <span className="font-black text-amber-900 uppercase">Rule of 11</span>
                </div>
                <p className="text-sm text-amber-900/80 mb-2">
                  Difference between the sum of alternative digits must be 0 or divisible by 11.
                </p>
                <div className="font-mono text-xs bg-white p-2 rounded border border-amber-200 text-amber-700 font-bold">
                  Ex: 1331 ➔ (1+3) - (3+1) = 0
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: SPEED MATH TRICKS --- */}
        {activeTab === 'tricks' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle 
              icon={<Zap size={28}/>} 
              title="Speed Math Tricks" 
              colorClass="text-amber-500" 
            />
            
            {/* Squaring Tricks */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-amber-500"/> Finding Squares Instantly
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Universal 2-Digit Trick */}
                <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                    <Zap size={100}/>
                  </div>
                  <h4 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-4 z-10 relative">
                    Universal 2-Digit (Ex: 56²)
                  </h4>
                  <ol className="space-y-3 text-sm text-slate-300 font-mono z-10 relative">
                    <li>
                      <strong className="text-white bg-white/10 px-2 py-0.5 rounded">Step 1:</strong> Square digits independently.<br/>
                      5² = 25, 6² = 36 ➔ <span className="text-amber-300 font-bold">2536</span>
                    </li>
                    <li>
                      <strong className="text-white bg-white/10 px-2 py-0.5 rounded">Step 2:</strong> Multiply digits & double, add zero.<br/>
                      5 × 6 = 30 ➔ 300 ➔ 300 × 2 = <span className="text-amber-300 font-bold">600</span>
                    </li>
                    <li>
                      <strong className="text-white bg-white/10 px-2 py-0.5 rounded">Step 3:</strong> Add both numbers.<br/>
                      2536 + 600 = <span className="text-emerald-400 font-bold text-lg">3136</span>
                    </li>
                  </ol>
                </div>
                {/* Near 100 Trick */}
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl">
                  <h4 className="font-black text-amber-800 uppercase tracking-widest text-sm mb-4">
                    Near 100 (Ex: 97², 107²)
                  </h4>
                  <div className="space-y-4 text-sm font-mono text-amber-900">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100">
                      <div className="font-bold text-amber-700 mb-1">Method for 97² : (100 - 3)²</div>
                      <div>100² + 3² - 2(100)(3)</div>
                      <div>10000 + 9 - 600 = <strong className="text-lg">9409</strong></div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100">
                      <div className="font-bold text-amber-700 mb-1">Method for 107² : (100 + 7)²</div>
                      <div>100² + 7² + 2(100)(7)</div>
                      <div>10000 + 49 + 1400 = <strong className="text-lg">11449</strong></div>
                    </div>
                  </div>
                </div>
                
                {/* Near 50 Trick */}
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl">
                  <h4 className="font-black text-amber-800 uppercase tracking-widest text-sm mb-4">
                    Near 50 (Ex: 53², 42²)
                  </h4>
                  <div className="space-y-4 text-sm font-mono text-amber-900">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100">
                      <div className="font-bold text-amber-700 mb-1">Method for 53² : Base 25</div>
                      <div>Diff from 50 = +3</div>
                      <div>LHS: 25 + 3 = 28</div>
                      <div>RHS: 3² = 09</div>
                      <div>Ans: <strong className="text-lg">2809</strong></div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100">
                      <div className="font-bold text-amber-700 mb-1">Method for 42² : Base 25</div>
                      <div>Diff from 50 = -8</div>
                      <div>LHS: 25 - 8 = 17</div>
                      <div>RHS: 8² = 64</div>
                      <div>Ans: <strong className="text-lg">1764</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Square Root Tricks */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Zap size={20} className="text-amber-500"/> Square Root of Perfect Squares
              </h3>
              <div className="bg-sky-50 border-2 border-sky-200 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
                <div className="font-mono text-6xl font-black text-sky-800 bg-white p-6 rounded-3xl shadow-lg shrink-0">
                  √3136
                </div>
                <div className="space-y-4 font-mono text-sm text-sky-900 w-full">
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-sky-100">
                    <span className="bg-sky-200 text-sky-800 px-2 rounded font-black">Step 1</span>
                    <div>Check Unit Digit: It's <strong>6</strong>. A square ends in 6 only if the number ends in <strong>4</strong> or <strong>6</strong>.</div>
                  </div>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-sky-100">
                    <span className="bg-sky-200 text-sky-800 px-2 rounded font-black">Step 2</span>
                    <div>Check First Two Digits: <strong>31</strong>. This lies between 5²(25) and 6²(36). Take the smaller base: <strong>5</strong>. Options are now <strong>54</strong> or <strong>56</strong>.</div>
                  </div>
                  <div className="flex gap-4 items-start bg-emerald-50 p-4 rounded-xl shadow-sm border border-emerald-200">
                    <span className="bg-emerald-200 text-emerald-800 px-2 rounded font-black">Step 3</span>
                    <div>Multiply base by next number: 5 × 6 = <strong>30</strong>. Compare with 31. Since 31 &gt; 30, pick the larger option. Answer = <strong className="text-emerald-700 text-lg">56</strong>.</div>
                  </div>
                </div>
              </div>
            </div>
            {/* HCF/LCM Tricks */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Hash size={20} className="text-amber-500"/> HCF & LCM Shortcuts
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-fuchsia-50 p-6 rounded-3xl border border-fuchsia-200 shadow-sm">
                  <h4 className="font-black text-fuchsia-800 uppercase tracking-widest text-sm mb-4">
                    1. Fraction Rule
                  </h4>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-fuchsia-100 font-mono text-sm text-fuchsia-900 space-y-3 font-bold">
                    <div>
                      <span className="text-fuchsia-600">HCF of Fractions</span> = <br/>
                      (HCF of Numerators) / (LCM of Denominators)
                    </div>
                    <div className="h-px bg-fuchsia-100 w-full"></div>
                    <div>
                      <span className="text-fuchsia-600">LCM of Fractions</span> = <br/>
                      (LCM of Numerators) / (HCF of Denominators)
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm">
                  <h4 className="font-black text-emerald-800 uppercase tracking-widest text-sm mb-4">
                    2. Co-Prime & Ratio Rules
                  </h4>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 font-mono text-sm text-emerald-900 space-y-3">
                    <div className="font-bold text-emerald-700">If numbers are Co-Prime (e.g. 8, 15):</div>
                    <ul className="list-disc pl-5">
                      <li>HCF is ALWAYS 1</li>
                      <li>LCM is ALWAYS their Product</li>
                    </ul>
                    <div className="h-px bg-emerald-100 w-full"></div>
                    <div className="font-bold text-emerald-700">If ratio is a:b and HCF is H:</div>
                    <ul className="list-disc pl-5">
                      <li>The numbers are (a×H) and (b×H)</li>
                      <li>LCM is H × a × b</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* --- TAB 5: SOLVED EXAMPLES --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Solved Examples & Patterns" 
              colorClass="text-rose-600" 
            />
            
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-rose-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Applying the Theory</h3>
                <p className="text-sm font-medium mt-1">
                  Master these common question types. Using the formulas and tricks here will save you minutes per question!
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <QuestionCard 
                qNum={1}
                badge="Type - 1"
                question="34567 x 9999 = ?"
                options={["A. 345635432", "B. 345634533", "C. 345635433", "D. 345635343"]}
                ans="C"
                solution={`34567 x 9999 = 34567 x (10000 - 1)
34567 x 9999 = 34567 x (10000) - 34567 x 1
34567 x 9999 = 345670000 - 34567
34567 x 9999 = 345635433`}
              />
              
              <QuestionCard 
                qNum={2}
                badge="Type - 2"
                question="The smallest 3 digit prime number is:"
                options={["A. 100", "B. 103", "C. 105", "D. 101"]}
                ans="D"
                solution={`The smallest three digit number is 100 but it is not a prime number. 
The next number is 101 and it is a prime number because it is divisible by 1 and itself only. 
Therefore, 101 is the smallest 3 digit prime number.`}
              />
              
              <QuestionCard 
                qNum={3}
                badge="Type - 2"
                question="Choose the terminating decimal:"
                options={["A. 99.5555...", "B. 3.777...", "C. 0.6", "D. 0.454545..."]}
                ans="C"
                solution={`A terminating decimal is a decimal that ends after a few repetitions after the decimal point. 0.6 terminates exactly, while the others repeat infinitely.`}
              />
              
              <QuestionCard 
                qNum={4}
                badge="Type - 2"
                question="Which of the following is not a Natural number?"
                options={["A. 1", "B. 3", "C. 0", "D. 5"]}
                ans="C"
                solution={`All counting numbers from 1 to infinity are natural numbers. 0 is a whole number, but it is not a natural number.`}
              />
              
              <QuestionCard 
                qNum={5}
                badge="Type - 2"
                question="Choose the non-terminating decimal:"
                options={["A. 4/45", "B. 5/8", "C. 1/4", "D. 9/1280"]}
                ans="A"
                solution={`4/45 = 0.08888... (Non-terminating)
5/8 = 0.625 (Terminating)
1/4 = 0.25 (Terminating)
9/1280 = 0.00703125 (Terminating)`}
              />

              <QuestionCard 
                qNum={6}
                badge="Type - 3"
                question="6596 - ? = 6459 - 3357"
                options={["A. 3949", "B. 3494", "C. 3102", "D. 3499"]}
                ans="B"
                solution={`Let the unknown be x.
6596 - x = 3102
-x = 3102 - 6596
-x = -3494
x = 3494`}
              />

              <QuestionCard 
                qNum={7}
                badge="Type - 3"
                question="Which one of the following cannot be the square of a natural number?"
                options={["A. 7225", "B. 3136", "C. 8100", "D. 3457"]}
                ans="D"
                solution={`7225 = (85)²
3136 = (56)²
8100 = (90)²

3457 is not the square of any natural number as the square of any natural number never ends with 2, 3, 7, or 8.`}
              />

              <QuestionCard 
                qNum={8}
                badge="Type - 3"
                question="What is the unit digit in the product (3⁶⁵ x 6⁵⁹ x 7⁷¹)?"
                options={["A. 1", "B. 2", "C. 3", "D. 4"]}
                ans="D"
                solution={`Unit digit cycle of 3 is 4: 3⁶⁵ = (3⁴)¹⁶ × 3¹ ➔ Unit digit is 3.
Unit digit of 6 to any power is always 6.
Unit digit cycle of 7 is 4: 7⁷¹ = (7⁴)¹⁷ × 7³ ➔ Unit digit is 3 (since 7³ = 343).

Required digit = Unit digit in (3 x 6 x 3) = 54 ➔ Unit digit is 4.`}
              />

              <QuestionCard 
                qNum={9}
                badge="Type - 3"
                question="117 * 117 + 83 * 83 = ?"
                options={["A. 40578", "B. 20578", "C. 31090", "D. 34567"]}
                ans="B"
                solution={`(117)² + (83)² = (100 + 17)² + (100 - 17)²
Using the formula (a+b)² + (a-b)² = 2(a² + b²)
= 2 * [(100)² + (17)²]
= 2 * (10000 + 289)
= 2 * 10289
= 20578`}
              />
            </div>
            {/* Hidden Exam Patterns */}
            <h3 className="font-black text-xl text-slate-800 mt-10 mb-4 uppercase tracking-widest border-b pb-2">
              Common Exam Traps
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <h4 className="font-black text-rose-400 mb-2 uppercase tracking-widest text-sm">
                  Trap 1: Giant Fraction
                </h4>
                <p className="text-xs text-slate-300 font-mono mb-3">
                  Numerator: a³ + b³ <br/>
                  Denominator: a² - ab + b²
                </p>
                <p className="text-sm">
                  <strong>Trick:</strong> Don't calculate! The complex denominator cancels out. Answer is simply <span className="bg-rose-500/20 text-rose-300 px-1 rounded font-bold">a + b</span>.
                </p>
              </div>
              
              <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <h4 className="font-black text-sky-400 mb-2 uppercase tracking-widest text-sm">
                  Trap 2: Zero Sum Cubes
                </h4>
                <p className="text-xs text-slate-300 font-mono mb-3">
                  Find: 55³ + 17³ - 72³
                </p>
                <p className="text-sm">
                  <strong>Trick:</strong> Notice 55 + 17 - 72 = 0. Use the conditional formula. Answer is simply <span className="bg-sky-500/20 text-sky-300 px-1 rounded font-bold">3 × 55 × 17 × -72</span>.
                </p>
              </div>
              
              <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <h4 className="font-black text-amber-400 mb-2 uppercase tracking-widest text-sm">
                  Trap 3: Tolling Bells
                </h4>
                <p className="text-xs text-slate-300 font-mono mb-3">
                  Bells ring at intervals. When will they ring together?
                </p>
                <p className="text-sm">
                  <strong>Trick:</strong> Simultaneous future events require finding the <span className="bg-amber-500/20 text-amber-300 px-1 rounded font-bold">LCM</span> of the given intervals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
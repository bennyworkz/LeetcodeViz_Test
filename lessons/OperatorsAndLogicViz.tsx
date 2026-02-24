import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Cpu, Play, Pause, RefreshCw, Calculator, ToggleRight, 
  PlusSquare, Zap, Target
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Operators {
    public static void main(String[] args) {
        int a = 5;
        
        // 1. Unary Operator (Post-Increment)
        int b = a++; 
        
        // 2. Arithmetic & Relational Operators
        boolean check = (a + b) > 10;
        
        // 3. Logical Operators (Short-Circuit)
        boolean isValid = check && (a == 6);
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. JVM Startup",
    desc: "The program begins. The Stack is empty, waiting for variables to be declared.",
    vars: [],
    alu: null
  },
  {
    line: 3,
    phase: "2. Variable Initialization",
    desc: "int a = 5; The variable 'a' is created and stored in the Stack memory.",
    vars: [{ id: "a", val: 5, type: "int", active: true }],
    alu: null
  },
  {
    line: 6,
    phase: "3. Post-Increment (Read Phase)",
    desc: "int b = a++; This is tricky! Because the '++' is AFTER the 'a', Java reads the CURRENT value of 'a' (5) and assigns it to 'b' FIRST.",
    vars: [
        { id: "a", val: 5, type: "int" },
        { id: "b", val: 5, type: "int", active: true, color: "sky" }
    ],
    alu: null
  },
  {
    line: 6,
    phase: "4. Post-Increment (Update Phase)",
    desc: "Immediately after 'b' gets the value 5, the background increment operation triggers, bumping 'a' up to 6.",
    vars: [
        { id: "a", val: 6, type: "int", highlight: true },
        { id: "b", val: 5, type: "int", color: "sky" }
    ],
    alu: { left: "a (5)", op: "++", right: "", res: "6", active: true }
  },
  {
    line: 9,
    phase: "5. Arithmetic Evaluation",
    desc: "boolean check = (a + b) > 10; Parentheses go first. The CPU's ALU loads 'a' (6) and 'b' (5) to perform addition.",
    vars: [
        { id: "a", val: 6, type: "int" },
        { id: "b", val: 5, type: "int", color: "sky" }
    ],
    alu: { left: "6", op: "+", right: "5", res: "11", active: true }
  },
  {
    line: 9,
    phase: "6. Relational Evaluation",
    desc: "Now it evaluates the > operator. Is 11 strictly greater than 10? Yes.",
    vars: [
        { id: "a", val: 6, type: "int" },
        { id: "b", val: 5, type: "int", color: "sky" }
    ],
    alu: { left: "11", op: ">", right: "10", res: "true", active: true, isBool: true }
  },
  {
    line: 9,
    phase: "7. Store Boolean Result",
    desc: "The final evaluated result (true) is stored in the new Stack variable 'check'.",
    vars: [
        { id: "a", val: 6, type: "int" },
        { id: "b", val: 5, type: "int", color: "sky" },
        { id: "check", val: "true", type: "boolean", active: true, color: "emerald" }
    ],
    alu: null
  },
  {
    line: 12,
    phase: "8. Logical AND (Left Side)",
    desc: "isValid = check && (a == 6); Evaluates left-to-right. It reads 'check', which is true.",
    vars: [
        { id: "a", val: 6, type: "int" },
        { id: "b", val: 5, type: "int", color: "sky" },
        { id: "check", val: "true", type: "boolean", color: "emerald", highlight: true }
    ],
    alu: { left: "true", op: "&&", right: "?", res: "Pending...", active: true, isBool: true }
  },
  {
    line: 12,
    phase: "9. Logical AND (Right Side)",
    desc: "Because the left side was true, AND (&&) needs to check the right side too. Is (a == 6)? Yes, 6 equals 6.",
    vars: [
        { id: "a", val: 6, type: "int", highlight: true },
        { id: "b", val: 5, type: "int", color: "sky" },
        { id: "check", val: "true", type: "boolean", color: "emerald" }
    ],
    alu: { left: "true", op: "&&", right: "true", res: "true", active: true, isBool: true }
  },
  {
    line: 12,
    phase: "10. Final Assignment",
    desc: "Both sides were true, so the && expression results in true. It is stored in 'isValid'.",
    vars: [
        { id: "a", val: 6, type: "int" },
        { id: "b", val: 5, type: "int", color: "sky" },
        { id: "check", val: "true", type: "boolean", color: "emerald" },
        { id: "isValid", val: "true", type: "boolean", active: true, color: "fuchsia" }
    ],
    alu: null
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "sky" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        indigo: 'text-indigo-600',
        rose: 'text-rose-600'
    };
    const activeColor = colorMap[color] || 'text-sky-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|boolean)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-sky-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'lesson' | 'theory' | 'interview'>('simulator');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < STEPS.length - 1) {
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 4000); 
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const handleNext = () => { setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1)); setIsPlaying(false); };
  const handlePrev = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };
  const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };
  const togglePlay = () => {
      if (currentStep === STEPS.length - 1) setCurrentStep(0);
      setIsPlaying(!isPlaying);
  };
  
  const handleCopy = () => { 
    navigator.clipboard.writeText(CODE_STRING); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-sky-200 flex items-center justify-center relative overflow-hidden group">
                <Calculator className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Operators & Logic</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded tracking-widest uppercase border border-sky-100">Logic Building Core</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Expressions & ALU</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="sky" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="amber" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Precedence" color="indigo" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Tricks" color="rose" />
          </div>
        </div>

        {/* --- VISUALIZER TAB --- */}
        {activeTab === 'simulator' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                
                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-sky-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">Operators.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto h-[320px]">
                      {CODE_STRING.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                      ))}
                  </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-lg border transition-all duration-300 relative overflow-hidden flex-1 flex flex-col bg-white border-slate-200`}>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity size={16} className="text-sky-500"/>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Trace Log</span>
                     </div>
                     {cur.line > 0 && (
                        <div className="px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono tracking-wider border bg-slate-100 text-slate-600 border-slate-200">
                            Line {cur.line}
                        </div>
                     )}
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 text-slate-800 flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-sky-300">
                      {cur.desc}
                  </p>

                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex gap-3">
                    <button onClick={handleReset} className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors tooltip" title="Reset">
                      <RefreshCw size={18}/>
                    </button>
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-slate-600">
                      <ChevronLeft size={18}/> Prev
                    </button>
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-sky-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Cpu size={20} className="text-sky-500"/> ALU & Memory State
                        </h3>
                    </div>

                    <div className="flex flex-col gap-6 flex-1 relative">
                        
                        {/* THE STACK MEMORY */}
                        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono mb-4 flex items-center gap-2">
                                <Layers size={14}/> Stack Variables
                            </span>
                            <div className="flex flex-wrap gap-4">
                                {cur.vars.map((v, idx) => {
                                    const c = v.color === 'sky' ? 'sky' : v.color === 'emerald' ? 'emerald' : v.color === 'fuchsia' ? 'fuchsia' : 'slate';
                                    return (
                                        <div key={idx} className={`relative flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${v.active ? 'scale-105 shadow-md z-10 ring-4' : ''} ${v.highlight ? `border-${c}-400 ring-${c}-100` : 'border-slate-200 ring-transparent'}`}>
                                            <div className="text-[9px] font-mono font-black px-3 py-1 flex justify-between bg-slate-100 text-slate-500 border-b border-slate-200">
                                                <span>{v.type}</span>
                                                <span className="ml-3">{v.id}</span>
                                            </div>
                                            <div className={`font-mono font-black text-center py-3 px-4 text-xl flex items-center justify-center gap-1 bg-white ${c === 'slate' ? 'text-slate-700' : `text-${c}-600`}`}>
                                                {v.val}
                                            </div>
                                        </div>
                                    )
                                })}
                                {cur.vars.length === 0 && <div className="text-xs font-mono italic text-slate-400 py-4">Waiting for initialization...</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-center -my-2 relative z-10">
                            <ArrowRight size={24} className="text-sky-300 rotate-90"/>
                        </div>

                        {/* ARITHMETIC LOGIC UNIT (ALU) */}
                        <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                            <div className="absolute top-0 w-full bg-slate-800/80 border-b border-slate-700 px-4 py-2.5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2"><Cpu size={14}/> Processor (ALU)</span>
                                {cur.alu && <span className="px-2 py-0.5 rounded text-[8px] font-black bg-sky-500/20 text-sky-400 border border-sky-500/50 uppercase tracking-widest">Evaluating</span>}
                            </div>

                            {cur.alu ? (
                                <div className="flex flex-col items-center gap-6 mt-6 animate-in zoom-in-95 duration-500">
                                    <div className="flex items-center gap-4">
                                        {/* Left Operand */}
                                        <div className="bg-slate-800 border-2 border-slate-600 text-white font-mono font-black text-2xl px-6 py-4 rounded-2xl shadow-inner min-w-[80px] text-center">
                                            {cur.alu.left}
                                        </div>
                                        
                                        {/* Operator */}
                                        <div className="text-sky-400 font-black text-3xl font-mono mx-2">
                                            {cur.alu.op}
                                        </div>
                                        
                                        {/* Right Operand (Might be empty for Unary) */}
                                        {cur.alu.right !== "" && (
                                            <div className="bg-slate-800 border-2 border-slate-600 text-white font-mono font-black text-2xl px-6 py-4 rounded-2xl shadow-inner min-w-[80px] text-center">
                                                {cur.alu.right}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col items-center mt-2">
                                        <ArrowRight className="text-slate-600 rotate-90 mb-4" size={24}/>
                                        <div className={`font-mono font-black text-3xl px-8 py-4 rounded-2xl border-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-3 transition-colors ${cur.alu.isBool ? (cur.alu.res === 'true' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-rose-500/20 text-rose-400 border-rose-500') : 'bg-sky-500/20 text-sky-400 border-sky-500'}`}>
                                            {cur.alu.res}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-600 gap-3">
                                    <Zap size={32} className="opacity-20"/>
                                    <span className="font-mono text-sm uppercase tracking-widest font-bold">ALU Idle</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- LESSON TAB --- */}
        {activeTab === 'lesson' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px]">
            <div className="max-w-4xl space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                  <PlusSquare className="text-amber-500" size={32}/> The 4 Core Operators
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-amber-200 pl-6 mb-8">
                  Data sitting in memory is useless. We need to manipulate it, compare it, and combine it. Java provides specific mathematical symbols (operators) to do this work.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Calculator size={18} className="text-sky-500"/> Arithmetic</h3>
                        <p className="text-sm mb-4">Standard math. They take numbers and produce a new number.</p>
                        <ul className="text-sm font-mono bg-white p-3 rounded-xl border border-slate-100 space-y-2">
                            <li><span className="font-bold text-sky-600">+</span> Addition</li>
                            <li><span className="font-bold text-sky-600">-</span> Subtraction</li>
                            <li><span className="font-bold text-sky-600">*</span> Multiplication</li>
                            <li><span className="font-bold text-sky-600">/</span> Division (Truncates decimals!)</li>
                            <li><span className="font-bold text-sky-600">%</span> Modulo (Returns remainder)</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><ToggleRight size={18} className="text-rose-500"/> Relational</h3>
                        <p className="text-sm mb-4">Comparison. They take numbers and ALWAYS produce a <code>boolean</code> (true/false).</p>
                        <ul className="text-sm font-mono bg-white p-3 rounded-xl border border-slate-100 space-y-2 grid grid-cols-2 gap-x-4 gap-y-2">
                            <li><span className="font-bold text-rose-600">==</span> Equals</li>
                            <li><span className="font-bold text-rose-600">!=</span> Not Equals</li>
                            <li><span className="font-bold text-rose-600">&gt;</span> Greater</li>
                            <li><span className="font-bold text-rose-600">&lt;</span> Less</li>
                            <li><span className="font-bold text-rose-600">&gt;=</span> Greater/Eq</li>
                            <li><span className="font-bold text-rose-600">&lt;=</span> Less/Eq</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Target size={18} className="text-amber-500"/> Logical</h3>
                        <p className="text-sm mb-4">Combining truths. They take booleans and produce a final boolean.</p>
                        <ul className="text-sm font-mono bg-white p-3 rounded-xl border border-slate-100 space-y-2">
                            <li><span className="font-bold text-amber-600">&&</span> AND (Both must be true)</li>
                            <li><span className="font-bold text-amber-600">||</span> OR (At least one is true)</li>
                            <li><span className="font-bold text-amber-600">!</span> NOT (Flips true to false)</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><Activity size={18} className="text-emerald-500"/> Unary & Assignment</h3>
                        <p className="text-sm mb-4">Operators that only need a single variable to operate on.</p>
                        <ul className="text-sm font-mono bg-white p-3 rounded-xl border border-slate-100 space-y-2">
                            <li><span className="font-bold text-emerald-600">=</span> Assignment (Store value)</li>
                            <li><span className="font-bold text-emerald-600">++</span> Increment (Add 1)</li>
                            <li><span className="font-bold text-emerald-600">--</span> Decrement (Sub 1)</li>
                            <li><span className="font-bold text-emerald-600">+=</span> Add and assign (x += 5)</li>
                        </ul>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- THEORY TAB --- */}
        {activeTab === 'theory' && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-12">
            
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Layers className="text-indigo-500"/> Order of Precedence
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-200 pl-6">
                If you write <code>boolean res = 5 + 3 * 2 &gt; 10 && true;</code>, how does Java know what to calculate first? It follows strict Precedence Rules (like BODMAS in math).
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 overflow-hidden">
                <div className="flex flex-col space-y-4 font-mono text-sm">
                    <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-xl">
                        <div className="bg-indigo-500 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">1</div>
                        <div className="text-indigo-300 w-24">Parentheses</div>
                        <div><code>( )</code></div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl">
                        <div className="bg-slate-600 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">2</div>
                        <div className="text-slate-400 w-24">Unary</div>
                        <div><code>++ -- !</code></div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/60 p-3 rounded-xl">
                        <div className="bg-slate-600 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">3</div>
                        <div className="text-slate-400 w-24">Mult/Div</div>
                        <div><code>* / %</code> <span className="text-xs opacity-50 ml-2">(Left to Right)</span></div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/40 p-3 rounded-xl">
                        <div className="bg-slate-600 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">4</div>
                        <div className="text-slate-400 w-24">Add/Sub</div>
                        <div><code>+ -</code></div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/20 p-3 rounded-xl">
                        <div className="bg-slate-600 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">5</div>
                        <div className="text-slate-400 w-24">Relational</div>
                        <div><code>&lt; &gt; &lt;= &gt;= == !=</code></div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/10 p-3 rounded-xl border border-slate-700/50">
                        <div className="bg-slate-600 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">6</div>
                        <div className="text-slate-400 w-24">Logical</div>
                        <div><code>&&</code> (runs before) <code>||</code></div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-rose-900/50 bg-rose-950/20">
                        <div className="bg-rose-600 text-white w-6 h-6 flex items-center justify-center rounded font-black shrink-0">7</div>
                        <div className="text-rose-400 w-24">Assignment</div>
                        <div><code>= += -=</code> <span className="text-xs text-rose-300 ml-2">(Runs absolute LAST. Right-to-Left.)</span></div>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 shadow-sm">
                <h3 className="font-black text-amber-900 text-lg mb-2">The Short-Circuit Optimization</h3>
                <p className="text-sm text-amber-800 leading-relaxed mb-4">
                    Java is lazy (in a good way). When evaluating Logical operators, it stops reading the exact millisecond it knows the final answer.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                        <strong className="text-rose-600 font-mono">FALSE && (anything)</strong>
                        <p className="text-xs text-slate-600 mt-2">Because AND requires both sides to be true, if the left side is false, Java skips evaluating the right side entirely.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                        <strong className="text-emerald-600 font-mono">TRUE || (anything)</strong>
                        <p className="text-xs text-slate-600 mt-2">Because OR requires only one side to be true, if the left side is true, Java skips the right side entirely.</p>
                    </div>
                </div>
            </div>

          </div>
        )}
        
        {/* --- INTERVIEW TAB --- */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                
                <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-rose-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> Pre vs Post Increment
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Code Snippet:</span>
                            <code>
                                int x = 10;<br/>
                                int y = ++x;<br/>
                                int z = x++;<br/>
                                System.out.println(x + " " + y + " " + z);
                            </code>
                        </div>
                        <div className="border-l-4 border-rose-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide uppercase">
                                Output: 12 11 11
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Why? It is all about the exact order of operations during assignment.
                            </p>
                            <ul className="text-sm text-slate-300 space-y-3 list-disc pl-4">
                                <li>
                                    <strong className="text-sky-400">++x (Pre-Increment):</strong> Update first, then Read. <code>x</code> instantly becomes 11. Then <code>y</code> reads that 11. (x=11, y=11).
                                </li>
                                <li>
                                    <strong className="text-amber-400">x++ (Post-Increment):</strong> Read first, then Update. <code>z</code> reads the CURRENT value of <code>x</code> (which is 11). AFTER the assignment is done, <code>x</code> secretly increments to 12. (z=11, x=12).
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           Wait, what about Bitwise Operators? (&, |, ^, &lt;&lt;)
                        </h4>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                You will often see single <code>&</code> or <code>|</code> used in code. These are <strong>Bitwise Operators</strong>.
                            </p>
                            <p>
                                Instead of evaluating logic, they literally look at the binary 1s and 0s in the CPU. If you do <code>5 & 3</code>, Java converts them to binary (0101 AND 0011) and outputs 0001 (which is 1).
                            </p>
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded font-bold">
                                Interview Trap: Using a single `&` inside an `if` statement (e.g., `if (a != null & a.val &gt; 5)`) completely disables Short-Circuiting. The JVM will evaluate both sides no matter what, often causing a NullPointerException!
                            </div>
                        </div>
                    </div>
                </div>

             </div>
        )}

      </div>
    </div>
  );
}
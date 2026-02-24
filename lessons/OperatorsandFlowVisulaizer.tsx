import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Cpu, Info, Play, Pause, RefreshCw, GitBranch, Repeat, 
  ToggleRight, CheckSquare, XSquare, AlertTriangle, Box
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Main {
    public static void main(String[] args) {
        int score = 85;

        // 1. If/Else Branching
        if (score >= 90) {
            System.out.println("A");
        } else {
            System.out.println("B");
        }

        // 2. Looping and Block Scope
        for (int i = 1; i <= 2; i++) {
            int doubled = i * 2;
            System.out.println(doubled);
        }
        // 'i' and 'doubled' are destroyed here!
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. JVM Startup",
    desc: "Program starts. The main() stack frame is pushed. Execution flows sequentially from top to bottom unless told otherwise.",
    evaluator: null,
    frame: { name: "main()", vars: [], blockVars: null }
  },
  {
    line: 3,
    phase: "2. Variable Declaration",
    desc: "int score = 85; The variable is created in the main method's local scope.",
    evaluator: null,
    frame: { name: "main()", vars: [{ id: "score", val: 85, type: "int" }], blockVars: null }
  },
  {
    line: 6,
    phase: "3. Condition Evaluation",
    desc: "if (score >= 90) - The JVM evaluates the expression. It replaces 'score' with 85 and checks the condition.",
    evaluator: { left: 85, op: ">=", right: 90, result: false },
    frame: { name: "main()", vars: [{ id: "score", val: 85, type: "int" }], blockVars: null }
  },
  {
    line: 8,
    phase: "4. Branching (Jump)",
    desc: "Because the condition was FALSE, the JVM's instruction pointer JUMPS completely over the 'if' block and enters the 'else' block.",
    evaluator: null,
    frame: { name: "main()", vars: [{ id: "score", val: 85, type: "int" }], blockVars: null },
    console: "B"
  },
  {
    line: 13,
    phase: "5. For Loop: Initialization",
    desc: "for (int i = 1; ...) - A new 'Block Scope' is created specifically for this loop. The variable 'i' is declared INSIDE this temporary scope.",
    evaluator: null,
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 1, type: "int", highlight: true }] 
    }
  },
  {
    line: 13,
    phase: "6. For Loop: Condition Check",
    desc: "for (...; i <= 2; ...) - Before executing the loop body, the condition is evaluated. If TRUE, we enter the body. If FALSE, the loop ends.",
    evaluator: { left: 1, op: "<=", right: 2, result: true },
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 1, type: "int" }] 
    }
  },
  {
    line: 14,
    phase: "7. Loop Body (Iteration 1)",
    desc: "int doubled = i * 2; The variable 'doubled' is created inside the loop's Block Scope. It holds the value 2.",
    evaluator: null,
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 1, type: "int" }, { id: "doubled", val: 2, type: "int", highlight: true }] 
    },
    console: "B\n2"
  },
  {
    line: 13,
    phase: "8. For Loop: Increment & Cleanup",
    desc: "for (...; ...; i++) - The iteration ends. CRITICAL: 'doubled' is destroyed because its scope ended! Then, 'i' is incremented to 2.",
    evaluator: { left: "i", op: "++", right: "", result: 2 },
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 2, type: "int", highlight: true }] // doubled is GONE
    },
    console: "B\n2"
  },
  {
    line: 13,
    phase: "9. For Loop: Condition Check 2",
    desc: "Evaluate again: Is 2 <= 2? Yes. We enter the loop body for a second time.",
    evaluator: { left: 2, op: "<=", right: 2, result: true },
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 2, type: "int" }] 
    },
    console: "B\n2"
  },
  {
    line: 14,
    phase: "10. Loop Body (Iteration 2)",
    desc: "int doubled = i * 2; A BRAND NEW 'doubled' variable is created from scratch for this iteration.",
    evaluator: null,
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 2, type: "int" }, { id: "doubled", val: 4, type: "int", highlight: true }] 
    },
    console: "B\n2\n4"
  },
  {
    line: 13,
    phase: "11. Increment & Final Condition",
    desc: "'doubled' is destroyed again. 'i' becomes 3. Condition check: 3 <= 2 is FALSE. The loop terminates.",
    evaluator: { left: 3, op: "<=", right: 2, result: false },
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: [{ id: "i", val: 3, type: "int" }] 
    },
    console: "B\n2\n4"
  },
  {
    line: 17,
    phase: "12. Scope Destruction",
    desc: "The entire loop block is finished. The Block Scope is destroyed, taking 'i' with it. 'i' no longer exists in memory!",
    evaluator: null,
    frame: { 
        name: "main()", 
        vars: [{ id: "score", val: 85, type: "int" }], 
        blockVars: null 
    },
    console: "B\n2\n4"
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "amber" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        amber: 'text-amber-600',
        orange: 'text-orange-600',
        rose: 'text-rose-600',
        blue: 'text-blue-600'
    };
    const activeColor = colorMap[color] || 'text-amber-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|static|class|void|int|if|else|for)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-amber-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-amber-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-emerald-400">{part}</span>;
          if (['public', 'static', 'class', 'void', 'if', 'else', 'for'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-purple-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'lesson' | 'visualizer' | 'theory' | 'interview'>('visualizer');
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
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg shadow-amber-200 flex items-center justify-center relative overflow-hidden group">
                <GitBranch className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Operators & Flow</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded tracking-widest uppercase border border-amber-100">Java Foundations</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Logic & Scope</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="amber" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="amber" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" color="orange" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" color="rose" />
          </div>
        </div>

        {/* --- VISUALIZER TAB --- */}
        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-amber-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">Main.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto min-h-[300px]">
                      {CODE_STRING.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                      ))}
                  </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-lg border transition-all duration-300 relative overflow-hidden flex-1 flex flex-col bg-white border-slate-200`}>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity size={16} className="text-amber-500"/>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-amber-300">
                      {cur.desc}
                  </p>
                  
                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: Evaluator & Scope Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/30 via-white to-white">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <ToggleRight size={20} className="text-amber-500"/> Expression Evaluator & Scope
                        </h3>
                    </div>

                    <div className="flex flex-col flex-1 gap-6 relative">
                        
                        {/* 1. THE EVALUATOR (ALU) */}
                        <div className="w-full flex flex-col bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden shrink-0">
                            <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2.5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2"><Cpu size={14}/> ALU (Condition Engine)</span>
                            </div>
                            
                            <div className="p-6 flex items-center justify-center min-h-[120px]">
                                {cur.evaluator ? (
                                    <div className="flex items-center gap-4 animate-in zoom-in-95 duration-300">
                                        <div className="bg-slate-800 border border-slate-700 text-white font-mono font-black text-2xl px-5 py-3 rounded-xl shadow-inner">
                                            {cur.evaluator.left}
                                        </div>
                                        <div className="text-amber-400 font-black text-xl font-mono">
                                            {cur.evaluator.op}
                                        </div>
                                        {cur.evaluator.right !== "" && (
                                            <div className="bg-slate-800 border border-slate-700 text-white font-mono font-black text-2xl px-5 py-3 rounded-xl shadow-inner">
                                                {cur.evaluator.right}
                                            </div>
                                        )}
                                        <ArrowRight className="text-slate-600 mx-2" size={24}/>
                                        <div className={`font-mono font-black text-2xl px-6 py-3 rounded-xl border-2 flex items-center gap-2 shadow-lg ${cur.evaluator.result === true ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : cur.evaluator.result === false ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-sky-500/20 text-sky-400 border-sky-500/50'}`}>
                                            {cur.evaluator.result === true && <CheckSquare size={24}/>}
                                            {cur.evaluator.result === false && <XSquare size={24}/>}
                                            {typeof cur.evaluator.result === 'boolean' ? cur.evaluator.result.toString().toUpperCase() : cur.evaluator.result}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-600 font-mono text-sm uppercase tracking-widest">Waiting for condition...</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 flex-1">
                            {/* 2. THE STACK FRAME & BLOCK SCOPE */}
                            <div className="flex-[3] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> Memory Scope</span>
                                </div>
                                
                                <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto">
                                    <div className="text-[10px] font-black uppercase text-slate-400 font-mono bg-white px-3 py-1.5 rounded-lg border inline-block w-fit">main() Scope</div>
                                    
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {cur.frame.vars.map((v, vIdx) => (
                                            <div key={vIdx} className="flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                                <div className="text-[9px] font-mono font-black px-3 py-1 text-center border-b bg-slate-100 text-slate-500 border-slate-200">
                                                    {v.type} {v.id}
                                                </div>
                                                <div className="font-mono font-black text-center py-2 text-lg text-slate-700">
                                                    {v.val}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* NESTED BLOCK SCOPE */}
                                    <div className={`flex-1 rounded-2xl border-2 border-dashed p-4 transition-all duration-500 flex flex-col ${cur.frame.blockVars ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-100 border-slate-200'}`}>
                                        <div className={`text-[10px] font-black uppercase tracking-widest font-mono mb-3 ${cur.frame.blockVars ? 'text-amber-600' : 'text-slate-400'}`}>
                                            <Repeat size={14} className="inline mr-1 -mt-0.5"/> Loop Block Scope
                                        </div>
                                        
                                        {cur.frame.blockVars ? (
                                            <div className="flex flex-wrap gap-3 animate-in zoom-in-95">
                                                {cur.frame.blockVars.map((v, vIdx) => (
                                                    <div key={vIdx} className={`flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${v.highlight ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-100' : 'border-slate-200'}`}>
                                                        <div className={`text-[9px] font-mono font-black px-3 py-1 text-center border-b ${v.highlight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                            {v.type} {v.id}
                                                        </div>
                                                        <div className={`font-mono font-black text-center py-2 text-lg px-4 ${v.highlight ? 'bg-white text-amber-600' : 'bg-white text-slate-700'}`}>
                                                            {v.val}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center text-slate-400 font-mono text-xs italic">
                                                Not currently inside a loop...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 3. VIRTUAL CONSOLE */}
                            <div className="flex-[2] flex flex-col bg-black rounded-3xl border border-slate-800 shadow-sm relative overflow-hidden h-[200px] md:h-auto">
                                <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono ml-2">Console Output</span>
                                </div>
                                <div className="p-4 font-mono text-emerald-400 text-sm flex-1 overflow-y-auto whitespace-pre-wrap">
                                    {cur.console || ">_"}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- LESSON TAB --- */}
        {activeTab === 'lesson' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px] flex flex-col items-center">
            <div className="max-w-3xl w-full">
              <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                  <GitBranch className="text-amber-500" size={32}/> Control Flow & Logic
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  By default, Java reads your code like a book: top-to-bottom, line-by-line. This is called <strong>Sequential Execution</strong>. However, programs would be useless if they couldn't make decisions or repeat tasks.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><ToggleRight className="text-sky-500"/> 1. Conditionals (Branching)</h3>
                        <p className="text-sm">
                            The <code>if-else</code> statements allow the program to ask a question (an expression that evaluates to <code>true</code> or <code>false</code>). Depending on the answer, the JVM's "Instruction Pointer" literally skips over blocks of code it shouldn't run.
                        </p>
                        <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl font-mono text-sm text-slate-700">
                            <span className="text-pink-600">if</span> (score &gt;= 90) {'{'}<br/>
                            &nbsp;&nbsp;print("A");<br/>
                            {'}'} <span className="text-pink-600">else</span> {'{'}<br/>
                            &nbsp;&nbsp;print("B"); <span className="text-slate-400 italic">// JVM jumps here if false</span><br/>
                            {'}'}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Repeat className="text-amber-500"/> 2. Loops (Iteration)</h3>
                        <p className="text-sm">
                            Loops (<code>for</code>, <code>while</code>) force the JVM to jump *backwards* in the code and execute a block repeatedly until a specific condition becomes <code>false</code>.
                        </p>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl font-mono text-sm text-slate-700">
                            <span className="text-pink-600">for</span> (<span className="text-sky-600">int</span> i = 0; i &lt; 5; i++) {'{'}<br/>
                            &nbsp;&nbsp;print(i); <span className="text-slate-400 italic">// Runs 5 times</span><br/>
                            {'}'}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mt-8 text-white">
                    <h4 className="font-black text-emerald-400 flex items-center gap-2 mb-3 uppercase tracking-widest text-sm">
                        <Cpu size={16}/> The Role of Operators
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Control Flow relies heavily on Operators to evaluate conditions.
                    </p>
                    <ul className="text-sm text-slate-300 mt-3 space-y-2 font-mono">
                        <li><strong className="text-white">Relational:</strong> <code>==, !=, &gt;, &lt;, &gt;=, &lt;=</code> (Compare values)</li>
                        <li><strong className="text-white">Logical:</strong> <code>&&</code> (AND), <code>||</code> (OR), <code>!</code> (NOT)</li>
                    </ul>
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
                <Box className="text-orange-500"/> Block Scope Explained
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-orange-200 pl-6">
                You know about Method Scope (variables die when the method returns). But Java has an even stricter level of memory management called <strong>Block Scope</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight mb-4 flex items-center gap-2">
                            What is a Block?
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            In Java, anything enclosed in curly braces <code>{`{ ... }`}</code> is a "Block". This includes <code>if</code> statements, <code>for</code> loops, and <code>while</code> loops.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed font-bold">
                            Rule: Any variable declared *inside* a block is completely destroyed the exact millisecond the JVM exits that block's closing brace <code>{`}`}</code>.
                        </p>
                    </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-rose-900 tracking-tight mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-rose-500"/> The Classic Error
                        </h3>
                        <div className="bg-white p-4 rounded-xl border border-rose-100 font-mono text-sm text-slate-700 mb-4">
                            <span className="text-pink-600">for</span> (<span className="text-sky-600">int</span> i=0; i&lt;5; i++) {'{'}<br/>
                            &nbsp;&nbsp;<span className="text-slate-400 italic">// loop stuff</span><br/>
                            {'}'}<br/>
                            System.out.println(i); <span className="text-rose-500 font-bold">// ERROR!</span>
                        </div>
                        <p className="text-rose-700 text-sm leading-relaxed">
                            Because `int i` was declared as part of the loop's block, it no longer exists in memory when you try to print it on the next line!
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="flex-1 space-y-4">
                    <h4 className="text-xl font-black text-amber-400 flex items-center gap-2">Why Destroy Variables?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Imagine a game loop running 60 times a second. If you declare a temporary <code>int distance</code> inside that loop, and Java *didn't* destroy it when the loop iteration ended, you would create 60 new variables every second. 
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Your Stack memory would fill up and crash immediately. Block Scope ensures memory is continuously recycled and kept extremely small and efficient.
                    </p>
                </div>
                <div className="flex-1">
                    <div className="bg-black/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center gap-3">
                        <Repeat size={48} className="text-amber-500 animate-[spin_4s_linear_infinite]" />
                        <span className="font-mono text-amber-400 font-bold">Create ➔ Use ➔ Destroy</span>
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
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> Short-Circuit Evaluation
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Code Snippet:</span>
                            <code>
                                String name = null;<br/>
                                if (name != null && name.length() &gt; 0) {'{'}<br/>
                                &nbsp;&nbsp;&nbsp;System.out.println("Valid");<br/>
                                {'}'}
                            </code>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide uppercase">
                                Will this throw a NullPointerException?
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong>NO.</strong> Because of Java's "Short-Circuit" Logical AND operator (<code>&&</code>).
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The JVM evaluates conditions left-to-right. It first checks <code>name != null</code>. Since `name` IS null, this is FALSE. 
                            </p>
                            <p className="text-sm text-emerald-300 bg-emerald-900/30 p-2 rounded inline-block font-bold">
                                Because an AND statement requires BOTH sides to be true, the JVM realizes it's impossible for the whole statement to be true. It immediately stops (short-circuits) and NEVER evaluates `name.length() &gt; 0`, safely avoiding the crash!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <code>&&</code> vs <code>&</code> (Bitwise)
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                What if the code above used a single <code>&</code> instead?
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-bold text-rose-600">
                                It WOULD crash with a NullPointerException.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                The single <code>&</code> is a Bitwise operator. It does NOT short-circuit. It forces the JVM to evaluate both the left side AND the right side before determining the final result.
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           While vs Do-While
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                What is the absolute core difference?
                            </p>
                            <ul className="text-xs text-slate-600 space-y-3">
                                <li className="bg-slate-50 p-2 rounded border"><strong>while:</strong> Checks the condition FIRST. If false, the loop body might execute <strong>0 times</strong>.</li>
                                <li className="bg-slate-50 p-2 rounded border"><strong>do-while:</strong> Executes the body FIRST, then checks the condition. The loop body is guaranteed to execute <strong>at least 1 time</strong>.</li>
                            </ul>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Play, Pause, RefreshCw, GitBranch, Repeat, 
  Terminal, Zap, StopCircle, FastForward, Navigation, AlertTriangle
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class ControlFlow {
    public static void main(String[] args) {
        int health = 40;
        
        // 1. Conditional Branching
        if (health > 50) {
            System.out.println("Safe");
        } else {
            System.out.println("Danger!");
            health += 20; // Drink Potion
        }
        
        // 2. Iteration (Looping)
        while (health < 100) {
            System.out.println("Healing...");
            health += 20;
        }
        
        System.out.println("Full Health!");
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. Program Start",
    desc: "Sequential execution begins. The JVM's Instruction Pointer starts at the top of the main method.",
    vars: [],
    console: "",
    evaluator: null
  },
  {
    line: 3,
    phase: "2. Variable Initialization",
    desc: "int health = 40; A local variable is created in the stack.",
    vars: [{ id: "health", val: 40, type: "int", active: true }],
    console: "",
    evaluator: null
  },
  {
    line: 6,
    phase: "3. If-Condition Check",
    desc: "if (health > 50) -> The JVM evaluates the condition. 40 > 50 is FALSE.",
    vars: [{ id: "health", val: 40, type: "int" }],
    console: "",
    evaluator: { condition: "40 > 50", result: false }
  },
  {
    line: 8,
    phase: "4. Branch Jump (Else)",
    desc: "Because the condition was false, the Instruction Pointer JUMPS entirely over the 'if' block and lands on the 'else' block.",
    vars: [{ id: "health", val: 40, type: "int" }],
    console: "",
    evaluator: null
  },
  {
    line: 9,
    phase: "5. Print Warning",
    desc: "System.out.println(\"Danger!\"); Outputs to the console.",
    vars: [{ id: "health", val: 40, type: "int" }],
    console: "Danger!\n",
    evaluator: null
  },
  {
    line: 10,
    phase: "6. State Mutation",
    desc: "health += 20; The health variable is updated in memory to 60.",
    vars: [{ id: "health", val: 60, type: "int", highlight: true, color: "emerald" }],
    console: "Danger!\n",
    evaluator: null
  },
  {
    line: 14,
    phase: "7. While Loop: Initial Check",
    desc: "while (health < 100) -> The loop acts as a gatekeeper. Evaluates: 60 < 100. This is TRUE, so we enter the loop body.",
    vars: [{ id: "health", val: 60, type: "int", color: "emerald" }],
    console: "Danger!\n",
    evaluator: { condition: "60 < 100", result: true }
  },
  {
    line: 15,
    phase: "8. Loop Body (Iteration 1)",
    desc: "System.out.println(\"Healing...\");",
    vars: [{ id: "health", val: 60, type: "int", color: "emerald" }],
    console: "Danger!\nHealing...\n",
    evaluator: null
  },
  {
    line: 16,
    phase: "9. State Mutation",
    desc: "health += 20; Updates health to 80.",
    vars: [{ id: "health", val: 80, type: "int", highlight: true, color: "emerald" }],
    console: "Danger!\nHealing...\n",
    evaluator: null
  },
  {
    line: 14,
    phase: "10. While Loop: Jump Backwards",
    desc: "The end of the loop block is reached. The Instruction Pointer literally JUMPS BACKWARDS to line 14 to re-evaluate the condition. 80 < 100 is TRUE.",
    vars: [{ id: "health", val: 80, type: "int", color: "emerald" }],
    console: "Danger!\nHealing...\n",
    evaluator: { condition: "80 < 100", result: true }
  },
  {
    line: 15,
    phase: "11. Loop Body (Iteration 2)",
    desc: "We enter the body a second time.",
    vars: [{ id: "health", val: 80, type: "int", color: "emerald" }],
    console: "Danger!\nHealing...\nHealing...\n",
    evaluator: null
  },
  {
    line: 16,
    phase: "12. State Mutation",
    desc: "health += 20; Updates health to 100.",
    vars: [{ id: "health", val: 100, type: "int", highlight: true, color: "sky" }],
    console: "Danger!\nHealing...\nHealing...\n",
    evaluator: null
  },
  {
    line: 14,
    phase: "13. While Loop: Final Check",
    desc: "Jump backwards again. Evaluates: 100 < 100. This is strictly FALSE. The gatekeeper now blocks entry.",
    vars: [{ id: "health", val: 100, type: "int", color: "sky" }],
    console: "Danger!\nHealing...\nHealing...\n",
    evaluator: { condition: "100 < 100", result: false }
  },
  {
    line: 19,
    phase: "14. Loop Exit",
    desc: "The Instruction Pointer jumps past the entire loop block to line 19. The loop is officially broken.",
    vars: [{ id: "health", val: 100, type: "int", color: "sky" }],
    console: "Danger!\nHealing...\nHealing...\nFull Health!\n",
    evaluator: null
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "amber" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        amber: 'text-amber-600',
        sky: 'text-sky-600',
        emerald: 'text-emerald-600',
        rose: 'text-rose-600',
        indigo: 'text-indigo-600'
    };
    const activeColor = colorMap[color] || 'text-amber-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|static|class|void|int|if|else|while)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-amber-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-amber-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-emerald-400">{part}</span>;
          if (['public', 'static', 'class', 'void'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (['if', 'else', 'while'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-orange-400">{part}</span>;
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
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 3500); 
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Control Flow</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded tracking-widest uppercase border border-amber-100">Logic Building 101</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Branching & Loops</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="amber" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="sky" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Loop Types" color="indigo" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Break/Continue" color="rose" />
          </div>
        </div>

        {/* --- VISUALIZER TAB --- */}
        {activeTab === 'simulator' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                
                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-800 relative">
                  
                  {/* IP Marker - Floats next to active line */}
                  <div className="absolute left-1 z-20 transition-all duration-300 pointer-events-none" 
                       style={{ top: `${(cur.line === 0 ? 0 : cur.line) * 22 + 45}px`, opacity: cur.line === 0 ? 0 : 1 }}>
                      <Navigation size={18} className="text-amber-400 fill-amber-400 rotate-90 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  </div>

                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-amber-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">ControlFlow.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto min-h-[440px]">
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
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Trace Log</span>
                     </div>
                     {cur.line > 0 && (
                        <div className="px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono tracking-wider border bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-1.5">
                            <Navigation size={10} className="text-slate-400 rotate-90"/> IP Line {cur.line}
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

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Zap size={20} className="text-amber-500"/> Logic Evaluator & Memory
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
                                    const c = v.color === 'emerald' ? 'emerald' : v.color === 'sky' ? 'sky' : 'slate';
                                    return (
                                        <div key={idx} className={`relative flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-300 min-w-[120px] ${v.active ? 'scale-105 shadow-md z-10 ring-4' : ''} ${v.highlight ? `border-${c}-400 ring-${c}-100 scale-105 shadow-md` : 'border-slate-200 ring-transparent'}`}>
                                            <div className="text-[9px] font-mono font-black px-3 py-1.5 flex justify-between bg-slate-100 text-slate-500 border-b border-slate-200">
                                                <span>{v.type}</span>
                                                <span className="ml-3">{v.id}</span>
                                            </div>
                                            <div className={`font-mono font-black text-center py-4 px-4 text-3xl flex items-center justify-center gap-1 bg-white transition-colors duration-500 ${c === 'slate' ? 'text-slate-700' : `text-${c}-600 bg-${c}-50`}`}>
                                                {v.val}
                                            </div>
                                        </div>
                                    )
                                })}
                                {cur.vars.length === 0 && <div className="text-xs font-mono italic text-slate-400 py-4">Variables will appear here...</div>}
                            </div>
                        </div>

                        {/* CONDITION EVALUATOR (GATEKEEPER) */}
                        <div className={`rounded-3xl border-2 shadow-sm relative overflow-hidden flex flex-col transition-all duration-500 ${cur.evaluator ? (cur.evaluator.result ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300') : 'bg-slate-50 border-slate-200'}`}>
                            <div className={`border-b p-3 flex items-center justify-between ${cur.evaluator ? (cur.evaluator.result ? 'border-emerald-200 bg-emerald-100/50' : 'border-rose-200 bg-rose-100/50') : 'border-slate-200 bg-slate-100'}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 text-slate-500">
                                    <StopCircle size={14}/> Conditional Gatekeeper
                                </span>
                            </div>

                            <div className="p-6 flex items-center justify-center min-h-[100px]">
                                {cur.evaluator ? (
                                    <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                                        <div className="font-mono text-xl font-bold text-slate-700">
                                            Is <span className="bg-white px-3 py-1 rounded-lg border border-slate-300 mx-2">{cur.evaluator.condition}</span> ?
                                        </div>
                                        <div className={`font-black text-2xl px-6 py-2 rounded-xl flex items-center gap-2 shadow-sm ${cur.evaluator.result === true ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                            {cur.evaluator.result === true ? <Check size={24}/> : <Zap size={24}/>}
                                            {cur.evaluator.result.toString().toUpperCase()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 gap-2 opacity-50">
                                        <GitBranch size={24} />
                                        <span className="font-mono text-xs uppercase tracking-widest font-bold">Awaiting Condition</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CONSOLE OUTPUT */}
                        <div className="flex-1 bg-black rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col min-h-[150px]">
                            <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-3">
                                <Terminal size={14} className="text-slate-400"/>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Standard Output</span>
                            </div>
                            <div className="p-5 font-mono text-emerald-400 text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
                                {cur.console}
                                <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-[pulse_1s_step-end_infinite] align-middle"></span>
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
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px]">
            <div className="max-w-4xl space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                  <GitBranch className="text-sky-500" size={32}/> If/Else & Branching
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-sky-200 pl-6 mb-8">
                  Sequential execution (running code straight down) is boring. <strong>Branching</strong> allows your code to make decisions and execute different paths based on dynamic data.
                </p>

                <div className="grid grid-cols-1 gap-6">
                    {/* If/Else */}
                    <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl">
                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2">The `if-else` Construct</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            The <code>if</code> statement evaluates a boolean expression. If it resolves to <code>true</code>, the JVM enters the block. If <code>false</code>, the JVM literally skips over the block's code entirely.
                        </p>
                        <div className="bg-white border border-slate-200 p-4 rounded-xl font-mono text-sm">
                            <span className="text-pink-600">if</span> (score &gt; 90) {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;System.out.println("A");<br/>
                            {'}'} <span className="text-pink-600">else if</span> (score &gt; 80) {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;System.out.println("B");<br/>
                            {'}'} <span className="text-pink-600">else</span> {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;System.out.println("C");<br/>
                            {'}'}
                        </div>
                    </div>

                    {/* Switch */}
                    <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl">
                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2">The `switch` Statement</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            When you have many exact matches to check against a single variable, <code>switch</code> is cleaner and slightly faster than a massive chain of <code>if-else if</code>.
                        </p>
                        <div className="bg-white border border-slate-200 p-4 rounded-xl font-mono text-sm relative">
                            <span className="text-pink-600">switch</span> (dayOfWeek) {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-500">case</span> 1:<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print("Monday");<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-500 font-bold">break;</span> <span className="text-slate-400 italic">// Crucial!</span><br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-500">case</span> 2:<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print("Tuesday");<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-500 font-bold">break;</span><br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-500">default</span>:<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print("Weekend");<br/>
                            {'}'}
                        </div>
                        <div className="mt-4 bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-sm font-bold flex items-start gap-2">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <span>If you forget the `break` keyword, Java will "fall through" and execute all the cases below it, even if they don't match!</span>
                        </div>
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
                <Repeat className="text-indigo-500"/> The Three Loops
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-200 pl-6">
                Loops allow the Instruction Pointer to jump backward in time. Java has three primary ways to loop, and choosing the right one makes your logic much cleaner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* For Loop */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-indigo-900 text-lg mb-2">1. For Loop</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Use when you know <strong>exactly how many times</strong> you want to iterate (e.g., "Run 10 times", or "Loop through every item in this array").</p>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        <span className="text-pink-600">for</span> (int i=0; i&lt;10; i++) {'{'}<br/>
                        &nbsp;&nbsp;...<br/>
                        {'}'}
                    </div>
                </div>

                {/* While Loop */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-sky-900 text-lg mb-2">2. While Loop</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Use when you <strong>don't know the count</strong>, but you know the condition to stop (e.g., "Keep reading until the file is empty").</p>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        <span className="text-pink-600">while</span> (isAlive) {'{'}<br/>
                        &nbsp;&nbsp;...<br/>
                        {'}'}
                    </div>
                </div>

                {/* Do-While Loop */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-amber-900 text-lg mb-2">3. Do-While</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Rarely used. Use when you MUST execute the loop body <strong>at least once</strong>, regardless of the condition.</p>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        <span className="text-pink-600">do</span> {'{'}<br/>
                        &nbsp;&nbsp;...<br/>
                        {'}'} <span className="text-pink-600">while</span> (false);
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-8 shadow-sm mt-8">
                <h3 className="font-black text-indigo-900 text-lg mb-2 flex items-center gap-2">
                    <FastForward size={20} className="text-indigo-500"/> The `for` loop anatomy
                </h3>
                <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                    The <code>for</code> loop is just a <code>while</code> loop condensed into one line. It has 3 distinct parts separated by semicolons:
                </p>
                <div className="bg-white p-4 rounded-xl border border-indigo-100 font-mono text-sm text-center">
                    <span className="text-pink-600">for</span> ( 
                    <span className="text-sky-600 bg-sky-50 px-1 rounded">Init</span> ; 
                    <span className="text-emerald-600 bg-emerald-50 px-1 rounded mx-1">Condition</span> ; 
                    <span className="text-amber-600 bg-amber-50 px-1 rounded">Update</span> )
                </div>
                <ol className="list-decimal pl-5 text-sm text-indigo-800 mt-4 space-y-2">
                    <li><strong>Init:</strong> Runs exactly ONCE when the loop starts.</li>
                    <li><strong>Condition:</strong> Checked BEFORE every single iteration. If false, loop ends.</li>
                    <li><strong>Update:</strong> Runs AFTER the loop body finishes, just before jumping back to check the condition again.</li>
                </ol>
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
                        <Trophy size={28} /> Break vs. Continue
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Interviewers love to test if you know how to abruptly alter loop flow without waiting for the condition to become false.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/40 border border-slate-700 p-5 rounded-xl shadow-inner">
                                <h4 className="text-rose-400 font-black mb-2 text-lg">break;</h4>
                                <p className="text-xs text-slate-400 mb-3">Immediately destroys the loop. The Instruction pointer jumps to the code entirely outside the loop block.</p>
                                <code>
                                    for(int i=1; i&lt;5; i++) {'{'}<br/>
                                    &nbsp;&nbsp;if(i == 3) <span className="text-rose-400 font-bold">break;</span><br/>
                                    &nbsp;&nbsp;print(i);<br/>
                                    {'}'}<br/>
                                    <span className="text-emerald-400 text-xs">// Output: 1 2</span>
                                </code>
                            </div>

                            <div className="bg-black/40 border border-slate-700 p-5 rounded-xl shadow-inner">
                                <h4 className="text-sky-400 font-black mb-2 text-lg">continue;</h4>
                                <p className="text-xs text-slate-400 mb-3">Stops the CURRENT iteration only. Jumps directly to the 'Update' step (i++) and starts the next loop.</p>
                                <code>
                                    for(int i=1; i&lt;5; i++) {'{'}<br/>
                                    &nbsp;&nbsp;if(i == 3) <span className="text-sky-400 font-bold">continue;</span><br/>
                                    &nbsp;&nbsp;print(i);<br/>
                                    {'}'}<br/>
                                    <span className="text-emerald-400 text-xs">// Output: 1 2 4</span>
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm border-l-4 border-l-rose-500">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Zap size={18} className="text-rose-500"/> The Infinite Loop Trap
                        </h4>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                If you are writing a <code>while</code> loop in a whiteboard interview, double check your code before saying you are done. The most common mistake is forgetting to mutate the variable inside the loop body.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-xs text-slate-700">
                                int x = 0;<br/>
                                while (x &lt; 10) {'{'}<br/>
                                &nbsp;&nbsp;&nbsp;System.out.println("Processing");<br/>
                                &nbsp;&nbsp;&nbsp;<span className="text-slate-400 italic">// Forgot x++; here!</span><br/>
                                {'}'}
                            </div>
                            <p className="text-rose-600 font-bold">
                                Because `x` never increases, `0 &lt; 10` is always true. The program will print forever until it crashes.
                            </p>
                        </div>
                    </div>
                </div>

             </div>
        )}

      </div>
    </div>
  );
}
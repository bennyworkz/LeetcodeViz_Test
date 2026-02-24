import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Cpu, Info, Play, Pause, RefreshCw, Server, 
  Zap, ArrowDownToLine, Crosshair, AlertTriangle, Box
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Main {
    public static void main(String[] args) {
        int base = 10;
        
        // Call the method, execution pauses here
        int result = multiply(base, 5);
        
        // Execution resumes here
        System.out.println(result);
    }

    public static int multiply(int a, int b) {
        int temp = a * b;
        return temp; // Variables die after return
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. Compilation (JDK)",
    desc: "Before running, the JDK (Java Development Kit) compiler (javac) translates your human-readable Java code into 'Bytecode' (Main.class). This Bytecode can run on ANY operating system.",
    frames: [],
    heap: []
  },
  {
    line: 0,
    phase: "2. JVM Startup (JRE)",
    desc: "The JRE (Java Runtime Environment) starts the JVM (Java Virtual Machine). The JVM loads your Bytecode into the Method Area and looks for the 'main' method to begin execution.",
    frames: [],
    heap: []
  },
  {
    line: 2,
    phase: "3. Main Stack Frame Pushed",
    desc: "The JVM creates a 'Stack Frame' specifically for the main() method. Every time a method is called, a new frame is pushed onto the Stack to hold its local variables.",
    frames: [
        { name: "main(String[] args)", active: true, vars: [] }
    ],
    heap: []
  },
  {
    line: 3,
    phase: "4. Local Variable Created",
    desc: "int base = 10; The variable 'base' is created INSIDE the main() frame. Its 'Scope' is limited to this frame. No other method can see it.",
    frames: [
        { name: "main(String[] args)", active: true, vars: [ { id: "base", val: 10, type: "int", highlight: true } ] }
    ],
    heap: []
  },
  {
    line: 6,
    phase: "5. Method Invoked (Pause)",
    desc: "multiply(base, 5) is called. The JVM pauses the execution of main(). It evaluates 'base' (which is 10) and passes copies of the values 10 and 5 to the new method.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [ { id: "base", val: 10, type: "int" } ] }
    ],
    heap: []
  },
  {
    line: 12,
    phase: "6. New Stack Frame Pushed",
    desc: "A NEW frame is pushed onto the top of the Stack for multiply(). The parameters 'a' and 'b' act as local variables, catching the copied values (10 and 5).",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [ { id: "base", val: 10, type: "int" } ] },
        { name: "multiply(int a, int b)", active: true, vars: [ { id: "a", val: 10, type: "int", highlight: true }, { id: "b", val: 5, type: "int", highlight: true } ] }
    ],
    heap: []
  },
  {
    line: 13,
    phase: "7. Local Variable (Scope)",
    desc: "int temp = a * b; 'temp' is calculated as 50 and stored in multiply's frame. Notice that main() cannot see 'temp', 'a', or 'b'. They are isolated in this scope!",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [ { id: "base", val: 10, type: "int" } ] },
        { name: "multiply(int a, int b)", active: true, vars: [ { id: "a", val: 10, type: "int" }, { id: "b", val: 5, type: "int" }, { id: "temp", val: 50, type: "int", highlight: true } ] }
    ],
    heap: []
  },
  {
    line: 14,
    phase: "8. Return Value",
    desc: "return temp; The multiply method has finished its job. It prepares to send the value 50 back to the caller (main).",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [ { id: "base", val: 10, type: "int" } ] },
        { name: "multiply(int a, int b)", active: true, returning: 50, vars: [ { id: "a", val: 10, type: "int" }, { id: "b", val: 5, type: "int" }, { id: "temp", val: 50, type: "int" } ] }
    ],
    heap: []
  },
  {
    line: 6,
    phase: "9. Stack Frame Popped!",
    desc: "CRITICAL: As multiply() finishes, its Stack Frame is POPPED (destroyed) from memory! Variables a, b, and temp are gone forever. main() resumes and catches the returned 50.",
    frames: [
        { name: "main(String[] args)", active: true, paused: false, vars: [ { id: "base", val: 10, type: "int" }, { id: "result", val: 50, type: "int", highlight: true } ] }
    ],
    heap: []
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "indigo" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        indigo: 'text-indigo-600',
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        rose: 'text-rose-600'
    };
    const activeColor = colorMap[color] || 'text-indigo-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|return)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-indigo-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void', 'return'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>;
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
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center relative overflow-hidden group">
                <Server className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">JVM & Methods</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase border border-indigo-100">Java Foundations</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">The Call Stack</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="indigo" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="indigo" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="JVM Theory" color="sky" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" color="amber" />
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
                      <Code2 size={16} className="text-indigo-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">Main.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto">
                      {CODE_STRING.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                      ))}
                  </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-lg border transition-all duration-300 relative overflow-hidden flex-1 flex flex-col bg-white border-slate-200`}>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity size={16} className="text-indigo-500"/>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">JVM Execution Log</span>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-indigo-300">
                      {cur.desc}
                  </p>
                  
                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: JVM Memory Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Layers size={20} className="text-indigo-600"/> The Call Stack (LIFO)
                        </h3>
                        {currentStep < 2 && (
                            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-bold animate-pulse">
                                JVM Booting...
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-end relative pb-8">
                        
                        {/* Empty Stack State */}
                        {cur.frames.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                                <Layers size={64} className="opacity-20"/>
                                <span className="font-mono text-sm uppercase tracking-widest font-bold">Stack is Empty</span>
                            </div>
                        )}

                        {/* Stack Frames rendering (bottom-up) */}
                        <div className="w-full max-w-md flex flex-col-reverse gap-4 relative z-10">
                            {cur.frames.map((frame, idx) => {
                                const isTopFrame = idx === cur.frames.length - 1;
                                
                                return (
                                <div key={idx} className={`w-full relative flex flex-col rounded-2xl border-2 transition-all duration-500 animate-in slide-in-from-top-10 shadow-lg overflow-hidden ${isTopFrame && !frame.paused ? 'border-indigo-500 shadow-indigo-200 bg-white ring-4 ring-indigo-50 scale-105 z-20' : 'border-slate-300 bg-slate-50 opacity-60 scale-95'}`}>
                                    
                                    {/* Frame Header */}
                                    <div className={`flex justify-between items-center px-4 py-3 border-b ${isTopFrame && !frame.paused ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-200/50 border-slate-300'}`}>
                                        <div className="flex items-center gap-2">
                                            {isTopFrame && !frame.paused ? <Zap size={14} className="text-indigo-500 fill-indigo-500"/> : <Pause size={14} className="text-slate-400"/>}
                                            <span className={`text-[12px] font-black font-mono ${isTopFrame && !frame.paused ? 'text-indigo-900' : 'text-slate-500'}`}>{frame.name}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${isTopFrame && !frame.paused ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-300 text-slate-600'}`}>
                                            {isTopFrame && !frame.paused ? 'Executing' : 'Paused'}
                                        </span>
                                    </div>
                                    
                                    {/* Frame Variables (Scope) */}
                                    <div className="p-5 flex flex-col gap-3 min-h-[80px]">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                                            <Crosshair size={12}/> Local Scope
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3">
                                            {frame.vars.map((v, vIdx) => (
                                                <div key={vIdx} className={`flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${v.highlight ? 'border-sky-400 scale-110 shadow-md ring-2 ring-sky-100' : 'border-slate-200'}`}>
                                                    <div className={`text-[9px] font-mono font-black px-3 py-1 text-center border-b ${v.highlight ? 'bg-sky-100 text-sky-800 border-sky-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                        {v.type} {v.id}
                                                    </div>
                                                    <div className={`font-mono font-black text-center py-2 text-lg ${v.highlight ? 'bg-white text-sky-600' : 'bg-white text-slate-700'}`}>
                                                        {v.val}
                                                    </div>
                                                </div>
                                            ))}
                                            {frame.vars.length === 0 && (
                                                <div className="text-xs text-slate-400 italic font-mono pt-2">No variables declared yet...</div>
                                            )}
                                        </div>

                                        {/* Returning state overlay */}
                                        {frame.returning !== undefined && (
                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in z-30">
                                                <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-800 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                                                    <ArrowDownToLine size={18}/> Returning: {frame.returning}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )})}
                        </div>
                        
                        {/* Base of Stack Visual */}
                        <div className="w-full max-w-lg h-4 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-2xl mt-4 relative">
                            <div className="absolute w-full text-center -bottom-6 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Bottom of Stack</div>
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
                  <Zap className="text-indigo-500" size={32}/> Methods & The Call Stack
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  A <strong>Method</strong> is a reusable block of code that only runs when it is called. Think of it as a mini-program inside your main program. You pass data in (parameters), it does some work, and it sends data out (return value).
                </p>

                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                    <div className="font-mono font-bold text-sm text-slate-800 space-y-1">
                        <div><span className="text-pink-600">public static</span> <span className="text-sky-600">int</span> <span className="text-indigo-700">multiply</span>(<span className="text-sky-600">int</span> a, <span className="text-sky-600">int</span> b) {'{'}</div>
                        <div className="pl-8"><span className="text-sky-600">int</span> temp = a * b;</div>
                        <div className="pl-8"><span className="text-pink-600">return</span> temp;</div>
                        <div>{'}'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2">The Call Stack</h3>
                        <p className="text-sm">
                            The JVM manages method execution using a <strong>LIFO (Last-In, First-Out)</strong> structure called the Call Stack. 
                            When <code>main()</code> starts, a "Frame" is pushed onto the stack. If <code>main()</code> calls <code>multiply()</code>, the JVM pauses <code>main()</code> and pushes a new frame for <code>multiply()</code> on top of it.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2">Variable Scope</h3>
                        <p className="text-sm">
                            Every Stack Frame is an isolated island. Variables created inside <code>multiply()</code> (like <code>temp</code>) CANNOT be seen or accessed by <code>main()</code>. This is called <strong>Local Scope</strong>. 
                            When the method finishes, its frame is popped off the stack, and all its local variables are permanently destroyed.
                        </p>
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
                <Server className="text-sky-600"/> JVM Internal Architecture
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-200 pl-6">
                "Write Once, Run Anywhere." This is Java's motto. But how does it actually work? It's all thanks to the JDK, JRE, and JVM ecosystem.
              </p>
            </div>

            <div className="flex flex-col gap-6">
                
                {/* JDK */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-white/10 p-4 rounded-2xl text-white"><FileText size={32}/></div>
                        <div>
                            <h3 className="font-black text-xl text-white tracking-tight mb-2">1. JDK (Java Development Kit)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                The toolkit for *developers*. It contains the compiler (<code>javac</code>). When you click 'Compile', the JDK takes your human-readable <code>.java</code> files and translates them into machine-independent <strong>Bytecode</strong> (<code>.class</code> files).
                            </p>
                        </div>
                    </div>
                </div>

                <ArrowDownToLine className="mx-auto text-slate-300" size={24}/>

                {/* JRE */}
                <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-sky-200 p-4 rounded-2xl text-sky-800"><Box size={32}/></div>
                        <div>
                            <h3 className="font-black text-xl text-sky-900 tracking-tight mb-2">2. JRE (Java Runtime Environment)</h3>
                            <p className="text-sky-800 text-sm leading-relaxed">
                                The environment for *users*. If you just want to run a Java app, you only need the JRE. It contains core libraries and automatically boots up the JVM when you execute a program.
                            </p>
                        </div>
                    </div>
                </div>

                <ArrowDownToLine className="mx-auto text-slate-300" size={24}/>

                {/* JVM */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-indigo-200 p-4 rounded-2xl text-indigo-800"><Cpu size={32}/></div>
                        <div>
                            <h3 className="font-black text-xl text-indigo-900 tracking-tight mb-2">3. JVM (Java Virtual Machine)</h3>
                            <p className="text-indigo-800 text-sm leading-relaxed mb-4">
                                The engine. The JVM takes the compiled Bytecode and translates it line-by-line into the specific native machine code of the host operating system (Windows, Mac, Linux).
                            </p>
                            <div className="bg-white/60 p-4 rounded-xl border border-indigo-100 text-sm">
                                <strong>Key JVM Components:</strong>
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    <li><strong>Class Loader:</strong> Loads the <code>.class</code> files into memory.</li>
                                    <li><strong>Memory Areas:</strong> Sets up the Stack (for methods) and Heap (for objects).</li>
                                    <li><strong>Execution Engine:</strong> Runs the code and handles Garbage Collection.</li>
                                </ul>
                            </div>
                        </div>
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
                        <Trophy size={28} /> Pass-by-Value Trap
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Code Snippet:</span>
                            <code>
                                int x = 10;<br/>
                                modify(x);<br/>
                                System.out.println(x); // What does this print?<br/><br/>
                                void modify(int val) {'{'} val = 99; {'}'}
                            </code>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide uppercase">
                                It prints 10. NOT 99.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                When <code>modify(x)</code> is called, the JVM looks at <code>x</code>, sees the primitive value <code>10</code>, and passes a **COPY** of that number into the new method's parameter <code>val</code>. 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Inside the <code>modify</code> Stack Frame, <code>val</code> becomes 99. But when the method finishes, that frame is destroyed. The original <code>x</code> inside the <code>main</code> frame was completely untouched!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-rose-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <AlertTriangle size={18} className="text-rose-500"/> StackOverflowError
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                What happens if a method calls itself infinitely (infinite recursion)? 
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Every method call pushes a new Frame onto the Stack. The Stack is physically small (usually 1MB - 2MB). If you push frames forever without returning/popping them, you run out of memory. The JVM crashes and throws a <code>StackOverflowError</code>.
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Code2 size={18} className="text-indigo-500"/> Main Method Signature
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Interviewers often ask you to explain <code>public static void main(String[] args)</code>.
                            </p>
                            <ul className="text-xs text-slate-600 space-y-2">
                                <li><strong>public:</strong> JVM needs to access it from outside the class.</li>
                                <li><strong>static:</strong> JVM can call it without creating an object of the class first.</li>
                                <li><strong>void:</strong> The main method doesn't return any value to the OS.</li>
                                <li><strong>args:</strong> Array of strings passed in via command line.</li>
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
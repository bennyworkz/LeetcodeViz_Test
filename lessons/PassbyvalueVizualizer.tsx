import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Cpu, Info, Play, Pause, RefreshCw, Server, 
  Zap, ArrowDownToLine, Crosshair, AlertTriangle, Box,
  ArrowRightLeft, SplitSquareHorizontal, Link as LinkIcon
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Main {
    public static void main(String[] args) {
        int score = 10;
        int[] arr = { 10 };

        // 1. Pass Primitive
        modifyPrimitive(score);
        // score is STILL 10!
        
        // 2. Pass Reference
        modifyReference(arr);
        // arr[0] is NOW 99!
    }

    static void modifyPrimitive(int x) {
        x = 99; 
    }

    static void modifyReference(int[] nums) {
        nums[0] = 99; 
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. JVM Startup",
    desc: "The JVM invokes main(). A Stack Frame is created for main. The Heap is ready.",
    frames: [{ name: "main(String[] args)", active: true, vars: [] }],
    heap: []
  },
  {
    line: 3,
    phase: "2. Primitive Created",
    desc: "int score = 10; The primitive is stored directly in the main() Stack Frame.",
    frames: [{ name: "main(String[] args)", active: true, vars: [{ id: "score", val: 10, type: "int" }] }],
    heap: []
  },
  {
    line: 4,
    phase: "3. Object & Reference Created",
    desc: "int[] arr = { 10 }; The JVM builds an array object in the Heap. The 'arr' variable in main() gets the reference address (@0xA1) pointing to it.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "score", val: 10, type: "int" },
        { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
    ]}],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet" }]
  },
  {
    line: 7,
    phase: "4. Method Call: Primitive",
    desc: "modifyPrimitive(score) is called. The JVM pauses main() and pushes a new Stack Frame for modifyPrimitive().",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "score", val: 10, type: "int", highlight: true },
            { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
        ]},
        { name: "modifyPrimitive(int x)", active: true, vars: [] }
    ],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet" }]
  },
  {
    line: 15,
    phase: "5. Pass-by-Value (Copy)",
    desc: "CRITICAL: Java passes EVERYTHING by value. It takes the value of 'score' (10), makes a COPY, and puts it into the local parameter 'x'.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "score", val: 10, type: "int" },
            { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
        ]},
        { name: "modifyPrimitive(int x)", active: true, vars: [{ id: "x", val: 10, type: "int", highlight: true }] }
    ],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet" }]
  },
  {
    line: 16,
    phase: "6. Local Modification",
    desc: "x = 99; Only the local copy 'x' is updated. Because 'x' and 'score' are completely separate boxes in memory, 'score' in main() is untouched.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "score", val: 10, type: "int" },
            { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
        ]},
        { name: "modifyPrimitive(int x)", active: true, vars: [{ id: "x", val: 99, type: "int", highlight: true, color: "fuchsia" }] }
    ],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet" }]
  },
  {
    line: 17,
    phase: "7. Frame Popped",
    desc: "Method ends. Its frame is destroyed. 'x' ceases to exist. main() resumes. score is still 10!",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "score", val: 10, type: "int" },
        { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
    ]}],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet" }]
  },
  {
    line: 11,
    phase: "8. Method Call: Reference",
    desc: "modifyReference(arr) is called. JVM pauses main() and pushes a new frame.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "score", val: 10, type: "int" },
            { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet", highlight: true }
        ]},
        { name: "modifyReference(int[] nums)", active: true, vars: [] }
    ],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet" }]
  },
  {
    line: 19,
    phase: "9. Pass Reference-by-Value",
    desc: "CRITICAL: Java STILL passes by value! It takes the value of 'arr' (the address @0xA1), makes a COPY, and puts it in parameter 'nums'. BOTH variables now point to the exact same Heap object.",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "score", val: 10, type: "int" },
            { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
        ]},
        { name: "modifyReference(int[] nums)", active: true, vars: [{ id: "nums", val: "@0xA1", type: "int[]", isRef: true, color: "violet", highlight: true }] }
    ],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 10 ]", refAddr: "@0xA1", color: "violet", highlight: true }]
  },
  {
    line: 20,
    phase: "10. Heap Mutation",
    desc: "nums[0] = 99; We follow the 'nums' pointer (@0xA1) into the Heap and change the object. Because the object physically changed, anyone holding its address sees the change!",
    frames: [
        { name: "main(String[] args)", active: false, paused: true, vars: [
            { id: "score", val: 10, type: "int" },
            { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }
        ]},
        { name: "modifyReference(int[] nums)", active: true, vars: [{ id: "nums", val: "@0xA1", type: "int[]", isRef: true, color: "violet" }] }
    ],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 99 ]", refAddr: "@0xA1", color: "fuchsia", active: true }]
  },
  {
    line: 21,
    phase: "11. Frame Popped",
    desc: "Method ends. The 'nums' parameter is destroyed. However, the changes it made to the Heap object are permanent. When main() looks at 'arr', it sees [ 99 ]!",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "score", val: 10, type: "int" },
        { id: "arr", val: "@0xA1", type: "int[]", isRef: true, color: "violet", highlight: true }
    ]}],
    heap: [{ id: "arrObj", type: "int[]", val: "[ 99 ]", refAddr: "@0xA1", color: "fuchsia", highlight: true }]
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "violet" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        violet: 'text-violet-600',
        fuchsia: 'text-fuchsia-600',
        sky: 'text-sky-600',
        rose: 'text-rose-600'
    };
    const activeColor = colorMap[color] || 'text-violet-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int)\b|\[|\]|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-violet-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-violet-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (part === '[' || part === ']') return <span key={i} className="text-amber-300 font-bold">{part}</span>;
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
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 p-4 rounded-2xl shadow-lg shadow-violet-200 flex items-center justify-center relative overflow-hidden group">
                <ArrowRightLeft className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Pass-by-Value</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase border border-violet-100">Java Foundations</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Method Calls</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="violet" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="violet" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Deep Dive" color="fuchsia" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview Trick" color="rose" />
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
                      <Code2 size={16} className="text-violet-400" />
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
                        <Activity size={16} className="text-violet-500"/>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-violet-300">
                      {cur.desc}
                  </p>
                  
                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: JVM Memory Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-50/50 via-white to-white">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Layers size={20} className="text-violet-600"/> Stack Frames & Passed Values
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-8 relative">
                        
                        {/* THE STACK */}
                        <div className="flex-[4] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> The Stack</span>
                            </div>
                            
                            <div className="p-4 flex flex-col-reverse justify-start gap-4 flex-1 overflow-y-auto z-10">
                                
                                {cur.frames.map((frame, idx) => {
                                    const isTopFrame = idx === cur.frames.length - 1;
                                    
                                    return (
                                    <div key={idx} className={`w-full relative flex flex-col rounded-2xl border-2 transition-all duration-500 animate-in slide-in-from-top-10 shadow-lg overflow-hidden ${isTopFrame && !frame.paused ? 'border-violet-500 shadow-violet-200 bg-white ring-4 ring-violet-50 scale-105 z-20' : 'border-slate-300 bg-slate-100/50 opacity-60 scale-95'}`}>
                                        
                                        {/* Frame Header */}
                                        <div className={`flex justify-between items-center px-4 py-3 border-b ${isTopFrame && !frame.paused ? 'bg-violet-50 border-violet-100' : 'bg-slate-200/50 border-slate-300'}`}>
                                            <div className="flex items-center gap-2">
                                                {isTopFrame && !frame.paused ? <Zap size={14} className="text-violet-500 fill-violet-500"/> : <Pause size={14} className="text-slate-400"/>}
                                                <span className={`text-[12px] font-black font-mono ${isTopFrame && !frame.paused ? 'text-violet-900' : 'text-slate-500'}`}>{frame.name}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Frame Variables (Scope) */}
                                        <div className="p-4 flex flex-col gap-3 min-h-[80px]">
                                            <div className="flex flex-wrap gap-3">
                                                {frame.vars.map((v, vIdx) => {
                                                    const varColor = v.color === 'violet' ? 'sky' : v.color === 'fuchsia' ? 'fuchsia' : 'slate';
                                                    const baseBg = varColor === 'sky' ? 'bg-sky-50 text-sky-700 border-sky-200' : varColor === 'fuchsia' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'bg-slate-50 text-slate-700 border-slate-200';
                                                    
                                                    return (
                                                    <div key={vIdx} className={`relative flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-500 ${v.highlight ? `border-${varColor}-400 scale-[1.15] shadow-md ring-2 ring-${varColor}-100 z-10` : 'border-slate-200'}`}>
                                                        <div className={`text-[9px] font-mono font-black px-3 py-1 text-center border-b bg-slate-100 text-slate-500 border-slate-200`}>
                                                            {v.type} {v.id}
                                                        </div>
                                                        <div className={`font-mono font-black text-center py-2 px-3 text-sm flex items-center justify-center gap-1 ${baseBg} ${v.highlight ? 'bg-white' : ''}`}>
                                                            {v.isRef && <LinkIcon size={12} className="opacity-50"/>}
                                                            {v.val}
                                                        </div>
                                                        
                                                        {/* Visual Dashed Pointer line for References */}
                                                        {v.isRef && (
                                                            <div className={`hidden lg:block absolute -right-6 top-1/2 w-6 border-t-2 border-dashed ${v.highlight ? 'border-violet-500' : 'border-slate-300'}`}></div>
                                                        )}
                                                    </div>
                                                )})}
                                                {frame.vars.length === 0 && (
                                                    <div className="text-xs text-slate-400 italic font-mono pt-2">No variables declared</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )})}
                                
                                {/* Empty Stack State */}
                                {cur.frames.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-mono italic uppercase tracking-widest opacity-60">Stack is empty</div>
                                )}
                            </div>
                        </div>

                        {/* Middle Space for visual connection line */}
                        <div className="hidden lg:flex flex-col justify-center items-center w-8 relative">
                            {cur.frames.some(f => f.vars.some(v => v.isRef)) && (
                                <ArrowRight className="text-violet-300 animate-pulse" size={24}/>
                            )}
                        </div>

                        {/* THE HEAP */}
                        <div className="flex-[4] flex flex-col bg-violet-50/30 rounded-3xl border border-violet-100 shadow-sm relative overflow-hidden">
                            <div className="bg-violet-100/50 border-b border-violet-200/50 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-violet-900 uppercase tracking-widest font-mono flex items-center gap-2"><Box size={16}/> The Heap</span>
                            </div>
                            
                            <div className="p-5 flex flex-wrap content-start justify-center gap-4 flex-1 overflow-y-auto z-10">
                                {cur.heap.map((obj, idx) => (
                                    <div key={idx} className={`w-full relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-500 animate-in zoom-in shadow-sm ${obj.active ? 'bg-white border-fuchsia-500 shadow-fuchsia-200 shadow-lg scale-[1.05]' : obj.highlight ? 'bg-white border-violet-400 shadow-md ring-4 ring-violet-50' : 'bg-white border-violet-200'}`}>
                                        
                                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                                            <div className="flex items-center gap-2">
                                                <Box size={14} className="text-violet-400"/>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 font-mono">Object ({obj.type})</span>
                                            </div>
                                            <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-[10px] font-black font-mono border border-violet-200 tracking-wider">
                                                ADDR: {obj.refAddr}
                                            </span>
                                        </div>
                                        
                                        <div className={`font-mono text-center py-4 rounded-xl border text-xl font-black transition-colors duration-500 ${obj.color === 'fuchsia' ? 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                            {obj.val}
                                        </div>
                                    </div>
                                ))}
                                {cur.heap.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-violet-300 text-xs font-mono italic uppercase tracking-widest opacity-60">Heap is empty</div>
                                )}
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
                  <ArrowRightLeft className="text-violet-600" size={32}/> Passing Data to Methods
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  When you call a method and hand it a variable (e.g., <code>modifyPrimitive(score)</code>), what actually happens inside the computer's memory? Does the method get the <em>actual</em> box named "score", or does it get a copy?
                </p>
                <p className="font-bold text-slate-800 text-xl border-l-4 border-violet-500 pl-4 py-2">
                  In Java, everything is Pass-by-Value. A copy is ALWAYS made.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Cpu size={24} className="text-sky-500"/> Passing Primitives</h3>
                        <p className="text-sm">
                            If you pass an <code>int</code>, Java looks inside the variable box, takes the number (e.g., <code>10</code>), and photocopies it. It hands the photocopy to the new method.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-bold text-rose-600 shadow-sm">
                            Result: If the new method changes the number on its photocopy to 99, your original paper still says 10!
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Box size={24} className="text-violet-500"/> Passing References</h3>
                        <p className="text-sm">
                            If you pass an Array or Object, Java looks inside the variable box. But remember, the box doesn't hold the object; it holds a <strong>memory address</strong> (e.g., <code>@0xA1</code>). Java photocopies the *address*.
                        </p>
                        <div className="bg-violet-50 border border-violet-200 p-4 rounded-xl text-sm font-bold text-violet-800 shadow-sm">
                            Result: The new method now has a photocopy of the map to the house. If it uses the map to go paint the house red, when YOU go to the house later, it will be red!
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
                <SplitSquareHorizontal className="text-fuchsia-500"/> Java vs C++ (Pointers)
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-fuchsia-200 pl-6">
                If you ever talk to a C++ programmer, they will insist that passing an array or object in Java is "Pass-by-Reference". They are technically wrong based on Java's strict definition. Here is why it matters.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* True Pass-By-Reference (C++) */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight mb-4 border-b pb-2">
                            True Pass-by-Reference (C++)
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            In C++, you can pass the <em>actual variable box itself</em> to a method. Not a photocopy. The new method creates an "alias" (a second name) for the exact same spot on the Stack.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed bg-white p-3 rounded-lg border">
                            If the method says <code>variable = new Object()</code>, your original variable outside the method is now pointing to the new object!
                        </p>
                    </div>
                </div>

                {/* Pass Reference By Value (Java) */}
                <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-fuchsia-900 tracking-tight mb-4 border-b border-fuchsia-200 pb-2">
                            Pass Reference-by-Value (Java)
                        </h3>
                        <p className="text-fuchsia-800 text-sm leading-relaxed mb-4">
                            Java <strong>never</strong> shares the Stack variable box. It creates a brand new box for the method, and copies the <em>value</em> (the pointer) into it.
                        </p>
                        <p className="text-fuchsia-800 text-sm leading-relaxed bg-white p-3 rounded-lg border border-fuchsia-100 font-bold">
                            If the Java method says <code>nums = new int[] {'{'}99{'}'}</code>, it only changes its *local* pointer to point to a new object. The original variable in `main()` still points to the old object!
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800 text-center">
                <h3 className="text-xl font-black text-amber-400 mb-2">The Golden Rule to Memorize</h3>
                <p className="text-lg font-mono text-slate-300">
                    A method can mutate the <strong>Object</strong> you pass to it, <br/>but it can never reassign your <strong>Variable</strong>.
                </p>
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
                        <Trophy size={28} /> The "Swap" Trick Question
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer asks you to trace this code:</span>
                            <code>
                                int a = 1; int b = 2;<br/>
                                swap(a, b);<br/>
                                System.out.println(a + " " + b); // What prints?<br/><br/>
                                void swap(int x, int y) {'{'}<br/>
                                &nbsp;&nbsp;&nbsp;int temp = x;<br/>
                                &nbsp;&nbsp;&nbsp;x = y;<br/>
                                &nbsp;&nbsp;&nbsp;y = temp;<br/>
                                {'}'}
                            </code>
                        </div>
                        <div className="border-l-4 border-rose-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide uppercase">
                                It prints: "1 2"
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                This is the classic Pass-by-Value trap. The <code>swap</code> method successfully swaps its local copies (<code>x</code> and <code>y</code>). 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed font-bold text-amber-300">
                                But because it's a primitive, the original <code>a</code> and <code>b</code> back in the main method are completely unaffected. The method completes, its frame is destroyed (taking the swapped x and y with it), and the main variables remain exactly as they were.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-violet-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Layers size={18} className="text-violet-500"/> Array Swap Follow-up
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Interviewer: "How would you rewrite it so the swap actually works?"
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                You must pass an Object/Array. 
                            </p>
                            <div className="bg-slate-50 p-3 rounded font-mono text-xs text-slate-700">
                                void swap(int[] arr) {'{'}<br/>
                                &nbsp;&nbsp;int temp = arr[0];<br/>
                                &nbsp;&nbsp;arr[0] = arr[1];<br/>
                                &nbsp;&nbsp;arr[1] = temp;<br/>
                                {'}'}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">By passing the array reference, the method mutates the actual Heap data.</p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <BookOpen size={18} className="text-sky-500"/> Wrap Up
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                If you understand the difference between mutating a local variable on the Stack vs mutating an Object in the Heap via a copied pointer, you have mastered Java Memory.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                Next Lesson Preview: Strings! What happens when you pass a String to a method and try to change it? (Hint: Strings are Immutable objects, so they behave very strangely!)
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
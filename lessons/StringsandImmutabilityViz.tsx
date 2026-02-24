import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Box, Play, Pause, RefreshCw, Type, 
  AlertTriangle, Link as LinkIcon, ShieldAlert, Zap
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Main {
    public static void main(String[] args) {
        // 1. String Literals (The Pool)
        String a = "Cat";
        String b = "Cat";
        
        // 2. The 'new' Keyword (Standard Heap)
        String c = new String("Cat");
        
        // 3. Immutability In Action
        a = a + "s";
        
        // Let's check equality!
        boolean test1 = (a == b); // false
        boolean test2 = (b == c); // false
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. JVM Startup",
    desc: "The JVM invokes main(). Notice the Heap is split into two areas: the Standard Heap, and a special optimized zone called the String Constant Pool.",
    frames: [{ name: "main(String[] args)", active: true, vars: [] }],
    pool: [],
    heap: []
  },
  {
    line: 4,
    phase: "2. First String Literal",
    desc: "String a = \"Cat\"; Because we used quotes (a literal), Java checks the String Pool. \"Cat\" doesn't exist yet, so it creates it at @P1 and points 'a' to it.",
    frames: [{ name: "main(String[] args)", active: true, vars: [{ id: "a", val: "@P1", type: "String", isRef: true, color: "rose", highlight: true }] }],
    pool: [{ id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose", active: true }],
    heap: []
  },
  {
    line: 5,
    phase: "3. String Pool Optimization",
    desc: "String b = \"Cat\"; Java checks the Pool again. \"Cat\" ALREADY EXISTS at @P1! Instead of wasting memory making a second \"Cat\", it just points 'b' to the exact same object.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "a", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "b", val: "@P1", type: "String", isRef: true, color: "rose", highlight: true }
    ]}],
    pool: [{ id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose", highlight: true }],
    heap: []
  },
  {
    line: 8,
    phase: "4. Bypassing the Pool",
    desc: "String c = new String(\"Cat\"); Using the 'new' keyword forces Java to skip the Pool. It creates a brand new, separate object in the Standard Heap at @H2.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "a", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "b", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "c", val: "@H2", type: "String", isRef: true, color: "amber", highlight: true }
    ]}],
    pool: [{ id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose" }],
    heap: [{ id: "obj2", val: "\"Cat\"", refAddr: "@H2", color: "amber", active: true }]
  },
  {
    line: 11,
    phase: "5. Immutability Attempt",
    desc: "a = a + \"s\"; We try to modify 'a'. BUT Strings are IMMUTABLE. Java is not allowed to change the \"Cat\" object at @P1 (because 'b' is still relying on it!).",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "a", val: "@P1", type: "String", isRef: true, color: "rose", highlight: true },
        { id: "b", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "c", val: "@H2", type: "String", isRef: true, color: "amber" }
    ]}],
    pool: [{ id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose", highlight: true }],
    heap: [{ id: "obj2", val: "\"Cat\"", refAddr: "@H2", color: "amber" }]
  },
  {
    line: 11,
    phase: "6. New Object Created",
    desc: "Instead of changing \"Cat\", Java creates a brand new string \"Cats\" in the pool at @P3. It then updates 'a' to point to this new memory address.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "a", val: "@P3", type: "String", isRef: true, color: "sky", highlight: true },
        { id: "b", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "c", val: "@H2", type: "String", isRef: true, color: "amber" }
    ]}],
    pool: [
        { id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose" },
        { id: "obj3", val: "\"Cats\"", refAddr: "@P3", color: "sky", active: true }
    ],
    heap: [{ id: "obj2", val: "\"Cat\"", refAddr: "@H2", color: "amber" }]
  },
  {
    line: 14,
    phase: "7. Equality Check (==)",
    desc: "(a == b) evaluates to FALSE. The '==' operator does NOT check the text. It only checks if the MEMORY ADDRESSES match. @P3 does not equal @P1.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "a", val: "@P3", type: "String", isRef: true, color: "sky" },
        { id: "b", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "c", val: "@H2", type: "String", isRef: true, color: "amber" },
        { id: "test1", val: "false", type: "boolean", highlight: true }
    ]}],
    pool: [
        { id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose" },
        { id: "obj3", val: "\"Cats\"", refAddr: "@P3", color: "sky" }
    ],
    heap: [{ id: "obj2", val: "\"Cat\"", refAddr: "@H2", color: "amber" }]
  },
  {
    line: 15,
    phase: "8. Equality Check 2 (==)",
    desc: "(b == c) evaluates to FALSE. Even though they both contain the text \"Cat\", 'b' points to @P1 in the Pool, and 'c' points to @H2 in the Standard Heap.",
    frames: [{ name: "main(String[] args)", active: true, vars: [
        { id: "a", val: "@P3", type: "String", isRef: true, color: "sky" },
        { id: "b", val: "@P1", type: "String", isRef: true, color: "rose" },
        { id: "c", val: "@H2", type: "String", isRef: true, color: "amber" },
        { id: "test1", val: "false", type: "boolean" },
        { id: "test2", val: "false", type: "boolean", highlight: true }
    ]}],
    pool: [
        { id: "obj1", val: "\"Cat\"", refAddr: "@P1", color: "rose", highlight: true },
        { id: "obj3", val: "\"Cats\"", refAddr: "@P3", color: "sky" }
    ],
    heap: [{ id: "obj2", val: "\"Cat\"", refAddr: "@H2", color: "amber", highlight: true }]
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "rose" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        rose: 'text-rose-600',
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        purple: 'text-purple-600'
    };
    const activeColor = colorMap[color] || 'text-rose-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|static|class|void|boolean|new)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-rose-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-rose-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-emerald-400">{part}</span>;
          if (['public', 'static', 'class', 'void', 'new'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'boolean') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (part === 'String') return <span key={i} className="text-amber-300 font-bold">{part}</span>;
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
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 4500); // Slightly longer for reading
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
            <div className="bg-gradient-to-br from-rose-500 to-pink-700 p-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center relative overflow-hidden group">
                <Type className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Strings & Immutability</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded tracking-widest uppercase border border-rose-100">Java Foundations</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">The String Pool</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="rose" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="rose" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Immutability" color="amber" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview Trap" color="purple" />
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
                      <Code2 size={16} className="text-rose-400" />
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
                        <Activity size={16} className="text-rose-500"/>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-rose-300">
                      {cur.desc}
                  </p>
                  
                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-rose-400 to-pink-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: JVM Memory Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-50/50 via-white to-white">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Database size={20} className="text-rose-500"/> Memory Topology
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
                        
                        {/* THE STACK */}
                        <div className="flex-[3] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> The Stack</span>
                            </div>
                            
                            <div className="p-4 flex flex-col-reverse justify-start gap-4 flex-1 overflow-y-auto z-10">
                                {cur.frames.map((frame, idx) => (
                                    <div key={idx} className="w-full relative flex flex-col rounded-2xl border-2 border-slate-800 shadow-lg overflow-hidden bg-white z-20">
                                        <div className="bg-slate-800 px-4 py-2 border-b">
                                            <span className="text-[12px] font-black font-mono text-white">{frame.name}</span>
                                        </div>
                                        
                                        <div className="p-3 flex flex-col gap-2 min-h-[80px]">
                                            {frame.vars.map((v, vIdx) => {
                                                const varColor = v.color === 'rose' ? 'rose' : v.color === 'sky' ? 'sky' : v.color === 'amber' ? 'amber' : 'slate';
                                                
                                                return (
                                                <div key={vIdx} className={`relative flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-500 ${v.highlight ? `border-${varColor}-400 scale-[1.05] shadow-md z-10` : 'border-slate-200'}`}>
                                                    <div className="text-[9px] font-mono font-black px-2 py-1 flex justify-between bg-slate-100 text-slate-500 border-b border-slate-200">
                                                        <span>{v.type}</span>
                                                        <span>{v.id}</span>
                                                    </div>
                                                    <div className={`font-mono font-black text-center py-1.5 px-2 text-xs flex items-center justify-center gap-1 bg-${varColor}-50 text-${varColor}-700`}>
                                                        {v.isRef && <LinkIcon size={10} className="opacity-50"/>}
                                                        {v.val}
                                                    </div>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arrow connector area */}
                        <div className="hidden lg:flex flex-col justify-center items-center w-4 relative">
                            {cur.frames[0]?.vars.length > 0 && <ArrowRight className="text-slate-300" size={20}/>}
                        </div>

                        {/* THE HEAP (Split into Standard and Pool) */}
                        <div className="flex-[5] flex flex-col gap-4">
                            
                            {/* STRING POOL */}
                            <div className="flex-1 flex flex-col bg-rose-50/40 rounded-3xl border-2 border-rose-200 shadow-sm relative overflow-hidden">
                                <div className="bg-rose-100/60 border-b border-rose-200 p-3 flex items-center justify-between">
                                    <span className="text-[11px] font-black text-rose-900 uppercase tracking-widest font-mono flex items-center gap-1.5"><Database size={14}/> String Constant Pool</span>
                                </div>
                                <div className="p-4 flex flex-wrap content-start justify-center gap-3 flex-1 overflow-y-auto">
                                    {cur.pool.map((obj, idx) => (
                                        <div key={idx} className={`relative flex flex-col p-3 rounded-2xl border-2 transition-all duration-500 animate-in zoom-in bg-white shadow-sm w-32 ${obj.active ? 'border-rose-500 shadow-rose-200 shadow-lg scale-110 z-10' : obj.highlight ? 'border-rose-400 ring-2 ring-rose-100' : 'border-rose-200'}`}>
                                            <span className="absolute -top-2.5 -right-2.5 bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[8px] font-black font-mono border border-rose-200 tracking-wider">
                                                {obj.refAddr}
                                            </span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 text-center">String Obj</span>
                                            <div className="font-mono text-center font-bold text-rose-600 bg-rose-50 rounded p-1 border border-rose-100">
                                                {obj.val}
                                            </div>
                                        </div>
                                    ))}
                                    {cur.pool.length === 0 && <div className="flex items-center text-rose-300 text-[10px] font-mono italic uppercase tracking-widest">Pool Empty</div>}
                                </div>
                            </div>

                            {/* STANDARD HEAP */}
                            <div className="flex-1 flex flex-col bg-amber-50/40 rounded-3xl border-2 border-amber-200 shadow-sm relative overflow-hidden">
                                <div className="bg-amber-100/60 border-b border-amber-200 p-3 flex items-center justify-between">
                                    <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest font-mono flex items-center gap-1.5"><Box size={14}/> Standard Heap</span>
                                </div>
                                <div className="p-4 flex flex-wrap content-start justify-center gap-3 flex-1 overflow-y-auto">
                                    {cur.heap.map((obj, idx) => (
                                        <div key={idx} className={`relative flex flex-col p-3 rounded-2xl border-2 transition-all duration-500 animate-in zoom-in bg-white shadow-sm w-32 ${obj.active ? 'border-amber-500 shadow-amber-200 shadow-lg scale-110 z-10' : obj.highlight ? 'border-amber-400 ring-2 ring-amber-100' : 'border-amber-200'}`}>
                                            <span className="absolute -top-2.5 -right-2.5 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[8px] font-black font-mono border border-amber-200 tracking-wider">
                                                {obj.refAddr}
                                            </span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 text-center">String Obj</span>
                                            <div className="font-mono text-center font-bold text-amber-600 bg-amber-50 rounded p-1 border border-amber-100">
                                                {obj.val}
                                            </div>
                                        </div>
                                    ))}
                                    {cur.heap.length === 0 && <div className="flex items-center text-amber-300 text-[10px] font-mono italic uppercase tracking-widest">Heap Empty</div>}
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
                  <Type className="text-rose-500" size={32}/> Strings: The Special Object
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  In Java, <code>String</code> is not a primitive type like <code>int</code> or <code>char</code>. It is a full-blown Object. However, because text is used so incredibly often in programming, Java treats Strings differently than any other object to save memory and boost performance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Database className="text-rose-500"/> The String Pool</h3>
                        <p className="text-sm">
                            When you create a String using double quotes (a "literal"), Java doesn't just throw it in the Heap. It places it in a highly organized caching area called the <strong>String Constant Pool</strong>.
                        </p>
                        <p className="text-sm font-bold bg-rose-50 p-3 rounded-lg border border-rose-100 text-rose-800">
                            If you try to create another String with the exact same letters, Java won't build a new object. It simply hands you the memory address of the one already in the pool!
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2"><Box className="text-amber-500"/> The 'new' Keyword</h3>
                        <p className="text-sm">
                            If you explicitly write <code>new String("Text")</code>, you are forcing Java to bypass the Pool optimization. 
                        </p>
                        <p className="text-sm bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800">
                            Java will dutifully create a brand new, redundant Object in the standard Heap space, even if that exact text already exists in the Pool. (This is generally considered bad practice).
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
                <ShieldAlert className="text-amber-500"/> Immutability Explained
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-amber-200 pl-6">
                Strings in Java are <strong>Immutable</strong>. This means once a String object is created in memory, its contents can NEVER be changed. Ever.
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group border border-slate-800 shadow-xl">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Zap size={150} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="font-black text-xl text-emerald-400 tracking-tight mb-2">Wait, but I change strings all the time?</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            If you write <code>name = name + " Smith";</code>, it *looks* like you are modifying the existing object. You are not.
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Under the hood, Java creates a <strong>brand new Object</strong> with the combined text, places it in the memory, and then quietly changes your variable's pointer to look at the new object. The original object remains completely untouched.
                        </p>
                    </div>
                    <div className="w-full md:w-auto bg-black/50 border border-slate-700 p-6 rounded-2xl font-mono text-sm space-y-4">
                        <div>
                            <span className="text-slate-400 text-[10px] uppercase block mb-1">Step 1</span>
                            <span className="text-sky-400">String</span> s = <span className="text-emerald-400">"Hi"</span>;
                            <div className="text-rose-400 text-xs mt-1">↳ s points to @P1 ("Hi")</div>
                        </div>
                        <div className="border-t border-slate-700 pt-3">
                            <span className="text-slate-400 text-[10px] uppercase block mb-1">Step 2</span>
                            s = s + <span className="text-emerald-400">"!"</span>;
                            <div className="text-sky-400 text-xs mt-1">↳ creates new @P2 ("Hi!")</div>
                            <div className="text-rose-400 text-xs">↳ s now points to @P2</div>
                            <div className="text-slate-500 text-xs">↳ @P1 ("Hi") still exists!</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-slate-200 rounded-3xl p-6">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                        Why make them immutable?
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                        <li><strong>Security:</strong> If a string holding a database password could be changed maliciously via a secondary reference, the app would be easily hacked.</li>
                        <li><strong>The Pool:</strong> The String Pool ONLY works because of immutability. If 'a' and 'b' share "Cat", and 'a' was allowed to mutate it to "Cats", it would break variable 'b' entirely!</li>
                    </ul>
                </div>

                <div className="border border-slate-200 rounded-3xl p-6">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                        StringBuilder
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        Because of immutability, running a loop that adds a character to a string 1,000 times will literally create 1,000 abandoned objects in memory. Very slow!
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        <strong>Solution:</strong> Use <code>StringBuilder</code>. It is a special class that *is* mutable. It changes the text inside the same memory address without spawning new objects.
                    </p>
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
                        <Trophy size={28} /> == vs .equals()
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Code Snippet:</span>
                            <code>
                                String s1 = "Hello";<br/>
                                String s2 = new String("Hello");<br/><br/>
                                System.out.println(s1 == s2);<br/>
                                System.out.println(s1.equals(s2));
                            </code>
                        </div>
                        <div className="border-l-4 border-rose-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide">
                                OUTPUT: <br/>
                                <code>false</code><br/>
                                <code>true</code>
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                This is the #1 most failed basic Java question.
                            </p>
                            <ul className="text-sm text-slate-300 space-y-3">
                                <li>
                                    <strong className="text-rose-400">The == Operator:</strong> Evaluates memory addresses. <code>s1</code> points to the Pool. <code>s2</code> points to the Standard Heap. Their addresses are different. Thus, false.
                                </li>
                                <li>
                                    <strong className="text-emerald-400">The .equals() Method:</strong> Evaluates the actual characters inside the object. Since both hold the letters H-e-l-l-o, it returns true.
                                </li>
                            </ul>
                            <div className="bg-rose-900/30 text-rose-200 p-3 rounded font-bold mt-2">
                                Rule: ALWAYS use .equals() to compare Strings in Java!
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
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Database, Box, Link as LinkIcon, Info,
  Play, Pause, RefreshCw, Grid2x2, AlertTriangle, FastForward
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Main {
    public static void main(String[] args) {
        // 1. Declaration & Allocation
        int[] nums = new int[3];
        
        // 2. Initialization (0-indexed)
        nums[0] = 10;
        nums[1] = 20;
        nums[2] = 30;
        
        // 3. Reference Copy (Aliasing)
        int[] alias = nums;
        
        // 4. Modifying via the alias
        alias[0] = 99;
        
        // 5. Array bounds danger
        // int crash = nums[3]; // Error!
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "JVM Initialization",
    desc: "Program begins. Stack and Heap are empty.",
    stack: [],
    heap: []
  },
  {
    line: 4,
    phase: "Array Creation",
    desc: "new int[3] creates an Array Object in the Heap. Java guarantees a contiguous block of memory. Elements default to 0. The Stack reference 'nums' points to it.",
    stack: [{ id: 'nums', type: 'int[]', val: '@0x5F', isRef: true, color: 'blue', active: true }],
    heap: [{ id: 'arr1', type: 'int[]', val: [0, 0, 0], refAddr: '@0x5F', color: 'blue', active: true }]
  },
  {
    line: 7,
    phase: "Index 0 Assignment",
    desc: "nums[0] = 10; The JVM follows the reference @0x5F, goes to index 0, and updates the value from the default 0 to 10.",
    stack: [{ id: 'nums', type: 'int[]', val: '@0x5F', isRef: true, color: 'blue' }],
    heap: [{ id: 'arr1', type: 'int[]', val: [10, 0, 0], highlightIdx: 0, refAddr: '@0x5F', color: 'blue' }]
  },
  {
    line: 8,
    phase: "Index 1 Assignment",
    desc: "nums[1] = 20; JVM updates the second contiguous slot.",
    stack: [{ id: 'nums', type: 'int[]', val: '@0x5F', isRef: true, color: 'blue' }],
    heap: [{ id: 'arr1', type: 'int[]', val: [10, 20, 0], highlightIdx: 1, refAddr: '@0x5F', color: 'blue' }]
  },
  {
    line: 9,
    phase: "Index 2 Assignment",
    desc: "nums[2] = 30; The array is now fully populated.",
    stack: [{ id: 'nums', type: 'int[]', val: '@0x5F', isRef: true, color: 'blue' }],
    heap: [{ id: 'arr1', type: 'int[]', val: [10, 20, 30], highlightIdx: 2, refAddr: '@0x5F', color: 'blue' }]
  },
  {
    line: 12,
    phase: "Aliasing (Pointer Copy)",
    desc: "int[] alias = nums; We declare a new reference. It copies the ADDRESS (@0x5F). We do NOT create a new array. Both variables point to the exact same Heap object.",
    stack: [
        { id: 'nums', type: 'int[]', val: '@0x5F', isRef: true, color: 'blue' },
        { id: 'alias', type: 'int[]', val: '@0x5F', isRef: true, color: 'purple', active: true }
    ],
    heap: [{ id: 'arr1', type: 'int[]', val: [10, 20, 30], refAddr: '@0x5F', color: 'blue', highlight: true }]
  },
  {
    line: 15,
    phase: "Modifying via Alias",
    desc: "alias[0] = 99; We change index 0 using the 'alias' pointer. Because 'nums' points to the same object, if we print nums[0] right now, it will output 99!",
    stack: [
        { id: 'nums', type: 'int[]', val: '@0x5F', isRef: true, color: 'blue' },
        { id: 'alias', type: 'int[]', val: '@0x5F', isRef: true, color: 'purple' }
    ],
    heap: [{ id: 'arr1', type: 'int[]', val: [99, 20, 30], highlightIdx: 0, refAddr: '@0x5F', color: 'blue', active: true }]
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "blue" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: 'text-sky-600',
        purple: 'text-purple-600',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600'
    };
    const activeColor = colorMap[color] || 'text-sky-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|new)\b|\[|\]|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-sky-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void', 'new'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (part === '[' || part === ']') return <span key={i} className="text-amber-300 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>;
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
            <div className="bg-gradient-to-br from-sky-500 to-blue-700 p-4 rounded-2xl shadow-lg shadow-sky-200 flex items-center justify-center relative overflow-hidden group">
                <Grid2x2 className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Arrays & Memory</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded tracking-widest uppercase border border-sky-100">Java DSA Basics</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Contiguous Blocks</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="blue" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Simulator" color="blue" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" color="purple" />
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
                      <Code2 size={16} className="text-sky-400" />
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
                        <Activity size={16} className="text-sky-500"/>
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
                          <div className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-sky-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: JVM Memory Arena (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px]">
                    
                    {/* Arena Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Database size={20} className="text-sky-500"/> Array Memory Allocation
                        </h3>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 gap-8 relative">
                        
                        {/* THE STACK */}
                        <div className="flex-[4] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-2"><Layers size={16}/> The Stack</span>
                            </div>
                            
                            <div className="p-4 flex flex-col-reverse justify-start gap-3 flex-1 overflow-y-auto z-10">
                                {cur.stack.length > 0 && (
                                    <div className="border border-slate-200 rounded-2xl p-2 pb-3 bg-white/50 relative mt-4">
                                        <div className="absolute -top-3 left-3 bg-slate-100 px-2 text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono rounded border border-slate-200">main() frame</div>
                                        
                                        <div className="flex flex-col-reverse gap-2 mt-2">
                                            {cur.stack.map((item, idx) => {
                                                const colorClasses = item.color === 'purple' ? 'border-purple-300 text-purple-700 bg-purple-50' : 'border-sky-300 text-sky-700 bg-sky-50';
                                                
                                                return (
                                                <div key={idx} className={`relative flex items-center p-3 rounded-xl border-2 transition-all duration-500 animate-in slide-in-from-bottom-4 shadow-sm ${item.active ? 'bg-white border-slate-800 scale-[1.02] shadow-md z-20' : 'bg-white border-slate-200'}`}>
                                                    
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest font-mono text-slate-500`}>{item.type}</span>
                                                        </div>
                                                        <div className="font-mono font-bold flex flex-wrap items-center gap-2">
                                                            <span className="text-slate-800 text-sm">{item.id}</span>
                                                            <span className="text-slate-300 text-xs">=</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs border flex items-center gap-1 ${colorClasses}`}>
                                                                <LinkIcon size={10}/> {item.val}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Pointer dashed line */}
                                                    {item.isRef && (
                                                        <div className={`hidden lg:block absolute -right-6 top-1/2 w-6 border-t-2 border-dashed ${item.active ? 'border-slate-800' : 'border-slate-300'}`}></div>
                                                    )}
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                )}
                                {cur.stack.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-mono italic uppercase tracking-widest opacity-60">Stack empty</div>
                                )}
                            </div>
                        </div>

                        {/* Arrow connector area */}
                        <div className="hidden lg:flex flex-col justify-center items-center w-8 relative">
                            {cur.stack.length > 0 && (
                                <ArrowRight className="text-sky-300 animate-pulse" size={24}/>
                            )}
                        </div>

                        {/* THE HEAP (Array Specific UI) */}
                        <div className="flex-[5] flex flex-col bg-sky-50/30 rounded-3xl border border-sky-100 shadow-sm relative overflow-hidden">
                            <div className="bg-sky-100/50 border-b border-sky-200/50 p-4 flex items-center justify-between relative z-10">
                                <span className="text-sm font-black text-sky-900 uppercase tracking-widest font-mono flex items-center gap-2"><Box size={16}/> The Heap</span>
                            </div>
                            
                            <div className="p-5 flex flex-wrap content-start gap-5 flex-1 overflow-y-auto z-10 relative">
                                {cur.heap.map((obj, idx) => (
                                    <div key={idx} className={`w-full relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-500 animate-in zoom-in bg-white shadow-sm ${obj.active ? 'border-slate-800 shadow-xl scale-[1.02]' : obj.highlight ? 'border-sky-400 bg-sky-50 shadow-md' : 'border-sky-200'}`}>
                                        
                                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <Grid2x2 size={16} className="text-sky-500"/>
                                                <span className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-700">Object ({obj.type})</span>
                                            </div>
                                            <span className="px-2.5 py-1 rounded text-[10px] font-black font-mono border tracking-wider text-sky-700 bg-sky-100 border-sky-200">
                                                ADDR: {obj.refAddr}
                                            </span>
                                        </div>
                                        
                                        {/* ARRAY RENDERER */}
                                        <div className="flex justify-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <div className="flex gap-2">
                                                {Array.isArray(obj.val) && obj.val.map((val, arrIdx) => (
                                                    <div key={arrIdx} className="flex flex-col items-center gap-1">
                                                        <span className="text-[10px] font-black text-slate-400 font-mono">[{arrIdx}]</span>
                                                        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-lg transition-all duration-500 ${obj.highlightIdx === arrIdx ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-md' : 'bg-white border-slate-300 text-slate-700'}`}>
                                                            {val}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-center mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Contiguous Memory Block</div>
                                    </div>
                                ))}
                                {cur.heap.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-sky-300 text-xs font-mono italic uppercase tracking-widest opacity-60">Heap empty</div>
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
                  <Grid2x2 className="text-sky-500" size={32}/> Arrays: The Multi-Box Container
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p>
                  Until now, a variable could only hold a single value. What if we need to store 1,000 test scores? An <strong>Array</strong> allows you to create a single variable that holds a collection of values, all of the exact same type.
                </p>

                <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl flex flex-col items-center">
                    <div className="font-mono font-bold text-lg text-slate-800 mb-2">
                        <span className="text-sky-600">int[]</span> <span className="text-slate-700">scores</span> = <span className="text-pink-600">new</span> <span className="text-sky-600">int</span>[<span className="text-emerald-600">5</span>];
                    </div>
                    <div className="text-sm text-sky-800 text-center">
                        This tells the JVM: "Create a new array capable of holding exactly 5 integers, and point my `scores` variable to it."
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2">Key Array Rules</h3>
                        <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex gap-2">
                                <ArrowRight className="text-sky-400 shrink-0" size={18}/> 
                                <span><strong>Fixed Size:</strong> Once created (`new int[5]`), an array cannot grow or shrink. Its length is permanently locked.</span>
                            </li>
                            <li className="flex gap-2">
                                <ArrowRight className="text-sky-400 shrink-0" size={18}/> 
                                <span><strong>0-Indexed:</strong> The first element is always at index `0`. The last element is at index `length - 1`.</span>
                            </li>
                            <li className="flex gap-2">
                                <ArrowRight className="text-sky-400 shrink-0" size={18}/> 
                                <span><strong>Default Values:</strong> When created with `new`, Java automatically fills it with defaults: `0` for numbers, `false` for booleans, `null` for Objects.</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl border-b pb-2">Initialization Syntaxes</h3>
                        <p className="text-sm">Java gives you a few ways to build arrays:</p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner font-mono text-sm space-y-3">
                            <div>
                                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-widest mb-1">Method 1: Empty Array</span>
                                <span className="text-sky-600 font-bold">int[]</span> arr = <span className="text-pink-500 font-bold">new</span> <span className="text-sky-600 font-bold">int</span>[3];
                            </div>
                            <div className="border-t border-slate-200 pt-3">
                                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-widest mb-1">Method 2: Literal (Shorthand)</span>
                                <span className="text-sky-600 font-bold">int[]</span> arr = {'{'}10, 20, 30{'}'};
                            </div>
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
                <Box className="text-sky-600"/> Contiguous Memory
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-200 pl-6">
                Why are arrays so fast? Because of how the JVM physically places them in the Heap memory. They are mathematically structured for speed.
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Grid2x2 size={150} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-5">
                        <h3 className="font-black text-xl text-amber-400 tracking-tight flex items-center gap-2">
                            <FastForward size={20}/> O(1) Time Complexity Access
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            When you declare <code>new int[5]</code>, the JVM doesn't scatter 5 integers around the Heap. It finds a single, unbroken block of memory large enough to hold 5 integers back-to-back. This is called <strong>Contiguous Memory</strong>.
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed font-bold bg-white/10 p-3 rounded-lg border border-white/20">
                            Because they are packed together, if the computer knows the memory address where the array starts, it can instantly calculate the exact location of ANY element using simple math: <br/><br/>
                            <span className="font-mono text-emerald-400 text-xs text-center block">Target Address = Start Address + (Index * Element Size)</span>
                        </p>
                    </div>
                    
                    {/* Visualizer of Contiguous Memory */}
                    <div className="w-full md:w-auto p-4 bg-black/40 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-0">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 font-mono mb-1">@0x100</span>
                                <div className="w-12 h-16 bg-sky-500/20 border border-sky-500 flex items-center justify-center text-white font-mono font-bold">10</div>
                                <span className="text-[10px] text-slate-500 font-mono mt-1">arr[0]</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 font-mono mb-1">@0x104</span>
                                <div className="w-12 h-16 bg-sky-500/20 border border-sky-500 border-l-0 flex items-center justify-center text-white font-mono font-bold">20</div>
                                <span className="text-[10px] text-slate-500 font-mono mt-1">arr[1]</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 font-mono mb-1">@0x108</span>
                                <div className="w-12 h-16 bg-sky-500/20 border border-sky-500 border-l-0 flex items-center justify-center text-white font-mono font-bold">30</div>
                                <span className="text-[10px] text-slate-500 font-mono mt-1">arr[2]</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center mt-3 uppercase tracking-widest">(Integers take 4 bytes each)</p>
                    </div>
                </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 shadow-sm flex items-start gap-4">
                <AlertTriangle className="text-rose-500 shrink-0" size={28}/>
                <div>
                    <h3 className="font-black text-rose-800 text-lg mb-2">ArrayIndexOutOfBoundsException</h3>
                    <p className="text-sm text-rose-700 leading-relaxed">
                        Because arrays are fixed contiguous blocks, Java strict checks boundaries. If you have a 3-element array and ask for <code>arr[3]</code> (the 4th element), Java throws this exception. The memory immediately following the array belongs to something else, and Java physically blocks you from reading or overwriting it to prevent critical security flaws and crashes.
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
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> Array Aliasing (Pass by Value)
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Code Snippet:</span>
                            <code>
                                int[] a = {'{'}1, 2, 3{'}'};<br/>
                                int[] b = a;<br/>
                                b[0] = 99;<br/>
                                System.out.println(a[0]); // What does this print?
                            </code>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-6 space-y-4">
                            <p className="text-lg text-white font-bold tracking-wide uppercase">
                                It prints 99.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                This loops back to your understanding of Memory! An array is a Reference Type. The variable <code>a</code> does not hold the array; it holds the memory address (e.g., @0x55).
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <code>int[] b = a;</code> copies the <em>value of the reference</em>. Now both <code>a</code> and <code>b</code> hold @0x55. Since they point to the exact same array object in the Heap, modifying the array via <code>b</code> mutates the data that <code>a</code> is pointing to. If you want a true independent copy, you must explicitly clone it: <code>int[] b = Arrays.copyOf(a, a.length);</code>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Layers size={18} className="text-sky-500"/> Array vs. ArrayList
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                "If arrays are fixed size, how do we make dynamic lists?" 
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                Java provides <code>ArrayList</code>. Under the hood, an ArrayList *is* just a normal Array! 
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                When you add too many items to an ArrayList, it secretly creates a brand new, larger array behind the scenes, copies all your old elements into the new array, and throws the old array away for Garbage Collection.
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Activity size={18} className="text-emerald-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-4">
                            <ul className="space-y-3">
                                <li className="flex justify-between items-center text-sm border-b pb-2">
                                    <span className="text-slate-600">Access by Index <code>arr[i]</code></span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                </li>
                                <li className="flex justify-between items-center text-sm border-b pb-2">
                                    <span className="text-slate-600">Search (Unsorted)</span>
                                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">O(N)</span>
                                </li>
                                <li className="flex justify-between items-center text-sm border-b pb-2">
                                    <span className="text-slate-600">Insertion / Deletion</span>
                                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">O(N)</span>
                                </li>
                                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                                    *Insertion in a standard array is O(N) because to insert at the front, you must manually loop through and shift every single existing element one spot to the right to make room.
                                </p>
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
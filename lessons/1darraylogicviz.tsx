import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Play, Pause, RefreshCw, GitCommit, Calculator, 
  Zap, Box, AlertTriangle, Grid2x2, Target, Crosshair
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class ArrayLogic {
    public static void main(String[] args) {
        int[] arr = { 4, 1, 9, -2 };
        
        // 1. Assume the first element is the max
        int max = arr[0]; 
        
        // 2. Traverse the REST of the array
        for (int i = 1; i < arr.length; i++) {
            
            // 3. Compare current element with our max
            if (arr[i] > max) {
                // We found a new champion!
                max = arr[i]; 
            }
        }
        
        System.out.println("Max: " + max);
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. Program Start",
    desc: "We are going to find the maximum value in an array using the 'King of the Hill' algorithm.",
    vars: [],
    arr: [],
    evaluator: null,
    activeIdx: -1
  },
  {
    line: 3,
    phase: "2. Array Initialization",
    desc: "int[] arr = { 4, 1, 9, -2 }; The array is created in memory. It has a length of 4, so valid indices are 0 to 3.",
    vars: [],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: -1
  },
  {
    line: 6,
    phase: "3. Initialize 'max'",
    desc: "int max = arr[0]; We assume the first element (4) is the largest one we've seen so far. It becomes our initial 'champion'.",
    vars: [{ id: "max", val: 4, type: "int", color: "amber", active: true }],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: 0,
    highlightIdx: 0
  },
  {
    line: 9,
    phase: "4. Loop Start (i = 1)",
    desc: "for (int i = 1; ...) We start our loop at index 1. Why? Because we already looked at index 0 to set our initial max!",
    vars: [
        { id: "max", val: 4, type: "int", color: "amber" },
        { id: "i", val: 1, type: "int", color: "sky", active: true }
    ],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: 1
  },
  {
    line: 12,
    phase: "5. Condition Check",
    desc: "if (arr[i] > max) -> We look at the value at arr[1], which is 1. Is 1 greater than our current max (4)?",
    vars: [
        { id: "max", val: 4, type: "int", color: "amber" },
        { id: "i", val: 1, type: "int", color: "sky" }
    ],
    arr: [4, 1, 9, -2],
    evaluator: { left: "1", op: ">", right: "4", res: "FALSE" },
    activeIdx: 1
  },
  {
    line: 9,
    phase: "6. Loop Increment (i = 2)",
    desc: "Because 1 was NOT greater than 4, we skip the 'if' block. The loop updates 'i' to 2.",
    vars: [
        { id: "max", val: 4, type: "int", color: "amber" },
        { id: "i", val: 2, type: "int", color: "sky", highlight: true }
    ],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: 2
  },
  {
    line: 12,
    phase: "7. Condition Check",
    desc: "if (arr[2] > max) -> We look at arr[2], which is 9. Is 9 greater than our current max (4)? YES!",
    vars: [
        { id: "max", val: 4, type: "int", color: "amber" },
        { id: "i", val: 2, type: "int", color: "sky" }
    ],
    arr: [4, 1, 9, -2],
    evaluator: { left: "9", op: ">", right: "4", res: "TRUE" },
    activeIdx: 2,
    highlightIdx: 2
  },
  {
    line: 14,
    phase: "8. Update Champion",
    desc: "max = arr[i]; We found a new champion! We overwrite 'max' with the new value 9.",
    vars: [
        { id: "max", val: 9, type: "int", color: "amber", active: true },
        { id: "i", val: 2, type: "int", color: "sky" }
    ],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: 2,
    championIdx: 2
  },
  {
    line: 9,
    phase: "9. Loop Increment (i = 3)",
    desc: "The loop increments 'i' to 3. This is the last element in the array.",
    vars: [
        { id: "max", val: 9, type: "int", color: "amber" },
        { id: "i", val: 3, type: "int", color: "sky", highlight: true }
    ],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: 3,
    championIdx: 2
  },
  {
    line: 12,
    phase: "10. Condition Check",
    desc: "if (arr[3] > max) -> Is -2 greater than our current max (9)? Definitely not.",
    vars: [
        { id: "max", val: 9, type: "int", color: "amber" },
        { id: "i", val: 3, type: "int", color: "sky" }
    ],
    arr: [4, 1, 9, -2],
    evaluator: { left: "-2", op: ">", right: "9", res: "FALSE" },
    activeIdx: 3,
    championIdx: 2
  },
  {
    line: 9,
    phase: "11. Loop Exit",
    desc: "'i' becomes 4. The loop condition (i < arr.length) evaluates to 4 < 4, which is FALSE. The loop finishes!",
    vars: [
        { id: "max", val: 9, type: "int", color: "amber" },
        { id: "i", val: 4, type: "int", color: "sky", highlight: true }
    ],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: -1,
    championIdx: 2
  },
  {
    line: 18,
    phase: "12. Final Output",
    desc: "We successfully navigated the entire array, and our 'max' variable is holding the absolute largest value: 9.",
    vars: [
        { id: "max", val: 9, type: "int", color: "amber", highlight: true },
        { id: "i", val: 4, type: "int", color: "sky" }
    ],
    arr: [4, 1, 9, -2],
    evaluator: null,
    activeIdx: -1,
    championIdx: 2,
    console: "Max: 9\n"
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "sky" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-600',
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        rose: 'text-rose-600',
        indigo: 'text-indigo-600'
    };
    const activeColor = colorMap[color] || 'text-sky-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|for|if)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-sky-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (['for', 'if'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
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
                <Grid2x2 className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">1D Array Logic</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded tracking-widest uppercase border border-sky-100">Logic Building 103</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Loops & Indices</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="sky" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="indigo" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Common Patterns" color="amber" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" color="rose" />
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
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-sky-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">ArrayLogic.java</span>
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
                          <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200'}`}>
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
                    
                    <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Grid2x2 size={20} className="text-sky-500"/> Array & Memory State
                        </h3>
                    </div>

                    <div className="flex flex-col gap-6 flex-1 relative">
                        
                        {/* ARRAY VISUALIZER */}
                        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono mb-4 flex items-center gap-2">
                                <Box size={14}/> Contiguous Array (arr)
                            </span>
                            <div className="flex justify-center mt-4 mb-2">
                                {cur.arr.length > 0 ? (
                                    <div className="flex gap-2">
                                        {cur.arr.map((val, idx) => {
                                            const isActive = cur.activeIdx === idx;
                                            const isChampion = cur.championIdx === idx;
                                            const isHighlight = cur.highlightIdx === idx;

                                            let boxStyle = "bg-white border-slate-300 text-slate-700"; // default
                                            if (isActive && isHighlight) boxStyle = "bg-sky-500 border-sky-600 text-white shadow-lg shadow-sky-200 scale-110 z-10 ring-4 ring-sky-100";
                                            else if (isActive) boxStyle = "bg-sky-100 border-sky-400 text-sky-800 scale-105 z-10 shadow-md";
                                            else if (isChampion) boxStyle = "bg-amber-100 border-amber-400 text-amber-800 shadow-inner";

                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-2 relative">
                                                    {/* Pointer Indicator */}
                                                    <div className={`h-4 w-4 rounded-full transition-all duration-300 ${isActive ? 'bg-sky-500 animate-bounce' : 'bg-transparent'}`}></div>
                                                    
                                                    {/* The Array Cell */}
                                                    <div className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-mono font-black text-2xl transition-all duration-500 ${boxStyle}`}>
                                                        {val}
                                                    </div>
                                                    
                                                    {/* Index Label */}
                                                    <span className={`text-[10px] font-mono font-bold transition-colors ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                                                        [{idx}]
                                                    </span>

                                                    {/* Champion Crown Icon */}
                                                    {isChampion && (
                                                        <div className="absolute top-2 -right-2 text-amber-500 drop-shadow-md">
                                                            <Trophy size={16} className="fill-amber-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-24 w-full flex items-center justify-center text-slate-400 text-xs italic font-mono">Array not allocated yet...</div>
                                )}
                            </div>
                        </div>

                        {/* VARIABLES TRACKER */}
                        <div className="flex flex-wrap gap-4">
                            {cur.vars.map((v, idx) => {
                                const c = v.color;
                                return (
                                    <div key={idx} className={`flex-1 min-w-[140px] relative flex flex-col border rounded-2xl overflow-hidden shadow-sm transition-all duration-500 ${v.active ? 'scale-105 shadow-md z-10 ring-4' : ''} ${v.highlight ? `border-${c}-400 ring-4 ring-${c}-100 scale-105 shadow-md z-20` : 'border-slate-200 ring-transparent'}`}>
                                        <div className={`text-[10px] font-mono font-black px-4 py-1.5 flex justify-between uppercase tracking-widest ${v.highlight ? `bg-${c}-100 text-${c}-800 border-b border-${c}-200` : 'bg-slate-100 text-slate-500 border-b border-slate-200'}`}>
                                            <span>{v.type}</span>
                                            <span>{v.id}</span>
                                        </div>
                                        <div className={`font-mono font-black text-center py-4 px-4 text-3xl flex items-center justify-center gap-1 bg-white transition-colors duration-500 text-${c}-600`}>
                                            {v.id === 'max' && <Trophy size={20} className="text-amber-400 mr-1"/>}
                                            {v.val}
                                        </div>
                                    </div>
                                )
                            })}
                            {cur.vars.length === 0 && (
                                <div className="w-full bg-slate-50 rounded-3xl border border-slate-200 p-6 flex items-center justify-center text-slate-400 font-mono text-sm italic">
                                    Awaiting variable initialization...
                                </div>
                            )}
                        </div>

                        {/* CONDITION EVALUATOR (ALU) */}
                        <div className={`flex-1 rounded-3xl border-2 shadow-sm relative overflow-hidden flex flex-col transition-all duration-500 bg-slate-900 border-slate-800`}>
                            <div className="border-b border-slate-700 bg-slate-800/80 p-3 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 text-slate-400">
                                    <Zap size={14}/> If Condition
                                </span>
                            </div>

                            <div className="p-4 flex flex-col items-center justify-center min-h-[120px] flex-1">
                                {cur.evaluator ? (
                                    <div className="flex items-center justify-center gap-4 w-full animate-in zoom-in-95 duration-300">
                                        <div className="bg-slate-800 border-2 border-slate-600 text-white font-mono font-black text-2xl px-6 py-3 rounded-2xl shadow-inner min-w-[80px] text-center">
                                            {cur.evaluator.left}
                                        </div>
                                        <span className="text-sky-400 font-black text-3xl font-mono mx-1">{cur.evaluator.op}</span>
                                        <div className="bg-slate-800 border-2 border-slate-600 text-amber-400 font-mono font-black text-2xl px-6 py-3 rounded-2xl shadow-inner min-w-[80px] text-center relative">
                                            {cur.evaluator.right}
                                        </div>
                                        <ArrowRight className="text-slate-500 mx-2" size={24}/>
                                        <div className={`font-mono font-black text-2xl px-6 py-3 rounded-2xl border-2 shadow-lg flex items-center justify-center min-w-[100px] ${cur.evaluator.res === 'TRUE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-rose-500/20 text-rose-400 border-rose-500'}`}>
                                            {cur.evaluator.res}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-600 gap-2 opacity-40">
                                        <Crosshair size={32} />
                                        <span className="font-mono text-sm uppercase tracking-widest font-bold">Waiting for comparison</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CONSOLE OUTPUT (IF ANY) */}
                        {cur.console !== undefined && (
                             <div className="bg-black rounded-2xl border border-slate-800 p-4 shadow-inner flex items-center gap-4 animate-in slide-in-from-bottom-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 font-mono bg-emerald-900/30 px-2 py-1 rounded">Output</span>
                                <span className="font-mono text-white text-lg font-bold">{cur.console || ">_"}</span>
                             </div>
                        )}

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
                  <Target className="text-indigo-500" size={32}/> King of the Hill
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-indigo-200 pl-6 mb-8">
                  Finding the maximum (or minimum) element in an array is the "Hello World" of Data Structures. The logic pattern is known informally as the <strong>King of the Hill</strong> algorithm.
                </p>

                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-xl">
                        <Trophy className="text-amber-500"/> The Logic
                    </h3>
                    <ul className="space-y-4 text-sm text-slate-700">
                        <li className="flex gap-4 items-start">
                            <span className="bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded">1</span>
                            <div>
                                <strong>Crown the First Element:</strong> Assume the first person you see is the tallest person in the room. Store them in a variable (e.g., <code>max = arr[0]</code>).
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded">2</span>
                            <div>
                                <strong>Walk the Room:</strong> Use a <code>for</code> loop to look at every other person in the room one by one.
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded">3</span>
                            <div>
                                <strong>Challenge the King:</strong> Ask, "Are you taller than my current King?" (<code>if (arr[i] &gt; max)</code>). If they are, they dethrone the old King and become the new <code>max</code>.
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mt-8">
                    <h4 className="font-black text-amber-900 mb-2 flex items-center gap-2 uppercase tracking-widest text-sm">
                        <AlertTriangle size={16}/> The Zero Trap
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                        A very common beginner mistake is writing <code>int max = 0;</code> before the loop. 
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed font-bold mt-2">
                        What if the array is <code>{`{ -5, -10, -2 }`}</code>? 
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                        If you start with <code>0</code>, the loop will run, see that none of those negative numbers are greater than 0, and the program will incorrectly say the max is 0 (which isn't even in the array!). Always initialize <code>max</code> to <code>arr[0]</code> or <code>Integer.MIN_VALUE</code>.
                    </p>
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
                <Box className="text-amber-500"/> Essential 1D Array Patterns
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-amber-200 pl-6">
                Most basic array interview questions can be solved by slightly modifying how your loop iterates over the indices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sum / Average */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-slate-800 text-lg mb-2">Sum / Average</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Keep a running total. Add every element to it.</p>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        int sum = 0;<br/>
                        for (int i = 0; i &lt; arr.length; i++) {'{'}<br/>
                        &nbsp;&nbsp;sum += arr[i];<br/>
                        {'}'}<br/>
                        double avg = (double)sum / arr.length;
                    </div>
                </div>

                {/* Finding an Element */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-slate-800 text-lg mb-2">Linear Search</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Look for a specific target. Return its index if found, or -1 if missing.</p>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        int target = 9;<br/>
                        for (int i = 0; i &lt; arr.length; i++) {'{'}<br/>
                        &nbsp;&nbsp;if (arr[i] == target) return i;<br/>
                        {'}'}<br/>
                        return -1;
                    </div>
                </div>

                {/* Reverse In Place */}
                <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:col-span-2">
                    <h3 className="font-black text-sky-400 text-lg mb-2 flex items-center gap-2"><Crosshair size={18}/> Two Pointers: Reverse Array</h3>
                    <p className="text-sm text-slate-300 mb-4">Instead of one pointer <code>i</code>, create a <code>left</code> pointer at the start and a <code>right</code> pointer at the end. Swap them, and walk them towards the middle!</p>
                    <div className="bg-black/50 p-4 rounded-xl border border-slate-700 font-mono text-xs text-emerald-300">
                        int left = 0;<br/>
                        int right = arr.length - 1;<br/>
                        <span className="text-pink-500">while</span> (left &lt; right) {'{'}<br/>
                        &nbsp;&nbsp;int temp = arr[left];<br/>
                        &nbsp;&nbsp;arr[left] = arr[right];<br/>
                        &nbsp;&nbsp;arr[right] = temp;<br/>
                        &nbsp;&nbsp;left++; right--;<br/>
                        {'}'}
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
                        <Trophy size={28} /> The OutOfBounds Crash
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            The most common reason code fails during a white-boarding interview is messing up the loop boundaries, resulting in an <code>ArrayIndexOutOfBoundsException</code>.
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-black/40 border border-rose-900/50 p-6 rounded-xl shadow-inner">
                                <h4 className="text-rose-400 font-black mb-2 text-lg flex items-center gap-2"><AlertTriangle size={18}/> The &lt;= Error</h4>
                                <div className="bg-slate-800 p-3 rounded font-mono text-xs text-slate-300 mb-3">
                                    for (int i = 0; <span className="text-rose-400 font-bold">i &lt;= arr.length</span>; i++)
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    If the array length is 4, valid indices are 0, 1, 2, 3. If you use <code>&lt;=</code>, the loop will run when <code>i</code> is exactly 4. It will ask for <code>arr[4]</code> and immediately crash the program.
                                </p>
                            </div>

                            <div className="bg-black/40 border border-amber-900/50 p-6 rounded-xl shadow-inner">
                                <h4 className="text-amber-400 font-black mb-2 text-lg flex items-center gap-2"><AlertTriangle size={18}/> The i+1 Peek Error</h4>
                                <div className="bg-slate-800 p-3 rounded font-mono text-xs text-slate-300 mb-3">
                                    for (int i = 0; i &lt; arr.length; i++) {'{'}<br/>
                                    &nbsp;&nbsp;if (arr[i] == <span className="text-amber-400 font-bold">arr[i+1]</span>) ...<br/>
                                    {'}'}
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    If you are writing logic that peeks ahead to the "next" element (like checking for duplicates), your loop must stop <strong>one element early</strong>.
                                </p>
                                <p className="text-sm text-emerald-400 mt-2">
                                    <strong>Fix:</strong> Change loop to <code>i &lt; arr.length - 1</code>. Otherwise, when <code>i</code> is at the very last element, <code>i+1</code> will fall off the cliff!
                                </p>
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
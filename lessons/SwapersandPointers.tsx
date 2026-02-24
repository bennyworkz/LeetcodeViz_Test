import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Play, Pause, RefreshCw, Grid2x2, Zap, AlertTriangle, 
  ArrowRightLeft, MoveHorizontal, CupSoda, SplitSquareHorizontal
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class ArraySwap {
    public static void main(String[] args) {
        int[] arr = { 10, 20, 30, 40 };
        
        // 1. Initialize Two Pointers
        int left = 0;
        int right = arr.length - 1;
        
        // 2. Loop until they meet
        while (left < right) {
            
            // 3. The 3-Step Swap
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            
            // 4. Move pointers inward
            left++;
            right--;
        }
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. Program Start",
    desc: "We are going to reverse an array completely 'in-place'. This means we won't create a second array; we will just swap the elements of the original one!",
    vars: [],
    arr: [10, 20, 30, 40],
    left: -1, right: -1, temp: null,
    highlightCell: null
  },
  {
    line: 6,
    phase: "2. Initialize Pointers",
    desc: "We create a 'left' pointer starting at index 0, and a 'right' pointer starting at the very last index (length - 1 = 3).",
    vars: [
        { id: "left", val: 0, color: "sky" },
        { id: "right", val: 3, color: "rose" }
    ],
    arr: [10, 20, 30, 40],
    left: 0, right: 3, temp: null,
    highlightCell: null
  },
  {
    line: 10,
    phase: "3. Loop Condition (Iter 1)",
    desc: "while (left < right) -> Is 0 < 3? YES. As long as the pointers haven't crossed each other in the middle, we keep swapping.",
    vars: [
        { id: "left", val: 0, color: "sky" },
        { id: "right", val: 3, color: "rose" }
    ],
    arr: [10, 20, 30, 40],
    left: 0, right: 3, temp: null,
    highlightCell: null
  },
  {
    line: 13,
    phase: "4. Swap Step 1 (Save to Temp)",
    desc: "int temp = arr[left]; Before we overwrite the left box, we MUST pour its contents (10) into a temporary holding glass.",
    vars: [
        { id: "left", val: 0, color: "sky" },
        { id: "right", val: 3, color: "rose" },
        { id: "temp", val: 10, color: "amber", active: true }
    ],
    arr: [10, 20, 30, 40],
    left: 0, right: 3, temp: 10,
    highlightCell: 0
  },
  {
    line: 14,
    phase: "5. Swap Step 2 (Overwrite Left)",
    desc: "arr[left] = arr[right]; Now that the 10 is safely saved, we can overwrite index 0 with the value from index 3 (40).",
    vars: [
        { id: "left", val: 0, color: "sky" },
        { id: "right", val: 3, color: "rose" },
        { id: "temp", val: 10, color: "amber" }
    ],
    arr: [40, 20, 30, 40],
    left: 0, right: 3, temp: 10,
    highlightCell: 0 // Left gets overwritten
  },
  {
    line: 15,
    phase: "6. Swap Step 3 (Restore from Temp)",
    desc: "arr[right] = temp; Finally, we pour the saved 10 from our temporary glass into index 3. The swap is complete!",
    vars: [
        { id: "left", val: 0, color: "sky" },
        { id: "right", val: 3, color: "rose" },
        { id: "temp", val: 10, color: "amber" }
    ],
    arr: [40, 20, 30, 10],
    left: 0, right: 3, temp: 10,
    highlightCell: 3 // Right gets overwritten
  },
  {
    line: 18,
    phase: "7. Move Pointers Inward",
    desc: "left++; right--; The outer edges are fully reversed. We shrink our 'window' by moving left to 1, and right to 2.",
    vars: [
        { id: "left", val: 1, color: "sky", active: true },
        { id: "right", val: 2, color: "rose", active: true }
    ],
    arr: [40, 20, 30, 10],
    left: 1, right: 2, temp: null,
    highlightCell: null
  },
  {
    line: 10,
    phase: "8. Loop Condition (Iter 2)",
    desc: "Is 1 < 2? YES. The pointers haven't crossed yet. We have more swapping to do in the middle.",
    vars: [
        { id: "left", val: 1, color: "sky" },
        { id: "right", val: 2, color: "rose" }
    ],
    arr: [40, 20, 30, 10],
    left: 1, right: 2, temp: null,
    highlightCell: null
  },
  {
    line: 13,
    phase: "9. Swap Step 1 (Save to Temp)",
    desc: "temp = arr[left]; Save the 20.",
    vars: [
        { id: "left", val: 1, color: "sky" },
        { id: "right", val: 2, color: "rose" },
        { id: "temp", val: 20, color: "amber", active: true }
    ],
    arr: [40, 20, 30, 10],
    left: 1, right: 2, temp: 20,
    highlightCell: 1
  },
  {
    line: 14,
    phase: "10. Swap Step 2 (Overwrite Left)",
    desc: "arr[left] = arr[right]; Overwrite index 1 with 30.",
    vars: [
        { id: "left", val: 1, color: "sky" },
        { id: "right", val: 2, color: "rose" },
        { id: "temp", val: 20, color: "amber" }
    ],
    arr: [40, 30, 30, 10],
    left: 1, right: 2, temp: 20,
    highlightCell: 1
  },
  {
    line: 15,
    phase: "11. Swap Step 3 (Restore from Temp)",
    desc: "arr[right] = temp; Pour the saved 20 into index 2.",
    vars: [
        { id: "left", val: 1, color: "sky" },
        { id: "right", val: 2, color: "rose" },
        { id: "temp", val: 20, color: "amber" }
    ],
    arr: [40, 30, 20, 10],
    left: 1, right: 2, temp: 20,
    highlightCell: 2
  },
  {
    line: 18,
    phase: "12. Move Pointers Inward",
    desc: "left++; right--; 'left' becomes 2, 'right' becomes 1. They have officially crossed paths!",
    vars: [
        { id: "left", val: 2, color: "sky", active: true },
        { id: "right", val: 1, color: "rose", active: true }
    ],
    arr: [40, 30, 20, 10],
    left: 2, right: 1, temp: null,
    highlightCell: null
  },
  {
    line: 10,
    phase: "13. Loop Exit",
    desc: "while (left < right) -> Is 2 < 1? NO. The condition is false. The loop terminates.",
    vars: [
        { id: "left", val: 2, color: "sky" },
        { id: "right", val: 1, color: "rose" }
    ],
    arr: [40, 30, 20, 10],
    left: 2, right: 1, temp: null,
    highlightCell: null
  },
  {
    line: 21,
    phase: "14. Array Completely Reversed",
    desc: "The program finishes. We perfectly reversed the array in-place, using only one tiny 'temp' box for memory!",
    vars: [],
    arr: [40, 30, 20, 10],
    left: -1, right: -1, temp: null,
    highlightCell: null
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "indigo" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        indigo: 'text-indigo-600',
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        rose: 'text-rose-600',
        emerald: 'text-emerald-600'
    };
    const activeColor = colorMap[color] || 'text-indigo-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|while)\b|\[|\]|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-indigo-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (['while'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (part === '[' || part === ']') return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
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
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center relative overflow-hidden group">
                <ArrowRightLeft className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Swapping & Pointers</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase border border-indigo-100">Logic Building 104</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">In-Place Mutability</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="indigo" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="sky" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Two Pointers" color="amber" />
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
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-800 relative">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-indigo-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">ArraySwap.java</span>
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
                        <Activity size={16} className="text-indigo-500"/>
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
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <MoveHorizontal size={20} className="text-indigo-500"/> Two-Pointer Arena
                        </h3>
                    </div>

                    <div className="flex flex-col gap-8 flex-1 relative">
                        
                        {/* ARRAY VISUALIZER */}
                        <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-8 shadow-sm">
                            
                            {/* Top Pointers (Left) */}
                            <div className="flex justify-center mb-2 h-10 relative">
                                {cur.left >= 0 && (
                                    <div className="absolute transition-all duration-700 ease-in-out flex flex-col items-center" style={{ left: `calc(50% - 150px + ${cur.left * 72}px)` }}>
                                        <div className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-[10px] font-black tracking-widest border border-sky-300 shadow-sm mb-1 uppercase">Left</div>
                                        <ArrowRight className="text-sky-500 rotate-90" size={16}/>
                                    </div>
                                )}
                            </div>

                            {/* The Array */}
                            <div className="flex justify-center gap-4">
                                {cur.arr.map((val, idx) => {
                                    const isLeft = cur.left === idx;
                                    const isRight = cur.right === idx;
                                    const isHighlight = cur.highlightCell === idx;

                                    let boxStyle = "bg-white border-slate-300 text-slate-700"; 
                                    if (isHighlight && isLeft) boxStyle = "bg-sky-500 border-sky-600 text-white shadow-lg scale-110 z-10 ring-4 ring-sky-100";
                                    else if (isHighlight && isRight) boxStyle = "bg-rose-500 border-rose-600 text-white shadow-lg scale-110 z-10 ring-4 ring-rose-100";
                                    else if (isLeft) boxStyle = "bg-sky-50 border-sky-400 text-sky-800 shadow-inner";
                                    else if (isRight) boxStyle = "bg-rose-50 border-rose-400 text-rose-800 shadow-inner";

                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <div className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-mono font-black text-2xl transition-all duration-500 ${boxStyle}`}>
                                                {val}
                                            </div>
                                            <span className={`text-[10px] font-mono font-bold mt-2 ${isLeft ? 'text-sky-500' : isRight ? 'text-rose-500' : 'text-slate-400'}`}>
                                                [{idx}]
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Bottom Pointers (Right) */}
                            <div className="flex justify-center mt-2 h-10 relative">
                                {cur.right >= 0 && (
                                    <div className="absolute transition-all duration-700 ease-in-out flex flex-col items-center" style={{ left: `calc(50% - 150px + ${cur.right * 72}px)` }}>
                                        <ArrowRight className="text-rose-500 -rotate-90 mb-1" size={16}/>
                                        <div className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-black tracking-widest border border-rose-300 shadow-sm uppercase">Right</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TEMP VARIABLE HOLDING AREA */}
                        <div className="flex justify-center flex-1">
                            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl flex flex-col items-center justify-center min-w-[250px] relative overflow-hidden">
                                <div className="absolute top-4 left-4 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
                                    <Layers size={14}/> Stack Memory
                                </div>

                                <div className="flex flex-col items-center gap-4 mt-4">
                                    <span className="text-amber-500 font-mono font-black text-sm tracking-widest">temp</span>
                                    
                                    <div className={`w-20 h-20 rounded-2xl border-4 flex items-center justify-center font-mono font-black text-3xl transition-all duration-500 ${cur.temp !== null ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-110' : 'bg-slate-800 border-slate-700 text-slate-600 border-dashed'}`}>
                                        {cur.temp !== null ? cur.temp : "-"}
                                    </div>
                                    
                                    <div className="text-xs text-slate-400 font-mono italic mt-2">
                                        {cur.temp !== null ? 'Holding saved value...' : 'Empty glass'}
                                    </div>
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
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px]">
            <div className="max-w-4xl space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                  <ArrowRightLeft className="text-indigo-500" size={32}/> The 3-Step Swap
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-indigo-200 pl-6 mb-8">
                  One of the most common mistakes beginners make is trying to swap two variables directly: <code>a = b; b = a;</code>. This <strong>destroys</strong> the data!
                </p>

                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl mb-8">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-xl">
                        <CupSoda className="text-sky-500"/> The Glass of Water Analogy
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Imagine Glass A is full of Orange Juice, and Glass B is full of Milk. You want to swap the liquids. If you pour Glass B into Glass A, you get a ruined mixture, and the Orange Juice is gone! You <strong>must</strong> use a 3rd, empty glass (Temp).
                    </p>
                    
                    <ul className="space-y-4 text-sm text-slate-700">
                        <li className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <span className="bg-amber-100 text-amber-700 font-black px-2.5 py-1 rounded">1</span>
                            <div>
                                <strong>Save to Temp:</strong> Pour Glass A (Orange Juice) into the Temp Glass.<br/>
                                <code className="text-sky-600">int temp = a;</code>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <span className="bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded">2</span>
                            <div>
                                <strong>Overwrite A:</strong> Glass A is now empty. Pour Glass B (Milk) into Glass A.<br/>
                                <code className="text-rose-600">a = b;</code>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <span className="bg-emerald-100 text-emerald-700 font-black px-2.5 py-1 rounded">3</span>
                            <div>
                                <strong>Restore B:</strong> Pour the Temp Glass (Orange Juice) into Glass B.<br/>
                                <code className="text-emerald-600">b = temp;</code>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl">
                    <h4 className="font-black text-rose-900 mb-2 flex items-center gap-2 uppercase tracking-widest text-sm">
                        <AlertTriangle size={16}/> The Array Wipeout
                    </h4>
                    <p className="text-sm text-rose-800 leading-relaxed">
                        If you write <code>arr[left] = arr[right];</code> without using a temp variable first, the value originally sitting at <code>arr[left]</code> is instantly erased from memory. You can never get it back to put it into <code>arr[right]</code>.
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
                <SplitSquareHorizontal className="text-sky-500"/> The Two-Pointer Pattern
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-200 pl-6">
                Reversing an array introduces you to the <strong>Two-Pointer Technique</strong>. This is one of the top 5 most important algorithmic patterns you will ever learn for technical interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-black text-slate-800 text-lg mb-2">Why not just use a 'for' loop?</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        You <em>could</em> reverse an array with a normal <code>for</code> loop, but it's very easy to mess up the math: <code>arr[i] = arr[arr.length - 1 - i]</code>. It's confusing to read and prone to "off-by-one" errors.
                    </p>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        Using explicit <code>left</code> and <code>right</code> variables inside a <code>while(left &lt; right)</code> loop is drastically easier for human brains to visualize. You are physically creating a "window" that shrinks towards the middle.
                    </p>
                </div>

                <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                    <h3 className="font-black text-sky-400 text-lg mb-4 flex items-center gap-2">Other Two-Pointer Applications</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-amber-400 mb-1">1. Palindrome Checking</h4>
                            <p className="text-sm text-slate-300">Start left at 0, right at end. Compare <code>arr[left] == arr[right]</code>. If they ever don't match, it's not a palindrome! Shrink inward.</p>
                        </div>
                        <div className="border-t border-slate-700 pt-4">
                            <h4 className="font-bold text-rose-400 mb-1">2. Two Sum (Sorted Array)</h4>
                            <p className="text-sm text-slate-300">Need to find two numbers that add up to a target? Start left and right. If the sum is too big, move <code>right--</code> to get a smaller number. If the sum is too small, move <code>left++</code>.</p>
                        </div>
                        <div className="border-t border-slate-700 pt-4">
                            <h4 className="font-bold text-emerald-400 mb-1">3. Partitioning (Dutch National Flag)</h4>
                            <p className="text-sm text-slate-300">Moving all 0s to the left and all 1s to the right. Left pointer finds 1s, right pointer finds 0s, and they swap!</p>
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
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-rose-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> The "No Temp Variable" Swap
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Asks:</span>
                            "Can you swap two integer variables without using a 3rd temporary variable?"
                        </div>
                        <div className="border-l-4 border-rose-500 pl-6 space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Yes. This is a classic trick question to test your knowledge of math or bitwise operations. There are two ways to do it.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <span className="text-amber-400 font-bold block mb-2">Math (Addition/Subtraction)</span>
                                    <code className="text-xs text-sky-300">
                                        a = a + b; <span className="text-slate-500">// a holds both</span><br/>
                                        b = a - b; <span className="text-slate-500">// b becomes original a</span><br/>
                                        a = a - b; <span className="text-slate-500">// a becomes original b</span>
                                    </code>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <span className="text-fuchsia-400 font-bold block mb-2">Bitwise XOR (^)</span>
                                    <code className="text-xs text-emerald-300">
                                        a = a ^ b;<br/>
                                        b = a ^ b;<br/>
                                        a = a ^ b;
                                    </code>
                                </div>
                            </div>
                            
                            <p className="text-xs text-amber-300 bg-amber-900/30 p-2 rounded mt-2">
                                <strong>Warning:</strong> The interviewer knows this is a party trick. In production code, ALWAYS use a temp variable. The Math trick can cause Integer Overflow, and the XOR trick is unreadable to humans.
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
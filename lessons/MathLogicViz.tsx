import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Play, Pause, RefreshCw, Hash, Calculator, RotateCcw,
  Zap, Box, SplitSquareHorizontal, AlertTriangle
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class MathLogic {
    public static void main(String[] args) {
        int num = 123;
        int reversed = 0;

        while (num > 0) {
            // 1. Extract the last digit
            int digit = num % 10;
            
            // 2. Append to the reversed number
            reversed = (reversed * 10) + digit;
            
            // 3. Chop off the last digit
            num = num / 10; 
        }
        
        System.out.println(reversed);
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. Program Start",
    desc: "We are going to reverse the number 123 mathematically. No Strings allowed!",
    vars: [],
    math: null
  },
  {
    line: 3,
    phase: "2. Initialization",
    desc: "int num = 123; int reversed = 0; We set up our starting number and a blank slate for our result.",
    vars: [
        { id: "num", val: 123, type: "int", color: "sky", active: true },
        { id: "reversed", val: 0, type: "int", color: "emerald", active: true }
    ],
    math: null
  },
  {
    line: 6,
    phase: "3. Loop Condition (Iter 1)",
    desc: "while (num > 0) -> Is 123 > 0? Yes. We enter the loop to process the first digit.",
    vars: [
        { id: "num", val: 123, type: "int", color: "sky" },
        { id: "reversed", val: 0, type: "int", color: "emerald" }
    ],
    math: { title: "Condition Check", op: "123 > 0", res: "TRUE", type: "check" }
  },
  {
    line: 8,
    phase: "4. Extract Digit (Modulo)",
    desc: "int digit = num % 10; Modulo 10 gives us the REMAINDER of dividing by 10. This perfectly isolates the last digit (3).",
    vars: [
        { id: "num", val: 123, type: "int", color: "sky" },
        { id: "reversed", val: 0, type: "int", color: "emerald" },
        { id: "digit", val: 3, type: "int", color: "amber", highlight: true }
    ],
    math: { title: "Modulo Extraction", op: "123 % 10", res: "3", type: "extract" }
  },
  {
    line: 11,
    phase: "5. Append Digit",
    desc: "reversed = (reversed * 10) + digit; Multiply by 10 to 'shift' existing digits left, making room to add the 3.",
    vars: [
        { id: "num", val: 123, type: "int", color: "sky" },
        { id: "reversed", val: 3, type: "int", color: "emerald", highlight: true },
        { id: "digit", val: 3, type: "int", color: "amber" }
    ],
    math: { title: "Shift & Append", op: "(0 * 10) + 3", res: "3", type: "append" }
  },
  {
    line: 14,
    phase: "6. Chop Digit (Division)",
    desc: "num = num / 10; Integer division truncates the decimal. 123 / 10 is 12.3, which becomes just 12! The 3 is permanently destroyed from 'num'.",
    vars: [
        { id: "num", val: 12, type: "int", color: "sky", highlight: true },
        { id: "reversed", val: 3, type: "int", color: "emerald" },
        { id: "digit", val: 3, type: "int", color: "amber" }
    ],
    math: { title: "Integer Division", op: "123 / 10", res: "12", type: "chop" }
  },
  {
    line: 6,
    phase: "7. Loop Condition (Iter 2)",
    desc: "The block ends. Jump to top. Is 12 > 0? Yes. Process next digit.",
    vars: [
        { id: "num", val: 12, type: "int", color: "sky" },
        { id: "reversed", val: 3, type: "int", color: "emerald" }
    ],
    math: { title: "Condition Check", op: "12 > 0", res: "TRUE", type: "check" }
  },
  {
    line: 8,
    phase: "8. Extract Digit 2",
    desc: "digit = num % 10; 12 % 10 gives us 2.",
    vars: [
        { id: "num", val: 12, type: "int", color: "sky" },
        { id: "reversed", val: 3, type: "int", color: "emerald" },
        { id: "digit", val: 2, type: "int", color: "amber", highlight: true }
    ],
    math: { title: "Modulo Extraction", op: "12 % 10", res: "2", type: "extract" }
  },
  {
    line: 11,
    phase: "9. Append Digit 2",
    desc: "reversed = (reversed * 10) + digit; We shift the 3 to the left (becomes 30), then add the 2. Result: 32.",
    vars: [
        { id: "num", val: 12, type: "int", color: "sky" },
        { id: "reversed", val: 32, type: "int", color: "emerald", highlight: true },
        { id: "digit", val: 2, type: "int", color: "amber" }
    ],
    math: { title: "Shift & Append", op: "(3 * 10) + 2", res: "32", type: "append" }
  },
  {
    line: 14,
    phase: "10. Chop Digit 2",
    desc: "num = 12 / 10; Truncates to 1.",
    vars: [
        { id: "num", val: 1, type: "int", color: "sky", highlight: true },
        { id: "reversed", val: 32, type: "int", color: "emerald" },
        { id: "digit", val: 2, type: "int", color: "amber" }
    ],
    math: { title: "Integer Division", op: "12 / 10", res: "1", type: "chop" }
  },
  {
    line: 6,
    phase: "11. Loop Condition (Iter 3)",
    desc: "Is 1 > 0? Yes. Time for the final digit.",
    vars: [
        { id: "num", val: 1, type: "int", color: "sky" },
        { id: "reversed", val: 32, type: "int", color: "emerald" }
    ],
    math: { title: "Condition Check", op: "1 > 0", res: "TRUE", type: "check" }
  },
  {
    line: 8,
    phase: "12. Extract Final Digit",
    desc: "1 % 10 is 1. (1 goes into 10 zero times, with a remainder of 1).",
    vars: [
        { id: "num", val: 1, type: "int", color: "sky" },
        { id: "reversed", val: 32, type: "int", color: "emerald" },
        { id: "digit", val: 1, type: "int", color: "amber", highlight: true }
    ],
    math: { title: "Modulo Extraction", op: "1 % 10", res: "1", type: "extract" }
  },
  {
    line: 11,
    phase: "13. Append Final Digit",
    desc: "Shift 32 left to become 320, add 1. Result: 321. The number is reversed!",
    vars: [
        { id: "num", val: 1, type: "int", color: "sky" },
        { id: "reversed", val: 321, type: "int", color: "emerald", highlight: true },
        { id: "digit", val: 1, type: "int", color: "amber" }
    ],
    math: { title: "Shift & Append", op: "(32 * 10) + 1", res: "321", type: "append" }
  },
  {
    line: 14,
    phase: "14. Final Chop",
    desc: "1 / 10; Since it's integer division, 0.1 is truncated to 0! 'num' is finally dead.",
    vars: [
        { id: "num", val: 0, type: "int", color: "sky", highlight: true },
        { id: "reversed", val: 321, type: "int", color: "emerald" },
        { id: "digit", val: 1, type: "int", color: "amber" }
    ],
    math: { title: "Integer Division", op: "1 / 10", res: "0", type: "chop" }
  },
  {
    line: 6,
    phase: "15. Loop Exit",
    desc: "while (0 > 0) -> FALSE. The loop terminates.",
    vars: [
        { id: "num", val: 0, type: "int", color: "sky" },
        { id: "reversed", val: 321, type: "int", color: "emerald" }
    ],
    math: { title: "Condition Check", op: "0 > 0", res: "FALSE", type: "check" }
  },
  {
    line: 17,
    phase: "16. Print Result",
    desc: "Program finishes and prints our successfully reversed number!",
    vars: [
        { id: "num", val: 0, type: "int", color: "sky" },
        { id: "reversed", val: 321, type: "int", color: "emerald" }
    ],
    math: null,
    console: "321\n"
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "emerald" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-600',
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        rose: 'text-rose-600'
    };
    const activeColor = colorMap[color] || 'text-emerald-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\b(?:public|static|class|void|int|while)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-emerald-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-emerald-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (['public', 'static', 'class', 'void'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'while') return <span key={i} className="text-amber-400 font-bold">{part}</span>;
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
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center relative overflow-hidden group">
                <Hash className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Math Logic & Digits</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase border border-emerald-100">Logic Building 102</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Modulo & Div</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="emerald" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="sky" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Tricks" color="amber" />
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
                      <Code2 size={16} className="text-emerald-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">MathLogic.java</span>
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
                        <Activity size={16} className="text-emerald-500"/>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-emerald-300">
                      {cur.desc}
                  </p>

                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {STEPS.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <Calculator size={20} className="text-emerald-500"/> Math Operations & State
                        </h3>
                    </div>

                    <div className="flex flex-col gap-8 flex-1 relative">
                        
                        {/* VARIABLES TRACKER */}
                        <div className="flex flex-wrap gap-4">
                            {cur.vars.map((v, idx) => {
                                const c = v.color;
                                return (
                                    <div key={idx} className={`flex-1 min-w-[140px] relative flex flex-col border rounded-3xl overflow-hidden shadow-sm transition-all duration-500 ${v.active ? 'scale-105 shadow-md z-10 ring-4' : ''} ${v.highlight ? `border-${c}-400 ring-4 ring-${c}-100 scale-105 shadow-md z-20` : 'border-slate-200 ring-transparent'}`}>
                                        <div className={`text-[10px] font-mono font-black px-4 py-2 flex justify-between uppercase tracking-widest ${v.highlight ? `bg-${c}-100 text-${c}-800 border-b border-${c}-200` : 'bg-slate-100 text-slate-500 border-b border-slate-200'}`}>
                                            <span>{v.id}</span>
                                        </div>
                                        <div className={`font-mono font-black text-center py-6 px-4 text-4xl flex items-center justify-center gap-1 bg-white transition-colors duration-500 text-${c}-600`}>
                                            {v.val}
                                        </div>
                                    </div>
                                )
                            })}
                            {cur.vars.length === 0 && (
                                <div className="w-full bg-slate-50 rounded-3xl border border-slate-200 p-8 flex items-center justify-center text-slate-400 font-mono text-sm italic">
                                    Awaiting variable initialization...
                                </div>
                            )}
                        </div>

                        {/* MATH OPERATION VISUALIZER */}
                        <div className={`flex-1 rounded-3xl border-2 shadow-xl relative overflow-hidden flex flex-col transition-all duration-500 bg-slate-900 border-slate-800`}>
                            <div className="border-b border-slate-700 bg-slate-800/80 p-3 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 text-slate-400">
                                    <Zap size={14}/> ALU Operation Focus
                                </span>
                                {cur.math && <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${cur.math.type === 'extract' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : cur.math.type === 'chop' ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : cur.math.type === 'append' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>{cur.math.title}</span>}
                            </div>

                            <div className="p-6 flex flex-col items-center justify-center min-h-[160px] flex-1">
                                {cur.math ? (
                                    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300 w-full">
                                        
                                        <div className="flex items-center justify-center gap-4 w-full">
                                            <div className="bg-slate-800 border-2 border-slate-600 text-white font-mono font-black text-3xl px-8 py-5 rounded-2xl shadow-inner min-w-[120px] text-center">
                                                {cur.math.op}
                                            </div>
                                            <ArrowRight className="text-slate-500" size={32}/>
                                            <div className={`font-mono font-black text-4xl px-8 py-5 rounded-2xl border-2 shadow-[0_0_30px_rgba(0,0,0,0.4)] flex items-center justify-center min-w-[100px] ${cur.math.type === 'extract' ? 'bg-amber-500/10 text-amber-400 border-amber-500' : cur.math.type === 'chop' ? 'bg-sky-500/10 text-sky-400 border-sky-500' : cur.math.type === 'append' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500' : cur.math.res === 'TRUE' ? 'bg-emerald-500 text-white border-emerald-400' : cur.math.res === 'FALSE' ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-800 text-white border-slate-600'}`}>
                                                {cur.math.res}
                                            </div>
                                        </div>
                                        
                                        {/* Visual helper for chop/extract */}
                                        {cur.math.type === 'extract' && (
                                            <div className="text-amber-400/80 font-mono text-sm mt-2 flex items-center gap-2">
                                                <SplitSquareHorizontal size={16}/> Getting the remainder isolated the last digit
                                            </div>
                                        )}
                                        {cur.math.type === 'chop' && (
                                            <div className="text-sky-400/80 font-mono text-sm mt-2 flex items-center gap-2">
                                                <SplitSquareHorizontal size={16}/> Integer division dropped the decimal
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-600 gap-3 opacity-30">
                                        <Calculator size={48} />
                                        <span className="font-mono text-sm uppercase tracking-widest font-bold">Waiting for Math</span>
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
                  <Hash className="text-sky-500" size={32}/> The % 10 and / 10 Trick
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-sky-200 pl-6 mb-8">
                  Almost every numerical algorithmic problem (Palindromes, Armstrong numbers, Sum of Digits) requires you to process a number digit by digit. Since integers aren't arrays, you can't just say <code>num[2]</code>. You must use math.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-amber-50 border border-amber-200 p-6 md:p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 rotate-12"><Calculator size={100}/></div>
                        <h3 className="font-black text-amber-900 mb-2 flex items-center gap-2 text-xl">1. Extract ( % 10 )</h3>
                        <p className="text-sm text-amber-800 mb-4 leading-relaxed relative z-10">
                            The Modulo operator (<code>%</code>) returns the remainder of a division. Dividing any base-10 number by 10 will always leave the final digit as the remainder!
                        </p>
                        <div className="bg-white border border-amber-200 p-4 rounded-xl font-mono text-sm text-amber-700 shadow-sm relative z-10">
                            123 % 10 = 3<br/>
                            4598 % 10 = 8<br/>
                            7 % 10 = 7
                        </div>
                    </div>

                    <div className="bg-sky-50 border border-sky-200 p-6 md:p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 rotate-12"><Calculator size={100}/></div>
                        <h3 className="font-black text-sky-900 mb-2 flex items-center gap-2 text-xl">2. Chop ( / 10 )</h3>
                        <p className="text-sm text-sky-800 mb-4 leading-relaxed relative z-10">
                            In Java, dividing an <code>int</code> by an <code>int</code> chops off the decimal completely (it truncates). Dividing by 10 shifts the decimal point one spot left, which essentially deletes the last digit.
                        </p>
                        <div className="bg-white border border-sky-200 p-4 rounded-xl font-mono text-sm text-sky-700 shadow-sm relative z-10">
                            123 / 10 = 12<br/>
                            4598 / 10 = 459<br/>
                            7 / 10 = 0
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl mt-8">
                    <h3 className="font-black text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                        <RotateCcw size={16}/> The Golden While Loop
                    </h3>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                        If you combine Extract and Chop inside a <code>while (num &gt; 0)</code> loop, you will systematically process and destroy the number from right to left until there is nothing left. Memorize this template!
                    </p>
                    <div className="bg-black/50 p-4 rounded-xl border border-slate-700 font-mono text-sm text-sky-300">
                        <span className="text-pink-500">while</span> (n &gt; 0) {'{'}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">int</span> digit = n % 10; <span className="text-slate-500 italic">// Get last</span><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500 italic">// ... do something with digit ...</span><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;n = n / 10; <span className="text-slate-500 italic">// Remove last</span><br/>
                        {'}'}
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
                <Box className="text-amber-500"/> Other Classic Math Problems
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-amber-200 pl-6">
                Now that you know how to extract digits, you can easily solve half a dozen common interview questions just by slightly altering what you do inside the <code>while</code> loop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sum of Digits */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-slate-800 text-lg mb-2">Sum of Digits</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Given 123, return 1+2+3 = 6.</p>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        int sum = 0;<br/>
                        while (n &gt; 0) {'{'}<br/>
                        &nbsp;&nbsp;sum = sum + (n % 10);<br/>
                        &nbsp;&nbsp;n = n / 10;<br/>
                        {'}'}<br/>
                        return sum;
                    </div>
                </div>

                {/* Palindrome */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-black text-slate-800 text-lg mb-2">Palindrome Number</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Does the number read the same backwards? (e.g. 121 -&gt; false, 1221 -&gt; true).</p>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        int orig = n;<br/>
                        int rev = reverseNumber(n); <span className="text-slate-400 italic">// From simulator</span><br/>
                        return orig == rev;
                    </div>
                </div>

                {/* Armstrong */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:col-span-2">
                    <h3 className="font-black text-slate-800 text-lg mb-2">Armstrong Number</h3>
                    <p className="text-sm text-slate-600 mb-4">A number that is equal to the sum of cubes of its digits. (e.g., 153 = 1³ + 5³ + 3³).</p>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                        int sum = 0, orig = n;<br/>
                        while (n &gt; 0) {'{'}<br/>
                        &nbsp;&nbsp;int d = n % 10;<br/>
                        &nbsp;&nbsp;sum = sum + (d * d * d);<br/>
                        &nbsp;&nbsp;n = n / 10;<br/>
                        {'}'}<br/>
                        return sum == orig;
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
                        <Trophy size={28} /> Edge Cases & Traps
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            If you solve a math algorithmic problem perfectly, the interviewer will immediately ask you about edge cases. If you haven't considered these, you will fail the interview.
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-black/40 border border-slate-700 p-6 rounded-xl shadow-inner">
                                <h4 className="text-rose-400 font-black mb-2 text-lg flex items-center gap-2"><AlertTriangle size={18}/> Negative Numbers</h4>
                                <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                    What happens if the input is <code>-123</code>? Our <code>while (num &gt; 0)</code> loop will instantly evaluate to false, and the code will return 0.
                                </p>
                                <p className="text-sm text-emerald-400 bg-emerald-900/20 p-3 rounded border border-emerald-900">
                                    <strong>Fix:</strong> Change the loop to <code>while (num != 0)</code>. Modulo works on negatives in Java! <code>-123 % 10</code> correctly gives <code>-3</code>.
                                </p>
                            </div>

                            <div className="bg-black/40 border border-slate-700 p-6 rounded-xl shadow-inner">
                                <h4 className="text-amber-400 font-black mb-2 text-lg flex items-center gap-2"><Zap size={18}/> Integer Overflow</h4>
                                <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                    A 32-bit Integer in Java has a maximum limit of <code>2,147,483,647</code>. What if they ask you to reverse the number <code>2,147,483,649</code>? When you shift left and add the 9, the number will exceed the maximum size and "overflow" into negative garbage numbers!
                                </p>
                                <p className="text-sm text-emerald-400 bg-emerald-900/20 p-3 rounded border border-emerald-900">
                                    <strong>Fix:</strong> Store your <code>reversed</code> variable as a <code>long</code> (64-bit) instead of an <code>int</code> while you are building it. After the loop, check if it exceeds <code>Integer.MAX_VALUE</code> before casting it back to an int.
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
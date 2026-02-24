import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Terminal, Play, Pause, RefreshCw, Repeat, Hash, 
  Cpu, LayoutGrid, Lightbulb
} from 'lucide-react';

// --- DATA & CONSTANTS ---

const CODE_STRING = `public class Pattern {
    public static void main(String[] args) {
        int n = 3; 

        // Outer loop controls the ROWS (i)
        for (int i = 1; i <= n; i++) {
            
            // Inner loop controls the COLUMNS (j)
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            
            // Move to the next line after each row
            System.out.println(); 
        }
    }
}`;

const STEPS = [
  {
    line: 0,
    phase: "1. Program Start",
    desc: "We want to print a right-angled triangle. We initialize n = 3 (we want 3 rows).",
    vars: { n: 3, i: "-", j: "-" },
    console: "",
    grid: [[], [], []]
  },
  {
    line: 6,
    phase: "2. Outer Loop: Row 1",
    desc: "Outer loop starts. 'i' acts as our ROW COUNTER. i = 1. Is 1 <= 3? Yes. We enter the row.",
    vars: { n: 3, i: 1, j: "-" },
    console: "",
    grid: [[], [], []],
    activeRow: 0
  },
  {
    line: 9,
    phase: "3. Inner Loop: Col 1",
    desc: "Inner loop starts. 'j' acts as our COLUMN COUNTER. j = 1. The condition is (j <= i), so (1 <= 1). Yes!",
    vars: { n: 3, i: 1, j: 1 },
    console: "",
    grid: [[], [], []],
    activeRow: 0, activeCol: 0
  },
  {
    line: 10,
    phase: "4. Print Star",
    desc: "System.out.print(\"* \"); Notice it is 'print', NOT 'println'. It prints on the current line and stays there.",
    vars: { n: 3, i: 1, j: 1 },
    console: "* ",
    grid: [["*"], [], []],
    activeRow: 0, activeCol: 0
  },
  {
    line: 9,
    phase: "5. Inner Loop Ends",
    desc: "j increments to 2. Condition (j <= i) becomes (2 <= 1). This is FALSE. The inner loop terminates.",
    vars: { n: 3, i: 1, j: 2 },
    console: "* ",
    grid: [["*"], [], []],
    activeRow: 0
  },
  {
    line: 14,
    phase: "6. Line Break",
    desc: "System.out.println(); We finished row 1. This prints an invisible newline character, moving the cursor to row 2.",
    vars: { n: 3, i: 1, j: "-" },
    console: "* \n",
    grid: [["*"], [], []],
    activeRow: 0
  },
  {
    line: 6,
    phase: "7. Outer Loop: Row 2",
    desc: "i increments to 2. Is 2 <= 3? Yes. We start processing the second row.",
    vars: { n: 3, i: 2, j: "-" },
    console: "* \n",
    grid: [["*"], [], []],
    activeRow: 1
  },
  {
    line: 9,
    phase: "8. Inner Loop: Reset",
    desc: "CRITICAL: A brand new inner loop begins! 'j' is re-initialized back to 1. Condition (1 <= 2). Yes.",
    vars: { n: 3, i: 2, j: 1 },
    console: "* \n",
    grid: [["*"], [], []],
    activeRow: 1, activeCol: 0
  },
  {
    line: 10,
    phase: "9. Print Star",
    desc: "Prints the first star of the second row.",
    vars: { n: 3, i: 2, j: 1 },
    console: "* \n* ",
    grid: [["*"], ["*"], []],
    activeRow: 1, activeCol: 0
  },
  {
    line: 9,
    phase: "10. Inner Loop: Col 2",
    desc: "j increments to 2. Condition (2 <= 2). Yes! We stay on the same row.",
    vars: { n: 3, i: 2, j: 2 },
    console: "* \n* ",
    grid: [["*"], ["*"], []],
    activeRow: 1, activeCol: 1
  },
  {
    line: 10,
    phase: "11. Print Star",
    desc: "Prints the second star on row 2.",
    vars: { n: 3, i: 2, j: 2 },
    console: "* \n* * ",
    grid: [["*"], ["*", "*"], []],
    activeRow: 1, activeCol: 1
  },
  {
    line: 9,
    phase: "12. Inner Loop Ends",
    desc: "j increments to 3. Condition (3 <= 2) is FALSE. Inner loop is done.",
    vars: { n: 3, i: 2, j: 3 },
    console: "* \n* * ",
    grid: [["*"], ["*", "*"], []],
    activeRow: 1
  },
  {
    line: 14,
    phase: "13. Line Break",
    desc: "Row 2 is complete. Move cursor down.",
    vars: { n: 3, i: 2, j: "-" },
    console: "* \n* * \n",
    grid: [["*"], ["*", "*"], []],
    activeRow: 1
  },
  {
    line: 6,
    phase: "14. Outer Loop: Row 3",
    desc: "i increments to 3. The final row!",
    vars: { n: 3, i: 3, j: "-" },
    console: "* \n* * \n",
    grid: [["*"], ["*", "*"], []],
    activeRow: 2
  },
  {
    line: 10,
    phase: "15. Fast Forward: Row 3",
    desc: "The inner loop will run exactly 3 times (j=1, j=2, j=3), printing 3 stars.",
    vars: { n: 3, i: 3, j: 3 },
    console: "* \n* * \n* * * ",
    grid: [["*"], ["*", "*"], ["*", "*", "*"]],
    activeRow: 2
  },
  {
    line: 14,
    phase: "16. Final Line Break",
    desc: "Move cursor down after the last row.",
    vars: { n: 3, i: 3, j: "-" },
    console: "* \n* * \n* * * \n",
    grid: [["*"], ["*", "*"], ["*", "*", "*"]],
    activeRow: 2
  },
  {
    line: 6,
    phase: "17. Program Complete",
    desc: "i increments to 4. Is (4 <= 3)? FALSE. The outer loop finishes. The pattern is complete!",
    vars: { n: 3, i: 4, j: "-" },
    console: "* \n* * \n* * * \n",
    grid: [["*"], ["*", "*"], ["*", "*", "*"]]
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, color = "indigo" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        indigo: 'text-indigo-600',
        amber: 'text-amber-600',
        sky: 'text-sky-600',
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|static|class|void|int|for)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-indigo-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-xs transition-opacity duration-300 ${active ? 'opacity-100 text-slate-100' : 'opacity-70 text-slate-300'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-emerald-400">{part}</span>;
          if (['public', 'static', 'class', 'void', 'for'].includes(part)) return <span key={i} className="text-pink-500 font-bold">{part}</span>;
          if (part === 'int') return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'lesson' | 'logic' | 'math'>('simulator');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < STEPS.length - 1) {
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 3000); 
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
                <Repeat className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Nested Loops</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase border border-indigo-100">Logic Building 101</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Pattern Printing</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="indigo" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="sky" />
            <TabButton active={activeTab === 'logic'} onClick={() => setActiveTab('logic')} icon={<Lightbulb size={16}/>} label="How to Think" color="amber" />
            <TabButton active={activeTab === 'math'} onClick={() => setActiveTab('math')} icon={<Hash size={16}/>} label="Math Logic" color="emerald" />
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
                      <Code2 size={16} className="text-indigo-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">Pattern.java</span>
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
                    <button onClick={togglePlay} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}>
                      {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                    </button>
                    <button onClick={handleNext} disabled={currentStep === STEPS.length - 1} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                      Next <ChevronRight size={18}/>
                    </button>
                </div>
              </div>

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                {/* Visual Grid & Console Area */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <LayoutGrid size={20} className="text-indigo-500"/> Pattern Rendering
                        </h3>
                    </div>

                    <div className="flex flex-col gap-6 flex-1">
                        
                        {/* Variables Tracking */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col items-center justify-center transition-all duration-300">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Rows (n)</span>
                                <span className="font-mono text-2xl font-black text-slate-700">{cur.vars.n}</span>
                            </div>
                            <div className={`flex-1 rounded-2xl border p-4 shadow-sm flex flex-col items-center justify-center transition-all duration-300 ${cur.line === 6 ? 'bg-sky-50 border-sky-300 scale-105' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${cur.line === 6 ? 'text-sky-600' : 'text-slate-400'}`}>Outer Loop (i)</span>
                                <span className={`font-mono text-3xl font-black ${cur.line === 6 ? 'text-sky-700' : 'text-slate-700'}`}>{cur.vars.i}</span>
                            </div>
                            <div className={`flex-1 rounded-2xl border p-4 shadow-sm flex flex-col items-center justify-center transition-all duration-300 ${cur.line === 9 ? 'bg-amber-50 border-amber-300 scale-105' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${cur.line === 9 ? 'text-amber-600' : 'text-slate-400'}`}>Inner Loop (j)</span>
                                <span className={`font-mono text-3xl font-black ${cur.line === 9 ? 'text-amber-700' : 'text-slate-700'}`}>{cur.vars.j}</span>
                            </div>
                        </div>

                        {/* Interactive Grid Mapping */}
                        <div className="flex-[2] bg-slate-100 rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-center relative shadow-inner">
                            <span className="absolute top-4 left-6 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Conceptual Grid</span>
                            
                            <div className="flex flex-col gap-2 mt-4">
                                {/* Map rows (i) */}
                                {[1, 2, 3].map((rowNum, rIdx) => (
                                    <div key={rIdx} className="flex items-center gap-4">
                                        {/* Row Label */}
                                        <div className={`w-12 text-right text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${cur.activeRow === rIdx ? 'text-sky-600' : 'text-slate-400'}`}>
                                            i={rowNum}
                                        </div>
                                        
                                        {/* Columns (j) */}
                                        <div className={`flex gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${cur.activeRow === rIdx ? 'bg-white border-sky-200 shadow-md' : 'bg-transparent border-transparent'}`}>
                                            {[1, 2, 3].map((colNum, cIdx) => {
                                                const isActiveCell = cur.activeRow === rIdx && cur.activeCol === cIdx;
                                                const isPrinted = cur.grid[rIdx] && cur.grid[rIdx][cIdx] === "*";
                                                const isValidForPattern = colNum <= rowNum; // The specific logic j <= i

                                                let cellClasses = "bg-slate-200 border-slate-300 text-transparent"; // default empty
                                                
                                                if (isPrinted) {
                                                    cellClasses = "bg-indigo-500 border-indigo-600 text-white shadow-lg";
                                                } else if (isActiveCell) {
                                                    cellClasses = "bg-amber-300 border-amber-500 text-amber-900 shadow-md scale-110 ring-4 ring-amber-100 animate-pulse";
                                                } else if (isValidForPattern && cur.activeRow === rIdx) {
                                                    cellClasses = "bg-slate-50 border-dashed border-slate-400 text-slate-300"; // yet to be printed
                                                }

                                                return (
                                                    <div key={cIdx} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-black text-2xl transition-all duration-300 ${cellClasses}`}>
                                                        {isPrinted || isActiveCell ? "*" : ""}
                                                        {/* Show j label on hover or if active row */}
                                                        {!isPrinted && !isActiveCell && cur.activeRow === rIdx && isValidForPattern && (
                                                            <span className="text-[9px] font-mono absolute">j={colNum}</span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Standard Output Console */}
                        <div className="flex-1 bg-black rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col">
                            <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-3">
                                <Terminal size={14} className="text-slate-400"/>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Standard Output</span>
                            </div>
                            <div className="p-5 font-mono text-emerald-400 text-lg leading-loose whitespace-pre-wrap">
                                {cur.console}
                                <span className="inline-block w-2.5 h-5 bg-emerald-400 ml-1 animate-[pulse_1s_step-end_infinite] align-middle"></span>
                            </div>
                        </div>

                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- HOW TO THINK (LOGIC) TAB --- */}
        {activeTab === 'logic' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px]">
            <div className="max-w-4xl space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                  <Lightbulb className="text-amber-500" size={32}/> The 3-Step Pattern Framework
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-amber-200 pl-6 mb-8">
                  Never try to memorize a pattern code. There are hundreds of patterns. Instead, use this universal 3-step framework to reverse-engineer ANY pattern into a nested loop.
                </p>

                <div className="grid grid-cols-1 gap-6">
                    {/* Step 1 */}
                    <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-sky-100 text-sky-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">1</div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Count the Rows (The Outer Loop)</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Look at the target image. How many horizontal lines (rows) are there? This is your <code>n</code>. Your outer loop will ALWAYS just be a simple counter from 1 to <code>n</code>.
                            </p>
                            <div className="bg-white border border-slate-200 p-3 rounded-xl font-mono text-sm inline-block">
                                <span className="text-pink-600">for</span> (int i = 1; i &lt;= n; i++) {'{ ... }'}
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">2</div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-slate-800 mb-2">Find the Column Rule (The Inner Loop)</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                This is the secret sauce. Ask yourself: <em>"When I am on row <code>i</code>, how many stars do I need to print?"</em> Create a mapping table!
                            </p>
                            
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-sm">
                                <table className="w-full text-sm text-left font-mono">
                                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-widest">
                                        <tr><th className="px-4 py-2">Row (i)</th><th className="px-4 py-2">Stars to Print (j)</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr><td className="px-4 py-2 font-bold">i = 1</td><td className="px-4 py-2">1 star  (j goes to 1)</td></tr>
                                        <tr><td className="px-4 py-2 font-bold">i = 2</td><td className="px-4 py-2">2 stars (j goes to 2)</td></tr>
                                        <tr><td className="px-4 py-2 font-bold">i = 3</td><td className="px-4 py-2">3 stars (j goes to 3)</td></tr>
                                        <tr className="bg-amber-50/50"><td className="px-4 py-2 font-black text-amber-700">Any i</td><td className="px-4 py-2 font-black text-amber-700">j goes to i</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-slate-600 mt-4">
                                Therefore, the inner loop must run as long as <code>j &lt;= i</code>.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">3</div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">What to Print?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Finally, decide what goes inside the <code>print()</code> statement. Is it a star <code>"*"</code>? Is it the row number <code>i</code>? Is it the column number <code>j</code>?
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">Print("*")</span>
                                    <pre className="font-mono text-sm leading-tight text-center">*<br/>**<br/>***</pre>
                                </div>
                                <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">Print(i)</span>
                                    <pre className="font-mono text-sm leading-tight text-center">1<br/>22<br/>333</pre>
                                </div>
                                <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">Print(j)</span>
                                    <pre className="font-mono text-sm leading-tight text-center">1<br/>12<br/>123</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- MATH LOGIC TAB --- */}
        {activeTab === 'math' && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-12">
            
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Hash className="text-emerald-500"/> Preparing for Math Logic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-200 pl-6">
                Patterns teach you spatial loops. The next hurdle is Mathematical loops. Here are the core "tricks" you need to memorize before our next lesson.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Modulo */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-emerald-900 tracking-tight mb-4 border-b border-emerald-200 pb-2">
                            The Modulo Operator (%)
                        </h3>
                        <p className="text-emerald-800 text-sm leading-relaxed mb-4">
                            Modulo returns the <strong>remainder</strong> of a division. It is the most powerful tool in algorithmic logic.
                        </p>
                        <ul className="space-y-3 text-sm text-emerald-900 font-mono bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                            <li><span className="text-slate-400 italic">// 1. Check Even/Odd:</span><br/><code>num % 2 == 0</code> (Even)</li>
                            <li><span className="text-slate-400 italic">// 2. Extract Last Digit:</span><br/><code>153 % 10 = 3</code></li>
                        </ul>
                    </div>
                </div>

                {/* Division */}
                <div className="bg-sky-50 border border-sky-200 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-sky-900 tracking-tight mb-4 border-b border-sky-200 pb-2">
                            Integer Division (/)
                        </h3>
                        <p className="text-sky-800 text-sm leading-relaxed mb-4">
                            In Java, dividing an <code>int</code> by an <code>int</code> always chops off the decimal completely (it truncates, it does not round!).
                        </p>
                        <ul className="space-y-3 text-sm text-sky-900 font-mono bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
                            <li><span className="text-slate-400 italic">// Chop off last digit:</span><br/><code>153 / 10 = 15</code></li>
                            <li><span className="text-slate-400 italic">// Combine with Modulo to process digits:</span><br/><code>while(n &gt; 0) {'{'} n = n/10; {'}'}</code></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800 text-center">
                <h3 className="text-xl font-black text-amber-400 mb-3">Up Next: Number Manipulations</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
                    In the next lesson, we will use Modulo and Division inside a <code>while</code> loop to solve classic interview questions like: Reversing a Number, Checking Palindromes, and Finding Armstrong Numbers!
                </p>
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 font-mono text-sm text-sky-300">
                    <Activity size={16}/> Ready for Math Logic
                </div>
            </div>

          </div>
        )}
        
      </div>
    </div>
  );
}
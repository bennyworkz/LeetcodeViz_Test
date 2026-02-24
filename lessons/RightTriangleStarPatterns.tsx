import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Terminal, Play, Pause, RefreshCw, Repeat, 
  LayoutGrid, Lightbulb, Triangle, SlidersHorizontal
} from 'lucide-react';

// --- DYNAMIC STEP GENERATOR ---
const generateSteps = (n) => {
    const steps = [];
    let currentConsole = "";
    let printedCells = [];
    let stepCount = 1;

    // 1. Program Start
    steps.push({
        line: 0,
        phase: `${stepCount++}. Program Start`,
        desc: `We want to print a right-angled triangle. We initialize n = ${n}.`,
        vars: [{ id: "n", val: n, type: "int" }],
        console: "",
        activeRow: -1, activeCol: -1,
        printedCells: []
    });

    // 2. Outer Loop
    for (let i = 1; i <= n + 1; i++) {
        if (i <= n) {
            steps.push({
                line: 6,
                phase: `${stepCount++}. Outer Loop: Row ${i}`,
                desc: `Outer loop starts. 'i' acts as our ROW COUNTER. i = ${i}. Is ${i} <= ${n}? Yes. We enter the row.`,
                vars: [{ id: "n", val: n, type: "int" }, { id: "i", val: i, type: "int", color: "sky", active: true }],
                console: currentConsole,
                activeRow: i, activeCol: -1,
                printedCells: [...printedCells]
            });

            // 3. Inner Loop
            for (let j = 1; j <= i + 1; j++) {
                if (j <= i) {
                    steps.push({
                        line: 9,
                        phase: `${stepCount++}. Inner Loop: Col ${j}`,
                        desc: `Inner loop starts. 'j' = ${j}. Condition (j <= i) evaluates to (${j} <= ${i}). True!`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "j", val: j, type: "int", color: "amber", active: true }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: j,
                        printedCells: [...printedCells]
                    });

                    currentConsole += "* ";
                    printedCells.push(`${i}-${j}`);

                    steps.push({
                        line: 11,
                        phase: `${stepCount++}. Print Star`,
                        desc: `System.out.print("* "); Prints a star and stays on the same line.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "j", val: j, type: "int", color: "amber" }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: j,
                        printedCells: [...printedCells]
                    });
                } else {
                    steps.push({
                        line: 9,
                        phase: `${stepCount++}. Inner Loop Ends`,
                        desc: `j increments to ${j}. Condition (j <= i) is (${j} <= ${i}). FALSE. The inner loop terminates.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "j", val: j, type: "int", color: "amber", highlight: true }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: -1,
                        printedCells: [...printedCells]
                    });
                }
            }

            currentConsole += "\n";
            steps.push({
                line: 15,
                phase: `${stepCount++}. Line Break`,
                desc: `System.out.println(); Finished row ${i}. Prints a newline character.`,
                vars: [
                    { id: "n", val: n, type: "int" },
                    { id: "i", val: i, type: "int", color: "sky" }
                ],
                console: currentConsole,
                activeRow: i, activeCol: -1,
                printedCells: [...printedCells]
            });
        } else {
            steps.push({
                line: 6,
                phase: `${stepCount++}. Program Complete`,
                desc: `i increments to ${i}. Is (${i} <= ${n})? FALSE. Outer loop finishes. Pattern complete!`,
                vars: [
                    { id: "n", val: n, type: "int" },
                    { id: "i", val: i, type: "int", color: "sky", highlight: true }
                ],
                console: currentConsole,
                activeRow: -1, activeCol: -1,
                printedCells: [...printedCells]
            });
        }
    }
    return steps;
};

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
  const [activeTab, setActiveTab] = useState<'simulator' | 'lesson' | 'theory' | 'interview'>('simulator');
  const [nValue, setNValue] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamically generate the steps when nValue changes
  const steps = useMemo(() => generateSteps(nValue), [nValue]);

  // Dynamically generate the code string so line 3 reflects the custom N
  const codeString = useMemo(() => `public class RightTriangle {
    public static void main(String[] args) {
        int n = ${nValue}; 

        // 1. Outer loop controls ROWS
        for (int i = 1; i <= n; i++) {
            
            // 2. Inner loop controls COLUMNS
            for (int j = 1; j <= i; j++) {
                // Print star on SAME line
                System.out.print("* ");
            }
            
            // 3. Move to the NEXT line
            System.out.println(); 
        }
    }
}`, [nValue]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < steps.length - 1) {
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 1500); // Faster playback for dynamic inputs
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const handleNext = () => { setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)); setIsPlaying(false); };
  const handlePrev = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };
  const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };
  const togglePlay = () => {
      if (currentStep === steps.length - 1) setCurrentStep(0);
      setIsPlaying(!isPlaying);
  };
  
  const handleCopy = () => { 
    navigator.clipboard.writeText(codeString); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  // Generate arrays for dynamic grid rendering
  const rowsArray = Array.from({length: nValue}, (_, i) => i + 1);
  const colsArray = Array.from({length: nValue}, (_, i) => i + 1);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-700 p-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center relative overflow-hidden group">
                <Triangle className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Dynamic Patterns</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase border border-indigo-100">Logic Building 105</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Nested Loops</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="indigo" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="sky" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="The Framework" color="amber" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Other Shapes" color="rose" />
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
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">RightTriangle.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors text-slate-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 py-6 font-mono text-[13px] leading-relaxed relative overflow-auto min-h-[440px]">
                      {codeString.split('\n').map((line, idx) => (
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
                          <span>Progress (Step {currentStep + 1})</span>
                          <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                  </div>
                </div>

                {/* Controls (Simplified - Input moved to top of right panel) */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex gap-4 items-center justify-between">
                    <div className="flex gap-2 w-full">
                        <button onClick={handleReset} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors tooltip">
                          <RefreshCw size={16}/>
                        </button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-slate-100 transition-all flex items-center justify-center gap-1 text-slate-600">
                          <ChevronLeft size={16}/> Prev
                        </button>
                        <button onClick={togglePlay} className={`px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}>
                          {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                        </button>
                        <button onClick={handleNext} disabled={currentStep === steps.length - 1} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1">
                          Next <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
              </div>

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <LayoutGrid size={20} className="text-indigo-500"/> Dynamic Rendering Grid
                        </h3>
                    </div>

                    <div className="flex flex-col gap-8 flex-1 relative">
                        
                        {/* INPUT CONTROL - Moved to top for better visibility */}
                        <div className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 rounded-2xl border-2 border-indigo-200 shadow-sm">
                            <SlidersHorizontal size={18} className="text-indigo-600"/>
                            <span className="text-sm font-black uppercase tracking-widest text-indigo-700 font-mono">Rows (n):</span>
                            <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={nValue} 
                                onChange={(e) => {
                                    setNValue(parseInt(e.target.value));
                                    setCurrentStep(0);
                                    setIsPlaying(false);
                                }}
                                className="w-32 h-2 accent-indigo-600 cursor-pointer"
                            />
                            <span className="text-2xl font-black text-indigo-700 font-mono w-8 text-center">{nValue}</span>
                        </div>

                        {/* VARIABLES TRACKER */}
                        <div className="flex gap-4">
                            {cur.vars.filter(v => v.id !== 'n').map((v, idx) => {
                                const c = v.color || 'slate';
                                return (
                                    <div key={idx} className={`flex-1 relative flex flex-col border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${v.active ? 'scale-105 shadow-md z-10 ring-4' : ''} ${v.highlight ? `border-${c}-400 ring-4 ring-${c}-100 scale-105 shadow-md z-20` : 'border-slate-200 ring-transparent'}`}>
                                        <div className={`text-[10px] font-mono font-black px-4 py-1.5 flex justify-center uppercase tracking-widest ${v.highlight || v.active ? `bg-${c}-100 text-${c}-800 border-b border-${c}-200` : 'bg-slate-100 text-slate-500 border-b border-slate-200'}`}>
                                            {v.id === 'i' ? 'Row (i)' : v.id === 'j' ? 'Col (j)' : 'n'}
                                        </div>
                                        <div className={`font-mono font-black text-center py-4 px-4 text-3xl flex items-center justify-center gap-1 bg-white transition-colors duration-500 ${c === 'slate' ? 'text-slate-700' : `text-${c}-600`}`}>
                                            {v.val}
                                        </div>
                                    </div>
                                )
                            })}
                            {cur.vars.filter(v => v.id !== 'n').length === 0 && (
                                <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-center text-slate-400 font-mono text-sm italic">
                                    Variables loading...
                                </div>
                            )}
                        </div>

                        {/* CONCEPTUAL GRID */}
                        <div className="flex-[2] bg-slate-100 rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-center relative shadow-inner overflow-auto">
                            <div className="flex flex-col gap-2">
                                {rowsArray.map((row) => (
                                    <div key={`row-${row}`} className="flex items-center gap-4">
                                        {/* Row Label */}
                                        <div className={`w-12 text-right text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${cur.activeRow === row ? 'text-sky-600' : 'text-slate-400'}`}>
                                            i={row}
                                        </div>
                                        
                                        {/* Columns (j) */}
                                        <div className={`flex gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${cur.activeRow === row ? 'bg-white border-sky-200 shadow-md' : 'bg-transparent border-transparent'}`}>
                                            {colsArray.map((col) => {
                                                const cellId = `${row}-${col}`;
                                                const isActiveCell = cur.activeRow === row && cur.activeCol === col;
                                                const isPrinted = cur.printedCells.includes(cellId);
                                                const isValidForPattern = col <= row; // The condition j <= i

                                                let cellClasses = "bg-slate-200 border-slate-300 text-transparent"; // default empty
                                                
                                                if (isPrinted) {
                                                    cellClasses = "bg-indigo-500 border-indigo-600 text-white shadow-lg scale-100";
                                                } else if (isActiveCell) {
                                                    cellClasses = "bg-amber-300 border-amber-500 text-amber-900 shadow-md scale-110 ring-4 ring-amber-100 animate-pulse";
                                                } else if (isValidForPattern && cur.activeRow === row) {
                                                    cellClasses = "bg-slate-50 border-dashed border-slate-400 text-slate-300 scale-95"; // yet to be printed
                                                }

                                                // Dynamically shrink cell size if n is large to fit screen better
                                                const cellSize = nValue > 4 ? "w-10 h-10 text-xl" : "w-14 h-14 text-3xl";

                                                return (
                                                    <div key={`cell-${cellId}`} className={`${cellSize} rounded-lg border-2 flex items-center justify-center font-black transition-all duration-300 ${cellClasses}`}>
                                                        {isPrinted || isActiveCell ? "*" : ""}
                                                        {!isPrinted && !isActiveCell && cur.activeRow === row && isValidForPattern && (
                                                            <span className="text-[9px] font-mono absolute">j={col}</span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CONSOLE OUTPUT */}
                        <div className="flex-1 bg-black rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col min-h-[150px]">
                            <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-3">
                                <Terminal size={14} className="text-slate-400"/>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Standard Output</span>
                            </div>
                            <div className="p-5 font-mono text-emerald-400 text-lg leading-loose whitespace-pre-wrap overflow-y-auto">
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

        {/* --- LESSON TAB --- */}
        {activeTab === 'lesson' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-in fade-in duration-500 min-h-[600px]">
            <div className="max-w-4xl space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                  <Triangle className="text-sky-500" size={32}/> Spatial Logic & Coordinates
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-sky-200 pl-6 mb-8">
                  Patterns are rarely used in production software. So why does every Computer Science class teach them? Because they force your brain to learn <strong>2D Spatial Mapping</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl mb-8">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-xl">
                        <Layers className="text-indigo-500"/> The Nested Loop Concept
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Think of a spreadsheet or a grid. 
                        To visit every cell, you can't use just one loop. You need a loop that goes down row by row, and for <em>each</em> row, a second loop that goes across column by column.
                    </p>
                    
                    <ul className="space-y-4 text-sm text-slate-700">
                        <li className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <span className="bg-sky-100 text-sky-700 font-black px-2.5 py-1 rounded">i</span>
                            <div>
                                <strong>The Outer Loop (Rows):</strong> Represents the Y-axis. It runs once for every horizontal line you want to print.
                            </div>
                        </li>
                        <li className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <span className="bg-amber-100 text-amber-700 font-black px-2.5 py-1 rounded">j</span>
                            <div>
                                <strong>The Inner Loop (Columns):</strong> Represents the X-axis. It is fully restarted and runs to completion <em>inside</em> every single step of the outer loop.
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-3xl">
                    <h4 className="font-black text-indigo-900 mb-2 flex items-center gap-2 uppercase tracking-widest text-sm">
                        <Code2 size={16}/> print() vs println()
                    </h4>
                    <p className="text-sm text-indigo-800 leading-relaxed mb-3">
                        The secret to building patterns is controlling the console cursor.
                    </p>
                    <ul className="text-sm text-indigo-800 space-y-2 font-mono">
                        <li><code>System.out.print("* ")</code> prints the star but keeps the cursor right next to it. Perfect for columns (inner loop).</li>
                        <li><code>System.out.println()</code> prints nothing, but hits the "Enter" key on the console. Perfect for finishing a row (outer loop).</li>
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
                <Lightbulb className="text-amber-500"/> The 3-Step Pattern Framework
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-amber-200 pl-6">
                Never memorize the code for a pattern. If an interviewer asks you to print a diamond or an inverted pyramid, you just need a pen, paper, and this 3-step mathematical framework.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Step 1 */}
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
                    <div className="bg-sky-100 text-sky-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">1</div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Count the Rows (Outer Loop)</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Look at the target image. How many horizontal lines are there? This is <code>n</code>. Your outer loop is almost ALWAYS a simple counter from 1 to <code>n</code>.
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
                        <h3 className="text-xl font-black text-slate-800 mb-2">Find the Column Rule (Inner Loop)</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Ask yourself: <em>"When I am on row <code>i</code>, how many stars do I need to print?"</em> Create a mapping table to find the formula!
                        </p>
                        
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-md">
                            <table className="w-full text-sm text-left font-mono">
                                <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-widest">
                                    <tr><th className="px-4 py-2">Row (i)</th><th className="px-4 py-2">Stars to Print (j)</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="px-4 py-2 font-bold">i = 1</td><td className="px-4 py-2">1 star  (j runs to 1)</td></tr>
                                    <tr><td className="px-4 py-2 font-bold">i = 2</td><td className="px-4 py-2">2 stars (j runs to 2)</td></tr>
                                    <tr><td className="px-4 py-2 font-bold">i = 3</td><td className="px-4 py-2">3 stars (j runs to 3)</td></tr>
                                    <tr className="bg-amber-50/50"><td className="px-4 py-2 font-black text-amber-700">Any i</td><td className="px-4 py-2 font-black text-amber-700">j runs to i</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-slate-600 mt-4">
                            Formula found! The inner loop must run as long as <code>j &lt;= i</code>.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
                    <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0">3</div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">What to Print?</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Look at the characters. Is it a star <code>"*"</code>? Is it the row number <code>i</code>? Is it the column number <code>j</code>?
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">print("*")</span>
                                <pre className="font-mono text-sm leading-tight text-center">*<br/>**<br/>***</pre>
                            </div>
                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">print(i)</span>
                                <pre className="font-mono text-sm leading-tight text-center">1<br/>22<br/>333</pre>
                            </div>
                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">print(j)</span>
                                <pre className="font-mono text-sm leading-tight text-center">1<br/>12<br/>123</pre>
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
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-rose-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={28} /> Inverting the Logic
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Asks:</span>
                            "Great. Now flip the triangle upside down."
                            <pre className="mt-3 text-amber-300">***<br/>**<br/>*</pre>
                        </div>
                        <div className="border-l-4 border-rose-500 pl-6 space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Don't panic. Use the framework! 
                            </p>
                            <table className="w-full max-w-sm text-xs text-left font-mono bg-slate-800 rounded-lg overflow-hidden mt-2">
                                <thead className="bg-slate-700 text-slate-300">
                                    <tr><th className="px-3 py-2">Row (i)</th><th className="px-3 py-2">Stars (j)</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td className="px-3 py-1">i = 1</td><td className="px-3 py-1">3 stars</td></tr>
                                    <tr><td className="px-3 py-1">i = 2</td><td className="px-3 py-1">2 stars</td></tr>
                                    <tr><td className="px-3 py-1">i = 3</td><td className="px-3 py-1">1 star</td></tr>
                                </tbody>
                            </table>
                            <p className="text-sm text-emerald-400 font-bold mt-2">
                                The Formula: <code>j</code> runs from 1 up to <code>n - i + 1</code>.
                            </p>
                            <div className="bg-slate-800 p-3 rounded font-mono text-xs text-sky-300">
                                for(int i=1; i&lt;=n; i++) {'{'}<br/>
                                &nbsp;&nbsp;<span className="text-pink-500">for(int j=1; j &lt;= n - i + 1; j++)</span> {'{'}<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;System.out.print("* ");<br/>
                                &nbsp;&nbsp;{'}'}<br/>
                                &nbsp;&nbsp;System.out.println();<br/>
                                {'}'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           Handling Spaces (The Pyramid)
                        </h4>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                What if they want a centered pyramid?
                            </p>
                            <pre className="font-mono text-xs bg-slate-50 p-2 rounded w-fit leading-tight">
                                &nbsp;&nbsp;*<br/>
                                &nbsp;***<br/>
                                *****
                            </pre>
                            <p>
                                You just add a <strong>second inner loop</strong>! The first inner loop prints invisible spaces (`" "`), and the second inner loop prints the stars (`"*"`). You build two logic tables (one for spaces, one for stars) and map them both to `i`!
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
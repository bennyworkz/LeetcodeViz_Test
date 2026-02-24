import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Layers, FileText, ArrowRight, 
  Terminal, Play, Pause, RefreshCw, 
  LayoutGrid, Lightbulb, Triangle, ArrowDownToLine, Gem
} from 'lucide-react';

// --- DYNAMIC STEP GENERATOR ---
const generateSteps = (n) => {
    const steps = [];
    let currentConsole = "";
    let printedCells = []; // Will store {r, c, type: 'space' | 'star'}
    let stepCount = 1;

    // 1. Program Start
    steps.push({
        line: 0,
        phase: `${stepCount++}. Program Start`,
        desc: `We want to print a Reverse Pyramid. We initialize n = ${n}.`,
        vars: [{ id: "n", val: n, type: "int" }],
        console: "",
        activeRow: -1, activeCol: -1,
        printedCells: []
    });

    // 2. Decrementing Outer Loop
    for (let i = n; i >= 0; i--) {
        if (i >= 1) {
            steps.push({
                line: 6,
                phase: `${stepCount++}. Outer Loop: Row ${i}`,
                desc: `Outer loop begins! Notice 'i' starts at ${n} and DECREMENTS. Is ${i} >= 1? Yes. We are processing row i=${i}.`,
                vars: [{ id: "n", val: n, type: "int" }, { id: "i", val: i, type: "int", color: "sky", active: true }],
                console: currentConsole,
                activeRow: i, activeCol: -1, activeVar: 'i',
                printedCells: [...printedCells]
            });

            let physicalCol = 1;

            // 3. Inner Loop 1: Spaces
            for (let j = 1; j <= (n - i) + 1; j++) {
                if (j <= n - i) {
                    steps.push({
                        line: 9,
                        phase: `${stepCount++}. Spaces Loop: Iteration ${j}`,
                        desc: `'j' = ${j}. Condition (j <= n - i) is (${j} <= ${n - i}). True! We need spacing to push the stars inward.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "j", val: j, type: "int", color: "purple", active: true }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: physicalCol, activeVar: 'j',
                        printedCells: [...printedCells]
                    });

                    currentConsole += " "; // Single space!
                    printedCells.push({ r: i, c: physicalCol, type: "space" });

                    steps.push({
                        line: 10,
                        phase: `${stepCount++}. Print Space`,
                        desc: `System.out.print(" "); We print a SINGLE space character to center the pyramid.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "j", val: j, type: "int", color: "purple" }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: physicalCol, activeVar: 'j',
                        printedCells: [...printedCells]
                    });
                    physicalCol++;
                } else {
                    steps.push({
                        line: 9,
                        phase: `${stepCount++}. Spaces Loop Ends`,
                        desc: `j is ${j}. Condition (${j} &lt;= ${n - i}) is FALSE. Padding complete for this row.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "j", val: j, type: "int", color: "purple", highlight: true }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: -1, activeVar: 'j',
                        printedCells: [...printedCells]
                    });
                }
            }

            // 4. Inner Loop 2: Stars
            for (let k = 1; k <= i + 1; k++) {
                if (k <= i) {
                    steps.push({
                        line: 14,
                        phase: `${stepCount++}. Stars Loop: Iteration ${k}`,
                        desc: `Stars loop begins! 'k' = ${k}. Condition (k <= i) is (${k} <= ${i}). True!`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "k", val: k, type: "int", color: "amber", active: true }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: physicalCol, activeVar: 'k',
                        printedCells: [...printedCells]
                    });

                    currentConsole += "* "; 
                    printedCells.push({ r: i, c: physicalCol, type: "star" });

                    steps.push({
                        line: 15,
                        phase: `${stepCount++}. Print Star`,
                        desc: `System.out.print("* "); We print the star followed by a space to complete the pyramid look.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "k", val: k, type: "int", color: "amber" }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: physicalCol, activeVar: 'k',
                        printedCells: [...printedCells]
                    });
                    physicalCol++;
                } else {
                    steps.push({
                        line: 14,
                        phase: `${stepCount++}. Stars Loop Ends`,
                        desc: `k is ${k}. Condition (${k} &lt;= ${i}) is FALSE. All stars for this row are drawn.`,
                        vars: [
                            { id: "n", val: n, type: "int" },
                            { id: "i", val: i, type: "int", color: "sky" },
                            { id: "k", val: k, type: "int", color: "amber", highlight: true }
                        ],
                        console: currentConsole,
                        activeRow: i, activeCol: -1, activeVar: 'k',
                        printedCells: [...printedCells]
                    });
                }
            }

            currentConsole += "\n";
            steps.push({
                line: 19,
                phase: `${stepCount++}. Line Break`,
                desc: `System.out.println(); The row is completely finished. Move down to the next line.`,
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
                desc: `i decrements to ${i}. Is (${i} >= 1)? FALSE. The outer loop finishes. Reverse Pyramid complete!`,
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
        violet: 'text-violet-600',
        sky: 'text-sky-600',
        amber: 'text-amber-600',
        fuchsia: 'text-fuchsia-600'
    };
    const activeColor = colorMap[color] || 'text-violet-600';

    return (
      <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? `bg-white ${activeColor} shadow-sm border border-slate-200 scale-105` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
        {icon} {label}
      </button>
    );
};

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|static|class|void|int|for)\b|\b\d+\b)/g).filter(Boolean);
  
  return (
    <div className={`flex relative z-10 min-h-[22px] items-center transition-colors duration-200 ${active ? 'bg-violet-500/15' : 'hover:bg-slate-800/50'}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]`} />}
      <span className={`w-10 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-xs ${active ? `text-violet-400 font-bold` : 'text-slate-600'}`}>{num}</span>
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
  const [nValue, setNValue] = useState(4);
  const [textInput, setTextInput] = useState("4");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamically generate the steps when nValue changes
  const steps = useMemo(() => generateSteps(nValue), [nValue]);

  // Dynamically generate the code string
  const codeString = useMemo(() => `public class ReversePyramid {
    public static void main(String[] args) {
        int n = ${nValue}; 

        // 1. Decrementing Outer Loop
        for (int i = n; i >= 1; i--) {
            
            // 2. Spaces (n - i)
            for (int j = 1; j <= n - i; j++) {
                System.out.print(" ");
            }
            
            // 3. Stars (i)
            for (int k = 1; k <= i; k++) {
                System.out.print("* ");
            }
            
            // 4. Move to NEXT line
            System.out.println(); 
        }
    }
}`, [nValue]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStep < steps.length - 1) {
        timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, 1200); 
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setTextInput(val); 
      
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 1 && num <= 6) {
          setNValue(num);
          setCurrentStep(0);
          setIsPlaying(false);
      }
  };

  const cur = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  // Generate rows array top-to-bottom for the inverted pyramid visual (e.g. 4, 3, 2, 1)
  const rowsArray = Array.from({length: nValue}, (_, idx) => nValue - idx);
  const colsArray = Array.from({length: nValue}, (_, i) => i + 1);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 p-4 rounded-2xl shadow-lg shadow-violet-200 flex items-center justify-center relative overflow-hidden group">
                <ArrowDownToLine className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Reverse Pyramid</h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase border border-violet-100">Logic Building 107</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase tracking-wider">Decrementing Loops</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full lg:w-auto">
            <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} icon={<Activity size={16}/>} label="Simulator" color="violet" />
            <TabButton active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} icon={<FileText size={16}/>} label="Lesson" color="sky" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="The Math" color="amber" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Gem size={16}/>} label="Diamond Pattern" color="fuchsia" />
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
                      <Code2 size={16} className="text-violet-400" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300 font-mono">ReversePyramid.java</span>
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
                        <Activity size={16} className="text-violet-500"/>
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
                  <p className="text-sm leading-relaxed border-l-4 pl-4 relative z-10 flex-1 text-slate-600 border-violet-300">
                      {cur.desc}
                  </p>

                  {/* Progress Bar inside Log */}
                  <div className="mt-6">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                          <span>Progress (Step {currentStep + 1})</span>
                          <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                  </div>
                </div>

                {/* Controls (WITH CUSTOM N TEXT INPUT) */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
                    
                    <div className="flex items-center gap-3 w-full xl:w-auto bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-inner">
                        <Code2 size={16} className="text-slate-400"/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono shrink-0">Input (n):</span>
                        <input 
                            type="text" 
                            value={textInput} 
                            onChange={handleInputChange}
                            className="w-12 bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-mono font-bold text-center text-violet-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all shadow-sm"
                            placeholder="1-6"
                        />
                        {parseInt(textInput) > 6 && <span className="text-[9px] text-rose-500 font-bold ml-1">Max 6!</span>}
                    </div>

                    <div className="flex gap-2 w-full xl:w-auto">
                        <button onClick={handleReset} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors tooltip">
                          <RefreshCw size={16}/>
                        </button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-slate-100 transition-all flex items-center justify-center gap-1 text-slate-600">
                          <ChevronLeft size={16}/> Prev
                        </button>
                        <button onClick={togglePlay} className={`px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200'}`}>
                          {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                        </button>
                        <button onClick={handleNext} disabled={currentStep === steps.length - 1} className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-md shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center gap-1">
                          Next <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
              </div>

              {/* Right Col: Output Arena (7/12) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner h-full min-h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-50/50 via-white to-white">
                    
                    <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-mono uppercase tracking-tight">
                            <LayoutGrid size={20} className="text-violet-500"/> Dynamic Rendering Grid
                        </h3>
                    </div>

                    <div className="flex flex-col gap-8 flex-1 relative">
                        
                        {/* VARIABLES TRACKER */}
                        <div className="flex gap-4">
                            {cur.vars.map((v, idx) => {
                                const c = v.color || 'slate';
                                return (
                                    <div key={idx} className={`flex-1 relative flex flex-col border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${v.active ? 'scale-105 shadow-md z-10 ring-4' : ''} ${v.highlight ? `border-${c}-400 ring-4 ring-${c}-100 scale-105 shadow-md z-20` : 'border-slate-200 ring-transparent'}`}>
                                        <div className={`text-[10px] font-mono font-black px-4 py-1.5 flex justify-center uppercase tracking-widest ${v.highlight || v.active ? `bg-${c}-100 text-${c}-800 border-b border-${c}-200` : 'bg-slate-100 text-slate-500 border-b border-slate-200'}`}>
                                            {v.id === 'i' ? 'Row (i)' : v.id === 'j' ? 'Spaces (j)' : v.id === 'k' ? 'Stars (k)' : 'n'}
                                        </div>
                                        <div className={`font-mono font-black text-center py-4 px-4 text-3xl flex items-center justify-center gap-1 bg-white transition-colors duration-500 ${c === 'slate' ? 'text-slate-700' : `text-${c}-600`}`}>
                                            {v.val}
                                        </div>
                                    </div>
                                )
                            })}
                            {cur.vars.length === 0 && (
                                <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-center text-slate-400 font-mono text-sm italic">
                                    Variables loading...
                                </div>
                            )}
                        </div>

                        {/* CONCEPTUAL GRID */}
                        <div className="flex-[2] bg-slate-100 rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-center relative shadow-inner overflow-auto">
                            <div className="flex flex-col gap-2">
                                {/* We map through rowsArray which is [n, n-1, ..., 1] */}
                                {rowsArray.map((row) => (
                                    <div key={`row-${row}`} className="flex items-center gap-4">
                                        {/* Row Label */}
                                        <div className={`w-12 text-right text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${cur.activeRow === row ? 'text-sky-600' : 'text-slate-400'}`}>
                                            i={row}
                                        </div>
                                        
                                        {/* Columns (physical mapping) */}
                                        <div className={`flex gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${cur.activeRow === row ? 'bg-white border-sky-200 shadow-md' : 'bg-transparent border-transparent'}`}>
                                            {colsArray.map((col) => {
                                                const printedCell = cur.printedCells.find(p => p.r === row && p.c === col);
                                                const isActiveCell = cur.activeRow === row && cur.activeCol === col;
                                                
                                                let cellClasses = "bg-slate-200 border-slate-300 text-transparent"; 
                                                let content = "";
                                                let trackingLabel = "";

                                                if (printedCell) {
                                                    if (printedCell.type === "space") {
                                                        cellClasses = "bg-slate-100 border-dashed border-slate-300 text-slate-400 scale-95";
                                                        content = "-"; // Visual space representation
                                                    } else {
                                                        cellClasses = "bg-violet-500 border-violet-600 text-white shadow-lg scale-100";
                                                        content = "*"; 
                                                    }
                                                } else if (isActiveCell) {
                                                    if (cur.activeVar === 'j') {
                                                        cellClasses = "bg-purple-100 border-purple-400 text-purple-900 shadow-md scale-110 ring-4 ring-purple-100 animate-pulse";
                                                        content = "-";
                                                    } else if (cur.activeVar === 'k') {
                                                        cellClasses = "bg-amber-300 border-amber-500 text-amber-900 shadow-md scale-110 ring-4 ring-amber-100 animate-pulse";
                                                        content = "*"; 
                                                    }
                                                } else if (cur.activeRow === row) {
                                                    // Cell hasn't been drawn yet, but belongs to the active row
                                                    cellClasses = "bg-slate-50 border-dashed border-slate-400 text-slate-300 scale-95";
                                                    
                                                    // Formula for spaces is n - i. 
                                                    if (col <= nValue - row) {
                                                        trackingLabel = `j`;
                                                    } else {
                                                        trackingLabel = `k`;
                                                    }
                                                }

                                                // Dynamically shrink cell size if n is large
                                                const cellSize = nValue > 4 ? "w-10 h-10 text-xl" : "w-14 h-14 text-3xl";

                                                return (
                                                    <div key={`cell-${row}-${col}`} className={`${cellSize} rounded-lg border-2 flex items-center justify-center font-black transition-all duration-300 relative ${cellClasses}`}>
                                                        {content}
                                                        {!printedCell && !isActiveCell && cur.activeRow === row && trackingLabel && (
                                                            <span className="text-[9px] font-mono absolute opacity-50">{trackingLabel}</span>
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
                  <ArrowDownToLine className="text-sky-500" size={32}/> The Decrementing Loop
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
                <p className="text-lg leading-relaxed border-l-4 border-sky-200 pl-6 mb-8">
                  Up until now, every outer loop we've written has counted up (e.g., <code>i = 1; i &lt;= n; i++</code>). But what if we want to print an upside-down shape? We can just count backwards!
                </p>

                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl mb-8">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-xl">
                        <Layers className="text-indigo-500"/> Flipping the Y-Axis
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                        By making the outer loop <code>for (int i = n; i &gt;= 1; i--)</code>, the very first row that processes will have <code>i = 4</code> (if n=4). <br/><br/>
                        This means we can use the EXACT same formulas we used for the standard pyramid, and Java will naturally draw the largest part of the pyramid at the top!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 mt-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                            <span className="bg-sky-100 text-sky-700 font-black px-3 py-1.5 rounded-lg mb-4 text-xs tracking-widest uppercase self-start">Standard Loop (i++)</span>
                            <pre className="font-mono font-bold text-slate-800 leading-tight">
                                i=1: &nbsp;&nbsp;&nbsp;*<br/>
                                i=2: &nbsp;&nbsp;* *<br/>
                                i=3: &nbsp;* * *<br/>
                                i=4: * * * *
                            </pre>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                            <span className="bg-violet-100 text-violet-700 font-black px-3 py-1.5 rounded-lg mb-4 text-xs tracking-widest uppercase self-start">Decrement Loop (i--)</span>
                            <pre className="font-mono font-bold text-slate-800 leading-tight">
                                i=4: * * * *<br/>
                                i=3: &nbsp;* * *<br/>
                                i=2: &nbsp;&nbsp;* *<br/>
                                i=1: &nbsp;&nbsp;&nbsp;*
                            </pre>
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
                <Lightbulb className="text-amber-500"/> Mapping the Reverse Pyramid
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-amber-200 pl-6">
                Let's prove why the decrementing loop works so well. We will build our table for <code>n = 4</code>, but this time, <code>i</code> starts at 4 and counts down to 1.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col items-center">
                    
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full max-w-2xl">
                        <table className="w-full text-sm text-left font-mono">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-4 py-3">Row (i)</th>
                                    <th className="px-4 py-3 bg-purple-50/50">Spaces (j)</th>
                                    <th className="px-4 py-3 bg-amber-50/50">Stars (k)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                <tr>
                                    <td className="px-4 py-3 font-bold">i = 4</td>
                                    <td className="px-4 py-3 text-purple-700">0 spaces (4-4)</td>
                                    <td className="px-4 py-3 text-amber-700">4 stars</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-bold">i = 3</td>
                                    <td className="px-4 py-3 text-purple-700">1 space  (4-3)</td>
                                    <td className="px-4 py-3 text-amber-700">3 stars</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-bold">i = 2</td>
                                    <td className="px-4 py-3 text-purple-700">2 spaces (4-2)</td>
                                    <td className="px-4 py-3 text-amber-700">2 stars</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-bold">i = 1</td>
                                    <td className="px-4 py-3 text-purple-700">3 spaces (4-1)</td>
                                    <td className="px-4 py-3 text-amber-700">1 star</td>
                                </tr>
                                <tr className="border-t-2 border-slate-200 bg-slate-50">
                                    <td className="px-4 py-4 font-black text-slate-800 uppercase text-xs tracking-widest">Formula</td>
                                    <td className="px-4 py-4 font-black text-purple-600">j goes to <span className="bg-purple-100 px-2 rounded border border-purple-200">n - i</span></td>
                                    <td className="px-4 py-4 font-black text-amber-600">k goes to <span className="bg-amber-100 px-2 rounded border border-amber-200">i</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-sky-50 border border-sky-200 p-6 md:p-8 rounded-3xl">
                    <h3 className="text-xl font-black text-sky-900 mb-2">The Revelation</h3>
                    <p className="text-sm text-sky-800 leading-relaxed mb-4">
                        Look closely at the formulas: <code>j &lt;= n - i</code> and <code>k &lt;= i</code>. They are the <strong>exact same formulas</strong> used in the normal Pyramid! 
                    </p>
                    <p className="text-sm text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-100">
                        Because we flipped the outer loop, we didn't have to change a single line of logic inside the inner loops. It "just works"!
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
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-fuchsia-400 relative z-10 uppercase tracking-tight">
                        <Gem size={28} /> The Diamond Pattern
                    </h3>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="bg-black/40 border border-slate-700 p-5 rounded-xl text-emerald-400 text-sm shadow-inner">
                            <span className="text-slate-500 block text-xs mb-2 uppercase tracking-widest font-black">Interviewer Asks:</span>
                            "Print a Diamond."
                            <pre className="mt-3 text-fuchsia-300">
                                &nbsp;&nbsp;&nbsp;* <br/>
                                &nbsp;&nbsp;* * <br/>
                                &nbsp;* * * <br/>
                                * * * * <br/>
                                &nbsp;* * * <br/>
                                &nbsp;&nbsp;* * <br/>
                                &nbsp;&nbsp;&nbsp;*
                            </pre>
                        </div>
                        <div className="border-l-4 border-fuchsia-500 pl-6 space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Many candidates freeze here because they try to write one massive, complicated formula to handle the expanding AND shrinking.
                            </p>
                            <p className="text-sm text-emerald-400 font-bold mt-2">
                                The Trick: A Diamond is literally just a Pyramid pasted on top of a Reverse Pyramid.
                            </p>
                            <div className="bg-slate-800 p-4 rounded-xl font-mono text-xs text-sky-300 mt-2 space-y-3">
                                <div>
                                    <span className="text-slate-500 italic">// 1. Top half (Standard Pyramid)</span><br/>
                                    for (int i = 1; i &lt;= n; i++) {'{ ... }'}
                                </div>
                                <div>
                                    <span className="text-slate-500 italic">// 2. Bottom half (Reverse Pyramid)</span><br/>
                                    <span className="text-slate-500 italic">// Note: Start at n-1 so we don't repeat the middle row!</span><br/>
                                    for (int i = <span className="text-rose-400 font-bold">n - 1</span>; i &gt;= 1; i--) {'{ ... }'}
                                </div>
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
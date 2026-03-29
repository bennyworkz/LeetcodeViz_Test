import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalDP: {
    id: 'optimalDP',
    title: '1. O(N) DP + Bit Manipulation',
    icon: <Binary size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int[] countBits(int n) {
    int[] ans = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        ans[i] = ans[i >> 1] + (i & 1);
    }
    return ans;
}`,
    desc: "The optimal O(N) Dynamic Programming approach. Instead of counting bits for each number from scratch (which takes O(N log N)), we reuse previously computed results. If you take a number 'i' and shift its bits to the right by 1 (i >> 1), you are essentially dividing it by 2. The number of 1-bits in 'i' is exactly equal to the number of 1-bits in 'i >> 1', plus 1 extra if the chopped-off Least Significant Bit (LSB) was a 1 (i & 1)."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|countBits|ans|n|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'char', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String'].includes(part);
            const isPointer = ['ans', 'n', 'i'].includes(part);
            const isMapCall = ['countBits'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? 'text-sky-300' : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
                }
              >
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function CountingBitsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalDP');
  
  const [nInput, setNInput] = useState('8');
  
  const [baseN, setBaseN] = useState<number>(8);
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'indigo';

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = parseInt(nInput.trim(), 10);
      if (isNaN(parsed) || parsed < 0) parsed = 8;
      if (parsed > 16) parsed = 16; // Limit strictly for UI rendering purposes
      
      setBaseN(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    
    let ans = new Array(n + 1).fill(0);

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            ans: [...ans],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'optimalDP') {
        
        add("Function Call", `public int[] countBits(int n=${n})`, 1, {});
        
        // Line 2
        add("Init Array", `int[] ans = new int[${n + 1}];\nCreating array to store results. ans[0] is automatically 0.`, 2, { hlInit: true });

        // Line 3-5
        for (let i = 1; i <= n; i++) {
            add("For Loop", `for (int i = ${i}; i <= n; i++)\nCalculating bits for i = ${i}.`, 3, { i, isCheckingFor: true });

            let shifted = i >> 1;
            let lsb = i & 1;
            let prevBits = ans[shifted];
            let newBits = prevBits + lsb;

            add("DP Transition", `ans[${i}] = ans[${shifted}] + (${lsb});\nLook up ans[${shifted}] (${prevBits}) and add LSB (${lsb}).`, 4, { 
                i, 
                shifted, 
                lsb, 
                prevBits, 
                newBits, 
                hlUpdate: true 
            });

            ans[i] = newBits; // Apply the update
        }

        // Line 6
        add("Return Final Result", `return ans;\nSuccessfully calculated bits for all numbers 0 to ${n}.`, 6, { isSuccess: true, finalAns: ans });
    }

    return steps;
  }, [baseN, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.85); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  // Helper to format binary string
  const toBinary = (num: number, pad: number = 5) => {
      return num.toString(2).padStart(pad, '0');
  }

  const renderVisuals = () => {
      if (st.ans === undefined) return <span className="text-slate-400 italic">empty</span>;

      // Determine dimensions for drawing arcs
      const CELL_WIDTH = 48; // Matches w-12
      const CELL_MARGIN = 8; // Matches gap-2
      const TOTAL_CELL_WIDTH = CELL_WIDTH + CELL_MARGIN;

      return (
          <div className="flex flex-col items-center w-full gap-12 pointer-events-none relative pt-6">
              
              {/* DP Array Visualization */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-6 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Database size={12}/> DP Array: ans</span>
                  
                  <div className="relative flex flex-wrap justify-center max-w-4xl gap-y-16 px-4">
                      
                      {/* SVG Overlay for Transition Arcs */}
                      {st.hlUpdate && st.shifted !== undefined && st.i !== undefined && (
                          <svg className="absolute inset-0 w-full h-full z-0 overflow-visible pointer-events-none hidden md:block">
                              {/* Draw an arc ONLY if they are likely on the same row (simple assumption for visualizer) */}
                              {(() => {
                                  // This is a simplified coordinate mapping assuming a single flex row. 
                                  // On small screens wrapping might break the arc visual, so we hide it on mobile.
                                  const startX = (st.shifted * TOTAL_CELL_WIDTH) + (CELL_WIDTH / 2);
                                  const endX = (st.i * TOTAL_CELL_WIDTH) + (CELL_WIDTH / 2);
                                  // Arc goes up and over
                                  const midX = (startX + endX) / 2;
                                  const topY = -40; // arch height
                                  
                                  const pathD = `M ${startX},0 Q ${midX},${topY} ${endX},0`;
                                  
                                  return (
                                      <>
                                          <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite] opacity-60" />
                                          <polygon points={`${endX-5},-5 ${endX+5},-5 ${endX},0`} fill="#38bdf8" className="opacity-80"/>
                                      </>
                                  );
                              })()}
                          </svg>
                      )}

                      <div className="flex flex-wrap justify-center gap-2 relative z-10 w-full">
                          {st.ans.map((val: number, idx: number) => {
                              let isTarget = st.hlUpdate && st.i === idx;
                              let isSource = st.hlUpdate && st.shifted === idx;
                              let isDimmed = !st.isSuccess && st.i !== undefined && idx > st.i;
                              
                              let bgClass = "bg-white";
                              let borderClass = "border-slate-300";
                              let textClass = "text-slate-700";

                              if (isTarget) {
                                  bgClass = "bg-indigo-50";
                                  borderClass = "border-indigo-400 ring-4 ring-indigo-200";
                                  textClass = "text-indigo-800";
                              } else if (isSource) {
                                  bgClass = "bg-emerald-50";
                                  borderClass = "border-emerald-400 ring-4 ring-emerald-200";
                                  textClass = "text-emerald-800";
                              }

                              if (isDimmed) {
                                  bgClass = "bg-slate-50";
                                  borderClass = "border-slate-200 border-dashed";
                                  textClass = "text-slate-400";
                                  val = 0; // Hide future values conceptually
                              }

                              return (
                                  <div key={`ans-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500 ${isTarget ? 'scale-110 z-20' : 'scale-100 z-10'}`}>
                                      <span className={`font-mono text-[9px] font-black tracking-widest ${isSource ? 'text-emerald-600' : (isTarget ? 'text-indigo-600' : 'text-slate-400')}`}>i={idx}</span>
                                      <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} ${borderClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-xl ${textClass}`}>
                                              {isDimmed ? '' : val}
                                          </span>
                                      </div>
                                      {isSource && <span className="absolute -bottom-6 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1 rounded whitespace-nowrap">source</span>}
                                      {isTarget && <span className="absolute -bottom-6 text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1 rounded whitespace-nowrap">target</span>}
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* Live Bitwise Operation Visualizer */}
              {st.hlUpdate && st.i !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500 mt-8">
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl w-full flex flex-col gap-6 relative overflow-hidden">
                          {/* Top Tag */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
                          
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Binary size={14}/> Bitwise State Engine</span>
                              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Evaluating i = {st.i}</span>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4 justify-between">
                              
                              {/* Original Binary */}
                              <div className="flex flex-col items-center gap-2 flex-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Target (i)</span>
                                  <div className="flex font-mono text-2xl font-black shadow-inner border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                      {/* High bits */}
                                      <span className="px-3 py-2 text-slate-700 tracking-[0.2em]">{toBinary(st.i).slice(0, -1)}</span>
                                      {/* LSB Highlight */}
                                      <span className={`px-3 py-2 border-l border-slate-200 tracking-widest transition-colors ${st.lsb === 1 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-400'}`}>{st.lsb}</span>
                                  </div>
                                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">Decimal: {st.i} <ArrowRight size={10}/> LSB = <span className={`font-bold ${st.lsb === 1 ? 'text-amber-600' : ''}`}>{st.lsb}</span></span>
                              </div>

                              <FastForward size={32} className="text-slate-300 hidden md:block" strokeWidth={1}/>

                              {/* Shifted Binary */}
                              <div className="flex flex-col items-center gap-2 flex-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Source (i &gt;&gt; 1)</span>
                                  <div className="flex font-mono text-2xl font-black shadow-inner border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50">
                                      {/* Shifted high bits, padded left with 0 */}
                                      <span className="px-3 py-2 text-emerald-700 tracking-[0.2em] border-r border-emerald-200 opacity-40">0</span>
                                      <span className="px-3 py-2 text-emerald-700 tracking-[0.2em]">{toBinary(st.i).slice(0, -1)}</span>
                                  </div>
                                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">Decimal: {st.shifted}</span>
                              </div>

                          </div>

                          <div className="mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center">
                              <span className="font-mono text-sm md:text-base text-slate-700">
                                  ans[{st.i}] = ans[{st.shifted}] <span className="text-emerald-600 font-black">({st.prevBits})</span> + (LSB: <span className="text-amber-600 font-black">{st.lsb}</span>) = <span className="text-indigo-600 font-black border-b-2 border-indigo-500">{st.newBits}</span>
                              </span>
                          </div>

                      </div>
                  </div>
              )}

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                <Binary className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Counting Bits</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'indigo' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      O(N) Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 338</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`}><Binary size={28}/> Binary Representation Counting</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given an integer <code>n</code>, return an array <code>ans</code> of length <code>n + 1</code> such that for each <code>i</code> (<code>0 &lt;= i &lt;= n</code>), <code>ans[i]</code> is the <strong>number of 1's</strong> in the binary representation of <code>i</code>.<br/><br/>
                      It is very easy to come up with a solution with a runtime of <code>O(n log n)</code>. Can you do it in linear time <code>O(n)</code> and possibly in a single pass?
                    </div>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: n = 5</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [0, 1, 1, 2, 1, 2]
                       </span>
                       <span className="text-slate-500 block mt-3 text-xs italic">
                           Explanation:<br/>
                           0 --&gt; 0<br/>
                           1 --&gt; 1<br/>
                           2 --&gt; 10<br/>
                           3 --&gt; 11<br/>
                           4 --&gt; 100<br/>
                           5 --&gt; 101
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The naive approach is to use a built-in bit counter (like <code>Integer.bitCount(i)</code>) or loop through the bits of every number using <code>while(n &gt; 0) n &amp;= n-1;</code>. However, counting bits for a single number takes time proportional to the number of bits (log N). Doing this for N numbers results in an O(N log N) algorithm.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-indigo-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Use <strong>Dynamic Programming</strong>. We build the array iteratively. Notice that shifting a binary number right by 1 (<code>i &gt;&gt; 1</code>) simply removes the last bit. We already know how many 1s are in the shifted number! So, the total 1s in <code>i</code> is just the 1s in <code>i &gt;&gt; 1</code> PLUS the chopped off last bit (<code>i &amp; 1</code>).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white border-${themeColor}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${themeColor}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> CountingBits.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input N (Max 16)</label>
                            <input type="number" min="0" max="16" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold uppercase`} placeholder="8" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> D.P. COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated array of bits.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdate ? 'text-amber-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> Dynamic Programming State</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Bitwise DP Transitions.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Binary size={24} className="text-indigo-500"/> 1. The Core Bitwise Insight</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In binary, shifting a number to the right by 1 (<code>i &gt;&gt; 1</code>) divides it by 2 and effectively chops off the rightmost bit.</p>
                        <p className="text-slate-600 leading-relaxed">Because we calculate numbers sequentially from 0 to N, by the time we need to calculate the bits for <code>i</code>, we have <strong>already</strong> calculated the bits for <code>i &gt;&gt; 1</code>. Thus, the total bits in <code>i</code> is strictly the known bits in the shifted prefix plus the bits contained in the single chopped-off bit (which is <code>i &amp; 1</code>).</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(N)</h4>
                        <p className="mb-4 text-slate-600">The DP approach guarantees linear time.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Loop Iterations:</strong> We loop exactly N times, from 1 to N.</li>
                            <li><strong>Work Per Iteration:</strong> Inside the loop, we perform two bitwise operations (shift and AND) and one array lookup. These are hardware-level O(1) operations.</li>
                            <li><strong>Versus Naive:</strong> The naive method runs a <code>while</code> loop inside the <code>for</code> loop to count bits for each number, yielding O(N log N) time. The DP method is strictly O(N).</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total Time Complexity = O(N)
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(N)</h4>
                        <p className="mb-4 text-slate-600">Memory usage is dedicated entirely to the required output array.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Output Array: O(N)</strong>
                                <span className="text-sm text-slate-600">The problem mandates returning an array of size N+1.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(1)</strong>
                                <span className="text-sm text-slate-600">Outside of the mandatory return array, we only use a loop counter variable. Thus, auxiliary space is O(1).</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Counting Bits is a classic test of your knowledge of Bitwise operators and how to combine them with Dynamic Programming state transitions."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Explain how <code>i &amp; 1</code> works."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The bitwise AND operator (<code>&amp;</code>) compares the bits of two numbers. The number <code>1</code> in binary is all zeros except for the rightmost bit (the Least Significant Bit). Therefore, <code>i &amp; 1</code> essentially masks out all other bits of <code>i</code>.</p>
                            <p>If <code>i</code> is odd, its LSB is 1, so <code>i &amp; 1</code> evaluates to 1. If <code>i</code> is even, its LSB is 0, so <code>i &amp; 1</code> evaluates to 0. It perfectly represents the bit that is lost when we do <code>i &gt;&gt; 1</code>."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Is there another O(N) DP approach that doesn't use the right-shift?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can use the 'Clear Lowest Set Bit' trick: <code>i &amp; (i - 1)</code>.</p>
                            <p>The operation <code>i &amp; (i - 1)</code> flips the lowest 1-bit in <code>i</code> to a 0. Because we are iterating upwards, the number <code>i &amp; (i - 1)</code> is strictly less than <code>i</code> and therefore its bit count is already computed in the DP array.</p>
                            <p>The DP transition becomes: <code>ans[i] = ans[i &amp; (i - 1)] + 1</code>. This is equally efficient and mathematically beautiful."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Why is <code>ans[0]</code> automatically 0? Did you forget to initialize it?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "In Java (and many other languages like C# or Go), when an integer array is instantiated (<code>new int[n + 1]</code>), all elements are default-initialized to 0 by the runtime.</p>
                            <p>Since the binary representation of 0 contains zero 1-bits, <code>ans[0] = 0</code> is factually correct. Relying on this default initialization allows us to start the DP loop cleanly from <code>i = 1</code> without explicit manual setup."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-indigo-600 shadow-indigo-900/50`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdate ? 'text-amber-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input N (Max 16)</label>
                              <input type="number" min="0" max="16" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold uppercase`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.3)]`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">DP Array Populated</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Array</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed break-all">[{st.finalAns.join(', ')}]</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}
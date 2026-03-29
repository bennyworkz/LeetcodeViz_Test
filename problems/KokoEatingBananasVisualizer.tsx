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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  binarySearchAnswer: {
    id: 'binarySearchAnswer',
    title: '1. Binary Search on Answer',
    icon: <Target size={16} />,
    complexity: 'Time: O(N log M) | Space: O(1)',
    theme: 'amber',
    code: `public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 1;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        int hours = 0;
        
        for (int pile : piles) {
            hours += Math.ceil((double) pile / mid);
        }
        
        if (hours <= h) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
    desc: "The Optimal Approach: Binary Search on the Search Space of Answers. We know Koko's minimum possible eating speed is 1, and her maximum sensible speed is the size of the largest pile (since she can't eat more than one pile an hour anyway). We binary search this range. For a guessed speed 'mid', we iterate through all piles and calculate the total hours needed using ceiling division. If the total hours is <= the deadline 'h', Koko is fast enough! We try to find an even slower valid speed by moving 'right = mid'. If she takes too long, she is too slow, so we must increase her speed: 'left = mid + 1'."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'amber' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|minEatingSpeed|piles|h|pile|left|right|mid|hours|Math|max|ceil)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'break'].includes(part);
            const isObject = ['String', 'Math'].includes(part);
            const isPointer = ['piles', 'h', 'pile', 'left', 'right', 'mid', 'hours'].includes(part);
            const isMapCall = ['minEatingSpeed', 'max', 'ceil'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
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

export default function KokoEatingBananasVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('binarySearchAnswer');
  
  const [pilesInput, setPilesInput] = useState('3, 6, 7, 11');
  const [hInput, setHInput] = useState('8');
  
  const [basePiles, setBasePiles] = useState<number[]>([3, 6, 7, 11]);
  const [baseH, setBaseH] = useState<number>(8);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsedPiles = pilesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
      
      if (parsedPiles.length === 0) parsedPiles = [3, 6, 7, 11];
      if (parsedPiles.length > 8) parsedPiles = parsedPiles.slice(0, 8); // UI bounds limitation
      
      // Limit max pile value purely for reasonable visualization scale in the UI grid
      parsedPiles = parsedPiles.map(p => p > 40 ? 40 : p);

      let parsedH = parseInt(hInput.trim(), 10);
      if (isNaN(parsedH) || parsedH < parsedPiles.length) parsedH = parsedPiles.length; // h must be >= piles.length
      if (parsedH > 100) parsedH = 100;

      setBasePiles(parsedPiles);
      setBaseH(parsedH);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [pilesInput, hInput, selectedOpId]);

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
    const piles = [...basePiles];
    const h = baseH;

    // Hoist variables so the closure captures their latest values persistently
    let left: number | undefined = undefined;
    let right: number | undefined = undefined;
    let mid: number | undefined = undefined;
    let hours: number | undefined = undefined;
    let isValid: boolean | undefined = undefined;
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            piles, h, left, right, mid, hours, isValid, ...st 
        } 
    });

    add("Function Call", `public int minEatingSpeed(int[] piles, int h=${h})`, 1, {});

    left = 1;
    right = 1;
    add("Initialize Variables", `int left = 1;\nint right = 1;\nInitializing search boundaries.`, 3, { hlInitParams: true });

    // Inner loop for finding max pile
    for (let i = 0; i < piles.length; i++) {
        let p = piles[i];
        add("Traverse Array", `for (int pile : piles)\nExamining pile with ${p} bananas.`, 4, { hlInitLoop: true, activePileIdx: i });
        right = Math.max(right, p);
        add("Update Max Bound", `right = Math.max(right, pile);\nRight boundary updated to max(${right}, ${p}) = ${right}.`, 5, { maxPile: right, hlInitLoopUpdate: true, activePileIdx: i });
    }

    while (left < right) {
        if (steps.length > 2500) break; // Safety net for massive iterations

        add("Binary Search Loop", `while (left < right)\nSearch space is valid (${left} < ${right}).`, 8, { hlWhile: true });

        mid = left + Math.floor((right - left) / 2);
        add("Guess Speed (Mid)", `int mid = left + (right - left) / 2;\nGuessing eating speed mid = ${mid} bananas/hour.`, 9, { hlMid: true });

        hours = 0;
        let pileHoursArr: number[] = [];
        
        add("Initialize Hours", `int hours = 0;\nPreparing to sum up the required hours for speed ${mid}.`, 10, { pileHoursArr, hlEvalInit: true });

        for (let i = 0; i < piles.length; i++) {
            let p = piles[i];
            add("Check Pile", `for (int pile : piles)\nAt speed ${mid}, looking at pile with ${p} bananas.`, 12, { pileHoursArr, hlEvalLoop: true, activePileIdx: i });
            
            let hForPile = Math.ceil(p / mid);
            hours += hForPile;
            pileHoursArr.push(hForPile);
            
            add("Calculate Hours for Pile", `hours += Math.ceil((double) pile / mid);\n${p} bananas @ ${mid}/hr takes ${hForPile} hours. Total hours so far: ${hours}.`, 13, { pileHoursArr, hlEvalCalc: true, activePileIdx: i });
        }

        isValid = hours <= h;
        add("Check Deadline", `if (hours <= h)\nDoes total time (${hours} hours) fit within deadline ${h}? (${isValid ? 'Yes' : 'No'})`, 16, { pileHoursArr, hlCheck: true });

        if (isValid) {
            let oldRight = right;
            right = mid;
            add("Speed is Sufficient (Search Slower)", `right = mid;\nSpeed ${mid} works! But can she eat slower? We discard faster speeds by moving 'right' from ${oldRight} to ${right}.`, 17, { pileHoursArr, hlMoveRight: true, oldRight });
        } else {
            let oldLeft = left;
            left = mid + 1;
            add("Speed is Too Slow (Search Faster)", `left = mid + 1;\nSpeed ${mid} failed (took ${hours} hrs > ${h} deadline). She must eat faster. We discard slower speeds by moving 'left' from ${oldLeft} to ${left}.`, 19, { pileHoursArr, hlMoveLeft: true, oldLeft });
        }
    }

    add("Loop Exit", `while (left < right)\nThe pointers have converged (${left} == ${right}). The optimal minimum speed is isolated.`, 8, { hlWhileEnd: true });
    
    add("Return Result", `return left;\nReturning optimal speed ${left} bananas/hour.`, 22, { isSuccess: true, finalAns: left });

    return steps;
  }, [basePiles, baseH, selectedOpId]);

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

  const renderVisuals = () => {
      if (st.piles === undefined) return <span className="text-slate-400 italic">empty</span>;

      const maxPileVal = Math.max(...st.piles);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: The Banana Piles */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><ListOrdered size={12}/> Banana Piles Array</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative z-10 w-full max-w-4xl px-4 items-end min-h-[140px] pb-4 border-b-2 border-slate-200">
                      {st.piles.map((val: number, idx: number) => {
                          let isActivePile = st.activePileIdx === idx;
                          
                          let bgClass = "bg-white border-slate-300";
                          let textClass = "text-slate-700";
                          
                          if (st.hlEvalCalc || st.hlEvalLoop || st.hlInitLoop || st.hlInitLoopUpdate) {
                              if (isActivePile) {
                                  bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-110 z-20 shadow-lg";
                                  textClass = "text-amber-900";
                              } else if (st.activePileIdx !== undefined && idx < st.activePileIdx) {
                                  bgClass = "bg-slate-100 border-slate-300 opacity-60"; // Processed
                                  textClass = "text-slate-500";
                              }
                          } else if (st.hlCheck || st.hlMoveLeft || st.hlMoveRight) {
                              // All evaluated
                              bgClass = "bg-sky-50 border-sky-300";
                              textClass = "text-sky-800";
                          }

                          // Calculate visual height
                          let heightPct = Math.max(15, (val / maxPileVal) * 100);

                          return (
                              <div key={`pile-${idx}`} className={`relative transition-all duration-500 flex flex-col items-center gap-2 justify-end h-full`}>
                                  
                                  {isActivePile && (
                                      <div className="absolute -top-10 flex flex-col items-center animate-bounce z-40 text-amber-600">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm">curr pile</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}

                                  <div className={`w-8 md:w-12 rounded-t-md transition-all duration-500 bg-amber-300`} style={{ height: `${heightPct}px` }}></div>

                                  <div className={`w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-xl ${textClass}`}>
                                          {val}
                                      </span>
                                  </div>
                                  
                                  {/* Evaluation Breakdown per pile */}
                                  {st.pileHoursArr && idx < st.pileHoursArr.length && (
                                      <div className="absolute -bottom-8 flex items-center justify-center gap-1 bg-sky-50 border border-sky-200 text-sky-600 font-mono text-[10px] font-black px-2 py-1 rounded shadow-sm animate-in fade-in slide-in-from-top-2">
                                          <span>{st.pileHoursArr[idx]}</span><Clock size={10}/>
                                      </div>
                                  )}
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-6 pointer-events-auto">
                  <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheck ? (st.isValid ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-rose-300 ring-4 ring-rose-100') : 'border-slate-200'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Calculator size={14}/> Active Calculation Dashboard</span>
                      
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono">
                          
                          {/* Guessed Speed */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Target size={12}/> Guessed Speed (mid)</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlMid ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                                  {st.mid !== undefined ? st.mid : '?'}
                                  <span className="text-xs ml-1 opacity-50">/hr</span>
                              </div>
                          </div>
                          
                          <ArrowRight size={24} className="text-slate-300" />
                          
                          {/* Total Hours Computed */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><Clock size={12}/> Total Time Required</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${(st.hlEvalCalc || st.hlEvalInit || st.hlCheck || st.hlMoveLeft || st.hlMoveRight) ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                                  {st.hours !== undefined ? st.hours : '?'}
                                  <span className="text-xs ml-1 opacity-50">hrs</span>
                              </div>
                          </div>

                          {/* Comparison to Deadline */}
                          <div className="flex flex-col items-center border-l-2 border-slate-100 pl-4 md:pl-8 min-w-[150px]">
                              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">&le; Deadline (H)</span>
                              <div className="flex flex-col items-center gap-2">
                                  <span className="bg-slate-800 text-white text-3xl font-black px-6 py-2 rounded-xl w-full text-center">
                                      {st.h}
                                  </span>
                                  {st.isValid !== undefined && (
                                      <span className={`text-xs font-black uppercase px-2 py-1 w-full text-center rounded ${st.isValid ? 'text-emerald-700 bg-emerald-100 border border-emerald-300' : 'text-rose-700 bg-rose-100 border border-rose-300'}`}>
                                          {st.isValid ? 'Sufficient' : 'Too Slow'}
                                      </span>
                                  )}
                              </div>
                          </div>

                      </div>
                  </div>
              </div>

              {/* Bottom: Search Space Number Line */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><ArrowLeftRight size={12}/> Speed Search Space (Binary Search)</span>
                  
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 relative z-10 w-full max-w-6xl px-2">
                      {/* Render up to maxPile elements if small enough, otherwise scale it. Max UI constraint is 40. */}
                      {Array.from({ length: st.maxPile || 0 }, (_, i) => i + 1).map((val: number) => {
                          let isMid = st.mid === val;
                          let isLeft = st.left === val;
                          let isRight = st.right === val;
                          
                          let outOfBounds = st.left !== undefined && st.right !== undefined && (val < st.left || val > st.right);
                          let isFinalAns = st.isSuccess && val === st.finalAns;
                          
                          let bgClass = "bg-white border-slate-300";
                          let textClass = "text-slate-700";

                          if (isFinalAns) {
                              bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 z-30 scale-125 shadow-xl";
                              textClass = "text-emerald-900";
                          } else if (outOfBounds) {
                              bgClass = "bg-slate-100 border-slate-200 opacity-20 scale-90";
                              textClass = "text-slate-400";
                          } else if (isMid) {
                              bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 z-20 scale-110 shadow-lg";
                              textClass = "text-amber-900";
                          } else if (isLeft || isRight) {
                              bgClass = "bg-indigo-50 border-indigo-400 z-10";
                              textClass = "text-indigo-800";
                          }

                          return (
                              <div key={`space-${val}`} className={`relative transition-all duration-500 flex flex-col items-center`}>
                                  
                                  {isMid && !isFinalAns && (
                                      <div className="absolute -top-6 text-amber-500 flex flex-col items-center animate-bounce z-40">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm">mid</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}

                                  <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 rounded-lg shadow-sm ${bgClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-sm md:text-base ${textClass}`}>
                                          {val}
                                      </span>
                                  </div>

                                  <div className="h-6 w-full flex justify-center items-start pt-1 relative z-40">
                                      {isLeft && !outOfBounds && <span className="absolute top-0 text-[8px] font-black text-indigo-500 bg-indigo-50 border border-indigo-200 px-1 rounded shadow-sm z-40">L</span>}
                                      {isRight && !outOfBounds && <span className="absolute top-0 text-[8px] font-black text-indigo-500 bg-indigo-50 border border-indigo-200 px-1 rounded shadow-sm z-40">R</span>}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Koko Eating Bananas</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search (Answer)
                  </span>
                  <span>•</span>
                  <span>LeetCode 875</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Clock size={28}/> Beat the Clock</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>ith</code> pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours.</p>
                        <p>Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour.</p>
                        <p className="font-bold mt-4">Return the minimum integer <code>k</code> such that she can eat all the bananas within <code>h</code> hours.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> piles = [3,6,7,11], h = 8</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">4</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">At speed 4 bananas/hour:<br/>Pile 3: 1 hr. Pile 6: 2 hrs. Pile 7: 2 hrs. Pile 11: 3 hrs.<br/>Total: 1 + 2 + 2 + 3 = 8 hours. (Exactly fits!)</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= piles.length &lt;= 10^4</li>
                            <li>piles.length &lt;= h &lt;= 10^9</li>
                            <li>1 &lt;= piles[i] &lt;= 10^9</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The search space for the eating speed is immense (from 1 to 10^9). A brute force approach testing every speed sequentially starting from 1 will easily cause a Time Limit Exceeded error. We must find the optimal speed in sub-linear time relative to the maximum pile size.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Binary Search on the Answer</strong>. The possible speeds form a naturally sorted array <code>[1, 2, 3 ... max(piles)]</code>. Because eating speeds map monotonically to total hours (faster speed = fewer hours), we can binary search this range! If a speed is fast enough, try slower (search left). If it's too slow, eat faster (search right).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Piles Array (Max 8 piles, Val &le; 40)</label>
                            <input type="text" value={pilesInput} onChange={(e) => setPilesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 6, 7, 11" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Deadline (H)</label>
                            <input type="number" min="1" max="100" value={hInput} onChange={(e) => setHInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="8" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> OPTIMAL SPEED FOUND</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Koko must eat at least {st.finalAns} bananas per hour.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlEvalCalc || st.hlCheck ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">left</span>
                                    <span className="font-mono font-black text-sky-400">{st.left !== undefined ? st.left : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">mid</span>
                                    <span className="font-mono font-black text-amber-400">{st.mid !== undefined ? st.mid : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">right</span>
                                    <span className="font-mono font-black text-rose-400">{st.right !== undefined ? st.right : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">hours</span>
                                    <span className="font-mono font-black text-fuchsia-400">{st.hours !== undefined ? st.hours : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">target (h)</span>
                                    <span className="font-mono font-black text-emerald-400">{st.h !== undefined ? st.h : '-'}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Speed Search Render</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the 'Binary Search on Answer' paradigm.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Target size={24} className="text-amber-500"/> 1. Binary Searching the "Answer Space"</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike standard binary search where we search through an explicit array of elements, here we are searching through a <strong>range of possible answers</strong>. We don't have an array from 1 to 10^9 in memory, but we know the optimal speed must lie mathematically between 1 and the maximum pile size.</p>
                        <p className="text-slate-600 leading-relaxed">Because the relationship is monotonic—the faster Koko eats, the less time it takes—we can binary search. If speed X works, every speed &gt; X is guaranteed to work too. Our goal is simply to find the leftmost boundary where the condition transitions from FALSE (too slow) to TRUE (fast enough).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Calculator size={24} className="text-sky-500"/> 2. The Ceiling Calculation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To calculate how many hours a pile takes at a given speed, we must round up. If a pile has 7 bananas and speed is 3, Koko takes 3+3+1 &rarr; 3 hours.</p>
                        <p className="text-slate-600 leading-relaxed">In Java, <code>Math.ceil((double) pile / speed)</code> handles this. A common integer-math optimization to avoid floating-point casts is <code>(pile + speed - 1) / speed</code>. This directly simulates ceiling division using purely integers, which is slightly faster and avoids floating-point inaccuracies on enormous numbers.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N log M).</strong> The search space size is M (where M is the maximum pile size). We halve this space log M times. In every halving step, we iterate through the entire array of N piles to verify the speed. Therefore, total time is N * log2(max(piles)).</li>
                            <li><strong>Space Complexity: O(1).</strong> We only use integer variables for pointers and the hour accumulator. No extra memory structures are required.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem is famous for introducing candidates to 'Binary Search on Answer'. Ensure you can clearly explain the monotonic property that makes binary searching viable."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we update <code>right = mid</code> instead of <code>right = mid - 1</code> when the speed is sufficient?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If Koko can eat all the bananas at speed <code>mid</code>, it is a <em>valid candidate</em> for the answer. However, we want the <em>minimum</em> speed.</p>
                            <p>If we did <code>right = mid - 1</code>, we would discard <code>mid</code> from our search space. If <code>mid</code> was actually the absolute minimum possible speed, we just threw away the correct answer! By setting <code>right = mid</code>, we shrink the search space to look for slower speeds, while safely keeping our currently known best valid speed inside the boundaries."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "Can the <code>hours</code> variable overflow an integer?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely! This is a very common hidden edge case.</p>
                            <p>If <code>mid</code> is 1, and the array has 10,000 piles each containing 10^9 bananas, the total hours required would be 10^13. This severely overflows a 32-bit signed integer (which maxes at ~ 2 * 10^9). To make this production-ready, the <code>hours</code> accumulator variable should ideally be typed as a <code>long</code> (64-bit integer) to prevent silent overflow bugs."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Clock size={24}/></span>
                            <span>Q3: "What if <code>h</code> is exactly equal to the length of the <code>piles</code> array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because Koko can only eat from one pile per hour, the absolute minimum time she can spend is N hours (1 hour per pile), regardless of her speed.</p>
                            <p>If <code>h == piles.length</code>, she must eat an entire pile every single hour without fail. Therefore, her speed must be at least as fast as the largest pile. In this specific scenario, the optimal answer is guaranteed to be <code>max(piles)</code>."</p>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              <Target size={20}/>
                          </div>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlEvalCalc || st.hlCheck ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-[10px] uppercase font-bold text-slate-400">left</span>
                                <span className="font-mono font-black text-sky-400">{st.left !== undefined ? st.left : '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-[10px] uppercase font-bold text-slate-400">mid</span>
                                <span className="font-mono font-black text-amber-400">{st.mid !== undefined ? st.mid : '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-[10px] uppercase font-bold text-slate-400">right</span>
                                <span className="font-mono font-black text-rose-400">{st.right !== undefined ? st.right : '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-[10px] uppercase font-bold text-slate-400">hours</span>
                                <span className="font-mono font-black text-fuchsia-400">{st.hours !== undefined ? st.hours : '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-[10px] uppercase font-bold text-slate-400">target (h)</span>
                                <span className="font-mono font-black text-emerald-400">{st.h !== undefined ? st.h : '-'}</span>
                            </div>
                        </div>

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
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Piles Array</label>
                              <input type="text" value={pilesInput} onChange={(e) => setPilesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 6, 7, 11" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Deadline (H)</label>
                              <input type="number" min="1" max="100" value={hInput} onChange={(e) => setHInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="8" />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">OPTIMAL SPEED FOUND</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Koko's Minimum Speed</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns} <span className="text-xl text-slate-400">/hr</span></div>
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
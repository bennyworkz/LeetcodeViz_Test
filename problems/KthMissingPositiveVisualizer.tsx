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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  binarySearchMissing: {
    id: 'binarySearchMissing',
    title: '1. Binary Search (Missing Count)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    theme: 'violet',
    code: `public int findKthPositive(int[] arr, int k) {
    int left = 0;
    int right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int missing = arr[mid] - (mid + 1);
        if (missing < k) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left + k;
}`,
    desc: "The Optimal Approach: Binary Search. Since the array is strictly increasing, the number of missing positive integers strictly before index 'i' is exactly 'arr[i] - (i + 1)'. Because the array is sorted, this 'missing count' monotonically increases. We can use Binary Search to find the first index where the missing count is >= k. If 'missing < k', the answer must be to the right, so we search right (left = mid + 1). Otherwise, we search left (right = mid - 1). After the loop converges, 'left' points to the first index where missing >= k. The exact k-th missing number is simply 'left + k'."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|findKthPositive|arr|k|missing|left|right|mid|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['arr', 'k', 'missing', 'left', 'right', 'mid'].includes(part);
            const isMapCall = ['findKthPositive', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
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

export default function KthMissingPositiveVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('binarySearchMissing');
  
  const [arrInput, setArrInput] = useState('2, 3, 4, 7, 11');
  const [kInput, setKInput] = useState('5');
  
  const [baseArr, setBaseArr] = useState<number[]>([2, 3, 4, 7, 11]);
  const [baseK, setBaseK] = useState<number>(5);

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
      // Parse, positive filter, and sort uniquely to ensure strict increasing array
      let rawArr = Array.from(new Set(arrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0))).sort((a,b) => a - b);
      
      if (rawArr.length === 0) rawArr = [2, 3, 4, 7, 11];
      if (rawArr.length > 12) rawArr = rawArr.slice(0, 12); // UI bounds limitation

      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 5;
      if (parsedK > 1000) parsedK = 1000;

      setBaseArr(rawArr);
      setBaseK(parsedK);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [arrInput, kInput, selectedOpId]);

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
    const arr = [...baseArr];
    const k = baseK;
    const n = arr.length;

    // Hoist variables so the closure captures their latest values persistently
    let left: number | undefined = undefined;
    let right: number | undefined = undefined;
    let mid: number | undefined = undefined;
    let missing: number | undefined = undefined;
    let isMissingLessThanK: boolean | undefined = undefined;
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            arr, k, left, right, mid, missing, isMissingLessThanK, ...st 
        } 
    });

    add("Function Call", `public int findKthPositive(int[] arr, int k=${k})`, 1, {});

    left = 0;
    add("Initialize Left", `int left = 0;\nSetting left boundary to index 0.`, 2, { hlInit: true });
    
    right = n - 1;
    add("Initialize Right", `int right = arr.length - 1;\nSetting right boundary to index ${right}.`, 3, { hlInit: true });

    while ((left ?? 0) <= (right ?? 0)) {
        if (steps.length > 200) break; // Safety net

        add("Binary Search Loop", `while (left <= right)\nSearch space is valid (${left} <= ${right}).`, 4, { hlWhile: true });

        mid = (left ?? 0) + Math.floor(((right ?? 0) - (left ?? 0)) / 2);
        add("Calculate Midpoint", `int mid = left + (right - left) / 2;\nCalculated mid index is ${mid}.`, 5, { hlMid: true });

        missing = arr[mid] - (mid + 1);
        add("Calculate Missing", `int missing = arr[mid] - (mid + 1);\narr[${mid}] is ${arr[mid]}. Should be ${mid + 1} if no numbers were missing. Thus, ${arr[mid]} - ${mid + 1} = ${missing} numbers are missing strictly before index ${mid}.`, 6, { hlMissing: true });

        isMissingLessThanK = missing < k;
        add("Check Missing Count", `if (missing < k)\nIs ${missing} < ${k}? (${isMissingLessThanK ? 'Yes' : 'No'})`, 7, { hlCheck: true });

        if (isMissingLessThanK) {
            let oldLeft = left;
            left = mid + 1;
            add("Search Right", `left = mid + 1;\nMissing count (${missing}) is strictly less than ${k}. The k-th missing number must be to the right of mid. Setting left = ${left}.`, 8, { hlMoveLeft: true, oldLeft });
        } else {
            let oldRight = right;
            right = mid - 1;
            add("Search Left", `right = mid - 1;\nMissing count (${missing}) is >= ${k}. The k-th missing number must be to the left of mid (or is before mid). Setting right = ${right}.`, 10, { hlMoveRight: true, oldRight });
        }
    }

    add("Loop Exit", `while (left <= right)\nThe pointers have crossed (${left} > ${right}). The loop terminates.`, 4, { hlWhileEnd: true });
    
    let finalAns = (left ?? 0) + k;
    add("Return Result", `return left + k;\nLeft pointer is ${left}. Thus, the ${k}-th missing number is ${left} + ${k} = ${finalAns}.`, 13, { isSuccess: true, finalAns });

    return steps;
  }, [baseArr, baseK, selectedOpId]);

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

  const renderActiveDashboard = () => {
      if (st.arr === undefined) return null;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheck ? (st.isMissingLessThanK ? 'border-sky-300 ring-4 ring-sky-100' : 'border-rose-300 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Calculator size={14}/> Missing Elements Calculation</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono w-full min-h-[80px]">
                  
                  {st.mid !== undefined ? (
                      <>
                          {/* Element at Mid */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">arr[mid]</span>
                              <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-700`}>
                                  {st.arr[st.mid]}
                              </div>
                          </div>
                          
                          <Minus size={20} className="text-slate-300" />
                          
                          {/* Expected Value if Not Missing */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">(mid + 1)</span>
                              <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-700`}>
                                  {(st.mid + 1)}
                              </div>
                          </div>

                          <span className="font-black text-2xl text-slate-300">=</span>

                          {/* Missing Count */}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-violet-500 mb-1 flex items-center gap-1">Missing Count</span>
                              <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${(st.hlMissing || st.hlCheck || st.hlMoveLeft || st.hlMoveRight) ? 'bg-violet-100 border-violet-500 text-violet-800 scale-110 shadow-lg' : 'bg-violet-50 border-violet-200 text-violet-800'}`}>
                                  {st.missing !== undefined ? st.missing : '?'}
                              </div>
                          </div>

                          {/* Comparison to k */}
                          <div className="flex flex-col items-center border-l-2 border-slate-100 pl-4 md:pl-8 min-w-[150px]">
                              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">&lt; Target (k)</span>
                              <div className="flex flex-col items-center gap-2">
                                  <span className="bg-slate-800 text-white text-2xl font-black px-6 py-2 rounded-xl w-full text-center">
                                      {st.k}
                                  </span>
                                  {st.isMissingLessThanK !== undefined && (
                                      <span className={`text-xs font-black uppercase px-2 py-1 w-full text-center rounded ${st.isMissingLessThanK ? 'text-sky-700 bg-sky-100 border border-sky-300' : 'text-rose-700 bg-rose-100 border border-rose-300'}`}>
                                          {st.isMissingLessThanK ? 'Less (<)' : 'Greater (\u2265)'}
                                      </span>
                                  )}
                              </div>
                          </div>
                      </>
                  ) : (
                      <span className="text-slate-300 italic text-sm py-4">Waiting for 'mid' calculation...</span>
                  )}

              </div>
          </div>
      );
  };

  const renderVisuals = () => {
      if (st.arr === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 64;
      const nodeGap = 16;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.arr.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYBase = 200; // Base Y position

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Array and Pointers */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '380px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Active Search Space Bracket */}
                          {st.left !== undefined && st.right !== undefined && !st.isSuccess && (
                              <div className="absolute border-b-4 border-x-4 border-slate-400 rounded-b-2xl z-10 transition-all duration-500 opacity-60" 
                                   style={{ 
                                       left: startX + (Math.max(0, st.left ?? 0) * totalColWidth) - nodeWidth/2 - 4,
                                       width: (Math.max(0, (st.right ?? 0) - (st.left ?? 0) + 1)) * totalColWidth + 8,
                                       top: rowYBase + 30,
                                       height: 25
                                   }}
                              >
                                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded border border-slate-300">Active Search Space</span>
                              </div>
                          )}

                          {/* Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.arr.map((val: number, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isWithinBounds = idx >= (st.left ?? 0) && idx <= (st.right ?? st.arr.length);
                                  let isMid = st.mid === idx && !st.isSuccess && !st.hlInit && !st.hlWhile && !st.hlWhileEnd;
                                  let isLeft = st.left === idx && !st.isSuccess;
                                  let isRight = st.right === idx && !st.isSuccess;
                                  
                                  let missingCountBefore = val - (idx + 1);

                                  let bgClass = "bg-white border-slate-300 text-slate-400 opacity-40 border-dashed"; 
                                  let scaleClass = "scale-100";

                                  if (isMid) {
                                      bgClass = "bg-violet-100 border-violet-500 text-violet-900 shadow-xl ring-4 ring-violet-200 z-30";
                                      scaleClass = "scale-110";
                                  } else if (isLeft || isRight) {
                                      bgClass = "bg-indigo-50 border-indigo-400 text-indigo-900 shadow-lg z-20";
                                      scaleClass = "scale-105";
                                  } else if (isWithinBounds && !st.isSuccess) {
                                      bgClass = "bg-white border-slate-400 text-slate-700 shadow-sm opacity-100";
                                  }

                                  if (st.isSuccess) {
                                      if (idx === st.left) {
                                          bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl ring-4 ring-emerald-200 z-40";
                                          scaleClass = "scale-125";
                                      } else {
                                          bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 scale-95";
                                      }
                                  }

                                  return (
                                      <div key={`node-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYBase}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Missing Count Badge (Above) */}
                                          <div className={`absolute -top-12 flex flex-col items-center transition-opacity duration-300 ${isWithinBounds || st.isSuccess ? 'opacity-100' : 'opacity-40'}`}>
                                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Missing</span>
                                              <div className={`px-2 py-0.5 rounded shadow-sm border font-mono font-black text-xs ${isMid ? 'bg-violet-500 border-violet-600 text-white animate-bounce' : 'bg-white border-slate-300 text-slate-600'}`}>
                                                  {missingCountBefore}
                                              </div>
                                          </div>

                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{val}</span>
                                          </div>
                                          
                                          {/* Index Display Below */}
                                          <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold absolute top-full">idx:{idx}</span>
                                          
                                          {/* Pointer Flags Below */}
                                          {isLeft && !st.isSuccess && (
                                              <div className="absolute -bottom-16 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                  <ArrowUp size={16} className="text-sky-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-sky-700 tracking-widest bg-sky-100 px-2 py-0.5 rounded border border-sky-300 shadow-sm">Left</span>
                                              </div>
                                          )}
                                          {isRight && !st.isSuccess && (
                                              <div className="absolute -bottom-24 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                  <ArrowUp size={16} className="text-rose-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-rose-700 tracking-widest bg-rose-100 px-2 py-0.5 rounded border border-rose-300 shadow-sm">Right</span>
                                              </div>
                                          )}
                                          {st.isSuccess && idx === st.left && (
                                              <div className="absolute -bottom-20 w-[160px] flex flex-col items-center animate-bounce z-50 text-emerald-600">
                                                  <ArrowUp size={24} className="mb-1" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-lg text-center">left is {st.left}</span>
                                              </div>
                                          )}
                                      </div>
                                  )
                              })}
                          </div>

                      </div>
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
                <SearchCode className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Kth Missing Positive Number</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 1539</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><SearchCode size={28}/> Finding the Gap</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an array <code>arr</code> of positive integers sorted in a <strong>strictly increasing order</strong>, and an integer <code>k</code>.</p>
                        <p className="font-bold mt-4">Return the <code>k</code>-th positive integer that is missing from this array.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> arr = [2,3,4,7,11], k = 5</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">9</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The missing positive integers are [1,5,6,8,9,10,12,13,...]. The 5th missing positive integer is 9.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> arr = [1,2,3,4], k = 2</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">6</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">The missing positive integers are [5,6,7,...]. The 2nd missing positive integer is 6.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= arr.length &lt;= 1000</li>
                            <li>1 &lt;= arr[i] &lt;= 1000</li>
                            <li>1 &lt;= k &lt;= 1000</li>
                            <li>arr[i] &lt; arr[j] for 1 &lt;= i &lt; j &lt;= arr.length</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Target size={16} className="text-rose-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">If no numbers were missing, <code>arr[0]</code> would be 1, <code>arr[1]</code> would be 2, and <code>arr[i]</code> would exactly equal <code>i + 1</code>. Therefore, the exact number of missing positive integers strictly before index <code>i</code> is simply the difference: <code>arr[i] - (i + 1)</code>.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Binary Search Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Because the array is sorted, this "missing count" is monotonically increasing. We can use Binary Search to find the first index where the missing count is &ge; <code>k</code>. Once found, we just add <code>k</code> to the resulting index <code>left</code> to determine the exact value of the missing number.</p>
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
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array 'arr' (Strictly Increasing)</label>
                            <input type="text" value={arrInput} onChange={(e) => setArrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="2, 3, 4, 7, 11" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target (k)</label>
                            <input type="number" min="1" max="1000" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="5" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3">
                                <PartyPopper size={24}/> SEARCH COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                The {st.k}-th missing positive integer is {st.finalAns}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheck ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            {st.left !== undefined && (
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
                                        <span className="text-[10px] uppercase font-bold text-slate-400">missing (at mid)</span>
                                        <span className="font-mono font-black text-violet-400">{st.missing !== undefined ? st.missing : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">target (k)</span>
                                        <span className="font-mono font-black text-emerald-400">{st.k !== undefined ? st.k : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Dynamic Missing Count Rendering</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the Mathematical Invariant.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Target size={24} className="text-violet-500"/> 1. The Missing Formula</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If no numbers were missing, the array would be <code>[1, 2, 3, 4, 5]</code>. Notice how the value at any index <code>i</code> is exactly <code>i + 1</code>. When numbers are missing, the values get pushed higher. The exact count of missing integers strictly before index <code>i</code> is given by the formula: <code>arr[i] - (i + 1)</code>.</p>
                        <p className="text-slate-600 leading-relaxed">Since the array is strictly increasing, this "missing count" is monotonically increasing across the array. Monotonicity means we can apply Binary Search!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-sky-500"/> 2. The Search Logic</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We binary search the indices of the array to find the first index where the missing count is <code>&ge; k</code>. At any midpoint <code>mid</code>, we calculate <code>missing = arr[mid] - (mid + 1)</code>.</p>
                        <p className="text-slate-600 leading-relaxed">If <code>missing &lt; k</code>, the answer must lie to the right, so we set <code>left = mid + 1</code>. Otherwise, we set <code>right = mid - 1</code>. When the loop ends, <code>left</code> perfectly points to the first element where the missing count reached or exceeded <code>k</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. The Final Calculation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">After convergence, the number of missing integers strictly before index <code>left</code> is guaranteed to be less than <code>k</code>. To find the exact answer, we just start at the expected value if no numbers were missing (which is <code>left</code> + something) and add <code>k</code>. The math beautifully simplifies to just: <code>left + k</code>.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(log N).</strong> Standard Binary Search splitting the array indices.</li>
                            <li><strong>Space Complexity: O(1).</strong> Constant extra space.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a common array puzzle. Interviewers want to see if you can mathematically derive the missing count in O(1) time without linearly scanning the array."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-violet-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-violet-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why is the final answer simply `left + k`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's derived from the formula.</p>
                            <p>After the binary search, <code>right</code> is right before <code>left</code>. The number of missing elements before <code>left</code> is given by: <code>missing_before_left = arr[right] - (right + 1)</code>. The exact missing number is <code>arr[right] + (k - missing_before_left)</code>. If you plug in the formula, it evaluates to <code>arr[right] + k - arr[right] + right + 1</code>, which simplifies to <code>right + 1 + k</code>. And since <code>left == right + 1</code>, the formula perfectly simplifies to just <code>left + k</code>!"</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What if `k` is smaller than any missing number (e.g., array is [2,3,4] and k=1)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The code handles it naturally."</p>
                            <p>If <code>k</code> is smaller than the first missing number (which is 1), the binary search will keep setting <code>right = mid - 1</code> until <code>left</code> remains at <code>0</code> and <code>right</code> becomes <code>-1</code>. It exits the loop, and the answer returned is <code>left + k = 0 + 1 = 1</code>, which is correct."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Clock size={24}/></span>
                            <span>Q3: "Could you solve this in O(N) time without Binary Search?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, easily."</p>
                            <p>We could just iterate through the array. For every element <code>x</code>, if <code>x &le; k</code>, we increment <code>k</code> by 1. By the end of the array, the shifted <code>k</code> is the answer. However, $O(N)$ is strictly worse than $O(\log N)$ for large arrays, so the Binary Search approach is the optimal expectation."</p>
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
                              <SearchCode size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheck ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        {st.left !== undefined && (
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
                                    <span className="text-[10px] uppercase font-bold text-slate-400">missing (at mid)</span>
                                    <span className="font-mono font-black text-violet-400">{st.missing !== undefined ? st.missing : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">target (k)</span>
                                    <span className="font-mono font-black text-emerald-400">{st.k !== undefined ? st.k : '-'}</span>
                                </div>
                            </div>
                        )}

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
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>arr Array</label>
                              <input type="text" value={arrInput} onChange={(e) => setArrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="2, 3, 4, 7, 11" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target (k)</label>
                              <input type="number" min="1" max="1000" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="5" />
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
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SEARCH COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">The {st.k}-th Missing Number</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
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
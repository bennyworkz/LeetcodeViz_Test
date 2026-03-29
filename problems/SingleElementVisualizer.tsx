import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, ArrowDown, Minus,
  RefreshCw, CheckCircle2, CornerDownRight, SplitSquareHorizontal, Search
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  binarySearch: {
    id: 'binarySearch',
    title: '1. Binary Search (Pair Boundaries)',
    icon: <Search size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    theme: 'violet',
    code: `class Solution {
    public int singleNonDuplicate(int[] nums) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // We want mid to always point to the start of a pair (even index)
            if (mid % 2 == 1) {
                mid--;
            }
            
            // If the pair matches, the single element is to the right
            if (nums[mid] == nums[mid + 1]) {
                left = mid + 2;
            } else {
                // Otherwise, the disruption happened here or to the left
                right = mid;
            }
        }
        
        return nums[left];
    }
}`,
    desc: "An optimal O(log N) approach. Because every element appears exactly twice except one, the array's total length is always odd. More importantly, before the single element disrupts the pattern, every pair starts at an EVEN index and ends at an ODD index. We use Binary Search to find the disruption. We calculate `mid`, force it to be even, and check if it matches its right neighbor. If it does, the pattern is intact and the single element is strictly to the right! Otherwise, it's to the left (or is the current element)."
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
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|singleNonDuplicate|length|nums|left|right|mid)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={`code-${num}-${idx}`} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'true', 'false'].includes(part);
            const isObject = ['Solution'].includes(part);
            const isPointer = ['nums', 'left', 'right', 'mid', 'length'].includes(part);
            const isMapCall = ['singleNonDuplicate'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            return (
              <span 
                key={`code-${num}-${idx}`} 
                className={
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

export default function SingleElementVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('binarySearch');
  
  const [numsInput, setNumsInput] = useState('1, 1, 2, 3, 3, 4, 4, 8, 8');
  const [numsArr, setNumsArr] = useState<number[]>([1, 1, 2, 3, 3, 4, 4, 8, 8]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseArrayInput = (inputStr: string, fallback: number[]) => {
      let rawTokens = inputStr.split(',');
      let parsedArr: number[] = [];
      for (let token of rawTokens) {
          let t = token.trim();
          let num = parseInt(t, 10);
          if (!isNaN(num)) {
              parsedArr.push(num);
          }
      }
      // Guarantee valid array properties for simulation
      if (parsedArr.length === 0) parsedArr = fallback;
      if (parsedArr.length % 2 === 0) parsedArr.pop(); // Must be odd
      if (parsedArr.length > 21) parsedArr = parsedArr.slice(0, 21); // Cap for visualization
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNumsArr(parseArrayInput(numsInput, [1, 1, 2, 3, 3, 4, 4, 8, 8]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    
    let arr = [...numsArr];
    let n = arr.length;
    let left = 0;
    let right = n - 1;
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { arr: [...arr], left, right, ...st } 
    });

    add("Init Function", `public int singleNonDuplicate(int[] nums)`, 2, { hlPhase: 'init' });
    add("Init Pointers", `int left = 0;\nint right = nums.length - 1;\nSearch space initialized to cover the entire array.`, 4, { hlPhase: 'initPointers' });

    while (left < right) {
        if (steps.length > 1000) break; // infinite loop guard

        add("Loop Condition", `while (left < right)\nChecking if search space has narrowed to a single element. (${left} < ${right}) is TRUE.`, 6, { hlPhase: 'loop' });

        let mid = Math.floor(left + (right - left) / 2);
        let origMid = mid;
        add("Calculate Midpoint", `int mid = left + (right - left) / 2;\nCalculated midpoint index is ${mid}.`, 7, { hlPhase: 'calcMid', mid });

        let isOdd = mid % 2 === 1;
        add("Check Odd Alignment", `if (mid % 2 == 1)\nIs the midpoint index odd? (${isOdd ? 'Yes' : 'No'})`, 10, { hlPhase: 'checkOdd', mid, isOdd });

        if (isOdd) {
            mid--;
            add("Adjust Midpoint", `mid--;\nMidpoint was odd. Decrementing to ${mid} to ensure we check a proper [even, odd] pair boundary.`, 11, { hlPhase: 'adjustMid', mid, origMid });
        }

        let isMatch = arr[mid] === arr[mid + 1];
        add("Check Pair Match", `if (nums[mid] == nums[mid + 1])\nDoes nums[${mid}] (${arr[mid]}) == nums[${mid+1}] (${arr[mid+1]})? (${isMatch ? 'Yes' : 'No'})`, 15, { hlPhase: 'compare', mid, isMatch });

        if (isMatch) {
            left = mid + 2;
            add("Update Left Pointer", `left = mid + 2;\nThe pair is perfectly intact! The single element disruption MUST be strictly to the right. Adjusting left boundary to ${left}.`, 16, { hlPhase: 'updateLeft', mid, isMatch });
        } else {
            right = mid;
            add("Update Right Pointer", `right = mid;\nThe pair is broken! The disruption happened exactly here or somewhere to the left. Adjusting right boundary to ${right}.`, 19, { hlPhase: 'updateRight', mid, isMatch });
        }
    }

    add("Loop Terminated", `while (left < right)\n${left} < ${right} is FALSE. The search space has collapsed to one element!`, 6, { hlPhase: 'loopExit' });
    add("Success", `return nums[left];\nFound the single element: ${arr[left]}!`, 23, { hlPhase: 'success', isSuccess: true, finalAns: arr[left] });

    return steps;
  }, [numsArr, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
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
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
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
      if (!st.arr || st.arr.length === 0) return null;

      let isSuccessEnd = st.hlPhase === 'success';

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-violet-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                  <Activity size={14}/> Binary Search Monitor
              </span>
              
              {isSuccessEnd ? (
                  <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                      <div className={`flex items-center gap-4 text-emerald-600 bg-emerald-50 border-emerald-300 font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                          <span>Found Single Element</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200`}>{st.finalAns}</span>
                      </div>
                  </div>
              ) : st.mid !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      
                      {/* Left Boundary */}
                      <div className="flex flex-col items-center w-[90px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'updateLeft' ? 'text-sky-600' : 'text-slate-400'}`}>Left Bound</span>
                          <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 transition-all ${st.hlPhase === 'updateLeft' ? 'bg-sky-100 border-sky-400 text-sky-900 shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.left}
                          </div>
                      </div>

                      <div className="flex flex-col items-center justify-center text-slate-400 font-black text-2xl px-1">
                          <span>&rarr;</span>
                      </div>

                      {/* Evaluated Pair */}
                      <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner animate-in zoom-in">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold uppercase text-violet-500 mb-1 flex items-center gap-1">mid {st.hlPhase === 'adjustMid' && <span className="text-rose-500 font-black">-1</span>}</span>
                              <div className={`flex items-center justify-center w-12 h-12 text-xl rounded-lg border-2 ${st.hlPhase === 'compare' ? 'bg-violet-100 border-violet-400 text-violet-900 ring-2 ring-violet-100' : 'bg-white border-slate-300 text-slate-700'}`}>
                                  <span className="font-black">{st.arr[st.mid]}</span>
                              </div>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center font-black text-2xl px-2 w-8">
                              {st.hlPhase === 'compare' || st.hlPhase === 'updateLeft' || st.hlPhase === 'updateRight' ? (
                                  <span className={st.isMatch ? 'text-emerald-500' : 'text-rose-500'}>
                                      {st.isMatch ? '==' : '!='}
                                  </span>
                              ) : (
                                  <span className="text-slate-300">?</span>
                              )}
                          </div>

                          <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold uppercase text-slate-400 mb-1">mid+1</span>
                              <div className={`flex items-center justify-center w-12 h-12 text-xl rounded-lg border-2 ${st.hlPhase === 'compare' ? 'bg-violet-100 border-violet-400 text-violet-900 ring-2 ring-violet-100' : 'bg-white border-slate-300 text-slate-700'}`}>
                                  <span className="font-black">{st.arr[st.mid + 1]}</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col items-center justify-center text-slate-400 font-black text-2xl px-1">
                          <span>&larr;</span>
                      </div>

                      {/* Right Boundary */}
                      <div className="flex flex-col items-center w-[90px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'updateRight' ? 'text-rose-600' : 'text-slate-400'}`}>Right Bound</span>
                          <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 transition-all ${st.hlPhase === 'updateRight' ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.right}
                          </div>
                      </div>

                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Pointers...</span>
                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (!st.arr || st.arr.length === 0) return <span className="text-slate-400 italic mt-10">Initializing Array...</span>;

      const nodeWidth = 64;
      const nodeGap = 16;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.arr.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYBase = 160; // Base Y position for children

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Arrays Area */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '400px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Active Search Space Bracket */}
                          {st.left !== undefined && st.right !== undefined && !st.isSuccess && (
                              <div className="absolute border-t-4 border-x-4 border-slate-400 rounded-t-2xl z-10 transition-all duration-500 opacity-60" 
                                   style={{ 
                                       left: startX + (st.left * totalColWidth) - nodeWidth/2 - 4,
                                       width: (st.right - st.left) * totalColWidth + nodeWidth + 8,
                                       top: rowYBase - 50,
                                       height: 25
                                   }}
                              >
                                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded border border-slate-300">Active Search Space</span>
                              </div>
                          )}

                          {/* Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.arr.map((val: number, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isWithinBounds = idx >= (st.left ?? 0) && idx <= (st.right ?? st.arr.length);
                                  
                                  let isMid = st.mid === idx && !st.isSuccess && st.hlPhase !== 'initPointers' && st.hlPhase !== 'loop' && st.hlPhase !== 'loopExit';
                                  let isMidPlusOne = (st.mid + 1) === idx && !st.isSuccess && (st.hlPhase === 'compare' || st.hlPhase === 'updateLeft' || st.hlPhase === 'updateRight');
                                  
                                  let isOrigMid = st.hlPhase === 'adjustMid' && st.origMid === idx;

                                  let bgClass = "bg-white border-slate-300 text-slate-400 opacity-40 border-dashed"; 
                                  let scaleClass = "scale-100";

                                  if (isOrigMid && !isMid) {
                                      bgClass = "bg-rose-50 border-rose-300 text-rose-800 shadow-sm opacity-80 border-dashed";
                                  } else if (isMid) {
                                      bgClass = "bg-violet-100 border-violet-500 text-violet-900 shadow-xl ring-4 ring-violet-200 z-30";
                                      scaleClass = "scale-110";
                                  } else if (isMidPlusOne) {
                                      bgClass = "bg-white border-violet-400 text-violet-800 shadow-lg ring-4 ring-violet-100 z-20";
                                      scaleClass = "scale-110";
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
                                          
                                          {/* Discarded Indicators */}
                                          {!isWithinBounds && !st.isSuccess && (
                                              <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest absolute -top-8 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Discarded</span>
                                          )}

                                          {/* Mid Indicators */}
                                          {isMid && !st.isSuccess && (
                                              <span className="text-[10px] font-black uppercase text-violet-600 tracking-widest absolute -top-8 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 animate-bounce">mid</span>
                                          )}
                                          {isOrigMid && !isMid && !st.isSuccess && (
                                              <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest absolute -top-8 line-through bg-rose-50 px-2 py-0.5 rounded border border-rose-200">odd mid</span>
                                          )}
                                          {isMidPlusOne && !st.isSuccess && (
                                              <span className="text-[10px] font-black uppercase text-violet-500 tracking-widest absolute -top-8 bg-white px-2 py-0.5 rounded border border-violet-200">mid+1</span>
                                          )}

                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{val}</span>
                                          </div>
                                          
                                          {/* Index Display Below */}
                                          <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold">{idx}</span>
                                          <span className="text-[9px] font-mono text-slate-400 mt-0 font-bold uppercase">{idx % 2 === 0 ? 'Even' : 'Odd'}</span>
                                          
                                          {/* Pointer Flags Below */}
                                          {idx === st.left && !st.isSuccess && (
                                              <div className="absolute -bottom-12 flex flex-col items-center animate-bounce">
                                                  <ArrowUp size={16} className="text-sky-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-sky-700 tracking-widest bg-sky-100 px-2 py-0.5 rounded border border-sky-300 shadow-sm">Left</span>
                                              </div>
                                          )}
                                          {idx === st.right && !st.isSuccess && (
                                              <div className="absolute -bottom-12 flex flex-col items-center animate-bounce">
                                                  <ArrowUp size={16} className="text-rose-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-rose-700 tracking-widest bg-rose-100 px-2 py-0.5 rounded border border-rose-300 shadow-sm">Right</span>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Single Element in a Sorted Array</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 540</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><FileText size={28}/> Problem Statement</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.</p>
                        <p>Return the single element that appears only once.</p>
                        <p>Your solution must run in <code>O(log n)</code> time and <code>O(1)</code> space.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [1,1,2,3,3,4,4,8,8]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The number 2 is the only element that does not have a duplicate pair.
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [3,3,7,7,10,11,11]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">10</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The number 10 is the only element that does not have a duplicate pair.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; nums.length &le; 10^5</code></li>
                            <li><code>0 &le; nums[i] &le; 10^5</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className={`text-${themeColor}-500`}/> The O(log N) Constraint</h5>
                        <p className="text-sm leading-relaxed text-slate-600">The problem specifically demands an $O(\log n)$ solution. If it allowed $O(n)$, we could just iterate through the array or use the XOR trick. Because the array is strictly sorted, $O(\log n)$ is the classic signature of <strong>Binary Search</strong>.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Code2 size={16} className={`text-sky-500`}/> The Index Property</h5>
                        <p className="text-sm leading-relaxed text-slate-600">Before the single element, all pairs start at an <strong>even</strong> index and end at an <strong>odd</strong> index. After the single element, this pattern is completely disrupted (pairs start at odd indices). We can binary search for the exact index where this pattern breaks!</p>
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
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className={`text-${themeColor}-400`} /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth" ref={codeContainerMainRef}>
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={`code-line-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array (Must be valid format)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="1, 1, 2, 3, 3..." />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess === true ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess === true ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SEARCH COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found the single element: {st.finalAns}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('adjust') ? 'text-rose-400' : (st.hlPhase?.includes('compare') || st.hlPhase?.includes('check') ? 'text-amber-400' : (st.hlPhase?.includes('update') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[400px]">
                   {renderVisuals()}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the Pair-Boundary Binary Search.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><SplitSquareHorizontal size={24} className={`text-${themeColor}-500`}/> 1. The Odd/Even Pair Property</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In a valid array where every element appears twice, pairs always start at even indices and end at odd indices. For example: <code>[(0, 1), (2, 3), (4, 5)]</code>.</p>
                        <p className="text-slate-600 leading-relaxed">When a single element is inserted into the array, it pushes all subsequent elements one index to the right. After the single element, pairs start at ODD indices and end at EVEN indices. We can use Binary Search to find the exact boundary where this shift happens!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Code2 size={24} className="text-sky-500"/> 2. Enforcing Even Midpoints</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To check if the pattern is intact, we need to examine a pair. To do this reliably, we want our <code>mid</code> pointer to always point to the <em>start</em> of a theoretical pair (an even index).</p>
                        <p className="text-slate-600 leading-relaxed">If our binary search calculates an odd <code>mid</code>, we simply do <code>mid--</code> to snap it to the even index just to its left. Once we are on an even index, we simply compare <code>nums[mid] == nums[mid + 1]</code>. If they match, everything to the left is perfectly paired, so we search right (<code>left = mid + 2</code>). If they don't match, the disruption happened here or to the left (<code>right = mid</code>).</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-amber-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(log N).</strong> We are halving the search space at every step using Binary Search. The number of iterations is strictly logarithmic with respect to the array length $N$.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only allocate a few primitive integer pointers (<code>left</code>, <code>right</code>, <code>mid</code>). We modify the search window boundaries without duplicating or slicing the array in memory, taking constant auxiliary space.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is an elegant Binary Search application problem. Interviewers use it to see if you can identify mathematical invariants (even/odd indices) and manipulate standard algorithm templates to fit constraints."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could you solve this using the XOR trick?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it would violate the time complexity constraint."</p>
                            <p>The XOR trick (XORing all elements together leaves only the single element because $x \oplus x = 0$) works perfectly and uses $O(1)$ space. However, it requires traversing the entire array, which takes $O(N)$ time. The problem explicitly demands an $O(\log n)$ solution, which disqualifies the XOR trick."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "In your code, you use `left = mid + 2` but `right = mid`. Why not `right = mid - 1`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because `mid` itself could be the single element."</p>
                            <p>When <code>nums[mid] != nums[mid+1]</code>, the disruption pattern starts at or before <code>mid</code>. If we did <code>right = mid - 1</code>, we might completely skip over the single element if it was residing exactly at index <code>mid</code>. We keep <code>right = mid</code> to ensure the single element remains trapped inside our collapsing search bounds."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "Can we use XOR inside the binary search to avoid the odd/even checking?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, using `mid ^ 1` is a very clever alternative."</p>
                            <p>If <code>mid</code> is even, <code>mid ^ 1</code> gives <code>mid + 1</code>. If <code>mid</code> is odd, <code>mid ^ 1</code> gives <code>mid - 1</code>. This automatically finds the correct pair partner without needing an explicit `if` statement to adjust the index. While it's slightly faster and saves lines of code, the <code>mid % 2</code> manual adjustment is generally more readable and easier to explain during a whiteboard interview."</p>
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
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess === true ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('adjust') ? 'text-rose-400' : (st.hlPhase?.includes('compare') || st.hlPhase?.includes('check') ? 'text-amber-400' : (st.hlPhase?.includes('update') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={`fs-code-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px] flex flex-col">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex w-64 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600 block`}>Input Array</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="1, 1, 2, 3..." />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>

                  {!st.isSuccess && st.isSuccess !== false && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true || st.isSuccess === false} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div className="flex-1 w-full h-full flex flex-col pt-32 pb-10 px-10 overflow-y-auto">
                       {renderVisuals()}
                  </div>

                  {(st.isSuccess === true) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SEARCH COMPLETE</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 text-emerald-400`}>Found the single element</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-500`}>Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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
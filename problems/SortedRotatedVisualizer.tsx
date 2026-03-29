import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, ArrowDown, Minus,
  RefreshCw, CheckCircle2, CornerDownRight, Orbit
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  countInversions: {
    id: 'countInversions',
    title: '1. Count Inversions (Drops)',
    icon: <Orbit size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'indigo',
    code: `class Solution {
    public boolean check(int[] nums) {
        int n = nums.length;
        int inversions = 0;
        
        for (int i = 0; i < n; i++) {
            if (nums[i] > nums[(i + 1) % n]) {
                inversions++;
            }
            if (inversions > 1) {
                return false;
            }
        }
        
        return true;
    }
}`,
    desc: "An optimal O(N) approach. If an array is sorted and rotated, it will have at most ONE 'drop' or 'inversion' where the current element is strictly greater than the next element. Because the array is rotated (circular), we must also compare the very last element with the very first element using modulo math `(i + 1) % n`. If we find more than 1 inversion anywhere in this circular array, it was never originally sorted!"
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|check|length|nums|inversions|n|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            const isPointer = ['nums', 'inversions', 'n', 'i', 'length'].includes(part);
            const isMapCall = ['check'].includes(part);
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

export default function SortedRotatedVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('countInversions');
  
  const [numsInput, setNumsInput] = useState('3, 4, 5, 1, 2');
  const [numsArr, setNumsArr] = useState<number[]>([3, 4, 5, 1, 2]);

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
      if (parsedArr.length === 0) parsedArr = fallback;
      if (parsedArr.length > 20) parsedArr = parsedArr.slice(0, 20); // Cap for visualization
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNumsArr(parseArrayInput(numsInput, [3, 4, 5, 1, 2]));
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
    let inversions = 0;
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { arr: [...arr], n, ...st } 
    });

    add("Init Function", `public boolean check(int[] nums)`, 2, { hlPhase: 'init' });
    add("Init Variables", `int n = nums.length;\nint inversions = 0;\nSetting tracking variables.`, 4, { hlPhase: 'initVars', inversions });

    let isSuccess = true;

    if (n > 0) {
        for (let i = 0; i < n; i++) {
            if (steps.length > 1000) break; // infinite loop guard

            let nextIdx = (i + 1) % n;
            let isWrap = nextIdx === 0;

            add("Loop Execution", `for (int i = 0; i < n; i++)\nIterating array. Current index i = ${i}.`, 6, { hlPhase: 'loop', idx: i, nextIdx, isWrap, inversions });

            let currVal = arr[i];
            let nextVal = arr[nextIdx];
            let isDrop = currVal > nextVal;

            add("Check Inversion", `if (nums[i] > nums[(i + 1) % n])\nComparing nums[${i}] (${currVal}) with nums[${nextIdx}] (${nextVal}).\nIs ${currVal} > ${nextVal}? (${isDrop ? 'Yes' : 'No'})`, 7, { hlPhase: 'compare', idx: i, nextIdx, isWrap, currVal, nextVal, isDrop, inversions });

            if (isDrop) {
                inversions++;
                add("Inversion Found!", `inversions++;\nFound a drop in sorted order! Total inversions: ${inversions}.`, 8, { hlPhase: 'inversion', idx: i, nextIdx, isWrap, currVal, nextVal, isDrop, inversions });
            }

            add("Check Tolerance", `if (inversions > 1)\nChecking if we exceeded the allowed 1 inversion.`, 10, { hlPhase: 'checkCount', idx: i, nextIdx, isWrap, currVal, nextVal, isDrop, inversions });

            if (inversions > 1) {
                isSuccess = false;
                add("Failed Condition", `return false;\nFound ${inversions} inversions! The array was not originally sorted.`, 11, { hlPhase: 'fail', idx: i, nextIdx, isWrap, currVal, nextVal, isDrop, inversions, isSuccess: false });
                break;
            }
        }
    }

    if (isSuccess) {
        add("Success", `return true;\nLoop complete! Max 1 inversion found. Array is valid.`, 15, { hlPhase: 'success', inversions, isSuccess: true });
    }

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
      let isFailEnd = st.hlPhase === 'fail';

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : (isFailEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-indigo-200')} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                  <Activity size={14}/> Algorithm State Monitor
              </span>
              
              {isSuccessEnd || isFailEnd ? (
                  <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                      <div className={`flex items-center gap-4 ${isSuccessEnd ? 'text-emerald-600 bg-emerald-50 border-emerald-300' : 'text-rose-600 bg-rose-50 border-rose-300'} font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                          <span>{isSuccessEnd ? "Valid Rotated Array" : "Invalid Array"}</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border ${isSuccessEnd ? 'border-emerald-200' : 'border-rose-200'}`}>Return {isSuccessEnd ? "true" : "false"}</span>
                      </div>
                  </div>
              ) : st.idx !== undefined && st.nextIdx !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      
                      {/* Comparison Block */}
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                          
                          {/* Current Element */}
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold uppercase text-slate-400">nums[{st.idx}]</span>
                              <div className={`flex items-center justify-center w-12 h-12 text-xl rounded-lg border-2 ${st.hlPhase === 'compare' || st.hlPhase === 'inversion' ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-white border-slate-300 text-slate-700'}`}>
                                  <span className="font-black">{st.currVal}</span>
                              </div>
                          </div>
                          
                          {/* Comparison Operator */}
                          <div className="flex flex-col items-center justify-center font-black text-2xl px-2 transition-colors w-8">
                              {st.hlPhase === 'compare' || st.hlPhase === 'inversion' || st.hlPhase === 'checkCount' ? (
                                  <span className={st.isDrop ? 'text-rose-500' : 'text-emerald-500'}>
                                      {st.isDrop ? '>' : '≤'}
                                  </span>
                              ) : (
                                  <span className="text-slate-300">?</span>
                              )}
                          </div>

                          {/* Next Element */}
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                                  nums[{st.nextIdx}] {st.isWrap && <RefreshCw size={10} className="text-sky-500"/>}
                              </span>
                              <div className={`flex items-center justify-center w-12 h-12 text-xl rounded-lg border-2 ${st.hlPhase === 'compare' || st.hlPhase === 'inversion' ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-white border-slate-300 text-slate-700'}`}>
                                  <span className="font-black">{st.nextVal}</span>
                              </div>
                          </div>
                      </div>

                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      
                      {/* Inversions Counter */}
                      <div className="flex flex-col items-center min-w-[160px] animate-in zoom-in">
                          <span className={`text-[10px] font-bold uppercase mb-2 text-slate-400`}>Inversions (Drops)</span>
                          <div className={`flex items-center justify-center gap-3 w-full bg-slate-50 border-2 rounded-xl py-2 px-6 transition-all duration-300 ${st.hlPhase === 'inversion' || st.hlPhase === 'checkCount' ? 'border-amber-400 bg-amber-50 shadow-md ring-4 ring-amber-100 scale-110' : 'border-slate-200'}`}>
                              <span className={`font-black text-2xl ${st.inversions > 1 ? 'text-rose-600' : 'text-amber-600'}`}>{st.inversions !== undefined ? st.inversions : 0}</span>
                              <span className="text-slate-400 font-bold text-sm">/ 1 Max</span>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing...</span>
                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (!st.arr || st.arr.length === 0) return <span className="text-slate-400 italic mt-10">Initializing Array...</span>;

      const nodeWidth = 64;
      const nodeGap = 24;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = st.arr.length * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);
      
      const rowYBase = 120; // Base Y position for children

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Arrays Area */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '350px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Wrap-Around Connection Arc */}
                          <svg className="absolute top-0 left-0 overflow-visible z-10" style={{ width: '1px', height: '1px' }}>
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {st.idx !== undefined && st.nextIdx !== undefined && st.isWrap && !st.isSuccess && (
                                      <path 
                                          d={`M ${startX + (st.idx * totalColWidth)} ${rowYBase - 36} C ${startX + (st.idx * totalColWidth)} ${rowYBase - 150}, ${startX + (st.nextIdx * totalColWidth)} ${rowYBase - 150}, ${startX + (st.nextIdx * totalColWidth)} ${rowYBase - 36}`} 
                                          fill="none" 
                                          stroke="#6366f1" 
                                          strokeWidth="4" 
                                          strokeDasharray="6 6"
                                          markerEnd="url(#arrowhead)"
                                          className="animate-pulse"
                                      />
                                  )}
                                  
                                  {/* Normal connection arrow */}
                                  {st.idx !== undefined && st.nextIdx !== undefined && !st.isWrap && !st.isSuccess && (
                                      <path 
                                          d={`M ${startX + (st.idx * totalColWidth) + 32} ${rowYBase} L ${startX + (st.nextIdx * totalColWidth) - 36} ${rowYBase}`} 
                                          fill="none" 
                                          stroke="#6366f1" 
                                          strokeWidth="4" 
                                          markerEnd="url(#arrowhead)"
                                      />
                                  )}
                                  
                                  <defs>
                                      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#6366f1" />
                                      </marker>
                                  </defs>
                              </g>
                          </svg>

                          {/* Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.arr.map((val: number, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isActive = st.idx === idx && !st.isSuccess;
                                  let isNext = st.nextIdx === idx && !st.isSuccess;
                                  let isFailed = st.isSuccess === false && (st.idx === idx || st.nextIdx === idx);
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                                  let scaleClass = "scale-100";

                                  if (isActive) {
                                      bgClass = isFailed ? "bg-rose-100 border-rose-500 ring-4 ring-rose-200 text-rose-900 shadow-xl z-30" : "bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200 text-indigo-900 shadow-xl z-30";
                                      scaleClass = "scale-110";
                                  } else if (isNext) {
                                      bgClass = isFailed ? "bg-rose-100 border-rose-400 ring-4 ring-rose-100 text-rose-900 shadow-md z-20" : "bg-sky-50 border-sky-400 ring-4 ring-sky-100 text-sky-900 shadow-md z-20";
                                      scaleClass = "scale-105";
                                  } else if (st.isSuccess) {
                                      bgClass = "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-md opacity-90";
                                  }

                                  return (
                                      <div key={`node-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYBase}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {isActive && !isFailed && (
                                              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest absolute -top-10 animate-bounce bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">idx: {idx}</span>
                                          )}
                                          {isNext && !isFailed && (
                                              <span className="text-[10px] font-black uppercase text-sky-600 tracking-widest absolute -top-10 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">(i+1)%n</span>
                                          )}
                                          {isFailed && isActive && (
                                              <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest absolute -top-10 animate-bounce bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Drop!</span>
                                          )}

                                          {/* Element Box */}
                                          <div className={`w-[64px] h-[64px] flex flex-col items-center justify-center border-[3px] rounded-2xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{val}</span>
                                          </div>
                                          
                                          {/* Index Display Below */}
                                          <span className="text-[11px] font-mono text-slate-400 mt-3 font-bold opacity-60">i={idx}</span>
                                          
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
                <RefreshCw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Check if Array Is Sorted and Rotated</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Array Traversal
                  </span>
                  <span>•</span>
                  <span>LeetCode 1752</span>
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
                        <p>Given an array <code>nums</code>, return <code>true</code> if the array was originally sorted in non-decreasing order, then rotated some number of positions (including zero). Otherwise, return <code>false</code>.</p>
                        <p>There may be duplicates in the original array.</p>
                        <p>Note: An array <code>A</code> rotated by <code>x</code> positions results in an array <code>B</code> of the same length such that <code>A[i] == B[(i+x) % A.length]</code>, where <code>%</code> is the modulo operation.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Valid Rotation</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [3,4,5,1,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">true</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                [1,2,3,4,5] is the original sorted array.<br/>
                                You can rotate the array by x = 3 positions to begin on the the element of value 3: [3,4,5,1,2].
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Invalid Array</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [2,1,3,4]</span>
                            <span className="text-rose-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">false</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                There is no sorted array once rotated that can make nums.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; nums.length &le; 100</code></li>
                            <li><code>1 &le; nums[i] &le; 100</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-indigo-500"/> Count Inversions Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">If an array is perfectly sorted, every element is less than or equal to the next element. There are NO "drops" or "inversions" where <code>nums[i] &gt; nums[i+1]</code>. If we take a sorted array and rotate it, we will introduce exactly ONE drop at the wrap-around point. Thus, we just count the drops. If there's more than 1 drop, it wasn't sorted!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><RefreshCw size={16} className={`text-sky-500`}/> Circular Array Property</h5>
                        <p className="text-sm leading-relaxed text-slate-600">Because the array is treated as circular, the very last element connects back to the first element. We must evaluate the transition <code>nums[n-1] &rarr; nums[0]</code> just like any other adjacent pair. We use the modulo operator <code>(i + 1) % n</code> to cleanly check the next index, letting the loop wrap around seamlessly.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="3, 4, 5, 1, 2" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true || st.isSuccess === false} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess === true ? 'bg-emerald-900 border-emerald-800' : (st.isSuccess === false ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess === true ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> VALID ARRAY</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Array was originally sorted and rotated.</p>
                         </div>
                    ) : st.isSuccess === false ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={24}/> INVALID ARRAY</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Too many drops found. Cannot be rotated sorted array.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('inversion') || st.hlPhase?.includes('fail') ? 'text-rose-400' : (st.hlPhase?.includes('compare') ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding circular array traversal and invariant constraints.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><SortAsc size={24} className={`text-emerald-500`}/> 1. The Sorted Invariant</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A strictly sorted array in non-decreasing order has a clear invariant: every element is less than or equal to the next element (<code>nums[i] &le; nums[i+1]</code>). If you plot this on a graph, it goes up, or stays flat, but it never drops.</p>
                        <p className="text-slate-600 leading-relaxed">When you rotate this array, you are essentially chopping the graph in half and putting the right half on the left. This creates exactly ONE "cliff" or "drop" where the end of the original sorted sequence jumps back down to the start of the original sequence.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><RefreshCw size={24} className="text-indigo-500"/> 2. Modulo Math for Circular Arrays</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To cleanly check the entire array including the wrap-around point (from the last element back to the first), we iterate from <code>0</code> to <code>n-1</code> and compare <code>nums[i]</code> with <code>nums[(i+1) % n]</code>.</p>
                        <p className="text-slate-600 leading-relaxed">The modulo operator <code>% n</code> ensures that when <code>i = n-1</code> (the last index), <code>i+1</code> becomes <code>n</code>, and <code>n % n</code> becomes <code>0</code>. This elegantly links the end of the array to the beginning without needing an extra IF statement outside the loop.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-sky-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We iterate through the array of length N exactly once. Inside the loop, we perform constant time $O(1)$ operations (array lookups, modulo math, and integer comparisons). Thus, total time is linear.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only use a few primitive integer variables (<code>n</code>, <code>inversions</code>) to store our state. We do not allocate any new arrays or use recursion. The auxiliary space required is strictly constant.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is an elegant Array property problem. Interviewers look for candidates who avoid over-complicating it (e.g., finding the minimum element first) and instead use modulo math for a clean, single-pass solution."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What if the array is perfectly sorted with no rotations? (e.g. `[1, 2, 3, 4]`)"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The code handles this correctly and returns true."</p>
                            <p>If the array is strictly sorted, there are zero drops between adjacent elements internally. At the wrap-around step, we compare the last element (4) with the first element (1). Since 4 &gt; 1, this counts as exactly ONE inversion. The loop finishes with <code>inversions = 1</code>, which satisfies the condition <code>inversions &le; 1</code>, returning true.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What if all elements in the array are identical? (e.g. `[2, 2, 2, 2]`)"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It also works perfectly, returning true."</p>
                            <p>Because the condition checks strictly greater (<code>nums[i] &gt; nums[(i+1)%n]</code>), an array of all equal elements will trigger zero inversions. 0 is not greater than 1, so the function returns true, which is correct since an array of all identical elements is mathematically sorted and rotated.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "Could you solve this by finding the 'min' element first and iterating from there?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's more complicated, especially with duplicates."</p>
                            <p>You could find the minimum element, assume it's the start of the sorted sequence, and verify the rest of the array is sorted. However, if there are duplicate minimum values (e.g., <code>[2, 1, 1, 2]</code>), deciding WHICH minimum is the true "start" becomes tricky and requires extra logic. Counting total drops globally avoids the duplicate issue entirely.</p>
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
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess === true ? 'bg-emerald-900/40 border-emerald-800' : (st.isSuccess === false ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700')}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('inversion') || st.hlPhase?.includes('fail') ? 'text-rose-400' : (st.hlPhase?.includes('compare') ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="3, 4, 5, 1, 2" />
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

                  {(st.isSuccess === true || st.isSuccess === false) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.isSuccess ? "VALID ARRAY" : "INVALID ARRAY"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>{st.isSuccess ? "Array was originally sorted and rotated." : `Too many inversions found.`}</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isSuccess ? 'text-emerald-500' : 'text-rose-500'}`}>Final Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.isSuccess ? 'true' : 'false'}</div>
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
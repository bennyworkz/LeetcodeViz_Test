import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, ArrowDown, Minus,
  RefreshCw, CheckCircle2, CornerDownRight, ArrowRightLeft, Plus, SplitSquareHorizontal
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (O(N) Space)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int[] rearrangeArray(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        
        int posIdx = 0;
        int negIdx = 1;
        
        for (int i = 0; i < n; i++) {
            if (nums[i] > 0) {
                ans[posIdx] = nums[i];
                posIdx += 2;
            } else {
                ans[negIdx] = nums[i];
                negIdx += 2;
            }
        }
        
        return ans;
    }
}`,
    desc: "An optimal O(N) time and O(N) space approach. We must preserve the relative order of the elements while alternating their signs. We create an output array `ans` and use two independent pointers: `posIdx` starting at 0 (even indices for positives) and `negIdx` starting at 1 (odd indices for negatives). We iterate through `nums` exactly once, dropping each number into its designated slot and advancing that specific pointer by 2!"
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|rearrangeArray|length|nums|ans|posIdx|negIdx|n|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            const isPointer = ['nums', 'ans', 'posIdx', 'negIdx', 'n', 'i', 'length'].includes(part);
            const isMapCall = ['rearrangeArray'].includes(part);
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

export default function RearrangeArrayVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [numsInput, setNumsInput] = useState('3, 1, -2, -5, 2, -4');
  const [numsArr, setNumsArr] = useState<number[]>([3, 1, -2, -5, 2, -4]);

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
      setNumsArr(parseArrayInput(numsInput, [3, 1, -2, -5, 2, -4]));
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
    let ans = new Array(n).fill(null);
    let posIdx = 0;
    let negIdx = 1;
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { arr: [...arr], ans: [...ans], n, posIdx, negIdx, ...st } 
    });

    add("Init Function", `public int[] rearrangeArray(int[] nums)`, 2, { hlPhase: 'init' });
    add("Init Variables", `int n = nums.length;\nint[] ans = new int[n];\nCreated empty output array of size ${n}.`, 4, { hlPhase: 'initVars' });
    add("Init Pointers", `int posIdx = 0;\nint negIdx = 1;\nSetup even/odd independent pointers.`, 7, { hlPhase: 'initPointers' });

    let isSuccess = true;

    for (let i = 0; i < n; i++) {
        if (steps.length > 1000) break; // infinite loop guard

        let currVal = arr[i];
        let isPos = currVal > 0;

        add("Loop Execution", `for (int i = 0; i < n; i++)\nIterating array. Processing index i = ${i}.`, 9, { hlPhase: 'loop', idx: i, currVal });
        add("Check Sign", `if (nums[i] > 0)\nIs nums[${i}] (${currVal}) > 0? (${isPos ? 'Yes' : 'No'})`, 10, { hlPhase: 'checkSign', idx: i, currVal, isPos });

        if (isPos) {
            let targetIdx = posIdx;
            if (targetIdx < n) ans[targetIdx] = currVal; // Guard for visualizer safety
            
            add("Place Positive", `ans[posIdx] = nums[i];\nPlaced ${currVal} at positive index slot ${targetIdx}.`, 11, { hlPhase: 'placePos', idx: i, currVal, isPos, targetIdx });
            
            posIdx += 2;
            add("Increment Positive", `posIdx += 2;\nAdvanced positive pointer to next even index (${posIdx}).`, 12, { hlPhase: 'incPos', idx: i, currVal, isPos, targetIdx, oldPosIdx: targetIdx });
        } else {
            let targetIdx = negIdx;
            if (targetIdx < n) ans[targetIdx] = currVal; // Guard
            
            add("Place Negative", `ans[negIdx] = nums[i];\nPlaced ${currVal} at negative index slot ${targetIdx}.`, 14, { hlPhase: 'placeNeg', idx: i, currVal, isPos, targetIdx });
            
            negIdx += 2;
            add("Increment Negative", `negIdx += 2;\nAdvanced negative pointer to next odd index (${negIdx}).`, 15, { hlPhase: 'incNeg', idx: i, currVal, isPos, targetIdx, oldNegIdx: targetIdx });
        }
    }

    add("Success", `return ans;\nArray successfully rearranged with alternating signs!`, 19, { hlPhase: 'success', isSuccess: true });

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
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-sky-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                  <Activity size={14}/> Two Pointers State
              </span>
              
              {isSuccessEnd ? (
                  <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                      <div className={`flex items-center gap-4 text-emerald-600 bg-emerald-50 border-emerald-300 font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                          <span>Rearrangement Complete</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200`}>Return ans array</span>
                      </div>
                  </div>
              ) : st.idx !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      
                      {/* Current Element */}
                      <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold uppercase text-slate-400">nums[{st.idx}]</span>
                          <div className={`flex items-center justify-center w-14 h-14 text-2xl rounded-xl border-2 shadow-sm ${st.hlPhase === 'checkSign' || st.hlPhase === 'placePos' || st.hlPhase === 'placeNeg' ? (st.isPos ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200' : 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-200') : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                              <span className="font-black">{st.currVal > 0 ? `+${st.currVal}` : st.currVal}</span>
                          </div>
                      </div>
                      
                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      
                      {/* Pos Pointer */}
                      <div className="flex flex-col items-center w-[120px] transition-all duration-300">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'incPos' || st.hlPhase === 'placePos' ? 'text-emerald-600' : 'text-slate-400'}`}>posIdx</span>
                          <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 ${st.hlPhase === 'incPos' || st.hlPhase === 'placePos' ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.posIdx}
                          </div>
                      </div>

                      {/* Neg Pointer */}
                      <div className="flex flex-col items-center w-[120px] transition-all duration-300">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'incNeg' || st.hlPhase === 'placeNeg' ? 'text-rose-600' : 'text-slate-400'}`}>negIdx</span>
                          <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 ${st.hlPhase === 'incNeg' || st.hlPhase === 'placeNeg' ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.negIdx}
                          </div>
                      </div>
                      
                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      
                      {/* Action */}
                      <div className="flex flex-col items-center min-w-[140px] animate-in zoom-in">
                          <span className={`text-[9px] font-bold uppercase mb-1 text-slate-400`}>Operation</span>
                          {st.hlPhase === 'checkSign' ? (
                              <span className="text-sm font-black uppercase text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">Evaluate Sign</span>
                          ) : st.hlPhase === 'placePos' || st.hlPhase === 'placeNeg' ? (
                              <span className={`text-sm font-black uppercase px-3 py-1 rounded-lg border shadow-sm ${st.isPos ? 'text-emerald-700 bg-emerald-50 border-emerald-300' : 'text-rose-700 bg-rose-50 border-rose-300'}`}>Drop &rarr; ans[{st.targetIdx}]</span>
                          ) : st.hlPhase === 'incPos' || st.hlPhase === 'incNeg' ? (
                              <span className="text-sm font-black uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">Advance by 2</span>
                          ) : (
                              <span className="text-sm font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">Scanning</span>
                          )}
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
      
      const rowY1 = 80; // Input nums
      const rowY2 = 240; // Output ans

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
                          
                          <span className="absolute text-slate-400 font-black font-mono tracking-widest uppercase text-sm -translate-x-1/2 whitespace-nowrap" style={{ left: `${startX - 100}px`, top: `${rowY1}px` }}>nums</span>
                          <span className="absolute text-slate-400 font-black font-mono tracking-widest uppercase text-sm -translate-x-1/2 whitespace-nowrap" style={{ left: `${startX - 100}px`, top: `${rowY2}px` }}>ans</span>

                          {/* Connection Arc (Dropping element) */}
                          <svg className="absolute top-0 left-0 overflow-visible z-10 pointer-events-none" style={{ width: '1px', height: '1px' }}>
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {(st.hlPhase === 'placePos' || st.hlPhase === 'placeNeg' || st.hlPhase === 'incPos' || st.hlPhase === 'incNeg') && st.idx !== undefined && st.targetIdx !== undefined && !st.isSuccess && (
                                      <path 
                                          d={`M ${startX + (st.idx * totalColWidth)} ${rowY1 + 36} C ${startX + (st.idx * totalColWidth)} ${rowY1 + 100}, ${startX + (st.targetIdx * totalColWidth)} ${rowY2 - 100}, ${startX + (st.targetIdx * totalColWidth)} ${rowY2 - 36}`} 
                                          fill="none" 
                                          stroke={st.isPos ? '#10b981' : '#f43f5e'} 
                                          strokeWidth="4" 
                                          strokeDasharray="6 6"
                                          markerEnd={st.isPos ? "url(#arrowheadPos)" : "url(#arrowheadNeg)"}
                                          className="animate-pulse"
                                      />
                                  )}
                                  <defs>
                                      <marker id="arrowheadPos" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#10b981" />
                                      </marker>
                                      <marker id="arrowheadNeg" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#f43f5e" />
                                      </marker>
                                  </defs>
                              </g>
                          </svg>

                          {/* Top Array (nums) */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.arr.map((val: number, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isActive = st.idx === idx && !st.isSuccess;
                                  let isProcessed = st.idx > idx || st.isSuccess;
                                  let isPos = val > 0;
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                                  let scaleClass = "scale-100";

                                  if (isActive) {
                                      bgClass = isPos ? "bg-emerald-50 border-emerald-400 ring-4 ring-emerald-100 text-emerald-900 shadow-xl z-30" : "bg-rose-50 border-rose-400 ring-4 ring-rose-100 text-rose-900 shadow-xl z-30";
                                      scaleClass = "scale-110";
                                  } else if (isProcessed) {
                                      bgClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-40 border-dashed";
                                  } else {
                                      bgClass = isPos ? "bg-white border-emerald-200 text-emerald-600 shadow-sm" : "bg-white border-rose-200 text-rose-600 shadow-sm";
                                  }

                                  return (
                                      <div key={`nums-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowY1}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {isActive && (
                                              <span className="text-[10px] font-black uppercase text-sky-600 tracking-widest absolute -top-10 animate-bounce bg-sky-50 px-2 py-0.5 rounded border border-sky-200">i</span>
                                          )}

                                          {/* Element Box */}
                                          <div className={`w-[60px] h-[60px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{val > 0 ? `+${val}` : val}</span>
                                          </div>
                                          
                                          <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold opacity-60">{idx}</span>
                                      </div>
                                  )
                              })}
                          </div>

                          {/* Bottom Array (ans) */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.ans.map((val: number | null, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isPosIdx = st.posIdx === idx && !st.isSuccess;
                                  let isNegIdx = st.negIdx === idx && !st.isSuccess;
                                  let isJustPlaced = (st.hlPhase === 'placePos' || st.hlPhase === 'placeNeg') && st.targetIdx === idx;
                                  let isPosVal = val !== null && val > 0;
                                  let isNegVal = val !== null && val < 0;
                                  
                                  let bgClass = "bg-slate-100 border-slate-200 text-transparent border-dashed"; 
                                  let scaleClass = "scale-100";

                                  if (isJustPlaced) {
                                      bgClass = st.isPos ? "bg-emerald-500 border-emerald-600 text-white shadow-xl ring-4 ring-emerald-200 z-30" : "bg-rose-500 border-rose-600 text-white shadow-xl ring-4 ring-rose-200 z-30";
                                      scaleClass = "scale-125";
                                  } else if (val !== null) {
                                      bgClass = isPosVal ? "bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md" : "bg-rose-100 border-rose-400 text-rose-900 shadow-md";
                                  } else if (isPosIdx || isNegIdx) {
                                      bgClass = "bg-white border-slate-300 text-transparent shadow-inner";
                                  }

                                  if (st.isSuccess) {
                                      bgClass = isPosVal ? "bg-emerald-500 border-emerald-600 text-white shadow-lg" : "bg-rose-500 border-rose-600 text-white shadow-lg";
                                  }

                                  return (
                                      <div key={`ans-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowY2}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Element Box */}
                                          <div className={`w-[60px] h-[60px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{val !== null ? (val > 0 ? `+${val}` : val) : ''}</span>
                                          </div>
                                          
                                          <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold opacity-60">{idx}</span>

                                          {/* Pointers Below */}
                                          {isPosIdx && !st.isSuccess && (
                                              <div className="absolute -bottom-10 flex flex-col items-center animate-bounce">
                                                  <ArrowUp size={16} className="text-emerald-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shadow-sm">posIdx</span>
                                              </div>
                                          )}
                                          {isNegIdx && !st.isSuccess && (
                                              <div className="absolute -bottom-10 flex flex-col items-center animate-bounce">
                                                  <ArrowUp size={16} className="text-rose-500 mb-0.5"/>
                                                  <span className="text-[9px] font-black uppercase text-rose-600 tracking-widest bg-rose-50 px-2 py-0.5 rounded border border-rose-200 shadow-sm">negIdx</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rearrange Array Elements by Sign</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Two Pointers
                  </span>
                  <span>•</span>
                  <span>LeetCode 2149</span>
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
                        <p>You are given a <strong>0-indexed</strong> integer array <code>nums</code> of <strong>even</strong> length consisting of an <strong>equal</strong> number of positive and negative integers.</p>
                        <p>You should rearrange the elements of <code>nums</code> such that the modified array follows the given conditions:</p>
                        <ul className="list-decimal pl-6 space-y-1">
                            <li>Every <strong>consecutive pair</strong> of integers have <strong>opposite signs</strong>.</li>
                            <li>For all integers with the same sign, the <strong>order</strong> in which they were present in <code>nums</code> is <strong>preserved</strong>.</li>
                            <li>The rearranged array begins with a positive integer.</li>
                        </ul>
                        <p>Return the modified array after rearranging the elements to satisfy the aforementioned conditions.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Standard Alternation</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [3,1,-2,-5,2,-4]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[3,-2,1,-5,2,-4]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The positive integers in nums are [3,1,2]. The negative integers are [-2,-5,-4].<br/>
                                The only possible way to rearrange them such that they alternate and preserve original order is [3,-2,1,-5,2,-4].
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Minimum Length</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [-1,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[1,-1]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The array must start with a positive integer, so 1 is placed first, followed by -1.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>2 &le; nums.length &le; 2 * 10^5</code></li>
                            <li><code>nums.length</code> is <strong>even</strong></li>
                            <li><code>1 &le; |nums[i]| &le; 10^5</code></li>
                            <li><code>nums</code> consists of <strong>equal</strong> number of positive and negative integers.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-sky-500"/> Independent Target Pointers</h5>
                        <p className="text-sm leading-relaxed text-slate-600">Since we know the array must start with a positive number and strictly alternate, we know exactly *where* the numbers must go based on their sign. Positive numbers must land on even indices (0, 2, 4...) and negative numbers must land on odd indices (1, 3, 5...).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><RefreshCw size={16} className={`text-emerald-500`}/> O(N) Space Requirement</h5>
                        <p className="text-sm leading-relaxed text-slate-600">To preserve the *relative order* of the elements as they appeared in the original array, doing this "in-place" (O(1) space) via swapping is extremely difficult and inefficient (O(N²)). By using a new output array of the same size, we achieve an elegant, single-pass O(N) time solution.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array (Must have equal +/-)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="3, 1, -2, -5, 2, -4" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> REARRANGEMENT COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Array successfully returned.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('place') || st.hlPhase?.includes('inc') ? (st.isPos ? 'text-emerald-400' : 'text-rose-400') : (st.hlPhase?.includes('check') ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Why O(N) Space is typically required for this specific problem variation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRightLeft size={24} className={`text-sky-500`}/> 1. The Stable Alternation Problem</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If the problem did NOT require preserving the original relative order of the elements, we could solve this "in-place" with O(1) space. We could use a standard Two Pointers trick (like QuickSort's partition) to move all positives to one side, and negatives to another, and then swap them into alternating positions.</p>
                        <p className="text-slate-600 leading-relaxed">However, the constraint "preserve the order" makes this a <strong>Stable</strong> operation. In-place stable rearrangement of arrays requires complex O(N²) shifting operations (like insertion sort) or extremely complex block-swapping algorithms that are far beyond standard interview expectations.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Plus size={24} className="text-emerald-500"/> 2. Independent Streams</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">By allocating a new output array <code>ans</code>, we essentially create two independent destination "streams":</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4">
                            <li>Positive Stream: starts at index 0, increments by 2.</li>
                            <li>Negative Stream: starts at index 1, increments by 2.</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">As we read elements linearly from the input, we blindly route them to their respective stream. Because we process the input linearly (from left to right), the relative order within each stream is naturally preserved!</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-amber-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We iterate exactly once through the array of length N. The operations inside the loop are basic array assignments and pointer increments, which execute in O(1) constant time.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate a new <code>ans</code> array of length N to store the rearranged elements. This is the optimal space complexity for a stable solution without delving into esoteric algorithms.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a common array manipulation question. Interviewers use it to see if you can cleanly separate logic using independent pointers, and to test your understanding of 'Stable' vs 'In-Place' sorting constraints."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you solve this problem in O(1) space?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Only if we sacrifice time complexity or drop the 'relative order' constraint."</p>
                            <p>To do it in-place and maintain stability, we would essentially need to do something like an Insertion Sort when we find a mismatch, which would push the time complexity to <code>O(N²)</code>. There are complex mathematical algorithms (like block-swapping) that achieve O(1) space and O(N) time for stable partition, but they are generally out of scope for a standard 45-minute interview.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What if the array had unequal amounts of positive and negative numbers?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The current logic would cause an Index Out of Bounds error."</p>
                            <p>If we had more positive numbers than negative numbers, <code>posIdx</code> would eventually exceed the bounds of the array. To fix this, we would first fill elements alternatingly until one pointer goes out of bounds, and then we would loop through the remaining input and append the leftover elements to the end of the array sequentially."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "What if the array contained the number zero?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would need a rule on how to classify zero."</p>
                            <p>The problem guarantees strict positives and strict negatives. If zero was present, our condition <code>if (nums[i] &gt; 0)</code> would treat 0 as a negative number (routing it to <code>negIdx</code>). We would need the interviewer to clarify if 0 is treated as a positive integer, a negative integer, or completely ignored/filtered out before we could adjust the logic."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('place') || st.hlPhase?.includes('inc') ? (st.isPos ? 'text-emerald-400' : 'text-rose-400') : (st.hlPhase?.includes('check') ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="3, 1, -2, -5..." />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">REARRANGEMENT COMPLETE</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 text-emerald-400`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-500`}>Final Output</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center gap-2 overflow-hidden truncate px-4">
                                        [{st.ans.join(', ')}]
                                    </div>
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
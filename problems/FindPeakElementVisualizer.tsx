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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  peakBinarySearch: {
    id: 'peakBinarySearch',
    title: '1. Binary Search (Slope Detection)',
    icon: <TrendingUp size={16} />,
    complexity: 'Time: O(log N) | Space: O(1)',
    theme: 'amber',
    code: `public int findPeakElement(int[] nums) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < nums[mid + 1]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}`,
    desc: "The Optimal Binary Search Approach. How can we use binary search on an unsorted array? By following the slope! A peak element is strictly greater than its neighbors. If we look at 'mid' and 'mid+1', we can determine the direction of the slope. If nums[mid] < nums[mid+1], the slope is going UP to the right, meaning a peak MUST exist to the right. We move 'left = mid + 1'. If nums[mid] > nums[mid+1], the slope is going DOWN, meaning a peak MUST exist to the left (or mid itself is the peak). We move 'right = mid'. By continually trapping the upward slope, we converge on a peak in O(log N) time."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|new|String|findPeakElement|nums|length|left|right|mid)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'new', 'break'].includes(part);
            const isPointer = ['nums', 'left', 'right', 'mid'].includes(part);
            const isMapCall = ['findPeakElement', 'length'].includes(part);
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

export default function FindPeakElementVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('peakBinarySearch');
  
  const [numsInput, setNumsInput] = useState('1, 2, 1, 3, 5, 6, 4');
  
  const [baseNums, setBaseNums] = useState<number[]>([1, 2, 1, 3, 5, 6, 4]);

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
      let parsedNums = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      
      if (parsedNums.length === 0) parsedNums = [1, 2, 1, 3, 5, 6, 4];
      if (parsedNums.length > 15) parsedNums = parsedNums.slice(0, 15); // UI bounds limitation

      setBaseNums(parsedNums);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, selectedOpId]);

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
    const nums = [...baseNums];
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            nums, ...st 
        } 
    });

    add("Function Call", `public int findPeakElement(int[] nums)`, 1, {});

    let left = 0;
    let right = nums.length - 1;
    
    add("Initialize Pointers", `int left = 0;\nint right = nums.length - 1;\nSet the initial search window to the entire array [0, ${right}].`, 3, { left, right, hlInit: true });

    while (left < right) {
        if (steps.length > 200) break; // Safety net

        add("Loop Condition", `while (left < right)\nSearch space is valid (${left} < ${right}).`, 4, { left, right, hlWhile: true });

        let mid = left + Math.floor((right - left) / 2);
        
        let valMid = nums[mid];
        let valMidPlus1 = nums[mid + 1];
        let isAscending = valMid < valMidPlus1;

        add("Calculate Midpoint", `int mid = left + (right - left) / 2;\nCalculated mid = ${mid}. We will compare nums[${mid}] and nums[${mid + 1}].`, 5, { left, right, mid, hlMid: true });

        add("Check Local Slope", `if (nums[mid] < nums[mid + 1])\nIs ${valMid} < ${valMidPlus1}? (${isAscending ? 'Yes, Slope is UP' : 'No, Slope is DOWN'})`, 6, { left, right, mid, valMid, valMidPlus1, isAscending, hlCheckSlope: true });

        if (isAscending) {
            let oldLeft = left;
            left = mid + 1;
            add("Move Left Boundary", `left = mid + 1;\nThe slope is going UP to the right. A peak MUST exist on the right side. Moving 'left' from ${oldLeft} to ${left}.`, 7, { left, right, mid, valMid, valMidPlus1, isAscending, hlMoveLeft: true, oldLeft });
        } else {
            let oldRight = right;
            right = mid;
            add("Move Right Boundary", `right = mid;\nThe slope is going DOWN to the right. A peak MUST exist on the left side (or mid itself is the peak). Moving 'right' from ${oldRight} to ${right}.`, 9, { left, right, mid, valMid, valMidPlus1, isAscending, hlMoveRight: true, oldRight });
        }
    }

    add("Loop Exit", `while (left < right)\nThe pointers have converged (${left} == ${right}). The loop terminates.`, 4, { left, right, hlWhileEnd: true });
    
    add("Return Result", `return left;\nThe search space has shrunk to a single element. We return index ${left} (Value: ${nums[left]}).`, 12, { isSuccess: true, finalAns: left, left, right });

    return steps;
  }, [baseNums, selectedOpId]);

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
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      // Mathematical limits for the bar chart
      const minVal = Math.min(...st.nums, 0);
      const maxVal = Math.max(...st.nums, 1);
      const range = maxVal - minVal;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Slope Comparison Calculation Dash */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto">
                  <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheckSlope ? (st.isAscending ? 'border-sky-300 ring-4 ring-sky-100' : 'border-rose-300 ring-4 ring-rose-100') : 'border-slate-200'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><TrendingUp size={14}/> Slope Detection</span>
                      
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono">
                          
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">nums[mid]</span>
                              <div className="bg-amber-50 border-2 border-amber-200 text-amber-800 text-3xl font-black px-6 py-2 rounded-xl">
                                  {st.valMid !== undefined ? st.valMid : '?'}
                              </div>
                          </div>
                          
                          <span className={`text-3xl font-black ${st.hlCheckSlope ? (st.isAscending ? 'text-sky-500' : 'text-rose-500') : 'text-slate-300'}`}>
                              {st.hlCheckSlope ? (st.isAscending ? '<' : '>') : 'vs'}
                          </span>
                          
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">nums[mid + 1]</span>
                              <div className="bg-sky-50 border-2 border-sky-200 text-sky-800 text-3xl font-black px-6 py-2 rounded-xl">
                                  {st.valMidPlus1 !== undefined ? st.valMidPlus1 : '?'}
                              </div>
                          </div>

                          <div className="flex flex-col items-center border-l-2 border-slate-100 pl-4 md:pl-8 min-w-[120px]">
                              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Action</span>
                              {st.hlCheckSlope ? (
                                  <span className={`text-sm font-black uppercase px-3 py-2 rounded shadow-sm flex items-center gap-2 ${st.isAscending ? 'text-sky-700 bg-sky-100 border border-sky-300' : 'text-rose-700 bg-rose-100 border border-rose-300'}`}>
                                      {st.isAscending ? <><ArrowRight size={16}/> Go Right</> : <><ArrowLeft size={16}/> Go Left</>}
                                  </span>
                              ) : (
                                  <span className="text-slate-300 italic text-sm">Waiting...</span>
                              )}
                          </div>

                      </div>
                  </div>
              </div>

              {/* Bottom: Search Space Bar Chart & Number Grid */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><BarChart2 size={12}/> Topographic Array Representation</span>
                  
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 relative z-10 w-full max-w-5xl px-4 items-end min-h-[220px] pb-6 border-b-2 border-slate-200">
                      {st.nums.map((val: number, idx: number) => {
                          let isMid = st.mid === idx;
                          let isMidPlus1 = st.mid !== undefined && idx === st.mid + 1;
                          let isLeft = st.left === idx;
                          let isRight = st.right === idx;
                          
                          let outOfBounds = st.left !== undefined && st.right !== undefined && (idx < st.left || idx > st.right);
                          let isFinalAns = st.isSuccess && val === st.nums[st.finalAns] && idx === st.finalAns;
                          
                          let bgClass = "bg-white border-slate-300";
                          let textClass = "text-slate-700";
                          let barColor = "bg-slate-300";

                          if (isFinalAns) {
                              bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 z-30 scale-110 shadow-xl";
                              textClass = "text-emerald-900";
                              barColor = "bg-emerald-400";
                          } else if (outOfBounds) {
                              bgClass = "bg-slate-100 border-slate-200 opacity-30 scale-95";
                              textClass = "text-slate-400";
                              barColor = "bg-slate-200";
                          } else if (isMid) {
                              bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 z-30 scale-105 shadow-lg";
                              textClass = "text-amber-900";
                              barColor = "bg-amber-400";
                          } else if (isMidPlus1) {
                              bgClass = "bg-sky-50 border-sky-400 ring-2 ring-sky-200 z-20 scale-105 shadow-md";
                              textClass = "text-sky-900";
                              barColor = "bg-sky-400";
                          } else if (isLeft || isRight) {
                              bgClass = "bg-indigo-50 border-indigo-400 z-10";
                              textClass = "text-indigo-800";
                              barColor = "bg-indigo-300";
                          }

                          // Calculate height percentage for the bar
                          // Give a minimum 10% height so 0 values are still visible
                          let heightPct = Math.max(10, ((val - minVal) / (range || 1)) * 100);

                          return (
                              <div key={`num-${idx}`} className={`relative transition-all duration-500 flex flex-col items-center gap-2 justify-end h-full`}>
                                  
                                  {/* Pointer Annotations */}
                                  <div className="absolute -top-10 flex gap-1 items-end h-8">
                                      {isFinalAns && (
                                           <div className="flex flex-col items-center animate-bounce z-40 text-emerald-600">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-emerald-50 px-1 rounded border border-emerald-200 shadow-sm">Peak</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}
                                      {!isFinalAns && isMid && (
                                          <div className="flex flex-col items-center animate-pulse z-40 text-amber-500">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm">mid</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}
                                      {!isFinalAns && isMidPlus1 && (
                                          <div className="flex flex-col items-center animate-pulse z-40 text-sky-500">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-sky-50 px-1 rounded border border-sky-200 shadow-sm">m+1</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}
                                  </div>

                                  {/* The visual bar graph representation */}
                                  <div className={`w-8 md:w-12 rounded-t-md transition-all duration-500 ${barColor}`} style={{ height: `${heightPct * 1.5}px` }}></div>

                                  <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300 relative`}>
                                      <span className={`font-mono font-black text-base md:text-xl ${textClass}`}>
                                          {val}
                                      </span>

                                      {/* L and R indicators overlaying the box */}
                                      <div className="absolute -bottom-5 w-full flex justify-center items-start pt-1 z-40 gap-1">
                                          {isLeft && !outOfBounds && <span className="text-[8px] font-black text-indigo-600 bg-indigo-100 border border-indigo-300 px-1 rounded shadow-sm">L</span>}
                                          {isRight && !outOfBounds && <span className="text-[8px] font-black text-indigo-600 bg-indigo-100 border border-indigo-300 px-1 rounded shadow-sm">R</span>}
                                      </div>
                                  </div>
                                  
                                  <span className={`absolute -bottom-9 font-mono text-[8px] font-bold ${isLeft || isRight ? 'text-indigo-600' : 'text-slate-400'}`}>idx:{idx}</span>
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
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Find Peak Element</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 162</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><TrendingUp size={28}/> Climb the Mountain</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A peak element is an element that is strictly greater than its neighbors.</p>
                        <p>Given a 0-indexed integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to <strong>any of the peaks</strong>.</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li>You may imagine that <code>nums[-1] = nums[n] = -∞</code>. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.</li>
                        </ul>
                        <p className="font-bold mt-4">You must write an algorithm that runs in <code>O(log n)</code> time.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [1,2,3,1]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">2</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">3 is a peak element and your function should return the index number 2.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= nums.length &lt;= 1000</li>
                            <li>-2^31 &lt;= nums[i] &lt;= 2^31 - 1</li>
                            <li>nums[i] != nums[i + 1] for all valid i</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">Finding a peak via linear scan takes $O(N)$ time. The problem explicitly demands an $O(\log N)$ solution. Logarithmic time on arrays almost exclusively implies using Binary Search. But how can we use binary search on an array that isn't sorted?</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Follow the rising slope!</strong> By comparing <code>nums[mid]</code> and <code>nums[mid+1]</code>, we can determine which direction the graph is sloping. If it's sloping upwards, a peak MUST exist to the right (since the boundary drops to $-\infty$). If it slopes downwards, a peak MUST exist to the left. We safely discard half the array based solely on local slope detection.</p>
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
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array 'nums' (Max 15)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 1, 3, 5, 6, 4" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> PEAK FOUND</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully converged on a local peak at index {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheckSlope ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Topographic Array Render</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">How Binary Search extends beyond perfectly sorted arrays.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><TrendingUp size={24} className="text-amber-500"/> 1. Searching Unsorted Data</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Normally, binary search requires a strictly sorted array. However, we can apply it whenever we can establish a <strong>discardable half</strong> property. Here, the rule is simple: if you are climbing a mountain (the slope is rising), a peak must eventually exist ahead of you.</p>
                        <p className="text-slate-600 leading-relaxed">Because the problem dictates that boundaries at $-1$ and $N$ are $-\infty$, if the array goes up, it MUST eventually come down before it hits the end, guaranteeing a peak. If it goes down, it MUST have peaked somewhere behind you.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRight size={24} className="text-sky-500"/> 2. The Pointer Convergence</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that our loop condition is <code>while (left &lt; right)</code> instead of the standard <code>&lt;=</code>.</p>
                        <p className="text-slate-600 leading-relaxed">We use <code>&lt;</code> because we are comparing <code>mid</code> with <code>mid + 1</code>. If <code>left == right</code>, then <code>mid = left</code>, and <code>mid + 1</code> would result in an OutOfBounds exception. When the loop terminates, <code>left</code> and <code>right</code> have converged onto the exact same index, which by elimination MUST be a peak. Thus, we safely return <code>left</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(log N).</strong> We divide the search space by half at every step. For an array of size $N$, this takes at most $\log_2(N)$ comparisons.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only use integer pointers (<code>left</code>, <code>right</code>, <code>mid</code>). No auxiliary arrays or recursive stacks are required.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a trick question. Interviewers give you an unsorted array and ask for an O(log N) solution to see if you rigidly memorize algorithms or if you understand the underlying 'halving' concept."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What happens if the array is strictly descending, like [5, 4, 3, 2, 1]?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The algorithm works perfectly.</p>
                            <p>Because every <code>nums[mid] &gt; nums[mid + 1]</code> (the slope is falling), the algorithm will repeatedly execute the <code>else</code> branch: <code>right = mid</code>. It will keep squeezing the right boundary inward until <code>right = 0</code> and <code>left = 0</code>. The loop ends, and we return index 0. Since 5 is greater than its only valid neighbor (4), it is indeed a peak!"</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Could there be multiple peaks? Which one does this find?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, jagged arrays like [1, 5, 1, 6, 1] have multiple peaks (5 and 6).</p>
                            <p>This algorithm finds <em>a</em> local maximum, not necessarily the global maximum. The exact peak it lands on depends entirely on the array length and where the initial `mid` calculations fall. It just blindly follows the nearest upward slope until it hits the first peak it encounters."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why is it <code>right = mid</code> instead of <code>right = mid - 1</code> in the else block?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If <code>nums[mid] &gt; nums[mid + 1]</code>, the slope is falling. This means <code>nums[mid]</code> is greater than the element to its right.</p>
                            <p>Because of this, <code>nums[mid]</code> itself is a valid candidate to be the peak! If we did <code>right = mid - 1</code>, we would permanently discard <code>mid</code> from our search space, potentially throwing away the exact peak we are looking for. By setting <code>right = mid</code>, we shrink the boundary but safely keep the current high-point in the search space."</p>
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
                              <TrendingUp size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheckSlope ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input Array 'nums' (Max 15)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, 2, 1, 3, 5, 6, 4" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">PEAK FOUND</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully converged on a peak element</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Peak Found At Index</div>
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
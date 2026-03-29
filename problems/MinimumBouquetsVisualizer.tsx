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
    complexity: 'Time: O(N log(MaxDay)) | Space: O(1)',
    theme: 'rose',
    code: `public int minDays(int[] bloomDay, int m, int k) {
    long val = (long) m * k;
    if (val > bloomDay.length) return -1;
    
    int left = Integer.MAX_VALUE;
    int right = Integer.MIN_VALUE;
    for (int day : bloomDay) {
        left = Math.min(left, day);
        right = Math.max(right, day);
    }
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        int bouquets = 0;
        int flowers = 0;
        
        for (int day : bloomDay) {
            if (day <= mid) {
                flowers++;
                if (flowers == k) {
                    bouquets++;
                    flowers = 0;
                }
            } else {
                flowers = 0;
            }
        }
        
        if (bouquets >= m) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
    desc: "The Optimal Approach: Binary Search on the Search Space of Answers. The minimum possible day is the earliest bloom day, and the maximum is the latest bloom day. We binary search this range! For a guessed day 'mid', we iterate through all flowers. If a flower blooms on or before 'mid', we increment our consecutive flower streak. Once our streak reaches 'k', we form a bouquet and reset the streak. If an unbloomed flower breaks the streak, we reset the streak. If we can form at least 'm' bouquets, this day works, and we try an even earlier day (right = mid). If we fall short, we need more time (left = mid + 1)."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|minDays|bloomDay|m|k|val|left|right|mid|bouquets|flowers|day|Math|min|max|length|MAX_VALUE|MIN_VALUE|Integer)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isPointer = ['bloomDay', 'm', 'k', 'val', 'left', 'right', 'mid', 'bouquets', 'flowers', 'day', 'length', 'MAX_VALUE', 'MIN_VALUE'].includes(part);
            const isMapCall = ['minDays', 'min', 'max'].includes(part);
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

export default function MinimumBouquetsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('binarySearchAnswer');
  
  const [bloomDayInput, setBloomDayInput] = useState('1, 10, 3, 10, 2');
  const [mInput, setMInput] = useState('3');
  const [kInput, setKInput] = useState('1');
  
  const [baseBloomDay, setBaseBloomDay] = useState<number[]>([1, 10, 3, 10, 2]);
  const [baseM, setBaseM] = useState<number>(3);
  const [baseK, setBaseK] = useState<number>(1);

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
      let parsedBloom = bloomDayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
      if (parsedBloom.length === 0) parsedBloom = [1, 10, 3, 10, 2];
      if (parsedBloom.length > 15) parsedBloom = parsedBloom.slice(0, 15); // UI bounds limitation

      let parsedM = parseInt(mInput.trim(), 10);
      if (isNaN(parsedM) || parsedM < 1) parsedM = 3;
      
      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 1;

      setBaseBloomDay(parsedBloom);
      setBaseM(parsedM);
      setBaseK(parsedK);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [bloomDayInput, mInput, kInput, selectedOpId]);

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
    const bloomDay = [...baseBloomDay];
    const m = baseM;
    const k = baseK;
    const n = bloomDay.length;

    // Hoist variables so the closure captures their latest values persistently
    let left: number | string | undefined = undefined;
    let right: number | string | undefined = undefined;
    let mid: number | undefined = undefined;
    let bouquets: number | undefined = undefined;
    let flowers: number | undefined = undefined;
    let isValid: boolean | undefined = undefined;
    
    let bouquetGroups: number[][] = [];
    let currentGroup: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            bloomDay, m, k, left, right, mid, bouquets, flowers, isValid, bouquetGroups, currentGroup, ...st 
        } 
    });

    add("Function Call", "Entering minDays with the provided input.", 1, {});

    add("Check Possibility", "Calculating total required flowers (m * k).", 2, { hlInitCheck: true });
    
    if (m * k > n) {
        add("Impossible Condition", `Total required flowers > array length. Returning -1.`, 3, { isSuccess: true, finalAns: -1 });
        return steps;
    }

    let actualLeft = Number.MAX_SAFE_INTEGER;
    let actualRight = Number.MIN_SAFE_INTEGER;
    
    add("Initialize Left Bound", `int left = Integer.MAX_VALUE;\nSetting left bound to maximum possible value to find the minimum.`, 5, { hlInitBounds: true, left: "MAX_VALUE" });
    add("Initialize Right Bound", `int right = Integer.MIN_VALUE;\nSetting right bound to minimum possible value to find the maximum.`, 6, { hlInitBounds: true, left: "MAX_VALUE", right: "MIN_VALUE" });
    
    for (let i = 0; i < n; i++) {
        let day = bloomDay[i];
        
        let displayLeft = actualLeft === Number.MAX_SAFE_INTEGER ? "MAX_VALUE" : actualLeft;
        let displayRight = actualRight === Number.MIN_SAFE_INTEGER ? "MIN_VALUE" : actualRight;

        add("Traverse Array", `for (int day : bloomDay)\nExamining flower ${i} (blooms on day ${day}).`, 7, { hlInitLoop: true, activeInitIdx: i, left: displayLeft, right: displayRight, curDay: day });
        
        let newLeft = Math.min(actualLeft, day);
        let leftUpdated = newLeft !== actualLeft;
        actualLeft = newLeft;
        add("Update Min (Left)", `left = Math.min(left, day);\nComparing current left with ${day}. Minimum is now ${actualLeft}.`, 8, { hlInitLoopLeft: true, activeInitIdx: i, left: actualLeft, right: displayRight, curDay: day, leftUpdated });
        
        let newRight = Math.max(actualRight, day);
        let rightUpdated = newRight !== actualRight;
        actualRight = newRight;
        add("Update Max (Right)", `right = Math.max(right, day);\nComparing current right with ${day}. Maximum is now ${actualRight}.`, 9, { hlInitLoopRight: true, activeInitIdx: i, left: actualLeft, right: actualRight, curDay: day, rightUpdated });
    }
    
    left = actualLeft;
    right = actualRight;

    while (left < right) {
        if (steps.length > 2500) break; // Safety net for massive iterations

        add("Binary Search Loop", `Search space is valid (${left} < ${right}).`, 12, { hlWhile: true, left, right });

        mid = left + Math.floor((right - left) / 2);
        add("Guess Day (Mid)", `Evaluating if we can make bouquets by day ${mid}.`, 13, { hlMid: true, left, right, mid });

        bouquets = 0;
        add("Init Bouquets Counter", `Starting with 0 bouquets for this day.`, 14, { hlEvalInit: true, left, right, mid, bouquets });
        
        flowers = 0;
        bouquetGroups = [];
        currentGroup = [];
        add("Init Flowers Counter", `Starting with 0 consecutive flowers for this day.`, 15, { hlEvalInit: true, left, right, mid, bouquets, flowers });

        for (let i = 0; i < n; i++) {
            let day = bloomDay[i];
            add("Check Flower", `Examining flower ${i} (blooms on day ${day}).`, 17, { hlEvalLoop: true, left, right, mid, bouquets, flowers, activeIdx: i });
            
            let isBloomed = day <= mid;
            add("Check Bloom Status", `Does it bloom on or before day ${mid}? (${isBloomed ? 'Yes' : 'No'})`, 18, { hlCheckBloom: true, left, right, mid, bouquets, flowers, activeIdx: i, isBloomed });

            if (isBloomed) {
                flowers++;
                currentGroup.push(i);
                add("Increment Streak", `Consecutive bloomed flowers streak is now ${flowers}.`, 19, { hlIncFlowers: true, left, right, mid, bouquets, flowers, activeIdx: i, isBloomed });
                
                add("Check Bouquet Complete", `Do we have enough consecutive flowers (${k}) for a bouquet?`, 20, { hlCheckBouquet: true, left, right, mid, bouquets, flowers, activeIdx: i });
                
                if (flowers === k) {
                    bouquets++;
                    add("Form Bouquet", `Formed a bouquet! Total bouquets so far: ${bouquets}.`, 21, { hlFormBouquet: true, left, right, mid, bouquets, flowers, activeIdx: i });
                    
                    bouquetGroups.push([...currentGroup]);
                    flowers = 0;
                    currentGroup = [];
                    add("Reset Streak", `Streak resets to 0 after forming a bouquet.`, 22, { hlFormBouquet: true, left, right, mid, bouquets, flowers, activeIdx: i });
                }
            } else {
                flowers = 0;
                currentGroup = [];
                add("Reset Streak", `Flower ${i} is not bloomed. It breaks the streak. Streak resets to 0.`, 25, { hlResetFlowers: true, left, right, mid, bouquets, flowers, activeIdx: i, isBloomed });
            }
        }

        isValid = bouquets >= m;
        add("Evaluate Result", `Did we make at least ${m} bouquets? (${isValid ? 'Yes' : 'No'})`, 29, { hlCheckValid: true, left, right, mid, bouquets, isValid });

        if (isValid) {
            let oldRight = right;
            right = mid;
            add("Day is Sufficient", `Day ${mid} works! We discard later days by setting right = ${right}.`, 30, { hlMoveRight: true, left, right, mid, bouquets, isValid, oldRight });
        } else {
            let oldLeft = left;
            left = mid + 1;
            add("Day is Insufficient", `Day ${mid} failed (only made ${bouquets} bouquets). We need more time. Setting left = ${left}.`, 32, { hlMoveLeft: true, left, right, mid, bouquets, isValid, oldLeft });
        }
    }

    add("Loop Exit", `The pointers have converged (${left} == ${right}). The optimal minimum day is isolated.`, 12, { hlWhileEnd: true, left, right });
    
    add("Return Result", `Returning minimum days: ${left}.`, 35, { isSuccess: true, finalAns: left, left, right });

    return steps;
  }, [baseBloomDay, baseM, baseK, selectedOpId]);

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
      if (st.bloomDay === undefined) return null;

      let isSuccessEnd = st.hlPhase === 'success';

      if (st.hlInitBounds || st.hlInitLoop || st.hlInitLoopLeft || st.hlInitLoopRight) {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-indigo-200 scale-105 z-40`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Finding Initial Boundaries</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono">
                      {/* Left Bound Tracker */}
                      <div className="flex flex-col items-center w-[120px]">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">Left (Min)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 w-full text-center rounded-2xl transition-all duration-300 ${st.hlInitLoopLeft && st.leftUpdated ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                              {st.left !== undefined ? (st.left === "MAX_VALUE" ? <span className="text-sm">MAX_VALUE</span> : st.left) : '-'}
                          </div>
                      </div>

                      {/* Current Element */}
                      {st.curDay !== undefined ? (
                          <>
                              <ArrowRight size={24} className="text-slate-300" />
                              <div className="flex flex-col items-center w-[120px]">
                                  <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1">Current Day</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-3 w-full text-center rounded-2xl transition-all duration-300 bg-amber-100 border-amber-500 text-amber-800 shadow-lg scale-110`}>
                                      {st.curDay}
                                  </div>
                              </div>
                              <ArrowRight size={24} className="text-slate-300" />
                          </>
                      ) : (
                          <>
                              <div className="w-8 h-8 opacity-0"></div>
                              <div className="w-[120px] h-20 opacity-0"></div>
                              <div className="w-8 h-8 opacity-0"></div>
                          </>
                      )}

                      {/* Right Bound Tracker */}
                      <div className="flex flex-col items-center w-[120px]">
                          <span className="text-[10px] font-bold uppercase text-rose-500 mb-1 flex items-center gap-1">Right (Max)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 w-full text-center rounded-2xl transition-all duration-300 ${st.hlInitLoopRight && st.rightUpdated ? 'bg-rose-100 border-rose-500 text-rose-800 scale-110 shadow-lg' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                              {st.right !== undefined ? (st.right === "MIN_VALUE" ? <span className="text-sm">MIN_VALUE</span> : st.right) : '-'}
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheckValid ? (st.isValid ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-rose-300 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Sun size={14}/> Active Day Evaluation</span>
              
              {st.finalAns === -1 ? (
                  <div className="flex flex-col items-center text-rose-500 font-mono py-4">
                      <ShieldAlert size={48} className="mb-2" />
                      <span className="text-xl font-black uppercase tracking-widest">Mathematically Impossible</span>
                      <span className="text-sm mt-2 text-rose-400">m * k &gt; array.length</span>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono">
                      
                      {/* Guessed Speed */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Target size={12}/> Guessed Day (mid)</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlMid ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                              {st.mid !== undefined ? st.mid : '?'}
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className="text-slate-300" />
                      
                      {/* Total Bouquets Computed */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-rose-500 mb-1 flex items-center gap-1"><Flower2Icon/> Bouquets Formed</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${(st.hlFormBouquet || st.hlEvalInit || st.hlCheckValid || st.hlMoveLeft || st.hlMoveRight) ? 'bg-rose-100 border-rose-500 text-rose-800 scale-110 shadow-lg' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                              {st.bouquets !== undefined ? st.bouquets : '?'}
                          </div>
                      </div>

                      {/* Comparison to Target */}
                      <div className="flex flex-col items-center border-l-2 border-slate-100 pl-4 md:pl-8 min-w-[150px]">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">&ge; Target (m)</span>
                          <div className="flex flex-col items-center gap-2">
                              <span className="bg-slate-800 text-white text-3xl font-black px-6 py-2 rounded-xl w-full text-center">
                                  {st.m}
                              </span>
                              {st.isValid !== undefined && (
                                  <span className={`text-xs font-black uppercase px-2 py-1 w-full text-center rounded ${st.isValid ? 'text-emerald-700 bg-emerald-100 border border-emerald-300' : 'text-rose-700 bg-rose-100 border border-rose-300'}`}>
                                      {st.isValid ? 'Sufficient' : 'Insufficient'}
                                  </span>
                              )}
                          </div>
                      </div>

                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (st.bloomDay === undefined) return <span className="text-slate-400 italic">empty</span>;

      const maxDayVal = Math.max(...st.bloomDay);
      const minDayVal = Math.min(...st.bloomDay);
      const range = maxDayVal - minDayVal;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Garden Array Representation */}
              {st.finalAns !== -1 && (
                  <div className="flex flex-col items-center w-full mt-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-rose-50 text-rose-600 border-rose-200 flex items-center gap-2`}><BarChart2 size={12}/> Flower Blooming Visualization</span>
                      
                      <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative z-10 w-full max-w-5xl px-4 items-end min-h-[200px] pb-10 border-b-2 border-slate-200">
                          
                          {/* MID Level Line */}
                          {st.mid !== undefined && (
                              <div className="absolute w-full border-t-2 border-dashed border-amber-400 z-0 transition-all duration-500" 
                                  style={{ bottom: `${40 + Math.max(15, ((st.mid - minDayVal) / (range || 1)) * 140)}px` }}>
                                  <span className="absolute -top-3 left-4 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">mid = {st.mid}</span>
                              </div>
                          )}

                          {st.bloomDay.map((val: number, idx: number) => {
                              let isActive = st.activeIdx === idx;
                              let isInitActive = st.activeInitIdx === idx;
                              let isBloomed = st.mid !== undefined && val <= st.mid;
                              let inCurrentGroup = st.currentGroup?.includes(idx);
                              let inFormedBouquet = st.bouquetGroups?.some((group: number[]) => group.includes(idx));
                              
                              let bgClass = "bg-white border-slate-300";
                              let textClass = "text-slate-500";
                              let barColor = "bg-slate-200";

                              if (isInitActive) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-200 z-30 scale-110 shadow-lg";
                                  textClass = "text-amber-900";
                              } else if (st.hlInitBounds || st.hlInitLoop || st.hlInitLoopLeft || st.hlInitLoopRight) {
                                  if (st.activeInitIdx !== undefined && idx < st.activeInitIdx) {
                                      bgClass = "bg-slate-100 border-slate-300 opacity-60"; 
                                  }
                              } else if (isActive) {
                                  bgClass = "bg-sky-100 border-sky-400 ring-4 ring-sky-200 z-30 scale-110 shadow-lg";
                                  textClass = "text-sky-900";
                              } else if (inFormedBouquet) {
                                  bgClass = "bg-rose-100 border-rose-400 shadow-md z-20";
                                  textClass = "text-rose-800";
                                  barColor = "bg-rose-300";
                              } else if (inCurrentGroup) {
                                  bgClass = "bg-emerald-50 border-emerald-300 shadow-md z-10";
                                  textClass = "text-emerald-700";
                                  barColor = "bg-emerald-300";
                              } else if (isBloomed) {
                                  bgClass = "bg-emerald-50 border-emerald-200";
                                  textClass = "text-emerald-600";
                                  barColor = "bg-emerald-200";
                              }

                              // Calculate visual height mapping
                              let heightPct = Math.max(15, ((val - minDayVal) / (range || 1)) * 140);

                              return (
                                  <div key={`flower-${idx}`} className={`relative transition-all duration-500 flex flex-col items-center gap-2 justify-end h-full z-10`}>
                                      
                                      {isActive && (
                                          <div className="absolute -top-10 flex flex-col items-center animate-bounce z-40 text-sky-600">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-sky-50 px-1 rounded border border-sky-200 shadow-sm">checking</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}
                                      {isInitActive && (
                                          <div className="absolute -top-10 flex flex-col items-center animate-bounce z-40 text-amber-600">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm">checking</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}

                                      <div className={`w-8 md:w-10 rounded-t-md transition-all duration-500 ${barColor}`} style={{ height: `${heightPct}px` }}></div>

                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex flex-col items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-sm md:text-lg ${textClass}`}>
                                              {val}
                                          </span>
                                      </div>
                                  </div>
                              )
                          })}

                          {/* Render Bouquet Brackets */}
                          {st.bouquetGroups?.map((group: number[], bIdx: number) => {
                              if (group.length === 0) return null;
                              const firstIdx = group[0];
                              const lastIdx = group[group.length - 1];
                              // Approximate positioning based on index (assuming flex gap logic)
                              // This is a visual heuristic.
                              
                              // We use absolute positioning trick over the flex container
                              return null; // Opted for styling the blocks themselves to avoid complex bounding box math in flex layout
                          })}

                      </div>
                      
                      {/* Separate Grouping visualizer */}
                      {st.hlCheckBloom || st.hlCheckBouquet || st.hlCheckValid || st.hlFormBouquet || st.hlEvalLoop || st.hlEvalInit || st.hlIncFlowers || st.hlResetFlowers || st.hlMoveLeft || st.hlMoveRight ? (
                          <div className="flex gap-2 md:gap-4 mt-4 items-center h-8">
                              <span className="text-[10px] font-bold uppercase text-slate-400">Current Streak:</span>
                              <div className="flex gap-1">
                                  {Array.from({ length: st.k || 1 }).map((_, i) => (
                                      <div key={`streak-${i}`} className={`w-4 h-4 rounded-full border ${i < (st.flowers || 0) ? 'bg-emerald-400 border-emerald-500 shadow-sm' : 'bg-slate-100 border-slate-300'}`}></div>
                                  ))}
                              </div>
                          </div>
                      ) : (
                          <div className="h-8 mt-4"></div>
                      )}
                  </div>
              )}
              
              {/* Bottom: Search Space Number Line */}
              {st.finalAns !== -1 && !st.hlInitBounds && !st.hlInitLoop && !st.hlInitLoopLeft && !st.hlInitLoopRight && (
                  <div className="flex flex-col items-center w-full mt-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><ArrowLeftRight size={12}/> Day Search Space (Binary Search)</span>
                      
                      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 relative z-10 w-full max-w-6xl px-2">
                          {/* Render up to maxPile elements if small enough, otherwise scale it. Max UI constraint is 40. */}
                          {Array.from({ length: maxDayVal || 0 }, (_, i) => i + 1).map((val: number) => {
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

                                      <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 rounded-lg shadow-sm ${bgClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-xs md:text-sm ${textClass}`}>
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
              )}

          </div>
      );
  };

  const Flower2Icon = () => <Sparkles size={12} />; // fallback icon for flower

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Sun className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Minimum Days to Make Bouquets</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search (Answer)
                  </span>
                  <span>•</span>
                  <span>LeetCode 1482</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Sun size={28}/> Waiting for Blooms</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>bloomDay</code>, an integer <code>m</code> and an integer <code>k</code>.</p>
                        <p>You want to make <code>m</code> bouquets. To make a bouquet, you need to use <code>k</code> <strong>adjacent flowers</strong> from the garden.</p>
                        <p>The garden consists of <code>n</code> flowers, the <code>i-th</code> flower will bloom in the <code>bloomDay[i]</code> and then can be used in <strong>exactly one</strong> bouquet.</p>
                        <p className="font-bold mt-4">Return the minimum number of days you need to wait to be able to make <code>m</code> bouquets from the garden. If it is impossible to make m bouquets return <code>-1</code>.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> bloomDay = [1,10,3,10,2], m = 3, k = 1</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">3</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">We need 3 bouquets each containing 1 flower.<br/>After day 1: [x, _, _, _, _]   // we can only make one bouquet.<br/>After day 2: [x, _, _, _, x]   // we can only make two bouquets.<br/>After day 3: [x, _, x, _, x]   // we can make 3 bouquets. The answer is 3.</span>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> bloomDay = [1,10,3,10,2], m = 3, k = 2</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">-1</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">We need 3 bouquets each containing 2 flowers, that means we need 6 flowers. We only have 5 flowers so it is impossible to get the needed bouquets and we return -1.</span>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">12</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">We need 2 bouquets each containing 3 flowers.<br/>After day 7: [x, x, x, x, _, x, x]<br/>We can make one bouquet of the first three flowers that bloomed. We cannot make another bouquet from the last three flowers that bloomed because they are not adjacent.<br/>After day 12: [x, x, x, x, x, x, x]<br/>It is obvious that we can make two bouquets in different ways.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>bloomDay.length == n</li>
                            <li>1 &lt;= n &lt;= 10^5</li>
                            <li>1 &lt;= bloomDay[i] &lt;= 10^9</li>
                            <li>1 &lt;= m &lt;= 10^6</li>
                            <li>1 &lt;= k &lt;= 10^5</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ShieldAlert size={16} className="text-rose-500"/> The Impossible Check</h4>
                        <p className="text-sm leading-relaxed">Before doing any search, we can do a quick mathematical check. We need `m` bouquets, each requiring `k` flowers. That means we absolutely require `m * k` flowers in total. If `m * k &gt; bloomDay.length`, it is mathematically impossible, and we immediately return `-1`.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Binary Search Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The minimum possible days we wait is `min(bloomDay)` and the max is `max(bloomDay)`. Because day increments monotonically (if we can make bouquets on day X, we can definitely make them on day X+1), we can binary search this timeline! We guess a day `mid`, scan the array for consecutive bloomed flowers, and count how many bouquets we can form.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>bloomDay Array (Max 15)</label>
                            <input type="text" value={bloomDayInput} onChange={(e) => setBloomDayInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 10, 3, 10, 2" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Bouquets (m)</label>
                            <input type="number" min="1" max="100" value={mInput} onChange={(e) => setMInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Flowers (k)</label>
                            <input type="number" min="1" max="100" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="1" />
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
                                {st.finalAns !== -1 ? <PartyPopper size={24}/> : <ShieldAlert size={24}/>}
                                {st.finalAns !== -1 ? "OPTIMAL DAY FOUND" : "MATHEMATICALLY IMPOSSIBLE"}
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.finalAns !== -1 ? `Minimum waiting days is ${st.finalAns}.` : `Cannot form ${st.m} bouquets of ${st.k} flowers.`}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheckBloom || st.hlCheckBouquet || st.hlCheckValid ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                            
                            {/* Persistent State Monitor */}
                            {st.finalAns !== -1 && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">left</span>
                                        <span className="font-mono font-black text-sky-400">{st.left !== undefined ? (st.left === "MAX_VALUE" ? 'MAX' : st.left) : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">mid</span>
                                        <span className="font-mono font-black text-amber-400">{st.mid !== undefined ? st.mid : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">right</span>
                                        <span className="font-mono font-black text-indigo-400">{st.right !== undefined ? (st.right === "MIN_VALUE" ? 'MIN' : st.right) : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">bouquets</span>
                                        <span className="font-mono font-black text-rose-400">{st.bouquets !== undefined ? st.bouquets : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">target (m)</span>
                                        <span className="font-mono font-black text-emerald-400">{st.m !== undefined ? st.m : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Blooming Render View</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the 'Binary Search on Answer' paradigm for contiguous arrays.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Target size={24} className="text-rose-500"/> 1. Binary Searching the "Answer Space"</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Like Koko Eating Bananas, we are searching through a <strong>range of possible answers</strong>. The earliest we can make bouquets is <code>min(bloomDay)</code>. The latest is <code>max(bloomDay)</code>.</p>
                        <p className="text-slate-600 leading-relaxed">The logic is monotonic: if day X works, every day &gt; X is guaranteed to work (more flowers will bloom). We binary search this timeline. If our guessed day <code>mid</code> works, we try to find an earlier day (search left). If it fails, we must wait longer (search right).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-sky-500"/> 2. The Contiguous Check</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To verify if a day works, we iterate through the array. We maintain a <code>flowers</code> streak counter. If a flower blooms by <code>mid</code>, we increment the streak. If it hits <code>k</code>, we increment our <code>bouquets</code> counter and <strong>reset the streak to 0</strong> (since a flower can only be in one bouquet).</p>
                        <p className="text-slate-600 leading-relaxed">Crucially, if a flower has NOT bloomed, it breaks the adjacency rule. We MUST reset the <code>flowers</code> streak to 0.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N log(MaxDay)).</strong> The search space size is $MaxDay - MinDay$. We halve this space logarithmically. In every halving step, we iterate through the entire array of N flowers to verify the contiguous streaks.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only use integer variables for pointers and counters. No extra memory structures are required.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-rose-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem tests two things: spotting the Binary Search on Answer pattern, and cleanly implementing a sliding window/contiguous streak check inside the verification function."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we cast `m * k` to a `long` before checking if it exceeds the array length?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent integer overflow."</p>
                            <p>The constraints state <code>m &le; 10^6</code> and <code>k &le; 10^5</code>. Their maximum possible product is <code>10^11</code>, which greatly exceeds the maximum value of a 32-bit signed integer (<code>~2 * 10^9</code>). If we didn't cast to <code>long</code>, the multiplication would silently wrap around into a negative number, falsely bypassing the impossible check and causing a crash later!"</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "Could we sort the `bloomDay` array first to make it faster?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, that would destroy the logic."</p>
                            <p>The problem strictly requires using <strong>adjacent</strong> flowers to form a bouquet. Sorting the array would completely destroy the physical adjacency of the flowers in the garden. We binary search the <em>values</em> (days), but we must iterate through the <em>original</em> array to verify the contiguous subsegment rule."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Clock size={24}/></span>
                            <span>Q3: "Instead of finding `min` and `max` for bounds, could we just use `1` and `10^9`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but finding exact bounds is a good micro-optimization."</p>
                            <p>Using <code>1</code> and <code>10^9</code> is perfectly valid and asymptotically identical ($O(N \log(10^9))$ vs $O(N \log(Max-Min))$). However, in an interview, manually finding the exact <code>min</code> and <code>max</code> shows the interviewer that you deeply understand the actual mathematical search space rather than blindly relying on hardcoded constraints.</p>
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
                        {st.finalAns !== -1 && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">left</span>
                                    <span className="font-mono font-black text-sky-400">{st.left !== undefined ? (st.left === "MAX_VALUE" ? 'MAX' : st.left) : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">mid</span>
                                    <span className="font-mono font-black text-amber-400">{st.mid !== undefined ? st.mid : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">right</span>
                                    <span className="font-mono font-black text-indigo-400">{st.right !== undefined ? (st.right === "MIN_VALUE" ? 'MIN' : st.right) : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">bouquets</span>
                                    <span className="font-mono font-black text-rose-400">{st.bouquets !== undefined ? st.bouquets : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">target (m)</span>
                                    <span className="font-mono font-black text-emerald-400">{st.m !== undefined ? st.m : '-'}</span>
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
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>bloomDay Array</label>
                              <input type="text" value={bloomDayInput} onChange={(e) => setBloomDayInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, 10, 3, 10, 2" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Bouquets (m)</label>
                              <input type="number" min="1" max="100" value={mInput} onChange={(e) => setMInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="3" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Flowers (k)</label>
                              <input type="number" min="1" max="100" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="1" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns === -1 ? 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]' : 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns === -1 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns === -1 ? 'bg-rose-500/20 text-rose-500 ring-rose-500/10' : 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10'}`}>
                                    {st.finalAns === -1 ? <ShieldAlert size={48}/> : <Trophy size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.finalAns === -1 ? "MATHEMATICALLY IMPOSSIBLE" : "OPTIMAL DAY FOUND"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.finalAns === -1 ? 'text-rose-400' : 'text-emerald-400'}`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.finalAns === -1 ? 'text-rose-500' : 'text-emerald-500'}`}>Minimum Wait Time</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns} {st.finalAns !== -1 && <span className="text-xl text-slate-400">days</span>}</div>
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
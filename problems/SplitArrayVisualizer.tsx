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
  binarySearchAnswer: {
    id: 'binarySearchAnswer',
    title: '1. Binary Search on Answer',
    icon: <SplitSquareHorizontal size={16} />,
    complexity: 'Time: O(N log(Sum)) | Space: O(1)',
    theme: 'cyan',
    code: `public int splitArray(int[] nums, int k) {
    int left = 0, right = 0;
    for (int num : nums) {
        left = Math.max(left, num);
        right += num;
    }
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        int subarrays = 1;
        int currentSum = 0;
        
        for (int num : nums) {
            if (currentSum + num > mid) {
                subarrays++;
                currentSum = num;
            } else {
                currentSum += num;
            }
        }
        
        if (subarrays <= k) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
    desc: "The Optimal Approach: Binary Search on Answer. We want to minimize the largest sum among 'k' subarrays. The smallest possible max-sum is the largest single element in the array (left = max(nums)). The largest possible max-sum is if we didn't split the array at all (right = sum(nums)). We binary search this range! For a guessed max-sum 'mid', we greedily partition the array. If adding an element exceeds 'mid', we are forced to start a new subarray. If the total number of subarrays needed is \u2264 k, the guess 'mid' is valid, and we can try a smaller max-sum (right = mid). If it takes > k subarrays, the sum was too strict, and we must increase it (left = mid + 1)."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'cyan' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|splitArray|nums|k|num|left|right|mid|subarrays|currentSum|Math|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['nums', 'k', 'num', 'left', 'right', 'mid', 'subarrays', 'currentSum'].includes(part);
            const isMapCall = ['splitArray', 'max'].includes(part);
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

export default function SplitArrayVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('binarySearchAnswer');
  
  const [numsInput, setNumsInput] = useState('7, 2, 5, 10, 8');
  const [kInput, setKInput] = useState('2');
  
  const [baseNums, setBaseNums] = useState<number[]>([7, 2, 5, 10, 8]);
  const [baseK, setBaseK] = useState<number>(2);

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
      let parsedNums = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
      
      if (parsedNums.length === 0) parsedNums = [7, 2, 5, 10, 8];
      if (parsedNums.length > 15) parsedNums = parsedNums.slice(0, 15); // UI bounds limitation

      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 2;
      if (parsedK > parsedNums.length) parsedK = parsedNums.length;

      setBaseNums(parsedNums);
      setBaseK(parsedK);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, kInput, selectedOpId]);

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
    const kTarget = baseK;
    const n = nums.length;

    // Hoist variables so the closure captures their latest values persistently
    let left: number | undefined = undefined;
    let right: number | undefined = undefined;
    let mid: number | undefined = undefined;
    let subarrays: number | undefined = undefined;
    let currentSum: number | undefined = undefined;
    let isValid: boolean | undefined = undefined;
    
    let pastGroups: number[][] = [];
    let currentGroup: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            nums, kTarget, left, right, mid, subarrays, currentSum, isValid, pastGroups, currentGroup, ...st 
        } 
    });

    add("Function Call", `public int splitArray(int[] nums, int k=${kTarget})`, 1, {});

    let actualLeft = 0;
    let actualRight = 0;
    
    add("Initialize Bounds Variables", `int left = 0, right = 0;\nSetting up the search space boundary trackers.`, 2, { hlInitBounds: true, left: 0, right: 0 });
    
    for (let i = 0; i < n; i++) {
        let num = nums[i];
        
        add("Traverse Array", `for (int num : nums)\nExamining element ${i} with value ${num}.`, 3, { hlInitLoop: true, activeInitIdx: i, left: actualLeft, right: actualRight, curNum: num });
        
        let newLeft = Math.max(actualLeft, num);
        let leftUpdated = newLeft !== actualLeft;
        actualLeft = newLeft;
        add("Update Max Bound (Left)", `left = Math.max(left, num);\nComparing current left with ${num}. Max element is now ${actualLeft}.`, 4, { hlInitLoopLeft: true, activeInitIdx: i, left: actualLeft, right: actualRight, curNum: num, leftUpdated });
        
        actualRight += num;
        add("Update Sum Bound (Right)", `right += num;\nAdding element value to total sum. Right is now ${actualRight}.`, 5, { hlInitLoopRight: true, activeInitIdx: i, left: actualLeft, right: actualRight, curNum: num, rightUpdated: true });
    }
    
    left = actualLeft;
    right = actualRight;
    let initialLeft = actualLeft;
    let initialRight = actualRight;

    while ((left ?? 0) < (right ?? 0)) {
        if (steps.length > 2500) break; // Safety net

        add("Binary Search Loop", `while (left < right)\nSearch space is valid (${left} < ${right}).`, 8, { hlWhile: true, left, right, initialLeft, initialRight });

        mid = (left ?? 0) + Math.floor(((right ?? 0) - (left ?? 0)) / 2);
        add("Guess Max Sum (Mid)", `int mid = left + (right - left) / 2;\nGuessing the largest subarray sum mid = ${mid}.`, 9, { hlMid: true, left, right, mid, initialLeft, initialRight });

        subarrays = 1;
        add("Initialize Subarrays", `int subarrays = 1;\nStarting partition on the 1st subarray.`, 10, { hlEvalInitSubs: true, left, right, mid, subarrays, initialLeft, initialRight });
        
        currentSum = 0;
        pastGroups = [];
        currentGroup = [];
        add("Initialize Sum", `int currentSum = 0;\nInitial sum of the current subarray is 0.`, 11, { hlEvalInitSum: true, left, right, mid, subarrays, currentSum, initialLeft, initialRight });

        for (let i = 0; i < n; i++) {
            let num = nums[i];
            add("Process Element", `for (int num : nums)\nAttempting to add element ${i} (value ${num}) to current subarray.`, 13, { hlEvalLoop: true, left, right, mid, subarrays, currentSum, activeIdx: i, initialLeft, initialRight });
            
            let exceeds = (currentSum ?? 0) + num > (mid ?? 0);
            add("Check Capacity", `if (currentSum + num > mid)\nDoes ${(currentSum ?? 0)} + ${num} = ${(currentSum ?? 0) + num} exceed guessed max sum ${mid}? (${exceeds ? 'Yes' : 'No'})`, 14, { hlCheckCap: true, left, right, mid, subarrays, currentSum, activeIdx: i, isExceed: exceeds, curNum: num, initialLeft, initialRight });

            if (exceeds) {
                subarrays++;
                add("New Subarray Needed", `subarrays++;\nGuessed sum exceeded! We must start a new subarray. We now have ${subarrays} subarrays.`, 15, { hlNewSub: true, left, right, mid, subarrays, currentSum, activeIdx: i, isExceed: exceeds, curNum: num, initialLeft, initialRight });
                
                pastGroups.push([...currentGroup]);
                currentGroup = [];
                
                currentSum = num;
                currentGroup.push(i);
                add("Start New Sum", `currentSum = num;\nStarting the new subarray with element ${num}. Current sum is now ${currentSum}.`, 16, { hlSetSum: true, left, right, mid, subarrays, currentSum, activeIdx: i, isExceed: exceeds, curNum: num, initialLeft, initialRight });
            } else {
                currentSum += num;
                currentGroup.push(i);
                add("Add to Subarray", `currentSum += num;\nElement fits! Current sum of the subarray is now ${currentSum}.`, 18, { hlAddSum: true, left, right, mid, subarrays, currentSum, activeIdx: i, isExceed: exceeds, curNum: num, initialLeft, initialRight });
            }
        }
        pastGroups.push([...currentGroup]);

        isValid = (subarrays ?? 0) <= kTarget;
        add("Evaluate Result", `if (subarrays <= k)\nDid we partition into \u2264 ${kTarget} subarrays? (Took ${subarrays}: ${isValid ? 'Yes' : 'No'})`, 22, { hlCheckValid: true, left, right, mid, subarrays, isValid, initialLeft, initialRight });

        if (isValid) {
            let oldRight = right;
            right = mid;
            add("Sum is Sufficient", `right = mid;\nMax sum ${mid} is valid! We can try to find an even smaller max sum. Set right = ${right}.`, 23, { hlMoveRight: true, left, right, mid, subarrays, isValid, oldRight, initialLeft, initialRight });
        } else {
            let oldLeft = left;
            left = (mid ?? 0) + 1;
            add("Sum is Too Strict", `left = mid + 1;\nMax sum ${mid} failed (forced too many subarrays). We must increase the allowed sum. Set left = ${left}.`, 25, { hlMoveLeft: true, left, right, mid, subarrays, isValid, oldLeft, initialLeft, initialRight });
        }
    }

    add("Loop Exit", `while (left < right)\nThe pointers have converged (${left} == ${right}). Optimal largest sum is isolated.`, 8, { hlWhileEnd: true, left, right, initialLeft, initialRight });
    
    add("Return Result", `return left;\nReturning minimum largest sum: ${left}.`, 28, { isSuccess: true, finalAns: left, left, right, initialLeft, initialRight });

    return steps;
  }, [baseNums, baseK, selectedOpId]);

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
      if (st.nums === undefined) return null;

      if (st.hlInitBounds || st.hlInitLoop || st.hlInitLoopLeft || st.hlInitLoopRight) {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-indigo-200 scale-105 z-40`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Finding Initial Boundaries</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono">
                      {/* Left Bound Tracker */}
                      <div className="flex flex-col items-center w-[120px]">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">Left (Max Element)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 w-full text-center rounded-2xl transition-all duration-300 ${st.hlInitLoopLeft && st.leftUpdated ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                              {st.left !== undefined ? st.left : '-'}
                          </div>
                      </div>

                      {/* Current Element */}
                      {st.curNum !== undefined ? (
                          <>
                              <ArrowRight size={24} className="text-slate-300" />
                              <div className="flex flex-col items-center w-[120px]">
                                  <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Layers size={12}/> Current Elem</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-3 w-full text-center rounded-2xl transition-all duration-300 bg-amber-100 border-amber-500 text-amber-800 shadow-lg scale-110`}>
                                      {st.curNum}
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
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1">Right (Total Sum)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 w-full text-center rounded-2xl transition-all duration-300 ${st.hlInitLoopRight && st.rightUpdated ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.right !== undefined ? st.right : '-'}
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheckValid ? (st.isValid ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-rose-300 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><SplitSquareHorizontal size={14}/> Active Partition Evaluation</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono">
                  
                  {/* Guessed Max Sum */}
                  <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Target size={12}/> Guessed Max Sum (mid)</span>
                      <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlMid ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                          {st.mid !== undefined ? st.mid : '?'}
                      </div>
                  </div>
                  
                  <ArrowRight size={24} className="text-slate-300" />
                  
                  {/* Total Subarrays Computed */}
                  <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><LayersIcon size={12}/> Subarrays Formed</span>
                      <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${(st.hlEvalInitSubs || st.hlNewSub || st.hlCheckValid || st.hlMoveLeft || st.hlMoveRight) ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                          {st.subarrays !== undefined ? st.subarrays : '?'}
                      </div>
                  </div>

                  {/* Comparison to Target k */}
                  <div className="flex flex-col items-center border-l-2 border-slate-100 pl-4 md:pl-8 min-w-[150px]">
                      <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">&le; Target Limit (k)</span>
                      <div className="flex flex-col items-center gap-2">
                          <span className="bg-slate-800 text-white text-3xl font-black px-6 py-2 rounded-xl w-full text-center">
                              {st.kTarget}
                          </span>
                          {st.isValid !== undefined && (
                              <span className={`text-xs font-black uppercase px-2 py-1 w-full text-center rounded ${st.isValid ? 'text-emerald-700 bg-emerald-100 border border-emerald-300' : 'text-rose-700 bg-rose-100 border border-rose-300'}`}>
                                  {st.isValid ? 'Valid Sum' : 'Exceeds K'}
                              </span>
                          )}
                      </div>
                  </div>

              </div>

              {/* Progress bar representing current subarray sum */}
              {st.currentSum !== undefined && st.mid !== undefined && (
                  <div className="w-full mt-6 max-w-lg">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          <span>Current Subarray Sum</span>
                          <span className={st.hlCheckCap && st.isExceed ? 'text-rose-500' : ''}>{st.currentSum} / {st.mid}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 relative overflow-hidden border border-slate-200">
                          <div className={`h-full transition-all duration-300 ${st.hlCheckCap && st.isExceed ? 'bg-rose-500' : 'bg-sky-500'}`} style={{ width: `${Math.min(100, (st.currentSum / st.mid) * 100)}%` }} />
                          {st.hlCheckCap && st.isExceed && (
                              <div className="absolute top-0 right-0 h-full bg-rose-500/50 animate-pulse" style={{ width: '100%' }}></div>
                          )}
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      const maxNumVal = Math.max(...st.nums);
      const groupColors = ["bg-sky-100 border-sky-400 text-sky-800", "bg-indigo-100 border-indigo-400 text-indigo-800", "bg-teal-100 border-teal-400 text-teal-800", "bg-emerald-100 border-emerald-400 text-emerald-800", "bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800"];

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Array Representation */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-cyan-50 text-cyan-600 border-cyan-200 flex items-center gap-2`}><SplitSquareHorizontal size={12}/> Array Partitioning View</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative z-10 w-full max-w-5xl px-4 items-end min-h-[160px] pb-10 border-b-2 border-slate-200">
                      
                      {st.nums.map((val: number, idx: number) => {
                          let isActiveIdx = st.activeIdx === idx || st.activeInitIdx === idx;
                          let inCurrentGroup = st.currentGroup?.includes(idx);
                          
                          // Find if it belongs to a past group
                          let pastGroupIndex = -1;
                          if (st.pastGroups) {
                              pastGroupIndex = st.pastGroups.findIndex((g: number[]) => g.includes(idx));
                          }
                          
                          let bgClass = "bg-white border-slate-300";
                          let textClass = "text-slate-500";
                          
                          if (st.hlInitBounds || st.hlInitLoop || st.hlInitLoopLeft || st.hlInitLoopRight) {
                              if (isActiveIdx) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-200 z-30 scale-110 shadow-lg";
                                  textClass = "text-amber-900";
                              } else if ((st.activeInitIdx !== undefined && idx < st.activeInitIdx)) {
                                  bgClass = "bg-slate-100 border-slate-300 opacity-60"; 
                                  textClass = "text-slate-400";
                              }
                          } else if (isActiveIdx && (st.hlCheckCap || st.hlEvalLoop)) {
                              bgClass = st.isExceed ? "bg-rose-100 border-rose-500 ring-4 ring-rose-200 z-30 scale-110 shadow-lg" : "bg-amber-100 border-amber-500 ring-4 ring-amber-200 z-30 scale-110 shadow-lg";
                              textClass = st.isExceed ? "text-rose-900" : "text-amber-900";
                          } else if (inCurrentGroup) {
                              bgClass = "bg-amber-50 border-amber-300 shadow-md z-10";
                              textClass = "text-amber-700";
                          } else if (pastGroupIndex !== -1) {
                              let colorTheme = groupColors[pastGroupIndex % groupColors.length];
                              bgClass = `${colorTheme.split(' ')[0]} ${colorTheme.split(' ')[1]} shadow-md z-20`;
                              textClass = colorTheme.split(' ')[2];
                          }

                          // Calculate visual height mapping
                          let heightPct = Math.max(30, (val / maxNumVal) * 100);

                          return (
                              <div key={`elem-${idx}`} className={`relative transition-all duration-500 flex flex-col items-center gap-2 justify-end h-full z-10`}>
                                  
                                  {isActiveIdx && !st.hlInitBounds && !st.hlInitLoop && !st.hlInitLoopLeft && !st.hlInitLoopRight && (
                                      <div className={`absolute -top-10 flex flex-col items-center animate-bounce z-40 ${st.isExceed ? 'text-rose-600' : 'text-amber-600'}`}>
                                          <span className={`text-[8px] font-black uppercase tracking-widest whitespace-nowrap px-1 rounded border shadow-sm ${st.isExceed ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>eval</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}
                                  {isActiveIdx && (st.hlInitBounds || st.hlInitLoop || st.hlInitLoopLeft || st.hlInitLoopRight) && (
                                      <div className="absolute -top-10 flex flex-col items-center animate-bounce z-40 text-amber-600">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm">checking</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}

                                  <div className={`w-10 md:w-14 flex flex-col items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300 relative overflow-hidden`} style={{ height: `${heightPct}px` }}>
                                      <span className={`font-mono font-black text-sm md:text-lg ${textClass} z-10`}>
                                          {val}
                                      </span>
                                  </div>
                                  
                                  {/* Show which group it belongs to */}
                                  {(inCurrentGroup || pastGroupIndex !== -1) && !st.isSuccess && (
                                      <span className="absolute -bottom-6 font-mono text-[8px] font-bold text-slate-400">
                                          Group {pastGroupIndex !== -1 ? pastGroupIndex + 1 : (st.pastGroups ? st.pastGroups.length + 1 : 1)}
                                      </span>
                                  )}
                              </div>
                          )
                      })}

                  </div>
              </div>
              
              {/* Bottom: Search Space Number Line */}
              {st.left !== undefined && st.initialLeft !== undefined && st.initialRight !== undefined && !st.hlInitBounds && !st.hlInitLoop && !st.hlInitLoopLeft && !st.hlInitLoopRight && (
                  <div className="flex flex-col items-center w-full mt-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><ArrowLeftRight size={12}/> Max Sum Search Space (Binary Search)</span>
                      
                      <div className="flex flex-wrap justify-center gap-1 md:gap-1.5 relative z-10 w-full max-w-6xl px-2">
                          {/* Render search space boundaries dynamically */}
                          {Array.from({ length: Math.min(100, st.initialRight - st.initialLeft + 1) }, (_, i) => st.initialLeft + i).map((val: number) => {
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

                                      <div className={`w-5 h-5 md:w-7 md:h-7 flex items-center justify-center border-2 rounded shadow-sm ${bgClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-[9px] md:text-xs ${textClass}`}>
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

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Split Array Largest Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Search (Answer)
                  </span>
                  <span>•</span>
                  <span>LeetCode 410</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><SplitSquareHorizontal size={28}/> Min-Max Partitioning</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an integer array <code>nums</code> and an integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty subarrays such that the largest sum of any subarray is <strong>minimized</strong>.</p>
                        <p className="font-bold mt-4">Return the minimized largest sum of the split.</p>
                        <p>A subarray is a contiguous part of the array.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [7,2,5,10,8], k = 2</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">18</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">There are four ways to split nums into two subarrays.<br/>The best way is to split it into [7,2,5] and [10,8],<br/>where the largest sum among the two subarrays is only 18.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [1,2,3,4,5], k = 2</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">9</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">We can split the array into [1, 2, 3] and [4, 5]. The largest sum is max(6, 9) = 9.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= nums.length &lt;= 1000</li>
                            <li>0 &lt;= nums[i] &lt;= 10^6</li>
                            <li>1 &lt;= k &lt;= min(50, nums.length)</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Target size={16} className="text-rose-500"/> The Search Space</h4>
                        <p className="text-sm leading-relaxed">What are the absolute limits for our largest sum? The smallest possible max-sum is the largest single element in the array (<code>max(nums)</code>). If the allowed sum was even 1 unit less than that, that single element could never be placed in a subarray! The largest possible max-sum is the sum of all elements (<code>sum(nums)</code>), which happens if we don't split the array at all.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Monotonic Property</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The relationship is monotonic: As the <strong>allowed sum increases</strong>, the <strong>subarrays required decreases</strong>. Because of this sorted relationship, we can binary search the allowed sum! If a sum requires &le; <code>k</code> subarrays, it's valid, but we try smaller sums to find the absolute minimum. If it requires &gt; <code>k</code> subarrays, the sum is too restrictive.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>nums Array (Max 15 items)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="7, 2, 5, 10, 8" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Max Subarrays (k)</label>
                            <input type="number" min="1" max="1000" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="2" />
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
                                <PartyPopper size={24}/> OPTIMAL SUM FOUND
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Minimized largest sum is {st.finalAns}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheckValid ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                                        <span className="font-mono font-black text-fuchsia-400">{st.right !== undefined ? st.right : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">subarrays</span>
                                        <span className="font-mono font-black text-rose-400">{st.subarrays !== undefined ? st.subarrays : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">target (k)</span>
                                        <span className="font-mono font-black text-emerald-400">{st.kTarget !== undefined ? st.kTarget : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Subarray Partitioning Render</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-sky-100 text-sky-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the 'Binary Search on Answer' paradigm.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Target size={24} className="text-sky-500"/> 1. Binary Searching the "Answer Space"</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We are searching for the optimal max subarray sum. Instead of searching through the array of numbers, we binary search the <strong>range of possible sums</strong>.</p>
                        <p className="text-slate-600 leading-relaxed">The logic is monotonic: as the allowed sum increases, the total subarrays needed decreases. If a sum X requires &le; K subarrays, every sum &gt; X is also guaranteed to work. Our goal is to find the leftmost boundary of these valid sums.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><SplitSquareHorizontal size={24} className="text-rose-500"/> 2. The Verification Function</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To check if a guessed sum works, we simulate partitioning the array. We iterate through the numbers. If adding an element exceeds the current guessed sum, we must start a new subarray (increasing our subarrays count).</p>
                        <p className="text-slate-600 leading-relaxed">This greedy partitioning strategy perfectly matches the problem constraints, as elements must remain contiguous in their subarrays.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N log(Sum(nums))).</strong> The search space size is the sum of all elements. We halve this space logarithmically. In every halving step, we iterate through the entire array of N elements to verify the capacity.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only use integer variables for pointers and sum accumulators. No extra memory structures are required.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-sky-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'Binary Search on Answer' problem. Interviewers use it to verify you can identify monotonic relationships outside of standard sorted arrays."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why must the left bound be <code>max(nums)</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because the elements cannot be broken apart."</p>
                            <p>If our max sum was even 1 unit less than the largest element, that single element could never be placed in any subarray, meaning we could never complete the partition. Therefore, <code>max(nums)</code> is the absolute lowest possible viable sum.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "Why do we update <code>right = mid</code> instead of <code>right = mid - 1</code> when the sum is valid?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If a sum works, it is a candidate for the answer. However, we want the <em>smallest</em> valid sum."</p>
                            <p>If we did <code>right = mid - 1</code>, we would completely discard <code>mid</code> from our search space. If <code>mid</code> happened to be the absolute minimum valid sum, we would lose the correct answer! By setting <code>right = mid</code>, we shrink the search space to look for smaller sums while safely keeping our currently known best valid sum inside the boundaries."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Clock size={24}/></span>
                            <span>Q3: "Can the `right` bound (sum of elements) overflow an integer?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Based on LeetCode constraints, no, but in reality, yes."</p>
                            <p>The constraints say max elements is $1000$ and max value is $10^6$. The maximum possible sum is $10^9$, which fits safely inside a 32-bit integer (max $\approx 2 \times 10^9$). However, if the values could be larger, it would be a professional best practice to declare <code>right</code> as a <code>long</code> to prevent overflow bugs.</p>
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
                              <SplitSquareHorizontal size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMoveLeft || st.hlMoveRight ? 'text-amber-400' : (st.hlCheckValid ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                                    <span className="font-mono font-black text-fuchsia-400">{st.right !== undefined ? st.right : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">subarrays needed</span>
                                    <span className="font-mono font-black text-rose-400">{st.subarrays !== undefined ? st.subarrays : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">target (k)</span>
                                    <span className="font-mono font-black text-emerald-400">{st.kTarget !== undefined ? st.kTarget : '-'}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>nums Array</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="7, 2, 5, 10, 8" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target (k)</label>
                              <input type="number" min="1" max="1000" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="2" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">OPTIMAL SUM FOUND</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Minimized Largest Sum</div>
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
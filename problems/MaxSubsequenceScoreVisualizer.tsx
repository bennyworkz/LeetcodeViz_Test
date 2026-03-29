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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  greedyHeap: {
    id: 'greedyHeap',
    title: '1. Greedy Sort + Min-Heap',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    theme: 'indigo',
    code: `public long maxScore(int[] nums1, int[] nums2, int k) {
    int n = nums1.length;
    int[][] pairs = new int[n][2];
    for (int i = 0; i < n; i++) {
        pairs[i] = new int[]{nums1[i], nums2[i]};
    }
    Arrays.sort(pairs, (a, b) -> b[1] - a[1]);
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    long sum = 0, maxScore = 0;
    for (int i = 0; i < n; i++) {
        pq.add(pairs[i][0]);
        sum += pairs[i][0];
        if (pq.size() > k) {
            sum -= pq.poll();
        }
        if (pq.size() == k) {
            maxScore = Math.max(maxScore, sum * pairs[i][1]);
        }
    }
    return maxScore;
}`,
    desc: "The Optimal Greedy Approach. The score formula is (Sum of nums1) * (Minimum of nums2). To maximize this, we must control the 'Minimum of nums2' bottleneck. By pairing the arrays and sorting them DESCENDING based on nums2, we guarantee that as we iterate, the current nums2 element is ALWAYS the minimum of all elements seen so far! We then use a Min-Heap to hold the K largest nums1 elements we've encountered. If we exceed size K, we evict the smallest nums1 element. At every step where we have K elements, we calculate the score and track the maximum."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|new|String|maxScore|nums1|nums2|k|n|length|pairs|Arrays|sort|PriorityQueue|Integer|pq|sum|Math|max|add|size|poll)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'new'].includes(part);
            const isObject = ['String', 'Arrays', 'PriorityQueue', 'Integer', 'Math'].includes(part);
            const isPointer = ['nums1', 'nums2', 'k', 'n', 'pairs', 'pq', 'sum', 'maxScore', 'a', 'b', 'i'].includes(part);
            const isMapCall = ['length', 'sort', 'add', 'size', 'poll', 'max'].includes(part);
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

export default function MaxSubsequenceScoreVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('greedyHeap');
  
  const [n1Input, setN1Input] = useState('1, 3, 3, 2');
  const [n2Input, setN2Input] = useState('2, 1, 3, 4');
  const [kInput, setKInput] = useState('3');
  
  const [baseN1, setBaseN1] = useState<number[]>([1, 3, 3, 2]);
  const [baseN2, setBaseN2] = useState<number[]>([2, 1, 3, 4]);
  const [baseK, setBaseK] = useState<number>(3);

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
      let pN1 = n1Input.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      let pN2 = n2Input.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      
      // Ensure equal lengths
      const minLen = Math.min(pN1.length, pN2.length);
      if (minLen === 0) {
          pN1 = [1, 3, 3, 2];
          pN2 = [2, 1, 3, 4];
      } else {
          pN1 = pN1.slice(0, minLen);
          pN2 = pN2.slice(0, minLen);
      }
      
      if (pN1.length > 8) {
          pN1 = pN1.slice(0, 8);
          pN2 = pN2.slice(0, 8);
      }
      
      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 1;
      if (parsedK > pN1.length) parsedK = pN1.length;

      setBaseN1(pN1);
      setBaseN2(pN2);
      setBaseK(parsedK);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [n1Input, n2Input, kInput, selectedOpId]);

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
    const n1 = [...baseN1];
    const n2 = [...baseN2];
    const k = baseK;
    const n = n1.length;

    // Real Min-Heap implementation to generate an accurate trace
    let heap: number[] = [];
    
    const heapPush = (val: number) => {
        heap.push(val);
        let curr = heap.length - 1;
        while (curr > 0) {
            let parent = Math.floor((curr - 1) / 2);
            if (heap[parent] > heap[curr]) {
                let temp = heap[parent];
                heap[parent] = heap[curr];
                heap[curr] = temp;
                curr = parent;
            } else break;
        }
    };

    const heapPop = () => {
        if (heap.length === 0) return null;
        if (heap.length === 1) return heap.pop();
        let min = heap[0];
        heap[0] = heap.pop() as number;
        let curr = 0;
        while (true) {
            let left = 2 * curr + 1;
            let right = 2 * curr + 2;
            let smallest = curr;
            if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
            if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
            if (smallest !== curr) {
                let temp = heap[curr];
                heap[curr] = heap[smallest];
                heap[smallest] = temp;
                curr = smallest;
            } else break;
        }
        return min;
    };

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            k, n, heap: [...heap], ...st 
        } 
    });

    add("Function Call", `public long maxScore(int[] nums1, int[] nums2, int k=${k})`, 1, { pairs: n1.map((v, i) => ({n1: v, n2: n2[i]})) });
    
    let pairs = n1.map((v, i) => ({n1: v, n2: n2[i]}));
    
    add("Pairing Arrays", `int[][] pairs = new int[n][2];\nfor (int i = 0; i < n; i++) { ... }\nCombining nums1 and nums2 into a single array of pairs so we can sort them together.`, 4, { pairs: [...pairs], hlPair: true });

    pairs.sort((a, b) => b.n2 - a.n2);

    add("Sorting Pairs", `Arrays.sort(pairs, (a, b) -> b[1] - a[1]);\nCrucial: Sorted DESCENDING based on nums2. This guarantees that as we iterate rightward, the current nums2 element is strictly the MINIMUM of all elements seen so far.`, 7, { pairs: [...pairs], hlSort: true });

    let sum = 0;
    let maxScore = 0;

    add("Initialize Variables", `PriorityQueue<Integer> pq = new PriorityQueue<>();\nlong sum = 0, maxScore = 0;\nCreated empty Min-Heap to track top K nums1 values, sum tracker, and maxScore tracker.`, 8, { pairs: [...pairs], sum, maxScore, hlInit: true });

    for (let i = 0; i < n; i++) {
        let currN1 = pairs[i].n1;
        let currN2 = pairs[i].n2;

        add("Loop Iteration", `for (int i = ${i}; i < n; i++)\nProcessing Pair [${currN1}, ${currN2}]. Multiplier (Min nums2) is currently ${currN2}.`, 10, { pairs: [...pairs], i, currN1, currN2, sum, maxScore });

        heapPush(currN1);
        let oldSum = sum;
        sum += currN1;

        add("Add to Heap & Sum", `pq.add(pairs[i][0]);\nsum += pairs[i][0];\nPushed ${currN1} into Min-Heap. Sum increases from ${oldSum} to ${sum}.`, 12, { pairs: [...pairs], i, currN1, currN2, sum, maxScore, hlHeapAdd: true });

        let isOverflow = heap.length > k;
        add("Check Heap Capacity", `if (pq.size() > k)\nHeap size is ${heap.length}. Does it exceed K (${k})? (${isOverflow ? 'Yes' : 'No'})`, 14, { pairs: [...pairs], i, currN1, currN2, sum, maxScore, hlCheckSize: true, isOverflow });

        if (isOverflow) {
            let removed = heapPop()!;
            let sumBeforeSub = sum;
            sum -= removed;
            add("Evict Smallest (Maintain Top K)", `sum -= pq.poll();\nTo maximize the score, we only want the largest ${k} elements. The Min-Heap easily identifies the smallest element (${removed}). We pop it and subtract from sum: ${sumBeforeSub} - ${removed} = ${sum}.`, 15, { pairs: [...pairs], i, currN1, currN2, sum, maxScore, hlHeapPop: true, removed });
        }

        let isKSize = heap.length === k;
        add("Check Valid Score Window", `if (pq.size() == k)\nDo we have exactly K (${k}) elements to form a valid subsequence? (${isKSize ? 'Yes' : 'No'})`, 17, { pairs: [...pairs], i, currN1, currN2, sum, maxScore, hlCheckK: true, isKSize });

        if (isKSize) {
            let currentScore = sum * currN2;
            let oldMax = maxScore;
            maxScore = Math.max(maxScore, currentScore);
            let isNewMax = maxScore > oldMax;

            add("Calculate & Update Score", `maxScore = Math.max(maxScore, sum * pairs[i][1]);\nScore = Sum (${sum}) * Min Multiplier (${currN2}) = ${currentScore}.\n${isNewMax ? `New Max! Updated from ${oldMax} to ${maxScore}.` : `Score ${currentScore} is not greater than Max ${maxScore}.`}`, 18, { pairs: [...pairs], i, currN1, currN2, sum, maxScore, hlCalcScore: true, currentScore, oldMax, isNewMax });
        }
    }

    add("Return Result", `return maxScore;\nIteration complete. The absolute maximum score is ${maxScore}.`, 21, { pairs: [...pairs], sum, maxScore, isSuccess: true, finalAns: maxScore });

    return steps;
  }, [baseN1, baseN2, baseK, selectedOpId]);

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

  // Helper to compute node coordinates for Binary Tree render
  const getHeapCoords = (i: number) => {
      const l = Math.floor(Math.log2(i + 1));
      const p = i - (Math.pow(2, l) - 1);
      const count = Math.pow(2, l);
      const x = ((p + 0.5) / count) * 100;
      const y = l * 60 + 30; // compact y spacing
      return { x, y };
  };

  const renderVisuals = () => {
      if (st.pairs === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-6 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Paired Arrays Visual */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><ArrowDownAZ size={12}/> {st.hlSort || st.i !== undefined ? 'Sorted Pairs (Descending by nums2)' : 'Initial Pairs'}</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3 relative z-10 w-full max-w-5xl px-4">
                      {st.pairs.map((pair: any, idx: number) => {
                          let isCurrentI = st.i === idx;
                          let isProcessed = st.i !== undefined && idx < st.i;
                          
                          let bgClass = "bg-white border-slate-300";
                          let borderClassN2 = "border-slate-200";

                          if (isCurrentI) {
                              bgClass = `bg-indigo-100 ring-4 ring-indigo-200 border-indigo-400 z-20 scale-110 shadow-lg`;
                              borderClassN2 = "border-indigo-300";
                          } else if (isProcessed) {
                              bgClass = "bg-slate-100 border-slate-200 opacity-60";
                              borderClassN2 = "border-slate-200";
                          } else if (st.hlSort) {
                              bgClass = "bg-sky-50 border-sky-300 ring-2 ring-sky-100";
                              borderClassN2 = "border-sky-200";
                          }

                          return (
                              <div key={`pair-${idx}`} className={`flex flex-col items-center transition-all duration-500 ${isCurrentI ? 'mb-4' : 'mb-0'}`}>
                                  {isCurrentI && <span className="text-[10px] font-black text-indigo-600 mb-1 animate-bounce"><ArrowDown size={14} strokeWidth={3}/></span>}
                                  <div className={`w-14 md:w-16 flex flex-col border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300 overflow-hidden`}>
                                      {/* nums1 row */}
                                      <div className="py-2 flex items-center justify-center bg-white/50">
                                          <span className={`font-mono font-black text-lg ${isCurrentI ? 'text-emerald-600' : 'text-slate-700'}`}>
                                              {pair.n1}
                                          </span>
                                      </div>
                                      {/* nums2 row */}
                                      <div className={`py-1.5 flex items-center justify-center border-t-2 ${borderClassN2} ${isCurrentI ? 'bg-indigo-200' : (st.hlSort ? 'bg-sky-200' : 'bg-slate-200')}`}>
                                          <span className={`font-mono font-bold text-sm ${isCurrentI ? 'text-indigo-900' : 'text-slate-600'}`}>
                                              {pair.n2}
                                          </span>
                                      </div>
                                  </div>
                                  <span className={`font-mono text-[9px] font-bold mt-1 ${isCurrentI ? 'text-indigo-600' : 'text-slate-400'}`}>i={idx}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Middle: Architecture & Dashboard */}
              <div className="flex flex-col md:flex-row items-stretch w-full max-w-6xl gap-4 mt-2">
                  
                  {/* Left: Min-Heap (Top K nums1) */}
                  <div className="flex-1 flex flex-col items-center min-w-[260px]">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><FilterIcon size={12}/> Top K Sum (Min-Heap)</span>
                      
                      <div className="relative w-full bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl p-6 flex flex-col justify-start items-center overflow-hidden" style={{ minHeight: `240px` }}>
                          <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none z-0"></div>
                          
                          <div className="flex flex-wrap justify-center gap-3 relative z-10 w-full items-start mt-2">
                              {st.heap && st.heap.length === 0 && !st.hlHeapAdd && (
                                  <span className="text-slate-500 font-mono italic text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Heap is Empty</span>
                              )}

                              {/* Render SVG Lines connecting parent to child */}
                              {st.heap && st.heap.length > 0 && (
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                      {[...Array(Math.max(st.k, st.heap.length))].map((_, i) => {
                                          const leftChild = 2 * i + 1;
                                          const rightChild = 2 * i + 2;
                                          const parentCoords = getHeapCoords(i);
                                          
                                          let lines = [];
                                          if (leftChild < st.heap.length && st.heap[i] !== undefined && st.heap[leftChild] !== undefined) {
                                              const childCoords = getHeapCoords(leftChild);
                                              lines.push(<line key={`l-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#64748b" strokeWidth="2" opacity={0.5} />);
                                          }
                                          if (rightChild < st.heap.length && st.heap[i] !== undefined && st.heap[rightChild] !== undefined) {
                                              const childCoords = getHeapCoords(rightChild);
                                              lines.push(<line key={`r-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#64748b" strokeWidth="2" opacity={0.5} />);
                                          }
                                          return lines;
                                      })}
                                  </svg>
                              )}

                              {/* Render Nodes */}
                              {st.heap && [...Array(Math.max(st.k, st.heap.length))].map((_, slotIdx) => {
                                  const coords = getHeapCoords(slotIdx);
                                  let heapVal = st.heap[slotIdx];
                                  let hasValue = heapVal !== undefined;
                                  let isRoot = slotIdx === 0;
                                  let isOverflowNode = slotIdx >= st.k;
                                  
                                  let bgClass = hasValue ? "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm" : "bg-slate-700 border-slate-600 border-dashed text-slate-500 opacity-50";
                                  
                                  if (st.hlHeapAdd && st.currN1 === heapVal) {
                                      bgClass = "bg-emerald-300 border-emerald-600 text-emerald-900 ring-4 ring-emerald-200 shadow-lg scale-110 z-20";
                                  } else if (isOverflowNode && hasValue) {
                                      bgClass = "bg-rose-100 border-rose-500 text-rose-800 ring-4 ring-rose-200 shadow-lg";
                                  }

                                  return (
                                      <div key={`slot-${slotIdx}`} className={`absolute flex flex-col items-center gap-1 transition-all duration-500 z-10`} style={{ left: `${coords.x}%`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)' }}>
                                          {isRoot && hasValue && <span className="text-[8px] font-black text-rose-400 font-mono uppercase tracking-widest absolute -top-5 whitespace-nowrap bg-slate-800/80 px-1 rounded">Smallest</span>}
                                          
                                          <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-full ${bgClass} transition-all duration-300 relative`}>
                                              <span className={`font-mono font-black text-lg`}>
                                                  {hasValue ? heapVal : ''}
                                              </span>
                                          </div>
                                      </div>
                                  )
                              })}

                              {/* Polling Animation Overlay */}
                              {st.hlHeapPop && st.removed !== undefined && (
                                  <div className={`absolute flex items-center justify-center w-12 h-12 rounded-full border-2 bg-rose-200 border-rose-500 text-rose-900 font-black text-xl shadow-lg animate-out zoom-out slide-out-to-top-12 fade-out duration-1000 z-30`} style={{ left: `${getHeapCoords(0).x}%`, top: `${getHeapCoords(0).y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {st.removed}
                                      <XCircle size={16} className="absolute -top-2 -right-2 text-rose-600 bg-white rounded-full"/>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Center: Live Action Hub (Micro-Explanation Logic Panel) */}
                  <div className="flex flex-col justify-center items-center w-full md:w-64 lg:w-72 shrink-0 gap-4 z-20">
                        {/* Always show the Sum tracking */}
                        <div className={`bg-white p-4 rounded-2xl border-2 shadow-xl w-full flex flex-col items-center transition-colors duration-300 ${st.hlHeapPop ? 'border-rose-300 ring-4 ring-rose-100' : (st.hlHeapAdd ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-slate-200')}`}>
                            <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest flex items-center gap-1">Running Sum <Info size={10}/></span>
                            <div className="text-3xl font-black text-slate-800 font-mono">
                                {st.sum !== undefined ? st.sum : 0}
                            </div>
                            {(st.hlHeapAdd || st.hlHeapPop) && (
                                <div className={`text-[10px] font-bold mt-1 font-mono uppercase ${st.hlHeapAdd ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {st.hlHeapAdd ? `+ ${st.currN1} added` : `- ${st.removed} evicted`}
                                </div>
                            )}
                        </div>

                        {st.hlCheckSize && (
                            <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-md w-full animate-in zoom-in text-center">
                                <span className="text-[9px] font-black uppercase text-sky-500 block">Check Size &gt; K?</span>
                                <span className="text-xs font-mono font-bold text-slate-600">{st.heap.length} &gt; {st.k} &rarr; <span className={st.isOverflow ? 'text-rose-500' : 'text-emerald-500'}>{st.isOverflow ? 'YES' : 'NO'}</span></span>
                            </div>
                        )}

                        {st.hlCalcScore && (
                            <div className="bg-white p-4 rounded-2xl border-2 border-indigo-300 shadow-xl w-full animate-in slide-in-from-right-8 z-30">
                                <span className="text-[10px] font-black uppercase text-indigo-500 mb-2 block text-center tracking-widest">Score Calculation</span>
                                <div className="flex items-center justify-center gap-2 font-mono text-sm text-slate-600 font-bold bg-slate-50 py-2 rounded-lg border border-slate-100">
                                    <span className="text-emerald-600">{st.sum}</span>
                                    <span className="text-slate-400">×</span>
                                    <span className="text-indigo-600">{st.currN2}</span>
                                    <span className="text-slate-400">=</span>
                                    <span className="text-amber-500 text-lg">{st.currentScore}</span>
                                </div>
                                <div className={`text-[9px] text-center mt-3 font-bold uppercase ${st.isNewMax ? 'text-emerald-600 bg-emerald-50 py-1 rounded' : 'text-slate-400'}`}>
                                    {st.isNewMax ? `New Max Found!` : `Not greater than ${st.oldMax}`}
                                </div>
                            </div>
                        )}
                  </div>

                  {/* Right: Max Score Tracker */}
                  <div className="flex-1 flex flex-col items-center min-w-[200px]">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><Trophy size={12}/> Global Max Score</span>
                      
                      <div className="relative w-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl border border-amber-300 shadow-2xl p-6 flex flex-col justify-center items-center overflow-hidden" style={{ minHeight: `240px` }}>
                          
                          <Trophy size={80} className="text-white/20 absolute -right-4 -bottom-4" />

                          <div className="flex flex-col items-center relative z-10 w-full bg-white/90 p-6 rounded-2xl shadow-inner border border-white">
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">maxScore</span>
                              <div className={`font-mono text-5xl font-black text-slate-800 transition-transform duration-500 ${st.isNewMax ? 'scale-125 text-emerald-600' : ''}`}>
                                  {st.maxScore !== undefined ? st.maxScore : 0}
                              </div>
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
                <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Maximum Subsequence Score</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Greedy Sort + Min-Heap
                  </span>
                  <span>•</span>
                  <span>LeetCode 2542</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Calculator size={28}/> Maximize the Product</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given two 0-indexed integer arrays <code>nums1</code> and <code>nums2</code> of equal length <code>n</code> and a positive integer <code>k</code>. You must choose a subsequence of indices from <code>nums1</code> of length <code>k</code>.</p>
                        <p>The <strong>score</strong> of the chosen subsequence is defined as:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li>(Sum of selected elements from nums1) * (Minimum of selected elements from nums2)</li>
                        </ul>
                        <p className="font-bold mt-4">Return the <strong>maximum</strong> possible score.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums1 = [1,3,3,2], nums2 = [2,1,3,4], k = 3</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">12</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">We can choose the indices 0, 2, and 3.<br/>The score is (1 + 3 + 2) * min(2, 3, 4) = 6 * 2 = 12.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>n == nums1.length == nums2.length</li>
                            <li>1 &lt;= n &lt;= 10^5</li>
                            <li>0 &lt;= nums1[i], nums2[j] &lt;= 10^5</li>
                            <li>1 &lt;= k &lt;= n</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The formula has two competing parts: maximizing a sum, and maximizing a minimum multiplier. If we arbitrarily pick elements to maximize the sum, we might accidentally pick an element with a tiny multiplier, ruining the final score. We must find a way to fix one of the variables.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Fix the multiplier.</strong> If we sort the pairs descending by <code>nums2</code>, then as we iterate, the current <code>nums2</code> value is <em>guaranteed</em> to be the minimum of all pairs seen so far! With the multiplier fixed, we just need to maximize the sum of <code>nums1</code> from the pool of seen pairs. A Min-Heap of size K easily tracks the largest K elements.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> MaxSubsequenceScore.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>nums1 (Sum Pool)</label>
                            <input type="text" value={n1Input} onChange={(e) => setN1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 3, 3, 2" />
                        </div>
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>nums2 (Multipliers)</label>
                            <input type="text" value={n2Input} onChange={(e) => setN2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="2, 1, 3, 4" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>K Size</label>
                            <input type="number" min="1" max="8" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="3" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-amber-400 flex items-center gap-3"><PartyPopper size={24}/> MAXIMUM FOUND</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">The highest possible score is {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSort || st.hlHeapAdd || st.hlHeapPop || st.hlCalcScore ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Dynamic Score Engine</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-16" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how to break down two-variable optimization problems.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowDownAZ size={24} className="text-indigo-500"/> 1. The Strategy of "Fixing" a Variable</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The problem asks us to maximize <code>Sum * Minimum</code>. Optimizing two interdependent variables simultaneously is extremely difficult.</p>
                        <p className="text-slate-600 leading-relaxed">The standard algorithmic technique is to <strong>fix one variable</strong> so you only have to optimize the other. If we sort the pairs descending by <code>nums2</code>, we essentially "fix" the multiplier. As we loop through the sorted array, the current <code>nums2</code> element is mathematically guaranteed to be the minimum of all the elements we have seen so far. With the multiplier fixed, our only remaining job is to greedily pick the largest <code>nums1</code> elements available in our pool.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><FilterIcon size={24} className="text-emerald-500"/> 2. Why a Min-Heap for Maximizing?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Wait, if we want the <em>maximum</em> sum, why do we use a <em>Min-Heap</em>?</p>
                        <p className="text-slate-600 leading-relaxed">Because we only have a capacity of <code>k</code>. We want to trap the <code>k</code> largest elements. A Min-Heap keeps the absolute smallest of those elements right at the top (the root). When the heap exceeds capacity (size <code>k+1</code>), we can instantly pop the root in $O(\log k)$ time, effectively throwing away the smallest element and keeping the sum as large as possible.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N log N).</strong> Pairing the arrays takes $O(N)$. Sorting the array of pairs takes $O(N \log N)$. Iterating through the array takes $O(N)$, and inside the loop, we perform Heap insertions/removals which take $O(\log K)$. Total time is dominated by the sort: $O(N \log N)$.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate an array of size $N$ to store the combined pairs. The PriorityQueue takes $O(K)$ space. Total space is $O(N + K) \rightarrow O(N)$.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem elegantly combines sorting logic with heap management. Interviewers use it to test if you know how to break down complex algebraic formulas into linear loops."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we sort by <code>nums1</code> descending instead of <code>nums2</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, that would break the algorithm.</p>
                            <p>The formula requires multiplying by the <em>minimum</em> element of <code>nums2</code>. If we sorted by <code>nums1</code>, we would have no idea what the minimum <code>nums2</code> element is in our current pool of K elements without doing an expensive $O(K)$ linear scan every single iteration. By sorting by <code>nums2</code> descending, the loop index naturally provides the exact minimum multiplier in $O(1)$ time."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why do we use <code>long</code> for the sum and maxScore variables in Java?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent Integer Overflow.</p>
                            <p>The constraints state that <code>nums1[i]</code> can be up to $10^5$, and $k$ can be up to $10^5$. The sum alone could reach $10^{10}$, which far exceeds the maximum 32-bit signed integer limit in Java (~$2 \times 10^9$). When we then multiply that sum by <code>nums2[i]</code>, the score can be massive. Using a 64-bit <code>long</code> ensures our math doesn't silently wrap around to negative numbers."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "If K = 1, how does the algorithm behave?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It perfectly handles it!</p>
                            <p>If K = 1, the heap capacity check <code>if (pq.size() &gt; k)</code> triggers immediately after the second element is added. The heap will only ever contain 1 element (the current <code>nums1[i]</code>). The score calculation just becomes <code>nums1[i] * nums2[i]</code> for every single index, and the algorithm correctly finds the absolute maximum pair product in the array."</p>
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
                              <Calculator size={20}/>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-amber-900/40 border-amber-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSort || st.hlHeapAdd || st.hlHeapPop || st.hlCalcScore ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>nums1</label>
                              <input type="text" value={n1Input} onChange={(e) => setN1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, 3, 3, 2" />
                          </div>
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>nums2</label>
                              <input type="text" value={n2Input} onChange={(e) => setN2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="2, 1, 3, 4" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>K</label>
                              <input type="number" min="1" max="8" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="3" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-amber-500 shadow-[0_0_150px_rgba(245,158,11,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-amber-500`}></div>
                                
                                <div className="w-24 h-24 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-amber-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">MAXIMUM FOUND</h2>
                                <p className="text-amber-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Finished execution</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">The Highest Score is</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-amber-600 hover:bg-amber-700 shadow-amber-900/20`}>
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
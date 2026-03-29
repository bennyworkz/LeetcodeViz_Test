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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus,
  ArrowRightLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoHeaps: {
    id: 'twoHeaps',
    title: '1. Two Min-Heaps (Front & Back)',
    icon: <Users size={16} />,
    complexity: 'Time: O((K + C) log C) | Space: O(C)',
    theme: 'teal',
    code: `public long totalCost(int[] costs, int k, int candidates) {
    PriorityQueue<Integer> headWorkers = new PriorityQueue<>();
    PriorityQueue<Integer> tailWorkers = new PriorityQueue<>();
    int nextHead = 0;
    int nextTail = costs.length - 1;
    long totalCost = 0;

    for (int i = 0; i < k; i++) {
        while (headWorkers.size() < candidates && nextHead <= nextTail) {
            headWorkers.add(costs[nextHead++]);
        }
        while (tailWorkers.size() < candidates && nextHead <= nextTail) {
            tailWorkers.add(costs[nextTail--]);
        }
        
        int headCost = headWorkers.size() > 0 ? headWorkers.peek() : Integer.MAX_VALUE;
        int tailCost = tailWorkers.size() > 0 ? tailWorkers.peek() : Integer.MAX_VALUE;

        if (headCost <= tailCost) {
            totalCost += headCost;
            headWorkers.poll();
        } else {
            totalCost += tailCost;
            tailWorkers.poll();
        }
    }
    return totalCost;
}`,
    desc: "The Optimal Approach. We use two Min-Heaps to maintain the lowest costs from the first 'candidates' workers and the last 'candidates' workers. In each hiring session, we ensure both heaps are filled up to 'candidates' limit (as long as there are unseen workers in the middle). We then compare the minimum worker from the head (front) against the minimum from the tail (back). We hire the cheaper one. If there is a tie, we naturally break it by favoring the head worker, satisfying the 'smallest index' rule."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'teal' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|new|String|totalCost|costs|k|candidates|length|headWorkers|tailWorkers|PriorityQueue|Integer|nextHead|nextTail|add|size|poll|peek|MAX_VALUE)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'PriorityQueue', 'Integer'].includes(part);
            const isPointer = ['costs', 'k', 'candidates', 'headWorkers', 'tailWorkers', 'nextHead', 'nextTail', 'totalCost', 'headCost', 'tailCost', 'i'].includes(part);
            const isMapCall = ['length', 'add', 'size', 'poll', 'peek', 'MAX_VALUE'].includes(part);
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

export default function TotalCostToHireWorkersVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('twoHeaps');
  
  const [costsInput, setCostsInput] = useState('17, 12, 10, 2, 7, 2, 11, 20, 8');
  const [kInput, setKInput] = useState('3');
  const [cInput, setCInput] = useState('4');
  
  const [baseCosts, setBaseCosts] = useState<number[]>([17, 12, 10, 2, 7, 2, 11, 20, 8]);
  const [baseK, setBaseK] = useState<number>(3);
  const [baseC, setBaseC] = useState<number>(4);

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
      let pCosts = costsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      
      if (pCosts.length === 0) {
          pCosts = [17, 12, 10, 2, 7, 2, 11, 20, 8];
      }
      if (pCosts.length > 15) {
          pCosts = pCosts.slice(0, 15); // Limit for UI rendering bounds
      }
      
      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 1;
      if (parsedK > pCosts.length) parsedK = pCosts.length;

      let parsedC = parseInt(cInput.trim(), 10);
      if (isNaN(parsedC) || parsedC < 1) parsedC = 1;
      if (parsedC > pCosts.length) parsedC = pCosts.length;

      setBaseCosts(pCosts);
      setBaseK(parsedK);
      setBaseC(parsedC);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [costsInput, kInput, cInput, selectedOpId]);

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
    const costs = [...baseCosts];
    const k = baseK;
    const candidates = baseC;

    // Helper to simulate Min-Heap operations
    const heapPush = (heap: number[], val: number) => {
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

    const heapPop = (heap: number[]) => {
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

    let headPQ: number[] = [];
    let tailPQ: number[] = [];
    let nextHead = 0;
    let nextTail = costs.length - 1;
    let totalCost = 0;
    let hiredWorkers: number[] = [];

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            costs: [...costs], k, candidates, headPQ: [...headPQ], tailPQ: [...tailPQ],
            nextHead, nextTail, totalCost, hiredWorkers: [...hiredWorkers], ...st 
        } 
    });

    add("Function Call", `public long totalCost(int[] costs, int k=${k}, int candidates=${candidates})`, 1, {});
    
    add("Initialize Variables", `PriorityQueue<Integer> headWorkers = new PriorityQueue<>();\nPriorityQueue<Integer> tailWorkers = new PriorityQueue<>();\nint nextHead = 0;\nint nextTail = ${nextTail};\nlong totalCost = 0;`, 6, { hlInit: true });

    for (let i = 0; i < k; i++) {
        add("Hiring Session", `for (int i = ${i}; i < k; i++)\nStarting hiring session ${i + 1} of ${k}.`, 8, { i, hlLoop: true });

        // Fill Head PQ
        let filledHead = false;
        while (headPQ.length < candidates && nextHead <= nextTail) {
            filledHead = true;
            let val = costs[nextHead];
            add("Check Head Capacity", `while (headWorkers.size() < candidates && nextHead <= nextTail)\nHead PQ size (${headPQ.length}) < ${candidates} and pointers haven't crossed.`, 9, { i, hlFillHeadCheck: true });
            
            heapPush(headPQ, val);
            nextHead++;
            add("Fill Head Workers", `headWorkers.add(costs[nextHead++]);\nAdded worker cost ${val} to Head PQ. nextHead pointer moves to ${nextHead}.`, 10, { i, hlFillHead: true, valAdded: val, isHead: true });
        }
        if (!filledHead) {
            add("Head Capacity Met", `while (headWorkers.size() < candidates && nextHead <= nextTail)\nHead PQ is either full (size ${headPQ.length}) or no unseen workers left.`, 9, { i, hlFillHeadCheck: true });
        }

        // Fill Tail PQ
        let filledTail = false;
        while (tailPQ.length < candidates && nextHead <= nextTail) {
            filledTail = true;
            let val = costs[nextTail];
            add("Check Tail Capacity", `while (tailWorkers.size() < candidates && nextHead <= nextTail)\nTail PQ size (${tailPQ.length}) < ${candidates} and pointers haven't crossed.`, 12, { i, hlFillTailCheck: true });
            
            heapPush(tailPQ, val);
            nextTail--;
            add("Fill Tail Workers", `tailWorkers.add(costs[nextTail--]);\nAdded worker cost ${val} to Tail PQ. nextTail pointer moves to ${nextTail}.`, 13, { i, hlFillTail: true, valAdded: val, isHead: false });
        }
        if (!filledTail) {
             add("Tail Capacity Met", `while (tailWorkers.size() < candidates && nextHead <= nextTail)\nTail PQ is either full (size ${tailPQ.length}) or no unseen workers left.`, 12, { i, hlFillTailCheck: true });
        }

        // Evaluate
        let headCost = headPQ.length > 0 ? headPQ[0] : Infinity;
        let tailCost = tailPQ.length > 0 ? tailPQ[0] : Infinity;

        add("Peek Minimums", `int headCost = headWorkers.size() > 0 ? headWorkers.peek() : Integer.MAX_VALUE;\nint tailCost = tailWorkers.size() > 0 ? tailWorkers.peek() : Integer.MAX_VALUE;\nBest Head Worker: ${headCost === Infinity ? 'None' : headCost}. Best Tail Worker: ${tailCost === Infinity ? 'None' : tailCost}.`, 17, { i, headCost, tailCost, hlPeek: true });

        let pickHead = headCost <= tailCost;
        add("Compare Costs", `if (headCost <= tailCost)\nIs ${headCost === Infinity ? 'MAX' : headCost} <= ${tailCost === Infinity ? 'MAX' : tailCost}? (${pickHead ? 'Yes' : 'No'})`, 19, { i, headCost, tailCost, pickHead, hlCompare: true });

        if (pickHead) {
            let hiredVal = heapPop(headPQ)!;
            totalCost += hiredVal;
            hiredWorkers.push(hiredVal);
            add("Hire from Head", `totalCost += headCost;\nheadWorkers.poll();\nHired Head Worker (${hiredVal}). Total Cost is now ${totalCost}.`, 21, { i, headCost, tailCost, pickHead, hlHireHead: true, hiredVal });
        } else {
            let hiredVal = heapPop(tailPQ)!;
            totalCost += hiredVal;
            hiredWorkers.push(hiredVal);
            add("Hire from Tail", `totalCost += tailCost;\ntailWorkers.poll();\nHired Tail Worker (${hiredVal}). Total Cost is now ${totalCost}.`, 24, { i, headCost, tailCost, pickHead, hlHireTail: true, hiredVal });
        }
    }

    add("Return Result", `return totalCost;\nHired exactly ${k} workers. Final Total Cost: ${totalCost}.`, 27, { isSuccess: true, finalAns: totalCost });

    return steps;
  }, [baseCosts, baseK, baseC, selectedOpId]);

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

  // Helper to compute node coordinates for Mini Binary Tree render (Max size ~5)
  const getHeapCoords = (i: number, cap: number) => {
      const l = Math.floor(Math.log2(i + 1));
      const p = i - (Math.pow(2, l) - 1);
      const count = Math.pow(2, l);
      const x = ((p + 0.5) / count) * 100;
      const y = l * 55 + 30; // compact y spacing
      return { x, y };
  };

  const renderVisuals = () => {
      if (st.costs === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-6 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Worker Array Pool */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-200 flex items-center gap-2`}><Users size={12}/> Worker Pool (Costs)</span>
                  
                  <div className="flex flex-wrap justify-center gap-1 md:gap-2 relative z-10 w-full max-w-5xl px-4 pt-8">
                      {st.costs.map((val: number, idx: number) => {
                          
                          let inHead = idx < st.nextHead;
                          let inTail = idx > st.nextTail;
                          let unseen = !inHead && !inTail;
                          
                          let bgClass = "bg-slate-100 border-slate-300";
                          let textClass = "text-slate-400";
                          let label = "";

                          if (unseen) {
                              bgClass = `bg-white border-slate-400 shadow-sm`;
                              textClass = `text-slate-800`;
                          } else if (inHead) {
                              bgClass = "bg-sky-50 border-sky-300 opacity-60";
                              textClass = "text-sky-500";
                              label = "H";
                          } else if (inTail) {
                              bgClass = "bg-rose-50 border-rose-300 opacity-60";
                              textClass = "text-rose-500";
                              label = "T";
                          }

                          let isNextHeadTarget = st.nextHead === idx && st.nextHead <= st.nextTail;
                          let isNextTailTarget = st.nextTail === idx && st.nextHead <= st.nextTail;

                          return (
                              <div key={`cost-${idx}`} className={`flex flex-col items-center transition-all duration-500 relative`}>
                                  
                                  {isNextHeadTarget && (
                                      <div className="absolute -top-6 text-sky-500 flex flex-col items-center animate-bounce">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-sky-50 px-1 rounded border border-sky-200">nextHead</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}
                                  
                                  {isNextTailTarget && (
                                      <div className="absolute -top-6 text-rose-500 flex flex-col items-center animate-bounce">
                                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-rose-50 px-1 rounded border border-rose-200">nextTail</span>
                                          <ArrowDown size={12} strokeWidth={3}/>
                                      </div>
                                  )}

                                  <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl ${bgClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-lg ${textClass}`}>
                                          {val}
                                      </span>
                                  </div>
                                  <span className={`font-mono text-[8px] font-black mt-1 ${unseen ? 'text-slate-400' : textClass}`}>{label ? label : `i=${idx}`}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Middle: Architecture & Dashboard */}
              <div className="flex flex-col md:flex-row items-stretch w-full max-w-6xl gap-4 mt-2">
                  
                  {/* Left: Head PQ */}
                  <div className="flex-1 flex flex-col items-center min-w-[200px]">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><UserPlus size={12}/> headWorkers PQ</span>
                      
                      <div className={`relative w-full bg-slate-800 rounded-3xl border-4 ${st.pickHead ? 'border-sky-500 ring-4 ring-sky-500/20' : 'border-slate-700'} shadow-2xl p-6 flex flex-col justify-start items-center overflow-hidden transition-all duration-500`} style={{ minHeight: `200px` }}>
                          <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none z-0"></div>
                          
                          <div className="flex flex-wrap justify-center gap-3 relative z-10 w-full items-start mt-2">
                              {st.headPQ && st.headPQ.length === 0 && (
                                  <span className="text-slate-500 font-mono italic text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Empty</span>
                              )}

                              {/* Render SVG Lines */}
                              {st.headPQ && st.headPQ.length > 0 && (
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                      {[...Array(Math.max(st.candidates, st.headPQ.length))].map((_, i) => {
                                          const leftChild = 2 * i + 1;
                                          const rightChild = 2 * i + 2;
                                          const parentCoords = getHeapCoords(i, st.candidates);
                                          
                                          let lines = [];
                                          if (leftChild < st.headPQ.length && st.headPQ[i] !== undefined && st.headPQ[leftChild] !== undefined) {
                                              const childCoords = getHeapCoords(leftChild, st.candidates);
                                              lines.push(<line key={`l-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#38bdf8" strokeWidth="2" opacity={0.3} />);
                                          }
                                          if (rightChild < st.headPQ.length && st.headPQ[i] !== undefined && st.headPQ[rightChild] !== undefined) {
                                              const childCoords = getHeapCoords(rightChild, st.candidates);
                                              lines.push(<line key={`r-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#38bdf8" strokeWidth="2" opacity={0.3} />);
                                          }
                                          return lines;
                                      })}
                                  </svg>
                              )}

                              {/* Render Nodes */}
                              {st.headPQ && [...Array(Math.max(st.candidates, st.headPQ.length))].map((_, slotIdx) => {
                                  const coords = getHeapCoords(slotIdx, st.candidates);
                                  let heapVal = st.headPQ[slotIdx];
                                  let hasValue = heapVal !== undefined;
                                  let isRoot = slotIdx === 0;
                                  
                                  let bgClass = hasValue ? "bg-sky-100 border-sky-500 text-sky-900 shadow-sm" : "bg-slate-700 border-slate-600 border-dashed text-slate-500 opacity-50";
                                  
                                  if (st.hlFillHead && st.valAdded === heapVal) {
                                      bgClass = "bg-white border-sky-400 text-sky-600 ring-4 ring-sky-200 shadow-lg scale-110 z-20";
                                  }

                                  return (
                                      <div key={`slot-h-${slotIdx}`} className={`absolute flex flex-col items-center gap-1 transition-all duration-500 z-10`} style={{ left: `${coords.x}%`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)' }}>
                                          <div className={`w-10 h-10 flex items-center justify-center border-2 rounded-full ${bgClass} transition-all duration-300 relative`}>
                                              <span className={`font-mono font-black text-base`}>
                                                  {hasValue ? heapVal : ''}
                                              </span>
                                          </div>
                                      </div>
                                  )
                              })}

                              {/* Polling Animation Overlay */}
                              {st.hlHireHead && st.hiredVal !== undefined && (
                                  <div className={`absolute flex items-center justify-center w-12 h-12 rounded-full border-2 bg-emerald-300 border-emerald-600 text-emerald-950 font-black text-xl shadow-lg animate-out zoom-out slide-out-to-bottom-12 fade-out duration-1000 z-30`} style={{ left: `${getHeapCoords(0, st.candidates).x}%`, top: `${getHeapCoords(0, st.candidates).y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {st.hiredVal}
                                      <CheckCircle2 size={16} className="absolute -top-2 -right-2 text-emerald-700 bg-white rounded-full"/>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Center: Live Action Hub (Decision Logic Panel) */}
                  <div className="flex flex-col justify-center items-center w-full md:w-64 lg:w-72 shrink-0 gap-4 z-20">
                        {/* Always show the Hire tracking */}
                        <div className={`bg-white p-4 rounded-2xl border-2 shadow-xl w-full flex flex-col items-center transition-colors duration-300 border-slate-200`}>
                            <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest flex items-center gap-1">Total Cost Accumulator</span>
                            <div className="text-3xl font-black text-slate-800 font-mono flex items-center gap-1">
                                <DollarSign size={24} className="text-emerald-500"/>
                                {st.totalCost !== undefined ? st.totalCost : 0}
                            </div>
                        </div>

                        {(st.hlPeek || st.hlCompare) && (
                            <div className="bg-white p-4 rounded-xl border-2 border-teal-200 shadow-md w-full animate-in zoom-in text-center">
                                <span className="text-[9px] font-black uppercase text-teal-600 block mb-2">Compare Candidates</span>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-sm font-bold">
                                    <span className="text-sky-600">{st.headCost === Infinity ? 'MAX' : st.headCost}</span>
                                    <span className="text-slate-400">&lt;=</span>
                                    <span className="text-rose-600">{st.tailCost === Infinity ? 'MAX' : st.tailCost}</span>
                                </div>
                                {st.hlCompare && (
                                    <div className={`text-[10px] mt-2 font-black uppercase ${st.pickHead ? 'text-sky-600' : 'text-rose-600'}`}>
                                        {st.pickHead ? 'Hire from Head (Tiebreak: Left)' : 'Hire from Tail'}
                                    </div>
                                )}
                            </div>
                        )}
                  </div>

                  {/* Right: Tail PQ */}
                  <div className="flex-1 flex flex-col items-center min-w-[200px]">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-rose-50 text-rose-600 border-rose-200 flex items-center gap-2`}><UserPlus size={12}/> tailWorkers PQ</span>
                      
                      <div className={`relative w-full bg-slate-800 rounded-3xl border-4 ${st.hlCompare && !st.pickHead ? 'border-rose-500 ring-4 ring-rose-500/20' : 'border-slate-700'} shadow-2xl p-6 flex flex-col justify-start items-center overflow-hidden transition-all duration-500`} style={{ minHeight: `200px` }}>
                          <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none z-0"></div>
                          
                          <div className="flex flex-wrap justify-center gap-3 relative z-10 w-full items-start mt-2">
                              {st.tailPQ && st.tailPQ.length === 0 && (
                                  <span className="text-slate-500 font-mono italic text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Empty</span>
                              )}

                              {/* Render SVG Lines */}
                              {st.tailPQ && st.tailPQ.length > 0 && (
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                      {[...Array(Math.max(st.candidates, st.tailPQ.length))].map((_, i) => {
                                          const leftChild = 2 * i + 1;
                                          const rightChild = 2 * i + 2;
                                          const parentCoords = getHeapCoords(i, st.candidates);
                                          
                                          let lines = [];
                                          if (leftChild < st.tailPQ.length && st.tailPQ[i] !== undefined && st.tailPQ[leftChild] !== undefined) {
                                              const childCoords = getHeapCoords(leftChild, st.candidates);
                                              lines.push(<line key={`l-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#fb7185" strokeWidth="2" opacity={0.3} />);
                                          }
                                          if (rightChild < st.tailPQ.length && st.tailPQ[i] !== undefined && st.tailPQ[rightChild] !== undefined) {
                                              const childCoords = getHeapCoords(rightChild, st.candidates);
                                              lines.push(<line key={`r-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#fb7185" strokeWidth="2" opacity={0.3} />);
                                          }
                                          return lines;
                                      })}
                                  </svg>
                              )}

                              {/* Render Nodes */}
                              {st.tailPQ && [...Array(Math.max(st.candidates, st.tailPQ.length))].map((_, slotIdx) => {
                                  const coords = getHeapCoords(slotIdx, st.candidates);
                                  let heapVal = st.tailPQ[slotIdx];
                                  let hasValue = heapVal !== undefined;
                                  let isRoot = slotIdx === 0;
                                  
                                  let bgClass = hasValue ? "bg-rose-100 border-rose-500 text-rose-900 shadow-sm" : "bg-slate-700 border-slate-600 border-dashed text-slate-500 opacity-50";
                                  
                                  if (st.hlFillTail && st.valAdded === heapVal) {
                                      bgClass = "bg-white border-rose-400 text-rose-600 ring-4 ring-rose-200 shadow-lg scale-110 z-20";
                                  }

                                  return (
                                      <div key={`slot-t-${slotIdx}`} className={`absolute flex flex-col items-center gap-1 transition-all duration-500 z-10`} style={{ left: `${coords.x}%`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)' }}>
                                          <div className={`w-10 h-10 flex items-center justify-center border-2 rounded-full ${bgClass} transition-all duration-300 relative`}>
                                              <span className={`font-mono font-black text-base`}>
                                                  {hasValue ? heapVal : ''}
                                              </span>
                                          </div>
                                      </div>
                                  )
                              })}

                              {/* Polling Animation Overlay */}
                              {st.hlHireTail && st.hiredVal !== undefined && (
                                  <div className={`absolute flex items-center justify-center w-12 h-12 rounded-full border-2 bg-emerald-300 border-emerald-600 text-emerald-950 font-black text-xl shadow-lg animate-out zoom-out slide-out-to-bottom-12 fade-out duration-1000 z-30`} style={{ left: `${getHeapCoords(0, st.candidates).x}%`, top: `${getHeapCoords(0, st.candidates).y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {st.hiredVal}
                                      <CheckCircle2 size={16} className="absolute -top-2 -right-2 text-emerald-700 bg-white rounded-full"/>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Bottom: Hired Workers Output Log */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-600 border-slate-300 flex items-center gap-2`}><CheckCircle2 size={12}/> Hired Workers ({st.hiredWorkers?.length || 0} / {st.k})</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 relative z-10 w-full max-w-5xl px-4 min-h-[60px]">
                      {st.hiredWorkers && st.hiredWorkers.length === 0 && <span className="text-slate-400 italic text-sm">No workers hired yet</span>}
                      
                      {st.hiredWorkers && st.hiredWorkers.map((val: number, idx: number) => {
                          let isNew = idx === st.hiredWorkers.length - 1 && (st.hlHireHead || st.hlHireTail);

                          return (
                              <div key={`hire-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500`}>
                                  <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl shadow-sm bg-white transition-all duration-300 ${isNew ? 'border-emerald-400 ring-4 ring-emerald-100 text-emerald-700 scale-110 animate-in zoom-in' : 'border-slate-300 text-slate-600'}`}>
                                      <span className={`font-mono font-black text-xl`}>
                                          {val}
                                      </span>
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
                <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Total Cost to Hire K Workers</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dual Priority Queues
                  </span>
                  <span>•</span>
                  <span>LeetCode 2462</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Users size={28}/> Hire the Cheapest Candidates</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given a 0-indexed integer array <code>costs</code> where <code>costs[i]</code> is the cost of hiring the <code>ith</code> worker.</p>
                        <p>You are also given two integers <code>k</code> and <code>candidates</code>. We want to hire exactly <code>k</code> workers according to the following rules:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li>You will run <code>k</code> sessions and hire exactly one worker in each session.</li>
                            <li>In each hiring session, choose the worker with the lowest cost from either the first <code>candidates</code> workers or the last <code>candidates</code> workers. Break ties by choosing the worker with the smallest index.</li>
                            <li>If there are fewer than <code>candidates</code> workers remaining, choose from all remaining workers.</li>
                        </ul>
                        <p className="font-bold mt-4">Return the <strong>total cost</strong> to hire exactly <code>k</code> workers.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> costs = [17,12,10,2,7,2,11,20,8], k = 3, candidates = 4</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">11</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Session 1: Compare head [17,12,10,2] and tail [2,11,20,8]. Min is 2. Tie break: hire index 3 (head). Cost = 2.<br/>Session 2: Compare head [17,12,10,7] and tail [2,11,20,8]. Min is 2. Hire index 5 (tail). Cost = 2.<br/>Session 3: Compare head [17,12,10,7] and tail [11,20,8]. Min is 7. Hire index 4 (head). Cost = 7.<br/>Total Cost = 2 + 2 + 7 = 11.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= costs.length &lt;= 10^5</li>
                            <li>1 &lt;= costs[i] &lt;= 10^5</li>
                            <li>1 &lt;= k, candidates &lt;= costs.length</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">We cannot simply sort the array because the rules specifically dictate that we can only pick from the edges (the first <code>c</code> and the last <code>c</code> elements). The middle elements are "locked" until the edges are hired away.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Simulate the hiring process using <strong>Two Priority Queues</strong> (Min-Heaps). One heap maintains the active candidates from the head (left), and the other maintains active candidates from the tail (right). At each step, compare the roots of both heaps, hire the smaller one, and replenish that specific heap from the remaining unlocked pool.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> TotalCost.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Costs Array (Max 15 elements)</label>
                            <input type="text" value={costsInput} onChange={(e) => setCostsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="17, 12, 10, 2, 7, 2, 11, 20, 8" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>K (Hire)</label>
                            <input type="number" min="1" max="15" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Candidates</label>
                            <input type="number" min="1" max="5" value={cInput} onChange={(e) => setCInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="4" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-teal-900 border-teal-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-teal-400 flex items-center gap-3"><PartyPopper size={24}/> HIRING COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Hired {baseK} workers for a total cost of {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlFillHead || st.hlFillTail || st.hlHireHead || st.hlHireTail ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Dynamic Hiring Engine</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-teal-100 text-teal-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the Dual-Heap pattern to avoid full array sorting.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRightLeft size={24} className="text-teal-500"/> 1. Why Not Just Sort?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A common initial mistake is to just sort the <code>costs</code> array and pick the first <code>k</code> elements. Why is this wrong?</p>
                        <p className="text-slate-600 leading-relaxed">Because the problem forces a positional constraint: you can <strong>only</strong> hire workers from the front <code>candidates</code> pool or the back <code>candidates</code> pool. A very cheap worker sitting precisely in the middle of the array is "locked" and cannot be hired until enough edge workers are hired away to expose them. A full array sort destroys this positional data.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><FilterIcon size={24} className="text-sky-500"/> 2. The Dual-Heap Mechanism</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We simulate the two allowed candidate pools using two separate Min-Heaps.</p>
                        <p className="text-slate-600 leading-relaxed">At each step, we ensure both heaps contain up to <code>candidates</code> workers by pushing elements from <code>nextHead</code> and <code>nextTail</code>. We then compare the roots (minimums) of both heaps. By evaluating <code>headCost &lt;= tailCost</code>, we inherently handle the tie-breaker requirement ("choose the smaller index"). Since <code>headCost</code> came from the front of the array, it automatically has a smaller index than <code>tailCost</code>, so we favor it on equality.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O((K + C) log C).</strong> We initially insert up to $2 \times C$ (candidates) elements into the heaps, taking $O(C \log C)$. Then, we run $K$ hiring sessions. Each session involves $O(\log C)$ time to poll the hired worker and potentially $O(\log C)$ to push a replacement. The total runtime is dominated by the heap operations: $O((K + C) \log C)$.</li>
                            <li><strong>Space Complexity: O(C).</strong> The two Priority Queues only ever store a maximum of <code>candidates</code> elements each. We do not duplicate the input array, maintaining strict $O(C)$ auxiliary space.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-teal-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'Simulation via Data Structures' problem. The primary trap is mishandling the pointers when the left and right candidate pools overlap."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-teal-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-teal-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q1: "Why is the condition <code>nextHead &lt;= nextTail</code> so critical in the while loops?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It prevents double-counting workers when the candidate pools overlap.</p>
                            <p>If <code>candidates</code> is very large (e.g., larger than the array itself), the <code>headWorkers</code> loop might consume the entire array. Without the pointer boundary check, the <code>tailWorkers</code> loop would then run backwards over the array, adding the exact same workers into the second heap! The <code>nextHead &lt;= nextTail</code> check ensures that no single worker is ever added to both candidate pools."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What happens if one of the heaps becomes empty during the K hiring rounds?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This happens when we run out of un-hired workers on one side.</p>
                            <p>To handle this gracefully, we check <code>headWorkers.size() &gt; 0</code> before peeking. If the heap is empty, we assign <code>Integer.MAX_VALUE</code> to that side's cost. Because we are looking for the minimum cost, <code>MAX_VALUE</code> guarantees that the empty heap will lose the comparison, forcing the algorithm to correctly hire from the other, non-empty heap."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Could we do this with a single Priority Queue instead of two?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but we would need to store objects or arrays instead of primitive integers.</p>
                            <p>We could use a single Min-Heap that stores <code>[cost, index, isFromHead]</code>. However, this adds overhead: we'd have to write a custom comparator to sort by cost and then by index, and managing the <code>nextHead</code> / <code>nextTail</code> replenishments becomes slightly more convoluted. Using two primitive <code>PriorityQueue&lt;Integer&gt;</code> heaps is significantly cleaner and natively resolves the tie-breaker with a simple <code>&lt;=</code>."</p>
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
                              <Users size={20}/>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-teal-900/40 border-teal-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlFillHead || st.hlFillTail || st.hlHireHead || st.hlHireTail ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Costs Array (Max 15)</label>
                              <input type="text" value={costsInput} onChange={(e) => setCostsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="17, 12, 10, 2..." />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>K</label>
                              <input type="number" min="1" max="15" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="3" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Candidates</label>
                              <input type="number" min="1" max="5" value={cInput} onChange={(e) => setCInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="4" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-teal-500 shadow-[0_0_150px_rgba(20,184,166,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-teal-500`}></div>
                                
                                <div className="w-24 h-24 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-teal-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">HIRING COMPLETE</h2>
                                <p className="text-teal-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Finished execution</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-teal-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Hiring Cost</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2"><DollarSign size={40}/> {st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-teal-600 hover:bg-teal-700 shadow-teal-900/20`}>
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
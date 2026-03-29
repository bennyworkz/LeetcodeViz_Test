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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalHeap: {
    id: 'optimalHeap',
    title: '1. Current Pointer + Min-Heap',
    icon: <Infinity size={16} />,
    complexity: 'Time: O(log N) | Space: O(N)',
    theme: 'violet',
    code: `class SmallestInfiniteSet {
    private int current;
    private PriorityQueue<Integer> addedBack;
    private HashSet<Integer> isAddedBack;

    public SmallestInfiniteSet() {
        current = 1;
        addedBack = new PriorityQueue<>();
        isAddedBack = new HashSet<>();
    }
    
    public int popSmallest() {
        if (!addedBack.isEmpty()) {
            int res = addedBack.poll();
            isAddedBack.remove(res);
            return res;
        }
        int res = current;
        current++;
        return res;
    }
    
    public void addBack(int num) {
        if (num < current && !isAddedBack.contains(num)) {
            addedBack.add(num);
            isAddedBack.add(num);
        }
    }
}`,
    desc: "The optimal object-oriented approach. Instead of storing an actual infinite set (which is impossible), we maintain a single integer 'current' starting at 1. This represents the smallest number in our untouched infinite sequence. If a user calls addBack(num), and 'num' is strictly less than 'current' and not already in our addedBack pool, we add it to a Min-Heap. When popSmallest() is called, we first check the Min-Heap: if it has items, we pop and return the absolute smallest from it. Otherwise, we simply return 'current' and increment it."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|class|return|if|else|new|String|SmallestInfiniteSet|current|addedBack|isAddedBack|PriorityQueue|HashSet|Integer|popSmallest|addBack|num|res|isEmpty|poll|remove|contains|add)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'class', 'return', 'if', 'else', 'new'].includes(part);
            const isObject = ['String', 'SmallestInfiniteSet', 'PriorityQueue', 'HashSet', 'Integer'].includes(part);
            const isPointer = ['current', 'addedBack', 'isAddedBack', 'num', 'res'].includes(part);
            const isMapCall = ['popSmallest', 'addBack', 'isEmpty', 'poll', 'remove', 'contains', 'add'].includes(part);
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

export default function SmallestInfiniteSetVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('optimalHeap');
  
  const [commandsInput, setCommandsInput] = useState('add 2, pop, pop, pop, add 1, pop, pop, pop');
  
  const [baseCommands, setBaseCommands] = useState<{type: string, val?: number}[]>([
      {type: 'add', val: 2}, {type: 'pop'}, {type: 'pop'}, {type: 'pop'}, 
      {type: 'add', val: 1}, {type: 'pop'}, {type: 'pop'}, {type: 'pop'}
  ]);

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
      let parsedCmds: {type: string, val?: number}[] = [];
      let rawCmds = commandsInput.split(',');
      for (let cmd of rawCmds) {
          cmd = cmd.trim().toLowerCase();
          if (cmd.startsWith('add')) {
              let match = cmd.match(/\d+/);
              if (match) parsedCmds.push({type: 'add', val: parseInt(match[0], 10)});
          } else if (cmd.startsWith('pop')) {
              parsedCmds.push({type: 'pop'});
          }
      }
      
      if (parsedCmds.length === 0) {
          parsedCmds = [{type: 'add', val: 2}, {type: 'pop'}, {type: 'pop'}, {type: 'pop'}, {type: 'add', val: 1}, {type: 'pop'}, {type: 'pop'}, {type: 'pop'}];
      }
      if (parsedCmds.length > 20) parsedCmds = parsedCmds.slice(0, 20); // UI limit
      
      setBaseCommands(parsedCmds);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [commandsInput, selectedOpId]);

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
    const commands = [...baseCommands];

    // Real Min-Heap implementation to generate an accurate trace
    let heap: number[] = [];
    let isAddedBack = new Set<number>();
    let current = 1;
    let outputs: number[] = [];

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
            commands, 
            current, 
            heap: [...heap], 
            isAddedBack: new Set(isAddedBack),
            outputs: [...outputs],
            ...st 
        } 
    });

    add("Initialize", `SmallestInfiniteSet()`, 6, { hlInit: true });
    add("Initialize State", `current = 1;\naddedBack = new PriorityQueue<>();\nisAddedBack = new HashSet<>();`, 7, { hlInit: true });

    for (let cIdx = 0; cIdx < commands.length; cIdx++) {
        let cmd = commands[cIdx];

        if (cmd.type === 'pop') {
            add("Method Call", `popSmallest()\nGoal: Find and remove the absolute smallest integer in the entire set.`, 12, { cmdIdx: cIdx });
            
            let isEmpty = heap.length === 0;
            add("Check Min-Heap (Recycling Bin)", `if (!addedBack.isEmpty())\nRule: Recycled numbers are ALWAYS smaller than 'current'. We must check the Min-Heap first. Is it empty? (${isEmpty ? 'Yes' : 'No'})`, 13, { cmdIdx: cIdx, isEmpty, hlCheckEmpty: true });

            if (!isEmpty) {
                let res = heapPop()!;
                isAddedBack.delete(res);
                outputs.push(res);
                add("Pop from Heap", `int res = addedBack.poll();\nisAddedBack.remove(res);\nThe Min-Heap guarantees O(1) access to the smallest recycled number. We pop ${res} and remove it from the Set to allow future re-additions.`, 14, { cmdIdx: cIdx, popped: res, hlHeapPop: true });
                add("Return Value", `return res;\nSuccessfully returned ${res} from the recycling bin.`, 16, { cmdIdx: cIdx, returned: res, hlReturn: true });
            } else {
                let res = current;
                current++;
                outputs.push(res);
                add("Pop from Infinite Line", `int res = current;\ncurrent++;\nThe recycling bin is empty. The smallest available number must be the frontier 'current' (${res}). We extract it and push the frontier forward to ${current}.`, 18, { cmdIdx: cIdx, popped: res, hlCurrentPop: true });
                add("Return Value", `return res;\nSuccessfully returned ${res} from the untouched infinite sequence.`, 20, { cmdIdx: cIdx, returned: res, hlReturn: true });
            }

        } else if (cmd.type === 'add') {
            let num = cmd.val!;
            add("Method Call", `addBack(${num})\nGoal: Re-insert ${num} into the set if it's missing.`, 23, { cmdIdx: cIdx });
            
            let isLessThanCurrent = num < current;
            let isAlreadyAdded = isAddedBack.has(num);
            let shouldAdd = isLessThanCurrent && !isAlreadyAdded;

            add("Validate AddBack", `if (num < current && !isAddedBack.contains(num))\nCondition 1 (num < current): Is ${num} < ${current}? (${isLessThanCurrent ? 'Yes' : 'No, it is already in the infinite line'}).\nCondition 2 (Not Duplicate): Is ${num} already in the Heap? (${isAlreadyAdded ? 'Yes' : 'No'}).`, 24, { cmdIdx: cIdx, num, isLessThanCurrent, isAlreadyAdded, shouldAdd, hlCheckAdd: true });

            if (shouldAdd) {
                heapPush(num);
                isAddedBack.add(num);
                add("Add to Min-Heap", `addedBack.add(num);\nisAddedBack.add(num);\nValid! ${num} is added to the Min-Heap (bubbling up to maintain order) and recorded in the HashSet to block future duplicates.`, 25, { cmdIdx: cIdx, num, hlHeapAdd: true });
            } else {
                let reason = !isLessThanCurrent ? `It is >= current (${current}), meaning it was never popped from the infinite sequence.` : `It is already waiting inside the addedBack Min-Heap.`;
                add("Ignore AddBack", `// Ignored (O(1) No-op)\nNumber ${num} is safely ignored. ${reason} This prevents memory bloat.`, 24, { cmdIdx: cIdx, num, hlIgnore: true });
            }
        }
    }

    add("Execution Complete", `Stream of commands finished.`, 1, { isSuccess: true });

    return steps;
  }, [baseCommands, selectedOpId]);

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
      if (st.commands === undefined) return <span className="text-slate-400 italic">empty</span>;

      // Calculate how many infinite blocks to show
      const infiniteBlocks = [];
      for(let i=0; i<5; i++) {
          infiniteBlocks.push((st.current || 1) + i);
      }

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6 px-4 pb-12">
              
              {/* Top: Command Stream */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-200 flex items-center gap-2`}><ListOrdered size={12}/> Method Call Stream</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 relative z-10 w-full max-w-5xl px-4">
                      {st.commands.map((cmd: any, idx: number) => {
                          let isActive = st.cmdIdx === idx;
                          let isProcessed = st.cmdIdx !== undefined && idx < st.cmdIdx;
                          let isPop = cmd.type === 'pop';
                          
                          let bgClass = "bg-white border-slate-300";
                          let textClass = "text-slate-700";

                          if (isActive) {
                              bgClass = `bg-${themeColor}-100 ring-4 ring-${themeColor}-200 border-${themeColor}-400 z-20 scale-110 shadow-lg`;
                              textClass = `text-${themeColor}-800`;
                          } else if (isProcessed) {
                              bgClass = "bg-slate-100 border-slate-200 opacity-60";
                              textClass = "text-slate-400";
                          }

                          return (
                              <div key={`cmd-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500`}>
                                  <div className={`px-3 py-2 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-sm md:text-base ${textClass}`}>
                                          {isPop ? 'pop()' : `add(${cmd.val})`}
                                      </span>
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Middle: Core Architecture & Live Logic */}
              <div className="flex flex-col md:flex-row items-stretch w-full max-w-6xl gap-4 mt-4">
                  
                  {/* Left: Min-Heap (addedBack) */}
                  <div className="flex-1 flex flex-col items-center min-w-[250px]">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><FilterIcon size={12}/> addedBack: PriorityQueue</span>
                      
                      <div className="relative w-full bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl p-6 flex flex-col justify-start items-center overflow-hidden" style={{ minHeight: `240px` }}>
                          <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none z-0"></div>
                          
                          <div className="flex flex-wrap justify-center gap-3 relative z-10 w-full items-start">
                              {st.heap && st.heap.length === 0 && !st.hlHeapAdd && (
                                  <span className="text-slate-500 font-mono italic text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Heap is Empty</span>
                              )}

                              {/* Render SVG Lines connecting parent to child */}
                              {st.heap && st.heap.length > 0 && (
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                      {[...Array(st.heap.length)].map((_, i) => {
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
                              {st.heap && [...Array(st.heap.length)].map((_, slotIdx) => {
                                  const coords = getHeapCoords(slotIdx);
                                  let heapVal = st.heap[slotIdx];
                                  let isRoot = slotIdx === 0;
                                  
                                  let bgClass = "bg-sky-100 border-sky-400 text-sky-800 shadow-sm";
                                  
                                  // Highlight the node being added
                                  if (st.hlHeapAdd && st.num === heapVal) {
                                      bgClass = "bg-emerald-100 border-emerald-500 text-emerald-800 ring-4 ring-emerald-200 shadow-lg scale-110 z-20";
                                  }

                                  return (
                                      <div key={`slot-${slotIdx}`} className={`absolute flex flex-col items-center gap-1 transition-all duration-500 z-10`} style={{ left: `${coords.x}%`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)' }}>
                                          {isRoot && <span className="text-[8px] font-black text-sky-400 font-mono uppercase tracking-widest absolute -top-4 whitespace-nowrap">Min</span>}
                                          
                                          <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-full ${bgClass} transition-all duration-300 relative bg-white`}>
                                              <span className={`font-mono font-black text-lg`}>
                                                  {heapVal}
                                              </span>
                                          </div>
                                      </div>
                                  )
                              })}

                              {/* Polling Animation Overlay */}
                              {st.hlHeapPop && st.popped !== undefined && (
                                  <div className={`absolute flex items-center justify-center w-12 h-12 rounded-full border-2 bg-rose-200 border-rose-500 text-rose-900 font-black text-xl shadow-lg animate-out zoom-out slide-out-to-top-12 fade-out duration-1000 z-30`} style={{ left: `${getHeapCoords(0).x}%`, top: `${getHeapCoords(0).y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {st.popped}
                                      <ArrowUp size={16} className="absolute -top-4 text-rose-500 animate-bounce"/>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Center: Live Action Hub (Micro-Explanation Logic Panel) */}
                  <div className="flex flex-col justify-center items-center w-full md:w-48 lg:w-56 shrink-0 gap-4 z-20">
                        {st.hlCheckEmpty && (
                            <div className="bg-white p-4 rounded-xl border-2 border-sky-200 shadow-xl w-full animate-in zoom-in">
                                <span className="text-[10px] font-black uppercase text-sky-500 mb-2 block text-center tracking-widest">Check Heap First</span>
                                <div className="text-sm font-bold text-slate-700 text-center flex flex-col gap-1">
                                    <span>isEmpty() ?</span>
                                    <span className={`text-xl font-black ${st.isEmpty ? "text-emerald-500" : "text-rose-500"}`}>{st.isEmpty ? 'YES' : 'NO'}</span>
                                </div>
                                <div className="text-[9px] text-slate-500 text-center mt-2 font-mono border-t border-slate-100 pt-2 leading-snug">
                                    {st.isEmpty ? 'Fallback to Infinite Line' : 'Must pop from Min-Heap'}
                                </div>
                            </div>
                        )}
                        
                        {st.hlCheckAdd && st.num !== undefined && (
                            <div className="bg-white p-4 rounded-xl border-2 border-violet-200 shadow-xl w-full animate-in zoom-in">
                                <span className="text-[10px] font-black uppercase text-violet-500 mb-2 block text-center tracking-widest">Validate addBack({st.num})</span>
                                <div className="flex flex-col gap-1 text-xs font-bold text-slate-700 font-mono">
                                    <div className="flex justify-between items-center bg-slate-50 p-1 rounded">
                                        <span>{st.num} &lt; {st.current}?</span>
                                        <span className={st.isLessThanCurrent ? "text-emerald-500" : "text-rose-500"}>{st.isLessThanCurrent ? 'YES' : 'NO'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-1 rounded">
                                        <span>In Set?</span>
                                        <span className={st.isAlreadyAdded ? "text-rose-500" : "text-emerald-500"}>{st.isAlreadyAdded ? 'YES' : 'NO'}</span>
                                    </div>
                                </div>
                                <div className={`text-[10px] text-center mt-2 font-bold ${st.shouldAdd ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {st.shouldAdd ? 'Valid. Adding to Heap.' : 'Invalid. Ignoring (No-op).'}
                                </div>
                            </div>
                        )}

                        {(st.hlHeapPop || st.hlCurrentPop) && st.popped !== undefined && (
                             <div className="bg-white p-4 rounded-xl border-2 border-emerald-200 shadow-xl w-full animate-in zoom-in flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-emerald-500 mb-2 block text-center tracking-widest">Popping Smallest</span>
                                <div className="text-4xl font-black text-slate-800 text-center font-mono bg-emerald-50 w-full py-2 rounded-lg border border-emerald-100">
                                    {st.popped}
                                </div>
                                <div className="text-[9px] text-slate-500 text-center mt-2 font-black uppercase">
                                    from {st.hlHeapPop ? 'Min-Heap' : 'Infinite Line'}
                                </div>
                            </div>
                        )}

                        {st.hlHeapAdd && st.num !== undefined && (
                             <div className="bg-white p-4 rounded-xl border-2 border-sky-200 shadow-xl w-full animate-in zoom-in flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-sky-500 mb-2 block text-center tracking-widest">Registering Value</span>
                                <div className="flex flex-col items-center gap-1 font-mono text-[10px] font-black text-slate-700 bg-sky-50 w-full p-2 rounded-lg border border-sky-100">
                                    <span>Heap.add({st.num})</span>
                                    <span>Set.add({st.num})</span>
                                </div>
                            </div>
                        )}
                        
                        {st.hlIgnore && (
                             <div className="bg-white p-4 rounded-xl border-2 border-rose-200 shadow-xl w-full animate-in zoom-in flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-rose-500 mb-2 block text-center tracking-widest">No-Op Ignored</span>
                                <div className="text-center font-mono text-[9px] text-slate-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100 leading-snug">
                                    Number is already implicitly in the sequence or duplicate.
                                </div>
                            </div>
                        )}
                  </div>

                  {/* Right: The Infinite Sequence */}
                  <div className="flex-1 flex flex-col items-center min-w-[250px]">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><ArrowRightFromLine size={12}/> Infinite Sequence Pointer</span>
                      
                      <div className="relative w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 flex flex-col justify-center items-center overflow-hidden" style={{ minHeight: `240px` }}>
                          
                          <div className="flex flex-col items-center mb-6">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">current</span>
                              <div className={`font-mono text-4xl font-black transition-colors duration-500 ${st.hlCurrentPop ? 'text-emerald-500 scale-110' : 'text-slate-800'}`}>
                                  {st.current !== undefined ? st.current : 1}
                              </div>
                          </div>

                          {/* Visualization of the infinite line */}
                          <div className="flex items-center gap-2 relative mt-4 border-t-4 border-slate-200 pt-6 w-full justify-center">
                              {/* The Arrow */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-emerald-500 flex flex-col items-center">
                                  <ArrowDown size={24} strokeWidth={3} className={st.hlCurrentPop ? 'animate-bounce' : ''} />
                              </div>

                              {infiniteBlocks.map((val: number, idx: number) => {
                                  let isCurrent = idx === 0;
                                  let isPoppedAnim = st.hlCurrentPop && isCurrent;

                                  return (
                                      <div key={`inf-${idx}`} className={`flex flex-col items-center relative transition-all duration-500 ${isCurrent ? 'scale-110 z-20' : 'opacity-40'}`}>
                                          <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl shadow-sm bg-white transition-all duration-300 ${isCurrent ? 'border-emerald-400 ring-4 ring-emerald-100 text-emerald-800' : 'border-slate-300 text-slate-400'}`}>
                                              <span className="font-mono font-black text-xl">{val}</span>
                                          </div>
                                          
                                          {/* Popping animation for the sequence */}
                                          {isPoppedAnim && (
                                              <div className={`absolute inset-0 flex items-center justify-center bg-rose-200 border-2 border-rose-500 rounded-xl text-rose-900 font-mono font-black text-xl shadow-lg animate-out zoom-out slide-out-to-top-12 fade-out duration-1000 z-30`}>
                                                  {val}
                                              </div>
                                          )}
                                      </div>
                                  )
                              })}
                              
                              <div className="flex items-center text-slate-400 font-black tracking-[0.2em] ml-2">...</div>
                          </div>

                      </div>
                  </div>
              </div>

              {/* Bottom: Outputs Log */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-600 border-slate-300 flex items-center gap-2`}><Database size={12}/> Outputs (Returned from popSmallest)</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 relative z-10 w-full max-w-5xl px-4 min-h-[60px]">
                      {st.outputs && st.outputs.length === 0 && <span className="text-slate-400 italic text-sm">No outputs yet</span>}
                      
                      {st.outputs && st.outputs.map((val: number, idx: number) => {
                          let isNew = idx === st.outputs.length - 1 && (st.hlHeapPop || st.hlCurrentPop);

                          return (
                              <div key={`out-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500`}>
                                  <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl shadow-sm bg-white transition-all duration-300 ${isNew ? 'border-amber-400 ring-4 ring-amber-100 text-amber-600 scale-110 animate-in zoom-in' : 'border-slate-300 text-slate-600'}`}>
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
                <Infinity className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Smallest Number in Infinite Set</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Heap + Sequence Pointer
                  </span>
                  <span>•</span>
                  <span>LeetCode 2336</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Infinity size={28}/> Object-Oriented State Tracking</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Implement the <code>SmallestInfiniteSet</code> class:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm">
                            <li><code>SmallestInfiniteSet()</code> Initializes the SmallestInfiniteSet object to contain all positive integers.</li>
                            <li><code>int popSmallest()</code> Removes and returns the smallest integer contained in the infinite set.</li>
                            <li><code>void addBack(int num)</code> Adds a positive integer <code>num</code> back into the infinite set, if it is not already in the infinite set.</li>
                        </ul>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input</strong><br/>["SmallestInfiniteSet", "addBack", "popSmallest", "popSmallest", "popSmallest", "addBack", "popSmallest", "popSmallest", "popSmallest"]<br/>[[], [2], [], [], [], [1], [], [], []]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output</span>
                       <span className="text-slate-300 block mb-4">[null, null, 1, 2, 3, null, 1, 4, 5]</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= num &lt;= 1000</li>
                            <li>At most 1000 calls will be made in total to popSmallest and addBack.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">It is impossible to instantiate an array or set of "infinite" size. Therefore, we cannot explicitly store the set of all available numbers. We need a way to mathematically guarantee we always know the smallest number without storing the bulk of them in memory.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We maintain an integer <code>current</code> representing the frontier of the untouched infinite sequence. Every time we pop, if the heap is empty, we return <code>current</code> and increment it. If a user adds a number <em>back</em> that is smaller than <code>current</code>, we store it in a Min-Heap. The Min-Heap acts as our priority override queue.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> SmallestInfiniteSet.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Command Stream (e.g. pop, add 2)</label>
                            <input type="text" value={commandsInput} onChange={(e) => setCommandsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="pop, add 2, pop, pop" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> EXECUTION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Processed all commands in stream.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlHeapAdd || st.hlCurrentPop || st.hlHeapPop || st.hlCheckEmpty || st.hlCheckAdd ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Data Structure Render</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding architectural state separation to simulate infinity.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Infinity size={24} className="text-violet-500"/> 1. Faking Infinity</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">You cannot instantiate a data structure of infinite size. Instead, we use a concept from stream processing: tracking the frontier.</p>
                        <p className="text-slate-600 leading-relaxed">The integer <code>current</code> acts as our frontier. We implicitly define that <strong>every positive integer greater than or equal to <code>current</code> exists in our set</strong>. By doing this, we instantly compress infinite state into a single O(1) integer variable.</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(log N)</h4>
                        <p className="mb-4 text-slate-600">The operations execute in O(log N) due to the Priority Queue.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>popSmallest():</strong> If the heap is empty, we return <code>current</code> in O(1). If we pull from the heap, it takes O(log N) to bubble-down the new root.</li>
                            <li><strong>addBack(num):</strong> We check the HashSet in O(1). If valid, adding to the Min-Heap takes O(log N) to bubble-up the new value.</li>
                            <li>Therefore, the absolute worst-case operation takes O(log N) where N is the number of elements explicitly added back.</li>
                        </ul>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(N)</h4>
                        <p className="mb-4 text-slate-600">We only use space for the elements that fall "behind" our frontier.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Heap & Set Memory: O(N)</strong>
                                <span className="text-sm text-slate-600">In the worst case, a user calls <code>popSmallest()</code> N times, making <code>current = N+1</code>. They then call <code>addBack(x)</code> for all N numbers. Both the PriorityQueue and the HashSet will store N integers. Thus, auxiliary space scales linearly with the number of unique <code>addBack</code> operations, completely ignoring the "infinite" constraint.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is an object-oriented design question disguised as an algorithmic one. Interviewers are testing your ability to compose multiple data structures together to achieve bounded efficiency."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-violet-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-violet-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we need both a <code>PriorityQueue</code> AND a <code>HashSet</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "They serve two completely different constraints of the problem.</p>
                            <p>The <code>PriorityQueue</code> (Min-Heap) is required to fulfill the rule that <code>popSmallest()</code> must always return the <em>minimum</em> available number in O(log N) time. However, <code>addBack(num)</code> requires us to only add the number if it is <em>not already present</em>.</p>
                            <p>A Priority Queue does not efficiently support checking for duplicates; <code>heap.contains(num)</code> takes O(N) time because it requires a linear scan of the underlying array. By maintaining a synchronized <code>HashSet</code> alongside the heap, we can answer the 'is it already present?' question in O(1) constant time."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Could we just use a TreeSet (e.g. <code>java.util.TreeSet</code>) instead of a Heap + HashSet?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely, and it would simplify the code.</p>
                            <p>A <code>TreeSet</code> in Java is backed by a Red-Black Tree. It keeps elements sorted (O(log N) insertion) and intrinsically prevents duplicates. The implementation would just check <code>if (num &lt; current) treeSet.add(num)</code>. For <code>popSmallest</code>, we could use <code>treeSet.pollFirst()</code>.</p>
                            <p>However, many candidates prefer the PriorityQueue + HashSet because it explicitly demonstrates knowledge of how to compose primitive data structures to bypass individual limitations."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "What happens if a user calls <code>addBack(100)</code> but our <code>current</code> is only at <code>5</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The code gracefully ignores it.</p>
                            <p>Our invariant is that every number $\ge$ <code>current</code> is already implicitly 'in' the set. If <code>current = 5</code>, it means 5, 6, 7... to infinity are in the set. Therefore, 100 is already in the set! The condition <code>if (num &lt; current)</code> evaluates to false, and the operation is dropped as an instant O(1) no-op, preserving optimal memory and time."</p>
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
                              <Infinity size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlHeapAdd || st.hlCurrentPop || st.hlHeapPop || st.hlReturn ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Command Stream (e.g. pop, add 2)</label>
                              <input type="text" value={commandsInput} onChange={(e) => setCommandsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="pop, add 2, pop, pop" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">STREAM PROCESSED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Finished all operations</p>
                                
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
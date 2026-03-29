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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  minHeap: {
    id: 'minHeap',
    title: '1. Min-Heap (Priority Queue)',
    icon: <FilterIcon size={16} />,
    complexity: 'Time: O(N log K) | Space: O(K)',
    theme: 'amber',
    code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.add(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    return minHeap.peek();
}`,
    desc: "The Min-Heap approach. We maintain a Priority Queue (a binary tree where parents are smaller than children) of size K. As we iterate, we add each number to the heap. If the heap grows larger than K, we 'poll' (remove) the root element, which is guaranteed to be the absolute smallest. Because the smallest elements are constantly kicked out, the heap perfectly traps the K largest elements. The root is the Kth largest overall!"
  },
  quickSelect: {
    id: 'quickSelect',
    title: '2. Quickselect Partitioning',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N) Avg | Space: O(1)',
    theme: 'rose',
    code: `public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;
    return quickSelect(nums, 0, nums.length - 1, target);
}

private int quickSelect(int[] nums, int left, int right, int target) {
    int pivot = nums[right];
    int p = left;
    for (int i = left; i < right; i++) {
        if (nums[i] <= pivot) {
            swap(nums, p, i);
            p++;
        }
    }
    swap(nums, p, right);
    if (p == target) return nums[p];
    if (p < target) return quickSelect(nums, p + 1, right, target);
    return quickSelect(nums, left, p - 1, target);
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;
}`,
    desc: "The highly optimal Quickselect approach. Finding the Kth largest element is mathematically identical to finding the element at index (N - K) in a sorted array. We pick a 'pivot' and partition the array so that smaller elements are to the left and larger elements are to the right. The pivot is then placed in its final sorted position 'p'. If 'p' equals our target (N - K), we found our answer! Otherwise, we recursively search ONLY the left or right partition, achieving O(N) average time."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|findKthLargest|nums|num|k|PriorityQueue|minHeap|add|size|poll|peek|target|length|quickSelect|left|right|pivot|p|i|swap|temp|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'char', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'PriorityQueue', 'Integer'].includes(part);
            const isPointer = ['nums', 'num', 'k', 'minHeap', 'target', 'left', 'right', 'pivot', 'p', 'i', 'temp', 'j'].includes(part);
            const isMapCall = ['findKthLargest', 'add', 'size', 'poll', 'peek', 'length', 'quickSelect', 'swap'].includes(part);
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

export default function KthLargestVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('minHeap');
  
  const [numsInput, setNumsInput] = useState('3, 2, 1, 5, 6, 4');
  const [kInput, setKInput] = useState('2');
  
  const [baseNums, setBaseNums] = useState<number[]>([3, 2, 1, 5, 6, 4]);
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
      let parsedNums = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsedNums.length === 0) parsedNums = [3, 2, 1, 5, 6, 4];
      if (parsedNums.length > 12) parsedNums = parsedNums.slice(0, 12); // Limit strictly for UI rendering purposes
      
      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 1;
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
    const k = baseK;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { nums: [...nums], k, ...st } 
    });

    if (selectedOpId === 'minHeap') {
        let heap: number[] = [];

        // Real Min-Heap implementation to generate an accurate trace
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

        add("Function Call", `public int findKthLargest(int[] nums, int k=${k})`, 1, { heap: [...heap] });
        add("Init Min-Heap", `PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nCreated an empty Priority Queue (Binary Heap).`, 2, { hlInit: true, heap: [...heap] });

        for (let i = 0; i < nums.length; i++) {
            let num = nums[i];
            add("Loop Iteration", `for (int num : nums)\nFetching next number: ${num}.`, 3, { i, num, isCheckingFor: true, heap: [...heap] });

            heapPush(num);
            
            add("Add to Heap", `minHeap.add(num);\nAdding ${num} to the Min-Heap. The tree bubbles up to keep the smallest element at the root.`, 4, { i, num, hlAdd: true, heap: [...heap] });

            let isOverflow = heap.length > k;
            add("Check Capacity", `if (minHeap.size() > k)\nIs heap size (${heap.length}) > ${k}? (${isOverflow ? 'Yes' : 'No'})`, 5, { i, num, hlCheckSize: true, isOverflow, heap: [...heap] });

            if (isOverflow) {
                let removed = heapPop(); 
                add("Poll Smallest", `minHeap.poll();\nHeap exceeded capacity K. Polling (removing) the root node which is the smallest: ${removed}.`, 6, { i, num, hlPoll: true, removed, heap: [...heap] });
            }
        }

        add("Return Result", `return minHeap.peek();\nThe root of the Min-Heap is ${heap[0]}, which is exactly the ${k}th largest element overall!`, 9, { isSuccess: true, finalAns: heap[0], heap: [...heap] });

    } else if (selectedOpId === 'quickSelect') {
        
        let localNums = [...baseNums];
        let target = localNums.length - k;

        const addQS = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { nums: [...localNums], k, target, ...st } 
        });

        addQS("Function Call", `public int findKthLargest(int[] nums, int k=${k})`, 1, {});
        addQS("Calculate Target Index", `int target = nums.length - k;\nTo find the ${k}th largest, we seek the element that would be at index ${target} in a sorted array.`, 2, { hlInit: true });
        addQS("Call Quickselect", `return quickSelect(nums, 0, ${localNums.length - 1}, ${target});\nInitiating recursive partitioning.`, 3, { hlCall: true });

        const quickSelect = (left: number, right: number) => {
            if (steps.length > 2500) return; // Browser safety limit

            addQS("QuickSelect Frame", `private int quickSelect(..., left=${left}, right=${right}, target=${target})`, 6, { left, right });

            let pivot = localNums[right];
            let p = left;
            
            addQS("Init Pointers", `int pivot = nums[right];\nint p = left;\nChoosing ${pivot} (at index ${right}) as our pivot. Swap pointer 'p' starts at ${left}.`, 7, { left, right, pivot, p, hlPtrs: true });

            for (let i = left; i < right; i++) {
                addQS("Iterate Bounds", `for (int i = left; i < right; i++)\nChecking nums[${i}] (${localNums[i]}) against pivot (${pivot}).`, 9, { left, right, pivot, p, i, isCheckingFor: true });

                let isSmallerOrEq = localNums[i] <= pivot;
                addQS("Compare with Pivot", `if (nums[i] <= pivot)\nIs ${localNums[i]} <= ${pivot}? (${isSmallerOrEq ? 'Yes' : 'No'})`, 10, { left, right, pivot, p, i, hlCompare: true, isSmallerOrEq });

                if (isSmallerOrEq) {
                    addQS("Swap Element", `swap(nums, p, i);\nElement is smaller than pivot. Swapping indices ${p} and ${i}.`, 11, { left, right, pivot, p, i, hlSwapLoop: true, swapTargets: [p, i] });
                    // Swap
                    let temp = localNums[p];
                    localNums[p] = localNums[i];
                    localNums[i] = temp;
                    
                    p++;
                    addQS("Increment p", `p++;\nAdvancing swap pointer 'p' to ${p}.`, 12, { left, right, pivot, p, i, hlP: true });
                }
            }

            addQS("Final Pivot Swap", `swap(nums, p, right);\nPartitioning complete for this frame. Placing pivot (${pivot}) into its final sorted position at index ${p}.`, 15, { left, right, pivot, p, hlSwapPivot: true, swapTargets: [p, right] });
            // Swap pivot
            let temp = localNums[p];
            localNums[p] = localNums[right];
            localNums[right] = temp;

            addQS("Check Target", `if (p == target) return nums[p];\nDid the pivot land exactly on target index ${target}? (${p === target ? 'Yes!' : 'No'})`, 16, { left, right, pivot, p, hlCheckTarget: true });

            if (p === target) {
                addQS("Found Target!", `// target matched\nWe found the element at index ${target}: ${localNums[p]}.`, 16, { left, right, pivot, p, isSuccess: true, finalAns: localNums[p] });
                return localNums[p];
            }

            addQS("Check Left/Right Recursion", `if (p < target) return quickSelect(..., p + 1, right, target);\nWhere is the target? It's to the ${p < target ? 'RIGHT' : 'LEFT'} of the pivot.`, 17, { left, right, pivot, p, hlRecurseDir: true });

            if (p < target) {
                addQS("Recurse Right", `return quickSelect(nums, p + 1, right, target);\nTarget is right. Recursing on bounds [${p + 1}, ${right}].`, 17, { left, right, pivot, p, hlRecurseRight: true });
                return quickSelect(p + 1, right);
            } else {
                addQS("Recurse Left", `return quickSelect(nums, left, p - 1, target);\nTarget is left. Recursing on bounds [${left}, ${p - 1}].`, 18, { left, right, pivot, p, hlRecurseLeft: true });
                return quickSelect(left, p - 1);
            }
        };

        quickSelect(0, localNums.length - 1);
    }

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

  // Helper to compute node coordinates for Binary Tree render
  const getHeapCoords = (i: number) => {
      const l = Math.floor(Math.log2(i + 1));
      const p = i - (Math.pow(2, l) - 1);
      const count = Math.pow(2, l);
      const x = ((p + 0.5) / count) * 100;
      const y = l * 70 + 40;
      return { x, y };
  };

  const renderVisuals = () => {
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6 px-4 pb-12">
              
              {selectedOpId === 'minHeap' && (
                  <>
                      {/* Top: Input Array */}
                      <div className="flex flex-col items-center w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><ListOrdered size={12}/> Input Array: nums</span>
                          
                          <div className="flex flex-wrap justify-center gap-2 relative z-10 w-full max-w-4xl px-4">
                              {st.nums.map((val: number, idx: number) => {
                                  let isCurrentI = st.i === idx;
                                  let isProcessed = st.i !== undefined && idx < st.i;
                                  
                                  let bgClass = "bg-white border-slate-300";
                                  let textClass = "text-slate-700";

                                  if (isCurrentI) {
                                      bgClass = `bg-amber-100 ring-4 ring-amber-200 border-amber-400 z-20 scale-110 shadow-lg`;
                                      textClass = `text-amber-800`;
                                  } else if (isProcessed) {
                                      bgClass = "bg-slate-100 border-slate-200 opacity-60";
                                      textClass = "text-slate-400";
                                  }

                                  return (
                                      <div key={`num-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500`}>
                                          <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                              <span className={`font-mono font-black text-xl ${textClass}`}>
                                                  {val}
                                              </span>
                                          </div>
                                          <span className={`font-mono text-[9px] font-black tracking-widest ${isCurrentI ? 'text-amber-600' : 'text-slate-400'}`}>i={idx}</span>
                                      </div>
                                  )
                              })}
                          </div>
                      </div>

                      {/* Bottom: Proper Binary Heap Visualization */}
                      <div className="flex flex-col items-center w-full mt-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Network size={12}/> Priority Queue (Binary Min-Heap Tree)</span>
                          
                          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" style={{ minHeight: `${(Math.floor(Math.log2(st.k + 1)) + 1) * 70 + 60}px` }}>
                              
                              {st.heap && st.heap.length === 0 && !st.hlAdd && !st.isSuccess && (
                                  <span className="text-slate-400 font-mono italic text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Heap is currently empty</span>
                              )}

                              {/* Render SVG Lines connecting parent to child */}
                              {st.heap && st.heap.length > 0 && (
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                      {[...Array(Math.max(st.k, st.heap.length))].map((_, i) => {
                                          const leftChild = 2 * i + 1;
                                          const rightChild = 2 * i + 2;
                                          const parentCoords = getHeapCoords(i);
                                          
                                          let lines = [];
                                          // Only draw line if parent AND child exist
                                          if (leftChild < st.heap.length && st.heap[i] !== undefined && st.heap[leftChild] !== undefined) {
                                              const childCoords = getHeapCoords(leftChild);
                                              lines.push(<line key={`l-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#94a3b8" strokeWidth="2" opacity={0.5} />);
                                          }
                                          if (rightChild < st.heap.length && st.heap[i] !== undefined && st.heap[rightChild] !== undefined) {
                                              const childCoords = getHeapCoords(rightChild);
                                              lines.push(<line key={`r-${i}`} x1={`${parentCoords.x}%`} y1={parentCoords.y} x2={`${childCoords.x}%`} y2={childCoords.y} stroke="#94a3b8" strokeWidth="2" opacity={0.5} />);
                                          }
                                          return lines;
                                      })}
                                  </svg>
                              )}

                              {/* Render Nodes based on exact array structure */}
                              {st.heap && [...Array(Math.max(st.k, st.heap.length))].map((_, slotIdx) => {
                                  const coords = getHeapCoords(slotIdx);
                                  let heapVal = st.heap[slotIdx];
                                  let hasValue = heapVal !== undefined;
                                  let isRoot = slotIdx === 0;
                                  let isOverflowNode = slotIdx >= st.k; // Any node beyond capacity k
                                  
                                  let bgClass = hasValue ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm" : "bg-slate-50 border-slate-200 border-dashed text-slate-300 opacity-60";
                                  
                                  // Highlight the overflow node in red before it forces a poll
                                  if (isOverflowNode && hasValue) {
                                      bgClass = "bg-rose-100 border-rose-500 text-rose-800 ring-4 ring-rose-200 shadow-lg";
                                  }

                                  // Final Success Highlight for the root
                                  if (st.isSuccess && isRoot) {
                                      bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 scale-125 z-20 shadow-xl text-amber-900";
                                  }

                                  return (
                                      <div key={`slot-${slotIdx}`} className={`absolute flex flex-col items-center gap-1 transition-all duration-500 z-10`} style={{ left: `${coords.x}%`, top: `${coords.y}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Floating label for the root */}
                                          {isRoot && hasValue && <span className="text-[9px] font-black text-amber-500 font-mono uppercase tracking-widest absolute -top-5 whitespace-nowrap bg-white/80 px-1 rounded">Min Root</span>}
                                          {isOverflowNode && hasValue && <span className="text-[9px] font-black text-rose-500 font-mono uppercase tracking-widest absolute -top-5 whitespace-nowrap bg-white/80 px-1 rounded animate-pulse">Overflow!</span>}

                                          <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-full ${bgClass} transition-all duration-300 relative bg-white`}>
                                              <span className={`font-mono font-black text-lg md:text-xl`}>
                                                  {hasValue ? heapVal : ''}
                                              </span>
                                              {st.isSuccess && isRoot && <Crown size={20} className="text-amber-500 absolute -top-6 animate-bounce bg-white rounded-full"/>}
                                          </div>
                                          <span className="text-[8px] font-mono text-slate-400 font-bold opacity-50 absolute -bottom-4">i={slotIdx}</span>
                                      </div>
                                  )
                              })}

                              {/* Polling Animation Overlay */}
                              {st.hlPoll && st.removed !== undefined && (
                                  <div className={`absolute flex items-center justify-center w-12 h-12 rounded-full border-2 bg-rose-200 border-rose-500 text-rose-900 font-black text-xl shadow-lg animate-out zoom-out slide-out-to-top-12 fade-out duration-1000 z-30`} style={{ left: `${getHeapCoords(0).x}%`, top: `${getHeapCoords(0).y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {st.removed}
                                      <XCircle size={16} className="absolute -top-2 -right-2 text-rose-600 bg-white rounded-full"/>
                                  </div>
                              )}

                          </div>
                      </div>
                  </>
              )}

              {selectedOpId === 'quickSelect' && (
                  <div className="flex flex-col items-center w-full mt-4">
                      
                      <div className="flex justify-between w-full max-w-4xl mb-4 px-4 items-end">
                          <div className="flex flex-col">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1`}>Array Partitioning</span>
                              <span className="text-xl font-black text-slate-700 font-mono">Target Index: <span className="text-amber-500">{st.target}</span></span>
                          </div>
                          {st.isSuccess && <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><CheckCircle2 size={16}/> Target Found</span>}
                      </div>

                      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 relative z-10 w-full max-w-5xl px-4">
                          {st.nums.map((val: number, idx: number) => {
                              
                              let isLeft = st.left === idx;
                              let isRight = st.right === idx;
                              let isTarget = st.target === idx;
                              
                              let isPivot = st.pivot !== undefined && idx === st.right; // Pivot starts at right
                              if (st.hlSwapPivot && idx === st.p) isPivot = true; // Pivot moves to p at end of frame
                              
                              let isI = st.i === idx;
                              let isP = st.p === idx;
                              
                              let outOfBounds = st.left !== undefined && (idx < st.left || idx > st.right);
                              let isSwapping = st.swapTargets && st.swapTargets.includes(idx);
                              let isFinalAns = st.isSuccess && isTarget;

                              let bgClass = "bg-white border-slate-300";
                              let textClass = "text-slate-700";

                              if (isFinalAns) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-200 z-30 scale-110 shadow-xl";
                                  textClass = "text-amber-800";
                              } else if (outOfBounds) {
                                  bgClass = "bg-slate-100 border-slate-200 opacity-40";
                                  textClass = "text-slate-400";
                              } else if (isSwapping) {
                                  bgClass = "bg-rose-100 border-rose-400 z-20 scale-105 shadow-md ring-2 ring-rose-200";
                                  textClass = "text-rose-800";
                              } else if (isPivot) {
                                  bgClass = "bg-purple-100 border-purple-400 shadow-sm z-10";
                                  textClass = "text-purple-800";
                              }

                              return (
                                  <div key={`qs-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500 relative`}>
                                      
                                      {/* Target marker */}
                                      {isTarget && !isFinalAns && (
                                          <div className="absolute -top-6 text-amber-500 flex flex-col items-center animate-bounce">
                                              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200 shadow-sm mb-0.5">Target</span>
                                              <ArrowDown size={12} strokeWidth={3}/>
                                          </div>
                                      )}

                                      <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} transition-all duration-300`}>
                                          <span className={`font-mono font-black text-lg md:text-xl ${textClass}`}>
                                              {val}
                                          </span>
                                      </div>
                                      
                                      {/* Pointer markers below */}
                                      <div className="h-10 w-full flex justify-center items-start pt-1 relative">
                                          {isI && !outOfBounds && <span className="absolute top-1 text-[10px] font-black text-sky-500 bg-sky-50 border border-sky-200 px-1 rounded shadow-sm">i</span>}
                                          {isP && !outOfBounds && <span className="absolute top-5 text-[10px] font-black text-emerald-500 bg-emerald-50 border border-emerald-200 px-1 rounded shadow-sm">p</span>}
                                      </div>

                                      {isLeft && !outOfBounds && <span className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">L &rarr;</span>}
                                      {isRight && !outOfBounds && <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">&larr; R</span>}
                                  </div>
                              )
                          })}
                      </div>

                      {/* Swapping Arrow Overlay */}
                      {st.swapTargets && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500 z-40 opacity-80 animate-pulse bg-white/80 p-2 rounded-full shadow-md border border-rose-100">
                              <ArrowLeftRight size={24} strokeWidth={3}/>
                          </div>
                      )}
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
                {selectedOpId === 'minHeap' ? <FilterIcon className="text-white" size={28} /> : <ArrowLeftRight className="text-white" size={28} />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Kth Largest Element</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Array Sorting &amp; Partitioning
                  </span>
                  <span>•</span>
                  <span>LeetCode 215</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Target size={28}/> The Kth Largest Problem</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>kth</code> largest element in the array.</p>
                        <p>Note that it is the <code>kth</code> largest element in the sorted order, not the <code>kth</code> distinct element.</p>
                        <p className="font-bold mt-4">Can you solve it without sorting?</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [3,2,1,5,6,4], k = 2</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output</span>
                       <span className="text-slate-300 block mb-4">5</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= k &lt;= nums.length &lt;= 10^5</li>
                            <li>-10^4 &lt;= nums[i] &lt;= 10^4</li>
                        </ul>
                    </div>
                </section>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> {selectedOpId === 'minHeap' ? 'PriorityQueue.java' : 'Quickselect.java'}</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array (Max 12 elements)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 2, 1, 5, 6, 4" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>K</label>
                            <input type="number" min="1" max="12" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="2" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-amber-400 flex items-center gap-3"><PartyPopper size={24}/> TARGET FOUND</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">The {baseK}th largest element is {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSwapLoop || st.hlSwapPivot || st.hlAdd || st.hlPoll ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the fundamental tradeoffs between Heaps and Quickselect.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><FilterIcon size={24} className="text-amber-500"/> Approach 1: Min-Heap (Priority Queue)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A Min-Heap is a complete binary tree where every parent node is always smaller than its children. In Java, this is implemented natively as a <code>PriorityQueue</code> backed by an array.</p>
                        <p className="text-slate-600 leading-relaxed">By strictly capping the heap at size K, we can stream through the array and add elements. Whenever the heap grows to size K+1, we poll (remove) the root element. Since the root of a Min-Heap is always the absolute smallest element in the tree, we are actively throwing away the smallest values. By the end, the heap contains only the K largest elements, and its root is perfectly the Kth largest!</p>
                        <div className="mt-4 flex gap-4 text-sm font-mono text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                            <span>Time: O(N log K)</span>
                            <span>|</span>
                            <span>Space: O(K)</span>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-rose-500"/> Approach 2: Quickselect</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Quickselect is based on the partitioning logic of Quicksort (Hoare or Lomuto partition scheme). The goal is to find the element that would reside at index <code>N - K</code> if the array were fully sorted.</p>
                        <p className="text-slate-600 leading-relaxed">We pick a pivot and partition the array. If the pivot lands exactly at index <code>N - K</code>, we are done! If it lands at a smaller index, we know the target is in the right half, so we recursively search *only* the right half (and vice versa). Because we discard half the array on average each time, the search space shrinks geometrically (N + N/2 + N/4... = 2N), resulting in O(N) average time.</p>
                        <div className="mt-4 flex gap-4 text-sm font-mono text-rose-700 bg-rose-50 p-4 rounded-xl border border-rose-200">
                            <span>Time: O(N) Average, O(N²) Worst</span>
                            <span>|</span>
                            <span>Space: O(1) Auxiliary</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is one of the most frequently asked questions in all software engineering interviews. You must be able to compare Quickselect and Heaps confidently."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Quickselect is O(N), which is faster than the Heap's O(N log K). Why would anyone ever use the Min-Heap?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Quickselect requires the entire array to reside in memory at once because it relies on random access index swapping. If the data is <strong>streaming</strong> (e.g., millions of log events arriving in real-time, and we want the top 10 longest requests), Quickselect is completely useless.</p>
                            <p>The Min-Heap approach processes one element at a time and only holds exactly K elements in memory. This makes it perfect for massive, continuous data streams where O(K) space is negligible."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "You mentioned Quickselect has a worst-case time complexity of O(N²). When does that happen and how do we fix it?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The worst-case happens when the array is already sorted (or reverse sorted) and we continually pick the last element as the pivot. The partition will only shrink by 1 element each time, leading to O(N²) recursion.</p>
                            <p>To fix this, we implement <strong>Randomized Quickselect</strong>. Before partitioning, we pick a random index between <code>left</code> and <code>right</code> and swap it with the <code>right</code> element. This simple random swap guarantees that the pivot is statistically near the median, making the O(N) average time incredibly reliable in practice."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><FilterIcon size={24}/></span>
                            <span>Q3: "Wait, if we want the Kth LARGEST element, why are we using a MIN-Heap instead of a MAX-Heap?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If we used a Max-Heap of size N, we could add everything and then poll K times to get the answer. But that takes O(N log N) space and time.</p>
                            <p>By using a Min-Heap of size K, the heap naturally keeps the K largest elements we've seen so far. The <em>smallest</em> of those K largest elements sits right at the top (the root). This allows us to instantly check if a new incoming number is larger than our current threshold and evict the smallest element if necessary. It flips the logic upside-down to achieve optimal space and time bounds."</p>
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
                              {selectedOpId === 'minHeap' ? <FilterIcon size={20}/> : <ArrowLeftRight size={20}/>}
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSwapLoop || st.hlSwapPivot || st.hlAdd || st.hlPoll ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input Array (Max 12 elements)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 2, 1, 5, 6, 4" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>K</label>
                              <input type="number" min="1" max="12" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="2" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-amber-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Target Found</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">The {baseK}th Largest Element</div>
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
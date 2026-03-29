import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, ArrowDown, Minus,
  RefreshCw, CheckCircle2, CornerDownRight, GitMerge, ArrowRightLeft, SplitSquareHorizontal
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  mergeSort: {
    id: 'mergeSort',
    title: '1. Divide & Conquer (Merge Sort)',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    theme: 'fuchsia',
    code: `class Solution {
    int count = 0;

    public int reversePairs(int[] nums) {
        mergeSort(nums, 0, nums.length - 1);
        return count;
    }

    private void mergeSort(int[] nums, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        
        mergeSort(nums, left, mid);
        mergeSort(nums, mid + 1, right);
        
        countPairs(nums, left, mid, right);
        merge(nums, left, mid, right);
    }

    private void countPairs(int[] nums, int left, int mid, int right) {
        int rightIdx = mid + 1;
        for (int i = left; i <= mid; i++) {
            while (rightIdx <= right && (long) nums[i] > 2L * nums[rightIdx]) {
                rightIdx++;
            }
            count += (rightIdx - (mid + 1));
        }
    }

    private void merge(int[] nums, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        
        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j]) {
                temp[k++] = nums[i++];
            } else {
                temp[k++] = nums[j++];
            }
        }
        
        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];
        
        for (int p = 0; p < temp.length; p++) {
            nums[left + p] = temp[p];
        }
    }
}`,
    desc: "An optimal Divide and Conquer approach using Merge Sort. The naive approach of comparing every pair takes O(N²). But if we recursively divide the array into sorted halves, counting pairs becomes extremely fast! Since both the left half and right half are sorted, if `nums[i] > 2 * nums[j]`, then all elements after `i` in the left half are ALSO greater than `2 * nums[j]`. We can count entire blocks of pairs in O(N) time during the merge step."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'fuchsia', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|reversePairs|mergeSort|countPairs|merge|length|nums|left|right|mid|rightIdx|count|temp|i|j|k|p|Solution)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Solution'].includes(part);
            const isPointer = ['nums', 'count', 'left', 'right', 'mid', 'rightIdx', 'temp', 'length', 'i', 'j', 'k', 'p'].includes(part);
            const isMapCall = ['reversePairs', 'mergeSort', 'countPairs', 'merge'].includes(part);
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

export default function ReversePairsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('mergeSort');
  
  const [numsInput, setNumsInput] = useState('2, 4, 3, 5, 1');
  const [numsArr, setNumsArr] = useState<number[]>([2, 4, 3, 5, 1]);

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
      if (parsedArr.length > 8) parsedArr = parsedArr.slice(0, 8); // Hard cap for recursive tree rendering limits
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNumsArr(parseArrayInput(numsInput, [2, 4, 3, 5, 1]));
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
    let totalCount = 0;
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { arr: [...arr], totalCount, ...st } 
    });

    const doMergeSort = (left: number, right: number) => {
        if (steps.length > 2000) return;

        add("Divide: Merge Sort Entry", `private void mergeSort(int[] nums, int left, int right)\nEntering mergeSort for range [${left}, ${right}].`, 9, { hlPhase: 'split', left, right });
        
        if (left >= right) {
            add("Base Case Hit", `if (left >= right) return;\nRange size is 1 or less. Returning.`, 10, { hlPhase: 'baseCase', left, right });
            return;
        }

        let mid = Math.floor((left + right) / 2);
        add("Calculate Midpoint", `int mid = left + (right - left) / 2;\nMidpoint is index ${mid}.`, 11, { hlPhase: 'calcMid', left, right, mid });

        add("Recurse Left Half", `mergeSort(nums, left, mid);\nRecursively sorting the left half [${left}, ${mid}].`, 13, { hlPhase: 'recurseLeft', left, right, mid });
        doMergeSort(left, mid);

        add("Recurse Right Half", `mergeSort(nums, mid + 1, right);\nRecursively sorting the right half [${mid + 1}, ${right}].`, 14, { hlPhase: 'recurseRight', left, right, mid });
        doMergeSort(mid + 1, right);

        // --- Count Pairs Logic ---
        add("Count Pairs Entry", `countPairs(nums, left, mid, right);\nBoth halves are sorted! Now we count reverse pairs between them.`, 16, { hlPhase: 'countEntry', left, right, mid });
        
        let rightIdx = mid + 1;
        add("Init Right Pointer", `int rightIdx = mid + 1;\nPointer for the right sorted half starts at ${rightIdx}.`, 20, { hlPhase: 'initCount', left, right, mid, rightIdx });

        for (let i = left; i <= mid; i++) {
            add("Iterate Left Half", `for (int i = left; i <= mid; i++)\nChecking left element at index ${i} (Value: ${arr[i]}).`, 21, { hlPhase: 'loopLeft', left, right, mid, i, rightIdx });
            
            while (rightIdx <= right && arr[i] > 2 * arr[rightIdx]) {
                add("Valid Reverse Pair Found!", `while (rightIdx <= right && (long) nums[i] > 2L * nums[rightIdx])\n${arr[i]} > 2 * ${arr[rightIdx]} (${2 * arr[rightIdx]}). Condition MET!`, 22, { hlPhase: 'condMet', left, right, mid, i, rightIdx, condTrue: true });
                rightIdx++;
                add("Advance Right Pointer", `rightIdx++;\nMoving right pointer to ${rightIdx} to find more valid pairs for this left element.`, 23, { hlPhase: 'incRightIdx', left, right, mid, i, rightIdx });
            }

            if (rightIdx <= right) {
                add("Reverse Pair Invalid", `while (rightIdx <= right && (long) nums[i] > 2L * nums[rightIdx])\n${arr[i]} is NOT > 2 * ${arr[rightIdx]} (${2 * arr[rightIdx]}). Stopping right pointer.`, 22, { hlPhase: 'condMet', left, right, mid, i, rightIdx, condTrue: false });
            }

            let added = rightIdx - (mid + 1);
            totalCount += added;
            add("Accumulate Pairs", `count += (rightIdx - (mid + 1));\nAdded ${added} pairs to total count. Total is now ${totalCount}.`, 25, { hlPhase: 'addCount', left, right, mid, i, rightIdx, added, totalCount });
        }

        // --- Merge Logic ---
        add("Merge Arrays Entry", `merge(nums, left, mid, right);\nCounting complete. Now merging the two sorted halves into a single sorted range.`, 17, { hlPhase: 'mergeEntry', left, right, mid });
        
        let temp = [];
        let i = left, j = mid + 1;
        while(i <= mid && j <= right) {
            if(arr[i] <= arr[j]) temp.push(arr[i++]);
            else temp.push(arr[j++]);
        }
        while(i <= mid) temp.push(arr[i++]);
        while(j <= right) temp.push(arr[j++]);
        
        add("Merge Operation", `while (...) temp[k++] = ...\nTemporary sorted array constructed.`, 35, { hlPhase: 'mergeTemp', left, right, mid, tempArr: [...temp] });

        for(let p = 0; p < temp.length; p++) {
            arr[left + p] = temp[p];
        }
        add("Copy Back to Main Array", `for (int p = 0; p < temp.length; p++)\nnums[left + p] = temp[p];\nCopied sorted temporary array back to nums.`, 43, { hlPhase: 'copyBack', left, right, mid, tempArr: [...temp] });
    };

    add("Init Function", `public int reversePairs(int[] nums)`, 4, { hlPhase: 'init' });
    add("Start Merge Sort", `mergeSort(nums, 0, nums.length - 1);\nKicking off Divide & Conquer.`, 5, { hlPhase: 'startSort' });
    
    if (arr.length > 0) {
        doMergeSort(0, arr.length - 1);
    }

    add("Return Final Count", `return count;\nAll recursive calls complete!`, 6, { hlPhase: 'success', isSuccess: true, finalAns: totalCount });

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
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : (st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') ? 'border-fuchsia-400 ring-4 ring-fuchsia-100' : 'border-slate-200')} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                  <Activity size={14}/> {st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') ? "Counting Phase Tracker" : "Merge Sort State Monitor"}
              </span>
              
              {isSuccessEnd ? (
                  <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                      <div className={`flex items-center gap-4 text-emerald-600 bg-emerald-50 border-emerald-300 font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                          <span>Algorithm Complete</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200`}>Total Reverse Pairs: {st.finalAns}</span>
                      </div>
                  </div>
              ) : st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') || st.hlPhase?.includes('RightIdx') ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      
                      {/* Left Element (i) */}
                      {st.i !== undefined && (
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold uppercase text-slate-400">nums[i] (Left)</span>
                              <div className={`flex items-center justify-center w-16 h-16 text-2xl rounded-xl border-2 shadow-sm bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-100`}>
                                  <span className="font-black">{st.arr[st.i]}</span>
                              </div>
                          </div>
                      )}
                      
                      {/* Comparison Operator */}
                      {st.i !== undefined && st.rightIdx !== undefined && st.rightIdx <= st.right && (
                          <div className="flex flex-col items-center justify-center font-black text-2xl px-2 transition-colors w-8">
                              {st.hlPhase === 'condMet' ? (
                                  <span className={st.condTrue ? 'text-emerald-500' : 'text-rose-500'}>
                                      {st.condTrue ? '>' : '≤'}
                                  </span>
                              ) : (
                                  <span className="text-slate-300">?</span>
                              )}
                          </div>
                      )}

                      {/* Right Element (j) * 2 */}
                      {st.rightIdx !== undefined && st.rightIdx <= st.right && (
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold uppercase text-slate-400">2 * nums[rightIdx]</span>
                              <div className={`flex flex-col items-center justify-center min-w-[64px] h-16 px-4 text-xl rounded-xl border-2 shadow-sm bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-100`}>
                                  <span className="text-[10px] text-indigo-500 opacity-80 leading-none mb-1">2 * {st.arr[st.rightIdx]}</span>
                                  <span className="font-black leading-none">{2 * st.arr[st.rightIdx]}</span>
                              </div>
                          </div>
                      )}

                      {st.rightIdx !== undefined && st.rightIdx > st.right && (
                           <div className="flex flex-col items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest px-4 h-16 bg-slate-100 rounded-xl border border-slate-200">
                               Right Pointer OOB
                           </div>
                      )}

                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      
                      {/* Global Count Tracker */}
                      <div className="flex flex-col items-center min-w-[160px] animate-in zoom-in">
                          <span className={`text-[10px] font-bold uppercase mb-2 text-fuchsia-500`}>Total Reverse Pairs</span>
                          <div className={`flex items-center justify-center gap-3 w-full bg-fuchsia-50 border-2 rounded-xl py-2 px-6 transition-all duration-300 ${st.hlPhase === 'addCount' && st.added > 0 ? 'border-fuchsia-500 shadow-md ring-4 ring-fuchsia-200 scale-110' : 'border-fuchsia-200'}`}>
                              <span className={`font-black text-3xl text-fuchsia-700`}>{st.totalCount !== undefined ? st.totalCount : 0}</span>
                              {st.hlPhase === 'addCount' && st.added > 0 && <span className="text-emerald-500 font-bold text-sm">+{st.added}</span>}
                          </div>
                      </div>
                  </div>
              ) : st.left !== undefined && st.right !== undefined ? (
                  <div className="flex items-center justify-center w-full min-h-[80px] gap-6 font-mono">
                       <div className="flex flex-col items-center w-32">
                           <span className="text-[9px] font-bold uppercase text-slate-400">Active Left Bound</span>
                           <span className="text-2xl font-black text-slate-700">{st.left}</span>
                       </div>
                       <div className="flex flex-col items-center w-32 border-x border-slate-200">
                           <span className="text-[9px] font-bold uppercase text-slate-400">Active Midpoint</span>
                           <span className="text-2xl font-black text-slate-700">{st.mid !== undefined ? st.mid : '-'}</span>
                       </div>
                       <div className="flex flex-col items-center w-32">
                           <span className="text-[9px] font-bold uppercase text-slate-400">Active Right Bound</span>
                           <span className="text-2xl font-black text-slate-700">{st.right}</span>
                       </div>
                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Sub-Arrays...</span>
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
      
      const rowYBase = 120; // Base Y position for children

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Arrays Area */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '380px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Active Sub-Array Bracket */}
                          {st.left !== undefined && st.right !== undefined && !st.isSuccess && (
                              <div className="absolute border-t-4 border-x-4 border-slate-300 rounded-t-2xl z-10 transition-all duration-500 opacity-60" 
                                   style={{ 
                                       left: startX + (st.left * totalColWidth) - nodeWidth/2 - 4,
                                       width: (st.right - st.left) * totalColWidth + nodeWidth + 8,
                                       top: rowYBase - 40,
                                       height: 20
                                   }}
                              />
                          )}

                          {/* Left Half Highlight Bracket */}
                          {(st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') || st.hlPhase?.includes('RightIdx') || st.hlPhase === 'mergeEntry' || st.hlPhase === 'mergeTemp' || st.hlPhase === 'copyBack') && st.left !== undefined && st.mid !== undefined && !st.isSuccess && (
                              <div className="absolute border-b-4 border-x-4 border-sky-300 rounded-b-2xl z-10 transition-all duration-500 opacity-80" 
                                   style={{ 
                                       left: startX + (st.left * totalColWidth) - nodeWidth/2 + 2,
                                       width: (st.mid - st.left) * totalColWidth + nodeWidth - 4,
                                       top: rowYBase + 36,
                                       height: 12
                                   }}
                              >
                                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-sky-500 uppercase tracking-widest">Left Half</span>
                              </div>
                          )}

                          {/* Right Half Highlight Bracket */}
                          {(st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') || st.hlPhase?.includes('RightIdx') || st.hlPhase === 'mergeEntry' || st.hlPhase === 'mergeTemp' || st.hlPhase === 'copyBack') && st.mid !== undefined && st.right !== undefined && !st.isSuccess && (
                              <div className="absolute border-b-4 border-x-4 border-indigo-300 rounded-b-2xl z-10 transition-all duration-500 opacity-80" 
                                   style={{ 
                                       left: startX + ((st.mid + 1) * totalColWidth) - nodeWidth/2 + 2,
                                       width: (st.right - (st.mid + 1)) * totalColWidth + nodeWidth - 4,
                                       top: rowYBase + 36,
                                       height: 12
                                   }}
                              >
                                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-indigo-500 uppercase tracking-widest">Right Half</span>
                              </div>
                          )}

                          {/* Counting Pointer Arc */}
                          <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10 pointer-events-none" style={{ width: '1px', height: '1px' }}>
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {(st.hlPhase === 'condMet') && st.i !== undefined && st.rightIdx !== undefined && st.rightIdx <= st.right && !st.isSuccess && (
                                      <path 
                                          d={`M ${startX + (st.i * totalColWidth)} ${rowYBase - 36} Q ${((startX + (st.i * totalColWidth)) + (startX + (st.rightIdx * totalColWidth))) / 2} ${rowYBase - 100} ${startX + (st.rightIdx * totalColWidth)} ${rowYBase - 36}`} 
                                          fill="none" 
                                          stroke={st.condTrue ? '#10b981' : '#f43f5e'} 
                                          strokeWidth="4" 
                                          strokeDasharray="6 6"
                                          markerEnd={st.condTrue ? "url(#arrowheadCondMet)" : "url(#arrowheadCondFail)"}
                                          className="animate-pulse"
                                      />
                                  )}
                                  <defs>
                                      <marker id="arrowheadCondMet" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#10b981" />
                                      </marker>
                                      <marker id="arrowheadCondFail" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#f43f5e" />
                                      </marker>
                                  </defs>
                              </g>
                          </svg>

                          {/* Array Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                              {st.arr.map((val: number, idx: number) => {
                                  let currentX = startX + (idx * totalColWidth);
                                  
                                  let isWithinBounds = idx >= (st.left ?? 0) && idx <= (st.right ?? st.arr.length);
                                  
                                  let isLeftI = st.i === idx && (st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') || st.hlPhase?.includes('RightIdx'));
                                  let isRightJ = st.rightIdx === idx && (st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') || st.hlPhase?.includes('RightIdx'));
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-400 opacity-50"; 
                                  let scaleClass = "scale-100";

                                  if (isLeftI) {
                                      bgClass = "bg-sky-100 border-sky-500 text-sky-900 shadow-xl ring-4 ring-sky-200 z-30";
                                      scaleClass = "scale-110";
                                  } else if (isRightJ) {
                                      bgClass = "bg-indigo-100 border-indigo-500 text-indigo-900 shadow-xl ring-4 ring-indigo-200 z-30";
                                      scaleClass = "scale-110";
                                  } else if (isWithinBounds && !st.isSuccess) {
                                      bgClass = "bg-white border-slate-400 text-slate-700 shadow-sm opacity-100";
                                  }

                                  if (st.isSuccess) {
                                      bgClass = "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-md opacity-90";
                                  }

                                  return (
                                      <div key={`node-${idx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYBase}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {isLeftI && !st.isSuccess && (
                                              <span className="text-[10px] font-black uppercase text-sky-600 tracking-widest absolute -top-8 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 animate-bounce">i</span>
                                          )}
                                          {isRightJ && !st.isSuccess && (
                                              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest absolute -top-8 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 animate-bounce">j</span>
                                          )}

                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex flex-col items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-2xl">{val}</span>
                                          </div>
                                          
                                          {/* Index Display Below */}
                                          <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold opacity-60">i={idx}</span>
                                      </div>
                                  )
                              })}
                          </div>

                          {/* Temp Array for Merge Phase */}
                          {(st.hlPhase === 'mergeTemp' || st.hlPhase === 'copyBack') && st.tempArr && (
                              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible animate-in slide-in-from-bottom-8">
                                  <span className="absolute text-slate-400 font-black font-mono tracking-widest uppercase text-xs -translate-x-1/2 whitespace-nowrap" style={{ left: `${startX - 80}px`, top: `${rowYBase + 120}px` }}>temp[]</span>
                                  {st.tempArr.map((val: number, tempIdx: number) => {
                                      let targetGlobalIdx = st.left + tempIdx;
                                      let currentX = startX + (targetGlobalIdx * totalColWidth);
                                      
                                      let isBeingCopied = st.hlPhase === 'copyBack' && st.p === tempIdx;
                                      let alreadyCopied = st.hlPhase === 'copyBack' && tempIdx < st.p;

                                      let bgClass = "bg-slate-100 border-slate-300 text-slate-600 shadow-sm";
                                      let scaleClass = "scale-90";

                                      if (isBeingCopied) {
                                          bgClass = "bg-fuchsia-500 border-fuchsia-600 text-white shadow-xl ring-4 ring-fuchsia-200 z-30";
                                          scaleClass = "scale-110 -translate-y-8"; // Lift it up towards main array
                                      } else if (alreadyCopied) {
                                          bgClass = "bg-slate-50 border-slate-200 text-transparent border-dashed";
                                      }

                                      return (
                                          <div key={`temp-${tempIdx}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `calc(50% + ${currentX}px)`, top: `${rowYBase + 120}px`, transform: 'translate(-50%, -50%)' }}>
                                              <div className={`w-[${nodeWidth - 8}px] h-[${nodeWidth - 8}px] flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ${bgClass}`}>
                                                  <span className="font-mono font-black text-xl">{val}</span>
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          )}

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
                <ArrowRightLeft className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reverse Pairs</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Divide and Conquer
                  </span>
                  <span>•</span>
                  <span>LeetCode 493</span>
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
                        <p>Given an integer array <code>nums</code>, return the number of <strong>reverse pairs</strong> in the array.</p>
                        <p>A <strong>reverse pair</strong> is a pair <code>(i, j)</code> where:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><code>0 &le; i &lt; j &lt; nums.length</code> and</li>
                            <li><code>nums[i] &gt; 2 * nums[j]</code>.</li>
                        </ul>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [1,3,2,3,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The reverse pairs are:<br/>
                                (1, 4) --&gt; nums[1] = 3, nums[4] = 1, 3 &gt; 2 * 1<br/>
                                (3, 4) --&gt; nums[3] = 3, nums[4] = 1, 3 &gt; 2 * 1
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> nums = [2,4,3,5,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The reverse pairs are:<br/>
                                (1, 4) --&gt; nums[1] = 4, nums[4] = 1, 4 &gt; 2 * 1<br/>
                                (2, 4) --&gt; nums[2] = 3, nums[4] = 1, 3 &gt; 2 * 1<br/>
                                (3, 4) --&gt; nums[3] = 5, nums[4] = 1, 5 &gt; 2 * 1
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; nums.length &le; 5 * 10^4</code></li>
                            <li><code>-2^31 &le; nums[i] &le; 2^31 - 1</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className={`text-${themeColor}-500`}/> The O(N²) Bottleneck</h5>
                        <p className="text-sm leading-relaxed text-slate-600">The naive solution uses two nested loops to check every possible pair `(i, j)`. However, the array length can be up to 50,000. $50000^2$ is 2.5 billion operations, which guarantees a Time Limit Exceeded (TLE) error on competitive programming platforms.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><GitMerge size={16} className={`text-sky-500`}/> Merge Sort to the Rescue</h5>
                        <p className="text-sm leading-relaxed text-slate-600">By modifying Merge Sort, we divide the array until we hit single elements. As we merge the left and right halves back together, we exploit the fact that *both halves are sorted*. If `left[i] &gt; 2 * right[j]`, then EVERY element after `left[i]` is also `&gt; 2 * right[j]`. This allows us to count blocks of pairs instantly in O(N) time!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array (Max 8 elements for UI)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="2, 4, 3, 5, 1" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> EXECUTION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Total Reverse Pairs: {st.finalAns}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('split') ? 'text-indigo-400' : (st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') ? 'text-fuchsia-400' : (st.hlPhase?.includes('merge') || st.hlPhase?.includes('copy') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the Merge Sort modification.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><SplitSquareHorizontal size={24} className={`text-${themeColor}-500`}/> 1. Why Merge Sort?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Merge sort divides the array down to single elements and builds it back up by merging sorted halves. If we have a left sorted half and a right sorted half, we know that <strong>all elements in the left half physically appeared before all elements in the right half in the original array</strong>. This perfectly satisfies the <code>i &lt; j</code> condition of a reverse pair!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRightLeft size={24} className="text-sky-500"/> 2. The Linear Counting Trick</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Imagine the left half is <code>[4, 6, 8]</code> and right half is <code>[1, 2, 3]</code>. We iterate <code>i</code> through the left half. For <code>4</code>, we advance a <code>rightIdx</code> pointer through the right half as long as <code>4 &gt; 2 * right[rightIdx]</code>. It matches <code>1</code>. So <code>4</code> forms 1 pair. Because the left half is sorted, the next element <code>6</code> is guaranteed to be larger than <code>4</code>, so it will ALSO match <code>1</code>, and possibly more! We don't need to reset the <code>rightIdx</code> pointer. We just keep moving it forward. This allows us to count all valid pairs between the two halves in pure $O(N)$ time.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-amber-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N log N).</strong> The recursive division tree has a depth of $\log N$. At each depth level, the counting step and the merging step both take linear $O(N)$ time across all branches combined. Thus, $O(N \log N)$.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate a temporary array <code>temp</code> of size up to $N$ during the merge step to hold the sorted elements before copying them back to the main array. The recursion call stack also uses $O(\log N)$ space, but it's dwarfed by the temporary array.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Reverse Pairs is a notoriously difficult LeetCode Hard. Interviewers use this to see if you possess a deep, structural understanding of Divide & Conquer algorithms beyond just blindly calling `Arrays.sort()`."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could you count the pairs AT THE SAME TIME as you merge the two arrays?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, because the condition is `nums[i] &gt; 2 * nums[j]`, not just `nums[i] &gt; nums[j]`."</p>
                            <p>In standard 'Count Inversions' problems, the condition is just <code>nums[i] &gt; nums[j]</code>. In that specific case, you can count pairs inside the <code>merge</code> loop itself. However, because of the <code>2 *</code> multiplier here, the merging logic and the counting logic are completely decoupled. An element might be <code>&gt; 2 * nums[j]</code> but NOT yet ready to be merged. You must execute the counting loop <em>before</em> the merging loop."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "In your code, you cast `(long) nums[i] &gt; 2L * nums[rightIdx]`. Why?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent integer overflow."</p>
                            <p>The constraints state that array elements can be up to $2^{31} - 1$ (<code>Integer.MAX_VALUE</code>). If <code>nums[rightIdx]</code> is very large, <code>2 * nums[rightIdx]</code> will wrap around into a large negative number, causing the condition to falsely evaluate to true! By forcing 64-bit <code>long</code> arithmetic via <code>2L</code>, we guarantee mathematical accuracy."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "Are there any alternative approaches to Merge Sort for this problem?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, Binary Indexed Trees (Fenwick Trees) or Segment Trees."</p>
                            <p>You can process the array from right to left. For each element <code>x</code>, you query the Fenwick tree for how many elements inserted so far are strictly less than <code>x / 2.0</code>. Then, you insert <code>x</code> into the tree. While elegant, building a robust coordinate-compressed Fenwick tree from scratch in a 45-minute interview is arguably more error-prone than modifying Merge Sort."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('split') ? 'text-indigo-400' : (st.hlPhase?.includes('Count') || st.hlPhase?.includes('cond') ? 'text-fuchsia-400' : (st.hlPhase?.includes('merge') || st.hlPhase?.includes('copy') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="2, 4, 3, 5..." />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EXECUTION COMPLETE</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 text-emerald-400`}>Recursive merges finished.</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-500`}>Total Reverse Pairs Found</div>
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
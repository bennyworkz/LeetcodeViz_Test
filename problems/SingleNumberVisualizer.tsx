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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalXor: {
    id: 'optimalXor',
    title: '1. O(1) Space: XOR Bitwise',
    icon: <Binary size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'indigo',
    code: `public int singleNumber(int[] nums) {
    int ans = 0;
    for (int num : nums) {
        ans ^= num;
    }
    return ans;
}`,
    desc: "The mathematically optimal approach. It relies on the XOR operator's core properties: 1) Any number XORed with itself is 0 (A ^ A = 0). 2) Any number XORed with 0 is itself (A ^ 0 = A). 3) XOR is commutative and associative. Therefore, if we XOR every number in the array together, all pairs will cancel each other out to 0, leaving only the single unique number!"
  },
  hashSet: {
    id: 'hashSet',
    title: '2. O(N) Space: HashSet Logic',
    icon: <Boxes size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'violet',
    code: `public int singleNumber(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int num : nums) {
        if (set.contains(num)) {
            set.remove(num);
        } else {
            set.add(num);
        }
    }
    return set.iterator().next();
}`,
    desc: "The intuitive Set-based approach. We iterate through the array. If the number is NOT in the HashSet, we add it. If the number IS already in the HashSet, we remove it (meaning we've found its pair). Because every number except one appears exactly twice, all pairs will be added and then removed. The only number remaining in the Set at the end of the loop is our single number."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|singleNumber|nums|num|ans|Set|Integer|HashSet|set|contains|remove|add|iterator|next)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Set', 'Integer', 'HashSet'].includes(part);
            const isPointer = ['nums', 'num', 'ans', 'set'].includes(part);
            const isMapCall = ['singleNumber', 'contains', 'remove', 'add', 'iterator', 'next'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
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

// --- Helper for Array Block ---
interface NodeBlockProps {
  val: string | number;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  isDimmed?: boolean;
  isDeleted?: boolean;
  compact?: boolean;
  subtext?: string;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isDimmed = false, isDeleted = false, compact = false, subtext }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800', index: 'bg-violet-100 text-violet-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-400', index: 'bg-slate-50 text-slate-400' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    if (isDeleted) activeTheme = themes['disabled'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px]" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px]";
    
    const textSz = compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-50 text-rose-300 line-through' : 'bg-white/60 ' + activeTheme.text} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `i=${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function SingleNumberVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalXor');
  
  const [numsInput, setNumsInput] = useState('4, 1, 2, 1, 2');
  
  const [baseNums, setBaseNums] = useState<number[]>([4, 1, 2, 1, 2]);
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
      let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length === 0) parsed = [4, 1, 2, 1, 2];
      if (parsed.length > 15) parsed = parsed.slice(0, 15); // Limit strictly for UI rendering purposes
      
      setBaseNums(parsed);
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
    const nums = baseNums;

    if (selectedOpId === 'optimalXor') {
        let ans = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { nums, ans, ...st } 
        });

        add("Function Call", `public int singleNumber(int[] nums)`, 1, {});
        
        // Line 2
        add("Init Variable", `int ans = 0;\nInitialize our XOR accumulator to 0.`, 2, { hlInit: true });

        // Line 3-5
        for (let i = 0; i < nums.length; i++) {
            let num = nums[i];
            add("Loop Execution", `for (int num : nums)\nFetching next element: ${num} at index ${i}.`, 3, { i, num, isCheckingFor: true });

            let prevAns = ans;
            ans ^= num;

            add("XOR Operation", `ans ^= num;\nXORing accumulator (${prevAns}) with ${num}. New ans = ${ans}.`, 4, { 
                i, num, prevAns, hlXor: true 
            });
        }

        // Line 6
        add("Return Final Result", `return ans;\nPairs cancelled out. The remaining number is ${ans}.`, 6, { isSuccess: true, finalAns: ans });

    } else if (selectedOpId === 'hashSet') {
        let set = new Set<number>();
        
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { nums, set: Array.from(set), ...st } 
        });

        add("Function Call", `public int singleNumber(int[] nums)`, 1, {});
        
        // Line 2
        add("Init HashSet", `Set<Integer> set = new HashSet<>();\nCreate empty HashSet.`, 2, { hlInit: true });

        // Line 3-9
        for (let i = 0; i < nums.length; i++) {
            let num = nums[i];
            add("Loop Execution", `for (int num : nums)\nFetching next element: ${num} at index ${i}.`, 3, { i, num, isCheckingFor: true });

            let contains = set.has(num);
            add("Check Contains", `if (set.contains(num))\nIs ${num} already in the Set? (${contains ? 'Yes' : 'No'})`, 4, { 
                i, num, contains, isCheckingValid: true 
            });

            if (contains) {
                set.delete(num);
                add("Remove Pair", `set.remove(num);\n${num} found! This completes a pair, so we remove it.`, 5, { 
                    i, num, hlRemove: true, justRemoved: num 
                });
            } else {
                set.add(num);
                add("Add to Set", `set.add(num);\nFirst time seeing ${num}. Adding it to the Set.`, 7, { 
                    i, num, hlAdd: true 
                });
            }
        }

        // Line 10
        let finalAns = Array.from(set)[0] !== undefined ? Array.from(set)[0] : "None";
        add("Return Result", `return set.iterator().next();\nLoop finished. The only element left in the set is ${finalAns}.`, 10, { isSuccess: true, finalAns });
    }

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

  // Helper to format binary string safely (handles small values easily)
  const toBinary = (num: number, pad: number = 6) => {
      if (num === undefined || num === null) return "0".padStart(pad, '0');
      return (num >>> 0).toString(2).padStart(pad, '0');
  }

  const renderVisuals = () => {
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-12 pointer-events-none relative pt-6">
              
              {/* Input Array Visualization */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-6 px-3 py-1 rounded-lg border shadow-sm bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-200 flex items-center gap-2`}><Database size={12}/> Input Array: nums</span>
                  
                  <div className="flex flex-wrap justify-center gap-2 relative z-10 w-full max-w-4xl px-4">
                      {st.nums.map((val: number, idx: number) => {
                          let isTarget = st.i === idx;
                          let isDimmed = !st.isSuccess && st.i !== undefined && idx > st.i;
                          
                          let bgClass = "bg-white";
                          let borderClass = "border-slate-300";
                          let textClass = "text-slate-700";

                          if (isTarget) {
                              bgClass = `bg-${themeColor}-50`;
                              borderClass = `border-${themeColor}-400 ring-4 ring-${themeColor}-200`;
                              textClass = `text-${themeColor}-800`;
                          } else if (isDimmed) {
                              bgClass = "bg-slate-50";
                              borderClass = "border-slate-200 border-dashed";
                              textClass = "text-slate-400";
                          }

                          return (
                              <div key={`num-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-500 ${isTarget ? 'scale-110 z-20' : 'scale-100 z-10'}`}>
                                  <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-xl shadow-sm ${bgClass} ${borderClass} transition-all duration-300`}>
                                      <span className={`font-mono font-black text-xl ${textClass}`}>
                                          {val}
                                      </span>
                                  </div>
                                  <span className={`font-mono text-[9px] font-black tracking-widest ${isTarget ? `text-${themeColor}-600` : 'text-slate-400'}`}>idx {idx}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Dynamic Engine Visualization */}
              {selectedOpId === 'optimalXor' && (
                  <div className="flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500 mt-4">
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl w-full flex flex-col gap-6 relative overflow-hidden">
                          {/* Top Tag */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
                          
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Binary size={14}/> XOR Bitwise Engine</span>
                              {st.i !== undefined && <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded tracking-widest">STEP {st.i + 1} / {st.nums.length}</span>}
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4 justify-between pt-2">
                              
                              {/* Accumulated Answer (Left) */}
                              <div className="flex flex-col items-center gap-2 flex-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">ans (Accumulator)</span>
                                  <div className={`flex font-mono text-2xl font-black border-2 rounded-xl overflow-hidden transition-colors duration-500 ${st.hlXor ? 'border-indigo-400 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-200 bg-slate-50'}`}>
                                      <span className="px-4 py-3 tracking-[0.3em] text-indigo-700">{toBinary(st.prevAns !== undefined ? st.prevAns : st.ans)}</span>
                                  </div>
                                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1 font-bold">Value = {st.prevAns !== undefined ? st.prevAns : st.ans}</span>
                              </div>

                              {/* Operator (Middle) */}
                              <div className="flex flex-col items-center justify-center">
                                  <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${st.hlXor ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-400'}`}>
                                      <span className="font-mono font-black text-2xl">^</span>
                                  </div>
                              </div>

                              {/* Current Num (Right) */}
                              <div className="flex flex-col items-center gap-2 flex-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">num (Current)</span>
                                  <div className={`flex font-mono text-2xl font-black border-2 rounded-xl overflow-hidden transition-colors duration-500 ${st.hlXor ? 'border-sky-400 bg-sky-50 ring-4 ring-sky-100' : 'border-slate-200 bg-slate-50'}`}>
                                      <span className="px-4 py-3 tracking-[0.3em] text-sky-700">{toBinary(st.num !== undefined ? st.num : 0)}</span>
                                  </div>
                                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1 font-bold">Value = {st.num !== undefined ? st.num : 0}</span>
                              </div>
                          </div>

                          <div className="mt-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-2 shadow-inner">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resulting ans</span>
                              <div className="flex items-center gap-3">
                                  <span className="font-mono text-2xl font-black text-emerald-400 tracking-[0.3em]">
                                      {toBinary(st.ans)}
                                  </span>
                                  <span className="font-mono text-lg font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                                      = {st.ans}
                                  </span>
                              </div>
                          </div>

                      </div>
                  </div>
              )}

              {selectedOpId === 'hashSet' && (
                  <div className="flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500 mt-4">
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl w-full flex flex-col gap-6 relative overflow-hidden min-h-[250px]">
                          {/* Top Tag */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                          
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Boxes size={14}/> HashSet State</span>
                              {st.i !== undefined && <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded tracking-widest">STEP {st.i + 1} / {st.nums.length}</span>}
                          </div>

                          <div className="flex-1 flex items-center justify-center">
                              <div className="flex flex-wrap gap-4 justify-center items-center p-4 min-h-[120px]">
                                  {st.set && st.set.length === 0 && !st.hlAdd && !st.justRemoved && (
                                      <span className="text-slate-300 font-mono italic text-sm border-2 border-dashed border-slate-200 p-8 rounded-2xl">Set is empty</span>
                                  )}
                                  
                                  {/* Render items currently in the set */}
                                  {st.set && st.set.map((val: number, idx: number) => {
                                      // If it was just added in this step, animate it
                                      let isJustAdded = st.hlAdd && st.num === val;
                                      
                                      return (
                                          <div key={`set-${val}`} className={`w-16 h-16 rounded-full flex items-center justify-center font-mono font-black text-2xl shadow-lg transition-all duration-500 ${isJustAdded ? 'bg-emerald-100 text-emerald-700 border-4 border-emerald-400 animate-in zoom-in scale-110' : 'bg-violet-100 text-violet-700 border-4 border-violet-400'}`}>
                                              {val}
                                          </div>
                                      )
                                  })}

                                  {/* Render item just removed as a ghost animating out */}
                                  {st.hlRemove && st.justRemoved !== undefined && (
                                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-mono font-black text-2xl shadow-lg bg-rose-100 text-rose-700 border-4 border-rose-400 animate-out zoom-out scale-125 opacity-0 duration-1000`}>
                                          {st.justRemoved}
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          {/* Live Action Indicator */}
                          <div className="flex justify-center h-8">
                                {st.hlAdd && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">Added {st.num} to Set</span>}
                                {st.hlRemove && <span className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">Removed pair {st.num} from Set</span>}
                                {st.isSuccess && <span className="bg-violet-50 text-violet-600 border border-violet-200 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">Set isolated single element</span>}
                          </div>

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
                {selectedOp.icon === <Binary size={16} /> ? <Binary className="text-white" size={28} /> : <Boxes className="text-white" size={28} />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Single Number</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Multiple Approaches
                  </span>
                  <span>•</span>
                  <span>LeetCode 136</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Target size={28}/> Find the Odd One Out</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given a <strong>non-empty</strong> array of integers <code>nums</code>, every element appears twice except for one. Find that single one.<br/><br/>
                      You must implement a solution with a linear runtime complexity and use only constant extra space.
                    </div>
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Input: nums = [4, 1, 2, 1, 2]</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           4
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The challenge explicitly asks for <strong>Linear Time $O(N)$</strong> and <strong>Constant Space $O(1)$</strong>. <br/><br/>Using a nested loop takes $O(N^2)$ time. Using a HashSet or HashMap takes $O(N)$ Space. Sorting the array first takes $O(N \log N)$ time. Only the Bit Manipulation approach satisfies both conditions.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The optimal trick is to use the <strong>XOR (^)</strong> operator. <br/><br/>Because <code>A ^ A = 0</code>, any numbers that appear twice will completely cancel each other out during a sequential XOR sum. Because <code>A ^ 0 = A</code>, the only number that survives the mass cancellation is the one that appeared once!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> SingleNumber.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array (Pairs + 1 Single)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="4, 1, 2, 1, 2" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> LOOP COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Isolated the single number: {st.finalAns}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlXor || st.hlAdd || st.hlRemove ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> State Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Bitwise XOR and Space-Time Tradeoffs.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Binary size={24} className="text-indigo-500"/> 1. The Magic of XOR (Exclusive OR)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The XOR operation (<code>^</code> in Java) compares two bits and returns <code>1</code> if they are different, and <code>0</code> if they are the same. This leads to three highly useful mathematical properties:</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600 font-mono">
                            <li><strong>A ^ A = 0</strong> (Self-cancellation)</li>
                            <li><strong>A ^ 0 = A</strong> (Identity)</li>
                            <li><strong>A ^ B ^ A = A ^ A ^ B = 0 ^ B = B</strong> (Commutativity & Associativity)</li>
                        </ul>
                        <p className="mt-4 text-slate-600 leading-relaxed">Because we can reorder the operations however we want, all duplicate numbers will eventually XOR against themselves and become 0. The single odd number out will be XORed with 0, leaving it completely unmodified!</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(N)</h4>
                        <p className="mb-4 text-slate-600">Both the XOR approach and the HashSet approach run in linear time.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>XOR:</strong> A single <code>for</code> loop iterates through the array once. Bitwise XOR is a fundamental CPU instruction, making it the fastest possible $O(N)$ constant factor.</li>
                            <li><strong>HashSet:</strong> Also iterates through the array once. However, <code>HashSet.add()</code> and <code>HashSet.remove()</code> require hashing the integer and resolving collisions, giving it a much heavier hidden constant factor despite being $O(N)$.</li>
                        </ul>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-violet-500"/> 3. Space Complexity Tradeoffs</h4>
                        <p className="mb-4 text-slate-600">This is where the algorithm choice matters entirely based on constraints.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">XOR Space: O(1) Constant</strong>
                                <span className="text-sm text-slate-600">The bitwise approach maintains a single integer variable <code>ans</code>. No arrays, sets, or extra data structures are created regardless of input size.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">HashSet Space: O(N) Linear</strong>
                                <span className="text-sm text-slate-600">In the absolute worst case (where the array is sorted like <code>[1, 2, 3, 1, 2, 3, 4]</code>), the Set will grow to size $N/2$ before items start being removed. This violates the strict $O(1)$ space constraint of the problem.</span>
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
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Single Number is the quintessential Bit Manipulation interview question. The logic is elegant, but interviewers will immediately follow up to ensure you understand why and how it scales."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Does the order of numbers in the array matter for XOR?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, order is entirely irrelevant because XOR is associative and commutative.</p>
                            <p>Mathematically, <code>(A ^ B) ^ A</code> is equivalent to <code>(A ^ A) ^ B</code>. Since we accumulate all numbers into a single variable, the order they arrive doesn't matter. The bits will flip and flop, but by the end of the array, every paired bit will have flipped exactly twice (canceling out to 0), leaving only the unpaired bits."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if the integers are negative? Does the XOR trick still work?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, it works perfectly.</p>
                            <p>In Java, negative numbers are represented using Two's Complement. The XOR operator works bit-by-bit regardless of what those bits represent. A negative number XORed with itself is still exactly <code>0</code>, because every single bit (including the sign bit) is identical and therefore cancels out."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Single Number II asks to solve this if every element appears 3 times except one. Can we use a single XOR?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No. A single XOR only cancels out pairs (mod 2). If numbers appear 3 times, <code>A ^ A ^ A = A</code>, which ruins the cancellation.</p>
                            <p>For Single Number II, we must either count the occurrences of each bit across all numbers modulo 3 using an array of 32 ints, or construct a custom digital logic circuit using two integer variables (<code>ones</code> and <code>twos</code>) to track bits that have appeared 1 time and 2 times, resetting at 3."</p>
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
                              {selectedOpId === 'optimalXor' ? <Binary size={20}/> : <Boxes size={20}/>}
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlXor || st.hlAdd || st.hlRemove ? `text-${themeColor}-400` : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input Array (Pairs + 1 Single)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="4, 1, 2, 1, 2" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Single Number Isolated</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns}</div>
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
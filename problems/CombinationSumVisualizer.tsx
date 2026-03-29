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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target
} from 'lucide-react';
// import { M } from '@/dist/assets/monitor-play-rMMoWi0U';
// import { T } from '@/dist/assets/trophy-QEA5oJuV';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Backtracking w/ Target',
    icon: <Workflow size={16} />,
    complexity: 'Time: O(N^(T/M)) | Space: O(T/M)',
    code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> list = new ArrayList<>();
    backtrack(list, new ArrayList<>(), candidates, target, 0);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] nums, int remain, int start) {
    if (remain < 0) return;
    if (remain == 0) {
        list.add(new ArrayList<>(tempList));
        return;
    }
    for (int i = start; i < nums.length; i++) {
        tempList.add(nums[i]);
        backtrack(list, tempList, nums, remain - nums[i], i);
        tempList.remove(tempList.size() - 1);
    }
}`,
    desc: "The Combination Sum Backtracking approach. We explore combinations by subtracting the chosen candidate from our 'target' to keep track of the 'remain' value. Crucially, because we can reuse the same element an unlimited number of times, the recursive call passes 'i' instead of 'i + 1' for the start index. If 'remain' drops below 0, we've exceeded the target and must backtrack. If 'remain' hits exactly 0, we have found a valid combination."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-sky-600 text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|return|if|else|while|for|continue|break|new|List|ArrayList|Integer|Arrays|combinationSum|candidates|target|nums|list|backtrack|tempList|remain|start|size|length|add|remove|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  const activeStyles = { bg: `bg-sky-500/20`, border: `border-sky-500`, text: `text-sky-400` };
  
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
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'return', 'if', 'else', 'while', 'for', 'new', 'continue', 'break'].includes(part);
            const isObject = ['List', 'ArrayList', 'Integer', 'Arrays'].includes(part);
            const isPointer = ['candidates', 'target', 'nums', 'list', 'tempList', 'remain', 'start', 'i'].includes(part);
            const isMapCall = ['combinationSum', 'backtrack', 'size', 'length', 'add', 'remove'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());
            
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? 'text-sky-300' : 
                  isNaN(parseInt(part)) ? '' : 'text-emerald-400'
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

interface PointerLabelProps {
  label: string;
  color: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    
    let alignClass = "";
    let arrow = null;

    if (position === 'top') {
        alignClass = 'flex-col-reverse -top-12 left-1/2 -translate-x-1/2';
        arrow = <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    } else if (position === 'bottom') {
        alignClass = 'flex-col -bottom-12 left-1/2 -translate-x-1/2';
        arrow = <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    }

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`} style={{ transform: position === 'top' || position === 'bottom' ? `translateX(-50%) translateX(${offset}px)` : `translateY(-50%) translateY(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {arrow}
        </div>
    );
};

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

export default function CombinationSumVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [candidatesInput, setCandidatesInput] = useState('2, 3, 6, 7');
  const [targetInput, setTargetInput] = useState('7');
  
  const [baseCandidates, setBaseCandidates] = useState<number[]>([]);
  const [baseTarget, setBaseTarget] = useState<number>(7);
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 50 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'sky';

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsedCands = candidatesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      parsedCands = Array.from(new Set(parsedCands)); // distinct integers
      
      let parsedTarget = parseInt(targetInput.trim(), 10);
      if (isNaN(parsedTarget) || parsedTarget <= 0) parsedTarget = 7;
      if (parsedTarget > 12) parsedTarget = 12; // Safety cap
      
      if (parsedCands.length === 0) parsedCands = [2, 3, 6, 7];
      if (parsedCands.length > 5) parsedCands = parsedCands.slice(0, 5); // Safety cap

      setBaseCandidates(parsedCands);
      setBaseTarget(parsedTarget);
      setCurrentStep(0);
      setPan({ x: 0, y: 50 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [candidatesInput, targetInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Pre-calculate State Space Tree for layout coordinates
  const treeData = useMemo(() => {
      let nodes: any[] = [];
      let edges: any[] = [];
      let leaves: any[] = [];
      
      if (baseCandidates.length === 0) return { nodes, edges, height: 200 };

      // Node ID uniquely identified by the exact chosen path
      const build = (path: number[], depth: number, startIdx: number, remain: number) => {
          let id = path.join(',');
          let node = { 
              id, 
              path: [...path], 
              val: path.length > 0 ? path[path.length-1] : '[]', 
              remain,
              depth, 
              children: [] as any[], 
              x: 0, 
              y: 0 
          };
          nodes.push(node);
          
          if (remain < 0 || remain === 0) {
              leaves.push(node);
              return node;
          }
          
          let isLeaf = true;
          for(let i = startIdx; i < baseCandidates.length; i++) {
              isLeaf = false;
              let child = build([...path, baseCandidates[i]], depth + 1, i, remain - baseCandidates[i]);
              node.children.push(child);
              edges.push({ source: id, target: child.id });
          }
          
          if (isLeaf) leaves.push(node);
          return node;
      }
      
      let root = build([], 0, 0, baseTarget);
      
      let leafSpacing = 85; 
      leaves.forEach((l, i) => l.x = i * leafSpacing);
      
      const setX = (n: any) => {
          if (n.children.length > 0) {
              n.children.forEach(setX);
              n.x = n.children.reduce((sum: number, c: any) => sum + c.x, 0) / n.children.length;
          }
      }
      setX(root);
      
      let ySpacing = 100;
      nodes.forEach(n => n.y = n.depth * ySpacing);
      
      let minX = Math.min(...nodes.map(n => n.x));
      let maxX = Math.max(...nodes.map(n => n.x));
      let cx = (minX + maxX) / 2;
      nodes.forEach(n => n.x -= cx);
      
      let maxDepth = Math.max(...nodes.map(n => n.depth));
      return { nodes, edges, height: (maxDepth * ySpacing) };
  }, [baseCandidates, baseTarget]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!baseCandidates || baseCandidates.length === 0) return [{ phase: 'Init', description: 'Enter valid integers.', line: 1, state: {} }];

    const nums = [...baseCandidates];
    const target = baseTarget;
    let list: number[][] = [];
    let tempList: number[] = [];
    let callStack: string[] = [];
    let addedCombos = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums], 
            target, 
            list: JSON.parse(JSON.stringify(list)),
            tempList: [...tempList],
            callStack: [...callStack],
            activePath: tempList.join(','),
            addedCombos: new Set(addedCombos),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<List<Integer>> combinationSum(...)`, 1, {});
        add("Init Result List", `List<List<Integer>> list = new ArrayList<>();\nWill store all valid combinations summing to ${target}.`, 2, {});
        add("Initial Backtrack Call", `backtrack(list, new ArrayList<>(), candidates, target, 0);\nStarting the recursion with target remain = ${target}.`, 3, {});

        const backtrack = (remain: number, start: number) => {
            callStack.push(`backtrack([${tempList.join(', ')}], rem=${remain})`);
            let currentDepth = callStack.length - 1;

            add("Backtrack Entry", `private void backtrack(...)`, 7, { callDepth: currentDepth, start, remain });
            
            add("Check Negative Remain", `if (remain < 0) return;\nIs remain (${remain}) < 0? (${remain < 0 ? 'Yes' : 'No'})`, 8, { callDepth: currentDepth, start, remain, isCheckingNeg: true });
            if (remain < 0) {
                add("Prune Branch", `return;\nTarget exceeded. Dead end! Backtracking.`, 8, { callDepth: currentDepth, start, remain, isDeadEnd: true, failedAttempt: tempList[tempList.length-1] });
                callStack.pop();
                return;
            }

            add("Check Exact Match", `if (remain == 0) {\nIs remain (${remain}) == 0? (${remain === 0 ? 'Yes' : 'No'})`, 9, { callDepth: currentDepth, start, remain, isCheckingZero: true });
            if (remain === 0) {
                list.push([...tempList]);
                addedCombos.add(tempList.join(','));
                add("Add to Result", `list.add(new ArrayList<>(tempList));\nFound a valid combination summing to ${target}!`, 10, { callDepth: currentDepth, hlAddResult: list.length - 1, addedCombos: new Set(addedCombos), start, remain });
                add("Return Success", `return;\nCombination saved. Backtracking to find more.`, 11, { callDepth: currentDepth, start, remain });
                callStack.pop();
                return;
            }

            for (let i = start; i < nums.length; i++) {
                add("For Loop", `for (int i = ${i}; i < nums.length; i++)\nIterating candidates from start index ${start} onwards.`, 13, { callDepth: currentDepth, iter: i, start, remain, isEvaluatingFor: true });
                
                tempList.push(nums[i]);
                add("Add to Path", `tempList.add(nums[${i}]);\nAdding candidate ${nums[i]} to our path.`, 14, { callDepth: currentDepth, iter: i, start, remain, hlNum: i, hlTempAdd: tempList.length - 1, activePath: tempList.join(',') });

                let nextRemain = remain - nums[i];
                add("Recursive Call", `backtrack(list, tempList, nums, remain - nums[i], i);\nRecursing deeper. New remain = ${remain} - ${nums[i]} = ${nextRemain}. Passing 'i' (${i}) to allow reuse.`, 15, { callDepth: currentDepth, iter: i, start, remain, activePath: tempList.join(',') });
                backtrack(nextRemain, i);

                let removed = tempList.pop();
                add("Remove from Path (Backtrack)", `tempList.remove(tempList.size() - 1);\nReturned from recursion. Removing ${removed} to explore other combinations.`, 16, { callDepth: currentDepth, iter: i, start, remain, hlTempRemove: true, removedVal: removed, activePath: tempList.join(',') });
            }

            callStack.pop();
        };

        backtrack(target, 0);

        add("Return Final Result", `return list;\nAll ${list.length} combinations generated successfully!`, 4, { isSuccess: true, finalAns: list.length });
    }

    return steps;
  }, [baseCandidates, baseTarget, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 50 }); 
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

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6">
              
              {/* Top Section: Inputs, Current Path, Result List */}
              <div className="flex flex-col w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4">
                  
                  {/* Row 1: Arrays */}
                  <div className="flex flex-col md:flex-row w-full gap-6 items-start justify-center">
                      {/* Original Input Array */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Layout size={12}/> Candidates (nums)</span>
                          
                          <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[90px] relative">
                              
                              {/* Overlay for Start Index indicator */}
                              {st.start !== undefined && !st.isSuccess && (
                                  <div className="absolute top-1 left-2 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                                      start = {st.start}
                                  </div>
                              )}

                              {st.nums.map((val: number, idx: number) => {
                                  let isHl = false;
                                  let color = 'slate';
                                  let isDimmed = false;
                                  let labels = [];

                                  if (st.iter === idx) {
                                      isHl = true;
                                      color = 'amber';
                                      labels.push({ text: 'i', color: 'amber', pos: 'bottom' });
                                  }
                                  
                                  // Dim values before start index
                                  if (st.start !== undefined && idx < st.start) {
                                      isDimmed = true;
                                  }

                                  if (st.hlNum === idx) {
                                      isHl = true;
                                      color = 'sky';
                                  }

                                  if (st.isSuccess) {
                                      isDimmed = false;
                                      isHl = false;
                                      color = 'slate';
                                  }

                                  return (
                                      <React.Fragment key={`orig-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.map((l, j) => (
                                                    <React.Fragment key={j}>
                                                        <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                    </React.Fragment>
                                                ))}
                                              </div>
                                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} compact={true}/>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      {/* Current Subset Path (tempList) */}
                      <div className="flex flex-col items-start w-full flex-[1.5]">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><ListTree size={12}/> Current Path (tempList)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-sky-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlTempAdd ? 'border-sky-400 ring-4 ring-sky-200' : (st.hlTempRemove ? 'border-rose-400 ring-4 ring-rose-200' : 'border-sky-200')} relative`}>
                              
                              {/* Overlay for Remain tracking */}
                              {st.remain !== undefined && !st.isSuccess && (
                                  <div className={`absolute top-1 right-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm ${st.isCheckingNeg ? 'bg-rose-100 text-rose-700' : (st.isCheckingZero && st.remain === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-sky-700 border border-sky-100')}`}>
                                      remain = {st.remain}
                                  </div>
                              )}

                              {/* Render active tempList */}
                              {st.tempList && st.tempList.map((val: number, idx: number) => {
                                  let isHl = false;
                                  let color = 'sky';
                                  
                                  if (st.hlTempAdd === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`temp-${idx}-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 animate-in zoom-in slide-in-from-left-8' : 'scale-100 z-10 m-0.5'}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} compact={true} subtext={`size ${idx+1}`}/>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}

                              {/* Render popped element if backtracking */}
                              {st.hlTempRemove && st.removedVal !== undefined && (
                                  <div className={`relative transition-all duration-500 scale-110 z-20 mx-1 animate-out zoom-out slide-out-to-top-8 opacity-0`}>
                                      <NodeBlock val={st.removedVal} themeColor={'rose'} isTarget={true} isDeleted={true} compact={true}/>
                                  </div>
                              )}

                              {(!st.tempList || st.tempList.length === 0) && !st.hlTempRemove && <span className="text-slate-400 italic text-sm font-mono px-4">empty path [ ]</span>}
                          </div>
                      </div>
                  </div>

                  {/* Row 2: Completed Combinations List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Completed Combinations ('list')</span>
                      
                      <div className={`flex gap-2 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] transition-colors duration-300 border-emerald-200`}>
                          {st.list && st.list.map((perm: number[], pIdx: number) => {
                              let isHl = st.hlAddResult === pIdx;
                              return (
                                  <div key={`perm-${pIdx}`} className={`flex border-2 rounded-xl p-1 shadow-sm transition-all duration-300 ${isHl ? 'border-emerald-400 bg-emerald-100 ring-4 ring-emerald-200 scale-110 animate-in zoom-in slide-in-from-top-8 z-20' : 'border-slate-200 bg-slate-50 z-10 scale-100'}`}>
                                      {perm.length === 0 ? (
                                          <div className="w-8 h-8 flex items-center justify-center font-mono font-black text-sm text-slate-400">
                                              ∅
                                          </div>
                                      ) : (
                                          perm.map((val, vIdx) => (
                                              <div key={`p-${pIdx}-${vIdx}`} className="w-8 h-8 flex items-center justify-center font-mono font-black text-sm text-slate-700 border-r last:border-r-0 border-slate-200/50">
                                                  {val}
                                              </div>
                                          ))
                                      )}
                                  </div>
                              )
                          })}
                          {(!st.list || st.list.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">no combinations added yet</span>}
                      </div>
                  </div>

              </div>

              {/* State Space Tree Visualization - Uses mathematical pure geometric centering */}
              <div className="relative w-full flex justify-center mt-12" style={{ height: (treeData?.height || 200) + 60 }}>
                  <div className="relative w-0 h-0">
                      
                      {/* Tree Edges */}
                      <svg className="absolute overflow-visible z-0 pointer-events-none" style={{ left: 0, top: 0 }}>
                          {treeData.edges.map((edge: any, i: number) => {
                              const source = treeData.nodes.find((n:any) => n.id === edge.source);
                              const target = treeData.nodes.find((n:any) => n.id === edge.target);
                              if (!source || !target) return null;

                              let sx = source.x;
                              let sy = source.y + 24; // bottom of node (min-h 48 -> rad 24)
                              let tx = target.x;
                              let ty = target.y - 24; // top of node

                              // Check if this edge is on the active path
                              let isActiveEdge = false;
                              let isCompletedEdge = false;

                              if (st.activePath !== undefined) {
                                  if (st.activePath === target.id || st.activePath.startsWith(target.id + ',')) {
                                      isActiveEdge = true;
                                  }
                              }
                              
                              if (st.addedCombos) {
                                  if (Array.from(st.addedCombos).some((leaf: any) => leaf === target.id || leaf.startsWith(target.id + ','))) {
                                      isCompletedEdge = true;
                                  }
                              }

                              let strokeColor = '#cbd5e1'; // slate-300
                              let strokeWidth = 2;
                              let opacity = 0.4;

                              if (isCompletedEdge) { strokeColor = '#34d399'; strokeWidth = 3; opacity = 0.8; } // emerald-400
                              if (isActiveEdge) { strokeColor = '#38bdf8'; strokeWidth = 4; opacity = 1; } // sky-400

                              // Smooth curve mapping identically relative to 0,0
                              let pathD = `M ${sx},${sy} C ${sx},${sy + 30} ${tx},${ty - 30} ${tx},${ty}`;

                              return <path key={`edge-${i}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-500"/>
                          })}

                          {/* Ghost Red Edge for Exceeding Target (Remain < 0) */}
                          {st.isDeadEnd && st.activePath !== undefined && (
                              (() => {
                                  const activeNode = treeData.nodes.find((n:any) => n.id === st.activePath);
                                  if (!activeNode) return null;

                                  let sx = activeNode.x;
                                  let sy = activeNode.y + 24;
                                  
                                  let gx = sx; 
                                  let gy = sy + 70;

                                  let tx = gx;
                                  let ty = gy - 24;

                                  let pathD = `M ${sx},${sy} C ${sx},${sy + 20} ${tx},${ty - 20} ${tx},${ty}`;

                                  return <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4,4" className="transition-all duration-300 animate-[dash_1s_linear_infinite]" opacity="0.8"/>
                              })()
                          )}
                      </svg>

                      {/* Tree Nodes */}
                      {treeData.nodes.map((node: any) => {
                          let isActive = false;
                          let isCompleted = false;

                          if (st.activePath !== undefined) {
                              if (st.activePath === node.id || (node.id === "" && st.activePath === "")) {
                                  isActive = true;
                              }
                          }

                          if (st.addedCombos) {
                              if (Array.from(st.addedCombos).some((leaf: any) => leaf === node.id || leaf.startsWith(node.id + ','))) {
                                  isCompleted = true;
                              }
                          }

                          let nodeTheme = 'slate';
                          let isDimmed = !isActive && !isCompleted;
                          
                          if (isCompleted) nodeTheme = 'emerald';
                          if (isActive) nodeTheme = 'sky';
                          
                          // Highlight exact match node
                          if (isActive && node.remain === 0) nodeTheme = 'emerald';

                          if (st.isSuccess) {
                              isDimmed = false;
                              nodeTheme = 'emerald';
                          }

                          return (
                              <div key={`node-${node.id}`} className={`absolute transition-all duration-700 z-10 ${isActive ? 'z-20 scale-110' : ''}`} style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}>
                                  <NodeBlock val={node.val === '[]' ? '∅' : node.val} themeColor={nodeTheme} isTarget={isActive} isDimmed={isDimmed} compact={true}/>
                                  
                                  {/* Remain Indicator on Active Node */}
                                  {isActive && !st.isSuccess && (
                                      <div className={`absolute -right-16 top-1/2 -translate-y-1/2 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm border ${node.remain === 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                                          R={node.remain}
                                      </div>
                                  )}
                              </div>
                          )
                      })}

                      {/* Ghost Red Node for Dead End (Remain < 0) */}
                      {st.isDeadEnd && st.activePath !== undefined && (
                          (() => {
                              const activeNode = treeData.nodes.find((n:any) => n.id === st.activePath);
                              if (!activeNode) return null;

                              let gx = activeNode.x;
                              let gy = activeNode.y + 70;

                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: gx, top: gy, transform: 'translate(-50%, -50%)' }}>
                                      <NodeBlock val={st.failedAttempt !== undefined ? st.failedAttempt : 'X'} themeColor="rose" isTarget={true} compact={true}/>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                                          <XCircle size={10}/> remain &lt; 0
                                      </div>
                                  </div>
                              )
                          })()
                      )}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'sky' ? 'bg-sky-600' : 'bg-emerald-600'}`}>
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Combination Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'sky' ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Backtracking w/ Target
                  </span>
                  <span>•</span>
                  <span>LeetCode 39</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'sky' ? 'text-sky-600' : 'text-emerald-600'}`}><Target size={28}/> Reusing Candidates to hit a Target</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given an array of <strong>distinct</strong> integers <code>candidates</code> and a <code>target</code> integer, return a list of all unique combinations of candidates where the chosen numbers sum to <code>target</code>. You may return the combinations in any order.<br/><br/>
                      The <strong>same number may be chosen</strong> from candidates an unlimited number of times.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-sky-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: candidates = [2,3,6,7], target = 7</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [<br/>
                           &nbsp;&nbsp;[2,2,3],<br/>
                           &nbsp;&nbsp;[7]<br/>
                           ]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">Unlike Subsets where we pick an element at most once, here we can pick elements infinitely. This means our decision tree can go extremely deep if the candidates are small and the target is large. We stop recursing on a path only when the sum exceeds the target (<code>remain &lt; 0</code>) or exactly hits the target (<code>remain == 0</code>).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-sky-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Use Backtracking with a <code>remain</code> variable. At each node, we loop through candidates starting from <code>start</code>. The magic is in the recursive call: <code>backtrack(..., i)</code>. By passing <code>i</code> instead of <code>i + 1</code>, we allow the algorithm to reuse the exact same number on the next level down the tree.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white border-${themeColor}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${themeColor}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> CombinationSum.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Candidates Array</label>
                            <input type="text" value={candidatesInput} onChange={(e) => setCandidatesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} placeholder="2, 3, 6, 7" />
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target</label>
                            <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-800`} placeholder="7" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> BACKTRACKING COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated all {st.finalAns} combinations.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove || st.isDeadEnd ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> State Space Visualizer</span>
                       
                       {/* Call Stack Tracker */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-sky-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56`}>
                               <div className="flex justify-between items-center border-b border-sky-100 pb-1 mb-1">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-sky-600`}>Call Stack Depth</span>
                               </div>
                               <div className="flex flex-col gap-1 overflow-y-auto max-h-32 scrollbar-none">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <span key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between ${isTop ? 'bg-sky-600 text-white shadow-sm' : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
                                                {frameStr}
                                            </span>
                                        )
                                    })}
                                    {st.callStack.length === 0 && <span className="text-slate-300 italic text-[10px]">Empty</span>}
                               </div>
                           </div>
                       )}
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the mathematics and decision tree dynamics when dealing with unlimited element reuse in Combination Sum.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-sky-500"/> 1. The State Space Tree with Reuse</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike Subsets or Permutations where the tree depth is strictly bounded by the number of elements $N$, in Combination Sum, you can pick the exact same number repeatedly. The depth of the tree is bounded only by the <strong>target sum</strong>.</p>
                        <p className="text-slate-600 leading-relaxed">At any node, our choices are elements from the <code>start</code> index to the end of the array. The trick <code>backtrack(..., i)</code> ensures that we can pick the same element <code>nums[i]</code> again on the next level down. If we passed <code>i + 1</code>, we would not be able to reuse elements (which solves Combination Sum II).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-rose-500"/> 2. Pruning the Tree (remain &lt; 0)</h4>
                        <p className="text-slate-600 leading-relaxed mb-4">Because the tree can grow infinitely if we keep picking elements, we need strict stop conditions:</p>
                        <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm space-y-3">
                            <p className="font-mono text-sm font-bold text-slate-700 bg-rose-50 p-2 rounded">if (remain &lt; 0) return; <span className="font-normal text-slate-400">// Dead end</span><br/>if (remain == 0) &#123; /* Success */ return; &#125;</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Every time we add an element, we subtract its value from <code>remain</code>. The moment <code>remain</code> drops below zero, we instantly kill that branch of the tree. This stops infinite recursion. 
                            </p>
                        </div>
                    </div>

                    {/* Section 3 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time Complexity Analysis: O(N^(T/M))</h4>
                        <p className="mb-4 text-slate-600">The complexity for this problem is notoriously tricky to define precisely because the state space tree size depends heavily on the target value and the minimum value in the array.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li>Let $N$ be the number of candidates.</li>
                            <li>Let $T$ be the target value.</li>
                            <li>Let $M$ be the minimum value in the candidates array.</li>
                        </ul>
                        <div className="mt-4 p-5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
                            <p className="text-sm text-emerald-900">The maximum depth of the decision tree is $\frac(T)(M)$ (this happens if we keep choosing the smallest element $M$ over and over until we hit the target).</p>
                            <p className="text-sm text-emerald-900">At each depth, the tree branches out at most $N$ ways. Thus, the number of nodes in the worst case is an $N$-ary tree of depth $\frac(T)(M)$.</p>
                            <p className="font-bold text-emerald-800 text-center border-t border-emerald-200 pt-3 mt-2">
                                Worst-case Time Complexity = O(N^(T/M))
                            </p>
                        </div>
                    </div>

                    {/* Section 4 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-indigo-500"/> 4. Space Complexity Analysis: O(T/M)</h4>
                        <p className="mb-4 text-slate-600">Space complexity is determined by the maximum recursion depth and the size of the <code>tempList</code> used during traversal.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(T/M)</strong>
                                <span className="text-sm text-slate-600">The recursive call stack can go as deep as the longest path, which is $\frac(T)(M)$. The <code>tempList</code> also holds at most $\frac(T)(M)$ elements at any given time.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Combination Sum is heavily tested because it perfectly demonstrates how well a candidate understands recursive parameters. Interviewers love to tweak the rules (e.g., 'no reuse allowed' or 'negatives allowed') to see if you can adapt the template on the fly."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "How does the code ensure we don't get duplicate combinations like <code>[2, 3]</code> and <code>[3, 2]</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This is handled by the <code>start</code> variable in the for-loop: <code>for (int i = start; i &lt; nums.length; i++)</code>.</p>
                            <p>When we pick a number at index <code>i</code>, the recursive call passes <code>i</code> down to the next level. This means the next level can only choose elements from index <code>i</code> onwards. We are legally allowed to pick the same number again, or numbers to its right, but we are mathematically forbidden from picking numbers to its left.</p>
                            <p>Therefore, if we pick '3', we can never go back and pick '2'. This strictly enforces that all generated combinations are inherently sorted by the order they appear in the array, making it impossible to generate <code>[3, 2]</code> if <code>[2, 3]</code> was already generated."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if the candidates array contained negative numbers? Would this solution still work?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, this solution would break and result in a <strong>StackOverflowError</strong>.</p>
                            <p>Our only dead-end base case is <code>if (remain &lt; 0) return;</code>. If there are negative numbers, subtracting a negative number actually <em>increases</em> the remain value (e.g., <code>remain - (-2) = remain + 2</code>). A branch could theoretically keep picking <code>-2</code> and <code>+2</code> infinitely, oscillating the <code>remain</code> value without ever terminating.</p>
                            <p>To support negative numbers, the problem must artificially bound the depth (e.g., 'combinations of length K') to enforce a strict stop condition."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "How would you optimize this code if the candidates array was very large?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We can optimize the algorithm by sorting the array first: <code>Arrays.sort(candidates);</code></p>
                            <p>Inside the for-loop, before recursing, we can add a check: <code>if (remain - nums[i] &lt; 0) break;</code>.</p>
                            <p>Because the array is sorted, if the current element exceeds the remaining target, we know with absolute certainty that all subsequent elements (which are even larger) will also exceed the target. We can immediately <code>break</code> out of the loop instead of just <code>continue</code>-ing or recursing and failing. This aggressively prunes the state space tree and speeds up execution."</p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q4: "What if you were NOT allowed to reuse elements? (Combination Sum II)"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To solve Combination Sum II, I would make two simple modifications to this template:</p>
                            <ol className="list-decimal pl-6 mt-2 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm">
                                <li>Change the recursive call from <code>backtrack(..., i)</code> to <code>backtrack(..., i + 1)</code>. This ensures we immediately move past the chosen element.</li>
                                <li>Since we cannot reuse elements, the input might contain duplicates which cause duplicate combinations. I would sort the array and add the standard pruning line: <br/><code>if (i &gt; start &amp;&amp; nums[i] == nums[i - 1]) continue;</code></li>
                            </ol>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-sky-600 shadow-sky-900/50`}><Code2 size={20}/></div>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove || st.isDeadEnd ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Candidates Array</label>
                              <input type="text" value={candidatesInput} onChange={(e) => setCandidatesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500`} />
                          </div>
                          <div className="w-32 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target</label>
                              <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-800`} />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-sky-600 text-white rounded-[2rem] hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-sky-500 shadow-[0_20px_50px_rgba(14,165,233,0.3)]`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {!st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 flex flex-col gap-2 animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-900 border-2 border-slate-700 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-end gap-2 transition-all duration-300 w-64 max-h-64 overflow-y-auto scrollbar-none`}>
                               <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-700 pb-2`}>Call Stack Depth</span>
                               {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                        <div key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between ${isTop ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-800 text-sky-400'}`}>
                                            <span>{frameStr}</span>
                                        </div>
                                   )
                               })}
                           </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Generated All Combinations</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Result Size</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns} Lists</div>
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
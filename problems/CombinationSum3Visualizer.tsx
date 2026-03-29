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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  backtracking: {
    id: 'backtracking',
    title: '1. Backtracking (DFS)',
    icon: <GitFork size={16} />,
    complexity: 'Time: O(9! / (9-K)! K!) | Space: O(K)',
    theme: 'indigo',
    code: `public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> results = new ArrayList<>();
    backtrack(1, 0, k, n, new ArrayList<>(), results);
    return results;
}

private void backtrack(int start, int sum, int k, int n, List<Integer> path, List<List<Integer>> results) {
    if (path.size() == k) {
        if (sum == n) {
            results.add(new ArrayList<>(path));
        }
        return;
    }
    
    for (int i = start; i <= 9; i++) {
        if (sum + i > n) break; // Pruning
        
        path.add(i);
        backtrack(i + 1, sum + i, k, n, path, results);
        path.remove(path.size() - 1);
    }
}`,
    desc: "The classic Backtracking approach. We recursively build combinations starting from 1 up to 9. We maintain a 'path' list representing our current combination and a running 'sum'. At each step, we can either choose a number or skip it. If our path reaches length K, we check if the sum equals N; if so, it's a valid combination! Crucially, we 'prune' the search tree: if adding the current number 'i' exceeds our target 'N', we immediately break out of the loop because all subsequent numbers (which are even larger) will also exceed N. After exploring a path, we backtrack by removing the last element."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|new|String|combinationSum3|backtrack|List|ArrayList|Integer|k|n|results|start|sum|path|size|add|remove|i|break)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'List', 'ArrayList', 'Integer'].includes(part);
            const isPointer = ['k', 'n', 'results', 'start', 'sum', 'path', 'i'].includes(part);
            const isMapCall = ['combinationSum3', 'backtrack', 'size', 'add', 'remove'].includes(part);
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
        alignClass = 'flex-col-reverse -top-10 left-1/2 -translate-x-1/2';
        arrow = <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    } else if (position === 'bottom') {
        alignClass = 'flex-col -bottom-10 left-1/2 -translate-x-1/2';
        arrow = <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    }

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`} style={{ transform: position === 'top' || position === 'bottom' ? `translateX(-50%) translateX(${offset}px)` : `translateY(-50%) translateY(${offset}px)`}}>
            <span className={`text-[9px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
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
        ? "min-w-[40px] md:min-w-[44px] min-h-[40px] md:min-h-[44px]" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px]";
    
    const textSz = compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl";
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
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `idx ${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function CombinationSum3Visualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('backtracking');
  
  const [kInput, setKInput] = useState('3');
  const [nInput, setNInput] = useState('9');
  
  const [baseK, setBaseK] = useState<number>(3);
  const [baseN, setBaseN] = useState<number>(9);

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
      let parsedK = parseInt(kInput.trim(), 10);
      if (isNaN(parsedK) || parsedK < 1) parsedK = 1;
      if (parsedK > 9) parsedK = 9; // K can't be more than 9 since we only use 1-9 once

      let parsedN = parseInt(nInput.trim(), 10);
      if (isNaN(parsedN) || parsedN < 1) parsedN = 1;
      if (parsedN > 60) parsedN = 60; // Max possible sum of 1..9 is 45, cap at 60 for UI safety

      setBaseK(parsedK);
      setBaseN(parsedN);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [kInput, nInput, selectedOpId]);

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
      
      const build = (pathArr: number[], sum: number, start: number, depth: number) => {
          let id = pathArr.join(',') || 'root';
          let node = { 
              id: id, 
              path: pathArr, 
              val: pathArr.length > 0 ? pathArr[pathArr.length-1] : 'S', 
              depth, 
              sum,
              children: [] as any[], 
              x: 0, 
              y: 0,
              pruned: false
          };
          nodes.push(node);
          
          if (pathArr.length === baseK) {
              leaves.push(node);
              return node;
          }
          
          for (let i = start; i <= 9; i++) {
              if (sum + i > baseN) {
                  // Reached a pruned leaf
                  let prunedArr = [...pathArr, i];
                  let childId = prunedArr.join(',');
                  let childNode = {
                      id: childId, path: prunedArr, val: i, depth: depth + 1, sum: sum + i, children: [], x: 0, y: 0, pruned: true
                  };
                  nodes.push(childNode);
                  leaves.push(childNode);
                  node.children.push(childNode);
                  edges.push({ source: node.id, target: childNode.id, type: 'pruned' });
                  break; // Stop branching further!
              }

              let childArr = [...pathArr, i];
              let child = build(childArr, sum + i, i + 1, depth + 1);
              node.children.push(child);
              edges.push({ source: node.id, target: child.id, type: 'valid' });
          }
          
          if (node.children.length === 0 && pathArr.length < baseK) {
              leaves.push(node);
          }

          return node;
      }
      
      let root = build([], 0, 1, 0);
      
      let leafSpacing = 45; // Space out the leaves horizontally
      leaves.forEach((l, i) => l.x = i * leafSpacing);
      
      const setX = (n: any) => {
          if (n.children.length > 0) {
              n.children.forEach(setX);
              n.x = n.children.reduce((sum: number, c: any) => sum + c.x, 0) / n.children.length;
          }
      }
      setX(root);
      
      let ySpacing = 70; // Vertical spacing per depth level
      nodes.forEach(n => n.y = n.depth * ySpacing);
      
      let minX = Math.min(...nodes.map(n => n.x));
      let maxX = Math.max(...nodes.map(n => n.x));
      let cx = (minX + maxX) / 2;
      nodes.forEach(n => n.x -= cx);
      
      let maxDepth = Math.max(...nodes.map(n => n.depth));
      return { nodes, edges, height: (maxDepth * ySpacing) };
  }, [baseK, baseN]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const k = baseK;
    const n = baseN;

    let results: number[][] = [];
    let path: number[] = [];
    let addedCombos = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            k, n, path: [...path], results: results.map(r => [...r]), addedCombos: new Set(addedCombos), activePath: path.join(','), ...st 
        } 
    });

    add("Function Call", `public List<List<Integer>> combinationSum3(int k=${k}, int n=${n})`, 1, {});
    add("Initialize", `List<List<Integer>> results = new ArrayList<>();\nbacktrack(1, 0, ...);\nStarting DFS recursion with start=1 and sum=0.`, 2, { hlInit: true });

    const backtrack = (start: number, sum: number, callDepth: number) => {
        if (steps.length > 2500) return; // Prevent infinite loop / browser crash for large traces

        add("DFS Entry", `private void backtrack(start=${start}, sum=${sum}, ...)\nEntering recursive frame at depth ${callDepth}.`, 6, { start, sum, callDepth });

        add("Check K Constraint", `if (path.size() == k)\nIs current path length (${path.length}) equal to K (${k})?`, 7, { start, sum, callDepth, hlCheckK: true });

        if (path.length === k) {
            add("Check N Constraint", `if (sum == n)\nLength is ${k}. Is current sum (${sum}) equal to N (${n})?`, 8, { start, sum, callDepth, hlCheckN: true });
            if (sum === n) {
                results.push([...path]);
                addedCombos.add(path.join(','));
                add("Valid Combination Found!", `results.add(new ArrayList<>(path));\nPerfect match! Added [${path.join(', ')}] to results array.`, 9, { start, sum, callDepth, hlSuccess: true });
            } else {
                add("Invalid Combination", `// Return implicitly\nSum is ${sum}, but we need ${n}. This path is invalid and will be discarded.`, 11, { start, sum, callDepth, hlFail: true });
            }
            return;
        }

        for (let i = start; i <= 9; i++) {
            if (steps.length > 2500) return;
            
            add("Loop Iteration", `for (int i = ${i}; i <= 9; i++)\nConsidering picking number ${i}.`, 14, { start, sum, callDepth, i, hlLoop: true });

            let newSum = sum + i;
            let overTarget = newSum > n;
            
            add("Pruning Check", `if (sum + i > n) break;\nWould adding ${i} exceed our target ${n}? (${sum} + ${i} = ${newSum} > ${n}? ${overTarget ? 'Yes' : 'No'})`, 15, { start, sum, callDepth, i, newSum, overTarget, hlPruneCheck: true });

            if (overTarget) {
                add("Prune Branch", `break;\nTarget exceeded! Since the remaining numbers in the pool are even larger, we break the loop immediately to save time.`, 15, { start, sum, callDepth, i, newSum, overTarget, hlPruneBreak: true, activePath: [...path, i].join(',') });
                break;
            }

            path.push(i);
            add("Choose Number", `path.add(${i});\nPicking ${i}. Path is now [${path.join(', ')}].`, 17, { start, sum, callDepth, i, newSum, hlChoose: true });

            add("Recursive Call", `backtrack(${i+1}, ${newSum}, ...);\nRecursing deeper to pick the next numbers...`, 18, { start, sum, callDepth, i, newSum, hlRecurse: true });
            backtrack(i + 1, newSum, callDepth + 1);

            if (steps.length > 2500) return;
            let popped = path.pop();
            add("Backtrack (Undo Choice)", `path.remove(path.size() - 1);\nReturned from recursion. Removing ${popped} to explore alternative combinations.`, 19, { start, sum, callDepth, i, hlBacktrack: true, popped });
        }
    };

    backtrack(1, 0, 0);

    add("Return Final Results", `return results;\nExplored the entire state space tree. Found ${results.length} valid combinations.`, 4, { isSuccess: true, finalAns: results });

    return steps;
  }, [baseK, baseN, selectedOpId]);

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
      if (st.k === undefined) return <span className="text-slate-400 italic">empty</span>;

      // Ensure path is an array
      const currentPath = Array.isArray(st.path) ? st.path : [];

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Inputs, Current Path, Result List */}
              <div className="flex flex-col w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4">
                  
                  {/* Row 1: The Number Pool (1 to 9) */}
                  <div className="flex flex-col items-center w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><ListOrdered size={12}/> Available Numbers Pool</span>
                      
                      <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[90px] relative">
                          {[1,2,3,4,5,6,7,8,9].map((val: number) => {
                              
                              let isPicked = currentPath.includes(val);
                              let isUnavailable = val < st.start && !isPicked;
                              let isCurrentI = st.i === val;
                              let isPruned = st.hlPruneBreak && val >= st.i; // If we broke at i, all >= i are visually pruned

                              let color = 'slate';
                              let isHl = false;
                              let isDimmed = false;
                              let isDel = false;
                              let labels = [];

                              if (isCurrentI) {
                                  isHl = true;
                                  color = 'indigo';
                                  labels.push({ text: 'i', color: 'indigo', pos: 'bottom' });
                              } else if (isPicked) {
                                  color = 'indigo';
                              } else if (isPruned) {
                                  color = 'rose';
                                  isDel = true;
                              } else if (isUnavailable) {
                                  isDimmed = true;
                              }
                              
                              if (st.isSuccess) {
                                  isDimmed = false;
                                  isHl = false;
                                  color = 'slate';
                                  isDel = false;
                                  labels = [];
                              }

                              return (
                                  <React.Fragment key={`pool-${val}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                              {labels.map((l, j) => (
                                                  <React.Fragment key={j}>
                                                      <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                  </React.Fragment>
                                              ))}
                                          </div>
                                          <NodeBlock val={val} themeColor={color} isTarget={isHl} isDimmed={isDimmed} isDeleted={isDel} compact={true}/>
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>

                  {/* Row 2: Completed Combinations List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Valid Combinations ('results')</span>
                      
                      <div className={`flex gap-3 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] transition-colors duration-300 border-emerald-200`}>
                          {st.results && st.results.map((resArr: number[], pIdx: number) => {
                              let isHl = st.hlSuccess && pIdx === st.results.length - 1;
                              return (
                                  <div key={`res-${pIdx}`} className={`flex font-mono font-black text-lg border-2 rounded-xl px-3 py-1 shadow-sm transition-all duration-300 tracking-widest ${isHl ? 'border-emerald-400 bg-emerald-100 text-emerald-700 ring-4 ring-emerald-200 scale-110 animate-in zoom-in slide-in-from-top-8 z-20' : 'border-slate-200 bg-slate-50 text-slate-700 z-10 scale-100'}`}>
                                      [{resArr.join(',')}]
                                  </div>
                              )
                          })}
                          {(!st.results || st.results.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">no combinations found yet</span>}
                      </div>
                  </div>
              </div>

              {/* State Space Tree Visualization - Pure geometric centering */}
              <div className="relative w-full flex justify-center mt-16" style={{ height: (treeData?.height || 200) + 60 }}>
                  
                  {/* Title overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Network size={12}/> State Space Tree (DFS)</span>
                  </div>

                  <div className="relative w-0 h-0">
                      
                      {/* Tree Edges */}
                      <svg className="absolute overflow-visible z-0 pointer-events-none" style={{ left: 0, top: 0 }}>
                          {treeData.edges.map((edge: any, i: number) => {
                              const source = treeData.nodes.find((n:any) => n.id === edge.source);
                              const target = treeData.nodes.find((n:any) => n.id === edge.target);
                              if (!source || !target) return null;

                              let sx = source.x;
                              let sy = source.y + 22; // bottom of node 
                              let tx = target.x;
                              let ty = target.y - 22; // top of node

                              // Check if this edge is on the active path
                              let isActiveEdge = false;
                              let isCompletedEdge = false;
                              let isPrunedEdge = target.pruned;

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
                              if (isActiveEdge) { 
                                  strokeColor = '#818cf8'; // indigo-400
                                  if (isPrunedEdge) strokeColor = '#fb7185'; // rose-400
                                  strokeWidth = 4; 
                                  opacity = 1; 
                              }

                              let pathD = `M ${sx},${sy} C ${sx},${sy + 30} ${tx},${ty - 30} ${tx},${ty}`;

                              return <path key={`edge-${i}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-500"/>
                          })}
                      </svg>

                      {/* Tree Nodes */}
                      {treeData.nodes.map((node: any) => {
                          let isActive = false;
                          let isCompleted = false;

                          if (st.activePath !== undefined) {
                              if (st.activePath === node.id || (node.id === 'root' && st.activePath === "")) {
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
                          if (isActive) {
                              nodeTheme = node.pruned ? 'rose' : 'indigo';
                          }
                          
                          if (st.isSuccess) {
                              isDimmed = false;
                              nodeTheme = 'emerald';
                          }

                          return (
                              <div key={`node-${node.id}`} className={`absolute transition-all duration-700 z-10 ${isActive ? 'z-20 scale-110' : ''}`} style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}>
                                  <NodeBlock val={node.val === 'S' ? 'root' : node.val} themeColor={nodeTheme} isTarget={isActive} isDimmed={isDimmed} compact={true}/>
                                  
                                  {isActive && !node.pruned && node.id !== 'root' && (
                                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 border border-indigo-200 px-1.5 py-0.5 rounded shadow-sm text-[8px] font-black text-indigo-500 whitespace-nowrap">
                                          Sum: {node.sum}
                                      </div>
                                  )}
                                  {isActive && node.pruned && (
                                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 border border-rose-200 px-1.5 py-0.5 rounded shadow-sm text-[8px] font-black text-rose-500 whitespace-nowrap animate-pulse">
                                          &gt; {st.n} (PRUNE)
                                      </div>
                                  )}
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
                <GitFork className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Combination Sum III</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Backtracking & Pruning
                  </span>
                  <span>•</span>
                  <span>LeetCode 216</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Target size={28}/> Find Valid Number Sets</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Find all valid combinations of <code>k</code> numbers that sum up to <code>n</code> such that the following conditions are true:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li>Only numbers 1 through 9 are used.</li>
                            <li>Each number is used <strong>at most once</strong>.</li>
                        </ul>
                        <p className="font-bold mt-4">Return a list of all possible valid combinations. The list must not contain the same combination twice, and the combinations may be returned in any order.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> k = 3, n = 7</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[[1,2,4]]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">1 + 2 + 4 = 7<br/>There are no other valid combinations.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> k = 3, n = 9</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[[1,2,6], [1,3,5], [2,3,4]]</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>2 &lt;= k &lt;= 9</li>
                            <li>1 &lt;= n &lt;= 60</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">We need exactly <code>k</code> distinct numbers from the pool {"{1..9}"} that sum to <code>n</code>. A brute force approach generating all subsets of 1..9 and checking their sum/length would work, but is horribly inefficient for larger variations. We need to smartly navigate the possibility space.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Backtracking (DFS)</strong>. We systematically build a path array, trying numbers from 1 to 9. By passing a <code>start</code> variable, we enforce ascending order (e.g., [1,2], we can only pick 3-9 next), which natively prevents duplicate combinations like [2,1]. Crucially, if our running sum exceeds <code>n</code>, we <strong>prune</strong> the branch immediately (stop looping) because all larger numbers will also fail.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> CombinationSum3.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>K (Elements)</label>
                            <input type="number" min="2" max="9" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N (Target Sum)</label>
                            <input type="number" min="1" max="60" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="9" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SEARCH COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found {st.finalAns?.length || 0} valid combinations.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSuccess ? 'text-emerald-400' : (st.hlFail || st.hlPruneBreak ? 'text-rose-400' : (st.hlChoose || st.hlBacktrack ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Backtracking Engine Render</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-fuchsia-100 text-fuchsia-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding recursive constraint satisfaction and optimization via pruning.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitFork size={24} className="text-fuchsia-500"/> 1. The Backtracking Paradigm</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Backtracking is a systematic way to iterate through all the possible configurations of a search space. It builds candidates incrementally and abandons a candidate ("backtracks") as soon as it determines that the candidate cannot possibly lead to a valid solution.</p>
                        <p className="text-slate-600 leading-relaxed">In this problem, we build an array (a path). We pass down a <code>start</code> parameter to ensure we only pick numbers strictly greater than our previous choices. This naturally prevents permutations (e.g., [1,2] and [2,1] are considered the same combination, so we only generate [1,2]).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-sky-500"/> 2. The Power of Pruning</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Without the line <code>if (sum + i &gt; n) break;</code>, the algorithm would continue exploring branches even when it's mathematically impossible to succeed.</p>
                        <p className="text-slate-600 leading-relaxed">Because our loop goes from <code>start</code> up to 9, the numbers are strictly increasing. If our current sum is 10, target is 12, and the current <code>i</code> is 3, adding 3 gives 13 (which exceeds 12). Because 4, 5, 6... are all greater than 3, they will <strong>also</strong> exceed 12. Therefore, we can completely kill the rest of the loop immediately via a <code>break</code> statement. This saves massive amounts of unnecessary recursive calls.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(9! / (9-K)! K!).</strong> This is the formula for "9 choose K", which represents the maximum number of combinations we could explore. Because K is bounded between 1 and 9, the absolute worst-case number of combinations is 126. Thus, the time complexity is technically bounded by a very small constant O(1) in Big-O terms, but practically scales combinatorially relative to the small constraints.</li>
                            <li><strong>Space Complexity: O(K).</strong> The maximum depth of the recursive call stack is exactly K. Additionally, the <code>path</code> list will hold at most K elements. The space used to store the results is not counted towards auxiliary algorithmic space complexity.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-fuchsia-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a fundamental backtracking problem. Interviewers use it to ensure you understand recursion, reference vs. value copying, and basic combinatorics."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q1: "Why do we do <code>results.add(new ArrayList&lt;&gt;(path))</code> instead of just <code>results.add(path)</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This is the most common bug in backtracking!</p>
                            <p>In Java, variables holding objects (like lists) are references. If we just add <code>path</code>, we are adding a pointer to the <em>single instance</em> of the path list we are modifying throughout the entire algorithm. When the algorithm finishes, that path will be empty due to all the <code>remove()</code> calls, resulting in a list of empty lists. By wrapping it in <code>new ArrayList&lt;&gt;(path)</code>, we perform a deep copy, freezing the valid state into a brand-new object before continuing our search."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What is the difference between Combinations and Permutations?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "In permutations, order matters (e.g., <code>[1,2,3]</code> is considered different from <code>[3,2,1]</code>). To generate permutations, our for-loop would always start at 1, and we'd use a <code>visited</code> boolean array to skip numbers we've used in the current path.</p>
                            <p>In combinations, order doesn't matter (they are sets). To generate combinations without duplicates, we force the numbers to be strictly increasing. We do this by passing a <code>start</code> parameter to the recursive function, ensuring the loop only iterates over numbers we haven't seen yet."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "What happens if <code>n</code> is very large, like 100?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Since we can only use the numbers 1 through 9 exactly once, the maximum possible sum we can ever generate is 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 = 45.</p>
                            <p>If <code>n &gt; 45</code>, the algorithm will naturally exhaust all paths without ever hitting the target sum, and will return an empty list. It handles this edge case flawlessly without requiring explicit upfront checks, although adding an <code>if (n &gt; 45) return results;</code> at the top would be a valid O(1) optimization."</p>
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
                              <GitFork size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlSuccess ? 'text-emerald-400' : (st.hlFail || st.hlPruneBreak ? 'text-rose-400' : (st.hlChoose || st.hlBacktrack ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>K (Elements)</label>
                              <input type="number" min="2" max="9" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="3" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>N (Target Sum)</label>
                              <input type="number" min="1" max="60" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="9" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SEARCH COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Found all combinations</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Valid Combinations</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns?.length || 0}</div>
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
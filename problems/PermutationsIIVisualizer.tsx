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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Backtracking w/ Pruning (Optimal)',
    icon: <Workflow size={16} />,
    complexity: 'Time: O(N * N!) | Space: O(N)',
    code: `public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> list = new ArrayList<>();
    Arrays.sort(nums);
    backtrack(list, new ArrayList<>(), nums, new boolean[nums.length]);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] nums, boolean[] used) {
    if (tempList.size() == nums.length) {
        list.add(new ArrayList<>(tempList));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
        used[i] = true;
        tempList.add(nums[i]);
        backtrack(list, tempList, nums, used);
        used[i] = false;
        tempList.remove(tempList.size() - 1);
    }
}`,
    desc: "The Permutations II Backtracking approach. Because the input can contain duplicates, we must sort the array first. We use a 'used' boolean array to track exactly which instances of a number are currently in our path. To avoid duplicate permutations, we skip a number if it is identical to the previous number AND the previous number has not been used in the current recursive depth. This mathematically guarantees we only process identical elements in the same relative order, pruning duplicate branches."
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'fuchsia' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|return|if|else|while|for|continue|break|new|List|ArrayList|Integer|Arrays|sort|permuteUnique|nums|list|backtrack|tempList|used|size|length|add|contains|remove|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  const activeStyles = theme === 'fuchsia' 
    ? { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-500`, text: `text-fuchsia-400` }
    : { bg: `bg-emerald-500/20`, border: `border-emerald-500`, text: `text-emerald-400` };
  
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
            const isPointer = ['nums', 'list', 'tempList', 'used', 'i'].includes(part);
            const isMapCall = ['permuteUnique', 'backtrack', 'size', 'length', 'add', 'contains', 'remove', 'sort'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());
            
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isMapCall ? 'text-emerald-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? (theme === 'fuchsia' ? 'text-fuchsia-300' : 'text-amber-300') : 
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
    } else if (position === 'left') {
        alignClass = 'flex-row-reverse -left-16 top-1/2 -translate-y-1/2';
        arrow = <ArrowRight size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    } else if (position === 'right') {
        alignClass = 'flex-row -right-16 top-1/2 -translate-y-1/2';
        arrow = <ArrowLeft size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    }

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`} style={{ transform: position === 'top' || position === 'bottom' ? `translateX(-50%) translateX(${offset}px)` : `translateY(-50%) translateY(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
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
  isUsed?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isDimmed = false, isDeleted = false, compact = false, subtext, isUsed = false }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', accent: 'bg-emerald-200' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', accent: 'bg-sky-200' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', accent: 'bg-fuchsia-200' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', accent: 'bg-amber-200' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', accent: 'bg-rose-200' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', accent: 'bg-indigo-200' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', accent: 'bg-slate-200' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-400', accent: 'bg-slate-200' }
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
            {isUsed && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md z-30 animate-in zoom-in">
                    <Lock size={10} strokeWidth={3} />
                </div>
            )}
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

export default function PermutationsIIVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [numsInput, setNumsInput] = useState('1, 1, 2'); // Updated default for Permutations II
  const [baseNums, setBaseNums] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 50 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'fuchsia';

  // --- Effects for Data Processing ---

  // Debounce and validate input parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      
      // We do NOT remove duplicates for Permutations II. 
      // But we MUST sort the array exactly like the algorithm does.
      parsed.sort((a, b) => a - b);
      
      if (parsed.length === 0) parsed = [1, 1, 2];
      // Limit array size to 4 to prevent browser crash from O(N!)
      if (parsed.length > 4) parsed = parsed.slice(0, 4);

      setBaseNums(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 50 });
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

  // Pre-calculate State Space Tree for layout coordinates (Pruned for Permutations II)
  const treeData = useMemo(() => {
      let nodes: any[] = [];
      let edges: any[] = [];
      let leaves: any[] = [];
      
      if (baseNums.length === 0) return { nodes, edges, height: 200 };

      const build = (path: number[], depth: number, usedIndices: boolean[]) => {
          let id = path.join(',') + '|' + usedIndices.map((b,i)=>b?i:'').filter(String).join(',');
          let node = { id, path: [...path], val: path.length > 0 ? path[path.length-1] : '[]', depth, children: [] as any[], x: 0, y: 0 };
          nodes.push(node);
          
          if (depth === baseNums.length) {
              leaves.push(node);
              return node;
          }
          
          for(let i=0; i<baseNums.length; i++) {
              if (usedIndices[i]) continue;
              // Duplicate Pruning Check
              if (i > 0 && baseNums[i] === baseNums[i - 1] && !usedIndices[i - 1]) continue;

              let nextUsed = [...usedIndices];
              nextUsed[i] = true;
              let child = build([...path, baseNums[i]], depth + 1, nextUsed);
              node.children.push(child);
              edges.push({ source: id, target: child.id });
          }
          return node;
      }
      
      let root = build([], 0, new Array(baseNums.length).fill(false));
      
      // Assign X coordinates based on leaves
      let leafSpacing = 75; // Comfortable padding
      leaves.forEach((l, i) => l.x = i * leafSpacing);
      
      // Post-order traversal to set parent X as average of children X
      const setX = (n: any) => {
          if (n.children.length > 0) {
              n.children.forEach(setX);
              n.x = n.children.reduce((sum: number, c: any) => sum + c.x, 0) / n.children.length;
          }
      }
      setX(root);
      
      // Assign Y coordinates
      let ySpacing = 90;
      nodes.forEach(n => n.y = n.depth * ySpacing);
      
      // Center around 0 perfectly mathematically
      let minX = Math.min(...nodes.map(n => n.x));
      let maxX = Math.max(...nodes.map(n => n.x));
      let cx = (minX + maxX) / 2;
      nodes.forEach(n => n.x -= cx);
      
      return { nodes, edges, height: (baseNums.length * ySpacing) };
  }, [baseNums]);

  // Generate trace strictly aligned with the Permutations II Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!baseNums || baseNums.length === 0) return [{ phase: 'Init', description: 'Enter valid integers.', line: 1, state: {} }];

    const nums = [...baseNums];
    const n = nums.length;
    let list: number[][] = [];
    let tempList: number[] = [];
    let used: boolean[] = new Array(n).fill(false);
    let callStack: string[] = [];
    let completedLeaves = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums], 
            n, 
            list: JSON.parse(JSON.stringify(list)),
            tempList: [...tempList],
            used: [...used],
            callStack: [...callStack],
            activePath: tempList.join(',') + '|' + used.map((b,i)=>b?i:'').filter(String).join(','),
            completedLeaves: new Set(completedLeaves),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<List<Integer>> permuteUnique(int[] nums)`, 1, {});
        add("Init Result List", `List<List<Integer>> list = new ArrayList<>();\nWill store all fully built unique permutations.`, 2, {});
        add("Sort Input", `Arrays.sort(nums);\nSorting groups duplicates together for pruning.`, 3, {});
        add("Initial Backtrack Call", `backtrack(list, new ArrayList<>(), nums, new boolean[nums.length]);\nStarting the recursive backtracking process.`, 4, {});

        const backtrack = () => {
            callStack.push(`backtrack([${tempList.join(', ')}])`);
            let currentDepth = callStack.length - 1;
            let currentPathId = tempList.join(',') + '|' + used.map((b,i)=>b?i:'').filter(String).join(',');

            add("Backtrack Entry", `private void backtrack(...)`, 8, { callDepth: currentDepth });
            
            let isBase = tempList.length === n;
            add("Base Case Check", `if (tempList.size() == nums.length)\nIs current path length (${tempList.length}) equal to total numbers (${n})? (${isBase ? 'Yes' : 'No'})`, 9, { callDepth: currentDepth, isCheckingBase: true });

            if (isBase) {
                list.push([...tempList]);
                completedLeaves.add(currentPathId);
                add("Add to Result", `list.add(new ArrayList<>(tempList));\nFound a complete permutation! Adding [${tempList.join(', ')}] to results.`, 10, { callDepth: currentDepth, hlAddResult: list.length - 1, completedLeaves: new Set(completedLeaves) });
                add("Return", `return;\nBacktracking up the decision tree.`, 11, { callDepth: currentDepth });
                callStack.pop();
                return;
            }

            for (let i = 0; i < n; i++) {
                add("For Loop", `for (int i = ${i}; i < nums.length; i++)\nIterating through available candidates.`, 13, { callDepth: currentDepth, iter: i, isEvaluatingFor: true });
                
                let isUsed = used[i];
                add("Check Used", `if (used[${i}]) continue;\nIs nums[${i}] (${nums[i]}) already in our current path? (${isUsed ? 'Yes' : 'No'})`, 14, { callDepth: currentDepth, iter: i, hlNum: i, isCheckingUsed: true });
                if (isUsed) {
                    add("Skip Used", `continue;\nSkipping index ${i} because it's already used.`, 14, { callDepth: currentDepth, iter: i, hlNum: i });
                    continue;
                }

                let isDuplicate = i > 0 && nums[i] === nums[i - 1] && !used[i - 1];
                add("Check Duplicate Pruning", `if (i > 0 && nums[${i}] == nums[${i - 1}] && !used[${i - 1}])\nIs this a duplicate element (${nums[i]}) from a previously explored branch? (${isDuplicate ? 'Yes' : 'No'})`, 15, { callDepth: currentDepth, iter: i, hlNum: i, isCheckingDuplicate: true, failedAttempt: isDuplicate ? nums[i] : null });
                
                if (isDuplicate) {
                    add("Prune Branch", `continue;\nSkipping ${nums[i]} to prevent duplicate permutations.`, 15, { callDepth: currentDepth, iter: i, hlNum: i, failedAttempt: nums[i] });
                    continue;
                }

                used[i] = true;
                add("Mark Used", `used[${i}] = true;\nMarking index ${i} as used for deeper recursion.`, 16, { callDepth: currentDepth, iter: i, hlNum: i, hlUsedUpdate: i });

                tempList.push(nums[i]);
                add("Add to Path", `tempList.add(nums[${i}]);\nAdding candidate ${nums[i]} to our current path.`, 17, { callDepth: currentDepth, iter: i, hlNum: i, hlTempAdd: tempList.length - 1 });

                add("Recursive Call", `backtrack(list, tempList, nums, used);\nDiving deeper into the decision tree.`, 18, { callDepth: currentDepth, iter: i });
                backtrack();

                used[i] = false;
                add("Unmark Used (Backtrack)", `used[${i}] = false;\nReturned from recursion. Unmarking index ${i}.`, 19, { callDepth: currentDepth, iter: i, hlNum: i, hlUsedUpdate: i });

                let removed = tempList.pop();
                add("Remove from Path (Backtrack)", `tempList.remove(tempList.size() - 1);\nRemoving ${removed} from path to explore other candidate branches.`, 20, { callDepth: currentDepth, iter: i, hlTempRemove: true, removedVal: removed });
            }

            add("For Loop End", `for (int i = ${n}; i < nums.length; i++)\nFinished trying all candidates at this depth.`, 13, { callDepth: currentDepth, isEvaluatingFor: true });
            callStack.pop();
        };

        backtrack();

        add("Return Result", `return list;\nAll ${list.length} unique permutations generated successfully!`, 5, { isSuccess: true, finalAns: list.length });
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

  // Keyboard Shortcuts (Depends on trace length)
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
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Layout size={12}/> Sorted Array (nums) &amp; Used[]</span>
                          
                          <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[90px]">
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
                                  
                                  // Used logic
                                  let isUsed = st.used && st.used[idx];
                                  if (isUsed) {
                                      isDimmed = true;
                                  }

                                  if (st.hlNum === idx) {
                                      isHl = true;
                                      if (st.isCheckingUsed && isUsed) color = 'rose';
                                      else if (st.isCheckingDuplicate) color = st.failedAttempt ? 'rose' : 'fuchsia';
                                      else color = 'fuchsia';
                                  }

                                  if (st.isSuccess) {
                                      isDimmed = false;
                                      isHl = false;
                                      color = 'slate';
                                      isUsed = false;
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
                                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} isUsed={isUsed} compact={true}/>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      {/* Current Permutation Path (tempList) */}
                      <div className="flex flex-col items-start w-full flex-[1.5]">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 flex items-center gap-2`}><ListTree size={12}/> Current Path (tempList)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-fuchsia-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlTempAdd ? 'border-sky-400 ring-4 ring-sky-200' : (st.hlTempRemove ? 'border-rose-400 ring-4 ring-rose-200' : 'border-fuchsia-200')}`}>
                              
                              {/* Render active tempList */}
                              {st.tempList && st.tempList.map((val: number, idx: number) => {
                                  let isHl = false;
                                  let color = 'fuchsia';
                                  
                                  if (st.hlTempAdd === idx) {
                                      isHl = true;
                                      color = 'sky';
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

                              {(!st.tempList || st.tempList.length === 0) && !st.hlTempRemove && <span className="text-slate-400 italic text-sm font-mono px-4">empty path</span>}
                          </div>
                      </div>
                  </div>

                  {/* Row 2: Completed Permutations List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Completed Unique Permutations ('list')</span>
                      
                      <div className={`flex gap-2 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] transition-colors duration-300 border-emerald-200`}>
                          {st.list && st.list.map((perm: number[], pIdx: number) => {
                              let isHl = st.hlAddResult === pIdx;
                              return (
                                  <div key={`perm-${pIdx}`} className={`flex border-2 rounded-xl p-1 shadow-sm transition-all duration-300 ${isHl ? 'border-emerald-400 bg-emerald-100 ring-4 ring-emerald-200 scale-110 animate-in zoom-in slide-in-from-top-8 z-20' : 'border-slate-200 bg-slate-50 z-10 scale-100'}`}>
                                      {perm.map((val, vIdx) => (
                                          <div key={`p-${pIdx}-${vIdx}`} className="w-8 h-8 flex items-center justify-center font-mono font-black text-sm text-slate-700 border-r last:border-r-0 border-slate-200/50">
                                              {val}
                                          </div>
                                      ))}
                                  </div>
                              )
                          })}
                          {(!st.list || st.list.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">no permutations found yet</span>}
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

                              if (st.activePath) {
                                  if (st.activePath === target.id || st.activePath.startsWith(target.id + '|')) {
                                      isActiveEdge = true;
                                  }
                              }
                              
                              if (st.completedLeaves) {
                                  if (Array.from(st.completedLeaves).some((leaf: any) => leaf === target.id || leaf.startsWith(target.id + '|'))) {
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

                          {/* Ghost Red Edge for Failed Contains/Duplicate Check */}
                          {st.failedAttempt !== undefined && st.failedAttempt !== null && st.activePath !== undefined && (
                              (() => {
                                  const activeNode = treeData.nodes.find((n:any) => n.id === st.activePath);
                                  if (!activeNode) return null;

                                  let sx = activeNode.x;
                                  let sy = activeNode.y + 24;
                                  
                                  // Perfect mapping to ghost node center (offset 60px down and right)
                                  let gx = sx + 60; 
                                  let gy = sy + 70;

                                  let tx = gx;
                                  let ty = gy - 24; // top of ghost node

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
                              if (st.activePath === node.id || (node.id === "" && st.activePath !== undefined)) {
                                  isActive = true;
                              }
                          }

                          if (st.completedLeaves) {
                              if (Array.from(st.completedLeaves).some((leaf: any) => leaf === node.id || leaf.startsWith(node.id + '|'))) {
                                  isCompleted = true;
                              }
                          }

                          let nodeTheme = 'slate';
                          let isDimmed = !isActive && !isCompleted;
                          
                          if (isCompleted) nodeTheme = 'emerald';
                          if (isActive) nodeTheme = 'sky';

                          if (st.isSuccess) {
                              isDimmed = false;
                              nodeTheme = 'emerald';
                          }

                          return (
                              <div key={`node-${node.id}`} className={`absolute transition-all duration-700 z-10 ${isActive ? 'z-20 scale-110' : ''}`} style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}>
                                  <NodeBlock val={node.val} themeColor={nodeTheme} isTarget={isActive} isDimmed={isDimmed} compact={true}/>
                              </div>
                          )
                      })}

                      {/* Ghost Red Node for Failed Check */}
                      {st.failedAttempt !== undefined && st.failedAttempt !== null && st.activePath !== undefined && (
                          (() => {
                              const activeNode = treeData.nodes.find((n:any) => n.id === st.activePath);
                              if (!activeNode) return null;

                              let gx = activeNode.x + 60;
                              let gy = activeNode.y + 70;

                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: gx, top: gy, transform: 'translate(-50%, -50%)' }}>
                                      <NodeBlock val={st.failedAttempt} themeColor="rose" isTarget={true} compact={true}/>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                          Pruned
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'fuchsia' ? 'bg-fuchsia-600' : 'bg-emerald-600'}`}>
                <Workflow className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Permutations II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'fuchsia' ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Backtracking w/ Pruning
                  </span>
                  <span>•</span>
                  <span>LeetCode 47</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'fuchsia' ? 'text-fuchsia-600' : 'text-emerald-600'}`}><Shuffle size={28}/> Exploring Unique Combinations</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given a collection of numbers, <code>nums</code>, that <strong>might contain duplicates</strong>, return all possible <em>unique</em> permutations in any order. <br/><br/>
                      This is a step up from regular Permutations. Because inputs are no longer distinct, a naive backtracking algorithm would generate identical duplicate lists.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-fuchsia-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: nums = [1,1,2]</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [<br/>
                           &nbsp;&nbsp;[1,1,2],<br/>
                           &nbsp;&nbsp;[1,2,1],<br/>
                           &nbsp;&nbsp;[2,1,1]<br/>
                           ]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The array length is up to 8 (<code>1 &lt;= nums.length &lt;= 8</code>). While $O(N!)$ is fast enough for $N=8$, generating duplicates and checking a <code>HashSet</code> at the end is considered bad practice. You must <strong>prune</strong> duplicate branches before they are explored.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-fuchsia-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">First, <strong>sort the array</strong> so duplicates sit next to each other. Second, use a <code>boolean[] used</code> array instead of <code>.contains()</code>. Finally, apply the magic pruning condition: If the current number is the same as the previous one, and the previous one was <em>not used</em> in this recursive depth, we skip the current number.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> PermutationsII.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input Array (Max 4 items)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} placeholder="1, 1, 2" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated all {st.finalAns} unique permutations.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> State Space Visualizer</span>
                       
                       {/* Call Stack Tracker */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-fuchsia-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-48`}>
                               <div className="flex justify-between items-center border-b border-fuchsia-100 pb-1 mb-1">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-fuchsia-600`}>Call Stack Depth</span>
                               </div>
                               <div className="flex flex-col gap-1 overflow-y-auto max-h-32 scrollbar-none">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <span key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between ${isTop ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-fuchsia-50 text-fuchsia-500 border border-fuchsia-100'}`}>
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
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Workflow size={120}/></div>
                    <h3 className="font-black text-fuchsia-400 text-2xl uppercase tracking-widest mb-6">Algorithm Theory &amp; Complexity</h3>
                    
                    <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-medium text-lg relative z-10">
                        {/* Section 1 */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><ListTree size={20} className="text-fuchsia-400"/> 1. The Decision Tree (State Space)</h4>
                            <p className="mb-2">Backtracking is essentially performing a <strong>Depth-First Search (DFS)</strong> on a conceptual "Decision Tree".</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li><strong>Root Node:</strong> Represents the initial state (an empty permutation `[]`).</li>
                                <li><strong>Edges (Branches):</strong> Represent the choices we can make. At the root, we can choose `1`, `2`, or `3`.</li>
                                <li><strong>Internal Nodes:</strong> Represent partial permutations (e.g., `[1]`, `[1, 2]`).</li>
                                <li><strong>Leaf Nodes:</strong> Represent the base cases where the permutation is complete (size == N).</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Scissors size={20} className="text-rose-400"/> 2. The Duplicate Pruning Trick</h4>
                            <p>To avoid generating duplicate branches when inputs have duplicates (e.g., <code>[1, 1, 2]</code>), we use a mathematical trick.</p>
                            <p className="mt-2 text-slate-400">First, we sort the array. Then we check: <code>if (i &gt; 0 &amp;&amp; nums[i] == nums[i - 1] &amp;&amp; !used[i - 1]) continue;</code></p>
                            <p className="mt-2 text-slate-400">If the previous identical number was NOT used in this exact recursive layer, it means we just finished exploring the branch where that identical number was in this exact position. Skipping it guarantees we don't explore an identical subtree.</p>
                        </div>

                        {/* Section 3 - TIME COMPLEXITY */}
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2"><Activity size={20}/> 3. Time Complexity Analysis: O(N &times; N!)</h4>
                            <p className="mb-4">To explain this to an interviewer, break it down into two parts: the <strong>number of nodes</strong> and the <strong>work done per node</strong>.</p>
                            <div className="space-y-4 text-slate-400">
                                <div>
                                    <strong className="text-slate-200">Step A: Work at the Leaf Nodes</strong><br/>
                                    There are at most <code>N!</code> leaf nodes. At every leaf node, we do <code>list.add(new ArrayList&lt;&gt;(tempList))</code>. Copying a list of size N takes <code>O(N)</code> time. Therefore, the total time spent at the leaves is bounded by <strong><code>O(N &times; N!)</code></strong>.
                                </div>
                                <div>
                                    <strong className="text-slate-200">Step B: Work at the Internal Nodes</strong><br/>
                                    The number of internal nodes is strictly bounded by <code>e &times; N!</code>. At each node, the loop runs N times, doing <code>O(1)</code> work because we optimized with the <code>used[]</code> array. Thus, internal work is bounded by <code>O(N &times; N!)</code>.
                                </div>
                                <div className="text-emerald-300 font-bold mt-2">
                                    Conclusion: Sorting takes O(N log N). Traversal takes O(N &times; N!). Overall time is O(N &times; N!).
                                </div>
                            </div>
                        </div>

                        {/* Section 4 - SPACE COMPLEXITY */}
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                            <h4 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2"><Database size={20}/> 4. Space Complexity Analysis: O(N) Auxiliary</h4>
                            <p className="mb-4">Space complexity depends on what we count. We typically separate <em>Auxiliary Space</em> (extra memory used by the algorithm) from <em>Output Space</em> (memory to hold the final answer).</p>
                            <div className="space-y-4 text-slate-400">
                                <div>
                                    <strong className="text-slate-200">Call Stack Space:</strong><br/>
                                    The maximum depth of the recursion tree is exactly N. Therefore, the maximum number of stack frames in memory is <strong><code>O(N)</code></strong>.
                                </div>
                                <div>
                                    <strong className="text-slate-200">Data Structure Space (tempList &amp; used[]):</strong><br/>
                                    Both <code>tempList</code> and <code>used[]</code> take <strong><code>O(N)</code></strong> space.
                                </div>
                                <div className="text-sky-300 font-bold mt-2">
                                    Conclusion: O(N) Auxiliary Space, O(N &times; N!) Output Space.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                 <div className={`bg-${themeColor}-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-${themeColor}-500`}>
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-${themeColor}-50 leading-relaxed italic max-w-3xl font-mono`}>"When asked to solve Permutations II, writing the code is only half the battle. The interviewer will almost certainly probe your understanding of Java references, complexity analysis, and the logic behind the pruning check. Here is exactly how to answer them."</p>
                </div>
                
                <div className="space-y-6">
                    {/* Q1 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                            <span className="text-fuchsia-500 mt-1"><CheckCircle2 size={20}/></span>
                            <span>Q1: Why do we sort the array first? What happens if we don't?</span>
                        </h4>
                        <div className="pl-8 text-slate-600 space-y-2">
                            <p><strong>Answer:</strong> "Sorting is essential for our duplicate pruning logic to work. Our pruning condition <code>nums[i] == nums[i-1]</code> relies on identical elements being adjacent to each other.</p>
                            <p>If we don't sort the array, identical elements could be scattered (e.g., <code>[1, 2, 1]</code>). We would explore the first '1', then explore '2', and then explore the second '1' again as a completely new branch, generating duplicate permutations. Sorting guarantees all duplicates are processed sequentially in the loop, allowing us to safely skip them."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                            <span className="text-fuchsia-500 mt-1"><CheckCircle2 size={20}/></span>
                            <span>Q2: Explain the pruning check: <code>if (i &gt; 0 &amp;&amp; nums[i] == nums[i-1] &amp;&amp; !used[i-1])</code>. Why <code>!used[i-1]</code>?</span>
                        </h4>
                        <div className="pl-8 text-slate-600 space-y-2">
                            <p><strong>Answer:</strong> "This is the most critical line. It enforces a strict mathematical ordering for identical elements.</p>
                            <p>If <code>used[i-1]</code> is <strong>true</strong>, it means the previous identical element is currently sitting somewhere higher up in our <code>tempList</code> path. We are allowed to use the current element because we are just picking the 'second' instance of that number for this specific permutation.</p>
                            <p>If <code>used[i-1]</code> is <strong>false</strong>, it means we have just finished exploring the entire branch where the previous identical element was the first choice, and we have backtracked. If we choose the current identical element now, we will generate the exact same sub-tree of permutations. So we <code>continue</code> to prune it."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                            <span className="text-fuchsia-500 mt-1"><CheckCircle2 size={20}/></span>
                            <span>Q3: Why do we write <code>list.add(new ArrayList&lt;&gt;(tempList))</code> instead of just <code>list.add(tempList)</code>?</span>
                        </h4>
                        <div className="pl-8 text-slate-600 space-y-2">
                            <p><strong>Answer:</strong> "In Java, objects are passed by reference. <code>tempList</code> is a single ArrayList object that is continuously modified as we backtrack.</p>
                            <p>If we just do <code>list.add(tempList)</code>, we are adding a reference to that exact same list object into our result. By the time the algorithm finishes, <code>tempList</code> is empty. Our final result would just be a list containing references to the exact same empty array.</p>
                            <p>By using <code>new ArrayList&lt;&gt;(tempList)</code>, we create a deep copy (a snapshot) of the list's state at that exact moment and store the snapshot safely."</p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                            <span className="text-fuchsia-500 mt-1"><CheckCircle2 size={20}/></span>
                            <span>Q4: Can we solve this problem using a HashSet to store results instead of pruning?</span>
                        </h4>
                        <div className="pl-8 text-slate-600 space-y-2">
                            <p><strong>Answer:</strong> "Yes, we could use a <code>Set&lt;List&lt;Integer&gt;&gt;</code> to store our results. The Set would automatically discard duplicate lists when we call <code>set.add()</code>.</p>
                            <p>However, this is considered a <strong>suboptimal, brute-force</strong> approach. Using a Set means we still spend time generating the entire massive $O(N!)$ decision tree, including all duplicate branches, and only discard them at the very end. The pruning approach stops duplicate branches from being generated in the first place, saving significant CPU cycles and memory overhead."</p>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'fuchsia' ? 'bg-fuchsia-600 shadow-fuchsia-900/50' : 'bg-emerald-600 shadow-emerald-900/50'}`}><Code2 size={20}/></div>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input Array (Max 4 items)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500`} />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-[0_20px_50px_rgba(217,70,239,0.3)]`}>NEXT <ChevronRight size={32}/></button>
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
                                        <div key={idx} className={`font-mono text-sm font-black px-4 py-2 rounded-xl flex justify-between ${isTop ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-slate-800 text-fuchsia-400'}`}>
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Generated All Permutations</p>
                                
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
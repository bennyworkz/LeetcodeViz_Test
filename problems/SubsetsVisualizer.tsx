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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Backtracking (Optimal)',
    icon: <Workflow size={16} />,
    complexity: 'Time: O(N * 2^N) | Space: O(N)',
    code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> list = new ArrayList<>();
    backtrack(list, new ArrayList<>(), nums, 0);
    return list;
}

private void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] nums, int start) {
    list.add(new ArrayList<>(tempList));
    for (int i = start; i < nums.length; i++) {
        tempList.add(nums[i]);
        backtrack(list, tempList, nums, i + 1);
        tempList.remove(tempList.size() - 1);
    }
}`,
    desc: "The classic Backtracking approach to generate the Powerset. Unlike permutations, order doesn't matter in subsets, and EVERY combination we explore is a valid subset. We use a 'start' pointer to ensure we only pick elements that appear AFTER our current element in the array, preventing duplicate sets like [1,2] and [2,1]. At every step, we record the current 'tempList' as a valid subset, then recursively explore adding more elements."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|return|if|else|while|for|continue|break|new|List|ArrayList|Integer|Arrays|subsets|nums|list|backtrack|tempList|start|size|length|add|remove|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  const activeStyles = theme === 'sky' 
    ? { bg: `bg-sky-500/20`, border: `border-sky-500`, text: `text-sky-400` }
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
            const isPointer = ['nums', 'list', 'tempList', 'start', 'i'].includes(part);
            const isMapCall = ['subsets', 'backtrack', 'size', 'length', 'add', 'remove'].includes(part);
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
                  isPointer ? (theme === 'sky' ? 'text-sky-300' : 'text-fuchsia-300') : 
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
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isDimmed = false, isDeleted = false, compact = false, subtext }) => {
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

export default function SubsetsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [numsInput, setNumsInput] = useState('1, 2, 3');
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
  const themeColor = 'sky';

  // --- Effects for Data Processing ---

  // Debounce and validate input parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      // Remove duplicates for standard subsets
      parsed = Array.from(new Set(parsed));
      
      if (parsed.length === 0) parsed = [1, 2, 3];
      // Limit array size to 4 to prevent browser crash from 2^N visually exploding
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

  // Pre-calculate State Space Tree for layout coordinates (Combinations/Subsets shape)
  const treeData = useMemo(() => {
      let nodes: any[] = [];
      let edges: any[] = [];
      let leaves: any[] = [];
      
      if (baseNums.length === 0) return { nodes, edges, height: 200 };

      const build = (path: number[], depth: number, startIdx: number) => {
          let id = path.join(',');
          let node = { id, path: [...path], val: path.length > 0 ? path[path.length-1] : '[]', depth, children: [] as any[], x: 0, y: 0 };
          nodes.push(node);
          
          let isLeaf = true;
          for(let i = startIdx; i < baseNums.length; i++) {
              isLeaf = false;
              let child = build([...path, baseNums[i]], depth + 1, i + 1);
              node.children.push(child);
              edges.push({ source: id, target: child.id });
          }
          
          if (isLeaf) {
              leaves.push(node);
          }
          return node;
      }
      
      let root = build([], 0, 0);
      
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

  // Generate trace strictly aligned with the Subsets Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!baseNums || baseNums.length === 0) return [{ phase: 'Init', description: 'Enter valid integers.', line: 1, state: {} }];

    const nums = [...baseNums];
    const n = nums.length;
    let list: number[][] = [];
    let tempList: number[] = [];
    let callStack: string[] = [];
    let addedSubsets = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums], 
            n, 
            list: JSON.parse(JSON.stringify(list)),
            tempList: [...tempList],
            callStack: [...callStack],
            activePath: tempList.join(','),
            addedSubsets: new Set(addedSubsets),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<List<Integer>> subsets(int[] nums)`, 1, {});
        add("Init Result List", `List<List<Integer>> list = new ArrayList<>();\nWill store all ${Math.pow(2, n)} subsets.`, 2, {});
        add("Initial Backtrack Call", `backtrack(list, new ArrayList<>(), nums, 0);\nStarting the recursive backtracking process from index 0.`, 3, {});

        const backtrack = (start: number) => {
            callStack.push(`backtrack([${tempList.join(', ')}], start=${start})`);
            let currentDepth = callStack.length - 1;

            add("Backtrack Entry", `private void backtrack(..., int start)\nCurrently exploring with start index = ${start}.`, 7, { callDepth: currentDepth, start });
            
            // In subsets, EVERY node is a valid subset. We add immediately.
            list.push([...tempList]);
            addedSubsets.add(tempList.join(','));
            add("Add to Result", `list.add(new ArrayList<>(tempList));\nEvery path is a valid subset! Added [${tempList.join(', ')}] to results.`, 8, { callDepth: currentDepth, hlAddResult: list.length - 1, addedSubsets: new Set(addedSubsets), start });

            for (let i = start; i < n; i++) {
                add("For Loop", `for (int i = ${i}; i < nums.length; i++)\nIterating candidates from start index ${start} onwards.`, 9, { callDepth: currentDepth, iter: i, start, isEvaluatingFor: true });
                
                tempList.push(nums[i]);
                add("Add to Path", `tempList.add(nums[${i}]);\nAdding candidate ${nums[i]} to our current subset path.`, 10, { callDepth: currentDepth, iter: i, start, hlNum: i, hlTempAdd: tempList.length - 1, activePath: tempList.join(',') });

                add("Recursive Call", `backtrack(list, tempList, nums, i + 1);\nDiving deeper into the tree, shifting the start index to ${i + 1} to prevent using earlier numbers.`, 11, { callDepth: currentDepth, iter: i, start, activePath: tempList.join(',') });
                backtrack(i + 1);

                let removed = tempList.pop();
                add("Remove from Path (Backtrack)", `tempList.remove(tempList.size() - 1);\nReturned from recursion. Removing ${removed} to explore other subset combinations.`, 12, { callDepth: currentDepth, iter: i, start, hlTempRemove: true, removedVal: removed, activePath: tempList.join(',') });
            }

            add("For Loop End", `for (int i = ${n}; i < nums.length; i++)\nFinished trying all candidates from start index ${start}.`, 9, { callDepth: currentDepth, start, isEvaluatingFor: true });
            callStack.pop();
        };

        backtrack(0);

        add("Return Result", `return list;\nAll ${list.length} subsets generated successfully!`, 4, { isSuccess: true, finalAns: list.length });
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
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Layout size={12}/> Input Array (nums)</span>
                          
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
                                  
                                  // Dim values before start index (they can't be picked)
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

                      {/* Current Permutation Path (tempList) */}
                      <div className="flex flex-col items-start w-full flex-[1.5]">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><ListTree size={12}/> Current Path (tempList)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-sky-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlTempAdd ? 'border-sky-400 ring-4 ring-sky-200' : (st.hlTempRemove ? 'border-rose-400 ring-4 ring-rose-200' : 'border-sky-200')}`}>
                              
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

                  {/* Row 2: Completed Subsets List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Completed Subsets ('list')</span>
                      
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
                          {(!st.list || st.list.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">no subsets added yet</span>}
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
                              
                              if (st.addedSubsets) {
                                  if (Array.from(st.addedSubsets).some((leaf: any) => leaf === target.id || leaf.startsWith(target.id + ','))) {
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

                          if (st.addedSubsets) {
                              if (Array.from(st.addedSubsets).some((leaf: any) => leaf === node.id || leaf.startsWith(node.id + ','))) {
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
                                  <NodeBlock val={node.val === '[]' ? '∅' : node.val} themeColor={nodeTheme} isTarget={isActive} isDimmed={isDimmed} compact={true}/>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'sky' ? 'bg-sky-600' : 'bg-emerald-600'}`}>
                <Workflow className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Subsets</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'sky' ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Backtracking (Powerset)
                  </span>
                  <span>•</span>
                  <span>LeetCode 78</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'sky' ? 'text-sky-600' : 'text-emerald-600'}`}><LayersIcon size={28}/> Powerset Generation</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given an integer array <code>nums</code> of <strong>unique</strong> elements, return all possible subsets (the power set).<br/><br/>
                      The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in any order.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-sky-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: nums = [1,2,3]</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [<br/>
                           &nbsp;&nbsp;[],<br/>
                           &nbsp;&nbsp;[1],<br/>
                           &nbsp;&nbsp;[2],<br/>
                           &nbsp;&nbsp;[1,2],<br/>
                           &nbsp;&nbsp;[3],<br/>
                           &nbsp;&nbsp;[1,3],<br/>
                           &nbsp;&nbsp;[2,3],<br/>
                           &nbsp;&nbsp;[1,2,3]<br/>
                           ]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The length of the array is up to 10 (<code>1 &lt;= nums.length &lt;= 10</code>). This strongly suggests an $O(2^N)$ algorithm is expected, because $2^{10} = 1024$, which is tiny and will run instantly.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-sky-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Unlike Permutations, every state is a valid answer. We use Backtracking with a <code>start</code> index. We add the current path to our list of answers. Then we loop from <code>start</code> to the end of the array, adding an element, making a recursive call (where <code>start</code> becomes <code>i + 1</code> to avoid going backward), and then removing the element to backtrack.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Subsets.java</span>
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
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} placeholder="1, 2, 3" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated all {st.finalAns} subsets.</p>
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
                           <div className={`bg-white border-2 border-sky-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-48`}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the mathematics and state space traversal techniques behind generating Powersets.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-sky-500"/> 1. The Powerset Mathematical Foundation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In set theory, a powerset is the set of all subsets. For any given element in an array, there are exactly two choices: it is either <strong>included</strong> in a subset, or it is <strong>excluded</strong>.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-inner my-4">
                            <p className="font-mono text-sm text-slate-700 text-center mb-2">If <code>nums = [1, 2, 3]</code>, the number of subsets is:</p>
                            <p className="font-mono text-2xl text-center font-black text-sky-600">2 &times; 2 &times; 2 = 2³ = 8 subsets</p>
                        </div>
                        <p className="text-slate-600 leading-relaxed">Because there are exactly $2^N$ possible combinations, any algorithm that generates all subsets must run in at least $O(2^N)$ time. This exponential growth is why the constraints for this problem keep <code>N &le; 10</code>.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Workflow size={24} className="text-emerald-500"/> 2. Cascading vs. Backtracking</h4>
                        <p className="text-slate-600 leading-relaxed mb-4">There are two primary ways to conceptualize generating subsets:</p>
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm">
                                <h5 className="font-bold text-emerald-700 mb-2 border-b border-emerald-100 pb-2">Backtracking (DFS)</h5>
                                <p className="text-sm text-slate-600">You dive down a decision tree using a <code>start</code> index. At every recursive call, you immediately save the current path as a valid subset. You then loop through remaining elements, add one, recurse deeper, and remove it (backtrack) upon return. This is highly memory-efficient.</p>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-sky-200 shadow-sm">
                                <h5 className="font-bold text-sky-700 mb-2 border-b border-sky-100 pb-2">Cascading (Iterative)</h5>
                                <p className="text-sm text-slate-600">You start with an empty list <code>[[]]</code>. You take the first number (1) and add it to existing sets: <code>[[], [1]]</code>. Then you take the second number (2) and add it to all existing sets: <code>[[], [1], [2], [1,2]]</code>. It's conceptually simpler but creates many intermediate lists.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-indigo-500"/> 3. Time Complexity Analysis: O(N &times; 2^N)</h4>
                        <p className="mb-4 text-slate-600">To explain this to an interviewer, separate the number of states from the work done to save the state.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Number of Subsets:</strong> As proven above, there are exactly $2^N$ possible subsets.</li>
                            <li><strong>Work per Subset:</strong> To record a subset, we must execute <code>list.add(new ArrayList&lt;&gt;(tempList))</code>. Creating a deep copy of an array takes time proportional to its length. The maximum length of a subset is $N$.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 font-bold text-center">
                            Total Time Complexity = (Number of Subsets) &times; (Max Work to Copy) = O(N &times; 2^N)
                        </div>
                    </div>

                    {/* Section 4 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-fuchsia-500"/> 4. Space Complexity Analysis: O(N) Auxiliary</h4>
                        <p className="mb-4 text-slate-600">Space complexity is divided into the memory used by the recursion/algorithm vs the memory used to hold the final answer.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(N)</strong>
                                <span className="text-sm text-slate-600">The <code>tempList</code> takes up to $O(N)$ space. The recursive Call Stack will dive at most $N$ levels deep before returning. Thus, auxiliary space is strictly bounded by $O(N)$.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">Output Space: O(N &times; 2^N)</strong>
                                <span className="text-sm text-slate-600">The <code>list</code> holding the final answer contains $2^N$ lists, each of average length $N/2$. If the interviewer asks for total space, you must state $O(N \cdot 2^N)$.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Subsets is a gateway problem. Once you solve it with standard backtracking, top-tier companies (like FAANG) will immediately hit you with follow-ups about Bit Manipulation or handling duplicates. Here is your ultimate cheat sheet."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you solve this without Recursion or Backtracking? What is the Iterative approach?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can use the <strong>Cascading</strong> method iteratively.</p>
                            <p>We initialize our result list with an empty subset: <code>[[]]</code>. Then, we iterate through each number in our input array. For every number, we take all the existing subsets in our result list, clone them, append the new number to the clones, and add these new clones back into our result list.</p>
                            <div className="bg-slate-50 p-4 rounded-xl font-mono text-sm border border-slate-200 my-2">
                                Start: [[]]<br/>
                                Pick 1: [[]] + [[1]] -&gt; [[], [1]]<br/>
                                Pick 2: [[], [1]] + [[2], [1,2]] -&gt; [[], [1], [2], [1,2]]
                            </div>
                            <p>While conceptually elegant, Backtracking is generally preferred in Java because Cascading creates many intermediate ArrayList objects, leading to higher garbage collection overhead."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightning size={24}/></span>
                            <span>Q2: "Can you solve this using Bit Manipulation? How does the Bitmasking approach work?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, since there are exactly $2^N$ possible subsets, we can map every subset to a binary number from $0$ to $2^N - 1$.</p>
                            <p>If our array is `[1, 2, 3]`, $N = 3$, so we loop from binary `000` to `111` (0 to 7).</p>
                            <ul className="list-disc pl-5 space-y-1 my-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <li><code>000</code> means include nothing: <code>[]</code></li>
                                <li><code>101</code> means include the 1st and 3rd elements: <code>[1, 3]</code></li>
                                <li><code>111</code> means include everything: <code>[1, 2, 3]</code></li>
                            </ul>
                            <p>Inside the loop, we use a bitwise AND (<code>&amp;</code>) coupled with a bitshift (<code>&gt;&gt;</code>) to check if the $j$-th bit is set to `1`. If it is, we add <code>nums[j]</code> to our current subset. This runs in $O(N \cdot 2^N)$ time and uses $O(1)$ auxiliary space since there is no call stack."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if the input array contained duplicate numbers (e.g., <code>[1, 2, 2]</code>)? How would your backtracking code fail, and how would you fix it?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If the input has duplicates, our current code would generate duplicate subsets (e.g., it would pick the first '2' to make `[1,2]`, and later pick the second '2' to make an identical `[1,2]`).</p>
                            <p>To fix this (which solves LeetCode 90: Subsets II), I would apply the standard <strong>duplicate pruning technique</strong>:</p>
                            <ol className="list-decimal pl-6 mt-2 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm">
                                <li>Sort the input array first: <code>Arrays.sort(nums);</code></li>
                                <li>Inside the for-loop, skip duplicates that appear on the same horizontal level of the tree:<br/>
                                <code>if (i &gt; start &amp;&amp; nums[i] == nums[i - 1]) continue;</code></li>
                            </ol>
                            <p>Because the array is sorted, duplicates are adjacent. The condition <code>i &gt; start</code> ensures we only skip duplicates when picking the <em>second</em> element at a given depth level, preventing duplicate branches without skipping valid sequential identicals like `[1, 2, 2]`."</p>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'sky' ? 'bg-sky-600 shadow-sky-900/50' : 'bg-emerald-600 shadow-emerald-900/50'}`}><Code2 size={20}/></div>
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
                                        <div key={idx} className={`font-mono text-sm font-black px-4 py-2 rounded-xl flex justify-between ${isTop ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-800 text-sky-400'}`}>
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Generated All Subsets</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Result Size</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.finalAns} Subsets</div>
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
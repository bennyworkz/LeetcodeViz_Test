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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Backtracking w/ Pruning',
    icon: <SplitIcon size={16} />,
    complexity: 'Time: O(N * 2^N) | Space: O(N)',
    code: `public List<List<String>> partition(String s) {
    List<List<String>> list = new ArrayList<>();
    backtrack(list, new ArrayList<>(), s, 0);
    return list;
}

private void backtrack(List<List<String>> list, List<String> tempList, String s, int start) {
    if (start == s.length()) {
        list.add(new ArrayList<>(tempList));
        return;
    }
    for (int i = start; i < s.length(); i++) {
        if (isPalindrome(s, start, i)) {
            tempList.add(s.substring(start, i + 1));
            backtrack(list, tempList, s, i + 1);
            tempList.remove(tempList.size() - 1);
        }
    }
}

private boolean isPalindrome(String s, int low, int high) {
    while (low < high) if (s.charAt(low++) != s.charAt(high--)) return false;
    return true;
}`,
    desc: "The Palindrome Partitioning Backtracking approach. We explore every possible substring starting from the 'start' index. If the substring from 'start' to 'i' is a valid palindrome, we add it to our current path and recursively try to partition the remainder of the string starting at 'i + 1'. If the substring is NOT a palindrome, we completely ignore that branch (pruning). Once 'start' reaches the end of the string, we have found a valid full partition."
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-rose-600 text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|return|if|else|while|for|continue|break|new|List|ArrayList|String|partition|s|list|backtrack|tempList|start|length|add|remove|substring|isPalindrome|low|high|charAt|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  const activeStyles = { bg: `bg-rose-500/20`, border: `border-rose-500`, text: `text-rose-400` };
  
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
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['List', 'ArrayList', 'String'].includes(part);
            const isPointer = ['s', 'list', 'tempList', 'start', 'low', 'high', 'i'].includes(part);
            const isMapCall = ['partition', 'backtrack', 'isPalindrome', 'length', 'add', 'remove', 'substring', 'charAt'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? 'text-rose-300' : 
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
  isLinked?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isDimmed = false, isDeleted = false, compact = false, subtext, isLinked = false }) => {
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
    
    // If it's linked (part of an active substring), make it look visually connected
    const linkClasses = isLinked ? `border-rose-400 bg-rose-50` : ``;

    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px]" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px]";
    
    const textSz = compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${isLinked ? linkClasses : activeTheme.bg} ${isLinked ? 'border-rose-400' : activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-50 text-rose-300 line-through' : 'bg-white/60 ' + (isLinked ? 'text-rose-700' : activeTheme.text)} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${isLinked ? 'bg-rose-100 text-rose-600' : activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `i=${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Helper for Palindrome ---
function isPalindromeCheck(s: string): boolean {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++; right--;
    }
    return true;
}

// --- Main Application ---

export default function PalindromePartitioningVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [sInput, setSInput] = useState('aab');
  
  const [baseString, setBaseString] = useState<string>('aab');
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 50 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'rose';

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      // Sanitize input
      let parsed = sInput.trim().toLowerCase().replace(/[^a-z]/g, '');
      if (parsed.length === 0) parsed = "aab";
      if (parsed.length > 5) parsed = parsed.substring(0, 5); // Limit length to 5 to prevent UI explosion
      
      setBaseString(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 50 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, selectedOpId]);

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
      
      if (baseString.length === 0) return { nodes, edges, height: 200 };

      const build = (pathList: string[], startIdx: number, depth: number) => {
          let id = pathList.join('|') || 'root';
          let node = { 
              id, 
              path: [...pathList], 
              val: pathList.length > 0 ? pathList[pathList.length-1] : 'S', 
              depth, 
              children: [] as any[], 
              x: 0, 
              y: 0 
          };
          nodes.push(node);
          
          if (startIdx === baseString.length) {
              leaves.push(node);
              return node;
          }
          
          let isLeaf = true;
          for (let i = startIdx; i < baseString.length; i++) {
              let sub = baseString.substring(startIdx, i + 1);
              if (isPalindromeCheck(sub)) {
                  isLeaf = false;
                  let child = build([...pathList, sub], i + 1, depth + 1);
                  node.children.push(child);
                  edges.push({ source: node.id, target: child.id, type: 'valid' });
              }
          }
          
          if (isLeaf) {
              leaves.push(node); // Pruned before reaching end
          }
          
          return node;
      }
      
      let root = build([], 0, 0);
      
      let leafSpacing = 85; 
      leaves.forEach((l, i) => l.x = i * leafSpacing);
      
      const setX = (n: any) => {
          if (n.children.length > 0) {
              n.children.forEach(setX);
              n.x = n.children.reduce((sum: number, c: any) => sum + c.x, 0) / n.children.length;
          }
      }
      setX(root);
      
      let ySpacing = 95;
      nodes.forEach(n => n.y = n.depth * ySpacing);
      
      let minX = Math.min(...nodes.map(n => n.x));
      let maxX = Math.max(...nodes.map(n => n.x));
      let cx = (minX + maxX) / 2;
      nodes.forEach(n => n.x -= cx);
      
      let maxDepth = Math.max(...nodes.map(n => n.depth));
      return { nodes, edges, height: (maxDepth * ySpacing) };
  }, [baseString]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseString.length === 0) return [{ phase: 'Init', description: 'Enter valid string.', line: 1, state: {} }];

    const s = baseString;
    let list: string[][] = [];
    let tempList: string[] = [];
    let callStack: string[] = [];
    let addedPartitions = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            s, 
            list: JSON.parse(JSON.stringify(list)),
            tempList: [...tempList],
            callStack: [...callStack],
            activePath: tempList.join('|'),
            addedPartitions: new Set(addedPartitions),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<List<String>> partition("${s}")`, 1, {});
        add("Init Result List", `List<List<String>> list = new ArrayList<>();\nWill store all valid palindrome partitions.`, 2, {});
        add("Initial Backtrack Call", `backtrack(list, new ArrayList<>(), s, 0);\nStarting recursion at index 0.`, 3, {});

        const backtrack = (start: number) => {
            callStack.push(`backtrack([${tempList.join(', ')}], st=${start})`);
            let currentDepth = callStack.length - 1;
            let pathStr = tempList.join('|');

            add("Backtrack Entry", `private void backtrack(...)`, 7, { callDepth: currentDepth, start });
            
            add("Check Base Case", `if (start == s.length())\nHave we reached the end of the string? start (${start}) == length (${s.length})? (${start === s.length ? 'Yes' : 'No'})`, 8, { callDepth: currentDepth, start, isCheckingBase: true });
            
            if (start === s.length) {
                list.push([...tempList]);
                addedPartitions.add(pathStr);
                add("Add to Result", `list.add(new ArrayList<>(tempList));\nReached the end safely. Valid partition found!`, 9, { callDepth: currentDepth, hlAddResult: list.length - 1, addedPartitions: new Set(addedPartitions), start });
                add("Return Success", `return;\nPartition saved. Backtracking to find more.`, 10, { callDepth: currentDepth, start });
                callStack.pop();
                return;
            }

            for (let i = start; i < s.length; i++) {
                add("For Loop", `for (int i = ${start}; i < s.length(); i++)\nIterating to find palindromic substrings starting at ${start}. Currently testing ending at i=${i}.`, 12, { callDepth: currentDepth, iter: i, start, isEvaluatingFor: true });
                
                let sub = s.substring(start, i + 1);
                let isPal = isPalindromeCheck(sub);
                
                add("Check Palindrome", `if (isPalindrome(s, ${start}, ${i}))\nIs substring "${sub}" a palindrome? (${isPal ? 'Yes' : 'No'})`, 13, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, isCheckingPal: true, isPalResult: isPal, failedAttempt: isPal ? null : sub });
                
                if (isPal) {
                    tempList.push(sub);
                    add("Add Substring", `tempList.add(s.substring(${start}, ${i + 1}));\n"${sub}" is a palindrome! Adding to current partition.`, 14, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, hlTempAdd: tempList.length - 1, activePath: tempList.join('|') });
                    
                    add("Recursive Call", `backtrack(list, tempList, s, ${i + 1});\nRecursing to partition the rest of the string starting from ${i + 1}.`, 15, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, activePath: tempList.join('|') });
                    backtrack(i + 1);
                    
                    let removed = tempList.pop();
                    add("Backtrack (Remove)", `tempList.remove(tempList.size() - 1);\nReturned from recursion. Removing "${removed}" to explore alternative partitions.`, 16, { callDepth: currentDepth, iter: i, start, hlTempRemove: true, removedVal: removed, activePath: tempList.join('|') });
                } else {
                    add("Prune Branch", `// Branch Pruned\nSubstring "${sub}" is NOT a palindrome. Skipping recursive call.`, 13, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, isFailedPrune: true, failedAttempt: sub });
                }
            }

            callStack.pop();
        };

        backtrack(0);

        add("Return Final Result", `return list;\nAll ${list.length} valid partitions generated successfully!`, 4, { isSuccess: true, finalAns: list.length });
    }

    return steps;
  }, [baseString, selectedOpId]);

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
      if (st.s === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6">
              
              {/* Top Section: Inputs, Current Path, Result List */}
              <div className="flex flex-col w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4">
                  
                  {/* Row 1: Arrays */}
                  <div className="flex flex-col md:flex-row w-full gap-6 items-start justify-center">
                      
                      {/* String S */}
                      <div className="flex flex-col items-start w-full flex-[1.2]">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Layout size={12}/> Input String (s)</span>
                          
                          <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full min-h-[90px] relative">
                              {st.s.split('').map((val: string, idx: number) => {
                                  let isHl = false;
                                  let color = 'slate';
                                  let isDimmed = false;
                                  let labels = [];
                                  let isLinked = false;

                                  // Dim characters before start index
                                  if (st.start !== undefined && idx < st.start) {
                                      isDimmed = true;
                                  }

                                  // Highlight the active substring being checked
                                  if (st.start !== undefined && st.iter !== undefined && idx >= st.start && idx <= st.iter) {
                                      isHl = true;
                                      color = 'rose';
                                      isLinked = true; // Visually link the characters of the substring together
                                  }

                                  if (st.start === idx) {
                                      labels.push({ text: 'start', color: 'rose', pos: 'bottom' });
                                  }
                                  if (st.iter === idx) {
                                      labels.push({ text: 'i', color: 'amber', pos: 'top' });
                                  }

                                  if (st.isSuccess) {
                                      isDimmed = false;
                                      isHl = false;
                                      color = 'slate';
                                      isLinked = false;
                                  }

                                  return (
                                      <React.Fragment key={`orig-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-0.5' : 'scale-100 z-10 m-0.5'}`}>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                                    <PointerLabel key={`b-${j}`} label={l.text} color={l.color} position="bottom" />
                                                ))}
                                              </div>
                                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.filter(l => l.pos === 'top').map((l, j) => (
                                                    <PointerLabel key={`t-${j}`} label={l.text} color={l.color} position="top" />
                                                ))}
                                              </div>
                                              
                                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl && st.iter === idx} isDimmed={isDimmed} isLinked={isLinked} compact={true}/>
                                              
                                              {/* Highlight Result Overlay */}
                                              {isHl && st.iter === idx && st.isCheckingPal && (
                                                  <div className={`absolute -right-8 top-1/2 -translate-y-1/2 z-30 animate-in zoom-in slide-in-from-left-2 ${st.isPalResult ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                      {st.isPalResult ? <CheckCircle2 size={16} className="bg-white rounded-full"/> : <XCircle size={16} className="bg-white rounded-full"/>}
                                                  </div>
                                              )}
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      {/* Current List Path (tempList) */}
                      <div className="flex flex-col items-start w-full flex-[1.5]">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-rose-50 text-rose-600 border-rose-200 flex items-center gap-2`}><ListTree size={12}/> Current Partition (tempList)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-rose-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlTempAdd ? 'border-sky-400 ring-4 ring-sky-200' : (st.hlTempRemove ? 'border-rose-400 ring-4 ring-rose-200' : 'border-rose-200')} relative`}>
                              
                              {/* Render active path */}
                              {st.tempList && st.tempList.map((val: string, idx: number) => {
                                  let isHl = false;
                                  let color = 'rose';
                                  
                                  if (st.hlTempAdd === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`temp-${idx}-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 animate-in zoom-in slide-in-from-left-8' : 'scale-100 z-10 m-0.5'}`}>
                                              <div className={`flex items-center justify-center min-w-[48px] h-[48px] px-3 font-mono font-black text-xl border-2 rounded-xl shadow-sm transition-all duration-300 ${isHl ? 'bg-amber-50 border-amber-400 text-amber-800 ring-4 ring-amber-200' : 'bg-white border-rose-300 text-rose-700'}`}>
                                                  "{val}"
                                              </div>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}

                              {/* Render popped element if backtracking */}
                              {st.hlTempRemove && st.removedVal !== undefined && (
                                  <div className={`relative transition-all duration-500 scale-110 z-20 mx-1 animate-out zoom-out slide-out-to-top-8 opacity-0`}>
                                      <div className={`flex items-center justify-center min-w-[48px] h-[48px] px-3 font-mono font-black text-xl border-2 rounded-xl shadow-sm bg-rose-50 border-rose-400 text-rose-300 line-through`}>
                                          "{st.removedVal}"
                                      </div>
                                  </div>
                              )}

                              {(!st.tempList || st.tempList.length === 0) && !st.hlTempRemove && <span className="text-slate-400 italic text-sm font-mono px-4">empty partition [ ]</span>}
                          </div>
                      </div>
                  </div>

                  {/* Row 2: Completed Combinations List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Completed Partitions ('list')</span>
                      
                      <div className={`flex gap-3 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] transition-colors duration-300 border-emerald-200`}>
                          {st.list && st.list.map((strArr: string[], pIdx: number) => {
                              let isHl = st.hlAddResult === pIdx;
                              return (
                                  <div key={`res-${pIdx}`} className={`flex font-mono font-bold text-sm border-2 rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${isHl ? 'border-emerald-400 ring-4 ring-emerald-200 scale-110 animate-in zoom-in slide-in-from-top-8 z-20' : 'border-slate-200 z-10 scale-100'}`}>
                                      {strArr.map((str, vIdx) => (
                                          <div key={`v-${pIdx}-${vIdx}`} className={`px-2 py-1 border-r last:border-r-0 ${isHl ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                              "{str}"
                                          </div>
                                      ))}
                                  </div>
                              )
                          })}
                          {(!st.list || st.list.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">no partitions added yet</span>}
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
                              let sy = source.y + 24; // bottom of node
                              let tx = target.x;
                              let ty = target.y - 24; // top of node

                              // Check if this edge is on the active path
                              let isActiveEdge = false;
                              let isCompletedEdge = false;

                              if (st.activePath !== undefined) {
                                  if (st.activePath === target.id || st.activePath.startsWith(target.id + '|')) {
                                      isActiveEdge = true;
                                  }
                              }
                              
                              if (st.addedPartitions) {
                                  if (Array.from(st.addedPartitions).some((leaf: any) => leaf === target.id || leaf.startsWith(target.id + '|'))) {
                                      isCompletedEdge = true;
                                  }
                              }

                              let strokeColor = '#cbd5e1'; // slate-300
                              let strokeWidth = 2;
                              let opacity = 0.4;

                              if (isCompletedEdge) { strokeColor = '#34d399'; strokeWidth = 3; opacity = 0.8; } // emerald-400
                              if (isActiveEdge) { strokeColor = '#fb7185'; strokeWidth = 4; opacity = 1; } // rose-400

                              // Smooth curve mapping identically relative to 0,0
                              let pathD = `M ${sx},${sy} C ${sx},${sy + 30} ${tx},${ty - 30} ${tx},${ty}`;

                              return <path key={`edge-${i}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-500"/>
                          })}

                          {/* Ghost Red Edge for Non-Palindrome Pruning */}
                          {st.isFailedPrune && st.activePath !== undefined && (
                              (() => {
                                  let activeId = st.activePath || 'root';
                                  const activeNode = treeData.nodes.find((n:any) => n.id === activeId);
                                  if (!activeNode) return null;

                                  let sx = activeNode.x;
                                  let sy = activeNode.y + 24;
                                  
                                  // Drop diagonally right to indicate horizontal branching failure
                                  let gx = sx + 50; 
                                  let gy = sy + 60;

                                  let tx = gx;
                                  let ty = gy - 20;

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
                              if (st.activePath === node.id || (node.id === 'root' && st.activePath === "")) {
                                  isActive = true;
                              }
                          }

                          if (st.addedPartitions) {
                              if (Array.from(st.addedPartitions).some((leaf: any) => leaf === node.id || leaf.startsWith(node.id + '|'))) {
                                  isCompleted = true;
                              }
                          }

                          let nodeTheme = 'slate';
                          let isDimmed = !isActive && !isCompleted;
                          
                          if (isCompleted) nodeTheme = 'emerald';
                          if (isActive) nodeTheme = 'rose';
                          
                          if (st.isSuccess) {
                              isDimmed = false;
                              nodeTheme = 'emerald';
                          }

                          return (
                              <div key={`node-${node.id}`} className={`absolute transition-all duration-700 z-10 ${isActive ? 'z-20 scale-110' : ''}`} style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}>
                                  <div className={`flex items-center justify-center px-3 min-w-[48px] h-[48px] font-mono font-black text-lg border-2 rounded-xl shadow-sm transition-all duration-300 ${isDimmed ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50' : (nodeTheme === 'emerald' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : (nodeTheme === 'rose' ? 'bg-rose-50 border-rose-400 text-rose-800 ring-4 ring-rose-200' : 'bg-white border-slate-300 text-slate-700'))}`}>
                                      {node.val === 'S' ? 'root' : `"${node.val}"`}
                                  </div>
                              </div>
                          )
                      })}

                      {/* Ghost Red Node for Failed Palindrome Check */}
                      {st.isFailedPrune && st.activePath !== undefined && (
                          (() => {
                              let activeId = st.activePath || 'root';
                              const activeNode = treeData.nodes.find((n:any) => n.id === activeId);
                              if (!activeNode) return null;

                              let gx = activeNode.x + 50;
                              let gy = activeNode.y + 60;

                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: gx, top: gy, transform: 'translate(-50%, -50%)' }}>
                                      <div className={`flex items-center justify-center px-3 min-w-[48px] h-[48px] font-mono font-black text-lg border-2 rounded-xl shadow-sm bg-rose-50 border-rose-400 text-rose-800`}>
                                          "{st.failedAttempt}"
                                      </div>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                                          <XCircle size={10}/> Not Palindrome
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'rose' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                <SplitIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Palindrome Partitioning</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'rose' ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Backtracking w/ Pruning
                  </span>
                  <span>•</span>
                  <span>LeetCode 131</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'rose' ? 'text-rose-600' : 'text-emerald-600'}`}><SplitIcon size={28}/> Valid Slicing</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given a string <code>s</code>, partition <code>s</code> such that every substring of the partition is a <strong>palindrome</strong>.<br/><br/>
                      Return all possible palindrome partitioning of <code>s</code>. A palindrome string is a string that reads the same backward as forward.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: s = "aab"</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [<br/>
                           &nbsp;&nbsp;["a", "a", "b"],<br/>
                           &nbsp;&nbsp;["aa", "b"]<br/>
                           ]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The string length is small (<code>1 &lt;= s.length &lt;= 16</code>). The number of possible partitions of a string of length N is 2^(N-1) (think of it as placing or not placing a divider between each character). This strongly hints at an exponential Backtracking solution.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-rose-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Use Backtracking with a <code>start</code> index. Loop <code>i</code> from <code>start</code> to the end of the string. Extract the substring <code>s[start..i]</code>. <strong>If it is a palindrome</strong>, add it to the path and recurse with <code>start = i + 1</code>. If it is NOT a palindrome, immediately prune the branch and continue to the next <code>i</code>.</p>
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
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> PalindromePartitioning.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>String s (Max 5 chars)</label>
                            <input type="text" maxLength={5} value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} placeholder="aab" />
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
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove || st.isFailedPrune ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> State Space Visualizer</span>
                       
                       {/* Call Stack Tracker with Scroll */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-rose-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-rose-200 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-rose-100 pb-1 mb-1 shrink-0 sticky top-0 bg-white z-10">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-rose-600`}>Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-1">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <span key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between shrink-0 ${isTop ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the exponential complexity of partitioning algorithms.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. The Partitioning State Space</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Partitioning a string is mathematically equivalent to deciding whether or not to place a "cut" between each adjacent character.</p>
                        <p className="text-slate-600 leading-relaxed">For a string of length N, there are N - 1 spaces between characters where a cut could potentially be made. Since each space has 2 choices (cut or no cut), the total number of theoretical partitions is exactly 2^(N-1).</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(N * 2^N)</h4>
                        <p className="mb-4 text-slate-600">The time complexity combines the number of generated nodes with the string work done at each node.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Number of Partitions:</strong> As proven above, the worst-case scenario occurs when every single substring is a palindrome (e.g., the string is "aaaaa"). The tree branches out completely to explore all 2^(N-1) partitions.</li>
                            <li><strong>Work per Partition:</strong> For each valid path, we execute <code>s.substring()</code> and we copy the final <code>tempList</code>. Substring extraction and string copying both take O(N) time.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total Time Complexity = O(N &times; 2^N)
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(N) Auxiliary</h4>
                        <p className="mb-4 text-slate-600">Space complexity involves the memory required to traverse the tree (Auxiliary Space) versus the memory to hold the final answers.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(N)</strong>
                                <span className="text-sm text-slate-600">The maximum depth of the recursive call stack occurs when we partition the string into single characters (e.g., `["a", "a", "b"]`), which is exactly N frames deep. The <code>tempList</code> also holds at most N strings. Thus, auxiliary space is strictly bounded by O(N).</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Palindrome Partitioning is a classic problem because it combines Backtracking with String manipulation. The ultimate follow-up question revolves around optimizing the palindrome check via Dynamic Programming."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Right now, your <code>isPalindrome</code> function runs in O(N) time and is called repeatedly. Can we optimize this?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we are repeatedly checking if the same substrings are palindromes across different branches of our backtracking tree.</p>
                            <p>We can optimize this using Dynamic Programming. Before starting the backtracking, we can build a 2D boolean array <code>dp[i][j]</code> where <code>dp[i][j]</code> is true if the substring from index <code>i</code> to <code>j</code> is a palindrome.</p>
                            <p>This table can be precomputed in O(N^2) time. Once computed, the <code>isPalindrome(s, start, i)</code> check inside the backtracking loop becomes an O(1) array lookup, significantly reducing the overhead inside the recursive engine."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "If I asked you to find the MINIMUM number of cuts to partition the string into palindromes (Palindrome Partitioning II), would you still use Backtracking?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, Backtracking would be too slow (O(2^N)) because it explores all possible valid partitions just to find the one with the smallest size.</p>
                            <p>To find the minimum cuts, I would use pure Dynamic Programming. I would maintain a 1D array <code>cuts[i]</code> which stores the minimum cuts needed for the substring from 0 to <code>i</code>. This transforms an exponential time algorithm into an O(N^2) polynomial time algorithm."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Why does the recursive call use <code>i + 1</code> instead of <code>start + 1</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The variable <code>start</code> represents the beginning of the substring we are currently evaluating. The variable <code>i</code> represents the end of that substring.</p>
                            <p>When we find that <code>s[start...i]</code> is a valid palindrome, we add it to our path. The remainder of the string that still needs to be partitioned begins immediately after <code>i</code>. Therefore, the next recursive call must start its evaluation at <code>i + 1</code>."</p>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-rose-600 shadow-rose-900/50`}><Code2 size={20}/></div>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove || st.isFailedPrune ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input String (Max 5 chars)</label>
                              <input type="text" maxLength={5} value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500`} />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-rose-600 text-white rounded-[2rem] hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-rose-500 shadow-[0_20px_50px_rgba(225,29,72,0.3)]`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {!st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 flex flex-col gap-2 animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-900 border-2 border-slate-700 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-end gap-2 transition-all duration-300 w-64 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-1 shrink-0 sticky top-0 bg-slate-900 z-10">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>Call Stack Depth</span>
                               </div>
                               <div className="flex flex-col gap-2">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <div key={idx} className={`font-mono text-sm font-black px-4 py-2 rounded-xl flex justify-between shrink-0 ${isTop ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-rose-400'}`}>
                                                <span>{frameStr}</span>
                                            </div>
                                        )
                                    })}
                                    {st.callStack.length === 0 && <span className="text-slate-500 italic text-sm font-mono px-2">Empty</span>}
                               </div>
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Generated All Partitions</p>
                                
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
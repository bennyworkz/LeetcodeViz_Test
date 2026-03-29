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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Backtracking w/ Rules',
    icon: <Brackets size={16} />,
    complexity: 'Time: O(4^N / √N) | Space: O(N)',
    code: `public List<String> generateParenthesis(int n) {
    List<String> list = new ArrayList<>();
    backtrack(list, new StringBuilder(), 0, 0, n);
    return list;
}

private void backtrack(List<String> list, StringBuilder current, int open, int close, int n) {
    if (current.length() == 2 * n) {
        list.add(current.toString());
        return;
    }
    if (open < n) {
        current.append('(');
        backtrack(list, current, open + 1, close, n);
        current.deleteCharAt(current.length() - 1);
    }
    if (close < open) {
        current.append(')');
        backtrack(list, current, open, close + 1, n);
        current.deleteCharAt(current.length() - 1);
    }
}`,
    desc: "The Generate Parentheses Backtracking approach. Instead of generating all possible strings of '(' and ')' and validating them afterwards, we use strict rules to ONLY generate valid branches. Rule 1: We can only add an open parenthesis '(' if we haven't reached 'n' yet. Rule 2: We can only add a close parenthesis ')' if the current number of close parentheses is strictly less than the number of open parentheses. This mathematically guarantees every generated string is well-formed."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|return|if|else|while|for|continue|break|new|List|ArrayList|String|StringBuilder|generateParenthesis|list|backtrack|current|open|close|n|length|toString|append|deleteCharAt)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
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
            const isObject = ['List', 'ArrayList', 'String', 'StringBuilder'].includes(part);
            const isPointer = ['list', 'current', 'open', 'close', 'n'].includes(part);
            const isMapCall = ['generateParenthesis', 'backtrack', 'length', 'toString', 'append', 'deleteCharAt'].includes(part);
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
                  isNaN(parseInt(part)) ? (part === "'('" || part === "')'" ? 'text-emerald-300' : '') : 'text-emerald-400'
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
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `idx ${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function GenerateParenthesesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [nInput, setNInput] = useState('3');
  
  const [baseN, setBaseN] = useState<number>(3);
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
      let parsedN = parseInt(nInput.trim(), 10);
      if (isNaN(parsedN) || parsedN <= 0) parsedN = 3;
      if (parsedN > 4) parsedN = 4; // Safety cap to prevent browser explosion (4 pairs = 14 results, good for viz)
      
      setBaseN(parsedN);
      setCurrentStep(0);
      setPan({ x: 0, y: 50 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, selectedOpId]);

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
      
      if (baseN === 0) return { nodes, edges, height: 200 };

      // Node ID uniquely identified by the exact string built so far
      const build = (pathStr: string, open: number, close: number, depth: number) => {
          let node = { 
              id: pathStr || 'root', 
              path: pathStr, 
              val: pathStr.length > 0 ? pathStr[pathStr.length-1] : 'S', 
              open,
              close,
              depth, 
              children: [] as any[], 
              x: 0, 
              y: 0 
          };
          nodes.push(node);
          
          if (pathStr.length === 2 * baseN) {
              leaves.push(node);
              return node;
          }
          
          if (open < baseN) {
              let child = build(pathStr + '(', open + 1, close, depth + 1);
              node.children.push(child);
              edges.push({ source: node.id, target: child.id, type: 'valid' });
          }
          
          if (close < open) {
              let child = build(pathStr + ')', open, close + 1, depth + 1);
              node.children.push(child);
              edges.push({ source: node.id, target: child.id, type: 'valid' });
          }
          
          return node;
      }
      
      let root = build('', 0, 0, 0);
      
      let leafSpacing = 85; 
      leaves.forEach((l, i) => l.x = i * leafSpacing);
      
      const setX = (n: any) => {
          if (n.children.length > 0) {
              n.children.forEach(setX);
              n.x = n.children.reduce((sum: number, c: any) => sum + c.x, 0) / n.children.length;
          }
      }
      setX(root);
      
      let ySpacing = 85;
      nodes.forEach(n => n.y = n.depth * ySpacing);
      
      let minX = Math.min(...nodes.map(n => n.x));
      let maxX = Math.max(...nodes.map(n => n.x));
      let cx = (minX + maxX) / 2;
      nodes.forEach(n => n.x -= cx);
      
      let maxDepth = Math.max(...nodes.map(n => n.depth));
      return { nodes, edges, height: (maxDepth * ySpacing) };
  }, [baseN]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseN === 0) return [{ phase: 'Init', description: 'Enter valid N.', line: 1, state: {} }];

    const n = baseN;
    let list: string[] = [];
    let currentPath: string[] = []; // Simulating StringBuilder
    let callStack: string[] = [];
    let addedCombos = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            n, 
            list: [...list],
            currentPath: [...currentPath],
            callStack: [...callStack],
            activePath: currentPath.join(''),
            addedCombos: new Set(addedCombos),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<String> generateParenthesis(int n)`, 1, {});
        add("Init Result List", `List<String> list = new ArrayList<>();\nWill store all well-formed parentheses strings.`, 2, {});
        add("Initial Backtrack Call", `backtrack(list, new StringBuilder(), 0, 0, n);\nStarting recursion with 0 open and 0 close.`, 3, {});

        const backtrack = (open: number, close: number) => {
            callStack.push(`backtrack("${currentPath.join('')}", o=${open}, c=${close})`);
            let currentDepth = callStack.length - 1;
            let pathStr = currentPath.join('');

            add("Backtrack Entry", `private void backtrack(...)`, 7, { callDepth: currentDepth, open, close });
            
            add("Check Base Case", `if (current.length() == 2 * n)\nIs length (${currentPath.length}) == ${2 * n}? (${currentPath.length === 2 * n ? 'Yes' : 'No'})`, 8, { callDepth: currentDepth, open, close, isCheckingBase: true });
            
            if (currentPath.length === 2 * n) {
                list.push(pathStr);
                addedCombos.add(pathStr);
                add("Add to Result", `list.add(current.toString());\nFound a valid well-formed combination!`, 9, { callDepth: currentDepth, hlAddResult: list.length - 1, addedCombos: new Set(addedCombos), open, close });
                add("Return Success", `return;\nValid string saved. Backtracking to find more.`, 10, { callDepth: currentDepth, open, close });
                callStack.pop();
                return;
            }

            // --- Open Branch ---
            add("Check Open Rule", `if (open < n)\nCan we add '('? open (${open}) < n (${n})? (${open < n ? 'Yes' : 'No'})`, 12, { callDepth: currentDepth, open, close, isCheckingOpen: true, failedAttempt: open < n ? null : '(' });
            
            if (open < n) {
                currentPath.push('(');
                add("Append Open", `current.append('(');\nAdding an open parenthesis to path.`, 13, { callDepth: currentDepth, open, close, hlTempAdd: currentPath.length - 1, activePath: currentPath.join('') });
                
                add("Recursive Call (Open)", `backtrack(list, current, open + 1, close, n);\nRecursing with open + 1 (${open + 1}).`, 14, { callDepth: currentDepth, open, close, activePath: currentPath.join('') });
                backtrack(open + 1, close);
                
                let removed = currentPath.pop();
                add("Backtrack Open", `current.deleteCharAt(current.length() - 1);\nReturned from recursion. Removing '${removed}' to explore other branches.`, 15, { callDepth: currentDepth, open, close, hlTempRemove: true, removedVal: removed, activePath: currentPath.join('') });
            }

            // --- Close Branch ---
            add("Check Close Rule", `if (close < open)\nCan we add ')'? close (${close}) < open (${open})? (${close < open ? 'Yes' : 'No'})`, 17, { callDepth: currentDepth, open, close, isCheckingClose: true, failedAttempt: close < open ? null : ')' });
            
            if (close < open) {
                currentPath.push(')');
                add("Append Close", `current.append(')');\nAdding a close parenthesis to path.`, 18, { callDepth: currentDepth, open, close, hlTempAdd: currentPath.length - 1, activePath: currentPath.join('') });
                
                add("Recursive Call (Close)", `backtrack(list, current, open, close + 1, n);\nRecursing with close + 1 (${close + 1}).`, 19, { callDepth: currentDepth, open, close, activePath: currentPath.join('') });
                backtrack(open, close + 1);
                
                let removed = currentPath.pop();
                add("Backtrack Close", `current.deleteCharAt(current.length() - 1);\nReturned from recursion. Removing '${removed}' to explore other branches.`, 20, { callDepth: currentDepth, open, close, hlTempRemove: true, removedVal: removed, activePath: currentPath.join('') });
            }

            callStack.pop();
        };

        backtrack(0, 0);

        add("Return Final Result", `return list;\nAll ${list.length} valid combinations generated successfully!`, 4, { isSuccess: true, finalAns: list.length });
    }

    return steps;
  }, [baseN, selectedOpId]);

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
      if (st.n === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6">
              
              {/* Top Section: Inputs, Current Path, Result List */}
              <div className="flex flex-col w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4">
                  
                  {/* Row 1: Arrays */}
                  <div className="flex flex-col md:flex-row w-full gap-6 items-start justify-center">
                      
                      {/* Current StringBuilder Path */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><ListTree size={12}/> Current StringBuilder (path)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-sky-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlTempAdd ? 'border-sky-400 ring-4 ring-sky-200' : (st.hlTempRemove ? 'border-rose-400 ring-4 ring-rose-200' : 'border-sky-200')} relative`}>
                              
                              {/* Overlay for Variables */}
                              {st.open !== undefined && !st.isSuccess && (
                                  <div className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm flex gap-2 border bg-white border-slate-200`}>
                                      <span className={st.isCheckingOpen ? 'text-amber-500 bg-amber-50 px-1 rounded' : 'text-slate-500'}>open = {st.open}</span>
                                      <span className="text-slate-300">|</span>
                                      <span className={st.isCheckingClose ? 'text-amber-500 bg-amber-50 px-1 rounded' : 'text-slate-500'}>close = {st.close}</span>
                                  </div>
                              )}

                              {/* Render active path */}
                              {st.currentPath && st.currentPath.map((val: string, idx: number) => {
                                  let isHl = false;
                                  let color = 'sky';
                                  
                                  if (st.hlTempAdd === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`temp-${idx}-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 animate-in zoom-in slide-in-from-left-8' : 'scale-100 z-10 m-0.5'}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} compact={true}/>
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

                              {(!st.currentPath || st.currentPath.length === 0) && !st.hlTempRemove && <span className="text-slate-400 italic text-sm font-mono px-4">empty string ""</span>}
                          </div>
                      </div>
                  </div>

                  {/* Row 2: Completed Combinations List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Completed Valid Parentheses ('list')</span>
                      
                      <div className={`flex gap-3 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] transition-colors duration-300 border-emerald-200`}>
                          {st.list && st.list.map((str: string, pIdx: number) => {
                              let isHl = st.hlAddResult === pIdx;
                              return (
                                  <div key={`res-${pIdx}`} className={`flex font-mono font-black text-lg border-2 rounded-xl px-3 py-1 shadow-sm transition-all duration-300 tracking-widest ${isHl ? 'border-emerald-400 bg-emerald-100 text-emerald-700 ring-4 ring-emerald-200 scale-110 animate-in zoom-in slide-in-from-top-8 z-20' : 'border-slate-200 bg-slate-50 text-slate-700 z-10 scale-100'}`}>
                                      {str}
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
                                  // For string IDs, if current active path exactly matches or is a prefix
                                  if (st.activePath === target.id || st.activePath.startsWith(target.id)) {
                                      isActiveEdge = true;
                                  }
                              }
                              
                              if (st.addedCombos) {
                                  if (Array.from(st.addedCombos).some((leaf: any) => leaf === target.id || leaf.startsWith(target.id))) {
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

                          {/* Ghost Red Edge for Failed Condition (Open < N or Close < Open) */}
                          {st.failedAttempt !== undefined && st.failedAttempt !== null && st.activePath !== undefined && (
                              (() => {
                                  let activeId = st.activePath || 'root';
                                  const activeNode = treeData.nodes.find((n:any) => n.id === activeId);
                                  if (!activeNode) return null;

                                  let sx = activeNode.x;
                                  let sy = activeNode.y + 24;
                                  
                                  // Drop diagonally based on what failed
                                  let directionOffset = st.failedAttempt === '(' ? -40 : 40;

                                  let gx = sx + directionOffset; 
                                  let gy = sy + 60;

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
                              if (st.activePath === node.id || (node.id === 'root' && st.activePath === "")) {
                                  isActive = true;
                              }
                          }

                          if (st.addedCombos) {
                              if (Array.from(st.addedCombos).some((leaf: any) => leaf === node.id || leaf.startsWith(node.id))) {
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

                      {/* Ghost Red Node for Failed Condition */}
                      {st.failedAttempt !== undefined && st.failedAttempt !== null && st.activePath !== undefined && (
                          (() => {
                              let activeId = st.activePath || 'root';
                              const activeNode = treeData.nodes.find((n:any) => n.id === activeId);
                              if (!activeNode) return null;

                              let directionOffset = st.failedAttempt === '(' ? -40 : 40;
                              let gx = activeNode.x + directionOffset;
                              let gy = activeNode.y + 60;

                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: gx, top: gy, transform: 'translate(-50%, -50%)' }}>
                                      <NodeBlock val={st.failedAttempt} themeColor="rose" isTarget={true} compact={true}/>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                                          <XCircle size={10}/> Pruned
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
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Generate Parentheses</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'sky' ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Backtracking w/ Rules
                  </span>
                  <span>•</span>
                  <span>LeetCode 22</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'sky' ? 'text-sky-600' : 'text-emerald-600'}`}><Brackets size={28}/> Well-Formed Pairs</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given <code>n</code> pairs of parentheses, write a function to <em>generate all combinations of well-formed parentheses</em>.<br/><br/>
                      A string of parentheses is well-formed if every open parenthesis <code>(</code> has a corresponding close parenthesis <code>)</code> in the correct order.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-sky-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: n = 3</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [<br/>
                           &nbsp;&nbsp;"((()))",<br/>
                           &nbsp;&nbsp;"(()())",<br/>
                           &nbsp;&nbsp;"(())()",<br/>
                           &nbsp;&nbsp;"()(())",<br/>
                           &nbsp;&nbsp;"()()()"<br/>
                           ]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The number of pairs <code>n</code> is small (<code>1 &lt;= n &lt;= 8</code>). You could brute force it by generating all 2^(2n) possible strings and then writing a separate validation function, but that is extremely inefficient. We need to generate <em>only</em> valid strings.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-sky-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Use Backtracking with strict placement rules. Keep track of <code>open</code> and <code>close</code> parenthesis counts.<br/>1. We can add an open parenthesis as long as <code>open &lt; n</code>.<br/>2. We can add a close parenthesis as long as <code>close &lt; open</code>. This mathematically prevents any invalid string from ever being created.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> GenerateParentheses.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Number of Pairs (n)</label>
                            <input type="number" min="1" max="4" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} placeholder="3" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated all {st.finalAns} well-formed combinations.</p>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the mathematics of Catalan Numbers and the decision rules for generating well-formed strings.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-sky-500"/> 1. The Valid Parentheses Rules</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike a simple powerset, we are highly constrained. At any point while building the string, we have two decisions: add an open parenthesis `(` or add a close parenthesis `)`.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Open Rule:</strong> We can always add an open parenthesis as long as we haven't hit our limit `n`. Because `(` is the start of a pair, it's always valid to start a new one.</li>
                            <li><strong>Close Rule:</strong> We can ONLY add a close parenthesis if there are currently more open parentheses than close parentheses in our string. This ensures we never create an invalid state like `())(`.</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-rose-500"/> 2. Pruning via Rules</h4>
                        <p className="text-slate-600 leading-relaxed mb-4">If we didn't use these rules, we would generate a massive binary tree of size 2^(2n). For n=3, that is 2^6 = 64 strings. However, only 5 of them are valid.</p>
                        <p className="text-slate-600 leading-relaxed">By embedding the rules directly into the `if` statements before the recursive call, the backtracking algorithm acts perfectly. It never even steps into a branch that would lead to an invalid string, completely avoiding the need to "verify" strings later.</p>
                    </div>

                    {/* Section 3 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time Complexity: Catalan Number</h4>
                        <p className="mb-4 text-slate-600">This is one of the most famous mathematical complexities in Computer Science. The number of valid parenthesis combinations for n pairs is exactly the n-th <strong>Catalan Number</strong>.</p>
                        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm space-y-3 text-center">
                            <p className="font-mono text-xl font-bold text-slate-700 bg-emerald-50 p-3 rounded">
                                C_n = (1 / (n + 1)) * (2n! / (n! * n!))
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed mt-2">
                                Asymptotically, the n-th Catalan number grows as 4^n / (n√n).
                            </p>
                        </div>
                        <p className="mt-4 text-slate-600">Because we do O(n) work at each leaf node to copy the string into our result array, the final time complexity is often written as <strong>O(4^n / √n)</strong>.</p>
                    </div>

                    {/* Section 4 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-indigo-500"/> 4. Space Complexity Analysis: O(N)</h4>
                        <p className="mb-4 text-slate-600">Space complexity involves the memory required to traverse the tree.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(N)</strong>
                                <span className="text-sm text-slate-600">The depth of the recursive call stack reaches exactly 2n frames deep at the base case (because the string length is 2n). Thus, auxiliary space is strictly bounded by O(N). The <code>StringBuilder</code> also takes O(N) space.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Generate Parentheses is a true rite of passage for software engineering interviews. Interviewers will press you on the logic behind the rules and will absolutely ask you if you know the name of the mathematical sequence involved."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why is the condition for adding a close parenthesis <code>close &lt; open</code> instead of <code>close &lt; n</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If we used <code>close &lt; n</code>, we would be allowed to add a close parenthesis even when there are no open parentheses available to match it (e.g., the very first character could be <code>)</code>, generating an invalid string).</p>
                            <p>The condition <code>close &lt; open</code> enforces that we can only 'close' a pair that has already been 'opened' earlier in the sequence. This guarantees the string will always be mathematically well-formed from left to right."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What is the maximum depth of the recursion tree?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The maximum depth of the recursion tree is exactly <strong>2n</strong>.</p>
                            <p>Every valid combination must contain exactly n open parentheses and n close parentheses, totaling 2n characters. Since we add exactly one character per recursive level, the recursion will always bottom out exactly at depth 2n before returning."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Can you solve this using an Iterative Breadth-First Search (BFS) approach instead of Backtracking?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes. Instead of a Call Stack, we can use a <code>Queue</code> holding a custom object containing the current string, the open count, and the close count.</p>
                            <p>We start by offering <code>("", 0, 0)</code>. While the queue is not empty, we poll an element. If its length is 2n, we add it to our result list. If <code>open &lt; n</code>, we append <code>(</code> and offer it to the queue. If <code>close &lt; open</code>, we append <code>)</code> and offer it to the queue.</p>
                            <p>However, this is much less space-efficient than Backtracking. Backtracking uses O(N) space for the string buffer and stack, whereas the Queue will end up storing hundreds of intermediate strings in memory at the widest level of the tree."</p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q4: "What is the name of the mathematical sequence describing the number of valid combinations?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The number of valid combinations is the n-th <strong>Catalan Number</strong>.</p>
                            <p>This sequence appears in many combinatorial problems, such as the number of ways to triangulate a convex polygon, or the number of distinct Binary Search Trees that can be formed with n nodes. Its formula is (1 / (n + 1)) * (2n! / (n! * n!))."</p>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Number of Pairs (n)</label>
                              <input type="number" min="1" max="4" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500`} />
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
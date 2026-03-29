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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Backtracking w/ IP Validation',
    icon: <Globe size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    code: `public List<String> restoreIpAddresses(String s) {
    List<String> list = new ArrayList<>();
    backtrack(list, new ArrayList<>(), s, 0);
    return list;
}

private void backtrack(List<String> list, List<String> tempList, String s, int start) {
    if (tempList.size() == 4) {
        if (start == s.length()) list.add(String.join(".", tempList));
        return;
    }
    for (int i = start; i < s.length() && i < start + 3; i++) {
        String sub = s.substring(start, i + 1);
        if (isValid(sub)) {
            tempList.add(sub);
            backtrack(list, tempList, s, i + 1);
            tempList.remove(tempList.size() - 1);
        }
    }
}

private boolean isValid(String s) {
    if (s.length() > 1 && s.startsWith("0")) return false;
    return Integer.parseInt(s) <= 255;
}`,
    desc: "The Restore IP Addresses Backtracking approach. An IP address must have exactly 4 parts, so our recursive depth is bounded by 4. In our loop, we only take substrings of length 1 to 3. If a substring is a valid IP segment (no leading zeros unless it's strictly '0', and value <= 255), we add it to our path and recurse. If we hit 4 parts and have consumed the entire string, we format and save the IP."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|return|if|else|while|for|continue|break|new|List|ArrayList|String|restoreIpAddresses|s|list|backtrack|tempList|start|size|length|add|remove|substring|isValid|parseInt|Integer|join|startsWith|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
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
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['List', 'ArrayList', 'String', 'Integer'].includes(part);
            const isPointer = ['s', 'list', 'tempList', 'start', 'i', 'sub'].includes(part);
            const isMapCall = ['restoreIpAddresses', 'backtrack', 'isValid', 'length', 'size', 'add', 'remove', 'substring', 'join', 'startsWith', 'parseInt'].includes(part);
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
                  isPointer ? 'text-sky-300' : 
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
    const linkClasses = isLinked ? `border-sky-400 bg-sky-50` : ``;

    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px]" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px]";
    
    const textSz = compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${isLinked ? linkClasses : activeTheme.bg} ${isLinked ? 'border-sky-400' : activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-50 text-rose-300 line-through' : 'bg-white/60 ' + (isLinked ? 'text-sky-700' : activeTheme.text)} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${isLinked ? 'bg-sky-100 text-sky-600' : activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `i=${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Helper for IP Validation ---
function isValidIpPart(s: string): boolean {
    if (s.length > 1 && s.startsWith('0')) return false;
    let num = parseInt(s, 10);
    return num >= 0 && num <= 255;
}

// --- Main Application ---

export default function RestoreIpAddressVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [sInput, setSInput] = useState('10102');
  
  const [baseString, setBaseString] = useState<string>('10102');
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
      // Sanitize input (digits only)
      let parsed = sInput.trim().replace(/[^0-9]/g, '');
      if (parsed.length === 0) parsed = "10102";
      if (parsed.length > 8) parsed = parsed.substring(0, 8); // Limit length to 8 to prevent UI explosion
      
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
          let id = pathList.join('.') || 'root';
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
          
          if (depth === 4) {
              leaves.push(node);
              return node; // 4 parts max
          }
          
          let isLeaf = true;
          for (let i = startIdx; i < baseString.length && i < startIdx + 3; i++) {
              let sub = baseString.substring(startIdx, i + 1);
              if (isValidIpPart(sub)) {
                  isLeaf = false;
                  let child = build([...pathList, sub], i + 1, depth + 1);
                  node.children.push(child);
                  edges.push({ source: node.id, target: child.id, type: 'valid' });
              }
          }
          
          if (isLeaf) {
              leaves.push(node); // Pruned before reaching depth 4
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
    let list: string[] = [];
    let tempList: string[] = [];
    let callStack: string[] = [];
    let addedIPs = new Set<string>();

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            s, 
            list: JSON.parse(JSON.stringify(list)),
            tempList: [...tempList],
            callStack: [...callStack],
            activePath: tempList.join('.'),
            addedIPs: new Set(addedIPs),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<String> restoreIpAddresses("${s}")`, 1, {});
        add("Init Result List", `List<String> list = new ArrayList<>();\nWill store all valid IP addresses.`, 2, {});
        add("Initial Backtrack Call", `backtrack(list, new ArrayList<>(), s, 0);\nStarting recursion at index 0.`, 3, {});

        const backtrack = (start: number) => {
            callStack.push(`backtrack([${tempList.join(', ')}], st=${start})`);
            let currentDepth = callStack.length - 1;
            let pathStr = tempList.join('.');

            add("Backtrack Entry", `private void backtrack(...)`, 7, { callDepth: currentDepth, start });
            
            add("Check Base Case (Parts limit)", `if (tempList.size() == 4)\nDo we have 4 IP parts? size (${tempList.length}) == 4? (${tempList.length === 4 ? 'Yes' : 'No'})`, 8, { callDepth: currentDepth, start, isCheckingBase: true });
            
            if (tempList.length === 4) {
                add("Check Base Case (End of String)", `if (start == s.length())\nHave we consumed the entire string? start (${start}) == length (${s.length})? (${start === s.length ? 'Yes' : 'No'})`, 9, { callDepth: currentDepth, start, isCheckingEnd: true });
                if (start === s.length) {
                    let ip = tempList.join('.');
                    list.push(ip);
                    addedIPs.add(pathStr);
                    add("Add to Result", `list.add(String.join(".", tempList));\nValid IP Address found!`, 9, { callDepth: currentDepth, hlAddResult: list.length - 1, addedIPs: new Set(addedIPs), start });
                } else {
                    add("Prune Branch (Dead End)", `// Implicit Prune\nWe have 4 parts but haven't used all digits. Dead end!`, 9, { callDepth: currentDepth, start, isDeadEnd: true, failedAttempt: "Too long" });
                }
                add("Return", `return;\nBacktracking to explore alternative combinations.`, 10, { callDepth: currentDepth, start });
                callStack.pop();
                return;
            }

            for (let i = start; i < s.length && i < start + 3; i++) {
                add("For Loop", `for (int i = ${start}; i < s.length() && i < start + 3; i++)\nIterating 1 to 3 characters for the next IP segment. Currently testing up to index i=${i}.`, 12, { callDepth: currentDepth, iter: i, start, isEvaluatingFor: true });
                
                let sub = s.substring(start, i + 1);
                add("Extract Substring", `String sub = s.substring(${start}, ${i + 1});\nExtracted segment "${sub}".`, 13, { callDepth: currentDepth, iter: i, start, activeSubstring: sub });

                let isValid = isValidIpPart(sub);
                add("Validate Segment", `if (isValid(sub))\nIs segment "${sub}" a valid IP part (<= 255, no leading zeros)? (${isValid ? 'Yes' : 'No'})`, 14, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, isCheckingValid: true, isValidResult: isValid, failedAttempt: isValid ? null : sub });
                
                if (isValid) {
                    tempList.push(sub);
                    add("Add Segment", `tempList.add(sub);\n"${sub}" is valid! Adding to current IP parts.`, 15, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, hlTempAdd: tempList.length - 1, activePath: tempList.join('.') });
                    
                    add("Recursive Call", `backtrack(list, tempList, s, ${i + 1});\nRecursing to partition the rest of the string starting from ${i + 1}.`, 16, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, activePath: tempList.join('.') });
                    backtrack(i + 1);
                    
                    let removed = tempList.pop();
                    add("Backtrack (Remove)", `tempList.remove(tempList.size() - 1);\nReturned from recursion. Removing "${removed}" to explore alternative lengths.`, 17, { callDepth: currentDepth, iter: i, start, hlTempRemove: true, removedVal: removed, activePath: tempList.join('.') });
                } else {
                    add("Prune Branch", `// Branch Pruned\nSegment "${sub}" is NOT valid. Skipping recursive call.`, 14, { callDepth: currentDepth, iter: i, start, activeSubstring: sub, isFailedPrune: true, failedAttempt: sub });
                }
            }

            callStack.pop();
        };

        backtrack(0);

        add("Return Final Result", `return list;\nAll ${list.length} valid IP addresses generated successfully!`, 4, { isSuccess: true, finalAns: list.length });
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
                                      color = 'sky';
                                      isLinked = true; // Visually link the characters of the substring together
                                  }

                                  if (st.start === idx) {
                                      labels.push({ text: 'start', color: 'sky', pos: 'bottom' });
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
                                              {isHl && st.iter === idx && st.isCheckingValid && (
                                                  <div className={`absolute -right-8 top-1/2 -translate-y-1/2 z-30 animate-in zoom-in slide-in-from-left-2 ${st.isValidResult ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                      {st.isValidResult ? <CheckCircle2 size={16} className="bg-white rounded-full"/> : <XCircle size={16} className="bg-white rounded-full"/>}
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
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><ListTree size={12}/> Current IP Parts (tempList)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-sky-50/50 rounded-[2rem] shadow-xl flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlTempAdd ? 'border-sky-400 ring-4 ring-sky-200' : (st.hlTempRemove ? 'border-rose-400 ring-4 ring-rose-200' : 'border-sky-200')} relative`}>
                              
                              {/* Render active path */}
                              {st.tempList && st.tempList.map((val: string, idx: number) => {
                                  let isHl = false;
                                  let color = 'sky';
                                  
                                  if (st.hlTempAdd === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`temp-${idx}-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 animate-in zoom-in slide-in-from-left-8' : 'scale-100 z-10 m-0.5'}`}>
                                              <div className={`flex items-center justify-center min-w-[48px] h-[48px] px-3 font-mono font-black text-xl border-2 rounded-xl shadow-sm transition-all duration-300 ${isHl ? 'bg-amber-50 border-amber-400 text-amber-800 ring-4 ring-amber-200' : 'bg-white border-sky-300 text-sky-700'}`}>
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

                              {(!st.tempList || st.tempList.length === 0) && !st.hlTempRemove && <span className="text-slate-400 italic text-sm font-mono px-4">empty parts [ ]</span>}
                          </div>
                      </div>
                  </div>

                  {/* Row 2: Completed Combinations List */}
                  <div className="flex flex-col items-start w-full mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Database size={12}/> Valid IP Addresses ('list')</span>
                      
                      <div className={`flex gap-3 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px] transition-colors duration-300 border-emerald-200`}>
                          {st.list && st.list.map((str: string, pIdx: number) => {
                              let isHl = st.hlAddResult === pIdx;
                              return (
                                  <div key={`res-${pIdx}`} className={`flex font-mono font-bold text-sm border-2 rounded-xl px-3 py-1 shadow-sm transition-all duration-300 overflow-hidden tracking-widest ${isHl ? 'border-emerald-400 bg-emerald-100 text-emerald-800 ring-4 ring-emerald-200 scale-110 animate-in zoom-in slide-in-from-top-8 z-20' : 'border-slate-200 bg-slate-50 text-slate-700 z-10 scale-100'}`}>
                                      "{str}"
                                  </div>
                              )
                          })}
                          {(!st.list || st.list.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">no addresses added yet</span>}
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
                                  if (st.activePath === target.id || st.activePath.startsWith(target.id + '.')) {
                                      isActiveEdge = true;
                                  }
                              }
                              
                              if (st.addedIPs) {
                                  if (Array.from(st.addedIPs).some((leaf: any) => leaf === target.id || leaf.startsWith(target.id + '.'))) {
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

                          {/* Ghost Red Edge for Non-Valid IP Pruning */}
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

                          {/* Ghost Red Edge for Dead End (4 parts but not full string) */}
                          {st.isDeadEnd && st.activePath !== undefined && (
                              (() => {
                                  let activeId = st.activePath || 'root';
                                  const activeNode = treeData.nodes.find((n:any) => n.id === activeId);
                                  if (!activeNode) return null;

                                  let sx = activeNode.x;
                                  let sy = activeNode.y + 24;
                                  
                                  // Drop straight down for a dead end
                                  let gx = sx; 
                                  let gy = sy + 70;

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

                          if (st.addedIPs) {
                              if (Array.from(st.addedIPs).some((leaf: any) => leaf === node.id || leaf.startsWith(node.id + '.'))) {
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
                                  <div className={`flex items-center justify-center px-3 min-w-[48px] h-[48px] font-mono font-black text-lg border-2 rounded-xl shadow-sm transition-all duration-300 ${isDimmed ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50' : (nodeTheme === 'emerald' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : (nodeTheme === 'sky' ? 'bg-sky-50 border-sky-400 text-sky-800 ring-4 ring-sky-200' : 'bg-white border-slate-300 text-slate-700'))}`}>
                                      {node.val === 'S' ? 'root' : `"${node.val}"`}
                                  </div>
                              </div>
                          )
                      })}

                      {/* Ghost Red Node for Failed Validation */}
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
                                          <XCircle size={10}/> Invalid
                                      </div>
                                  </div>
                              )
                          })()
                      )}

                      {/* Ghost Red Node for Dead End (Size 4, but not full string) */}
                      {st.isDeadEnd && st.activePath !== undefined && (
                          (() => {
                              let activeId = st.activePath || 'root';
                              const activeNode = treeData.nodes.find((n:any) => n.id === activeId);
                              if (!activeNode) return null;

                              let gx = activeNode.x;
                              let gy = activeNode.y + 70;

                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: gx, top: gy, transform: 'translate(-50%, -50%)' }}>
                                      <div className={`flex items-center justify-center px-3 min-w-[48px] h-[48px] font-mono font-black text-lg border-2 rounded-xl shadow-sm bg-rose-50 border-rose-400 text-rose-800`}>
                                          X
                                      </div>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                                          <XCircle size={10}/> Unused chars
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
                <Globe className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Restore IP Addresses</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'sky' ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Backtracking w/ Limits
                  </span>
                  <span>•</span>
                  <span>LeetCode 93</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'sky' ? 'text-sky-600' : 'text-emerald-600'}`}><Globe size={28}/> IP Format Slicing</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      A valid IP address consists of exactly four integers separated by single dots. Each integer is between <code>0</code> and <code>255</code> (inclusive) and cannot have leading zeros.<br/><br/>
                      Given a string <code>s</code> containing only digits, return all possible valid IP addresses that can be formed by inserting dots into <code>s</code>.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-sky-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: s = "25525511135"</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           [<br/>
                           &nbsp;&nbsp;"255.255.11.135",<br/>
                           &nbsp;&nbsp;"255.255.111.35"<br/>
                           ]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">An IP address is strictly constrained. It MUST have exactly 4 parts. Therefore, if the string length is greater than 12 (3 chars * 4 parts), no valid IP can exist. Also, a single part cannot exceed the integer value 255, and cannot be "01" or "00".</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-sky-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Use Backtracking with depth bounding. Our recursive tree naturally stops when we collect 4 parts. At each node, we extract a substring of length 1, 2, or 3. We validate this substring. If it's valid, we add it to our path and recurse. If we hit 4 parts and the whole string is consumed, we format and save the IP.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> RestoreIpAddresses.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input String s (Max 8 chars)</label>
                            <input type="text" maxLength={8} value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner`} placeholder="10102" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated all {st.finalAns} valid IPs.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove || st.isFailedPrune || st.isDeadEnd ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> State Space Visualizer</span>
                       
                       {/* Call Stack Tracker with Scroll */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-sky-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-200 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-sky-100 pb-1 mb-1 shrink-0 sticky top-0 bg-white z-10">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-sky-600`}>Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-1">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <span key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between shrink-0 ${isTop ? 'bg-sky-600 text-white shadow-sm' : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the surprising O(1) constant time complexity for IP address generation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-sky-500"/> 1. The Bounded State Space</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike general subset or permutation problems where the tree depth grows with the input length $N$, an IP address is strictly constrained to exactly 4 parts.</p>
                        <p className="text-slate-600 leading-relaxed">This means the decision tree has a maximum depth of exactly 4. At each node, we only have 3 choices (take 1, 2, or 3 digits). Because the depth and branching factor are strictly bounded by constants, the maximum number of combinations evaluated is incredibly small.</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(1) Constant Time</h4>
                        <p className="mb-4 text-slate-600">The time complexity is technically $O(1)$ relative to $N$. Here is why:</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Max Nodes:</strong> Since the tree depth is at most 4, and each node branches at most 3 times, the theoretical maximum number of valid combinations we can evaluate is $3^4 = 81$.</li>
                            <li><strong>Early Exit:</strong> If the input string $S$ has a length &gt; 12, no valid IP can possibly be formed. Our algorithm naturally terminates or prunes out impossible paths instantly.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total Time Complexity = O(1)
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-indigo-500"/> 3. Space Complexity Analysis: O(1) Auxiliary</h4>
                        <p className="mb-4 text-slate-600">Space complexity is determined by the maximum memory consumed during execution.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(1)</strong>
                                <span className="text-sm text-slate-600">The depth of the recursive call stack never exceeds 4 frames. The <code>tempList</code> also never exceeds 4 elements. Thus, the memory used by the algorithm is bounded by a constant, $O(1)$.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Restore IP Addresses tests your ability to strictly enforce boundary constraints during depth-first search. You must clearly explain the O(1) complexity trap."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What is the time complexity of this algorithm? Are you sure it's not O(3^N)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is absolutely <strong>O(1)</strong>.</p>
                            <p>While the algorithm branches 3 times at each node, the recursion depth is hard-capped at 4 (because an IP address only has 4 parts). The maximum number of combinations generated is strictly bounded by $3^4 = 81$, regardless of how incredibly long the input string $N$ is.</p>
                            <p>If $N &gt; 12$, the algorithm will immediately fail to consume the string and backtrack, evaluating in constant time. Thus, the time complexity does not scale with $N$."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Explain the rule for leading zeros. Why is '01' invalid but '0' is valid?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "According to IPv4 standards, a segment can represent the integer 0, which is naturally formatted as <code>"0"</code>. However, multi-digit numbers cannot have leading zeros.</p>
                            <p>In the code, this is handled by: <code>if (s.length() &gt; 1 &amp;&amp; s.startsWith("0")) return false;</code>. If the length is exactly 1 and the char is '0', it bypasses this check and is evaluated as a valid integer zero."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Why do we use <code>String.join(".", tempList)</code> instead of a StringBuilder inside the backtracking engine?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "In this specific problem, maintaining a single global <code>StringBuilder</code> (adding parts and the dot separator) is actually more complex to manage when backtracking, because we have to perfectly calculate how many characters to delete upon return.</p>
                            <p>Since the list size is strictly bounded to exactly 4 elements, creating a new joined string at the base case using <code>String.join</code> is highly efficient and keeps the backtracking logic significantly cleaner and less error-prone."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.hlTempRemove || st.isFailedPrune || st.isDeadEnd ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input String s (Max 8 chars)</label>
                              <input type="text" maxLength={8} value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500`} />
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
                          <div className={`bg-slate-900 border-2 border-slate-700 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-end gap-2 transition-all duration-300 w-64 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-1 shrink-0 sticky top-0 bg-slate-900 z-10">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>Call Stack Depth</span>
                               </div>
                               <div className="flex flex-col gap-2">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <div key={idx} className={`font-mono text-sm font-black px-4 py-2 rounded-xl flex justify-between shrink-0 ${isTop ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-800 text-sky-400'}`}>
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Generated All IPs</p>
                                
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
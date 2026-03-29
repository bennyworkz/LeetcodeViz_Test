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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. DFS Backtracking (Optimal)',
    icon: <Map size={16} />,
    complexity: 'Time: O(M*N*3^L) | Space: O(L)',
    code: `public boolean exist(char[][] board, String word) {
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            if (backtrack(board, word, i, j, 0)) return true;
        }
    }
    return false;
}

private boolean backtrack(char[][] board, String word, int i, int j, int k) {
    if (k == word.length()) return true;
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != word.charAt(k)) return false;
    
    char temp = board[i][j];
    board[i][j] = '#';
    
    boolean found = backtrack(board, word, i + 1, j, k + 1) ||
                    backtrack(board, word, i - 1, j, k + 1) ||
                    backtrack(board, word, i, j + 1, k + 1) ||
                    backtrack(board, word, i, j - 1, k + 1);
                    
    board[i][j] = temp;
    return found;
}`,
    desc: "The Word Search DFS Backtracking approach. We iterate through every cell in the grid to find the starting letter. Once found, we initiate a Depth-First Search (DFS) looking for the consecutive characters. To prevent reusing the same cell, we temporarily mark it with '#' before recursing into its 4 neighbors. If any neighbor path yields the full word, we return true. If all neighbors fail, we 'backtrack' by restoring the original character and return false."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|exist|board|word|backtrack|length|charAt|temp|found|i|j|k)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'char', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String'].includes(part);
            const isPointer = ['board', 'word', 'temp', 'found', 'i', 'j', 'k'].includes(part);
            const isMapCall = ['exist', 'backtrack', 'length', 'charAt'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']'].includes(part.trim());
            
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
  r?: number;
  c?: number;
  themeColor?: string;
  isTarget?: boolean;
  isDimmed?: boolean;
  isDeleted?: boolean;
  compact?: boolean;
  subtext?: string;
  isLinked?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, r, c, themeColor = 'slate', isTarget, isDimmed = false, isDeleted = false, compact = false, subtext, isLinked = false }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-400', index: 'bg-slate-100 text-slate-400' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    if (isDeleted) activeTheme = themes['disabled'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
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
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-50 text-rose-300' : 'bg-white/60 ' + (isLinked ? 'text-sky-700' : activeTheme.text)} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(r !== undefined && c !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${isLinked ? 'bg-sky-100 text-sky-600' : activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{r},{c}</span>
                        </div>
                    </div>
                )}
                {subtext !== undefined && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${isLinked ? 'bg-sky-100 text-sky-600' : activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function WordSearchVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [wordInput, setWordInput] = useState('ABCCED');
  
  // Fixed board for visualization
  const initialBoard = [
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E']
  ];

  const [baseWord, setBaseWord] = useState<string>('ABCCED');
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'sky';

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = wordInput.trim().toUpperCase().replace(/[^A-Z]/g, '');
      if (parsed.length === 0) parsed = "ABCCED";
      if (parsed.length > 8) parsed = parsed.substring(0, 8); // Safety limit
      
      setBaseWord(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [wordInput, selectedOpId]);

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
    if (baseWord.length === 0) return [{ phase: 'Init', description: 'Enter valid string.', line: 1, state: {} }];

    const word = baseWord;
    let board = initialBoard.map(row => [...row]);
    let rows = board.length;
    let cols = board[0].length;
    
    let path: {r: number, c: number, k: number}[] = [];
    let callStack: string[] = [];
    let globalFound = false;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            board: board.map(row => [...row]),
            word,
            rows, cols,
            path: [...path],
            callStack: [...callStack],
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public boolean exist(char[][] board, String word)`, 1, {});

        // Outer loops
        for (let i = 0; i < rows && !globalFound; i++) {
            add("Outer Loop (i)", `for (int i = ${i}; i < board.length; i++)`, 2, { outerI: i });
            for (let j = 0; j < cols && !globalFound; j++) {
                add("Inner Loop (j)", `for (int j = ${j}; j < board[0].length; j++)\nTesting start position [${i}, ${j}]`, 3, { outerI: i, outerJ: j });
                
                // Backtrack engine
                const backtrack = (r: number, c: number, k: number) => {
                    if (steps.length > 2000) return false; // Hard limit to prevent browser crash
                    callStack.push(`backtrack(i=${r}, j=${c}, k=${k})`);
                    let currentDepth = callStack.length - 1;

                    add("Backtrack Entry", `private boolean backtrack(board, "${word}", ${r}, ${c}, ${k})`, 10, { callDepth: currentDepth, r, c, k, isCheckingBase: true });
                    
                    // Line 11: Base Case
                    add("Check Base Case", `if (k == word.length())\nIs k (${k}) == word length (${word.length})? (${k === word.length ? 'Yes' : 'No'})`, 11, { callDepth: currentDepth, r, c, k, isCheckingBase: true });
                    if (k === word.length) {
                        add("Word Found!", `return true;\nWe successfully matched every character!`, 11, { callDepth: currentDepth, r, c, k, isSuccess: true });
                        callStack.pop();
                        return true;
                    }

                    // Line 12: Bounds and Match Check
                    let outOfBounds = r < 0 || r >= rows || c < 0 || c >= cols;
                    let match = false;
                    let visited = false;
                    if (!outOfBounds) {
                        visited = board[r][c] === '#';
                        match = board[r][c] === word[k];
                    }

                    add("Check Bounds & Match", `if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != word.charAt(k))\nEvaluating cell [${r}, ${c}] against word[${k}] ('${word[k]}')`, 12, { callDepth: currentDepth, r, c, k, isCheckingBounds: true, outOfBounds, match, visited });

                    if (outOfBounds || !match || visited) {
                        let reason = outOfBounds ? "Out of bounds" : (visited ? "Already visited (#)" : `Mismatch: found '${board[r][c]}' instead of '${word[k]}'`);
                        add("Prune Branch", `return false;\n${reason}. Pruning this path.`, 12, { callDepth: currentDepth, r, c, k, isFailedPrune: true, failReason: reason, outOfBounds, match, visited });
                        callStack.pop();
                        return false;
                    }

                    // Line 14: Store Original Char
                    let temp = board[r][c];
                    add("Store Original Char", `char temp = board[i][j];\nStoring '${temp}' so we can restore it later.`, 14, { callDepth: currentDepth, r, c, k });
                    
                    // Line 15: Mark Visited
                    board[r][c] = '#';
                    path.push({r, c, k});
                    add("Mark Visited", `board[i][j] = '#';\nMarking cell [${r}, ${c}] as visited to prevent self-crossing.`, 15, { callDepth: currentDepth, r, c, k, hlMarkVisited: true });

                    // Line 17: Recurse Down
                    add("Recurse Down", `backtrack(board, word, i + 1, j, k + 1)\nTrying DOWN neighbor [${r + 1}, ${c}].`, 17, { callDepth: currentDepth, r, c, k, tryingDir: 'down' });
                    let found = backtrack(r + 1, c, k + 1);
                    
                    // Line 18: Recurse Up
                    if (!found) {
                        add("Recurse Up", `backtrack(board, word, i - 1, j, k + 1)\nDown failed. Trying UP neighbor [${r - 1}, ${c}].`, 18, { callDepth: currentDepth, r, c, k, tryingDir: 'up' });
                        found = backtrack(r - 1, c, k + 1);
                    }
                    // Line 19: Recurse Right
                    if (!found) {
                        add("Recurse Right", `backtrack(board, word, i, j + 1, k + 1)\nUp failed. Trying RIGHT neighbor [${r}, ${c + 1}].`, 19, { callDepth: currentDepth, r, c, k, tryingDir: 'right' });
                        found = backtrack(r, c + 1, k + 1);
                    }
                    // Line 20: Recurse Left
                    if (!found) {
                        add("Recurse Left", `backtrack(board, word, i, j - 1, k + 1)\nRight failed. Trying LEFT neighbor [${r}, ${c - 1}].`, 20, { callDepth: currentDepth, r, c, k, tryingDir: 'left' });
                        found = backtrack(r, c - 1, k + 1);
                    }

                    if (found) {
                        // If found, we bubble up true immediately, skipping restoration visualization for brevity of success state
                        callStack.pop();
                        return true;
                    }

                    // Line 22: Backtrack restoration
                    board[r][c] = temp;
                    path.pop();
                    add("Backtrack (Restore)", `board[i][j] = temp;\nAll directions failed. Restoring cell [${r}, ${c}] to '${temp}'.`, 22, { callDepth: currentDepth, r, c, k, hlRestore: true });

                    add("Return False", `return false;\nThis branch did not yield the word.`, 23, { callDepth: currentDepth, r, c, k });
                    callStack.pop();
                    return false;
                };

                add("Initiate Search", `if (backtrack(board, word, ${i}, ${j}, 0))\nCalling backtrack engine from [${i}, ${j}].`, 4, { outerI: i, outerJ: j });
                if (backtrack(i, j, 0)) {
                    globalFound = true;
                    add("Target Found!", `return true;\nWord "${word}" successfully found in the grid!`, 4, { isSuccess: true, finalAns: true, outerI: i, outerJ: j });
                }
            }
        }

        if (!globalFound) {
            add("Return False", `return false;\nSearched all cells. Word "${word}" does not exist in the grid.`, 7, { isSuccess: true, finalAns: false });
        }
    }

    return steps;
  }, [baseWord, selectedOpId]);

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
      if (st.board === undefined) return <span className="text-slate-400 italic">empty</span>;

      // Calculate grid dimensions
      const cellW = 60;
      const cellH = 60;
      const gap = 12;
      const totalW = st.cols * cellW + (st.cols - 1) * gap;
      const totalH = st.rows * cellH + (st.rows - 1) * gap;
      
      const getPos = (r: number, c: number) => {
          return {
              x: c * (cellW + gap) - totalW / 2 + cellW / 2,
              y: r * (cellH + gap) - totalH / 2 + cellH / 2
          };
      };

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6">
              
              {/* Top Section: Target Word */}
              <div className="flex flex-col w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4 items-center">
                  <div className="flex flex-col items-center w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><FileText size={12}/> Target Word</span>
                      
                      <div className="flex gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center relative">
                          {st.word.split('').map((char: string, idx: number) => {
                              let isHl = false;
                              let color = 'slate';
                              
                              if (st.k === idx) {
                                  isHl = true;
                                  color = 'amber';
                              } else if (st.path && st.path.some((p: any) => p.k === idx)) {
                                  color = 'emerald'; // Matched characters
                              }

                              if (st.isSuccess && st.finalAns === true) {
                                  color = 'emerald';
                                  isHl = true;
                              }

                              return (
                                  <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1' : 'scale-100 z-10 m-0.5'}`}>
                                      {st.k === idx && !st.isSuccess && (
                                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                              k={idx}
                                          </div>
                                      )}
                                      <NodeBlock val={char} themeColor={color} isTarget={isHl} compact={true}/>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* Grid Space Visualization */}
              <div className="relative w-full flex justify-center items-center mt-8" style={{ minHeight: totalH + 120 }}>
                  <div className="relative w-0 h-0">
                      
                      {/* Grid Edges (Path Snake) */}
                      <svg className="absolute overflow-visible z-0 pointer-events-none" style={{ left: 0, top: 0 }}>
                          {st.path && st.path.map((node: any, i: number) => {
                              if (i === 0) return null;
                              let prev = st.path[i - 1];
                              let p1 = getPos(prev.r, prev.c);
                              let p2 = getPos(node.r, node.c);

                              return <line key={`path-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" className="transition-all duration-500 animate-[dash_1s_linear_infinite] opacity-80"/>
                          })}

                          {/* Ghost Red Edge for Failed Match or OOB */}
                          {st.isFailedPrune && st.r !== undefined && st.c !== undefined && (
                              (() => {
                                  // If we have a path, draw from last path node to this failed one
                                  if (!st.path || st.path.length === 0) return null;
                                  let prev = st.path[st.path.length - 1];
                                  
                                  let p1 = getPos(prev.r, prev.c);
                                  let p2 = getPos(st.r, st.c);

                                  return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f43f5e" strokeWidth="4" strokeDasharray="6,6" strokeLinecap="round" className="transition-all duration-300 opacity-80"/>
                              })()
                          )}
                      </svg>

                      {/* Grid Cells */}
                      {st.board && st.board.map((row: string[], rIdx: number) => {
                          return row.map((val: string, cIdx: number) => {
                              let pos = getPos(rIdx, cIdx);
                              
                              let isActive = false;
                              let isVisited = val === '#';
                              let nodeTheme = isVisited ? 'slate' : 'slate';
                              let isDimmed = isVisited;
                              
                              // Is it in the current path?
                              if (st.path && st.path.some((p: any) => p.r === rIdx && p.c === cIdx)) {
                                  isActive = true;
                                  nodeTheme = 'sky';
                                  isDimmed = false;
                              }

                              // Is it the cell currently being evaluated?
                              if (st.r === rIdx && st.c === cIdx) {
                                  isActive = true;
                                  if (st.isFailedPrune) {
                                      nodeTheme = 'rose';
                                  } else if (st.isCheckingBounds) {
                                      nodeTheme = 'amber';
                                  } else {
                                      nodeTheme = 'sky';
                                  }
                                  isDimmed = false;
                              }

                              // Outer Loop targeting
                              if (st.outerI === rIdx && st.outerJ === cIdx && st.callDepth === undefined) {
                                  isActive = true;
                                  nodeTheme = 'indigo';
                              }

                              if (st.isSuccess && st.finalAns === true && st.path && st.path.some((p: any) => p.r === rIdx && p.c === cIdx)) {
                                  nodeTheme = 'emerald';
                                  isActive = true;
                              }

                              return (
                                  <div key={`cell-${rIdx}-${cIdx}`} className={`absolute transition-all duration-500 z-10 ${isActive ? 'z-20 scale-110' : ''}`} style={{ left: pos.x, top: pos.y, transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : 'scale(1)'}` }}>
                                      <NodeBlock val={val} r={rIdx} c={cIdx} themeColor={nodeTheme} isTarget={isActive} isDimmed={isDimmed} isDeleted={isVisited} compact={false}/>
                                  </div>
                              )
                          });
                      })}

                      {/* Ghost Red Node for Out of Bounds Check */}
                      {st.isFailedPrune && st.outOfBounds && (
                          (() => {
                              let pos = getPos(st.r, st.c);
                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}>
                                      <NodeBlock val={'X'} r={st.r} c={st.c} themeColor="rose" isTarget={true} compact={false}/>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                                          <XCircle size={10}/> Out of Bounds
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
                <Map className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Word Search</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'sky' ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      DFS on 2D Grid
                  </span>
                  <span>•</span>
                  <span>LeetCode 79</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'sky' ? 'text-sky-600' : 'text-emerald-600'}`}><Map size={28}/> Matrix Path Finding</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid.<br/><br/>
                      The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-sky-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: word = "ABCCED"</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           true (Follows the path A -&#62; B -&#62; C -&#62; C -&#62; E -&#62; D)
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">We are navigating a 2D space. The primary constraint is that we cannot reuse a cell in a single word path. We must also ensure we don't accidentally step outside the boundaries of the matrix during our 4-directional search.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-sky-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Use Depth-First Search (DFS) combined with Backtracking. When we land on a valid character, we temporarily alter the cell's character (e.g., to <code>'#'</code>) to mark it as visited. We then branch out up, down, left, and right. If the recursive calls return false, we restore the original character so other paths can potentially use it.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> WordSearch.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target Word</label>
                            <input type="text" maxLength={8} value={wordInput} onChange={(e) => setWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner uppercase font-bold`} placeholder="ABCCED" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">{st.finalAns ? `Successfully found "${st.word}" in the grid.` : `Searched entire grid. Word "${st.word}" does not exist.`}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isFailedPrune ? 'text-rose-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> 2D Grid Search State</span>
                       
                       {/* Call Stack Tracker with Scroll */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-sky-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-200 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-sky-100 pb-1 mb-1 shrink-0 sticky top-0 bg-white z-10">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-sky-600`}>Call Stack Depth</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering 2D Grid Backtracking and the mathematics of DFS state space.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-sky-500"/> 1. Backtracking on a Graph</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike a binary tree, a 2D grid is a graph where every cell is connected to up to 4 neighbors. When we execute Depth-First Search (DFS) on this grid, we must artificially enforce a "tree" structure by keeping track of where we have been.</p>
                        <p className="text-slate-600 leading-relaxed">By temporarily modifying the board (<code>board[i][j] = '#'</code>), we "cut off" the path behind us, preventing the search from entering an infinite loop of visiting the same two adjacent cells back and forth.</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(M * N * 3^L)</h4>
                        <p className="mb-4 text-slate-600">This is a highly specific mathematical proof that interviewers look for. Let M be rows, N be cols, and L be the length of the word.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Outer Loops:</strong> We must start a DFS from every single cell in the grid, taking O(M * N) time.</li>
                            <li><strong>DFS Branching Factor:</strong> At the very first step, we have 4 directions to explore. However, for every subsequent step, we only have <strong>3 directions</strong> (because one direction is the cell we just came from, which is marked as visited).</li>
                            <li><strong>Tree Depth:</strong> The maximum depth of the DFS tree is exactly L.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total Time Complexity = O(M &times; N &times; 3^L)
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-indigo-500"/> 3. Space Complexity Analysis: O(L)</h4>
                        <p className="mb-4 text-slate-600">Because we use the neat trick of modifying the board in-place, our space complexity is incredibly tight.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Auxiliary Space: O(L)</strong>
                                <span className="text-sm text-slate-600">We do not use a separate <code>visited</code> matrix (which would cost O(M * N)). The only extra space consumed is by the recursive Call Stack. The DFS goes as deep as the word length L before returning. Thus, memory is strictly O(L).</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Word Search heavily tests your ability to navigate 2D arrays safely. The most common pitfall is forgetting to 'un-mark' the visited cells when returning from a failed branch."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we modify the board to '#' and then change it back?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Modifying the board to '#' temporarily marks the cell as 'visited'. This is crucial to prevent the DFS from entering an infinite loop by moving back and forth between two adjacent matching characters.</p>
                            <p>We change it back (backtrack) because if the current DFS path fails to find the word, we must leave the board exactly as we found it. A different DFS path originating from a completely different cell later on might need to legally use this cell."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What is the trade-off of modifying the board in-place versus using a <code>boolean[][] visited</code> matrix?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Modifying the board in-place reduces our auxiliary space complexity from O(M * N) to O(L), making it highly memory efficient.</p>
                            <p>However, the major trade-off is <strong>Thread Safety</strong>. If this board was shared across multiple threads running parallel searches, modifying it in-place would cause catastrophic data races. In a real-world multi-threaded environment, allocating a separate <code>visited</code> matrix per thread is required."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Can you solve this using an Iterative BFS (Queue) instead of DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We theoretically could, but it is a terrible idea for this specific problem.</p>
                            <p>In BFS, the search expands radially. Because the 'visited' state is tied to the specific path being explored, a global visited matrix doesn't work. We would have to clone the entire <code>visited</code> set and attach it to <em>every single node</em> in the Queue. This would cause memory consumption to explode exponentially, yielding a massive O(M * N * 3^L) Space Complexity. DFS is the only viable approach here."</p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q4: "What if you were given a List of 10,000 words to find simultaneously? (Word Search II)"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If we ran this algorithm 10,000 times, it would be extremely slow.</p>
                            <p>To optimize for multiple words, I would use a <strong>Trie (Prefix Tree)</strong>. I would build a Trie containing all 10,000 words. Then, I would run DFS simultaneously across the board, moving a pointer down the Trie alongside the DFS. This allows us to instantly prune paths if the current sequence of letters on the board doesn't match any prefix in the Trie, searching for all words in a single collective pass."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.isFailedPrune ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target Word</label>
                              <input type="text" maxLength={8} value={wordInput} onChange={(e) => setWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold uppercase`} />
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Word Search Found</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Target Word</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">"{st.word}"</div>
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
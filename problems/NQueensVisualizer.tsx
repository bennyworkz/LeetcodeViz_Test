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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. O(1) Array Validation',
    icon: <HashIcon size={16} />,
    complexity: 'Time: O(N!) | Space: O(N)',
    code: `public int totalNQueens(int n) {
    boolean[] cols = new boolean[n];
    boolean[] d1 = new boolean[2 * n];
    boolean[] d2 = new boolean[2 * n];
    return dfs(0, cols, d1, d2, n);
}

private int dfs(int row, boolean[] cols, boolean[] d1, boolean[] d2, int n) {
    if (row == n) return 1;
    int count = 0;
    for (int col = 0; col < n; col++) {
        int id1 = row - col + n;
        int id2 = row + col;
        if (cols[col] || d1[id1] || d2[id2]) continue;
        
        cols[col] = true; d1[id1] = true; d2[id2] = true;
        count += dfs(row + 1, cols, d1, d2, n);
        cols[col] = false; d1[id1] = false; d2[id2] = false;
    }
    return count;
}`,
    desc: "The optimized N-Queens II approach. Because we only need the NUMBER of solutions, maintaining an N x N board is a waste of memory. More importantly, instead of scanning the board in O(N) time to check if a spot is safe, we use 3 boolean arrays. One tracks occupied columns, one tracks top-left to bottom-right diagonals (using row - col + n), and one tracks top-right to bottom-left diagonals (using row + col). Checking safety is now an instant O(1) array lookup."
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|totalNQueens|board|res|dfs|count|isValid|Arrays|cols|d1|d2|id1|id2|fill|ArrayList|List|length|i|j|r|c|row|col|n)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]])/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
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
            const isObject = ['String', 'List', 'ArrayList', 'Arrays'].includes(part);
            const isPointer = ['cols', 'd1', 'd2', 'id1', 'id2', 'count', 'row', 'col', 'n'].includes(part);
            const isMapCall = ['totalNQueens', 'dfs', 'length'].includes(part);
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

// --- Main Application ---

export default function NQueensVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [nInput, setNInput] = useState('4');
  
  const [baseN, setBaseN] = useState<number>(4);
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'indigo';

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = parseInt(nInput.trim(), 10);
      if (isNaN(parsed) || parsed < 1) parsed = 4;
      if (parsed > 5) parsed = 5; // Safety limit to prevent browser memory explosion
      
      setBaseN(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
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

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseN === 0) return [{ phase: 'Init', description: 'Enter valid N.', line: 1, state: {} }];

    const n = baseN;
    
    // Virtual board for rendering purposes (not used by the actual optimal logic)
    let virtualBoard: string[][] = Array(n).fill(null).map(() => Array(n).fill('.'));
    
    let colsArr = Array(n).fill(false);
    let d1Arr = Array(2 * n).fill(false);
    let d2Arr = Array(2 * n).fill(false);
    
    let callStack: string[] = [];
    let globalCount = 0;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            board: virtualBoard.map(r => [...r]), // Purely for visual intuition
            colsArr: [...colsArr],
            d1Arr: [...d1Arr],
            d2Arr: [...d2Arr],
            n,
            callStack: [...callStack],
            globalCount,
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public int totalNQueens(int n=${n})`, 1, {});
        add("Init Boolean Arrays", `boolean[] cols = new boolean[n];\nboolean[] d1 = new boolean[2 * n];\nboolean[] d2 = new boolean[2 * n];\nInitializing O(1) tracking arrays.`, 4, {});
        add("Initial DFS Call", `return dfs(0, cols, d1, d2, n);\nStarting recursion at row 0.`, 5, {});

        const dfs = (row: number) => {
            if (steps.length > 2500) return 0; // Hard limit to prevent browser crash
            callStack.push(`dfs(row=${row})`);
            let currentDepth = callStack.length - 1;

            add("DFS Entry", `private int dfs(int row, boolean[] cols, ...)`, 8, { callDepth: currentDepth, row });
            
            add("Check Base Case", `if (row == n)\nIs row (${row}) == ${n}? (${row === n ? 'Yes' : 'No'})`, 9, { callDepth: currentDepth, row, isCheckingBase: true });

            if (row === n) {
                globalCount++;
                add("Solution Found!", `return 1;\nSuccessfully placed ${n} Queens! Incrementing count.`, 9, { callDepth: currentDepth, row, isSuccess: true, globalCount });
                callStack.pop();
                return 1;
            }

            let localCount = 0;
            add("Init Count", `int count = 0;`, 10, { callDepth: currentDepth, row, localCount });

            for (let col = 0; col < n; col++) {
                add("For Loop (Columns)", `for (int col = ${col}; col < n; col++)\nTrying to place a Queen in row ${row}, column ${col}.`, 11, { callDepth: currentDepth, row, col, isEvaluatingFor: true, localCount });

                let id1 = row - col + n;
                let id2 = row + col;
                
                add("Calculate Diagonals", `int id1 = row - col + n;\nint id2 = row + col;\nDiagonal (\u2198) id1 = ${id1}. Anti-Diagonal (\u2197) id2 = ${id2}.`, 13, { callDepth: currentDepth, row, col, id1, id2, localCount });

                let isAttacked = colsArr[col] || d1Arr[id1] || d2Arr[id2];
                let failType = colsArr[col] ? 'Column' : (d1Arr[id1] ? 'Diagonal' : (d2Arr[id2] ? 'Anti-Diagonal' : ''));
                
                add("Validity Check", `if (cols[${col}] || d1[${id1}] || d2[${id2}]) continue;\nChecking O(1) tracking arrays... (${!isAttacked ? 'Safe' : 'Unsafe'})`, 14, { callDepth: currentDepth, row, col, id1, id2, isCheckingValid: true, validResult: !isAttacked, failType, localCount });

                if (!isAttacked) {
                    colsArr[col] = true;
                    d1Arr[id1] = true;
                    d2Arr[id2] = true;
                    virtualBoard[row][col] = 'Q';
                    add("Place Queen & Mark Arrays", `cols[col] = true; d1[id1] = true; d2[id2] = true;\nSafe spot! Marking tracking arrays to block attacks.`, 16, { callDepth: currentDepth, row, col, id1, id2, hlBoardUpdate: true, localCount });

                    add("Recursive Call", `count += dfs(${row + 1}, cols, d1, d2, n);\nMoving securely to the next row (${row + 1}).`, 17, { callDepth: currentDepth, row, col, id1, id2, localCount });
                    let subCount = dfs(row + 1);
                    localCount += subCount;

                    colsArr[col] = false;
                    d1Arr[id1] = false;
                    d2Arr[id2] = false;
                    virtualBoard[row][col] = '.';
                    add("Remove Queen & Unmark", `cols[col] = false; d1[id1] = false; d2[id2] = false;\nReturned from recursion. Unmarking tracking arrays to explore next column.`, 18, { callDepth: currentDepth, row, col, id1, id2, hlBoardRemove: true, localCount });
                } else {
                    add("Prune (Under Attack)", `continue;\nPosition [${row}, ${col}] is blocked by a ${failType} attack. Skipping.`, 14, { callDepth: currentDepth, row, col, id1, id2, isFailedPrune: true, failReason: failType, localCount });
                }
            }

            add("Return Count", `return count;\nReturning ${localCount} valid solutions found originating from this branch.`, 20, { callDepth: currentDepth, row, localCount });
            callStack.pop();
            return localCount;
        };

        dfs(0);

        add("Return Final Result", `return count;\nSearched all possibilities. Found exactly ${globalCount} solutions.`, 5, { isSuccess: true, finalAns: true });
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

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6">
              
              {/* Top Meta Data */}
              <div className="flex flex-col lg:flex-row items-center w-full max-w-2xl gap-8 pointer-events-auto">
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl flex-1 flex flex-col items-center justify-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Counter</span>
                       <span className="text-4xl font-black text-indigo-600 font-mono">{st.globalCount || 0}</span>
                  </div>
                  {st.localCount !== undefined && !st.isSuccess && (
                      <div className="bg-slate-800 p-4 rounded-3xl border border-slate-700 shadow-xl flex-1 flex flex-col items-center justify-center text-white">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Local Branch Count</span>
                           <span className="text-4xl font-black text-emerald-400 font-mono">{st.localCount}</span>
                      </div>
                  )}
              </div>

              {/* Chessboard Visualization */}
              <div className="flex flex-col items-center w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Grid size={12}/> Current Chessboard State</span>
                  
                  <div className="flex flex-col xl:flex-row items-start gap-8 relative">
                      {/* Array Trackers Side Panel */}
                      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-lg pointer-events-auto self-stretch w-full xl:w-48">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-100 pb-2">O(1) Memory Arrays</span>
                          
                          {/* Cols */}
                          <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">cols <span className="text-slate-300">boolean[{st.n}]</span></span>
                              <div className="flex gap-1 w-full h-4">
                                  {st.colsArr && st.colsArr.map((v: boolean, i: number) => (
                                      <div key={`c-${i}`} className={`flex-1 rounded-sm border ${v ? 'bg-rose-400 border-rose-500' : 'bg-slate-100 border-slate-200'} transition-colors duration-300 ${st.isCheckingValid && st.failType === 'Column' && st.col === i ? 'ring-2 ring-rose-500 ring-offset-1 animate-pulse' : ''} ${st.hlBoardUpdate && st.col === i ? 'bg-emerald-400 border-emerald-500 ring-2 ring-emerald-500 ring-offset-1' : ''}`}/>
                                  ))}
                              </div>
                          </div>

                          {/* D1 */}
                          <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">d1 (\) <span className="text-slate-300">boolean[{2*st.n}]</span></span>
                              <div className="flex gap-1 w-full h-4">
                                  {st.d1Arr && st.d1Arr.map((v: boolean, i: number) => (
                                      <div key={`d1-${i}`} className={`flex-1 rounded-sm border ${v ? 'bg-rose-400 border-rose-500' : 'bg-slate-100 border-slate-200'} transition-colors duration-300 ${st.isCheckingValid && st.failType === 'Diagonal' && st.id1 === i ? 'ring-2 ring-rose-500 ring-offset-1 animate-pulse' : ''} ${st.hlBoardUpdate && st.id1 === i ? 'bg-emerald-400 border-emerald-500 ring-2 ring-emerald-500 ring-offset-1' : ''}`}/>
                                  ))}
                              </div>
                          </div>

                          {/* D2 */}
                          <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">d2 (/) <span className="text-slate-300">boolean[{2*st.n}]</span></span>
                              <div className="flex gap-1 w-full h-4">
                                  {st.d2Arr && st.d2Arr.map((v: boolean, i: number) => (
                                      <div key={`d2-${i}`} className={`flex-1 rounded-sm border ${v ? 'bg-rose-400 border-rose-500' : 'bg-slate-100 border-slate-200'} transition-colors duration-300 ${st.isCheckingValid && st.failType === 'Anti-Diagonal' && st.id2 === i ? 'ring-2 ring-rose-500 ring-offset-1 animate-pulse' : ''} ${st.hlBoardUpdate && st.id2 === i ? 'bg-emerald-400 border-emerald-500 ring-2 ring-emerald-500 ring-offset-1' : ''}`}/>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* The Board */}
                      <div 
                          className="border-[6px] border-slate-800 rounded-lg shadow-2xl overflow-hidden bg-slate-800 relative transition-all duration-300 pointer-events-auto shrink-0"
                          style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${st.n}, minmax(0, 1fr))`
                          }}
                      >
                          {st.board.map((rowArr: string[], rIdx: number) => (
                              rowArr.map((val: string, cIdx: number) => {
                                  const isDark = (rIdx + cIdx) % 2 === 1;
                                  const bgClass = isDark ? 'bg-slate-300' : 'bg-slate-100';
                                  
                                  let isTarget = false;
                                  let isConflict = false;
                                  let isEvaluating = false;

                                  if (st.row === rIdx && st.col === cIdx) {
                                      isEvaluating = true;
                                      if (st.isFailedPrune || (st.isCheckingValid && !st.validResult)) {
                                          isConflict = true;
                                      } else {
                                          isTarget = true;
                                      }
                                  }

                                  // Determine visual conflict based on failType
                                  if (st.failType) {
                                      if (st.failType === 'Column' && cIdx === st.col && rIdx < st.row && val === 'Q') isConflict = true;
                                      if (st.failType === 'Diagonal' && (rIdx - cIdx + st.n === st.id1) && rIdx < st.row && val === 'Q') isConflict = true;
                                      if (st.failType === 'Anti-Diagonal' && (rIdx + cIdx === st.id2) && rIdx < st.row && val === 'Q') isConflict = true;
                                  }

                                  return (
                                      <div 
                                          key={`${rIdx}-${cIdx}`} 
                                          className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center relative transition-colors duration-300 ${bgClass} ${isConflict && val !== 'Q' ? 'bg-rose-200 ring-inset ring-4 ring-rose-500' : ''} ${isTarget && !isConflict ? 'bg-indigo-100 ring-inset ring-4 ring-indigo-500' : ''} ${isConflict && val === 'Q' ? 'ring-inset ring-4 ring-rose-500 bg-rose-200' : ''}`}
                                      >
                                          {val === 'Q' && (
                                              <Crown className={`w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 ${isConflict ? 'text-rose-600 scale-110 animate-pulse' : (st.hlBoardUpdate && st.row === rIdx && st.col === cIdx ? 'text-emerald-500 scale-125 animate-in zoom-in' : 'text-indigo-800')}`} strokeWidth={2.5}/>
                                          )}
                                          
                                          {/* Ghost Queen for invalid evaluation */}
                                          {isEvaluating && isConflict && val !== 'Q' && (
                                              <Crown className="w-8 h-8 md:w-10 md:h-10 text-rose-500 opacity-40 scale-110 animate-pulse" strokeWidth={2.5}/>
                                          )}
                                          
                                          {/* Evaluation highlight */}
                                          {isEvaluating && !isConflict && val !== 'Q' && (
                                              <div className="absolute inset-0 bg-indigo-500/20 animate-pulse pointer-events-none"></div>
                                          )}
                                          
                                          {/* Coordinates overlay (subtle) */}
                                          <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-400 opacity-50">{rIdx},{cIdx}</span>
                                      </div>
                                  )
                              })
                          ))}
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                <HashIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">N-Queens II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'indigo' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      O(1) Validation Array
                  </span>
                  <span>•</span>
                  <span>LeetCode 52</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`}><HashIcon size={28}/> The Counting Variant</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      The n-queens puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.<br/><br/>
                      Given an integer <code>n</code>, return <strong>the number of distinct solutions</strong> to the n-queens puzzle.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: n = 4</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           2
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">Since we only need the <strong>count</strong> of solutions rather than the actual board layouts, maintaining a massive $N \times N$ matrix is a waste of memory. More importantly, scanning the board in $O(N)$ time to check if a spot is safe becomes the main performance bottleneck.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-indigo-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We optimize validation to $O(1)$ constant time using three boolean arrays: <code>cols</code>, <code>d1</code>, and <code>d2</code>. Columns map directly <code>cols[col]</code>. Top-left to bottom-right diagonals share a constant difference <code>row - col</code>, so we map them as <code>row - col + n</code>. Top-right to bottom-left diagonals share a constant sum <code>row + col</code>.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> NQueensII.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Board Size (N) [Max 5]</label>
                            <input type="number" min="1" max="5" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner uppercase font-bold`} placeholder="4" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Counted exactly {st.globalCount} solutions.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isFailedPrune ? 'text-rose-400' : (st.hlAddResult ? 'text-emerald-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Call Stack</span>
                       
                       {/* Call Stack Tracker with Scroll */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-indigo-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-indigo-100 pb-1 mb-1 shrink-0 sticky top-0 bg-white z-10">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-indigo-600`}>Execution Depth</span>
                               </div>
                               <div className="flex flex-col gap-1">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <span key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between shrink-0 ${isTop ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
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

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-10" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding O(1) array mapping and the pure exponential nature of chess constraint validation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><HashIcon size={24} className="text-indigo-500"/> 1. The O(1) Mapping Magic</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of iterating over the board to check if a spot is safe, we map constraints directly to array indices.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Columns:</strong> <code>cols[col]</code> directly flags if a column is occupied.</li>
                            <li><strong>Main Diagonal (\):</strong> For any cell on a top-left to bottom-right diagonal, the value <code>row - col</code> is constant. To avoid negative indices, we add <code>N</code>. Thus, <code>d1[row - col + N]</code> protects an entire diagonal line.</li>
                            <li><strong>Anti-Diagonal (/):</strong> For any cell on a top-right to bottom-left diagonal, the value <code>row + col</code> is constant. Thus, <code>d2[row + col]</code> protects the anti-diagonal.</li>
                        </ul>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(N!)</h4>
                        <p className="mb-4 text-slate-600">The time complexity remains factorial, but the constant factor is vastly improved.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Tree Nodes:</strong> By placing one queen per row, the search space starts at $N!$.</li>
                            <li><strong>Validation Speed:</strong> In N-Queens I, checking safety took $O(N)$. Here, validation takes $O(1)$. This doesn't change the Big-O bound of $O(N!)$, but in real execution, it makes the algorithm significantly faster.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total Time Complexity = O(N!)
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(N)</h4>
                        <p className="mb-4 text-slate-600">This is the major improvement over N-Queens I.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Board Memory Removed: O(N)</strong>
                                <span className="text-sm text-slate-600">We no longer maintain an $N \times N$ character matrix in memory. We only maintain three boolean arrays of size $N$ and $2N$, which takes $O(N)$ memory.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">Call Stack: O(N)</strong>
                                <span className="text-sm text-slate-600">The recursive DFS stack goes exactly $N$ levels deep (one frame per row). Overall auxiliary space is therefore $O(N)$.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"N-Queens II is highly targeted in interviews to test your ability to aggressively optimize space and constant-time operations. The ultimate follow-up tests your knowledge of Bit Manipulation."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Explain exactly why <code>row - col</code> gives us the main diagonal."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If you move diagonally from top-left to bottom-right on a grid, you are increasing the row by 1 and increasing the column by 1 simultaneously.</p>
                            <p>Because they increase at the exact same rate, the mathematical difference between the row index and the column index (<code>row - col</code>) remains perfectly constant for every cell on that specific line. Adding <code>+ n</code> simply shifts this constant to ensure the array index is never negative."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "This is O(N) space. Can we optimize this even further to O(1) space?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can achieve $O(1)$ auxiliary space using <strong>Bitmasking</strong>.</p>
                            <p>Instead of three boolean arrays, we can use three integers: <code>int cols</code>, <code>int d1</code>, and <code>int d2</code>. Because $N$ is small (up to 9 in LeetCode constraints), a standard 32-bit integer is more than enough to track which columns and diagonals are occupied. We use bitwise OR (<code>|</code>) to mark them and bitwise AND (<code>&amp;</code>) to check them. This is the absolute fastest and most memory-efficient way to solve N-Queens."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Why is <code>count</code> a local variable that gets returned, instead of a global variable?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Using a global variable works, but using a local variable that bubbles up via the return statement is much cleaner and thread-safe.</p>
                            <p>By writing <code>count += dfs(...)</code>, the recursive function acts as a pure calculator for that specific subtree. It makes the code easier to test and prevents bugs that occur when a global state isn't properly reset between multiple executions of the function."</p>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-indigo-600 shadow-indigo-900/50`}><Code2 size={20}/></div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Board Size (N)</label>
                              <input type="number" min="1" max="5" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold uppercase`} />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.3)]`}>NEXT <ChevronRight size={32}/></button>
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
                                            <div key={idx} className={`font-mono text-sm font-black px-4 py-2 rounded-xl flex justify-between shrink-0 ${isTop ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-indigo-400'}`}>
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
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-20" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">N-Queens II Finished</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Solutions</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.globalCount} Boards</div>
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
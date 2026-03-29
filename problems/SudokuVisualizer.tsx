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
    title: '1. DFS Constraint Backtracking',
    icon: <Grid size={16} />,
    complexity: 'Time: O(9^(Empty Cells)) | Space: O(81)',
    code: `public void solveSudoku(char[][] board) {
    solve(board, 0, 0);
}

private boolean solve(char[][] board, int row, int col) {
    if (row == 9) return true;
    if (col == 9) return solve(board, row + 1, 0);
    if (board[row][col] != '.') return solve(board, row, col + 1);
    
    for (char c = '1'; c <= '9'; c++) {
        if (isValid(board, row, col, c)) {
            board[row][col] = c;
            if (solve(board, row, col + 1)) return true;
            board[row][col] = '.';
        }
    }
    return false;
}

private boolean isValid(char[][] board, int row, int col, char c) {
    for (int i = 0; i < 9; i++) {
        if (board[i][col] == c) return false;
        if (board[row][i] == c) return false;
        if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == c) return false;
    }
    return true;
}`,
    desc: "The Sudoku Solver Backtracking approach. We iterate through the 9x9 board cell by cell. We pass row and col coordinates to avoid rescanning the board from the beginning at every recursive step. If a cell is empty ('.'), we try placing digits '1' through '9'. Before placing, we check if the digit already exists in the current row, column, or 3x3 sub-box. If it's valid, we recurse. If the recursion hits a dead end, we backtrack by restoring the cell to '.'."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|solveSudoku|board|solve|isValid|row|col|c|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]])/g).filter(Boolean);
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
            const isPointer = ['board', 'row', 'col', 'c', 'i'].includes(part);
            const isMapCall = ['solveSudoku', 'solve', 'isValid'].includes(part);
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

export default function SudokuVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  // Provide a quick-solving board to ensure visualizer reaches success
  const [boardInput, setBoardInput] = useState(
    "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"
  );
  
  const [baseBoardStr, setBaseBoardStr] = useState<string>("53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79");
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
      let parsed = boardInput.replace(/[^1-9\.]/g, '');
      // Pad or truncate to exactly 81 characters
      if (parsed.length < 81) parsed = parsed.padEnd(81, '.');
      if (parsed.length > 81) parsed = parsed.substring(0, 81);
      
      setBaseBoardStr(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [boardInput, selectedOpId]);

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
    if (baseBoardStr.length !== 81) return [{ phase: 'Init', description: 'Enter valid 81 char board.', line: 1, state: {} }];

    let board: string[][] = Array(9).fill(null).map(() => Array(9).fill('.'));
    for (let i = 0; i < 81; i++) {
        board[Math.floor(i / 9)][i % 9] = baseBoardStr[i];
    }
    
    // Remember initial state to draw bold/dark cells vs blue guessed cells
    let initialBoard = board.map(r => [...r]);
    
    let callStack: string[] = [];

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            board: board.map(r => [...r]),
            initialBoard,
            callStack: [...callStack],
            ...st 
        } 
    });

    const checkValid = (b: string[][], r: number, c: number, char: string) => {
        for (let i = 0; i < 9; i++) {
            if (b[i][c] === char) return {valid: false, failType: 'Column', conflict: [i, c]};
            if (b[r][i] === char) return {valid: false, failType: 'Row', conflict: [r, i]};
            let boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3);
            let boxC = 3 * Math.floor(c / 3) + (i % 3);
            if (b[boxR][boxC] === char) return {valid: false, failType: '3x3 Box', conflict: [boxR, boxC]};
        }
        return {valid: true};
    };

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public void solveSudoku(char[][] board)`, 1, {});
        add("Initial DFS Call", `solve(board, 0, 0);\nStarting recursion at cell [0, 0].`, 2, {});

        const solve = (row: number, col: number) => {
            if (steps.length > 2500) return false; // Hard limit to prevent browser crash
            callStack.push(`solve(r=${row}, c=${col})`);
            let currentDepth = callStack.length - 1;

            add("DFS Entry", `private boolean solve(char[][] board, int row, int col)`, 5, { callDepth: currentDepth, row, col });
            
            // Line 6
            add("Check Row Bound", `if (row == 9) return true;\nDid we complete all 9 rows? (${row === 9 ? 'Yes' : 'No'})`, 6, { callDepth: currentDepth, row, col });
            if (row === 9) {
                add("Puzzle Solved!", `return true;\nReached beyond the last row! Board is fully solved.`, 6, { callDepth: currentDepth, row, col, isSuccess: true });
                callStack.pop();
                return true;
            }

            // Line 7
            add("Check Col Bound", `if (col == 9) return solve(board, row + 1, 0);\nDid we reach the end of the row? (${col === 9 ? 'Yes' : 'No'})`, 7, { callDepth: currentDepth, row, col });
            if (col === 9) {
                let res = solve(row + 1, 0);
                callStack.pop();
                return res;
            }

            // Line 8
            let isFilled = board[row][col] !== '.';
            add("Check Empty", `if (board[row][col] != '.') return solve(board, row, col + 1);\nIs cell [${row}, ${col}] already filled? (${isFilled ? 'Yes' : 'No'})`, 8, { callDepth: currentDepth, row, col, isCheckingFilled: true });
            
            if (isFilled) {
                add("Skip Filled Cell", `return solve(board, row, col + 1);\nCell is pre-filled with '${board[row][col]}'. Moving to next column.`, 8, { callDepth: currentDepth, row, col });
                let res = solve(row, col + 1);
                callStack.pop();
                return res;
            }

            // Line 10-16
            for (let num = 1; num <= 9; num++) {
                let cStr = num.toString();
                add("For Loop (Digits)", `for (char c = '1'; c <= '9'; c++)\nTrying to place digit '${cStr}' in empty cell [${row}, ${col}].`, 10, { callDepth: currentDepth, row, col, activeChar: cStr });

                let validation = checkValid(board, row, col, cStr);
                add("Validity Check", `if (isValid(board, ${row}, ${col}, '${cStr}'))\nChecking if '${cStr}' exists in the same row, col, or 3x3 box... (${validation.valid ? 'Safe' : 'Conflict'})`, 11, { callDepth: currentDepth, row, col, activeChar: cStr, isCheckingValid: true, validResult: validation.valid, conflict: validation.conflict, failType: validation.failType });

                if (validation.valid) {
                    board[row][col] = cStr;
                    add("Place Digit", `board[${row}][${col}] = '${cStr}';\nSafe spot! Placing digit.`, 12, { callDepth: currentDepth, row, col, activeChar: cStr, hlBoardUpdate: true });

                    add("Recursive Call", `if (solve(board, ${row}, ${col + 1})) return true;\nMoving to the next cell.`, 13, { callDepth: currentDepth, row, col, activeChar: cStr });
                    let found = solve(row, col + 1);
                    
                    if (found) {
                        callStack.pop();
                        return true;
                    }

                    board[row][col] = '.';
                    add("Remove Digit (Backtrack)", `board[${row}][${col}] = '.';\nReturned false from recursion. Removing '${cStr}' to try the next digit.`, 14, { callDepth: currentDepth, row, col, activeChar: cStr, hlBoardRemove: true });
                } else {
                    add("Prune (Invalid)", `// Implicit Prune\nDigit '${cStr}' conflicts with a ${validation.failType} cell at [${validation.conflict![0]}, ${validation.conflict![1]}]. Skipping.`, 11, { callDepth: currentDepth, row, col, activeChar: cStr, isFailedPrune: true, conflict: validation.conflict, failType: validation.failType });
                }
            }

            add("Return False", `return false;\nExhausted all digits 1-9. None worked! Backtracking to previous cell.`, 17, { callDepth: currentDepth, row, col });
            callStack.pop();
            return false;
        };

        let result = solve(0, 0);

        if (!result) {
            add("Return Final Result", `// Failed to solve\nThis Sudoku puzzle has no valid solution.`, 3, { isSuccess: true, finalAns: false });
        }
    }

    return steps;
  }, [baseBoardStr, selectedOpId]);

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
              
              {/* Sudoku Grid Visualization */}
              <div className="flex flex-col items-center w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Grid size={12}/> Current Board State</span>
                  
                  <div 
                      className="border-[6px] border-slate-800 bg-slate-800 rounded-lg shadow-2xl relative transition-all duration-300"
                      style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(9, minmax(0, 1fr))`,
                          gap: '2px' // Thin gap for cells
                      }}
                  >
                      {st.board.map((rowArr: string[], rIdx: number) => (
                          rowArr.map((val: string, cIdx: number) => {
                              
                              // Determine thick borders for 3x3 boxes
                              const borderRight = (cIdx === 2 || cIdx === 5) ? 'border-r-4 border-r-slate-800' : '';
                              const borderBottom = (rIdx === 2 || rIdx === 5) ? 'border-b-4 border-b-slate-800' : '';
                              
                              let isTarget = false;
                              let isConflict = false;
                              let isEvaluating = false;

                              if (st.row === rIdx && st.col === cIdx) {
                                  isEvaluating = true;
                                  if (st.isFailedPrune || (st.isCheckingValid && !st.validResult)) {
                                      isConflict = true; // The cell being tested failed
                                  } else {
                                      isTarget = true;
                                  }
                              }

                              if (st.conflict && st.conflict[0] === rIdx && st.conflict[1] === cIdx) {
                                  isConflict = true; // The existing cell causing the conflict
                              }

                              const isInitial = st.initialBoard && st.initialBoard[rIdx][cIdx] !== '.';
                              const displayChar = val !== '.' ? val : (isEvaluating && st.activeChar && !isConflict ? st.activeChar : '');

                              return (
                                  <div 
                                      key={`${rIdx}-${cIdx}`} 
                                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative transition-colors duration-300 bg-white ${borderRight} ${borderBottom} ${isConflict ? 'bg-rose-200' : ''} ${isTarget && !isConflict ? 'bg-amber-100 ring-inset ring-4 ring-amber-400 z-10' : ''} ${st.hlBoardUpdate && st.row === rIdx && st.col === cIdx ? 'bg-emerald-100 ring-inset ring-4 ring-emerald-400 z-10 animate-in zoom-in' : ''}`}
                                  >
                                      {/* Conflict pulsing border on the attacking cell */}
                                      {isConflict && val !== '.' && !isEvaluating && (
                                          <div className="absolute inset-0 ring-inset ring-4 ring-rose-500 animate-pulse z-10"></div>
                                      )}

                                      {/* Text value */}
                                      <span className={`font-mono text-2xl md:text-3xl ${isInitial ? 'font-black text-slate-800' : 'font-bold text-sky-600'} ${isConflict && isEvaluating ? 'text-rose-500 opacity-50 line-through scale-90' : ''}`}>
                                          {displayChar}
                                      </span>
                                      
                                      {/* Coordinates overlay (subtle) */}
                                      {/* <span className="absolute bottom-0 right-0.5 text-[6px] font-mono text-slate-300 opacity-40">{rIdx},{cIdx}</span> */}
                                  </div>
                              )
                          })
                      ))}
                      
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
                <Grid className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Sudoku Solver</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'sky' ? 'text-sky-600 bg-sky-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      DFS Constraint Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 37</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'sky' ? 'text-sky-600' : 'text-emerald-600'}`}><Grid size={28}/> 2D Constraint Satisfaction</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Write a program to solve a Sudoku puzzle by filling the empty cells.<br/><br/>
                      A sudoku solution must satisfy all of the following rules:
                      <ul className="list-disc pl-6 mt-2 text-base">
                          <li>Each of the digits <code>1-9</code> must occur exactly once in each row.</li>
                          <li>Each of the digits <code>1-9</code> must occur exactly once in each column.</li>
                          <li>Each of the digits <code>1-9</code> must occur exactly once in each of the 9 <code>3x3</code> sub-boxes of the grid.</li>
                      </ul>
                      The <code>'.'</code> character indicates empty cells.
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">The board is strictly $9 \times 9$. The search space if we blindly tried combinations is astronomical ($9^{81}$). We must use an aggressive backtracking algorithm that instantly prunes branches the moment a Sudoku rule is violated.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-sky-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Iterate through the board. Keep track of coordinates <code>(row, col)</code>. If the cell is empty, try placing digits '1' to '9'. Write an <code>isValid</code> function that checks the row, column, and the local $3 \times 3$ box. If valid, place the digit, recurse to <code>col+1</code>, and backtrack if the recursion fails.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> SudokuSolver.java</span>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>81-Character Board Input</label>
                            <input type="text" maxLength={81} value={boardInput} onChange={(e) => setBoardInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="53..7....6..195....98....6..." />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> BOARD SOLVED</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully filled all cells following Sudoku rules.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isFailedPrune ? 'text-rose-400' : (st.hlBoardUpdate ? 'text-emerald-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Layers size={14} className={`text-${themeColor}-500`}/> Call Stack</span>
                       
                       {/* Call Stack Tracker with Scroll */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-sky-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-200 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-sky-100 pb-1 mb-1 shrink-0 sticky top-0 bg-white z-10">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-sky-600`}>Execution Depth</span>
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

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the pure exponential nature of NP-Complete constraint resolution.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-sky-500"/> 1. The Decision Space Bound</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Sudoku is mathematically known to be an NP-complete problem when generalized to an N x N grid. For the classic 9x9 grid, there are exactly 81 cells.</p>
                        <p className="text-slate-600 leading-relaxed">If we blindly tried placing digits 1-9 in every empty cell, the theoretical upper bound of combinations would be 9^81. This number is astronomically huge. The only way computers can solve this in milliseconds is via strict Backtracking that prunes branches the instant a single rule is violated.</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(9^(Empty Cells))</h4>
                        <p className="mb-4 text-slate-600">The time complexity is purely exponential based on the number of empty cells.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Branching Factor:</strong> At each empty cell, the algorithm branches out up to 9 ways.</li>
                            <li><strong>Tree Depth:</strong> The maximum depth of the recursion tree is exactly the number of empty cells on the board (since we fill one cell per recursive step).</li>
                            <li><strong>Pruning:</strong> While the worst-case bound is $O(9^E)$ where $E$ is empty cells, the aggressive <code>isValid</code> checks prune the vast majority of these branches immediately.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total Time Complexity = O(9^m) where m is empty cells.
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(1) or O(81)</h4>
                        <p className="mb-4 text-slate-600">Because the board size is strictly fixed at 9x9, the space complexity is technically constant.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Board Memory: O(81) -&gt; O(1)</strong>
                                <span className="text-sm text-slate-600">We modify the provided 9x9 character matrix in place, so no extra boards are allocated.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">Call Stack: O(81) -&gt; O(1)</strong>
                                <span className="text-sm text-slate-600">The recursive DFS stack goes as deep as the number of empty cells, which is at most 81. Thus auxiliary space is strictly bounded by a constant.</span>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Sudoku Solver tests your ability to map 2D coordinates into 1D logic (the 3x3 box math) and how to manage true/false return values in DFS to halt execution immediately once a global solution is found."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Explain the math behind <code>board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3]</code>."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This formula isolates checking the local 3x3 sub-box using a single loop variable <code>i</code> from 0 to 8.</p>
                            <p><code>(row / 3)</code> and <code>(col / 3)</code> determine which of the 9 major sub-boxes we are in (e.g., box [0,0] or [1,2]). Multiplying by 3 gives the absolute starting row/col index of that top-left corner of the box.</p>
                            <p>Then, as <code>i</code> iterates from 0 to 8, <code>i / 3</code> generates row offsets (0,0,0, 1,1,1, 2,2,2) and <code>i % 3</code> generates column offsets (0,1,2, 0,1,2, 0,1,2). Adding these together maps the 1D loop precisely across the 2D 3x3 box."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why does the <code>solve</code> function return a boolean instead of void?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we only want to find ONE valid solution. If it were <code>void</code>, the algorithm would find the solution, hit the base case, and then immediately start backtracking, erasing the solved board.</p>
                            <p>By returning a boolean, the moment the base case returns <code>true</code>, every parent recursive call sees <code>if (solve(...)) return true;</code> and cascades that <code>true</code> all the way up the stack, instantly halting the algorithm and freezing the board in its solved state."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-indigo-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "If you had to make this even faster, how would you optimize it? Have you heard of Dancing Links?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The current <code>isValid</code> function takes $O(9)$ time. We can optimize this to $O(1)$ by using three 2D boolean arrays (or Bitmasks): <code>row[9][9]</code>, <code>col[9][9]</code>, and <code>box[9][9]</code> to instantly check if a digit is used.</p>
                            <p>For the ultimate optimization, Sudoku is an Exact Cover problem. Donald Knuth's <strong>Algorithm X</strong> implemented via <strong>Dancing Links (DLX)</strong> converts the board into a massive sparse matrix. It uses a circular doubly-linked list to achieve insanely fast backtracking, traversing and pruning constraints in truly $O(1)$ pointer operations. DLX is considered the gold standard for writing ultra-fast Sudoku solvers."</p>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Board Input</label>
                              <input type="text" maxLength={81} value={boardInput} onChange={(e) => setBoardInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold uppercase`} />
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Sudoku Board Solved</p>
                                
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
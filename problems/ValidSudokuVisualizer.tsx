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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  booleanArrays: {
    id: 'booleanArrays',
    title: '1. Array of Arrays (Optimal)',
    icon: <Grid3x3 size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    code: `public boolean isValidSudoku(char[][] board) {
    boolean[][] rows = new boolean[9][9];
    boolean[][] cols = new boolean[9][9];
    boolean[][] boxes = new boolean[9][9];

    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == '.') continue;
            
            int num = board[r][c] - '1'; // 0-indexed
            int boxIdx = (r / 3) * 3 + (c / 3);
            
            // Check if already seen
            if (rows[r][num] || cols[c][num] || boxes[boxIdx][num]) {
                return false;
            }
            
            // Mark as seen
            rows[r][num] = true;
            cols[c][num] = true;
            boxes[boxIdx][num] = true;
        }
    }
    return true;
}`,
    desc: "The most optimized approach. We use three 2D boolean arrays to track which numbers have been seen in which row, column, and 3x3 box. Finding the correct 3x3 box uses the formula (r/3)*3 + (c/3)."
  },
  hashSetString: {
    id: 'hashSetString',
    title: '2. HashSet Strings (Intuitive)',
    icon: <Hash size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    code: `public boolean isValidSudoku(char[][] board) {
    Set<String> seen = new HashSet<>();
    
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char val = board[r][c];
            
            if (val != '.') {
                // Set.add() returns false if item already exists
                if (!seen.add(val + " in row " + r) ||
                    !seen.add(val + " in col " + c) ||
                    !seen.add(val + " in box " + r/3 + "-" + c/3)) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
    desc: "A highly readable 1-pass solution. We encode the constraints into descriptive strings (e.g., '5 in row 0'). Since a HashSet rejects duplicate items, if add() returns false, it means we've seen this number in this specific row/col/box before."
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
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|char|Set|HashSet|String)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-cyan-500/20`, border: `border-cyan-400`, text: `text-cyan-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-cyan-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'char'].includes(part);
            const isObject = ['Set', 'HashSet', 'String'].includes(part);
            const isVar = ['board', 'rows', 'cols', 'boxes', 'r', 'c', 'num', 'boxIdx', 'val', 'seen'].includes(part);
            const isMapCall = ['add'].includes(part);
            const isStringOrChar = (part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"));

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-sky-400 font-bold';
            else if (isVar) className = 'text-cyan-200';
            else if (isMapCall) className = 'text-amber-400';
            else if (isStringOrChar || !isNaN(parseInt(part))) className = 'text-emerald-400';

            return (
              <span key={i} className={className}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function ValidSudokuVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('booleanArrays');
  
  const defaultBoard = [
    "5,3,.,.,7,.,.,.,.",
    "6,.,.,1,9,5,.,.,.",
    ".,9,8,.,.,.,.,6,.",
    "8,.,.,.,6,.,.,.,3",
    "4,.,.,8,.,3,.,.,1",
    "7,.,.,.,2,.,.,.,6",
    ".,6,.,.,.,.,2,8,.",
    ".,.,.,4,1,9,.,.,5",
    ".,.,.,.,8,.,.,7,9"
  ].join('\n');

  const [inputString, setInputString] = useState(defaultBoard);
  const [baseGrid, setBaseGrid] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
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

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
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

  const parseInput = (str) => {
      const lines = str.trim().split('\n');
      const grid = Array(9).fill(null).map(() => Array(9).fill('.'));
      for(let r=0; r<Math.min(9, lines.length); r++) {
          const cells = lines[r].split(',').map(s=>s.trim());
          for(let c=0; c<Math.min(9, cells.length); c++) {
              if (cells[c] && cells[c].match(/^[1-9]$/)) {
                  grid[r][c] = cells[c];
              } else {
                  grid[r][c] = '.';
              }
          }
      }
      return grid;
  };

  useEffect(() => {
    const grid = parseInput(inputString);
    setBaseGrid(grid);
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputString, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (!baseGrid || baseGrid.length !== 9) return [{ phase: 'Init', description: 'Enter valid 9x9 Grid.', line: 0, state: { grid: [] } }];
    
    // Deep copy grid
    let grid = baseGrid.map(row => [...row]);

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            grid: grid.map(row => [...row]),
            ...st 
        } 
    });

    if (selectedOpId === 'booleanArrays') {
        let rows = Array(9).fill(null).map(() => Array(9).fill(false));
        let cols = Array(9).fill(null).map(() => Array(9).fill(false));
        let boxes = Array(9).fill(null).map(() => Array(9).fill(false));
        
        // Deep copy helpers for state
        const copyArr = (arr) => arr.map(r => [...r]);
        
        add("Initialize Arrays", "Allocated 3 boolean matrices (rows, cols, boxes) of size 9x9.", 2, { rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });

        let isInvalid = false;

        outerLoop:
        for (let r = 0; r < 9; r++) {
            add("Row Loop", `Entering row ${r}.`, 6, { r, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });
            
            for (let c = 0; c < 9; c++) {
                add("Col Loop", `Checking cell at [${r}][${c}].`, 7, { r, c, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });
                
                add("Condition Check", `if (board[${r}][${c}] == '.') -> Is the cell empty?`, 8, { r, c, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });

                if (grid[r][c] === '.') {
                    add("Skip Empty", `Cell is empty ('.'). Continuing to next column.`, 8, { r, c, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });
                    continue;
                }
                
                let val = grid[r][c];
                let num = parseInt(val) - 1; // 0-indexed
                add("Parse Number", `Extract number ${val}. 0-indexed value is ${num}.`, 10, { r, c, val, num, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });
                
                let boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                add("Calculate Box Index", `(r/3)*3 + (c/3) = (${r}/3)*3 + (${c}/3) = Box ${boxIdx}.`, 11, { r, c, val, num, boxIdx, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });

                add("Check Constraints", `if (rows[${r}][${num}] || cols[${c}][${num}] || boxes[${boxIdx}][${num}])`, 14, { r, c, val, num, boxIdx, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes), checking: true });

                if (rows[r][num] || cols[c][num] || boxes[boxIdx][num]) {
                    let failReason = rows[r][num] ? 'Row' : cols[c][num] ? 'Column' : 'Box';
                    add("Invalid Board!", `Conflict! The number ${val} was already seen in this ${failReason}. Returning false.`, 15, { r, c, val, num, boxIdx, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes), isFail: true, failReason });
                    isInvalid = true;
                    break outerLoop;
                }
                
                rows[r][num] = true;
                add("Mark Row Seen", `rows[${r}][${num}] = true;`, 19, { r, c, val, num, boxIdx, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });
                
                cols[c][num] = true;
                add("Mark Col Seen", `cols[${c}][${num}] = true;`, 20, { r, c, val, num, boxIdx, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes) });
                
                boxes[boxIdx][num] = true;
                add("Mark Box Seen", `boxes[${boxIdx}][${num}] = true;`, 21, { r, c, val, num, boxIdx, rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes), justAdded: {r, c, boxIdx, num} });
            }
        }

        if (!isInvalid) {
            add("Return Result", `Loops finished. No conflicts found. Return true.`, 24, { rows: copyArr(rows), cols: copyArr(cols), boxes: copyArr(boxes), isSuccess: true });
        }

    } else if (selectedOpId === 'hashSetString') {
        let seen = new Set();
        
        add("Initialize Set", "Set<String> seen = new HashSet<>();", 2, { seen: Array.from(seen) });

        let isInvalid = false;

        outerLoop:
        for (let r = 0; r < 9; r++) {
            add("Row Loop", `Entering row ${r}.`, 4, { r, seen: Array.from(seen) });
            for (let c = 0; c < 9; c++) {
                add("Col Loop", `Checking cell at [${r}][${c}].`, 5, { r, c, seen: Array.from(seen) });
                
                let val = grid[r][c];
                add("Read Value", `char val = board[${r}][${c}]; // Result: '${val}'`, 6, { r, c, val, seen: Array.from(seen) });

                add("Condition Check", `if ('${val}' != '.') -> Is it filled?`, 8, { r, c, val, seen: Array.from(seen) });
                
                if (val !== '.') {
                    let rStr = `${val} in row ${r}`;
                    let cStr = `${val} in col ${c}`;
                    let bStr = `${val} in box ${Math.floor(r/3)}-${Math.floor(c/3)}`;
                    
                    add("Verify Add to Set", `Attempting to add strings to the Set. Will fail if already present.`, 10, { r, c, val, rStr, cStr, bStr, seen: Array.from(seen), checking: true });

                    if (seen.has(rStr) || seen.has(cStr) || seen.has(bStr)) {
                        let failReason = seen.has(rStr) ? rStr : seen.has(cStr) ? cStr : bStr;
                        add("Invalid Board!", `Conflict! Set.add() returned false for "${failReason}". Returning false.`, 13, { r, c, val, seen: Array.from(seen), isFail: true, failReason });
                        isInvalid = true;
                        break outerLoop;
                    }
                    
                    seen.add(rStr);
                    seen.add(cStr);
                    seen.add(bStr);
                    
                    add("Strings Added", `Strings successfully added to the HashSet footprint.`, 15, { r, c, val, rStr, cStr, bStr, seen: Array.from(seen), justAddedStrs: [rStr, cStr, bStr] });
                } else {
                     add("Skip Empty", `Cell is empty. Skipping inner logic.`, 15, { r, c, val, seen: Array.from(seen) });
                }
            }
        }

        if (!isInvalid) {
             add("Return Result", `Loops finished. No conflicts found. Return true.`, 18, { seen: Array.from(seen), isSuccess: true });
        }
    }

    return steps;
  }, [baseGrid, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { grid: [] } };
  const st = curStepData.state || { grid: [] };
  const isLastStep = currentStep === trace.length - 1;

  // Board Rendering Helpers
  const renderCell = (r, c, val) => {
      const isCurrent = st.r === r && st.c === c;
      
      // Determine if cell is part of current checking boundary
      let isHighlightedCol = st.c === c && st.r !== undefined;
      let isHighlightedRow = st.r === r && st.c !== undefined;
      let isHighlightedBox = false;
      
      if (st.r !== undefined && st.c !== undefined) {
          const currentBoxR = Math.floor(st.r / 3);
          const currentBoxC = Math.floor(st.c / 3);
          if (Math.floor(r / 3) === currentBoxR && Math.floor(c / 3) === currentBoxC) {
              isHighlightedBox = true;
          }
      }

      const isFailCell = st.isFail && isCurrent;
      
      let bgClass = 'bg-white';
      if (isFailCell) bgClass = 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] z-20 scale-110 border-rose-600 font-black';
      else if (isCurrent) bgClass = 'bg-amber-400 text-amber-950 shadow-lg z-10 scale-105 border-amber-500 font-black';
      else if (isHighlightedRow || isHighlightedCol || isHighlightedBox) bgClass = 'bg-cyan-100/50 text-cyan-900 border-cyan-200';
      else if (val !== '.') bgClass = 'bg-slate-50 text-slate-700 font-bold';

      const borderR = c % 3 === 2 && c !== 8 ? 'border-r-slate-800 border-r-[3px]' : 'border-r-slate-200';
      const borderB = r % 3 === 2 && r !== 8 ? 'border-b-slate-800 border-b-[3px]' : 'border-b-slate-200';

      return (
          <div key={`${r}-${c}`} className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center border-t border-l transition-all duration-300 ${borderR} ${borderB} ${bgClass}`}>
              <span className="font-mono text-lg md:text-xl pointer-events-none">{val !== '.' ? val : ''}</span>
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Grid3x3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Valid Sudoku</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
                      LC 36 • Array & Hashing
                  </span>
                  <span>•</span>
                  <span>Matrix Validation</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-cyan-600 font-black text-2xl uppercase tracking-tighter"><LayoutGrid size={28}/> The Rule of 9</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Determine if a <code>9 x 9</code> Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium ml-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <li>Each row must contain the digits <code>1-9</code> without repetition.</li>
                        <li>Each column must contain the digits <code>1-9</code> without repetition.</li>
                        <li>Each of the nine <code>3 x 3</code> sub-boxes of the grid must contain the digits <code>1-9</code> without repetition.</li>
                    </ul>
                    <p className="text-sm text-slate-500 italic">Note: A Sudoku board (partially filled) could be valid but is not necessarily solvable. Only the filled cells need to be validated.</p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Goal</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Iterate through the matrix exactly once. For every number we see, immediately check if we have already seen it in its specific Row, Column, or Sub-box. If we have, the board is invalid.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Grid3x3 size={16} className="text-amber-500"/> The Sub-Box Math</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Rows and Columns are easy (indices 0-8). But how do we uniquely identify which 3x3 block a cell <code>(r, c)</code> belongs to? The magic formula is <code>(r / 3) * 3 + (c / 3)</code>.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-cyan-600 text-white border-cyan-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-cyan-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1 flex justify-between">
                                <span>Input 9x9 Board (CSV rows)</span>
                            </label>
                            <textarea 
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-[10px] sm:text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner h-[80px] resize-none whitespace-pre overflow-auto scrollbar-thin" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center h-[80px] pb-1">
                            <div className="hidden lg:flex items-center gap-1.5 mr-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <Keyboard size={14} />
                                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Use &larr; &rarr;</span>
                            </div>
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep} className={`px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : st.isFail ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Board Valid</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isFail ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><AlertOctagon size={20}/> Board Invalid</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[460px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-cyan-500"/> Memory & Matrix</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Flex Layout prevents Overlap */}
                           <div className="p-12 pt-20 flex flex-col xl:flex-row items-start gap-12 xl:gap-16 min-w-max">
                               {/* Left Side: Sudoku Board Rendering */}
                               <div className="border-4 border-slate-800 bg-slate-800 rounded shadow-2xl overflow-hidden shrink-0">
                                   <div className="grid grid-cols-9 bg-slate-200 gap-px">
                                       {(st.grid || []).map((row, r) =>
                                           row.map((val, c) => renderCell(r, c, val))
                                       )}
                                   </div>
                               </div>

                               {/* Right Side: State Trackers */}
                               <div className="flex flex-col gap-4 w-[350px] shrink-0">
                                   {selectedOpId === 'hashSetString' && st.seen && (
                                       <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col h-full max-h-[350px]">
                                           <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2 border-b border-slate-700 pb-2">
                                               <Database size={14} className="text-emerald-400"/> HashSet Strings
                                           </div>
                                           <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-600 pr-2 flex flex-col gap-1.5">
                                               {st.seen.length === 0 && <span className="text-xs italic text-slate-500 font-mono">Set is empty</span>}
                                               {[...st.seen].reverse().map((str, idx) => {
                                                   const isNew = st.justAddedStrs && st.justAddedStrs.includes(str);
                                                   const isFail = st.isFail && st.failReason === str;
                                                   let bgClass = 'bg-slate-700 text-slate-300 border-slate-600';
                                                   if (isFail) bgClass = 'bg-rose-900 text-rose-100 border-rose-500 animate-pulse';
                                                   else if (isNew) bgClass = 'bg-emerald-900 text-emerald-100 border-emerald-500 animate-in slide-in-from-right-4';
                                                   return (
                                                       <div key={idx} className={`font-mono text-[10px] px-2 py-1 rounded border shadow-sm ${bgClass}`}>
                                                           "{str}"
                                                       </div>
                                                   )
                                               })}
                                           </div>
                                       </div>
                                   )}

                                   {selectedOpId === 'booleanArrays' && st.rows && (
                                       <div className="flex flex-col gap-3 h-full w-full">
                                           {/* Rows Tracker */}
                                           <div className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-sm flex flex-col">
                                               <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-1"><Grid3x3 size={12} className="text-cyan-500"/> rows[][] Tracking</div>
                                               <div className="flex flex-wrap gap-1">
                                                   {st.r !== undefined && (
                                                       <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold w-full truncate">
                                                           Row {st.r}: [ {st.rows[st.r].map((b, i) => b ? (i+1) : '').filter(Boolean).join(', ')} ]
                                                       </div>
                                                   )}
                                               </div>
                                           </div>

                                           {/* Cols Tracker */}
                                           <div className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-sm flex flex-col">
                                               <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-1"><Grid3x3 size={12} className="text-cyan-500"/> cols[][] Tracking</div>
                                               <div className="flex flex-wrap gap-1">
                                                   {st.c !== undefined && (
                                                       <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold w-full truncate">
                                                           Col {st.c}: [ {st.cols[st.c].map((b, i) => b ? (i+1) : '').filter(Boolean).join(', ')} ]
                                                       </div>
                                                   )}
                                               </div>
                                           </div>

                                           {/* Boxes Tracker */}
                                           <div className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-sm flex flex-col">
                                               <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-1"><Box size={12} className="text-cyan-500"/> boxes[][] Tracking</div>
                                               <div className="flex flex-wrap gap-1">
                                                   {st.boxIdx !== undefined && (
                                                       <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold w-full truncate">
                                                           Box {st.boxIdx}: [ {st.boxes[st.boxIdx].map((b, i) => b ? (i+1) : '').filter(Boolean).join(', ')} ]
                                                       </div>
                                                   )}
                                               </div>
                                           </div>
                                       </div>
                                   )}
                               </div>
                           </div>

                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><LayoutGrid size={120}/></div>
                        <h3 className="font-black text-cyan-400 text-lg uppercase tracking-widest mb-6">The Magic Box Formula</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Identifying the Row and Column of a cell is trivial (indices 0 to 8). But how do we assign a single index (0 to 8) to the nine 3x3 sub-boxes?</p>
                            <div className="bg-slate-800/80 p-4 rounded-xl font-mono text-center border border-slate-700">
                                boxIndex = (r / 3) * 3 + (c / 3)
                            </div>
                            <p>Integer division truncates decimals. <code>r / 3</code> evaluates to 0 (top third), 1 (middle third), or 2 (bottom third). Multiplying by 3 shifts it to the correct "tier" of boxes (0, 3, or 6). Adding <code>c / 3</code> (0, 1, or 2) slides it left-to-right to the exact box!</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-cyan-50 border border-cyan-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-cyan-700 text-lg uppercase tracking-widest mb-6">HashSet String Encoding</h3>
                        <div className="space-y-4 text-sm text-cyan-900/80 leading-relaxed font-medium">
                            <p>If you don't want to use three separate matrices, you can use a single <code>HashSet&lt;String&gt;</code>. We encode the exact "meaning" of a number into a string.</p>
                            <p>For example, if we see '5' at row 0, col 2. We add three strings: <code>"5 in row 0"</code>, <code>"5 in col 2"</code>, and <code>"5 in box 0"</code>.</p>
                            <p>If the <code>Set.add()</code> operation returns <code>false</code>, it means that exact string was already there—proving a duplicate exists in that dimension!</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Bitmasking: The Ultimate Flex (Advanced)</h3>
                            <p>While boolean arrays are O(1) Space (size 9x9 is constant), we can go even further. Since a Java <code>int</code> is 32 bits, and we only need to track 9 numbers, we can use the bits of an integer!</p>
                            <p>Instead of <code>boolean[][] rows = new boolean[9][9]</code>, we use <code>int[] rows = new int[9]</code>. To check if number <code>N</code> is in row <code>R</code>, we check the Nth bit: <code>(rows[R] &gt;&gt; N) &amp; 1 == 1</code>. To add it: <code>rows[R] |= (1 &lt;&lt; N)</code>.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-cyan-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-cyan-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Acing Valid Sudoku</h3>
                    <p className="text-sm text-cyan-100 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this question to test your ability to translate physical rules (Sudoku) into data structures. Don't get tripped up trying to solve the puzzle. You are only validating the currently filled cells. State the 3 rules clearly, then declare your data structures."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-cyan-600 border-b pb-2">Technical Considerations</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Time Complexity Trap:</strong> The board is fixed at 9x9. Technically, analyzing 81 cells is $O(1)$ Time. If the interviewer asks "What if the board is N x N?", then the time complexity becomes $O(N^2)$. Always mention both to show seniority.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Space Complexity Trap:</strong> Similarly, storing three 9x9 boolean arrays is 243 booleans. This is constant, so Space is $O(1)$. For an N x N board, it becomes $O(N^2)$ space.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>HashSet vs Array:</strong> While the HashSet string trick is clever and fast to type, creating strings in a loop causes memory allocation/garbage collection overhead. The boolean array approach is strictly faster and uses less memory.</div></li>
                        </ul>
                    </div>
                    
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-500 border-b pb-2">Interview Communication Checklist</h5>
                        <div className="space-y-3 font-mono text-[11px] text-slate-600 uppercase tracking-tight font-bold">
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-cyan-500"/> Clarify: "Are we solving it, or just validating?"</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-cyan-500"/> State the 3 rules (Row, Col, Box)</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-cyan-500"/> Explain the <code>(r/3)*3 + (c/3)</code> box formula clearly</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-cyan-500"/> Discuss O(1) fixed size vs O(N²) generic scaling</div>
                            <div className="flex items-center gap-3"><CheckSquare size={16} className="text-cyan-500"/> Discuss Arrays vs HashSet overhead</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[650px] 2xl:w-[750px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-cyan-600 p-2 rounded-lg text-white shadow-lg shadow-cyan-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.isFail ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {(!st.isSuccess && !st.isFail) && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <Keyboard size={16} />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-cyan-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(8,145,178,0.3)] hover:bg-cyan-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-cyan-500 shadow-cyan-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Theater Layout: Flex container forces perfect gap */}
                           <div className="p-16 pt-32 flex flex-col xl:flex-row items-start gap-16 xl:gap-24 min-w-max">
                               {/* Board */}
                               <div className="border-4 border-slate-800 bg-slate-800 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden scale-[1.1] 2xl:scale-[1.2] origin-top-left shrink-0">
                                   <div className="grid grid-cols-9 bg-slate-200 gap-px">
                                       {(st.grid || []).map((row, r) =>
                                           row.map((val, c) => renderCell(r, c, val))
                                       )}
                                   </div>
                               </div>

                               {/* Trackers */}
                               <div className="flex flex-col gap-6 w-[450px] scale-[1.1] 2xl:scale-[1.2] origin-top-left shrink-0">
                                   {selectedOpId === 'hashSetString' && st.seen && (
                                       <div className="bg-slate-800 border-2 border-slate-700 rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[500px]">
                                           <div className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-3 border-b border-slate-700 pb-4">
                                               <Database size={20} className="text-emerald-400"/> HashSet Strings
                                           </div>
                                           <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-600 pr-3 flex flex-col gap-2">
                                               {st.seen.length === 0 && <span className="text-sm italic text-slate-500 font-mono text-center mt-4">Set is empty</span>}
                                               {[...st.seen].reverse().map((str, idx) => {
                                                   const isNew = st.justAddedStrs && st.justAddedStrs.includes(str);
                                                   const isFail = st.isFail && st.failReason === str;
                                                   let bgClass = 'bg-slate-700 text-slate-300 border-slate-600';
                                                   if (isFail) bgClass = 'bg-rose-900 text-rose-100 border-rose-500 animate-pulse';
                                                   else if (isNew) bgClass = 'bg-emerald-900 text-emerald-100 border-emerald-500 animate-in slide-in-from-right-4';
                                                   return (
                                                       <div key={idx} className={`font-mono text-xs px-4 py-2 rounded-lg border-2 shadow-md ${bgClass}`}>
                                                           "{str}"
                                                       </div>
                                                   )
                                               })}
                                           </div>
                                       </div>
                                   )}

                                   {selectedOpId === 'booleanArrays' && st.rows && (
                                       <div className="flex flex-col gap-6">
                                           <div className="bg-white border-4 border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col">
                                               <div className="text-xs font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2"><Grid3x3 size={18} className="text-cyan-500"/> rows[][] Memory</div>
                                               <div className="flex flex-wrap gap-2">
                                                   {st.r !== undefined && (
                                                       <div className="bg-cyan-50 border-2 border-cyan-200 text-cyan-800 text-sm font-mono px-4 py-2 rounded-xl font-bold w-full truncate">
                                                           Row {st.r}: [ {st.rows[st.r].map((b, i) => b ? (i+1) : '').filter(Boolean).join(', ')} ]
                                                       </div>
                                                   )}
                                               </div>
                                           </div>
                                           <div className="bg-white border-4 border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col">
                                               <div className="text-xs font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2"><Grid3x3 size={18} className="text-cyan-500"/> cols[][] Memory</div>
                                               <div className="flex flex-wrap gap-2">
                                                   {st.c !== undefined && (
                                                       <div className="bg-cyan-50 border-2 border-cyan-200 text-cyan-800 text-sm font-mono px-4 py-2 rounded-xl font-bold w-full truncate">
                                                           Col {st.c}: [ {st.cols[st.c].map((b, i) => b ? (i+1) : '').filter(Boolean).join(', ')} ]
                                                       </div>
                                                   )}
                                               </div>
                                           </div>
                                           <div className="bg-white border-4 border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col">
                                               <div className="text-xs font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2"><Box size={18} className="text-cyan-500"/> boxes[][] Memory</div>
                                               <div className="flex flex-wrap gap-2">
                                                   {st.boxIdx !== undefined && (
                                                       <div className="bg-cyan-50 border-2 border-cyan-200 text-cyan-800 text-sm font-mono px-4 py-2 rounded-xl font-bold w-full truncate">
                                                           Box {st.boxIdx}: [ {st.boxes[st.boxIdx].map((b, i) => b ? (i+1) : '').filter(Boolean).join(', ')} ]
                                                       </div>
                                                   )}
                                               </div>
                                           </div>
                                       </div>
                                   )}
                               </div>
                           </div>
                       </div>
                  </div>
                  {(st.isSuccess || st.isFail) && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <AlertOctagon size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    {st.isSuccess ? 'SUDOKU IS VALID' : 'SUDOKU IS INVALID'}
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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
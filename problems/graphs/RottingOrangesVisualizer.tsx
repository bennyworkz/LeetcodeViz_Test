import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  rottingOranges: {
    id: 'rottingOranges',
    title: 'Rotting Oranges (Multi-Source BFS)',
    icon: <Flame size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'amber',
    code: `class Pair {
    int row, col, time;
    Pair(int r, int c, int t) { row = r; col = c; time = t; }
}

class Solution {
    public int orangesRotting(int[][] grid) {
        int n = grid.length;
        int m = grid[0].length;
        Queue<Pair> q = new LinkedList<>();
        int[][] vis = new int[n][m];
        int cntFresh = 0;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 2) {
                    q.add(new Pair(i, j, 0));
                    vis[i][j] = 2;
                } else {
                    vis[i][j] = 0;
                }
                if (grid[i][j] == 1) cntFresh++;
            }
        }

        int tm = 0;
        int drow[] = {-1, 0, +1, 0};
        int dcol[] = {0, 1, 0, -1};
        int cnt = 0;

        while (!q.isEmpty()) {
            int r = q.peek().row;
            int c = q.peek().col;
            int t = q.peek().time;
            tm = Math.max(tm, t);
            q.remove();

            for (int i = 0; i < 4; i++) {
                int nrow = r + drow[i];
                int ncol = c + dcol[i];

                if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && 
                    vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1) {
                    q.add(new Pair(nrow, ncol, t + 1));
                    vis[nrow][ncol] = 2;
                    cnt++;
                }
            }
        }
        
        if (cnt != cntFresh) return -1;
        return tm;
    }
}`,
    desc: "Rotting Oranges utilizes Multi-Source Breadth-First Search (BFS). Instead of starting from a single node, it simultaneously enqueues ALL initially rotten oranges at Time=0. It then explores outwards level-by-level, effectively simulating the passage of minutes. The algorithm tracks the maximum time reached and checks if the number of newly rotted oranges matches the initial fresh count."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|orangesRotting|Pair|grid|vis|cntFresh|cnt|row|col|time|nrow|ncol|drow|dcol|n|m|Math|max|length|q|add|remove|isEmpty|peek|LinkedList|Queue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`code-line-${num}`} className={`flex relative z-10 min-h-[22px] transition-colors duration-200 ${active ? `active-code-line ${activeStyles.bg}` : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-10 select-none text-right pr-2 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[3px] flex items-center justify-between ${active ? `${activeStyles.text} font-black` : 'text-slate-600'}`}>
        <span className="w-3 flex justify-center">{active ? <ArrowRight size={10} className="animate-pulse" /> : ''}</span>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'ArrayList', 'LinkedList', 'Queue', 'Pair'].includes(part);
            const isPointer = ['grid', 'vis', 'cntFresh', 'cnt', 'row', 'col', 'time', 'nrow', 'ncol', 'drow', 'dcol', 'n', 'm', 'q', 'r', 'c', 't', 'tm', 'i', 'j'].includes(part);
            const isMapCall = ['orangesRotting', 'max', 'add', 'remove', 'isEmpty', 'peek', 'length'].includes(part);
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

// --- Main Application ---

export default function RottingOrangesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('rottingOranges');
  
  const [gridInput, setGridInput] = useState('2 1 1 | 1 1 0 | 0 1 1');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); // slightly zoomed out by default to fit all components nicely
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = gridInput.split('|').map(r => r.trim());
        let parsed: number[][] = rows.map(r => r.split(/\s+/).map(Number).filter(n => !isNaN(n)));
        
        let maxCols = Math.max(...parsed.map(r => r.length), 1);
        parsed = parsed.map(r => {
            while (r.length < maxCols) r.push(0);
            return r;
        });

        if (parsed.length === 0 || parsed[0].length === 0) {
            parsed = [[2, 1, 1], [1, 1, 0], [0, 1, 1]];
        }
        if (parsed.length > 8) parsed = parsed.slice(0, 8); // Capped at 8x8 for optimal rendering space
        parsed = parsed.map(r => r.slice(0, 8));

        setBaseGrid(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [gridInput]);

  // Robust Auto-scroll effect specifically targeting the active line in the code container
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeLineElements = document.querySelectorAll('.active-code-line');
      activeLineElements.forEach(el => {
         if ((el as HTMLElement).offsetParent !== null) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
         }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep, isFullscreen, activeTab]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone2D = (arr: any[][]) => arr.map(row => [...row]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const initialGrid = clone2D(baseGrid);
    const n = initialGrid.length;
    if (n === 0) return steps;
    const m = initialGrid[0].length;
    if (m === 0) return steps;

    const q: {r: number, c: number, t: number}[] = [];
    let currentGrid = clone2D(initialGrid);
    let vis = Array(n).fill(0).map(() => Array(m).fill(0));
    let cntFresh = 0;
    let tm = 0;
    let cnt = 0;
    const drow = [-1, 0, 1, 0];
    const dcol = [0, 1, 0, -1];
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid: clone2D(currentGrid), n, m, q: [...q], vis: clone2D(vis), cntFresh, tm, cnt, ...st } 
    });

    add("Function Call", `public int orangesRotting(int[][] grid)\nInitiating the method with the provided grid.`, 7, { phase: 'init' });
    
    add("Grid Rows", `int n = grid.length;\nCalculated total rows: ${n}.`, 8, { phase: 'init_ds' });
    add("Grid Columns", `int m = grid[0].length;\nCalculated total columns: ${m}.`, 9, { phase: 'init_ds' });
    add("Init Queue", `Queue<Pair> q = new LinkedList<>();\nCreated an empty Queue to manage rotting spread.`, 10, { phase: 'init_ds' });
    add("Init Visited Matrix", `int[][] vis = new int[n][m];\nAllocated visited array initialized with 0s.`, 11, { phase: 'init_ds' });
    add("Init Fresh Counter", `int cntFresh = 0;\nInitialized fresh orange counter to 0.`, 12, { phase: 'init_ds' });
    
    for (let i = 0; i < n; i++) {
        add("Outer Scan Loop", `for (int i = 0; i < n; i++)\nIterating through grid row ${i}.`, 14, { phase: 'scan', scanR: i });
        for (let j = 0; j < m; j++) {
            add("Inner Scan Loop", `for (int j = 0; j < m; j++)\nEvaluating cell at (${i}, ${j}).`, 15, { phase: 'scan', scanR: i, scanC: j });
            
            add("Check Rotten", `if (grid[i][j] == 2)\nIs the cell at (${i}, ${j}) initially rotten?`, 16, { phase: 'check_rotten', scanR: i, scanC: j });
            
            if (initialGrid[i][j] === 2) {
                q.push({r: i, c: j, t: 0});
                add("Enqueue Rotten", `q.add(new Pair(i, j, 0));\nYes! Pushing to Queue with time = 0.`, 17, { phase: 'found_rotten', scanR: i, scanC: j });
                
                vis[i][j] = 2;
                add("Mark Visited", `vis[i][j] = 2;\nMarking cell (${i}, ${j}) as visited (rotten) in the vis matrix.`, 18, { phase: 'mark_vis', scanR: i, scanC: j });
            } else {
                add("Not Rotten", `} else {\nCell (${i}, ${j}) is not rotten (it's ${initialGrid[i][j]}).`, 19, { phase: 'not_rotten', scanR: i, scanC: j });
                
                vis[i][j] = 0;
                add("Mark Unvisited", `vis[i][j] = 0;\nExplicitly marking cell (${i}, ${j}) as unvisited (0) in the vis matrix.`, 20, { phase: 'mark_unvis', scanR: i, scanC: j });
            }
            
            add("Check Fresh", `if (grid[i][j] == 1) cntFresh++;\nChecking if cell (${i}, ${j}) is a fresh orange.`, 22, { phase: 'check_fresh', scanR: i, scanC: j });
            if (initialGrid[i][j] === 1) {
                cntFresh++;
                add("Increment Fresh", `cntFresh++;\nFound fresh orange. Incremented total fresh count to ${cntFresh}.`, 22, { phase: 'found_fresh', scanR: i, scanC: j });
            }
        }
    }

    add("Init Max Time", `int tm = 0;\nInitializing max time elapsed variable.`, 26, { phase: 'bfs_setup' });
    add("Init Dir Rows", `int drow[] = {-1, 0, +1, 0};\nSetting up row directional vectors (Up, Right, Down, Left).`, 27, { phase: 'bfs_setup' });
    add("Init Dir Cols", `int dcol[] = {0, 1, 0, -1};\nSetting up column directional vectors.`, 28, { phase: 'bfs_setup' });
    add("Init BFS Rot Count", `int cnt = 0;\nInitializing count for oranges rotted during BFS to 0.`, 29, { phase: 'bfs_setup' });

    while (q.length > 0) {
        add("Queue Condition", `while (!q.isEmpty())\nQueue is not empty (${q.length} items). Continuing BFS.`, 31, { phase: 'bfs_while' });
        
        let curr = q[0];
        add("Peek Row", `int r = q.peek().row;\nExtracting row ${curr.r} from queue front.`, 32, { phase: 'bfs_peek', activeR: curr.r, activeC: curr.c, activeT: curr.t });
        add("Peek Col", `int c = q.peek().col;\nExtracting col ${curr.c} from queue front.`, 33, { phase: 'bfs_peek', activeR: curr.r, activeC: curr.c, activeT: curr.t });
        add("Peek Time", `int t = q.peek().time;\nExtracting time ${curr.t} from queue front.`, 34, { phase: 'bfs_peek', activeR: curr.r, activeC: curr.c, activeT: curr.t });
        
        tm = Math.max(tm, curr.t);
        add("Update Time", `tm = Math.max(tm, t);\nUpdating max time elapsed: tm = ${tm}.`, 35, { phase: 'bfs_time', activeR: curr.r, activeC: curr.c, activeT: curr.t });

        q.shift();
        add("Dequeue", `q.remove();\nRemoved the active orange from the queue.`, 36, { phase: 'bfs_dequeue', activeR: curr.r, activeC: curr.c, activeT: curr.t });

        for (let i = 0; i < 4; i++) {
            add("Direction Loop", `for (int i = 0; i < 4; i++)\nIterating direction ${i} out of 4...`, 38, { phase: 'bfs_dir', activeR: curr.r, activeC: curr.c, activeT: curr.t });

            let nrow = curr.r + drow[i];
            add("Calc New Row", `int nrow = r + drow[i];\nCalculated neighbor row: ${nrow}.`, 39, { phase: 'bfs_calc_dir', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow });
            
            let ncol = curr.c + dcol[i];
            add("Calc New Col", `int ncol = c + dcol[i];\nCalculated neighbor col: ${ncol}.`, 40, { phase: 'bfs_calc_dir', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow, checkC: ncol });

            add("Check Validity", `if (nrow >= 0 && ... vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1)\nValidating bounds, visited state, and fresh status.`, 42, { phase: 'bfs_check', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow, checkC: ncol });

            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] === 0 && currentGrid[nrow][ncol] === 1) {
                currentGrid[nrow][ncol] = 2; // visually rot it
                q.push({r: nrow, c: ncol, t: curr.t + 1});
                add("Enqueue Rot", `q.add(new Pair(nrow, ncol, t + 1));\nValid! Rot spreads. Enqueued (${nrow}, ${ncol}) with time ${curr.t + 1}.`, 44, { phase: 'bfs_rot', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow, checkC: ncol });
                
                vis[nrow][ncol] = 2;
                add("Mark Rot Visited", `vis[nrow][ncol] = 2;\nMarked the newly rotted orange as visited in vis matrix.`, 45, { phase: 'bfs_mark_neigh', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow, checkC: ncol });
                
                cnt++;
                add("Increment Rot Count", `cnt++;\nIncremented oranges rotted during BFS to ${cnt}.`, 46, { phase: 'bfs_cnt', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow, checkC: ncol });
            } else {
                add("Skip Invalid", `Condition failed. Cell is invalid, already rotten, or empty. Skipping.`, 42, { phase: 'bfs_skip', activeR: curr.r, activeC: curr.c, activeT: curr.t, checkR: nrow, checkC: ncol });
            }
        }
    }

    add("Queue Empty", `while (!q.isEmpty())\nQueue exhausted. All reachable oranges are rotten.`, 31, { phase: 'bfs_done' });
    
    add("Final Evaluation", `if (cnt != cntFresh) return -1;\nComparing rotted oranges during BFS (${cnt}) to initial fresh count (${cntFresh}).`, 51, { phase: 'eval_final', isFinal: true });

    if (cnt !== cntFresh) {
        add("Return -1", `Return -1;\nCounts don't match. Unreachable fresh oranges remain.`, 51, { phase: 'done', isSuccess: false, isDone: true, msg: "Unreachable fresh oranges remain." });
    } else {
        add("Return Time", `return tm;\nAll fresh oranges were reached. Returning max time: ${tm}.`, 52, { phase: 'done', isSuccess: true, isDone: true, msg: `All oranges rotted in ${tm} minutes.` });
    }

    return steps;
  }, [baseGrid]);

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

  // Abstracted Trace Operations Component to guarantee clean rendering
  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-amber-900 border-amber-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Flame size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.isSuccess ? 'text-amber-400' : 'text-rose-400'}`}>
                    {st.isSuccess ? <PartyPopper size={24}/> : <AlertTriangle size={24}/>} 
                    {st.isSuccess ? "INFECTION COMPLETE" : "PROCESS HALTED"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.msg}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('rot') || st.phase === 'found_rotten' ? 'text-amber-500' : (st.phase.includes('fresh') ? 'text-emerald-400' : (st.phase.includes('peek') || st.phase.includes('dequeue') ? 'text-indigo-400' : (st.phase.includes('check') || st.phase.includes('calc') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.grid === undefined) return null;
      let isSuccessEnd = st.isSuccess;
      let isDone = st.isDone;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isDone ? (isSuccessEnd ? 'border-amber-400 ring-4 ring-amber-100' : 'border-rose-400 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              {isDone ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isSuccessEnd ? 'text-amber-600' : 'text-rose-600'}`}>
                          {isSuccessEnd ? <Trophy size={16}/> : <AlertTriangle size={16}/>} Result Returned
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full break-all ${isSuccessEnd ? 'text-amber-700 bg-amber-100 border-amber-400' : 'text-rose-700 bg-rose-100 border-rose-400'}`}>
                          {isSuccessEnd ? `Max Time = ${st.tm} minutes` : 'Returned -1 (Unreachable oranges)'}
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[70px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><CheckCircle2 size={12}/> Oranges Tracking</span>
                          <div className={`border-2 text-sm font-black px-4 py-2 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 shadow-sm flex flex-col items-center min-w-[120px]`}>
                              <span>Total Fresh = <span className="text-emerald-500">{st.cntFresh !== undefined ? st.cntFresh : '0'}</span></span>
                              <span>Rotted (cnt) = <span className="text-amber-500">{st.cnt !== undefined ? st.cnt : '0'}</span></span>
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-indigo-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active Node (r, c)</span>
                          <div className={`border-2 text-xl font-black px-6 py-4 rounded-2xl transition-all duration-300 ${st.phase.startsWith('bfs') ? 'bg-indigo-100 border-indigo-400 text-indigo-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeR !== undefined && st.activeC !== undefined ? `(${st.activeR}, ${st.activeC})` : '(-, -)'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Timer size={12}/> Max Time (tm)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'bfs_time' ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm animate-in zoom-in' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                              {st.tm !== undefined ? st.tm : '0'}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderSimulationState = () => {
      if (st.grid === undefined) return null;

      return (
          <>
             {/* LEFT COLUMN: Matrices (Grid & Visited) */}
             <div className="flex flex-col gap-8 shrink-0">
                 {/* 1. Grid Matrix */}
                 <div className="relative flex flex-col gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Image Grid (int[][])</span>
                     {st.grid.map((rowArr: number[], rIdx: number) => (
                         <div key={`rf-${rIdx}`} className="flex gap-1.5">
                             {rowArr.map((cellValue: number, cIdx: number) => {
                                 let isScan = st.scanR === rIdx && st.scanC === cIdx && st.phase.includes('scan');
                                 let isActive = st.activeR === rIdx && st.activeC === cIdx && st.phase.startsWith('bfs');
                                 let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                 
                                 let bgClass = '';
                                 if (cellValue === 0) bgClass = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                                 else if (cellValue === 1) bgClass = 'bg-emerald-100 text-emerald-600 border-emerald-300';
                                 else if (cellValue === 2) bgClass = 'bg-amber-500 text-white border-amber-600 shadow-sm';

                                 let ringClass = 'border-2';
                                 let scaleClass = 'scale-100';
                                 let zIndex = 'z-10';

                                 if (isActive) {
                                     ringClass = 'ring-4 ring-indigo-500 ring-offset-2 border-transparent shadow-lg';
                                     scaleClass = 'scale-110';
                                     zIndex = 'z-30';
                                 } else if (isCheck) {
                                     let isValid = cellValue === 1 && st.vis[rIdx][cIdx] === 0;
                                     ringClass = isValid ? 'ring-4 ring-emerald-400 ring-offset-2 border-transparent shadow-md' : 'ring-4 ring-rose-400 ring-offset-2 border-transparent shadow-md';
                                     scaleClass = 'scale-105';
                                     zIndex = 'z-20';
                                 } else if (isScan) {
                                     ringClass = 'ring-4 ring-slate-400 ring-offset-2 border-transparent';
                                     scaleClass = 'scale-105';
                                     zIndex = 'z-20';
                                 }

                                 let cellClass = `w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-black text-xl md:text-2xl rounded-xl transition-all duration-300 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`;

                                 return (
                                     <div key={`cf-${rIdx}-${cIdx}`} className={cellClass}>
                                         {cellValue}
                                         <span className={`absolute bottom-0.5 right-1 text-[9px] font-mono opacity-0 group-hover:opacity-100 ${cellValue === 2 ? 'text-white/50' : 'text-black/20'}`}>{rIdx},{cIdx}</span>
                                     </div>
                                 );
                             })}
                         </div>
                     ))}
                 </div>

                 {/* 2. Visited Matrix */}
                 <div className="relative flex flex-col gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-xl border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Visited Matrix (vis[][])</span>
                     {st.vis.map((rowArr: number[], rIdx: number) => (
                         <div key={`vis-r-${rIdx}`} className="flex gap-1.5">
                             {rowArr.map((cellValue: number, cIdx: number) => {
                                 let isMarkedNow = (st.phase === 'mark_vis' || st.phase === 'mark_unvis') && st.scanR === rIdx && st.scanC === cIdx;
                                 let isMarkedNeighNow = st.phase === 'bfs_mark_neigh' && st.checkR === rIdx && st.checkC === cIdx;
                                 let isChecking = st.checkR === rIdx && st.checkC === cIdx && st.phase === 'bfs_check';

                                 let bgClass = cellValue === 0 ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-80' : 'bg-amber-500 text-white border-amber-600 shadow-sm';
                                 let ringClass = 'border-2';
                                 let scaleClass = 'scale-100';
                                 let zIndex = 'z-10';

                                 if (isMarkedNow || isMarkedNeighNow) {
                                     ringClass = 'ring-4 ring-amber-400 ring-offset-2 border-transparent shadow-lg';
                                     scaleClass = 'scale-110';
                                     zIndex = 'z-30';
                                 } else if (isChecking) {
                                     ringClass = 'ring-4 ring-sky-400 ring-offset-2 border-transparent';
                                     scaleClass = 'scale-105';
                                     zIndex = 'z-20';
                                 }

                                 return (
                                     <div key={`vis-c-${rIdx}-${cIdx}`} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-mono font-bold text-lg rounded-xl transition-all duration-300 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`}>
                                         {cellValue}
                                     </div>
                                 );
                             })}
                         </div>
                     ))}
                 </div>
             </div>

             {/* RIGHT COLUMN: Queue & Variables */}
             <div className="flex flex-col gap-6 z-20 items-center justify-start shrink-0 w-[240px] md:w-[280px]">
                 
                 {/* Variables State Panel */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><Database size={12}/> Variables State</span>
                     <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-5 flex flex-col gap-2 font-mono text-[11px] md:text-xs">
                         <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                             <div className="flex justify-between border-b border-slate-100 pb-1">
                                 <span className="text-slate-400">n:</span>
                                 <span className="font-bold text-slate-700">{st.n !== undefined ? st.n : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1">
                                 <span className="text-slate-400">m:</span>
                                 <span className="font-bold text-slate-700">{st.m !== undefined ? st.m : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-slate-400">cntFresh:</span>
                                 <span className="font-bold text-emerald-600">{st.cntFresh !== undefined ? st.cntFresh : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-slate-400">cnt (rotted):</span>
                                 <span className="font-bold text-amber-600">{st.cnt !== undefined ? st.cnt : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-slate-400">tm (max time):</span>
                                 <span className="font-bold text-rose-600">{st.tm !== undefined ? st.tm : '-'}</span>
                             </div>

                             {/* Dynamic Loop Coordinates */}
                             <div className="flex justify-between border-b border-slate-100 pb-1 mt-2">
                                 <span className="text-indigo-400">r (row):</span>
                                 <span className="font-bold text-indigo-700">{st.activeR !== undefined ? st.activeR : (st.scanR !== undefined ? st.scanR : '-')}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 mt-2">
                                 <span className="text-indigo-400">c (col):</span>
                                 <span className="font-bold text-indigo-700">{st.activeC !== undefined ? st.activeC : (st.scanC !== undefined ? st.scanC : '-')}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-indigo-400">t (time):</span>
                                 <span className="font-bold text-indigo-700">{st.activeT !== undefined ? st.activeT : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 mt-2">
                                 <span className="text-sky-400">nrow:</span>
                                 <span className="font-bold text-sky-700">{st.checkR !== undefined ? st.checkR : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 mt-2">
                                 <span className="text-sky-400">ncol:</span>
                                 <span className="font-bold text-sky-700">{st.checkC !== undefined ? st.checkC : '-'}</span>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Queue Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> Queue&lt;Pair&gt;</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                         <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                             <span>FRONT (OUT)</span>
                             <span>BACK (IN)</span>
                         </div>
                         
                         <div className="flex flex-wrap gap-2 transition-all duration-500">
                             {(st.q || []).map((val: {r: number, c: number, t: number}, i: number) => {
                                 let isEntering = st.phase.includes('rot') && i === st.q.length - 1;
                                 let isTop = i === 0;
                                 
                                 return (
                                     <div key={`qf-${i}-${val.r}-${val.c}`} className={`px-2 py-1 flex flex-col items-center justify-center font-mono font-bold text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-amber-500 border-amber-600 animate-in slide-in-from-right-8' : (isTop ? 'bg-indigo-600 border-indigo-700' : 'bg-slate-700 border-slate-800')}`}>
                                         <span className="text-xs">({val.r},{val.c})</span>
                                         <span className="text-[9px] opacity-70">t={val.t}</span>
                                     </div>
                                 )
                             })}
                             {st.q && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Queue is empty</span>}
                         </div>
                     </div>
                 </div>
             </div>
          </>
      );
  }

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      2D Grid Graph Traversal
                  </span>
                  <span>•</span>
                  <span>Queue Based</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Flame size={28}/> Rot Spread Dynamics</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an <code>m x n</code> grid where each cell can have one of three values:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><code>0</code> representing an empty cell,</li>
                            <li><code>1</code> representing a fresh orange, or</li>
                            <li><code>2</code> representing a rotten orange.</li>
                        </ul>
                        <p>Every minute, any fresh orange that is <strong>4-directionally adjacent</strong> to a rotten orange becomes rotten.</p>
                        <p>Return <em>the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return <code>-1</code>.</em></p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> grid = [[2,1,1],[1,1,0],[0,1,1]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">4</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Minute 0: The top-left orange is rotten.<br/>Minute 1: Top-middle and center-left oranges rot.<br/>Minute 4: The bottom-right orange finally rots.</span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Search size={16}/> 1. Scan & Store</span>
                            <p className="text-sm text-slate-500">Scan the entire grid. Count the total fresh oranges, and insert ALL rotten oranges into the queue at <code>Time = 0</code>.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Waves size={16}/> 2. Multi-Source Spread</span>
                            <p className="text-sm text-slate-500">Pop the queue. If a neighbor is fresh, rot it and enqueue it with <code>Time = Current Time + 1</code>. This ensures the rot spreads uniformly outward.</p>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Split Screen Normal Mode */}
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                {renderTraceOperationsBox()}
                
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[300px] max-h-[500px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Matrix (Use | for rows. 0=Empty, 1=Fresh, 2=Rotten)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="2 1 1 | 1 1 0 | 0 1 1" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-2 md:p-8 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[600px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Compass size={14} className={`text-${themeColor}-500`}/> Multi-Source BFS Visualizer</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-row justify-center items-center gap-8 lg:gap-16 pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderSimulationState()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Multi-Source BFS and how it flawlessly tracks time levels across simultaneous epicenters.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowDownToLine size={24} className="text-indigo-500"/> Multi-Source vs Single-Source</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A standard BFS starts from 1 node. If we had 3 rotten oranges, doing standard BFS three times would be inefficient. Multi-Source BFS pushes ALL rotten oranges into the queue before the <code>while</code> loop starts. They all act as level 0. When they pop, they enqueue their neighbors as level 1. It naturally simulates simultaneous radial expansion.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Timer size={24} className="text-amber-500"/> Tracking Time in the Queue</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We use a custom <code>Pair(row, col, time)</code> object. Every time an orange rots, its <code>time</code> is <code>current_time + 1</code>. The global <code>maxTime</code> is updated dynamically: <code>tm = Math.max(tm, current_time)</code>. This guarantees that when the queue finishes, `tm` holds the exact minute the final orange rotted.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><CheckCircle2 size={24} className="text-emerald-500"/> The Fresh Counter Validation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">How do we know if some fresh oranges were trapped behind walls of empty cells (`0`)? We count the total fresh oranges at the start (`cntFresh`). During BFS, every time we rot an orange, we increment `cnt`. At the very end, if `cnt != cntFresh`, it means some oranges were unreachable, so we return `-1`.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>The initial scan to find '2's and '1's takes $O(N \times M)$. The BFS then visits each cell at most once. Therefore, the total time is strictly bounded linearly by the grid size.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>The `vis[][]` matrix takes $O(N \times M)$ space. In the absolute worst case (a grid completely full of rotten oranges), the Queue will store $N \times M$ elements initially. Thus, space is bounded by the size of the grid.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Rotting Oranges is the premier problem for testing Multi-Source BFS. Interviewers often focus on how you track levels and validate unreachable components."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we track time without storing `time` in the Queue object?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, by processing the Queue level-by-level."</p>
                            <p>Instead of <code>Pair(row, col, time)</code>, we can just use <code>{'int[] {row, col}'}</code>. Inside the `while` loop, we capture <code>int size = q.size();</code> and then run a <code>for</code> loop for exactly that size. After the `for` loop finishes, we increment <code>time++</code>. This processes the entire 'minute' batch together. Storing time in the Pair object is just slightly more robust and easier to trace conceptually."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Can we optimize the Space Complexity by dropping the `vis[][]` array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can mutate the input grid in-place."</p>
                            <p>We can omit the <code>vis</code> array entirely. Whenever an orange rots, we just set <code>grid[nrow][ncol] = 2</code>. Our BFS check then just looks for <code>grid[nrow][ncol] == 1</code>. This brings Space Complexity down to $O(Queue)$, completely removing the $O(N \times M)$ footprint of the visited matrix."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><AlertTriangle size={24}/></span>
                            <span>Q3: "What happens if there are NO fresh oranges and NO rotten oranges?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It should return 0 minutes."</p>
                            <p>In our implementation, if `cntFresh == 0`, the `while` loop won't do anything meaningful regarding fresh oranges, and `cnt` remains 0. The final check `if (cnt != cntFresh)` becomes `if (0 != 0)`, which is false. It then returns `tm` which is 0. This is the correct behavior because 0 minutes are required to make sure no fresh oranges remain."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* FIXED LEFT SIDEBAR: Trace Top, Code Bottom */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Pinned Trace Box */}
                  {renderTraceOperationsBox()}

                  {/* Auto-scrolling Source Code */}
                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* RIGHT CANVAS AREA */}
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-${themeColor}-600 text-white shadow-md`}>
                              {selectedOp.icon} <span>{selectedOp.title}</span>
                          </button>
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                           <div className="flex gap-2 w-full">
                                <div className="space-y-1.5 w-full">
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Matrix (Use | for rows. 0=Empty, 1=Fresh, 2=Rotten)</label>
                                    <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold min-w-[250px]`} placeholder="2 1 1 | 1 1 0 | 0 1 1" />
                                </div>
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
                  
                  {!st.isDone && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-12 py-6 bg-${themeColor}-500 text-white rounded-[2rem] hover:bg-${themeColor}-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-400 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      {/* Using the centralized render wrapper */}
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-row justify-center items-center gap-8 lg:gap-16 pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderSimulationState()}
                       </div>
                  </div>
                  {st.isDone && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-amber-500 shadow-[0_0_150px_rgba(245,158,11,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-amber-500/20 text-amber-500 ring-amber-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <AlertTriangle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.isSuccess ? "INFECTION COMPLETE" : "PROCESS HALTED"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.isSuccess ? 'text-amber-400' : 'text-rose-400'}`}>{st.msg}</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isSuccess ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {st.isSuccess ? 'Total Minutes Elapsed' : 'Returned Value'}
                                    </div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">
                                        {st.isSuccess ? st.tm : '-1'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-500 hover:bg-${themeColor}-600 shadow-${themeColor}-900/20`}>
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
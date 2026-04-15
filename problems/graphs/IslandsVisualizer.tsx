import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  Split as SplitIcon, GitMerge, Share2, MousePointer2, 
  Binary, CircleDashed, CheckSquare, PlusSquare, 
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale, LineChart, Snowflake, Network, RadioReceiver, Route, Navigation, Wifi, MoveRight
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  numIslands: {
    id: 'numIslands',
    title: 'Number of Islands (Grid BFS)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'emerald',
    code: `import java.util.LinkedList;
import java.util.Queue;

class Pair {
    int first, second;
    public Pair(int first, int second) {
        this.first = first;
        this.second = second;
    }
}

class Solution {
    private void bfs(int ro, int co, int[][] vis, char[][] grid) {
        vis[ro][co] = 1;
        Queue<Pair> q = new LinkedList<Pair>();
        q.add(new Pair(ro, co));
        
        int n = grid.length;
        int m = grid[0].length;
        
        while (!q.isEmpty()) {
            int row = q.peek().first;
            int col = q.peek().second;
            q.remove();
            
            // Traverse all 8 neighbors
            for (int delrow = -1; delrow <= 1; delrow++) {
                for (int delcol = -1; delcol <= 1; delcol++) {
                    int nrow = row + delrow;
                    int ncol = col + delcol;
                    
                    // Boundary checks and validity checks
                    if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m 
                        && grid[nrow][ncol] == '1' && vis[nrow][ncol] == 0) {
                        vis[nrow][ncol] = 1;
                        q.add(new Pair(nrow, ncol));
                    }
                }
            }
        }
    }
    
    public int numIslands(char[][] grid) {
        int n = grid.length;
        int m = grid[0].length;
        int[][] vis = new int[n][m];
        int cnt = 0;
        
        for (int row = 0; row < n; row++) {
            for (int col = 0; col < m; col++) {
                if (vis[row][col] == 0 && grid[row][col] == '1') {
                    cnt++;
                    bfs(row, col, vis, grid);
                }
            }
        }
        return cnt;
    }
}`,
    desc: "Number of Islands: A classic grid traversal algorithm. It treats a 2D matrix as an undirected graph where '1's represent land and '0's represent water. By utilizing nested outer loops, it guarantees that every disconnected landmass (island) is found. Once a piece of unvisited land is identified, a Breadth-First Search (BFS) radiates outwards in all 8 directions to explore and mark the entire connected island."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|ArrayList|LinkedList|Queue|Integer|char|Pair|grid|vis|cnt|row|col|nrow|ncol|delrow|delcol|ro|co|n|m|first|second|bfs|numIslands|add|isEmpty|peek|remove|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while', 'import', 'char'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'ArrayList', 'LinkedList', 'Queue', 'Pair'].includes(part);
            const isPointer = ['grid', 'vis', 'cnt', 'row', 'col', 'nrow', 'ncol', 'delrow', 'delcol', 'ro', 'co', 'n', 'm', 'first', 'second'].includes(part);
            const isMapCall = ['bfs', 'numIslands', 'add', 'isEmpty', 'peek', 'remove', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"');
            
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
                  isCharLiteral ? 'text-amber-300' :
                  isNaN(parseInt(part)) ? (part.startsWith('"') ? 'text-amber-300' : '') : 'text-emerald-400'
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

export default function NumberOfIslandsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('numIslands');
  
  const [gridInput, setGridInput] = useState('0 1 1 0 | 0 1 1 0 | 0 0 0 0 | 1 1 0 1');
  const [baseGrid, setBaseGrid] = useState<string[][]>([
      ['0', '1', '1', '0'],
      ['0', '1', '1', '0'],
      ['0', '0', '0', '0'],
      ['1', '1', '0', '1']
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
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
        let parsed: string[][] = rows.map(r => r.replace(/[^01]/g, '').split(''));
        
        let maxCols = Math.max(...parsed.map(r => r.length), 1);
        parsed = parsed.map(r => {
            while (r.length < maxCols) r.push('0');
            return r;
        });

        if (parsed.length === 0 || parsed[0].length === 0) {
            parsed = [['0', '1', '1', '0'], ['0', '1', '1', '0'], ['0', '0', '0', '0'], ['1', '1', '0', '1']];
        }
        
        if (parsed.length > 10) parsed = parsed.slice(0, 10);
        parsed = parsed.map(r => r.slice(0, 10));

        setBaseGrid(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
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
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone2D = (arr: any[][]) => arr.map(row => [...row]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const grid = baseGrid;
    const n = grid.length;
    if (n === 0) return steps;
    const m = grid[0].length;
    if (m === 0) return steps;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid, n, m, ...st } 
    });

    let vis = Array(n).fill(0).map(() => Array(m).fill(0));
    let cnt = 0;
    let q: {r: number, c: number}[] = [];

    add("Function Call", `public int numIslands(char[][] grid)\nInitiating island counting process. Grid is ${n}x${m}.`, 43, { vis: clone2D(vis), cnt, q: [...q], phase: 'init' });
    add("Init Structures", `int[][] vis = new int[n][m];\nint cnt = 0;\nAllocated visited array and initialized island counter.`, 46, { vis: clone2D(vis), cnt, q: [...q], phase: 'init_ds' });

    for (let row = 0; row < n; row++) {
        add("Row Scan", `for (int row = 0; row < n; row++)\nScanning row ${row}.`, 49, { vis: clone2D(vis), cnt, q: [...q], scanR: row, scanC: 0, phase: 'scan' });
        for (let col = 0; col < m; col++) {
            add("Col Scan", `for (int col = 0; col < m; col++)\nSweeping matrix at cell (${row}, ${col}).`, 50, { vis: clone2D(vis), cnt, q: [...q], scanR: row, scanC: col, phase: 'scan' });

            add("Evaluate Land", `if (vis[row][col] == 0 && grid[row][col] == '1')\nChecking if cell (${row}, ${col}) is unvisited land...`, 51, { vis: clone2D(vis), cnt, q: [...q], scanR: row, scanC: col, phase: 'eval_land' });

            if (vis[row][col] === 0 && grid[row][col] === '1') {
                cnt++;
                add("New Island Found!", `cnt++;\nValid unvisited land! Incrementing total island count to ${cnt}.`, 52, { vis: clone2D(vis), cnt, q: [...q], scanR: row, scanC: col, phase: 'found_island' });

                add("Call BFS", `bfs(row, col, vis, grid);\nTriggering Breadth-First Search to map Island #${cnt}.`, 53, { vis: clone2D(vis), cnt, q: [...q], scanR: row, scanC: col, phase: 'call_bfs' });

                // --- BFS FUNCTION SIMULATION ---
                vis[row][col] = 1;
                add("BFS: Mark Source", `vis[ro][co] = 1;\nMarking epicenter (${row}, ${col}) as visited.`, 14, { vis: clone2D(vis), cnt, q: [...q], activeR: row, activeC: col, phase: 'bfs_mark' });

                add("BFS: Init Queue", `Queue<Pair> q = new LinkedList<Pair>();\nCreated an empty Queue for BFS.`, 15, { vis: clone2D(vis), cnt, q: [...q], activeR: row, activeC: col, phase: 'bfs_init_queue' });

                q.push({r: row, c: col});
                add("BFS: Enqueue Source", `q.add(new Pair(ro, co));\nAdded epicenter (${row}, ${col}) to the exploration Queue.`, 16, { vis: clone2D(vis), cnt, q: [...q], activeR: row, activeC: col, phase: 'bfs_enqueue' });

                add("BFS: Load Bounds", `int n = grid.length;\nint m = grid[0].length;\nLoaded grid boundaries for safety checks.`, 18, { vis: clone2D(vis), cnt, q: [...q], activeR: row, activeC: col, phase: 'bfs_bounds' });

                while (q.length > 0) {
                    add("BFS: Queue Check", `while (!q.isEmpty())\nQueue has ${q.length} elements. Spreading outwards.`, 21, { vis: clone2D(vis), cnt, q: [...q], phase: 'bfs_while' });

                    let curr = q[0];
                    add("BFS: Peek Front", `int row = q.peek().first;\nint col = q.peek().second;\nReading front cell (${curr.r}, ${curr.c}).`, 22, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, phase: 'bfs_peek' });

                    q.shift();
                    add("BFS: Dequeue", `q.remove();\nRemoved cell (${curr.r}, ${curr.c}) from Queue to evaluate its 8 neighbors.`, 24, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, phase: 'bfs_dequeue' });

                    add("BFS: Neighbor Loop", `for (int delrow = -1; delrow <= 1; delrow++)\nStarting vertical neighbor offset loop.`, 27, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, phase: 'bfs_dir_loop_1' });
                    
                    for (let delrow = -1; delrow <= 1; delrow++) {
                        for (let delcol = -1; delcol <= 1; delcol++) {
                            let nrow = curr.r + delrow;
                            let ncol = curr.c + delcol;

                            add("BFS: Direction Math", `int nrow = row + delrow;\nint ncol = col + delcol;\nCalculated neighbor coords: (${nrow}, ${ncol}).`, 29, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol, phase: 'bfs_check_dir' });
                            
                            add("BFS: Condition Check", `if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && grid[nrow][ncol] == '1' && vis[nrow][ncol] == 0)\nChecking boundaries and land status...`, 33, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol, phase: 'bfs_eval_cond' });

                            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && grid[nrow][ncol] === '1' && vis[nrow][ncol] === 0) {
                                vis[nrow][ncol] = 1;
                                add("BFS: Mark Neighbor", `vis[nrow][ncol] = 1;\nInstantly marked (${nrow}, ${ncol}) as visited to prevent duplicate checks.`, 35, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol, phase: 'bfs_mark_neigh' });

                                q.push({r: nrow, c: ncol});
                                add("BFS: Enqueue Neighbor", `q.add(new Pair(nrow, ncol));\nQueued neighbor (${nrow}, ${ncol}) for future expansion.`, 36, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol, phase: 'bfs_enqueue_neigh' });
                            } else {
                                add("BFS: Invalid Skip", `Condition failed! Cell (${nrow}, ${ncol}) is out of bounds, water, or already visited. Skip.`, 33, { vis: clone2D(vis), cnt, q: [...q], activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol, phase: 'bfs_invalid' });
                            }
                        }
                    }
                }
                add("BFS: Complete", `while (!q.isEmpty()) -> Queue exhausted. Island #${cnt} is fully conquered. Control returns.`, 21, { vis: clone2D(vis), cnt, q: [...q], phase: 'bfs_done' });
            }
        }
    }

    add("Traversal Complete", `return cnt;\nGrid completely scanned. Total disconnected islands: ${cnt}.`, 57, { vis: clone2D(vis), cnt, q: [...q], phase: 'done', isSuccess: true, finalAns: cnt });

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

  // Abstracted Trace Operations Component to reuse in both modes
  const TraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isSuccess ? 'bg-sky-900 border-sky-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isSuccess ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                    <PartyPopper size={24}/> TRAVERSAL COMPLETE
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Successfully mapped the entire grid surface.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.startsWith('bfs_mark') || st.phase === 'found_island' ? 'text-emerald-400' : (st.phase === 'bfs_dequeue' || st.phase === 'bfs_check_dir' || st.phase === 'bfs_eval_cond' ? 'text-amber-400' : (st.phase.startsWith('scan') ? 'text-indigo-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.grid === undefined) return null;
      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-sky-400 ring-4 ring-sky-100' : 'border-slate-200'} scale-105 z-40`}>
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-sky-600`}>
                          <Trophy size={16}/> Global Mission Accomplished
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-sky-700 bg-sky-100 border-sky-400 break-all`}>
                          Total Islands Found = {st.finalAns}
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[70px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1">Island Counter (cnt)</span>
                          <div className={`border-2 text-3xl md:text-4xl font-black px-6 py-2 md:py-3 rounded-2xl transition-all duration-300 ${st.phase === 'found_island' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-125 shadow-xl animate-bounce' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                              {st.cnt !== undefined ? st.cnt : '0'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><Search size={12}/> Outer Scan (r, c)</span>
                          <div className={`border-2 text-lg md:text-xl font-black px-6 py-3 md:py-4 rounded-2xl transition-all duration-300 ${st.phase.startsWith('scan') || st.phase === 'eval_land' ? 'bg-indigo-100 border-indigo-400 text-indigo-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.scanR !== undefined && st.scanC !== undefined ? `(${st.scanR}, ${st.scanC})` : '(-, -)'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300 hidden md:block" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> BFS Queue Size</span>
                          <div className={`border-2 text-xl md:text-2xl font-black px-6 py-3 md:py-4 rounded-2xl transition-all duration-300 ${st.phase === 'bfs_enqueue' || st.phase === 'bfs_enqueue_neigh' || st.phase === 'bfs_dequeue' ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm animate-in zoom-in' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                              {st.q !== undefined ? st.q.length : '0'}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (st.grid === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              <div className="flex flex-col items-center justify-center relative w-full mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-row items-center justify-center p-4 md:p-8 gap-6 lg:gap-16 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '600px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      {/* --- LEFT: GRID MATRIX RENDERER --- */}
                      <div className="relative flex flex-col gap-1 md:gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                          <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Grid Matrix (char[][])</span>
                          {st.grid.map((rowArr: string[], rIdx: number) => (
                              <div key={`r-${rIdx}`} className="flex gap-1 md:gap-1.5">
                                  {rowArr.map((cellValue: string, cIdx: number) => {
                                      
                                      let isScan = st.scanR === rIdx && st.scanC === cIdx;
                                      let isActive = st.activeR === rIdx && st.activeC === cIdx;
                                      let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                      let isVisited = st.vis && st.vis[rIdx][cIdx] === 1;
                                      
                                      let bgClass = cellValue === '0' ? 'bg-slate-50 text-slate-300 border-slate-200' :
                                                    isVisited ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' :
                                                    'bg-amber-50 text-amber-500 border-amber-200';

                                      let ringClass = '';
                                      let scaleClass = 'scale-100';
                                      let zIndex = 'z-10';

                                      if (isActive) {
                                          ringClass = 'ring-2 ring-fuchsia-500 ring-offset-2';
                                          scaleClass = 'scale-110';
                                          zIndex = 'z-30';
                                          bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-md'; 
                                      } else if (isCheck) {
                                          let isCheckingWater = cellValue === '0' || isVisited;
                                          ringClass = isCheckingWater ? 'ring-2 ring-rose-400 ring-offset-2' : 'ring-2 ring-emerald-400 ring-offset-2';
                                          scaleClass = 'scale-105';
                                          zIndex = 'z-20';
                                      } else if (isScan) {
                                          ringClass = 'ring-2 ring-indigo-400 ring-offset-2';
                                          scaleClass = 'scale-105';
                                          zIndex = 'z-20';
                                      }

                                      let cellClass = `w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-mono font-bold text-lg md:text-xl rounded-xl transition-all duration-300 border-2 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`;

                                      return (
                                          <div key={`c-${rIdx}-${cIdx}`} className={cellClass}>
                                              {cellValue}
                                              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-black/20 opacity-0 group-hover:opacity-100">{rIdx},{cIdx}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                          ))}
                      </div>

                      {/* --- RIGHT: DATA STRUCTURES (Queue) --- */}
                      <div className="flex flex-col gap-6 z-20 items-center justify-start shrink-0 w-[200px] md:w-[280px]">
                          <div className="flex flex-col items-center w-full">
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> Queue&lt;Pair&gt;</span>
                              <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[350px] max-h-[500px] overflow-y-auto scrollbar-thin">
                                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                                      <span>FRONT (OUT)</span>
                                      <span>BACK (IN)</span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 transition-all duration-500">
                                      {(st.q || []).map((val: {r: number, c: number}, i: number) => {
                                          let isEntering = (st.phase === 'bfs_enqueue' || st.phase === 'bfs_enqueue_neigh') && i === st.q.length - 1;
                                          
                                          return (
                                              <div key={`q-${i}-${val.r}-${val.c}`} className={`px-3 py-2 flex items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-amber-500 border-amber-600 animate-in slide-in-from-right-8' : 'bg-slate-700 border-slate-800'}`}>
                                                  ({val.r}, {val.c})
                                              </div>
                                          )
                                      })}
                                      {st.q && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Queue is empty</span>}
                                  </div>
                              </div>
                          </div>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Grid size={28}/> Exploring Disconnected Landmasses</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a boolean 2D matrix <code>grid</code> of size <code>N x M</code>, where <code>'1'</code> represents land and <code>'0'</code> represents water.</p>
                        <p>Your task is to find the total <strong>Number of Islands</strong>. An island is surrounded by water and is formed by connecting adjacent lands horizontally, vertically, or diagonally (all 8 directions).</p>
                        <p className="italic bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800">Note: Traditional LeetCode variants only check 4 directions. This specific Java variant is designed to check all 8 directional neighbors!</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> grid = [<br/>  ['0','1','1','0'],<br/>  ['0','1','1','0'],<br/>  ['0','0','0','0'],<br/>  ['1','1','0','1']<br/>]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">2</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The top block of 1s forms Island #1.<br/>The bottom block of 1s (including the isolated 1 connected diagonally) forms Island #2.</span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Search size={16}/> 1. Matrix Sweeping</span>
                            <p className="text-sm text-slate-500">Outer <code>for</code> loops scan every single cell linearly. If an unvisited '1' is found, it's the start of a completely new, unmapped island.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><MapPin size={16}/> 2. Island Conquer</span>
                            <p className="text-sm text-slate-500">The BFS algorithm takes over. It acts like a flood-fill, radiating in all 8 directions to claim and mark every connected piece of land as visited.</p>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Split Screen Normal Mode: Code & Trace Left, Visuals Right */}
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <TraceOperationsBox />
                
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
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Matrix (Use | for rows, spaces optional)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="0 1 1 0 | 0 1 1 0 | 0 0 0 0" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-2 md:p-8 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[600px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Grid size={14} className={`text-${themeColor}-500`}/> Spatial Grid Visualizer</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Deconstructing the grid traversal mechanics and why Breadth-First Search excels at component isolation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MapPin size={24} className="text-indigo-500"/> The Outer Matrix Sweep</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike a graph with a clear source node '0', a 2D map doesn't provide a starting point. The algorithm relies on nested <code>for</code> loops to rigorously check every <code>grid[row][col]</code>. Without this sweep, disconnected islands would remain invisible.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Waves size={24} className="text-sky-500"/> 8-Directional Vector Loops</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Standard array checks explicitly code <code>up, down, left, right</code>. Here, the clever use of nested loops <code>for(delrow=-1 to 1)</code> and <code>for(delcol=-1 to 1)</code> dynamically generates all 8 surrounding vector coordinates. This condenses the code significantly while effectively mapping diagonal land bridges.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><CheckCircle2 size={24} className="text-emerald-500"/> Prevention of Infinite Loops</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Since grids inherently form massive cycles (Cell A connects to B, B to C, C back to A), the <code>vis[][]</code> matrix is critical. A node is stamped as visited the exact millisecond it meets the conditions and gets enqueued. If we waited to mark it visited until it was dequeued, adjacent cells would enqueue duplicates leading to an immediate memory crash.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>The matrix has dimensions N x M. The outer loops iterate exactly $N \times M$ times. During the BFS phase, a single unvisited '1' is enqueued and checked. Its 8 neighbors are evaluated. Crucially, a cell is enqueued <em>at most once</em>. Therefore, overall maximum operations are strictly bounded to traversing the matrix elements, yielding linear time $O(V) = O(N \times M)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>The <code>vis[][]</code> array mimics the grid precisely, utilizing $O(N \times M)$ memory space. Furthermore, in the worst-case scenario where the entire grid is a giant block of land ('1's), the Queue will grow significantly, peaking around the perimeter size of the mapped radius, bounding auxiliary space to $O(N \times M)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Number of Islands is the definitive standard for assessing grid traversals. Expect to be questioned on space optimization and DFS vs BFS architectural tradeoffs."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this using DFS instead? What are the tradeoffs?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, DFS is perfectly valid and often requires slightly less boilerplate code (no Queue class setup)."</p>
                            <p>However, the main tradeoff is the Call Stack. DFS uses system recursion depth. If an island snakes back and forth across a massive $1000 \times 1000$ grid, DFS will hit maximum recursion depth resulting in a <code>StackOverflowError</code>. BFS relies on a Heap-allocated Queue object, keeping it robust regardless of island structure size."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "How can we optimize the Space Complexity to O(1) extra memory?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "By intentionally mutating the input grid."</p>
                            <p>Instead of maintaining a separate <code>int[][] vis</code> array, we can permanently alter the original grid as we traverse it. Whenever we process a '1', we can overwrite it with a '0' (or a distinct marker like '2'). This serves as our visited flag. It reduces Space Complexity from $O(N \times M)$ down to the Queue overhead. Note: This requires permission from the interviewer, as modifying inputs is sometimes forbidden in production APIs."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Grid size={24}/></span>
                            <span>Q3: "What if the grid contains millions of rows, making it too large to fit in memory?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would need to switch to a Disjoint Set Union (DSU) / Union-Find approach."</p>
                            <p>If we stream the grid chunk by chunk or row by row, BFS/DFS breaks because they require random spatial access. With DSU, as we process rows, we merge adjacent '1' sets dynamically. When pieces merge, the total island count decreases. It's mathematically heavier but perfectly suited for distributed or streamed large-scale graph analysis."</p>
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
                  <TraceOperationsBox />

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
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Grid Matrix (Use | for rows)</label>
                              <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="0 1 1 0 | 0 1 1 0 | 0 0 0 0" />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      {/* Flex Row Layout precisely enforced for Grid on Left, Queue on Right */}
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-row justify-center items-center gap-12 lg:gap-24 pt-16" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                           
                           {/* Only rendering pure visuals here to enforce strict side-by-side spacing */}
                           {st.grid !== undefined && (
                                <>
                                    {/* Grid Visual */}
                                    <div className="relative flex flex-col gap-1.5 p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                                        <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Grid Matrix (char[][])</span>
                                        {st.grid.map((rowArr: string[], rIdx: number) => (
                                            <div key={`rf-${rIdx}`} className="flex gap-1.5">
                                                {rowArr.map((cellValue: string, cIdx: number) => {
                                                    let isScan = st.scanR === rIdx && st.scanC === cIdx;
                                                    let isActive = st.activeR === rIdx && st.activeC === cIdx;
                                                    let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                                    let isVisited = st.vis && st.vis[rIdx][cIdx] === 1;
                                                    
                                                    let bgClass = cellValue === '0' ? 'bg-slate-50 text-slate-300 border-slate-200' :
                                                                  isVisited ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' :
                                                                  'bg-amber-50 text-amber-500 border-amber-200';

                                                    let ringClass = '';
                                                    let scaleClass = 'scale-100';
                                                    let zIndex = 'z-10';

                                                    if (isActive) {
                                                        ringClass = 'ring-2 ring-fuchsia-500 ring-offset-2';
                                                        scaleClass = 'scale-110';
                                                        zIndex = 'z-30';
                                                        bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-md'; 
                                                    } else if (isCheck) {
                                                        let isCheckingWater = cellValue === '0' || isVisited;
                                                        ringClass = isCheckingWater ? 'ring-2 ring-rose-400 ring-offset-2' : 'ring-2 ring-emerald-400 ring-offset-2';
                                                        scaleClass = 'scale-105';
                                                        zIndex = 'z-20';
                                                    } else if (isScan) {
                                                        ringClass = 'ring-2 ring-indigo-400 ring-offset-2';
                                                        scaleClass = 'scale-105';
                                                        zIndex = 'z-20';
                                                    }

                                                    let cellClass = `w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-mono font-bold text-xl md:text-2xl rounded-xl transition-all duration-300 border-2 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`;

                                                    return (
                                                        <div key={`cf-${rIdx}-${cIdx}`} className={cellClass}>
                                                            {cellValue}
                                                            <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-black/20 opacity-0 group-hover:opacity-100">{rIdx},{cIdx}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Queue Visual */}
                                    <div className="flex flex-col items-center shrink-0 w-[260px]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> Queue&lt;Pair&gt;</span>
                                        <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-2xl p-4 gap-2 relative min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-thin">
                                            <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                                                <span>FRONT (OUT)</span>
                                                <span>BACK (IN)</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 transition-all duration-500">
                                                {(st.q || []).map((val: {r: number, c: number}, i: number) => {
                                                    let isEntering = (st.phase === 'bfs_enqueue' || st.phase === 'bfs_enqueue_neigh') && i === st.q.length - 1;
                                                    return (
                                                        <div key={`qf-${i}-${val.r}-${val.c}`} className={`px-4 py-2 flex items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-amber-500 border-amber-600 animate-in slide-in-from-right-8' : 'bg-slate-700 border-slate-800'}`}>
                                                            ({val.r}, {val.c})
                                                        </div>
                                                    )
                                                })}
                                                {st.q && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Queue is empty</span>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                           )}

                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-sky-500 shadow-[0_0_150px_rgba(14,165,233,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-sky-500`}></div>
                                
                                <div className="w-24 h-24 bg-sky-500/20 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-sky-500/10"><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className="text-sky-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully mapped the entire grid surface.</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-sky-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Disconnected Islands Found</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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
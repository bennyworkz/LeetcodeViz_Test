import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  nearestCellBFS: {
    id: 'nearestCellBFS',
    title: 'Distance of Nearest 1 (Multi-Source BFS)',
    icon: <Route size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'sky',
    code: `class Node {
    int first;
    int second;
    int third;
    Node(int _first, int _second, int _third) {
        this.first = _first;
        this.second = _second;
        this.third = _third;
    }
}

class Solution {
    //Function to find distance of nearest 1 in the grid for each cell.
    public int[][] nearest(int[][] grid) {
        int n = grid.length;
        int m = grid[0].length;
        int vis[][] = new int[n][m];
        int dist[][] = new int[n][m];
        Queue<Node> q = new LinkedList<Node>();
        
        for(int i = 0;i<n;i++) {
            for(int j = 0;j<m;j++) {
                if(grid[i][j] == 1) {
                    q.add(new Node(i, j, 0));
                    vis[i][j] = 1;
                } else {
                    vis[i][j] = 0;
                }
            }
        }
        
        int delrow[] = {-1, 0, +1, 0};
        int delcol[] = {0, +1, 0, -1};
        
        while(!q.isEmpty()) {
            int row = q.peek().first;
            int col = q.peek().second;
            int steps = q.peek().third;
            q.remove();
            dist[row][col] = steps;
            
            for(int i = 0;i<4;i++) {
                int nrow = row + delrow[i];
                int ncol = col + delcol[i];
                
                if(nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] == 0) {
                    vis[nrow][ncol] = 1;
                    q.add(new Node(nrow, ncol, steps+1));
                }
            }
        }
        return dist;
    }
}`,
    desc: "Finding the distance of the nearest '1' for each cell using Multi-Source BFS. By enqueuing all '1's simultaneously at step 0, we guarantee that the first time the BFS wavefront reaches any '0', it is reaching it via the absolute shortest path. The queue dynamically tracks the increasing step distances as it radiates outward."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|nearest|Node|grid|vis|dist|row|col|nrow|ncol|steps|delrow|delcol|n|m|first|second|third|q|add|remove|isEmpty|peek|LinkedList|Queue|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'Node'].includes(part);
            const isPointer = ['grid', 'vis', 'dist', 'row', 'col', 'nrow', 'ncol', 'steps', 'delrow', 'delcol', 'n', 'm', 'first', 'second', 'third', 'q', 'i', 'j'].includes(part);
            const isMapCall = ['nearest', 'add', 'remove', 'isEmpty', 'peek', 'length'].includes(part);
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

// --- Color Gradient Helper for Distances ---
const getDistanceColor = (distVal: number | string) => {
    if (distVal === '-') return 'bg-white text-slate-300 border-slate-200';
    const val = typeof distVal === 'number' ? distVal : parseInt(distVal);
    if (val === 0) return 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
    if (val === 1) return 'bg-amber-400 text-white border-amber-500 shadow-sm';
    if (val === 2) return 'bg-orange-500 text-white border-orange-600 shadow-sm';
    if (val === 3) return 'bg-rose-500 text-white border-rose-600 shadow-sm';
    if (val >= 4) return 'bg-fuchsia-600 text-white border-fuchsia-700 shadow-sm';
    return 'bg-white text-slate-800 border-slate-300';
};

// --- Main Application ---

export default function NearestCellVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('nearestCellBFS');
  
  // Default matches Example 1 from the image
  const [gridInput, setGridInput] = useState('0 1 1 0 | 1 1 0 0 | 0 0 1 1');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.9);
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
        let parsed: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cols = rows[i].split(/\s+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
            if (cols.length > 0) parsed.push(cols);
        }
        
        if (parsed.length === 0) parsed = [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1]];
        
        // Equalize matrix rows
        let maxCols = Math.max(...parsed.map(r => r.length), 1);
        parsed = parsed.map(r => {
            while (r.length < maxCols) r.push(0);
            return r;
        });

        if (parsed.length > 10) parsed = parsed.slice(0, 10);
        parsed = parsed.map(r => r.slice(0, 10));

        setBaseGrid(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.9);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [gridInput]);

  // Robust Auto-scroll effect specifically targeting exact active line
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
    const grid = baseGrid;
    const n = grid.length;
    if (n === 0) return steps;
    const m = grid[0].length;
    if (m === 0) return steps;

    const q: {r: number, c: number, steps: number}[] = [];
    let vis: number[][] = Array(n).fill(0).map(() => Array(m).fill(0));
    let dist: (number | string)[][] = Array(n).fill(0).map(() => Array(m).fill('-'));
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid, n, m, q: [...q], vis: clone2D(vis), dist: clone2D(dist), ...st } 
    });

    add("Function Call", `public int[][] nearest(int[][] grid)\nInitiating Multi-Source BFS algorithm.`, 14, { phase: 'init' });
    
    add("Grid Dimensions", `int n = grid.length;\nint m = grid[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 15, { phase: 'init_ds' });
    
    add("Initialize Matrices", `int vis[][] = new int[n][m];\nint dist[][] = new int[n][m];\nAllocated arrays for visited states and final distances.`, 17, { phase: 'init_ds' });
    
    add("Initialize Queue", `Queue<Node> q = new LinkedList<Node>();\nCreated Queue to hold Nodes (row, col, steps).`, 19, { phase: 'init_ds' });

    for (let i = 0; i < n; i++) {
        add("Outer Grid Scan", `for(int i = 0;i<n;i++)\nScanning grid row ${i}.`, 21, { phase: 'scan', scanR: i });
        for (let j = 0; j < m; j++) {
            add("Inner Grid Scan", `for(int j = 0;j<m;j++)\nEvaluating cell (${i}, ${j}).`, 22, { phase: 'scan', scanR: i, scanC: j });
            
            add("Check for 1", `if(grid[i][j] == 1)\nIs the value exactly 1?`, 23, { phase: 'check_grid', scanR: i, scanC: j });

            if (grid[i][j] === 1) {
                q.push({r: i, c: j, steps: 0});
                add("Enqueue Source", `q.add(new Node(i, j, 0));\nFound a '1'! Queued as a source with initial distance = 0.`, 24, { phase: 'enq_src', scanR: i, scanC: j });
                
                vis[i][j] = 1;
                add("Mark Visited", `vis[i][j] = 1;\nMarked source cell (${i}, ${j}) as visited.`, 25, { phase: 'mark_vis', scanR: i, scanC: j });
            } else {
                vis[i][j] = 0;
                add("Mark Unvisited", `vis[i][j] = 0;\nValue is 0. Explicitly mapping as unvisited.`, 27, { phase: 'mark_unvis', scanR: i, scanC: j });
            }
        }
    }

    const delrow = [-1, 0, 1, 0];
    const delcol = [0, 1, 0, -1];

    add("Init Vectors", `int delrow[] = {-1, 0, +1, 0};\nint delcol[] = {0, +1, 0, -1};\nInitialized delta vectors for 4-directional spreading.`, 32, { phase: 'bfs_setup' });

    while (q.length > 0) {
        add("Queue Check", `while(!q.isEmpty())\nQueue has ${q.length} nodes ready to propagate.`, 35, { phase: 'bfs_while' });
        
        let curr = q[0];
        add("Peek Queue", `int row = q.peek().first; ...\nPeeking node (${curr.r}, ${curr.c}) carrying steps = ${curr.steps}.`, 36, { phase: 'bfs_peek', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps });

        q.shift();
        add("Dequeue Node", `q.remove();\nPopped active node from the queue.`, 39, { phase: 'bfs_dequeue', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps });
        
        dist[curr.r][curr.c] = curr.steps;
        add("Assign Final Distance", `dist[row][col] = steps;\nLocked in distance ${curr.steps} for cell (${curr.r}, ${curr.c}) in the output matrix.`, 40, { phase: 'assign_dist', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps });

        add("Neighbor Loop", `for(int i = 0;i<4;i++)\nPreparing to check all 4 neighbors.`, 42, { phase: 'for_adj', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps });

        for (let i = 0; i < 4; i++) {
            let nrow = curr.r + delrow[i];
            let ncol = curr.c + delcol[i];

            add("Calculate Neighbor Coords", `int nrow = row + delrow[i];\nNeighbor coordinates: (${nrow}, ${ncol}).`, 43, { phase: 'calc_adj', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps, checkR: nrow, checkC: ncol });

            add("Check Validity", `if(nrow >= 0 ... && vis[nrow][ncol] == 0)\nValidating grid bounds and ensuring cell is unvisited.`, 46, { phase: 'check_validity', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps, checkR: nrow, checkC: ncol });

            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] === 0) {
                vis[nrow][ncol] = 1;
                add("Mark Neighbor Visited", `vis[nrow][ncol] = 1;\nValid unvisited neighbor found! Marking as visited.`, 47, { phase: 'mark_adj', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps, checkR: nrow, checkC: ncol });

                q.push({r: nrow, c: ncol, steps: curr.steps + 1});
                add("Enqueue Neighbor", `q.add(new Node(nrow, ncol, steps+1));\nEnqueued (${nrow}, ${ncol}) with incremented distance: ${curr.steps + 1}.`, 48, { phase: 'enq_adj', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps, checkR: nrow, checkC: ncol });
            } else {
                add("Skip Neighbor", `Condition failed. Cell (${nrow}, ${ncol}) is either out of bounds or already visited.`, 46, { phase: 'skip_adj', activeR: curr.r, activeC: curr.c, activeSteps: curr.steps, checkR: nrow, checkC: ncol });
            }
        }
    }

    add("Queue Empty", `while(!q.isEmpty())\nQueue exhausted. The entire grid has been mapped.`, 35, { phase: 'bfs_done' });
    
    add("Return Distance Matrix", `return dist;\nAlgorithm complete. Returning the final populated distance matrix.`, 52, { phase: 'done', isDone: true, isSuccess: true });

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
    setZoom(0.9); 
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

  // Abstracted Trace Operations Component
  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-sky-900 border-sky-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Route size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                    <PartyPopper size={24}/> MATRIX MAPPED COMPLETELY
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Every empty cell (0) is now mapped to its nearest distance.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('enq') || st.phase === 'mark_adj' || st.phase === 'assign_dist' ? 'text-emerald-400' : (st.phase.includes('peek') || st.phase.includes('dequeue') ? 'text-amber-400' : (st.phase.includes('check') || st.phase.includes('scan') ? 'text-indigo-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.grid === undefined) return null;
      let isDone = st.isDone;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isDone ? 'border-sky-400 ring-4 ring-sky-100' : 'border-slate-200'} scale-105 z-40`}>
              {isDone ? (
                  <div className="flex flex-col items-center justify-center gap-4 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-sky-600`}>
                          <CheckCircle2 size={16}/> Final Result Returned
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full break-all text-sky-700 bg-sky-100 border-sky-400`}>
                          return dist;
                      </div>
                      <button onClick={handleReset} className={`mt-2 py-3 px-8 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-sm bg-sky-500 hover:bg-sky-600`}>
                          <RotateCcw size={18}/> RESTART SIMULATION
                      </button>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[70px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><Search size={12}/> Outer Scan Loop</span>
                          <div className={`border-2 text-sm font-black px-6 py-2 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 shadow-sm flex flex-col items-center min-w-[80px]`}>
                              <span>(i, j) = <span className="text-indigo-500">{st.scanR !== undefined && st.scanC !== undefined ? `(${st.scanR}, ${st.scanC})` : '-'}</span></span>
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active Node (r, c)</span>
                          <div className={`border-2 text-xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('bfs') || st.phase === 'assign_dist' ? 'bg-amber-100 border-amber-400 text-amber-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeR !== undefined ? `(${st.activeR}, ${st.activeC})` : '-'}
                              {st.activeSteps !== undefined && <span className="text-xs ml-2 text-amber-600">D:{st.activeSteps}</span>}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1"><ZoomIn size={12}/> Checking AdjNode</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-2xl transition-all duration-300 ${st.checkNode !== undefined || st.checkR !== undefined ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-sm animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.checkR !== undefined ? `(${st.checkR}, ${st.checkC})` : '-'}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderSimulationState = () => {
      if (st.grid === undefined) return null;

      // Extract valid neighbors logic for Adjacency Explorer
      let activeNeighbors: {r: number, c: number, valid: boolean}[] = [];
      if (st.activeR !== undefined && st.activeC !== undefined) {
          const drow = [-1, 0, 1, 0];
          const dcol = [0, 1, 0, -1];
          for (let i = 0; i < 4; i++) {
              let nr = st.activeR + drow[i];
              let nc = st.activeC + dcol[i];
              let isValid = nr >= 0 && nr < st.n && nc >= 0 && nc < st.m;
              activeNeighbors.push({r: nr, c: nc, valid: isValid});
          }
      }

      return (
          <>
             {/* LEFT COLUMN: Input Grid & Distance Output */}
             <div className="flex flex-col gap-6 shrink-0 relative">
                 
                 {/* Distance Matrix (Main Output) */}
                 <div className="relative flex flex-col gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10 shrink-0 mx-auto">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Distance Matrix (dist[][])</span>
                     {st.dist.map((rowArr: (number|string)[], rIdx: number) => (
                         <div key={`dist-r-${rIdx}`} className="flex gap-1 md:gap-1.5">
                             {rowArr.map((cellValue: number|string, cIdx: number) => {
                                 let isAssigning = st.phase === 'assign_dist' && st.activeR === rIdx && st.activeC === cIdx;
                                 
                                 let bgClass = getDistanceColor(cellValue);
                                 let ringClass = 'border-2';
                                 let scaleClass = 'scale-100';
                                 let zIndex = 'z-10';

                                 if (isAssigning) {
                                     ringClass = 'ring-4 ring-sky-500 ring-offset-2 border-transparent shadow-xl';
                                     scaleClass = 'scale-125';
                                     zIndex = 'z-30';
                                 }

                                 return (
                                     <div 
                                         key={`dist-c-${rIdx}-${cIdx}`}
                                         className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-black text-xl md:text-2xl rounded-xl transition-all duration-300 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`}
                                     >
                                         {cellValue}
                                         <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-black/20 opacity-0 group-hover:opacity-100">{rIdx},{cIdx}</span>
                                     </div>
                                 );
                             })}
                         </div>
                     ))}
                 </div>

                 <div className="flex gap-6 justify-center">
                    {/* Input Grid (Small Reference) */}
                    <div className="relative flex flex-col gap-1 p-3 bg-white/80 rounded-2xl shadow-lg border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                        <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Input Grid</span>
                        {st.grid.map((rowArr: number[], rIdx: number) => (
                            <div key={`gr-${rIdx}`} className="flex gap-1">
                                {rowArr.map((cellValue: number, cIdx: number) => {
                                    let isScan = st.scanR === rIdx && st.scanC === cIdx && st.phase.includes('scan');
                                    let bgClass = cellValue === 1 ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-slate-50 text-slate-300 border-slate-200';
                                    let ringClass = isScan ? 'ring-2 ring-indigo-400 ring-offset-1 z-20 scale-110' : 'border border-transparent z-10';
                                    
                                    return (
                                        <div key={`gc-${rIdx}-${cIdx}`} className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded-md transition-all duration-300 relative select-none ${bgClass} ${ringClass}`}>
                                            {cellValue}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Visited Array (Small Reference) */}
                    <div className="relative flex flex-col gap-1 p-3 bg-white/80 rounded-2xl shadow-lg border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                        <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">vis[][]</span>
                        {st.vis.map((rowArr: number[], rIdx: number) => (
                            <div key={`vr-${rIdx}`} className="flex gap-1">
                                {rowArr.map((cellValue: number, cIdx: number) => {
                                    let isMarked = st.phase.includes('mark_vis') && st.scanR === rIdx && st.scanC === cIdx;
                                    let isNeighMarked = st.phase === 'mark_adj' && st.checkR === rIdx && st.checkC === cIdx;
                                    let isChecking = st.checkR === rIdx && st.checkC === cIdx;

                                    let bgClass = cellValue === 1 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 text-slate-300 border-slate-200';
                                    let ringClass = (isMarked || isNeighMarked) ? 'ring-2 ring-emerald-400 ring-offset-1 z-20 scale-110' : isChecking ? 'ring-2 ring-sky-400 ring-offset-1 z-20 scale-110' : 'border border-transparent z-10';
                                    
                                    return (
                                        <div key={`vc-${rIdx}-${cIdx}`} className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded-md transition-all duration-300 relative select-none ${bgClass} ${ringClass}`}>
                                            {cellValue}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                 </div>

             </div>

             {/* RIGHT COLUMN: Queue & Dynamic Adjacency */}
             <div className="flex flex-col gap-4 z-20 items-center justify-start shrink-0 w-[240px] md:w-[320px]">
                 
                 {/* Dynamic Adjacency Explorer Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><ListTree size={12}/> Neighbor Discovery</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-4 relative min-h-[120px]">
                         {st.activeR !== undefined && st.activeC !== undefined ? (
                             <div className="flex flex-col gap-3">
                                 <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Node:</span>
                                     <div className="bg-amber-500 text-white px-3 py-1 rounded-lg font-mono font-bold shadow-sm">
                                         ({st.activeR}, {st.activeC})
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-2 mt-2">
                                     <ArrowRight size={16} className="text-slate-400"/>
                                     <div className="flex flex-wrap gap-2 items-center">
                                         <span className="text-slate-400 font-mono text-lg">{'{'}</span>
                                         {activeNeighbors.map((n, idx) => {
                                             let isChecking = st.checkR === n.r && st.checkC === n.c;
                                             let isVisited = n.valid && st.vis[n.r][n.c] === 1;
                                             
                                             let bgClass = 'bg-slate-100 text-slate-500';
                                             if (isChecking) {
                                                 if (!n.valid || isVisited) bgClass = 'bg-rose-500 text-white shadow-md animate-pulse';
                                                 else bgClass = 'bg-emerald-500 text-white shadow-md animate-pulse';
                                             }

                                             return (
                                                 <React.Fragment key={`adj-${idx}`}>
                                                     <div className={`px-2 py-1 rounded-md font-mono text-xs font-bold transition-all duration-300 ${bgClass}`}>
                                                         ({n.r},{n.c})
                                                     </div>
                                                     {idx < 3 && <span className="text-slate-300 font-mono">,</span>}
                                                 </React.Fragment>
                                             )
                                         })}
                                         <span className="text-slate-400 font-mono text-lg">{'}'}</span>
                                     </div>
                                 </div>
                                 {!st.isDone && <p className="text-[10px] text-slate-400 italic text-center mt-2">Iterating 4 directions...</p>}
                             </div>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-400 italic text-sm py-6">
                                 Waiting for active node...
                             </div>
                         )}
                     </div>
                 </div>

                 {/* Queue Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> Queue&lt;Node(r, c, steps)&gt;</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                         <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                             <span>FRONT (OUT)</span>
                             <span>BACK (IN)</span>
                         </div>
                         
                         <div className="flex flex-wrap gap-2 transition-all duration-500">
                             {(st.q || []).map((val: {r: number, c: number, steps: number}, i: number) => {
                                 let isEntering = (st.phase === 'enq_src' || st.phase === 'enq_adj') && i === st.q.length - 1;
                                 let isTop = i === 0;
                                 
                                 return (
                                     <div key={`qf-${i}-${val.r}-${val.c}`} className={`px-2 py-1 flex flex-col items-center justify-center font-mono font-bold text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8' : (isTop ? 'bg-amber-500 border-amber-600' : 'bg-slate-700 border-slate-800')}`}>
                                         <span className="text-xs">({val.r},{val.c})</span>
                                         <span className="text-[9px] opacity-70">s={val.steps}</span>
                                     </div>
                                 )
                             })}
                             {st.q && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Queue is empty</span>}
                         </div>
                     </div>
                 </div>

                 {/* Variables State Panel */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Database size={12}/> Trace Variables</span>
                     <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-4 flex flex-col gap-2 font-mono text-[11px] md:text-xs">
                         <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <div className="flex justify-between border-b border-slate-100 pb-1">
                                 <span className="text-slate-400">n:</span>
                                 <span className="font-bold text-slate-700">{st.n !== undefined ? st.n : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1">
                                 <span className="text-slate-400">m:</span>
                                 <span className="font-bold text-slate-700">{st.m !== undefined ? st.m : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                                 <span className="text-amber-500">row, col:</span>
                                 <span className="font-bold text-amber-700">{st.activeR !== undefined ? `(${st.activeR}, ${st.activeC})` : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-emerald-500">steps:</span>
                                 <span className="font-bold text-emerald-700">{st.activeSteps !== undefined ? st.activeSteps : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-sky-500">nrow, ncol:</span>
                                 <span className="font-bold text-sky-700">{st.checkR !== undefined ? `(${st.checkR}, ${st.checkC})` : '-'}</span>
                             </div>
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
                      Matrix Graph Traversal
                  </span>
                  <span>•</span>
                  <span>Queue Based Distance Search</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Route size={28}/> Nearest Manhattan Distance</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a binary grid of <code>n * m</code>, find the distance of the nearest <code>1</code> in the grid for each cell.</p>
                        <p>The distance is calculated using Manhattan Distance: <code>|i1 - i2| + |j1 - j2|</code>. In the context of a grid where you can move Up, Right, Down, Left, this perfectly aligns with Breadth-First Search levels.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> grid = [[0,1,1,0],[1,1,0,0],[0,0,1,1]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[[1,0,0,1],[0,0,1,1],[1,1,0,0]]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           The grid is: <br/>
                           0 1 1 0<br/>
                           1 1 0 0<br/>
                           0 0 1 1<br/>
                           0's at (0,0), (0,3), (1,2), (1,3), (2,0) and (2,1) are at a distance of 1 from the nearest 1's.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowLeftRight size={16}/> 1. Multi-Source Push</span>
                            <p className="text-sm text-slate-500">Instead of doing a BFS from every single 0 (which takes $O((N \times M)^2)$ time), we push ALL 1s into the Queue at distance 0 initially. They all form the starting wavefront simultaneously.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-sky-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><AlertTriangle size={16}/> 2. Outward Propagation</span>
                            <p className="text-sm text-slate-500">As the BFS iterates, it pops a cell and checks its 4 neighbors. If a neighbor is an unvisited 0, it gets enqueued with <code>steps + 1</code>. Since it's BFS, the first time a 0 is visited, it is mathematically guaranteed to be the shortest path!</p>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Matrix (Use | for rows)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="0 1 1 0 | 1 1 0 0 | 0 0 1 1" />
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
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Distance Mapping Visualizer</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-sky-100 text-sky-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how Multi-Source BFS acts as an expanding wave to instantly guarantee shortest paths.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-emerald-500"/> Why Multi-Source BFS?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If you ran a standard BFS from every single 0 to find the nearest 1, the Time Complexity would be disastrous. A grid of all 0s and one 1 would take $O((N \times M)^2)$. By collecting all 1s and pushing them into the queue at once, they all act as distance=0 sources. As they expand outward, the waves collide, but because we mark cells as visited immediately, a cell is only updated by the very first wave that hits it—which inherently is the shortest distance!</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> Managing Visited States</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We initialize a separate <code>vis[][]</code> array. We mark all original 1s as visited before the BFS loop even begins. This ensures that the BFS waves only ever spread into the unvisited 0s, replacing them with their accurate step distances. Without `vis`, nodes would repeatedly enqueue each other forever.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-indigo-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>The algorithm processes each cell in the grid exactly once during the initial nested loops, and at most once during the BFS queue operations. Even when checking 4 directions, 4 is a constant multiplier. Thus, Time is strictly $O(N \times M)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>We allocate $O(N \times M)$ for the `vis` matrix, and $O(N \times M)$ for the `dist` matrix. The Queue, in the absolute worst-case where every cell is a 1, will hold $N \times M$ elements initially. Therefore, total Space Complexity is bounded securely by $O(N \times M)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-sky-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Distance of nearest 1 (01 Matrix) is a beloved problem for testing graph foundations. Interviewers will check if you immediately identify Multi-Source BFS over brute force."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we optimize the space by dropping the `vis[][]` array entirely?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, with a clever trick!"</p>
                            <p>We can omit the `vis` array by initializing our <code>dist</code> matrix with a massive number (like <code>Integer.MAX_VALUE</code>) for all '0' cells, and `0` for all '1' cells. When evaluating neighbors, instead of checking <code>!vis[nrow][ncol]</code>, we check <code>dist[nrow][ncol] &gt; steps + 1</code>. If true, we update the distance and enqueue. This cuts the auxiliary space usage in half."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if we solved it using Dynamic Programming (DP) without BFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's possible and actually more efficient for Space."</p>
                            <p>We can solve it in $O(N \times M)$ time and strictly $O(1)$ extra space (excluding the output array). We make two sweeps over the matrix. <strong>Sweep 1 (Top-Left to Bottom-Right):</strong> Check cells above and to the left to see if we can reach a 1 quicker. <strong>Sweep 2 (Bottom-Right to Top-Left):</strong> Check cells below and to the right. This naturally resolves all Manhattan Distances without needing a Queue!"</p>
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
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Matrix (Use | for rows)</label>
                                    <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold min-w-[300px]`} placeholder="0 1 1 0 | 1 1 0 0 | 0 0 1 1" />
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
              </div>
          </div>
      )}
    </div>
  );
}
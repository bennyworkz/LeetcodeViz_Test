import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  enclavesBFS: {
    id: 'enclavesBFS',
    title: 'Number of Enclaves (Multi-Source BFS)',
    icon: <Waves size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'teal',
    code: `class Pair {
    int first, second;
    Pair(int f, int s) { first = f; second = s; }
}

class Solution {
    public int numEnclaves(int[][] grid) {
        Queue<Pair> q = new LinkedList<Pair>();
        int n = grid.length;
        int m = grid[0].length;
        int vis[][] = new int[n][m];

        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(i == 0 || j == 0 || i == n-1 || j == m-1) {
                    if(grid[i][j] == 1) {
                        q.add(new Pair(i, j));
                        vis[i][j] = 1;
                    }
                }
            }
        }

        int delrow[] = {-1, 0, +1, 0};
        int delcol[] = {0, +1, 0, -1};

        while(!q.isEmpty()) {
            int row = q.peek().first;
            int col = q.peek().second;
            q.remove();

            for(int i = 0; i < 4; i++) {
                int nrow = row + delrow[i];
                int ncol = col + delcol[i];

                if(nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1) {
                    q.add(new Pair(nrow, ncol));
                    vis[nrow][ncol] = 1;
                }
            }
        }

        int enclaves = 0;
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(grid[i][j] == 1 && vis[i][j] == 0) {
                    enclaves++;
                }
            }
        }
        return enclaves;
    }
}`,
    desc: "Counting trapped landmasses using BFS. We first identify all land cells ('1's) touching the boundary and push them to a Queue. We then run a Multi-Source BFS spreading radially to mark them and their connected continents as 'safe' (visited). Afterward, any unvisited land is an enclave."
  },
  enclavesDFS: {
    id: 'enclavesDFS',
    title: 'Number of Enclaves (Boundary DFS)',
    icon: <ArrowDownToLine size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'indigo',
    code: `class Solution {
    private void dfs(int row, int col, int[][] vis, int[][] grid) {
        vis[row][col] = 1;
        int n = grid.length;
        int m = grid[0].length;
        int delrow[] = {-1, 0, +1, 0};
        int delcol[] = {0, 1, 0, -1};
        
        for(int i = 0; i < 4; i++) {
            int nrow = row + delrow[i];
            int ncol = col + delcol[i];
            
            if(nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1) {
                dfs(nrow, ncol, vis, grid);
            }
        }
    }

    public int numEnclaves(int[][] grid) {
        int n = grid.length;
        int m = grid[0].length;
        int vis[][] = new int[n][m];

        for(int j = 0; j < m; j++) {
            if(grid[0][j] == 1 && vis[0][j] == 0) {
                dfs(0, j, vis, grid);
            }
            if(grid[n-1][j] == 1 && vis[n-1][j] == 0) {
                dfs(n-1, j, vis, grid);
            }
        }
        
        for(int i = 0; i < n; i++) {
            if(grid[i][0] == 1 && vis[i][0] == 0) {
                dfs(i, 0, vis, grid);
            }
            if(grid[i][m-1] == 1 && vis[i][m-1] == 0) {
                dfs(i, m-1, vis, grid);
            }
        }

        int enclaves = 0;
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(grid[i][j] == 1 && vis[i][j] == 0) {
                    enclaves++;
                }
            }
        }
        return enclaves;
    }
}`,
    desc: "Counting trapped landmasses using DFS. Instead of enqueuing boundaries, we loop directly over the 4 edges of the matrix. If we find an unvisited '1', we launch a deep recursive Depth-First Search plunging through all connected land to mark it safe. Unvisited land left behind is an enclave."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|return|if|else|new|for|while|dfs|numEnclaves|Pair|first|second|grid|vis|n|m|q|add|isEmpty|peek|remove|length|delrow|delcol|row|col|nrow|ncol|enclaves)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'Pair'].includes(part);
            const isPointer = ['grid', 'vis', 'row', 'col', 'nrow', 'ncol', 'delrow', 'delcol', 'n', 'm', 'i', 'j', 'first', 'second', 'enclaves', 'q'].includes(part);
            const isMapCall = ['dfs', 'numEnclaves', 'add', 'remove', 'isEmpty', 'peek', 'length'].includes(part);
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

// --- Color Gradient Helper for Cells ---
const getCellTheme = (val: number, r: number, c: number, isEnclave: boolean, isVisited: boolean) => {
    if (isEnclave) return 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30 animate-pulse'; // Trapped enclave
    if (val === 0) return 'bg-sky-50 text-sky-300 border-sky-200'; // Sea
    if (val === 1) {
        if (isVisited) return 'bg-emerald-500 text-white border-emerald-600 shadow-md'; // Safe boundary land
        return 'bg-amber-400 text-white border-amber-500 shadow-md'; // Unvisited land (potentially trapped)
    }
    return 'bg-white text-slate-800 border-slate-300';
};

// --- Main Application ---

export default function NumberOfEnclavesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [algoType, setAlgoType] = useState<'BFS' | 'DFS'>('BFS');
  const selectedOpId = algoType === 'BFS' ? 'enclavesBFS' : 'enclavesDFS';
  
  // Default matches LeetCode Example 1
  const [gridInput, setGridInput] = useState('0 0 0 0 | 1 0 1 0 | 0 1 1 0 | 0 0 0 0');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [0, 0, 0, 0],
      [1, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
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
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = gridInput.split('|').map(r => r.trim());
        let parsed: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cols = rows[i].split(/\s+/).map(Number).filter(n => !isNaN(n));
            if (cols.length > 0) parsed.push(cols);
        }
        
        if (parsed.length === 0) parsed = [[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]];
        
        // Equalize matrix rows
        let maxCols = Math.max(...parsed.map(r => r.length), 1);
        parsed = parsed.map(r => {
            while (r.length < maxCols) r.push(0); // Pad with Sea
            return r;
        });

        if (parsed.length > 8) parsed = parsed.slice(0, 8);
        parsed = parsed.map(r => r.slice(0, 8));

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

  useEffect(() => {
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.9);
  }, [algoType]);

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
  }, [currentStep, isFullscreen, activeTab, algoType]);

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

    if (algoType === 'BFS') {
        const q: {r: number, c: number}[] = [];
        let vis: number[][] = Array(n).fill(0).map(() => Array(m).fill(0));
        let enclaveMask: boolean[][] = Array(n).fill(false).map(() => Array(m).fill(false));
        let enclaves = 0;
        
        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { grid, enclaveMask: clone2D(enclaveMask), n, m, q: [...q], vis: clone2D(vis), enclaves, ...st } 
        });

        add("Function Call", `public int numEnclaves(int[][] grid)\nInitiating Multi-Source BFS to count trapped enclaves.`, 7, { phase: 'init' });
        add("Initialize Queue", `Queue<Pair> q = new LinkedList<Pair>();\nCreated Queue to hold all safe boundary cells.`, 8, { phase: 'init_ds' });
        add("Grid Dimensions", `int n = grid.length;\nint m = grid[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 9, { phase: 'init_ds' });
        add("Init Visited Matrix", `int vis[][] = new int[n][m];\nAllocated visited array initialized with 0s.`, 11, { phase: 'init_ds' });
        
        // Scan all boundary cells
        for (let i = 0; i < n; i++) {
            add("Outer Boundary Scan", `for(int i = 0; i < n; i++)\nScanning row ${i}.`, 13, { phase: 'scan_boundary', scanR: i });
            for (let j = 0; j < m; j++) {
                add("Inner Boundary Scan", `for(int j = 0; j < m; j++)\nScanning cell (${i}, ${j}).`, 14, { phase: 'scan_boundary', scanR: i, scanC: j });
                
                add("Check Boundary Target", `if(i == 0 || j == 0 || i == n-1 || j == m-1)\nIs cell (${i}, ${j}) touching the grid's boundary?`, 15, { phase: 'check_bounds', scanR: i, scanC: j });
                
                if (i === 0 || j === 0 || i === n - 1 || j === m - 1) {
                    add("Evaluate Land", `if(grid[i][j] == 1)\nCell is on boundary. Is it land (1)?`, 16, { phase: 'eval_land', scanR: i, scanC: j });
                    if (grid[i][j] === 1) {
                        q.push({r: i, c: j});
                        add("Enqueue Safe Land", `q.add(new Pair(i, j));\nFound boundary land! It's safe. Adding to BFS queue.`, 17, { phase: 'enq_boundary', scanR: i, scanC: j });
                        
                        vis[i][j] = 1;
                        add("Mark Safe", `vis[i][j] = 1;\nMarking boundary cell (${i}, ${j}) as visited (safe).`, 18, { phase: 'mark_vis', scanR: i, scanC: j });
                    }
                }
            }
        }

        const delrow = [-1, 0, 1, 0];
        const delcol = [0, 1, 0, -1];
        add("Init Vectors", `int delrow[] = {-1, 0, +1, 0};\nint delcol[] = {0, +1, 0, -1};\nInitialized directional vectors for BFS spreading.`, 24, { phase: 'bfs_setup' });

        while (q.length > 0) {
            add("Queue Check", `while(!q.isEmpty())\nQueue has ${q.length} safe nodes ready to propagate.`, 27, { phase: 'bfs_while' });
            
            let curr = q[0];
            add("Peek Row", `int row = q.peek().first;\nExtracted row ${curr.r} from queue front.`, 28, { phase: 'bfs_peek', activeR: curr.r, activeC: curr.c });
            add("Peek Col", `int col = q.peek().second;\nExtracted col ${curr.c} from queue front.`, 29, { phase: 'bfs_peek', activeR: curr.r, activeC: curr.c });
            
            q.shift();
            add("Dequeue Node", `q.remove();\nPopped active safe node from the queue.`, 30, { phase: 'bfs_dequeue', activeR: curr.r, activeC: curr.c });
            
            add("Neighbor Loop", `for(int i = 0; i < 4; i++)\nPreparing to check all 4 neighbors.`, 32, { phase: 'for_adj', activeR: curr.r, activeC: curr.c });

            for (let i = 0; i < 4; i++) {
                let nrow = curr.r + delrow[i];
                add("Calc Neighbor Row", `int nrow = row + delrow[i];\nCalculated neighbor row: ${nrow}.`, 33, { phase: 'calc_adj', activeR: curr.r, activeC: curr.c, checkR: nrow });
                
                let ncol = curr.c + delcol[i];
                add("Calc Neighbor Col", `int ncol = col + delcol[i];\nCalculated neighbor col: ${ncol}.`, 34, { phase: 'calc_adj', activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol });

                add("Check Validity", `if(nrow >= 0 ... && vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1)\nValidating bounds, ensuring it's unvisited land (1).`, 36, { phase: 'check_validity', activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol });

                if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] === 0 && grid[nrow][ncol] === 1) {
                    q.push({r: nrow, c: ncol});
                    add("Enqueue Safe Neighbor", `q.add(new Pair(nrow, ncol));\nFound connected land! It's safe. Enqueued (${nrow}, ${ncol}).`, 37, { phase: 'enq_adj', activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol });
                    
                    vis[nrow][ncol] = 1;
                    add("Mark Neighbor Safe", `vis[nrow][ncol] = 1;\nMarked connected neighbor as visited (safe).`, 38, { phase: 'mark_adj', activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol });
                } else {
                    add("Skip Neighbor", `Condition failed. Cell is either sea (0), out of bounds, or already safe.`, 36, { phase: 'skip_adj', activeR: curr.r, activeC: curr.c, checkR: nrow, checkC: ncol });
                }
            }
        }

        add("Queue Empty", `while(!q.isEmpty())\nQueue exhausted. All safe lands connected to boundaries are marked.`, 27, { phase: 'bfs_done' });
        
        add("Init Enclaves", `int enclaves = 0;\nInitializing counter for trapped landmasses.`, 43, { phase: 'init_enclaves' });

        for (let i = 0; i < n; i++) {
            add("Final Outer Scan", `for(int i = 0; i < n; i++)\nFinal full grid sweep to count trapped land. Row ${i}.`, 44, { phase: 'final_scan', scanR: i });
            for (let j = 0; j < m; j++) {
                add("Final Inner Scan", `for(int j = 0; j < m; j++)\nChecking cell (${i}, ${j}).`, 45, { phase: 'final_scan', scanR: i, scanC: j });
                
                add("Check Trapped", `if(grid[i][j] == 1 && vis[i][j] == 0)\nIs cell (${i}, ${j}) land AND unvisited (unsafe)?`, 46, { phase: 'check_trapped', scanR: i, scanC: j });
                if (grid[i][j] === 1 && vis[i][j] === 0) {
                    enclaves++;
                    enclaveMask[i][j] = true;
                    add("Count Trapped", `enclaves++;\nYes! Cell is an enclave. Incrementing count to ${enclaves}.`, 47, { phase: 'count_enclave', scanR: i, scanC: j });
                } else {
                    add("Skip Cell", `Cell is either sea (0) or safe land (visited). Ignore.`, 46, { phase: 'skip_enclave', scanR: i, scanC: j });
                }
            }
        }

        add("Return Enclaves", `return enclaves;\nAlgorithm complete. Returning total enclaves: ${enclaves}.`, 51, { phase: 'done', isDone: true, isSuccess: true, finalAns: enclaves });

        return steps;

    } else {
        // DFS APPROACH TRACE
        const stack: {r: number, c: number}[] = [];
        let vis: number[][] = Array(n).fill(0).map(() => Array(m).fill(0));
        let enclaveMask: boolean[][] = Array(n).fill(false).map(() => Array(m).fill(false));
        let enclaves = 0;

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { grid, enclaveMask: clone2D(enclaveMask), n, m, stack: [...stack], vis: clone2D(vis), enclaves, ...st } 
        });

        add("Function Call", `public int numEnclaves(int[][] grid)\nInitiating DFS Boundary scan to find safe land.`, 19, { phase: 'init' });
        
        add("Grid Dimensions", `int n = grid.length;\nint m = grid[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 20, { phase: 'init_ds' });
        add("Init Visited Matrix", `int vis[][] = new int[n][m];\nAllocated visited array initialized with 0s.`, 22, { phase: 'init_ds' });

        const runDFS = (r: number, c: number) => {
            stack.push({r, c});
            add("DFS Enter", `private void dfs(int row=${r}, int col=${c}, ...)\nEntering deep recursion for cell (${r}, ${c}).`, 2, { phase: 'dfs_enter', activeR: r, activeC: c, scanR: stack[0]?.r, scanC: stack[0]?.c });
            
            vis[r][c] = 1;
            add("Mark Safe", `vis[row][col] = 1;\nMarking boundary-connected land (${r}, ${c}) as visited (safe).`, 3, { phase: 'mark_vis', activeR: r, activeC: c, scanR: stack[0]?.r, scanC: stack[0]?.c });

            const delrow = [-1, 0, 1, 0];
            const delcol = [0, 1, 0, -1];
            add("Init DFS Vectors", `int n = grid.length; ... int delcol[] = {...};\nSetting up directional vectors.`, 6, { phase: 'dfs_setup', activeR: r, activeC: c, scanR: stack[0]?.r, scanC: stack[0]?.c });

            add("Neighbor Loop", `for(int i = 0; i < 4; i++)\nChecking 4 neighbors...`, 9, { phase: 'for_adj', activeR: r, activeC: c, scanR: stack[0]?.r, scanC: stack[0]?.c });

            for (let i = 0; i < 4; i++) {
                let nrow = r + delrow[i];
                let ncol = c + delcol[i];

                add("Calc Neighbor Coords", `int nrow = row + delrow[i];\nint ncol = col + delcol[i];\nLooking at neighbor (${nrow}, ${ncol}).`, 10, { phase: 'calc_adj', activeR: r, activeC: c, checkR: nrow, checkC: ncol, scanR: stack[0]?.r, scanC: stack[0]?.c });

                add("Check Validity", `if(nrow >= 0 ... && vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1)\nIs neighbor a valid, unvisited '1'?`, 13, { phase: 'check_validity', activeR: r, activeC: c, checkR: nrow, checkC: ncol, scanR: stack[0]?.r, scanC: stack[0]?.c });

                if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] === 0 && grid[nrow][ncol] === 1) {
                    add("Valid DFS Neighbor", `dfs(nrow, ncol, vis, grid);\nFound connected safe land at (${nrow}, ${ncol}). Plunging deeper!`, 14, { phase: 'call_dfs', activeR: r, activeC: c, checkR: nrow, checkC: ncol, scanR: stack[0]?.r, scanC: stack[0]?.c });
                    runDFS(nrow, ncol);
                    add("DFS Backtrack", `Returned to node (${r}, ${c}) after exploring neighbor (${nrow}, ${ncol}).`, 9, { phase: 'dfs_backtrack', activeR: r, activeC: c, scanR: stack[0]?.r, scanC: stack[0]?.c });
                } else {
                    add("Skip Neighbor", `Condition failed. Cell is either out of bounds, visited, or sea (0).`, 13, { phase: 'skip_adj', activeR: r, activeC: c, checkR: nrow, checkC: ncol, scanR: stack[0]?.r, scanC: stack[0]?.c });
                }
            }

            stack.pop();
            add("DFS Exit", `}\nFinished 4 directions for (${r}, ${c}). Popping from call stack.`, 2, { phase: 'dfs_exit', activeR: r, activeC: c, scanR: stack[0]?.r, scanC: stack[0]?.c });
        };

        // Top/Bottom Row Loop
        for (let j = 0; j < m; j++) {
            add("Top/Bottom Row Scan", `for(int j = 0; j < m; j++)\nScanning Top (0, ${j}) and Bottom (${n-1}, ${j}) boundaries.`, 24, { phase: 'scan', scanR: 0, scanC: j });
            
            add("Check Top Boundary", `if(grid[0][j] == 1 && vis[0][j] == 0)\nIs Top boundary cell (0, ${j}) unvisited land?`, 25, { phase: 'check_grid', scanR: 0, scanC: j });
            if (grid[0][j] === 1 && vis[0][j] === 0) {
                add("Found Boundary Land", `dfs(0, j, vis, grid);\nTriggering DFS to mark this and connected land as safe.`, 26, { phase: 'found_boundary', scanR: 0, scanC: j });
                runDFS(0, j);
            }

            add("Check Bottom Boundary", `if(grid[n-1][j] == 1 && vis[n-1][j] == 0)\nIs Bottom boundary cell (${n-1}, ${j}) unvisited land?`, 28, { phase: 'check_grid', scanR: n-1, scanC: j });
            if (grid[n-1][j] === 1 && vis[n-1][j] === 0) {
                add("Found Boundary Land", `dfs(n-1, j, vis, grid);\nTriggering DFS to mark this and connected land as safe.`, 29, { phase: 'found_boundary', scanR: n-1, scanC: j });
                runDFS(n-1, j);
            }
        }

        // Left/Right Col Loop
        for (let i = 0; i < n; i++) {
            add("Left/Right Col Scan", `for(int i = 0; i < n; i++)\nScanning Left (${i}, 0) and Right (${i}, ${m-1}) boundaries.`, 33, { phase: 'scan', scanR: i, scanC: 0 });
            
            add("Check Left Boundary", `if(grid[i][0] == 1 && vis[i][0] == 0)\nIs Left boundary cell (${i}, 0) unvisited land?`, 34, { phase: 'check_grid', scanR: i, scanC: 0 });
            if (grid[i][0] === 1 && vis[i][0] === 0) {
                add("Found Boundary Land", `dfs(i, 0, vis, grid);\nTriggering DFS to mark this and connected land as safe.`, 35, { phase: 'found_boundary', scanR: i, scanC: 0 });
                runDFS(i, 0);
            }

            add("Check Right Boundary", `if(grid[i][m-1] == 1 && vis[i][m-1] == 0)\nIs Right boundary cell (${i}, ${m-1}) unvisited land?`, 37, { phase: 'check_grid', scanR: i, scanC: m-1 });
            if (grid[i][m-1] === 1 && vis[i][m-1] === 0) {
                add("Found Boundary Land", `dfs(i, m-1, vis, grid);\nTriggering DFS to mark this and connected land as safe.`, 38, { phase: 'found_boundary', scanR: i, scanC: m-1 });
                runDFS(i, m-1);
            }
        }

        add("Init Enclaves", `int enclaves = 0;\nInitializing counter for trapped landmasses.`, 42, { phase: 'init_enclaves' });

        for (let i = 0; i < n; i++) {
            add("Final Outer Scan", `for(int i = 0; i < n; i++)\nFinal full grid sweep to count trapped land. Row ${i}.`, 43, { phase: 'final_scan', scanR: i });
            for (let j = 0; j < m; j++) {
                add("Final Inner Scan", `for(int j = 0; j < m; j++)\nChecking cell (${i}, ${j}).`, 44, { phase: 'final_scan', scanR: i, scanC: j });
                
                add("Check Trapped", `if(grid[i][j] == 1 && vis[i][j] == 0)\nIs cell (${i}, ${j}) land AND unvisited (unsafe)?`, 45, { phase: 'check_trapped', scanR: i, scanC: j });
                if (grid[i][j] === 1 && vis[i][j] === 0) {
                    enclaves++;
                    enclaveMask[i][j] = true;
                    add("Count Trapped", `enclaves++;\nYes! Cell is an enclave. Incrementing count to ${enclaves}.`, 46, { phase: 'count_enclave', scanR: i, scanC: j });
                } else {
                    add("Skip Cell", `Cell is either sea (0) or safe land (visited). Ignore.`, 45, { phase: 'skip_enclave', scanR: i, scanC: j });
                }
            }
        }

        add("Return Enclaves", `return enclaves;\nAlgorithm complete. Returning total enclaves: ${enclaves}.`, 50, { phase: 'done', isDone: true, isSuccess: true, finalAns: enclaves });

        return steps;
    }
  }, [baseGrid, algoType]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-teal-900 border-teal-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{algoType === 'BFS' ? <Map size={100} className="text-white"/> : <ArrowDownToLine size={100} className="text-white"/>}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-teal-400`}>
                    <PartyPopper size={24}/> ENCLAVES COUNTED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Successfully mapped all trapped landmasses.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('enq') || st.phase.includes('mark_vis') || st.phase === 'mark_adj' || st.phase.includes('dfs_enter') || st.phase.includes('found_boundary') ? 'text-emerald-400' : (st.phase.includes('count') ? 'text-rose-400' : (st.phase.includes('check') || st.phase.includes('scan') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.grid === undefined) return null;
      let isDone = st.isDone;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isDone ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-200'} scale-105 z-40`}>
              {isDone ? (
                  <div className="flex flex-col items-center justify-center gap-4 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-teal-600`}>
                          <CheckCircle2 size={16}/> Final Result Returned
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full break-all text-teal-700 bg-teal-100 border-teal-400`}>
                          Return: {st.finalAns} Enclaves
                      </div>
                      <button onClick={handleReset} className={`mt-2 py-3 px-8 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-sm bg-teal-500 hover:bg-teal-600`}>
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
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active {algoType} Node (r, c)</span>
                          <div className={`border-2 text-xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${(algoType === 'BFS' ? st.phase.startsWith('bfs') : st.phase.startsWith('dfs')) ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeR !== undefined ? `(${st.activeR}, ${st.activeC})` : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-rose-500 mb-1 flex items-center gap-1"><Trophy size={12}/> Trapped Enclaves</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-2xl transition-all duration-300 ${st.phase === 'count_enclave' ? 'bg-rose-100 border-rose-400 text-rose-800 shadow-sm animate-in zoom-in scale-110' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.enclaves !== undefined ? st.enclaves : '0'}
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
          const delrow = [-1, 0, 1, 0];
          const delcol = [0, 1, 0, -1];
          for (let i = 0; i < 4; i++) {
              let nr = st.activeR + delrow[i];
              let nc = st.activeC + delcol[i];
              let isValid = nr >= 0 && nr < st.n && nc >= 0 && nc < st.m;
              activeNeighbors.push({r: nr, c: nc, valid: isValid});
          }
      }

      return (
          <>
             {/* LEFT COLUMN: Main Grid Matrix & Visited Array */}
             <div className="flex flex-col gap-8 shrink-0 relative">
                 
                 {/* Main Grid Matrix */}
                 <div className="relative flex flex-col gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10 shrink-0 mx-auto">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Board Matrix (int[][])</span>
                     {st.grid.map((rowArr: number[], rIdx: number) => (
                         <div key={`gr-r-${rIdx}`} className="flex gap-1 md:gap-1.5">
                             {rowArr.map((cellValue: number, cIdx: number) => {
                                 
                                 let isScan = st.scanR === rIdx && st.scanC === cIdx && (st.phase.includes('scan') || st.phase.includes('check_bounds') || st.phase.includes('eval_land') || st.phase.includes('check_trapped') || st.phase.includes('check_grid'));
                                 let isActive = st.activeR === rIdx && st.activeC === cIdx && (algoType === 'BFS' ? st.phase.startsWith('bfs') : st.phase.startsWith('dfs'));
                                 let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                 let isEnclave = st.enclaveMask && st.enclaveMask[rIdx][cIdx];
                                 let isVisited = st.vis && st.vis[rIdx][cIdx] === 1;
                                 
                                 let bgClass = getCellTheme(cellValue, rIdx, cIdx, isEnclave, isVisited);
                                 let ringClass = 'border-2';
                                 let scaleClass = 'scale-100';
                                 let zIndex = 'z-10';

                                 if (isActive) {
                                     ringClass = 'ring-4 ring-emerald-500 ring-offset-2 border-transparent shadow-xl';
                                     scaleClass = 'scale-125';
                                     zIndex = 'z-30';
                                 } else if (isCheck) {
                                     let isSafeLand = st.grid[rIdx][cIdx] === 1 && !isVisited;
                                     ringClass = isSafeLand ? 'ring-4 ring-emerald-400 ring-offset-2 border-transparent shadow-md' : 'ring-4 ring-sky-400 ring-offset-2 border-transparent shadow-md';
                                     scaleClass = 'scale-110';
                                     zIndex = 'z-20';
                                 } else if (isScan) {
                                     ringClass = 'ring-4 ring-indigo-400 ring-offset-2 border-transparent shadow-md';
                                     scaleClass = 'scale-110';
                                     zIndex = 'z-20';
                                 } else if (isEnclave) {
                                     ringClass = 'ring-2 ring-rose-500 border-transparent';
                                     scaleClass = 'scale-105';
                                     zIndex = 'z-20';
                                 }

                                 return (
                                     <div 
                                         key={`gr-c-${rIdx}-${cIdx}`}
                                         className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-black text-xl md:text-2xl rounded-xl transition-all duration-300 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`}
                                     >
                                         {cellValue}
                                         <span className={`absolute bottom-0.5 right-1 text-[8px] font-mono opacity-0 group-hover:opacity-100 ${cellValue === 0 ? 'text-black/40' : 'text-white/60'}`}>{rIdx},{cIdx}</span>
                                     </div>
                                 );
                             })}
                         </div>
                     ))}
                 </div>

                 {/* Visited Array Matrix Viewer */}
                 <div className="relative flex flex-col gap-1 md:gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-xl border border-slate-300 backdrop-blur-sm z-10 shrink-0 mx-auto mt-4 w-fit">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">vis[][] Array (Safe-Zone Map)</span>
                     {(st.vis || []).map((rowArr: number[], rIdx: number) => (
                         <div key={`vr-${rIdx}`} className="flex gap-1 md:gap-1.5">
                             {rowArr.map((cellValue: number, cIdx: number) => {
                                 let isNewlyMarked = (st.phase === 'mark_vis') && (st.activeR === rIdx && st.activeC === cIdx || (st.scanR === rIdx && st.scanC === cIdx));
                                 let isNeighMarked = (st.phase === 'mark_adj') && (st.checkR === rIdx && st.checkC === cIdx);
                                 let isChecking = (st.phase === 'check_validity' || st.phase === 'skip_adj') && (st.checkR === rIdx && st.checkC === cIdx);
                                 
                                 let boxBg = cellValue === 1 ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                                 let ringClass = 'border-2';
                                 let scaleClass = 'scale-100';
                                 let zIndex = 'z-10';

                                 if (isNewlyMarked || isNeighMarked) {
                                     boxBg = "bg-emerald-500 text-white border-emerald-600";
                                     ringClass = "ring-4 ring-emerald-400 ring-offset-2 border-transparent shadow-xl";
                                     scaleClass = "scale-110";
                                     zIndex = "z-30";
                                 } else if (isChecking) {
                                     ringClass = "ring-4 ring-sky-400 ring-offset-2 border-transparent shadow-md";
                                     scaleClass = "scale-110";
                                     zIndex = "z-20";
                                 }

                                 return (
                                     <div 
                                         key={`vc-${rIdx}-${cIdx}`} 
                                         className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-mono font-bold text-lg md:text-xl rounded-xl transition-all duration-300 relative select-none ${boxBg} ${ringClass} ${scaleClass} ${zIndex}`}
                                     >
                                         {cellValue}
                                         <span className={`absolute bottom-0.5 right-1 text-[8px] font-mono opacity-0 group-hover:opacity-100 ${cellValue === 1 ? 'text-white/60' : 'text-black/20'}`}>{rIdx},{cIdx}</span>
                                     </div>
                                 )
                             })}
                         </div>
                     ))}
                 </div>

             </div>

             {/* RIGHT COLUMN: Neighbor Discovery, Variables & Queue/Stack */}
             <div className="flex flex-col gap-4 z-20 items-center justify-start shrink-0 w-[240px] md:w-[320px]">
                 
                 {/* Dynamic Adjacency Explorer Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ListTree size={12}/> 4-Dir {algoType} Discovery</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-4 relative min-h-[120px]">
                         {st.activeR !== undefined && st.activeC !== undefined ? (
                             <div className="flex flex-col gap-3">
                                 <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Node:</span>
                                     <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-mono font-bold shadow-sm">
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
                                             let isLand = n.valid && st.grid[n.r][n.c] === 1;
                                             
                                             let bgClass = 'bg-slate-100 text-slate-500';
                                             if (isChecking) {
                                                 if (!n.valid || isVisited || !isLand) bgClass = 'bg-sky-400 text-white shadow-md animate-pulse';
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
                                 {!st.isDone && <p className="text-[10px] text-slate-400 italic text-center mt-2">Iterating 4 directions to find safe '1's...</p>}
                             </div>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-400 italic text-sm py-6">
                                 Waiting for active {algoType} node...
                             </div>
                         )}
                     </div>
                 </div>

                 {/* Dynamic Component: Queue for BFS, Stack for DFS */}
                 {algoType === 'BFS' ? (
                     <div className="flex flex-col items-center w-full">
                         <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> Queue&lt;Pair(r, c)&gt;</span>
                         <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                             <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                                 <span>FRONT (OUT)</span>
                                 <span>BACK (IN)</span>
                             </div>
                             
                             <div className="flex flex-wrap gap-2 transition-all duration-500">
                                 {(st.q || []).map((val: {r: number, c: number}, i: number) => {
                                     let isEntering = (st.phase === 'enq_boundary' || st.phase === 'enq_adj') && i === st.q.length - 1;
                                     let isTop = i === 0;
                                     
                                     return (
                                         <div key={`qf-${i}-${val.r}-${val.c}`} className={`px-3 py-2 flex flex-col items-center justify-center font-mono font-bold text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8' : (isTop ? 'bg-teal-600 border-teal-700' : 'bg-slate-700 border-slate-800')}`}>
                                             <span className="text-xs">({val.r},{val.c})</span>
                                         </div>
                                     )
                                 })}
                                 {st.q && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Queue is empty</span>}
                             </div>
                         </div>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center w-full">
                         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> Call Stack</span>
                         <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                             <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                                 <span>TOP (CURRENT)</span>
                             </div>
                             
                             <div className="flex flex-col gap-2 transition-all duration-500">
                                 {[...(st.stack || [])].reverse().map((val: {r: number, c: number}, i: number) => {
                                     let isTop = i === 0;
                                     let isEntering = isTop && st.phase === 'dfs_enter';
                                     
                                     return (
                                         <div key={`stack-${i}-${val.r}-${val.c}`} className={`px-4 py-2 flex items-center justify-between font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-indigo-500 border-indigo-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-500')}`}>
                                             <span className="text-xs">dfs({val.r}, {val.c})</span>
                                             {isTop && <Activity size={12} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                                         </div>
                                     )
                                 })}
                                 {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Stack is empty</span>}
                             </div>
                         </div>
                     </div>
                 )}

                 {/* Variables State Panel */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><Database size={12}/> Trace Variables</span>
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
                                 <span className="text-indigo-500">i, j (scan):</span>
                                 <span className="font-bold text-indigo-700">{st.scanR !== undefined ? `(${st.scanR}, ${st.scanC})` : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-emerald-500">row, col:</span>
                                 <span className="font-bold text-emerald-700">{st.activeR !== undefined ? `(${st.activeR}, ${st.activeC})` : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-sky-500">nrow, ncol:</span>
                                 <span className="font-bold text-sky-700">{st.checkR !== undefined ? `(${st.checkR}, ${st.checkC})` : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                                 <span className="text-rose-500">enclaves:</span>
                                 <span className="font-bold text-rose-700">{st.enclaves !== undefined ? st.enclaves : '0'}</span>
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
                  <span>Boundary Safe Marking</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
                <button onClick={() => setAlgoType('BFS')} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${algoType === 'BFS' ? `bg-teal-600 text-white shadow-md` : 'text-slate-400 hover:text-slate-800'}`}>BFS (Queue)</button>
                <button onClick={() => setAlgoType('DFS')} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${algoType === 'DFS' ? `bg-indigo-600 text-white shadow-md` : 'text-slate-400 hover:text-slate-800'}`}>DFS (Stack)</button>
              </div>
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
                <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
                <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
                <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
              </div>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Map size={28}/> Capture the Trapped Enclaves</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an <code>m x n</code> binary matrix <code>grid</code>, where <code>0</code> represents a sea cell and <code>1</code> represents a land cell.</p>
                        <p>A move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid.</p>
                        <p>Return <strong>the number of land cells in grid for which we cannot walk off the boundary of the grid in any number of moves.</strong></p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">3</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           There are three 1s that are enclosed by 0s, and one 1 that is not enclosed because its on the boundary.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><MapPin size={16}/> 1. Boundary Safe-Marking</span>
                            <p className="text-sm text-slate-500">Any land (1) on the boundary can walk off the grid. Therefore, it is "safe". We enqueue all boundary lands into a Multi-Source BFS (or trigger DFS) to mark them and any inner lands connected to them as visited.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ShieldAlert size={16}/> 2. Trap Execution</span>
                            <p className="text-sm text-slate-500">Once the boundaries have spread their safety marking inward, the rest is simple. We scan the entire board. Any '1' that isn't marked visited was never connected to the boundary—it is trapped! We count it.</p>
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
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="0 0 0 0 | 1 0 1 0 | 0 1 1 0 | 0 0 0 0" />
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
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Boundary {algoType} Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-teal-100 text-teal-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how reversing the problem logic from "finding trapped regions" to "finding safe borders" makes it exponentially easier.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-emerald-500"/> Reverse Thinking (Boundary Start)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we iterate through the middle of the board to find '1's, we don't know if that '1' eventually connects to the border without exploring its entire component. Instead, we reverse the logic. We ONLY check if it connects to the boundary first. Any '1' on the border is guaranteed safe. We launch a BFS or DFS from them to mark all connecting '1's as safe.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> Managing Visited States</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We use an integer <code>vis[][]</code> matrix. The BFS turns `vis[row][col]` to 1 exclusively for '1's that touch the boundary. After the boundary sweeps are done, any '1' that has `vis == 0` is mathematically proven to be trapped by '0's on all sides. We simply iterate the matrix one last time and count them up.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-indigo-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>The boundary traversal checks every cell exactly once initially taking $N \times M$. The BFS triggers only for '1's and marks them visited. The final conversion loops touch exactly $N \times M$ cells. Since no cell is processed by BFS more than once, the upper bound is strictly $O(N \times M)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>We allocate $O(N \times M)$ memory for the `vis` matrix. The BFS Queue (or DFS Call Stack), in the absolute worst-case where the entire grid is filled with '1's, will hold all boundary items, bounded by $O(N \times M)$. Total Space is $O(N \times M)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-teal-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Number of Enclaves tests your ability to adapt existing logic. It is functionally identical to Surrounded Regions but expects a count rather than modifying the matrix."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we optimize the space by dropping the `vis[][]` array entirely?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, by temporarily mutating the grid."</p>
                            <p>Instead of the `vis` array, when the BFS finds a safe '1', we can change it to a temporary placeholder integer like <code>2</code>. After the BFS passes are complete, we run one final sweep: count all remaining <code>1</code>s (they are enclaves), and if we need to restore the matrix, turn all <code>2</code>s back to <code>1</code>. This brings Space Complexity down to just the BFS Queue."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why use BFS instead of DFS here?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "BFS avoids Call Stack limitations."</p>
                            <p>If the board was massive (e.g., 10,000 x 10,000) and contained a massive snake-like island of 1s, DFS would cause a StackOverflow Error due to the deep recursive Call Stack. Breadth-First Search (BFS) using a Queue object utilizes the heap memory instead of the thread stack, preventing the crash."</p>
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
                    <div className="flex bg-slate-800 p-1 rounded-xl">
                        <button onClick={() => setAlgoType('BFS')} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${algoType === 'BFS' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>BFS</button>
                        <button onClick={() => setAlgoType('DFS')} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${algoType === 'DFS' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>DFS</button>
                    </div>
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
                                    <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold min-w-[300px]`} placeholder="0 0 0 0 | 1 0 1 0 | 0 1 1 0 | 0 0 0 0" />
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
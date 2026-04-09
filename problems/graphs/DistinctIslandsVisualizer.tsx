import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  distinctIslands: {
    id: 'distinctIslands',
    title: 'Number of Distinct Islands (DFS + HashSet)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'violet',
    code: `class Pair {
    int first, second;
    Pair(int f, int s) { first = f; second = s; }
}

class Solution {
    private void dfs(int row, int col, int[][] vis, int[][] grid, ArrayList<String> vec, int row0, int col0) {
        vis[row][col] = 1;
        vec.add(toString(row - row0, col - col0));
        int n = grid.length;
        int m = grid[0].length;
        int delrow[] = {-1, 0, +1, 0};
        int delcol[] = {0, -1, 0, +1};
        
        for(int i = 0; i < 4; i++) {
            int nrow = row + delrow[i];
            int ncol = col + delcol[i];
            
            if(nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1) {
                dfs(nrow, ncol, vis, grid, vec, row0, col0);
            }
        }
    }
    
    private String toString(int r, int c) {
        return Integer.toString(r) + " " + Integer.toString(c);
    }

    public int countDistinctIslands(int[][] grid) {
        int n = grid.length;
        int m = grid[0].length;
        int vis[][] = new int[n][m];
        HashSet<ArrayList<String>> st = new HashSet<>();
        
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(vis[i][j] == 0 && grid[i][j] == 1) {
                    ArrayList<String> vec = new ArrayList<>();
                    dfs(i, j, vis, grid, vec, i, j);
                    st.add(vec);
                }
            }
        }
        return st.size();
    }
}`,
    desc: "Finding the number of topologically unique islands. We scan the grid for unvisited land. Once found, we trigger a DFS, passing the original (row0, col0) coordinates of that land. As we traverse, we subtract the origin from the current coordinates to capture the relative 'shape' of the island into a list. By adding these lists to a HashSet, duplicates are automatically filtered out!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|return|if|else|new|for|while|dfs|countDistinctIslands|Pair|first|second|grid|vis|n|m|q|add|size|HashSet|ArrayList|String|toString|Integer|length|delrow|delcol|row|col|nrow|ncol|row0|col0|vec|st)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'HashSet', 'ArrayList', 'Pair'].includes(part);
            const isPointer = ['grid', 'vis', 'row', 'col', 'nrow', 'ncol', 'delrow', 'delcol', 'n', 'm', 'i', 'j', 'first', 'second', 'row0', 'col0', 'vec', 'st'].includes(part);
            const isMapCall = ['dfs', 'countDistinctIslands', 'add', 'size', 'toString', 'length'].includes(part);
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
const getCellTheme = (val: number, r: number, c: number, isOrigin: boolean, isVisited: boolean) => {
    if (isOrigin) return 'bg-fuchsia-600 text-white border-fuchsia-700 shadow-md shadow-fuchsia-500/30 animate-pulse'; // Origin of shape
    if (val === 0) return 'bg-sky-50 text-sky-300 border-sky-200'; // Sea
    if (val === 1) {
        if (isVisited) return 'bg-violet-400 text-white border-violet-500 shadow-md'; // Visited island part
        return 'bg-amber-400 text-white border-amber-500 shadow-md'; // Unvisited land
    }
    return 'bg-white text-slate-800 border-slate-300';
};

// --- Main Application ---

export default function DistinctIslandsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('distinctIslands');
  
  // Default matches Example 1: Two identical islands that count as 1 distinct
  const [gridInput, setGridInput] = useState('1 1 0 0 0 | 1 1 0 0 0 | 0 0 0 1 1 | 0 0 0 1 1');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
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
            let cols = rows[i].split(/\s+/).map(Number).filter(n => !isNaN(n));
            if (cols.length > 0) parsed.push(cols);
        }
        
        if (parsed.length === 0) parsed = [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]];
        
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
        setZoom(0.85);
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

    const stack: {r: number, c: number}[] = [];
    let vis: number[][] = Array(n).fill(0).map(() => Array(m).fill(0));
    
    // JS representation of HashSet<ArrayList<String>>
    let st: Set<string> = new Set(); 
    let currentVec: string[] = []; // Currently building shape
    let uniqueShapesList: string[][] = []; // For UI rendering
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid, n, m, stack: [...stack], vis: clone2D(vis), vec: [...currentVec], st: Array.from(st), uniqueShapesList: [...uniqueShapesList], ...stateObj } 
    });

    add("Function Call", `public int countDistinctIslands(int[][] grid)\nInitiating island counting algorithm.`, 29, { phase: 'init' });
    
    add("Grid Dimensions", `int n = grid.length;\nint m = grid[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 30, { phase: 'init_ds' });
    add("Init Visited Matrix", `int vis[][] = new int[n][m];\nAllocated visited array to track components.`, 32, { phase: 'init_ds' });
    add("Init HashSet", `HashSet<ArrayList<String>> st = new HashSet<>();\nCreated HashSet to automatically filter duplicate island shapes.`, 33, { phase: 'init_ds' });

    const runDFS = (r: number, c: number, r0: number, c0: number) => {
        stack.push({r, c});
        add("DFS Enter", `private void dfs(int row=${r}, int col=${c}, ... int row0=${r0}, int col0=${c0})\nEntering deep recursion for cell (${r}, ${c}). Origin is (${r0}, ${c0}).`, 7, { phase: 'dfs_enter', activeR: r, activeC: c, originR: r0, originC: c0 });
        
        vis[r][c] = 1;
        add("Mark Visited", `vis[row][col] = 1;\nMarking active node (${r}, ${c}) as visited.`, 8, { phase: 'mark_vis', activeR: r, activeC: c, originR: r0, originC: c0 });

        let relR = r - r0;
        let relC = c - c0;
        currentVec.push(`${relR} ${relC}`);
        add("Record Shape Path", `vec.add(toString(row - row0, col - col0));\nAdded relative coords (${relR}, ${relC}) to our current island shape list.`, 9, { phase: 'record_shape', activeR: r, activeC: c, originR: r0, originC: c0 });

        const delrow = [-1, 0, 1, 0];
        const delcol = [0, -1, 0, 1];
        add("Init DFS Vectors", `int delrow[] = {-1, 0, +1, 0};\nint delcol[] = {0, -1, 0, +1};\nSetting up directional vectors.`, 12, { phase: 'dfs_setup', activeR: r, activeC: c, originR: r0, originC: c0 });

        add("Neighbor Loop", `for(int i = 0; i < 4; i++)\nChecking 4 neighbors...`, 15, { phase: 'for_adj', activeR: r, activeC: c, originR: r0, originC: c0 });

        for (let i = 0; i < 4; i++) {
            let nrow = r + delrow[i];
            let ncol = c + delcol[i];

            add("Calc Neighbor Coords", `int nrow = row + delrow[i];\nint ncol = col + delcol[i];\nLooking at neighbor (${nrow}, ${ncol}).`, 16, { phase: 'calc_adj', activeR: r, activeC: c, checkR: nrow, checkC: ncol, originR: r0, originC: c0 });

            add("Check Validity", `if(nrow >= 0 ... && vis[nrow][ncol] == 0 && grid[nrow][ncol] == 1)\nValidating bounds, visited state, and land status.`, 19, { phase: 'check_validity', activeR: r, activeC: c, checkR: nrow, checkC: ncol, originR: r0, originC: c0 });

            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && vis[nrow][ncol] === 0 && grid[nrow][ncol] === 1) {
                add("Valid DFS Neighbor", `dfs(nrow, ncol, vis, grid, vec, row0, col0);\nFound connected land at (${nrow}, ${ncol}). Plunging deeper!`, 20, { phase: 'call_dfs', activeR: r, activeC: c, checkR: nrow, checkC: ncol, originR: r0, originC: c0 });
                runDFS(nrow, ncol, r0, c0);
                add("DFS Backtrack", `Returned to node (${r}, ${c}) after exploring neighbor (${nrow}, ${ncol}).`, 15, { phase: 'dfs_backtrack', activeR: r, activeC: c, originR: r0, originC: c0 });
            } else {
                add("Skip Neighbor", `Condition failed. Cell is either out of bounds, visited, or sea (0).`, 19, { phase: 'skip_adj', activeR: r, activeC: c, checkR: nrow, checkC: ncol, originR: r0, originC: c0 });
            }
        }

        stack.pop();
        add("DFS Exit", `End of 4-directional loop. \nFinished exploring (${r}, ${c}). Popping from stack.`, 15, { phase: 'dfs_exit', activeR: r, activeC: c, originR: r0, originC: c0 });
    };

    for (let i = 0; i < n; i++) {
        add("Outer Scan", `for(int i = 0; i < n; i++)\nScanning row ${i}.`, 35, { phase: 'scan', scanR: i });
        for (let j = 0; j < m; j++) {
            add("Inner Scan", `for(int j = 0; j < m; j++)\nScanning cell (${i}, ${j}).`, 36, { phase: 'scan', scanR: i, scanC: j });
            
            add("Check Unvisited Land", `if(vis[i][j] == 0 && grid[i][j] == 1)\nIs cell (${i}, ${j}) an unvisited piece of land?`, 37, { phase: 'check_grid', scanR: i, scanC: j });
            if (grid[i][j] === 1 && vis[i][j] === 0) {
                currentVec = [];
                add("Init Shape List", `ArrayList<String> vec = new ArrayList<>();\nYes! Found a new island. Creating an empty list to record its shape.`, 38, { phase: 'init_vec', scanR: i, scanC: j, originR: i, originC: j });
                
                add("Trigger DFS", `dfs(i, j, vis, grid, vec, i, j);\nLaunching DFS using (${i}, ${j}) as the origin (row0, col0).`, 39, { phase: 'trigger_dfs', scanR: i, scanC: j, originR: i, originC: j });
                runDFS(i, j, i, j);

                let shapeStr = currentVec.join('|');
                let isDuplicate = st.has(shapeStr);
                
                add("Add to HashSet", `st.add(vec);\nDFS finished mapping the island! Adding the shape vector to the HashSet.`, 40, { phase: 'add_set', scanR: i, scanC: j, isDuplicate, completedVec: [...currentVec] });
                
                if (!isDuplicate) {
                    st.add(shapeStr);
                    uniqueShapesList.push([...currentVec]);
                    add("Shape Accepted", `Set accepted the new shape! It is topologically unique.`, 40, { phase: 'set_accepted', scanR: i, scanC: j, isDuplicate: false, completedVec: [...currentVec] });
                } else {
                    add("Shape Rejected", `Set rejected the shape. This exact island topology already exists in the HashSet!`, 40, { phase: 'set_rejected', scanR: i, scanC: j, isDuplicate: true, completedVec: [...currentVec] });
                }
            }
        }
    }

    add("Return Set Size", `return st.size();\nGrid scan complete. Returning the total number of unique shapes stored in the HashSet: ${st.size}.`, 44, { phase: 'done', isDone: true, isSuccess: true, finalAns: st.size });

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

  // Abstracted Trace Operations Component
  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-violet-900 border-violet-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Combine size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-violet-400`}>
                    <PartyPopper size={24}/> GRID SCAN COMPLETE
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    HashSet successfully filtered out all duplicate island shapes.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('dfs_enter') || st.phase === 'mark_vis' || st.phase.includes('accepted') ? 'text-emerald-400' : (st.phase.includes('rejected') || st.phase === 'record_shape' ? 'text-fuchsia-400' : (st.phase.includes('check') || st.phase.includes('scan') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.grid === undefined) return null;
      let isDone = st.isDone;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isDone ? 'border-violet-400 ring-4 ring-violet-100' : 'border-slate-200'} scale-105 z-40`}>
              {isDone ? (
                  <div className="flex flex-col items-center justify-center gap-4 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-violet-600`}>
                          <CheckCircle2 size={16}/> Final Result Returned
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full break-all text-violet-700 bg-violet-100 border-violet-400`}>
                          Unique Islands: {st.finalAns}
                      </div>
                      <button onClick={handleReset} className={`mt-2 py-3 px-8 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-sm bg-violet-500 hover:bg-violet-600`}>
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
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active DFS Node (r, c)</span>
                          <div className={`border-2 text-xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('dfs') || st.phase === 'record_shape' ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeR !== undefined ? `(${st.activeR}, ${st.activeC})` : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Hash size={12}/> HashSet Size</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-2xl transition-all duration-300 ${st.phase === 'set_accepted' ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 shadow-sm animate-in zoom-in scale-110' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.st !== undefined ? st.st.length : '0'}
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
          const delcol = [0, -1, 0, 1];
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
                                 
                                 let isScan = st.scanR === rIdx && st.scanC === cIdx && (st.phase.includes('scan') || st.phase === 'check_grid' || st.phase === 'init_vec' || st.phase === 'trigger_dfs');
                                 let isActive = st.activeR === rIdx && st.activeC === cIdx && st.phase.startsWith('dfs');
                                 let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                 let isOrigin = st.originR === rIdx && st.originC === cIdx;
                                 let isVisited = st.vis && st.vis[rIdx][cIdx] === 1;
                                 
                                 let bgClass = getCellTheme(cellValue, rIdx, cIdx, isOrigin, isVisited);
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
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">vis[][] Array</span>
                     {(st.vis || []).map((rowArr: number[], rIdx: number) => (
                         <div key={`vr-${rIdx}`} className="flex gap-1 md:gap-1.5">
                             {rowArr.map((cellValue: number, cIdx: number) => {
                                 let isNewlyMarked = (st.phase === 'mark_vis') && (st.activeR === rIdx && st.activeC === cIdx);
                                 let isChecking = (st.phase === 'check_validity' || st.phase === 'skip_adj' || st.phase === 'check_adj_vis') && (st.checkR === rIdx && st.checkC === cIdx);
                                 
                                 let boxBg = cellValue === 1 ? "bg-violet-400 text-white border-violet-500 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                                 let ringClass = 'border-2';
                                 let scaleClass = 'scale-100';
                                 let zIndex = 'z-10';

                                 if (isNewlyMarked) {
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

             {/* RIGHT COLUMN: Neighbor Discovery, Call Stack, HashSet */}
             <div className="flex flex-col gap-4 z-20 items-center justify-start shrink-0 w-[240px] md:w-[320px]">
                 
                 {/* Dynamic Adjacency Explorer Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ListTree size={12}/> 4-Dir DFS Discovery</span>
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
                                                 if (!n.valid || isVisited || !isLand) bgClass = 'bg-rose-500 text-white shadow-md animate-pulse';
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
                                 {!st.isDone && <p className="text-[10px] text-slate-400 italic text-center mt-2">Iterating 4 directions to find land...</p>}
                             </div>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-400 italic text-sm py-6">
                                 Waiting for active DFS node...
                             </div>
                         )}
                     </div>
                 </div>

                 {/* Call Stack Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> Call Stack</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                         <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                             <span>TOP (CURRENT)</span>
                         </div>
                         
                         <div className="flex flex-col gap-2 transition-all duration-500">
                             {[...(st.stack || [])].reverse().map((val: {r: number, c: number}, i: number) => {
                                 let isTop = i === 0;
                                 let isEntering = isTop && st.phase === 'dfs_enter';
                                 
                                 return (
                                     <div key={`stack-${i}-${val.r}-${val.c}`} className={`px-4 py-2 flex items-center justify-between font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-indigo-500 border-indigo-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-fuchsia-600 border-fuchsia-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-500')}`}>
                                         <span className="text-xs">dfs({val.r}, {val.c})</span>
                                         {isTop && <Activity size={12} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                                     </div>
                                 )
                             })}
                             {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Stack is empty</span>}
                         </div>
                     </div>
                 </div>

                 {/* HashSet Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2"><Hash size={12}/> HashSet &lt;ArrayList&gt;</span>
                     <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-4 flex flex-col gap-3 relative min-h-[160px]">
                         
                         <div className="flex flex-col gap-1 border-b border-slate-200 pb-3">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active ArrayList (vec)</span>
                             <div className="bg-slate-100 border border-slate-300 rounded-lg p-2 font-mono text-xs text-slate-600 min-h-[34px] flex flex-wrap gap-1">
                                 {st.vec && st.vec.length > 0 ? (
                                     st.vec.map((str: string, i: number) => {
                                         let isNew = st.phase === 'record_shape' && i === st.vec.length - 1;
                                         return (
                                             <span key={`vec-${i}`} className={`bg-white border border-slate-300 px-1.5 rounded transition-all duration-300 ${isNew ? 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700 animate-pulse' : ''}`}>"{str}"</span>
                                         )
                                     })
                                 ) : <span className="italic opacity-50">Empty</span>}
                             </div>
                         </div>

                         <div className="flex flex-col gap-2">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                                 <span>Stored Unique Shapes</span>
                                 <span className="text-fuchsia-600 bg-fuchsia-50 px-2 rounded-full">st.size() = {st.st ? st.st.length : 0}</span>
                             </span>
                             <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto scrollbar-thin">
                                 {(st.uniqueShapesList || []).map((shapeArr: string[], i: number) => (
                                     <div key={`st-${i}`} className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-2 font-mono text-[10px] text-fuchsia-800 flex flex-wrap gap-1 shadow-sm">
                                         {shapeArr.map((str: string, j: number) => (
                                             <span key={`sts-${j}`} className="bg-white border border-fuchsia-100 px-1 rounded shadow-sm">"{str}"</span>
                                         ))}
                                     </div>
                                 ))}
                                 {st.st && st.st.length === 0 && <span className="text-slate-300 font-mono italic text-xs text-center mt-2">HashSet is empty</span>}
                             </div>
                         </div>
                         
                         {/* Action Overlay for Add Set */}
                         {st.phase === 'set_accepted' && (
                             <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur rounded-3xl z-20 flex flex-col items-center justify-center p-4 animate-in zoom-in slide-in-from-top-4 duration-300">
                                 <CheckCircle2 size={32} className="text-white mb-2"/>
                                 <span className="text-white font-black uppercase text-sm tracking-widest text-center leading-tight">Unique Shape Added!</span>
                             </div>
                         )}
                         {st.phase === 'set_rejected' && (
                             <div className="absolute inset-0 bg-rose-500/90 backdrop-blur rounded-3xl z-20 flex flex-col items-center justify-center p-4 animate-in zoom-in slide-in-from-top-4 duration-300">
                                 <X size={32} className="text-white mb-2"/>
                                 <span className="text-white font-black uppercase text-sm tracking-widest text-center leading-tight">Duplicate Shape<br/>Ignored by Set</span>
                             </div>
                         )}

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
                  <span>DFS & HashSet Filter</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Combine size={28}/> Isolating Unique Island Shapes</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a boolean 2D matrix <code>grid</code>, you need to find the number of <strong>distinct islands</strong>.</p>
                        <p>Two islands are considered distinct if and only if one island is not exactly equal to another (not rotated or reflected). If you translate one island and it perfectly overlaps the other, they are the same shape!</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> grid = <br/>[[1, 1, 0, 0, 0],<br/> [1, 1, 0, 0, 0],<br/> [0, 0, 0, 1, 1],<br/> [0, 0, 0, 1, 1]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">1</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           There are 2 identical 2x2 square islands. Because they are the exact same shape, there is only 1 distinct island.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-fuchsia-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><MapPin size={16}/> 1. Relative Coordinates</span>
                            <p className="text-sm text-slate-500">How do we prove two shapes in different parts of the map are identical? We calculate their layout <em>relative to their starting point</em>. As DFS traverses, we record <code>(current_row - start_row, current_col - start_col)</code>.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-violet-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Hash size={16}/> 2. HashSet Filtering</span>
                            <p className="text-sm text-slate-500">We store the resulting list of relative coordinates in a HashSet. Because HashSets automatically reject duplicate elements, any identically shaped island mapped later will simply be ignored! The final answer is just <code>set.size()</code>.</p>
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
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1 1 0 0 0 | 1 1 0 0 0 | 0 0 0 1 1 | 0 0 0 1 1" />
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
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Dynamic Shape Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering the relative coordinate abstraction to easily compare topographical shapes.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-fuchsia-500"/> Relative vs Absolute Topology</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Consider an island at top-left <code>[(0,0), (0,1)]</code> and an island at bottom-right <code>[(3,3), (3,4)]</code>. In absolute terms, they look completely different. But if we subtract the starting coordinate (the origin) from every node in the island, they both map to <code>[(0,0), (0,1)]</code>! This is the genius of the algorithm. By converting to a relative string format, we normalize all shapes.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Hash size={24} className="text-emerald-500"/> Leveraging Hash Sets</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In Java, an <code>ArrayList</code> overrides the <code>equals()</code> and <code>hashCode()</code> methods to evaluate the actual <em>contents</em> of the list, not the memory reference. Because of this, pushing an identical <code>ArrayList&lt;String&gt;</code> into a <code>HashSet</code> will cause the Set to identify the duplicate and reject it. By the end of the full grid scan, the HashSet is left containing only the unique topological vectors.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-indigo-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>The DFS explores every grid cell exactly once. Building the ArrayList and hashing it into the Set takes time proportional to the size of the island, but cumulatively across all islands, this is strictly bounded by the total number of cells $O(N \times M)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>The `vis[][]` matrix takes $O(N \times M)$ space. The DFS Call Stack can reach $N \times M$ depth. The HashSet will store the coordinates of every landmass in the worst-case scenario. Thus, total Space Complexity is safely bounded by $O(N \times M)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Distinct Islands tests your ability to abstract shapes and use core data structures effectively. Interviewers will look closely at how you generate the shape key."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we track the shape without using a list of strings?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can use a direction string."</p>
                            <p>Instead of logging coordinates, we can log the exact directional moves taken during DFS. E.g., 'R' for right, 'D' for down, 'U' for up, 'L' for left, and 'B' for backtrack. An island's shape is just the literal path string <code>"RDBB"</code>. Pushing this single string into a HashSet is often significantly more memory efficient than building a whole ArrayList of relative coordinate strings."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if the problem asked for distinct islands INCLUDING rotations/reflections?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It becomes drastically more complex."</p>
                            <p>If rotations/reflections are considered equal, our single coordinate mapping won't work. For every island found, we would need to generate all 8 possible orientations (4 rotations + 4 mirrored reflections). We would pick the lexicographically smallest orientation as the canonical 'key' for the HashSet to ensure identical rotated islands hash to the same canonical representation."</p>
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
                                    <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold min-w-[300px]`} placeholder="1 1 0 0 0 | 1 1 0 0 0 | 0 0 0 1 1 | 0 0 0 1 1" />
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
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  binaryMazeBFS: {
    id: 'binaryMazeBFS',
    title: 'Shortest Distance in Binary Maze',
    icon: <LayoutGrid size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'indigo',
    code: `class tuple {
    int first, second, third;
    tuple(int _first, int _second, int _third) {
        this.first = _first;
        this.second = _second;
        this.third = _third;
    }
}

class Solution {
    int shortestPath(int[][] grid, int[] source, int[] destination) {
        if(source[0] == destination[0] && source[1] == destination[1]) return 0;
        Queue<tuple> q = new LinkedList<>();
        int n = grid.length;
        int m = grid[0].length;
        int[][] dist = new int[n][m];
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                dist[i][j] = (int)(1e9);
            }
        }
        dist[source[0]][source[1]] = 0;
        q.add(new tuple(0, source[0], source[1]));
        int dr[] = {-1, 0, 1, 0};
        int dc[] = {0, 1, 0, -1};
        
        while(!q.isEmpty()) {
            tuple it = q.peek();
            q.remove();
            int dis = it.first;
            int r = it.second;
            int c = it.third;
            
            for(int i = 0; i < 4; i++) {
                int newr = r + dr[i];
                int newc = c + dc[i];
                
                if(newr >= 0 && newr < n && newc >= 0 && newc < m && grid[newr][newc] == 1 && dis + 1 < dist[newr][newc]) {
                    dist[newr][newc] = 1 + dis;
                    if(newr == destination[0] && newc == destination[1]) return dis + 1;
                    q.add(new tuple(1 + dis, newr, newc));
                }
            }
        }
        return -1;
    }
}`,
    desc: "Finding the shortest distance in a 2D binary grid is a classic application of Breadth-First Search (BFS). Because moving from one valid cell (1) to an adjacent valid cell always costs exactly 1 unit of distance, we don't need a complex Priority Queue like Dijkstra. A standard FIFO Queue guarantees we explore nodes uniformly layer-by-layer. The first time the BFS wavefront hits the destination coordinates, we immediately return the distance!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|shortestPath|grid|source|destination|tuple|first|second|third|LinkedList|Queue|ArrayList|List|Integer|String|q|n|m|dist|dr|dc|dis|r|c|newr|newc|it|add|isEmpty|peek|remove|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'static', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List', 'tuple'].includes(part);
            const isPointer = ['grid', 'source', 'destination', 'first', 'second', 'third', 'q', 'n', 'm', 'dist', 'dr', 'dc', 'dis', 'r', 'c', 'newr', 'newc', 'it', 'i', 'j', '_first', '_second', '_third'].includes(part);
            const isMapCall = ['shortestPath', 'add', 'remove', 'isEmpty', 'peek', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"') || part === '1e9';
            
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

// --- Main Application ---

export default function BinaryMazeVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('binaryMazeBFS');
  
  // Default: Match exact GeeksforGeeks input from screenshot
  const [gridInput, setGridInput] = useState('1,1,1,1 | 1,1,0,1 | 1,1,1,1 | 1,1,0,0 | 1,0,0,1');
  const [srcInput, setSrcInput] = useState('0,1');
  const [destInput, setDestInput] = useState('2,2');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [1,1,1,1], [1,1,0,1], [1,1,1,1], [1,1,0,0], [1,0,0,1]
  ]);
  const [baseSrc, setBaseSrc] = useState<[number, number]>([0,1]);
  const [baseDest, setBaseDest] = useState<[number, number]>([2,2]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Quick Test Case Loaders ---
  const loadTestCase1 = () => {
      setGridInput('1,1,1,1 | 1,1,0,1 | 1,1,1,1 | 1,1,0,0 | 1,0,0,1');
      setSrcInput('0,1');
      setDestInput('2,2');
  };

  const loadTestCase2 = () => {
      // Impossible path
      setGridInput('1,1,0,1 | 1,0,1,1 | 0,1,1,1');
      setSrcInput('0,0');
      setDestInput('2,3');
  };

  // --- Effects for Data Processing ---
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = gridInput.split('|').map(r => r.trim());
        let parsedGrid: number[][] = [];
        let maxCols = 0;
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            parsedGrid.push(cells.map(v => isNaN(v) ? 0 : (v === 1 ? 1 : 0)));
            if (cells.length > maxCols) maxCols = cells.length;
        }
        
        // Pad irregular rows
        for(let i=0; i<parsedGrid.length; i++) {
            while(parsedGrid[i].length < maxCols) parsedGrid[i].push(0);
        }
        
        if (parsedGrid.length === 0) parsedGrid = [[1]];

        let n = parsedGrid.length;
        let m = parsedGrid[0].length;

        let srcParse = srcInput.split(',').map(s => parseInt(s.trim(), 10));
        let srcR = !isNaN(srcParse[0]) && srcParse[0] >= 0 && srcParse[0] < n ? srcParse[0] : 0;
        let srcC = !isNaN(srcParse[1]) && srcParse[1] >= 0 && srcParse[1] < m ? srcParse[1] : 0;

        let destParse = destInput.split(',').map(s => parseInt(s.trim(), 10));
        let destR = !isNaN(destParse[0]) && destParse[0] >= 0 && destParse[0] < n ? destParse[0] : 0;
        let destC = !isNaN(destParse[1]) && destParse[1] >= 0 && destParse[1] < m ? destParse[1] : 0;

        setBaseGrid(parsedGrid);
        setBaseSrc([srcR, srcC]);
        setBaseDest([destR, destC]);
        setCurrentStep(0);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [gridInput, srcInput, destInput]);

  // Auto-scroll effect specifically targeting exact active line
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
        const target = e.target as HTMLElement;
        if (!target.closest('.graph-canvas-area')) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone2D = (arr: any[][]) => arr.map(a => [...a]);

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const grid = baseGrid;
    const src = baseSrc;
    const dest = baseDest;
    
    if (grid.length === 0) return steps;

    // Local state to track
    let q: {dis: number, r: number, c: number}[] = [];
    let n = grid.length;
    let m = grid[0].length;
    let dist: number[][] = Array.from({length: n}, () => Array(m).fill(1e9));

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid: clone2D(grid), src, dest, q: [...q], dist: clone2D(dist), n, m, ...stateObj } 
    });

    add("Function Call", `int shortestPath(int[][] grid, int[] source=[${src}], int[] destination=[${dest}])\nInitiating shortest distance search in binary maze.`, 11, { phase: 'init' });
    
    add("Check Source == Destination", `if(source[0] == destination[0] && ...)\nChecking if starting point is already the destination.`, 12, { phase: 'check_src_dest' });
    
    if (src[0] === dest[0] && src[1] === dest[1]) {
        add("Immediate Return", `return 0;\nSource matches destination exactly. Distance is 0!`, 12, { phase: 'done', isDone: true, isSuccess: true, finalDis: 0 });
        return steps;
    }

    add("Init Queue", `Queue<tuple> q = new LinkedList<>();\nCreating queue to track BFS states (distance, row, col).`, 13, { phase: 'init_queue' });
    
    add("Init Grid Bounds", `int n = grid.length;\nint m = grid[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 14, { phase: 'init_bounds' });
    add("Init Grid Bounds", `int m = grid[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 15, { phase: 'init_bounds' }); // Splitting the trace exactly
    
    add("Init Dist Array", `int[][] dist = new int[n][m];\nAllocated tracking matrix.`, 16, { phase: 'init_dist_ds' });
    
    // Explicitly trace the nested loops for distance array initialization
    for(let i=0; i<n; i++) {
        add("Outer Dist Loop", `for(int i = 0; i < n; i++)\nInitializing dist array row ${i}.`, 17, { phase: 'dist_loop_outer', loopI: i });
        for(let j=0; j<m; j++) {
            add("Inner Dist Loop", `for(int j = 0; j < m; j++)\nScanning column ${j} for row ${i}.`, 18, { phase: 'dist_loop_inner', loopI: i, loopJ: j });
            dist[i][j] = 1e9;
            add("Set Dist Infinity", `dist[i][j] = (int)(1e9);\nSetting dist[${i}][${j}] to Infinity.`, 19, { phase: 'dist_set_inf', loopI: i, loopJ: j });
        }
    }

    dist[src[0]][src[1]] = 0;
    add("Set Source Dist", `dist[source[0]][source[1]] = 0;\nThe distance from source to itself is 0.`, 22, { phase: 'set_dist_src' });

    q.push({dis: 0, r: src[0], c: src[1]});
    add("Enqueue Source", `q.add(new tuple(0, source[0], source[1]));\nPushed starting tuple [0, ${src[0]}, ${src[1]}] to queue.`, 23, { phase: 'enqueue_src' });

    add("Init Direction Arrays", `int dr[] = {-1, 0, 1, 0};\nAllocating row directional vectors (Up, Right, Down, Left).`, 24, { phase: 'init_dir' });
    add("Init Direction Arrays", `int dc[] = {0, 1, 0, -1};\nAllocating col directional vectors (Up, Right, Down, Left).`, 25, { phase: 'init_dir' });

    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    let targetFound = false;
    let finalDistance = -1;

    while(q.length > 0 && !targetFound) {
        add("While Queue Loop", `while(!q.isEmpty())\nQueue has elements. Processing layer by layer!`, 27, { phase: 'while_q' });
        
        let it = q[0];
        add("Peek Queue", `tuple it = q.peek();\nPeeking the next cell to evaluate.`, 28, { phase: 'q_peek', activeR: it.r, activeC: it.c, activeDis: it.dis });
        
        q.shift();
        add("Dequeue Tuple", `q.remove();\nPopped tuple from queue.`, 29, { phase: 'q_remove', activeR: it.r, activeC: it.c, activeDis: it.dis });

        let dis = it.dis;
        add("Extract Distance", `int dis = it.first;\ndis = ${dis}.`, 30, { phase: 'extract_dis', activeR: it.r, activeC: it.c, activeDis: dis });
        
        let r = it.r;
        add("Extract Row", `int r = it.second;\nr = ${r}.`, 31, { phase: 'extract_r', activeR: r, activeC: it.c, activeDis: dis });
        
        let c = it.c;
        add("Extract Col", `int c = it.third;\nc = ${c}.`, 32, { phase: 'extract_c', activeR: r, activeC: c, activeDis: dis });

        add("Directions Loop", `for(int i = 0; i < 4; i++)\nIterating through 4 directions (Up, Right, Down, Left) to find valid paths.`, 34, { phase: 'for_dir', activeR: r, activeC: c, activeDis: dis });

        for (let i = 0; i < 4; i++) {
            let newr = r + dr[i];
            add("Calc New Row", `int newr = r + dr[i];\nnewr = ${r} + ${dr[i]} = ${newr}.`, 35, { phase: 'calc_newr', activeR: r, activeC: c, activeDis: dis, scanI: i, newr });
            
            let newc = c + dc[i];
            add("Calc New Col", `int newc = c + dc[i];\nnewc = ${c} + ${dc[i]} = ${newc}.`, 36, { phase: 'calc_newc', activeR: r, activeC: c, activeDis: dis, scanI: i, newr, newc });

            // Combine all checks logically for the visualizer to explain
            let inBounds = newr >= 0 && newr < n && newc >= 0 && newc < m;
            let isPath = inBounds && grid[newr][newc] === 1;
            let currDistVal = inBounds ? dist[newr][newc] : 1e9;
            let isRelaxable = isPath && (dis + 1 < currDistVal);

            let checkDesc = `if(newr >= 0 && newr < n && newc >= 0 && newc < m && grid[newr][newc] == 1 && dis + 1 < dist[newr][newc])\n`;
            if (!inBounds) checkDesc += `FAILED: [${newr},${newc}] is out of bounds.`;
            else if (!isPath) checkDesc += `FAILED: Cell [${newr},${newc}] is a blocked wall (0).`;
            else if (!isRelaxable) checkDesc += `FAILED: Already discovered a shorter/equal path to [${newr},${newc}] (dist = ${currDistVal}).`;
            else checkDesc += `PASSED! Found a valid, shorter unvisited path!`;

            add("Evaluate Path Conditions", checkDesc, 38, { phase: 'eval_bounds', activeR: r, activeC: c, activeDis: dis, scanI: i, newr, newc, inBounds, isPath, isRelaxable });

            if (isRelaxable) {
                dist[newr][newc] = 1 + dis;
                add("Relax Distance", `dist[newr][newc] = 1 + dis;\nRecorded shortest distance ${1 + dis} at dist[${newr}][${newc}].`, 39, { phase: 'do_relax', activeR: r, activeC: c, activeDis: dis, scanI: i, newr, newc, newDist: 1 + dis });

                add("Check Target Arrival", `if(newr == destination[0] && newc == destination[1])\nDid we step onto the target coordinate [${dest[0]},${dest[1]}]?`, 40, { phase: 'eval_target', activeR: r, activeC: c, activeDis: dis, scanI: i, newr, newc });

                if (newr === dest[0] && newc === dest[1]) {
                    targetFound = true;
                    finalDistance = 1 + dis;
                    add("Target Reached!", `return dis + 1;\nYES! BFS guarantees this is the shortest path. Early exiting and returning ${finalDistance}.`, 40, { phase: 'done', isDone: true, isSuccess: true, finalDis: finalDistance });
                    break;
                }

                q.push({dis: 1 + dis, r: newr, c: newc});
                add("Enqueue Cell", `q.add(new tuple(1 + dis, newr, newc));\nTarget not reached yet. Queueing [${1+dis}, ${newr}, ${newc}] to explore its neighbors later.`, 41, { phase: 'q_add', activeR: r, activeC: c, activeDis: dis, scanI: i, newr, newc });
            }
        }
    }

    if (!targetFound) {
        add("Queue Empty Exit", `while(!q.isEmpty())\nQueue is completely empty. Wavefront exhausted without hitting destination.`, 27, { phase: 'done_while' });
        add("Final Return", `return -1;\nPath is impossible. Returning -1.`, 45, { phase: 'done', isDone: true, isSuccess: false });
    }

    return steps;
  }, [baseGrid, baseSrc, baseDest]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

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

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetPanZoom = () => {
      setPan({x:0, y:0});
      setZoom(0.85);
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

  // --- Segregated Render Blocks for Clean Layout ---

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><LayoutGrid size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {st.isSuccess ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>} 
                    {st.isSuccess ? "TARGET CELL REACHED" : "PATH IMPOSSIBLE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `Shortest path distance is mathematically guaranteed to be ${curStepData.state?.finalDis}.` : `The target coordinates are blocked or completely isolated.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('q_add') || String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_bounds') ? 'text-amber-400' : (String(st.phase || '').includes('q_pop') || String(st.phase || '').includes('q_remove') || String(st.phase || '').includes('extract') ? 'text-fuchsia-400' : (String(st.phase || '').includes('calc') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderRightSidebar = () => {
      // Directions array highlighting mapping
      // {0: Up, 1: Right, 2: Down, 3: Left}
      const isLoopDir = st.phase && (st.phase.includes('for_dir') || st.phase.includes('calc') || st.phase.includes('eval') || st.phase.includes('relax') || st.phase.includes('target') || st.phase === 'q_add');

      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          {/* Direction Arrays HUD */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Compass size={12}/> Direction Arrays (dr, dc)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative overflow-y-auto scrollbar-thin">
                  
                  {/* DR Array */}
                  <div className="flex gap-2 items-center">
                      <span className="w-6 text-[10px] font-black text-slate-400 font-mono tracking-widest">dr</span>
                      <div className="flex gap-1">
                          {[-1, 0, 1, 0].map((val, idx) => {
                              let isActive = isLoopDir && st.scanI === idx;
                              return (
                                  <div key={`dr-${idx}`} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded border-2 transition-all duration-300 ${isActive ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{val}</div>
                              )
                          })}
                      </div>
                  </div>

                  {/* DC Array */}
                  <div className="flex gap-2 items-center">
                      <span className="w-6 text-[10px] font-black text-slate-400 font-mono tracking-widest">dc</span>
                      <div className="flex gap-1">
                          {[0, 1, 0, -1].map((val, idx) => {
                              let isActive = isLoopDir && st.scanI === idx;
                              return (
                                  <div key={`dc-${idx}`} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded border-2 transition-all duration-300 ${isActive ? 'bg-sky-500 border-sky-600 text-white shadow-md scale-110' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{val}</div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Visual Direction Indicator */}
                  {isLoopDir && st.scanI !== undefined && (
                      <div className="mt-2 flex items-center gap-2 justify-center bg-slate-100 py-1.5 rounded-lg border border-slate-200 shadow-inner">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scanning:</span>
                          <span className="font-mono font-black text-xs text-indigo-600 uppercase flex items-center gap-1">
                              {st.scanI === 0 && <><ArrowUp size={14}/> UP</>}
                              {st.scanI === 1 && <><ArrowRight size={14}/> RIGHT</>}
                              {st.scanI === 2 && <><ArrowDown size={14}/> DOWN</>}
                              {st.scanI === 3 && <><ArrowLeft size={14}/> LEFT</>}
                          </span>
                      </div>
                  )}

              </div>
          </div>
          
          {/* Queue Tuple Component */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Queue&lt;tuple&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[140px] max-h-[220px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (OUT)</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.q || []).map((tup: {dis: number, r: number, c: number}, i: number) => {
                          let isNewArrival = String(st.phase || '').includes('q_add') && i === st.q.length - 1;
                          let isTop = i === 0;
                          let isPopping = isTop && (String(st.phase || '').includes('q_peek') || st.phase === 'q_remove' || st.phase.includes('extract'));
                          
                          return (
                              <div key={`qt-${i}-${tup.r}-${tup.c}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse ring-4 ring-fuchsia-200 scale-105 z-10 relative' : (isTop ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">dis: {tup.dis}</span>
                                  <span className="text-sm tracking-widest">[{tup.r}, {tup.c}]</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">n (rows):</span>
                          <span className="font-bold text-slate-700">{st.n !== undefined ? st.n : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">m (cols):</span>
                          <span className="font-bold text-slate-700">{st.m !== undefined ? st.m : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">Active Node (r,c):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest">{st.activeR !== undefined && st.activeC !== undefined ? `[${st.activeR}, ${st.activeC}]` : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-fuchsia-500">dis:</span>
                          <span className="font-bold text-fuchsia-700">{st.activeDis !== undefined ? st.activeDis : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-emerald-500">i (dir):</span>
                          <span className="font-bold text-emerald-700">{st.scanI !== undefined ? st.scanI : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">Neighbor (newr, newc):</span>
                          <span className="font-bold text-rose-700 uppercase tracking-widest">{st.newr !== undefined && st.newc !== undefined ? `[${st.newr}, ${st.newc}]` : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
  };

  const renderMainCanvas = () => {
      if (st.grid === undefined || st.dist === undefined) return (
          <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>
      );
      
      const n = st.n;
      const m = st.m;

      // Determine cell size so the grid fits nicely
      const maxDim = Math.max(n, m);
      const cellSize = Math.min(80, Math.floor(400 / maxDim)); // Max 80px, scale down for huge grids

      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
              
              {/* Dual Matrix Container */}
              <div className="flex flex-row gap-12 lg:gap-24 items-center justify-center">
                  
                  {/* Left: grid[][] Matrix */}
                  <div className="flex flex-col items-center gap-3">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2"><LayoutGrid size={14}/> grid[][] (Maze)</span>
                      
                      <div className="flex flex-col gap-1 p-3 bg-white border border-slate-200 shadow-md rounded-2xl">
                          {st.grid.map((row: number[], i: number) => (
                              <div key={`g-row-${i}`} className="flex gap-1">
                                  {row.map((cell: number, j: number) => {
                                      let isSource = st.src[0] === i && st.src[1] === j;
                                      let isDest = st.dest[0] === i && st.dest[1] === j;
                                      let isBlocked = cell === 0;
                                      
                                      let isActive = st.activeR === i && st.activeC === j;
                                      let isChecking = st.newr === i && st.newc === j;
                                      
                                      // Determine if it's in the queue (to highlight it's a discovered path)
                                      let isQueued = false;
                                      if (st.q) {
                                          for(let t of st.q) { if (t.r === i && t.c === j) isQueued = true; }
                                      }

                                      // Base classes
                                      let bgClass = isBlocked ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300 border border-slate-200';
                                      
                                      if (isQueued && !isActive) bgClass = 'bg-indigo-100 text-indigo-400 border border-indigo-300 shadow-inner';
                                      if (isActive) bgClass = 'bg-fuchsia-500 text-white border border-fuchsia-600 shadow-lg scale-110 z-20';
                                      
                                      // Ring logic for checking neighbor
                                      let ringClass = '';
                                      if (isChecking) {
                                          if (st.phase === 'eval_bounds') {
                                              ringClass = st.isRelaxable ? 'ring-4 ring-emerald-400 ring-offset-2 z-30 scale-110' : 'ring-4 ring-rose-400 ring-offset-2 z-30 scale-110';
                                          } else if (st.phase === 'do_relax' || st.phase === 'eval_target' || st.phase === 'q_add') {
                                              ringClass = 'ring-4 ring-emerald-500 ring-offset-2 z-30 scale-110';
                                          } else if (st.phase === 'calc_newr' || st.phase === 'calc_newc') {
                                              ringClass = 'ring-4 ring-amber-400 ring-offset-2 z-30 scale-110';
                                          }
                                      }

                                      return (
                                          <div 
                                            key={`g-cell-${i}-${j}`} 
                                            className={`flex items-center justify-center font-mono font-bold rounded-lg transition-all duration-300 relative select-none ${bgClass} ${ringClass}`}
                                            style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.4 }}
                                          >
                                              {cell}
                                              
                                              {/* Overlays for Src/Dest */}
                                              {isSource && <div className="absolute -top-3 -left-3 bg-indigo-500 text-white rounded-full p-1 shadow-md border-2 border-white z-40"><MapPin size={cellSize * 0.3}/></div>}
                                              {isDest && <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-md border-2 border-white z-40"><Compass size={cellSize * 0.3}/></div>}
                                              
                                              {/* Done Success Bounce */}
                                              {st.isDone && st.isSuccess && isDest && <div className="absolute inset-0 bg-emerald-400/50 rounded-lg animate-pulse z-50"></div>}
                                          </div>
                                      )
                                  })}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Right: dist[][] Matrix */}
                  <div className="flex flex-col items-center gap-3">
                      <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 shadow-sm flex items-center gap-2"><Layers size={14}/> dist[][] (Shortest Distances)</span>
                      
                      <div className="flex flex-col gap-1 p-3 bg-white border border-slate-200 shadow-md rounded-2xl">
                          {st.dist.map((row: number[], i: number) => (
                              <div key={`d-row-${i}`} className="flex gap-1">
                                  {row.map((val: number, j: number) => {
                                      
                                      let isInfinity = val === 1e9;
                                      
                                      let isEvaluatingInner = st.phase === 'dist_loop_inner' && st.loopI === i && st.loopJ === j;
                                      let isSettingInf = st.phase === 'dist_set_inf' && st.loopI === i && st.loopJ === j;
                                      let isSettingSrc = st.phase === 'set_dist_src' && st.src[0] === i && st.src[1] === j;
                                      
                                      let isNewlyRelaxed = st.phase === 'do_relax' && st.newr === i && st.newc === j;
                                      let isEvaluatingRelax = st.phase === 'eval_bounds' && st.newr === i && st.newc === j && st.inBounds && st.isPath;

                                      let boxBg = isInfinity ? 'bg-slate-50 text-slate-300 border border-slate-200 border-dashed' : 'bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm font-black';
                                      
                                      if (isEvaluatingInner) boxBg = 'bg-amber-100 text-amber-500 border border-amber-300 scale-105 z-10';
                                      if (isSettingInf) boxBg = 'bg-slate-200 text-slate-500 border border-slate-400 scale-110 shadow-lg z-20 transition-all';
                                      if (isSettingSrc) boxBg = 'bg-emerald-500 text-white border border-emerald-600 scale-110 shadow-lg z-20 font-black';
                                      
                                      if (isNewlyRelaxed) boxBg = 'bg-emerald-500 text-white border border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 z-20 font-black animate-in zoom-in';
                                      if (isEvaluatingRelax) boxBg += ' ring-4 ring-rose-400 scale-110 z-10';

                                      return (
                                          <div 
                                            key={`d-cell-${i}-${j}`} 
                                            className={`flex items-center justify-center font-mono rounded-lg transition-all duration-300 select-none ${boxBg}`}
                                            style={{ width: cellSize, height: cellSize, fontSize: isInfinity ? cellSize * 0.5 : cellSize * 0.4 }}
                                          >
                                              {isInfinity ? '∞' : val}
                                          </div>
                                      )
                                  })}
                              </div>
                          ))}
                      </div>
                  </div>

              </div>

              {/* Central Evaluation HUD */}
              {st.phase && st.phase === 'eval_bounds' && st.newr !== undefined && st.newc !== undefined && (
                  <div className="absolute bottom-10 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Activity size={14} className="text-amber-500"/> Evaluating Next Cell</span>
                      
                      <div className="flex flex-col items-center gap-2">
                          <span className={`font-mono font-black text-sm px-4 py-1.5 rounded-lg border ${st.inBounds ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>Bounds: [{st.newr}, {st.newc}] {st.inBounds ? 'Valid' : 'Invalid'}</span>
                          
                          {st.inBounds && (
                              <span className={`font-mono font-black text-sm px-4 py-1.5 rounded-lg border ${st.isPath ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>Cell Type: grid[{st.newr}][{st.newc}] == {st.isPath ? '1 (Open)' : '0 (Blocked)'}</span>
                          )}

                          {st.inBounds && st.isPath && (
                              <span className={`font-mono font-black text-sm px-4 py-1.5 rounded-lg border ${st.isRelaxable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>Relaxation: {st.activeDis} + 1 &lt; {st.dist[st.newr][st.newc] === 1e9 ? '∞' : st.dist[st.newr][st.newc]} ? {st.isRelaxable ? 'YES' : 'NO'}</span>
                          )}
                      </div>
                  </div>
              )}
          </div>
      );
  };

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
                      Graph Algorithm
                  </span>
                  <span>•</span>
                  <span>BFS Traversal in 2D Matrix</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><LayoutGrid size={28}/> Navigating a 2D Binary Maze</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an <code>N x M</code> matrix where <code>1</code> represents a valid path and <code>0</code> represents a wall, we need to find the shortest distance from a <strong>Source</strong> coordinate to a <strong>Destination</strong> coordinate.</p>
                        <p>Because moving from one adjacent cell to another always costs exactly 1 unit of distance, we don't need a complex Dijkstra Priority Queue. A standard FIFO <code>Queue</code> combined with a <code>dist[][]</code> tracking array guarantees that the <em>very first time</em> our Breadth-First Search (BFS) wavefront touches the destination, it is mathematically the absolute shortest path!</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Test Case 1 */}
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: GeeksForGeeks Match</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>grid:</strong><br/>1 1 1 1<br/>1 1 0 1<br/>1 1 1 1<br/>1 1 0 0<br/>1 0 0 1<br/><br/><strong>src:</strong> [0, 1]<br/><strong>dest:</strong> [2, 2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">3</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">
                                Starting at [0,1]. We can move Down to [1,1] (dist 1).<br/>
                                Move Down to [2,1] (dist 2).<br/>
                                Move Right to [2,2] (dist 3). Target reached!
                            </span>
                        </div>

                        {/* Test Case 2 */}
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Blocked/Trapped</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>grid:</strong><br/>1 1 0 1<br/>1 0 1 1<br/>0 1 1 1<br/><br/><strong>src:</strong> [0, 0]<br/><strong>dest:</strong> [2, 3]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">-1</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">
                                The starting region [0,0] is completely walled off by 0s from the rest of the open grid. The BFS queue naturally exhausts itself without ever reaching the destination. Returns -1.
                            </span>
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="flex flex-wrap gap-3 pb-3 border-b border-slate-100 mb-2">
                        <button onClick={loadTestCase1} className={`px-4 py-2 bg-${themeColor}-50 text-${themeColor}-700 border border-${themeColor}-200 hover:bg-${themeColor}-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 1 (Valid Path)</button>
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><AlertTriangle size={14}/> Test Case 2 (Trapped)</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1`}>Source [row, col]</label>
                            <input type="text" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner font-bold text-indigo-600`} placeholder="0,1" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1`}>Destination [row, col]</label>
                            <input type="text" value={destInput} onChange={(e) => setDestInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner font-bold text-emerald-600`} placeholder="2,2" />
                        </div>
                        <div className="space-y-1.5 md:col-span-4">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Binary Grid Rows (Use | for new row)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1,1,1,1 | 1,1,0,1 | 1,1,1,1 | ..." />
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

                {/* Unified Sub-layout for Normal Mode ensuring no overlapping */}
                <div className="flex flex-col xl:flex-row gap-4 h-[650px]">
                    
                    {/* Main Canvas Container */}
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Grid size={14} className={`text-${themeColor}-500`}/> 2D Binary Maze Environment</span>
                        
                        {/* Interactive Grid Area */}
                        <div className="flex-1 relative bg-slate-50 overflow-hidden">
                            {renderMainCanvas()}
                        </div>
                    </div>

                    {/* Right Panel for Sidebars */}
                    <div className="w-full xl:w-[320px] bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-4 overflow-y-auto">
                        {renderRightSidebar()}
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding why standard BFS perfectly replaces Dijkstra's algorithm in a grid environment.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-indigo-500"/> Phase 1: Unweighted Graph Equivalence</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A 2D Binary Maze is essentially an unweighted graph (or a graph where every edge has a uniform weight of exactly 1). Stepping Up, Down, Left, or Right all cost exactly 1 unit of distance. Because the costs are identical, we don't need a Min-Heap/Priority Queue. A simple FIFO Queue naturally processes nodes in strictly increasing order of their distance from the source!</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayoutGrid size={24} className="text-emerald-500"/> Phase 2: Direction Vectors (dr, dc)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of an explicit Adjacency List like <code>adj.get(node)</code>, grids use implicit edges. By iterating through the mathematical directional vectors <code>dr = [-1,0,1,0]</code> and <code>dc = [0,1,0,-1]</code>, we instantly calculate the coordinates of our 4 adjacent neighbors. We then apply Boundary Checks to ensure we don't fall off the matrix, and a Blocked Check to ensure the cell is a `1`.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>Where N is the number of rows and M is the number of columns. The `dist` matrix initialization takes O(N * M). In the absolute worst-case (an entirely empty grid), BFS will push and pop every single cell exactly once, doing 4 constant-time neighbor checks. This creates a strict linear bound of O(N * M).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>The `dist[][]` array requires O(N * M) space. The Queue, in the worst case (e.g., reaching the widest diagonal of the grid), will hold proportional to O(max(N, M)) elements, but is safely bounded by O(N * M).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Grid traversals are the most frequently asked graph problems in technical interviews. You must be comfortable translating standard graph concepts into 2D array matrix logic."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we use Depth-First Search (DFS) for this instead?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, DFS does not guarantee the shortest path."</p>
                            <p>DFS plunges as deeply as possible into the grid. It might find the destination, but the path it takes could be incredibly winding and long. To guarantee we found the *shortest* path with DFS, we would have to exhaustively search every possible valid path in the entire grid to compare them, resulting in an abysmal exponential O(4^(N * M)) time limit exceeded failure."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we use a `dist[][]` array instead of a `visited[][]` boolean array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because the prompt specifically asks for the shortest *distance*, not just reachability."</p>
                            <p>A boolean visited array would work perfectly if we just wanted to know IF a path exists. But since we need the numerical distance, storing integers inside `dist[][]` acts as both our distance tracker AND our visited tracker! If `dist[r][c] != 1e9`, we implicitly know it has already been visited."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
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

              {/* CENTER CANVAS AREA - No Overlaps! */}
              <div className="flex-1 relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl z-30">
                  
                  {/* Top Bar inside Center */}
                  <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between z-20 shrink-0">
                      <div className="flex items-center gap-4 w-full max-w-2xl">
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1`}>src:</label>
                          <input type="text" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-indigo-500 font-bold text-indigo-600`} placeholder="0,1" />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 shrink-0 ml-2`}>dest:</label>
                          <input type="text" value={destInput} onChange={(e) => setDestInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-emerald-500 font-bold text-emerald-600`} placeholder="2,2" />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Grid:</label>
                          <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1,1,1,1 | 1,1,0,1 | ..." />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={resetPanZoom} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  {/* Interactive Grid Area */}
                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute inset-0 w-full h-full transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                          {renderMainCanvas()}
                      </div>
                      
                      {!st.isDone && (
                          <div className="absolute bottom-8 right-8 z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 pointer-events-none">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 bg-white/80 px-3 py-1 rounded shadow-sm border border-slate-200">Shortcuts: &larr; &rarr;</span>
                              <div className="pointer-events-auto flex gap-3">
                                  <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-4 bg-white text-slate-700 rounded-2xl shadow-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2"><ChevronLeft size={20}/> PREV</button>
                                  <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-4 bg-${themeColor}-500 text-white rounded-2xl shadow-xl border border-${themeColor}-400 hover:bg-${themeColor}-600 active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-30`}>NEXT <ChevronRight size={20}/></button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* RIGHT SIDEBAR - State and Variables safely separated */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
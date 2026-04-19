import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  minEffortPath: {
    id: 'minEffortPath',
    title: 'Path With Minimum Effort',
    icon: <Combine size={16} />,
    complexity: 'Time: O(E log V) | Space: O(V)',
    theme: 'rose',
    code: `class Tuple {
    int distance;
    int row;
    int col;
    public Tuple(int distance, int row, int col) {
        this.row = row;
        this.distance = distance;
        this.col = col;
    }
}

class Solution {
    int MinimumEffort(int heights[][]) {
        PriorityQueue<Tuple> pq = 
            new PriorityQueue<Tuple>((x,y) -> x.distance - y.distance);
        
        int n = heights.length;
        int m = heights[0].length;
        int[][] dist = new int[n][m];
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                dist[i][j] = (int)(1e9);
            }
        }
        
        dist[0][0] = 0;
        pq.add(new Tuple(0, 0, 0));
        int dr[] = {-1, 0, 1, 0};
        int dc[] = {0, 1, 0, -1};
        
        while(pq.size() != 0) {
            Tuple it = pq.peek();
            pq.remove();
            int diff = it.distance;
            int row = it.row;
            int col = it.col;
            
            if(row == n - 1 && col == m - 1) return diff;
            
            for(int i = 0; i < 4; i++) {
                int newr = row + dr[i];
                int newc = col + dc[i];
                
                if(newr >= 0 && newc >= 0 && newr < n && newc < m) {
                    int newEffort = Math.max(
                        Math.abs(heights[row][col] - heights[newr][newc]), diff);
                    if(newEffort < dist[newr][newc]) {
                        dist[newr][newc] = newEffort;
                        pq.add(new Tuple(newEffort, newr, newc));
                    }
                }
            }
        }
        return 0;
    }
}`,
    desc: "The Path With Minimum Effort problem is a beautiful variation of Dijkstra's Algorithm on a 2D Grid. Instead of calculating the SUM of edge weights, we track the MAXIMUM absolute difference in heights encountered along a path. A Priority Queue (Min-Heap) ensures we always greedily explore the path that has required the lowest maximum effort so far. The moment we pop the destination cell from our Min-Heap, we are mathematically guaranteed that it is the minimum possible effort!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|MinimumEffort|heights|Tuple|distance|row|col|LinkedList|Queue|PriorityQueue|ArrayList|List|Integer|String|pq|n|m|dist|dr|dc|diff|newr|newc|newEffort|Math|max|abs|it|add|isEmpty|peek|remove|length|size)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'PriorityQueue', 'ArrayList', 'List', 'Tuple'].includes(part);
            const isPointer = ['heights', 'distance', 'row', 'col', 'pq', 'n', 'm', 'dist', 'dr', 'dc', 'diff', 'newr', 'newc', 'newEffort', 'it', 'i', 'j', 'x', 'y'].includes(part);
            const isMapCall = ['MinimumEffort', 'add', 'remove', 'isEmpty', 'peek', 'length', 'size', 'max', 'abs'].includes(part);
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

export default function MinimumEffortVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('minEffortPath');
  
  const [gridInput, setGridInput] = useState('1,2,2 | 3,8,2 | 5,3,5');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [1,2,2], [3,8,2], [5,3,5]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const loadTestCase1 = () => setGridInput('1,2,2 | 3,8,2 | 5,3,5');
  const loadTestCase2 = () => setGridInput('1,2,3 | 3,8,4 | 5,3,5');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = gridInput.split('|').map(r => r.trim());
        let parsedGrid: number[][] = [];
        let maxCols = 0;
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            parsedGrid.push(cells.map(v => isNaN(v) ? 0 : v));
            if (cells.length > maxCols) maxCols = cells.length;
        }
        
        for(let i=0; i<parsedGrid.length; i++) {
            while(parsedGrid[i].length < maxCols) parsedGrid[i].push(0);
        }
        
        if (parsedGrid.length === 0) parsedGrid = [[1]];

        setBaseGrid(parsedGrid);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [gridInput]);

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
    const heights = baseGrid;
    
    if (heights.length === 0) return steps;

    // Local state to track
    let pq: {diff: number, row: number, col: number}[] = [];
    let n = heights.length;
    let m = heights[0].length;
    let dist: number[][] = Array.from({length: n}, () => Array(m).fill(1e9));
    let distHistory: number[][][] = Array.from({length: n}, () => Array.from({length: m}, () => []));

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { heights: clone2D(heights), pq: [...pq], dist: clone2D(dist), distHistory: clone2D(distHistory.map(r => r.map(c => [...c]))), n, m, ...stateObj } 
    });

    add("Function Call", `int MinimumEffort(int heights[][])\nInitiating Dijkstra's on the heights matrix.`, 13, { phase: 'init' });
    
    add("Init PQ", `PriorityQueue<Tuple> pq = new PriorityQueue<Tuple>((x,y) -> x.distance - y.distance);\nCreated Min-Heap to extract path with smallest effort.`, 14, { phase: 'init_pq' });
    
    add("Init Grid Bounds", `int n = heights.length;\nint m = heights[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 17, { phase: 'init_bounds' });
    add("Init Grid Bounds", `int m = heights[0].length;\nRows (n) = ${n}, Cols (m) = ${m}.`, 18, { phase: 'init_bounds' });

    add("Init Dist Array", `int[][] dist = new int[n][m];\nAllocated tracking matrix for minimum effort.`, 19, { phase: 'init_dist_ds' });
    
    for(let i=0; i<n; i++) {
        add("Outer Loop", `for(int i = 0; i < n; i++)`, 20, { phase: 'dist_loop_outer', loopI: i });
        for(let j=0; j<m; j++) {
            add("Inner Loop", `for(int j = 0; j < m; j++)`, 21, { phase: 'dist_loop_inner', loopI: i, loopJ: j });
            dist[i][j] = 1e9;
            add("Set Dist Infinity", `dist[i][j] = (int)(1e9);\nSet mathematically infinite effort initially.`, 22, { phase: 'dist_set_inf', loopI: i, loopJ: j });
        }
    }

    dist[0][0] = 0;
    distHistory[0][0].push(0);
    add("Set Source Dist", `dist[0][0] = 0;\nThe effort to stay at the starting cell is 0.`, 26, { phase: 'set_dist_src' });

    pq.push({diff: 0, row: 0, col: 0});
    add("Enqueue Source", `pq.add(new Tuple(0, 0, 0));\nPushed starting tuple [diff:0, r:0, c:0] to Min-Heap.`, 27, { phase: 'pq_add_src' });

    add("Init Direction Arrays", `int dr[] = {-1, 0, 1, 0};\nAllocating directional vectors for rows.`, 28, { phase: 'init_dir' });
    add("Init Direction Arrays", `int dc[] = {0, 1, 0, -1};\nAllocating directional vectors for columns.`, 29, { phase: 'init_dir' });

    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    let targetFound = false;
    let finalEffort = -1;

    while(pq.length > 0 && !targetFound) {
        add("While PQ Loop", `while(pq.size() != 0)\nMin-Heap has elements. Extracting path with the smallest maximum effort!`, 31, { phase: 'while_q' });
        
        let it = pq[0];
        add("Peek Queue", `Tuple it = pq.peek();\nPeeking the minimum effort cell.`, 32, { phase: 'q_peek', activeR: it.row, activeC: it.col, activeDiff: it.diff });
        
        pq.shift();
        add("Dequeue Tuple", `pq.remove();\nPopped tuple from Min-Heap.`, 33, { phase: 'q_remove', activeR: it.row, activeC: it.col, activeDiff: it.diff });

        let diff = it.diff;
        add("Extract Diff", `int diff = it.distance;\nMaximum effort accumulated on this path so far is ${diff}.`, 34, { phase: 'extract_dis', activeR: it.row, activeC: it.col, activeDiff: diff });
        
        let r = it.row;
        add("Extract Row", `int row = it.row;\nCurrent row: ${r}.`, 35, { phase: 'extract_r', activeR: r, activeC: it.col, activeDiff: diff });
        
        let c = it.col;
        add("Extract Col", `int col = it.col;\nCurrent col: ${c}.`, 36, { phase: 'extract_r', activeR: r, activeC: c, activeDiff: diff });

        add("Check Target Arrival", `if(row == n - 1 && col == m - 1) return diff;\nAre we at the destination [${n-1}, ${m-1}]?`, 38, { phase: 'eval_target', activeR: r, activeC: c, activeDiff: diff });

        if (r === n - 1 && c === m - 1) {
            targetFound = true;
            finalEffort = diff;
            add("Target Reached!", `return diff;\nYES! Because we use a Min-Heap, the first time we pop the destination, it is guaranteed to be the absolute minimum effort. Returning ${finalEffort}.`, 38, { phase: 'done', isDone: true, isSuccess: true, finalDis: finalEffort });
            break;
        }

        add("Directions Loop", `for(int i = 0; i < 4; i++)\nChecking 4 neighboring directions.`, 40, { phase: 'for_dir', activeR: r, activeC: c, activeDiff: diff });

        for (let i = 0; i < 4; i++) {
            let newr = r + dr[i];
            add("Calc New Row", `int newr = row + dr[i];\nChecking neighbor row ${newr}.`, 41, { phase: 'calc_newr', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr });
            
            let newc = c + dc[i];
            add("Calc New Col", `int newc = col + dc[i];\nChecking neighbor col ${newc}.`, 42, { phase: 'calc_newc', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr, newc });

            let inBounds = newr >= 0 && newc >= 0 && newr < n && newc < m;

            add("Evaluate Bounds", `if(newr >= 0 && newc >= 0 && newr < n && newc < m)\nIs [${newr}, ${newc}] within grid limits?`, 44, { phase: 'eval_bounds', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr, newc, inBounds });

            if (inBounds) {
                let absDiff = Math.abs(heights[r][c] - heights[newr][newc]);
                let newEffort = Math.max(absDiff, diff);
                
                add("Calculate New Effort", `int newEffort = Math.max(\n  Math.abs(heights[row][col] - heights[newr][newc]), diff);\nStep effort is |${heights[r][c]} - ${heights[newr][newc]}| = ${absDiff}.\nPath max effort = max(${absDiff}, ${diff}) = ${newEffort}.`, 45, { phase: 'calc_effort', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr, newc, absDiff, newEffort });

                let currDistVal = dist[newr][newc];
                let isRelaxable = newEffort < currDistVal;

                add("Evaluate Relaxation", `if(newEffort < dist[newr][newc])\nIs ${newEffort} < ${currDistVal === 1e9 ? '∞' : currDistVal}?`, 47, { phase: 'eval_relax', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr, newc, absDiff, newEffort, isRelaxable });

                if (isRelaxable) {
                    if (dist[newr][newc] !== 1e9) {
                        distHistory[newr][newc].push(dist[newr][newc]); // Record history
                    }
                    dist[newr][newc] = newEffort;
                    add("Relax Effort", `dist[newr][newc] = newEffort;\nYES! Found a path requiring less maximum effort. Updated dist[${newr}][${newc}] to ${newEffort}.`, 48, { phase: 'do_relax', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr, newc, newEffort });

                    pq.push({diff: newEffort, row: newr, col: newc});
                    pq.sort((a, b) => a.diff - b.diff); // PQ sort Min-Heap
                    
                    add("Enqueue Neighbor", `pq.add(new Tuple(newEffort, newr, newc));\nPushed [diff:${newEffort}, r:${newr}, c:${newc}] into Min-Heap. Auto-sorted!`, 49, { phase: 'q_add', activeR: r, activeC: c, activeDiff: diff, scanI: i, newr, newc, newEffort });
                }
            }
        }
    }

    if (!targetFound) {
        add("Queue Empty Exit", `while(pq.size() != 0)\nMin-Heap empty.`, 31, { phase: 'done_while' });
        add("Final Return", `return 0;\nFall back return (though destination is usually reachable in valid inputs).`, 54, { phase: 'done', isDone: true, isSuccess: false });
    }

    return steps;
  }, [baseGrid]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => setCurrentStep(0); 
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e: React.PointerEvent) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetPanZoom = () => { setPan({x:0, y:0}); setZoom(0.85); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Combine size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.isSuccess ? 'text-rose-400' : 'text-slate-400'}`}>
                    {st.isSuccess ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>} 
                    {st.isSuccess ? "MINIMUM EFFORT FOUND" : "UNREACHABLE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `The route requiring the minimum effort to reach the destination has a max absolute difference of ${curStepData.state?.finalDis}.` : `Destination unreachable.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('q_add') || String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('calc_effort') ? 'text-amber-400' : (String(st.phase || '').includes('q_pop') || String(st.phase || '').includes('q_remove') || String(st.phase || '').includes('extract') ? 'text-fuchsia-400' : (String(st.phase || '').includes('calc') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderRightSidebar = () => {
      const isLoopDir = st.phase && (st.phase.includes('for_dir') || st.phase.includes('calc') || st.phase.includes('eval') || st.phase.includes('relax') || st.phase.includes('target') || st.phase === 'q_add');
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Min-Heap (pq)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[140px] max-h-[300px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (MIN EFFORT)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.pq === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.pq || []).map((tup: {diff: number, r: number, c: number}, i: number) => {
                          let isNewArrival = String(st.phase || '').includes('q_add') && tup.r === st.newr && tup.c === st.newc && tup.diff === st.newEffort;
                          let isTop = i === 0;
                          let isPopping = isTop && (String(st.phase || '').includes('q_peek') || st.phase === 'q_remove' || st.phase.includes('extract'));
                          return (
                              <div key={`qt-${i}-${tup.r}-${tup.c}-${tup.diff}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse ring-4 ring-fuchsia-200 scale-105 z-10 relative' : (isTop ? 'bg-rose-500 border-rose-600' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">diff: {tup.diff}</span>
                                  <span className="text-sm tracking-widest">[{tup.r}, {tup.c}]</span>
                              </div>
                          )
                      })}
                      {st.pq !== undefined && st.pq.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">Active Node (r,c):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest">{st.activeR !== undefined && st.activeC !== undefined ? `[${st.activeR}, ${st.activeC}]` : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-fuchsia-500">diff:</span>
                          <span className="font-bold text-fuchsia-700">{st.activeDiff !== undefined ? st.activeDiff : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-emerald-500">i (dir):</span>
                          <span className="font-bold text-emerald-700">{st.scanI !== undefined ? st.scanI : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">Neighbor (newr, newc):</span>
                          <span className="font-bold text-rose-700 uppercase tracking-widest">{st.newr !== undefined && st.newc !== undefined ? `[${st.newr}, ${st.newc}]` : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-amber-500">newEffort:</span>
                          <span className="font-bold text-amber-700">{st.newEffort !== undefined ? st.newEffort : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
  };

  const renderMainCanvas = () => {
      if (st.heights === undefined || st.dist === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      const n = st.n, m = st.m;
      const maxDim = Math.max(n, m);
      const cellSize = Math.min(100, Math.floor(450 / maxDim)); 

      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
              <div className="flex flex-row gap-12 lg:gap-24 items-center justify-center flex-wrap">
                  {/* Left: heights[][] Matrix */}
                  <div className="flex flex-col items-center gap-3 relative">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2"><LayoutGrid size={14}/> heights[][]</span>
                      
                      <div className="flex flex-col gap-1 p-3 bg-white border border-slate-200 shadow-md rounded-2xl relative">
                          
                          {/* Drawing Edge Vector overlay for visual space utilization */}
                          <svg className="absolute inset-0 w-full h-full z-40 pointer-events-none" style={{ overflow: 'visible' }}>
                              {st.phase && (st.phase === 'calc_effort' || st.phase === 'eval_relax' || st.phase === 'do_relax' || st.phase === 'q_add' || st.phase === 'eval_bounds') && st.activeR !== undefined && st.newr !== undefined && st.inBounds && (
                                  <g>
                                      <line 
                                          x1={(st.activeC * (cellSize + 4)) + 12 + cellSize/2} 
                                          y1={(st.activeR * (cellSize + 4)) + 12 + cellSize/2} 
                                          x2={(st.newc * (cellSize + 4)) + 12 + cellSize/2} 
                                          y2={(st.newr * (cellSize + 4)) + 12 + cellSize/2}
                                          stroke={st.isRelaxable && st.phase === 'do_relax' ? '#10b981' : '#f59e0b'}
                                          strokeWidth={st.isRelaxable && st.phase === 'do_relax' ? 6 : 4}
                                          strokeDasharray={st.isRelaxable && st.phase === 'do_relax' ? "" : "6 4"}
                                          className="animate-in fade-in"
                                      />
                                  </g>
                              )}
                          </svg>

                          {st.heights.map((row: number[], i: number) => (
                              <div key={`g-row-${i}`} className="flex gap-1">
                                  {row.map((cell: number, j: number) => {
                                      let isSource = i === 0 && j === 0;
                                      let isDest = i === n - 1 && j === m - 1;
                                      let isActive = st.activeR === i && st.activeC === j;
                                      let isChecking = st.newr === i && st.newc === j;
                                      let isQueued = false;
                                      if (st.pq) for(let t of st.pq) { if (t.row === i && t.col === j) isQueued = true; }
                                      
                                      let bgClass = 'bg-slate-50 text-slate-500 border border-slate-200';
                                      if (isQueued && !isActive) bgClass = 'bg-rose-50 text-rose-400 border border-rose-200 shadow-inner';
                                      if (isActive) bgClass = 'bg-fuchsia-500 text-white border border-fuchsia-600 shadow-lg scale-110 z-20';
                                      
                                      let ringClass = '';
                                      if (isChecking) {
                                          if (st.phase === 'calc_effort') ringClass = 'ring-4 ring-amber-400 ring-offset-2 z-30 scale-110';
                                          else if (st.phase === 'eval_relax') ringClass = st.isRelaxable ? 'ring-4 ring-emerald-400 ring-offset-2 z-30 scale-110' : 'ring-4 ring-rose-400 ring-offset-2 z-30 scale-110';
                                          else if (st.phase === 'do_relax' || st.phase === 'eval_target' || st.phase === 'q_add') ringClass = 'ring-4 ring-emerald-500 ring-offset-2 z-30 scale-110';
                                          else if (st.phase === 'calc_newr' || st.phase === 'calc_newc' || st.phase === 'eval_bounds') ringClass = 'ring-4 ring-amber-400 ring-offset-2 z-30 scale-110';
                                      }
                                      return (
                                          <div key={`g-cell-${i}-${j}`} className={`flex items-center justify-center font-mono font-bold rounded-lg transition-all duration-300 relative select-none ${bgClass} ${ringClass}`} style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.4 }}>
                                              {cell}
                                              {isSource && <div className="absolute -top-2 -left-2 bg-slate-700 text-white rounded-full p-1 shadow-md border-2 border-white z-40"><MapPin size={cellSize * 0.25}/></div>}
                                              {isDest && <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md border-2 border-white z-40"><Compass size={cellSize * 0.25}/></div>}
                                              {st.isDone && st.isSuccess && isDest && <div className="absolute inset-0 bg-emerald-400/50 rounded-lg animate-pulse z-50"></div>}
                                          </div>
                                      )
                                  })}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Right: dist[][] Matrix */}
                  <div className="flex flex-col items-center gap-3 z-30">
                      <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 shadow-sm flex items-center gap-2"><Layers size={14}/> dist[][] (Min Efforts)</span>
                      <div className="flex flex-col gap-1 p-3 bg-white border border-slate-200 shadow-md rounded-2xl">
                          {st.dist.map((row: number[], i: number) => (
                              <div key={`d-row-${i}`} className="flex gap-1">
                                  {row.map((val: number, j: number) => {
                                      let isInfinity = val === 1e9;
                                      let history = st.distHistory ? st.distHistory[i][j] : [];
                                      let isSettingSrc = st.phase === 'set_dist_src' && i === 0 && j === 0;
                                      let isNewlyRelaxed = st.phase === 'do_relax' && st.newr === i && st.newc === j;
                                      let isEvaluatingRelax = st.phase === 'eval_relax' && st.newr === i && st.newc === j;
                                      
                                      let boxBg = isInfinity ? 'bg-slate-50 text-slate-300 border border-slate-200 border-dashed' : 'bg-rose-100 text-rose-700 border border-rose-300 shadow-sm font-black';
                                      if (isSettingSrc) boxBg = 'bg-emerald-500 text-white border border-emerald-600 scale-110 shadow-lg z-20 font-black';
                                      if (isNewlyRelaxed) boxBg = 'bg-emerald-500 text-white border border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 z-20 font-black animate-in zoom-in';
                                      if (isEvaluatingRelax) boxBg += ' ring-4 ring-rose-400 scale-110 z-10';
                                      
                                      return (
                                          <div key={`d-cell-${i}-${j}`} className={`flex flex-col items-center justify-center font-mono rounded-lg transition-all duration-300 select-none relative group ${boxBg}`} style={{ width: cellSize, height: cellSize, fontSize: isInfinity ? cellSize * 0.5 : cellSize * 0.4 }}>
                                              <div className="absolute bottom-full mb-0.5 flex flex-col-reverse items-center justify-end gap-0 max-h-[30px] overflow-hidden leading-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                                  {(history || []).map((hVal: number, hIdx: number) => (
                                                      <span key={`hd-${i}-${j}-${hIdx}`} className="text-[9px] font-mono font-black text-rose-500 line-through decoration-rose-600 leading-tight bg-white/90 px-1 rounded shadow-sm">{hVal === 1e9 ? '∞' : hVal}</span>
                                                  ))}
                                              </div>
                                              {isInfinity ? '∞' : val}
                                          </div>
                                      )
                                  })}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
              
              {/* Dynamic Bottom Evaluation HUD uses massive whitespace effectively */}
              {st.phase && st.phase === 'calc_effort' && st.newEffort !== undefined && (
                  <div className="absolute bottom-10 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-bottom-10 w-[600px] max-w-[90%]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Activity size={14} className="text-amber-500"/> Calculating Max Effort for Path</span>
                      <div className="flex items-center gap-4 font-mono font-black text-2xl text-slate-700 w-full justify-between">
                          <div className="flex flex-col items-center flex-1">
                              <span className="text-[9px] uppercase tracking-widest text-amber-500 mb-1">Step Diff</span>
                              <span className="bg-amber-50 px-5 py-2 rounded-xl border border-amber-200 shadow-sm">|{st.heights[st.activeR][st.activeC]} - {st.heights[st.newr][st.newc]}| = {st.absDiff}</span>
                          </div>
                          <span className="text-slate-400 font-normal">vs</span>
                          <div className="flex flex-col items-center flex-1">
                              <span className="text-[9px] uppercase tracking-widest text-fuchsia-500 mb-1">Path Max So Far</span>
                              <span className="bg-fuchsia-50 px-5 py-2 rounded-xl border border-fuchsia-200 shadow-sm">{st.activeDiff}</span>
                          </div>
                          <span className="text-slate-400 font-normal">&rarr; max =</span>
                          <div className="flex flex-col items-center flex-1">
                              <span className="text-[9px] uppercase tracking-widest text-emerald-500 mb-1">newEffort</span>
                              <span className="bg-emerald-50 px-5 py-2 rounded-xl border border-emerald-200 shadow-md text-3xl">{st.newEffort}</span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>Dijkstra's Min-Heap on 2D Matrix</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Combine size={28}/> Path With Minimum Effort</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are a hiker preparing for a hike given a 2D array of <code>heights</code>. You want to travel from top-left <code>(0,0)</code> to bottom-right <code>(n-1, m-1)</code> finding a route that requires the minimum effort.</p>
                        <p>A route's effort is defined as the <strong>maximum absolute difference in heights</strong> between any two consecutive cells along the route.</p>
                        <p>This is a classic variation of Dijkstra's Algorithm on a grid. We track the `diff` (effort) in a Min-Heap. At each step, we evaluate neighbors: <code>newEffort = max(current_path_diff, abs(heights[r][c] - heights[newr][newc]))</code>.</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: LeetCode Example 1</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>heights:</strong><br/>1 2 2<br/>3 8 2<br/>5 3 5</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The route of [1,3,5,3,5] has a maximum absolute difference of 2. This beats the route [1,2,2,2,5] which has a maximum absolute difference of 3.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Peak Barrier</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>heights:</strong><br/>1 2 3<br/>3 8 4<br/>5 3 5</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">By routing around the '8' peak, we can maintain a lower maximum effort threshold.</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                {renderTraceOperationsBox()}
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[400px] max-h-[600px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="flex flex-wrap gap-3 pb-3 border-b border-slate-100 mb-2">
                        <button onClick={loadTestCase1} className={`px-4 py-2 bg-${themeColor}-50 text-${themeColor}-700 border border-${themeColor}-200 hover:bg-${themeColor}-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 1</button>
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Heights Grid Rows (Use | for new row)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1,2,2 | 3,8,2 | 5,3,5" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 h-[650px]">
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Combine size={14} className={`text-${themeColor}-500`}/> Min Effort Visualizer</span>
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            <div className="absolute inset-0 w-full h-full transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                                {renderMainCanvas()}
                            </div>
                        </div>
                    </div>
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
                    <div className="inline-flex items-center justify-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how Dijkstra adapts to calculating maximum thresholds instead of sums.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-rose-500"/> Phase 1: Maximum Difference Logic</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In classic Dijkstra, we add edge weights: <code>dist[u] + wt &lt; dist[v]</code>. But here, the "effort" of a path is not its sum, but its maximum individual jump! Therefore, when moving to a new cell, the new path's effort is <code>max(current_path_effort, abs(height[u] - height[v]))</code>. We only update the neighbor if this new max effort is strictly less than its previously known effort.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayoutGrid size={24} className="text-emerald-500"/> Phase 2: Priority Queue (Min-Heap)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because the effort costs vary dynamically based on height differences, standard BFS fails. We MUST use a Priority Queue to always greedily process the cell that currently has the lowest path effort. This ensures that the first time we pop the destination <code>[n-1, m-1]</code> from the Min-Heap, we have found the absolute optimal path.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-indigo-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M * log(N * M))</strong><br/>The grid has V = N * M vertices and roughly E = 4 * N * M edges. Standard Dijkstra runs in O(E log V). Substituting our variables, we get O(N * M * log(N * M)).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>The <code>dist[][]</code> array takes O(N * M). The Priority Queue can theoretically hold O(N * M) tuples in the worst case before duplicate slower paths are flushed. Total space is bounded by O(N * M).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-rose-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a common variation of Dijkstra. Interviewers test your ability to adapt the standard summation relaxation logic to fit custom threshold constraints."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we use Binary Search + BFS instead?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes! That is an excellent alternative approach."</p>
                            <p>Since the effort is bounded between 0 and 1,000,000, we could Binary Search the answer. For a mid value <code>k</code>, we run standard BFS allowing only edges where <code>abs(diff) &lt;= k</code>. If BFS reaches the end, we try a smaller <code>k</code>. This runs in O(N * M * log(max_diff)) which might be faster in certain dense constraints!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we early return inside the while loop?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because the Priority Queue guarantees optimality upon extraction."</p>
                            <p>Unlike standard BFS where you can return the moment you *add* the destination to the queue, Dijkstra requires you to wait until the destination is *popped* from the heap. This proves that no other path could possibly reach the destination with a lower effort."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>Heights:</label>
                          <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1,2,2 | 3,8,2 | ..." />
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
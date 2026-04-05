import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid as GridIcon, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox, Link, Truck, Clock
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  warehouseDispatch: {
    id: 'warehouseDispatch',
    title: 'Warehouse Truck Dispatch (BFS)',
    icon: <Truck size={16} />,
    complexity: 'Time: O(N × M) | Space: O(N × M)',
    theme: 'orange',
    code: `class Solution {
    public int dispatchTrucks(int[][] grid) {
        int n = grid.length;
        int m = grid[0].length;
        Queue<int[]> q = new LinkedList<>();
        int emptyCount = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 1) {
                    q.add(new int[]{i, j, 0});
                } else if (grid[i][j] == 0) {
                    emptyCount++;
                }
            }
        }
        
        int time = 0;
        int[] dr = {-1, 0, 1, 0};
        int[] dc = {0, 1, 0, -1};
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int r = curr[0];
            int c = curr[1];
            int t = curr[2];
            time = Math.max(time, t);
            
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i];
                int nc = c + dc[i];
                
                if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;
                    q.add(new int[]{nr, nc, t + 1});
                    emptyCount--;
                }
            }
        }
        
        return emptyCount == 0 ? time : -1;
    }
}`,
    desc: "To find the minimum time required to dispatch trucks to all empty warehouses, we use Multi-Source Breadth-First Search (BFS). First, we scan the grid to count all initially empty warehouses (0s) and push all initially ready warehouses (1s) into our Queue alongside a timestamp of 0. Next, we repeatedly pop from the Queue, check the 4 adjacent coordinates, and if we find an empty warehouse, we immediately dispatch a truck to it, increment the timestamp (t + 1), decrement our empty count, and push it into the Queue to act as a future source. Finally, if our empty count reaches 0, we return the total elapsed time. If empty warehouses remain trapped behind obstacles (-1), we return -1!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|Queue|LinkedList|Math|max|length|isEmpty|poll|add|grid|q|emptyCount|time|dr|dc|curr|r|c|t|nr|nc|dispatchTrucks)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-500` };
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
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'static', 'return', 'if', 'else', 'new', 'for', 'while', 'continue'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Queue', 'LinkedList', 'Solution'].includes(part);
            const isPointer = ['grid', 'n', 'm', 'q', 'emptyCount', 'time', 'dr', 'dc', 'curr', 'r', 'c', 't', 'nr', 'nc', 'i', 'j'].includes(part);
            const isMapCall = ['dispatchTrucks', 'length', 'isEmpty', 'poll', 'add', 'max'].includes(part);
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

// --- Main Application ---

export default function WarehouseDispatchVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'warehouseDispatch';
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const [gridInput, setGridInput] = useState('1, 0, 0 | 0, -1, 0 | 0, 0, 1');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1]
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);

  const loadTestCase1 = () => {
      setGridInput('1, 0, 0 | 0, -1, 0 | 0, 0, 1');
  };

  const loadTestCase2 = () => {
      setGridInput('1, 0, -1, 0 | -1, -1, -1, 0 | 0, 0, 0, 0');
  };

  const loadTestCase3 = () => {
      setGridInput('1, 1 | 1, 1');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = gridInput.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsed: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if(cells.length > 0 && !cells.some(isNaN)) {
                parsed.push(cells);
            }
        }
        
        // Equalize row lengths
        if(parsed.length > 0) {
            let maxC = Math.max(...parsed.map(r => r.length));
            parsed = parsed.map(r => {
                let newRow = [...r];
                while(newRow.length < maxC) newRow.push(0);
                return newRow;
            });

            setBaseGrid(parsed);
            setCurrentStep(0);
            setPan({ x: 0, y: 0 });
            setZoom(1);
        }
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

  const clone2D = (arr: number[][]) => arr.map(row => [...row]);

  // --- EXACT LINE-BY-LINE TRACE GENERATION (MULTI-SOURCE BFS) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const grid = clone2D(baseGrid);
    
    if (!grid || grid.length === 0 || grid[0].length === 0) return steps;

    const n = grid.length;
    const m = grid[0].length;
    let queue: {r: number, c: number, t: number}[] = [];
    let emptyCount = 0;
    let time = 0;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid: clone2D(grid), queue: [...queue], emptyCount, time, n, m, ...stateObj } 
    });

    add("Init Function", `public int dispatchTrucks(int[][] grid)\nStarting Multi-Source BFS algorithm to dispatch trucks to all empty warehouses.`, 2, { phase: 'init' });
    
    add("Init N", `int n = grid.length; // ${n}`, 3, { phase: 'init_vars' });
    add("Init M", `int m = grid[0].length; // ${m}`, 4, { phase: 'init_vars' });
    add("Init Queue", `Queue<int[]> q = new LinkedList<>();\nAllocating a Queue to track coordinate and time states.`, 5, { phase: 'init_vars' });
    add("Init Empty Count", `int emptyCount = 0;\nSetting counter to verify if any warehouses are left unsupplied later.`, 6, { phase: 'init_vars' });

    for(let i=0; i<n; i++) {
        add("Outer Loop", `for (int i = 0; i < n; i++) -> i=${i}`, 8, { phase: 'scan_outer', i });
        for(let j=0; j<m; j++) {
            add("Inner Loop", `for (int j = 0; j < m; j++) -> j=${j}`, 9, { phase: 'scan_inner', i, j });
            
            let val = grid[i][j];
            let isOne = val === 1;
            add("Check 1", `if (grid[i][j] == 1)\nIs cell (${i}, ${j}) a ready warehouse? ${isOne ? 'YES!' : 'NO.'}`, 10, { phase: 'check_one', i, j, isOne });
            
            if (isOne) {
                queue.push({r: i, c: j, t: 0});
                add("Add Source to Queue", `q.add(new int[]{${i}, ${j}, 0});\nRECORDING: Found trucks! Pushing to Queue as an initial multi-source starting at time t=0.`, 11, { phase: 'q_add_src', i, j });
            } else {
                let isZero = val === 0;
                add("Check 0", `} else if (grid[i][j] == 0)\nIs cell (${i}, ${j}) an empty warehouse? ${isZero ? 'YES.' : 'NO, it must be an obstacle (-1).'}`, 12, { phase: 'check_zero', i, j, isZero });
                
                if (isZero) {
                    emptyCount++;
                    add("Increment Empty Count", `emptyCount++;\nRECORDING: Found an empty warehouse. Total unsupplied = ${emptyCount}.`, 13, { phase: 'inc_empty', i, j, emptyCount });
                }
            }
        }
    }

    add("Init Time Tracker", `int time = 0;\nGlobal clock initialized to 0.`, 18, { phase: 'init_time' });
    add("Init dr", `int[] dr = {-1, 0, 1, 0};`, 19, { phase: 'init_dr' });
    add("Init dc", `int[] dc = {0, 1, 0, -1};\nSetting up Deltas to recursively scan North, East, South, and West.`, 20, { phase: 'init_dc' });

    let dr = [-1, 0, 1, 0];
    let dc = [0, 1, 0, -1];

    while(queue.length > 0) {
        add("While Queue Checking", `while (!q.isEmpty())\nQueue size: ${queue.length}. Processing next batch of dispatches!`, 22, { phase: 'while_q' });
        
        let curr = queue.shift()!;
        let r = curr.r, c = curr.c, t = curr.t;
        
        add("Poll Queue", `int[] curr = q.poll();\nPopped active dispatch instruction from Queue.`, 23, { phase: 'q_poll', r, c, t });
        add("Extract R", `int r = curr[0]; // ${r}`, 24, { phase: 'ext_r', r, c, t });
        add("Extract C", `int c = curr[1]; // ${c}`, 25, { phase: 'ext_c', r, c, t });
        add("Extract T", `int t = curr[2]; // ${t}\nActive truck is currently at (${r}, ${c}) at time ${t}.`, 26, { phase: 'ext_t', r, c, t });
        
        let oldTime = time;
        time = Math.max(time, t);
        add("Update Max Time", `time = Math.max(time, t);\nSynchronizing global clock. Maximum time taken so far is ${time}.`, 27, { phase: 'upd_time', r, c, t, oldTime, time });

        for(let i=0; i<4; i++) {
            add("Direction Loop", `for (int i = 0; i < 4; i++) -> dir=${i}\nChecking adjacent warehouse in direction ${i}...`, 29, { phase: 'dir_loop', r, c, t, dir: i });
            
            let nr = r + dr[i];
            add("Calc NR", `int nr = r + dr[i]; // ${nr}`, 30, { phase: 'calc_nr', r, c, t, dir: i, nr });
            let nc = c + dc[i];
            add("Calc NC", `int nc = c + dc[i]; // ${nc}`, 31, { phase: 'calc_nc', r, c, t, dir: i, nr, nc });
            
            let validBounds = nr >= 0 && nr < n && nc >= 0 && nc < m;
            let isEmpty = validBounds && grid[nr][nc] === 0;
            
            add("Evaluate Target", `if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == 0)\nIs (${nr}, ${nc}) strictly inside bounds AND currently empty? ${isEmpty ? 'YES!' : 'NO.'}`, 33, { phase: 'check_valid', r, c, t, dir: i, nr, nc, validBounds, isEmpty });

            if (isEmpty) {
                grid[nr][nc] = 1;
                add("Fill Warehouse", `grid[nr][nc] = 1;\nRECORDING: Trucks have arrived! Target warehouse at (${nr}, ${nc}) is now fully supplied.`, 34, { phase: 'fill_grid', r, c, t, dir: i, nr, nc });
                
                queue.push({r: nr, c: nc, t: t + 1});
                add("Queue New Dispatch", `q.add(new int[]{nr, nc, t + 1});\nThis newly supplied warehouse will be ready to dispatch trucks to its neighbors at time ${t + 1}. Adding to Queue!`, 35, { phase: 'q_add_new', r, c, t, dir: i, nr, nc });
                
                emptyCount--;
                add("Decrement Empty Count", `emptyCount--;\nRECORDING: Remaining unsupplied warehouses drops to ${emptyCount}.`, 36, { phase: 'dec_empty', r, c, t, dir: i, nr, nc, emptyCount });
            }
        }
    }
    
    add("While Exit", `while (!q.isEmpty())\nQueue is completely empty. The cascading dispatches have mathematically concluded!`, 22, { phase: 'while_exit' });

    let finalAns = emptyCount === 0 ? time : -1;
    add("Return Result", `return emptyCount == 0 ? time : -1;\nAre there any unsupplied warehouses left? ${emptyCount === 0 ? 'NO! Every warehouse was successfully reached!' : 'YES! We encountered unpassable obstacles.'}\nReturning ${finalAns}.`, 41, { phase: 'done', isDone: true, isSuccess: emptyCount === 0, finalAns });

    return steps;
  }, [baseGrid]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x: 0, y: 0}); 
    setZoom(1); 
  }; 
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
  const resetPanZoom = () => { setPan({x:0, y: 0}); setZoom(1); };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      else if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
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
                    {st.isSuccess ? "ALL WAREHOUSES SUPPLIED" : "WAREHOUSES UNREACHABLE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `Algorithm concluded successfully. The total optimal time taken to supply the entire grid was exactly ${st.finalAns} minutes!` : `Algorithm concluded with an error! The BFS was choked out by obstacles, leaving exactly ${st.emptyCount} warehouses permanently unsupplied.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('q_add') || String(st.phase || '').includes('fill_') ? 'text-emerald-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('calc') || String(st.phase || '').includes('ext_') ? 'text-amber-400' : (String(st.phase || '').includes('upd_time') || String(st.phase || '').includes('q_poll') || String(st.phase || '').includes('inc_empty') || String(st.phase || '').includes('dec_empty') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">
                    {String(curStepData.description || "").split('RECORDING:').map((part, idx) => {
                        if (idx === 0) return part;
                        return <React.Fragment key={idx}><br/><span className="text-amber-400 font-bold not-italic">📝 RECORDING:{part}</span></React.Fragment>
                    })}
                </p>
            </>
        )}
    </div>
  );

  // Dynamic Layout for Grid & Matrix-to-Node Visuals
  const renderMainCanvas = () => {
      if (st.grid === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const cellSize = 64;
      const rows = st.n;
      const cols = st.m;
      
      // Calculate boundaries to center
      const gridW = cols * cellSize;
      const gridH = rows * cellSize;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Massive Final Answer Popup */}
              {st.isDone && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                      <div className={`bg-${st.isSuccess ? 'emerald' : 'rose'}-600/95 backdrop-blur border-4 border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 flex flex-col items-center gap-4 text-white transform -translate-y-10`}>
                          {st.isSuccess ? <Trophy size={64} className="text-amber-300 drop-shadow-md animate-bounce"/> : <X size={64} className="text-white drop-shadow-md"/>}
                          <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Final Time Taken</span>
                          <span className="text-8xl font-black drop-shadow-xl pt-2">{st.finalAns}</span>
                      </div>
                  </div>
              )}

              {/* The Visual Grid / Node Plane */}
              <div style={{ width: gridW, height: gridH }} className="relative shrink-0 flex items-center justify-center rounded-2xl shadow-xl border-[6px] border-slate-300 bg-slate-200 overflow-hidden">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                      {Array.from({length: rows * cols}).map((_, i) => (
                          <div key={`cell-bg-${i}`} className="border-r border-b border-slate-300/60 w-full h-full"></div>
                      ))}
                  </div>

                  {/* Interactive Grid Layer */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                      {st.grid.map((rowArr: number[], r: number) => {
                          return rowArr.map((val: number, c: number) => {
                              let isSource = val === 1;
                              let isObstacle = val === -1;
                              let isEmpty = val === 0;
                              
                              let isActiveNode = st.phase && !st.phase.includes('scan') && st.r === r && st.c === c && !st.isDone;
                              let isTargetAdj = st.phase && st.phase.includes('check_valid') && st.nr === r && st.nc === c;
                              let isFilling = st.phase === 'fill_grid' && st.nr === r && st.nc === c;
                              let isPushing = st.phase === 'q_add_new' && st.nr === r && st.nc === c;

                              // Evaluate base classes based on grid val
                              let cellClasses = 'absolute flex items-center justify-center transition-all duration-500 rounded-xl m-1 ';
                              let internalContent = null;

                              if (isObstacle) {
                                  cellClasses += 'bg-slate-800 text-slate-600 shadow-inner border-2 border-slate-900';
                                  internalContent = <X size={28} strokeWidth={3}/>;
                              } else if (isSource) {
                                  cellClasses += 'bg-orange-500 text-white shadow-md border-2 border-orange-600 drop-shadow-lg';
                                  internalContent = <Truck size={28} strokeWidth={2.5}/>;
                              } else if (isEmpty) {
                                  cellClasses += 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-300';
                                  internalContent = <Layers size={24} strokeWidth={2}/>;
                              }

                              // Dominant Highlights
                              let ringClass = '';
                              let zIndex = 'z-10';

                              if (isActiveNode) {
                                  cellClasses = cellClasses.replace('bg-orange-500', 'bg-fuchsia-500');
                                  cellClasses = cellClasses.replace('border-orange-600', 'border-fuchsia-600');
                                  ringClass = 'ring-4 ring-fuchsia-300 ring-offset-2 scale-110';
                                  zIndex = 'z-40';
                              } else if (isTargetAdj) {
                                  ringClass = 'ring-4 ring-sky-400 ring-offset-2 scale-110 shadow-xl bg-sky-50 text-sky-400 border-sky-400';
                                  zIndex = 'z-30';
                              } else if (isFilling || isPushing) {
                                  cellClasses = cellClasses.replace('bg-orange-500', 'bg-emerald-500');
                                  cellClasses = cellClasses.replace('border-orange-600', 'border-emerald-600');
                                  ringClass = 'ring-4 ring-emerald-300 ring-offset-2 scale-110 animate-pulse shadow-xl';
                                  zIndex = 'z-50';
                                  internalContent = <Truck size={32} strokeWidth={3}/>; // Emphasize new arrival
                              }

                              return (
                                  <div key={`cell-${r}-${c}`} className={`${cellClasses} ${ringClass} ${zIndex}`} style={{ 
                                      left: `${c * cellSize}px`, 
                                      top: `${r * cellSize}px`, 
                                      width: `${cellSize - 8}px`,
                                      height: `${cellSize - 8}px`
                                  }}>
                                      {internalContent}
                                  </div>
                              );
                          });
                      })}
                  </div>

              </div>
          </div>
      );
  };

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-4 w-full h-full pb-8">

          {/* Queue Visualizer */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> BFS Queue (q)</span>
              <div className="flex w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[90px] overflow-x-auto scrollbar-thin items-center">
                  
                  {st.queue === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (
                      <>
                          {st.queue.length === 0 && <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Queue Empty</span>}
                          {st.queue.map((item: any, idx: number) => {
                              let isNewlyPushed = (st.phase === 'q_add_src' || st.phase === 'q_add_new') && idx === st.queue.length - 1;
                              let isPopping = st.phase === 'q_poll' && idx === 0;

                              let boxClass = 'bg-slate-100 text-slate-600 border-slate-200 shadow-sm';
                              if (isNewlyPushed) boxClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-in slide-in-from-right-8 scale-105 z-10';
                              else if (isPopping) boxClass = 'bg-amber-400 text-white border-amber-500 shadow-md animate-pulse scale-105 z-10';

                              return (
                                  <div key={`q-${idx}-${item.r}-${item.c}`} className={`flex flex-col items-center justify-center shrink-0 px-4 py-2 font-mono rounded-xl border transition-all duration-300 ${boxClass}`}>
                                      <span className="text-[10px] font-black">[{item.r},{item.c}]</span>
                                      <span className="text-[9px] uppercase tracking-widest opacity-80 mt-1 bg-black/10 px-2 rounded-full">t={item.t}</span>
                                  </div>
                              )
                          })}
                      </>
                  )}
              </div>
          </div>
          
          <div className="flex flex-col w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Total Time (time)
                          {st.phase === 'upd_time' && <span className="text-orange-500 text-[10px]">Math.max()</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'upd_time' ? 'text-orange-500 animate-pulse' : 'text-slate-700'}`}>{st.time !== undefined ? st.time : '-'}</span>
                  </div>

                  <div className="h-px bg-slate-100 w-full"></div>

                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Empty Warehouses (emptyCount)
                          {st.phase === 'inc_empty' && <span className="text-rose-500 text-[10px]">+1</span>}
                          {st.phase === 'dec_empty' && <span className="text-emerald-500 text-[10px]">-1</span>}
                      </span>
                      <span className={`text-3xl font-black ${st.phase === 'inc_empty' ? 'text-rose-500 animate-pulse' : (st.phase === 'dec_empty' ? 'text-emerald-500 animate-pulse' : 'text-slate-700')}`}>{st.emptyCount !== undefined ? st.emptyCount : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">r (Active):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest text-lg">{st.r !== undefined ? st.r : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">c (Active):</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.c !== undefined ? st.c : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1 col-span-2">
                          <span className="text-amber-500 font-bold">t (Arrival Time):</span>
                          <span className="font-bold text-amber-700 uppercase tracking-widest text-lg">{st.t !== undefined ? st.t : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">nr (Target):</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.nr !== undefined ? st.nr : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">nc (Target):</span>
                          <span className="font-bold text-sky-700 text-lg">{st.nc !== undefined ? st.nc : '-'}</span>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500 text-white`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>Multi-Source BFS Spread</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none items-center gap-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Truck size={28}/> Warehouse Truck Dispatch</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>This problem is a classic structural variant of <strong>Multi-Source Breadth-First Search (BFS)</strong>, identically modeled after LeetCode's famous "Rotting Oranges" problem.</p>
                        <p>Instead of a single starting node, we have an initial grid containing multiple active sources (Warehouses with Trucks, <code>1</code>). Every minute, these sources dispatch simultaneously in all 4 cardinal directions to any empty warehouses (<code>0</code>). We also must navigate around permanently blocked obstacles (<code>-1</code>).</p>
                        <ul className="list-decimal pl-6 space-y-2">
                            <li><strong>Initialization:</strong> Scan the entire grid. Count exactly how many `0`s exist. Push the coordinate of every single `1` into a Queue alongside a starting timestamp of `t=0`.</li>
                            <li><strong>BFS Spread:</strong> Pop a coordinate from the Queue. Scan its Up, Right, Down, and Left neighbors. If a neighbor is valid and exactly `0`, mutate it to `1`, push it into the Queue with `t+1`, and excitedly decrement our empty count!</li>
                            <li><strong>Validation:</strong> The algorithm naturally tracks the maximum `t` reached. If the empty count successfully hits 0, return `time`. If the queue exhausts but empty warehouses remain trapped behind obstacles, return `-1`!</li>
                        </ul>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Spread</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Grid:</strong><br/>1, &nbsp;0, &nbsp;0<br/>0, -1, &nbsp;0<br/>0, &nbsp;0, &nbsp;1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">There are two initial sources at the top-left and bottom-right. At t=1, they spread to adjacent 0s. By t=2, the remaining 0s are filled. The -1 in the middle acts as an obstacle.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Impossible Obstacles</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Grid:</strong><br/>&nbsp;1, &nbsp;0, -1, &nbsp;0<br/>-1, -1, -1, &nbsp;0<br/>&nbsp;0, &nbsp;0, &nbsp;0, &nbsp;0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">-1</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The single source at the top-left can only reach the 0 adjacent to it. A massive wall of -1s completely blocks access to the right side and bottom half of the grid. Unsupplied warehouses remain.</span>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                        <button onClick={loadTestCase3} className={`px-4 py-2 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 hover:bg-fuchsia-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 3</button>
                    </div>
                    <div className="grid grid-cols-1 items-end">
                        <div className="space-y-1.5 w-full">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Elements (Rows separated by |)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                            <button onClick={handleReset} title="Restart Simulation" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 h-[650px] w-full">
                    <div className="flex-1 flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative graph-canvas-area" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                        <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
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
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-orange-100 text-orange-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the power of Multi-Source Breadth-First Search.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Truck size={24} className="text-orange-500"/> Why "Multi-Source" BFS?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Standard BFS starts from a single root node and spreads outward. However, in this problem, there are multiple warehouses with trucks ready to dispatch at time <code>t=0</code> simultaneously. By iterating through the grid initially and pushing ALL of those 1s into the Queue before we even start the `while` loop, we mathematically guarantee that they will all spread outwards at the exact same uniform speed!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-emerald-500"/> Managing Visited State Elegantly</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice that we do not allocate a massive <code>boolean[][] visited</code> array! We are given a grid of 0s, 1s, and -1s. When a truck successfully reaches a 0, we simply mutate that cell in the grid to a 1 (<code>grid[nr][nc] = 1</code>). This naturally prevents future trucks from pathing backwards over newly supplied ground, saving us $O(N \times M)$ auxiliary matrix space!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N × M)</strong><br/>We iterate through the entire grid once during initialization taking $O(N \times M)$ time. During the BFS loop, every cell is pushed to the queue at most once, and its 4 neighbors are verified at most once. Thus, the entire BFS phase also strictly completes in $O(N \times M)$ time bounds.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N × M)</strong><br/>We heavily optimized the visited tracking by mutating the input grid inplace. However, the Queue itself could mathematically hold up to $O(N \times M)$ nodes simultaneously in a grid perfectly designed with a dense alternating checkerboard pattern.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-orange-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This exact grid-spread architecture is incredibly famous. It maps identically to 'Rotting Oranges', '01 Matrix', and 'As Far from Land as Possible'."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this using Depth-First Search (DFS) instead?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, DFS would produce incorrect simulation times."</p>
                            <p>DFS fundamentally plunges deep into a single path until it hits a dead end. This means one single warehouse source would recursively sprint through the entire grid instantaneously, marking everything as supplied on wildly incorrect timestamps, while entirely ignoring the fact that the other sources were supposed to be spreading simultaneously at the exact same speed. Multi-source BFS perfectly locks time execution layer by layer!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What is the purpose of the 'emptyCount' variable?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is an $O(1)$ verification shortcut."</p>
                            <p>Instead of manually re-looping through the entire $N \times M$ grid at the very end to verify if any 0s were trapped behind obstacles (which would add unnecessary computation time), we simply count them initially. Every time a truck reaches a 0, we elegantly decrement `emptyCount`. At the end, a single `emptyCount == 0` boolean check instantly validates success!"</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* FIXED LEFT SIDEBAR */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {renderTraceOperationsBox()}

                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* CENTER CANVAS AREA */}
              <div className="flex-1 relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl z-30">
                  <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between z-20 shrink-0">
                      <div className="flex items-center gap-4 w-full max-w-3xl">
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1 shrink-0`}>Grid Elements (Rows separated by |):</label>
                          <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                          <button onClick={handleReset} title="Restart Simulation" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                      </div>
                  </div>

                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px] overflow-hidden flex items-center justify-center" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
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

              {/* RIGHT SIDEBAR */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
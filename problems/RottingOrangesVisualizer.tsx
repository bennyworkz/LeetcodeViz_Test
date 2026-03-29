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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  multiSourceBfs: {
    id: 'multiSourceBfs',
    title: 'Multi-Source BFS',
    icon: <Bug size={16} />,
    complexity: 'Time: O(M×N) | Space: O(M×N)',
    theme: 'orange',
    code: `class Solution {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> q = new LinkedList<>();
        int freshCount = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == 2) {
                    q.offer(new int[]{i, j, 0});
                } else if (grid[i][j] == 1) {
                    freshCount++;
                }
            }
        }
        if (freshCount == 0) return 0;
        int minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int r = curr[0], c = curr[1];
            minutes = curr[2];
            for (int[] dir : dirs) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    freshCount--;
                    q.offer(new int[]{nr, nc, minutes + 1});
                }
            }
        }
        return freshCount == 0 ? minutes : -1;
    }
}`,
    desc: "A Multi-Source Breadth-First Search. Unlike standard BFS which starts from a single node, rotting happens simultaneously from ALL initially rotten oranges. We first scan the grid to count fresh oranges and push all rotten oranges into a Queue (starting at minute 0). Then, we process the queue layer by layer. When a rotten orange infects a neighbor, we mark it rotten (2), decrement the fresh count, and enqueue it with minute + 1. The maximum minute reached is our answer, provided the final fresh count is 0."
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
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'orange', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|orangesRotting|Queue|LinkedList|offer|poll|isEmpty|length|grid|rows|cols|q|freshCount|i|j|minutes|dirs|curr|r|c|dir|nr|nc)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={idx} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Queue', 'LinkedList', 'Solution'].includes(part);
            const isPointer = ['grid', 'rows', 'cols', 'q', 'freshCount', 'i', 'j', 'minutes', 'dirs', 'curr', 'r', 'c', 'dir', 'nr', 'nc'].includes(part);
            const isMapCall = ['orangesRotting', 'offer', 'poll', 'isEmpty', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) && part.match(/^[a-zA-Z_]\w*$/) && !part.startsWith('"') && !part.startsWith("'") ? `text-${theme}-300` : 
                  (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : 'text-emerald-400')
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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('multiSourceBfs');
  
  const [gridInput, setGridInput] = useState('[[2,1,1],[1,1,0],[0,1,1]]');
  
  const [baseGrid, setBaseGrid] = useState<number[][]>([[2,1,1],[1,1,0],[0,1,1]]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseInputs = (gridStr: string) => {
      let parsedGrid: number[][] = [[2,1,1],[1,1,0],[0,1,1]];
      
      try { 
          let temp = JSON.parse(gridStr); 
          if (Array.isArray(temp) && temp.length > 0 && Array.isArray(temp[0])) {
              parsedGrid = temp.map(row => row.map((cell: any) => {
                  let num = parseInt(cell);
                  return (isNaN(num) || num < 0 || num > 2) ? 0 : num;
              }));
          }
      } catch (e) {}

      // Sanitize Dimensions
      if (parsedGrid.length > 20) parsedGrid = parsedGrid.slice(0, 20);
      if (parsedGrid[0].length > 20) parsedGrid = parsedGrid.map(r => r.slice(0, 20));

      return { grid: parsedGrid };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { grid } = parseInputs(gridInput);
      setBaseGrid(grid);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [gridInput, selectedOpId]);

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
    if (baseGrid.length === 0 || baseGrid[0].length === 0) return [];

    let rows = baseGrid.length;
    let cols = baseGrid[0].length;
    let gridState = baseGrid.map(row => [...row]);
    
    let q: {r: number, c: number, min: number}[] = [];
    let freshCount = 0;
    let minutes = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const dirNames = ["DOWN", "UP", "RIGHT", "LEFT"];

    const cloneQ = (arr: any[]) => arr.map(e => ({...e}));
    const cloneGrid = (g: number[][]) => g.map(r => [...r]);

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            gridState: cloneGrid(gridState), qState: cloneQ(q), freshCount, minutes, ...st 
        } 
    });

    add("Function Call", `public int orangesRotting(int[][] grid)`, 2, { hlPhase: 'init' });
    
    add("Init Variables", `if (grid == null || grid.length == 0) return 0;\nint rows = grid.length, cols = grid[0].length;\nQueue<int[]> q = new LinkedList<>();\nint freshCount = 0;`, 4, { hlPhase: 'init' });
    
    // Scan Phase
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            add("Scan Grid", `for (int j = 0; j < cols; j++)\nScanning cell [${i}, ${j}]. Value: ${gridState[i][j]}`, 8, { hlPhase: 'scan', scanCell: [i, j], i, j });
            
            if (gridState[i][j] === 2) {
                q.push({r: i, c: j, min: 0});
                add("Enqueue Rotten", `if (grid[i][j] == 2) {\n    q.offer(new int[]{i, j, 0});\nFound rotten orange. Enqueuing with minute 0.`, 10, { hlPhase: 'scan', scanCell: [i, j], i, j });
            } else if (gridState[i][j] === 1) {
                freshCount++;
                add("Count Fresh", `} else if (grid[i][j] == 1) {\n    freshCount++;\nFound fresh orange. Total fresh: ${freshCount}.`, 12, { hlPhase: 'scan', scanCell: [i, j], i, j });
            }
        }
    }

    add("Check Fresh Count", `if (freshCount == 0) return 0;\nAny fresh oranges to rot? ${freshCount === 0 ? 'NO. Return 0.' : 'YES. Proceeding to BFS.'}`, 16, { hlPhase: 'init' });
    
    if (freshCount === 0) {
        add("Return Early", `return 0;\nNo fresh oranges exist. Took 0 minutes.`, 16, { hlPhase: 'success', finalAns: 0 });
        return steps;
    }

    add("Init BFS Vars", `int minutes = 0;\nint[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};`, 17, { hlPhase: 'init' });

    // BFS Phase
    while (q.length > 0) {
        if (steps.length > 2500) break; // Infinite loop guard
        
        add("While Loop", `while (!q.isEmpty())\nQueue has ${q.length} rotten oranges to process.`, 19, { hlPhase: 'loop' });
        
        let curr = q.shift()!;
        minutes = curr.min;
        add("Poll Queue", `int[] curr = q.poll();\nint r = curr[0], c = curr[1];\nminutes = curr[2];\nPopped rotten orange at [${curr.r}, ${curr.c}]. Current minute updated to ${minutes}.`, 20, { hlPhase: 'poll', currCell: [curr.r, curr.c], currMin: curr.min });

        for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];
            let nr = curr.r + dir[0];
            let nc = curr.c + dir[1];

            add("Check Direction", `for (int[] dir : dirs) {\n    int nr = r + dir[0], nc = c + dir[1];\nChecking neighbor ${dirNames[i]} at [${nr}, ${nc}].`, 23, { hlPhase: 'neighbor', currCell: [curr.r, curr.c], nextCell: [nr, nc], currMin: curr.min });

            let inBounds = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
            let isFresh = inBounds && gridState[nr][nc] === 1;

            add("Validate Neighbor", `if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1)\nIs [${nr}, ${nc}] in bounds AND a fresh orange (1)? ${inBounds && isFresh ? 'YES.' : 'NO. Ignoring.'}`, 25, { hlPhase: 'neighbor', currCell: [curr.r, curr.c], nextCell: [nr, nc], inBounds, isFresh });

            if (inBounds && isFresh) {
                gridState[nr][nc] = 2; // MUTATE
                freshCount--;
                add("Infect Orange", `grid[nr][nc] = 2;\nfreshCount--;\nFresh orange INFECTED! Turned into a 2. Fresh count drops to ${freshCount}.`, 26, { hlPhase: 'mutate', currCell: [curr.r, curr.c], nextCell: [nr, nc] });

                q.push({r: nr, c: nc, min: curr.min + 1});
                add("Enqueue Newly Rotten", `q.offer(new int[]{nr, nc, minutes + 1});\nAdded newly rotten orange at [${nr}, ${nc}] to queue for minute ${curr.min + 1}.`, 28, { hlPhase: 'enqueue', nextCell: [nr, nc] });
            }
        }
    }

    add("Queue Empty", `while (!q.isEmpty())\nQueue exhausted. The rot cannot spread any further.`, 19, { hlPhase: 'loop' });
    
    add("Final Evaluation", `return freshCount == 0 ? minutes : -1;\nAre there any fresh oranges left? freshCount = ${freshCount}.`, 32, { hlPhase: 'evaluate' });

    let finalAns = freshCount === 0 ? minutes : -1;
    if (freshCount === 0) {
        add("Return Success", `return minutes;\nAll oranges rotted. Took ${minutes} minutes.`, 32, { hlPhase: 'success', finalAns });
    } else {
        add("Return Failure", `return -1;\nSome oranges survived! Returning -1.`, 32, { hlPhase: 'failure', finalAns });
    }

    return steps;
  }, [baseGrid, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

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
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
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

  const renderActiveDashboard = () => {
      if (st.finalAns !== undefined) return null;

      if (st.hlPhase === 'scan') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-amber-400 ring-4 ring-amber-100 scale-105`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><SearchIcon size={14}/> Initialization Phase</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Scanning Cell</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110`}>
                              [{st.i}, {st.j}]
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300"/>

                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Cell Value</span>
                          <div className={`border-2 text-xl font-black px-6 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-slate-100 border-slate-300 text-slate-600`}>
                              {st.gridState ? st.gridState[st.i][st.j] : '?'}
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'neighbor' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : (st.hlPhase === 'enqueue' || st.hlPhase === 'mutate' ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Bug size={14}/> Active BFS State</span>
              
              {st.currCell !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'poll' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Spreading From</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'poll' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              [{st.currCell[0]}, {st.currCell[1]}]
                          </div>
                      </div>

                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Minute</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-100 border-slate-300 text-slate-600`}>
                              {st.currMin}
                          </div>
                      </div>

                      {st.nextCell !== undefined ? (
                          <>
                              <div className="flex flex-col items-center justify-center font-bold px-2 text-slate-400">
                                  <ArrowRight size={24} className={st.hlPhase === 'neighbor' ? "text-amber-500 animate-pulse" : "text-slate-300"}/>
                              </div>

                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'neighbor' ? `text-amber-500` : 'text-slate-400'}`}>Checking Neighbor</span>
                                  <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'neighbor' ? `bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                      [{st.nextCell[0]}, {st.nextCell[1]}]
                                  </div>
                              </div>
                              
                              {st.isFresh === false || st.inBounds === false ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Action</span>
                                          <div className={`border-2 text-sm font-black px-4 py-2.5 rounded-xl bg-slate-100 border-slate-300 text-slate-500 text-center leading-tight`}>
                                              {st.inBounds === false ? 'OUT OF BOUNDS' : 'NOT FRESH (0 or 2)'}
                                          </div>
                                      </div>
                                  </>
                              ) : st.isFresh === true ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Action</span>
                                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-${themeColor}-100 border-${themeColor}-400 text-${themeColor}-800`}>
                                              INFECT & ENQUEUE
                                          </div>
                                      </div>
                                  </>
                              ) : null}
                          </>
                      ) : (
                          <div className="flex items-center justify-center min-h-[80px] px-8 text-slate-400 italic text-sm font-mono">
                              Scanning 4 directions...
                          </div>
                      )}

                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Queue...</span>
                  </div>
              )}
          </div>
      );
  }

  const renderVisuals = () => {
      let gridToRender = st.gridState || baseGrid;
      if (!gridToRender || gridToRender.length === 0) return <span className="text-slate-400 italic mt-10">Processing Grid...</span>;

      const rows = gridToRender.length;
      const cols = gridToRender[0].length;
      
      // Dynamic Sizing
      const maxGridWidth = 600;
      const maxGridHeight = 400;
      const cellW = maxGridWidth / cols;
      const cellH = maxGridHeight / rows;
      const cellSize = Math.floor(Math.min(cellW, cellH, 60)); // max 60px per cell

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Data Trackers */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  {/* Stats Panel */}
                  <div className="flex flex-col gap-4 w-full md:w-1/3 shrink-0">
                      <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'mutate' || st.hlPhase === 'scan' ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-center items-center mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1`}>
                                  <LayersIcon size={14}/> Fresh Remaining
                              </span>
                          </div>
                          <div className="text-4xl font-black font-mono text-center text-slate-700">{st.freshCount !== undefined ? String(st.freshCount) : '0'}</div>
                      </div>
                      
                      <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'poll' ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                          <div className="flex justify-center items-center mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-1`}>
                                  <ClockIcon size={14}/> Current Minute
                              </span>
                          </div>
                          <div className="text-4xl font-black font-mono text-center text-slate-700">{st.minutes !== undefined ? String(st.minutes) : '0'}</div>
                      </div>
                  </div>

                  {/* BFS Queue */}
                  <div className={`w-full md:w-2/3 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'enqueue' || st.hlPhase === 'poll' || (st.hlPhase === 'scan' && st.gridState && st.gridState[st.i]?.[st.j] === 2) ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                              <LayersIcon size={14}/> BFS Queue (Rotten Origins)
                          </span>
                      </div>
                      <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none flex-wrap content-start">
                          <span className="text-slate-300 text-[10px] font-black uppercase shrink-0">OUT</span>
                          {st.qState && st.qState.length > 0 ? st.qState.map((obj: any, idx: number) => (
                              <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-lg px-2 py-1 font-mono text-[10px] ${idx === 0 ? `bg-${themeColor}-100 text-${themeColor}-800 border-${themeColor}-500 shadow-sm` : `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700`}`}>
                                  <span className="font-black">[{obj.r},{obj.c}]</span>
                                  <span className="opacity-70">m:{obj.min}</span>
                              </div>
                          )) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
                          <span className="text-slate-300 text-[10px] font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                      </div>
                  </div>

              </div>

              {/* Grid Rendering */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  <div className={`relative transition-all duration-700 flex flex-col items-center p-6 bg-white rounded-3xl shadow-xl border border-slate-200`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Grid size={12} className="inline mr-1"/> Orange Grid Matrix</span>
                      
                      <div 
                          className="grid gap-1 mt-2" 
                          style={{ 
                              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                              width: `${cols * (cellSize + 4)}px` // +4 for gap
                          }}
                      >
                          {gridToRender.map((rowArr: number[], rIdx: number) => {
                              return rowArr.map((cellVal: number, cIdx: number) => {
                                  // Determine State
                                  const isEmpty = cellVal === 0;
                                  const isFresh = cellVal === 1;
                                  const isRotten = cellVal === 2;
                                  
                                  const isScanning = st.hlPhase === 'scan' && st.scanCell && st.scanCell[0] === rIdx && st.scanCell[1] === cIdx;
                                  const isActiveCurr = st.currCell && st.currCell[0] === rIdx && st.currCell[1] === cIdx;
                                  const isActiveNext = st.nextCell && st.nextCell[0] === rIdx && st.nextCell[1] === cIdx;

                                  // Calculate Styles
                                  let bgClass = "bg-slate-100 border-slate-200"; // Empty 0
                                  let innerElem = null;

                                  if (isFresh) {
                                      innerElem = <div className="w-3/4 h-3/4 bg-amber-400 rounded-full shadow-inner border border-amber-500"></div>;
                                  } else if (isRotten) {
                                      innerElem = <div className="w-3/4 h-3/4 bg-lime-800 rounded-full shadow-inner border border-lime-900 flex items-center justify-center"><Bug size={12} className="text-lime-400 opacity-50"/></div>;
                                  }

                                  // Overrides for active states
                                  let zIndex = "z-0";
                                  let transform = "scale-100";
                                  let outerRing = "";

                                  if (isActiveCurr) {
                                      outerRing = `ring-4 ring-${themeColor}-400 shadow-xl`;
                                      transform = "scale-110";
                                      zIndex = "z-30";
                                  } else if (isActiveNext) {
                                      outerRing = st.isFresh ? "ring-4 ring-amber-400 shadow-lg" : "ring-4 ring-rose-400 shadow-lg opacity-60";
                                      transform = "scale-110";
                                      zIndex = "z-20";
                                  } else if (isScanning) {
                                      outerRing = "ring-4 ring-amber-300 shadow-md";
                                      transform = "scale-110";
                                      zIndex = "z-20";
                                  }

                                  return (
                                      <div 
                                          key={`${rIdx}-${cIdx}`} 
                                          className={`flex items-center justify-center border-2 rounded-md transition-all duration-300 ${bgClass} ${outerRing} ${transform} ${zIndex}`}
                                          style={{ height: `${cellSize}px`, width: `${cellSize}px` }}
                                      >
                                          {innerElem}
                                      </div>
                                  );
                              });
                          })}
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
                {selectedOp.icon && React.cloneElement(selectedOp.icon as React.ReactElement, { className: "text-white", size: 28 })}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rotting Oranges</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Multi-Source BFS
                  </span>
                  <span>•</span>
                  <span>LeetCode 994</span>
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
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Bug size={28}/> Viral Infection Simulation</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an <code>m x n</code> grid where each cell can have one of three values:</p>
                        <ul className="list-disc pl-6 space-y-1 font-mono">
                            <li><strong>0</strong> representing an empty cell,</li>
                            <li><strong>1</strong> representing a fresh orange, or</li>
                            <li><strong>2</strong> representing a rotten orange.</li>
                        </ul>
                        <p>Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.</p>
                        <p className="font-bold mt-4">Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Grid:</strong> [[2,1,1],[1,1,0],[0,1,1]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">4</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Minute 0: Only [0,0] is rotten.<br/>
                                Minute 1: [0,1] and [1,0] rot.<br/>
                                Minute 2: [0,2] and [1,1] rot.<br/>
                                Minute 3: [2,1] rots. (Note: [1,2] is empty).<br/>
                                Minute 4: [2,2] rots. All oranges are now rotten.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>m == grid.length</li>
                            <li>n == grid[i].length</li>
                            <li>1 &le; m, n &le; 10</li>
                            <li>grid[i][j] is 0, 1, or 2.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This is a simulation of an expanding wavefront. The rot spreads at a constant speed of 1 unit per minute in all directions. Because we need the <em>minimum</em> time to reach all targets, Breadth-First Search (BFS) is the perfect mathematical model for a 1-unit uniform expansion.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">Unlike a maze where you have one entrance, here we can have <strong>multiple</strong> starting rotten oranges. We must use a <strong>Multi-Source BFS</strong>.</p>
                        <p className="text-sm leading-relaxed text-slate-600">We scan the grid, count the fresh oranges, and push ALL rotten oranges into the queue at minute 0. Then we run a standard BFS. By the time the queue is empty, the maximum minute we recorded is our answer, assuming our fresh count dropped to exactly 0 (meaning no oranges were safely isolated behind empty cells).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div ref={codeContainerMainRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Input (0=Empty, 1=Fresh, 2=Rotten)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder='[[2,1,1],[1,1,0],[0,1,1]]' />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.finalAns !== undefined} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.finalAns !== undefined ? (st.finalAns !== -1 ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.finalAns !== undefined ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns !== -1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns !== -1 ? <PartyPopper size={24}/> : <ShieldAlert size={24}/>} 
                                SIMULATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.finalAns !== -1 ? `All possible fresh oranges rotted in ${st.finalAns} minutes.` : 'Some fresh oranges were isolated and survived! Return -1.'}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'mutate' || st.hlPhase === 'enqueue' || st.hlPhase === 'scan' ? `text-${themeColor}-400` : (st.hlPhase === 'neighbor' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(${pan.y}px)) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Multi-Source BFS and Matrix Mutation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><TargetIcon size={24} className="text-sky-500"/> 1. Single vs Multi-Source BFS</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In standard BFS (like finding a maze exit), you start from a single coordinate, push it to the queue, and radiate outwards. In <strong>Multi-Source BFS</strong>, you push <em>multiple</em> starting coordinates into the queue before the <code>while</code> loop even begins.</p>
                        <p className="text-slate-600 leading-relaxed">This perfectly simulates multiple infections spreading simultaneously. Because the queue is First-In-First-Out (FIFO), all the minute 0 rotten oranges process their neighbors (infecting them and setting them to minute 1) before any minute 1 orange gets to act. It perfectly simulates parallel time steps.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-emerald-500"/> 2. The Fresh Count Trap</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A common mistake is returning the final minute count assuming all oranges rotted. But what if a fresh orange is completely surrounded by empty cells (0s)? The rot can never reach it.</p>
                        <p className="text-slate-600 leading-relaxed">To solve this efficiently, we count the total number of <code>1</code>s during our initial scan. Every time we rot an orange in our BFS, we decrement this count. At the end, if <code>freshCount == 0</code>, we know it was a total success. If it's <code>&gt; 0</code>, some oranges survived, and we must return <code>-1</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Sigma size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(M &times; N).</strong> We scan the entire grid once to find the 1s and 2s. Then, in the worst case (a grid full of fresh oranges with one rotten one), the BFS visits every cell exactly once. Total time scales linearly with the size of the grid.</li>
                            <li><strong>Space Complexity: O(M &times; N).</strong> In the worst case, if the grid is entirely filled with rotten oranges to begin with, our initial scan will push $M \times N$ elements into the queue before the loop even starts. Therefore, the auxiliary space required is $O(M \times N)$.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a phenomenal problem to test BFS mastery. Interviewers love it because it forces you to adapt standard BFS into a multi-source simulation while tracking an external state variable (the fresh count)."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we just run a separate BFS for every single rotten orange instead of doing them all at once?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it would be horribly inefficient.</p>
                            <p>If you run a separate BFS for each rotten orange, you would need an auxiliary matrix to track the 'minimum time to rot' for every cell, updating it if a new BFS reaches it faster. If there are $K$ rotten oranges, the time complexity skyrockets from $O(M \times N)$ to $O(K \times M \times N)$. Multi-source BFS guarantees $O(M \times N)$ because the wavefront expands naturally in parallel."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why do we mutate the grid directly <code>grid[nr][nc] = 2;</code>? Is it safe?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's an optimal space-saving technique called 'in-place mutation'.</p>
                            <p>By mutating the grid from a 1 to a 2, we permanently mark it as 'visited'. This saves us from allocating a completely separate <code>boolean[][] visited</code> matrix, theoretically halving our memory footprint. In an interview, you should always ask: 'Are we allowed to modify the input matrix?' If yes, do it. If no, use a visited array."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if there are NO fresh oranges in the entire grid from the very beginning?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The correct answer is 0 minutes.</p>
                            <p>This is a notorious edge case! The problem asks for the minimum minutes until NO cell has a fresh orange. If there are 0 fresh oranges at minute 0, the condition is already met. This is why our code has the line <code>if (freshCount == 0) return 0;</code> right after the initial scan, preventing unnecessary queue processing or returning an incorrect -1."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[480px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Fixed Explanation Box */}
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.finalAns !== undefined ? (st.finalAns !== -1 ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'mutate' || st.hlPhase === 'enqueue' || st.hlPhase === 'scan' ? `text-${themeColor}-400` : (st.hlPhase === 'neighbor' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                      <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                  </div>

                  {/* Scrollable Code Box */}
                  <div className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-10 relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-700" ref={codeContainerFullscreenRef}>
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Context Panel for Fullscreen */}
                  {st.finalAns === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm">
                           <div className={`flex flex-col bg-white p-5 rounded-3xl border-4 shadow-2xl transition-all duration-500 border-sky-200`}>
                                <div className="flex justify-between items-center mb-3 border-b pb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                        <LayersIcon size={14}/> BFS Queue
                                    </span>
                                </div>
                                <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                                    {st.qState && st.qState.length > 0 ? st.qState.map((obj: any, idx: number) => (
                                        <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                            <span className="font-black leading-none">[{obj.r},{obj.c}]</span>
                                            <span className="text-[10px] opacity-70 leading-none">m:{obj.min}</span>
                                        </div>
                                    )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                                </div>
                            </div>
                      </div>
                  )}

                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Grid Input</label>
                              <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='[[2,1,1]...]' />
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
                  
                  {st.finalAns === undefined && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.finalAns !== undefined} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(${pan.y}px)) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.finalAns !== undefined && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns !== -1 ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns !== -1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 ${st.finalAns !== -1 ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'} rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    {st.finalAns !== -1 ? <Trophy size={48}/> : <ShieldAlert size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SIMULATION COMPLETE</h2>
                                <p className={`${st.finalAns !== -1 ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.finalAns !== -1 ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Total Minutes Elapsed</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        {st.finalAns !== -1 ? `${st.finalAns} Minutes` : 'Impossible (-1)'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns !== -1 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-slate-700 hover:bg-slate-600'}`}>
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
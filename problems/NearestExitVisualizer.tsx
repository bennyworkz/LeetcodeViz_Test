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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bfsShortestPath: {
    id: 'bfsShortestPath',
    title: 'BFS (Shortest Path)',
    icon: <TargetIcon size={16} />,
    complexity: 'Time: O(M×N) | Space: O(M×N)',
    theme: 'sky',
    code: `class Solution {
    public int nearestExit(char[][] maze, int[] entrance) {
        int rows = maze.length, cols = maze[0].length;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{entrance[0], entrance[1], 0});
        maze[entrance[0]][entrance[1]] = '+'; // mark visited
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int r = curr[0], c = curr[1], steps = curr[2];
            
            for (int[] dir : dirs) {
                int nr = r + dir[0], nc = c + dir[1];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] == '.') {
                    if (nr == 0 || nr == rows - 1 || nc == 0 || nc == cols - 1) {
                        return steps + 1;
                    }
                    maze[nr][nc] = '+'; // mark visited
                    q.offer(new int[]{nr, nc, steps + 1});
                }
            }
        }
        return -1;
    }
}`,
    desc: "Breadth-First Search (BFS) is the optimal algorithm for finding the shortest path in an unweighted grid. We start a queue at the entrance with distance 0. As we pop cells, we check all 4 adjacent directions. If a neighbor is empty ('.'), we check if it lies on the grid boundary. If it does, we've found the nearest exit and immediately return the current distance + 1! To avoid infinite loops and save memory, we mark cells as visited by turning their '.' into a '+' directly inside the maze array."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|nearestExit|Queue|LinkedList|offer|poll|isEmpty|length|maze|entrance|rows|cols|dirs|q|curr|r|c|steps|dir|nr|nc)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['Queue', 'LinkedList', 'Solution', 'String'].includes(part);
            const isPointer = ['maze', 'entrance', 'rows', 'cols', 'dirs', 'q', 'curr', 'r', 'c', 'steps', 'dir', 'nr', 'nc'].includes(part);
            const isMapCall = ['nearestExit', 'offer', 'poll', 'isEmpty', 'length'].includes(part);
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

export default function NearestExitVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bfsShortestPath');
  
  const [mazeInput, setMazeInput] = useState('[["+","+",".","+"],[".",".",".","+"],["+","+","+","."]]');
  const [entranceInput, setEntranceInput] = useState('[1, 2]');
  
  const [baseMaze, setBaseMaze] = useState<string[][]>([["+","+",".","+"],[".",".",".","+"],["+","+","+","."]]);
  const [baseEntrance, setBaseEntrance] = useState<number[]>([1, 2]);

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

  const parseInputs = (mazeStr: string, entStr: string) => {
      let parsedMaze: string[][] = [["+","+",".","+"],[".",".",".","+"],["+","+","+","."]];
      let parsedEnt: number[] = [1, 2];
      
      try { 
          let temp = JSON.parse(mazeStr); 
          if (Array.isArray(temp) && temp.length > 0 && Array.isArray(temp[0])) {
              parsedMaze = temp.map(row => row.map((cell: any) => String(cell) === '+' ? '+' : '.'));
          }
      } catch (e) {}
      
      try { 
          let temp = JSON.parse(entStr); 
          if (Array.isArray(temp) && temp.length === 2 && !isNaN(parseInt(temp[0])) && !isNaN(parseInt(temp[1]))) {
              parsedEnt = [parseInt(temp[0]), parseInt(temp[1])];
          }
      } catch (e) {}

      // Sanitize Dimensions
      const rows = parsedMaze.length;
      const cols = parsedMaze[0].length;
      if (parsedEnt[0] < 0 || parsedEnt[0] >= rows || parsedEnt[1] < 0 || parsedEnt[1] >= cols) {
          parsedEnt = [0, 0];
          parsedMaze[0][0] = '.'; // ensure valid entrance
      }

      return { maze: parsedMaze, entrance: parsedEnt };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { maze, entrance } = parseInputs(mazeInput, entranceInput);
      setBaseMaze(maze);
      setBaseEntrance(entrance);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [mazeInput, entranceInput, selectedOpId]);

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
    if (baseMaze.length === 0 || baseMaze[0].length === 0) return [];

    let rows = baseMaze.length;
    let cols = baseMaze[0].length;
    let mazeState = baseMaze.map(row => [...row]);
    
    let q: {r: number, c: number, steps: number}[] = [];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const dirNames = ["DOWN", "UP", "RIGHT", "LEFT"];

    const cloneQ = (arr: any[]) => arr.map(e => ({...e}));
    const cloneMaze = (mz: string[][]) => mz.map(r => [...r]);

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            mazeState: cloneMaze(mazeState), qState: cloneQ(q), ...st 
        } 
    });

    add("Function Call", `public int nearestExit(char[][] maze, int[] entrance)`, 2, { hlPhase: 'init' });
    
    add("Init Variables", `int rows = maze.length, cols = maze[0].length;\nint[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};`, 3, { hlPhase: 'init' });
    
    add("Init Queue", `Queue<int[]> q = new LinkedList<>();`, 6, { hlPhase: 'init' });
    
    let entR = baseEntrance[0], entC = baseEntrance[1];
    q.push({r: entR, c: entC, steps: 0});
    add("Enqueue Entrance", `q.offer(new int[]{entrance[0], entrance[1], 0});\nPushing entrance at [${entR}, ${entC}] with 0 steps.`, 7, { hlPhase: 'enqueue', hlCell: [entR, entC] });

    mazeState[entR][entC] = '+';
    add("Mark Visited", `maze[entrance[0]][entrance[1]] = '+'; // mark visited\nOverwriting the entrance cell with a '+' so we don't return to it.`, 8, { hlPhase: 'visited', hlCell: [entR, entC] });

    let exitFound = false;
    let ans = -1;

    while (q.length > 0) {
        if (steps.length > 2500) break; // Infinite loop guard
        
        add("While Loop", `while (!q.isEmpty())\nQueue is not empty. Processing next wave.`, 10, { hlPhase: 'loop' });
        
        let curr = q.shift()!;
        add("Poll Queue", `int[] curr = q.poll();\nint r = curr[0], c = curr[1], steps = curr[2];\nPopped cell [${curr.r}, ${curr.c}] at distance ${curr.steps}.`, 11, { hlPhase: 'poll', currCell: [curr.r, curr.c], currSteps: curr.steps });

        for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];
            let nr = curr.r + dir[0];
            let nc = curr.c + dir[1];

            add("Check Direction", `for (int[] dir : dirs) {\n    int nr = r + dir[0], nc = c + dir[1];\nChecking neighbor ${dirNames[i]} at [${nr}, ${nc}].`, 14, { hlPhase: 'neighbor', currCell: [curr.r, curr.c], nextCell: [nr, nc], currSteps: curr.steps });

            let inBounds = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
            let isEmpty = inBounds && mazeState[nr][nc] === '.';

            add("Validate Neighbor", `if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] == '.')\nIs [${nr}, ${nc}] within bounds AND empty ('.')? ${inBounds && isEmpty ? 'YES.' : 'NO. Ignoring.'}`, 17, { hlPhase: 'neighbor', currCell: [curr.r, curr.c], nextCell: [nr, nc], inBounds, isEmpty });

            if (inBounds && isEmpty) {
                let isBorder = nr === 0 || nr === rows - 1 || nc === 0 || nc === cols - 1;
                
                add("Check Exit Boundary", `if (nr == 0 || nr == rows - 1 || nc == 0 || nc == cols - 1)\nIs this valid empty cell on the edge of the grid? ${isBorder ? 'YES! Exit found!' : 'NO. Keep exploring.'}`, 18, { hlPhase: 'checkExit', currCell: [curr.r, curr.c], nextCell: [nr, nc], isBorder });

                if (isBorder) {
                    exitFound = true;
                    ans = curr.steps + 1;
                    add("Return Success", `return steps + 1;\nNearest exit found! Returning distance ${ans}.`, 19, { hlPhase: 'success', finalAns: ans, exitCell: [nr, nc] });
                    break;
                }

                mazeState[nr][nc] = '+';
                add("Mark Neighbor Visited", `maze[nr][nc] = '+'; // mark visited\nMutating maze to prevent re-visiting this path.`, 21, { hlPhase: 'visited', nextCell: [nr, nc] });

                q.push({r: nr, c: nc, steps: curr.steps + 1});
                add("Enqueue Neighbor", `q.offer(new int[]{nr, nc, steps + 1});\nAdded [${nr}, ${nc}] to queue with distance ${curr.steps + 1}.`, 22, { hlPhase: 'enqueue', nextCell: [nr, nc] });
            }
        }
        if (exitFound) break;
    }

    if (!exitFound) {
        add("Queue Empty", `while (!q.isEmpty())\nQueue exhausted. No exit found.`, 10, { hlPhase: 'loop' });
        add("Return Failure", `return -1;\nImpossible to reach any boundary. Returning -1.`, 26, { hlPhase: 'failure', finalAns: -1 });
    }

    return steps;
  }, [baseMaze, baseEntrance, selectedOpId]);

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

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'neighbor' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : (st.hlPhase === 'enqueue' ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><SearchIcon size={14}/> Active BFS State</span>
              
              {st.currCell !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'poll' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Curr Cell</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'poll' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              [{st.currCell[0]}, {st.currCell[1]}]
                          </div>
                      </div>

                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Steps</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-100 border-slate-300 text-slate-600`}>
                              {st.currSteps}
                          </div>
                      </div>

                      {st.nextCell !== undefined ? (
                          <>
                              <div className="flex flex-col items-center justify-center font-bold px-2 text-slate-400">
                                  <ArrowRight size={24} className={st.hlPhase === 'neighbor' ? "text-amber-500 animate-pulse" : "text-slate-300"}/>
                              </div>

                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'neighbor' ? `text-amber-500` : 'text-slate-400'}`}>Neighbor</span>
                                  <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'neighbor' ? `bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                      [{st.nextCell[0]}, {st.nextCell[1]}]
                                  </div>
                              </div>
                              
                              {st.isEmpty === false || st.inBounds === false ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-500`}>Action</span>
                                          <div className={`border-2 text-sm font-black px-4 py-2.5 rounded-xl bg-rose-100 border-rose-400 text-rose-800 text-center leading-tight`}>
                                              {st.inBounds === false ? 'OUT OF BOUNDS' : 'WALL / VISITED'}
                                          </div>
                                      </div>
                                  </>
                              ) : st.isEmpty === true ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Action</span>
                                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-${themeColor}-100 border-${themeColor}-400 text-${themeColor}-800`}>
                                              ENQUEUE
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
      let gridToRender = st.mazeState || baseMaze;
      if (!gridToRender || gridToRender.length === 0) return <span className="text-slate-400 italic mt-10">Processing Maze...</span>;

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
                  
                  {/* BFS Queue */}
                  <div className={`w-full md:w-2/3 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'enqueue' || st.hlPhase === 'poll' ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                              <LayersIcon size={14}/> BFS Queue
                          </span>
                      </div>
                      <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none">
                          <span className="text-slate-300 text-[10px] font-black uppercase shrink-0">OUT</span>
                          {st.qState && st.qState.length > 0 ? st.qState.map((obj: any, idx: number) => (
                              <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-lg px-2 py-1 font-mono text-[10px] ${idx === 0 ? `bg-${themeColor}-100 text-${themeColor}-800 border-${themeColor}-500 shadow-sm` : `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700`}`}>
                                  <span className="font-black">[{obj.r},{obj.c}]</span>
                                  <span className="opacity-70">d:{obj.steps}</span>
                              </div>
                          )) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
                          <span className="text-slate-300 text-[10px] font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                      </div>
                  </div>

              </div>

              {/* Grid Rendering */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  <div className={`relative transition-all duration-700 flex flex-col items-center p-6 bg-white rounded-3xl shadow-xl border border-slate-200`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Grid size={12} className="inline mr-1"/> Maze Matrix</span>
                      
                      <div 
                          className="grid gap-1 mt-2" 
                          style={{ 
                              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                              width: `${cols * (cellSize + 4)}px` // +4 for gap
                          }}
                      >
                          {gridToRender.map((rowArr: string[], rIdx: number) => {
                              return rowArr.map((cellChar: string, cIdx: number) => {
                                  // Determine State
                                  const isWall = cellChar === '+' && (baseMaze[rIdx][cIdx] === '+'); // Original wall
                                  const isVisited = cellChar === '+' && (baseMaze[rIdx][cIdx] === '.'); // Mutated visited
                                  const isEntrance = rIdx === baseEntrance[0] && cIdx === baseEntrance[1];
                                  
                                  const isActiveCurr = st.currCell && st.currCell[0] === rIdx && st.currCell[1] === cIdx;
                                  const isActiveNext = st.nextCell && st.nextCell[0] === rIdx && st.nextCell[1] === cIdx;
                                  const isExitFound = st.exitCell && st.exitCell[0] === rIdx && st.exitCell[1] === cIdx;

                                  // Calculate Styles
                                  let bgClass = "bg-slate-50 border-slate-200"; // Empty '.'
                                  if (isWall && !isEntrance) bgClass = "bg-slate-800 border-slate-900 shadow-inner";
                                  if (isVisited && !isEntrance) bgClass = "bg-sky-100 border-sky-300";
                                  
                                  if (isEntrance) {
                                      bgClass = "bg-blue-500 border-blue-600 text-white font-bold shadow-md";
                                  }

                                  // Overrides for active states
                                  let zIndex = "z-0";
                                  let transform = "scale-100";

                                  if (isExitFound) {
                                      bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl ring-4 ring-emerald-200";
                                      transform = "scale-125";
                                      zIndex = "z-40";
                                  } else if (isActiveCurr) {
                                      bgClass = "bg-amber-400 border-amber-500 text-amber-950 shadow-xl ring-4 ring-amber-200";
                                      transform = "scale-110";
                                      zIndex = "z-30";
                                  } else if (isActiveNext) {
                                      bgClass = st.isEmpty ? "bg-violet-400 border-violet-500 text-white shadow-lg ring-4 ring-violet-200" : "bg-rose-400 border-rose-500 text-white shadow-lg ring-4 ring-rose-200";
                                      transform = "scale-110";
                                      zIndex = "z-20";
                                  }

                                  return (
                                      <div 
                                          key={`${rIdx}-${cIdx}`} 
                                          className={`flex items-center justify-center border-2 rounded-md transition-all duration-300 font-mono text-xs ${bgClass} ${transform} ${zIndex}`}
                                          style={{ height: `${cellSize}px`, width: `${cellSize}px` }}
                                      >
                                          {isEntrance ? 'E' : (isExitFound ? 'EXIT' : '')}
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Nearest Exit from Entrance</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      2D Grid BFS
                  </span>
                  <span>•</span>
                  <span>LeetCode 1926</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><TargetIcon size={28}/> Escape the Maze</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an <code>m x n</code> matrix <code>maze</code> (0-indexed) with empty cells (represented as <code>'.'</code>) and walls (represented as <code>'+'</code>). You are also given the <code>entrance</code> of the maze, where <code>entrance = [entrance_row, entrance_col]</code> denotes the row and column of the cell you are initially standing at.</p>
                        <p>In one step, you can move one cell up, down, left, or right. You cannot step into a cell with a wall, and you cannot step outside the maze. Your goal is to find the <strong>nearest exit</strong> from the entrance. An exit is defined as an empty cell that is at the border of the maze. The entrance does not count as an exit.</p>
                        <p className="font-bold mt-4">Return the number of steps in the shortest path from the entrance to the nearest exit, or -1 if no such path exists.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Maze:</strong> [["+","+",".","+"],[".",".",".","+"],["+","+","+","."]]<br/><strong>Entrance:</strong> [1,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">1</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                There are 3 exits in this maze at [1,0], [0,2], and [2,3].<br/>
                                Initially, you are at the entrance cell [1,2].<br/>
                                - You can reach [1,0] by moving 2 steps left.<br/>
                                - You can reach [0,2] by moving 1 step up.<br/>
                                It is impossible to reach [2,3] from the entrance.<br/>
                                Thus, the nearest exit is [0,2], which is 1 step away.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>maze.length == m</li>
                            <li>maze[i].length == n</li>
                            <li>1 &le; m, n &le; 100</li>
                            <li>maze[i][j] is either '.' or '+'.</li>
                            <li>entrance.length == 2</li>
                            <li>0 &le; entrance_row &lt; m</li>
                            <li>0 &le; entrance_col &lt; n</li>
                            <li>entrance will always be an empty cell.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This is a classic "Shortest Path in an Unweighted Grid" problem. Because all steps have equal cost (1 move), Breadth-First Search (BFS) is mathematically guaranteed to find the absolute shortest path to an exit before it finds any longer paths to that same exit (or other exits).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">We initialize a Queue with the entrance coordinates and 0 steps. We then iterate through the queue, checking all 4 adjacent directions.</p>
                        <p className="text-sm leading-relaxed text-slate-600">If a neighboring cell is empty (<code>'.'</code>), we check if it's on the border. If it is, we instantly return <code>steps + 1</code>. To prevent moving backwards or into infinite loops, we must mark cells as visited. A brilliant space-saving trick is to overwrite the <code>'.'</code> with a <code>'+'</code> directly in the <code>maze</code> matrix, eliminating the need for a separate <code>visited</code> boolean array!</p>
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
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Maze Matrix (Use '+' and '.')</label>
                            <input type="text" value={mazeInput} onChange={(e) => setMazeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder='[["+","+",".","+"],[".",".",".","+"]]' />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Entrance [r, c]</label>
                            <input type="text" value={entranceInput} onChange={(e) => setEntranceInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="[1, 2]" />
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
                                SEARCH COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.finalAns !== -1 ? `Exit found in ${st.finalAns} steps.` : 'No exit could be reached.'}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'visited' || st.hlPhase === 'enqueue' ? `text-${themeColor}-400` : (st.hlPhase === 'neighbor' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding shortest path searches in unweighted grids.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><TargetIcon size={24} className="text-sky-500"/> 1. Why BFS over DFS?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Depth-First Search (DFS) explores a single path as deeply as possible before backtracking. If you use DFS here, it might find an exit, but there is <strong>zero guarantee</strong> that it is the nearest exit. It might snake around the entire grid before finding an exit right next to the entrance.</p>
                        <p className="text-slate-600 leading-relaxed">Breadth-First Search (BFS) expands evenly in all directions, like a ripple in a pond. Because all steps have a uniform cost of 1, the first time BFS touches an exit cell, it is mathematically proven to be the shortest path.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-emerald-500"/> 2. In-Place Visited State</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In standard graph BFS, we maintain a <code>visited</code> boolean matrix to prevent visiting the same cell twice (which would cause an infinite loop). However, this requires $O(M \times N)$ extra memory.</p>
                        <p className="text-slate-600 leading-relaxed">Since the problem guarantees that we can only walk on <code>'.'</code> cells, and walls are <code>'+'</code>, we can simply overwrite a <code>'.'</code> with a <code>'+'</code> the moment we enqueue it! This turns the path into a "wall" behind us, perfectly preventing revisits without any extra memory allocation.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Sigma size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(M &times; N).</strong> In the absolute worst case scenario (a completely empty grid with no exits), our BFS will enqueue and process every single cell in the maze exactly once. Therefore, the time scales linearly with the area of the grid.</li>
                            <li><strong>Space Complexity: O(M &times; N).</strong> Even though we saved space by mutating the maze array for our visited state, the Queue itself can grow large. In a completely open grid, the maximum size of the BFS queue (the perimeter of the largest diamond shape it forms) can theoretically scale up to $O(\max(M, N))$, which is bounded by $O(M \times N)$ in the worst case.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential Grid BFS problem. Interviewers use it to see if you can correctly set up a queue, manage a 4-directional array offset, and correctly handle boundary conditions."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we mark cells as visited right before pushing to the queue, rather than after popping them out?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent massive duplicate queue insertions.</p>
                            <p>If we wait to mark a cell visited until we POP it, multiple adjacent cells currently in the queue might all 'see' the same empty target cell and push duplicates of it into the queue. This causes the queue size to explode exponentially, turning an $O(M \times N)$ algorithm into a Time Limit Exceeded error. Marking upon push guarantees a cell enters the queue exactly once."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if modifying the input <code>maze</code> array isn't allowed by the interviewer?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would instantiate a separate visited structure.</p>
                            <p>We could allocate a <code>boolean[][] visited = new boolean[m][n]</code> array, which guarantees fast $O(1)$ lookups but costs $O(M \times N)$ space. Alternatively, we could use a <code>HashSet&lt;String&gt;</code> and store coordinate strings like <code>'r,c'</code>, though this introduces heavier string allocation overhead."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If the grid size was 100,000 x 100,000, would BFS still be the best approach?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Standard BFS might run out of memory.</p>
                            <p>With a grid that massive, the queue and visited array would easily exceed RAM limits. In such cases, if we knew the exact coordinates of the exits, algorithms like A* (A-Star) search with a heuristic function (like Manhattan distance) would be much better, as they aggressively prioritize exploring paths that lead closer to the goal rather than expanding equally in all directions."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'visited' || st.hlPhase === 'enqueue' ? `text-${themeColor}-400` : (st.hlPhase === 'neighbor' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                                            <span className="text-[10px] opacity-70 leading-none">d:{obj.steps}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Maze Input</label>
                              <input type="text" value={mazeInput} onChange={(e) => setMazeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='[["+","+",".","+"]...]' />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SEARCH COMPLETE</h2>
                                <p className={`${st.finalAns !== -1 ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.finalAns !== -1 ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Shortest Path Distance</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        {st.finalAns !== -1 ? `${st.finalAns} Steps` : 'Not Found (-1)'}
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
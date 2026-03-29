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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  dfsRecursive: {
    id: 'dfsRecursive',
    title: '1. DFS (Recursive)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        boolean[] visited = new boolean[n];
        int provinces = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                provinces++;
                dfs(isConnected, visited, i);
            }
        }
        return provinces;
    }
    
    private void dfs(int[][] isConnected, boolean[] visited, int curr) {
        visited[curr] = true;
        for (int j = 0; j < isConnected.length; j++) {
            if (isConnected[curr][j] == 1 && !visited[j]) {
                dfs(isConnected, visited, j);
            }
        }
    }
}`,
    desc: "A Depth-First Search approach to find connected components. We iterate through every city from 0 to n-1. If we find a city that hasn't been visited yet, we know we've stumbled upon a brand new province! We increment our province counter, and then launch a DFS to recursively mark all directly and indirectly connected cities as 'visited'. We check connections by looking at the adjacency matrix `isConnected[curr][j] == 1`."
  },
  bfsIterative: {
    id: 'bfsIterative',
    title: '2. BFS (Iterative Queue)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        boolean[] visited = new boolean[n];
        int provinces = 0;
        Queue<Integer> queue = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                provinces++;
                queue.offer(i);
                visited[i] = true;
                
                while (!queue.isEmpty()) {
                    int curr = queue.poll();
                    for (int j = 0; j < n; j++) {
                        if (isConnected[curr][j] == 1 && !visited[j]) {
                            visited[j] = true;
                            queue.offer(j);
                        }
                    }
                }
            }
        }
        return provinces;
    }
}`,
    desc: "A Breadth-First Search approach. Like DFS, we iterate through all cities. When we find an unvisited city, we've found a new province. Instead of diving deep via recursion, we push the city to a Queue and systematically explore outward in waves. We pop a city, check its row in the matrix to find unvisited neighbors, mark them visited, and enqueue them. This maps out the entire connected component iteratively."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|findCircleNum|dfs|Queue|LinkedList|offer|poll|isEmpty|length|visited|isConnected|provinces|curr|queue|n|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'this'].includes(part);
            const isObject = ['Queue', 'LinkedList', 'Solution'].includes(part);
            const isPointer = ['visited', 'isConnected', 'provinces', 'curr', 'n', 'i', 'j', 'queue'].includes(part);
            const isMapCall = ['findCircleNum', 'dfs', 'offer', 'poll', 'isEmpty', 'length'].includes(part);
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
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
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

export default function NumberOfProvincesVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dfsRecursive');
  
  const [matrixInput, setMatrixInput] = useState('[[1,1,0],[1,1,0],[0,0,1]]');
  const [baseMatrixArr, setBaseMatrixArr] = useState<number[][]>([[1,1,0],[1,1,0],[0,0,1]]);

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

  const parseMatrixString = (inputStr: string, fallback: number[][]) => {
      try {
          let clean = inputStr.trim();
          if (!clean.startsWith('[')) clean = `[${clean}]`;
          
          let inner = clean.substring(1, clean.length - 1).trim();
          if (inner.length === 0) return [];
          
          let rawRows = inner.split(/\]\s*,\s*\[/);
          
          let parsed = rawRows.map(r => {
              let cleanedR = r.replace(/\[|\]/g, '').trim();
              if (cleanedR === '') return [];
              return cleanedR.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
          });
          
          // Ensure it's square for visualization sanity
          let maxLen = Math.max(...parsed.map(r => r.length), parsed.length);
          for (let i = 0; i < maxLen; i++) {
              if (!parsed[i]) parsed[i] = [];
              for (let j = 0; j < maxLen; j++) {
                  if (parsed[i][j] === undefined) parsed[i][j] = 0; // default disconnect
                  if (i === j) parsed[i][j] = 1; // cities connected to themselves
              }
          }
          return parsed.slice(0, 10).map(r => r.slice(0, 10)); // Limit to 10x10 for UI bounds
      } catch (e) {
          return fallback;
      }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseMatrixArr(parseMatrixString(matrixInput, [[1,1,0],[1,1,0],[0,0,1]]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [matrixInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Geometry Generation for Circular Layout
  const buildGraphGeometry = (matrix: number[][]) => {
      const n = matrix.length;
      let renderNodes: any[] = [];
      let renderEdges: any[] = [];
      
      if (n === 0) return { nodes: [], edges: [], radius: 0 };

      // Base radius calculation
      const radius = Math.max(100, Math.min(220, n * 30)); 
      
      for (let i = 0; i < n; i++) {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          renderNodes.push({
              id: i,
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle)
          });
      }

      // Undirected edges, so only look at upper triangle i < j to avoid drawing twice
      for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
              if (matrix[i][j] === 1) {
                  renderEdges.push({
                      source: i,
                      target: j,
                      sx: renderNodes[i].x,
                      sy: renderNodes[i].y,
                      tx: renderNodes[j].x,
                      ty: renderNodes[j].y
                  });
              }
          }
      }

      return { nodes: renderNodes, edges: renderEdges, radius };
  };

  const graphData = useMemo(() => buildGraphGeometry(baseMatrixArr), [baseMatrixArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseMatrixArr.length;
    if (n === 0) return [];

    let callStack: string[] = [];
    let visited = new Set<number>();
    let provinces = 0;
    
    if (selectedOpId === 'dfsRecursive') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visited: new Set(visited), callStack: [...callStack], provinces, ...st 
            } 
        });

        add("Function Call", `public int findCircleNum(int[][] isConnected)`, 2, {});
        
        add("Init Vars", `int n = isConnected.length;\nboolean[] visited = new boolean[n];\nint provinces = 0;`, 3, { hlInitVars: true, n });
        
        const dfs = (curr: number) => {
            if (steps.length > 2500) return; // guard

            let callStr = `dfs(${curr})`;
            callStack.push(callStr);
            
            add("DFS Entry", `private void dfs(int[][] isConnected, boolean[] visited, int curr)\nEntering DFS for city ${curr}.`, 16, { currNodeId: curr });

            visited.add(curr);
            add("Mark Visited", `visited[curr] = true;\nMarking city ${curr} as visited.`, 17, { currNodeId: curr, hlMarkVisited: true });

            for (let j = 0; j < n; j++) {
                add("Check Matrix", `for (int j = 0; j < isConnected.length; j++)\nLooking for neighbors of city ${curr}. Checking column ${j}.`, 18, { currNodeId: curr, hlForJ: true, j, matrixHl: [curr, j] });

                let isConn = baseMatrixArr[curr][j] === 1;
                let isUnvisited = !visited.has(j);
                
                add("Evaluate Connection", `if (isConnected[curr][j] == 1 && !visited[j])\nConnected? ${isConn}. Unvisited? ${isUnvisited}.`, 19, { currNodeId: curr, hlIfConn: true, j, isConn, isUnvisited, matrixHl: [curr, j] });

                if (isConn && isUnvisited) {
                    add("Recurse Deeper", `dfs(isConnected, visited, j);\nUnvisited connection found! Diving into city ${j}.`, 20, { currNodeId: curr, hlRecurseDfs: true, j });
                    dfs(j);
                    add("Backtrack", `Finished exploring city ${j}. Backtracking to city ${curr}.`, 18, { currNodeId: curr, hlForJ: true, j });
                }
            }
            callStack.pop();
        };

        for (let i = 0; i < n; i++) {
            add("Outer Loop", `for (int i = 0; i < n; i++)\nChecking if city ${i} has been evaluated.`, 7, { hlOuterLoop: true, i });
            
            let isUnvisited = !visited.has(i);
            add("Evaluate City", `if (!visited[i])\nIs city ${i} unvisited? ${isUnvisited ? 'YES. We found a new province!' : 'NO. Already evaluated.'}`, 8, { hlCheckVisited: true, i, isUnvisited });

            if (isUnvisited) {
                provinces++;
                add("Increment Province", `provinces++;\nDiscovered province #${provinces}.`, 9, { hlIncProv: true, i, isUnvisited });
                
                add("Launch DFS", `dfs(isConnected, visited, i);\nLaunching DFS to map out all cities in this new province.`, 10, { hlLaunchDfs: true, i, isUnvisited });
                dfs(i);
            }
        }

        add("Return Result", `return provinces;\nAll cities evaluated. Total provinces found: ${provinces}.`, 13, { isSuccess: true, finalAns: provinces });

    } 
    else if (selectedOpId === 'bfsIterative') {
        let q: number[] = [];
        const cloneQ = (arr: number[]) => [...arr];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visited: new Set(visited), qState: cloneQ(q), provinces, ...st 
            } 
        });

        add("Function Call", `public int findCircleNum(int[][] isConnected)`, 2, {});
        
        add("Init Vars", `int n = isConnected.length;\nboolean[] visited = new boolean[n];\nint provinces = 0;\nQueue<Integer> queue = new LinkedList<>();`, 3, { hlInitVars: true, n });

        for (let i = 0; i < n; i++) {
            add("Outer Loop", `for (int i = 0; i < n; i++)\nChecking if city ${i} has been evaluated.`, 8, { hlOuterLoop: true, i });
            
            let isUnvisited = !visited.has(i);
            add("Evaluate City", `if (!visited[i])\nIs city ${i} unvisited? ${isUnvisited ? 'YES. We found a new province!' : 'NO. Already evaluated.'}`, 9, { hlCheckVisited: true, i, isUnvisited });

            if (isUnvisited) {
                provinces++;
                add("Increment Province", `provinces++;\nDiscovered province #${provinces}.`, 10, { hlIncProv: true, i });
                
                q.push(i);
                add("Enqueue Start", `queue.offer(i);\nEnqueue city ${i} to start mapping the province.`, 11, { hlOfferI: true, i, currNodeId: i });
                
                visited.add(i);
                add("Mark Visited", `visited[i] = true;\nMarking city ${i} as visited.`, 12, { hlMarkStartVisited: true, i, currNodeId: i });

                while (q.length > 0) {
                    if (steps.length > 2500) break;

                    add("While Loop", `while (!queue.isEmpty())\nQueue has nodes. Processing component.`, 14, { hlWhile: true, i });
                    
                    let curr = q.shift()!;
                    add("Poll Queue", `int curr = queue.poll();\nDequeued city ${curr} to check its connections.`, 15, { currNodeId: curr, hlPoll: true, i });

                    for (let j = 0; j < n; j++) {
                        add("Check Matrix", `for (int j = 0; j < n; j++)\nChecking matrix row ${curr}, column ${j}.`, 16, { currNodeId: curr, hlForJ: true, i, j, matrixHl: [curr, j] });

                        let isConn = baseMatrixArr[curr][j] === 1;
                        let isJUnvisited = !visited.has(j);

                        add("Evaluate Connection", `if (isConnected[curr][j] == 1 && !visited[j])\nConnected? ${isConn}. Unvisited? ${isJUnvisited}.`, 17, { currNodeId: curr, hlIfConn: true, i, j, isConn, isUnvisited: isJUnvisited, matrixHl: [curr, j] });

                        if (isConn && isJUnvisited) {
                            visited.add(j);
                            add("Mark Next Visited", `visited[j] = true;\nMarking city ${j} as visited.`, 18, { currNodeId: curr, hlMarkNextVisited: true, i, j });
                            
                            q.push(j);
                            add("Enqueue Next", `queue.offer(j);\nEnqueuing city ${j} for later exploration.`, 19, { currNodeId: curr, hlEnqueueNext: true, i, j });
                        }
                    }
                }
                add("Queue Empty", `while (!queue.isEmpty())\nQueue empty. Mapped out entire province #${provinces}.`, 14, { hlWhile: true, i });
            }
        }

        add("Return Result", `return provinces;\nAll cities evaluated. Total provinces found: ${provinces}.`, 26, { isSuccess: true, finalAns: provinces });
    }

    return steps;
  }, [baseMatrixArr, graphData, selectedOpId]);

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
      if (st.isSuccess) return null;

      let isOuterLoopPhase = st.hlOuterLoop || st.hlCheckVisited || st.hlIncProv || st.hlLaunchDfs || st.hlOfferI || st.hlMarkStartVisited;
      let isMatrixEvalPhase = st.hlForJ || st.hlIfConn || st.hlMarkNextVisited || st.hlEnqueueNext || st.hlRecurseDfs;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isOuterLoopPhase ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : (isMatrixEvalPhase ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active Trace State</span>
              
              {isOuterLoopPhase ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in zoom-in duration-300">
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Outer Loop (i)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl bg-slate-50 border-slate-300 text-slate-700 shadow-inner`}>
                              {st.i !== undefined ? String(st.i) : '?'}
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300"/>

                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlCheckVisited ? 'text-amber-500' : 'text-slate-400'}`}>!visited[i]</span>
                          <div className={`border-2 text-xl font-black px-6 py-2.5 rounded-xl transition-all duration-300 ${st.hlCheckVisited ? (st.isUnvisited ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg scale-110' : 'bg-slate-100 border-slate-300 text-slate-500 shadow-sm scale-110') : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.isUnvisited !== undefined ? (st.isUnvisited ? 'TRUE (New Prov)' : 'FALSE (Skip)') : '?'}
                          </div>
                      </div>
                  </div>
              ) : st.currNodeId !== undefined && st.currNodeId !== null ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlMarkVisited || st.hlPoll ? `text-${themeColor}-500` : 'text-slate-400'}`}>Curr City (curr)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlMarkVisited || st.hlPoll ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {String(st.currNodeId)}
                          </div>
                      </div>

                      {st.j !== undefined ? (
                          <>
                              <div className="flex flex-col items-center justify-center font-bold px-2 text-slate-400 animate-pulse">
                                  <Grid size={24} />
                              </div>

                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlForJ || st.hlIfConn ? `text-${themeColor}-500` : 'text-slate-400'}`}>Checking (j)</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlForJ || st.hlIfConn ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                      {String(st.j)}
                                  </div>
                              </div>
                              
                              {st.hlRecurseDfs || st.hlEnqueueNext ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Action</span>
                                          <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 shadow-md bg-${themeColor}-100 border-${themeColor}-400 text-${themeColor}-800`}>
                                              {st.hlRecurseDfs ? 'DFS DIVE' : 'ENQUEUE CITY'}
                                          </div>
                                      </div>
                                  </>
                              ) : st.isConn !== undefined ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Result</span>
                                          <div className={`border-2 text-sm font-black px-4 py-2.5 rounded-xl text-center leading-tight ${st.isConn && st.isUnvisited ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
                                              {st.isConn ? (st.isUnvisited ? 'CONNECTED & UNVISITED' : 'ALREADY VISITED') : 'NO CONNECTION'}
                                          </div>
                                      </div>
                                  </>
                              ) : null}
                          </>
                      ) : (
                          <div className="flex items-center justify-center min-h-[80px] px-8 text-slate-400 italic text-sm font-mono">
                              Initializing neighbor scan...
                          </div>
                      )}

                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Traversal Sequence...</span>
                  </div>
              )}
          </div>
      );
  }

  const renderVisuals = () => {
      if (graphData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Graph...</span>;

      // Container needs enough height to fit the whole circular layout
      const containerSize = Math.max(450, graphData.radius * 2 + 150);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Map State Container & Counters */}
              <div className="flex w-full max-w-6xl gap-6 px-4 pointer-events-auto items-start justify-center">
                  
                  <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlIncProv || st.isSuccess ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                      <div className="flex justify-center items-center mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1`}>
                              <MapPinIcon size={14}/> Provinces
                          </span>
                      </div>
                      <div className="text-4xl font-black font-mono text-center text-slate-700">{st.provinces !== undefined ? String(st.provinces) : '0'}</div>
                  </div>

                  {/* Adjacency Matrix Status */}
                  <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-slate-200`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                              <Grid size={14}/> isConnected (Matrix)
                          </span>
                      </div>
                      <div className="flex flex-col gap-1 items-center font-mono">
                          {baseMatrixArr.map((row, rIdx) => (
                              <div key={`row-${rIdx}`} className="flex gap-1">
                                  {row.map((val, cIdx) => {
                                      let isHl = st.matrixHl && st.matrixHl[0] === rIdx && st.matrixHl[1] === cIdx;
                                      let cellClass = "bg-slate-50 border-slate-200 text-slate-400";
                                      if (isHl) {
                                          cellClass = val === 1 ? `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-md scale-110 z-10 font-black` : "bg-rose-500 border-rose-600 text-white shadow-md scale-110 z-10 font-black";
                                      } else if (val === 1) {
                                          cellClass = "bg-slate-200 border-slate-300 text-slate-700 font-bold";
                                      }

                                      return (
                                          <div key={`cell-${rIdx}-${cIdx}`} className={`flex items-center justify-center w-6 h-6 border rounded transition-all duration-200 text-[10px] ${cellClass}`}>
                                              {val}
                                          </div>
                                      )
                                  })}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Queue / Stack Status */}
                  {selectedOpId === 'bfsIterative' ? (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlEnqueueNext || st.hlEnqueueStart || st.hlPoll || st.hlOfferI ? 'border-sky-300 ring-4 ring-sky-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> BFS Queue
                              </span>
                          </div>
                          <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none">
                              <span className="text-slate-300 text-[10px] font-black uppercase shrink-0">OUT</span>
                              {st.qState && st.qState.length > 0 ? st.qState.map((val: number, idx: number) => (
                                  <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-lg px-3 py-1 font-mono text-sm ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                      <span className="font-black leading-none">{String(val)}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
                              <span className="text-slate-300 text-[10px] font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                          </div>
                      </div>
                  ) : (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.callStack && st.callStack.length > 0 && !st.isSuccess ? 'border-emerald-300 ring-4 ring-emerald-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> DFS Call Stack
                              </span>
                          </div>
                          <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto scrollbar-none flex-1 pb-1">
                               {st.callStack && st.callStack.length > 0 ? st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`cs-${idx}`} className={`w-full py-1 px-3 rounded-md border font-mono text-[9px] font-black transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200 opacity-80'}`}>
                                           {String(frameStr)}
                                       </div>
                                   )
                               }) : <span className="text-slate-400 italic text-xs font-mono">Empty</span>}
                          </div>
                      </div>
                  )}

              </div>

              {/* Free-floating Interactive State Space Graph */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex items-center justify-center`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Undirected Graph (Cities)</span>
                      
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              <g style={{ transform: 'translate(50%, 50%)' }}>
                                  
                                  {/* Render Edges */}
                                  {graphData.edges.map((edge: any, idx: number) => {
                                      let isActiveEdge = false;
                                      
                                      // Highlight edge if it's currently being checked and IS connected
                                      if (st.currNodeId !== undefined && st.j !== undefined && st.isConn) {
                                          if ((st.currNodeId === edge.source && st.j === edge.target) || 
                                              (st.currNodeId === edge.target && st.j === edge.source)) {
                                              isActiveEdge = true;
                                          }
                                      }

                                      let strokeColor = '#cbd5e1'; // slate-300
                                      let strokeWidth = 3;
                                      let opacity = 0.6;

                                      if (isActiveEdge) {
                                          strokeColor = themeColor === 'sky' ? '#0ea5e9' : '#10b981'; 
                                          strokeWidth = 6;
                                          opacity = 1;
                                      }

                                      return <line key={`edge-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                  })}
                              </g>
                          </svg>

                          {/* Render Nodes (Cities) */}
                          {graphData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isVisited = st.visited && st.visited.has(node.id);
                              let isTargetJ = st.j === node.id;
                              let isOuterI = st.i === node.id && (st.hlOuterLoop || st.hlCheckVisited || st.hlIncProv || st.hlLaunchDfs || st.hlOfferI);
                              
                              let bgClass = "bg-slate-50 border-slate-300 text-slate-500 opacity-60"; // Unvisited
                              
                              if (isVisited) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-100 shadow-sm";
                              }
                              
                              if (isActive) {
                                  bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30" : "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                              } else if (isTargetJ) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-100 shadow-lg text-amber-900 scale-110 z-20";
                              } else if (isOuterI) {
                                  bgClass = "bg-violet-100 border-violet-400 ring-4 ring-violet-100 shadow-lg text-violet-900 scale-110 z-20";
                              }
                              
                              if (st.isSuccess) {
                                  bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg opacity-100 z-20 scale-110";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'dfsRecursive' ? 'text-emerald-600 border border-emerald-200' : 'text-sky-600 border border-sky-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {isTargetJ && !isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                              checking (j)
                                          </span>
                                      )}
                                      {isOuterI && !isActive && !isTargetJ && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-violet-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                              evaluating (i)
                                          </span>
                                      )}
                                      {isVisited && !isActive && !isTargetJ && !isOuterI && !st.isSuccess && (
                                          <span className={`absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm`}><Check size={10}/></span>
                                      )}

                                      <div className={`w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-sm md:text-xl leading-none`}>{String(node.id)}</span>
                                      </div>
                                  </div>
                              )
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Number of Provinces</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Undirected Graph Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 547</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> Connected Components</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There are <code>n</code> cities. Some of them are connected, while some are not. If city <code>a</code> is connected directly with city <code>b</code>, and city <code>b</code> is connected directly with city <code>c</code>, then city <code>a</code> is connected indirectly with city <code>c</code>.</p>
                        <p>A <strong>province</strong> is a group of directly or indirectly connected cities and no other cities outside of the group.</p>
                        <p className="font-bold mt-4">You are given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if the <code>ith</code> city and the <code>jth</code> city are directly connected, and <code>0</code> otherwise. Return the total number of provinces.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> isConnected = [[1,1,0],[1,1,0],[0,0,1]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                City 0 and city 1 are connected, forming Province #1.<br/>
                                City 2 is completely isolated, forming Province #2.<br/>
                                Total provinces = 2.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="180" height="150" viewBox="0 0 180 150">
                                <line x1="60" y1="40" x2="120" y2="100" stroke="#10b981" strokeWidth="4"/>
                                
                                <circle cx="60" cy="40" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="60" y="45" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="120" cy="100" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="120" y="105" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="120" cy="40" r="16" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                                <text x="120" y="45" fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">2</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> isConnected = [[1,0,0],[0,1,0],[0,0,1]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                City 0 is isolated (Province 1).<br/>
                                City 1 is isolated (Province 2).<br/>
                                City 2 is isolated (Province 3).<br/>
                                The matrix only has 1s on the diagonal (cities connecting to themselves).
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="180" height="150" viewBox="0 0 180 150">
                                <circle cx="60" cy="40" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="60" y="45" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="120" cy="100" r="16" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                                <text x="120" y="105" fill="#a855f7" fontSize="14" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="120" cy="40" r="16" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                                <text x="120" y="45" fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">2</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; n &le; 200</li>
                            <li>n == isConnected.length</li>
                            <li>n == isConnected[i].length</li>
                            <li>isConnected[i][j] is 1 or 0.</li>
                            <li>isConnected[i][i] == 1</li>
                            <li>isConnected[i][j] == isConnected[j][i] (Symmetric / Undirected)</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This problem asks us to count the number of <strong>Connected Components</strong> in an undirected graph. The graph is provided as an Adjacency Matrix. If we iterate through every node, and launch a DFS/BFS every time we find an unvisited node, the number of times we launch the traversal perfectly equals the number of completely isolated subgraphs (provinces).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">We maintain a <code>visited</code> array. An outer loop iterates from <code>0</code> to <code>n-1</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600">If <code>visited[i]</code> is false, we increment our province counter and trigger a <strong>DFS</strong> or <strong>BFS</strong>. Inside the traversal, to find a node's neighbors, we must loop across the entire row <code>j</code> in the <code>isConnected</code> matrix and check if <code>isConnected[curr][j] == 1</code>. If it is 1 and unvisited, we continue the traversal into <code>j</code>, marking everything we touch as visited so the outer loop skips it later.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
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

            <div className="lg:col-span-8 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>isConnected Array Input (Adjacency Matrix)</label>
                            <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="[[1,1,0],[1,1,0],[0,0,1]]" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={24}/> TRAVERSAL COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully mapped all provinces. Returning {String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlOuterLoop || st.hlCheckVisited || st.hlIncProv ? 'text-amber-400' : (st.hlRecurseDfs || st.hlEnqueueNext ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(50% + ${pan.y}px)) scale(${zoom})`, transformOrigin: 'center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Undirected Graphs and Adjacency Matrices.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-sky-500"/> 1. The Adjacency Matrix</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike an Adjacency List where you immediately know exactly which nodes are connected, an Adjacency Matrix <code>isConnected[i][j]</code> requires you to check every possible connection. To find the neighbors of city <code>i</code>, we must iterate through the entire row: <code>for (j = 0 to n-1)</code> and verify if <code>isConnected[i][j] == 1</code>.</p>
                        <p className="text-slate-600 leading-relaxed">The matrix is symmetrically identical across its diagonal because the graph is undirected (if A connects to B, B connects to A). The diagonal itself is always 1 (a city is always connected to itself).</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Repeat size={24} className="text-emerald-500"/> 2. The Outer Loop</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">How do we know we've found a separate province? We iterate through all cities <code>for (i = 0 to n-1)</code>. If we hit a city where <code>visited[i] == false</code>, we have discovered a disconnected component! We increment the province counter, and then use DFS/BFS to immediately paint that entire component as visited, ensuring the outer loop ignores all those connected cities as it continues forward.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N²).</strong> $N$ is the number of cities. We have an outer loop running $N$ times. In the worst-case scenario (or any scenario, due to the matrix), the DFS/BFS must check the entire row of length $N$ to find neighbors for every node it visits. Therefore, the total matrix operations across the entire execution will always be $N \times N = O(N^2)$.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate a <code>visited</code> array of size $N$. The DFS recursion stack can go up to $O(N)$ deep, and the BFS queue can hold up to $O(N)$ nodes at once. Note that the matrix itself takes $O(N^2)$ space, but that is considered input space, not auxiliary space.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential matrix traversal problem. Interviewers use it to ensure you know how to map graph concepts (components, edges) onto a 2D array representation efficiently."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we use Union-Find (Disjoint Set) to solve this?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, Union-Find is an extremely common alternative for this exact problem.</p>
                            <p>You initialize $N$ disjoint sets. You iterate through the upper triangle of the matrix (where $i &lt; j$), and if <code>isConnected[i][j] == 1</code>, you union the sets for city $i$ and city $j$. Every successful union reduces the total component count by 1. The final count is your answer. While DFS/BFS is more straightforward to write, Union-Find is a powerful tool to demonstrate in an interview context."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why do we skip checking <code>visited[i]</code> in the outer loop if we are just going to check it inside the DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The outer loop check is fundamentally different from the inner traversal check.</p>
                            <p>The inner DFS check (<code>!visited[j]</code>) is used to prevent infinite recursion between connected nodes. The outer loop check (<code>!visited[i]</code>) is our <strong>trigger condition</strong> for finding a completely new province. If we didn't check it in the outer loop, we would erroneously increment the <code>provinces</code> counter $N$ times regardless of the connections."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If the input matrix was mostly 0s (a sparse graph), is this O(N²) approach still optimal?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, but we are bound by the input format.</p>
                            <p>Because the input is an Adjacency Matrix, we are forced to spend $O(N)$ time checking every element in a row to find the few edges that might exist, resulting in $O(N^2)$ minimum time. If the graph was provided as an Adjacency List instead, the time complexity would drop to $O(N + E)$, where $E$ is the number of edges, which is vastly faster for sparse graphs."</p>
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
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlOuterLoop || st.hlCheckVisited || st.hlIncProv ? 'text-amber-400' : (st.hlRecurseDfs || st.hlEnqueueNext ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                  {selectedOpId === 'dfsRecursive' && !st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-2xl p-5 flex flex-col transition-all duration-300 w-64 max-h-[350px] overflow-hidden`}>
                              <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 shrink-0">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={14}/> Call Stack</span>
                              </div>
                              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                  {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                      let isTop = idx === 0;
                                      return (
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? `bg-${themeColor}-500 text-white border-${themeColor}-400 scale-100` : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
                                              {String(frameStr)}
                                          </div>
                                      )
                                  })}
                                  {st.callStack.length === 0 && (
                                      <span className="text-slate-500 font-mono italic text-xs text-center py-2">Empty</span>
                                  )}
                              </div>
                          </div>
                      </div>
                  )}

                  {selectedOpId === 'bfsIterative' && !st.isSuccess && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm">
                           <div className={`flex flex-col bg-white p-5 rounded-3xl border-4 shadow-2xl transition-all duration-500 border-sky-200`}>
                                <div className="flex justify-between items-center mb-3 border-b pb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                        <LayersIcon size={14}/> BFS Queue
                                    </span>
                                </div>
                                <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                                    {st.qState && st.qState.length > 0 ? st.qState.map((val: number, idx: number) => (
                                        <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                            <span className="font-black leading-none">{String(val)}</span>
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
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>isConnected Input (Matrix)</label>
                              <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="[[1,1,0],[1,1,0]..." />
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
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(50% + ${pan.y}px)) scale(${zoom})`, transformOrigin: 'center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Provinces Found</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4">
                                        {String(st.finalAns)}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
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
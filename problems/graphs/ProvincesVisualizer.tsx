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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale, LineChart, Snowflake, Network, RadioReceiver, Route, Navigation, Wifi, Map as MapIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  provincesDFS: {
    id: 'provincesDFS',
    title: 'Number of Provinces (DFS)',
    icon: <MapIcon size={16} />,
    complexity: 'Time: O(V^2) | Space: O(V)',
    theme: 'emerald',
    code: `import java.util.ArrayList;

class Solution {
    private static void dfs(int node, ArrayList<ArrayList<Integer>> adjLs, int vis[]) {
        vis[node] = 1;
        for (Integer it : adjLs.get(node)) {
            if (vis[it] == 0) {
                dfs(it, adjLs, vis);
            }
        }
    }
    
    static int numProvinces(ArrayList<ArrayList<Integer>> adj, int V) {
        // 1. Convert adjacency matrix to adjacency list
        ArrayList<ArrayList<Integer>> adjLs = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adjLs.add(new ArrayList<Integer>());
        }
        
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (adj.get(i).get(j) == 1 && i != j) {
                    adjLs.get(i).add(j);
                    adjLs.get(j).add(i); // Undirected graph
                }
            }
        }
        
        // 2. Count connected components
        int vis[] = new int[V];
        int cnt = 0;
        
        for (int i = 0; i < V; i++) {
            if (vis[i] == 0) {
                cnt++;             // Found a new province
                dfs(i, adjLs, vis); // Mark all cities in this province
            }
        }
        return cnt;
    }
}`,
    desc: "Number of Provinces: This algorithm counts the number of disconnected subgraphs (components). It first traverses the 2D Adjacency Matrix to build a streamlined Adjacency List. Then, it iterates through all cities. Every time it hits an unvisited city, it increments the Province Counter and triggers a DFS. The DFS acts like a paint bucket, recursively bleeding outwards and marking every connected city as visited so they aren't counted again!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:import|public|private|static|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|ArrayList|Integer|numProvinces|dfs|adj|adjLs|vis|node|it|add|get|V|cnt)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? `${activeStyles.bg} active-code-line` : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['import', 'public', 'private', 'static', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'ArrayList'].includes(part);
            const isPointer = ['adj', 'adjLs', 'vis', 'node', 'it', 'V', 'cnt'].includes(part);
            const isMapCall = ['numProvinces', 'dfs', 'add', 'get'].includes(part);
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

export default function ProvincesVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('provincesDFS');
  
  const [matrixInput, setMatrixInput] = useState('[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]');
  const [baseMatrix, setBaseMatrix] = useState<number[][]>([
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let cleanInput = matrixInput.trim();
        if (cleanInput.startsWith('[')) {
            let parsed = JSON.parse(cleanInput);
            if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
                let valid = true;
                let v = parsed.length;
                for (let i = 0; i < v; i++) {
                    if (parsed[i].length !== v) valid = false;
                }
                if (valid) {
                    if (v > 8) parsed = parsed.slice(0, 8).map((r: number[]) => r.slice(0, 8)); // UI limit cap
                    setBaseMatrix(parsed);
                    setCurrentStep(0);
                    setPan({ x: 0, y: 0 });
                    setZoom(1);
                    return;
                }
            }
        }
        // Fallback if parsing fails
        setBaseMatrix([[1,1,0],[1,1,0],[0,0,1]]);
      } catch (e) {
        setBaseMatrix([[1,1,0],[1,1,0],[0,0,1]]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [matrixInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 2.5));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone1D = (arr: any[]) => [...arr];
  const clone2D = (arr: any[][]) => arr.map(r => [...r]);

  // Unified Coordinate Layout Algorithm for Graph nodes
  const nodePositions = useMemo(() => {
    const V = baseMatrix.length;
    const pos: {x: number, y: number}[] = new Array(V).fill({x: 0, y: 0});
    if (V === 0) return pos;

    const radius = 100; 
    const centerX = 160; // Center of the 320px wide graph container
    const centerY = 130; // Center of the 260px high graph container

    for (let i = 0; i < V; i++) {
        const angle = (2 * Math.PI * i) / V - Math.PI / 2;
        pos[i] = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        };
    }

    return pos;
  }, [baseMatrix]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseMatrix;
    const V = adj.length;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, ...st } 
    });

    add("Function Call", `public static int numProvinces(ArrayList... adj, int V)\nWe begin by receiving the adjacency matrix representing the map of cities. There are V = ${V} cities.`, 13, { phase: 'init' });

    let adjLs: number[][] = Array.from({length: V}, () => []);

    add("Initialize Adjacency List", `ArrayList<ArrayList<Integer>> adjLs = new ArrayList<>();\nfor (int i = 0; i < V; i++) adjLs.add(new ArrayList<Integer>());\nWe initialize an empty list for each city to store its connections.`, 16, { phase: 'init_adjls', adjLs: clone2D(adjLs) });

    // Simulate Matrix to List conversion (optimized to only show successful edge additions)
    for (let i = 0; i < V; i++) {
        for (let j = i + 1; j < V; j++) { // Standard optimization for undirected trace
            if (adj[i][j] === 1) {
                add("Matrix Evaluation", `if (adj.get(${i}).get(${j}) == 1 && ${i} != ${j})\nScanning the matrix. We found a '1' at row ${i}, col ${j}! This means City ${i} and City ${j} are connected.`, 22, { phase: 'mat_eval', matI: i, matJ: j, adjLs: clone2D(adjLs) });
                adjLs[i].push(j);
                adjLs[j].push(i);
                add("List Conversion", `adjLs.get(${i}).add(${j});\nadjLs.get(${j}).add(${i});\nAdding the connection to our Adjacency List.`, 24, { phase: 'mat_add', matI: i, matJ: j, addedI: i, addedJ: j, adjLs: clone2D(adjLs) });
            }
        }
    }

    add("Initialization", `int vis[] = new int[V];\nint cnt = 0;\nList built! Now we initialize our Visited array with zeros and our Province counter 'cnt' to 0.`, 31, { phase: 'init_cnt', adjLs: clone2D(adjLs), vis: new Array(V).fill(0), cnt: 0 });

    let vis: number[] = new Array(V).fill(0);
    let cnt = 0;
    let callStack: number[] = [];

    for (let i = 0; i < V; i++) {
        add("Outer Component Loop", `for (int i = 0; i < V; i++)\nIterating sequentially through every city. Currently evaluating City ${i}.`, 33, { phase: 'main_loop', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i });

        if (vis[i] === 0) {
            cnt++;
            add("New Province Found", `if (vis[${i}] == 0) { cnt++; }\nCity ${i} is completely unvisited! This implies we have discovered a brand new disconnected Province. We increment 'cnt' to ${cnt}.`, 35, { phase: 'found_province', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i });
            
            add("Trigger DFS", `dfs(${i}, adjLs, vis);\nWe trigger the DFS paint-bucket. It will branch out and mark every single city connected to City ${i} as visited, so we don't count them as separate provinces later!`, 36, { phase: 'call_dfs', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, hlNode: i });

            const dfs = (node: number, parent?: number) => {
                if (steps.length > 1000) return;
                
                callStack.push(node);
                add("Enter DFS Frame", `private static void dfs(int node=${node}, ...)\nPlunged into City ${node}'s recursive frame!`, 4, { phase: 'enter_dfs', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node });

                vis[node] = 1;
                add("Mark Visited", `vis[node] = 1;\nSecured City ${node} by marking it '1' (visited).`, 5, { phase: 'mark_vis', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node, hlNode: node });

                let neighbors = adjLs[node] || [];
                for (let k = 0; k < neighbors.length; k++) {
                    let it = neighbors[k];
                    add("Check Neighbor", `for (Integer it : adjLs.get(node))\nLooking at adjacent neighbor City ${it} of City ${node}.`, 6, { phase: 'check_adj', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node, checkNode: it });

                    if (vis[it] === 0) {
                        add("Neighbor Unvisited", `if (vis[it] == 0)\nCity ${it} is unvisited! It belongs to the same province. We must plunge into it to map its connections too.`, 7, { phase: 'adj_unvisited', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node, checkNode: it });
                        
                        add("Plunge (Recursive Call)", `dfs(it, adjLs, vis);\nSuspending current frame to recursively explore City ${it}.`, 8, { phase: 'call_dfs_inner', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node, checkNode: it });
                        
                        dfs(it, node);
                        
                        add("Backtrack Complete", `}\nFinished mapping City ${it}'s branch. Backtracking to City ${node}'s frame to check remaining neighbors.`, 9, { phase: 'backtrack', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node, checkNode: it });
                    } else {
                        add("Neighbor Visited (Skip)", `if (vis[it] == 0) is FALSE.\nCity ${it} is already marked visited. We skip to avoid cycling back.`, 7, { phase: 'adj_visited', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: node, checkNode: it, skipNode: it });
                    }
                }

                callStack.pop();
                add("Exit DFS Frame", `} // End of dfs\nAll neighbors for City ${node} have been evaluated. Popping frame off Call Stack.`, 11, { phase: 'exit_dfs', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i, callStack: clone1D(callStack), activeNode: parent !== undefined ? parent : null });
            };

            dfs(i);

        } else {
            add("City Already Mapped", `if (vis[i] == 0) is FALSE.\nCity ${i} was already visited (meaning it is part of a previously counted province). We skip it and move to the next city!`, 34, { phase: 'main_loop_skip', adjLs: clone2D(adjLs), vis: clone1D(vis), cnt, mainI: i });
        }
    }

    add("Return Result", `return cnt;\nAll cities evaluated! Total disconnected Provinces mathematically equals ${cnt}.`, 39, { phase: 'done', isSuccess: true, finalAns: cnt, vis: clone1D(vis), adjLs: clone2D(adjLs), cnt });

    return steps;
  }, [baseMatrix, selectedOpId]);

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
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2.5));
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
    selectedOp && navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Robust Auto-scroll to active code line
  useEffect(() => {
    const timer = setTimeout(() => {
        const containers = document.querySelectorAll('.code-scroll-container');
        containers.forEach(container => {
            const activeLine = container.querySelector('.active-code-line');
            if (activeLine) {
                activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }, 50); // slight delay to allow layout to settle
    return () => clearTimeout(timer);
  }, [curStepData.line, isFullscreen, currentStep]);

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
      if (st.adj === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100` : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-${themeColor}-600`}>
                          <Trophy size={16}/> 
                          Total Disconnected Provinces
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-${themeColor}-700 bg-${themeColor}-100 border-${themeColor}-400 break-all`}>
                          {st.finalAns}
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Outer Loop (City i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('main_loop') ? `bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg` : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.mainI !== undefined && st.mainI !== null ? st.mainI : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">DFS Active Frame</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'enter_dfs' || st.phase === 'exit_dfs' || st.phase === 'backtrack' || st.phase.startsWith('check_') || st.phase.startsWith('adj_') || st.phase === 'call_dfs_inner' ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeNode !== undefined && st.activeNode !== null ? st.activeNode : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Layers size={12}/> Stack Depth</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'enter_dfs' || st.phase === 'exit_dfs' ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-sm animate-in zoom-in scale-110' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.callStack !== undefined ? st.callStack.length : '0'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1"><MapIcon size={12}/> Provinces (cnt)</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'found_province' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-xl scale-125 animate-bounce' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                              {st.cnt !== undefined ? st.cnt : '0'}
                          </div>
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.adj === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeRadius = 20;

      const GraphComponent = () => (
          <div className="flex flex-col items-center w-full">
              <span className="bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full shadow-sm z-30 mb-6">Conceptual Map (Graph)</span>
              
              {/* Fixed Coordinate System Container */}
              <div className="relative w-[320px] h-[260px] bg-white border border-slate-200 rounded-[2rem] shadow-sm z-10 flex items-center justify-center overflow-visible">
                  
                  {/* SVG Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                      {(st.adjLs || []).map((neighbors: number[], fromNode: number) => {
                          return neighbors.map((toNode: number) => {
                              if (fromNode >= toNode) return null; // Undirected, draw once
                              
                              let isChecking = (st.activeNode === fromNode && st.checkNode === toNode) || (st.activeNode === toNode && st.checkNode === fromNode);
                              let isSkipping = isChecking && (st.skipNode === toNode || st.skipNode === fromNode);
                              let isPlunging = isChecking && (st.phase === 'adj_unvisited' || st.phase === 'call_dfs_inner');
                              
                              let strokeCol = "#cbd5e1"; // default slate-300
                              let strokeW = "2";
                              let dash = "none";

                              if (isChecking && !isSkipping) {
                                  strokeCol = "#10b981"; // emerald-500
                                  strokeW = "4";
                              } else if (isSkipping) {
                                  strokeCol = "#f43f5e"; // rose-500
                                  strokeW = "4";
                                  dash = "4 4";
                              }

                              return (
                                  <line 
                                      key={`ge-${fromNode}-${toNode}`}
                                      x1={nodePositions[fromNode].x} 
                                      y1={nodePositions[fromNode].y} 
                                      x2={nodePositions[toNode].x} 
                                      y2={nodePositions[toNode].y} 
                                      stroke={strokeCol} 
                                      strokeWidth={strokeW} 
                                      strokeDasharray={dash}
                                      className={`transition-all duration-300 ${isPlunging ? 'animate-pulse' : ''}`}
                                  />
                              )
                          });
                      })}
                      
                      {/* Animated plunging dot along active edge */}
                      {(st.phase === 'adj_unvisited' || st.phase === 'call_dfs_inner') && st.activeNode !== undefined && st.checkNode !== undefined && (
                          <circle r="6" fill="#10b981" className="animate-[moveDot_0.6s_ease-in-out_forwards]">
                              <animateMotion 
                                  path={`M ${nodePositions[st.activeNode].x} ${nodePositions[st.activeNode].y} L ${nodePositions[st.checkNode].x} ${nodePositions[st.checkNode].y}`} 
                                  dur="0.6s" fill="freeze" 
                              />
                          </circle>
                      )}
                      {/* Animated backtracking dot */}
                      {st.phase === 'backtrack' && st.activeNode !== undefined && st.checkNode !== undefined && (
                          <circle r="6" fill="#f59e0b" className="animate-[moveDot_0.6s_ease-in-out_forwards]">
                              <animateMotion 
                                  path={`M ${nodePositions[st.checkNode].x} ${nodePositions[st.checkNode].y} L ${nodePositions[st.activeNode].x} ${nodePositions[st.activeNode].y}`} 
                                  dur="0.6s" fill="freeze" 
                              />
                          </circle>
                      )}
                  </svg>

                  {/* CSS Positioned Nodes */}
                  {nodePositions.map((pos, idx) => {
                      let isActive = st.activeNode === idx;
                      let isMainI = st.mainI === idx && !st.activeNode; // Active in outer loop
                      let isChecking = st.checkNode === idx;
                      let isVisited = st.vis && st.vis[idx] === 1;
                      let isNewlyVisited = st.hlNode === idx;
                      
                      let bgClass = "bg-white border-slate-300 text-slate-500";
                      let scaleClass = "scale-100";

                      if (isNewlyVisited) {
                          bgClass = "bg-emerald-400 border-emerald-600 text-white shadow-xl ring-4 ring-emerald-200 z-40 animate-in zoom-in";
                          scaleClass = "scale-125";
                      } else if (isActive) {
                          bgClass = `bg-amber-400 border-amber-600 text-white shadow-xl ring-4 ring-amber-200 z-40`;
                          scaleClass = "scale-125";
                      } else if (isChecking) {
                          bgClass = "bg-sky-400 border-sky-600 text-white shadow-xl ring-4 ring-sky-200 z-30";
                          scaleClass = "scale-125";
                      } else if (isMainI) {
                          bgClass = "bg-fuchsia-400 border-fuchsia-600 text-white shadow-xl ring-4 ring-fuchsia-200 z-30";
                          scaleClass = "scale-125";
                      } else if (isVisited) {
                          bgClass = "bg-slate-700 border-slate-800 text-white shadow-md z-20";
                      }

                      return (
                          <div 
                              key={`gn-${idx}`} 
                              className={`absolute flex items-center justify-center font-mono font-black text-lg rounded-full border-[3px] transition-all duration-500 ${scaleClass} ${bgClass}`}
                              style={{ 
                                  left: `${pos.x}px`, 
                                  top: `${pos.y}px`, 
                                  width: `${nodeRadius*2}px`, 
                                  height: `${nodeRadius*2}px`,
                                  transform: 'translate(-50%, -50%)'
                              }}
                          >
                              {/* Ripple Animation for Active Node */}
                              {isActive && !st.isSuccess && (
                                  <>
                                      <div className={`absolute w-[60px] h-[60px] bg-amber-400 rounded-full animate-ping opacity-20 pointer-events-none`}></div>
                                      <div className={`absolute w-[100px] h-[100px] border-4 border-amber-300 rounded-full animate-ping opacity-20 pointer-events-none`} style={{ animationDelay: '200ms'}}></div>
                                  </>
                              )}
                              {isMainI && !st.isSuccess && (
                                  <div className={`absolute w-[80px] h-[80px] bg-fuchsia-400 rounded-full animate-ping opacity-20 pointer-events-none`}></div>
                              )}

                              {idx}
                              {isChecking && st.skipNode === idx && (
                                  <XCircle size={24} className="absolute text-rose-500 -right-4 -top-4 bg-white rounded-full animate-in zoom-in"/>
                              )}
                          </div>
                      )
                  })}
              </div>
          </div>
      );

      const DataStructuresComponent = () => (
          <div className="w-full flex flex-row flex-wrap justify-center gap-6 z-20 border-t border-slate-200/50 pt-8 mt-4">
              {/* Visited Array */}
              <div className="flex flex-col items-center max-w-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><CheckCircle2 size={12}/> vis[]</span>
                  <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                      {(st.vis || []).map((val: number, idx: number) => {
                          let isNewlyMarked = st.phase === 'mark_vis' && st.hlNode === idx;
                          let isChecking = st.checkNode === idx || st.mainI === idx;

                          let boxBg = val === 1 ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-300 border-slate-200";
                          if (isNewlyMarked) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-200 animate-in zoom-in";
                          else if (isChecking) boxBg = "bg-sky-100 text-sky-800 border-sky-400 scale-110 ring-2 ring-sky-200 shadow-md";

                          return (
                              <div key={`vis-${idx}`} className="flex flex-col items-center">
                                  <span className={`text-[8px] font-mono font-bold mb-0.5 ${isChecking ? 'text-sky-500' : 'text-slate-400'}`}>{idx}</span>
                                  <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                      {val === 1 ? '1' : '0'}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>

              {/* Call Stack */}
              <div className="flex flex-col items-center max-w-full">
                  <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 bg-${themeColor}-50 px-3 py-1 rounded-lg border border-${themeColor}-200 mb-2 shadow-sm flex items-center gap-2`}><ArrowUp size={12}/> DFS Stack</span>
                  <div className="flex w-48 h-16 bg-white rounded-2xl border-2 border-slate-200 shadow-md items-center px-4 gap-2 overflow-x-hidden relative flex-row-reverse">
                      <div className="absolute right-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">TOP</div>
                      <div className="flex flex-row-reverse gap-2 mx-auto transition-all duration-500">
                          {(st.callStack || []).map((val: number, i: number) => {
                              let isTop = i === st.callStack.length - 1;
                              let isEntering = st.phase === 'enter_dfs' && isTop;
                              
                              return (
                                  <div key={`stack-${i}-${val}`} className={`w-8 h-8 flex items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-md transition-all duration-500 ${isEntering ? `bg-${themeColor}-400 border-${themeColor}-500 animate-in slide-in-from-top-8 scale-110` : isTop ? `bg-${themeColor}-500 border-${themeColor}-600` : 'bg-slate-500 border-slate-600'}`}>
                                      {val}
                                  </div>
                              )
                          })}
                          {st.callStack && st.callStack.length === 0 ? <span className="text-slate-300 font-mono italic text-sm my-auto text-center w-full">Empty</span> : null}
                      </div>
                  </div>
              </div>
          </div>
      );

      const MatrixComponent = () => (
          <div className="flex flex-col items-center w-full max-w-[500px] shrink-0">
              <div className="flex flex-col items-center mb-4">
                  <span className="bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full shadow-sm z-30 mb-2">adj[][] (Input Adjacency Matrix)</span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest break-all text-center px-4">{matrixInput}</span>
              </div>
              
              <div className="flex flex-col gap-1 p-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-300">
                  {/* Header Row */}
                  <div className="flex gap-1 mb-2 items-center border-b border-slate-100 pb-2 min-w-max">
                      <div className="w-8 text-right pr-2 text-[8px] font-bold text-slate-400 uppercase">City</div>
                      {[...Array(st.V).keys()].map((c) => (
                          <div key={`mhc-${c}`} className={`w-8 flex justify-center text-[10px] font-mono font-bold transition-all ${st.checkNode === c || st.matJ === c ? 'text-sky-500 scale-125' : 'text-slate-400'}`}>{c}</div>
                      ))}
                  </div>
                  {st.adj && st.adj.map((rowArr: number[], r: number) => {
                      let isRowActive = st.activeNode === r || st.mainI === r || st.matI === r;
                      
                      return (
                          <div key={`mat-r-${r}`} className="flex gap-1 items-center mb-1 min-w-max">
                              <span className={`w-8 text-right text-[10px] font-mono font-bold pr-2 transition-all ${isRowActive ? 'text-amber-600 scale-125' : 'text-slate-500'}`}>
                                  {r}
                              </span>
                              {rowArr.map((val: number, c: number) => {
                                  let isCellChecking = (st.activeNode === r && st.checkNode === c) || (st.matI === r && st.matJ === c);
                                  let isAdded = st.addedI === r && st.addedJ === c;
                                  
                                  let boxBg = val === 1 ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-300 border-slate-200";
                                  let zIndex = "z-0";
                                  
                                  if (isCellChecking && st.phase === 'mat_eval') {
                                      boxBg = "bg-fuchsia-400 text-white border-fuchsia-600 scale-125 shadow-xl animate-pulse ring-4 ring-fuchsia-200";
                                      zIndex = "z-20";
                                  } else if (isCellChecking) {
                                      boxBg = "bg-sky-400 text-white border-sky-600 scale-110 shadow-lg ring-4 ring-sky-200";
                                      zIndex = "z-10";
                                  } else if (isAdded) {
                                      boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg z-10";
                                  } else if (isRowActive && val === 1) {
                                      boxBg = "bg-amber-400 text-amber-900 border-amber-500 scale-105 shadow-md z-10";
                                  }

                                  return (
                                      <div key={`mat-${r}-${c}`} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-[10px] border-[2px] rounded-lg transition-all duration-300 ${boxBg} ${zIndex}`}>
                                          {val}
                                      </div>
                                  )
                              })}
                          </div>
                      )
                  })}
              </div>
          </div>
      );

      return (
          <div className="relative w-full h-full flex flex-col items-center justify-start p-4 md:p-8 z-10 overflow-y-auto">
              {!isFullscreen && (
                  <div className="w-full max-w-4xl z-50 mb-8 pointer-events-auto">
                      {renderActiveDashboard()}
                  </div>
              )}
              
              <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center xl:justify-evenly w-full max-w-6xl gap-10 xl:gap-6 pointer-events-auto">
                  
                  {/* --- LEFT SIDE: GRAPH & DATA STRUCTURES --- */}
                  <div className="flex flex-col items-center w-full xl:w-1/2 max-w-[500px] shrink-0">
                      <GraphComponent />
                      <DataStructuresComponent />
                  </div>

                  {/* Vertical Divider for Large Screens */}
                  <div className="hidden xl:block w-px bg-slate-300 self-stretch my-8 opacity-50 z-0"></div>

                  {/* --- RIGHT SIDE: MATRIX RENDERER --- */}
                  <div className="flex flex-col items-center w-full xl:w-1/2 max-w-[500px] shrink-0 mt-4 xl:mt-0">
                      <MatrixComponent />
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
                <MapIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Component Count
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
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><MapIcon size={28}/> Finding Isolated Clusters</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There are <code>n</code> cities. Some of them are connected, while some are not. If city <code>a</code> is connected directly with city <code>b</code>, and city <code>b</code> is connected directly with city <code>c</code>, then city <code>a</code> is connected indirectly with city <code>c</code>.</p>
                        <p>A <strong>province</strong> is a group of directly or indirectly connected cities and no other cities outside of the group.</p>
                        <p>You are given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if the <code>i</code>th city and the <code>j</code>th city are directly connected, and <code>isConnected[i][j] = 0</code> otherwise. Return the total number of provinces.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> isConnected = [[1,1,0],[1,1,0],[0,0,1]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">2</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Cities 0 and 1 are connected, they form one province.<br/>City 2 is isolated, it forms the second province.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= n &lt;= 200</li>
                            <li>isConnected is an n x n binary matrix.</li>
                            <li>isConnected[i][i] == 1 (Every city is connected to itself)</li>
                            <li>isConnected[i][j] == isConnected[j][i] (Symmetric undirected graph)</li>
                        </ul>
                    </div>
                </section>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Network size={16} className="text-sky-500"/> Why Adjacency Lists?</h4>
                        <p className="text-sm leading-relaxed">While you <em>can</em> run DFS directly on the 2D Adjacency Matrix, it forces us to loop over all <code>V</code> columns for every node to find neighbors. By converting the matrix into an Adjacency List first, we streamline the DFS to only iterate over actual, existing connections, improving practical speed for sparse graphs.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><CheckCircle2 size={16} className={`text-${themeColor}-500`}/> The Paint Bucket Method</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Think of the <code>vis[]</code> array as a canvas. The outer loop scans for uncolored nodes. When it finds one, it increments the Province counter (clicks the paint bucket), and triggers DFS. DFS recursively bleeds out, coloring every reachable node so the outer loop will safely skip them. The number of DFS triggers exactly equals the number of disconnected subgraphs!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="code-scroll-container p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency Matrix (e.g. [[1,1,0],[1,1,0],[0,0,1]])</label>
                            <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="[[1,1,0],[1,1,0],[0,0,1]]" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? `bg-${themeColor}-900 border-${themeColor}-800` : 'bg-slate-900 border-slate-800'}`}>
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
                                <PartyPopper size={24}/> EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully counted all connected provinces.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase === 'found_province' ? 'text-emerald-400' : (st.phase === 'backtrack' || st.phase === 'exit_dfs' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> Dynamic Evaluation Visualizer</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">A deep dive into why DFS uses a Stack to plunge deep into graphs, and a strict line-by-line code explanation for finding Provinces.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Element 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className={`text-${themeColor}-500`}/> The Paint Bucket Analogy</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Imagine the cities as an uncolored map. We iterate through every city. If a city is uncolored (unvisited), we grab a new color (increment our Province count) and pour it onto that city using DFS. DFS then automatically spreads through all roads, coloring every connected city with that exact same color. When we return to the main loop, we only trigger a new color/count if we find a city that the previous DFS floods missed.</p>
                    </div>

                    {/* Element 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-sky-500"/> Matrix vs. Adjacency List</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The input is an Adjacency Matrix (<code>V x V</code>). To find neighbors for a city in a matrix, you MUST scan the entire row (all $V$ elements), taking $O(V)$ time. By pre-processing the matrix into an Adjacency List <code>ArrayList&lt;ArrayList&lt;Integer&gt;&gt;</code>, we group only the direct connections. DFS over a list only takes time proportional to the actual number of edges $E$, which is vastly faster for sparse maps where $E \ll V^2$.</p>
                    </div>

                    {/* Element 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V^2) + O(V + E) = O(V^2)</strong><br/>Step 1 (Matrix Conversion) requires checking every cell in the $V \times V$ matrix, taking strictly $O(V^2)$ time. Step 2 (DFS Traversal) takes $O(V + E)$ time because each city and road is evaluated exactly once by the recursive function. Since $E \le V^2$, the total time is dominated by the matrix conversion $O(V^2)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>The Adjacency List stores $2E$ total elements (undirected edges). The Visited array requires $O(V)$ space. The Call Stack for DFS requires $O(V)$ space in the worst case (a single massive province connected in a straight line). Overall space is bounded by the graph structure storage $O(V + E)$.</p>
                    </div>

                    {/* Code Explanation */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl transition-shadow text-slate-300">
                        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FileText size={24} className={`text-${themeColor}-400`}/> Line-by-Line Code Explanation</h4>
                        <div className="space-y-5 text-sm font-mono leading-relaxed">
                            
                            <p><strong className="text-sky-400">Line 15-27:</strong> <code>Matrix to List Conversion</code><br/>We loop over the <code>V x V</code> matrix. If <code>adj.get(i).get(j) == 1 && i != j</code>, we record that City <code>i</code> connects to City <code>j</code>. This optimization prevents DFS from constantly checking zeros.</p>
                            
                            <p><strong className="text-sky-400">Line 33:</strong> <code>for (int i = 0; i &lt; V; i++)</code><br/>The master loop. We linearly check every single city from 0 to V-1.</p>

                            <p><strong className="text-emerald-400">Line 34:</strong> <code>if (vis[i] == 0)</code><br/>If the city is unvisited, it means it is entirely disconnected from all previous provinces. This is a profound discovery.</p>
                            
                            <p><strong className="text-emerald-400">Line 35:</strong> <code>cnt++;</code><br/>We immediately increment our global count because we found a new isolated cluster.</p>

                            <p><strong className="text-amber-400">Line 36:</strong> <code>dfs(i, adjLs, vis);</code><br/>We fire off the DFS starting at this newly discovered city to map out its territory.</p>

                            <p><strong className="text-fuchsia-400">Line 4:</strong> <code>private static void dfs(...)</code><br/>DFS pushes the current city onto the Call Stack.</p>

                            <p><strong className="text-fuchsia-400">Line 5:</strong> <code>vis[node] = 1;</code><br/>We mark this city as visited. If the master loop reaches this city later, Line 34 will skip it!</p>

                            <p><strong className="text-fuchsia-400">Line 6-8:</strong> <code>for (Integer it : adjLs.get(node))</code><br/>We iterate through all neighbors. If a neighbor is <code>vis[it] == 0</code>, we plunge deeper recursively <code>dfs(it, ...)</code> to pull it into the current province.</p>
                            
                            <p><strong className="text-sky-400">Line 39:</strong> <code>return cnt;</code><br/>After the master loop finishes, every city is safely visited, and <code>cnt</code> holds the total exact number of provinces.</p>

                        </div>
                    </div>

                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is one of the most common graph questions for testing your understanding of Connected Components. Interviewers frequently ask about Matrix vs List performance impacts."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Do we really need to convert the matrix into an Adjacency List first?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, but it improves DFS efficiency."</p>
                            <p>We could pass the matrix directly into the DFS. Instead of looping over a list of neighbors, the DFS would run a loop <code>for (int j = 0; j &lt; V; j++)</code> and check <code>if (matrix[node][j] == 1 && vis[j] == 0)</code>. This avoids the $O(V^2)$ memory overhead of creating the new list, and the overall time complexity remains $O(V^2)$. However, for sparse graphs, iterating over a list of 2 neighbors is vastly faster in practice than iterating over 200 matrix columns checking for zeros."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Globe size={24}/></span>
                            <span>Q2: "Could we solve this using BFS instead of DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, BFS works perfectly as well."</p>
                            <p>Inside the master loop, instead of calling <code>dfs(i)</code>, we can push <code>i</code> into a Queue and run a standard BFS loop. It will successfully radiate outwards and mark all connected cities as visited. Both algorithms are identical for component counting; DFS is often preferred here purely because the recursive code is shorter to type."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><Combine size={24}/></span>
                            <span>Q3: "Is there another non-traversal way to solve this?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes! The Disjoint Set Union (Union-Find) algorithm."</p>
                            <p>We initialize a Union-Find structure with <code>V</code> distinct sets. We loop over the matrix, and if we see <code>adj[i][j] == 1</code>, we perform a <code>union(i, j)</code>. Every successful union merges two sets, decrementing the total province count by 1. Union-Find is highly efficient $O(V^2 \alpha(V))$ and avoids the recursion stack limit completely."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* --- LEFT SIDEBAR: CODE & TRACE --- */}
              <div className="w-full md:w-[450px] lg:w-[500px] bg-[#0f172a] border-b md:border-r border-slate-800 flex flex-col shadow-2xl relative z-50 h-[40%] md:h-full shrink-0">
                  <div className="bg-[#1e293b] p-4 lg:p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-xs lg:text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all`}><Minimize size={20}/></button>
                  </div>
                  
                  {/* Code Container - Fixed Max Height and Scrollable */}
                  <div className="code-scroll-container overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 shrink-0 border-b border-slate-800 h-[50%] md:h-[45vh]">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                  </div>
                  
                  {/* Trace Operations - Fills remaining space, always visible */}
                  <div className={`p-4 lg:p-6 transition-all duration-300 relative overflow-y-auto flex-1 flex flex-col justify-start ${st.isSuccess ? `bg-${themeColor}-900/40` : 'bg-slate-800/40'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest shrink-0">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-lg lg:text-xl font-black tracking-tight mb-4 uppercase font-mono leading-tight shrink-0 ${st.phase.startsWith('adj_') || st.phase === 'mat_add' ? 'text-emerald-400' : (st.phase === 'backtrack' || st.phase === 'exit_dfs' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-xs lg:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                  </div>
              </div>
              
              {/* --- RIGHT SIDE: VISUALIZER --- */}
              <div className="flex-1 relative bg-slate-50 overflow-hidden flex flex-col h-[60%] md:h-full">
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                  <div className="absolute top-4 left-4 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Adjacency Matrix (e.g. [[1,1,0],[1,1,0],[0,0,1]])</label>
                              <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-64 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="[[1,1,0],[1,1,0],[0,0,1]]" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-4 right-4 z-50 flex flex-row md:flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-row md:flex-col bg-white/90 p-2 rounded-2xl shadow-xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={20}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-500 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 shadow-md mr-2 hidden md:flex">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next</span>
                          </div>
                          <div className="flex gap-4">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 md:px-8 py-4 bg-white text-slate-800 rounded-2xl shadow-xl hover:bg-slate-100 disabled:opacity-50 active:scale-95 transition-all font-black text-sm md:text-lg uppercase tracking-widest flex items-center gap-2 border border-slate-200"><ChevronLeft size={24}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 md:px-10 py-4 bg-${themeColor}-600 text-white rounded-2xl hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-sm md:text-lg uppercase tracking-widest flex items-center gap-2 border border-${themeColor}-500 shadow-xl shadow-${themeColor}-500/30`}>NEXT <ChevronRight size={24}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-32" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           
                           {/* Re-using renderVisuals inner content directly to perfectly adapt to full screen */}
                           <div className="relative w-full h-full overflow-visible flex flex-col xl:flex-row items-center xl:items-start justify-center xl:justify-evenly p-6 gap-10 xl:gap-6">
                              {/* LEFT SIDE: GRAPH */}
                              <div className="flex flex-col items-center w-full xl:w-1/2 gap-12 shrink-0">
                                  <div className="flex flex-col items-center w-full">
                                      <span className="bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full shadow-sm z-30 mb-6">Conceptual Map (Graph)</span>
                                      <div className="relative w-[320px] h-[260px] bg-white border border-slate-200 rounded-[2rem] shadow-sm z-10 flex items-center justify-center overflow-visible">
                                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                              {(st.adjLs || []).map((neighbors: number[], fromNode: number) => {
                                                  return neighbors.map((toNode: number) => {
                                                      if (fromNode >= toNode) return null; // Undirected, draw once
                                                      let isChecking = (st.activeNode === fromNode && st.checkNode === toNode) || (st.activeNode === toNode && st.checkNode === fromNode);
                                                      let isSkipping = isChecking && (st.skipNode === toNode || st.skipNode === fromNode);
                                                      let isPlunging = isChecking && (st.phase === 'adj_unvisited' || st.phase === 'call_dfs_inner');
                                                      let strokeCol = "#cbd5e1"; // default slate-300
                                                      let strokeW = "2";
                                                      let dash = "none";
                                                      if (isChecking && !isSkipping) {
                                                          strokeCol = "#10b981"; // emerald-500
                                                          strokeW = "4";
                                                      } else if (isSkipping) {
                                                          strokeCol = "#f43f5e"; // rose-500
                                                          strokeW = "4";
                                                          dash = "4 4";
                                                      }
                                                      return (
                                                          <line 
                                                              key={`ge-fs-${fromNode}-${toNode}`}
                                                              x1={nodePositions[fromNode].x} 
                                                              y1={nodePositions[fromNode].y} 
                                                              x2={nodePositions[toNode].x} 
                                                              y2={nodePositions[toNode].y} 
                                                              stroke={strokeCol} 
                                                              strokeWidth={strokeW} 
                                                              strokeDasharray={dash}
                                                              className={`transition-all duration-300 ${isPlunging ? 'animate-pulse' : ''}`}
                                                          />
                                                      )
                                                  });
                                              })}
                                              
                                              {/* Animated plunging dot along active edge */}
                                              {(st.phase === 'adj_unvisited' || st.phase === 'call_dfs_inner') && st.activeNode !== undefined && st.checkNode !== undefined && (
                                                  <circle r="6" fill="#10b981" className="animate-[moveDot_0.6s_ease-in-out_forwards]">
                                                      <animateMotion 
                                                          path={`M ${nodePositions[st.activeNode].x} ${nodePositions[st.activeNode].y} L ${nodePositions[st.checkNode].x} ${nodePositions[st.checkNode].y}`} 
                                                          dur="0.6s" fill="freeze" 
                                                      />
                                                  </circle>
                                              )}
                                              {/* Animated backtracking dot */}
                                              {st.phase === 'backtrack' && st.activeNode !== undefined && st.checkNode !== undefined && (
                                                  <circle r="6" fill="#f59e0b" className="animate-[moveDot_0.6s_ease-in-out_forwards]">
                                                      <animateMotion 
                                                          path={`M ${nodePositions[st.checkNode].x} ${nodePositions[st.checkNode].y} L ${nodePositions[st.activeNode].x} ${nodePositions[st.activeNode].y}`} 
                                                          dur="0.6s" fill="freeze" 
                                                      />
                                                  </circle>
                                              )}
                                          </svg>

                                          {/* Draw Nodes via CSS absolute positioning from center */}
                                          {nodePositions.map((pos, idx) => {
                                              let isActive = st.activeNode === idx;
                                              let isMainI = st.mainI === idx && !st.activeNode; // Active in outer loop
                                              let isChecking = st.checkNode === idx;
                                              let isVisited = st.vis && st.vis[idx] === 1;
                                              let isNewlyVisited = st.hlNode === idx;
                                              
                                              let bgClass = "bg-white border-slate-300 text-slate-500";
                                              let scaleClass = "scale-100";

                                              if (isNewlyVisited) {
                                                  bgClass = "bg-emerald-400 border-emerald-600 text-white shadow-xl ring-4 ring-emerald-200 z-40 animate-in zoom-in";
                                                  scaleClass = "scale-125";
                                              } else if (isActive) {
                                                  bgClass = `bg-amber-400 border-amber-600 text-white shadow-xl ring-4 ring-amber-200 z-40`;
                                                  scaleClass = "scale-125";
                                              } else if (isChecking) {
                                                  bgClass = "bg-sky-400 border-sky-600 text-white shadow-xl ring-4 ring-sky-200 z-30";
                                                  scaleClass = "scale-125";
                                              } else if (isMainI) {
                                                  bgClass = "bg-fuchsia-400 border-fuchsia-600 text-white shadow-xl ring-4 ring-fuchsia-200 z-30";
                                                  scaleClass = "scale-125";
                                              } else if (isVisited) {
                                                  bgClass = "bg-slate-700 border-slate-800 text-white shadow-md z-20";
                                              }

                                              return (
                                                  <div 
                                                      key={`gn-fs-${idx}`} 
                                                      className={`absolute flex items-center justify-center font-mono font-black text-lg rounded-full border-[3px] transition-all duration-500 ${scaleClass} ${bgClass}`}
                                                      style={{ 
                                                          left: `${pos.x}px`, 
                                                          top: `${pos.y}px`, 
                                                          width: `40px`, 
                                                          height: `40px`,
                                                          transform: 'translate(-50%, -50%)'
                                                      }}
                                                  >
                                                      {isActive && !st.isSuccess && (
                                                          <>
                                                              <div className={`absolute w-[60px] h-[60px] bg-amber-400 rounded-full animate-ping opacity-20 pointer-events-none`}></div>
                                                              <div className={`absolute w-[100px] h-[100px] border-4 border-amber-300 rounded-full animate-ping opacity-20 pointer-events-none`} style={{ animationDelay: '200ms'}}></div>
                                                          </>
                                                      )}
                                                      {isMainI && !st.isSuccess && (
                                                          <div className={`absolute w-[80px] h-[80px] bg-fuchsia-400 rounded-full animate-ping opacity-20 pointer-events-none`}></div>
                                                      )}
                                                      {idx}
                                                      {isChecking && st.skipNode === idx && (
                                                          <XCircle size={24} className="absolute text-rose-500 -right-4 -top-4 bg-white rounded-full animate-in zoom-in"/>
                                                      )}
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>
                                  
                                  {/* DATA STRUCTURES */}
                                  <div className="w-full flex flex-row flex-wrap justify-center gap-6 z-20 mt-4 border-t border-slate-200/50 pt-8">
                                      <div className="flex flex-col items-center max-w-full">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-white px-3 py-1 rounded-full shadow-sm mb-2 flex items-center gap-2"><CheckCircle2 size={12}/> vis[]</span>
                                          <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                              {(st.vis || []).map((val: number, idx: number) => {
                                                  let isNewlyMarked = st.phase === 'mark_vis' && st.hlNode === idx;
                                                  let isChecking = st.checkNode === idx || st.mainI === idx;
                                                  let boxBg = val === 1 ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-300 border-slate-200";
                                                  if (isNewlyMarked) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-200 animate-in zoom-in";
                                                  else if (isChecking) boxBg = "bg-sky-100 text-sky-800 border-sky-400 scale-110 ring-2 ring-sky-200 shadow-md";
                                                  return (
                                                      <div key={`vis-fs-${idx}`} className="flex flex-col items-center">
                                                          <span className={`text-[8px] font-mono font-bold mb-0.5 ${isChecking ? 'text-sky-500' : 'text-slate-400'}`}>{idx}</span>
                                                          <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>{val === 1 ? '1' : '0'}</div>
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>

                                      <div className="flex flex-col items-center max-w-full">
                                          <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 bg-white px-3 py-1 rounded-full shadow-sm mb-2 flex items-center gap-2`}><ArrowUp size={12}/> DFS Stack</span>
                                          <div className="flex w-48 h-16 bg-white rounded-2xl border-2 border-slate-200 shadow-md items-center px-4 gap-2 overflow-x-hidden relative flex-row-reverse">
                                              <div className="absolute right-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">TOP</div>
                                              <div className="flex flex-row-reverse gap-2 mx-auto transition-all duration-500">
                                                  {(st.callStack || []).map((val: number, i: number) => {
                                                      let isTop = i === st.callStack.length - 1;
                                                      let isEntering = st.phase === 'enter_dfs' && isTop;
                                                      return (
                                                          <div key={`stack-fs-${i}-${val}`} className={`w-8 h-8 flex items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-md transition-all duration-500 ${isEntering ? `bg-${themeColor}-400 border-${themeColor}-500 animate-in slide-in-from-top-8 scale-110` : isTop ? `bg-${themeColor}-500 border-${themeColor}-600` : 'bg-slate-500 border-slate-600'}`}>{val}</div>
                                                      )
                                                  })}
                                                  {st.callStack && st.callStack.length === 0 && <span className="text-slate-300 font-mono italic text-sm my-auto text-center w-full">Empty</span>}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="hidden xl:block w-px bg-slate-300 self-stretch my-8 opacity-50 z-0"></div>

                              {/* RIGHT SIDE: MATRIX */}
                              <div className="flex flex-col items-center w-full xl:w-1/2 z-20 mt-8 xl:mt-4 shrink-0">
                                  <span className="bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full shadow-sm z-30 mb-6">adj[][] (Input Adjacency Matrix)</span>
                                  <div className="flex flex-col gap-1 p-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-slate-300">
                                      <div className="flex gap-1 mb-2 items-center border-b border-slate-100 pb-2 min-w-max">
                                          <div className="w-8 text-right pr-2 text-[8px] font-bold text-slate-400 uppercase">City</div>
                                          {[...Array(st.V).keys()].map((c) => (
                                              <div key={`mhc-fs-${c}`} className={`w-8 flex justify-center text-[10px] font-mono font-bold transition-all ${st.checkNode === c || st.matJ === c ? 'text-sky-500 scale-125' : 'text-slate-400'}`}>{c}</div>
                                          ))}
                                      </div>
                                      {st.adj && st.adj.map((rowArr: number[], r: number) => {
                                          let isRowActive = st.activeNode === r || st.mainI === r || st.matI === r;
                                          return (
                                              <div key={`mat-r-fs-${r}`} className="flex gap-1 items-center mb-1 min-w-max">
                                                  <span className={`w-8 text-right text-[10px] font-mono font-bold pr-2 transition-all ${isRowActive ? 'text-amber-600 scale-125' : 'text-slate-500'}`}>{r}</span>
                                                  {rowArr.map((val: number, c: number) => {
                                                      let isCellChecking = (st.activeNode === r && st.checkNode === c) || (st.matI === r && st.matJ === c);
                                                      let isAdded = st.addedI === r && st.addedJ === c;
                                                      let boxBg = val === 1 ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-300 border-slate-200";
                                                      let zIndex = "z-0";
                                                      if (isCellChecking && st.phase === 'mat_eval') {
                                                          boxBg = "bg-fuchsia-400 text-white border-fuchsia-600 scale-125 shadow-xl animate-pulse ring-4 ring-fuchsia-200";
                                                          zIndex = "z-20";
                                                      } else if (isCellChecking) {
                                                          boxBg = "bg-sky-400 text-white border-sky-600 scale-110 shadow-lg ring-4 ring-sky-200";
                                                          zIndex = "z-10";
                                                      } else if (isAdded) {
                                                          boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg z-10";
                                                      } else if (isRowActive && val === 1) {
                                                          boxBg = "bg-amber-400 text-amber-900 border-amber-500 scale-105 shadow-md z-10";
                                                      }
                                                      return (
                                                          <div key={`mat-fs-${r}-${c}`} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-[10px] border-[2px] rounded-lg transition-all duration-300 ${boxBg} ${zIndex}`}>{val}</div>
                                                      )
                                                  })}
                                              </div>
                                          )
                                      })}
                                  </div>
                              </div>
                           </div>

                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-white border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_20px_100px_rgba(0,0,0,0.2)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-100 text-${themeColor}-600 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-${themeColor}-200`}><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`text-${themeColor}-600 font-mono text-xs uppercase mb-8 tracking-widest font-bold`}>Successfully counted all disconnected provinces</p>
                                
                                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200 shadow-inner mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-600 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Provinces Found</div>
                                    <div className={`font-mono text-${themeColor}-700 text-5xl font-black leading-relaxed flex items-center gap-2 break-all`}>{st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl shadow-black/20">
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
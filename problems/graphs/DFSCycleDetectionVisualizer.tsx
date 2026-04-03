import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  detectCycleDFS: {
    id: 'detectCycleDFS',
    title: 'Detect Cycle in Undirected Graph (DFS)',
    icon: <ArrowDownToLine size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'indigo',
    code: `class Solution {
    private boolean dfs(int node, int parent, int vis[], ArrayList<ArrayList<Integer>> adj) {
        vis[node] = 1;
        for(int adjacentNode: adj.get(node)) {
            if(vis[adjacentNode]==0) {
                if(dfs(adjacentNode, node, vis, adj) == true)
                    return true;
            }
            else if(adjacentNode != parent) return true;
        }
        return false;
    }
    
    // Function to detect cycle in an undirected graph.
    public boolean isCycle(int V, ArrayList<ArrayList<Integer>> adj) {
        int vis[] = new int[V];
        for(int i = 0;i<V;i++) {
            if(vis[i] == 0) {
                if(dfs(i, -1, vis, adj) == true) return true;
            }
        }
        return false;
    }
}`,
    desc: "Detecting a cycle in an undirected graph using Depth-First Search. It plunges deep into the graph paths recursively. By passing the 'parent' node down the call stack, it knows where it just came from. If it ever encounters a node that is already marked as visited (1), and that node is NOT the direct parent, it means two paths have collided, confirming a cycle."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|dfs|isCycle|ArrayList|Integer|adj|vis|node|parent|adjacentNode|V|get)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'ArrayList'].includes(part);
            const isPointer = ['adj', 'vis', 'node', 'parent', 'adjacentNode', 'V', 'i'].includes(part);
            const isMapCall = ['dfs', 'isCycle', 'get'].includes(part);
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

// --- Main Application ---

export default function DFSCycleDetectionVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('detectCycleDFS');
  
  // Default matches the user's uploaded whiteboard graph image (shifted to 0-indexed)
  const [adjInput, setAdjInput] = useState('1, 2 | 0, 4 | 0, 3, 5 | 2 | 1, 6 | 2, 6 | 4, 5');

  const [baseAdj, setBaseAdj] = useState<number[][]>([
      [1, 2],
      [0, 4],
      [0, 3, 5],
      [2],
      [1, 6],
      [2, 6],
      [4, 5]
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
        let rows = adjInput.split('|').map(r => r.trim());
        let parsed: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") {
                parsed.push([]);
                continue;
            }
            let neighbors = rows[i].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
            parsed.push(neighbors);
        }
        
        if (parsed.length === 0) parsed = [[1, 2], [0, 4], [0, 3, 5], [2], [1, 6], [2, 6], [4, 5]];
        if (parsed.length > 15) parsed = parsed.slice(0, 15); // Cap max nodes

        // Filter out out-of-bounds neighbors and self-loops
        const V = parsed.length;
        for (let i = 0; i < V; i++) {
            parsed[i] = parsed[i].filter(n => n < V && n !== i);
        }

        // Ensure edges are strictly undirected for visualizer consistency
        for (let i = 0; i < V; i++) {
            for (let j of parsed[i]) {
                if (!parsed[j].includes(i)) {
                    parsed[j].push(i);
                }
            }
            parsed[i].sort((a, b) => a - b);
        }

        setBaseAdj(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [adjInput]);

  // Robust Auto-scroll effect specifically targeting the exact active line
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

  const clone1D = (arr: any[]) => [...arr];

  // Circle Layout for Graph
  const nodePositions = useMemo(() => {
    const V = baseAdj.length;
    const pos: {x: number, y: number}[] = new Array(V).fill({x: 0, y: 0});
    if (V === 0) return pos;
    if (V === 1) return [{x: 0, y: 0}];

    const radius = Math.max(120, V * 25);
    for (let i = 0; i < V; i++) {
        const angle = (i / V) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseAdj]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const V = adj.length;
    if (V === 0) return steps;

    const stack: {node: number, parent: number}[] = [];
    let vis: number[] = Array(V).fill(0);
    let isCycleFound = false;
    let cycleData = {}; // Store exact collision state to persist on final steps
    
    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, stack: [...stack], vis: clone1D(vis), ...st } 
    });

    add("Function Call", `public boolean isCycle(int V=${V}, ...)\nInitiating cycle detection across ${V} total nodes.`, 15, { phase: 'init' });
    
    add("Init Visited Array", `int vis[] = new int[V];\nAllocated integer array to track visited states (0: unvisited, 1: visited).`, 16, { phase: 'init_ds' });
    
    add("Clear Visited", `for(int i = 0;i<V;i++) {\nExplicitly entering the scan loop to ensure all components are seeded.`, 17, { phase: 'init_ds', scanI: 0 });

    const runDFS = (node: number, parent: number) => {
        stack.push({node, parent});
        add("DFS Enter", `private boolean dfs(int node=${node}, int parent=${parent}, ...)\nPlunging into deep recursion for node ${node}.`, 2, { phase: 'dfs_enter', activeNode: node, parent, scanI: stack[0]?.node });

        vis[node] = 1;
        add("Mark Visited", `vis[node] = 1;\nMarking active node ${node} as visited (1).`, 3, { phase: 'mark_vis', activeNode: node, parent, scanI: stack[0]?.node });

        add("Neighbor Loop", `for(int adjacentNode: adj.get(node))\nScanning all connections from node ${node}.`, 4, { phase: 'for_adj', activeNode: node, parent, scanI: stack[0]?.node });

        for (let adjacentNode of adj[node]) {
            add("Check Unvisited", `if(vis[adjacentNode]==0)\nIs neighbor ${adjacentNode} unvisited? It is currently ${vis[adjacentNode]}.`, 5, { phase: 'check_adj_vis', activeNode: node, parent, checkNode: adjacentNode, scanI: stack[0]?.node });

            if (vis[adjacentNode] === 0) {
                add("Recursive DFS Call", `if(dfs(adjacentNode, node, vis, adj) == true)\nNeighbor ${adjacentNode} is fresh. Plunging deeper!`, 6, { phase: 'call_dfs', activeNode: node, parent, checkNode: adjacentNode, scanI: stack[0]?.node });
                
                if (runDFS(adjacentNode, node)) {
                    add("Propagate True", `return true;\nCycle detected deep in the recursion! Passing 'true' back up the stack.`, 7, { phase: 'cycle_found', scanI: stack[0]?.node, ...cycleData });
                    return true;
                }
                
                // Backtrack
                add("Backtrack", `Resuming neighbor loop for node ${node} after returning from dfs(${adjacentNode}).`, 4, { phase: 'dfs_backtrack', activeNode: node, parent, checkNode: adjacentNode, scanI: stack[0]?.node });

            } else {
                add("Check Parent", `else if(adjacentNode != parent)\nNeighbor ${adjacentNode} IS visited (1). Is ${adjacentNode} our direct parent (${parent})?`, 9, { phase: 'check_parent', activeNode: node, parent, checkNode: adjacentNode, scanI: stack[0]?.node });

                if (adjacentNode !== parent) {
                    isCycleFound = true;
                    // Save collision state to keep the red edge visible during all subsequent return steps
                    cycleData = { activeNode: node, parent: parent, checkNode: adjacentNode, cycleNode: adjacentNode };
                    
                    add("CYCLE DETECTED!", `return true;\nCondition matched! Neighbor ${adjacentNode} is already visited (1) AND is NOT the parent (${parent}). This means we looped back! A cycle exists.`, 9, { phase: 'cycle_found', scanI: stack[0]?.node, ...cycleData });
                    return true;
                } else {
                    add("Ignore Parent", `Neighbor ${adjacentNode} IS our parent. We just traversed from there. This is a bidirectional edge, not a cycle.`, 9, { phase: 'ignore_parent', activeNode: node, parent, checkNode: adjacentNode, scanI: stack[0]?.node });
                }
            }
        }
        
        stack.pop();
        add("DFS Exit", `return false;\nExplored all neighbors of ${node} safely. Popping from call stack.`, 11, { phase: 'dfs_exit', activeNode: node, parent, scanI: stack[0]?.node || 0 });
        return false;
    };
    
    for (let i = 0; i < V; i++) {
        if (isCycleFound) break;
        
        if (i > 0) {
            add("Outer Loop Iteration", `for(int i = 0;i<V;i++)\nContinuing scan loop to check for disconnected graph components.`, 17, { phase: 'scan', scanI: i });
        }
        
        add("Check Component", `if(vis[i] == 0)\nIs root node ${i} unvisited?`, 18, { phase: 'check_unvisited', scanI: i });

        if (vis[i] === 0) {
            add("Call DFS on Component", `if(dfs(${i}, -1, vis, adj) == true)\nNode ${i} is unvisited. Triggering DFS with parent -1.`, 19, { phase: 'call_check', scanI: i });

            if(runDFS(i, -1)) {
                add("Return True (Main)", `return true;\nThe root DFS call returned true. A cycle definitively exists in the graph.`, 19, { phase: 'return_true', isDone: true, isSuccess: true, scanI: i, ...cycleData });
                break;
            }
        } else {
            add("Skip Component", `if(vis[i] == 0) is FALSE.\nNode ${i} is already visited. Skipping.`, 18, { phase: 'skip_comp', scanI: i });
        }
    }

    if (!isCycleFound) {
        add("Final Clean Return", `return false;\nAll graph components explored. Absolutely zero cycles exist.`, 22, { phase: 'done', isDone: true, isSuccess: false });
    }

    return steps;
  }, [baseAdj]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-rose-900 border-rose-800' : 'bg-emerald-900 border-emerald-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><ArrowDownToLine size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.isSuccess ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {st.isSuccess ? <AlertTriangle size={24}/> : <CheckCircle2 size={24}/>} 
                    {st.isSuccess ? "CYCLE DETECTED" : "GRAPH IS ACYCLIC"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? "Found a back-edge to a visited non-parent node." : "Traversed all components safely without loops."}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('cycle') ? 'text-rose-500' : (st.phase.includes('dfs_enter') || st.phase === 'mark_vis' || st.phase.includes('mark_src') || st.phase === 'init_ds' ? 'text-emerald-400' : (st.phase.includes('backtrack') || st.phase.includes('exit') ? 'text-indigo-400' : (st.phase.includes('check') || st.phase.includes('scan') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.adj === undefined) return null;
      let isDone = st.isDone;
      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isDone ? (isSuccessEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-emerald-400 ring-4 ring-emerald-100') : 'border-slate-200'} scale-105 z-40`}>
              {isDone ? (
                  <div className="flex flex-col items-center justify-center gap-4 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isSuccessEnd ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isSuccessEnd ? <AlertTriangle size={16}/> : <CheckCircle2 size={16}/>} Final Result Returned
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full break-all ${isSuccessEnd ? 'text-rose-700 bg-rose-100 border-rose-400' : 'text-emerald-700 bg-emerald-100 border-emerald-400'}`}>
                          {isSuccessEnd ? `return true; (Cycle Exists)` : 'return false; (No Cycles)'}
                      </div>
                      <button onClick={handleReset} className={`mt-2 py-3 px-8 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-sm ${isSuccessEnd ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                          <RotateCcw size={18}/> RESTART SIMULATION
                      </button>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[70px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><Search size={12}/> Outer Scan Loop</span>
                          <div className={`border-2 text-sm font-black px-6 py-2 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 shadow-sm flex flex-col items-center min-w-[80px]`}>
                              <span>i = <span className="text-indigo-500">{st.scanI !== undefined ? st.scanI : '-'}</span></span>
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-indigo-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active Node & Parent</span>
                          <div className={`border-2 text-xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('dfs') || st.phase === 'cycle_found' || st.phase === 'ignore_parent' ? 'bg-indigo-100 border-indigo-400 text-indigo-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeNode !== undefined ? `${st.activeNode} [P: ${st.parent !== undefined ? st.parent : '-'}]` : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><ZoomIn size={12}/> Checking AdjNode</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-2xl transition-all duration-300 ${st.checkNode !== undefined ? 'bg-sky-100 border-sky-400 text-sky-800 shadow-sm animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.checkNode !== undefined ? st.checkNode : '-'}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderSimulationState = () => {
      if (st.adj === undefined) return null;

      const renderedEdges = new Set<string>();

      return (
          <>
             {/* LEFT COLUMN: Graph Renderer & Visited Array */}
             <div className="flex flex-col gap-8 shrink-0 relative">
                 <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white/90 rounded-[3rem] shadow-2xl border border-slate-300 backdrop-blur-sm z-10 flex items-center justify-center">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Undirected Graph</span>
                     
                     <svg viewBox="-250 -250 500 500" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                          {(() => {
                              const edges = new Set<string>();
                              return st.adj.map((neighbors: number[], u: number) => (
                                  neighbors.map((v: number) => {
                                      const edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`;
                                      if (edges.has(edgeKey)) return null;
                                      edges.add(edgeKey);
      
                                      const p1 = nodePositions[u];
                                      const p2 = nodePositions[v];
                                      if (!p1 || !p2) return null;
      
                                      let isChecking = (st.activeNode === u && st.checkNode === v) || (st.activeNode === v && st.checkNode === u);
                                      let isCycle = (st.phase === 'cycle_found' || (st.isDone && st.isSuccess)) && isChecking;
                                      let isParentEdge = isChecking && st.parent === (st.activeNode === u ? v : u);
      
                                      let strokeColor = "#cbd5e1"; // slate-300
                                      let strokeWidth = "3";
                                      let strokeDash = "none";
                                      let animClass = "";
      
                                      if (isCycle) {
                                          strokeColor = "#f43f5e"; // rose-500
                                          strokeWidth = "8";
                                          animClass = "animate-pulse";
                                      } else if (isParentEdge) {
                                          strokeColor = "#10b981"; // emerald-500
                                          strokeWidth = "5";
                                          strokeDash = "10 5";
                                      } else if (isChecking) {
                                          strokeColor = "#0ea5e9"; // sky-500
                                          strokeWidth = "6";
                                      }
      
                                      return (
                                          <line 
                                              key={edgeKey}
                                              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              strokeDasharray={strokeDash}
                                              className={`transition-all duration-300 ${animClass}`}
                                              strokeLinecap="round"
                                          />
                                      );
                                  })
                              ));
                          })()}
                     </svg>

                     {/* Render Nodes */}
                     <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                        {nodePositions.map((pos, idx) => {
                            let isVisited = st.vis[idx] === 1;
                            let isActive = st.activeNode === idx;
                            let isChecking = st.checkNode === idx;
                            let isParent = st.parent === idx && st.activeNode !== undefined;
                            let isCycleNode = st.cycleNode === idx;

                            let bgClass = isVisited ? 'bg-indigo-500 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-400 border-slate-200 shadow-sm';
                            let ringClass = '';
                            let scaleClass = 'scale-100';
                            let zIndex = 'z-10';

                            if (isCycleNode) {
                                ringClass = 'ring-4 ring-rose-500 ring-offset-2 border-transparent';
                                bgClass = 'bg-rose-500 text-white shadow-xl';
                                scaleClass = 'scale-125';
                                zIndex = 'z-40';
                            } else if (isActive) {
                                ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent shadow-xl';
                                bgClass = 'bg-fuchsia-500 text-white';
                                scaleClass = 'scale-125';
                                zIndex = 'z-40';
                            } else if (isChecking) {
                                ringClass = 'ring-4 ring-sky-400 ring-offset-2 border-transparent shadow-md';
                                scaleClass = 'scale-110';
                                zIndex = 'z-30';
                            } else if (isParent) {
                                ringClass = 'ring-4 ring-emerald-400 ring-offset-2 border-transparent border-dashed';
                                scaleClass = 'scale-105';
                                zIndex = 'z-20';
                            }

                            return (
                                <div 
                                    key={`node-${idx}`}
                                    className={`absolute w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-black text-xl md:text-2xl rounded-full transition-all duration-300 border-2 select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`}
                                    style={{ 
                                        left: `${pos.x}px`, 
                                        top: `${pos.y}px`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {idx}
                                    {isParent && <span className="absolute -top-6 text-[10px] text-emerald-600 bg-emerald-50 px-2 rounded font-bold border border-emerald-200">PARENT</span>}
                                </div>
                            );
                        })}
                     </div>
                 </div>

                 {/* Visited Array Flat Viewer */}
                 <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><CheckCircle2 size={12}/> vis[] Array</span>
                     <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl w-full">
                         {(st.vis || []).map((val: number, idx: number) => {
                             let isNewlyMarked = (st.phase === 'mark_vis') && (st.activeNode === idx);
                             let isChecking = st.phase === 'check_adj_vis' && st.checkNode === idx;
                             
                             let boxBg = val === 1 ? "bg-indigo-600 text-white border-indigo-700" : "bg-slate-50 text-slate-300 border-slate-200";
                             
                             if (isNewlyMarked) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-200 animate-in zoom-in";
                             else if (isChecking) boxBg = "bg-sky-100 text-sky-800 border-sky-400 scale-110 ring-2 ring-sky-200";

                             return (
                                 <div key={`vis-${idx}`} className="flex flex-col items-center">
                                     <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{idx}</span>
                                     <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded border-2 transition-all duration-300 ${boxBg}`}>
                                         {val}
                                     </div>
                                 </div>
                             )
                         })}
                     </div>
                 </div>
             </div>

             {/* RIGHT COLUMN: Adjacency List, Variables & Call Stack */}
             <div className="flex flex-col gap-4 z-20 items-center justify-start shrink-0 w-[240px] md:w-[320px]">
                 
                 {/* Adjacency List Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><ListTree size={12}/> Adjacency List</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-1 relative min-h-[150px] max-h-[250px] overflow-y-auto scrollbar-thin">
                         {(st.adj || []).map((neighbors: number[], nodeIdx: number) => {
                             let isActiveRow = st.activeNode === nodeIdx;
                             let isScanRow = st.scanI === nodeIdx && st.phase.includes('scan');
                             let highlightRow = isActiveRow || isScanRow;

                             return (
                                 <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-fuchsia-50 border border-fuchsia-200 shadow-sm' : (isScanRow ? 'bg-indigo-50 border border-indigo-200' : 'bg-transparent border border-transparent')}`}>
                                     <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-fuchsia-500 text-white shadow-sm' : (isScanRow ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                         {nodeIdx}
                                     </div>
                                     <ArrowRight size={14} className={isActiveRow ? 'text-fuchsia-400' : (isScanRow ? 'text-indigo-400' : 'text-slate-300')} />
                                     <div className="flex flex-wrap gap-1 items-center">
                                         <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                         {neighbors.map((neighbor: number, nIdx: number) => {
                                             let isChecking = isActiveRow && st.checkNode === neighbor;
                                             let isParent = isActiveRow && st.parent === neighbor;
                                             let isCycle = (st.phase === 'cycle_found' || (st.isDone && st.isSuccess)) && isChecking;

                                             let neighborBg = 'transparent';
                                             let neighborText = highlightRow ? 'text-fuchsia-700' : 'text-slate-500';

                                             if (isCycle) {
                                                 neighborBg = 'bg-rose-500';
                                                 neighborText = 'text-white shadow-sm';
                                             } else if (isChecking) {
                                                 neighborBg = 'bg-sky-400';
                                                 neighborText = 'text-white shadow-sm';
                                             } else if (isParent) {
                                                 neighborBg = 'bg-emerald-100';
                                                 neighborText = 'text-emerald-700';
                                             }

                                             return (
                                                 <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                                     <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md transition-colors ${neighborBg} ${neighborText}`}>
                                                         {neighbor}
                                                     </span>
                                                     {nIdx < neighbors.length - 1 && <span className="text-slate-300 font-mono text-xs">,</span>}
                                                 </React.Fragment>
                                             );
                                         })}
                                         <span className="text-slate-400 font-mono text-sm">{'}'}</span>
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 </div>

                 {/* Call Stack Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> Call Stack</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[100px] max-h-[180px] overflow-y-auto scrollbar-thin">
                         <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                             <span>TOP (CURRENT)</span>
                         </div>
                         
                         <div className="flex flex-col gap-2 transition-all duration-500">
                             {[...(st.stack || [])].reverse().map((val: {node: number, parent: number}, i: number) => {
                                 let isTop = i === 0;
                                 let isEntering = isTop && st.phase === 'dfs_enter';
                                 
                                 return (
                                     <div key={`stack-${i}-${val.node}-${val.parent}`} className={`px-4 py-2 flex items-center justify-between font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-indigo-500 border-indigo-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-fuchsia-600 border-fuchsia-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-500')}`}>
                                         <span className="text-xs">dfs({val.node}, {val.parent})</span>
                                         {isTop && <Activity size={12} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                                     </div>
                                 )
                             })}
                             {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Stack is empty</span>}
                         </div>
                     </div>
                 </div>

                 {/* Variables State Panel */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2"><Database size={12}/> Trace Variables</span>
                     <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-4 flex flex-col gap-2 font-mono text-[11px] md:text-xs">
                         <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <div className="flex justify-between border-b border-slate-100 pb-1">
                                 <span className="text-slate-400">V:</span>
                                 <span className="font-bold text-slate-700">{st.V !== undefined ? st.V : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1">
                                 <span className="text-slate-400">i (scan):</span>
                                 <span className="font-bold text-slate-700">{st.scanI !== undefined ? st.scanI : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                                 <span className="text-fuchsia-500">node:</span>
                                 <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-emerald-500">parent:</span>
                                 <span className="font-bold text-emerald-700">{st.parent !== undefined ? st.parent : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-sky-500">adjacentNode:</span>
                                 <span className="font-bold text-sky-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
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
                      Graph Algorithm
                  </span>
                  <span>•</span>
                  <span>Recursion & Ancestry</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><ArrowDownToLine size={28}/> Recursive Loop Hunting</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an undirected graph represented by an adjacency list, your goal is to determine if the graph contains at least one cycle.</p>
                        <p>A cycle occurs when there is a path of edges and vertices wherein a vertex is reachable from itself. In simpler terms, you can walk through the graph and end up exactly where you started without retracing your immediate last step.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example (3 Components):</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> V = 8, adj = [[1, 2], [0, 4], [0, 3, 5], [2], [1, 6], [2, 6], [4, 5]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">true</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           Component 1 (Nodes 0-1-2) is acyclic.<br/>
                           Component 2 (Nodes 3-4) is acyclic.<br/>
                           Component 3 (Nodes 5-6-7) forms a closed triangle loop.<br/>
                           DFS scans Component 1 and 2 safely. When it enters Component 3, 5 visits 6, 6 visits 7, and 7 sees 5 is visited and is NOT its parent. Cycle detected!
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-fuchsia-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowLeftRight size={16}/> 1. Track Ancestry Downward</span>
                            <p className="text-sm text-slate-500">Unlike standard graph traversals, we must pass the <code>parent</code> into the DFS call. Because the graph is undirected, every edge is bidirectional. We use the parent to avoid falsely identifying the edge we just came from as a cycle.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><AlertTriangle size={16}/> 2. The Collision</span>
                            <p className="text-sm text-slate-500">As the DFS plunges deep, if a node looks at its neighbors and finds one that is <strong>already visited (1)</strong>, and that neighbor is <strong>not its parent</strong>, it implies the path has looped back onto itself. A cycle exists.</p>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency List (Use | to separate nodes 0 to V-1)</label>
                            <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="e.g. 1, 2 | 0, 4 | 0, 3, 5 | ..." />
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
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Cycle Detection Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-fuchsia-100 text-fuchsia-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how recursively traversing an undirected graph allows us to identify loops naturally using ancestry logic.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-fuchsia-500"/> Undirected Graph Challenges</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In an undirected graph, an edge between A and B means A points to B AND B points to A. If you just do a standard DFS and say "if I see a visited node, it's a cycle", you will fail immediately. When you move from A to B, B will look at its neighbors, see A (which is visited), and falsely declare a cycle! This is why tracking the `parent` is mandatory.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> DFS Disconnected Components</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A graph may not be fully connected. A cycle might exist on an isolated island of nodes far away from Node 0. This is why the algorithm wraps the DFS call in a global loop `for(int i=0; i&lt;V; i++)`. It guarantees every single disconnected component is seeded and evaluated.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>The algorithm processes each vertex V exactly once. For each vertex, it loops through its adjacency list. The sum of all adjacency lists in an undirected graph is 2E. Therefore, the operations scale linearly with the sum of vertices and edges.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The `vis[]` array takes O(V) space. The Call Stack, in the worst-case scenario (a long snake-like line graph), could hold V elements simultaneously, bounding the space complexity tightly to O(V).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-fuchsia-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Detecting cycles is a foundational graph problem. Interviewers will test if you understand the subtle differences between directed and undirected graph cycles."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we use Breadth-First Search (BFS) instead of DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely."</p>
                            <p>With BFS, we pass the `parent` into the Queue: <code>Queue.add(new Pair(node, parent))</code>. The logic is identical: if we dequeue a node and check its neighbors, and hit a visited node that isn't the parent, we return true. DFS is often faster to write in a whiteboard interview, but BFS is safer against Stack Overflow errors on massive graph depth."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Does this exact same code work for Directed Graphs?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it will fail."</p>
                            <p>In a directed graph, you can have two different paths leading to the same node without forming a cycle (e.g., A -&gt; B, A -&gt; C, B -&gt; D, C -&gt; D. Here D is visited twice but there is no back-loop to A). For directed graphs, we must maintain a separate <code>pathVisited[]</code> array (in DFS) or use Kahn's Topological Sort algorithm (BFS) to detect true back-edges."</p>
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
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency List (Use | to separate nodes 0 to V-1)</label>
                                    <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold min-w-[300px]`} placeholder="e.g. 1, 2 | 0, 4 | 0, 3, 5 | ..." />
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
                  {st.isDone && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]' : 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-rose-500/20 text-rose-500 ring-rose-500/10' : 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10'}`}>
                                    {st.isSuccess ? <AlertTriangle size={48}/> : <CheckCircle2 size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.isSuccess ? "CYCLE DETECTED" : "GRAPH IS ACYCLIC"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.isSuccess ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {st.isSuccess ? "Found a back-edge to a visited non-parent node." : "Traversed all components safely without loops."}
                                </p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isSuccess ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        Returned Value
                                    </div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">
                                        {st.isSuccess ? "true" : "false"}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-500 hover:bg-${themeColor}-600 shadow-${themeColor}-900/20`}>
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
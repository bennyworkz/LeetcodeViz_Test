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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale, LineChart, Snowflake, Network, RadioReceiver, Route, Navigation, Wifi
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  standardDFS: {
    id: 'standardDFS',
    title: 'Depth-First Search (DFS)',
    icon: <ArrowDownToLine size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'fuchsia',
    code: `class Solution {
    public static void dfs(int node, boolean vis[], ArrayList<ArrayList<Integer>> adj, ArrayList<Integer> ls) {
        // Marking current node as visited
        vis[node] = true;
        ls.add(node);
        
        // Recursively visit all unvisited neighbors
        for (Integer it : adj.get(node)) {
            if (!vis[it]) {
                dfs(it, vis, adj, ls);
            }
        }
    }
    
    // Function to return a list containing the DFS traversal
    public ArrayList<Integer> dfsOfGraph(int V, ArrayList<ArrayList<Integer>> adj) {
        boolean vis[] = new boolean[V];
        ArrayList<Integer> ls = new ArrayList<>();
        
        // Assuming 0-indexed graph and fully connected
        vis[0] = true;
        dfs(0, vis, adj, ls);
        
        return ls;
    }
}`,
    desc: "Depth-First Search (DFS): A fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses the Call Stack (Recursion) to keep track of the exploration path and a Visited Array to prevent infinite loops in cyclic graphs. It plunges deep into the graph until it hits a dead end, then beautifully unwinds the stack to explore alternative routes."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|static|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|ArrayList|Integer|dfsOfGraph|dfs|adj|ls|vis|node|it|add|get|V)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'static', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'ArrayList'].includes(part);
            const isPointer = ['adj', 'ls', 'vis', 'node', 'it', 'V'].includes(part);
            const isMapCall = ['dfsOfGraph', 'dfs', 'add', 'get'].includes(part);
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

export default function DFSVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('standardDFS');
  
  const [adjInput, setAdjInput] = useState('1, 2, 3 | 0, 4, 5 | 0, 6 | 0 | 1 | 1 | 2');
  const [baseAdj, setBaseAdj] = useState<number[][]>([[1, 2, 3], [0, 4, 5], [0, 6], [0], [1], [1], [2]]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
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
        
        if (parsed.length === 0) parsed = [[1, 2, 3], [0, 4, 5], [0, 6], [0], [1], [1], [2]];
        if (parsed.length > 15) parsed = parsed.slice(0, 15); // Cap max nodes for UI graph rendering

        // Filter out out-of-bounds neighbors
        const V = parsed.length;
        for (let i = 0; i < V; i++) {
            parsed[i] = parsed[i].filter(n => n < V);
        }

        setBaseAdj(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseAdj([[1, 2, 3], [0, 4, 5], [0, 6], [0], [1], [1], [2]]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [adjInput, selectedOpId]);

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

  // Dynamic Layout Algorithm: Compute levels to render graph like a tree radiating downwards
  const nodePositions = useMemo(() => {
    const V = baseAdj.length;
    const pos: {x: number, y: number}[] = new Array(V).fill({x: 0, y: 0});
    if (V === 0) return pos;

    const dist = new Array(V).fill(-1);
    const levels: number[][] = [];
    let q = [0];
    dist[0] = 0;
    levels[0] = [0];

    while(q.length > 0) {
        let curr = q.shift()!;
        for(let neighbor of baseAdj[curr] || []) {
            if (dist[neighbor] === -1) {
                dist[neighbor] = dist[curr] + 1;
                if (!levels[dist[neighbor]]) levels[dist[neighbor]] = [];
                levels[dist[neighbor]].push(neighbor);
                q.push(neighbor);
            }
        }
    }

    // Handle disconnected nodes
    const disconnected = [];
    for (let i = 0; i < V; i++) {
        if (dist[i] === -1) disconnected.push(i);
    }
    if (disconnected.length > 0) {
        levels.push(disconnected);
    }

    const ySpacing = 110;
    const xSpacing = 100;
    const startY = 80;

    levels.forEach((levelNodes, lIdx) => {
        const y = startY + lIdx * ySpacing;
        const levelWidth = (levelNodes.length - 1) * xSpacing;
        const startX = -levelWidth / 2; // Centered at X=0

        levelNodes.forEach((node, nIdx) => {
            pos[node] = {
                x: startX + nIdx * xSpacing,
                y: y
            };
        });
    });

    return pos;
  }, [baseAdj]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const V = adj.length;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, ...st } 
    });

    add("Function Call", `We begin the DFS traversal process. The goal is to visit all nodes reachable from our starting point. We receive 'V' (total vertices = ${V}) and 'adj' (the adjacency list detailing connections between nodes).`, 16, { phase: 'init' });

    let vis: boolean[] = new Array(V).fill(false);
    let ls: number[] = [];
    let callStack: number[] = [];

    add("Initialize Structures", `Before we can traverse, we must prepare our tracking structures. We create a boolean array 'vis' of size ${V} to remember which nodes we've already visited (preventing infinite loops), an 'ls' ArrayList to record the final chronological order of our traversal, and we conceptually prepare our system Call Stack.`, 17, { phase: 'init_ds', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack) });

    if (V === 0) return steps;

    vis[0] = true;
    add("Mark Source", `We must always mark a node as visited BEFORE we plunge into its neighbors. Here, we assume node 0 is our starting point. Marking it 'true' immediately ensures we don't accidentally loop back to it if it's part of a cycle later on.`, 21, { phase: 'mark_src', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), hlNode: 0 });

    add("Start DFS Traversal", `We launch the recursive DFS function starting at Node 0. This is the initial spark that will push the first frame onto our Call Stack and begin the deep exploration of the graph.`, 22, { phase: 'call_dfs', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), hlNode: 0 });

    const dfs = (node: number, parent?: number) => {
        if (steps.length > 1000) return; // Safety cap
        
        callStack.push(node);
        add("Enter DFS Frame", `A new frame is pushed onto the Call Stack! We are now actively focused entirely on Node ${node}. The execution of the parent node's loop is completely paused until we finish exploring every possible path extending from this current node.`, 2, { phase: 'enter_dfs', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node });

        vis[node] = true;
        add("Mark Node Visited", `As soon as we enter the node's recursive frame, we lock it down by marking it 'visited' in our global array. This acts as a roadblock for any other branches that might try to reach Node ${node} later, guaranteeing we only process it once.`, 4, { phase: 'mark_vis', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node, hlNode: node });

        ls.push(node);
        add("Record Traversal", `Since we have officially reached and secured Node ${node}, we append it to our sequence list 'ls'. This list represents the exact historical path of our initial deep-dives into the graph.`, 5, { phase: 'add_ls', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node });

        let neighbors = adj[node] || [];
        for (let i = 0; i < neighbors.length; i++) {
            let it = neighbors[i];
            add("Check Neighbor", `We retrieve the adjacency list for our active Node ${node} to see all its direct connections. We will now iterate through each neighbor one by one, deciding whether to plunge deeper into them or skip them. Currently checking Node ${it}.`, 8, { phase: 'check_adj', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node, checkNode: it });

            if (!vis[it]) {
                add("Neighbor Unvisited", `We examine neighbor Node ${it}. We check our 'vis' array and discover it is currently 'false'. This means we have discovered brand new, unexplored territory! We must prepare to investigate this path immediately.`, 9, { phase: 'adj_unvisited', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node, checkNode: it });
                
                add("Plunge (Recursive Call)", `THE PLUNGE! Instead of finishing our current list of neighbors, we immediately suspend the current 'for' loop. We make a recursive call to dfs(${it}), pushing a new frame onto the top of the Call Stack. We will go as deep as possible down this rabbit hole before coming back here.`, 10, { phase: 'call_dfs_inner', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node, checkNode: it });
                
                dfs(it, node);
                
                add("Backtrack Complete", `The recursive call for neighbor Node ${it} has completely finished (it hit a dead end). The stack frame for Node ${it} is popped off. We now mathematically 'backtrack' to our current Node ${node}, un-pausing our 'for' loop so we can check if it has any other neighbors left.`, 11, { phase: 'backtrack', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node, checkNode: it });
            } else {
                add("Neighbor Visited (Skip)", `We examine neighbor Node ${it}, but our 'vis' array says it's 'true'. We have already explored this node from another path! We completely ignore it and move on to the next iteration of the loop. If we didn't do this, we would bounce between nodes endlessly in a cycle.`, 9, { phase: 'adj_visited', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: node, checkNode: it, skipNode: it });
            }
        }

        callStack.pop();
        add("Exit DFS Frame", `The 'for' loop has exhausted all neighbors for Node ${node}. There is nowhere left to go from here! We have hit a dead end. We finish the function, automatically popping this frame off the Call Stack and returning control to whoever called us (our parent node).`, 13, { phase: 'exit_dfs', vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack), activeNode: parent !== undefined ? parent : null });
    };

    dfs(0);

    add("Return Result", `The initial dfs(0) call has returned! The Call Stack is completely empty, meaning we have successfully explored every single reachable node. We return the final 'ls' array representing our complete DFS traversal.`, 24, { phase: 'done', isSuccess: true, finalAns: ls, vis: clone1D(vis), ls: clone1D(ls), callStack: clone1D(callStack) });

    return steps;
  }, [baseAdj, selectedOpId]);

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
    selectedOp && navigator.clipboard.writeText(selectedOp.code);
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
      if (st.adj === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100` : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-${themeColor}-600`}>
                          <Trophy size={16}/> 
                          DFS Traversal Sequence
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-${themeColor}-700 bg-${themeColor}-100 border-${themeColor}-400 break-all`}>
                          [{st.finalAns.join(', ')}]
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Active Frame</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'enter_dfs' || st.phase === 'exit_dfs' || st.phase === 'backtrack' ? `bg-${themeColor}-100 border-${themeColor}-400 text-${themeColor}-800 scale-110 shadow-lg` : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeNode !== undefined && st.activeNode !== null ? st.activeNode : '-'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Checking Neighbor</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('check_') || st.phase.startsWith('adj_') || st.phase === 'call_dfs_inner' ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.checkNode !== undefined ? st.checkNode : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Layers size={12}/> Stack Depth</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'enter_dfs' || st.phase === 'exit_dfs' ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-sm animate-in zoom-in scale-110' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.callStack !== undefined ? st.callStack.length : '0'}
                          </div>
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.adj === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeRadius = 24;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: Visualizer Area */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '750px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-full h-full overflow-visible flex flex-col md:flex-row items-center md:items-start justify-center md:justify-around p-8 gap-8">
                          
                          {/* --- LEFT: GRAPH RENDERER --- */}
                          <div className="relative w-full md:w-1/2 h-[450px] flex justify-center mt-12">
                              {/* Draw Edges */}
                              <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10 pointer-events-none" style={{ transform: 'translateX(50%)' }}>
                                  <defs>
                                      <marker id="arrowheadGraph" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
                                          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                                      </marker>
                                      <marker id="arrowheadActive" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
                                          <polygon points="0 0, 8 3, 0 6" fill="#d946ef" />
                                      </marker>
                                      <marker id="arrowheadFail" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
                                          <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
                                      </marker>
                                  </defs>
                                  
                                  {st.adj.map((neighbors: number[], fromNode: number) => {
                                      return neighbors.map((toNode: number) => {
                                          let isChecking = st.activeNode === fromNode && st.checkNode === toNode;
                                          let isSkipping = isChecking && st.skipNode === toNode;
                                          let isPlunging = isChecking && (st.phase === 'adj_unvisited' || st.phase === 'call_dfs_inner');
                                          
                                          let strokeCol = "#cbd5e1"; // default slate-300
                                          let strokeW = "2";
                                          let marker = "url(#arrowheadGraph)";
                                          let dash = "none";

                                          if (isChecking && !isSkipping) {
                                              strokeCol = "#d946ef"; // fuchsia-500
                                              strokeW = "4";
                                              marker = "url(#arrowheadActive)";
                                          } else if (isSkipping) {
                                              strokeCol = "#f43f5e"; // rose-500
                                              strokeW = "4";
                                              marker = "url(#arrowheadFail)";
                                              dash = "4 4";
                                          }

                                          return (
                                              <line 
                                                  key={`e-${fromNode}-${toNode}`}
                                                  x1={nodePositions[fromNode].x} 
                                                  y1={nodePositions[fromNode].y} 
                                                  x2={nodePositions[toNode].x} 
                                                  y2={nodePositions[toNode].y} 
                                                  stroke={strokeCol} 
                                                  strokeWidth={strokeW} 
                                                  strokeDasharray={dash}
                                                  markerEnd={marker}
                                                  className={`transition-all duration-300 ${isPlunging ? 'animate-pulse' : ''}`}
                                              />
                                          )
                                      });
                                  })}
                                  
                                  {/* Animated plunging dot along active edge */}
                                  {(st.phase === 'adj_unvisited' || st.phase === 'call_dfs_inner') && st.activeNode !== undefined && st.checkNode !== undefined && (
                                      <circle r="6" fill="#d946ef" className="animate-[moveDot_0.6s_ease-in-out_forwards]">
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

                              {/* Draw Nodes */}
                              {nodePositions.map((pos, idx) => {
                                  let isActive = st.activeNode === idx;
                                  let isChecking = st.checkNode === idx;
                                  let isVisited = st.vis && st.vis[idx];
                                  let isNewlyVisited = st.hlNode === idx;
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500";
                                  let scaleClass = "scale-100";

                                  if (isNewlyVisited) {
                                      bgClass = "bg-emerald-400 border-emerald-600 text-white shadow-xl ring-4 ring-emerald-200 z-40 animate-in zoom-in";
                                      scaleClass = "scale-125";
                                  } else if (isActive) {
                                      bgClass = `bg-${themeColor}-500 border-${themeColor}-700 text-white shadow-xl ring-4 ring-${themeColor}-200 z-40`;
                                      scaleClass = "scale-125";
                                  } else if (isChecking) {
                                      bgClass = "bg-sky-400 border-sky-600 text-white shadow-xl ring-4 ring-sky-200 z-30";
                                      scaleClass = "scale-125";
                                  } else if (isVisited) {
                                      bgClass = "bg-slate-700 border-slate-800 text-white shadow-md z-20";
                                  }

                                  return (
                                      <div 
                                          key={`n-${idx}`} 
                                          className={`absolute flex items-center justify-center font-mono font-black text-xl rounded-full border-[3px] transition-all duration-500 ${scaleClass} ${bgClass}`}
                                          style={{ 
                                              left: `calc(50% + ${pos.x}px)`, 
                                              top: `${pos.y}px`, 
                                              width: `${nodeRadius*2}px`, 
                                              height: `${nodeRadius*2}px`,
                                              transform: 'translate(-50%, -50%)'
                                          }}
                                      >
                                          {/* Ripple Animation for Active Node */}
                                          {isActive && !st.isSuccess && (
                                              <>
                                                  <div className={`absolute w-[80px] h-[80px] bg-${themeColor}-400 rounded-full animate-ping opacity-20 pointer-events-none`}></div>
                                                  <div className={`absolute w-[120px] h-[120px] border-4 border-${themeColor}-300 rounded-full animate-ping opacity-20 pointer-events-none`} style={{ animationDelay: '200ms'}}></div>
                                              </>
                                          )}

                                          {idx}
                                          {isChecking && st.skipNode === idx && (
                                              <XCircle size={32} className="absolute text-rose-500 -right-4 -top-4 bg-white rounded-full animate-in zoom-in"/>
                                          )}
                                      </div>
                                  )
                              })}
                          </div>

                          {/* --- RIGHT: DATA STRUCTURES --- */}
                          <div className="w-full md:w-1/2 flex flex-col gap-10 mt-8 md:mt-16 z-20 items-center">
                              
                              {/* 1. Call Stack */}
                              <div className="flex flex-col items-center w-full max-w-md">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 bg-${themeColor}-50 px-3 py-1 rounded-lg border border-${themeColor}-200 mb-2 shadow-sm flex items-center gap-2`}><ArrowUp size={12}/> Call Stack (LIFO)</span>
                                  <div className="flex w-full h-16 bg-slate-100 rounded-2xl border-2 border-slate-300 shadow-inner items-center px-4 gap-2 overflow-x-hidden relative flex-row-reverse">
                                      <div className="absolute right-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">TOP</div>
                                      <div className="absolute left-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">BOTTOM</div>
                                      
                                      <div className="flex flex-row-reverse gap-2 mx-auto transition-all duration-500">
                                          {(st.callStack || []).map((val: number, i: number) => {
                                              let isTop = i === st.callStack.length - 1;
                                              let isEntering = st.phase === 'enter_dfs' && isTop;
                                              
                                              return (
                                                  <div key={`stack-${i}-${val}`} className={`w-10 h-10 flex items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-md transition-all duration-500 ${isEntering ? `bg-${themeColor}-400 border-${themeColor}-500 animate-in slide-in-from-top-8 scale-110` : isTop ? `bg-${themeColor}-500 border-${themeColor}-600` : 'bg-slate-500 border-slate-600'}`}>
                                                      {val}
                                                  </div>
                                              )
                                          })}
                                          {st.callStack && st.callStack.length === 0 && <span className="text-slate-300 font-mono italic text-sm my-auto text-center w-full">Stack is empty</span>}
                                      </div>
                                  </div>
                              </div>

                              {/* 2. Visited Array */}
                              <div className="flex flex-col items-center w-full max-w-md">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><CheckCircle2 size={12}/> vis[] (Visited Array)</span>
                                  <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                      {(st.vis || []).map((val: boolean, idx: number) => {
                                          let isNewlyMarked = st.phase === 'mark_vis' && st.hlNode === idx;
                                          let isChecking = st.checkNode === idx;

                                          let boxBg = val ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-300 border-slate-200";
                                          if (isNewlyMarked) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-200 animate-in zoom-in";
                                          else if (isChecking) boxBg = "bg-sky-100 text-sky-800 border-sky-400 scale-110 ring-2 ring-sky-200 shadow-md";

                                          return (
                                              <div key={`vis-${idx}`} className="flex flex-col items-center">
                                                  <span className={`text-[8px] font-mono font-bold mb-0.5 ${isChecking ? 'text-sky-500' : 'text-slate-400'}`}>{idx}</span>
                                                  <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                                      {val ? 'T' : 'F'}
                                                  </div>
                                              </div>
                                          )
                                      })}
                                  </div>
                              </div>

                              {/* 3. DFS Result List */}
                              <div className="flex flex-col items-center w-full max-w-md">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> ls (Result Sequence)</span>
                                  <div className="flex flex-wrap justify-start w-full min-h-[60px] p-3 bg-white rounded-2xl border border-slate-200 shadow-md gap-2">
                                      {(st.ls || []).map((val: number, idx: number) => {
                                          let isNew = st.phase === 'add_ls' && idx === st.ls.length - 1;
                                          return (
                                              <div key={`ls-${idx}`} className={`w-10 h-10 flex items-center justify-center font-mono font-black text-lg text-emerald-900 rounded-lg border-2 border-emerald-400 shadow-sm transition-all duration-500 ${isNew ? 'bg-emerald-400 text-white scale-110 animate-in zoom-in' : 'bg-emerald-50'}`}>
                                                  {val}
                                              </div>
                                          )
                                      })}
                                      {st.ls && st.ls.length === 0 && <span className="text-slate-300 font-mono italic text-sm my-auto w-full text-center">List is empty</span>}
                                  </div>
                              </div>

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
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <ArrowDownToLine className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Traversal Algorithm
                  </span>
                  <span>•</span>
                  <span>Stack Based</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><ArrowDownToLine size={28}/> Plunging into the Depths</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a directed or undirected graph represented by an adjacency list <code>adj</code>, where <code>adj[i]</code> contains a list of all vertices adjacent to vertex <code>i</code>.</p>
                        <p>Perform a <strong>Depth-First Traversal (DFS)</strong> starting from vertex <code>0</code> and return the sequence of visited nodes.</p>
                        <p className="italic">Note: A DFS explores as far as possible along each branch before backtracking.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> V = 5, adj = [[1,2,3], [0], [0,4], [0], [2]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[0, 1, 2, 4, 3]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Start at 0. Neighbors are 1, 2, 3.<br/>Plunge into 1. No unvisited neighbors. Backtrack to 0.<br/>Plunge into 2. Neighbor 4 is unvisited. Plunge into 4. Backtrack to 2. Backtrack to 0.<br/>Plunge into 3.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= V &lt;= 10^4 (Number of vertices)</li>
                            <li>0 &lt;= E &lt;= 10^4 (Number of edges)</li>
                        </ul>
                    </div>
                </section>
                
                {/* Custom SVG Graphical Representation of BFS vs DFS */}
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Visualizing Traversal Paradigms</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 opacity-70">
                            <span className="text-sky-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><RadioReceiver size={16}/> BFS: Concentric Ripples</span>
                            <svg width="200" height="200" viewBox="0 0 200 200">
                                {/* Levels */}
                                <circle cx="100" cy="100" r="30" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="100" cy="100" r="60" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="100" cy="100" r="90" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4 4" />
                                {/* Center Node */}
                                <circle cx="100" cy="100" r="10" fill="#0ea5e9" />
                                {/* Nodes Level 1 */}
                                <circle cx="100" cy="70" r="8" fill="#38bdf8" />
                                <circle cx="74" cy="115" r="8" fill="#38bdf8" />
                                <circle cx="126" cy="115" r="8" fill="#38bdf8" />
                                {/* Nodes Level 2 */}
                                <circle cx="100" cy="40" r="6" fill="#7dd3fc" />
                                <circle cx="48" cy="130" r="6" fill="#7dd3fc" />
                                <circle cx="152" cy="130" r="6" fill="#7dd3fc" />
                                {/* Arrows */}
                                <path d="M 100 90 L 100 78" stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                                <path d="M 91 105 L 82 110" stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                                <path d="M 109 105 L 118 110" stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                            </svg>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4">
                            <span className={`text-${themeColor}-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2`}><ArrowDown size={16}/> DFS: Deep Plunge</span>
                            <svg width="200" height="200" viewBox="0 0 200 200">
                                {/* Center Node */}
                                <circle cx="100" cy="20" r="10" fill="#d946ef" />
                                {/* Deep Path */}
                                <circle cx="100" cy="60" r="8" fill="#e879f9" />
                                <circle cx="100" cy="100" r="8" fill="#e879f9" />
                                <circle cx="100" cy="140" r="8" fill="#e879f9" />
                                <circle cx="100" cy="180" r="8" fill="#e879f9" />
                                {/* Arrows */}
                                <path d="M 100 30 L 100 52" stroke="#d946ef" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                                <path d="M 100 68 L 100 92" stroke="#d946ef" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                                <path d="M 100 108 L 100 132" stroke="#d946ef" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                                <path d="M 100 148 L 100 172" stroke="#d946ef" strokeWidth="2" markerEnd="url(#arrowheadActive)"/>
                            </svg>
                        </div>
                    </div>
                </section>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner col-span-1">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Layers size={16} className={`text-${themeColor}-500`}/> The Stack (LIFO)</h4>
                        <p className="text-sm leading-relaxed">While BFS uses a Queue to wait, DFS uses the system's Call Stack (or an explicit Stack) to push deep into the graph. By recursively calling <code>dfs()</code> on an unvisited neighbor immediately, we pause the current node's loop and prioritize the newest path. This is a Last-In, First-Out (LIFO) behavior.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner col-span-1">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><RotateCcw size={16} className={`text-amber-500`}/> Backtracking</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The beauty of recursion is that the Call Stack inherently "remembers" where we left off. When a path hits a dead end (no unvisited neighbors), the function returns, popping off the stack, and we automatically resume the <code>for</code> loop of the previous node to check alternative paths.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner col-span-1">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><CheckCircle2 size={16} className={`text-emerald-500`}/> The Visited Array</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Just like BFS, the <code>boolean[] vis</code> array acts as our memory to prevent infinite loops in cyclic graphs. We mark a node as visited the moment we enter its DFS frame. This effectively blocks any other branch from plunging into a node we are already exploring.</p>
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
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency List (Use | to separate nodes 0 to V-1)</label>
                            <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="1, 2, 3 | 0, 4, 5 | 0, 6 | ..." />
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
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-${themeColor}-400`}>
                                <PartyPopper size={24}/> TRAVERSAL COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully visited all reachable nodes.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.startsWith('adj_') || st.phase === 'add_ls' ? 'text-emerald-400' : (st.phase === 'backtrack' || st.phase === 'exit_dfs' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> Dynamic Graph Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-fuchsia-100 text-fuchsia-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">A deep dive into why DFS uses a Stack to plunge deep into graphs, and a strict line-by-line code explanation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Element 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className={`text-${themeColor}-500`}/> Why use a Stack (Recursion)?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">DFS aims to reach the furthest depths of a graph before exploring alternatives. A LIFO (Last-In, First-Out) Stack inherently supports this behavior. When we recursively call <code>dfs(neighbor)</code>, the computer places the current state onto the Call Stack and immediately begins processing the neighbor. The most recently discovered path is always evaluated first.</p>
                    </div>

                    {/* Element 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><RotateCcw size={24} className="text-amber-500"/> Backtracking mechanics</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">What happens when a node has no unvisited neighbors? The recursive function simply returns. This pops the current node off the Call Stack, and the program resumes execution in the exact <code>for</code> loop iteration of its parent node. This seamless unwinding allows DFS to backtrack perfectly without requiring explicit code to trace back its steps.</p>
                    </div>

                    {/* Element 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>Every vertex $V$ has its <code>dfs()</code> function called exactly once (protected by the <code>vis</code> array). While inside that call, we iterate over its neighbors. The sum of all neighbor checks is equal to the total number of edges $E$. Therefore, time scales linearly with the graph size.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The Visited array takes $O(V)$ space. The critical factor is the Call Stack. In the worst-case scenario (a straight line graph like a Linked List), the recursion plunges $V$ levels deep before returning, consuming $O(V)$ stack space. If the graph is exceptionally large, this can trigger a <code>StackOverflowError</code>.</p>
                    </div>

                    {/* Code Explanation */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl transition-shadow text-slate-300">
                        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><FileText size={24} className={`text-${themeColor}-400`}/> Line-by-Line Code Explanation</h4>
                        <div className="space-y-5 text-sm font-mono leading-relaxed">
                            <p><strong className="text-sky-400">Line 15-17:</strong> <code>public ArrayList...</code><br/>We define the main function and initialize the <code>vis</code> array (to prevent infinite cycles) and the <code>ls</code> list (to store the final DFS traversal sequence).</p>
                            
                            <p><strong className="text-sky-400">Line 20:</strong> <code>vis[0] = true;</code><br/>We explicitly mark the starting node (0) as visited <em>before</em> we trigger the DFS so that we don't accidentally backtrack into it.</p>
                            
                            <p><strong className="text-sky-400">Line 21:</strong> <code>dfs(0, vis, adj, ls);</code><br/>We launch the initial recursive call stack frame from Node 0.</p>

                            <p><strong className="text-emerald-400">Line 2:</strong> <code>public static void dfs(...)</code><br/>The active DFS frame receives the current <code>node</code>. The system pushes this function call to the top of the Call Stack.</p>
                            
                            <p><strong className="text-emerald-400">Line 4-5:</strong> <code>vis[node] = true; ls.add(node);</code><br/>The very first thing we do inside a new frame is lock the node by marking it visited, and record it to our sequence output list.</p>

                            <p><strong className="text-amber-400">Line 8:</strong> <code>for (Integer it : adj.get(node))</code><br/>We fetch the adjacency list for the current node and begin iterating through all of its direct neighbors.</p>

                            <p><strong className="text-amber-400">Line 9:</strong> <code>if (!vis[it])</code><br/>Crucial cycle check! If the neighbor <code>it</code> is already visited, we skip it. If it is unvisited, we proceed inside the block.</p>

                            <p><strong className="text-rose-400">Line 10:</strong> <code>dfs(it, vis, adj, ls);</code><br/><strong>THE PLUNGE.</strong> We pause the current <code>for</code> loop and immediately make a recursive call, pushing the neighbor <code>it</code> onto the Call Stack. This is what gives DFS its "depth" property!</p>

                            <p><strong className="text-fuchsia-400">Line 11-13:</strong> <code>&#125;</code><br/>The end of the <code>dfs</code> method. When all neighbors have been checked, the function completes. The system pops this frame off the Call Stack, inherently <strong>backtracking</strong> to the previous node's paused <code>for</code> loop!</p>

                            <p><strong className="text-sky-400">Line 23:</strong> <code>return ls;</code><br/>Once the Call Stack is completely empty, the main function regains control and returns the fully populated <code>ls</code> list.</p>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"DFS is heavily tested in grid matrix problems (like Islands or Word Search) and tree structures. Interviewers look for clean recursive logic and awareness of Call Stack limitations."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "How would you rewrite this iteratively if the graph had 1,000,000 nodes and recursion caused a StackOverflow?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "I would use an explicit Stack data structure."</p>
                            <p>Instead of relying on the system's recursive call stack, I would initialize a <code>Stack&lt;Integer&gt;</code>. I'd push the starting node, and then run a <code>while(!stack.isEmpty())</code> loop. Inside, I pop the top node, process it, and push all its unvisited neighbors onto the stack. This simulates DFS but relies on Heap memory, avoiding the shallow Call Stack limit."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Route size={24}/></span>
                            <span>Q2: "Can we use DFS to find the Shortest Path?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it is highly inefficient for shortest paths."</p>
                            <p>Because DFS plunges as deep as possible, the first path it finds between Node A and Node B might be a massively winding detour of 100 edges, even if a direct 1-edge connection existed on an alternative branch. To guarantee a shortest path, BFS must be used because it processes level-by-level."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-fuchsia-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-fuchsia-500 mt-0.5"><Network size={24}/></span>
                            <span>Q3: "How is DFS used in Topological Sorting?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "By recording nodes when they finish exploring (exit their DFS frame)."</p>
                            <p>In Kahn's BFS we use Indegrees. But with DFS, we simply run standard DFS. The magic trick is adding a Stack. After the <code>for</code> loop over all neighbors finishes (meaning the node is a dead end or fully explored), we <code>stack.push(node)</code>. Once all nodes are processed, popping elements off the stack yields a perfect valid Topological Sort order."</p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q4: "If you used an Adjacency Matrix instead of an Adjacency List, what is the new time complexity?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It degrades to O(V^2)."</p>
                            <p>With an Adjacency List, finding the neighbors of a node takes time proportional to its degree. Summing all degrees yields $O(E)$. But with an Adjacency Matrix <code>int[][] mat</code>, to find the neighbors of Node $U$, we MUST scan the entire row <code>mat[U][0...V-1]</code>. This takes $O(V)$ time per node. For $V$ nodes, the total time becomes strictly $O(V^2)$, regardless of how few edges exist."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.startsWith('adj_') || st.phase === 'add_ls' ? 'text-emerald-400' : (st.phase === 'backtrack' || st.phase === 'exit_dfs' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-${themeColor}-600 text-white shadow-md`}>
                              {selectedOp.icon} <span>{selectedOp.title}</span>
                          </button>
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Adjacency List (Use | to separate rows)</label>
                              <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="1, 2, 3 | 0, 4, 5 | 0, 6 | ..." />
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
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(217,70,239,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-${themeColor}-500/10`}><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Successfully visited all reachable nodes</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Traversal Sequence</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center gap-2 break-all">[{st.finalAns.join(', ')}]</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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
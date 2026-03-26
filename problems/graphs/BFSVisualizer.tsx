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
  standardBFS: {
    id: 'standardBFS',
    title: 'Breadth-First Search (BFS)',
    icon: <Network size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'sky',
    code: `class Solution {
    // Function to return Breadth First Traversal of given graph.
    public ArrayList<Integer> bfsOfGraph(int V, ArrayList<ArrayList<Integer>> adj) {
        ArrayList<Integer> bfs = new ArrayList<>();
        boolean vis[] = new boolean[V];
        Queue<Integer> q = new LinkedList<>();
        
        q.add(0); // Assuming 0-indexed graph
        vis[0] = true;
        
        while (!q.isEmpty()) {
            Integer node = q.poll();
            bfs.add(node);
            
            // Get all adjacent vertices. If unvisited, mark and enqueue.
            for (Integer it : adj.get(node)) {
                if (!vis[it]) {
                    vis[it] = true;
                    q.add(it);
                }
            }
        }
        return bfs;
    }
}`,
    desc: "Breadth-First Search (BFS): A fundamental graph traversal algorithm. It explores the graph layer by layer, radiating outward from the source node. It uses a Queue (FIFO) to keep track of the exploration frontier and a Visited Array to prevent infinite loops in cyclic graphs. It guarantees that nodes are visited in increasing order of their shortest path distance (number of edges) from the source node."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|ArrayList|LinkedList|Queue|Integer|bfsOfGraph|adj|bfs|vis|q|node|it|add|poll|isEmpty|get|V)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'ArrayList', 'LinkedList', 'Queue'].includes(part);
            const isPointer = ['adj', 'bfs', 'vis', 'q', 'node', 'it', 'V'].includes(part);
            const isMapCall = ['bfsOfGraph', 'add', 'poll', 'isEmpty', 'get'].includes(part);
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

export default function BFSVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('standardBFS');
  
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

    add("Function Call", `public ArrayList<Integer> bfsOfGraph(int V=${V}, ArrayList<ArrayList<Integer>> adj)`, 3, { phase: 'init' });

    let bfs: number[] = [];
    let vis: boolean[] = new Array(V).fill(false);
    let q: number[] = [];

    add("Initialize Structures", `ArrayList<Integer> bfs = new ArrayList<>();\nboolean vis[] = new boolean[V];\nQueue<Integer> q = new LinkedList<>();\nAllocating BFS result list, Visited array of size ${V}, and a FIFO Queue.`, 6, { phase: 'init_ds', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q) });

    if (V === 0) return steps;

    q.push(0);
    add("Enqueue Source", `q.add(0);\nStarting from node 0. It forms Level 0 (the epicenter). Pushing 0 to Queue.`, 8, { phase: 'enqueue_src', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), hlNode: 0 });

    vis[0] = true;
    add("Mark Visited", `vis[0] = true;\nImmediately marking node 0 as visited so we don't accidentally process it again.`, 9, { phase: 'mark_src', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), hlNode: 0 });

    while (q.length > 0) {
        add("Queue Check", `while (!q.isEmpty()) { ... }\nQueue has ${q.length} elements. Continuing traversal.`, 11, { phase: 'while_check', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q) });
        
        let node = q.shift();
        add("Dequeue Node", `Integer node = q.poll();\nPopping the front of the queue: Node ${node}.`, 12, { phase: 'dequeue', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node });

        if (node !== undefined) {
            bfs.push(node);
            add("Add to BFS Result", `bfs.add(node);\nOfficially recording Node ${node} into our final breadth-first traversal list.`, 13, { phase: 'add_res', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node });

            let neighbors = adj[node] || [];
            for (let i = 0; i < neighbors.length; i++) {
                let it = neighbors[i];
                add("Check Neighbor", `for (Integer it : adj.get(node)) { ... }\nChecking adjacent neighbor Node ${it} of active Node ${node}.`, 16, { phase: 'check_adj', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node, checkNode: it });

                if (!vis[it]) {
                    add("Neighbor Unvisited", `if (!vis[it]) { ... }\nNode ${it} has NOT been visited yet. It belongs to the next expansion level!`, 17, { phase: 'adj_unvisited', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node, checkNode: it });
                    
                    vis[it] = true;
                    add("Mark Neighbor Visited", `vis[it] = true;\nMarking Node ${it} as visited instantly to prevent duplicate queue entries.`, 18, { phase: 'adj_mark', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node, checkNode: it, hlNode: it });
                    
                    q.push(it);
                    add("Enqueue Neighbor", `q.add(it);\nPushing Node ${it} to the back of the queue for later exploration.`, 19, { phase: 'adj_enqueue', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node, checkNode: it });
                } else {
                    add("Neighbor Visited (Skip)", `if (!vis[it]) is false.\nNode ${it} was already visited! Skipping to avoid infinite cycle loops.`, 17, { phase: 'adj_visited', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q), activeNode: node, checkNode: it, skipNode: it });
                }
            }
        }
    }

    add("Queue Empty", `while (!q.isEmpty()) { ... }\nQueue is completely empty! All reachable components have been exhausted.`, 11, { phase: 'while_empty', bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q) });
    add("Return Result", `return bfs;\nReturning the final BFS traversal array.`, 24, { phase: 'done', isSuccess: true, finalAns: bfs, bfs: clone1D(bfs), vis: clone1D(vis), q: clone1D(q) });

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
      if (st.adj === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-sky-400 ring-4 ring-sky-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-sky-600`}>
                          <Trophy size={16}/> 
                          BFS Traversal Sequence
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-sky-700 bg-sky-100 border-sky-400 break-all`}>
                          [{st.finalAns.join(', ')}]
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Queue Front (Poll)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'dequeue' || st.phase === 'add_res' ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeNode !== undefined ? st.activeNode : '-'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Checking Neighbor</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('check_') || st.phase.startsWith('adj_') ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.checkNode !== undefined ? st.checkNode : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Queue Size</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'enqueue_src' || st.phase === 'adj_enqueue' || st.phase === 'dequeue' ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-sm animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.q !== undefined ? st.q.length : '0'}
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
                                          <polygon points="0 0, 8 3, 0 6" fill="#0ea5e9" />
                                      </marker>
                                      <marker id="arrowheadFail" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
                                          <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
                                      </marker>
                                  </defs>
                                  
                                  {st.adj.map((neighbors: number[], fromNode: number) => {
                                      return neighbors.map((toNode: number) => {
                                          let isChecking = st.activeNode === fromNode && st.checkNode === toNode;
                                          let isSkipping = isChecking && st.skipNode === toNode;
                                          
                                          let strokeCol = "#cbd5e1"; // default slate-300
                                          let strokeW = "2";
                                          let marker = "url(#arrowheadGraph)";
                                          let dash = "none";

                                          if (isChecking && !isSkipping) {
                                              strokeCol = "#0ea5e9"; // sky-500
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
                                                  className={`transition-all duration-300 ${isChecking ? 'animate-pulse' : ''}`}
                                              />
                                          )
                                      });
                                  })}
                                  
                                  {/* Animated traveling dot along active edge */}
                                  {st.phase === 'adj_enqueue' && st.activeNode !== undefined && st.checkNode !== undefined && (
                                      <circle r="6" fill="#10b981" className="animate-[moveDot_0.6s_ease-in-out_forwards]">
                                          <animateMotion 
                                              path={`M ${nodePositions[st.activeNode].x} ${nodePositions[st.activeNode].y} L ${nodePositions[st.checkNode].x} ${nodePositions[st.checkNode].y}`} 
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
                                      bgClass = "bg-amber-400 border-amber-600 text-white shadow-xl ring-4 ring-amber-200 z-40";
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
                                                  <div className="absolute w-[80px] h-[80px] bg-amber-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
                                                  <div className="absolute w-[120px] h-[120px] border-4 border-amber-300 rounded-full animate-ping opacity-20 pointer-events-none" style={{ animationDelay: '200ms'}}></div>
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
                              
                              {/* 1. Queue */}
                              <div className="flex flex-col items-center w-full max-w-md">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2"><ArrowRight size={12}/> Queue (FIFO)</span>
                                  <div className="flex w-full h-16 bg-slate-100 rounded-2xl border-2 border-slate-300 shadow-inner items-center px-4 gap-2 overflow-x-hidden relative">
                                      <div className="absolute left-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">OUT</div>
                                      <div className="absolute right-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">IN</div>
                                      
                                      <div className="flex gap-2 mx-auto transition-all duration-500">
                                          {(st.q || []).map((val: number, i: number) => {
                                              let isEntering = st.phase === 'adj_enqueue' && i === st.q.length - 1;
                                              
                                              return (
                                                  <div key={`q-${i}-${val}`} className={`w-10 h-10 flex items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-md transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8' : 'bg-fuchsia-500 border-fuchsia-600'}`}>
                                                      {val}
                                                  </div>
                                              )
                                          })}
                                          {st.q && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm my-auto">Queue is empty</span>}
                                      </div>
                                  </div>
                              </div>

                              {/* 2. Visited Array */}
                              <div className="flex flex-col items-center w-full max-w-md">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><CheckCircle2 size={12}/> vis[] (Visited Array)</span>
                                  <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                      {(st.vis || []).map((val: boolean, idx: number) => {
                                          let isNewlyMarked = (st.phase === 'mark_src' || st.phase === 'adj_mark') && st.hlNode === idx;
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

                              {/* 3. BFS Result List */}
                              <div className="flex flex-col items-center w-full max-w-md">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> bfs (Result Sequence)</span>
                                  <div className="flex flex-wrap justify-start w-full min-h-[60px] p-3 bg-white rounded-2xl border border-slate-200 shadow-md gap-2">
                                      {(st.bfs || []).map((val: number, idx: number) => {
                                          let isNew = st.phase === 'add_res' && idx === st.bfs.length - 1;
                                          return (
                                              <div key={`bfs-${idx}`} className={`w-10 h-10 flex items-center justify-center font-mono font-black text-lg text-emerald-900 rounded-lg border-2 border-emerald-400 shadow-sm transition-all duration-500 ${isNew ? 'bg-emerald-400 text-white scale-110 animate-in zoom-in' : 'bg-emerald-50'}`}>
                                                  {val}
                                              </div>
                                          )
                                      })}
                                      {st.bfs && st.bfs.length === 0 && <span className="text-slate-300 font-mono italic text-sm my-auto w-full text-center">List is empty</span>}
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
                <RadioReceiver className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Traversal Algorithm
                  </span>
                  <span>•</span>
                  <span>Queue Based</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><RadioReceiver size={28}/> Exploring the Frontier</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a directed or undirected graph represented by an adjacency list <code>adj</code>, where <code>adj[i]</code> contains a list of all vertices adjacent to vertex <code>i</code>.</p>
                        <p>Perform a <strong>Breadth-First Traversal (BFS)</strong> starting from vertex <code>0</code> and return the sequence of visited nodes.</p>
                        <p className="italic">Note: A BFS explores nodes level by level, moving outwards like ripples in a pond.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> V = 5, adj = [[1,2,3], [0], [0,4], [0], [2]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[0, 1, 2, 3, 4]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Start at 0. Neighbors of 0 are 1, 2, 3.<br/>Queue becomes [1, 2, 3].<br/>Pop 1 (no unvisited neighbors). Pop 2 (neighbor 4 is unvisited, enqueue 4). Pop 3. Pop 4.</span>
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
                        <div className="flex flex-col items-center gap-4">
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
                        <div className="flex flex-col items-center gap-4 opacity-70">
                            <span className="text-fuchsia-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowDown size={16}/> DFS: Deep Plunge</span>
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
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Network size={16} className="text-sky-500"/> The Queue (FIFO)</h4>
                        <p className="text-sm leading-relaxed">Unlike DFS which dives deep using recursion (a Stack), BFS uses a Queue (First-In, First-Out). When we process a node, we push all its unvisited neighbors to the BACK of the queue. This mathematically guarantees that we will process all nodes at distance $d$ before processing ANY node at distance $d+1$.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner col-span-1">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><CheckCircle2 size={16} className={`text-emerald-500`}/> The Visited Array</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Graphs can have cycles. Without tracking history, BFS would loop forever! The <code>boolean[] vis</code> array acts as our memory. Crucially, a node must be marked as visited the <strong>exact moment</strong> it is enqueued, NOT when it is dequeued, to prevent it from being enqueued multiple times.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner col-span-1">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Globe size={16} className={`text-amber-500`}/> Real-World Apps</h4>
                        <ul className="text-sm leading-relaxed text-slate-600 space-y-2 list-disc pl-4">
                            <li><strong>GPS Navigation:</strong> Finding shortest paths in unweighted maps.</li>
                            <li><strong>Social Networks:</strong> Finding "Friends of Friends" (degrees of separation).</li>
                            <li><strong>Web Crawlers:</strong> Google uses BFS to crawl the web layer by layer from root sites.</li>
                        </ul>
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                                <PartyPopper size={24}/> TRAVERSAL COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully visited all reachable nodes.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.startsWith('adj_') || st.phase === 'add_res' ? 'text-emerald-400' : (st.phase === 'dequeue' || st.phase === 'check_adj' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                    <div className="inline-flex items-center justify-center p-4 bg-sky-100 text-sky-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">A deep dive into why BFS is structured this way and how it guarantees optimal shortest paths.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Element 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> Why use a Queue?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">BFS explores a graph by moving outwards in concentric circles (levels). To achieve this, it must process all nodes at distance $d$ before touching any node at distance $d+1$. A FIFO (First-In, First-Out) Queue perfectly enforces this. Neighbors discovered later are pushed to the back, ensuring they wait their turn until the current level is fully exhausted.</p>
                    </div>

                    {/* Element 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><CheckCircle2 size={24} className="text-emerald-500"/> The exact timing of `vis[it] = true`</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A common bug is marking a node as visited when it is <em>popped</em> from the queue. This is disastrous! If multiple nodes in the current level share the same unvisited neighbor, they will all independently push that neighbor into the queue before it gets popped. We <strong>must</strong> mark a node visited the absolute instant it is pushed into the queue: <code>vis[it] = true; q.add(it);</code>.</p>
                    </div>

                    {/* Element 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-amber-500"/> Bipartite Graph Detection</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because BFS explores level-by-level, it's the perfect algorithm to check if a graph is Bipartite (2-colorable). You assign color 0 to the source, then color 1 to all its neighbors, then color 0 to their neighbors. If at any point during BFS you find a neighbor that is already visited AND has the same color as the current node, the graph is NOT bipartite (it contains an odd-length cycle)!</p>
                    </div>

                    {/* Element 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>Every vertex $V$ is pushed and popped from the queue exactly once. While processing a vertex, we iterate through its adjacency list. The sum of the lengths of all adjacency lists in a graph is exactly $2E$ (for undirected graphs) or $E$ (for directed graphs). Thus, total time strictly scales with the size of the graph structure.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The Visited array requires $O(V)$ space. In the worst-case scenario (e.g., a star graph where node 0 is connected to everything else), the Queue will hold $V - 1$ elements simultaneously. Thus, auxiliary space is bounded by $O(V)$.</p>
                    </div>

                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"BFS is the backbone of countless graph algorithms (Shortest Path, Cycle Detection, Kahn's Topological Sort). Interviewers will heavily test your understanding of its mechanics compared to DFS."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "How would you modify this code if the graph was disconnected?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "I would wrap the BFS logic in an outer loop."</p>
                            <p>The current code starts strictly at Node 0. If the graph is disconnected (e.g., nodes 4 and 5 form their own isolated island), Node 0 will never reach them. To traverse the entire disconnected graph, we need an outer loop: <code>for (int i = 0; i &lt; V; i++)</code>. If <code>!vis[i]</code>, we trigger the BFS starting from <code>i</code>. This ensures every component is visited."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Route size={24}/></span>
                            <span>Q2: "Why does BFS guarantee the shortest path in an unweighted graph?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because of the FIFO Queue."</p>
                            <p>BFS radiates outwards. It evaluates all paths of length 1, then all paths of length 2, and so on. If we reach a target node $T$ during our traversal, it is mathematically guaranteed that we arrived via the minimum number of edges. Any alternative path discovered later would inherently have a distance $\ge$ the current distance."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Wifi size={24}/></span>
                            <span>Q3: "What is Multi-Source BFS and when would you use it?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's BFS starting from multiple nodes simultaneously."</p>
                            <p>Instead of enqueuing just Node 0 at the start, we enqueue <em>multiple</em> starting nodes and mark them all as visited. The queue processes them layer by layer as usual, but the ripples expand from multiple epicenters at once. This is essential for problems like 'Rotten Oranges' or '01 Matrix' where we want to find the shortest distance to <em>any</em> of the source nodes simultaneously."</p>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-sky-900/40 border-sky-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.startsWith('adj_') || st.phase === 'add_res' ? 'text-emerald-400' : (st.phase === 'dequeue' || st.phase === 'check_adj' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-sky-500 shadow-[0_0_150px_rgba(14,165,233,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-sky-500`}></div>
                                
                                <div className="w-24 h-24 bg-sky-500/20 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-sky-500/10"><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className="text-sky-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully visited all reachable nodes</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-sky-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Traversal Sequence</div>
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
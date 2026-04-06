import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid as GridIcon, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox, Link, Truck, Clock, Repeat2, RefreshCcw
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  tarjanBridges: {
    id: 'tarjanBridges',
    title: "Bridges in Graph (Tarjan's)",
    icon: <Link size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V + E)',
    theme: 'indigo',
    code: `class Solution {
    private int timer = 1;
    private void dfs(int node, int parent, int[] vis, ArrayList<ArrayList<Integer>> adj, int tin[], int low[], List<List<Integer>> bridges) {
        vis[node] = 1;
        tin[node] = low[node] = timer;
        timer++;
        for(Integer it: adj.get(node)) {
            if(it == parent) continue;
            if(vis[it] == 0) {
                dfs(it, node, vis, adj, tin, low, bridges);
                low[node] = Math.min(low[node], low[it]);
                // node --- it
                if(low[it] > tin[node]) {
                    bridges.add(Arrays.asList(it, node));
                }
            }
            else {
                low[node] = Math.min(low[node], low[it]);
            }
        }
    }
    public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
        ArrayList<ArrayList<Integer>> adj = new ArrayList<ArrayList<Integer>>();
        for(int i = 0;i<n;i++) {
            adj.add(new ArrayList<Integer>());
        }
        for(List<Integer> it : connections) {
            int u = it.get(0); int v = it.get(1);
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        int[] vis = new int[n];
        int[] tin = new int[n];
        int[] low = new int[n];
        List<List<Integer>> bridges = new ArrayList<>();
        dfs(0, -1, vis, adj, tin, low, bridges);
        return bridges;
    }
}`,
    desc: "A Bridge (or Critical Connection) is an edge whose removal disconnects the graph. Tarjan's Algorithm elegantly finds them in a single DFS pass using timestamps! \n\n1. tin (Time In): The exact step the node was first reached.\n2. low (Lowest Time): The smallest 'tin' reachable from this node, including through back-edges.\n\nAs DFS explores, it sets tin = low = timer. If it finds a 'Back-Edge' (visiting an already seen neighbor that isn't the parent), it updates its 'low' time to mathematically represent that it can reach an earlier part of the graph! Upon returning from a child, it pulls the child's lowest time upwards. Finally, if the child's lowest reachable time is STRICTLY GREATER than the parent's insertion time (low[child] > tin[parent]), it proves the child has no back-edge to escape. That edge is a Bridge!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|Math|min|Arrays|asList|dfs|criticalConnections|ArrayList|List|Integer|connections|bridges|adj|vis|tin|low|timer|node|parent|it|n|u|v|add|get|continue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'Stack', 'ArrayList', 'List', 'Solution', 'Arrays'].includes(part);
            const isPointer = ['vis', 'adj', 'tin', 'low', 'timer', 'node', 'parent', 'it', 'n', 'u', 'v', 'bridges', 'connections'].includes(part);
            const isMapCall = ['dfs', 'criticalConnections', 'add', 'get', 'min', 'asList'].includes(part);
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

export default function TarjanBridgesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'tarjanBridges';
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const [nInput, setNInput] = useState('4');
  const [edgesInput, setEdgesInput] = useState('0,1 | 1,2 | 2,0 | 0,3');

  const [baseN, setBaseN] = useState(4);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0,1], [1,2], [2,0], [0,3]
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
      setNInput('4');
      setEdgesInput('0,1 | 1,2 | 2,0 | 0,3'); // Bridge is 0-3
  };

  const loadTestCase2 = () => {
      setNInput('5');
      setEdgesInput('0,1 | 1,2 | 2,0 | 1,3 | 3,4'); // Bridges are 1-3, 3-4
  };

  const loadTestCase3 = () => {
      setNInput('6');
      setEdgesInput('0,1 | 1,2 | 2,0 | 3,4 | 4,5 | 5,3 | 2,3'); // Two separate cycles joined by bridge 2-3
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0 || n > 15) n = 4;
        
        let rows = edgesInput.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if(cells.length === 2 && !isNaN(cells[0]) && !isNaN(cells[1])) {
                if (cells[0] >= 0 && cells[0] < n && cells[1] >= 0 && cells[1] < n) {
                    parsedEdges.push(cells);
                }
            }
        }
        
        setBaseN(n);
        setBaseEdges(parsedEdges);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, edgesInput]);

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

  const clone1D = (arr: number[]) => [...arr];

  // --- EXACT LINE-BY-LINE TRACE GENERATION (TARJAN'S BRIDGES) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const edges = baseEdges;
    
    if (n === 0) return steps;

    // Simulation Data Structures
    let adj: number[][] = [];
    let vis: number[] = Array(n).fill(0);
    let tin: number[] = Array(n).fill(0);
    let low: number[] = Array(n).fill(0);
    let bridgesFound: number[][] = [];
    let dfsTimer = 1;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { n, edges, adj: adj.map(a=>[...a]), vis: clone1D(vis), tin: clone1D(tin), low: clone1D(low), bridgesFound: bridgesFound.map(b=>[...b]), timer: dfsTimer, ...stateObj } 
    });

    const simulateDFS = (node: number, parent: number) => {
        vis[node] = 1;
        add("Visit Node", `vis[node] = 1;\nMarking node ${node} as visited.`, 4, { activeNode: node, parentNode: parent });
        
        tin[node] = low[node] = dfsTimer;
        let currentTimer = dfsTimer;
        add("Assign Timestamps", `tin[node] = low[node] = timer;\nNode ${node} receives insertion time ${currentTimer} and lowest reachable time ${currentTimer}.`, 5, { activeNode: node, parentNode: parent });
        
        dfsTimer++;
        add("Increment Timer", `timer++;\nGlobal timer ticks forward to ${dfsTimer}.`, 6, { activeNode: node, parentNode: parent });

        for (let i = 0; i < adj[node].length; i++) {
            let it = adj[node][i];
            add("Neighbor Loop", `for(Integer it: adj.get(node)) -> it=${it}\nEvaluating neighbor ${it} of node ${node}.`, 7, { activeNode: node, parentNode: parent, checkIt: it });
            
            add("Check Parent", `if(it == parent) continue;\nIs neighbor ${it} equal to the parent ${parent}?`, 8, { activeNode: node, parentNode: parent, checkIt: it });
            if (it === parent) {
                continue;
            }

            let isUnvisited = vis[it] === 0;
            add("Check Visited", `if(vis[it] == 0)\nIs neighbor ${it} completely unvisited? ${isUnvisited ? 'YES. Initiating DFS!' : 'NO. This is a Back-Edge!'}`, 9, { activeNode: node, parentNode: parent, checkIt: it, isUnvisited });

            if (isUnvisited) {
                add("Recursive DFS Call", `dfs(it, node, ...);\nRecursively diving into unvisited neighbor ${it}.`, 10, { activeNode: node, parentNode: parent, checkIt: it, targetNode: it });
                
                simulateDFS(it, node);
                
                add("Backtrack", `// Returned to dfs(${node}, ${parent})\nSuccessfully backtracked from neighbor ${it} to node ${node}.`, 10, { activeNode: node, parentNode: parent, checkIt: it });
                
                let oldLow = low[node];
                low[node] = Math.min(low[node], low[it]);
                add("Update Low Forward", `low[node] = Math.min(low[node], low[it]);\nRECORDING: Pulling lowest reachable time up from child! Node ${node}'s low becomes min(${oldLow}, ${low[it]}) = ${low[node]}.`, 11, { activeNode: node, parentNode: parent, checkIt: it });

                let isBridge = low[it] > tin[node];
                add("Check Bridge Condition", `if(low[it] > tin[node])\nCRITICAL MATH: Is child's lowest reachable time strictly greater than parent's insertion time? Is ${low[it]} > ${tin[node]}? ${isBridge ? 'YES! The child cannot reach back. It is a bridge!' : 'NO! The child has a back-edge to safety.'}`, 13, { activeNode: node, parentNode: parent, checkIt: it, isBridge });

                if (isBridge) {
                    bridgesFound.push([Math.min(node, it), Math.max(node, it)]);
                    add("Add Bridge", `bridges.add(Arrays.asList(it, node));\nRECORDING: Edge ${node}-${it} structurally disconnects the graph if removed. Bridge permanently registered!`, 14, { activeNode: node, parentNode: parent, checkIt: it, foundBridge: [Math.min(node, it), Math.max(node, it)] });
                }
            } else {
                add("Else Logic (Back-Edge)", `else {\nNeighbor ${it} is already visited and is NOT the parent. We found a BACK-EDGE!`, 17, { activeNode: node, parentNode: parent, checkIt: it, isBackEdge: true });
                
                let oldLow = low[node];
                low[node] = Math.min(low[node], low[it]);
                add("Update Low Back-Edge", `low[node] = Math.min(low[node], low[it]);\nRECORDING: Using the back-edge to escape! Node ${node}'s low becomes min(${oldLow}, ${low[it]}) = ${low[node]}.`, 18, { activeNode: node, parentNode: parent, checkIt: it, isBackEdge: true });
            }
        }
    };

    add("Init Function", `public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections)\nInitiating Tarjan's Algorithm to locate Critical Connections.`, 22, { phase: 'init' });
    
    add("Init Adjacency List", `ArrayList<ArrayList<Integer>> adj = new ArrayList<ArrayList<Integer>>();\nPreparing to build the graph mathematically.`, 23, { phase: 'init_adj' });

    for(let i=0; i<n; i++) {
        add("Init Adj Loop", `for(int i = 0;i<n;i++) -> i=${i}`, 24, { phase: 'init_adj_loop', i });
        adj.push([]);
        add("Add Empty List", `adj.add(new ArrayList<Integer>());\nAllocated empty adjacency list for node ${i}.`, 25, { phase: 'init_adj_add', i });
    }

    add("Edges Loop", `for(List<Integer> it : connections)\nIterating over inputs to populate undirected edges.`, 27, { phase: 'loop_edges_start' });

    for (let e of edges) {
        let u = e[0], v = e[1];
        add("Extract Edge", `int u = it.get(0); int v = it.get(1); // u=${u}, v=${v}`, 28, { phase: 'edge_ext', u, v });
        adj[u].push(v);
        add("Add U to V", `adj.get(u).add(v);`, 29, { phase: 'edge_add1', u, v });
        adj[v].push(u);
        add("Add V to U", `adj.get(v).add(u);\nSuccessfully bounded undirected edge between ${u} and ${v}.`, 30, { phase: 'edge_add2', u, v });
    }

    add("Init Visited", `int[] vis = new int[n];\nAllocated visited array for traversal.`, 32, { phase: 'init_vis' });
    add("Init Time-In", `int[] tin = new int[n];\nAllocated Time-In array to capture exactly when nodes are reached.`, 33, { phase: 'init_tin' });
    add("Init Low-Time", `int[] low = new int[n];\nAllocated Low-Time array to strictly track the earliest reachable node via back-edges.`, 34, { phase: 'init_low' });
    add("Init Bridges Output", `List<List<Integer>> bridges = new ArrayList<>();\nTracking arrays ready. Let the algorithm begin!`, 35, { phase: 'init_bridges' });

    add("Call Global DFS", `dfs(0, -1, vis, adj, tin, low, bridges);\nLaunching the master DFS traversal starting from node 0 with a phantom parent -1.`, 36, { phase: 'call_dfs' });
    
    simulateDFS(0, -1);

    add("Return Bridges", `return bridges;\nAlgorithm concluded! Successfully isolated exactly ${bridgesFound.length} critical connections.`, 37, { phase: 'done', isDone: true, isSuccess: true, finalAns: bridgesFound.length });

    return steps;
  }, [baseN, baseEdges]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-indigo-900 border-indigo-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-indigo-400`}>
                    <CheckCircle2 size={24}/> DFS TRAVERSAL COMPLETE
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Tarjan's single-pass algorithm identified exactly {st.finalAns} critical bridges that structurally hold the graph together!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('update') || String(st.phase || '').includes('add') || String(st.phase || '').includes('edge_add') ? 'text-indigo-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('calc') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') || String(st.phase || '').includes('recurse') || String(st.phase || '').includes('back') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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

  // Dynamic Layout for Graph
  const svgSize = 600;
  const graphRadius = Math.max(160, baseN * 30);
  
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseN).fill({x: 0, y: 0});
    if (baseN === 0) return pos;
    if (baseN === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < baseN; i++) {
        // Distribute nicely in a circle
        const angle = (i / baseN) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN, graphRadius]);

  const renderMainCanvas = () => {
      if (st.adj === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Massive Final Answer Popup */}
              {st.isDone && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                      <div className={`bg-indigo-600/95 backdrop-blur border-4 border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 flex flex-col items-center gap-4 text-white transform -translate-y-10`}>
                          <Trophy size={64} className="text-amber-300 drop-shadow-md animate-bounce"/>
                          <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Total Bridges Found</span>
                          <span className="text-8xl font-black drop-shadow-xl pt-2">{st.finalAns}</span>
                      </div>
                  </div>
              )}

              {/* The Visual Undirected Graph */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center rounded-full">
                  
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          const renderedEdges = new Set<string>();
                          const edgeElements: React.ReactNode[] = [];
                          
                          if (st.adj) {
                              st.adj.forEach((neighbors: number[], u: number) => {
                                  neighbors.forEach((v) => {
                                      // Ensure undirected rendering logic (min-max keys)
                                      const edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
                                      if (renderedEdges.has(edgeKey)) return;
                                      renderedEdges.add(edgeKey);

                                      const p1 = nodePositions[u];
                                      const p2 = nodePositions[v];
                                      if (!p1 || !p2) return;

                                      let isConfirmedBridge = false;
                                      if (st.bridgesFound) {
                                          for (let b of st.bridgesFound) {
                                              if ((b[0] === u && b[1] === v) || (b[0] === v && b[1] === u)) {
                                                  isConfirmedBridge = true;
                                              }
                                          }
                                      }

                                      let isActiveTraversal = (st.activeNode === u && st.checkIt === v) || (st.activeNode === v && st.checkIt === u);
                                      let isBackEdgeTraversal = isActiveTraversal && st.isBackEdge;
                                      
                                      let strokeColor = "#cbd5e1"; // slate-300
                                      let strokeWidth = "3";
                                      let animClass = "transition-all duration-500";
                                      let dashArray = "";

                                      if (isConfirmedBridge) {
                                          strokeColor = "#f43f5e"; // rose-500 (RED for bridges!)
                                          strokeWidth = "8";
                                          animClass = "transition-all duration-500 drop-shadow-md";
                                      } else if (isBackEdgeTraversal) {
                                          strokeColor = "#f59e0b"; // amber-500
                                          strokeWidth = "5";
                                          dashArray = "6 6"; // Dashed for back-edges!
                                          animClass = "animate-pulse transition-all duration-300";
                                      } else if (isActiveTraversal) {
                                          strokeColor = "#6366f1"; // indigo-500
                                          strokeWidth = "5";
                                          animClass = "animate-pulse transition-all duration-300";
                                      }

                                      edgeElements.push(
                                          <g key={edgeKey} className={animClass}>
                                              <line 
                                                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                                  stroke={strokeColor}
                                                  strokeWidth={strokeWidth}
                                                  strokeDasharray={dashArray}
                                              />
                                          </g>
                                      );
                                  });
                              });
                          }
                          return edgeElements;
                      })()}
                  </svg>

                  {/* Interactive Nodes Layer */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translate(50%, 50%)' }}>
                      {nodePositions.map((pos, idx) => {
                          let isVisited = st.vis && st.vis[idx] === 1;
                          let isActive = st.activeNode === idx;
                          let isChecking = st.checkIt === idx;
                          let isParent = st.parentNode === idx;

                          let tinVal = st.tin ? st.tin[idx] : 0;
                          let lowVal = st.low ? st.low[idx] : 0;
                          let hasValues = tinVal > 0;

                          let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                          let ringClass = '';
                          let zIndex = 'z-10';

                          if (isActive) {
                              bgClass = `bg-indigo-500 text-white border-indigo-600 shadow-xl scale-125`;
                              ringClass = `ring-4 ring-indigo-300 ring-offset-2 border-transparent animate-pulse`;
                              zIndex = 'z-40';
                          } else if (isChecking) {
                              bgClass = `bg-amber-400 text-amber-900 border-amber-500 shadow-lg scale-110`;
                              ringClass = `ring-4 ring-amber-200 ring-offset-2 border-transparent`;
                              zIndex = 'z-30';
                          } else if (isVisited) {
                              bgClass = 'bg-slate-700 text-white border-slate-800 shadow-md';
                          }

                          return (
                              <div key={`node-${idx}`} className={`absolute flex items-center justify-center font-mono font-black rounded-full transition-all duration-500 pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ 
                                  left: `${pos.x}px`, 
                                  top: `${pos.y}px`, 
                                  width: `48px`,
                                  height: `48px`,
                                  transform: 'translate(-50%, -50%)'
                              }}>
                                  {idx}
                                  
                                  {/* Timestamps Badge! */}
                                  <div className={`absolute -bottom-8 flex items-center bg-white border shadow-sm rounded-lg overflow-hidden transition-all duration-500 ${hasValues ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                      <div className={`px-2 py-0.5 text-[9px] uppercase tracking-widest border-r ${st.phase?.includes('Set Tin') && isActive ? 'bg-emerald-100 text-emerald-700 font-black animate-pulse' : 'bg-slate-50 text-slate-500'}`}>in: {hasValues ? tinVal : '-'}</div>
                                      <div className={`px-2 py-0.5 text-[9px] uppercase tracking-widest ${st.phase?.includes('Update Low') && isActive ? 'bg-fuchsia-100 text-fuchsia-700 font-black animate-pulse' : 'bg-slate-50 text-slate-500'}`}>low: {hasValues ? lowVal : '-'}</div>
                                  </div>

                                  {isParent && !isActive && !isChecking && <span className={`absolute -top-6 text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-widest border border-slate-300 whitespace-nowrap`}>Parent</span>}
                              </div>
                          );
                      })}
                  </div>

              </div>
          </div>
      );
  };

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-4 w-full h-full pb-8">

          {/* Variables Tracker */}
          <div className="flex flex-col w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4 font-mono text-[11px]">
                  
                  <div className="flex flex-col gap-1 mb-2">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Timer (timer)
                          {st.phase === 'Increment Timer' && <span className="text-indigo-500 text-[10px]">Ticking...</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'Increment Timer' ? 'text-indigo-500 animate-pulse' : 'text-slate-700'}`}>{st.timer !== undefined ? st.timer : '-'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-indigo-500 font-bold">node:</span>
                          <span className="font-bold text-indigo-700 uppercase tracking-widest text-lg">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">it:</span>
                          <span className="font-bold text-amber-700 text-lg">{st.checkIt !== undefined ? st.checkIt : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1 col-span-2">
                          <span className="text-slate-500 font-bold">parent:</span>
                          <span className="font-bold text-slate-700 text-lg">{st.parentNode !== undefined ? st.parentNode : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Adjacency List Tracker */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border mb-2 shadow-sm flex items-center gap-2 w-fit bg-slate-100 text-slate-600 border-slate-200`}>
                  <ListTree size={12}/> Adjacency List (adj)
              </span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[100px] max-h-[140px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined || st.adj.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Building...</span> : (st.adj || []).map((neighbors: number[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center justify-between transition-all duration-300 ${isActiveRow ? `bg-indigo-50/70 p-2 -m-2 rounded-xl border border-indigo-200 shadow-sm` : ''}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? `bg-indigo-500 text-white shadow-md` : 'bg-slate-100 text-slate-500'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={16} className={`shrink-0 mx-2 ${isActiveRow ? `text-indigo-500 animate-pulse` : 'text-slate-300'}`} />
                              <div className="flex flex-wrap gap-x-1 gap-y-2 items-center font-mono text-[11px] leading-tight flex-1">
                                  <span className="text-slate-400 font-sans text-sm">{"{"}</span>
                                  {neighbors.length === 0 && <span className="text-slate-400 italic font-sans text-[10px]">empty</span>}
                                  {neighbors.map((neighbor, colIdx) => {
                                      let isProcessing = isActiveRow && st.checkIt === neighbor;
                                      let isNewlyAdded = st.phase?.includes('edge_add') && ((st.u === nodeIdx && st.v === neighbor) || (st.v === nodeIdx && st.u === neighbor));
                                      
                                      return (
                                          <React.Fragment key={`adj-m-${nodeIdx}-${colIdx}`}>
                                              <span className={`relative transition-all ${isProcessing ? `text-amber-600 font-black scale-125 bg-amber-400/20 px-1.5 py-0.5 rounded shadow-sm z-10 animate-bounce` : (isNewlyAdded ? 'text-emerald-500 font-black animate-pulse' : 'text-slate-600 font-bold')}`}>
                                                  {neighbor}
                                              </span>
                                              {colIdx < neighbors.length - 1 && <span className="text-slate-400 mr-1.5">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 font-sans text-sm">{"}"}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
          
          {/* Output Bridges Array */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Link size={12}/> Bridges Found (bridges)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[90px] max-h-[140px] overflow-y-auto scrollbar-thin">
                  {st.bridgesFound === undefined || st.bridgesFound.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">No bridges discovered yet...</span> : (
                      st.bridgesFound.map((edge: number[], idx: number) => {
                          let isNewBridge = st.phase === 'Add Bridge' && idx === st.bridgesFound.length - 1;

                          return (
                              <div key={`bridge-${idx}`} className={`flex flex-wrap gap-1.5 items-center font-mono text-[10px] leading-tight p-2.5 rounded-xl border transition-all duration-500 ${isNewBridge ? `bg-rose-50 border-rose-300 shadow-md scale-[1.02] animate-in zoom-in` : 'bg-slate-50 border-slate-200'}`}>
                                  <span className={`text-rose-600 font-black uppercase tracking-widest mr-2 flex items-center gap-1`}><Scissors size={12}/> Critical:</span>
                                  <span className="text-slate-400 font-sans text-sm">[</span>
                                  <span className={`text-rose-700 font-bold px-1.5 py-0.5 bg-rose-100 rounded`}>{edge[0]}</span>
                                  <span className="text-slate-400">,</span>
                                  <span className={`text-rose-700 font-bold px-1.5 py-0.5 bg-rose-100 rounded`}>{edge[1]}</span>
                                  <span className="text-slate-400 font-sans text-sm">]</span>
                              </div>
                          )
                      })
                  )}
              </div>
          </div>

          {/* Arrays Status (Inline) */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Timestamps (tin / low)</span>
              
              <div className="flex flex-col gap-2 w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  {/* TIN Array */}
                  <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-emerald-600 w-6">tin:</span>
                      <div className="flex flex-wrap gap-1 flex-1">
                          {st.tin === undefined ? <span className="text-slate-300 font-mono italic text-xs">Init...</span> : st.tin.map((val: number, idx: number) => {
                              let isUpdating = st.phase === 'Assign Timestamps' && st.activeNode === idx;
                              return (
                                  <div key={`tin-${idx}`} className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold rounded transition-colors ${val > 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-300 border border-slate-200'} ${isUpdating ? 'ring-2 ring-emerald-400 scale-110 z-10 relative' : ''}`}>
                                      {val > 0 ? val : '-'}
                                  </div>
                              )
                          })}
                      </div>
                  </div>
                  
                  {/* LOW Array */}
                  <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-fuchsia-600 w-6">low:</span>
                      <div className="flex flex-wrap gap-1 flex-1">
                          {st.low === undefined ? <span className="text-slate-300 font-mono italic text-xs">Init...</span> : st.low.map((val: number, idx: number) => {
                              let isUpdating = (st.phase === 'Assign Timestamps' || st.phase?.includes('Update Low')) && st.activeNode === idx;
                              return (
                                  <div key={`low-${idx}`} className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold rounded transition-colors ${val > 0 ? 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200' : 'bg-slate-50 text-slate-300 border border-slate-200'} ${isUpdating ? 'ring-2 ring-fuchsia-400 scale-110 z-10 relative' : ''}`}>
                                      {val > 0 ? val : '-'}
                                  </div>
                              )
                          })}
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
                  <span>Tarjan's Bridges & Low Time</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Link size={28}/> Finding Bridges (Critical Connections)</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A "Bridge" (or Critical Connection) is an edge in a graph whose removal strictly increases the number of disconnected components. If a bridge breaks, the network splits!</p>
                        <p>We use <strong>Tarjan's Algorithm</strong>, a stunningly elegant $O(V+E)$ single-pass DFS strategy to identify these bridges instantly using two mathematical tracking arrays:</p>
                        <ul className="list-decimal pl-6 space-y-3 mt-4 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                            <li><strong>tin[] (Time In):</strong> The exact global `timer` step when a node is first visited.</li>
                            <li><strong>low[] (Lowest Time):</strong> The smallest `tin` reachable from this node, including traveling through <em>Back-Edges</em>.</li>
                        </ul>
                        <p><strong>The Core Logic:</strong> As DFS explores forward, it pulls the `low` time up from its children. If the DFS encounters a neighbor it has already visited (that isn't its parent), it has found a <strong>Back-Edge</strong>! It uses that back-edge to update its `low` time. Finally, if a child's lowest reachable time is still <em>strictly greater</em> than the parent's insertion time (<code>low[child] &gt; tin[parent]</code>), it mathematically proves the child has no alternative escape path back to the ancestors. Thus, that edge is a confirmed Bridge!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Cycle with a Bridge</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 4<br/><strong>Edges:</strong> 0,1 | 1,2 | 2,0 | 0,3</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[0, 3]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Nodes 0, 1, and 2 form a continuous triangle loop. None of those edges are bridges because removing one still leaves a path around the triangle. Node 0 bridges out to Node 3. Removing 0-3 disconnects 3 completely.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 3: Joined Cycles</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 6<br/><strong>Edges:</strong> 0,1 | 1,2 | 2,0 | 3,4 | 4,5 | 5,3 | 2,3</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[2, 3]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">We have two separate distinct cycles (0-1-2 and 3-4-5). They are physically joined by a single edge between 2 and 3. That edge is the sole critical connection in the graph.</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>V (Vertices)</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Undirected Edges [u,v] (separated by |)</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-12 flex flex-col lg:flex-row gap-4 w-full pb-8">
                <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 p-5 shadow-2xl shrink-0">
                    {renderRightSidebar()}
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Time-In, Low-Time, and Back-Edges in Tarjan's.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-fuchsia-500"/> The Magic of Timestamps</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In Tarjan's algorithm, every single node receives two timestamps when first visited: <code>tin</code> (the strict clock step it was inserted) and <code>low</code> (the lowest timestamp it can reach). Initially, <code>low = tin</code>. If a node can somehow route back to an ancestor, its <code>low</code> time will drop, mathematically proving it's part of a connected cycle!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-amber-500"/> Detecting Back-Edges</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">While exploring neighbors, if we encounter a node that is ALREADY visited, and it is <em>not our direct parent</em>, we have found a Back-Edge! This means there is a secondary path bridging the graph. We immediately execute <code>low[node] = min(low[node], low[it])</code> to absorb that ancestor's lower timestamp, effectively locking both nodes into an unbreakable cycle that cannot contain bridges!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>The beauty of this algorithm is that it completes in a single, uninterrupted DFS pass! Every node is visited exactly once, and every edge is evaluated exactly once (or twice considering undirected graphs). This yields a strictly linear total time complexity.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>We store the original graph `adj` $O(V+E)$. The recursive call stack takes $O(V)$ space in the worst case (a straight line graph). The tracking arrays `vis[]`, `tin[]`, and `low[]` each require $O(V)$ space. Thus, the algorithm requires minimal linear auxiliary space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is the golden standard for structural graph analysis. Mastering the 'if low[it] &gt; tin[node]' equation is non-negotiable."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Explain exactly what `low[it] &gt; tin[node]` means."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It mathematically proves isolation."</p>
                            <p>When the DFS backtracks from a child (`it`) to its parent (`node`), we look at the child's `low` time. If the child's lowest reachable time is STILL strictly greater than the exact time we arrived at the parent, it proves the child never found a back-edge to an ancestor! The child is completely trapped. The only way to reach the child was through the parent, making that specific edge a Critical Bridge."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we skip `it == parent` during traversal?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent fake back-edges."</p>
                            <p>Since the graph is undirected, an edge between A and B exists as A-B and B-A in the adjacency list. If we travel from A to B, B's adjacency list obviously contains A. If we didn't skip the parent, B would falsely believe it found a 'back-edge' to A and artificially lower its `low` time, breaking the math and causing the algorithm to fail to detect any bridges at all!"</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>V:</label>
                          <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-3`}>Undirected Edges [u,v]:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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

              {/* RIGHT SIDEBAR (Full Height in Fullscreen) */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
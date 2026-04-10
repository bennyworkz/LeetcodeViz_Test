import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  printShortestPath: {
    id: 'printShortestPath',
    title: 'Print Shortest Path (Dijkstra\'s)',
    icon: <Navigation size={16} />,
    complexity: 'Time: O(E log V + O(V)) | Space: O(V + E)',
    theme: 'emerald',
    code: `class Solution {
    public static List<Integer> shortestPath(int n, int m, int edges[][]) {
        ArrayList<ArrayList<Pair>> adj = new ArrayList<>();
        for(int i = 0;i<=n;i++) {
            adj.add(new ArrayList<>());
        }
        for(int i = 0;i<m;i++) {
            adj.get(edges[i][0]).add(new Pair(edges[i][1], edges[i][2]));
            adj.get(edges[i][1]).add(new Pair(edges[i][0], edges[i][2]));
        }
        PriorityQueue<Pair> pq = new PriorityQueue<Pair>((x,y) -> x.first - y.first);
        int [] dist = new int[n+1];
        int [] parent = new int[n+1];
        for(int i = 1;i<=n;i++) {
            dist[i] = (int)(1e9);
            parent[i] = i;
        }
        dist[1] = 0;
        pq.add(new Pair(0, 1));
        while(pq.size() != 0) {
            Pair it = pq.peek();
            int node = it.second;
            int dis = it.first;
            pq.remove();
            for(Pair iter : adj.get(node)) {
                int adjNode = iter.first;
                int edW = iter.second;
                if(dis + edW < dist[adjNode]) {
                    dist[adjNode] = dis + edW;
                    pq.add(new Pair(dist[adjNode], adjNode));
                    parent[adjNode] = node;
                }
            }
        }
        List<Integer> path = new ArrayList<>();
        if(dist[n] == 1e9) {
            path.add(-1);
            return path;
        }
        int node = n;
        while(parent[node] != node) {
            path.add(node);
            node = parent[node];
        }
        path.add(1);
        Collections.reverse(path);
        return path;
    }
}
class Pair {
    int first, second;
    Pair(int first, int second) { this.first = first; this.second = second; }
}`,
    desc: "Finding the Shortest Path is standard Dijkstra, but PRINTING the path requires keeping a `parent` array! Every time we relax an edge (`dis + edW < dist[adjNode]`), we simultaneously record WHERE we came from (`parent[adjNode] = node`). Once the Min-Heap is empty, we simply start at the destination node `N` and use a `while` loop to backtrack through the parent array all the way to `1`. Reverse the path, and you have your optimal route!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|shortestPath|distance|node|it|adj|dist|parent|path|n|m|edges|pq|get|add|isEmpty|peek|remove|size|length|LinkedList|Queue|PriorityQueue|ArrayList|List|Integer|String|Pair|edW|adjNode|dis|first|second|Collections|reverse|iter)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'PriorityQueue', 'ArrayList', 'List', 'Pair', 'Collections'].includes(part);
            const isPointer = ['adj', 'node', 'n', 'm', 'i', 'pq', 'dist', 'parent', 'path', 'edges', 'edW', 'adjNode', 'dis', 'first', 'second', 'x', 'y', 'it', 'iter'].includes(part);
            const isMapCall = ['shortestPath', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length', 'reverse'].includes(part);
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

export default function PrintShortestPathVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('printShortestPath');
  
  // Default: Match exact problem statement logic (1-indexed nodes)
  // n = 5, m=6, edges=[[1,2,2], [2,5,5], [2,3,4], [1,4,1], [4,3,3], [3,5,1]]
  const [nInput, setNInput] = useState('5');
  const [edgesInput, setEdgesInput] = useState('1,2,2 | 2,5,5 | 2,3,4 | 1,4,1 | 4,3,3 | 3,5,1');

  const [baseN, setBaseN] = useState(5);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [1,2,2], [2,5,5], [2,3,4], [1,4,1], [4,3,3], [3,5,1]
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

  // --- Quick Test Case Loaders ---
  const loadTestCase1 = () => {
      setNInput('5');
      setEdgesInput('1,2,2 | 2,5,5 | 2,3,4 | 1,4,1 | 4,3,3 | 3,5,1');
  };

  const loadTestCase2 = () => {
      setNInput('4');
      // Case where target N is unreachable
      setEdgesInput('1,2,1 | 2,3,1');
  };

  // --- Effects for Data Processing ---
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0 || n > 20) n = 5;

        let rows = edgesInput.split('|').map(r => r.trim());
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let pair = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            // u, v, wt (1-indexed input allowed)
            if (pair.length === 3 && !isNaN(pair[0]) && !isNaN(pair[1]) && !isNaN(pair[2])) {
                let u = pair[0], v = pair[1], wt = pair[2];
                if(u > 0 && u <= n && v > 0 && v <= n) {
                    parsedEdges.push([u, v, wt]);
                }
            }
        }

        setBaseN(n);
        setBaseEdges(parsedEdges);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [edgesInput, nInput]);

  // Auto-scroll effect specifically targeting exact active line
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

  const clone1D = (arr: any[]) => [...arr];

  // --- Graph Layout Mathematics ---
  const N = baseN;
  const graphRadius = Math.max(160, N * 35);
  const svgSize = graphRadius * 2 + 140;

  const nodePositions = useMemo(() => {
    // 1-indexed mapping
    const pos: {[key: number]: {x: number, y: number}} = {};
    if (N === 0) return pos;
    if (N === 1) { pos[1] = {x: 0, y: 0}; return pos; }

    for (let i = 1; i <= N; i++) {
        // Shift angle so 1 is at top
        const angle = ((i - 1) / N) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN, graphRadius, N]);

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const m = baseEdges.length;
    const edges = baseEdges;
    
    if (n === 0) return steps;

    // Simulation local state (1-indexed!)
    let adj: {v: number, wt: number}[][] = Array.from({length: n + 1}, () => []);
    
    let pq: {distance: number, node: number}[] = [];
    let dist: number[] = Array(n + 1).fill(1e9);
    let parent: number[] = Array(n + 1).fill(0);
    let distHistory: number[][] = Array.from({length: n + 1}, () => []);
    let parentHistory: number[][] = Array.from({length: n + 1}, () => []);
    
    let path: number[] = [];
    let backtrackEdges: {u: number, v: number}[] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: clone1D(adj.map(a => [...a])), n, m, pq: [...pq], dist: clone1D(dist), parent: clone1D(parent), distHistory: distHistory.map(a => [...a]), parentHistory: parentHistory.map(a => [...a]), path: [...path], edges, backtrackEdges: [...backtrackEdges], ...stateObj } 
    });

    add("Function Call", `public static List<Integer> shortestPath(int n=${n}, ...)\nInitiating Print Shortest Path algorithm on Undirected Graph.`, 2, { phase: 'init' });
    
    add("Init Adjacency List", `ArrayList<ArrayList<Pair>> adj = new ArrayList<>();`, 3, { phase: 'init_graph' });
    
    for(let i = 0; i <= n; i++) adj[i] = [];
    add("Allocate Nodes", `for(int i = 0;i<=n;i++) { adj.add(new ArrayList<>()); }`, 5, { phase: 'alloc_adj' });

    for (let e of edges) {
        adj[e[0]].push({v: e[1], wt: e[2]});
        adj[e[1]].push({v: e[0], wt: e[2]});
    }
    add("Populate Edges", `for(int i = 0;i<m;i++) {\n    adj.get(edges[i][0]).add(new Pair(edges[i][1], edges[i][2]));\n    ...\n}\nGraph fully populated from bidirectional edge list.`, 8, { phase: 'pop_edges' });

    add("Init Priority Queue", `PriorityQueue<Pair> pq = new PriorityQueue<Pair>((x,y) -> x.first - y.first);\nAllocated Min-Heap sorted by cumulative distance.`, 11, { phase: 'init_pq' });
    
    add("Init State Arrays", `int [] dist = new int[n+1];\nint [] parent = new int[n+1];\nCreating dual 1-indexed arrays to track distances and routes.`, 13, { phase: 'init_ds' });
    
    for(let i=1; i<=n; i++) {
        parent[i] = i;
    }
    add("Fill Base States", `for(int i = 1;i<=n;i++) {\n    dist[i] = (int)(1e9);\n    parent[i] = i;\n}\nSet infinity. Critical: A node is its own parent by default!`, 16, { phase: 'fill_ds' });
    
    dist[1] = 0;
    add("Set Source Distance", `dist[1] = 0;\nDistance from start node (1) to itself is always 0.`, 18, { phase: 'set_dist_src' });

    pq.push({distance: 0, node: 1});
    add("Enqueue Source", `pq.add(new Pair(0, 1));\nPushed initial state {dist: 0, node: 1} into Min-Heap.`, 19, { phase: 'pq_add_src' });

    while(pq.length > 0) {
        add("While PQ Loop", `while(pq.size() != 0)\nMin-Heap has elements. Extracting shortest path node!`, 20, { phase: 'while_pq' });
        
        let dis = pq[0].distance;
        let node = pq[0].node;
        
        add("Peek & Remove", `Pair it = pq.peek();\nint node = it.second;\nint dis = it.first;\npq.remove();\nPopped node ${node} with cumulative distance ${dis}.`, 23, { phase: 'pq_pop', activeNode: node, dis });
        pq.shift();

        add("Neighbor Loop", `for(Pair iter : adj.get(node))\nIterating neighbors connected to node ${node}.`, 25, { phase: 'for_adj', activeNode: node, dis });

        for (let i = 0; i < adj[node].length; i++) {
            let adjNode = adj[node][i].v;
            let edW = adj[node][i].wt;
            
            add("Extract Neighbor Data", `int adjNode = iter.first;\nint edW = iter.second;\nEvaluating neighbor ${adjNode} over edge weight ${edW}.`, 27, { phase: 'get_adj_data', activeNode: node, dis, edW, adjNode, checkNode: adjNode });

            let currDistV = dist[adjNode];
            let isRelaxable = dis + edW < currDistV;

            add("Evaluate Relaxation", `if(dis + edW < dist[adjNode])\nChecking if ${dis} + ${edW} < ${currDistV === 1e9 ? '∞' : currDistV}.`, 28, { phase: 'eval_relax', activeNode: node, checkNode: adjNode, dis, edW, adjNode, isRelaxable });

            if(isRelaxable) {
                if (dist[adjNode] !== 1e9) {
                    distHistory[adjNode].push(dist[adjNode]); // Log history for rendering
                }
                parentHistory[adjNode].push(parent[adjNode]); // Always push old parent to history

                dist[adjNode] = dis + edW;
                add("Relax Distance!", `dist[adjNode] = dis + edW;\nYES! Shorter path found! Updated dist[${adjNode}] = ${dist[adjNode]}.`, 29, { phase: 'do_relax', activeNode: node, checkNode: adjNode, dis, edW, adjNode, newDist: dist[adjNode] });
                
                pq.push({distance: dist[adjNode], node: adjNode});
                pq.sort((a, b) => a.distance - b.distance); // PQ sort
                
                add("Enqueue Updated Path", `pq.add(new Pair(dist[adjNode], adjNode));\nPushed new optimal state into Min-Heap.`, 30, { phase: 'pq_add', activeNode: node, checkNode: adjNode, newDist: dist[adjNode] });

                parent[adjNode] = node;
                add("Record Parent Path", `parent[adjNode] = node;\nCRITICAL: Recorded that we arrived at ${adjNode} FROM ${node}!`, 31, { phase: 'set_parent', activeNode: node, checkNode: adjNode, newParent: node });
            }
        }
    }

    add("PQ Empty Exit", `while(pq.size() != 0)\nThe Priority Queue is entirely empty. All distances and parents are finalized!`, 20, { phase: 'done_while' });
    
    add("Init Path List", `List<Integer> path = new ArrayList<>();\nPreparing to build the final route.`, 35, { phase: 'init_path_ds' });

    add("Check Reachability", `if(dist[n] == 1e9)\nDid we successfully reach the target node ${n}?`, 36, { phase: 'check_unreachable' });
    if(dist[n] === 1e9) {
        path.push(-1);
        add("Return Unreachable", `path.add(-1);\nreturn path;\nThe target node was completely unreachable. Returning [-1].`, 38, { phase: 'done', isDone: true, isSuccess: false });
        return steps;
    }

    let backtrackNode = n;
    add("Init Backtrack Variable", `int node = n;\nStarting backtracking from destination node ${n}.`, 40, { phase: 'init_backtrack', btNode: backtrackNode });

    while(parent[backtrackNode] !== backtrackNode) {
        add("Backtrack Loop", `while(parent[node] != node)\nSince ${backtrackNode} != ${parent[backtrackNode]}, we trace backwards!`, 41, { phase: 'while_parent', btNode: backtrackNode });
        
        path.push(backtrackNode);
        let nextNode = parent[backtrackNode];
        backtrackEdges.push({u: backtrackNode, v: nextNode});

        add("Append & Traverse", `path.add(node);\nnode = parent[node];\nAppended ${backtrackNode}, and moving focus to its parent: ${nextNode}.`, 43, { phase: 'traverse_parent', btNode: backtrackNode, nextNode });
        backtrackNode = nextNode;
    }

    add("Backtrack Exit", `while(parent[node] != node)\nReached the absolute source! Node ${backtrackNode} is its own parent.`, 41, { phase: 'while_parent_exit', btNode: backtrackNode });
    
    path.push(1);
    add("Append Source", `path.add(1);\nFinally, add the absolute source node (1) to complete the reverse sequence.`, 45, { phase: 'append_src' });

    path.reverse();
    add("Reverse Sequence", `Collections.reverse(path);\nReversing the array so the path flows forwards from 1 -> ${n}.`, 46, { phase: 'reverse_path' });

    add("Final Return", `return path;\nAlgorithm successfully concluded.`, 47, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseEdges]);

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

  // --- Segregated Render Blocks for Clean Layout ---

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Navigation size={100} className="text-white"/></div>
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
                    {st.isSuccess ? "SHORTEST PATH GENERATED" : "TARGET UNREACHABLE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `Algorithm successfully mapped and reversed the optimal path from 1 to ${st.n}.` : `The target node ${st.n} cannot be reached from node 1.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('pq_add') || String(st.phase || '').includes('do_relax') || String(st.phase || '').includes('set_parent') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-amber-400' : (String(st.phase || '').includes('pq_pop') || String(st.phase || '').includes('traverse_parent') || String(st.phase || '').includes('reverse') ? 'text-fuchsia-400' : (String(st.phase || '').includes('get') || String(st.phase || '').includes('for') || String(st.phase || '').includes('while_parent') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] pb-6 relative z-30">
          
          {/* Path Output Array Tracker */}
          {st.phase && String(st.phase).includes('path') || String(st.phase).includes('traverse') || String(st.phase).includes('reverse') || st.isDone ? (
              <div className="flex flex-col items-center shrink-0 w-full mb-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><Navigation size={12}/> path Output Sequence</span>
                  <div className={`flex flex-col w-full max-w-[800px] bg-white border shadow-md rounded-2xl p-4 transition-all duration-500 ${st.isDone ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50' : 'border-slate-200'}`}>
                      <div className="flex items-center overflow-x-auto scrollbar-none gap-2 px-4 h-[40px]">
                          {st.path === undefined || st.path.length === 0 ? <span className="text-slate-300 font-mono italic text-xs">Path construction pending...</span> : (st.path || []).map((nodeVal: number, idx: number) => {
                              let isNew = idx === st.path.length - 1 && !st.isDone && st.phase !== 'reverse_path';
                              let isReversing = st.phase === 'reverse_path';
                              return (
                                  <React.Fragment key={`p-${idx}`}>
                                      <div className={`px-4 py-1.5 flex items-center justify-center font-mono font-black text-lg rounded-xl border-2 transition-all duration-500 ${isNew ? 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-lg scale-110 animate-in zoom-in' : (isReversing ? 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-pulse scale-105' : 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm')}`}>
                                          {nodeVal}
                                      </div>
                                      {idx < st.path.length - 1 && <ArrowRight size={14} className="text-emerald-400 shrink-0"/>}
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>
              </div>
          ) : (
              <div className="flex flex-col gap-1.5 w-full items-center">
                  {/* Stacked parent[] and dist[] just like the whiteboard! */}
                  <div className="flex gap-2">
                      <div className="w-[80px] flex justify-end items-center pr-4">
                          <span className="text-[12px] font-black uppercase tracking-widest text-fuchsia-500">parent[]</span>
                      </div>
                      <div className="flex gap-1.5 items-end">
                          {st.parent === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.parent || []).slice(1).map((val: number, rawIdx: number) => {
                              let idx = rawIdx + 1; // 1-indexed
                              let history = st.parentHistory ? st.parentHistory[idx] : [];
                              let isNewlyWritten = st.phase === 'set_parent' && st.checkNode === idx;
                              
                              let boxBg = "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200";
                              if (isNewlyWritten) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in z-20 font-black";

                              return (
                                  <div key={`par-${idx}`} className="flex flex-col items-center relative group">
                                      {/* Whiteboard style strike-throughs for history! */}
                                      <div className="absolute bottom-full mb-0.5 flex flex-col-reverse items-center justify-end gap-0 max-h-[80px] overflow-hidden leading-none">
                                          {(history || []).map((hVal: number, hIdx: number) => (
                                              <span key={`hp-${idx}-${hIdx}`} className="text-[11px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-[1.5px] leading-tight">{hVal}</span>
                                          ))}
                                      </div>
                                      <div className={`w-12 h-8 flex items-center justify-center font-mono font-bold text-sm rounded border-2 transition-all duration-300 ${boxBg}`}>
                                          {val}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  <div className="flex gap-2">
                      <div className="w-[80px] flex justify-end items-center pr-4">
                          <span className="text-[12px] font-black uppercase tracking-widest text-emerald-500">dist[]</span>
                      </div>
                      <div className="flex gap-1.5 items-end">
                          {st.dist === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.dist || []).slice(1).map((val: number, rawIdx: number) => {
                              let idx = rawIdx + 1; // 1-indexed
                              let isSource = idx === 1;
                              let isInfinity = val === 1e9;
                              let history = st.distHistory ? st.distHistory[idx] : [];
                              
                              let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.checkNode === idx || (st.phase === 'set_dist_src' && isSource));
                              let isEvaluating = st.phase === 'eval_relax' && st.checkNode === idx;
                              
                              let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-emerald-50 text-emerald-700 border-emerald-200 font-black";
                              
                              if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                              if (isEvaluating) boxBg += " ring-2 ring-rose-400 scale-105 z-10";

                              return (
                                  <div key={`dist-${idx}`} className="flex flex-col items-center relative group">
                                      <div className={`w-12 h-10 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
                                          {isInfinity ? '∞' : val}
                                      </div>
                                      
                                      {/* Whiteboard style strike-throughs overlayed ON TOP of the cell conceptually? No, let's put them below or above. Above is used by parent. We'll put them below for dist */}
                                      <div className="absolute top-full mt-0.5 flex flex-col items-center justify-start gap-0 max-h-[80px] overflow-hidden leading-none">
                                          {(history || []).map((hVal: number, hIdx: number) => (
                                              <span key={`hd-${idx}-${hIdx}`} className="text-[11px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-[1.5px] leading-tight">{hVal === 1e9 ? '∞' : hVal}</span>
                                          ))}
                                      </div>
                                      
                                      <span className={`absolute top-full mt-7 text-[9px] font-mono font-black mb-0.5 ${isSource ? 'text-emerald-500' : 'text-slate-400'}`}>{idx}</span>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          {/* Adjacency List Component - Match Screenshot perfectly! */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (adj)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-1.5 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.adj || []).slice(1).map((neighbors: {v: number, wt: number}[], rawIdx: number) => {
                      let nodeIdx = rawIdx + 1; // 1-indexed mapping
                      let isActiveRow = st.activeNode === nodeIdx;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-emerald-50 border border-emerald-200 shadow-sm scale-[1.02] z-10' : 'bg-slate-50/50 border border-transparent hover:bg-slate-50'}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={16} className={isActiveRow ? 'text-emerald-400' : 'text-slate-300'} />
                              <div className="flex flex-wrap gap-2 items-center font-mono text-sm leading-none pt-0.5">
                                  <span className="text-slate-400 text-lg">{'{'}</span>
                                  {neighbors.map((neighborObj, nIdx) => {
                                      let isChecking = isActiveRow && st.checkNode === neighborObj.v;

                                      let neighborText = isChecking ? 'text-fuchsia-600 font-black scale-110' : 'text-slate-600 font-bold';
                                      let wtText = isChecking ? 'text-fuchsia-400 font-bold' : 'text-slate-400 font-medium';

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`flex items-center gap-1.5 transition-all ${neighborText}`}>
                                                  {neighborObj.v} <span className={`text-[11px] ${wtText}`}>({neighborObj.wt})</span>
                                              </span>
                                              {nIdx < neighbors.length - 1 && <span className="text-slate-300 font-sans">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 text-lg">{'}'}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
          
          {/* Priority Queue Min-Heap Component */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Layers size={12}/> PriorityQueue&lt;Pair&gt; pq</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[140px] max-h-[220px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (MIN DIST)</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.pq === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.pq || []).map((pair: {distance: number, node: number}, i: number) => {
                          // The PQ in simulation is strictly sorted by distance ascending.
                          let isNewArrival = String(st.phase || '').includes('pq_add') && st.checkNode === pair.node && st.newDist === pair.distance;
                          let isTop = i === 0;
                          let isPopping = isTop && (String(st.phase || '').includes('pq_pop') || st.phase === 'pq_remove');
                          
                          return (
                              <div key={`pq-${i}-${pair.node}-${pair.distance}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse ring-4 ring-fuchsia-200 scale-105 z-10 relative' : (isTop ? 'bg-amber-500 border-amber-600' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">d: {pair.distance}</span>
                                  <span className="text-sm tracking-widest uppercase">node {pair.node}</span>
                              </div>
                          )
                      })}
                      {st.pq !== undefined && st.pq.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Min-Heap is empty</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">node (Active):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest">{st.activeNode !== undefined ? st.activeNode : (st.btNode !== undefined ? st.btNode : '-')}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-fuchsia-500">dis:</span>
                          <span className="font-bold text-fuchsia-700">{st.dis !== undefined ? st.dis : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-sky-500">edW:</span>
                          <span className="font-bold text-sky-700">{st.edW !== undefined ? st.edW : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-amber-500">adjNode:</span>
                          <span className="font-bold text-amber-700 uppercase tracking-widest">{st.adjNode !== undefined ? st.adjNode : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderMainGraphCanvas = () => {
      if (st.adj === undefined) return null;
      const renderedEdges = new Set<string>();

      return (
          <div className="absolute inset-0 w-full h-full transition-transform duration-300 flex flex-col justify-center items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
              
              {/* Distance Relaxation HUD */}
              {st.phase && st.phase.includes('relax') && st.activeNode !== undefined && st.checkNode !== undefined && (
                  <div className="absolute top-10 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Route size={14} className="text-amber-500"/> Dijkstra Edge Relaxation</span>
                      
                      <div className="flex items-center gap-4 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-fuchsia-500 mb-1">dis</span>
                              <span className="bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200">{st.dis === 1e9 ? '∞' : st.dis}</span>
                          </div>
                          <span className="text-slate-400 font-normal">+</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-sky-500 mb-1">edW</span>
                              <span className="bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">{st.edW}</span>
                          </div>
                          <span className="text-slate-400 font-normal">&lt;</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-rose-500 mb-1">dist[{st.checkNode}]</span>
                              <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">{st.dist[st.checkNode] === 1e9 ? '∞' : st.dist[st.checkNode]}</span>
                          </div>
                      </div>
                      
                      {st.phase === 'do_relax' && (
                          <div className="mt-6 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full border border-emerald-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16}/> Path Relaxed!</span>
                              <ArrowRight size={16} />
                              <span className="font-black font-mono">dist[{st.checkNode}] = {st.newDist}</span>
                          </div>
                      )}
                      {st.phase === 'eval_relax' && !st.isRelaxable && (
                          <div className="mt-6 flex items-center gap-3 bg-slate-100 text-slate-500 px-6 py-2 rounded-full border border-slate-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><X size={16}/> Condition False. Ignored.</span>
                          </div>
                      )}
                  </div>
              )}

              <div style={{ width: svgSize, height: svgSize }} className="relative origin-center">
                  
                  {/* Edges Layer (Undirected visual mapping for Dijkstra) */}
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          // Filter out invalid indices since we over-allocated array length
                          return st.adj.slice(1).map((neighbors: {v: number, wt: number}[], rawU: number) => (
                              neighbors.map((neighborObj) => {
                                  let u = rawU + 1; // 1-indexed conversion
                                  let v = neighborObj.v;
                                  let wt = neighborObj.wt;

                                  // Undirected graph logic: only draw each edge once
                                  const edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
                                  if (renderedEdges.has(edgeKey)) return null;
                                  renderedEdges.add(edgeKey);
  
                                  const p1 = nodePositions[u];
                                  const p2 = nodePositions[v];
                                  if (!p1 || !p2) return null;

                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const angle = Math.atan2(dy, dx);
                                  
                                  const rOffset = 26; // Node radius
                                  const startX = p1.x + rOffset * Math.cos(angle);
                                  const startY = p1.y + rOffset * Math.sin(angle);
                                  const targetX = p2.x - rOffset * Math.cos(angle);
                                  const targetY = p2.y - rOffset * Math.sin(angle);
  
                                  let isActiveChecking = (st.activeNode === u && st.checkNode === v) || (st.activeNode === v && st.checkNode === u);
                                  
                                  // Backtracking Path highlight logic
                                  let isBacktrackingPath = false;
                                  if (st.backtrackEdges) {
                                      for (let bEdge of st.backtrackEdges) {
                                          if ((bEdge.u === u && bEdge.v === v) || (bEdge.u === v && bEdge.v === u)) {
                                              isBacktrackingPath = true;
                                          }
                                      }
                                  }
  
                                  let strokeColor = "#cbd5e1"; // slate-300
                                  let strokeWidth = "3";
                                  let animClass = "";
                                  let labelClass = "bg-slate-100 text-slate-500 border-slate-200";
  
                                  if (isBacktrackingPath) {
                                      strokeColor = "#10b981"; // emerald-500 Final Path!
                                      strokeWidth = "8";
                                      animClass = "animate-in fade-in";
                                      labelClass = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-lg font-black";
                                  } else if (isActiveChecking) {
                                      if(st.phase === 'do_relax' || st.phase === 'pq_add' || st.phase === 'set_parent') {
                                          strokeColor = "#10b981"; // emerald-500
                                          strokeWidth = "6";
                                          animClass = "animate-pulse";
                                          labelClass = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-lg";
                                      } else {
                                          strokeColor = "#f43f5e"; // rose-500 (evaluating)
                                          strokeWidth = "5";
                                          labelClass = "bg-rose-500 text-white border-rose-600 scale-110 shadow-md";
                                      }
                                  }

                                  // Midpoint for the weight label
                                  const midX = (startX + targetX) / 2;
                                  const midY = (startY + targetY) / 2;

                                  return (
                                      <g key={edgeKey} className={`transition-all duration-300 ${animClass}`}>
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                          />
                                          <foreignObject x={midX - 15} y={midY - 15} width="30" height="30" className="overflow-visible">
                                              <div className={`w-full h-full flex items-center justify-center font-mono font-black text-[10px] rounded-full border shadow-sm transition-all duration-300 ${labelClass}`}>
                                                  {wt}
                                              </div>
                                          </foreignObject>
                                      </g>
                                  );
                              })
                          ));
                      })()}
                  </svg>

                  {/* Nodes Layer - Centered exactly on the coordinate space */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {Object.keys(nodePositions).map((idxStr) => {
                        let idx = parseInt(idxStr);
                        let pos = nodePositions[idx];
                        if (!pos) return null;

                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isBacktracking = st.btNode === idx || st.nextNode === idx || (st.path || []).includes(idx);
                        
                        // Determine if node is in PriorityQueue
                        let isQueued = false;
                        if (st.pq) {
                           for(let item of st.pq) { if (item.node === idx) isQueued = true; }
                        }
                        
                        let distValue = st.dist ? st.dist[idx] : 1e9;
                        let isInfinity = distValue === 1e9;
                        let isVisited = !isInfinity && st.dist && idx !== 1;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isBacktracking) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-2xl scale-110';
                        } else if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isQueued) {
                            bgClass = 'bg-amber-500 text-white border-amber-600 shadow-lg';
                        } else if (isVisited) {
                            bgClass = 'bg-sky-600 text-white border-sky-700 shadow-md opacity-90';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isBacktracking) {
                            ringClass = 'ring-4 ring-emerald-300 ring-offset-2 border-transparent';
                            zIndex = 'z-50';
                        } else if (isActive) {
                            ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isChecking) {
                            ringClass = 'ring-4 ring-rose-400 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        }

                        return (
                            <div 
                                key={`node-${idx}`}
                                className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none ${bgClass} ${ringClass} ${zIndex}`}
                                style={{ 
                                    left: `${pos.x}px`, 
                                    top: `${pos.y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {idx}
                                
                                {isQueued && !isActive && !isBacktracking && <span className="absolute -top-6 text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-black border border-amber-300 shadow-sm uppercase tracking-widest whitespace-nowrap">In Heap</span>}
                                {idx === 1 && !isBacktracking && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black border border-sky-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Source</span>}
                                {idx === st.n && !isBacktracking && <span className="absolute -top-6 text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-black border border-rose-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Target</span>}
                            </div>
                        );
                    })}
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
                  <span>Dijkstra + Backtracking</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Navigation size={28}/> Reconstructing the Shortest Route</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Standard Dijkstra's Algorithm finds the shortest <em>distance</em>, but it fundamentally forgets the actual <em>route</em> taken. To physically reconstruct the path from <code>1</code> to <code>N</code>, we introduce a powerful new array: <code>parent[]</code>.</p>
                        <p>Every single time we successfully relax an edge and find a shorter distance to an adjacent node, we boldly record: <strong>"I arrived at this node FROM that node."</strong> Once the Min-Heap completely exhausts and all distances are finalized, we simply start at our destination <code>N</code> and endlessly loop backward through our parent pointers until we hit the source node <code>1</code>!</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Test Case 1 */}
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Whiteboard Original</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 5, <strong>m:</strong> 6<br/><strong>edges:</strong> 1,2,2 | 2,5,5 | 2,3,4 | 1,4,1 | 4,3,3 | 3,5,1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[1, 4, 3, 5]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">
                                The shortest distance is 5.<br/>
                                To reach 5, we look at parent[5] = 3.<br/>
                                To reach 3, parent[3] = 4.<br/>
                                To reach 4, parent[4] = 1.<br/>
                                The reverse sequence maps out 1 &rarr; 4 &rarr; 3 &rarr; 5!
                            </span>
                        </div>

                        {/* Test Case 2 */}
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Broken Graph</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 4, <strong>m:</strong> 2<br/><strong>edges:</strong> 1,2,1 | 2,3,1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[-1]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">
                                The graph consists of nodes 1-2-3, but node 4 is completely isolated. The algorithm completes, detects `dist[4] == 1e9`, and immediately returns an array containing `[-1]` as requested by the prompt.
                            </span>
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="flex flex-wrap gap-3 pb-3 border-b border-slate-100 mb-2">
                        <button onClick={loadTestCase1} className={`px-4 py-2 bg-${themeColor}-50 text-${themeColor}-700 border border-${themeColor}-200 hover:bg-${themeColor}-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 1 (Valid Path)</button>
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><AlertTriangle size={14}/> Test Case 2 (Unreachable)</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N (Nodes)</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="5" />
                        </div>
                        <div className="space-y-1.5 md:col-span-5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>1-Indexed Edges (u, v, wt) | separator</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1,2,2 | 2,5,5 | ..." />
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

                {/* Unified Sub-layout for Normal Mode ensuring no overlapping */}
                <div className="flex flex-col xl:flex-row gap-4 h-[700px]">
                    
                    {/* Main Canvas + Bottom Arrays Container */}
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Route size={14} className={`text-${themeColor}-500`}/> Print Shortest Path Visualizer</span>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <div className="flex bg-white/90 p-1.5 rounded-xl shadow-md border border-slate-200 backdrop-blur gap-1">
                                <button onClick={zoomIn} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Zoom In"><ZoomIn size={16}/></button>
                                <button onClick={zoomOut} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Zoom Out"><ZoomOut size={16}/></button>
                                <div className="w-px bg-slate-200 mx-1"></div>
                                <button onClick={handleReset} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Center Graph"><Crosshair size={16}/></button>
                            </div>
                        </div>

                        {/* Unbounded Graph Area */}
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            {renderMainGraphCanvas()}
                        </div>

                        {/* Safe Bottom Dock for Arrays */}
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>

                    {/* Right Panel for Sidebars */}
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
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how tracking parents organically solves the backtracking routing problem.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-emerald-500"/> Phase 1: Eager Parent Recording</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">During standard Dijkstra execution, whenever we find a mathematically shorter path via <code>dis + edW &lt; dist[adjNode]</code>, we update the distance. But we also do something crucial: we explicitly record <code>parent[adjNode] = node</code>. This guarantees that every node's parent pointer strictly points to the predecessor node that offered the absolute optimal path.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Route size={24} className="text-fuchsia-500"/> Phase 2: Reverse Backtracking Loop</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Once the Priority Queue is fully empty and all optimal states are resolved, we begin at our destination node <code>n</code>. We construct a <code>while</code> loop that constantly pushes the current node into a list, and then jumps backwards to its parent via <code>node = parent[node]</code>. We terminate the loop once we hit the source node (because its parent is itself!). Since we built the path backwards, a simple <code>Collections.reverse(path)</code> yields the correct forward trajectory.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(E log V + V)</strong><br/>The primary Dijkstra algorithm takes its standard $O(E \log V)$ time bound to resolve the Priority Queue. The final backtracking <code>while</code> loop takes at most $O(V)$ time because the longest possible path cannot exceed the total number of vertices without a cycle. So, it runs incredibly efficiently.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>The adjacency list requires $O(V+E)$ space. The Priority Queue, `dist` array, `parent` array, and final `path` output list all take $O(V)$ space. Overall bounded strictly by $O(V+E)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Printing the actual path is the most common follow-up to writing Dijkstra. The interviewer expects you to quickly weave in the parent array without over-complicating the core algorithm."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we initialize `parent[i] = i` instead of just 0 or -1?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because it gives us a perfectly elegant base case for the while loop."</p>
                            <p>If we set the source node's parent to itself (`parent[1] = 1`), our backtracking loop condition becomes incredibly simple: `while (parent[node] != node)`. The moment we hit the source, the loop inherently terminates without needing extra variables or null checks."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if there are multiple shortest paths that share the same distance?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The `parent` pointer simply retains the first one it discovered."</p>
                            <p>Because our relaxation check uses strictly less than (`dis + edW &lt; dist[adjNode]`), if an alternative path arrives with the *exact same* cumulative distance, it fails the `if` condition. The `parent` pointer remains glued to whichever predecessor established the shortest distance first."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>N:</label>
                          <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="5" />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1,2,2 | 2,5,5 | ..." />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={handleReset} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  {/* Pure Infinite Graph Space */}
                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      {renderMainGraphCanvas()}
                      
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

                  {/* Safely Docked State Arrays */}
                  <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                      {renderStateArrays()}
                  </div>
              </div>

              {/* RIGHT SIDEBAR - Adjacency, Stack & Variables safely separated */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
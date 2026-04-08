import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  shortestPathUnitWeight: {
    id: 'shortestPathUnitWeight',
    title: 'Shortest Path (Unit Weights)',
    icon: <Route size={16} />,
    complexity: 'Time: O(N + E) | Space: O(N + E)',
    theme: 'sky',
    code: `class Solution {
    public int[] shortestPath(int[][] edges,int n,int m, int src) {
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for(int i = 0;i<n;i++) {
            adj.add(new ArrayList<>());
        }
        for(int i = 0;i<m;i++) {
            adj.get(edges[i][0]).add(edges[i][1]);
            adj.get(edges[i][1]).add(edges[i][0]);
        }
        
        int dist[] = new int[n];
        for(int i = 0;i<n;i++) dist[i] = (int)1e9;
        dist[src] = 0;
        Queue<Integer> q = new LinkedList<>();
        q.add(src);
        while(!q.isEmpty()) {
            int node = q.peek();
            q.remove();
            for(int it : adj.get(node)) {
                if(dist[node] + 1 < dist[it]) {
                    dist[it] = 1 + dist[node];
                    q.add(it);
                }
            }
        }
        
        for(int i = 0;i<n;i++) {
            if(dist[i] == 1e9)
                dist[i] = -1;
        }
        return dist;
    }
}`,
    desc: "Finding the shortest path in an Undirected Graph with Unit Weights (all edges = 1) is incredibly efficient using Breadth-First Search (BFS). Because BFS radiates outward layer by layer, the first time we discover an unvisited node, it is mathematically guaranteed to be the shortest path! We simply keep track of distances, updating neighbors with `dist[node] + 1`."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|shortestPath|node|it|adj|dist|src|n|m|edges|q|get|add|isEmpty|peek|remove|length|LinkedList|Queue|ArrayList|List|Integer|String)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List'].includes(part);
            const isPointer = ['adj', 'node', 'it', 'n', 'm', 'i', 'q', 'dist', 'src', 'edges'].includes(part);
            const isMapCall = ['shortestPath', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length'].includes(part);
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

export default function ShortestPathUnitWeightVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('shortestPathUnitWeight');
  
  // Default: Matches the uploaded graph image exactly (GeeksforGeeks Example)
  // n = 9, edges=[[0,1],[0,3],[3,4],[4,5],[5,6],[1,2],[2,6],[6,7],[7,8],[6,8]], src=0
  const [nInput, setNInput] = useState('9');
  const [srcInput, setSrcInput] = useState('0');
  const [edgesInput, setEdgesInput] = useState('0,1 | 0,3 | 3,4 | 4,5 | 5,6 | 1,2 | 2,6 | 6,7 | 7,8 | 6,8');

  const [baseN, setBaseN] = useState(9);
  const [baseSrc, setBaseSrc] = useState(0);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0,1], [0,3], [3,4], [4,5], [5,6], [1,2], [2,6], [6,7], [7,8], [6,8]
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
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0 || n > 20) n = 9;
        
        let src = parseInt(srcInput.trim(), 10);
        if (isNaN(src) || src < 0 || src >= n) src = 0;

        let rows = edgesInput.split('|').map(r => r.trim());
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let pair = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            // u, v
            if (pair.length === 2 && !isNaN(pair[0]) && !isNaN(pair[1])) {
                let u = pair[0], v = pair[1];
                if(u >= 0 && u < n && v >= 0 && v < n) {
                    parsedEdges.push([u, v]);
                }
            }
        }

        setBaseN(n);
        setBaseSrc(src);
        setBaseEdges(parsedEdges);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [edgesInput, nInput, srcInput]);

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
  const graphRadius = Math.max(160, N * 30);
  const svgSize = graphRadius * 2 + 140; // Padding on all sides

  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(N).fill({x: 0, y: 0});
    if (N === 0) return pos;
    if (N === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < N; i++) {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
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
    const src = baseSrc;
    const edges = baseEdges;
    const m = edges.length;
    
    if (n === 0) return steps;

    // Simulation local state
    let adj: number[][] = Array.from({length: n}, () => []);
    let q: number[] = [];
    let dist: number[] = Array(n).fill(1e9);
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: clone1D(adj.map(a => [...a])), n, m, src, q: [...q], dist: clone1D(dist), edges, ...stateObj } 
    });

    add("Function Call", `public int[] shortestPath(int[][] edges,int n=${n},int m=${m}, int src=${src})\nInitiating BFS Shortest Path algorithm on Undirected Graph.`, 2, { phase: 'init' });
    
    // --- GRAPH FORMATION PHASE ---
    add("Form Graph", `ArrayList<ArrayList<Integer>> adj = new ArrayList<>();\nAllocating outer adjacency list.`, 3, { phase: 'init_graph' });
    
    for (let i = 0; i < n; i++) {
        add("Create Adj Rows", `for(int i = 0;i<n;i++)\nCreating empty lists for all ${n} vertices. i=${i}.`, 4, { phase: 'init_adj_row', scanI: i });
        adj[i] = [];
        add("Add Empty List", `adj.add(new ArrayList<>());\nRow ${i} allocated successfully.`, 5, { phase: 'add_adj_row', scanI: i });
    }

    for (let i = 0; i < m; i++) {
        add("Process Edges Loop", `for(int i = 0;i<m;i++)\nIterating through raw edge connections. Edge ${i}.`, 7, { phase: 'process_edges', scanI: i });
        const u = edges[i][0];
        const v = edges[i][1];
        
        adj[u].push(v);
        add("Inject Forward Edge", `adj.get(edges[i][0]).add(edges[i][1]);\nAdding edge ${u} -> ${v}.`, 8, { phase: 'inject_edge_fwd', scanI: i, activeNode: u, checkNode: v });
        
        adj[v].push(u);
        add("Inject Backward Edge", `adj.get(edges[i][1]).add(edges[i][0]);\nBecause graph is UNDIRECTED, adding edge ${v} -> ${u}.`, 9, { phase: 'inject_edge_bwd', scanI: i, activeNode: v, checkNode: u });
    }

    add("Init Distance Array", `int dist[] = new int[n];\nAllocated distance array.`, 12, { phase: 'init_dist' });
    add("Fill Distance Infinity", `for(int i = 0;i<n;i++) dist[i] = (int)1e9;\nInitializing all shortest path distances to mathematically infinity.`, 13, { phase: 'fill_dist_inf' });
    
    dist[src] = 0;
    add("Set Source Distance", `dist[src] = 0;\nThe distance from the source node (${src}) to itself is always 0.`, 14, { phase: 'set_dist_src' });

    add("Init Queue", `Queue<Integer> q = new LinkedList<>();\nCreating BFS queue.`, 15, { phase: 'init_queue' });
    
    q.push(src);
    add("Enqueue Source", `q.add(src);\nAdding our starting node ${src} to the queue to begin exploring layer 1.`, 16, { phase: 'enqueue_src' });

    while(q.length > 0) {
        add("While Queue Loop", `while(!q.isEmpty())\nQueue is not empty. Processing nodes layer by layer.`, 17, { phase: 'while_q' });
        
        let node = q[0];
        add("Peek Queue", `int node = q.peek();\nPeeking node ${node} at the front of the queue.`, 18, { phase: 'q_peek', activeNode: node });
        
        q.shift();
        add("Dequeue Node", `q.remove();\nRemoved node ${node} from the queue.`, 19, { phase: 'q_remove', activeNode: node });
        
        add("Neighbor Loop", `for(int it : adj.get(node))\nIterating all neighbors connected to node ${node}.`, 20, { phase: 'for_it_adj', activeNode: node });

        for(let it of adj[node]) {
            let currDistNode = dist[node];
            let currDistIt = dist[it] === 1e9 ? '∞' : dist[it];
            let isRelaxable = dist[node] + 1 < dist[it];

            add("Evaluate Relaxation", `if(dist[node] + 1 < dist[it])\nIs ${currDistNode} + 1 < ${currDistIt}?`, 21, { phase: 'eval_relax', activeNode: node, checkNode: it, isRelaxable });

            if(isRelaxable) {
                dist[it] = 1 + dist[node];
                add("Relax Distance!", `dist[it] = 1 + dist[node];\nYES! Found a mathematically shorter path to node ${it}. Updating its distance to ${dist[it]}.`, 22, { phase: 'do_relax', activeNode: node, checkNode: it, newDist: dist[it] });
                
                q.push(it);
                add("Enqueue Relaxed Node", `q.add(it);\nBecause we found a shorter path to ${it}, we must enqueue it to later explore its subsequent neighbors!`, 23, { phase: 'enqueue_relax', activeNode: node, checkNode: it });
            } else {
                add("Skip Relaxation", `NO. We have already found a shorter or equal path to node ${it} previously.`, 21, { phase: 'skip_relax', activeNode: node, checkNode: it });
            }
        }
    }

    add("Queue Empty Exit", `while(!q.isEmpty())\nQueue is perfectly empty. BFS traversal concluded. All reachable nodes relaxed!`, 17, { phase: 'done_while' });
    
    add("Post-Processing Loop", `for(int i = 0;i<n;i++)\nScanning for any nodes that were mathematically completely isolated.`, 28, { phase: 'post_scan_loop' });
    
    for(let i = 0; i < n; i++) {
        add("Check Infinity", `if(dist[i] == 1e9)\nDid node ${i} ever get reached?`, 29, { phase: 'check_inf', scanI: i });
        if(dist[i] === 1e9) {
            dist[i] = -1;
            add("Set Unreachable", `dist[i] = -1;\nNode ${i} was completely unreachable from the source. Setting distance to -1.`, 30, { phase: 'set_unreachable', scanI: i });
        }
    }

    add("Final Return", `return dist;\nAlgorithm complete. Returning the final shortest paths array.`, 32, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseEdges, baseSrc]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-sky-900 border-sky-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Route size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                    <CheckCircle2 size={24}/> SHORTEST PATHS FOUND
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm successfully mapped optimal shortest paths from source {st.src}.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('enqueue') || String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-rose-400' : (String(st.phase || '').includes('q_') ? 'text-fuchsia-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('scan') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-center justify-center gap-4 xl:gap-8 w-full p-4 overflow-x-auto">
          {/* dist[] Output Array Tracker */}
          <div className="flex flex-col items-center shrink-0 w-[400px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><Route size={12}/> dist[] Output (Shortest Paths)</span>
              <div className={`flex flex-col w-full bg-white border shadow-md rounded-2xl p-4 transition-all duration-500 ${st.isDone ? 'border-sky-400 ring-2 ring-sky-100 bg-sky-50' : 'border-slate-200'}`}>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                      {st.dist === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.dist || []).map((val: number, idx: number) => {
                          let isSource = idx === st.src;
                          let isInfinity = val === 1e9;
                          let isUnreachable = val === -1;
                          let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.checkNode === idx || (st.phase === 'set_dist_src' && isSource));
                          let isEvaluating = st.phase === 'eval_relax' && st.checkNode === idx;
                          let isSettingUnreachable = st.phase === 'set_unreachable' && st.scanI === idx;
                          
                          let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-sky-500 text-white border-sky-600 shadow-sm font-black";
                          if (isUnreachable) boxBg = "bg-rose-500 text-white border-rose-600 shadow-sm font-black";
                          
                          if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black";
                          if (isEvaluating) boxBg += " ring-2 ring-amber-400 scale-105";
                          if (isSettingUnreachable) boxBg = "bg-rose-500 text-white border-rose-600 scale-110 shadow-lg ring-2 ring-rose-300 animate-in zoom-in font-black";

                          return (
                              <div key={`dist-${idx}`} className="flex flex-col items-center relative">
                                  <span className={`text-[8px] font-mono font-bold mb-0.5 ${isSource ? 'text-sky-500' : 'text-slate-400'}`}>{isSource ? 'src' : idx}</span>
                                  <div className={`w-8 h-8 flex items-center justify-center font-mono text-sm rounded-lg border-2 transition-all duration-300 ${boxBg}`}>
                                      {isInfinity ? '∞' : val}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          {/* Adjacency List Component (Undirected) */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (adj)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-1 relative min-h-[150px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs">Awaiting memory allocation...</span> : (st.adj || []).map((neighbors: number[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;
                      let isScanRow = st.scanI === nodeIdx && (String(st.phase || '').includes('init_adj_row') || String(st.phase || '').includes('add_adj_row'));
                      
                      let isInjectFwdRow = st.phase === 'inject_edge_fwd' && st.activeNode === nodeIdx;
                      let isInjectBwdRow = st.phase === 'inject_edge_bwd' && st.activeNode === nodeIdx;

                      let highlightRow = isActiveRow || isScanRow || isInjectFwdRow || isInjectBwdRow;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isInjectFwdRow || isInjectBwdRow ? 'bg-amber-50 border border-amber-200 shadow-sm scale-[1.02]' : (highlightRow ? 'bg-sky-50 border border-sky-200 shadow-sm' : 'bg-transparent border border-transparent')}`}>
                              <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isInjectFwdRow || isInjectBwdRow ? 'bg-amber-500 text-white' : (highlightRow ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={isInjectFwdRow || isInjectBwdRow ? 'text-amber-400' : (highlightRow ? 'text-sky-400' : 'text-slate-300')} />
                              <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                  {neighbors.map((neighborVal: number, nIdx: number) => {
                                      let isChecking = (isActiveRow || isScanRow) && st.checkNode === neighborVal;
                                      let isJustInjected = (isInjectFwdRow || isInjectBwdRow) && st.checkNode === neighborVal && nIdx === neighbors.length - 1;

                                      let neighborBg = 'transparent border border-transparent';
                                      let neighborText = highlightRow ? 'text-sky-700' : 'text-slate-500';

                                      if (isChecking) {
                                          neighborBg = 'bg-rose-400 text-white shadow-sm scale-110 border border-rose-500';
                                          neighborText = 'text-white';
                                      } else if (isJustInjected) {
                                          neighborBg = 'bg-amber-500 text-white shadow-md scale-110 animate-in zoom-in border border-amber-600';
                                          neighborText = 'text-white font-black';
                                      }

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${neighborBg} ${neighborText}`}>
                                                  {neighborVal}
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

          {/* Queue Component */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Queue&lt;Integer&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (OUT)</span>
                      <span>BACK (IN)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 transition-all duration-500">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.q || []).map((val: number, i: number) => {
                          let isEntering = String(st.phase || '').includes('enqueue') && i === st.q.length - 1;
                          let isTop = i === 0;
                          let isPopping = isTop && (st.phase === 'q_peek' || st.phase === 'q_remove');
                          
                          return (
                              <div key={`qf-${i}-${val}`} className={`px-4 py-2 flex flex-col items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-110' : (isPopping ? 'bg-amber-400 border-amber-500 text-white animate-pulse ring-4 ring-amber-200 scale-110 z-10 relative' : (isTop ? 'bg-fuchsia-500 border-fuchsia-600' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-sm">{val}</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">n:</span>
                          <span className="font-bold text-slate-700">{st.n !== undefined ? st.n : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">m:</span>
                          <span className="font-bold text-slate-700">{st.m !== undefined ? st.m : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-sky-500">src (Source):</span>
                          <span className="font-bold text-sky-700">{st.src !== undefined ? st.src : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-fuchsia-500">node (Active):</span>
                          <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">it (Neighbor):</span>
                          <span className="font-bold text-rose-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Route size={14} className="text-sky-500"/> BFS Unit Edge Relaxation</span>
                      
                      <div className="flex items-center gap-4 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-fuchsia-500 mb-1">dist[{st.activeNode}]</span>
                              <span className="bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200">{st.dist[st.activeNode] === 1e9 ? '∞' : st.dist[st.activeNode]}</span>
                          </div>
                          <span className="text-slate-400 font-normal">+</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-emerald-500 mb-1">weight</span>
                              <span className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">1</span>
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
                      {st.phase === 'skip_relax' && (
                          <div className="mt-6 flex items-center gap-3 bg-slate-100 text-slate-500 px-6 py-2 rounded-full border border-slate-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><X size={16}/> Condition False. Ignored.</span>
                          </div>
                      )}
                  </div>
              )}

              <div style={{ width: svgSize, height: svgSize }} className="relative origin-center">
                  
                  {/* Edges Layer (Undirected) */}
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return st.adj.map((neighbors: number[], u: number) => (
                              neighbors.map((v: number) => {
                                  // Undirected graph logic: only draw each edge once mathematically
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
                                  let isJustInjected = (st.phase === 'inject_edge_fwd' || st.phase === 'inject_edge_bwd') && ((st.activeNode === u && st.checkNode === v) || (st.activeNode === v && st.checkNode === u));
  
                                  let strokeColor = "#cbd5e1"; // slate-300
                                  let strokeWidth = "3";
                                  let animClass = "";
  
                                  if (isActiveChecking) {
                                      if(st.phase === 'do_relax') {
                                          strokeColor = "#10b981"; // emerald-500
                                          strokeWidth = "6";
                                          animClass = "animate-pulse";
                                      } else {
                                          strokeColor = "#f43f5e"; // rose-500 (evaluating)
                                          strokeWidth = "5";
                                      }
                                  } else if (isJustInjected) {
                                      strokeColor = "#f59e0b"; // amber-500 injected
                                      strokeWidth = "6";
                                      animClass = "animate-in fade-in zoom-in";
                                  }

                                  // Notice NO arrow heads for undirected graph!
                                  return (
                                      <g key={edgeKey} className={`transition-all duration-300 ${animClass}`}>
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                          />
                                      </g>
                                  );
                              })
                          ));
                      })()}
                  </svg>

                  {/* Nodes Layer - Centered exactly on the coordinate space */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {nodePositions.map((pos, idx) => {
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isQueued = (st.q || []).includes(idx);
                        
                        let distValue = st.dist ? st.dist[idx] : 1e9;
                        let isInfinity = distValue === 1e9;
                        let isUnreachable = distValue === -1;
                        let isVisited = !isInfinity && !isUnreachable && st.dist && idx !== st.src;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isQueued) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg';
                        } else if (isVisited) {
                            bgClass = 'bg-sky-600 text-white border-sky-700 shadow-md opacity-90';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isActive) {
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
                                
                                {/* Label for Distance on Graph! */}
                                {st.phase && (st.phase.includes('relax') || st.phase === 'init_dist' || st.phase === 'fill_dist_inf' || st.phase === 'set_dist_src' || st.phase === 'set_unreachable' || st.isDone) && (
                                    <span className={`absolute -bottom-7 text-[10px] px-2 py-0.5 rounded font-black border shadow-sm uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${st.phase === 'do_relax' && isChecking ? 'bg-emerald-500 text-white border-emerald-600 scale-125 z-50' : (isUnreachable ? 'bg-rose-500 text-white border-rose-600' : 'bg-white text-sky-600 border-sky-200')}`}>
                                        d: {isInfinity ? '∞' : distValue}
                                    </span>
                                )}

                                {isQueued && !isActive && <span className="absolute -top-6 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black border border-emerald-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Queued</span>}
                                {idx === st.src && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black border border-sky-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Source</span>}
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
                  <span>BFS Level Order Relaxation</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Route size={28}/> Shortest Path via Breadth-First Search</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Finding the shortest path in an Undirected Graph where all edges have the exact same weight (Unit Distance) doesn't require complex tools like Dijkstra's priority queue. Instead, we can simply rely on the natural layer-by-layer expansion of a standard <strong>Breadth-First Search (BFS)</strong>!</p>
                        <p>Because BFS visits nodes in increasing order of their distance from the source, the <em>first</em> time we encounter an unvisited node, the path we took to get there is mathematically guaranteed to be the shortest path.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Test Case 1 */}
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Connected Component</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>N:</strong> 9, <strong>m:</strong> 10<br/><strong>edges:</strong> [[0,1], [0,3], [3,4], [4,5], [5,6], [1,2], [2,6], [6,7], [7,8], [6,8]]<br/><strong>src:</strong> 0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output (dist[]):</span>
                            <span className="text-slate-300 block mb-4 font-black">[0, 1, 2, 1, 2, 3, 3, 4, 4]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Node 0 is distance 0.<br/>
                                Neighbors 1 & 3 are distance 1.<br/>
                                Their neighbors 2 & 4 are distance 2.<br/>
                                The path to 6 is shortest via 0&rarr;1&rarr;2&rarr;6 (dist 3) rather than 0&rarr;3&rarr;4&rarr;5&rarr;6 (dist 4).
                            </span>
                        </div>

                        {/* Test Case 2 */}
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Unreachable Nodes</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>N:</strong> 4<br/><strong>edges:</strong> [[0,1], [0,2]]<br/><strong>src:</strong> 0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output (dist[]):</span>
                            <span className="text-slate-300 block mb-4 font-black">[0, 1, 1, -1]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Starting at node 0, we can easily reach 1 and 2 in 1 step.<br/>
                                However, node 3 is completely disconnected. The algorithm identifies this (dist remains 1e9) and replaces it with -1 in the final array.
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
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="9" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>src</label>
                            <input type="number" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-sky-600`} placeholder="0" />
                        </div>
                        <div className="space-y-1.5 md:col-span-4">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Undirected Edges (u, v) | separator</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="0,1 | 0,3 | 3,4 | ..." />
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
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Route size={14} className={`text-${themeColor}-500`}/> BFS Shortest Path Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-sky-100 text-sky-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding why BFS perfectly discovers shortest paths in unweighted scenarios.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-sky-500"/> Phase 1: Layered Expansion (BFS)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Breadth-First Search radiates outward from the source node perfectly evenly. First it visits all nodes exactly 1 edge away, then all nodes exactly 2 edges away, etc. Because every edge has a mathematical weight of 1, the shortest path is literally just the path with the fewest edges.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Route size={24} className="text-emerald-500"/> Phase 2: Sequential Distance Update</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We initialize a <code>dist[]</code> array with Infinity. When we pull a node from the queue, we look at its neighbors. If <code>dist[node] + 1</code> is less than the neighbor's current recorded distance, we update the neighbor's distance and push the neighbor onto the queue! If we reach a neighbor we've already discovered, its distance will already be optimal, so we safely ignore it.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N + E)</strong><br/>The queue processes each node strictly once. For each node, we iterate over its edges. Over the entire execution, we will traverse exactly $N$ nodes and $2E$ edges (since it is undirected). This provides a perfectly linear $O(N+E)$ bound.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N + E)</strong><br/>The adjacency list requires $O(N+E)$ to map out the connections. The queue requires worst-case $O(N)$ memory. The distance array takes $O(N)$. Overall bounded by $O(N+E)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-sky-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This algorithm is crucial. Interviewers will want to know if you can identify when Dijkstra's algorithm is mathematically overkill."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can I use Dijkstra's Algorithm instead?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it is unnecessarily slow."</p>
                            <p>Dijkstra's uses a Min-Heap (Priority Queue) which costs $O(\log V)$ for every insertion/extraction. This brings the time complexity to $O(E \log V)$. Because our edge weights are identical (unit 1), a standard FIFO Queue natively maintains sorted distance order. We get $O(1)$ operations with standard BFS, dropping total time to purely linear $O(V+E)$."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if the graph has disconnected components?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The unreached nodes remain at Infinity."</p>
                            <p>If the graph is disconnected, our BFS queue will completely empty out without ever traversing to those isolated nodes. Their values in the `dist[]` array will remain undisturbed at `1e9`. The final post-processing loop will seamlessly scan the array and flip those `1e9` values to `-1`."</p>
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
                          <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="9" />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>src:</label>
                          <input type="number" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-sky-600`} placeholder="0" />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="0,1 | 0,3 | ..." />
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
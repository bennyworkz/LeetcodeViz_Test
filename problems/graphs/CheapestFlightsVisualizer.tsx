import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  cheapestFlights: {
    id: 'cheapestFlights',
    title: 'Cheapest Flights Within K Stops',
    icon: <Plane size={16} />,
    complexity: 'Time: O(E) | Space: O(V + E)',
    theme: 'cyan',
    code: `class Tuple {
    int first, second, third;
    Tuple(int first, int second, int third) {
        this.first = first;
        this.second = second;
        this.third = third;
    }
}
class Solution {
    public int CheapestFLight(int n, int flights[][], int src, int dst, int K) {
        ArrayList<ArrayList<Pair>> adj = new ArrayList<>();
        for(int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        int m = flights.length;
        for(int i = 0; i < m; i++) {
            adj.get(flights[i][0]).add(new Pair(flights[i][1], flights[i][2]));
        }
        
        Queue<Tuple> q = new LinkedList<>();
        q.add(new Tuple(0, src, 0));
        
        int[] dist = new int[n];
        for(int i = 0; i < n; i++) {
            dist[i] = (int)(1e9);
        }
        dist[src] = 0;
        
        while(!q.isEmpty()) {
            Tuple it = q.peek();
            q.remove();
            int stops = it.first;
            int node = it.second;
            int cost = it.third;
            
            if(stops > K) continue;
            
            for(Pair iter: adj.get(node)) {
                int adjNode = iter.first;
                int edW = iter.second;
                
                if(cost + edW < dist[adjNode] && stops <= K) {
                    dist[adjNode] = cost + edW;
                    q.add(new Tuple(stops + 1, adjNode, cost + edW));
                }
            }
        }
        
        if(dist[dst] == (int)(1e9)) return -1;
        return dist[dst];
    }
}`,
    desc: "To find the cheapest flight with a strict limit on stops (K), we CANNOT use standard Dijkstra's Priority Queue. A Priority Queue sorts by distance and might bypass paths that take slightly longer but use fewer stops, ruining the graph's level-order. Instead, we use a standard FIFO Queue! Because stops increase uniformly by exactly 1 per flight, a FIFO Queue inherently guarantees we process the flights strictly level-by-level (0 stops, then 1 stop, then 2 stops). We track the minimum cost to reach each node, and aggressively reject paths that exceed K stops!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|CheapestFLight|flights|Tuple|Pair|LinkedList|Queue|PriorityQueue|ArrayList|List|Integer|String|pq|q|n|m|src|dst|K|dist|stops|node|cost|adjNode|edW|adj|it|add|isEmpty|peek|remove|length|size|continue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'static', 'return', 'if', 'else', 'new', 'for', 'while', 'continue'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'PriorityQueue', 'ArrayList', 'List', 'Tuple', 'Pair'].includes(part);
            const isPointer = ['flights', 'pq', 'q', 'n', 'm', 'src', 'dst', 'K', 'dist', 'stops', 'node', 'cost', 'adjNode', 'edW', 'adj', 'it', 'iter', 'first', 'second', 'third', 'i'].includes(part);
            const isMapCall = ['CheapestFLight', 'add', 'remove', 'isEmpty', 'peek', 'length', 'size', 'get'].includes(part);
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

export default function CheapestFlightsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('cheapestFlights');
  
  // Default: Match exact Leetcode Example 1 from screenshot
  const [nInput, setNInput] = useState('4');
  const [edgesInput, setEdgesInput] = useState('0,1,100 | 1,2,100 | 2,0,100 | 1,3,600 | 2,3,200');
  const [srcInput, setSrcInput] = useState('0');
  const [dstInput, setDstInput] = useState('3');
  const [kInput, setKInput] = useState('1');

  const [baseN, setBaseN] = useState(4);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0,1,100], [1,2,100], [2,0,100], [1,3,600], [2,3,200]
  ]);
  const [baseSrc, setBaseSrc] = useState(0);
  const [baseDst, setBaseDst] = useState(3);
  const [baseK, setBaseK] = useState(1);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const loadTestCase1 = () => {
      setNInput('4');
      setEdgesInput('0,1,100 | 1,2,100 | 2,0,100 | 1,3,600 | 2,3,200');
      setSrcInput('0');
      setDstInput('3');
      setKInput('1');
  };

  const loadTestCase2 = () => {
      setNInput('3');
      setEdgesInput('0,1,100 | 1,2,100 | 0,2,500');
      setSrcInput('0');
      setDstInput('2');
      setKInput('0'); // K=0 allows 0->2 direct (cost 500) instead of 0->1->2
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0) n = 4;
        let s = parseInt(srcInput.trim(), 10);
        if (isNaN(s) || s < 0 || s >= n) s = 0;
        let d = parseInt(dstInput.trim(), 10);
        if (isNaN(d) || d < 0 || d >= n) d = 3;
        let k = parseInt(kInput.trim(), 10);
        if (isNaN(k) || k < 0) k = 1;

        let rows = edgesInput.split('|').map(r => r.trim());
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if (cells.length === 3 && cells[0] < n && cells[1] < n) {
                parsedEdges.push(cells);
            }
        }
        
        setBaseN(n);
        setBaseEdges(parsedEdges);
        setBaseSrc(s);
        setBaseDst(d);
        setBaseK(k);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, edgesInput, srcInput, dstInput, kInput]);

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

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const flights = baseEdges;
    const src = baseSrc;
    const dst = baseDst;
    const K = baseK;
    
    if (n === 0) return steps;

    // Local state to track
    let adj: {v: number, cost: number}[][] = Array.from({length: n}, () => []);
    let q: {stops: number, node: number, cost: number}[] = [];
    let dist: number[] = Array(n).fill(1e9);
    let distHistory: number[][] = Array.from({length: n}, () => []);

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: clone1D(adj.map(a => [...a])), q: [...q], dist: clone1D(dist), distHistory: distHistory.map(a => [...a]), n, src, dst, K, flights, ...stateObj } 
    });

    add("Function Call", `public int CheapestFLight(int n=${n}, flights, src=${src}, dst=${dst}, K=${K})\nInitiating BFS to find cheapest flight.`, 10, { phase: 'init' });
    
    add("Init Adjacency List", `ArrayList<ArrayList<Pair>> adj = new ArrayList<>();\nAllocated adjacency structure.`, 11, { phase: 'init_graph' });
    
    for(let i = 0; i < n; i++) adj[i] = [];
    add("Allocate Nodes", `for(int i = 0; i < n; i++) { adj.add(new ArrayList<>()); }`, 13, { phase: 'alloc_adj' });

    for (let f of flights) adj[f[0]].push({v: f[1], cost: f[2]});
    add("Populate Flights", `for(int i = 0; i < m; i++) {\n    adj.get(flights[i][0]).add(...);\n}\nDirected Graph fully populated.`, 17, { phase: 'pop_edges' });

    add("Init Queue", `Queue<Tuple> q = new LinkedList<>();\nCreated standard FIFO Queue. We DO NOT use a PriorityQueue here!`, 20, { phase: 'init_queue' });
    
    q.push({stops: 0, node: src, cost: 0});
    add("Enqueue Source", `q.add(new Tuple(0, src, 0));\nPushed starting tuple {stops:0, node:${src}, cost:0}.`, 21, { phase: 'q_add_src' });

    add("Init Dist Array", `int[] dist = new int[n];\nAllocated tracking array for minimum costs.`, 23, { phase: 'init_dist_ds' });
    
    for(let i=0; i<n; i++) dist[i] = 1e9;
    add("Set Dist Infinity", `for(int i = 0; i < n; i++) dist[i] = (int)(1e9);\nAll costs initialized to mathematical infinity.`, 25, { phase: 'dist_set_inf' });

    dist[src] = 0;
    distHistory[src].push(0);
    add("Set Source Dist", `dist[src] = 0;\nCost to stay at the starting city is 0.`, 27, { phase: 'set_dist_src' });

    while(q.length > 0) {
        add("While Queue Loop", `while(!q.isEmpty())\nQueue is not empty. Processing the next flight route!`, 29, { phase: 'while_q' });
        
        let it = q[0];
        add("Peek Queue", `Tuple it = q.peek();\nPeeking the next route to evaluate.`, 30, { phase: 'q_peek', activeStops: it.stops, activeNode: it.node, activeCost: it.cost });
        
        q.shift();
        add("Dequeue Tuple", `q.remove();\nPopped tuple from standard Queue.`, 31, { phase: 'q_remove', activeStops: it.stops, activeNode: it.node, activeCost: it.cost });

        let stops = it.stops;
        let node = it.node;
        let cost = it.cost;
        
        add("Extract Variables", `int stops = it.first;\nint node = it.second;\nint cost = it.third;`, 34, { phase: 'extract_vars', activeStops: stops, activeNode: node, activeCost: cost });
        
        add("Check Stop Limit", `if(stops > K) continue;\nChecking if current route exceeds our limit of ${K} stops. Current stops: ${stops}.`, 36, { phase: 'check_k', activeStops: stops, activeNode: node, activeCost: cost });
        
        if (stops > K) {
            add("Stop Limit Exceeded!", `if(stops > K) continue;\nRoute discarded! It took ${stops} stops, which is strictly greater than K=${K}.`, 36, { phase: 'k_exceeded', activeStops: stops, activeNode: node, activeCost: cost, failedK: true });
            continue;
        }

        add("Neighbors Loop", `for(Pair iter: adj.get(node))\nIterating all departing flights from city ${node}.`, 38, { phase: 'for_adj', activeStops: stops, activeNode: node, activeCost: cost });

        for (let iter of adj[node]) {
            let adjNode = iter.v;
            let edW = iter.cost;
            
            add("Extract Flight", `int adjNode = iter.first;\nint edW = iter.second;\nEvaluating flight to ${adjNode} costing ${edW}.`, 40, { phase: 'extract_flight', activeStops: stops, activeNode: node, activeCost: cost, adjNode: adjNode, edW: edW });

            let currDistVal = dist[adjNode];
            let isRelaxable = (cost + edW < currDistVal) && (stops <= K);

            let evalDesc = `if(cost + edW < dist[adjNode] && stops <= K)\nEvaluating: (${cost} + ${edW} < ${currDistVal === 1e9 ? '∞' : currDistVal}) AND (${stops} <= ${K})`;
            if(cost + edW >= currDistVal) evalDesc += `\nFAILED: Found a cheaper or equal route to ${adjNode} earlier.`;
            else if(stops > K) evalDesc += `\nFAILED: Not enough allowed stops to make this connection.`;
            else evalDesc += `\nPASSED! This route is cheaper and within stop limits!`;

            add("Evaluate Conditions", evalDesc, 42, { phase: 'eval_relax', activeStops: stops, activeNode: node, activeCost: cost, adjNode: adjNode, edW: edW, isRelaxable: isRelaxable, currDistVal });

            if (isRelaxable) {
                if (dist[adjNode] !== 1e9) {
                    distHistory[adjNode].push(dist[adjNode]);
                }
                dist[adjNode] = cost + edW;
                
                add("Relax Distance", `dist[adjNode] = cost + edW;\nUpdated minimum cost to reach ${adjNode} to ${cost + edW}.`, 43, { phase: 'do_relax', activeStops: stops, activeNode: node, activeCost: cost, adjNode: adjNode, edW: edW, newDist: cost + edW });

                q.push({stops: stops + 1, node: adjNode, cost: cost + edW});
                add("Enqueue Next Stop", `q.add(new Tuple(stops + 1, adjNode, cost + edW));\nAdded {stops:${stops+1}, city:${adjNode}, cost:${cost+edW}} to Queue for subsequent layer processing.`, 44, { phase: 'q_add', activeStops: stops, activeNode: node, activeCost: cost, adjNode: adjNode, edW: edW, newDist: cost + edW });
            }
        }
    }

    add("Queue Empty Exit", `while(!q.isEmpty())\nQueue is completely empty. All possible flights within ${K} stops analyzed.`, 29, { phase: 'done_while' });
    
    add("Final Reachability Check", `if(dist[dst] == (int)(1e9)) return -1;\nChecking if we successfully mapped a finite cost to destination ${dst}.`, 49, { phase: 'check_final' });

    if (dist[dst] === 1e9) {
        add("Return Result", `return -1;\nTarget unreachable within ${K} stops.`, 49, { phase: 'done', isDone: true, isSuccess: false });
    } else {
        add("Return Result", `return dist[dst];\nAlgorithm concluded. Optimal cost is ${dist[dst]}.`, 50, { phase: 'done', isDone: true, isSuccess: true, finalCost: dist[dst] });
    }

    return steps;
  }, [baseN, baseEdges, baseSrc, baseDst, baseK]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => setCurrentStep(0); 
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
  const resetPanZoom = () => { setPan({x:0, y:0}); setZoom(0.85); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  // Directed Graph Layout Mathematics
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseN).fill({x: 0, y: 0});
    if (baseN === 0) return pos;
    if (baseN === 1) return [{x: 0, y: 0}];

    const radius = Math.max(150, baseN * 35);
    for (let i = 0; i < baseN; i++) {
        // Source on left, Dest on right if possible, others scattered. Simple circle is safest.
        const angle = (i / baseN) * 2 * Math.PI + Math.PI;
        pos[i] = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Plane size={100} className="text-white"/></div>
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
                    {st.isSuccess ? "CHEAPEST FLIGHT FOUND" : "NO VALID ROUTE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `The absolute cheapest flight path adhering to the <= ${st.K} stops limit costs ${curStepData.state?.finalCost}.` : `It is mathematically impossible to reach the destination within the allowed ${st.K} stops.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('q_add') || String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-amber-400' : (String(st.phase || '').includes('q_pop') || String(st.phase || '').includes('q_remove') || String(st.phase || '').includes('extract') ? 'text-cyan-400' : (String(st.phase || '').includes('check_k') || String(st.phase || '').includes('k_exceeded') ? 'text-rose-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          {/* Adjacency List Component */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (Directed)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-1.5 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.adj || []).map((neighbors: {v: number, cost: number}[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-cyan-50 border border-cyan-200 shadow-sm scale-[1.02] z-10' : 'bg-slate-50/50 border border-transparent hover:bg-slate-50'}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-cyan-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={16} className={isActiveRow ? 'text-cyan-400' : 'text-slate-300'} />
                              <div className="flex flex-wrap gap-2 items-center font-mono text-sm leading-none pt-0.5">
                                  <span className="text-slate-400 text-lg">{'{'}</span>
                                  {neighbors.length === 0 && <span className="text-slate-400 italic text-xs">empty</span>}
                                  {neighbors.map((neighborObj, nIdx) => {
                                      let isChecking = isActiveRow && st.adjNode === neighborObj.v;
                                      let neighborText = isChecking ? 'text-cyan-700 font-black scale-110 bg-cyan-100 px-1.5 py-0.5 rounded shadow-sm' : 'text-slate-600 font-bold';
                                      let wtText = isChecking ? 'text-cyan-600 font-bold' : 'text-slate-400 font-medium';

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`flex items-center gap-1.5 transition-all ${neighborText}`}>
                                                  {neighborObj.v} <span className={`text-[11px] ${wtText}`}>(cost:{neighborObj.cost})</span>
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
          
          {/* FIFO Queue Component */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> FIFO Queue&lt;Tuple&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[140px] max-h-[260px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (FIFO OUT)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.q || []).map((tup: {stops: number, node: number, cost: number}, i: number) => {
                          let isNewArrival = String(st.phase || '').includes('q_add') && tup.node === st.adjNode && tup.cost === st.newDist && tup.stops === st.activeStops + 1;
                          let isTop = i === 0;
                          let isPopping = isTop && (String(st.phase || '').includes('q_peek') || st.phase === 'q_remove' || st.phase.includes('extract_vars'));
                          
                          return (
                              <div key={`qt-${i}-${tup.node}-${tup.cost}`} className={`px-3 py-2 flex flex-col gap-1 font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-cyan-500 border-cyan-600 text-white animate-pulse ring-4 ring-cyan-200 scale-105 z-10 relative' : (isTop ? 'bg-slate-800 border-slate-900' : 'bg-slate-700 border-slate-800'))}`}>
                                  <div className="flex justify-between items-center w-full">
                                      <span className={`text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded shadow-inner ${tup.stops > st.K ? 'bg-rose-500 text-white' : 'bg-black/30'}`}>stops: {tup.stops}</span>
                                      <span className="text-sm tracking-widest">node: {tup.node}</span>
                                  </div>
                                  <div className="text-xs opacity-80 text-right w-full pr-1">cost: {tup.cost}</div>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">Limit (K):</span>
                          <span className="font-bold text-rose-500">{st.K !== undefined ? st.K : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">stops:</span>
                          <span className={`font-bold ${st.failedK ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>{st.activeStops !== undefined ? st.activeStops : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-cyan-500">node (Active):</span>
                          <span className="font-bold text-cyan-700 uppercase tracking-widest">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-cyan-500">cost:</span>
                          <span className="font-bold text-cyan-700">{st.activeCost !== undefined ? st.activeCost : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-emerald-500">edW:</span>
                          <span className="font-bold text-emerald-700">{st.edW !== undefined ? st.edW : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-emerald-500">adjNode (Neighbor):</span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest">{st.adjNode !== undefined ? st.adjNode : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
  };

  const renderMainCanvas = () => {
      if (st.adj === undefined || st.dist === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const renderedEdges = new Set<string>();
      const svgSize = 500;

      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
              
              {/* Distance Relaxation HUD */}
              {st.phase && st.phase.includes('relax') && st.activeNode !== undefined && st.adjNode !== undefined && (
                  <div className="absolute top-8 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Plane size={14} className="text-cyan-500"/> Flight Relaxation</span>
                      <div className="flex items-center gap-4 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-cyan-500 mb-1">cost</span>
                              <span className="bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">{st.activeCost}</span>
                          </div>
                          <span className="text-slate-400 font-normal">+</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-emerald-500 mb-1">edW</span>
                              <span className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">{st.edW}</span>
                          </div>
                          <span className="text-slate-400 font-normal">&lt;</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-rose-500 mb-1">dist[{st.adjNode}]</span>
                              <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">{st.currDistVal === 1e9 ? '∞' : st.currDistVal}</span>
                          </div>
                      </div>
                      {st.phase === 'do_relax' && (
                          <div className="mt-6 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full border border-emerald-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16}/> Route is Cheaper!</span>
                              <ArrowRight size={16} />
                              <span className="font-black font-mono">dist[{st.adjNode}] = {st.newDist}</span>
                          </div>
                      )}
                      {st.phase === 'eval_relax' && !st.isRelaxable && (
                          <div className="mt-6 flex items-center gap-3 bg-slate-100 text-slate-500 px-6 py-2 rounded-full border border-slate-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><X size={16}/> Path Rejected.</span>
                          </div>
                      )}
                  </div>
              )}

              {/* Stop K Failure HUD */}
              {st.failedK && (
                  <div className="absolute top-1/3 flex flex-col items-center bg-rose-50/95 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-rose-300 shadow-2xl shadow-rose-900/20 z-50 animate-in zoom-in">
                      <ShieldAlert size={48} className="text-rose-500 mb-2 animate-bounce"/>
                      <span className="text-2xl font-black uppercase tracking-tight text-rose-700 mb-1">Stops Exceeded!</span>
                      <span className="font-mono font-bold text-sm text-rose-600 border border-rose-200 bg-white px-4 py-2 rounded-lg mt-2">stops ({st.activeStops}) &gt; K ({st.K})</span>
                  </div>
              )}

              <div style={{ width: svgSize, height: svgSize }} className="relative origin-center mt-10">
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
                          </marker>
                          <marker id="arrowhead-relax" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                      </defs>

                      {(() => {
                          return st.flights.map((f: number[], idx: number) => {
                              let u = f[0], v = f[1], wt = f[2];
                              const p1 = nodePositions[u];
                              const p2 = nodePositions[v];
                              if (!p1 || !p2) return null;

                              const dx = p2.x - p1.x;
                              const dy = p2.y - p1.y;
                              const angle = Math.atan2(dy, dx);
                              const rOffset = 28; // Slightly larger for better arrow clearance
                              
                              const startX = p1.x + rOffset * Math.cos(angle);
                              const startY = p1.y + rOffset * Math.sin(angle);
                              const targetX = p2.x - rOffset * Math.cos(angle);
                              const targetY = p2.y - rOffset * Math.sin(angle);
                              
                              // Slight curve for directed edges to avoid overlap if a reverse edge exists
                              const midX = (startX + targetX) / 2 - dy * 0.15;
                              const midY = (startY + targetY) / 2 + dx * 0.15;

                              let isActiveChecking = st.activeNode === u && st.adjNode === v;
                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let marker = "url(#arrowhead)";
                              let animClass = "";
                              let labelClass = "bg-slate-100 text-slate-500 border-slate-200";

                              if (isActiveChecking) {
                                  if(st.phase === 'do_relax' || st.phase === 'q_add') {
                                      strokeColor = "#10b981"; 
                                      strokeWidth = "5";
                                      marker = "url(#arrowhead-relax)";
                                      animClass = "animate-pulse";
                                      labelClass = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-lg";
                                  } else {
                                      strokeColor = "#0ea5e9"; 
                                      strokeWidth = "4";
                                      marker = "url(#arrowhead-active)";
                                      labelClass = "bg-cyan-500 text-white border-cyan-600 scale-110 shadow-md";
                                  }
                              }

                              return (
                                  <g key={`edge-${u}-${v}-${idx}`} className={`transition-all duration-300 ${animClass}`}>
                                      <path 
                                          d={`M ${startX} ${startY} Q ${midX} ${midY} ${targetX} ${targetY}`}
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                          fill="none"
                                          markerEnd={marker}
                                      />
                                      <foreignObject x={midX - 15} y={midY - 15} width="30" height="30" className="overflow-visible">
                                          <div className={`w-full h-full flex items-center justify-center font-mono font-black text-[10px] rounded-full border shadow-sm transition-all duration-300 ${labelClass}`}>
                                              {wt}
                                          </div>
                                      </foreignObject>
                                  </g>
                              );
                          });
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {nodePositions.map((pos, idx) => {
                        let isActive = st.activeNode === idx;
                        let isChecking = st.adjNode === idx;
                        let isQueued = false;
                        if (st.q) for(let item of st.q) { if (item.node === idx) isQueued = true; }
                        
                        let distValue = st.dist ? st.dist[idx] : 1e9;
                        let isInfinity = distValue === 1e9;
                        let isVisited = !isInfinity && idx !== st.src;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        if (isActive) bgClass = 'bg-cyan-500 text-white border-cyan-600 shadow-xl';
                        else if (isQueued) bgClass = 'bg-slate-700 text-white border-slate-800 shadow-lg';
                        else if (isVisited) bgClass = 'bg-sky-100 text-sky-700 border-sky-300 shadow-md opacity-90';

                        let ringClass = '';
                        let zIndex = 'z-10';
                        if (isActive) { ringClass = 'ring-4 ring-cyan-500 ring-offset-2 border-transparent'; zIndex = 'z-40'; } 
                        else if (isChecking) { ringClass = 'ring-4 ring-emerald-400 ring-offset-2 border-transparent'; zIndex = 'z-30'; }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {idx === st.src && !isActive && <span className="absolute -top-6 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black border border-emerald-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Source</span>}
                                {idx === st.dst && !isActive && <span className="absolute -top-6 text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-black border border-rose-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Target</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>
          </div>
      );
  };

  const renderStateArrays = () => (
      <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] pb-6 relative z-30">
          <div className="flex flex-col items-center shrink-0 w-full mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> dist[] Array (Minimum Costs)</span>
              <div className="flex gap-2 items-end">
                  {st.dist === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.dist || []).map((val: number, idx: number) => {
                      let isSource = idx === st.src;
                      let isInfinity = val === 1e9;
                      let history = st.distHistory ? st.distHistory[idx] : [];
                      
                      let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.adjNode === idx || (st.phase === 'set_dist_src' && isSource));
                      let isEvaluating = st.phase === 'eval_relax' && st.adjNode === idx;
                      
                      let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-cyan-50 text-cyan-700 border-cyan-200 font-black shadow-sm";
                      if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                      if (isEvaluating) boxBg += " ring-2 ring-cyan-400 scale-105 z-10";

                      return (
                          <div key={`dist-${idx}`} className="flex flex-col items-center relative group">
                              <div className="absolute bottom-full mb-0.5 flex flex-col-reverse items-center justify-end gap-0 max-h-[80px] overflow-hidden leading-none">
                                  {(history || []).map((hVal: number, hIdx: number) => (
                                      <span key={`hd-${idx}-${hIdx}`} className="text-[11px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-[1.5px] leading-tight">{hVal === 1e9 ? '∞' : hVal}</span>
                                  ))}
                              </div>
                              <div className={`w-14 h-12 flex items-center justify-center font-mono text-base rounded-xl border-2 transition-all duration-300 ${boxBg}`}>
                                  {isInfinity ? '∞' : val}
                              </div>
                              <span className={`absolute top-full mt-2 text-[10px] font-mono font-black mb-0.5 ${isSource ? 'text-emerald-500' : 'text-slate-400'}`}>City {idx}</span>
                          </div>
                      )
                  })}
              </div>
          </div>
      </div>
  );

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>Dijkstra's BFS Variation</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Plane size={28}/> Flight Stops Restriction</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There are <code>n</code> cities connected by flights with costs. You need to find the cheapest price from <code>src</code> to <code>dst</code> with <strong>at most K stops</strong>.</p>
                        <p><strong>The Trap:</strong> Standard Dijkstra uses a Priority Queue to always greedily process the cheapest path. However, a cheap path might require <em>too many stops</em>. If the Priority Queue processes a cheap (but multi-stop) path first, it could permanently overwrite a node's minimum distance, accidentally locking us out of a slightly more expensive path that actually obeys the <code>K</code> constraint!</p>
                        <p><strong>The Solution:</strong> We strip out the Priority Queue and use a regular <strong>FIFO Queue</strong>. Because a regular queue processes nodes strictly in layers (0 stops, 1 stop, 2 stops...), we naturally enforce the level constraint without accidentally "skipping ahead".</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: The Trap Example</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 4, <strong>src:</strong> 0, <strong>dst:</strong> 3, <strong>K:</strong> 1<br/><strong>Flights:</strong> [0,1,100], [1,2,100], [2,0,100], [1,3,600], [2,3,200]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">700</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The absolute cheapest path is 0 &rarr; 1 &rarr; 2 &rarr; 3 (cost 400), but it takes 2 stops! Since K=1, we must take the 0 &rarr; 1 &rarr; 3 path (cost 700, 1 stop).</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Unreachable Restraint</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 3, <strong>src:</strong> 0, <strong>dst:</strong> 2, <strong>K:</strong> 0<br/><strong>Flights:</strong> [0,1,100], [1,2,100], [0,2,500]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">500</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">We are allowed 0 intermediate stops (must be a direct flight). The cheap path 0 &rarr; 1 &rarr; 2 is invalid. We MUST take the direct 500 cost flight.</span>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>N (Cities)</label>
                            <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>Flights [u, v, cost]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1`}>Src</label>
                            <input type="text" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner font-bold text-emerald-600`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-rose-600 pl-1`}>Dst</label>
                            <input type="text" value={dstInput} onChange={(e) => setDstInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner font-bold text-rose-600`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1`}>Max Stops (K)</label>
                            <input type="text" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner font-bold text-fuchsia-600`} />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 h-[650px]">
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Plane size={14} className={`text-${themeColor}-500`}/> Flights BFS Visualizer</span>
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            <div className="absolute inset-0 w-full h-full transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                                {renderMainCanvas()}
                            </div>
                        </div>
                        {/* Safe Bottom Dock for Arrays */}
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>
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
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-100 text-cyan-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Why standard Dijkstra Fails</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">The Priority Queue Trap and the necessity of Level-Order exploration.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-cyan-500"/> Phase 1: The Priority Queue Trap</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Imagine a graph where node A connects to B (cost 100). B connects to C (cost 100). And A connects to C directly (cost 500). If K=0 (0 stops allowed), the ONLY valid path is A&rarr;C. If we use a Priority Queue sorting by distance, the algorithm will process the A&rarr;B (100) path first, jump to C (cost 200 total), and update C's distance to 200. Because it used 1 stop (which exceeds K=0), it eventually discards it. But the damage is done: C's distance was overwritten to 200! Now, when the direct A&rarr;C path (cost 500) tries to evaluate, it sees <code>500 &lt; dist[C] (which is 200)</code>, evaluates to FALSE, and throws away the only valid path!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-emerald-500"/> Phase 2: The FIFO Queue Solution</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To prevent this, we MUST process all flights strictly level-by-level. First, we evaluate all direct flights (0 stops). Then, we evaluate all flights with 1 stop, and so on. A standard FIFO Queue guarantees this automatically, because we process nodes strictly in the order they were discovered. By the time we evaluate a 1-stop path, we are guaranteed that ALL possible 0-stop paths have already been perfectly evaluated.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(E)</strong><br/>Where E is the number of flights (edges). In the absolute worst case, we might process every single flight once per level. However, because we strictly limit the depth to K, and we don't have the overhead of Priority Queue sorting (O(log V)), the time complexity becomes incredibly efficient, practically O(E).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>We store the graph in an adjacency list requiring O(V + E) space. The Queue and the `dist` array require O(V) space. Overall, the memory footprint is O(V + E).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-cyan-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This question is designed explicitly to see if you blindly apply Dijkstra's template to every shortest-path problem, or if you actually understand the structural invariants that a Priority Queue breaks."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we just modify the Priority Queue to sort by stops instead of cost?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's redundant."</p>
                            <p>If you use a <code>PriorityQueue</code> and write a custom comparator to sort by <code>stops</code>, you are essentially forcing the PQ to behave exactly like a standard FIFO <code>Queue</code>. A standard Queue adds items to the back, which intrinsically sorts them by <code>stops</code> since stops only increase by +1 monotonically! Using a PQ just adds unnecessary O(log V) insertion time."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why don't we use a `visited[]` array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we might need to revisit a node if we find a cheaper path to it."</p>
                            <p>In standard BFS or DFS, a <code>visited</code> array prevents infinite loops. Here, we prevent infinite loops (and optimize) by only adding to the queue if <code>cost + edW &lt; dist[adjNode]</code>. This relaxation condition naturally prunes the search tree and guarantees we only revisit a node if we discovered a strictly superior route to it."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 shrink-0`}>N:</label>
                          <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-cyan-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 shrink-0 ml-2`}>Src:</label>
                          <input type="text" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-emerald-500 font-bold text-emerald-600`} />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-rose-600 shrink-0 ml-2`}>Dst:</label>
                          <input type="text" value={dstInput} onChange={(e) => setDstInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-rose-500 font-bold text-rose-600`} />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 shrink-0 ml-2`}>K:</label>
                          <input type="text" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-fuchsia-500 font-bold text-fuchsia-600`} />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 shrink-0 ml-2`}>Flights:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-cyan-500 font-bold`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={resetPanZoom} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute inset-0 w-full h-full transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
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
                  
                  {/* Safe Bottom Dock for Arrays */}
                  <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                      {renderStateArrays()}
                  </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
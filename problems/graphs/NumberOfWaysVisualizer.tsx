import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  numberOfWays: {
    id: 'numberOfWays',
    title: 'Number of Ways to Arrive at Destination',
    icon: <Route size={16} />,
    complexity: 'Time: O(E log V) | Space: O(V + E)',
    theme: 'violet',
    code: `class Pair {
    int first, second;
    Pair(int first, int second) {
        this.first = first;
        this.second = second;
    }
}
class Solution {
    static int countPaths(int n, List<List<Integer>> roads) {
        ArrayList<ArrayList<Pair>> adj = new ArrayList<>();
        for(int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        int m = roads.size();
        for(int i = 0; i < m; i++) {
            adj.get(roads.get(i).get(0)).add(new Pair(roads.get(i).get(1), roads.get(i).get(2)));
            adj.get(roads.get(i).get(1)).add(new Pair(roads.get(i).get(0), roads.get(i).get(2)));
        }
        
        PriorityQueue<Pair> pq = new PriorityQueue<Pair>((x,y) -> x.first - y.first);
        int[] dist = new int[n];
        int[] ways = new int[n];
        for(int i = 0; i < n; i++) {
            dist[i] = (int)(1e9);
            ways[i] = 0;
        }
        
        dist[0] = 0;
        ways[0] = 1;
        pq.add(new Pair(0, 0));
        int mod = (int)(1e9 + 7);
        
        while(!pq.isEmpty()) {
            int dis = pq.peek().first;
            int node = pq.peek().second;
            pq.remove();
            
            for(Pair it : adj.get(node)) {
                int adjNode = it.first;
                int edW = it.second;
                
                if(dis + edW < dist[adjNode]) {
                    dist[adjNode] = dis + edW;
                    pq.add(new Pair(dis + edW, adjNode));
                    ways[adjNode] = ways[node];
                }
                else if(dis + edW == dist[adjNode]) {
                    ways[adjNode] = (ways[adjNode] + ways[node]) % mod;
                }
            }
        }
        return ways[n-1] % mod;
    }
}`,
    desc: "A beautiful extension to standard Dijkstra's! Not only do we track the minimum distance (`dist[]`), but we simultaneously maintain a `ways[]` array. If we discover a strictly shorter path to a node, we inherit the number of ways from the parent (`ways[adj] = ways[node]`). If we discover an alternative path that takes the EXACT same minimum time, we perform a combinatorial sum: (`ways[adj] += ways[node]`)."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|countPaths|roads|Pair|LinkedList|Queue|PriorityQueue|ArrayList|List|Integer|String|pq|q|n|m|dist|ways|mod|node|adjNode|edW|adj|it|add|isEmpty|peek|remove|length|size|get|continue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'PriorityQueue', 'ArrayList', 'List', 'Pair'].includes(part);
            const isPointer = ['roads', 'pq', 'q', 'n', 'm', 'dist', 'ways', 'mod', 'node', 'adjNode', 'edW', 'adj', 'it', 'first', 'second', 'i', 'x', 'y', 'dis'].includes(part);
            const isMapCall = ['countPaths', 'add', 'remove', 'isEmpty', 'peek', 'length', 'size', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"') || part === '1e9' || part === '7';
            
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

export default function NumberOfWaysVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('numberOfWays');
  
  // Match Leetcode Example 1 from screenshot image_47bf65.jpg
  const [nInput, setNInput] = useState('7');
  const [edgesInput, setEdgesInput] = useState('0,6,7 | 0,1,2 | 1,2,3 | 1,3,3 | 6,3,3 | 3,5,1 | 6,5,1 | 2,5,1 | 0,4,5 | 4,6,2');

  const [baseN, setBaseN] = useState(7);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0,6,7], [0,1,2], [1,2,3], [1,3,3], [6,3,3], [3,5,1], [6,5,1], [2,5,1], [0,4,5], [4,6,2]
  ]);

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
      setNInput('7');
      setEdgesInput('0,6,7 | 0,1,2 | 1,2,3 | 1,3,3 | 6,3,3 | 3,5,1 | 6,5,1 | 2,5,1 | 0,4,5 | 4,6,2');
  };

  const loadTestCase2 = () => {
      setNInput('4');
      // Classic multi-path diamond
      setEdgesInput('0,1,2 | 0,2,2 | 1,3,2 | 2,3,2 | 0,3,4');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0) n = 7;

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
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
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

  const clone1D = (arr: any[]) => [...arr];

  // Generate trace strictly aligned with Java code Line numbers!
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const roads = baseEdges;
    
    if (n === 0) return steps;

    let adj: {v: number, wt: number}[][] = Array.from({length: n}, () => []);
    let pq: {dis: number, node: number}[] = [];
    let dist: number[] = Array(n).fill(1e9);
    let ways: number[] = Array(n).fill(0);
    
    let distHistory: number[][] = Array.from({length: n}, () => []);
    let waysHistory: number[][] = Array.from({length: n}, () => []);
    
    const MOD = 1e9 + 7;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: clone1D(adj.map(a => [...a])), q: [...pq], dist: clone1D(dist), ways: clone1D(ways), distHistory: distHistory.map(a => [...a]), waysHistory: waysHistory.map(a => [...a]), n, roads, ...stateObj } 
    });

    add("Function Call", `static int countPaths(int n=${n}, List<List<Integer>> roads)\nInitiating Dijkstra's variation for combinatorial paths.`, 9, { phase: 'init' });
    
    add("Init Adjacency List", `ArrayList<ArrayList<Pair>> adj = new ArrayList<>();\nAllocated undirected graph structure.`, 10, { phase: 'init_graph' });
    
    for(let i = 0; i < n; i++) adj[i] = [];
    add("Allocate Nodes", `for(int i = 0; i < n; i++) { adj.add(new ArrayList<>()); }`, 11, { phase: 'alloc_adj' });

    for (let r of roads) {
        adj[r[0]].push({v: r[1], wt: r[2]});
        adj[r[1]].push({v: r[0], wt: r[2]}); // Bi-directional!
    }
    add("Populate Roads", `for(int i = 0; i < m; i++) {\n    adj.get(...).add(...);\n}\nBi-directional Graph fully populated.`, 15, { phase: 'pop_edges' });

    add("Init Min-Heap", `PriorityQueue<Pair> pq = new PriorityQueue<Pair>((x,y) -> x.first - y.first);\nCreated Min-Heap sorting strictly by accumulated distance.`, 20, { phase: 'init_pq' });
    
    add("Init Dual Arrays", `int[] dist = new int[n];\nint[] ways = new int[n];\nAllocated 'dist' for optimal costs, and 'ways' for path combinations.`, 21, { phase: 'init_ds' });
    
    for(let i=0; i<n; i++) {
        dist[i] = 1e9;
        ways[i] = 0;
    }
    add("Set Base Arrays", `for(int i = 0; i < n; i++) {\n  dist[i] = (int)1e9;\n  ways[i] = 0;\n}\nSet unreached nodes to infinity cost and 0 combinatorial ways.`, 23, { phase: 'dist_set_inf' });

    dist[0] = 0;
    ways[0] = 1;
    distHistory[0].push(0);
    waysHistory[0].push(1);
    add("Init Source Logic", `dist[0] = 0;\nways[0] = 1;\nCost to start is 0. CRITICAL: We start with exactly 1 initial \"way\" to reach node 0!`, 28, { phase: 'set_dist_src' });

    pq.push({dis: 0, node: 0});
    add("Enqueue Source", `pq.add(new Pair(0, 0));\nPushed [dist:0, node:0] to Min-Heap.`, 30, { phase: 'pq_add_src' });

    add("Define Modulo", `int mod = (int)(1e9 + 7);\nLarge answers will wrap using modulo arithmetic.`, 31, { phase: 'init_mod' });

    while(pq.length > 0) {
        add("While PQ Loop", `while(!pq.isEmpty())\nMin-Heap is not empty. Extracting path with the absolute shortest distance!`, 33, { phase: 'while_q' });
        
        let it = pq[0];
        add("Peek Queue Variables", `int dis = pq.peek().first;\nint node = pq.peek().second;\nPeeking optimal node.`, 34, { phase: 'q_peek', activeDis: it.dis, activeNode: it.node });
        
        pq.shift();
        add("Dequeue Tuple", `pq.remove();\nPopped shortest route off Min-Heap.`, 36, { phase: 'q_remove', activeDis: it.dis, activeNode: it.node });

        let dis = it.dis;
        let node = it.node;

        add("Neighbors Loop", `for(Pair it : adj.get(node))\nIterating all intersecting roads from node ${node}.`, 38, { phase: 'for_adj', activeDis: dis, activeNode: node });

        for (let iter of adj[node]) {
            let adjNode = iter.v;
            let edW = iter.wt;
            
            add("Extract Road Details", `int adjNode = it.first;\nint edW = it.second;\nEvaluating road to intersection ${adjNode} taking ${edW} time.`, 39, { phase: 'extract_flight', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW });

            let currDistVal = dist[adjNode];
            let isShorter = (dis + edW < currDistVal);
            let isEqual = (dis + edW === currDistVal);

            let evalDesc = `if(dis + edW < dist[adjNode])\nChecking if strictly shorter: ${dis} + ${edW} < ${currDistVal === 1e9 ? '∞' : currDistVal}`;
            if (isShorter) evalDesc += `\nPASSED! Found a strictly faster way to reach ${adjNode}.`;
            else evalDesc += `\nFAILED: Route is slower or equal.`;
            
            add("Evaluate Strict Relaxation", evalDesc, 42, { phase: 'eval_relax_shorter', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW, isShorter, currDistVal });

            if (isShorter) {
                if (dist[adjNode] !== 1e9) distHistory[adjNode].push(dist[adjNode]);
                dist[adjNode] = dis + edW;
                
                add("Relax Distance", `dist[adjNode] = dis + edW;\nUpdated absolute minimum cost to reach ${adjNode} to ${dis + edW}.`, 43, { phase: 'do_relax', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW, newDist: dis + edW });

                pq.push({dis: dis + edW, node: adjNode});
                pq.sort((a, b) => a.dis - b.dis); // PQ sort Min-Heap
                add("Enqueue Shorter Path", `pq.add(new Pair(dis + edW, adjNode));\nAdded new optimal path to Min-Heap.`, 44, { phase: 'q_add', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW, newDist: dis + edW });

                if (ways[adjNode] !== 0) waysHistory[adjNode].push(ways[adjNode]);
                ways[adjNode] = ways[node];
                add("Inherit Ways", `ways[adjNode] = ways[node];\nSince this is a BRAND NEW strictly shorter route, the old combinatorics are trash! We purely inherit the ways from the parent node ${node} (${ways[node]} ways).`, 45, { phase: 'inherit_ways', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW });
                
            } else {
                
                let evalEqDesc = `else if(dis + edW == dist[adjNode])\nChecking if EQUAL: ${dis} + ${edW} == ${currDistVal}`;
                if (isEqual) evalEqDesc += `\nPASSED! Found an alternative path that takes exactly the same minimum time!`;
                else evalEqDesc += `\nFAILED: Route is strictly slower. Discarding.`;
                
                add("Evaluate Equal Relaxation", evalEqDesc, 47, { phase: 'eval_relax_equal', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW, isEqual, currDistVal });

                if (isEqual) {
                    if (ways[adjNode] !== 0) waysHistory[adjNode].push(ways[adjNode]);
                    ways[adjNode] = (ways[adjNode] + ways[node]) % MOD;
                    
                    add("Sum Alternative Ways", `ways[adjNode] = (ways[adjNode] + ways[node]) % mod;\nYES! Since times are exactly equal, we SUM the combinations! ways[${adjNode}] becomes (${waysHistory[adjNode][waysHistory[adjNode].length-1] || 0} + ${ways[node]}) = ${ways[adjNode]}.`, 48, { phase: 'sum_ways', activeDis: dis, activeNode: node, adjNode: adjNode, edW: edW });
                }
            }
        }
    }

    add("Queue Empty Exit", `while(!pq.isEmpty())\nMin-Heap is completely empty. All optimal shortest paths and combinatorial ways are locked!`, 33, { phase: 'done_while' });
    
    add("Final Return", `return ways[n-1] % mod;\nAlgorithm concluded. We return the accumulated ways for the ultimate destination ${n-1}.`, 52, { phase: 'done', isDone: true, isSuccess: true, finalWays: ways[n-1] });

    return steps;
  }, [baseN, baseEdges]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x:0, y:0}); 
    setZoom(0.85); 
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

  // Perfect Undirected Graph Layout Mathematics - Absolute SVG coordinates
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseN).fill({x: 0, y: 0});
    const center = svgSize / 2;
    if (baseN === 0) return pos;
    if (baseN === 1) return [{x: center, y: center}];

    const radius = Math.min(220, Math.max(120, baseN * 25));
    for (let i = 0; i < baseN; i++) {
        const angle = (i / baseN) * 2 * Math.PI + Math.PI; 
        pos[i] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-violet-900 border-violet-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Route size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-violet-400`}>
                    <CheckCircle2 size={24}/> COMBINATORICS MAPPED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. There are exactly {curStepData.state?.finalWays} minimum-time paths to reach the destination {st.n - 1}.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('q_add') || String(st.phase || '').includes('do_relax') || String(st.phase || '').includes('inherit') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-amber-400' : (String(st.phase || '').includes('q_pop') || String(st.phase || '').includes('q_remove') || String(st.phase || '').includes('peek') ? 'text-fuchsia-400' : (String(st.phase || '').includes('sum_ways') || String(st.phase || '').includes('eval_relax_equal') ? 'text-violet-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (Bi-Dir)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-1.5 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.adj || []).map((neighbors: {v: number, wt: number}[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-emerald-50 border border-emerald-200 shadow-sm scale-[1.02] z-10' : 'bg-slate-50/50 border border-transparent hover:bg-slate-50'}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={16} className={isActiveRow ? 'text-emerald-400' : 'text-slate-300'} />
                              <div className="flex flex-wrap gap-2 items-center font-mono text-sm leading-none pt-0.5">
                                  <span className="text-slate-400 text-lg">{'{'}</span>
                                  {neighbors.length === 0 && <span className="text-slate-400 italic text-xs">empty</span>}
                                  {neighbors.map((neighborObj, nIdx) => {
                                      let isChecking = isActiveRow && st.adjNode === neighborObj.v;
                                      let neighborText = isChecking ? 'text-emerald-700 font-black scale-110 bg-emerald-100 px-1.5 py-0.5 rounded shadow-sm' : 'text-slate-600 font-bold';
                                      let wtText = isChecking ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium';

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`flex items-center gap-1.5 transition-all ${neighborText}`}>
                                                  {neighborObj.v} <span className={`text-[11px] ${wtText}`}>(wt:{neighborObj.wt})</span>
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
          
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Min-Heap (pq)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[140px] max-h-[220px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (MIN DIST)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.q || []).map((pair: {dis: number, node: number}, i: number) => {
                          let isNewArrival = String(st.phase || '').includes('q_add') && pair.node === st.adjNode && pair.dis === st.newDist;
                          let isTop = i === 0;
                          let isPopping = isTop && (String(st.phase || '').includes('q_peek') || st.phase === 'q_remove');
                          
                          return (
                              <div key={`qt-${i}-${pair.node}-${pair.dis}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse ring-4 ring-fuchsia-200 scale-105 z-10 relative' : (isTop ? 'bg-violet-500 border-violet-600' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">dis: {pair.dis}</span>
                                  <span className="text-sm tracking-widest">node: {pair.node}</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">node (Active):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-fuchsia-500">dis:</span>
                          <span className="font-bold text-fuchsia-700">{st.activeDis !== undefined ? st.activeDis : '-'}</span>
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

      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
              
              {/* Dual Logic Evaluation HUD */}
              {st.phase && st.phase.includes('eval_relax') && st.activeNode !== undefined && st.adjNode !== undefined && (
                  <div className="absolute top-8 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Route size={14} className="text-violet-500"/> Logic Branch Evaluator</span>
                      <div className="flex items-center gap-4 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-fuchsia-500 mb-1">dis</span>
                              <span className="bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200">{st.activeDis}</span>
                          </div>
                          <span className="text-slate-400 font-normal">+</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-emerald-500 mb-1">edW</span>
                              <span className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">{st.edW}</span>
                          </div>
                          
                          <div className="flex flex-col items-center px-4">
                              <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">{st.phase === 'eval_relax_shorter' ? 'strictly less?' : 'exactly equal?'}</span>
                              <span className={`text-2xl ${st.phase === 'eval_relax_shorter' ? 'text-emerald-500' : 'text-violet-500'}`}>{st.phase === 'eval_relax_shorter' ? '<' : '=='}</span>
                          </div>

                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-rose-500 mb-1">dist[{st.adjNode}]</span>
                              <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">{st.currDistVal === 1e9 ? '∞' : st.currDistVal}</span>
                          </div>
                      </div>
                  </div>
              )}

              {/* Action Notifications */}
              {st.phase === 'do_relax' && (
                  <div className="absolute top-1/4 mt-4 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full border border-emerald-200 shadow-xl z-50 animate-in zoom-in">
                      <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16}/> Strictly Shorter Route Found!</span>
                  </div>
              )}

              {st.phase === 'inherit_ways' && (
                  <div className="absolute top-1/4 mt-16 flex items-center gap-3 bg-emerald-500 text-white px-6 py-2 rounded-full shadow-xl z-50 animate-in zoom-in">
                      <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><ArrowRightFromLine size={16}/> Inheriting Ways: ways[{st.adjNode}] = {st.ways[st.adjNode]}</span>
                  </div>
              )}

              {st.phase === 'sum_ways' && (
                  <div className="absolute top-1/4 mt-4 flex items-center gap-3 bg-violet-500 text-white px-6 py-3 rounded-2xl shadow-xl z-50 animate-in zoom-in ring-4 ring-violet-200 scale-110">
                      <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><PlusSquare size={18}/> Combinatorial Match! Summing Ways: ways[{st.adjNode}] += {st.ways[st.activeNode]}</span>
                  </div>
              )}

              {/* PERFECTLY CENTERED ABSOLUTE SVG COORD SYSTEM */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return st.roads.map((f: number[], idx: number) => {
                              let u = f[0], v = f[1], wt = f[2];
                              
                              const edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
                              if (renderedEdges.has(edgeKey)) return null;
                              renderedEdges.add(edgeKey);

                              const p1 = nodePositions[u];
                              const p2 = nodePositions[v];
                              if (!p1 || !p2) return null;

                              const dx = p2.x - p1.x;
                              const dy = p2.y - p1.y;
                              const angle = Math.atan2(dy, dx);
                              const rOffset = 26; 
                              
                              const startX = p1.x + rOffset * Math.cos(angle);
                              const startY = p1.y + rOffset * Math.sin(angle);
                              const targetX = p2.x - rOffset * Math.cos(angle);
                              const targetY = p2.y - rOffset * Math.sin(angle);
                              
                              const midX = (startX + targetX) / 2;
                              const midY = (startY + targetY) / 2;

                              let isActiveChecking = (st.activeNode === u && st.adjNode === v) || (st.activeNode === v && st.adjNode === u);
                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let animClass = "";
                              let labelClass = "bg-slate-100 text-slate-500 border-slate-200";

                              if (isActiveChecking) {
                                  if(st.phase === 'sum_ways' || st.phase === 'eval_relax_equal') {
                                      strokeColor = "#8b5cf6"; // violet
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                      labelClass = "bg-violet-500 text-white border-violet-600 scale-125 shadow-lg";
                                  } else if(st.phase === 'do_relax' || st.phase === 'inherit_ways' || st.phase === 'q_add') {
                                      strokeColor = "#10b981"; // emerald
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                      labelClass = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-lg";
                                  } else {
                                      strokeColor = "#0ea5e9"; 
                                      strokeWidth = "4";
                                      labelClass = "bg-cyan-500 text-white border-cyan-600 scale-110 shadow-md";
                                  }
                              }

                              return (
                                  <g key={`edge-${edgeKey}`} className={`transition-all duration-300 ${animClass}`}>
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
                          });
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        let isActive = st.activeNode === idx;
                        let isChecking = st.adjNode === idx;
                        let isQueued = false;
                        if (st.q) for(let item of st.q) { if (item.node === idx) isQueued = true; }
                        
                        let distValue = st.dist ? st.dist[idx] : 1e9;
                        let isInfinity = distValue === 1e9;
                        let isVisited = !isInfinity && idx !== 0;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        if (isActive) bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        else if (isQueued) bgClass = 'bg-slate-700 text-white border-slate-800 shadow-lg';
                        else if (isVisited) bgClass = 'bg-violet-100 text-violet-700 border-violet-300 shadow-md opacity-90';

                        let ringClass = '';
                        let zIndex = 'z-10';
                        if (isActive) { ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent'; zIndex = 'z-40'; } 
                        else if (isChecking) { 
                            if(st.phase === 'sum_ways') ringClass = 'ring-4 ring-violet-500 ring-offset-2 border-transparent scale-110';
                            else ringClass = 'ring-4 ring-emerald-400 ring-offset-2 border-transparent'; 
                            zIndex = 'z-30'; 
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {idx === 0 && !isActive && <span className="absolute -top-6 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black border border-emerald-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Source</span>}
                                {idx === st.n - 1 && !isActive && <span className="absolute -top-6 text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-black border border-rose-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Target</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>
          </div>
      );
  };

  const renderStateArrays = () => (
      <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[200px] pb-6 relative z-30">
          <div className="flex flex-col items-center shrink-0 w-full mb-4">
              <div className="flex gap-4 items-center">
                  
                  {/* Left Labels */}
                  <div className="flex flex-col gap-4 items-end justify-center pr-4">
                      <span className="text-[12px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded border border-violet-200 h-12 flex items-center shadow-sm">ways[]</span>
                      <span className="text-[12px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 h-12 flex items-center shadow-sm">dist[]</span>
                  </div>

                  {/* Dual Arrays */}
                  <div className="flex flex-col gap-4">
                      {/* WAYS ARRAY TOP */}
                      <div className="flex gap-1.5 items-end">
                          {st.ways === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.ways || []).map((val: number, idx: number) => {
                              let history = st.waysHistory ? st.waysHistory[idx] : [];
                              let isNewlyWritten = st.phase === 'inherit_ways' && st.adjNode === idx;
                              let isSummed = st.phase === 'sum_ways' && st.adjNode === idx;
                              let isSource = idx === 0 && st.phase === 'set_dist_src';

                              let boxBg = val === 0 ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-violet-50 text-violet-700 border-violet-300 font-black shadow-sm";
                              if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                              if (isSummed) boxBg = "bg-violet-500 text-white border-violet-600 scale-110 shadow-lg ring-4 ring-violet-300 animate-in zoom-in font-black z-20 animate-pulse";
                              if (isSource) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg font-black z-20";

                              return (
                                  <div key={`way-${idx}`} className="flex flex-col items-center relative group">
                                      <div className="absolute bottom-full mb-0.5 flex flex-col-reverse items-center justify-end gap-0 max-h-[80px] overflow-hidden leading-none">
                                          {(history || []).map((hVal: number, hIdx: number) => (
                                              <span key={`hw-${idx}-${hIdx}`} className="text-[11px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-[1.5px] leading-tight">{hVal}</span>
                                          ))}
                                      </div>
                                      <span className={`absolute bottom-full mb-8 text-[9px] font-mono font-black ${idx === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{idx}</span>
                                      <div className={`w-14 h-12 flex items-center justify-center font-mono text-lg rounded border-2 transition-all duration-300 ${boxBg}`}>
                                          {val}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>

                      {/* DIST ARRAY BOTTOM */}
                      <div className="flex gap-1.5 items-end">
                          {st.dist === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.dist || []).map((val: number, idx: number) => {
                              let isInfinity = val === 1e9;
                              let history = st.distHistory ? st.distHistory[idx] : [];
                              
                              let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.adjNode === idx || (st.phase === 'set_dist_src' && idx === 0));
                              let isEvaluating = (st.phase === 'eval_relax_shorter' || st.phase === 'eval_relax_equal') && st.adjNode === idx;
                              
                              let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-emerald-50 text-emerald-700 border-emerald-300 font-black shadow-sm";
                              if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                              if (isEvaluating) boxBg += " ring-2 ring-amber-400 scale-105 z-10";

                              return (
                                  <div key={`dist-${idx}`} className="flex flex-col items-center relative group">
                                      <div className={`w-14 h-12 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
                                          {isInfinity ? '∞' : val}
                                      </div>
                                      <div className="absolute top-full mt-0.5 flex flex-col items-center justify-start gap-0 max-h-[80px] overflow-hidden leading-none">
                                          {(history || []).map((hVal: number, hIdx: number) => (
                                              <span key={`hd-${idx}-${hIdx}`} className="text-[11px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-[1.5px] leading-tight">{hVal === 1e9 ? '∞' : hVal}</span>
                                          ))}
                                      </div>
                                      <span className={`absolute top-full mt-8 text-[9px] font-mono font-black mb-0.5 ${idx === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{idx}</span>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
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
                  <span>Dijkstra Combinatorics Variation</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><HashIcon size={28}/> Combinatorics on Graphs</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Instead of just finding the single shortest distance to a destination, we need to find <strong>how many unique paths exist</strong> that all tie for that exact minimum distance.</p>
                        <p>This is solved by running Dijkstra's Algorithm while maintaining a dual array system: <code>dist[]</code> (tracks the minimum time) and <code>ways[]</code> (tracks the combinatorial sum of optimal paths).</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Scenario A (Strictly Faster):</strong> If we find a new path that is strictly faster than our current record, all previous combinations are obsolete! We update the distance, and <em>inherit</em> the number of ways from the parent node.</li>
                            <li><strong>Scenario B (Equally Fast):</strong> If we find an alternative path that takes the EXACT same minimum time, we just found another valid combinatorial route! We <em>sum</em> the ways from the new parent into our current ways counter.</li>
                        </ul>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Complex Map</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 7<br/><strong>Roads:</strong> [0,6,7], [0,1,2], [1,2,3], [1,3,3], [6,3,3], [3,5,1], [6,5,1], [2,5,1], [0,4,5], [4,6,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">4</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The absolute shortest time to reach node 6 is 7 minutes. There are exactly 4 distinct paths that achieve this optimal time (e.g. 0&rarr;6, 0&rarr;4&rarr;6, etc).</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Classic Diamond</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 4<br/><strong>Roads:</strong> [0,1,2], [0,2,2], [1,3,2], [2,3,2], [0,3,4]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">3</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Shortest time is 4. Three ways achieve this: direct (0&rarr;3), through top (0&rarr;1&rarr;3), and through bottom (0&rarr;2&rarr;3).</span>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>N (Intersections)</label>
                            <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>Roads [u, v, time]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                            <button onClick={handleReset} title="Restart Simulation" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 h-[650px]">
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Route size={14} className={`text-${themeColor}-500`}/> Graph Visualizer</span>
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden flex items-center justify-center" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            <div className="transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Combinatorics merged directly into shortest-path graphs.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Route size={24} className="text-emerald-500"/> Phase 1: Pure Substitution (Strictly Shorter)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If <code>dis + edW &lt; dist[adjNode]</code>, we found a strictly faster route. All previously known routes to this node are mathematically irrelevant now. We completely overwrite the known distance, and we completely overwrite the combinatorial count: <code>ways[adjNode] = ways[node]</code>. If there were 5 ways to get to the parent, there are exactly 5 ways to get to this neighbor along this new optimal path.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><PlusSquare size={24} className="text-violet-500"/> Phase 2: Combinatorial Sum (Equally Fast)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The magic happens if <code>dis + edW == dist[adjNode]</code>. We didn't find a faster route, but we found an <em>alternative</em> route that takes the EXACT same minimum time! Therefore, the total number of optimal ways to reach the neighbor is now whatever it was before, PLUS the number of ways to reach this new parent. <code>ways[adjNode] = (ways[adjNode] + ways[node]) % MOD</code>.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(E log V)</strong><br/>The addition of the <code>ways[]</code> array and the `==` condition check are strictly $O(1)$ operations. Therefore, the algorithm maintains the exact same time complexity as standard Dijkstra's algorithm.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>We store the graph in an adjacency list requiring $O(V + E)$ space. The Priority Queue, `dist` array, and the new `ways` array all require $O(V)$ space. Overall, the memory footprint remains $O(V + E)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential combinatorial graph problem. It tests if you can overlay dynamic programming summation concepts onto a standard graph traversal."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we initialize `ways[0] = 1`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is the base case of our combinatorial logic."</p>
                            <p>There is exactly 1 way to be at the starting node (by doing nothing). When we expand to a neighbor and discover a new shortest path, we inherit the parent's ways (`ways[adj] = ways[node]`). If the source was initialized to 0, every subsequent multiplication and inheritance would remain 0, and the entire algorithm would fail to count anything."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "In the `==` block, why don't we push the node into the Priority Queue again?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because that specific node and distance is already in the Queue."</p>
                            <p>If we hit the `==` condition, it means we found an identical minimum distance. The node with that exact minimum distance was already enqueued when the `&lt;` condition was hit earlier! Enqueueing it again would just create redundant work. We only update the `ways[]` tally in memory."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>N:</label>
                          <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-cyan-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 shrink-0 ml-2`}>Roads:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-cyan-500 font-bold`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={handleReset} title="Restart Simulation" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px] overflow-hidden flex items-center justify-center" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
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
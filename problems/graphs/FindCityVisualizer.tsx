import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  cityFloyd: {
    id: 'cityFloyd',
    title: 'Find City (Floyd-Warshall)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(V³) | Space: O(V²)',
    theme: 'teal',
    code: `class Solution {
    int findTheCity(int n, int[][] edges, int distanceThreshold) {
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) dist[i][j] = (int)(1e9);
            dist[i][i] = 0;
        }
        for (int[] e : edges) {
            dist[e[0]][e[1]] = e[2];
            dist[e[1]][e[0]] = e[2];
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        int cntCity = n;
        int cityNo = -1;
        for (int city = 0; city < n; city++) {
            int cnt = 0;
            for (int adjCity = 0; adjCity < n; adjCity++) {
                if (dist[city][adjCity] <= distanceThreshold) {
                    cnt++;
                }
            }
            if (cnt <= cntCity) {
                cntCity = cnt;
                cityNo = city;
            }
        }
        return cityNo;
    }
}`,
    desc: "Using Floyd-Warshall, we compute the shortest path between ALL pairs of cities simultaneously in O(V³) time. Once the DP matrix is complete, we simply iterate through each city's row, counting how many destinations are reachable within the distanceThreshold. We return the city with the minimum count, breaking ties by choosing the larger city index."
  },
  cityDijkstra: {
    id: 'cityDijkstra',
    title: 'Find City (Dijkstra)',
    icon: <Route size={16} />,
    complexity: 'Time: O(V × E log V) | Space: O(V + E)',
    theme: 'indigo',
    code: `class Pair {
    int node, dist;
    Pair(int n, int d) { node = n; dist = d; }
}
class Solution {
    int findTheCity(int n, int[][] edges, int distanceThreshold) {
        List<List<Pair>> adj = new ArrayList<>();
        for(int i=0; i<n; i++) adj.add(new ArrayList<>());
        for(int[] e : edges) {
            adj.get(e[0]).add(new Pair(e[1], e[2]));
            adj.get(e[1]).add(new Pair(e[0], e[2]));
        }
        int cntCity = n;
        int cityNo = -1;
        for(int i = 0; i < n; i++) {
            int[] dist = new int[n];
            Arrays.fill(dist, (int)1e9);
            dist[i] = 0;
            PriorityQueue<Pair> pq = new PriorityQueue<>((a, b) -> a.dist - b.dist);
            pq.add(new Pair(i, 0));
            while(!pq.isEmpty()) {
                Pair it = pq.poll();
                int u = it.node;
                int d = it.dist;
                if (d > dist[u]) continue;
                for(Pair neighbor : adj.get(u)) {
                    int v = neighbor.node;
                    int w = neighbor.dist;
                    if(d + w < dist[v]) {
                        dist[v] = d + w;
                        pq.add(new Pair(v, dist[v]));
                    }
                }
            }
            int cnt = 0;
            for(int j = 0; j < n; j++) {
                if(dist[j] <= distanceThreshold) cnt++;
            }
            if(cnt <= cntCity) {
                cntCity = cnt;
                cityNo = i;
            }
        }
        return cityNo;
    }
}`,
    desc: "Using Dijkstra's Algorithm, we must run the shortest-path algorithm V times (once for every city as the source). For sparse graphs, O(V × E log V) can be much faster than Floyd-Warshall's strict O(V³). After running Dijkstra from a source city, we scan its resulting `dist[]` array to count reachable neighbors, then update our optimal city choice."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|findTheCity|edges|distanceThreshold|dist|matrix|Math|min|length|cntCity|cityNo|city|adjCity|cnt|Pair|node|adj|ArrayList|List|Arrays|fill|PriorityQueue|pq|add|poll|isEmpty|continue|neighbor|get)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'Pair', 'List', 'ArrayList', 'Arrays', 'PriorityQueue'].includes(part);
            const isPointer = ['edges', 'distanceThreshold', 'dist', 'matrix', 'cntCity', 'cityNo', 'city', 'adjCity', 'cnt', 'n', 'i', 'j', 'k', 'e', 'node', 'adj', 'pq', 'it', 'u', 'd', 'v', 'w', 'neighbor', 'a', 'b'].includes(part);
            const isMapCall = ['findTheCity', 'min', 'length', 'add', 'get', 'fill', 'poll', 'isEmpty'].includes(part);
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

export default function FindCityVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [method, setMethod] = useState<'floyd' | 'dijkstra'>('floyd');
  
  const selectedOpId = method === 'floyd' ? 'cityFloyd' : 'cityDijkstra';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  // Default Example 1
  const [nInput, setNInput] = useState('4');
  const [edgesInput, setEdgesInput] = useState('0,1,3 | 1,2,1 | 1,3,4 | 2,3,1');
  const [thresholdInput, setThresholdInput] = useState('4');

  const [baseN, setBaseN] = useState(4);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]
  ]);
  const [baseThreshold, setBaseThreshold] = useState(4);

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
      setEdgesInput('0,1,3 | 1,2,1 | 1,3,4 | 2,3,1');
      setThresholdInput('4');
  };

  const loadTestCase2 = () => {
      setNInput('5');
      setEdgesInput('0,1,2 | 0,4,8 | 1,2,3 | 1,4,2 | 2,3,1 | 3,4,1');
      setThresholdInput('2');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0) n = 4;
        
        let thresh = parseInt(thresholdInput.trim(), 10);
        if (isNaN(thresh) || thresh < 0) thresh = 4;

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
        setBaseThreshold(thresh);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, edgesInput, thresholdInput, method]);

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
  }, [currentStep, isFullscreen, activeTab, method]);

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

  const clone2D = (arr: number[][]) => arr.map(a => [...a]);
  const clone1D = (arr: number[]) => [...arr];
  const cloneAdj = (adj: {v: number, wt: number}[][]) => adj.map(a => a.map(n => ({...n})));
  const clonePQ = (pq: {node: number, dist: number}[]) => pq.map(p => ({...p}));

  // --- TRACE GENERATION (FLOYD-WARSHALL) ---
  const traceFloyd = useMemo(() => {
    const steps: any[] = [];
    if (method !== 'floyd') return steps;

    const n = baseN;
    const threshold = baseThreshold;
    const edges = baseEdges;
    
    if (n === 0) return steps;

    let dist = Array.from({length: n}, () => Array(n).fill(1e9));

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { matrix: clone2D(dist), originalEdges: edges, n, threshold, ...stateObj } 
    });

    add("Function Call", `Starting findTheCity...`, 2, { phase: 'init' });
    add("Init Matrix", `int[][] dist = new int[n][n];`, 3, { phase: 'init_matrix' });
    
    for(let i=0; i<n; i++) {
        add("Row Loop", `for (int i = 0; i < n; i++)`, 4, { phase: 'init_matrix', i });
        for(let j=0; j<n; j++) {
            dist[i][j] = 1e9;
        }
        add("Col Loop & Init", `for (int j = 0; j < n; j++) dist[i][j] = (int)(1e9);`, 5, { phase: 'init_matrix', i });
        dist[i][i] = 0;
        add("Diagonal Zero", `dist[i][i] = 0;`, 6, { phase: 'init_matrix', i });
    }

    add("Edge Loop", `for (int[] e : edges)`, 8, { phase: 'pop_edges' });
    for (let e of edges) {
        dist[e[0]][e[1]] = e[2];
        add("Set Edge Weight", `dist[e[0]][e[1]] = e[2];`, 9, { phase: 'pop_edges' });
        dist[e[1]][e[0]] = e[2];
        add("Set Reverse Edge", `dist[e[1]][e[0]] = e[2];`, 10, { phase: 'pop_edges' });
    }

    // Floyd Warshall DP Trace - Line by Line execution tracking
    add("Floyd-Warshall K", `for (int k = 0; k < n; k++)`, 12, { phase: 'fw_start' });
    for(let k = 0; k < n; k++) {
        add("Outer Loop (K)", `for (int k = 0; k < n; k++) -> k=${k}`, 12, { phase: 'fw_k', k });
        for(let i = 0; i < n; i++) {
            add("Middle Loop (I)", `for (int i = 0; i < n; i++) -> i=${i}`, 13, { phase: 'fw_i', k, i });
            for(let j = 0; j < n; j++) {
                add("Inner Loop (J)", `for (int j = 0; j < n; j++) -> j=${j}`, 14, { phase: 'fw_j', k, i, j, oldVal: dist[i][j], val_ik: dist[i][k], val_kj: dist[k][j] });
                
                let oldVal = dist[i][j];
                let val_ik = dist[i][k];
                let val_kj = dist[k][j];
                let newVal = val_ik + val_kj;
                let isImproved = (val_ik !== 1e9 && val_kj !== 1e9 && newVal < oldVal);
                
                if (isImproved) {
                    dist[i][j] = newVal;
                }
                
                let desc = `dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);\nChecking route from ${i} to ${j} via ${k}.`;
                desc += `\nCurrent direct: ${oldVal === 1e9 ? '∞' : oldVal}, Via ${k}: ${newVal >= 1e9 ? '∞' : newVal}`;
                add("DP Relaxation", desc, 15, { phase: 'fw_relax', k, i, j, oldVal, val_ik, val_kj, newVal, isImproved, currentMatrixVal: dist[i][j] });
            }
        }
    }

    add("Init Counters", `int cntCity = n;`, 19, { phase: 'init_counts', cntCity: n });
    let cntCity = n;
    let cityNo = -1;
    add("Init Optimal City", `int cityNo = -1;`, 20, { phase: 'init_counts', cntCity, cityNo });

    add("City Loop", `for (int city = 0; city < n; city++)`, 21, { phase: 'eval_city' });
    for (let city = 0; city < n; city++) {
        add("Eval City Loop", `for (int city = 0; city < n; city++) -> city=${city}`, 21, { phase: 'eval_city', city, cntCity, cityNo });
        let cnt = 0;
        add("Init SubCount", `int cnt = 0;`, 22, { phase: 'eval_city', city, cnt, cntCity, cityNo });

        add("Neighbor Loop", `for (int adjCity = 0; adjCity < n; adjCity++)`, 23, { phase: 'eval_city', city, cnt, cntCity, cityNo });
        for (let adjCity = 0; adjCity < n; adjCity++) {
            if (city === adjCity) continue;
            let isReachable = dist[city][adjCity] <= threshold;
            
            add("Check Threshold Condition", `if (dist[city][adjCity] <= distanceThreshold)\ndist[${city}][${adjCity}] is ${dist[city][adjCity] === 1e9 ? '∞' : dist[city][adjCity]}. Is it <= ${threshold}? ${isReachable ? 'Yes' : 'No'}`, 24, { phase: 'check_thresh', city, adjCity, cnt, cntCity, cityNo, isReachable });
            
            if (isReachable) {
                cnt++;
                add("Increment Count", `cnt++;\nValid neighbor found. cnt is now ${cnt}`, 25, { phase: 'check_thresh', city, adjCity, cnt, cntCity, cityNo, isReachable });
            }
        }
        
        let isBetter = cnt <= cntCity;
        add("Compare Optimal Condition", `if (cnt <= cntCity)\nIs ${cnt} <= ${cntCity}? ${isBetter ? 'Yes' : 'No'}`, 28, { phase: 'eval_min', city, cnt, cntCity, cityNo, isBetter });

        if (isBetter) {
            cntCity = cnt;
            add("Update Min Neighbors", `cntCity = cnt;\ncntCity is now ${cntCity}`, 29, { phase: 'update_best', city, cnt, cntCity, cityNo });
            cityNo = city;
            add("Update Best City", `cityNo = city;\nOptimal city is now ${cityNo}`, 30, { phase: 'update_best', city, cnt, cntCity, cityNo });
        }
    }

    add("Return Final Result", `return cityNo;`, 33, { phase: 'done', isDone: true, isSuccess: true, finalCity: cityNo });
    return steps;
  }, [baseN, baseEdges, baseThreshold, method]);


  // --- TRACE GENERATION (DIJKSTRA) ---
  const traceDijkstra = useMemo(() => {
    const steps: any[] = [];
    if (method !== 'dijkstra') return steps;

    const n = baseN;
    const threshold = baseThreshold;
    const edges = baseEdges;
    
    if (n === 0) return steps;

    let adj: {v: number, wt: number}[][] = Array.from({length: n}, () => []);
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: cloneAdj(adj), originalEdges: edges, n, threshold, ...stateObj } 
    });

    add("Function Call", `int findTheCity(int n, int[][] edges, int distanceThreshold)`, 6, { phase: 'init' });
    add("Init Adjacency List", `List<List<Pair>> adj = new ArrayList<>();`, 7, { phase: 'init' });
    
    for (let i = 0; i < n; i++) adj[i] = [];
    add("Instantiate Inner Lists", `for(int i=0; i<n; i++) adj.add(new ArrayList<>());`, 8, { phase: 'init' });

    add("Edge Loop", `for(int[] e : edges)`, 9, { phase: 'build_adj' });
    for (let e of edges) {
        adj[e[0]].push({v: e[1], wt: e[2]});
        add("Add Directed Edge", `adj.get(e[0]).add(new Pair(e[1], e[2]));`, 10, { phase: 'build_adj' });
        adj[e[1]].push({v: e[0], wt: e[2]});
        add("Add Reverse Edge", `adj.get(e[1]).add(new Pair(e[0], e[2]));`, 11, { phase: 'build_adj' });
    }

    let cntCity = n;
    add("Init cntCity", `int cntCity = n;`, 13, { phase: 'init_counts', cntCity });
    let cityNo = -1;
    add("Init cityNo", `int cityNo = -1;`, 14, { phase: 'init_counts', cntCity, cityNo });

    add("Source Loop", `for(int i = 0; i < n; i++)`, 15, { phase: 'src_loop', cntCity, cityNo });
    for(let i = 0; i < n; i++) {
        add("Run Dijkstra from Source", `for(int i = 0; i < n; i++) -> Source i=${i}`, 15, { phase: 'src_loop', src: i, cntCity, cityNo });
        
        let dist = Array(n).fill(1e9);
        add("Init Dist Array", `int[] dist = new int[n];`, 16, { phase: 'init_dij', src: i, dist: clone1D(dist), cntCity, cityNo });
        add("Fill Infinity", `Arrays.fill(dist, (int)1e9);`, 17, { phase: 'init_dij', src: i, dist: clone1D(dist), cntCity, cityNo });
        dist[i] = 0;
        add("Source Dist 0", `dist[i] = 0;`, 18, { phase: 'init_dij', src: i, dist: clone1D(dist), cntCity, cityNo });
        
        let pq: {node: number, dist: number}[] = [];
        add("Init Priority Queue", `PriorityQueue<Pair> pq = new PriorityQueue<>((a, b) -> a.dist - b.dist);`, 19, { phase: 'init_dij', src: i, dist: clone1D(dist), pq: clonePQ(pq), cntCity, cityNo });

        pq.push({node: i, dist: 0});
        add("Add Source to PQ", `pq.add(new Pair(i, 0));`, 20, { phase: 'init_dij', src: i, dist: clone1D(dist), pq: clonePQ(pq), cntCity, cityNo });

        while(pq.length > 0) {
            add("While PQ Not Empty", `while(!pq.isEmpty())`, 21, { phase: 'dij_loop', src: i, dist: clone1D(dist), pq: clonePQ(pq), cntCity, cityNo });
            
            let it = pq[0];
            add("Poll PQ", `Pair it = pq.poll();`, 22, { phase: 'dij_poll', src: i, dist: clone1D(dist), pq: clonePQ(pq), u: it.node, d: it.dist, cntCity, cityNo });
            pq.shift();
            
            let u = it.node;
            add("Extract Node", `int u = it.node;`, 23, { phase: 'dij_poll', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d: it.dist, cntCity, cityNo });
            let d = it.dist;
            add("Extract Dist", `int d = it.dist;`, 24, { phase: 'dij_poll', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, cntCity, cityNo });
            
            let isStale = d > dist[u];
            add("Check Stale Distance", `if (d > dist[u]) continue;\nIs ${d} > ${dist[u]}? ${isStale ? 'Yes, skipping' : 'No'}`, 25, { phase: 'dij_stale', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, cntCity, cityNo });
            if (isStale) continue;

            add("Neighbor Loop", `for(Pair neighbor : adj.get(u))`, 26, { phase: 'dij_neighbors', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, cntCity, cityNo });
            for (let neighbor of adj[u]) {
                let v = neighbor.v;
                let w = neighbor.wt;
                
                add("Extract Neighbor Node", `int v = neighbor.node; // v=${v}`, 27, { phase: 'dij_neighbor_ext', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, v, w, cntCity, cityNo });
                add("Extract Edge Weight", `int w = neighbor.dist; // w=${w}`, 28, { phase: 'dij_neighbor_ext', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, v, w, cntCity, cityNo });

                let isRelaxable = d + w < dist[v];
                add("Evaluate Relaxation", `if(d + w < dist[v])\nIs ${d} + ${w} < ${dist[v] === 1e9 ? '∞' : dist[v]}? ${isRelaxable ? 'Yes' : 'No'}`, 29, { phase: 'dij_relax_eval', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, v, w, isRelaxable, cntCity, cityNo });

                if (isRelaxable) {
                    dist[v] = d + w;
                    add("Update Distance", `dist[v] = d + w;`, 30, { phase: 'dij_relax', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, v, w, cntCity, cityNo });
                    pq.push({node: v, dist: dist[v]});
                    pq.sort((a,b) => a.dist - b.dist);
                    add("Add to PQ", `pq.add(new Pair(v, dist[v]));`, 31, { phase: 'dij_relax', src: i, dist: clone1D(dist), pq: clonePQ(pq), u, d, v, w, cntCity, cityNo });
                }
            }
        }

        let cnt = 0;
        add("Init Neighbor Count", `int cnt = 0;`, 35, { phase: 'count_start', src: i, dist: clone1D(dist), pq: clonePQ(pq), cnt, cntCity, cityNo });
        add("Loop for Threshold", `for(int j = 0; j < n; j++)`, 36, { phase: 'count_start', src: i, dist: clone1D(dist), pq: clonePQ(pq), cnt, cntCity, cityNo });
        for(let j = 0; j < n; j++) {
            if (i === j) continue;
            let isReachable = dist[j] <= threshold;
            add("Check Reachability", `if(dist[j] <= distanceThreshold) cnt++;\nIs dist[${j}] (${dist[j] === 1e9 ? '∞' : dist[j]}) <= ${threshold}? ${isReachable ? 'Yes' : 'No'}`, 37, { phase: 'check_thresh', src: i, dist: clone1D(dist), pq: clonePQ(pq), cnt, j, isReachable, cntCity, cityNo });
            if (isReachable) cnt++;
        }

        let isBetter = cnt <= cntCity;
        add("Compare Best Count", `if(cnt <= cntCity)\nIs ${cnt} <= ${cntCity}? ${isBetter ? 'Yes' : 'No'}`, 39, { phase: 'eval_min', src: i, dist: clone1D(dist), pq: clonePQ(pq), cnt, cntCity, cityNo, isBetter });
        if (isBetter) {
            cntCity = cnt;
            add("Update min neighbors", `cntCity = cnt;`, 40, { phase: 'update_best', src: i, dist: clone1D(dist), pq: clonePQ(pq), cnt, cntCity, cityNo });
            cityNo = i;
            add("Update optimal city", `cityNo = i;`, 41, { phase: 'update_best', src: i, dist: clone1D(dist), pq: clonePQ(pq), cnt, cntCity, cityNo });
        }
    }

    add("Return City", `return cityNo;`, 44, { phase: 'done', isDone: true, isSuccess: true, finalCity: cityNo });

    return steps;
  }, [baseN, baseEdges, baseThreshold, method]);

  const trace = method === 'floyd' ? traceFloyd : traceDijkstra;

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x:0, y:0}); 
    setZoom(1); 
  }; 
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.matrix-grid')) return;
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
  const resetPanZoom = () => { setPan({x:0, y:0}); setZoom(1); };
  
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

  // Directed Graph Layout Mathematics (Absolute Coordinates)
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseN).fill({x: 0, y: 0});
    const center = svgSize / 2;
    if (baseN === 0) return pos;
    if (baseN === 1) return [{x: center, y: center}];

    const radius = Math.min(220, Math.max(140, baseN * 30));
    for (let i = 0; i < baseN; i++) {
        const angle = (i / baseN) * 2 * Math.PI - Math.PI / 2; 
        pos[i] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-emerald-900 border-emerald-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                    <CheckCircle2 size={24}/> OPTIMAL CITY FOUND
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. City {curStepData.state?.finalCity} has the strictly minimum (or tied maximum index) number of reachable neighbors within the threshold!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('relax') || String(st.phase || '').includes('update') ? 'text-emerald-400' : (String(st.phase || '').includes('eval') || String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('fw_') || String(st.phase || '').includes('dij') ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.originalEdges === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const n = st.n;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Evaluation HUD for Counting */}
              {st.phase && st.phase === 'check_thresh' && (st.adjCity !== undefined || st.j !== undefined) && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10 min-w-[400px]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><MapPin size={14} className="text-amber-500"/> Distance Threshold Check</span>
                      
                      <div className="flex items-center gap-6 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-sky-500 mb-1">dist[{method === 'floyd' ? `${st.city}][${st.adjCity}` : `${st.j}`}]</span>
                              <span className="bg-sky-50 px-4 py-2 rounded-xl border border-sky-200 shadow-inner text-2xl">
                                  {method === 'floyd' ? (st.matrix[st.city][st.adjCity] === 1e9 ? '∞' : st.matrix[st.city][st.adjCity]) : (st.dist[st.j] === 1e9 ? '∞' : st.dist[st.j])}
                              </span>
                          </div>

                          <div className="flex flex-col items-center px-4">
                              <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">within limits?</span>
                              <span className={`text-2xl ${st.isReachable ? 'text-emerald-500' : 'text-rose-500'}`}>&lt;=</span>
                          </div>

                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-fuchsia-500 mb-1">Threshold</span>
                              <span className="bg-fuchsia-50 px-4 py-2 rounded-xl border border-fuchsia-200 shadow-inner text-2xl">{st.threshold}</span>
                          </div>
                      </div>

                      <div className={`mt-6 flex items-center gap-3 px-6 py-2 rounded-full border shadow-sm animate-in zoom-in ${st.isReachable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                              {st.isReachable ? <><CheckCircle2 size={16}/> Reachable! Count++</> : <><X size={16}/> Too Far.</>}
                          </span>
                      </div>
                  </div>
              )}

              {/* Dynamic Graph Visualization */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          const renderedEdges = new Set<string>();

                          return st.originalEdges.map((f: any, idx: number) => {
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

                              let isActiveChecking = false;
                              if (method === 'floyd' && st.phase === 'fw_relax') {
                                  isActiveChecking = (st.i === u && st.k === v) || (st.k === u && st.j === v) || (st.i === u && st.j === v);
                              } else if (method === 'dijkstra' && (st.phase === 'dij_relax' || st.phase === 'dij_relax_eval' || st.phase === 'dij_neighbor_ext')) {
                                  isActiveChecking = (st.u === u && st.v === v) || (st.u === v && st.v === u);
                              }

                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let animClass = "";
                              let labelClass = "bg-white text-slate-400 border-slate-200";

                              if (isActiveChecking) {
                                  strokeColor = `#${method === 'floyd' ? '14b8a6' : '6366f1'}`; // Theme color
                                  strokeWidth = "5";
                                  animClass = "animate-pulse";
                                  labelClass = `bg-${themeColor}-500 text-white border-${themeColor}-600 scale-125 shadow-lg`;
                              }

                              return (
                                  <g key={`edge-${edgeKey}`} className={`transition-all duration-300 ${animClass}`}>
                                      <line 
                                          x1={startX} y1={startY} x2={targetX} y2={targetY}
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                      />
                                      <foreignObject x={midX - 12} y={midY - 12} width="24" height="24" className="overflow-visible">
                                          <div className={`w-full h-full flex items-center justify-center font-mono font-black text-[10px] rounded-full border shadow-sm transition-all duration-300 ${labelClass}`}>
                                              {wt}
                                          </div>
                                      </foreignObject>
                                  </g>
                              );
                          });
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        let isSrc = false, isTarget = false;

                        if (method === 'floyd') {
                            if (st.phase?.includes('check_thresh') || st.phase === 'eval_min' || st.phase === 'update_best') {
                                isSrc = st.city === idx;
                                isTarget = st.adjCity === idx;
                            } else {
                                isSrc = st.i === idx;
                                isTarget = st.j === idx || st.k === idx;
                            }
                        } else {
                            if (st.phase?.includes('check_thresh') || st.phase === 'eval_min' || st.phase === 'update_best') {
                                isSrc = st.src === idx;
                                isTarget = st.j === idx;
                            } else {
                                isSrc = st.src === idx;
                                isTarget = st.v === idx || st.u === idx;
                            }
                        }
                        
                        // Highlight reachable nodes within threshold in green if counting
                        let isReachableCounted = false;
                        if (st.phase?.includes('check_thresh') || st.phase === 'eval_min' || st.phase === 'update_best') {
                            if (method === 'floyd' && st.matrix && st.matrix[st.city !== undefined ? st.city : st.src][idx] <= st.threshold && idx !== (st.city !== undefined ? st.city : st.src)) {
                                isReachableCounted = true;
                            } else if (method === 'dijkstra' && st.dist && st.dist[idx] <= st.threshold && idx !== st.src) {
                                isReachableCounted = true;
                            }
                        }

                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm opacity-80';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isReachableCounted) {
                            bgClass = 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-lg opacity-100 scale-110';
                            ringClass = 'ring-4 ring-emerald-200 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        } else if (isSrc) {
                            bgClass = `bg-${themeColor}-500 text-white border-${themeColor}-600 shadow-xl opacity-100 scale-125`;
                            ringClass = `ring-4 ring-${themeColor}-200 ring-offset-2 border-transparent`;
                            zIndex = 'z-50';
                        } else if (isTarget && !st.phase?.includes('check_thresh')) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl opacity-100 scale-110';
                            ringClass = 'ring-2 ring-fuchsia-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isTarget && st.phase?.includes('check_thresh')) {
                             // The specific target being evaluated in threshold
                             bgClass = 'bg-amber-400 text-white border-amber-500 shadow-xl opacity-100 scale-125 animate-pulse';
                             ringClass = 'ring-4 ring-amber-200 ring-offset-2 border-transparent';
                             zIndex = 'z-50';
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isSrc && <span className={`absolute -bottom-6 text-[10px] text-${themeColor}-700 bg-${themeColor}-50 px-2 py-0.5 rounded-full font-black shadow-sm uppercase tracking-widest`}>City {idx}</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>

          </div>
      );
  };

  const renderStateArrays = () => {
    if (method === 'floyd') {
        if (!st.matrix) return null;
        return (
            <div className="flex flex-col items-center shrink-0 matrix-grid max-w-full overflow-y-auto bg-slate-50 p-6 shadow-inner z-20">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 mb-4 shadow-sm flex items-center gap-2"><Layers size={14}/> Distance Matrix [N][N]</span>
                
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                        <div className="w-8 h-8"></div>
                        {Array.from({length: baseN}).map((_, col) => (
                            <div key={`head-${col}`} className={`w-12 h-8 flex items-center justify-center font-mono font-black text-[10px] rounded bg-slate-200 text-slate-500 ${st.adjCity === col || st.j === col ? 'bg-amber-200 text-amber-800' : ''}`}>{col}</div>
                        ))}
                    </div>
                    {st.matrix.map((row: number[], i: number) => (
                        <div key={`m-row-${i}`} className="flex gap-1">
                            <div className={`w-8 h-12 flex items-center justify-center font-mono font-black text-[10px] rounded bg-slate-200 text-slate-500 ${st.city === i || st.i === i ? `bg-${themeColor}-200 text-${themeColor}-800` : ''}`}>{i}</div>
                            {row.map((val: number, j: number) => {
                                let isInfinity = val === 1e9;
                                let isEval = (st.phase === 'check_thresh' && st.city === i && st.adjCity === j);
                                let boxBg = isInfinity ? "bg-white text-slate-300 border border-slate-200 border-dashed" : "bg-white text-slate-600 border border-slate-300 shadow-sm";
                                if (isEval) boxBg = "bg-amber-400 text-white border border-amber-500 scale-110 shadow-lg z-20 font-black ring-2 ring-amber-200 animate-pulse";
                                else if (val <= st.threshold && i !== j && (st.city === i || st.phase === 'done' || st.phase === 'eval_min' || st.phase === 'update_best')) {
                                    boxBg = "bg-emerald-100 text-emerald-700 border border-emerald-400 shadow-md font-bold";
                                }

                                return (
                                    <div key={`m-cell-${i}-${j}`} className={`w-12 h-12 flex items-center justify-center font-mono rounded-lg transition-all duration-300 select-none ${boxBg}`}>
                                        {isInfinity ? '∞' : val}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        if (!st.dist) return null;
        return (
            <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] relative z-30 bg-slate-50 shadow-inner">
                <div className="flex flex-col items-center shrink-0 w-full mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> dist[] Array (From City {st.src})</span>
                    <div className="flex gap-2 items-end">
                        {st.dist.map((val: number, idx: number) => {
                            let isInfinity = val === 1e9;
                            let isEval = st.phase === 'check_thresh' && st.j === idx;
                            let boxBg = isInfinity ? "bg-white text-slate-300 border-slate-200 border-dashed" : "bg-white text-slate-600 border-slate-300 shadow-sm";
                            if (isEval) boxBg = "bg-amber-400 text-white border-amber-500 scale-110 shadow-lg z-20 font-black ring-2 ring-amber-200 animate-pulse";
                            else if (val <= st.threshold && idx !== st.src && (st.phase?.includes('check') || st.phase === 'eval_min' || st.phase === 'update_best' || st.phase === 'done')) {
                                boxBg = "bg-emerald-100 text-emerald-700 border-emerald-400 shadow-md font-bold";
                            }
                            return (
                                <div key={`dist-${idx}`} className="flex flex-col items-center relative group mt-2">
                                    <div className={`w-14 h-12 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
                                        {isInfinity ? '∞' : val}
                                    </div>
                                    <span className={`absolute top-full mt-2 px-2 py-0.5 rounded border shadow-sm text-[10px] font-mono font-black ${idx === st.src ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                                        {idx}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
  };

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Settings2 size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Min Neighbors (cntCity)</span>
                      <span className={`text-3xl font-black ${st.phase === 'update_best' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>{st.cntCity !== undefined ? st.cntCity : '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Optimal City (cityNo)</span>
                      <span className={`text-4xl font-black ${st.phase === 'update_best' ? 'text-emerald-500 animate-pulse' : 'text-indigo-600'}`}>{st.cityNo !== undefined ? st.cityNo : '-'}</span>
                  </div>
              </div>
          </div>

          {method === 'dijkstra' && (
              <>
                  <div className="flex flex-col items-center w-full mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (ADJ)</span>
                      <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[100px] max-h-[220px] overflow-y-auto scrollbar-thin">
                          {st.adj === undefined || st.adj.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.adj || []).map((neighbors: {v: number, wt: number}[], nodeIdx: number) => {
                              let isActiveRow = st.u === nodeIdx || st.src === nodeIdx;
                              return (
                                  <div key={`adj-${nodeIdx}`} className={`flex items-start gap-3 transition-all duration-300 ${isActiveRow ? 'bg-emerald-50/50 p-2 -m-2 rounded-xl border border-emerald-100' : ''}`}>
                                      <div className={`w-7 h-7 shrink-0 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                                          {nodeIdx}
                                      </div>
                                      <ArrowRight size={14} className={`mt-1.5 shrink-0 ${isActiveRow ? 'text-emerald-400' : 'text-slate-300'}`} />
                                      <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center font-mono text-[11px] leading-tight pt-1.5">
                                          <span className="text-slate-400 text-sm">{'{'}</span>
                                          {neighbors.length === 0 && <span className="text-slate-400 italic text-[10px]">empty</span>}
                                          {neighbors.map((neighborObj, nIdx) => {
                                              let isChecking = st.phase?.includes('dij_') && st.u === nodeIdx && st.v === neighborObj.v;
                                              return (
                                                  <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                                      <span className={`flex items-center gap-1 transition-all ${isChecking ? 'text-indigo-700 font-black bg-indigo-100 px-1.5 py-0.5 rounded shadow-sm scale-110' : 'text-slate-600 font-bold'}`}>
                                                          {neighborObj.v} <span className={`font-medium ml-0.5 ${isChecking ? 'text-indigo-500' : 'text-slate-400'}`}>wt:{neighborObj.wt}</span>
                                                      </span>
                                                      {nIdx < neighbors.length - 1 && <span className="text-slate-300 font-sans">,</span>}
                                                  </React.Fragment>
                                              );
                                          })}
                                          <span className="text-slate-400 text-sm">{'}'}</span>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  <div className="flex flex-col items-center w-full mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Min-Heap (pq)</span>
                      <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[180px] overflow-y-auto scrollbar-thin">
                          <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                              <span>FRONT (MIN DIST)</span>
                          </div>
                          <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                              {st.pq === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.pq || []).map((pair: {node: number, dist: number}, i: number) => {
                                  let isNewArrival = String(st.phase || '').includes('dij_relax') && pair.node === st.v && pair.dist === st.dist[st.v];
                                  let isTop = i === 0;
                                  let isPopping = isTop && String(st.phase || '').includes('dij_poll');
                                  
                                  return (
                                      <div key={`qt-${i}-${pair.node}-${pair.dist}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse ring-4 ring-fuchsia-200 scale-105 z-10 relative' : (isTop ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-700 border-slate-800'))}`}>
                                          <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">dist: {pair.dist}</span>
                                          <span className="text-sm tracking-widest">node: {pair.node}</span>
                                      </div>
                                  )
                              })}
                              {st.pq !== undefined && st.pq.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                          </div>
                      </div>
                  </div>
              </>
          )}

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">V (Nodes):</span>
                          <span className="font-bold text-slate-700">{st.n !== undefined ? st.n : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-rose-500 font-black">Threshold:</span>
                          <span className="font-black text-rose-700">{st.threshold !== undefined ? st.threshold : '-'}</span>
                      </div>
                      
                      {method === 'floyd' ? (
                          <>
                              <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                                  <span className="text-teal-500">city (Source):</span>
                                  <span className="font-bold text-teal-700 uppercase tracking-widest">{st.city !== undefined ? st.city : '-'}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                                  <span className="text-emerald-500">adjCity (Target):</span>
                                  <span className="font-bold text-emerald-700 uppercase tracking-widest">{st.adjCity !== undefined ? st.adjCity : '-'}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                  <span className="text-sky-500 font-bold">cnt (Current Valid):</span>
                                  <span className="font-bold text-sky-700 text-lg">{st.cnt !== undefined ? st.cnt : '-'}</span>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                                  <span className="text-indigo-500">i (Source):</span>
                                  <span className="font-bold text-indigo-700 uppercase tracking-widest">{st.src !== undefined ? st.src : '-'}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                                  <span className="text-emerald-500">u (Active):</span>
                                  <span className="font-bold text-emerald-700 uppercase tracking-widest">{st.u !== undefined ? st.u : '-'}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                  <span className="text-sky-500 font-bold">v/j (Target):</span>
                                  <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.v !== undefined ? st.v : (st.j !== undefined ? st.j : '-')}</span>
                              </div>
                          </>
                      )}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>{method === 'floyd' ? 'O(V³) DP Matrix' : 'O(V × E log V) Multi-Source'}</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none items-center gap-2">
            
            {/* Algorithm Toggle */}
            <div className="flex bg-slate-200 p-1 rounded-xl mr-4">
                <button onClick={() => {setMethod('floyd'); handleReset();}} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${method === 'floyd' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Floyd-Warshall</button>
                <button onClick={() => {setMethod('dijkstra'); handleReset();}} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${method === 'dijkstra' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Dijkstra</button>
            </div>

            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Grid size={28}/> Floyd-Warshall DP Matrix</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Unlike Dijkstra or Bellman-Ford which find shortest paths from a <strong>single</strong> source, the Floyd-Warshall algorithm finds the shortest paths between <strong>all pairs of vertices</strong> simultaneously!</p>
                        <p>It achieves this using a brilliant 3D Dynamic Programming concept (optimized to 2D in space). The core idea: What if we try to route the path from node <code>i</code> to node <code>j</code> by strictly going <em>through</em> an intermediate node <code>k</code>?</p>
                        <p>We iterate <code>k</code> from 0 to N-1. For every pair <code>(i, j)</code>, we check: is <code>dist[i][j] &gt; dist[i][k] + dist[k][j]</code>? If so, we found a strictly shorter multi-hop path, and we overwrite the matrix cell!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 4, <strong>Threshold:</strong> 4<br/><strong>Edges:</strong> [0,1,3], [1,2,1], [1,3,4], [2,3,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">3</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">City 0 &rarr; [City 1, City 2] (2 neighbors)<br/>City 3 &rarr; [City 1, City 2] (2 neighbors)<br/>City 3 has the greatest number/ID, so we return 3.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Dense</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 5, <strong>Threshold:</strong> 2<br/><strong>Edges:</strong> [0,1,2], [0,4,8], [1,2,3], [1,4,2], [2,3,1], [3,4,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">0</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-emerald-900 border-emerald-800' : 'bg-[#0f172a]'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isDone ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <CheckCircle2 size={24}/> OPTIMAL CITY FOUND
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                City {curStepData.state?.finalCity} has the strictly minimum (or tied maximum index) number of reachable neighbors within the threshold!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('relax') || String(st.phase || '').includes('update') ? 'text-emerald-400' : (String(st.phase || '').includes('eval') || String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('fw_') || String(st.phase || '').includes('dij') ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                            <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N (Cities)</label>
                            <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Edges [u, v, wt]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-rose-600 pl-1`}>Threshold</label>
                            <input type="text" value={thresholdInput} onChange={(e) => setThresholdInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner font-bold text-rose-600`} />
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

                <div className="flex flex-col gap-4 h-[650px] w-full">
                    <div className="flex-1 flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative graph-canvas-area" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                        <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                            {renderMainCanvas()}
                        </div>
                        {renderStateArrays()}
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
                  
                  <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-emerald-900 border-emerald-800' : 'bg-[#0f172a]'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
                        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex items-center gap-2">
                               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        {st.isDone ? (
                             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                    <CheckCircle2 size={24}/> OPTIMAL CITY FOUND
                                </div>
                                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                    Algorithm concluded. City {curStepData.state?.finalCity} has the strictly minimum (or tied maximum index) number of reachable neighbors within the threshold!
                                </p>
                             </div>
                        ) : (
                            <>
                                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('relax') || String(st.phase || '').includes('update') ? 'text-emerald-400' : (String(st.phase || '').includes('eval') || String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('fw_') || String(st.phase || '').includes('dij') ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
                            </>
                        )}
                    </div>

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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N:</label>
                          <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-rose-600 shrink-0 ml-2`}>Threshold:</label>
                          <input type="text" value={thresholdInput} onChange={(e) => setThresholdInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-rose-500 font-bold text-rose-600`} />
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
                  
                  <div className="bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
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
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  kruskalsAlgorithm: {
    id: 'kruskalsAlgorithm',
    title: "Kruskal's Algorithm (MST)",
    icon: <Combine size={16} />,
    complexity: 'Time: O(E log E) | Space: O(V + E)',
    theme: 'amber',
    code: `class DisjointSet {
    List<Integer> parent = new ArrayList<>();
    List<Integer> size = new ArrayList<>();
    public DisjointSet(int n) {
        for (int i = 0; i <= n; i++) {
            parent.add(i);
            size.add(1);
        }
    }
    public int findUPar(int node) {
        if (node == parent.get(node)) return node;
        int ulp = findUPar(parent.get(node));
        parent.set(node, ulp);
        return parent.get(node);
    }
    public void unionBySize(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (size.get(ulp_u) < size.get(ulp_v)) {
            parent.set(ulp_u, ulp_v);
            size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));
        } else {
            parent.set(ulp_v, ulp_u);
            size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));
        }
    }
}

class Edge implements Comparable<Edge> {
    int src, dest, weight;
    Edge(int _src, int _dest, int _wt) {
        this.src = _src; this.dest = _dest; this.weight = _wt;
    }
    public int compareTo(Edge compareEdge) {
        return this.weight - compareEdge.weight;
    }
}

class Solution {
    static int spanningTree(int V, ArrayList<ArrayList<ArrayList<Integer>>> adj) {
        List<Edge> edges = new ArrayList<Edge>();
        for(int i = 0; i < V; i++) {
            for(int j = 0; j < adj.get(i).size(); j++) {
                int adjNode = adj.get(i).get(j).get(0);
                int wt = adj.get(i).get(j).get(1);
                int node = i;
                Edge temp = new Edge(node, adjNode, wt);
                edges.add(temp);
            }
        }
        DisjointSet ds = new DisjointSet(V);
        Collections.sort(edges);
        int mstWt = 0;
        for(int i = 0; i < edges.size(); i++) {
            int wt = edges.get(i).weight;
            int u = edges.get(i).src;
            int v = edges.get(i).dest;
            if(ds.findUPar(u) != ds.findUPar(v)) {
                mstWt += wt;
                ds.unionBySize(u, v);
            }
        }
        return mstWt;
    }
}`,
    desc: "Kruskal's Algorithm is a greedy powerhouse for finding Minimum Spanning Trees. Instead of growing a tree from a single node like Prim's, Kruskal's extracts ALL edges from the Adjacency List, sorts them globally by weight, and evaluates them strictly from cheapest to most expensive. It uses a Disjoint Set (Union-Find) to check if an edge forms a cycle. If it doesn't, it immediately adds it to the MST!"
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-500 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|spanningTree|adj|Edge|Comparable|compareTo|DisjointSet|findUPar|unionBySize|edges|ArrayList|List|Integer|String|Collections|sort|mstWt|weight|src|dest|wt|u|v|adjNode|node|temp|add|size|get|parent|set)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Edge', 'Comparable', 'Collections'].includes(part);
            const isPointer = ['adj', 'edges', 'parent', 'size', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'i', 'j', 'mstWt', 'wt', 'adjNode', 'temp', 'src', 'dest', 'weight', '_src', '_dest', '_wt', 'compareEdge'].includes(part);
            const isMapCall = ['spanningTree', 'findUPar', 'unionBySize', 'add', 'set', 'get', 'size', 'compareTo', 'sort'].includes(part);
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

export default function KruskalsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'kruskalsAlgorithm';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [vInput, setVInput] = useState('5');
  const [edgesInput, setEdgesInput] = useState('0,1,2 | 0,3,6 | 1,2,3 | 1,3,8 | 1,4,5 | 2,4,7');

  const [baseV, setBaseV] = useState(5);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], [1, 4, 5], [2, 4, 7]
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
      setVInput('5');
      setEdgesInput('0,1,2 | 0,3,6 | 1,2,3 | 1,3,8 | 1,4,5 | 2,4,7');
  };

  const loadTestCase2 = () => {
      setVInput('4');
      setEdgesInput('0,1,5 | 1,2,3 | 0,2,1 | 0,3,4 | 2,3,2');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let v = parseInt(vInput.trim(), 10);
        if (isNaN(v) || v <= 0) v = 5;
        
        let rows = edgesInput.split('|').map(r => r.trim());
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if (cells.length === 3 && cells[0] < v && cells[1] < v) {
                parsedEdges.push(cells);
            }
        }
        
        setBaseV(v);
        setBaseEdges(parsedEdges);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [vInput, edgesInput]);

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

  // --- EXACT LINE-BY-LINE TRACE GENERATION (KRUSKAL'S ALGORITHM) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const V = baseV;
    const inputEdges = baseEdges;
    
    if (V === 0) return steps;

    // Simulate standard Adjacency List building from undirected input edges
    let adj: {v: number, wt: number}[][] = Array.from({length: V}, () => []);
    for (let e of inputEdges) {
        adj[e[0]].push({v: e[1], wt: e[2]});
        adj[e[1]].push({v: e[0], wt: e[2]});
    }

    let edgesList: {u: number, v: number, wt: number}[] = [];
    let parent = Array(V).fill(0);
    let sizeArr = Array(V).fill(1);

    let mstWt = 0;
    let mstEdges: string[] = [];
    let rejectedEdges: string[] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: clone1D(adj.map(a=>[...a])), originalEdges: inputEdges, edgesList: [...edgesList], parent: clone1D(parent), sizeArr: clone1D(sizeArr), mstWt, mstEdges: [...mstEdges], rejectedEdges: [...rejectedEdges], V, ...stateObj } 
    });

    // Helper for explicit path compression simulation tracing exactly back to DSU class lines
    const findUPar = (node: number): number => {
        add("Find Ultimate Parent", `public int findUPar(int node)\nExecuting DSU Find for node ${node}. Searching for its ultimate root.`, 10, { phase: 'find_start', findNode: node });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node)) return node;\nIs node ${node} equal to its parent (${parent[node]})? ${isRoot ? 'YES, it is the root. Returning it.' : 'NO, keep traversing upwards.'}`, 11, { phase: 'find_check', findNode: node, isRoot });
        
        if (isRoot) return node;

        add("Recursive Call", `int ulp = findUPar(parent.get(node));\nRecursively calling findUPar() on its parent: ${parent[node]}.`, 12, { phase: 'find_recurse', findNode: node });
        let ulp = findUPar(parent[node]);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL OPTIMIZATION: Overwriting node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}. This flattens the tree!`, 13, { phase: 'path_compression', findNode: node, ulp });

        add("Return Root", `return parent.get(node);\nReturning the compressed ultimate root (${ulp}) down the call stack.`, 14, { phase: 'find_ret_comp', findNode: node, ulp });
        return ulp;
    };

    add("Init Function", `static int spanningTree(int V, ArrayList<...> adj)\nInitiating Kruskal's Algorithm method.`, 41, { phase: 'init' });
    add("Init Edges Array", `List<Edge> edges = new ArrayList<Edge>();\nCreated a linear array to hold ALL edges extracted from the adjacency list.`, 42, { phase: 'init_edges' });

    add("Start Adjacency Extraction", `for(int i = 0; i < V; i++)\nIterating through every vertex to dump its edges.`, 43, { phase: 'adj_outer_loop' });
    for(let i = 0; i < V; i++) {
        for(let j = 0; j < adj[i].length; j++) {
            let adjNode = adj[i][j].v;
            let wt = adj[i][j].wt;
            let node = i;
            edgesList.push({u: node, v: adjNode, wt: wt});
        }
        add("Extract & Add Edges", `Edge temp = new Edge(node, adjNode, wt);\nedges.add(temp);\nExtracted all ${adj[i].length} edges connected to Vertex ${i} and appended them to the flat list.`, 48, { phase: 'adj_extract', i });
    }

    add("Init Disjoint Set", `DisjointSet ds = new DisjointSet(V);\nInitializing the Union-Find structure.`, 52, { phase: 'init_dsu_call' });
    add("DSU Constructor", `public DisjointSet(int n)`, 4, { phase: 'init_dsu_cons' });
    add("DSU Init Loop", `for (int i = 0; i <= n; i++)`, 5, { phase: 'init_dsu_loop' });
    
    for(let i=0; i<V; i++) {
        parent[i] = i;
        sizeArr[i] = 1;
    }
    add("DSU Base Values", `parent.add(i);\nsize.add(1);\nEvery node is initialized as its own independent component of size 1.`, 6, { phase: 'init_dsu_set' });

    edgesList.sort((a,b) => a.wt - b.wt);
    add("Sort Edges Greedily", `Collections.sort(edges);\nCRITICAL STEP: We sort the ENTIRE edges list globally by weight (smallest to largest). This guarantees we process the absolute cheapest available edge first.`, 53, { phase: 'sort_edges' });

    add("Init MST Weight", `int mstWt = 0;\nSetting our total Minimum Spanning Tree weight accumulator to 0.`, 54, { phase: 'init_mst' });

    add("Main Kruskal Loop", `for(int i = 0; i < edges.size(); i++)\nIterating through the globally sorted edges one by one.`, 55, { phase: 'kruskal_loop_start' });

    for(let i = 0; i < edgesList.length; i++) {
        let wt = edgesList[i].wt;
        let u = edgesList[i].u;
        let v = edgesList[i].v;

        add("Extract Next Cheapest Edge Data", `int wt = edges.get(i).weight;\nint u = edges.get(i).src;\nint v = edges.get(i).dest;\nPreparing to evaluate the next cheapest edge: ${u}\u2192${v} (Weight: ${wt}).`, 56, { phase: 'ext_edge', i, u, v, wt });

        add("Check Cycle via DSU", `if(ds.findUPar(u) != ds.findUPar(v))\nQuerying the Disjoint Set to see if nodes ${u} and ${v} share the same ultimate root.`, 59, { phase: 'check_dsu_start', i, u, v, wt });

        let ulp_u = findUPar(u);
        let ulp_v = findUPar(v);
        let isDifferent = ulp_u !== ulp_v;
        
        let evalDesc = `if(ds.findUPar(u) != ds.findUPar(v))\nResults received: Root of ${u} is ${ulp_u}, Root of ${v} is ${ulp_v}.`;
        if (isDifferent) evalDesc += `\nSince ${ulp_u} != ${ulp_v}, they are completely DISJOINT components! Adding this edge connects them without forming a cycle.`;
        else evalDesc += `\nSince ${ulp_u} == ${ulp_v}, they are already in the SAME connected component! Adding this edge would form a closed cycle. REJECTED!`;

        add("Cycle Detection Evaluation", evalDesc, 59, { phase: 'check_dsu_eval', i, u, v, wt, ulp_u, ulp_v, isDifferent });

        let edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;

        if (isDifferent) {
            mstWt += wt;
            mstEdges.push(edgeKey);
            add("Add Weight to MST", `mstWt += wt;\nNo cycle formed. We formally accept this edge into the MST. Adding ${wt} to the total weight (Total is now ${mstWt}).`, 60, { phase: 'add_mst', i, u, v, wt, ulp_u, ulp_v, mstWt });

            add("Union By Size Call", `ds.unionBySize(u, v);\nWe must now merge their components in the Disjoint Set so we don't accidentally pick a cyclic edge later.`, 61, { phase: 'union_dsu_call', i, u, v });

            // Simulate DSU union logic exactly line by line
            add("Union Start", `public void unionBySize(int u, int v)`, 16, { phase: 'union_start', u, v, ulp_u, ulp_v });
            
            // Re-find to trace lines, but we know the roots already
            add("Find U Root again", `int ulp_u = findUPar(u); // ulp_u = ${ulp_u}`, 17, { phase: 'union_find', u, v, ulp_u, ulp_v });
            add("Find V Root again", `int ulp_v = findUPar(v); // ulp_v = ${ulp_v}`, 18, { phase: 'union_find', u, v, ulp_u, ulp_v });
            add("Verify Disjoint", `if (ulp_u == ulp_v) return;\nRoots differ, proceeding to merge.`, 19, { phase: 'union_verify', u, v, ulp_u, ulp_v });

            let sizeU = sizeArr[ulp_u];
            let sizeV = sizeArr[ulp_v];

            add("Evaluate Size Constraints", `if (size.get(ulp_u) < size.get(ulp_v))\nComparing component sizes to maintain a flat tree: Is ${sizeU} < ${sizeV}?`, 20, { phase: 'union_compare', u, v, ulp_u, ulp_v, sizeU, sizeV });

            if (sizeU < sizeV) {
                parent[ulp_u] = ulp_v;
                add("Attach U under V", `parent.set(ulp_u, ulp_v);\nYES! Tree U is smaller. Attaching its root completely UNDER the larger tree V.`, 21, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                sizeArr[ulp_v] += sizeArr[ulp_u];
                add("Update Size of V", `size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));\nTree V absorbs Tree U's nodes. New size of Root ${ulp_v} is ${sizeArr[ulp_v]}.`, 22, { phase: 'union_add_size', u, v, targetRoot: ulp_v, newSize: sizeArr[ulp_v] });
            } else {
                parent[ulp_v] = ulp_u;
                add("Attach V under U", `parent.set(ulp_v, ulp_u);\nNO (Tree V is smaller or equal). Attaching tree V's root completely UNDER tree U.`, 24, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                sizeArr[ulp_u] += sizeArr[ulp_v];
                add("Update Size of U", `size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));\nTree U absorbs Tree V's nodes. New size of Root ${ulp_u} is ${sizeArr[ulp_u]}.`, 25, { phase: 'union_add_size', u, v, targetRoot: ulp_u, newSize: sizeArr[ulp_u] });
            }
        } else {
            rejectedEdges.push(edgeKey);
            add("Discard Edge", `// Implicit discard\nEdge ${u}\u2192${v} skipped to prevent forming a cycle! Moving to next edge.`, 59, { phase: 'discard_edge', i, u, v, wt, ulp_u, ulp_v });
        }
    }

    add("Return MST Weight", `return mstWt;\nAll edges evaluated. Minimum Spanning Tree perfectly constructed!`, 64, { phase: 'done', isDone: true, isSuccess: true, finalSum: mstWt });

    return steps;
  }, [baseV, baseEdges]);

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

  // Undirected Graph Layout Mathematics
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseV).fill({x: 0, y: 0});
    const center = svgSize / 2;
    if (baseV === 0) return pos;
    if (baseV === 1) return [{x: center, y: center}];

    const radius = Math.min(220, Math.max(140, baseV * 30));
    for (let i = 0; i < baseV; i++) {
        const angle = (i / baseV) * 2 * Math.PI - Math.PI / 2; 
        pos[i] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseV]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-${themeColor}-900 border-${themeColor}-800` : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-${themeColor}-400`}>
                    <CheckCircle2 size={24}/> MST SUCCESSFULLY BUILT
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. The absolute minimum total weight required to connect all vertices is exactly {curStepData.state?.finalSum}!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('add_mst') ? 'text-emerald-400' : (String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('discard') ? 'text-rose-400' : (String(st.phase || '').includes('ext') || String(st.phase || '').includes('sort') ? 'text-sky-400' : (String(st.phase || '').includes('find') ? 'text-fuchsia-400' : 'text-white'))))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.adj === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Dynamic Graph Visualization - NO BACKGROUND WRAPPER */}
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

                              let isMST = st.mstEdges?.includes(edgeKey);
                              let isRejected = st.rejectedEdges?.includes(edgeKey);
                              let isEvaluating = st.phase?.includes('ext') || st.phase?.includes('check') || st.phase?.includes('union') || st.phase?.includes('add_mst') || st.phase?.includes('discard');
                              isEvaluating = isEvaluating && ((st.u === u && st.v === v) || (st.u === v && st.v === u));

                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let animClass = "";
                              let labelClass = "bg-white text-slate-400 border-slate-200";

                              if (isMST) {
                                  strokeColor = "#10b981"; // Emerald
                                  strokeWidth = "5";
                                  labelClass = "bg-emerald-500 text-white border-emerald-600 shadow-md scale-110 font-bold";
                              } else if (isRejected) {
                                  strokeColor = "#f43f5e"; // Rose
                                  strokeWidth = "2";
                                  labelClass = "bg-rose-50 text-rose-500 border-rose-200 line-through opacity-70";
                              } else if (isEvaluating) {
                                  strokeColor = "#f59e0b"; // Amber
                                  strokeWidth = "5";
                                  animClass = "animate-pulse";
                                  labelClass = "bg-amber-500 text-white border-amber-600 scale-125 shadow-lg font-black";
                              }

                              return (
                                  <g key={`edge-${edgeKey}`} className={`transition-all duration-300 ${animClass}`}>
                                      <line 
                                          x1={startX} y1={startY} x2={targetX} y2={targetY}
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                          strokeDasharray={isRejected ? "5 5" : ""}
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
                        let isRoot = st.parent && st.parent[idx] === idx && st.phase !== 'init' && st.phase !== 'init_edges' && st.phase !== 'adj_outer_loop' && st.phase !== 'adj_extract';
                        let isActiveU = st.u === idx || (st.phase?.includes('find') && st.findNode === idx);
                        let isActiveV = st.v === idx;
                        
                        let isConnected = st.parent && (st.parent[idx] !== idx || st.sizeArr[idx] > 1);

                        let bgClass = 'bg-slate-100 text-slate-500 border-slate-300 shadow-sm opacity-90';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isConnected) {
                            bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-md opacity-100 font-bold';
                        }
                        
                        if (isActiveU || isActiveV) {
                            bgClass = 'bg-amber-500 text-white border-amber-600 shadow-xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-amber-200 ring-offset-2 border-transparent animate-pulse';
                            zIndex = 'z-50';
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono text-xl rounded-full transition-colors duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isRoot && !isActiveU && !isActiveV && <span className="absolute -top-6 text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-black border border-emerald-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Root (s:{st.sizeArr[idx]})</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>

          </div>
      );
  };

  const renderStateArrays = () => {
    if (!st.parent) return null;
    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] relative z-30 bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] shrink-0">
            <div className="flex flex-col items-center shrink-0 w-full mb-4">
                <div className="flex gap-4 items-center">
                    
                    <div className="flex flex-col gap-4 items-end justify-center pr-4">
                        <span className={`text-[12px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 h-12 flex items-center shadow-sm`}>DSU parent[]</span>
                        <span className="text-[12px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded border border-sky-200 h-12 flex items-center shadow-sm">DSU size[]</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* PARENT ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.parent.map((val: number, idx: number) => {
                                let isEval = st.phase?.includes('check_dsu') && (st.u === idx || st.v === idx || st.ulp_u === idx || st.ulp_v === idx);
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                                else if (isPathComp) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in font-black z-20";
                                else if (isEval || (st.phase?.includes('find') && st.findNode === idx)) boxBg = "bg-amber-100 text-amber-700 border-amber-300 scale-105 ring-2 ring-amber-200 z-10 font-bold";

                                return (
                                    <div key={`p-${idx}`} className="flex flex-col items-center relative group">
                                        <span className={`absolute bottom-full mb-2 text-[9px] font-mono font-black ${isEval ? 'text-amber-500' : 'text-slate-400'}`}>{idx}</span>
                                        <div className={`w-14 h-12 flex items-center justify-center font-mono text-xl rounded border-2 transition-all duration-300 ${boxBg}`}>
                                            {val}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* SIZE ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.sizeArr.map((val: number, idx: number) => {
                                let isUpdated = st.phase?.includes('union_add_size') && (st.targetRoot === idx);
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-sky-500 text-white border-sky-600 scale-110 shadow-lg ring-2 ring-sky-300 animate-in zoom-in font-black z-20";

                                return (
                                    <div key={`s-${idx}`} className="flex flex-col items-center relative group">
                                        <div className={`w-14 h-12 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
                                            {val}
                                        </div>
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

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Settings2 size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex justify-between">
                          Total MST Weight 
                          {st.phase === 'add_mst' && <span className="text-amber-500 text-[10px]">+ {st.wt}</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'add_mst' ? 'text-amber-500 animate-pulse' : 'text-slate-700'}`}>{st.mstWt !== undefined ? st.mstWt : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Sorted Edges Array</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[240px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (CHEAPEST WT)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.edgesList === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.edgesList || []).map((edge: {u: number, v: number, wt: number}, i: number) => {
                          let isNewArrival = st.phase === 'adj_extract';
                          let isEvaluating = st.phase?.includes('kruskal') || st.phase?.includes('ext') || st.phase?.includes('check') || st.phase?.includes('add') || st.phase?.includes('discard') || st.phase?.includes('union');
                          isEvaluating = isEvaluating && st.i === i;
                          
                          let isRejected = st.rejectedEdges?.includes(`${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`);
                          let isAccepted = st.mstEdges?.includes(`${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`);

                          let bgClass = 'bg-slate-700 border-slate-800';
                          if (isEvaluating) bgClass = 'bg-fuchsia-500 border-fuchsia-600 scale-105 z-10 animate-pulse ring-4 ring-fuchsia-200';
                          else if (isAccepted) bgClass = 'bg-emerald-600 border-emerald-700 opacity-90';
                          else if (isRejected) bgClass = 'bg-slate-800 border-slate-900 opacity-40';

                          return (
                              <div key={`et-${i}-${edge.u}-${edge.v}-${edge.wt}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${bgClass}`}>
                                  <span className={`text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner ${isRejected ? 'line-through text-rose-300' : ''}`}>wt: {edge.wt}</span>
                                  <div className="flex flex-col text-right">
                                      <span className={`text-sm tracking-widest leading-none ${isRejected ? 'line-through text-rose-300' : ''}`}>{edge.u}&rarr;{edge.v}</span>
                                  </div>
                              </div>
                          )
                      })}
                      {st.edgesList !== undefined && st.edgesList.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Array is empty</span>}
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">u (Edge Src):</span>
                          <span className="font-bold text-amber-700 uppercase tracking-widest text-lg">{st.u !== undefined ? st.u : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">v (Edge Dst):</span>
                          <span className="font-bold text-amber-700 text-lg">{st.v !== undefined ? st.v : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-fuchsia-500 font-bold">wt (Edge Wt):</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.wt !== undefined ? st.wt : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-emerald-500 font-bold">ulp_u:</span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest text-lg">{st.ulp_u !== undefined ? st.ulp_u : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-emerald-500 font-bold">ulp_v:</span>
                          <span className="font-bold text-emerald-700 text-lg">{st.ulp_v !== undefined ? st.ulp_v : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-2">
                          <span className="text-fuchsia-500 font-bold">Find Recursive Target (node):</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.findNode !== undefined ? st.findNode : '-'}</span>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>Global Sort & DSU Verification</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Combine size={28}/> Minimum Spanning Tree</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p><strong>Kruskal's Algorithm</strong> is a brilliantly simple greedy approach to constructing the Minimum Spanning Tree (MST) of a weighted, undirected graph.</p>
                        <p>Instead of growing the tree outwards from a single node (like Prim's), Kruskal's treats the graph globally. It extracts <strong>ALL</strong> edges, sorts them strictly by weight from cheapest to most expensive, and iterates through them.</p>
                        <p>For every edge, it asks one question: <em>"Does adding this edge form a cycle?"</em> It uses the blazing-fast <strong>Disjoint Set (Union-Find)</strong> data structure to answer this in <code>O(1)</code> time! If the edge connects two nodes already in the same component, it's discarded. If they are in different components, the edge is accepted into the MST and the components are merged.</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Graph</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 5<br/><strong>Edges:</strong> [0,1,2], [0,3,6], [1,2,3], [1,3,8], [1,4,5], [2,4,7]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">16</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The MST consists of edges (0,1) wt:2, (1,2) wt:3, (1,4) wt:5, and (0,3) wt:6. Total sum = 16.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Redundant Cycle</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 4<br/><strong>Edges:</strong> [0,1,5], [1,2,3], [0,2,1], [0,3,4], [2,3,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">6</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The algorithm successfully ignores heavy redundant edges like (0,1 wt:5) and (0,3 wt:4), choosing the optimal tree: (0,2 wt:1), (2,3 wt:2), and (2,1 wt:3). Total sum = 6.</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-emerald-900 border-emerald-800` : 'bg-[#0f172a]'}`}>
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
                                <CheckCircle2 size={24}/> MST SUCCESSFULLY BUILT
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Algorithm concluded. The absolute minimum total weight required to connect all vertices is exactly {curStepData.state?.finalSum}!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('add_mst') ? 'text-emerald-400' : (String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('discard') ? 'text-rose-400' : (String(st.phase || '').includes('ext') || String(st.phase || '').includes('sort') ? 'text-sky-400' : (String(st.phase || '').includes('find') ? 'text-fuchsia-400' : 'text-white'))))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>V (Nodes)</label>
                            <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Edges [u, v, wt]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                        <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}>
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
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Minimum Spanning Trees and Kruskal's Edge-Centric Greedy Approach.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><NetworkIcon size={24} className="text-amber-500"/> The Global Greedy Choice</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike Prim's algorithm which grows a single continuous tree outward from a specific source node, <strong>Kruskal's Algorithm</strong> works globally. It extracts all edges, sorts them by weight, and iterates through them from smallest to largest. It blindly attempts to add the absolute cheapest edge in the entire graph to the MST, regardless of where it is!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Combine size={24} className="text-fuchsia-500"/> Disjoint Set to the Rescue</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we just greedily add edges, we might accidentally connect two nodes that are already connected, creating a redundant cycle! To prevent this, Kruskal's utilizes a <strong>Disjoint Set (Union-Find)</strong> data structure. Before accepting an edge <code>u &rarr; v</code>, it checks if <code>findUPar(u) == findUPar(v)</code>. If they share the same ultimate parent, a path already exists between them! The edge is discarded. If they differ, the edge is safely added, and we <code>union</code> the two components.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(E log E)</strong><br/>The extraction of edges takes $O(V + E)$. The dominant operation is sorting the entire edge list, which takes $O(E \log E)$ time. Iterating through the edges and performing DSU operations takes $O(E \cdot \alpha(V))$, which is extremely fast. Thus, the sorting dictates the overall time bound: $O(E \log E)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>The space is dictated by the linear `edges` Array $O(E)$, and the internal `parent[]` and `size[]` arrays of the Disjoint Set which take $O(V)$. Overall memory requirement scales to $O(V + E)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Interviewers will almost always ask you to compare Kruskal's vs Prim's. Understanding when to use which is critical."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "When would you prefer Kruskal's Algorithm over Prim's Algorithm?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It comes down to graph density and structural needs."</p>
                            <p>Kruskal's time complexity $O(E \log E)$ is dominated by sorting edges. Prim's using a Min-Heap is $O(E \log V)$. Because $E$ can be up to $V^2$, $\log E$ is practically equivalent to $\log V$. However, for very <strong>sparse graphs</strong> (where $E$ is close to $V$), Kruskal's is incredibly fast and exceptionally simple to write if you already have an edge list. Prim's is generally preferred for very <strong>dense graphs</strong> because we avoid the massive initial sorting of millions of edges."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What happens if the graph is disconnected?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Kruskal's gracefully builds a Minimum Spanning Forest."</p>
                            <p>Prim's algorithm will only build a tree for the connected component that contains the starting source node; it will completely ignore isolated islands. Kruskal's, however, globally sorts all edges. If a graph is disconnected, Kruskal's will simply assemble the optimal trees for every isolated component simultaneously, resulting in a Minimum Spanning Forest!"</p>
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
                          <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                          <button onClick={handleReset} title="Restart Simulation" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                      </div>
                  </div>

                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px] overflow-hidden flex items-center justify-center" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}>
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
                  
                  <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
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
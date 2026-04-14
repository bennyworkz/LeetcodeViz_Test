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
  numProvinces: {
    id: 'numProvinces',
    title: 'Number of Provinces (DSU)',
    icon: <Fingerprint size={16} />,
    complexity: 'Time: O(V²) | Space: O(V)',
    theme: 'indigo',
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

class Solution {
    static int numProvinces(ArrayList<ArrayList<Integer>> adj, int V) {
        DisjointSet ds = new DisjointSet(V);
        for(int i = 0; i < V; i++) {
            for(int j = 0; j < V; j++) {
                if(adj.get(i).get(j) == 1) {
                    // i and j
                    ds.unionBySize(i, j);
                }
            }
        }
        int cnt = 0;
        for(int i = 0; i < V; i++) {
            if(ds.parent.get(i) == i) cnt++;
        }
        return cnt;
    }
}`,
    desc: "Finding the 'Number of Provinces' essentially means finding the number of Connected Components in an undirected graph. We loop through the V×V adjacency matrix; whenever we see a '1' (an edge), we tell the Disjoint Set to connect node i and node j. After the whole matrix is processed, we simply count how many nodes are their own 'Ultimate Parent' (root). That exact number is the number of isolated provinces!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args|numProvinces|adj|V|cnt)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Solution'].includes(part);
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'i', 'j', 'args', 'adj', 'V', 'cnt'].includes(part);
            const isMapCall = ['numProvinces', 'findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get', 'main'].includes(part);
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

export default function NumberOfProvincesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'numProvinces';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [vInput, setVInput] = useState('3');
  const [matrixInput, setMatrixInput] = useState('1 1 0 | 1 1 0 | 0 0 1');

  const [baseV, setBaseV] = useState(3);
  const [baseMatrix, setBaseMatrix] = useState<number[][]>([
      [1, 1, 0], [1, 1, 0], [0, 0, 1]
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
      setVInput('3');
      setMatrixInput('1 1 0 | 1 1 0 | 0 0 1');
  };

  const loadTestCase2 = () => {
      setVInput('4');
      setMatrixInput('1 0 0 1 | 0 1 1 0 | 0 1 1 0 | 1 0 0 1');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let v = parseInt(vInput.trim(), 10);
        if (isNaN(v) || v <= 0) v = 3;
        
        let rows = matrixInput.split('|').map(r => r.trim());
        let parsedMatrix: number[][] = Array.from({length: v}, () => Array(v).fill(0));
        
        for (let i = 0; i < Math.min(v, rows.length); i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(/\s+/).map(s => parseInt(s.trim(), 10));
            for(let j=0; j < Math.min(v, cells.length); j++) {
                if(cells[j] === 1) parsedMatrix[i][j] = 1;
            }
        }
        
        setBaseV(v);
        setBaseMatrix(parsedMatrix);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [vInput, matrixInput]);

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

  // --- TRACE GENERATION (PROVINCES ALGORITHM) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const V = baseV;
    const adj = baseMatrix;
    
    if (V === 0) return steps;

    let parent = Array(V).fill(0); // Using exactly V size for 0-indexed problem
    let sizeArr = Array(V).fill(1);
    
    // We also want to record which edges are successfully added to visualize component growth
    let unionedEdges: string[] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), sizeArr: clone1D(sizeArr), adj, V, unionedEdges: [...unionedEdges], ...stateObj } 
    });

    const simulateFind = (node: number, originalCall: string): number => {
        add("Find Ultimate Parent", `public int findUPar(int node = ${node})\nExecuting DSU Find for node ${node}. Searching for its ultimate root.`, 10, { phase: 'find_start', findNode: node, originalCall });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node)) return node;\nIs node ${node} equal to its parent (${parent[node]})? ${isRoot ? 'YES, it is the root.' : 'NO, keep traversing upwards.'}`, 11, { phase: 'find_check', findNode: node, isRoot, originalCall });
        
        if (isRoot) return node;

        add("Recursive Call", `int ulp = findUPar(parent.get(node));\nRecursively calling findUPar() on its parent: ${parent[node]}.`, 12, { phase: 'find_recurse', findNode: node, originalCall });
        let ulp = simulateFind(parent[node], originalCall);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL OPTIMIZATION: Overwriting node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}. This flattens the tree!`, 13, { phase: 'path_compression', findNode: node, ulp, originalCall });

        add("Return Root", `return parent.get(node);\nReturning the compressed ultimate root (${ulp}) down the call stack.`, 14, { phase: 'find_ret_comp', findNode: node, ulp, originalCall });
        return ulp;
    };

    add("Init Function", `static int numProvinces(ArrayList<...> adj, int V)\nStarting Number of Provinces logic.`, 31, { phase: 'init' });
    
    add("Create Disjoint Set", `DisjointSet ds = new DisjointSet(V);\nAllocating DSU structure to group connected cities.`, 32, { phase: 'init_dsu_call' });
    
    add("DSU Constructor", `public DisjointSet(int n)`, 4, { phase: 'init_dsu_cons' });
    add("DSU Init Loop", `for (int i = 0; i <= n; i++)`, 5, { phase: 'init_dsu_loop' });
    for(let i=0; i<V; i++) {
        parent[i] = i;
        sizeArr[i] = 1;
    }
    add("DSU Base Values", `parent.add(i);\nsize.add(1);\nEvery node is isolated (Parent = self, Size = 1).`, 6, { phase: 'init_dsu_set' });

    add("Traverse Adjacency Matrix", `for(int i = 0; i < V; i++)`, 33, { phase: 'matrix_outer' });

    for(let i = 0; i < V; i++) {
        add("Inner Traversal", `for(int j = 0; j < V; j++)`, 34, { phase: 'matrix_inner', i });
        for(let j = 0; j < V; j++) {
            
            let isConnected = adj[i][j] === 1;
            add("Check Matrix Edge", `if(adj.get(${i}).get(${j}) == 1)\nDoes the matrix state that City ${i} and City ${j} are connected? ${isConnected ? 'YES' : 'NO'}`, 35, { phase: 'matrix_check', i, j, isConnected });

            if (isConnected && i !== j) { 
                add("Invoke Union", `ds.unionBySize(${i}, ${j});\nConnection found in matrix. Unifying City ${i} and City ${j}.`, 37, { phase: 'union_dsu_call', i, j });

                // Simulate DSU union logic exactly line by line
                add("Union Start", `public void unionBySize(int u, int v)`, 16, { phase: 'union_start', u: i, v: j });
                
                add("Find U Root", `int ulp_u = findUPar(u);`, 17, { phase: 'union_find', u: i, v: j });
                let ulp_u = simulateFind(i, `Union(${i},${j})`);

                add("Find V Root", `int ulp_v = findUPar(v);`, 18, { phase: 'union_find', u: i, v: j, ulp_u });
                let ulp_v = simulateFind(j, `Union(${i},${j})`);

                let isSame = ulp_u === ulp_v;
                add("Verify Disjoint", `if (ulp_u == ulp_v) return;\nAre roots identical? Is ${ulp_u} == ${ulp_v}? ${isSame ? 'YES, already merged! Ignoring.' : 'NO, disjoint. Must merge.'}`, 19, { phase: 'union_verify', u: i, v: j, ulp_u, ulp_v, isSame });

                if (!isSame) {
                    let sizeU = sizeArr[ulp_u];
                    let sizeV = sizeArr[ulp_v];

                    add("Evaluate Size Constraints", `if (size.get(ulp_u) < size.get(ulp_v))\nComparing component sizes to maintain a flat tree: Is ${sizeU} < ${sizeV}?`, 20, { phase: 'union_compare', u: i, v: j, ulp_u, ulp_v, sizeU, sizeV });

                    if (sizeU < sizeV) {
                        parent[ulp_u] = ulp_v;
                        add("Attach U under V", `parent.set(ulp_u, ulp_v);\nYES! Tree U is smaller. Attaching its root completely UNDER the larger tree V.`, 21, { phase: 'union_attach', u: i, v: j, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                        sizeArr[ulp_v] += sizeArr[ulp_u];
                        add("Update Size of V", `size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));\nTree V absorbs Tree U's nodes. New size of Root ${ulp_v} is ${sizeArr[ulp_v]}.`, 22, { phase: 'union_add_size', u: i, v: j, ulp_u, ulp_v, targetRoot: ulp_v, newSize: sizeArr[ulp_v] });
                        
                        unionedEdges.push(`${Math.min(i, j)}-${Math.max(i, j)}`);
                    } else {
                        parent[ulp_v] = ulp_u;
                        add("Attach V under U", `parent.set(ulp_v, ulp_u);\nNO (Tree V is smaller or equal). Attaching tree V's root completely UNDER tree U.`, 24, { phase: 'union_attach', u: i, v: j, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                        sizeArr[ulp_u] += sizeArr[ulp_v];
                        add("Update Size of U", `size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));\nTree U absorbs Tree V's nodes. New size of Root ${ulp_u} is ${sizeArr[ulp_u]}.`, 25, { phase: 'union_add_size', u: i, v: j, ulp_u, ulp_v, targetRoot: ulp_u, newSize: sizeArr[ulp_u] });

                        unionedEdges.push(`${Math.min(i, j)}-${Math.max(i, j)}`);
                    }
                }
            } else if (isConnected && i === j) {
                add("Invoke Union", `ds.unionBySize(${i}, ${j});\nSelf connection found in matrix. Calling Union.`, 37, { phase: 'union_dsu_call_self', i, j });
                add("Union Start", `public void unionBySize(int u, int v)`, 16, { phase: 'union_start_self', u: i, v: j });
                add("Find U Root", `int ulp_u = findUPar(u); // Root is ${parent[i]}`, 17, { phase: 'union_find_self', u: i, v: j });
                add("Find V Root", `int ulp_v = findUPar(v); // Root is ${parent[j]}`, 18, { phase: 'union_find_self', u: i, v: j });
                add("Verify Disjoint", `if (ulp_u == ulp_v) return;\nNode is already in its own component. Ignoring.`, 19, { phase: 'union_verify_self', u: i, v: j });
            }
        }
    }

    add("Init Province Count", `int cnt = 0;`, 41, { phase: 'init_cnt', cnt: 0 });
    let cnt = 0;

    add("Count Provinces Loop", `for(int i = 0; i < V; i++)\nIterating through all nodes to find the ultimate roots. Every root represents a unique province!`, 42, { phase: 'count_loop', cnt });

    for(let i = 0; i < V; i++) {
        let isRoot = parent[i] === i;
        
        let desc = `if(ds.parent.get(${i}) == ${i}) cnt++;\nIs node ${i} its own parent? ${isRoot ? 'YES, increment count!' : 'NO'}`;
        add("Check Root & Increment", desc, 43, { phase: 'check_root', i, isRoot, cnt });
        
        if (isRoot) {
            cnt++;
            add("Count Incremented", `// Implicit increment of cnt due to condition\nProvince count is now ${cnt}.`, 43, { phase: 'inc_cnt', i, cnt });
        }
    }

    add("Return Final Count", `return cnt;\nFinished scanning. Total isolated provinces found: ${cnt}.`, 45, { phase: 'done', isDone: true, isSuccess: true, finalCnt: cnt });

    return steps;
  }, [baseV, baseMatrix]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-indigo-900 border-indigo-800` : 'bg-[#0f172a]'}`}>
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
                    <CheckCircle2 size={24}/> PROVINCES IDENTIFIED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. The DSU accurately resolved the network into {curStepData.state?.finalCnt} completely disconnected province(s)!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') ? 'text-indigo-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') ? 'text-emerald-400' : (String(st.phase || '').includes('matrix') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-compress" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                          <marker id="arrowhead-union" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                          </marker>
                      </defs>

                      {(() => {
                          const edgesToDraw: React.ReactNode[] = [];
                          
                          // Draw all potential edges from matrix lightly
                          for (let u = 0; u < st.V; u++) {
                              for (let v = u + 1; v < st.V; v++) {
                                  if (st.adj[u][v] === 1) {
                                      const p1 = nodePositions[u];
                                      const p2 = nodePositions[v];
                                      if (!p1 || !p2) continue;

                                      let edgeKey = `${u}-${v}`;
                                      let isUnioned = st.unionedEdges?.includes(edgeKey);
                                      let isEvaluating = st.phase?.includes('matrix_check') && ((st.i === u && st.j === v) || (st.i === v && st.j === u));

                                      let strokeColor = "#e2e8f0"; 
                                      let strokeWidth = "2";
                                      let animClass = "";

                                      if (isUnioned) {
                                          strokeColor = "#6366f1"; // Indigo
                                          strokeWidth = "5";
                                      } else if (isEvaluating) {
                                          strokeColor = "#f59e0b"; // Amber
                                          strokeWidth = "5";
                                          animClass = "animate-pulse";
                                      }

                                      edgesToDraw.push(
                                          <line 
                                              key={`edge-m-${u}-${v}`}
                                              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              className={`transition-all duration-300 ${animClass}`}
                                              strokeDasharray={isUnioned || isEvaluating ? "" : "4 4"}
                                          />
                                      );
                                  }
                              }
                          }

                          // Draw explicit parent compression lines (arcs if jumping)
                          for (let i = 0; i < st.V; i++) {
                              const p = st.parent[i];
                              if (p === i) continue; // Root, no outgoing parent line
                              
                              const p1 = nodePositions[i];
                              const p2 = nodePositions[p];
                              if (!p1 || !p2) continue;

                              let isCompressing = st.phase === 'path_compression' && st.findNode === i;
                              
                              if (isCompressing) {
                                  edgesToDraw.push(
                                      <line 
                                          key={`edge-c-${i}-${p}`}
                                          x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                          stroke="#10b981"
                                          strokeWidth="6"
                                          markerEnd="url(#arrowhead-compress)"
                                          className={`transition-all duration-500 animate-pulse`}
                                      />
                                  );
                              }
                          }

                          return edgesToDraw;
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        let isRoot = st.parent && st.parent[idx] === idx && st.phase !== 'init' && st.phase !== 'init_dsu_call' && st.phase !== 'init_dsu_cons' && st.phase !== 'init_dsu_loop' && st.phase !== 'matrix_outer';
                        let isFinalRootCounted = st.phase === 'inc_cnt' && st.i === idx;
                        
                        let isActiveI = st.phase?.includes('matrix') && st.i === idx;
                        let isActiveJ = st.phase?.includes('matrix') && st.j === idx;
                        let isActiveU = st.phase?.includes('union') && (st.u === idx || st.ulp_u === idx);
                        let isActiveV = st.phase?.includes('union') && (st.v === idx || st.ulp_v === idx);
                        let isFind = st.phase?.includes('find') && st.findNode === idx;

                        let bgClass = 'bg-slate-100 text-slate-500 border-slate-300 shadow-sm opacity-90';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isFinalRootCounted) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-2xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-emerald-300 ring-offset-2 border-transparent animate-bounce';
                            zIndex = 'z-50';
                        } else if (isFind) {
                            bgClass = 'bg-amber-400 text-white border-amber-500 shadow-xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-amber-200 ring-offset-2 border-transparent animate-pulse';
                            zIndex = 'z-50';
                        } else if (isActiveI || isActiveU) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl opacity-100 scale-110 font-black';
                            ringClass = 'ring-2 ring-sky-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActiveJ || isActiveV) {
                            bgClass = 'bg-indigo-500 text-white border-indigo-600 shadow-xl opacity-100 scale-110 font-black';
                            ringClass = 'ring-2 ring-indigo-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isRoot && st.phase !== 'inc_cnt') {
                            bgClass = 'bg-slate-800 text-white border-slate-900 shadow-md font-black';
                            zIndex = 'z-20';
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono text-xl rounded-full transition-colors duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isRoot && !isFinalRootCounted && !isActiveI && !isActiveU && !isActiveJ && !isActiveV && !isFind && <span className="absolute -top-6 text-[9px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-black border border-indigo-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Root (s:{st.sizeArr[idx]})</span>}
                                {isFinalRootCounted && <span className="absolute -bottom-6 text-[9px] text-white bg-emerald-500 px-2 py-0.5 rounded-full font-black shadow-md uppercase tracking-widest whitespace-nowrap">Province +1</span>}
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
                        <span className={`text-[12px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded border border-indigo-200 h-12 flex items-center shadow-sm`}>DSU parent[]</span>
                        <span className="text-[12px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded border border-sky-200 h-12 flex items-center shadow-sm">DSU size[]</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* PARENT ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.parent.map((val: number, idx: number) => {
                                let isEval = st.phase?.includes('check_root') && st.i === idx;
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-indigo-500 text-white border-indigo-600 scale-110 shadow-lg ring-2 ring-indigo-300 animate-in zoom-in font-black z-20";
                                else if (isPathComp) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                                else if (isEval || (st.phase?.includes('find') && st.findNode === idx)) boxBg = "bg-amber-100 text-amber-700 border-amber-300 scale-105 ring-2 ring-amber-200 z-10 font-bold";

                                return (
                                    <div key={`p-${idx}`} className="flex flex-col items-center relative group">
                                        <span className={`absolute bottom-full mb-2 text-[9px] font-mono font-black ${isEval || isPathComp ? 'text-amber-500' : 'text-slate-400'}`}>{idx}</span>
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
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Settings2 size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex justify-between">
                          Provinces Found (cnt)
                          {st.phase === 'inc_cnt' && <span className="text-emerald-500 text-[10px]">+ 1</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'inc_cnt' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>{st.cnt !== undefined ? st.cnt : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Grid size={12}/> Adjacency Matrix (adj)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-1 relative min-h-[100px] overflow-x-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (
                      <>
                          <div className="flex gap-1 mb-1">
                              <div className="w-6 h-6"></div>
                              {Array.from({length: st.V}).map((_, col) => (
                                  <div key={`head-${col}`} className={`w-8 h-6 flex items-center justify-center font-mono font-black text-[9px] rounded bg-slate-100 text-slate-400 ${st.phase?.includes('matrix') && st.j === col ? 'bg-indigo-100 text-indigo-600' : ''}`}>{col}</div>
                              ))}
                          </div>
                          {st.adj.map((row: number[], i: number) => (
                              <div key={`m-row-${i}`} className="flex gap-1">
                                  <div className={`w-6 h-8 flex items-center justify-center font-mono font-black text-[9px] rounded bg-slate-100 text-slate-400 ${st.phase?.includes('matrix') && st.i === i ? 'bg-sky-100 text-sky-600' : ''}`}>{i}</div>
                                  {row.map((val: number, j: number) => {
                                      let isEvaluating = st.phase?.includes('matrix_check') && st.i === i && st.j === j;
                                      let boxBg = val === 1 ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm font-bold" : "bg-slate-50 text-slate-300 border border-slate-100";
                                      if (isEvaluating) boxBg = "bg-amber-400 text-white border border-amber-500 scale-110 shadow-lg z-10 font-black";

                                      return (
                                          <div key={`m-cell-${i}-${j}`} className={`w-8 h-8 flex items-center justify-center font-mono text-sm rounded transition-all duration-300 select-none ${boxBg}`}>
                                              {val}
                                          </div>
                                      )
                                  })}
                              </div>
                          ))}
                      </>
                  )}
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">i (Row):</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.i !== undefined ? st.i : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-indigo-500 font-bold">j (Col):</span>
                          <span className="font-bold text-indigo-700 text-lg">{st.j !== undefined ? st.j : '-'}</span>
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
                  <span>Matrix Processing & DSU</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Fingerprint size={28}/> Number of Provinces</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Finding the "Number of Provinces" is a classic problem that fundamentally means finding the total number of <strong>Connected Components</strong> in an undirected graph.</p>
                        <p>Given an Adjacency Matrix where <code>adj[i][j] == 1</code> indicates a direct connection between city <code>i</code> and city <code>j</code>, we can rapidly group these connected networks using a <strong>Disjoint Set (Union-Find)</strong>.</p>
                        <p>We traverse the 2D matrix. Whenever we see a connection, we execute <code>unionBySize(i, j)</code>. The Disjoint Set will optimally merge their trees. Once the entire matrix is processed, we simply iterate through the <code>parent[]</code> array and count how many nodes are their own "Ultimate Parent" (meaning <code>parent[i] == i</code>). Each ultimate parent represents a completely isolated province!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Matrix</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 3<br/><strong>Matrix:</strong><br/>1 1 0<br/>1 1 0<br/>0 0 1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output: 2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">City 0 is connected to City 1. City 2 is entirely isolated. This yields exactly 2 independent provinces.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Interconnected</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 4<br/><strong>Matrix:</strong><br/>1 0 0 1<br/>0 1 1 0<br/>0 1 1 0<br/>1 0 0 1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output: 2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">City 0 connects to 3. City 1 connects to 2. Again, exactly 2 separate provinces.</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-indigo-900 border-indigo-800` : 'bg-[#0f172a]'}`}>
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
                                <CheckCircle2 size={24}/> PROVINCES IDENTIFIED
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Algorithm concluded. The DSU accurately resolved the network into {curStepData.state?.finalCnt} completely disconnected province(s)!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') ? 'text-indigo-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') ? 'text-emerald-400' : (String(st.phase || '').includes('matrix') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>V (Cities)</label>
                            <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency Matrix (Rows by |)</label>
                            <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Resolving connected components dynamically from an Adjacency Matrix using Union-Find.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-indigo-500"/> Matrix Traversal to DSU</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The input is an Adjacency Matrix, meaning we must traverse a $V \times V$ grid to find connections. A <code>1</code> at index <code>[i][j]</code> implies an undirected edge between node $i$ and node $j$. When we find this edge, we immediately feed it into a Disjoint Set (Union-Find) using <code>ds.unionBySize(i, j)</code>. The DSU will intelligently group these nodes into a shared structural tree, collapsing any interconnected networks into singular, flat roots.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MapPin size={24} className="text-emerald-500"/> Counting the Provinces (Roots)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">After traversing the entire matrix and applying Unions, our DSU is fully populated. How do we count the isolated components (Provinces)? It's incredibly elegant: In a Disjoint Set, every independent component has exactly ONE ultimate root where <code>parent[node] == node</code>. We simply run a final linear loop $O(V)$ across the parent array. The number of nodes that are their own parents is exactly equal to the number of isolated provinces!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V²)</strong><br/>We must scan the entire $V \times V$ adjacency matrix to check for edges. For each edge, the DSU operation <code>unionBySize</code> takes near-constant time $O(\alpha(V))$. The final root counting takes $O(V)$. Thus, the dominant factor is strictly the matrix traversal: $O(V^2)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The Disjoint Set requires two linear arrays: <code>parent[]</code> and <code>size[]</code>. Both arrays have exactly size $V$. The space complexity is $O(V)$ (not counting the input matrix).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'Connected Components' problem. Be prepared to compare solving this with DSU vs BFS/DFS traversal."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can this problem be solved using BFS or DFS? If so, why use DSU?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, BFS/DFS can easily solve this."</p>
                            <p>We could loop from 0 to V-1, and if a node is unvisited, increment a counter and run BFS/DFS to mark its entire connected component as visited. Both approaches yield $O(V^2)$ time due to the matrix representation. DSU is often preferred if the graph is provided dynamically (edges streaming in one by one), or if you already have a pre-written DSU class ready to deploy. BFS/DFS requires managing an explicit visited array and recursive/queue overhead."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we check `ds.parent.get(i) == i` at the end instead of just counting `ds.size.get(i) &gt; 1`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because size &gt; 1 fails to count isolated, single-node provinces."</p>
                            <p>If a city has NO connections to any other city (a row of zeroes in the matrix), it still counts as 1 distinct province! Its `size` will permanently be 1. The only bulletproof mathematical definition of a distinct province (tree component) in a DSU is its ultimate root, defined by `parent[i] == i`."</p>
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
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Matrix:</label>
                          <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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
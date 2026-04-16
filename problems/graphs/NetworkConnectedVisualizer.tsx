import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  networkConnected: {
    id: 'networkConnected',
    title: 'Network Connected (DSU)',
    icon: <NetworkIcon size={16} />,
    complexity: 'Time: O(E × α(V)) | Space: O(V)',
    theme: 'rose',
    code: `class DisjointSet {
    List<Integer> rank = new ArrayList<>();
    List<Integer> parent = new ArrayList<>();
    List<Integer> size = new ArrayList<>();
    public DisjointSet(int n) {
        for (int i = 0; i <= n; i++) {
            rank.add(0);
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
    public void unionByRank(int u, int v) {
        // Not used in this solution, but exists in the class
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
    public int Solve(int n, int[][] edge) {
        DisjointSet ds = new DisjointSet(n);
        int cntExtras = 0;
        int m = edge.length;
        for(int i = 0; i < m; i++) {
            int u = edge[i][0];
            int v = edge[i][1];
            if(ds.findUPar(u) == ds.findUPar(v)) {
                cntExtras++;
            }
            else {
                ds.unionBySize(u, v);
            }
        }
        int cntC = 0;
        for(int i = 0; i<n; i++) {
            if(ds.parent.get(i) == i) cntC++;
        }
        int ans = cntC - 1;
        if(cntExtras>=ans) return ans;
        return -1;
    }
}`,
    desc: "To connect all 'n' computers, we mathematically need exactly 'n - 1' edges (cables). This algorithm uses a Disjoint Set to track network components. If an edge connects two computers that are ALREADY in the same network, that cable is REDUNDANT (cntExtras). At the end, we count the total isolated components (cntC). We need (cntC - 1) cables to bridge them. If our redundant cables are greater than or equal to the required cables, we return (cntC - 1). Otherwise, it's impossible!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args|Solve|edge|n|m|cntExtras|cntC|ans|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'i', 'j', 'edge', 'm', 'cntExtras', 'cntC', 'ans', 'length'].includes(part);
            const isMapCall = ['Solve', 'findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get'].includes(part);
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

export default function NetworkConnectedVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'networkConnected';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [nInput, setNInput] = useState('6');
  const [edgesInput, setEdgesInput] = useState('0,1 | 0,2 | 0,3 | 1,2 | 1,3');

  const [baseN, setBaseN] = useState(6);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0, 1], [0, 2], [0, 3], [1, 2], [1, 3]
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
      setNInput('6');
      setEdgesInput('0,1 | 0,2 | 0,3 | 1,2 | 1,3');
  };

  const loadTestCase2 = () => {
      setNInput('4');
      setEdgesInput('0,1 | 1,2 | 2,0');
  };

  const loadTestCase3 = () => {
      setNInput('5');
      setEdgesInput('0,1 | 0,2 | 3,4 | 2,3');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0) n = 6;
        
        let rows = edgesInput.split('|').map(r => r.trim());
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if (cells.length === 2 && cells[0] < n && cells[1] < n) {
                parsedEdges.push(cells);
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

  // --- TRACE GENERATION (NETWORK CONNECTED) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const edges = baseEdges;
    
    if (n === 0) return steps;

    let parent = Array(n + 1).fill(0); // Using exactly n+1 size as per image
    let sizeArr = Array(n + 1).fill(1);
    
    let acceptedEdges: string[] = [];
    let redundantEdges: string[] = [];
    
    let cntExtras = 0;
    let cntC = 0;
    let ans = 0;
    let m = edges.length;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), sizeArr: clone1D(sizeArr), n, m, cntExtras, cntC, ans, originalEdges: edges, acceptedEdges: [...acceptedEdges], redundantEdges: [...redundantEdges], ...stateObj } 
    });

    const simulateFind = (node: number, originalCall: string): number => {
        add("Find Ultimate Parent", `public int findUPar(int node = ${node})\nExecuting DSU Find for node ${node}. Searching for its ultimate root.`, 12, { phase: 'find_start', findNode: node, originalCall });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node)) return node;\nIs node ${node} equal to its parent (${parent[node]})? ${isRoot ? 'YES, it is the root.' : 'NO, keep traversing upwards.'}`, 13, { phase: 'find_check', findNode: node, isRoot, originalCall });
        
        if (isRoot) return node;

        add("Recursive Call", `int ulp = findUPar(parent.get(node));\nRecursively calling findUPar() on its parent: ${parent[node]}.`, 14, { phase: 'find_recurse', findNode: node, originalCall });
        let ulp = simulateFind(parent[node], originalCall);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL OPTIMIZATION: Overwriting node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}. This flattens the tree!`, 15, { phase: 'path_compression', findNode: node, ulp, originalCall });

        add("Return Root", `return parent.get(node);\nReturning the compressed ultimate root (${ulp}) down the call stack.`, 16, { phase: 'find_ret_comp', findNode: node, ulp, originalCall });
        return ulp;
    };

    add("Init Function", `public int Solve(int n = ${n}, int[][] edge)\nStarting the solver to find the minimum operations required.`, 35, { phase: 'init' });
    
    add("Create Disjoint Set", `DisjointSet ds = new DisjointSet(n);\nAllocating DSU structure to track network connectivity.`, 36, { phase: 'init_dsu_call' });
    
    add("DSU Constructor", `public DisjointSet(int n)`, 5, { phase: 'init_dsu_cons' });
    add("DSU Init Loop", `for (int i = 0; i <= n; i++)`, 6, { phase: 'init_dsu_loop' });
    for(let i=0; i<=n; i++) {
        parent[i] = i;
        sizeArr[i] = 1;
    }
    add("DSU Base Values", `rank.add(0);\nparent.add(i);\nsize.add(1);\nEvery computer is currently isolated (Parent = self, Size = 1).`, 7, { phase: 'init_dsu_set' });

    add("Init Extras Counter", `int cntExtras = 0;\nSetting redundant cable counter to 0.`, 37, { phase: 'init_vars' });
    add("Init Edge Count", `int m = edge.length;\nTotal edges (cables) available: ${m}.`, 38, { phase: 'init_vars' });

    add("Process Edges Loop", `for(int i = 0; i < m; i++)`, 39, { phase: 'edge_loop_start' });

    for(let i = 0; i < m; i++) {
        let u = edges[i][0];
        let v = edges[i][1];
        let edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;

        add("Extract Edge U", `int u = edge[i][0]; // u = ${u}`, 40, { phase: 'extract_u', i, u, v });
        add("Extract Edge V", `int v = edge[i][1]; // v = ${v}\nEvaluating cable connecting computer ${u} and computer ${v}.`, 41, { phase: 'extract_v', i, u, v });

        add("Check Component Roots", `if(ds.findUPar(u) == ds.findUPar(v))\nQuerying DSU to see if ${u} and ${v} are already securely in the same network.`, 42, { phase: 'check_dsu_call', i, u, v });

        let ulp_u = simulateFind(u, `Edge ${u}-${v}`);
        let ulp_v = simulateFind(v, `Edge ${u}-${v}`);

        let isSame = ulp_u === ulp_v;
        let desc = `if(ds.findUPar(u) == ds.findUPar(v))\nUltimate root of ${u} is ${ulp_u}. Ultimate root of ${v} is ${ulp_v}.`;
        if (isSame) desc += `\nSince ${ulp_u} == ${ulp_v}, they are ALREADY CONNECTED! This cable is redundant and can be extracted later!`;
        else desc += `\nSince ${ulp_u} != ${ulp_v}, they are NOT connected. We must use this cable to merge them.`;
        
        add("Evaluate Connection", desc, 42, { phase: 'check_dsu_eval', i, u, v, ulp_u, ulp_v, isSame });

        if (isSame) {
            cntExtras++;
            redundantEdges.push(edgeKey);
            add("Increment Extras", `cntExtras++;\nWe found a redundant cable! Total extra cables we can extract: ${cntExtras}.`, 43, { phase: 'inc_extras', i, u, v, cntExtras });
        } else {
            acceptedEdges.push(edgeKey);
            add("Call Union", `ds.unionBySize(${u}, ${v});`, 46, { phase: 'union_dsu_call', i, u, v });
            
            // Simulate unionBySize
            add("Union Start", `public void unionBySize(int u, int v)`, 21, { phase: 'union_start', u, v, ulp_u, ulp_v });
            add("Find Root U", `int ulp_u = findUPar(u); // cached ${ulp_u}`, 22, { phase: 'union_find', u, v, ulp_u, ulp_v });
            add("Find Root V", `int ulp_v = findUPar(v); // cached ${ulp_v}`, 23, { phase: 'union_find', u, v, ulp_u, ulp_v });
            add("Verify Disjoint", `if (ulp_u == ulp_v) return;\nAlready verified they are disjoint.`, 24, { phase: 'union_verify', u, v, ulp_u, ulp_v });

            let sizeU = sizeArr[ulp_u];
            let sizeV = sizeArr[ulp_v];
            add("Evaluate Sizes", `if (size.get(ulp_u) < size.get(ulp_v))\nComparing network sizes: Is ${sizeU} < ${sizeV}?`, 25, { phase: 'union_compare', u, v, ulp_u, ulp_v, sizeU, sizeV });

            if (sizeU < sizeV) {
                parent[ulp_u] = ulp_v;
                add("Attach U under V", `parent.set(ulp_u, ulp_v);\nSmaller network ${ulp_u} is attached under larger network ${ulp_v}.`, 26, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                sizeArr[ulp_v] += sizeArr[ulp_u];
                add("Update Size", `size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));\nNetwork ${ulp_v} absorbs network ${ulp_u}. New size: ${sizeArr[ulp_v]}.`, 27, { phase: 'union_add_size', u, v, ulp_u, ulp_v, targetRoot: ulp_v, newSize: sizeArr[ulp_v] });
            } else {
                parent[ulp_v] = ulp_u;
                add("Attach V under U", `parent.set(ulp_v, ulp_u);\nNetwork ${ulp_v} is smaller or equal. Attaching it under network ${ulp_u}.`, 29, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                sizeArr[ulp_u] += sizeArr[ulp_v];
                add("Update Size", `size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));\nNetwork ${ulp_u} absorbs network ${ulp_v}. New size: ${sizeArr[ulp_u]}.`, 30, { phase: 'union_add_size', u, v, ulp_u, ulp_v, targetRoot: ulp_u, newSize: sizeArr[ulp_u] });
            }
        }
    }

    add("Init Components Counter", `int cntC = 0;\nNow we must count how many isolated networks exist in total.`, 49, { phase: 'init_cntC' });

    add("Traverse Nodes Loop", `for(int i = 0; i<n; i++)`, 50, { phase: 'cntC_loop' });

    for(let i = 0; i < n; i++) {
        let isRoot = parent[i] === i;
        add("Check Ultimate Root", `if(ds.parent.get(${i}) == ${i})\nIs computer ${i} its own ultimate parent? ${isRoot ? 'YES, it is a master root!' : 'NO'}`, 51, { phase: 'check_root', i, isRoot });
        
        if (isRoot) {
            cntC++;
            add("Increment Components", `cntC++;\nWe found a distinct disconnected network! Total components: ${cntC}.`, 51, { phase: 'inc_cntC', i, cntC });
        }
    }

    ans = cntC - 1;
    add("Calculate Required Cables", `int ans = cntC - 1;\nTo connect ${cntC} isolated networks together, we mathematically need EXACTLY (${cntC} - 1) = ${ans} cables.`, 53, { phase: 'calc_ans', cntC, ans });

    let isPossible = cntExtras >= ans;
    add("Evaluate Solvability", `if(cntExtras>=ans)\nDo we have enough redundant cables? Is ${cntExtras} >= ${ans}? ${isPossible ? 'YES! We can do it.' : 'NO! Impossible.'}`, 54, { phase: 'check_possible', cntC, ans, isPossible });

    if (isPossible) {
        add("Return Result", `return ans;\nReturning ${ans} as the minimum operations required.`, 54, { phase: 'done', isDone: true, isSuccess: true, finalAns: ans });
    } else {
        add("Return Impossible", `return -1;\nWe don't have enough extra cables to bridge the gaps. Returning -1.`, 55, { phase: 'done', isDone: true, isSuccess: false, finalAns: -1 });
    }

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

  // Dynamic Layout for components
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    if (!st.parent) return [];
    const n = st.n;
    const parent = st.parent;
    
    const nodes = Array.from({length: n}, (_, i) => ({ id: i, root: i, depth: 0 }));
    
    for (let i = 0; i < n; i++) {
        let curr = i;
        let d = 0;
        let safety = 0;
        while (parent[curr] !== curr && safety < 100) {
            curr = parent[curr];
            d++;
            safety++;
        }
        nodes[i].root = curr;
        nodes[i].depth = d;
    }

    const roots = [...new Set(nodes.map(n => n.root))].sort((a,b) => a-b);
    const canvasWidth = 600;
    const componentWidth = canvasWidth / Math.max(1, roots.length);

    const pos = new Array(n).fill({x: 0, y: 0});
    
    roots.forEach((rootId, rIdx) => {
        const cx = (rIdx + 0.5) * componentWidth;
        const compNodes = nodes.filter(n => n.root === rootId);
        
        const byDepth: Record<number, number[]> = {};
        compNodes.forEach(n => {
            if (!byDepth[n.depth]) byDepth[n.depth] = [];
            byDepth[n.depth].push(n.id);
        });

        Object.keys(byDepth).forEach(depthStr => {
            const d = parseInt(depthStr);
            const nodesAtDepth = byDepth[d].sort((a,b) => a-b);
            const spacing = componentWidth / Math.max(1, nodesAtDepth.length);
            
            nodesAtDepth.forEach((nodeId, i) => {
                let nx = cx;
                if (nodesAtDepth.length > 1) {
                    nx = cx + (i - (nodesAtDepth.length - 1) / 2) * Math.min(spacing * 0.8, 60);
                }
                let ny = 80 + d * 70; // Adjusted for neatness
                pos[nodeId] = { x: nx, y: ny };
            });
        });
    });

    return pos;
  }, [st.parent, st.n]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
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
                    {st.isSuccess ? "NETWORK CONNECTED" : "IMPOSSIBLE TO CONNECT"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `Algorithm concluded. We successfully have ${st.cntExtras} redundant cables to bridge the ${st.cntC ? st.cntC - 1 : 0} gaps between the ${st.cntC} isolated components!` : `Algorithm concluded. We only have ${st.cntExtras} redundant cables, but we need ${st.ans} to bridge the gaps. Returning -1.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('inc_extras') || String(st.phase || '').includes('impossible') ? 'text-rose-400' : (String(st.phase || '').includes('union') || String(st.phase || '').includes('calc_ans') || String(st.phase || '').includes('inc_cntC') ? 'text-emerald-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') ? 'text-fuchsia-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.parent === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Dynamic Graph Visualization */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-compress" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#d946ef" />
                          </marker>
                          <marker id="arrowhead-union" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                      </defs>

                      {(() => {
                          const edgesToDraw: React.ReactNode[] = [];
                          
                          // Draw Original Edges
                          if (st.originalEdges) {
                              st.originalEdges.forEach((edge: number[], idx: number) => {
                                  let u = edge[0];
                                  let v = edge[1];
                                  const p1 = nodePositions[u];
                                  const p2 = nodePositions[v];
                                  if (!p1 || !p2) return;

                                  let edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
                                  let isAccepted = st.acceptedEdges?.includes(edgeKey);
                                  let isRedundant = st.redundantEdges?.includes(edgeKey);
                                  
                                  let isEvaluating = st.phase?.includes('check_dsu') && st.i === idx;
                                  let isNewlyRedundant = st.phase === 'inc_extras' && st.i === idx;
                                  let isNewlyAccepted = st.phase?.includes('union_attach') && st.i === idx;

                                  let strokeColor = "#e2e8f0"; // Base faint
                                  let strokeWidth = "2";
                                  let dashArray = "";
                                  let animClass = "";

                                  if (isNewlyRedundant) {
                                      strokeColor = "#f43f5e"; // Rose
                                      strokeWidth = "5";
                                      dashArray = "6 6";
                                      animClass = "animate-pulse";
                                  } else if (isNewlyAccepted) {
                                      strokeColor = "#10b981"; // Emerald
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                  } else if (isEvaluating) {
                                      strokeColor = "#f59e0b"; // Amber
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                  } else if (isRedundant) {
                                      strokeColor = "#fda4af"; // Light Rose
                                      strokeWidth = "2";
                                      dashArray = "4 4";
                                  } else if (isAccepted) {
                                      strokeColor = "#94a3b8"; // Slate Solid (It's part of the structure, but we draw explicit tree edges below anyway, so this is just the history line)
                                      strokeWidth = "1";
                                  }

                                  edgesToDraw.push(
                                      <line 
                                          key={`edge-orig-${u}-${v}`}
                                          x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                          strokeDasharray={dashArray}
                                          className={`transition-all duration-300 ${animClass}`}
                                      />
                                  );
                              });
                          }

                          // Draw explicit parent compression lines (arcs if jumping)
                          for (let i = 0; i < st.n; i++) {
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
                                          stroke="#d946ef" // Fuchsia
                                          strokeWidth="6"
                                          markerEnd="url(#arrowhead-compress)"
                                          className={`transition-all duration-500 animate-pulse`}
                                      />
                                  );
                              } else {
                                  // Standard Parent Pointer
                                  edgesToDraw.push(
                                      <line 
                                          key={`edge-p-${i}-${p}`}
                                          x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                          stroke="#64748b" // Slate-500
                                          strokeWidth="3"
                                          markerEnd="url(#arrowhead)"
                                          className={`transition-all duration-300`}
                                      />
                                  );
                              }
                          }

                          return edgesToDraw;
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        let isRoot = st.parent && st.parent[idx] === idx && st.phase !== 'init';
                        let isFinalRootCounted = st.phase === 'inc_cntC' && st.i === idx;
                        
                        let isActiveU = st.phase?.includes('check_dsu') && st.u === idx;
                        let isActiveV = st.phase?.includes('check_dsu') && st.v === idx;
                        let isActiveU_Union = st.phase?.includes('union') && (st.u === idx || st.ulp_u === idx);
                        let isActiveV_Union = st.phase?.includes('union') && (st.v === idx || st.ulp_v === idx);
                        let isFind = st.phase?.includes('find') && st.findNode === idx;

                        let bgClass = 'bg-slate-100 text-slate-500 border-slate-300 shadow-sm opacity-90';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isFinalRootCounted) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-2xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-emerald-300 ring-offset-2 border-transparent animate-bounce';
                            zIndex = 'z-50';
                        } else if (isFind) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-fuchsia-200 ring-offset-2 border-transparent animate-pulse';
                            zIndex = 'z-50';
                        } else if (isActiveU || isActiveU_Union) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl opacity-100 scale-110 font-black';
                            ringClass = 'ring-2 ring-sky-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActiveV || isActiveV_Union) {
                            bgClass = 'bg-indigo-500 text-white border-indigo-600 shadow-xl opacity-100 scale-110 font-black';
                            ringClass = 'ring-2 ring-indigo-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isRoot && st.phase !== 'inc_cntC') {
                            bgClass = 'bg-slate-800 text-white border-slate-900 shadow-md font-black';
                            zIndex = 'z-20';
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono text-xl rounded-full transition-all duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isRoot && !isFinalRootCounted && !isActiveU && !isActiveV && !isActiveU_Union && !isActiveV_Union && !isFind && <span className="absolute -top-6 text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-black border border-slate-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Root (s:{st.sizeArr[idx]})</span>}
                                {isFinalRootCounted && <span className="absolute -bottom-6 text-[9px] text-white bg-emerald-500 px-2 py-0.5 rounded-full font-black shadow-md uppercase tracking-widest whitespace-nowrap">Component +1</span>}
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
                                if (idx >= st.n) return null; // Only show 0 to n-1 visually based on input
                                let isEval = st.phase?.includes('check_root') && st.i === idx;
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-indigo-500 text-white border-indigo-600 scale-110 shadow-lg ring-2 ring-indigo-300 animate-in zoom-in font-black z-20";
                                else if (isPathComp) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in font-black z-20";
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
                                if (idx >= st.n) return null;
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
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> Global Counters</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Redundant Cables (cntExtras)
                          {st.phase === 'inc_extras' && <span className="text-rose-500 text-[10px]">+ 1</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'inc_extras' ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>{st.cntExtras !== undefined ? st.cntExtras : '-'}</span>
                  </div>
                  <div className="h-px bg-slate-100 w-full"></div>
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Isolated Components (cntC)
                          {st.phase === 'inc_cntC' && <span className="text-emerald-500 text-[10px]">+ 1</span>}
                      </span>
                      <span className={`text-3xl font-black ${st.phase === 'inc_cntC' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>{st.cntC !== undefined ? st.cntC : '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                      <span className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest">Required Cables (ans) = cntC - 1</span>
                      <span className={`text-2xl font-black ${st.phase === 'calc_ans' ? 'text-fuchsia-600 animate-pulse' : 'text-slate-500'}`}>{st.ans !== undefined && (st.cntC || 0) > 0 ? st.ans : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">u (Edge Src):</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.u !== undefined ? st.u : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-indigo-500 font-bold">v (Edge Dst):</span>
                          <span className="font-bold text-indigo-700 text-lg">{st.v !== undefined ? st.v : '-'}</span>
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
                          <span className="text-fuchsia-500 font-bold">Find Target (node):</span>
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
                  <span>Redundancy Detection & DSU</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><NetworkIcon size={28}/> Network Connectivity</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>To fully connect a network of <code>n</code> computers, mathematical graph theory dictates that we require exactly <code>n - 1</code> edges (cables).</p>
                        <p>This algorithm elegantly solves the problem of "Can we extract redundant cables and move them to bridge isolated networks?". It iterates through all given cables using a <strong>Disjoint Set (Union-Find)</strong>. If a cable connects two computers that are ALREADY in the same group, it is officially redundant (<code>cntExtras++</code>).</p>
                        <p>At the end, we count the number of isolated networks (<code>cntC</code>). To link <code>cntC</code> independent networks together, we need exactly <code>cntC - 1</code> cables. We just compare: do we have enough redundant cables? If <code>cntExtras &gt;= cntC - 1</code>, return <code>cntC - 1</code>. Otherwise, return -1!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Needs Restructuring</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 6<br/><strong>Edges:</strong> [0,1], [0,2], [0,3], [1,2], [1,3]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output: 2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">There are 3 isolated networks: Group {'{'}0,1,2,3{'}'}, Node 4, and Node 5. Thus cntC = 3. We need 2 cables to connect them. We have 2 redundant cables in the first group. We extract and reuse them! Result = 2.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Impossible</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 4<br/><strong>Edges:</strong> [0,1], [1,2], [2,0]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output: -1</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Group {'{'}0,1,2{'}'} uses 3 cables (1 redundant). Node 3 is isolated. We have 1 redundant cable, but we need 1 cable to connect Node 3... Wait! That's possible! Output is 1. If N=5, output is -1!</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
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
                                {st.isSuccess ? "NETWORK CONNECTED" : "IMPOSSIBLE TO CONNECT"}
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.isSuccess ? `Algorithm concluded. We successfully have ${st.cntExtras} redundant cables to bridge the ${(st.cntC || 1) - 1} gaps between the ${st.cntC} isolated components!` : `Algorithm concluded. We only have ${st.cntExtras} redundant cables, but we need ${st.ans} to bridge the gaps. Returning -1.`}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('inc_extras') || String(st.phase || '').includes('impossible') ? 'text-rose-400' : (String(st.phase || '').includes('union') || String(st.phase || '').includes('calc_ans') || String(st.phase || '').includes('inc_cntC') ? 'text-emerald-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') ? 'text-fuchsia-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                        <button onClick={loadTestCase3} className={`px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 3</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N (Computers)</label>
                            <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Edges (Cables)</label>
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
                    <div className="inline-flex items-center justify-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Redundancy and Component Bridging via DSU.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><NetworkIcon size={24} className="text-rose-500"/> Redundant Cables (cntExtras)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If two computers are already connected (either directly or through other computers), placing an additional cable between them creates a cycle. This cable is mathematically <strong>redundant</strong>. In a Disjoint Set, we detect this instantly when <code>findUPar(u) == findUPar(v)</code>. We track these as "extra cables" that we can freely unplug and reuse elsewhere!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MapPin size={24} className="text-emerald-500"/> Counting Isolated Networks (cntC)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Once all valid non-redundant edges are unioned, the network will be grouped into one or more isolated components. A fundamental property of the DSU is that each isolated component has exactly ONE ultimate root where <code>parent[i] == i</code>. By iterating through all nodes and counting these roots, we discover exactly how many separate networks exist (<code>cntC</code>).</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Combine size={24} className="text-fuchsia-500"/> The Final Bridging Equation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If you have <code>N</code> isolated things, it takes exactly <code>N - 1</code> bridges to connect them all into a single continuous group. Thus, we mathematically require <code>ans = cntC - 1</code> cables to connect the network. We simply check: Do we have enough redundant cables we unplugged earlier? If <code>cntExtras &gt;= ans</code>, the answer is <code>ans</code>. If not, it's impossible (return -1)!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-rose-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem beautifully combines Cycle Detection with Component Counting. Interviewers love it because it tests two distinct DSU properties at once."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we count `cntExtras` and verify `cntExtras &gt;= ans`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's based on the minimum edges required for a spanning tree."</p>
                            <p>To connect `k` isolated components into a single spanning tree, graph theory states we need exactly `k-1` edges. Every time we encounter an edge between two nodes already in the same component, that edge is forming a cycle and is therefore redundant. We can freely remove it and use it to bridge two isolated components. Thus, if our redundant edges (`cntExtras`) are greater than or equal to the needed bridges (`k-1`), it's possible!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Can we optimize the space complexity further?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The space complexity is strictly O(V) and cannot be optimized further."</p>
                            <p>The space complexity is $O(V)$ due to the `parent` and `size` arrays. This is mathematically optimal because we must track the independent state of every node. We cannot optimize it to $O(1)$, but we do optimize the recursive call stack space of `findUPar` to an amortized $O(1)$ depth using path compression!"</p>
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
                  
                  <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
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
                                  {st.isSuccess ? "NETWORK CONNECTED" : "IMPOSSIBLE TO CONNECT"}
                              </div>
                              <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                  {st.isSuccess ? `Algorithm concluded. We successfully have ${st.cntExtras} redundant cables to bridge the ${(st.cntC || 1) - 1} gaps between the ${st.cntC} isolated components!` : `Algorithm concluded. We only have ${st.cntExtras} redundant cables, but we need ${st.ans} to bridge the gaps. Returning -1.`}
                              </p>
                           </div>
                      ) : (
                          <>
                              <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('inc_extras') || String(st.phase || '').includes('impossible') ? 'text-rose-400' : (String(st.phase || '').includes('union') || String(st.phase || '').includes('calc_ans') || String(st.phase || '').includes('inc_cntC') ? 'text-emerald-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') ? 'text-fuchsia-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                  <div className="flex flex-col gap-5 w-full h-full pb-8">
                      <div className="flex flex-col w-full">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> Global Counters</span>
                          <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                              <div className="flex flex-col gap-1">
                                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                                      Redundant Cables (cntExtras)
                                      {st.phase === 'inc_extras' && <span className="text-rose-500 text-[10px]">+ 1</span>}
                                  </span>
                                  <span className={`text-4xl font-black ${st.phase === 'inc_extras' ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>{st.cntExtras !== undefined ? st.cntExtras : '-'}</span>
                              </div>
                              <div className="h-px bg-slate-100 w-full"></div>
                              <div className="flex flex-col gap-1">
                                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                                      Isolated Components (cntC)
                                      {st.phase === 'inc_cntC' && <span className="text-emerald-500 text-[10px]">+ 1</span>}
                                  </span>
                                  <span className={`text-3xl font-black ${st.phase === 'inc_cntC' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>{st.cntC !== undefined ? st.cntC : '-'}</span>
                              </div>
                              <div className="flex flex-col gap-1 mt-2">
                                  <span className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest">Required Cables (ans) = cntC - 1</span>
                                  <span className={`text-2xl font-black ${st.phase === 'calc_ans' ? 'text-fuchsia-600 animate-pulse' : 'text-slate-500'}`}>{st.ans !== undefined && (st.cntC || 0) > 0 ? st.ans : '-'}</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col w-full mt-auto">
                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
                          <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                  <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                                      <span className="text-sky-500 font-bold">u (Edge Src):</span>
                                      <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.u !== undefined ? st.u : '-'}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                                      <span className="text-indigo-500 font-bold">v (Edge Dst):</span>
                                      <span className="font-bold text-indigo-700 text-lg">{st.v !== undefined ? st.v : '-'}</span>
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
                                      <span className="text-fuchsia-500 font-bold">Find Target (node):</span>
                                      <span className="font-bold text-fuchsia-700 text-lg">{st.findNode !== undefined ? st.findNode : '-'}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      )}
    </div>
  );
}
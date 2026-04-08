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
  dsuRank: {
    id: 'dsuRank',
    title: 'Disjoint Set (Union by Rank)',
    icon: <Fingerprint size={16} />,
    complexity: 'Time: O(α(V)) ≈ O(1) | Space: O(V)',
    theme: 'teal',
    code: `class DisjointSet {
    List<Integer> rank = new ArrayList<>();
    List<Integer> parent = new ArrayList<>();
    public DisjointSet(int n) {
        for (int i = 0; i <= n; i++) {
            rank.add(0);
            parent.add(i);
        }
    }
    public int findUPar(int node) {
        if (node == parent.get(node)) return node;
        int ulp = findUPar(parent.get(node));
        parent.set(node, ulp);
        return parent.get(node);
    }
    public void unionByRank(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (rank.get(ulp_u) < rank.get(ulp_v)) {
            parent.set(ulp_u, ulp_v);
        }
        else if (rank.get(ulp_v) < rank.get(ulp_u)) {
            parent.set(ulp_v, ulp_u);
        }
        else {
            parent.set(ulp_v, ulp_u);
            int rankU = rank.get(ulp_u);
            rank.set(ulp_u, rankU + 1);
        }
    }
}`,
    desc: "The Disjoint Set (Union-Find) is a masterclass in dynamic graph connectivity. It uses two brilliant optimizations: Union by Rank (always attach the shallower tree to the deeper tree to prevent long chains) and Path Compression (when finding a parent, update all nodes along the path to point directly to the root, flattening the tree)."
  },
  dsuSize: {
    id: 'dsuSize',
    title: 'Disjoint Set (Union by Size)',
    icon: <Scaling size={16} />,
    complexity: 'Time: O(α(V)) ≈ O(1) | Space: O(V)',
    theme: 'indigo',
    code: `class DisjointSet {
    List<Integer> size = new ArrayList<>();
    List<Integer> parent = new ArrayList<>();
    public DisjointSet(int n) {
        for (int i = 0; i <= n; i++) {
            size.add(1);
            parent.add(i);
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
        }
        else {
            parent.set(ulp_v, ulp_u);
            size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));
        }
    }
}`,
    desc: "Instead of Rank (depth), Union by Size attaches the tree with FEWER total nodes under the tree with MORE nodes. This achieves the exact same near-constant time complexity, but directly maintains the total component size, which is highly useful when answering questions like 'How many nodes are in this specific connected component?'"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Main'].includes(part);
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'rankU', 'n', 'i', 'args'].includes(part);
            const isMapCall = ['findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get', 'main'].includes(part);
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

export default function DisjointSetVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [method, setMethod] = useState<'rank' | 'size'>('rank');
  
  const selectedOpId = method === 'rank' ? 'dsuRank' : 'dsuSize';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [nInput, setNInput] = useState('7');
  const [opsInput, setOpsInput] = useState('U 1 2 | U 2 3 | U 4 5 | U 6 7 | U 5 6 | F 3 7 | U 3 7 | F 3 7');

  const [baseN, setBaseN] = useState(7);
  const [baseOps, setBaseOps] = useState<{type: string, u: number, v: number}[]>([
      {type: 'U', u: 1, v: 2}, {type: 'U', u: 2, v: 3}, {type: 'U', u: 4, v: 5}, {type: 'U', u: 6, v: 7}, 
      {type: 'U', u: 5, v: 6}, {type: 'F', u: 3, v: 7}, {type: 'U', u: 3, v: 7}, {type: 'F', u: 3, v: 7}
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
      setNInput('7');
      setOpsInput('U 1 2 | U 2 3 | U 4 5 | U 6 7 | U 5 6 | F 3 7 | U 3 7 | F 3 7');
  };

  const loadTestCase2 = () => {
      setNInput('5');
      setOpsInput('U 1 2 | U 2 3 | U 3 4 | U 4 5 | F 1 5');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0) n = 7;
        
        let parsedOps: {type: string, u: number, v: number}[] = [];
        let tokens = opsInput.split('|');
        for (let t of tokens) {
            let str = t.trim().toUpperCase();
            if(!str) continue;
            let parts = str.match(/([UF])\s*[:\s]*(\d+)[,\s]+(\d+)/);
            if (parts) {
                let type = parts[1];
                let u = parseInt(parts[2], 10);
                let v = parseInt(parts[3], 10);
                if (u <= n && v <= n && u >= 1 && v >= 1) {
                    parsedOps.push({type, u, v});
                }
            }
        }
        
        setBaseN(n);
        setBaseOps(parsedEdges => parsedOps.length > 0 ? parsedOps : parsedEdges);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, opsInput, method]);

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

  const clone1D = (arr: number[]) => [...arr];

  // --- TRACE GENERATION (DISJOINT SET - RANK & SIZE) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const ops = baseOps;
    
    if (n === 0) return steps;

    let parent = Array(n + 1).fill(0);
    let rank = Array(n + 1).fill(0);
    let size = Array(n + 1).fill(1);
    
    let logs: string[] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), rank: clone1D(rank), size: clone1D(size), n, logs: [...logs], ...stateObj } 
    });

    add("Init Class", `public DisjointSet(int n)\nInitializing Disjoint Set structural arrays.`, 4, { phase: 'init' });
    
    add("Init Loop", `for (int i = 0; i <= n; i++)\nWe iterate through every node from 0 to n.`, 5, { phase: 'init_loop' });
    for(let i = 0; i <= n; i++) {
        rank[i] = 0;
        size[i] = 1;
        parent[i] = i;
    }
    
    if (method === 'rank') {
        add("Set Base Values", `rank.add(0);\nparent.add(i);\nEvery node forms its own independent component with Rank 0 and Parent = self.`, 6, { phase: 'init_set' });
    } else {
        add("Set Base Values", `size.add(1);\nparent.add(i);\nEvery node forms its own independent component with Size 1 and Parent = self.`, 6, { phase: 'init_set' });
    }

    // Recursive Simulator that natively flattens the calls into sequential steps
    const simulateFind = (node: number, originalCall: string): number => {
        add("Find Ultimate Parent", `public int findUPar(int node = ${node})\nStarting recursive search to find the absolute topmost root of node ${node}.`, 10, { phase: 'find_start', findNode: node, originalCall });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node))\nIs ${node} equal to its parent (${parent[node]})? ${isRoot ? 'YES, it is the root!' : 'NO, keep searching upwards.'}`, 11, { phase: 'find_check', findNode: node, isRoot, originalCall });
        
        if (isRoot) {
            return node;
        }

        add("Recursive Find", `int ulp = findUPar(parent.get(${node}));\nRecursively calling findUPar() on the parent: ${parent[node]}.`, 12, { phase: 'find_recurse', findNode: node, originalCall });
        let ulp = simulateFind(parent[node], originalCall);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL PATH COMPRESSION: The recursive calls are resolving backwards. We forcefully rewrite node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}!`, 13, { phase: 'path_compression', findNode: node, ulp, originalCall });

        add("Return Compressed Parent", `return parent.get(${node});\nPassing the compressed ultimate root (${ulp}) back down the recursive chain.`, 14, { phase: 'find_ret_comp', findNode: node, ulp, originalCall });
        return ulp;
    };

    for(let op of ops) {
        if (op.type === 'U') {
            let u = op.u, v = op.v;
            add(`Union By ${method === 'rank' ? 'Rank' : 'Size'}`, `public void unionBy${method === 'rank' ? 'Rank' : 'Size'}(int u = ${u}, int v = ${v})\nAttempting to connect components containing ${u} and ${v}.`, 16, { phase: 'union_start', u, v });

            add("Find U", `int ulp_u = findUPar(${u});\nFirst, find the ultimate parent of the left component.`, 17, { phase: 'union_find_u', u, v });
            let ulp_u = simulateFind(u, `Union(${u},${v})`);

            add("Find V", `int ulp_v = findUPar(${v});\nNext, find the ultimate parent of the right component.`, 18, { phase: 'union_find_v', u, v, ulp_u });
            let ulp_v = simulateFind(v, `Union(${u},${v})`);

            let isSame = ulp_u === ulp_v;
            add("Check Same Component", `if (ulp_u == ulp_v) return;\nAre they already connected? Is ${ulp_u} == ${ulp_v}? ${isSame ? 'YES, return early.' : 'NO, disjoint trees.'}`, 19, { phase: 'union_check_same', u, v, ulp_u, ulp_v, isSame });

            if (isSame) {
                logs.push(`Union(${u},${v}) -> Ignored (Already connected via Root ${ulp_u})`);
                continue;
            }

            if (method === 'rank') {
                let rankU = rank[ulp_u];
                let rankV = rank[ulp_v];

                add("Evaluate Rank U < V", `if (rank.get(${ulp_u}) < rank.get(${ulp_v}))\nChecking tree depths: Is tree U (rank ${rankU}) strictly shallower than tree V (rank ${rankV})?`, 20, { phase: 'union_check_1', u, v, ulp_u, ulp_v, rankU, rankV });

                if (rankU < rankV) {
                    parent[ulp_u] = ulp_v;
                    add("Attach U under V", `parent.set(${ulp_u}, ${ulp_v});\nYES! Because tree U is shallower, attach its root completely UNDER the deeper tree V. Depth of V is unaffected!`, 21, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                    logs.push(`Union(${u},${v}) -> Attached shallower Root ${ulp_u} under Root ${ulp_v}`);
                } else {
                    add("Evaluate Rank V < U", `else if (rank.get(${ulp_v}) < rank.get(${ulp_u}))\nChecking tree depths: Is tree V (rank ${rankV}) strictly shallower than tree U (rank ${rankU})?`, 23, { phase: 'union_check_2', u, v, ulp_u, ulp_v, rankU, rankV });
                    if (rankV < rankU) {
                        parent[ulp_v] = ulp_u;
                        add("Attach V under U", `parent.set(${ulp_v}, ${ulp_u});\nYES! Because tree V is shallower, attach its root completely UNDER the deeper tree U. Depth of U is unaffected!`, 24, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                        logs.push(`Union(${u},${v}) -> Attached shallower Root ${ulp_v} under Root ${ulp_u}`);
                    } else {
                        add("Ranks Equal Fallback", `else {\nRanks are exactly equal (${rankU} == ${rankV}). We arbitrarily choose to attach tree V under tree U.`, 26, { phase: 'union_check_eq', u, v, ulp_u, ulp_v, rankU, rankV });
                        
                        parent[ulp_v] = ulp_u;
                        add("Attach V under U", `parent.set(${ulp_v}, ${ulp_u});\nForcefully attached root ${ulp_v} under root ${ulp_u}.`, 27, { phase: 'union_attach_eq', u, v, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });

                        add("Extract Rank U", `int rankU = rank.get(${ulp_u});\nBecause we attached an equally deep tree underneath it, the maximum depth of U increases.`, 28, { phase: 'union_inc_extract', u, v, ulp_u, ulp_v });
                        
                        rank[ulp_u] += 1;
                        add("Increment Rank U", `rank.set(${ulp_u}, rankU + 1);\nThe rank of root ${ulp_u} is strictly increased by 1 (Now it is ${rank[ulp_u]}).`, 29, { phase: 'union_inc_rank_done', u, v, ulp_u, ulp_v, newRank: rank[ulp_u] });
                        logs.push(`Union(${u},${v}) -> Equal Ranks. Attached Root ${ulp_v} under Root ${ulp_u} (Rank increased to ${rank[ulp_u]})`);
                    }
                }
            } else {
                // Union by Size Logic
                let sizeU = size[ulp_u];
                let sizeV = size[ulp_v];

                add("Evaluate Size U < V", `if (size.get(${ulp_u}) < size.get(${ulp_v}))\nChecking node counts: Does tree U (size ${sizeU}) have strictly FEWER nodes than tree V (size ${sizeV})?`, 20, { phase: 'union_check_s1', u, v, ulp_u, ulp_v, sizeU, sizeV });

                if (sizeU < sizeV) {
                    parent[ulp_u] = ulp_v;
                    add("Attach U under V", `parent.set(${ulp_u}, ${ulp_v});\nYES! Attach the smaller tree U under the larger tree V.`, 21, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                    size[ulp_v] += size[ulp_u];
                    add("Add Size to V", `size.set(${ulp_v}, size.get(${ulp_v}) + size.get(${ulp_u}));\nTree V absorbs the nodes. New size of Root ${ulp_v} is ${size[ulp_v]}.`, 22, { phase: 'union_add_size', u, v, ulp_u, ulp_v, targetRoot: ulp_v, newSize: size[ulp_v] });
                    logs.push(`Union(${u},${v}) -> Attached smaller Root ${ulp_u} under Root ${ulp_v} (Size ${size[ulp_v]})`);
                } else {
                    add("Evaluate Size V <= U", `else {\nTree V (size ${sizeV}) is equal or smaller than tree U (size ${sizeU}). We attach V under U.`, 24, { phase: 'union_check_s2', u, v, ulp_u, ulp_v, sizeU, sizeV });
                    
                    parent[ulp_v] = ulp_u;
                    add("Attach V under U", `parent.set(${ulp_v}, ${ulp_u});\nAttached the smaller/equal tree V under the larger tree U.`, 25, { phase: 'union_attach', u, v, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                    
                    size[ulp_u] += size[ulp_v];
                    add("Add Size to U", `size.set(${ulp_u}, size.get(${ulp_u}) + size.get(${ulp_v}));\nTree U absorbs the nodes. New size of Root ${ulp_u} is ${size[ulp_u]}.`, 26, { phase: 'union_add_size', u, v, ulp_u, ulp_v, targetRoot: ulp_u, newSize: size[ulp_u] });
                    logs.push(`Union(${u},${v}) -> Attached Root ${ulp_v} under Root ${ulp_u} (Size ${size[ulp_u]})`);
                }
            }

        } else if (op.type === 'F') {
            let u = op.u, v = op.v;
            add("Checking Connectivity", `// Executing user queries dynamically...\nChecking if node ${u} and node ${v} belong to the exact same component.`, 0, { phase: 'check_conn', u, v }); // Line 0 because it's in Main

            add("Find U", `ds.findUPar(${u})\nRetrieving ultimate parent for the left node.`, 0, { phase: 'check_find_u', u, v });
            let ulp_u = simulateFind(u, `Check(${u},${v})`);

            add("Find V", `ds.findUPar(${v})\nRetrieving ultimate parent for the right node.`, 0, { phase: 'check_find_v', u, v, ulp_u });
            let ulp_v = simulateFind(v, `Check(${u},${v})`);

            let isSame = ulp_u === ulp_v;
            add("Compare Results", `if (ds.findUPar(${u}) == ds.findUPar(${v}))\nAre their ultimate roots identical? Is ${ulp_u} == ${ulp_v}?`, 0, { phase: 'check_eval', u, v, ulp_u, ulp_v, isSame });

            if (isSame) {
                logs.push(`Check(${u},${v}) -> SAME COMPONENT! (Root: ${ulp_u})`);
                add("Output Result", `System.out.println("Same");\nThey share the same root ${ulp_u}.`, 0, { phase: 'check_output', u, v, result: 'Same' });
            } else {
                logs.push(`Check(${u},${v}) -> NOT SAME. (Roots: ${ulp_u} vs ${ulp_v})`);
                add("Output Result", `System.out.println("Not Same");\nThey are completely isolated from each other.`, 0, { phase: 'check_output', u, v, result: 'Not Same' });
            }
        }
    }

    add("Simulation Complete", `All operations processed successfully. Notice how completely flat the trees became thanks to Path Compression!`, 0, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseOps, method]);

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

  // Tree Component Layout Mathematics
  const nodePositions = useMemo(() => {
    if (!st.parent) return [];
    const n = st.n;
    const parent = st.parent;
    
    // We compute depth and root for every node dynamically
    const nodes = Array.from({length: n + 1}, (_, i) => ({ id: i, root: i, depth: 0 }));
    
    for (let i = 1; i <= n; i++) {
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

    const roots = [...new Set(nodes.slice(1).map(n => n.root))].sort((a,b) => a-b);
    const canvasWidth = 600;
    const componentWidth = canvasWidth / Math.max(1, roots.length);

    // Calculate positions
    const pos = new Array(n + 1).fill({x: 0, y: 0});
    
    roots.forEach((rootId, rIdx) => {
        const cx = (rIdx + 0.5) * componentWidth;
        const compNodes = nodes.slice(1).filter(n => n.root === rootId);
        
        // Group by depth
        const byDepth: Record<number, number[]> = {};
        compNodes.forEach(n => {
            if (!byDepth[n.depth]) byDepth[n.depth] = [];
            byDepth[n.depth].push(n.id);
        });

        Object.keys(byDepth).forEach(depthStr => {
            const d = parseInt(depthStr);
            const nodesAtDepth = byDepth[d].sort((a,b) => a-b); // consistent ordering
            const spacing = componentWidth / Math.max(1, nodesAtDepth.length);
            
            nodesAtDepth.forEach((nodeId, i) => {
                // For leaves, spread them out. For root (d=0), center it.
                let nx = cx;
                if (nodesAtDepth.length > 1) {
                    nx = cx + (i - (nodesAtDepth.length - 1) / 2) * Math.min(spacing * 0.8, 60);
                }
                let ny = 100 + d * 80;
                pos[nodeId] = { x: nx, y: ny };
            });
        });
    });

    return pos;
  }, [st.parent, st.n]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-${themeColor}-900 border-${themeColor}-800` : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               {curStepData.line === 0 ? (
                   <span className="bg-sky-700/50 text-sky-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Global</span>
               ) : (
                   <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
               )}
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-${themeColor}-400`}>
                    <CheckCircle2 size={24}/> DSU SIMULATION COMPLETE
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    All Union and Find operations executed flawlessly. The trees have been optimally flattened using Path Compression!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('path_compression') ? 'text-amber-400' : (String(st.phase || '').includes('union_attach') || String(st.phase || '').includes('union_add') ? 'text-emerald-400' : (String(st.phase || '').includes('check_output') ? 'text-sky-400' : (String(st.phase || '').includes('find') ? 'text-fuchsia-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.parent === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const svgSize = 600;

      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
              
              {/* Check Output Display */}
              {st.phase === 'check_output' && (
                  <div className="absolute top-1/3 mt-8 flex flex-col items-center justify-center gap-3 bg-white/95 backdrop-blur border border-slate-200 px-10 py-8 rounded-[3rem] shadow-2xl z-50 animate-in zoom-in ring-4 ring-sky-200 scale-110">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Result for Check({st.u}, {st.v})</span>
                      <span className={`font-black text-3xl uppercase tracking-widest flex items-center gap-3 ${st.result === 'Same' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {st.result === 'Same' ? <CheckCircle2 size={32}/> : <X size={32}/>}
                          {st.result} Component
                      </span>
                  </div>
              )}

              {/* Dynamic Forest Visualization */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-compress" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                          </marker>
                          <marker id="arrowhead-union" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                      </defs>

                      {(() => {
                          const edgesToDraw: React.ReactNode[] = [];
                          for (let i = 1; i <= st.n; i++) {
                              const p = st.parent[i];
                              if (p === i) continue; // Root, no outgoing edge
                              
                              const p1 = nodePositions[i];
                              const p2 = nodePositions[p];
                              if (!p1 || !p2) continue;

                              let isCompressing = st.phase === 'path_compression' && st.findNode === i;
                              let isUnionAttach = st.phase?.includes('union_attach') && st.attachedRoot === i;

                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let marker = "url(#arrowhead)";
                              let animClass = "";

                              if (isCompressing) {
                                  strokeColor = "#f59e0b"; // Amber
                                  strokeWidth = "5";
                                  marker = "url(#arrowhead-compress)";
                                  animClass = "animate-pulse";
                              } else if (isUnionAttach) {
                                  strokeColor = "#10b981"; // Emerald
                                  strokeWidth = "5";
                                  marker = "url(#arrowhead-union)";
                                  animClass = "animate-pulse";
                              }

                              edgesToDraw.push(
                                  <line 
                                      key={`edge-${i}-${p}`}
                                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                      stroke={strokeColor}
                                      strokeWidth={strokeWidth}
                                      markerEnd={marker}
                                      className={`transition-all duration-500 ${animClass}`}
                                  />
                              );
                          }
                          return edgesToDraw;
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        if (idx === 0) return null; // 1-based indexing used

                        let isRoot = st.parent[idx] === idx;
                        let isActiveFind = st.phase?.includes('find') && st.findNode === idx;
                        let isActiveUnionU = st.phase?.includes('union') && (st.u === idx || st.ulp_u === idx);
                        let isActiveUnionV = st.phase?.includes('union') && (st.v === idx || st.ulp_v === idx);

                        let bgClass = 'bg-white text-slate-600 border-slate-300 shadow-sm';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isActiveFind) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl scale-125';
                            ringClass = 'ring-4 ring-fuchsia-200 ring-offset-2 border-transparent';
                            zIndex = 'z-50';
                        } else if (isActiveUnionU) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl scale-110';
                            ringClass = 'ring-2 ring-sky-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActiveUnionV) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-xl scale-110';
                            ringClass = 'ring-2 ring-emerald-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isRoot) {
                            bgClass = 'bg-slate-800 text-white border-slate-900 shadow-md font-black';
                        }

                        let rootLabel = method === 'rank' ? `r:${st.rank[idx]}` : `s:${st.size[idx]}`;

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-all duration-500 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isRoot && <span className="absolute -top-6 text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-black border shadow-sm uppercase tracking-widest whitespace-nowrap">Root ({rootLabel})</span>}
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
        <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[200px] relative z-30 bg-slate-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] shrink-0">
            <div className="flex flex-col items-center shrink-0 w-full mb-4">
                <div className="flex gap-4 items-center">
                    
                    <div className="flex flex-col gap-4 items-end justify-center pr-4">
                        <span className={`text-[12px] font-black uppercase tracking-widest text-${themeColor}-600 bg-${themeColor}-50 px-3 py-1 rounded border border-${themeColor}-200 h-12 flex items-center shadow-sm`}>parent[]</span>
                        <span className="text-[12px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded border border-amber-200 h-12 flex items-center shadow-sm">{method === 'rank' ? 'rank[]' : 'size[]'}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* PARENT ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.parent.map((val: number, idx: number) => {
                                if (idx === 0) return null; // Hide 0
                                let isEval = st.phase?.includes('find') && st.findNode === idx;
                                let isUpdated = (st.phase === 'path_compression' && st.findNode === idx) || (st.phase?.includes('union_attach') && st.attachedRoot === idx);
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                                else if (isEval) boxBg = "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 scale-105 ring-2 ring-fuchsia-200 z-10 font-bold";

                                return (
                                    <div key={`p-${idx}`} className="flex flex-col items-center relative group">
                                        <span className={`absolute bottom-full mb-2 text-[9px] font-mono font-black ${idx === st.findNode ? 'text-fuchsia-500' : 'text-slate-400'}`}>{idx}</span>
                                        <div className={`w-14 h-12 flex items-center justify-center font-mono text-xl rounded border-2 transition-all duration-300 ${boxBg}`}>
                                            {val}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* RANK/SIZE ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {(method === 'rank' ? st.rank : st.size).map((val: number, idx: number) => {
                                if (idx === 0) return null; // Hide 0
                                let isEval = st.phase?.includes('union_check') && (st.ulp_u === idx || st.ulp_v === idx);
                                let isUpdated = (st.phase === 'union_inc_rank_done' && st.ulp_u === idx) || (st.phase === 'union_add_size' && st.targetRoot === idx);
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-amber-500 text-white border-amber-600 scale-110 shadow-lg ring-2 ring-amber-300 animate-in zoom-in font-black z-20";
                                else if (isEval) boxBg = "bg-sky-100 text-sky-700 border-sky-300 scale-105 ring-2 ring-sky-200 z-10 font-bold";

                                return (
                                    <div key={`rs-${idx}`} className="flex flex-col items-center relative group">
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
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Settings2 size={12}/> Active Operation</span>
              <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-5 flex flex-col gap-2 font-mono text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none"><Fingerprint size={60}/></div>
                  <span className="text-xs text-sky-400 font-bold uppercase tracking-widest">Executing Context</span>
                  <span className={`text-xl font-black text-white tracking-widest`}>
                      {st.originalCall || (st.u ? `Union(${st.u}, ${st.v})` : 'Initializing...')}
                  </span>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Output Console</span>
              <div className="flex flex-col w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-inner p-3 gap-1 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  {st.logs === undefined || st.logs.length === 0 ? <span className="text-slate-600 font-mono italic text-xs py-2 text-center w-full">No outputs yet...</span> : (st.logs || []).map((logStr: string, i: number) => {
                      let isNew = i === st.logs.length - 1 && st.phase === 'check_output';
                      return (
                          <div key={`log-${i}`} className={`font-mono text-xs transition-all duration-500 ${isNew ? 'text-emerald-400 animate-in slide-in-from-left-4' : 'text-slate-400'}`}>
                              &gt; {logStr}
                          </div>
                      )
                  })}
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">u (Param):</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.u !== undefined ? st.u : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-emerald-500 font-bold">v (Param):</span>
                          <span className="font-bold text-emerald-700 text-lg">{st.v !== undefined ? st.v : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-sky-500 font-bold">ulp_u:</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.ulp_u !== undefined ? st.ulp_u : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-emerald-500 font-bold">ulp_v:</span>
                          <span className="font-bold text-emerald-700 text-lg">{st.ulp_v !== undefined ? st.ulp_v : '-'}</span>
                      </div>
                      
                      {method === 'size' ? (
                          <>
                              <div className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="text-amber-500 font-bold">sizeU:</span>
                                  <span className="font-bold text-amber-700 text-lg">{st.sizeU !== undefined ? st.sizeU : '-'}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="text-amber-500 font-bold">sizeV:</span>
                                  <span className="font-bold text-amber-700 text-lg">{st.sizeV !== undefined ? st.sizeV : '-'}</span>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="text-amber-500 font-bold">rankU:</span>
                                  <span className="font-bold text-amber-700 text-lg">{st.rankU !== undefined ? st.rankU : '-'}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="text-amber-500 font-bold">rankV:</span>
                                  <span className="font-bold text-amber-700 text-lg">{st.rankV !== undefined ? st.rankV : '-'}</span>
                              </div>
                          </>
                      )}

                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
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
                  <span>{method === 'rank' ? 'Union by Rank' : 'Union by Size'} & Path Compression</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none items-center gap-2">
            
            {/* Algorithm Toggle */}
            <div className="flex bg-slate-200 p-1 rounded-xl mr-4">
                <button onClick={() => {setMethod('rank'); handleReset();}} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${method === 'rank' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>By Rank</button>
                <button onClick={() => {setMethod('size'); handleReset();}} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${method === 'size' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>By Size</button>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Fingerprint size={28}/> The Disjoint Set (Union-Find)</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>The Disjoint Set is an extraordinarily elegant data structure designed to track connectivity components in a graph dynamically. It supports two primary operations in near-constant time <code>O(&alpha;(V))</code>: <strong>Union(u, v)</strong> (connects two components) and <strong>Find(node)</strong> (tells you which component a node belongs to).</p>
                        <p>To achieve this blistering speed, it utilizes two mandatory optimizations:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-600">
                            <li><strong>Union by Rank / Size:</strong> When merging two trees, we ALWAYS attach the shallower tree (lower rank) or smaller tree (lower size) to the root of the deeper/larger tree. This prevents the tree from forming long, slow, linked-list chains.</li>
                            <li><strong>Path Compression:</strong> Whenever we call <code>Find()</code>, the recursive function rewires every single node it visits along the path to point DIRECTLY to the ultimate root. Next time we search for those nodes, it takes literally 1 step!</li>
                        </ul>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 7<br/><strong>Ops:</strong> U:1,2 | U:2,3 | U:4,5 | U:6,7 | U:5,6 | F:3,7 | U:3,7 | F:3,7</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Exactly matches the provided Main class. Builds separate components, checks if 3 and 7 are connected (No), unions them, then checks again (Yes!).</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Path Compression Demo</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 5<br/><strong>Ops:</strong> U:1,2 | U:2,3 | U:3,4 | U:4,5 | F:1,5</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Forces the creation of a skewed tree, and the final Find(1, 5) operation visibly triggers a massive path compression sweep that flattens everything!</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-${themeColor}-900 border-${themeColor}-800` : 'bg-[#0f172a]'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                        <div className="flex items-center gap-2">
                           {curStepData.line === 0 ? (
                               <span className="bg-sky-700/50 text-sky-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Main.java</span>
                           ) : (
                               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                           )}
                        </div>
                    </div>
                    {st.isDone ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-${themeColor}-400`}>
                                <CheckCircle2 size={24}/> DSU SIMULATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                All Union and Find operations executed flawlessly. The trees have been optimally flattened using Path Compression!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('path_compression') ? 'text-amber-400' : (String(st.phase || '').includes('union_attach') || String(st.phase || '').includes('union_add') ? 'text-emerald-400' : (String(st.phase || '').includes('check_output') ? 'text-sky-400' : (String(st.phase || '').includes('find') ? 'text-fuchsia-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Compression Demo</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N (Nodes)</label>
                            <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Operations (e.g. U 1 2 | F 3 7)</label>
                            <input type="text" value={opsInput} onChange={(e) => setOpsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                    
                    {renderStateArrays()}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-teal-100 text-teal-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the brilliant structural optimizations of Disjoint Sets.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><NetworkIcon size={24} className="text-teal-500"/> Union By Rank vs Union By Size</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we blindly attach one tree to another during a Union, we risk creating a tall, linked-list-like structure. Finding a root in a tall tree is slow!</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Union by Rank</strong> roughly represents the "height" of the tree. When merging, we compare ranks: we strictly attach the shallower tree (smaller rank) to the root of the deeper tree (larger rank). The overall height of the tree doesn't increase! Only when the ranks are exactly equal do we increment the rank of the new root.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Union by Size</strong> achieves the exact same optimization, but tracks the total <em>number of nodes</em> in a tree instead of its depth. The smaller tree is always attached to the larger tree.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowDown size={24} className="text-fuchsia-500"/> Path Compression</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Even with structural Union optimizations, trees can still get somewhat deep. <strong>Path Compression</strong> is a hack performed during the <code>findUPar()</code> function. When we recursively traverse upwards to find the ultimate root, we don't just return it. On the way back down, we rewrite every single intermediate node's <code>parent</code> pointer to point DIRECTLY to that ultimate root. The entire branch instantly flattens!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(&alpha;(V))</strong><br/>When Union optimization and Path Compression are used together, the amortized time complexity per operation becomes the inverse Ackermann function, &alpha;(V). For all practical universe sizes, &alpha;(V) &le; 4. Therefore, operations are essentially strictly $O(1)$ constant time.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>We only need two arrays, <code>parent[]</code> and <code>rank[]</code> (or <code>size[]</code>), both scaling exactly with the number of vertices $V$. Hence, $O(V)$ space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-teal-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"DSU is commonly tested in Kruskal's MST algorithm, or for finding connected components dynamically. Expect to justify your optimization choices."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "When should I use Union by Size instead of Union by Rank?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Whenever component size is a metric of interest in the problem!"</p>
                            <p>Both provide the exact same $O(\alpha(V))$ time complexity when combined with path compression. However, Union by Size is often preferred because the resulting `size[]` array natively tells you exactly how large a connected component is. If the problem asks 'What is the size of the largest group?', you simply find the maximum value in the size array for all root nodes!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Does 'rank' strictly equal the height of the tree?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No! Once path compression triggers, rank is no longer accurate."</p>
                            <p>When path compression flattens a deep branch, the actual height of the tree decreases, but we DO NOT update the `rank` array. Recalculating the true height after compression would take $O(N)$ time and defeat the entire purpose of the DSU. Therefore, `rank` is simply an upper-bound heuristic used solely for safe merging."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N:</label>
                          <input type="text" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Operations:</label>
                          <input type="text" value={opsInput} onChange={(e) => setOpsInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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
                  
                  {renderStateArrays()}
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
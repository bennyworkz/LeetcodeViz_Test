import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid as GridIcon, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox, Link
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  maxStonesRemoved: {
    id: 'maxStonesRemoved',
    title: 'Most Stones Removed (DSU)',
    icon: <GridIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'violet',
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
        // Unused in this solution
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
    int maxRemove(int[][] stones, int n) {
        int maxRow = 0;
        int maxCol = 0;
        for (int i = 0; i < n; i++) {
            maxRow = Math.max(maxRow, stones[i][0]);
            maxCol = Math.max(maxCol, stones[i][1]);
        }
        DisjointSet ds = new DisjointSet(maxRow + maxCol + 1);
        HashMap<Integer, Integer> stoneNodes = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int nodeRow = stones[i][0];
            int nodeCol = stones[i][1] + maxRow + 1;
            ds.unionBySize(nodeRow, nodeCol);
            stoneNodes.put(nodeRow, 1);
            stoneNodes.put(nodeCol, 1);
        }

        int cnt = 0;
        for (Map.Entry<Integer, Integer> it : stoneNodes.entrySet()) {
            if (ds.findUPar(it.getKey()) == it.getKey()) {
                cnt++;
            }
        }
        return n - cnt;
    }
}`,
    desc: "To maximize stone removal, we must realize that stones in the same row or column form a connected component! If 5 stones are interconnected, we can sequentially remove 4 of them, leaving exactly 1 behind. Thus, for any component, removable stones = (Size - 1). For the entire grid, Total Removable = N (total stones) - cnt (number of isolated components). We use a brilliant DSU trick: we treat Rows and Columns as 'Nodes'. A stone simply acts as an EDGE bridging a Row Node to a Column Node! To prevent Row 2 and Column 2 from overlapping as 'Node 2', we mathematically shift all column indices by (maxRow + 1). Node mapping solved!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args|maxRemove|stones|n|maxRow|maxCol|Math|max|HashMap|stoneNodes|nodeRow|nodeCol|put|Map|Entry|entrySet|it|getKey|cnt)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Solution', 'HashMap', 'Map', 'Entry'].includes(part);
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'i', 'stones', 'maxRow', 'maxCol', 'stoneNodes', 'nodeRow', 'nodeCol', 'it', 'cnt'].includes(part);
            const isMapCall = ['maxRemove', 'isValid', 'findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get', 'max', 'put', 'entrySet', 'getKey'].includes(part);
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

export default function MaxStonesRemovedVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'maxStonesRemoved';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [nInput, setNInput] = useState('10');
  const [stonesInput, setStonesInput] = useState('0,0 | 0,1 | 1,0 | 1,2 | 2,1 | 2,2 | 3,3 | 3,4 | 4,3 | 4,5');

  const [baseN, setBaseN] = useState(10);
  const [baseStones, setBaseStones] = useState<number[][]>([
      [0,0], [0,1], [1,0], [1,2], [2,1], [2,2], [3,3], [3,4], [4,3], [4,5]
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
      setNInput('10');
      setStonesInput('0,0 | 0,1 | 1,0 | 1,2 | 2,1 | 2,2 | 3,3 | 3,4 | 4,3 | 4,5');
  };

  const loadTestCase2 = () => {
      setNInput('5');
      setStonesInput('0,0 | 0,2 | 1,1 | 2,0 | 2,2');
  };

  const loadTestCase3 = () => {
      setNInput('1');
      setStonesInput('0,0');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0 || n > 20) n = 10;
        
        let rows = stonesInput.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsed: number[][] = [];
        
        for (let i = 0; i < Math.min(n, rows.length); i++) {
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if(cells.length === 2 && !isNaN(cells[0]) && !isNaN(cells[1])) {
                parsed.push([cells[0], cells[1]]);
            }
        }
        
        if(parsed.length > 0) {
            setBaseN(parsed.length);
            setBaseStones(parsed);
            setCurrentStep(0);
            setPan({ x: 0, y: 0 });
            setZoom(1);
        }
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, stonesInput]);

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

  // --- EXACT LINE-BY-LINE TRACE GENERATION (MAX STONES REMOVAL) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const stones = baseStones;
    
    if (n === 0) return steps;

    let parent: number[] = []; 
    let sizeArr: number[] = [];
    let mapStoneNodes: Record<number, number> = {};
    
    let maxRow = 0;
    let maxCol = 0;
    let cnt = 0;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), sizeArr: clone1D(sizeArr), n, stones, mapStoneNodes: {...mapStoneNodes}, maxRow, maxCol, cnt, ...stateObj } 
    });

    const simulateFind = (node: number, originalCall: string): number => {
        add("Find Ultimate Parent", `public int findUPar(int node = ${node})\nExecuting DSU Find for node ${node}. Traversing upwards to find its ultimate root.`, 12, { phase: 'find_start', findNode: node, originalCall });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node)) return node;\nIs node ${node} its own parent? ${isRoot ? 'YES, returning it directly.' : 'NO, keep climbing.'}`, 13, { phase: 'find_check', findNode: node, isRoot, originalCall });
        
        if (isRoot) return node;

        add("Recursive Call", `int ulp = findUPar(parent.get(node));\nRecursively calling findUPar() on its immediate parent: ${parent[node]}.`, 14, { phase: 'find_recurse', findNode: node, originalCall });
        let ulp = simulateFind(parent[node], originalCall);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL OPTIMIZATION: Overwriting node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}. This flattens the tree!`, 15, { phase: 'path_compression', findNode: node, ulp, originalCall });

        add("Return Root", `return parent.get(node);\nReturning the compressed ultimate root (${ulp}) down the call stack.`, 16, { phase: 'find_ret_comp', findNode: node, ulp, originalCall });
        return ulp;
    };

    add("Init Function", `int maxRemove(int[][] stones, int n)\nStarting algorithm to determine the maximum stones we can sequentially remove!`, 36, { phase: 'init' });
    
    add("Init Maxes", `int maxRow = 0;\nint maxCol = 0;\nPreparing variables to scan the grid boundaries.`, 37, { phase: 'init_vars' });

    for(let i=0; i<n; i++) {
        add("Loop Bounds", `for (int i = 0; i < n; i++) -> i=${i}`, 39, { phase: 'loop_bounds', i });
        let r = stones[i][0];
        let c = stones[i][1];
        maxRow = Math.max(maxRow, r);
        add("Update maxRow", `maxRow = Math.max(maxRow, stones[${i}][0]);\nEvaluating stone at row ${r}. Max row is now ${maxRow}.`, 40, { phase: 'upd_maxRow', i, maxRow, r });
        maxCol = Math.max(maxCol, c);
        add("Update maxCol", `maxCol = Math.max(maxCol, stones[${i}][1]);\nEvaluating stone at col ${c}. Max col is now ${maxCol}.`, 41, { phase: 'upd_maxCol', i, maxCol, c });
    }

    let dsuSize = maxRow + maxCol + 1;
    add("Create Disjoint Set", `DisjointSet ds = new DisjointSet(maxRow + maxCol + 1);\nAllocating DSU of size ${maxRow} + ${maxCol} + 1 = ${dsuSize}. This guarantees we have enough independent indices for both Rows and our Shifted Columns without overlap!`, 43, { phase: 'init_dsu_call', dsuSize });
    
    add("DSU Constructor", `public DisjointSet(int n)`, 5, { phase: 'init_dsu_cons' });
    
    // Expand arrays to fit DSU
    for(let i=0; i<=dsuSize; i++) {
        parent[i] = i;
        sizeArr[i] = 1;
    }
    // Summarize init
    add("DSU Initialized", `for (int i = 0; i <= n; i++) { ... }\nAllocated Nodes 0 to ${dsuSize}. Every node represents either a specific ROW or a specific COLUMN. Currently all isolated.`, 6, { phase: 'init_dsu_set' });

    add("Init HashMap", `HashMap<Integer, Integer> stoneNodes = new HashMap<>();\nCreating a map to keep track of which exact Rows and Columns actually contain stones (so we don't count empty dimensions at the end).`, 44, { phase: 'init_map' });

    for(let i = 0; i < n; i++) {
        add("Process Stones Loop", `for (int i = 0; i < n; i++) -> i=${i}\nProcessing Stone ${i} at [${stones[i][0]}, ${stones[i][1]}].`, 45, { phase: 'loop_stones', i });
        
        let nodeRow = stones[i][0];
        add("Get Row Node", `int nodeRow = stones[${i}][0];\nThe stone sits in Row ${nodeRow}. This directly translates to DSU Node ${nodeRow}.`, 46, { phase: 'get_row', i, nodeRow });

        let nodeCol = stones[i][1] + maxRow + 1;
        add("SHIFT COLUMN MATH", `int nodeCol = stones[${i}][1] + maxRow + 1;\n📝 THE STRATEGY: If the stone is at Column ${stones[i][1]}, we CANNOT use node index ${stones[i][1]} because it would collide with Row ${stones[i][1]}! We shift it safely into a new numerical space: Col ${stones[i][1]} + MaxRow ${maxRow} + 1 = Node ${nodeCol}!`, 47, { phase: 'get_col', i, nodeCol, rawCol: stones[i][1] });

        add("Union Row & Col", `ds.unionBySize(nodeRow, nodeCol);\nRECORDING: A stone mathematically acts as an EDGE bridging its Row to its Column! Unioning Node ${nodeRow} (Row) and Node ${nodeCol} (Col).`, 48, { phase: 'union_call', i, nodeRow, nodeCol });

        // Simulate DSU union
        add("Union Start", `public void unionBySize(int u, int v)`, 21, { phase: 'union_start', u: nodeRow, v: nodeCol });

        add("Find U Root", `int ulp_u = findUPar(u);`, 22, { phase: 'union_find', u: nodeRow, v: nodeCol });
        let ulp_u = simulateFind(nodeRow, `Union(${nodeRow},${nodeCol})`);

        add("Find V Root", `int ulp_v = findUPar(v);`, 23, { phase: 'union_find', u: nodeRow, v: nodeCol, ulp_u });
        let ulp_v = simulateFind(nodeCol, `Union(${nodeRow},${nodeCol})`);

        let isSame = ulp_u === ulp_v;
        add("Verify Disjoint in Union", `if (ulp_u == ulp_v) return;\nAre roots identical? Is ${ulp_u} == ${ulp_v}? ${isSame ? 'YES, already in the same component!' : 'NO, disjoint. Must merge.'}`, 24, { phase: 'union_verify', u: nodeRow, v: nodeCol, ulp_u, ulp_v, isSame });

        if (!isSame) {
            let sizeU = sizeArr[ulp_u];
            let sizeV = sizeArr[ulp_v];

            add("Evaluate Size Constraints", `if (size.get(ulp_u) < size.get(ulp_v))\nComparing component sizes to maintain flat tree: Is ${sizeU} < ${sizeV}?`, 25, { phase: 'union_compare', u: nodeRow, v: nodeCol, ulp_u, ulp_v, sizeU, sizeV });

            if (sizeU < sizeV) {
                parent[ulp_u] = ulp_v;
                add("Attach U under V", `parent.set(ulp_u, ulp_v);\nTree U is smaller. Attaching Root ${ulp_u} completely UNDER Root ${ulp_v}.`, 26, { phase: 'union_attach', u: nodeRow, v: nodeCol, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                sizeArr[ulp_v] += sizeArr[ulp_u];
                add("Update Size of V", `size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));\nTree V absorbs Tree U. New size of Root ${ulp_v} is ${sizeArr[ulp_v]}.`, 27, { phase: 'union_add_size', u: nodeRow, v: nodeCol, targetRoot: ulp_v, newSize: sizeArr[ulp_v] });
            } else {
                parent[ulp_v] = ulp_u;
                add("Attach V under U", `parent.set(ulp_v, ulp_u);\nTree V is smaller or equal. Attaching Root ${ulp_v} completely UNDER Root ${ulp_u}.`, 29, { phase: 'union_attach', u: nodeRow, v: nodeCol, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                sizeArr[ulp_u] += sizeArr[ulp_v];
                add("Update Size of U", `size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));\nTree U absorbs Tree V. New size of Root ${ulp_u} is ${sizeArr[ulp_u]}.`, 30, { phase: 'union_add_size', u: nodeRow, v: nodeCol, targetRoot: ulp_u, newSize: sizeArr[ulp_u] });
            }
        }

        mapStoneNodes[nodeRow] = 1;
        add("Map Row", `stoneNodes.put(nodeRow, 1);\nRECORDING: Marking that Row Node ${nodeRow} actively contains stones.`, 49, { phase: 'map_row', i, nodeRow });
        
        mapStoneNodes[nodeCol] = 1;
        add("Map Col", `stoneNodes.put(nodeCol, 1);\nRECORDING: Marking that Col Node ${nodeCol} actively contains stones.`, 50, { phase: 'map_col', i, nodeCol });
    }

    add("Init Counter", `int cnt = 0;\nPreparing to count the number of distinct connected components (island networks).`, 53, { phase: 'init_cnt' });

    add("Iterate HashMap", `for (Map.Entry<Integer, Integer> it : stoneNodes.entrySet())\nIterating through all valid Nodes (Rows and shifted Cols) that actually possessed stones.`, 54, { phase: 'loop_map' });

    for (const keyStr of Object.keys(mapStoneNodes)) {
        let node = parseInt(keyStr);
        add("Check Ultimate Root", `if (ds.findUPar(it.getKey()) == it.getKey())\nDoes Node ${node} equal its own Ultimate Parent? We need to find out!`, 55, { phase: 'check_cnt_call', node });
        
        let ulp = simulateFind(node, `Counting Component Root`);
        
        let isRoot = ulp === node;
        
        if(isRoot) {
            cnt++;
            add("Increment Components", `cnt++;\nYES! Node ${node} is a Master Root. We discovered a distinct connected network! Total components (cnt) = ${cnt}.`, 56, { phase: 'inc_cnt', node, cnt });
        } else {
            add("Skip Component", `// if condition false\nNO. Node ${node} is just a child in an existing network (Root is ${ulp}). Skipping.`, 55, { phase: 'skip_cnt', node, ulp, cnt });
        }
    }

    let finalAns = n - cnt;
    add("Return Formula", `return n - cnt;\nAlgorithm Concluded! We have ${n} total stones across ${cnt} interconnected networks. We can safely remove (Total - Components) = ${n} - ${cnt} = ${finalAns} stones!`, 59, { phase: 'done', isDone: true, isSuccess: true, finalAns });

    return steps;
  }, [baseN, baseStones]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-violet-900 border-violet-800` : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-violet-400`}>
                    <CheckCircle2 size={24}/> MAXIMUM STONES COMPUTED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. Total Stones ({st.n}) - Distinct Component Networks ({st.cnt}) gives us exactly {st.finalAns} stones we can sequentially remove!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('map') ? 'text-violet-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('calc') || String(st.phase || '').includes('get') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') || String(st.phase || '').includes('find') || String(st.phase || '').includes('inc_cnt') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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

  // Dynamic Layout for Grid & Matrix-to-Node Visuals
  // Use absolute maxes from baseStones so grid doesn't resize while simulating!
  const canvasMaxRow = Math.max(...baseStones.map(s => s[0]), 0);
  const canvasMaxCol = Math.max(...baseStones.map(s => s[1]), 0);

  const renderMainCanvas = () => {
      const cellSize = 60;
      const rows = canvasMaxRow + 1;
      const cols = canvasMaxCol + 1;
      
      // Calculate boundaries to center
      const gridW = cols * cellSize;
      const gridH = rows * cellSize;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Massive Final Answer Popup */}
              {st.isDone && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                      <div className="bg-violet-600/95 backdrop-blur border-4 border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 flex flex-col items-center gap-4 text-white transform -translate-y-10">
                          <Trophy size={64} className="text-amber-300 drop-shadow-md animate-bounce"/>
                          <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Max Stones Removed</span>
                          <div className="flex items-center gap-4 text-3xl font-bold font-mono opacity-80">
                              <span>Total ({st.n})</span>
                              <span>-</span>
                              <span>Roots ({st.cnt})</span>
                              <span>=</span>
                          </div>
                          <span className="text-8xl font-black drop-shadow-xl border-t-2 border-white/30 pt-4 mt-2">{st.finalAns}</span>
                      </div>
                  </div>
              )}

              {/* The Visual Grid / Node Plane */}
              <div style={{ width: gridW, height: gridH, marginTop: 40, marginLeft: 40 }} className="relative shrink-0 flex items-center justify-center border-l-4 border-t-4 border-slate-300 bg-slate-50 shadow-sm rounded-br-2xl">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                      {Array.from({length: rows * cols}).map((_, i) => (
                          <div key={`cell-bg-${i}`} className="border-r border-b border-slate-200/60 w-full h-full"></div>
                      ))}
                  </div>

                  {/* COLUMN ANCHORS (TOP) */}
                  <div className="absolute -top-[50px] left-0 right-0 h-[40px] flex pointer-events-none">
                      {Array.from({length: cols}).map((_, c) => {
                          let shiftedColNode = c + st.maxRow + 1;
                          let isActiveCol = st.phase?.includes('col') && st.nodeCol === shiftedColNode;
                          let isTargetCol = (st.phase?.includes('union') || st.phase?.includes('find')) && (st.v === shiftedColNode || st.findNode === shiftedColNode);

                          return (
                              <div key={`col-anchor-${c}`} className="flex-1 flex flex-col items-center justify-end pb-2 relative">
                                  <span className="text-[9px] font-bold text-slate-400 mb-1">Col {c}</span>
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black font-mono text-xs transition-all duration-300 z-30 ${isActiveCol ? 'bg-fuchsia-500 text-white border-fuchsia-600 scale-125 shadow-lg animate-pulse' : (isTargetCol ? 'bg-amber-400 text-white border-amber-500 scale-110 shadow-md' : 'bg-slate-200 text-slate-600 border-slate-300')}`}>
                                      {st.maxRow !== undefined ? shiftedColNode : '?'}
                                  </div>
                                  {/* Linker line down to grid */}
                                  <div className="absolute top-full w-px h-2 bg-slate-300"></div>
                              </div>
                          )
                      })}
                  </div>

                  {/* ROW ANCHORS (LEFT) */}
                  <div className="absolute -left-[50px] top-0 bottom-0 w-[40px] flex flex-col pointer-events-none">
                      {Array.from({length: rows}).map((_, r) => {
                          let isActiveRow = st.phase?.includes('row') && st.nodeRow === r;
                          let isTargetRow = (st.phase?.includes('union') || st.phase?.includes('find')) && (st.u === r || st.findNode === r);

                          return (
                              <div key={`row-anchor-${r}`} className="flex-1 flex flex-row items-center justify-end pr-2 relative">
                                  <span className="text-[9px] font-bold text-slate-400 mr-2" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>Row {r}</span>
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black font-mono text-xs transition-all duration-300 z-30 ${isActiveRow ? 'bg-sky-500 text-white border-sky-600 scale-125 shadow-lg animate-pulse' : (isTargetRow ? 'bg-amber-400 text-white border-amber-500 scale-110 shadow-md' : 'bg-slate-200 text-slate-600 border-slate-300')}`}>
                                      {r}
                                  </div>
                                  {/* Linker line right into grid */}
                                  <div className="absolute left-full h-px w-2 bg-slate-300"></div>
                              </div>
                          )
                      })}
                  </div>

                  {/* Visual Edges Layer linking Rows and Cols via Stones */}
                  <svg viewBox={`0 0 ${gridW} ${gridH}`} className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                      {baseStones && baseStones.map((stone: number[], i: number) => {
                          let isProcessed = st.i > i || st.isDone || (st.phase === 'loop_map' || st.phase === 'check_cnt_call' || st.phase === 'inc_cnt' || st.phase === 'skip_cnt');
                          let isUnioning = st.i === i && (st.phase?.includes('union') || st.phase?.includes('map_'));

                          if (!isProcessed && !isUnioning) return null; // Don't draw lines for future stones yet!
                          
                          let r = stone[0];
                          let c = stone[1];

                          // Start at Row Anchor
                          const x1 = -10; 
                          const y1 = r * cellSize + cellSize / 2;
                          // Go to Stone
                          const mx = c * cellSize + cellSize / 2;
                          const my = r * cellSize + cellSize / 2;
                          // End at Col Anchor
                          const x2 = c * cellSize + cellSize / 2;
                          const y2 = -10;

                          let isActive = isUnioning;

                          return (
                              <g key={`bridge-${i}`} className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                  {/* Path Row to Stone */}
                                  <line x1={x1} y1={y1} x2={mx} y2={my} stroke={isActive ? "#38bdf8" : "#94a3b8"} strokeWidth="3" strokeDasharray={isActive ? "" : "4 4"}/>
                                  {/* Path Stone to Col */}
                                  <line x1={mx} y1={my} x2={x2} y2={y2} stroke={isActive ? "#d946ef" : "#94a3b8"} strokeWidth="3" strokeDasharray={isActive ? "" : "4 4"}/>
                              </g>
                          )
                      })}
                  </svg>

                  {/* Interactive Stones Layer */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                      {baseStones && baseStones.map((stone: number[], i: number) => {
                          let r = stone[0];
                          let c = stone[1];
                          
                          let isProcessed = st.i > i || st.isDone || (st.phase === 'loop_map' || st.phase === 'check_cnt_call' || st.phase === 'inc_cnt' || st.phase === 'skip_cnt');
                          let isActiveStone = st.i === i && !isProcessed && st.phase !== 'loop_bounds' && st.phase !== 'upd_maxRow' && st.phase !== 'upd_maxCol' && st.phase !== 'init' && st.phase !== 'init_vars';

                          // Stone class handles dormant opacity vs active pop
                          let stoneClass = isProcessed 
                            ? 'scale-100 opacity-90' 
                            : (isActiveStone ? 'scale-125 drop-shadow-xl z-50' : 'scale-75 opacity-30');

                          return (
                              <div key={`stone-${i}`} className={`absolute flex items-center justify-center transition-all duration-500 z-40 ${stoneClass}`} style={{ 
                                  left: `${c * cellSize + cellSize/2}px`, 
                                  top: `${r * cellSize + cellSize/2}px`, 
                                  transform: 'translate(-50%, -50%)'
                              }}>
                                  <div className={`w-6 h-6 rounded bg-slate-800 border-2 border-slate-900 shadow-md transform rotate-45 flex items-center justify-center`}>
                                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                  </div>
                                  {isActiveStone && st.phase?.includes('union') && (
                                      <span className="absolute -top-6 text-[9px] bg-violet-600 text-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-widest whitespace-nowrap z-50 animate-bounce flex items-center gap-1">
                                          <Link size={10}/> Bridge
                                      </span>
                                  )}
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
    let dsuSize = st.maxRow + st.maxCol + 1;
    if (isNaN(dsuSize)) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] relative z-30 bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] shrink-0">
            <div className="flex flex-col items-center shrink-0 w-full mb-4">
                <div className="flex gap-4 items-center">
                    
                    <div className="flex flex-col gap-4 items-end justify-center pr-4">
                        <span className={`text-[12px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded border border-violet-200 h-12 flex items-center shadow-sm`}>DSU parent[]</span>
                        <span className="text-[12px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded border border-sky-200 h-12 flex items-center shadow-sm">DSU size[]</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* PARENT ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.parent.map((val: number, idx: number) => {
                                if (idx > dsuSize) return null; 
                                let isEval = st.phase?.includes('find_') && st.findNode === idx;
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-violet-500 text-white border-violet-600 scale-110 shadow-lg ring-2 ring-violet-300 animate-in zoom-in font-black z-20";
                                else if (isPathComp) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in font-black z-20";
                                else if (isEval) boxBg = "bg-amber-100 text-amber-700 border-amber-300 scale-105 ring-2 ring-amber-200 z-10 font-bold";

                                let isRowNode = idx <= st.maxRow;

                                return (
                                    <div key={`p-${idx}`} className="flex flex-col items-center relative group">
                                        <span className={`absolute bottom-full mb-3 text-[9px] font-mono font-black ${isEval || isPathComp ? 'text-amber-500' : 'text-slate-400'}`}>{idx}</span>
                                        <span className={`absolute bottom-full mb-0.5 text-[7px] font-bold uppercase tracking-widest ${isRowNode ? 'text-sky-500' : 'text-fuchsia-500'}`}>{isRowNode ? 'R' : 'C'}</span>
                                        <div className={`w-12 h-12 flex items-center justify-center font-mono text-lg rounded border-2 transition-all duration-300 ${boxBg}`}>
                                            {val}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* SIZE ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.sizeArr.map((val: number, idx: number) => {
                                if (idx > dsuSize) return null;
                                let isUpdated = st.phase?.includes('union_add_size') && (st.targetRoot === idx);
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-sky-500 text-white border-sky-600 scale-110 shadow-lg ring-2 ring-sky-300 animate-in zoom-in font-black z-20";

                                return (
                                    <div key={`s-${idx}`} className="flex flex-col items-center relative group">
                                        <div className={`w-12 h-12 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
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
      <div className="flex flex-col gap-4 w-full h-full pb-8">
          
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Stones Array Input</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[100px] max-h-[170px] overflow-y-auto scrollbar-thin">
                  {(baseStones || []).map((stone: number[], rowIdx: number) => {
                      let isProcessed = st.i > rowIdx || st.isDone || (st.phase === 'loop_map' || st.phase === 'check_cnt_call' || st.phase === 'inc_cnt' || st.phase === 'skip_cnt');
                      let isActiveRow = st.i === rowIdx && !isProcessed && st.phase !== 'loop_bounds' && st.phase !== 'upd_maxRow' && st.phase !== 'upd_maxCol' && st.phase !== 'init' && st.phase !== 'init_vars';

                      return (
                          <div key={`acc-${rowIdx}`} className={`flex items-center justify-between transition-all duration-300 ${isActiveRow ? 'bg-violet-50/70 p-2 -m-2 rounded-xl border border-violet-200 shadow-sm' : ''}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-violet-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                  {rowIdx}
                              </div>
                              <ArrowRight size={16} className={`shrink-0 mx-2 ${isActiveRow ? 'text-violet-500 animate-pulse' : 'text-slate-300'}`} />
                              <div className="flex flex-wrap gap-x-1 gap-y-2 items-center font-mono text-[11px] leading-tight flex-1">
                                  <span className={`relative transition-all ${isActiveRow ? 'text-violet-700 font-black scale-110 bg-violet-400/20 px-2 py-0.5 rounded shadow-sm z-10' : (isProcessed ? 'text-emerald-600 opacity-90 font-bold' : 'text-slate-500 font-bold')}`}>
                                      [ {stone[0]}, {stone[1]} ]
                                      {isProcessed && <Check size={14} className="absolute -top-3 -right-3 text-emerald-500 stroke-[4] drop-shadow-md z-20 animate-in zoom-in" />}
                                  </span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> HashMap (stoneNodes)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>KEY (NODE ID)</span>
                      <span>VAL (PRESENCE)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.mapStoneNodes === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : Object.entries(st.mapStoneNodes).map(([nodeId, val]: [string, any], i: number) => {
                          let isNewArrival = (st.phase === 'map_row' && String(st.nodeRow) === nodeId) || (st.phase === 'map_col' && String(st.nodeCol) === nodeId);
                          let isEvaluating = st.phase?.includes('cnt_call') && String(st.node) === nodeId;

                          let bgClass = 'bg-slate-50 border-slate-200 text-slate-600';
                          if (isNewArrival) bgClass = 'bg-emerald-500 border-emerald-600 text-white animate-in slide-in-from-right-8 z-10 scale-105 shadow-md';
                          else if (isEvaluating) bgClass = 'bg-amber-400 border-amber-500 text-white animate-pulse ring-4 ring-amber-200 scale-105 z-10 relative shadow-md font-black';

                          return (
                              <div key={`map-${i}-${nodeId}`} className={`px-3 py-2 flex items-center justify-between font-mono rounded-lg border shadow-sm transition-all duration-500 ${bgClass}`}>
                                  <span className={`text-xs ${isNewArrival || isEvaluating ? 'font-black' : ''}`}>Node {nodeId}</span>
                                  <span className="text-sm tracking-widest font-black bg-black/10 px-2 py-0.5 rounded shadow-inner">{val}</span>
                              </div>
                          )
                      })}
                      {st.mapStoneNodes !== undefined && Object.keys(st.mapStoneNodes).length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Map is empty</span>}
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1 col-span-2">
                          <span className="text-violet-500 font-bold">maxRow | maxCol:</span>
                          <span className="font-bold text-violet-700 text-sm">{st.maxRow !== undefined ? st.maxRow : '-'} | {st.maxCol !== undefined ? st.maxCol : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">nodeRow:</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.nodeRow !== undefined ? st.nodeRow : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">nodeCol:</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.nodeCol !== undefined ? st.nodeCol : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-emerald-500 font-bold">cnt (Roots):</span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest text-lg">{st.cnt !== undefined ? st.cnt : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">Find Target:</span>
                          <span className="font-bold text-amber-700 text-lg">{st.findNode !== undefined ? st.findNode : '-'}</span>
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
                  <span>Row/Col Bridging & DSU</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><GridIcon size={28}/> Most Stones Removed</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>To maximize stone removal, we must realize that stones in the same row or column form a connected component! If 5 stones are interconnected, we can sequentially remove 4 of them, leaving exactly 1 behind. Thus, for any component, removable stones = (Size - 1). For the entire grid, Total Removable = N (total stones) - cnt (number of isolated components). We use a brilliant DSU trick: we treat Rows and Columns as 'Nodes'. A stone simply acts as an EDGE bridging a Row Node to a Column Node! To prevent Row 2 and Column 2 from overlapping as 'Node 2', we mathematically shift all column indices by (maxRow + 1). Node mapping solved!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Connection</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 6<br/><strong>Stones:</strong> [0,0], [0,1], [1,0], [1,2], [2,1], [2,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">5</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Every single stone connects to at least one other stone via row or column. They all form 1 massive interconnected component. We can remove 6 - 1 = 5 stones!</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Isolated Islands</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 5<br/><strong>Stones:</strong> [0,0], [0,2], [1,1], [2,0], [2,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">3</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The stone at [1,1] shares no row or col with any other stone, forming its own isolated component. The other 4 form a square component. Total components = 2. Removable = 5 - 2 = 3.</span>
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
                        <button onClick={loadTestCase1} className={`px-4 py-2 bg-${themeColor}-50 text-${themeColor}-700 border border-${themeColor}-200 hover:bg-${themeColor}-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Default Test</button>
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                        <button onClick={loadTestCase3} className={`px-4 py-2 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 hover:bg-fuchsia-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 3</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Stones [row, col] (separated by |)</label>
                            <input type="text" value={stonesInput} onChange={(e) => setStonesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Treating Rows and Columns as DSU Nodes using Mathematical Index Shifting.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GridIcon size={24} className="text-violet-500"/> The Component Perspective</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If two stones share a row, they are connected. If they share a column, they are connected. This means stones act as <strong>edges</strong> bridging row elements and column elements! If we have a connected component of $K$ stones, we can systematically remove them one by one until only $1$ stone remains. Therefore, the total stones we can remove across the entire grid is simply <code>Total Stones (N) - Total Isolated Components</code>.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-fuchsia-500"/> Mathematical Index Shifting (Crucial)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We want to run a Disjoint Set where the nodes are the Rows and Columns. But if a stone is at <code>[2, 2]</code>, how does the DSU know if Node '2' means Row 2 or Column 2? They would mathematically collide!</p>
                        <p className="mb-4 text-slate-600 leading-relaxed bg-fuchsia-50 p-4 rounded-xl border border-fuchsia-200 font-mono text-sm shadow-inner">
                            <strong>The Solution:</strong><br/>
                            1. Find the maximum row index in the grid (`maxRow`).<br/>
                            2. Let Rows occupy DSU indices `0` to `maxRow`.<br/>
                            3. Shift ALL column indices strictly past the rows: <br/>
                            &nbsp;&nbsp;&nbsp;<code>nodeCol = col + maxRow + 1</code>
                        </p>
                        <p className="mb-4 text-slate-600 leading-relaxed">Now, if maxRow is 5, Column 0 becomes Node 6! Column 2 becomes Node 8! Total separation guaranteed.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N)</strong><br/>Finding max rows/cols takes $O(N)$. Traversing the $N$ stones and performing DSU <code>unionBySize</code> operations takes near constant time $O(\alpha(V))$ per stone. The final loop through the HashMap takes at most $O(2N)$. Overall Time Complexity bounds tightly to $O(N)$!</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N)</strong><br/>The DSU `parent[]` and `size[]` arrays take space proportional to `maxRow + maxCol + 1`, which in the worst sparse case is roughly bounded by $2N$. The HashMap stores at most $2N$ entries. Overall Space Complexity is highly optimal at $O(N)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem separates candidates who try to traverse grids with DFS vs those who recognize mathematical equivalence classes using DSU."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we just run a DFS to find connected stones?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but building the adjacency list for DFS is significantly harder and slower."</p>
                            <p>To use DFS, we would have to loop over all $N$ stones, and for each stone, loop over all other stones to check if they share a row or column to build edges. That takes $O(N^2)$ time just to build the graph! With DSU, we treat the abstract Rows and Columns as nodes themselves, allowing us to connect them in a single $O(N)$ pass!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we iterate over the HashMap at the end instead of the DSU parent array to count roots?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To avoid counting empty rows or columns as components!"</p>
                            <p>We initialized the DSU to size `maxRow + maxCol + 1`. This means we have parent nodes ready for every possible row/col index. But what if Row 1 has absolutely no stones in it? It would still exist in the DSU with `parent[1] == 1`, incorrectly inflating our root count! The HashMap `stoneNodes` strictly tracks only the rows and columns that ACTUALLY contained stones, ensuring our math is flawless."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1 shrink-0`}>N:</label>
                          <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-3`}>Stones [row, col] (separated by |):</label>
                          <input type="text" value={stonesInput} onChange={(e) => setStonesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid as GridIcon, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox,
  Grid
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  makeLargeIsland: {
    id: 'makeLargeIsland',
    title: 'Making a Large Island (DSU)',
    icon: <MapIcon size={16} />,
    complexity: 'Time: O(N²) | Space: O(N²)',
    theme: 'emerald',
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
    private boolean isValid(int newr, int newc, int n) {
        return newr >= 0 && newr < n && newc >= 0 && newc < n;
    }
    public int MaxConnection(int grid[][]) {
        int n = grid.length;
        DisjointSet ds = new DisjointSet(n * n);
        // step - 1
        for(int row = 0; row < n ; row++) {
            for(int col = 0; col < n; col++) {
                if(grid[row][col] == 0) continue;
                int dr[] = {-1, 0, 1, 0};
                int dc[] = {0, -1, 0, 1};
                for(int ind = 0; ind <4; ind++) {
                    int newr = row + dr[ind];
                    int newc = col + dc[ind];
                    if(isValid(newr, newc, n) && grid[newr][newc] == 1) {
                        int nodeNo = row * n + col;
                        int adjNodeNo = newr * n + newc;
                        ds.unionBySize(nodeNo, adjNodeNo);
                    }
                }
            }
        }
        // step 2
        int mx = 0;
        for(int row = 0; row < n; row++) {
            for(int col = 0; col < n; col++) {
                if(grid[row][col] == 1) continue;
                int dr[] = {-1, 0, 1, 0};
                int dc[] = {0, -1, 0, 1};
                HashSet<Integer> components = new HashSet<>();
                for(int ind = 0; ind <4; ind++) {
                    int newr = row + dr[ind];
                    int newc = col + dc[ind];
                    if(isValid(newr, newc, n)) {
                        if(grid[newr][newc] == 1) {
                            components.add(ds.findUPar(newr * n + newc));
                        }
                    }
                }
                int sizeTotal = 0;
                for(Integer parents: components) {
                    sizeTotal += ds.size.get(parents);
                }
                mx = Math.max(mx, sizeTotal + 1);
            }
        }
        for(int cellNo = 0; cellNo < n * n; cellNo++) {
            mx = Math.max(mx, ds.size.get(ds.findUPar(cellNo)));
        }
        return mx;
    }
}`,
    desc: "Given an N×N grid of 0s (water) and 1s (land), we are allowed to flip AT MOST ONE 0 to 1. What is the size of the largest island we can create? Step 1: Use a Disjoint Set to connect all existing 1s into distinct island components, tracking their sizes. Step 2: Iterate through every 0. Pretend to flip it. Check its 4 neighbors. Use a HashSet to collect the UNIQUE ultimate roots of adjacent islands (to avoid double counting the same island wrapping around). Sum their sizes, add 1 (for the flipped 0), and update our Maximum Connection variable! Finally, handle the edge case where the grid was already completely filled with 1s."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args|MaxConnection|isValid|grid|cnt|ans|len|row|col|dr|dc|ind|newr|newc|nodeNo|adjNodeNo|length|continue|HashSet|components|sizeTotal|parents|mx|cellNo|Math|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Solution', 'HashSet'].includes(part);
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'i', 'j', 'grid', 'row', 'col', 'dr', 'dc', 'ind', 'newr', 'newc', 'nodeNo', 'adjNodeNo', 'length', 'components', 'sizeTotal', 'parents', 'mx', 'cellNo'].includes(part);
            const isMapCall = ['MaxConnection', 'isValid', 'findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get', 'max'].includes(part);
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

export default function MakeLargeIslandVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'makeLargeIsland';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [nInput, setNInput] = useState('3');
  const [gridInput, setGridInput] = useState('1, 0, 1 | 0, 0, 0 | 1, 1, 1');

  const [baseN, setBaseN] = useState(3);
  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [1, 0, 1],
      [0, 0, 0],
      [1, 1, 1]
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1.1);
  const [pan, setPan] = useState({ x: 0, y: -40 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);

  const loadTestCase1 = () => {
      setNInput('3');
      setGridInput('1, 0, 1 | 0, 0, 0 | 1, 1, 1');
  };

  const loadTestCase2 = () => {
      setNInput('4');
      setGridInput('1, 1, 0, 1 | 1, 0, 0, 1 | 0, 0, 1, 0 | 1, 1, 0, 0');
  };

  const loadTestCase3 = () => {
      setNInput('2');
      setGridInput('1, 1 | 1, 1');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0 || n > 10) n = 3;
        
        let rows = gridInput.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsed: number[][] = Array.from({length: n}, () => Array(n).fill(0));
        
        for (let i = 0; i < Math.min(n, rows.length); i++) {
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            for(let j=0; j < Math.min(n, cells.length); j++) {
                if(cells[j] === 1) parsed[i][j] = 1;
            }
        }
        
        setBaseN(n);
        setBaseGrid(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: -40 });
        setZoom(1.1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, gridInput]);

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
  const clone2D = (arr: number[][]) => arr.map(row => [...row]);

  // --- EXACT LINE-BY-LINE TRACE GENERATION (MAKING A LARGE ISLAND) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const grid = baseGrid;
    
    if (n === 0) return steps;

    let parent = Array(n * n).fill(0); 
    let sizeArr = Array(n * n).fill(1);
    let unionedEdges: {u: number, v: number}[] = [];
    let componentsSet: Set<number> = new Set();
    let mx = 0;
    let sizeTotal = 0;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), sizeArr: clone1D(sizeArr), n, grid: clone2D(grid), unionedEdges: [...unionedEdges], componentsArray: Array.from(componentsSet), mx, sizeTotal, ...stateObj } 
    });

    const simulateFind = (node: number, originalCall: string): number => {
        add("Find Ultimate Parent", `public int findUPar(int node = ${node})\nExecuting DSU Find for node ${node}. Traversing upwards to find its ultimate root.`, 10, { phase: 'find_start', findNode: node, originalCall });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node)) return node;\nIs node ${node} its own parent? ${isRoot ? 'YES, returning it directly.' : 'NO, keep climbing.'}`, 11, { phase: 'find_check', findNode: node, isRoot, originalCall });
        
        if (isRoot) return node;

        add("Recursive Call", `int ulp = findUPar(parent.get(node));\nRecursively calling findUPar() on its immediate parent: ${parent[node]}.`, 12, { phase: 'find_recurse', findNode: node, originalCall });
        let ulp = simulateFind(parent[node], originalCall);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL OPTIMIZATION: Overwriting node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}. This flattens the tree!`, 13, { phase: 'path_compression', findNode: node, ulp, originalCall });

        add("Return Root", `return parent.get(node);\nReturning the compressed ultimate root (${ulp}) down the call stack.`, 14, { phase: 'find_ret_comp', findNode: node, ulp, originalCall });
        return ulp;
    };

    add("Init Function", `public int MaxConnection(int grid[][])\nStarting Phase 1: Identifying and connecting all pre-existing adjacent islands.`, 34, { phase: 'init' });
    
    add("Init N", `int n = grid.length;\nThe grid is strictly a square of size ${n}x${n}.`, 35, { phase: 'init_n' });

    add("Create Disjoint Set", `DisjointSet ds = new DisjointSet(n * n);\nAllocating 1D DSU structure of size ${n * n} to mathematically handle the 2D grid.`, 36, { phase: 'init_dsu_call' });
    add("DSU Constructor", `public DisjointSet(int n)`, 4, { phase: 'init_dsu_cons' });
    
    for(let i=0; i < n*n; i++) { // We loop up to n*n logically
        if(i===0) add("DSU Init Loop", `for (int i = 0; i <= n; i++) -> i=${i}`, 5, { phase: 'init_dsu_loop', i });
        parent[i] = i;
        if(i===0) add("Init Parent", `parent.add(${i});\nSetting parent of node ${i} to itself.`, 6, { phase: 'init_dsu_parent', i, parent: clone1D(parent) });
        sizeArr[i] = 1;
        if(i===0) add("Init Size", `size.add(1);\nSetting size of component ${i} to 1.`, 7, { phase: 'init_dsu_size', i, sizeArr: clone1D(sizeArr) });
    }

    add("Start Step 1", `for(int row = 0; row < n ; row++)\nPhase 1 initiates: Traversing all cells to physically connect adjacent 1s.`, 38, { phase: 'step1' });

    for(let row = 0; row < n; row++) {
        for(let col = 0; col < n; col++) {
            add("Inner Loop C", `for(int col = 0; col < n; col++) -> col=${col}`, 39, { phase: 'loop_c1', row, col });
            
            let isZero = grid[row][col] === 0;
            add("Check Grid 0", `if(grid[row][col] == 0) continue;\nIs cell (${row}, ${col}) water? ${isZero ? 'YES, skipping.' : 'NO, processing land.'}`, 40, { phase: 'check_zero1', row, col, isZero });

            if (isZero) continue;

            add("Init dr", `int dr[] = {-1, 0, 1, 0};`, 41, { phase: 'init_dr', row, col });
            add("Init dc", `int dc[] = {0, -1, 0, 1};\nSetting up Deltas to safely scan North, West, South, and East.`, 42, { phase: 'init_dc', row, col });

            let dr = [-1, 0, 1, 0];
            let dc = [0, -1, 0, 1];

            for(let ind = 0; ind < 4; ind++) {
                add("Neighbor Scan Loop", `for(int ind = 0; ind <4; ind++) -> ind=${ind}\nScanning direction ${ind} around land (${row}, ${col}).`, 43, { phase: 'loop_dir1', row, col, ind });

                let newr = row + dr[ind];
                add("Calc newr", `int newr = row + dr[${ind}]; // ${newr}`, 44, { phase: 'calc_newr1', row, col, ind, newr });
                
                let newc = col + dc[ind];
                add("Calc newc", `int newc = col + dc[${ind}]; // ${newc}`, 45, { phase: 'calc_newc1', row, col, ind, newr, newc });

                let valid = newr >= 0 && newr < n && newc >= 0 && newc < n;
                let isAdjLand = valid && grid[newr][newc] === 1;

                add("Evaluate Validity & Land", `if(isValid(newr, newc, n) && grid[newr][newc] == 1)\nIs neighbor (${newr}, ${newc}) valid AND land? ${isAdjLand ? 'YES!' : 'NO.'}`, 46, { phase: 'eval_valid1', row, col, ind, newr, newc, valid, isAdjLand });

                if (isAdjLand) {
                    let nodeNo = row * n + col;
                    add("Map nodeNo", `int nodeNo = row * n + col;\nConverted 2D coords (${row},${col}) to 1D index: ${nodeNo}.`, 47, { phase: 'calc_nodeNo1', row, col, ind, newr, newc, nodeNo });
                    
                    let adjNodeNo = newr * n + newc;
                    add("Map adjNodeNo", `int adjNodeNo = newr * n + newc;\nConverted 2D coords (${newr},${newc}) to 1D index: ${adjNodeNo}.`, 48, { phase: 'calc_adjNodeNo1', row, col, ind, newr, newc, nodeNo, adjNodeNo });

                    add("Call Union", `ds.unionBySize(nodeNo, adjNodeNo);\nRECORDING: Found adjacent land! Executing Union-Find to merge component ${nodeNo} with ${adjNodeNo}.`, 49, { phase: 'union_call', row, col, ind, newr, newc, nodeNo, adjNodeNo });

                    // Simulate Union
                    add("Union Start", `public void unionBySize(int u, int v)`, 16, { phase: 'union_start', u: nodeNo, v: adjNodeNo });
            
                    add("Find U Root", `int ulp_u = findUPar(u);`, 17, { phase: 'union_find', u: nodeNo, v: adjNodeNo });
                    let ulp_u = simulateFind(nodeNo, `Union(${nodeNo},${adjNodeNo})`);

                    add("Find V Root", `int ulp_v = findUPar(v);`, 18, { phase: 'union_find', u: nodeNo, v: adjNodeNo, ulp_u });
                    let ulp_v = simulateFind(adjNodeNo, `Union(${nodeNo},${adjNodeNo})`);

                    let isSame = ulp_u === ulp_v;
                    add("Verify Disjoint in Union", `if (ulp_u == ulp_v) return;\nAre roots identical? ${isSame ? 'YES, already merged! Returning early.' : 'NO, disjoint. Must merge.'}`, 19, { phase: 'union_verify', u: nodeNo, v: adjNodeNo, ulp_u, ulp_v, isSame });

                    if (!isSame) {
                        let sizeU = sizeArr[ulp_u];
                        let sizeV = sizeArr[ulp_v];

                        add("Evaluate Size Constraints", `if (size.get(ulp_u) < size.get(ulp_v))\nComparing component sizes to maintain flat tree: Is ${sizeU} < ${sizeV}?`, 20, { phase: 'union_compare', u: nodeNo, v: adjNodeNo, ulp_u, ulp_v, sizeU, sizeV });

                        if (sizeU < sizeV) {
                            parent[ulp_u] = ulp_v;
                            add("Attach U under V", `parent.set(ulp_u, ulp_v);\nTree U is smaller. Attaching Root ${ulp_u} completely UNDER Root ${ulp_v}.`, 21, { phase: 'union_attach', u: nodeNo, v: adjNodeNo, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                            sizeArr[ulp_v] += sizeArr[ulp_u];
                            add("Update Size of V", `size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));\nTree V absorbs Tree U. New size of Root ${ulp_v} is ${sizeArr[ulp_v]}.`, 22, { phase: 'union_add_size', u: nodeNo, v: adjNodeNo, targetRoot: ulp_v, newSize: sizeArr[ulp_v] });
                        } else {
                            parent[ulp_v] = ulp_u;
                            add("Attach V under U", `parent.set(ulp_v, ulp_u);\nTree V is smaller or equal. Attaching Root ${ulp_v} completely UNDER Root ${ulp_u}.`, 24, { phase: 'union_attach', u: nodeNo, v: adjNodeNo, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                            sizeArr[ulp_u] += sizeArr[ulp_v];
                            add("Update Size of U", `size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));\nTree U absorbs Tree V. New size of Root ${ulp_u} is ${sizeArr[ulp_u]}.`, 25, { phase: 'union_add_size', u: nodeNo, v: adjNodeNo, targetRoot: ulp_u, newSize: sizeArr[ulp_u] });
                        }

                        // Register visual edge
                        unionedEdges.push({u: nodeNo, v: adjNodeNo});
                    }
                }
            }
        }
    }

    add("Init Max", `int mx = 0;\nSetting maximum connection tracker to 0.`, 55, { phase: 'init_mx' });

    for(let row = 0; row < n; row++) {
        add("Outer Loop R (Step 2)", `for(int row = 0; row < n; row++) -> row=${row}\nPhase 2: Pretending to flip every water cell (0) to land (1)!`, 56, { phase: 'loop_r2', row });
        for(let col = 0; col < n; col++) {
            add("Inner Loop C (Step 2)", `for(int col = 0; col < n; col++) -> col=${col}`, 57, { phase: 'loop_c2', row, col });
            
            let isOne = grid[row][col] === 1;
            add("Check Grid 1", `if(grid[row][col] == 1) continue;\nIs cell (${row}, ${col}) already land? ${isOne ? 'YES, skip it. We only flip 0s.' : 'NO, it is water. We will simulate flipping it!'}`, 58, { phase: 'check_one2', row, col, isOne });

            if (isOne) continue;

            add("Init dr (Step 2)", `int dr[] = {-1, 0, 1, 0};`, 59, { phase: 'init_dr2', row, col });
            add("Init dc (Step 2)", `int dc[] = {0, -1, 0, 1};\nSetting up Deltas to safely scan North, West, South, and East around the flipped 0.`, 60, { phase: 'init_dc2', row, col });

            componentsSet.clear();
            add("Init HashSet", `HashSet<Integer> components = new HashSet<>();\nRECORDING: Crucial step! Created a HashSet to specifically store the UNIQUE roots of adjacent islands. This strictly prevents double-counting the same wrapping island!`, 61, { phase: 'init_hash', row, col });

            let dr = [-1, 0, 1, 0];
            let dc = [0, -1, 0, 1];

            for(let ind = 0; ind < 4; ind++) {
                add("Neighbor Scan Loop (Step 2)", `for(int ind = 0; ind <4; ind++) -> ind=${ind}\nScanning direction ${ind} around flipped water (${row}, ${col}).`, 62, { phase: 'loop_dir2', row, col, ind });

                let newr = row + dr[ind];
                add("Calc newr (Step 2)", `int newr = row + dr[${ind}]; // ${newr}`, 63, { phase: 'calc_newr2', row, col, ind, newr });
                
                let newc = col + dc[ind];
                add("Calc newc (Step 2)", `int newc = col + dc[${ind}]; // ${newc}`, 64, { phase: 'calc_newc2', row, col, ind, newr, newc });

                let valid = newr >= 0 && newr < n && newc >= 0 && newc < n;
                add("Evaluate Validity", `if(isValid(newr, newc, n))\nIs neighbor (${newr}, ${newc}) strictly within bounds? ${valid ? 'YES.' : 'NO.'}`, 65, { phase: 'eval_valid2', row, col, ind, newr, newc, valid });

                if (valid) {
                    let isAdjLand = grid[newr][newc] === 1;
                    add("Check Neighbor Land (Step 2)", `if(grid[newr][newc] == 1)\nIs the valid neighbor (${newr}, ${newc}) currently land? ${isAdjLand ? 'YES!' : 'NO.'}`, 66, { phase: 'check_adj_vis2', row, col, ind, newr, newc, isAdjLand });

                    if (isAdjLand) {
                        add("Add to HashSet", `components.add(ds.findUPar(newr * n + newc));\nRECORDING: Found adjacent land at coords (${newr}, ${newc}). Finding its ULTIMATE ROOT and adding it directly to the HashSet!`, 67, { phase: 'hash_add_call', row, col, ind, newr, newc });

                        let ulp_adj = simulateFind(newr * n + newc, `HashSet Mapping`);
                        componentsSet.add(ulp_adj);

                        add("HashSet Add Complete", `// HashSet internal state updated\nThe HashSet safely prevents duplicates. It now contains root ${ulp_adj}.`, 67, { phase: 'hash_add_done', row, col, ind, newr, newc, rootAdded: ulp_adj });
                    }
                }
            }

            sizeTotal = 0;
            add("Init Size Total", `int sizeTotal = 0;\nPreparing to sum the sizes of all the unique surrounding islands we collected in the Set.`, 71, { phase: 'init_sizeTotal', row, col });

            add("Iterate HashSet", `for(Integer parents: components)\nLooping through our uniquely collected island roots.`, 72, { phase: 'loop_hash', row, col });

            for(let root of Array.from(componentsSet)) {
                let compSize = sizeArr[root];
                sizeTotal += compSize;
                add("Sum Component Size", `sizeTotal += ds.size.get(parents);\nRECORDING: Extracting size of Island Root ${root} (Size: ${compSize}). Total sum is now ${sizeTotal}.`, 73, { phase: 'sum_size', row, col, root, compSize, sizeTotal });
            }

            let candidateMax = sizeTotal + 1;
            let oldMx = mx;
            mx = Math.max(mx, candidateMax);
            add("Update Max", `mx = Math.max(mx, sizeTotal + 1);\nRECORDING: Our surrounding islands size is ${sizeTotal}. Plus 1 for the 0 we flipped = ${candidateMax}! Comparing with current max (${oldMx}). New mx is ${mx}!`, 75, { phase: 'update_mx', row, col, sizeTotal, candidateMax, mx });
        }
    }

    // Step 3 Optimization - No useless clicking
    add("Edge Case Sweep", `for(int cellNo = 0; cellNo < n * n; cellNo++)\nPhase 3 initiates: The Edge Case Sweep! What if the grid was ALREADY full of 1s and we never flipped a 0? We scan all components simultaneously to check if any existing island is larger than ${mx}.`, 78, { phase: 'step3_start' });

    let maxExisting = 0;
    for(let cellNo = 0; cellNo < n * n; cellNo++) {
        let ulp = parent[cellNo]; 
        while(ulp !== parent[ulp]) ulp = parent[ulp];
        maxExisting = Math.max(maxExisting, sizeArr[ulp]);
    }
    
    if (maxExisting > mx) {
        mx = maxExisting;
        add("Update Max (Edge Case)", `mx = Math.max(mx, ds.size.get(ds.findUPar(cellNo)));\nWe found a larger existing island of size ${mx}! Our max variable is updated.`, 79, { phase: 'check_cell_mx', mx: mx });
    }

    add("Return Final Max", `return mx;\nAlgorithm successfully concluded. The absolute largest possible island we can make is size ${mx}!`, 81, { phase: 'done', isDone: true, isSuccess: true, finalAns: mx });

    return steps;
  }, [baseN, baseGrid]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x: 0, y: -40}); 
    setZoom(1.1); 
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
  const resetPanZoom = () => { setPan({x:0, y: -40}); setZoom(1.1); };
  
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
                    <CheckCircle2 size={24}/> MAXIMUM ISLAND CALCULATED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. By strategically flipping one water cell, we successfully achieved a max island size of {st.mx}!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('push') || String(st.phase || '').includes('hash_add') ? 'text-emerald-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('calc') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') || String(st.phase || '').includes('find') || String(st.phase || '').includes('update_mx') || String(st.phase || '').includes('sum_size') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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

  // Dynamic Layout for Grid
  const renderMainCanvas = () => {
      if (st.grid === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const cellSize = 60;
      const gridW = st.n * cellSize;
      const gridH = st.n * cellSize;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Massive Final Answer Popup */}
              {st.isDone && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                      <div className="bg-emerald-600/90 backdrop-blur border-4 border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 flex flex-col items-center gap-4 text-white transform -translate-y-10">
                          <Trophy size={64} className="text-amber-300 drop-shadow-md animate-bounce"/>
                          <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Largest Island Size</span>
                          <span className="text-8xl font-black drop-shadow-xl">{st.finalAns}</span>
                      </div>
                  </div>
              )}

              <div style={{ width: gridW, height: gridH }} className="relative shrink-0 flex items-center justify-center shadow-2xl rounded-xl border-4 border-slate-300 bg-blue-100 overflow-hidden">
                  
                  {/* Grid Background Lines for Water */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none grid" style={{ gridTemplateColumns: `repeat(${st.n}, 1fr)`, gridTemplateRows: `repeat(${st.n}, 1fr)` }}>
                      {Array.from({length: st.n * st.n}).map((_, i) => (
                          <div key={`water-${i}`} className="border-r border-b border-blue-200/50 w-full h-full"></div>
                      ))}
                  </div>

                  {/* Visual Edges Layer for Unioned Components */}
                  <svg viewBox={`0 0 ${gridW} ${gridH}`} className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                      {st.unionedEdges && st.unionedEdges.map((edge: {u: number, v: number}, idx: number) => {
                          const r1 = Math.floor(edge.u / st.n);
                          const c1 = edge.u % st.n;
                          const r2 = Math.floor(edge.v / st.n);
                          const c2 = edge.v % st.n;

                          const x1 = c1 * cellSize + cellSize / 2;
                          const y1 = r1 * cellSize + cellSize / 2;
                          const x2 = c2 * cellSize + cellSize / 2;
                          const y2 = r2 * cellSize + cellSize / 2;

                          return (
                              <line 
                                  key={`uedge-${idx}`}
                                  x1={x1} y1={y1} x2={x2} y2={y2}
                                  stroke="#0f766e" // Deep teal for connection
                                  strokeWidth="6"
                                  className="opacity-70 animate-in zoom-in duration-500"
                              />
                          )
                      })}
                  </svg>

                  {/* Interactive Nodes Layer */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {st.grid.map((rowArr: number[], r: number) => {
                        return rowArr.map((val: number, c: number) => {
                            let node1D = r * st.n + c;
                            
                            let isLand = val === 1;
                            let isRoot = isLand && st.parent && st.parent[node1D] === node1D && st.phase !== 'init';
                            
                            let isActiveWater = st.phase?.includes('2') && st.row === r && st.col === c && val === 0;
                            let isScanningAdj = st.phase?.includes('calc_new') || st.phase?.includes('eval_valid') || st.phase?.includes('check_adj') || st.phase?.includes('hash_add') || st.phase?.includes('union_call') || st.phase?.includes('calc_node');
                            let isTargetAdj = isScanningAdj && st.newr === r && st.newc === c;
                            let isTargetAdj1 = isScanningAdj && st.adjr === r && st.adjc === c; // For any older references
                            
                            let isCheckingUnion = st.phase?.includes('check_dsu') || st.phase?.includes('union');
                            let isUnionSource = isCheckingUnion && st.nodeNo === node1D;
                            let isUnionTarget = isCheckingUnion && (st.adjNodeNo === node1D || st.newr * st.n + st.newc === node1D);

                            // Default water state
                            let bgClass = '';
                            let borderClass = 'border-transparent';
                            let textClass = 'text-blue-300';
                            let zIndex = 'z-0';

                            if (isLand) {
                                bgClass = 'bg-emerald-500 shadow-md';
                                borderClass = 'border-emerald-600 border-b-4 border-r-4'; // 3D land effect
                                textClass = 'text-white';
                                zIndex = 'z-20';
                            }

                            // Highlights overrule base states
                            let ringClass = '';
                            if (isActiveWater) {
                                bgClass = 'bg-fuchsia-500 shadow-xl scale-110';
                                borderClass = 'border-fuchsia-600 border-b-4';
                                textClass = 'text-white';
                                zIndex = 'z-40';
                                ringClass = 'ring-4 ring-fuchsia-300 ring-offset-2 border-transparent animate-pulse';
                            } else if (isUnionSource || (isScanningAdj && st.row === r && st.col === c && st.phase?.includes('1'))) {
                                bgClass = 'bg-sky-500 shadow-xl scale-110';
                                borderClass = 'border-sky-600 border-b-4';
                                textClass = 'text-white';
                                zIndex = 'z-40';
                                ringClass = 'ring-4 ring-sky-300 ring-offset-2 border-transparent animate-pulse';
                            } else if (isTargetAdj || isTargetAdj1 || isUnionTarget) {
                                bgClass = 'bg-amber-400 shadow-xl scale-110';
                                borderClass = 'border-amber-500 border-b-4';
                                textClass = 'text-amber-900';
                                zIndex = 'z-40';
                                ringClass = 'ring-4 ring-amber-200 ring-offset-2 border-transparent';
                            }

                            return (
                                <div key={`cell-${r}-${c}`} className={`absolute flex items-center justify-center font-mono font-black rounded-lg transition-all duration-300 pointer-events-auto ${bgClass} ${borderClass} ${ringClass} ${textClass} ${zIndex}`} style={{ 
                                    left: `${c * cellSize + 4}px`, 
                                    top: `${r * cellSize + 4}px`, 
                                    width: `${cellSize - 8}px`,
                                    height: `${cellSize - 8}px`
                                }}>
                                    {node1D}
                                    
                                    {/* Component Root Tag */}
                                    {isRoot && !isActiveWater && !isTargetAdj && !isUnionSource && !isUnionTarget && !st.isDone && (
                                        <span className="absolute -top-3 -right-3 text-[8px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded shadow-sm border border-emerald-900 z-50">Root</span>
                                    )}

                                    {/* Water waves for empty */}
                                    {!isLand && !isTargetAdj && !isActiveWater && (
                                        <Waves size={16} className="opacity-20 absolute" />
                                    )}

                                    {isActiveWater && <span className="absolute -bottom-5 text-[9px] bg-fuchsia-600 text-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-widest whitespace-nowrap z-50">Flipping 0</span>}
                                </div>
                            );
                        });
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
                                if (idx >= st.n * st.n) return null;
                                let isEval = st.phase?.includes('find_') && st.findNode === idx;
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                                else if (isPathComp) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in font-black z-20";
                                else if (isEval) boxBg = "bg-amber-100 text-amber-700 border-amber-300 scale-105 ring-2 ring-amber-200 z-10 font-bold";

                                return (
                                    <div key={`p-${idx}`} className="flex flex-col items-center relative group">
                                        <span className={`absolute bottom-full mb-2 text-[9px] font-mono font-black ${isEval || isPathComp ? 'text-amber-500' : 'text-slate-400'}`}>{idx}</span>
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
                                if (idx >= st.n * st.n) return null;
                                let isUpdated = st.phase?.includes('union_add_size') && (st.targetRoot === idx);
                                let isExtracted = st.phase === 'sum_size' && st.root === idx;

                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-sky-500 text-white border-sky-600 scale-110 shadow-lg ring-2 ring-sky-300 animate-in zoom-in font-black z-20";
                                else if (isExtracted) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in font-black z-20 animate-pulse";

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

          {/* VISUAL MINI-GRID FOR INPUT DISPLAY */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><GridIcon size={12}/> Input Grid (grid[][])</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-1 relative min-h-[100px] overflow-x-auto scrollbar-thin">
                  {st.grid === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (
                      <>
                          {st.grid.map((rowArr: number[], r: number) => (
                              <div key={`input-row-${r}`} className="flex gap-1 justify-center">
                                  {rowArr.map((val: number, c: number) => {
                                      let isActive = (st.row === r && st.col === c);
                                      let boxBg = val === 1 ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-bold" : "bg-blue-50 text-blue-400 border border-blue-100";
                                      if (isActive) boxBg = "bg-amber-400 text-white border border-amber-500 scale-110 shadow-lg z-10 font-black ring-2 ring-amber-200";

                                      return (
                                          <div key={`input-cell-${r}-${c}`} className={`w-8 h-8 flex items-center justify-center font-mono text-sm rounded transition-all duration-300 select-none ${boxBg}`}>
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
          
          <div className="flex flex-col w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Max Connection (mx)
                          {st.phase === 'update_mx' && <span className="text-emerald-500 text-[10px]">Updated!</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'update_mx' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>{st.mx !== undefined ? st.mx : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1.5 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> HashSet (components)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[100px] max-h-[180px] overflow-y-auto scrollbar-thin">
                  {st.componentsArray === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (
                      <div className="flex flex-wrap gap-2">
                          {st.componentsArray.length === 0 && <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Set is empty</span>}
                          {st.componentsArray.map((root: number, i: number) => {
                              let isNewArrival = st.phase === 'hash_add_done' && root === st.rootAdded;
                              let isEvaluating = st.phase === 'sum_size' && root === st.root;

                              let bgClass = 'bg-slate-100 text-slate-600 border-slate-200 shadow-sm';
                              if (isNewArrival) bgClass = 'bg-emerald-500 text-white border-emerald-600 animate-in zoom-in font-black shadow-md';
                              else if (isEvaluating) bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 animate-pulse font-black shadow-lg scale-110';

                              return (
                                  <div key={`hash-${i}`} className={`px-3 py-2 flex items-center justify-center font-mono rounded-xl border transition-all duration-300 ${bgClass}`}>
                                      {root}
                                  </div>
                              )
                          })}
                      </div>
                  )}
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">row (Active):</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.row !== undefined ? st.row : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-sky-500 font-bold">col (Active):</span>
                          <span className="font-bold text-sky-700 text-lg">{st.col !== undefined ? st.col : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">newr (Target):</span>
                          <span className="font-bold text-amber-700 uppercase tracking-widest text-lg">{st.newr !== undefined ? st.newr : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">newc (Target):</span>
                          <span className="font-bold text-amber-700 text-lg">{st.newc !== undefined ? st.newc : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-2">
                          <span className="text-fuchsia-500 font-bold">sizeTotal (Accumulator):</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.sizeTotal !== undefined ? st.sizeTotal : '-'}</span>
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
                  <span>Bridging Components via DSU</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><MapIcon size={28}/> Making a Large Island</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an N x N grid of 0s (water) and 1s (land). You are allowed to flip <strong>at most one</strong> 0 to a 1. The goal is to mathematically determine the size of the largest possible island you can create!</p>
                        <p>This is a brilliant two-phase problem perfectly suited for a <strong>Disjoint Set (Union-Find)</strong>.</p>
                        <ul className="list-decimal pl-6 space-y-2">
                            <li><strong>Phase 1: Structure.</strong> We map the 2D grid to a 1D DSU array. We scan the grid, and whenever we find adjacent 1s, we safely <code>unionBySize</code> them together. This pre-calculates all existing islands and perfectly tracks their total sizes!</li>
                            <li><strong>Phase 2: Experimentation.</strong> We scan the grid again. Whenever we find a 0 (water), we pretend to flip it to 1. We check its 4 neighbors. We collect the <em>Ultimate Roots</em> of any adjacent islands into a <strong>HashSet</strong>. (The HashSet is critical to prevent double-counting if a single large island wraps around our 0). We then sum the sizes of those unique roots, add 1 (for our flipped cell), and update our Global Maximum!</li>
                        </ul>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: The Keystone</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Grid:</strong><br/>1, 0, 1<br/>0, 0, 0<br/>1, 1, 1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">5</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Flipping the 0 at (1,2) connects the top-right 1 to the bottom row of 1s (size 3). Total size = 1 + 1 + 3 = 5!</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-fuchsia-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-fuchsia-500/20`} size={120} />
                            <span className={`text-fuchsia-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 3: All 1s Edge Case</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Grid:</strong><br/>1, 1<br/>1, 1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">4</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">There are no 0s to flip! The algorithm's final Phase 3 loop catches this by iterating all cells and returning the max existing DSU component size.</span>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                        <button onClick={loadTestCase3} className={`px-4 py-2 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 hover:bg-fuchsia-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 3</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid (Rows by |)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Handling dynamic graph connectivity and "What If" scenarios via Disjoint Set.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-emerald-500"/> Phase 1: 2D to 1D Connectivity Mapping</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Disjoint Sets (DSU) natively operate on 1D arrays of indices (e.g., 0 to V-1). But grid problems give us 2D coordinates `(row, col)`. To solve this, we use the golden graph formula: <code>nodeID = row * N + col</code>. This perfectly converts every 2D coordinate into a unique 1D integer. We then scan all 1s in the grid and execute <code>unionBySize()</code> on any adjacent 1s, which groups them into large mathematical components storing their absolute total sizes!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-fuchsia-500"/> Phase 2: The HashSet Protection</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">When pretending to flip a 0 to a 1, we must sum the sizes of adjacent islands. However, a single massive U-shaped island could easily surround our 0 on 3 different sides! If we just summed the sizes of those 3 sides, we'd double-count the same island 3 times, ruining the math. Using a <code>HashSet</code> guarantees we only collect the <strong>Unique Ultimate Roots</strong>. We then sum their sizes reliably!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N²)</strong><br/>Let N be the grid dimension. Phase 1 iterates through all $N^2$ cells, calling DSU operations which run in $O(1)$ amortized time. Phase 2 also iterates through all $N^2$ cells, running 4 DSU lookups and a fast HashSet iteration per cell. Both phases strictly scale linearly with the total number of cells, yielding a highly optimal $O(N^2)$ runtime.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N²)</strong><br/>We must allocate the DSU `parent[]` and `size[]` arrays up to the total number of cells in the grid. Overall space footprint is bounded strictly by the dimension of the grid $O(N^2)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential 'What-If' connectivity problem. Expect interviewers to push you on 'Why not just run DFS for every 0?'"</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we solve this by running DFS to calculate island sizes after pretending to flip each 0?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it would lead to a Time Limit Exceeded (TLE) error on large inputs."</p>
                            <p>A standard DFS to calculate an island's size takes $O(N^2)$. If we have a grid full of mostly 0s, we would run that $O(N^2)$ DFS for nearly every cell, yielding a horrific $O(N^4)$ time complexity. For a $500 \times 500$ grid, this is mathematically billions of operations. The DSU inherently caches the connectivity sizes, allowing us to evaluate any 0 in $O(1)$ amortized time, solving the entire problem in $O(N^2)$ time!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What is the purpose of the final loop (Step 3)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It perfectly handles the edge case where the grid is entirely filled with 1s."</p>
                            <p>If the grid has absolutely zero 0s to flip, Phase 2 will completely bypass its execution block (`if(grid[row][col] == 1) continue;`). Our `mx` would incorrectly return 0. The final loop iterates across all cells one last time to ensure `mx` accurately captures the maximum size of any pre-existing islands!"</p>
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
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-3`}>Grid (Rows by |):</label>
                          <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox, Map
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  numOfIslands: {
    id: 'numOfIslands',
    title: 'Number of Islands II (DSU)',
    icon: <Map size={16} />,
    complexity: 'Time: O(Q × 4 × α(N×M)) | Space: O(N×M)',
    theme: 'teal',
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
    private boolean isValid(int adjr, int adjc, int n, int m) {
        return adjr >= 0 && adjr < n && adjc >= 0 && adjc < m;
    }
    public List<Integer> numOfIslands(int n, int m, int[][] operators) {
        DisjointSet ds = new DisjointSet(n * m);
        int[][] vis = new int[n][m];
        int cnt = 0;
        List<Integer> ans = new ArrayList<>();
        int len = operators.length;
        for(int i = 0; i < len ;i++) {
            int row = operators[i][0];
            int col = operators[i][1];
            if(vis[row][col] == 1) {
                ans.add(cnt);
                continue;
            }
            vis[row][col] = 1;
            cnt++;
            int dr[] = {-1, 0, 1, 0};
            int dc[] = {0, 1, 0, -1};
            for(int ind = 0; ind < 4; ind++) {
                int adjr = row + dr[ind];
                int adjc = col + dc[ind];
                if(isValid(adjr, adjc, n, m)) {
                    if(vis[adjr][adjc] == 1) {
                        int nodeNo = row * m + col;
                        int adjNodeNo = adjr * m + adjc;
                        if(ds.findUPar(nodeNo) != ds.findUPar(adjNodeNo)) {
                            cnt--;
                            ds.unionBySize(nodeNo, adjNodeNo);
                        }
                    }
                }
            }
            ans.add(cnt);
        }
        return ans;
    }
}`,
    desc: "Given an N×M grid of water, 'operators' represent queries dynamically turning cells into Land (1). We need to return the total number of distinct islands after each query. This is a classic dynamic connectivity problem perfectly suited for a Disjoint Set! We map the 2D grid into a 1D DSU array using 'nodeNo = row * m + col'. Every time land is added, we increment the island count. Then we scan its 4 neighbors. If a neighbor is ALSO land and belongs to a different island component, we UNION them together and mathematically decrement our island count!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args|numOfIslands|isValid|operators|vis|cnt|ans|len|row|col|dr|dc|ind|adjr|adjc|nodeNo|adjNodeNo|length|continue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Solution'].includes(part);
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'm', 'i', 'j', 'operators', 'vis', 'cnt', 'ans', 'len', 'row', 'col', 'dr', 'dc', 'ind', 'adjr', 'adjc', 'nodeNo', 'adjNodeNo', 'length'].includes(part);
            const isMapCall = ['numOfIslands', 'isValid', 'findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get'].includes(part);
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

export default function NumberOfIslandsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'numOfIslands';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [nInput, setNInput] = useState('4');
  const [mInput, setMInput] = useState('5');
  const [opsInput, setOpsInput] = useState('0,0 | 0,0 | 1,1 | 1,0 | 0,1 | 0,3 | 1,3 | 0,4 | 3,2 | 2,2 | 1,2 | 0,2');

  const [baseN, setBaseN] = useState(4);
  const [baseM, setBaseM] = useState(5);
  const [baseOps, setBaseOps] = useState<number[][]>([
      [0,0], [0,0], [1,1], [1,0], [0,1], [0,3], [1,3], [0,4], [3,2], [2,2], [1,2], [0,2]
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
      setNInput('4'); setMInput('5');
      setOpsInput('0,0 | 0,0 | 1,1 | 1,0 | 0,1 | 0,3 | 1,3 | 0,4 | 3,2 | 2,2 | 1,2 | 0,2');
  };

  const loadTestCase2 = () => {
      setNInput('3'); setMInput('3');
      setOpsInput('0,0 | 0,2 | 2,0 | 2,2 | 1,1 | 0,1 | 1,0 | 1,2 | 2,1');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        let m = parseInt(mInput.trim(), 10);
        if (isNaN(n) || n <= 0) n = 4;
        if (isNaN(m) || m <= 0) m = 5;
        
        let queries = opsInput.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsed: number[][] = [];
        for(let q of queries) {
            let fields = q.split(',').map(s => parseInt(s.trim(), 10));
            if(fields.length === 2 && !isNaN(fields[0]) && !isNaN(fields[1])) {
                // Ensure queries are within bounds
                if (fields[0] >= 0 && fields[0] < n && fields[1] >= 0 && fields[1] < m) {
                    parsed.push(fields);
                }
            }
        }
        
        setBaseN(n);
        setBaseM(m);
        if (parsed.length > 0) setBaseOps(parsed);
        
        setCurrentStep(0);
        setPan({ x: 0, y: -40 });
        setZoom(1.1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, mInput, opsInput]);

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

  // --- EXACT LINE-BY-LINE TRACE GENERATION (NUMBER OF ISLANDS II) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const m = baseM;
    const operators = baseOps;
    
    if (n === 0 || m === 0) return steps;

    let parent = Array(n * m + 1).fill(0); 
    let sizeArr = Array(n * m + 1).fill(1);
    let vis = Array.from({length: n}, () => Array(m).fill(0));
    let cnt = 0;
    let ans: number[] = [];
    let unionedEdges: {u: number, v: number}[] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), sizeArr: clone1D(sizeArr), n, m, vis: clone2D(vis), cnt, ans: clone1D(ans), operators, unionedEdges: [...unionedEdges], ...stateObj } 
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

    add("Init Function", `public List<Integer> numOfIslands(int n, int m, int[][] operators)\nStarting the algorithm to dynamically track islands across ${n}x${m} grid.`, 34, { phase: 'init' });
    
    add("Create Disjoint Set", `DisjointSet ds = new DisjointSet(n * m);\nAllocating 1D DSU structure of size ${n * m} to handle the 2D grid mathematically.`, 35, { phase: 'init_dsu_call' });
    add("DSU Constructor", `public DisjointSet(int n)`, 4, { phase: 'init_dsu_cons' });
    
    for(let i=0; i <= n*m; i++) { // Following the strict java bounds which goes up to n*m inclusive
        add("DSU Init Loop", `for (int i = 0; i <= n; i++) -> i=${i}`, 5, { phase: 'init_dsu_loop', i });
        parent[i] = i;
        add("Init Parent", `parent.add(${i});\nSetting parent of node ${i} to itself.`, 6, { phase: 'init_dsu_parent', i, parent: clone1D(parent) });
        sizeArr[i] = 1;
        add("Init Size", `size.add(1);\nSetting size of component ${i} to 1.`, 7, { phase: 'init_dsu_size', i, sizeArr: clone1D(sizeArr) });
    }
    add("DSU Init Loop Exit", `for (int i = 0; i <= n; i++) -> Terminated`, 5, { phase: 'init_dsu_loop' });

    add("Init Visited Matrix", `int[][] vis = new int[n][m];\nAllocated 2D visited array (all water '0' initially).`, 36, { phase: 'init_vis' });
    add("Init Count", `int cnt = 0;\nIsland count strictly initialized to 0.`, 37, { phase: 'init_cnt' });
    add("Init Answer Array", `List<Integer> ans = new ArrayList<>();\nList to record counts after each operator.`, 38, { phase: 'init_ans' });
    
    let len = operators.length;
    add("Get Queries Length", `int len = operators.length;\nTotal queries to process: ${len}.`, 39, { phase: 'init_len' });

    for(let i = 0; i < len; i++) {
        add("Start Queries Loop", `for(int i = 0; i < len ;i++) -> Query ${i}`, 40, { phase: 'loop_ops_start', i });
        
        let row = operators[i][0];
        add("Extract Row", `int row = operators[${i}][0]; // ${row}`, 41, { phase: 'ext_row', i, row });
        
        let col = operators[i][1];
        add("Extract Col", `int col = operators[${i}][1]; // ${col}`, 42, { phase: 'ext_col', i, row, col });

        let isAlreadyVisited = vis[row][col] === 1;
        add("Check Already Visited", `if(vis[row][col] == 1)\nIs cell (${row}, ${col}) ALREADY land? ${isAlreadyVisited ? 'YES. Query is redundant.' : 'NO, it is water.'}`, 43, { phase: 'check_vis', i, row, col, isAlreadyVisited });

        if (isAlreadyVisited) {
            ans.push(cnt);
            add("Record Redundant Answer", `ans.add(cnt);\nRECORDING: Nothing changed. Pushing current count (${cnt}) into answers.`, 44, { phase: 'ans_add_red', i, row, col });
            add("Continue", `continue;\nSkipping rest of the loop.`, 45, { phase: 'continue', i, row, col });
            continue;
        }

        vis[row][col] = 1;
        add("Turn to Land", `vis[row][col] = 1;\nRECORDING: Cell (${row}, ${col}) successfully converted into Land!`, 47, { phase: 'set_land', i, row, col });

        cnt++;
        add("Increment Islands", `cnt++;\nRECORDING: Assumed it's a new, isolated island. Count artificially increases from ${cnt-1} to ${cnt}. We'll adjust it if it merges!`, 48, { phase: 'inc_cnt', i, row, col });

        add("Init dr", `int dr[] = {-1, 0, 1, 0};`, 49, { phase: 'init_dr', i, row, col });
        add("Init dc", `int dc[] = {0, 1, 0, -1};\nSetting up Deltas to scan North, East, South, and West.`, 50, { phase: 'init_dc', i, row, col });

        let dr = [-1, 0, 1, 0];
        let dc = [0, 1, 0, -1];

        for(let ind = 0; ind < 4; ind++) {
            add("Neighbor Scan Loop", `for(int ind = 0; ind < 4; ind++) -> ind=${ind}\nScanning direction ${ind} around newly placed land (${row}, ${col}).`, 51, { phase: 'loop_dir_start', i, row, col, ind });

            let adjr = row + dr[ind];
            add("Calc adjr", `int adjr = row + dr[${ind}]; // ${adjr}`, 52, { phase: 'calc_adjr', i, row, col, ind, adjr });
            
            let adjc = col + dc[ind];
            add("Calc adjc", `int adjc = col + dc[${ind}]; // ${adjc}`, 53, { phase: 'calc_adjc', i, row, col, ind, adjr, adjc });

            add("Call isValid", `if(isValid(adjr, adjc, n, m))\nChecking if neighbor (${adjr}, ${adjc}) is inside the grid boundaries.`, 54, { phase: 'call_valid', i, row, col, ind, adjr, adjc });
            
            let valid = adjr >= 0 && adjr < n && adjc >= 0 && adjc < m;
            add("Evaluate Bounds", `return adjr >= 0 && adjr < n && adjc >= 0 && adjc < m;\nReturns: ${valid ? 'true' : 'false'}.`, 32, { phase: 'eval_valid', i, row, col, ind, adjr, adjc, valid });

            if (valid) {
                let isAdjLand = vis[adjr][adjc] === 1;
                add("Check Neighbor Land", `if(vis[adjr][adjc] == 1)\nIs the valid neighbor (${adjr}, ${adjc}) currently land? ${isAdjLand ? 'YES!' : 'NO, it is water.'}`, 55, { phase: 'check_adj_vis', i, row, col, ind, adjr, adjc, isAdjLand });

                if (isAdjLand) {
                    let nodeNo = row * m + col;
                    add("Map nodeNo", `int nodeNo = row * m + col;\nConverted 2D coords (${row},${col}) to 1D index: ${nodeNo}.`, 56, { phase: 'calc_nodeNo', i, row, col, ind, adjr, adjc, nodeNo });
                    
                    let adjNodeNo = adjr * m + adjc;
                    add("Map adjNodeNo", `int adjNodeNo = adjr * m + adjc;\nConverted 2D coords (${adjr},${adjc}) to 1D index: ${adjNodeNo}.`, 57, { phase: 'calc_adjNodeNo', i, row, col, ind, adjr, adjc, nodeNo, adjNodeNo });

                    add("Check Disjoint Roots", `if(ds.findUPar(nodeNo) != ds.findUPar(adjNodeNo))\nChecking if our new land ${nodeNo} and its adjacent land ${adjNodeNo} belong to the SAME island or different ones!`, 58, { phase: 'check_dsu', i, row, col, ind, adjr, adjc, nodeNo, adjNodeNo });

                    let ulp_node = simulateFind(nodeNo, `Checking Node ${nodeNo}`);
                    let ulp_adj = simulateFind(adjNodeNo, `Checking AdjNode ${adjNodeNo}`);

                    let isDifferent = ulp_node !== ulp_adj;
                    
                    if (isDifferent) {
                        cnt--;
                        add("Decrement Islands", `cnt--;\nRECORDING: They belonged to different islands! We are mathematically bridging them, so the total island count drops from ${cnt+1} to ${cnt}.`, 59, { phase: 'dec_cnt', i, row, col, ind, adjr, adjc, nodeNo, adjNodeNo, cnt });
                        
                        add("Union Neighbor", `ds.unionBySize(nodeNo, adjNodeNo);\nExecuting Union-Find to officially merge component ${nodeNo} with ${adjNodeNo}.`, 60, { phase: 'union_call', i, row, col, ind, adjr, adjc, nodeNo, adjNodeNo });

                        // Simulate Union
                        add("Union Start", `public void unionBySize(int u, int v)`, 16, { phase: 'union_start', u: nodeNo, v: adjNodeNo });
                
                        add("Find U Root", `int ulp_u = findUPar(u);`, 17, { phase: 'union_find', u: nodeNo, v: adjNodeNo });
                        let ulp_u = simulateFind(nodeNo, `Union(${nodeNo},${adjNodeNo})`);

                        add("Find V Root", `int ulp_v = findUPar(v);`, 18, { phase: 'union_find', u: nodeNo, v: adjNodeNo, ulp_u });
                        let ulp_v = simulateFind(adjNodeNo, `Union(${nodeNo},${adjNodeNo})`);

                        add("Verify Disjoint in Union", `if (ulp_u == ulp_v) return;\nConfirmed ${ulp_u} != ${ulp_v}. Proceeding to merge.`, 19, { phase: 'union_verify', u: nodeNo, v: adjNodeNo, ulp_u, ulp_v });

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

                    } else {
                        add("Skip Merge", `// (Implicit condition fallthrough)\nRECORDING: They already share the same ultimate root (${ulp_node}). The land just thickens an existing island without bridging distinct ones. Count remains ${cnt}.`, 58, { phase: 'skip_merge', i, row, col, ind, adjr, adjc, nodeNo, adjNodeNo });
                    }
                }
            }
        }

        ans.push(cnt);
        add("Push Operator Result", `ans.add(cnt);\nRECORDING: Finished scanning 4 directions. Final island count after Query ${i} is ${cnt}. Pushing to answers.`, 65, { phase: 'push_ans', i, row, col, cnt });
    }

    add("Return Final Answer Array", `return ans;\nAlgorithm successfully evaluated all dynamic queries!`, 67, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseM, baseOps]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-teal-900 border-teal-800` : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-teal-400`}>
                    <CheckCircle2 size={24}/> DYNAMIC QUERIES RESOLVED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. The DSU accurately tracked the mathematical reduction of distinct islands across all dynamic queries!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('push') || String(st.phase || '').includes('set_land') ? 'text-teal-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('calc') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') || String(st.phase || '').includes('find') || String(st.phase || '').includes('dec_cnt') || String(st.phase || '').includes('inc_cnt') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
      if (st.vis === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const cellSize = 60;
      const gridW = st.m * cellSize;
      const gridH = st.n * cellSize;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              <div style={{ width: gridW, height: gridH }} className="relative shrink-0 flex items-center justify-center shadow-2xl rounded-xl border-4 border-slate-300 bg-blue-100 overflow-hidden">
                  
                  {/* Grid Background Lines for Water */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none grid" style={{ gridTemplateColumns: `repeat(${st.m}, 1fr)`, gridTemplateRows: `repeat(${st.n}, 1fr)` }}>
                      {Array.from({length: st.n * st.m}).map((_, i) => (
                          <div key={`water-${i}`} className="border-r border-b border-blue-200/50 w-full h-full"></div>
                      ))}
                  </div>

                  {/* Visual Edges Layer for Unioned Components */}
                  <svg viewBox={`0 0 ${gridW} ${gridH}`} className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                      {st.unionedEdges && st.unionedEdges.map((edge: {u: number, v: number}, idx: number) => {
                          const r1 = Math.floor(edge.u / st.m);
                          const c1 = edge.u % st.m;
                          const r2 = Math.floor(edge.v / st.m);
                          const c2 = edge.v % st.m;

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
                    {st.vis.map((rowArr: number[], r: number) => {
                        return rowArr.map((val: number, c: number) => {
                            let node1D = r * st.m + c;
                            
                            let isLand = val === 1;
                            let isRoot = isLand && st.parent && st.parent[node1D] === node1D && st.phase !== 'init';
                            
                            let isActiveCell = st.phase?.includes('set_land') && st.row === r && st.col === c;
                            let isScanningAdj = st.phase?.includes('calc_adj') || st.phase?.includes('check_valid') || st.phase?.includes('check_adj') || st.phase?.includes('calc_1d');
                            let isTargetAdj = isScanningAdj && st.adjr === r && st.adjc === c;
                            
                            let isCheckingUnion = st.phase?.includes('check_dsu') || st.phase?.includes('union');
                            let isUnionSource = isCheckingUnion && st.nodeNo === node1D;
                            let isUnionTarget = isCheckingUnion && st.adjNodeNo === node1D;

                            // Default water state
                            let bgClass = '';
                            let borderClass = 'border-transparent';
                            let textClass = 'text-blue-300';
                            let zIndex = 'z-0';

                            if (isLand) {
                                bgClass = 'bg-teal-500 shadow-md';
                                borderClass = 'border-teal-600 border-b-4 border-r-4'; // 3D land effect
                                textClass = 'text-white';
                                zIndex = 'z-20';
                            }

                            // Highlights overrule base states
                            let ringClass = '';
                            if (isActiveCell || isUnionSource) {
                                bgClass = 'bg-fuchsia-500 shadow-xl scale-110';
                                borderClass = 'border-fuchsia-600 border-b-4';
                                textClass = 'text-white';
                                zIndex = 'z-40';
                                ringClass = 'ring-4 ring-fuchsia-300 ring-offset-2 border-transparent animate-pulse';
                            } else if (isTargetAdj || isUnionTarget) {
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
                                    {isRoot && !isActiveCell && !isTargetAdj && !isUnionSource && !isUnionTarget && (
                                        <span className="absolute -top-3 -right-3 text-[8px] bg-teal-800 text-teal-100 px-1.5 py-0.5 rounded shadow-sm border border-teal-900 z-50">Root</span>
                                    )}

                                    {/* Water waves for empty */}
                                    {!isLand && !isTargetAdj && (
                                        <Waves size={16} className="opacity-20 absolute" />
                                    )}
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
                        <span className={`text-[12px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded border border-teal-200 h-12 flex items-center shadow-sm`}>DSU parent[]</span>
                        <span className="text-[12px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 h-12 flex items-center shadow-sm">DSU size[]</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* PARENT ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.parent.map((val: number, idx: number) => {
                                if (idx >= st.n * st.m) return null;
                                let isEval = st.phase?.includes('find_') && st.findNode === idx;
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-teal-500 text-white border-teal-600 scale-110 shadow-lg ring-2 ring-teal-300 animate-in zoom-in font-black z-20";
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
                                if (idx >= st.n * st.m) return null;
                                let isUpdated = st.phase?.includes('union_add_size') && (st.targetRoot === idx);
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";

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
          
          <div className="flex flex-col w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-between">
                          Total Islands (cnt)
                          {st.phase === 'inc_cnt' && <span className="text-teal-500 text-[10px]">+ 1 (New Land)</span>}
                          {st.phase === 'dec_cnt' && <span className="text-rose-500 text-[10px]">- 1 (Merge)</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'inc_cnt' ? 'text-teal-500 animate-pulse' : (st.phase === 'dec_cnt' ? 'text-rose-500 animate-pulse' : 'text-slate-700')}`}>{st.cnt !== undefined ? st.cnt : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Queries (operators)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[100px] max-h-[180px] overflow-y-auto scrollbar-thin">
                  {(st.operators || []).map((op: number[], rowIdx: number) => {
                      let isActiveRow = st.i === rowIdx && !st.isDone;
                      let isProcessed = st.i > rowIdx || st.isDone;

                      return (
                          <div key={`op-${rowIdx}`} className={`flex items-center justify-between transition-all duration-300 ${isActiveRow ? 'bg-amber-50/70 p-2 -m-2 rounded-xl border border-amber-200 shadow-sm' : ''}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-amber-400 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                  {rowIdx}
                              </div>
                              <ArrowRight size={16} className={`shrink-0 mx-2 ${isActiveRow ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`} />
                              <div className={`flex flex-wrap gap-x-1.5 items-center font-mono text-sm flex-1 ${isActiveRow ? 'text-amber-700 font-black scale-105' : (isProcessed ? 'text-slate-400 font-bold' : 'text-slate-400')}`}>
                                  [{op[0]}, {op[1]}]
                                  {isProcessed && <Check size={14} className="ml-2 text-emerald-500" />}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><CheckCircle2 size={12}/> Output Tracking (ans)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[100px] max-h-[140px] overflow-y-auto scrollbar-thin">
                  <div className="flex flex-wrap gap-2 items-center font-mono text-base font-bold">
                      <span className="text-slate-400">[</span>
                      {st.ans === undefined || st.ans.length === 0 ? <span className="text-slate-300 italic text-xs">Waiting...</span> : (
                          st.ans.map((val: number, idx: number) => {
                              let isNewlyPushed = (st.phase === 'push_ans' || st.phase === 'ans_add_red' || st.phase === 'done') && idx === st.ans.length - 1;
                              return (
                                  <React.Fragment key={`ans-${idx}`}>
                                      <span className={`transition-all duration-500 ${isNewlyPushed ? 'text-emerald-500 scale-125 bg-emerald-50 px-1 rounded animate-pulse shadow-sm border border-emerald-200' : 'text-slate-700'}`}>
                                          {val}
                                      </span>
                                      {idx < st.ans.length - 1 && <span className="text-slate-300">,</span>}
                                  </React.Fragment>
                              )
                          })
                      )}
                      <span className="text-slate-400">]</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">row (New):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest text-lg">{st.row !== undefined ? st.row : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">col (New):</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.col !== undefined ? st.col : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">adjr (Target):</span>
                          <span className="font-bold text-amber-700 uppercase tracking-widest text-lg">{st.adjr !== undefined ? st.adjr : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-amber-500 font-bold">adjc (Target):</span>
                          <span className="font-bold text-amber-700 text-lg">{st.adjc !== undefined ? st.adjc : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-2">
                          <span className="text-teal-500 font-bold">Calculated nodeNo:</span>
                          <span className="font-bold text-teal-700 text-lg">{st.nodeNo !== undefined ? st.nodeNo : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-2">
                          <span className="text-teal-500 font-bold">Calculated adjNodeNo:</span>
                          <span className="font-bold text-teal-700 text-lg">{st.adjNodeNo !== undefined ? st.adjNodeNo : '-'}</span>
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
                  <span>Dynamic Connectivity & DSU</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Map size={28}/> Number of Islands II</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Unlike the classic "Number of Islands" problem where the grid is given entirely upfront and we solve it with DFS/BFS, this is an <strong>Online Queries</strong> problem. We start with a grid of pure water. A list of <code>operators</code> specifies coordinates where land is dynamically added one by one. After <em>each</em> addition, we must output the total number of distinct islands!</p>
                        <p>Since running a full DFS after every query would be devastatingly slow, we use a <strong>Disjoint Set (Union-Find)</strong>! We map the 2D grid <code>[row][col]</code> to a 1D DSU array using the mathematical formula <code>nodeNo = row * m + col</code>.</p>
                        <p>Every time we add land, we naively increment our island <code>cnt++</code>. Then, we check its 4 neighbors. If a neighbor is also land, we query the DSU. If they belong to different roots (<code>findUPar</code>), we union them together and decrement <code>cnt--</code>, as two separate islands just merged into one! We repeat this and record <code>cnt</code> after every step.</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: The Connecting Bridge</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 4, <strong>M:</strong> 5<br/><strong>Ops:</strong> [0,0], [0,0], [1,1], [1,0], [0,1], [0,3], [1,3], [0,4], [3,2], [2,2], [1,2], [0,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[1, 1, 2, 1, 1, 2, 2, 2, 3, 3, 3, 1]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Notice how adding [0,0] again keeps it 1 (redundant). Adding [1,1] creates a new island (count 2). Adding [1,0] bridges them back to 1! Eventually, adding [0,2] acts as a massive keystone bridge, collapsing 3 distinct islands into 1 instantly!</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Checkerboard</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>N:</strong> 3, <strong>M:</strong> 3<br/><strong>Ops:</strong> [0,0], [0,2], [2,0], [2,2], [1,1], [0,1], [1,0], [1,2], [2,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[1, 2, 3, 4, 5, 3, 2, 2, 1]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">We place land on the corners and center, creating 5 distinct diagonal islands. Since diagonal connections don't count, count peaks at 5. Then we fill the edges, rapidly decreasing the count back to 1.</span>
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Rows (N)</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Cols (M)</label>
                            <input type="number" value={mInput} onChange={(e) => setMInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-4">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Operators [row, col] (Rows by |)</label>
                            <input type="text" value={opsInput} onChange={(e) => setOpsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                    <div className="inline-flex items-center justify-center p-4 bg-teal-100 text-teal-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Handling dynamic graph connectivity via Disjoint Set mapped to 2D matrices.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-teal-500"/> 2D to 1D Formula Mapping</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Disjoint Sets (DSU) natively operate on 1D arrays of indices (e.g., 0 to V-1). But grid problems like "Number of Islands" give us 2D coordinates `(row, col)`. To solve this, we use the golden graph formula: <code>nodeID = row * totalColumns + col</code>. This perfectly converts every 2D coordinate into a unique 1D integer, allowing our DSU to manage the grid flawlessly!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Waves size={24} className="text-emerald-500"/> Dynamic Island Counting</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Since the queries come "online" (one by one), running a full DFS search for islands after every query would be devastatingly slow $O(Q \cdot N \cdot M)$. Instead, the DSU makes it extremely efficient: When land is placed, we optimistically assume it's a new island: <code>cnt++</code>. Then, we check its 4 neighbors. If a neighbor is land and belongs to a <em>different</em> DSU root, we physically link them <code>unionBySize()</code> and mathematically decrement our islands: <code>cnt--</code>!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(Q × 4 × α(N×M))</strong><br/>Let Q be the number of queries/operators. For each query, we perform a 4-directional scan. Each valid direction requires DSU `findUPar` and `unionBySize` operations, which execute in near-constant amortized time $O(\alpha(V))$. Thus, the entire algorithm dynamically processes all queries in extremely fast time bounds!</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N × M)</strong><br/>We must allocate the DSU `parent[]` and `size[]` arrays up to the total number of cells in the grid. We also need a 2D `vis[][]` matrix to track which cells are currently water vs land. Overall space footprint is bounded strictly by the dimensions of the grid $O(N \cdot M)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-teal-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is the quintessential transition from standard BFS/DFS Island problems to advanced DSU applications. Expect interviewers to push you on 'Why not just run DFS?'"</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we solve this by running DFS/BFS to count islands after every single query?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it would lead to a Time Limit Exceeded (TLE) error on large inputs."</p>
                            <p>A standard DFS to count islands takes $O(N \cdot M)$. If we receive $Q$ online queries, running DFS from scratch every time would yield $O(Q \cdot N \cdot M)$. For a $1000 \times 1000$ grid with $100,000$ queries, this is billions of operations. The DSU inherently caches the connectivity state of the grid, allowing us to merge newly added land into existing systems in $O(\alpha(V))$ amortized time, effectively solving the entire problem in near linear $O(Q)$ time!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What happens if a query adds land to a cell that is ALREADY land?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We must detect and skip it to prevent counting errors."</p>
                            <p>The algorithm actively checks `if(vis[row][col] == 1)` at the very beginning of the query loop. If we don't `continue` here, the algorithm would blindly execute `cnt++`, artificially inflating the island count for redundant land placements. Skipping ensures idempotency!"</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1 shrink-0 ml-1`}>M:</label>
                          <input type="number" value={mInput} onChange={(e) => setMInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-3`}>Ops:</label>
                          <input type="text" value={opsInput} onChange={(e) => setOpsInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid as GridIcon, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox, Link, Truck, Clock, Repeat2, RefreshCcw
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  kosarajuAlgorithm: {
    id: 'kosarajuAlgorithm',
    title: "Kosaraju's Algorithm (SCC)",
    icon: <RefreshCcw size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V + E)',
    theme: 'emerald',
    code: `class Solution {
    private void dfs(int node, int []vis, ArrayList<ArrayList<Integer>> adj, Stack<Integer> st) {
        vis[node] = 1;
        for(Integer it: adj.get(node)) {
            if(vis[it] == 0) {
                dfs(it, vis, adj, st);
            }
        }
        st.push(node);
    }
    private void dfs3(int node, int[] vis, ArrayList<ArrayList<Integer>> adjT) {
        vis[node] = 1;
        for(Integer it: adjT.get(node)) {
            if(vis[it] == 0) {
                dfs3(it, vis, adjT);
            }
        }
    }
    //Function to find number of strongly connected components in the graph.
    public int kosaraju(int V, ArrayList<ArrayList<Integer>> adj) {
        int[] vis = new int[V];
        Stack<Integer> st = new Stack<Integer>();
        for(int i = 0;i<V;i++) {
            if(vis[i] == 0) {
                dfs(i, vis, adj, st);
            }
        }
        
        ArrayList<ArrayList<Integer>> adjT = new ArrayList<ArrayList<Integer>>();
        for(int i = 0;i<V;i++) {
            adjT.add(new ArrayList<Integer>());
        }
        for(int i = 0;i<V;i++) {
            vis[i] = 0;
            for(Integer it : adj.get(i)) {
                // i -> it
                // it -> i
                adjT.get(it).add(i);
            }
        }
        int scc = 0;
        while(!st.isEmpty()) {
            int node = st.peek();
            st.pop();
            if(vis[node] == 0) {
                scc++;
                dfs3(node, vis, adjT);
            }
        }
        return scc;
    }
}`,
    desc: "Kosaraju's Algorithm finds the Strongly Connected Components (SCCs) of a directed graph in 3 brilliant linear-time phases! Phase 1: Run DFS on the unvisited nodes and push them to a Stack based on their FINISHING time (nodes that finish last end up on top). Phase 2: Transpose (reverse) all the edges in the graph to create adjT. This mathematically prevents SCCs from leaking into one another during traversal. Phase 3: Pop nodes from the Stack. If unvisited, run a second DFS using the reversed graph (adjT). Every full DFS sweep perfectly isolates a distinct Strongly Connected Component!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|Queue|LinkedList|Math|max|length|isEmpty|poll|add|grid|q|emptyCount|time|dr|dc|curr|r|c|t|nr|nc|dispatchTrucks|Stack|ArrayList|List|Integer|dfs|dfs3|kosaraju|vis|adj|adjT|st|node|it|V|i|scc|push|peek|pop|get)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-500` };
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
            const isObject = ['String', 'Math', 'Integer', 'Stack', 'ArrayList', 'List', 'Solution'].includes(part);
            const isPointer = ['vis', 'adj', 'adjT', 'st', 'node', 'it', 'V', 'i', 'scc'].includes(part);
            const isMapCall = ['dfs', 'dfs3', 'kosaraju', 'push', 'peek', 'pop', 'add', 'get', 'isEmpty'].includes(part);
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

export default function KosarajuVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'kosarajuAlgorithm';
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const [vInput, setVInput] = useState('5');
  const [edgesInput, setEdgesInput] = useState('0,2 | 2,1 | 1,0 | 0,3 | 3,4');

  const [baseV, setBaseV] = useState(5);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0,2], [2,1], [1,0], [0,3], [3,4]
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
      setEdgesInput('0,2 | 2,1 | 1,0 | 0,3 | 3,4');
  };

  const loadTestCase2 = () => {
      setVInput('8');
      setEdgesInput('0,1 | 1,2 | 2,0 | 2,3 | 3,4 | 4,5 | 5,6 | 6,4 | 4,7 | 6,7');
  };

  const loadTestCase3 = () => {
      setVInput('4');
      setEdgesInput('0,1 | 1,2 | 2,3');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let v = parseInt(vInput.trim(), 10);
        if (isNaN(v) || v <= 0 || v > 15) v = 5;
        
        let rows = edgesInput.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if(cells.length === 2 && !isNaN(cells[0]) && !isNaN(cells[1])) {
                if (cells[0] >= 0 && cells[0] < v && cells[1] >= 0 && cells[1] < v) {
                    parsedEdges.push(cells);
                }
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

  const clone1D = (arr: number[]) => [...arr];

  // --- EXACT LINE-BY-LINE TRACE GENERATION (KOSARAJU'S ALGORITHM) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const V = baseV;
    const edges = baseEdges;
    
    if (V === 0) return steps;

    // Simulation Data Structures
    let adj: number[][] = Array.from({length: V}, () => []);
    for (let e of edges) adj[e[0]].push(e[1]);

    let adjT: number[][] = Array.from({length: V}, () => []);
    let vis: number[] = Array(V).fill(0);
    let stStack: number[] = [];
    let scc = 0;
    let sccGroups: number[][] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { V, edges, adj, adjT: adjT.map(a=>[...a]), vis: clone1D(vis), stStack: [...stStack], scc, sccGroups: sccGroups.map(g=>[...g]), ...stateObj } 
    });

    const runDfs = (node: number) => {
        vis[node] = 1;
        add("DFS1 Entry", `vis[${node}] = 1;\nMarking node ${node} as visited in Phase 1.`, 3, { activeNode: node });
        
        add("DFS1 Adj Loop", `for(Integer it: adj.get(${node}))\nChecking outbound edges from node ${node}.`, 4, { activeNode: node });
        
        for(let it of adj[node]) {
            let isVisited = vis[it] === 1;
            add("DFS1 Check Visited", `if(vis[it] == 0)\nIs neighbor ${it} unvisited? ${!isVisited ? 'YES.' : 'NO, already visited.'}`, 5, { activeNode: node, targetNode: it });
            if(!isVisited) {
                add("DFS1 Recurse", `dfs(it, vis, adj, st);\nRecursively diving into unvisited node ${it}.`, 6, { activeNode: node, targetNode: it });
                runDfs(it);
                add("DFS1 Backtrack", `// Backtracking to node ${node}`, 4, { activeNode: node, backtrackFrom: it });
            }
        }
        
        stStack.push(node);
        add("Push to Stack", `st.push(${node});\nRECORDING: Node ${node} has finished completely. Pushing it onto the Stack!`, 9, { activeNode: node, pushedNode: node });
    };

    const runDfs3 = (node: number, currentSccIdx: number) => {
        vis[node] = 1;
        sccGroups[currentSccIdx].push(node);
        add("DFS3 Entry", `vis[${node}] = 1;\nMarking node ${node} as visited in Phase 3. It belongs to SCC ${currentSccIdx + 1}!`, 12, { activeNode: node, isTransposed: true });
        
        add("DFS3 Adj Loop", `for(Integer it: adjT.get(${node}))\nChecking outbound REVERSED edges from node ${node}.`, 13, { activeNode: node, isTransposed: true });
        
        for(let it of adjT[node]) {
            let isVisited = vis[it] === 1;
            add("DFS3 Check Visited", `if(vis[it] == 0)\nIs reversed neighbor ${it} unvisited? ${!isVisited ? 'YES.' : 'NO, already visited or in another SCC.'}`, 14, { activeNode: node, targetNode: it, isTransposed: true });
            if(!isVisited) {
                add("DFS3 Recurse", `dfs3(it, vis, adjT);\nRecursively diving into unvisited node ${it} to group it into the current SCC.`, 15, { activeNode: node, targetNode: it, isTransposed: true });
                runDfs3(it, currentSccIdx);
                add("DFS3 Backtrack", `// Backtracking to node ${node}`, 13, { activeNode: node, backtrackFrom: it, isTransposed: true });
            }
        }
    };

    add("Init Function", `public int kosaraju(int V, ArrayList<...>\nInitiating Kosaraju's 3-Phase algorithm for SCCs.`, 20, { phase: 'init' });
    
    add("Init Variables", `int[] vis = new int[V];\nStack<Integer> st = new Stack<Integer>();\nPrepared visited array and finishing-time stack.`, 21, { phase: 'init_vars' });

    add("Phase 1: DFS Fill Stack", `// Phase 1: Fill the Stack based on finishing times.`, 23, { phase: 'phase1_start' });
    
    for(let i = 0; i < V; i++) {
        let isVisited = vis[i] === 1;
        add("Phase 1 Main Loop", `if(vis[${i}] == 0)\nChecking starting node ${i}. Visited? ${isVisited ? 'YES, skip.' : 'NO, initiate DFS.'}`, 24, { checkNode: i });
        if(!isVisited) {
            add("Phase 1 DFS Call", `dfs(${i}, vis, adj, st);`, 25, { checkNode: i });
            runDfs(i);
        }
    }

    add("Phase 2: Transpose Graph", `// Phase 2: Create adjT (Transposed Graph)`, 29, { phase: 'phase2_start' });
    add("Init adjT", `ArrayList<ArrayList<Integer>> adjT = new ArrayList<ArrayList<Integer>>();\nPreparing to reverse all edges!`, 29, { phase: 'init_adjt' });

    for(let i = 0; i < V; i++) {
        vis[i] = 0; // resetting visited
        for(let it of adj[i]) {
            adjT[it].push(i);
        }
    }
    
    add("Reverse Edges & Reset Visited", `for(int i = 0;i<V;i++) { vis[i] = 0; ... adjT.get(it).add(i); }\nRECORDING: Physically reversed every single edge in the graph to populate adjT. Visited array is wiped clean to 0.`, 38, { phase: 'transpose_build', isTransposed: true });

    add("Phase 3: Identify SCCs", `// Phase 3: Pop from stack and run DFS on reversed graph.`, 41, { phase: 'phase3_start', isTransposed: true });
    
    add("Init SCC Counter", `int scc = 0;\nPreparing to count the Strongly Connected Components.`, 41, { phase: 'init_scc', isTransposed: true });

    while(stStack.length > 0) {
        add("While Stack", `while(!st.isEmpty())\nStack size: ${stStack.length}. Popping nodes to evaluate SCCs.`, 42, { phase: 'while_st', isTransposed: true });
        
        let node = stStack[stStack.length - 1]; // peek
        add("Peek Stack", `int node = st.peek(); // ${node}`, 43, { phase: 'st_peek', peekNode: node, isTransposed: true });
        
        stStack.pop();
        add("Pop Stack", `st.pop();\nPopped node ${node} from the top of the stack.`, 44, { phase: 'st_pop', poppedNode: node, isTransposed: true });

        let isVisited = vis[node] === 1;
        add("Check Popped Visited", `if(vis[${node}] == 0)\nIs popped node ${node} already part of an SCC (visited)? ${isVisited ? 'YES, skip it.' : 'NO! We found a new SCC root!'}`, 45, { phase: 'st_check', checkNode: node, isVisited, isTransposed: true });

        if(!isVisited) {
            scc++;
            sccGroups.push([]);
            add("Increment SCC", `scc++;\nRECORDING: Discovered SCC #${scc}! Launching DFS3 to collect all its members.`, 46, { phase: 'inc_scc', sccNode: node, isTransposed: true });
            
            add("Call DFS3", `dfs3(${node}, vis, adjT);`, 47, { phase: 'call_dfs3', sccNode: node, isTransposed: true });
            runDfs3(node, scc - 1);
        }
    }

    add("Return SCC", `return scc;\nAlgorithm concluded! The graph contains exactly ${scc} Strongly Connected Components.`, 50, { phase: 'done', isDone: true, isSuccess: true, finalAns: scc, isTransposed: true });

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
                    <CheckCircle2 size={24}/> ALGORITHM CONCLUDED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Kosaraju successfully isolated exactly {st.finalAns} Strongly Connected Components!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('dfs3') || String(st.phase || '').includes('scc') ? 'text-emerald-400' : (String(st.phase || '').includes('transpose') ? 'text-amber-400' : (String(st.phase || '').includes('dfs') || String(st.phase || '').includes('push') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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

  // Dynamic Layout for Graph
  const svgSize = 600;
  const graphRadius = Math.max(160, baseV * 30);
  
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseV).fill({x: 0, y: 0});
    if (baseV === 0) return pos;
    if (baseV === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < baseV; i++) {
        // Distribute nicely in a circle
        const angle = (i / baseV) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseV, graphRadius]);

  const SCC_COLORS = ['emerald', 'blue', 'amber', 'purple', 'rose', 'cyan', 'indigo', 'lime'];

  const renderMainCanvas = () => {
      if (st.adj === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const activeAdj = st.isTransposed ? st.adjT : st.adj;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Massive Final Answer Popup */}
              {st.isDone && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                      <div className={`bg-emerald-600/95 backdrop-blur border-4 border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 flex flex-col items-center gap-4 text-white transform -translate-y-10`}>
                          <Trophy size={64} className="text-amber-300 drop-shadow-md animate-bounce"/>
                          <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Total SCCs Found</span>
                          <span className="text-8xl font-black drop-shadow-xl pt-2">{st.finalAns}</span>
                      </div>
                  </div>
              )}

              {/* State Watermark */}
              <div className="absolute top-4 left-4 z-40 pointer-events-none">
                  {st.isTransposed ? (
                      <span className="bg-amber-100 text-amber-700 font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-md border border-amber-300 flex items-center gap-2"><ArrowLeftRight size={18}/> Phase 2/3: Transposed Graph</span>
                  ) : (
                      <span className="bg-fuchsia-100 text-fuchsia-700 font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-md border border-fuchsia-300 flex items-center gap-2"><ArrowRight size={18}/> Phase 1: Original Graph</span>
                  )}
              </div>

              {/* The Visual Directed Graph */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center rounded-full">
                  
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead-fuchsia" markerWidth="10" markerHeight="7" refX="26" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#d946ef" />
                          </marker>
                          <marker id="arrowhead-amber" markerWidth="10" markerHeight="7" refX="26" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                          </marker>
                          <marker id="arrowhead-slate" markerWidth="10" markerHeight="7" refX="26" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-emerald" markerWidth="10" markerHeight="7" refX="26" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                      </defs>

                      {(() => {
                          const renderedEdges: React.ReactNode[] = [];
                          
                          if (activeAdj) {
                              activeAdj.forEach((neighbors: number[], u: number) => {
                                  neighbors.forEach((v) => {
                                      const p1 = nodePositions[u];
                                      const p2 = nodePositions[v];
                                      if (!p1 || !p2) return;

                                      let isActiveTraversal = st.activeNode === u && st.targetNode === v;
                                      
                                      let strokeColor = "#cbd5e1"; // slate-300
                                      let marker = "url(#arrowhead-slate)";
                                      let strokeWidth = "2";
                                      let animClass = "transition-all duration-500";

                                      if (st.isTransposed) {
                                          strokeColor = "#fcd34d"; // amber-300
                                          marker = "url(#arrowhead-amber)";
                                      }

                                      if (isActiveTraversal) {
                                          strokeColor = st.isTransposed ? "#10b981" : "#d946ef"; // emerald for dfs3, fuchsia for dfs1
                                          marker = st.isTransposed ? "url(#arrowhead-emerald)" : "url(#arrowhead-fuchsia)";
                                          strokeWidth = "5";
                                          animClass = "animate-pulse transition-all duration-300";
                                      }

                                      renderedEdges.push(
                                          <g key={`edge-${u}-${v}`} className={animClass}>
                                              <line 
                                                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                                  stroke={strokeColor}
                                                  strokeWidth={strokeWidth}
                                                  markerEnd={marker}
                                              />
                                          </g>
                                      );
                                  });
                              });
                          }
                          return renderedEdges;
                      })()}
                  </svg>

                  {/* Interactive Nodes Layer */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translate(50%, 50%)' }}>
                      {nodePositions.map((pos, idx) => {
                          let isVisited = st.vis && st.vis[idx] === 1;
                          let isActive = st.activeNode === idx || st.checkNode === idx || st.peekNode === idx || st.poppedNode === idx;
                          let isPushed = st.pushedNode === idx;
                          
                          // Determine if node is part of an SCC
                          let sccIndex = -1;
                          if (st.sccGroups) {
                              st.sccGroups.forEach((group: number[], gIdx: number) => {
                                  if (group.includes(idx)) sccIndex = gIdx;
                              });
                          }

                          let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                          let ringClass = '';
                          let zIndex = 'z-10';

                          if (sccIndex !== -1) {
                              let cTheme = SCC_COLORS[sccIndex % SCC_COLORS.length];
                              bgClass = `bg-${cTheme}-500 text-white border-${cTheme}-600 shadow-lg`;
                          } else if (isVisited) {
                              bgClass = 'bg-slate-200 text-slate-400 border-slate-300 shadow-inner';
                          }

                          if (isActive) {
                              let activeColor = st.isTransposed ? 'emerald' : 'fuchsia';
                              if (st.phase?.includes('peek') || st.phase?.includes('pop')) activeColor = 'amber';
                              
                              bgClass = `bg-${activeColor}-500 text-white border-${activeColor}-600 shadow-xl scale-125`;
                              ringClass = `ring-4 ring-${activeColor}-300 ring-offset-2 border-transparent animate-pulse`;
                              zIndex = 'z-40';
                          } else if (isPushed) {
                              bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl scale-110';
                              ringClass = 'ring-4 ring-fuchsia-300 ring-offset-2 border-transparent animate-ping';
                              zIndex = 'z-30';
                          }

                          return (
                              <div key={`node-${idx}`} className={`absolute flex items-center justify-center font-mono font-black rounded-full transition-all duration-500 pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ 
                                  left: `${pos.x}px`, 
                                  top: `${pos.y}px`, 
                                  width: `48px`,
                                  height: `48px`,
                                  transform: 'translate(-50%, -50%)'
                              }}>
                                  {idx}
                                  {sccIndex !== -1 && !isActive && <span className={`absolute -bottom-6 text-[9px] bg-${SCC_COLORS[sccIndex % SCC_COLORS.length]}-100 text-${SCC_COLORS[sccIndex % SCC_COLORS.length]}-700 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-widest border border-${SCC_COLORS[sccIndex % SCC_COLORS.length]}-300 whitespace-nowrap`}>SCC {sccIndex + 1}</span>}
                              </div>
                          );
                      })}
                  </div>

              </div>
          </div>
      );
  };

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-4 w-full h-full pb-8">

          {/* Adjacency List Tracker */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border mb-2 shadow-sm flex items-center gap-2 w-fit transition-colors duration-500 ${st.isTransposed ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {st.isTransposed ? <ArrowLeftRight size={12}/> : <ListTree size={12}/>} 
                  {st.isTransposed ? 'Transposed Graph (adjT)' : 'Original Graph (adj)'}
              </span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[100px] max-h-[170px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : ((st.isTransposed ? st.adjT : st.adj) || []).map((neighbors: number[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;

                      let rowTheme = st.isTransposed ? 'emerald' : 'fuchsia';

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center justify-between transition-all duration-300 ${isActiveRow ? `bg-${rowTheme}-50/70 p-2 -m-2 rounded-xl border border-${rowTheme}-200 shadow-sm` : ''}`}>
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? `bg-${rowTheme}-500 text-white shadow-md` : 'bg-slate-100 text-slate-500'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={16} className={`shrink-0 mx-2 ${isActiveRow ? `text-${rowTheme}-500 animate-pulse` : 'text-slate-300'}`} />
                              <div className="flex flex-wrap gap-x-1 gap-y-2 items-center font-mono text-[11px] leading-tight flex-1">
                                  <span className="text-slate-400 font-sans text-sm">{"{"}</span>
                                  {neighbors.length === 0 && <span className="text-slate-400 italic font-sans text-[10px]">empty</span>}
                                  {neighbors.map((neighbor, colIdx) => {
                                      let isProcessing = isActiveRow && st.targetNode === neighbor;
                                      
                                      return (
                                          <React.Fragment key={`adj-m-${nodeIdx}-${colIdx}`}>
                                              <span className={`relative transition-all ${isProcessing ? `text-amber-500 font-black scale-125 bg-amber-400/20 px-1.5 py-0.5 rounded shadow-sm z-10 animate-bounce` : 'text-slate-600 font-bold'}`}>
                                                  {neighbor}
                                              </span>
                                              {colIdx < neighbors.length - 1 && <span className="text-slate-400 mr-1.5">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 font-sans text-sm">{"}"}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
          
          {/* Stack Tracker */}
          <div className="flex flex-col w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit mx-auto"><Layers size={12}/> Finishing Stack (st)</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-1.5 relative min-h-[120px] max-h-[200px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-1">
                      <span>TOP</span>
                  </div>
                  {st.stStack === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (
                      <>
                          {st.stStack.length === 0 && <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Stack Empty</span>}
                          {/* Render stack reversed so top is at top visually */}
                          {[...st.stStack].reverse().map((node: number, i: number) => {
                              let isTop = i === 0;
                              let isNewlyPushed = st.phase === 'push_st' && isTop; // Actually we didn't add push_st phase explicitly in the generator above, it's pushedNode
                              let isPopping = (st.phase === 'st_peek' || st.phase === 'st_pop') && isTop;
                              let isPushedNode = st.pushedNode === node && isTop;

                              let bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
                              if (isPushedNode) bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 scale-105 shadow-md animate-in slide-in-from-top-4';
                              else if (isPopping) bgClass = 'bg-amber-400 text-white border-amber-500 scale-105 shadow-md animate-pulse ring-2 ring-amber-200';

                              return (
                                  <div key={`st-${st.stStack.length - i}-${node}`} className={`w-full py-2 flex items-center justify-center font-mono font-black rounded-lg border transition-all duration-300 ${bgClass}`}>
                                      {node}
                                  </div>
                              )
                          })}
                      </>
                  )}
                  <div className="sticky bottom-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-2 pb-1 border-t border-slate-100 bg-white z-10 mt-1">
                      <span>BOTTOM</span>
                  </div>
              </div>
          </div>

          {/* SCC Output Array */}
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><CheckCircle2 size={12}/> Strongly Connected Components</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  {st.sccGroups === undefined || st.sccGroups.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Phase 3...</span> : (
                      st.sccGroups.map((group: number[], idx: number) => {
                          let isNewGroup = st.phase === 'inc_scc' && idx === st.sccGroups.length - 1;
                          let cTheme = SCC_COLORS[idx % SCC_COLORS.length];

                          return (
                              <div key={`scc-${idx}`} className={`flex flex-wrap gap-1.5 items-center font-mono text-[10px] leading-tight p-2.5 rounded-xl border transition-all duration-500 ${isNewGroup ? `bg-${cTheme}-50 border-${cTheme}-300 shadow-md scale-[1.02] animate-in zoom-in` : 'bg-slate-50 border-slate-200'}`}>
                                  <span className={`text-${cTheme}-600 font-black uppercase tracking-widest mr-2`}>SCC {idx + 1}:</span>
                                  <span className="text-slate-400 font-sans text-sm">{"{"}</span>
                                  {group.map((node, mIdx) => (
                                      <React.Fragment key={`scc-n-${idx}-${mIdx}`}>
                                          <span className={`text-${cTheme}-700 font-bold px-1.5 py-0.5 bg-${cTheme}-100 rounded`}>{node}</span>
                                          {mIdx < group.length - 1 && <span className="text-slate-400">,</span>}
                                      </React.Fragment>
                                  ))}
                                  <span className="text-slate-400 font-sans text-sm">{"}"}</span>
                              </div>
                          )
                      })
                  )}
              </div>
          </div>

          {/* Visited Array Status (Inline) */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Visited Array (vis)</span>
              <div className="flex flex-wrap gap-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  {st.vis === undefined ? <span className="text-slate-300 font-mono italic text-xs">Awaiting Init...</span> : st.vis.map((val: number, idx: number) => {
                      let isChecking = st.checkNode === idx;
                      return (
                          <div key={`vis-${idx}`} className="flex flex-col items-center gap-0.5 group">
                              <span className={`text-[8px] font-black font-mono ${isChecking ? 'text-amber-500' : 'text-slate-400'}`}>{idx}</span>
                              <div className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold rounded transition-colors ${val === 1 ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'} ${isChecking ? 'ring-2 ring-amber-400 scale-110 z-10 relative' : ''}`}>
                                  {val}
                              </div>
                          </div>
                      )
                  })}
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500 text-white`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>Kosaraju's 3-Phase SCC</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><RefreshCcw size={28}/> Kosaraju's Algorithm</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Kosaraju's Algorithm is a masterful graph theory approach to finding all <strong>Strongly Connected Components (SCCs)</strong> in a Directed Graph. An SCC is a sub-graph where every node can reach every other node within that sub-graph.</p>
                        <p>It mathematically guarantees finding these components using three highly optimized linear $O(V+E)$ phases:</p>
                        <ul className="list-decimal pl-6 space-y-3 mt-4 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                            <li><strong>Phase 1 (Sorting by Finish Time):</strong> We perform a standard DFS on the original graph. Crucially, when a node has *completely finished* exploring all its neighbors, we push it onto a <strong>Stack</strong>. This ensures nodes that belong to "source" SCCs end up at the top of the stack!</li>
                            <li><strong>Phase 2 (Graph Transpose):</strong> We physically reverse the direction of every single edge in the graph. Why? Because if we reverse the edges, the SCCs internally remain fully connected, but the bridges *between* different SCCs are flipped, preventing our next DFS from leaking into other components!</li>
                            <li><strong>Phase 3 (Extraction):</strong> We pop nodes from the top of the Stack. If the node is unvisited, we launch a second DFS using the <em>Transposed Graph</em>. This DFS will perfectly trap itself within the boundaries of a single SCC, allowing us to extract and count them!</li>
                        </ul>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Tri-Cycle</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 5<br/><strong>Directed Edges:</strong> 0,2 | 2,1 | 1,0 | 0,3 | 3,4</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">3 SCCs</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Nodes 0, 1, and 2 form a continuous triangle loop (SCC 1). Node 0 bridges out to Node 3 (SCC 2), which bridges to Node 4 (SCC 3). Because 3 and 4 cannot travel backwards to 0, they are isolated SCCs.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 3: Acyclic Flow</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 4<br/><strong>Directed Edges:</strong> 0,1 | 1,2 | 2,3</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">4 SCCs</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">A straight line graph has no cycles. Therefore, every individual node is its own Strongly Connected Component! The Stack logic handles this perfectly.</span>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>V (Vertices)</label>
                            <input type="number" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Directed Edges [u-&gt;v] (separated by |)</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-12 flex flex-col lg:flex-row gap-4 w-full pb-8">
                <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 p-5 shadow-2xl shrink-0">
                    {renderRightSidebar()}
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Kosaraju's 3-Phase approach to Directed Connectivity.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-fuchsia-500"/> Phase 1: Finishing Time via Stack</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In a directed graph, if SCC <em>A</em> points to SCC <em>B</em>, we cannot run a DFS from <em>A</em> to count components because it will illegally leak into <em>B</em>! We need to process <em>B</em> first. By running a standard DFS and pushing nodes to a Stack only <strong>after all their children are visited</strong>, we mathematically guarantee that "sink" components are pushed first, and "source" components end up at the top of the stack!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-amber-500"/> Phase 2: The Graph Transpose</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we pop the Stack now and run DFS, it would still leak. Kosaraju's genius lies here: we <strong>reverse all the directed edges</strong>. Because an SCC is internally fully connected, reversing its edges keeps it perfectly connected! However, the bridge from <em>A</em> &rarr; <em>B</em> is reversed to <em>B</em> &rarr; <em>A</em>. Now, if we pop from the Stack (starting at source <em>A</em>), it can no longer travel down the bridge to <em>B</em>! The DFS is perfectly trapped within the SCC boundary.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>The algorithm is remarkably fast despite having three phases. Phase 1 (DFS) visits every node and edge once: $O(V+E)$. Phase 2 iterates through the adjacency list to build the reversed graph: $O(V+E)$. Phase 3 (DFS on adjT) visits every node and edge exactly once again: $O(V+E)$. This yields a strictly linear total time complexity.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>We store the original graph `adj` $O(V+E)$ and allocate an entirely new transposed graph `adjT` $O(V+E)$. The Stack and Visited arrays take $O(V)$. Thus, the algorithm requires linear auxiliary space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Kosaraju's is conceptually simpler to teach, but Tarjan's algorithm is practically faster as it does it in one pass. Be ready to compare them."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can we find SCCs without reversing the entire graph?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, by using Tarjan's Algorithm."</p>
                            <p>Kosaraju's requires an extra $O(V+E)$ space overhead to store the transposed graph `adjT` and three separate passes. Tarjan's Algorithm finds SCCs in a single DFS pass by tracking 'discovery times' and 'lowest reachable nodes' via back-edges. Tarjan's is practically faster due to cache locality and skipping the transpose, but Kosaraju's logic is conceptually easier to grasp."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What happens in Phase 3 if we don't check `vis[node] == 0` before calling DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would wildly over-count the SCCs."</p>
                            <p>The Stack contains EVERY single node in the graph. When we pop a root node and call DFS3, it visits every node inside that SCC and marks them `vis=1`. When those child nodes are eventually popped from the Stack later, the `vis == 0` check prevents us from launching a redundant DFS and artificially inflating our `scc` counter!"</p>
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
                          <input type="number" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-3`}>Directed Edges [u-&gt;v]:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
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
              </div>

              {/* RIGHT SIDEBAR (Full Height in Fullscreen) */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
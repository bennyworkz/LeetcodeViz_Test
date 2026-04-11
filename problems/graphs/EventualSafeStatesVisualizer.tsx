import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  eventualSafeStates: {
    id: 'eventualSafeStates',
    title: 'Find Eventual Safe States (DFS)',
    icon: <ShieldCheck size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'emerald',
    code: `class Solution {
    private boolean dfsCheck(int node, int[][] graph, int vis[], int pathVis[], int check[]) {
        vis[node] = 1;
        pathVis[node] = 1;
        check[node] = 0;
        
        for(int it : graph[node]) {
            if(vis[it] == 0) {
                if(dfsCheck(it, graph, vis, pathVis, check) == true)
                    return true;
            }
            else if(pathVis[it] == 1) {
                return true;
            }
        }
        
        pathVis[node] = 0;
        check[node] = 1;
        return false;
    }

    public List<Integer> eventualSafeNodes(int[][] graph) {
        int V = graph.length;
        int vis[] = new int[V];
        int pathVis[] = new int[V];
        int check[] = new int[V];

        for(int i = 0; i < V; i++) {
            if(vis[i] == 0) {
                dfsCheck(i, graph, vis, pathVis, check);
            }
        }
        
        List<Integer> safeNodes = new ArrayList<>();
        for(int i = 0; i < V; i++) {
            if(check[i] == 1) {
                safeNodes.add(i);
            }
        }
        return safeNodes;
    }
}`,
    desc: "A node is a safe node if every possible path starting from that node leads to a terminal node (or another safe node). Essentially, a safe node is ANY node that does NOT lead into a cycle! We use DFS with cycle detection (tracking the active path with 'pathVis'). If a path safely completes without hitting a cycle, we permanently mark it safe using a 'check' array."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|return|if|else|new|for|while|dfsCheck|eventualSafeNodes|node|it|graph|vis|pathVis|check|safeNodes|V|get|List|ArrayList|Integer)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List'].includes(part);
            const isPointer = ['graph', 'vis', 'pathVis', 'check', 'safeNodes', 'node', 'it', 'V', 'i'].includes(part);
            const isMapCall = ['dfsCheck', 'eventualSafeNodes', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"');
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-teal-400 font-bold' : 
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

export default function EventualSafeStatesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('eventualSafeStates');
  
  // Default: LeetCode Example 1
  // Graph: [[1,2],[2,3],[5],[0],[5],[],[]]
  const [adjInput, setAdjInput] = useState('1, 2 | 2, 3 | 5 | 0 | 5 | | ');

  const [baseAdj, setBaseAdj] = useState<number[][]>([
      [1, 2],
      [2, 3],
      [5],
      [0],
      [5],
      [],
      []
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = adjInput.split('|').map(r => r.trim());
        let parsed: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") {
                parsed.push([]);
                continue;
            }
            let neighbors = rows[i].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
            parsed.push(neighbors);
        }
        
        if (parsed.length === 0) parsed = [[1, 2], [2, 3], [5], [0], [5], [], []];
        if (parsed.length > 20) parsed = parsed.slice(0, 20);

        // Filter out out-of-bounds neighbors
        const V = parsed.length;
        for (let i = 0; i < V; i++) {
            parsed[i] = parsed[i].filter(n => n < V);
            parsed[i].sort((a, b) => a - b);
        }

        // STRICTLY DIRECTED: We DO NOT mirror edges. `adj[i]` simply contains directed outgoing edges.

        setBaseAdj(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [adjInput]);

  // Robust Auto-scroll effect specifically targeting exact active line
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
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone1D = (arr: any[]) => [...arr];

  // --- Graph Layout Mathematics ---
  const V = baseAdj.length;
  // Expansive radius utilizing the unconstrained space
  const graphRadius = Math.max(160, V * 30);
  const svgSize = graphRadius * 2 + 120; // 60px padding on all sides

  // Circle Layout
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(V).fill({x: 0, y: 0});
    if (V === 0) return pos;
    if (V === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < V; i++) {
        // Start from top (-Math.PI/2) and space evenly
        const angle = (i / V) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseAdj, graphRadius, V]);

  // Generate trace strictly aligned with exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const V = adj.length;
    if (V === 0) return steps;

    let vis: number[] = Array(V).fill(0);
    let pathVis: number[] = Array(V).fill(0);
    let checkArr: number[] = Array(V).fill(0);
    let safeNodesList: number[] = [];
    let collisionData = {};
    const stack: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, stack: [...stack], vis: clone1D(vis), pathVis: clone1D(pathVis), checkArr: clone1D(checkArr), safeNodesList: [...safeNodesList], ...stateObj } 
    });

    add("Function Call", `public List<Integer> eventualSafeNodes(int[][] graph)\nInitiating algorithm across ${V} total nodes.`, 22, { phase: 'init' });
    
    add("Get Dimensions", `int V = graph.length;\nNumber of vertices is ${V}.`, 23, { phase: 'init_ds' });
    add("Init Visited", `int vis[] = new int[V];\nAllocated visited array.`, 24, { phase: 'init_ds' });
    add("Init Path Visited", `int pathVis[] = new int[V];\nAllocated pathVis array to track recursion depth.`, 25, { phase: 'init_ds' });
    add("Init Check Array", `int check[] = new int[V];\nAllocated check array to permanently mark Safe Nodes.`, 26, { phase: 'init_ds' });

    const runDFS = (node: number): boolean => {
        stack.push(node);
        add("DFS Enter", `private boolean dfsCheck(int node=${node}, ...)\nEntering deep recursion for node ${node}.`, 2, { phase: 'dfs_enter', activeNode: node, scanI: stack[0] });
        
        vis[node] = 1;
        add("Mark Visited", `vis[node] = 1;\nMarking active node ${node} as globally visited.`, 3, { phase: 'mark_vis', activeNode: node, scanI: stack[0] });

        pathVis[node] = 1;
        add("Mark Path", `pathVis[node] = 1;\nMarking node ${node} as currently active in our recursive path.`, 4, { phase: 'mark_path', activeNode: node, scanI: stack[0] });

        checkArr[node] = 0;
        add("Initialize Check", `check[node] = 0;\nNode ${node} is unverified. Assuming unsafe (0) until proven otherwise.`, 5, { phase: 'mark_check_init', activeNode: node, scanI: stack[0] });

        add("Neighbor Loop", `for(int it : graph[node])\nIterating all outgoing directional edges for node ${node}.`, 7, { phase: 'for_adj', activeNode: node, scanI: stack[0] });

        for (let it of adj[node]) {
            add("Check Unvisited", `if(vis[it] == 0)\nIs target neighbor ${it} completely unvisited?`, 8, { phase: 'check_adj', activeNode: node, checkNode: it, scanI: stack[0] });

            if (vis[it] === 0) {
                add("Recursive DFS", `if(dfsCheck(it, graph, vis, pathVis, check) == true)\nNeighbor ${it} is unvisited. Plunging deeper into the graph!`, 9, { phase: 'call_dfs', activeNode: node, checkNode: it, scanI: stack[0] });
                
                if (runDFS(it) === true) {
                    add("Propagate Cycle", `return true;\nCycle bubbled up from recursion! Node ${node} leads to a cycle. It is NOT safe.`, 10, { phase: 'return_true_rec', activeNode: node, checkNode: it, scanI: stack[0], ...collisionData });
                    return true;
                }
                
                add("DFS Backtrack", `Returned safely to node ${node} after fully exploring neighbor ${it}.`, 7, { phase: 'dfs_backtrack', activeNode: node, checkNode: it, scanI: stack[0] });
                
            } else {
                add("Check Path Collision", `else if(pathVis[it] == 1)\nNeighbor ${it} is visited. But is it currently active on our current path (pathVis=1)?`, 12, { phase: 'check_collision', activeNode: node, checkNode: it, scanI: stack[0] });

                if (pathVis[it] === 1) {
                    collisionData = { activeNode: node, checkNode: it, failNode: it };
                    add("CYCLE DETECTED!", `return true;\nNeighbor ${it} is already in pathVis! This means we followed the arrows and looped back onto our exact path. A cycle exists! Node ${node} is unsafe!`, 13, { phase: 'collision', scanI: stack[0], ...collisionData });
                    return true;
                } else {
                    add("Safe Cross-Edge", `pathVis[${it}] is 0. We visited node ${it} previously and it didn't cause a cycle. This is a safe path. Ignoring.`, 12, { phase: 'safe_adj', activeNode: node, checkNode: it, scanI: stack[0] });
                }
            }
        }

        pathVis[node] = 0;
        add("Unmark Path", `pathVis[node] = 0;\nFinished exploring all outward edges from ${node} without any cycles. Removing it from the active pathVis track.`, 17, { phase: 'unmark_path', activeNode: node, scanI: stack[0] });

        checkArr[node] = 1;
        add("Mark Safe", `check[node] = 1;\nBecause node ${node} never led to a cycle, it is mathematically proven to be a SAFE NODE! Marking check as 1.`, 18, { phase: 'mark_safe', activeNode: node, scanI: stack[0] });

        stack.pop();
        add("DFS Safe Return", `return false;\nPopping from stack.`, 19, { phase: 'dfs_exit', activeNode: node, scanI: stack[0] || 0 });
        return false;
    };

    for (let i = 0; i < V; i++) {
        add("Outer Scan Loop", `for(int i = 0; i < V; i++)\nIterating to ensure all disconnected components are evaluated. Node ${i}.`, 28, { phase: 'scan', scanI: i });
        add("Check Root Visited", `if(vis[i] == 0)\nIs component root node ${i} unvisited?`, 29, { phase: 'check_grid', scanI: i });

        if (vis[i] === 0) {
            add("Trigger DFS", `dfsCheck(i, graph, vis, pathVis, check);\nRoot node ${i} is unvisited. Launching DFS check subroutine!`, 30, { phase: 'trigger_dfs', scanI: i });
            runDFS(i);
        } else {
            add("Skip Visited Root", `Node ${i} was already evaluated in a previous traversal. Skipping.`, 29, { phase: 'skip_scan', scanI: i });
        }
    }

    add("Init Safe List", `List<Integer> safeNodes = new ArrayList<>();\nAll nodes evaluated. Creating a list to hold the safely verified states.`, 34, { phase: 'init_safe_list' });

    for (let i = 0; i < V; i++) {
        add("Collection Loop", `for(int i = 0; i < V; i++)\nChecking node ${i}'s safety status.`, 35, { phase: 'collect_scan', scanI: i });
        add("Verify Check Array", `if(check[i] == 1)\nDid node ${i} survive the cycle checks?`, 36, { phase: 'verify_check', scanI: i });

        if (checkArr[i] === 1) {
            safeNodesList.push(i);
            add("Add to Safe Nodes", `safeNodes.add(i);\nNode ${i} is safe! Added to the final sorted list.`, 37, { phase: 'add_safe', scanI: i });
        } else {
            add("Skip Unsafe Node", `Node ${i} is part of or leads to a cycle (check=0). Excluded.`, 36, { phase: 'skip_unsafe', scanI: i });
        }
    }

    add("Final Return", `return safeNodes;\nAlgorithm complete. Returning the final verified safe nodes.`, 40, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseAdj]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.85); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  // --- Segregated Render Blocks for Clean Layout ---

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-emerald-900 border-emerald-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><ShieldCheck size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                    <CheckCircle2 size={24}/> SAFE STATES COLLECTED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm perfectly segregated terminal paths from cycle traps.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('dfs_enter') || String(st.phase || '').includes('mark_safe') || String(st.phase || '') === 'add_safe' ? 'text-emerald-400' : (String(st.phase || '').includes('collision') || String(st.phase || '').includes('true') || String(st.phase || '') === 'skip_unsafe' ? 'text-rose-500' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('scan') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-start justify-center gap-4 xl:gap-8 w-full p-4 overflow-x-auto">
          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><CheckSquare2 size={12}/> vis[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[240px]">
                  {(st.vis || []).map((val: number, idx: number) => {
                      let isNewlyMarked = (st.phase === 'mark_vis') && (st.activeNode === idx);
                      let boxBg = val === 1 ? "bg-slate-700 text-white border-slate-800 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                      if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-slate-400 animate-in zoom-in";

                      return (
                          <div key={`vis-${idx}`} className="flex flex-col items-center">
                              <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{idx}</span>
                              <div className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                  {val}
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2"><ArrowDownToLine size={12}/> pathVis[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[240px]">
                  {(st.pathVis || []).map((val: number, idx: number) => {
                      let isNewlyMarked = (st.phase === 'mark_path') && (st.activeNode === idx);
                      let isUnmarked = (st.phase === 'unmark_path') && (st.activeNode === idx);
                      
                      let boxBg = val === 1 ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                      if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-amber-300 animate-in zoom-in";
                      if (isUnmarked) boxBg += " scale-90 opacity-70 animate-in fade-in";

                      return (
                          <div key={`pvis-${idx}`} className="flex flex-col items-center">
                              <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{idx}</span>
                              <div className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                  {val}
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ShieldCheck size={12}/> check[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[240px]">
                  {(st.checkArr || []).map((val: number, idx: number) => {
                      let isNewlyMarked = (st.phase === 'mark_safe') && (st.activeNode === idx);
                      let isCheckedInit = (st.phase === 'mark_check_init') && (st.activeNode === idx);
                      let isVerifying = (st.phase === 'verify_check') && (st.scanI === idx);
                      
                      let boxBg = val === 1 ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                      if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in";
                      if (isCheckedInit) boxBg += " scale-90 ring-2 ring-slate-300 animate-in zoom-in";
                      if (isVerifying && val === 1) boxBg += " ring-2 ring-emerald-400 scale-110";
                      if (isVerifying && val === 0) boxBg += " bg-rose-100 border-rose-200 text-rose-400 ring-2 ring-rose-300 scale-110";

                      return (
                          <div key={`carr-${idx}`} className="flex flex-col items-center">
                              <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{idx}</span>
                              <div className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                  {val}
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          {/* Adjacency List Component */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (Directed)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-1 relative overflow-y-auto scrollbar-thin">
                  {(st.adj || []).map((neighbors: number[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;
                      let isScanRow = st.scanI === nodeIdx && String(st.phase || '').includes('scan');
                      let highlightRow = isActiveRow || isScanRow;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-fuchsia-50 border border-fuchsia-200 shadow-sm' : (isScanRow ? 'bg-emerald-50 border border-emerald-200' : 'bg-transparent border border-transparent')}`}>
                              <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-fuchsia-500 text-white shadow-sm' : (isScanRow ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={isActiveRow ? 'text-fuchsia-400' : (isScanRow ? 'text-emerald-400' : 'text-slate-300')} />
                              <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                  {neighbors.map((neighbor: number, nIdx: number) => {
                                      let isChecking = isActiveRow && st.checkNode === neighbor;
                                      let isCollision = String(st.phase || '').includes('collision') && isChecking;

                                      let neighborBg = 'transparent';
                                      let neighborText = highlightRow ? 'text-fuchsia-700' : 'text-slate-500';

                                      if (isCollision) {
                                          neighborBg = 'bg-rose-500';
                                          neighborText = 'text-white shadow-sm';
                                      } else if (isChecking) {
                                          neighborBg = 'bg-sky-400';
                                          neighborText = 'text-white shadow-sm';
                                      }

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md transition-colors ${neighborBg} ${neighborText}`}>
                                                  {neighbor}
                                              </span>
                                              {nIdx < neighbors.length - 1 && <span className="text-slate-300 font-mono text-xs">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 font-mono text-sm">{'}'}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Call Stack Component */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Layers size={12}/> Call Stack</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>TOP (CURRENT)</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 transition-all duration-500">
                      {[...(st.stack || [])].reverse().map((val: number, i: number) => {
                          let isTop = i === 0;
                          let isEntering = isTop && st.phase === 'dfs_enter';
                          
                          return (
                              <div key={`stack-${i}-${val}`} className={`px-4 py-2 flex items-center justify-between font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-fuchsia-600 border-fuchsia-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-500')}`}>
                                  <span className="text-xs">dfsCheck({val})</span>
                                  {isTop && <Activity size={12} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                              </div>
                          )
                      })}
                      {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Stack is empty</span>}
                  </div>
              </div>
          </div>
          
          {/* Output List Component */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListChecks size={12}/> List&lt;Integer&gt; safeNodes</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[60px]">
                  <div className="flex flex-wrap gap-2 items-center">
                     <span className="text-slate-400 font-mono text-xl">[</span>
                     {(st.safeNodesList || []).map((val: number, idx: number) => {
                         let isNew = st.phase === 'add_safe' && idx === st.safeNodesList.length - 1;
                         return (
                             <span key={`sn-${idx}`} className={`font-mono font-black text-sm px-2 py-1 rounded-lg border-2 transition-all ${isNew ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-110 animate-in zoom-in' : 'bg-slate-100 text-emerald-700 border-slate-200 shadow-sm'}`}>{val}</span>
                         )
                     })}
                     <span className="text-slate-400 font-mono text-xl">]</span>
                     {st.safeNodesList && st.safeNodesList.length === 0 && <span className="text-slate-300 font-mono italic text-xs">Empty list...</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">V:</span>
                          <span className="font-bold text-slate-700">{st.V !== undefined ? st.V : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">i (scan):</span>
                          <span className="font-bold text-slate-700">{st.scanI !== undefined ? st.scanI : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">node (Active):</span>
                          <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-sky-500">it (Target):</span>
                          <span className="font-bold text-sky-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">Collision:</span>
                          <span className="font-bold text-rose-700">{st.failNode !== undefined ? st.failNode : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderMainGraphCanvas = () => {
      if (st.adj === undefined) return null;
      const renderedEdges = new Set<string>();

      return (
          <div className="absolute inset-0 w-full h-full transition-transform duration-300 flex flex-col justify-center items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
              <div style={{ width: svgSize, height: svgSize }} className="relative origin-center">
                  
                  {/* Edges Layer */}
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return st.adj.map((neighbors: number[], u: number) => (
                              neighbors.map((v: number) => {
                                  const edgeKey = `${u}-${v}`;
                                  if (renderedEdges.has(edgeKey)) return null;
                                  renderedEdges.add(edgeKey);
  
                                  const p1 = nodePositions[u];
                                  const p2 = nodePositions[v];
                                  if (!p1 || !p2) return null;

                                  // Calculate where the line should exactly hit the outer boundary of the node
                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const angle = Math.atan2(dy, dx);
                                  
                                  const rOffset = 26; // Node radius (w-12 -> 48px -> radius 24) + small padding
                                  const startX = p1.x + rOffset * Math.cos(angle);
                                  const startY = p1.y + rOffset * Math.sin(angle);
                                  const targetX = p2.x - rOffset * Math.cos(angle);
                                  const targetY = p2.y - rOffset * Math.sin(angle);
  
                                  let isChecking = st.activeNode === u && st.checkNode === v;
                                  let isCollision = String(st.phase || '').includes('collision') && isChecking;
  
                                  let strokeColor = "#cbd5e1"; // slate-300
                                  let strokeWidth = "3";
                                  let animClass = "";
  
                                  if (isCollision) {
                                      strokeColor = "#f43f5e"; // rose-500
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                  } else if (isChecking) {
                                      strokeColor = "#0ea5e9"; // sky-500
                                      strokeWidth = "4";
                                  } else if (st.checkArr && st.checkArr[u] === 1 && st.checkArr[v] === 1) {
                                      // Both safe, highlight safe edge path
                                      strokeColor = "#34d399"; // emerald-400
                                      strokeWidth = "3";
                                  }

                                  // Explicit arrow head drawing (avoids SVG <marker> bugs)
                                  const arrowSize = isCollision ? 16 : 14;
                                  const arrowAngle = Math.PI / 6; // 30 degrees
                                  const arrowP1 = `${targetX},${targetY}`;
                                  const arrowP2 = `${targetX - arrowSize * Math.cos(angle - arrowAngle)},${targetY - arrowSize * Math.sin(angle - arrowAngle)}`;
                                  const arrowP3 = `${targetX - arrowSize * Math.cos(angle + arrowAngle)},${targetY - arrowSize * Math.sin(angle + arrowAngle)}`;
  
                                  return (
                                      <g key={edgeKey} className={`transition-all duration-300 ${animClass}`}>
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                          />
                                          <polygon 
                                              points={`${arrowP1} ${arrowP2} ${arrowP3}`} 
                                              fill={strokeColor} 
                                          />
                                      </g>
                                  );
                              })
                          ));
                      })()}
                  </svg>

                  {/* Nodes Layer - Centered exactly on the coordinate space */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {nodePositions.map((pos, idx) => {
                        let isVisited = st.vis[idx] === 1;
                        let isPathVis = st.pathVis[idx] === 1;
                        let isSafe = st.checkArr[idx] === 1;
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        
                        let isFailNode = st.failNode === idx || (String(st.phase || '').includes('collision') && (st.activeNode === idx || st.checkNode === idx));
                        // If visited, but NOT safe, and not currently pathVis, it led to a cycle previously. Danger node!
                        let isDeadEnd = isVisited && !isPathVis && !isSafe && !isActive;

                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isFailNode) {
                            bgClass = 'bg-rose-500 text-white border-rose-600 shadow-xl';
                        } else if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isSafe) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg';
                        } else if (isPathVis) {
                            bgClass = 'bg-amber-500 text-white border-amber-600 shadow-lg';
                        } else if (isDeadEnd) {
                            bgClass = 'bg-slate-700 text-white border-slate-800 shadow-inner opacity-70';
                        } else if (isVisited) {
                            bgClass = 'bg-slate-200 text-slate-600 border-slate-300 shadow-sm';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isFailNode) {
                            ringClass = 'ring-4 ring-rose-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActive) {
                            ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isChecking) {
                            ringClass = 'ring-4 ring-sky-400 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        } else if (isSafe) {
                            ringClass = 'ring-2 ring-emerald-300 border-transparent';
                        }

                        return (
                            <div 
                                key={`node-${idx}`}
                                className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-lg rounded-full transition-colors duration-300 border-2 select-none ${bgClass} ${ringClass} ${zIndex}`}
                                style={{ 
                                    left: `${pos.x}px`, 
                                    top: `${pos.y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {idx}
                                {isSafe && !isActive && <span className="absolute -top-6 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black border border-emerald-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Safe</span>}
                                {isDeadEnd && !isActive && <span className="absolute -top-6 text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-black border border-slate-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Unsafe</span>}
                                {isPathVis && !isActive && <span className="absolute -top-6 text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-black border border-amber-200 shadow-sm uppercase tracking-widest whitespace-nowrap">In Path</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Algorithm
                  </span>
                  <span>•</span>
                  <span>Cycle & Safe State Detection</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><ShieldCheck size={28}/> Isolating Terminal and Safe Nodes</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There is a directed graph of <code>n</code> nodes with each node labeled from <code>0</code> to <code>n - 1</code>. A node is a <strong>terminal node</strong> if there are no outgoing edges. A node is a <strong>safe node</strong> if every possible path starting from that node leads to a terminal node (or another safe node).</p>
                        <p>Return an array containing all the safe nodes of the graph. The answer should be sorted in ascending order.</p>
                        <p>To solve this, we can rely on Directed Cycle Detection using DFS. Any node that is part of a cycle, or leads to a cycle, is <em>unsafe</em>. If a DFS path terminates without ever hitting a cycle, all nodes on that specific path are <em>safe</em>!</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> graph = [[1,2],[2,3],[5],[0],[5],[],[]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[2,4,5,6]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           Nodes 5 and 6 are terminal nodes as there are no outgoing edges from either of them.<br/>
                           Every path starting at nodes 2, 4, 5, and 6 all lead to either node 5 or 6.<br/>
                           Nodes 0, 1, and 3 are stuck in a cycle (0 &rarr; 1 &rarr; 3 &rarr; 0), so they are unsafe.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowDownToLine size={16}/> 1. Assume Unsafe</span>
                            <p className="text-sm text-slate-500">As we traverse the graph using DFS, we mark the node as visited (<code>vis = 1</code>) and add it to our current path tracking (<code>pathVis = 1</code>). Crucially, we also mark it as unsafe in a new <code>check[]</code> array (<code>check = 0</code>).</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ShieldCheck size={16}/> 2. Validate Safety</span>
                            <p className="text-sm text-slate-500">If the DFS explores all children and eventually backtracks without EVER hitting a <code>pathVis = 1</code> collision, then this node is verified safe! We unmark <code>pathVis</code> and permanently set <code>check[node] = 1</code>.</p>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Split Screen Normal Mode */}
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                {renderTraceOperationsBox()}
                
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[300px] max-h-[500px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="grid grid-cols-1 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Directed Adjacency List (Use | to separate nodes 0 to V-1)</label>
                            <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2 | 2, 3 | 5 | 0 | 5 | | " />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                {/* Unified Sub-layout for Normal Mode ensuring no overlapping */}
                <div className="flex flex-col xl:flex-row gap-4 h-[700px]">
                    
                    {/* Main Canvas + Bottom Arrays Container */}
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Eventual Safe States Visualizer</span>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <div className="flex bg-white/90 p-1.5 rounded-xl shadow-md border border-slate-200 backdrop-blur gap-1">
                                <button onClick={zoomIn} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={16}/></button>
                                <button onClick={zoomOut} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={16}/></button>
                            </div>
                        </div>

                        {/* Unbounded Graph Area */}
                        <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            {renderMainGraphCanvas()}
                        </div>

                        {/* Safe Bottom Dock for Arrays */}
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>

                    {/* Right Panel for Sidebars */}
                    <div className="w-full xl:w-[300px] bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-4 overflow-y-auto">
                        {renderRightSidebar()}
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how to mathematically isolate safe paths from cycle traps using three independent states.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-rose-500"/> Why Nodes are Unsafe</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If a node is part of a cycle, it can never reach a terminal node because it gets stuck in an infinite loop. Even worse, if a node <em>leads</em> into a cycle (even if it's not part of the cycle itself), it is also considered unsafe because its path guarantees an infinite loop. We must find and permanently mark these danger zones.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-amber-500"/> The check[] Solution</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The <code>pathVis[]</code> array acts as a live snapshot of our Call Stack to catch active cycles. But once DFS completes and proves a node didn't hit any cycles, we need to permanently record that victory so future DFS traversals don't waste time re-checking it. That is what the <code>check[]</code> array does. If a node finishes its DFS successfully, <code>check[node] = 1</code>. It is now definitively safe.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>Every node V is checked and painted exactly once. Once colored, we iterate its adjacency list. The total iterations over all adjacency lists equals exactly the number of directed edges E. The final list collection is an O(V) loop. The overall operation is linearly bound by O(V + E).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The <code>vis[]</code>, <code>pathVis[]</code>, and <code>check[]</code> arrays statically take O(V) space each. The DFS Call Stack, in the absolute worst-case scenario (a long linear chain), could hold V elements simultaneously. Thus, total Space Complexity is safely bounded by O(V).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Eventual Safe States is a fantastic graph traversal question because it can be solved with both DFS (Cycle Detection) and BFS (Kahn's Algorithm). You should know both!"</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you optimize this DFS space complexity?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, by combining arrays into one state map."</p>
                            <p>Instead of <code>vis</code>, <code>pathVis</code>, and <code>check</code>, we can use a single <code>int[] state</code> array. <code>0</code> = Unvisited. <code>1</code> = Visiting (currently in path). <code>2</code> = Safe (verified terminal path). <code>3</code> = Unsafe (part of a cycle). This reduces space from 3N to N."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "How would you solve this using BFS (Topological Sort)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Using a Reversed Graph with Kahn's Algorithm."</p>
                            <p>In standard Kahn's, we push nodes with In-Degree 0. But for this problem, we care about nodes with OUT-Degree 0 (terminals). So, we physically reverse all edges in the graph. Then, terminal nodes become In-Degree 0. We push them to the Queue and run standard Kahn's. Any node processed by the queue is safe. Any node left behind was trapped in a cycle!"</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* FIXED LEFT SIDEBAR: Trace Top, Code Bottom */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Pinned Trace Box */}
                  {renderTraceOperationsBox()}

                  {/* Auto-scrolling Source Code */}
                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* CENTER CANVAS AREA - No Overlaps! */}
              <div className="flex-1 relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl z-30">
                  
                  {/* Top Bar inside Center */}
                  <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between z-20 shrink-0">
                      <div className="flex items-center gap-4 w-full max-w-2xl">
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>Directed Adjacency List</label>
                          <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, 2 | 2, 3 | 5 | 0 | 5 | | " />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={handleReset} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  {/* Pure Infinite Graph Space */}
                  <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      {renderMainGraphCanvas()}
                      
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

                  {/* Safely Docked State Arrays */}
                  <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                      {renderStateArrays()}
                  </div>
              </div>

              {/* RIGHT SIDEBAR - Adjacency, Stack & Variables safely separated */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}
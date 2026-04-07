import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  directedCycleDFS: {
    id: 'directedCycleDFS',
    title: 'Directed Graph Cycle (DFS)',
    icon: <Repeat size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'rose',
    code: `class Solution {
    private boolean dfsCheck(int node, ArrayList<ArrayList<Integer>> adj, int vis[], int pathVis[]) {
        vis[node] = 1;
        pathVis[node] = 1;
        
        for(int it : adj.get(node)) {
            if(vis[it] == 0) {
                if(dfsCheck(it, adj, vis, pathVis) == true)
                    return true;
            }
            else if(pathVis[it] == 1) {
                return true;
            }
        }
        
        pathVis[node] = 0;
        return false;
    }

    public boolean isCyclic(int V, ArrayList<ArrayList<Integer>> adj) {
        int vis[] = new int[V];
        int pathVis[] = new int[V];

        for(int i = 0; i < V; i++) {
            if(vis[i] == 0) {
                if(dfsCheck(i, adj, vis, pathVis) == true) return true;
            }
        }
        return false;
    }
}`,
    desc: "Detecting a cycle in a Directed Graph using Depth-First Search. Because edges are one-way, we cannot simply check if a neighbor is visited. A neighbor might have been visited by a completely different path. We must use a 'pathVis' array to track nodes that are currently active in the exact recursive sequence we are traversing. If we hit a node that is currently marked in 'pathVis', we have looped back on ourselves!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|return|if|else|new|for|while|dfsCheck|isCyclic|node|it|adj|vis|pathVis|V|get|ArrayList|Integer)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList'].includes(part);
            const isPointer = ['adj', 'vis', 'pathVis', 'node', 'it', 'V', 'i'].includes(part);
            const isMapCall = ['dfsCheck', 'isCyclic', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size'].includes(part);
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

export default function DirectedCycleDFSVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('directedCycleDFS');
  
  // Default: Matches the uploaded 10-node whiteboard graph exactly (0-indexed)
  // 0->1, 1->2, 2->3, 2->6, 3->4, 4->5, 5->null, 6->4, 7->1, 7->8, 8->9, 9->7
  const [adjInput, setAdjInput] = useState('1 | 2 | 3, 6 | 4 | 5 | | 4 | 1, 8 | 9 | 7');

  const [baseAdj, setBaseAdj] = useState<number[][]>([
      [1],
      [2],
      [3, 6],
      [4],
      [5],
      [],
      [4],
      [1, 8],
      [9],
      [7]
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
        
        if (parsed.length === 0) parsed = [[1], [2], [3, 6], [4], [5], [], [4], [1, 8], [9], [7]];
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
    let cycleFound = false;
    let collisionData = {};
    const stack: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, stack: [...stack], vis: clone1D(vis), pathVis: clone1D(pathVis), ...stateObj } 
    });

    add("Function Call", `public boolean isCyclic(int V=${V}, ...)\nInitiating check across ${V} total nodes.`, 20, { phase: 'init' });
    
    add("Init Visited", `int vis[] = new int[V];\nAllocated visited array to track components.`, 21, { phase: 'init_ds' });
    add("Init Path Visited", `int pathVis[] = new int[V];\nAllocated pathVis array to track recursion depth.`, 22, { phase: 'init_ds' });

    const runDFS = (node: number): boolean => {
        stack.push(node);
        add("DFS Enter", `private boolean dfsCheck(int node=${node}, ...)\nEntering deep recursion for node ${node}.`, 2, { phase: 'dfs_enter', activeNode: node, scanI: stack[0] });
        
        vis[node] = 1;
        add("Mark Visited", `vis[node] = 1;\nMarking active node ${node} as globally visited.`, 3, { phase: 'mark_vis', activeNode: node, scanI: stack[0] });

        pathVis[node] = 1;
        add("Mark Path", `pathVis[node] = 1;\nMarking node ${node} as currently active in our recursive path.`, 4, { phase: 'mark_path', activeNode: node, scanI: stack[0] });

        add("Neighbor Loop", `for(int it : adj.get(node))\nIterating all outgoing directional edges for node ${node}.`, 6, { phase: 'for_adj', activeNode: node, scanI: stack[0] });

        for (let it of adj[node]) {
            add("Check Unvisited", `if(vis[it] == 0)\nIs target neighbor ${it} completely unvisited?`, 7, { phase: 'check_adj', activeNode: node, checkNode: it, scanI: stack[0] });

            if (vis[it] === 0) {
                add("Recursive DFS", `if(dfsCheck(it, adj, vis, pathVis) == true)\nNeighbor ${it} is unvisited. Plunging deeper into the graph!`, 8, { phase: 'call_dfs', activeNode: node, checkNode: it, scanI: stack[0] });
                
                if (runDFS(it) === true) {
                    add("Propagate Failure", `return true;\nCycle bubbled up from recursion. Passing true upwards.`, 9, { phase: 'return_true_rec', activeNode: node, checkNode: it, scanI: stack[0], ...collisionData });
                    return true;
                }
                
                add("DFS Backtrack", `Returned safely to node ${node} after fully exploring neighbor ${it}.`, 6, { phase: 'dfs_backtrack', activeNode: node, checkNode: it, scanI: stack[0] });
                
            } else {
                add("Check Path Collision", `else if(pathVis[it] == 1)\nNeighbor ${it} is visited. But is it currently active on our current path (pathVis=1)?`, 11, { phase: 'check_collision', activeNode: node, checkNode: it, scanI: stack[0] });

                if (pathVis[it] === 1) {
                    cycleFound = true;
                    collisionData = { activeNode: node, checkNode: it, failNode: it };
                    add("CYCLE DETECTED!", `return true;\nNeighbor ${it} is already in pathVis! This means we followed the arrows and looped back onto our exact path. A cycle exists!`, 12, { phase: 'collision', scanI: stack[0], ...collisionData });
                    return true;
                } else {
                    add("Safe Cross-Edge", `pathVis[${it}] is 0. We visited node ${it} via a different path entirely earlier. This is a safe cross-edge. Ignoring.`, 11, { phase: 'safe_adj', activeNode: node, checkNode: it, scanI: stack[0] });
                }
            }
        }

        pathVis[node] = 0;
        add("Unmark Path", `pathVis[node] = 0;\nFinished exploring all outward edges from ${node}. Removing it from the active pathVis track.`, 16, { phase: 'unmark_path', activeNode: node, scanI: stack[0] });

        stack.pop();
        add("DFS Safe Return", `return false;\nNo cycles found down any path originating from ${node}. Popping from stack.`, 17, { phase: 'dfs_exit', activeNode: node, scanI: stack[0] || 0 });
        return false;
    };

    for (let i = 0; i < V; i++) {
        if (cycleFound) break;

        add("Outer Scan Loop", `for(int i = 0; i < V; i++)\nIterating to ensure all disconnected components are evaluated. Node ${i}.`, 24, { phase: 'scan', scanI: i });
        add("Check Root Visited", `if(vis[i] == 0)\nIs component root node ${i} unvisited?`, 25, { phase: 'check_grid', scanI: i });

        if (vis[i] === 0) {
            add("Trigger DFS", `if(dfsCheck(i, adj, vis, pathVis) == true)\nRoot node ${i} is unvisited. Launching DFS check subroutine!`, 26, { phase: 'trigger_dfs', scanI: i });

            if (runDFS(i) === true) {
                add("Main: Propagate Failure", `return true;\nThe DFS sub-routine detected a cycle. Returning true for entire graph.`, 26, { phase: 'return_true_main', isDone: true, isSuccess: false, scanI: i, ...collisionData });
                break;
            }
        } else {
            add("Skip Visited Root", `Node ${i} was already visited in a previous traversal. Skipping.`, 25, { phase: 'skip_scan', scanI: i });
        }
    }

    if (!cycleFound) {
        add("Final Safe Return", `return false;\nAll components mapped perfectly without any forward-looping cycles. Graph is Acyclic!`, 29, { phase: 'done', isDone: true, isSuccess: true });
    }

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Repeat size={100} className="text-white"/></div>
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
                    {st.isSuccess ? "ACYCLIC DIRECTED GRAPH" : "CYCLE DETECTED"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? "No recursion path looped back onto itself." : "A back-edge collided with an actively path-visited node."}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('dfs_enter') || String(st.phase || '').includes('mark') ? 'text-emerald-400' : (String(st.phase || '').includes('collision') || String(st.phase || '').includes('true') ? 'text-rose-500' : (String(st.phase || '').includes('check_adj') || String(st.phase || '').includes('scan') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-start justify-center gap-6 w-full p-4">
          <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><CheckCircle2 size={12}/> vis[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[280px]">
                  {(st.vis || []).map((val: number, idx: number) => {
                      let isNewlyMarked = (st.phase === 'mark_vis') && (st.activeNode === idx);
                      let boxBg = val === 1 ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                      if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-emerald-200 animate-in zoom-in";

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

          <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2"><ArrowDownToLine size={12}/> pathVis[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[280px]">
                  {(st.pathVis || []).map((val: number, idx: number) => {
                      let isNewlyMarked = (st.phase === 'mark_path') && (st.activeNode === idx);
                      let isUnmarked = (st.phase === 'unmark_path') && (st.activeNode === idx);
                      
                      let boxBg = val === 1 ? "bg-amber-400 text-white border-amber-500 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                      if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-amber-200 animate-in zoom-in";
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
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-fuchsia-50 border border-fuchsia-200 shadow-sm' : (isScanRow ? 'bg-indigo-50 border border-indigo-200' : 'bg-transparent border border-transparent')}`}>
                              <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-fuchsia-500 text-white shadow-sm' : (isScanRow ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={isActiveRow ? 'text-fuchsia-400' : (isScanRow ? 'text-indigo-400' : 'text-slate-300')} />
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
                                  let isCollision = (String(st.phase || '').includes('collision') || (st.isDone && !st.isSuccess)) && isChecking;
  
                                  let strokeColor = "#94a3b8"; // slate-400
                                  let strokeWidth = "3";
                                  let animClass = "";
  
                                  if (isCollision) {
                                      strokeColor = "#f43f5e"; // rose-500
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                  } else if (isChecking) {
                                      strokeColor = "#0ea5e9"; // sky-500
                                      strokeWidth = "4";
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
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isFailNode = st.failNode === idx || (String(st.phase || '').includes('collision') && (st.activeNode === idx || st.checkNode === idx));

                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-lg';
                        
                        // State priorities
                        if (isFailNode) {
                            bgClass = 'bg-rose-500 text-white border-rose-600 shadow-xl';
                        } else if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isPathVis) {
                            bgClass = 'bg-amber-400 text-white border-amber-500 shadow-lg';
                        } else if (isVisited) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Do not use transform scales (scale-125) on nodes as it misaligns the strict SVG border arrows.
                        // Instead, highlight strictly using prominent rings.
                        if (isFailNode) {
                            ringClass = 'ring-4 ring-rose-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActive) {
                            ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isChecking) {
                            ringClass = 'ring-4 ring-sky-400 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
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
                  <span>DFS & Path Tracking</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Repeat size={28}/> Hunting for Cycles in Directed Flows</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a Directed Graph, you need to find out whether there exists at least one cycle. A cycle exists if you can start at a node, follow the directional arrows, and return to that same starting node.</p>
                        <p>Because edges are strictly one-way, we cannot simply use a standard <code>vis[]</code> array. A node might be visited by a completely different valid path, creating a false-positive cycle collision.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1 (Cycle Exists):</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> graph = [[1], [2], [3, 6], [4], [5], [], [4], [1, 8], [9], [7]]</span>
                       <span className="text-rose-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">true</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           The graph contains 10 nodes (0 to 9).<br/>
                           Following the directed paths from node 7, we travel: 7 &rarr; 8 &rarr; 9.<br/>
                           However, node 9 has a directed edge pointing back to 7! Because 7 is currently active in the recursive path, a cycle is proven.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowDownToLine size={16}/> 1. Path Tracking (pathVis)</span>
                            <p className="text-sm text-slate-500">We introduce a secondary array: <code>pathVis[]</code>. When we enter a node during DFS, we mark both <code>vis[node] = 1</code> and <code>pathVis[node] = 1</code>. When the DFS fully completes that node without finding a cycle, we backtrack and unmark <code>pathVis[node] = 0</code>.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><AlertTriangle size={16}/> 2. Active Collision Detection</span>
                            <p className="text-sm text-slate-500">If our DFS encounters a neighbor that is already visited (<code>vis == 1</code>), we check <code>pathVis</code>. If <code>pathVis == 1</code>, it means that neighbor is literally an ancestor currently sitting in our Call Stack! The path looped back on itself.</p>
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
                            <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1 | 2 | 3, 6 | 4 | 5 | | 4 | 1, 8 | 9 | 7" />
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
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Directed Cycle Visualizer</span>
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
                    <div className="w-full xl:w-[280px] bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-4 overflow-y-auto">
                        {renderRightSidebar()}
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding why Directed Graphs require a fundamentally different approach than Undirected Graphs for cycle detection.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-rose-500"/> The Undirected Flaw</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In an undirected graph, if you see a visited node that isn't your parent, it's a cycle. But in a <strong>Directed Graph</strong>, cross-edges exist. Consider <code>0 &rarr; 1</code>, <code>0 &rarr; 2</code>, and <code>1 &rarr; 2</code>. The node <code>2</code> will be visited twice. The second time we arrive at <code>2</code>, it is already visited. Is this a cycle? <strong>NO.</strong> Because arrows don't point backward. Standard <code>vis[]</code> tracking will fail here.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-amber-500"/> The pathVis[] Solution</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The <code>pathVis[]</code> array acts as a live snapshot of our Call Stack. A node is only marked <code>1</code> while we are actively exploring its descendants. The moment we finish exploring and backtrack, we reset it to <code>0</code>. A cycle ONLY exists if we hit a node that is currently <code>pathVis == 1</code>, proving we looped back up to an ancestor!</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>Every node V is checked and painted exactly once. Once colored, we iterate its adjacency list. The total iterations over all adjacency lists equals exactly the number of directed edges E. The overall operation is linearly bound by O(V + E).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The <code>vis[]</code> and <code>pathVis[]</code> arrays statically take O(V) space each. The DFS Call Stack, in the absolute worst-case scenario (a long linear chain), could hold V elements simultaneously. Thus, total Space Complexity is safely bounded by O(V).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-rose-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Detecting cycles in a Directed Graph is a crucial concept that separates junior from senior graph implementations. Expect questions comparing DFS to Kahn's Algorithm."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you solve this without using two arrays?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, by combining them into one state array."</p>
                            <p>Instead of <code>vis</code> and <code>pathVis</code>, we can use a single <code>int[] state</code> array. <code>0</code> means Unvisited. <code>1</code> means Actively Visiting (in the current path). <code>2</code> means Completely Visited (safely processed). If we ever encounter a neighbor with state <code>1</code>, a cycle exists."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "How would you solve this using BFS instead of DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Using Kahn's Algorithm (Topological Sort)."</p>
                            <p>In Kahn's Algorithm, we calculate the In-Degree of every node. We push all nodes with In-Degree 0 to a Queue. As we pop them, we reduce the In-Degree of their neighbors. If a graph is completely processed (count == V), it is acyclic. If the queue empties prematurely and count &lt; V, the remaining nodes are trapped in a cycle!"</p>
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
                          <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1 | 2 | 3, 6 | 4 | 5 | | 4 | 1, 8 | 9 | 7" />
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
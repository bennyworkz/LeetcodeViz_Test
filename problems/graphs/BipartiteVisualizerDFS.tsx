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
  bipartiteDFS: {
    id: 'bipartiteDFS',
    title: 'Bipartite Graph (DFS Coloring)',
    icon: <Palette size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'indigo',
    code: `class Solution {
    private boolean dfs(int node, int col, int[] color, ArrayList<ArrayList<Integer>> adj) {
        color[node] = col;
        
        for(int it : adj.get(node)) {
            if(color[it] == -1) {
                if(dfs(it, 1 - col, color, adj) == false) {
                    return false;
                }
            }
            else if(color[it] == col) {
                return false;
            }
        }
        return true;
    }

    public boolean isBipartite(int V, ArrayList<ArrayList<Integer>> adj) {
        int color[] = new int[V];
        for(int i = 0; i < V; i++) color[i] = -1;
        
        for(int i = 0; i < V; i++) {
            if(color[i] == -1) {
                if(dfs(i, 0, color, adj) == false) {
                    return false;
                }
            }
        }
        return true;
    }
}`,
    desc: "A graph is bipartite if its nodes can be colored using exactly 2 colors without any two adjacent nodes sharing the same color. We use Depth-First Search (DFS) to traverse deeply, passing the inverse of the current color down the recursive call stack. If a recursive path ever hits an adjacent node already painted with the SAME color, an odd-length cycle has collided, proving the graph is NOT bipartite."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|return|if|else|new|for|while|dfs|isBipartite|color|col|start|node|it|adj|V|q|add|isEmpty|peek|remove|length|get|LinkedList|Queue|ArrayList|Integer)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['adj', 'color', 'col', 'start', 'node', 'it', 'V', 'q', 'i'].includes(part);
            const isMapCall = ['dfs', 'isBipartite', 'add', 'remove', 'isEmpty', 'peek', 'get'].includes(part);
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

export default function BipartiteVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('bipartiteDFS');
  
  // Default: A non-bipartite graph (Pentagon) to show collision
  const [adjInput, setAdjInput] = useState('1, 4 | 0, 2 | 1, 3 | 2, 4 | 0, 3');

  const [baseAdj, setBaseAdj] = useState<number[][]>([
      [1, 4],
      [0, 2],
      [1, 3],
      [2, 4],
      [0, 3]
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
        
        if (parsed.length === 0) parsed = [[1, 4], [0, 2], [1, 3], [2, 4], [0, 3]];
        if (parsed.length > 15) parsed = parsed.slice(0, 15);

        // Filter out out-of-bounds neighbors and self-loops
        const V = parsed.length;
        for (let i = 0; i < V; i++) {
            parsed[i] = parsed[i].filter(n => n < V && n !== i);
        }

        // Ensure edges are strictly undirected
        for (let i = 0; i < V; i++) {
            for (let j of parsed[i]) {
                if (!parsed[j].includes(i)) {
                    parsed[j].push(i);
                }
            }
            parsed[i].sort((a, b) => a - b);
        }

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

  // Auto-scroll effect specifically targeting exact active line
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

  // Circle Layout for Graph
  const nodePositions = useMemo(() => {
    const V = baseAdj.length;
    const pos: {x: number, y: number}[] = new Array(V).fill({x: 0, y: 0});
    if (V === 0) return pos;
    if (V === 1) return [{x: 0, y: 0}];

    const radius = Math.max(120, V * 25);
    for (let i = 0; i < V; i++) {
        const angle = (i / V) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseAdj]);

  // Generate trace strictly aligned with exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const V = adj.length;
    if (V === 0) return steps;

    let color: number[] = Array(V).fill(-1);
    let checkFailed = false;
    let collisionData = {};
    const stack: {node: number, col: number}[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, stack: [...stack], color: clone1D(color), ...stateObj } 
    });

    add("Function Call", `public boolean isBipartite(int V=${V}, ...)\nInitiating check across ${V} total nodes.`, 18, { phase: 'init' });
    
    add("Init Color Array", `int color[] = new int[V];\nAllocated color array.`, 19, { phase: 'init_ds' });
    add("Fill Uncolored", `for(int i = 0; i < V; i++) color[i] = -1;\nFilled array with -1 indicating all nodes are uncolored.`, 20, { phase: 'init_ds' });

    const runDFS = (node: number, col: number): boolean => {
        stack.push({node, col});
        add("DFS Enter", `private boolean dfs(int node=${node}, int col=${col}, ...)\nEntering deep recursion for node ${node}.`, 2, { phase: 'dfs_enter', activeNode: node, scanI: stack[0]?.node });

        color[node] = col;
        add("DFS: Color Node", `color[node] = col;\nAssigning color ${col} to our active node.`, 3, { phase: 'color_node', activeNode: node, scanI: stack[0]?.node });

        add("DFS: Neighbor Loop", `for(int it : adj.get(node))\nIterating all adjacent neighbors for node ${node}.`, 5, { phase: 'for_adj', activeNode: node, scanI: stack[0]?.node });

        for (let it of adj[node]) {
            add("DFS: Check Neighbor Color", `if(color[it] == -1)\nIs neighbor ${it} completely uncolored?`, 6, { phase: 'check_adj', activeNode: node, checkNode: it, scanI: stack[0]?.node });

            if (color[it] === -1) {
                add("DFS: Recursive Call", `if(dfs(it, 1 - col, color, adj) == false)\nNeighbor ${it} is uncolored. Plunging deeper with inverted color (${1 - col})!`, 7, { phase: 'call_dfs', activeNode: node, checkNode: it, scanI: stack[0]?.node });
                
                if (runDFS(it, 1 - col) === false) {
                    add("DFS: Propagate Failure", `return false;\nCollision bubbled up from deeper recursion! Passing false upwards.`, 8, { phase: 'return_false', activeNode: node, checkNode: it, scanI: stack[0]?.node, ...collisionData });
                    return false;
                }
                
                add("DFS: Backtrack", `Returned to node ${node} after safely exploring its neighbor ${it}.`, 5, { phase: 'dfs_backtrack', activeNode: node, checkNode: it, scanI: stack[0]?.node });
                
            } else {
                add("DFS: Check Collision", `else if(color[it] == col)\nNeighbor ${it} is already colored. Does its color MATCH our current color (${col})?`, 11, { phase: 'check_collision', activeNode: node, checkNode: it, scanI: stack[0]?.node });

                if (color[it] === col) {
                    checkFailed = true;
                    collisionData = { activeNode: node, checkNode: it, failNode: it };
                    add("DFS: COLLISION DETECTED!", `return false;\nColors match! Node ${node} and ${it} share color ${col}. An odd-length cycle exists! Graph is NOT Bipartite.`, 12, { phase: 'collision', scanI: stack[0]?.node, ...collisionData });
                    return false;
                } else {
                    add("DFS: Safe Adjacency", `Colors are different (${color[it]} vs ${col}). Bipartite rule holds here. Ignoring.`, 11, { phase: 'safe_adj', activeNode: node, checkNode: it, scanI: stack[0]?.node });
                }
            }
        }

        stack.pop();
        add("DFS: Safe Return", `return true;\nFinished checking all paths from node ${node} safely. Popping from stack.`, 15, { phase: 'dfs_exit', activeNode: node, scanI: stack[0]?.node || 0 });
        return true;
    };

    for (let i = 0; i < V; i++) {
        if (checkFailed) break;

        add("Outer Scan Loop", `for(int i = 0; i < V; i++)\nIterating to ensure all disconnected components are evaluated. Row ${i}.`, 22, { phase: 'scan', scanI: i });
        add("Check Uncolored", `if(color[i] == -1)\nIs component root node ${i} uncolored?`, 23, { phase: 'check_grid', scanI: i });

        if (color[i] === -1) {
            add("Trigger DFS", `if(dfs(i, 0, color, adj) == false)\nRoot node ${i} is uncolored. Launching DFS check subroutine with color 0!`, 24, { phase: 'trigger_dfs', scanI: i });

            if (runDFS(i, 0) === false) {
                add("Main: Propagate Failure", `return false;\nThe DFS sub-routine bubbled up a failure. The graph is NOT Bipartite.`, 25, { phase: 'return_false_main', isDone: true, isSuccess: false, scanI: i, ...collisionData });
                break;
            }
        } else {
            add("Skip Colored Node", `Node ${i} is already colored from a previous traversal. Skipping.`, 23, { phase: 'skip_scan', scanI: i });
        }
    }

    if (!checkFailed) {
        add("Final Safe Return", `return true;\nAll components mapped perfectly with 2 colors. The graph IS Bipartite!`, 29, { phase: 'done', isDone: true, isSuccess: true });
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

  // Abstracted Trace Operations Component
  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Palette size={100} className="text-white"/></div>
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
                    {st.isSuccess ? "PERFECTLY BIPARTITE" : "COLLISION DETECTED"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? "Graph can be perfectly divided into 2 colors." : "An odd-length cycle prevented valid 2-coloring."}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('color') || st.phase.includes('dfs_enter') ? 'text-emerald-400' : (st.phase.includes('collision') || st.phase.includes('false') ? 'text-rose-500' : (st.phase.includes('check_adj') || st.phase.includes('scan') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.adj === undefined) return null;
      let isDone = st.isDone;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isDone ? (st.isSuccess ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              {isDone ? (
                  <div className="flex flex-col items-center justify-center gap-4 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${st.isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {st.isSuccess ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} Final Result Returned
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full break-all ${st.isSuccess ? 'text-emerald-700 bg-emerald-100 border-emerald-400' : 'text-rose-700 bg-rose-100 border-rose-400'}`}>
                          Return: {st.isSuccess ? "true (Bipartite)" : "false (Not Bipartite)"}
                      </div>
                      <button onClick={handleReset} className={`mt-2 py-3 px-8 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-sm ${st.isSuccess ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}>
                          <RotateCcw size={18}/> RESTART SIMULATION
                      </button>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[70px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><Search size={12}/> Outer Scan Loop</span>
                          <div className={`border-2 text-sm font-black px-6 py-2 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 shadow-sm flex flex-col items-center min-w-[80px]`}>
                              <span>i = <span className="text-indigo-500">{st.scanI !== undefined ? st.scanI : '-'}</span></span>
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active Node (DFS)</span>
                          <div className={`border-2 text-xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase.startsWith('dfs') || st.phase.includes('collision') ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeNode !== undefined ? st.activeNode : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><ZoomIn size={12}/> Checking AdjNode</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-2xl transition-all duration-300 ${st.checkNode !== undefined ? 'bg-sky-100 border-sky-400 text-sky-800 shadow-sm animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.checkNode !== undefined ? st.checkNode : '-'}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderSimulationState = () => {
      if (st.adj === undefined) return null;

      const renderedEdges = new Set<string>();

      return (
          <>
             {/* LEFT COLUMN: Graph Renderer & Color Array */}
             <div className="flex flex-col gap-8 shrink-0 relative">
                 <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white/90 rounded-[3rem] shadow-2xl border border-slate-300 backdrop-blur-sm z-10 flex items-center justify-center">
                     <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Bipartite Graph</span>
                     
                     <svg viewBox="-250 -250 500 500" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                          {(() => {
                              const edges = new Set<string>();
                              return st.adj.map((neighbors: number[], u: number) => (
                                  neighbors.map((v: number) => {
                                      const edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`;
                                      if (edges.has(edgeKey)) return null;
                                      edges.add(edgeKey);
      
                                      const p1 = nodePositions[u];
                                      const p2 = nodePositions[v];
                                      if (!p1 || !p2) return null;
      
                                      let isChecking = (st.activeNode === u && st.checkNode === v) || (st.activeNode === v && st.checkNode === u);
                                      let isCollision = (st.phase.includes('collision') || (st.isDone && !st.isSuccess)) && isChecking;
      
                                      let strokeColor = "#cbd5e1"; // slate-300
                                      let strokeWidth = "3";
                                      let strokeDash = "none";
                                      let animClass = "";
      
                                      if (isCollision) {
                                          strokeColor = "#f43f5e"; // rose-500
                                          strokeWidth = "8";
                                          animClass = "animate-pulse";
                                      } else if (isChecking) {
                                          strokeColor = "#0ea5e9"; // sky-500
                                          strokeWidth = "6";
                                      }
      
                                      return (
                                          <line 
                                              key={edgeKey}
                                              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              strokeDasharray={strokeDash}
                                              className={`transition-all duration-300 ${animClass}`}
                                              strokeLinecap="round"
                                          />
                                      );
                                  })
                              ));
                          })()}
                     </svg>

                     {/* Render Nodes */}
                     <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                        {nodePositions.map((pos, idx) => {
                            let nodeColor = st.color[idx];
                            let isActive = st.activeNode === idx;
                            let isChecking = st.checkNode === idx;
                            let isFailNode = st.failNode === idx || (st.phase.includes('collision') && (st.activeNode === idx || st.checkNode === idx));

                            // Color Map: 0 -> Sky, 1 -> Amber, -1 -> White
                            let bgClass = 'bg-white text-slate-400 border-slate-200 shadow-sm';
                            if (nodeColor === 0) bgClass = 'bg-sky-500 text-white border-sky-600 shadow-md';
                            else if (nodeColor === 1) bgClass = 'bg-amber-500 text-white border-amber-600 shadow-md';

                            let ringClass = '';
                            let scaleClass = 'scale-100';
                            let zIndex = 'z-10';

                            if (isFailNode) {
                                ringClass = 'ring-4 ring-rose-500 ring-offset-2 border-transparent shadow-xl';
                                scaleClass = 'scale-125';
                                zIndex = 'z-40';
                            } else if (isActive) {
                                ringClass = 'ring-4 ring-emerald-500 ring-offset-2 border-transparent shadow-xl';
                                scaleClass = 'scale-125';
                                zIndex = 'z-40';
                            } else if (isChecking) {
                                ringClass = 'ring-4 ring-slate-400 ring-offset-2 border-transparent shadow-md';
                                scaleClass = 'scale-110';
                                zIndex = 'z-30';
                            }

                            return (
                                <div 
                                    key={`node-${idx}`}
                                    className={`absolute w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-black text-xl md:text-2xl rounded-full transition-all duration-300 border-2 select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`}
                                    style={{ 
                                        left: `${pos.x}px`, 
                                        top: `${pos.y}px`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {idx}
                                    {isActive && <span className="absolute -top-6 text-[10px] text-emerald-600 bg-emerald-50 px-2 rounded font-bold border border-emerald-200 shadow-sm">ACTIVE</span>}
                                </div>
                            );
                        })}
                     </div>
                 </div>

                 {/* Color Array Flat Viewer */}
                 <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><Palette size={12}/> color[] Array</span>
                     <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl w-full">
                         {(st.color || []).map((val: number, idx: number) => {
                             let isNewlyMarked = (st.phase === 'color_node' || st.phase === 'color_adj') && (st.activeNode === idx || st.checkNode === idx);
                             
                             let boxBg = 'bg-slate-50 text-slate-300 border-slate-200';
                             if (val === 0) boxBg = "bg-sky-500 text-white border-sky-600 shadow-sm";
                             else if (val === 1) boxBg = "bg-amber-500 text-white border-amber-600 shadow-sm";

                             if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-indigo-200 animate-in zoom-in";

                             return (
                                 <div key={`vis-${idx}`} className="flex flex-col items-center">
                                     <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{idx}</span>
                                     <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded border-2 transition-all duration-300 ${boxBg}`}>
                                         {val}
                                     </div>
                                 </div>
                             )
                         })}
                     </div>
                 </div>
             </div>

             {/* RIGHT COLUMN: Neighbor Discovery, Call Stack & Variables */}
             <div className="flex flex-col gap-4 z-20 items-center justify-start shrink-0 w-[240px] md:w-[320px]">
                 
                 {/* Adjacency List Component */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><ListTree size={12}/> Adjacency List</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-1 relative min-h-[150px] max-h-[250px] overflow-y-auto scrollbar-thin">
                         {(st.adj || []).map((neighbors: number[], nodeIdx: number) => {
                             let isActiveRow = st.activeNode === nodeIdx;
                             let isScanRow = st.scanI === nodeIdx && st.phase.includes('scan');
                             let highlightRow = isActiveRow || isScanRow;

                             return (
                                 <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : (isScanRow ? 'bg-indigo-50 border border-indigo-200' : 'bg-transparent border border-transparent')}`}>
                                     <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-emerald-500 text-white shadow-sm' : (isScanRow ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                         {nodeIdx}
                                     </div>
                                     <ArrowRight size={14} className={isActiveRow ? 'text-emerald-400' : (isScanRow ? 'text-indigo-400' : 'text-slate-300')} />
                                     <div className="flex flex-wrap gap-1 items-center">
                                         <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                         {neighbors.map((neighbor: number, nIdx: number) => {
                                             let isChecking = isActiveRow && st.checkNode === neighbor;
                                             let isCollision = st.phase.includes('collision') && isChecking;

                                             let neighborBg = 'transparent';
                                             let neighborText = highlightRow ? 'text-emerald-700' : 'text-slate-500';

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

                 {/* Call Stack Component (DFS specifically) */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> Call Stack</span>
                     <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                         <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                             <span>TOP (CURRENT)</span>
                         </div>
                         
                         <div className="flex flex-col gap-2 transition-all duration-500">
                             {[...(st.stack || [])].reverse().map((val: {node: number, col: number}, i: number) => {
                                 let isTop = i === 0;
                                 let isEntering = isTop && st.phase === 'dfs_enter';
                                 
                                 return (
                                     <div key={`stack-${i}-${val.node}-${val.col}`} className={`px-4 py-2 flex items-center justify-between font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-indigo-500 border-indigo-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-500')}`}>
                                         <span className="text-xs">dfs({val.node}, {val.col})</span>
                                         {isTop && <Activity size={12} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                                     </div>
                                 )
                             })}
                             {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Stack is empty</span>}
                         </div>
                     </div>
                 </div>

                 {/* Variables State Panel */}
                 <div className="flex flex-col items-center w-full">
                     <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><Database size={12}/> Trace Variables</span>
                     <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-4 flex flex-col gap-2 font-mono text-[11px] md:text-xs">
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
                                 <span className="text-emerald-500">node (DFS Active):</span>
                                 <span className="font-bold text-emerald-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-sky-500">it (Neighbor):</span>
                                 <span className="font-bold text-sky-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                                 <span className="text-rose-500">Collision Node:</span>
                                 <span className="font-bold text-rose-700">{st.failNode !== undefined ? st.failNode : '-'}</span>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
          </>
      );
  }

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
                  <span>DFS & Recursive Coloring</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Palette size={28}/> 2-Color Graph Painting</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A graph is <strong>Bipartite</strong> if the nodes can be partitioned into two independent sets such that every edge connects a node in set A to a node in set B.</p>
                        <p>An easier way to think about it: Can you color the graph using exactly 2 colors without any two adjacent nodes sharing the same color?</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1 (Non-Bipartite):</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> graph = [[1, 4], [0, 2], [1, 3], [2, 4], [0, 3]]</span>
                       <span className="text-rose-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">false</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           This is a 5-node ring graph. If we start painting 0 as Blue, 1 is Orange, 2 is Blue, 3 is Orange, 4 must be Blue.<br/>
                           But 4 is connected to 0, which is also Blue! Collision! Graph is not bipartite.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowLeftRight size={16}/> 1. Recursive Color Inversion</span>
                            <p className="text-sm text-slate-500">As we plunge deeply via DFS, whenever we find an uncolored neighbor, we trigger a new DFS call passing the inverse color of the active node using <code>1 - col</code>. This ensures depths alternate colors perfectly.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><AlertTriangle size={16}/> 2. Collision Bubbling</span>
                            <p className="text-sm text-slate-500">If we encounter a neighbor that is already painted, we check its color. If it matches our current node's color, an odd-length cycle is found. We immediately return <code>false</code> and bubble this failure all the way up the stack.</p>
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency List (Use | to separate nodes 0 to V-1)</label>
                            <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 4 | 0, 2 | 1, 3 | 2, 4 | 0, 3" />
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

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-2 md:p-8 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[600px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Bipartite DFS Visualizer</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderSimulationState()}
                       </div>
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
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding odd-length cycles and why they fundamentally break graph bi-partitioning rules.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-indigo-500"/> Odd Cycles Break Bipartite</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A graph can only be colored with 2 colors if it contains NO odd-length cycles. If a cycle has an odd number of nodes (like 3 or 5), alternating colors will mathematically force the last node to be exactly the same color as the first node it connects to, causing an inescapable collision.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> Disconnected Component Safety</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Just because one part of a graph is bipartite doesn't mean the whole thing is. The algorithm implements an outer `for` loop to ensure that every single uncolored component is seeded into the DFS. If any single component throws a collision, the entire graph is declared non-bipartite immediately.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>Every node V is checked and painted exactly once. Once colored, we iterate its adjacency list. The total iterations over all adjacency lists in an undirected graph equals exactly 2E. The overall operation is linearly bound by the graph size.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The `color[]` array statically takes $O(V)$ space. The DFS Call Stack, in the absolute worst-case scenario (a long linear graph), could hold $V$ elements simultaneously. Thus, total Space Complexity is safely bounded by $O(V)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Bipartite matching is a favorite concept because it bridges graph coloring and cycle detection elegantly. Be prepared to explain it in both BFS and DFS."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can you solve this using Breadth-First Search (BFS)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely."</p>
                            <p>With BFS, we simply push the start node to a Queue and paint it. While popping nodes, we check unpainted neighbors, paint them with <code>1 - color_val</code>, and push them to the Queue. It avoids deep recursion limits but requires slightly more overhead for the Queue."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if the graph has an even-length cycle (like a square)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is perfectly Bipartite."</p>
                            <p>In an even cycle, the alternating coloring wraps around flawlessly without collision. Think of a 4-node square: 0(Blue) &rarr; 1(Orange) &rarr; 2(Blue) &rarr; 3(Orange). When 3 looks back at 0, their colors are different, so the graph passes safely."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
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

              {/* RIGHT CANVAS AREA */}
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-${themeColor}-600 text-white shadow-md`}>
                              {selectedOp.icon} <span>{selectedOp.title}</span>
                          </button>
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                           <div className="flex gap-2 w-full">
                                <div className="space-y-1.5 w-full">
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Adjacency List (Use | to separate nodes 0 to V-1)</label>
                                    <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold min-w-[300px]`} placeholder="1, 4 | 0, 2 | 1, 3 | 2, 4 | 0, 3" />
                                </div>
                           </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isDone && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-12 py-6 bg-${themeColor}-500 text-white rounded-[2rem] hover:bg-${themeColor}-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-400 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      {/* Using the centralized render wrapper */}
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-row justify-center items-center gap-8 lg:gap-16 pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderSimulationState()}
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
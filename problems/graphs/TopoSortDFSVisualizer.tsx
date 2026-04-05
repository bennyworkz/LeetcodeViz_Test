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
  topoSortDFS: {
    id: 'topoSortDFS',
    title: 'Topological Sort (DFS)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V)',
    theme: 'indigo',
    code: `class Solution {
    private static void dfs(int node, int vis[], Stack<Integer> st, ArrayList<ArrayList<Integer>> adj) {
        vis[node] = 1;
        for(int it : adj.get(node)) {
            if(vis[it] == 0)
                dfs(it, vis, st, adj);
        }
        st.push(node);
    }
    
    // Function to return list containing vertices in Topological order.
    static int[] topoSort(int V, ArrayList<ArrayList<Integer>> adj) {
        int vis[] = new int[V];
        Stack<Integer> st = new Stack<Integer>();
        for(int i = 0; i < V; i++) {
            if(vis[i] == 0) {
                dfs(i, vis, st, adj);
            }
        }
        
        int ans[] = new int[V];
        int i = 0;
        while(!st.isEmpty()) {
            ans[i++] = st.peek();
            st.pop();
        }
        return ans;
    }
}`,
    desc: "Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v in the ordering. We use Depth-First Search (DFS) to plunge as deep as possible. Once a node has no more unvisited descendants to explore, we push it onto a Stack. Popping this stack at the end perfectly yields the topological ordering!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|dfs|topoSort|node|it|adj|vis|st|ans|V|get|ArrayList|Integer|Stack|push|pop|peek|isEmpty)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List', 'Stack'].includes(part);
            const isPointer = ['adj', 'vis', 'st', 'ans', 'node', 'it', 'V', 'i'].includes(part);
            const isMapCall = ['dfs', 'topoSort', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length', 'push', 'pop'].includes(part);
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

export default function TopoSortDFSVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('topoSortDFS');
  
  // Default: A standard 6-node DAG (Directed Acyclic Graph)
  // 5->0, 4->0, 5->2, 2->3, 3->1, 4->1
  const [adjInput, setAdjInput] = useState(' | | 3 | 1 | 0, 1 | 0, 2');

  const [baseAdj, setBaseAdj] = useState<number[][]>([
      [],
      [],
      [3],
      [1],
      [0, 1],
      [0, 2]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null); // Fixed ReferenceError
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
        
        if (parsed.length === 0) parsed = [[], [], [3], [1], [0, 1], [0, 2]];
        if (parsed.length > 20) parsed = parsed.slice(0, 20);

        // Filter out out-of-bounds neighbors
        const V = parsed.length;
        for (let i = 0; i < V; i++) {
            parsed[i] = parsed[i].filter(n => n < V);
            // Sort to ensure deterministic order identical to standard adj list processing
            parsed[i].sort((a, b) => a - b);
        }

        // DAG Directed edges only.
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

  // --- Graph Layout Mathematics ---
  const V = baseAdj.length;
  // Expansive radius utilizing the unconstrained space
  const graphRadius = Math.max(160, V * 30);
  const svgSize = graphRadius * 2 + 120; // Padding on all sides

  // Circle Layout for visual clarity
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(V).fill({x: 0, y: 0});
    if (V === 0) return pos;
    if (V === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < V; i++) {
        const angle = (i / V) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseAdj, graphRadius, V]);

  // Generate trace strictly aligned with exact Java code lines from the image
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const V = adj.length;
    if (V === 0) return steps;

    let vis: number[] = Array(V).fill(0);
    let ans: (number | string)[] = Array(V).fill('');
    let ansIdx = 0;
    const st: number[] = [];
    const callStack: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, V, st: [...st], callStack: [...callStack], vis: clone1D(vis), ans: clone1D(ans), ansIdx, ...stateObj } 
    });

    add("Function Call", `static int[] topoSort(int V=${V}, ...)\nInitiating Topological Sort logic.`, 12, { phase: 'init' });
    
    add("Init Visited", `int vis[] = new int[V];\nAllocated visited array for tracking.`, 13, { phase: 'init_ds' });
    add("Init Stack", `Stack<Integer> st = new Stack<Integer>();\nInitialized LIFO Stack to store topological order.`, 14, { phase: 'init_ds' });

    const runDFS = (node: number) => {
        callStack.push(node);
        add("DFS Enter", `private static void dfs(int node=${node}, ...)\nEntering recursion for node ${node}.`, 3, { phase: 'dfs_enter', activeNode: node, scanI: callStack[0] });
        
        vis[node] = 1;
        add("Mark Visited", `vis[node] = 1;\nMarking active node ${node} as visited.`, 4, { phase: 'mark_vis', activeNode: node, scanI: callStack[0] });

        add("Neighbor Loop", `for(int it : adj.get(node))\nIterating all outgoing directed edges for node ${node}.`, 5, { phase: 'for_adj', activeNode: node, scanI: callStack[0] });

        for (let it of adj[node]) {
            add("Check Unvisited", `if(vis[it] == 0)\nIs target neighbor ${it} unvisited?`, 6, { phase: 'check_adj', activeNode: node, checkNode: it, scanI: callStack[0] });

            if (vis[it] === 0) {
                add("Recursive DFS", `dfs(it, vis, st, adj);\nNeighbor ${it} is unvisited. Plunging deeper!`, 7, { phase: 'call_dfs', activeNode: node, checkNode: it, scanI: callStack[0] });
                
                runDFS(it);
                
                add("DFS Backtrack", `Returned safely to node ${node} after exploring neighbor ${it}'s full path.`, 5, { phase: 'dfs_backtrack', activeNode: node, checkNode: it, scanI: callStack[0] });
            } else {
                add("Skip Visited", `Neighbor ${it} is already visited (vis=1). Safe cross-edge. Ignoring.`, 6, { phase: 'skip_adj', activeNode: node, checkNode: it, scanI: callStack[0] });
            }
        }

        st.push(node);
        add("Stack Push", `st.push(node);\nFinished entirely with node ${node} and all its descendants! Pushing it securely onto the Stack.`, 9, { phase: 'push_stack', activeNode: node, scanI: callStack[0] });

        callStack.pop();
        add("DFS Return", `dfs routine for node ${node} complete. Popping from call stack.`, 10, { phase: 'dfs_exit', activeNode: node, scanI: callStack[0] || 0 });
    };

    for (let i = 0; i < V; i++) {
        add("Outer Scan Loop", `for(int i = 0; i < V; i++)\nIterating to ensure all disconnected components are pushed. Node ${i}.`, 15, { phase: 'scan', scanI: i });
        add("Check Root Visited", `if(vis[i] == 0)\nIs component root node ${i} unvisited?`, 16, { phase: 'check_grid', scanI: i });

        if (vis[i] === 0) {
            add("Trigger DFS", `dfs(i, vis, st, adj);\nRoot node ${i} is unvisited. Launching DFS traversal!`, 17, { phase: 'trigger_dfs', scanI: i });
            runDFS(i);
        } else {
            add("Skip Visited Root", `Node ${i} was already evaluated in a previous traversal. Skipping.`, 16, { phase: 'skip_scan', scanI: i });
        }
    }

    add("Init Output Array", `int ans[] = new int[V];\nAllocated final answer array to hold the topological sort.`, 21, { phase: 'init_ans' });
    add("Init Pointer", `int i = 0;\nSetting up indexing pointer.`, 22, { phase: 'init_ptr' });

    while(st.length > 0) {
        add("While Stack Loop", `while(!st.isEmpty())\nStack is not empty. Proceeding to pop elements.`, 23, { phase: 'while_stack', popI: ansIdx });
        
        let topNode = st[st.length - 1];
        add("Peek Stack", `ans[i++] = st.peek();\nPeeking top element ${topNode} and placing it into ans[${ansIdx}].`, 24, { phase: 'peek_stack', activeNode: topNode, popI: ansIdx });
        
        ans[ansIdx] = topNode;
        ansIdx++;
        
        st.pop();
        add("Pop Stack", `st.pop();\nSuccessfully removed ${topNode} from the Stack.`, 25, { phase: 'pop_stack', activeNode: topNode, popI: ansIdx });
    }

    add("Empty Stack Exit", `while(!st.isEmpty())\nStack is completely empty. We have extracted the full Topological Sort.`, 23, { phase: 'stack_empty' });
    add("Final Return", `return ans;\nAlgorithm complete. Returning the ans array.`, 27, { phase: 'done', isDone: true, isSuccess: true });

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-indigo-900 border-indigo-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><ListOrdered size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-indigo-400`}>
                    <CheckCircle2 size={24}/> TOPOLOGICAL SORT COMPLETE
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm successfully ordered DAG vertices linearly.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('dfs_enter') || String(st.phase || '').includes('mark_vis') ? 'text-emerald-400' : (String(st.phase || '').includes('push') || String(st.phase || '').includes('pop') || String(st.phase || '').includes('peek') ? 'text-fuchsia-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('scan') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                      let boxBg = val === 1 ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-200";
                      if (isNewlyMarked) boxBg += " scale-110 shadow-lg ring-2 ring-emerald-400 animate-in zoom-in";

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
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><ListOrdered size={12}/> ans[] Output</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl min-w-[200px] max-w-[240px]">
                  {(st.ans || []).map((val: number | string, idx: number) => {
                      let isNewlyWritten = (st.phase === 'peek_stack' || st.phase === 'pop_stack') && (st.popI - 1 === idx);
                      let isPointer = (String(st.phase || '').includes('stack') || st.phase === 'init_ptr') && (st.popI === idx);
                      
                      let boxBg = val !== '' ? "bg-indigo-500 text-white border-indigo-600 shadow-sm" : "bg-slate-50 text-slate-200 border-slate-200 border-dashed";
                      if (isNewlyWritten) boxBg += " scale-110 shadow-lg ring-2 ring-indigo-300 animate-in zoom-in";

                      return (
                          <div key={`ans-${idx}`} className="flex flex-col items-center relative">
                              <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{idx}</span>
                              <div className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                  {val}
                              </div>
                              {isPointer && <div className="absolute -bottom-4 text-[8px] font-black text-indigo-500 animate-bounce">&uarr; i</div>}
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
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (DAG)</span>
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

                                      let neighborBg = 'transparent';
                                      let neighborText = highlightRow ? 'text-fuchsia-700' : 'text-slate-500';

                                      if (isChecking) {
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

          {/* Stack Visualization specifically tailored for TopoSort */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Layers size={12}/> Stack&lt;Integer&gt; st</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[180px] overflow-y-auto scrollbar-thin items-center">
                  <div className="w-full flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-1">
                      <span>TOP</span>
                  </div>
                  
                  <div className="flex flex-col-reverse gap-1.5 w-full max-w-[120px] transition-all duration-500 mt-auto">
                      {st.st && st.st.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center py-4">Empty</span>}
                      {(st.st || []).map((val: number, i: number) => {
                          let isTop = i === st.st.length - 1; // Top of stack
                          let isEntering = isTop && st.phase === 'push_stack';
                          let isPopping = isTop && st.phase === 'peek_stack';
                          
                          return (
                              <div key={`st-${i}-${val}`} className={`w-full py-2 flex items-center justify-center font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-in slide-in-from-top-8 scale-110 z-10 relative' : (isPopping ? 'bg-indigo-400 border-indigo-500 text-white animate-pulse ring-4 ring-indigo-200 scale-110 z-10 relative' : 'bg-slate-700 border-slate-800 text-white')}`}>
                                  {val}
                              </div>
                          )
                      })}
                  </div>
                  
                  <div className="w-full border-t-4 border-slate-300 mt-1"></div>
              </div>
          </div>

          {/* DFS Call Stack */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Layers size={12}/> DFS Call Stack</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>TOP (CURRENT)</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 transition-all duration-500">
                      {[...(st.callStack || [])].reverse().map((val: number, i: number) => {
                          let isTop = i === 0;
                          let isEntering = isTop && st.phase === 'dfs_enter';
                          
                          return (
                              <div key={`cstack-${i}-${val}`} className={`px-4 py-2 flex items-center justify-between font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-fuchsia-600 border-fuchsia-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-500')}`}>
                                  <span className="text-xs">dfs({val})</span>
                                  {isTop && <Activity size={12} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                              </div>
                          )
                      })}
                      {st.callStack && st.callStack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Stack is empty</span>}
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
                          <span className="text-fuchsia-500">node (DFS Active):</span>
                          <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-sky-500">it (Target):</span>
                          <span className="font-bold text-sky-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
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
  
                                  let strokeColor = "#cbd5e1"; // slate-300
                                  let strokeWidth = "3";
                                  let animClass = "";
  
                                  if (isChecking) {
                                      strokeColor = "#0ea5e9"; // sky-500
                                      strokeWidth = "4";
                                  }

                                  // Explicit arrow head drawing
                                  const arrowSize = 14;
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
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isStacked = (st.st || []).includes(idx);
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isStacked) {
                            bgClass = 'bg-slate-700 text-white border-slate-800 shadow-md opacity-90';
                        } else if (isVisited) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isActive) {
                            ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isChecking) {
                            ringClass = 'ring-4 ring-sky-400 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        } else if (isStacked) {
                            ringClass = 'ring-2 ring-indigo-300 border-transparent';
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
                                {isStacked && !isActive && <span className="absolute -top-6 text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-black border border-slate-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Stacked</span>}
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
                  <span>Directed Acyclic Graph (DAG)</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><ListOrdered size={28}/> Linear Ordering of DAG Dependencies</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p><strong>Topological Sorting</strong> is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge <code>u &rarr; v</code>, vertex <code>u</code> comes before <code>v</code> in the ordering.</p>
                        <p>It is heavily used in scheduling jobs from given dependencies among jobs. For example, resolving packages in a build system (Webpack/NPM), resolving compilation dependencies, or task scheduling.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> graph = (5 &rarr; 0), (4 &rarr; 0), (5 &rarr; 2), (2 &rarr; 3), (3 &rarr; 1), (4 &rarr; 1)</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[5, 4, 2, 3, 1, 0]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           Nodes 5 and 4 have no incoming dependencies, so they can be processed first.<br/>
                           Notice how for every edge u &rarr; v (like 5 &rarr; 0), 'u' ALWAYS appears before 'v' in the final output array.
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowDownToLine size={16}/> 1. DFS Plunge</span>
                            <p className="text-sm text-slate-500">We utilize Depth-First Search to intentionally plunge as far deep into the dependency graph as mathematically possible. We keep going until we hit a terminal node (a node with zero unvisited descendants).</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-fuchsia-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Layers size={16}/> 2. Post-Order Stacking</span>
                            <p className="text-sm text-slate-500">Once a node is confirmed to have no further dependencies to resolve, we <strong>push it to a Stack</strong>. Because a Stack is LIFO (Last-In, First-Out), the deepest dependencies will be at the bottom, and the root prerequisites will end up at the very top!</p>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>DAG Adjacency List (Use | to separate nodes 0 to V-1)</label>
                            <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder=" | | 3 | 1 | 0, 1 | 0, 2" />
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
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Topological Sort Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how Depth First Search naturally exposes dependency hierarchies through Post-Order traversal.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-fuchsia-500"/> Why Stack? (Post-Order Reversal)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If <code>A</code> depends on <code>B</code>, and <code>B</code> depends on <code>C</code>, DFS will visit <code>A</code>, plunge to <code>B</code>, plunge to <code>C</code>. <code>C</code> has no dependencies left, so its DFS finishes first. We push <code>C</code> to the Stack. Then <code>B</code> finishes. Push <code>B</code>. Then <code>A</code> finishes. Push <code>A</code>. When we pop the Stack at the end, we get exactly: <code>A, B, C</code>. Perfect topological order!</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><AlertTriangle size={24} className="text-rose-500"/> The DAG Requirement</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Topological sorting is strictly impossible if the graph contains a cycle. If <code>A &rarr; B &rarr; C &rarr; A</code>, you cannot fulfill the prerequisites of A without first resolving A itself. Note: This standard DFS implementation assumes the graph is a valid DAG. If it has cycles, it yields an incorrect result. (You would need a <code>pathVis</code> check to detect cycles first).</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>Every node V is checked exactly once. Once colored, we iterate its adjacency list. The total iterations over all adjacency lists equals exactly the number of directed edges E. Finally, we pop the stack V times. Overall time is strictly linearly bound by O(V + E).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The <code>vis[]</code> array takes O(V). The Stack takes O(V). The answer array takes O(V). The DFS Call Stack, in the absolute worst-case scenario (a long linear chain), could hold V elements simultaneously. Thus, total Space Complexity is safely bounded by O(V).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Topological sort is the backbone of dependency resolution systems. The interviewer expects you to fluently explain the difference between the DFS (Stack) approach and the BFS (Kahn's) approach."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Is Topological Sort unique? Can there be multiple valid answers?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it is generally not unique."</p>
                            <p>There can be multiple valid topological sorts for a given DAG. If nodes 4 and 5 both have no dependencies (In-Degree = 0), processing 4 before 5, or 5 before 4, are both perfectly valid. The specific answer outputted depends purely on which index the algorithm randomly starts its traversal from."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What is Kahn's Algorithm?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It is the Breadth-First Search (BFS) equivalent of Topological Sort."</p>
                            <p>Instead of deep recursion, Kahn's calculates the In-Degree (number of incoming edges) of every node. It pushes all nodes with In-Degree 0 into a Queue. As nodes are popped and added to the answer array, we reduce the In-Degree of their neighbors. When a neighbor's In-Degree hits 0, it is pushed to the Queue. Kahn's is often preferred in production because it naturally detects cycles (if the final output size is less than V)."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>DAG Adjacency List</label>
                          <input type="text" value={adjInput} onChange={(e) => setAdjInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder=" | | 3 | 1 | 0, 1 | 0, 2" />
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
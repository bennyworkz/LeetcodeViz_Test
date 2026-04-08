import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  shortestPathDAG: {
    id: 'shortestPathDAG',
    title: 'Shortest Path in DAG (Topo Sort)',
    icon: <Route size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V + E)',
    theme: 'amber',
    code: `class Solution {
    private void topoSort(int node, ArrayList<ArrayList<Pair>> adj, int vis[], Stack<Integer> st) {
        vis[node] = 1;
        for(int i = 0; i<adj.get(node).size(); i++) {
            int v = adj.get(node).get(i).first;
            if(vis[v] == 0) {
                topoSort(v, adj, vis, st);
            }
        }
        st.add(node);
    }
    
    public int[] shortestPath(int N, int M, int[][] edges, int src) {
        ArrayList<ArrayList<Pair>> adj = new ArrayList<>();
        for(int i = 0; i<N; i++) {
            ArrayList<Pair> temp = new ArrayList<Pair>();
            adj.add(temp);
        }
        for(int i = 0; i<M; i++) {
            int u = edges[i][0];
            int v = edges[i][1];
            int wt = edges[i][2];
            adj.get(u).add(new Pair(v, wt));
        }
        
        int vis[] = new int[N];
        Stack<Integer> st = new Stack<>();
        for(int i = 0; i<N; i++) {
            if(vis[i] == 0) {
                topoSort(i, adj, vis, st);
            }
        }
        
        int dist[] = new int[N];
        for(int i = 0; i<N; i++) {
            dist[i] = (int)(1e9);
        }
        
        dist[src] = 0;
        while(!st.isEmpty()) {
            int node = st.peek();
            st.pop();
            
            for(int i = 0; i<adj.get(node).size(); i++) {
                int v = adj.get(node).get(i).first;
                int wt = adj.get(node).get(i).second;
                
                if(dist[node] + wt < dist[v]) {
                    dist[v] = wt + dist[node];
                }
            }
        }
        return dist;
    }
}
class Pair {
    int first, second;
    Pair(int first, int second) { this.first = first; this.second = second; }
}`,
    desc: "Finding the Shortest Path in a Directed Acyclic Graph (DAG) can be done in O(V+E) using Topological Sort! Instead of Dijkstra's algorithm (which takes O(E log V)), we first completely order the nodes topologically using DFS. Then, we process them one by one from the stack, relaxing their adjacent edges. Because we process them in topological order, we guarantee that when we reach a node, we have already found the absolute shortest path to it!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|shortestPath|topoSort|node|it|adj|vis|st|dist|src|N|M|u|v|wt|first|second|Pair|edges|get|add|isEmpty|peek|pop|size|length|LinkedList|Queue|ArrayList|List|Integer|String)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List', 'Stack', 'Pair'].includes(part);
            const isPointer = ['adj', 'vis', 'node', 'it', 'N', 'M', 'i', 'st', 'dist', 'src', 'u', 'v', 'wt', 'first', 'second', 'edges', 'temp'].includes(part);
            const isMapCall = ['shortestPath', 'topoSort', 'add', 'remove', 'isEmpty', 'peek', 'pop', 'get', 'size', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"') || part === '1e9';
            
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

export default function ShortestPathDAGVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('shortestPathDAG');
  
  // Default: Matches the uploaded graph image exactly
  // Nodes: 7 (0-6). 
  // Edges: 6->4(2), 6->5(3), 5->4(1), 4->0(3), 4->2(1), 0->1(2), 1->3(1), 2->3(3)
  const [nInput, setNInput] = useState('7');
  const [srcInput, setSrcInput] = useState('6');
  const [edgesInput, setEdgesInput] = useState('6,4,2 | 6,5,3 | 5,4,1 | 4,0,3 | 4,2,1 | 0,1,2 | 1,3,1 | 2,3,3');

  const [baseN, setBaseN] = useState(7);
  const [baseSrc, setBaseSrc] = useState(6);
  // Store adj as {v, wt}
  const [baseAdj, setBaseAdj] = useState<{v: number, wt: number}[][]>([
      [{v: 1, wt: 2}, {v: 2, wt: 1}], // Default fallback
      [{v: 3, wt: 1}],
      [{v: 3, wt: 3}],
      [],
      [{v: 0, wt: 3}, {v: 2, wt: 1}],
      [{v: 4, wt: 1}],
      [{v: 4, wt: 2}, {v: 5, wt: 3}]
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let n = parseInt(nInput.trim(), 10);
        if (isNaN(n) || n <= 0 || n > 20) n = 7;
        
        let src = parseInt(srcInput.trim(), 10);
        if (isNaN(src) || src < 0 || src >= n) src = 0;

        let rows = edgesInput.split('|').map(r => r.trim());
        let tempAdj: {v: number, wt: number}[][] = Array.from({length: n}, () => []);
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let triple = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            // u, v, wt
            if (triple.length === 3 && !isNaN(triple[0]) && !isNaN(triple[1]) && !isNaN(triple[2])) {
                let u = triple[0], v = triple[1], wt = triple[2];
                if(u >= 0 && u < n && v >= 0 && v < n) {
                    tempAdj[u].push({v, wt});
                }
            }
        }

        setBaseN(n);
        setBaseSrc(src);
        setBaseAdj(tempAdj);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [edgesInput, nInput, srcInput]);

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
        const target = e.target as HTMLElement;
        if (!target.closest('.graph-canvas-area')) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone1D = (arr: any[]) => [...arr];

  // --- Graph Layout Mathematics ---
  const N = baseN;
  const graphRadius = Math.max(160, N * 35);
  const svgSize = graphRadius * 2 + 140; // Padding on all sides

  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(N).fill({x: 0, y: 0});
    if (N === 0) return pos;
    if (N === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < N; i++) {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN, graphRadius, N]);

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const N = baseN;
    const src = baseSrc;
    const M = adj.reduce((acc, curr) => acc + curr.length, 0);
    
    if (N === 0) return steps;

    // Local State Tracking
    let vis: number[] = Array(N).fill(0);
    let st: number[] = [];
    let dist: number[] = Array(N).fill(1e9);
    let callStack: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: adj.map(a => [...a]), N, src, st: [...st], callStack: [...callStack], vis: clone1D(vis), dist: clone1D(dist), ...stateObj } 
    });

    add("Function Call", `public int[] shortestPath(int N=${N}, int M=${M}, int[][] edges, int src=${src})\nInitiating Shortest Path algorithm on DAG.`, 13, { phase: 'init' });
    
    // Assume adj built
    add("Graph Created", `adj lists successfully constructed from raw edge pairs.`, 14, { phase: 'init_graph' });
    
    add("Init Visited & Stack", `int vis[] = new int[N];\nStack<Integer> st = new Stack<>();`, 26, { phase: 'init_ds' });

    const runTopoDFS = (node: number) => {
        callStack.push(node);
        add("DFS Enter", `private void topoSort(int node=${node}, ...)\nEntering recursion for node ${node}.`, 2, { phase: 'dfs_enter', activeNode: node, scanI: callStack[0] });
        
        vis[node] = 1;
        add("Mark Visited", `vis[node] = 1;`, 3, { phase: 'mark_vis', activeNode: node, scanI: callStack[0] });

        add("Neighbor Loop", `for(int i = 0; i<adj.get(node).size(); i++)\nIterating outgoing edges from node ${node}.`, 4, { phase: 'for_adj', activeNode: node, scanI: callStack[0] });

        for (let i = 0; i < adj[node].length; i++) {
            let v = adj[node][i].v;
            add("Extract Neighbor", `int v = adj.get(node).get(i).first;\nTarget neighbor is ${v}.`, 5, { phase: 'extract_adj', activeNode: node, checkNode: v, scanI: callStack[0] });

            if (vis[v] === 0) {
                add("Recursive DFS", `topoSort(v, adj, vis, st);\nNeighbor ${v} is unvisited. Plunging deeper!`, 7, { phase: 'call_dfs', activeNode: node, checkNode: v, scanI: callStack[0] });
                runTopoDFS(v);
                add("DFS Backtrack", `Returned safely to node ${node} after exploring neighbor ${v}.`, 4, { phase: 'dfs_backtrack', activeNode: node, checkNode: v, scanI: callStack[0] });
            } else {
                add("Skip Visited", `Neighbor ${v} is already visited. Safe cross-edge.`, 6, { phase: 'skip_adj', activeNode: node, checkNode: v, scanI: callStack[0] });
            }
        }

        st.push(node);
        add("Push to Stack", `st.add(node);\nFinished all descendants. Node ${node} pushed to Topo Sort stack.`, 10, { phase: 'push_stack', activeNode: node, scanI: callStack[0] });

        callStack.pop();
        add("DFS Return", `Popping from call stack.`, 11, { phase: 'dfs_exit', activeNode: node, scanI: callStack[0] || 0 });
    };

    for(let i = 0; i < N; i++) {
        add("Topo Scan Loop", `for(int i = 0; i<N; i++)\nChecking if node ${i} needs topological sorting.`, 28, { phase: 'for_i_topo', scanI: i });
        if(vis[i] === 0) {
            add("Trigger DFS", `if(vis[i] == 0) topoSort(i, adj, vis, st);\nNode ${i} is unvisited. Calling TopoSort DFS.`, 30, { phase: 'trigger_dfs', scanI: i });
            runTopoDFS(i);
        } else {
            add("Skip Topo DFS", `Node ${i} is already visited.`, 29, { phase: 'skip_topo', scanI: i });
        }
    }

    add("Init Distance Array", `int dist[] = new int[N];\nAllocated distance array.`, 34, { phase: 'init_dist' });
    
    add("Fill Distance Infinity", `for(int i = 0; i<N; i++) dist[i] = (int)(1e9);\nInitializing all shortest path distances to mathematically infinity.`, 35, { phase: 'fill_dist_inf' });
    
    dist[src] = 0;
    add("Set Source Distance", `dist[src] = 0;\nThe distance from the source node (${src}) to itself is always 0.`, 39, { phase: 'set_dist_src' });

    while(st.length > 0) {
        add("While Stack Loop", `while(!st.isEmpty())\nProcessing nodes in precise topological order from the stack.`, 40, { phase: 'while_st' });
        
        let node = st[st.length - 1];
        add("Peek Stack", `int node = st.peek();\nNode ${node} is next in topological sequence.`, 41, { phase: 'peek_st', activeNode: node });
        
        st.pop();
        add("Pop Stack", `st.pop();\nRemoved ${node} from stack.`, 42, { phase: 'pop_st', activeNode: node });

        add("Relaxation Loop", `for(int i = 0; i<adj.get(node).size(); i++)\nChecking all outgoing edges from node ${node} to relax distances.`, 44, { phase: 'for_relax', activeNode: node });

        for(let i = 0; i < adj[node].length; i++) {
            let v = adj[node][i].v;
            let wt = adj[node][i].wt;
            
            add("Extract Edge Data", `int v = ...first;\nint wt = ...second;\nEvaluating edge to neighbor ${v} with weight ${wt}.`, 45, { phase: 'extract_relax', activeNode: node, checkNode: v, wt });

            let currDistNode = dist[node] === 1e9 ? '∞' : dist[node];
            let currDistV = dist[v] === 1e9 ? '∞' : dist[v];
            let isRelaxable = dist[node] !== 1e9 && dist[node] + wt < dist[v];

            add("Evaluate Relaxation", `if(dist[node] + wt < dist[v])\nIs ${currDistNode} + ${wt} < ${currDistV}?`, 48, { phase: 'eval_relax', activeNode: node, checkNode: v, wt, isRelaxable });

            if(isRelaxable) {
                dist[v] = dist[node] + wt;
                add("Relax Distance!", `dist[v] = wt + dist[node];\nYES! Found a mathematically shorter path to node ${v}. Updating its distance to ${dist[v]}.`, 49, { phase: 'do_relax', activeNode: node, checkNode: v, wt, newDist: dist[v] });
            } else {
                add("Skip Relaxation", `NO. This path does not improve the shortest distance to node ${v}.`, 48, { phase: 'skip_relax', activeNode: node, checkNode: v, wt });
            }
        }
    }

    add("Empty Stack Exit", `while(!st.isEmpty())\nStack is completely empty. We have relaxed all possible paths optimally!`, 40, { phase: 'done_while' });
    add("Final Return", `return dist;\nAlgorithm complete. Returning the absolute shortest paths array.`, 53, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseAdj, baseSrc]);

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-amber-900 border-amber-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Route size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-amber-400`}>
                    <CheckCircle2 size={24}/> SHORTEST PATHS FOUND
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm successfully mapped optimal shortest paths from source {st.src}.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('dfs_enter') || String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-rose-400' : (String(st.phase || '').includes('push') || String(st.phase || '').includes('pop') || String(st.phase || '').includes('peek') ? 'text-fuchsia-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('scan') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-center justify-center gap-4 xl:gap-8 w-full p-4 overflow-x-auto">
          
          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><CheckSquare2 size={12}/> vis[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[200px] min-h-[60px]">
                  {st.vis === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.vis || []).map((val: number, idx: number) => {
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

          <div className="w-px h-16 bg-slate-200 shrink-0"></div>

          {/* dist[] Output Array Tracker */}
          <div className="flex flex-col items-center shrink-0 w-[280px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2"><Route size={12}/> dist[] Output (Shortest Paths)</span>
              <div className={`flex flex-col w-full bg-white border shadow-md rounded-2xl p-3 transition-all duration-500 ${st.isDone ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50' : 'border-slate-200'}`}>
                  
                  <div className="flex flex-wrap justify-center gap-1.5">
                      {st.dist === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Relaxation Phase...</span> : (st.dist || []).map((val: number, idx: number) => {
                          let isSource = idx === st.src;
                          let isInfinity = val === 1e9;
                          let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.checkNode === idx || (st.phase === 'set_dist_src' && isSource));
                          let isEvaluating = st.phase === 'eval_relax' && st.checkNode === idx;
                          
                          let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-amber-500 text-white border-amber-600 shadow-sm font-black";
                          
                          if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black";
                          if (isEvaluating) boxBg += " ring-2 ring-rose-400 scale-105";

                          return (
                              <div key={`dist-${idx}`} className="flex flex-col items-center relative">
                                  <span className={`text-[8px] font-mono font-bold mb-0.5 ${isSource ? 'text-amber-500' : 'text-slate-400'}`}>{isSource ? 'src' : idx}</span>
                                  <div className={`w-8 h-8 flex items-center justify-center font-mono text-sm rounded-lg border-2 transition-all duration-300 ${boxBg}`}>
                                      {isInfinity ? '∞' : val}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          {/* Adjacency List Component (with Weights!) */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (adj)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-1 relative min-h-[150px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs">Awaiting memory allocation...</span> : (st.adj || []).map((neighbors: {v: number, wt: number}[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;
                      let isScanRow = st.scanI === nodeIdx && (String(st.phase || '').includes('topo') || String(st.phase || '').includes('dfs'));
                      let highlightRow = isActiveRow || isScanRow;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-fuchsia-50 border border-fuchsia-200 shadow-sm' : (isScanRow ? 'bg-emerald-50 border border-emerald-200' : 'bg-transparent border border-transparent')}`}>
                              <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-fuchsia-500 text-white shadow-sm' : (isScanRow ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={isActiveRow ? 'text-fuchsia-400' : (isScanRow ? 'text-emerald-400' : 'text-slate-300')} />
                              <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                  {neighbors.map((neighborObj, nIdx: number) => {
                                      let isChecking = (isActiveRow || isScanRow) && st.checkNode === neighborObj.v;

                                      let neighborBg = 'transparent border border-transparent';
                                      let neighborText = highlightRow ? 'text-fuchsia-700' : 'text-slate-500';

                                      if (isChecking) {
                                          neighborBg = 'bg-sky-400 text-white shadow-sm scale-110 border border-sky-500';
                                          neighborText = 'text-white';
                                      }

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${neighborBg} ${neighborText}`}>
                                                  {neighborObj.v} <span className="text-[9px] opacity-70">wt:{neighborObj.wt}</span>
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

          {/* Stack Visualization */}
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
                          let isPopping = isTop && (st.phase === 'peek_st' || st.phase === 'pop_st');
                          
                          return (
                              <div key={`st-${i}-${val}`} className={`w-full py-2 flex items-center justify-center font-mono font-black rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-in slide-in-from-top-8 scale-110 z-10 relative' : (isPopping ? 'bg-amber-400 border-amber-500 text-white animate-pulse ring-4 ring-amber-200 scale-110 z-10 relative' : 'bg-slate-700 border-slate-800 text-white')}`}>
                                  {val}
                              </div>
                          )
                      })}
                  </div>
                  
                  <div className="w-full border-t-4 border-slate-300 mt-1"></div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">N:</span>
                          <span className="font-bold text-slate-700">{st.N !== undefined ? st.N : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">src:</span>
                          <span className="font-bold text-amber-500">{st.src !== undefined ? st.src : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">node (Active):</span>
                          <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-sky-500">v (Target):</span>
                          <span className="font-bold text-sky-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">wt (Weight):</span>
                          <span className="font-bold text-rose-700">{st.wt !== undefined ? st.wt : '-'}</span>
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
              
              {/* Distance Relaxation HUD */}
              {st.phase && st.phase.includes('relax') && st.activeNode !== undefined && st.checkNode !== undefined && (
                  <div className="absolute top-10 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Route size={14} className="text-amber-500"/> Edge Relaxation</span>
                      
                      <div className="flex items-center gap-4 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-fuchsia-500 mb-1">dist[{st.activeNode}]</span>
                              <span className="bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200">{st.dist[st.activeNode] === 1e9 ? '∞' : st.dist[st.activeNode]}</span>
                          </div>
                          <span className="text-slate-400 font-normal">+</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-rose-500 mb-1">wt</span>
                              <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">{st.wt}</span>
                          </div>
                          <span className="text-slate-400 font-normal">&lt;</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-sky-500 mb-1">dist[{st.checkNode}]</span>
                              <span className="bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">{st.dist[st.checkNode] === 1e9 ? '∞' : st.dist[st.checkNode]}</span>
                          </div>
                      </div>
                      
                      {st.phase === 'do_relax' && (
                          <div className="mt-6 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full border border-emerald-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16}/> Path Relaxed!</span>
                              <ArrowRight size={16} />
                              <span className="font-black font-mono">dist[{st.checkNode}] = {st.newDist}</span>
                          </div>
                      )}
                      {st.phase === 'skip_relax' && (
                          <div className="mt-6 flex items-center gap-3 bg-slate-100 text-slate-500 px-6 py-2 rounded-full border border-slate-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><X size={16}/> Condition False. Ignored.</span>
                          </div>
                      )}
                  </div>
              )}

              <div style={{ width: svgSize, height: svgSize }} className="relative origin-center">
                  
                  {/* Edges Layer */}
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return st.adj.map((neighbors: {v: number, wt: number}[], u: number) => (
                              neighbors.map((neighborObj) => {
                                  let v = neighborObj.v;
                                  let wt = neighborObj.wt;

                                  const edgeKey = `${u}-${v}`;
                                  if (renderedEdges.has(edgeKey)) return null;
                                  renderedEdges.add(edgeKey);
  
                                  const p1 = nodePositions[u];
                                  const p2 = nodePositions[v];
                                  if (!p1 || !p2) return null;

                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const angle = Math.atan2(dy, dx);
                                  
                                  const rOffset = 26; // Node radius (w-12 -> 48px -> radius 24) + small padding
                                  const startX = p1.x + rOffset * Math.cos(angle);
                                  const startY = p1.y + rOffset * Math.sin(angle);
                                  const targetX = p2.x - rOffset * Math.cos(angle);
                                  const targetY = p2.y - rOffset * Math.sin(angle);
  
                                  let isActiveChecking = st.activeNode === u && st.checkNode === v;
                                  let isScanChecking = st.scanI === u && st.checkNode === v;
  
                                  let strokeColor = "#cbd5e1"; // slate-300
                                  let strokeWidth = "3";
                                  let animClass = "";
                                  let labelClass = "bg-slate-100 text-slate-500 border-slate-200";
  
                                  if (isActiveChecking) {
                                      if(st.phase === 'do_relax') {
                                          strokeColor = "#10b981"; // emerald-500
                                          strokeWidth = "6";
                                          animClass = "animate-pulse";
                                          labelClass = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-lg";
                                      } else {
                                          strokeColor = "#f43f5e"; // rose-500 (evaluating)
                                          strokeWidth = "5";
                                          labelClass = "bg-rose-500 text-white border-rose-600 scale-110 shadow-md";
                                      }
                                  } else if (isScanChecking) {
                                      strokeColor = "#0ea5e9"; // sky-500 (DFS tracing)
                                      strokeWidth = "4";
                                      labelClass = "bg-sky-500 text-white border-sky-600 scale-110 shadow-md";
                                  }

                                  // Explicit arrow head drawing
                                  const arrowSize = isActiveChecking ? 16 : 14;
                                  const arrowAngle = Math.PI / 6; // 30 degrees
                                  const arrowP1 = `${targetX},${targetY}`;
                                  const arrowP2 = `${targetX - arrowSize * Math.cos(angle - arrowAngle)},${targetY - arrowSize * Math.sin(angle - arrowAngle)}`;
                                  const arrowP3 = `${targetX - arrowSize * Math.cos(angle + arrowAngle)},${targetY - arrowSize * Math.sin(angle + arrowAngle)}`;
  
                                  // Midpoint for the weight label
                                  const midX = (startX + targetX) / 2;
                                  const midY = (startY + targetY) / 2;

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
                                          <foreignObject x={midX - 15} y={midY - 15} width="30" height="30" className="overflow-visible">
                                              <div className={`w-full h-full flex items-center justify-center font-mono font-black text-[10px] rounded-full border shadow-sm transition-all duration-300 ${labelClass}`}>
                                                  {wt}
                                              </div>
                                          </foreignObject>
                                      </g>
                                  );
                              })
                          ));
                      })()}
                  </svg>

                  {/* Nodes Layer - Centered exactly on the coordinate space */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {nodePositions.map((pos, idx) => {
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isStacked = (st.st || []).includes(idx);
                        let isVisited = (st.vis || [])[idx] === 1;
                        let distValue = st.dist ? st.dist[idx] : 1e9;
                        let isInfinity = distValue === 1e9;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isStacked) {
                            bgClass = 'bg-slate-700 text-white border-slate-800 shadow-md opacity-90';
                        } else if (isVisited && !st.phase.includes('relax')) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isActive) {
                            ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isChecking) {
                            ringClass = 'ring-4 ring-rose-400 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        }

                        return (
                            <div 
                                key={`node-${idx}`}
                                className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none ${bgClass} ${ringClass} ${zIndex}`}
                                style={{ 
                                    left: `${pos.x}px`, 
                                    top: `${pos.y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {idx}
                                
                                {/* Label for Distance on Graph! */}
                                {st.phase && (st.phase.includes('relax') || st.phase === 'init_dist' || st.phase === 'fill_dist_inf' || st.phase === 'set_dist_src') && (
                                    <span className={`absolute -bottom-7 text-[10px] px-2 py-0.5 rounded font-black border shadow-sm uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${st.phase === 'do_relax' && isChecking ? 'bg-emerald-500 text-white border-emerald-600 scale-125 z-50' : 'bg-white text-amber-600 border-amber-200'}`}>
                                        d: {isInfinity ? '∞' : distValue}
                                    </span>
                                )}

                                {isStacked && !isActive && <span className="absolute -top-6 text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-black border border-slate-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Stacked</span>}
                                {idx === st.src && <span className="absolute -top-6 text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-black border border-amber-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Source</span>}
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
                  <span>Edge Relaxation via DFS</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Route size={28}/> Shortest Path in O(V+E) time!</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Finding the shortest path in a graph usually requires Dijkstra's Algorithm, which runs in <code>O(E log V)</code> time using a Priority Queue. However, if the graph is a <strong>Directed Acyclic Graph (DAG)</strong>, we can mathematically bypass the Priority Queue entirely!</p>
                        <p>By finding the <strong>Topological Sort</strong> of the DAG first, we create a linear ordering of vertices. If we process nodes strictly in this topological order, we guarantee that when we reach a node, we have already found the absolute shortest path to it. This allows us to find all shortest paths in strictly linear <code>O(V + E)</code> time.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Test Case 1 */}
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Diagram Match</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>N:</strong> 7<br/><strong>edges:</strong> [[6,4,2], [6,5,3], [5,4,1], [4,0,3], [4,2,1], [0,1,2], [1,3,1], [2,3,3]]<br/><strong>src:</strong> 6</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output (dist[]):</span>
                            <span className="text-slate-300 block mb-4 font-black">[5, 7, 3, 6, 2, 3, 0]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                From node 6, the shortest path to 4 is 2.<br/>
                                From 6 to 0 is 6&rarr;4&rarr;0 (2+3 = 5).<br/>
                                From 6 to 3 is 6&rarr;4&rarr;2&rarr;3 (2+1+3 = 6).
                            </span>
                        </div>

                        {/* Test Case 2 */}
                        <div className={`bg-slate-900 border-t-4 border-fuchsia-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-fuchsia-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Unreachable Nodes</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>N:</strong> 4<br/><strong>edges:</strong> [[0,1,2], [1,2,3], [1,3,1]]<br/><strong>src:</strong> 1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output (dist[]):</span>
                            <span className="text-slate-300 block mb-4 font-black">[∞, 0, 3, 1]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Starting at node 1, we can reach 2 (dist 3) and 3 (dist 1).<br/>
                                However, because edges are directed, we cannot travel backwards to node 0. Its distance remains Infinity (1e9).
                            </span>
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
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>N</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="7" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>src</label>
                            <input type="number" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-amber-600`} placeholder="6" />
                        </div>
                        <div className="space-y-1.5 md:col-span-4">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Edges (u, v, wt) | separator</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="6,4,2 | 6,5,3 | 5,4,1 | 4,0,3 | 4,2,1 | 0,1,2 | 1,3,1 | 2,3,3" />
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
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Route size={14} className={`text-${themeColor}-500`}/> DAG Shortest Path Visualizer</span>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <div className="flex bg-white/90 p-1.5 rounded-xl shadow-md border border-slate-200 backdrop-blur gap-1">
                                <button onClick={zoomIn} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Zoom In"><ZoomIn size={16}/></button>
                                <button onClick={zoomOut} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Zoom Out"><ZoomOut size={16}/></button>
                                <div className="w-px bg-slate-200 mx-1"></div>
                                <button onClick={handleReset} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Center Graph"><Crosshair size={16}/></button>
                            </div>
                        </div>

                        {/* Unbounded Graph Area */}
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            {renderMainGraphCanvas()}
                        </div>

                        {/* Safe Bottom Dock for Arrays */}
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>

                    {/* Right Panel for Sidebars */}
                    <div className="w-full xl:w-[320px] bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-4 overflow-y-auto">
                        {renderRightSidebar()}
                    </div>
                </div>

            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how Topological Sort mathematically defeats Dijkstra in Directed Acyclic Graphs.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-amber-500"/> Phase 1: Topological Sort (DFS)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In a general graph with weights, we use Dijkstra's algorithm. But if the graph is a DAG, we can use DFS to compute a Topological Sort in <code>O(V + E)</code> time. This sort ensures that if there's a path from <code>u &rarr; v</code>, then <code>u</code> will always appear before <code>v</code> in the array. This is a massive mathematical advantage!</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Route size={24} className="text-emerald-500"/> Phase 2: Sequential Relaxation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because we process the nodes strictly in Topological order, we mathematically guarantee that when we pop a node <code>u</code> to relax its edges, the absolute shortest path to <code>u</code> itself has <strong>already been found</strong>. There is no possible way a node processed later can point back to <code>u</code> to improve its distance (because the graph is acyclic!).</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>The initial Topological Sort takes <code>O(V + E)</code>. The edge relaxation loop pops every node exactly once and processes its outgoing edges, also taking <code>O(V + E)</code>. Thus, we achieve the absolute theoretical minimum bound for graph traversal.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>The <code>adj</code> Graph takes O(V+E) to store explicitly with weights. The <code>vis[]</code> array takes O(V). The DFS Call Stack takes O(V). The Output <code>dist[]</code> array takes O(V). Thus, total Space Complexity is bounded by O(V + E).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This algorithm is the holy grail of DAG optimization. Interviewers will test your understanding of WHY it beats Dijkstra's priority queue."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why is this better than Dijkstra's Algorithm?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Dijkstra's runs in O(E log V) because it uses a Priority Queue."</p>
                            <p>Dijkstra's has to constantly resort its Queue because it doesn't know if a better path to a node will be discovered later. By finding the Topological Sort first, we eliminate that uncertainty! We guarantee we only process a node once its shortest path is mathematically finalized, allowing us to drop the Priority Queue and achieve pure O(V + E) time."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Does this work if there are negative edge weights?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes! It works flawlessly with negative weights."</p>
                            <p>Dijkstra's algorithm famously fails with negative weights because its greedy assumption breaks. Bellman-Ford can handle negative weights but costs O(V * E) time. This Topo Sort method handles negative weights easily in O(V + E) time, making it incredibly powerful! (It only fails if there is a negative weight cycle, but by definition, a DAG has no cycles)."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>N:</label>
                          <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="7" />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>src:</label>
                          <input type="number" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-amber-600`} placeholder="6" />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="6,4,2 | 6,5,3 | ..." />
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
                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
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
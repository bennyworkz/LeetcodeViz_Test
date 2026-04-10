import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  primsAlgorithm: {
    id: 'primsAlgorithm',
    title: "Prim's Algorithm (MST)",
    icon: <NetworkIcon size={16} />,
    complexity: 'Time: O(E log V) | Space: O(V + E)',
    theme: 'emerald',
    code: `class Pair {
    int node;
    int distance;
    public Pair(int distance, int node) {
        this.node = node;
        this.distance = distance;
    }
}

class Solution {
    static int spanningTree(int V, ArrayList<ArrayList<ArrayList<Integer>>> adj) {
        PriorityQueue<Pair> pq = new PriorityQueue<Pair>((x,y) -> x.distance - y.distance);
        
        int[] vis = new int[V];
        pq.add(new Pair(0, 0));
        int sum = 0;
        while(pq.size() > 0) {
            int wt = pq.peek().distance;
            int node = pq.peek().node;
            pq.remove();
            
            if(vis[node] == 1) continue;
            vis[node] = 1;
            sum += wt;
            
            for(int i = 0; i<adj.get(node).size(); i++) {
                int edW = adj.get(node).get(i).get(1);
                int adjNode = adj.get(node).get(i).get(0);
                if(vis[adjNode] == 0) {
                    pq.add(new Pair(edW, adjNode));
                }
            }
        }
        return sum;
    }
}`,
    desc: "Prim's Algorithm is a greedy approach used to find the Minimum Spanning Tree (MST) of a weighted, undirected graph. It starts from an arbitrary node and continuously picks the smallest edge connecting any visited node to an unvisited node using a Priority Queue (Min-Heap). It guarantees that all vertices are connected with the absolute minimum total edge weight!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|spanningTree|adj|distance|node|Pair|LinkedList|Queue|PriorityQueue|ArrayList|List|Integer|String|pq|V|vis|sum|wt|edW|adjNode|add|isEmpty|peek|remove|length|size|get|continue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'Pair', 'List', 'ArrayList', 'PriorityQueue'].includes(part);
            const isPointer = ['adj', 'distance', 'node', 'pq', 'V', 'vis', 'sum', 'wt', 'edW', 'adjNode', 'x', 'y', 'i'].includes(part);
            const isMapCall = ['spanningTree', 'min', 'length', 'add', 'get', 'size', 'peek', 'remove'].includes(part);
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

export default function PrimsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOp = OPERATIONS['primsAlgorithm'];
  const themeColor = selectedOp.theme;

  const [vInput, setVInput] = useState('5');
  const [edgesInput, setEdgesInput] = useState('0,1,2 | 0,3,6 | 1,2,3 | 1,3,8 | 1,4,5 | 2,4,7');

  const [baseV, setBaseV] = useState(5);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], [1, 4, 5], [2, 4, 7]
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
      setEdgesInput('0,1,2 | 0,3,6 | 1,2,3 | 1,3,8 | 1,4,5 | 2,4,7');
  };

  const loadTestCase2 = () => {
      setVInput('4');
      setEdgesInput('0,1,5 | 1,2,3 | 0,2,1 | 0,3,4 | 2,3,2');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let v = parseInt(vInput.trim(), 10);
        if (isNaN(v) || v <= 0) v = 5;

        let rows = edgesInput.split('|').map(r => r.trim());
        let parsedEdges: number[][] = [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(',').map(s => parseInt(s.trim(), 10));
            if (cells.length === 3 && cells[0] < v && cells[1] < v) {
                parsedEdges.push(cells);
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

  // --- TRACE GENERATION (PRIM'S ALGORITHM) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const V = baseV;
    const edges = baseEdges;
    
    if (V === 0) return steps;

    let adj: {v: number, wt: number}[][] = Array.from({length: V}, () => []);
    for (let e of edges) {
        adj[e[0]].push({v: e[1], wt: e[2]});
        adj[e[1]].push({v: e[0], wt: e[2]});
    }

    let pq: {wt: number, node: number, parent: number}[] = [];
    let vis = Array(V).fill(0);
    let mstEdges: string[] = [];
    let sum = 0;

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: adj.map(a=>[...a]), originalEdges: edges, V, pq: [...pq], vis: clone1D(vis), mstEdges: [...mstEdges], sum, ...stateObj } 
    });

    add("Function Call", `static int spanningTree(int V, ArrayList<ArrayList<ArrayList<Integer>>> adj)\nInitiating Prim's Algorithm.`, 11, { phase: 'init' });
    
    add("Init Priority Queue", `PriorityQueue<Pair> pq = new PriorityQueue<Pair>((x,y) -> x.distance - y.distance);`, 12, { phase: 'init_pq' });
    
    add("Init Visited Array", `int[] vis = new int[V];`, 14, { phase: 'init_vis' });

    pq.push({wt: 0, node: 0, parent: -1});
    add("Add Source to PQ", `pq.add(new Pair(0, 0));`, 15, { phase: 'add_src' });

    add("Init Sum", `int sum = 0;`, 16, { phase: 'init_sum' });

    let safety = 0;
    while(pq.length > 0 && safety < 1000) {
        safety++;
        add("While PQ Not Empty", `while(pq.size() > 0)`, 17, { phase: 'while_loop' });
        
        let it = pq[0];
        let wt = it.wt;
        let node = it.node;
        let parent = it.parent;

        add("Peek Weight", `int wt = pq.peek().distance; // wt = ${wt}`, 18, { phase: 'peek_wt', activeNode: node, activeWt: wt, activeParent: parent });
        add("Peek Node", `int node = pq.peek().node; // node = ${node}`, 19, { phase: 'peek_node', activeNode: node, activeWt: wt, activeParent: parent });
        
        pq.shift();
        add("Remove from PQ", `pq.remove();`, 20, { phase: 'remove_pq', activeNode: node, activeWt: wt, activeParent: parent });

        let isVis = vis[node] === 1;
        add("Check Visited", `if(vis[node] == 1) continue;\nIs node ${node} already in the MST? ${isVis ? 'Yes, skipping' : 'No, processing'}`, 22, { phase: 'check_vis', activeNode: node, activeWt: wt, activeParent: parent, isVis });

        if (isVis) continue;

        vis[node] = 1;
        if(parent !== -1) {
            mstEdges.push(`${Math.min(node, parent)}-${Math.max(node, parent)}`);
        }
        add("Mark Visited (Add to MST)", `vis[node] = 1;\nNode ${node} officially becomes part of the Minimum Spanning Tree.`, 23, { phase: 'mark_vis', activeNode: node, activeWt: wt, activeParent: parent });

        sum += wt;
        add("Add Weight to Sum", `sum += wt;\nAdding ${wt} to total sum. Current sum: ${sum}.`, 24, { phase: 'add_sum', activeNode: node, activeWt: wt, activeParent: parent });

        add("Iterate Neighbors Loop", `for(int i = 0; i<adj.get(node).size(); i++)`, 26, { phase: 'for_loop', activeNode: node, activeWt: wt, activeParent: parent });

        for(let i=0; i<adj[node].length; i++) {
            let neighbor = adj[node][i];
            let edW = neighbor.wt;
            let adjNode = neighbor.v;

            add("Extract Edge Weight", `int edW = adj.get(node).get(i).get(1); // edW = ${edW}`, 27, { phase: 'ext_edW', activeNode: node, activeWt: wt, activeParent: parent, activeAdjNode: adjNode, activeEdW: edW });
            add("Extract Neighbor Node", `int adjNode = adj.get(node).get(i).get(0); // adjNode = ${adjNode}`, 28, { phase: 'ext_adjNode', activeNode: node, activeWt: wt, activeParent: parent, activeAdjNode: adjNode, activeEdW: edW });

            let adjVis = vis[adjNode] === 1;
            add("Check Neighbor Visited", `if(vis[adjNode] == 0)\nIs neighbor ${adjNode} already in the MST? ${adjVis ? 'Yes, ignore' : 'No, valid candidate'}`, 29, { phase: 'check_adj_vis', activeNode: node, activeWt: wt, activeParent: parent, activeAdjNode: adjNode, activeEdW: edW, adjVis });

            if (!adjVis) {
                pq.push({wt: edW, node: adjNode, parent: node});
                pq.sort((a,b) => a.wt - b.wt); // Min-Heap property
                add("Add Neighbor to PQ", `pq.add(new Pair(edW, adjNode));\nAdded potential MST edge (${node}->${adjNode}) with weight ${edW} to PQ.`, 30, { phase: 'add_pq', activeNode: node, activeWt: wt, activeParent: parent, activeAdjNode: adjNode, activeEdW: edW });
            }
        }
    }

    add("Return Final Sum", `return sum;\nAll nodes connected! Total MST weight is ${sum}.`, 34, { phase: 'done', isDone: true, isSuccess: true, finalSum: sum });

    return steps;
  }, [baseV, baseEdges]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x:0, y:0}); 
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

  // Undirected Graph Layout Mathematics (Absolute Coordinates)
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseV).fill({x: 0, y: 0});
    const center = svgSize / 2;
    if (baseV === 0) return pos;
    if (baseV === 1) return [{x: center, y: center}];

    const radius = Math.min(220, Math.max(140, baseV * 30));
    for (let i = 0; i < baseV; i++) {
        const angle = (i / baseV) * 2 * Math.PI - Math.PI / 2; 
        pos[i] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseV]);

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
                    <CheckCircle2 size={24}/> MST SUCCESSFULLY BUILT
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. The absolute minimum total weight required to connect all vertices is {curStepData.state?.finalSum}!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('mark') || String(st.phase || '').includes('add_sum') ? 'text-emerald-400' : (String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('peek') || String(st.phase || '').includes('remove') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.originalEdges === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Dynamic Graph Visualization - NO BACKGROUND WRAPPER */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          const renderedEdges = new Set<string>();

                          return st.originalEdges.map((f: any, idx: number) => {
                              let u = f[0], v = f[1], wt = f[2];
                              
                              const edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
                              if (renderedEdges.has(edgeKey)) return null;
                              renderedEdges.add(edgeKey);

                              const p1 = nodePositions[u];
                              const p2 = nodePositions[v];
                              if (!p1 || !p2) return null;

                              const dx = p2.x - p1.x;
                              const dy = p2.y - p1.y;
                              const angle = Math.atan2(dy, dx);
                              const rOffset = 26; 
                              
                              const startX = p1.x + rOffset * Math.cos(angle);
                              const startY = p1.y + rOffset * Math.sin(angle);
                              const targetX = p2.x - rOffset * Math.cos(angle);
                              const targetY = p2.y - rOffset * Math.sin(angle);
                              
                              const midX = (startX + targetX) / 2;
                              const midY = (startY + targetY) / 2;

                              let isMST = st.mstEdges?.includes(edgeKey);
                              let isActiveEval = st.phase?.includes('ext') || st.phase?.includes('check_adj') || st.phase === 'add_pq';
                              let isEvaluating = isActiveEval && ((st.activeNode === u && st.activeAdjNode === v) || (st.activeNode === v && st.activeAdjNode === u));

                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let animClass = "";
                              let labelClass = "bg-white text-slate-400 border-slate-200";

                              if (isMST) {
                                  strokeColor = "#10b981"; // Emerald
                                  strokeWidth = "5";
                                  labelClass = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                              } else if (isEvaluating) {
                                  strokeColor = "#d946ef"; // Fuchsia
                                  strokeWidth = "5";
                                  animClass = "animate-pulse";
                                  labelClass = "bg-fuchsia-500 text-white border-fuchsia-600 scale-125 shadow-lg";
                              }

                              return (
                                  <g key={`edge-${edgeKey}`} className={`transition-all duration-300 ${animClass}`}>
                                      <line 
                                          x1={startX} y1={startY} x2={targetX} y2={targetY}
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                      />
                                      <foreignObject x={midX - 12} y={midY - 12} width="24" height="24" className="overflow-visible">
                                          <div className={`w-full h-full flex items-center justify-center font-mono font-black text-[10px] rounded-full border shadow-sm transition-all duration-300 ${labelClass}`}>
                                              {wt}
                                          </div>
                                      </foreignObject>
                                  </g>
                              );
                          });
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        let isVisited = st.vis && st.vis[idx] === 1;
                        let isActive = st.activeNode === idx && !st.phase?.includes('adjNode');
                        let isAdjTarget = st.activeAdjNode === idx;

                        let bgClass = 'bg-slate-100 text-slate-500 border-slate-300 shadow-sm opacity-90';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isVisited) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg opacity-100 scale-105';
                        }
                        
                        if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl opacity-100 scale-125';
                            ringClass = 'ring-4 ring-fuchsia-200 ring-offset-2 border-transparent animate-pulse';
                            zIndex = 'z-50';
                        } else if (isAdjTarget) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl opacity-100 scale-110';
                            ringClass = 'ring-2 ring-sky-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isVisited && !isActive && <span className="absolute -top-2 -right-2 text-[10px] text-white bg-emerald-500 p-0.5 rounded-full shadow-sm"><Check size={12}/></span>}
                            </div>
                        );
                    })}
                  </div>
              </div>

          </div>
      );
  };

  const renderStateArrays = () => {
    if (!st.vis) return null;
    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[120px] relative z-30 bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] shrink-0">
            <div className="flex flex-col items-center shrink-0 w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> vis[] Array (Included in MST)</span>
                <div className="flex gap-2 items-end">
                    {st.vis.map((val: number, idx: number) => {
                        let isNewlyWritten = st.phase === 'mark_vis' && st.activeNode === idx;
                        let isEval = st.phase?.includes('check_vis') && st.activeNode === idx;
                        let isAdjEval = st.phase?.includes('check_adj_vis') && st.activeAdjNode === idx;

                        let boxBg = val === 0 ? "bg-white text-slate-400 border-slate-200 border-dashed" : "bg-emerald-500 text-white border-emerald-600 shadow-md font-black";
                        
                        if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                        else if (isEval || isAdjEval) boxBg += " ring-4 ring-amber-400 scale-105 z-10 animate-pulse";

                        return (
                            <div key={`vis-${idx}`} className="flex flex-col items-center relative group mt-2">
                                <div className={`w-14 h-12 flex items-center justify-center font-mono text-xl rounded border-2 transition-all duration-300 ${boxBg}`}>
                                    {val}
                                </div>
                                <span className={`absolute top-full mt-2 px-2 py-0.5 rounded border shadow-sm text-[10px] font-mono font-black ${val === 1 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                                    Node {idx}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
  };

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Settings2 size={12}/> Global Tracker</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 font-mono">
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex justify-between">
                          Total MST Weight 
                          {st.phase === 'add_sum' && <span className="text-emerald-500 text-[10px]">+ {st.activeWt}</span>}
                      </span>
                      <span className={`text-4xl font-black ${st.phase === 'add_sum' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>{st.sum !== undefined ? st.sum : '-'}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (ADJ)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[100px] max-h-[200px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined || st.adj.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.adj || []).map((neighbors: {v: number, wt: number}[], nodeIdx: number) => {
                      let isActiveRow = st.phase?.includes('for_loop') && st.activeNode === nodeIdx;
                      let isExtractingRow = (st.phase?.includes('ext') || st.phase?.includes('check_adj') || st.phase === 'add_pq') && st.activeNode === nodeIdx;
                      let isRowLit = isActiveRow || isExtractingRow;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-start gap-3 transition-all duration-300 ${isRowLit ? 'bg-fuchsia-50/50 p-2 -m-2 rounded-xl border border-fuchsia-100' : ''}`}>
                              <div className={`w-7 h-7 shrink-0 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isRowLit ? 'bg-fuchsia-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={`mt-1.5 shrink-0 ${isRowLit ? 'text-fuchsia-400' : 'text-slate-300'}`} />
                              <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center font-mono text-[11px] leading-tight pt-1.5">
                                  <span className="text-slate-400 text-sm">{'{'}</span>
                                  {neighbors.length === 0 && <span className="text-slate-400 italic text-[10px]">empty</span>}
                                  {neighbors.map((neighborObj, nIdx) => {
                                      let isChecking = isExtractingRow && st.activeAdjNode === neighborObj.v;
                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`flex items-center gap-1 transition-all ${isChecking ? 'text-sky-700 font-black bg-sky-100 px-1.5 py-0.5 rounded shadow-sm scale-110' : 'text-slate-600 font-bold'}`}>
                                                  {neighborObj.v} <span className={`font-medium ml-0.5 ${isChecking ? 'text-sky-500' : 'text-slate-400'}`}>wt:{neighborObj.wt}</span>
                                              </span>
                                              {nIdx < neighbors.length - 1 && <span className="text-slate-300 font-sans">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 text-sm">{'}'}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Min-Heap (pq)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (MIN WT)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.pq === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.pq || []).map((pair: {wt: number, node: number, parent: number}, i: number) => {
                          let isNewArrival = st.phase === 'add_pq' && pair.node === st.activeAdjNode && pair.wt === st.activeEdW;
                          let isTop = i === 0;
                          let isPopping = isTop && (st.phase === 'peek_wt' || st.phase === 'peek_node' || st.phase === 'remove_pq');
                          
                          return (
                              <div key={`qt-${i}-${pair.node}-${pair.wt}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-sky-500 border-sky-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse ring-4 ring-fuchsia-200 scale-105 z-10 relative' : (isTop ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">wt: {pair.wt}</span>
                                  <div className="flex flex-col text-right">
                                      <span className="text-sm tracking-widest leading-none">node: {pair.node}</span>
                                      {pair.parent !== -1 && <span className="text-[8px] opacity-60 mt-0.5 uppercase tracking-widest">via {pair.parent}</span>}
                                  </div>
                              </div>
                          )
                      })}
                      {st.pq !== undefined && st.pq.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">node (Active):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest text-lg">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-fuchsia-500 font-bold">wt:</span>
                          <span className="font-bold text-fuchsia-700 text-lg">{st.activeWt !== undefined ? st.activeWt : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-sky-500 font-bold">adjNode (Neighbor):</span>
                          <span className="font-bold text-sky-700 uppercase tracking-widest text-lg">{st.activeAdjNode !== undefined ? st.activeAdjNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-sky-500 font-bold">edW (Edge Wt):</span>
                          <span className="font-bold text-sky-700 text-lg">{st.activeEdW !== undefined ? st.activeEdW : '-'}</span>
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
                  <span>Greedy Min-Heap Edge Expansion</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><NetworkIcon size={28}/> Minimum Spanning Tree</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p><strong>Prim's Algorithm</strong> is an elegant greedy method used to construct the Minimum Spanning Tree (MST) of a connected, undirected, weighted graph.</p>
                        <p>It maintains two sets of vertices: those included in the MST (tracked by a <code>vis[]</code> array), and those not yet included. At every step, it considers all edges that connect the MST set to the non-MST set, and greedily picks the edge with the <strong>minimum weight</strong>.</p>
                        <p>We use a Priority Queue (Min-Heap) to efficiently fetch this minimum edge! The moment a node is popped, we add it to the MST, add its weight to our total sum, and enqueue all of its unvisited neighbors.</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Graph</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 5<br/><strong>Edges:</strong> [0,1,2], [0,3,6], [1,2,3], [1,3,8], [1,4,5], [2,4,7]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">16</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The MST consists of edges (0,1) wt:2, (1,2) wt:3, (1,4) wt:5, and (0,3) wt:6. Total sum = 16.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Redundant Cycle</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 4<br/><strong>Edges:</strong> [0,1,5], [1,2,3], [0,2,1], [0,3,4], [2,3,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">6</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The algorithm successfully ignores heavy redundant edges like (0,1 wt:5) and (0,3 wt:4), choosing the optimal tree: (0,2 wt:1), (2,3 wt:2), and (2,1 wt:3). Total sum = 6.</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
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
                                <CheckCircle2 size={24}/> MST SUCCESSFULLY BUILT
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Algorithm concluded. The absolute minimum total weight required to connect all vertices is {curStepData.state?.finalSum}!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('mark') || String(st.phase || '').includes('add_sum') ? 'text-emerald-400' : (String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('peek') || String(st.phase || '').includes('remove') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>V (Nodes)</label>
                            <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Edges [u, v, wt]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
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
                        <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                            {renderMainCanvas()}
                        </div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Minimum Spanning Trees and Prim's Greedy Approach.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><NetworkIcon size={24} className="text-emerald-500"/> What is a Minimum Spanning Tree?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Given a connected, undirected graph, a spanning tree is a subgraph that includes all the vertices without any cycles. A <strong>Minimum Spanning Tree (MST)</strong> is the spanning tree where the sum of the edge weights is as small as mathematically possible. It has exactly <code>V-1</code> edges.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Compass size={24} className="text-fuchsia-500"/> The Greedy Choice (Prim's Logic)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Prim's operates by growing a single tree. We start with a random node (usually 0). At every step, we look at all the edges connecting our growing tree to nodes that are NOT YET in the tree. We greedily pick the edge with the absolute minimum weight using a <strong>Min-Heap Priority Queue</strong>. Because we always safely pick the cheapest bridge connecting the unknown, we are guaranteed to construct an optimal MST.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(E log V)</strong><br/>In the worst case, we might add every single edge (E) to the priority queue. Inserting/extracting from a heap takes logarithmic time relative to the number of vertices. Thus, the strict bound is $O(E \log V)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>The space is dictated by the Adjacency List $O(V + E)$, the Priority Queue $O(E)$, and the `vis` array $O(V)$. Overall memory requirement scales to $O(V + E)$.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Prim's and Kruskal's are the two titans of MSTs. Interviewers love testing if you understand the core difference between Prim's Node-centric growth vs Kruskal's Edge-centric sorting."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we check `vis[node] == 1` immediately after popping from the Queue?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To safely handle stale edges without updating the heap."</p>
                            <p>As we explore the graph, we might push multiple edges leading to the same target node into the PQ. When the absolute shortest one is popped, the target node is marked visited and added to the MST. Later, the slower redundant edges will eventually surface to the top of the PQ. By checking `vis[node]`, we instantly discard them in $O(1)$ time, preventing cycles and redundant additions!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "How does Prim's compare to Dijkstra's? They look almost identical!"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The difference lies in what the Priority Queue sorts by."</p>
                            <p>Dijkstra's PQ stores the <strong>accumulated distance</strong> from the source node (`dist[u] + wt`). Prim's PQ strictly stores ONLY the <strong>standalone weight</strong> of the edge (`wt`). Prim's only cares about the cheapest bridge to the next node, ignoring how far away it is from the original starting point!"</p>
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
                                    <CheckCircle2 size={24}/> MST SUCCESSFULLY BUILT
                                </div>
                                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                    Algorithm concluded. The absolute minimum total weight required to connect all vertices is {curStepData.state?.finalSum}!
                                </p>
                             </div>
                        ) : (
                            <>
                                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('mark') || String(st.phase || '').includes('add_sum') ? 'text-emerald-400' : (String(st.phase || '').includes('check') ? 'text-amber-400' : (String(st.phase || '').includes('peek') || String(st.phase || '').includes('remove') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
                            </>
                        )}
                    </div>

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
                          <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={handleReset} title="Restart Simulation" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
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
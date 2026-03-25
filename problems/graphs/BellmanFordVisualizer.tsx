import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, PlusSquare, RefreshCw
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bellmanFord: {
    id: 'bellmanFord',
    title: 'Bellman-Ford Algorithm',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(V × E) | Space: O(V)',
    theme: 'indigo',
    code: `class Solution {
    static int[] bellman_ford(int V, ArrayList<ArrayList<Integer>> edges, int S) {
        int[] dist = new int[V];
        for(int i = 0; i < V; i++) dist[i] = (int)(1e8);
        dist[S] = 0;
        
        for(int i = 0; i < V - 1; i++) {
            for(ArrayList<Integer> it : edges) {
                int u = it.get(0);
                int v = it.get(1);
                int wt = it.get(2);
                if(dist[u] != 1e8 && dist[u] + wt < dist[v]) {
                    dist[v] = dist[u] + wt;
                }
            }
        }
        
        for(ArrayList<Integer> it: edges) {
            int u = it.get(0);
            int v = it.get(1);
            int wt = it.get(2);
            if(dist[u] != 1e8 && dist[u] + wt < dist[v]) {
                int temp[] = new int[1];
                temp[0] = -1;
                return temp;
            }
        }
        return dist;
    }
}`,
    desc: "The Bellman-Ford algorithm computes shortest paths from a single source vertex to all other vertices in a weighted digraph. Unlike Dijkstra's, it gracefully handles negative edge weights! It operates on a simple principle: if you exhaustively relax ALL edges V-1 times, you guarantee the absolute shortest path is found. A final Vth relaxation uniquely detects if a Negative Weight Cycle exists."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|bellman_ford|edges|ArrayList|List|Integer|String|V|S|dist|u|v|wt|it|add|isEmpty|peek|remove|length|size|get|continue|temp)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'ArrayList', 'List'].includes(part);
            const isPointer = ['edges', 'V', 'S', 'dist', 'u', 'v', 'wt', 'it', 'i', 'temp'].includes(part);
            const isMapCall = ['bellman_ford', 'add', 'remove', 'isEmpty', 'peek', 'length', 'size', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"') || part === '1e8';
            
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

export default function BellmanFordVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('bellmanFord');
  
  const [vInput, setVInput] = useState('5');
  const [edgesInput, setEdgesInput] = useState('0,1,5 | 1,2,-2 | 2,4,3 | 3,2,6 | 3,4,-2 | 1,3,2');
  const [srcInput, setSrcInput] = useState('0');

  const [baseV, setBaseV] = useState(5);
  const [baseEdges, setBaseEdges] = useState<number[][]>([
      [0,1,5], [1,2,-2], [2,4,3], [3,2,6], [3,4,-2], [1,3,2]
  ]);
  const [baseSrc, setBaseSrc] = useState(0);

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

  const loadTestCase1 = () => {
      setVInput('5');
      setEdgesInput('0,1,5 | 1,2,-2 | 2,4,3 | 3,2,6 | 3,4,-2 | 1,3,2');
      setSrcInput('0');
  };

  const loadTestCase2 = () => {
      // Negative Cycle
      setVInput('4');
      setEdgesInput('0,1,1 | 1,2,-1 | 2,3,-1 | 3,1,-1');
      setSrcInput('0');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let v = parseInt(vInput.trim(), 10);
        if (isNaN(v) || v <= 0) v = 5;
        let s = parseInt(srcInput.trim(), 10);
        if (isNaN(s) || s < 0 || s >= v) s = 0;

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
        setBaseSrc(s);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [vInput, edgesInput, srcInput]);

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

  // Generate trace strictly aligned with Java code Line numbers!
  const trace = useMemo(() => {
    const steps: any[] = [];
    const V = baseV;
    const edges = baseEdges;
    const S = baseSrc;
    
    if (V === 0) return steps;

    let dist: number[] = Array(V).fill(1e8);
    let distHistory: number[][] = Array.from({length: V}, () => []);

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { dist: clone1D(dist), distHistory: distHistory.map(a => [...a]), V, edges, S, ...stateObj } 
    });

    add("Function Call", `static int[] bellman_ford(int V=${V}, edges, int S=${S})\nInitiating Bellman Ford Algorithm.`, 2, { phase: 'init' });
    
    add("Init Dist Array", `int[] dist = new int[V];\nAllocated array to track minimum distances from source.`, 3, { phase: 'init_ds' });
    
    for(let i=0; i<V; i++) dist[i] = 1e8;
    add("Set Dist Infinity", `for(int i = 0; i < V; i++) dist[i] = (int)(1e8);\nAll node distances initialized to mathematical infinity.`, 4, { phase: 'dist_set_inf' });

    dist[S] = 0;
    distHistory[S].push(0);
    add("Set Source Dist", `dist[S] = 0;\nDistance from source ${S} to itself is strictly 0.`, 5, { phase: 'set_dist_src' });

    // V-1 Relaxations
    for(let i = 0; i < V - 1; i++) {
        add("Outer Loop Phase", `for(int i = 0; i < V - 1; i++)\nStarting Full Edge Relaxation Phase ${i+1} of ${V-1}.`, 7, { phase: 'outer_loop', loopI: i });
        
        for(let eIdx = 0; eIdx < edges.length; eIdx++) {
            let u = edges[eIdx][0];
            let v = edges[eIdx][1];
            let wt = edges[eIdx][2];

            add("Extract Edge", `int u = it.get(0);\nint v = it.get(1);\nint wt = it.get(2);\nEvaluating edge ${u} \u2192 ${v} with weight ${wt}.`, 9, { phase: 'extract_edge', loopI: i, eIdx, u, v, wt });

            let isReachable = dist[u] !== 1e8;
            let isRelaxable = isReachable && (dist[u] + wt < dist[v]);

            let evalDesc = `if(dist[u] != 1e8 && dist[u] + wt < dist[v])\nEvaluating: (${dist[u] === 1e8 ? '∞' : dist[u]} != ∞) AND (${dist[u] === 1e8 ? '∞' : dist[u]} + ${wt} < ${dist[v] === 1e8 ? '∞' : dist[v]})`;
            
            if (!isReachable) evalDesc += `\nFAILED: Node ${u} is currently completely unreachable from Source!`;
            else if (!isRelaxable) evalDesc += `\nFAILED: Not a strictly shorter path.`;
            else evalDesc += `\nPASSED! Found a strictly shorter path to node ${v}.`;

            add("Evaluate Relaxation", evalDesc, 12, { phase: 'eval_relax', loopI: i, eIdx, u, v, wt, isReachable, isRelaxable });

            if (isRelaxable) {
                if (dist[v] !== 1e8) distHistory[v].push(dist[v]);
                dist[v] = dist[u] + wt;
                add("Relax Distance", `dist[v] = dist[u] + wt;\nUpdated minimum cost to reach ${v} to ${dist[v]}.`, 13, { phase: 'do_relax', loopI: i, eIdx, u, v, wt, newDist: dist[v] });
            }
        }
    }

    add("Cycle Detection Phase", `// Nth relaxation to check negative cycle\nInitiating the Vth and final exhaustive edge check.`, 18, { phase: 'cycle_phase' });

    let hasCycle = false;
    for(let eIdx = 0; eIdx < edges.length; eIdx++) {
        let u = edges[eIdx][0];
        let v = edges[eIdx][1];
        let wt = edges[eIdx][2];

        add("Extract Edge (Nth)", `int u = it.get(0); ...\nEvaluating edge ${u} \u2192 ${v} with weight ${wt} for cycle detection.`, 19, { phase: 'extract_edge_nth', eIdx, u, v, wt });

        let isReachable = dist[u] !== 1e8;
        let isRelaxable = isReachable && (dist[u] + wt < dist[v]);

        add("Evaluate Cycle Relaxation", `if(dist[u] != 1e8 && dist[u] + wt < dist[v])\nIf this edge CAN STILL BE RELAXED after V-1 passes, a negative cycle mathematically MUST exist!`, 22, { phase: 'eval_relax_nth', eIdx, u, v, wt, isReachable, isRelaxable });

        if (isRelaxable) {
            hasCycle = true;
            add("Create Error Array", `int temp[] = new int[1];\ntemp[0] = -1;\nNegative cycle definitively detected! Formulating error response.`, 23, { phase: 'cycle_detected', eIdx, u, v, wt });
            add("Return Negative Cycle", `return temp;\nTerminating early. Shortest paths are impossible due to infinite negative looping.`, 25, { phase: 'done', isDone: true, isSuccess: false, hasCycle: true });
            break;
        }
    }

    if (!hasCycle) {
        add("Final Return", `return dist;\nVth relaxation pass yielded no updates. All shortest paths strictly finalized!`, 28, { phase: 'done', isDone: true, isSuccess: true, finalDist: dist });
    }

    return steps;
  }, [baseV, baseEdges, baseSrc]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x:0, y:0}); 
    setZoom(0.85); 
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
  const resetPanZoom = () => { setPan({x:0, y:0}); setZoom(0.85); };
  
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

  // Directed Graph Layout Mathematics
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseV).fill({x: 0, y: 0});
    const center = svgSize / 2;
    if (baseV === 0) return pos;
    if (baseV === 1) return [{x: center, y: center}];

    const radius = Math.min(220, Math.max(120, baseV * 25));
    for (let i = 0; i < baseV; i++) {
        const angle = (i / baseV) * 2 * Math.PI + Math.PI; 
        pos[i] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseV]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><RefreshCw size={100} className="text-white"/></div>
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
                    {st.isSuccess ? "OPTIMAL DISTANCES FINALIZED" : "NEGATIVE CYCLE DETECTED"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `Algorithm perfectly concluded. All shortest paths calculated safely.` : `A catastrophic Negative Weight Cycle was found. Paths can loop infinitely towards $-\\infty$, rendering shortest paths mathematically impossible! Returned [-1].`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-amber-400' : (String(st.phase || '').includes('outer_loop') || String(st.phase || '').includes('cycle_phase') ? 'text-indigo-400' : (String(st.phase || '').includes('extract') ? 'text-cyan-400' : 'text-white')))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Edges Array (V x E Exhaustion)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-1.5 relative min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-thin">
                  {st.edges === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.edges || []).map((eData: number[], eIdx: number) => {
                      let u = eData[0];
                      let v = eData[1];
                      let wt = eData[2];

                      let isActiveRow = st.eIdx === eIdx;
                      let isNegative = wt < 0;

                      return (
                          <div key={`e-${eIdx}`} className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 ${isActiveRow ? 'bg-indigo-50 border border-indigo-200 shadow-sm scale-[1.02] z-10' : 'bg-slate-50/50 border border-transparent hover:bg-slate-50'}`}>
                              <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                      {u}
                                  </div>
                                  <ArrowRight size={16} className={isActiveRow ? 'text-indigo-400' : 'text-slate-300'} />
                                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                      {v}
                                  </div>
                              </div>
                              <div className={`px-3 py-1 rounded-lg font-mono font-black text-sm border shadow-sm ${isNegative ? (isActiveRow ? 'bg-rose-500 text-white border-rose-600' : 'bg-rose-100 text-rose-600 border-rose-200') : (isActiveRow ? 'bg-indigo-200 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-500 border-slate-200')}`}>
                                  wt: {wt}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">V (Nodes):</span>
                          <span className="font-bold text-slate-700">{st.V !== undefined ? st.V : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">E (Edges):</span>
                          <span className="font-bold text-slate-700">{st.edges ? st.edges.length : '-'}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-indigo-500">i (Relaxation Phase):</span>
                          <span className="font-bold text-indigo-700 uppercase tracking-widest text-sm">{st.loopI !== undefined ? `${st.loopI + 1} of ${st.V - 1}` : (st.phase && st.phase.includes('nth') ? 'FINAL (Vth)' : '-')}</span>
                      </div>

                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-cyan-500">u (Source):</span>
                          <span className="font-bold text-cyan-700 uppercase tracking-widest">{st.u !== undefined ? st.u : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 mt-1">
                          <span className="text-emerald-500">v (Target):</span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest">{st.v !== undefined ? st.v : '-'}</span>
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
  };

  const renderMainCanvas = () => {
      if (st.edges === undefined || st.dist === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
              
              {/* Dual Logic Evaluation HUD */}
              {st.phase && st.phase.includes('eval_relax') && st.u !== undefined && st.v !== undefined && (
                  <div className="absolute top-8 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><RefreshCw size={14} className="text-indigo-500"/> Edge Relaxation Formula</span>
                      
                      {!st.isReachable ? (
                          <div className="flex flex-col items-center gap-2 text-rose-500">
                              <ShieldAlert size={32}/>
                              <span className="font-black text-sm uppercase tracking-widest">Node {st.u} is currently unreachable!</span>
                              <span className="text-xs font-mono bg-rose-50 px-2 py-1 rounded">dist[{st.u}] == 1e8</span>
                          </div>
                      ) : (
                          <div className="flex items-center gap-4 font-mono font-black text-xl text-slate-700">
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-widest text-cyan-500 mb-1">dist[{st.u}]</span>
                                  <span className="bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">{st.dist[st.u]}</span>
                              </div>
                              <span className="text-slate-400 font-normal">+</span>
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-widest text-rose-500 mb-1">wt</span>
                                  <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">{st.wt}</span>
                              </div>
                              
                              <div className="flex flex-col items-center px-4">
                                  <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">strictly less?</span>
                                  <span className={`text-2xl ${st.isRelaxable ? 'text-emerald-500' : 'text-slate-300'}`}>&lt;</span>
                              </div>

                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-widest text-emerald-500 mb-1">dist[{st.v}]</span>
                                  <span className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">{st.dist[st.v] === 1e8 ? '∞' : st.dist[st.v]}</span>
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* Action Notifications */}
              {st.phase === 'do_relax' && (
                  <div className="absolute top-1/4 mt-8 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full border border-emerald-200 shadow-xl z-50 animate-in zoom-in">
                      <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16}/> Successful Relaxation!</span>
                  </div>
              )}

              {st.phase === 'cycle_detected' && (
                  <div className="absolute top-1/4 mt-8 flex items-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-in zoom-in scale-110 ring-4 ring-rose-300 animate-pulse">
                      <span className="font-black text-lg uppercase tracking-widest flex items-center gap-3"><AlertTriangle size={24}/> Negative Cycle Implosion!</span>
                  </div>
              )}

              {/* PERFECTLY CENTERED ABSOLUTE SVG COORD SYSTEM */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                          </marker>
                          <marker id="arrowhead-relax" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                          </marker>
                          <marker id="arrowhead-cycle" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
                          </marker>
                      </defs>

                      {(() => {
                          // Render ALL edges, Bellman-Ford checks all edges repeatedly.
                          // It is a Directed graph! Overlapping A->B and B->A need bezier curves
                          const edgeMap = new Map<string, number>();
                          st.edges.forEach((e: number[]) => {
                              edgeMap.set(`${e[0]}-${e[1]}`, e[2]);
                          });

                          return st.edges.map((f: number[], idx: number) => {
                              let u = f[0], v = f[1], wt = f[2];
                              const p1 = nodePositions[u];
                              const p2 = nodePositions[v];
                              if (!p1 || !p2) return null;

                              const hasReverse = edgeMap.has(`${v}-${u}`);

                              const dx = p2.x - p1.x;
                              const dy = p2.y - p1.y;
                              const angle = Math.atan2(dy, dx);
                              const rOffset = 28; 
                              
                              const startX = p1.x + rOffset * Math.cos(angle);
                              const startY = p1.y + rOffset * Math.sin(angle);
                              const targetX = p2.x - rOffset * Math.cos(angle);
                              const targetY = p2.y - rOffset * Math.sin(angle);
                              
                              let midX, midY;
                              if (hasReverse) {
                                  // Curve out
                                  midX = (startX + targetX) / 2 - dy * 0.2;
                                  midY = (startY + targetY) / 2 + dx * 0.2;
                              } else {
                                  midX = (startX + targetX) / 2;
                                  midY = (startY + targetY) / 2;
                              }

                              let isActiveChecking = st.u === u && st.v === v && st.eIdx === idx;
                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "3";
                              let marker = "url(#arrowhead)";
                              let animClass = "";
                              let labelClass = "bg-slate-100 text-slate-500 border-slate-200";
                              let isNegative = wt < 0;

                              if (isNegative) labelClass = "bg-rose-50 text-rose-500 border-rose-200";

                              if (isActiveChecking) {
                                  if(st.phase === 'cycle_detected') {
                                      strokeColor = "#f43f5e"; // rose
                                      strokeWidth = "6";
                                      marker = "url(#arrowhead-cycle)";
                                      animClass = "animate-pulse";
                                      labelClass = "bg-rose-500 text-white border-rose-600 scale-125 shadow-lg";
                                  } else if(st.phase === 'do_relax') {
                                      strokeColor = "#10b981"; // emerald
                                      strokeWidth = "5";
                                      marker = "url(#arrowhead-relax)";
                                      animClass = "animate-pulse";
                                      labelClass = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-lg";
                                  } else {
                                      strokeColor = "#6366f1"; // indigo
                                      strokeWidth = "4";
                                      marker = "url(#arrowhead-active)";
                                      labelClass = "bg-indigo-500 text-white border-indigo-600 scale-110 shadow-md";
                                  }
                              }

                              return (
                                  <g key={`edge-${u}-${v}-${idx}`} className={`transition-all duration-300 ${animClass}`}>
                                      {hasReverse ? (
                                          <path 
                                              d={`M ${startX} ${startY} Q ${midX} ${midY} ${targetX} ${targetY}`}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              fill="none"
                                              markerEnd={marker}
                                          />
                                      ) : (
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              markerEnd={marker}
                                          />
                                      )}
                                      <foreignObject x={midX - 15} y={midY - 15} width="30" height="30" className="overflow-visible">
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
                        let isU = st.u === idx;
                        let isV = st.v === idx;
                        
                        let distValue = st.dist ? st.dist[idx] : 1e8;
                        let isInfinity = distValue === 1e8;
                        let isVisited = !isInfinity && idx !== st.S;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        if (isU) bgClass = 'bg-cyan-500 text-white border-cyan-600 shadow-xl';
                        else if (isV) bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-xl';
                        else if (isVisited) bgClass = 'bg-indigo-100 text-indigo-700 border-indigo-300 shadow-md opacity-90';

                        let ringClass = '';
                        let zIndex = 'z-10';
                        if (isU) { ringClass = 'ring-4 ring-cyan-300 ring-offset-2 border-transparent'; zIndex = 'z-40'; } 
                        else if (isV) { 
                            if(st.phase === 'cycle_detected') ringClass = 'ring-4 ring-rose-500 ring-offset-2 border-transparent scale-110';
                            else ringClass = 'ring-4 ring-emerald-400 ring-offset-2 border-transparent'; 
                            zIndex = 'z-30'; 
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {idx === st.S && !isU && !isV && <span className="absolute -top-6 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black border border-emerald-300 shadow-sm uppercase tracking-widest whitespace-nowrap">Source</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>
          </div>
      );
  };

  const renderStateArrays = () => (
      <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] pb-6 relative z-30">
          <div className="flex flex-col items-center shrink-0 w-full mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> dist[] Array (Minimum Costs)</span>
              
              {st.hasCycle ? (
                  <div className="flex items-center gap-4 bg-rose-100 text-rose-700 px-8 py-4 rounded-2xl border border-rose-300 font-mono font-black mt-4 shadow-inner">
                      <ShieldAlert size={24}/>
                      <span>Returned [-1]</span>
                  </div>
              ) : (
                  <div className="flex gap-2 items-end">
                      {st.dist === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (st.dist || []).map((val: number, idx: number) => {
                          let isInfinity = val === 1e8;
                          let history = st.distHistory ? st.distHistory[idx] : [];
                          
                          let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.v === idx || (st.phase === 'set_dist_src' && idx === st.S));
                          let isEvaluating = (st.phase === 'eval_relax' || st.phase === 'eval_relax_nth') && st.v === idx;
                          
                          let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border-slate-200 border-dashed" : "bg-indigo-50 text-indigo-700 border-indigo-300 font-black shadow-sm";
                          if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                          if (isEvaluating) boxBg += " ring-2 ring-amber-400 scale-105 z-10";

                          return (
                              <div key={`dist-${idx}`} className="flex flex-col items-center relative group">
                                  <div className="absolute bottom-full mb-0.5 flex flex-col-reverse items-center justify-end gap-0 max-h-[80px] overflow-hidden leading-none">
                                      {(history || []).map((hVal: number, hIdx: number) => (
                                          <span key={`hd-${idx}-${hIdx}`} className="text-[11px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-[1.5px] leading-tight">{hVal === 1e8 ? '∞' : hVal}</span>
                                      ))}
                                  </div>
                                  <div className={`w-14 h-12 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
                                      {isInfinity ? '∞' : val}
                                  </div>
                                  <span className={`absolute top-full mt-2 px-2 py-0.5 rounded border shadow-sm text-[10px] font-mono font-black ${idx === st.S ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                      Node {idx}
                                  </span>
                              </div>
                          )
                      })}
                  </div>
              )}
          </div>
      </div>
  );

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
                  <span>Negative Cycle DP</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><RefreshCw size={28}/> Exposing Negative Cycles</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Dijkstra's algorithm is greedy. It assumes that adding an edge to a path always increases (or maintains) its length. It fails spectacularly when graph edges can have <strong>negative weights</strong>.</p>
                        <p>The <strong>Bellman-Ford Algorithm</strong> solves this using Dynamic Programming. Instead of selectively pursuing paths, it exhaustively tries to "relax" (improve the distance) of <em>every single edge</em> in the entire graph, exactly <code>V - 1</code> times.</p>
                        <p>Why <code>V - 1</code>? Because the longest possible simple path (without loops) in a graph of V nodes contains exactly V - 1 edges. If we iterate V - 1 times, optimal distances are guaranteed to propagate to every reachable node.</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Negative Edges</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 5<br/><strong>Edges:</strong> [0,1,5], [1,2,-2], [2,4,3], [3,2,6], [3,4,-2], [1,3,2]<br/><strong>Source:</strong> 0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[0, 5, 3, 7, 5]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Graph contains negative edges (e.g. 1&rarr;2 costs -2) but NO negative cycles. Bellman Ford successfully calculates the minimum distances after exactly V-1 (4) complete iterations over all edges.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Catastrophic Cycle</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>V:</strong> 4<br/><strong>Edges:</strong> [0,1,1], [1,2,-1], [2,3,-1], [3,1,-1]<br/><strong>Source:</strong> 0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[-1]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Nodes 1, 2, and 3 form a loop where the total cost is -3. You can run around this loop forever, plunging the shortest path distance to negative infinity. The algorithm detects this on the Vth relaxation!</span>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2 (Cycle)</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1`}>V (Nodes)</label>
                            <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1`}>Edges [u, v, wt]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1`}>Source (S)</label>
                            <input type="text" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner font-bold text-emerald-600`} />
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

                <div className="flex flex-col xl:flex-row gap-4 h-[650px]">
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><RefreshCw size={14} className={`text-${themeColor}-500`}/> Bellman Ford Network</span>
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden flex items-center justify-center" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            <div className="transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                                {renderMainCanvas()}
                            </div>
                        </div>
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>
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
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Conquering Negative Edges with Dynamic Programming.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><RefreshCw size={24} className="text-indigo-500"/> Why V - 1 Relaxations?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A graph with <code>V</code> vertices can have at most a simple path of length <code>V - 1</code> edges (any path longer than that must contain a cycle). In the absolute worst-case scenario, the shortest path might take <code>V - 1</code> steps to reach its destination. By relaxing ALL edges exactly <code>V - 1</code> times sequentially, we mathematically guarantee that distance updates will ripple outwards and construct the longest possible optimal path!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><AlertTriangle size={24} className="text-rose-500"/> Detecting Negative Cycles (The Nth Pass)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">What happens if there is a cycle whose total weight is less than 0? You could loop through it infinitely, infinitely decreasing your total cost. Shortest paths become undefined! Bellman-Ford detects this by performing one final (V-th) relaxation pass. If <strong>any</strong> distance can STILL be improved after V-1 passes, it definitively proves the existence of a negative loop!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V &times; E)</strong><br/>The algorithm literally consists of two nested loops: an outer loop running $V - 1$ times, and an inner loop iterating through all $E$ edges. Therefore, the time complexity is strictly $O(V \cdot E)$. This makes it slower than Dijkstra ($O(E \log V)$), which is why we only use it when negative edges are present.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V)</strong><br/>The space is exceptionally light. We only need an array of size $V$ to store the `dist[]` state. $O(V)$ space is required.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-indigo-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Bellman Ford is the classic answer when interviewers ask how you handle routing networks with negative costs or currency arbitrage conversions."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why does Dijkstra fail on negative weights while Bellman-Ford succeeds?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Dijkstra is greedy."</p>
                            <p>Dijkstra locks in the shortest path to a node the moment it pops it from the Priority Queue, assuming that adding further edges can only INCREASE the distance. A negative edge breaks this rule. Bellman-Ford isn't greedy; it relies on DP exhaustive relaxation, blindly checking every single edge repeatedly to guarantee global correctness."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Can Bellman-Ford detect a negative cycle on an undirected graph?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Technically yes, but it fundamentally breaks the definition of shortest path."</p>
                            <p>An undirected graph with a negative edge is essentially an infinite negative cycle between two nodes! If $A-B$ costs $-5$, you can bounce between $A \rightarrow B \rightarrow A \rightarrow B$ forever, accumulating $-10, -20...$ The algorithm will correctly flag it as a negative cycle and abort."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1`}>V:</label>
                          <input type="text" value={vInput} onChange={(e) => setVInput(e.target.value)} className={`w-12 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-indigo-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 shrink-0 ml-2`}>Edges:</label>
                          <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-indigo-500 font-bold`} />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 shrink-0 ml-2`}>Src:</label>
                          <input type="text" value={srcInput} onChange={(e) => setSrcInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-emerald-500 font-bold text-emerald-600`} />
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
                      <div className="transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
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
                  
                  {/* Safe Bottom Dock for Arrays */}
                  <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
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
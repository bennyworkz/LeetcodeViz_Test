import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  floydWarshall: {
    id: 'floydWarshall',
    title: 'Floyd-Warshall Algorithm',
    icon: <Grid size={16} />,
    complexity: 'Time: O(V³) | Space: O(V²)',
    theme: 'teal',
    code: `class Solution
{
    public void shortest_distance(int[][] matrix)
    {
        int n = matrix.length;
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                if(matrix[i][j] == -1) {
                    matrix[i][j] = (int)(1e9);
                }
                if(i == j) matrix[i][j] = 0;
            }
        }
        
        for(int k = 0; k < n; k++) {
            for(int i = 0; i < n; i++) {
                for(int j = 0; j < n; j++) {
                    matrix[i][j] = Math.min(matrix[i][j], 
                                            matrix[i][k] + matrix[k][j]);
                }
            }
        }
        
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                if(matrix[i][j] == (int)(1e9)) {
                    matrix[i][j] = -1;
                }
            }
        }
    }
}`,
    desc: "The Floyd-Warshall algorithm is a brilliant Dynamic Programming approach used to find the shortest paths between ALL pairs of vertices in a weighted graph. Instead of greedily picking edges, it methodically considers routing paths through every possible intermediate node 'k'. By checking if `dist[i][j] > dist[i][k] + dist[k][j]`, it gradually builds the optimal matrix. It naturally handles negative edge weights and can elegantly detect negative cycles!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|shortest_distance|matrix|Math|min|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isPointer = ['matrix', 'n', 'i', 'j', 'k'].includes(part);
            const isMapCall = ['shortest_distance', 'min', 'length'].includes(part);
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

export default function FloydWarshallVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('floydWarshall');
  
  // Default Matrix String (Rows separated by |)
  const [matrixInput, setMatrixInput] = useState('0 2 -1 -1 | 1 0 3 -1 | -1 -1 0 -1 | 3 5 4 0');

  const [baseN, setBaseN] = useState(4);
  const [baseMatrix, setBaseMatrix] = useState<number[][]>([
      [0, 2, -1, -1],
      [1, 0, 3, -1],
      [-1, -1, 0, -1],
      [3, 5, 4, 0]
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const loadTestCase1 = () => {
      setMatrixInput('0 2 -1 -1 | 1 0 3 -1 | -1 -1 0 -1 | 3 5 4 0');
  };

  const loadTestCase2 = () => {
      // 3x3 Cycle Graph
      setMatrixInput('0 5 -1 | -1 0 2 | 1 -1 0');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = matrixInput.split('|').map(r => r.trim());
        let n = rows.length;
        let parsedMatrix: number[][] = Array.from({length: n}, () => Array(n).fill(-1));
        
        for (let i = 0; i < n; i++) {
            if (rows[i] === "") continue;
            let cells = rows[i].split(/\s+/).map(s => parseInt(s.trim(), 10));
            for(let j=0; j < Math.min(n, cells.length); j++) {
                if(!isNaN(cells[j])) parsedMatrix[i][j] = cells[j];
            }
        }
        
        setBaseN(n);
        setBaseMatrix(parsedMatrix);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [matrixInput]);

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

  const clone2D = (arr: number[][]) => arr.map(a => [...a]);

  // Generate trace strictly aligned with Java code Line numbers!
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    let matrix = clone2D(baseMatrix);
    
    if (n === 0) return steps;

    // Track original edges strictly for rendering the graph structure visually
    const originalEdges: {u: number, v: number, wt: number}[] = [];
    for(let i=0; i<n; i++) {
        for(let j=0; j<n; j++) {
            if(i !== j && matrix[i][j] !== -1) {
                originalEdges.push({u: i, v: j, wt: matrix[i][j]});
            }
        }
    }

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { matrix: clone2D(matrix), originalEdges, n, ...stateObj } 
    });

    add("Function Call", `public void shortest_distance(int[][] matrix)\nInitiating Multi-Source Shortest Path algorithm.`, 3, { phase: 'init' });
    
    add("Assign Length", `int n = matrix.length;\nNumber of vertices N = ${n}.`, 5, { phase: 'init_n' });

    // Phase 1: Infinity Setup
    for(let i = 0; i < n; i++) {
        add("Row Loop (Init)", `for(int i = 0; i < n; i++)`, 6, { phase: 'init_loop_i', iterI: i });
        for(let j = 0; j < n; j++) {
            add("Col Loop (Init)", `for(int j = 0; j < n; j++)`, 7, { phase: 'init_loop_j', iterI: i, iterJ: j });
            
            add("Check Missing Edge", `if(matrix[i][j] == -1)`, 8, { phase: 'init_check', iterI: i, iterJ: j });
            if(matrix[i][j] === -1) {
                matrix[i][j] = 1e9;
                add("Set Infinity", `matrix[i][j] = (int)(1e9);\nReplaced -1 with mathematically infinite distance.`, 9, { phase: 'init_set_inf', iterI: i, iterJ: j });
            }
            
            add("Check Diagonal", `if(i == j) matrix[i][j] = 0;`, 11, { phase: 'init_check_diag', iterI: i, iterJ: j });
            if(i === j) {
                matrix[i][j] = 0;
                add("Set Diagonal Zero", `matrix[i][j] = 0;\nDistance from a node to itself is 0.`, 11, { phase: 'init_set_zero', iterI: i, iterJ: j });
            }
        }
    }

    // Phase 2: Floyd Warshall Core Logic
    for(let k = 0; k < n; k++) {
        add("Intermediate Node (k)", `for(int k = 0; k < n; k++)\nNow considering all paths that can route THROUGH node ${k}.`, 15, { phase: 'fw_k', k });
        for(let i = 0; i < n; i++) {
            add("Source Node (i)", `for(int i = 0; i < n; i++)`, 16, { phase: 'fw_i', k, i });
            for(let j = 0; j < n; j++) {
                
                let oldVal = matrix[i][j];
                let val_ik = matrix[i][k];
                let val_kj = matrix[k][j];
                let newVal = val_ik + val_kj;

                add("Destination Node (j)", `for(int j = 0; j < n; j++)\nCalculating path from ${i} \u2192 ${j} via ${k}.`, 17, { phase: 'fw_j', k, i, j, oldVal, val_ik, val_kj, newVal });

                let desc = `matrix[i][j] = Math.min(matrix[i][j], matrix[i][k] + matrix[k][j]);\n`;
                desc += `Comparing: Direct(${i}\u2192${j}): ${oldVal === 1e9 ? '∞' : oldVal} VS Via(${i}\u2192${k}\u2192${j}): ${val_ik === 1e9 ? '∞' : val_ik} + ${val_kj === 1e9 ? '∞' : val_kj} = ${newVal >= 1e9 ? '∞' : newVal}`;
                
                let isImproved = false;
                if (val_ik !== 1e9 && val_kj !== 1e9 && newVal < oldVal) {
                    isImproved = true;
                    desc += `\nPASSED! Found a shorter path by routing through node ${k}.`;
                    matrix[i][j] = newVal;
                } else {
                    desc += `\nFAILED: Routing through ${k} does not improve the distance.`;
                }

                add("DP Relaxation", desc, 18, { phase: 'fw_relax', k, i, j, oldVal, val_ik, val_kj, newVal, isImproved, currentMatrixVal: matrix[i][j] });
            }
        }
    }

    // Phase 3: Restore Infinity to -1
    for(let i = 0; i < n; i++) {
        add("Row Loop (Restore)", `for(int i = 0; i < n; i++)`, 24, { phase: 'restore_i', iterI: i });
        for(let j = 0; j < n; j++) {
            add("Col Loop (Restore)", `for(int j = 0; j < n; j++)`, 25, { phase: 'restore_j', iterI: i, iterJ: j });
            add("Check Infinity", `if(matrix[i][j] == (int)(1e9))`, 26, { phase: 'restore_check', iterI: i, iterJ: j });
            if(matrix[i][j] === 1e9) {
                matrix[i][j] = -1;
                add("Restore -1", `matrix[i][j] = -1;\nRestoring unreached paths to -1 format.`, 27, { phase: 'restore_set', iterI: i, iterJ: j });
            }
        }
    }

    add("End of Function", `Algorithm successfully populated the exact shortest distances between all pairs in the given graph!`, 31, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseMatrix]);

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
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.matrix-grid')) return;
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

  // Directed Graph Layout Mathematics (Absolute Coordinates)
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseN).fill({x: 0, y: 0});
    const center = svgSize / 2;
    if (baseN === 0) return pos;
    if (baseN === 1) return [{x: center, y: center}];

    const radius = Math.min(220, Math.max(140, baseN * 30));
    for (let i = 0; i < baseN; i++) {
        const angle = (i / baseN) * 2 * Math.PI - Math.PI / 2; 
        pos[i] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseN]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-teal-900 border-teal-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Grid size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-teal-400`}>
                    <CheckCircle2 size={24}/> ALL PAIRS COMPUTED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    The Floyd-Warshall DP matrix successfully derived the absolute shortest paths between every pair of vertices.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('fw_relax') ? (st.isImproved ? 'text-emerald-400' : 'text-amber-400') : (String(st.phase || '').includes('fw_') ? 'text-teal-400' : (String(st.phase || '').includes('init') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.matrix === undefined || st.originalEdges === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const n = st.n;

      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* DP Logic Evaluation HUD */}
              {st.phase && st.phase === 'fw_relax' && st.i !== undefined && st.j !== undefined && st.k !== undefined && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10 min-w-[500px]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><GitMerge size={14} className="text-teal-500"/> DP Bellman Equation</span>
                      
                      <div className="flex items-center gap-6 font-mono font-black text-xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-rose-500 mb-1">Direct: {st.i}&rarr;{st.j}</span>
                              <span className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 shadow-inner text-2xl">{st.oldVal === 1e9 ? '∞' : st.oldVal}</span>
                          </div>

                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Math.min()</span>
                              <span className={`text-2xl ${st.isImproved ? 'text-emerald-500' : 'text-slate-300'}`}>VS</span>
                          </div>

                          <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-2xl border border-teal-200 shadow-sm">
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-widest text-teal-600 mb-1">Via: {st.i}&rarr;{st.k}</span>
                                  <span className="bg-white px-3 py-1 rounded-lg border border-teal-200">{st.val_ik === 1e9 ? '∞' : st.val_ik}</span>
                              </div>
                              <span className="text-teal-400 font-normal">+</span>
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-widest text-teal-600 mb-1">Via: {st.k}&rarr;{st.j}</span>
                                  <span className="bg-white px-3 py-1 rounded-lg border border-teal-200">{st.val_kj === 1e9 ? '∞' : st.val_kj}</span>
                              </div>
                              <span className="text-teal-400 font-normal">=</span>
                              <div className="flex flex-col items-center px-2">
                                  <span className="text-[9px] uppercase tracking-widest text-emerald-600 mb-1">New Route</span>
                                  <span className="text-2xl text-emerald-600">{st.newVal >= 1e9 ? '∞' : st.newVal}</span>
                              </div>
                          </div>
                      </div>

                      {st.isImproved && (
                          <div className="absolute -bottom-4 bg-emerald-500 text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest shadow-md animate-bounce border border-emerald-600">
                              Updated!
                          </div>
                      )}
                  </div>
              )}

              {/* Left Side: Dynamic Graph Visualization */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                          </marker>
                          <marker id="arrowhead-fw-direct" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
                          </marker>
                          <marker id="arrowhead-fw-via" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#14b8a6" />
                          </marker>
                      </defs>

                      {(() => {
                          // Detect bi-directional edges in the original input to curve them
                          const edgeMap = new Map<string, boolean>();
                          st.originalEdges.forEach((e: any) => edgeMap.set(`${e.u}-${e.v}`, true));

                          return st.originalEdges.map((f: any, idx: number) => {
                              let u = f.u, v = f.v, wt = f.wt;
                              const p1 = nodePositions[u];
                              const p2 = nodePositions[v];
                              if (!p1 || !p2) return null;

                              const hasReverse = edgeMap.has(`${v}-${u}`);

                              const dx = p2.x - p1.x;
                              const dy = p2.y - p1.y;
                              const angle = Math.atan2(dy, dx);
                              const rOffset = 26; 
                              
                              const startX = p1.x + rOffset * Math.cos(angle);
                              const startY = p1.y + rOffset * Math.sin(angle);
                              const targetX = p2.x - rOffset * Math.cos(angle);
                              const targetY = p2.y - rOffset * Math.sin(angle);
                              
                              let midX, midY;
                              if (hasReverse) {
                                  midX = (startX + targetX) / 2 - dy * 0.15;
                                  midY = (startY + targetY) / 2 + dx * 0.15;
                              } else {
                                  midX = (startX + targetX) / 2;
                                  midY = (startY + targetY) / 2;
                              }

                              let isDirectEdge = st.phase === 'fw_relax' && st.i === u && st.j === v;
                              let isViaEdge1 = st.phase === 'fw_relax' && st.i === u && st.k === v;
                              let isViaEdge2 = st.phase === 'fw_relax' && st.k === u && st.j === v;

                              let strokeColor = "#cbd5e1"; 
                              let strokeWidth = "2";
                              let marker = "url(#arrowhead)";
                              let labelClass = "bg-white text-slate-400 border-slate-200 opacity-60";
                              let zIndex = 0;

                              if (isDirectEdge) {
                                  strokeColor = "#f43f5e"; // Rose
                                  strokeWidth = "5";
                                  marker = "url(#arrowhead-fw-direct)";
                                  labelClass = "bg-rose-500 text-white border-rose-600 scale-125 shadow-lg opacity-100 font-black";
                                  zIndex = 10;
                              } else if (isViaEdge1 || isViaEdge2) {
                                  strokeColor = "#14b8a6"; // Teal
                                  strokeWidth = "5";
                                  marker = "url(#arrowhead-fw-via)";
                                  labelClass = "bg-teal-500 text-white border-teal-600 scale-125 shadow-lg opacity-100 font-black";
                                  zIndex = 5;
                              }

                              return (
                                  <g key={`edge-${u}-${v}`} className="transition-all duration-300">
                                      {hasReverse ? (
                                          <path 
                                              d={`M ${startX} ${startY} Q ${midX} ${midY} ${targetX} ${targetY}`}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              fill="none"
                                              markerEnd={marker}
                                              strokeDasharray={isViaEdge1 || isViaEdge2 ? "6 4" : ""}
                                              opacity={isDirectEdge || isViaEdge1 || isViaEdge2 ? 1 : 0.4}
                                          />
                                      ) : (
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              markerEnd={marker}
                                              strokeDasharray={isViaEdge1 || isViaEdge2 ? "6 4" : ""}
                                              opacity={isDirectEdge || isViaEdge1 || isViaEdge2 ? 1 : 0.4}
                                          />
                                      )}
                                      <foreignObject x={midX - 12} y={midY - 12} width="24" height="24" className="overflow-visible" style={{zIndex}}>
                                          <div className={`w-full h-full flex items-center justify-center font-mono text-[9px] rounded-full border transition-all duration-300 ${labelClass}`}>
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
                        let isK = st.k === idx;
                        let isI = st.i === idx;
                        let isJ = st.j === idx;
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm opacity-60';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isK && st.phase?.includes('fw_')) {
                            bgClass = 'bg-teal-500 text-white border-teal-600 shadow-xl opacity-100 scale-125';
                            ringClass = 'ring-4 ring-teal-200 ring-offset-2 border-transparent';
                            zIndex = 'z-50';
                        } else if (isI) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl opacity-100 scale-110';
                            ringClass = 'ring-2 ring-fuchsia-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isJ) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl opacity-100 scale-110';
                            ringClass = 'ring-2 ring-sky-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        }

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-all duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                {idx}
                                {isK && st.phase?.includes('fw_') && <span className="absolute -bottom-6 text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-black shadow-sm uppercase tracking-widest">Via (k)</span>}
                                {isI && !isK && <span className="absolute -top-6 text-[9px] text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded-full font-black shadow-sm uppercase tracking-widest">Src (i)</span>}
                                {isJ && !isK && !isI && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-black shadow-sm uppercase tracking-widest">Dst (j)</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>

              {/* Right Side: Matrix Visualization */}
              <div className="flex flex-col items-center shrink-0 matrix-grid max-w-full overflow-hidden bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl z-20">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 mb-4 shadow-sm flex items-center gap-2"><Layers size={14}/> Distance Matrix [N][N]</span>
                  
                  <div className="flex flex-col gap-1">
                      {/* Header Row */}
                      <div className="flex gap-1">
                          <div className="w-8 h-8"></div>
                          {Array.from({length: n}).map((_, col) => (
                              <div key={`head-${col}`} className={`w-12 h-8 flex items-center justify-center font-mono font-black text-[10px] rounded bg-slate-100 text-slate-400 ${st.phase?.includes('fw_') && st.j === col ? 'bg-sky-100 text-sky-600' : ''}`}>{col}</div>
                          ))}
                      </div>

                      {st.matrix.map((row: number[], i: number) => (
                          <div key={`m-row-${i}`} className="flex gap-1">
                              {/* Header Col */}
                              <div className={`w-8 h-12 flex items-center justify-center font-mono font-black text-[10px] rounded bg-slate-100 text-slate-400 ${st.phase?.includes('fw_') && st.i === i ? 'bg-fuchsia-100 text-fuchsia-600' : ''}`}>{i}</div>

                              {row.map((val: number, j: number) => {
                                  let isInfinity = val === 1e9;
                                  
                                  let isInitPhase = st.phase?.includes('init_');
                                  let isRestorePhase = st.phase?.includes('restore_');
                                  let isFwPhase = st.phase?.includes('fw_');

                                  let isInitActive = isInitPhase && st.iterI === i && st.iterJ === j;
                                  let isRestoreActive = isRestorePhase && st.iterI === i && st.iterJ === j;
                                  
                                  let isFwTarget = isFwPhase && st.i === i && st.j === j;
                                  let isFwVia1 = isFwPhase && st.i === i && st.k === j;
                                  let isFwVia2 = isFwPhase && st.k === i && st.j === j;

                                  let boxBg = isInfinity ? "bg-slate-50 text-slate-300 border border-slate-200 border-dashed" : "bg-slate-100 text-slate-600 border border-slate-300 shadow-sm";
                                  
                                  if (isInitActive || isRestoreActive) {
                                      boxBg = "bg-amber-100 text-amber-600 border border-amber-300 scale-110 shadow-lg z-10 font-black";
                                  } else if (isFwTarget) {
                                      if (st.phase === 'fw_relax' && st.isImproved) {
                                          boxBg = "bg-emerald-500 text-white border border-emerald-600 scale-125 shadow-2xl z-30 font-black animate-pulse ring-4 ring-emerald-200";
                                      } else {
                                          boxBg = "bg-rose-100 text-rose-700 border border-rose-400 scale-110 shadow-lg z-20 font-black ring-2 ring-rose-200";
                                      }
                                  } else if (isFwVia1 || isFwVia2) {
                                      boxBg = "bg-teal-100 text-teal-700 border border-teal-400 scale-105 shadow-md z-10 font-bold";
                                  } else if (val === -1 && !isRestorePhase) {
                                      boxBg = "bg-slate-800 text-slate-400 border border-slate-900"; // Uninitialized visual
                                  }

                                  return (
                                      <div key={`m-cell-${i}-${j}`} className={`w-12 h-12 flex items-center justify-center font-mono rounded-lg transition-all duration-300 select-none ${boxBg}`}>
                                          {isInfinity ? '∞' : val}
                                      </div>
                                  )
                              })}
                          </div>
                      ))}
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
                  <span>Multi-Source Shortest Path DP</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Grid size={28}/> Floyd-Warshall DP Matrix</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Unlike Dijkstra or Bellman-Ford which find shortest paths from a <strong>single</strong> source, the Floyd-Warshall algorithm finds the shortest paths between <strong>all pairs of vertices</strong> simultaneously!</p>
                        <p>It achieves this using a brilliant 3D Dynamic Programming concept (optimized to 2D in space). The core idea: What if we try to route the path from node <code>i</code> to node <code>j</code> by strictly going <em>through</em> an intermediate node <code>k</code>?</p>
                        <p>We iterate <code>k</code> from 0 to N-1. For every pair <code>(i, j)</code>, we check: is <code>dist[i][j] &gt; dist[i][k] + dist[k][j]</code>? If so, we found a strictly shorter multi-hop path, and we overwrite the matrix cell!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Standard Graph</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Input Matrix:</strong><br/>0 2 -1 -1<br/>1 0 3 -1<br/>-1 -1 0 -1<br/>3 5 4 0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">0 2 5 -1<br/>1 0 3 -1<br/>-1 -1 0 -1<br/>3 5 4 0</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The path from 0 to 2 is initially impossible (-1). But by routing through 1, we get 0&rarr;1 (cost 2) + 1&rarr;2 (cost 3) = 5!</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Cycle Graph</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Input Matrix:</strong><br/>0 5 -1<br/>-1 0 2<br/>1 -1 0</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">0 5 7<br/>3 0 2<br/>1 6 0</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">A simple 3-node cycle 0&rarr;1&rarr;2&rarr;0. Floyd Warshall successfully discovers the multi-hop paths to complete the circle for every node pair.</span>
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
                    <div className="grid grid-cols-1 items-end">
                        <div className="space-y-1.5 w-full">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-teal-600 pl-1`}>Input Matrix (Rows separated by |)</label>
                            <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-inner font-bold`} />
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
                    <p className="text-slate-500 text-lg leading-relaxed">Dynamic Programming applied to Adjacency Matrices.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MapPin size={24} className="text-teal-500"/> Phase 1: The "Via" Node (k)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of asking "What is the shortest path from A to B?", Floyd-Warshall asks a simpler sequence of questions: "Is the path from A to B shorter if we route it directly through node 0? What about node 1? Node 2?" The outer loop <code>k</code> strictly defines the set of allowed intermediate nodes. By the end of the loop, it has evaluated paths allowing ANY intermediate node.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><AlertTriangle size={24} className="text-rose-500"/> Detecting Negative Cycles</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Floyd-Warshall makes detecting negative cycles remarkably simple! The distance from a node to itself (e.g. <code>matrix[i][i]</code>) is initialized to 0. If there is a negative cycle reachable from node <code>i</code>, the DP formula will route the path out of <code>i</code>, through the negative cycle, and back to <code>i</code>. This results in <code>matrix[i][i]</code> becoming negative! So, simply loop through the diagonal; if any value is &lt; 0, a negative cycle exists.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V³)</strong><br/>The algorithm is structurally built around three perfectly nested loops (<code>k</code>, <code>i</code>, <code>j</code>) iterating from 0 to N. It mathematically guarantees an absolute runtime of exactly $O(V^3)$. It does not matter if the graph is sparse or dense.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V²)</strong><br/>The algorithm operates directly in-place on the Adjacency Matrix, which takes $O(V^2)$ memory. No auxiliary queues or heavy structures are required.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-teal-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Be prepared to compare Floyd-Warshall with Dijkstra. Why run a $O(V^3)$ algorithm when you could run Dijkstra from every single node?"</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why would we use Floyd-Warshall instead of running Dijkstra V times?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It depends on Negative Weights and Density."</p>
                            <p>If the graph has NO negative weights, running Dijkstra V times takes $O(V \cdot E \log V)$, which is heavily superior to $O(V^3)$ on sparse graphs! However, if there are negative weights, Dijkstra fails. Running Bellman-Ford V times takes $O(V \cdot V \cdot E) = O(V^2 E)$. On a dense graph where $E = V^2$, Bellman-Ford takes $O(V^4)$, while Floyd-Warshall remains a highly-optimized, cache-friendly $O(V^3)$!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why is the loop order specifically `k`, then `i`, then `j`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because `k` defines the progressive state of our Dynamic Programming."</p>
                            <p>Floyd-Warshall is DP. The state D[k][i][j] defines the shortest path from i to j using ONLY vertices from &#123;0, 1... k&#125; as intermediates. To compute the answers for layer k, we must have completely finalized all answers for layer k-1. If `k` were the innermost loop, we would prematurely evaluate paths before their constituent sub-paths had been fully solved!"</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-teal-600 pl-1`}>Input Matrix:</label>
                          <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-teal-500 font-bold`} />
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
              </div>
          </div>
      )}
    </div>
  );
}
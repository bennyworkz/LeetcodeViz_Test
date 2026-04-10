import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  eventualSafeStatesBFS: {
    id: 'eventualSafeStatesBFS',
    title: 'Eventual Safe States (BFS Kahn\'s)',
    icon: <ShieldCheck size={16} />,
    complexity: 'Time: O(V + E) | Space: O(V + E)',
    theme: 'teal',
    code: `class Solution {
    List<Integer> eventualSafeNodes(int V,
                            List<List<Integer>> adj) {
        List<List<Integer>> adjRev = new ArrayList<>();
        for(int i = 0; i<V; i++) {
            adjRev.add(new ArrayList<>());
        }
        int indegree[] = new int[V];
        for(int i = 0; i<V; i++) {
            // i -> it
            // it -> i
            for(int it : adj.get(i)) {
                adjRev.get(it).add(i);
                indegree[i]++;
            }
        }
        Queue<Integer> q = new LinkedList<>();
        List<Integer> safeNodes = new ArrayList<>();
        for(int i = 0; i<V; i++) {
            if(indegree[i] == 0) {
                q.add(i);
            }
        }

        while(!q.isEmpty()) {
            int node = q.peek();
            q.remove();
            safeNodes.add(node);
            for(int it: adjRev.get(node)) {
                indegree[it]--;
                if(indegree[it] == 0) q.add(it);
            }
        }
        Collections.sort(safeNodes);
        return safeNodes;
        // Your code here
    }
}`,
    desc: "To find Eventual Safe States using BFS, we effectively reverse the entire graph! In a standard directed graph, safe nodes are 'terminal' nodes (out-degree 0). By reversing all edges, these terminal nodes become nodes with in-degree 0. We can then perfectly apply Kahn's Topological Sort algorithm. We peel away the terminal nodes, free up their parents, and progressively work our way backwards through the graph. Any node that enters the queue is definitively a Safe Node!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|eventualSafeNodes|node|it|adj|adjRev|indegree|Collections|sort|safeNodes|V|q|add|isEmpty|peek|remove|length|get|LinkedList|Queue|ArrayList|List|Integer)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List', 'Collections'].includes(part);
            const isPointer = ['adj', 'adjRev', 'indegree', 'node', 'it', 'V', 'i', 'q', 'safeNodes'].includes(part);
            const isMapCall = ['eventualSafeNodes', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length', 'sort'].includes(part);
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

export default function EventualSafeStatesBFSVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('eventualSafeStatesBFS');
  
  // Default: LeetCode Example 1 (Graph with a Cycle)
  // [[1,2],[2,3],[5],[0],[5],[],[]]
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

  // Generate trace strictly aligned with exact Java code lines from Kahn's Algorithm
  const trace = useMemo(() => {
    const steps: any[] = [];
    const adj = baseAdj;
    const V = adj.length;
    
    if (V === 0) return steps;

    // Simulation local state
    let adjRev: number[][] = Array.from({length: V}, () => []);
    let indegree: number[] = Array(V).fill(0);
    const q: number[] = [];
    const safeNodes: number[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj, adjRev: clone1D(adjRev.map(a => [...a])), V, q: [...q], indegree: clone1D(indegree), safeNodes: [...safeNodes], ...stateObj } 
    });

    add("Function Call", `List<Integer> eventualSafeNodes(int V=${V}, ...)\nInitiating BFS Eventual Safe States.`, 2, { phase: 'init' });
    
    // --- REVERSE GRAPH FORMATION PHASE ---
    add("Form Reverse Graph", `List<List<Integer>> adjRev = new ArrayList<>();\nAllocating outer reversed adjacency list structure.`, 4, { phase: 'init_graph' });
    
    for (let i = 0; i < V; i++) {
        add("Create AdjRev Rows", `for(int i = 0; i<V; i++)\nCreating empty lists for all ${V} vertices. i=${i}.`, 5, { phase: 'init_adj_row', scanI: i });
        add("Add Empty List", `adjRev.add(new ArrayList<>());\nRow ${i} allocated successfully.`, 6, { phase: 'add_adj_row', scanI: i });
    }

    add("Init Indegree Array", `int indegree[] = new int[V];\nAllocating array to track ORIGINAL outgoing edges.`, 8, { phase: 'init_indegree_ds' });

    for(let i = 0; i < V; i++) {
        add("Outer Reversal Loop", `for(int i = 0; i<V; i++)\nScanning original outgoing edges from node ${i}.`, 9, { phase: 'for_i_indegree', scanI: i });
        add("Inner Edge Loop", `for(int it : adj.get(i))\nIterating targets connected from node ${i}.`, 12, { phase: 'for_it_indegree', scanI: i });
        
        for(let it of adj[i]) {
            adjRev[it].push(i);
            add("Reverse Edge", `adjRev.get(it).add(i);\nReversing edge! Node ${it} now points BACK to node ${i} in adjRev.`, 13, { phase: 'inject_edge', scanI: i, checkNode: it });
            
            indegree[i]++;
            add("Increment Indegree", `indegree[i]++;\nNode ${i} has an outgoing edge to ${it}. Increasing its indegree in our reversed setup to ${indegree[i]}.`, 14, { phase: 'inc_indegree', scanI: i, checkNode: it });
        }
    }

    // --- KAHN'S BFS PHASE ---
    add("Init Queue", `Queue<Integer> q = new LinkedList<>();\nCreating BFS queue.`, 17, { phase: 'init_queue' });
    add("Init Output List", `List<Integer> safeNodes = new ArrayList<>();\nCreating list to hold proven safe nodes.`, 18, { phase: 'init_safe_list' });

    for(let i = 0; i < V; i++) {
        add("Terminal Node Check", `for(int i = 0; i<V; i++)\nChecking if node ${i} is a terminal node (0 outgoing edges).`, 19, { phase: 'for_i_queue', scanI: i });
        add("Verify Zero Indegree", `if(indegree[i] == 0)\nDoes node ${i} have an out-degree of 0? (${indegree[i]} == 0)`, 20, { phase: 'check_zero_indegree', scanI: i });
        if (indegree[i] === 0) {
            q.push(i);
            add("Enqueue Terminal Node", `q.add(i);\nNode ${i} has no outgoing edges! It is definitively safe. Enqueueing it.`, 21, { phase: 'enqueue_zero', scanI: i });
        }
    }

    while(q.length > 0) {
        add("While Queue Loop", `while(!q.isEmpty())\nQueue is not empty. Extracting safe terminal nodes to free up their parents.`, 25, { phase: 'while_q' });
        
        let node = q[0];
        add("Peek Queue", `int node = q.peek();\nPeeking safe node ${node} at the front of the queue.`, 26, { phase: 'q_peek', activeNode: node });
        
        q.shift();
        add("Dequeue Safe Node", `q.remove();\nRemoved safe node ${node} from the queue.`, 27, { phase: 'q_remove', activeNode: node });
        
        safeNodes.push(node);
        add("Add to SafeNodes", `safeNodes.add(node);\nOfficially registering node ${node} as a safe state!`, 28, { phase: 'safe_add', activeNode: node });

        add("Reverse Neighbor Loop", `for(int it: adjRev.get(node))\nIterating adjRev! Finding nodes that pointed TO our safe node ${node}.`, 29, { phase: 'for_it_adj', activeNode: node });
        
        for(let it of adjRev[node]) {
            indegree[it]--;
            add("Decrement Dependency", `indegree[it]--;\nNode ${it} pointed to safe node ${node}. One of its outgoing dependencies is resolved! Indegree drops to ${indegree[it]}.`, 30, { phase: 'dec_indegree', activeNode: node, checkNode: it });
            
            add("Check Fully Resolved", `if(indegree[it] == 0)\nDid freeing this edge resolve ALL of node ${it}'s outgoing dependencies?`, 31, { phase: 'check_new_zero', activeNode: node, checkNode: it });
            if (indegree[it] === 0) {
                q.push(it);
                add("Enqueue Newly Safe Node", `q.add(it);\nYes! Node ${it} now only points to safe nodes. It is now completely safe. Enqueueing it!`, 31, { phase: 'enqueue_new_zero', activeNode: node, checkNode: it });
            }
        }
    }

    add("Queue Empty", `while(!q.isEmpty())\nQueue is completely empty. We successfully traced back all non-cyclic paths!`, 25, { phase: 'done_while' });
    
    safeNodes.sort((a,b) => a-b);
    add("Sort Safe Nodes", `Collections.sort(safeNodes);\nSorting the valid safe nodes in ascending order as requested.`, 34, { phase: 'sort_ans' });

    add("Final Return", `return safeNodes;\nAlgorithm complete. Any cyclic nodes were naturally trapped and excluded!`, 35, { phase: 'done', isDone: true, isSuccess: true });

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
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-teal-900 border-teal-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><ShieldCheck size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-teal-400`}>
                    <CheckCircle2 size={24}/> SAFE STATES DERIVED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm successfully aggregated and sorted all cycle-free paths!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('enqueue') || String(st.phase || '').includes('safe_add') || String(st.phase || '') === 'sort_ans' ? 'text-emerald-400' : (String(st.phase || '').includes('indegree') && !String(st.phase || '').includes('init') ? 'text-rose-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('scan') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-center justify-center gap-4 xl:gap-12 w-full p-6 overflow-x-auto">
          
          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><ArrowDownToLine size={12}/> indegree[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[240px] min-h-[70px]">
                  {st.indegree === undefined ? <span className="text-slate-300 font-mono italic text-xs py-4">Uninitialized</span> : (st.indegree || []).map((val: number, idx: number) => {
                      let isIncremented = (st.phase === 'inc_indegree') && (st.scanI === idx);
                      let isDecremented = (st.phase === 'dec_indegree') && (st.checkNode === idx);
                      let isCheckingZero = (st.phase === 'check_zero_indegree' || st.phase === 'check_new_zero') && (st.checkNode === idx || st.scanI === idx);
                      
                      let boxBg = val === 0 ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200";
                      if (isIncremented) boxBg = "bg-rose-500 text-white border-rose-600 scale-110 shadow-lg ring-2 ring-rose-200 animate-in zoom-in";
                      if (isDecremented) boxBg = "bg-amber-400 text-white border-amber-500 scale-110 shadow-lg ring-2 ring-amber-200 animate-in zoom-in";
                      if (isCheckingZero) boxBg += " ring-4 ring-sky-400 ring-offset-2 border-transparent scale-110 z-10 relative";

                      return (
                          <div key={`in-${idx}`} className="flex flex-col items-center">
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

          {/* Safe Nodes Output Array Tracker */}
          <div className="flex flex-col items-center shrink-0 w-[240px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 mb-2 shadow-sm flex items-center gap-2"><ListChecks size={12}/> List safeNodes</span>
              <div className={`flex flex-col w-full bg-white border shadow-md rounded-2xl p-4 transition-all duration-500 ${st.isDone ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50' : 'border-slate-200'}`}>
                  <div className="flex flex-wrap gap-2 items-center min-h-[30px]">
                     <span className="text-slate-400 font-mono text-xl">[</span>
                     {st.safeNodes === undefined || st.safeNodes.length === 0 ? <span className="text-slate-300 font-mono italic text-xs">Empty list...</span> : (st.safeNodes || []).map((val: number, idx: number) => {
                         let isNew = st.phase === 'safe_add' && idx === st.safeNodes.length - 1;
                         let isSorting = st.phase === 'sort_ans';
                         return (
                             <span key={`sn-${idx}`} className={`font-mono font-black text-sm px-2 py-1 rounded-lg border-2 transition-all ${isNew ? 'bg-teal-500 text-white border-teal-600 shadow-lg scale-110 animate-in zoom-in' : (isSorting ? 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-pulse' : 'bg-slate-100 text-teal-700 border-slate-200 shadow-sm')}`}>{val}</span>
                         )
                     })}
                     <span className="text-slate-400 font-mono text-xl">]</span>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          {/* Adjacency List Component (REVERSED Graph) */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ArrowLeft size={12}/> adjRev (Reversed)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-1 relative min-h-[150px] overflow-y-auto scrollbar-thin">
                  {st.adjRev === undefined ? <span className="text-slate-300 font-mono italic text-xs">Awaiting traversal logic...</span> : (st.adjRev || []).map((neighbors: number[], nodeIdx: number) => {
                      let isInjectingRow = st.checkNode === nodeIdx && st.phase === 'inject_edge';
                      let isActivePopRow = st.activeNode === nodeIdx && String(st.phase || '').includes('for_it_adj');
                      let isDecrementingRow = st.activeNode === nodeIdx && (String(st.phase || '').includes('dec_indegree') || String(st.phase || '').includes('new_zero'));

                      let highlightRow = isInjectingRow || isActivePopRow || isDecrementingRow;

                      return (
                          <div key={`adjRev-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isInjectingRow ? 'bg-rose-50 border border-rose-200 shadow-md scale-[1.02]' : (highlightRow ? 'bg-teal-50 border border-teal-200 shadow-sm' : 'bg-transparent border border-transparent')}`}>
                              <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isInjectingRow ? 'bg-rose-500 text-white' : (highlightRow ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={isInjectingRow ? 'text-rose-400' : (highlightRow ? 'text-teal-400' : 'text-slate-300')} />
                              <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                  {neighbors.map((neighbor: number, nIdx: number) => {
                                      let isJustInjected = isInjectingRow && st.scanI === neighbor && nIdx === neighbors.length - 1;
                                      let isDecrementedNeighbor = isDecrementingRow && st.checkNode === neighbor;

                                      let neighborBg = 'transparent';
                                      let neighborText = highlightRow ? 'text-teal-700' : 'text-slate-500';

                                      if (isJustInjected) {
                                          neighborBg = 'bg-rose-500 text-white shadow-md scale-110 animate-in zoom-in';
                                          neighborText = 'text-white font-black';
                                      } else if (isDecrementedNeighbor) {
                                          neighborBg = 'bg-sky-400 text-white shadow-sm scale-110';
                                          neighborText = 'text-white font-black';
                                      }

                                      return (
                                          <React.Fragment key={`adjR-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md transition-all ${neighborBg} ${neighborText}`}>
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

          {/* Kahn's Queue Component */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Queue&lt;Integer&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (OUT)</span>
                      <span>BACK (IN)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 transition-all duration-500">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Uninitialized</span> : (st.q || []).map((val: number, i: number) => {
                          let isEntering = String(st.phase || '').includes('enqueue') && i === st.q.length - 1;
                          let isTop = i === 0;
                          
                          return (
                              <div key={`qf-${i}-${val}`} className={`px-4 py-2 flex flex-col items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8' : (isTop ? 'bg-sky-500 border-sky-600' : 'bg-slate-700 border-slate-800')}`}>
                                  <span className="text-sm">{val}</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
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
                          <span className="text-fuchsia-500">node (Popped/Safe):</span>
                          <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">it (Neighbor):</span>
                          <span className="font-bold text-rose-700">{st.checkNode !== undefined ? st.checkNode : '-'}</span>
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
                  
                  {/* Edges Layer (Original Directions) */}
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return st.adj.map((neighbors: number[], origU: number) => (
                              neighbors.map((origV: number) => {
                                  const edgeKey = `${origU}-${origV}`;
                                  if (renderedEdges.has(edgeKey)) return null;
                                  renderedEdges.add(edgeKey);
  
                                  // Check if this edge has been logically reversed in adjRev
                                  const isReversed = st.adjRev && st.adjRev[origV] && st.adjRev[origV].includes(origU);
  
                                  // If reversed, we draw from origV -> origU. Otherwise, origU -> origV.
                                  const u = isReversed ? origV : origU;
                                  const v = isReversed ? origU : origV;

                                  const p1 = nodePositions[u];
                                  const p2 = nodePositions[v];
                                  if (!p1 || !p2) return null;

                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const angle = Math.atan2(dy, dx);
                                  
                                  const rOffset = 26; // Node radius
                                  const startX = p1.x + rOffset * Math.cos(angle);
                                  const startY = p1.y + rOffset * Math.sin(angle);
                                  const targetX = p2.x - rOffset * Math.cos(angle);
                                  const targetY = p2.y - rOffset * Math.sin(angle);
  
                                  // Highlight mapping based on whether the graph is currently flipped or original
                                  let isActiveChecking = false;
                                  let isScanChecking = false;
                                  let isJustInjected = false;

                                  if (isReversed) {
                                      // During Kahn's BFS (adjRev phase), activeNode is the safe node (origV) and checkNode is its neighbor (origU)
                                      isActiveChecking = st.activeNode === u && st.checkNode === v && String(st.phase || '').includes('dec_indegree');
                                  } else {
                                      // During standard initial scan
                                      isScanChecking = st.scanI === u && st.checkNode === v && String(st.phase || '').includes('indegree');
                                  }

                                  // Exactly at the inject_edge phase, the trace registers it. 
                                  // It is technically in adjRev already due to the way trace captures state after mutation.
                                  if (st.phase === 'inject_edge' && st.scanI === origU && st.checkNode === origV) {
                                      isJustInjected = true;
                                  }
  
                                  let strokeColor = isReversed ? "#94a3b8" : "#cbd5e1"; // darker slate if reversed
                                  let strokeWidth = isReversed ? "4" : "3";
                                  let animClass = "";
  
                                  if (isActiveChecking) {
                                      strokeColor = "#f43f5e"; // rose-500 (decrementing)
                                      strokeWidth = "6";
                                      animClass = "animate-pulse";
                                  } else if (isScanChecking) {
                                      strokeColor = "#0ea5e9"; // sky-500 (incrementing initially)
                                      strokeWidth = "5";
                                  } else if (isJustInjected) {
                                      strokeColor = "#f43f5e"; // rose-500 injected
                                      strokeWidth = "6";
                                      animClass = "animate-in fade-in zoom-in";
                                  }

                                  // Explicit arrow head drawing
                                  const arrowSize = isJustInjected || isActiveChecking ? 18 : 14;
                                  const arrowAngle = Math.PI / 6; // 30 degrees
                                  const arrowP1 = `${targetX},${targetY}`;
                                  const arrowP2 = `${targetX - arrowSize * Math.cos(angle - arrowAngle)},${targetY - arrowSize * Math.sin(angle - arrowAngle)}`;
                                  const arrowP3 = `${targetX - arrowSize * Math.cos(angle + arrowAngle)},${targetY - arrowSize * Math.sin(angle + arrowAngle)}`;
  
                                  return (
                                      <g key={edgeKey} className={`transition-all duration-500 ${animClass}`}>
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                              className="transition-all duration-500"
                                          />
                                          <polygon 
                                              points={`${arrowP1} ${arrowP2} ${arrowP3}`} 
                                              fill={strokeColor} 
                                              className="transition-all duration-500"
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
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isQueued = (st.q || []).includes(idx);
                        let isSafe = (st.safeNodes || []).includes(idx);
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isSafe) {
                            bgClass = 'bg-teal-600 text-white border-teal-700 shadow-md opacity-90';
                        } else if (isQueued) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-lg';
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
                        } else if (isQueued) {
                            ringClass = 'ring-2 ring-sky-300 border-transparent';
                        } else if (isSafe) {
                            ringClass = 'ring-2 ring-teal-400 border-transparent';
                            zIndex = 'z-20';
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
                                {isSafe && !isActive && <span className="absolute -top-6 text-[9px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-black border border-teal-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Safe</span>}
                                {isQueued && !isActive && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black border border-sky-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Queued</span>}
                                {st.isDone && !isSafe && <span className="absolute -top-6 text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-black border border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse uppercase tracking-widest whitespace-nowrap z-50">Trapped</span>}
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
                  <span>BFS Reversed Topological Sort</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><ShieldCheck size={28}/> Kahn's Safe State Resolution</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p><strong>Eventual Safe States</strong> asks us to find all nodes that strictly end in terminal nodes, entirely avoiding infinite cycle loops.</p>
                        <p>We solve this using Kahn's Algorithm (BFS), but we have a problem: Kahn's relies on <code>in-degree = 0</code> to start, but safe states naturally have an <code>out-degree = 0</code>. Our brilliant solution is to <strong>completely reverse all edges in the graph</strong>. Terminal safe nodes suddenly become <code>in-degree = 0</code> nodes! We can then peel them away backward using standard BFS.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example (Graph With Cycle):</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> graph = (0 &rarr; 1), (0 &rarr; 2), (1 &rarr; 2), (2 &rarr; 3), (3 &rarr; 1)</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">
                           Reversing the graph shows no nodes have an in-degree of 0.<br/>
                           The queue starts empty. No nodes can be safely traversed.<br/>
                           Because all nodes rely on each other in an infinite prerequisite cycle!
                       </span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-rose-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowLeft size={16}/> 1. Reverse the Graph</span>
                            <p className="text-sm text-slate-500">We iterate through the given graph and build an entirely new <code>adjRev</code> mapping. At the same time, we meticulously track the original outgoing edges as our new <code>indegree[]</code>.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-teal-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ListChecks size={16}/> 2. Backward BFS Resolution</span>
                            <p className="text-sm text-slate-500">Nodes with 0 original outgoing dependencies enter the Queue. We pop them, officially mark them "Safe", and trace backward using <code>adjRev</code> to free their parents. If parents hit 0 dependencies, they queue up next!</p>
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
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Original Adjacency List (Use | to separate nodes 0 to V-1)</label>
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
                    <div className="inline-flex items-center justify-center p-4 bg-teal-100 text-teal-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how Edge Reversal seamlessly unlocks Topological Sorting for cycle detection.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-teal-500"/> The Reversal Trick (adjRev)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If <code>A</code> points to <code>B</code>, <code>A</code> depends on <code>B</code> to resolve first. In an original graph, safe nodes are the ones with ZERO outgoing dependencies (they point nowhere). But Kahn's Algorithm explicitly looks for nodes with ZERO INCOMING edges! By entirely flipping the graph direction (<code>B</code> now points to <code>A</code>), the safe terminal nodes brilliantly map to `indegree = 0`. We can now feed them straight into Kahn's queue.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><AlertTriangle size={24} className="text-rose-500"/> Implicit Cycle Trapping</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If a cycle exists (like A &rarr; B &rarr; C &rarr; A), they all rely on each other to finish. Because they infinitely feed each other dependencies, their outgoing counts will NEVER hit 0. They will never enter Kahn's queue, and thus they will automatically be excluded from the final `safeNodes` list! The queue gracefully ignores them.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(V + E)</strong><br/>We iterate every node to build the reversed graph and indegree array O(V+E). We enqueue every node once. We pop every node once, and iterate its reversed neighbors exactly once O(V+E). Overall time is strictly linearly bound by O(V + E).</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(V + E)</strong><br/>The new <code>adjRev</code> Graph forces us to store all reversed edges explicitly, costing O(V+E). The <code>indegree[]</code> array takes O(V). The BFS Queue takes O(V). Thus, total Space Complexity is safely bounded by O(V + E).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-teal-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Eventual safe states is frequently asked by top-tier interviewers because it demands creative edge manipulation rather than just memorized graph templates."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could this be solved using standard DFS without reversing edges?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely."</p>
                            <p>With DFS, we don't reverse the edges. Instead, we dive deep using standard forward paths and use a <code>pathVis</code> array to dynamically track the current stack execution. If we complete DFS cleanly without hitting a marked `pathVis` node, we permanently mark the node safe in a `check[]` array. It is heavily preferred because it saves $O(V+E)$ space by skipping the reversed array creation."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we have to sort the output at the very end?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "BFS resolves independently safe branches simultaneously."</p>
                            <p>Because Kahn's algorithm resolves dependencies layer by layer, it might discover that node `7` is safe, then node `2` is safe on a completely unrelated branch in the same queue tick. The resulting list is technically a valid topological reverse-order, but LeetCode explicitly requests the final nodes to be sorted incrementally. It adds an $O(S \log S)$ overhead where S is the final count of safe states."</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>Original Adjacency List</label>
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
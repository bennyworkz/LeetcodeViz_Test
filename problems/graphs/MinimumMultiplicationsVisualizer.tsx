import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  minMultiplications: {
    id: 'minMultiplications',
    title: 'Minimum Multiplications to Reach End',
    icon: <NetworkIcon size={16} />,
    complexity: 'Time: O(100000 * N) | Space: O(100000)',
    theme: 'orange',
    code: `class Pair {
    int first, second;
    Pair(int first, int second) {
        this.first = first;
        this.second = second;
    }
}
class Solution {
    int minimumMultiplications(int[] arr, int start, int end) {
        Queue<Pair> q = new LinkedList<>();
        q.add(new Pair(start, 0));
        
        int[] dist = new int[100000];
        for(int i = 0; i < 100000; i++) dist[i] = (int)(1e9);
        
        dist[start] = 0;
        if(start == end) return 0;
        
        while(!q.isEmpty()) {
            int node = q.peek().first;
            int steps = q.peek().second;
            q.remove();
            
            for(int i = 0; i < arr.length; i++) {
                int num = (node * arr[i]) % 100000;
                
                if(steps + 1 < dist[num]) {
                    dist[num] = steps + 1;
                    if(num == end) return steps + 1;
                    q.add(new Pair(num, steps + 1));
                }
            }
        }
        return -1;
    }
}`,
    desc: "This problem asks for the minimum steps to reach 'end' by continually multiplying our current number by elements in an array and taking modulo 100,000. This forms an implicit directed graph! Because every multiplication takes exactly 1 step, we don't need a heavy Dijkstra Priority Queue. A standard FIFO Queue (Breadth-First Search) guarantees that the first time we generate the 'end' number, we have found the absolute minimum steps to get there."
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-500 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|minimumMultiplications|arr|start|end|Pair|LinkedList|Queue|PriorityQueue|ArrayList|List|Integer|String|pq|q|n|m|dist|steps|node|num|adjNode|edW|adj|it|add|isEmpty|peek|remove|length|size|continue)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'PriorityQueue', 'ArrayList', 'List', 'Tuple', 'Pair'].includes(part);
            const isPointer = ['arr', 'start', 'end', 'q', 'dist', 'steps', 'node', 'num', 'i'].includes(part);
            const isMapCall = ['minimumMultiplications', 'add', 'remove', 'isEmpty', 'peek', 'length', 'size', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"') || part === '1e9' || part === '100000';
            
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

export default function MinimumMultiplicationsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('minMultiplications');
  
  const [arrInput, setArrInput] = useState('2, 5, 7');
  const [startInput, setStartInput] = useState('3');
  const [endInput, setEndInput] = useState('30');

  const [baseArr, setBaseArr] = useState<number[]>([2, 5, 7]);
  const [baseStart, setBaseStart] = useState(3);
  const [baseEnd, setBaseEnd] = useState(30);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  // Adjusted initial pan to safely position the root node inside the viewing area
  const [pan, setPan] = useState({ x: 0, y: 50 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  const loadTestCase1 = () => {
      setArrInput('2, 5, 7');
      setStartInput('3');
      setEndInput('30'); 
  };

  const loadTestCase2 = () => {
      setArrInput('3, 4, 65');
      setStartInput('7');
      setEndInput('66175');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let arr = arrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (arr.length === 0) arr = [2];

        let s = parseInt(startInput.trim(), 10);
        if (isNaN(s) || s < 0) s = 3;
        
        let e = parseInt(endInput.trim(), 10);
        if (isNaN(e) || e < 0) e = 30;

        setBaseArr(arr);
        setBaseStart(s);
        setBaseEnd(e);
        setCurrentStep(0);
        setPan({ x: 0, y: 50 });
        setZoom(0.85);
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [arrInput, startInput, endInput]);

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

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const arr = baseArr;
    const start = baseStart;
    const end = baseEnd;
    
    if (arr.length === 0) return steps;

    let q: {num: number, steps: number}[] = [];
    
    // Using a Map to simulate the 100,000 array to keep memory light and UI focused
    let distMap: Record<number, number> = {}; 
    let distHistory: Record<number, number[]> = {};

    // Tree Layout Tracking
    let treeNodes: {id: string, num: number, steps: number, x: number, y: number, isTarget: boolean}[] = [];
    let treeEdges: {uId: string, vId: string, mult: number}[] = [];
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            arr, start, end, q: [...q], 
            distMap: {...distMap}, distHistory: JSON.parse(JSON.stringify(distHistory)), 
            treeNodes: clone1D(treeNodes), treeEdges: clone1D(treeEdges),
            ...stateObj 
        } 
    });

    add("Function Call", `int minimumMultiplications(int[] arr, int start=${start}, int end=${end})\nInitiating BFS shortest path search.`, 9, { phase: 'init' });
    
    add("Init Queue", `Queue<Pair> q = new LinkedList<>();\nCreated standard FIFO Queue. We DO NOT use a PriorityQueue here because every multiplication equals exactly 1 step!`, 10, { phase: 'init_queue' });
    
    q.push({num: start, steps: 0});
    treeNodes.push({ id: `n-${start}-0`, num: start, steps: 0, x: 0, y: 80, isTarget: start === end });

    add("Enqueue Source", `q.add(new Pair(start, 0));\nPushed initial node ${start} at step 0 into queue.`, 11, { phase: 'q_add_src' });

    add("Init Dist Array", `int[] dist = new int[100000];\nAllocated 100,000 size array to track min steps to reach every possible remainder.`, 13, { phase: 'init_dist_ds' });
    
    add("Set Dist Infinity", `for(int i = 0; i < 100000; i++) dist[i] = (int)(1e9);\nAll initial distances set to mathematical infinity.`, 14, { phase: 'dist_set_inf' });

    distMap[start] = 0;
    distHistory[start] = [0];
    add("Set Source Dist", `dist[start] = 0;\nThe steps required to reach the starting number is 0.`, 16, { phase: 'set_dist_src' });

    add("Base Case Check", `if(start == end) return 0;\nChecking if we are already at the destination.`, 17, { phase: 'check_base' });
    if (start === end) {
        add("Return Early", `return 0;\nSource matches destination exactly. Distance is 0!`, 17, { phase: 'done', isDone: true, isSuccess: true, finalSteps: 0 });
        return steps;
    }

    let targetFound = false;
    let finalSteps = -1;
    let popCount = 0; // Guard against infinite simulation

    while(q.length > 0 && !targetFound && popCount < 500) {
        popCount++;
        add("While Queue Loop", `while(!q.isEmpty())\nQueue has elements. Extracting next node to expand its multipliers.`, 19, { phase: 'while_q' });
        
        let node = q[0].num;
        add("Extract Node", `int node = q.peek().first;\nExtracting current number value: ${node}.`, 20, { phase: 'extract_node', activeNode: node });
        
        let currSteps = q[0].steps;
        add("Extract Steps", `int steps = q.peek().second;\nExtracting cumulative steps taken: ${currSteps}.`, 21, { phase: 'extract_steps', activeNode: node, activeSteps: currSteps });
        
        q.shift();
        add("Dequeue", `q.remove();\nPopped from standard FIFO Queue.`, 22, { phase: 'q_remove', activeNode: node, activeSteps: currSteps });

        // Find the visual ID and Position for the current node being expanded
        let activeNodeRef = treeNodes.find(n => n.num === node && n.steps === currSteps);
        let parentX = activeNodeRef ? activeNodeRef.x : 0;
        let parentId = activeNodeRef ? activeNodeRef.id : null;

        add("Multiplier Loop", `for(int i = 0; i < arr.length; i++)\nIterating through all available multipliers in arr [${arr.join(', ')}].`, 24, { phase: 'for_arr', activeNode: node, activeSteps: currSteps });

        for (let i = 0; i < arr.length; i++) {
            let mult = arr[i];
            let num = (node * mult) % 100000;
            
            add("Calculate New Number", `int num = (node * arr[i]) % 100000;\nnum = (${node} * ${mult}) % 100000 = ${num}.`, 25, { phase: 'calc_num', activeNode: node, activeSteps: currSteps, scanI: i, multiplier: mult, calculatedNum: num });

            let knownDist = distMap[num] !== undefined ? distMap[num] : 1e9;
            let isRelaxable = (currSteps + 1) < knownDist;

            let evalDesc = `if(steps + 1 < dist[num])\nEvaluating: ${currSteps} + 1 < ${knownDist === 1e9 ? '∞' : knownDist}`;
            if (!isRelaxable) evalDesc += `\nFAILED: We have already reached the number ${num} in fewer or equal steps earlier!`;
            else evalDesc += `\nPASSED! Found a faster way to generate ${num}!`;

            add("Evaluate Steps Condition", evalDesc, 27, { phase: 'eval_relax', activeNode: node, activeSteps: currSteps, scanI: i, multiplier: mult, calculatedNum: num, isRelaxable });

            if (isRelaxable) {
                if (distMap[num] !== undefined) {
                    if(!distHistory[num]) distHistory[num] = [];
                    distHistory[num].push(distMap[num]);
                } else {
                    distHistory[num] = [];
                }
                distMap[num] = currSteps + 1;
                
                add("Update Min Steps", `dist[num] = steps + 1;\nUpdated minimum steps required to reach ${num} to ${currSteps + 1}.`, 28, { phase: 'do_relax', activeNode: node, activeSteps: currSteps, scanI: i, multiplier: mult, calculatedNum: num, newDist: currSteps + 1 });

                // Calculate perfect geometric distribution for children extending downwards
                let childId = `n-${num}-${currSteps+1}-${Math.random().toString(36).substring(2, 7)}`;
                let hSpacing = Math.max(100, 260 - (currSteps * 40)); 
                let childX = parentX + (i - (arr.length - 1) / 2) * hSpacing;
                let childY = (currSteps + 1) * 140 + 80; // Scale uniformly down the y-axis

                treeNodes.push({ id: childId, num: num, steps: currSteps + 1, x: childX, y: childY, isTarget: num === end });
                if (parentId) {
                    treeEdges.push({ uId: parentId, vId: childId, mult: mult });
                }

                add("Check Target Arrival", `if(num == end) return steps + 1;\nChecking if newly generated number ${num} matches destination ${end}.`, 29, { phase: 'eval_target', activeNode: node, activeSteps: currSteps, scanI: i, multiplier: mult, calculatedNum: num });

                if (num === end) {
                    targetFound = true;
                    finalSteps = currSteps + 1;
                    add("Target Reached!", `return steps + 1;\nYES! BFS guarantees this is the minimum path to reach ${end}. Returning ${finalSteps}.`, 29, { phase: 'done', isDone: true, isSuccess: true, finalSteps: finalSteps });
                    break;
                }

                q.push({num: num, steps: currSteps + 1});
                add("Enqueue State", `q.add(new Pair(num, steps + 1));\nAdded state {num: ${num}, steps: ${currSteps + 1}} to Queue for next layer processing.`, 30, { phase: 'q_add', activeNode: node, activeSteps: currSteps, scanI: i, multiplier: mult, calculatedNum: num });
            }
        }
    }

    if (!targetFound) {
        add("Queue Empty Exit", `while(!q.isEmpty())\nQueue is completely empty. All possible paths explored without hitting destination.`, 19, { phase: 'done_while' });
        add("Final Return", `return -1;\nPath is impossible. Returning -1.`, 34, { phase: 'done', isDone: true, isSuccess: false });
    }

    return steps;
  }, [baseArr, baseStart, baseEnd]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => setCurrentStep(0); 
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
  const resetPanZoom = () => { setPan({x:0, y:50}); setZoom(0.85); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-orange-900 border-orange-800' : 'bg-slate-900 border-slate-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><NetworkIcon size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.isSuccess ? 'text-orange-400' : 'text-slate-400'}`}>
                    {st.isSuccess ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>} 
                    {st.isSuccess ? "TARGET NUMBER REACHED" : "UNREACHABLE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `The absolute minimum steps required to multiply from ${st.start} to ${st.end} is exactly ${curStepData.state?.finalSteps}.` : `It is mathematically impossible to reach ${st.end} using the given multipliers.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('q_add') || String(st.phase || '').includes('do_relax') ? 'text-emerald-400' : (String(st.phase || '').includes('eval_relax') ? 'text-amber-400' : (String(st.phase || '').includes('q_pop') || String(st.phase || '').includes('q_remove') || String(st.phase || '').includes('extract') ? 'text-orange-400' : (String(st.phase || '').includes('calc') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> FIFO Queue&lt;Pair&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[140px] max-h-[300px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (FIFO OUT)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.q || []).map((pair: {num: number, steps: number}, i: number) => {
                          let isNewArrival = String(st.phase || '').includes('q_add') && pair.num === st.calculatedNum && pair.steps === st.activeSteps + 1;
                          let isTop = i === 0;
                          let isPopping = isTop && (String(st.phase || '').includes('q_peek') || st.phase === 'q_remove' || st.phase.includes('extract_node') || st.phase.includes('extract_steps'));
                          
                          return (
                              <div key={`q-${i}-${pair.num}-${pair.steps}`} className={`px-3 py-2 flex items-center justify-between font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isNewArrival ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8 z-10 scale-105' : (isPopping ? 'bg-orange-500 border-orange-600 text-white animate-pulse ring-4 ring-orange-200 scale-105 z-10 relative' : (isTop ? 'bg-slate-800 border-slate-900' : 'bg-slate-700 border-slate-800'))}`}>
                                  <span className="text-xs bg-black/20 px-2 py-0.5 rounded shadow-inner">step: {pair.steps}</span>
                                  <span className="text-sm tracking-widest">val: {pair.num}</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">Start / End:</span>
                          <span className="font-bold text-slate-700">{st.start} &rarr; {st.end}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">arr:</span>
                          <span className="font-bold text-slate-700">{`{ ${st.arr ? st.arr.join(', ') : ''} }`}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-orange-500">node (Active):</span>
                          <span className="font-bold text-orange-700 text-sm tracking-widest">{st.activeNode !== undefined ? st.activeNode : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-orange-500">steps:</span>
                          <span className="font-bold text-orange-700">{st.activeSteps !== undefined ? st.activeSteps : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-sky-500">arr[i]:</span>
                          <span className="font-bold text-sky-700">{st.multiplier !== undefined ? st.multiplier : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-emerald-500">num (Next):</span>
                          <span className="font-bold text-emerald-700 text-sm tracking-widest">{st.calculatedNum !== undefined ? st.calculatedNum : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
  };

  const renderMainCanvas = () => {
      if (st.treeNodes === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      const nodes = st.treeNodes || [];
      const edges = st.treeEdges || [];

      // Calculate bounds for placing "STEP X" labels perfectly aligned on the left
      const levelsMap: Record<number, {minX: number, y: number}> = {};
      nodes.forEach((n: any) => {
          if (!levelsMap[n.steps]) {
              levelsMap[n.steps] = { minX: n.x, y: n.y };
          } else if (n.x < levelsMap[n.steps].minX) {
              levelsMap[n.steps].minX = n.x;
          }
      });

      return (
          <div className="w-full h-full flex flex-col items-center justify-start relative p-8">
              
              {/* Note the identical transform property applied here to ensure absolute alignment with nodes! */}
              <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible', transform: 'translate(50%, 0%)' }}>
                  {edges.map((e: any, idx: number) => {
                      let uNode = nodes.find((n: any) => n.id === e.uId);
                      let vNode = nodes.find((n: any) => n.id === e.vId);
                      if (!uNode || !vNode) return null;

                      let uX = uNode.x;
                      let uY = uNode.y + 24; // Start line at bottom of parent node
                      let vX = vNode.x;
                      let vY = vNode.y - 24; // End line at top of child node

                      let isActiveEdge = st.phase && st.activeNode === uNode.num && st.calculatedNum === vNode.num && st.activeSteps === uNode.steps;
                      let strokeColor = isActiveEdge ? "#10b981" : "#cbd5e1";
                      let strokeWidth = isActiveEdge ? 4 : 2;
                      let labelBg = isActiveEdge ? "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg font-black" : "bg-white text-slate-500 border-slate-200";

                      return (
                          <g key={`e-${e.uId}-${e.vId}`} className="transition-all duration-300">
                              <line 
                                  x1={uX} y1={uY} x2={vX} y2={vY}
                                  stroke={strokeColor}
                                  strokeWidth={strokeWidth}
                              />
                              <foreignObject x={((uX + vX)/2) - 20} y={((uY + vY)/2) - 15} width="40" height="30" className="overflow-visible">
                                  <div className={`w-full h-full flex items-center justify-center font-mono text-[11px] rounded-lg border shadow-sm transition-all duration-300 ${labelBg}`}>
                                      *{e.mult}
                                  </div>
                              </foreignObject>
                          </g>
                      )
                  })}
              </svg>

              <div className="absolute inset-0 w-full h-full z-10" style={{ transform: 'translate(50%, 0%)' }}>
                  
                  {/* Step Level Indicators (Left Aligned like the whiteboard image) */}
                  {Object.entries(levelsMap).map(([stepStr, lvl]) => {
                      let step = parseInt(stepStr);
                      return (
                          <div key={`step-label-${step}`} className="absolute font-black text-slate-400 tracking-widest text-[10px] uppercase transition-all duration-500" style={{ left: lvl.minX - 100, top: lvl.y, transform: 'translate(-50%, -50%)' }}>
                              Step {step}
                          </div>
                      )
                  })}

                  {/* Render the Tree Nodes */}
                  {nodes.map((n: any) => {
                      let vX = n.x;
                      let vY = n.y;

                      let isActive = st.activeNode === n.num && st.activeSteps === n.steps;
                      let isChecking = st.calculatedNum === n.num && st.activeSteps + 1 === n.steps;
                      let isDoneTarget = n.isTarget && st.isDone && st.isSuccess;

                      let bgClass = "bg-white text-slate-700 border-slate-300 shadow-sm";
                      let ringClass = "";

                      if (isActive) {
                          bgClass = "bg-orange-500 text-white border-orange-600 shadow-xl scale-110";
                          ringClass = "ring-4 ring-orange-300 ring-offset-2";
                      } else if (isChecking) {
                          bgClass = "bg-emerald-100 text-emerald-700 border-emerald-300 shadow-md scale-105";
                          ringClass = "ring-4 ring-emerald-200 ring-offset-2";
                      } else if (n.isTarget) {
                          bgClass = "bg-rose-100 text-rose-700 border-rose-300 shadow-md";
                      }

                      if (isDoneTarget) {
                          bgClass = "bg-emerald-500 text-white border-emerald-600 shadow-2xl scale-125 animate-pulse";
                          ringClass = "ring-4 ring-emerald-400 ring-offset-4";
                      }

                      return (
                          <div 
                              key={n.id} 
                              className={`absolute flex flex-col items-center justify-center transition-all duration-500 select-none`}
                              style={{ left: vX, top: vY, transform: 'translate(-50%, -50%)' }}
                          >
                              <div className={`px-4 py-2 flex items-center justify-center font-mono font-black text-lg rounded-2xl border-2 ${bgClass} ${ringClass}`}>
                                  {n.num}
                              </div>
                              {n.isTarget && <span className="absolute top-full mt-2 text-[9px] uppercase font-black tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded shadow-sm border border-rose-200">Target</span>}
                          </div>
                      )
                  })}
              </div>

              {/* Dynamic Bottom Evaluation HUD */}
              {st.phase && st.phase === 'calc_num' && st.calculatedNum !== undefined && (
                  <div className="absolute bottom-10 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2"><Activity size={14}/> Implicit Graph Edge Calculation</span>
                      <div className="flex items-center gap-4 font-mono font-black text-2xl text-slate-700">
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-orange-500 mb-1">node</span>
                              <span className="bg-orange-50 px-4 py-1 rounded-xl border border-orange-200 shadow-sm">{st.activeNode}</span>
                          </div>
                          <span className="text-slate-400 font-normal">X</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-sky-500 mb-1">arr[i]</span>
                              <span className="bg-sky-50 px-4 py-1 rounded-xl border border-sky-200 shadow-sm">{st.multiplier}</span>
                          </div>
                          <span className="text-slate-400 font-normal">% 100000 =</span>
                          <div className="flex flex-col items-center">
                              <span className="text-[9px] uppercase tracking-widest text-emerald-500 mb-1">num (Next)</span>
                              <span className="bg-emerald-50 px-5 py-2 rounded-xl border border-emerald-200 shadow-md text-3xl">{st.calculatedNum}</span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderStateArrays = () => {
      // Create an array of explicitly visualized dist items
      const activeDistEntries = Object.entries(st.distMap || {}).map(([key, val]) => ({ num: parseInt(key), steps: val as number }));
      // Sort by discovery to keep it consistent
      activeDistEntries.sort((a, b) => a.steps - b.steps);

      return (
      <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] pb-6 relative z-30">
          <div className="flex flex-col items-center shrink-0 w-full mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> dist[100000] Array (Sparse Visualization)</span>
              <div className="flex gap-3 items-end">
                  {activeDistEntries.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : activeDistEntries.map((entry) => {
                      let isSource = entry.num === st.start;
                      let isTarget = entry.num === st.end;
                      let history = st.distHistory && st.distHistory[entry.num] ? st.distHistory[entry.num] : [];
                      
                      let isNewlyWritten = (st.phase === 'do_relax' || st.phase === 'set_dist_src') && (st.calculatedNum === entry.num || (st.phase === 'set_dist_src' && isSource));
                      let isEvaluating = st.phase === 'eval_relax' && st.calculatedNum === entry.num;
                      
                      let boxBg = "bg-slate-50 text-slate-600 border-slate-300 font-black shadow-sm";
                      if (isNewlyWritten) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300 animate-in zoom-in font-black z-20";
                      else if (isEvaluating) boxBg += " ring-2 ring-sky-400 scale-105 z-10";

                      return (
                          <div key={`dist-${entry.num}`} className="flex flex-col items-center relative group">
                              <div className="absolute bottom-full mb-1 flex flex-col-reverse items-center justify-end gap-0.5 max-h-[80px] overflow-hidden leading-none">
                                  {(history || []).map((hVal: number, hIdx: number) => (
                                      <span key={`hd-${entry.num}-${hIdx}`} className="text-[10px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-2 leading-tight bg-white/90 px-1 rounded shadow-sm">{hVal === 1e9 ? '∞' : hVal}</span>
                                  ))}
                                  {history.length === 0 && <span className="text-[10px] font-mono font-black text-rose-500 opacity-60 line-through decoration-rose-600 decoration-2 leading-tight bg-white/90 px-1 rounded shadow-sm">∞</span>}
                              </div>
                              <div className={`px-4 py-2 flex flex-col items-center justify-center font-mono rounded-xl border-2 transition-all duration-300 ${boxBg}`}>
                                  <span className="text-[8px] opacity-70 uppercase tracking-widest mb-0.5">steps</span>
                                  <span className="text-xl leading-none">{entry.steps}</span>
                              </div>
                              <span className={`absolute top-full mt-2 px-2 py-0.5 rounded border shadow-sm text-[10px] font-mono font-black ${isSource ? 'bg-orange-100 text-orange-700 border-orange-300' : (isTarget ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-slate-100 text-slate-500 border-slate-200')}`}>
                                  val {entry.num}
                              </span>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>Implicit Graph BFS</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><NetworkIcon size={28}/> Implicit Graph Generation</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a <code>start</code> number, an <code>end</code> number, and an array of multipliers <code>arr[]</code>, we want to find the minimum steps required to multiply our way from start to end (always taking modulo 100000 to keep numbers small).</p>
                        <p>Instead of a traditional graph with an Adjacency List, the graph is generated dynamically! From any number, its "neighbors" are simply that number multiplied by each element in the array.</p>
                        <p>Because every single multiplication counts as exactly "1 step", this is an unweighted graph. Thus, a standard <strong>Breadth-First Search (BFS)</strong> using a regular Queue perfectly finds the shortest path, exploring all 1-step multiples, then all 2-step multiples, etc.</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Simple Expansion</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>arr:</strong> {`{ 2, 5, 7 }`}<br/><strong>start:</strong> 3<br/><strong>end:</strong> 30</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">2</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Step 1: 3 * 2 = 6<br/>Step 2: 6 * 5 = 30. It took exactly 2 steps to reach the target 30.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Modulo Wrapping</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>arr:</strong> {`{ 3, 4, 65 }`}<br/><strong>start:</strong> 7<br/><strong>end:</strong> 66175</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">4</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">The tree will multiply up past 100,000, trigger the modulo operator, wrap around, and eventually land exactly on 66175 after 4 optimal steps.</span>
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
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-3">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>Multipliers arr[]</label>
                            <input type="text" value={arrInput} onChange={(e) => setArrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner font-bold text-cyan-700`} placeholder="2, 5, 7" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-orange-600 pl-1`}>Start</label>
                            <input type="text" value={startInput} onChange={(e) => setStartInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner font-bold text-orange-600`} />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-rose-600 pl-1`}>End</label>
                            <input type="text" value={endInput} onChange={(e) => setEndInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner font-bold text-rose-600`} />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                            <button onClick={resetPanZoom} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 h-[650px]">
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><NetworkIcon size={14} className={`text-${themeColor}-500`}/> BFS Tree Visualizer</span>
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            <div className="absolute inset-0 w-full h-full transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                                {renderMainCanvas()}
                            </div>
                        </div>
                        {/* Safe Bottom Dock for Arrays */}
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
                    <div className="inline-flex items-center justify-center p-4 bg-orange-100 text-orange-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how shortest paths translate to mathematical multiplication sequences.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><NetworkIcon size={24} className="text-orange-500"/> Phase 1: Implicit Graphing</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Usually, graphs are provided explicitly as an Adjacency List (e.g., node 1 connects to node 2 and 5). Here, the graph is implicit! We are at a specific number (a node), and its adjacent neighbors are simply that number multiplied by every element in <code>arr[]</code> modulo 100000. By doing this dynamically during the search, we traverse an infinite mathematical tree bounded only by the modulo!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowDownToLine size={24} className="text-emerald-500"/> Phase 2: Why not Dijkstra's Priority Queue?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we draw out the multiplication tree, every single branch represents exactly 1 multiplication step. Since all edge weights are strictly identical (Weight = 1), using a Priority Queue is unnecessary overhead. A standard Breadth-First Search (BFS) using a FIFO Queue inherently guarantees that the first time we discover the target number, it is unequivocally the shortest path!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(100000 * N)</strong><br/>The modulo operation strictly limits our universe to exactly 100,000 possible nodes (0 through 99,999). In the absolute worst case, we might visit every single number. At each number, we multiply it by the N elements in `arr[]`. Thus, the algorithm strictly runs in O(100000 * N) time.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(100000)</strong><br/>The <code>dist[]</code> array takes exactly 100,000 integer spaces. The Queue, in the worst case, can hold up to 100,000 elements. Total space is comfortably O(100000).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-orange-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential 'hidden graph' problem. Interviewers use this to test if you can recognize a shortest-path graph problem even when no explicit graph data structure is given."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What is the purpose of the 100,000 size `dist[]` array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It acts as our visited tracker and our optimization cache."</p>
                            <p>Because the problem applies a modulo of 100000, there are only 100,000 possible states. If we reach the number '14' in 2 steps, and later find another path that reaches '14' in 5 steps, we discard the slower path! The `dist[]` array prevents infinite loops and ensures we only expand optimal paths."</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if the modulo wasn't required?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The BFS tree would expand infinitely."</p>
                            <p>Without the modulo constraint restricting the state space, numbers would continue to multiply infinitely. If the target `end` number wasn't reachable, the Queue would never empty, resulting in a Memory Limit Exceeded crash. The modulo is what bounds the graph's size!"</p>
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
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1`}>Arr[]</label>
                          <input type="text" value={arrInput} onChange={(e) => setArrInput(e.target.value)} className={`w-32 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-cyan-500 font-bold`} />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-orange-600 shrink-0 ml-2`}>Start</label>
                          <input type="text" value={startInput} onChange={(e) => setStartInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-orange-500 font-bold text-orange-600`} />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-rose-600 shrink-0 ml-2`}>End</label>
                          <input type="text" value={endInput} onChange={(e) => setEndInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-rose-500 font-bold text-rose-600`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={resetPanZoom} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute inset-0 w-full h-full transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split
} from 'lucide-react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
}

interface PointerLabelProps {
  label: string;
  color: string;
  position: 'top' | 'bottom';
  offset?: number;
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isSwapTarget?: boolean;
}

const OPERATIONS = {
  swapNodesIterative: {
    id: 'swapNodesIterative',
    title: 'Pointer Swap (Optimal)',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void swapNodes(int x, int y) {
    if (x == y) return;

    // 1. Find X and its previous
    Node prevX = null, currX = head;
    while (currX != null && currX.data != x) {
        prevX = currX;
        currX = currX.next;
    }

    // 2. Find Y and its previous
    Node prevY = null, currY = head;
    while (currY != null && currY.data != y) {
        prevY = currY;
        currY = currY.next;
    }

    // If either x or y is not present
    if (currX == null || currY == null) return;

    // 3. Update previous pointers
    if (prevX != null) prevX.next = currY;
    else head = currY;

    if (prevY != null) prevY.next = currX;
    else head = currX;

    // 4. Swap next pointers
    Node temp = currX.next;
    currX.next = currY.next;
    currY.next = temp;
}`,
    desc: "A surgical pointer reconfiguration. Instead of moving data, we identify the specific memory nodes and their predecessors, then perform a four-way 'handshake' to exchange their positions in the sequence."
  }
};

// --- Top Level Helper Components ---

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${
      active 
        ? 'bg-[#1e293b] text-white shadow-md scale-105' 
        : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|swapNodes|head|next|data|prevX|currX|prevY|currY|temp)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-rose-500/20`, border: `border-rose-500`, text: `text-rose-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-rose-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'return', 'if', 'else', 'while', 'boolean', 'void', 'new'].includes(part);
            const isObject = ['Node'].includes(part);
            const isNumber = !isNaN(parseInt(part));
            const isComment = part.startsWith('//');
            const isPointer = ['prevX', 'currX', 'prevY', 'currY', 'head', 'temp'].includes(part);
            return (
              <span key={i} className={isComment ? 'text-slate-500 italic' : isKeyword ? 'text-pink-400 font-bold' : isObject ? 'text-sky-400 font-bold' : isNumber ? 'text-emerald-400' : isPointer ? 'text-rose-400' : ''}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        slate: 'bg-white text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {label}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isSwapTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-rose-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500 ${isSwapTarget ? 'scale-110 shadow-2xl' : ''}`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{address}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>
                    {val}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}>
                    <span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NEXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Application ---

export default function swapNodesViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('swapNodesIterative');
  const [inputList, setInputList] = useState('10, 15, 12, 13, 20, 14');
  const [swapTargets, setSwapTargets] = useState({ x: '12', y: '20' });
  const [baseList, setBaseList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Viewport & Arena State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const arenaRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  // Initialize nodes
  useEffect(() => {
    const generateNodes = (input) => {
        const vals = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 8);
        return vals.map((v, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 60 + col * 200; 
            const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 
            return { id: i, val: v, addr: '0x' + (100 + (i * 32)).toString(16).toUpperCase().padStart(3, '0'), nextId: i < vals.length - 1 ? i + 1 : null, x, y };
        });
    };
    setBaseList(generateNodes(inputList));
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputList]);

  // Trackpad Zoom Logic
  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        const delta = -e.deltaY * 0.005;
        setZoom(prev => {
            const next = prev + delta;
            return Math.min(Math.max(next, 0.3), 3);
        });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return steps;
    let list = baseList.map(n => ({...n}));
    const targetX = parseInt(swapTargets.x);
    const targetY = parseInt(swapTargets.y);

    const addStep = (phase, desc, line, stateProps) => {
      steps.push({ phase, description: desc, line, state: { list: list.map(n=>({...n})), ...stateProps } });
    };

    addStep("Initialize", `Searching for nodes with values ${targetX} and ${targetY}.`, 1, { currX: null, currY: null });
    
    if (targetX === targetY) {
        addStep("Same Value", "X and Y are the same node. No swap required.", 2, { isSuccess: true, finalSeq: list.map(n => n.val).join(' → ') });
        return steps;
    }

    // Scan for X
    let prevX = null, currX = 0;
    while (currX !== null) {
        let node = list.find(n => n.id === currX);
        if (!node) break;
        addStep("Locate Node X", `Scanning heap for value ${targetX}. Current: ${node.val}`, 6, { currX, prevX });
        if (node.val === targetX) break;
        prevX = currX;
        currX = node.nextId;
    }

    // Scan for Y
    let prevY = null, currY = 0;
    while (currY !== null) {
        let node = list.find(n => n.id === currY);
        if (!node) break;
        addStep("Locate Node Y", `Scanning heap for value ${targetY}. Current: ${node.val}`, 12, { currX, prevX, currY, prevY });
        if (node.val === targetY) break;
        prevY = currY;
        currY = node.nextId;
    }

    if (currX === null || currY === null) {
        addStep("Error: Not Found", "One or both target values do not exist in the current heap.", 18, { isSuccess: false });
        return steps;
    }

    // Re-link predecessors
    addStep("Re-wire Inputs", "Updating predecessor 'next' pointers to point to their new swap counterparts.", 21, { currX, prevX, currY, prevY });
    if (prevX !== null) {
        let node = list.find(n => n.id === prevX);
        if (node) node.nextId = currY;
    }
    if (prevY !== null) {
        let node = list.find(n => n.id === prevY);
        if (node) node.nextId = currX;
    }
    addStep("Inputs Linked", "The incoming links have been successfully crossed over.", 25, { currX, prevX, currY, prevY, reLinked: true });

    // Swap next pointers
    addStep("Swap Exits", "Final Step: Swapping the 'next' pointers of the target nodes themselves.", 28, { currX, currY, reLinked: true });
    let nodeX = list.find(n => n.id === currX);
    let nodeY = list.find(n => n.id === currY);
    if (nodeX && nodeY) {
        let temp = nodeX.nextId;
        nodeX.nextId = nodeY.nextId;
        nodeY.nextId = temp;
    }

    // Approximate sequence result
    let finalNodes = [];
    let startId = (prevX === null) ? currY : (prevY === null) ? currX : 0;
    let safety = 0;
    while(startId !== null && safety < 10) {
        let n = list.find(it => it.id === startId);
        if (!n) break;
        finalNodes.push(n.val);
        startId = n.nextId;
        safety++;
    }

    addStep("Swap Complete", "Physical memory reconfiguration finished.", 32, { isSuccess: true, finalSeq: finalNodes.join(' → ') });
    return steps;
  }, [baseList, swapTargets]);

  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(1); };
  const handleCopy = () => { navigator.clipboard.writeText(selectedOp.code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); 
  };
  const handlePointerUp = () => setIsDragging(false);

  const curStepData = trace[currentStep] || trace[0] || { state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    return st.list.map((node) => {
        if (node.nextId === null) return null;
        const target = st.list.find(n => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const isModified = st.reLinked;
        const strokeColor = isModified ? '#10b981' : '#cbd5e1';
        const strokeWidth = isModified ? 3 : 2;
        const isLongJump = Math.abs(target.id - node.id) > 1;
        const pathD = isLongJump 
            ? `M ${startX},${startY} C ${startX + 50},${startY + 95} ${endX - 50},${endY + 95} ${endX},${endY}`
            : `M ${startX},${startY} C ${startX + 15},${startY} ${endX - 15},${endY} ${endX},${endY}`;
        return <path key={`link-${node.id}-${target.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Repeat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Swap Nodes</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest">Pointer Exchange</span>
                  <span>•</span>
                  <span>In-Place Heap analysis</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Repeat size={28}/> Efficiency First</div>
                    <p className="text-lg leading-relaxed">Swapping nodes by physically changing their <strong>memory references</strong> avoids the high CPU cost of moving data blocks. This is critical when nodes store heavy binary objects or large strings.</p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Challenge</h4>
                        <p className="text-sm leading-relaxed text-slate-600 leading-relaxed">Unlike arrays, Linked List nodes don't know who points to them. You must find the predecessors (<code>prev</code>) before you can perform the swap.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Cpu size={16} className="text-indigo-500"/> Performance</h4>
                        <p className="text-sm leading-relaxed text-slate-600 leading-relaxed text-sm">Operation is <strong>O(N)</strong> for time and <strong>O(1)</strong> for space. It is the most scalable way to rearrange sequence pointers.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Braces size={120}/></div>
                    <h3 className="font-black text-rose-400 text-lg uppercase tracking-widest mb-6">Execution Logic</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                        <p><strong>1. Search & Store:</strong> Traverse the list to find the memory addresses of Node X and Node Y. Crucially, capture their <code>prev</code> predecessors during this scan.</p>
                        <p><strong>2. Pointer Handshake:</strong> Link <code>prevX</code> to Node Y and <code>prevY</code> to Node X. Special attention is required if either node is the current <code>head</code> of the list.</p>
                        <p><strong>3. Exit Link Exchange:</strong> Finally, swap the <code>next</code> pointers of the target nodes. This "re-anchors" the segments that follow them.</p>
                    </div>
                </div>
                <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100">
                    <h4 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Info size={16}/> Adjacent Node Case</h4>
                    <p className="text-sm text-indigo-700">If X is the parent of Y, a naive pointer swap could lead to Y pointing back to itself. This algorithm handles that by correctly assigning the three affected next pointers.</p>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-rose-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest tracking-tight text-white">Interviewer Insights</h3>
                    <p className="text-sm text-rose-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers are testing your mental model of the heap. Swapping the actual pointers shows you understand memory efficiency and the low-level mechanics of non-contiguous data structures."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Essential Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>X == Y?</strong> Always ask about the early return if the values are identical.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Head Swap:</strong> Describe how the Dummy node pattern could simplify this, though it's often done with conditional pointer updates.</div></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-500 border-b pb-2">Common Red Flags</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><XCircle className="text-rose-500 shrink-0" size={20}/> <div><strong>Data Swapping:</strong> Don't just do <code>temp = x.data</code>. Explicitly state why pointer swapping is superior for complex objects.</div></li>
                            <li className="flex gap-4 items-start"><XCircle className="text-rose-500 shrink-0" size={20}/> <div><strong>Losing the list:</strong> Explain why you must find predecessors FIRST before modifying any <code>next</code> links.</div></li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Swap.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-800">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
                <div className={`rounded-3xl p-6 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Operations</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-sm leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">Nodes physically re-linked without data swap.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1">Initial Data</label>
                        <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1 text-rose-500">Node X</label>
                        <input type="text" value={swapTargets.x} onChange={(e) => setSwapTargets({...swapTargets, x: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1 text-rose-500">Node Y</label>
                        <input type="text" value={swapTargets.y} onChange={(e) => setSwapTargets({...swapTargets, y: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button 
                            onClick={handleNext} 
                            disabled={isLastStep || st.isSuccess} 
                            className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}
                        >
                            STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[420px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur">
                           <Network size={14} className="text-indigo-500"/> Physical Memory
                       </span>
                   </div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} title="Simulated Fullscreen" className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
                            <div className="bg-[#0f172a] border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={32}/></div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">FINAL SEQUENCE</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner tracking-tighter">
                                    {String(st.finalSeq)}
                                </div>
                                <button onClick={handleReset} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                                    <RotateCcw size={18}/> RESTART VIZ
                                </button>
                            </div>
                        </div>
                   )}

                   <div 
                    ref={canvasContainerRef}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={handlePointerUp} 
                    onPointerLeave={handlePointerUp}
                   >
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj, idx) => {
                              const isCurrX = st.currX === nodeObj.id; const isCurrY = st.currY === nodeObj.id;
                              const isPrevX = st.prevX === nodeObj.id; const isPrevY = st.prevY === nodeObj.id;
                              const isSwapTarget = isCurrX || isCurrY;
                              const isTarget = isSwapTarget || isPrevX || isPrevY;
                              const lbls = [];
                              if (idx === 0) lbls.push({ text: "initial_head", color: "emerald", pos: "top" });
                              if (isCurrX) lbls.push({ text: "currX", color: "rose", pos: "bottom" });
                              if (isCurrY) lbls.push({ text: "currY", color: "rose", pos: "bottom" });
                              if (isPrevX) lbls.push({ text: "prevX", color: "amber", pos: "top" });
                              if (isPrevY) lbls.push({ text: "prevY", color: "amber", pos: "top" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={isSwapTarget ? 'rose' : (isPrevX || isPrevY) ? 'amber' : 'slate'} isSwapTarget={isSwapTarget}/>
                                  </div>
                              )
                           })}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Simulated Fullscreen Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* LEFT SIDEBAR: Code & Logic */}
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-4">
                          <div className="bg-rose-600 p-2 rounded-lg text-white shadow-lg"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Source Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                          <Minimize size={20}/>
                      </button>
                  </div>

                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Operations</span></div>
                            <span>Line {String(curStepData.line || 0)}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>

              {/* RIGHT ARENA: The Canvas */}
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Tool Corner */}
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>

                  {/* FS Corner Navigation Buttons */}
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button 
                            onClick={handlePrev} 
                            disabled={currentStep === 0}
                            className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"
                          >
                              <ChevronLeft size={32}/> PREV
                          </button>
                          <button 
                            onClick={handleNext} 
                            disabled={isLastStep}
                            className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500"
                          >
                              NEXT <ChevronRight size={32}/>
                          </button>
                      </div>
                  )}

                  {/* Large Scale Canvas */}
                  <div 
                    ref={canvasContainerRef}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={handlePointerUp} 
                    onPointerLeave={handlePointerUp}
                  >
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.5})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj, idx) => {
                              const isCurrX = st.currX === nodeObj.id; const isCurrY = st.currY === nodeObj.id;
                              const isPrevX = st.prevX === nodeObj.id; const isPrevY = st.prevY === nodeObj.id;
                              const isSwapTarget = isCurrX || isCurrY;
                              const lbls = [];
                              if (idx === 0) lbls.push({ text: "head", color: "emerald", pos: "top" });
                              if (isCurrX) lbls.push({ text: "currX", color: "rose", pos: "bottom" });
                              if (isCurrY) lbls.push({ text: "currY", color: "rose", pos: "bottom" });
                              if (isPrevX) lbls.push({ text: "prevX", color: "amber", pos: "top" });
                              if (isPrevY) lbls.push({ text: "prevY", color: "amber", pos: "top" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isCurrX||isCurrY||isPrevX||isPrevY} themeColor={isSwapTarget ? 'rose' : (isPrevX || isPrevY) ? 'amber' : 'slate'} isSwapTarget={isSwapTarget}/>
                                  </div>
                              )
                           })}
                      </div>
                  </div>

                  {/* FS Result Overlay */}
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">RECONFIGURATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Physical memory pointers exchanged</p>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter">
                                    {String(st.finalSeq)}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}
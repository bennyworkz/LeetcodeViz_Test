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
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, MoveHorizontal, AlertCircle
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  iterativeFlag: {
    id: 'iterativeFlag',
    title: 'Flag-Based (Optimal)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void zigZag(Node head) {
    // Flag true means '<' expected, false means '>'
    boolean flag = true; 
    Node curr = head;

    while (curr != null && curr.next != null) {
        if (flag) { // Expect <
            if (curr.data > curr.next.data) {
                swap(curr, curr.next);
            }
        } else { // Expect >
            if (curr.data < curr.next.data) {
                swap(curr, curr.next);
            }
        }
        curr = curr.next;
        flag = !flag; // Flip requirement
    }
}`,
    desc: "The most efficient method. We maintain a boolean flag to toggle between 'Less Than' and 'Greater Than' requirements. If a pair violates the current requirement, we swap their data and move to the next pair."
  },
  sortSwap: {
    id: 'sortSwap',
    title: 'Sort & Adjacent Swap',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N log N) | Space: O(1)',
    code: `public void zigZag(Node head) {
    // 1. Sort the entire list
    sort(head); 

    // 2. Swap adjacents starting from 2nd node
    Node curr = head.next;
    while (curr != null && curr.next != null) {
        swap(curr, curr.next);
        if (curr.next != null) 
            curr = curr.next.next;
        else break;
    }
}`,
    desc: "A reliable but slower approach. First, we sort the list into ascending order. Then, starting from the second node, we swap every pair of adjacent elements. This naturally creates the < > pattern."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|void|return|if|else|while|Node|null|zigZag|head|next|data|flag|boolean|true|false|curr|swap|sort)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'void', 'return', 'if', 'else', 'while', 'boolean'].includes(part);
            const isObject = ['Node'].includes(part);
            const isConst = ['true', 'false', 'null'].includes(part);
            const isPointer = ['head', 'next', 'curr', 'flag'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
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

interface PointerLabelProps {
  label: string;
  color: string;
  position: 'top' | 'bottom';
  offset?: number;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        slate: 'bg-white text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface ListNodeBlockProps {
  val: string | number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isViolation?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isViolation }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-indigo-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>
                    {String(val)}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}>
                    <span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NEXT</span>
                </div>
            </div>
            {isViolation && (
                <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg animate-bounce z-40">
                    <AlertCircle size={14}/>
                </div>
            )}
        </div>
    );
};

// --- Main Application ---

export default function ZigZagReorderLLViz() {
  // 1. State Hooks
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('iterativeFlag');
  const [inputList, setInputList] = useState('11, 15, 20, 5, 10');
  const [baseList, setBaseList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  // 2. Refs
  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  // 3. Early Interaction Handlers
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 50 }); 
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

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  // 4. Initialization Logic
  useEffect(() => {
    const generateNodes = (input) => {
        const vals = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 10);
        return vals.map((v, i) => ({
            id: i,
            val: v,
            addr: '0x' + (100 + (i * 32)).toString(16).toUpperCase().padStart(3, '0'),
            nextId: i < vals.length - 1 ? i + 1 : null,
            x: 60 + (i * 180),
            y: 220
        }));
    };
    setBaseList(generateNodes(inputList));
    setCurrentStep(0);
    setPan({ x: 100, y: 50 });
  }, [inputList]);

  // 5. Trackpad Zoom
  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 6. Trace Memoization
  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter list values.', state: { list: [] } }];
    
    let list = baseList.map(n => ({...n}));
    const add = (ph, ds, ln, st) => steps.push({ phase: ph, description: ds, line: ln, state: { list: list.map(n=>({...n})), ...st } });

    if (selectedOpId === 'iterativeFlag') {
        let curr = 0;
        let flag = true; // true means expect <
        add("Initialize", "Setting flag to true (expecting curr < next).", 3, { curr, flag });

        while (curr !== null) {
            const node = list.find(n => n.id === curr);
            const nextNode = list.find(n => n.id === node?.nextId);
            
            if (!nextNode) break;

            add("Loop Condition", `Checking Node(${node.val}) ${flag ? '<' : '>'} Node(${nextNode.val}).`, 6, { curr, flag, nextId: nextNode.id });

            const conditionMet = flag ? (node.val < nextNode.val) : (node.val > nextNode.val);

            if (!conditionMet) {
                add("Violation Found", `Requirement violated! Swapping data values.`, 8, { curr, flag, nextId: nextNode.id, isViolated: true });
                const temp = node.val;
                node.val = nextNode.val;
                nextNode.val = temp;
                add("Data Swapped", `Nodes swapped. Order corrected.`, 9, { curr, flag, nextId: nextNode.id, isSwapping: true });
            } else {
                add("Condition Valid", "Current pair satisfies the requirement.", 7, { curr, flag });
            }

            curr = nextNode.id;
            flag = !flag;
            add("Flip Flag", `Moving forward and flipping flag to ${flag ? '<' : '>'}.`, 16, { curr, flag });
        }
    } else {
        add("Sort List", "Performing an ascending sort on the entire list.", 3, { isSorting: true });
        list.sort((a,b) => a.val - b.val);
        list = list.map((n, i) => ({...n, x: 60 + (i * 180)}));
        
        let curr = 1;
        while (curr !== null) {
            const node = list.find(n => n.id === curr);
            const nextNode = list.find(n => n.id === node?.nextId);
            if (!nextNode) break;

            add("Adjacent Swap", `Swapping Node(${node.val}) and Node(${nextNode.val}).`, 9, { curr: node.id, nextId: nextNode.id });
            const temp = node.val;
            node.val = nextNode.val;
            nextNode.val = temp;
            
            curr = list.find(n => n.id === nextNode.id)?.nextId || null;
            if (curr !== null) curr = list.find(n => n.id === curr)?.nextId || null; 
            add("Advance", "Jumping two nodes ahead.", 12, { curr });
        }
    }

    let finalSeq = list.map(n => n.val).join(' < ');
    add("Complete", "Zig-Zag rearrangement finished successfully.", 19, { isSuccess: true, finalSeq });

    return steps;
  }, [baseList, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    return (st.list || []).map((node) => {
        if (node.nextId === null || node.nextId === undefined) return null;
        const target = st.list.find((n) => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const strokeColor = '#cbd5e1';
        const pathD = `M ${startX},${startY} C ${startX + 30},${startY} ${endX - 30},${endY} ${endX},${endY}`;
        return <path key={`link-${String(node.addr)}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <MoveHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Zig-Zag Reorder</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {"a < b > c < d"}
                  </span>
                  <span>•</span>
                  <span>Pointer Stability</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Repeat size={28}/> Converging Waves</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      {"Rearrange the list so that nodes alternate between being smaller and larger than their neighbors ($a < b > c < d$). This is a classic test of conditional state maintenance."}
                    </p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed">Unlike arrays, we often want to minimize pointer movement. Swapping data values is usually acceptable, though physically moving nodes is the "pure" approach.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Complexity</h4>
                        <p className="text-sm leading-relaxed leading-relaxed text-sm">The optimal iterative approach is <strong>O(N)</strong>. Sorting followed by swapping is <strong>O(N log N)</strong>, which is acceptable but not preferred.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> ZigZag.java</span>
                    <button onClick={() => { navigator.clipboard.writeText(selectedOp.code); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex-1 max-w-[400px] space-y-1.5 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1">List Data</label>
                        <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isViolated ? 'bg-rose-900/40 border-rose-800' : st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-900/40 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight italic">Zig-Zag order established.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[460px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Physical Memory</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isNext = st.nextId === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isCurr) themeColor = 'indigo';
                              if (isNext) themeColor = 'rose';

                              const lbls = [];
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "top" });
                              if (isNext) lbls.push({ text: "next", color: "rose", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'top').map((l, i) => (
                                          <PointerLabel key={`top-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'bottom').map((l, i) => (
                                          <PointerLabel key={`bottom-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isCurr||isNext} themeColor={themeColor} isViolation={st.isViolated && (isCurr || isNext)}/>
                                  </div>
                              )
                           })}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Braces size={120}/></div>
                    <h3 className="font-black text-rose-400 text-lg uppercase tracking-widest mb-6">The Flag Strategy</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. Parity Toggle:</strong> Maintain a <code>flag</code> initialized to <code>true</code>. When <code>true</code>, we expect the current node to be smaller than the next. When <code>false</code>, we expect it to be larger.</p>
                        <p><strong>2. Atomic Swap:</strong> If the expectation is not met, we swap the <code>data</code> of the nodes. This corrects the local segment without needing to look ahead further.</p>
                        <p><strong>3. Advancement:</strong> We move to the next node and flip the flag. Because each swap only affects the current pair, the O(N) pass is sufficient to satisfy the entire chain.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-rose-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-rose-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking the Zig-Zag</h3>
                    <p className="text-sm text-rose-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers check if you try to sort first. Mentioning the Sorting approach is fine, but immediately offering the O(N) flag-based swap demonstrates you understand greedy local corrections."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Data vs Node Swap:</strong> In most interviews, swapping <code>node.data</code> is sufficient. Swapping physical nodes requires keeping track of <code>prev</code> pointers.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>One-Pass Logic:</strong> Explain why a single pass works: any swap made at index <code>i</code> to satisfy the flag won't invalidate the satisfaction achieved at index <code>i-1</code>.</div></li>
                        </ul>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-rose-600 p-2 rounded-lg text-white shadow-lg shadow-rose-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isViolated ? 'bg-rose-900/40 border-rose-800' : st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <span>Line {String(curStepData.line || 0)}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500 shadow-indigo-900/20">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isNext = st.nextId === nodeObj.id;
                              let blockTheme = 'slate';
                              if (isCurr) blockTheme = 'indigo';
                              if (isNext) blockTheme = 'rose';
                              const lbls = [];
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "top" });
                              if (isNext) lbls.push({ text: "next", color: "rose", pos: "bottom" });
                              return (
                                  <div key={nodeObj.addr} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'top').map((l, i) => (
                                          <PointerLabel key={`fs-top-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {lbls.filter(l => l.pos === 'bottom').map((l, i) => (
                                          <PointerLabel key={`fs-bottom-${i}`} label={l.text} color={l.color} position={l.pos as 'top' | 'bottom'} />
                                        ))}
                                      </div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isCurr||isNext} themeColor={blockTheme} isViolation={st.isViolated && (isCurr || isNext)}/>
                                  </div>
                              )
                           })}
                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-white text-center">ZIG-ZAG COMPLETE</h2>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter text-center">
                                    {String(trace[trace.length - 1].state.finalSeq)}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg shadow-emerald-900/20">
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
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
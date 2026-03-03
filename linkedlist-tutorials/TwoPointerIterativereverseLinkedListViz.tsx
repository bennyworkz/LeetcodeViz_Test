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
  Link as LinkIcon, Smartphone, CpuIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  reverseTwoPointer: {
    id: 'reverseTwoPointer',
    title: '2-Pointer Displacement',
    icon: <Repeat size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node reverse(Node head) {
    Node prev = null;
    
    // Using 'head' itself as the crawler
    while (head != null) {
        // 1. Temporarily store current
        Node curr = head;
        
        // 2. Advance head BEFORE breaking link
        head = head.next;
        
        // 3. Reverse current node's link
        curr.next = prev;
        
        // 4. Update prev for next node
        prev = curr;
    }
    
    return prev;
}`,
    desc: "The 'displacement' method. Instead of a third 'next' pointer, we move the 'head' pointer forward to safety before re-linking the 'curr' node. It's a mathematically minimal way to reverse a sequence in a single pass."
  }
};

// --- Top Level Helper Components ---

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: any, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{num: number, code: string, active: boolean}> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|return|if|else|while|Node|null|reverse|head|next|data|prev|curr|new)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'return', 'if', 'else', 'while', 'new'].includes(part);
            const isObject = ['Node'].includes(part);
            const isPointer = ['prev', 'curr', 'head', 'next'].includes(part);
            return <span key={i} className={part.startsWith('//') ? 'text-slate-500 italic' : isKeyword ? 'text-pink-400 font-bold' : isObject ? 'text-sky-400 font-bold' : isPointer ? 'text-rose-400' : isNaN(parseInt(part)) ? '' : 'text-emerald-400'}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel: React.FC<{label: string, color: string, position: 'top' | 'bottom', offset?: number}> = ({ label, color, position, offset = 0 }) => {
    const colorClasses: Record<string, string> = { emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200', sky: 'bg-sky-100 text-sky-700 border-sky-200', indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200', rose: 'bg-rose-100 text-rose-700 border-rose-200', amber: 'bg-amber-100 text-amber-700 border-amber-200', slate: 'bg-white text-slate-500 border-slate-200' };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';
    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>{String(label)}</span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const ListNodeBlock: React.FC<{val: string | number, address: string, themeColor?: string, isTarget?: boolean}> = ({ val, address, themeColor = 'slate', isTarget }) => {
    const themes: Record<string, any> = { emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' }, rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' }, indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' }, amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' }, slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' } };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-rose-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;
    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>{String(val)}</div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}><span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NEXT</span></div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function TwoPointerIterativereverseLinkedListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5');
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.9);
  const [pan, setPan] = useState({ x: 50, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS.reverseTwoPointer;

  const nodes = useMemo(() => {
    const vals = inputList.split(',').map(s => s.trim()).filter(Boolean);
    return vals.map((v, i) => ({
        id: i,
        val: v,
        addr: '0x' + (100 + (i * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: i < vals.length - 1 ? i + 1 : null,
        x: 60 + (i * 180),
        y: 100
    }));
  }, [inputList]);

  const handleReset = () => { setCurrentStep(0); setPan({ x: 50, y: 100 }); setZoom(0.9); };
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const list = nodes.map(n => ({...n}));
    let headPtr: number | null = 0;
    let prevPtr: number | null = null;
    let currPtr: number | null = null;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ phase: ph, description: ds, line: ln, state: { list: list.map(n=>({...n})), ...st } });

    add("Initialize", "Reversal begins. 'prev' is initialized to null.", 2, { headPtr, prevPtr, currPtr });

    while (headPtr !== null) {
        add("Loop Check", "Checking if the head pointer has reached the end.", 5, { headPtr, prevPtr, currPtr });
        
        currPtr = headPtr;
        add("Mark Current", "Assigning the current node to be processed.", 7, { headPtr, prevPtr, currPtr });
        
        const node = list.find(n => n.id === headPtr);
        headPtr = node?.nextId ?? null;
        add("Advance Head", "Moving 'head' forward BEFORE we break the existing link.", 10, { headPtr, prevPtr, currPtr });
        
        if (currPtr !== null) {
            const currNode = list.find(n => n.id === currPtr);
            if (currNode) currNode.nextId = prevPtr;
        }
        add("Reverse Link", "Pointing the current node's 'next' to the 'prev' sublist.", 13, { headPtr, prevPtr, currPtr });
        
        prevPtr = currPtr;
        add("Step Forward", "Advancing 'prev' to the newly reversed node.", 16, { headPtr, prevPtr, currPtr });
    }

    add("Finished", "Reversal complete. Returning 'prev' as the new head.", 19, { headPtr, prevPtr, currPtr, isSuccess: true });
    return steps;
  }, [nodes]);

  const curStepData = trace[currentStep] || trace[0];
  const st = curStepData.state;
  const isLastStep = currentStep === trace.length - 1;

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e: React.PointerEvent) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };

  const renderSvgArrows = () => {
    return st.list.map((node: any) => {
        if (node.nextId === null) return null;
        const target = st.list.find((n: any) => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const isReversed = target.id < node.id;
        const strokeColor = isReversed ? '#f43f5e' : '#cbd5e1';
        const pathD = isReversed 
            ? `M ${startX},${startY} C ${startX + 30},${startY + 60} ${endX - 30},${endY + 60} ${endX},${endY}`
            : `M ${startX},${startY} C ${startX + 30},${startY} ${endX - 30},${endY} ${endX},${endY}`;
        return <path key={`link-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={isReversed ? 3 : 2} markerEnd={isReversed ? "url(#arrowhead-rev)" : "url(#arrowhead-default)"} className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-rose-600 p-4 rounded-2xl shadow-lg flex items-center justify-center"><Repeat className="text-white" size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">2-Pointer Reverse</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest"><span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Iterative Swap</span><span>•</span><span>Minimal Memory</span></div>
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
                    <div className="flex items-center gap-3 text-rose-600 font-black text-2xl uppercase tracking-tighter"><Repeat size={28}/> 2-Pointer displacement</div>
                    <p className="text-lg leading-relaxed max-w-3xl">Standard reversal uses 3 pointers: <code>prev</code>, <code>curr</code>, and <code>next</code>. This "interesting" method reduces it to 2 by using the <code>head</code> pointer itself to hold the future list reference while <code>prev</code> builds the reversed one.</p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Why 2 Pointers?</h4>
                        <p className="text-sm leading-relaxed">It is the mathematical limit for an iterative reversal. You need one pointer to the reversed head and one to navigate. It demonstrates extreme comfort with pointer manipulation.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><CpuIcon size={16} className="text-indigo-500"/> Memory footprint</h4>
                        <p className="text-sm leading-relaxed">Space is <strong>O(1)</strong>. No stack frames are used, making it safer than recursion for extremely long lists (e.g., millions of nodes).</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in min-h-[600px] space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Braces size={120}/></div>
                    <h3 className="font-black text-rose-400 text-lg uppercase tracking-widest mb-6 flex items-center gap-2"><Layout size={20}/> The 4-Beat Loop</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                        <p><strong>1. Anchor:</strong> We create a temp <code>curr</code> pointer to the head node. We now have two references to the same object.</p>
                        <p><strong>2. Advance:</strong> We move <code>head</code> forward to the next node. Now <code>head</code> is safe on the "future" part of the list.</p>
                        <p><strong>3. Relink:</strong> We change <code>curr.next</code> to point to our <code>prev</code> sublist. The original link is broken.</p>
                        <p><strong>4. Advance Prev:</strong> We move <code>prev</code> to <code>curr</code>, extending the reversed tail.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in min-h-[600px] space-y-12 text-slate-700">
                 <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-emerald-400">FAANG Logic</h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic max-w-2xl font-mono">"Interviewers often ask to optimize 3 pointers down to 2. If you start with 2, you show you've already mastered the 'standard' way and are playing at a higher level."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Atomic Moves:</strong> Ensure you explain that <code>head = head.next</code> happens before <code>curr.next = prev</code> to avoid losing the list.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Base Cases:</strong> Handles empty lists (head == null) and single-node lists naturally.</div></li>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Reverse.java</span>
                    <button onClick={() => { navigator.clipboard.writeText(selectedOp.code); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                    <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 pl-1">List Data</label>
                        <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[460px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur">
                           <Network size={14} className="text-rose-500"/> Whiteboard
                       </span>
                   </div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
                            <div className="bg-[#0f172a] border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={32}/></div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 text-white">REVERSED</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner tracking-tighter">{String(st.list.filter((n:any)=>n.nextId !== undefined).reverse().map((n:any)=>n.val).join(' → '))}</div>
                                <button onClick={handleReset} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"><RotateCcw size={18}/> RESTART VIZ</button>
                            </div>
                        </div>
                   )}

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => setIsDragging(false)} onPointerLeave={() => setIsDragging(false)}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker><marker id="arrowhead-rev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj: any) => {
                              const isHead = st.headPtr === nodeObj.id; const isPrev = st.prevPtr === nodeObj.id; const isCurr = st.currPtr === nodeObj.id;
                              const themeColor = isPrev ? 'emerald' : isCurr ? 'rose' : isHead ? 'amber' : 'slate';
                              const lbls = [];
                              if (isHead) lbls.push({ text: "head", color: "amber", pos: "top" });
                              if (isPrev) lbls.push({ text: "prev", color: "emerald", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "rose", pos: "bottom" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isHead || isPrev || isCurr} themeColor={themeColor}/>
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

      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-4 text-white">
                          <div className="bg-rose-600 p-2 rounded-lg"><Code2 size={20}/></div>
                          <span className="font-black text-sm uppercase tracking-[0.2em]">Source Code</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin">
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
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep} className="px-12 py-6 bg-rose-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(225,29,72,0.3)] hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-rose-500">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div 
                    ref={canvasContainerRef}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={() => setIsDragging(false)} 
                    onPointerLeave={() => setIsDragging(false)}
                  >
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker><marker id="arrowhead-rev-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /></marker></defs>{renderSvgArrows()}</svg>
                           {st.list.map((nodeObj: any) => {
                              const isHead = st.headPtr === nodeObj.id; const isPrev = st.prevPtr === nodeObj.id; const isCurr = st.currPtr === nodeObj.id;
                              const themeColor = isPrev ? 'emerald' : isCurr ? 'rose' : isHead ? 'amber' : 'slate';
                              const lbls = [];
                              if (isHead) lbls.push({ text: "head", color: "amber", pos: "top" });
                              if (isPrev) lbls.push({ text: "prev", color: "emerald", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "rose", pos: "bottom" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isHead||isPrev||isCurr} themeColor={themeColor}/>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">REVERSAL COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Physical memory pointers successfully re-oriented</p>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter">
                                    {String(st.list.filter((n:any)=>n.nextId !== undefined).reverse().map((n:any)=>n.val).join(' → '))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg"><RotateCcw size={24}/> RESTART VIZ</button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700">CLOSE</button>
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
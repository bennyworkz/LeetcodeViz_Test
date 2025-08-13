import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  oddEvenSplit: {
    id: 'oddEvenSplit',
    title: 'In-Place Odd-Even Split',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node oddEvenList(Node head) {
    if (head == null || head.next == null) return head;

    Node odd = head;
    Node even = head.next;
    Node evenHead = even;

    while (even != null && even.next != null) {
        odd.next = even.next;
        odd = odd.next;
        
        even.next = odd.next;
        even = even.next;
    }

    odd.next = evenHead;
    
    return head;
}`,
    desc: "The optimal O(N) time and O(1) space solution. We maintain two separate pointers: `odd` and `even`. As we traverse the list, we route the `odd.next` pointer to skip the even node and point to the next odd node. We do the same for the `even` pointer. This dynamically splits the list into two chains. Finally, we attach the `evenHead` to the end of the `odd` chain."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|oddEvenList|head|odd|even|evenHead|next)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'while', 'for'].includes(part);
            const isObject = ['Node'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'odd', 'even', 'evenHead', 'next'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' && part.trim() !== '-' && part.trim() !== '=' && part.trim() !== '!' && part.trim() !== ';' && part.trim() !== '%' ? '' : 'text-emerald-400'
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
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
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

interface ListNodeData {
  id: number;
  val: string;
  addr: string;
  nextId: number | null;
  x: number;
  y: number;
  originalIndex: number;
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  originalIndex: number;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, originalIndex }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', accent: 'bg-emerald-200' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', accent: 'bg-sky-200' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', accent: 'bg-fuchsia-200' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', accent: 'bg-amber-200' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', accent: 'bg-rose-200' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', accent: 'bg-indigo-200' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', accent: 'bg-slate-200' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    let targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex flex-col items-center w-20 h-16 border-2 rounded-2xl transition-all duration-500 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative overflow-hidden`}>
                <div className={`w-full text-center text-[8px] font-black uppercase tracking-widest py-0.5 border-b border-black/10 ${activeTheme.accent}`}>
                    IDX {originalIndex}
                </div>
                <div className="flex w-full h-full items-center justify-between">
                    <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl border-r border-black/10 ${activeTheme.text}`}>
                        {String(val)}
                    </div>
                    <div className={`w-6 h-full flex flex-col items-center justify-center rounded-br-xl border-slate-200 bg-slate-50/50`}>
                        <span className={`text-[5px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NXT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function OddEvenListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('oddEvenSplit');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6, 7');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 150 }); 
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

  const parseList = (inputStr: string) => {
      const parts = inputStr.split(',').map(s => s.trim()).filter(s => s !== '');
      let nodes: ListNodeData[] = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              x: 60 + (i * 120),
              y: 100,
              originalIndex: i + 1 // 1-based index
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputList, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const applyZigZagLayout = (currentList: ListNodeData[]) => {
      return currentList.map(n => {
          let y = n.originalIndex % 2 !== 0 ? 100 : 240;
          let x = 60 + Math.floor((n.originalIndex - 1) / 2) * 140;
          return { ...n, x, y };
      });
  };

  const applyFinalLayout = (currentList: ListNodeData[], headId: number) => {
      const newLayout = currentList.map(n => ({...n}));
      let curr: number | null = headId;
      let x = 60;
      let failsafe = 0;
      while (curr !== null && failsafe < newLayout.length) {
          let idx = newLayout.findIndex(n => n.id === curr);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 150; // Middle row for final merged state
              x += 120;
              curr = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }
      return newLayout;
  };

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter a valid list.', line: 1, state: { list: [] } }];
    
    let list = baseList.map(node => ({...node}));
    let headId = list[0].id;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(nd=>({...nd})),
            ...st 
        } 
    });

    if (selectedOpId === 'oddEvenSplit') {
        
        add("Function Entry", `public Node oddEvenList(Node head)`, 1, { head: headId, odd: null, even: null, evenHead: null });

        if (list.length <= 2) {
             add("Base Case Check", "if (head == null || head.next == null)", 2, { head: headId, odd: null, even: null, evenHead: null });
             add("Return Early", "List is too small. Returning head.", 2, { head: headId, odd: null, even: null, evenHead: null, isSuccess: true, finalSeq: list.map(n=>n.val).join(' → ') });
             return steps;
        }

        let odd: number | null = headId;
        add("Init Odd Pointer", `Node odd = head;`, 4, { head: headId, odd, even: null, evenHead: null });

        let even: number | null = list.find(n => n.id === headId)?.nextId ?? null;
        add("Init Even Pointer", `Node even = head.next;`, 5, { head: headId, odd, even, evenHead: null });

        let evenHead: number | null = even;
        add("Save Even Head", `Node evenHead = even; (We need this to reconnect the lists later)`, 6, { head: headId, odd, even, evenHead });

        // Visually separate them into rows to show the independent chains
        list = applyZigZagLayout(list);
        add("Physical Split (Visual)", `We are logically building two distinct chains: Odd and Even.`, 6, { head: headId, odd, even, evenHead });
        
        while (true) {
            let evenNode = list.find(n => n.id === even);
            
            add("Loop Condition Check", `while (even != null && even.next != null)`, 8, { head: headId, odd, even, evenHead });
            if (!evenNode || evenNode.nextId === null) {
                add("Loop Exit", `Condition is false. We've reached the end of the list.`, 8, { head: headId, odd, even, evenHead });
                break;
            }

            // Line 9: odd.next = even.next;
            let oddNode = list.find(n => n.id === odd);
            if (oddNode && evenNode) {
                oddNode.nextId = evenNode.nextId;
            }
            add("Bypass Even Node", `odd.next = even.next; \nThe odd chain skips the even node.`, 9, { head: headId, odd, even, evenHead, isRouting: true });

            // Line 10: odd = odd.next;
            odd = oddNode?.nextId ?? null;
            add("Advance Odd", `odd = odd.next; \nMoved the odd pointer forward.`, 10, { head: headId, odd, even, evenHead });

            // Line 12: even.next = odd.next;
            let newOddNode = list.find(n => n.id === odd);
            if (evenNode) {
                evenNode.nextId = newOddNode?.nextId ?? null;
            }
            add("Bypass Odd Node", `even.next = odd.next; \nThe even chain skips the newly acquired odd node.`, 12, { head: headId, odd, even, evenHead, isRouting: true });

            // Line 13: even = even.next;
            even = evenNode?.nextId ?? null;
            add("Advance Even", `even = even.next; \nMoved the even pointer forward.`, 13, { head: headId, odd, even, evenHead });
        }

        // Merge Phase
        let oddTailNode = list.find(n => n.id === odd);
        if (oddTailNode) {
            oddTailNode.nextId = evenHead;
        }
        add("Merge Chains", `odd.next = evenHead; \nAppended the complete Even chain to the end of the Odd chain.`, 16, { head: headId, odd, even, evenHead });

        // Relayout for final sequence
        list = applyFinalLayout(list, headId);

        let finalSeq = [];
        let c: number | null = headId;
        let fs = 0;
        while(c !== null && fs < list.length) {
            let n = list.find(x => x.id === c);
            if (n) { finalSeq.push(n.val); c = n.nextId; } else break;
            fs++;
        }

        add("Return Complete", `return head;`, 18, { isSuccess: true, head: headId, finalSeq: finalSeq.join(' → ') });

    }

    return steps;
  }, [baseList, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows: React.ReactElement[] = [];
    (st.list || []).forEach((node: ListNodeData) => {
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = st.list.find((n: ListNodeData) => n.id === node.nextId);
            if (target) {
                let startX = node.x + 80; 
                let startY = node.y + 32; // middle of 16 h
                let endX = target.x - 6; 
                let endY = target.y + 32;
                
                let strokeColor = node.originalIndex % 2 !== 0 ? '#10b981' : '#38bdf8'; // Emerald for odd chain, Sky for even chain
                let strokeWidth = 2;
                let pathD = '';

                if (target.y !== node.y || target.x < node.x) {
                    // Cross-row link or backward link
                    strokeColor = '#c084fc'; // fuchsia-400
                    strokeWidth = 3;
                    
                    const cp1x = startX + Math.max(30, Math.abs(endX - startX) / 2);
                    const cp2x = endX - Math.max(30, Math.abs(endX - startX) / 2);
                    
                    if (target.x < node.x) {
                        pathD = `M ${startX},${startY} C ${startX + 60},${startY + 60} ${endX - 60},${endY - 60} ${endX},${endY}`;
                    } else {
                        pathD = `M ${startX},${startY} C ${cp1x},${startY} ${cp2x},${endY} ${endX},${endY}`;
                    }
                } else if (target.x > node.x + 140) {
                    // Bypassing a node in the same row visually
                    pathD = `M ${startX},${startY} C ${startX + 30},${startY + 40} ${endX - 30},${endY + 40} ${endX},${endY}`;
                } else {
                    // Normal adjacent
                    pathD = `M ${startX},${startY} L ${endX},${endY}`;
                }

                arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#arrowhead-${node.originalIndex % 2 !== 0 ? 'odd' : 'even'})`} className="transition-all duration-500" opacity={0.8}/>);
            }
        }
    });
    return arrows;
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <ListTree className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Odd Even Linked List</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      In-Place Split
                  </span>
                  <span>•</span>
                  <span>LeetCode 328</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><ListTree size={28}/> Parity Grouping</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given the <code>head</code> of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list. Note that the relative order inside both the even and odd groups should remain as it was in the input.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: head = [1,2,3,4,5]</span>
                       <span className="text-emerald-300">1</span> → <span className="text-sky-300">2</span> → <span className="text-emerald-300">3</span> → <span className="text-sky-300">4</span> → <span className="text-emerald-300">5</span><br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">1 → 3 → 5</span> → <span className="text-sky-300">2 → 4</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">You must solve the problem in <strong>$O(1)$ extra space</strong> complexity and <strong>$O(N)$ time</strong> complexity. You cannot create new nodes or arrays to store the separated lists.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Maintain two active pointers: one leaping along the odd nodes, and one leaping along the even nodes. This effectively weaves the single list into two independent chains. Once the end is reached, link the tail of the odd chain to the head of the even chain.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> OddEven.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">List Data</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end pt-2 border-t border-slate-100">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> REORDERED</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">List separated by index parity.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isRouting ? 'text-fuchsia-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Multi-Row Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-odd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" /></marker>
                                  <marker id="arrowhead-even" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* Row Markers */}
                           {!st.isSuccess && st.evenHead !== null && st.line > 2 && (
                               <>
                                   <div className="absolute -left-12 top-[100px] -translate-y-1/2 text-[10px] font-black opacity-30 tracking-widest rotate-270 text-emerald-800">ODD</div>
                                   <div className="absolute -left-12 top-[240px] -translate-y-1/2 text-[10px] font-black opacity-30 tracking-widest rotate-270 text-sky-800">EVEN</div>
                               </>
                           )}
                           {st.isSuccess && (
                               <div className="absolute -left-12 top-[150px] -translate-y-1/2 text-[10px] font-black opacity-30 tracking-widest rotate-270 text-indigo-800">MERGED</div>
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isOdd = st.odd === nodeObj.id; 
                              const isEven = st.even === nodeObj.id;
                              const isEvenHead = st.evenHead === nodeObj.id;
                              
                              let themeColor = nodeObj.originalIndex % 2 !== 0 ? 'emerald' : 'sky';
                              if (isOdd) themeColor = 'amber';
                              if (isEven) themeColor = 'rose';
                              
                              const isTarget = isOdd || isEven || isEvenHead;

                              const lbls = [];
                              if (isOdd) lbls.push({ text: "odd", color: "amber", pos: "top" });
                              if (isEven) lbls.push({ text: "even", color: "rose", pos: "bottom" });
                              if (isEvenHead) lbls.push({ text: "evenHead", color: "fuchsia", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} originalIndex={nodeObj.originalIndex}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The Dual Weave</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. Initialization:</strong> We need to build two independent chains simultaneously. We point <code>odd</code> to the head (index 1) and <code>even</code> to head.next (index 2). Crucially, we save <code>evenHead = even</code> so we don't lose the start of the even chain.</p>
                        <p><strong>2. Bypassing Nodes:</strong> While iterating, we make <code>odd.next</code> skip the even node and point directly to <code>even.next</code> (the next odd node). Then we advance <code>odd</code>. We immediately do the exact same symmetrical operation for <code>even</code>, skipping the new odd node to find the next even node.</p>
                        <p><strong>3. The Final Merge:</strong> Because the two chains are built entirely by rewiring existing <code>next</code> pointers, no new memory is allocated. When we reach the end, the <code>odd</code> pointer is sitting at the very last odd node. We simply attach <code>odd.next = evenHead</code> to perfectly sequence them.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering List Parity</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This problem is essentially a test of your ability to juggle multiple pointers without dropping the linked list 'chain'. It's very easy to accidentally create a cycle or lose a reference if you do operations out of order."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Loop Condition:</strong> <code>while (even != null && even.next != null)</code>. Since <code>even</code> is always ahead of <code>odd</code>, if <code>even</code> is valid and its <code>next</code> is valid, it implies <code>odd</code> is definitely safe to operate on. This is much cleaner than checking both.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Preserve evenHead:</strong> If you forget to save <code>evenHead = even</code> at the very beginning, you will have no way to attach the two lists together at the end, as <code>even</code> will have traversed to the end of the list.</div></li>
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
                          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isRouting ? 'text-fuchsia-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
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
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-odd-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" /></marker>
                                  <marker id="arrowhead-even-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Row Markers FS */}
                           {!st.isSuccess && st.evenHead !== null && st.line > 2 && (
                               <>
                                   <div className="absolute -left-12 top-[100px] -translate-y-1/2 text-[14px] font-black opacity-30 tracking-widest rotate-270 text-emerald-800">ODD</div>
                                   <div className="absolute -left-12 top-[240px] -translate-y-1/2 text-[14px] font-black opacity-30 tracking-widest rotate-270 text-sky-800">EVEN</div>
                               </>
                           )}
                           {st.isSuccess && (
                               <div className="absolute -left-12 top-[150px] -translate-y-1/2 text-[14px] font-black opacity-30 tracking-widest rotate-270 text-indigo-800">MERGED</div>
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isOdd = st.odd === nodeObj.id; 
                              const isEven = st.even === nodeObj.id;
                              const isEvenHead = st.evenHead === nodeObj.id;
                              
                              let themeColor = nodeObj.originalIndex % 2 !== 0 ? 'emerald' : 'sky';
                              if (isOdd) themeColor = 'amber';
                              if (isEven) themeColor = 'rose';
                              
                              const isTarget = isOdd || isEven || isEvenHead;

                              const lbls = [];
                              if (isOdd) lbls.push({ text: "odd", color: "amber", pos: "top" });
                              if (isEven) lbls.push({ text: "even", color: "rose", pos: "bottom" });
                              if (isEvenHead) lbls.push({ text: "evenHead", color: "fuchsia", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} originalIndex={nodeObj.originalIndex}/>
                                  </div>
                              )
                           })}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">REORDER COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Odd and Even indices grouped in O(1) space</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center max-h-48 overflow-y-auto">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Sequence</div>
                                    <div className="font-mono text-white text-2xl font-black leading-relaxed">{st.finalSeq}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
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
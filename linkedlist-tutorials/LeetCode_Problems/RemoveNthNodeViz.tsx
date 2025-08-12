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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  onePass: {
    id: 'onePass',
    title: 'One-Pass (Two Pointers)',
    icon: <ScissorsLineDashed size={16} />,
    complexity: 'Time: O(L) | Space: O(1)',
    code: `public Node removeNthFromEnd(Node head, int n) {
    Node dummy = new Node(0);
    dummy.next = head;
    
    Node slow = dummy;
    Node fast = dummy;

    // 1. Advance 'fast' pointer n + 1 steps ahead of 'slow'
    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // 2. Move both until 'fast' reaches the end
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }

    // 3. 'slow' is now just before the target node
    slow.next = slow.next.next;

    return dummy.next;
}`,
    desc: "The optimal one-pass solution uses a classic Two-Pointer sliding window. By moving a 'fast' pointer 'n + 1' steps ahead of a 'slow' pointer, we create a fixed gap. When we move both pointers at the same speed until 'fast' falls off the end, 'slow' will perfectly land on the node immediately preceding the target node."
  },
  twoPass: {
    id: 'twoPass',
    title: 'Two-Pass (Count Length)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(L) | Space: O(1)',
    code: `public Node removeNthFromEnd(Node head, int n) {
    Node dummy = new Node(0);
    dummy.next = head;
    
    // 1. First Pass: Count the total length
    int length = 0;
    Node curr = head;
    while (curr != null) {
        length++;
        curr = curr.next;
    }
    
    // 2. Calculate target index from the front
    length -= n;
    
    // 3. Second Pass: Traverse to the node before target
    curr = dummy;
    while (length > 0) {
        length--;
        curr = curr.next;
    }
    
    // 4. Remove the target node
    curr.next = curr.next.next;
    
    return dummy.next;
}`,
    desc: "The intuitive naive approach. Since we don't know where the end of the list is, we traverse it completely once to find its total length 'L'. We then know the target node is at index 'L - n' from the beginning. We do a second traversal to reach the node just before it, and bypass the target to remove it."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|removeNthFromEnd|head|dummy|slow|fast|curr|next|length|new|n)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Node'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'dummy', 'slow', 'fast', 'curr', 'next'].includes(part);
            const isVar = ['length', 'n', 'i'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isVar ? 'text-amber-400' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' && part.trim() !== '-' && part.trim() !== '=' && part.trim() !== ';' ? '' : 'text-emerald-400'
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
  isDummy?: boolean;
  isDeleted?: boolean;
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isDummy?: boolean;
  isDeleted?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isDummy, isDeleted }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const activeTheme = isDeleted ? { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-400' } : (themes[themeColor] || themes['slate']);
    let targetClasses = isTarget && !isDeleted ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;
    
    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500 ${isDeleted ? 'opacity-40 grayscale' : ''}`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{isDummy ? 'Sentinel' : String(address)}</span>
            <div className={`flex items-center w-20 h-14 border-2 rounded-2xl transition-all duration-500 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy && !isDeleted ? '' : activeTheme.border} ${targetClasses} relative overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl border-r border-black/10 ${isDummy ? 'text-slate-500' : activeTheme.text}`}>
                    {isDummy ? 'D' : String(val)}
                </div>
                <div className={`w-6 h-full flex flex-col items-center justify-center rounded-r-xl border-slate-200 ${isDummy && !isDeleted ? 'bg-slate-700 border-slate-600' : isDeleted ? 'bg-slate-50' : 'bg-slate-50/50'}`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90 ${isDummy && !isDeleted ? 'text-slate-400' : ''}`}>NXT</span>
                </div>
            </div>
            {isDeleted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 pt-4">
                    <X size={48} className="text-slate-400/50 absolute" strokeWidth={3}/>
                </div>
            )}
        </div>
    );
};

// --- Main Application ---

export default function RemoveNthNodeViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('onePass');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5');
  const [inputN, setInputN] = useState('2');
  
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
              x: 180 + (i * 120),
              y: 100
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputList, inputN, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const recalculateLayout = (list: ListNodeData[], dummyId: number) => {
      const newLayout = list.map(n => ({...n}));
      let current: number | null = dummyId;
      let x = 60;
      let failsafe = 0;
      while (current !== null && failsafe < list.length + 2) {
          let idx = newLayout.findIndex(n => n.id === current);
          if (idx !== -1) {
              newLayout[idx].x = x;
              // Keep deleted nodes down visually
              if (!newLayout[idx].isDeleted) {
                  newLayout[idx].y = 100;
              }
              x += 120;
              current = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }
      return newLayout;
  };

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter a valid list.', line: 1, state: { list: [] } }];
    
    let n = parseInt(inputN) || 1;
    if (n < 1) n = 1;
    // Bound n to list length for visualization safety
    if (n > baseList.length) n = baseList.length;

    let list = baseList.map(node => ({...node}));
    let headId = list[0].id;

    // Add Dummy Node
    let dummyId = -1;
    let dummy: ListNodeData = { id: dummyId, val: 'D', addr: 'DUMMY', nextId: headId, x: 60, y: 100, isDummy: true };
    list.unshift(dummy);
    
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(nd=>({...nd})),
            ...st 
        } 
    });

    if (selectedOpId === 'onePass') {
        let slow = dummyId;
        let fast: number | null = dummyId;

        add("Initialize", `Set up dummy node. Both slow and fast pointers start at dummy.`, 5, { slow, fast });

        // Advance fast n+1 times
        for (let i = 0; i <= n; i++) {
            add("Create Gap", `Moving 'fast' pointer forward. Goal: Create a gap of size ${n+1}. i = ${i}`, 8, { slow, fast, gapLoop: i });
            
            let fastNode = list.find(nd => nd.id === fast);
            if (fastNode && fastNode.nextId !== null) {
                fast = fastNode.nextId;
                add("Create Gap", `fast = fast.next;`, 9, { slow, fast, gapLoop: i });
            } else {
                fast = null;
                add("Create Gap", `fast = fast.next; (fast is now null)`, 9, { slow, fast, gapLoop: i });
                break;
            }
        }

        add("Gap Established", `Fast pointer is exactly ${n+1} steps ahead of slow. Now, we advance both simultaneously until fast hits null.`, 11, { slow, fast, gapEstablished: true });

        while (fast !== null) {
            let slowNode = list.find(nd => nd.id === slow);
            let fastNode = list.find(nd => nd.id === fast);
            
            add("Sliding Window", `fast is not null. Advancing both pointers to maintain the gap.`, 12, { slow, fast, isSliding: true });
            
            slow = slowNode?.nextId ?? dummyId;
            fast = fastNode?.nextId ?? null;
            
            add("Sliding Window", `slow = slow.next; fast = fast.next;`, 14, { slow, fast, isSliding: true });
        }

        let slowNode = list.find(nd => nd.id === slow);
        let targetId = slowNode?.nextId;
        
        add("Target Identified", `fast has reached null! Because of our gap, 'slow' is perfectly positioned on the node right BEFORE our target (the ${n}-th from end).`, 17, { slow, fast, target: targetId });

        if (targetId !== null && targetId !== undefined) {
            let targetNode = list.find(nd => nd.id === targetId);
            if (targetNode && slowNode) {
                slowNode.nextId = targetNode.nextId; // bypass
                targetNode.isDeleted = true;
                targetNode.y = 220; // visually drop it
            }
            
            list = recalculateLayout(list, dummyId);
            add("Delete Node", `slow.next = slow.next.next; The target node has been bypassed and effectively removed from the list.`, 18, { slow, fast, isSuccess: true });
        }

        let finalSeq = [];
        let start = list.find(nd => nd.id === dummyId)?.nextId;
        while(start !== null && start !== undefined) {
            let nd = list.find(x => x.id === start);
            if (nd) {
                finalSeq.push(nd.val);
                start = nd.nextId;
            } else break;
        }

        add("Complete", `Return dummy.next.`, 20, { slow, fast, isSuccess: true, finalSeq: finalSeq.join(' → ') });

    } else if (selectedOpId === 'twoPass') {
        let length = 0;
        let curr: number | null = headId;
        
        add("Initialize", `Setup dummy node. Start First Pass to count total length.`, 6, { curr, length });

        while (curr !== null) {
            let currNode = list.find(nd => nd.id === curr);
            length++;
            add("Counting", `length++; length is now ${length}.`, 8, { curr, length });
            curr = currNode?.nextId ?? null;
            add("Counting", `curr = curr.next;`, 9, { curr, length });
        }

        add("First Pass Complete", `Total length calculated: ${length}.`, 11, { curr, length });
        
        let originalLength = length;
        length -= n;
        
        add("Calculate Target", `length -= n; Target index from the front is ${originalLength} - ${n} = ${length}.`, 13, { curr, length, originalLength });

        curr = dummyId;
        add("Second Pass Init", `Reset curr to dummy node. Will advance it ${length} times.`, 16, { curr, length });

        while (length > 0) {
            add("Traversing", `length > 0. Advancing curr.`, 17, { curr, length, isTraversing: true });
            length--;
            let currNode = list.find(nd => nd.id === curr);
            curr = currNode?.nextId ?? dummyId;
            add("Traversing", `length--; curr = curr.next;`, 19, { curr, length, isTraversing: true });
        }

        let currNode = list.find(nd => nd.id === curr);
        let targetId = currNode?.nextId;

        add("Target Identified", `Reached target index. curr is positioned right before the node to delete.`, 21, { curr, length, target: targetId });

        if (targetId !== null && targetId !== undefined) {
            let targetNode = list.find(nd => nd.id === targetId);
            if (targetNode && currNode) {
                currNode.nextId = targetNode.nextId; // bypass
                targetNode.isDeleted = true;
                targetNode.y = 220; // visually drop it
            }
            
            list = recalculateLayout(list, dummyId);
            add("Delete Node", `curr.next = curr.next.next; The target node is removed.`, 23, { curr, length, isSuccess: true });
        }

        let finalSeq = [];
        let start = list.find(nd => nd.id === dummyId)?.nextId;
        while(start !== null && start !== undefined) {
            let nd = list.find(x => x.id === start);
            if (nd) {
                finalSeq.push(nd.val);
                start = nd.nextId;
            } else break;
        }

        add("Complete", `Return dummy.next.`, 25, { curr, isSuccess: true, finalSeq: finalSeq.join(' → ') });
    }

    return steps;
  }, [baseList, inputN, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows: React.ReactElement[] = [];
    (st.list || []).forEach((node: ListNodeData) => {
        if (node.nextId !== null && node.nextId !== undefined && !node.isDeleted) {
            const target = st.list.find((n: ListNodeData) => n.id === node.nextId);
            if (target && !target.isDeleted) {
                let startX = node.x + 80; 
                let startY = node.y + 28;
                let endX = target.x - 6; 
                let endY = target.y + 28;
                
                let strokeColor = '#cbd5e1'; // slate-300
                let strokeWidth = 2;
                let pathD = '';

                if (target.x > node.x + 140) {
                    // Forward Jump (Bypassing the deleted node)
                    strokeColor = '#10b981'; // emerald-500
                    strokeWidth = 3;
                    pathD = `M ${startX},${startY} C ${startX + 30},${startY + 60} ${endX - 30},${endY + 60} ${endX},${endY}`;
                } else {
                    // Normal adjacent
                    pathD = `M ${startX},${startY} L ${endX},${endY}`;
                }

                arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#arrowhead-${strokeColor.replace('#','')})`} className="transition-all duration-500" />);
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
                <ScissorsLineDashed className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Remove Nth Node</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      From End
                  </span>
                  <span>•</span>
                  <span>Two-Pointer Gap Strategy</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><ScissorsLineDashed size={28}/> Target the Tail Offset</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given the head of a linked list, remove the n-th node from the end of the list and return its head.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: head = [1,2,3,4,5], n = 2</span>
                       1 → 2 → 3 → <span className="text-rose-400 line-through">4</span> → 5<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">1 → 2 → 3 → 5</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed">In a singly linked list, you cannot traverse backward from the tail. To find the N-th node from the end usually requires a full pass just to find out how long the list is.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> One-Pass Goal</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Can you do this in exactly one pass? Yes! By using two pointers separated by a gap of exactly $n$ nodes, we can find the target dynamically as we reach the end.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> RemoveNth.java</span>
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
                        <div className="flex-[1] w-full flex gap-2">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">Target (n)</label>
                                <input type="number" min="1" value={inputN} onChange={(e) => setInputN(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
                            </div>
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
                           {st.length !== undefined && <span className="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">length = {st.length}</span>}
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">Target node successfully removed.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Sequence Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Visual Gap Highlight for One-Pass */}
                           {selectedOpId === 'onePass' && st.slow !== null && st.fast !== null && st.slow !== st.fast && st.list.find((n:any)=>n.id===st.slow) && st.list.find((n:any)=>n.id===st.fast) && (
                               <div className="absolute top-[80px] h-1 border-t-2 border-dashed border-sky-400 opacity-50 z-0 pointer-events-none transition-all duration-500" 
                                    style={{ 
                                        left: (st.list.find((n:any)=>n.id===st.slow)?.x || 0) + 40, 
                                        width: (st.list.find((n:any)=>n.id===st.fast)?.x || 0) - (st.list.find((n:any)=>n.id===st.slow)?.x || 0) 
                                    }}>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-sky-500 uppercase tracking-widest bg-white/80 px-2 rounded-md border border-sky-100">Gap of {inputN}</div>
                               </div>
                           )}

                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-10b981" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isTargetNode = st.target === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isSlow) themeColor = 'amber';
                              if (isFast) themeColor = 'sky';
                              if (isCurr) themeColor = 'indigo';
                              if (isTargetNode && !nodeObj.isDeleted) themeColor = 'rose';
                              
                              const isTarget = isSlow || isFast || isCurr || isTargetNode;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "amber", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "sky", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isTargetNode && !nodeObj.isDeleted) lbls.push({ text: "target", color: "rose", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isDummy={nodeObj.isDummy} isDeleted={nodeObj.isDeleted}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The Trailing Pointer</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p>How do we find an element from the back when we can only move forward?</p>
                        <p><strong>1. The Dummy Node:</strong> Deleting the head node is a common edge case. By attaching a dummy node to the front, we ensure our pointers always have a node <em>before</em> the target to perform the deletion (<code>slow.next = slow.next.next</code>).</p>
                        <p><strong>2. The Gap:</strong> We start <code>fast</code> and <code>slow</code> at the dummy node. We advance <code>fast</code> by exactly $n + 1$ steps. This creates a fixed-width window between the two pointers.</p>
                        <p><strong>3. The Sliding Window:</strong> We advance both pointers at the same speed. Because the gap is rigidly $n + 1$ nodes, when <code>fast</code> hits the very end (<code>null</code>), <code>slow</code> is guaranteed to be $n + 1$ nodes away from the end—meaning it's positioned perfectly <strong>one node before</strong> our target!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering the Fast/Slow Approach</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a classic 'Aha!' interview question. The two-pass solution is perfectly fine, but the interviewer will almost always say: 'Can you do it in one pass?'. Remembering the fixed-gap Two Pointer trick is essential for top-tier companies."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Dummy Node is Mandatory:</strong> If $N$ is equal to the length of the list, you have to delete the head node. Without a dummy node, <code>fast</code> will reach <code>null</code> during the initial gap creation, and you'll have messy branching logic to handle it.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Off-By-One Errors:</strong> Be incredibly careful with your loop condition when establishing the gap. You need a gap of $N+1$ so `slow` lands <em>before</em> the target, not <em>on</em> the target.</div></li>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
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
                           
                           {/* Visual Gap Highlight for One-Pass FS */}
                           {selectedOpId === 'onePass' && st.slow !== null && st.fast !== null && st.slow !== st.fast && st.list.find((n:any)=>n.id===st.slow) && st.list.find((n:any)=>n.id===st.fast) && (
                               <div className="absolute top-[80px] h-1 border-t-2 border-dashed border-sky-400 opacity-50 z-0 pointer-events-none transition-all duration-500" 
                                    style={{ 
                                        left: (st.list.find((n:any)=>n.id===st.slow)?.x || 0) + 40, 
                                        width: (st.list.find((n:any)=>n.id===st.fast)?.x || 0) - (st.list.find((n:any)=>n.id===st.slow)?.x || 0) 
                                    }}>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-sky-500 uppercase tracking-widest bg-white/80 px-2 rounded-md border border-sky-100">Gap of {inputN}</div>
                               </div>
                           )}

                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-10b981-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isTargetNode = st.target === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isSlow) themeColor = 'amber';
                              if (isFast) themeColor = 'sky';
                              if (isCurr) themeColor = 'indigo';
                              if (isTargetNode && !nodeObj.isDeleted) themeColor = 'rose';
                              
                              const isTarget = isSlow || isFast || isCurr || isTargetNode;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "amber", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "sky", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isTargetNode && !nodeObj.isDeleted) lbls.push({ text: "target", color: "rose", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isDummy={nodeObj.isDummy} isDeleted={nodeObj.isDeleted}/>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">REMOVAL COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Target bypassed and garbage collected</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center max-h-48 overflow-y-auto">
                                    <div className="font-mono text-white text-2xl font-black leading-relaxed">{st.finalSeq}</div>
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
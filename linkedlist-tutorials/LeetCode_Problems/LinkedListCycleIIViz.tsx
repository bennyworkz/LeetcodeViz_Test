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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  floydsAlgorithm: {
    id: 'floydsAlgorithm',
    title: 'Floyd\'s Tortoise & Hare',
    icon: <Repeat1 size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node detectCycle(Node head) {
    if (head == null || head.next == null) return null;

    Node slow = head;
    Node fast = head;

    // Phase 1: Detect if a cycle exists
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        // Intersection point found!
        if (slow == fast) {
            
            // Phase 2: Find the cycle entrance
            slow = head;
            while (slow != fast) {
                slow = slow.next;
                fast = fast.next;
            }
            
            // Both pointers meet at the entrance
            return slow;
        }
    }

    return null; // No cycle
}`,
    desc: "The legendary Floyd's Cycle Detection algorithm. It runs in two phases. First, a 'fast' pointer moves twice as fast as a 'slow' pointer to detect if they ever collide (proving a cycle exists). If they do, we reset the 'slow' pointer to the head of the list. By moving both pointers one step at a time, they are mathematically guaranteed to meet exactly at the entrance of the cycle."
  },
  hashSetApproach: {
    id: 'hashSetApproach',
    title: 'Hash Set Approach',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node detectCycleHash(Node head) {
    HashSet<Node> visited = new HashSet<>();
    Node curr = head;

    while (curr != null) {
        // If we've seen this exact node before, it's the cycle entry!
        if (visited.contains(curr)) {
            return curr;
        }
        
        // Otherwise, add it to our tracking set
        visited.add(curr);
        curr = curr.next;
    }

    return null; // Hit the end of the list, no cycle
}`,
    desc: "The straightforward, naive approach. We use a Hash Set to memorize the exact memory addresses of every node we visit. If we ever arrive at a node that is already in our Hash Set, it means we have looped back around, and that exact node is the entrance to the cycle."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|detectCycle|detectCycleHash|head|slow|fast|curr|next|visited|HashSet|new|contains|add)\b|\b\d+\b)/g).filter(Boolean);
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
            const isObject = ['Node', 'HashSet'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'slow', 'fast', 'curr', 'next'].includes(part);
            const isVar = ['visited'].includes(part);
            const isMethod = ['contains', 'add'].includes(part);
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
                  isMethod ? 'text-fuchsia-300' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' && part.trim() !== '-' && part.trim() !== '=' && part.trim() !== '!' && part.trim() !== ';' ? '' : 'text-emerald-400'
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
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isEntrance?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isEntrance }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    let targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;
    
    if (isEntrance && isTarget) {
         targetClasses += ' animate-pulse shadow-fuchsia-300 ring-fuchsia-400';
    }

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex items-center w-20 h-14 border-2 rounded-2xl transition-all duration-500 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl border-r border-black/10 ${activeTheme.text}`}>
                    {String(val)}
                </div>
                <div className={`w-6 h-full flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50/50`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NXT</span>
                </div>
            </div>
            {isEntrance && (
                <div className="absolute -top-3 -right-3 bg-fuchsia-500 text-white rounded-full p-1 shadow-lg z-40" title="Cycle Entrance">
                    <MapPin size={14}/>
                </div>
            )}
        </div>
    );
};

// --- Main Application ---

export default function LinkedListCycleIIViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('floydsAlgorithm');
  
  const [inputList, setInputList] = useState('3, 2, 0, -4');
  const [inputPos, setInputPos] = useState('1'); // Index where the cycle loops back. -1 for no cycle.
  
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

  const parseList = (inputStr: string, posStr: string) => {
      const parts = inputStr.split(',').map(s => s.trim()).filter(s => s !== '');
      let pos = parseInt(posStr);
      if (isNaN(pos) || pos >= parts.length) pos = -1;

      let nodes: ListNodeData[] = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : (pos !== -1 ? pos : null),
              x: 60 + (i * 120),
              y: 100
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList, inputPos));
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputList, inputPos, selectedOpId]);

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

    if (selectedOpId === 'floydsAlgorithm') {
        let slow: number | null = headId;
        let fast: number | null = headId;
        let isPhase2 = false;

        add("Initialize", `Node slow = head; Node fast = head;`, 4, { slow, fast });

        // Phase 1: Detection
        let hasCycle = false;
        while (fast !== null) {
            let fastNode = list.find(n => n.id === fast);
            if (!fastNode || fastNode.nextId === null) {
                add("No Cycle", `fast or fast.next reached null. The list is linear.`, 7, { slow, fast });
                break;
            }

            add("Phase 1: Advance", `Moving slow by 1, fast by 2.`, 8, { slow, fast });

            let slowNode = list.find(n => n.id === slow);
            slow = slowNode?.nextId ?? null;
            fast = list.find(n => n.id === fastNode!.nextId)?.nextId ?? null;

            add("Phase 1: Collision Check", `Did slow and fast intersect?`, 11, { slow, fast });

            if (slow !== null && slow === fast) {
                hasCycle = true;
                add("Intersection Found!", `slow == fast. A cycle exists! Switching to Phase 2.`, 11, { slow, fast, isIntersection: true });
                break;
            }
        }

        if (hasCycle) {
            // Phase 2: Entrance Finding
            slow = headId;
            isPhase2 = true;
            add("Phase 2: Reset", `slow = head; Resetting the slow pointer to the start.`, 14, { slow, fast, isPhase2 });

            add("Phase 2: Convergence Check", `Checking if slow == fast.`, 15, { slow, fast, isPhase2 });
            while (slow !== fast) {
                add("Phase 2: Advance", `Moving both slow and fast by 1 step.`, 16, { slow, fast, isPhase2 });
                
                let slowNode = list.find(n => n.id === slow);
                let fastNode = list.find(n => n.id === fast);
                
                slow = slowNode?.nextId ?? null;
                fast = fastNode?.nextId ?? null;

                add("Phase 2: Convergence Check", `Did slow and fast intersect?`, 15, { slow, fast, isPhase2 });
            }

            let entranceNode = list.find(n => n.id === slow);
            add("Entrance Found", `Both pointers met at Node(${entranceNode?.val}). This is mathematically proven to be the cycle entrance.`, 21, { slow, fast, isPhase2, isSuccess: true, result: slow });
        } else {
            add("Complete", `Return null; No cycle found in the list.`, 25, { slow, fast, isSuccess: true, result: null });
        }

    } else if (selectedOpId === 'hashSetApproach') {
        let visitedIds: number[] = [];
        let curr: number | null = headId;

        add("Initialize", `Created an empty Hash Set to track visited memory addresses.`, 2, { curr, visited: [...visitedIds] });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            
            add("Check HashSet", `Checking if Node(${currNode?.val}) is already in the HashSet.`, 6, { curr, visited: [...visitedIds] });

            if (visitedIds.includes(curr)) {
                add("Cycle Found!", `HashSet.contains(curr) is true. We've returned to a previously visited node!`, 7, { curr, visited: [...visitedIds], isSuccess: true, result: curr });
                return steps;
            }

            visitedIds.push(curr);
            add("Add to HashSet", `Added Node(${currNode?.val}) to HashSet.`, 11, { curr, visited: [...visitedIds], added: curr });

            curr = currNode?.nextId ?? null;
            add("Advance", `curr = curr.next;`, 12, { curr, visited: [...visitedIds] });
        }

        add("Complete", `Reached null. The list is linear.`, 15, { curr, visited: [...visitedIds], isSuccess: true, result: null });
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
                let startY = node.y + 28;
                let endX = target.x - 6; 
                let endY = target.y + 28;
                
                let strokeColor = '#cbd5e1'; // slate-300
                let strokeWidth = 2;
                let pathD = '';

                if (target.x <= node.x) {
                    // Backward Arrow (The Cycle!)
                    strokeColor = '#f43f5e'; // rose-500
                    strokeWidth = 3;
                    // Draw a large loop underneath the list
                    pathD = `M ${node.x + 40},${node.y + 56} C ${node.x + 40},${node.y + 120} ${target.x + 40},${target.y + 120} ${target.x + 40},${target.y + 56}`;
                    arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#arrowhead-cycle)`} className="transition-all duration-500" strokeDasharray="4,4" />);
                } else {
                    // Normal adjacent
                    pathD = `M ${startX},${startY} L ${endX},${endY}`;
                    arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#arrowhead-default)`} className="transition-all duration-500" />);
                }
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
                <Repeat1 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Linked List Cycle II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Cycle Entrance
                  </span>
                  <span>•</span>
                  <span>Floyd's Algorithm</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Repeat1 size={28}/> Finding the Loop Entry</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return <code>null</code>. You must not modify the linked list.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: head = [3,2,0,-4], pos = 1</span>
                       3 → <span className="text-fuchsia-400 font-bold">2</span> → 0 → -4 ↺ (loops back to 2)<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">Returns Node with value 2</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed">It is easy to find out <em>if</em> a cycle exists using a Fast and Slow pointer. The tricky part is figuring out mathematically exactly <em>where</em> the cycle begins using strictly $O(1)$ auxiliary space.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> O(1) Space Magic</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Floyd's algorithm proves that the distance from the head to the cycle entry is mathematically proportional to the distance from the intersection point to the cycle entry.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> DetectCycle.java</span>
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
                                <label className="text-[10px] font-black uppercase tracking-widest font-mono text-rose-600 pl-1">Cycle Index (pos)</label>
                                <input type="number" min="-1" value={inputPos} onChange={(e) => setInputPos(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner" title="-1 means no cycle" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end pt-2 border-t border-slate-100">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess && st.result !== null ? 'bg-fuchsia-900 border-fuchsia-800' : st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <div className="flex items-center gap-2">
                           {st.isPhase2 !== undefined && <span className="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Phase 2</span>}
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            {st.result !== null ? (
                                <>
                                    <div className="text-2xl font-black tracking-tight uppercase font-mono text-fuchsia-400 flex items-center gap-3"><PartyPopper size={24}/> CYCLE ENTRANCE FOUND</div>
                                    <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">The entrance node is Node({st.list.find((n:any)=>n.id===st.result)?.val}).</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><CheckCircle2 size={24}/> LINEAR LIST</div>
                                    <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">No cycle was detected.</p>
                                </>
                            )}
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Cyclical Graph</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {selectedOpId === 'hashSetApproach' && st.visited && (
                       <div className="absolute left-10 bottom-10 z-30 pointer-events-none flex flex-col gap-2">
                           <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest font-mono bg-amber-50 px-3 py-1 rounded shadow-sm border border-amber-200 w-max">HashSet Memory O(N)</span>
                           <div className="flex gap-2 bg-white/80 backdrop-blur p-2 rounded-xl border border-slate-200 shadow-xl max-w-sm overflow-x-auto">
                               {st.visited.length === 0 ? <span className="text-xs text-slate-400 italic px-2">Empty...</span> : null}
                               {st.visited.map((vid: number) => (
                                   <div key={vid} className={`flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-xs ${st.added === vid ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                                       {st.list.find((n:any)=>n.id===vid)?.val}
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-cycle" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isSuccessResult = st.isSuccess && st.result === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isCurr) themeColor = 'amber';
                              if (isSlow) themeColor = 'indigo';
                              if (isFast) themeColor = 'sky';
                              if (isSuccessResult) themeColor = 'fuchsia';
                              
                              const isTarget = isSlow || isFast || isCurr || isSuccessResult;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "indigo", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "sky", pos: "bottom" });
                              if (isCurr) lbls.push({ text: "curr", color: "amber", pos: "top" });
                              
                              if (st.isIntersection && isSlow) lbls.push({ text: "INTERSECT", color: "rose", pos: "bottom" });
                              if (isSuccessResult) lbls.push({ text: "ENTRANCE", color: "fuchsia", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isEntrance={isSuccessResult}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The Math Behind Phase 2</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p>Let $D$ be the distance from the head to the cycle entrance.<br/>Let $P$ be the distance from the entrance to the intersection point.<br/>Let $C$ be the total length of the cycle.</p>
                        <p><strong>1. Distance Traveled:</strong><br/>Slow pointer traveled: $D + P$<br/>Fast pointer traveled: $D + P + kC$ (where $k$ is the number of full laps fast did).</p>
                        <p><strong>2. The Equation:</strong><br/>Since Fast moves twice as fast as Slow:<br/>$2(D + P) = D + P + kC$<br/>$D + P = kC$<br/>$D = kC - P$</p>
                        <p><strong>3. The Conclusion:</strong><br/>$D$ (distance from Head to Entrance) is mathematically equal to $kC - P$ (distance from Intersection to Entrance). Therefore, if we put one pointer at the Head, and leave one pointer at the Intersection, and move them both at the same speed of 1 node per step, they will meet exactly at the Entrance!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Cycle Detection</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a quintessential computer science problem. You should be able to write the fast/slow loop with your eyes closed. However, to truly pass the interview, you must be able to confidently explain the mathematical proof (D = kC - P) of why resetting the slow pointer to the head actually works."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Null Checks:</strong> Always ensure <code>fast != null</code> AND <code>fast.next != null</code> in your while loop condition. If you miss <code>fast.next</code>, <code>fast.next.next</code> will throw a NullPointerException on even-length linear lists.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>No Output Generation:</strong> Remember this function returns a <code>Node</code>, not a boolean or an index. Be sure to literally <code>return slow;</code> at the end.</div></li>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess && st.result !== null ? 'bg-fuchsia-900/40 border-fuchsia-800' : st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                {st.isPhase2 !== undefined && <span className="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Phase 2</span>}
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
                           
                           {selectedOpId === 'hashSetApproach' && st.visited && (
                               <div className="absolute left-10 bottom-10 z-30 pointer-events-none flex flex-col gap-2">
                                   <span className="text-[12px] font-black text-amber-600 uppercase tracking-widest font-mono bg-amber-50/90 backdrop-blur px-4 py-2 rounded-xl shadow-xl border border-amber-200 w-max">HashSet Memory O(N)</span>
                                   <div className="flex gap-3 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-2xl max-w-2xl flex-wrap">
                                       {st.visited.length === 0 ? <span className="text-sm text-slate-400 italic px-2">Empty...</span> : null}
                                       {st.visited.map((vid: number) => (
                                           <div key={vid} className={`flex items-center justify-center w-10 h-10 rounded-xl font-mono font-black text-sm shadow-sm ${st.added === vid ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                                               {st.list.find((n:any)=>n.id===vid)?.val}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}

                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-cycle-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isSuccessResult = st.isSuccess && st.result === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isCurr) themeColor = 'amber';
                              if (isSlow) themeColor = 'indigo';
                              if (isFast) themeColor = 'sky';
                              if (isSuccessResult) themeColor = 'fuchsia';
                              
                              const isTarget = isSlow || isFast || isCurr || isSuccessResult;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "indigo", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "sky", pos: "bottom" });
                              if (isCurr) lbls.push({ text: "curr", color: "amber", pos: "top" });
                              
                              if (st.isIntersection && isSlow) lbls.push({ text: "INTERSECT", color: "rose", pos: "bottom" });
                              if (isSuccessResult) lbls.push({ text: "ENTRANCE", color: "fuchsia", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isEntrance={isSuccessResult}/>
                                  </div>
                              )
                           })}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.result !== null ? 'border-fuchsia-500 shadow-[0_0_150px_rgba(217,70,239,0.3)]' : 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.result !== null ? 'bg-fuchsia-500' : 'bg-emerald-500'}`}></div>
                                
                                {st.result !== null ? (
                                    <>
                                        <div className="w-24 h-24 bg-fuchsia-500/20 text-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-fuchsia-500/10"><Trophy size={48}/></div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">CYCLE ENTRANCE</h2>
                                        <p className="text-fuchsia-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Located at index {inputPos}</p>
                                        <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                            <div className="text-fuchsia-500 text-[10px] font-black uppercase tracking-widest mb-2">Node Value</div>
                                            <div className="font-mono text-white text-5xl font-black">{st.list.find((n:any)=>n.id===st.result)?.val}</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg ring-4 ring-emerald-500/10"><CheckCircle2 size={48}/></div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">LINEAR LIST</h2>
                                        <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">No cycle detected</p>
                                        <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                            <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Result</div>
                                            <div className="font-mono text-white text-5xl font-black">null</div>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.result !== null ? 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-900/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'}`}>
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
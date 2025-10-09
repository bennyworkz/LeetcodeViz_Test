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
  Link as LinkIcon
} from 'lucide-react';

// --- TypeScript Interfaces ---

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
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isIntersection?: boolean;
}

// --- Algorithm Configuration ---

const OPERATIONS = {
  nestedLoops: {
    id: 'nestedLoops',
    title: 'Nested Loops',
    icon: <Search size={16} />,
    complexity: 'Time: O(M×N) | Space: O(1)',
    code: `public Node getIntersection(Node hA, Node hB) {
    while (hA != null) {
        Node temp = hB;
        while (temp != null) {
            if (hA == temp) return hA;
            temp = temp.next;
        }
        hA = hA.next;
    }
    return null;
}`,
    desc: "The brute force approach. For every node in List A, we traverse the entire List B looking for a match. Extremely slow for large lists but requires zero extra memory."
  },
  hashing: {
    id: 'hashing',
    title: 'Hashing',
    icon: <Hash size={16} />,
    complexity: 'Time: O(M+N) | Space: O(M)',
    code: `public Node getIntersection(Node hA, Node hB) {
    Set<Node> visited = new HashSet<>();
    while (hA != null) {
        visited.add(hA);
        hA = hA.next;
    }
    while (hB != null) {
        if (visited.contains(hB)) return hB;
        hB = hB.next;
    }
    return null;
}`,
    desc: "Stores all memory addresses of List A in a HashSet. When traversing List B, the first node already present in the set is our intersection. Fast, but uses O(M) space."
  },
  lengthDiff: {
    id: 'lengthDiff',
    title: 'Node Count Diff',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(M+N) | Space: O(1)',
    code: `public Node getIntersection(Node hA, Node hB) {
    int lenA = getLen(hA), lenB = getLen(hB);
    int d = Math.abs(lenA - lenB);
    
    Node currA = hA, currB = hB;
    if (lenA > lenB) while(d-- > 0) currA = currA.next;
    else while(d-- > 0) currB = currB.next;

    while (currA != currB) {
        currA = currA.next;
        currB = currB.next;
    }
    return currA;
}`,
    desc: "Calculates list lengths to find the offset. By advancing the pointer of the longer list by the difference, both pointers become aligned to reach the merge point simultaneously."
  },
  twoPointer: {
    id: 'twoPointer',
    title: 'Handshake Sync',
    icon: <Share2 size={16} />,
    complexity: 'Time: O(M+N) | Space: O(1)',
    code: `public Node getIntersection(Node hA, Node hB) {
    Node a = hA, b = hB;
    while (a != b) {
        a = (a == null) ? hB : a.next;
        b = (b == null) ? hA : b.next;
    }
    return a;
}`,
    desc: "The optimal solution. When a pointer hits NULL, it jumps to the other head. This neutralizes the length difference, forcing them to collide at the intersection."
  },
  cycleDetection: {
    id: 'cycleDetection',
    title: 'Cycle Finding',
    icon: <Repeat size={16} />,
    complexity: 'Time: O(M+N) | Space: O(1)',
    code: `public Node getIntersection(Node hA, Node hB) {
    Node tailA = findTail(hA);
    tailA.next = hA; // Create Loop
    
    Node slow = hB, fast = hB;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) break;
    }
    // Logic to find loop start...
    return entryPoint;
}`,
    desc: "Transforms the problem into cycle detection. By linking List A's tail back to its head, List B now contains a cycle starting exactly at the merge point."
  }
};

// --- Sub-components ---

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|return|if|else|while|Node|null|getIntersection|hA|hB|a|b|next|visited|Set|HashSet|add|contains|getLen|Math|abs|currA|currB|slow|fast|entryPoint|new)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'return', 'if', 'else', 'while', 'new'].includes(part);
            const isObject = ['Node', 'Set', 'HashSet'].includes(part);
            const isPointer = ['a', 'b', 'hA', 'hB', 'next', 'currA', 'currB', 'slow', 'fast', 'visited'].includes(part);
            return <span key={i} className={part.startsWith('//') ? 'text-slate-500 italic' : isKeyword ? 'text-pink-400 font-bold' : isObject ? 'text-sky-400 font-bold' : isPointer ? 'text-indigo-400' : isNaN(parseInt(part)) ? '' : 'text-emerald-400'}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses = { emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200', sky: 'bg-sky-100 text-sky-700 border-sky-200', indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200', rose: 'bg-rose-100 text-rose-700 border-rose-200', amber: 'bg-amber-100 text-amber-700 border-amber-200', slate: 'bg-white text-slate-500 border-slate-200' };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-12' : 'flex-col -bottom-12';
    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>{String(label)}</span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isIntersection }) => {
    const themes = { emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' }, rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' }, indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' }, amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' }, slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' } };
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-indigo-300 shadow-xl z-20 scale-105` : `shadow-sm z-10`;
    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${activeTheme.text}`}>{String(val)}</div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}><span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NEXT</span></div>
            </div>
            {isIntersection && <div className="absolute -inset-2 border-2 border-dashed border-emerald-500 rounded-3xl animate-pulse -z-10 opacity-40"></div>}
        </div>
    );
};

// --- Main Application ---

export default function LinkedListIntersectionViz() {
  // 1. State Hooks
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointer');
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

  // 3. Handlers (Defined early to avoid ReferenceErrors)
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

  // 4. Data Initialization
  const nodes = useMemo(() => [
    { id: 0, val: 'A1', addr: '0x100', nextId: 1, x: 50, y: 150, list: 'A' },
    { id: 1, val: 'A2', addr: '0x120', nextId: 2, x: 210, y: 150, list: 'A' },
    { id: 5, val: 'B1', addr: '0x200', nextId: 6, x: 50, y: 350, list: 'B' },
    { id: 6, val: 'B2', addr: '0x220', nextId: 7, x: 210, y: 350, list: 'B' },
    { id: 7, val: 'B3', addr: '0x240', nextId: 2, x: 370, y: 350, list: 'B' },
    { id: 2, val: 'C1', addr: '0x300', nextId: 3, x: 530, y: 250, list: 'Common' },
    { id: 3, val: 'C2', addr: '0x320', nextId: 4, x: 690, y: 250, list: 'Common' },
    { id: 4, val: 'C3', addr: '0x340', nextId: null, x: 850, y: 250, list: 'Common' }
  ], []);

  // 5. Trackpad Interaction
  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 6. Trace Memo
  const trace = useMemo(() => {
    const steps = [];
    const add = (ph, ds, ln, st) => steps.push({ phase: ph, description: ds, line: ln, state: st });

    if (selectedOpId === 'nestedLoops') {
        add("Start", "Begin brute force traversal.", 1, { ptrA: 0, ptrB: null });
        let hA = 0;
        while (hA !== null) {
            let nodeA = nodes.find(n => n.id === hA);
            add("Outer Loop", `Inspecting Node(${nodeA.val}) from List A.`, 2, { ptrA: hA, ptrB: 5 });
            let hB = 5;
            while (hB !== null) {
                let nodeB = nodes.find(n => n.id === hB);
                add("Compare", `Compare ${nodeA.val} (A) with ${nodeB.val} (B).`, 5, { ptrA: hA, ptrB: hB, isComparing: true });
                if (hA === hB) {
                    add("Found!", `Intersection detected at Node(${nodeA.val})!`, 5, { ptrA: hA, ptrB: hB, isSuccess: true, found: true });
                    return steps;
                }
                hB = nodeB.nextId;
            }
            hA = nodeA.nextId;
        }
    } else if (selectedOpId === 'hashing') {
        let visited = new Set();
        let hA = 0;
        add("Hash List A", "Traversing List A to store all memory addresses in a Set.", 1, { ptrA: 0 });
        while (hA !== null) {
            let nodeA = nodes.find(n => n.id === hA);
            visited.add(hA);
            add("Store", `Added ${nodeA.val} to HashSet.`, 5, { ptrA: hA, visited: new Set(visited) });
            hA = nodeA.nextId;
        }
        let hB = 5;
        add("Scan List B", "Checking List B nodes against the HashSet.", 8, { ptrB: 5, visited: new Set(visited) });
        while (hB !== null) {
            let nodeB = nodes.find(n => n.id === hB);
            add("Check Set", `Is ${nodeB.val} in Set?`, 9, { ptrB: hB, visited: new Set(visited), isComparing: true });
            if (visited.has(hB)) {
                add("Collision!", `Common node identified: ${nodeB.val}.`, 9, { ptrB: hB, isSuccess: true, found: true, ptrA: hB });
                return steps;
            }
            hB = nodeB.nextId;
        }
    } else if (selectedOpId === 'lengthDiff') {
        add("Length Count", "Count nodes in A (5) and B (6). Diff = 1.", 2, { ptrA: 0, ptrB: 5 });
        add("Alignment", "List B is longer. Move pointer B forward 1 step to sync.", 9, { ptrA: 0, ptrB: 6 });
        let pA = 0, pB = 6;
        while (pA !== pB) {
            add("Step", "Both pointers move together now that they are aligned.", 12, { ptrA: pA, ptrB: pB, isComparing: true });
            pA = nodes.find(n => n.id === pA)?.nextId ?? null;
            pB = nodes.find(n => n.id === pB)?.nextId ?? null;
        }
        add("Found!", `Pointers matched at Node(${nodes.find(n => n.id === pA)?.val}).`, 15, { ptrA: pA, ptrB: pB, isSuccess: true, found: true });
    } else if (selectedOpId === 'twoPointer') {
        let pA = 0, pB = 5;
        add("Sync Start", "Pointers a and b start at respective heads.", 1, { ptrA: 0, ptrB: 5 });
        while (pA !== pB) {
            add("Step", `Pointers moving. A:${pA === null ? 'NULL' : nodes.find(n=>n.id===pA)?.val}, B:${pB === null ? 'NULL' : nodes.find(n=>n.id===pB)?.val}`, 11, { ptrA: pA, ptrB: pB, isComparing: true });
            let nextA = pA === null ? 5 : nodes.find(n=>n.id===pA)?.nextId ?? null;
            let nextB = pB === null ? 0 : nodes.find(n=>n.id===pB)?.nextId ?? null;
            pA = nextA; pB = nextB;
        }
        add("Meeting Point", `Both pointers arrived at same memory address!`, 14, { ptrA: pA, ptrB: pB, isSuccess: true, found: pA !== null });
    } else if (selectedOpId === 'cycleDetection') {
        add("Transform", "Connect Tail of List A to Head of List A to create a loop.", 1, { cycleCreated: true });
        add("Floyd's Algorithm", "Running cycle detection from Head B.", 7, { ptrA: 5, ptrB: 5, cycleCreated: true });
        add("Intersection!", "Pointers met! Cycle entrance found at Node(C1).", 14, { ptrA: 2, ptrB: 2, cycleCreated: true, isSuccess: true, found: true });
    }
    return steps;
  }, [nodes, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { state: {} };
  const st = curStepData.state;
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows = nodes.map(node => {
        if (node.nextId === null) return null;
        const target = nodes.find(n => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 92, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        return <path key={node.id} d={`M ${startX},${startY} C ${startX + 30},${startY} ${endX - 30},${endY} ${endX},${endY}`} fill="none" stroke='#cbd5e1' strokeWidth={2} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
    if (st.cycleCreated) {
        const tailA = nodes.find(n => n.id === 4);
        const headA = nodes.find(n => n.id === 0);
        arrows.push(<path key="cycle" d={`M ${tailA.x + 92},${tailA.y + 28} C ${tailA.x + 200},${tailA.y + 150} ${headA.x - 100},${headA.y + 150} ${headA.x - 6},${headA.y + 28}`} fill="none" stroke="#f43f5e" strokeWidth={3} strokeDasharray="5,5" markerEnd="url(#arrowhead-cycle)" />);
    }
    return arrows;
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center"><Repeat className="text-white" size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Intersection Point</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest"><span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Handshake Logic</span><span>•</span><span>Memory Sync</span></div>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><GitMerge size={28}/> The Y-Merge Challenge</div>
                    <p className="text-lg leading-relaxed">Two independent linked lists eventually point to a shared tail. The goal is to return the first node object that is common to both. This is a primary test of <strong>reference equality</strong> in memory.</p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Objective</h4>
                        <p className="text-sm leading-relaxed">Identify the meeting point in O(1) space. Using a HashSet is intuitive but costly in memory-limited systems.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Layout size={16} className="text-indigo-500"/> Structural Logic</h4>
                        <p className="text-sm leading-relaxed">Because it's a singly linked list, once nodes merge, they share the same tail until NULL.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in min-h-[600px] space-y-10">
                <div className="p-8 rounded-3xl bg-[#0f172a] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Braces size={120}/></div>
                    <h3 className="font-black text-rose-400 text-lg uppercase tracking-widest mb-6 flex items-center gap-2"><Activity size={20}/> Complexity Analysis</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                        <p><strong>1. Nested Loops:</strong> The O(M*N) brute force approach is helpful to mention first as a baseline.</p>
                        <p><strong>2. Hashing:</strong> O(M+N) time and O(M) space. Good for production but inefficient for memory.</p>
                        <p><strong>3. Two-Pointer Swap:</strong> O(M+N) time and O(1) space. By jumping lists, we force both pointers to travel a total of M+N steps, meeting exactly at the merge.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in min-h-[600px] space-y-12 text-slate-700">
                 <div className="bg-rose-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest">Interviewer Strategy</h3>
                    <p className="text-sm text-rose-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers are testing your mental model of the heap. Reference equality (comparing pointers) is the key here. Mention the Two-Pointer handshake to show mathematical intuition."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Memory Equality:</strong> Node1 == Node2 checks the address, not just the data value.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>No Match:</strong> If pointers both reach NULL, the lists never intersected.</div></li>
                        </ul>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Handshake.java</span>
                    <button onClick={() => { navigator.clipboard.writeText(selectedOp.code); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex gap-4">
                         <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all ${st.ptrA !== null ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 text-slate-300'}`}>PTR A: {st.ptrA === null ? 'NULL' : String(nodes.find(n=>n.id===st.ptrA)?.val)}</div>
                         <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all ${st.ptrB !== null ? 'bg-rose-600 border-rose-600 text-white' : 'bg-slate-50 text-slate-300'}`}>PTR B: {st.ptrB === null ? 'NULL' : String(nodes.find(n=>n.id===st.ptrB)?.val)}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Handshake Trace</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-sm leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight italic">Intersection identified.</p>
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

                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
                            <div className="bg-[#0f172a] border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={32}/></div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 text-white">INTERSECTION</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner tracking-tighter">
                                    {String(st.found ? nodes.find(n=>n.id===st.ptrA)?.val : 'NO INTERSECTION POINT')}
                                </div>
                                <button onClick={handleReset} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                                    <RotateCcw size={18}/> RESTART VIZ
                                </button>
                            </div>
                        </div>
                   )}

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker><marker id="arrowhead-cycle" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /></marker></defs>{renderSvgArrows()}</svg>
                           {nodes.map((nodeObj, idx) => {
                              const isA = st.ptrA === nodeObj.id; const isB = st.ptrB === nodeObj.id;
                              let blockTheme = 'slate';
                              if (nodeObj.list === 'A') blockTheme = 'emerald';
                              if (nodeObj.list === 'B') blockTheme = 'rose';
                              if (nodeObj.list === 'Common') blockTheme = 'indigo';
                              const lbls = [];
                              if (nodeObj.id === 0) lbls.push({ text: "headA", color: "emerald", pos: "top" });
                              if (nodeObj.id === 5) lbls.push({ text: "headB", color: "rose", pos: "top" });
                              if (isA) lbls.push({ text: "ptrA", color: "emerald", pos: "bottom" });
                              if (isB) lbls.push({ text: "ptrB", color: "rose", pos: "bottom" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isA || isB} themeColor={blockTheme} isIntersection={nodeObj.id === 2 && st.isSuccess && st.found}/>
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

      {/* --- Fullscreen Portal --- */}
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
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Tracing Memory</span></div>
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
                            <button onClick={zoomIn} className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div 
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={handlePointerUp} 
                    onPointerLeave={handlePointerUp}
                  >
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {nodes.map((nodeObj, idx) => {
                              const isA = st.ptrA === nodeObj.id; const isB = st.ptrB === nodeObj.id;
                              let blockTheme = 'slate';
                              if (nodeObj.list === 'A') blockTheme = 'emerald';
                              if (nodeObj.list === 'B') blockTheme = 'rose';
                              if (nodeObj.list === 'Common') blockTheme = 'indigo';
                              const lbls = [];
                              if (nodeObj.id === 0) lbls.push({ text: "headA", color: "emerald", pos: "top" });
                              if (nodeObj.id === 5) lbls.push({ text: "headB", color: "rose", pos: "top" });
                              if (isA) lbls.push({ text: "ptrA", color: "emerald", pos: "bottom" });
                              if (isB) lbls.push({ text: "ptrB", color: "rose", pos: "bottom" });
                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isA || isB} themeColor={blockTheme} isIntersection={nodeObj.id === 2 && st.isSuccess && st.found}/>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">INTERSECTION FOUND</h2>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl tracking-tighter">
                                    {String(st.found ? `INTERSECTS AT: Node(${nodes.find(n=>n.id===st.ptrA)?.val})` : 'NO INTERSECTION POINT FOUND')}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg"><RotateCcw size={24}/> RESTART VIZ</button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">CLOSE</button>
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
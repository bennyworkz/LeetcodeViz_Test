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
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  hashing: {
    id: 'hashing',
    title: 'HashSet Method (Optimal)',
    icon: <Database size={16} />,
    complexity: 'Time: O(M+N) | Space: O(M)',
    code: `public void getUnionIntersection(Node head1, Node head2) {
    HashSet<Integer> set = new HashSet<>();
    Node curr1 = head1;
    
    // 1. Traverse List 1
    while (curr1 != null) {
        set.add(curr1.data);
        addToUnion(curr1.data);
        curr1 = curr1.next;
    }
    
    Node curr2 = head2;
    
    // 2. Traverse List 2
    while (curr2 != null) {
        if (set.contains(curr2.data)) {
            // Already in set: It's an Intersection!
            addToIntersection(curr2.data);
        } else {
            // Not in set: It's unique, add to Union
            set.add(curr2.data);
            addToUnion(curr2.data);
        }
        curr2 = curr2.next;
    }
}`,
    desc: "The most efficient approach for unsorted lists. We index all elements of the first list in a HashSet. Then, we traverse the second list. If an element exists in the set, it belongs to the Intersection. If not, we add it to the Union."
  },
  sorting: {
    id: 'sorting',
    title: 'Merge Sort & 2-Pointers',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(M log M + N log N) | Space: O(1)',
    code: `public void getUnionIntersectionSorted(Node head1, Node head2) {
    // 1. Sort both lists (e.g., using Merge Sort)
    head1 = mergeSort(head1);
    head2 = mergeSort(head2);
    
    Node p1 = head1, p2 = head2;
    
    // 2. Two-pointer traversal
    while (p1 != null && p2 != null) {
        if (p1.data < p2.data) {
            addToUnion(p1.data);
            p1 = p1.next;
        } else if (p1.data > p2.data) {
            addToUnion(p2.data);
            p2 = p2.next;
        } else {
            // Match found!
            addToUnion(p1.data);
            addToIntersection(p1.data);
            p1 = p1.next;
            p2 = p2.next;
        }
    }
    
    // Append remainders to Union
    while (p1 != null) { addToUnion(p1.data); p1 = p1.next; }
    while (p2 != null) { addToUnion(p2.data); p2 = p2.next; }
}`,
    desc: "If modifying the list is allowed, sorting them first brings the space complexity down to O(1). After sorting, we use two pointers to walk through both lists simultaneously, merging identical values and collecting unique ones."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|void|return|if|else|while|Node|null|getUnionIntersection|getUnionIntersectionSorted|head1|head2|curr1|curr2|next|data|set|HashSet|Integer|add|contains|addToUnion|addToIntersection|mergeSort|p1|p2|new)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'void', 'return', 'if', 'else', 'while', 'new'].includes(part);
            const isObject = ['Node', 'HashSet', 'Integer'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head1', 'head2', 'curr1', 'curr2', 'p1', 'p2', 'next', 'set'].includes(part);
            const isMethod = ['add', 'contains', 'addToUnion', 'addToIntersection', 'mergeSort'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isMethod ? 'text-fuchsia-300' :
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

interface ListNodeBlockProps {
  val: number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
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
        </div>
    );
};

// --- Main Application ---

export default function SetOperationsLLViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('hashing');
  
  // As per requirement, lists contain distinct elements internally.
  const [inputP1, setInputP1] = useState('10, 20, 40, 50');
  const [inputP2, setInputP2] = useState('15, 40, 50, 60');
  
  const [baseL1, setBaseL1] = useState([]);
  const [baseL2, setBaseL2] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

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
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const parseList = (inputStr, idOffset, rowY, listId) => {
      const parts = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      let nodes = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: idOffset + i,
              val: parts[i],
              addr: '0x' + (100 + ((idOffset+i) * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? idOffset + i + 1 : null,
              x: 60 + (i * 180),
              y: rowY,
              listId: listId
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseL1(parseList(inputP1, 0, 100, 'L1'));
    setBaseL2(parseList(inputP2, 20, 250, 'L2'));
    setCurrentStep(0);
    setPan({ x: 100, y: 50 });
  }, [inputP1, inputP2]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (baseL1.length === 0 && baseL2.length === 0) return [{ phase: 'Init', description: 'Enter list values.', state: { l1: [], l2: [], set: [], union: [], intersect: [] } }];
    
    let l1Nodes = baseL1.map(n => ({...n}));
    let l2Nodes = baseL2.map(n => ({...n}));
    
    let visitedSet = new Set();
    let unionList = [];
    let interList = [];

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            l1List: l1Nodes.map(n=>({...n})), 
            l2List: l2Nodes.map(n=>({...n})), 
            hashSet: Array.from(visitedSet),
            unionData: [...unionList],
            interData: [...interList],
            ...st 
        } 
    });

    if (selectedOpId === 'hashing') {
        let curr1 = l1Nodes.length > 0 ? l1Nodes[0].id : null;
        let curr2 = l2Nodes.length > 0 ? l2Nodes[0].id : null;

        add("Initialize", "Create an empty HashSet to index List 1.", 2, { curr1, curr2 });

        while (curr1 !== null) {
            const n1 = l1Nodes.find(n => n.id === curr1);
            add("Read L1", `Inspecting Node(${n1.val}) from List 1.`, 6, { curr1, curr2, isProcessingL1: true });
            
            visitedSet.add(n1.val);
            unionList.push(n1.val);
            add("Index & Union", `Added ${n1.val} to HashSet and Union List.`, 7, { curr1, curr2, isProcessingL1: true });
            
            curr1 = n1.nextId;
        }

        add("List 1 Complete", "List 1 fully indexed. Now traversing List 2.", 11, { curr1, curr2 });

        while (curr2 !== null) {
            const n2 = l2Nodes.find(n => n.id === curr2);
            add("Read L2", `Inspecting Node(${n2.val}) from List 2.`, 14, { curr1, curr2, isProcessingL2: true });

            if (visitedSet.has(n2.val)) {
                interList.push(n2.val);
                add("Intersection Found!", `${n2.val} exists in HashSet! Appending to Intersection.`, 17, { curr1, curr2, isProcessingL2: true, isMatch: true });
            } else {
                visitedSet.add(n2.val);
                unionList.push(n2.val);
                add("Unique Node", `${n2.val} not in HashSet. Appending to Union.`, 21, { curr1, curr2, isProcessingL2: true });
            }

            curr2 = n2.nextId;
        }

    } else if (selectedOpId === 'sorting') {
        let p1 = l1Nodes.length > 0 ? l1Nodes[0].id : null;
        let p2 = l2Nodes.length > 0 ? l2Nodes[0].id : null;

        add("Sort Input", "Lists sorted into ascending order (Simulated Merge Sort).", 3, { p1, p2 });
        l1Nodes.sort((a,b) => a.val - b.val);
        l2Nodes.sort((a,b) => a.val - b.val);
        // Refresh spatial positioning
        l1Nodes.forEach((n, i) => { n.x = 60 + (i * 180); n.nextId = i < l1Nodes.length - 1 ? l1Nodes[i+1].id : null; });
        l2Nodes.forEach((n, i) => { n.x = 60 + (i * 180); n.nextId = i < l2Nodes.length - 1 ? l2Nodes[i+1].id : null; });
        
        p1 = l1Nodes.length > 0 ? l1Nodes[0].id : null;
        p2 = l2Nodes.length > 0 ? l2Nodes[0].id : null;

        add("Two-Pointer Init", "Set pointers to heads of sorted lists.", 6, { p1, p2 });

        while (p1 !== null && p2 !== null) {
            const n1 = l1Nodes.find(n => n.id === p1);
            const n2 = l2Nodes.find(n => n.id === p2);

            add("Compare Values", `Comparing L1: ${n1.val} and L2: ${n2.val}`, 9, { p1, p2, isComparing: true });

            if (n1.val < n2.val) {
                unionList.push(n1.val);
                add("L1 Smaller", `${n1.val} < ${n2.val}. Add ${n1.val} to Union.`, 10, { p1, p2 });
                p1 = n1.nextId;
            } else if (n1.val > n2.val) {
                unionList.push(n2.val);
                add("L2 Smaller", `${n2.val} < ${n1.val}. Add ${n2.val} to Union.`, 13, { p1, p2 });
                p2 = n2.nextId;
            } else {
                unionList.push(n1.val);
                interList.push(n1.val);
                add("Match!", `Values match (${n1.val}). Add to both Union & Intersection.`, 18, { p1, p2, isMatch: true });
                p1 = n1.nextId;
                p2 = n2.nextId;
            }
        }

        add("Main Loop End", "Appending any remaining unmerged nodes to Union.", 24, { p1, p2 });
        while (p1 !== null) {
            const n1 = l1Nodes.find(n => n.id === p1);
            unionList.push(n1.val);
            p1 = n1.nextId;
        }
        while (p2 !== null) {
            const n2 = l2Nodes.find(n => n.id === p2);
            unionList.push(n2.val);
            p2 = n2.nextId;
        }
    }

    add("Complete", "Union and Intersection lists completely formed.", 28, { isSuccess: true });

    return steps;
  }, [baseL1, baseL2, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { l1List: [], l2List: [], hashSet: [], unionData: [], interData: [] } };
  const st = curStepData.state || { l1List: [], l2List: [], hashSet: [], unionData: [], interData: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const allNodes = [...(st.l1List || []), ...(st.l2List || [])];
    return allNodes.map((node) => {
        if (node.nextId === null || node.nextId === undefined) return null;
        const target = allNodes.find((n) => n.id === node.nextId);
        if (!target) return null;
        const startX = node.x + 104, startY = node.y + 28, endX = target.x - 6, endY = target.y + 28;
        const strokeColor = '#cbd5e1';
        const pathD = `M ${startX},${startY} C ${startX + 20},${startY} ${endX - 20},${endY} ${endX},${endY}`;
        return <path key={`link-${String(node.addr)}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <CircleDashed className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Set Operations</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
                      Union & Intersection
                  </span>
                  <span>•</span>
                  <span>O(M+N) Analysis</span>
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
                    <div className="flex items-center gap-3 text-fuchsia-600 font-black text-2xl uppercase tracking-tighter"><PlusSquare size={28}/> List Aggregation</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      You are given two singly linked lists containing distinct values. The task is to create two new structures: a <strong>Union List</strong> containing all unique elements from both, and an <strong>Intersection List</strong> containing only elements present in both.
                    </p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Challenge</h4>
                        <p className="text-sm leading-relaxed">The lists are unsorted by default. A naive loop-in-loop approach requires $O(M \times N)$ time, which is unacceptable for large datasets.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Tradeoffs</h4>
                        <p className="text-sm leading-relaxed leading-relaxed text-sm">We can either use extra space (Hashing) for $O(N)$ time, or modify the input lists (Sorting) for $O(N \log N)$ time and $O(1)$ space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-fuchsia-100' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Sets.java</span>
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1">List 1</label>
                            <input type="text" value={inputP1} onChange={(e) => setInputP1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">List 2</label>
                            <input type="text" value={inputP2} onChange={(e) => setInputP2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-fuchsia-900 border-fuchsia-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-fuchsia-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight italic">Union & Intersection Sets Calculated.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[520px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex gap-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-fuchsia-500"/> Subsystem Canvas</span>
                   </div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {/* Dynamic Results Display */}
                   <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-4 pointer-events-none">
                       {selectedOpId === 'hashing' && (
                           <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex-1 shadow-sm">
                               <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2"><Database size={14}/> HashSet</div>
                               <div className="font-mono font-bold text-amber-800 text-sm flex flex-wrap gap-2">
                                   {(st.hashSet || []).map(val => <span key={val} className="bg-white px-2 py-1 rounded shadow-sm border border-amber-100">{String(val)}</span>)}
                                   {(st.hashSet?.length === 0) && <span className="opacity-50">Empty</span>}
                               </div>
                           </div>
                       )}
                       <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-xl p-4 flex-1 shadow-sm flex flex-col justify-between">
                           <div className="text-[10px] font-black text-fuchsia-700 uppercase tracking-widest mb-2">Union U</div>
                           <div className="font-mono font-bold text-fuchsia-900 text-sm truncate">{st.unionData?.join(', ') || 'Empty'}</div>
                       </div>
                       <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex-1 shadow-sm flex flex-col justify-between">
                           <div className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">Intersection ∩</div>
                           <div className="font-mono font-bold text-indigo-900 text-sm truncate">{st.interData?.join(', ') || 'Empty'}</div>
                       </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           
                           {[...(st.l1List||[]), ...(st.l2List||[])].map((nodeObj) => {
                              const isCurr1 = st.curr1 === nodeObj.id; 
                              const isCurr2 = st.curr2 === nodeObj.id;
                              const isP1 = st.p1 === nodeObj.id;
                              const isP2 = st.p2 === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (nodeObj.listId === 'L1') themeColor = 'emerald';
                              if (nodeObj.listId === 'L2') themeColor = 'sky';
                              
                              const isTarget = isCurr1 || isCurr2 || isP1 || isP2;

                              const lbls = [];
                              if (isCurr1) lbls.push({ text: "curr1", color: "emerald", pos: "top" });
                              if (isCurr2) lbls.push({ text: "curr2", color: "sky", pos: "top" });
                              if (isP1) lbls.push({ text: "p1", color: "emerald", pos: "top" });
                              if (isP2) lbls.push({ text: "p2", color: "sky", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      {nodeObj.x === 60 && <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-black opacity-30 tracking-widest">{nodeObj.listId}</div>}
                                      
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor}/>
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
                    <h3 className="font-black text-fuchsia-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. The Set Approach:</strong> A HashSet offers $O(1)$ constant time lookups. By indexing the first list, we turn a nested loop $O(N \times M)$ problem into a linear $O(N + M)$ sweep.</p>
                        <p><strong>2. The Sort Approach:</strong> If modifying lists is permitted, sorting them allows us to use two pointers. We march through both lists, advancing the pointer that points to the smaller value. If values match, we advance both and record an intersection.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-fuchsia-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-fuchsia-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking the Intersection</h3>
                    <p className="text-sm text-fuchsia-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers will push you to optimize space. Offer the HashSet approach first for optimal time. If they restrict memory to O(1), pivot to the Merge Sort & Two-Pointer strategy."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-indigo-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Data Duplication:</strong> The prompt specifies lists contain <em>distinct</em> internal nodes, meaning we don't have to worry about a single list having `[2, 2, 2]`. This simplifies the Union logic.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Output Requirements:</strong> Ask if you should create new nodes or re-link existing ones. Generating new lists is much safer to avoid memory corruption.</div></li>
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
                          <div className="bg-fuchsia-600 p-2 rounded-lg text-white shadow-lg shadow-fuchsia-900/50"><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-fuchsia-900/40 border-fuchsia-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <span>Line {String(curStepData.line || 0)}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {/* Dynamic Results Display FS */}
                  <div className="absolute top-8 left-8 z-20 flex flex-col gap-4 pointer-events-none w-64">
                       {selectedOpId === 'hashing' && (
                           <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 shadow-xl backdrop-blur-sm">
                               <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2"><Database size={14}/> HashSet</div>
                               <div className="font-mono font-bold text-amber-800 text-sm flex flex-wrap gap-2">
                                   {(st.hashSet || []).map(val => <span key={val} className="bg-white px-2 py-1 rounded shadow-sm border border-amber-100">{String(val)}</span>)}
                                   {(st.hashSet?.length === 0) && <span className="opacity-50">Empty</span>}
                               </div>
                           </div>
                       )}
                       <div className="bg-fuchsia-50/90 border border-fuchsia-200 rounded-xl p-4 shadow-xl backdrop-blur-sm">
                           <div className="text-[10px] font-black text-fuchsia-700 uppercase tracking-widest mb-2">Union U</div>
                           <div className="font-mono font-bold text-fuchsia-900 text-sm">{st.unionData?.join(', ') || 'Empty'}</div>
                       </div>
                       <div className="bg-indigo-50/90 border border-indigo-200 rounded-xl p-4 shadow-xl backdrop-blur-sm">
                           <div className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">Intersection ∩</div>
                           <div className="font-mono font-bold text-indigo-900 text-sm">{st.interData?.join(', ') || 'Empty'}</div>
                       </div>
                  </div>

                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-6 animate-in slide-in-from-bottom-10">
                          <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                          <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-fuchsia-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(217,70,239,0.3)] hover:bg-fuchsia-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-fuchsia-500 shadow-fuchsia-900/20">NEXT <ChevronRight size={32}/></button>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           {[...(st.l1List||[]), ...(st.l2List||[])].map((nodeObj) => {
                              const isCurr1 = st.curr1 === nodeObj.id; 
                              const isCurr2 = st.curr2 === nodeObj.id;
                              const isP1 = st.p1 === nodeObj.id;
                              const isP2 = st.p2 === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (nodeObj.listId === 'L1') themeColor = 'emerald';
                              if (nodeObj.listId === 'L2') themeColor = 'sky';
                              
                              const isTarget = isCurr1 || isCurr2 || isP1 || isP2;

                              const lbls = [];
                              if (isCurr1) lbls.push({ text: "curr1", color: "emerald", pos: "top" });
                              if (isCurr2) lbls.push({ text: "curr2", color: "sky", pos: "top" });
                              if (isP1) lbls.push({ text: "p1", color: "emerald", pos: "top" });
                              if (isP2) lbls.push({ text: "p2", color: "sky", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      {nodeObj.x === 60 && <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-black opacity-30 tracking-widest text-slate-800">{nodeObj.listId}</div>}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor}/>
                                  </div>
                              )
                           })}
                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-fuchsia-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(217,70,239,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-fuchsia-500"></div>
                                <div className="w-24 h-24 bg-fuchsia-500/20 text-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-fuchsia-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-white text-center">COMPUTATION COMPLETE</h2>
                                <p className="text-fuchsia-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Result Sets final state</p>
                                <div className="flex gap-4 mb-10 text-left">
                                   <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl flex-1">
                                       <div className="text-fuchsia-500 text-[10px] font-black uppercase tracking-widest mb-2">Union U</div>
                                       <div className="font-mono text-white text-xl font-bold">{st.unionData?.join(', ') || 'Empty'}</div>
                                   </div>
                                   <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl flex-1">
                                       <div className="text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-2">Intersect ∩</div>
                                       <div className="font-mono text-white text-xl font-bold">{st.interData?.join(', ') || 'Empty'}</div>
                                   </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg shadow-fuchsia-900/20">
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
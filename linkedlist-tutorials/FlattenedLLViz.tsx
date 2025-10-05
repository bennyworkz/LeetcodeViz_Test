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
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursiveMerge: {
    id: 'recursiveMerge',
    title: 'Recursive Merge (Optimal)',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N*M) | Space: O(N)',
    code: `public Node flatten(Node root) {
    if (root == null || root.next == null) {
        return root;
    }

    // 1. Recurse to the rightmost next node
    root.next = flatten(root.next);

    // 2. Merge current list with the flattened next list
    root = mergeTwoLists(root, root.next);

    // 3. Return the merged head
    return root;
}

// Helper: Standard merge of two sorted lists using 'bottom' pointer
private Node mergeTwoLists(Node a, Node b) {
    Node dummy = new Node(0);
    Node temp = dummy;

    while (a != null && b != null) {
        if (a.data < b.data) {
            temp.bottom = a;
            a = a.bottom;
        } else {
            temp.bottom = b;
            b = b.bottom;
        }
        temp = temp.bottom;
    }
    
    if (a != null) temp.bottom = a;
    else temp.bottom = b;

    return dummy.bottom;
}`,
    desc: "The optimal strategy leverages the fact that individual sub-lists are already sorted. We use recursion to travel to the end of the 'next' chain, then continuously merge the last two sub-lists using their 'bottom' pointers, returning the merged head up the stack."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|void|return|if|else|while|Node|null|flatten|mergeTwoLists|root|next|bottom|dummy|temp|a|b|data|new)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'void', 'return', 'if', 'else', 'while', 'new'].includes(part);
            const isObject = ['Node'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['root', 'next', 'bottom', 'dummy', 'temp', 'a', 'b'].includes(part);
            const isProp = ['data'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isProp ? 'text-fuchsia-300' :
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
  position: string;
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
    
    // Custom alignment for multi-level layout
    let alignClass = '';
    if (position === 'top') alignClass = 'flex-col-reverse -top-10 left-1/2 -translate-x-1/2';
    if (position === 'bottom') alignClass = 'flex-col -bottom-10 left-1/2 -translate-x-1/2';
    if (position === 'left') alignClass = 'flex-row-reverse -left-16 top-1/2 -translate-y-1/2';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: position === 'left' ? `translateY(-50%) translateX(${offset}px)` : `translateX(-50%) translateY(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {String(label)}
            </span>
            {position === 'top' && <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/>}
            {position === 'bottom' && <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
            {position === 'left' && <ArrowRight size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface ListNodeBlockProps {
  val: string | number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isDummy?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isDummy }) => {
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
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[9px] text-slate-400 font-mono font-bold mb-0.5 opacity-80 tracking-tight">{isDummy ? 'Sentinel' : String(address)}</span>
            <div className={`flex flex-col items-center w-14 h-16 border-2 rounded-xl transition-all duration-300 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy ? '' : activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl border-b border-black/10 ${isDummy ? 'text-slate-500' : activeTheme.text}`}>
                    {isDummy ? 'D' : String(val)}
                </div>
                <div className={`h-4 w-full flex items-center justify-center ${isDummy ? 'bg-slate-700' : 'bg-black/5'}`}>
                    <span className={`text-[5px] font-black uppercase tracking-widest opacity-60 ${isDummy ? 'text-slate-400' : ''}`}>BTM</span>
                </div>
            </div>
            {/* Fake Next port indicator */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-slate-200 border-y border-r border-slate-300 rounded-r opacity-50 flex items-center justify-center">
                <span className="text-[4px] font-mono rotate-90 scale-75 block origin-center">NXT</span>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function FlattenedLLViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('recursiveMerge');
  
  // Format: "5,7,8,30 | 10,20 | 19,22,50 | 28,35,40,45"
  const [inputStr, setInputStr] = useState('5,7,8,30 | 10,20 | 19,22,50 | 28,35,40,45');
  const [baseList, setBaseList] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 100 }); 
    setZoom(0.8); 
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

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse multi-level list
  useEffect(() => {
    const lists = inputStr.split('|').map(s => s.trim()).filter(Boolean);
    let nodes = [];
    let headNodes = [];

    let currentId = 0;

    for (let i = 0; i < lists.length; i++) {
        const vals = lists[i].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
        if (vals.length === 0) continue;
        
        const startX = 60 + (i * 180);
        let headId = currentId;
        headNodes.push(headId);

        for (let j = 0; j < vals.length; j++) {
            nodes.push({
                id: currentId,
                val: vals[j],
                addr: '0x' + (100 + (currentId * 16)).toString(16).toUpperCase().padStart(3, '0'),
                nextId: null, // Initialized later
                bottomId: j < vals.length - 1 ? currentId + 1 : null,
                x: startX,
                y: 80 + (j * 110),
                colId: i
            });
            currentId++;
        }
    }

    // Link 'next' pointers only for the head nodes
    for (let i = 0; i < headNodes.length - 1; i++) {
        const headNode = nodes.find(n => n.id === headNodes[i]);
        if (headNode) headNode.nextId = headNodes[i+1];
    }

    setBaseList(nodes);
    setCurrentStep(0);
    setPan({ x: 100, y: 100 });
  }, [inputStr]);

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
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter list values.', state: { list: [], callStack: [] } }];
    
    let list = baseList.map(n => ({...n}));
    let initialRootId = list[0]?.id;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            ...st 
        } 
    });

    let callStack = [];

    // Helper: Merge Two Lists
    const mergeTwoLists = (aId, bId, depth) => {
        add("Merge Init", `Merging List A starting at Node(${list.find(n=>n.id===aId)?.val}) with List B starting at Node(${list.find(n=>n.id===bId)?.val}).`, 13, { a: aId, b: bId, callStack: [...callStack] });
        
        let dummyId = -depth; // unique dummy ID
        let dummyNode = { id: dummyId, val: 0, addr: 'DUMMY', nextId: null, bottomId: null, x: -100, y: -100, isDummy: true };
        list.push(dummyNode);

        let tempId = dummyId;
        let a = aId;
        let b = bId;

        // Visual layout hints
        let targetX = list.find(n=>n.id===aId)?.x || 60;

        add("Merge Loop", "Traversing 'bottom' pointers of both sub-lists.", 16, { a, b, temp: tempId, callStack: [...callStack] });

        let mergedY = 80;

        while (a !== null && b !== null) {
            let nodeA = list.find(n => n.id === a);
            let nodeB = list.find(n => n.id === b);

            add("Compare Nodes", `Comparing A(${nodeA.val}) and B(${nodeB.val}).`, 17, { a, b, temp: tempId, isComparing: true, callStack: [...callStack] });

            let tempNode = list.find(n => n.id === tempId);

            if (nodeA.val < nodeB.val) {
                add("Pick A", `A is smaller. temp.bottom = A.`, 18, { a, b, temp: tempId, callStack: [...callStack] });
                tempNode.bottomId = a;
                
                // Reposition node A to form the merged column
                nodeA.x = targetX;
                nodeA.y = mergedY;
                mergedY += 110;

                a = nodeA.bottomId;
            } else {
                add("Pick B", `B is smaller. temp.bottom = B.`, 21, { a, b, temp: tempId, callStack: [...callStack] });
                tempNode.bottomId = b;
                
                // Reposition node B to form the merged column
                nodeB.x = targetX;
                nodeB.y = mergedY;
                mergedY += 110;

                b = nodeB.bottomId;
            }
            tempId = tempNode.bottomId;
            add("Advance Temp", "temp = temp.bottom;", 24, { a, b, temp: tempId, callStack: [...callStack] });
        }

        let tempNode = list.find(n => n.id === tempId);
        if (a !== null) {
            add("Append Remainder A", "List B exhausted. Appending remaining A nodes.", 27, { a, b, temp: tempId, callStack: [...callStack] });
            tempNode.bottomId = a;
            
            // Adjust remaining A nodes
            let currA = a;
            while(currA !== null){
                let cA = list.find(n=>n.id===currA);
                cA.x = targetX;
                cA.y = mergedY;
                mergedY += 110;
                currA = cA.bottomId;
            }
        } else if (b !== null) {
            add("Append Remainder B", "List A exhausted. Appending remaining B nodes.", 28, { a, b, temp: tempId, callStack: [...callStack] });
            tempNode.bottomId = b;

            // Adjust remaining B nodes
            let currB = b;
            while(currB !== null){
                let cB = list.find(n=>n.id===currB);
                cB.x = targetX;
                cB.y = mergedY;
                mergedY += 110;
                currB = cB.bottomId;
            }
        }

        let resultHead = list.find(n => n.id === dummyId).bottomId;
        add("Merge Done", `Returning merged list head Node(${list.find(n=>n.id===resultHead)?.val}).`, 30, { callStack: [...callStack] });
        
        // Clean up dummy from visual list
        list = list.filter(n => n.id !== dummyId);

        return resultHead;
    };

    // Main Recursive Function
    const flattenRec = (rootId, depth) => {
        callStack.push({ root: rootId, depth });
        let rNode = list.find(n => n.id === rootId);
        
        add("flatten() Called", `flatten(Node(${rNode?.val ?? 'null'})) entered.`, 1, { root: rootId, callStack: [...callStack] });

        if (rootId === null || rNode?.nextId === null || rNode?.nextId === undefined) {
            add("Base Case", "Reached the end of 'next' pointer chain. Returning node up stack.", 3, { root: rootId, callStack: [...callStack] });
            callStack.pop();
            return rootId;
        }

        let nextListId = rNode.nextId;
        
        add("Recurse Next", `Flattening the rest of the 'next' chain first.`, 6, { root: rootId, callStack: [...callStack] });
        
        let flattenedNextId = flattenRec(nextListId, depth + 1);
        
        // Disconnect horizontal next link to reflect the merge process conceptually
        list.find(n => n.id === rootId).nextId = null;

        add("Merge Lists", `Merging current root Node(${rNode.val}) with flattened next list.`, 9, { root: rootId, callStack: [...callStack] });
        
        let newHeadId = mergeTwoLists(rootId, flattenedNextId, depth);

        add("Return Merged", `Returning newly merged root up the stack.`, 12, { root: newHeadId, callStack: [...callStack] });

        callStack.pop();
        return newHeadId;
    };

    if (initialRootId !== undefined) {
        flattenRec(initialRootId, 1);
        
        // Extract final sequence safely
        let finalSeq = [];
        let curr = list.find(n => n.x === 60 && n.y === 80)?.id; // Top left node after all merges
        if(curr === undefined && list.length > 0) curr = list[0].id;
        
        while(curr != null) {
            let n = list.find(it => it.id === curr);
            if(n) {
                finalSeq.push(String(n.val));
                curr = n.bottomId;
            } else break;
        }

        add("Complete", "Linked List fully flattened into a single sorted bottom-chain.", 12, { isSuccess: true, finalSeq: finalSeq.join(' ↓ ') });
    }

    return steps;
  }, [baseList, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [], callStack: [] } };
  const st = curStepData.state || { list: [], callStack: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows = [];
    (st.list || []).forEach((node) => {
        // Horizontal 'Next' Pointers
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = (st.list || []).find((n) => n.id === node.nextId);
            if (target) {
                const startX = node.x + 56; // right edge of node
                const startY = node.y + 32; // middle of node
                const endX = target.x - 6; 
                const endY = target.y + 32;
                const pathD = `M ${startX},${startY} L ${endX},${endY}`;
                arrows.push(<path key={`next-${node.id}`} d={pathD} fill="none" stroke="#cbd5e1" strokeWidth={2} markerEnd="url(#arrowhead-next)" className="transition-all duration-500" strokeDasharray="4,4" />);
            }
        }

        // Vertical 'Bottom' Pointers
        if (node.bottomId !== null && node.bottomId !== undefined) {
            const target = (st.list || []).find((n) => n.id === node.bottomId);
            if (target) {
                const startX = node.x + 28; // center x
                const startY = node.y + 64; // bottom edge
                const endX = target.x + 28; 
                const endY = target.y - 6; // top edge
                
                // Handle dynamic repositioning jumps
                const isJump = Math.abs(target.x - node.x) > 10;
                let pathD = '';
                if(isJump){
                     pathD = `M ${startX},${startY} C ${startX},${startY + 40} ${endX},${endY - 40} ${endX},${endY}`;
                } else {
                     pathD = `M ${startX},${startY} L ${endX},${endY}`;
                }

                const isActive = st.a === node.id || st.b === node.id;
                const strokeColor = isActive ? '#10b981' : '#94a3b8';

                arrows.push(<path key={`bottom-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={isActive ? 3 : 2} markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead-bottom)"} className="transition-all duration-500" />);
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
                <AlignVerticalSpaceAround className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Flatten Linked List</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Recursive Merge
                  </span>
                  <span>•</span>
                  <span>2D to 1D</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><LayersIcon size={28}/> 2D to 1D Mapping</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      A Linked List contains <code>next</code> pointers (going right) and <code>bottom</code> pointers (going down). The sub-lists formed by bottom pointers are already sorted. Flatten the entire structure into a single level (using only <code>bottom</code> pointers) while maintaining sorted order.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input Multi-Level List:</span>
                       5 -{'>'} 10 -{'>'} 19 -{'>'} 28<br/>
                       |<span className="text-transparent"> -{'>'} </span>|<span className="text-transparent"> -{'>'} </span>|<span className="text-transparent"> -{'>'} </span>|<br/>
                       7<span className="text-transparent"> -{'>'} </span>20<span className="text-transparent"> -{'>'} </span>22<span className="text-transparent"> -{'>'} </span>35<br/>
                       |<span className="text-transparent"> -{'>'} </span><span className="text-transparent"> -{'>'} </span>|<span className="text-transparent"> -{'>'} </span>|<br/>
                       8<span className="text-transparent"> -{'>'} </span><span className="text-transparent"> -{'>'} </span>50<span className="text-transparent"> -{'>'} </span>40<br/>
                       |<span className="text-transparent"> -{'>'} </span><span className="text-transparent"> -{'>'} </span><span className="text-transparent"> -{'>'} </span>|<br/>
                       30<span className="text-transparent"> -{'>'} </span><span className="text-transparent"> -{'>'} </span><span className="text-transparent"> -{'>'} </span>45<br/>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Core Logic</h4>
                        <p className="text-sm leading-relaxed">This is an application of the <strong>Merge Sort</strong> merging step. We iteratively merge two adjacent sorted columns into one, until all columns are combined into a single chain.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ArrowLeftToLine size={16} className="text-indigo-500"/> Why Recursion?</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Going to the extreme right and merging backwards ensures we are always just merging <em>two</em> lists at any given time, simplifying the state management.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Flatten.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={`code-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-1.5 w-full">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Columns (Separated by |)</label>
                            <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Call Stack & Merges</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">List fully flattened and sorted.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> 2D Grid Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none backdrop-blur-sm">
                            <div className="bg-[#0f172a] border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={32}/></div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 text-white">FLATTENED LIST</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner tracking-tighter max-h-40 overflow-y-auto">
                                    {String(st.finalSeq)}
                                </div>
                                <button onClick={handleReset} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                                    <RotateCcw size={18}/> RESTART VIZ
                                </button>
                            </div>
                        </div>
                   )}

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                                   <marker id="arrowhead-bottom" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Call Stack UI */}
                           {st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-0 top-0 bg-white/90 border border-slate-200 rounded-xl p-3 shadow-xl z-50 backdrop-blur-md">
                                   <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest mb-2 font-mono flex items-center gap-2 border-b pb-1"><Layers size={10}/> Stack</span>
                                   <div className="flex flex-col-reverse gap-1 text-[9px] font-mono text-slate-500">
                                       {st.callStack.map((frame, i) => {
                                           const frNode = (st.list || []).find(n=>n.id===frame.root);
                                           return (
                                               <div key={i} className={`px-1 py-0.5 rounded ${i === st.callStack.length - 1 ? 'bg-indigo-100 text-indigo-700 font-bold' : ''}`}>
                                                   flatten({frNode ? frNode.val : 'null'})
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isRoot = st.root === nodeObj.id; 
                              const isA = st.a === nodeObj.id;
                              const isB = st.b === nodeObj.id;
                              const isTemp = st.temp === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isA) themeColor = 'emerald';
                              else if (isB) themeColor = 'sky';
                              else if (isRoot) themeColor = 'indigo';
                              else if (isTemp) themeColor = 'fuchsia';
                              
                              const isTarget = isRoot || isA || isB || isTemp;

                              const lbls = [];
                              if (isRoot) lbls.push({ text: "root", color: "indigo", pos: "top" });
                              if (isTemp) lbls.push({ text: "temp", color: "fuchsia", pos: "left" });
                              if (isA) lbls.push({ text: "a", color: "emerald", pos: "top" });
                              if (isB) lbls.push({ text: "b", color: "sky", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-row-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'left').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="left" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isDummy={nodeObj.isDummy}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p>We are essentially performing a multi-way merge sort. However, instead of writing complex priority queues, we can use the call stack to simplify it.</p>
                        <p><strong>1. The Dive:</strong> We call <code>flatten(root.next)</code> recursively until we reach the last column on the right.</p>
                        <p><strong>2. The Merge:</strong> As the recursion unwinds, we take the current column (<code>root</code>) and merge it with the already-flattened list returned from the right (<code>root.next</code>).</p>
                        <p><strong>3. The Bottom Pointer:</strong> The standard <code>mergeTwoLists</code> function is modified to wire nodes via the <code>bottom</code> pointer instead of <code>next</code>, resulting in the final 1D vertical chain.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking the Flatten Matrix</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This problem looks terrifying because it's a 2D linked list. The secret is recognizing that it's just 'Merge Two Sorted Lists' repeated sequentially. If you can write the 1D merge, you just wrap it in a recursion."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Breaking Next:</strong> When you merge, ensure you aren't leaving stray horizontal <code>next</code> pointers that could cause infinite loops. The prompt usually expects the final list to only use <code>bottom</code>.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Base Case:</strong> The recursion stops when <code>root == null || root.next == null</code>. The last column is trivially already flattened!</div></li>
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
                            <CodeLineRenderer key={`code-line-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-next-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                                   <marker id="arrowhead-bottom-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker>
                                   <marker id="arrowhead-active-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Call Stack UI */}
                           {st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-10 top-10 bg-white/90 border border-slate-200 rounded-xl p-4 shadow-xl z-50 backdrop-blur-md w-48">
                                   <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-3 font-mono flex items-center gap-2 border-b pb-2"><Layers size={14}/> Call Stack</span>
                                   <div className="flex flex-col-reverse gap-1.5 text-[10px] font-mono text-slate-500">
                                       {st.callStack.map((frame, i) => {
                                           const frNode = (st.list || []).find(n=>n.id===frame.root);
                                           return (
                                               <div key={i} className={`px-2 py-1.5 rounded ${i === st.callStack.length - 1 ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm border border-indigo-200' : 'bg-slate-50 border border-slate-100'}`}>
                                                   flatten({frNode ? frNode.val : 'null'})
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isRoot = st.root === nodeObj.id; 
                              const isA = st.a === nodeObj.id;
                              const isB = st.b === nodeObj.id;
                              const isTemp = st.temp === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isA) themeColor = 'emerald';
                              else if (isB) themeColor = 'sky';
                              else if (isRoot) themeColor = 'indigo';
                              else if (isTemp) themeColor = 'fuchsia';
                              
                              const isTarget = isRoot || isA || isB || isTemp;

                              const lbls = [];
                              if (isRoot) lbls.push({ text: "root", color: "indigo", pos: "top" });
                              if (isTemp) lbls.push({ text: "temp", color: "fuchsia", pos: "left" });
                              if (isA) lbls.push({ text: "a", color: "emerald", pos: "top" });
                              if (isB) lbls.push({ text: "b", color: "sky", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-row-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'left').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="left" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isTarget} themeColor={themeColor} isDummy={nodeObj.isDummy}/>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-white text-center">MERGE COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">2D Matrix flattened to 1D List</p>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter text-center max-h-48 overflow-y-auto">
                                    {String(st.finalSeq)}
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
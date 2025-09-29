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
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  iterativeKReverse: {
    id: 'iterativeKReverse',
    title: 'Iterative (Optimal Space)',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node reverseKGroup(Node head, int k) {
    if (head == null || k == 1) return head;

    Node dummy = new Node(0);
    dummy.next = head;
    Node prevGroupTail = dummy;
    Node curr = head;

    while (curr != null) {
        Node groupHead = curr;
        Node prev = null;
        int count = 0;

        // Reverse up to k nodes (or remainder)
        while (curr != null && count < k) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
            count++;
        }

        // Re-link reversed group into main list
        prevGroupTail.next = prev;
        groupHead.next = curr;
        
        // Update tail for next group
        prevGroupTail = groupHead;
    }
    return dummy.next;
}`,
    desc: "The O(1) space iterative solution. It reverses chunks of size 'k' exactly like a standard linked list reversal. By maintaining a 'prevGroupTail' pointer, we can seamlessly stitch the newly reversed chunks back into the continuous chain. It naturally reverses the remaining nodes at the end."
  },
  recursiveKReverse: {
    id: 'recursiveKReverse',
    title: 'Recursive Approach',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N/K)',
    code: `public Node reverseKGroupRec(Node head, int k) {
    if (head == null) return null;

    Node curr = head;
    Node prev = null;
    int count = 0;

    // 1. Reverse the first k nodes
    while (curr != null && count < k) {
        Node next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
        count++;
    }

    // 2. Recursively process remainder
    // 'head' is now the tail of this reversed group
    if (curr != null) {
        head.next = reverseKGroupRec(curr, k);
    }

    // 'prev' is the new head of this reversed group
    return prev;
}`,
    desc: "A highly concise recursive implementation. It reverses a chunk of 'k' nodes, then asks the recursive function to handle the rest of the list. The resulting sublist is attached to the tail of the current chunk. Costly in stack memory for very large lists."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|void|return|if|else|while|Node|null|reverseKGroup|reverseKGroupRec|head|curr|prev|next|data|new|int|count|k|dummy|prevGroupTail|groupHead)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-500`, text: `text-indigo-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'void', 'return', 'if', 'else', 'while', 'new', 'int'].includes(part);
            const isObject = ['Node'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'curr', 'prev', 'next', 'dummy', 'prevGroupTail', 'groupHead'].includes(part);
            const isVar = ['count', 'k'].includes(part);
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
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{isDummy ? 'Sentinel' : String(address)}</span>
            <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy ? '' : activeTheme.border} ${targetClasses} relative shadow-sm`}>
                <div className={`flex-1 flex justify-center font-mono font-black text-2xl ${isDummy ? 'text-slate-500' : activeTheme.text}`}>
                    {isDummy ? 'D' : String(val)}
                </div>
                <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl ${isDummy ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                    <span className={`text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90 ${isDummy ? 'text-slate-400' : ''}`}>NEXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function ReverseInKGroupViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('iterativeKReverse');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6, 7, 8');
  const [inputK, setInputK] = useState('3');
  const [baseList, setBaseList] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

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

  const parseList = (inputStr) => {
      const parts = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      let nodes = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              x: 180 + (i * 160),
              y: 100
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList(parseList(inputList));
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputList, inputK]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const recalculateLayout = (list, headId) => {
      let current = headId;
      let currentX = 20; // Start dummy at x=20
      let iterations = 0;
      
      const newLayout = list.map(n => ({...n}));
      
      while (current !== null && iterations < list.length) {
          const nodeIndex = newLayout.findIndex(n => n.id === current);
          if (nodeIndex !== -1) {
              newLayout[nodeIndex].x = currentX;
              currentX += 160;
              current = newLayout[nodeIndex].nextId;
          } else {
              break;
          }
          iterations++;
      }
      return newLayout;
  };

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter list values.', state: { list: [], headPtr: null, prevPtr: null, currPtr: null } }];
    
    let k = parseInt(inputK) || 3;
    if (k < 1) k = 1;

    let list = baseList.map(n => ({...n}));
    let dummy = { id: -1, val: 'D', addr: 'DUMMY', nextId: list.length > 0 ? list[0].id : null, x: 20, y: 100, isDummy: true };
    list.unshift(dummy);

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'iterativeKReverse') {
        let prevGroupTail = dummy.id;
        let curr = dummy.nextId;

        add("Initialize", `Set dummy node. 'prevGroupTail' points to dummy. k=${k}.`, 4, { curr, prevGroupTail });

        while (curr !== null) {
            let groupHead = curr;
            let prev = null;
            let count = 0;

            add("Group Start", `Processing a group of up to ${k} nodes starting at Node(${list.find(n=>n.id===curr)?.val}).`, 10, { curr, prev, groupHead, prevGroupTail });

            while (curr !== null && count < k) {
                let currNode = list.find(n => n.id === curr);
                let next = currNode.nextId;

                add("Reverse Edge", `Reversing pointer for Node(${currNode.val}).`, 15, { curr, prev, next, groupHead, prevGroupTail, count });

                currNode.nextId = prev;
                prev = curr;
                curr = next;
                count++;

                add("Advance Pointers", `Moved 'prev' and 'curr' forward. Count is ${count}/${k}.`, 19, { curr, prev, next, groupHead, prevGroupTail, count });
            }

            // Relink
            let pgtNode = list.find(n => n.id === prevGroupTail);
            pgtNode.nextId = prev; // prev is the new head of the reversed group
            
            let ghNode = list.find(n => n.id === groupHead);
            ghNode.nextId = curr; // groupHead is the new tail, connecting to next group

            add("Re-Link Group", `Connecting previous group tail to new group head, and new group tail to remainder.`, 23, { curr, prevGroupTail, groupHead });

            prevGroupTail = groupHead;
            
            list = recalculateLayout(list, dummy.id);
            add("Update Layout", `Memory sequence physically re-aligned.`, 27, { curr, prevGroupTail });
        }

        let finalSeq = list.filter(n=>!n.isDummy).map(n => n.val).join(' → ');
        add("Complete", "K-Group Reversal finished successfully.", 29, { isSuccess: true, finalSeq });

    } else if (selectedOpId === 'recursiveKReverse') {
        let callStack = [];
        
        const recurse = (headId, depth) => {
            callStack.push({ head: headId, depth });
            let hNode = list.find(n => n.id === headId);
            add("Recursive Call", `reverseKGroupRec called on Node(${hNode?.val ?? 'null'}). Depth: ${depth}`, 1, { curr: headId, callStack: [...callStack] });

            if (headId === null) {
                add("Base Case", "head is null, returning null up the stack.", 2, { curr: headId, callStack: [...callStack] });
                callStack.pop();
                return null;
            }

            let curr = headId;
            let prev = null;
            let count = 0;

            while (curr !== null && count < k) {
                let currNode = list.find(n => n.id === curr);
                let next = currNode.nextId;
                
                add("Reverse Edge", `Reversing Node(${currNode.val}).`, 10, { curr, prev, next, callStack: [...callStack] });
                
                currNode.nextId = prev;
                prev = curr;
                curr = next;
                count++;
            }

            let origHeadNode = list.find(n => n.id === headId);
            add("Recurse Remainder", `Group reversed. Pausing Depth ${depth} to reverse remainder starting at Node(${list.find(n=>n.id===curr)?.val ?? 'null'}).`, 18, { curr, prev, callStack: [...callStack] });

            let restHead = recurse(curr, depth + 1);

            origHeadNode.nextId = restHead;
            add("Link Result", `Resuming Depth ${depth}. Linked tail Node(${origHeadNode.val}) to returned sublist.`, 19, { curr: restHead, prev, callStack: [...callStack] });

            callStack.pop();
            return prev; // prev is the new head
        };

        let finalHeadId = recurse(list.find(n=>!n.isDummy).id, 1);
        dummy.nextId = finalHeadId;
        
        list = recalculateLayout(list, dummy.id);
        
        let finalSeq = list.filter(n=>!n.isDummy).map(n => n.val).join(' → ');
        add("Complete", "All stack frames resolved. Final memory layout updated.", 23, { isSuccess: true, finalSeq, callStack: [] });
    }

    return steps;
  }, [baseList, inputK, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    return (st.list || []).map((node) => {
        if (node.nextId === null || node.nextId === undefined) return null;
        const target = st.list.find((n) => n.id === node.nextId);
        if (!target) return null;
        
        const startX = node.x + 104; 
        const startY = node.y + 28;
        const endX = target.x - 6; 
        const endY = target.y + 28;
        
        let strokeColor = '#cbd5e1';
        let strokeWidth = 2;
        let isJump = false;

        // Visual logic to handle arrows that point backward during the reversal process
        if (target.x < node.x) {
            isJump = true;
            strokeColor = '#f43f5e'; // rose-500
            strokeWidth = 3;
        } else if (target.x > node.x + 200) {
            isJump = true;
            strokeColor = '#10b981'; // emerald-500
            strokeWidth = 3;
        }

        const pathD = isJump 
            ? `M ${startX},${startY} C ${startX + 40},${startY + 90} ${endX - 40},${endY + 90} ${endX},${endY}`
            : `M ${startX},${startY} C ${startX + 20},${startY} ${endX - 20},${endY} ${endX},${endY}`;
            
        return <path key={`link-${String(node.addr)}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd="url(#arrowhead-default)" className="transition-all duration-500" />;
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <RefreshCw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reverse in K-Groups</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Chunk Reversal
                  </span>
                  <span>•</span>
                  <span>Remainder Included</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Repeat size={28}/> Chunk Traversal</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Reverse the nodes of a linked list $k$ at a time and return its modified list. If the number of nodes is not a multiple of $k$, the remaining left-out nodes at the end <strong>must also be reversed</strong>.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input (k = 3):</span>
                       1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 <br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">3 → 2 → 1</span> → <span className="text-sky-300">6 → 5 → 4</span> → <span className="text-fuchsia-300">8 → 7</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Key Observation</h4>
                        <p className="text-sm leading-relaxed">This is an extension of standard list reversal. We perform the standard 3-pointer reverse (prev, curr, next) but artificially break out of the loop after $k$ steps. We then meticulously re-attach the boundaries.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Remaining Nodes</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Standard Leetcode problems usually ask to leave the remainder <em>un-reversed</em>. This prompt specifies that the remainder <strong>must</strong> be reversed. This actually simplifies our loop condition!</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> GroupReverse.java</span>
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
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-[2] space-y-1.5 w-full">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Target List</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex-[1] space-y-1.5 w-full">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">Chunk Size (k)</label>
                            <input type="number" min="1" max="10" value={inputK} onChange={(e) => setInputK(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 justify-end mt-2 pt-4 border-t border-slate-100">
                        <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={20}/></button>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={20}/></button>
                        <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <span>Line {String(curStepData.line || 0)}</span>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">K-Group Reversal fully realized.</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
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

                   {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none backdrop-blur-sm">
                            <div className="bg-[#0f172a] border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500 pointer-events-auto max-w-md w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={32}/></div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 text-white">REVERSED LIST</h2>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 font-mono text-emerald-400 text-lg font-bold break-all mb-6 shadow-inner tracking-tighter">
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
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           
                           {/* Recursive Call Stack Indicator */}
                           {selectedOpId === 'recursiveKReverse' && st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-6 top-24 bg-slate-800/90 border border-slate-700 rounded-xl p-4 w-40 flex flex-col shadow-xl z-50 backdrop-blur-md">
                                   <span className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-2"><Layers size={12}/> Stack</span>
                                   <div className="flex flex-col-reverse gap-1 text-[10px] font-mono text-slate-300">
                                       {st.callStack.map((frame, i) => (
                                           <div key={i} className={`px-2 py-1 rounded ${i === st.callStack.length - 1 ? 'bg-fuchsia-600 text-white' : 'bg-slate-700/50'}`}>
                                               Frame D{frame.depth}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isPrev = st.prev === nodeObj.id;
                              const isNext = st.next === nodeObj.id;
                              const isPgt = st.prevGroupTail === nodeObj.id;
                              const isGh = st.groupHead === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isCurr) themeColor = 'indigo';
                              else if (isPrev) themeColor = 'amber';
                              else if (isGh) themeColor = 'fuchsia';
                              
                              const isTarget = isCurr || isPrev || isNext || isPgt || isGh;

                              const lbls = [];
                              if (isPgt) lbls.push({ text: "prevTail", color: "emerald", pos: "top" });
                              if (isGh) lbls.push({ text: "grpHead", color: "fuchsia", pos: "top" });
                              if (isPrev) lbls.push({ text: "prev", color: "amber", pos: "bottom" });
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isNext) lbls.push({ text: "next", color: "rose", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
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
                        <p>Standard linked list reversal flips the entire chain. K-Group reversal applies this logic locally.</p>
                        <p>We use a standard <code>curr.next = prev</code> loop, but bounded by a <code>count &lt; k</code> condition. The real trick is managing the boundaries: the node immediately preceding the group (<code>prevGroupTail</code>) must be updated to point to the new start of the group, and the former start of the group must be prepared to connect to the next chunk.</p>
                        <p>If we reach the end of the list and <code>count</code> hasn't reached $k$, the inner loop safely terminates, leaving the remainder natively reversed as required by the prompt.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Cracking K-Group Reversal</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is notoriously one of the most bug-prone Linked List questions in interviews. The key to surviving is creating a clean abstraction: write a helper function that reverses exactly K nodes, and keep the main loop focused on re-linking the segments."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Read the Prompt Carefully:</strong> Does the interviewer want the remainder reversed or un-reversed? If <em>un-reversed</em>, you must count the nodes first before entering the reversal logic to ensure there are at least $k$ nodes left!</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Dummy Node:</strong> Always use a dummy head node. It saves you from writing messy edge-case logic for the very first chunk.</div></li>
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
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0"><defs><marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker></defs>{renderSvgArrows()}</svg>
                           
                           {selectedOpId === 'recursiveKReverse' && st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-6 top-10 bg-slate-800/90 border border-slate-700 rounded-xl p-4 w-40 flex flex-col shadow-xl z-50 backdrop-blur-md">
                                   <span className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-2"><Layers size={12}/> Stack</span>
                                   <div className="flex flex-col-reverse gap-1 text-[10px] font-mono text-slate-300">
                                       {st.callStack.map((frame, i) => (
                                           <div key={i} className={`px-2 py-1 rounded ${i === st.callStack.length - 1 ? 'bg-fuchsia-600 text-white' : 'bg-slate-700/50'}`}>
                                               Frame D{frame.depth}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj) => {
                              const isCurr = st.curr === nodeObj.id; 
                              const isPrev = st.prev === nodeObj.id;
                              const isNext = st.next === nodeObj.id;
                              const isPgt = st.prevGroupTail === nodeObj.id;
                              const isGh = st.groupHead === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : 'slate';
                              if (isCurr) themeColor = 'indigo';
                              else if (isPrev) themeColor = 'amber';
                              else if (isGh) themeColor = 'fuchsia';
                              
                              const isTarget = isCurr || isPrev || isNext || isPgt || isGh;

                              const lbls = [];
                              if (isPgt) lbls.push({ text: "prevTail", color: "emerald", pos: "top" });
                              if (isGh) lbls.push({ text: "grpHead", color: "fuchsia", pos: "top" });
                              if (isPrev) lbls.push({ text: "prev", color: "amber", pos: "bottom" });
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isNext) lbls.push({ text: "next", color: "rose", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-white text-center">REVERSAL COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Memory chunks flipped in groups of {inputK}</p>
                                <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter text-center">
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
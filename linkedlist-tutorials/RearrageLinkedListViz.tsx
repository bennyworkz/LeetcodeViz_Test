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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalRearrange: {
    id: 'optimalRearrange',
    title: 'Reverse & Merge (Optimal)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void rearrange(Node head) {
    if (head == null || head.next == null) return;

    // 1. Find the middle
    Node slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // 2. Reverse the second half
    Node prev = null;
    Node curr = slow.next;
    slow.next = null; // Split lists
    while (curr != null) {
        Node next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    // 3. Merge alternating nodes
    Node first = head;
    Node second = prev;
    while (second != null) {
        Node t1 = first.next;
        Node t2 = second.next;
        
        first.next = second;
        second.next = t1;
        
        first = t1;
        second = t2;
    }
}`,
    desc: "The optimal O(N) solution. We first locate the middle of the list using Slow and Fast pointers. Then, we split the list and reverse the entire second half. Finally, we interleave the first half and the reversed second half node-by-node."
  },
  naiveRearrange: {
    id: 'naiveRearrange',
    title: 'Nested Loops (Naive)',
    icon: <Repeat size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `public void rearrangeNaive(Node head) {
    if (head == null || head.next == null) return;

    Node curr = head;

    // For every node in the first half
    while (curr.next != null && curr.next.next != null) {
        // Find the last node and second-to-last node
        Node prev = curr;
        while (prev.next.next != null) {
            prev = prev.next;
        }
        
        Node last = prev.next;
        
        // Detach last node
        prev.next = null;
        
        // Insert last node right after curr
        last.next = curr.next;
        curr.next = last;
        
        // Advance curr by two (past the newly inserted node)
        curr = last.next;
    }
}`,
    desc: "A brute-force O(N²) approach. For every current node, it scans the entire remaining list to find the very last node, detaches it, and inserts it immediately after the current node. It then advances and repeats. Extremely slow for large lists."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|void|return|if|else|while|Node|null|rearrange|rearrangeNaive|head|slow|fast|curr|prev|next|first|second|t1|t2|last)\b|\b\d+\b)/g).filter(Boolean);
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
            const isPointer = ['head', 'slow', 'fast', 'curr', 'prev', 'next', 'first', 'second', 't1', 't2', 'last'].includes(part);
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
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-105` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{String(address)}</span>
            <div className={`flex items-center w-24 h-14 border-2 rounded-2xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl border-b border-black/10 ${activeTheme.text}`}>
                    {String(val)}
                </div>
                <div className={`w-8 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-slate-200 bg-slate-50`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90`}>NXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function RearrageLinkedListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalRearrange');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6, 7');
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
      const parts = inputStr.split(',').map(s => s.trim()).filter(Boolean);
      let nodes = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: i,
              val: parts[i],
              addr: '0x' + (100 + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? i + 1 : null,
              x: 60 + (i * 140),
              y: 100,
              listId: 'ORIGINAL'
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
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const recalculateSplitLayout = (list, head1, head2) => {
      const newLayout = list.map(n => ({...n}));
      
      // List 1 Line (y=100)
      let curr = head1;
      let cx = 60;
      while (curr !== null) {
          let nodeIndex = newLayout.findIndex(n => n.id === curr);
          if (nodeIndex !== -1) {
              newLayout[nodeIndex].x = cx;
              newLayout[nodeIndex].y = 100;
              cx += 140;
              curr = newLayout[nodeIndex].nextId;
          } else break;
      }

      // List 2 Line (y=260)
      curr = head2;
      cx = 60;
      while (curr !== null) {
          let nodeIndex = newLayout.findIndex(n => n.id === curr);
          if (nodeIndex !== -1) {
              newLayout[nodeIndex].x = cx;
              newLayout[nodeIndex].y = 260;
              cx += 140;
              curr = newLayout[nodeIndex].nextId;
          } else break;
      }

      return newLayout;
  };

  const recalculateMergedLayout = (list, headId) => {
      const newLayout = list.map(n => ({...n}));
      
      let curr = headId;
      let cx = 60;
      while (curr !== null) {
          let nodeIndex = newLayout.findIndex(n => n.id === curr);
          if (nodeIndex !== -1) {
              newLayout[nodeIndex].x = cx;
              newLayout[nodeIndex].y = 100; // Bring everything back to main row
              cx += 140;
              curr = newLayout[nodeIndex].nextId;
          } else break;
      }

      return newLayout;
  };

  const trace = useMemo(() => {
    const steps = [];
    if (baseList.length === 0) return [{ phase: 'Init', description: 'Enter list values.', state: { list: [] } }];
    
    let list = baseList.map(n => ({...n}));
    let headId = list[0].id;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'optimalRearrange') {
        // Phase 1: Fast/Slow Pointer
        let slow = headId;
        let fast = headId;

        add("Phase 1: Find Middle", "Initialize slow and fast pointers to head.", 4, { slow, fast });

        while (fast !== null) {
            let fastNode = list.find(n => n.id === fast);
            if (fastNode.nextId == null || list.find(n=>n.id===fastNode.nextId).nextId == null) break;

            add("Advance Pointers", "Move fast by 2, slow by 1.", 6, { slow, fast });
            
            slow = list.find(n => n.id === slow).nextId;
            fast = list.find(n => n.id === list.find(m => m.id === fast).nextId).nextId;

            add("Pointers Moved", "Fast is 2x faster, so slow will land on the middle node.", 7, { slow, fast });
        }

        // Phase 2: Reverse Second Half
        let prev = null;
        let curr = list.find(n => n.id === slow).nextId;
        let secondHalfHeadOriginal = curr;
        
        list.find(n => n.id === slow).nextId = null; // Split
        
        add("Phase 2: Split Lists", "Cut the list in half. We will now reverse the second half.", 13, { slow, curr, prev });

        list = recalculateSplitLayout(list, headId, curr);
        add("Layout Updated", "Physically separated lists for clarity.", 13, { slow, curr, prev });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let nextId = currNode.nextId;
            
            add("Reverse 2nd Half", `Reversing pointer of Node(${currNode.val}).`, 16, { curr, prev, next: nextId, isReversing: true });
            
            currNode.nextId = prev;
            prev = curr;
            curr = nextId;
        }

        // Relayout after reverse to show it left-to-right correctly
        list = recalculateSplitLayout(list, headId, prev);
        
        let first = headId;
        let second = prev;

        add("Phase 3: Merge", "Second half fully reversed. Starting zig-zag merge of the two halves.", 23, { first, second });

        // Phase 3: Zig-Zag Merge
        while (second !== null) {
            let firstNode = list.find(n => n.id === first);
            let secondNode = list.find(n => n.id === second);
            
            let t1 = firstNode.nextId;
            let t2 = secondNode.nextId;

            add("Save Nexts", `Save t1=${t1 !== null ? list.find(n=>n.id===t1).val : 'null'}, t2=${t2 !== null ? list.find(n=>n.id===t2).val : 'null'}`, 26, { first, second, t1, t2 });

            firstNode.nextId = second;
            add("Link First to Second", `first.next = second;`, 29, { first, second, t1, t2 });

            secondNode.nextId = t1;
            add("Link Second to t1", `second.next = t1;`, 30, { first, second, t1, t2 });

            first = t1;
            second = t2;
            
            // Relayout incrementally to show it zipping up
            list = recalculateMergedLayout(list, headId);
            add("Advance Mergers", "Moved first and second pointers forward.", 32, { first, second, t1, t2 });
        }

        add("Complete", "O(N) space rearrangement successfully concluded.", 35, { isSuccess: true });

    } else if (selectedOpId === 'naiveRearrange') {
        let curr = headId;
        add("Initialize", "Start Naive Nested Loop approach.", 4, { curr });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            if (currNode.nextId == null || list.find(n=>n.id===currNode.nextId).nextId == null) {
                 add("End Condition", "Reached end or only 1 node remains. Terminating.", 7, { curr });
                 break;
            }

            add("Inner Loop Init", `curr is Node(${currNode.val}). Scanning for the very last node.`, 9, { curr });

            let prev = curr;
            while (true) {
                let prevNode = list.find(n => n.id === prev);
                if (prevNode.nextId == null || list.find(n=>n.id===prevNode.nextId).nextId == null) break;
                prev = prevNode.nextId;
                add("Scanning...", `Traversing to find last node. prev is Node(${list.find(n=>n.id===prev).val}).`, 11, { curr, prev });
            }

            let prevNode = list.find(n => n.id === prev);
            let lastId = prevNode.nextId;
            let lastNode = list.find(n => n.id === lastId);

            add("Found Last", `Found last node: Node(${lastNode.val}). Detaching it.`, 14, { curr, prev, last: lastId });

            prevNode.nextId = null; // Detach last

            add("Detach", `prev.next = null;`, 17, { curr, prev, last: lastId });

            lastNode.nextId = currNode.nextId;
            currNode.nextId = lastId;

            add("Insert Last", `Inserted Node(${lastNode.val}) immediately after curr Node(${currNode.val}).`, 21, { curr, last: lastId });

            list = recalculateMergedLayout(list, headId);
            add("Layout Updated", `Memory sequence physically re-aligned.`, 21, { curr, last: lastId });

            curr = lastNode.nextId;
            add("Advance Curr", `Advanced curr by 2 spots (past the newly inserted node).`, 24, { curr });
        }

        add("Complete", "O(N^2) naive rearrangement concluded.", 26, { isSuccess: true });
    }

    // Extract final sequence securely
    let finalSeq = [];
    if (steps.length > 0) {
        let finalState = steps[steps.length - 1].state;
        let fList = finalState.list;
        let c = headId;
        while(c != null) {
            let n = fList.find(x => x.id === c);
            if (n) {
                finalSeq.push(String(n.val));
                c = n.nextId;
            } else break;
        }
        steps[steps.length-1].state.finalSeq = finalSeq.join(' → ');
    }

    return steps;
  }, [baseList, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows = [];
    (st.list || []).forEach((node) => {
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = st.list.find((n) => n.id === node.nextId);
            if (target) {
                const startX = node.x + 92; 
                const startY = node.y + 28;
                const endX = target.x - 6; 
                const endY = target.y + 28;
                
                let strokeColor = '#cbd5e1'; // slate-300
                let strokeWidth = 2;
                
                let pathD = '';
                
                if (target.y !== node.y) {
                    // Inter-row merge link
                    strokeColor = '#c084fc'; // fuchsia
                    strokeWidth = 3;
                    pathD = `M ${startX},${startY} C ${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
                } else if (target.x < node.x) {
                    // Backward Arrow (Reversing)
                    strokeColor = '#f43f5e'; // rose
                    pathD = `M ${node.x - 6},${startY} C ${node.x - 40},${startY - 60} ${target.x + 104 + 40},${endY - 60} ${target.x + 104},${endY}`;
                } else if (target.x > node.x + 160) {
                    // Jumping forward over nodes (during Naive approach)
                    strokeColor = '#10b981'; // emerald
                    pathD = `M ${startX},${startY} C ${startX + 30},${startY + 50} ${endX - 30},${endY + 50} ${endX},${endY}`;
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
                <Combine className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rearrange Linked List</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      In-Place Alternation
                  </span>
                  <span>•</span>
                  <span>L0 → Ln → L1 → Ln-1</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Combine size={28}/> The Folding Sequence</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Rearrange a singly linked list such that the last element is inserted after the first, the second-to-last is inserted after the second, and so on. You must do this <strong>in-place</strong> without altering the actual node values.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input:</span>
                       1 → 2 → 3 → 4 → 5 → 6 → 7<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">1 → 7 → 2 → 6 → 3 → 5 → 4</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Naive Trap</h4>
                        <p className="text-sm leading-relaxed">The naive approach runs in O(N²) time because it scans the entire remaining list to find the <em>current</em> last element during every single step of the outer loop.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Optimal Solution</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The optimal O(N) strategy splits the problem into three classic operations: <strong>Find Middle</strong>, <strong>Reverse List</strong>, and <strong>Merge Lists</strong>.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Rearrange.java</span>
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
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Input List</label>
                            <input type="text" value={inputList} onChange={(e) => setInputList(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
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
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Analysis</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">List fully rearranged.</p>
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

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                                  <marker id="arrowhead-f43f5e" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /></marker>
                                  <marker id="arrowhead-10b981" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" /></marker>
                                  <marker id="arrowhead-c084fc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {(st.list || []).map((nodeObj) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isPrev = st.prev === nodeObj.id;
                              const isFirst = st.first === nodeObj.id;
                              const isSecond = st.second === nodeObj.id;
                              const isT1 = st.t1 === nodeObj.id;
                              const isT2 = st.t2 === nodeObj.id;
                              const isLast = st.last === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isSlow || isFirst) themeColor = 'emerald';
                              if (isFast || isSecond || isLast) themeColor = 'sky';
                              if (isCurr) themeColor = 'indigo';
                              if (isPrev) themeColor = 'amber';
                              
                              const isTarget = isSlow || isFast || isCurr || isPrev || isFirst || isSecond || isT1 || isT2 || isLast;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "emerald", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "sky", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isPrev) lbls.push({ text: "prev", color: "amber", pos: "top" });
                              if (isFirst) lbls.push({ text: "first", color: "emerald", pos: "top" });
                              if (isSecond) lbls.push({ text: "second", color: "sky", pos: "bottom" });
                              if (isT1) lbls.push({ text: "t1", color: "fuchsia", pos: "top" });
                              if (isT2) lbls.push({ text: "t2", color: "fuchsia", pos: "bottom" });
                              if (isLast) lbls.push({ text: "last", color: "rose", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The 3 Phases</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. Find the Middle:</strong> Using Tortoise and Hare (Slow and Fast pointers), we can find the exact middle of the list in $O(N)$ time. We then sever the <code>next</code> pointer of the middle node to physically separate the two halves.</p>
                        <p><strong>2. Reverse the Second Half:</strong> The problem asks to insert elements from the back of the list. A standard linked list only goes forward. By reversing the second half, the "last" element becomes the "first" element of this new sublist, making it $O(1)$ to access.</p>
                        <p><strong>3. Zig-Zag Merge:</strong> We now have two independent lists. We simply take one node from the first list, point it to one node from the second list, point that to the next node in the first list, and so on until the second list is empty.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering the Rearrange</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a 'Composite Problem'. It tests if you know three standard Linked List techniques: Slow/Fast pointer, List Reversal, and List Merging. If you have those three memorized, you just glue them together."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Splitting the List:</strong> Do not forget to set <code>slow.next = null</code> after finding the middle. If you leave them connected, the merge phase will trigger an infinite loop.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Temporary Pointers:</strong> During the merge phase, you must save <code>first.next</code> and <code>second.next</code> into temporary variables before rewiring the pointers, otherwise you lose the rest of the list.</div></li>
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
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /></marker>
                                  <marker id="arrowhead-f43f5e-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /></marker>
                                  <marker id="arrowhead-10b981-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" /></marker>
                                  <marker id="arrowhead-c084fc-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              const isCurr = st.curr === nodeObj.id;
                              const isPrev = st.prev === nodeObj.id;
                              const isFirst = st.first === nodeObj.id;
                              const isSecond = st.second === nodeObj.id;
                              const isT1 = st.t1 === nodeObj.id;
                              const isT2 = st.t2 === nodeObj.id;
                              const isLast = st.last === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isSlow || isFirst) themeColor = 'emerald';
                              if (isFast || isSecond || isLast) themeColor = 'sky';
                              if (isCurr) themeColor = 'indigo';
                              if (isPrev) themeColor = 'amber';
                              
                              const isTarget = isSlow || isFast || isCurr || isPrev || isFirst || isSecond || isT1 || isT2 || isLast;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "emerald", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "sky", pos: "top" });
                              if (isCurr) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isPrev) lbls.push({ text: "prev", color: "amber", pos: "top" });
                              if (isFirst) lbls.push({ text: "first", color: "emerald", pos: "top" });
                              if (isSecond) lbls.push({ text: "second", color: "sky", pos: "bottom" });
                              if (isT1) lbls.push({ text: "t1", color: "fuchsia", pos: "top" });
                              if (isT2) lbls.push({ text: "t2", color: "fuchsia", pos: "bottom" });
                              if (isLast) lbls.push({ text: "last", color: "rose", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
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
                            <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">REARRANGEMENT COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">List successfully folded in place</p>
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
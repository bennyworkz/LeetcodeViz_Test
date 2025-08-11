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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalReorder: {
    id: 'optimalReorder',
    title: '3-Phase In-Place (Optimal)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void reorderList(Node head) {
    if (head == null || head.next == null) return;

    // Phase 1: Find the middle of the linked list
    Node slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Phase 2: Reverse the second half
    Node prev = null, curr = slow.next;
    slow.next = null; // Sever the first half from the second
    
    while (curr != null) {
        Node nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }

    // Phase 3: Merge the two halves alternately
    Node first = head, second = prev;
    while (second != null) {
        Node tmp1 = first.next;
        Node tmp2 = second.next;
        
        first.next = second;
        second.next = tmp1;
        
        first = tmp1;
        second = tmp2;
    }
}`,
    desc: "The classic O(1) space solution breaks the problem into three standard linked list operations. First, we use Floyd's Tortoise and Hare to find the midpoint. We sever the list in two. Next, we reverse the second half in-place. Finally, we take one node from the first half, one from the reversed second half, and interleave them together."
  },
  stackApproach: {
    id: 'stackApproach',
    title: 'Stack/Array Approach',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public void reorderListStack(Node head) {
    if (head == null || head.next == null) return;
    
    // 1. Push all nodes into a stack or list for O(1) back access
    List<Node> list = new ArrayList<>();
    Node curr = head;
    while (curr != null) {
        list.add(curr);
        curr = curr.next;
    }
    
    // 2. Use two pointers moving from outside inwards
    int i = 0, j = list.size() - 1;
    while (i < j) {
        list.get(i).next = list.get(j);
        i++;
        
        if (i == j) break; // Avoid self-loop on middle element
        
        list.get(j).next = list.get(i);
        j--;
    }
    
    // 3. Null-terminate the last node to prevent cycles
    list.get(i).next = null;
}`,
    desc: "A naive but intuitive approach. Since a singly linked list can't be traversed backwards, we copy all the node references into an Array or Stack. This allows us to access the 'tail' in O(1) time. We then simply set pointers moving from the outside-in using indices i and j. Requires O(N) auxiliary space."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|reorderList|reorderListStack|head|slow|fast|curr|prev|nextTemp|first|second|tmp1|tmp2|list|ArrayList|add|size|get|new|next)\b|\b\d+\b)/g).filter(Boolean);
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
            const isObject = ['Node', 'List', 'ArrayList'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['head', 'slow', 'fast', 'curr', 'prev', 'nextTemp', 'first', 'second', 'tmp1', 'tmp2', 'next'].includes(part);
            const isVar = ['i', 'j'].includes(part);
            const isMethod = ['add', 'size', 'get'].includes(part);
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
  originPhase?: number; // 1 for first half, 2 for second half
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget }) => {
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
        </div>
    );
};

// --- Main Application ---

export default function ReorderListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalReorder');
  
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6');
  
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
              originPhase: 1 // Default to first half color
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

  const recalculateSplitLayout = (list: ListNodeData[], head1Id: number | null, head2Id: number | null) => {
      const newLayout = list.map(n => ({...n}));
      
      let x = 60;
      let curr = head1Id;
      let failsafe = 0;
      while (curr !== null && failsafe < list.length) {
          let idx = newLayout.findIndex(n => n.id === curr);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 100; // Top row
              x += 120;
              curr = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }

      x = 60;
      curr = head2Id;
      failsafe = 0;
      while (curr !== null && failsafe < list.length) {
          let idx = newLayout.findIndex(n => n.id === curr);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 260; // Bottom row
              x += 120;
              curr = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }
      return newLayout;
  };

  const recalculateMergedLayout = (list: ListNodeData[], headId: number | null) => {
      const newLayout = list.map(n => ({...n}));
      let x = 60;
      let curr = headId;
      let failsafe = 0;
      while (curr !== null && failsafe < list.length) {
          let idx = newLayout.findIndex(n => n.id === curr);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 100; // Single row
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

    if (selectedOpId === 'optimalReorder') {
        if (list.length <= 2) {
             add("Base Case", "List is too small to reorder. Returning.", 2, { isSuccess: true });
             return steps;
        }

        // --- Phase 1: Find Middle ---
        let slow = headId;
        let fast = headId;

        add("Phase 1: Find Middle", `Initialize slow and fast pointers to head.`, 5, { slow, fast });

        while (fast !== null) {
            let fastNode = list.find(n => n.id === fast);
            if (!fastNode || fastNode.nextId === null || list.find(n => n.id === fastNode.nextId)?.nextId === null) {
                add("Middle Found", `Fast pointer reached the end. Slow pointer is at the middle.`, 6, { slow, fast });
                break;
            }
            
            let slowNode = list.find(n => n.id === slow);
            slow = slowNode?.nextId ?? null;
            fast = list.find(n => n.id === fastNode!.nextId)?.nextId ?? null;

            add("Advance", `slow = slow.next; fast = fast.next.next;`, 8, { slow, fast });
        }

        // --- Phase 2: Reverse Second Half ---
        let prev = null;
        let slowNode = list.find(n => n.id === slow);
        let curr = slowNode?.nextId ?? null;
        
        if (slowNode) slowNode.nextId = null; // Sever list

        // Color coding origin phases
        let tempColorCurr = curr;
        while(tempColorCurr !== null) {
            let tcNode = list.find(n => n.id === tempColorCurr);
            if (tcNode) {
                tcNode.originPhase = 2; // Sky blue
                tempColorCurr = tcNode.nextId;
            } else break;
        }

        list = recalculateSplitLayout(list, headId, curr);
        add("Phase 2: Split & Reverse", `Severed list at slow.next = null. Preparing to reverse second half.`, 12, { slow, prev, curr, isSplit: true });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            let nextTemp = currNode?.nextId ?? null;
            
            add("Identify nextTemp", `Node nextTemp = curr.next;`, 16, { slow, prev, curr, nextTemp, isReversing: true });
            
            if (currNode) currNode.nextId = prev;
            prev = curr;
            curr = nextTemp;

            list = recalculateSplitLayout(list, headId, prev); // Keep second row visually aligned as it builds backwards
            add("Reverse & Advance", `curr.next = prev; prev = curr; curr = nextTemp;`, 19, { slow, prev, curr, nextTemp, isReversing: true });
        }

        // Relayout one final time for Phase 2 end to ensure it's left-aligned beautifully
        let h2 = prev; // Head of reversed second half
        list = recalculateSplitLayout(list, headId, h2);
        
        // --- Phase 3: Merge Halves ---
        let first = headId;
        let second = prev;

        add("Phase 3: Merge", `Second half fully reversed. Starting alternating zip merge.`, 23, { first, second });

        while (second !== null) {
            let firstNode = list.find(n => n.id === first);
            let secondNode = list.find(n => n.id === second);
            
            let tmp1 = firstNode?.nextId ?? null;
            let tmp2 = secondNode?.nextId ?? null;

            add("Save Next Pointers", `tmp1 = first.next; tmp2 = second.next;`, 26, { first, second, tmp1, tmp2, isMerging: true });

            if (firstNode) firstNode.nextId = second;
            add("Zip L1 -> L2", `first.next = second;`, 28, { first, second, tmp1, tmp2, isMerging: true });

            if (secondNode) secondNode.nextId = tmp1;
            add("Zip L2 -> L1", `second.next = tmp1;`, 29, { first, second, tmp1, tmp2, isMerging: true });

            first = tmp1;
            second = tmp2;

            list = recalculateMergedLayout(list, headId); // Snap nodes back into single row sequentially
            add("Advance", `first = tmp1; second = tmp2;`, 32, { first, second, tmp1, tmp2, isMerging: true });
        }

        let finalSeq = [];
        let c = headId;
        while(c != null) {
            let n = list.find(x => x.id === c);
            if (n) { finalSeq.push(n.val); c = n.nextId; } else break;
        }

        add("Complete", `List successfully reordered in O(N) Time and O(1) Space.`, 35, { isSuccess: true, finalSeq: finalSeq.join(' → ') });

    } else if (selectedOpId === 'stackApproach') {
        if (list.length <= 2) {
             add("Base Case", "List is too small to reorder. Returning.", 2, { isSuccess: true });
             return steps;
        }

        let arr: number[] = [];
        let curr: number | null = headId;
        
        add("Initialize List/Stack", `List<Node> list = new ArrayList<>();`, 5, { curr, arr: [...arr] });

        while (curr !== null) {
            let currNode = list.find(n => n.id === curr);
            if (curr !== null) arr.push(curr);
            curr = currNode?.nextId ?? null;
            add("Store References", `list.add(curr); Traversed list to collect all node references in O(N) space.`, 8, { curr, arr: [...arr] });
        }

        let i = 0;
        let j = arr.length - 1;

        add("Setup Pointers", `int i = 0, j = list.size() - 1; Pointers set at ends of the array.`, 12, { i, j, arr: [...arr] });

        while (i < j) {
            let leftNodeId = arr[i];
            let rightNodeId = arr[j];
            
            let leftNode = list.find(n => n.id === leftNodeId);
            let rightNode = list.find(n => n.id === rightNodeId);
            
            // For visual coloring
            if (rightNode) rightNode.originPhase = 2; 

            add("Compare Boundaries", `Looping while i < j (${i} < ${j}).`, 13, { i, j, arr: [...arr], isMerging: true, currI: leftNodeId, currJ: rightNodeId });

            if (leftNode) leftNode.nextId = rightNodeId;
            i++;
            
            list = recalculateMergedLayout(list, headId);
            add("Link i -> j", `list.get(i).next = list.get(j); i++;`, 15, { i, j, arr: [...arr], isMerging: true, currI: leftNodeId, currJ: rightNodeId });

            if (i === j) {
                add("Middle Reached", `i == j (${i} == ${j}). Break to avoid self-loop.`, 17, { i, j, arr: [...arr], isMerging: true });
                break;
            }

            let newLeftId = arr[i];
            if (rightNode) rightNode.nextId = newLeftId;
            j--;

            list = recalculateMergedLayout(list, headId);
            add("Link j -> i", `list.get(j).next = list.get(i); j--;`, 20, { i, j, arr: [...arr], isMerging: true, currI: newLeftId, currJ: rightNodeId });
        }

        let finalNodeId = arr[i];
        let finalNode = list.find(n => n.id === finalNodeId);
        if (finalNode) finalNode.nextId = null;
        
        list = recalculateMergedLayout(list, headId);
        add("Null Terminate", `list.get(i).next = null; Clean up the tail to prevent cycles.`, 24, { i, j, arr: [...arr], isMerging: true, currI: finalNodeId });

        let finalSeq = [];
        let c = headId;
        while(c != null) {
            let n = list.find(x => x.id === c);
            if (n) { finalSeq.push(n.val); c = n.nextId; } else break;
        }

        add("Complete", `List successfully reordered using O(N) Space.`, 25, { isSuccess: true, finalSeq: finalSeq.join(' → ') });
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

                if (target.y !== node.y) {
                    // Cross-row linking during merge phase
                    strokeColor = '#c084fc'; // fuchsia-400
                    strokeWidth = 3;
                    pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
                } else if (target.x < node.x) {
                    // Backward Arrow (During reversal)
                    strokeColor = '#f43f5e'; // rose-500
                    strokeWidth = 3;
                    pathD = `M ${node.x - 6},${startY} C ${node.x - 40},${startY - 50} ${target.x + 80 + 40},${endY - 50} ${target.x + 80},${endY}`;
                } else if (target.x > node.x + 140) {
                    // Jumping forward over nodes (During array approach linking)
                    strokeColor = '#10b981'; // emerald
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
                <Shuffle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reorder List</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      In-Place Fold
                  </span>
                  <span>•</span>
                  <span>LeetCode 143</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Shuffle size={28}/> The Folding Sequence</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      You are given the head of a singly linked-list. The list can be represented as: <br/>
                      <code className="bg-slate-100 px-2 py-1 rounded">L0 → L1 → … → Ln - 1 → Ln</code> <br/>
                      Reorder the list to be on the following form: <br/>
                      <code className="bg-slate-100 px-2 py-1 rounded">L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …</code> <br/>
                      You may not modify the values in the list's nodes. Only nodes themselves may be changed.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: head = [1,2,3,4,5]</span>
                       1 → 2 → 3 → 4 → 5<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">1 → 5 → 2 → 4 → 3</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">It's easy to solve this using $O(N)$ extra space by storing node references in an array. The challenge is doing it <strong>in-place</strong> using exactly $O(1)$ extra space.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> 3-Phase Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The optimal $O(1)$ space solution breaks the problem down into three classic linked list operations: (1) Find the Middle, (2) Reverse the Second Half, (3) Merge two lists alternately.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> ReorderList.java</span>
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
                        <div className="flex-1 w-full space-y-1.5">
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">List successfully folded in place.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Linked List Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {/* ArrayList Helper View */}
                   {selectedOpId === 'stackApproach' && st.arr && (
                       <div className="absolute left-10 bottom-10 z-30 pointer-events-none flex flex-col gap-2">
                           <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest font-mono bg-sky-50 px-3 py-1 rounded shadow-sm border border-sky-200 w-max">ArrayList Memory O(N)</span>
                           <div className="flex gap-2 bg-white/80 backdrop-blur p-2 rounded-xl border border-slate-200 shadow-xl max-w-sm overflow-x-auto">
                               {st.arr.length === 0 ? <span className="text-xs text-slate-400 italic px-2">Empty...</span> : null}
                               {st.arr.map((nid: number, idx: number) => {
                                   let isI = st.i === idx;
                                   let isJ = st.j === idx;
                                   return (
                                       <div key={idx} className="flex flex-col items-center">
                                           <span className="text-[8px] font-bold text-slate-400">{idx}</span>
                                           <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-xs ${isI ? 'bg-emerald-500 text-white' : isJ ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                                               {st.list.find((n:any)=>n.id===nid)?.val}
                                           </div>
                                           {isI && <span className="text-[8px] font-black text-emerald-600 mt-0.5">i</span>}
                                           {isJ && <span className="text-[8px] font-black text-sky-600 mt-0.5">j</span>}
                                       </div>
                                   );
                               })}
                           </div>
                       </div>
                   )}

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-f43f5e" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" /></marker>
                                  <marker id="arrowhead-c084fc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" opacity="0.8" /></marker>
                                  <marker id="arrowhead-10b981" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              
                              const isCurr = st.curr === nodeObj.id;
                              const isPrev = st.prev === nodeObj.id;
                              const isNextTemp = st.nextTemp === nodeObj.id;

                              const isFirst = st.first === nodeObj.id;
                              const isSecond = st.second === nodeObj.id;
                              const isTmp1 = st.tmp1 === nodeObj.id;
                              const isTmp2 = st.tmp2 === nodeObj.id;
                              
                              const isArrI = st.currI === nodeObj.id;
                              const isArrJ = st.currJ === nodeObj.id;

                              let themeColor = nodeObj.originPhase === 2 ? 'sky' : 'emerald';
                              if (isSlow) themeColor = 'amber';
                              if (isFast) themeColor = 'rose';
                              if (isCurr) themeColor = 'indigo';
                              if (isPrev) themeColor = 'amber';
                              if (isFirst || isArrI) themeColor = 'emerald';
                              if (isSecond || isArrJ) themeColor = 'sky';
                              
                              const isTarget = isSlow || isFast || isCurr || isPrev || isNextTemp || isFirst || isSecond || isTmp1 || isTmp2 || isArrI || isArrJ;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "amber", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "rose", pos: "bottom" });
                              
                              if (isCurr && !isFast) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isPrev) lbls.push({ text: "prev", color: "amber", pos: "top" });
                              if (isNextTemp) lbls.push({ text: "nextTemp", color: "slate", pos: "top" });

                              if (isFirst) lbls.push({ text: "first", color: "emerald", pos: "top" });
                              if (isSecond) lbls.push({ text: "second", color: "sky", pos: "bottom" });
                              if (isTmp1) lbls.push({ text: "tmp1", color: "slate", pos: "top" });
                              if (isTmp2) lbls.push({ text: "tmp2", color: "slate", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The 3-Phase Approach</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>1. Find the Middle:</strong> Using Tortoise and Hare (Slow and Fast pointers), we locate the middle of the list. When <code>fast</code> hits the end, <code>slow</code> is exactly at the halfway mark.</p>
                        <p><strong>2. Sever and Reverse:</strong> We break the list at <code>slow.next = null</code>. Then, we perform a standard Linked List Reversal on the second half. This allows us to traverse the second half from the original tail backwards, using standard <code>next</code> pointers.</p>
                        <p><strong>3. Interleaved Merge:</strong> We now have two separate lists. <code>first</code> points to the start, and <code>second</code> points to the newly reversed tail. We simply loop and alternate connections: <code>first → second → nextFirst → nextSecond</code>, zipping them together perfectly.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Reorder List</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a 'Composite Problem'. It doesn't introduce any new concepts; rather, it tests your ability to seamlessly glue together three foundational algorithms (Find Middle, Reverse List, Merge Lists). If you fail this, it means you haven't truly mastered the basics."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Severing the List:</strong> Do not forget to set <code>slow.next = null</code> after finding the middle. If you leave them connected, the reversing and merging phases will tangle into an infinite loop.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Temporary Variables:</strong> In Phase 3, you MUST save <code>first.next</code> and <code>second.next</code> into temporary variables before rewiring them. Point manipulation destroys the original path if you don't save it first.</div></li>
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
                           
                           {selectedOpId === 'stackApproach' && st.arr && (
                               <div className="absolute left-10 top-10 z-30 pointer-events-none flex flex-col gap-2">
                                   <span className="text-[12px] font-black text-sky-600 uppercase tracking-widest font-mono bg-sky-50/90 backdrop-blur px-4 py-2 rounded-xl shadow-xl border border-sky-200 w-max">ArrayList Memory O(N)</span>
                                   <div className="flex gap-3 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-2xl max-w-2xl flex-wrap">
                                       {st.arr.length === 0 ? <span className="text-sm text-slate-400 italic px-2">Empty...</span> : null}
                                       {st.arr.map((nid: number, idx: number) => {
                                           let isI = st.i === idx;
                                           let isJ = st.j === idx;
                                           return (
                                               <div key={idx} className="flex flex-col items-center">
                                                   <span className="text-[10px] font-bold text-slate-400 mb-1">{idx}</span>
                                                   <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-mono font-black text-lg shadow-sm ${isI ? 'bg-emerald-500 text-white' : isJ ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                                                       {st.list.find((n:any)=>n.id===nid)?.val}
                                                   </div>
                                                   {isI && <span className="text-[10px] font-black text-emerald-600 mt-1">i</span>}
                                                   {isJ && <span className="text-[10px] font-black text-sky-600 mt-1">j</span>}
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-f43f5e-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" opacity="0.8" /></marker>
                                  <marker id="arrowhead-c084fc-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" opacity="0.8" /></marker>
                                  <marker id="arrowhead-10b981-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isSlow = st.slow === nodeObj.id; 
                              const isFast = st.fast === nodeObj.id;
                              
                              const isCurr = st.curr === nodeObj.id;
                              const isPrev = st.prev === nodeObj.id;
                              const isNextTemp = st.nextTemp === nodeObj.id;

                              const isFirst = st.first === nodeObj.id;
                              const isSecond = st.second === nodeObj.id;
                              const isTmp1 = st.tmp1 === nodeObj.id;
                              const isTmp2 = st.tmp2 === nodeObj.id;
                              
                              const isArrI = st.currI === nodeObj.id;
                              const isArrJ = st.currJ === nodeObj.id;

                              let themeColor = nodeObj.originPhase === 2 ? 'sky' : 'emerald';
                              if (isSlow) themeColor = 'amber';
                              if (isFast) themeColor = 'rose';
                              if (isCurr) themeColor = 'indigo';
                              if (isPrev) themeColor = 'amber';
                              if (isFirst || isArrI) themeColor = 'emerald';
                              if (isSecond || isArrJ) themeColor = 'sky';
                              
                              const isTarget = isSlow || isFast || isCurr || isPrev || isNextTemp || isFirst || isSecond || isTmp1 || isTmp2 || isArrI || isArrJ;

                              const lbls = [];
                              if (isSlow) lbls.push({ text: "slow", color: "amber", pos: "top" });
                              if (isFast) lbls.push({ text: "fast", color: "rose", pos: "bottom" });
                              
                              if (isCurr && !isFast) lbls.push({ text: "curr", color: "indigo", pos: "bottom" });
                              if (isPrev) lbls.push({ text: "prev", color: "amber", pos: "top" });
                              if (isNextTemp) lbls.push({ text: "nextTemp", color: "slate", pos: "top" });

                              if (isFirst) lbls.push({ text: "first", color: "emerald", pos: "top" });
                              if (isSecond) lbls.push({ text: "second", color: "sky", pos: "bottom" });
                              if (isTmp1) lbls.push({ text: "tmp1", color: "slate", pos: "top" });
                              if (isTmp2) lbls.push({ text: "tmp2", color: "slate", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg ring-4 ring-emerald-500/10 animate-bounce"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">REORDER COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">List successfully folded in place</p>
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
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
  AlignEndHorizontal, ArrowLeftRight
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  iterativeMerge: {
    id: 'iterativeMerge',
    title: 'Iterative Zipper (Optimal)',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N+M) | Space: O(1)',
    code: `public Node mergeTwoLists(Node list1, Node list2) {
    // 1. Create a dummy node to act as the head of the merged list
    Node dummy = new Node(-1);
    Node tail = dummy;

    // 2. Traverse both lists simultaneously
    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }

    // 3. Attach the remaining elements of whichever list is not empty
    if (list1 != null) {
        tail.next = list1;
    } else if (list2 != null) {
        tail.next = list2;
    }

    return dummy.next;
}`,
    desc: "The optimal O(1) auxiliary space approach. We use a 'dummy' node to simplify edge cases. We maintain a 'tail' pointer that always sits at the end of our growing merged list. We compare the heads of both lists, append the smaller one to 'tail.next', and advance the respective pointers. Finally, we attach whatever is left over."
  },
  recursiveMerge: {
    id: 'recursiveMerge',
    title: 'Recursive Stack',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N+M) | Space: O(N+M)',
    code: `public Node mergeTwoListsRec(Node list1, Node list2) {
    // Base cases: if one list is empty, return the other
    if (list1 == null) return list2;
    if (list2 == null) return list1;

    // Recursive step: Compare and link the smaller node to the merged rest
    if (list1.val <= list2.val) {
        list1.next = mergeTwoListsRec(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoListsRec(list1, list2.next);
        return list2;
    }
}`,
    desc: "An elegant, declarative recursive approach. It asks: 'Which node is smaller?' That smaller node becomes the head, and its 'next' pointer is determined by recursively calling the function on the remainder of the lists. While clean, it uses O(N+M) space on the call stack, making it risky for extremely long lists."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|mergeTwoLists|mergeTwoListsRec|list1|list2|dummy|tail|val|next|new)\b|\b\d+\b)/g).filter(Boolean);
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
            const isPointer = ['list1', 'list2', 'dummy', 'tail', 'next'].includes(part);
            const isMethod = ['mergeTwoLists', 'mergeTwoListsRec'].includes(part);
            const isProp = ['val'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isConst ? 'text-orange-400 font-bold' :
                  isPointer ? 'text-indigo-400' : 
                  isProp ? 'text-amber-400' :
                  isMethod ? 'text-fuchsia-300' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' && part.trim() !== '<=' && part.trim() !== '>=' && part.trim() !== '-' && part.trim() !== '=' && part.trim() !== ';' ? '' : 'text-emerald-400'
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
  origin?: 'L1' | 'L2' | 'DUMMY';
}

interface ListNodeBlockProps {
  val: string;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  isDummy?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, isDummy }) => {
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
            <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 opacity-80 tracking-tight">{isDummy ? 'Sentinel' : String(address)}</span>
            <div className={`flex items-center w-20 h-14 border-2 rounded-2xl transition-all duration-500 ${isDummy ? 'bg-slate-800 border-slate-600' : activeTheme.bg} ${isDummy ? '' : activeTheme.border} ${targetClasses} relative overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl border-r border-black/10 ${isDummy ? 'text-slate-500' : activeTheme.text}`}>
                    {isDummy ? 'D' : String(val)}
                </div>
                <div className={`w-6 h-full flex flex-col items-center justify-center rounded-r-xl border-slate-200 ${isDummy ? 'bg-slate-700 border-slate-600' : 'bg-slate-50/50'}`}>
                    <span className={`text-[6px] font-black uppercase tracking-widest opacity-60 transform -rotate-90 ${isDummy ? 'text-slate-400' : ''}`}>NXT</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function MergeTwoSortedListViz() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('iterativeMerge');
  
  const [inputList1, setInputList1] = useState('1, 2, 4');
  const [inputList2, setInputList2] = useState('1, 3, 4');
  
  const [baseList1, setBaseList1] = useState<ListNodeData[]>([]);
  const [baseList2, setBaseList2] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 50 }); 
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

  const parseList = (inputStr: string, idOffset: number, yPos: number, origin: 'L1'|'L2') => {
      const parts = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
      let nodes: ListNodeData[] = [];
      for (let i = 0; i < parts.length; i++) {
          nodes.push({
              id: idOffset + i,
              val: String(parts[i]),
              addr: '0x' + (idOffset + (i * 16)).toString(16).toUpperCase().padStart(3, '0'),
              nextId: i < parts.length - 1 ? idOffset + i + 1 : null,
              x: 60 + (i * 120),
              y: yPos,
              origin: origin
          });
      }
      return nodes;
  };

  useEffect(() => {
    setBaseList1(parseList(inputList1, 100, 100, 'L1'));
    setBaseList2(parseList(inputList2, 200, 260, 'L2'));
    setCurrentStep(0);
    setPan({ x: 100, y: 50 });
  }, [inputList1, inputList2, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const recalculateLayout = (list: ListNodeData[], dummyId: number, l1Id: number | null, l2Id: number | null) => {
      const newLayout = list.map(n => ({...n}));
      
      // Layout Merged Line (Bottom, y=420)
      let current: number | null = dummyId;
      let x = 60;
      let failsafe = 0;
      while (current !== null && failsafe < list.length + 2) {
          let idx = newLayout.findIndex(n => n.id === current);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 420;
              x += 120;
              current = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }

      // Layout Remaining L1 (Top, y=100)
      current = l1Id;
      x = 60;
      failsafe = 0;
      while (current !== null && failsafe < list.length) {
          let idx = newLayout.findIndex(n => n.id === current);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 100;
              x += 120;
              current = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }

      // Layout Remaining L2 (Middle, y=260)
      current = l2Id;
      x = 60;
      failsafe = 0;
      while (current !== null && failsafe < list.length) {
          let idx = newLayout.findIndex(n => n.id === current);
          if (idx !== -1) {
              newLayout[idx].x = x;
              newLayout[idx].y = 260;
              x += 120;
              current = newLayout[idx].nextId;
          } else break;
          failsafe++;
      }

      return newLayout;
  };

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList1.length === 0 && baseList2.length === 0) return [{ phase: 'Init', description: 'Enter valid lists.', line: 1, state: { list: [] } }];
    
    let list = [...baseList1.map(n => ({...n})), ...baseList2.map(n => ({...n}))];
    
    let dummyId = 999;
    let dummyNode: ListNodeData = { id: dummyId, val: 'D', addr: 'DUMMY', nextId: null, x: 60, y: 420, isDummy: true, origin: 'DUMMY' };
    list.push(dummyNode);

    let l1: number | null = baseList1.length > 0 ? baseList1[0].id : null;
    let l2: number | null = baseList2.length > 0 ? baseList2[0].id : null;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: list.map(n=>({...n})),
            l1, l2,
            ...st 
        } 
    });

    if (selectedOpId === 'iterativeMerge') {
        let tail = dummyId;
        add("Function Entry & Init", `Created a dummy node to anchor the merged list. tail = dummy.`, 3, { tail });

        while (l1 !== null && l2 !== null) {
            let n1 = list.find(n => n.id === l1)!;
            let n2 = list.find(n => n.id === l2)!;

            add("Compare Nodes", `Comparing list1.val (${n1.val}) and list2.val (${n2.val}).`, 7, { tail, isComparing: true });

            if (parseInt(n1.val) <= parseInt(n2.val)) {
                add("Select L1", `${n1.val} <= ${n2.val}. Selecting node from list1.`, 8, { tail, selected: l1 });
                
                list.find(n => n.id === tail)!.nextId = l1;
                tail = l1;
                l1 = n1.nextId;
                n1.nextId = null; // Detach visually for a clean re-layout
                
                list = recalculateLayout(list, dummyId, l1, l2);
                list.find(n => n.id === tail)!.nextId = null; // Prevent runaway lines in layout
                
                add("Wire and Advance", `tail.next = list1; list1 = list1.next;`, 10, { tail });
            } else {
                add("Select L2", `${n1.val} > ${n2.val}. Selecting node from list2.`, 11, { tail, selected: l2 });
                
                list.find(n => n.id === tail)!.nextId = l2;
                tail = l2;
                l2 = n2.nextId;
                n2.nextId = null; 
                
                list = recalculateLayout(list, dummyId, l1, l2);
                list.find(n => n.id === tail)!.nextId = null;
                
                add("Wire and Advance", `tail.next = list2; list2 = list2.next;`, 13, { tail });
            }
            
            add("Advance Tail", `tail = tail.next; Moving tail pointer forward.`, 14, { tail });
        }

        add("Loop Exhausted", `One or both lists are now empty. Breaking out of loop.`, 6, { tail });

        if (l1 !== null) {
            list.find(n => n.id === tail)!.nextId = l1;
            list = recalculateLayout(list, dummyId, null, null); // Bring all remaining down
            add("Attach Remainder L1", `list1 is not empty. Attaching the remainder of list1 to tail.next.`, 18, { tail });
        } else if (l2 !== null) {
            list.find(n => n.id === tail)!.nextId = l2;
            list = recalculateLayout(list, dummyId, null, null); // Bring all remaining down
            add("Attach Remainder L2", `list2 is not empty. Attaching the remainder of list2 to tail.next.`, 20, { tail });
        } else {
            add("No Remainder", `Both lists are completely empty.`, 22, { tail });
        }

        let finalSeq = [];
        let c: number | null = dummyNode.nextId;
        while (c !== null) {
            let n = list.find(x => x.id === c);
            if (n) { finalSeq.push(n.val); c = n.nextId; }
            else break;
        }

        add("Return", `return dummy.next; Merged list completed in O(1) space.`, 23, { tail, isSuccess: true, finalSeq: finalSeq.join(' → ') });

    } else if (selectedOpId === 'recursiveMerge') {
        let callStack: { l1: number|null, l2: number|null, depth: number }[] = [];
        
        // Custom visual recursion simulator
        const recurse = (currL1: number | null, currL2: number | null, depth: number): number | null => {
            callStack.push({ l1: currL1, l2: currL2, depth });
            
            let v1 = currL1 !== null ? list.find(n => n.id === currL1)?.val : 'null';
            let v2 = currL2 !== null ? list.find(n => n.id === currL2)?.val : 'null';
            
            add("Function Call", `mergeTwoListsRec(Node(${v1}), Node(${v2})) entered. Depth: ${depth}`, 1, { callStack: [...callStack], currL1, currL2 });

            if (currL1 === null) {
                add("Base Case L1", `list1 is null, returning list2 up the stack.`, 3, { callStack: [...callStack], currL1, currL2 });
                callStack.pop();
                return currL2;
            }
            if (currL2 === null) {
                add("Base Case L2", `list2 is null, returning list1 up the stack.`, 4, { callStack: [...callStack], currL1, currL2 });
                callStack.pop();
                return currL1;
            }

            let n1 = list.find(n => n.id === currL1)!;
            let n2 = list.find(n => n.id === currL2)!;

            add("Compare Nodes", `Comparing list1.val (${n1.val}) and list2.val (${n2.val}).`, 7, { callStack: [...callStack], currL1, currL2, isComparing: true });

            if (parseInt(n1.val) <= parseInt(n2.val)) {
                add("Select L1 & Recurse", `${n1.val} <= ${n2.val}. list1 is the head. Recursively solving for list1.next.`, 8, { callStack: [...callStack], currL1, currL2, selected: currL1 });
                
                let nextMergedHead = recurse(n1.nextId, currL2, depth + 1);
                
                // Reconstruct pointer on unwind
                list.find(n => n.id === currL1)!.nextId = nextMergedHead;
                list = recalculateLayout(list, dummyId, null, null); // Shift layout to bottom implicitly
                
                // Move resolved nodes to the bottom visually to mimic building the list
                let resNode = list.find(n => n.id === currL1);
                if (resNode) { resNode.y = 420; }
                list = recalculateLayout(list, dummyId, null, null); // Clean up positions

                add("Unwind & Link", `Resuming Depth ${depth}. Linked list1.next to the result of the recursive call.`, 8, { callStack: [...callStack], currL1, currL2 });
                add("Return Node", `return list1;`, 9, { callStack: [...callStack], currL1, currL2 });
                
                callStack.pop();
                return currL1;
            } else {
                add("Select L2 & Recurse", `${n1.val} > ${n2.val}. list2 is the head. Recursively solving for list2.next.`, 11, { callStack: [...callStack], currL1, currL2, selected: currL2 });
                
                let nextMergedHead = recurse(currL1, n2.nextId, depth + 1);
                
                // Reconstruct pointer on unwind
                list.find(n => n.id === currL2)!.nextId = nextMergedHead;
                
                // Move resolved nodes to the bottom visually
                let resNode = list.find(n => n.id === currL2);
                if (resNode) { resNode.y = 420; }
                list = recalculateLayout(list, dummyId, null, null);

                add("Unwind & Link", `Resuming Depth ${depth}. Linked list2.next to the result of the recursive call.`, 11, { callStack: [...callStack], currL1, currL2 });
                add("Return Node", `return list2;`, 12, { callStack: [...callStack], currL1, currL2 });

                callStack.pop();
                return currL2;
            }
        };

        let finalHeadId = recurse(l1, l2, 1);
        list.find(n=>n.id===dummyId)!.nextId = finalHeadId;
        list = recalculateLayout(list, dummyId, null, null);

        let finalSeq = [];
        let c: number | null = dummyNode.nextId;
        while (c !== null) {
            let n = list.find(x => x.id === c);
            if (n) { finalSeq.push(n.val); c = n.nextId; }
            else break;
        }

        add("Complete", `Call stack empty. Merged list completed in O(N+M) space.`, 14, { callStack: [], isSuccess: true, finalSeq: finalSeq.join(' → ') });
    }

    return steps;
  }, [baseList1, baseList2, selectedOpId]);

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
                    // Cross-row linking (e.g. from top L1 row down to Merged row)
                    strokeColor = '#c084fc'; // fuchsia-400
                    strokeWidth = 3;
                    pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Merge Sorted Lists</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      List Zipping
                  </span>
                  <span>•</span>
                  <span>O(N+M) Traversal</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><Combine size={28}/> Splicing Sorted Lists</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Inputs:</span>
                       list1 = [1, 2, 4]<br/>
                       list2 = [1, 3, 4]<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">1 → 1 → 2 → 3 → 4 → 4</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> In-Place Requirement</h4>
                        <p className="text-sm leading-relaxed">It is trivial to create a brand new list and insert new nodes. However, the true intent of this algorithm is to re-wire the existing <code>next</code> pointers of the two input lists into a single continuous chain, using strictly <strong>O(1) extra space</strong>.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Iterative vs Recursive</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The recursive approach is incredibly concise (only a few lines of code), but it uses $O(N+M)$ space on the call stack. The Iterative approach uses a dummy node and a tail pointer to build the result in $O(1)$ space.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> MergeTwoLists.java</span>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1">List 1 (Sorted)</label>
                            <input type="text" value={inputList1} onChange={(e) => setInputList1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">List 2 (Sorted)</label>
                            <input type="text" value={inputList2} onChange={(e) => setInputList2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">Lists successfully merged into a single sorted chain.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
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
                                  <marker id="arrowhead-cbd5e1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-c084fc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Row Markers */}
                           <div className="absolute -left-12 top-[100px] -translate-y-1/2 text-[10px] font-black opacity-30 tracking-widest rotate-270 text-emerald-800">LIST 1</div>
                           <div className="absolute -left-12 top-[260px] -translate-y-1/2 text-[10px] font-black opacity-30 tracking-widest rotate-270 text-sky-800">LIST 2</div>
                           <div className="absolute -left-12 top-[420px] -translate-y-1/2 text-[10px] font-black opacity-30 tracking-widest rotate-270 text-fuchsia-800">MERGED</div>

                           {/* Call Stack Visual for Recursion */}
                           {selectedOpId === 'recursiveMerge' && st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-6 top-[320px] bg-slate-800/90 border border-slate-700 rounded-xl p-4 w-40 flex flex-col shadow-xl z-50 backdrop-blur-md">
                                   <span className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-2"><Layers size={12}/> Stack</span>
                                   <div className="flex flex-col-reverse gap-1 text-[10px] font-mono text-slate-300">
                                       {st.callStack.map((frame: any, i: number) => {
                                           let v1 = frame.l1 !== null ? (st.list || []).find((n:any)=>n.id===frame.l1)?.val : 'null';
                                           let v2 = frame.l2 !== null ? (st.list || []).find((n:any)=>n.id===frame.l2)?.val : 'null';
                                           return (
                                               <div key={i} className={`px-2 py-1 rounded truncate ${i === st.callStack.length - 1 ? 'bg-fuchsia-600 text-white' : 'bg-slate-700/50'}`}>
                                                   merge({v1},{v2})
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isL1 = st.l1 === nodeObj.id || st.currL1 === nodeObj.id; 
                              const isL2 = st.l2 === nodeObj.id || st.currL2 === nodeObj.id;
                              const isTail = st.tail === nodeObj.id;
                              const isSelected = st.selected === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : (nodeObj.origin === 'L1' ? 'emerald' : 'sky');
                              
                              const isTarget = isL1 || isL2 || isTail || isSelected;

                              const lbls = [];
                              if (isL1) lbls.push({ text: "list1", color: "emerald", pos: "top" });
                              if (isL2) lbls.push({ text: "list2", color: "sky", pos: "top" });
                              if (isTail) lbls.push({ text: "tail", color: "fuchsia", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: The Zipper Merge</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p>Because both input lists are already sorted, we don't need to perform a full sort algorithm. We just need to merge them like a zipper.</p>
                        <p><strong>1. The Dummy Head:</strong> We create a fake <code>dummy</code> node. This allows us to point <code>tail = dummy</code> and unconditionally write <code>tail.next = chosenNode</code> without worrying about whether the merged list is empty yet.</p>
                        <p><strong>2. Two-Pointer Comparison:</strong> We compare the current heads of List 1 and List 2. Whichever is smaller gets hooked onto our <code>tail.next</code>. Then, we advance the <code>tail</code> and the pointer of the list we just pulled from.</p>
                        <p><strong>3. The Remainder:</strong> The loop breaks as soon as ONE list is exhausted. Since the lists are sorted, whatever is left in the non-empty list is guaranteed to be strictly greater than everything we've merged so far. We simply attach the entire remainder to the tail in O(1) time.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering List Merging</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a quintessential linked list problem. It tests your ability to manipulate pointers safely. Interviewers specifically watch to see if you use a <code>dummy</code> node—doing so proves you understand how to avoid writing messy edge-case logic for the very first insertion."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Iterative over Recursive:</strong> While the recursive approach is mathematically beautiful, it fails in production for lists with 10,000+ elements due to Stack Overflow. Always default to Iterative.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Fast Remainder Append:</strong> Do not use a while loop to append the remaining elements of the unfinished list. A simple <code>tail.next = list1 != null ? list1 : list2;</code> attaches the entire remaining chain instantly in O(1) operations.</div></li>
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
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-cbd5e1-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-c084fc-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Row Markers FS */}
                           <div className="absolute -left-12 top-[100px] -translate-y-1/2 text-[14px] font-black opacity-30 tracking-widest rotate-270 text-emerald-800">LIST 1</div>
                           <div className="absolute -left-12 top-[260px] -translate-y-1/2 text-[14px] font-black opacity-30 tracking-widest rotate-270 text-sky-800">LIST 2</div>
                           <div className="absolute -left-12 top-[420px] -translate-y-1/2 text-[14px] font-black opacity-30 tracking-widest rotate-270 text-fuchsia-800">MERGED</div>

                           {/* Call Stack Visual for Recursion FS */}
                           {selectedOpId === 'recursiveMerge' && st.callStack && st.callStack.length > 0 && (
                               <div className="absolute left-6 top-[320px] bg-slate-800/90 border border-slate-700 rounded-xl p-4 w-48 flex flex-col shadow-xl z-50 backdrop-blur-md">
                                   <span className="text-[12px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-2"><Layers size={14}/> Call Stack</span>
                                   <div className="flex flex-col-reverse gap-1.5 text-[12px] font-mono text-slate-300">
                                       {st.callStack.map((frame: any, i: number) => {
                                           let v1 = frame.l1 !== null ? (st.list || []).find((n:any)=>n.id===frame.l1)?.val : 'null';
                                           let v2 = frame.l2 !== null ? (st.list || []).find((n:any)=>n.id===frame.l2)?.val : 'null';
                                           return (
                                               <div key={i} className={`px-2 py-1.5 rounded truncate ${i === st.callStack.length - 1 ? 'bg-fuchsia-600 text-white font-bold' : 'bg-slate-700/50'}`}>
                                                   merge({v1},{v2})
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isL1 = st.l1 === nodeObj.id || st.currL1 === nodeObj.id; 
                              const isL2 = st.l2 === nodeObj.id || st.currL2 === nodeObj.id;
                              const isTail = st.tail === nodeObj.id;
                              const isSelected = st.selected === nodeObj.id;
                              
                              let themeColor = nodeObj.isDummy ? 'slate' : (nodeObj.origin === 'L1' ? 'emerald' : 'sky');
                              
                              const isTarget = isL1 || isL2 || isTail || isSelected;

                              const lbls = [];
                              if (isL1) lbls.push({ text: "list1", color: "emerald", pos: "top" });
                              if (isL2) lbls.push({ text: "list2", color: "sky", pos: "top" });
                              if (isTail) lbls.push({ text: "tail", color: "fuchsia", pos: "bottom" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10 ${isTarget ? 'z-20' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">MERGE COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Two sorted lists gracefully interwoven</p>
                                
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
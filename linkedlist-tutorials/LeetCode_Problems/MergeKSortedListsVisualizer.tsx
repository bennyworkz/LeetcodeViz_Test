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
  AlignEndHorizontal
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  minHeap: {
    id: 'minHeap',
    title: 'Min-Heap (Priority Queue)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N log k) | Space: O(k)',
    code: `public Node mergeKLists(Node[] lists) {
    if (lists == null || lists.length == 0) return null;

    // Priority Queue to keep track of the minimum node among all list heads
    PriorityQueue<Node> pq = new PriorityQueue<>(lists.length, (a, b) -> a.val - b.val);

    // 1. Initialize PQ with the head of each non-empty list
    for (Node node : lists) {
        if (node != null) {
            pq.add(node);
        }
    }

    Node dummy = new Node(0);
    Node tail = dummy;

    // 2. Extract min, append to result, and insert its next node
    while (!pq.isEmpty()) {
        Node minNode = pq.poll();
        tail.next = minNode;
        tail = tail.next;

        if (minNode.next != null) {
            pq.add(minNode.next);
        }
    }

    return dummy.next;
}`,
    desc: "The Priority Queue (Min-Heap) approach is elegant and highly intuitive. We maintain a heap of size up to 'k' (one node from each list). At every step, we extract the absolute minimum node from the heap, append it to our result list, and push its immediate 'next' node into the heap. We repeat this until the heap is empty."
  },
  divideConquer: {
    id: 'divideConquer',
    title: 'Divide and Conquer',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N log k) | Space: O(1)',
    code: `public Node mergeKLists(Node[] lists) {
    if (lists == null || lists.length == 0) return null;
    
    int interval = 1;
    int k = lists.length;
    
    // Iteratively merge pairs of lists
    while (interval < k) {
        for (int i = 0; i < k - interval; i += interval * 2) {
            lists[i] = mergeTwoLists(lists[i], lists[i + interval]);
        }
        interval *= 2;
    }
    
    return lists[0];
}

// Standard helper to merge two sorted lists
private Node mergeTwoLists(Node l1, Node l2) {
    Node dummy = new Node(0);
    Node tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val < l2.val) {
            tail.next = l1; l1 = l1.next;
        } else {
            tail.next = l2; l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`,
    desc: "The Divide and Conquer approach merges lists in pairs. In the first round, we merge list 0 & 1, 2 & 3, etc. In the next round, we merge the newly combined lists, and so on. This reduces the number of lists by half each round, resulting in log(k) levels of merging. It requires O(1) auxiliary space if implemented iteratively."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|while|for|Node|null|mergeKLists|mergeTwoLists|lists|length|PriorityQueue|pq|add|poll|isEmpty|dummy|tail|minNode|interval|k|l1|l2|new|val|next)\b|\b\d+\b)/g).filter(Boolean);
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
            const isObject = ['Node', 'PriorityQueue'].includes(part);
            const isConst = ['null'].includes(part);
            const isPointer = ['lists', 'dummy', 'tail', 'minNode', 'l1', 'l2', 'next'].includes(part);
            const isVar = ['interval', 'k', 'length'].includes(part);
            const isMethod = ['add', 'poll', 'isEmpty'].includes(part);
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
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' && part.trim() !== '-' ? '' : 'text-emerald-400'
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
  val: number;
  addr: string;
  nextId: number | null;
  x: number;
  y: number;
  listIdx: number;
  state: 'input' | 'heap' | 'result';
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  themeColor?: string;
  isTarget?: boolean;
  inHeap?: boolean;
}

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, themeColor = 'slate', isTarget, inHeap }) => {
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
    
    if (inHeap) {
        targetClasses += ' shadow-lg shadow-indigo-200 ring-2 ring-indigo-300 border-indigo-500';
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
        </div>
    );
};

// --- Main Application ---

export default function MergeKSortedListsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('minHeap');
  
  const [inputListStr, setInputListStr] = useState('1,4,5 | 1,3,4 | 2,6');
  const [baseLists, setBaseLists] = useState<ListNodeData[][]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];

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

  const parseLists = (inputStr: string) => {
      const listsRaw = inputStr.split('|').map(s => s.trim()).filter(s => s !== '');
      const parsedLists: ListNodeData[][] = [];
      
      let globalId = 0;

      for (let listIdx = 0; listIdx < listsRaw.length; listIdx++) {
          const parts = listsRaw[listIdx].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
          // Enforce sorted order just in case user enters unsorted junk
          parts.sort((a,b) => a-b);
          
          let nodes: ListNodeData[] = [];
          for (let i = 0; i < parts.length; i++) {
              nodes.push({
                  id: globalId++,
                  val: parts[i],
                  listIdx: listIdx,
                  addr: '0x' + (100 + (globalId * 16)).toString(16).toUpperCase().padStart(3, '0'),
                  nextId: null, // assigned below
                  x: 60 + (i * 120),
                  y: 60 + (listIdx * 80),
                  state: 'input'
              });
          }
          
          for (let i = 0; i < nodes.length - 1; i++) {
              nodes[i].nextId = nodes[i+1].id;
          }
          
          if (nodes.length > 0) {
              parsedLists.push(nodes);
          }
      }
      return parsedLists;
  };

  useEffect(() => {
    setBaseLists(parseLists(inputListStr));
    setCurrentStep(0);
    setPan({ x: 100, y: 50 });
  }, [inputListStr, selectedOpId]);

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
    if (baseLists.length === 0) return [{ phase: 'Init', description: 'Enter valid sorted lists separated by |', state: { list: [] } }];
    
    // Flat mapping of all nodes for easy tracking
    let flatList: ListNodeData[] = [];
    baseLists.forEach(list => flatList.push(...list.map(n => ({...n}))));

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            list: flatList.map(n=>({...n})),
            ...st 
        } 
    });

    if (selectedOpId === 'minHeap') {
        let heap: number[] = [];
        let resultIds: number[] = [];
        let tailId: number | null = null;

        add("Initialize", `Identified ${baseLists.length} input lists. Preparing Priority Queue.`, 4, { heap: [...heap], tailId });

        // Add heads to heap
        baseLists.forEach(lst => {
            if (lst.length > 0) {
                let headId = lst[0].id;
                heap.push(headId);
                let node = flatList.find(n => n.id === headId);
                if (node) node.state = 'heap';
            }
        });

        // Visually organize the initial heap
        heap.forEach((hid, i) => {
             let node = flatList.find(n => n.id === hid);
             if (node) {
                 node.x = 80 + (i * 100);
                 node.y = 380; // Heap Area Y
             }
        });

        add("Populate Heap", `Added the head of each non-empty list to the Priority Queue (Heap size: ${heap.length}).`, 8, { heap: [...heap], tailId });

        while (heap.length > 0) {
            // "Poll" min node (simulated by finding min val)
            heap.sort((aId, bId) => {
                let a = flatList.find(n => n.id === aId)!;
                let b = flatList.find(n => n.id === bId)!;
                return a.val - b.val;
            });

            let minNodeId = heap.shift()!;
            let minNode = flatList.find(n => n.id === minNodeId)!;
            
            add("Extract Min", `Polled minimum value Node(${minNode.val}) from the Priority Queue.`, 17, { heap: [...heap], tailId, minNode: minNodeId });

            // Add to result
            minNode.state = 'result';
            minNode.y = 540; // Result Area Y
            minNode.x = 60 + (resultIds.length * 120);
            
            if (tailId !== null) {
                let tailNode = flatList.find(n => n.id === tailId)!;
                tailNode.nextId = minNodeId; // Link in result chain
            }
            // Disconnect original next temporarily for visual cleanliness if it was in the heap
            let originalNextId = minNode.nextId;
            minNode.nextId = null;

            resultIds.push(minNodeId);
            tailId = minNodeId;

            add("Append to Result", `Appended Node(${minNode.val}) to the final merged list.`, 18, { heap: [...heap], tailId, minNode: minNodeId });

            // Push next node to heap
            if (originalNextId !== null) {
                heap.push(originalNextId);
                let nextNode = flatList.find(n => n.id === originalNextId)!;
                nextNode.state = 'heap';
                
                // Re-layout heap visually
                heap.forEach((hid, i) => {
                     let node = flatList.find(n => n.id === hid);
                     if (node) {
                         node.x = 80 + (i * 100);
                         node.y = 380;
                     }
                });

                add("Push Next Node", `Pushed the next node from that list, Node(${nextNode.val}), into the PQ.`, 22, { heap: [...heap], tailId, minNode: minNodeId });
            } else {
                // Re-layout heap visually anyway
                heap.forEach((hid, i) => {
                     let node = flatList.find(n => n.id === hid);
                     if (node) {
                         node.x = 80 + (i * 100);
                         node.y = 380;
                     }
                });
                add("List Exhausted", `Node(${minNode.val}) had no next node. That input list is now fully merged.`, 17, { heap: [...heap], tailId, minNode: minNodeId });
            }
        }

        let finalSeq = resultIds.map(id => flatList.find(n => n.id === id)?.val).join(' → ');
        add("Complete", "Priority Queue is empty. All k lists have been successfully merged into a single sorted list.", 26, { isSuccess: true, finalSeq, heap: [] });

    } else if (selectedOpId === 'divideConquer') {
        // We will simulate Divide and Conquer visually by maintaining a queue of 'active lists'
        let listsQueue: {head: number, tail: number, nodes: number[]}[] = [];
        
        baseLists.forEach((lst, i) => {
            if(lst.length > 0) {
                listsQueue.push({
                    head: lst[0].id,
                    tail: lst[lst.length-1].id,
                    nodes: lst.map(n=>n.id)
                });
            }
        });

        add("Initialize", `Starting Divide & Conquer with ${listsQueue.length} individual sorted lists.`, 4, { interval: 1 });

        let round = 1;
        let resultY = 380; // First merge row

        while (listsQueue.length > 1) {
            let nextQueue = [];
            
            add(`Round ${round}`, `Pairing up lists to merge.`, 7, { interval: round });

            for (let i = 0; i < listsQueue.length; i += 2) {
                if (i + 1 < listsQueue.length) {
                    let l1 = listsQueue[i];
                    let l2 = listsQueue[i+1];

                    add("Select Pair", `Merging List A (Head ${flatList.find(n=>n.id===l1.head)?.val}) with List B (Head ${flatList.find(n=>n.id===l2.head)?.val}).`, 9, { interval: round, mergingL1: l1.head, mergingL2: l2.head });

                    // Simulate mergeTwoLists
                    let mergedNodes = [];
                    let a: number | null = l1.head;
                    let b: number | null = l2.head;
                    
                    while (a !== null && b !== null) {
                        let nodeA = flatList.find(n => n.id === a)!;
                        let nodeB = flatList.find(n => n.id === b)!;
                        
                        if (nodeA.val < nodeB.val) {
                            mergedNodes.push(a);
                            a = nodeA.nextId;
                        } else {
                            mergedNodes.push(b);
                            b = nodeB.nextId;
                        }
                    }
                    while (a !== null) { mergedNodes.push(a); a = flatList.find(n=>n.id===a)!.nextId; }
                    while (b !== null) { mergedNodes.push(b); b = flatList.find(n=>n.id===b)!.nextId; }

                    // Wire up the new merged list and update coordinates
                    for (let j = 0; j < mergedNodes.length; j++) {
                        let node = flatList.find(n => n.id === mergedNodes[j])!;
                        node.nextId = j < mergedNodes.length - 1 ? mergedNodes[j+1] : null;
                        
                        // Layout properties for merged rows
                        node.y = resultY;
                        node.x = 60 + (j * 120);
                        node.state = 'result'; // Use result state color logic
                    }

                    nextQueue.push({
                        head: mergedNodes[0],
                        tail: mergedNodes[mergedNodes.length-1],
                        nodes: mergedNodes
                    });

                    add("Merge Complete", `Merged two sublists into a new sorted list of size ${mergedNodes.length}.`, 18, { interval: round });
                    resultY += 100; // Move down for next pair/round

                } else {
                    // Unpaired list, just carries over
                    nextQueue.push(listsQueue[i]);
                    add("Carry Over", `List (Head ${flatList.find(n=>n.id===listsQueue[i].head)?.val}) has no pair this round, carrying over.`, 9, { interval: round });
                }
            }
            listsQueue = nextQueue;
            round++;
        }

        let finalSeq = listsQueue[0]?.nodes.map(id => flatList.find(n=>n.id===id)?.val).join(' → ') || 'Empty';
        add("Complete", "Divide and Conquer log(k) levels complete. All lists merged.", 14, { isSuccess: true, finalSeq });
    }

    return steps;
  }, [baseLists, selectedOpId]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { list: [] } };
  const st = curStepData.state || { list: [] };
  const isLastStep = currentStep === trace.length - 1;

  const renderSvgArrows = () => {
    const arrows: React.ReactElement[] = [];
    (st.list || []).forEach((node: ListNodeData) => {
        if (node.nextId !== null && node.nextId !== undefined) {
            const target = st.list.find((n: ListNodeData) => n.id === node.nextId);
            if (target) {
                let startX = node.x + 80; // width is w-20 = 80px
                let startY = node.y + 28;
                let endX = target.x - 6; 
                let endY = target.y + 28;
                
                let strokeColor = '#cbd5e1'; // slate-300
                let strokeWidth = 2;
                let pathD = '';

                if (target.y !== node.y) {
                    // Vertical drop (moving to heap or result)
                    strokeColor = '#c084fc'; // fuchsia-400
                    strokeWidth = 2;
                    pathD = `M ${startX - 40},${startY + 28} C ${startX - 40},${startY + 60} ${endX + 40},${endY - 60} ${endX + 40},${endY - 28}`;
                    arrows.push(<path key={`drop-${node.id}`} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#arrowhead-drop)`} className="transition-all duration-500" strokeDasharray="4,4" />);
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

  const getColorTheme = (listIdx: number) => {
      const themes = ['emerald', 'sky', 'rose', 'amber', 'fuchsia', 'indigo'];
      return themes[listIdx % themes.length];
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <AlignEndHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Merge K Sorted Lists</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      O(N log k) Multi-Merge
                  </span>
                  <span>•</span>
                  <span>Hard Problem</span>
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
                    <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><AlignEndHorizontal size={28}/> The Ultimate Merge</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      You are given an array of <code>k</code> linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-indigo-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input (k=3 lists):</span>
                       L1: 1 → 4 → 5<br/>
                       L2: 1 → 3 → 4<br/>
                       L3: 2 → 6<br/>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-emerald-300">1 → 1 → 2 → 3 → 4 → 4 → 5 → 6</span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> Naive Danger</h4>
                        <p className="text-sm leading-relaxed">Merging list 1 and 2, then merging the result with 3, and so on, requires traversing the first list's elements $k$ times! This leads to a suboptimal $O(kN)$ time complexity.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className="text-indigo-500"/> Optimal Solutions</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We must achieve $O(N \log k)$. This can be done either by tracking the smallest heads in a <strong>Min-Heap (Priority Queue)</strong>, or by recursively pairing lists up in a <strong>Divide & Conquer</strong> tree.</p>
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> MergeKLists.java</span>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Input Lists (Separated by |)</label>
                            <input type="text" value={inputListStr} onChange={(e) => setInputListStr(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold italic tracking-tight">K lists successfully merged in O(N log K).</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight text-white`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Network size={14} className="text-indigo-500"/> Multi-List Arena</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                            <button onClick={toggleFullscreen} className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={18}/></button>
                        </div>
                   </div>

                   {/* Priority Queue Visual Box */}
                   {selectedOpId === 'minHeap' && (
                       <div className="absolute left-10 right-16 top-[320px] h-28 border-2 border-dashed border-indigo-300 bg-indigo-50/50 rounded-3xl pointer-events-none z-0 flex items-start p-4">
                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Database size={14}/> Priority Queue (Size K)</span>
                       </div>
                   )}
                   {/* Result Visual Box */}
                   {selectedOpId === 'minHeap' && (
                       <div className="absolute left-10 right-16 top-[480px] h-28 border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-3xl pointer-events-none z-0 flex items-start p-4">
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-mono flex items-center gap-2"><ListOrdered size={14}/> Result List</span>
                       </div>
                   )}

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
                               <defs>
                                  <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-drop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isMinNode = st.minNode === nodeObj.id;
                              
                              let themeColor = getColorTheme(nodeObj.listIdx);
                              
                              // Visual state overrides
                              if (nodeObj.state === 'heap') {
                                  // Keep original color but maybe add a border
                              }
                              if (nodeObj.state === 'result') {
                                  // Keep original color to show where it came from!
                              }

                              const lbls = [];
                              if (isMinNode) lbls.push({ text: "poll()", color: "rose", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isMinNode} themeColor={themeColor} inHeap={nodeObj.state === 'heap'}/>
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
                    <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Algorithm Theory: K-Way Merging</h3>
                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-2xl font-medium text-lg">
                        <p><strong>Min-Heap Strategy:</strong> A Priority Queue automatically keeps the smallest element at the top in $O(\log K)$ time. By keeping exactly $K$ nodes in the heap (one from each list), we are always comparing the current smallest candidates from all lists simultaneously.</p>
                        <p>Every time we pop the overall minimum, we push the <em>next</em> element from that specific list into the heap. Since each insertion/extraction takes $\log K$ time, and we process $N$ total nodes, the time is $O(N \log K)$.</p>
                        <p><strong>Divide & Conquer Strategy:</strong> Think of a tournament bracket. We merge pairs of lists. $K$ lists become $K/2$ lists, then $K/4$ lists... until 1 list remains. There are $\log K$ rounds, and in each round we merge a total of $N$ nodes. This also yields $O(N \log K)$ time, but requires no Priority Queue allocation, saving space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Interview Strategy</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is one of the most famous LeetCode Hard questions. Writing the Min-Heap solution is usually much faster and less prone to indexing bugs than Divide & Conquer. Use Java's <code>PriorityQueue</code> and write a custom lambda comparator <code>(a,b) -{'>'} a.val - b.val</code> to impress the interviewer."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-600 border-b pb-2">Technical Checks</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Empty Lists:</strong> The input array might contain <code>null</code> references (empty lists). When populating the initial Priority Queue, explicitly check <code>if (node != null) pq.add(node);</code>.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Dummy Node:</strong> As always with list generation, a <code>dummy</code> node simplifies the <code>tail</code> pointer logic immensely.</div></li>
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
                                  <marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" opacity="0.8" /></marker>
                                  <marker id="arrowhead-drop-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" opacity="0.8" /></marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>
                           
                           {/* Priority Queue Visual Box FS */}
                           {selectedOpId === 'minHeap' && (
                               <div className="absolute left-10 right-16 top-[320px] h-28 border-2 border-dashed border-indigo-300/50 bg-indigo-900/20 rounded-3xl pointer-events-none z-0 flex items-start p-4">
                                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Database size={14}/> Priority Queue (Size K)</span>
                               </div>
                           )}
                           {/* Result Visual Box FS */}
                           {selectedOpId === 'minHeap' && (
                               <div className="absolute left-10 right-16 top-[480px] h-28 border-2 border-dashed border-emerald-300/50 bg-emerald-900/20 rounded-3xl pointer-events-none z-0 flex items-start p-4">
                                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-2"><ListOrdered size={14}/> Result List</span>
                               </div>
                           )}

                           {(st.list || []).map((nodeObj: ListNodeData) => {
                              const isMinNode = st.minNode === nodeObj.id;
                              
                              let themeColor = getColorTheme(nodeObj.listIdx);

                              const lbls = [];
                              if (isMinNode) lbls.push({ text: "poll()", color: "rose", pos: "top" });

                              return (
                                  <div key={nodeObj.addr} className={`absolute transition-all duration-700 z-10`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{lbls.filter(l => l.pos === 'top').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="top" />)}</div>
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{lbls.filter(l => l.pos === 'bottom').map((l, i) => <PointerLabel key={i} label={l.text} color={l.color} position="bottom" />)}</div>
                                      
                                      <ListNodeBlock val={nodeObj.val} address={nodeObj.addr} isTarget={isMinNode} themeColor={themeColor} inHeap={nodeObj.state === 'heap'}/>
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">K Sorted Lists Combined</p>
                                
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
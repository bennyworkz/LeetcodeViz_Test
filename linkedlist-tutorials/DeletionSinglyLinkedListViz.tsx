import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, Terminal, Trash2, AlertCircle, RotateCcw,
  Scissors, MinusCircle, ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

const OPERATIONS = {
  deleteHead: {
    id: 'deleteHead',
    title: 'Delete from Beginning',
    icon: <MinusCircle size={16} />,
    complexity: 'Time: O(1) | Space: O(1)',
    code: `public Node deleteHead(Node head) {
    if (head == null) return null;
    
    // Shift head to the next node
    head = head.next;
    
    return head;
}`,
    desc: "Deleting the first node is extremely fast. We simply move the head pointer to the second node. The original first node is left unreferenced and will be cleared by the Garbage Collector."
  },
  deleteTail: {
    id: 'deleteTail',
    title: 'Delete from End',
    icon: <Trash2 size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node deleteTail(Node head) {
    if (head == null || head.next == null) return null;
    
    Node curr = head;
    // Traverse to the SECOND TO LAST node
    while (curr.next.next != null) {
        curr = curr.next;
    }
    
    // Disconnect the last node
    curr.next = null;
    
    return head;
}`,
    desc: "To delete the last node, we must traverse the entire list to find the second-to-last node. We then set its next pointer to null, effectively amputating the tail."
  },
  deleteAtPosition: {
    id: 'deleteAtPosition',
    title: 'Delete at Position N',
    icon: <Scissors size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node deleteAtPosition(Node head, int position) {
    if (head == null) return null;
    
    if (position == 1) {
        head = head.next;
        return head;
    }
    
    Node curr = head;
    // Traverse to the node just before the position
    for (int i = 1; i < position - 1 && curr != null; i++) {
        curr = curr.next;
    }
    
    // If position is out of bounds
    if (curr == null || curr.next == null) {
        System.out.println("Position out of bounds");
        return head;
    }
    
    // Bypass the deleted node
    curr.next = curr.next.next;
    
    return head;
}`,
    desc: "We traverse to the node immediately before our target. We then wire its 'next' pointer to skip over the target node, removing it from the sequence."
  }
};

// Component interfaces
interface PointerLabelProps {
  label: string;
  color: string;
  position: 'top' | 'bottom';
  active?: boolean;
  offset?: number;
  strikethrough?: boolean;
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  nextAddr: string;
  themeColor?: 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'rose' | 'sky' | 'slate';
  isTarget?: boolean;
}

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
  theme?: string;
}

// Data structures
interface ListNodeData {
  id: number;
  val: number;
  addr: string;
  x: number;
  y: number;
}

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <Trash2 size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Deletion in Linked List</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Deleting a node from a Linked List involves changing the references (pointers) so that the target node is bypassed. Once a node is no longer referenced by any pointer in the application, the Java Garbage Collector reclaims its memory automatically.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <MinusCircle size={14} className="text-rose-500"/> From Beginning
               </h4>
               <p className="text-slate-600 text-sm">Update the <code>head</code> pointer to point directly to <code>head.next</code>. This takes O(1) constant time since no traversal is required.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <Trash2 size={14} className="text-rose-500"/> From End
               </h4>
               <p className="text-slate-600 text-sm">Traverse the list until the <em>second to last</em> node. Set its <code>next</code> pointer to <code>null</code>. Takes O(N) time.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <Scissors size={14} className="text-rose-500"/> Specific Position
               </h4>
               <p className="text-slate-600 text-sm">Traverse to the node directly preceding the target. Bypass the target by linking <code>curr.next = curr.next.next</code>. Takes O(N) time.</p>
            </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl mt-8">
            <h3 className="text-sm font-black text-rose-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={16}/> Memory Leaks & Garbage Collection
            </h3>
            <p className="text-sm text-rose-700 leading-relaxed">
                In languages like C or C++, you must explicitly free the memory using <code>free()</code> or <code>delete</code>. In Java, once a node is completely unlinked (i.e., nothing points to it), the <strong>Garbage Collector (GC)</strong> sweeps it away automatically. Our visualizer represents this by fading the unlinked node out of existence!
            </p>
        </div>
      </div>
    </div>
  </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, forceIndex?: number): ListNodeData => {
    // 3 columns, staggered layout to show pointer curves nicely
    const index = forceIndex !== undefined ? forceIndex : id;
    const col = index % 3;
    const row = Math.floor(index / 3);
    
    const x = 100 + col * 260; 
    const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        x, y
    };
};

export default function DeletionSinglyLinkedListViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'interview'>('visualizer');
  const [inputPosition, setInputPosition] = useState('3');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('deleteHead');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedOp = OPERATIONS[selectedOpId];

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Trackpad Zoom Logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!isFullscreen) return;
        e.preventDefault();
        const delta = -e.deltaY * 0.005;
        setZoom(prev => {
            const next = prev + delta;
            return Math.min(Math.max(next, 0.3), 3);
        });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isFullscreen]);

  // Initialization
  useEffect(() => {
      setBaseList([
          generateNode(10, 0, 0), 
          generateNode(20, 1, 1), 
          generateNode(30, 2, 2), 
          generateNode(40, 3, 3)
      ]);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));
    let pos = parseInt(inputPosition);
    if (isNaN(pos)) pos = 3;

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'deleteHead') {
        addStep("Method Call", `deleteHead(head) called.`, 1, { currIdx: null });
        addStep("Empty Check", `if (head == null) check.`, 2, { currIdx: null });
        
        if (list.length === 0) {
            addStep("List Empty", `List is empty. Returning null.`, 2, { isSuccess: true });
            return steps;
        }

        addStep("Shift Head", `head = head.next. The head pointer bypasses the first node.`, 5, { deletedTargetIdx: 0, headBypass: true });
        
        // Mutate memory
        list.shift();
        
        addStep("Deletion Complete", `Node unlinked successfully. Garbage Collector handles the rest.`, 7, { isSuccess: true });
    } 
    else if (selectedOpId === 'deleteTail') {
        addStep("Method Call", `deleteTail(head) called.`, 1, { currIdx: null });
        addStep("Base Case Check", `if (head == null || head.next == null) check.`, 2, { currIdx: null });
        
        if (list.length <= 1) {
            addStep("Edge Case Met", `List has 1 or 0 elements.`, 2, { currIdx: null, deletedTargetIdx: list.length === 1 ? 0 : null });
            if (list.length === 1) list.pop();
            addStep("Return", `Returning null. List is now empty.`, 2, { isSuccess: true });
            return steps;
        }

        addStep("Initialize Traversal", `Node curr = head;`, 4, { currIdx: 0 });
        let currIdx = 0;
        
        while (currIdx < list.length - 2) {
            addStep("Check Loop Condition", `curr.next.next (${list[currIdx+2].addr}) != null`, 6, { currIdx });
            currIdx++;
            addStep("Advance Pointer", `curr = curr.next`, 7, { currIdx });
        }

        addStep("Loop Terminates", `curr.next.next is null. We reached the second to last node.`, 6, { currIdx });
        addStep("Sever Connection", `curr.next = null. The final node is detached.`, 11, { currIdx, deletedTargetIdx: list.length - 1, severTail: true });
        
        list.pop();
        
        addStep("Deletion Complete", `Return head.`, 13, { isSuccess: true });
    }
    else if (selectedOpId === 'deleteAtPosition') {
        addStep("Method Call", `deleteAtPosition(head, position=${pos}) called.`, 1, { currIdx: null });
        addStep("Empty Check", `if (head == null) check.`, 2, { currIdx: null });
        
        if (list.length === 0) {
            addStep("List Empty", `Returning null.`, 2, { isSuccess: true });
            return steps;
        }

        addStep("Head Deletion Check", `if (position == 1) check.`, 4, { currIdx: null });
        if (pos === 1) {
            addStep("Shift Head", `head = head.next.`, 5, { deletedTargetIdx: 0, headBypass: true });
            list.shift();
            addStep("Return Head", `Return new head.`, 6, { isSuccess: true });
            return steps;
        }

        addStep("Initialize Traversal", `Node curr = head;`, 9, { currIdx: 0 });
        let currIdx = 0;
        let i = 1;
        
        addStep("Loop Condition", `for (i=${i}; i < ${pos-1} && curr != null)`, 11, { currIdx, localI: i });
        
        while (i < pos - 1 && currIdx < list.length) {
            let nextIdx = currIdx + 1 < list.length ? currIdx + 1 : null;
            if (nextIdx !== null) {
               addStep("Advance Pointer", `curr = curr.next`, 12, { currIdx: nextIdx, localI: i });
               currIdx = nextIdx;
            } else {
               currIdx = list.length + 1; // force out of bounds
            }
            i++;
            addStep("Loop Condition", `for (i=${i}; i < ${pos-1} && curr != null)`, 11, { currIdx, localI: i });
        }

        let isOutOfBounds = currIdx >= list.length - 1;

        addStep("Bounds Check", `if (curr == null || curr.next == null) check.`, 16, { currIdx, localI: i });
        
        if (isOutOfBounds) {
            addStep("Out of Bounds", `Target position is out of bounds!`, 17, { currIdx, localI: i, notFound: true, output: "Position out of bounds" });
            addStep("Return Original Head", `Operation aborted.`, 18, { isSuccess: true, notFound: true });
            return steps;
        }

        let targetIdx = currIdx + 1;
        let targetBypassIdx = currIdx + 2 < list.length ? currIdx + 2 : null;
        
        addStep("Bypass Target Node", `curr.next = curr.next.next. Wiring over the deleted node.`, 22, { 
            currIdx, localI: i, deletedTargetIdx: targetIdx, bypassLineTo: targetBypassIdx 
        });

        list.splice(targetIdx, 1);
        
        addStep("Deletion Complete", `Return head.`, 24, { isSuccess: true });
    }

    return steps;
  }, [baseList, selectedOpId, inputPosition]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputPosition]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess && !finalState.notFound) {
         setBaseList([...finalState.list]);
     }
     setCurrentStep(0);
  };

  const handleReset = () => {
      setBaseList([
          generateNode(10, 0, 0), generateNode(20, 1, 1), generateNode(30, 2, 2), generateNode(40, 3, 3)
      ]);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  // Pan & Zoom Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return; // ignore controls
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList } };
  const state = cur.state || { list: baseList };
  
  const { 
      isSuccess, currIdx, localI, output, notFound, 
      deletedTargetIdx, headBypass, severTail, bypassLineTo 
  } = state;

  const activeTheme = 'rose';

  // SVG Drawing function for clean, physical links and dynamic bypasses
  const renderSvgArrows = () => {
    return state.list.map((nodeObj: ListNodeData, idx: number) => {
        const isCurr = currIdx === idx;
        const isDeleted = deletedTargetIdx === idx;
        const isBypassing = bypassLineTo !== undefined && isCurr;
        const isSevering = severTail && isCurr;
        const isHeadBypassed = headBypass && idx === 0;

        let targetIdx: number | null = null;
        
        if (isBypassing) {
            targetIdx = bypassLineTo; // Point to the node after the deleted one
        } else if (isSevering) {
            targetIdx = null; // Severed tail points nowhere
        } else if (idx < state.list.length - 1) {
            targetIdx = idx + 1; // Normal sequence
        }

        // If a node was head bypassed, visually it still points to the next node as it fades away
        if (isHeadBypassed && idx < state.list.length - 1) {
            targetIdx = idx + 1;
        }

        if (targetIdx === null) return null;
        
        const target = state.list[targetIdx];
        if (!target) return null;

        // Origin point: center of the "NEXT" box
        const startX = nodeObj.x + 92; 
        const startY = nodeObj.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = isBypassing || (headBypass && idx === 0);
        const strokeColor = isActive ? '#f59e0b' : (isDeleted ? '#f43f5e' : '#cbd5e1'); // amber, rose, slate
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = (isDeleted || isHeadBypassed) ? 0.3 : (isActive ? 1 : 0.6);
        const strokeDasharray = (isBypassing || isDeleted || isHeadBypassed) ? "6 6" : "none";
        
        const markerId = isActive ? 'arrowhead-active' : (isDeleted ? 'arrowhead-deleted' : 'arrowhead-default');

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic or bypassing into different row)
            if (diffX < 0) {
                 // Backwards / S-Curve leftwards
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 // Forwards / S-Curve rightwards
                 pathD = `M ${startX},${startY} C ${startX + 80},${startY + (diffY/2)} ${endX - 80},${endY - (diffY/2)} ${endX},${endY}`;
            }
        } else {
            // Target is on the SAME row
            if (diffX < 0) {
                 // Strictly backward (Arc UP over nodes)
                 pathD = `M ${startX},${startY} C ${startX + 20},${startY - 60} ${endX - 20},${endY - 60} ${endX},${endY}`;
            } else if (diffX > 200 || isBypassing) {
                 // Forward jump over nodes (Arc DOWN under nodes)
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 80} ${endX - 50},${endY + 80} ${endX},${endY}`;
            } else {
                 // Adjacent Right (Direct link)
                 pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
            }
        }

        return (
            <path 
                key={`link-${nodeObj.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeOpacity={strokeOpacity}
                strokeDasharray={strokeDasharray}
                markerEnd={`url(#${markerId})`} 
                className="transition-all duration-500 ease-in-out" 
            />
        );
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Trash2 size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className="bg-rose-600 p-4 rounded-2xl shadow-lg shadow-rose-100 flex items-center justify-center">
                <Trash2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Linked List Deletion</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded tracking-widest uppercase">Physical Memory View</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Data Structures</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full md:w-auto z-10">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Operations Selector */}
                <div className="grid grid-cols-3 gap-2">
                    {Object.values(OPERATIONS).map((op) => {
                        const isSelected = selectedOpId === op.id;
                        return (
                            <button 
                               key={op.id}
                               onClick={() => { setSelectedOpId(op.id as any); setCurrentStep(0); }}
                               className={`px-2 py-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-rose-600 border-rose-600 text-white shadow-rose-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{op.icon}</div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight leading-none truncate w-full px-1">
                                    {op.title.replace('Delete ', '')}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-rose-400" />
                      <span className="font-bold uppercase text-[10px] text-white">LinkedList.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-rose-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500'}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="rose" />
                      ))}
                  </div>
                </div>

                {/* Method Description Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                      <BookOpen size={14} className="text-rose-600"/> Concept
                   </h4>
                   <p className="text-sm text-slate-500 leading-relaxed italic">
                       {selectedOp.desc}
                   </p>
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black uppercase block pl-1 tracking-widest font-mono ${selectedOpId === 'deleteAtPosition' ? 'text-rose-600' : 'text-slate-400'}`}>Position (1-based)</label>
                        <input type="number" disabled={selectedOpId !== 'deleteAtPosition'} value={selectedOpId !== 'deleteAtPosition' ? '' : inputPosition} onChange={(e) => setInputPosition(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner disabled:opacity-50" placeholder={selectedOpId !== 'deleteAtPosition' ? "N/A" : "3"} />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={handleReset} title="Reset to default list" className="px-4 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <RotateCcw size={16}/>
                      </button>
                      <button onClick={handlePrev} disabled={currentStep === 0} className="px-5 py-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-1 md:w-32 px-6 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                        Step <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${notFound ? 'bg-amber-900 border-amber-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={notFound ? "text-amber-400" : isSuccess ? "text-emerald-400" : "text-rose-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${notFound ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'} border`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line relative z-10">{cur.description}</p>
                </div>

                {/* 2D PHYSICAL MEMORY ARENA */}
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[440px]">
                  
                   <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-200 z-30">
                      <div className="flex items-center gap-4 bg-white/90 px-3 py-1 rounded backdrop-blur shadow-sm">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Network size={14}/> Physical Memory Heap
                          </span>
                      </div>
                      <div className="flex items-center gap-2">
                          {localI !== undefined && (
                              <div className="bg-white/80 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-2 py-1 rounded shadow-sm backdrop-blur animate-in fade-in">
                                  i: {localI}
                              </div>
                          )}
                          {currentStep === trace.length - 1 && isSuccess && !notFound && state.list.length > 0 && (
                              <button onClick={handleApply} className="text-[10px] font-black bg-rose-100 text-rose-700 px-3 py-1.5 rounded hover:bg-rose-200 uppercase tracking-widest flex items-center gap-1 transition-colors z-20 shadow-sm pointer-events-auto">
                                  <Check size={12}/> Clear Garbage
                              </button>
                          )}
                      </div>
                   </div>

                   {/* Terminal Output Viewer (For out of bounds) */}
                   {output && (
                        <div className="absolute top-20 right-6 bg-slate-900 text-amber-400 font-mono text-[10px] p-4 rounded-2xl border border-amber-900/50 shadow-2xl z-40 pointer-events-auto animate-in fade-in zoom-in">
                            <div className="text-slate-500 mb-2 border-b border-slate-700 pb-2 flex items-center gap-2 justify-between">
                                <span className="uppercase tracking-widest text-[9px] font-black">System.out</span>
                                <Terminal size={14}/>
                            </div>
                            <div className="break-words font-bold tracking-widest">
                                {output}
                            </div>
                        </div>
                   )}

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                      <button onClick={toggleFullscreen} title="Fullscreen" className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                   </div>

                   {/* Interactive Canvas - No Scrollbars! */}
                   <div 
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                   >
                       <div 
                          className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none"
                          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                      >
                           
                           {/* SVG Layer for Pointer Arrows */}
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" /> {/* slate-300 */}
                                   </marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /> {/* amber-500 */}
                                   </marker>
                                   <marker id="arrowhead-deleted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /> {/* rose-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              
                              const isCurr = currIdx === idx;
                              const isDeleted = deletedTargetIdx === idx;
                              const isHeadBypassed = headBypass && idx === 0;
                              
                              const isTarget = isCurr || isDeleted || isHeadBypassed;
                              
                              let themeColor = 'slate';
                              if (isDeleted || isHeadBypassed) themeColor = 'rose';
                              else if (isCurr) themeColor = 'emerald';

                              const labels = [];
                              if (idx === 0 && !isHeadBypassed && !isDeleted) labels.push({ text: "head", color: "sky", position: "top" });
                              if (idx === 1 && isHeadBypassed) labels.push({ text: "head", color: "sky", position: "top" });
                              if (isCurr && !isDeleted) labels.push({ text: "curr", color: "emerald", position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className={`absolute transition-all duration-700 z-10 ${isDeleted || isHeadBypassed ? 'opacity-30 grayscale scale-95' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                                          ))}
                                      </div>

                                      {/* The Node Itself */}
                                      <div className="relative group">
                                          <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                          <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isTarget ? `ring-4 ring-${themeColor}-300 scale-105` : ''} bg-white border-${themeColor}-400`}>
                                              <div className={`flex-1 flex justify-center font-mono font-black text-2xl text-${themeColor}-800`}>
                                                  {nodeObj.val}
                                              </div>
                                              <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-${themeColor}-400 bg-${themeColor}-50`}>
                                                  <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                              </div>
                                          </div>

                                          {/* Deletion Cross */}
                                          {(isDeleted || isHeadBypassed) && (
                                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                  <div className="w-full h-1.5 bg-rose-500 -rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                                                  <div className="w-full h-1.5 bg-rose-500 rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                                              </div>
                                          )}

                                          {/* Null indicator embedded below if pointer is null */}
                                          {((idx === state.list.length - 1 && !isDeleted) || (severTail && isCurr)) && (
                                              <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400">null</div>
                                          )}
                                          
                                          {/* Orphaned Null indicator for deleted tail */}
                                          {isDeleted && idx === state.list.length - 1 && (
                                              <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-300 opacity-50">null</div>
                                          )}
                                      </div>
                                  </div>
                              )
                          })}
                       </div>
                   </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview Tab */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-rose-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Deletion Complexity
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
                        "Unlike arrays, Linked Lists do not require physically shifting memory blocks when an element is removed. The operation itself is strictly O(1), but finding the correct node to delete (traversal) may take O(N)."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-2">
                             <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-2">Time: O(1) Head, O(N) Tail/Mid</div>
                             <p className="text-xs text-slate-400 leading-relaxed">Deleting the head requires zero traversal. Deleting anywhere else requires sequential traversal from the start.</p>
                        </div>
                        <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-2">
                             <div className="text-xs font-black uppercase tracking-widest text-sky-400 mb-1 flex items-center gap-2">Space: O(1) Constant</div>
                             <p className="text-xs text-slate-400 leading-relaxed">We only use a <code>curr</code> pointer to traverse. No additional data structures are spawned during deletion.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Database size={14} className="text-rose-500"/> Java's Garbage Collector
                        </h4>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                <strong>The C/C++ Way:</strong> If you write <code>curr.next = curr.next.next</code> in C without calling <code>free()</code> on the bypassed node, you create a <strong>Memory Leak</strong>. The data still occupies RAM but is unreachable.
                            </p>
                            <p>
                                <strong>The Java Way:</strong> Java runs a background process called the Garbage Collector. It tracks object references. When the GC notices that a <code>Node</code> has exactly 0 incoming references (nothing points to it), it marks that memory space as available and cleans it up. You only need to fix the pointers!
                            </p>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>

      {/* --- Fullscreen Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* LEFT SIDEBAR: Code & Logic */}
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-4">
                          <div className="bg-rose-600 p-2 rounded-lg text-white shadow-lg"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Node Deletion</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                          <Minimize size={20}/>
                      </button>
                  </div>

                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line: string, idx: number) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="rose" />
                        ))}
                    </div>

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${isSuccess ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Log</span></div>
                            <span>Line {cur.line}</span>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{cur.phase}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{cur.description}</p>
                    </div>
                  </div>
              </div>

              {/* RIGHT ARENA: The Canvas */}
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Tool Corner */}
                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={resetZoom} title="Reset View" className="p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>

                  {/* FS Corner Next Button */}
                  {!isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex gap-4 animate-in slide-in-from-bottom-10">
                          <button 
                            onClick={handlePrev} 
                            disabled={currentStep === 0}
                            className="px-12 py-6 bg-slate-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(71,85,105,0.3)] hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-500 disabled:opacity-30"
                          >
                              <ChevronLeft size={32}/> PREV STEP
                          </button>
                          <button 
                            onClick={handleNext} 
                            disabled={currentStep === trace.length - 1}
                            className="px-12 py-6 bg-rose-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(225,29,72,0.3)] hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-rose-500 disabled:opacity-30"
                          >
                              NEXT STEP <ChevronRight size={32}/>
                          </button>
                      </div>
                  )}

                  {/* Large Scale Canvas */}
                  <div 
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
                    onPointerDown={handlePointerDown} 
                    onPointerMove={handlePointerMove} 
                    onPointerUp={handlePointerUp} 
                    onPointerLeave={handlePointerUp}
                  >
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.5})` }}>
                           
                           {/* SVG Layer for Pointer Arrows */}
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                                   </marker>
                                   <marker id="arrowhead-active-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData) => {
                              const isCurr = currIdx === nodeObj.id;
                              const isDeleted = deletedTargetIdx === nodeObj.id;
                              const isHeadBypassed = headBypass && nodeObj.id === 0;
                              
                              let themeColor = 'slate';
                              if (isCurr) themeColor = 'emerald';
                              if (isDeleted || isHeadBypassed) themeColor = 'rose';

                              const labels = [];
                              if (isCurr && !isDeleted) labels.push({ text: "curr", color: "emerald", position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className={`absolute transition-all duration-700 z-10 ${isDeleted || isHeadBypassed ? 'opacity-30 grayscale scale-95' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                                          ))}
                                      </div>

                                      {/* The Node Itself */}
                                      <div className="relative group">
                                          <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                          <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isCurr ? `ring-4 ring-${themeColor}-300 scale-105` : ''} bg-white border-${themeColor}-400`}>
                                              <div className={`flex-1 flex justify-center font-mono font-black text-2xl text-${themeColor}-800`}>
                                                  {nodeObj.val}
                                              </div>
                                              <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-${themeColor}-400 bg-${themeColor}-50`}>
                                                  <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* FS Success Overlay */}
                  {isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-rose-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(225,29,72,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
                                <div className="w-24 h-24 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-rose-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">DELETION COMPLETE</h2>
                                <p className="text-rose-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Node successfully removed from memory</p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700">
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
};

// Sub-components
const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, strikethrough = false }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        violet: 'bg-violet-100 text-violet-700 border-violet-200',
        slate: 'bg-white text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];

    return (
        <div className={`flex flex-col items-center justify-center animate-in zoom-in duration-300 z-10`}>
            <span className={`text-[8px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm ${activeColorClass} ${strikethrough ? 'line-through opacity-50' : ''}`}>
                {label}
            </span>
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    return null; // Rendered inline in parent to handle dynamic absolute positioning & labels
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|deleteHead|deleteTail|deleteAtPosition)\b|\b\d+\b)/g).filter(Boolean);
  
  const activeStyles = { bg: `bg-${theme}-500/10`, border: `border-${theme}-500`, text: `text-${theme}-400` };

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//') || part.startsWith('#')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'static'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['deleteHead', 'deleteTail', 'deleteAtPosition'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
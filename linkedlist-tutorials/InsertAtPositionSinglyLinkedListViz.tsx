import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, Terminal, PlusCircle, AlertCircle, RotateCcw,
  ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

const OPERATIONS = {
  insertAtPosition: {
    id: 'insertAtPosition',
    title: 'Insert at Position N',
    icon: <PlusCircle size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node insertAtPosition(Node head, int position, int data) {
    Node newNode = new Node(data);
    
    // If inserting at the beginning (position 1)
    if (position == 1) {
        newNode.next = head;
        return newNode;
    }
    
    Node curr = head;
    // Traverse to the node just before the position
    for (int i = 1; i < position - 1 && curr != null; i++) {
        curr = curr.next;
    }
    
    // If position is out of bounds
    if (curr == null) {
        System.out.println("Position out of bounds");
        return head;
    }
    
    // Insert the new node
    newNode.next = curr.next;
    curr.next = newNode;
    
    return head;
}`,
    desc: "To insert a node at a specific position, we must traverse the list to find the node right before our target position. Then, we wire the new node into the sequence by updating two pointers."
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
  nextId: number | null;
  x: number;
  y: number;
}

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6 text-emerald-600">
          <BookOpen size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Insert at Specific Position</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Inserting a node at a specific position requires finding the correct spot in the chain and carefully rewiring the pointers. Unlike arrays where elements must be physically shifted in memory, linked lists only require updating the <code>next</code> memory addresses!
        </p>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 font-mono text-sm">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
               <GitCommit size={14} className="text-emerald-500"/> The Rewiring Process
           </h4>
           <p className="text-slate-600 leading-relaxed text-xs">Assume we want to insert <code className="bg-white border border-slate-200 px-1 rounded text-emerald-600">99</code> at position <strong>3</strong>.</p>
           
           <div className="space-y-4 pt-2">
               <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-black text-emerald-500 w-6">1.</span>
                  <span className="text-slate-500 text-xs">Traverse to the node just <em>before</em> the target (Position 2). Call it <code>curr</code>.</span>
               </div>
               <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-black text-emerald-500 w-6">2.</span>
                  <span className="text-slate-500 text-xs">Link the new node to the rest of the list: <code>newNode.next = curr.next</code></span>
               </div>
               <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-black text-emerald-500 w-6">3.</span>
                  <span className="text-slate-500 text-xs">Link <code>curr</code> to the new node: <code>curr.next = newNode</code></span>
               </div>
           </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mt-8">
            <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={16}/> Warning: Order Matters!
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
                You <strong>must</strong> link the new node to the rest of the list <em>before</em> you change <code>curr.next</code>. If you execute <code>curr.next = newNode</code> first, you will permanently lose the memory address of the rest of the list!
            </p>
        </div>
      </div>
    </div>
  </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null = null, forceIndex?: number): ListNodeData => {
    // 3 columns, spread out significantly to show pointer leaps clearly
    const index = forceIndex !== undefined ? forceIndex : id;
    const col = index % 3;
    const row = Math.floor(index / 3);
    
    const x = 100 + col * 260; 
    const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); // Staggered Y

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

export default function InsertAtPositionSinglyLinkedListViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'interview'>('visualizer');
  const [inputValue, setInputValue] = useState('99');
  const [inputPosition, setInputPosition] = useState('3');
  const [nodeCounter, setNodeCounter] = useState(4); 
  
  const [baseHead, setBaseHead] = useState<number | null>(0);
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedOpId = 'insertAtPosition';
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
          generateNode(10, 0, 1, 0),
          generateNode(20, 1, 2, 1),
          generateNode(30, 2, 3, 2),
          generateNode(40, 3, null, 3)
      ]);
      setBaseHead(0);
      setNodeCounter(4);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, []);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));
    let headId = baseHead;
    let val = parseInt(inputValue);
    let pos = parseInt(inputPosition);
    let nextIdAlloc = nodeCounter;
    
    if (isNaN(val)) val = 99;
    if (isNaN(pos)) pos = 3;

    const updateNextId = (targetId: number, newNextId: number | null) => {
        let node = list.find(n => n.id === targetId);
        if(node) node.nextId = newNextId;
    };

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { 
            list: list.map(n=>({...n})), 
            headId, 
            ...stateProps 
        }
      });
    };

    // Generate physical position for new node based on current allocation counter
    let newAllocatedNode = generateNode(val, nextIdAlloc, null, nextIdAlloc);
    
    addStep("Method Call", `insertAtPosition(head, position=${pos}, data=${val}) called.`, 1, { currId: null });
    
    list.push(newAllocatedNode);
    addStep("Memory Allocation", `Executing 'new Node(${val})'. The JVM allocates a new block of memory at ${newAllocatedNode.addr}.`, 2, { newNodeId: newAllocatedNode.id, activeNodeId: newAllocatedNode.id });

    if (pos === 1) {
        addStep("Check Position", `position == 1 is true. We are inserting a new head!`, 5, { newNodeId: newAllocatedNode.id });
        
        updateNextId(newAllocatedNode.id, headId);
        addStep("Link New Node", `newNode.next = head. The new node points to ${headId !== null ? list.find(n=>n.id===headId)?.addr : 'null'}.`, 6, { newNodeId: newAllocatedNode.id, activeLinkId: newAllocatedNode.id });
        
        headId = newAllocatedNode.id;
        addStep("Update Head", `return newNode; The new node becomes the official head of the list.`, 7, { isSuccess: true, newNodeId: newAllocatedNode.id });
        return steps;
    }

    addStep("Check Position", `position == 1 is false.`, 5, { newNodeId: newAllocatedNode.id });
    
    let currId: number | null = headId;
    addStep("Initialize Traversal", `Set 'curr' pointer to head (${headId !== null ? list.find(n=>n.id===headId)?.addr : 'null'}).`, 10, { newNodeId: newAllocatedNode.id, currId });

    let i = 1;
    
    addStep("Loop Condition", `Checking: i=1 < position-1=${pos-1} && curr != null.`, 12, { newNodeId: newAllocatedNode.id, currId, localI: i });

    while (i < pos - 1 && currId !== null) {
        let currNode = list.find(n=>n.id===currId);
        let nextIdx = currNode?.nextId ?? null;
        
        currId = nextIdx;
        addStep("Advance Pointer", `Moving 'curr' forward to curr.next (${nextIdx !== null ? list.find(n=>n.id===nextIdx)?.addr : 'null'}).`, 13, { newNodeId: newAllocatedNode.id, currId, localI: i });
        
        i++;
        addStep("Loop Condition", `Checking: i=${i} < position-1=${pos-1} && curr != null.`, 12, { newNodeId: newAllocatedNode.id, currId, localI: i });
    }

    addStep("Loop Terminates", `We reached the target node right before the insertion point.`, 12, { newNodeId: newAllocatedNode.id, currId, localI: i });
    addStep("Check Bounds", `if (curr == null)`, 17, { newNodeId: newAllocatedNode.id, currId });

    if (currId === null) {
        addStep("Out of Bounds", `curr is null! The position ${pos} is larger than the list length.`, 18, { newNodeId: newAllocatedNode.id, currId, notFound: true, output: "Position out of bounds" });
        addStep("Return Original Head", `Operation aborted. List structure remains unchanged.`, 19, { isSuccess: true, newNodeId: newAllocatedNode.id });
        return steps;
    }

    // Insertion execution
    let currNode = list.find(n=>n.id===currId);
    let originalNextId = currNode?.nextId ?? null;
    
    updateNextId(newAllocatedNode.id, originalNextId);
    addStep("Link to Rest of List", `newNode.next = curr.next; New node is wired to the right side of the split.`, 23, { 
        newNodeId: newAllocatedNode.id, currId, activeLinkId: newAllocatedNode.id 
    });

    updateNextId(currId, newAllocatedNode.id);
    addStep("Link Previous Node", `curr.next = newNode; The left side is wired to the new node. Splicing complete!`, 24, { 
        newNodeId: newAllocatedNode.id, currId, activeLinkId: currId 
    });

    addStep("Insertion Complete", `Node integrated successfully into the chain. Return head.`, 26, { isSuccess: true });

    return steps;
  }, [baseList, baseHead, inputValue, inputPosition, nodeCounter]);

  // Reset step when input changes
  useEffect(() => { setCurrentStep(0); }, [inputValue, inputPosition]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess && !finalState.notFound) {
         setBaseList([...finalState.list]);
         setBaseHead(finalState.headId);
         setNodeCounter(prev => prev + 1);
     }
     setCurrentStep(0);
  };

  const handleReset = () => {
      setBaseList([
          generateNode(10, 0, 1, 0),
          generateNode(20, 1, 2, 1),
          generateNode(30, 2, 3, 2),
          generateNode(40, 3, null, 3)
      ]);
      setBaseHead(0);
      setNodeCounter(4);
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

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList, headId: baseHead } };
  const state = cur.state || { list: baseList, headId: baseHead };
  
  const { 
      isSuccess, currId, localI, output, notFound, 
      newNodeId, activeNodeId, activeLinkId, headId 
  } = state;

  const activeTheme = 'emerald';

  // SVG Drawing function for clean, physical links
  const renderSvgArrows = () => {
    return state.list.map((node: ListNodeData) => {
        if (node.nextId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === node.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box
        const startX = node.x + 92; 
        const startY = node.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = activeLinkId === node.id;
        const strokeColor = isActive ? '#f59e0b' : '#94a3b8'; // amber-500 or slate-400
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic or inserting into different row)
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
            } else if (diffX > 200) {
                 // Forward jump over nodes (Arc DOWN under nodes)
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 80} ${endX - 50},${endY + 80} ${endX},${endY}`;
            } else {
                 // Adjacent Right (Direct link)
                 pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
            }
        }

        return (
            <path 
                key={`link-${node.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeOpacity={strokeOpacity}
                markerEnd={marker} 
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
              <Network size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
                <PlusCircle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Insert At Position</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">GfG Tutorial</span>
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
                
                {/* Method Description Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                      <BookOpen size={14} className="text-emerald-600"/> Insert At Position
                   </h4>
                   <p className="text-sm text-slate-500 leading-relaxed italic">
                       {selectedOp.desc}
                   </p>
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-emerald-400" />
                      <span className="font-bold uppercase text-[10px] text-white">LinkedList.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-emerald-500/20 border-emerald-500'}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="emerald" />
                      ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Insert Data</label>
                        <input type="number" value={inputValue} onChange={(e) => { setInputValue(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" placeholder="99" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Position (1-based)</label>
                        <input type="number" value={inputPosition} onChange={(e) => { setInputPosition(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" placeholder="3" />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={handleReset} title="Reset to default list" className="px-4 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <RotateCcw size={16}/>
                      </button>
                      <button onClick={handlePrev} disabled={currentStep === 0} className="px-5 py-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-1 md:w-32 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        Step <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${notFound ? 'bg-rose-900 border-rose-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={notFound ? "text-rose-400" : "text-emerald-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${notFound ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'} border`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line relative z-10">{cur.description}</p>
                </div>

                {/* 2D PHYSICAL MEMORY ARENA */}
                <div className="bg-slate-50 bg-[linear-gradient(to_right,#cbd5e130_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e130_1px,transparent_1px)] bg-[size:20px_20px] rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col shadow-inner overflow-hidden min-h-[460px]">
                  
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
                          {currentStep === trace.length - 1 && isSuccess && !notFound && (
                              <button onClick={handleApply} className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-200 uppercase tracking-widest flex items-center gap-1 transition-colors z-20 shadow-sm">
                                  <Check size={12}/> Confirm Mutation
                              </button>
                          )}
                      </div>
                   </div>

                   {/* Terminal Output Viewer (For out of bounds) */}
                   {output && (
                        <div className="absolute top-20 right-6 bg-slate-900 text-rose-400 font-mono text-[10px] p-4 rounded-2xl border border-rose-900/50 shadow-2xl z-40 pointer-events-auto animate-in fade-in zoom-in">
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
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                      <button onClick={toggleFullscreen} title="Fullscreen" className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
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
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData) => {
                              
                              const isHead = headId === nodeObj.id;
                              const isCurr = currId === nodeObj.id;
                              const isNewNode = newNodeId === nodeObj.id;
                              
                              const isTarget = isHead || isCurr || isNewNode;
                              const isAllocating = activeNodeId === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isAllocating) themeColor = 'amber';
                              else if (isNewNode) themeColor = 'amber';
                              else if (isCurr) themeColor = 'sky';
                              else if (isHead) themeColor = 'emerald';

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "emerald", position: "top" });
                              if (isCurr) labels.push({ text: "curr", color: "sky", position: "bottom" });
                              if (isNewNode) labels.push({ text: "newNode", color: "amber", position: "top" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
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

                                          {/* Null indicator embedded below if pointer is null */}
                                          {nodeObj.nextId === null && (
                                              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
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
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Insertion Complexity
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
                        "While the actual pointer rewiring step is strictly O(1), finding the correct insertion position requires traversing the list from the head. This makes the overall time complexity O(N) in the worst case."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-2">
                             <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-2">Time: O(N) Worst Case</div>
                             <p className="text-xs text-slate-400 leading-relaxed">If you insert at position N (the tail), you must traverse all N nodes. If inserting at the head, it's O(1).</p>
                        </div>
                        <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-2">
                             <div className="text-xs font-black uppercase tracking-widest text-sky-400 mb-1 flex items-center gap-2">Space: O(1) Constant</div>
                             <p className="text-xs text-slate-400 leading-relaxed">Only a single <code>newNode</code> object and a <code>curr</code> pointer are allocated, regardless of list size.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                           <Database size={14} className="text-emerald-500"/> Arrays vs Linked Lists (Insertion)
                        </h4>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                <strong>Arrays:</strong> Inserting an element into the middle of an array requires shifting every subsequent element one position to the right to make room. This is physically moving data in RAM, taking O(N) time just for the shift.
                            </p>
                            <p>
                                <strong>Linked Lists:</strong> Inserting an element into the middle of a linked list requires zero shifting. The new node is allocated wherever there is free space in the heap. We simply update two memory addresses (<code>newNode.next</code> and <code>curr.next</code>) to thread it into the existing sequence!
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
                          <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Insert At Position</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                          <Minimize size={20}/>
                      </button>
                  </div>

                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line: string, idx: number) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="emerald" />
                        ))}
                    </div>

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${notFound ? 'bg-rose-900/40 border-rose-800' : isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={resetZoom} title="Reset View" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><RotateCcw size={24}/></button>
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
                            className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-emerald-500 disabled:opacity-30"
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
                              
                              const isHead = headId === nodeObj.id;
                              const isCurr = currId === nodeObj.id;
                              const isNewNode = newNodeId === nodeObj.id;
                              
                              const isTarget = isHead || isCurr || isNewNode;
                              const isAllocating = activeNodeId === nodeObj.id;
                              
                              let themeColor = 'slate';
                              if (isAllocating) themeColor = 'amber';
                              else if (isNewNode) themeColor = 'amber';
                              else if (isCurr) themeColor = 'sky';
                              else if (isHead) themeColor = 'emerald';

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "emerald", position: "top" });
                              if (isCurr) labels.push({ text: "curr", color: "sky", position: "bottom" });
                              if (isNewNode) labels.push({ text: "newNode", color: "amber", position: "top" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-500 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
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

                                          {/* Null indicator embedded below if pointer is null */}
                                          {nodeObj.nextId === null && (
                                              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                                          )}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* FS Success Overlay */}
                  {isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">INSERTION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Node successfully inserted at position {inputPosition}</p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
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
    // Rendered inline in parent to handle dynamic absolute positioning & labels
    return null;
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|insertAtPosition)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['insertAtPosition'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
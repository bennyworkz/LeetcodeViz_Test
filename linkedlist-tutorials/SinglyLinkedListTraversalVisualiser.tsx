import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  Layers, FileText, ArrowRight, ArrowDown, ArrowUp,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, Terminal, ListOrdered, RefreshCw,
  RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

const OPERATIONS = {
  traverseIterative: {
    id: 'traverseIterative',
    title: 'Iterative Traversal',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public static void traverseList(Node head) {
    while (head != null) {
        System.out.print(head.data);
        if (head.next != null)
            System.out.print(" -> ");
        head = head.next;
    }
    System.out.println();
}`,
    desc: "The process of traversing a singly linked list involves printing the value of each node and then going on to the next node, and so on, till we reach the last node whose next pointer is null."
  },
  traverseRecursive: {
    id: 'traverseRecursive',
    title: 'Recursive Traversal',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `static void traverseList(Node head) {
    // base condition is when the head is null
    if (head == null) {
        System.out.println();
        return;
    }
    // printing the current node data
    System.out.print(head.data);
    // print arrow if not the last node
    if (head.next != null) {
        System.out.print(" -> ");
    }
    // moving to the next node
    traverseList(head.next);
}`,
    desc: "We start at the head node, check if it is null, print its value, and then call the traversal function again with the next node passed as a pointer. Note the O(N) auxiliary space for the call stack!"
  }
};

// Component interfaces
interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  active?: boolean;
  offset?: number;
  strikethrough?: boolean;
}

interface ListNodeBlockProps {
  val: number;
  address: string;
  nextAddr: string;
  themeColor?: string;
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
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <BookOpen size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Traversal of Singly Linked List</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Traversal of Singly Linked List is one of the fundamental operations, where we traverse or visit each node of the linked list. In this article, we will cover how to traverse all the nodes of a singly linked list.
        </p>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 font-mono text-sm">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-2">Example:</h4>
           <div className="flex items-center gap-4">
              <span className="font-bold text-slate-400 w-16">Input:</span>
              <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  10 <ArrowRight size={14} className="mx-2"/> 20 <ArrowRight size={14} className="mx-2"/> 30 <ArrowRight size={14} className="mx-2"/> 40
              </div>
           </div>
           <div className="flex items-center gap-4">
              <span className="font-bold text-slate-400 w-16">Output:</span>
              <span className="text-slate-800 font-bold">10 -{'>'} 20 -{'>'} 30 -{'>'} 40</span>
           </div>
           <p className="text-slate-500 italic mt-2 text-xs">Explanation: Every element of each node from head node to last node is printed which means we have traversed each node successfully.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <ListOrdered size={80}/>
                </div>
                <h3 className="text-lg font-black text-emerald-800 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><ListOrdered size={18}/></div>
                    Iterative Approach
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                    We initialize a temporary pointer to the head node. While the pointer is not null, we access and print the data of the current node, then we move the pointer to the next node using <code>head = head.next</code>.
                </p>
                <div className="pt-4 border-t border-emerald-50 text-xs font-bold text-emerald-700">
                    Time: O(N) | Space: O(1)
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-fuchsia-100 shadow-sm space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <RefreshCw size={80}/>
                </div>
                <h3 className="text-lg font-black text-fuchsia-800 flex items-center gap-2">
                    <div className="p-1.5 bg-fuchsia-100 rounded-lg text-fuchsia-600"><RefreshCw size={18}/></div>
                    Recursive Approach
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                    We start at the head node. If it is null, we return (Base Case). Otherwise, we print its value, and then make a recursive call to the function passing <code>head.next</code> as the parameter.
                </p>
                <div className="pt-4 border-t border-fuchsia-50 text-xs font-bold text-fuchsia-700">
                    Time: O(N) | Space: O(N)
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const InterviewTab = () => (
    <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
       <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <Trophy size={140} />
           </div>
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Iterative vs Recursive Traversal
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "While both approaches visit every node and take O(N) time, the recursive approach has a hidden cost: the Call Stack. Every recursive call consumes a stack frame in memory. For very large linked lists, recursive traversal can cause a StackOverflowError."
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-2"><ListOrdered size={14}/> Iterative Space: O(1)</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Uses only a single pointer (`head`) which is updated in a loop. No extra memory is allocated regardless of list size.</p>
               </div>
               <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-rose-400 mb-1 flex items-center gap-2"><RefreshCw size={14}/> Recursive Space: O(N)</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Pushes a new function execution frame to the JVM call stack for every single node in the list. Extremely dangerous for millions of nodes.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Database size={14} className="text-indigo-500"/> Why modify 'head' locally?
               </h4>
               <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                   <p>
                       In the GeeksforGeeks code, you might notice we use <code>while (head != null)</code> and <code>head = head.next</code>. Won't this destroy the linked list?
                   </p>
                   <p className="font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                       No! Java uses "Pass-by-Value" for object references. 
                   </p>
                   <p>
                       When you call <code>traverseList(head)</code> in <code>main()</code>, you are passing a <em>copy of the memory address</em> to the method. The <code>head</code> variable inside <code>traverseList</code> is a completely separate, local variable. Reassigning it only moves the local pointer, leaving the original list structure inside <code>main()</code> completely untouched!
                   </p>
               </div>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    // 3 columns, spread out significantly to show pointer leaps clearly
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

export default function SinglyLinkedListTraversalVisualiser() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('traverseIterative');
  const [inputValue, setInputValue] = useState('10, 20, 30, 40, 50, 60');
  
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

  // Helper for memory addresses
  const getAddr = (idx: number | null | undefined) => {
    if (idx === null || idx === undefined) return 'null';
    return '0x' + (100 + idx * 32).toString(16).toUpperCase().padStart(3, '0');
  };

  // Parse input string to array of physical nodes
  useEffect(() => {
      const vals = inputValue.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const nodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(nodes);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [inputValue, selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    // We deep clone baseList for state snapshots, though traversal doesn't mutate nodes
    let list = baseList.map(n => ({...n}));
    
    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n => ({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'traverseIterative') {
        let currIdx: number | null = 0;
        let out = "";
        
        let headAddr = getAddr(currIdx);
        addStep("Method Call", `traverseList(head) called. Local variable 'head' receives address ${headAddr}.`, 1, { curr: currIdx, output: out, activeLinkId: null });
        
        while (currIdx !== null) {
            let currNode = list.find(n => n.id === currIdx);
            addStep("Loop Condition", `head (${currNode?.addr}) is not null. Entering loop.`, 2, { curr: currIdx, output: out, activeLinkId: null });
            
            out += currNode?.val.toString() || "";
            addStep("Print Data", `System.out.print(head.data); Outputting value ${currNode?.val}.`, 3, { curr: currIdx, output: out, activeLinkId: null });
            
            let nextIdx = currNode?.nextId ?? null;
            let nextNode = list.find(n => n.id === nextIdx);

            if (nextIdx !== null) {
                addStep("Check Next Node", `head.next (${nextNode?.addr}) is not null.`, 4, { curr: currIdx, output: out, activeLinkId: null });
                out += " -> ";
                addStep("Print Arrow", `System.out.print(" -> ") executes.`, 5, { curr: currIdx, output: out, activeLinkId: null });
            } else {
                addStep("Check Next Node", `head.next is null. Arrow print is skipped.`, 4, { curr: currIdx, output: out, activeLinkId: null });
            }
            
            addStep("Advance Pointer", `head = head.next; The local 'head' variable updates to point to ${nextNode !== null && nextNode !== undefined ? nextNode.addr : 'null'}.`, 6, { curr: currIdx, nextCurr: nextIdx, output: out, activeLinkId: currIdx });
            currIdx = nextIdx;
        }
        
        addStep("Loop Terminates", "head is now null. The while loop safely exits.", 2, { curr: null, output: out, activeLinkId: null });
        addStep("End of Traversal", "System.out.println(); prints a new line. Execution finished.", 8, { curr: null, output: out, activeLinkId: null, isSuccess: true });
    }
    else if (selectedOpId === 'traverseRecursive') {
        let out = "";
        let callStack: any[] = [];
        
        const recurse = (currIdx: number | null, depth: number) => {
            callStack.push({ node: currIdx, depth });
            let currNode = list.find(n => n.id === currIdx);
            let addrStr = currNode !== undefined ? currNode.addr : 'null';
            
            addStep("Recursive Call", `traverseList(${addrStr}) pushed onto Call Stack (Depth: ${depth}).`, 1, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
            
            addStep("Base Condition Check", `if (head == null) -> Is ${addrStr} null?`, 3, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
            
            if (currIdx === null) {
                addStep("Base Case Met", `head is null! Printing newline and returning to unwind the stack.`, 4, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
                callStack.pop();
                return;
            }
            
            out += currNode?.val.toString();
            addStep("Print Data", `System.out.print(head.data); Outputting value ${currNode?.val}.`, 8, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
            
            let nextIdx = currNode?.nextId ?? null;
            let nextNode = list.find(n => n.id === nextIdx);

            if (nextIdx !== null) {
                addStep("Check Next Node", `if (head.next != null) -> ${nextNode?.addr} is not null.`, 10, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
                out += " -> ";
                addStep("Print Arrow", `System.out.print(" -> ") executes.`, 11, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
            } else {
                addStep("Check Next Node", `head.next is null. Arrow print is skipped.`, 10, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
            }
            
            let nextAddrStr = nextNode !== undefined ? nextNode.addr : 'null';
            addStep("Recursive Dive", `traverseList(${nextAddrStr}); Pausing execution of Depth ${depth}...`, 14, { curr: currIdx, output: out, callStack: [...callStack], recursivelyCalling: true, activeLinkId: currIdx });
            
            recurse(nextIdx, depth + 1);
            
            addStep("Resume & Pop", `Resuming and finishing execution for Depth ${depth}. Popping off Call Stack.`, 15, { curr: currIdx, output: out, callStack: [...callStack], activeLinkId: null });
            callStack.pop();
        };
        
        recurse(0, 1);
        addStep("Traversal Complete", "All recursive stack frames successfully resolved.", 15, { curr: null, output: out, callStack: [], activeLinkId: null, isSuccess: true });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click play to simulate.', line: 1, state: { list: baseList } });
    return steps;
  }, [baseList, selectedOpId]);

  // Reset step when operation or input changes
  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputValue]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

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
  const { isSuccess, curr, nextCurr, output, callStack, recursivelyCalling, activeLinkId } = state;

  const getThemeColor = () => selectedOpId === 'traverseIterative' ? 'indigo' : 'fuchsia';
  const activeTheme = getThemeColor();

  // SVG Drawing function for clean, non-distracting links
  const renderSvgArrows = () => {
    return state.list.map((node: ListNodeData) => {
        if (node.nextId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === node.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box (Node width: 112px w-28. NEXT box rightmost 40%. Center is approx ~92px).
        const startX = node.x + 92; 
        const startY = node.y + 28; // height is 56 (h-14)

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = activeLinkId === node.id || (recursivelyCalling && curr === node.id);
        const strokeColor = isActive ? '#f59e0b' : '#94a3b8'; // amber-500 or slate-400
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = isActive ? 1 : 0.5;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic - smooth S-Curve)
            pathD = `M ${startX},${startY} C ${startX + 80},${startY + 40} ${endX - 80},${endY - 40} ${endX},${endY}`;
        } else {
            // Target is on the SAME row, Adjacent Right (Direct link)
            pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
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
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <GitCommit className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">List Traversal</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Memory Simulator</span>
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
        {activeTab === 'interview' && <InterviewTab />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Approaches & Code (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Operations Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => {
                        const isSelected = selectedOpId === op.id;
                        let btnColor = op.id === 'traverseIterative' ? 'indigo' : 'fuchsia';
                        
                        return (
                            <button 
                               key={op.id}
                               onClick={() => { setSelectedOpId(op.id as any); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? `bg-${btnColor}-600 border-${btnColor}-600 text-white shadow-${btnColor}-200 scale-[1.02]` : `bg-white border-slate-200 text-slate-500 hover:border-${btnColor}-300 hover:bg-slate-50`}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? `bg-${btnColor}-500 text-white` : 'bg-slate-100 text-slate-400'}`}>{op.icon}</div>
                                  <span className="text-[12px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {op.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[10px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? `text-${btnColor}-100` : 'text-slate-400'}`}>
                                    <span>{op.complexity}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className={`text-${activeTheme}-400`} />
                      <span className="font-bold uppercase text-[10px] text-white">LinkedList.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className={`text-${activeTheme}-400`} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 16.5) + 16}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'emerald' : activeTheme} />
                      ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Nodes to Traverse</label>
                        <input type="text" value={inputValue} onChange={(e) => { setInputValue(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30, 40, 50, 60" />
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto mt-2 md:mt-0">
                      <button onClick={() => setCurrentStep(0)} title="Reset Simulation" className="px-4 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <RotateCcw size={16}/>
                      </button>
                      <button onClick={handlePrev} disabled={currentStep === 0} className="px-5 py-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className={`flex-1 sm:w-32 px-6 py-3 bg-${activeTheme}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-${activeTheme}-100 hover:bg-${activeTheme}-700 transition-all flex items-center justify-center gap-2`}>
                        Step <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? `bg-emerald-900 border-emerald-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
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
                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 bg-white/90 px-3 py-1 rounded backdrop-blur shadow-sm">
                         Nodes fixed in RAM. Pointers flow across heap.
                      </div>
                   </div>

                   {/* Fixed Console Output */}
                   {state.output !== undefined && (
                    <div className="absolute top-20 right-6 bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 w-56 shadow-2xl z-40 pointer-events-auto animate-in slide-in-from-right-8">
                      <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                        <span className="uppercase tracking-widest font-black text-[9px]">Console Output</span>
                        <Terminal size={12}/>
                      </div>
                      <div className="break-words font-black text-xs tracking-widest leading-relaxed">
                        {state.output || <span className="text-slate-600 font-normal italic">Waiting for print...</span>}
                        {!isSuccess && <span className="animate-pulse ml-1 text-emerald-600">_</span>}
                      </div>
                    </div>
                  )}

                   {/* Recursive Call Stack UI */}
                   {selectedOpId === 'traverseRecursive' && callStack && callStack.length > 0 && (
                       <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                           <div className={`bg-slate-900 border border-slate-700 rounded-xl p-3 w-56 flex flex-col shadow-xl animate-in slide-in-from-bottom-4`}>
                               <span className={`text-[9px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-1 justify-between`}>Call Stack Memory (O(N)) <Layers size={10}/></span>
                               <div className={`flex flex-col-reverse gap-1 justify-end h-28 w-full border-b-2 border-fuchsia-500/50 pb-1 overflow-y-auto scrollbar-thin`}>
                                   {callStack.map((frame:any, i:number) => {
                                        // Find the original node's memory address to display in the call stack
                                        const origNode = baseList.find(n => n.id === frame.node);
                                        const addrStr = origNode ? origNode.addr : 'null';

                                        return (
                                            <div key={i} className={`p-1.5 rounded flex justify-between items-center transition-all ${i === callStack.length - 1 ? 'bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 shadow-md' : 'bg-slate-800/50 text-slate-500 text-[10px] font-mono'}`}>
                                                <span className="text-[10px] font-black font-mono">traverse({addrStr})</span>
                                                <span className="opacity-50 text-[8px]">D:{frame.depth}</span>
                                            </div>
                                        )
                                   })}
                               </div>
                           </div>
                       </div>
                   )}

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                      <button onClick={toggleFullscreen} title="Fullscreen Mode" className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
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
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /> {/* slate-400 */}
                                   </marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /> {/* amber-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData) => {
                              
                              // Dynamic targets based on operation
                              const isCurr = curr === nodeObj.id;
                              const isNextCurr = nextCurr === nodeObj.id;
                              
                              const isTarget = isCurr || isNextCurr;
                              
                              // Theme assignments to separate nodes visually
                              let themeColor = 'slate';
                              if (isCurr) themeColor = activeTheme;

                              const labels = [];
                              if (isCurr) labels.push({ text: "head (local)", color: activeTheme, position: "top" });
                              if (isNextCurr && selectedOpId === 'traverseIterative') labels.push({ text: "head (new)", color: "amber", position: "bottom" });

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
                          
                          {/* Trailing Null Pointer Label if curr reached end */}
                          {curr === null && state.list.length > 0 && (
                              <div className="absolute z-20" style={{ left: state.list[state.list.length-1]?.x + 180, top: state.list[state.list.length-1]?.y }}>
                                  <div className="relative flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[12px] font-mono text-slate-400 font-bold mb-4 mt-2">null</span>
                                      <PointerLabel label="head (local)" color={activeTheme} position="bottom" active={true} offset={0} />
                                  </div>
                              </div>
                          )}

                       </div>
                   </div>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- True Fullscreen Desktop Experience --- */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* LEFT SIDEBAR: Code & Operations */}
          <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
            <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`bg-${activeTheme}-600 p-2 rounded-lg text-white shadow-lg`}><GitCommit size={20}/></div>
                <span className="text-white font-black text-sm uppercase tracking-[0.2em]">List Traversal</span>
              </div>
              <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                <Minimize size={20}/>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
              {/* Operations Selector */}
              <div className="mb-6">
                <h3 className="text-white font-black text-lg mb-4">Traversal Methods</h3>
                <div className="space-y-2">
                  {Object.values(OPERATIONS).map((op) => {
                    const isSelected = selectedOpId === op.id;
                    const btnColor = op.id === 'traverseIterative' ? 'indigo' : 'fuchsia';
                    
                    return (
                      <button
                        key={op.id}
                        onClick={() => { setSelectedOpId(op.id as keyof typeof OPERATIONS); setCurrentStep(0); }}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          isSelected
                            ? `bg-${btnColor}-600 text-white`
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {op.icon}
                          <span className="font-bold">{op.title}</span>
                        </div>
                        <div className="text-xs opacity-75">{op.complexity}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Display */}
              <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                {selectedOp.code.split('\n').map((line, idx) => (
                  <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={activeTheme} />
                ))}
              </div>

              {/* Execution Log */}
              <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${
                isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                  <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Operations</span></div>
                  <span>Line {String(cur.line || 0)}</span>
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(cur.phase || "")}</div>
                <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(cur.description || "")}</p>
              </div>

              {/* Console Output */}
              {state.output !== undefined && (
                <div className="mt-4 bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 shadow-2xl">
                  <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                    <span className="uppercase tracking-widest font-black text-[9px]">Console Output</span>
                    <Terminal size={12}/>
                  </div>
                  <div className="break-words font-black text-xs tracking-widest leading-relaxed">
                    {state.output || <span className="text-slate-600 font-normal italic">Waiting for print...</span>}
                    {!isSuccess && <span className="animate-pulse ml-1 text-emerald-600">_</span>}
                  </div>
                </div>
              )}

              {/* Recursive Call Stack */}
              {selectedOpId === 'traverseRecursive' && callStack && callStack.length > 0 && (
                <div className="mt-4 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl">
                  <span className="text-[9px] font-black uppercase text-fuchsia-400 tracking-widest mb-2 font-mono flex items-center gap-1 justify-between">Call Stack Memory (O(N)) <Layers size={10}/></span>
                  <div className="flex flex-col-reverse gap-1 justify-end h-28 w-full border-b-2 border-fuchsia-500/50 pb-1 overflow-y-auto scrollbar-thin">
                    {callStack.map((frame: any, i: number) => {
                      const origNode = baseList.find(n => n.id === frame.node);
                      const addrStr = origNode ? origNode.addr : 'null';

                      return (
                        <div key={i} className={`p-1.5 rounded flex justify-between items-center transition-all ${i === callStack.length - 1 ? 'bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 shadow-md' : 'bg-slate-800/50 text-slate-500 text-[10px] font-mono'}`}>
                          <span className="text-[10px] font-black font-mono">traverse({addrStr})</span>
                          <span className="opacity-50 text-[8px]">D:{frame.depth}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ARENA: The Canvas */}
          <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
            
            {/* Floating Tool Corner */}
            <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
              <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                <button onClick={resetZoom} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
              </div>
            </div>

            {/* FS Corner Next Button */}
            {!isSuccess && (
              <div className="absolute bottom-10 right-10 z-[110] flex gap-4 animate-in slide-in-from-bottom-10">
                <button 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  className="px-12 py-6 bg-slate-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(71,85,105,0.3)] hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-500 disabled:opacity-50"
                >
                  <ChevronLeft size={32}/> PREV STEP
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={currentStep === trace.length - 1}
                  className={`px-12 py-6 bg-${activeTheme}-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-${activeTheme}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${activeTheme}-500 disabled:opacity-50`}
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
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                    </marker>
                    <marker id="arrowhead-active-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  {renderSvgArrows()}
                </svg>

                {/* HTML Layer for Node Blocks & Labels */}
                {state.list && state.list.map((nodeObj: ListNodeData) => {
                  const isCurr = curr === nodeObj.id;
                  const isNextCurr = nextCurr === nodeObj.id;
                  const isTarget = isCurr || isNextCurr;
                  
                  let themeColor = 'slate';
                  if (isCurr) themeColor = activeTheme;

                  const labels = [];
                  if (isCurr) labels.push({ text: "head (local)", color: activeTheme, position: "top" });
                  if (isNextCurr && selectedOpId === 'traverseIterative') labels.push({ text: "head (new)", color: "amber", position: "bottom" });

                  return (
                    <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                      
                      {/* Top Labels */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                        {labels.filter(l => l.position === 'top').map((l, i) => (
                          <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                        ))}
                      </div>

                      {/* Bottom Labels */}
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
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

                        {/* Null indicator */}
                        {nodeObj.nextId === null && (
                          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Trailing Null Pointer Label if curr reached end */}
                {curr === null && state.list.length > 0 && (
                  <div className="absolute z-20" style={{ left: state.list[state.list.length-1]?.x + 180, top: state.list[state.list.length-1]?.y }}>
                    <div className="relative flex flex-col items-center animate-in zoom-in">
                      <span className="text-[12px] font-mono text-slate-400 font-bold mb-4 mt-2">null</span>
                      <PointerLabel label="head (local)" color={activeTheme} position="bottom" active={true} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FS Result Overlay */}
            {isSuccess && (
              <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                  <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">TRAVERSAL COMPLETE</h2>
                  <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">{selectedOp.title} executed successfully</p>
                  <div className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 font-mono text-emerald-400 text-2xl font-bold break-all mb-10 shadow-2xl ring-1 ring-white/10 tracking-tighter">
                    {String(state.output)}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentStep(0)} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
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
}

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

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|traverseList)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['traverseList'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
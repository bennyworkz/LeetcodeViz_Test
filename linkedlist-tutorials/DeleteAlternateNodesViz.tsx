import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, CornerUpLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, RefreshCw,
  Scissors, Trash2, Zap, AlertCircle, Goal, Info,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';

const OPERATIONS = {
  deleteAltIterative: {
    id: 'deleteAltIterative',
    title: 'Iterative (Optimal)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void deleteAlternate(Node head) {
    if (head == null) return;
    
    Node curr = head;
    
    // Traverse while there is a next node to delete
    while (curr != null && curr.next != null) {
        // Bypass the next node
        curr.next = curr.next.next;
        
        // Move to the next valid node
        curr = curr.next;
    }
}`,
    desc: "We use a single pointer to leapfrog through the list. We take the current node, point it to the node AFTER the next one, and then jump forward to that new node. This systematically drops every second node."
  },
  deleteAltRecursive: {
    id: 'deleteAltRecursive',
    title: 'Recursive Approach',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public void deleteAlternate(Node head) {
    // Base Case: 0 or 1 node left
    if (head == null || head.next == null) {
        return;
    }
    
    // Bypass the alternate node
    head.next = head.next.next;
    
    // Recurse for the rest of the list
    deleteAlternate(head.next);
}`,
    desc: "A highly concise recursive solution. We perform the pointer bypass on the current head, and then pass the newly linked 'next' node into the recursive function to repeat the process."
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
  isDeleted?: boolean;
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
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <Scissors size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Delete Alternate Nodes</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a Singly Linked List, starting from the second node, delete all alternate nodes. This effectively halves the size of the list by keeping the 1st, 3rd, 5th... nodes and removing the 2nd, 4th, 6th... nodes.
        </p>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Odd Length</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">1 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 3 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 5</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Nodes 2 and 4 are removed.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: Even Length</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-sky-700 font-bold bg-sky-100 px-2 py-1 rounded border border-sky-200 text-xs">1 <ArrowRight size={12} className="mx-1 text-sky-400"/> 3</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Nodes 2 and 4 are removed.</p>
                   </div>
               </div>
           </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mt-8">
            <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={16}/> Warning: Consecutive Null Checks
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
                Because we are looking two nodes ahead (<code>curr.next.next</code>), our while loop condition MUST check that both <code>curr != null</code> AND <code>curr.next != null</code>. If we omit the second check, trying to access <code>curr.next.next</code> at the end of an odd-length list will cause a <strong>NullPointerException</strong>.
            </p>
        </div>
      </div>
    </div>
  </div>
);

const TheoryTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 mb-6 text-rose-600">
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The "Leapfrog" Technique</h2>
      </div>
      
      <p className="text-slate-600 leading-relaxed text-lg">
          To delete nodes rapidly without keeping track of a <code>prev</code> pointer explicitly, we can use the "leapfrog" pointer assignment. This works perfectly when we know we want to delete exactly the <em>next</em> node.
      </p>

      <div className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0"><CornerUpLeft size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">1. Bypass the Target</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>curr.next = curr.next.next;</code></p>
                  <p className="text-xs text-slate-400 mt-2">We take the current node and reach <em>past</em> the next node, directly grabbing the memory address of the node after it.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl shrink-0"><Trash2 size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">2. Garbage Collection</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>// Automatic in Java</code></p>
                  <p className="text-xs text-slate-400 mt-2">Because nothing points to the bypassed node anymore, it becomes unreachable. The Java Garbage Collector will automatically free its memory.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xl shrink-0"><ArrowRight size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">3. Advance Pointer</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>curr = curr.next;</code></p>
                  <p className="text-xs text-slate-400 mt-2">We move our <code>curr</code> pointer to the node we just connected to, preparing for the next leapfrog.</p>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-rose-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This is a common warmup question to test your comfort with multiple <code>.next</code> calls. The iterative leapfrog approach is optimal and expected. The recursive approach is acceptable but uses unnecessary stack space."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-rose-900/40 border-rose-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-rose-400 mb-1">Iterative (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-rose-200/70 leading-relaxed mt-2">Traverses the list doing 1 pointer assignment per alternate node. Highly efficient, zero extra memory allocations.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N) Aux</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Elegant looking, but adds frames to the call stack for every valid pair of nodes. Avoid in production for large lists.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500"/> Why O(N) Time?
               </h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                   Even though we are skipping nodes and processing two nodes at a time (effectively running N/2 iterations), the time complexity simplifies to O(N) in Big-O notation because the time taken scales linearly with the size of the input list.
               </p>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    // 3 columns, staggered layout to showcase leaping pointers clearly
    const col = index % 3;
    const row = Math.floor(index / 3);
    
    const x = 100 + col * 260; 
    const y = 80 + row * 160 + (col % 2 === 1 ? 40 : 0); 

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

export default function DeleteAlternateNodesViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('deleteAltIterative');
  const [inputList, setInputList] = useState('1, 2, 3, 4, 5, 6, 7');
  
  const [baseList, setBaseList] = useState<ListNodeData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedOp = OPERATIONS[selectedOpId];

  // Initialize and synchronize base list from input
  useEffect(() => {
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 10);
      const newNodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(newNodes);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [inputList, selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    // Deep clone the base list for simulation
    let list = baseList.map(n => ({...n}));
    let deletedSet = new Set<number>();

    const updateNextId = (targetId: number, newNextId: number | null) => {
        let node = list.find(n => n.id === targetId);
        if(node) node.nextId = newNextId;
    };

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), deletedSet: new Set(deletedSet), ...stateProps }
      });
    };

    if (selectedOpId === 'deleteAltIterative') {
        let currIdx: number | null = list.length > 0 ? list[0].id : null;
        
        addStep("Method Call", `deleteAlternate(head) called.`, 1, { currIdx, activeLinkId: null });
        addStep("Edge Case Check", `if (head == null)`, 2, { currIdx, activeLinkId: null });
        
        if (list.length === 0) {
            addStep("Return Immediately", `List is empty. No action needed.`, 2, { currIdx, isSuccess: true, activeLinkId: null });
            return steps;
        }

        addStep("Initialize Pointer", `Node curr = head;`, 4, { currIdx, activeLinkId: null });

        while (currIdx !== null) {
            let currNode = list.find(n => n.id === currIdx);
            let nextValidId = currNode?.nextId ?? null;
            
            addStep("Loop Condition", `curr != null && curr.next != null`, 7, { currIdx, activeLinkId: null });
            
            if (nextValidId === null) {
                addStep("Loop Terminates", `curr.next is null. No more alternate nodes to delete.`, 7, { currIdx, activeLinkId: null });
                break;
            }

            let nodeToDelete = nextValidId;
            let targetNode = list.find(n => n.id === nodeToDelete);
            let nodeAfterDelete = targetNode?.nextId ?? null;

            // Animate Bypass
            addStep("Bypass Alternate", `curr.next = curr.next.next; Skipping node ${targetNode?.val}.`, 9, { 
                currIdx, bypassingTarget: nodeToDelete, bypassTo: nodeAfterDelete, activeLinkId: null 
            });

            // Execute Bypass
            updateNextId(currIdx, nodeAfterDelete);
            deletedSet.add(nodeToDelete);

            addStep("Node Dropped", `Node ${targetNode?.val} is unlinked and marked for Garbage Collection.`, 9, { currIdx, activeLinkId: currIdx });

            // Advance
            addStep("Advance Pointer", `curr = curr.next; Leapfrogging to the next valid node.`, 12, { currIdx, advancingTo: nodeAfterDelete, activeLinkId: null });
            currIdx = nodeAfterDelete;
        }

        addStep("Operation Complete", `All alternate nodes removed. Function implicitly returns.`, 14, { currIdx, isSuccess: true, activeLinkId: null });
    } 
    else if (selectedOpId === 'deleteAltRecursive') {
        let callStack: any[] = [];
        
        const recurse = (currIdx: number | null, depth: number) => {
            callStack.push({ curr: currIdx, depth });
            let currNode = list.find(n => n.id === currIdx);
            let addrStr = currNode ? currNode.addr : 'null';
            
            addStep("Recursive Call", `deleteAlternate(${addrStr}) pushed to Call Stack (Depth ${depth}).`, 1, { currIdx, callStack: [...callStack], activeLinkId: null });
            
            addStep("Base Case Check", `if (head == null || head.next == null)`, 3, { currIdx, callStack: [...callStack], activeLinkId: null });
            
            if (currIdx === null || currNode?.nextId === null) {
                addStep("Base Case Met", `0 or 1 node left. Returning from Depth ${depth}.`, 4, { currIdx, callStack: [...callStack], activeLinkId: null });
                callStack.pop();
                return;
            }

            let nodeToDelete = currNode.nextId as number;
            let targetNode = list.find(n => n.id === nodeToDelete);
            let nodeAfterDelete = targetNode?.nextId ?? null;

            addStep("Bypass Alternate", `head.next = head.next.next; Skipping node ${targetNode?.val}.`, 8, { 
                currIdx, bypassingTarget: nodeToDelete, bypassTo: nodeAfterDelete, callStack: [...callStack], activeLinkId: null 
            });

            updateNextId(currIdx, nodeAfterDelete);
            deletedSet.add(nodeToDelete);

            addStep("Recursive Advance", `deleteAlternate(head.next); Pausing Depth ${depth}...`, 11, { currIdx, callStack: [...callStack], activeLinkId: currIdx });
            
            recurse(nodeAfterDelete, depth + 1);
            
            addStep("Resume & Pop", `Resuming Depth ${depth}. Popping off Call Stack.`, 11, { currIdx, callStack: [...callStack], activeLinkId: null });
            callStack.pop();
        };

        recurse(list.length > 0 ? list[0].id : null, 1);
        addStep("Operation Complete", `All stack frames popped. Alternate nodes deleted.`, 12, { currIdx: null, callStack: [], isSuccess: true, activeLinkId: null });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click play to simulate.', line: 1, state: { list: baseList, deletedSet: new Set() } });
    return steps;
  }, [baseList, selectedOpId]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); setPan({x:0, y:0}); setZoom(1); };

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess) {
         // Keep physical array elements, but logical order is updated via nextIds
         setBaseList([...finalState.list]);
     }
     setCurrentStep(0);
  };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  // Pan & Zoom Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
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

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList, deletedSet: new Set() } };
  const state = cur.state || { list: baseList, deletedSet: new Set() };
  
  const { 
      isSuccess, currIdx, deletedSet, bypassingTarget, bypassTo, callStack, advancingTo, activeLinkId
  } = state;

  const getThemeColor = () => selectedOpId === 'deleteAltIterative' ? 'rose' : 'fuchsia';
  const activeTheme = getThemeColor();

  // SVG Drawing function for clean, physical links and dynamic bypass arcs
  const renderSvgArrows = () => {
    return state.list.map((nodeObj: ListNodeData) => {
        // Find target of the arrow
        let targetId = nodeObj.nextId;
        let isBypassArrow = false;

        // If we are actively bypassing from this node right now in the simulation step
        if (bypassingTarget !== undefined && bypassTo !== undefined && nodeObj.id === currIdx && !isSuccess && activeLinkId === null) {
            targetId = bypassTo;
            isBypassArrow = true;
        }

        if (targetId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === targetId);
        if (!target) return null;

        // Don't draw outgoing arrows from deleted nodes (keeps canvas clean)
        if (deletedSet.has(nodeObj.id)) return null;

        // Origin point: center of the "NEXT" box
        const startX = nodeObj.x + 92; 
        const startY = nodeObj.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = activeLinkId === nodeObj.id || isBypassArrow;
        const strokeColor = isBypassArrow ? '#f59e0b' : (isActive ? '#f43f5e' : '#cbd5e1'); // amber-500, rose-500, slate-300
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const strokeDasharray = isBypassArrow ? "8 6" : "none";
        
        let marker = 'url(#arrowhead-default)';
        if (isBypassArrow) marker = 'url(#arrowhead-bypass)';
        else if (isActive) marker = `url(#arrowhead-${activeTheme})`;

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic)
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 pathD = `M ${startX},${startY} C ${startX + 80},${startY + (diffY/2)} ${endX - 80},${endY - (diffY/2)} ${endX},${endY}`;
            }
        } else {
            // Target is on the SAME row
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 20},${startY - 60} ${endX - 20},${endY - 60} ${endX},${endY}`;
            } else if (diffX > 200 || isBypassArrow) {
                 // Forward jump over nodes (Arc DOWN under nodes)
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 90} ${endX - 50},${endY + 90} ${endX},${endY}`;
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
                markerEnd={marker} 
                className={`transition-all duration-500 ease-in-out ${isBypassArrow ? 'animate-pulse' : ''}`} 
            />
        );
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Scissors size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <Scissors className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Delete Alternate Nodes</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className={`font-bold text-${activeTheme}-600 bg-${activeTheme}-50 px-2 py-0.5 rounded tracking-widest uppercase transition-colors duration-500`}>Physical Memory View</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Data Structures</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full md:w-auto z-10">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Database size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'interview' && <InterviewTab />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Operations Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OPERATIONS).map((op) => {
                        const isSelected = selectedOpId === op.id;
                        let btnColor = op.id === 'deleteAltIterative' ? 'rose' : 'fuchsia';
                        
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

                <div className="bg-[#0f172a] rounded-3xl h-[380px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className={`text-${activeTheme}-400`} />
                      <span className="font-bold uppercase text-[10px] text-white">LinkedList.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className={`text-${activeTheme}-400`} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'emerald' : activeTheme} />
                      ))}
                  </div>
                </div>

                {/* Method Description Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                   <h4 className={`text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2`}>
                      <BookOpen size={14} className={`text-${activeTheme}-600`}/> Concept
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
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Linked List Nodes</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="1, 2, 3, 4, 5, 6, 7" />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={handleReset} title="Reset Simulation" className="px-5 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <RotateCcw size={16}/>
                      </button>
                      <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className={`flex-1 md:w-32 px-6 py-3 bg-${activeTheme}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-${activeTheme}-100 hover:bg-${activeTheme}-700 transition-all flex items-center justify-center gap-2`}>
                        Step {currentStep < trace.length - 1 ? <ChevronRight size={16}/> : <Check size={16}/>}
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
                  
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 z-30 pointer-events-none">
                      <div className="flex items-center gap-4 bg-white/90 px-4 py-2 rounded-xl backdrop-blur shadow-sm border border-slate-200 pointer-events-auto">
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Network size={16} className={activeTheme === 'rose' ? 'text-rose-500' : 'text-fuchsia-500'}/> Memory Canvas
                          </span>
                      </div>
                      
                      <div className="flex gap-2 pointer-events-auto">
                          {isSuccess && state.list.length > 0 && (
                              <button onClick={handleApply} className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl hover:bg-emerald-200 uppercase tracking-widest flex items-center gap-1 transition-colors shadow-lg">
                                  <Check size={14}/> Call Garbage Collector
                              </button>
                          )}
                      </div>
                   </div>

                   {/* Recursive Call Stack */}
                   <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                       {callStack && callStack.length > 0 && (
                            <div className={`bg-slate-900 text-${activeTheme}-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 w-64 shadow-2xl animate-in slide-in-from-bottom-4 pointer-events-auto`}>
                                <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">JVM Call Stack</span>
                                   <RefreshCw size={14}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1.5 mt-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                    {callStack.map((frame: any, i: number) => (
                                        <div key={i} className={`p-2 rounded-lg flex justify-between items-center transition-all ${i === callStack.length - 1 ? `bg-${activeTheme}-900/50 border border-${activeTheme}-500/30 text-${activeTheme}-300 shadow-md transform scale-[1.02]` : 'bg-slate-800/50 text-slate-500'}`}>
                                            <span>deleteAlt({state.list.find((n:any) => n.id === frame.curr)?.addr ?? 'null'})</span>
                                            <span className="opacity-50 text-[8px] ml-2">D:{frame.depth}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                       )}
                   </div>

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={resetZoom} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
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
                                   <marker id="arrowhead-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /> {/* rose-500 */}
                                   </marker>
                                   <marker id="arrowhead-fuchsia" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#d946ef" /> {/* fuchsia-500 */}
                                   </marker>
                                   <marker id="arrowhead-bypass" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /> {/* amber-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              
                              const isCurr = currIdx === nodeObj.id;
                              const isDeleted = deletedSet.has(nodeObj.id);
                              const isHead = idx === 0;

                              const isThisBypassing = bypassingTarget !== undefined && isCurr && !isSuccess && activeLinkId === null;
                              
                              const isTarget = isCurr || isThisBypassing || isDeleted || isHead;
                              
                              let themeColor = 'slate';
                              if (isDeleted) themeColor = 'rose';
                              else if (isCurr) themeColor = activeTheme;

                              const labels = [];
                              if (isHead && !isDeleted) labels.push({ text: "head", color: "sky", position: "top" });
                              if (isCurr && !isDeleted) labels.push({ text: selectedOpId === 'deleteAltIterative' ? "curr" : "head (local)", color: activeTheme, position: "bottom" });

                              return (
                                  <div key={nodeObj.id} className={`absolute transition-all duration-700 z-10 ${isDeleted ? 'opacity-30 grayscale scale-95' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={(isCurr && isHead && selectedOpId !== 'deleteAltIterative') ? -24 : 0} />
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
                                          {isDeleted && (
                                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                  <div className="w-full h-1.5 bg-rose-500 -rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                                                  <div className="w-full h-1.5 bg-rose-500 rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                                              </div>
                                          )}

                                          {/* Null indicator embedded below if pointer is null */}
                                          {nodeObj.nextId === null && !isDeleted && (
                                              <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-400">null</div>
                                          )}
                                          
                                          {isDeleted && nodeObj.nextId === null && (
                                              <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-300 opacity-50">null</div>
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

      </div>
    </div>
  );
}

// Sub-components
const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, active = true, offset = 0, strikethrough = false }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sky: 'bg-sky-100 text-sky-700 border-sky-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        violet: 'bg-violet-100 text-violet-700 border-violet-200',
        slate: 'bg-slate-100 text-slate-500 border-slate-200'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];

    const topPos = position === 'top' ? '-top-10' : '-bottom-10';
    const alignClass = position === 'top' ? 'flex-col-reverse' : 'flex-col';

    return (
        <div className={`absolute ${topPos} h-8 flex ${alignClass} items-center justify-center animate-in zoom-in duration-300 z-10`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[9px] font-black font-mono tracking-widest px-2 py-1 rounded-lg border shadow-sm ${activeColorClass} ${strikethrough ? 'line-through opacity-50' : ''}`}>
                {label}
            </span>
            {position === 'top' ? 
                <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : 
                <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>
            }
        </div>
    );
};

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget, isDeleted }) => {
    return null; // Rendered inline in parent to handle dynamic absolute positioning & labels
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|deleteAlternate)\b|\b\d+\b)/g).filter(Boolean);
  
  const activeStyles = { bg: `bg-${theme}-500/10`, border: `border-${theme}-500`, text: `text-${theme}-400` };

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//') || part.startsWith('#')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'static'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['deleteAlternate'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
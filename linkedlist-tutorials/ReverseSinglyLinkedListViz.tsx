import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowLeft, ArrowDown, ArrowUp,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, Layers, RotateCcw, RefreshCcw, RefreshCw,
  Terminal, AlertCircle, ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

const OPERATIONS = {
  reverseIterative: {
    id: 'reverseIterative',
    title: 'Iterative Reversal',
    icon: <RefreshCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node reverseList(Node head) {
    Node prev = null;
    Node curr = head;
    
    while (curr != null) {
        Node nextTemp = curr.next; // Store next node
        curr.next = prev;          // Reverse current node's pointer
        prev = curr;               // Move prev one step forward
        curr = nextTemp;           // Move curr one step forward
    }
    
    return prev; // prev is the new head
}`,
    desc: "The iterative approach uses three pointers (prev, curr, nextTemp) to flip the links one by one. It traverses the list exactly once without requiring any extra memory."
  },
  reverseRecursive: {
    id: 'reverseRecursive',
    title: 'Recursive Reversal',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node reverseList(Node head) {
    // Base case: empty list or last node
    if (head == null || head.next == null) {
        return head;
    }
    
    // Reverse the rest of the list
    Node p = reverseList(head.next);
    
    // Flip the link of the next node to point back to current
    head.next.next = head;
    head.next = null;
    
    return p; // p is the new head
}`,
    desc: "The recursive approach travels to the very end of the list first. As the recursive calls return (pop off the call stack), they flip the pointers backwards. It requires O(N) auxiliary stack space."
  },
  reverseStack: {
    id: 'reverseStack',
    title: 'Using Stack',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public Node reverseList(Node head) {
    if (head == null) return null;
    
    Stack<Node> stack = new Stack<>();
    Node curr = head;
    
    // Push all nodes onto the stack
    while (curr != null) {
        stack.push(curr);
        curr = curr.next;
    }
    
    // Pop to form reversed list
    head = stack.pop();
    curr = head;
    while (!stack.isEmpty()) {
        curr.next = stack.pop();
        curr = curr.next;
    }
    
    curr.next = null; // Important: terminate the new list
    return head;
}`,
    desc: "By pushing all nodes onto a Stack, they naturally come out in Last-In-First-Out (LIFO) order. We pop them one by one and rewire their 'next' pointers to form the reversed list."
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
      <div className="flex items-center gap-3 mb-6 text-sky-600">
          <RefreshCcw size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reverse a Linked List</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Reversing a Linked List is a classic algorithmic problem. Instead of swapping the data values inside the nodes, the goal is to reverse the direction of the <code>next</code> pointers, effectively turning the list backwards in memory.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <RefreshCcw size={14} className="text-emerald-500"/> Iterative
               </h4>
               <p className="text-slate-600 text-sm">Most optimal for production. Uses 3 pointers (prev, curr, next) to reverse links on the fly without extra memory.</p>
               <div className="text-xs font-bold text-emerald-700">O(N) Time | O(1) Space</div>
            </div>
            
            <div className="bg-fuchsia-50 border border-fuchsia-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-fuchsia-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <RefreshCw size={14} className="text-fuchsia-500"/> Recursive
               </h4>
               <p className="text-slate-600 text-sm">Elegant but risky. Reaches the tail via the call stack, reversing pointers on the way back up.</p>
               <div className="text-xs font-bold text-fuchsia-700">O(N) Time | O(N) Space</div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-amber-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <Layers size={14} className="text-amber-500"/> Stack
               </h4>
               <p className="text-slate-600 text-sm">Intuitive but inefficient. Uses the LIFO property of a stack to reverse the nodes, then reconnects them.</p>
               <div className="text-xs font-bold text-amber-700">O(N) Time | O(N) Space</div>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-sky-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "Reversing a linked list is the #1 most fundamental pointer manipulation question asked in software engineering interviews. The Iterative Approach is almost always the expected answer for production code."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Iterative (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Flips pointers in a single pass. Prevents StackOverflow on massive lists. This is the gold standard.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N) Auxiliary</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Mathematically beautiful. Good for demonstrating understanding of call stacks. Bad for deep lists.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-amber-900/40 border-amber-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Stack (Brute Force)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N) Actual Memory</div>
                    <p className="text-[10px] text-amber-200/70 leading-relaxed mt-2">Easiest to conceptualize using LIFO, but highly inefficient. Allocates an entire secondary data structure.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <GitCommit size={14} className="text-emerald-500"/> Core Pattern: The 4-Step Iterative Flip
               </h4>
               <div className="space-y-3 font-mono text-sm">
                   <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">1</span>
                       <div><code>Node nextTemp = curr.next;</code> <span className="text-slate-500 text-xs ml-2">// Save the rest of the list so we don't lose it.</span></div>
                   </div>
                   <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">2</span>
                       <div><code>curr.next = prev;</code> <span className="text-slate-500 text-xs ml-2">// CRITICAL STEP: Reverse the pointer to point backwards.</span></div>
                   </div>
                   <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">3</span>
                       <div><code>prev = curr;</code> <span className="text-slate-500 text-xs ml-2">// Move 'prev' forward to the current node.</span></div>
                   </div>
                   <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">4</span>
                       <div><code>curr = nextTemp;</code> <span className="text-slate-500 text-xs ml-2">// Move 'curr' forward to process the next node.</span></div>
                   </div>
               </div>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    // 3 columns, staggered layout
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

export default function ReverseSinglyLinkedListViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('reverseIterative');
  
  const [inputList, setInputList] = useState('10, 20, 30, 40, 50');
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
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 8); // limit to 8
      const nodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(nodes);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [inputList, selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    // Deep copy list for simulation
    let list = baseList.map(n => ({...n}));
    let h1: number | null = list.length > 0 ? list[0].id : null;

    const updateNextId = (targetId: number, newNextId: number | null) => {
        let node = list.find(n => n.id === targetId);
        if(node) node.nextId = newNextId;
    };

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { 
            list: list.map(n=>({...n})), 
            headIdx: h1,
            ...stateProps 
        }
      });
    };

    if (selectedOpId === 'reverseIterative') {
        let prevIdx: number | null = null;
        let currIdx: number | null = h1;
        let nextTempIdx: number | null = null;

        addStep("Method Call", `reverseList(head) called.`, 1, { currIdx, prevIdx, nextTempIdx, activeLinkId: null });
        addStep("Initialize Pointers", `prev = null; curr = head;`, 3, { currIdx, prevIdx, nextTempIdx, activeLinkId: null });

        while (currIdx !== null) {
            let currNode = list.find(n => n.id === currIdx);
            addStep("Loop Condition", `curr (${currNode?.addr}) != null`, 4, { currIdx, prevIdx, nextTempIdx, activeLinkId: null });
            
            nextTempIdx = currNode?.nextId ?? null;
            let nextNode = list.find(n => n.id === nextTempIdx);
            
            addStep("Store Next", `Node nextTemp = curr.next; Saved address ${nextNode !== undefined ? nextNode.addr : 'null'} safely.`, 5, { currIdx, prevIdx, nextTempIdx, activeLinkId: null });
            
            updateNextId(currIdx, prevIdx);
            addStep("Reverse Link", `curr.next = prev; The node's pointer physically flips backwards!`, 6, { currIdx, prevIdx, nextTempIdx, activeLinkId: currIdx });
            
            prevIdx = currIdx;
            addStep("Advance Prev", `prev = curr; Moved prev pointer forward.`, 7, { currIdx, prevIdx, nextTempIdx, activeLinkId: currIdx });
            
            currIdx = nextTempIdx;
            addStep("Advance Curr", `curr = nextTemp; Moved curr pointer forward.`, 8, { currIdx, prevIdx, nextTempIdx, activeLinkId: null });
        }

        addStep("Loop Terminates", `curr is null. Reversal is complete.`, 4, { currIdx, prevIdx, nextTempIdx: null, activeLinkId: null });
        
        h1 = prevIdx; // Set new head logically
        addStep("Return Head", `Return prev (${prevIdx !== null ? list.find(n=>n.id===prevIdx)?.addr : 'null'}) as the new head.`, 11, { currIdx, prevIdx, nextTempIdx: null, activeLinkId: null, isSuccess: true, newHead: prevIdx });
    } 
    else if (selectedOpId === 'reverseRecursive') {
        let callStack: any[] = [];
        
        const recurse = (currIdx: number | null, depth: number): number | null => {
            callStack.push({ node: currIdx, depth });
            let currNode = list.find(n => n.id === currIdx);
            let addrStr = currNode ? currNode.addr : 'null';
            
            addStep("Method Call", `reverseList(${addrStr}) pushed to Call Stack (Depth: ${depth}).`, 1, { currIdx, callStack: [...callStack], activeLinkId: null });
            addStep("Base Case Check", `if (head == null || head.next == null)`, 3, { currIdx, callStack: [...callStack], activeLinkId: null });
            
            if (currIdx === null || currNode?.nextId === null) {
                addStep("Base Case Met", `Hit the end of the list. Returning this node as new head.`, 4, { currIdx, callStack: [...callStack], activeLinkId: null });
                let p = currIdx;
                callStack.pop();
                return p;
            }
            
            let nextIdx = currNode.nextId;
            let nextNode = list.find(n => n.id === nextIdx);
            
            addStep("Recursive Call", `Node p = reverseList(head.next). Pausing execution of Depth ${depth}...`, 8, { currIdx, callStack: [...callStack], activeLinkId: null });
            
            let p = recurse(nextIdx, depth + 1);
            let pNode = list.find(n => n.id === p);
            
            addStep("Resume execution", `Resuming Depth ${depth}. The new head 'p' bubble up is ${pNode ? pNode.addr : 'null'}.`, 8, { currIdx, callStack: [...callStack], pHead: p, activeLinkId: null });
            
            // head.next.next = head
            let currentNextNodeId = currNode.nextId as number;
            updateNextId(currentNextNodeId, currIdx);
            addStep("Flip Link Backwards", `head.next.next = head; The right node now points backward to the current node!`, 11, { currIdx, callStack: [...callStack], pHead: p, activeLinkId: currentNextNodeId });
            
            // head.next = null
            updateNextId(currIdx, null);
            addStep("Sever Old Link", `head.next = null; Cleaning up the old forward connection to avoid infinite loops.`, 12, { currIdx, callStack: [...callStack], pHead: p, activeLinkId: currentNextNodeId });
            
            addStep("Return P", `Returning 'p' up the stack.`, 14, { currIdx, callStack: [...callStack], pHead: p, activeLinkId: null });
            callStack.pop();
            return p;
        };

        h1 = recurse(h1, 1);
        addStep("Reversal Complete", `All stack frames popped. Reversal successful.`, 14, { callStack: [], activeLinkId: null, isSuccess: true, newHead: h1 });
    }
    else if (selectedOpId === 'reverseStack') {
        let stackData: number[] = [];
        
        addStep("Method Call", `reverseList(head) called.`, 1, { currIdx: h1, stackData: [...stackData], activeLinkId: null });
        
        if (list.length === 0) {
            addStep("Empty Check", `List is empty, return null.`, 2, { isSuccess: true });
            return steps;
        }

        addStep("Initialize Stack", `Stack<Node> stack = new Stack<>();`, 4, { currIdx: h1, stackData: [...stackData], activeLinkId: null });
        
        let currIdx: number | null = h1;
        
        while (currIdx !== null) {
            let currNode = list.find(n => n.id === currIdx);
            addStep("Push to Stack", `stack.push(curr). Pushing ${currNode?.addr} to LIFO Stack.`, 9, { currIdx, stackData: [...stackData], activeLinkId: null });
            stackData.push(currIdx);
            
            currIdx = currNode?.nextId ?? null;
            addStep("Advance Pointer", `curr = curr.next.`, 10, { currIdx, stackData: [...stackData], activeLinkId: null });
        }

        addStep("Stack Pop Head", `head = stack.pop(). This sets our absolute new head of the list.`, 14, { currIdx, stackData: [...stackData], activeLinkId: null });
        let newHeadIdx = stackData.pop() as number;
        currIdx = newHeadIdx;
        h1 = newHeadIdx;
        
        addStep("Set Curr", `curr = head; Ready to pop remaining elements.`, 15, { currIdx, stackData: [...stackData], newHead: newHeadIdx, activeLinkId: null });

        while (stackData.length > 0) {
            let nextPoppedIdx = stackData[stackData.length - 1]; // peek
            addStep("Pop Next Node", `curr.next = stack.pop(); Targeting ${list.find(n=>n.id===nextPoppedIdx)?.addr}.`, 17, { currIdx, stackData: [...stackData], newHead: newHeadIdx, activeLinkId: null });
            
            let poppedIdx = stackData.pop() as number;
            updateNextId(currIdx, poppedIdx);
            addStep("Wire Pointer", `Pointer physically rewired backward to ${list.find(n=>n.id===poppedIdx)?.addr}.`, 17, { currIdx, stackData: [...stackData], newHead: newHeadIdx, activeLinkId: currIdx });
            
            currIdx = poppedIdx;
            addStep("Advance Curr", `curr = curr.next; Moving onto the node we just popped.`, 18, { currIdx, stackData: [...stackData], newHead: newHeadIdx, activeLinkId: null });
        }

        updateNextId(currIdx, null);
        addStep("Terminate List", `curr.next = null. Vital to prevent cycle!`, 21, { currIdx, stackData: [...stackData], newHead: newHeadIdx, activeLinkId: null });
        addStep("Return", `return head; List successfully reversed using Stack memory.`, 22, { currIdx: null, stackData: [...stackData], isSuccess: true, newHead: newHeadIdx, activeLinkId: null });
    }

    return steps;
  }, [baseList, selectedOpId]);

  // Reset step when operation changes
  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess) {
         setBaseList([...finalState.list]);
     }
     setCurrentStep(0);
  };

  const handleReset = () => {
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 8);
      const nodes = vals.map((v, i) => generateNode(v, i, i < vals.length - 1 ? i + 1 : null, i));
      setBaseList(nodes);
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

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList } };
  const state = cur.state || { list: baseList };
  
  const { 
      isSuccess, currIdx, prevIdx, nextTempIdx, callStack, 
      pHead, activeLinkId, highlightingNext, stackData, newHead, headIdx
  } = state;

  const getThemeColor = () => {
      if (selectedOpId === 'reverseIterative') return 'emerald';
      if (selectedOpId === 'reverseRecursive') return 'fuchsia';
      return 'amber';
  };
  const activeTheme = getThemeColor();

  // SVG Drawing function tailored for physical layout and backward pointing arrows
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

        const isActive = activeLinkId === node.id || highlightingNext === node.id;
        const strokeColor = isActive ? '#f59e0b' : '#94a3b8'; // amber-500 or slate-400
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic)
            if (diffX < 0) {
                 // Next row, jumping backwards (S-Curve leftwards)
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 // Next row, jumping forwards
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
              <RefreshCcw size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <RefreshCcw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reverse Linked List</h1>
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
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'interview' && <InterviewTab />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Log (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Operations Selector */}
                <div className="grid grid-cols-3 gap-2">
                    {Object.values(OPERATIONS).map((op) => {
                        const isSelected = selectedOpId === op.id;
                        let btnColor = op.id.includes('Iterative') ? 'emerald' : op.id.includes('Recursive') ? 'fuchsia' : 'amber';
                        
                        return (
                            <button 
                               key={op.id}
                               onClick={() => { setSelectedOpId(op.id as any); setCurrentStep(0); }}
                               className={`px-2 py-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? `bg-${btnColor}-600 border-${btnColor}-600 text-white shadow-${btnColor}-200 scale-[1.02]` : `bg-white border-slate-200 text-slate-500 hover:border-${btnColor}-300 hover:bg-slate-50`}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? `bg-${btnColor}-500 text-white` : 'bg-slate-100 text-slate-400'}`}>{op.icon}</div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight leading-none truncate w-full px-1">
                                    {op.title.replace('Reversal', '')}
                                </span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 bg-${activeTheme}-500/20 border-${activeTheme}-500`} style={{ top: `${((cur.line - 1) * 16.5) + 16}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={activeTheme} />
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
                        <label className={`text-[10px] font-black text-${activeTheme}-600 uppercase block pl-1 tracking-widest font-mono`}>Nodes to Reverse</label>
                        <input type="text" value={inputList} onChange={(e) => { setInputList(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="10, 20, 30, 40, 50" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? `bg-${activeTheme}-900 border-${activeTheme}-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={`text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30 border`}>Line {cur.line}</div>
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
                          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 bg-white/80 px-3 py-1 rounded backdrop-blur shadow-sm">
                             Nodes stay fixed in RAM. Pointers curve backwards.
                          </div>
                      </div>
                   </div>

                   {/* Recursive Call Stack / Secondary Structures */}
                   <div className="absolute bottom-6 left-6 flex gap-4 z-40 pointer-events-none">
                       {/* Recursive Call Stack */}
                       {selectedOpId === 'reverseRecursive' && callStack && callStack.length > 0 && (
                            <div className="bg-slate-900 text-fuchsia-400 font-mono text-[10px] p-3 rounded-lg border border-slate-700 w-56 shadow-xl animate-in slide-in-from-bottom-4 pointer-events-auto">
                                <div className="text-slate-500 mb-2 border-b border-slate-700 pb-1 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">JVM Call Stack</span>
                                   <RefreshCw size={12}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1 mt-2 max-h-[120px] overflow-y-auto scrollbar-thin">
                                    {callStack.map((frame: any, i: number) => (
                                        <div key={i} className={`p-1.5 rounded flex justify-between items-center transition-all ${i === callStack.length - 1 ? 'bg-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-300 shadow-md transform scale-[1.02]' : 'bg-slate-800/50 text-slate-500'}`}>
                                            <span>reverse({frame.node !== null ? state.list.find((n:any)=>n.id===frame.node)?.addr : 'null'})</span>
                                            <span className="opacity-50 text-[8px]">D: {frame.depth}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                       )}

                       {/* Stack Data Structure */}
                       {selectedOpId === 'reverseStack' && stackData && (
                            <div className="bg-slate-900 text-amber-400 font-mono text-[10px] p-3 rounded-lg border border-slate-700 w-48 shadow-xl animate-in slide-in-from-bottom-4 pointer-events-auto">
                                <div className="text-slate-500 mb-2 border-b border-slate-700 pb-1 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">Stack&lt;Node&gt;</span>
                                   <Layers size={12}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1 mt-2 max-h-[120px] overflow-y-auto scrollbar-thin justify-end">
                                    {stackData.map((nodeId: number, i: number) => (
                                        <div key={i} className="p-1.5 rounded flex justify-center items-center bg-amber-900/40 border border-amber-500/30 text-amber-300 shadow-sm animate-in zoom-in duration-300">
                                            {state.list.find((n:any)=>n.id===nodeId)?.addr} ({state.list.find((n:any)=>n.id===nodeId)?.val})
                                        </div>
                                    ))}
                                    {stackData.length === 0 && <div className="text-slate-600 text-center italic mt-auto mb-auto py-4">Empty</div>}
                                </div>
                            </div>
                       )}
                   </div>

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
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /> {/* slate-400 */}
                                   </marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /> {/* amber-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              
                              const isCurr = currIdx === nodeObj.id;
                              const isPrev = prevIdx === nodeObj.id;
                              const isNextTemp = nextTempIdx === nodeObj.id;
                              const isPHead = pHead === nodeObj.id;
                              const isNewHead = newHead === nodeObj.id;
                              const isHead = headIdx === nodeObj.id;
                              
                              const isTarget = isCurr || isPrev || isNextTemp || isPHead || isNewHead || isHead;
                              
                              // Theme assignments to separate nodes visually
                              let themeColor = 'slate';
                              if (isTarget) themeColor = activeTheme;

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "sky", position: "top" });
                              if (isNewHead) labels.push({ text: "head", color: activeTheme, position: "top" });
                              if (isPHead) labels.push({ text: "p (head)", color: "fuchsia", position: "top" });
                              if (isPrev) labels.push({ text: "prev", color: "amber", position: "top" });
                              if (isNextTemp) labels.push({ text: "nextTemp", color: "sky", position: "top" });
                              
                              if (isCurr) labels.push({ text: "curr", color: activeTheme, position: "bottom" });

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

      </div>

      {/* --- Fullscreen Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* LEFT SIDEBAR: Code & Logic */}
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
                      <div className="flex items-center gap-4">
                          <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Reverse List</span>
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

                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              const isPrev = prevIdx === nodeObj.id;
                              const isCurr = currIdx === nodeObj.id;
                              const isNext = nextTempIdx === nodeObj.id;
                              
                              const isTarget = isPrev || isCurr || isNext;
                              
                              let themeColor = 'slate';
                              if (isPrev) themeColor = 'amber';
                              else if (isCurr) themeColor = activeTheme;
                              else if (isNext) themeColor = 'sky';

                              const labels = [];
                              if (isPrev) labels.push({ text: "prev", color: "amber", position: "top" });
                              if (isCurr) labels.push({ text: "curr", color: activeTheme, position: "bottom" });
                              if (isNext) labels.push({ text: "next", color: "sky", position: "top" });

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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">REVERSAL COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">List successfully reversed in memory</p>
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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    return null; // Rendered inline in parent to handle dynamic absolute positioning & labels
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|reverseList|Stack|push|pop|isEmpty)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print', 'println', 'void', 'Stack'].includes(part)) return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
          if (['reverseList', 'push', 'pop', 'isEmpty'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
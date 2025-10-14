import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, Target,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, RefreshCcw, RefreshCw, Search,
  FastForward, Undo2, Terminal, ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

const OPERATIONS = {
  nthStartIter: {
    id: 'nthStartIter',
    title: 'From Start (Iterative)',
    icon: <RefreshCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int GetNth(Node head, int n) {
    Node curr = head;
    int count = 1;
    
    while (curr != null) {
        if (count == n) {
            return curr.data;
        }
        count++;
        curr = curr.next;
    }
    
    return -1; // Out of bounds
}`,
    desc: "Maintains a 'count' variable starting at 1. We traverse the list node by node, incrementing the count until it matches N. It uses O(1) auxiliary space."
  },
  nthStartRec: {
    id: 'nthStartRec',
    title: 'From Start (Recursive)',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int GetNth(Node head, int n) {
    // Base Case 1: End of list
    if (head == null) return -1; 
    
    // Base Case 2: Found the Nth node
    if (n == 1) return head.data; 
    
    // Recursive Call: Look for (N-1)th node
    return GetNth(head.next, n - 1); 
}`,
    desc: "Passes 'n - 1' down the call stack. When 'n' reaches 1, we have found our target. Consumes O(N) stack space proportional to the depth of recursion."
  },
  nthEndIter: {
    id: 'nthEndIter',
    title: 'From End (Iterative)',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int GetNthFromEnd(Node head, int n) {
    Node main_ptr = head;
    Node ref_ptr = head;
    
    // 1. Move ref_ptr 'n' nodes ahead
    int count = 0;
    while (count < n) {
        if (ref_ptr == null) return -1;
        ref_ptr = ref_ptr.next;
        count++;
    }
    
    // 2. Move both one by one
    while (ref_ptr != null) {
        main_ptr = main_ptr.next;
        ref_ptr = ref_ptr.next;
    }
    
    return main_ptr.data;
}`,
    desc: "Uses two pointers. First, move 'ref_ptr' exactly N nodes ahead. Then, move both pointers together. When 'ref_ptr' hits the end, 'main_ptr' will naturally be at the Nth node from the end!"
  },
  nthEndRec: {
    id: 'nthEndRec',
    title: 'From End (Recursive)',
    icon: <Undo2 size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int GetNthFromEnd(Node head, int n, int[] count) {
    if (head == null) return -1;
    
    // Recurse to the very end first
    int res = GetNthFromEnd(head.next, n, count);
    
    // If already found, pass it up
    if (res != -1) return res;
    
    // Increment count on the way back UP
    count[0]++;
    
    // Check if current node is the target
    if (count[0] == n) return head.data;
    
    return -1;
}`,
    desc: "Recurses to the end of the list, then increments a shared 'count' array as it unspools backwards. When count equals N, it returns that node's data."
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
          <Search size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nth Node Operations</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Retrieving a node by its numerical position is fundamentally different in Linked Lists compared to Arrays. Since lists lack contiguous memory indexing, you must traverse pointers sequentially.
        </p>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 font-mono text-sm">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-2">Mental Model:</h4>
           <div className="flex items-center gap-4">
              <span className="font-bold text-slate-400 w-16">List:</span>
              <div className="flex items-center text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
                  10 <ArrowRight size={14} className="mx-2"/> 20 <ArrowRight size={14} className="mx-2"/> 30 <ArrowRight size={14} className="mx-2"/> 40
              </div>
           </div>
           <div className="flex flex-col gap-2 mt-4 text-xs font-bold text-slate-500">
               <div>N=3 from START <ArrowRight size={12} className="inline"/> Returns 30</div>
               <div>N=3 from END <ArrowRight size={12} className="inline"/> Returns 20</div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <RefreshCcw size={14} className="text-emerald-500"/> Start: Iterative
               </h4>
               <p className="text-slate-600 text-sm">Standard forward traversal maintaining an integer counter. The most memory-efficient approach.</p>
               <div className="text-xs font-bold text-emerald-700">O(N) Time | O(1) Space</div>
            </div>
            
            <div className="bg-fuchsia-50 border border-fuchsia-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-fuchsia-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <RefreshCw size={14} className="text-fuchsia-500"/> Start: Recursive
               </h4>
               <p className="text-slate-600 text-sm">Reduces N by 1 on each recursive call until N equals 1.</p>
               <div className="text-xs font-bold text-fuchsia-700">O(N) Time | O(N) Space</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-amber-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <FastForward size={14} className="text-amber-500"/> End: Iterative (2-Ptr)
               </h4>
               <p className="text-slate-600 text-sm">A fast "ref" pointer is sent N steps ahead. Then a "main" pointer follows. Clever 1-pass solution.</p>
               <div className="text-xs font-bold text-amber-700">O(N) Time | O(1) Space</div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl space-y-4">
               <h4 className="font-black text-indigo-800 uppercase tracking-widest text-xs flex items-center gap-2">
                   <Undo2 size={14} className="text-indigo-500"/> End: Recursive
               </h4>
               <p className="text-slate-600 text-sm">Hits the null tail, then increments a counter variable on the way back up the call stack.</p>
               <div className="text-xs font-bold text-indigo-700">O(N) Time | O(N) Space</div>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-emerald-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Iterative vs Recursive
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "Finding the Nth node is a basic search operation. Since we cannot access elements by index in O(1) time like an array, we must traverse the list sequentially. The Iterative methods are the expected approach due to space efficiency."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-emerald-900/40 border-emerald-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Iterative (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-emerald-200/70 leading-relaxed mt-2">Traverses the list using pointers and an integer counter. No extra memory is consumed regardless of list size.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-fuchsia-900/40 border-fuchsia-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-fuchsia-400 mb-1">Recursive (Naive)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) <br/><strong>Space:</strong> O(N) Auxiliary</div>
                    <p className="text-[10px] text-fuchsia-200/70 leading-relaxed mt-2">Pushes parameters down the call stack. While code is shorter, it uses O(N) memory and can cause a StackOverflow for large N.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Target size={14} className="text-sky-500"/> Core Pattern: Fast & Slow Pointers
               </h4>
               <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                   <p>
                       The "Nth Node from END" problem is the quintessential test of the <strong>Two Pointers</strong> technique.
                   </p>
                   <p className="font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                       1. Set <code>main_ptr</code> and <code>ref_ptr</code> at the head.<br/>
                       2. Move <code>ref_ptr</code> exactly N steps forward.<br/>
                       3. Move both pointers one step at a time until <code>ref_ptr</code> falls off the end.<br/>
                       4. <code>main_ptr</code> is now exactly N steps from the end!
                   </p>
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

export default function NthNodeInSinglyLinkedList() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('nthStartIter');
  const [inputN, setInputN] = useState('3');
  
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
          generateNode(10, 0, 1, 0), 
          generateNode(20, 1, 2, 1), 
          generateNode(30, 2, 3, 2), 
          generateNode(40, 3, null, 3)
      ]);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [selectedOpId]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseList.length === 0) return steps;

    let list = baseList.map(n => ({...n}));
    let targetN = parseInt(inputN);
    if (isNaN(targetN)) targetN = 3;

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'nthStartIter') {
        let currIdx: number | null = list.length > 0 ? 0 : null;
        let count = 1;
        
        addStep("Method Call", `GetNth(head, n=${targetN}) called.`, 1, { currIdx, count, output: null });
        addStep("Initialize Variables", `Node curr = head; int count = 1;`, 2, { currIdx, count, output: null });

        while (currIdx !== null) {
            let currNode = list.find(n => n.id === currIdx);
            addStep("Loop Condition", `curr (${currNode?.addr}) != null`, 5, { currIdx, count, output: null });
            
            addStep("Check Match", `if (count == n) => (${count} == ${targetN})`, 6, { currIdx, count, output: null, checking: true });
            
            if (count === targetN) {
                addStep("Node Found!", `Count matches N! Returning curr.data (${currNode?.val}).`, 7, { currIdx, count, isSuccess: true, output: `Found: ${currNode?.val}` });
                return steps;
            }
            
            count++;
            addStep("Increment Count", `count++ => count becomes ${count}`, 9, { currIdx, count, output: null });
            
            let nextIdx = currNode?.nextId ?? null;
            addStep("Advance Pointer", `curr = curr.next`, 10, { currIdx: nextIdx, count, output: null });
            currIdx = nextIdx;
        }

        addStep("Loop Terminates", `curr is null. We reached the end.`, 5, { currIdx, count, output: null });
        addStep("Out of Bounds", `N was larger than list size. Returning -1.`, 13, { currIdx, count, notFound: true, output: "Not Found (-1)" });
    } 
    else if (selectedOpId === 'nthStartRec') {
        let callStack: any[] = [];
        
        const recurse = (currIdx: number | null, currentN: number, depth: number): number => {
            callStack.push({ node: currIdx, n: currentN, depth });
            let currNode = list.find(n => n.id === currIdx);
            let addrStr = currNode ? currNode.addr : 'null';
            
            addStep("Method Call", `GetNth(${addrStr}, n=${currentN}) pushed to Call Stack (Depth: ${depth}).`, 1, { currIdx, callStack: [...callStack], output: null });
            
            addStep("Base Case 1", `if (head == null)`, 3, { currIdx, callStack: [...callStack], output: null });
            if (currIdx === null) {
                addStep("End of List", `head is null. Returning -1.`, 3, { currIdx, callStack: [...callStack], notFound: true, output: "Not Found (-1)" });
                callStack.pop();
                return -1;
            }
            
            addStep("Base Case 2", `if (n == 1) => (${currentN} == 1)`, 6, { currIdx, callStack: [...callStack], output: null, checking: true });
            if (currentN === 1) {
                let val = currNode?.val ?? -1;
                addStep("Node Found!", `n is 1! We are at the target node. Returning head.data (${val}).`, 6, { currIdx, callStack: [...callStack], isSuccess: true, output: `Found: ${val}` });
                callStack.pop();
                return val;
            }
            
            let nextIdx = currNode?.nextId ?? null;
            addStep("Recursive Call", `return GetNth(head.next, ${currentN} - 1). Pausing Depth ${depth}...`, 9, { currIdx, callStack: [...callStack], output: null });
            
            let res = recurse(nextIdx, currentN - 1, depth + 1);
            
            addStep("Return Value", `Resuming Depth ${depth}. Returning ${res} up the stack.`, 9, { currIdx, callStack: [...callStack], isSuccess: res !== -1, notFound: res === -1, output: res !== -1 ? `Found: ${res}` : `Not Found (-1)` });
            callStack.pop();
            return res;
        };

        recurse(list.length > 0 ? 0 : null, targetN, 1);
        addStep("Execution Complete", `All stack frames popped.`, 9, { callStack: [], isSuccess: true, keepOutput: true });
    }
    else if (selectedOpId === 'nthEndIter') {
        let mainIdx: number | null = list.length > 0 ? 0 : null;
        let refIdx: number | null = list.length > 0 ? 0 : null;
        let count = 0;
        
        addStep("Method Call", `GetNthFromEnd(head, n=${targetN}) called.`, 1, { mainIdx, refIdx, count, output: null });
        addStep("Initialize Pointers", `main_ptr = head; ref_ptr = head;`, 2, { mainIdx, refIdx, count, output: null });
        addStep("Init Count", `int count = 0;`, 6, { mainIdx, refIdx, count, output: null });
        
        // Phase 1
        while (count < targetN) {
            addStep("Phase 1: Loop", `count (${count}) < n (${targetN})`, 7, { mainIdx, refIdx, count, output: null });
            
            addStep("Null Check", `if (ref_ptr == null)`, 8, { mainIdx, refIdx, count, output: null });
            if (refIdx === null) {
                addStep("Out of Bounds", `ref_ptr hit null. N is larger than list. Return -1.`, 8, { mainIdx, refIdx, count, notFound: true, output: "Not Found (-1)" });
                return steps;
            }
            
            let refNode = list.find(n => n.id === refIdx);
            let nextRef = refNode?.nextId ?? null;
            
            addStep("Advance ref_ptr", `ref_ptr = ref_ptr.next`, 9, { mainIdx, refIdx: nextRef, count, output: null });
            refIdx = nextRef;
            
            count++;
            addStep("Increment Count", `count++ => ${count}`, 10, { mainIdx, refIdx, count, output: null });
        }
        addStep("Phase 1 Complete", `ref_ptr is exactly ${targetN} nodes ahead of main_ptr.`, 7, { mainIdx, refIdx, count, output: null });

        // Phase 2
        while (refIdx !== null) {
            addStep("Phase 2: Slide Window", `ref_ptr != null`, 14, { mainIdx, refIdx, count, output: null });
            
            let mainNode = list.find(n => n.id === mainIdx);
            let refNode = list.find(n => n.id === refIdx);
            
            let nextMain = mainNode?.nextId ?? null;
            let nextRef = refNode?.nextId ?? null;
            
            addStep("Advance Both", `main_ptr = main_ptr.next; ref_ptr = ref_ptr.next;`, 15, { mainIdx: nextMain, refIdx: nextRef, count, output: null });
            mainIdx = nextMain;
            refIdx = nextRef;
        }
        addStep("End Reached", `ref_ptr is null. Phase 2 finishes.`, 14, { mainIdx, refIdx, count, output: null });
        
        if (mainIdx !== null) {
             let targetNode = list.find(n => n.id === mainIdx);
             addStep("Node Found", `main_ptr is at the Nth node from the end! Return ${targetNode?.val}.`, 19, { mainIdx, refIdx, count, isSuccess: true, output: `Found: ${targetNode?.val}` });
        } else {
             addStep("Node Not Found", `main_ptr is null. Return -1.`, 19, { mainIdx, refIdx, count, notFound: true, output: `Not Found (-1)` });
        }
    }
    else if (selectedOpId === 'nthEndRec') {
        let callStack: any[] = [];
        let globalCount = 0; // Simulated int[] count array behavior
        
        const recurse = (currIdx: number | null, depth: number): number => {
            callStack.push({ node: currIdx, depth });
            let currNode = list.find(n => n.id === currIdx);
            let addrStr = currNode ? currNode.addr : 'null';
            
            addStep("Method Call", `GetNthFromEnd(${addrStr}) added to stack (Depth: ${depth}).`, 1, { currIdx, callStack: [...callStack], globalCount, output: null });
            
            addStep("Base Case", `if (head == null)`, 2, { currIdx, callStack: [...callStack], globalCount, output: null });
            if (currIdx === null) {
                addStep("End Reached", `head is null. Returning -1 to unspool.`, 2, { currIdx, callStack: [...callStack], globalCount, output: null });
                callStack.pop();
                return -1;
            }
            
            let nextIdx = currNode?.nextId ?? null;
            addStep("Recursive Dive", `int res = GetNthFromEnd(head.next...). Pausing...`, 5, { currIdx, callStack: [...callStack], globalCount, output: null });
            
            let res = recurse(nextIdx, depth + 1);
            
            addStep("Resume", `Resumed Depth ${depth}. res = ${res}.`, 5, { currIdx, callStack: [...callStack], globalCount, output: null });
            
            addStep("Check if Found", `if (res != -1)`, 8, { currIdx, callStack: [...callStack], globalCount, output: null });
            if (res !== -1) {
                 addStep("Pass Value Up", `Target already found deep down. Passing ${res} upwards.`, 8, { currIdx, callStack: [...callStack], globalCount, output: null });
                 callStack.pop();
                 return res;
            }
            
            globalCount++;
            addStep("Increment Count", `count[0]++. Count is now ${globalCount}. (Counting from end!)`, 11, { currIdx, callStack: [...callStack], globalCount, output: null });
            
            addStep("Check Match", `if (count[0] == n) => (${globalCount} == ${targetN})`, 14, { currIdx, callStack: [...callStack], globalCount, output: null, checking: true });
            if (globalCount === targetN) {
                let val = currNode?.val ?? -1;
                addStep("Node Found!", `Matches! Returning head.data (${val}).`, 14, { currIdx, callStack: [...callStack], globalCount, isSuccess: true, output: `Found: ${val}` });
                callStack.pop();
                return val;
            }
            
            addStep("Not Match", `Not the target. Return -1.`, 16, { currIdx, callStack: [...callStack], globalCount, output: null });
            callStack.pop();
            return -1;
        };

        let finalRes = recurse(list.length > 0 ? 0 : null, 1);
        addStep("Execution Complete", `All stack frames popped. Result is ${finalRes}.`, 16, { callStack: [], isSuccess: finalRes !== -1, notFound: finalRes === -1, keepOutput: true, output: finalRes !== -1 ? `Found: ${finalRes}` : `Not Found (-1)` });
    }

    return steps;
  }, [baseList, selectedOpId, inputN]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputN]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleReset = () => {
      setBaseList([
          generateNode(10, 0, 1, 0), generateNode(20, 1, 2, 1), generateNode(30, 2, 3, 2), generateNode(40, 3, null, 3)
      ]);
      setInputN('3');
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
      isSuccess, currIdx, mainIdx, refIdx, count, globalCount, callStack, notFound, output, checking, keepOutput
  } = state;

  const getThemeColor = () => {
      if (selectedOpId === 'nthStartIter') return 'emerald';
      if (selectedOpId === 'nthStartRec') return 'fuchsia';
      if (selectedOpId === 'nthEndIter') return 'amber';
      return 'indigo';
  };
  const activeTheme = getThemeColor();

  // SVG Drawing function
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

        const strokeColor = '#94a3b8'; // slate-400
        const strokeWidth = 2;
        const strokeOpacity = 0.6;
        const marker = 'url(#arrowhead-default)';

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
            } else if (diffX > 200) {
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 80} ${endX - 50},${endY + 80} ${endX},${endY}`;
            } else {
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
              <Search size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Nth Node in Linked List</h1>
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
                
                {/* Operations Selector (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(OPERATIONS).map((op) => {
                        const isSelected = selectedOpId === op.id;
                        let btnColor = op.id === 'nthStartIter' ? 'emerald' : 
                                       op.id === 'nthStartRec' ? 'fuchsia' : 
                                       op.id === 'nthEndIter' ? 'amber' : 'indigo';
                        
                        return (
                            <button 
                               key={op.id}
                               onClick={() => { setSelectedOpId(op.id as any); setCurrentStep(0); }}
                               className={`px-3 py-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 shadow-sm ${isSelected ? `bg-${btnColor}-600 border-${btnColor}-600 text-white shadow-${btnColor}-200 scale-[1.02]` : `bg-white border-slate-200 text-slate-500 hover:border-${btnColor}-300 hover:bg-slate-50`}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? `bg-${btnColor}-500 text-white` : 'bg-slate-100 text-slate-400'}`}>{op.icon}</div>
                                  <span className="text-[10px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {op.title}
                                  </span>
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
                  <div className="p-4 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 bg-${activeTheme}-500/20 border-${activeTheme}-500`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
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
                        <label className="text-[10px] font-black text-slate-500 uppercase block pl-1 tracking-widest font-mono">Target N (1-based index)</label>
                        <input type="number" min="1" max="10" value={inputN} onChange={(e) => { setInputN(e.target.value); setCurrentStep(0); }} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${activeTheme}-500 outline-none transition-all shadow-inner`} placeholder="e.g. 3" />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={handleReset} title="Reset Tracker" className="px-5 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${notFound ? 'bg-rose-900 border-rose-800' : isSuccess ? `bg-emerald-900 border-emerald-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={notFound ? "text-rose-400" : isSuccess ? "text-emerald-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${notFound ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
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
                      
                      {/* State Trackers (Top Right) */}
                      <div className="flex gap-3">
                          {selectedOpId.includes('Iterative') && count !== undefined && (
                              <div className="bg-white/90 text-slate-700 font-mono text-[11px] px-3 py-1 rounded-lg font-black border border-slate-200 flex items-center gap-2 shadow-sm backdrop-blur">
                                  <span className="text-slate-400 font-normal">count:</span> {count}
                              </div>
                          )}
                          {selectedOpId === 'nthEndRec' && globalCount !== undefined && (
                              <div className="bg-white/90 text-slate-700 font-mono text-[11px] px-3 py-1 rounded-lg font-black border border-slate-200 flex items-center gap-2 shadow-sm animate-in fade-in backdrop-blur">
                                  <span className="text-slate-400 font-normal">count[0]:</span> {globalCount}
                              </div>
                          )}
                          <div className="bg-slate-800 text-white font-mono text-[11px] px-3 py-1 rounded-lg font-black border border-slate-700 flex items-center gap-2 shadow-sm">
                              <span className="text-slate-400 font-normal">target N:</span> {inputN}
                          </div>
                      </div>
                   </div>

                   {/* Terminal Output Viewer */}
                   {(output || keepOutput) && (
                        <div className={`absolute top-20 right-6 font-mono text-[14px] p-4 rounded-xl border shadow-2xl z-40 animate-in zoom-in font-black tracking-widest pointer-events-auto ${notFound ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
                            <div className="flex items-center gap-2">
                                <Terminal size={16}/>
                                Return: {output || (notFound ? '-1' : '...')}
                            </div>
                        </div>
                   )}

                   {/* Recursive Call Stack */}
                   <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none z-40">
                       {callStack && callStack.length > 0 && (
                            <div className={`bg-slate-900 text-${activeTheme}-400 font-mono text-[10px] p-3 rounded-lg border border-slate-700 w-56 shadow-xl animate-in slide-in-from-bottom-4 pointer-events-auto`}>
                                <div className="text-slate-500 mb-2 border-b border-slate-700 pb-1 flex items-center justify-between">
                                   <span className="uppercase tracking-widest text-[9px] font-black">JVM Call Stack</span>
                                   <RefreshCw size={12}/>
                                </div>
                                <div className="flex flex-col-reverse gap-1 mt-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                                    {callStack.map((frame: any, i: number) => (
                                        <div key={i} className={`p-2 rounded flex justify-between items-center transition-all ${i === callStack.length - 1 ? `bg-${activeTheme}-900/50 border border-${activeTheme}-500/30 text-${activeTheme}-300 shadow-md transform scale-[1.02]` : 'bg-slate-800/50 text-slate-500'}`}>
                                            <span>GetNth({frame.node !== null ? state.list.find((n:any)=>n.id===frame.node)?.addr : 'null'})</span>
                                            <span className="opacity-50 text-[8px]">D:{frame.depth}</span>
                                        </div>
                                    ))}
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
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Layer for Node Blocks & Labels */}
                           {state.list && state.list.map((nodeObj: ListNodeData, idx: number) => {
                              
                              const isCurr = currIdx === nodeObj.id;
                              const isMainPtr = mainIdx === nodeObj.id;
                              const isRefPtr = refIdx === nodeObj.id;
                              const isHead = idx === 0;
                              
                              const isTargetNode = isSuccess && (isCurr || isMainPtr) && !notFound;
                              
                              const isTarget = isCurr || isTargetNode || isMainPtr || isRefPtr || isHead;
                              
                              let themeColor = 'slate';
                              if (isTargetNode) themeColor = 'emerald';
                              else if (checking && isCurr) themeColor = 'amber';
                              else if (isMainPtr || isRefPtr) themeColor = 'amber';
                              else if (isCurr) themeColor = activeTheme;

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "sky", position: "top" });
                              if (isCurr) labels.push({ text: selectedOpId === 'nthStartIter' ? "curr" : "head (local)", color: activeTheme, position: selectedOpId === 'nthStartIter' ? "bottom" : "top" });
                              if (isMainPtr) labels.push({ text: "main_ptr", color: "emerald", position: "top" });
                              if (isRefPtr) labels.push({ text: "ref_ptr", color: "amber", position: "bottom" });

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
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Nth Node Access</span>
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
                              const isCurr = currIdx === nodeObj.id;
                              const isRefPtr = refIdx === nodeObj.id;
                              const isMainPtr = mainIdx === nodeObj.id;
                              
                              const isTarget = isCurr || isRefPtr || isMainPtr;
                              
                              let themeColor = 'slate';
                              if (isCurr) themeColor = 'emerald';
                              if (isRefPtr) themeColor = 'amber';
                              if (isMainPtr) themeColor = 'sky';

                              const labels = [];
                              if (isCurr) labels.push({ text: "curr", color: "emerald", position: "bottom" });
                              if (isMainPtr) labels.push({ text: "main_ptr", color: "sky", position: "top" });
                              if (isRefPtr) labels.push({ text: "ref_ptr", color: "amber", position: "bottom" });

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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">NODE FOUND</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully accessed nth node</p>
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|GetNth|GetNthFromEnd|count|main_ptr|ref_ptr)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['GetNth', 'GetNthFromEnd'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['count', 'main_ptr', 'ref_ptr'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};
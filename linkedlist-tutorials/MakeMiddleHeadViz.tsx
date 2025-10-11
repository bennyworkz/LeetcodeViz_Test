import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, CornerUpLeft,
  GitCommit, MonitorPlay, ChevronLeft, ChevronRight, 
  Network, Database, RotateCcw, ListOrdered, FastForward,
  SplitSquareHorizontal, Zap, Scissors, AlertCircle, Goal, Info,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';

const OPERATIONS = {
  middleFastSlow: {
    id: 'middleFastSlow',
    title: 'Fast & Slow (1-Pass)',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node makeMiddleHead(Node head) {
    if (head == null || head.next == null) {
        return head;
    }
    
    Node prev = null;
    Node slow = head;
    Node fast = head;
    
    // Find middle and its previous node
    while (fast != null && fast.next != null) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 1. Detach middle node
    prev.next = slow.next;
    
    // 2. Move middle to front
    slow.next = head;
    
    // 3. Update head
    head = slow;
    
    return head;
}`,
    desc: "Uses the Tortoise and Hare algorithm. The 'fast' pointer moves twice as fast as 'slow'. When 'fast' reaches the end, 'slow' is exactly at the middle. We use a 'prev' pointer to easily detach the middle node."
  },
  middleTwoPass: {
    id: 'middleTwoPass',
    title: 'Two Passes (Naive)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public Node makeMiddleHead(Node head) {
    if (head == null || head.next == null) return head;
    
    // Pass 1: Count nodes
    int count = 0;
    Node curr = head;
    while (curr != null) {
        count++;
        curr = curr.next;
    }
    
    // Pass 2: Traverse to count / 2
    int mid = count / 2;
    Node prev = null;
    curr = head;
    for (int i = 0; i < mid; i++) {
        prev = curr;
        curr = curr.next;
    }
    
    // Rewire pointers
    prev.next = curr.next;
    curr.next = head;
    head = curr;
    
    return head;
}`,
    desc: "First, counts the total number of nodes to calculate the middle index. Then, traverses a second time to that exact index, detaches the node, and moves it to the front."
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
      <div className="flex items-center gap-3 mb-6 text-violet-600">
          <SplitSquareHorizontal size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Make Middle Node Head</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a singly linked list, find the <strong>middle node</strong> of the linked list and move it to the <strong>beginning</strong> of the linked list, making it the new head.
        </p>

        <ul className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 font-medium text-slate-700 list-none">
            <li className="flex items-center gap-3"><Info className="text-violet-500" size={18}/> <strong>Odd Length:</strong> If the list has 5 nodes, the 3rd node is the middle.</li>
            <li className="flex items-center gap-3"><Info className="text-violet-500" size={18}/> <strong>Even Length:</strong> If the list has 6 nodes, there are two middles (3rd and 4th). Standard convention dictates moving the <strong>second</strong> middle node (the 4th node).</li>
        </ul>

        <div className="space-y-6 pt-4">
           <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs border-b pb-2">Examples</h4>
           
           <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-emerald-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 1: Odd List</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-emerald-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded border border-emerald-200 text-xs">3 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 1 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 2 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 4 <ArrowRight size={12} className="mx-1 text-emerald-400"/> 5</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Node 3 is extracted and placed at the beginning.</p>
                   </div>
               </div>

               <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-4 font-mono text-sm shadow-sm">
                   <div className="flex font-black text-sky-800 uppercase tracking-widest text-[10px] items-center gap-2"><Goal size={14}/> Example 2: Even List</div>
                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <span className="text-slate-400 w-12 text-xs font-bold">Input:</span>
                           <div className="flex items-center text-slate-700 bg-white px-2 py-1 rounded border shadow-sm text-xs">1 <ArrowRight size={12} className="mx-1"/> 2 <ArrowRight size={12} className="mx-1"/> 3 <ArrowRight size={12} className="mx-1"/> 4 <ArrowRight size={12} className="mx-1"/> 5 <ArrowRight size={12} className="mx-1"/> 6</div>
                       </div>
                   </div>
                   <div className="pt-2 border-t border-sky-200/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold w-12">Output:</span> 
                          <div className="flex items-center text-sky-700 font-bold bg-sky-100 px-2 py-1 rounded border border-sky-200 text-xs">4 <ArrowRight size={12} className="mx-1 text-sky-400"/> 1 <ArrowRight size={12} className="mx-1 text-sky-400"/> 2 <ArrowRight size={12} className="mx-1 text-sky-400"/> 3 <ArrowRight size={12} className="mx-1 text-sky-400"/> 5 <ArrowRight size={12} className="mx-1 text-sky-400"/> 6</div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1">Node 4 (the second middle) is moved to the head.</p>
                   </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  </div>
);

const TheoryTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 mb-6 text-violet-600">
          <Database size={28} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theory: The 3-Step Extraction</h2>
      </div>
      
      <p className="text-slate-600 leading-relaxed text-lg">
          Unlike moving the tail to the front, moving a node from the <em>middle</em> requires us to bridge the gap it leaves behind. We must keep track of the middle node (<code>slow</code>) AND the node directly preceding it (<code>prev</code>).
      </p>

      <div className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl shrink-0"><Scissors size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">1. Detach & Bridge</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>prev.next = slow.next;</code></p>
                  <p className="text-xs text-slate-400 mt-2">We sever the middle node from the list by telling the previous node to bypass it entirely, bridging the left and right halves.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xl shrink-0"><CornerUpLeft size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">2. Wrap Middle to Front</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>slow.next = head;</code></p>
                  <p className="text-xs text-slate-400 mt-2">We take our detached middle node and point its <code>next</code> reference to the original beginning of the list.</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shrink-0"><Trophy size={20}/></div>
              <div>
                  <h3 className="font-black text-slate-800 mb-1">3. Reassign Head</h3>
                  <p className="text-sm text-slate-500 font-mono"><code>head = slow;</code></p>
                  <p className="text-xs text-slate-400 mt-2">The <code>head</code> variable is officially shifted to the former middle node. The operation is complete!</p>
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
           <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-violet-400 relative z-10 uppercase tracking-tight">
               <Trophy size={24} /> Interview Cheat Sheet
           </h3>
           <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 mb-6">
               "This problem elegantly combines two classic linked list algorithms: finding the middle node (Tortoise and Hare) and pointer rewiring. Using Fast & Slow pointers demonstrates mastery over linked list traversal."
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="p-5 rounded-2xl border bg-violet-900/40 border-violet-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-1">Fast & Slow (Optimal)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N/2) = O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-violet-200/70 leading-relaxed mt-2">Locates the middle in a single pass. Requires maintaining a 'prev' pointer alongside the 'slow' pointer to perform the O(1) extraction.</p>
               </div>
               <div className="p-5 rounded-2xl border bg-sky-900/40 border-sky-700/50 space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-sky-400 mb-1">Two Passes (Naive)</div>
                    <div className="text-xs text-slate-300"><strong>Time:</strong> O(N) + O(N/2) = O(N) <br/><strong>Space:</strong> O(1)</div>
                    <p className="text-[10px] text-sky-200/70 leading-relaxed mt-2">Traverses the list entirely to count the nodes, then traverses halfway again to extract. Valid, but interviewer will ask for a 1-pass solution.</p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 gap-6 mt-8">
           <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-rose-500"/> Critical Edge Cases
               </h4>
               <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5">
                   <li><strong>Empty or Single Node List:</strong> Check <code>if (head == null || head.next == null) return head;</code> immediately to avoid NullPointerExceptions.</li>
                   <li><strong>Two Node List:</strong> The fast/slow algorithm must correctly identify node 2 as the middle, and properly swap them without losing references.</li>
               </ul>
           </div>
       </div>
    </div>
);

// Advanced Coordinate Math for 2D Memory Grid
const generateNode = (val: number, id: number, nextId: number | null, index: number): ListNodeData => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    
    // Spread out horizontally and stagger vertically for clear SVG curves
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

export default function MakeMiddleHeadViz() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'overview' | 'theory' | 'interview'>('visualizer');
  const [selectedOpId, setSelectedOpId] = useState<keyof typeof OPERATIONS>('middleFastSlow');
  const [inputList, setInputList] = useState('10, 20, 30, 40, 50');
  
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
      const vals = inputList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
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

    const updateNextId = (targetId: number, newNextId: number | null) => {
        list = list.map(n => n.id === targetId ? {...n, nextId: newNextId} : n);
    };

    const addStep = (phase: string, desc: string, line: number, stateProps: any) => {
      steps.push({
        phase, description: desc, line, 
        state: { list: list.map(n=>({...n})), ...stateProps }
      });
    };

    if (selectedOpId === 'middleFastSlow') {
        let headIdx: number | null = list.length > 0 ? list[0].id : null;
        let prevIdx: number | null = null;
        let slowIdx: number | null = headIdx;
        let fastIdx: number | null = headIdx;
        let activeLinkId: number | null = null;
        
        addStep("Method Call", `makeMiddleHead(head) called.`, 1, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        addStep("Edge Case Check", `if (head == null || head.next == null)`, 2, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        
        if (list.length <= 1) {
            addStep("Return Immediately", `List has 1 or 0 nodes. No action needed.`, 3, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId, isSuccess: true });
            return steps;
        }

        addStep("Initialize Pointers", `Node prev = null; Node slow = head; Node fast = head;`, 6, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });

        while (fastIdx !== null && list.find(n=>n.id===fastIdx)?.nextId !== null) {
            let fastNode = list.find(n=>n.id===fastIdx);
            addStep("Loop Condition", `fast (${fastNode?.addr}) != null && fast.next != null`, 11, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
            
            prevIdx = slowIdx;
            addStep("Update prev", `prev = slow;`, 12, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
            
            let slowNode = list.find(n=>n.id===slowIdx);
            slowIdx = slowNode?.nextId ?? null;
            addStep("Advance slow (1x)", `slow = slow.next;`, 13, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
            
            let fastNext1 = fastNode?.nextId ?? null;
            fastIdx = fastNext1 !== null ? list.find(n=>n.id===fastNext1)?.nextId ?? null : null;
            addStep("Advance fast (2x)", `fast = fast.next.next;`, 14, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        }

        addStep("Loop Terminates", `fast hit the end. slow is currently at the exact middle!`, 11, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        
        // 1. Detach middle node
        if (prevIdx !== null && slowIdx !== null) {
            let slowNode = list.find(n=>n.id===slowIdx);
            let oldSlowNext = slowNode?.nextId ?? null;
            updateNextId(prevIdx, oldSlowNext);
            activeLinkId = prevIdx;
            addStep("1. Detach Middle", `prev.next = slow.next; We bridge the gap over the middle node.`, 18, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        }
        
        // 2. Move middle to front
        if (slowIdx !== null && headIdx !== null) {
            updateNextId(slowIdx, headIdx);
            activeLinkId = slowIdx;
            addStep("2. Move to Front", `slow.next = head; The detached middle node wraps around to point at the old head!`, 21, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        }
        
        // 3. Update head
        if (slowIdx !== null) {
            headIdx = slowIdx;
            activeLinkId = null;
            addStep("3. Reassign Head", `head = slow; The middle node is officially the new head.`, 24, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId });
        }

        addStep("Operation Complete", `Return new head.`, 26, { headIdx, prevIdx, slowIdx, fastIdx, activeLinkId, isSuccess: true });
    } 
    else if (selectedOpId === 'middleTwoPass') {
        let headIdx: number | null = list.length > 0 ? list[0].id : null;
        let count = 0;
        let currIdx: number | null = headIdx;
        let activeLinkId: number | null = null;
        
        addStep("Method Call", `makeMiddleHead(head) called.`, 1, { headIdx, currIdx, count, activeLinkId });
        addStep("Edge Case Check", `if (head == null || head.next == null)`, 2, { headIdx, currIdx, count, activeLinkId });
        
        if (list.length <= 1) {
            addStep("Return Immediately", `List has 1 or 0 nodes. No action needed.`, 2, { headIdx, currIdx, count, activeLinkId, isSuccess: true });
            return steps;
        }

        addStep("Pass 1: Initialize Count", `int count = 0; Node curr = head;`, 5, { headIdx, currIdx, count, activeLinkId });

        while (currIdx !== null) {
            let currNode = list.find(n=>n.id===currIdx);
            addStep("Pass 1: Loop Condition", `curr != null`, 7, { headIdx, currIdx, count, activeLinkId });
            count++;
            addStep("Pass 1: Increment Count", `count++ => ${count}`, 8, { headIdx, currIdx, count, activeLinkId });
            currIdx = currNode?.nextId ?? null;
            addStep("Pass 1: Advance curr", `curr = curr.next`, 9, { headIdx, currIdx, count, activeLinkId });
        }
        
        addStep("Pass 1 Ends", `We found ${count} total nodes.`, 7, { headIdx, currIdx, count, activeLinkId });

        let mid = Math.floor(count / 2);
        addStep("Calculate Mid", `int mid = count / 2 => ${count} / 2 = ${mid};`, 13, { headIdx, currIdx: null, count, mid, activeLinkId });
        
        let prevIdx: number | null = null;
        currIdx = headIdx;
        addStep("Pass 2: Reset Pointers", `Node prev = null; curr = head;`, 14, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
        
        for (let i = 0; i < mid; i++) {
            addStep("Pass 2: Loop", `i = ${i} < mid (${mid})`, 16, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
            prevIdx = currIdx;
            addStep("Update prev", `prev = curr`, 17, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
            
            let currNode = list.find(n=>n.id===currIdx);
            currIdx = currNode?.nextId ?? null;
            addStep("Advance curr", `curr = curr.next`, 18, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
        }
        
        addStep("Pass 2 Ends", `curr is now at the middle node!`, 16, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });

        // 1. Detach middle node
        if (prevIdx !== null && currIdx !== null) {
            let currNode = list.find(n=>n.id===currIdx);
            let oldCurrNext = currNode?.nextId ?? null;
            updateNextId(prevIdx, oldCurrNext);
            activeLinkId = prevIdx;
            addStep("1. Detach Middle", `prev.next = curr.next; We bridge the gap over the middle node.`, 22, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
        }
        
        // 2. Move middle to front
        if (currIdx !== null && headIdx !== null) {
            updateNextId(currIdx, headIdx);
            activeLinkId = currIdx;
            addStep("2. Move to Front", `curr.next = head; The detached middle node wraps around!`, 23, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
        }
        
        // 3. Update head
        if (currIdx !== null) {
            headIdx = currIdx;
            activeLinkId = null;
            addStep("3. Reassign Head", `head = curr; The middle node is officially the new head.`, 24, { headIdx, currIdx, prevIdx, count, mid, activeLinkId });
        }

        addStep("Operation Complete", `Return new head.`, 26, { headIdx, currIdx, prevIdx, count, mid, activeLinkId, isSuccess: true });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click play to simulate.', line: 1, state: { list: baseList } });
    return steps;
  }, [baseList, selectedOpId]);

  useEffect(() => { setCurrentStep(0); }, [selectedOpId, inputList]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => { setCurrentStep(0); setPan({x:0, y:0}); setZoom(1); };

  const handleApply = () => {
     const finalState = trace[trace.length - 1].state;
     if (finalState && finalState.list && finalState.isSuccess && finalState.list.length > 1) {
         // Keep physical array elements unchanged, but logical order is updated via nextIds
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

  const cur = trace[currentStep] || trace[0] || { state: { list: baseList } };
  const state = cur.state || { list: baseList };
  
  const { 
      isSuccess, headIdx, currIdx, prevIdx, slowIdx, fastIdx, count, mid, activeLinkId
  } = state;

  const getThemeColor = () => selectedOpId === 'middleFastSlow' ? 'violet' : 'sky';
  const activeTheme = getThemeColor();

  // SVG Drawing function
  const renderSvgArrows = () => {
    return state.list.map((nodeObj: ListNodeData) => {
        if (nodeObj.nextId === null) return null;
        
        const target = state.list.find((n: ListNodeData) => n.id === nodeObj.nextId);
        if (!target) return null;

        // Origin point: center of the "NEXT" box
        const startX = nodeObj.x + 92; 
        const startY = nodeObj.y + 28; 

        // Destination point: left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = activeLinkId === nodeObj.id;
        const strokeColor = isActive ? '#f59e0b' : '#94a3b8'; // amber-500 or slate-400
        const strokeWidth = isActive ? 4 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Different row (Wrap around logic)
            if (diffX < 0) {
                 pathD = `M ${startX},${startY} C ${startX + 60},${startY + 40} ${endX - 60},${endY - 40} ${endX},${endY}`;
            } else {
                 pathD = `M ${startX},${startY} C ${startX + 80},${startY + (diffY/2)} ${endX - 80},${endY - (diffY/2)} ${endX},${endY}`;
            }
        } else {
            // Same row
            if (diffX < 0) {
                 // Wrapping backwards to earlier node (Move to Front)
                 pathD = `M ${startX},${startY} C ${startX + 30},${startY - 80} ${endX - 30},${endY - 80} ${endX},${endY}`;
            } else if (diffX > 200) {
                 // Forward jump over nodes (Bypassing the middle)
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
                markerEnd={marker} 
                className={`transition-all duration-500 ease-in-out ${isActive ? 'animate-pulse' : ''}`} 
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
              <SplitSquareHorizontal size={100} />
          </div>
          <div className="flex items-center gap-5 z-10">
            <div className={`bg-${activeTheme}-600 p-4 rounded-2xl shadow-lg shadow-${activeTheme}-100 flex items-center justify-center transition-colors duration-500`}>
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Make Middle Node Head</h1>
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
                        let btnColor = op.id === 'middleFastSlow' ? 'violet' : 'sky';
                        
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
                  <div className="p-4 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-amber-500/20 border-amber-500' : `bg-${activeTheme}-500/20 border-${activeTheme}-500`}`} style={{ top: `${((cur.line - 1) * 18) + 16}px`, height: '18px' }} />
                      )}
                      
                      {selectedOp.code.split('\n').map((line: string, idx: number) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={isSuccess && cur.line === idx + 1 ? 'amber' : activeTheme} />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? `bg-amber-900 border-amber-800` : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Activity size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-amber-400" : `text-${activeTheme}-400`}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : `bg-${activeTheme}-500/20 text-${activeTheme}-300 border-${activeTheme}-500/30`} border`}>Line {cur.line}</div>
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
                              <Network size={16} className={activeTheme === 'sky' ? 'text-sky-500' : 'text-violet-500'}/> Memory Canvas
                          </span>
                      </div>
                      
                      <div className="flex gap-2 pointer-events-auto">
                          {selectedOpId === 'middleTwoPass' && count !== undefined && (
                              <div className="bg-white/90 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-3 py-1.5 rounded-lg shadow-sm backdrop-blur">
                                  count: {count}
                              </div>
                          )}
                          {selectedOpId === 'middleTwoPass' && mid !== undefined && (
                              <div className="bg-white/90 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-3 py-1.5 rounded-lg shadow-sm backdrop-blur">
                                  mid: {mid}
                              </div>
                          )}
                          {isSuccess && state.list.length > 1 && (
                              <button onClick={handleApply} className="text-[10px] font-black bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 uppercase tracking-widest flex items-center gap-1 transition-colors shadow-lg">
                                  <Check size={14}/> Confirm Restructure
                              </button>
                          )}
                      </div>
                   </div>

                   {/* Fixed Zoom Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={resetZoom} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                   </div>

                   {/* Interactive Canvas */}
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
                              const isHead = headIdx === nodeObj.id;
                              
                              const isPrev = prevIdx === nodeObj.id;
                              const isSlow = slowIdx === nodeObj.id;
                              const isFast = fastIdx === nodeObj.id;
                              const isCurr = currIdx === nodeObj.id;
                              
                              const isTarget = isHead || isPrev || isSlow || isFast || isCurr;
                              
                              let themeColor = 'slate';
                              if (isSlow) themeColor = 'emerald';
                              else if (isFast) themeColor = 'rose';
                              else if (isPrev) themeColor = 'amber';
                              else if (isCurr) themeColor = 'sky';

                              const labels = [];
                              if (isHead) labels.push({ text: "head", color: "emerald", position: "top" });
                              if (isPrev) labels.push({ text: "prev", color: "amber", position: "bottom" });
                              if (isSlow) labels.push({ text: "slow", color: "emerald", position: "top" });
                              if (isFast) labels.push({ text: "fast", color: "rose", position: "bottom" });
                              
                              if (isCurr) labels.push({ text: "curr", color: "sky", position: "top" });

                              return (
                                  <div key={nodeObj.id} className="absolute transition-all duration-300 z-10" style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} offset={(isSlow && isHead) ? -24 : 0} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} offset={(isFast && isPrev) ? -24 : 0} />
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
                          
                          {/* Trailing Null Pointers */}
                          {state.list.length > 0 && (
                               <div className="absolute transition-all duration-300 z-10" style={{ left: state.list[state.list.length-1].x + 220, top: state.list[state.list.length-1].y }}>
                                   {currIdx === null && selectedOpId === 'middleTwoPass' && <PointerLabel label="curr" color="sky" position="top" active={true} offset={0} />}
                                   {fastIdx === null && selectedOpId === 'middleFastSlow' && <PointerLabel label="fast" color="rose" position="bottom" active={true} offset={0} />}
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

const ListNodeBlock: React.FC<ListNodeBlockProps> = ({ val, address, nextAddr, themeColor = 'slate', isTarget }) => {
    return null; // Rendered inline in parent to handle dynamic absolute positioning & labels
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|println|static|makeMiddleHead)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['makeMiddleHead'].includes(part)) return <span key={i} className={`text-${theme}-400 font-bold`}>{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-orange-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-emerald-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};